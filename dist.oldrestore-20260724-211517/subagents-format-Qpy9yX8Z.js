import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./format-duration-DKk9BtRb.js";
//#region src/shared/subagents-format.ts
/** Formats token counts using compact k/m suffixes for subagent summaries. */
function formatTokenShort(value) {
  if (!value || !Number.isFinite(value) || value <= 0) return;
  const n = Math.floor(value);
  if (n < 1e3) return `${n}`;
  if (n < 1e4) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
  if (n < 1e6) {
    const thousands = Math.round(n / 1e3);
    if (thousands < 1e3) return `${thousands}k`;
  }
  return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}m`;
}
/** Truncates a single-line display string without preserving trailing whitespace. */
function truncateLine(value, maxLength) {
  const limit = Math.max(0, Math.floor(maxLength));
  const trimmed = value.trimEnd();
  if (trimmed.length <= limit) return trimmed;
  const marker = "...";
  if (limit <= 3) return marker.slice(0, limit);
  return `${truncateUtf16Safe(trimmed, limit - 3).trimEnd()}${marker}`;
}
/** Resolves total token usage, falling back to input+output when no explicit total exists. */
function resolveTotalTokens(entry) {
  if (!entry || typeof entry !== "object") return;
  if (typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens))
    return entry.totalTokens;
  const total =
    (typeof entry.inputTokens === "number" ? entry.inputTokens : 0) +
    (typeof entry.outputTokens === "number" ? entry.outputTokens : 0);
  return total > 0 ? total : void 0;
}
/** Resolves finite input/output token usage and the derived total. */
function resolveIoTokens(entry) {
  if (!entry || typeof entry !== "object") return;
  const input =
    typeof entry.inputTokens === "number" && Number.isFinite(entry.inputTokens)
      ? entry.inputTokens
      : 0;
  const output =
    typeof entry.outputTokens === "number" && Number.isFinite(entry.outputTokens)
      ? entry.outputTokens
      : 0;
  const total = input + output;
  if (total <= 0) return;
  return {
    input,
    output,
    total,
  };
}
/** Formats token usage for compact subagent list/detail displays. */
function formatTokenUsageDisplay(entry) {
  const io = resolveIoTokens(entry);
  const promptCache = resolveTotalTokens(entry);
  const parts = [];
  if (io) {
    const input = formatTokenShort(io.input) ?? "0";
    const output = formatTokenShort(io.output) ?? "0";
    parts.push(`tokens ${formatTokenShort(io.total)} (in ${input} / out ${output})`);
  } else if (typeof promptCache === "number" && promptCache > 0)
    parts.push(`tokens ${formatTokenShort(promptCache)} prompt/cache`);
  if (typeof promptCache === "number" && io && promptCache > io.total)
    parts.push(`prompt/cache ${formatTokenShort(promptCache)}`);
  return parts.join(", ");
}
//#endregion
export { resolveTotalTokens as n, truncateLine as r, formatTokenUsageDisplay as t };
