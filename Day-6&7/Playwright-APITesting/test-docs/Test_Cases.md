# Test Cases: VideoGameDB API (v2)

Base URL: https://www.videogamedb.uk (use configured base when running tests)
Assumption: API follows typical REST patterns. Adjust endpoint paths after confirming the OpenAPI spec.

Each test case includes:
- ID
- Title
- Preconditions / Assumptions
- Steps
- Expected Results (status code, headers, body checks)
- Success Criteria / Failure Conditions

---

## GET /videogames - List all videogames

### TC-GV-001 - List videogames - Happy Path
Preconditions: API reachable
Steps:
1. Send GET request to /videogames
2. Capture response
Expected:
- Status code: 200 OK
- Headers: Content-Type: application/json; charset=utf-8 (or exact value from API)
- Body: JSON array (possibly empty). Each item has expected fields (e.g., id, name). Validate at least the structure and that Content-Length/Date headers exist.
Success: All checks pass.
Failure: Non-200 status or invalid JSON or missing Content-Type.

### TC-GV-002 - List videogames - Accept header variation
Preconditions: None
Steps:
1. Send GET /videogames with Accept: application/xml
Expected:
- Either 200 with JSON (server ignores Accept) or 406 Not Acceptable. Validate behavior is consistent with API contract.

---

## GET /videogames/{id}

### TC-GI-001 - Retrieve existing videogame - Happy Path
Preconditions: A videogame exists. Create one via POST if necessary.
Steps:
1. Ensure resource exists and note its id
2. Send GET /videogames/{id}
Expected:
- Status 200 OK
- Content-Type: application/json
- Body: JSON object with `id` matching requested id and other fields populated
- Response headers contain Date and Content-Length

### TC-GI-002 - Retrieve non-existing videogame
Steps:
1. Send GET /videogames/{non-existing-id}
Expected:
- Status 404 Not Found
- Body: JSON error object with message explaining not found (if API provides)

### TC-GI-003 - Invalid id format
Steps:
1. Send GET /videogames/{id} where id is a string with invalid characters (e.g., "abc!!")
Expected:
- Status 400 Bad Request or 404 Not Found depending on API validation
- Body: validation error message when applicable

---

## POST /videogames - Create videogame

### TC-P-001 - Create videogame - Happy Path
Preconditions: None
Steps:
1. Send POST /videogames with JSON body:
{
  "name": "Auto Test Game <timestamp>",
  "genre": "Action",
  "releaseDate": "2024-01-01",
  "rating": 4.5
}
2. Capture response
Expected:
- Status: 201 Created (or 200 if API uses 200)
- Location header present and points to new resource (/videogames/{id})
- Response Content-Type: application/json
- Body contains created resource including server-assigned `id` and fields matching request

Success Criteria:
- Resource retrievable via GET at the returned location

### TC-P-002 - Create videogame - Missing mandatory field
Steps:
1. Send POST /videogames but omit required field `name`
Expected:
- Status: 400 Bad Request
- Body: JSON with validation errors specifying missing field

### TC-P-003 - Create videogame - Invalid data types
Steps:
1. Send POST with rating as string "five"
Expected:
- Status 400 Bad Request
- Body explains type error

### TC-P-004 - Create videogame - Duplicate prevention / idempotency
Steps:
1. Send identical POST twice (same payload)
Expected:
- Either API creates two resources (distinct ids) or rejects duplicate; document behavior. If duplicates allowed, both requests return 201.

---

## PUT /videogames/{id} - Update videogame

### TC-U-001 - Update existing videogame - Happy Path
Preconditions: A resource exists (create via POST)
Steps:
1. Send PUT /videogames/{id} with updated JSON body (e.g., change name and rating)
2. GET the same resource
Expected:
- PUT status: 200 OK or 204 No Content
- If 200 with body, body reflects updated fields
- GET returns updated values

### TC-U-002 - Update non-existing videogame
Steps:
1. Send PUT /videogames/{non-existing-id} with valid payload
Expected:
- 404 Not Found or 201 Created depending on API semantics (document observed behavior)

### TC-U-003 - Partial update handling
Note: If API supports PATCH, create separate cases. For PUT, entire resource replacement expected.

### TC-U-004 - Invalid payload on update
Steps:
1. Send PUT with invalid field types
Expected:
- 400 Bad Request with validation details

---

## DELETE /videogames/{id}

### TC-D-001 - Delete existing videogame - Happy Path
Preconditions: Create resource to delete
Steps:
1. Send DELETE /videogames/{id}
Expected:
- Status: 204 No Content or 200 OK
- Subsequent GET /videogames/{id} returns 404 Not Found

### TC-D-002 - Delete non-existing videogame
Steps:
1. Send DELETE /videogames/{id} where id not present
Expected:
- 404 Not Found or 204 No Content (if API treats delete as idempotent). Document behavior.

### TC-D-003 - Delete with invalid id
Steps:
1. Send DELETE /videogames/invalid-id
Expected:
- 400 Bad Request or 404 Not Found

---

## Headers, Response Validation and Common Checks

- For every successful response verify:
  - HTTP status code is correct.
  - Content-Type header: application/json (or exact as API)
  - Presence of Date header
  - Content-Length is numeric when present
  - Location header on resource creation
- Validate response times (< 2s for smoke; configurable)
- Validate response JSON structure: required fields, field types, and basic constraints (e.g., non-empty name)

## Negative and Boundary Tests (selected)

1. Very long `name` field (e.g., 10k characters) -> expect 400 or truncated. 
2. Empty JSON body on POST -> 400 Bad Request.
3. Extra unknown fields in payload -> API should ignore unknown fields or return 400 (specify expected behavior after consulting Swagger).
4. Concurrent deletes/updates: create resource, send simultaneous DELETE and PUT and assert eventual consistency and defined error behavior.

## Data Cleanup and Isolation

- Tests that create data must delete the data in teardown steps.
- Use unique prefixes (e.g., "autotest_20260908_...") for created names to find and cleanup leftovers.

## Test Execution Notes

- Tests must be runnable in parallel where possible but avoid interfering with created resources by scoping resources to each test.
- When possible, use the OpenAPI spec to programmatically validate response schema automatically.

## Example JSON payloads (for automation)

Create payload:
{
  "name": "Auto Test Game 20260908T123000",
  "genre": "Adventure",
  "releaseDate": "2025-11-01",
  "rating": 4.2
}

Update payload:
{
  "id": "{id}",
  "name": "Auto Test Game Updated",
  "genre": "Adventure",
  "releaseDate": "2025-11-01",
  "rating": 4.6
}

---

## How to adapt tests to exact API paths/fields

1. Query the Swagger/OpenAPI definition (use the JSON/YAML endpoint visible on the Swagger UI).
2. Replace placeholder paths/field names with actual values from spec.
3. If authentication is required, add pre-auth steps to fetch token and attach Authorization header.



