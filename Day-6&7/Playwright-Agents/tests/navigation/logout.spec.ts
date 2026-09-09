import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import { loginAsStandardUser } from '../../utils/session';
import type { ExpectedMessages } from '../../types/testData';

const expectedMessages = loadJsonData<ExpectedMessages>('test-data/expectedMessages.json');

test.describe('Logout and session handling coverage', () => {
  test('SES-TC-001 | @smoke @regression @authentication @critical | logout blocks direct access to protected route', async ({
    loginPage,
    inventoryPage,
    menuComponent,
    page,
  }) => {
    await test.step('Arrange: login and confirm authenticated page', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.expectLoaded();
    });

    await test.step('Act: logout and then navigate directly to inventory route', async () => {
      await menuComponent.openMenu();
      await menuComponent.logout();
      await expect(page).toHaveURL(/\/$/);
      await page.goto('/inventory.html');
    });

    await test.step('Assert: protected route access is denied after logout', async () => {
      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.errorMessage).toHaveText(expectedMessages.protectedRoute);
    });
  });

  test('SES-TC-002 | @regression @authentication @high | browser back does not restore authenticated inventory page', async ({
    loginPage,
    inventoryPage,
    menuComponent,
    page,
  }) => {
    await test.step('Arrange: login and logout', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.expectLoaded();
      await menuComponent.openMenu();
      await menuComponent.logout();
      await expect(page).toHaveURL(/\/$/);
    });

    await test.step('Act: navigate back in browser history', async () => {
      await page.goBack();
    });

    await test.step('Assert: user remains unauthenticated', async () => {
      await expect(page).toHaveURL(/\/$/);
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});

