#!/usr/bin/env node
/**
 * Guards the production build against the FOUC class of bug.
 *
 * The HTML parser ends <head> at the first element that is not allowed there
 * (a custom element such as <vercel-analytics>, a stray <div>, …) and moves
 * everything after it into <body>. When that happens to Astro's
 * <link rel="stylesheet">, the stylesheet stops blocking the first paint and
 * the page renders unstyled for a moment.
 *
 * The Playwright suite runs against `astro dev`, where styles are injected as
 * inline <style> blocks, so it cannot see this. Run this against `dist/`.
 */
import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

// https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead
const ALLOWED_IN_HEAD = new Set([
  "base",
  "basefont",
  "bgsound",
  "link",
  "meta",
  "noscript",
  "script",
  "style",
  "template",
  "title",
]);

function headMarkup(html) {
  const start = html.indexOf("<head>");
  const end = html.indexOf("</head>");
  if (start === -1 || end === -1) return null;
  return (
    html
      .slice(start + "<head>".length, end)
      // Tag names inside script/style bodies and comments are not markup.
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
  );
}

const problems = [];
let pages = 0;
const skipped = [];

for await (const file of glob("dist/**/*.html")) {
  const html = await readFile(file, "utf8");
  const head = headMarkup(html);
  if (head === null) {
    // Pages that never render a Layout (the /test/* fixtures become redirect
    // stubs in production) have no <head> to check.
    skipped.push(file);
    continue;
  }
  pages += 1;

  const illegal = [
    ...new Set(
      [...head.matchAll(/<\s*\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/g)].map((m) =>
        m[1].toLowerCase(),
      ),
    ),
  ].filter((tag) => !ALLOWED_IN_HEAD.has(tag));

  if (illegal.length > 0) {
    problems.push(
      `${file}: <${illegal.join(">, <")}> inside <head> — the parser closes ` +
        `the head there and moves the rest into <body>.`,
    );
    continue;
  }

  if (!/<link\b[^>]*rel=["']?stylesheet/i.test(head)) {
    problems.push(`${file}: no <link rel="stylesheet"> inside <head>.`);
  }
}

if (pages === 0) {
  console.error("No built pages found in dist/. Run `npm run build` first.");
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`Head integrity check failed on ${problems.length} page(s):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Head integrity OK: ${pages} page(s) keep their stylesheet in <head>` +
    (skipped.length > 0
      ? `, ${skipped.length} page(s) without a <head>.`
      : "."),
);
