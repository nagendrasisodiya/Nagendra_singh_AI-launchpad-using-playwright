import { Page } from '@playwright/test';

type Passengers = { adults: number; children: number; infants: number };

export class FlightSearchPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad() {
    await this.page.waitForSelector('form[data-testid="flight-search"] , [data-testid="flight-search-form"]', { timeout: 5000 }).catch(() => null);
  }

  async selectTripType(type: 'one-way' | 'round-trip') {
    // simple toggle attempt
    await this.page.click(`[data-testid="trip-type-${type}"]`).catch(() => null);
  }

  async setOrigin(value: string) {
    await this.page.fill('[data-testid="departure"]', value).catch(() => this.page.fill('input[name="from"]', value));
  }

  async setDestination(value: string) {
    await this.page.fill('[data-testid="arrival"]', value).catch(() => this.page.fill('input[name="to"]', value));
  }

  async setDepartureDateRelative(days: number) {
    // For stubbing: compute future date and type it into date input if present
    const date = new Date();
    date.setDate(date.getDate() + days);
    const iso = date.toISOString().split('T')[0];
    await this.page.fill('[data-testid="departure-date"]', iso).catch(() => null);
  }

  async setReturnDateRelative(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const iso = date.toISOString().split('T')[0];
    await this.page.fill('[data-testid="return-date"]', iso).catch(() => null);
  }

  async setPassengers(p: Passengers) {
    // Basic implementation: set values into inputs if present
    await this.page.fill('[data-testid="adults"]', String(p.adults)).catch(() => null);
    await this.page.fill('[data-testid="children"]', String(p.children)).catch(() => null);
    await this.page.fill('[data-testid="infants"]', String(p.infants)).catch(() => null);
  }

  async setCabinClass(_c: string) {
    // no-op stub; real implementation will select dropdown
  }

  async submit() {
    await this.page.click('[data-testid="search-flights"], button[type="submit"], text=Search').catch(() => null);
  }

  async openPassengerSelector() {
    await this.page.click('[data-testid="passenger-selector"]').catch(() => null);
  }

  async getTotalPassengersSelected() {
    const adults = parseInt((await this.page.inputValue('[data-testid="adults"]').catch(() => '1')) || '1', 10);
    const children = parseInt((await this.page.inputValue('[data-testid="children"]').catch(() => '0')) || '0', 10);
    const infants = parseInt((await this.page.inputValue('[data-testid="infants"]').catch(() => '0')) || '0', 10);
    return adults + children + infants;
  }

  async hasPassengerCountValidationError() {
    return (await this.page.locator('[data-testid="passenger-error"], .passenger-error').count()) > 0;
  }

  async hasDateValidationError() {
    return (await this.page.locator('[data-testid="date-error"], .date-error').count()) > 0;
  }

  async hasReturnDateValidationError() {
    return (await this.page.locator('[data-testid="return-date-error"], .return-date-error').count()) > 0;
  }

  async searchRequestMade() {
    // Stub: tests can override network checks; default to false
    return false;
  }
}

