import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
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
      name: "Mobile Chrome",
      grepInvert: /@unit/,
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --host",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
});
