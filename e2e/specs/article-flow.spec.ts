import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { GroupPage } from '../pages/GroupPage';
import { ArticlePage } from '../pages/ArticlePage';

test.describe('記事閲覧フロー (User Journey)', () => {
    test('トップページからカテゴリを辿って記事詳細を閲覧し、戻ることができる', async ({ page }) => {
        const homePage = new HomePage(page);
        const groupPage = new GroupPage(page);
        const articlePage = new ArticlePage(page);

        // 1. トップページへアクセス
        await homePage.goto('/');

        // 2. 「釣り・船上ノウハウ」 (Ocean) グループへ遷移
        // hrefに /group/ocean を含むリンクをクリック
        await homePage.clickGroupBySlug('ocean');

        // URL確認
        await expect(page).toHaveURL(/\/group\/ocean/);

        // 3. 記事リスト（「ロープワーク」セクション）から記事をクリック
        // rope-work カテゴリの最初の記事をクリック
        await groupPage.clickArticle('rope-work', 0);

        // 4. 記事詳細ページの表示確認
        // 記事タイトルが表示されているか
        await expect(articlePage.articleTitle).toBeVisible();

        // 5. パンくずリストで戻る
        // パンくずリストの「ホーム」をクリックしてトップに戻る動作を確認
        const homeBreadcrumb = articlePage.getBreadcrumbLink('/');
        await expect(homeBreadcrumb).toBeVisible();
        await homeBreadcrumb.click();

        // ホームに戻ったか確認
        await expect(page).toHaveURL(/\/$/);
    });
});
