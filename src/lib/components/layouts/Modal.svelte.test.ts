import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Modal from './Modal.svelte';

vi.mock('$lib/paraglide/messages', () => ({
	m: {
		'component.modal.close': () => '閉じる'
	}
}));

describe('Modal', () => {
	test('デフォルトではダイアログは表示されない', async () => {
		render(Modal, { open: false });

		const dialog = document.querySelector('dialog');
		expect(dialog).not.toBeNull();
		expect(dialog?.open).toBe(false);
	});

	test('openプロパティがtrueの場合、ダイアログが表示される', async () => {
		render(Modal, { open: true });

		const closeButton = page.getByRole('button', { name: '閉じる' });
		await expect.element(closeButton).toBeInTheDocument();
		await expect.element(closeButton).toBeVisible();

		const dialog = document.querySelector('dialog');
		expect(dialog?.open).toBe(true);
	});

	test('閉じるボタンをクリックするとダイアログが閉じる', async () => {
		render(Modal, { open: true });

		const closeButton = page.getByRole('button', { name: '閉じる' });
		await closeButton.click();

		// 閉じたことを確認
		const dialog = document.querySelector('dialog');
		expect(dialog?.open).toBe(false);
	});
});
