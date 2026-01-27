import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Chip from './Chip.svelte';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

describe('Chip', () => {
	test('ラベルとリンクが表示される', async () => {
		render(Chip, { href: '/test-link', label: 'Test Label' });

		const link = page.getByRole('link', { name: 'Test Label' });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '/test-link');
	});

	test('icon指定時にアイコンが表示される', async () => {
		render(Chip, { href: '/test-icon', label: 'Icon Label', icon: faCoffee });

		const link = page.getByRole('link', { name: 'Icon Label' });
		await expect.element(link).toBeInTheDocument();

		const svg = link.element().querySelector('svg');
		await expect.element(svg).toBeInTheDocument();
	});
});
