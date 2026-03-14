import cs from "../i18n/cs-CZ.json" with { type: "json" };
import en from "../i18n/en.json" with { type: "json" };

export const translations = {
  cs,
  en,
};

export type Locale = keyof typeof translations;

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "en") return "en";
  return "cs";
}

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

export function useTranslations(lang: Locale) {
  const cache = new Map<string, string>();

  return function t(key: string): string {
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const keys = key.split(".");
    let value = getNestedValue(translations[lang], keys);

    if (value === undefined && lang === "en") {
      value = getNestedValue(translations["cs"], keys);
    }

    const finalValue = value ?? key;
    cache.set(key, finalValue);

    return finalValue;
  };
}

const PLACEHOLDER_REGEX = /\[\[([^\]]+)\]\]/g;

export function replacePlaceholders(text: string, lang: Locale): string {
  if (!text) return text;
  const translator = useTranslations(lang);
  return text.replace(PLACEHOLDER_REGEX, (_, key) => {
    return translator(key);
  });
}
