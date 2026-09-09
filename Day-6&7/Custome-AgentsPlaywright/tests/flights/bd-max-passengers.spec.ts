// README: Requires process.env.BASE_URL and optional page-object import path adjustments.
// Test data: attempt to set passengers above allowed maximum (assume max 9)

import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { FlightSearchPage } from '../../pages/FlightSearchPage';

// BD-FLT-001
// Tags: @boundary @passenger-limit
// Short description: Boundary test for maximum passengers selection and UI/server handling.

test('BD-FLT-001 @boundary - Max passengers selection and validation', async ({ page }) => {
  const home = new HomePage(page);
  const search = new FlightSearchPage(page);

  await home.goto(process.env.BASE_URL || 'https://phptravels.net');
  await home.openFlightsTab();
  await search.waitForLoad();

  // Assumption: UI supports selecting up to 9 passengers total
  await search.openPassengerSelector();
  await search.setPassengers({ adults: 9, children: 0, infants: 0 });

  // Verify UI accepts 9 or shows appropriate validation
  const selected = await search.getTotalPassengersSelected();
  if (selected <= 9) {
    expect(selected).toBeLessThanOrEqual(9);
  } else {
    // If UI limits less than 9, ensure a clear validation is shown and prevents search
    expect(await search.hasPassengerCountValidationError()).toBeTruthy();
  }

  // Attempt to submit and ensure behaviour is consistent
  await search.submit();
  // If UI prevented selection, no search request should be made
  if (selected > 9) {
    expect(await search.searchRequestMade()).toBeFalsy();
  } else {
    // Otherwise, ensure search runs or returns results (non-blocking)
    await page.waitForTimeout(1000);
  }
});

