import { test, expect } from "@playwright/test";

test.describe("LanguageDropdown Component", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the specific fixture for testing LanguageDropdown
    await page.goto("/test/language-dropdown");

    // Ensure scripts and interactions are ready
    await page.waitForLoadState("networkidle");
  });

  test("should render the desktop dropdown with correct initial state", async ({
    page,
  }) => {
    const container = page.locator(
      "#desktop-container .language-dropdown-container",
    );
    const toggleBtn = container.locator("button.language-toggle");
    const menu = container.locator(".language-menu");

    await expect(container).toBeVisible();
    await expect(toggleBtn).toBeVisible();

    // Check initial attributes
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    // Should display 'CS' by default
    await expect(toggleBtn.locator(".current-language-label")).toHaveText("CS");

    // Menu should be hidden initially
    await expect(menu).toBeHidden();
  });

  test("should render the mobile dropdown with correct initial state", async ({
    page,
  }) => {
    const container = page.locator(
      "#mobile-container .language-dropdown-container",
    );
    const toggleBtn = container.locator("button.language-toggle");
    const menu = container.locator(".language-menu");

    await expect(container).toBeVisible();
    await expect(toggleBtn).toBeVisible();

    // Check initial attributes
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    // Menu should be hidden initially
    await expect(menu).toBeHidden();
  });

  test("should toggle the desktop dropdown on click", async ({ page }) => {
    const container = page.locator(
      "#desktop-container .language-dropdown-container",
    );
    const toggleBtn = container.locator("button.language-toggle");
    const menu = container.locator(".language-menu");

    // Open menu
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    // Verify links in menu
    const csLink = menu.getByRole("menuitem", { name: "Čeština" });
    const enLink = menu.getByRole("menuitem", { name: "English" });

    await expect(csLink).toBeVisible();
    // On the test page, the path is /test/language-dropdown
    await expect(csLink).toHaveAttribute("href", "/test/language-dropdown");
    await expect(enLink).toBeVisible();
    await expect(enLink).toHaveAttribute("href", "/en/test/language-dropdown");

    // Close menu
    await toggleBtn.click();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();
  });

  test("should close open dropdown when clicking outside", async ({ page }) => {
    const desktopContainer = page.locator(
      "#desktop-container .language-dropdown-container",
    );
    const toggleBtn = desktopContainer.locator("button.language-toggle");
    const menu = desktopContainer.locator(".language-menu");

    // Open menu
    await toggleBtn.click();
    await expect(menu).toBeVisible();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    // Click outside
    await page.locator("#outside-area").click();

    // Menu should close
    await expect(menu).toBeHidden();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("should close one dropdown when opening another", async ({ page }) => {
    const desktopToggle = page.locator("#desktop-container .language-toggle");
    const desktopMenu = page.locator("#desktop-container .language-menu");

    const mobileToggle = page.locator("#mobile-container .language-toggle");
    const mobileMenu = page.locator("#mobile-container .language-menu");

    // Open desktop dropdown
    await desktopToggle.click();
    await expect(desktopMenu).toBeVisible();
    await expect(desktopToggle).toHaveAttribute("aria-expanded", "true");

    // Open mobile dropdown
    await mobileToggle.click();

    // Mobile should be open
    await expect(mobileMenu).toBeVisible();
    await expect(mobileToggle).toHaveAttribute("aria-expanded", "true");

    // Desktop should now be closed
    await expect(desktopMenu).toBeHidden();
    await expect(desktopToggle).toHaveAttribute("aria-expanded", "false");
  });
});
