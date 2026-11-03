import { describe, it, expect, beforeEach } from 'vitest';
import { ArticleRepository } from './article';
import type { ArticleSummary } from '#lib/types/article.js';

describe('ArticleRepository', () => {
	let repository: ArticleRepository;

	const mockArticles: ArticleSummary[] = [
		{
			slug: 'article-1',
			title: 'Tech Article 1',
			description: 'First tech article about javascript',
			tags: ['javascript', 'web'],
			category: 'tech'
		},
		{
			slug: 'article-2',
			title: 'Tech Article 2',
			description: 'Second tech article about typescript',
			tags: ['typescript', 'web'],
			category: 'tech'
		},
		{
			slug: 'article-3',
			title: 'Life Article 1',
			description: 'Article about life and outdoor',
			tags: ['outdoor', 'camping'],
			category: 'life'
		}
	];

	beforeEach(() => {
		repository = new ArticleRepository(mockArticles);
	});

	describe('findAll', () => {
		it('すべての記事を返すこと', () => {
			const result = repository.findAll();
			expect(result).toHaveLength(3);
			expect(result).toEqual(mockArticles);
		});
	});

	describe('find', () => {
		it('カテゴリとスラッグが一致する場合、記事を返すこと', () => {
			const result = repository.find('tech', 'article-1');
			expect(result).toEqual(mockArticles[0]);
		});

		it('スラッグが一致しない場合、undefinedを返すこと', () => {
			const result = repository.find('tech', 'non-existent');
			expect(result).toBeUndefined();
		});

		it('スラッグが一致してもカテゴリが異なる場合、undefinedを返すこと', () => {
			const result = repository.find('life', 'article-1');
			expect(result).toBeUndefined();
		});

		it('カテゴリが異なれば同じスラッグの記事を区別できること', () => {
			const sameSlugArticle: ArticleSummary = { ...mockArticles[2], slug: 'article-1' };
			const repo = new ArticleRepository([mockArticles[0], sameSlugArticle]);
			expect(repo.find('tech', 'article-1')).toEqual(mockArticles[0]);
			expect(repo.find('life', 'article-1')).toEqual(sameSlugArticle);
		});
	});

	describe('findByKeys', () => {
		it('記事キーのリストに一致する記事を返すこと', () => {
			const keys = ['tech/article-1', 'life/article-3'];
			const result = repository.findByKeys(keys);
			expect(result).toHaveLength(2);
			expect(result).toContainEqual(mockArticles[0]);
			expect(result).toContainEqual(mockArticles[2]);
		});

		it('存在しない記事キーを無視すること', () => {
			const keys = ['tech/article-1', 'tech/non-existent', 'article-3'];
			const result = repository.findByKeys(keys);
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[0]);
		});
	});

	describe('findByCategory', () => {
		it('指定されたカテゴリの記事を返すこと', () => {
			const result = repository.findByCategory('tech');
			expect(result).toHaveLength(2);
			expect(result.map((a) => a.slug)).toEqual(['article-1', 'article-2']);
		});

		it('存在しないカテゴリの場合、空の配列を返すこと', () => {
			const result = repository.findByCategory('non-existent');
			expect(result).toEqual([]);
		});
	});

	describe('getAllCategories', () => {
		it('すべてのユニークなカテゴリを返すこと', () => {
			const result = repository.getAllCategories();
			expect(result).toHaveLength(2);
			expect(result).toContain('tech');
			expect(result).toContain('life');
		});
	});

	describe('filter', () => {
		it('条件が空の場合、すべての記事を返すこと', () => {
			const result = repository.filter({ query: '' });
			expect(result).toHaveLength(3);
		});

		it('空白のみのクエリの場合、すべての記事を返すこと', () => {
			const result = repository.filter({ query: '　 ' });
			expect(result).toHaveLength(3);
		});

		it('タイトルであいまい検索を行うこと', () => {
			const result = repository.filter({ query: 'Tech' });
			expect(result.length).toBeGreaterThanOrEqual(2);
			expect(result).toEqual(expect.arrayContaining([mockArticles[0], mockArticles[1]]));
		});

		it('クエリでフィルタリングすること', () => {
			const result = repository.filter({ query: 'outdoor' });
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[2]);
		});

		it('カテゴリでフィルタリングすること', () => {
			const result = repository.filter({ category: 'tech' });
			expect(result).toHaveLength(2);
		});

		it('タグでフィルタリングすること', () => {
			const result = repository.filter({ tags: ['javascript'] });
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[0]);
		});

		it('複数の条件でフィルタリングすること', () => {
			const result = repository.filter({ category: 'tech', query: 'First' });
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[0]);
		});

		it('カテゴリとタグのフィルタを組み合わせること', () => {
			const result = repository.filter({ category: 'tech', tags: ['javascript', 'camping'] });
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[0]);
		});

		it('クエリ内のハッシュタグをタグとして抽出してフィルタリングすること', () => {
			const result = repository.filter({ query: '#javascript' });
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[0]);
		});

		it('クエリ内の複数のハッシュタグを抽出すること', () => {
			// tags: ['javascript', 'camping'] (OR condition)
			const result = repository.filter({ query: '#javascript #camping' });
			expect(result).toHaveLength(2);
			expect(result).toEqual(expect.arrayContaining([mockArticles[0], mockArticles[2]]));
		});

		it('ハッシュタグと検索キーワードを組み合わせること', () => {
			// tags: ['web'], query: 'Second'
			// 'web' tag exists in article-1 and article-2
			// 'Second' keyword exists in article-2
			const result = repository.filter({ query: '#web Second' });
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual(mockArticles[1]);
		});

		it('既存のタグフィルタとハッシュタグをマージすること', () => {
			// query='#javascript', tags=['camping'] -> tags=['javascript', 'camping']
			const result = repository.filter({ query: '#javascript', tags: ['camping'] });
			expect(result).toHaveLength(2);
			expect(result).toEqual(expect.arrayContaining([mockArticles[0], mockArticles[2]]));
		});
	});
});
