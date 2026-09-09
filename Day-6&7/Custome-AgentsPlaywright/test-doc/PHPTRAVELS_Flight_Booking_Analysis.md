# PHPTRAVELS Flight Booking - Detailed Requirement Analysis

**Project:** PHPTRAVELS Flight Booking Automation Testing  
**Base URL:** https://phptravels.net/  
**Framework:** Playwright with TypeScript  
**Architecture:** Page Object Model (POM) with Data-Driven Testing  
**Test Runner:** @playwright/test  
**Target Browsers:** Chromium  
**Environment:** QA/Demo  
**Document Version:** 1.0  
**Analysis Date:** September 8, 2026  
**Scope:** Flight Booking Module Only

---

## 1. REQUIREMENT SUMMARY

The Flight Booking module is a critical component of PHPTRAVELS that enables users to search, compare, and book flights. The module handles complex business logic including:

- **Search Capabilities:** Multi-criteria flight search (origin, destination, dates, passengers)
- **Result Filtering:** Sort and filter by price, duration, airlines, departure times
- **Passenger Management:** Support for adults, children, and infants with different fare rules
- **Seat Selection:** Choose preferred seating options
- **Add-ons Management:** Baggage, meals, insurance, and other extras
- **Booking Confirmation:** Generate booking references and send confirmations
- **Cancellation & Modification:** Manage existing bookings

**Key Business Objectives:**
- Enable quick and intuitive flight search
- Provide multiple flight options for comparison
- Support one-way, round-trip, and multi-city bookings
- Ensure accurate pricing with all fees and taxes
- Maintain PCI DSS compliance for payment processing
- Deliver reliable booking confirmations via email

---

## 2. CORE FUNCTIONAL REQUIREMENTS

### 2.1 Flight Search Module

**FR-FLT-SEARCH-001: Search Page Access**
- Users can access flight search from home page
- Search form visible and properly rendered
- All search fields accessible and properly labeled
- Required fields clearly marked with asterisk (*)
- Browser back button doesn't cause issues

**FR-FLT-SEARCH-002: One-Way Flight Search**
- **Mandatory Fields:**
  - Departure city/airport (text input with autocomplete)
  - Arrival city/airport (text input with autocomplete)
  - Departure date (date picker)
  - Number of passengers (dropdown or input)
- **Optional Fields:**
  - Cabin class (Economy, Business, First Class)
  - Airline preference (multi-select)
  - Direct flights only (checkbox)
- **Validation:**
  - Arrival city cannot be same as departure city
  - Departure date must be in future (after today)
  - Minimum 1 passenger required
  - Maximum 9 passengers allowed
- **Auto-complete:**
  - City/airport names auto-complete
  - Display airport code and full name
  - Search triggered on minimum 2 characters
  - Display 5-10 results per dropdown

**FR-FLT-SEARCH-003: Round-Trip Flight Search**
- **Additional Fields:**
  - Return date (date picker)
  - Return date must be after departure date
  - Minimum stay: 1 night
- **Validation:**
  - Both outbound and return dates required
  - Return date > Departure date
  - Cannot return before departure

**FR-FLT-SEARCH-004: Multi-City Flight Search**
- Support 3-4 city combinations
- Add/remove city segments
- Each segment requires departure and arrival city
- Sequential dates enforced (each leg after previous)
- Special pricing logic for multi-city bookings

**FR-FLT-SEARCH-005: Passenger Selection**
- Support multiple passenger types:
  - **Adult:** Age 12 and above
  - **Child:** Age 2-11 years (applicable discounts)
  - **Infant:** Age 0-1 years (no seat required)
- Minimum 1 passenger required
- Maximum 9 passengers per booking
- Infant should have at least 1 accompanying adult
- Display passenger count summary (e.g., "2 Adults, 1 Child, 1 Infant")

**FR-FLT-SEARCH-006: Search Execution**
- Search button triggers flight availability check
- Loading indicator displayed during search
- Search results appear within reasonable time (< 10 seconds)
- Error message displayed if no results found
- Results display list of available flights

### 2.2 Search Results & Filtering

**FR-FLT-RESULTS-001: Flight Results Display**
- Display list of available flights with:
  - Airline name and logo
  - Flight number and aircraft type
  - Departure time and arrival time
  - Flight duration
  - Number of stops (direct, 1 stop, 2+ stops)
  - Price per person and total price
  - Baggage allowance summary
  - Seat availability indicator
  - Select/Book button
- Price displayed clearly (with/without taxes and fees)
- Results paginated if > 20 results (10-20 per page)
- Default sorting: by price (low to high)

**FR-FLT-RESULTS-002: Results Filtering**
- **Filter by Price:**
  - Price range slider (min-max)
  - Predefined ranges (< $200, $200-500, > $500)
  - Real-time filtering as slider moves
- **Filter by Departure Time:**
  - Time windows (Early Morning, Morning, Afternoon, Evening, Night)
  - Multi-select filtering
- **Filter by Duration:**
  - Duration range slider (in hours)
  - Filter shortest to longest flights
- **Filter by Stops:**
  - Direct flights only
  - 1 stop flights
  - 2+ stops flights
  - Multi-select
- **Filter by Airline:**
  - Multi-select airline checkboxes
  - Display airline names and logos
  - Show flight count per airline
- **Filter by Cabin Class:**
  - Economy, Business, First Class
- **Active Filters Display:**
  - Show all active filters
  - One-click remove per filter
  - Clear all filters option

**FR-FLT-RESULTS-003: Results Sorting**
- **Sort Options:**
  - Lowest Price First (ascending)
  - Highest Price First (descending)
  - Shortest Duration First
  - Longest Duration First
  - Earliest Departure
  - Latest Departure
  - Best Value (price-to-duration ratio)
- Sorting applies to filtered results
- Default sort: Lowest Price

**FR-FLT-RESULTS-004: Flight Details**
- Click on flight result to view details:
  - Full flight itinerary (departure, arrival, times)
  - Stops information (location, duration)
  - Aircraft type and seat configuration
  - Baggage allowance details
  - Amenities included (meals, entertainment)
  - Seat selection availability
  - Price breakdown (base fare, taxes, fees)
  - Cancellation policy summary
  - Customer reviews (if available)
- Details displayed in modal or new page

**FR-FLT-RESULTS-005: Price Alerts**
- Option to set price alert for specific route
- User enters email or enables notifications
- Alert sent when price drops below threshold
- User can manage alerts in account settings

### 2.3 Passenger Information

**FR-FLT-PSGR-001: Passenger Data Entry**
- After flight selection, passenger details form displayed
- Separate form section per passenger
- **Fields per Passenger:**
  - Title (Mr., Ms., Mrs., Dr., etc.)
  - First Name (required)
  - Last Name (required)
  - Middle Name (optional)
  - Date of Birth (required, validates against infant/child/adult rules)
  - Gender (optional)
  - Passport Number (optional, may be required based on regulations)
  - Passport Expiry (optional)
  - Nationality/Country (optional)
  - Email (required for primary contact)
  - Phone Number (required for primary contact)
  - Frequent Flyer Number (optional)
  - Special Requirements (meal, assistance, etc.)

**FR-FLT-PSGR-002: Passenger Name Validation**
- Names can contain:
  - Letters (a-z, A-Z)
  - Hyphens, apostrophes, spaces
  - Accented characters (é, ñ, ü, etc.)
