import { createRawSnippet } from 'svelte';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import SectionBasic from './SectionBasic.svelte';

describe('SectionBasic', () => {
	test('コンテンツが正しく表示される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<div>Test Content</div>'
		}));
		render(SectionBasic, { children });

		const section = page.getByText('Test Content');
		await expect.element(section).toBeInTheDocument();
	});

	test('デフォルトのプロパティが適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<div>Content</div>'
		}));
		render(SectionBasic, { children });

		const section = page.getByTestId('section-basic');
		// toHaveStyleがCSS変数に対応していない
		await expect
			.element(section)
			.toHaveAttribute('style', '--local-background-color: transparent;');
		await expect.element(section).toHaveAttribute('data-continuously', 'false');
	});

	test('指定した背景色が適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<div>Content</div>'
		}));
		render(SectionBasic, { color: 'red', children });

		const section = page.getByTestId('section-basic');
		// toHaveStyleがCSS変数に対応していない
		await expect.element(section).toHaveAttribute('style', '--local-background-color: red;');
	});

	test('continuously属性が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<div>Content</div>'
		}));
		render(SectionBasic, { continuously: true, children });

		const section = page.getByTestId('section-basic');
		await expect.element(section).toHaveAttribute('data-continuously', 'true');
	});
});
