import { expect } from "@playwright/test";
import { BasePage } from "./base-page.js";

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        //Locator
        this.username = this.page.getByPlaceholder('Username');
        this.password = this.page.getByPlaceholder('Password');
        this.loginBtn = this.page.getByRole('button', { name: 'Login' });
        this.productsTitle = this.page.getByText('Products');
        this.errorMessage = this.page.getByTestId('error');
    }

    //Method
    async loginAction(username, pass) {
        await this.username.fill(username);
        await this.password.fill(pass);
        await this.loginBtn.click();
    }
}