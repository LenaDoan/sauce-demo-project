import path from 'path';
import { test, expect } from '../fixtures/general-fixture.js';

test.describe('Verify UI of inventory page - Logged in', () => {
    test.beforeEach('Open the Sauce Demo inventory page', async ({ inventoryPage }) => {
        await inventoryPage.openInventoryPage();
    });

    test('Verify the inventory page loads after a successful login', async ({ inventoryPage, page }) => {
            await expect(page).toHaveURL(/inventory.html/);
            await expect(inventoryPage.pageTitle).toBeVisible();
    });

    test('Verify the number of products displays correctly', async ({ inventoryPage, inventoryData }) => {
        //Compare total number of Items on the inventory page
            const actualCount = await inventoryPage.getInventoryItemCount();
            await expect(actualCount).toBe(inventoryData.listNumber);
    });

    test('Verify a card includes the correct information', async ({ inventoryPage, inventoryData }) => {
            const item = inventoryPage.getInventoryName(inventoryData.cardInformation.name);
            await expect(item.card).toBeVisible();
            await expect(item.name).toHaveText(inventoryData.cardInformation.name);
            await expect(item.price).toHaveText(inventoryData.cardInformation.price);
            await expect(item.description).toHaveText(inventoryData.cardInformation.description);
            await expect(item.addToCartButton).toHaveText(/add to cart/i);
    });

    test('Add one product to the cart from the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add the backpack to the cart', async () => {
            await inventoryPage.addProductToCart(inventoryData.cardInformation.name);
        });

        await test.step('Verify the cart badge updates', async () => {
            await expect(inventoryPage.cartBadge).toHaveText('1');
        });
    });

    test('Add multiple products to the cart from the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add two products to the cart', async () => {
            await inventoryPage.addProductToCart(inventoryData.cardInformation.name);
            await inventoryPage.addProductToCart(inventoryData.cardInformation2.name);
        });

        await test.step('Verify the cart badge shows the correct item count', async () => {
            await expect(inventoryPage.cartBadge).toHaveText('2');
        });
    });

    test('Remove a product from the inventory page', async ({ inventoryPage, inventoryData }) => {
        await test.step('Add a product and then remove it', async () => {
            await inventoryPage.addProductToCart(inventoryData.cardInformation.name);
            await inventoryPage.removeProductFromCart(inventoryData.cardInformation.name);
        });

        await test.step('Verify the remove action resets the button state', async () => {
            const item = inventoryPage.getInventoryName(inventoryData.cardInformation.name);
            await expect(item.addToCartButton).toBeVisible();
        });
    });

    test('Navigate to the cart page from the cart icon', async ({ inventoryPage, page }) => {
        await test.step('Open the cart', async () => {
            await inventoryPage.openCart();
        });

        await test.step('Verify the cart page is displayed', async () => {
            await expect(page).toHaveURL(/cart/);
        });
    });

    test('Open a product detail page from the product name', async ({ inventoryPage, inventoryData, page }) => {
        await test.step('Open the backpack detail page', async () => {
            await inventoryPage.openProductDetail(inventoryData.productName);
        });

        await test.step('Verify the product detail page is displayed', async () => {
            await expect(page).toHaveURL(/inventory-item/);
            await expect(page.getByText(inventoryData.productName)).toBeVisible();
        });
    });

    test('Open a product detail page from the product image', async ({ inventoryPage, inventoryData, page }) => {
        await test.step('Open the backpack detail page from the image', async () => {
            await inventoryPage.openProductDetailFromImage();
        });

        await test.step('Verify the product detail page is displayed', async () => {
            await expect(page).toHaveURL(/inventory-item/);
            await expect(page.getByText(inventoryData.productName)).toBeVisible();
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

    test('Logout from the inventory page', async ({ inventoryPage, loginPage, page }) => {
        await test.step('Log out from the application', async () => {
            await inventoryPage.logout();
        });

        await test.step('Verify the user is redirected to the login page', async () => {
            await expect(loginPage.username).toBeVisible();
            await expect(page).toHaveURL('/');
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

test.describe('Sorting cases - Logged in', () => {
    test.beforeEach('Open the Sauce Demo inventory page', async ({ inventoryPage }) => {
        await inventoryPage.openInventoryPage();
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
});

test.describe('Inventory page - not loggin', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test('Accessing the inventory page without login, redirects to the login page', async ({ inventoryPage, inventoryData, loginPage, page }) => {
        await test.step('Open the inventory URL directly', async () => {
            await inventoryPage.openInventoryPage();
        });

        await test.step('Verify the user is redirected to the login experience', async () => {
            await expect(loginPage.username).toBeVisible();
            await expect(page).toHaveURL('/');
        });
    });
});
