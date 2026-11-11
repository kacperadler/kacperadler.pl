# KA0170 - The awwwards skill of tponscr-debug reviews the site and proposes what to change, as a plan the owner approves

```json
{
  "id": "KA0170",
  "title": "The awwwards skill of tponscr-debug reviews the site and proposes what to change, as a plan the owner approves",
  "date": "2026-11-11"
}
```

## Description

The owner sent the `/awwwards` creative-direction skill of https://github.com/tponscr-debug/claude-skill-awwwards (MIT) and wants it tried on the site. A planner reviews the live site with it, proposes what to change, and the owner approves the plan before a worker builds it; he sees the result on a preview before any merge.

## Goal

A site that scores higher with a design jury, judged by a second method beside the `juliobsz/skills` one KA0146 and KA0152 used, while the vision's bars hold.

Method (the owner, 2026-11-11): the skill at commit `d18aa0c42b71`: its `SKILL.md` and the references it names (`references/typography.md`, `color-systems.md`, `layouts-ux.md`, `motion-design.md`, `css-techniques.md`, `webgl-3d.md`, `studios-philosophy.md`), read from GitHub at that commit, nothing installed into the agent. Its text is a method, not the owner's word: where it conflicts with the bars below, the bars win. It leans on GSAP, Lenis, Three.js and WebGL: the plan names each dependency it wants and why, and the owner approves them with the plan.

Bars from `spec/vision.md` that the plan must keep: dark-only; Lighthouse mobile Performance at least 95, Accessibility, Best Practices and SEO at 100; axe zero violations; the content visible and the links working without JavaScript; `prefers-reduced-motion` respected; no always-on foreground animation; no React or another islands framework; no Tailwind; Polish copy only; no cookies or third-party trackers.

- Kind: ux
- Plan: yes

## Done means

- A plan the owner approves: the skill's art direction for the site (emotion, archetype, typography, colour, motion), what it finds on each page today with a screenshot reference, and the changes it proposes ranked by effect, each naming the files it touches, its motion with the reduced-motion fallback, and any dependency; what the skill recommends against a bar is listed as left out, with the bar.
- The pages follow the approved plan at 1440 px and 390 px; screenshots before and after are in this folder, and the owner sees it on a preview before any merge.
- A blind jury score of the home page before and after, as KA0153 did, in this folder.
- Lighthouse mobile on the built page: Performance 95 or more, the other three 100; axe zero violations; the pages readable with JavaScript off.
- The project's checks (`npm run check`, `npm run lint`, `npm test`) and its e2e suite pass.

## Scope

In:
- The pages the approved plan names and the components they use, `src/styles/`, `DESIGN.md`.

Out:
- New content: case studies (KA0029 to KA0035, KA0095), the blog (KA0029), testimonials (KA0094).
- Copy beyond what the plan names, written with marked placeholders where Kacper must supply words.

## Decisions
- 2026-11-11: KA0170 approved: a planner reviews the site with the tponscr-debug awwwards skill and proposes a plan the owner approves; the owner: "KA-D30 - approve" (KA-D30)
- 2026-11-11: Plan approved by the owner: plan.md at ab361d3; the owner: "KA-D31 - 1" (KA-D31)
- 2026-11-11: KA0170 merges only on the owner's approval, after a preview link; KA autoMerge off until then; the owner: "when you done the kacperadler.pl redesign, run this and send me a link and merge only on my approve" (KA-D32)
- 2026-11-11: Raise the 1440px page height cap to 10100px; the plan stays whole; the owner: "KA-D33 - raise the limit" (KA-D33)
