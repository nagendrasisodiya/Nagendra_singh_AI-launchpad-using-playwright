import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import type { ExpectedMessages } from '../../types/testData';

const expectedMessages = loadJsonData<ExpectedMessages>('test-data/expectedMessages.json');

test.describe('Authentication | UI validation', () => {
  test('AUTH-TC-006 | @regression @authentication @medium | error message can be dismissed', async ({ loginPage }) => {
    await test.step('Arrange: trigger an authentication error', async () => {
      await loginPage.goto();
      await loginPage.login('invalid_user', 'secret_sauce');
      await expect(loginPage.errorMessage).toHaveText(expectedMessages.invalidCredentials);
    });

    await test.step('Act: close the error banner', async () => {
      await loginPage.closeError();
    });

    await test.step('Assert: error is closed and form remains interactive', async () => {
      await expect(loginPage.errorMessage).toHaveCount(0);
      await expect(loginPage.loginButton).toBeEnabled();
    });
  });
});

