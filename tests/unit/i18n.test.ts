import test from "node:test";
import assert from "node:assert";
import { cs } from "../../src/i18n/cs.ts";
import { en } from "../../src/i18n/en.ts";
import {
  getLangFromUrl,
  isLocale,
  useTranslations,
} from "../../src/i18n/index.ts";

test("getLangFromUrl utility", () => {
  const baseUrl = "https://example.com";

  // Root path
  assert.strictEqual(getLangFromUrl(new URL("/", baseUrl)), "cs");

  // English root
  assert.strictEqual(getLangFromUrl(new URL("/en", baseUrl)), "en");
  assert.strictEqual(getLangFromUrl(new URL("/en/", baseUrl)), "en");

  // English subpaths
  assert.strictEqual(getLangFromUrl(new URL("/en/about", baseUrl)), "en");
  assert.strictEqual(
    getLangFromUrl(new URL("/en/articles/my-post", baseUrl)),
    "en",
  );

  // Czech paths (no prefix)
  assert.strictEqual(getLangFromUrl(new URL("/kontakty", baseUrl)), "cs");
  assert.strictEqual(
    getLangFromUrl(new URL("/clanky/muj-prispevek", baseUrl)),
    "cs",
  );

  // Edge cases: paths starting with "en" but not being English prefix
  assert.strictEqual(getLangFromUrl(new URL("/energetika", baseUrl)), "cs");
  assert.strictEqual(getLangFromUrl(new URL("/en-us", baseUrl)), "cs");
  assert.strictEqual(getLangFromUrl(new URL("/entree", baseUrl)), "cs");
});

test("isLocale accepts only supported locales", () => {
  assert.strictEqual(isLocale("cs"), true);
  assert.strictEqual(isLocale("en"), true);
  assert.strictEqual(isLocale("cs-CZ"), false);
  assert.strictEqual(isLocale("de"), false);
  assert.strictEqual(isLocale(undefined), false);
});

test("useTranslations returns the string for the requested locale", () => {
  assert.strictEqual(
    useTranslations("cs")("donation_modal.title"),
    "Podpořte nás",
  );
  assert.strictEqual(
    useTranslations("en")("donation_modal.title"),
    "Support Us",
  );
});

test("dictionaries define the same keys", () => {
  assert.deepStrictEqual(Object.keys(en).sort(), Object.keys(cs).sort());
});

test("dictionary values are non-empty and carry no stray whitespace", () => {
  for (const [name, dictionary] of Object.entries({ cs, en })) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.ok(value.length > 0, `${name}: ${key} is empty`);
      assert.strictEqual(value, value.trim(), `${name}: ${key} is not trimmed`);
    }
  }
});
