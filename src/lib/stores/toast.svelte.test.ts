import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toastState } from './toast.svelte';

describe('ToastState', () => {
	beforeEach(() => {
		toastState.toasts = [];
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('show', () => {
		it('メッセージを追加できること', () => {
			toastState.show('保存しました');

			expect(toastState.toasts).toHaveLength(1);
			expect(toastState.toasts[0].message).toBe('保存しました');
		});

		it('複数のメッセージを追加できること', () => {
			toastState.show('メッセージ1');
			toastState.show('メッセージ2');

			expect(toastState.toasts).toHaveLength(2);
		});

		it(`${toastState.duration}ms経過すると自動的に削除されること`, () => {
			toastState.show('保存しました');
			expect(toastState.toasts).toHaveLength(1);

			vi.advanceTimersByTime(toastState.duration);

			expect(toastState.toasts).toHaveLength(0);
		});

		it(`${toastState.duration}ms経過前は削除されないこと`, () => {
			toastState.show('保存しました');

			vi.advanceTimersByTime(toastState.duration - 1);

			expect(toastState.toasts).toHaveLength(1);
		});
	});

	describe('dismiss', () => {
		it('指定したidのトーストを削除できること', () => {
			toastState.show('メッセージ1');
			toastState.show('メッセージ2');
			const [first, second] = toastState.toasts;

			toastState.dismiss(first.id);

			expect(toastState.toasts).toHaveLength(1);
			expect(toastState.toasts[0].id).toBe(second.id);
		});

		it('存在しないidを指定してもエラーにならないこと', () => {
			expect(() => {
				toastState.dismiss(9999);
			}).not.toThrow();
		});
	});
});
