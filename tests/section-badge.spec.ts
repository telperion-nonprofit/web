import { test, expect } from "@playwright/test";

test.describe("SectionBadge Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/section-badge");
  });

  test("should render correctly with default slot content", async ({
    page,
  }) => {
    const badge = page.getByTestId("badge-default");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText("Default Badge");
  });

  test("should have the expected default CSS classes", async ({ page }) => {
    const badge = page.getByTestId("badge-default");

    // Check for presence of key styling classes.
    // toHaveClass expects a full match if it's a string,
    // so we use regex to check if specific classes are contained within the class list.
    await expect(badge).toHaveClass(/.*inline-block.*/);
    await expect(badge).toHaveClass(/.*rounded-full.*/);
    await expect(badge).toHaveClass(/.*glass-card.*/);
    await expect(badge).toHaveClass(/.*text-dark-green.*/);
  });

  test("should merge custom classes correctly", async ({ page }) => {
    const badge = page.getByTestId("badge-custom-class");
    await expect(badge).toHaveClass(/.*custom-class.*/);
    // Should still have default classes
    await expect(badge).toHaveClass(/.*inline-block.*/);
  });

  test("should pass through additional attributes", async ({ page }) => {
    const badge = page.getByTestId("badge-with-id");
    await expect(badge).toHaveId("badge-with-id");
  });

  test("should handle complex slot content", async ({ page }) => {
    const badge = page.getByTestId("badge-complex-slot");
    await expect(badge.locator("span")).toHaveText("Complex");
    await expect(badge.locator("strong")).toHaveText("Slot");
  });
});
