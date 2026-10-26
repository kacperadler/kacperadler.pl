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
- 2026-10-14: FAQ data security: AI through the API or business plans that do not train on client data; no DPA promise, no on-premise promise. The company field (KA0096) and the free-month row (KA0097) are their own tickets. Claude Code and Codex training stay in the vision; the page follows the brief.
- 2026-10-14: Plan approved by the human: plan.md at c9517fa
- 2026-10-14: The human: when the worker ends, run a preview for him before the review; the review starts only after his ok on the preview.
- 2026-10-14: The worker hit the $5 budget mid-work; the coordinator raised it to $12 for this large ticket.
- 2026-10-14: The human: no budget limit for this worker if it stops on the budget again (h continue --budget 0).
- 2026-10-14: The human sent the final copy, `tresc.md` in this folder: it replaces the plan's copy wherever they differ, word for word. Pending his answer: the visible [DO UZUPEŁNIENIA] placeholders, the company field (KA0096) and the calendar line (KA0093); until then those stay out.
- 2026-10-14: The human sent the final version of `tresc.md` (replaces the earlier one): "aplikacje szyte na miarę" in description, hero, example 5, offer and footer, plus the FAQ "Czy zajmujesz się tylko AI?".
- 2026-10-14: The human's preview feedback (`preview-feedback-1.jpg` to `-3.jpg`): (1) in "Pełne doświadczenie" the cards keep rules between them but no frame around the whole grid; settle the hover animation to fit; (2) FAQ is empty on its right side; (3) Contact is empty on its right side. Otherwise the page looks good.
- 2026-10-14: The human: after those three, an Opus agent checks the whole page's look and copy (does it hang together, what copy to change, what to reorder, spacing, swaps) and its list goes to the worker, also on Opus; then the human checks again: another round or the review.
- 2026-10-15: The human looked at the copy commits: looks better, but (screenshots `feedback-2026-10-15-hero.jpg`, `feedback-2026-10-15-form.jpg`): more vertical spacing in places, the layout feels a bit cramped; the hero's right side should show something other than his photo and bio (propose); „Pracowałem z firmami od korporacji po startupy.” becomes „Od korporacji po startupy.”; the form's „Czego potrzebujesz” options match the input's height and alignment, and work as checkboxes (several at once) while looking the same.
- 2026-10-26: The human, after the live preview: new hero copy (title, subtitle, buttons, right panel "W liczbach" rows and "Zobacz realizacje"), sent verbatim to the worker; align everything neatly; the client logo strip stays.
