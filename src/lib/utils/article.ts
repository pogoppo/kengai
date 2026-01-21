import Fuse from 'fuse.js';
import { articles } from '$lib/data/articles/ja';
import type { Article } from '$lib/types/article';

/**
 * Fuse.jsのインスタンス（遅延初期化）
 */
let fuse: Fuse<Article> | null = null;

/**
 * Fuse.jsインスタンスを取得（初回のみ初期化）
 */
function getFuseInstance(): Fuse<Article> {
  if (!fuse) {
    fuse = new Fuse(articles, {
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
  return fuse;
}

/**
 * カテゴリで記事を絞り込む
 */
export function fetchArticlesByCategory(category: string): Article[] {
  return articles.filter((article) => article.category === category);
}

/**
 * タグで記事を絞り込む
 */
export function fetchArticlesByTag(tag: string): Article[] {
  return articles.filter((article) => article.tags?.includes(tag));
}

/**
 * 全カテゴリのリストを取得
 */
export function fetchAllCategories(): string[] {
  return [...new Set(articles.map((article) => article.category).filter(Boolean))];
}

/**
 * 全タグのリストを取得
 */
export function fetchAllTags(): string[] {
  return [...new Set(articles.flatMap((article) => article.tags || []))];
}

/**
 * キーワードであいまい検索（Fuse.js使用）
 */
export function searchArticles(query: string): Article[] {
  if (!query.trim()) return articles;

  return getFuseInstance()
    .search(query)
    .map((result) => result.item);
}

/**
 * 複数の条件で記事を検索・絞り込む
 */
export function filterArticles(filters: {
  query?: string;
  category?: string;
  tags?: string[];
}): Article[] {
  let results = filters.query ? searchArticles(filters.query) : articles;

  if (filters.category) {
    results = results.filter((article) => article.category === filters.category);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((article) => filters.tags!.some((tag) => article.tags?.includes(tag)));
  }

  return results;
}
