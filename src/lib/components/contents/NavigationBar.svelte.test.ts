import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import NavigationBar from './NavigationBar.svelte';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

describe('NavigationBar', () => {
	const items = [
		{ href: '/', label: 'ホーム', icon: faHome, active: true },
		{ href: '/profile', label: 'プロフィール', icon: faUser, active: false }
	];

	test('ナビゲーション項目が正しく表示される', async () => {
		render(NavigationBar, { items });

		const list = page.getByRole('list');
		await expect.element(list).toBeInTheDocument();

		await expect.element(page.getByRole('link', { name: 'ホーム' })).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'プロフィール' })).toBeInTheDocument();
	});

	test('リンクが正しい遷移先を持っている', async () => {
		render(NavigationBar, { items });

		const homeLink = page.getByRole('link', { name: 'ホーム' });
		await expect.element(homeLink).toHaveAttribute('href', '/');

		const profileLink = page.getByRole('link', { name: 'プロフィール' });
		await expect.element(profileLink).toHaveAttribute('href', '/profile');
	});

	test('アクティブな項目に正しい属性が付与される', async () => {
		render(NavigationBar, { items });

		const activeLink = page.getByRole('link', { name: 'ホーム' });
		await expect.element(activeLink).toHaveAttribute('data-active', 'true');

		const inactiveLink = page.getByRole('link', { name: 'プロフィール' });
		await expect.element(inactiveLink).toHaveAttribute('data-active', 'false');
	});
});
