import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Your Cart');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  private itemContainerByName(name: string): Locator {
    return this.page.locator('.cart_item').filter({ has: this.page.getByRole('link', { name }) });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.title).toBeVisible();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }

    return Number((await this.cartBadge.textContent())?.trim() ?? '0');
  }

  async removeItemByName(name: string): Promise<void> {
    await this.itemContainerByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async getItemPrice(name: string): Promise<string> {
    return (await this.itemContainerByName(name).locator('[data-test="inventory-item-price"]').textContent())?.trim() ?? '';
  }

  async getItemQuantity(name: string): Promise<string> {
    return (await this.itemContainerByName(name).locator('[data-test="item-quantity"]').textContent())?.trim() ?? '';
  }

  async hasItem(name: string): Promise<boolean> {
    return (await this.itemContainerByName(name).count()) > 0;
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }
}

