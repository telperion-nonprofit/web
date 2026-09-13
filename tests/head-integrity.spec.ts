import { test, expect } from "@playwright/test";

// Regression guard for the Firefox FOUC bug: a non-head element inside <head>
// (the <vercel-analytics> custom element) made the parser close the head early
// and push Astro's <link rel="stylesheet"> into <body>, where it no longer
// blocks the first paint.
//
// These run against `astro dev`, which injects styles as inline <style> blocks
// rather than a stylesheet link, so they assert the *cause* (head contents)
// rather than the production-only symptom. `npm run check:head` covers the
// built output.
const PAGES = [
  "/",
  "/en",
  "/clanky",
  "/kontakty",
  "/programy/pro-skoly",
  "/ochrana-osobnich-udaju",
];

// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead
const ALLOWED_IN_HEAD = [
  "BASE",
  "LINK",
  "META",
  "NOSCRIPT",
  "SCRIPT",
  "STYLE",
  "TEMPLATE",
  "TITLE",
];

for (const path of PAGES) {
  test(`head survives parsing on ${path}`, async ({ page }) => {
    await page.goto(path);

    const parsed = await page.evaluate((allowed) => {
      const allowedTags = new Set(allowed);
      return {
        illegal: [...document.head.children]
          .map((el) => el.tagName)
          .filter((tag) => !allowedTags.has(tag)),
        styledFromHead:
          document.head.querySelectorAll('link[rel="stylesheet"], style')
            .length > 0,
        stylesheetsInBody: document.body.querySelectorAll(
          'link[rel="stylesheet"]',
        ).length,
      };
    }, ALLOWED_IN_HEAD);

    // Anything here means the head ended early and the rest of it — including
    // the stylesheet — was reparented into <body>.
    expect(parsed.illegal).toEqual([]);
    expect(parsed.styledFromHead).toBe(true);
    expect(parsed.stylesheetsInBody).toBe(0);
  });
}
