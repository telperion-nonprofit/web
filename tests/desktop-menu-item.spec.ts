import { test, expect } from "@playwright/test";

test.describe("DesktopMenuItem Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/desktop-menu-item");
  });

  test.describe("Normal Item (No Subitems)", () => {
    test("renders as a simple link without dropdown logic", async ({
      page,
    }) => {
      const normalLink = page.getByRole("link", { name: "Normal Link" });
      await expect(normalLink).toBeVisible();
      await expect(normalLink).toHaveAttribute("href", "/normal-link");

      const button = page.locator('li', { hasText: 'Normal Link' }).getByRole('button');
      await expect(button).toHaveCount(0);
    });
  });

  test.describe("Dropdown Item (With Subitems)", () => {
    test("renders as a button with SVG icon", async ({ page }) => {
      const dropdownBtn = page.getByRole("button", { name: "Dropdown" });
      await expect(dropdownBtn).toBeVisible();

      const svg = dropdownBtn.locator('svg');
      await expect(svg).toBeVisible();
      await expect(svg).toHaveClass(/transition-transform/);
    });

    test('dropdown is initially hidden with correct classes', async ({ page }) => {
      const dropdownContainer = page.locator('li', { hasText: 'Dropdown' }).locator('div').first();

      await expect(dropdownContainer).toHaveClass(/opacity-0/);
      await expect(dropdownContainer).toHaveClass(/invisible/);
      await expect(dropdownContainer).toHaveClass(/group-hover:opacity-100/);
      await expect(dropdownContainer).toHaveClass(/group-hover:visible/);

      const sub1 = page.locator('li', { hasText: 'Dropdown' }).locator('a', { hasText: 'Subitem 1' });
      const sub2 = page.locator('li', { hasText: 'Dropdown' }).locator('a', { hasText: 'Subitem 2' });

      await expect(sub1).toBeAttached();
      await expect(sub2).toBeAttached();
    });

    test("dropdown becomes visible on hover", async ({ page }) => {
      const listItem = page.locator("li", { hasText: "Dropdown" });
      const dropdownContainer = listItem.locator("div").first();

      await expect(dropdownContainer).toHaveCSS('opacity', '0');
      await expect(dropdownContainer).toHaveCSS('visibility', 'hidden');

      await listItem.hover();

      await expect(dropdownContainer).toHaveCSS('opacity', '1');
      await expect(dropdownContainer).toHaveCSS('visibility', 'visible');

      const sub1 = dropdownContainer.getByRole('link', { name: 'Subitem 1' });
      await expect(sub1).toBeVisible();
      await expect(sub1).toHaveAttribute("href", "/sub-1");

      const sub2 = dropdownContainer.getByRole("link", { name: "Subitem 2" });
      await expect(sub2).toBeVisible();
      await expect(sub2).toHaveAttribute("href", "/sub-2");
    });

    test("svg icon rotates on hover", async ({ page }) => {
      const listItem = page.locator("li", { hasText: "Dropdown" });
      const svg = listItem.locator("svg");

      await listItem.hover();

      await expect(svg).toHaveClass(/group-hover:rotate-180/);
    });
  });
});
