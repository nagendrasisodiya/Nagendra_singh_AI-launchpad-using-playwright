# Test Plan: VideoGameDB API (v2)

Generated for: https://www.videogamedb.uk/swagger-ui/index.html#/api-video-games-controller-v-2

Date: 2026-09-08
Author: QA Automation Engineer

## 1. Purpose

This test plan defines the scope, objectives, approach, and deliverables for testing the VideoGameDB API (v2). The API exposes CRUD operations for video game resources (GET, POST, PUT, DELETE). The goal is to validate functionality, reliability, error handling, response correctness (status codes, headers, payload), and performance/negative scenarios where applicable.

## 2. Scope

In scope:
- Functional tests for all public endpoints exposed by the VideoGameDB v2 controller.
- Validation of HTTP response status codes, headers and body content/schema.
- Positive (happy) scenarios and negative tests (validation, boundary conditions, malformed payloads, not-found).
- Idempotency checks for PUT and DELETE where applicable.
- Basic concurrency / race condition checks for create/update/delete sequences.

Out of scope:
- UI tests for the Swagger UI page itself.
- Authentication/authorization tests unless the API enforces auth (none assumed). If auth is present, add a small set of auth tests.
- Long-running performance / load testing (can be added later).

## 3. Objectives

- Verify CRUD endpoints behave per specification: correct status codes (200/201/204/400/404/500), correct Content-Type, and valid JSON schema.
- Ensure server returns meaningful error messages and appropriate headers.
- Validate input validation (required fields, types, lengths) and error handling for invalid data.
- Provide a complete suite of test cases suitable for automation (Playwright / Playwright-API or any HTTP test runner).

## 4. Test Items (API Endpoints)

Assumed endpoints (based on Swagger grouping "api-video-games-controller-v-2"): 
- GET /videogames - list all videogames
- GET /videogames/{id} - retrieve videogame by id
- POST /videogames - create new videogame
- PUT /videogames/{id} - update videogame by id
- DELETE /videogames/{id} - delete videogame by id

Note: Exact paths / parameter names should be taken from the live OpenAPI/Swagger definition; test cases use placeholders where necessary and include steps to fetch the OpenAPI spec programmatically for schema validation.

## 5. Approach and Strategy

- Use automated API tests (Playwright Test, or node/mocha/jest, or Postman/Newman). Tests will be written so they can run in any order (each test will set up and tear down its own data where possible).
- Positive and negative scenarios; validate headers (Content-Type, Content-Length where meaningful, Cache-Control, Date), status codes, response times (smoke check), and response body fields.
- Schema validation: compare response JSON to OpenAPI schema where possible.

## 6. Test Environment

Assumptions:
- Tests run against https://www.videogamedb.uk (or a configured test/staging base URL if provided).
- Network access to the API endpoint is available from the test runner.
- No authentication is required. If authentication is required, environment variables for credentials will be used.

Test Data:
- Use randomized names and safe IDs for creation to avoid collisions.
- Clean up created resources in teardown steps to keep environment stable.

## 7. Roles & Responsibilities

- QA Engineer: write and maintain automated tests, run test suites, triage failures.
- Developer: provide fixes for API issues, update Swagger/OpenAPI when schema changes.
- Product Owner: clarify expected behavior for ambiguous cases.

## 8. Test Deliverables

- `test-docs/Test_Plan.md` (this document)
- `test-docs/Test_Cases.md` - detailed test cases and step-by-step instructions
- `test-docs/Test_Plan.docx` and `test-docs/Test_Cases.docx` (Word copies)
- Automation scripts (separate repo or folder) – not included here but can be generated from the test cases.

## 9. Entry & Exit Criteria

Entry Criteria:
- API endpoint reachable and Swagger/OpenAPI spec accessible.
- Test environment configured.

Exit Criteria:
- All high-priority test cases (P0/P1) pass.
- All critical defects resolved or accepted by business.

## 10. Risk & Mitigations

- Risk: Tests run against production-like environment may mutate data. Mitigation: Use a test or staging endpoint; ensure cleanup steps.
- Risk: API schema drift. Mitigation: Add schema validation against live OpenAPI spec as part of test run.

## 11. Metrics and Reporting

- Test pass rate, defect counts, test execution time.
- Capture response times (median and 95th percentile) for critical endpoints as smoke checks.

## 12. Traceability

- Each test case in `Test_Cases.md` references a requirement: CRUD functional correctness and error handling.

## 13. Maintenance

- Update test cases when OpenAPI spec changes. Store test data templates and helper utilities in the automation repository.

---

Appendix: Quick Guidelines for Test Automation Implementation

- Each test should assert on: HTTP status code, Content-Type header, presence of mandatory response fields, and at least one field value sanity check (e.g., `id` is numeric/string, `name` length > 0).
- Use schema validation (openapi) when exact schema available.
- Make tests idempotent and independent. Use unique identifiers (timestamp or UUID) for created resources.
- For destructive tests (DELETE), either create a fresh resource at runtime or restore state in teardown.


