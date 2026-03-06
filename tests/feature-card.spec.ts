import { test, expect } from '@playwright/test';

test.describe('FeatureCard Component', () => {
  test('should render correctly with provided props and slot content', async ({ page }) => {
    await page.goto('/test-feature-card');

    // Test first card
    const card1 = page.getByTestId('feature-card-1');
    await expect(card1).toBeVisible();
    await expect(card1.locator('h3')).toHaveText('Test Title 1');
    await expect(card1).toContainText('This is the first test description.');

    // Check if the icon is rendered (astro-icon renders an svg)
    const icon1 = card1.locator('svg');
    await expect(icon1).toBeVisible();
    // In astro-icon/components, the icon name might be used in some attributes if it's not optimized away
    // but just checking for an svg inside the expected div is a good start.

    // Test second card
    const card2 = page.getByTestId('feature-card-2');
    await expect(card2).toBeVisible();
    await expect(card2.locator('h3')).toHaveText('Test Title 2');
    await expect(card2).toContainText('This is the second test description with different content.');

    const icon2 = card2.locator('svg');
    await expect(icon2).toBeVisible();
  });

  test('should have the expected CSS classes for styling', async ({ page }) => {
    await page.goto('/test-feature-card');

    const card1 = page.getByTestId('feature-card-1');

    // Check for some of the glassmorphism and layout classes
    await expect(card1).toHaveClass(/glass-card/);
    await expect(card1).toHaveClass(/rounded-3xl/);
    // Note: Since `glass-card` encapsulates bg-cream/40 and backdrop-blur-sm, we just check for `glass-card`.
  });
});
