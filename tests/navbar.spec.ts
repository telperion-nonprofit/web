import { test, expect } from '@playwright/test';

test.describe('Navbar Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should toggle mobile menu and icons', async ({ page }) => {
    await page.goto('/');

    const menuBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    // Check initial state
    await expect(menuBtn).toBeVisible();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu).not.toBeVisible();

    // In SVG, paths might have different behavior with toBeVisible,
    // but Tailwind's hidden class sets display: none which Playwright respects.
    const hamburgerPath = menuBtn.locator('path').first();
    const closePath = menuBtn.locator('path').last();

    await expect(hamburgerPath).toBeVisible();
    await expect(closePath).not.toBeVisible();

    // Click to open
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(mobileMenu).toBeVisible();

    // Hamburger icon should now be hidden, Close icon should be visible
    await expect(hamburgerPath).not.toBeVisible();
    await expect(closePath).toBeVisible();

    // Click to close
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileMenu).not.toBeVisible();
    await expect(hamburgerPath).toBeVisible();
    await expect(closePath).not.toBeVisible();
  });
});
