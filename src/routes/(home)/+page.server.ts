import type { PageServerLoad } from './$types';
import { groups } from '$lib/data/groups';
import { articleRepository } from '$lib/repositories/article';

export const load: PageServerLoad = () => {
  const categories = articleRepository.getAllCategories();

  return {
    groups,
    categories
  };
};
