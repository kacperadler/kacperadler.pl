/* The blueprint's script (global.css): keeps every cell's outer width, in
 * px, in --bl-w on the cell (card.astro prints it in the item number of a
 * selected cell), from a ResizeObserver: a CSS query container would read
 * it alone, but its layout containment breaks the subgrids the home
 * sections make of their cells.
 *
 * <html> data-bl-live says this script runs (the width readout shows):
 * base-head.astro sets it inline before the first paint, together with
 * data-bl-enter, which plays the first screen's entrance (header.astro,
 * hero.astro). A ClientRouter swap takes the new document's bare <html>,
 * so astro:after-swap restores the live mark before the new page paints,
 * and not the entrance: a page reached through the router stands at once.
 * Without this script neither mark is set: everything shows at once. */

let sized: ResizeObserver | null = null;

function live(): void {
  document.documentElement.dataset.blLive = "";
}

function init(): void {
  sized?.disconnect();
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
