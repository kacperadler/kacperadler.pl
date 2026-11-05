/* In-page links glide. A click on a link to a #fragment (the header nav,
 * the hero and section buttons, the skip link, the mobile sheet) marks
 * <html> data-glide for the next 2s, longer than the browser's smooth
 * scroll takes, and global.css makes a scroll smooth only under that mark,
 * under prefers-reduced-motion: no-preference. Every other scroll jumps at
 * once: Tab bringing the focused element into view, a script's
 * scrollIntoView, a page opened on a #fragment. A glide already under way
 * runs to its end when the mark goes. Capture phase: the ClientRouter
 * handles the same click and starts the scroll from its own listener.
 * Without JavaScript a link jumps to its section. */

const GLIDE_MS = 2000;
const root = document.documentElement;

document.addEventListener(
  "click",
  (event) => {
    if (!(event.target as Element | null)?.closest("a[href*='#']")) {
      return;
    }
    root.dataset.glide = "";
    window.setTimeout(() => {
      delete root.dataset.glide;
    }, GLIDE_MS);
  },
  true
);
