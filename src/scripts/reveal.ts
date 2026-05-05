/* Reveal-on-scroll. Adds `.in` to `.reveal` elements once they enter
 * the viewport, then unobserves them - animation is one-shot.
 *
 * Skipped entirely under prefers-reduced-motion: elements get `.in`
 * immediately so the page renders in its final state without
 * transitions. */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function reveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
  if (elements.length === 0) {
    return;
  }

  const prefersReducedMotion =
    typeof matchMedia === "function" &&
    matchMedia(REDUCED_MOTION_QUERY).matches;

  if (prefersReducedMotion) {
    for (const el of elements) {
      el.classList.add("in");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  for (const el of elements) {
    observer.observe(el);
  }
}

reveal();
document.addEventListener("astro:page-load", reveal);

export {};
