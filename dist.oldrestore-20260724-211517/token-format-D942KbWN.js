//#region src/utils/token-format.ts
/** Formats a token count for compact human-facing status text. */
function formatTokenCount(value) {
  if (value === void 0 || !Number.isFinite(value)) return "0";
  const safe = Math.max(0, value);
  if (safe >= 1e6) return `${(safe / 1e6).toFixed(1)}m`;
  if (safe >= 1e3) {
    const precision = safe >= 1e4 ? 0 : 1;
    const formattedThousands = (safe / 1e3).toFixed(precision);
    if (Number(formattedThousands) >= 1e3) return `${(safe / 1e6).toFixed(1)}m`;
    return `${formattedThousands}k`;
  }
  return String(Math.round(safe));
}
//#endregion
export { formatTokenCount as t };
