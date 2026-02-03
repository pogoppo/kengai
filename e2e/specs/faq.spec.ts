import { test, expect } from '@playwright/test';
import { FaqPage } from '../pages/FaqPage';

test.describe('FAQページ', () => {
	test('ページタイトルとセクションが正しく表示される', async ({ page }) => {
		const faqPage = new FaqPage(page);
		await faqPage.goto('/faq');

		// ページタイトルの確認
		await expect(page).toHaveTitle(/よくある質問/);

		// 少なくとも1つのセクションヘッダーが表示されていることを確認
		await expect(faqPage.headings.first()).toBeVisible();

		// アコーディオンアイテムが表示されていることを確認
		await expect(faqPage.accordionItems.first()).toBeVisible();
	});

	test('アコーディオンの開閉動作', async ({ page }) => {
		const faqPage = new FaqPage(page);
		await faqPage.goto('/faq');

		const firstItem = faqPage.accordionItems.first();
		const summary = firstItem.locator('summary');
		const content = firstItem.locator('.item-content');

		// 初期状態は閉じている
		await expect(firstItem).not.toHaveAttribute('open');
		await expect(content).not.toBeVisible();

		// クリックして開く
		await summary.click();
		await expect(firstItem).toHaveAttribute('open');
		await expect(content).toBeVisible();

		// もう一度クリックして閉じる
		await summary.click();
		await expect(firstItem).not.toHaveAttribute('open');
		await expect(content).not.toBeVisible();
	});

	test('ハッシュ付きURLでアクセスすると該当項目が自動的に開く', async ({ page }) => {
		const faqPage = new FaqPage(page);
		await faqPage.goto('/faq');

		// 最初の項目のIDを取得してテストに使用
		const firstItem = faqPage.accordionItems.first();
		const id = await firstItem.getAttribute('id');
		expect(id).not.toBeNull();

		await faqPage.goto(`/faq#${id}`);

		const targetItem = faqPage.getAccordionItemById(id!);

		// 自動的に開いていることを確認
		await expect(targetItem).toHaveAttribute('open');
		await expect(targetItem.locator('.item-content')).toBeVisible();
	});

	test('パンくずリストが表示されている', async ({ page }) => {
		const faqPage = new FaqPage(page);
		await faqPage.goto('/faq');

		const breadcrumbs = page.locator('.breadcrumbs');
		await expect(breadcrumbs).toBeVisible();
		await expect(breadcrumbs).toContainText('よくある質問');
	});
});
