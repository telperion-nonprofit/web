import { test, expect } from "@playwright/test";

test.describe("Keyboard Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
    await page.goto("/");
  });

  test("should close donation modal with Escape key", async ({ page }) => {
    const modal = page.locator("#donation-modal");

    // Open donation modal via event
    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent("open-donation-modal"));
    });
    await expect(modal).not.toHaveClass(/hidden/);

    // Press Escape to close
    await page.keyboard.press("Escape");

    await expect(modal).toHaveClass(/hidden/, { timeout: 10000 });
  });

  test("should allow tabbing through contact form fields", async ({
    page,
  }) => {
    // Open contact modal
    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent("open-contact-modal"));
    });

    const nameField = page.locator("#name");
    const emailField = page.locator("#email");

    // Focus the name field and tab to the next
    await nameField.focus();
    await expect(nameField).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(emailField).toBeFocused();
  });

  test("should have focus indicators on interactive elements", async ({
    page,
  }) => {
    // Tab to first interactive element (skip link or logo)
    await page.keyboard.press("Tab");

    // The focused element should be visible and focusable
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });
});
