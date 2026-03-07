# Telperion z.s. - Web Repository

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)

Welcome to the open-source repository for the **Telperion z.s.** website. This project serves as a modern, high-performance web application designed to educate the younger generation about environmental topics through peer-to-peer communication.

This repository is publicly available as a portfolio piece to showcase modern web development practices, architectural decision-making, and technical implementation.

## 🌟 Live Project

- **Production Site:** [Insert Live Website Link Here]
- **Organization Info:** [Insert Organization Link Here]

## 🎯 Project Overview

**Telperion z.s.** believes in discussing climate change without fear-mongering or overly complex data. The approach is built on dialogue and verified facts (e.g., IPCC, Fakta o klimatu), translated into accessible, human language.

This web application reflects these values by providing a clean, accessible, and fast user experience, utilizing the latest web technologies to ensure a minimal environmental footprint while delivering content effectively.

## 🛠️ Tech Stack & Key Features

This project leverages a modern frontend stack to prioritize performance, developer experience, and user accessibility:

- **Framework:** [Astro](https://astro.build/) - Chosen for its exceptional performance, shipping zero JavaScript by default (Static Site Generation - SSG).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Utilized for rapid UI development, featuring custom utility classes (like `glass-card`) and semantic color variables (Cream, Dark Green, Brand Green) defined in the `@theme` block.
- **UI Components:** [React](https://react.dev/) - Integrated selectively via Astro islands for complex interactive components where necessary.
- **Icons:** [Astro Icon](https://www.astroicon.dev/) (with `@iconify-json/mdi`) - For efficient, inline SVG icon rendering without client-side overhead.
- **Testing:** [Playwright](https://playwright.dev/) - Comprehensive End-to-End (E2E) testing suite covering SEO, accessibility, routing, responsive design (desktop/mobile navbar), and performance attributes (LCP optimization).
- **Typography:** Self-hosted fonts ('Manrope' and 'Playfair Display') via `@fontsource-variable` to optimize loading and prevent layout shifts.

### Technical Highlights

- **Performance Optimized:** Strict enforcement of Core Web Vitals best practices. Images contributing to Largest Contentful Paint (LCP) utilize `fetchpriority="high"` and `loading="eager"`.
- **Security Focused:** Relies on SSG to minimize the attack surface. Security headers and removal of framework generator tags are verified via automated tests.
- **Accessibility (a11y):** Uses semantic HTML5, ARIA attributes for state management (e.g., `aria-expanded` for mobile menus instead of innerHTML manipulation), and maintains high contrast ratios.

## 🎨 Graphic Guidelines & UI Consistency

To maintain a high-quality, Apple HIG / MDN-inspired aesthetic, the project adheres to strict design logic:

- **Typography & Scale:** Headings use `font-serif` ('Playfair Display') and `text-brand-green` for distinct hierarchy. Body text uses `font-sans` ('Manrope') with generous line height (`leading-relaxed`) and color `text-dark-green/90` or `/80` to soften contrast slightly without compromising readability.
- **Section Kicker / Eyebrow:** All descriptive labels above main headings (e.g., "Náš tým", "Náš blog") MUST use the `<SectionBadge>` component. This enforces the consistent "Cream/Glassy" styling (`bg-cream/80 backdrop-blur-sm ... border-brand-green/30`) and spacing (`mb-6`) across all pages.
- **Color Semantics:** Do not use raw hex colors. Stick to the Tailwind variables:
  - `bg-cream` / `text-cream`
  - `bg-brand-green` / `text-brand-green`
  - `bg-dark-green` / `text-dark-green`
- **Glassmorphism:** Use the utility class `glass-card` for standard containers. Always consider adding `transform-gpu will-change-transform` for elements with hover animations to prevent rendering glitches in Chromium browsers.
- **Articles (`prose`):** Article rendering (via Tailwind Typography) is strictly overridden to ensure visual consistency: headings get bottom borders, links are semibold with no-underline (until hovered), and blockquotes receive a subtle green background fill (`bg-brand-green/5`) with a left border.

## 🚀 Getting Started

If you want to explore the code, run it locally, or contribute, follow these steps:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed. The project supports `npm`, `pnpm` (v10+), or `bun`.

### Installation

1. Clone the repository:

   ```bash
   git clone [Insert Repository URL Here]
   cd telperion-web
   ```

2. Install dependencies (using npm as an example):
   ```bash
   npm install
   ```

### Development Scripts

The `package.json` includes the following scripts:

- **Start Development Server:**

  ```bash
  npm run dev
  ```

  _Starts the local Astro development server at `http://localhost:4321`._

- **Build for Production:**

  ```bash
  npm run build
  ```

  _Generates the static site output in the `dist/` directory._

- **Preview Production Build:**
  ```bash
  npm run preview
  ```
  _Locally previews the generated static site._

## 🧪 Testing

The project uses Playwright for robust integration and E2E testing.

To run the test suite:

1. Ensure all dependencies are installed, including Playwright browsers:

   ```bash
   npx playwright install --with-deps
   ```

2. Run the tests:
   ```bash
   npx playwright test
   ```

Tests cover critical paths including SEO meta tags, layout integrity, navigation functionality across viewports, 404 error handling, and performance heuristics.

## 🤝 Contact

For inquiries regarding the project, architecture, or the organization, please reach out:

- **Email:** [Insert Email Here]
- **LinkedIn / Social:** [Insert Social Link Here]

---

_Developed with ❤️ for a sustainable future._
