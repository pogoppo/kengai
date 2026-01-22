import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import groups from '$lib/data/groups.json';

export const load: PageLoad = async ({ params }) => {
  const slug = params.slug;
  const groupData = groups.find((group) => group.slug === slug);

  if (!groupData) {
    return error(404, {
      message: 'Group not found'
    });
  }

  return {
    slug,
    groupData
  };
};
