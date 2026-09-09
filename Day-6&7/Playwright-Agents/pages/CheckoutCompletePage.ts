import { expect, Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly title: Locator;
  readonly thankYouMessage: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Checkout: Complete!');
    this.thankYouMessage = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.confirmationMessage = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.title).toBeVisible();
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}

