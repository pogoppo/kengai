import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
	readonly articleTitle: Locator;
	readonly breadcrumbs: Locator;
	readonly contentBody: Locator;

	constructor(page: Page) {
		super(page);
		this.articleTitle = page.locator('h1'); // 記事タイトル
		this.breadcrumbs = page.locator('.breadcrumbs'); // パンくずリスト
		this.contentBody = page.locator('main article'); // 記事本文エリア (仮定)
	}

	getBreadcrumbLink(path: string): Locator {
		return this.breadcrumbs.locator(`a[href="${path}"]`);
	}
}
