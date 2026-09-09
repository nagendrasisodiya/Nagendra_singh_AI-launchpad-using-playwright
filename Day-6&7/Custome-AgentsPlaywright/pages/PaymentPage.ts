import { Page } from '@playwright/test';

export class PaymentPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad() {
    await this.page.waitForSelector('[data-testid="payment-form"], form[data-testid="payment"]', { timeout: 5000 }).catch(() => null);
  }

  async fillCard(card: { cardNumber: string; expiry: string; cvc: string; name?: string }) {
    await this.page.fill('[data-testid="card-number"]', card.cardNumber).catch(() => this.page.fill('input[name="cardnumber"]', card.cardNumber));
    await this.page.fill('[data-testid="card-expiry"]', card.expiry).catch(() => this.page.fill('input[name="expiry"]', card.expiry));
    await this.page.fill('[data-testid="card-cvc"]', card.cvc).catch(() => this.page.fill('input[name="cvc"]', card.cvc));
    if (card.name) await this.page.fill('[data-testid="card-name"]', card.name).catch(() => null);
  }

  async submitPayment() {
    await this.page.click('button:has-text("Pay Now"), [data-testid="pay-now"]').catch(() => null);
  }

  async waitForPaymentFailure(options: { timeout?: number } = {}) {
    await this.page.waitForSelector('[data-testid="payment-error"], .payment-error', { timeout: options.timeout ?? 10000 }).catch(() => null);
  }

  async isPaymentErrorVisible() {
    return (await this.page.locator('[data-testid="payment-error"], .payment-error').count()) > 0;
  }

  async paymentErrorText() {
    return await this.page.locator('[data-testid="payment-error"], .payment-error').innerText().catch(() => '');
  }
}

