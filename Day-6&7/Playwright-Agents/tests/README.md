# Playwright Automation Suites

This folder contains module-based SauceDemo automation suites derived from `doc/TEST_PLAN.md`.

## Environment Variables

- `BASE_URL` (optional, defaults to `https://www.saucedemo.com`)
- `SAUCE_USERNAME` (optional, defaults to `standard_user` for this demo app)
- `SAUCE_PASSWORD` (optional, defaults to `secret_sauce` for this demo app)

## Quick Run

```powershell
npm test
```

## Targeted Runs

```powershell
npm run test:smoke
npm run test:regression
npm run test:auth
npm run test:auth:excel
npm run test:inventory
npm run test:cart
npm run test:checkout
npm run test:navigation
npm run test:e2e
```

## Excel-Driven Login Assets

- Workbook: `test-data/excel-login-credentials.xlsx`
- Spec: `tests/authentication/excel-login.spec.ts`
- Loader: `utils/excelLoginDataLoader.ts`
- Logger: `utils/excelLoginLogger.ts`

