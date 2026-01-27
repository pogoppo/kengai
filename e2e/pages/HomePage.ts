import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly groupLinks: Locator;
    readonly categoryChips: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('input[type="search"]');
        this.searchButton = page.locator('.search-button');
        this.groupLinks = page.locator('.groups a');
        this.categoryChips = page.locator('.categories a');
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }

    async clickGroup(index: number) {
        await this.groupLinks.nth(index).click();
    }

    async clickGroupBySlug(slug: string) {
        await this.page.locator(`.groups a[href*="/group/${slug}"]`).click();
    }

    async clickCategory(index: number) {
        await this.categoryChips.nth(index).click();
    }
}
