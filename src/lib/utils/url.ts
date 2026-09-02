import { PUBLIC_SITE_URL } from '$env/static/public';

/**
 * 相対パスをサイトオリジン付きの絶対URLに変換する
 * 既に絶対URLの場合はそのまま返す
 */
export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) {
		return path;
	}

	const origin = PUBLIC_SITE_URL.replace(/\/+$/, '');
	return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
