import { type Page, type Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly navigation: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('header'); // 仮定: GlobalHeader
        this.navigation = page.locator('nav'); // 仮定: GlobalNavigation
    }

    async goto(path: string) {
        await this.page.goto(path);
    }

    async getTitle() {
        return await this.page.title();
    }
}
