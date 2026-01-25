import type { EntryGenerator, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { groups } from '$lib/data/groups';
import { getGroupWithArticles, GroupServiceError } from '$lib/services/group.server';

export const entries: EntryGenerator = () => {
  return groups.map((group) => ({ slug: group.slug }));
};

export const load: PageServerLoad = ({ params }) => {
  const slug = params.slug;

  try {
    const groupData = getGroupWithArticles(slug);
    return {
      slug,
      groupData
    };
  } catch (err) {
    if (err instanceof GroupServiceError) {
      if (err.code === 'NOT_FOUND') {
        throw error(404, { message: err.message });
      }
    }
    console.error(err);
    throw error(500, 'Failed to load group data');
  }
};
