/* Mobile sheet open/close. The sheet is a <dialog> (mobile-sheet.astro)
 * opened by [data-menu-open] (hamburger) with showModal() and closed by
 * [data-menu-close] (X button), Escape, or any click on a
 * [data-sheet-link] inside (so anchor navigation dismisses the overlay).
 *
 * The browser does the modal part: while the sheet is open the page behind
 * is inert, focus starts on its first control (the X) and Escape closes
 * it; the scroll lock is a CSS rule on `html:has(.mb-sheet:modal)`. The
 * script wraps Tab between the first and last control inside (a modal
 * dialog lets Tab leave for the browser's own UI), keeps aria-expanded on
 * the trigger, and on every close (X, link, Escape) returns focus to the
 * trigger: the dialog hands it back to whatever held it before, which in
 * Safari, where a click does not focus a button, is not the trigger.
 *
 * Click, keydown and close listeners are document-level (event delegation;
 * close does not bubble, so it is caught on the way down), so they survive
 * ClientRouter swaps with no re-binding. A swap replaces the sheet with a
 * new, closed one and the trigger with one reading aria-expanded="false". */

function getSheet(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>("dialog#mobile-sheet");
}

// Wrap Tab at the edges of the sheet. The modal dialog already keeps the
// page out, but without the wrap Tab from the last control leaves the
// document for the browser's own UI.
function trapTab(sheet: HTMLElement, event: KeyboardEvent): void {
  const focusables = Array.from(
    sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
  );
  const [first] = focusables;
  const last = focusables.at(-1);
  if (!(first && last)) {
    return;
  }
  const active = document.activeElement;
  const inside = active instanceof Node && sheet.contains(active);
  if (event.shiftKey && (!inside || active === first)) {
    event.preventDefault();
    last.focus();
  } else if (!(event.shiftKey || (inside && active !== last))) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const sheet = getSheet();
  if (!sheet) {
    return;
  }

  // The trigger is inert while the sheet is open, so this opens a closed
  // one; showModal() focuses its first control, the X.
  const trigger = event.target.closest<HTMLElement>("[data-menu-open]");
  if (trigger) {
    sheet.showModal();
    trigger.setAttribute("aria-expanded", "true");
    return;
  }

  // The X, and anchor links inside the sheet: they close it after clicking.
  if (event.target.closest("[data-menu-close], [data-sheet-link]")) {
    sheet.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") {
    return;
  }
  const sheet = getSheet();
  if (sheet?.open) {
    trapTab(sheet, event);
  }
});

// Every way the sheet closes ends here, Escape included.
document.addEventListener(
  "close",
  (event) => {
    if (event.target !== getSheet()) {
      return;
    }
    const trigger = document.querySelector<HTMLElement>("[data-menu-open]");
    trigger?.setAttribute("aria-expanded", "false");
    trigger?.focus({ preventScroll: true });
  },
  true
);

export {};
