---
version: alpha
name: kacperadler.pl v2
description: Redesign track for kacperadler.pl — grid-based layout with elevated panels on a darker substrate, medium radius scale, restrained accent palette built around a single navy blue.
colors:
  ink: "#141416"
  ink-2: "#2a2a2f"
  muted: "#6b6b74"
  paper: "#f6f3ec"
  paper-2: "#efeadd"
  base: "#ebe7df"
  panel: "#f6f3ec"
  panel-elevated: "#fbf9f5"
  blue: "#1e3a5f"
  blue-2: "#2a4d7f"
  on-blue: "#f6f3ec"
typography:
  display-xl:
    fontFamily: Geist Mono
    fontSize: 60px
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: -0.035em
  display-lg:
    fontFamily: Geist Mono
    fontSize: 44px
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: -0.03em
  display-md:
    fontFamily: Geist Mono
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  label-mono:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.14em
rounded:
  xs: 6px
  sm: 10px
  md: 16px
  lg: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 96px
components:
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  panel-elevated:
    backgroundColor: "{colors.panel-elevated}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-blue}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.sm}"
    padding: "14px 22px"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.sm}"
    padding: "14px 18px"
  eyebrow:
    typography: "{typography.label-mono}"
    textColor: "{colors.muted}"
---

## Overview

`kacperadler.pl` v2 is a grid-driven, panel-based layout. The visitor sees a darker substrate (`base`) painted with a faint dot grid; the actual content lives on lighter "panels" with medium radius, so the corners of every block reveal the grid pattern around them. The aesthetic owes more to `firecrawl.dev` than to glossy "liquid glass" UIs — restrained, technical, friendly.

The v1 site (currently in production at `/`) uses the same brand colors and typography but without the grid + panel pattern. v2 is being built incrementally on `/v2` (noindex) and will replace `/` once stable.

## Themes

The YAML frontmatter above lists **light-mode** values because the DESIGN.md `alpha` schema expects single hex per color. The site supports `light | dark | system`; dark equivalents:

| Token              | Light       | Dark        |
| ------------------ | ----------- | ----------- |
| `base`             | `#ebe7df`   | `#0a0c10`   |
| `panel`            | `#f6f3ec`   | `#14171c`   |
| `panel-elevated`   | `#fbf9f5`   | `#1a1e26`   |
| `ink`              | `#141416`   | `#ece7dc`   |
| `ink-2`            | `#2a2a2f`   | `#c8c3b8`   |
| `muted`            | `#6b6b74`   | `#8b8a84`   |
| `blue`             | `#1e3a5f`   | `#8eaed8`   |

The runtime mapping happens via CSS `light-dark()` against `color-scheme` on `<html>` (see `src/styles/tokens.css`). Forced themes work via `[data-theme="light"|"dark"]` set by the theme toggle (`localStorage` key `ka:theme`, no cookies). Default — no attribute — follows `prefers-color-scheme`.

## Colors

- **`base` (`#ebe7df` / `#0a0c10`):** the substrate. Always sits behind everything else; never used as panel background. The dot grid (`grid` token, ~5% opacity) is painted on top of `base` to give the layout its rhythm.
- **`panel` (`#f6f3ec` / `#14171c`):** primary surface for content blocks. ~1 shade lighter than `base`, so the radius reads as a literal cut-out.
- **`panel-elevated` (`#fbf9f5` / `#1a1e26`):** secondary surface, used for emphasis (CTAs, hero, featured cards). ~1 step lighter again.
- **`ink` / `ink-2` / `muted`:** triadic text scale. `ink` is for headlines and primary text, `ink-2` for body copy, `muted` for metadata, eyebrows, captions.
- **`blue` (`#1e3a5f` / `#8eaed8`):** the **only** chromatic accent. Used for: link color, primary-button hover ring, eyebrow status dot, `<em>` highlights inside headings. One accent enforces the brand mark — never reach for a second hue.

## Typography

Two faces, both variable woff2:

- **Geist Mono** (the `display` and `mono` token) — used for headlines (`display-*`), eyebrows, button labels, monospace UI noise (badges, chips, status pills). The mono headline is the strongest brand signal — it reads "tech, precise, opinionated".
- **Geist** (the `sans` token, alias `body-*`) — running prose, form fields, descriptions.

Headings use negative letter-spacing (~ -0.02em to -0.035em) to feel typeset; body keeps default spacing. `text-wrap: balance` on every `h1`/`h2` so wraps don't leave orphans.

## Layout

- **Container:** max-width `1160px`, horizontal padding `var(--v2-space-md)` (16px) on mobile, lifting on wider viewports through panel padding.
- **Grid:** dot grid background (1px circle every 24px) is `radial-gradient` on `body.v2-body`. Don't replace it with full lines — the dots feel calmer and don't fight the panel borders.
- **Panel rhythm:** every section is a single panel (or 2-3 stacked panels) sitting in the container with vertical gaps showing the bg through. Breathing room between panels matters — lean toward `--v2-space-lg` (32px) gap minimum.
- **Radius scale (medium):** `xs 6 / sm 10 / md 16 / lg 24 / full`. `lg` is for hero / large content panels; `md` for cards/forms; `sm` for buttons; `xs` for chips/badges; `full` for pills and the welcome-screen mark icon.

## Components

### Panel (default surface)
Background `panel`, border `1px solid line` (≈10% ink). Radius `lg`. Default padding `lg`. Use `panel-elevated` only for the single most important block per screen (hero, primary card).

### Buttons
- **Primary** — `ink` background, `paper` text, mono-uppercase label, `sm` radius. On hover: subtle lift (`translateY(-1px)`) + soft shadow. One per screen.
- **Ghost** — transparent, `ink` text, 1px `line` border, `sm` radius. For secondary action.

Avoid filled blue buttons — `blue` is for accent text, not buttons (collides with the eyebrow dot + `<em>` highlights).

### Eyebrow
Small mono-uppercase label, `muted` color, often paired with a small blue dot (3-step shadow as a "live" indicator). Used at the start of every section to anchor it.

### Form fields
Border `1px solid line`, focus state shifts border to `blue` + a 3px `blue` wash. Errors flip border to `#c44545` + same-toned wash. Same radius (`sm`) as buttons.

## Motion

- All transitions short (`120ms` for state changes, `200ms` for hover effects). No long fades.
- `prefers-reduced-motion: reduce` is honored everywhere — pulses, transforms, transitions all collapse to instant. Test before shipping new components.
- The eyebrow's pulsing dot is the only "always-on" animation. Keep it that way — adding more starts to feel busy.

## Do's and Don'ts

- ✅ **Do** keep the dot-grid bg uninterrupted across the page — it's the thread that ties every panel together.
- ✅ **Do** use `panel-elevated` for at most one block per screen.
- ✅ **Do** respect the `light-dark()` model — every new color token must have both light + dark values.
- ✅ **Do** route radius through `--v2-radius-*` tokens. Tweaking the scale should be a 5-line edit in `tokens.css`.
- ❌ **Don't** add a second accent color. Navy is the only chromatic element.
- ❌ **Don't** use solid white (`#fff`) — it breaks the warm-paper palette in light mode.
- ❌ **Don't** introduce drop shadows with chromatic tints (e.g., blue glow). Shadows are for elevation only and should read as neutral darkening.
- ❌ **Don't** mix radius scales on adjacent elements — keep the same scale level (e.g., card `md`, button-inside `sm`) consistent within a panel.
- ❌ **Don't** use `backdrop-filter: blur()` for "glass" effects. The current direction is flat panels, not frosted glass — adding blur breaks the grid-substrate read.
