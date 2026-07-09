import { test, expect } from "../fixtures/general-fixture.js";

test.beforeEach('Navigate to the login page', async ({ page }) => {
    await page.goto(process.env.BASE_URL);
});

test.describe('Happy path: Login success', () => {
    test('Login successfully with valid user', async ({ loginPage, loginData }) => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.loginAction(loginData.validUsername, loginData.validPassword);
        });

        await test.step('Verify the user is redirected to the inventory page', async () => {
            await loginPage.assertInventoryPageVisible(loginData.dashboardUrl);
        });
    });
});

test.describe('Login with invalid credentials', () => {
    test('Show an error when login uses an invalid password', async ({ loginPage, loginData }) => {
        await test.step('Submit invalid password', async () => {
            await loginPage.loginAction(loginData.validUsername, loginData.invalidPassword);
        });

        await test.step('Verify the error message is displayed', async () => {
            await loginPage.assertErrorMessageVisible(/Epic sadface/i);
        });
    });
});

test.describe('Login with unusual account', () => {
    test('Show an error when login uses a locked out user', async ({ loginData, loginPage }) => {
        await test.step('Submit locked out user credentials', async () => {
            await loginPage.loginAction(loginData.lockOutUsername, loginData.validPassword);
        });

        await test.step('Verify the locked out message is displayed', async () => {
            await loginPage.assertErrorMessageVisible(/locked out/i);
        });
    });
});

