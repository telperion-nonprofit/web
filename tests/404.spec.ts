import { test, expect } from "@playwright/test";

test.describe('404 Error Page', () => {
  test('should display 404 page content for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    expect(response?.status()).toBe(404);

    await expect(page).toHaveTitle(/Stránka nenalezena \(404\)/);

    const mainHeading = page.getByRole("heading", { level: 1 });
    await expect(mainHeading).toHaveText("404");

    const subHeading = page.getByRole("heading", { level: 2 });
    await expect(subHeading).toHaveText("Jejda! Tady rostou jen stromy.");

    const description = page.getByText('Stránka, kterou hledáte, tu bohužel není.');
    await expect(description).toBeVisible();
  });

  test("should include global layout elements", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    const navbarLogo = page.getByRole('link', { name: 'Telperion' }).first();
    await expect(navbarLogo).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const copyrightText = footer.locator("p");
    await expect(copyrightText).toContainText("Telperion z.s");
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    const homeLink = page.getByRole('link', { name: 'Zpět na hlavní stránku' });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute("href", "/");

    const contactLink = page.getByRole('link', { name: 'Napsat nám' });
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute("href", "/kontakty");
  });
});
