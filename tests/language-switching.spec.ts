import { test, expect } from "@playwright/test";

test.describe("Language Switching Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("should switch from Czech home to English home via language dropdown", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile === true, "Desktop language dropdown is not visible on mobile");
    await page.goto("/");

    await expect(page).toHaveTitle(/Domů \| Telperion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "cs-CZ");

    // Open the language dropdown
    const dropdown = page.locator(
      "header .language-dropdown-container button.language-toggle",
    );
    await dropdown.first().click();

    // Click the English link
    const enLink = page
      .locator("header .language-dropdown-container .language-menu")
      .first()
      .getByRole("menuitem", { name: "English" });
    await enLink.click();

    // Verify we're on the English page
    await expect(page).toHaveTitle(/Home \| Telperion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("should display Czech content on default locale pages", async ({
    page,
  }) => {
    await page.goto("/kontakty");

    await expect(page).toHaveTitle(/Náš tým a Kontakty \| Telperion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "cs-CZ");
  });

  test("should display English content on /en/ pages", async ({ page }) => {
    await page.goto("/en/");

    await expect(page).toHaveTitle(/Home \| Telperion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("should have correct hreflang alternate links on home page", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for hreflang alternate link pointing to English version
    const enAlternate = page.locator(
      'link[rel="alternate"][hreflang="en"]',
    );
    await expect(enAlternate).toHaveCount(1);
  });
});
