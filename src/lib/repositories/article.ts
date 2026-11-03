import Fuse from 'fuse.js';
import { articles } from '#lib/data/articles/ja/index.js';
import type { ArticleSummary } from '#lib/types/article.js';
import { toArticleKey } from '#lib/utils/article.js';

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
				threshold: 0.2, // 0=完全一致, 1=すべてマッチ
				includeScore: true,
				minMatchCharLength: 2,
				ignoreLocation: true,
				useExtendedSearch: true
			});
		}

		return this._fuse;
	}

	private articles: ArticleSummary[];
	private keyIndex: Map<string, ArticleSummary>;
	private categoryIndex: Map<string, ArticleSummary[]>;

	constructor(articles: ArticleSummary[]) {
		this.articles = articles;

		// 記事キー（category/slug）インデックスを構築
		this.keyIndex = new Map(articles.map((article) => [toArticleKey(article), article]));

		// categoryインデックスを構築
		this.categoryIndex = new Map();
		for (const article of articles) {
			if (!this.categoryIndex.has(article.category)) {
				this.categoryIndex.set(article.category, []);
			}
			this.categoryIndex.get(article.category)!.push(article);
		}
	}

	/**
	 * 全記事を取得
	 */
	findAll(): ArticleSummary[] {
		return this.articles;
	}

	/**
	 * カテゴリとslugで記事を取得
	 */
	find(category: string, slug: string): ArticleSummary | undefined {
		return this.keyIndex.get(toArticleKey({ category, slug }));
	}

	/**
	 * 複数の記事キー（category/slug）で記事を取得
	 */
	findByKeys(keys: string[]): ArticleSummary[] {
		return keys
			.map((key) => this.keyIndex.get(key))
			.filter((article): article is ArticleSummary => article !== undefined);
	}

	/**
	 * カテゴリで記事を絞り込む
	 */
	findByCategory(category: string): ArticleSummary[] {
		return this.categoryIndex.get(category) || [];
	}

	/**
	 * 全カテゴリのリストを取得
	 */
	getAllCategories(): string[] {
		return [...this.categoryIndex.keys()];
	}

	/**
	 * キーワードであいまい検索
	 */
	private search(query: string): ArticleSummary[] {
		if (!query.trim()) return this.articles;
		// 全角スペースを半角に変換して、AND検索が効くようにする
		// eslint-disable-next-line no-irregular-whitespace
		const normalizedQuery = query.replace(/　/g, ' ');

		return this.fuse.search(normalizedQuery).map((result) => result.item);
	}

	/**
	 * 複数の条件で記事を検索・絞り込む
	 */
	filter(filters: { query?: string; category?: string; tags?: string[] }): ArticleSummary[] {
		let query = filters.query || '';
		let tags = filters.tags ? [...filters.tags] : [];

		// クエリからハッシュタグを抽出 (#タグ)
		if (query.includes('#')) {
			const tokens = query.split(/\s+/);
			const cleanTokens: string[] = [];

			for (const token of tokens) {
				if (token.startsWith('#') && token.length > 1) {
					tags.push(token.slice(1));
				} else {
					cleanTokens.push(token);
				}
			}
			query = cleanTokens.join(' ');
		}

		// タグの重複排除
		tags = [...new Set(tags)];

		let results = query ? this.search(query) : this.articles;

		if (filters.category) {
			results = results.filter((article) => article.category === filters.category);
		}

		if (tags.length > 0) {
			results = results.filter((article) => tags.some((tag) => article.tags?.includes(tag)));
		}

		return results;
	}
}

export const articleRepository = new ArticleRepository(articles);
