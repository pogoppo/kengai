import type { RequestHandler } from './$types';
import { absoluteUrl } from '$lib/utils/url';

export const prerender = true;

/**
 * サイト全体をクロール拒否するか
 */
const IS_PRIVATE = true;

const DISALLOW_PATHS = ['/search', '/favorite'];

export const GET: RequestHandler = () => {
	const lines = [
		'User-agent: *',
		'',
		...(IS_PRIVATE ? ['# 未公開のためサイト全体を拒否', 'Disallow: /', ''] : []),
		...DISALLOW_PATHS.map((path) => `Disallow: ${path}`),
		'',
		`Sitemap: ${absoluteUrl('/sitemap.xml')}`,
		''
	];

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
