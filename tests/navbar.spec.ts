import { test, expect } from "@playwright/test";

test.describe("Navbar Component", () => {
  test.beforeEach(async ({ page }) => {
    // Avoid global promo modal interception by setting sessionStorage state before navigation
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
    await page.goto("/");
  });

  test.describe("Desktop Viewport", () => {
    test.use({ viewport: { width: 1280, height: 720 } });
    test.skip(({ isMobile }) => isMobile === true, "Desktop tests only");

    test("should display logo and brand name", async ({ page }) => {
      const logo = page.getByRole("link", { name: "Telperion" });
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("href", "/");
    });

    test("should display main navigation items", async ({ page }) => {
      const nav = page.locator("nav.hidden.lg\\:flex");
      await expect(nav).toBeVisible();

      const expectedLinks = [
        { name: "Domů", href: "/" },
        { name: "Podcast", href: "/podcast" },
        { name: "Články", href: "/clanky" },
        { name: "Kontakt", href: "/kontakty" },
      ];

      for (const link of expectedLinks) {
        const linkElement = nav.getByRole("link", { name: link.name });
        await expect(linkElement).toBeVisible();
        await expect(linkElement).toHaveAttribute("href", link.href);
      }

      const programyButton = nav.getByRole("button", { name: "Programy" });
      await expect(programyButton).toBeVisible();
    });

    test("should show dropdown on hover", async ({ page, browserName }) => {
      // Skip for Firefox
      test.skip(
        browserName === "firefox",
        "Headless Firefox ignores CSS group-hovers",
      );

      const nav = page.locator("nav.hidden.lg\\:flex");
      const programyButton = nav.getByRole("button", { name: "Programy" });

      await programyButton.hover();

      const subItems = [
        { name: "Pro školy", href: "/programy/pro-skoly" },
        { name: "Pro veřejnost", href: "/programy/pro-verejnost" },
        { name: "Další programy", href: "/programy/dalsi-programy" },
      ];

      for (const item of subItems) {
        const link = nav.getByRole("link", { name: item.name });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", item.href);
      }
    });

    test("should display CTA button", async ({ page }) => {
      const ctaContainer = page.locator("div.hidden.lg\\:flex");
      const ctaBtn = ctaContainer.locator("button").last();
      await expect(ctaBtn).toBeVisible();
    });

    test("should hide mobile menu button", async ({ page }) => {
      const mobileBtn = page.locator("#mobile-menu-btn");
      await expect(mobileBtn).toBeHidden();
    });
  });

  test.describe("Mobile Viewport", () => {
    test.use({ viewport: { width: 375, height: 667 } });
    test.skip(({ isMobile }) => isMobile !== true, "Mobile tests only");

    test("should display mobile menu button", async ({ page }) => {
      const mobileBtn = page.locator("#mobile-menu-btn");
      await expect(mobileBtn).toBeVisible();
    });

    test("should hide desktop navigation", async ({ page }) => {
      const desktopNav = page.locator("nav.hidden.lg\\:flex");
      await expect(desktopNav).toBeHidden();
    });

    test("should toggle mobile menu on click", async ({ page }) => {
      const mobileBtn = page.locator("#mobile-menu-btn");
      const mobileMenu = page.locator("#mobile-menu");

      await expect(mobileMenu).toBeHidden();

      await mobileBtn.click();
      await expect(mobileMenu).toBeVisible();

      const expectedLinks = [
        "Domů",
        "Podcast",
        "Články",
        "Kontakt",
      ];

      for (const name of expectedLinks) {
        const link = mobileMenu.getByRole("link", { name: name });
        await expect(link).toBeVisible();
      }

      const programyButton = mobileMenu.getByRole("button", { name: "Programy" });
      await expect(programyButton).toBeVisible();

      const mobileCta = mobileMenu.locator(
        'button[onclick*="open-donation-modal"]',
      );
      await expect(mobileCta).toBeVisible();

      await mobileBtn.click();
      await expect(mobileMenu).toBeHidden();
    });
  });
});
