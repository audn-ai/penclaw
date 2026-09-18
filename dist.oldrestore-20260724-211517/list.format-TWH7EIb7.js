import { o as truncateToVisibleWidth, s as visibleWidth } from "./ansi-D4OHEz5F.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { n as isRich$1, r as theme } from "./theme-vjDs9tao.js";
//#region src/commands/models/list.format.ts
/** Formatting helpers for model-list terminal tables. */
const TRUNCATED_SUFFIX = "...";
/** Enables rich formatting only for non-machine-readable output. */
const isRich = (opts) => isRich$1() && !opts?.json && !opts?.plain;
/** Pads a table cell to a fixed terminal visible width. */
const pad = (value, size) => {
  const remaining = size - visibleWidth(value);
  return remaining > 0 ? `${value}${" ".repeat(remaining)}` : value;
};
/** Applies terminal color based on a model-list tag. */
const formatTag = (tag, rich) => {
  if (!rich) return tag;
  if (tag === "default") return theme.success(tag);
  if (tag === "image") return theme.accentBright(tag);
  if (tag === "configured") return theme.accent(tag);
  if (tag === "missing") return theme.error(tag);
  if (tag.startsWith("fallback#")) return theme.warn(tag);
  if (tag.startsWith("img-fallback#")) return theme.warn(tag);
  if (tag.startsWith("alias:")) return theme.accentDim(tag);
  return theme.muted(tag);
};
/** Truncates model-list cells to terminal visible width with an ASCII ellipsis. */
const truncate = (value, max) => {
  const sanitized = sanitizeTerminalText(value);
  if (visibleWidth(sanitized) <= max) return sanitized;
  if (max <= 3) return truncateToVisibleWidth(sanitized, max);
  return `${truncateToVisibleWidth(sanitized, max - 3)}${TRUNCATED_SUFFIX}`;
};
//#endregion
export { truncate as i, isRich as n, pad as r, formatTag as t };
