// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: departure in past, return before departure

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';

// NG-FLT-001
// Tags: @negative @validation
// Short description: Verify date validation prevents searches with past departure or return before departure.

test.describe('NG-FLT-001 @negative @validation - Date validation tests', () => {
  test('should prevent searching when departure date is in the past', async ({ page }) => {
    const home = new HomePage(page);
    const search = new FlightSearchPage(page);

    // Step 1: Navigate to flights
    await home.goto(process.env.BASE_URL || 'https://phptravels.net');
    await home.openFlightsTab();
    await search.waitForLoad();

    // Step 2: Enter past departure
    await search.selectTripType('one-way');
    await search.setOrigin('New York (JFK)');
    await search.setDestination('Boston (BOS)');
    await search.setDepartureDateRelative(-5); // past date
    await search.setPassengers({ adults: 1, children: 0, infants: 0 });

    // Step 3: Attempt to submit and assert validation
    await search.submit();
    expect(await search.hasDateValidationError()).toBeTruthy();
    // No network request for search should be performed
    expect(await search.searchRequestMade()).toBeFalsy();
  });

  test('should prevent searching when return date is before departure for round-trip', async ({ page }) => {
    const home = new HomePage(page);
    const search = new FlightSearchPage(page);

    await home.goto(process.env.BASE_URL || 'https://phptravels.net');
    await home.openFlightsTab();
    await search.waitForLoad();

    await search.selectTripType('round-trip');
    await search.setOrigin('Boston (BOS)');
    await search.setDestination('Miami (MIA)');
    await search.setDepartureDateRelative(20);
    await search.setReturnDateRelative(10); // return before departure
    await search.setPassengers({ adults: 1, children: 0, infants: 0 });

    await search.submit();
    expect(await search.hasReturnDateValidationError()).toBeTruthy();
    expect(await search.searchRequestMade()).toBeFalsy();
  });
});

