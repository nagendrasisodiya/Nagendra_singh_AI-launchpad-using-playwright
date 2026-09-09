import { test, expect } from '../../fixtures/testFixtures';
import { loginAsStandardUser } from '../../utils/session';

test.describe('Menu and navigation coverage', () => {
  test('NAV-TC-001 | @regression @navigation @high | reset app state clears cart and item selection', async ({
    loginPage,
    inventoryPage,
    menuComponent,
    cartPage,
  }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    await test.step('Arrange: login and add products to cart', async () => {
      await loginAsStandardUser(loginPage);
      for (const product of products) {
        await inventoryPage.addProductToCartByName(product);
      }
      await expect(await inventoryPage.getCartBadgeCount()).toBe(2);
    });

    await test.step('Act: open menu and reset app state', async () => {
      await menuComponent.openMenu();
      await menuComponent.resetAppState();
      await menuComponent.closeMenu();
    });

    await test.step('Assert: cart badge and cart items are reset', async () => {
      await expect(await inventoryPage.getCartBadgeCount()).toBe(0);
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
      await expect(await cartPage.getItemCount()).toBe(0);
    });
  });
});

