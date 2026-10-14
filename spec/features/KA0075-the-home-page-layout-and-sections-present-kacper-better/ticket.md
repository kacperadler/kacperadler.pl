# KA0075 - The home page layout and sections present Kacper better

```json
{
  "id": "KA0075",
  "title": "The home page layout and sections present Kacper better",
  "date": "2026-10-10",
  "after": [
    "KA0072",
    "KA0071"
  ]
}
```

## Description

After KA0069 the home page runs on minimal brutalism but keeps the old order and set of sections (hero, services, how I work, experience, contact) and still sells a frontend developer. On 2026-10-14 the human sent a brief, `brief.md` in this folder: the page sells Kacper as an AI Engineer and technology partner for small and mid-sized firms, and every section leads to one action, booking a 30-minute call.

## Goal

A business owner who lands on kacperadler.pl understands within one screen what Kacper does, for whom, and what to click, and the sections below back that up and lead to contact. This rebuilds the home page to the brief.

- Kind: improvement
- Plan: tak

## Done means

- The home page has the brief's sections in its order (section 4): navigation, hero, trust bar, problems, automation examples, the three-step offer, case studies, process, about, FAQ, contact, footer. All copy is Polish and follows the brief's tone (section 3), and no heading uses jargon.
- Nothing on the page is a placeholder. Copy that needs a fact the human has not given yet (case-study numbers, testimonials, his own AI case, the calendar link, free dates) is left out, and the page reads complete without it. The tickets in "Out" add each piece later.
- The brief's removals are done (section 5). The "Wizytówki" service is gone. Mobile apps, web and landing pages become part of "Wdrożenie". The form's project types are `Audyt AI`, `Wdrożenie`, `Stała współpraca`, `Inne`; `/api/lead` accepts them, and leads already stored keep their old types.
- Title, description, OG tagline, `llms*.txt` and `knowsAbout` follow the brief's section 6. This folds in KA0051.
- The EFS+ funding note stays in the footer.
- Plan first: the plan gives the full copy of every section in Polish, built from the brief and the facts already in `src/content/`, and lists every fact it needs from the human. The human approves the copy before any code changes.
- e2e covers each section's presence and order, the form's new types (accepted by `/api/lead`, old types rejected), and the absence of the removed copy. `bun run check` and `bun run test` pass.

## Scope

In:
- `src/pages/index.astro`, `src/components/mb/sections/*`, `src/content/services/*`, `src/data/*`, `src/lib/lead.ts`, `src/lib/seo.ts`, the OG tagline, `llms*.txt`.

Out:
- The calendar booking button (KA0093), testimonials (KA0094), Kacper's own AI case with a demo (KA0095), case-study numbers and pages (KA0033 Helpfind, KA0034 Energia Direct and the other case-study tickets), the blog (KA0029).

## Decisions

- 2026-10-10: The human: "the home page layout and sections must be updated so it presents better and presents me better". Waits for the human's input and KA0072's signature choice; relates to KA0051.
- 2026-10-14: The human sent the brief (`brief.md`); the redesign follows it. KA0051 folds in here. Facts still missing get their own tickets and do not appear on the page as placeholders.
- 2026-10-14: The human approved the ticket. Audit cost credited against the implementation: not decided yet, leave that line out of the copy.
- 2026-10-14: The human: the audit cost is credited against the implementation; the offer says so ("Koszt audytu odliczam od wdrożenia.").
