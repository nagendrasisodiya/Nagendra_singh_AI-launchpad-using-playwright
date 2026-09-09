# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: flights\bd-max-passengers.spec.ts >> BD-FLT-001 @boundary - Max passengers selection and validation
- Location: tests\flights\bd-max-passengers.spec.ts:12:5

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for locator('a[href*="flights"]').or(locator('[data-testid="tab-flights"]')).or(getByText('Flights').first()).first() to be visible
    167 × locator resolved to hidden <a href="https://phptravels.net/flights" class="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-900 hover:bg-gray-100 rounded transition-colors">…</a>

```

```
Error: apiRequestContext._wrapApiCall: Target page, context or browser has been closed
```