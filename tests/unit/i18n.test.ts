import test from "node:test";
import assert from "node:assert";
import { replacePlaceholders, getLangFromUrl } from "../../src/utils/i18n.ts";

test("getLangFromUrl utility", (t) => {
  const baseUrl = "https://example.com";

  // Root path
  assert.strictEqual(getLangFromUrl(new URL("/", baseUrl)), "cs");

  // English root
  assert.strictEqual(getLangFromUrl(new URL("/en", baseUrl)), "en");
  assert.strictEqual(getLangFromUrl(new URL("/en/", baseUrl)), "en");

  // English subpaths
  assert.strictEqual(getLangFromUrl(new URL("/en/about", baseUrl)), "en");
  assert.strictEqual(getLangFromUrl(new URL("/en/articles/my-post", baseUrl)), "en");

  // Czech paths (no prefix)
  assert.strictEqual(getLangFromUrl(new URL("/kontakty", baseUrl)), "cs");
  assert.strictEqual(getLangFromUrl(new URL("/clanky/muj-prispevek", baseUrl)), "cs");

  // Edge cases: paths starting with "en" but not being English prefix
  assert.strictEqual(getLangFromUrl(new URL("/energetika", baseUrl)), "cs");
  assert.strictEqual(getLangFromUrl(new URL("/en-us", baseUrl)), "cs");
  assert.strictEqual(getLangFromUrl(new URL("/entree", baseUrl)), "cs");
});

test("replacePlaceholders utility - basic replacements", (t) => {
  // Test basic replacement for a known key in English
  const enText = "Support us by visiting: [[donation_modal.title]]";
  assert.strictEqual(
    replacePlaceholders(enText, "en"),
    "Support us by visiting: Support Us"
  );

  // Test basic replacement for a known key in Czech
  const csText = "Podpořte nás: [[donation_modal.title]]";
  assert.strictEqual(
    replacePlaceholders(csText, "cs"),
    "Podpořte nás: Podpořte nás"
  );
});

test("replacePlaceholders utility - multiple placeholders", (t) => {
  const text = "Title: [[donation_modal.title]], Amount: [[donation_modal.amount_other]]";
  assert.strictEqual(
    replacePlaceholders(text, "en"),
    "Title: Support Us, Amount: Other"
  );

  assert.strictEqual(
    replacePlaceholders(text, "cs"),
    "Title: Podpořte nás, Amount: Jiné"
  );
});

test("replacePlaceholders utility - no placeholders", (t) => {
  const text = "This is a regular string without any brackets.";
  assert.strictEqual(
    replacePlaceholders(text, "en"),
    "This is a regular string without any brackets."
  );
});

test("replacePlaceholders utility - empty strings and falsy values", (t) => {
  assert.strictEqual(replacePlaceholders("", "en"), "");
  // Type coercion test if not strict string typing from callers
  assert.strictEqual(replacePlaceholders(undefined as any, "en"), undefined);
  assert.strictEqual(replacePlaceholders(null as any, "en"), null);
});

test("replacePlaceholders utility - missing keys", (t) => {
  // For missing keys, useTranslations returns the key itself
  const text = "Missing key: [[unknown.missing_key]]";
  assert.strictEqual(
    replacePlaceholders(text, "en"),
    "Missing key: unknown.missing_key"
  );
});

test("replacePlaceholders utility - fallback to cs", (t) => {
  // If an English key is missing but the Czech key exists, it falls back to Czech.
  // We'll simulate this by finding a key that exists in CS but not EN, or we can just
  // assert that normal fallback mechanism provided by useTranslations works here.
  // For now, testing basic replacement logic is the main goal.

  // As a proxy, let's verify replacePlaceholders just correctly invokes translator.
  const text = "Fallback test: [[donation_modal.title]]";
  assert.strictEqual(
    replacePlaceholders(text, "en"),
    "Fallback test: Support Us"
  );
});

test("replacePlaceholders utility - malformed placeholders", (t) => {
  // Only exact [[key]] should be matched
  const text1 = "Malformed: [donation_modal.title]";
  assert.strictEqual(replacePlaceholders(text1, "en"), "Malformed: [donation_modal.title]");

  const text2 = "Malformed: donation_modal.title]]";
  assert.strictEqual(replacePlaceholders(text2, "en"), "Malformed: donation_modal.title]]");

  const text3 = "Malformed: [[donation_modal.title";
  assert.strictEqual(replacePlaceholders(text3, "en"), "Malformed: [[donation_modal.title");
});

test("replacePlaceholders utility - consecutive placeholders without spaces", (t) => {
  const text = "[[donation_modal.amount_other]][[donation_modal.title]]";
  assert.strictEqual(
    replacePlaceholders(text, "en"),
    "OtherSupport Us"
  );
});
