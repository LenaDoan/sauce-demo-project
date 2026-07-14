import path from 'path';
import { mkdir } from 'fs/promises';
import { chromium } from '@playwright/test';
import { LoginPage } from './pages/login-page.js';
import { getLoginData } from './utils/data-loader.js';

async function globalSetup() {
  const authFile = path.join(process.cwd(), 'playwright/.auth/inventory-auth.json');
  await mkdir(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const loginData = getLoginData();

  await page.goto(process.env.BASE_URL);
  await loginPage.loginAction(loginData.validUsername, loginData.validPassword);
  await loginPage.assertInventoryPageVisible(loginData.dashboardUrl);
  await context.storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;
