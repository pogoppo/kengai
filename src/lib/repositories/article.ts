import Fuse from 'fuse.js';
import { articles } from '$lib/data/articles/ja';
import type { Article } from '$lib/types/article';

export class ArticleRepository {
  // Fuse.jsインスタンス
  private _fuse: Fuse<Article> | null = null;
  private get fuse(): Fuse<Article> {
    // 遅延初期化
    if (!this._fuse) {
      this._fuse = new Fuse(this.articles, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'description', weight: 1 },
          { name: 'tags', weight: 1.5 }
        ],
        threshold: 0.4, // 0=完全一致, 1=すべてマッチ
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true
      });
    }

    return this._fuse;
  }

  private articles: Article[];

  constructor(articles: Article[]) {
    this.articles = articles;
  }

  /**
   * 全記事を取得
   */
  findAll(): Article[] {
    return this.articles;
  }

  /**
   * カテゴリで記事を絞り込む
   */
  findByCategory(category: string): Article[] {
    return this.articles.filter((article) => article.category === category);
  }

  /**
   * タグで記事を絞り込む
   */
  findByTag(tag: string): Article[] {
    return this.articles.filter((article) => article.tags?.includes(tag));
  }

  /**
   * 全カテゴリのリストを取得
   */
  getAllCategories(): string[] {
    return [...new Set(this.articles.map((article) => article.category).filter(Boolean))];
  }

  /**
   * 全タグのリストを取得
   */
  getAllTags(): string[] {
    return [...new Set(this.articles.flatMap((article) => article.tags || []))];
  }

  /**
   * キーワードであいまい検索
   */
  search(query: string): Article[] {
    if (!query.trim()) return this.articles;

    return this.fuse
      .search(query)
      .map((result) => result.item);
  }

  /**
   * 複数の条件で記事を検索・絞り込む
   */
  filter(filters: { query?: string; category?: string; tags?: string[] }): Article[] {
    let results = filters.query ? this.search(filters.query) : this.articles;

    if (filters.category) {
      results = results.filter((article) => article.category === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((article) =>
        filters.tags!.some((tag) => article.tags?.includes(tag))
      );
    }

    return results;
  }
}

export const articleRepository = new ArticleRepository(articles);
