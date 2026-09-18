import prettyMilliseconds from "pretty-ms";
//#region src/infra/format-time/format-duration-internal.ts
function normalizeSingleUnitDurationMs(ms) {
  const roundedMs = Math.round(ms);
  if (roundedMs < 1e3) return roundedMs;
  const seconds = Math.round(ms / 1e3);
  if (seconds < 60) return seconds * 1e3;
  const minutes = Math.round(ms / 6e4);
  if (minutes < 60) return minutes * 6e4;
  const hours = Math.round(ms / 36e5);
  if (hours < 24) return hours * 36e5;
  return Math.round(ms / 864e5) * 864e5;
}
/** Keep single-unit rounding identical for compact and verbose core displays. */
function formatSingleUnitDuration(ms, verbose = false) {
  return prettyMilliseconds(normalizeSingleUnitDurationMs(ms), {
    hideYear: true,
    unitCount: 1,
    verbose,
  });
}
//#endregion
//#region src/infra/format-time/format-duration.ts
function formatDurationSeconds(ms, options = {}) {
  if (!Number.isFinite(ms)) return "unknown";
  const decimals = options.decimals ?? 1;
  const unit = options.unit ?? "s";
  const trimmed = (Math.max(0, ms) / 1e3)
    .toFixed(Math.max(0, decimals))
    .replace(/\.0+$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
  return unit === "seconds" ? `${trimmed} seconds` : `${trimmed}s`;
}
/** Precise decimal-seconds output: "500ms" or "1.23s". Input is milliseconds. */
function formatDurationPrecise(ms, options = {}) {
  if (!Number.isFinite(ms)) return "unknown";
  const roundedMs = Math.max(0, Math.round(ms));
  if (roundedMs < 1e3) return prettyMilliseconds(roundedMs);
  return formatDurationSeconds(ms, {
    decimals: options.decimals ?? 2,
    unit: options.unit ?? "s",
  });
}
/**
 * Compact compound duration: "500ms", "45s", "2m5s", "1h30m".
 * With `spaced`: "45s", "2m 5s", "1h 30m".
 * Omits trailing zero components: "1m" not "1m 0s", "2h" not "2h 0m".
 * Returns undefined for null/undefined/non-finite/non-positive input.
 */
function formatDurationCompact(ms, options) {
  if (ms == null || !Number.isFinite(ms) || ms <= 0) return;
  const roundedMs = Math.round(ms);
  if (roundedMs < 1e3) return prettyMilliseconds(roundedMs);
  const formatted = prettyMilliseconds(Math.round(ms / 1e3) * 1e3, {
    hideYear: true,
    unitCount: 2,
  });
  return options?.spaced ? formatted : formatted.replaceAll(" ", "");
}
/**
 * Rounded single-unit duration for display: "500ms", "5s", "3m", "2h", "5d".
 * Returns fallback string for null/undefined/non-finite input.
 */
function formatDurationHuman(ms, fallback = "n/a") {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return fallback;
  return formatSingleUnitDuration(ms);
}
//#endregion
export {
  formatSingleUnitDuration as a,
  formatDurationSeconds as i,
  formatDurationHuman as n,
  formatDurationPrecise as r,
  formatDurationCompact as t,
};
