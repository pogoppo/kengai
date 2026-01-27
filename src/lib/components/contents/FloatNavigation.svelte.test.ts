import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import FloatNavigation from './FloatNavigation.svelte';

describe('FloatNavigation', () => {
	const items = [
		{ action: vi.fn(), label: 'Action 1', icon: faCheck },
		{ action: vi.fn(), label: 'Action 2', icon: faCheck }
	];

	test('ナビゲーション項目が正しく表示される', async () => {
		render(FloatNavigation, { items });

		const list = page.getByRole('list');
		await expect.element(list).toBeInTheDocument();

		const buttons = page.getByRole('button');
		const count = await buttons.length;
		expect(count).toBe(2);

		const button1 = page.getByRole('button', { name: 'Action 1' });
		await expect.element(button1).toBeInTheDocument();

		const button2 = page.getByRole('button', { name: 'Action 2' });
		await expect.element(button2).toBeInTheDocument();
	});

	test('ボタンクリックでアクションが実行される', async () => {
		render(FloatNavigation, { items });

		// クリックを受け付けるように
		const list = page.getByRole('list').element();
		list.style.position = 'unset';
		list.style.pointerEvents = 'unset';
		list.style.opacity = 'unset';

		const button1 = page.getByRole('button', { name: 'Action 1' });
		await button1.click({ force: true });

		expect(items[0].action).toHaveBeenCalled();
		expect(items[1].action).not.toHaveBeenCalled();
	});
});
