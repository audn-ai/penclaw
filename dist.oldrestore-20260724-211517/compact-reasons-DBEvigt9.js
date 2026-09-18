import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/embedded-agent-runner/compact-reasons.ts
/**
 * Normalizes and classifies compaction failure reasons for diagnostics.
 */
const MAX_COMPACTION_REASON_DETAIL_CHARS = 100;
const DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON =
  "deferred to background context-engine maintenance";
function isGenericCompactionCancelledReason(reason) {
  const normalized = normalizeLowercaseStringOrEmpty(reason);
  return normalized === "compaction cancelled" || normalized === "error: compaction cancelled";
}
/** Prefer a safeguard cancel reason when the runtime only reports generic cancellation. */
function resolveCompactionFailureReason(params) {
  if (isGenericCompactionCancelledReason(params.reason) && params.safeguardCancelReason)
    return params.safeguardCancelReason;
  return params.reason;
}
/** Bucket a raw compaction reason into stable telemetry/status classes. */
function classifyCompactionReason(reason) {
  const text = normalizeLowercaseStringOrEmpty(reason);
  if (!text) return "unknown";
  if (text.includes("nothing to compact") || text.includes("no real conversation messages"))
    return "no_compactable_entries";
  if (text.includes("below threshold") || text.includes("already under target"))
    return "below_threshold";
  if (text.includes("already compacted") || text.includes("already_compacted"))
    return "already_compacted_recently";
  if (text.includes("deferred to background")) return "deferred_background";
  if (text.includes("still exceeds target")) return "live_context_still_exceeds_target";
  if (text.includes("guard")) return "guard_blocked";
  if (text.includes("summary")) return "summary_failed";
  if (text.includes("timed out") || text.includes("timeout")) return "timeout";
  if (text.includes("400") || text.includes("401") || text.includes("403") || text.includes("429"))
    return "provider_error_4xx";
  if (text.includes("500") || text.includes("502") || text.includes("503") || text.includes("504"))
    return "provider_error_5xx";
  return "unknown";
}
/** Sanitize an unknown reason into a short log/metric-safe detail suffix. */
function formatUnknownCompactionReasonDetail(reason) {
  const sanitized = sanitizeForLog((reason ?? "").replace(/\s+/g, " "))
    .trim()
    .replace(/[^A-Za-z0-9._:@/+~-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!sanitized) return;
  return sanitized.slice(0, MAX_COMPACTION_REASON_DETAIL_CHARS);
}
//#endregion
export {
  resolveCompactionFailureReason as i,
  classifyCompactionReason as n,
  formatUnknownCompactionReasonDetail as r,
  DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON as t,
};
