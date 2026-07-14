import path from 'path';
import { test, expect } from '../fixtures/general-fixture.js';

const authFile = path.join(process.cwd(), 'playwright/.auth/inventory-auth.json');

test.describe('Inventory page - need to login already', () => {
    test.use({ storageState: authFile });

    test.beforeEach('Open the Sauce Demo inventory page', async ({ page }) => {
        await page.goto(process.env.INVENTORY_URL);
    });

    test('Verify the inventory page loads after a successful login', async ({ inventoryPage }) => {
        await test.step('Verify the inventory page is displayed', async () => {
            await inventoryPage.assertInventoryPageVisible();
        });
    });

    test('Verify all products are displayed on the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Verify all inventory items are visible', async () => {
            const expectedCount = inventoryData.listNumber;
            await inventoryPage.assertProductsCount(expectedCount);
            const actualCount = await inventoryPage.getInventoryItemCount();
            expect(actualCount).toBe(expectedCount);
        });
    });

    test('Verify product card information is displayed', async ({ inventoryPage, inventoryData }) => {
        await test.step('Verify the backpack card contains the expected details', async () => {
            await inventoryPage.assertProductCardVisible(inventoryData.productName);
        });
    });

    test('Sort products from A to Z', async ({ inventoryPage, inventoryData }) => {
        await test.step('Apply the A to Z sort order', async () => {
            await inventoryPage.sortProducts(inventoryData.sortOptions.az);
        });

        await test.step('Verify the resulting item names are sorted alphabetically', async () => {
            await inventoryPage.assertItemNamesSortedAsc();
        });
    });

    test('Sort products from Z to A', async ({ inventoryPage, inventoryData }) => {
        await test.step('Apply the Z to A sort order', async () => {
            await inventoryPage.sortProducts(inventoryData.sortOptions.za);
        });

        await test.step('Verify the resulting item names are sorted reverse alphabetically', async () => {
            await inventoryPage.assertItemNamesSortedDesc();
        });
    });

    test('Sort products by price from low to high', async ({ inventoryPage, inventoryData }) => {
        await test.step('Apply the low to high price sort order', async () => {
            await inventoryPage.sortProducts(inventoryData.sortOptions.lohi);
        });

        await test.step('Verify the prices are sorted from low to high', async () => {
            await inventoryPage.assertPricesSortedAsc();
        });
    });

    test('Sort products by price from high to low', async ({ inventoryPage, inventoryData }) => {
        await test.step('Apply the high to low price sort order', async () => {
            await inventoryPage.sortProducts(inventoryData.sortOptions.hilo);
        });

        await test.step('Verify the prices are sorted from high to low', async () => {
            await inventoryPage.assertPricesSortedDesc();
        });
    });

    test('Add one product to the cart from the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add the backpack to the cart', async () => {
            await inventoryPage.addProductToCart(inventoryData.item1);
        });

        await test.step('Verify the cart badge updates', async () => {
            await inventoryPage.assertCartBadgeCount(inventoryData.cartCounts.one);
        });
    });

    test('Add multiple products to the cart from the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add two products to the cart', async () => {
            await inventoryPage.addProductToCart(inventoryData.item1);
            await inventoryPage.addProductToCart(inventoryData.item2);
        });

        await test.step('Verify the cart badge shows the correct item count', async () => {
            await inventoryPage.assertCartBadgeCount(inventoryData.cartCounts.two);
        });
    });

    test('Remove a product from the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add a product and then remove it', async () => {
            await inventoryPage.addProductToCart(inventoryData.item1);
            await inventoryPage.removeProductFromCart(inventoryData.item1);
        });

        await test.step('Verify the remove action resets the button state', async () => {
            await inventoryPage.assertAddToCartButtonVisible(inventoryData.item3);
        });
    });

    test('Navigate to the cart page from the cart icon', async ({ inventoryPage }) => {
        await test.step('Open the cart', async () => {
            await inventoryPage.openCart();
        });

        await test.step('Verify the cart page is displayed', async () => {
            await inventoryPage.assertCartPageVisible();
        });
    });

    test('Open a product detail page from the product name', async ({ inventoryPage, inventoryData }) => {
        await test.step('Open the backpack detail page', async () => {
            await inventoryPage.openProductDetail(inventoryData.productName);
        });

        await test.step('Verify the product detail page is displayed', async () => {
            await inventoryPage.assertProductDetailPageVisible(inventoryData.productName);
        });
    });

    test('Open a product detail page from the product image', async ({ inventoryPage, inventoryData }) => {
        await test.step('Open the backpack detail page from the image', async () => {
            await inventoryPage.openProductDetailFromImage();
        });

        await test.step('Verify the product detail page is displayed', async () => {
            await inventoryPage.assertProductDetailPageVisible(inventoryData.productName);
        });
    });

    test('Open the burger menu and view its options', async ({ inventoryPage }) => {
        await test.step('Open the menu', async () => {
            await inventoryPage.openMenu();
        });

        await test.step('Verify the menu options are displayed', async () => {
            await inventoryPage.assertMenuOptionsVisible();
        });
    });

    test('Logout from the inventory page', async ({ inventoryPage }) => {
        await test.step('Log out from the application', async () => {
            await inventoryPage.logout();
        });

        await test.step('Verify the user is redirected to the login page', async () => {
            await inventoryPage.assertLoginPageVisible();
        });
    });

    test('Reset app state clears the cart', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add a product and reset the app state', async () => {
            await inventoryPage.addProductToCart(inventoryData.item1);
            await inventoryPage.openMenu();
            await inventoryPage.resetAppStateButton.click();
        });

        await test.step('Verify the cart badge is cleared', async () => {
            await inventoryPage.assertCartBadgeHidden();
        });
    });
});

test.describe('Inventory page - not loggin', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test('Accessing the inventory page without login redirects the user', async ({ inventoryPage, page, inventoryData }) => {
        await test.step('Open the inventory URL directly', async () => {
            await page.goto(inventoryData.directInventoryUrl);
        });

        await test.step('Verify the user is redirected to the login experience', async () => {
            await inventoryPage.assertLoginPageVisible();
        });
    });
});
