import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import { parseMoney, sum, areClose } from '../../utils/priceUtils';
import { loginAsStandardUser } from '../../utils/session';
import type { ExpectedMessages } from '../../types/testData';

const expectedMessages = loadJsonData<ExpectedMessages>('test-data/expectedMessages.json');

test.describe('End-to-end purchase flow coverage', () => {
  test('ORD-TC-001 | @e2e @smoke @critical | user can complete purchase and return home', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    const selectedProducts = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    await test.step('Arrange: login and add products', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.expectLoaded();
      for (const product of selectedProducts) {
        await inventoryPage.addProductToCartByName(product);
      }
      await expect(await inventoryPage.getCartBadgeCount()).toBe(selectedProducts.length);
    });

    await test.step('Act: open cart and proceed to checkout', async () => {
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.clickCheckout();
      await checkoutInformationPage.expectLoaded();
      await checkoutInformationPage.fillInformation('John', 'Doe', '12345');
      await checkoutInformationPage.clickContinue();
      await checkoutOverviewPage.expectLoaded();
    });

    await test.step('Assert: overview values and totals are accurate', async () => {
      const itemNames = await checkoutOverviewPage.getItemNames();
      expect(itemNames).toEqual(selectedProducts);

      const linePrices = (await checkoutOverviewPage.getItemPriceTexts()).map(parseMoney);
      const expectedSubtotal = sum(linePrices);
      const actualSubtotal = parseMoney(await checkoutOverviewPage.getItemTotalText());
      const actualTax = parseMoney(await checkoutOverviewPage.getTaxText());
      const actualTotal = parseMoney(await checkoutOverviewPage.getTotalText());

      expect(areClose(actualSubtotal, expectedSubtotal)).toBeTruthy();
      expect(areClose(actualTotal, actualSubtotal + actualTax)).toBeTruthy();
    });

    await test.step('Act/Assert: finish order and return to inventory home', async () => {
      await checkoutOverviewPage.clickFinish();
      await checkoutCompletePage.expectLoaded();
      await expect(checkoutCompletePage.thankYouMessage).toHaveText(expectedMessages.orderSuccess);
      await checkoutCompletePage.clickBackHome();
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    });
  });
});

