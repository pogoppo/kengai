import { unsafeMessages } from '$lib/utils/i18n';
import indexData from './index.json';
import type { Group } from '$lib/types/group';

function groupLabel(slug: string): string {
  return unsafeMessages(`group.${slug}.label`);
}

function groupDescription(slug: string): string {
  return unsafeMessages(`group.${slug}.description`);
}

export const groups: Group[] = indexData.map((group) => ({
  slug: group.slug,
  label: groupLabel(group.slug),
  description: groupDescription(group.slug),
  image: group.image,
  sections: group.sections as Group['sections']
}));
