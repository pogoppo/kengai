import Fuse from 'fuse.js';
import { articles } from '$lib/data/articles/ja';
import type { ArticleSummary } from '$lib/types/article';

export class ArticleRepository {
  // Fuse.jsインスタンス（遅延初期化）
  private _fuse: Fuse<ArticleSummary> | null = null;
  private get fuse(): Fuse<ArticleSummary> {
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

  private articles: ArticleSummary[];
  private slugIndex: Map<string, ArticleSummary>;
  private categoryIndex: Map<string, ArticleSummary[]>;
  private tagIndex: Map<string, ArticleSummary[]>;

  constructor(articles: ArticleSummary[]) {
    this.articles = articles;

    // slugインデックスを構築
    this.slugIndex = new Map(articles.map((article) => [article.slug, article]));

    // categoryインデックスを構築
    this.categoryIndex = new Map();
    for (const article of articles) {
      if (!this.categoryIndex.has(article.category)) {
        this.categoryIndex.set(article.category, []);
      }
      this.categoryIndex.get(article.category)!.push(article);
    }

    // tagインデックスを構築
    this.tagIndex = new Map();
    for (const article of articles) {
      for (const tag of article.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, []);
        }
        this.tagIndex.get(tag)!.push(article);
      }
    }
  }

  /**
   * 全記事を取得
   */
  findAll(): ArticleSummary[] {
    return this.articles;
  }

  /**
   * slugで記事を取得
   */
  findBySlug(slug: string): ArticleSummary | undefined {
    return this.slugIndex.get(slug);
  }

  /**
   * 複数のslugで記事を取得
   */
  findBySlugs(slugs: string[]): ArticleSummary[] {
    return slugs.map((slug) => this.slugIndex.get(slug)).filter((article): article is ArticleSummary => article !== undefined);
  }

  /**
   * カテゴリで記事を絞り込む
   */
  findByCategory(category: string): ArticleSummary[] {
    return this.categoryIndex.get(category) || [];
  }

  /**
   * タグで記事を絞り込む
   */
  findByTag(tag: string): ArticleSummary[] {
    return this.tagIndex.get(tag) || [];
  }

  /**
   * 全カテゴリのリストを取得
   */
  getAllCategories(): string[] {
    return [...this.categoryIndex.keys()];
  }

  /**
   * 全タグのリストを取得
   */
  getAllTags(): string[] {
    return [...this.tagIndex.keys()];
  }

  /**
   * キーワードであいまい検索
   */
  search(query: string): ArticleSummary[] {
    if (!query.trim()) return this.articles;

    return this.fuse
      .search(query)
      .map((result) => result.item);
  }

  /**
   * 複数の条件で記事を検索・絞り込む
   */
  filter(filters: { query?: string; category?: string; tags?: string[] }): ArticleSummary[] {
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
