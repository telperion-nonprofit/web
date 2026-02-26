import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('should have correct title and description on home page', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle('Domů | Telperion');

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', 'Informujeme o tématech spojených s životním prostředím. Vzděláváme a přibližujeme udržitelný způsob života mladé generaci.');

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', 'Domů | Telperion');

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', 'Informujeme o tématech spojených s životním prostředím. Vzděláváme a přibližujeme udržitelný způsob života mladé generaci.');

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
  });
});
