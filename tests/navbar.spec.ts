import { test, expect } from '@playwright/test';

test.describe('Navbar Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/navbar');
  });

  // Desktop Tests
  test.describe('Desktop Viewport', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display logo and brand name', async ({ page }) => {
      const logo = page.getByRole('link', { name: 'Telperion' });
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('href', '/');
    });

    test('should display main navigation items', async ({ page }) => {
      // Scope to desktop nav
      const nav = page.locator('nav.hidden.md\\:block');
      await expect(nav).toBeVisible();

      const expectedLinks = [
        { name: 'Domů', href: '/' },
        // Programy is a button, handled separately
        { name: 'Podcast', href: '/podcast' },
        { name: 'Kontakty', href: '/kontakty' },
      ];

      for (const link of expectedLinks) {
        const linkElement = nav.getByRole('link', { name: link.name });
        await expect(linkElement).toBeVisible();
        await expect(linkElement).toHaveAttribute('href', link.href);
      }

      // Check the 'Programy' button specifically
      const programyButton = nav.getByRole('button', { name: 'Programy' });
      await expect(programyButton).toBeVisible();
    });

    test('should show dropdown on hover', async ({ page }) => {
      const nav = page.locator('nav.hidden.md\\:block');
      const programyButton = nav.getByRole('button', { name: 'Programy' });

      // Hover to trigger dropdown
      await programyButton.hover();

      const subItems = [
        { name: 'Pro školy', href: '/programy/pro-skoly' },
        { name: 'Pro skauty', href: '/programy/pro-skauty' },
      ];

      for (const item of subItems) {
        // Scope to the dropdown container within the nav
        // We look for the link inside the nav.
        // Note: The dropdown is absolutely positioned but structurally inside the <li> in the <nav>
        const link = nav.getByRole('link', { name: item.name });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', item.href);
      }
    });

    test('should display CTA button', async ({ page }) => {
        // The desktop CTA is in a div with "hidden md:block" that is a sibling of the nav
        // It's the div following the nav
        const desktopCtaContainer = page.locator('div.hidden.md\\:block').filter({ hasText: 'Poptat program' });
        const cta = desktopCtaContainer.getByRole('link', { name: 'Poptat program' });

        await expect(cta).toBeVisible();
        await expect(cta).toHaveAttribute('href', '/poptavka');
    });

    test('should hide mobile menu button', async ({ page }) => {
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeHidden();
    });
  });

  // Mobile Tests
  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display mobile menu button', async ({ page }) => {
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeVisible();
    });

    test('should hide desktop navigation', async ({ page }) => {
      const desktopNav = page.locator('nav.hidden.md\\:block');
      await expect(desktopNav).toBeHidden();
    });

    test('should toggle mobile menu on click', async ({ page }) => {
      const mobileBtn = page.locator('#mobile-menu-btn');
      const mobileMenu = page.locator('#mobile-menu');

      // Initially hidden
      await expect(mobileMenu).toBeHidden();

      // Click to open
      await mobileBtn.click();
      await expect(mobileMenu).toBeVisible();

      // Check menu items
      const expectedLinks = [
        'Domů',
        'Pro školy',
        'Pro skauty',
        'Podcast',
        'Kontakty'
      ];

      for (const name of expectedLinks) {
          const link = mobileMenu.getByRole('link', { name: name });
          await expect(link).toBeVisible();
      }

       // Check CTA in mobile menu
       const mobileCta = mobileMenu.getByRole('link', { name: 'Poptat program' });
       await expect(mobileCta).toBeVisible();

      // Click to close
      await mobileBtn.click();
      await expect(mobileMenu).toBeHidden();
    });
  });
});
