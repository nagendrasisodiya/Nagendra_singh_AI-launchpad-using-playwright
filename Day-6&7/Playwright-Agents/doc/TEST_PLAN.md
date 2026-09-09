# SauceDemo Test Plan

## 1. Test Plan Information

| Field | Value |
|---|---|
| Test plan name | SauceDemo Web Application Test Plan |
| Project name | SauceDemo QA Validation |
| Application name | SauceDemo |
| Application URL | https://www.saucedemo.com/ |
| Document version | v1.0 |
| Prepared by | Senior QA Engineer and Test Lead |
| Date | 2026-09-07 |
| Document status | Draft for review |

## 2. Introduction

SauceDemo is a sample e-commerce web application that simulates a full buyer flow: authentication, inventory browsing, sorting, product detail inspection, cart management, checkout, and order completion.

The purpose of this test plan is to validate that core commerce workflows work correctly, reliably, and consistently across supported browsers and viewports, including expected negative behaviors and user restrictions.

Validating the complete end-to-end user journey is critical because defects in any single step (login, cart state, totals, or checkout transitions) can block order completion and reduce trust in the product.

## 3. Test Objectives

- Verify successful and unsuccessful login behavior.
- Validate inventory data presentation and product content consistency.
- Verify sorting options and sort result correctness.
- Validate add/remove product behavior from inventory and cart.
- Verify cart item details, quantities, and badge updates.
- Validate checkout information form and error handling.
- Verify checkout overview calculations (item total, tax, total).
- Verify order completion, confirmation page, and post-order state.
- Validate menu navigation, reset state, logout, and session protection.
- Identify functional, usability, compatibility, accessibility, performance, and security-related issues.

## 4. Scope of Testing

### In Scope

- Login functionality
- Login error validation
- Different SauceDemo user accounts
- Product inventory page
- Product names, descriptions, images, and prices
- Product details page
- Product sorting
- Add-to-cart functionality
- Remove-from-cart functionality
- Cart badge count
- Shopping cart page
- Continue Shopping functionality
- Checkout information form
- Checkout form validation
- Checkout overview
- Item total, tax, and final total
- Finish order functionality
- Order confirmation
- Back Home functionality
- Application menu
- Reset App State functionality
- Logout functionality
- Browser compatibility
- Basic responsive testing
- Basic accessibility testing
- Basic performance testing
- Negative and boundary testing

### Out of Scope

- Real payment processing
- Real product inventory integration
- Real shipping service integration
- Database validation when direct access is unavailable
- Production monitoring
- Third-party services not included in SauceDemo

## 5. Test Items and Modules

| Module ID | Module Name | Coverage Focus |
|---|---|---|
| AUTH | Authentication | Login success/failure, error handling, session gate |
| INV | Inventory | Product listing integrity and add/remove behavior |
| PDET | Product Details | Product page navigation and content consistency |
| SORT | Product Sorting | Sorting option behavior and result correctness |
| CART | Shopping Cart | Cart item lifecycle and badge synchronization |
| CHK-INFO | Checkout Information | Customer data entry and validation |
| CHK-OVR | Checkout Overview | Totals, tax, and finish/cancel paths |
| ORD | Order Confirmation | Confirmation content and back-home behavior |
| NAV | Menu and Navigation | All Items, Reset App State, and route transitions |
| SES | Logout and Session Handling | Logout, protected routes, browser back behavior |

## 6. Test Approach

| Test Type | Purpose | Areas Covered | Expected Outcome |
|---|---|---|---|
| Smoke | Verify build viability quickly | Login, inventory load, add-to-cart, checkout happy path, logout | Critical workflow works before deeper testing |
| Sanity | Verify targeted fixes | Recently changed module(s) and immediate dependencies | Changed features behave as expected |
| Functional | Validate requirements behavior | All listed modules and interactions | UI actions produce correct results and messages |
| Integration | Verify module interactions | Inventory->Cart->Checkout data continuity | Selected items and totals stay consistent through flow |
| End-to-End | Validate full user journey | Login to order completion and return home | User can complete purchase flow without blockers |
| Regression | Protect existing behavior | Critical paths and previously defect-prone scenarios | No unintended breakage in stable features |
| Negative | Validate invalid inputs and misuse | Login errors, empty/invalid checkout fields, locked user | Proper validation, no crashes, clear errors |
| Boundary-Value | Verify edge input handling | Min/max lengths, spaces-only, special chars, badge count transitions | Boundaries handled safely and consistently |
| Usability | Evaluate ease of use | Labels, error clarity, navigation affordances | Flows are understandable and efficient |
| UI | Validate visual and layout behavior | Alignment, control states, consistency across pages | UI renders consistently without overlap/clipping |
| Cross-browser | Ensure compatibility | Chrome/Chromium, Firefox, Edge, WebKit/Safari-compatible | Core workflows behave consistently by browser |
| Responsive | Validate viewport adaptability | Desktop + common mobile/tablet widths | No critical content/function loss at tested widths |
| Accessibility | Basic a11y conformance checks | Keyboard access, focus order, labels, color contrast spot checks | No severe blockers for keyboard/screen-reader baseline |
| Basic performance | Identify obvious slowness | Login, inventory load, checkout transitions | Response times remain within defined baseline thresholds |
| Basic security | Catch common issues | Session after logout, URL access control, input handling | Unauthorized access is prevented; no obvious leaks |

