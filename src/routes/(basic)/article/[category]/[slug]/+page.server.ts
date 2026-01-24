import { error } from '@sveltejs/kit';
import { articleRepository } from '$lib/repositories/article';
import matter from 'gray-matter';
import { marked } from 'marked';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { PageServerLoad, EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
  // 全記事のパラメータを返してプリレンダリング対象にする
  return articleRepository.findAll().map((article) => {
    const [category, slug] = article.slug.split('/');
    return { category, slug };
  });
};

export const load: PageServerLoad = async ({ params }) => {
  const { category, slug } = params;
  const fullSlug = `${category}/${slug}`;

  // 記事メタデータを取得
  const article = articleRepository.findBySlug(fullSlug);

  if (!article) {
    throw error(404, 'Article not found');
  }

  // Markdownファイルを読み込む
  try {
    const filePath = join(process.cwd(), 'src/lib/data/articles/ja', `${article.slug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');

    // フロントマターとコンテンツを分離
    const { content } = matter(fileContent);

    // markedでMarkdownをHTMLに変換
    const htmlContent = await marked(content);

    return {
      article,
      content: htmlContent
    };
  } catch (err) {
    console.error('Failed to load article content:', err);
    throw error(500, 'Failed to load article content');
  }
};
