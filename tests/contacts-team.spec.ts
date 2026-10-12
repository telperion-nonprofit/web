import { test, expect } from "@playwright/test";

interface Person {
  name: string;
  email: string;
  phone?: string;
  hasPhoto?: boolean;
}

const leadership: Person[] = [
  {
    name: "Jakub Nekvasil",
    email: "jakub.nekvasil@telperion.cz",
    phone: "+420 776 059 998",
  },
  {
    name: "Damia Veselá",
    email: "damia.vesela@telperion.cz",
    phone: "+420 608 168 078",
  },
  { name: "Anna Zezulka", email: "anna.zezulka@telperion.cz" },
  { name: "Jolana Balcarová", email: "jolana.balcarova@telperion.cz" },
  { name: "Mykhailo Ovechkin", email: "mykhailo.ovechkin@telperion.cz" },
];

const members: Person[] = [
  { name: "David Bartoš", email: "david.bartos@telperion.cz" },
  { name: "Valeriia Tsyhanchuk", email: "valeriia.tsyhanchuk@telperion.cz" },
  { name: "Klára Bodláková", email: "klara.bodlakova@telperion.cz" },
  { name: "Stella Tomanová", email: "stella.tomanova@telperion.cz" },
  { name: "Karolína Ciencialová", email: "karolina.ciencialova@telperion.cz" },
  {
    name: "Sofia Grycová",
    email: "sofia.grycova@telperion.cz",
    hasPhoto: false,
  },
  { name: "Hana Trinh", email: "hana.trinh@telperion.cz", hasPhoto: false },
  {
    name: "Klára Adámková",
    email: "klara.adamkova@telperion.cz",
    hasPhoto: false,
  },
];

const formerMembers = ["Martin Jirků", "Lucie Kubášová"];

const pages = [
  { path: "/kontakty", leadershipTitle: "Vedení", membersTitle: "Členové" },
  {
    path: "/en/contacts",
    leadershipTitle: "Leadership",
    membersTitle: "Members",
  },
];

test.describe("Contacts page team members", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  for (const { path, leadershipTitle, membersTitle } of pages) {
    test(`should list leadership and members separately on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);

      const sections = [
        {
          testId: "team-leadership",
          title: leadershipTitle,
          people: leadership,
        },
        { testId: "team-members", title: membersTitle, people: members },
      ];

      for (const { testId, title, people } of sections) {
        const section = page.getByTestId(testId);
        await expect(section.getByRole("heading", { level: 2 })).toHaveText(
          title,
        );
        await expect(section.getByRole("heading", { level: 3 })).toHaveText(
          people.map((person) => person.name),
        );
      }
    });

    test(`should show contact details and photos on ${path}`, async ({
      page,
    }) => {
      await page.goto(path);

      for (const person of [...leadership, ...members]) {
        const card = page.getByTestId("team-member").filter({
          has: page.getByRole("heading", { name: person.name, exact: true }),
        });

        const email = card.locator('a[href^="mailto:"]');
        await expect(email).toHaveAttribute("href", `mailto:${person.email}`);
        await expect(email).toHaveText(person.email);

        const phone = card.locator('a[href^="tel:"]');
        if (person.phone) {
          await expect(phone).toHaveText(person.phone);
        } else {
          await expect(phone).toHaveCount(0);
        }

        if (person.hasPhoto === false) {
          await expect(card.getByTestId("avatar-placeholder")).toHaveCount(1);
          await expect(card.locator("img")).toHaveCount(0);
        } else {
          await expect(
            card.getByRole("img", { name: person.name }),
          ).toHaveCount(1);
          await expect(card.getByTestId("avatar-placeholder")).toHaveCount(0);
        }
      }
    });

    test(`should not display former members on ${path}`, async ({ page }) => {
      await page.goto(path);

      for (const member of formerMembers) {
        await expect(page.getByText(member, { exact: true })).toHaveCount(0);
      }
    });
  }
});
