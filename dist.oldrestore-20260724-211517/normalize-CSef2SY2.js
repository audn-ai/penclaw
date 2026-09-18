import { _ as parseStrictFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./utils-DtcDeqWS.js";
//#region src/cron/schedule-number.ts
/** Coerces cron schedule number fields with strict safe-range parsing. */
/** Coerces schedule numeric fields without accepting partial, non-finite, or unsafe values. */
function coerceFiniteScheduleNumber(value) {
  const parsed = parseStrictFiniteNumber(value);
  return parsed !== void 0 && Math.abs(parsed) <= Number.MAX_SAFE_INTEGER ? parsed : void 0;
}
//#endregion
//#region src/cron/service/normalize.ts
/** Name, agent id, and payload text normalization helpers for cron service ops. */
/** Normalizes a required cron job name and throws the public validation error when absent. */
function normalizeRequiredName(raw) {
  if (typeof raw !== "string") throw new Error("cron job name is required");
  const name = raw.trim();
  if (!name) throw new Error("cron job name is required");
  return name;
}
function truncateText(input, maxLen) {
  if (input.length <= maxLen) return input;
  return `${truncateUtf16Safe(input, Math.max(0, maxLen - 1)).trimEnd()}…`;
}
/** Infers a compact cron job name from payload text first, then schedule shape. */
function inferCronJobName(job) {
  const firstLine =
    (job?.payload?.kind === "systemEvent" && typeof job.payload.text === "string"
      ? job.payload.text
      : job?.payload?.kind === "agentTurn" && typeof job.payload.message === "string"
        ? job.payload.message
        : job?.payload?.kind === "command" && Array.isArray(job.payload.argv)
          ? job.payload.argv.join(" ")
          : ""
    )
      .split("\n")
      .map((l) => l.trim())
      .find(Boolean) ?? "";
  if (firstLine) return truncateText(firstLine, 60);
  const kind = typeof job?.schedule?.kind === "string" ? job.schedule.kind : "";
  if (kind === "cron" && typeof job?.schedule?.expr === "string")
    return `Cron: ${truncateText(job.schedule.expr, 52)}`;
  if (kind === "every" && typeof job?.schedule?.everyMs === "number")
    return `Every: ${job.schedule.everyMs}ms`;
  if (kind === "at") return "One-shot";
  return "Cron job";
}
/** Extracts the executable text from cron payload variants for main-session queueing. */
function normalizePayloadToSystemText(payload) {
  if (payload.kind === "systemEvent")
    return typeof payload.text === "string" ? payload.text.trim() : "";
  return payload.kind === "agentTurn" && typeof payload.message === "string"
    ? payload.message.trim()
    : "";
}
//#endregion
export {
  coerceFiniteScheduleNumber as i,
  normalizePayloadToSystemText as n,
  normalizeRequiredName as r,
  inferCronJobName as t,
};
