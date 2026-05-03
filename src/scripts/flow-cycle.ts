/* How-I-work flow cycle. Auto-advances [data-step] on .flow-node and
 * .how-item every 2.6s. Hovering a .how-item jumps to its step and
 * resets the timer. Pauses when document.hidden (Page Visibility API)
 * so we don't churn rAF/timers in background tabs.
 *
 * Skipped under prefers-reduced-motion: a single static "active"
 * step is shown (the first one), no rotation, no transitions
 * involved beyond what CSS already disables. */

const CYCLE_MS = 2600;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let timerId: number | null = null;
let currentStep = 0;
let stepCount = 0;

function getNodes(): NodeListOf<HTMLElement> {
  return document.querySelectorAll<HTMLElement>(
    "[data-flow-visual] .flow-node[data-step]"
  );
}

function getProgress(): HTMLElement | null {
  return document.querySelector<HTMLElement>("[data-flow-progress]");
}

function setActive(step: number): void {
  currentStep = step;
  for (const node of getNodes()) {
    node.classList.toggle("active", Number(node.dataset.step) === step);
  }
  const progress = getProgress();
  if (progress && stepCount > 0) {
    const num = String(step + 1).padStart(2, "0");
    const total = String(stepCount).padStart(2, "0");
    progress.textContent = `krok ${num} / ${total}`;
  }
}

function clearTimer(): void {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function startTimer(): void {
  clearTimer();
  if (stepCount <= 1 || document.hidden) {
    return;
  }
  timerId = window.setInterval(() => {
    setActive((currentStep + 1) % stepCount);
  }, CYCLE_MS);
}

function onItemHover(event: Event): void {
  if (!(event.target instanceof Element)) {
    return;
  }
  const item = event.target.closest<HTMLElement>(".how-item[data-step]");
  if (!item) {
    return;
  }
  const step = Number(item.dataset.step);
  if (Number.isNaN(step)) {
    return;
  }
  setActive(step);
  startTimer();
}

function onVisibilityChange(): void {
  if (document.hidden) {
    clearTimer();
  } else {
    startTimer();
  }
}

function init(): void {
  clearTimer();
  const nodes = getNodes();
  stepCount = nodes.length;
  if (stepCount === 0) {
    return;
  }
  currentStep = 0;
  setActive(0);

  const reducedMotion =
    typeof matchMedia === "function" &&
    matchMedia(REDUCED_MOTION_QUERY).matches;
  if (reducedMotion) {
    return;
  }

  startTimer();
}

document.addEventListener("mouseover", onItemHover);
document.addEventListener("visibilitychange", onVisibilityChange);
init();
document.addEventListener("astro:page-load", init);

export {};
