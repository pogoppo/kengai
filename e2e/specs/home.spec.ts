import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

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

    test('検索入力が機能すること', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto('/');

        await homePage.search('テスト検索');
        // 現状はログ出力のみなので、エラーが出ないことを確認
        // 将来的にはURL遷移などをアサートする: await expect(page).toHaveURL(/search/);
    });
});
