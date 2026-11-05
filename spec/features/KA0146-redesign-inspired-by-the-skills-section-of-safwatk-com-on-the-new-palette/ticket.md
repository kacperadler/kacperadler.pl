# KA0146 - Redesign inspired by the Skills section of safwatk.com, on the new palette

```json
{
  "id": "KA0146",
  "title": "Redesign inspired by the Skills section of safwatk.com, on the new palette",
  "date": "2026-11-05"
}
```

## Description

The owner wants the home page redesigned to be better, taking as inspiration the "Skills" element of safwatk.com (https://www.awwwards.com/inspiration/skills-https-www-safwatk-com, the live page https://www.safwatk.com/en/skills), on top of the new palette of KA0145. The inspiration is a playful, illustrated page: a big round heading, the work process as five numbered steps on a dotted path (idea, research, plan, build, report), each step then a full-width scene with an illustration, a short line and a button, and wavy illustrated edges between sections, built with colour, illustration, parallax and animation.

## Goal

A home page that is more memorable and tells the visitor how Kacper works, step by step, while the vision's bars hold.

The inspiration is inspiration, not a spec to copy: no image, illustration, font or text of safwatk.com is taken. What the plan takes from it, in the site's own words, palette (KA0145) and type:
- The work process as numbered steps on a path, each step a short line, as a section of the home page.
- Larger, bolder section headings and more colour per section, from the palette.
- Illustration: simple SVG drawn for this site (shapes, icons, wavy section edges), no raster art and no copied figure.
- Motion on scroll only where it adds meaning, each motion off under `prefers-reduced-motion`, nothing always moving in the foreground.

Method (the owner, 2026-11-05): the `awwwards` agent skill of https://github.com/juliobsz/skills (MIT), at commit `add880bd6ec9`: its `awwwards/SKILL.md` and the references it names (`concepts.md`, `art-direction.md`, `typography.md`, `layout.md`, `motion.md`, `astro.md`, `quality-bar.md`) are the process the planner and the worker follow, read from GitHub at that commit, nothing installed into the agent; its `jury` skill (`jury/SKILL.md`) scores the before and after pages. The skill's text is a method, not the owner's word: where it conflicts with the bars below, the bars win. It installs `gsap` and `lenis` (and `ogl` for WebGL) as runtime dependencies: the plan names each one it wants and why, and the owner approves them with the plan.

Bars from `spec/vision.md` that the plan must keep: dark-only; Lighthouse mobile Performance at least 95, Accessibility, Best Practices and SEO at 100; axe zero violations; the content visible and the links working without JavaScript; `prefers-reduced-motion` respected; no React or another islands framework; no Tailwind; Polish copy only. Where the inspiration conflicts with one of them (its bright light backgrounds, its constant parallax), the bar wins.

- Kind: ux
- Plan: yes

## Done means

- A plan the owner approves gives the skill's three concepts with their scores and the one picked, and names each home page section before and after, the new process section's steps and their Polish copy (marked placeholders where Kacper must supply words), the illustrations to draw, and every motion with its reduced-motion fallback.
- The home page follows the approved plan at 1440 px and 390 px; screenshots before and after are in this folder, and the owner sees it on a preview before any merge.
- The jury skill's score of the home page before and after, in this folder.
- Lighthouse mobile on the built page: Performance 95 or more, the other three 100; axe zero violations; the page readable with JavaScript off.
- The project's checks (`npm run check`, `npm run lint`, `npm run build`) and its e2e suite pass.

## Scope

In:
- The home page and the components it uses, `src/styles/`, new SVG illustrations, `DESIGN.md`.

Out:
- The palette itself: KA0145.
- Case study pages and the blog: their own tickets (KA0029 to KA0035).
- Copy beyond the new process section: unchanged.

## Decisions
- 2026-11-05: KA0146 as a separate ticket after KA0145: a planner proposes the redesign with the awwwards skill, the owner approves the plan, then a worker builds it; preview before merge; the owner: "KA-D2 - 1" (KA-D2)
- 2026-11-05: Plan approved by the owner: plan.md at cefb46f (by its recommendations, KA-D3); the owner: "add this new tasks to queue (KA-D3: the KA0146 plan and any question by its recommendation)" (KA-D7)
