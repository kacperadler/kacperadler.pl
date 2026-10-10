import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/* All collections use the glob loader and JSON files for now. Projects
 * may flip to MDX later when real case-studies land - the schema +
 * filename-as-slug stay compatible. Blog directory is empty: schema
 * is defined so Faza 8 can drop posts in without touching this file. */

const services = defineCollection({
  loader: glob({ base: "./src/content/services", pattern: "**/*.json" }),
  schema: z.object({
    description: z.string(),
    order: z.number().int().nonnegative(),
    tags: z.array(z.string()).min(1),
    title: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.json" }),
  schema: z.object({
    description: z.string(),
    draft: z.boolean().default(false),
    glyph: z.string().min(1).max(2),
    order: z.number().int().nonnegative(),
    role: z.string(),
    stack: z.array(z.string()).min(1),
    title: z.string(),
  }),
});

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "**/*.json" }),
  schema: z.object({
    /* Optional override for the meta badge - replaces the default
     * year-range pill. Used for one-off engagements like "Zlecenie". */
    badge: z.string().optional(),
    company: z.string(),
    current: z.boolean().default(false),
    description: z.string(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
    location: z.string().optional(),
    order: z.number().int().nonnegative(),
    role: z.string(),
    startDate: z.string().regex(/^\d{4}-\d{2}$/),
  }),
});

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    description: z.string(),
    draft: z.boolean().default(false),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    title: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { blog, experience, projects, services };
