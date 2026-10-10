# Changelog

Generated from `spec/features/` by `h changelog`; a hand edit is overwritten at the next merge.

## 2026-10-10

### Added

- KA0001 Onboarding: vision and criteria for kacperadler.pl (87eb449)
- KA0003 Update dependencies, Astro to the newest release (8412871)
- KA0005 The dropped email-templates offer is still on the site (d80d012)

### Fixed

- KA0004 Harness gap: no `test` script, so `npm test` fails (a6bd5fb)
- KA0009 The privacy policy says the site stores a theme preference in `localStorage` (8a20178)
- KA0014 `@types/node` 26 typechecks against a newer Node than CI and Docker run (2ec2514)
- KA0015 The mobile menu has no accessible name (c12cd49)
- KA0016 The e2e suite cannot start Astro 7 preview: it detaches (2f475d1)
- KA0019 The modal mobile sheet does not move or hold focus (40e700a)
- KA0022 contact-form e2e spec fails now and then in parallel runs (3da9e1f)

### Changed

- KA0002 Docs match the code and the harness standards (AGENTS.md) (237e8a7)
- KA0006 Em-dashes left in generated text and docs (f8e8e2e)
- KA0008 `DESIGN.md` still describes `/v2` and the theme toggle (977143c)
- KA0010 Code comments still point at `v2-layout` and `body.v2-body` (d450f62)
- KA0012 `@/stores` path alias with no `src/stores` (aa7a919)
- KA0013 astro-icon 1.2 warns on every build about a missing `src/icons` (e5eee8c)
- KA0017 CSS still carries `light-dark()` pairs whose light half never renders (bba607f)
- KA0024 Drop editor and agent configs, Biome formats .astro instead of Prettier (478c000)
