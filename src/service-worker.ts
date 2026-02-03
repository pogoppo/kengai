/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, prerendered, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

// キャッシュのキー
const CACHE_NAME = `kengai-v${version}`;
// キャッシュ対象
const ASSETS = [
	...build, // JS, CSSなどのビルドされたアセット
	...files, // `static` ディレクトリ内のファイル
	...prerendered // 事前レンダリングされたページ
];

/////////////////////////////////////////////////////////////////////
// インストール時の処理
// 備考: Svelte Kitでは自動登録のこのファイルでのみ`$service-worker`が扱える
/////////////////////////////////////////////////////////////////////

// キャッシュにASSETSのファイルを追加
async function addFilesToCache() {
	const cache = await caches.open(CACHE_NAME);
	await Promise.allSettled(ASSETS.map((asset) => cache.add(asset)));
}

self.addEventListener('install', (event) => {
	event.waitUntil(addFilesToCache().then(() => self.skipWaiting()));
});

/////////////////////////////////////////////////////////////////////
// 有効化時の処理
/////////////////////////////////////////////////////////////////////

// 古いキャッシュを削除
async function deleteOldCaches() {
	for (const key of await caches.keys()) {
		if (key !== CACHE_NAME) {
			await caches.delete(key);
		}
	}
}

self.addEventListener('activate', (event) => {
	event.waitUntil(deleteOldCaches().then(() => self.clients.claim()));
});

///////////////////////////////////////////////////////////////////
// リクエストを処理
///////////////////////////////////////////////////////////////////

// キャッシュを検索
async function findCache(request: Request): Promise<Response | null> {
	// キャッシュの存在を確認
	// `caches.open()`すると存在しない場合に新規作成されてしまうため
	const cacheExists = (await caches.keys()).includes(CACHE_NAME);
	if (!cacheExists) {
		return null;
	}

	const cache = await caches.open(CACHE_NAME);
	const url = new URL(request.url);
	url.search = '';
	const requestWithoutQuery = new Request(url.toString(), {
		method: request.method,
		headers: request.headers
	});
	const cacheResponse = await cache.match(requestWithoutQuery);
	return cacheResponse || null;
}

self.addEventListener('fetch', (event) => {
	const request = event.request;

	// GETリクエスト以外は無視
	if (request.method !== 'GET') {
		return;
	}

	async function respond() {
		// キャッシュから提供 (Cache First)
		const cacheResponse = await findCache(request);
		if (cacheResponse) {
			return cacheResponse;
		}

		return fetch(request);
	}

	event.respondWith(respond());
});
