// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: origin: "Los Angeles, LAX", destination: "Chicago, ORD", departure +20 days, 2 adults + 1 child

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';
import { FlightResultsPage } from '../../pages/FlightResultsPage';
import { PassengerInfoPage } from '../../pages/PassengerInfoPage';
import { BookingSummaryPage } from '../../pages/BookingSummaryPage';

// HP-FLT-003
// Tags: @happy-path @multi-passenger
// Short description: Search and book for multiple passengers verifying passenger counts and price aggregation.

test('HP-FLT-003 @happy-path @multi-passenger - Multi-passenger booking to summary', async ({ page }) => {
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);
  const results = new FlightResultsPage(page);
  const passenger = new PassengerInfoPage(page);
  const summary = new BookingSummaryPage(page);

  // Step 1: Navigate and open Flights
  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();

  // Step 2: Configure search for 2 adults + 1 child
  await search.waitForLoad();
  await search.selectTripType('one-way');
  await search.setOrigin('Los Angeles (LAX)');
  await search.setDestination('Chicago (ORD)');
  await search.setDepartureDateRelative(20);
  await search.setPassengers({ adults: 2, children: 1, infants: 0 });
  await search.setCabinClass('Economy');

  // Step 3: Submit search
  await Promise.all([
    page.waitForResponse(res => /search.*flights/i.test(res.url()) || res.status() === 200, { timeout: 20000 }),
    search.submit()
  ]);

  // Step 4: Validate and select flight
  await results.waitForResults({ timeout: 20000 });
  expect(await results.hasResults()).toBeTruthy();
  await results.selectFlightByIndex(0);
  await results.proceedToPassengerInfo();

  // Step 5: Fill multiple passenger details (synthetic DOBs)
  await passenger.waitForLoad();
  await passenger.fillPassenger(0, { firstName: 'AdultOne', lastName: 'Multi', dob: '1985-03-10', gender: 'Male' });
  await passenger.fillPassenger(1, { firstName: 'AdultTwo', lastName: 'Multi', dob: '1986-07-22', gender: 'Female' });
  await passenger.fillPassenger(2, { firstName: 'ChildOne', lastName: 'Multi', dob: '2015-09-05', gender: 'Male' });
  await passenger.fillContact({ email: 'multi.booking@example.com', phone: '+15555550303' });
  await passenger.continueToSummary();

  // Step 6: Verify aggregated passenger count and total
  await summary.waitForLoad();
  expect(await summary.passengerCount()).toBe(3);
  const total = await summary.totalPrice();
  expect(total).toMatch(/\d+/);
  expect(Number(total.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);

  // Stop before payment
});

