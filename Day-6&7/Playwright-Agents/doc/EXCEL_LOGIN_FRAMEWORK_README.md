# Excel-Driven Login Automation Framework

This document describes the Excel-backed SauceDemo login automation flow added to the Playwright TypeScript suite.

## What is included

- Page Object Model for login and inventory validation
- Excel-backed test data source with explicit Excel naming
- Logging utility for readable test execution messages
- Playwright spec that iterates through all Excel user rows
- Separation of test data, page objects, and test logic

## File layout

### Excel data source
- `test-data/excel-login-credentials.xlsx`
  - Workbook containing the login credentials sheet
  - Sheet name: `Sheet1`
  - Table name: `SauceDemoCredentials`

### Excel-related TypeScript helpers
- `types/excelLoginData.ts`
  - Strongly typed row model for the Excel sheet
- `utils/excelLoginDataLoader.ts`
  - Reads `test-data/excel-login-credentials.xlsx` with `xlsx`
- `utils/excelLoginLogger.ts`
  - Winston-based logger that writes to console and `test-results/excel-login-automation.log`

### Test script
- `tests/authentication/excel-login.spec.ts`
  - Excel-driven login coverage using `LoginPage` and `InventoryPage`

## Execution flow

1. Load the Excel workbook from `test-data/excel-login-credentials.xlsx`.
2. Read each credential row from `Sheet1`.
3. Open the SauceDemo login page using the `LoginPage` POM.
4. Submit each username/password pair.
5. Assert either:
   - successful redirect to `/inventory.html`, or
   - locked-out validation message for `locked_out_user`.
6. Write execution details to the logger without exposing raw passwords.

## Naming convention

All Excel-related files are named so they are easy to recognize:

- `excel-login-credentials.xlsx`
- `excelLoginData.ts`
- `excelLoginDataLoader.ts`
- `excelLoginLogger.ts`
- `excel-login.spec.ts`

## Run commands

### Run the Excel login test
```powershell
npm run test:auth:excel
```

### Run all authentication tests
```powershell
npm run test:auth
```

### Run in headed mode for a quick demo
```powershell
npx playwright test tests/authentication/excel-login.spec.ts --headed
```

### Run against Chromium only
```powershell
npx playwright test tests/authentication/excel-login.spec.ts --project=chromium
```

## Notes on data separation

- The workbook contains only test data.
- The test script contains only workflow logic and assertions.
- The loader isolates Excel parsing details.
- The logger isolates traceability and execution messaging.

## Extending the framework

To add more Excel-driven tests:

1. Add another workbook or another sheet with a clear Excel-prefixed name.
2. Create a matching TypeScript type in `types/`.
3. Add a loader in `utils/`.
4. Create a spec under `tests/` that consumes the loader.
5. Keep credentials and other data outside the test body.

## Suggested next steps

- Add a second Excel sheet for negative login variations.
- Reuse the same loader pattern for checkout and cart datasets.
- Add CI reporting for `test-results/excel-login-automation.log`.

