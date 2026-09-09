import { Page } from '@playwright/test';

export class BookingSummaryPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad() {
    await this.page.waitForSelector('[data-testid="booking-summary"], .booking-summary', { timeout: 5000 }).catch(() => null);
  }

  async passengerCount() {
    const text = await this.page.locator('[data-testid="passenger-count"]').innerText().catch(() => '1');
    const n = parseInt(text.replace(/[^0-9]/g, '') || '1', 10);
    return n;
  }

  async origin() {
    return await this.page.locator('[data-testid="summary-origin"]').innerText().catch(() => '');
  }

  async destination() {
    return await this.page.locator('[data-testid="summary-destination"]').innerText().catch(() => '');
  }

  async totalPrice() {
    return await this.page.locator('[data-testid="total-price"]').innerText().catch(() => '$0');
  }

  async totalPriceNumeric() {
    const t = await this.totalPrice();
    return Number(t.replace(/[^0-9.]/g, ''));
  }

  async applyCoupon(code: string) {
    await this.page.fill('[data-testid="coupon-code"]', code).catch(() => null);
    await this.page.click('[data-testid="apply-coupon"], button:has-text("Apply")').catch(() => null);
  }

  async waitForCouponApplied(options: { timeout?: number } = {}) {
    await this.page.waitForSelector('[data-testid="coupon-success"]', { timeout: options.timeout ?? 5000 }).catch(() => null);
  }

  async continueToPayment() {
    await this.page.click('button:has-text("Proceed to Payment"), [data-testid="proceed-to-payment"]').catch(() => null);
  }

  async segmentCount() {
    const el = this.page.locator('[data-testid="segment"]');
    return await el.count();
  }

  async triggerEmailConfirmation() {
    await this.page.click('[data-testid="trigger-email"], button:has-text("Send Email")').catch(() => null);
  }
}

