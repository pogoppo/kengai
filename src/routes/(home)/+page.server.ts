import type { PageServerLoad } from './$types';
import { groups } from '$lib/data/groups';
import { articleRepository } from '$lib/repositories/article';

const PRIORITIZED = ['_mock', 'tent', 'tarp', 'rope-work', 'moto-trouble'];

export const load: PageServerLoad = () => {
	const categories = articleRepository.getAllCategories();
	categories.sort((a, b) => {
		const aIndex = PRIORITIZED.indexOf(a);
		const bIndex = PRIORITIZED.indexOf(b);
		if (aIndex === -1 && bIndex === -1) {
			return 0;
		} else if (aIndex === -1) {
			return 1;
		} else if (bIndex === -1) {
			return -1;
		} else {
			return aIndex - bIndex;
		}
	});

	return {
		groups,
		categories
	};
};
