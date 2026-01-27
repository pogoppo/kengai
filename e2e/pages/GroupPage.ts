import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class GroupPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * 指定したカテゴリの記事リストを取得
     * @param categorySlug カテゴリのスラッグ (例: 'rope-work')
     */
    getArticleList(categorySlug: string): Locator {
        // 特定のカテゴリセクションを探すロジック。
        // 現状のDOM構造が明確でないため、hrefに特定のカテゴリを含むリンクを探す戦略をとる
        // または、親コンポーネントを特定できるならそこから絞り込む
        return this.page.locator(`a[href*="/article/${categorySlug}/"]`);
    }

    /**
     * 指定したカテゴリのN番目の記事をクリック
     */
    async clickArticle(categorySlug: string, index: number = 0) {
        const articles = this.getArticleList(categorySlug);
        await articles.nth(index).click();
    }
}
