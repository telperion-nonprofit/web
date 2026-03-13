# AI Instructions

This document provides strict rules and guidelines for AI agents working within this codebase. Following these rules ensures consistency, maintainability, and alignment with project goals.

## Localization Rules

### Always use `t()` from `src/utils/i18n.ts`

When adding new text or translating existing ones, you must use the custom translation hook exported from `src/utils/i18n.ts`. Do not import JSON files directly or use client-side localization tools like `localStorage`.

### Never hardcode English strings in Astro files

The default language for the codebase is Czech (`cs-CZ`). You should only see translation keys (e.g., `t('home.hero.title_main')`) or hardcoded Czech strings. Do not hardcode English strings inside `.astro` files (or `.tsx`/`.vue`/etc. files). If you need an English string, place it inside `src/i18n/en.json` and use `t('key')`.

### Organize translations logically

Group your translations logically inside `src/i18n/cs-CZ.json` and `src/i18n/en.json` using appropriate keys. For instance, data objects should follow a `[feature].[subfeature].[property]` structure (e.g., `team.jakub.role`).

## Testing Rules

### Always update Playwright tests

When adding new features or modifying existing UI structures, you must ensure existing Playwright tests pass. If you introduce new elements, consider writing new tests.

### Avoid flaky selectors

When writing Playwright tests, prefer data attributes (e.g., `data-testid`) over CSS classes if a class name is prone to changing or if it represents a complex utility structure. If testing localized UI elements, use exact translated text or structural locators.

## UI and Code Health Rules

### Respect Design Systems

Use the established design variables in `src/styles/global.css`, including `--color-cream`, `--color-brand-green`, `--font-sans`, and `@utility glass-card`.

### Avoid Invisible Body anti-patterns

To optimize SEO and LCP metrics, avoid the 'Invisible Body' anti-pattern by ensuring the server-rendered HTML is immediately visible. Do not use Tolgee loading states (e.g., `tolgee-loading` CSS classes or manual opacity manipulation) to hide the body element while waiting for client-side translations.
