import { Cron } from "croner";
import { i as coerceFiniteScheduleNumber } from "./normalize-CSef2SY2.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/cron/schedule.ts
/** Computes at/every/cron schedule timestamps with bounded Croner caching. */
const CRON_EVAL_CACHE_MAX = 512;
const cronEvalCache = /* @__PURE__ */ new Map();
function resolveCronTimezone(tz) {
  const trimmed = normalizeOptionalString(tz) ?? "";
  if (trimmed) return trimmed;
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function resolveCachedCron(expr, timezone) {
  const key = `${timezone}\u0000${expr}`;
  const cached = cronEvalCache.get(key);
  if (cached) {
    cronEvalCache.delete(key);
    cronEvalCache.set(key, cached);
    return cached;
  }
  if (cronEvalCache.size >= CRON_EVAL_CACHE_MAX) {
    const oldest = cronEvalCache.keys().next().value;
    if (oldest) cronEvalCache.delete(oldest);
  }
  const next = new Cron(expr, {
    timezone,
    catch: false,
  });
  cronEvalCache.set(key, next);
  return next;
}
function resolveCronFromSchedule(schedule) {
  if (typeof schedule.expr !== "string") throw new Error("invalid cron schedule: expr is required");
  const expr = schedule.expr.trim();
  if (!expr) return;
  return resolveCachedCron(expr, resolveCronTimezone(schedule.tz));
}
/** Computes the next scheduled run timestamp after now for at/every/cron schedules. */
function computeNextRunAtMs(schedule, nowMs) {
  if (schedule.kind === "at") {
    const atMs = parseAbsoluteTimeMs(schedule.at);
    if (atMs === null) return;
    return atMs > nowMs ? atMs : void 0;
  }
  if (schedule.kind === "every") {
    const everyMsRaw = coerceFiniteScheduleNumber(schedule.everyMs);
    if (everyMsRaw === void 0) return;
    const everyMs = Math.max(1, Math.floor(everyMsRaw));
    const anchorRaw = coerceFiniteScheduleNumber(schedule.anchorMs);
    const anchor = Math.max(0, Math.floor(anchorRaw ?? nowMs));
    if (nowMs < anchor) return anchor;
    const elapsed = nowMs - anchor;
    return anchor + (Math.floor(elapsed / everyMs) + 1) * everyMs;
  }
  if (schedule.kind === "on-exit") return;
  const cron = resolveCronFromSchedule(schedule);
  if (!cron) return;
  const nextMs = cron.nextRun(new Date(nowMs))?.getTime();
  if (nextMs === void 0) return;
  if (nextMs <= nowMs) {
    const nextSecondMs = Math.floor(nowMs / 1e3) * 1e3 + 1e3;
    const retryMs = cron.nextRun(new Date(nextSecondMs))?.getTime();
    if (retryMs !== void 0 && retryMs > nowMs) return retryMs;
    const tomorrowMs = new Date(nowMs).setUTCHours(24, 0, 0, 0);
    const retry2Ms = cron.nextRun(new Date(tomorrowMs))?.getTime();
    if (retry2Ms !== void 0 && retry2Ms > nowMs) return retry2Ms;
    return;
  }
  return nextMs;
}
/** Computes the previous cron-expression run timestamp before now. */
function computePreviousRunAtMs(schedule, nowMs) {
  if (schedule.kind !== "cron") return;
  const cron = resolveCronFromSchedule(schedule);
  if (!cron) return;
  const previousMs = cron.previousRuns(1, new Date(nowMs))[0]?.getTime();
  if (previousMs === void 0 || previousMs >= nowMs) return;
  return previousMs;
}
//#endregion
export { computePreviousRunAtMs as n, computeNextRunAtMs as t };
