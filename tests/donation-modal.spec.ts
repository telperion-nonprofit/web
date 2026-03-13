import { test, expect } from "@playwright/test";

test.describe("Donation Modal Component", () => {
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
      const modal = page.locator("#donation-modal");
      await expect(modal).toHaveClass(/hidden/);
    });

    test("should open on custom event", async ({ page }) => {
      const modal = page.locator("#donation-modal");
      const backdrop = page.locator("#donation-modal-backdrop");
      const panel = page.locator("#donation-modal-panel");

      // Dispatch the event to open the modal
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });

      // It shouldn't be hidden anymore
      await expect(modal).not.toHaveClass(/hidden/);

      // Wait for animations
      await expect(backdrop).not.toHaveClass(/opacity-0/);
      await expect(panel).not.toHaveClass(/opacity-0/);
      await expect(panel).toHaveClass(/scale-100/);
    });

    test("should display form contents when open", async ({ page }) => {
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });

      const modalTitle = page.locator("#donation-modal-title");
      await expect(modalTitle).toBeVisible();

      // Check account number and bank info
      await expect(page.getByText("2102801318/2010")).toBeVisible();
      await expect(page.getByText("Fio banka, a.s.")).toBeVisible();

      // Check transparent account link
      const transparentLink = page.locator(
        'a[href="https://ib.fio.cz/ib/transparent?a=2102801318"]',
      );
      await expect(transparentLink).toBeVisible();

      // Check buttons
      await expect(page.locator("#close-donation-modal-btn")).toBeVisible();
      await expect(page.locator("#close-donation-modal-confirm")).toBeVisible();
    });

    test("should close on close button click", async ({ page }) => {
      const modal = page.locator("#donation-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      const closeBtn = page.locator("#close-donation-modal-btn");
      await closeBtn.click();

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/);
    });

    test("should close on cancel button click", async ({ page }) => {
      const modal = page.locator("#donation-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      const cancelBtn = page.locator("#close-donation-modal-confirm");
      await cancelBtn.click();

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/);
    });

    test("should close on backdrop click", async ({ page }) => {
      const modal = page.locator("#donation-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      // Click the backdrop directly to close it by evaluating
      await page.evaluate(() => {
        const backdrop = document.getElementById("donation-modal-backdrop");
        backdrop?.click();
      });

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/);
    });

    test("should close on Escape key press", async ({ page }) => {
      const modal = page.locator("#donation-modal");

      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      await page.keyboard.press("Escape");

      // Wait for the animation to finish
      await expect(modal).toHaveClass(/hidden/);
    });
  });

  test.describe("Mobile Viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test("should open and close correctly", async ({ page }) => {
      const modal = page.locator("#donation-modal");
      const closeBtn = page.locator("#close-donation-modal-btn");

      // Initially hidden
      await expect(modal).toHaveClass(/hidden/);

      // Open
      await page.evaluate(() => {
        document.dispatchEvent(new CustomEvent("open-donation-modal"));
      });
      await expect(modal).not.toHaveClass(/hidden/);

      // Check title visibility to ensure content renders on mobile
      const modalTitle = page.locator("#donation-modal-title");
      await expect(modalTitle).toBeVisible();

      // Close
      await closeBtn.click();
      await expect(modal).toHaveClass(/hidden/);
    });
  });
});