- Names cannot contain:
  - Numbers
  - Special symbols (@, !, #, etc.)
- Maximum 50 characters per name field
- Minimum 2 characters
- Validation error message on invalid input
- Exact name matching required for booking confirmation

**FR-FLT-PSGR-003: Date of Birth Validation**
- Format: DD/MM/YYYY or MM/DD/YYYY (configurable)
- Date picker available for easy selection
- Validation rules:
  - Infant (0-1 years): Birth date within last 2 years
  - Child (2-11 years): Birth date between 2-11 years ago
  - Adult (12+ years): Birth date 12+ years ago
- Invalid age categorization prevents booking
- Error message: "Passenger age must be X years for this ticket type"

**FR-FLT-PSGR-004: Passenger Form Validation**
- All required fields must be completed
- Real-time validation (on blur or change)
- Error messages displayed below fields
- Field highlighting for errors (red border)
- Validation message in English or selected language
- Submit button disabled if validation errors exist

**FR-FLT-PSGR-005: Pre-filled Passenger Information**
- For logged-in users:
  - Primary contact info pre-filled (name, email, phone)
  - Option to select from previously saved passengers
  - Save current passenger option for future bookings
- Copy-from-first-passenger option for group bookings
- Manual edit option for all pre-filled fields

**FR-FLT-PSGR-006: Special Requests**
- Meal preferences (vegetarian, vegan, kosher, halal, etc.)
- Mobility assistance requirements
- Unaccompanied minor requirements
- Additional services booking (wheelchair, pet, etc.)
- Text field with max 500 characters
- Free text format with suggestions

### 2.4 Seat Selection

**FR-FLT-SEAT-001: Seat Selection Display**
- Aircraft seat map displayed after passenger info
- Seat map shows:
  - Seat rows (1-30+)
  - Seat columns (A, B, C, D, E, F)
  - Occupied seats (marked as unavailable)
  - Available seats (selectable)
  - Extra legroom/premium seats (marked with price)
  - Emergency exit seats (if restricted)
  - Lavatory and galley locations
- Zoom in/out functionality for large aircraft
- Legend explaining seat types and restrictions

**FR-FLT-SEAT-002: Seat Selection Rules**
- Minimum 1 seat per passenger
- Maximum 1 seat per passenger
- Cannot skip seats (no empty rows between occupied seats for same booking)
- Infant passengers may share seat with adult
- Cannot select seat in last row if infant in booking
- Emergency exit rows restricted based on regulations
- Seat selection optional (auto-assign if not selected)

**FR-FLT-SEAT-003: Premium Seat Pricing**
- Extra legroom seats display additional cost
- Preferred seats may have upcharge
- Seat price displayed when selected
- Total price updated with seat selection
- Option to remove seat selection and revert to auto-assignment

**FR-FLT-SEAT-004: Seat Confirmation**
- Selected seats clearly highlighted
- Seat selection summary before payment
- Option to change seats
- Seat selection locked after payment

**FR-FLT-SEAT-005: Seat Unavailability**
- If selected seat becomes unavailable (sold to another user):
  - User notified immediately
  - Option to select alternative seat
  - Option to proceed without specific seat
  - No charge if auto-assigned different seat

### 2.5 Add-ons & Extras

**FR-FLT-ADDON-001: Baggage Selection**
- Display included baggage allowance
- Offer additional baggage for purchase:
  - Extra checked baggage (20kg, 23kg, 32kg options)
  - Extra personal item allowance
  - Baggage price displayed per person/per leg
  - Option to select for all passengers or per passenger
  - Baggage restrictions and terms displayed

**FR-FLT-ADDON-002: Meal Selection**
- Display included meals on flight
- Offer meal selection:
  - Meal type preference (if multiple available)
  - Dietary restrictions (vegetarian, vegan, kosher, etc.)
  - Meal pricing if chargeable
  - Selection per passenger
  - Meal confirmation in booking summary

**FR-FLT-ADDON-003: Travel Insurance**
- Optional travel insurance offer
- Insurance type and coverage details displayed
- Insurance cost per person or per booking
- Decline or accept checkbox
- Terms & conditions link
- Recommended for bookings over $X amount

**FR-FLT-ADDON-004: Seat Selection as Add-on**
- Premium/extra legroom seats available
- Price displayed per seat
- Apply to all passengers or individual selection
- Cancellation fees for paid seats

**FR-FLT-ADDON-005: Add-ons Summary**
- Itemized display of all selected add-ons
- Price per add-on
- Total add-ons cost
- Option to modify or remove add-ons
- Final price recalculation with add-ons

### 2.6 Price Summary & Booking Review

**FR-FLT-PRICE-001: Price Breakdown**
- Display itemized pricing:
  - Base fare (per person × number of passengers)
  - Taxes and surcharges (itemized)
  - Baggage fees (if applicable)
  - Seat selection fees (if applicable)
  - Travel insurance (if applicable)
  - Meal charges (if applicable)
  - Other add-ons (if applicable)
  - **Total Price (clearly highlighted)**
- Price displayed in selected currency
- Currency converter available (with disclaimer on rates)
- Price guarantee duration displayed (e.g., "Hold for 10 minutes")

**FR-FLT-PRICE-002: Discount & Coupon Application**
- Coupon code input field
- Apply coupon button
- Validation:
  - Coupon must be valid and not expired
  - Coupon must be applicable to flight bookings
  - Coupon must not be already used (if single-use)
  - Display discount amount and new total
- Error messages:
  - "Invalid coupon code"
  - "Coupon has expired"
  - "Coupon not applicable to this booking"
  - "Coupon usage limit exceeded"
- Remove coupon option
- Auto-apply saved coupon from account (with option to decline)

**FR-FLT-PRICE-003: Multi-City Pricing**
- Display price per leg (outbound, return)
- Display total price for all legs combined
- Separate price breakdown per leg
- Total reduced if multi-city discount applies

**FR-FLT-BOOKING-001: Booking Summary Page**
- Display complete booking details:
  - Passenger list with names and ages
  - Outbound flight details (date, time, airline, flight number)
  - Return flight details (if applicable)
  - Seat assignments
  - Selected add-ons
  - Price breakdown
  - Cancellation policy
  - T&Cs confirmation checkbox
- All information editable except T&Cs
- Edit buttons next to each section to modify
- Proceed to payment button

**FR-FLT-BOOKING-002: Edit Booking Details**
- After selecting "Edit", user can modify:
  - Passenger information (names, contact info)
  - Seat selections
  - Add-ons
  - Coupon code
- **Cannot Edit:**
  - Flight selection (restart search if needed)
  - Number of passengers
  - Travel dates
- Modified details reflected in price recalculation
- Return to summary after editing

---

## 3. POSITIVE SCENARIOS

### 3.1 One-Way Flight Booking

**PS-FLT-001: One-Way Flight Search & Booking (Economy, Adult)**
- User navigates to flight search page
- Enters departure city (e.g., "New York - JFK")
- Enters arrival city (e.g., "London - LHR")
- Selects departure date (future date)
- Selects "1 Adult"
- Selects "Economy" class
- Clicks "Search Flights"
- Search results displayed with multiple options
- Sorts results by price (low to high)
- Selects cheapest flight option
- Enters passenger name, DOB, email, phone
- Selects seat (or leaves for auto-assignment)
- Reviews booking summary
- Applies valid coupon code (if available)
- Proceeds to payment
- Enters payment details (credit card)
- Booking confirmed
- Receives booking reference number (e.g., "FLT123456")
- Receives confirmation email with e-ticket
- Booking appears in user's booking history

**PS-FLT-002: One-Way Flight with Premium Seat Selection**
- Completes flight search and passenger info entry
- Seat selection page displays
- Selects extra legroom seat for $50
- Seat highlighted on map
- Seat price added to total
- Booking summary updated with seat fee
- Completes payment
- Confirmation includes seat details

**PS-FLT-003: One-Way Flight with Baggage Add-on**
- Completes flight and passenger selection
- Offered additional checked baggage (+20kg) for $30
- Selects baggage add-on
- Baggage fee added to total
- Booking summary shows baggage details
- Completes payment
- E-ticket includes baggage allowance

**PS-FLT-004: One-Way Flight with Travel Insurance**
- Completes flight and passenger selection
- Travel insurance offered ($15 per person)
- Selects insurance option
- Insurance fee calculated and added
- Booking summary shows insurance
- Completes booking
- Insurance details included in confirmation

### 3.2 Round-Trip Flight Booking

**PS-FLT-005: Round-Trip Flight Booking (2 Adults)**
- User selects round-trip option
- Enters departure city, arrival city
- Enters outbound date (future)
- Enters return date (at least 1 day after outbound)
- Selects "2 Adults"
- Searches flights
- Results show outbound and return options
- Selects outbound flight
- Results page updates to show return flight options
- Selects return flight
- Enters passenger information for both passengers
- Selects seats for both passengers
- Reviews booking summary (shows both flights)
- Completes payment
- Booking confirmed
- Receives confirmation with both flight details
- Booking reference covers both legs

**PS-FLT-006: Round-Trip Flight with Flight Variation**
- Searches round-trip flights
- Day 1: Selects morning outbound flight
- Selects evening return flight (3 days later)
- Passenger information entered
- Seats selected
- Booking completes successfully
- Confirmation shows exact dates and times

### 3.3 Multi-Passenger Booking

**PS-FLT-007: Flight Booking (1 Adult + 1 Child)**
- Searches flights for "1 Adult, 1 Child"
- Results display (child fares may be discounted)
- Selects flight
- Enters adult passenger info (name, DOB, ID)
- Enters child passenger info (name, DOB - must be 2-11 years)
- System applies child discount if applicable
- Price reflects: 1 full fare + 1 discounted fare
- Seats selected (must include adult seat)
- Booking completed
- Confirmation shows both passengers with correct fare types

**PS-FLT-008: Flight Booking (2 Adults + 1 Infant)**
- Searches flights for "2 Adults, 1 Infant"
- System allows infant without seat
- Flight selected
- Passenger info entered:
  - Adult 1: name, DOB (adult age), contact
  - Adult 2: name, DOB (adult age)
  - Infant: name, DOB (less than 2 years), seat: none
- Seat selection: 2 seats (for adults only)
- Infant price calculated (usually 10% of adult fare)
- Booking completed
- Confirmation specifies infant details and seat placement

**PS-FLT-009: Flight Booking (1 Adult + 2 Children)**
- System correctly handles 1 adult + 2 children
- Validation: Adult must be present for supervision
- Seat selection enforces adult and child seat assignment
- Pricing: 1 full + 2 child fares
- Booking succeeds with appropriate pricing

**PS-FLT-010: Flight Booking Maximum Passengers (9 Passengers)**
- Searches for maximum allowed (9 passengers)
- All 9 passengers added:
  - 5 adults, 3 children, 1 infant
  - Or any valid combination up to 9
- Passenger information entered for all
- Seats assigned to all (infant auto-assigned to lap)
- Booking completes successfully
- Confirmation lists all 9 passengers

### 3.4 Special Scenarios

**PS-FLT-011: Booking with Frequent Flyer Number**
- Passenger enters frequent flyer number
- Number is validated against airline system
- Points eligible for booking noted
- Booking completed with FF number linked
- Account receives points after flight completion

**PS-FLT-012: Booking with Meal Preferences**
- During passenger entry, special requests filled:
  - Meal: Vegetarian
  - Assistance: Wheelchair assistance
- Booking completed
- Confirmation shows special requests
- Airline notified of special requirements

**PS-FLT-013: Return to Booking & Completion**
- User starts booking, leaves search results page
- Returns to site within session timeout
- Previous search and results still available
- Continues booking from where they left off
- Completes booking successfully

**PS-FLT-014: Booking with Language Switch**
- User searches in English
- Switches language to Spanish during passenger info
- All fields and messages display in Spanish
- Booking completes successfully
- Confirmation email in user's language preference

**PS-FLT-015: Coupon Application with Multiple Valid Codes**
- Multiple valid coupons available for user
- User enters first coupon code
- Discount applied and shown
- System prevents applying second coupon (if limited to one)
- Or allows stacking (if permitted by business logic)
- Final price calculated correctly

---

## 4. NEGATIVE SCENARIOS

### 4.1 Search Validation & Error Handling

**NS-FLT-001: Search Without Departure City**
- User fills search form but leaves departure city empty
- Error message: "Departure city is required"
- Departure city field highlighted in red
- Submit button remains disabled
- User can enter departure city to correct

**NS-FLT-002: Search Without Arrival City**
- User enters departure city but leaves arrival city empty
- Error message: "Arrival city is required"
- Arrival city field highlighted
- Submit button disabled

**NS-FLT-003: Search with Same Departure & Arrival City**
- User enters same city for departure and arrival (e.g., JFK for both)
- Error message: "Departure and arrival cities cannot be the same"
- Booking cannot proceed
- User must change arrival city

**NS-FLT-004: Search with Past Departure Date**
- User attempts to select departure date in the past
- Date picker prevents selection of past dates
- Past dates shown as disabled/grayed out
- Error message if manually entered: "Departure date must be in the future"

**NS-FLT-005: Search with Return Date Before Departure Date**
- Round-trip booking with return before departure
- Return date picker only allows dates after departure
- Or error message: "Return date must be after departure date"
- Booking cannot proceed

**NS-FLT-006: Search with Return Date Same as Departure Date**
- Return date equals departure date (0 nights)
- System rejects: "Minimum 1 night stay required"
- Return date updated to next day automatically, or error shown

**NS-FLT-007: Search with No Passengers Selected**
- User leaves passenger count as 0 or blank
- Error message: "Select at least 1 passenger"
- Submit disabled
- User must select minimum 1 passenger

**NS-FLT-008: Search with Excessive Passengers (>9)**
- User attempts to book 10 passengers
- System limits selection: "Maximum 9 passengers allowed"
- Passenger count capped at 9
- Cannot add more

**NS-FLT-009: Search with Invalid Date Format**
- User manually enters invalid date (e.g., "32/13/2026")
- System rejects: "Invalid date format"
- Accepted formats shown
- Date picker recommended

**NS-FLT-010: Search with No Results**
- Search executed with valid criteria
- No available flights found
- Message displayed: "No flights found matching your criteria"
- Suggestions provided:
  - Try different dates
  - Try nearby airports
  - Try different airline
- Option to modify search preserved

### 4.2 Passenger Information Errors

**NS-FLT-011: Passenger Name Missing**
- Required name field left empty
- Error: "Passenger first name is required" / "Passenger last name is required"
- Field highlighted
- Cannot proceed to next step

**NS-FLT-012: Passenger Name with Numbers**
- User enters "John123" as name
- Validation fails: "Name cannot contain numbers"
- Error displayed
- User must correct to "John"

**NS-FLT-013: Passenger Name with Special Characters**
- User enters "John@Smith" or "Mary#Lee"
- Validation fails: "Name contains invalid characters"
- Allowed characters: letters, hyphens, apostrophes, spaces
- User must correct

**NS-FLT-014: Passenger DOB - Invalid Age for Ticket Type**
- Infant selected, but DOB shows age 5 years
- Validation fails: "Passenger age is not valid for infant fare"
- Error: "Infant must be under 2 years old"
- User must correct DOB or change ticket type to child

**NS-FLT-015: Passenger DOB - Future Date**
- User enters DOB in future (e.g., 2027)
- System rejects: "Date of birth cannot be in the future"
- User must correct to valid past date

**NS-FLT-016: Passenger DOB - Unrealistic Age**
- User enters DOB suggesting age 150+ years
- System rejects: "Passenger age seems unrealistic"
- User must enter valid DOB (typically 0-100 years)

**NS-FLT-017: Passenger Email - Invalid Format**
- User enters "john.smith@" or "john@.com"
- Validation fails: "Invalid email format"
- Correct format example shown: "john.smith@example.com"
- User must correct

**NS-FLT-018: Passenger Phone - Invalid Format**
- User enters invalid phone format (e.g., "abc123")
- Validation fails: "Invalid phone number"
- Format requirement shown (e.g., "+1-555-123-4567")
- User must correct

**NS-FLT-019: Primary Contact Email Missing**
- Booking has no primary contact email
- Error: "At least one passenger must have email address"
- User must provide email for at least primary passenger

**NS-FLT-020: Infant Without Accompanying Adult**
- Booking has 1 infant, 0 adults
- Validation fails: "Infant passenger must be accompanied by at least 1 adult"
- User must add adult passenger
- Cannot book infant alone

### 4.3 Flight Selection & Availability Errors

**NS-FLT-021: Selected Flight No Longer Available**
- User selects flight, proceeds to passenger info
- Meanwhile, flight sells out
- On booking attempt, error: "Selected flight is no longer available"
- Offer alternative flights
- Booking not created
- No charge applied

**NS-FLT-022: Outbound Flight Unavailable After Selection**
- Round-trip booking, outbound selected
- Return flights displayed
- Outbound flight becomes unavailable
- System notifies: "Outbound flight sold out"
- Option to search again or select alternative outbound

**NS-FLT-023: Return Flight Unavailable After Selection**
- Round-trip booking, return flight becomes unavailable
- System notifies during booking
- Option to select different return flight
- Outbound booking not affected

**NS-FLT-024: Seat Becomes Unavailable During Selection**
- User selects seat in seat map
- Another user books same seat simultaneously
- Seat selection page updates
- Selected seat marked unavailable
- User must select alternative seat
- No automatic charge for seat change

**NS-FLT-025: All Seats Sold Out**
- User attempts seat selection
- All seats marked as sold out
- Error: "No seats available for this flight"
- Must select different flight
- No booking possible

### 4.4 Payment & Checkout Errors

**NS-FLT-026: Payment Declined - Insufficient Funds**
- Booking summary complete
- User enters credit card details
- Payment submitted
- Declined: "Insufficient funds"
- Booking not created
- User can retry with different payment method
- No charge applied

**NS-FLT-027: Payment Declined - Invalid Card Number**
- User enters invalid credit card number
- Declined: "Invalid card number"
- User can re-enter correct card details
- Or use different payment method
- Booking not created

**NS-FLT-028: Payment Declined - Card Expired**
- User enters expired credit card
- Declined: "Card has expired"
- User can enter different card
- Or update card expiration
- Booking not created

**NS-FLT-029: Payment Declined - CVV Mismatch**
- User enters incorrect CVV
- Declined: "Invalid CVV"
- User allowed to re-enter CVV
- Booking not created

**NS-FLT-030: Payment Timeout**
- Payment processing takes too long
- Timeout error displayed
- User advised to wait or retry
- Booking not created
- Payment not processed

**NS-FLT-031: Duplicate Payment Submission**
- User clicks "Pay" button twice rapidly
- System prevents duplicate submission
- Only one payment processed
- Only one booking created
- No multiple charges

**NS-FLT-032: Payment Cancelled by User**
- User cancels payment during process
- Booking creation stopped
- User returned to booking summary
- Session maintained
- Can retry payment

**NS-FLT-033: Browser Back Button During Payment**
- User clicks browser back during payment
- Payment not duplicated if they return
- Session properly managed
- No orphaned bookings

**NS-FLT-034: Payment with Invalid CVV Repeatedly**
- User enters wrong CVV 3+ times
- System temporarily locks payment attempt
- User must wait or retry with different card
- Account security protected

**NS-FLT-035: Invalid Coupon Code**
- User enters non-existent coupon code
- Error: "Invalid coupon code"
- Booking continues without discount
- User can correct coupon or proceed without

**NS-FLT-036: Expired Coupon Code**
- User enters previously valid coupon that expired
- Error: "Coupon has expired"
- User must use valid coupon or proceed without
- Booking continues

**NS-FLT-037: Coupon Not Applicable to Booking**
- User applies hotel coupon to flight booking
- Error: "This coupon is not applicable to flight bookings"
- Coupon code rejected
- User must use flight-applicable coupon

**NS-FLT-038: Coupon Usage Limit Exceeded**
- Single-use coupon already used
- Error: "This coupon has been used"
- Coupon not applied
- User cannot use again

---

## 5. BOUNDARY SCENARIOS

### 5.1 Date & Time Boundaries

**BS-FLT-001: Today's Flight Booking**
- User searches for departure today
- System checks if flights still available for today
- If bookable, allows selection
- If not (past cutoff), displays: "No flights available today, earliest available is tomorrow"

**BS-FLT-002: Flight with Midnight Crossing**
- Flight departs 11:45 PM, arrives 2:15 AM (next day)
- System correctly displays arrival as next calendar day
- Duration calculated correctly across midnight

**BS-FLT-003: Flight Across Time Zones**
- Flight from New York (EST) to London (GMT)
- Time zone conversion displayed correctly
- Duration calculation accounts for time zone
- Arrival time shown in destination time zone
- Or both time zones shown with clarification

**BS-FLT-004: Same Day Round-Trip Flights**
- User searches round-trip with same departure and return date
- System allows if sufficient time between flights
- Or displays: "Return date must be at least 1 day after departure"
- Depends on business logic

**BS-FLT-005: Booking 330+ Days in Advance**
- Typical max advance booking is 330 days
- User searches 350 days in future
- System displays: "Advance booking not available beyond 330 days"
- Or displays limited options if available

**BS-FLT-006: Booking at Airfare Sale Time**
- Last-minute sale at 11:55 PM, expired at 12:00 AM
- User booking at 11:59 PM completes successfully
- User booking at 12:01 AM gets error: "Sale has ended"

### 5.2 Passenger Age Boundaries

**BS-FLT-007: Infant Age Exactly 2 Years (Cutoff)**
- Passenger age exactly 2 years old
- System must decide: Infant or Child?
- Typically: 0-1 years = Infant, 2+ years = Child
- On exact boundary (2 years), treated as Child
- Child fare applied

**BS-FLT-008: Child Age Exactly 12 Years (Cutoff)**
- Passenger exactly 12 years old
- Typically: 2-11 years = Child, 12+ years = Adult
- On boundary, treated as Adult
- Adult fare applied

**BS-FLT-009: Adult Age Exactly 60 Years (Senior Discount)**
- If senior discounts apply at 60+ years
- Age exactly 60 triggers senior discount
- Correct pricing applied

**BS-FLT-010: Passenger Age at Booking vs. Flight Date**
- Passenger will turn 12 between booking and flight
- System calculates age at flight date
- Correct fare for flight date applied (adult instead of child)

### 5.3 Quantity Boundaries

**BS-FLT-011: Maximum Passengers - Exactly 9**
- System allows exactly 9 passengers
- Attempting 10th passenger blocked
- Error: "Maximum 9 passengers allowed"

**BS-FLT-012: Minimum Passengers - Exactly 1**
- System allows exactly 1 passenger
- Cannot book with 0 passengers
- Error: "At least 1 passenger required"

**BS-FLT-013: Single Seat Aircraft (Hypothetical)**
- Very small aircraft with only 5 seats
- System prevents booking 6+ passengers
- Error: "Aircraft capacity is 5 seats; you have 6 passengers"

**BS-FLT-014: Single Adult Multiple Infants (Invalid)**
- Attempt to book 1 adult, 3 infants
- Validation: Only 1 infant per adult
- Error: "Maximum 1 infant per accompanying adult"
- Or: "Only 1 infant allowed for 1 adult"

### 5.4 Price Boundaries

**BS-FLT-015: Zero Price Flight (Promotional)**
- Free flight offered as promotion
- Price displayed: $0.00 or Free
- Taxes still apply (if applicable)
- Total price calculated correctly

**BS-FLT-016: Very High Price (Luxury)**
- First-class flight priced $50,000+
- System handles large amounts without error
- Payment processing supports high value
- Display formatted correctly (e.g., "$50,000.00")

**BS-FLT-017: Fractional Cent Pricing**
- Price calculated to 3+ decimal places
- System rounds to nearest cent (2 decimals)
- Rounding follows standard rules (round half up)
- No currency precision errors

**BS-FLT-018: Price Change During Booking**
- Flight price increases $100 between search and payment
- User notified: "Price has changed from $300 to $400"
- User must accept new price or cancel
- Option to search for original price still available

**BS-FLT-019: Coupon Creates Negative Total (Invalid)**
- Booking total: $100
- Coupon discount: $150 (100% + overage)
- System prevents negative: Total = $0.00 minimum
- Or applies coupon only to booking amount: Discount = $100

**BS-FLT-020: Tax Rounding with Multiple Passengers**
- 5 passengers, tax rounds to $1.235 per person
- Total tax = $6.175 (rounding error risk)
- System rounds to nearest cent: $6.18
- No tax discrepancy

### 5.5 Text Input Boundaries

**BS-FLT-021: Very Long Name (100 Characters)**
- User enters 100+ character name
- System truncates to 50 characters
- Or error: "Name must not exceed 50 characters"

**BS-FLT-022: Name with International Characters**
- Name: "José María García-López"
- System accepts accented characters
- Display and storage handle Unicode correctly
- Booking confirmation shows correct spelling

**BS-FLT-023: Email with + Sign**
- Email: "user+booking@example.com"
- System accepts email with + (valid format)
- Verification email sent correctly
- Booking linked to correct address

**BS-FLT-024: Email with Subdomain**
- Email: "user@mail.company.co.uk"
- System accepts multi-level domains
- Email validation passes
- Verification works correctly

**BS-FLT-025: Phone Number with Extensions**
- Phone: "+1-555-123-4567 ext.123"
- System stores extension properly
- Or: Phone field for main, separate field for ext.
- Airline contact uses correct number

### 5.6 Seat Selection Boundaries

**BS-FLT-026: Seat 1A (First Seat) Selection**
- User selects seat 1A
- System applies correctly
- Price updated if premium
- Confirmation shows 1A

**BS-FLT-027: Last Row Seat Selection**
- Aircraft has 50 rows, user selects 50F (last seat)
- Selection allowed (no infant if applicable)
- Confirmation shows 50F
- No issues with emergency exits

**BS-FLT-028: All Premium Seats Sold**
- Only standard seats available
- Premium seats (extra legroom) sold out
- User cannot select premium
- Standard seats available for selection

**BS-FLT-029: Auto-Assignment with Full Flight**
- Flight is full (all seats occupied)
- User cannot select specific seat
- Cannot book on this flight
- Error: "No seats available"

**BS-FLT-030: Infant Lap Assignment**
- Infant passenger, no seat available
- Infant assigned to lap of adult
- Seat map shows adult seat only
- Pricing correct (infant lap rate)

---

## 6. VALIDATION SCENARIOS

### 6.1 Form & Data Validation

**VS-FLT-001: Email Format Validation**
- Valid: user@domain.com ✅
- Valid: user+tag@example.co.uk ✅
- Invalid: @domain.com ❌
- Invalid: user@.com ❌
- Invalid: user domain@com ❌
- System rejects invalid formats with clear message

**VS-FLT-002: Phone Number Validation**
- Valid: +1-555-123-4567 ✅
- Valid: +44-20-7123-4567 ✅
- Invalid: 123 (too short) ❌
- Invalid: abc-def-ghij ❌
- System validates format and length
- Allows international prefixes

**VS-FLT-003: Passport Number Validation**
- Format varies by country
- System accepts common formats
- Alphanumeric characters allowed
- Length: 6-9 characters typical
- Validation performed but not strict (varies by country)

**VS-FLT-004: Date Format Validation**
- Accepted: DD/MM/YYYY, MM/DD/YYYY (configurable)
- Rejected: DD-MM-YYYY (if not configured)
- Rejected: 2026-09-08 (if not configured)
- Date picker preferred for consistency
- Manual entry validated strictly

**VS-FLT-005: Currency Format Validation**
- Valid: $1,234.56 ✅
- Valid: USD 1234.56 ✅
- Invalid: $1234.56 (missing separator) - may be accepted
- Prices always display with 2 decimals

**VS-FLT-006: Required Field Validation**
- All required fields marked with asterisk (*)
- Cannot submit form with empty required field
- Error message below each missing field
- Field highlighted in red
- Submit button disabled until all required fields filled

### 6.2 Business Rule Validation

**VS-FLT-007: Passenger Age Categorization**
- Age 0-1: Infant category ✅
- Age 2-11: Child category ✅
- Age 12+: Adult category ✅
- System enforces rules in pricing
- Incorrect categorization prevents booking

**VS-FLT-008: Infant Supervision Requirement**
- At least 1 adult required per booking with infant ✅
- Maximum 1 infant per adult (may vary) ✅
- Validation prevents invalid combinations
- Error message if violated

**VS-FLT-009: Round-Trip Date Validation**
- Return date > Departure date ✅
- Minimum 1 night between dates ✅
- System enforces both rules
- Error message: "Return date must be at least 1 day after departure"

**VS-FLT-010: Multi-City Sequential Dates**
- Leg 1: JFK to LHR, Sept 10
- Leg 2: LHR to CDG, Sept 12
- Leg 3: CDG to FCO, Sept 14
- Each leg date must be after previous leg ✅
- System enforces sequence
- Prevents time-travel bookings

**VS-FLT-011: Flight Duration Validation**
- Flight duration calculated correctly
- Accounts for time zones
- Realistic duration (not negative or excessive)
- System validates before displaying

**VS-FLT-012: Seat Capacity Validation**
- Passengers cannot exceed aircraft capacity
- System checks: Passengers ≤ Available seats
- Error if oversold: "Aircraft capacity exceeded"
- Prevents invalid bookings

---

## 7. INTEGRATION SCENARIOS

### 7.1 Payment Gateway Integration

**IS-FLT-001: Successful Credit Card Payment**
- User submits booking with credit card
- Payment sent to gateway
- Gateway authorizes payment
- Funds captured
- Booking created in system
- Confirmation sent to user
- Status: Success ✅

**IS-FLT-002: Failed Credit Card Payment - Retryable**
- Payment fails (network issue, temporary error)
- User prompted to retry
- Can resubmit with same or different card
- No duplicate charge if retried
- Only one booking created on success

**IS-FLT-003: Payment Gateway Timeout**
- Payment processing exceeds 30 seconds
- User receives timeout message
- Booking status: Pending/Unknown
- User can retry
- System checks if payment was actually processed
- Prevents duplicate bookings

**IS-FLT-004: 3D Secure Payment**
- Card requires 3D Secure authentication
- User redirected to bank verification page
- User completes verification
- Payment processed successfully
- Booking completed
- Or: Verification fails, payment cancelled

### 7.2 Email System Integration

**IS-FLT-005: Booking Confirmation Email**
- Booking confirmed
- Email triggered automatically
- Email contains:
  - Booking reference
  - Passenger names
  - Flight details (dates, times, airlines)
  - Itinerary
  - Booking total
  - Contact information
  - Cancellation policy
  - Terms & Conditions
- Email sent to primary contact
- Delivery confirmed within 5 minutes

**IS-FLT-006: E-Ticket Email**
- Booking confirmed
- E-ticket (PDF) generated
- E-ticket sent via email
- User can print or save
- Barcode/QR code on e-ticket for check-in

**IS-FLT-007: Booking Confirmation SMS**
- If SMS enabled
- SMS sent with booking reference
- Link to retrieve booking
- Delivery confirmation

**IS-FLT-008: Email Verification During Registration**
- User provides email during booking
- Verification email sent
- User clicks verification link
- Email confirmed
- Account activated (if required)

### 7.3 Airline Content Integration

**IS-FLT-009: Flight Schedule Data**
- Flight data pulled from airline feeds
- Real flights and schedules displayed
- Availability updated in real-time
- Pricing reflects current rates
- Aircraft type correct per flight

**IS-FLT-010: Baggage Allowance Data**
- Baggage rules pulled from airline source
- Display: "Baggage included: 1 x 23kg"
- Or: "Baggage not included"
- Up-sell baggage based on rules
- Rules accurate and current

**IS-FLT-011: Seat Map Data**
- Seat configuration from airline
- Seat layout matches actual aircraft
- Seat availability reflects real inventory
- Premium seat pricing correct
- Restrictions (emergency, lavatory) accurate

### 7.4 Currency & Exchange Rate Integration

**IS-FLT-012: Real-Time Exchange Rates**
- Currency conversion uses live rates
- Rates updated daily or real-time
- User selects currency (e.g., USD, EUR, GBP)
- Prices display in selected currency
- Conversion formula transparent
- Disclaimer on rate freshness displayed

**IS-FLT-013: Multi-Currency Pricing**
- Flights priced in different currencies based on region
- Europe → EUR pricing
- US → USD pricing
- Automatic currency detection based on location
- Or: User manual selection

---

## 8. SECURITY-RELATED SCENARIOS

### 8.1 Authentication & Authorization

**SEC-FLT-001: Secure Session Management**
- User logs in
- Session token created and stored securely
- Session tokens in secure HTTP-only cookies
- Session expires after inactivity (e.g., 30 minutes)
- User cannot access bookings without valid session

**SEC-FLT-002: Account Lockout After Failed Logins**
- User enters wrong password 5 times
- Account temporarily locked
- Error: "Account locked. Try again after 30 minutes"
- Admin can unlock manually
- IP-based lockout option

**SEC-FLT-003: Password Security**
- Password minimum 8 characters
- Password requires: uppercase, lowercase, number, special char
- Password not stored in plaintext
- Password hashed with salt (bcrypt or similar)
- Previous passwords cannot be reused

**SEC-FLT-004: User Data Isolation**
- User A cannot view User B's bookings
- User A cannot modify User B's bookings
- User A cannot access User B's personal data
- API enforces user ID validation on all requests
- No data leakage between users

### 8.2 Payment Data Security

**SEC-FLT-005: PCI DSS Compliance**
- Credit card data never stored in application database
- Payment handled by PCI-compliant payment gateway
- Only tokenized payment method stored (last 4 digits, type)
- Card data never logged
- Payment data transmitted via SSL/TLS only

**SEC-FLT-006: SSL/TLS Encryption**
- All communication encrypted with HTTPS
- Certificate valid and trusted
- Certificate not expired
- Green lock icon shown in browser
- No mixed content (HTTP + HTTPS)

**SEC-FLT-007: Sensitive Data in Logs**
- Logs do not contain passwords
- Logs do not contain credit card numbers
- Logs do not contain personal identification numbers
- Only masked data in logs (e.g., last 4 CC digits)
- Log files secured and access-controlled

**SEC-FLT-008: Booking Reference Confidentiality**
- Booking reference not easily guessable (not sequential)
- Booking reference uses random alphanumeric
- User must provide email to retrieve booking (additional validation)
- Booking not retrievable by reference alone

### 8.3 Input & Output Security

**SEC-FLT-009: SQL Injection Prevention**
- SQL injection attempts fail safely
- Input sanitization prevents malicious SQL
- Parameterized queries used
- No error messages reveal database structure
- Examples:
  - Input: `' OR '1'='1` → Rejected safely
  - Input: `; DROP TABLE bookings;` → Rejected safely

**SEC-FLT-010: Cross-Site Scripting (XSS) Prevention**
- JavaScript injection attempts blocked
- User input escaped on output
- HTML entities encoded
- No eval() or dangerous functions
- Content Security Policy headers set
- Examples:
  - Input: `<script>alert('XSS')</script>` → Displayed as text, not executed
  - Input: `<img src=x onerror='alert(1)'>` → Escaped, not executed

**SEC-FLT-011: Cross-Site Request Forgery (CSRF) Prevention**
- CSRF tokens on all state-changing forms
- Token validated on submission
- Token unique per session
- Token expires after session ends
- Token validation fails on expired/missing token

**SEC-FLT-012: Rate Limiting & Brute Force Protection**
- Rapid booking attempts limited per user/IP
- Excessive password attempts trigger lockout
- Search requests rate-limited (prevent DoS)
- Payment attempts rate-limited
- Error messages don't reveal limitations (silent blocking)

### 8.4 Compliance & Privacy

**SEC-FLT-013: GDPR Compliance**
- User data collection transparent
- Privacy policy clearly accessible
- Consent obtained for marketing emails
- User can request data deletion (right to be forgotten)
- User can request data export
- Personal data not shared with third parties without consent

**SEC-FLT-014: Data Retention Policy**
- Booking data retained for required period (e.g., 7 years for tax)
- Older bookings can be archived
- User data deleted upon request (if no legal hold)
- Backup data secured and encrypted

---

## 9. MISSING REQUIREMENTS & CLARIFICATIONS

**MR-FLT-01: Same-Day Booking Cutoff**
- What is the cutoff time for same-day flight bookings?
- Depends on airline: 6 hours, 4 hours, 2 hours before departure?
- Who determines cutoff: airline or platform?

**MR-FLT-02: Booking Modification Timeline**
- Can passenger names be changed after booking? (Typically NO)
- Can dates be changed? (Typically YES, with fees)
- Can time window be changed? (e.g., morning to evening same date)
- Time limit for modifications?

**MR-FLT-03: Baggage Policies Variations**
- Display baggage by airline or by fare class?
- Extra baggage pricing varies by route, weight?
- Are baggage rules shown clearly before booking?

**MR-FLT-04: Seat Selection Mandatory?**
- Is seat selection optional or required?
- Auto-assign if not selected?
- Paid seats vs. free seats?

**MR-FLT-05: Multi-City Booking Restrictions**
- Maximum cities in itinerary (3, 4, 5)?
- Can user book open-jaw flights (e.g., JFK-CDG-JFK)?
- Pricing logic for multi-city?

**MR-FLT-06: Group Booking Features**
- Minimum group size for group discounts?
- Group discount percentage?
- Group booking management features (lead, participants)?

**MR-FLT-07: Loyalty Program Integration**
- Are frequent flyer miles automatically added?
- Can user select to add miles or not?
- How many miles per booking?

**MR-FLT-08: Booking Hold Duration**
- How long is price held? (5 min, 10 min, 15 min?)
- Does hold apply per flight or whole booking?
- What happens when hold expires?

**MR-FLT-09: Special Service Requests**
- What special services are chargeable (meals, seats, assistance)?
- What are free (mobility assistance, unaccompanied minor)?
- Airline notification method for special requests?

**MR-FLT-10: Refund & Cancellation Processing**
- Refund timeline? (Immediate, 5-7 days, 30 days?)
- Refund method? (Same card, bank transfer, account credit?)
- Cancellation fee structure?

---

## 10. TESTING RISKS

### 10.1 Data & Environment Risks

**RISK-FLT-01: Flight Inventory Fluctuation**
- **Risk:** Flights booked during test, becoming unavailable
- **Impact:** Tests fail due to "flight sold out" not false negative
- **Mitigation:** 
  - Use low-demand flights (e.g., very early morning)
  - Reserve test flights with airline
  - Create test inventory if possible
  - Use sandbox environment with static data

**RISK-FLT-02: Price Changes**
- **Risk:** Flight prices change frequently, test expectations don't match
- **Impact:** Price validation tests fail
- **Mitigation:**
  - Mock prices for price validation tests
  - Use flight with stable pricing
  - Test price updates, not absolute values
  - Verify formula, not exact number

**RISK-FLT-03: Seat Availability**
- **Risk:** Seats sell out during test, seat selection tests fail
- **Impact:** Cannot verify seat selection flow
- **Mitigation:**
  - Use flights with ample seating
  - Mock seat map for consistent testing
  - Re-search if seats unavailable
  - Test seat selection logic, not specific seats

**RISK-FLT-04: Payment Gateway Unavailability**
- **Risk:** Payment gateway down or not responding
- **Impact:** Payment tests fail
- **Mitigation:**
  - Use sandbox payment environment
  - Test with mock payment responses
  - Monitor payment gateway status
  - Implement retry logic in tests

**RISK-FLT-05: Email Delivery Delays**
- **Risk:** Confirmation emails not received within timeframe
- **Impact:** Email verification tests timeout
- **Mitigation:**
  - Use test email provider (MailSlurp, Ethereal)
  - Mock email service for deterministic testing
  - Check email via API instead of SMTP
  - Reasonable timeout (5-10 minutes)

### 10.2 Technical Risks

**RISK-FLT-06: Asynchronous Processing**
- **Risk:** Booking confirmation async, tests check too early
- **Impact:** "Booking not found" false negatives
- **Mitigation:**
  - Use polling with timeout (check every 2 sec for 30 sec)
  - Wait for expected element/text
  - Verify via API if available
  - Allow 1-2 second delay for processing

**RISK-FLT-07: Date Picker Internationalization**
- **Risk:** Date format changes by locale
- **Impact:** Tests fail when language switched
- **Mitigation:**
  - Use date picker UI instead of text input
  - Test both date formats if supported
  - Verify date validation in multiple locales

**RISK-FLT-08: Currency Conversion Precision**
- **Risk:** Rounding errors, test expects $1,234.56 but gets $1,234.57
- **Impact:** Price validation tests fail
- **Mitigation:**
  - Verify rounding formula (round half up, truncate, etc.)
  - Allow small delta in assertions (±0.01)
  - Test with amounts that have rounding issues
  - Mock exchange rates for consistency

**RISK-FLT-09: Timing Issues - Flight Across Midnight**
- **Risk:** Flight departure at 11:30 PM, arrival 1:00 AM, arrival date logic
- **Impact:** Duration/date calculation wrong
- **Mitigation:**
  - Test with flights crossing midnight
  - Verify arrival date matches actual date
  - Test time zone conversion accuracy

**RISK-FLT-10: Browser Back Button Behavior**
- **Risk:** Back button creates duplicate bookings
- **Impact:** Data integrity issue, tests don't catch it
- **Mitigation:**
  - Test back button at payment step
  - Verify only 1 booking created
  - Check payment not duplicated
  - Mock browser navigation

### 10.3 Business Logic Risks

**RISK-FLT-11: Infant Fare Rules**
- **Risk:** Infant pricing logic incorrect (should be 10% but is 100%)
- **Impact:** Wrong pricing, app bug not caught by tests
- **Mitigation:**
  - Know infant pricing rule
  - Verify pricing with known examples
  - Compare with manual calculation
  - Test with multiple infants

**RISK-FLT-12: Multi-Passenger Pricing Precision**
- **Risk:** 3 adults, 2 children, 1 infant = complex pricing
- **Impact:** Rounding errors, total doesn't match sum
- **Mitigation:**
  - Calculate expected total manually
  - Allow small delta for rounding
  - Test with various combinations
  - Verify per-passenger prices sum correctly

**RISK-FLT-13: Coupon Stacking Ambiguity**
- **Risk:** Can coupons be stacked? Unclear if 2 coupons apply
- **Impact:** Test creates false failures
- **Mitigation:**
  - Document coupon stacking rules
  - Test single coupon (safe baseline)
  - If stacking allowed, test limits
  - Error messages guide users

**RISK-FLT-14: Booking Hold Expiration**
- **Risk:** Price hold expires during test (e.g., 5 min, test takes 10 min)
- **Impact:** Test fails when proceeding to payment
- **Mitigation:**
  - Complete test within hold duration
  - Know hold duration upfront
  - Mock hold expiration for edge-case testing
  - Retry booking if hold expired

### 10.4 Test Data & Isolation Risks

**RISK-FLT-15: Test Data Accumulation**
- **Risk:** Bookings created during tests accumulate in database
- **Impact:** Database bloats, performance degrades, data cleanup needed
- **Mitigation:**
  - Clean up test bookings after each test
  - Use unique test user accounts
  - Archive old test data
  - Isolate test data environment

**RISK-FLT-16: Cross-Test Interference**
- **Risk:** Test A creates booking, Test B uses same test account
- **Impact:** Booking history shows unwanted bookings, confusion
- **Mitigation:**
  - Use unique test account per test
  - Clear bookings between tests
  - Isolate test data
  - Parallel execution of independent tests

**RISK-FLT-17: Passenger Age Edge Case**
- **Risk:** Passenger age exactly 2 years (boundary between infant/child)
- **Impact:** Incorrect fare applied
- **Mitigation:**
  - Test boundary ages (1.99, 2.0, 2.01 years)
  - Know exact age cutoff rule
  - Verify pricing for boundary cases

### 10.5 UI & Selector Risks

**RISK-FLT-18: Dynamic Seat Numbers**
- **Risk:** Seat A1, A2, B1, B2... dynamically generated
- **Impact:** Selectors break if seat numbering changes
- **Mitigation:**
  - Use getByRole for seat buttons
  - Avoid hardcoded seat XPath
  - Abstract seat selection in POM
  - Test with different aircraft types

**RISK-FLT-19: Autocomplete Dropdown Timing**
- **Risk:** City autocomplete dropdown slow to appear
- **Impact:** Selection fails, no city selected
- **Mitigation:**
  - Wait for autocomplete dropdown visible
  - Type slowly to trigger autocomplete
  - Use waitForSelector or getByRole
  - Mock autocomplete for speed

**RISK-FLT-20: Date Picker Calendar View**
- **Risk:** Calendar hidden until clicked, selector breaks
- **Impact:** Cannot select date
- **Mitigation:**
  - Wait for calendar visible before selection
  - Click date input first
  - Use aria-label for date picker accessibility
  - Test with different calendar formats

---

## 11. AUTOMATION CANDIDATES

### 11.1 High Priority - Critical Path

**AC-FLT-001: One-Way Flight Search (Airport Input)**
- ✅ **AUTOMATE** - High ROI, repeatable, stable
- Search for one-way flights
- Verify results display
- Verify result count > 0
- Verify prices reasonable

**AC-FLT-002: One-Way Flight Booking (Happy Path)**
- ✅ **AUTOMATE** - Critical user journey
- Search, select, passenger info, payment, confirmation
- Verify booking reference generated
- Verify email notification sent
- Verify booking in history

**AC-FLT-003: Round-Trip Flight Booking**
- ✅ **AUTOMATE** - Common scenario
- Search outbound and return flights
- Select both flights
- Complete booking
- Verify confirmation

**AC-FLT-004: Flight Search Validation Errors**
- ✅ **AUTOMATE** - High test coverage
- Test missing fields (departure, arrival, date)
- Verify error messages displayed
- Verify submit disabled

**AC-FLT-005: Payment Processing**
- ✅ **AUTOMATE** - Critical transaction
- Submit valid payment
- Verify booking created
- Verify no duplicate payment
- Use sandbox payment provider

### 11.2 Medium Priority - Core Features

**AC-FLT-006: Multi-Passenger Booking (Adult + Child)**
- ⚠️ **AUTOMATE** - Moderate complexity
- Book for adult and child
- Verify pricing (child discount applies)
- Verify both passengers in confirmation

**AC-FLT-007: Passenger Information Validation**
- ⚠️ **AUTOMATE** - Many edge cases
- Test invalid names (numbers, special chars)
- Test invalid email
- Test invalid phone
- Verify error messages

**AC-FLT-008: Seat Selection**
- ⚠️ **AUTOMATE** - Medium complexity
- Select specific seat
- Verify seat marked occupied after booking
- Verify premium seat pricing
- Verify seat in confirmation

**AC-FLT-009: Baggage Add-on Selection**
- ⚠️ **AUTOMATE** - Straightforward
- Add baggage during booking
- Verify baggage fee calculated
- Verify baggage in confirmation

**AC-FLT-010: Coupon Code Application**
- ⚠️ **AUTOMATE** - Requires test coupon codes
- Apply valid coupon
- Verify discount shown
- Verify final price reduced
- Use permanent test coupon

### 11.3 Lower Priority - Extended Features

**AC-FLT-011: Booking Modification (Date Change)**
- ⚠️ **CONSIDER** - Time-dependent
- Modify booking date (if allowed)
- Verify new date available
- Verify modification fee applied
- Verify new itinerary

**AC-FLT-012: Booking Cancellation & Refund**
- ⚠️ **CONSIDER** - Financial transactions
- Cancel existing booking
- Verify refund calculated
- Verify refund status
- Verify confirmation email

**AC-FLT-013: Multi-City Flight Booking**
- ⚠️ **CONSIDER** - Complex scenario
- Book 3-city itinerary
- Verify pricing for all legs
- Verify all flights in confirmation

**AC-FLT-014: Flight Search Filtering (Price, Duration, Airline)**
- ⚠️ **AUTOMATE** - Stable functionality
- Apply filters
- Verify results filtered correctly
- Verify filter combinations work

**AC-FLT-015: Language Switching During Booking**
- ⚠️ **AUTOMATE** - Localization testing
- Switch language mid-booking
- Verify all text in new language
- Verify booking completes successfully

---

## 12. TEST DATA REQUIREMENTS

### 12.1 Test User Accounts

```
Test Account 1 (Premium User):
  Email: flighttest.premium@example.com
  Password: TestPass123!
  Frequent Flyer: AA1234567890
  Saved Payment: Visa ending in 4242

Test Account 2 (Regular User):
  Email: flighttest.regular@example.com
  Password: TestPass123!
  Saved Payment: None

Test Account 3 (New User):
  Email: flighttest.new@example.com
  Password: TestPass123!
  Status: Fresh account, no bookings
```

### 12.2 Test Flight Data

```
Test Flight 1 (Stable, Always Available):
  Route: JFK → LHR
  Departure: 10:00 AM
  Arrival: 10:00 PM (same day)
  Duration: 8 hours
  Airline: British Airways
  Aircraft: Boeing 777
  Seats Available: 50+ (always)
  Price: Stable (~$400-500)
  Purpose: Booking tests, happy path

Test Flight 2 (Budget Option):
  Route: JFK → LHR
  Departure: 2:00 AM
  Arrival: 2:00 PM (same day)
  Duration: 8 hours
  Airline: Budget Carrier
  Aircraft: Boeing 737
  Seats Available: 20+ (usually)
  Price: Budget ($200-300)
  Purpose: Price filter tests, budget booking

Test Flight 3 (Premium):
  Route: JFK → LHR
  Departure: 6:00 PM
  Arrival: 6:00 AM (next day)
  Duration: 8 hours
  Airline: Premium Carrier
  Aircraft: Airbus A380
  Seats Available: Various premium seats
  Price: Premium ($800-1200)
  Purpose: Premium seat selection, business class tests
```

### 12.3 Test Payment Data

```
Valid Test Card (Succeeds):
  Card Number: 4242 4242 4242 4242
  Expiry: 12/26
  CVV: 123

Valid Test Card (3D Secure):
  Card Number: 4000 0027 6000 3184
  Expiry: 12/26
  CVV: 123

Invalid Card (Fails):
  Card Number: 4000 0000 0000 0002
  Expiry: 12/26
  CVV: 123
```

### 12.4 Test Passenger Data

```
Adult Passenger:
  Title: Mr.
  First Name: John
  Last Name: Smith
  DOB: 01/01/1990
  Email: john.smith@example.com
  Phone: +1-555-123-4567

Child Passenger:
  Title: Miss
  First Name: Emma
  Last Name: Smith
  DOB: 15/06/2015
  Special: No separate email (use adult's)

Infant Passenger:
  Title: Master
  First Name: Oliver
  Last Name: Smith
  DOB: 20/12/2024
  Special: No seat, infant lap only
```

### 12.5 Test Coupon Codes

```
Valid Coupon:
  Code: TEST50
  Discount: $50 off
  Type: All flight bookings
  Expiry: 31/12/2026 (permanent for testing)
  Usage: Unlimited

Valid Coupon (Percentage):
  Code: TEST10PCT
  Discount: 10% off
  Type: All bookings
  Expiry: Permanent
  Usage: Unlimited

Expired Coupon (for negative testing):
  Code: EXPIRED
  Discount: $100 off
  Expiry: 31/12/2024 (already expired)
  Usage: Test error handling
```

---

## 13. SUCCESS CRITERIA

### 13.1 Functional Coverage

- ✅ 100% of flight search scenarios covered
- ✅ 100% of booking workflows covered
- ✅ 100% of validation scenarios covered
- ✅ 95%+ of negative scenarios covered
- ✅ 90%+ of boundary scenarios covered

### 13.2 Automation Metrics

- **Automation Coverage:** 80%+ of automation candidates
- **Critical Path:** 100% automated (Phase 1)
- **Core Features:** 90% automated (Phase 2)
- **Test Execution Time:** <60 minutes for full flight test suite
- **Average Test Duration:** <5 minutes per test

### 13.3 Quality Metrics

- **Pass Rate:** ≥95% consistently
- **Flakiness:** <2% of test runs fail unexpectedly
- **Defect Detection Rate:** ≥90% of defects caught by automation
- **Regression Detection:** 100% of known defects caught by regression tests

### 13.4 Maintenance & Stability

- **Locator Stability:** <5% of tests fail due to broken selectors per quarter
- **Test Maintenance Burden:** <10% of automation time spent fixing broken tests
- **Documentation:** 100% of tests documented with purpose and preconditions
- **ROI:** Automation saves >100 hours of manual testing per quarter

---

## 14. APPENDICES

### 14.1 Glossary

- **POM:** Page Object Model - design pattern for test code organization
- **ROI:** Return on Investment - value generated vs. cost
- **3D Secure:** Authentication method for credit card payments
- **IATA:** International Air Transport Association (sets airline standards)
- **GDS:** Global Distribution System (airline booking system)
- **BSP:** Billing and Settlement Plan (airline ticket sales agent system)

### 14.2 References

- [PHPTRAVELS Flight Booking](https://phptravels.net/)
- [Playwright Documentation](https://playwright.dev)
- [IATA Baggage Standards](https://www.iata.org/)
- [PCI DSS Compliance Guide](https://www.pcisecuritystandards.org/)
- [Web Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

### 14.3 Test Execution Checklist

- [ ] Test environment ready (QA/demo)
- [ ] Test data created (users, flights, payments)
- [ ] Test accounts verified
- [ ] Payment gateway sandbox configured
- [ ] Email testing configured
- [ ] Browser drivers installed (Chromium)
- [ ] Playwright project initialized
- [ ] Page objects created
- [ ] Test utilities created
- [ ] CI/CD pipeline configured
- [ ] Base test suite executed
- [ ] Results reviewed and approved

---

**Document Version:** 1.0  
**Last Updated:** September 8, 2026  
**Scope:** Flight Booking Module Only  
**Status:** Ready for Review & Implementation

---

*This document provides comprehensive analysis of the PHPTRAVELS Flight Booking module for test automation planning and execution. Stakeholder review and approval recommended before automation begins.*

