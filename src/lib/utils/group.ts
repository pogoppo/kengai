import type { GroupSummary } from '$lib/types/group';
import groups from '$lib/data/groups.json';
import { unsafeMessages } from './i18n';

export function groupSummaries(): GroupSummary[] {
  return groups.map((group) => ({
    slug: group.slug,
    label: groupLabel(group.slug),
    description: groupDescription(group.slug),
    image: group.image
  }));
}

export function groupLabel(slug: string): string {
  return unsafeMessages(`group.${slug}.label`);
}

export function groupDescription(slug: string): string {
  return unsafeMessages(`group.${slug}.description`);
}