### Manual vs Automation Coverage

| Coverage Type | Recommended Scope |
|---|---|
| Manual | Exploratory UX, visual checks, accessibility spot checks, ad-hoc negative tests |
| Automation | Smoke, regression, data-driven auth tests, cart/checkout calculations, cross-browser core flows |

## 7. User and Credential Coverage

| User Type | Purpose of Testing |
|---|---|
| `standard_user` | Baseline positive workflow validation |
| `locked_out_user` | Access restriction and error-message validation |
| `problem_user` | UI/data anomalies and resilience checks |
| `performance_glitch_user` | Slow response handling and timeout robustness |
| `error_user` | Error-state handling under intentionally unstable behavior |
| `visual_user` | Visual/rendering differences and UI consistency checks |

Credential handling recommendations:
- Do not hardcode credentials in test code or reports.
- Store credentials in environment variables (for example, `SAUCE_USERNAME`, `SAUCE_PASSWORD`) or encrypted test-data config.
- Mask credentials in logs and CI output.

## 8. Detailed Test Scenarios

Assumption for all scenarios: **Start from a fresh browser session and default app state**.

### Authentication Scenarios

#### AUTH-001 - Login with valid credentials
1. Open `https://www.saucedemo.com/`.
2. Enter valid username and password.
3. Click **Login**.
- Expected: User lands on inventory page.
- Success criteria: URL contains `/inventory.html`, product list visible.
- Failure conditions: Error message shown or redirect failure.

#### AUTH-002 - Login with invalid username
1. Open login page.
2. Enter invalid username and valid password.
3. Click **Login**.
- Expected: Authentication error displayed.
- Success criteria: User remains on login page and sees meaningful error.
- Failure conditions: User logs in or no message displayed.

#### AUTH-003 - Login with invalid password
1. Open login page.
2. Enter valid username and invalid password.
3. Click **Login**.
- Expected: Authentication error displayed.
- Success criteria: Login blocked with clear message.
- Failure conditions: Unexpected login success.

#### AUTH-004 - Empty username and password
1. Open login page.
2. Leave both fields empty.
3. Click **Login**.
- Expected: Required field error.
- Success criteria: Error text specifies missing username.
- Failure conditions: No validation or incorrect error.

#### AUTH-005 - Empty username only
1. Enter password only.
2. Click **Login**.
- Expected: Username required error.
- Success criteria: Specific username error shown.

#### AUTH-006 - Empty password only
1. Enter username only.
2. Click **Login**.
- Expected: Password required error.
- Success criteria: Specific password error shown.

#### AUTH-007 - Locked-out user
1. Enter `locked_out_user` with valid password.
2. Click **Login**.
- Expected: Locked-out error message.
- Success criteria: Access denied with explicit locked-out content.

#### AUTH-008 - Error-message content and close button
1. Trigger a login error.
2. Validate exact error copy and icon.
3. Click error close button.
- Expected: Message is correct and dismissible.

#### AUTH-009 - Password masking
1. Type password characters in password field.
- Expected: Characters are masked.

#### AUTH-010 - Leading/trailing spaces behavior
1. Enter valid credentials with spaces before/after values.
2. Attempt login.
- Expected: Behavior documented (trimmed or rejected) and consistent.

### Inventory Scenarios

#### INV-001 - Inventory page after successful login
1. Login with valid account.
- Expected: Inventory title, products, cart icon, and sort dropdown present.

#### INV-002 - All expected products displayed
1. Count product cards.
- Expected: Expected catalog item count shown (currently 6).

#### INV-003 - Product content integrity
1. For each product, validate name, image, description, and price are visible.
- Expected: No missing content; prices correctly formatted.

#### INV-004 - Open product details
1. Click a product name or image.
- Expected: Product-details page opens with matching data.

#### INV-005 - Back to inventory from product details
1. Click **Back to products**.
- Expected: Return to inventory page.

#### INV-006 - Add product from inventory
1. Click **Add to cart** for one item.
- Expected: Button changes to **Remove**; badge increments.

#### INV-007 - Remove product from inventory
1. Click **Remove** on added item.
- Expected: Button resets to **Add to cart**; badge decrements.

#### INV-008 - Add multiple products
1. Add at least 3 products.
- Expected: Badge equals number of unique added items.

