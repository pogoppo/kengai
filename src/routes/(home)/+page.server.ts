import { groupSummaries } from '$lib/utils/group';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => {
  const groups = groupSummaries();

  return {
    groups
  };
};
