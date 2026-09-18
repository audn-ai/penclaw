import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
//#region src/cron/stagger.ts
/** Resolves deterministic cron stagger windows for recurring schedules. */
/** Default jitter window applied to recurring top-of-hour cron schedules. */
const DEFAULT_TOP_OF_HOUR_STAGGER_MS = 300 * 1e3;
function parseCronFields(expr) {
  return expr.trim().split(/\s+/).filter(Boolean);
}
const HOUR_LIST_PART = /^(?:\d+|\d+-\d+)(?:\/\d+)?$|^[*?](?:\/\d+)?$/;
function hasRecurringWildcardHour(field) {
  const parts = field.split(",");
  return (
    parts.every((part) => HOUR_LIST_PART.test(part)) &&
    parts.some((part) => part.startsWith("*") || part.startsWith("?"))
  );
}
/** Returns whether a cron expression fires recurring jobs exactly at the top of an hour. */
function isRecurringTopOfHourCronExpr(expr) {
  const fields = parseCronFields(expr);
  if (fields.length === 5) {
    const [minuteField, hourField] = fields;
    return (
      minuteField === "0" &&
      hasRecurringWildcardHour(expectDefined(hourField, "stagger hour field"))
    );
  }
  if (fields.length === 6) {
    const [secondField, minuteField, hourField] = fields;
    return (
      secondField === "0" &&
      minuteField === "0" &&
      hasRecurringWildcardHour(expectDefined(hourField, "stagger hour field"))
    );
  }
  return false;
}
/** Normalizes explicit stagger values from config, preserving zero as "run exactly on schedule". */
function normalizeCronStaggerMs(raw) {
  const numeric =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw.trim()
        ? (parseStrictNonNegativeInteger(raw) ?? NaN)
        : NaN;
  if (!Number.isFinite(numeric)) return;
  const normalized = Math.max(0, Math.floor(numeric));
  return Number.isSafeInteger(normalized) ? normalized : void 0;
}
/** Returns the default anti-thundering-herd stagger for top-of-hour recurring schedules. */
function resolveDefaultCronStaggerMs(expr) {
  return isRecurringTopOfHourCronExpr(expr) ? DEFAULT_TOP_OF_HOUR_STAGGER_MS : void 0;
}
/** Resolves the effective stagger for a cron schedule, preferring explicit values over defaults. */
function resolveCronStaggerMs(schedule) {
  const explicit = normalizeCronStaggerMs(schedule.staggerMs);
  if (explicit !== void 0) return explicit;
  const expr = schedule.expr;
  return resolveDefaultCronStaggerMs(typeof expr === "string" ? expr : "") ?? 0;
}
//#endregion
export { resolveCronStaggerMs as n, resolveDefaultCronStaggerMs as r, normalizeCronStaggerMs as t };