#### INV-009 - Verify cart badge count
1. Alternate add/remove actions.
- Expected: Badge updates immediately and accurately.

### Product Sorting Scenarios

#### SORT-001 - Name A to Z
1. Select **Name (A to Z)**.
- Expected: List sorted alphabetically ascending.

#### SORT-002 - Name Z to A
1. Select **Name (Z to A)**.
- Expected: List sorted alphabetically descending.

#### SORT-003 - Price low to high
1. Select **Price (low to high)**.
- Expected: Numeric ascending order.

#### SORT-004 - Price high to low
1. Select **Price (high to low)**.
- Expected: Numeric descending order.

#### SORT-005 - Sorting persistence check
1. Change sorting; navigate to details and back.
- Expected: Selected sort option remains correct or reset behavior is consistent with specification.

### Shopping Cart Scenarios

#### CART-001 - Open empty cart
1. From fresh state, open cart without adding items.
- Expected: Cart is empty and checkout still available.

#### CART-002 - Add one product and verify in cart
1. Add one item in inventory.
2. Open cart.
- Expected: Item appears with correct name, quantity, and price.

#### CART-003 - Add multiple products and verify
1. Add multiple items.
2. Open cart.
- Expected: All selected items listed with matching details.

#### CART-004 - Verify cart item details
1. Confirm product name, quantity, and unit price.
- Expected: Values match inventory selection.

#### CART-005 - Remove from cart
1. Remove one item in cart.
- Expected: Item removed and badge updates.

#### CART-006 - Continue shopping
1. Click **Continue Shopping**.
- Expected: Return to inventory page.

#### CART-007 - Proceed to checkout
1. Click **Checkout** with at least one item.
- Expected: Navigate to checkout information page.

### Checkout Information Scenarios

#### CHK-INFO-001 - Submit valid customer info
1. Enter valid first name, last name, and postal code.
2. Click **Continue**.
- Expected: Navigate to checkout overview page.

#### CHK-INFO-002 - All fields empty
1. Leave all fields empty.
2. Click **Continue**.
- Expected: Required field error shown.

#### CHK-INFO-003 - Missing first name
1. Fill last name and postal code only.
2. Continue.
- Expected: First name required error.

#### CHK-INFO-004 - Missing last name
1. Fill first name and postal code only.
2. Continue.
- Expected: Last name required error.

#### CHK-INFO-005 - Missing postal code
1. Fill first and last name only.
2. Continue.
- Expected: Postal code required error.

#### CHK-INFO-006 - Spaces-only values
1. Enter spaces in one or more fields.
2. Continue.
- Expected: Treated as invalid input or consistently trimmed per behavior.

#### CHK-INFO-007 - Special characters
1. Enter names with special characters.
2. Continue.
- Expected: Accepted/rejected behavior consistent and safe.

#### CHK-INFO-008 - Long input values
1. Enter long strings near/over practical limits.
2. Continue.
- Expected: No UI break; validation handles boundaries.

#### CHK-INFO-009 - Cancel checkout
1. Click **Cancel** from step one.
- Expected: Returns to cart page.

### Checkout Overview Scenarios

#### CHK-OVR-001 - Verify selected products
1. Reach overview with known selections.
- Expected: Same selected products shown.

#### CHK-OVR-002 - Verify quantities
1. Validate displayed quantities.
- Expected: Quantities match cart.

#### CHK-OVR-003 - Verify individual prices
1. Compare item prices to inventory/cart values.
- Expected: Prices consistent across pages.

#### CHK-OVR-004 - Verify item total
1. Sum item prices manually.
2. Compare with item total.
- Expected: Exact match.

#### CHK-OVR-005 - Verify tax
1. Recalculate tax based on displayed rule/expected behavior.
- Expected: Tax value accurate within rounding rules.

#### CHK-OVR-006 - Verify final total
1. Validate `Total = Item total + Tax`.
- Expected: Arithmetic correctness.

#### CHK-OVR-007 - Cancel from overview
1. Click **Cancel**.
- Expected: Returns to inventory page.

#### CHK-OVR-008 - Finish order
1. Click **Finish**.
- Expected: Order confirmation page appears.

### Order Confirmation Scenarios

#### ORD-001 - Verify success message
1. Complete an order.
- Expected: "Thank you for your order!" message displayed.

#### ORD-002 - Verify confirmation page elements
1. Validate heading, confirmation text, and navigation button(s).
- Expected: Mandatory confirmation content visible.

#### ORD-003 - Back Home behavior
1. Click **Back Home**.
- Expected: User returns to inventory page.

#### ORD-004 - Cart state after completion
1. Verify cart badge and cart page after order completion.
- Expected: Cart is cleared.

### Menu and Logout Scenarios

#### NAV-001 - Open/close menu
1. Open menu from header.
2. Close menu.
- Expected: Menu opens/closes without UI issues.

