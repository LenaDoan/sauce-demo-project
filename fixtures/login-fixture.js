import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page.js';
import { InventoryPage } from '../pages/inventory-page.js';
import { getLoginData } from '../utils/data-loader.js';
import { getInventoryData } from '../utils/data-loader.js';

export const test = base.extend({

    loginData: async ({ }, use) => {
        const data = getLoginData();
        await use(data);
    },

    loginPage: async ({ page }, use) => {
        const login = new LoginPage(page);
        await use(login);
    },

    inventoryData: async ({ page }, use) => {
        const data = getInventoryData();
        await use(data);
    },

    inventoryPage: async ({ page }, use) => {
        const inventory = new InventoryPage(page);
        await use(inventory);
    }
})
export { expect };