// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: coupon code: "PHPTRAVELSDISC10" which should apply 10% discount per test plan (assumed). Uses synthetic passengers.

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';
import { FlightResultsPage } from '../../pages/FlightResultsPage';
import { PassengerInfoPage } from '../../pages/PassengerInfoPage';
import { BookingSummaryPage } from '../../pages/BookingSummaryPage';

// VL-FLT-001
// Tags: @voucher @discount
// Short description: Apply coupon on booking summary and verify discount applied to total price.

test('VL-FLT-001 @voucher - Apply coupon and verify discount on booking summary', async ({ page }) => {
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);
  const results = new FlightResultsPage(page);
  const passenger = new PassengerInfoPage(page);
  const summary = new BookingSummaryPage(page);

  // Step 1: Standard one-way search
  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();
  await search.waitForLoad();
  await search.selectTripType('one-way');
  await search.setOrigin('Dallas (DFW)');
  await search.setDestination('Houston (IAH)');
  await search.setDepartureDateRelative(15);
  await search.setPassengers({ adults: 1, children: 0, infants: 0 });
  await search.submit();

  // Step 2: Select flight and proceed
  await results.waitForResults({ timeout: 20000 });
  await results.selectFlightByIndex(0);
  await results.proceedToPassengerInfo();

  // Step 3: Fill passenger and continue
  await passenger.waitForLoad();
  await passenger.fillPassenger(0, { firstName: 'Coupon', lastName: 'User', dob: '1992-11-12', gender: 'Other' });
  await passenger.fillContact({ email: 'coupon.user@example.com', phone: '+15555550404' });
  await passenger.continueToSummary();

  // Step 4: On summary, capture price, apply coupon, and verify discount
  await summary.waitForLoad();
  const priceBefore = await summary.totalPriceNumeric();
  await summary.applyCoupon('PHPTRAVELSDISC10');

  // Wait for coupon to be applied (network or UI change)
  await summary.waitForCouponApplied({ timeout: 5000 });
  const priceAfter = await summary.totalPriceNumeric();

  // Expected: priceAfter equals priceBefore * 0.9 (10% discount) within minor rounding
  expect(priceAfter).toBeGreaterThan(0);
  const expected = Math.round(priceBefore * 0.90 * 100) / 100;
  expect(Math.abs(priceAfter - expected)).toBeLessThanOrEqual(0.5);

  // Stop before payment
});

