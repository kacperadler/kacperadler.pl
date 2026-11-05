# KA0152 - Outcome

- Merged: 2026-11-05, `f160ae0`
- Branch: arthur/2026-11-05-worker-e334f830
- Reviews: review-1.md PASS
- Cost: worker $23.09, reviews $0.87; review rounds 1

## What went in

- copy(process): the plan's duration as 2-3 dni, with a hyphen (KA0152)
- copy(services): price and audit ranges with a hyphen (KA0152)
- copy(faq): ranges in the answers with a hyphen (KA0152)
- copy(contact): 2-3 zdania with a hyphen, on the page and in llms-full (KA0152)
- copy(about): LeadApartament's entry no longer repeats LeadBuster's, years with a hyphen (KA0152)
- fix(contact-form): the success card takes no box until the form is sent, so it is no hidden text (KA0152)
- feat(brand): hover slides an ink layer out from under the mark and brightens Adler (KA0152)
- fix(link): a footer link is at least 24px high (KA0152)
- feat(motion): only an in-page link glides; Tab and scripts jump, so focus is never off screen (KA0152)
- feat(home): the page at most 9500px tall at 1440px - a tighter process zigzag, fields that halve the gap, a 120px section gap (KA0151, KA0152)
- test(a11y): axe on the home page with motion on, after the entrance and mid-process (KA0152)
- docs: page rhythm, process stagger, glide, brand hover and keyboard spec in AGENTS.md and DESIGN.md (KA0152)
- spec: KA0152 before screenshots at 1440 and 390px
- feat(link): an inline link's lime underline rises over the word on hover (KA0152)
- spec: KA0152 motion recordings, jury evidence, after screenshots, self-scored jury card and findings

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.

## Left open

- Tickets from findings: KA0154 (F1), KA0155 (F2), KA0156 (F3).
