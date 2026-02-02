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
		const count = buttons.length;
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

	test('highlight="true"が設定されたボタンにdata-highlight属性が適用される', async () => {
		const itemsWithHighlight = [
			{ action: vi.fn(), label: 'Normal Button', icon: faCheck, highlight: false },
			{ action: vi.fn(), label: 'Highlighted Button', icon: faCheck, highlight: true }
		];

		render(FloatNavigation, { items: itemsWithHighlight });

		const normalButton = page.getByRole('button', { name: 'Normal Button' });
		await expect.element(normalButton).toHaveAttribute('data-highlight', 'false');

		const highlightedButton = page.getByRole('button', { name: 'Highlighted Button' });
		await expect.element(highlightedButton).toHaveAttribute('data-highlight', 'true');
	});

	test('highlightが未設定の場合はdata-highlightがfalseになる', async () => {
		const itemsWithoutHighlight = [{ action: vi.fn(), label: 'Default Button', icon: faCheck }];

		render(FloatNavigation, { items: itemsWithoutHighlight });

		const button = page.getByRole('button', { name: 'Default Button' });
		await expect.element(button).toHaveAttribute('data-highlight', 'false');
	});

	test('複数のボタンでそれぞれ異なるhighlight状態を設定できる', async () => {
		const itemsWithMixedHighlight = [
			{ action: vi.fn(), label: 'Button 1', icon: faCheck, highlight: false },
			{ action: vi.fn(), label: 'Button 2', icon: faCheck, highlight: true },
			{ action: vi.fn(), label: 'Button 3', icon: faCheck, highlight: false },
			{ action: vi.fn(), label: 'Button 4', icon: faCheck, highlight: true }
		];

		render(FloatNavigation, { items: itemsWithMixedHighlight });

		const button1 = page.getByRole('button', { name: 'Button 1' });
		await expect.element(button1).toHaveAttribute('data-highlight', 'false');

		const button2 = page.getByRole('button', { name: 'Button 2' });
		await expect.element(button2).toHaveAttribute('data-highlight', 'true');

		const button3 = page.getByRole('button', { name: 'Button 3' });
		await expect.element(button3).toHaveAttribute('data-highlight', 'false');

		const button4 = page.getByRole('button', { name: 'Button 4' });
		await expect.element(button4).toHaveAttribute('data-highlight', 'true');
	});
});
