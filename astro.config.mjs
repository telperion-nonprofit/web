import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

export default defineConfig({
  integrations: [icon({ include: { mdi: ["*"] } })],
  vite: {
    plugins: [tailwindcss()],
  },
});
