import { test, expect } from "@playwright/test";

// The desktop "Programy" submenu used to open on :hover only, which left its
// links unreachable by keyboard (and inert on touch). It must open on focus.
test.describe("Desktop dropdown keyboard access", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("opens the programs submenu when its button receives focus", async ({
    page,
  }) => {
    await page.goto("/");

    const trigger = page
      .locator("[data-navbar-desktop] button", { hasText: "Programy" })
      .first();
    const dropdown = page
      .locator("[data-navbar-desktop] [data-navbar-dropdown]")
      .first();

    await expect(dropdown).toBeHidden();

    await trigger.focus();

    await expect(dropdown).toBeVisible();
    await expect(dropdown.getByRole("link").first()).toBeVisible();
  });

  test("submenu links are reachable with Tab", async ({ page }) => {
    await page.goto("/");

    const trigger = page
      .locator("[data-navbar-desktop] button", { hasText: "Programy" })
      .first();
    const dropdown = page
      .locator("[data-navbar-desktop] [data-navbar-dropdown]")
      .first();

    await trigger.focus();
    // The panel fades in; only once it is no longer `visibility: hidden` are
    // its links back in the tab order.
    await expect(dropdown).toBeVisible();

    await page.keyboard.press("Tab");

    const focusedHref = await page.evaluate(
      () => document.activeElement?.getAttribute("href") ?? "",
    );
    expect(focusedHref).toBe("/programy/pro-skoly");
  });
});
