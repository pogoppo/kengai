import { describe, test, expect, beforeEach } from 'vitest';
import { globalState, VISITED_STORAGE_KEY } from './global.svelte';

describe('GlobalState', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('訪問済みフラグが無い場合は初回アクセスとして扱われる', () => {
		expect(globalState.isFirstVisit).toBe(true);
	});

	test('markVisitedを呼ぶと訪問済みとしてlocalStorageに記録される', () => {
		globalState.markVisited();

		expect(localStorage.getItem(VISITED_STORAGE_KEY)).toBe('true');
		expect(globalState.isFirstVisit).toBe(false);
	});

	test('訪問済みフラグがある場合は初回アクセスとして扱われない', () => {
		localStorage.setItem(VISITED_STORAGE_KEY, 'true');

		expect(globalState.isFirstVisit).toBe(false);
	});
});
