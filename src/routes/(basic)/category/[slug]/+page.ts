import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { articleRepository } from '$lib/repositories/article';

export const load: PageLoad = ({ params }) => {
  const category = params.slug;
  const articles = articleRepository.findByCategory(category);

  if (!articles || articles.length === 0) {
    return error(404, {
      message: 'Category not found'
    });
  }

  return {
    category,
    articles
  };
};
