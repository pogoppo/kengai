import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resultsHeading: Locator;
  readonly articleList: Locator;
  readonly articleItems: Locator;
  readonly noArticlesMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[type="search"]');
    this.searchButton = page.locator('.search-button');
    this.resultsHeading = page.locator('.search-heading');
    this.articleList = page.locator('.article-list');
    this.articleItems = page.locator('.article-list > li');
    this.noArticlesMessage = page.locator('.no-articles');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async gotoSearch(query?: string) {
    if (query) {
      await this.goto(`/search?q=${encodeURIComponent(query)}`);
    } else {
      await this.goto('/search');
    }
  }

  async getResultCount() {
    return await this.articleItems.count();
  }
}
