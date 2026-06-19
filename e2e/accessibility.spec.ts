import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const CHARACTER_CARD = 'a[href^="/characters/"]';
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * axe-core in a real Chromium (against the MSW-mocked dev server). Unlike the
 * jsdom audit, this evaluates color contrast too. Violations are mapped to a
 * compact descriptor so failures read clearly in the report.
 */
test.describe('Accessibility (axe)', () => {
  test('characters list passes WCAG A/AA automated checks', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator(CHARACTER_CARD).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations.map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}`)).toEqual([]);
  });

  test('character detail passes WCAG A/AA automated checks', async ({ page }) => {
    await page.goto('/characters/1');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    expect(results.violations.map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}`)).toEqual([]);
  });
});
