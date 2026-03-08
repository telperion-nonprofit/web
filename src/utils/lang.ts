export const SUPPORTED_LANGUAGES = ['cs-CZ', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'cs-CZ';

export function getSafeLanguage(): SupportedLanguage {
  const savedLanguage = localStorage.getItem('zvoleny-jazyk');

  if (savedLanguage && (SUPPORTED_LANGUAGES as readonly string[]).includes(savedLanguage)) {
    return savedLanguage as SupportedLanguage;
  }

  const browserLang = navigator.language.slice(0, 2);
  const detectedLang = browserLang === 'en' ? 'en' : 'cs-CZ';

  localStorage.setItem('zvoleny-jazyk', detectedLang);
  return detectedLang;
}
