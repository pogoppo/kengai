import { browser } from '$app/environment';

export const VISITED_STORAGE_KEY = 'kengai-visited';

class GlobalState {
	// 初回アクセスかどうか
	get isFirstVisit() {
		return browser && localStorage.getItem(VISITED_STORAGE_KEY) === null;
	}

	markVisited() {
		if (browser) {
			localStorage.setItem(VISITED_STORAGE_KEY, 'true');
		}
	}
}

export const globalState = new GlobalState();
