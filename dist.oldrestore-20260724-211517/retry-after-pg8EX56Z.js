import {
  _ as parseStrictFiniteNumber,
  c as asFiniteNumberInRange,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import "./number-runtime-B-n-wjMn.js";
//#region extensions/discord/src/retry-after.ts
const RETRY_AFTER_HEADER_DELAY_RE = /^\d+$/;
const RETRY_AFTER_BODY_SECONDS_RE = /^(?:\d+\.?\d*|\.\d+)$/;
const RETRY_AFTER_HTTP_DATE_RE =
  /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT$/;
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function parseRetryAfterHeaderSeconds(value, now = Date.now()) {
  if (!value) return;
  const trimmed = value.trim();
  if (RETRY_AFTER_HEADER_DELAY_RE.test(trimmed))
    return asFiniteNumberInRange(parseStrictNonNegativeInteger(trimmed), {
      min: 0,
      max: MAX_SAFE_RETRY_AFTER_SECONDS,
    });
  if (!RETRY_AFTER_HTTP_DATE_RE.test(trimmed)) return;
  const retryAt = Date.parse(trimmed);
  return Number.isFinite(retryAt) ? Math.max(0, (retryAt - now) / 1e3) : void 0;
}
function parseDiscordRetryAfterBodySeconds(value) {
  return asFiniteNumberInRange(
    typeof value === "number"
      ? value
      : typeof value === "string" && RETRY_AFTER_BODY_SECONDS_RE.test(value.trim())
        ? parseStrictFiniteNumber(value.trim())
        : void 0,
    {
      min: 0,
      max: MAX_SAFE_RETRY_AFTER_SECONDS,
    },
  );
}
//#endregion
export { parseRetryAfterHeaderSeconds as n, parseDiscordRetryAfterBodySeconds as t };
