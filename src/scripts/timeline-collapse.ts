/* Experience timeline expand/collapse. Markup uses
 * [data-experience-collapse] (the wrapper) and [data-experience-toggle]
 * (the button). CSS in experience.astro keys on `.expanded` for both
 * the max-height transition and the bottom mask/fade.
 *
 * Why this is class-based + CSS, not JS height math: the visual is a
 * mask gradient that doesn't depend on exact pixels, and animating
 * max-height between a fixed clip and a generous cap (handled in
 * CSS) gives the right look without measuring scrollHeight on every
 * click. prefers-reduced-motion is respected by the existing
 * transition: none rule. */

const LABEL_COLLAPSED = "Pokaż pełną historię";
const LABEL_EXPANDED = "Zwiń";
const COUNT_SUFFIX_RX = /\s\(\d+\)$/;

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }
  const button = event.target.closest<HTMLButtonElement>(
    "[data-experience-toggle]"
  );
  if (!button) {
    return;
  }

  const wrap = document.querySelector<HTMLElement>(
    "[data-experience-collapse]"
  );
  if (!wrap) {
    return;
  }

  const willExpand = !wrap.classList.contains("expanded");
  wrap.classList.toggle("expanded", willExpand);
  button.setAttribute("aria-expanded", willExpand ? "true" : "false");

  const label = button.querySelector<HTMLElement>(".label");
  if (label) {
    // Preserve the count suffix (e.g. " (7)") that was in the original markup.
    const match = label.textContent?.match(COUNT_SUFFIX_RX);
    const suffix = match ? match[0] : "";
    label.textContent =
      (willExpand ? LABEL_EXPANDED : LABEL_COLLAPSED) + suffix;
  }
});

export {};
