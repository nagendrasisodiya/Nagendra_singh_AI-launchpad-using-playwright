import { test, expect } from '../../fixtures/testFixtures';
import { loadJsonData } from '../../utils/dataLoader';
import { loginAsStandardUser } from '../../utils/session';
import type { ProductSelectionData } from '../../types/testData';

type ProductDataFile = {
  singleProduct: ProductSelectionData;
  multipleProducts: ProductSelectionData;
};

const productData = loadJsonData<ProductDataFile>('test-data/productData.json');

test.describe('Cart module coverage', () => {
  test('CART-TC-001 | @smoke @cart @critical | add single product and verify cart details', async ({
    inventoryPage,
    cartPage,
    loginPage,
  }) => {
    const [productName] = productData.singleProduct.productNames;

    await test.step('Arrange: login and add one product from inventory', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.addProductToCartByName(productName);
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
    });

    await test.step('Assert: cart badge and item details match selected product', async () => {
      await expect(await cartPage.hasItem(productName)).toBeTruthy();
      await expect(await cartPage.getItemQuantity(productName)).toBe('1');
      await expect(await cartPage.getItemPrice(productName)).toContain('$');
      await expect(await cartPage.getCartBadgeCount()).toBe(1);
    });
  });

  test('CART-TC-002 | @regression @cart @high | remove product from cart updates content and badge', async ({
    inventoryPage,
    cartPage,
    loginPage,
  }) => {
    const names = productData.multipleProducts.productNames;

    await test.step('Arrange: login and add multiple products', async () => {
      await loginAsStandardUser(loginPage);
      for (const name of names) {
        await inventoryPage.addProductToCartByName(name);
      }
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
    });

    await test.step('Act: remove one product from cart', async () => {
      await cartPage.removeItemByName(names[0]);
    });

    await test.step('Assert: cart reflects removal and badge decrements', async () => {
      await expect(await cartPage.hasItem(names[0])).toBeFalsy();
      await expect(await cartPage.getCartBadgeCount()).toBe(names.length - 1);
    });
  });

  test('CART-TC-003 | @regression @cart @medium | continue shopping returns to inventory', async ({
    inventoryPage,
    cartPage,
    loginPage,
    page,
  }) => {
    await test.step('Arrange: login and open cart page', async () => {
      await loginAsStandardUser(loginPage);
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
    });

    await test.step('Act: click continue shopping', async () => {
      await cartPage.clickContinueShopping();
    });

    await test.step('Assert: user is redirected to inventory page', async () => {
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await inventoryPage.expectLoaded();
    });
  });
});

