import { expect } from '@playwright/test';
import { BasePage } from './base-page.js';
import * as helper from '../utils/helper.js';

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
        this.sortDropdown = this.page.getByTestId('product-sort-container');
        this.resetAppStateButton = this.page.getByText('Reset App State');
        this.allItemsMenuOption = this.page.getByText('All Items');
        this.aboutMenuOption = this.page.getByText('About');
        this.items = this.page.getByTestId('inventory-item');
        this.addToCartButtons = this.page.getByRole('button', { name: /add to cart/i });
    }

    async openInventoryPage() {
        await this.page.goto('/inventory.html');
    }

    async addProductToCart(item1) {
        const addToCartButton = this.items.filter({ hasText: item1 }).getByRole('button', { name: /add to cart/i }).first();
        await addToCartButton.click();
    }

    async removeProductFromCart(item1) {
        const removeButton = this.items.filter({  hasText: item1 }).getByRole('button', { name: /remove/i }).first();
        await removeButton.click();
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

    getInventoryName(name){
        const card = this.inventoryItems.filter({ hasText: name });
        return {
            card,
            name: card.locator('.inventory_item_name'),
            price: card.locator('.inventory_item_price'),
            description: card.locator('.inventory_item_desc'),
            addToCartButton: card.getByRole('button', { name: /add to cart/i }),
        }
    }

    async assertItemNamesSortedAsc() {
        const names = (await this.inventoryItemNames.allTextContents()).map((name) => name.trim());
        const sortedNames = helper.sortAToZString(names);
        expect(names).toEqual(sortedNames);
    }

    async assertItemNamesSortedDesc() {
        const names = (await this.inventoryItemNames.allTextContents()).map((name) => name.trim());
        const sortedNames = helper.sortZToAString(names);
        expect(names).toEqual(sortedNames);
    }

    async assertPricesSortedAsc() {
        const prices = (await this.inventoryItemPrices.allTextContents()).map((price) => Number(price.replace('$', '').trim()));
        const sortedPrices = helper.sortAToZNumber(prices);
        expect(prices).toEqual(sortedPrices);
    }

    async assertPricesSortedDesc() {
        const prices = (await this.inventoryItemPrices.allTextContents()).map((price) => Number(price.replace('$', '').trim()));
        const sortedPrices = helper.sortZToANumber(prices);
        expect(prices).toEqual(sortedPrices);
    }

    async assertCartBadgeHidden() {
        await expect(this.cartBadge).toHaveCount(0);
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
}
