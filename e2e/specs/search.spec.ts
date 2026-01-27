import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test.describe('検索機能', () => {
  test('検索ページで再検索できること', async ({ page }) => {
    const searchPage = new SearchPage(page);
    // 初期検索
    await searchPage.gotoSearch('記事タイトル1');

    await expect(searchPage.resultsHeading).toContainText('記事タイトル1');
    await expect(searchPage.articleItems.first()).toBeVisible();

    // 別のキーワードで再検索
    await searchPage.search('記事タイトル2');

    // URLと結果が更新されること
    await expect(page).toHaveURL(/search\?q=/);
    await expect(searchPage.resultsHeading).toContainText('記事タイトル2');
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
    await expect(searchPage.queryEmptyMessage).toBeVisible();
    await expect(searchPage.articleItems).toHaveCount(0);
  });
});
