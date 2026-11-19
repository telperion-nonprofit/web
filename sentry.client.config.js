/* global __SENTRY_ENVIRONMENT__, __SENTRY_RELEASE__ */
import * as Sentry from "@sentry/astro";

const tracesSampleRate = Number.parseFloat(
  import.meta.env.PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0",
);

Sentry.init({
  // Public by design: it only lets a browser send events to this project. It
  // must match the org/project in astro.config.mjs that gets the source maps.
  dsn: "https://4f06a8379dc7345af00f68650e900826@o4511677959962624.ingest.de.sentry.io/4511677961142352",
  // Filled in at build time by astro.config.mjs from VERCEL_ENV and
  // VERCEL_GIT_COMMIT_SHA, so previews never mix with production.
  environment: __SENTRY_ENVIRONMENT__,
  release: __SENTRY_RELEASE__,
  // SDK v11 replaced `sendDefaultPii` with this and collects everything by
  // default, including the visitor's IP address. Keep what the privacy policy
  // promises: no IP address, user data, cookies or request bodies.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpBodies: [],
  },
  tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
