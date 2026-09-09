import { Locator, Page } from '@playwright/test';

export class MenuComponent {
  readonly page: Page;
  readonly openMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.getByRole('link', { name: 'All Items' });
    this.resetAppStateLink = page.getByRole('link', { name: 'Reset App State' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async openMenu(): Promise<void> {
    await this.openMenuButton.click();
  }

  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}

