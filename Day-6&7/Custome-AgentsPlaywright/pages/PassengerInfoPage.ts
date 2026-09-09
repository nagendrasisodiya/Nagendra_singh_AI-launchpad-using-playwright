import { Page } from '@playwright/test';

type Passenger = { firstName: string; lastName: string; dob?: string; gender?: string };

export class PassengerInfoPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad() {
    await this.page.waitForSelector('[data-testid="passenger-form"], form[data-testid="passenger-info"]', { timeout: 5000 }).catch(() => null);
  }

  async fillPassenger(index: number, p: Passenger) {
    // Basic input mapping; real implementation will target indexed fields
    await this.page.fill(`[data-testid="first-name-${index}"]`, p.firstName).catch(() => this.page.fill('input[name="firstname"]', p.firstName));
    await this.page.fill(`[data-testid="last-name-${index}"]`, p.lastName).catch(() => this.page.fill('input[name="lastname"]', p.lastName));
    if (p.dob) await this.page.fill(`[data-testid="dob-${index}"]`, p.dob).catch(() => null);
  }

  async fillContact(c: { email: string; phone?: string }) {
    await this.page.fill('[data-testid="contact-email"]', c.email).catch(() => this.page.fill('input[type="email"]', c.email));
    if (c.phone) await this.page.fill('[data-testid="contact-phone"]', c.phone).catch(() => this.page.fill('input[type="tel"]', c.phone));
  }

  async continueToSummary() {
    await this.page.click('button:has-text("Continue"), [data-testid="continue-to-summary"]').catch(() => null);
  }
}

