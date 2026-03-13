import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("should have correct title and description on home page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Domů | Telperion");

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

  test("production sitemap should exclude QA and 404 URLs", async ({
    request,
  }) => {
    const response = await request.get("/sitemap-0.xml");

    test.skip(
      response.status() === 404,
      "Sitemap is generated only for build/preview, not astro dev.",
    );

    expect(response.ok()).toBeTruthy();
    const xml = await response.text();

    expect(xml).not.toContain("/test/");
    expect(xml).not.toContain("/404/");
    expect(xml).not.toContain("/en/404/");
  });
});
