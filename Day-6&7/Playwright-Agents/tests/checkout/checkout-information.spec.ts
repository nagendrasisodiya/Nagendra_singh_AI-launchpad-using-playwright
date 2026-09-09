import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import { loginAsStandardUser } from '../../utils/session';
import type { CheckoutInfoData, ExpectedMessages } from '../../types/testData';

const checkoutData = loadJsonData<CheckoutInfoData[]>('test-data/checkoutData.json').filter((item) => item.enabled);
const expectedMessages = loadJsonData<ExpectedMessages>('test-data/expectedMessages.json');

async function navigateToCheckoutInformation(
  loginAction: () => Promise<void>,
  addItem: () => Promise<void>,
  openCart: () => Promise<void>,
  clickCheckout: () => Promise<void>,
): Promise<void> {
  await loginAction();
  await addItem();
  await openCart();
  await clickCheckout();
}

test.describe('Checkout information module coverage', () => {
  for (const data of checkoutData) {
    test(`${data.testCaseId} | ${data.tags.join(' ')} | ${data.description}`, async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutInformationPage,
      page,
    }) => {
      await test.step('Arrange: login and navigate to checkout information', async () => {
        await navigateToCheckoutInformation(
          () => loginAsStandardUser(loginPage),
          () => inventoryPage.addProductToCartByName('Sauce Labs Backpack'),
          () => inventoryPage.openCart(),
          () => cartPage.clickCheckout(),
        );
        await checkoutInformationPage.expectLoaded();
      });

      await test.step('Act: submit checkout information', async () => {
        await checkoutInformationPage.fillInformation(data.firstName, data.lastName, data.postalCode);
        await checkoutInformationPage.clickContinue();
      });

      await test.step('Assert: expected navigation or validation message', async () => {
        await expect(page).toHaveURL(new RegExp(`${data.expectedUrlPath.replace('/', '\\/')}$`));

        if (data.expectedErrorKey) {
          await expect(checkoutInformationPage.errorMessage).toHaveText(expectedMessages[data.expectedErrorKey]);
        }
      });
    });
  }
});

