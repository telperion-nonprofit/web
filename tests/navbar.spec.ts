import { test, expect } from '@playwright/test';

test.describe('Navbar Mobile Menu', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

  test('should toggle mobile menu and icons', async ({ page }) => {
    await page.goto('/');

    const menuBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');
    const menuIcon = page.locator('#menu-icon-open');
    const closeIcon = page.locator('#menu-icon-close');

    // Initial state
    await expect(mobileMenu).toBeHidden();

    // Check initial icon visibility
    await expect(menuIcon).toBeVisible();
    await expect(closeIcon).toBeHidden();

    // Click to open
    await menuBtn.click();
    await expect(mobileMenu).toBeVisible();

    // Check icon visibility after open
    await expect(menuIcon).toBeHidden();
    await expect(closeIcon).toBeVisible();

    // Click to close
    await menuBtn.click();
    await expect(mobileMenu).toBeHidden();

    // Check icon visibility after close
    await expect(menuIcon).toBeVisible();
    await expect(closeIcon).toBeHidden();
  });
});