#### NAV-002 - All Items navigation
1. Use menu -> **All Items**.
- Expected: User lands on inventory listing.

#### NAV-003 - Reset App State
1. Add items.
2. Use **Reset App State**.
- Expected: Cart and selection state reset.

#### SES-001 - Logout successfully
1. Use menu -> **Logout**.
- Expected: Redirect to login page.

#### SES-002 - Protected page access after logout
1. Try direct URL `/inventory.html` after logout.
- Expected: Access blocked and redirected to login with message.

#### SES-003 - Browser Back behavior after logout
1. Logout.
2. Press browser Back.
- Expected: Protected content not accessible; session remains logged out.

## 9. Test Case Template

| Field | Description |
|---|---|
| Test Case ID | Unique ID (for example, `AUTH-TC-001`) |
| Module | AUTH/INV/CART/CHK/etc. |
| Test Scenario | Scenario ID reference |
| Test Case Title | Clear, action-oriented title |
| Preconditions | Required setup/state |
| Test Data | Input values and user/account |
| Test Steps | Numbered execution steps |
| Expected Result | Specific, measurable expected output |
| Actual Result | Observed output during execution |
| Priority | Critical/High/Medium/Low |
| Severity | Blocker/Critical/Major/Minor/Trivial |
| Test Type | Functional, Negative, E2E, Regression, etc. |
| Automation Candidate | Yes/No |
| Execution Status | Not Run/Pass/Fail/Blocked |
| Defect ID | Linked bug ticket if failed |
| Comments | Additional context/evidence links |

## 10. Sample Test Cases (Representative)

> Note: These are execution-ready samples. Each test case assumes a fresh browser state unless preconditions say otherwise.

### TC-01 `AUTH-TC-001` Valid Login
- Module: AUTH
- Scenario: AUTH-001
- Priority: Critical | Severity: Blocker | Type: Smoke, Functional | Automation: Yes
- Preconditions: Login page is accessible.
- Test Data: Valid user (`standard_user`) + valid password from secure source.
- Steps:
  1. Open login page.
  2. Enter valid username.
  3. Enter valid password.
  4. Click **Login**.
- Expected Result:
  1. User is redirected to `/inventory.html`.
  2. `Products` title and inventory list are visible.

### TC-02 `AUTH-TC-002` Invalid Username
- Module: AUTH
- Scenario: AUTH-002
- Priority: High | Severity: Major | Type: Negative | Automation: Yes
- Preconditions: Login page open.
- Test Data: Invalid username, valid password.
- Steps:
  1. Enter invalid username.
  2. Enter valid password.
  3. Click **Login**.
- Expected Result:
  1. Login is denied.
  2. Error banner appears with relevant message.
  3. URL remains login page.

### TC-03 `AUTH-TC-003` Invalid Password
- Module: AUTH
- Scenario: AUTH-003
- Priority: High | Severity: Major | Type: Negative | Automation: Yes
- Preconditions: Login page open.
- Test Data: Valid username, invalid password.
- Steps:
  1. Enter valid username.
  2. Enter invalid password.
  3. Click **Login**.
- Expected Result:
  1. Login denied with error message.
  2. User remains unauthenticated.

### TC-04 `AUTH-TC-004` Empty Credentials
- Module: AUTH
- Scenario: AUTH-004
- Priority: High | Severity: Major | Type: Negative, Boundary | Automation: Yes
- Preconditions: Login page open.
- Test Data: Empty username, empty password.
- Steps:
  1. Leave both fields empty.
  2. Click **Login**.
- Expected Result:
  1. Error banner shown for missing username.
  2. No navigation occurs.

### TC-05 `AUTH-TC-005` Locked Out User
- Module: AUTH
- Scenario: AUTH-007
- Priority: Critical | Severity: Critical | Type: Functional, Security | Automation: Yes
- Preconditions: Login page open.
- Test Data: `locked_out_user` + valid password.
- Steps:
  1. Enter locked-out username.
  2. Enter valid password.
  3. Click **Login**.
- Expected Result:
  1. Access denied.
  2. Message indicates user is locked out.

### TC-06 `AUTH-TC-006` Error Message Dismiss
- Module: AUTH
- Scenario: AUTH-008
- Priority: Medium | Severity: Minor | Type: UI, Functional | Automation: Yes
- Preconditions: Error banner visible.
- Test Data: Any invalid login causing error.
- Steps:
  1. Trigger login error.
  2. Click error close button.
- Expected Result:
  1. Error banner disappears.
  2. Login form remains interactive.

### TC-07 `INV-TC-001` Inventory Content Presence
- Module: INV
- Scenario: INV-003
- Priority: High | Severity: Major | Type: Functional, Regression | Automation: Yes
- Preconditions: Logged in as `standard_user`.
- Test Data: N/A.
- Steps:
  1. On inventory page, inspect each product card.
  2. Verify product name, image, description, and price are present.
