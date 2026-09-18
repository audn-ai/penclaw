//#region src/agents/date-time.d.ts
type TimeFormatPreference = "auto" | "12" | "24";
type ResolvedTimeFormat = "12" | "24";
/** Resolve a valid IANA timezone from config, host preferences, or UTC. */
declare function resolveUserTimezone(configured?: string): string;
/** Resolve 12/24-hour display preference, detecting the host for `auto`. */
declare function resolveUserTimeFormat(preference?: TimeFormatPreference): ResolvedTimeFormat;
/** Format a stable YYYY-MM-DD stamp in the requested timezone. */
declare function formatDateStamp(nowMs: number, timeZone: string): string;
/** Normalize Date, second, millisecond, or parseable string timestamps. */
declare function normalizeTimestamp(raw: unknown):
  | {
      timestampMs: number;
      timestampUtc: string;
    }
  | undefined;
/** Add normalized timestamp fields without overwriting valid existing values. */
declare function withNormalizedTimestamp<T extends Record<string, unknown>>(
  value: T,
  rawTimestamp: unknown,
): T & {
  timestampMs?: number;
  timestampUtc?: string;
};
/** Format the prompt-facing localized time string with weekday and date. */
declare function formatUserTime(
  date: Date,
  timeZone: string,
  format: ResolvedTimeFormat,
): string | undefined;
//#endregion
export {
  normalizeTimestamp as a,
  withNormalizedTimestamp as c,
  formatUserTime as i,
  TimeFormatPreference as n,
  resolveUserTimeFormat as o,
  formatDateStamp as r,
  resolveUserTimezone as s,
  ResolvedTimeFormat as t,
};
