import { test, expect } from "@playwright/test";

test.describe("Navbar Logo Optimization", () => {
  test('should have fetchpriority="high" and loading="eager" on the navbar logo', async ({
    page,
  }) => {
    await page.goto("/");

    const navbarLogo = page.locator('header img[alt="Telperion Logo"]');

    await expect(navbarLogo).toBeVisible();

    await expect(navbarLogo).toHaveAttribute('fetchpriority', 'high');
    await expect(navbarLogo).toHaveAttribute('loading', 'eager');
  });
});
