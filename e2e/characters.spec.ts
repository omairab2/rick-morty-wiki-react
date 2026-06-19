import { expect, test } from '@playwright/test';

/**
 * These run against `pnpm dev`, which talks to the real Rick & Morty API
 * (MSW is only enabled when VITE_ENABLE_MSW=true). Assertions are therefore
 * written to be resilient to the live data set — they check structure and
 * behaviour, never specific names or exact counts.
 */

const CHARACTER_CARD = 'a[href^="/characters/"]';
// Matches the results count in both forms: "2 characters found" and the
// singular "1 character found" the count collapses to when one result remains.
const RESULTS_COUNT_TEXT = /characters? found/i;

test.describe('Characters', () => {
  test('loads the character list and shows cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: /rick & morty wiki/i })).toBeVisible();

    const cards = page.locator(CHARACTER_CARD);
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(1);

    // The results count summarizes the catalogue.
    await expect(page.getByText(RESULTS_COUNT_TEXT)).toBeVisible();
  });

  test('filters by name and reflects the query in the URL', async ({ page }) => {
    await page.goto('/');

    const resultsCount = page.getByText(RESULTS_COUNT_TEXT);
    await expect(resultsCount).toBeVisible();
    const unfilteredCount = await resultsCount.textContent();

    await page.getByRole('searchbox', { name: /search characters by name/i }).fill('rick');

    // The search box is debounced into the URL as ?name=rick.
    await expect(page).toHaveURL(/[?&]name=rick\b/);

    // The result set narrows: the count changes and cards are still shown.
    // Allow extra time — this waits on the debounced URL write plus a live API
    // refetch (keepPreviousData holds the old count until the response lands).
    await expect(resultsCount).not.toHaveText(unfilteredCount ?? '', { timeout: 15_000 });
    await expect(page.locator(CHARACTER_CARD).first()).toBeVisible();
  });

  test('opens a character detail and the breadcrumb returns to the filtered list', async ({
    page,
  }) => {
    await page.goto('/?name=rick');

    const firstCard = page.locator(CHARACTER_CARD).first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // We are on a detail route, with the back breadcrumb visible.
    await expect(page).toHaveURL(/\/characters\/\d+/);
    const breadcrumb = page.getByRole('link', { name: /back to characters/i });
    await expect(breadcrumb).toBeVisible();

    await breadcrumb.click();

    // Back on the list, with the name filter preserved.
    await expect(page).toHaveURL(/[?&]name=rick\b/);
    await expect(page.getByRole('heading', { level: 1, name: /rick & morty wiki/i })).toBeVisible();
  });
});
