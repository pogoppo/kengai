import { browser } from '$app/environment';
import type { ArticleSummary } from '$lib/types/article';

export const STORAGE_KEY = 'kengai-favorites';

class FavoriteState {
	private items = $state<Set<ArticleSummary['slug']>>(new Set());

	constructor() {
		if (browser) {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const unknownData = JSON.parse(stored);
				this.items = new Set<ArticleSummary['slug']>(unknownData);
			}
		}
	}

	delete(slug: ArticleSummary['slug']) {
		this.items.delete(slug);
		this.save();
	}

	toggle(slug: ArticleSummary['slug']) {
		if (this.items.has(slug)) {
			this.items.delete(slug);
		} else {
			this.items.add(slug);
		}
		this.save();
	}

	clear() {
		this.items.clear();
		this.save();
	}

	check(slug: ArticleSummary['slug']) {
		return this.items.has(slug);
	}

	entries() {
		return Array.from(this.items);
	}

	private save() {
		if (browser) {
			const arrayData = Array.from(this.items);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayData));
		}
	}
}

export const favoriteState = new FavoriteState();
