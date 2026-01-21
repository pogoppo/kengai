import indexData from './index.json'; // ビルド時、または開発サーバー起動時に生成される
import type { Article } from '$lib/types/article';

export const articles: Article[] = indexData;
