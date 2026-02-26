import { test, expect } from '@playwright/test';

test.describe('LCP Optimization', () => {
  test('should have fetchpriority="high" on the top-right leaves image', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Locate the top-right leaves image
    // The container has classes: absolute top-0 right-0 ...
    const lcpImage = page.locator('div.absolute.top-0.right-0 img');

    // Check if the element exists
    await expect(lcpImage).toBeVisible();

    // Check for fetchpriority="high"
    await expect(lcpImage).toHaveAttribute('fetchpriority', 'high');

    // Check for loading="eager" (optional but good for LCP)
    await expect(lcpImage).toHaveAttribute('loading', 'eager');
  });
});
