import indexData from './index.json';
import type { FaqSection } from '$lib/types/faq';

function createFaqIndex() {
	return (
		indexData
			// アンダースコアで始まるセクションIDはプロダクション以外の場合のみ含める
			.filter((section) => import.meta.env.MODE !== 'production' || !section.id.startsWith('_'))
	);
}

export const faqSections: FaqSection[] = createFaqIndex();
