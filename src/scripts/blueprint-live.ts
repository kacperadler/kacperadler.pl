/* The blueprint's pen (global.css): marks <html> data-bl-live, then marks
 * each part of the drawing data-bl-drawn once it is whole on the screen,
 * or fills it when taller, and stops watching it; the part's component
 * then draws it on a clock. A part scrolled past the top of the screen
 * before the observer saw it whole (a fast scroll) is marked too. A
 * process step is watched by its marker (on the desktop the step is
 * display: contents, no box to watch). The observer reports in steps of
 * 1% of the part's area, so "whole" allows 3% short of it.
 *
 * data-bl-live goes on before the first paint: base-head.astro sets it
 * inline, and after a ClientRouter swap (which takes the new document's
 * bare <html>) astro:after-swap sets it again before the new page paints.
 * Without this script nothing is held undrawn: the drawing stands
 * complete. */

const PARTS =
  ".mb-section-head, .mb-card, .mb-step-marker, .mb-footer, .mb-footer-bottom, .mb-hero-status";

let observer: IntersectionObserver | null = null;

function live(): void {
  document.documentElement.dataset.blLive = "";
}

function init(): void {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const box = entry.boundingClientRect;
        const screen = entry.rootBounds;
        if (!screen) {
          continue;
        }
        const whole = Math.min(box.height, screen.height);
        const seen =
          entry.intersectionRect.height >= whole * 0.97 ||
          box.bottom <= screen.top;
        if (whole > 0 && seen) {
          const part = entry.target.classList.contains("mb-step-marker")
            ? entry.target.parentElement
            : entry.target;
          if (part instanceof HTMLElement) {
            part.dataset.blDrawn = "";
          }
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
  );
  for (const part of document.querySelectorAll(PARTS)) {
    observer.observe(part);
  }
}

live();
init();
document.addEventListener("astro:after-swap", live);
document.addEventListener("astro:page-load", init);

export {};
