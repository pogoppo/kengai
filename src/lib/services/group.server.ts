import type { GroupWithArticles } from '#lib/types/group.js';
import { groups } from '#lib/data/groups/index.js';
import { articleRepository } from '#lib/repositories/article.js';
import { toArticleKey } from '#lib/utils/article.js';

export class GroupServiceError extends Error {
	constructor(
		public code: 'NOT_FOUND' | 'INTERNAL_ERROR',
		message: string
	) {
		super(message);
		this.name = 'GroupServiceError';
	}
}

export const getGroupWithArticles = (slug: string): GroupWithArticles => {
	const groupData = groups.find((group) => group.slug === slug);

	if (!groupData) {
		throw new GroupServiceError('NOT_FOUND', 'Group not found');
	}

	// 記事一覧のslugを実際の記事データに変換
	const sectionsWithArticles = groupData.sections.map((section) => {
		const keys = section.articles.map(({ slug }) =>
			toArticleKey({ category: section.category, slug })
		);
		return {
			category: section.category,
			articles: articleRepository.findByKeys(keys)
		};
	});

	return {
		...groupData,
		sections: sectionsWithArticles
	};
};
