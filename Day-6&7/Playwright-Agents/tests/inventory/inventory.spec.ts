import { test, expect } from '../../fixtures/testFixtures';
import { loginAsStandardUser } from '../../utils/session';

test.describe('Inventory module coverage', () => {
  test('INV-TC-001 | @regression @inventory @high | inventory shows product content fields', async ({ inventoryPage, loginPage }) => {
    await test.step('Arrange: log in with a valid user', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.expectLoaded();
    });

    await test.step('Assert: inventory card count and content visibility', async () => {
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
      await expect(inventoryPage.itemNames).toHaveCount(6);
      await expect(inventoryPage.itemDescriptions).toHaveCount(6);
      await expect(inventoryPage.itemPrices).toHaveCount(6);
      await expect(inventoryPage.itemImages).toHaveCount(6);
    });
  });
});

