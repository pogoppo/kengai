import { PUBLIC_SITE_URL } from '$env/static/public';
import { m } from '$lib/paraglide/messages';
import { absoluteUrl } from '$lib/utils/url';
import { categoryLabel } from '$lib/utils/category';
import type { ArticleSummary } from '$lib/types/article';
import type { FaqSection } from '$lib/types/faq';

const DEFAULT_OG_IMAGE = '/images/app/og-default.webp';
const SITE_LOGO = '/images/app/app-icon-512.webp';
const SITE_LANGUAGE = 'ja';

export type StructuredData = Record<string, unknown>;

export function stripHtml(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, ' ')
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/gi, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();
}

export function organizationSchema(): StructuredData {
	return {
		'@type': 'Organization',
		name: m['app.name'](),
		url: PUBLIC_SITE_URL.replace(/\/+$/, ''),
		logo: {
			'@type': 'ImageObject',
			url: absoluteUrl(SITE_LOGO)
		}
	};
}

export function websiteSchema(): StructuredData[] {
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: m['app.name'](),
			description: m['app.description'](),
			url: PUBLIC_SITE_URL.replace(/\/+$/, ''),
			inLanguage: SITE_LANGUAGE,
			publisher: organizationSchema()
		},
		{
			'@context': 'https://schema.org',
			...organizationSchema()
		}
	];
}

export interface BreadcrumbSchemaItem {
	label: string;
	/** 省略時は現在地とみなし item を持たない項目になる */
	href?: string;
}

export function breadcrumbSchema(items: BreadcrumbSchemaItem[]): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.label,
			...(item.href ? { item: absoluteUrl(item.href) } : {})
		}))
	};
}

export interface ArticleSchemaOptions {
	/** 記事ページのパス (例: /article/rope-work/bowline-knot) */
	path: string;
}

export function articleSchema(
	article: ArticleSummary,
	{ path }: ArticleSchemaOptions
): StructuredData {
	const url = absoluteUrl(path);

	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		description: article.description,
		image: absoluteUrl(article.thumbnail ?? DEFAULT_OG_IMAGE),
		url,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': url
		},
		articleSection: categoryLabel(article.category),
		inLanguage: SITE_LANGUAGE,
		author: organizationSchema(),
		publisher: organizationSchema(),
		...(article.tags.length > 0 ? { keywords: article.tags } : {}),
		...(article.date ? { datePublished: article.date } : {}),
		...(article.updated ? { dateModified: article.updated } : {})
	};
}

export interface CollectionPageSchemaOptions {
	name: string;
	description: string;
	/** 一覧ページのパス (例: /category/rope-work) */
	path: string;
	articles: ArticleSummary[];
}

export function collectionPageSchema({
	name,
	description,
	path,
	articles
}: CollectionPageSchemaOptions): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name,
		description,
		url: absoluteUrl(path),
		inLanguage: SITE_LANGUAGE,
		isPartOf: {
			'@type': 'WebSite',
			name: m['app.name'](),
			url: PUBLIC_SITE_URL.replace(/\/+$/, '')
		},
		mainEntity: {
			'@type': 'ItemList',
			numberOfItems: articles.length,
			itemListElement: articles.map((article, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				name: article.title,
				url: absoluteUrl(`/article/${article.category}/${article.slug}`)
			}))
		}
	};
}

export function faqSchema(sections: FaqSection[]): StructuredData {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: SITE_LANGUAGE,
		mainEntity: sections.flatMap((section) =>
			section.items.map((item) => ({
				'@type': 'Question',
				name: item.summary,
				acceptedAnswer: {
					'@type': 'Answer',
					text: stripHtml(item.content)
				}
			}))
		)
	};
}
