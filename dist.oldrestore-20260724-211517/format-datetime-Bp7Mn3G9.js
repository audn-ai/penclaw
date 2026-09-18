//#region src/infra/format-time/format-datetime.ts
/**
 * Centralized date/time formatting utilities.
 *
 * All formatters are timezone-aware, using Intl.DateTimeFormat.
 * Consolidates duplicated formatUtcTimestamp / formatZonedTimestamp / resolveExplicitTimezone
 * that previously lived in envelope.ts and session-updates.ts.
 */
/**
 * Validate an IANA timezone string. Returns the string if valid, undefined otherwise.
 */
function resolveTimezone(value) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(/* @__PURE__ */ new Date());
    return value;
  } catch {
    return;
  }
}
/** Build a stable YYYY-MM-DD formatter for instants in one IANA timezone. */
function createTimeZoneDayKeyFormatter(timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US-u-ca-iso8601-nu-latn", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (date) => {
    const parts = formatter.formatToParts(date);
    const pick = (type) => parts.find((part) => part.type === type)?.value;
    const year = pick("year");
    const month = pick("month");
    const day = pick("day");
    if (!year || !month || !day)
      throw new Error("Intl.DateTimeFormat omitted required calendar-day parts");
    return `${year.padStart(4, "0")}-${month}-${day}`;
  };
}
/** Resolve the first instant belonging to a calendar day in an IANA timezone. */
function resolveTimeZoneDayStartMs(dayKey, timeZone) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) return;
  const naiveUtcMs = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (!Number.isFinite(naiveUtcMs)) return;
  const formatDayKey = createTimeZoneDayKeyFormatter(timeZone);
  const searchWindowMs = 2880 * 60 * 1e3;
  let low = naiveUtcMs - searchWindowMs;
  let high = naiveUtcMs + searchWindowMs;
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (formatDayKey(new Date(middle)) < dayKey) low = middle + 1;
    else high = middle;
  }
  return formatDayKey(new Date(low)) === dayKey ? low : void 0;
}
/**
 * Format a Date as a UTC timestamp string.
 *
 * Without seconds: `2024-01-15T14:30Z`
 * With seconds:    `2024-01-15T14:30:05Z`
 */
function formatUtcTimestamp(date, options) {
  const yyyy = String(date.getUTCFullYear()).padStart(4, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  if (!options?.displaySeconds) return `${yyyy}-${mm}-${dd}T${hh}:${min}Z`;
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${String(date.getUTCSeconds()).padStart(2, "0")}Z`;
}
/**
 * Format a Date with timezone display using Intl.DateTimeFormat.
 *
 * Without seconds: `2024-01-15 14:30 EST`
 * With seconds:    `2024-01-15 14:30:05 EST`
 *
 * Returns undefined if Intl formatting fails.
 */
function formatZonedTimestamp(date, options) {
  try {
    const intlOptions = {
      timeZone: options?.timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    };
    if (options?.displaySeconds) intlOptions.second = "2-digit";
    const parts = new Intl.DateTimeFormat("en-US", intlOptions).formatToParts(date);
    const pick = (type) => parts.find((part) => part.type === type)?.value;
    const yyyy = pick("year");
    const mm = pick("month");
    const dd = pick("day");
    const hh = pick("hour");
    const min = pick("minute");
    const sec = options?.displaySeconds ? pick("second") : void 0;
    const tz = [...parts]
      .toReversed()
      .find((part) => part.type === "timeZoneName")
      ?.value?.trim();
    if (!yyyy || !mm || !dd || !hh || !min) return;
    if (options?.displaySeconds && sec)
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}${tz ? ` ${tz}` : ""}`;
    return `${yyyy}-${mm}-${dd} ${hh}:${min}${tz ? ` ${tz}` : ""}`;
  } catch {
    return;
  }
}
//#endregion
export {
  resolveTimezone as a,
  resolveTimeZoneDayStartMs as i,
  formatUtcTimestamp as n,
  formatZonedTimestamp as r,
  createTimeZoneDayKeyFormatter as t,
};
