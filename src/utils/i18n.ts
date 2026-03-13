import cs from "../i18n/cs-CZ.json";
import en from "../i18n/en.json";

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

export function useTranslations(lang: Locale) {
  return function t(key: string): string {
    const keys = key.split(".");
    let value: any = translations[lang];

    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = value[k];
    }

    if (value === undefined || typeof value !== "string") {
      // Fallback to cs if missing in en
      if (lang === "en") {
        let csValue: any = translations["cs"];
        for (const k of keys) {
          if (csValue === undefined || csValue === null) break;
          csValue = csValue[k];
        }
        if (typeof csValue === "string") return csValue;
      }
      return key;
    }

    return value;
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