- Expected Result:
  1. No product card has missing fields.
  2. Price format appears as currency.

### TC-08 `INV-TC-002` Open Product Details
- Module: PDET
- Scenario: INV-004
- Priority: Medium | Severity: Major | Type: Functional | Automation: Yes
- Preconditions: Logged in, inventory loaded.
- Test Data: Any listed product.
- Steps:
  1. Click product name.
  2. Observe product details page.
- Expected Result:
  1. Product details page loads.
  2. Selected product information matches inventory card.

### TC-09 `SORT-TC-001` Sort Name A-Z
- Module: SORT
- Scenario: SORT-001
- Priority: High | Severity: Major | Type: Functional, Regression | Automation: Yes
- Preconditions: Logged in to inventory page.
- Test Data: Sort option Name (A to Z).
- Steps:
  1. Select **Name (A to Z)**.
  2. Capture visible product names in order.
- Expected Result:
  1. Names appear in ascending alphabetical sequence.

### TC-10 `SORT-TC-002` Sort Price High-Low
- Module: SORT
- Scenario: SORT-004
- Priority: High | Severity: Major | Type: Functional, Regression | Automation: Yes
- Preconditions: Inventory loaded.
- Test Data: Sort option Price (high to low).
- Steps:
  1. Select **Price (high to low)**.
  2. Capture product prices in order.
- Expected Result:
  1. Prices are sorted descending numerically.

### TC-11 `CART-TC-001` Add Single Product to Cart
- Module: CART
- Scenario: CART-002
- Priority: Critical | Severity: Critical | Type: Smoke, Functional | Automation: Yes
- Preconditions: Logged in, cart empty.
- Test Data: Product A.
- Steps:
  1. Click **Add to cart** on Product A.
  2. Open cart.
- Expected Result:
  1. Cart badge shows `1`.
  2. Product A appears with quantity `1` and correct price.

### TC-12 `CART-TC-002` Remove Product from Cart
- Module: CART
- Scenario: CART-005
- Priority: High | Severity: Major | Type: Functional, Regression | Automation: Yes
- Preconditions: At least one item in cart.
- Test Data: Product A in cart.
- Steps:
  1. Click **Remove** for Product A in cart.
  2. Observe cart content and badge.
- Expected Result:
  1. Product A is removed from list.
  2. Badge decreases accordingly or disappears at zero.

### TC-13 `CART-TC-003` Continue Shopping Navigation
- Module: CART
- Scenario: CART-006
- Priority: Medium | Severity: Minor | Type: Functional, UI | Automation: Yes
- Preconditions: Cart page open.
- Test Data: N/A.
- Steps:
  1. Click **Continue Shopping**.
- Expected Result:
  1. User returns to inventory page.

### TC-14 `CHKINFO-TC-001` Checkout with Valid Data
- Module: CHK-INFO
- Scenario: CHK-INFO-001
- Priority: Critical | Severity: Blocker | Type: E2E, Functional | Automation: Yes
- Preconditions: Logged in, at least one product in cart, on checkout step one.
- Test Data: First name `John`, Last name `Doe`, Postal code `12345`.
- Steps:
  1. Fill all required fields.
  2. Click **Continue**.
- Expected Result:
  1. User navigates to checkout overview page.

### TC-15 `CHKINFO-TC-002` Checkout Empty Fields
- Module: CHK-INFO
- Scenario: CHK-INFO-002
- Priority: High | Severity: Major | Type: Negative | Automation: Yes
- Preconditions: Checkout information page open.
- Test Data: Empty all fields.
- Steps:
  1. Click **Continue** without entering data.
- Expected Result:
  1. Error shown: first required field missing.
  2. User remains on step one.

### TC-16 `CHKINFO-TC-003` Spaces-Only Data
- Module: CHK-INFO
- Scenario: CHK-INFO-006
- Priority: Medium | Severity: Major | Type: Boundary, Negative | Automation: Yes
- Preconditions: Checkout information page open.
- Test Data: Spaces-only in each field.
- Steps:
  1. Enter spaces in all fields.
  2. Click **Continue**.
- Expected Result:
  1. Inputs are rejected or consistently trimmed according to behavior.
  2. No unexpected crash or navigation.

### TC-17 `CHKOVR-TC-001` Validate Totals Calculation
- Module: CHK-OVR
- Scenario: CHK-OVR-004/005/006
- Priority: Critical | Severity: Critical | Type: Functional, Regression | Automation: Yes
- Preconditions: Checkout overview page with known product set.
- Test Data: Product prices from selected cart items.
- Steps:
  1. Sum all item prices manually.
  2. Compare with displayed item total.
  3. Verify displayed tax.
  4. Verify final total equals item total plus tax.
- Expected Result:
  1. All arithmetic values match exactly with expected rounding.

