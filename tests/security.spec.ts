import { test, expect } from "@playwright/test";

test("should not expose generator meta tag", async ({ page }) => {
  await page.goto("/");
  const generatorMeta = page.locator('meta[name="generator"]');
  await expect(generatorMeta).toHaveCount(0);
});
