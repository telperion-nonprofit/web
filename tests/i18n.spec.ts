import { test, expect } from "@playwright/test";
import { replacePlaceholders } from "../src/utils/i18n";

test.describe("i18n replacePlaceholders", () => {
  test("should return the original text if there are no placeholders", () => {
    const text = "Hello World!";
    expect(replacePlaceholders(text, "en")).toBe(text);
    expect(replacePlaceholders(text, "cs")).toBe(text);
  });

  test("should replace a single placeholder with the correct translation", () => {
    // en.json has "nav": { "home": "Home" }
    // cs-CZ.json has "nav": { "home": "Domů" }
    expect(replacePlaceholders("Go to [[nav.home]]", "en")).toBe("Go to Home");
    expect(replacePlaceholders("Jít na [[nav.home]]", "cs")).toBe(
      "Jít na Domů",
    );
  });

  test("should replace multiple placeholders, including repeated ones", () => {
    // en.json has "nav": { "home": "Home", "contact": "Contact" }
    const text =
      "Visit [[nav.home]] or [[nav.contact]] and back to [[nav.home]]";
    expect(replacePlaceholders(text, "en")).toBe(
      "Visit Home or Contact and back to Home",
    );
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
