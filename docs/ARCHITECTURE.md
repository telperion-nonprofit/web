# Architecture

This document details the primary technologies and workflows used in this codebase.

## Stack Overview

### Astro SSG

Astro is used as the core framework for Static Site Generation (SSG). It allows us to build fast, content-focused websites by pre-rendering pages at build time and delivering zero JavaScript by default, unless explicitly required by interactive components (Islands architecture).

### Tailwind v4

Tailwind CSS v4 is used for styling. It provides a utility-first approach to writing CSS, enabling rapid UI development directly within markup files without the need for traditional stylesheets.

### Tolgee Headless Workflow

We utilize Tolgee for localization, but we implement a headless workflow for better performance. Instead of using heavy client-side SDKs to fetch translations dynamically in the browser, we use `tolgee extract` to pull translations into static JSON files (e.g., `src/i18n/cs-CZ.json` and `src/i18n/en.json`). These files are then imported directly into Astro components on the server side via `src/utils/i18n.ts`, ensuring zero client-side overhead for translations.

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

`.github/workflows/dependabot-auto-merge.yml` then reads the `update-type`
trailer from Dependabot's own commit and, for patch and minor updates only,
approves the PR and enables auto-merge. Major bumps are always left for a human.
Auto-merge queues the merge — GitHub only performs it once the required checks
pass, so red CI still blocks an update.

Two repository settings have to be on for this to work:

1. **Settings → General → Pull Requests → Allow auto-merge.**
2. A branch protection rule (or ruleset) on `main` with **`CI`** as a required
   status check. Without a required check there is nothing for auto-merge to
   wait on.

If the rule also requires an approving review, the workflow's approve step
covers it; delete that step if every bump should be reviewed by a person.