### TC-18 `ORD-TC-001` Complete Order and Confirm
- Module: ORD
- Scenario: CHK-OVR-008, ORD-001
- Priority: Critical | Severity: Blocker | Type: E2E, Smoke | Automation: Yes
- Preconditions: On checkout overview with valid cart.
- Test Data: Any valid checkout data.
- Steps:
  1. Click **Finish**.
  2. Observe confirmation page.
- Expected Result:
  1. Confirmation page appears.
  2. Thank-you message is visible.

### TC-19 `NAV-TC-001` Reset App State
- Module: NAV
- Scenario: NAV-003
- Priority: High | Severity: Major | Type: Functional, Regression | Automation: Yes
- Preconditions: Logged in with products added to cart.
- Test Data: At least 2 added products.
- Steps:
  1. Open menu.
  2. Click **Reset App State**.
  3. Return to inventory and cart.
- Expected Result:
  1. Cart badge is cleared.
  2. Product buttons reset to **Add to cart**.

### TC-20 `SES-TC-001` Logout and Route Protection
- Module: SES
- Scenario: SES-001, SES-002
- Priority: Critical | Severity: Critical | Type: Security, Functional | Automation: Yes
- Preconditions: Logged in session.
- Test Data: N/A.
- Steps:
  1. Open menu and click **Logout**.
  2. Attempt direct navigation to `/inventory.html`.
- Expected Result:
  1. User is on login page after logout.
  2. Protected route access is blocked and redirected.

### TC-21 `SES-TC-002` Browser Back after Logout
- Module: SES
- Scenario: SES-003
- Priority: High | Severity: Major | Type: Security, Regression | Automation: Yes
- Preconditions: User logged out.
- Test Data: N/A.
- Steps:
  1. Press browser Back.
- Expected Result:
  1. User cannot access authenticated inventory content.

### TC-22 `AUTH-TC-007` Leading/Trailing Space Credentials
- Module: AUTH
- Scenario: AUTH-010
- Priority: Medium | Severity: Minor | Type: Boundary, Negative | Automation: Yes
- Preconditions: Login page open.
- Test Data: Valid username/password with leading/trailing spaces.
- Steps:
  1. Enter spaced username/password.
  2. Click **Login**.
- Expected Result:
  1. Behavior is consistent and documented (trim or reject).

## 11. Test Data Strategy

- **Valid login data**: Known working account set (for example, `standard_user`) from secure store.
- **Invalid login data**: Wrong username/password combinations, case variations.
- **Locked-user data**: `locked_out_user` with valid password for access-denial verification.
- **Checkout customer data**: Realistic names and postal codes; locale variations if required.
- **Boundary values**: Empty, min-length, max practical length, very long strings.
- **Special characters**: Names containing `'`, `-`, accented variants, symbols.
- **Empty/spaces-only**: `""`, single space, multiple spaces, mixed spaces/tabs.
- **Multiple-product combinations**: Single cheap item, multiple mixed-price items, full cart set.
- **Data-driven recommendation**: Externalize datasets into JSON/CSV for parameterized automated tests.
- **Credential security**: Use `.env` or secret manager in CI; never print raw secrets to logs.

## 12. Test Environment

| Item | Recommendation |
|---|---|
| Test URL | `https://www.saucedemo.com/` |
| OS coverage | Windows 11, macOS (latest-1), Ubuntu LTS |
| Desktop browsers | Chromium/Chrome, Firefox, Edge, WebKit/Safari-compatible |
| Mobile viewport | 390x844, 375x667, 768x1024 |
| Browser versions | Latest stable and previous stable where feasible |
| Network | Stable broadband; optional throttling for slow-user checks |
| Test data | Controlled account and reusable checkout datasets |
| Automation runtime | Node.js LTS + Playwright + TypeScript |
| Reporting | Playwright HTML, Allure (optional), CI artifacts |

## 13. Automation Strategy (Playwright + TypeScript)

Recommended design:
- **Framework**: Playwright Test with TypeScript.
- **Pattern**: Page Object Model for login, inventory, cart, checkout, and menu components.
- **Fixtures**: Reusable fixtures for user session, test data, and page setup.
- **Test data files**: `data/users.json`, `data/checkout.json`, and negative datasets.
- **Environment management**: `.env` + CI secrets for credentials.
- **Auth state**: Use `storageState` for selected suites; keep auth tests independent.
- **Cross-browser projects**: Chromium, Firefox, WebKit in config projects.
- **Parallel execution**: Enable worker-level parallelism with controlled test isolation.
- **Retry strategy**: Retry flaky tests in CI (for example, 1-2 retries) with trace on retry.
- **Failure artifacts**: Screenshot on failure; video and trace on retry/failure.
- **Reporting**: HTML report for local; Allure for historical trends.
- **CI pipeline**: GitHub Actions matrix by browser/project.
- **Tagging**: `@smoke`, `@regression`, `@auth`, `@checkout`.
- **Suite separation**: Fast smoke suite per PR; full regression nightly.

