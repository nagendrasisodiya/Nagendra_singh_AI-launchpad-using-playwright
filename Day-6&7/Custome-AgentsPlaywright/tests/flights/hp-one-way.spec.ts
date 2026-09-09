// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: origin: "New York, JFK", destination: "London, LHR", departure: +30 days

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';
import { FlightResultsPage } from '../../pages/FlightResultsPage';
import { PassengerInfoPage } from '../../pages/PassengerInfoPage';
import { BookingSummaryPage } from '../../pages/BookingSummaryPage';

// HP-FLT-001
// Tags: @happy-path @one-way
// Short description: Search for a one-way flight and progress to booking summary (stop before payment).

test('HP-FLT-001 @happy-path @one-way - One-way flight search to booking summary', async ({ page }) => {
  // Arrange: instantiate page objects
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);
  const results = new FlightResultsPage(page);
  const passenger = new PassengerInfoPage(page);
  const summary = new BookingSummaryPage(page);

  // Step 1: Navigate to base URL and open Flights
  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();

  // Step 2: Configure one-way trip
  await search.waitForLoad();
  await search.selectTripType('one-way');
  await search.setOrigin('New York (JFK)');
  await search.setDestination('London (LHR)');
  await search.setDepartureDateRelative(30); // helper uses relative days
  await search.setPassengers({ adults: 1, children: 0, infants: 0 });
  await search.setCabinClass('Economy');

  // Step 3: Submit search
  await Promise.all([
    page.waitForResponse(res => /search.*flights/i.test(res.url()) || res.status() === 200, { timeout: 20000 }),
    search.submit()
  ]);

  // Step 4: Validate results render
  await results.waitForResults({ timeout: 20000 });
  expect(await results.hasResults()).toBeTruthy();
  expect(await results.searchSummary()).toContain('New York');
  expect(await results.searchSummary()).toContain('London');

  // Step 5: Select the first available flight and continue
  await results.selectFlightByIndex(0);
  await results.proceedToPassengerInfo();

  // Step 6: Fill passenger and contact (synthetic data)
  await passenger.waitForLoad();
  await passenger.fillPassenger(0, {
    firstName: 'Test', lastName: 'Traveler', dob: '1990-01-15', gender: 'Male'
  });
  await passenger.fillContact({ email: 'test.traveler+oneway@example.com', phone: '+15555550101' });
  await passenger.continueToSummary();

  // Step 7: Verify booking summary price and passenger info
  await summary.waitForLoad();
  expect(await summary.passengerCount()).toBe(1);
  expect(await summary.origin()).toContain('New York');
  expect(await summary.destination()).toContain('London');
  expect(await summary.totalPrice()).toMatch(/\d+/);

  // Note: Stop here to avoid real payment submission.
});

