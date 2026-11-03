import { self } from '$app/service-worker';
import { version } from '$app/env';
import { immutable, assets, prerendered } from '$app/manifest';

// キャッシュのキー
const CACHE_NAME = `kengai-v${version}`;
// `$app/manifest` のパスはベースパスからの相対なので、スコープ基準の絶対URLに変換
// （トップページは `''` のため、単純な相対パスだとService Worker自身のURLになってしまう）
const toUrl = ({ path }: { path: string }) => new URL(path, self.registration.scope).href;
// キャッシュ対象
const ASSETS = [
	...immutable.map(toUrl), // JS, CSSなどのビルドされたアセット
	...assets.map(toUrl), // `static` ディレクトリ内のファイル
	...prerendered.map(toUrl) // 事前レンダリングされたページ
];

/////////////////////////////////////////////////////////////////////
// インストール時の処理
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
	if (!(await caches.has(CACHE_NAME))) {
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
