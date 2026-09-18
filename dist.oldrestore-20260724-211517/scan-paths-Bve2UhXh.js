import "./path-safety-CBe_wA_B.js";
//#region src/security/scan-paths.ts
/** Return true for extension paths intentionally skipped by source scanners. */
function extensionUsesSkippedScannerPath(entry) {
  return entry
    .split(/[\\/]+/)
    .filter(Boolean)
    .some(
      (segment) =>
        segment === "node_modules" ||
        (segment.startsWith(".") && segment !== "." && segment !== ".."),
    );
}
//#endregion
export { extensionUsesSkippedScannerPath as t };
