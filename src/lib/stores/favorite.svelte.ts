import { browser } from '$app/env';

export const STORAGE_KEY = 'kengai-favorites';

class FavoriteState {
	private items = $state<Set<string>>(new Set());

	constructor() {
		if (browser) {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const unknownData = JSON.parse(stored);
				this.items = new Set<string>(unknownData);
			}
		}
	}

	delete(key: string) {
		this.items.delete(key);
		this.save();
	}

	toggle(key: string) {
		if (this.items.has(key)) {
			this.items.delete(key);
		} else {
			this.items.add(key);
		}
		this.save();
	}

	clear() {
		this.items.clear();
		this.save();
	}

	check(key: string) {
		return this.items.has(key);
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
