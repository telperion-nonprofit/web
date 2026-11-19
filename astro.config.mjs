import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

import sentry from "@sentry/astro";

// Sentry reports only from Vercel deployments (production and previews), never
// from `astro dev` or the CI test runs. SENTRY_ENABLED=true turns it on for a
// local build, SENTRY_ENABLED=false turns it off on Vercel.
const sentryEnabled =
  (process.env.SENTRY_ENABLED ?? String(process.env.VERCEL === "1")) === "true";
// Set on the Vercel project by the Sentry integration; without it the build
// still reports errors, only the stack traces stay minified.
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;
const sentryRelease = process.env.VERCEL_GIT_COMMIT_SHA;

export default defineConfig({
  site: "https://www.telperion.cz",
  adapter: vercel(),
  i18n: {
    defaultLocale: "cs",
    locales: ["cs", "en"],
    routing: {
      prefixDefaultLocale: false,
      strategy: "pathname",
    },
  },
  integrations: [
    icon(),
    react(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return ![/^\/test(\/|$)/, /\/404\/?$/, /\/500\/?$/].some((pattern) =>
          pattern.test(pathname),
        );
      },
    }),
    sentry({
      // Every page is prerendered, so there is no server runtime to monitor.
      enabled: { client: sentryEnabled, server: false },
      // The project whose DSN is in sentry.client.config.js. Set here rather
      // than read from SENTRY_ORG/SENTRY_PROJECT so the source maps can never
      // go to a different project than the errors.
      org: "telperion-zs-x4",
      project: "sentry-chestnut-clock",
      authToken: sentryAuthToken,
      release: { name: sentryRelease },
      sourcemaps: {
        disable: !sentryEnabled || !sentryAuthToken,
      },
      telemetry: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Read by sentry.client.config.js, which runs in the browser and cannot
    // see the build's environment variables.
    define: {
      __SENTRY_ENVIRONMENT__: JSON.stringify(
        process.env.VERCEL_ENV ?? "development",
      ),
      __SENTRY_RELEASE__: sentryRelease
        ? JSON.stringify(sentryRelease)
        : "undefined",
    },
  },
});
