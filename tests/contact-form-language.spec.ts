import { test, expect } from "@playwright/test";

// The hidden `language` field is what tells us which language an enquiry came
// in. It used to be pinned to "cs" on every page.
test.describe("Contact form language field", () => {
  test("is cs on Czech pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#form-language")).toHaveValue("cs");
  });

  test("is en on English pages", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#form-language")).toHaveValue("en");
  });

  test("a stale zvoleny-jazyk value still wins", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("zvoleny-jazyk", "en");
    });
    await page.goto("/");
    await expect(page.locator("#form-language")).toHaveValue("en");
  });
});
