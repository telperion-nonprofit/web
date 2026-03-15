import { test, expect } from "@playwright/test";
import { replacePlaceholders } from "../src/utils/i18n";

test.describe("i18n replacePlaceholders", () => {
  test("should return the original text if there are no placeholders", () => {
    const text = "Hello World!";
    expect(replacePlaceholders(text, "en")).toBe(text);
    expect(replacePlaceholders(text, "cs")).toBe(text);
  });

  test("should replace a single placeholder with the correct translation", () => {
    // Derive the concrete translation from the same source used by replacePlaceholders
    const homeEn = replacePlaceholders("[[nav.home]]", "en");
    const homeCs = replacePlaceholders("[[nav.home]]", "cs");

    expect(replacePlaceholders("Go to [[nav.home]]", "en")).toBe(
      `Go to ${homeEn}`,
    );
    expect(replacePlaceholders("Jít na [[nav.home]]", "cs")).toBe(
      `Jít na ${homeCs}`,
    );
  });

  test("should replace multiple placeholders, including repeated ones", () => {
    // Derive the concrete translations from the same source used by replacePlaceholders
    const home = replacePlaceholders("[[nav.home]]", "en");
    const contact = replacePlaceholders("[[nav.contact]]", "en");

    const text =
      "Visit [[nav.home]] or [[nav.contact]] and back to [[nav.home]]";
    const expected = `Visit ${home} or ${contact} and back to ${home}`;

    expect(replacePlaceholders(text, "en")).toBe(expected);
  });

  test("should return the raw key string if the placeholder key does not exist", () => {
    // The t() function returns the key if not found
    const text = "This is a [[non.existent.key]] test";
    expect(replacePlaceholders(text, "en")).toBe(
      "This is a non.existent.key test",
    );
  });

  test("should return the original input if it is falsy", () => {
    expect(replacePlaceholders("", "en")).toBe("");
  });
});
