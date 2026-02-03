import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FaqPage extends BasePage {
	readonly headings: Locator;
	readonly accordionItems: Locator;

	constructor(page: Page) {
		super(page);
		this.headings = page.locator('h2');
		this.accordionItems = page.locator('.accordion-item');
	}

	getAccordionItemById(id: string): Locator {
		return this.page.locator(`#${id}.accordion-item`);
	}

	async toggleAccordion(index: number) {
		const item = this.accordionItems.nth(index);
		const summary = item.locator('summary');
		await summary.click();
	}
}
