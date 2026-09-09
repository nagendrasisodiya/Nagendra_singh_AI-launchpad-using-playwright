# Bug Report: Playwright API Tests vs VideoGameDB API

Date: 2026-09-08
Reported by: automated test run

## Summary
During automated Playwright test run, several API tests failed. Investigation shows that failures were due to mismatches between test assumptions and the live API:

1. Tests used incorrect endpoint paths (plural `/videogames`) while the API exposes `/api/v2/videogame` (singular) per OpenAPI v3.
2. Some write operations (POST/PUT/DELETE) require JWT authentication and the public server is running in READ ONLY mode — changes are not persisted.
3. Some tests assumed UUID/string IDs; the API expects integer `id` (int32).

These conditions caused multiple test failures (404s, HTML redirects, unexpected content-types, JSON parse errors).

## Affected Tests (from `tests/videogamedb.api.spec.ts`)
- TC-GV-001 - List videogames - Failed due to wrong path `/videogames` -> should use `/api/v2/videogame`
- TC-P-001 - Create videogame - Failed because test expected JSON on wrong endpoint; correct endpoint requires auth and is read-only
- TC-P-002 - Create videogame (missing field) - Failed for same reasons as above
- TC-U-001 - Update existing videogame - Failed (tests attempted write operations; API requires JWT and is read-only)
- TC-D-001 - Delete existing videogame - Failed (same as update)

## Root Causes
- Test suite used placeholder endpoints based on older assumptions; the live OpenAPI (available at `/v3/api-docs`) shows exact paths, parameter types, and security requirements.
- The public server is configured as READ ONLY. Write operations either return 401/403 or do not persist, so tests that assert persistence fail.

## Evidence
- OpenAPI retrieved from `https://www.videogamedb.uk/v3/api-docs` (200 OK) shows paths under `/api/v2/videogame` and security requirement `JWT` for modifying endpoints.
- Direct `curl` to `https://www.videogamedb.uk/api/v2/videogame` returned 200 and a JSON array of games.
- Original tests attempted `POST`/`PUT`/`DELETE` against incorrect `/videogames` path and received HTML redirects or 404s.

## Recommendations / Fixes
1. Update tests to use endpoints exactly as defined in the OpenAPI: use `/api/v2/videogame` and `/api/v2/videogame/{id}`.
2. Use integer ids in tests (int32) rather than UUID strings.
3. For write operations (POST/PUT/DELETE):
   - Implement an authentication step against `/api/authenticate` to obtain a JWT and attach `Authorization: Bearer <token>` to write requests when testing a writable environment.
   - For the public READ ONLY instance, mark write tests as skipped or adjust expectations to validate returned HTTP status (e.g., 401/403) and/or response schema, but do not assert persistence.
4. Add a helper that programmatically fetches the OpenAPI spec (`/v3/api-docs`) and derives paths/required fields to keep tests in sync.

## Actions taken
- Updated `tests/videogamedb.api.spec.ts` to call `/api/v2/videogame`, use integer IDs, and avoid assuming persistence. Update includes skipping update/delete tests which require JWT and/or a writable environment.
- Created this bug report.

## Severity
Medium — tests failing due to environment/API differences; functionality of API endpoints (READ/WRITE) should be clarified by API owners.

## Next steps
- Confirm whether a writable test/staging environment exists and credentials for authentication (if tests should verify create/update/delete flows).
- If provided, implement auth flow in tests and re-enable skipped tests.
- Optionally, add OpenAPI-based schema validation to tests.

---

