import type { ArticleSummary } from '#lib/types/article.js';

/**
 * 記事を一意に特定するキー（`{category}/{slug}`）
 */
export function toArticleKey({
	category,
	slug
}: Pick<ArticleSummary, 'category' | 'slug'>): string {
	return `${category}/${slug}`;
}

/**
 * 記事ページのパスから記事キーを取り出す
 */
export function pathnameToArticleKey(pathname: string): string {
	const [, , category = '', slug = ''] = pathname.split('/');
	return toArticleKey({ category, slug });
}
