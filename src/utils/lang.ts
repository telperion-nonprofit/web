export const SUPPORTED_LANGUAGES = ["cs-CZ", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "cs-CZ";

export function getSafeLanguage(): SupportedLanguage {
  // Use the URL pathname to strictly determine the language
  if (typeof window !== "undefined") {
    const isEn =
      window.location.pathname === "/en" ||
      window.location.pathname.startsWith("/en/");
    return isEn ? "en" : "cs-CZ";
  }

  // Fallback for SSR (should use Astro.currentLocale there instead)
  return DEFAULT_LANGUAGE;
}
