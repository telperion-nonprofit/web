import { test, expect } from "@playwright/test";

test.describe("Modal Component", () => {
  test.beforeEach(async ({ page }) => {
    // Modal is a global component included in Layout.astro, so we can test it on the home page
    await page.goto("/");
    // Close the climate fresk promo modal if it shows up
    const promoModal = page.locator("#climate-fresk-modal");
    if (await promoModal.isVisible()) {
       await page.locator("#climate-fresk-close").click();
       await expect(promoModal).toHaveClass(/hidden/);
    }
  });

  test.describe("Desktop Viewport", () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test("should be initially hidden", async ({ page }) => {
      const modal = page.locator("#contact-modal");
      await expect(modal).toHaveClass(/hidden/);
    });

    test("should open on custom event", async ({ page }) => {
      const modal = page.locator("#contact-modal");
      const backdrop = page.locator("#modal-backdrop");
      const panel = page.locator("#modal-panel");

      // Dispatch the event to open the modal
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-contact-modal"));
      });

      // It shouldn't be hidden anymore
      await expect(modal).not.toHaveClass(/hidden/);

      // Wait for animations
      await expect(backdrop).toHaveClass(/opacity-100/);
      await expect(panel).toHaveClass(/opacity-100/);
      await expect(panel).toHaveClass(/scale-100/);
    });

    test("should display form contents when open", async ({ page }) => {
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-contact-modal"));
      });

      const modalTitle = page.locator("#modal-title");
      await expect(modalTitle).toBeVisible();

      // Check form fields
      await expect(page.locator("label[for='name']")).toBeVisible();
      await expect(page.locator("#name")).toBeVisible();
      await expect(page.locator("#name")).toHaveAttribute("required", "");

      await expect(page.locator("label[for='email']")).toBeVisible();
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#email")).toHaveAttribute("required", "");
      await expect(page.locator("#email")).toHaveAttribute("type", "email");

      await expect(page.locator("label[for='message']")).toBeVisible();
      await expect(page.locator("#message")).toBeVisible();
      await expect(page.locator("#message")).toHaveAttribute("required", "");

      // Check buttons
      await expect(
        page.getByRole("button", { name: /Odeslat zprávu/i }),
      ).toBeVisible();
      await expect(page.locator("#cancel-modal-btn")).toBeVisible();
    });

    test("should close on close button click", async ({ page }) => {
      const modal = page.locator("#contact-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-contact-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      const closeBtn = page.locator("#close-modal-btn");
      await closeBtn.click({ force: true });

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/, { timeout: 10000 });
    });

    test("should close on cancel button click", async ({ page }) => {
      const modal = page.locator("#contact-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-contact-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      const cancelBtn = page.locator("#cancel-modal-btn");
      await cancelBtn.click({ force: true });

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/, { timeout: 10000 });
    });

    test("should close on backdrop click", async ({ page }) => {
      const modal = page.locator("#contact-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-contact-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      // Click outside the panel. The min-h-full div is the target checked in the event listener.
      const container = page.locator("#contact-modal .min-h-full").first();
      // Click at the top-left corner of the container which should be outside the panel
      await container.click({ position: { x: 10, y: 10 }, force: true });

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/, { timeout: 10000 });
    });
  });

  test.describe("Mobile Viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("should open and close correctly", async ({ page }) => {
      const modal = page.locator("#contact-modal");
      const closeBtn = page.locator("#close-modal-btn");

      // Initially hidden
      await expect(modal).toHaveClass(/hidden/);

      // Open
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-contact-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      // Check title visibility to ensure content renders on mobile
      const modalTitle = page.locator("#modal-title");
      await expect(modalTitle).toBeVisible();

      // Close
      await closeBtn.click({ force: true });
      await expect(modal).toHaveClass(/hidden/, { timeout: 10000 });
    });
  });
});
