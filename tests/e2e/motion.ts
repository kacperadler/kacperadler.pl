import type { Page } from "@playwright/test";

// What may still transition under reduced motion: colour and opacity fades
// (a filter only greys the logos), and the discrete properties that keep a
// fading element shown until its fade ends. Everything else moves - a
// transform, a height, a shadow sliding out, a focus ring growing to its
// offset - and sits inside prefers-reduced-motion: no-preference.
export const FADES: readonly string[] = [
  "background-color",
  "border-color",
  // The longhands a border-color transition reports in its events.
  "border-bottom-color",
  "border-left-color",
  "border-right-color",
  "border-top-color",
  "color",
  "display",
  "filter",
  "opacity",
  "overlay",
  "text-decoration-color",
  "visibility",
];

// Every element of the page and its ::before, ::after and ::details-content
// that would move: a transition of something but a fade (a declared one,
// with a duration), any animation, and the page's smooth scrolling. Under
// reduced motion the list is empty.
export const motionOf = (page: Page) =>
  page.evaluate((fades) => {
    const found: string[] = [];
    const scroll = getComputedStyle(document.documentElement).scrollBehavior;
    if (scroll !== "auto") {
      found.push(`html scroll-behavior: ${scroll}`);
    }
    const elements = [
      document.documentElement,
      ...document.querySelectorAll("body *"),
    ];
    for (const el of elements) {
      for (const pseudo of [null, "::before", "::after", "::details-content"]) {
        const style = getComputedStyle(el, pseudo);
        const what = `${el.tagName.toLowerCase()}.${String(el.getAttribute("class"))}${pseudo ?? ""}`;
        const durations = style.transitionDuration.split(", ");
        style.transitionProperty.split(", ").forEach((property, i) => {
          const duration = durations[i % durations.length] ?? "0s";
          if (
            property !== "none" &&
            Number.parseFloat(duration) > 0 &&
            !fades.includes(property)
          ) {
            found.push(`${what} transition: ${property} ${duration}`);
          }
        });
        if (style.animationName !== "none") {
          found.push(`${what} animation: ${style.animationName}`);
        }
      }
    }
    return found;
  }, FADES);
