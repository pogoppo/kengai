import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import LinkCard from './LinkCard.svelte';

const imgDataUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

describe('LinkCard', () => {
	const props = {
		label: 'Card Label',
		description: 'Card Description',
		image: imgDataUrl,
		href: '/card-link'
	};

	test('正しい内容とリンクでカードが表示される', async () => {
		render(LinkCard, props);

		const link = page.getByRole('link', { name: 'Card Label' });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '/card-link');

		await expect.element(page.getByText('Card Label')).toBeInTheDocument();
		await expect.element(page.getByText('Card Description')).toBeInTheDocument();
	});

	test('画像が正しい属性で表示される', async () => {
		render(LinkCard, props);

		const img = page.getByAltText('Card Label');
		await expect.element(img).toBeInTheDocument();
		await expect.element(img).toHaveAttribute('src', imgDataUrl);
	});
});
