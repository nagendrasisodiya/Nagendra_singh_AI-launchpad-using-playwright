// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: Use synthetic card data; network mocking is used to simulate payment decline.

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';
import { FlightResultsPage } from '../../pages/FlightResultsPage';
import { PassengerInfoPage } from '../../pages/PassengerInfoPage';
import { BookingSummaryPage } from '../../pages/BookingSummaryPage';
import { PaymentPage } from '../../pages/PaymentPage';

// NG-FLT-002
// Tags: @negative @payment
// Short description: Simulate payment decline by intercepting payment API and verify error handling.

test('NG-FLT-002 @negative @payment - Payment decline handling', async ({ page }) => {
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);
  const results = new FlightResultsPage(page);
  const passenger = new PassengerInfoPage(page);
  const summary = new BookingSummaryPage(page);
  const payment = new PaymentPage(page);

  // Step 1: Prepare network mock to simulate payment decline
  await page.route('**/api/payment/**', route => {
    // Simulate declined response
    route.fulfill({
      status: 402,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: 'Card declined' })
    });
  });

  // Step 2: Conduct a simple search and progress to payment
  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();
  await search.waitForLoad();
  await search.selectTripType('one-way');
  await search.setOrigin('Atlanta (ATL)');
  await search.setDestination('Orlando (MCO)');
  await search.setDepartureDateRelative(10);
  await search.setPassengers({ adults: 1, children: 0, infants: 0 });
  await search.submit();

  await results.waitForResults({ timeout: 20000 });
  await results.selectFlightByIndex(0);
  await results.proceedToPassengerInfo();

  await passenger.waitForLoad();
  await passenger.fillPassenger(0, { firstName: 'Pay', lastName: 'Decline', dob: '1990-06-06', gender: 'Male' });
  await passenger.fillContact({ email: 'pay.decline@example.com', phone: '+15555550505' });
  await passenger.continueToSummary();

  await summary.waitForLoad();
  await summary.continueToPayment();

  // Step 3: Fill payment with synthetic card and submit (will be intercepted)
  await payment.waitForLoad();
  await payment.fillCard({ cardNumber: '4000000000000002', expiry: '12/30', cvc: '123', name: 'Declined Card' });
  await payment.submitPayment();

  // Step 4: Assert that decline is handled gracefully
  await payment.waitForPaymentFailure({ timeout: 10000 });
  expect(await payment.isPaymentErrorVisible()).toBeTruthy();
  expect(await payment.paymentErrorText()).toContain('declin');

  // Ensure no confirmation page is shown
  expect(await page.url()).not.toMatch(/confirmation|receipt|success/i);
});

