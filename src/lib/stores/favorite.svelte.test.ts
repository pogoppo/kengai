import { describe, it, expect, beforeEach, vi } from 'vitest';
import { favoriteState, STORAGE_KEY } from './favorite.svelte';

// localStorageのモック
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		})
	};
})();

// グローバルなlocalStorageをモックに置き換え
Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true
});

describe('FavoriteState', () => {
	beforeEach(() => {
		// 各テストの前にlocalStorageをクリア
		favoriteState.clear();
		vi.clearAllMocks();
	});

	describe('toggle', () => {
		it('存在しないslugを追加できること', () => {
			favoriteState.toggle('cat/article-1');

			expect(favoriteState.check('cat/article-1')).toBe(true);
			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				STORAGE_KEY,
				JSON.stringify(['cat/article-1'])
			);
		});

		it('既に存在するslugを削除できること', () => {
			console.log(favoriteState.entries());
			favoriteState.toggle('cat/article-1');
			favoriteState.toggle('cat/article-1');

			expect(favoriteState.check('cat/article-1')).toBe(false);
			expect(favoriteState.entries()).toEqual([]);
		});

		it('複数のslugを管理できること', () => {
			favoriteState.toggle('cat/article-1');
			favoriteState.toggle('cat/article-2');
			favoriteState.toggle('cat/article-3');

			const entries = favoriteState.entries();
			expect(entries).toHaveLength(3);
			expect(entries).toContain('cat/article-1');
			expect(entries).toContain('cat/article-2');
			expect(entries).toContain('cat/article-3');
		});

		it('toggleを呼び出すたびにlocalStorageに保存されること', () => {
			favoriteState.toggle('cat/article-1');
			expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);

			favoriteState.toggle('cat/article-2');
			expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
		});
	});

	describe('delete', () => {
		it('指定したslugを削除できること', () => {
			favoriteState.toggle('cat/article-1');
			favoriteState.toggle('cat/article-2');

			favoriteState.delete('cat/article-1');

			expect(favoriteState.check('cat/article-1')).toBe(false);
			expect(favoriteState.check('cat/article-2')).toBe(true);
		});

		it('存在しないslugを削除しようとしてもエラーにならないこと', () => {
			expect(() => {
				favoriteState.delete('cat/non-existent');
			}).not.toThrow();
		});

		it('deleteを呼び出すとlocalStorageに保存されること', () => {
			favoriteState.toggle('cat/article-1');
			vi.clearAllMocks();

			favoriteState.delete('cat/article-1');

			expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([]));
		});
	});

	describe('check', () => {
		it('存在するslugに対してtrueを返すこと', () => {
			favoriteState.toggle('cat/article-1');

			expect(favoriteState.check('cat/article-1')).toBe(true);
		});

		it('存在しないslugに対してfalseを返すこと', () => {
			expect(favoriteState.check('cat/non-existent')).toBe(false);
		});

		it('削除したslugに対してfalseを返すこと', () => {
			favoriteState.toggle('cat/article-1');
			favoriteState.delete('cat/article-1');

			expect(favoriteState.check('cat/article-1')).toBe(false);
		});
	});

	describe('entries', () => {
		it('空の配列を返すこと（初期状態）', () => {
			const entries = favoriteState.entries();

			expect(entries).toEqual([]);
			expect(Array.isArray(entries)).toBe(true);
		});

		it('すべてのお気に入りslugを配列で返すこと', () => {
			favoriteState.toggle('cat/article-1');
			favoriteState.toggle('cat/article-2');
			favoriteState.toggle('cat/article-3');

			const entries = favoriteState.entries();

			expect(entries).toHaveLength(3);
			expect(entries).toContain('cat/article-1');
			expect(entries).toContain('cat/article-2');
			expect(entries).toContain('cat/article-3');
		});

		it('追加と削除を繰り返した後の正しい状態を返すこと', () => {
			favoriteState.toggle('cat/article-1');
			favoriteState.toggle('cat/article-2');
			favoriteState.delete('cat/article-1');
			favoriteState.toggle('cat/article-3');

			const entries = favoriteState.entries();

			expect(entries).toHaveLength(2);
			expect(entries).not.toContain('cat/article-1');
			expect(entries).toContain('cat/article-2');
			expect(entries).toContain('cat/article-3');
		});
	});

	describe('localStorageとの統合', () => {
		it('データの保存と読み込みが正しく機能すること', () => {
			// データを追加
			favoriteState.toggle('cat/article-1');
			favoriteState.toggle('cat/article-2');

			// localStorageに保存されているか確認
			const lastCall =
				localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1];
			expect(lastCall[0]).toBe(STORAGE_KEY);

			const savedData = JSON.parse(lastCall[1] as string);
			expect(savedData).toContain('cat/article-1');
			expect(savedData).toContain('cat/article-2');
		});
	});
});
