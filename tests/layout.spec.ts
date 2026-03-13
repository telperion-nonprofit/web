import { test, expect } from "@playwright/test";

test.describe("Layout Component", () => {
  test("should render with default title when no title prop is provided", async ({
    page,
  }) => {
    await page.goto("/test/layout-default");

    await expect(page).toHaveTitle("Telperion");

    await expect(page.locator("html")).toHaveAttribute("lang", "cs");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Default Layout Content");
  });

  test("should render with custom title when title prop is provided", async ({
    page,
  }) => {
    // We test against an actual page with a custom title instead of a test route.
    await page.goto("/kontakty");

    await expect(page).toHaveTitle("Náš tým a Kontakty | Telperion");

    await expect(page.locator("html")).toHaveAttribute("lang", "cs");
  });

  test("should have eager loading on bottom image", async ({ page }) => {
    await page.goto("/test/layout-default");
    const footerImage = page.locator("div.absolute.bottom-0 img");
    await expect(footerImage).toHaveAttribute("loading", "eager");
  });
});
