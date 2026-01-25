import indexData from './index.json'; // ビルド時、または開発サーバー起動時に生成される
import type { ArticleSummary } from '$lib/types/article';

export const articles: ArticleSummary[] = indexData;
