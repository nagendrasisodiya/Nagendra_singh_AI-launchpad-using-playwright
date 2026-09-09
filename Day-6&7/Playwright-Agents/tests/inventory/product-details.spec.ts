import { test, expect } from '../../fixtures/testFixtures';
import { loginAsStandardUser } from '../../utils/session';

test.describe('Product details module coverage', () => {
  test('INV-TC-002 | @regression @inventory @medium | user can open and validate product details', async ({
    inventoryPage,
    productDetailsPage,
    loginPage,
    page,
  }) => {
    const productName = 'Sauce Labs Backpack';

    await test.step('Arrange: log in and open selected product', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.expectLoaded();
      await inventoryPage.openProductDetailsByName(productName);
      await productDetailsPage.expectLoaded();
    });

    await test.step('Assert: selected product details match expected product', async () => {
      await expect(productDetailsPage.name).toHaveText(productName);
      await expect(productDetailsPage.description).toBeVisible();
      await expect(productDetailsPage.price).toContainText('$');
    });

    await test.step('Act/Assert: navigate back to inventory', async () => {
      await productDetailsPage.goBackToProducts();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.productsTitle).toBeVisible();
    });
  });
});

