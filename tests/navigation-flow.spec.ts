import { test, expect } from "@playwright/test";

test.describe("Multi-Page Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("should navigate from home to programs via navbar dropdown", async ({
    page,
    browserName,
    isMobile,
  }) => {
    test.skip(
      browserName === "firefox" || browserName === "webkit",
      "Headless Firefox/WebKit ignore CSS group-hovers",
    );
    test.skip(isMobile === true, "Desktop navigation is not visible on mobile");
    await page.goto("/");

    const nav = page.locator("nav.hidden.lg\\:flex");
    const programyButton = nav.getByRole("button", { name: "Programy" });
    await programyButton.hover();

    const schoolsLink = nav.getByRole("link", { name: "Pro školy" });
    await expect(schoolsLink).toBeVisible();
    await schoolsLink.click();

    await expect(page).toHaveURL(/\/programy\/pro-skoly/);
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible();
  });

  test("should navigate between main pages and back", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile === true, "Desktop navigation is not visible on mobile");
    // Start at home
    await page.goto("/");
    await expect(page).toHaveTitle(/Domů \| Telperion/);

    // Go to contacts
    const contactLink = page
      .locator("nav.hidden.lg\\:flex")
      .getByRole("link", { name: "Kontakt" });
    await contactLink.click();
    await expect(page).toHaveURL(/\/kontakty/);
    await expect(page).toHaveTitle(/Náš tým a Kontakty \| Telperion/);

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveTitle(/Domů \| Telperion/);
  });

  test("should navigate to 404 page for invalid URLs", async ({ page }) => {
    const response = await page.goto("/neexistujici-stranka");
    expect(response?.status()).toBe(404);

    // Verify navigation back to home works from 404
    const homeLink = page.getByRole("link", {
      name: "Zpět na hlavní stránku",
    });
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    await expect(page).toHaveURL("/");
  });
});
