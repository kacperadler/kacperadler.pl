/* Mobile sheet open/close. The sheet is opened by [data-menu-open]
 * (hamburger) and closed by [data-menu-close] (X button), Escape, or
 * any click on a [data-sheet-link] inside (so anchor navigation
 * dismisses the overlay).
 *
 * The visibility flag is data-mobile-sheet="open" - CSS in
 * mobile-sheet.astro keys on it. Synced ARIA: aria-expanded on the
 * trigger, aria-hidden on the sheet itself.
 *
 * Click + keydown listeners are document-level (event delegation +
 * one keydown for Escape), so they survive ClientRouter swaps with
 * no re-binding. */

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

function setOpen(sheet: HTMLElement, open: boolean): void {
  if (open) {
    sheet.dataset.mobileSheet = "open";
  } else {
    delete sheet.dataset.mobileSheet;
  }
  sheet.setAttribute("aria-hidden", open ? "false" : "true");

  const button = getOpenButton();
  if (button) {
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  // Lock body scroll while the overlay is up.
  document.body.style.overflow = open ? "hidden" : "";
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
    setOpen(sheet, true);
    return;
  }

  if (event.target.closest("[data-menu-close]")) {
    setOpen(sheet, false);
    return;
  }

  // Anchor links inside the sheet auto-close it after clicking.
  if (isOpen(sheet) && event.target.closest("[data-sheet-link]")) {
    setOpen(sheet, false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  const sheet = getSheet();
  if (sheet && isOpen(sheet)) {
    setOpen(sheet, false);
    getOpenButton()?.focus();
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
