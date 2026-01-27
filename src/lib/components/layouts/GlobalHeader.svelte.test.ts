import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import GlobalHeader from './GlobalHeader.svelte';

vi.mock('$lib/paraglide/messages', () => ({
	m: {
		'app.name': () => 'Test App Name'
	}
}));

describe('GlobalHeader', () => {
	test('ロゴが表示され、トップページへのリンクが設定されている', async () => {
		render(GlobalHeader);

		const header = page.getByRole('banner');
		await expect.element(header).toBeInTheDocument();

		const link = header.getByRole('link', { name: 'Test App Name' });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '/');

		const img = header.getByAltText('Test App Name');
		await expect.element(img).toBeInTheDocument();
	});

	test('isHomeプロパティがtrueの場合、ロゴはh1タグで囲まれる', async () => {
		render(GlobalHeader, { isHome: true });

		const header = page.getByRole('banner');
		await expect.element(header).toBeInTheDocument();

		const heading = header.getByRole('heading', { level: 1, name: 'Test App Name' });
		await expect.element(heading).toBeInTheDocument();

		await expect.element(heading).toHaveClass('header-logo');
	});

	test('isHomeプロパティがfalse（デフォルト）の場合、ロゴはh1タグで囲まれない', async () => {
		render(GlobalHeader, { isHome: false });

		const header = page.getByRole('banner');
		await expect.element(header).toBeInTheDocument();

		const heading = header.getByRole('heading', { level: 1 });
		await expect.element(heading).not.toBeInTheDocument();

		const divWrapper = header.element().querySelector<HTMLDivElement>('div.header-logo');
		await expect.element(divWrapper).toBeInTheDocument();
	});
});
