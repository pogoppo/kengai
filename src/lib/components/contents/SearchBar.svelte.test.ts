import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import SearchBar from './SearchBar.svelte';

describe('SearchBar', () => {
	test('プレースホルダーが表示される', async () => {
		const onSearch = vi.fn();
		render(SearchBar, { onSearch, placeholder: 'Search here...' });

		const input = page.getByPlaceholder('Search here...');
		await expect.element(input).toBeInTheDocument();
	});

	test('初期値が設定される', async () => {
		const onSearch = vi.fn();
		render(SearchBar, { onSearch, value: 'initial query' });

		const input = page.getByRole('searchbox');
		await expect.element(input).toHaveValue('initial query');
	});

	test('EnterキーでonSearchが呼ばれる', async () => {
		const onSearch = vi.fn();
		render(SearchBar, { onSearch });

		const input = page.getByRole('searchbox');
		await input.fill('search query');
		await userEvent.keyboard('{Enter}');

		expect(onSearch).toHaveBeenCalledWith('search query');
	});

	test('検索ボタンでonSearchが呼ばれる', async () => {
		const onSearch = vi.fn();
		render(SearchBar, { onSearch });

		const input = page.getByRole('searchbox');
		await input.fill('another query');

		const button = page.getByRole('button');
		await button.click();

		expect(onSearch).toHaveBeenCalledWith('another query');
	});

	test('focusedプロパティがtrueの場合、inputがフォーカスされる', async () => {
		const onSearch = vi.fn();
		render(SearchBar, { onSearch, focused: true });

		const input = page.getByRole('searchbox');
		await expect.element(input).toHaveFocus();
	});
});
