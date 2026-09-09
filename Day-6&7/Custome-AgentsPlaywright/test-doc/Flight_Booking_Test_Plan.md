# PHPTRAVELS Flight Booking - Comprehensive Test Plan

**Document Type:** Playwright Automation Test Plan  
**Project:** PHPTRAVELS Flight Booking  
**Base URL:** https://phptravels.net/  
**Framework:** Playwright with TypeScript  
**Target Browser:** Chromium  
**Environment:** QA/Demo  
**Prepared Date:** September 8, 2026  
**Document Version:** 1.0  

---

## TABLE OF CONTENTS

1. [Test Plan Overview](#1-test-plan-overview)
2. [Test Environment Setup](#2-test-environment-setup)
3. [Happy Path Scenarios](#3-happy-path-scenarios)
4. [Negative Test Scenarios](#4-negative-test-scenarios)
5. [Boundary Test Scenarios](#5-boundary-test-scenarios)
6. [Validation Test Scenarios](#6-validation-test-scenarios)
7. [Integration Test Scenarios](#7-integration-test-scenarios)
8. [Security Test Scenarios](#8-security-test-scenarios)
9. [Test Execution Strategy](#9-test-execution-strategy)
10. [Success Criteria](#10-success-criteria)

---

## 1. TEST PLAN OVERVIEW

### 1.1 Objective
To create a comprehensive test automation plan for the PHPTRAVELS flight booking module using Playwright, covering all critical user journeys, edge cases, and error scenarios.

### 1.2 Scope
- **Included:** Flight search, booking workflow, passenger info, seat selection, add-ons, payment, confirmation
- **Excluded:** Admin panel, hotel/car/tour bookings (flight module only)
- **Duration:** Test suite execution < 60 minutes
- **Coverage Target:** 80%+ automation coverage

### 1.3 Test Pyramid
```
                    △
                   /  \          (Integration/Security)
                  /    \         (5-10% of tests)
                 /______\
                /        \       (Negative/Edge Cases)
               /          \      (30-40% of tests)
              /____________\
             /              \    (Happy Path/Core)
            /                \   (50-60% of tests)
           /__________________|
```

### 1.4 Test Categories
- **Happy Path (HP):** Normal user behavior, successful workflows
- **Negative (NG):** Error handling, invalid inputs, edge cases
- **Boundary (BD):** Limit testing, cutoff values, edge conditions
- **Validation (VL):** Form validation, business rule enforcement
- **Integration (IT):** Third-party systems, payment, email, APIs
- **Security (SC):** Authentication, data protection, compliance

---

## 2. TEST ENVIRONMENT SETUP

### 2.1 Prerequisites

#### 2.1.1 Browser & Dependencies
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install TypeScript
npm install --save-dev typescript

# Install utilities
npm install --save-dev dotenv # For environment variables
```

#### 2.1.2 Environment Variables
Create `.env` file in project root:
```
BASE_URL=https://phptravels.net/
ADMIN_USER=admin@phptravels.com
ADMIN_PASSWORD=TestPass123!
TEST_USER=flighttest.premium@example.com
TEST_PASSWORD=TestPass123!
PAYMENT_CARD=4242424242424242
PAYMENT_CVV=123
PAYMENT_EXPIRY=12/26
TEST_EMAIL=flighttest.premium@example.com
```

#### 2.1.3 Test Data Setup

**Test Accounts:**
```
Account 1 (Premium):
  Email: flighttest.premium@example.com
  Password: TestPass123!
  Frequent Flyer: AA1234567890
  
Account 2 (Regular):
  Email: flighttest.regular@example.com
  Password: TestPass123!
  
Account 3 (New):
  Email: flighttest.new.{timestamp}@example.com
  Password: TestPass123!
```

**Test Flights:**
```
Flight 1 (Stable, Main Test):
  Route: JFK → LHR
  Date: Next available date
  Airline: British Airways / Any major carrier
  Seats: 50+ available
  Price: Stable ($400-500)

Flight 2 (Round-Trip):
  Route: LHR → CDG
  Dates: 7 days apart minimum
  Airline: Any available
  Seats: 30+ available
```

**Test Payment Cards:**
```
Success Card: 4242 4242 4242 4242
Expiry: 12/26, CVV: 123

Decline Card: 4000 0000 0000 0002
Expiry: 12/26, CVV: 123
```

#### 2.1.4 Test Coupons
```
Valid Coupon: TEST50 (permanent, $50 off)
Valid Coupon (Percentage): TEST10PCT (permanent, 10% off)
Expired Coupon: EXPIRED (for negative testing)
```

### 2.2 Page Object Model Structure

```
pages/
  ├── HomePage.ts
  ├── FlightSearchPage.ts
  ├── FlightResultsPage.ts
  ├── PassengerInfoPage.ts
  ├── SeatSelectionPage.ts
  ├── AddOnsPage.ts
  ├── BookingSummaryPage.ts
  ├── PaymentPage.ts
  └── ConfirmationPage.ts

utils/
  ├── testData.ts
  ├── helpers.ts
  ├── assertions.ts
  └── constants.ts

fixtures/
  └── testFixtures.ts
```

### 2.3 Test Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'https://phptravels.net',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: undefined,
  timeout: 60000,
  expect: { timeout: 5000 },
});
```

---

## 3. HAPPY PATH SCENARIOS

### 3.1 HP-FLT-001: One-Way Flight Search & Booking

**Objective:** Verify user can search and book a one-way flight successfully.

**Preconditions:**
- User is on PHPTRAVELS home page
- Test user account available
- One-way flights available for test route (JFK → LHR)
- Test payment card configured

**Test Steps:**

1. Navigate to flight search page
   - Click "Flights" menu or link
   - Verify flight search form displays
   - Verify form fields: Departure, Arrival, Date, Passengers, Cabin Class

2. Search for one-way flight
   - Select trip type: "One-Way"
   - Enter departure city: "New York (JFK)"
   - Enter arrival city: "London (LHR)"
   - Select departure date: 14 days from today
   - Select passengers: "1 Adult"
   - Select cabin class: "Economy"
   - Click "Search Flights" button

3. Verify search results
   - Wait for results to load (< 10 seconds)
   - Verify results page displays
   - Verify minimum 5 flight options visible
   - Verify each result shows: Airline, Time, Duration, Price, Select button

4. Select flight
   - Identify lowest-priced flight
   - Click "Select" button on flight
   - Verify flight is highlighted/selected
   - Verify page transitions to passenger info

5. Enter passenger information
   - Verify passenger info form displays
   - Enter Title: "Mr."
   - Enter First Name: "John"
   - Enter Last Name: "Smith"
   - Enter Date of Birth: "01/01/1990"
   - Enter Email: "john.smith.{timestamp}@example.com"
   - Enter Phone: "+1-555-123-4567"
   - Click "Continue" button

6. Skip/confirm seat selection
   - Verify seat map displays
   - Click "Skip" or auto-assign seat
   - Verify seat confirmation message

7. Review add-ons
   - Verify add-ons page displays (baggage, insurance, meals)
   - Skip add-ons for basic test
   - Click "Continue" button

8. Review booking summary
   - Verify booking summary page displays
   - Verify passenger name: "John Smith"
   - Verify flight details (date, time, airline, price)
   - Verify total price displayed
   - Verify T&Cs checkbox
   - Check T&Cs checkbox
   - Click "Proceed to Payment" button

9. Process payment
   - Verify payment page displays
   - Enter card number: "4242 4242 4242 4242"
   - Enter expiry: "12/26"
   - Enter CVV: "123"
   - Click "Pay Now" button

10. Verify confirmation
    - Wait for confirmation page (< 10 seconds)
    - Verify confirmation message: "Booking Confirmed"
    - Verify booking reference displayed (format: FLT-XXXXXX or similar)
    - Verify confirmation email received within 5 minutes
    - Verify booking in user's booking history

**Expected Outcomes:**
- ✅ Flight search completes successfully
- ✅ Flight results display with minimum 5 options
- ✅ Booking reference generated
- ✅ Confirmation email received
- ✅ Booking appears in user history
- ✅ Total payment processed correctly

**Success Criteria:**
- Test passes if all 10 steps complete without errors
- Booking reference matches expected format
- Confirmation email contains all required booking details

---

### 3.2 HP-FLT-002: Round-Trip Flight Booking

**Objective:** Verify user can book a round-trip flight successfully.

**Preconditions:**
- User is on PHPTRAVELS home page
- Round-trip flights available for test route
- Minimum 2 nights between outbound and return dates

**Test Steps:**

1. Navigate to flight search page
   - Click "Flights" menu
   - Verify flight search form displays

2. Search for round-trip flights
   - Select trip type: "Round-Trip"
   - Enter departure city: "New York (JFK)"
   - Enter arrival city: "London (LHR)"
   - Select outbound date: 14 days from today
   - Select return date: 16 days from today (minimum 2 nights)
   - Select passengers: "1 Adult"
   - Select cabin class: "Economy"
   - Click "Search Flights" button

3. Verify outbound results
   - Wait for results to load
   - Verify minimum 5 outbound flight options
   - Verify each flight shows time, duration, price

4. Select outbound flight
   - Select lowest-priced outbound flight
   - Verify results update to show return flight options

5. Select return flight
   - Verify return flight results displayed
   - Select lowest-priced return flight
   - Verify both flights highlighted

6. Enter passenger information
   - Verify passenger form displays
   - Fill passenger details (Title, Name, DOB, Email, Phone)
   - Click "Continue"

7. Complete seat selection & add-ons
   - Auto-assign seats or skip
   - Skip additional add-ons
   - Click "Continue"

8. Review booking summary
   - Verify both outbound and return flights displayed
   - Verify total price includes both flights
   - Check T&Cs
   - Click "Proceed to Payment"

9. Process payment
   - Enter valid payment card
   - Click "Pay Now"

10. Verify confirmation
    - Verify booking confirmation displays
    - Verify booking reference generated
    - Verify both outbound and return flights in confirmation
    - Verify confirmation email received

**Expected Outcomes:**
- ✅ Both outbound and return flights selected successfully
- ✅ Booking includes both flight segments
- ✅ Total price correct for both flights
- ✅ Confirmation shows both flights

**Success Criteria:**
- Test passes if round-trip booking completes with both flight segments
- Confirmation includes all details for both flights

---

### 3.3 HP-FLT-003: Multi-Passenger Booking (Adult + Child)

**Objective:** Verify system correctly handles multi-passenger booking with child fare discount.

**Preconditions:**
- Flights available for 2 passengers
- System supports child discount pricing

**Test Steps:**

1. Search for flights
   - Select trip type: "One-Way"
   - Enter departure: "New York (JFK)"
   - Enter arrival: "London (LHR)"
   - Select date: 14 days from today
   - Select passengers: "1 Adult, 1 Child" (age 8)
   - Click "Search Flights"

2. Select flight
   - Verify results display pricing for 1 adult + 1 child
   - Verify child fare is lower than adult fare
   - Select flight

3. Enter passenger information
   - Enter Adult info:
     - Title: "Mr.", Name: "John Smith", DOB: "01/01/1990"
   - Enter Child info:
     - Title: "Miss", Name: "Emma Smith", DOB: "15/06/2015" (age 8)
   - Click "Continue"

4. Complete seat selection
   - Assign 2 seats (one for adult, one for child)
   - Verify both seats assigned

5. Review & confirm booking
   - Verify both passengers in summary
   - Verify child discount applied in pricing
   - Verify total = (Adult fare × 1) + (Child fare × 1)
   - Complete payment

6. Verify confirmation
   - Verify both passengers in confirmation
   - Verify correct fare types (Adult/Child)
   - Verify booking reference generated

**Expected Outcomes:**
- ✅ Child discount applied to pricing
- ✅ Both passengers appear in booking
- ✅ Total price correct for mixed passenger types
- ✅ Confirmation shows passenger types

**Success Criteria:**
- Test passes if child discount is correctly applied
- Confirmation confirms both passengers with correct fare types

---

### 3.4 HP-FLT-004: Booking with Premium Seat Selection

**Objective:** Verify user can select and pay for premium seats.

**Preconditions:**
- Premium (extra legroom) seats available
- Premium seat pricing configured

**Test Steps:**

1. Complete flight search and passenger info
   - Search for flight as in HP-FLT-001
   - Enter passenger information
   - Navigate to seat selection

2. Select premium seat
   - Verify seat map displays all seats
   - Identify premium seat (marked with extra legroom icon)
   - Click premium seat
   - Verify seat selected and highlighted

3. Verify premium seat pricing
   - Verify seat price displayed ($50-100 upcharge)
   - Verify total price updated with seat fee
   - Click "Continue"

4. Review booking summary
   - Verify premium seat selected in summary
   - Verify seat fee added to total price
   - Verify seat details shown in price breakdown
   - Complete payment

5. Verify confirmation
   - Verify seat selection in confirmation email
   - Verify seat fee in confirmation details

**Expected Outcomes:**
- ✅ Premium seat selected successfully
- ✅ Premium seat fee calculated and added
- ✅ Total price includes seat fee
- ✅ Confirmation includes seat details

**Success Criteria:**
- Test passes if premium seat fee is correctly applied and confirmed

---

### 3.5 HP-FLT-005: Booking with Baggage Add-on

**Objective:** Verify user can add baggage during booking.

**Preconditions:**
- Baggage add-ons available for test flight
- Baggage pricing configured

**Test Steps:**

1. Complete flight search and passenger info (as in HP-FLT-001)

2. Skip to add-ons page
   - Navigate to add-ons page after seat selection

3. Add baggage
   - Verify baggage options displayed
   - Included baggage: 1 × 23kg (free)
   - Click "Add extra baggage" for +20kg
   - Verify baggage price displayed ($30-50)

4. Verify baggage fee
   - Verify total price updated with baggage fee
   - Click "Continue"

5. Review booking summary
   - Verify baggage add-on in summary
   - Verify baggage fee in price breakdown
   - Complete payment

6. Verify confirmation
   - Verify baggage allowance in confirmation
   - Verify baggage fee in confirmation details
   - Verify total baggage (included + extra)

**Expected Outcomes:**
- ✅ Baggage add-on selected
- ✅ Baggage fee calculated correctly
- ✅ Total baggage shown in confirmation
- ✅ Baggage details in confirmation email

**Success Criteria:**
- Test passes if baggage add-on is correctly added and confirmed

---

### 3.6 HP-FLT-006: Booking with Coupon Code

**Objective:** Verify user can apply valid coupon and receive discount.

**Preconditions:**
- Valid coupon code available (TEST50 - $50 off)
- Booking amount > coupon amount

**Test Steps:**

1. Complete flight search and passenger info

2. Navigate to booking summary

3. Apply coupon code
   - Locate coupon code input field
   - Enter coupon: "TEST50"
   - Click "Apply Coupon" button

4. Verify discount applied
   - Verify discount message: "Discount applied: -$50"
   - Verify total price reduced by $50
   - Verify original price shown for reference

5. Proceed to payment
   - Click "Proceed to Payment"
   - Verify discounted price in payment

6. Complete payment
   - Enter payment details
   - Process payment

7. Verify confirmation
   - Verify discounted amount in confirmation
   - Verify coupon applied in booking details
   - Verify original price and discount shown

**Expected Outcomes:**
- ✅ Coupon applied successfully
- ✅ Discount calculated correctly
- ✅ Final price reduced by discount amount
- ✅ Confirmation shows discount applied

**Success Criteria:**
- Test passes if coupon discount is correctly applied to booking

---

### 3.7 HP-FLT-007: Booking with Travel Insurance

**Objective:** Verify user can add travel insurance to booking.

**Preconditions:**
- Travel insurance available
- Insurance pricing configured

**Test Steps:**

1. Complete flight search and passenger info

2. Navigate to add-ons page

3. Select travel insurance
   - Verify insurance option displayed
   - Verify insurance price per person ($15-25)
   - Click "Select Insurance"
   - Verify checkbox marked

4. Verify insurance fee
   - Verify total price updated with insurance
   - Insurance cost = Price per person × Number of passengers

5. Review booking summary
   - Verify insurance in summary
   - Verify insurance fee in price breakdown
   - Complete payment

6. Verify confirmation
   - Verify insurance in confirmation
   - Verify insurance fee shown
   - Verify insurance details in email

**Expected Outcomes:**
- ✅ Insurance selected and fee calculated
- ✅ Total price includes insurance
- ✅ Insurance confirmed in booking

**Success Criteria:**
- Test passes if insurance fee is correctly calculated and confirmed

---

### 3.8 HP-FLT-008: Booking in Alternative Language

**Objective:** Verify booking can be completed in alternative language (e.g., Spanish).

**Preconditions:**
- Multiple languages supported
- All text translated correctly

**Test Steps:**

1. Navigate to home page

2. Switch language
   - Locate language selector (typically top-right)
   - Click language dropdown
   - Select "Spanish" or other alternative language
   - Verify page reloads in selected language

3. Search for flights
   - Verify all form labels in Spanish
   - Enter flight search criteria
   - Search for flights

4. Complete booking
   - Select flight
   - Enter passenger info in Spanish form
   - Complete add-ons and payment in Spanish
   - Process payment

5. Verify confirmation
   - Verify confirmation page in Spanish
   - Verify confirmation email in Spanish
   - Verify booking history shows Spanish labels

**Expected Outcomes:**
- ✅ All text displays in selected language
- ✅ Booking completes successfully in alternative language
- ✅ Confirmation in correct language

**Success Criteria:**
- Test passes if entire booking workflow works in alternative language

---

## 4. NEGATIVE TEST SCENARIOS

### 4.1 NG-FLT-001: Search Without Departure City

**Objective:** Verify system rejects search with missing departure city.

**Preconditions:**
- User is on flight search page
- All fields visible and ready for input

**Test Steps:**

1. Fill search form partially
   - Leave departure city empty
   - Enter arrival city: "London (LHR)"
   - Enter date: 14 days from today
   - Enter passengers: "1 Adult"

2. Attempt to search
   - Click "Search Flights" button

3. Verify error message
   - Verify error message displays: "Departure city is required"
   - Verify departure city field highlighted in red
   - Verify submit button remains disabled or form not submitted

4. Correct field
   - Enter departure city: "New York (JFK)"
   - Verify error message disappears
   - Verify submit button enabled

**Expected Outcomes:**
- ✅ Error message displays for missing field
- ✅ Field highlighted as invalid
- ✅ Form cannot be submitted with missing required field

**Success Criteria:**
- Test passes if system prevents search without departure city

---

### 4.2 NG-FLT-002: Search with Identical Departure & Arrival Cities

**Objective:** Verify system rejects search where departure equals arrival city.

**Preconditions:**
- User is on flight search page

**Test Steps:**

1. Fill search form
   - Enter departure city: "New York (JFK)"
   - Enter arrival city: "New York (JFK)" (same as departure)
   - Enter date and passengers
   - Click "Search Flights"

2. Verify error handling
   - Verify error message: "Departure and arrival cities cannot be the same"
   - Verify search not executed
   - Verify results page not displayed

3. Correct and retry
   - Change arrival to: "London (LHR)"
   - Click "Search Flights"
   - Verify search executes successfully

**Expected Outcomes:**
- ✅ Validation prevents same-city bookings
- ✅ Clear error message displayed
- ✅ User can correct and retry

**Success Criteria:**
- Test passes if system validates city pairs correctly

---

### 4.3 NG-FLT-003: Search with Past Departure Date

**Objective:** Verify system rejects search with past departure date.

**Preconditions:**
- User is on flight search page

**Test Steps:**

1. Attempt to enter past date
   - Click departure date field
   - Try to select date 5 days ago
   - Verify past dates are disabled/grayed out in date picker

2. Verify error handling
   - If date picker prevents selection, verify disabled state
   - If manual entry possible, verify error on submit

3. Select valid future date
   - Select valid future date
   - Click "Search Flights"
   - Verify search executes

**Expected Outcomes:**
- ✅ Past dates prevented via date picker or validation
- ✅ Error message if manual entry attempted
- ✅ User can select valid future date

**Success Criteria:**
- Test passes if system prevents booking in the past

---

### 4.4 NG-FLT-004: Payment Declined - Insufficient Funds

**Objective:** Verify system handles payment failure gracefully.

**Preconditions:**
- Booking ready for payment
- Test card that declines available

**Test Steps:**

1. Complete booking up to payment
   - Complete flight search and passenger info
   - Review booking summary
   - Click "Proceed to Payment"

2. Enter declined card
   - Enter declined card number: "4000 0000 0000 0002"
   - Enter expiry: "12/26"
   - Enter CVV: "123"
   - Click "Pay Now"

3. Verify payment failure
   - Wait for payment response (< 10 seconds)
   - Verify error message: "Payment Declined" or "Insufficient Funds"
   - Verify booking NOT created
   - Verify no charge applied

4. Retry with valid card
   - Verify payment form still displayed
   - Enter valid card: "4242 4242 4242 4242"
   - Click "Pay Now"
   - Verify payment succeeds

**Expected Outcomes:**
- ✅ Payment failure handled gracefully
- ✅ Error message displayed
- ✅ No booking created on failure
- ✅ Retry possible with different card
- ✅ Only 1 booking created on success

**Success Criteria:**
- Test passes if payment failure doesn't create booking

---

### 4.5 NG-FLT-005: Invalid Passenger Name (Contains Numbers)

**Objective:** Verify system rejects invalid characters in passenger name.

**Preconditions:**
- User is on passenger information page

**Test Steps:**

1. Complete flight selection

2. Enter invalid name
   - Enter first name: "John123"
   - Leave other fields valid
   - Click "Continue"

3. Verify validation error
   - Verify error message: "Name cannot contain numbers"
   - Verify name field highlighted
   - Verify submit disabled

4. Correct name
   - Clear name field
   - Enter valid name: "John"
   - Verify error clears
   - Click "Continue"

**Expected Outcomes:**
- ✅ Validation catches invalid characters
- ✅ Clear error message displayed
- ✅ User can correct and continue

**Success Criteria:**
- Test passes if system validates passenger names correctly

---

### 4.6 NG-FLT-006: Invalid Email Format

**Objective:** Verify system validates email format.

**Preconditions:**
- User is on passenger information page

**Test Steps:**

1. Enter invalid email
   - Enter email: "invalid.email@" (incomplete)
   - Click outside email field (trigger validation)

2. Verify error
   - Verify error message: "Invalid email format"
   - Verify email field highlighted

3. Correct email
   - Enter valid email: "valid.email@example.com"
   - Verify error clears

**Expected Outcomes:**
- ✅ Email format validation works
- ✅ Error message displayed for invalid format
- ✅ Valid email accepted

**Success Criteria:**
- Test passes if email validation is correct

---

### 4.7 NG-FLT-007: Expired Coupon Code

**Objective:** Verify system rejects expired coupons.

**Preconditions:**
- Booking ready for coupon application
- Expired coupon code available (EXPIRED)

**Test Steps:**

1. Navigate to booking summary

2. Apply expired coupon
   - Enter coupon: "EXPIRED"
   - Click "Apply Coupon"

3. Verify error
   - Verify error message: "Coupon has expired"
   - Verify discount not applied
   - Verify total price unchanged

4. Try valid coupon
   - Enter valid coupon: "TEST50"
   - Verify discount applied successfully

**Expected Outcomes:**
- ✅ Expired coupon rejected
- ✅ Error message displayed
- ✅ Valid coupon accepted

**Success Criteria:**
- Test passes if coupon validation works correctly

---

### 4.8 NG-FLT-008: Selecting Unavailable Seat

**Objective:** Verify system handles unavailable seats during selection.

**Preconditions:**
- Seat selection page displayed
- Some seats marked as unavailable

**Test Steps:**

1. Attempt to select unavailable seat
   - Locate unavailable seat (marked as occupied/sold)
   - Click on unavailable seat
   - Verify click not registered or error displayed

2. Select available seat
   - Select available seat
   - Verify seat highlighted/selected
   - Verify selection accepted

**Expected Outcomes:**
- ✅ Unavailable seats cannot be selected
- ✅ Only available seats selectable
- ✅ Available seat selection works

**Success Criteria:**
- Test passes if seat availability validation works

---

## 5. BOUNDARY TEST SCENARIOS

### 5.1 BD-FLT-001: Booking with Exactly 9 Passengers (Maximum)

**Objective:** Verify system allows maximum 9 passengers per booking.

**Preconditions:**
- System supports multi-passenger bookings

**Test Steps:**

1. Search for flights
   - Select trip type: "One-Way"
   - Select passengers: "9" (5 Adults, 3 Children, 1 Infant)
   - Complete flight search

2. Select flight
   - Select flight from results
   - Navigate to passenger info

3. Enter all 9 passengers
   - Enter 5 adult passengers
   - Enter 3 child passengers (age 5, 8, 10)
   - Enter 1 infant (age 1)
   - Verify all passengers entered

4. Complete booking
   - Assign seats to all passengers (8 seats for children/adults, 1 infant on lap)
   - Review booking summary
   - Verify all 9 passengers listed

5. Process payment
   - Complete payment with valid card
   - Verify booking confirmation

6. Verify confirmation
   - Verify all 9 passengers in confirmation
   - Verify correct fare types applied
   - Verify total price = sum of all fares

**Expected Outcomes:**
- ✅ System accepts maximum 9 passengers
- ✅ Booking includes all 9 passengers
- ✅ Pricing correct for mixed passenger types
- ✅ Confirmation shows all passengers

**Success Criteria:**
- Test passes if 9-passenger booking completes successfully

---

### 5.2 BD-FLT-002: Booking with Minimum 1 Passenger

**Objective:** Verify system allows minimum 1 passenger per booking.

**Preconditions:**
- System supports single-passenger bookings

**Test Steps:**

1. Search for flights
   - Select passengers: "1 Adult"
   - Complete flight search

2. Select flight and complete booking
   - Select flight
   - Enter passenger info (1 adult only)
   - Complete booking

3. Verify confirmation
   - Verify single passenger in booking
   - Verify total price for 1 passenger

**Expected Outcomes:**
- ✅ Single-passenger booking allowed
- ✅ Booking includes 1 passenger
- ✅ Pricing correct for 1 passenger

**Success Criteria:**
- Test passes if 1-passenger booking works correctly

---

### 5.3 BD-FLT-003: Passenger Age Boundary - Exactly 2 Years (Infant to Child Cutoff)

**Objective:** Verify correct age categorization at age 2 boundary.

**Preconditions:**
- System distinguishes infant (0-1) from child (2-11) fares

**Test Steps:**

1. Search for 1 passenger age exactly 2 years old
   - Search parameters: 1 passenger (2-year-old)

2. Complete flight selection
   - Select flight
   - Enter passenger DOB: exactly 2 years old as of flight date
   - Verify system categorizes as Child, not Infant

3. Verify pricing
   - Verify child fare applied (not infant discount)
   - Verify passenger categorized as "Child" in forms

4. Compare with 1.99 years old
   - Book similar flight with passenger age 1.99 years
   - Verify infant fare applied
   - Verify age 2 passenger pays more (child vs infant)

**Expected Outcomes:**
- ✅ Age 2 passengers categorized as Child
- ✅ Age <2 passengers categorized as Infant
- ✅ Pricing differs based on age category

**Success Criteria:**
- Test passes if age boundary (2 years) correctly categorized

---

### 5.4 BD-FLT-004: Passenger Age Boundary - Exactly 12 Years (Child to Adult Cutoff)

**Objective:** Verify correct age categorization at age 12 boundary.

**Preconditions:**
- System distinguishes child (2-11) from adult (12+) fares

**Test Steps:**

1. Search for 1 passenger age exactly 12 years old
   - Search parameters: 1 passenger (12-year-old)

2. Complete flight selection
   - Select flight
   - Enter passenger DOB: exactly 12 years old as of flight date
   - Verify system categorizes as Adult, not Child

3. Verify pricing
   - Verify adult fare applied (higher than child)
   - Verify passenger categorized as "Adult" in forms

4. Compare with 11.99 years old
   - Book similar flight with passenger age 11 years
   - Verify child fare applied
   - Verify age 12 passenger pays more (adult vs child)

**Expected Outcomes:**
- ✅ Age 12 passengers categorized as Adult
- ✅ Age <12 passengers categorized as Child
- ✅ Pricing differs based on age category

**Success Criteria:**
- Test passes if age boundary (12 years) correctly categorized

---

### 5.5 BD-FLT-005: Flight Crossing Midnight

**Objective:** Verify correct handling of flights that cross midnight.

**Preconditions:**
- Flight available that departs late evening and arrives next day

**Test Steps:**

1. Search for flight crossing midnight
   - Search: Departure evening (e.g., 11:45 PM)
   - Verify flight available (arrival next day, e.g., 2:15 AM)

2. Verify flight details display correctly
   - Verify departure time: 11:45 PM (same date)
   - Verify arrival time: 2:15 AM (next date)
   - Verify duration calculated across midnight (3.5 hours, not 21.5 hours)
   - Verify arrival date is next calendar day

3. Complete booking with this flight
   - Select flight
   - Complete booking
   - Verify dates and times in confirmation

**Expected Outcomes:**
- ✅ Midnight-crossing flights display correctly
- ✅ Duration calculated correctly across date boundary
- ✅ Arrival date correct (next day)
- ✅ Booking includes correct dates/times

**Success Criteria:**
- Test passes if midnight-crossing flight handled correctly

---

### 5.6 BD-FLT-006: Very High Price (Luxury Flight)

**Objective:** Verify system handles very high prices without error.

**Preconditions:**
- First-class or premium flights available at high prices ($5,000+)

**Test Steps:**

1. Search for first-class flights
   - Search: Cabin class = First Class
   - Verify premium/expensive flights listed

2. Select high-price flight
   - Select flight priced $5,000+
   - Verify price displays correctly (formatted, e.g., "$5,000.00")

3. Complete booking
   - Enter passenger info
   - Complete add-ons
   - Verify total price in booking summary

4. Process payment
   - Verify payment system accepts high amount
   - Complete payment with test card

5. Verify confirmation
   - Verify high price correctly reflected in confirmation
   - Verify total price formatted correctly

**Expected Outcomes:**
- ✅ High prices display without error
- ✅ Formatting correct (currency symbol, decimals)
- ✅ Payment processes high amount
- ✅ Confirmation shows correct price

**Success Criteria:**
- Test passes if system handles high prices correctly

---

### 5.7 BD-FLT-007: Zero-Price Flight (Promotional)

**Objective:** Verify system handles free flights (promotion).

**Preconditions:**
- Free or promotional flights available

**Test Steps:**

1. Search for flights
   - Look for flights priced $0 or "Free"

2. Select free flight
   - Verify price displays as "$0.00" or "Free"
   - Select flight

3. Complete booking
   - Enter passenger info
   - Verify booking summary shows $0.00 base fare
   - Verify taxes/fees still apply (if any)
   - Verify total price calculated

4. Process payment
   - If total = $0, verify payment not required
   - Or verify payment for taxes only
   - Verify booking confirmed

5. Verify confirmation
   - Verify free price in confirmation
   - Verify booking created successfully

**Expected Outcomes:**
- ✅ Free flights handled correctly
- ✅ Price displays as $0.00
- ✅ Booking completes (payment not required if total = 0)
- ✅ Confirmation shows free price

**Success Criteria:**
- Test passes if free flights processed correctly

---

## 6. VALIDATION TEST SCENARIOS

### 6.1 VL-FLT-001: Email Format Validation

**Objective:** Verify email validation accepts/rejects correct formats.

**Preconditions:**
- Passenger information page displayed

**Test Steps:**

1. Test valid email formats
   - Valid: user@domain.com ✅
   - Valid: user+tag@example.co.uk ✅
   - Valid: user.name@company.ac.in ✅
   - Verify all accepted without error

2. Test invalid email formats
   - Invalid: @domain.com (no local part) ❌
   - Invalid: user@.com (no domain name) ❌
   - Invalid: user domain@com (space in email) ❌
   - Verify all rejected with error message

3. Verify error messages
   - Verify clear message for each invalid format
   - Verify user can correct and retry

**Expected Outcomes:**
- ✅ Valid emails accepted
- ✅ Invalid emails rejected
- ✅ Clear error messages displayed

**Success Criteria:**
- Test passes if email validation is comprehensive and correct

---

### 6.2 VL-FLT-002: Phone Number Validation

**Objective:** Verify phone number format validation.

**Preconditions:**
- Passenger information page displayed

**Test Steps:**

1. Test valid phone formats
   - Valid: +1-555-123-4567 ✅ (with country code)
   - Valid: +44-20-7123-4567 ✅ (UK format)
   - Valid: +91-11-2345-6789 ✅ (India format)
   - Verify all accepted

2. Test invalid phone formats
   - Invalid: 123 (too short) ❌
   - Invalid: abc-def-ghij (letters) ❌
   - Verify all rejected with error

3. Verify error messages
   - Verify clear message for invalid format

**Expected Outcomes:**
- ✅ Valid phones accepted
- ✅ Invalid phones rejected
- ✅ Error messages displayed

**Success Criteria:**
- Test passes if phone validation is correct

---

### 6.3 VL-FLT-003: Passenger Name Validation

**Objective:** Verify passenger name validation rules.

**Preconditions:**
- Passenger information page displayed

**Test Steps:**

1. Test valid names
   - Valid: "John Smith" ✅
   - Valid: "José María" ✅ (accented characters)
   - Valid: "Mary-Jane" ✅ (hyphen)
   - Valid: "O'Brien" ✅ (apostrophe)
   - Verify all accepted

2. Test invalid names
   - Invalid: "John123" ❌ (numbers)
   - Invalid: "John@Smith" ❌ (special chars)
   - Invalid: "J" ❌ (too short, min 2 chars)
   - Verify all rejected

3. Test name length
   - Enter 50-character name: accepted ✅
   - Enter 100-character name: rejected ❌
   - Verify max length enforced

**Expected Outcomes:**
- ✅ Valid names accepted
- ✅ Invalid names rejected
- ✅ Length limits enforced

**Success Criteria:**
- Test passes if name validation is comprehensive

---

### 6.4 VL-FLT-004: Date of Birth Validation

**Objective:** Verify DOB validation for age categorization.

**Preconditions:**
- Passenger information page displayed

**Test Steps:**

1. Test infant age (0-1 years)
   - Enter DOB: 6 months ago → Infant category ✅
   - Enter DOB: 1.9 years ago → Infant category ✅
   - Verify infant pricing applied

2. Test child age (2-11 years)
   - Enter DOB: 2.0 years ago → Child category ✅
   - Enter DOB: 10 years ago → Child category ✅
   - Verify child pricing applied

3. Test adult age (12+ years)
   - Enter DOB: 12.0 years ago → Adult category ✅
   - Enter DOB: 50 years ago → Adult category ✅
   - Verify adult pricing applied

4. Test invalid DOBs
   - Enter DOB: Future date → Rejected ❌
   - Enter DOB: 200 years ago → Rejected ❌
   - Verify error messages

**Expected Outcomes:**
- ✅ Valid DOBs accepted with correct age category
- ✅ Invalid DOBs rejected
- ✅ Pricing reflects age category

**Success Criteria:**
- Test passes if DOB validation and categorization are correct

---

### 6.5 VL-FLT-005: Round-Trip Date Validation

**Objective:** Verify date validation for round-trip bookings.

**Preconditions:**
- Round-trip flight search page

**Test Steps:**

1. Test valid round-trip dates
   - Outbound: Sept 15, 2026
   - Return: Sept 17, 2026 (2 nights) ✅
   - Verify search executes

2. Test return date = outbound date
   - Outbound: Sept 15
   - Return: Sept 15 (same day) ❌
   - Verify error: "Minimum 1 night stay required"

3. Test return before outbound
   - Outbound: Sept 15
   - Return: Sept 14 (before outbound) ❌
   - Verify error: "Return date must be after departure date"
   - Verify return date picker only allows dates after outbound

**Expected Outcomes:**
- ✅ Valid round-trip dates accepted
- ✅ Invalid date combinations rejected
- ✅ Error messages clear

**Success Criteria:**
- Test passes if round-trip date validation is correct

---

### 6.6 VL-FLT-006: Required Field Validation

**Objective:** Verify all required fields are enforced.

**Preconditions:**
- Any form in flight booking workflow

**Test Steps:**

1. Identify all required fields
   - Mark with asterisk (*)
   - Document all required fields

2. Test each required field
   - Leave required field empty
   - Attempt to submit form
   - Verify error message displayed
   - Verify field highlighted (red border)
   - Verify submit button disabled

3. Fill required field
   - Enter value in field
   - Verify error clears
   - Verify field no longer highlighted

**Expected Outcomes:**
- ✅ All required fields enforced
- ✅ Error messages displayed
- ✅ Visual feedback (highlighting)
- ✅ Submit button respects validation

**Success Criteria:**
- Test passes if all required fields are validated correctly

---

## 7. INTEGRATION TEST SCENARIOS

### 7.1 IT-FLT-001: Booking Confirmation Email

**Objective:** Verify confirmation email sent after successful booking.

**Preconditions:**
- Booking completed successfully
- Test email account configured (MailSlurp or Ethereal)

**Test Steps:**

1. Complete flight booking
   - Complete entire booking workflow
   - Verify booking confirmed on screen
   - Note booking reference number

2. Check for confirmation email
   - Wait up to 5 minutes for email delivery
   - Retrieve email from test email service API

3. Verify email content
   - Verify email received at correct address
   - Verify subject includes booking reference
   - Verify email contains:
     - Booking reference
     - Passenger names
     - Flight details (dates, times, airlines)
     - Itinerary
     - Total price
     - Contact information
     - Cancellation policy

4. Verify email formatting
   - Verify email readable
   - Verify all information clear
   - Verify clickable links work

**Expected Outcomes:**
- ✅ Confirmation email sent within 5 minutes
- ✅ Email contains all required information
- ✅ Email properly formatted
- ✅ Links functional

**Success Criteria:**
- Test passes if confirmation email is sent with all required details

---

### 7.2 IT-FLT-002: E-Ticket PDF Generation

**Objective:** Verify e-ticket PDF generated and sent with confirmation.

**Preconditions:**
- Booking completed
- PDF generation configured

**Test Steps:**

1. Complete booking
   - Complete flight booking workflow

2. Retrieve confirmation email
   - Retrieve confirmation email from test email service
   - Verify email contains e-ticket attachment or link

3. Download/verify e-ticket
   - Download e-ticket PDF
   - Verify PDF opens without error
   - Verify PDF contains:
     - Booking reference
     - Passenger names
     - Flight details
     - Barcode/QR code
     - Airlines booking reference

4. Verify print quality
   - Verify PDF readable when printed
   - Verify barcode scannable
   - Verify all information legible

**Expected Outcomes:**
- ✅ E-ticket PDF generated
- ✅ Attached to confirmation email
- ✅ Contains all required information
- ✅ Properly formatted for printing/scanning

**Success Criteria:**
- Test passes if e-ticket is generated and sent correctly

---

### 7.3 IT-FLT-003: Payment Gateway Integration

**Objective:** Verify payment gateway processes payment correctly.

**Preconditions:**
- Payment gateway configured (Stripe/PayPal/other)
- Test payment cards available
- Booking ready for payment

**Test Steps:**

1. Initiate payment
   - Navigate to payment page
   - Verify payment form displays

2. Submit valid payment
   - Enter test card: 4242 4242 4242 4242
   - Enter expiry: 12/26, CVV: 123
   - Click "Pay Now"

3. Verify payment authorization
   - Wait for payment response
   - Verify payment status: Authorized/Captured
   - Verify transaction ID generated

4. Verify booking created
   - Verify booking created in system
   - Verify booking reference generated
   - Verify booking status: Confirmed

5. Verify payment recorded
   - Verify payment recorded in database
   - Verify amount charged correctly
   - Verify payment method tokenized (no card data stored)

**Expected Outcomes:**
- ✅ Payment authorized successfully
- ✅ Booking created after payment
- ✅ Transaction ID recorded
- ✅ Payment secure (no sensitive data stored)

**Success Criteria:**
- Test passes if payment processes and booking created correctly

---

### 7.4 IT-FLT-004: Seat Availability Update

**Objective:** Verify seat availability updated after booking.

**Preconditions:**
- Seat selection available
- Multiple test bookings possible

**Test Steps:**

1. Check initial seat availability
   - Select flight
   - Navigate to seat selection
   - Count available seats (e.g., 50 available)

2. Complete first booking
   - Select 2 seats for booking
   - Complete booking with payment

3. Check updated availability
   - Search same flight again
   - Navigate to seat selection
   - Verify seats previously booked now unavailable
   - Verify available seats reduced (e.g., 48 available)

4. Verify consistency
   - Book same flight again
   - Select different seats
   - Verify previously booked seats still unavailable

**Expected Outcomes:**
- ✅ Seat availability updated after booking
- ✅ Previously booked seats marked unavailable
- ✅ Available seat count decreases
- ✅ Consistency maintained across bookings

**Success Criteria:**
- Test passes if seat inventory correctly updated

---

### 7.5 IT-FLT-005: Flight Price Updates

**Objective:** Verify flight prices updated in real-time from airline feed.

**Preconditions:**
- Flight pricing synced from airline data source
- Multiple searches possible

**Test Steps:**

1. Search and note price
   - Search specific flight
   - Note price (e.g., $400)

2. Wait and search again
   - Wait 1-2 minutes
   - Search same flight again
   - Note current price (may be $400, $380, $420, etc.)

3. Verify price reflects changes
   - Compare prices from multiple searches
   - Document price variations
   - Verify prices are current from airline feed

4. Verify booking uses current price
   - Search flight
   - Note price
   - Complete booking
   - Verify booking price matches current search price (not older price)

**Expected Outcomes:**
- ✅ Prices reflect airline feed updates
- ✅ Booking uses current price at time of booking
- ✅ No stale prices used

**Success Criteria:**
- Test passes if flight prices are current and accurate

---

## 8. SECURITY TEST SCENARIOS

### 8.1 SC-FLT-001: Session Management & Timeout

**Objective:** Verify sessions managed securely with timeout.

**Preconditions:**
- User logged in
- Session timeout configured (e.g., 30 minutes)

**Test Steps:**

1. Log in
   - Authenticate with test account
   - Verify session token created

2. Perform booking
   - Start flight booking process
   - Complete passenger info

3. Simulate session inactivity
   - Wait for session timeout (or simulate timeout via cookie manipulation)
   - Attempt to proceed to next step

4. Verify session expiration
   - Verify user redirected to login
   - Verify booking not saved
   - Verify error message displayed

5. Re-authenticate
   - Log in again
   - Verify session restored
   - Verify booking data lost (fresh session)

**Expected Outcomes:**
- ✅ Sessions timeout after inactivity
- ✅ User must re-authenticate
- ✅ Session token invalidated
- ✅ User data not persisted across sessions

**Success Criteria:**
- Test passes if session management is secure

---

### 8.2 SC-FLT-002: Password Security

**Objective:** Verify passwords stored securely (hashed, not plaintext).

**Preconditions:**
- Database access available for verification
- Test account available

**Test Steps:**

1. Authenticate with test account
   - Log in with password: "TestPass123!"

2. Verify password not stored in plaintext
   - Access database password field
   - Verify password is hashed (not readable)
   - Verify password follows bcrypt or similar (starts with $2a$, $2b$, or $2y$)

3. Attempt to use database password hash
   - Try to log in with database password hash (not plain password)
   - Verify login fails (hash not accepted as password)

4. Verify password hash validation
   - Log in with correct plain password
   - Verify hash matches stored hash

**Expected Outcomes:**
- ✅ Passwords stored as hashes, not plaintext
- ✅ Hash algorithm secure (bcrypt or better)
- ✅ Password hashes not usable as passwords
- ✅ Password validation via hash comparison

**Success Criteria:**
- Test passes if password security is implemented correctly

---

### 8.3 SC-FLT-003: SQL Injection Prevention

**Objective:** Verify application resistant to SQL injection attacks.

**Preconditions:**
- Any input field in flight booking workflow

**Test Steps:**

1. Test SQL injection in search fields
   - Enter departure city: `' OR '1'='1`
   - Enter arrival city: `'; DROP TABLE bookings; --`
   - Execute search

2. Verify injection attempts fail safely
   - Verify no SQL error exposed
   - Verify search fails gracefully with user-friendly error
   - Verify database not compromised
   - Verify no malicious SQL executed

3. Test in passenger info fields
   - Enter name: `'; UPDATE bookings SET price=0; --`
   - Attempt to submit

4. Verify input sanitization
   - Verify injection attempts treated as regular text
   - Verify no execution of malicious SQL
   - Verify error message doesn't reveal database structure

**Expected Outcomes:**
- ✅ SQL injection attempts rejected
- ✅ No database errors exposed
- ✅ Application handles gracefully
- ✅ Database integrity maintained

**Success Criteria:**
- Test passes if SQL injection attempts fail safely

---

### 8.4 SC-FLT-004: Cross-Site Scripting (XSS) Prevention

**Objective:** Verify application resistant to XSS attacks.

**Preconditions:**
- Any input field displaying user data

**Test Steps:**

1. Test XSS in passenger name field
   - Enter name: `<script>alert('XSS')</script>`
   - Submit booking

2. Verify injection attempt fails
   - Verify script not executed
   - Verify text displayed as-is (escaped)
   - Verify alert popup NOT shown
   - Verify booking completes (or validation error for invalid chars)

3. Test in other fields
   - Email: `<img src=x onerror='alert(1)'>`
   - Special requests: `<iframe src='malicious.com'></iframe>`
   - Verify all escaped/sanitized

4. Check confirmation email
   - Verify confirmation email displays injected content as text (escaped)
   - Verify no scripts executed in email

**Expected Outcomes:**
- ✅ XSS attempts escaped/sanitized
- ✅ Scripts not executed
- ✅ Content displayed safely
- ✅ No alerts or popups triggered

**Success Criteria:**
- Test passes if XSS attempts are prevented

---

### 8.5 SC-FLT-005: HTTPS/SSL Encryption

**Objective:** Verify all communication encrypted with HTTPS.

**Preconditions:**
- Network monitoring tools available (browser dev tools)

**Test Steps:**

1. Navigate to flight search page
   - Verify URL starts with "https://"
   - Verify green lock icon in browser address bar
   - Verify certificate valid (not expired)

2. Monitor network requests
   - Open browser dev tools → Network tab
   - Start flight booking process

3. Verify all requests encrypted
   - Verify all XHR/API requests use HTTPS
   - Verify no HTTP requests (no mixed content)
   - Verify no sensitive data in URLs

4. Verify payment page encrypted
   - Navigate to payment page
   - Verify HTTPS protocol
   - Verify no downgrade to HTTP

5. Check certificate
   - Click lock icon
   - Verify certificate details:
     - Valid issuer
     - Not expired
     - Domain matches

**Expected Outcomes:**
- ✅ All communication via HTTPS
- ✅ SSL certificate valid
- ✅ No mixed HTTP/HTTPS content
- ✅ Browser shows secure connection

**Success Criteria:**
- Test passes if all communication properly encrypted

---

### 8.6 SC-FLT-006: Data Isolation Between Users

**Objective:** Verify users cannot access other users' booking data.

**Preconditions:**
- Multiple test accounts available
- Admin/direct database access available

**Test Steps:**

1. Create booking with User A
   - Log in as User A
   - Complete flight booking
   - Note booking reference

2. Log out and switch to User B
   - Log out from User A
   - Log in as User B

3. Attempt to access User A's booking
   - Try to access User A's booking via URL manipulation
   - Try to access booking via API with User B's token
   - Try to retrieve booking history (should only show User B's bookings)

4. Verify data isolation
   - Verify User B cannot view User A's booking
   - Verify API rejects unauthorized access
   - Verify no data leakage

5. Verify database-level isolation
   - Query database for User A's bookings with User B's account token
   - Verify query fails or returns empty results

**Expected Outcomes:**
- ✅ Users can only access own bookings
- ✅ API enforces authorization
- ✅ No data leakage between users
- ✅ Unauthorized access rejected

**Success Criteria:**
- Test passes if data isolation is properly enforced

---

### 8.7 SC-FLT-007: Payment Data Security (PCI DSS)

**Objective:** Verify payment card data never stored in application database.

**Preconditions:**
- Direct database access available
- Payment processing completed

**Test Steps:**

1. Complete booking with payment
   - Use test card: 4242 4242 4242 4242
   - Complete booking

2. Verify card data not stored
   - Query database for payment table
   - Verify full card number NOT stored
   - Verify CVV NOT stored
   - Verify only tokenized data stored (last 4 digits, card type, expiry)

3. Verify payment token used
   - Verify booking has payment_token (not card_number)
   - Verify token points to payment gateway, not local storage

4. Check logs
   - Verify application logs don't contain card data
   - Verify no card numbers in error messages
   - Verify sensitive data masked in logs

5. Verify payment via gateway
   - Verify payment gateway handles sensitive data
   - Verify application never sees full card data

**Expected Outcomes:**
- ✅ Card data not stored in application database
- ✅ Only tokenized payment data retained
- ✅ No sensitive data in logs
- ✅ Payment gateway handles card data
- ✅ PCI DSS compliance maintained

**Success Criteria:**
- Test passes if payment data security is compliant

---

## 9. TEST EXECUTION STRATEGY

### 9.1 Test Execution Order

**Phase 1: Happy Path (Critical Path)**
- Execute basic smoke tests first
- Verify core workflow functions
- Estimated time: 30-40 minutes

**Phase 2: Negative Tests**
- Test error handling and validation
- Verify graceful failure scenarios
- Estimated time: 20-30 minutes

**Phase 3: Boundary & Validation**
- Test edge cases and limits
- Verify business rule enforcement
- Estimated time: 15-20 minutes

**Phase 4: Integration & Security**
- Test external integrations
- Verify security controls
- Estimated time: 20-30 minutes

**Total Estimated Execution Time: 85-120 minutes**

### 9.2 Parallel Execution

Tests that can run in parallel:
- Different user accounts/sessions
- Independent search/booking scenarios
- Non-conflicting data mutations

Tests that MUST run serially:
- Payment processing (avoid duplicate charges)
- Email verification (timing-dependent)
- Database consistency checks

### 9.3 Test Dependencies

```
HP-FLT-001 (One-Way Booking)
  └─ Prerequisite: HP-FLT-002 (uses successful booking for verification)

NG-FLT-001 (Validation Errors)
  └─ Independent (can run anytime)

IT-FLT-001 (Email Verification)
  └─ Prerequisite: HP-FLT-001 (requires completed booking)

SC-FLT-006 (Data Isolation)
  └─ Prerequisite: Multiple bookings exist with different accounts
```

### 9.4 Test Data Cleanup

After each test:
```typescript
// Clean up created test data
await deleteTestBooking(bookingReference);
await clearTestUserSession();
await resetPaymentHistory(testUser);
```

Before each test run:
```typescript
// Reset test environment
await clearOldTestData();
await verifyTestAccountsExist();
await resetCouponUsage();
await syncLatestTestFlights();
```

---

## 10. SUCCESS CRITERIA

### 10.1 Functional Success Criteria

- ✅ All happy path scenarios pass without errors
- ✅ All negative scenarios fail as expected (graceful errors)
- ✅ All validation scenarios enforce business rules
- ✅ All boundary scenarios handle edge cases
- ✅ All integration scenarios connect to external systems
- ✅ All security scenarios prevent unauthorized access

### 10.2 Test Quality Metrics

```
Pass Rate:          ≥ 95%
Flakiness:          < 2% (false failures due to timing)
Coverage:           ≥ 80% of automation candidates
Execution Time:     < 120 minutes (full suite)
Average Test Time:  < 5 minutes per test
```

### 10.3 Defect Discovery Metrics

```
High-Priority Defects:   ≥ 90% detected
Medium-Priority Defects: ≥ 75% detected
Low-Priority Defects:    ≥ 60% detected
Regression Coverage:     100% of known bugs re-tested
```

### 10.4 Maintenance Metrics

```
Broken Selectors per Quarter:  < 5%
Test Maintenance Time:         < 10% of automation time
Documentation Coverage:        100% of tests documented
ROI (hours saved):            > 100 hours per quarter
```

### 10.5 Test Execution Checklist

- [ ] Test environment verified (QA/Demo up)
- [ ] Test data created (users, flights, coupons)
- [ ] Test accounts accessible
- [ ] Payment gateway sandbox configured
- [ ] Email service configured (MailSlurp/Ethereal)
- [ ] Browser drivers installed (Chromium)
- [ ] Playwright project initialized
- [ ] Page objects created and tested
- [ ] Test utilities verified
- [ ] CI/CD pipeline configured
- [ ] Phase 1 tests executing
- [ ] Phase 2 tests executing
- [ ] Phase 3 tests executing
- [ ] Phase 4 tests executing
- [ ] All results reviewed and approved
- [ ] Defects logged and prioritized
- [ ] Test coverage report generated

---

## APPENDIX: TEST TEMPLATES

### A.1 Basic Test Template

```typescript
import { test, expect } from '@playwright/test';
import { FlightSearchPage } from './pages/FlightSearchPage';
import { BookingConfirmationPage } from './pages/ConfirmationPage';

test('HP-FLT-001: One-Way Flight Booking', async ({ page }) => {
  // Setup
  const searchPage = new FlightSearchPage(page);
  
  // Step 1: Navigate to flight search
  await searchPage.navigate();
  await expect(page).toHaveTitle(/Flight Search/);
  
  // Step 2: Search for flights
  await searchPage.selectTripType('one-way');
  await searchPage.enterDeparture('New York (JFK)');
  await searchPage.enterArrival('London (LHR)');
  await searchPage.selectDate('2026-09-22');
  await searchPage.selectPassengers('1');
  await searchPage.clickSearch();
  
  // Step 3: Verify results
  await page.waitForSelector('[data-testid="flight-results"]', { timeout: 10000 });
  const flightCount = await page.locator('[data-testid="flight-option"]').count();
  expect(flightCount).toBeGreaterThan(0);
  
  // Additional steps...
});
```

### A.2 Error Handling Template

```typescript
test('NG-FLT-001: Search Without Departure City', async ({ page }) => {
  const searchPage = new FlightSearchPage(page);
  
  await searchPage.navigate();
  
  // Leave departure empty, fill others
  await searchPage.enterArrival('London (LHR)');
  await searchPage.selectDate('2026-09-22');
  await searchPage.clickSearch();
  
  // Verify error
  await expect(page.locator('[data-testid="error-departure"]'))
    .toContainText('Departure city is required');
  
  // Verify button disabled
  await expect(searchPage.searchButton()).toBeDisabled();
});
```

### A.3 Integration Test Template

```typescript
test('IT-FLT-001: Booking Confirmation Email', async ({ page }) => {
  // ... complete booking ...
  
  // Retrieve email
  const mailSlurp = new MailSlurpClient();
  const email = await mailSlurp.waitForLatestEmail(
    testEmailAddress, 
    300000 // 5 min timeout
  );
  
  // Verify email content
  expect(email.subject).toContain(bookingReference);
  expect(email.body).toContain(passengerName);
  expect(email.body).toContain(flightDetails);
});
```

---

**Document Version:** 1.0  
**Last Updated:** September 8, 2026  
**Ready for Review & Implementation**

