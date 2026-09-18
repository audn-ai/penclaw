import { i as normalizeTrustedSafeBinDirs } from "./exec-safe-bin-trust-BJ49w6Hv.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/exec-safe-bin-config.ts
function normalizeConfiguredSafeBins(entries) {
  if (!Array.isArray(entries)) return [];
  return Array.from(
    new Set(
      entries
        .map((entry) => normalizeOptionalLowercaseString(entry) ?? "")
        .filter((entry) => entry.length > 0),
    ),
  ).toSorted();
}
function normalizeConfiguredTrustedSafeBinDirs(entries) {
  if (!Array.isArray(entries)) return [];
  return normalizeTrustedSafeBinDirs(entries.filter((entry) => typeof entry === "string"));
}
//#endregion
export { normalizeConfiguredTrustedSafeBinDirs as n, normalizeConfiguredSafeBins as t };
