import { test, expect } from '@playwright/test';

test.describe('Navbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display desktop menu on large screens', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Check for desktop nav
    const desktopNav = page.locator('nav.hidden.md\\:block');
    await expect(desktopNav).toBeVisible();

    // Check for specific menu items
    await expect(desktopNav.getByText('Domů')).toBeVisible();
    await expect(desktopNav.getByText('Programy')).toBeVisible();
    await expect(desktopNav.getByText('Podcast')).toBeVisible();
    await expect(desktopNav.getByText('Kontakty')).toBeVisible();
  });

  test('should display mobile menu button on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check for mobile menu button
    const mobileBtn = page.locator('#mobile-menu-btn');
    await expect(mobileBtn).toBeVisible();

    // Check that desktop menu is hidden
    const desktopNav = page.locator('nav.hidden.md\\:block');
    await expect(desktopNav).toBeHidden();
  });

  test('mobile menu should toggle visibility', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileBtn = page.locator('#mobile-menu-btn');
    const mobileMenu = page.locator('#mobile-menu');

    // Initially hidden
    await expect(mobileMenu).toBeHidden();

    // Click to open
    await mobileBtn.click();
    await expect(mobileMenu).toBeVisible();

    // Check for menu items in mobile menu
    // Note: The mobile menu renders items slightly differently, so we check specifically within #mobile-menu
    await expect(mobileMenu.getByText('Domů')).toBeVisible();
    await expect(mobileMenu.getByText('Programy')).toBeVisible();

    // Click to close
    await mobileBtn.click();
    await expect(mobileMenu).toBeHidden();
  });
});
