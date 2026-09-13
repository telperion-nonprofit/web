import { test, expect } from "@playwright/test";
import { getSafeLanguage } from "../src/utils/lang";

// getSafeLanguage() only reads window.location.pathname, so a minimal stub is
// enough; `globalThis` is narrowed here instead of reaching for `any`.
type WindowStub = { location: { pathname: string } };
const g = globalThis as unknown as { window?: WindowStub };

test.describe("getSafeLanguage Utility", () => {
  let originalWindow: WindowStub | undefined;

  test.beforeAll(() => {
    // Save original window if it exists (it normally doesn't in Node, but just in case)
    originalWindow = g.window;
  });

  test.afterEach(() => {
    // Reset window after each test to ensure test isolation
    g.window = originalWindow;
  });

  test("returns cs-CZ when window is undefined (SSR fallback)", () => {
    // Ensure window is undefined for this test
    delete g.window;

    expect(getSafeLanguage()).toBe("cs-CZ");
  });

  test("returns en when window.location.pathname is exactly /en", () => {
    g.window = { location: { pathname: "/en" } };

    expect(getSafeLanguage()).toBe("en");
  });

  test("returns en when window.location.pathname starts with /en/", () => {
    g.window = { location: { pathname: "/en/about" } };

    expect(getSafeLanguage()).toBe("en");
  });

  test("returns cs-CZ for other paths", () => {
    g.window = { location: { pathname: "/about" } };

    expect(getSafeLanguage()).toBe("cs-CZ");
  });

  test("returns cs-CZ for paths that start with /en but are not English paths (e.g. /energetika)", () => {
    g.window = { location: { pathname: "/energetika" } };

    expect(getSafeLanguage()).toBe("cs-CZ");
  });

  test("returns cs-CZ for root path", () => {
    g.window = { location: { pathname: "/" } };

    expect(getSafeLanguage()).toBe("cs-CZ");
  });
});
