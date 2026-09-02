import type { RequestHandler } from './$types';
import { groups } from '$lib/data/groups';
import { articleRepository } from '$lib/repositories/article';
import { absoluteUrl } from '$lib/utils/url';

export const prerender = true;

interface SitemapEntry {
	path: string;
	lastmod?: string;
	changefreq: 'daily' | 'weekly' | 'monthly';
	priority: string;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function createEntries(): SitemapEntry[] {
	const articles = articleRepository.findAll();

	return [
		{ path: '/', changefreq: 'weekly', priority: '1.0' },
		{ path: '/faq', changefreq: 'monthly', priority: '0.5' },
		...groups.map((group): SitemapEntry => {
			return { path: `/group/${group.slug}`, changefreq: 'weekly', priority: '0.8' };
		}),
		...articleRepository.getAllCategories().map((category): SitemapEntry => {
			return { path: `/category/${category}`, changefreq: 'weekly', priority: '0.8' };
		}),
		...articles.map((article): SitemapEntry => {
			return {
				path: `/article/${article.category}/${article.slug}`,
				lastmod: article.updated ?? article.date,
				changefreq: 'monthly',
				priority: '0.7'
			};
		})
	];
}

export const GET: RequestHandler = () => {
	const entries = createEntries()
		.map((entry) => {
			const lastmod = entry.lastmod ? `\n\t\t<lastmod>${entry.lastmod}</lastmod>` : '';
			return [
				'\t<url>',
				`\t\t<loc>${escapeXml(absoluteUrl(entry.path))}</loc>${lastmod}`,
				`\t\t<changefreq>${entry.changefreq}</changefreq>`,
				`\t\t<priority>${entry.priority}</priority>`,
				'\t</url>'
			].join('\n');
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
