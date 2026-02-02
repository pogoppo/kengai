import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Breadcrumbs from './Breadcrumbs.svelte';

vi.mock('$lib/paraglide/messages', () => ({
	m: {
		'app.name': () => 'AppName',
		'component.breadcrumbs.aria-label': () => 'Breadcrumbs Label'
	}
}));

describe('Breadcrumbs', () => {
	test('ホームリンクとパンくずリスト項目が表示される', async () => {
		render(Breadcrumbs, {
			items: [{ label: 'Category', href: '/category/_mock' }, { label: 'Current Page' }]
		});

		const nav = page.getByRole('navigation', { name: 'Breadcrumbs Label' });
		await expect.element(nav).toBeInTheDocument();

		const homeLink = page.getByRole('link', { name: 'AppName' });
		await expect.element(homeLink).toBeInTheDocument();
		await expect.element(homeLink).toHaveAttribute('href', '/');

		const categoryLink = page.getByRole('link', { name: 'Category' });
		await expect.element(categoryLink).toBeInTheDocument();
		await expect.element(categoryLink).toHaveAttribute('href', '/category/_mock');

		const currentPage = page.getByText('Current Page');
		await expect.element(currentPage).toBeInTheDocument();

		const currentLink = page.getByRole('link', { name: 'Current Page' });
		await expect.element(currentLink).not.toBeInTheDocument();
	});

	test('区切りアイコンが表示される', async () => {
		render(Breadcrumbs, { items: [{ label: 'Current Page' }] });

		const nav = page.getByRole('navigation', { name: 'Breadcrumbs Label' });
		await expect.element(nav).toBeInTheDocument();

		const svg = nav.element().querySelector('svg');
		await expect.element(svg).toBeInTheDocument();
	});
});
