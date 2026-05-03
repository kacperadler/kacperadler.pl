/* Active nav link tracking via IntersectionObserver — no scroll
 * listener. Each [data-nav-link] points to a #section-id; the section
 * that's most-visible gets `.active` on its corresponding link.
 *
 * Special case from the prototype: when the user is in the contact
 * section, ALL primary links lose `.active` and the contact CTA
 * ([data-nav-cta]) takes over with its own `.active` style. This
 * matches the visual hierarchy — once you're at the destination,
 * the CTA shouldn't compete with a different highlighted item. */

let observer: IntersectionObserver | null = null;
const sectionToLink = new Map<Element, HTMLAnchorElement>();
const visibleSections = new Set<Element>();
let contactSection: Element | null = null;
let contactCta: HTMLAnchorElement | null = null;

function clearActive(): void {
  for (const link of sectionToLink.values()) {
    link.classList.remove("active");
  }
  contactCta?.classList.remove("active");
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
      link.classList.remove("active");
    }
    contactCta.classList.add("active");
    return;
  }

  contactCta?.classList.remove("active");

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
    link.classList.toggle("active", section === topMost);
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

function init(): void {
  teardown();

  const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
  for (const link of links) {
    const href = link.getAttribute("href");
    if (!href?.startsWith("#")) {
      continue;
    }
    const section = document.querySelector(href);
    if (section) {
      sectionToLink.set(section, link);
    }
  }

  contactCta = document.querySelector<HTMLAnchorElement>("[data-nav-cta]");
  contactSection = contactCta?.getAttribute("href")?.startsWith("#")
    ? document.querySelector(contactCta.getAttribute("href") ?? "")
    : null;

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
