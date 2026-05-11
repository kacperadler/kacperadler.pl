/* Spotlight cursor effect - tracks pointer over [data-spotlight]
 * elements and exposes the position as --mx / --my CSS variables
 * (in percent). The visual treatment lives in CSS - radial-gradient
 * backgrounds positioned at var(--mx) var(--my). pointermove is
 * rAF-throttled so we don't fire setProperty more than once per frame.
 *
 * Re-binds on astro:page-load because the ClientRouter swaps the
 * body wholesale (old listeners die with the old DOM). A dataset
 * marker prevents double-binding in the rare case init() runs twice
 * against the same element. */

function bind(el: HTMLElement): void {
  if (el.dataset.spotlightBound === "1") {
    return;
  }
  el.dataset.spotlightBound = "1";

  let raf = 0;
  let lastEvent: PointerEvent | null = null;

  el.addEventListener("pointermove", (event) => {
    lastEvent = event;
    if (raf) {
      return;
    }
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!lastEvent) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const x = ((lastEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((lastEvent.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    });
  });
}

function init(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  const els = document.querySelectorAll<HTMLElement>("[data-spotlight]");
  for (const el of els) {
    bind(el);
  }
}

init();
document.addEventListener("astro:page-load", init);

export {};
