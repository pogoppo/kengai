import { createRawSnippet } from 'svelte';
import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import SectionBasicHeading from './SectionBasicHeading.svelte';

describe('SectionBasicHeading', () => {
	test('見出しレベルとコンテンツが正しく表示される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>テスト見出し</span>'
		}));

		render(SectionBasicHeading, {
			level: 2,
			icon: faCoffee,
			children
		});

		const heading = page.getByRole('heading', { level: 2 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent('テスト見出し');
	});

	test('アイコンが表示される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>アイコン付き見出し</span>'
		}));

		render(SectionBasicHeading, {
			level: 3,
			icon: faCoffee,
			children
		});

		const heading = page.getByRole('heading', { level: 3 });
		const svg = heading.element().querySelector('svg');
		await expect.element(svg).toBeInTheDocument();
	});

	test('異なる見出しレベル（h1）が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>H1見出し</span>'
		}));

		render(SectionBasicHeading, {
			level: 1,
			icon: faCoffee,
			children
		});

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});

	test('異なる見出しレベル（h6）が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>H6見出し</span>'
		}));

		render(SectionBasicHeading, {
			level: 6,
			icon: faCoffee,
			children
		});

		const heading = page.getByRole('heading', { level: 6 });
		await expect.element(heading).toBeInTheDocument();
	});
});
