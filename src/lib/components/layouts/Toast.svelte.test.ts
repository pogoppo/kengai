import { describe, test, expect, beforeEach, vi } from 'vitest';
import { tick } from 'svelte';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Toast from './Toast.svelte';
import { toastState } from '$lib/stores/toast.svelte';

vi.mock('$lib/paraglide/messages', () => ({
	m: {
		'component.toast.close': () => '閉じる'
	}
}));

describe('Toast', () => {
	beforeEach(() => {
		toastState.toasts = [];
	});

	test('トーストが無い場合は何も表示されない', async () => {
		const { container } = render(Toast);

		const toasts = container.querySelectorAll('toast-item');
		expect(toasts).toHaveLength(0);
	});

	test('showで追加したメッセージが表示される', async () => {
		const { container } = render(Toast);

		toastState.show('保存しました');

		const message = page.getByText('保存しました');
		await expect.element(message).toBeInTheDocument();
		expect(container.querySelector('toast-message')?.textContent).toBe('保存しました');
	});

	test('閉じるボタンをクリックするとトーストが削除される', async () => {
		render(Toast);

		toastState.show('保存しました');
		const closeButton = page.getByRole('button', { name: '閉じる' });
		await expect.element(closeButton).toBeInTheDocument();

		await closeButton.click();

		expect(toastState.toasts).toHaveLength(0);
	});

	test('閉じる際はトランジション終了後にDOMから削除される', async () => {
		const { container } = render(Toast);

		toastState.show('保存しました');
		await expect.element(page.getByText('保存しました')).toBeInTheDocument();

		toastState.dismiss(toastState.toasts[0].id);
		await tick();

		// outroアニメーション中はまだDOMに残っている
		expect(container.querySelector('toast-item')).not.toBeNull();

		// アニメーション終了後に削除される
		await vi.waitFor(() => {
			expect(container.querySelector('toast-item')).toBeNull();
		});
	});

	test('複数のトーストを表示できる', async () => {
		const { container } = render(Toast);

		toastState.show('メッセージ1');
		toastState.show('メッセージ2');

		await expect.element(page.getByText('メッセージ1')).toBeInTheDocument();
		await expect.element(page.getByText('メッセージ2')).toBeInTheDocument();
		expect(container.querySelectorAll('toast-item')).toHaveLength(2);
	});
});
