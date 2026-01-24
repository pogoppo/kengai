import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import groups from '$lib/data/groups.json';
import { articleRepository } from '$lib/repositories/article';

export const load: PageServerLoad = ({ params }) => {
  const slug = params.slug;
  const groupData = groups.find((group) => group.slug === slug);

  if (!groupData) {
    return error(404, {
      message: 'Group not found'
    });
  }

  // 記事一覧のslugを実際の記事データに変換
  const sectionsWithArticles = groupData.sections.map((section) => {
    const slugs = section.articles.map((articleRef) => articleRef.slug);
    return {
      category: section.category,
      articles: articleRepository.findBySlugs(slugs)
    };
  });

  return {
    slug,
    groupData: {
      ...groupData,
      sections: sectionsWithArticles
    }
  };
};
