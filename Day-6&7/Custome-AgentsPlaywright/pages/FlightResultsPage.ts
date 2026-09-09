import { Page } from '@playwright/test';

export class FlightResultsPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForResults(options: { timeout?: number } = {}) {
    await this.page.waitForSelector('[data-testid="flight-result"], .flight-result', { timeout: options.timeout ?? 10000 }).catch(() => null);
  }

  async hasResults() {
    return (await this.page.locator('[data-testid="flight-result"], .flight-result').count()) > 0;
  }

  async searchSummary() {
    return await this.page.locator('[data-testid="search-summary"]').innerText().catch(() => '');
  }

  async selectFlightByIndex(index: number) {
    const items = this.page.locator('[data-testid="flight-result"], .flight-result');
    if (await items.count() > index) {
      await items.nth(index).locator('button:has-text("Select"), text=Select').first().click().catch(() => items.nth(index).click());
    }
  }

  async proceedToPassengerInfo() {
    await this.page.click('button:has-text("Continue"), [data-testid="proceed-to-passenger"]').catch(() => null);
  }

  async isRoundTrip() {
    return (await this.page.locator('[data-testid="trip-type"]').innerText().catch(() => '')).toLowerCase().includes('round');
  }
}

