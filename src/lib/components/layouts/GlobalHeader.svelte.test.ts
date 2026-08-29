import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import GlobalHeader from './GlobalHeader.svelte';
import { VISITED_STORAGE_KEY } from '$lib/stores/global.svelte';
import { m } from '$lib/paraglide/messages';

describe('GlobalHeader', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test('ロゴが表示され、トップページへのリンクが設定されている', async () => {
		render(GlobalHeader);

		const header = page.getByRole('banner');
		await expect.element(header).toBeInTheDocument();

		const link = header.getByRole('link', { name: 'KENGAI' });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '/');

		const img = header.getByAltText('KENGAI');
		await expect.element(img).toBeInTheDocument();
	});

	test('isHomeプロパティがtrueの場合、ロゴはh1タグで囲まれる', async () => {
		render(GlobalHeader, { isHome: true });

		const header = page.getByRole('banner');
		await expect.element(header).toBeInTheDocument();

		const heading = header.getByRole('heading', { level: 1, name: 'KENGAI' });
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

	test('初回アクセスではオフライン利用の案内が表示される', async () => {
		const { container } = render(GlobalHeader);

		// 表示までの遅延があるため要素が現れるまで待つ
		await vi.waitFor(
			() => {
				expect(container.querySelector('popover-box')).not.toBeNull();
			},
			{ timeout: 3000, interval: 100 }
		);

		const guide = container.querySelector('popover-box');
		expect(guide?.getAttribute('role')).toBe('tooltip');
		expect(guide?.textContent?.trim()).toBe(m['component.offline-info.guide']());
		expect(localStorage.getItem(VISITED_STORAGE_KEY)).toBe('true');
	});

	test('2回目以降のアクセスでは案内が表示されない', async () => {
		localStorage.setItem(VISITED_STORAGE_KEY, 'true');
		const { container } = render(GlobalHeader);

		// 表示までの遅延を過ぎても表示されないこと
		await new Promise((resolve) => setTimeout(resolve, 1500));

		expect(container.querySelector('popover-box')).toBeNull();
	});

	test('表示時間が経過すると案内が閉じる', async () => {
		const { container } = render(GlobalHeader);
		await vi.waitFor(
			() => {
				expect(container.querySelector('popover-box')).not.toBeNull();
			},
			{ timeout: 3000, interval: 100 }
		);

		// 遅延 + 表示時間 + トランジション終了後にDOMから削除される
		await vi.waitFor(
			() => {
				expect(container.querySelector('popover-box')).toBeNull();
			},
			{ timeout: 8000, interval: 100 }
		);
	});
});
