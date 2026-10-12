# Architecture

This document details the primary technologies and workflows used in this codebase.

## Stack Overview

### Astro SSG

Astro is used as the core framework for Static Site Generation (SSG). It allows us to build fast, content-focused websites by pre-rendering pages at build time and delivering zero JavaScript by default, unless explicitly required by interactive components (Islands architecture).

### Tailwind v4

Tailwind CSS v4 is used for styling. It provides a utility-first approach to writing CSS, enabling rapid UI development directly within markup files without the need for traditional stylesheets.

### Internationalisation

Localisation is a small, dependency-free module in `src/i18n/`. Everything is
resolved at build time, so no translation code or dictionary reaches the
browser.

- **Routing** — Czech is the default locale and has no URL prefix; English lives
  under `/en/`. Pages with translated slugs (e.g. `/kontakty` ↔ `/en/contacts`)
  are listed in `routeMap` in `src/i18n/index.ts`; `translatePath()` maps a path
  to the other locale and powers the language switcher and `hreflang` links.
- **Dictionaries** — `src/i18n/cs.ts` and `src/i18n/en.ts` are flat
  `key → string` objects. `cs.ts` defines the set of keys and `en.ts` is typed
  against it, so `astro check` fails on a missing, extra or misspelt key.
- **Lookup** — components call
  `useTranslations(getLangFromUrl(Astro.url))` and use the returned `t()`.
  Keys are typed, so `t("typo")` is a type error rather than raw text on the page.
- **Pages** — each page's markup lives once in `src/views/`. The route files in
  `src/pages/` (Czech) and `src/pages/en/` (English) only render that view, which
  picks the locale from the URL. Long-form content (articles, privacy policy)
  stays written separately per language.

### Playwright

Playwright is used for end-to-end (E2E) testing. It ensures the application works correctly across different browsers by simulating real user interactions, checking for visual regressions, and validating functionality.

## Continuous Integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request
targeting it:

- **`static`** — `format:check`, `lint`, `typecheck` (`astro check`),
  `test:unit` (node:test via tsx) and `build`. Fast, and it fails before the
  expensive browser jobs start.
- **`e2e`** — one job per Playwright project (chromium, firefox, webkit, Mobile
  Chrome, Mobile Safari), each installing only the browser it needs.
- **`ci`** — an aggregate job that fails if any of the above did. Point branch
  protection at this single check so the matrix can change without
  reconfiguring the repository.

Node is pinned through `.nvmrc` so local and CI runs agree.

### Test layout

- `tests/unit/**/*.test.ts` — `node:test` suites, run by `npm run test:unit`.
- `tests/**/*.spec.ts` — Playwright suites, run by `npm run test:e2e`.

Playwright's `testMatch` is restricted to `*.spec.ts` on purpose: the node:test
files match its default pattern, and importing them made every browser project
re-execute them.

## Dependabot

`.github/dependabot.yml` opens weekly npm and GitHub Actions updates, grouping
patch and minor bumps so one green CI run lands the whole batch.

`.github/workflows/dependabot-auto-merge.yml` then enables auto-merge on every
Dependabot PR, majors included. Auto-merge queues the merge — GitHub only
performs it once the required checks pass, so red CI still blocks an update.

When CI fails on an npm update, `.github/workflows/claude-fix-dependabot.yml`
runs Claude Code on the branch: it reads the failed log, adapts the code to the
new version and pushes the fix, which starts CI again. Claude gets one attempt
per Dependabot push; if it cannot fix the update cleanly, it comments on the PR
instead and the PR waits for a human. GitHub Actions updates are not handed to
Claude, because its GitHub App cannot change workflow files.

This needs, in the repository settings:

1. **Settings → General → Pull Requests → Allow auto-merge.**
2. A ruleset on `main` with **`CI`** as a required status check. Without a
   required check there is nothing for auto-merge to wait on.
3. The [Claude GitHub App](https://github.com/apps/claude) installed on the
   repository. Its pushes start CI; pushes made with `GITHUB_TOKEN` would not.
4. A `CLAUDE_CODE_OAUTH_TOKEN` secret (**Settings → Secrets and variables →
   Actions**), created with `claude setup-token`. The token is valid for a
   year.
