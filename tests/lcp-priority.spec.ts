import { test, expect } from "@playwright/test";

test.describe('LCP Optimization', () => {
  test('should have fetchpriority="high" on the top-right leaves image', async ({ page }) => {
    await page.goto('/');

    const lcpImage = page.locator('div.absolute.top-0.right-0 img');

    await expect(lcpImage).toBeVisible();

    await expect(lcpImage).toHaveAttribute('fetchpriority', 'high');

    await expect(lcpImage).toHaveAttribute('loading', 'eager');
  });
});
