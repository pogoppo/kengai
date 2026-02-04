import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page as user } from 'vitest/browser';
import GlobalNavigation from './GlobalNavigation.svelte';

vi.mock('$lib/paraglide/messages', () => ({
	m: {
		'component.global-navigation.aria-label': () => 'グローバルナビゲーション',
		'component.main-navigation.home.label': () => 'ホーム',
		'component.main-navigation.favorite.label': () => 'お気に入り',
		'component.main-navigation.faq.label': () => 'よくある質問',
		'component.sub-navigation.search.label': () => '検索',
		'component.sub-navigation.back-to-top.label': () => 'トップへ戻る',
		'component.sub-navigation.add-favorite.label': () => 'お気に入り追加'
	}
}));

const mocks = vi.hoisted(() => ({
	pathname: '/',
	favoriteCheck: vi.fn(() => false),
	favoriteToggle: vi.fn()
}));

vi.mock('$app/state', () => ({
	page: {
		url: {
			get pathname() {
				return mocks.pathname;
			}
		}
	}
}));

vi.mock('$lib/stores/favorite.svelte', () => ({
	favoriteState: {
		check: mocks.favoriteCheck,
		toggle: mocks.favoriteToggle
	}
}));

describe('GlobalNavigation', () => {
	beforeEach(() => {
		mocks.pathname = '/';
		mocks.favoriteCheck.mockReturnValue(false);
		vi.clearAllMocks();
	});

	test('メインナビゲーションが表示され、現在のページがアクティブになっている', async () => {
		mocks.pathname = '/favorite';
		render(GlobalNavigation);

		const nav = user.getByRole('navigation', { name: 'グローバルナビゲーション' });
		await expect.element(nav).toBeInTheDocument();

		const homeLink = user.getByRole('link', { name: 'ホーム' });
		await expect.element(homeLink).toBeInTheDocument();
		await expect.element(homeLink).toHaveAttribute('href', '/');

		const favLink = user.getByRole('link', { name: 'お気に入り' });
		await expect.element(favLink).toBeInTheDocument();
		await expect.element(favLink).toHaveAttribute('href', '/favorite');
		await expect.element(favLink).toHaveAttribute('data-active', 'true');

		const faqLink = user.getByRole('link', { name: 'よくある質問' });
		await expect.element(faqLink).toBeInTheDocument();
		await expect.element(faqLink).toHaveAttribute('href', '/faq');
	});

	test('通常ページではサブナビゲーションに「検索」と「トップへ戻る」のみが表示される', async () => {
		mocks.pathname = '/category/_mock'; // 記事ページ以外
		render(GlobalNavigation);

		const searchBtn = user.getByRole('button', { name: '検索' });
		await expect.element(searchBtn).toBeInTheDocument();

		const backToTopBtn = user.getByRole('button', { name: 'トップへ戻る' });
		await expect.element(backToTopBtn).toBeInTheDocument();

		const addFavBtn = user.getByRole('button', { name: 'お気に入り追加' });
		await expect.element(addFavBtn).not.toBeInTheDocument();
	});

	test('`isArticlePage = true`ではサブナビゲーションに「お気に入り追加」が表示される', async () => {
		render(GlobalNavigation, { isArticlePage: true });

		const addFavBtn = user.getByRole('button', { name: 'お気に入り追加' });
		await expect.element(addFavBtn).toBeInTheDocument();

		const searchBtn = user.getByRole('button', { name: '検索' });
		await expect.element(searchBtn).toBeInTheDocument();

		const backToTopBtn = user.getByRole('button', { name: 'トップへ戻る' });
		await expect.element(backToTopBtn).toBeInTheDocument();
	});

	test('お気に入り追加ボタンをクリックするとfavoriteState.toggle()が呼ばれる', async () => {
		mocks.pathname = '/article/_mock/example';
		render(GlobalNavigation, { isArticlePage: true });

		const addFavBtn = user.getByRole('button', { name: 'お気に入り追加' });
		await addFavBtn.click({ force: true });

		expect(mocks.favoriteToggle).toHaveBeenCalledTimes(1);
		expect(mocks.favoriteToggle).toHaveBeenCalledWith('_mock/example');
	});

	test('お気に入りに登録済みの記事ではボタンがハイライト表示される', async () => {
		mocks.pathname = '/article/_mock/example';
		mocks.favoriteCheck.mockReturnValue(true);

		render(GlobalNavigation, { isArticlePage: true });

		const addFavBtn = user.getByRole('button', { name: 'お気に入り追加' });
		await expect.element(addFavBtn).toBeInTheDocument();
		await expect.element(addFavBtn).toHaveAttribute('data-highlight', 'true');
	});

	test('お気に入り未登録の記事ではボタンがハイライト表示されない', async () => {
		mocks.pathname = '/article/_mock/example';
		mocks.favoriteCheck.mockReturnValue(false);

		render(GlobalNavigation, { isArticlePage: true });

		const addFavBtn = user.getByRole('button', { name: 'お気に入り追加' });
		await expect.element(addFavBtn).toBeInTheDocument();
		await expect.element(addFavBtn).toHaveAttribute('data-highlight', 'false');
	});
});
