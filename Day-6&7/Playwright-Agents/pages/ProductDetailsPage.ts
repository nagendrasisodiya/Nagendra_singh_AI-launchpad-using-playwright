import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('[data-test="inventory-item-name"]');
    this.description = page.locator('[data-test="inventory-item-desc"]');
    this.price = page.locator('[data-test="inventory-item-price"]');
    this.image = page.locator('[data-test="item-sauce-labs-backpack-img"] img, [data-test^="item-"] img').first();
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(this.name).toBeVisible();
    await expect(this.description).toBeVisible();
    await expect(this.price).toBeVisible();
  }

  async getName(): Promise<string> {
    return (await this.name.textContent())?.trim() ?? '';
  }

  async getDescription(): Promise<string> {
    return (await this.description.textContent())?.trim() ?? '';
  }

  async getPrice(): Promise<string> {
    return (await this.price.textContent())?.trim() ?? '';
  }

  async goBackToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}

