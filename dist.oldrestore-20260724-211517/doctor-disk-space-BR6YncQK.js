import os from "node:os";
import { r as tryReadDiskSpace } from "./disk-space-CzASwJhY.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as formatByteSize } from "./format-DBMNwbgU.js";
import { o as resolveRequiredHomeDir } from "./home-dir-DxrrpDft.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor-disk-space.ts
const DISK_SPACE_CHECK_ID = "core/doctor/disk-space";
const CRITICAL_BYTES = 100 * 1024 * 1024;
const WARNING_BYTES = 500 * 1024 * 1024;
/**
 * Format a byte count into a human-readable string (B / KB / MB / GB).
 * Uses Math.floor for MB/KB values to avoid rounding up past a decision
 * threshold (e.g. 99.6 MB should display as "99 MB", not "100 MB").
 * Exported for testing.
 */
function formatBytes(bytes) {
  if (bytes < 0 || !Number.isFinite(bytes)) return "unknown";
  return formatByteSize(bytes, {
    style: "legacy-binary",
    maxUnit: "giga",
    separator: " ",
    fractionDigits: (_value, unit) => (unit === "byte" ? null : unit === "giga" ? 1 : 0),
    floorUnits: ["kilo", "mega"],
  });
}
/**
 * Build warning lines based on available disk space.
 */
function buildDiskSpaceWarnings(params) {
  const { availableBytes, displayStateDir } = params;
  const displayFreeSpace = formatBytes(availableBytes);
  const warnings = [];
  if (availableBytes < CRITICAL_BYTES) {
    warnings.push(
      `- CRITICAL: only ${displayFreeSpace} free on the partition containing ${displayStateDir}.`,
    );
    warnings.push("- Config writes, session transcripts, and log rotation may fail silently.");
    warnings.push("- Free up disk space immediately to avoid data loss.");
  } else if (availableBytes < WARNING_BYTES) {
    warnings.push(
      `- Low disk space: ${displayFreeSpace} free on the partition containing ${displayStateDir}.`,
    );
    warnings.push("- Consider freeing space to prevent future config/session write failures.");
  }
  return warnings;
}
function collectDiskSpaceWarnings(params) {
  const env = params.env ?? process.env;
  const homedir = () => resolveRequiredHomeDir(env, os.homedir);
  const stateDir = resolveStateDir(env, homedir);
  const snapshot = (params.readDiskSpace ?? tryReadDiskSpace)(stateDir);
  if (!snapshot) return null;
  const displayStateDir = shortenHomePath(stateDir);
  const warnings = buildDiskSpaceWarnings({
    availableBytes: snapshot.availableBytes,
    displayStateDir,
  });
  return {
    availableBytes: snapshot.availableBytes,
    stateDir,
    warnings,
  };
}
/** Collects read-only structured findings for low disk space around the state directory. */
function collectDiskSpaceHealthFindings(_cfg, deps) {
  const result = collectDiskSpaceWarnings({
    env: deps?.env,
    readDiskSpace: deps?.readDiskSpace,
  });
  if (!result || result.warnings.length === 0) return [];
  const [message, ...details] = result.warnings;
  return [
    {
      checkId: DISK_SPACE_CHECK_ID,
      severity: "warning",
      message: expectDefined(message, "disk-space warning message").replace(/^- /, ""),
      path: result.stateDir,
      target: formatBytes(result.availableBytes),
      requirement:
        result.availableBytes < CRITICAL_BYTES ? "critical-free-space" : "low-free-space",
      fixHint: details.map((line) => line.replace(/^- /, "")).join(" "),
    },
  ];
}
/**
 * Doctor health contribution: check free disk space on the partition that
 * holds the state directory and warn when it drops below safe thresholds.
 *
 * This catches a common operational failure mode where OpenClaw silently
 * fails to write config, sessions, or logs because the disk is full.
 *
 * Disk-space probing (statfs + nearest-existing-ancestor resolution) is
 * delegated to the shared src/infra/disk-space.ts helper so this Doctor
 * check and the install/update diagnostics stay on one implementation.
 * The two-tier warning/critical thresholds and Doctor-facing formatting
 * are specific to this health contribution.
 */
function noteDiskSpace(_cfg, deps) {
  const result = collectDiskSpaceWarnings({
    env: deps?.env,
    readDiskSpace: deps?.readDiskSpace,
  });
  if (!result || result.warnings.length === 0) return;
  note(result.warnings.join("\n"), "Disk space");
}
//#endregion
export { formatBytes as n, noteDiskSpace as r, collectDiskSpaceHealthFindings as t };
