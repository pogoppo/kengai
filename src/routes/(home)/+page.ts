import { groupSummaries } from '$lib/utils/group';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const groups = await groupSummaries();

  return {
    groups
  };
};
