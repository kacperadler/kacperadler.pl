/* Mobile sheet open/close. The sheet is opened by [data-menu-open]
 * (hamburger) and closed by [data-menu-close] (X button), Escape, or
 * any click on a [data-sheet-link] inside (so anchor navigation
 * dismisses the overlay).
 *
 * The visibility flag is data-mobile-sheet="open" - CSS in
 * mobile-sheet.astro keys on it. Synced ARIA: aria-expanded on the
 * trigger, aria-hidden on the sheet itself.
 *
 * The sheet is a modal dialog: while it is open every other child of
 * <body> is `inert`, focus starts on the close button and Tab wraps
 * between the first and last control inside. Every user close (X,
 * link, Escape) returns focus to the trigger.
 *
 * Click + keydown listeners are document-level (event delegation +
 * one keydown for Escape / Tab), so they survive ClientRouter swaps
 * with no re-binding. */

function getSheet(): HTMLElement | null {
  // Look up by id, not by [data-mobile-sheet]: the attribute is removed
  // when the sheet is closed, so an attribute selector would break every
  // subsequent open after syncOnLoad runs.
  return document.getElementById("mobile-sheet");
}

function getOpenButton(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-menu-open]");
}

function isOpen(sheet: HTMLElement): boolean {
  return sheet.dataset.mobileSheet === "open";
}

function getFocusables(sheet: HTMLElement): HTMLElement[] {
  return Array.from(
    sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
  );
}

function setOpen(sheet: HTMLElement, open: boolean): void {
  if (open) {
    sheet.dataset.mobileSheet = "open";
  } else {
    delete sheet.dataset.mobileSheet;
  }
  sheet.setAttribute("aria-hidden", open ? "false" : "true");

  // Everything behind the modal leaves the tab order and the
  // accessibility tree while it is open.
  for (const child of Array.from(document.body.children)) {
    if (child !== sheet && child instanceof HTMLElement) {
      child.inert = open;
    }
  }

  const button = getOpenButton();
  if (button) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  // Lock body scroll while the overlay is up.
  document.body.style.overflow = open ? "hidden" : "";
}

function openSheet(sheet: HTMLElement): void {
  setOpen(sheet, true);
  sheet.querySelector<HTMLElement>("[data-menu-close]")?.focus();
}

function closeSheet(sheet: HTMLElement): void {
  // setOpen first: the trigger is inert while the sheet is open and
  // would refuse focus.
  setOpen(sheet, false);
  getOpenButton()?.focus({ preventScroll: true });
}

// Wrap Tab at the edges of the sheet. `inert` already keeps the page out,
// but without the wrap Tab from the last control leaves the document.
function trapTab(sheet: HTMLElement, event: KeyboardEvent): void {
  const focusables = getFocusables(sheet);
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

  if (event.target.closest("[data-menu-open]")) {
    openSheet(sheet);
    return;
  }

  if (event.target.closest("[data-menu-close]")) {
    closeSheet(sheet);
    return;
  }

  // Anchor links inside the sheet auto-close it after clicking.
  if (isOpen(sheet) && event.target.closest("[data-sheet-link]")) {
    closeSheet(sheet);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" && event.key !== "Tab") {
    return;
  }
  const sheet = getSheet();
  if (!(sheet && isOpen(sheet))) {
    return;
  }
  if (event.key === "Escape") {
    closeSheet(sheet);
  } else {
    trapTab(sheet, event);
  }
});

// On view transition the sheet is rebuilt - make sure it starts closed
// and ARIA state is consistent.
function syncOnLoad(): void {
  const sheet = getSheet();
  if (!sheet) {
    return;
  }
  setOpen(sheet, false);
}

document.addEventListener("astro:page-load", syncOnLoad);

export {};
