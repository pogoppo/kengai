import { createRawSnippet } from 'svelte';
import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import ButtonBasic from './ButtonBasic.svelte';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

describe('ButtonBasic', () => {
	test('デフォルトの状態でボタンがレンダリングされる', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>テストボタン</span>'
		}));
		render(ButtonBasic, {
			children
		});

		const button = page.getByRole('button', { name: 'テストボタン' });
		await expect.element(button).toBeInTheDocument();
	});

	test('as="a"を指定するとリンクとしてレンダリングされる', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>リンクボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			as: 'a',
			href: '/test-link'
		});

		const link = page.getByRole('link', { name: 'リンクボタン' });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '/test-link');
	});

	test('variant="primary"が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>プライマリーボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			variant: 'primary'
		});

		const button = page.getByRole('button', { name: 'プライマリーボタン' });
		await expect.element(button).toHaveAttribute('data-variant', 'primary');
	});

	test('variant="accent"が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>アクセントボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			variant: 'accent'
		});

		const button = page.getByRole('button', { name: 'アクセントボタン' });
		await expect.element(button).toHaveAttribute('data-variant', 'accent');
	});

	test('variant="danger"が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>危険ボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			variant: 'danger'
		});

		const button = page.getByRole('button', { name: '危険ボタン' });
		await expect.element(button).toHaveAttribute('data-variant', 'danger');
	});

	test('iconを指定するとアイコンが表示される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>アイコン付きボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			icon: faCoffee
		});

		const button = page.getByRole('button', { name: 'アイコン付きボタン' });
		await expect.element(button).toBeInTheDocument();

		const svg = button.element().querySelector('svg');
		await expect.element(svg).toBeInTheDocument();
	});

	test('rounded="true"が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>丸いボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			rounded: true
		});

		const button = page.getByRole('button', { name: '丸いボタン' });
		await expect.element(button).toHaveAttribute('data-rounded', 'true');
	});

	test('rounded="false"が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>角ばったボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			rounded: false
		});

		const button = page.getByRole('button', { name: '角ばったボタン' });
		await expect.element(button).toHaveAttribute('data-rounded', 'false');
	});

	test('disabled属性が正しく適用される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>無効なボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			disabled: true
		});

		const button = page.getByRole('button', { name: '無効なボタン' });
		await expect.element(button).toBeDisabled();
	});

	test('その他の属性が正しく渡される', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>カスタム属性ボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			'data-testid': 'custom-button',
			'aria-label': 'カスタムラベル'
		});

		const button = page.getByRole('button', { name: 'カスタムラベル' });
		await expect.element(button).toHaveAttribute('data-testid', 'custom-button');
		await expect.element(button).toHaveAttribute('aria-label', 'カスタムラベル');
	});

	test('class属性を渡すと警告が表示され、属性は適用されない', async () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const children = createRawSnippet(() => ({
			render: () => '<span>テストボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			class: 'custom-class'
		});

		const button = page.getByRole('button', { name: 'テストボタン' });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).not.toHaveClass('custom-class');

		expect(consoleWarnSpy).toHaveBeenCalledWith('ButtonBasic does not accept "class" prop.');

		consoleWarnSpy.mockRestore();
	});

	test('複数のプロパティを組み合わせて使用できる', async () => {
		const children = createRawSnippet(() => ({
			render: () => '<span>複合ボタン</span>'
		}));
		render(ButtonBasic, {
			children,
			variant: 'accent',
			icon: faCoffee,
			rounded: true,
			'data-testid': 'combined-button'
		});

		const button = page.getByRole('button', { name: '複合ボタン' });
		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveAttribute('data-variant', 'accent');
		await expect.element(button).toHaveAttribute('data-rounded', 'true');
		await expect.element(button).toHaveAttribute('data-testid', 'combined-button');

		const svg = button.element().querySelector('svg');
		await expect.element(svg).toBeInTheDocument();
	});
});
