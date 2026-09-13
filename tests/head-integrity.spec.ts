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

for (const path of PAGES) {
  test(`head survives parsing on ${path}`, async ({ page }) => {
    await page.goto(path);

    // Looking for illegal elements in document.head would prove nothing: the
    // parser reparents them into <body> rather than leaving them behind, so an
    // offending page just has a shorter head. What it takes with it is the
    // point.
    const styles = await page.evaluate(() => ({
      inHead: document.head.querySelectorAll('link[rel="stylesheet"], style')
        .length,
      inBody: document.body.querySelectorAll('link[rel="stylesheet"]').length,
    }));

    expect(styles.inHead).toBeGreaterThan(0);
    expect(styles.inBody).toBe(0);
  });
}
