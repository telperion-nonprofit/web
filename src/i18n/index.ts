import { cs, type Dictionary, type TranslationKey } from "./cs";
import { en } from "./en";

export type { TranslationKey };

export const locales = ["cs", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "cs";

const dictionaries: Record<Locale, Dictionary> = { cs, en };

/** BCP 47 tag for `<html lang>`. */
export const htmlLang: Record<Locale, string> = { cs: "cs-CZ", en: "en" };

/** Endonyms shown in the language switcher. */
export const localeNames: Record<Locale, string> = {
  cs: "Čeština",
  en: "English",
};

export function isLocale(value: unknown): value is Locale {
  return (locales as readonly unknown[]).includes(value);
}

/**
 * The default locale has no URL prefix; every other locale lives under
 * `/<locale>/`. Only a whole first segment counts, so `/energetika` is Czech.
 */
export function getLangFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split("/");
  return isLocale(segment) ? segment : defaultLocale;
}

export function useTranslations(lang: Locale) {
  const dictionary = dictionaries[lang];
  return function t(key: TranslationKey): string {
    return dictionary[key];
  };
}

/**
 * Czech base path → English base path for pages whose slugs are translated.
 * Paths not listed here only gain or lose the `/en` prefix.
 */
const routeMap: Record<string, string> = {
  "/kontakty": "/en/contacts",
  "/clanky": "/en/articles",
  "/programy/pro-skoly": "/en/workshops/for-schools",
  "/programy/pro-verejnost": "/en/workshops/for-public",
  "/programy/dalsi-programy": "/en/workshops/other",
  "/ochrana-osobnich-udaju": "/en/privacy-policy",
  "/socialni-site": "/en/social-media",
};

const reverseRouteMap: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([cz, en]) => [en, cz]),
);

const routeMapEntries = Object.entries(routeMap);

/**
 * Translates a path between Czech and English based on the routeMap.
 * Handles exact matches and sub-paths (e.g., articles/slug).
 */
export function translatePath(path: string, toLang: Locale): string {
  const isEn = path === "/en" || path.startsWith("/en/");

  if (toLang === "en") {
    if (isEn) return path;

    const exactMatch = routeMap[path];
    if (exactMatch) return exactMatch;

    for (const [czBase, enBase] of routeMapEntries) {
      if (path.startsWith(`${czBase}/`)) {
        return path.replace(czBase, enBase);
      }
    }

    return `/en${path === "/" ? "" : path}`;
  }

  if (!isEn) return path;

  const exactMatch = reverseRouteMap[path];
  if (exactMatch) return exactMatch;

  for (const [czBase, enBase] of routeMapEntries) {
    if (path.startsWith(`${enBase}/`)) {
      return path.replace(enBase, czBase);
    }
  }

  return path.replace(/^\/en(?=\/|$)/, "") || "/";
}
