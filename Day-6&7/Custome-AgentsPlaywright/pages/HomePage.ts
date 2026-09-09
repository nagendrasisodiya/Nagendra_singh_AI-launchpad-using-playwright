import { Page } from '@playwright/test';
export class HomePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }
  async openFlightsTab() {
    // Try common selector patterns; tests may adapt selectors per app
    const flightsTab = this.page
      .locator('a[href*="flights"]')
      .or(this.page.locator('[data-testid="tab-flights"]'))
      .or(this.page.getByText('Flights').first());
    if (await flightsTab.count() > 0) {
      // Wait for element to be visible and clickable
      await flightsTab.first().waitFor({ state: 'visible' });
      await flightsTab.first().click();
    }
  }
}