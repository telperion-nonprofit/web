import { test, expect } from "@playwright/test";

test.describe('Home Page', () => {
  test('should load and display core content', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Domů | Telperion/);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(/Mladí učí o klimatu/);

    const description = page.getByText('Informujeme o tématech spojených s životním prostředím');
    await expect(description).toBeVisible();

    const programyLink = page.getByRole('link', { name: 'Programy pro školy' });
    await expect(programyLink).toHaveAttribute('href', '/programy/pro-skoly');

    const oNasLink = page.getByRole("link", { name: "Náš tým" });
    await expect(oNasLink).toHaveAttribute("href", "/kontakty");
  });

  test("should have interactive elements", async ({ page }) => {
    await page.goto("/");

    const whySectionHeading = page.getByRole('heading', { name: 'Proč to funguje?', level: 2 });
    await expect(whySectionHeading).toBeVisible();

    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(3);

    await expect(page.getByText("Rovnocenný přístup")).toBeVisible();
    await expect(page.getByText("Ověřená fakta")).toBeVisible();
    await expect(page.getByText("Interaktivita")).toBeVisible();
  });
});
