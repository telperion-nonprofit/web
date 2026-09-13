import test from "node:test";
import assert from "node:assert";
import { translatePath } from "../../src/utils/lang.ts";

test("translatePath utility - exact matches", () => {
  assert.strictEqual(translatePath("/kontakty", "en"), "/en/contacts");
  assert.strictEqual(translatePath("/clanky", "en"), "/en/articles");
  assert.strictEqual(
    translatePath("/ochrana-osobnich-udaju", "en"),
    "/en/privacy-policy",
  );
  assert.strictEqual(translatePath("/socialni-site", "en"), "/en/social-media");
  assert.strictEqual(translatePath("/en/contacts", "cs"), "/kontakty");
  assert.strictEqual(translatePath("/en/articles", "cs"), "/clanky");
  assert.strictEqual(
    translatePath("/en/privacy-policy", "cs"),
    "/ochrana-osobnich-udaju",
  );
  assert.strictEqual(translatePath("/en/social-media", "cs"), "/socialni-site");
});

test("translatePath utility - sub-paths", () => {
  assert.strictEqual(
    translatePath("/clanky/muj-clanek", "en"),
    "/en/articles/muj-clanek",
  );
  assert.strictEqual(
    translatePath("/programy/pro-skoly/lekce-1", "en"),
    "/en/workshops/for-schools/lekce-1",
  );
  assert.strictEqual(
    translatePath("/en/articles/my-article", "cs"),
    "/clanky/my-article",
  );
  assert.strictEqual(
    translatePath("/en/workshops/for-schools/lesson-1", "cs"),
    "/programy/pro-skoly/lesson-1",
  );
});

test("translatePath utility - root paths", () => {
  assert.strictEqual(translatePath("/", "en"), "/en");
  assert.strictEqual(translatePath("/en", "cs"), "/");
  assert.strictEqual(translatePath("/en/", "cs"), "/");
});

test("translatePath utility - unmapped paths", () => {
  assert.strictEqual(translatePath("/unknown", "en"), "/en/unknown");
  assert.strictEqual(translatePath("/en/unknown", "cs"), "/unknown");
});

test("translatePath utility - identity translations", () => {
  assert.strictEqual(translatePath("/en/contacts", "en"), "/en/contacts");
  assert.strictEqual(translatePath("/kontakty", "cs"), "/kontakty");
  assert.strictEqual(
    translatePath("/en/articles/my-article", "en"),
    "/en/articles/my-article",
  );
  assert.strictEqual(
    translatePath("/clanky/my-article", "cs"),
    "/clanky/my-article",
  );
});
