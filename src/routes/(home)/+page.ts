import { groupSummaries } from '$lib/utils/group';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  const groups = groupSummaries();

  return {
    groups
  };
};
