# PHPTRAVELS — Flight Tests (Generated Playwright Specs)

This document contains implementation-ready test case specifications that correspond to the Playwright TypeScript spec files added under `tests/flights/`.

Each entry includes: Test ID, file path, short description, tags, prerequisites, test data, step-by-step actions, and expected results.

---

## HP-FLT-001 — One-way flight search to booking summary
- File: `tests/flights/hp-one-way.spec.ts`
- Tags: @happy-path @one-way
- Short description: Search for a one-way flight and progress to the booking summary (stop before payment).

Prerequisites
- BASE_URL set via `process.env.BASE_URL` (default: `https://phptravels.net`)

Test data
- Origin: New York (JFK)
- Destination: London (LHR)
- Departure: +30 days from today
- Passengers: 1 adult

Steps
1. Navigate to the site and open the Flights tab.
2. Select trip type `one-way`.
3. Enter origin and destination, select departure date (+30 days), choose 1 adult and Economy.
4. Submit search and wait for results.
5. Select the first available flight and proceed to passenger info.
6. Fill passenger and contact details (synthetic data).
7. Continue to booking summary and verify origin, destination, passenger count and total price.

Expected results
- Results list renders and includes the requested route.
- Booking summary shows correct origin/destination, passenger count = 1 and a positive total price.

Notes
- Test stops before payment to avoid real transactions.

---

## HP-FLT-002 — Round-trip search to booking summary
- File: `tests/flights/hp-round-trip.spec.ts`
- Tags: @happy-path @round-trip
- Short description: Search for a round-trip flight and validate details to the booking summary.

Prerequisites
- BASE_URL set

Test data
- Origin: San Francisco (SFO)
- Destination: Tokyo (NRT)
- Depart: +45 days, Return: +52 days
- Passengers: 1 adult, Business class

Steps
1. Navigate to Flights tab.
2. Select `round-trip`, set origin/destination and outbound/return dates.
3. Set 1 adult and Business class, submit.
4. Wait for results, verify round-trip indicator and summary text.
5. Select a result, fill passenger and contact details.
6. Continue to booking summary, verify at least 2 segments and a positive price.

Expected
- Round-trip results present, summary contains both segments and shows total price.

---

## HP-FLT-003 — Multi-passenger booking to summary
- File: `tests/flights/hp-multi-passenger.spec.ts`
- Tags: @happy-path @multi-passenger
- Short description: Book for multiple passengers and verify aggregated passenger counts and pricing.

Test data
- Origin: Los Angeles (LAX)
- Destination: Chicago (ORD)
- Departure: +20 days
- Passengers: 2 adults, 1 child

Steps
1. Search one-way for the route with 2 adults + 1 child.
2. Select first result and proceed to passenger info.
3. Fill 3 passenger records and contact details.
4. Continue to summary and assert passengerCount === 3 and total price > 0.

Expected
- Summary aggregates passengers correctly and shows a total price reflecting all passengers.

---

## NG-FLT-001 — Invalid dates validation
- File: `tests/flights/ng-invalid-dates.spec.ts`
- Tags: @negative @validation
- Short description: Verify the UI prevents searches where the departure date is in the past or the return date is before departure.

Test cases (2)
- A: Departure date in the past (e.g., -5 days)
- B: Round-trip where return date < departure date

Steps
A
1. Open Flights, choose one-way.
2. Set departure date to a past date and submit.
3. Assert a date validation error is displayed and no search request is issued.

B
1. Open Flights, choose round-trip.
2. Set outbound to +20 days and return to +10 days and submit.
3. Assert a return-date validation error and no search request.

Expected
- Validation messages present and search not performed.

---

## BD-FLT-001 — Boundary test: max passengers selection
- File: `tests/flights/bd-max-passengers.spec.ts`
- Tags: @boundary @passenger-limit
- Short description: Verify behaviour when selecting maximum allowed passengers (assumed max = 9).

Test data
- Attempt to set 9 adults (or above if UI allows)

Steps
1. Open Flights and passenger selector.
2. Attempt to set passengers to 9 adults.
3. Verify UI accepts up to 9 or displays a passenger-count validation error.
4. If >9 is selected and rejected, ensure no search request is made.

Expected
- UI either allows up to 9 passengers or displays a clear validation preventing an invalid search.

---

## VL-FLT-001 — Apply coupon / voucher validation
- File: `tests/flights/vl-apply-coupon.spec.ts`
- Tags: @voucher @discount
- Short description: Apply coupon code on booking summary and verify discount applied.

Test data
- Coupon: `PHPTRAVELSDISC10` (assumed 10% off)

Steps
1. Search and select a flight; proceed to passenger info and then to summary.
2. Read price before coupon, apply coupon code, wait for coupon success.
3. Read price after coupon and verify ~10% discount (within rounding tolerance).

Expected
- Price after coupon equals priceBefore * 0.90 (± rounding tolerance).

---

## NG-FLT-002 — Payment decline handling
- File: `tests/flights/ng-payment-decline.spec.ts`
- Tags: @negative @payment
- Short description: Simulate a payment gateway decline and assert error handling.

Test data
- Intercept `**/api/payment/**` and return a 402 declined response
- Use synthetic card `4000 0000 0000 0002` (simulated)

Steps
1. Intercept payment endpoint and stub a declined response.
2. Complete search -> select flight -> passenger info -> booking summary -> proceed to payment.
3. Fill payment details and submit.
4. Verify payment error UI is visible and includes decline information; no confirmation page shown.

Expected
- Application surfaces a clear payment error message and does not proceed to confirmation.

---

## IT-FLT-001 — Email send integration
- File: `tests/flights/it-email-confirmation.spec.ts`
- Tags: @integration @email
- Short description: Verify booking triggers an email send request with expected payload (intercepted).

Test data
- Intercept `**/api/email/send**` and stub success response. Use test email `integration.email.test@example.com`.

Steps
1. Intercept the email send API and capture the request JSON.
2. Go through search -> select flight -> passenger info -> summary.
3. Trigger the email confirmation action on summary (test helper) that calls the email API.
4. Assert the intercepted payload contains the expected `to`, `subject` and `body` fields and the `to` equals the test email.

Expected
- Email API is called with a payload containing booking details and the expected recipient and subject.

---

How to run these tests

1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Run the flight tests: `npx playwright test tests/flights --project=chromium`

Notes & next steps
- The test specs include calls to page-object helpers located in `pages/` — adjust selectors in the page objects to match the application under test for reliable runs.
- If your real environment requires API keys, sandbox payment credentials, or a test email provider (MailSlurp, Ethereal), set those environment variables before running.

If you want, I can also: refine page-object selectors against your base URL, add a `README.md` entry in `tests/flights/`, or create a GitHub Actions workflow to run these tests automatically.

