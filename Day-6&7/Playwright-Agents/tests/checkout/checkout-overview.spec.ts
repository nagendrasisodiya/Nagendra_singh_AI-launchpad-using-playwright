import { test, expect } from '../../fixtures/testFixtures';
import { parseMoney, sum, areClose } from '../../utils/priceUtils';
import { loginAsStandardUser } from '../../utils/session';

test.describe('Checkout overview module coverage', () => {
  test('CHKOVR-TC-001 | @regression @checkout @critical | verify subtotal, tax, and total calculations', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    const selectedProducts = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    await test.step('Arrange: reach checkout overview with known products', async () => {
      await loginAsStandardUser(loginPage);
      for (const product of selectedProducts) {
        await inventoryPage.addProductToCartByName(product);
      }
      await inventoryPage.openCart();
      await cartPage.clickCheckout();
      await checkoutInformationPage.fillInformation('John', 'Doe', '12345');
      await checkoutInformationPage.clickContinue();
      await checkoutOverviewPage.expectLoaded();
    });

    await test.step('Assert: selected products and quantities are correct', async () => {
      const itemNames = await checkoutOverviewPage.getItemNames();
      expect(itemNames).toEqual(selectedProducts);

      const quantities = await checkoutOverviewPage.getItemQuantities();
      expect(quantities).toEqual(['1', '1']);
    });

    await test.step('Assert: item total, tax, and final total are accurate', async () => {
      const linePrices = (await checkoutOverviewPage.getItemPriceTexts()).map(parseMoney);
      const expectedItemTotal = sum(linePrices);

      const itemTotal = parseMoney(await checkoutOverviewPage.getItemTotalText());
      const tax = parseMoney(await checkoutOverviewPage.getTaxText());
      const total = parseMoney(await checkoutOverviewPage.getTotalText());

      expect(areClose(itemTotal, expectedItemTotal)).toBeTruthy();
      expect(areClose(total, itemTotal + tax)).toBeTruthy();
    });
  });
});

