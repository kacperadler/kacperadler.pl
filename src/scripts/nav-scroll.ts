/* Toggles `.scrolled` on the nav wrapper when the page is scrolled
 * past 12px. rAF-throttled so we don't run the read+write per scroll
 * event. The single window listener survives ClientRouter swaps;
 * we re-resolve [data-nav-wrap] on every astro:page-load in case the
 * node identity changed. */

const SCROLL_THRESHOLD = 12;

let navWrap: HTMLElement | null = null;
let ticking = false;

function syncScrolled(): void {
  ticking = false;
  if (!navWrap) {
    return;
  }
  navWrap.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
}

function onScroll(): void {
  if (ticking) {
    return;
  }
  ticking = true;
  requestAnimationFrame(syncScrolled);
}

function bind(): void {
  navWrap = document.querySelector<HTMLElement>("[data-nav-wrap]");
  syncScrolled();
}

bind();
window.addEventListener("scroll", onScroll, { passive: true });
document.addEventListener("astro:page-load", bind);

export {};
