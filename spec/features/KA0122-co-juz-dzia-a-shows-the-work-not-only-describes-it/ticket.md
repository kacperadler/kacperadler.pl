# KA0122 - "Co już działa" shows the work, not only describes it

```json
{
  "id": "KA0122",
  "title": "\"Co już działa\" shows the work, not only describes it",
  "date": "2026-10-28"
}
```

## Description

Taste Skill imagery floor ("at least four real pictures ... for software, its cropped interface fragments count") and `critique.md` cap "fewer than four real pictures: design cannot exceed 6.5"; `copy.md` §5 "Show the thing itself, large. A real demonstration outranks any quote." `inspect.mjs`: 1 real picture on the page (`me.webp`), `few-pictures` FAIL at 1440. The cases are the page's proof and every one of them is text in a ruled table; the logos naming the companies stay grey on a phone, which has no hover to light them. Throwaway: a 16:9 picture of the product under each logo, here the public home pages of rex.hr and leadbuster.pl captured 2026-10-28 as stand-ins (rex.hr's own app screen is visible in its hero) (`screenshots/p2-cases-{1440,390}-{before,after}.png`). The picture also breaks the three-grids-in-a-row sameness (problems, services, cases) from inside the cells.

## Goal

Each case shows a real picture of the work Kacper built, so a visitor sees proof, not only a description.

- Kind: improvement

Evidence:
- cases (#cases), `src/components/mb/sections/cases.astro:63-106` (cell: logo head, problem / solution / effect), `:132-136` (five subgrid rows), `:165-180` (logos grey at 0.6 opacity until hover)
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: one picture per case, chosen by the human: a cropped screen of the interface he built (ReX's recruiter view, the lead marketplace, the Helpfind CRM if it may be shown, two phone screens of the Energia Direct app), same ratio and treatment for all four, `alt` saying what it shows; logos in their colours on touch screens. Visitor sees: the products themselves before the words about them. Cost: the human supplies the screenshots and confirms each may be published (the internal CRM may not); about 25 lines in `cases.astro` (a sixth subgrid row) and `astro:assets` images; `home.spec.ts` cases checks rerun. Approved decision: adds a row to the KA0075 cases cell (2026-10-26: h3 is the logo, badge beside it); the copy stays. Related: KA0095 (own automation with a demo) and the case-study pages KA0030-KA0035.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- one picture per case, chosen by the human: a cropped screen of the interface he built (ReX's recruiter view, the lead marketplace, the Helpfind CRM if it may be shown, two phone screens of the Energia Direct app), same ratio and treatment for all four, `alt` saying what it shows; logos in their colours on touch screens. Visitor sees: the products themselves before the words about them. Cost: the human supplies the screenshots and confirms each may be published (the internal CRM may not); about 25 lines in `cases.astro` (a sixth subgrid row) and `astro:assets` images; `home.spec.ts` cases checks rerun. Approved decision: adds a row to the KA0075 cases cell (2026-10-26: h3 is the logo, badge beside it); the copy stays. Related: KA0095 (own automation with a demo) and the case-study pages KA0030-KA0035.

## Decisions

- 2026-10-28: Source: F2 of KA0118
- 2026-10-28: Waits for the human's publishable product screenshots; start only once he sends them.
