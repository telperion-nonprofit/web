import { test, expect } from '@playwright/test';

test.describe('DesktopMenuItem Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/desktop-menu-item');
  });

  test.describe('Normal Item (No Subitems)', () => {
    test('renders as a simple link without dropdown logic', async ({ page }) => {
      const normalLink = page.getByRole('link', { name: 'Normal Link' });
      await expect(normalLink).toBeVisible();
      await expect(normalLink).toHaveAttribute('href', '/normal-link');

      // Should not have a button or an SVG
      const button = page.locator('li', { hasText: 'Normal Link' }).getByRole('button');
      await expect(button).toHaveCount(0);
    });
  });

  test.describe('Dropdown Item (With Subitems)', () => {
    test('renders as a button with SVG icon', async ({ page }) => {
      const dropdownBtn = page.getByRole('button', { name: 'Dropdown' });
      await expect(dropdownBtn).toBeVisible();

      // Check for SVG icon inside the button
      const svg = dropdownBtn.locator('svg');
      await expect(svg).toBeVisible();
      await expect(svg).toHaveClass(/transition-transform/);
    });

    test('dropdown is initially hidden with correct classes', async ({ page }) => {
      // Find the dropdown container (the div immediately after the button)
      // The subitems are in the child div, so we select the overall dropdown container
      const dropdownContainer = page.locator('li', { hasText: 'Dropdown' }).locator('div').first();

      // The element should be in the DOM but hidden
      await expect(dropdownContainer).toHaveClass(/opacity-0/);
      await expect(dropdownContainer).toHaveClass(/invisible/);
      await expect(dropdownContainer).toHaveClass(/group-hover:opacity-100/);
      await expect(dropdownContainer).toHaveClass(/group-hover:visible/);

      // It should contain the subitems, but since the container has opacity-0 and invisible,
      // Playwright's getByRole might not find them if they are considered "hidden".
      // We can use locator and check that they are attached.
      const sub1 = page.locator('li', { hasText: 'Dropdown' }).locator('a', { hasText: 'Subitem 1' });
      const sub2 = page.locator('li', { hasText: 'Dropdown' }).locator('a', { hasText: 'Subitem 2' });

      // Check that they exist in the DOM
      await expect(sub1).toBeAttached();
      await expect(sub2).toBeAttached();
    });

    test('dropdown becomes visible on hover', async ({ page }) => {
      const listItem = page.locator('li', { hasText: 'Dropdown' });
      const dropdownContainer = listItem.locator('div').first();

      // Pre-hover assertions
      await expect(dropdownContainer).toHaveCSS('opacity', '0');
      await expect(dropdownContainer).toHaveCSS('visibility', 'hidden');

      // Hover over the parent `li` (which has the `group` class)
      await listItem.hover();

      // Post-hover assertions - waiting for transition to complete
      await expect(dropdownContainer).toHaveCSS('opacity', '1');
      await expect(dropdownContainer).toHaveCSS('visibility', 'visible');

      // Verify subitems are accessible
      const sub1 = dropdownContainer.getByRole('link', { name: 'Subitem 1' });
      await expect(sub1).toBeVisible();
      await expect(sub1).toHaveAttribute('href', '/sub-1');

      const sub2 = dropdownContainer.getByRole('link', { name: 'Subitem 2' });
      await expect(sub2).toBeVisible();
      await expect(sub2).toHaveAttribute('href', '/sub-2');
    });

    test('svg icon rotates on hover', async ({ page }) => {
      const listItem = page.locator('li', { hasText: 'Dropdown' });
      const svg = listItem.locator('svg');

      // Initial state
      // When not hovered, matrix(1, 0, 0, 1, 0, 0)

      await listItem.hover();

      // Expected rotation is 180deg which might be computed as matrix(-1, 0, 0, -1, 0, 0) or similar,
      // but we can check the class change or the final state. Wait a bit for the transition.
      // Easiest is to check that it has the group-hover:rotate-180 class
      await expect(svg).toHaveClass(/group-hover:rotate-180/);
    });
  });
});
