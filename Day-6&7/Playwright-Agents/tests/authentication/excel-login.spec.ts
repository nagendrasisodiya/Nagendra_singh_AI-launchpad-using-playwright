import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import { EXCEL_LOGIN_CREDENTIALS_FILE, loadExcelLoginCredentialRows } from '../../utils/excelLoginDataLoader';
import { logExcelLoginScenario } from '../../utils/excelLoginLogger';
import type { ExpectedMessages } from '../../types/testData';

const expectedMessages = loadJsonData<ExpectedMessages>('test-data/expectedMessages.json');
const loginRows = loadExcelLoginCredentialRows();

test.describe('Authentication | Excel-driven login validation', () => {
  for (const [index, credential] of loginRows.entries()) {
    const testCaseId = `EXCEL-AUTH-TC-${String(index + 1).padStart(3, '0')}`;
    const shouldSucceed = credential.username !== 'locked_out_user';

    test(`${testCaseId} | ${credential.userType} | ${credential.username}`, async ({ page, loginPage, inventoryPage }) => {
      await test.step('Arrange: open login page from the Excel-backed auth suite', async () => {
        logExcelLoginScenario({
          testCaseId,
          username: credential.username,
          userType: credential.userType,
          password: credential.password,
          workbookFile: EXCEL_LOGIN_CREDENTIALS_FILE,
        });

        await loginPage.goto();
        await loginPage.expectLoaded();
      });

      await test.step('Act: submit the credentials from the Excel sheet', async () => {
        await loginPage.login(credential.username, credential.password);
      });

      await test.step('Assert: verify the expected login outcome', async () => {
        if (shouldSucceed) {
          await expect(page).toHaveURL(/\/inventory\.html$/);
          await inventoryPage.expectLoaded();
          return;
        }

        await expect(page).toHaveURL(/\/$/);
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(expectedMessages.lockedOutUser);
      });
    });
  }
});

