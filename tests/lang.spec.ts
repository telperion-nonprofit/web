import { test, expect } from "@playwright/test";
import { getSafeLanguage } from "../src/utils/lang";

test.describe("getSafeLanguage Utility", () => {
  let originalWindow: any;

  test.beforeAll(() => {
    // Save original window if it exists (it normally doesn't in Node, but just in case)
    originalWindow = global.window;
  });

  test.afterEach(() => {
    // Reset window after each test to ensure test isolation
    global.window = originalWindow;
  });

  test("returns cs-CZ when window is undefined (SSR fallback)", () => {
    // Ensure window is undefined for this test
    delete (global as any).window;

    expect(getSafeLanguage()).toBe("cs-CZ");
  });

  test("returns en when window.location.pathname is exactly /en", () => {
    (global as any).window = { location: { pathname: "/en" } };

    expect(getSafeLanguage()).toBe("en");
  });

  test("returns en when window.location.pathname starts with /en/", () => {
    (global as any).window = { location: { pathname: "/en/about" } };

    expect(getSafeLanguage()).toBe("en");
  });

  test("returns cs-CZ for other paths", () => {
    (global as any).window = { location: { pathname: "/about" } };

    expect(getSafeLanguage()).toBe("cs-CZ");
  });

  test("returns cs-CZ for paths that start with /en but are not English paths (e.g. /energetika)", () => {
    (global as any).window = { location: { pathname: "/energetika" } };

    expect(getSafeLanguage()).toBe("cs-CZ");
  });

  test("returns cs-CZ for root path", () => {
    (global as any).window = { location: { pathname: "/" } };

    expect(getSafeLanguage()).toBe("cs-CZ");
  });
});
