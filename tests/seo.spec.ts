import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("should have correct title and description on home page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle('Domů | Telperion');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      "content",
      "Mladí učí o klimatu. Vzdělávací programy pro školy a veřejnost.",
    );

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", "Domů | Telperion");

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute(
      "content",
      "Mladí učí o klimatu. Vzdělávací programy pro školy a veřejnost.",
    );

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "website");
  });
});
