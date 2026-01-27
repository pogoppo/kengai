import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { GroupPage } from '../pages/GroupPage';
import { ArticlePage } from '../pages/ArticlePage';

test.describe('記事閲覧フロー', () => {
    test('トップページからグループを辿って記事詳細を閲覧し、戻ることができる', async ({ page }) => {
        const homePage = new HomePage(page);
        const groupPage = new GroupPage(page);
        const articlePage = new ArticlePage(page);

        // 1. トップページへアクセス
        await homePage.goto('/');

        // 2. 開発用グループへ遷移
        await homePage.clickGroupBySlug('_mock');

        // URL確認
        await expect(page).toHaveURL(/\/group\/_mock/);

        // 3. 記事リストから記事をクリック
        await groupPage.clickArticle('_mock', 0);

        // 4. 記事詳細ページの表示確認
        await expect(articlePage.articleTitle).toBeVisible();

        // 5. パンくずリストでホームに戻る
        const homeBreadcrumb = articlePage.getBreadcrumbLink('/');
        await expect(homeBreadcrumb).toBeVisible();
        await homeBreadcrumb.click();
        await expect(page).toHaveURL(/\/$/);
    });
});
