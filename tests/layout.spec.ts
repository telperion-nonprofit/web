import { test, expect } from '@playwright/test';

test.describe('Layout Component', () => {
  test('should render with default title when no title prop is provided', async ({ page }) => {
    await page.goto('/test/layout-default');

    // Check the title
    await expect(page).toHaveTitle('| Telperion');

    // Check the language attribute
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');

    // Check the slot content
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText('Default Layout Content');
  });

  test('should render with custom title when title prop is provided', async ({ page }) => {
    await page.goto('/test/layout-custom');

    // Check the title
    await expect(page).toHaveTitle('Test Title | Telperion');

    // Check the language attribute
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');

    // Check the slot content
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText('Custom Layout Content');
  });

  test('should have lazy loading on footer image', async ({ page }) => {
    await page.goto('/test/layout-default');
    const footerImage = page.locator('div.absolute.bottom-0 img');
    await expect(footerImage).toHaveAttribute('loading', 'lazy');
  });
});
