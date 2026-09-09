import { expect, Locator, Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Checkout: Overview');
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.title).toBeVisible();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getItemQuantities(): Promise<string[]> {
    return this.page.locator('[data-test="item-quantity"]').allInnerTexts();
  }

  async getItemPriceTexts(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
  }

  async getItemTotalText(): Promise<string> {
    return (await this.itemTotalLabel.textContent())?.trim() ?? '';
  }

  async getTaxText(): Promise<string> {
    return (await this.taxLabel.textContent())?.trim() ?? '';
  }

  async getTotalText(): Promise<string> {
    return (await this.totalLabel.textContent())?.trim() ?? '';
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }
}

