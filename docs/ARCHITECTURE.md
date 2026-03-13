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
