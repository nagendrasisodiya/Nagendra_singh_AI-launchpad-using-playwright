# Automation Coverage Traceability

Primary source: `doc/TEST_PLAN.md`

## Automated Test Cases

| Test Case ID | Module | Test Case Title | Priority | Automation Status | Test Script Path | Test-Data Source | Tags | Notes |
|---|---|---|---|---|---|---|---|---|
| AUTH-TC-001 | AUTH | Valid Login | Critical | Automated | `tests/authentication/login.spec.ts` | `test-data/loginData.json`, `test-data/expectedMessages.json` | `@smoke @regression @authentication @critical` | Uses env password fallback for SauceDemo demo account |
| AUTH-TC-002 | AUTH | Invalid Username | High | Automated | `tests/authentication/login.spec.ts` | `test-data/loginData.json`, `test-data/expectedMessages.json` | `@regression @authentication @high` | Validates error text and URL |
| AUTH-TC-003 | AUTH | Invalid Password | High | Automated | `tests/authentication/login.spec.ts` | `test-data/loginData.json`, `test-data/expectedMessages.json` | `@regression @authentication @high` | Validates error text and URL |
| AUTH-TC-004 | AUTH | Empty Credentials | High | Automated | `tests/authentication/login.spec.ts` | `test-data/loginData.json`, `test-data/expectedMessages.json` | `@regression @authentication @high` | Validates required username message |
| AUTH-TC-005 | AUTH | Locked Out User | Critical | Automated | `tests/authentication/login.spec.ts` | `test-data/loginData.json`, `test-data/expectedMessages.json` | `@smoke @regression @authentication @critical` | Validates locked user access denial |
| AUTH-TC-006 | AUTH | Error Message Dismiss | Medium | Automated | `tests/authentication/login-validation.spec.ts` | `test-data/expectedMessages.json` | `@regression @authentication @medium` | Validates close icon behavior |
| AUTH-TC-007 | AUTH | Leading/Trailing Space Credentials | Medium | Automated | `tests/authentication/login.spec.ts` | `test-data/loginData.json`, `test-data/expectedMessages.json` | `@regression @authentication @medium` | Current app behavior expected to reject spaced credentials |
| INV-TC-001 | INV | Inventory Content Presence | High | Automated | `tests/inventory/inventory.spec.ts` | N/A | `@regression @inventory @high` | Validates names, descriptions, images, prices |
| INV-TC-002 | PDET | Open Product Details | Medium | Automated | `tests/inventory/product-details.spec.ts` | N/A | `@regression @inventory @medium` | Validates details page and back navigation |
| SORT-TC-001 | SORT | Sort Name A-Z | High | Automated | `tests/inventory/product-sorting.spec.ts` | `test-data/sortingData.json` | `@regression @inventory @high` | Compares UI order with independent sorted order |
| SORT-TC-002 | SORT | Sort Price High-Low | High | Automated | `tests/inventory/product-sorting.spec.ts` | `test-data/sortingData.json` | `@regression @inventory @high` | Converts prices to numbers for comparison |
| CART-TC-001 | CART | Add Single Product to Cart | Critical | Automated | `tests/cart/cart.spec.ts` | `test-data/productData.json` | `@smoke @cart @critical` | Verifies selected product details in cart |
| CART-TC-002 | CART | Remove Product from Cart | High | Automated | `tests/cart/cart.spec.ts` | `test-data/productData.json` | `@regression @cart @high` | Verifies badge decrement after removal |
| CART-TC-003 | CART | Continue Shopping Navigation | Medium | Automated | `tests/cart/cart.spec.ts` | N/A | `@regression @cart @medium` | Verifies cart -> inventory navigation |
| CHKINFO-TC-001 | CHK-INFO | Checkout with Valid Data | Critical | Automated | `tests/checkout/checkout-information.spec.ts` | `test-data/checkoutData.json` | `@e2e @checkout @critical` | Confirms transition to overview |
| CHKINFO-TC-002 | CHK-INFO | Checkout Empty Fields | High | Automated | `tests/checkout/checkout-information.spec.ts` | `test-data/checkoutData.json`, `test-data/expectedMessages.json` | `@regression @checkout @high` | Verifies first-name required validation |
| CHKINFO-TC-003 | CHK-INFO | Spaces-Only Data | Medium | Automated | `tests/checkout/checkout-information.spec.ts` | `test-data/checkoutData.json` | `@regression @checkout @medium` | Asserts currently observed app behavior (navigates to overview) |
| CHKOVR-TC-001 | CHK-OVR | Validate Totals Calculation | Critical | Automated | `tests/checkout/checkout-overview.spec.ts` | N/A | `@regression @checkout @critical` | Uses numeric tolerance for decimal calculations |
| ORD-TC-001 | ORD | Complete Order and Confirm | Critical | Automated | `tests/e2e/purchase-flow.spec.ts` | `test-data/expectedMessages.json` | `@e2e @smoke @critical` | Includes finish confirmation and back-home checks |
| NAV-TC-001 | NAV | Reset App State | High | Automated | `tests/navigation/menu.spec.ts` | N/A | `@regression @navigation @high` | Verifies cart reset and empty cart state |
| SES-TC-001 | SES | Logout and Route Protection | Critical | Automated | `tests/navigation/logout.spec.ts` | `test-data/expectedMessages.json` | `@smoke @regression @authentication @critical` | Verifies direct route access after logout is blocked |
| SES-TC-002 | SES | Browser Back after Logout | High | Automated | `tests/navigation/logout.spec.ts` | N/A | `@regression @authentication @high` | Verifies browser back does not restore active session |

