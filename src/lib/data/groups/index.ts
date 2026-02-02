import { unsafeMessages } from '$lib/utils/i18n';
import indexData from './index.json';
import type { Group } from '$lib/types/group';

function groupLabel(slug: string): string {
	return unsafeMessages(`group.${slug}.label`);
}

function groupDescription(slug: string): string {
	return unsafeMessages(`group.${slug}.description`);
}

function createGroupsIndex() {
	return (
		indexData
			// アンダースコアで始まるグループはプロダクション以外の場合のみ含める
			.filter((group) => import.meta.env.MODE !== 'production' || !group.slug.startsWith('_'))
			.map((group) => {
				return {
					slug: group.slug,
					label: groupLabel(group.slug),
					description: groupDescription(group.slug),
					image: group.image,
					sections: group.sections
				};
			})
	);
}

export const groups: Group[] = createGroupsIndex();
