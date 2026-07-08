import { test } from '../fixtures/general-fixture.js';

async function loginAsStandardUser(loginPage) {
    await loginPage.loginAction('standard_user', 'secret_sauce');
}

test.describe('Inventory page - need to login already', () => {
    test.beforeEach('Open the Sauce Demo login page', async ({ page, loginPage }) => {
        await page.goto(process.env.BASE_URL);
        await loginAsStandardUser(loginPage);
    });

    //hello

    test('Verify the inventory page loads after a successful login', async ({ inventoryPage }) => {
        await test.step('Verify the inventory page is displayed', async () => {
            await inventoryPage.assertInventoryPageVisible();
        });
    });

    test('Verify all products are displayed on the inventory page', async ({ inventoryPage }) => {
        await test.step('Verify all inventory items are visible', async () => {
            await inventoryPage.assertProductsCount(6);
        });
    });

    test('Verify product card information is displayed', async ({ inventoryPage }) => {
        await test.step('Verify the backpack card contains the expected details', async () => {
            await inventoryPage.assertProductCardVisible('Sauce Labs Backpack');
        });
    });

    test('Sort products from A to Z', async ({ inventoryPage }) => {
        await test.step('Apply the A to Z sort order', async () => {
            await inventoryPage.sortProducts('az');
        });

        await test.step('Verify the resulting item names are sorted alphabetically', async () => {
            await inventoryPage.assertItemNamesSortedAsc();
        });
    });

    test('Sort products from Z to A', async ({ inventoryPage }) => {
        await test.step('Apply the Z to A sort order', async () => {
            await inventoryPage.sortProducts('za');
        });

        await test.step('Verify the resulting item names are sorted reverse alphabetically', async () => {
            await inventoryPage.assertItemNamesSortedDesc();
        });
    });

    test('Sort products by price from low to high', async ({ inventoryPage }) => {
        await test.step('Apply the low to high price sort order', async () => {
            await inventoryPage.sortProducts('lohi');
        });

        await test.step('Verify the prices are sorted from low to high', async () => {
            await inventoryPage.assertPricesSortedAsc();
        });
    });

    test('Sort products by price from high to low', async ({ inventoryPage }) => {
        await test.step('Apply the high to low price sort order', async () => {
            await inventoryPage.sortProducts('hilo');
        });

        await test.step('Verify the prices are sorted from high to low', async () => {
            await inventoryPage.assertPricesSortedDesc();
        });
    });

    test('Add one product to the cart from the inventory page', async ({ inventoryPage }) => {
        await test.step('Add the backpack to the cart', async () => {
            await inventoryPage.addProductToCart('sauce-labs-backpack');
        });

        await test.step('Verify the cart badge updates', async () => {
            await inventoryPage.assertCartBadgeCount(1);
        });
    });

    test('Add multiple products to the cart from the inventory page', async ({ inventoryPage }) => {
        await test.step('Add two products to the cart', async () => {
            await inventoryPage.addProductToCart('sauce-labs-backpack');
            await inventoryPage.addProductToCart('sauce-labs-bike-light');
        });

        await test.step('Verify the cart badge shows the correct item count', async () => {
            await inventoryPage.assertCartBadgeCount(2);
        });
    });

    test('Remove a product from the inventory page', async ({ inventoryPage }) => {
        await test.step('Add a product and then remove it', async () => {
            await inventoryPage.addProductToCart('sauce-labs-backpack');
            await inventoryPage.removeProductFromCart('sauce-labs-backpack');
        });

        await test.step('Verify the remove action resets the button state', async () => {
            await inventoryPage.assertAddToCartButtonVisible('sauce-labs-backpack');
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

    test('Open a product detail page from the product name', async ({ inventoryPage }) => {
        await test.step('Open the backpack detail page', async () => {
            await inventoryPage.openProductDetail('Sauce Labs Backpack');
        });

        await test.step('Verify the product detail page is displayed', async () => {
            await inventoryPage.assertProductDetailPageVisible('Sauce Labs Backpack');
        });
    });

    test('Open a product detail page from the product image', async ({ inventoryPage }) => {
        await test.step('Open the backpack detail page from the image', async () => {
            await inventoryPage.page.locator('.inventory_item_img').first().click();
        });

        await test.step('Verify the product detail page is displayed', async () => {
            await inventoryPage.assertProductDetailPageVisible('Sauce Labs Backpack');
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

    test('Reset app state clears the cart', async ({ inventoryPage }) => {
        await test.step('Add a product and reset the app state', async () => {
            await inventoryPage.addProductToCart('sauce-labs-backpack');
            await inventoryPage.openMenu();
            await inventoryPage.resetAppStateButton.click();
        });

        await test.step('Verify the cart badge is cleared', async () => {
            await inventoryPage.assertCartBadgeHidden();
        });
    });
});

test('Accessing the inventory page without login redirects the user', async ({ inventoryPage, page }) => {
    await test.step('Open the inventory URL directly', async () => {
        await page.goto('https://www.saucedemo.com/inventory.html');
    });

    await test.step('Verify the user is redirected to the login experience', async () => {
        await inventoryPage.assertLoginPageVisible();
    });
});
