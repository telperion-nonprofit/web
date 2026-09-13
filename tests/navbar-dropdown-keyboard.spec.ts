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

  test("keeps the submenu open while focus is inside it", async ({ page }) => {
    await page.goto("/");

    const trigger = page
      .locator("[data-navbar-desktop] button", { hasText: "Programy" })
      .first();
    const dropdown = page
      .locator("[data-navbar-desktop] [data-navbar-dropdown]")
      .first();

    await trigger.focus();
    await expect(dropdown).toBeVisible();

    // Deliberately not asserting a Tab index: WebKit leaves links out of the
    // sequential focus order unless full keyboard access is turned on, which is
    // a browser setting affecting every link on the site. What this fix owns is
    // that the panel is no longer `visibility: hidden` — so its links can take
    // focus — and that focus landing on one keeps the panel open.
    const firstLink = dropdown.getByRole("link").first();
    await firstLink.focus();

    await expect(firstLink).toBeFocused();
    await expect(firstLink).toHaveAttribute("href", "/programy/pro-skoly");
    await expect(dropdown).toBeVisible();
  });
});
