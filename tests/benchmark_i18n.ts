import { test } from "node:test";
import assert from "node:assert";
import { useTranslations, translations } from "../src/utils/i18n.ts";
import cs from "../src/i18n/cs-CZ.json" with { type: "json" };
import en from "../src/i18n/en.json" with { type: "json" };

// Baseline logic
function getNestedValue(obj: any, keys: string[]): string | undefined {
  if (!obj) return undefined;

  const flatKey = keys.join(".");
  if (obj[flatKey] !== undefined) {
    return typeof obj[flatKey] === "string" ? obj[flatKey] : undefined;
  }

  let value = obj;
  for (const k of keys) {
    if (value === undefined || value === null) break;
    value = value[k];
  }
  return typeof value === "string" ? value : undefined;
}

test("Verify translations format matching", () => {
  assert.strictEqual(
    translations.en["home.hero.title_main"],
    getNestedValue(en, "home.hero.title_main".split(".")),
  );
  assert.strictEqual(
    translations.en["nav.button.donate"],
    getNestedValue(en, "nav.button.donate".split(".")),
  );
  assert.strictEqual(
    translations.en["home.fresk_modal.p1_strong"],
    getNestedValue(en, "home.fresk_modal.p1_strong".split(".")),
  );
  assert.strictEqual(
    translations.en["other.badge"],
    getNestedValue(en, "other.badge".split(".")),
  );
  assert.strictEqual(
    translations.en["non.existent.key"],
    getNestedValue(en, "non.existent.key".split(".")),
  );
  assert.strictEqual(
    translations.en["home.features.card1.text"],
    getNestedValue(en, "home.features.card1.text".split(".")),
  );
  assert.strictEqual(
    translations.en["schools.climate_days.day1_desc"],
    getNestedValue(en, "schools.climate_days.day1_desc".split(".")),
  );

  // Also verify that the actual hook handles it identically
  const t = useTranslations("en");
  assert.strictEqual(t("home.hero.title_main"), "Young people teach about");
});

test("Benchmark getNestedValue vs flattened lookups", () => {
  const numIterations = 500000;

  // Baseline run
  const startBaseline = performance.now();
  for (let i = 0; i < numIterations; i++) {
    getNestedValue(en, "home.hero.title_main".split("."));
    getNestedValue(en, "nav.button.donate".split("."));
    getNestedValue(en, "home.fresk_modal.p1_strong".split("."));
    getNestedValue(en, "other.badge".split("."));
    getNestedValue(en, "non.existent.key".split("."));
    getNestedValue(en, "home.features.card1.text".split("."));
    getNestedValue(en, "schools.climate_days.day1_desc".split("."));
  }
  const endBaseline = performance.now();
  const baselineDuration = endBaseline - startBaseline;

  // Optimized run (using the pre-flattened exports)
  const startOptimized = performance.now();
  for (let i = 0; i < numIterations; i++) {
    let _1 = translations.en["home.hero.title_main"];
    let _2 = translations.en["nav.button.donate"];
    let _3 = translations.en["home.fresk_modal.p1_strong"];
    let _4 = translations.en["other.badge"];
    let _5 = translations.en["non.existent.key"];
    let _6 = translations.en["home.features.card1.text"];
    let _7 = translations.en["schools.climate_days.day1_desc"];
  }
  const endOptimized = performance.now();
  const optimizedDuration = endOptimized - startOptimized;

  console.log(
    `\n[Baseline] Time taken for ${numIterations * 7} raw getNestedValue calls: ${baselineDuration.toFixed(2)}ms`,
  );
  console.log(
    `[Optimized] Time taken for ${numIterations * 7} flat lookups: ${optimizedDuration.toFixed(2)}ms`,
  );
  console.log(
    `[Improvement] ${(baselineDuration / optimizedDuration).toFixed(2)}x faster`,
  );
});
