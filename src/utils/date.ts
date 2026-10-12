import type { Locale } from "../i18n";

const cache = new Map<string, Intl.DateTimeFormat>();

/**
 * Formats a date according to the specified locale.
 * Uses a cache for Intl.DateTimeFormat instances to optimize performance.
 *
 * @param date The date to format
 * @param lang The locale to use ('cs' or 'en', defaults to 'cs')
 * @returns Formatted date string
 */
export function formatDate(date: Date, lang: Locale = "cs"): string {
  const locale = lang === "en" ? "en-US" : "cs-CZ";

  if (!cache.has(locale)) {
    cache.set(
      locale,
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }

  return cache.get(locale)!.format(date);
}
