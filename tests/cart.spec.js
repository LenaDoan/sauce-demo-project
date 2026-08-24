import { test, expect } from '../fixtures/general-fixture.js';

test.describe('UI of cart page - Logged in', () => {
    test.beforeEach('Open the Sauce Demo cart page', async ({ cartPage }) => {
        await cartPage.openCartPage();
    });

    test('Verify the cart page loads after a successful login', async ({ cartPage, page }) => {
        await expect(page).toHaveURL(/cart.html/);
        await expect(cartPage.pageTitle).toBeVisible();
    });

    test('Verify UI of cart page', async ({ page }) => {
        await expect(page.getByTestId('cart-quantity-label')).toBeVisible();
        await expect(page.getByTestId('cart-desc-label')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
    })
});

test.describe('Add item then verify', () => {
    test.beforeEach('Add item to the cart', async({inventoryPage, page, inventoryData})=>{
        await inventoryPage.openInventoryPage();
        await inventoryPage.addProductToCart(inventoryData.item1);
        await page.getByTestId('shopping-cart-link').click();

    })

    test('Verify information of added item', async ({ cartPage, page }) => {
        await test.step('Verify thong tin', async () => { 
            await expect(page.getByTestId('item-quantity')).toBeVisible();
            await expect(await page.getByTestId('item-quantity').innerText()).toBe('1');
            console.log(await page.getByTestId('item-quantity').innerText());
            // await expect(page.getByTestId('inventory-item-name')).toBe('Sauce Labs Backpack');
            // await expect(page.getByTestId('inventory-item-desc')).toContainText(/carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection./i)
        })
    });

    test('Verify that user can remove item from cart', async ({ cartPage, page }) => {
        await test.step('Click remove btn on cart page', async () => {
            await page.getByRole('button', { name: /Remove/i }).click();
        })
        await test.step('Verify item to be removed', async () => {
            //Kiem tra item bien mat

        })
    });
});