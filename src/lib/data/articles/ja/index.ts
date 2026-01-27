import indexData from './index.json'; // ビルド時、または開発サーバー起動時に生成される
import type { ArticleSummary } from '$lib/types/article';

function createArticlesIndex() {
  return indexData
    // アンダースコアで始まる記事はプロダクション以外の場合のみ含める
    .filter((article) => import.meta.env.MODE !== 'production' || !article.category.startsWith('_'));
}

export const articles: ArticleSummary[] = createArticlesIndex();