Suggested maintainable structure:

```text
project-root/
  tests/
    smoke/
    regression/
    e2e/
  pages/
    LoginPage.ts
    InventoryPage.ts
    CartPage.ts
    CheckoutPage.ts
    MenuComponent.ts
  fixtures/
    test-fixtures.ts
  data/
    users.json
    checkout.json
  utils/
    assertions.ts
    calculators.ts
  playwright.config.ts
```

## 14. Entry Criteria

- Application URL is reachable.
- Test environment and tools are available.
- Functional workflows are understood and baseline expectations agreed.
- Test data is prepared and accessible securely.
- Target browsers/devices are available.
- Critical unresolved defects from previous cycle are reviewed.

## 15. Exit Criteria

- 100% planned **Critical** test cases executed.
- 100% smoke suite pass rate.
- 0 open Blocker/Critical defects.
- High-severity defects have agreed resolution/waiver.
- Planned regression cycle completed.
- Test execution and defect results documented.
- Stakeholder review and sign-off completed.

## 16. Suspension and Resumption Criteria

### Suspend Testing When
- Environment is unavailable or unstable for more than agreed threshold.
- A Blocker defect prevents core flow execution (login/cart/checkout).
- Test data is corrupted or inaccessible.
- Build is inconsistent across runs or deployment is incomplete.

### Resume Testing When
- Environment stability is restored.
- Blocking defects are fixed and smoke re-validation passes.
- Required test data and tools are available.
- New build is deployed and version verified.

## 17. Defect Management

### Defect Lifecycle
New -> Triaged -> Assigned -> In Progress -> Fixed -> QA Retest -> Closed / Reopened / Deferred

### Severity Levels
- **Blocker**: No testing possible in key flow.
- **Critical**: Core business flow broken, no workaround.
- **Major**: Significant function incorrect with workaround possible.
- **Minor**: Non-critical functional/UI issue.
- **Trivial**: Cosmetic or low-impact issue.

### Priority Levels
- **Critical**: Immediate fix needed.
- **High**: Fix in current cycle.
- **Medium**: Planned soon.
- **Low**: Can be scheduled later.

### Required Defect Information
- Defect ID, title, module, environment, build/version
- Preconditions and exact reproduction steps
- Expected vs actual result
- Severity/priority
- Attachments: screenshot/video/trace/log/network evidence
- Impacted browser/device and frequency

### Retesting and Regression
- Retest after fix in same environment where issue was found.
- Run targeted regression around impacted area.
- Close only after pass confirmation and evidence attachment.

## 18. Risk Analysis

| Risk ID | Risk Description | Probability | Impact | Risk Level | Mitigation | Owner |
|---|---|---|---|---|---|---|
| RSK-001 | Environment instability | Medium | High | High | Health checks, fallback env, smoke gate | QA Lead + DevOps |
| RSK-002 | Browser behavior differences | High | High | High | Cross-browser suite and bug triage by browser | QA Lead |
| RSK-003 | Dynamic UI behavior causes flaky checks | Medium | Medium | Medium | Stable locators, explicit waits, retries with trace | Automation QA |
| RSK-004 | Incorrect product totals/tax calculations | Medium | Critical | High | Automated arithmetic validations in regression | QA + Dev |
| RSK-005 | Cart-state persistence inconsistencies | Medium | High | High | Reset-state tests and post-logout access checks | QA |
| RSK-006 | Test-data dependency conflicts | Medium | Medium | Medium | Controlled datasets and data reset strategy | QA Lead |
| RSK-007 | Automation flakiness in CI | Medium | High | High | Flake dashboard, retry policy, quarantine process | Automation QA |
| RSK-008 | Network instability | Medium | Medium | Medium | Re-run policy, network diagnostics in CI | DevOps |
| RSK-009 | Limited backend visibility | High | Medium | High | Strengthen UI/API observable assertions and logs | QA + Dev |
| RSK-010 | Incomplete/ambiguous requirements | Medium | High | High | Early clarification workshops and RTM updates | PO + QA Lead |

## 19. Roles and Responsibilities

| Role | Responsibilities |
|---|---|
| QA Lead | Test strategy, scope control, risk management, sign-off recommendation |
| Manual QA Engineer | Scenario execution, exploratory tests, usability/accessibility spot checks |
| Automation QA Engineer | Framework maintenance, script implementation, CI reporting |
| Developer | Fix defects, unit/integration validation, support root-cause analysis |
| Product Owner | Requirement clarification, defect priority decisions, acceptance alignment |
| DevOps/CI-CD Engineer | Pipeline reliability, artifact retention, environment provisioning |

## 20. Test Deliverables

