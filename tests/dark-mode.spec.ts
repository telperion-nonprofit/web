import { test, expect } from "@playwright/test";

// Dark mode is deliberately switched off ("temporary theme lockdown" in
// Layout.astro, ThemeToggle is commented out of the navbar). These tests pin
// that contract down so re-enabling it is a conscious change rather than an
// accident.
test.describe("Theme lockdown (dark mode disabled)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("stays in light mode even when the OS prefers dark", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("clears a stale dark class left in localStorage", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });
    await page.goto("/");

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("exposes no theme toggle control", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".theme-toggle-btn")).toHaveCount(0);
  });
});
