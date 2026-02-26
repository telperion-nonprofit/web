import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display core content', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Check the title
    await expect(page).toHaveTitle(/Domů | Telperion/);

    // Check for the main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toHaveText(/Mladí učí o klimatu/);

    // Check for the welcome text
    const welcome = page.getByText('Vítejte na stránkách Telperionu!');
    await expect(welcome).toBeVisible();

    // Check for the description text
    const description = page.getByText('Informujeme o tématech spojených s životním prostředím');
    await expect(description).toBeVisible();

    // Check for navigation links
    const programyLink = page.getByRole('link', { name: 'Programy pro školy' });
    await expect(programyLink).toHaveAttribute('href', '/programy');

    const oNasLink = page.getByRole('link', { name: 'Přidat se k nám' });
    await expect(oNasLink).toHaveAttribute('href', '/o-nas');
  });

  test('should have interactive elements', async ({ page }) => {
    await page.goto('/');

    // Check for the "Proč to funguje?" section
    const whySectionHeading = page.getByRole('heading', { name: 'Proč to funguje?', level: 2 });
    await expect(whySectionHeading).toBeVisible();

    // Check for the three cards
    const cards = page.locator('.grid > div');
    await expect(cards).toHaveCount(3);

    await expect(page.getByText('Rovnocenný přístup')).toBeVisible();
    await expect(page.getByText('Ověřená fakta')).toBeVisible();
    await expect(page.getByText('Interaktivita')).toBeVisible();
  });
});
