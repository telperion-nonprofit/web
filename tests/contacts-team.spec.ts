import { test, expect } from "@playwright/test";

const removedMembers = [
  "Klára Adámková",
  "Valeriia Tsyhanchuk",
  "Sofia Grycová",
  "David Bartoš",
];

test.describe("Contacts page team members", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("should not display removed members on Czech contacts page", async ({
    page,
  }) => {
    await page.goto("/kontakty");

    for (const member of removedMembers) {
      await expect(page.getByText(member, { exact: true })).toHaveCount(0);
    }
  });

  test("should not display removed members on English contacts page", async ({
    page,
  }) => {
    await page.goto("/en/contacts");

    for (const member of removedMembers) {
      await expect(page.getByText(member, { exact: true })).toHaveCount(0);
    }
  });
});
