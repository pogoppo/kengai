import { error } from '@sveltejs/kit';
import { articleRepository } from '$lib/repositories/article';
import { getArticle, ArticleServiceError } from '$lib/services/article.server';
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

  try {
    const { articleSummary, content } = await getArticle(category, slug);
    return {
      articleSummary,
      content
    };
  } catch (err) {
    if (err instanceof ArticleServiceError) {
      if (err.code === 'NOT_FOUND') {
        throw error(404, err.message);
      }
    }
    // その他のエラー
    console.error(err);
    throw error(500, 'Failed to load article content');
  }
};
