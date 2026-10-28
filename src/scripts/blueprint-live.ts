/* The blueprint's pen (global.css): marks <html> data-bl-live, then marks
 * each part of the drawing data-bl-drawn once it is whole on the screen,
 * or fills it when taller, and stops watching it; the part's component
 * then draws it on a clock. A part scrolled past the top of the screen
 * before the observer saw it whole (a fast scroll) is marked too. A
 * process step is watched by its marker (on the desktop the step is
 * display: contents, no box to watch). The observer reports in steps of
 * 1% of the part's area, so "whole" allows 3% short of it.
 *
 * It also keeps every cell's outer width, in px, in --bl-w on the cell
 * (card.astro prints it in the item number of a selected cell), from a
 * ResizeObserver: a CSS query container would read it alone, but its
 * layout containment breaks the subgrids the home sections make of their
 * cells.
 *
 * data-bl-live goes on before the first paint: base-head.astro sets it
 * inline, and after a ClientRouter swap (which takes the new document's
 * bare <html>) astro:after-swap sets it again before the new page paints.
 * Without this script nothing is held undrawn: the drawing stands
 * complete. */

const PARTS =
  ".mb-section-head, .mb-card, .mb-step-marker, .mb-footer, .mb-footer-bottom, .mb-hero-status";

let seen: IntersectionObserver | null = null;
let sized: ResizeObserver | null = null;

function live(): void {
  document.documentElement.dataset.blLive = "";
}

function init(): void {
  seen?.disconnect();
  sized?.disconnect();
  seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const box = entry.boundingClientRect;
        const screen = entry.rootBounds;
        if (!screen) {
          continue;
        }
        const whole = Math.min(box.height, screen.height);
        const isSeen =
          entry.intersectionRect.height >= whole * 0.97 ||
          box.bottom <= screen.top;
        if (whole > 0 && isSeen) {
          const part = entry.target.classList.contains("mb-step-marker")
            ? entry.target.parentElement
            : entry.target;
          if (part instanceof HTMLElement) {
            part.dataset.blDrawn = "";
          }
          seen?.unobserve(entry.target);
        }
      }
    },
    { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
  );
  for (const part of document.querySelectorAll(PARTS)) {
    seen.observe(part);
  }

  sized = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.borderBoxSize[0]?.inlineSize ?? 0;
      (entry.target as HTMLElement).style.setProperty(
        "--bl-w",
        String(Math.round(width))
      );
    }
  });
  for (const cell of document.querySelectorAll(".mb-card")) {
    sized.observe(cell);
  }
}

live();
init();
document.addEventListener("astro:after-swap", live);
document.addEventListener("astro:page-load", init);

export {};
