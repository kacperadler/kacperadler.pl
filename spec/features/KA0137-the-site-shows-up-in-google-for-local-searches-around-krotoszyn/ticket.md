# KA0137 - The site shows up in Google for local searches around Krotoszyn

```json
{
  "id": "KA0137",
  "title": "The site shows up in Google for local searches around Krotoszyn",
  "date": "2026-10-29"
}
```

## Description

Someone near Krotoszyn who searches Google for AI, automation, programming, systems or apps together with a nearby town (Krotoszyn, Ostrów Wielkopolski, Jarocin, Kalisz, Pleszew, Koźmin, Zduny...) should find kacperadler.pl. Today the site says nothing local: `src/lib/seo.ts:101` gives `areaServed: ["Poland", "European Union"]`, and no page names a town.

## Goal

The site names where Kacper works, in the copy and in the structured data Google reads, so it can rank for "<service> <town>" searches in the Krotoszyn area. The biggest lever is outside the code: a Google Business Profile (Google Maps listing). The code can point to it but cannot create it.

- Kind: improvement

## Done means

- The home page copy says, in Kacper's tone, that he works with firms from Krotoszyn and nearby towns (the towns the human lists), in person or remotely; the human approves the wording.
- `ProfessionalService` JSON-LD carries `address` (Krotoszyn, wielkopolskie, PL; street only if the human publishes it) and `areaServed` with each listed town as a `City`; a test reads it from the built home page.
- Title/description of the home page mention Krotoszyn and Wielkopolska without stuffing; a test pins them.
- If the human chooses town pages: one page per town with its own real content, linked from the footer, in the sitemap; never copies with only the town name swapped.
- `npm test` and `npm run check` pass.

## Scope

In:
- `src/lib/seo.ts`, `src/data/home.ts`, the home page head, sitemap if town pages.

Out:
- Creating the Google Business Profile, reviews, directory listings: the human does these outside the code.

## Decisions

- 2026-10-29: The human asked for it: the site should come up in Google for AI/programming/systems/apps searches with Krotoszyn, Ostrów Wielkopolski, Jarocin and nearby towns.
