/* Active nav link tracking via IntersectionObserver - no scroll
 * listener. A [data-nav-link] to a section of this page ("/#how" on the
 * home page) is tracked: the section that's most-visible gets `.active` on
 * its link. Page links ("/realizacje/") are left alone; nav.astro marks
 * the current one at build time.
 *
 * Special case from the prototype: when the user is in the contact
 * section, ALL primary links lose `.active` and the contact CTA
 * ([data-nav-cta]) takes over with its own `.active` style. This
 * matches the visual hierarchy - once you're at the destination,
 * the CTA shouldn't compete with a different highlighted item. */

let observer: IntersectionObserver | null = null;
const sectionToLink = new Map<Element, HTMLAnchorElement>();
const visibleSections = new Set<Element>();
let contactSection: Element | null = null;
let contactCta: HTMLAnchorElement | null = null;

function setLinkActive(link: HTMLAnchorElement, active: boolean): void {
  link.classList.toggle("active", active);
  if (active) {
    link.setAttribute("aria-current", "location");
  } else {
    link.removeAttribute("aria-current");
  }
}

function clearActive(): void {
  for (const link of sectionToLink.values()) {
    setLinkActive(link, false);
  }
  if (contactCta) {
    setLinkActive(contactCta, false);
  }
}

function applyActive(): void {
  if (visibleSections.size === 0) {
    clearActive();
    return;
  }

  const inContact = contactSection
    ? visibleSections.has(contactSection)
    : false;

  if (inContact && contactCta) {
    for (const link of sectionToLink.values()) {
      setLinkActive(link, false);
    }
    setLinkActive(contactCta, true);
    return;
  }

  if (contactCta) {
    setLinkActive(contactCta, false);
  }

  // Pick the section closest to the top of the viewport.
  let topMost: Element | null = null;
  let topMostY = Number.POSITIVE_INFINITY;
  for (const section of visibleSections) {
    const rect = section.getBoundingClientRect();
    if (rect.top < topMostY) {
      topMostY = rect.top;
      topMost = section;
    }
  }

  for (const [section, link] of sectionToLink) {
    setLinkActive(link, section === topMost);
  }
}

function teardown(): void {
  observer?.disconnect();
  observer = null;
  sectionToLink.clear();
  visibleSections.clear();
  contactSection = null;
  contactCta = null;
}

/* The section a link points at on this page: "/#how" on the home page is
 * #how. Links to other pages (or sections of other pages) have none. */
function sectionFor(link: HTMLAnchorElement | null): Element | null {
  if (!link?.hash || link.pathname !== window.location.pathname) {
    return null;
  }
  return document.getElementById(link.hash.slice(1));
}

function init(): void {
  teardown();

  const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
  for (const link of links) {
    const section = sectionFor(link);
    if (section) {
      sectionToLink.set(section, link);
    }
  }

  contactCta = document.querySelector<HTMLAnchorElement>("[data-nav-cta]");
  contactSection = sectionFor(contactCta);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target);
        } else {
          visibleSections.delete(entry.target);
        }
      }
      applyActive();
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  for (const section of sectionToLink.keys()) {
    observer.observe(section);
  }
  if (contactSection && !sectionToLink.has(contactSection)) {
    observer.observe(contactSection);
  }
}

init();
document.addEventListener("astro:page-load", init);

export {};
