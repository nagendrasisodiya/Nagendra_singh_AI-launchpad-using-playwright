import { getEnv } from '../../utils/environment';
import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import type { ExpectedMessages, LoginScenarioData } from '../../types/testData';

const loginData = loadJsonData<LoginScenarioData[]>('test-data/loginData.json').filter((item) => item.enabled);
const expectedMessages = loadJsonData<ExpectedMessages>('test-data/expectedMessages.json');

test.describe('Authentication | Data-driven credential validation', () => {
  for (const scenario of loginData) {
    test(`${scenario.testCaseId} | ${scenario.tags.join(' ')} | ${scenario.description}`, async ({ page, loginPage, inventoryPage }) => {
      const runtimePassword =
        scenario.password.trim().length > 0 ? scenario.password : getEnv('SAUCE_PASSWORD', 'secret_sauce');

      await test.step('Arrange: open login page', async () => {
        await loginPage.goto();
        await loginPage.expectLoaded();
      });

      await test.step('Act: submit credentials', async () => {
        await loginPage.login(scenario.username, runtimePassword);
      });

      await test.step('Assert: verify expected route and outcome', async () => {
        if (scenario.expectedErrorKey) {
          await expect(page).toHaveURL(new RegExp(`${scenario.expectedUrlPath.replace('/', '\\/')}$`));
          await expect(loginPage.errorMessage).toBeVisible();
          // @ts-ignore
          await expect(loginPage.errorMessage).toHaveText(expectedMessages[scenario.expectedErrorKey]);
          return;
        }

        await expect(page).toHaveURL(new RegExp(`${scenario.expectedUrlPath.replace('/', '\\/')}$`));
        await inventoryPage.expectLoaded();
      });
    });
  }
});

