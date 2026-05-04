/* Polish-aware duration helpers for experience timeline.
 *
 * `durationInMonths` uses two conventions to match how CV periods are
 * usually counted in Polish:
 *
 *   - Historical (with endDate): inclusive count of work months.
 *     "07.2020 — 10.2021" = 16 months = "1 rok 4 mies."
 *   - Current (no endDate): months elapsed since start, excluding
 *     the in-flight month. Started 02.2026, today is in May 2026
 *     → 3 mies. (Feb, Mar, Apr completed). */

export function yearsUnit(n: number): string {
  if (n === 1) {
    return "rok";
  }
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) {
    return "lat";
  }
  const lastDigit = n % 10;
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "lata";
  }
  return "lat";
}

function parseYearMonth(yyyymm: string): [year: number, month: number] {
  const [y, m] = yyyymm.split("-");
  if (!(y && m)) {
    throw new Error(`Invalid YYYY-MM format: ${yyyymm}`);
  }
  return [Number(y), Number(m)];
}

export function durationInMonths(
  start: string,
  end?: string,
  now: Date = new Date()
): number {
  const [y1, m1] = parseYearMonth(start);
  let months: number;
  if (end) {
    const [y2, m2] = parseYearMonth(end);
    months = (y2 - y1) * 12 + (m2 - m1) + 1;
  } else {
    months = (now.getFullYear() - y1) * 12 + (now.getMonth() + 1 - m1);
  }
  return Math.max(1, months);
}

function formatMonthYear(yyyymm: string): string {
  const [y, m] = parseYearMonth(yyyymm);
  return `${String(m).padStart(2, "0")}.${y}`;
}

export function formatPeriod(
  start: string,
  end?: string,
  now: Date = new Date()
): string {
  const startStr = formatMonthYear(start);
  const endStr = end ? formatMonthYear(end) : "teraz";
  const months = durationInMonths(start, end, now);
  const years = Math.floor(months / 12);
  const leftover = months % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${yearsUnit(years)}`);
  }
  if (leftover > 0) {
    parts.push(`${leftover} mies.`);
  }
  if (parts.length === 0) {
    parts.push("1 mies.");
  }

  return `${startStr} — ${endStr} · ${parts.join(" ")}`;
}

export function totalYearsFloor(
  earliestStart: string,
  now: Date = new Date()
): number {
  return Math.floor(durationInMonths(earliestStart, undefined, now) / 12);
}
