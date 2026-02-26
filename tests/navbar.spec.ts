import { test, expect } from '@playwright/test';

test('Mobile menu toggles correctly and updates icon', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');

  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });

  const menuButton = page.locator('#mobile-menu-btn');
  const menu = page.locator('#mobile-menu');

  // Define the paths for the icons
  const hamburgerPath = "M4 6h16M4 12h16M4 18h16";
  const closePath = "M6 18L18 6M6 6l12 12";

  // Check initial state: menu hidden, hamburger icon visible
  await expect(menu).not.toBeVisible();

  // Verify hamburger icon is visible (using separate elements approach)
  // We'll look for an svg that contains the path and check its visibility
  const hamburgerIcon = menuButton.locator(`svg:has(path[d="${hamburgerPath}"])`);
  const closeIcon = menuButton.locator(`svg:has(path[d="${closePath}"])`);

  // Wait for the button to be interactive
  await expect(menuButton).toBeVisible();

  // Initial check - Hamburger should be visible
  await expect(hamburgerIcon).toBeVisible();
  // Close icon should be hidden (or not present if not yet implemented, but this test is for TDD)
  await expect(closeIcon).not.toBeVisible();

  // Click to open menu
  await menuButton.click();

  // Verify menu is visible
  await expect(menu).toBeVisible();

  // Verify hamburger icon is hidden
  await expect(hamburgerIcon).not.toBeVisible();
  // Verify close icon is visible
  await expect(closeIcon).toBeVisible();

  // Click to close menu
  await menuButton.click();

  // Verify menu is hidden again
  await expect(menu).not.toBeVisible();

  // Verify icons revert to initial state
  await expect(hamburgerIcon).toBeVisible();
  await expect(closeIcon).not.toBeVisible();
});
