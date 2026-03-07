import { test, expect } from "@playwright/test";

test.describe("Footer Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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

  test('should have hover transition effect', async ({ page }) => {
    const footerContent = page.locator('footer div.glass-card');
    await expect(footerContent).toHaveClass(/hover:-translate-y-1/);
    await expect(footerContent).toHaveClass(/duration-300/);
    await expect(footerContent).toHaveClass(/transition-transform/);
  });
});
