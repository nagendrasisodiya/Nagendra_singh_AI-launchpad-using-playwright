// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: origin: "San Francisco, SFO", destination: "Tokyo, NRT", depart +45 days, return +52 days

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';
import { FlightResultsPage } from '../../pages/FlightResultsPage';
import { PassengerInfoPage } from '../../pages/PassengerInfoPage';
import { BookingSummaryPage } from '../../pages/BookingSummaryPage';

// HP-FLT-002
// Tags: @happy-path @round-trip
// Short description: Search for a round-trip flight and validate round-trip details to booking summary.

test('HP-FLT-002 @happy-path @round-trip - Round-trip search to booking summary', async ({ page }) => {
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);
  const results = new FlightResultsPage(page);
  const passenger = new PassengerInfoPage(page);
  const summary = new BookingSummaryPage(page);

  // Step 1: Navigate and open Flights
  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();

  // Step 2: Configure round-trip
  await search.waitForLoad();
  await search.selectTripType('round-trip');
  await search.setOrigin('San Francisco (SFO)');
  await search.setDestination('Tokyo (NRT)');
  await search.setDepartureDateRelative(45);
  await search.setReturnDateRelative(52);
  await search.setPassengers({ adults: 1, children: 0, infants: 0 });
  await search.setCabinClass('Business');

  // Step 3: Submit and wait for results
  await Promise.all([
    page.waitForResponse(res => /search.*flights/i.test(res.url()) || res.status() === 200, { timeout: 20000 }),
    search.submit()
  ]);

  // Step 4: Validate results and round-trip labels
  await results.waitForResults({ timeout: 20000 });
  expect(await results.hasResults()).toBeTruthy();
  expect(await results.isRoundTrip()).toBeTruthy();
  expect(await results.searchSummary()).toContain('San Francisco');
  expect(await results.searchSummary()).toContain('Tokyo');

  // Step 5: Choose a result and progress
  await results.selectFlightByIndex(1);
  await results.proceedToPassengerInfo();

  // Step 6: Fill passenger details
  await passenger.waitForLoad();
  await passenger.fillPassenger(0, { firstName: 'Round', lastName: 'Trip', dob: '1987-05-20', gender: 'Female' });
  await passenger.fillContact({ email: 'test.roundtrip@example.com', phone: '+15555550202' });
  await passenger.continueToSummary();

  // Step 7: Verify summary includes inbound and outbound segments and price
  await summary.waitForLoad();
  expect(await summary.segmentCount()).toBeGreaterThanOrEqual(2);
  expect(await summary.totalPrice()).toMatch(/\d+/);

  // Stop before any payment
});