- Test plan document
- Test scenarios catalog
- Detailed test cases
- Test datasets and secure credential strategy
- Automation scripts and reusable components
- Execution report (pass/fail/blocked)
- Defect report with severity trends
- Evidence: traces, screenshots, videos, logs
- Test summary report
- Final sign-off report

## 21. Test Metrics

| Metric | Formula |
|---|---|
| Test Execution % | `(Executed Test Cases / Planned Test Cases) x 100` |
| Pass % | `(Passed / Executed) x 100` |
| Fail % | `(Failed / Executed) x 100` |
| Blocked % | `(Blocked / Executed) x 100` |
| Defect Density | `Total Defects / Total Executed Test Cases` |
| Defect Severity Distribution | `(Defects by Severity / Total Defects) x 100` |
| Defect Leakage | `(Defects found post-release / Total Defects) x 100` |
| Automation Coverage % | `(Automated Cases / Regression Candidates) x 100` |
| Requirement Coverage % | `(Requirements with >=1 test / Total Requirements) x 100` |
| Defect Reopen Rate % | `(Reopened Defects / Closed Defects) x 100` |

## 22. Requirement Traceability Matrix (Sample)

| Requirement ID | Module | Requirement Description | Test Scenario IDs | Test Case IDs | Priority | Automation Status | Execution Status |
|---|---|---|---|---|---|---|---|
| REQ-AUTH-001 | AUTH | Valid user can log in | AUTH-001 | AUTH-TC-001 | Critical | Automated | Not Run |
| REQ-AUTH-002 | AUTH | Invalid login shows error | AUTH-002, AUTH-003, AUTH-004 | AUTH-TC-002, AUTH-TC-003, AUTH-TC-004 | High | Automated | Not Run |
| REQ-AUTH-003 | AUTH | Locked user cannot access app | AUTH-007 | AUTH-TC-005 | Critical | Automated | Not Run |
| REQ-INV-001 | INV | Inventory displays products correctly | INV-001, INV-003 | INV-TC-001 | High | Automated | Not Run |
| REQ-SORT-001 | SORT | Sorting options reorder product list correctly | SORT-001..SORT-004 | SORT-TC-001, SORT-TC-002 | High | Automated | Not Run |
| REQ-CART-001 | CART | User can add/remove items from cart | CART-002, CART-005 | CART-TC-001, CART-TC-002 | Critical | Automated | Not Run |
| REQ-CHK-001 | CHK-INFO | Checkout form validates required inputs | CHK-INFO-001..005 | CHKINFO-TC-001, CHKINFO-TC-002 | Critical | Automated | Not Run |
| REQ-CHK-002 | CHK-OVR | Overview totals are accurate | CHK-OVR-004..006 | CHKOVR-TC-001 | Critical | Automated | Not Run |
| REQ-ORD-001 | ORD | User can finish order and see confirmation | CHK-OVR-008, ORD-001 | ORD-TC-001 | Critical | Automated | Not Run |
| REQ-SES-001 | SES | Logout invalidates protected access | SES-001..003 | SES-TC-001, SES-TC-002 | Critical | Automated | Not Run |

## 23. Test Execution Schedule (Sample)

| Phase | Duration | Planned Window |
|---|---|---|
| Planning | 2 days | Day 1-2 |
| Test-case design | 3 days | Day 3-5 |
| Environment preparation | 2 days | Day 4-5 |
| Smoke testing | 1 day | Day 6 |
| Functional execution | 4 days | Day 7-10 |
| Automation implementation | 5 days | Day 7-11 |
| Cross-browser execution | 2 days | Day 12-13 |
| Regression testing | 3 days | Day 14-16 |
| Defect retesting | 2 days | Day 15-16 |
| Test closure | 1 day | Day 17 |

## 24. Assumptions and Dependencies

### Assumptions
- Requirements are limited to observable SauceDemo behaviors.
- Testers have access to supported browsers and stable internet.
- Test accounts provided by SauceDemo remain available.
- Tax logic and totals are expected to be deterministic per build.
- Optional features outside requested modules are not release blockers unless they affect core flow.

### Dependencies
- Application availability at `https://www.saucedemo.com/`.
- CI runners/browsers availability for automated suites.
- Access to defect tracker and reporting tools.
- Coordination with development and product stakeholders for triage.

## 25. Approval and Sign-Off

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| QA Lead |  |  |  | Pending |
| Engineering Lead |  |  |  | Pending |
| Product Owner |  |  |  | Pending |
| Project Manager |  |  |  | Pending |

---

## Concise Test Plan Summary and Recommendation

This plan provides end-to-end coverage of SauceDemo's critical commerce path, including robust negative, boundary, cross-browser, and session-security validations. Priority should be to automate smoke and high-risk regression scenarios first (authentication, cart operations, checkout totals, and logout protection), then expand with data-driven and cross-browser suites in CI for release confidence.

