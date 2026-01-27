import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

test.describe('ホームページ', () => {
    test('重要な要素が表示されること', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto('/');

        // タイトル確認
        await expect(page).toHaveTitle(/KENGAI/); // アプリ名が含まれているか

        // 検索バーの表示確認
        await expect(homePage.searchInput).toBeVisible();

        // グループリンクが表示されているか
        await expect(homePage.groupLinks.first()).toBeVisible();

        // カテゴリーチップが表示されているか
        await expect(homePage.categoryChips.first()).toBeVisible();
    });

    test('検索できること', async ({ page }) => {
        const homePage = new HomePage(page);
        const searchPage = new SearchPage(page);

        await homePage.goto('/');
        await homePage.search('記事タイトル1');

        // URL遷移確認 (URLエンコードされた文字列を含むか)
        await expect(page).toHaveURL(/search\?q=/);

        // 検索結果が表示されること
        await expect(searchPage.resultsHeading).toContainText('記事タイトル1');
        await expect(searchPage.articleItems.first()).toBeVisible();
    });
});
