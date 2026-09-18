import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/tool-description-summary.ts
/**
 * Tool description summary helpers.
 *
 * Produces compact one-line summaries for verbose tool descriptions in inventory/list views.
 */
function normalizeSummaryWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}
function truncateSummary(value, maxLen = 120) {
  if (value.length <= maxLen) return value;
  const sliced = truncateUtf16Safe(value, maxLen - 3);
  const boundary = sliced.lastIndexOf(" ");
  return `${(boundary >= 48 ? sliced.slice(0, boundary) : sliced).trimEnd()}...`;
}
function isToolDocBlockStart(line) {
  const normalized = line.trim().toUpperCase();
  if (!normalized) return false;
  if (
    normalized === "ACTIONS:" ||
    normalized === "JOB SCHEMA (FOR ADD ACTION):" ||
    normalized === "JOB SCHEMA:" ||
    normalized === "SESSION TARGET OPTIONS:" ||
    normalized === "DEFAULT BEHAVIOR (UNCHANGED FOR BACKWARD COMPATIBILITY):" ||
    normalized === "SCHEDULE TYPES (SCHEDULE.KIND):" ||
    normalized === "PAYLOAD TYPES (PAYLOAD.KIND):" ||
    normalized === "DELIVERY (TOP-LEVEL):" ||
    normalized === "CRITICAL CONSTRAINTS:" ||
    normalized === "WAKE MODES (FOR WAKE ACTION):"
  )
    return true;
  return (
    normalized.endsWith(":") && line.trim() === line.trim().toUpperCase() && normalized.length > 12
  );
}
/** Build a short one-line summary from a tool description. */
function summarizeToolDescriptionText(params) {
  const explicit = normalizeOptionalString(params.displaySummary) ?? "";
  if (explicit) return truncateSummary(normalizeSummaryWhitespace(explicit), params.maxLen);
  const raw = normalizeOptionalString(params.rawDescription) ?? "";
  if (!raw) return "Tool";
  const paragraphs = normalizeStringEntries(raw.split(/\n\s*\n/g));
  for (const paragraph of paragraphs) {
    const lines = normalizeStringEntries(paragraph.split("\n"));
    if (lines.length === 0) continue;
    const first = lines[0] ?? "";
    if (!first || isToolDocBlockStart(first)) continue;
    if (first.startsWith("{") || first.startsWith("[") || first.startsWith("- ")) continue;
    return truncateSummary(normalizeSummaryWhitespace(first), params.maxLen);
  }
  const firstLine = raw
    .split("\n")
    .map((line) => line.trim())
    .find(
      (line) =>
        line.length > 0 &&
        !isToolDocBlockStart(line) &&
        !line.startsWith("{") &&
        !line.startsWith("[") &&
        !line.startsWith("- "),
    );
  return firstLine ? truncateSummary(normalizeSummaryWhitespace(firstLine), params.maxLen) : "Tool";
}
/** Build a longer verbose description while excluding schema/action blocks. */
function describeToolForVerbose(params) {
  const raw = normalizeOptionalString(params.rawDescription) ?? "";
  if (!raw) return params.fallback;
  const lines = raw.split("\n").map((line) => line.trimEnd());
  const kept = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (kept.length > 0 && kept.at(-1) !== "") kept.push("");
      continue;
    }
    if (
      isToolDocBlockStart(trimmed) ||
      trimmed.startsWith("{") ||
      trimmed.startsWith("[") ||
      trimmed.startsWith("- ")
    )
      break;
    kept.push(trimmed);
    if (kept.join(" ").length >= (params.maxLen ?? 320)) break;
  }
  const normalized = kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!normalized) return params.fallback;
  const maxLen = params.maxLen ?? 320;
  if (normalized.length <= maxLen) return normalized;
  const sliced = truncateUtf16Safe(normalized, maxLen - 3);
  const boundary = sliced.lastIndexOf(" ");
  return `${(boundary >= Math.floor(maxLen / 2) ? sliced.slice(0, boundary) : sliced).trimEnd()}...`;
}
//#endregion
export { summarizeToolDescriptionText as n, describeToolForVerbose as t };
