import {
  a as resolveUserTimezone,
  i as resolveUserTimeFormat,
  n as formatUserTime,
} from "./date-time-CcWivhrg.js";
import { S as resolveDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
//#region src/agents/current-time.ts
/**
 * Formats cron-style current-time prompt text with local and UTC references.
 */
/** Resolve localized and UTC current-time text for agent prompts. */
function resolveCronStyleNow(cfg, nowMs) {
  const userTimezone = resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
  const userTimeFormat = resolveUserTimeFormat(cfg.agents?.defaults?.timeFormat);
  const timestampMs = resolveDateTimestampMs(nowMs);
  const date = new Date(timestampMs);
  const formattedTime = formatUserTime(date, userTimezone, userTimeFormat) ?? date.toISOString();
  return {
    userTimezone,
    formattedTime,
    timeLine: `Current time: ${formattedTime} (${userTimezone})\nReference UTC: ${date.toISOString().replace("T", " ").slice(0, 16) + " UTC"}`,
  };
}
/**
 * Append a fresh current-time block, or refresh a previously helper-injected one,
 * so heartbeat/cron prompts flowing through this helper repeatedly never leak a
 * stale `Current time:` value (issue #44993).
 */
const CURRENT_TIME_LINE_RE =
  /^Current time: .+? \([^)]+\)\nReference UTC: \d{4}-\d{2}-\d{2} \d{2}:\d{2} UTC$/gm;
function appendCronStyleCurrentTimeLine(text, cfg, nowMs) {
  const base = text.trimEnd();
  if (!base) return base;
  const { timeLine } = resolveCronStyleNow(cfg, nowMs);
  if (!CURRENT_TIME_LINE_RE.test(base)) return `${base}\n${timeLine}`;
  CURRENT_TIME_LINE_RE.lastIndex = 0;
  let replaced = false;
  return base
    .replace(CURRENT_TIME_LINE_RE, () => {
      if (replaced) return "";
      replaced = true;
      return timeLine;
    })
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n\n+(?=Current time:)/g, "\n")
    .trimEnd();
}
//#endregion
export { resolveCronStyleNow as n, appendCronStyleCurrentTimeLine as t };
