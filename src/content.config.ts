import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/* All collections use the glob loader and JSON files for now. Projects
 * may flip to MDX later when real case-studies land - the schema +
 * filename-as-slug stay compatible. Blog directory is empty: schema
 * is defined so Faza 8 can drop posts in without touching this file. */

const services = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).min(1),
    order: z.number().int().nonnegative(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    role: z.string(),
    description: z.string(),
    glyph: z.string().min(1).max(2),
    stack: z.array(z.string()).min(1),
    order: z.number().int().nonnegative(),
    draft: z.boolean().default(false),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/experience" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string().regex(/^\d{4}-\d{2}$/),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
    description: z.string(),
    current: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    location: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { services, projects, experience, blog };
