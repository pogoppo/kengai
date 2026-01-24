/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, prerendered, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `kengai-v${version}`;

const ASSETS = [
	...build,      // JS, CSSなどのビルドされたアセット
	...files,      // `static` ディレクトリ内のファイル
	...prerendered // 事前レンダリングされたページ
];

// インストール時に静的アセットをキャッシュ
self.addEventListener('install', (event) => {
	console.log('Service Worker: Installing');

	async function addFilesToCache() {
		const cache = await caches.open(CACHE_NAME);
		await Promise.allSettled(
			ASSETS.map((asset) => cache.add(asset))
		);
	}

	event.waitUntil(addFilesToCache());

	// インストール後すぐに有効化
	self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
	console.log('Service Worker: Activating');

	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE_NAME) {
				await caches.delete(key);
			}
		}
	}

	event.waitUntil(deleteOldCaches());

	// 有効化後すぐにクライアントを制御
	self.clients.claim();
});

// リクエストを処理
self.addEventListener('fetch', (event) => {
	const request = event.request;

	// GETリクエスト以外は無視
	if (request.method !== 'GET') {
		return;
	}

	async function respond() {
		const cache = await caches.open(CACHE_NAME);

		// 1. キャッシュから提供 (Cache First)
		const url = new URL(request.url);
		url.search = '';
		const requestWithoutQuery = new Request(url.toString(), {
			method: request.method,
			headers: request.headers,
			// body, mode, credentials, etc. はGETなので不要
		});
		const cacheResponse = await cache.match(requestWithoutQuery);
		if (cacheResponse) {
			return cacheResponse;
		}

		// 2. ネットワークから取得してキャッシュに保存
		try {
			const networkResponse = await fetch(request);
			if (networkResponse.ok) {
				// 同一オリジンのみキャッシュ
				if (request.url.startsWith(self.location.origin)) {
					event.waitUntil(cache.put(request, networkResponse.clone()));
				}
			}
			return networkResponse;
		} catch (error) {
			return new Response(`Network error: ${error}`, {
				status: 408,
				headers: { 'Content-Type': 'text/plain' }
			});
		}
	}

	event.respondWith(respond());
});
