import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productsTitle: Locator;
  readonly sortDropdown: Locator;
  readonly shoppingCartLink: Locator;
  readonly cartBadge: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemDescriptions: Locator;
  readonly itemPrices: Locator;
  readonly itemImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsTitle = page.getByText('Products');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.itemImages = page.locator('[data-test="inventory-item"] img');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.productsTitle).toBeVisible();
    await expect(this.sortDropdown).toBeVisible();
    await expect(this.shoppingCartLink).toBeVisible();
  }

  private itemContainerByName(name: string): Locator {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ has: this.page.locator('[data-test="inventory-item-name"]', { hasText: name }) });
  }

  async openProductDetailsByName(name: string): Promise<void> {
    await this.page.locator('[data-test="inventory-item-name"]', { hasText: name }).first().click();
  }

  async addProductToCartByName(name: string): Promise<void> {
    await this.itemContainerByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromInventoryByName(name: string): Promise<void> {
    await this.itemContainerByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async getCartBadgeCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }

    const text = (await this.cartBadge.textContent())?.trim() ?? '0';
    return Number(text);
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async selectSortOption(optionText: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionText });
  }

  async getVisibleProductNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async getVisibleProductPrices(): Promise<string[]> {
    return this.itemPrices.allInnerTexts();
  }
}

