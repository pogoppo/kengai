import type { EntryGenerator, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { articleRepository } from '$lib/repositories/article';

export const entries: EntryGenerator = () => {
	const categories = articleRepository.getAllCategories();
	return categories.map((category) => ({ slug: category }));
};

export const load: PageServerLoad = ({ params }) => {
	const category = params.slug;
	const articles = articleRepository.findByCategory(category);

	if (!articles || articles.length === 0) {
		return error(404, {
			message: 'Category not found'
		});
	}

	return {
		category,
		articles
	};
};
