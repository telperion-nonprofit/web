import { test, expect } from "@playwright/test";

test.describe("Donation Modal Input Benchmark", () => {
  test("should measure QR code generation count during typing", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for everything to be loaded to avoid test flakes
    await page.waitForLoadState("networkidle");

    // Close the climate fresk promo modal if it shows up
    const promoModal = page.locator("#climate-fresk-modal");
    if (await promoModal.isVisible()) {
      await page.locator("#climate-fresk-close").click({ force: true });
      await expect(promoModal).toHaveClass(/hidden/, { timeout: 10000 });
    }

    // Dispatch the event to open the modal
    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent("open-donation-modal"));
    });

    const modal = page.locator("#donation-modal");
    await expect(modal).not.toHaveClass(/hidden/);

    // We use .first() or .nth(0) because there are no other donation-modal instances, but it's safe.
    const customAmountBtn = page.locator(
      '#donation-modal button[data-amount="other"]',
    );
    // Ensure button is ready
    await expect(customAmountBtn).toBeVisible();
    await customAmountBtn.click({ force: true });

    const input = page.locator("#custom-amount-input");
    await expect(input).toBeVisible();

    // Wait for initial render to finish
    await page.waitForTimeout(500);

    // Setup mutation observer on the image
    await page.evaluate(() => {
      window["qrRenderCount"] = 0;
      const img = document.querySelector("#donation-modal #qr-code-img");
      if (!img) return;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src"
          ) {
            window["qrRenderCount"]++;
          }
        });
      });
      observer.observe(img, { attributes: true });
    });

    // Type an amount very quickly
    const startTime = performance.now();
    await input.pressSequentially("12345", { delay: 10 });
    const endTime = performance.now();

    // Wait a bit for the final debounce to trigger if any
    await page.waitForTimeout(500);

    const count = await page.evaluate(() => window["qrRenderCount"]);
    console.log(
      `[Benchmark] QR Code Rendered ${count} times during rapid typing of 5 characters.`,
    );
    console.log(`[Benchmark] Typing time: ${endTime - startTime}ms`);
  });
});
