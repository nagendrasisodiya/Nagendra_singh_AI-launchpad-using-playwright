// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: synthetic passenger and contact email; this test intercepts email/send API to verify payload.

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';
import { FlightResultsPage } from '../../pages/FlightResultsPage';
import { PassengerInfoPage } from '../../pages/PassengerInfoPage';
import { BookingSummaryPage } from '../../pages/BookingSummaryPage';

// IT-FLT-001
// Tags: @integration @email
// Short description: Verify that booking flow triggers an email send request with expected fields (intercepted).

test('IT-FLT-001 @integration @email - Booking triggers email send payload', async ({ page }) => {
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);
  const results = new FlightResultsPage(page);
  const passenger = new PassengerInfoPage(page);
  const summary = new BookingSummaryPage(page);

  // Step 1: Intercept email send endpoint
  let intercepted = null as any;
  await page.route('**/api/email/send**', async route => {
    intercepted = await route.request().postDataJSON().catch(() => null);
    // Prevent actual send, return success stub
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
  });

  // Step 2: Perform booking flow up to summary and simulate finalization that triggers email
  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();
  await search.waitForLoad();
  await search.selectTripType('one-way');
  await search.setOrigin('Seattle (SEA)');
  await search.setDestination('Vancouver (YVR)');
  await search.setDepartureDateRelative(12);
  await search.setPassengers({ adults: 1, children: 0, infants: 0 });
  await search.submit();

  await results.waitForResults({ timeout: 20000 });
  await results.selectFlightByIndex(0);
  await results.proceedToPassengerInfo();

  await passenger.waitForLoad();
  await passenger.fillPassenger(0, { firstName: 'Email', lastName: 'Test', dob: '1993-02-02', gender: 'Female' });
  const testEmail = 'integration.email.test@example.com';
  await passenger.fillContact({ email: testEmail, phone: '+15555550606' });
  await passenger.continueToSummary();

  // Step 3: On summary, simulate clicking 'Email confirmation' or completing action that triggers the email
  await summary.waitForLoad();
  // Many implementations trigger email on booking completion. For safety, call a summary action that triggers email in test environment.
  await summary.triggerEmailConfirmation(); // assumed helper which calls the email endpoint

  // Step 4: Assert intercepted payload contains expected fields
  expect(intercepted).not.toBeNull();
  expect(intercepted.to).toBe(testEmail);
  expect(intercepted.subject || '').toMatch(/booking|confirmation/i);
  expect(intercepted.body || '').toContain('Flight');
});

