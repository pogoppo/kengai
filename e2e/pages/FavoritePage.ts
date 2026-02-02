import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FavoritePage extends BasePage {
	readonly pageTitle: Locator;
	readonly editButton: Locator;
	readonly deleteButton: Locator;
	readonly articleList: Locator;
	readonly articleCheckboxes: Locator;

	constructor(page: Page) {
		super(page);
		this.pageTitle = page.locator('h2');
		this.editButton = page.getByRole('button', { name: /編集|キャンセル/ });
		this.deleteButton = page.getByRole('button', { name: /削除/ });
		this.articleList = page.locator('.article-list');
		this.articleCheckboxes = page.locator('input[type="checkbox"]');
	}

	async clickEdit() {
		await this.editButton.click();
	}

	async checkArticle(index: number) {
		// チェックボックスのラベル要素をクリックすることで、視覚要素による干渉を回避
		await this.page.locator('.checkbox-basic').nth(index).click({ force: true });
	}

	async clickDelete() {
		await this.deleteButton.click();
	}

	async getArticleCount() {
		const articles = await this.articleList.locator('> li').count();
		return articles;
	}

	getArticleBySlug(slug: string): Locator {
		return this.page.locator(`[href*="/article/${slug}"]`);
	}
}
