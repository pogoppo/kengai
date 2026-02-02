import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import NavigationBar from './NavigationBar.svelte';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

describe('NavigationBar', () => {
	test('ナビゲーション項目が正しく表示される', async () => {
		render(NavigationBar, {
			items: [
				{ href: '/', label: 'ホーム', icon: faHome, active: true },
				{ href: '/search', label: '検索', icon: faSearch, active: false }
			]
		});

		const list = page.getByRole('list');
		await expect.element(list).toBeInTheDocument();

		await expect.element(page.getByRole('link', { name: 'ホーム' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: '検索' })).toBeInTheDocument();
	});

	test('リンクが正しい遷移先を持っている', async () => {
		render(NavigationBar, {
			items: [
				{ href: '/', label: 'ホーム', icon: faHome, active: true },
				{ href: '/search', label: '検索', icon: faSearch, active: false }
			]
		});

		const homeLink = page.getByRole('link', { name: 'ホーム' });
		await expect.element(homeLink).toHaveAttribute('href', '/');

		const searchLink = page.getByRole('link', { name: '検索' });
		await expect.element(searchLink).toHaveAttribute('href', '/search');
	});

	test('アクティブな項目に正しい属性が付与される', async () => {
		render(NavigationBar, {
			items: [
				{ href: '/', label: 'ホーム', icon: faHome, active: true },
				{ href: '/search', label: '検索', icon: faSearch, active: false }
			]
		});

		const activeLink = page.getByRole('link', { name: 'ホーム' });
		await expect.element(activeLink).toHaveAttribute('data-active', 'true');

		const inactiveLink = page.getByRole('link', { name: '検索' });
		await expect.element(inactiveLink).toHaveAttribute('data-active', 'false');
	});
});
