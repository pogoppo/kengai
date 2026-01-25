import { describe, it, expect, beforeEach } from 'vitest';
import { ArticleRepository } from './article';
import type { ArticleSummary } from '$lib/types/article';

describe('ArticleRepository', () => {
  let repository: ArticleRepository;

  const mockArticles: ArticleSummary[] = [
    {
      slug: 'tech/article-1',
      title: 'Tech Article 1',
      description: 'First tech article about javascript',
      tags: ['javascript', 'web'],
      category: 'tech'
    },
    {
      slug: 'tech/article-2',
      title: 'Tech Article 2',
      description: 'Second tech article about typescript',
      tags: ['typescript', 'web'],
      category: 'tech'
    },
    {
      slug: 'life/article-3',
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

  describe('findBySlug', () => {
    it('スラッグが一致する場合、記事を返すこと', () => {
      const result = repository.findBySlug('tech/article-1');
      expect(result).toEqual(mockArticles[0]);
    });

    it('スラッグが一致しない場合、undefinedを返すこと', () => {
      const result = repository.findBySlug('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('findBySlugs', () => {
    it('スラッグのリストに一致する記事を返すこと', () => {
      const slugs = ['tech/article-1', 'life/article-3'];
      const result = repository.findBySlugs(slugs);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(mockArticles[0]);
      expect(result).toContainEqual(mockArticles[2]);
    });

    it('存在しないスラッグを無視すること', () => {
      const slugs = ['tech/article-1', 'non-existent'];
      const result = repository.findBySlugs(slugs);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockArticles[0]);
    });
  });

  describe('findByCategory', () => {
    it('指定されたカテゴリの記事を返すこと', () => {
      const result = repository.findByCategory('tech');
      expect(result).toHaveLength(2);
      expect(result.map(a => a.slug)).toEqual(['tech/article-1', 'tech/article-2']);
    });

    it('存在しないカテゴリの場合、空の配列を返すこと', () => {
      const result = repository.findByCategory('non-existent');
      expect(result).toEqual([]);
    });
  });

  describe('findByTag', () => {
    it('指定されたタグを持つ記事を返すこと', () => {
      const result = repository.findByTag('web');
      expect(result).toHaveLength(2);
      expect(result.map(a => a.slug)).toEqual(['tech/article-1', 'tech/article-2']);
    });

    it('存在しないタグの場合、空の配列を返すこと', () => {
      const result = repository.findByTag('non-existent');
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

  describe('getAllTags', () => {
    it('すべてのユニークなタグを返すこと', () => {
      const result = repository.getAllTags();
      expect(result).toHaveLength(5);
      expect(result).toContain('javascript');
      expect(result).toContain('typescript');
      expect(result).toContain('web');
      expect(result).toContain('outdoor');
      expect(result).toContain('camping');
    });
  });

  describe('search', () => {
    it('クエリが空の場合、すべての記事を返すこと', () => {
      const result = repository.search('');
      expect(result).toHaveLength(3);
    });

    it('タイトルであいまい検索を行うこと', () => {
      const result = repository.search('Tech');
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result).toEqual(expect.arrayContaining([mockArticles[0], mockArticles[1]]));
    });

    it('説明文であいまい検索を行うこと', () => {
      const result = repository.search('outdoor');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockArticles[2]);
    });
  });

  describe('filter', () => {
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
  });
});
