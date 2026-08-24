import { test, expect } from "../fixtures/general-fixture.js";

test.use({storageState: {cookies: [], origins: []}});

test.beforeEach('Navigate to the login page', async ({ page }) => {
    await page.goto('/');
});

test.describe('Happy path: Login success', () => {
    test('Login successfully with valid user', async ({ loginPage, loginData, page }) => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.loginAction(loginData.validUsername, loginData.validPassword);
        });

        await test.step('Verify the user is redirected to the inventory page', async () => {
            await expect(page).toHaveURL(loginData.dashboardUrl);
            await expect(loginPage.productsTitle).toBeVisible();
        });
    });
});

test.describe('Login with invalid credentials', () => {
    test('Show an error when login uses an invalid password', async ({ loginPage, loginData }) => {
        await test.step('Submit invalid password', async () => {
            await loginPage.loginAction(loginData.validUsername, loginData.invalidPassword);
        });

        await test.step('Verify the error message is displayed', async () => {
            await expect(loginPage.errorMessage).toContainText(loginData.errorMessage.invalidInformation);
        });
    });

    test('Login with invalid username', async({loginPage, loginData}) => {
        await test.step('Submit invalid username', async () => {
            await loginPage.loginAction(loginData.invalidUsername, loginData.validPassword);
        });

        await test.step('Verify the error message is displayed', async () => {
            await expect(loginPage.errorMessage).toContainText(loginData.errorMessage.invalidInformation);
        });
    });
});

test.describe('Login with unusual account', () => {
    test('Show an error when login uses a locked out user', async ({ loginData, loginPage }) => {
        await test.step('Submit locked out user credentials', async () => {
            await loginPage.loginAction(loginData.lockOutUsername, loginData.validPassword);
        });

        await test.step('Verify the locked out message is displayed', async () => {
            await expect(loginPage.errorMessage).toContainText(loginData.errorMessage.lockedOut);
        });
    });
});

test.describe('Login with empty credentials', () => {
    test('Show an error when login uses an empty username', async ({ loginPage, loginData }) => {
        await test.step('Submit empty username', async () => {
            await loginPage.loginAction("", loginData.validPassword);
        });

        await test.step('Verify the error message is displayed', async () => {
            await expect(loginPage.errorMessage).toContainText(loginData.errorMessage.usernameRequired);
        });
    });

    test('Show an error when login uses an empty password', async ({ loginPage, loginData }) => {
        await test.step('Submit empty password', async () => {
            await loginPage.loginAction(loginData.validUsername, "");
        });

        await test.step('Verify the error message is displayed', async () => {
            await expect(loginPage.errorMessage).toContainText(loginData.errorMessage.passwordRequired);
        });
    });

    test('Show an error when login uses an empty username and password', async ({ loginPage, loginData }) => {
        await test.step('Submit empty username and password', async () => {
            await loginPage.loginAction("", "");
        });

        await test.step('Verify the error message is displayed', async () => {
            await expect(loginPage.errorMessage).toContainText(loginData.errorMessage.usernameRequired);
        });
    });
});

