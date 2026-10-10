# Vision

> Owned by Kacper Adler; drafted by onboarding on 2026-10-10, ticket KA0001.

## Purpose

kacperadler.pl is Kacper Adler's portfolio: who he is and what he does. The offer is web apps, internal tools, landing pages, business-card sites and mobile apps. It is for the people who might hire him, and it succeeds when they send the contact form.

## What stays true

- Lighthouse mobile: Performance at least 95; Accessibility, Best Practices and SEO at 100.
- axe reports zero violations.
- Without JavaScript the content is visible and the links work.
- `prefers-reduced-motion` is respected everywhere.
- The site is dark-only.
- No cookies and no third-party trackers; analytics stay self-hosted.
- The copy is Polish only.
- The host is Dokploy, on Kacper's own server; everything below rests on it.

## Directions

- The offer: email templates are dropped. New: implementing AI agents in companies, automation, and Claude Code / Codex training.
- The lead store: NocoDB is replaced; leads are stored in SQLite, on the Dokploy server, through an Astro API route rendered on demand (`prerender = false`) with the Node adapter. That route is the one exception to the static site.
- Real project case studies, then the blog, both written in Markdown or MDX through content collections, not JSON (as `src/content/projects/*.json` is today). Faza 9 of `project-plan.md` (Astro Actions with Resend) is dropped.
- Hosting stays on Dokploy. Cloudflare Pages is no longer considered; KA0002 removes `wrangler.toml` and the Cloudflare notes in the docs.
- The ticket is the unit of scope; the phases in `project-plan.md` are history. The docs move to the harness standards (`CLAUDE.md` to `AGENTS.md`): KA0002. The outdated dependencies are updated: KA0003.

## Not the goal

- Tailwind.
- Pages rendered on demand or a server runtime beyond the lead-store API route: the site stays static.
- A CMS.
- An English version.
- The light theme coming back.
- React or another islands framework.
- Always-on foreground animation.
- Moving to Cloudflare Pages, or using Cloudflare D1 for the leads.
