import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";

export default defineConfig({
  experimental: {
    rustCompiler: true,
  },
  i18n: {
    defaultLocale: "cs",
    locales: ["cs", "en"],
    routing: {
      prefixDefaultLocale: false,
      strategy: "pathname",
    },
  },
  integrations: [icon({ include: { mdi: ["*"] } }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
