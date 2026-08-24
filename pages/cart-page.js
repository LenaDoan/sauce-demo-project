export  class CartPage {
    constructor(page) {
        this.page = page;
        this.pageTitle = page.getByText('Your Cart');
    }

    async openCartPage() {
        await this.page.goto('/cart.html');
    }
}