import { execFileSync } from "node:child_process";
import { S as resolveDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
//#region src/agents/date-time.ts
/**
 * Normalizes timestamps and formats user-facing dates/times for agent prompts.
 */
let cachedTimeFormat;
function buildNormalizedTimestamp(timestampMs) {
  if (!Number.isSafeInteger(timestampMs)) return;
  return {
    timestampMs,
    timestampUtc: new Date(timestampMs).toISOString(),
  };
}
/** Resolve a valid IANA timezone from config, host preferences, or UTC. */
function resolveUserTimezone(configured) {
  const trimmed = configured?.trim();
  if (trimmed)
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(/* @__PURE__ */ new Date());
      return trimmed;
    } catch {}
  return Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || "UTC";
}
/** Resolve 12/24-hour display preference, detecting the host for `auto`. */
function resolveUserTimeFormat(preference) {
  if (preference === "12" || preference === "24") return preference;
  if (cachedTimeFormat) return cachedTimeFormat;
  cachedTimeFormat = detectSystemTimeFormat() ? "24" : "12";
  return cachedTimeFormat;
}
/** Format a stable YYYY-MM-DD stamp in the requested timezone. */
function formatDateStamp(nowMs, timeZone) {
  const timestampMs = resolveDateTimestampMs(nowMs);
  const date = new Date(timestampMs);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (year && month && day) return `${year}-${month}-${day}`;
  return date.toISOString().slice(0, 10);
}
/** Normalize Date, second, millisecond, or parseable string timestamps. */
function normalizeTimestamp(raw) {
  if (raw == null) return;
  let timestampMs;
  if (raw instanceof Date) timestampMs = raw.getTime();
  else if (typeof raw === "number" && Number.isFinite(raw))
    timestampMs = raw < 0xe8d4a51000 ? Math.round(raw * 1e3) : Math.round(raw);
  else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      const num = Number(trimmed);
      if (Number.isFinite(num))
        if (trimmed.includes(".")) timestampMs = Math.round(num * 1e3);
        else if (trimmed.length >= 13) timestampMs = Math.round(num);
        else timestampMs = Math.round(num * 1e3);
    } else {
      const parsed = Date.parse(trimmed);
      if (!Number.isNaN(parsed)) timestampMs = parsed;
    }
  }
  if (timestampMs === void 0 || !Number.isFinite(timestampMs)) return;
  try {
    return buildNormalizedTimestamp(timestampMs);
  } catch {
    return;
  }
}
/** Add normalized timestamp fields without overwriting valid existing values. */
function withNormalizedTimestamp(value, rawTimestamp) {
  const normalized = normalizeTimestamp(rawTimestamp);
  if (!normalized) return value;
  return {
    ...value,
    timestampMs:
      typeof value.timestampMs === "number" && Number.isFinite(value.timestampMs)
        ? value.timestampMs
        : normalized.timestampMs,
    timestampUtc:
      typeof value.timestampUtc === "string" && value.timestampUtc.trim()
        ? value.timestampUtc
        : normalized.timestampUtc,
  };
}
function detectSystemTimeFormat() {
  if (process.platform === "darwin")
    try {
      const result = execFileSync("defaults", ["read", "-g", "AppleICUForce24HourTime"], {
        encoding: "utf8",
        timeout: 500,
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
      if (result === "1") return true;
      if (result === "0") return false;
    } catch {}
  if (process.platform === "win32")
    try {
      const result = execFileSync(
        "powershell",
        ["-Command", "(Get-Culture).DateTimeFormat.ShortTimePattern"],
        {
          encoding: "utf8",
          timeout: 1e3,
        },
      ).trim();
      if (result.startsWith("H")) return true;
      if (result.startsWith("h")) return false;
    } catch {}
  try {
    const sample = new Date(2e3, 0, 1, 13, 0);
    return new Intl.DateTimeFormat(void 0, { hour: "numeric" }).format(sample).includes("13");
  } catch {
    return false;
  }
}
function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
/** Format the prompt-facing localized time string with weekday and date. */
function formatUserTime(date, timeZone, format) {
  const use24Hour = format === "24";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: use24Hour ? "2-digit" : "numeric",
      minute: "2-digit",
      hourCycle: use24Hour ? "h23" : "h12",
    }).formatToParts(date);
    const map = {};
    for (const part of parts) if (part.type !== "literal") map[part.type] = part.value;
    if (!map.weekday || !map.year || !map.month || !map.day || !map.hour || !map.minute) return;
    const dayNum = Number.parseInt(map.day, 10);
    const suffix = ordinalSuffix(dayNum);
    const timePart = use24Hour
      ? `${map.hour}:${map.minute}`
      : `${map.hour}:${map.minute} ${map.dayPeriod ?? ""}`.trim();
    return `${map.weekday}, ${map.month} ${dayNum}${suffix}, ${map.year} - ${timePart}`;
  } catch {
    return;
  }
}
//#endregion
export {
  resolveUserTimezone as a,
  resolveUserTimeFormat as i,
  formatUserTime as n,
  withNormalizedTimestamp as o,
  normalizeTimestamp as r,
  formatDateStamp as t,
};
