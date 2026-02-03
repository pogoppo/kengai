import { describe, test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import AccordionList from './AccordionList.svelte';

describe('AccordionList', () => {
	const items = [
		{
			id: 'item-1',
			summary: 'Summary 1',
			content: '<p>Content 1</p>'
		},
		{
			id: 'item-2',
			summary: 'Summary 2',
			content: '<strong>Content 2</strong>'
		},
		{
			id: 'item-3',
			summary: 'Summary 3',
			content: 'Content 3'
		}
	];

	test('アコーディオンリストが正しくレンダリングされる', async () => {
		render(AccordionList, { items });

		const list = page.getByRole('list');
		await expect.element(list).toBeInTheDocument();

		const summaries = page.getByText(/Summary/);
		const count = summaries.length;
		expect(count).toBe(3);
	});

	test('各アイテムのサマリーとコンテンツが表示される', async () => {
		render(AccordionList, { items });

		await expect.element(page.getByText('Summary 1')).toBeInTheDocument();
		await expect.element(page.getByText('Summary 2')).toBeInTheDocument();
		await expect.element(page.getByText('Summary 3')).toBeInTheDocument();

		// コンテンツはDOM上に存在するが、detailsが閉じている場合は非表示の可能性がある
		// ただし、getByTextはDOM内の存在を確認するため、ここでは存在チェックを行う
		await expect.element(page.getByText('Content 1')).toBeInTheDocument();
		await expect.element(page.getByText('Content 2')).toBeInTheDocument();
		await expect.element(page.getByText('Content 3')).toBeInTheDocument();
	});

	test('デフォルトでは全てのdetailsが閉じている', async () => {
		render(AccordionList, { items });

		const details = page.getByRole('group');
		const allDetails = details.all();

		for (const detail of allDetails) {
			await expect.element(detail).not.toHaveAttribute('open');
		}
	});

	test('サマリーをクリックするとdetailsが開閉する', async () => {
		render(AccordionList, { items });

		const firstSummary = page.getByText('Summary 1');
		const firstDetails = firstSummary.element().parentElement;

		// 初期状態は閉じている
		await expect.element(firstDetails).not.toHaveAttribute('open');

		// クリックして開く
		await userEvent.click(firstSummary);
		await expect.element(firstDetails).toHaveAttribute('open');

		// 再度クリックして閉じる
		await userEvent.click(firstSummary);
		await expect.element(firstDetails).not.toHaveAttribute('open');
	});

	test('HTMLコンテンツが正しくレンダリングされる', async () => {
		render(AccordionList, { items });

		const strongContent = page.getByText('Content 2');
		await expect.element(strongContent).toBeInTheDocument();
		// Content 2がstrongタグで囲まれていることを確認
		expect(strongContent.element().tagName).toBe('STRONG');
	});

	test('空のリストを渡してもエラーにならない', async () => {
		render(AccordionList, { items: [] });

		const list = page.getByRole('list');
		await expect.element(list).toBeInTheDocument();

		const listItems = page.getByRole('listitem');
		const count = listItems.length;
		expect(count).toBe(0);
	});
});
