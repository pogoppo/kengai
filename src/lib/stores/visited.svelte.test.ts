import { describe, test, expect, beforeEach } from 'vitest';
import { visitedState, VISITED_STORAGE_KEY } from './visited.svelte';

describe('VisitedState', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('訪問済みフラグが無い場合は初回アクセスとして扱われる', () => {
		expect(visitedState.isFirstVisit).toBe(true);
	});

	test('markVisitedを呼ぶと訪問済みとしてlocalStorageに記録される', () => {
		visitedState.markVisited();

		expect(localStorage.getItem(VISITED_STORAGE_KEY)).toBe('true');
		expect(visitedState.isFirstVisit).toBe(false);
	});

	test('訪問済みフラグがある場合は初回アクセスとして扱われない', () => {
		localStorage.setItem(VISITED_STORAGE_KEY, 'true');

		expect(visitedState.isFirstVisit).toBe(false);
	});
});
