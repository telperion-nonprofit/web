import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react"; // <-- Add this import

export default defineConfig({
  // Add react() to the integrations array
  integrations: [icon({ include: { mdi: ["*"] } }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
