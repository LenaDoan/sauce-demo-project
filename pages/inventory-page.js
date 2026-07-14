import { expect } from '@playwright/test';
import { BasePage } from './base-page.js';

export class InventoryPage extends BasePage {
    constructor(page) {
        super(page);

        this.pageTitle = this.page.getByText('Products');
        this.inventoryItems = this.page.locator('.inventory_item');
        this.inventoryItemNames = this.page.locator('.inventory_item_name');
        this.inventoryItemPrices = this.page.locator('.inventory_item_price');
        this.productImages = this.page.locator('.inventory_item_img');
        this.cartBadge = this.page.locator('.shopping_cart_badge');
        this.cartIcon = this.page.locator('.shopping_cart_link');
        this.menuButton = this.page.getByRole('button', { name: /open menu/i });
        this.logoutButton = this.page.getByText('Logout');
        this.sortDropdown = this.page.locator('select').first();
        this.resetAppStateButton = this.page.getByText('Reset App State');
        this.allItemsMenuOption = this.page.getByText('All Items');
        this.aboutMenuOption = this.page.getByText('About');
    }

    async addProductToCart(item1) {
        const addToCartButton = this.page.locator('.inventory_item').filter({ has: this.page.locator('.inventory_item_name', { hasText: item1 }) }).locator('[data-test^="add-to-cart-"]');
        await addToCartButton.first().click();
    }

    async removeProductFromCart(item1) {
        const removeButton = this.page.locator('.inventory_item').filter({ has: this.page.locator('.inventory_item_name', { hasText: item1 }) }).locator('[data-test^="remove-"]');
        await removeButton.first().click();
    }

    async openProductDetail(productName) {
        await this.page.getByText(productName).click();
    }

    async openProductDetailFromImage() {
        await this.productImages.first().click();
    }

    async getInventoryItemCount() {
        return await this.inventoryItems.count();
    }

    async openCart() {
        await this.cartIcon.click();
    }

    async openMenu() {
        await this.menuButton.click();
    }

    async logout() {
        await this.openMenu();
        await this.logoutButton.click();
    }

    async sortProducts(optionValue) {
        await expect(this.sortDropdown).toBeVisible();
        await this.sortDropdown.selectOption(optionValue);
    }

    async assertInventoryPageVisible() {
        await expect(this.page).toHaveURL(/inventory/);
        await expect(this.pageTitle).toBeVisible();
    }

    async assertProductsCount(expectedCount) {
        const actualCount = await this.getInventoryItemCount();
        expect(actualCount, 'Expected the number of inventory products to match the test data').toBe(expectedCount);
    }

    async assertProductCardVisible(productName) {
        const card = this.inventoryItems.filter({ hasText: productName }).first();
        await expect(card.getByText(productName)).toBeVisible();
        await expect(card.getByText(/Add to cart/i)).toBeVisible();
        await expect(card.locator('.inventory_item_price')).toBeVisible();
    }

    async assertItemNamesSortedAsc() {
        const names = (await this.inventoryItemNames.allTextContents()).map((name) => name.trim());
        const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sortedNames);
    }

    async assertItemNamesSortedDesc() {
        const names = (await this.inventoryItemNames.allTextContents()).map((name) => name.trim());
        const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
        expect(names).toEqual(sortedNames);
    }

    async assertPricesSortedAsc() {
        const prices = (await this.inventoryItemPrices.allTextContents()).map((price) => Number(price.replace('$', '').trim()));
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    }

    async assertPricesSortedDesc() {
        const prices = (await this.inventoryItemPrices.allTextContents()).map((price) => Number(price.replace('$', '').trim()));
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    }

    async assertCartBadgeCount(expectedCount) {
        await expect(this.cartBadge).toHaveText(String(expectedCount));
    }

    async assertCartBadgeHidden() {
        await expect(this.cartBadge).toHaveCount(0);
    }

    async assertAddToCartButtonVisible(item1) {
        await expect(this.page.locator(`[data-test="add-to-cart-${item1}"]`)).toBeVisible();
    }

    async assertCartPageVisible() {
        await expect(this.page).toHaveURL(/cart/);
    }

    async assertProductDetailPageVisible(productName) {
        await expect(this.page).toHaveURL(/inventory-item/);
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    async assertMenuOptionsVisible() {
        await expect(this.allItemsMenuOption).toBeVisible();
        await expect(this.aboutMenuOption).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        await expect(this.resetAppStateButton).toBeVisible();
    }

    async assertLoginPageVisible() {
        await expect(this.page.getByPlaceholder('Username')).toBeVisible();
    }
}
