import type { PageServerLoad } from './$types';
import { faqSections } from '$lib/data/faq/ja';

export const load: PageServerLoad = async () => {
	return {
		faqSections
	};
};
