import { createRawSnippet, tick } from 'svelte';
import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Popover from './Popover.svelte';

const children = createRawSnippet(() => ({
	render: () => '<button>トリガー</button>'
}));

describe('Popover', () => {
	test('子要素は常に表示される', async () => {
		render(Popover, { children, message: '説明テキスト' });

		await expect.element(page.getByRole('button', { name: 'トリガー' })).toBeInTheDocument();
	});

	test('openがfalseの場合は吹き出しが表示されない', async () => {
		const { container } = render(Popover, { children, message: '説明テキスト' });

		expect(container.querySelector('popover-box')).toBeNull();
	});

	test('openがtrueの場合はmessageが吹き出しに表示される', async () => {
		render(Popover, { children, message: '説明テキスト', open: true });

		const tooltip = page.getByRole('tooltip');
		await expect.element(tooltip).toBeInTheDocument();
		await expect.element(tooltip).toHaveTextContent('説明テキスト');
	});

	test('閉じる際はトランジション終了後にDOMから削除される', async () => {
		const { container, rerender } = render(Popover, {
			children,
			message: '説明テキスト',
			open: true
		});
		await expect.element(page.getByRole('tooltip')).toBeInTheDocument();

		await rerender({ children, message: '説明テキスト', open: false });
		await tick();

		// outroアニメーション中はまだDOMに残っている
		expect(container.querySelector('popover-box')).not.toBeNull();

		// アニメーション終了後に削除される
		await vi.waitFor(() => {
			expect(container.querySelector('popover-box')).toBeNull();
		});
	});

	test('吹き出しは子要素のアンカー名を参照して配置される', async () => {
		const { container } = render(Popover, { children, message: '説明テキスト', open: true });

		const wrapper = container.querySelector('popover-wrapper') as HTMLElement;
		const anchorName = wrapper.style.getPropertyValue('--popover-anchor-name').trim();

		expect(anchorName).toMatch(/^--popover-[\w-]+$/);
		expect(getComputedStyle(wrapper).getPropertyValue('anchor-name')).toBe(anchorName);
	});
});
