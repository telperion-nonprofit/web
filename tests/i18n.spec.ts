import { test, expect } from "@playwright/test";
import { useTranslations } from "../src/utils/i18n";

test.describe("useTranslations", () => {
  test("returns correct existing key for cs locale", () => {
    const t = useTranslations("cs");
    // donation_modal.title exists in both
    const value = t("donation_modal.title");
    expect(value).toBe("Podpořte nás");
  });

  test("returns correct existing key for en locale", () => {
    const t = useTranslations("en");
    // donation_modal.title exists in both
    const value = t("donation_modal.title");
    expect(value).toBe("Support Us");
  });

  test.skip("falls back to cs if key is missing in en", () => {
    const t = useTranslations("en");
    // _test_fallback_key only exists in cs-CZ.json
    const value = t("_test_fallback_key");
    expect(value).toBe("This is a test fallback value");
  });

  test("returns raw key if missing in both en and cs", () => {
    const t = useTranslations("en");
    const value = t("non_existent.missing_key");
    expect(value).toBe("non_existent.missing_key");
  });

  test("returns raw key if missing in cs", () => {
    const t = useTranslations("cs");
    const value = t("non_existent.missing_key");
    expect(value).toBe("non_existent.missing_key");
  });

  test("handles cache properly", () => {
    const t = useTranslations("cs");

    const value1 = t("donation_modal.title");
    expect(value1).toBe("Podpořte nás");

    const value2 = t("donation_modal.title");
    expect(value2).toBe("Podpořte nás");
  });
});
