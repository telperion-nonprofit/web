import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const clankyCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/clanky" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default("Telperion"),
  }),
});

export const collections = {
  clanky: clankyCollection,
};
