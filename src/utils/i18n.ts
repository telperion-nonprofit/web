import cs from "../i18n/cs-CZ.json" with { type: "json" };
import en from "../i18n/en.json" with { type: "json" };

export type Locale = "cs" | "en";

function flattenTranslations(obj: any, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};

  if (!obj || typeof obj !== "object") return result;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === "string") {
        result[propName] = value;
      } else if (typeof value === "object" && value !== null) {
        const flatObj = flattenTranslations(value, propName);
        Object.assign(result, flatObj);
      }
    }
  }

  return result;
}

const flatCs = flattenTranslations(cs);
const flatEn = flattenTranslations(en);

export const translations = {
  cs: flatCs,
  en: flatEn,
};

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "en") return "en";
  return "cs";
}

const globalCache = new Map<Locale, Map<string, string>>();

export function useTranslations(lang: Locale) {
  if (!globalCache.has(lang)) {
    globalCache.set(lang, new Map<string, string>());
  }
  const cache = globalCache.get(lang)!;

  return function t(key: string): string {
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    let value = translations[lang][key];

    if (value === undefined && lang === "en") {
      value = translations["cs"][key];
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
