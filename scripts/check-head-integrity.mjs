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
 *
 * parse5 implements the same spec tree-construction algorithm a browser uses,
 * so what it reports as "in the head" is what a browser will do — no attempt
 * to approximate the parse with regexes.
 */
import { readFile, glob } from "node:fs/promises";
import { parse } from "parse5";

const elements = (node) =>
  (node?.childNodes ?? []).filter((child) => Boolean(child.tagName));

const findChild = (node, tagName) =>
  elements(node).find((child) => child.tagName === tagName);

const attr = (node, name) =>
  node.attrs?.find((a) => a.name === name)?.value ?? "";

const isStylesheet = (node) =>
  node.tagName === "link" &&
  attr(node, "rel").toLowerCase().split(/\s+/).includes("stylesheet");

/** Every element in the subtree, so a stylesheet nested in <body> is found. */
function* walk(node) {
  for (const child of elements(node)) {
    yield child;
    yield* walk(child);
  }
}

const problems = [];
let checked = 0;
let redirects = 0;

for await (const file of glob("dist/**/*.html")) {
  const document = parse(await readFile(file, "utf8"));
  const html = findChild(document, "html");
  const head = findChild(html, "head");
  const body = findChild(html, "body");

  // The /test/* QA fixtures become bare redirect stubs in production; they
  // render no Layout and carry no styles.
  const isRedirectStub = elements(head).some(
    (node) =>
      node.tagName === "meta" &&
      attr(node, "http-equiv").toLowerCase() === "refresh",
  );
  if (isRedirectStub) {
    redirects += 1;
    continue;
  }
  checked += 1;

  // Checking the head for illegal elements would be pointless: the parser
  // reparents them rather than leaving them there, so an offending page has a
  // *shorter* head, not a malformed one. The symptom is where the stylesheet
  // ended up.
  if (!elements(head).some(isStylesheet)) {
    problems.push(
      `${file}: no <link rel="stylesheet"> inside <head> — something before ` +
        `it (a custom element, a stray tag) is closing the head early.`,
    );
  }

  const strays = [...walk(body)].filter(isStylesheet);
  if (strays.length > 0) {
    problems.push(
      `${file}: ${strays.length} <link rel="stylesheet"> inside <body> ` +
        `(${strays.map((node) => attr(node, "href")).join(", ")}) — these do ` +
        `not reliably block the first paint.`,
    );
  }
}

if (checked === 0) {
  console.error("No built pages found in dist/. Run `npm run build` first.");
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`Head integrity check failed on ${problems.length} page(s):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `Head integrity OK: ${checked} page(s) keep their stylesheet in <head>` +
    (redirects > 0 ? `, ${redirects} redirect stub(s) skipped.` : "."),
);
