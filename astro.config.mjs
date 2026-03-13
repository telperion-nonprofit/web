import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.telperion.cz",
  i18n: {
    defaultLocale: "cs",
    locales: ["cs", "en"],
    routing: {
      prefixDefaultLocale: false,
      strategy: "pathname",
    },
  },
  integrations: [icon(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
