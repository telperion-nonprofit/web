import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('should have correct title and description on home page', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle('Domů | Telperion');

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', 'Informujeme o tématech spojených s životním prostředím. Vzděláváme a přibližujeme udržitelný způsob života mladé generaci.');

    // OG tags are not currently implemented in Layout.astro, so skipping checks.
  });
});
