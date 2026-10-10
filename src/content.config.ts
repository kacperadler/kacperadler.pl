import { defineCollection, reference } from "astro:content";
import { readdirSync } from "node:fs";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/* Services and experience are JSON; case studies and the blog are Markdown
 * or MDX. Blog directory is empty: schema is defined so posts can land
 * without touching this file. */

const services = defineCollection({
  loader: glob({ base: "./src/content/services", pattern: "**/*.json" }),
  schema: z.object({
    description: z.string(),
    order: z.number().int().nonnegative(),
    tags: z.array(z.string()).min(1),
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

/* E2E builds (playwright.config.ts) pick the case studies with E2E_FIXTURES:
 * "1" reads the sample in tests/fixtures/case-studies while
 * src/content/case-studies holds none, so the pages, the list and the menu
 * entry are tested before real content exists (once a real .mdx lands, e2e
 * runs against it); "none" reads the empty tests/fixtures/no-case-studies,
 * the state where neither the list nor the menu entry is built. Production
 * builds never read either. */
const caseStudiesDir = "./src/content/case-studies";
let caseStudiesBase = caseStudiesDir;
if (process.env.E2E_FIXTURES === "none") {
  caseStudiesBase = "./tests/fixtures/no-case-studies";
} else if (
  process.env.E2E_FIXTURES === "1" &&
  !readdirSync(caseStudiesDir).some((file) => file.endsWith(".mdx"))
) {
  caseStudiesBase = "./tests/fixtures/case-studies";
}

const caseStudies = defineCollection({
  // The glob loader takes the entry id from `slug`, so it is the URL:
  // /realizacje/<slug>.
  loader: glob({ base: caseStudiesBase, pattern: "**/*.mdx" }),
  schema: z.object({
    company: z.string(),
    // Entry in "Z kim pracowałem" that links here; at most one case study
    // per entry (src/lib/case-studies.ts refuses a second).
    experience: reference("experience").optional(),
    period: z.string(),
    role: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    stack: z.array(z.string()).min(1),
    summary: z.string(),
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

export const collections = { blog, caseStudies, experience, services };
