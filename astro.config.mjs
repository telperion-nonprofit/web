import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/static";

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
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});