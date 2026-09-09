# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apitesting-capg.api.spec.ts >> APITesting-Capg - AutomationExercise API >> User account flow from Postman collection >> DELETE METHOD To Delete User Account
- Location: tests\apitesting-capg.api.spec.ts:126:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 400
Received array: [200, 404]
```

# Test source

```ts
  36  |     if (responseCode !== undefined) {
  37  |       expect(responseCode).toBe(200);
  38  |     }
  39  | 
  40  |     if (body && 'brands' in body) {
  41  |       expect(Array.isArray(body.brands)).toBeTruthy();
  42  |     }
  43  |   });
  44  | 
  45  |   test('POST To Search Product - missing search payload', async ({ request }) => {
  46  |     // This mirrors the Postman request that has an empty POST body.
  47  |     const res = await request.post(`${BASE}/searchProduct`);
  48  |     const body = await parseApiBody(res);
  49  | 
  50  |     expect([200, 400]).toContain(res.status());
  51  | 
  52  |     const responseCode = readNumericCode(body);
  53  |     if (responseCode !== undefined) {
  54  |       expect(responseCode).toBe(400);
  55  |     }
  56  |   });
  57  | 
  58  |   test('PUT To All Brands List - unsupported method', async ({ request }) => {
  59  |     const res = await request.put(`${BASE}/brandsList`);
  60  |     const body = await parseApiBody(res);
  61  | 
  62  |     expect([200, 405]).toContain(res.status());
  63  | 
  64  |     const responseCode = readNumericCode(body);
  65  |     if (responseCode !== undefined) {
  66  |       expect(responseCode).toBe(405);
  67  |     }
  68  |   });
  69  | 
  70  |   test.describe.serial('User account flow from Postman collection', () => {
  71  |     const runId = Date.now();
  72  |     const password = 'Password@123';
  73  |     const email = `john.smith.test${runId}@example.com`;
  74  | 
  75  |     const form = {
  76  |       name: 'John Smith',
  77  |       email,
  78  |       password,
  79  |       title: 'Mr',
  80  |       birth_date: '12',
  81  |       birth_month: '06',
  82  |       birth_year: '1992',
  83  |       firstname: 'John',
  84  |       lastname: 'Smith',
  85  |       company: 'Tech Solutions Inc',
  86  |       address1: '123 Main Street',
  87  |       address2: 'Apt 4B',
  88  |       country: 'United States',
  89  |       zipcode: '10001',
  90  |       state: 'New York',
  91  |       city: 'New York',
  92  |       mobile_number: '5551234567',
  93  |     };
  94  | 
  95  |     test('POST To Create/Register User Account', async ({ request }) => {
  96  |       const res = await request.post(`${BASE}/createAccount`, { form });
  97  |       const body = await parseApiBody(res);
  98  | 
  99  |       expect([200, 201, 400]).toContain(res.status());
  100 | 
  101 |       const responseCode = readNumericCode(body);
  102 |       if (responseCode !== undefined) {
  103 |         // 201 => created, 400 => already exists / bad request.
  104 |         expect([201, 400]).toContain(responseCode);
  105 |       }
  106 |     });
  107 | 
  108 |     test('GET user account detail by email', async ({ request }) => {
  109 |       const res = await request.get(`${BASE}/getUserDetailByEmail`, {
  110 |         params: { email },
  111 |       });
  112 |       const body = await parseApiBody(res);
  113 | 
  114 |       expect([200, 404]).toContain(res.status());
  115 | 
  116 |       const responseCode = readNumericCode(body);
  117 |       if (responseCode !== undefined) {
  118 |         expect([200, 404]).toContain(responseCode);
  119 |       }
  120 | 
  121 |       if (responseCode === 200 && body && 'user' in body) {
  122 |         expect(body.user).toBeTruthy();
  123 |       }
  124 |     });
  125 | 
  126 |     test('DELETE METHOD To Delete User Account', async ({ request }) => {
  127 |       const res = await request.delete(`${BASE}/deleteAccount`, {
  128 |         params: { email, password },
  129 |       });
  130 |       const body = await parseApiBody(res);
  131 | 
  132 |       expect([200, 404]).toContain(res.status());
  133 | 
  134 |       const responseCode = readNumericCode(body);
  135 |       if (responseCode !== undefined) {
> 136 |         expect([200, 404]).toContain(responseCode);
      |                            ^ Error: expect(received).toContain(expected) // indexOf
  137 |       }
  138 |     });
  139 |   });
  140 | });
  141 | 
  142 | 
```