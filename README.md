# Telperion z.s.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)

Welcome to the web repository for **Telperion z.s.** We inform about the environment and teach sustainable living to the young generation. Young people teach about climate through educational programs for schools and the public.

## 📚 Documentation

For detailed technical guidelines, design standards, and architecture decisions, please refer to the `docs/` folder:

*   [Architecture Documentation](docs/ARCHITECTURE.md)
*   [Design Manual](docs/DESIGN_MANUAL.md)

## 🛠️ Tech Stack

This project is built using a modern frontend stack:

*   **Astro** - For blazing fast static site generation (SSG) with zero JavaScript shipped by default.
*   **Tailwind CSS v4** - For rapid, utility-first styling.
*   **Tolgee** - For robust localization and translation management.
*   **Playwright** - For end-to-end (E2E) testing.

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.

3. **Tolgee Localization Workflow:**
   We use Tolgee to manage translations. You should pull the latest translations from the cloud before pushing new code.
   First, ensure you have the Tolgee CLI tool or use npx. Then run:
   ```bash
   npx tolgee pull --api-key <YOUR_TOLGEE_API_KEY>
   ```
   This will update the `src/i18n/cs-CZ.json` and `src/i18n/en.json` dictionaries.

## 🧪 Testing

Run the Playwright test suite to ensure everything is working correctly:

```bash
npx playwright test
```

---
*Developed for a sustainable future.*
