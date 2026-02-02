import { describe, test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import CheckboxBasic from './CheckboxBasic.svelte';

describe('CheckboxBasic', () => {
	test('デフォルトの状態でチェックボックスがレンダリングされる', async () => {
		render(CheckboxBasic, {
			ariaLabel: 'テストチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'テストチェックボックス' });
		await expect.element(checkbox).toBeInTheDocument();
		await expect.element(checkbox).not.toBeChecked();
	});

	test('checked="true"を指定するとチェック状態でレンダリングされる', async () => {
		render(CheckboxBasic, {
			checked: true,
			ariaLabel: 'チェック済みチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'チェック済みチェックボックス' });
		await expect.element(checkbox).toBeChecked();
	});

	test('disabled="true"を指定すると無効状態でレンダリングされる', async () => {
		render(CheckboxBasic, {
			disabled: true,
			ariaLabel: '無効なチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: '無効なチェックボックス' });
		await expect.element(checkbox).toBeDisabled();
	});

	test('name属性が正しく適用される', async () => {
		render(CheckboxBasic, {
			name: 'test-checkbox',
			ariaLabel: 'name属性付きチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'name属性付きチェックボックス' });
		await expect.element(checkbox).toHaveAttribute('name', 'test-checkbox');
	});

	test('value属性が正しく適用される', async () => {
		render(CheckboxBasic, {
			value: 'test-value',
			ariaLabel: 'value属性付きチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'value属性付きチェックボックス' });
		await expect.element(checkbox).toHaveAttribute('value', 'test-value');
	});

	test('aria-label属性が正しく適用される', async () => {
		render(CheckboxBasic, {
			ariaLabel: 'カスタムアリアラベル'
		});

		const checkbox = page.getByRole('checkbox', { name: 'カスタムアリアラベル' });
		await expect.element(checkbox).toHaveAttribute('aria-label', 'カスタムアリアラベル');
	});

	test('aria-labelledby属性が正しく適用される', async () => {
		render(CheckboxBasic, {
			ariaLabelledby: 'label-id'
		});

		const checkbox = page.getByRole('checkbox');
		await expect.element(checkbox).toHaveAttribute('aria-labelledby', 'label-id');
	});

	test('aria-describedby属性が正しく適用される', async () => {
		render(CheckboxBasic, {
			ariaDescribedby: 'description-id',
			ariaLabel: 'description付きチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'description付きチェックボックス' });
		await expect.element(checkbox).toHaveAttribute('aria-describedby', 'description-id');
	});

	test('クリックでチェック状態が切り替わる', async () => {
		render(CheckboxBasic, {
			ariaLabel: 'クリック可能なチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'クリック可能なチェックボックス' });
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.click(checkbox, { force: true });
		await expect.element(checkbox).toBeChecked();

		await userEvent.click(checkbox, { force: true });
		await expect.element(checkbox).not.toBeChecked();
	});

	test('スペースキーでチェック状態が切り替わる', async () => {
		render(CheckboxBasic, {
			ariaLabel: 'キーボード操作可能なチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', {
			name: 'キーボード操作可能なチェックボックス'
		});
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.click(checkbox, { force: true }); // フォーカスを当てる
		await userEvent.keyboard(' ');
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.keyboard(' ');
		await expect.element(checkbox).toBeChecked();
	});

	test('Enterキーでチェック状態が切り替わる', async () => {
		render(CheckboxBasic, {
			ariaLabel: 'Enter操作可能なチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'Enter操作可能なチェックボックス' });
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.click(checkbox, { force: true }); // フォーカスを当てる
		await userEvent.keyboard('{Enter}');
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.keyboard('{Enter}');
		await expect.element(checkbox).toBeChecked();
	});

	test('無効状態ではクリックできない', async () => {
		render(CheckboxBasic, {
			disabled: true,
			ariaLabel: '無効なクリック不可チェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: '無効なクリック不可チェックボックス' });
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.click(checkbox, { force: true });
		await expect.element(checkbox).not.toBeChecked();
	});

	test('無効状態ではキーボード操作できない', async () => {
		render(CheckboxBasic, {
			disabled: true,
			ariaLabel: '無効なキーボード操作不可チェックボックス'
		});

		const checkbox = page.getByRole('checkbox', {
			name: '無効なキーボード操作不可チェックボックス'
		});
		await expect.element(checkbox).not.toBeChecked();

		await userEvent.click(checkbox, { force: true }); // フォーカスを当てようとする
		await userEvent.keyboard(' ');
		await expect.element(checkbox).not.toBeChecked();
	});

	test('onchange コールバックが呼び出される', async () => {
		const onchangeMock = vi.fn();

		render(CheckboxBasic, {
			onchange: onchangeMock,
			ariaLabel: 'onchange付きチェックボックス'
		});

		const checkbox = page.getByRole('checkbox', { name: 'onchange付きチェックボックス' });
		await userEvent.click(checkbox, { force: true });

		expect(onchangeMock).toHaveBeenCalledOnce();
	});

	test('チェック状態に応じてdata-checked属性が変わる', async () => {
		const { container } = render(CheckboxBasic, {
			ariaLabel: 'data-checked確認用チェックボックス'
		});

		const checkboxVisual = container.querySelector<HTMLElement>('checkbox-visual');
		await expect.element(checkboxVisual).toHaveAttribute('data-checked', 'false');

		const checkbox = page.getByRole('checkbox', { name: 'data-checked確認用チェックボックス' });
		await userEvent.click(checkbox, { force: true });
		await expect.element(checkboxVisual).toHaveAttribute('data-checked', 'true');
	});

	test('無効状態のときdata-disabled属性が設定される', async () => {
		const { container } = render(CheckboxBasic, {
			disabled: true,
			ariaLabel: 'data-disabled確認用チェックボックス'
		});

		const label = container.querySelector<HTMLLabelElement>('.checkbox-basic');
		await expect.element(label).toHaveAttribute('data-disabled', 'true');
	});

	test('有効状態のときdata-disabled属性がfalseになる', async () => {
		const { container } = render(CheckboxBasic, {
			disabled: false,
			ariaLabel: 'data-disabled確認用チェックボックス'
		});

		const label = container.querySelector<HTMLLabelElement>('.checkbox-basic');
		await expect.element(label).toHaveAttribute('data-disabled', 'false');
	});

	test('複数のプロパティを組み合わせて使用できる', async () => {
		render(CheckboxBasic, {
			checked: true,
			name: 'combined-checkbox',
			value: 'combined-value',
			ariaLabel: '複合チェックボックス',
			ariaDescribedby: 'description-id'
		});

		const checkbox = page.getByRole('checkbox', { name: '複合チェックボックス' });
		await expect.element(checkbox).toBeInTheDocument();
		await expect.element(checkbox).toBeChecked();
		await expect.element(checkbox).toHaveAttribute('name', 'combined-checkbox');
		await expect.element(checkbox).toHaveAttribute('value', 'combined-value');
		await expect.element(checkbox).toHaveAttribute('aria-describedby', 'description-id');
	});
});
