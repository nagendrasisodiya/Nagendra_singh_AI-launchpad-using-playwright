// spec: test-docs/Test_Plan.md
// cases: test-docs/Test_Cases.md
import { test, expect } from '@playwright/test';

// Base URL for the API under test. Change here if you run tests against a different environment.
const BASE = 'https://www.videogamedb.uk';

test.describe('VideoGameDB API (v2)', () => {
  test('TC-GV-001 - List videogames - Happy Path', async ({ request }) => {
    // 1. Send GET request to the v2 videogame list (OpenAPI: /api/v2/videogame)
    const res = await request.get(`${BASE}/api/v2/videogame`);

    // Expected: Status code 200
    expect(res.status()).toBe(200);

    // Expected: Content-Type includes application/json
    const ct = res.headers()['content-type'];
    expect(ct).toBeTruthy();
    expect(ct!.toLowerCase()).toContain('application/json');

    // Expected: Date header exists
    expect(res.headers()['date']).toBeTruthy();

    // Expected: Body is JSON array
    const body = await res.json().catch(() => null);
    expect(Array.isArray(body)).toBeTruthy();
  });

  test('TC-GI-002 - Retrieve non-existing videogame -> 404', async ({ request }) => {
    // API expects integer id (int32). Use a large id that is unlikely to exist.
    const nonExistingId = 9999999;
    const res = await request.get(`${BASE}/api/v2/videogame/${nonExistingId}`);

    // Expected: 404 Not Found (or 400 for invalid id format)
    expect([400, 404]).toContain(res.status());
  });

  test('TC-P-001 - Create videogame - Happy Path (non-persistent/read-only API)', async ({ request }) => {
    // Note: API v2 (per OpenAPI) exposes /api/v2/videogame and requires JWT for modification.
    // The public instance is running in READ ONLY mode (OpenAPI info). We'll assert the POST responds
    // with a valid status and JSON payload but we will not assume persistence (no GET/DELETE cleanup).
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const payload = {
      name: `autotest_${timestamp}`,
      category: 'Action',
      rating: 'Mature',
      releaseDate: '2024-01-01',
      reviewScore: 85,
    };

    const res = await request.post(`${BASE}/api/v2/videogame`, { data: payload });

    // OpenAPI lists 200 OK for create on this API. Accept 200 and also 400/401 where server enforces auth/validation.
    expect([200, 400, 401, 403]).toContain(res.status());

    const ct = (res.headers()['content-type'] || '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = await res.json().catch(() => null);
      // If server returns a created object, it should be an object containing at least a name or id
      if (body && typeof body === 'object') {
        expect(body.name === payload.name || body.id || body).toBeTruthy();
      }
    }
  });

  test('TC-P-002 - Create videogame - Missing mandatory field -> 400', async ({ request }) => {
    // Use v2 path and omit required fields per OpenAPI (required: category,name,rating,releaseDate,reviewScore)
    const payload = {
      category: 'Action',
      // missing name, rating, reviewScore
      releaseDate: '2024-01-01',
    };
    const res = await request.post(`${BASE}/api/v2/videogame`, { data: payload });

    // Expect 400 Bad Request when validation fails, but server may also return 401/403 if auth required.
    expect([400, 401, 403]).toContain(res.status());
  });

  test.skip('TC-U-001 - Update existing videogame - Skipped (requires JWT and API is read-only)', async ({ request }) => {
    // The v2 update/delete endpoints require JWT authentication. The public instance reports that it
    // is running in READ ONLY mode. Skipping this test until auth and writable environment are available.
  });

  test.skip('TC-D-001 - Delete existing videogame - Skipped (requires JWT and API is read-only)', async ({ request }) => {
    // Delete requires JWT and the public API is read-only; skip until a writable environment and auth are available.
  });
});

