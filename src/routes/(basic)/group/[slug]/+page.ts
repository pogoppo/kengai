import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { GroupDetail } from '$lib/types/group';
import groups from '$lib/data/groups.json';

export const load: PageLoad = async ({ params }) => {
  const slug = params.slug;
  const sanitizedSlug = groups.includes(slug) ? slug : null;

  if (!sanitizedSlug) {
    return error(404, {
      message: 'Group not found'
    });
  }

  try {
    const groupData: GroupDetail = await import(`$lib/data/groups/${sanitizedSlug}.json`).then((mod) => mod.default);
    return {
      slug,
      groupData
    };
  } catch {
    return error(404, {
      message: 'Group not found'
    });
  }
};
