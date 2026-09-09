import { test, expect } from '../../fixtures/testFixtures';
import { loginAsStandardUser } from '../../utils/session';
import { loadJsonData } from '../../utils/dataLoader';
import { parseMoney } from '../../utils/priceUtils';
import type { SortingScenarioData } from '../../types/testData';

const sortingData = loadJsonData<SortingScenarioData[]>('test-data/sortingData.json').filter((item) => item.enabled);

function sortedNames(values: string[], direction: 'asc' | 'desc'): string[] {
  const copy = [...values];
  return copy.sort((a, b) =>
    direction === 'asc' ? a.localeCompare(b, undefined, { sensitivity: 'base' }) : b.localeCompare(a, undefined, { sensitivity: 'base' }),
  );
}

function sortedPrices(values: number[], direction: 'asc' | 'desc'): number[] {
  const copy = [...values];
  return copy.sort((a, b) => (direction === 'asc' ? a - b : b - a));
}

test.describe('Product sorting module coverage', () => {
  for (const scenario of sortingData) {
    test(`${scenario.testCaseId} | ${scenario.tags.join(' ')} | ${scenario.description}`, async ({ inventoryPage, loginPage }) => {
      await test.step('Arrange: login and open inventory', async () => {
        await loginAsStandardUser(loginPage);
        await inventoryPage.expectLoaded();
      });

      await test.step('Act: apply sort option', async () => {
        await inventoryPage.selectSortOption(scenario.sortOption);
      });

      await test.step('Assert: compare UI order against independently sorted values', async () => {
        if (scenario.comparator.startsWith('alpha')) {
          const actualNames = await inventoryPage.getVisibleProductNames();
          const expected = sortedNames(actualNames, scenario.comparator.endsWith('asc') ? 'asc' : 'desc');
          expect(actualNames).toEqual(expected);
          return;
        }

        const actualPriceTexts = await inventoryPage.getVisibleProductPrices();
        const actualPrices = actualPriceTexts.map(parseMoney);
        const expected = sortedPrices(actualPrices, scenario.comparator.endsWith('asc') ? 'asc' : 'desc');
        expect(actualPrices).toEqual(expected);
      });
    });
  }
});

