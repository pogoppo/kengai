import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import ModalSearch from './ModalSearch.svelte';
import { modalState } from '$lib/stores/modal.svelte';
import { goto } from '$app/navigation';
import { createSearchURL } from '$lib/utils/search';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

vi.mock('$lib/paraglide/messages', () => ({
	m: {
		'component.modal.search.description': () => 'サイト内を検索します',
		'search.placeholder': () => 'キーワードを入力',
		'component.search-bar.button.aria-label': () => '検索'
	}
}));

vi.mock('$lib/utils/search', () => ({
	createSearchURL: vi.fn()
}));

vi.mock('$lib/stores/modal.svelte', () => ({
	modalState: {
		close: vi.fn()
	}
}));

describe('ModalSearch', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('正しくレンダリングされること', async () => {
		render(ModalSearch);
		// 検索バーが表示されているか
		const input = page.getByPlaceholder('キーワードを入力');
		await expect.element(input).toBeInTheDocument();
	});

	test('検索を実行すると、モーダルが閉じ、ページ遷移すること', async () => {
		// createSearchURLのモック戻り値を設定
		const mockUrl = new URL(location.href);
		mockUrl.pathname = '/search';
		mockUrl.search = '?q=test';
		vi.mocked(createSearchURL).mockReturnValue(mockUrl);

		render(ModalSearch);

		const input = page.getByPlaceholder('キーワードを入力');
		await input.fill('test');
		await userEvent.keyboard('{Enter}');

		// createSearchURLが呼ばれたか
		expect(createSearchURL).toHaveBeenCalledWith('test');

		// モーダルが閉じる関数が呼ばれたか
		expect(modalState.close).toHaveBeenCalled();

		// gotoが正しいURLで呼ばれたか
		expect(goto).toHaveBeenCalledWith(mockUrl);
	});

	test('空文字で検索した場合、何も起こらないこと', async () => {
		// createSearchURLのモック戻り値を設定（クエリパラメータなし）
		const mockUrl = new URL(location.href);
		mockUrl.pathname = '/search'; // qパラメータなし
		vi.mocked(createSearchURL).mockReturnValue(mockUrl);

		render(ModalSearch);

		const input = page.getByPlaceholder('キーワードを入力');
		await input.fill('   ');
		await userEvent.keyboard('{Enter}');

		// createSearchURLは呼ばれる
		expect(createSearchURL).toHaveBeenCalledWith('   ');

		// gotoやcloseは呼ばれないはず
		expect(modalState.close).not.toHaveBeenCalled();
		expect(goto).not.toHaveBeenCalled();
	});
});
