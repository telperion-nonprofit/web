import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [icon({ include: { mdi: ["*"] } }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
