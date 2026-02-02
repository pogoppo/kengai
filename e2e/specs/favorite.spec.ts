import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { FavoritePage } from '../pages/FavoritePage';

test.describe('お気に入り機能', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にlocalStorageをクリアしてページをリロード
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('記事をお気に入りに追加してお気に入りページで確認できる', async ({ page }) => {
    const homePage = new HomePage(page);
    const favoritePage = new FavoritePage(page);

    // 1. トップページへアクセス
    await homePage.goto('/');

    // 2. 記事詳細ページに遷移（開発用のモック記事を使用）
    await page.goto('/article/_mock/example');

    // 3. お気に入り追加ボタンをクリック
    const favoriteButton = page.getByRole('button', { name: /お気に入り/ });
    await expect(favoriteButton).toBeVisible();
    await favoriteButton.click();

    // 4. お気に入りページに遷移
    await page.goto('/favorite');

    // 5. お気に入りに追加した記事が表示されることを確認
    const articleLink = favoritePage.getArticleBySlug('_mock/example');
    await expect(articleLink).toBeVisible();
  });

  test('グローバルナビゲーションからお気に入りページに遷移できる', async ({ page }) => {
    await page.goto('/');

    // お気に入りリンクをクリック
    const favoriteNavLink = page.getByRole('link', { name: /お気に入り/ });
    await expect(favoriteNavLink).toBeVisible();
    await favoriteNavLink.click();

    // お気に入りページに遷移したことを確認
    await expect(page).toHaveURL(/\/favorite/);
  });

  test('お気に入りページで編集モードに切り替えられる', async ({ page }) => {
    const favoritePage = new FavoritePage(page);

    // 事前にお気に入りを追加
    await page.goto('/article/_mock/example');
    const favoriteButton = page.getByRole('button', { name: /お気に入り/ });
    await favoriteButton.click();

    // お気に入りページへ
    await favoritePage.goto('/favorite');

    // 編集ボタンをクリック
    await favoritePage.clickEdit();

    // チェックボックスが表示されることを確認
    await expect(favoritePage.articleCheckboxes.first()).toBeVisible();

    // 削除ボタンが表示されることを確認（ただし無効状態）
    await expect(favoritePage.deleteButton).toBeVisible();
    await expect(favoritePage.deleteButton).toBeDisabled();
  });

  test('お気に入りから記事を削除できる', async ({ page }) => {
    const favoritePage = new FavoritePage(page);

    // 事前に2つの記事をお気に入りに追加
    await page.goto('/article/_mock/example');
    await page.getByRole('button', { name: /お気に入り/ }).click();

    await page.goto('/article/_mock/example2');
    await page.getByRole('button', { name: /お気に入り/ }).click();

    // お気に入りページへ
    await favoritePage.goto('/favorite');

    // 初期状態で2つの記事があることを確認
    const initialCount = await favoritePage.getArticleCount();
    expect(initialCount).toBeGreaterThanOrEqual(2);

    // 編集モードに切り替え
    await favoritePage.clickEdit();

    // 最初の記事をチェック
    await favoritePage.checkArticle(0);

    // 削除ボタンが有効になることを確認
    await expect(favoritePage.deleteButton).toBeEnabled();

    // 確認ダイアログのハンドリング
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });

    // 削除を実行
    await favoritePage.clickDelete();

    // 記事が減っていることを確認（少し待機してDOMが更新されるのを待つ）
    await page.waitForTimeout(500);
    const finalCount = await favoritePage.getArticleCount();
    expect(finalCount).toBeLessThan(initialCount);
  });

  test('お気に入りに登録済みの記事ではボタンがハイライト表示される', async ({ page }) => {
    // 記事をお気に入りに追加
    await page.goto('/article/_mock/example');
    const favoriteButton = page.getByRole('button', { name: /お気に入り/ });
    await favoriteButton.click();

    // ページをリロードして状態を確認
    await page.reload();

    // ボタンがハイライト表示されていることを確認
    await expect(favoriteButton).toHaveAttribute('data-highlight', 'true');
  });

  test('お気に入りボタンを再度クリックすると登録解除される', async ({ page }) => {
    // 記事をお気に入りに追加
    await page.goto('/article/_mock/example');
    const favoriteButton = page.getByRole('button', { name: /お気に入り/ });
    await favoriteButton.click();

    // ハイライト表示を確認
    await expect(favoriteButton).toHaveAttribute('data-highlight', 'true');

    // もう一度クリックして解除
    await favoriteButton.click();

    // ハイライトが解除されることを確認
    await expect(favoriteButton).toHaveAttribute('data-highlight', 'false');

    // お気に入りページで記事がないことを確認
    await page.goto('/favorite');
    const articleLink = page.locator('[href*="/article/_mock/example"]');
    await expect(articleLink).not.toBeVisible();
  });

  test('複数の記事をお気に入りに追加して一括削除できる', async ({ page }) => {
    const favoritePage = new FavoritePage(page);

    // 2つの記事をお気に入りに追加
    await page.goto(`/article/_mock/example`);
    await page.getByRole('button', { name: /お気に入り/ }).click();
    await page.goto(`/article/_mock/example2`);
    await page.getByRole('button', { name: /お気に入り/ }).click();

    // お気に入りページへ
    await favoritePage.goto('/favorite');

    // 初期状態で2つの記事があることを確認
    const initialCount = await favoritePage.getArticleCount();
    expect(initialCount).toBe(2);

    // 編集モードに切り替え
    await favoritePage.clickEdit();

    // 記事をチェック
    await favoritePage.checkArticle(0);
    await favoritePage.checkArticle(1);

    // 確認ダイアログのハンドリング
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // 削除を実行
    await favoritePage.clickDelete();

    // 削除後、記事が残っていないことを確認
    const finalCount = await favoritePage.getArticleCount();
    expect(finalCount).toBe(0);

    // 編集ボタンが無効になっていることを確認
    await expect(favoritePage.editButton).toBeDisabled();
  });
});
