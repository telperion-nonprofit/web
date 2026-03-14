import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the footer with correct copyright text", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    const currentYear = new Date().getFullYear().toString();
    const copyrightText = footer.locator("p");

    await expect(copyrightText).toContainText(currentYear);
    await expect(copyrightText).toContainText("Telperion z.s");
  });

  test("should have the glass-card styling class", async ({ page }) => {
    const glassCard = page.locator("footer .glass-card");
    await expect(glassCard).toBeVisible();

    await expect(glassCard).toHaveClass(/glass-card/);
  });

  test("should have social icons", async ({ page }) => {
    const footerContent = page.locator("footer div.glass-card");
    const instagramIcon = footerContent.locator('a[aria-label="Instagram"]');
    const youtubeIcon = footerContent.locator('a[aria-label="YouTube"]');

    await expect(instagramIcon).toBeVisible();
    await expect(youtubeIcon).toBeVisible();

    await expect(instagramIcon).toHaveClass(/hover:text-brand-green/);
    await expect(youtubeIcon).toHaveClass(/hover:text-brand-green/);
  });
});
