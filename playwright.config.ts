import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // tests/unit/*.test.ts are node:test suites run by `npm run test:unit`. They
  // match Playwright's default testMatch, so without this every browser project
  // imported them and re-ran their TAP output inside the Playwright run.
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // CI only ever saw the HTML report's "open it locally" hint, so a failing run
  // gave no detail in the job log. Print failures inline and keep the HTML
  // report as a local artefact.
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["html"]],
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
    locale: "cs-CZ",
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: "unit",
      grep: /@unit/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      grepInvert: /@unit/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "firefox",
      grepInvert: /@unit/,
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "webkit",
      grepInvert: /@unit/,
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "Mobile Chrome",
      grepInvert: /@unit/,
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      grepInvert: /@unit/,
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --host",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    // Astro 7 daemonises `astro dev` when it detects a coding agent, and the
    // foreground process exits straight away — which Playwright reports as
    // "Process from config.webServer exited early". Pin it to the foreground.
    env: { ASTRO_DEV_BACKGROUND: "0" },
  },
});
