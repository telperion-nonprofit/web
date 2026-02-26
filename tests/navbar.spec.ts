import { test, expect } from '@playwright/test';

test.describe('Navbar Component', () => {

  // We reuse a page that includes the Navbar component
  // Using /test/layout-default as it's a minimal page with Layout
  const testUrl = '/test/layout-default';

  test.describe('Desktop View', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display desktop navigation and hide mobile menu button', async ({ page }) => {
      await page.goto(testUrl);

      // Verify desktop navigation is visible
      // The desktop nav has class "hidden md:block"
      // We can target it specifically or look for desktop-only content
      const desktopNav = page.locator('nav.hidden.md\\:block');
      await expect(desktopNav).toBeVisible();

      // Verify mobile menu button is hidden
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeHidden();

      // Verify mobile menu content is hidden
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeHidden();
    });
  });

  test.describe('Mobile View', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display mobile menu button and hide desktop navigation', async ({ page }) => {
      await page.goto(testUrl);

      // Verify desktop navigation is hidden
      const desktopNav = page.locator('nav.hidden.md\\:block');
      await expect(desktopNav).toBeHidden();

      // Verify mobile menu button is visible
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeVisible();

      // Verify mobile menu content is hidden initially
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toBeHidden();
    });

    test('should toggle mobile menu visibility and icon on click', async ({ page }) => {
      await page.goto(testUrl);

      const mobileBtn = page.locator('#mobile-menu-btn');
      const mobileMenu = page.locator('#mobile-menu');
      const iconPath = mobileBtn.locator('svg path');

      // Initial state: Menu hidden, Hamburger icon
      await expect(mobileMenu).toBeHidden();
      // Hamburger icon path d attribute starts with "M4 6h16"
      await expect(iconPath).toHaveAttribute('d', 'M4 6h16M4 12h16M4 18h16');

      // Click to open
      await mobileBtn.click();

      // Check state: Menu visible, Close icon
      await expect(mobileMenu).toBeVisible();
      // Close icon path d attribute starts with "M6 18L18 6"
      await expect(iconPath).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');

      // Click to close
      await mobileBtn.click();

      // Check state: Menu hidden, Hamburger icon
      await expect(mobileMenu).toBeHidden();
      await expect(iconPath).toHaveAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
  });
});
