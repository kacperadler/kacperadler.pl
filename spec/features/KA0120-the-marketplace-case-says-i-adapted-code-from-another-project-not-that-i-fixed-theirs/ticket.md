# KA0120 - The marketplace case says I adapted code from another project, not that I fixed theirs

```json
{
  "id": "KA0120",
  "title": "The marketplace case says I adapted code from another project, not that I fixed theirs",
  "date": "2026-10-28"
}
```

## Description

The LeadBuster / LeadApartament case says the two firms "had a marketplace" whose code "was not ready", and that Kacper "took over the code and fixed it". The human, 2026-10-28: the firms obtained code from another company's project and wanted it adapted to them; Kacper did not write it from scratch, he adapted it to their needs on the basis of that other project, launched it, and now maintains, supports and develops it.

Places: `src/data/home.ts` (case "Marketplace leadów": problem, solution, effect) and `src/content/experience/leadbuster.json` and `leadapartament.json` (`description`).

## Goal

The case tells the truth about Kacper's part: adapting an existing project's code to two firms, launching it, then keeping it running and growing it.

- Kind: copy
- Model: haiku

## Done means

- Home case text, exactly (unless the human changes it in Decisions):
  - Problem: "LeadBuster i LeadApartament chciały własnego marketplace'u do sprzedaży leadów. Miały kod z innego projektu, ale nie pasował do ich potrzeb i nie działał."
  - Rozwiązanie: "Na bazie tamtego projektu dostosowałem platformę do wymagań obu firm i ją uruchomiłem."
  - Efekt: "Platforma działa od 10.2026 na leadbuster.pl i leadapartament.pl. Utrzymuję ją, wspieram i rozwijam."
- Both experience descriptions: "Marketplace do sprzedaży leadów dla LeadBuster i LeadApartament, oparty na kodzie z innego projektu. Dostosowałem go do wymagań obu firm i uruchomiłem. Platforma działa od 10.2026 - utrzymuję ją, wspieram i rozwijam."
- No other copy changes; tests that quote the old text are updated; `bun run check` and the e2e suite pass. A 390px screenshot of the case, viewport high.

## Scope

In: the three files above, and tests quoting the old text.
Out: other cases, layout.

## Decisions

- 2026-10-28: The human corrected the facts of the case (see Description).
- 2026-10-28: The human approved the proposed text as is.
