import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { HomePage } from '../pages/HomePage';

test.describe('検索機能', () => {
  test('ホーム画面から検索できること', async ({ page }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    await homePage.goto('/');
    await homePage.search('ロープ');

    // URL遷移確認 (URLエンコードされた文字列を含むか)
    await expect(page).toHaveURL(/search\?q=/);

    // 検索結果が表示されること
    await expect(searchPage.resultsHeading).toContainText('ロープ');
    // 少なくとも1件は見つかるはず（ロープの記事があるため）
    await expect(searchPage.articleItems.first()).toBeVisible();
  });

  test('検索ページで再検索できること', async ({ page }) => {
    const searchPage = new SearchPage(page);
    // "テント"で初期検索
    await searchPage.gotoSearch('テント');

    await expect(searchPage.resultsHeading).toContainText('テント');
    await expect(searchPage.articleItems.first()).toBeVisible();

    // "ロープ"で再検索
    await searchPage.search('ロープ');

    // URLと結果が更新されること
    await expect(page).toHaveURL(/search\?q=/);
    await expect(searchPage.resultsHeading).toContainText('ロープ');
    await expect(searchPage.articleItems.first()).toBeVisible();
  });

  test('該当なしの場合メッセージが表示されること', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.gotoSearch('存在しないキーワードXYZ');

    await expect(searchPage.noArticlesMessage).toBeVisible();
    await expect(searchPage.articleItems).toHaveCount(0);
  });

  test('クエリパラメータなしでアクセスした場合', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.gotoSearch();

    // 検索結果0件の表示になる
    await expect(searchPage.noArticlesMessage).toBeVisible();
    await expect(searchPage.articleItems).toHaveCount(0);
  });
});
