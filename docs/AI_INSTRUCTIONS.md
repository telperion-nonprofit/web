# AI Instructions

This document provides strict rules and guidelines for AI agents working within this codebase. Following these rules ensures consistency, maintainability, and alignment with project goals.

## Localization Rules

### Always use `t()` from `src/i18n`

When adding new text or translating existing ones, use `useTranslations(getLangFromUrl(Astro.url))` from `src/i18n/index.ts` and its `t()` function. Do not import the dictionaries directly into components, ship them to client-side scripts, or use client-side localization tools like `localStorage`.

### Never hardcode English strings in Astro files

The default language for the codebase is Czech (`cs`). UI text belongs in the dictionaries and is rendered with `t('key')` (e.g., `t('home.hero.title_main')`). Do not hardcode user-facing strings in `.astro` files; add the key to both `src/i18n/cs.ts` and `src/i18n/en.ts` instead. `npm run typecheck` fails when a key is missing from either file.

### Write each page once

Page markup lives in `src/views/`. The Czech route in `src/pages/` and its English counterpart in `src/pages/en/` only render the shared view. Do not copy a page per language; if a page gets a translated slug, add it to `routeMap` in `src/i18n/index.ts`.

### Organize translations logically

Group your translations logically inside `src/i18n/cs.ts` and `src/i18n/en.ts`, keeping both files in the same order. Keys follow a `[feature].[subfeature].[property]` structure (e.g., `team.jakub_nekvasil.role`).

## Testing Rules

### Always update Playwright tests

When adding new features or modifying existing UI structures, you must ensure existing Playwright tests pass. If you introduce new elements, consider writing new tests.

### Avoid flaky selectors

When writing Playwright tests, prefer data attributes (e.g., `data-testid`) over CSS classes if a class name is prone to changing or if it represents a complex utility structure. If testing localized UI elements, use exact translated text or structural locators.

## UI and Code Health Rules

### Respect Design Systems

Use the established design variables in `src/styles/global.css`, including `--color-cream`, `--color-brand-green`, `--font-sans`, and `@utility glass-card`.

### Avoid Invisible Body anti-patterns

To optimize SEO and LCP metrics, avoid the 'Invisible Body' anti-pattern by ensuring the server-rendered HTML is immediately visible. Do not hide the body (e.g., loading classes or manual opacity manipulation) while waiting for client-side scripts; all translations are already in the server-rendered HTML.
