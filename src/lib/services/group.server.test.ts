import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGroupWithArticles, GroupServiceError } from './group.server';
import type { ArticleSummary } from '#lib/types/article.js';
import { articleRepository } from '#lib/repositories/article.js';

// モック
vi.mock('#lib/repositories/article.js', () => ({
	articleRepository: {
		findByKeys: vi.fn()
	}
}));

vi.mock('#lib/data/groups/index.json', () => ({
	default: [
		{
			slug: 'test-group',
			sections: [
				{
					category: 'test-cat',
					articles: [{ slug: 'art1' }, { slug: 'art2' }]
				}
			]
		}
	]
}));

describe('getGroupWithArticles', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('グループが存在する場合、記事データを含むグループ情報を返すこと', () => {
		// Arrange
		const mockArticles: ArticleSummary[] = [
			{ slug: 'art1', title: 'Article 1', description: 'Desc 1', category: 'test-cat', tags: [] },
			{ slug: 'art2', title: 'Article 2', description: 'Desc 2', category: 'test-cat', tags: [] }
		];
		vi.mocked(articleRepository.findByKeys).mockReturnValue(mockArticles);

		// Act
		const result = getGroupWithArticles('test-group');

		// Assert
		expect(result.slug).toBe('test-group');
		expect(result.sections[0].articles).toEqual(mockArticles);
		expect(articleRepository.findByKeys).toHaveBeenCalledWith(['test-cat/art1', 'test-cat/art2']);
	});

	it('グループが存在しない場合、NOT_FOUNDエラーを投げること', () => {
		// Act & Assert
		expect(() => getGroupWithArticles('non-existent')).toThrow(
			new GroupServiceError('NOT_FOUND', 'Group not found')
		);
	});
});
