import { expect } from '@playwright/test'
export class BasePage {
    constructor(page) {
        this.page = page;

        //Locator
    }

    async navigateToPage() {
        //
    }

    getLocator(selector) {
        return this.page.locator(selector);
    }

    getByButton(buttonName) {
        return this.page.getByRole('button', { name: buttonName });
    }

    getByPlaceholder(text) {
        return this.page.getByPlaceholder(text);
    }

    async getInnerText(selector) {
        const text = await selector.innerText();
        return text;
    }
}