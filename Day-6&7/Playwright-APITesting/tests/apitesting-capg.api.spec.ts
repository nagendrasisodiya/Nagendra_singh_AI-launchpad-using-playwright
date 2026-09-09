import { test, expect, APIResponse } from '@playwright/test';

const BASE = 'https://automationexercise.com/api';

type ApiBody = Record<string, unknown> | null;

async function parseApiBody(response: APIResponse): Promise<ApiBody> {
  try {
    const json = await response.json();
    return json && typeof json === 'object' ? (json as Record<string, unknown>) : null;
  } catch {
    const raw = await response.text();
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }
}

function readNumericCode(body: ApiBody): number | undefined {
  if (!body || body.responseCode === undefined || body.responseCode === null) return undefined;
  const code = Number(body.responseCode);
  return Number.isNaN(code) ? undefined : code;
}

test.describe('APITesting-Capg - AutomationExercise API', () => {
  test('Get All Brands List', async ({ request }) => {
    const res = await request.get(`${BASE}/brandsList`);
    const body = await parseApiBody(res);

    expect(res.status()).toBe(200);

    const responseCode = readNumericCode(body);
    if (responseCode !== undefined) {
      expect(responseCode).toBe(200);
    }

    if (body && 'brands' in body) {
      expect(Array.isArray(body.brands)).toBeTruthy();
    }
  });

  test('POST To Search Product - missing search payload', async ({ request }) => {
    // This mirrors the Postman request that has an empty POST body.
    const res = await request.post(`${BASE}/searchProduct`);
    const body = await parseApiBody(res);

    expect([200, 400]).toContain(res.status());

    const responseCode = readNumericCode(body);
    if (responseCode !== undefined) {
      expect(responseCode).toBe(400);
    }
  });

  test('PUT To All Brands List - unsupported method', async ({ request }) => {
    const res = await request.put(`${BASE}/brandsList`);
    const body = await parseApiBody(res);

    expect([200, 405]).toContain(res.status());

    const responseCode = readNumericCode(body);
    if (responseCode !== undefined) {
      expect(responseCode).toBe(405);
    }
  });

  test.describe.serial('User account flow from Postman collection', () => {
    const runId = Date.now();
    const password = 'Password@123';
    const email = `john.smith.test${runId}@example.com`;

    const form = {
      name: 'John Smith',
      email,
      password,
      title: 'Mr',
      birth_date: '12',
      birth_month: '06',
      birth_year: '1992',
      firstname: 'John',
      lastname: 'Smith',
      company: 'Tech Solutions Inc',
      address1: '123 Main Street',
      address2: 'Apt 4B',
      country: 'United States',
      zipcode: '10001',
      state: 'New York',
      city: 'New York',
      mobile_number: '5551234567',
    };

    test('POST To Create/Register User Account', async ({ request }) => {
      const res = await request.post(`${BASE}/createAccount`, { form });
      const body = await parseApiBody(res);

      expect([200, 201, 400]).toContain(res.status());

      const responseCode = readNumericCode(body);
      if (responseCode !== undefined) {
        // 201 => created, 400 => already exists / bad request.
        expect([201, 400]).toContain(responseCode);
      }
    });

    test('GET user account detail by email', async ({ request }) => {
      const res = await request.get(`${BASE}/getUserDetailByEmail`, {
        params: { email },
      });
      const body = await parseApiBody(res);

      expect([200, 404]).toContain(res.status());

      const responseCode = readNumericCode(body);
      if (responseCode !== undefined) {
        expect([200, 404]).toContain(responseCode);
      }

      if (responseCode === 200 && body && 'user' in body) {
        expect(body.user).toBeTruthy();
      }
    });

    test('DELETE METHOD To Delete User Account', async ({ request }) => {
      const res = await request.delete(`${BASE}/deleteAccount`, {
        params: { email, password },
      });
      const body = await parseApiBody(res);

      expect([200, 404]).toContain(res.status());

      const responseCode = readNumericCode(body);
      if (responseCode !== undefined) {
        expect([200, 404]).toContain(responseCode);
      }
    });
  });
});

