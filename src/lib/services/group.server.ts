import type { GroupWithArticles } from '$lib/types/group';
import { groups } from '$lib/data/groups';
import { articleRepository } from '$lib/repositories/article';

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
		const slugs = section.articles.map((articleRef) => articleRef.slug);
		return {
			category: section.category,
			articles: articleRepository.findBySlugs(slugs)
		};
	});

	return {
		...groupData,
		sections: sectionsWithArticles
	};
};
