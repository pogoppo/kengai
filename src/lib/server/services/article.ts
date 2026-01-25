import { articleRepository } from '$lib/repositories/article';
import matter from 'gray-matter';
import { marked } from 'marked';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ArticleSummary } from '$lib/types/article';

export class ArticleServiceError extends Error {
  constructor(public code: 'NOT_FOUND' | 'INTERNAL_ERROR', message: string, public cause?: unknown) {
    super(message);
    this.name = 'ArticleServiceError';
  }
}

export const getArticle = async (category: string, slug: string): Promise<{ articleSummary: ArticleSummary; content: string }> => {
  const fullSlug = `${category}/${slug}`;

  // 記事メタデータを取得
  const articleSummary = articleRepository.findBySlug(fullSlug);

  if (!articleSummary) {
    throw new ArticleServiceError('NOT_FOUND', 'Article not found');
  }

  // Markdownファイルを読み込む
  try {
    const filePath = join(process.cwd(), 'src/lib/data/articles/ja', `${articleSummary.slug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');

    // フロントマターとコンテンツを分離
    const { content } = matter(fileContent);

    // markedでMarkdownをHTMLに変換
    const htmlContent = await marked(content);

    return {
      articleSummary,
      content: htmlContent
    };
  } catch (err) {
    console.error('Failed to load article content:', err);
    // 元のエラーがNOT_FOUND系か判別不能な場合はINTERNAL_ERRORとする
    // fs.readFileがENOENTを返す可能性も考慮するならここで分岐可能だが
    // 今回はデータ不整合（DBにはあるがファイルがない）として500扱いにする
    throw new ArticleServiceError('INTERNAL_ERROR', 'Failed to load article content', err);
  }
};