## Scenarios Requiring Clarification (Not in Sample Test-Case IDs)

| Scenario ID | Module | Automation Status | Notes |
|---|---|---|---|
| AUTH-005 | AUTH | Requires Clarification | Scenario exists but no explicit test-case ID/priority in section 10 |
| AUTH-006 | AUTH | Requires Clarification | Scenario exists but no explicit test-case ID/priority in section 10 |
| AUTH-009 | AUTH | Requires Clarification | Password masking scenario exists without explicit test-case ID |
| CHK-INFO-003 | CHK-INFO | Requires Clarification | Missing-first-name scenario has no explicit section-10 test-case ID |
| CHK-INFO-004 | CHK-INFO | Requires Clarification | Missing-last-name scenario has no explicit section-10 test-case ID |
| CHK-INFO-005 | CHK-INFO | Requires Clarification | Missing-postal scenario has no explicit section-10 test-case ID |
| CHK-INFO-007 | CHK-INFO | Requires Clarification | Special-characters scenario has no explicit section-10 test-case ID |
| CHK-INFO-008 | CHK-INFO | Requires Clarification | Long-input boundary scenario has no explicit section-10 test-case ID |
| CHK-INFO-009 | CHK-INFO | Requires Clarification | Cancel scenario has no explicit section-10 test-case ID |
| CHK-OVR-001 | CHK-OVR | Requires Clarification | Overview item-list scenario has no explicit section-10 test-case ID |
| CHK-OVR-002 | CHK-OVR | Requires Clarification | Overview quantity scenario has no explicit section-10 test-case ID |
| CHK-OVR-003 | CHK-OVR | Requires Clarification | Overview unit-price scenario has no explicit section-10 test-case ID |
| CHK-OVR-007 | CHK-OVR | Requires Clarification | Overview cancel scenario has no explicit section-10 test-case ID |
| CHK-OVR-008 | CHK-OVR | Requires Clarification | Finish scenario appears within ORD-TC-001 coverage but no standalone section-10 ID |
| ORD-002 | ORD | Requires Clarification | Confirmation-elements scenario has no explicit section-10 test-case ID |
| ORD-003 | ORD | Requires Clarification | Back-home scenario has no explicit section-10 test-case ID |
| ORD-004 | ORD | Requires Clarification | Post-order cart-state scenario has no explicit section-10 test-case ID |
| NAV-002 | NAV | Requires Clarification | All-items navigation scenario has no explicit section-10 test-case ID |
| SES-003 | SES | Requires Clarification | Covered in SES-TC-002 intent but no standalone section-10 ID |

