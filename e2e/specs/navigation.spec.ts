import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('画面遷移フロー', () => {
    test('ホームからグループ詳細へ遷移できること', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto('/');

        // 最初のグループをクリック
        await homePage.clickGroup(0);

        // URLが /group/ を含むか確認
        await expect(page).toHaveURL(/\/group\/.+/);
    });

    test('ホームからカテゴリ一覧へ遷移できること', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto('/');

        // 最初のカテゴリーをクリック
        await homePage.clickCategory(0);

        // URLが /category/ を含むか確認
        await expect(page).toHaveURL(/\/category\/.+/);
    });
});