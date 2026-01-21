import type { GroupSummary } from '$lib/types/group';
import groups from '$lib/data/groups.json';
import { unsafeMessages } from './i18n';

export async function groupSummaries(): Promise<GroupSummary[]> {
  const summaries = await Promise.all(
    groups.map(async (slug) => {
      const groupData = await import(`$lib/data/groups/${slug}.json`).then((mod) => mod.default);
      return {
        slug,
        label: groupLabel(slug),
        description: groupDescription(slug),
        image: groupData.image
      };
    })
  );

  return summaries;
}

export function groupLabel(slug: string): string {
  return unsafeMessages(`group.${slug}.label`);
}

export function groupDescription(slug: string): string {
  return unsafeMessages(`group.${slug}.description`);
}
