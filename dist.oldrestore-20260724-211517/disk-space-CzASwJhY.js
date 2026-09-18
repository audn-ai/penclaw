import fs from "node:fs";
import path from "node:path";
//#region src/infra/disk-space.ts
const LOW_DISK_SPACE_WARNING_THRESHOLD_BYTES = 1024 * 1024 * 1024;
function finiteNonNegativeNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null;
}
function findExistingDiskSpacePath(targetPath) {
  let current = path.resolve(targetPath);
  while (true)
    try {
      return fs.statSync(current).isDirectory() ? current : path.dirname(current);
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return null;
      current = parent;
    }
}
/** Reads available bytes for the volume containing a target path when statfs is available. */
function tryReadDiskSpace(targetPath) {
  if (typeof fs.statfsSync !== "function") return null;
  const checkedPath = findExistingDiskSpacePath(targetPath);
  if (!checkedPath) return null;
  try {
    const stats = fs.statfsSync(checkedPath);
    const blockSize = finiteNonNegativeNumber(stats.bsize);
    const availableBlocks = finiteNonNegativeNumber(stats.bavail);
    if (blockSize === null || availableBlocks === null) return null;
    const totalBlocks = finiteNonNegativeNumber(stats.blocks);
    return {
      targetPath,
      checkedPath,
      availableBytes: blockSize * availableBlocks,
      totalBytes: totalBlocks === null ? null : blockSize * totalBlocks,
    };
  } catch {
    return null;
  }
}
/** Formats byte counts for compact operator-facing disk-space warnings. */
function formatDiskSpaceBytes(bytes) {
  const mib = bytes / (1024 * 1024);
  const roundedMib = Math.max(0, Math.round(mib));
  if (roundedMib < 1024) return `${roundedMib} MiB`;
  const gib = mib / 1024;
  return `${gib.toFixed(gib < 10 ? 1 : 0)} GiB`;
}
/** Builds a soft low-disk warning for setup/update flows without failing the operation. */
function createLowDiskSpaceWarning(params) {
  const thresholdBytes = params.thresholdBytes ?? LOW_DISK_SPACE_WARNING_THRESHOLD_BYTES;
  const snapshot = tryReadDiskSpace(params.targetPath);
  if (!snapshot || snapshot.availableBytes >= thresholdBytes) return null;
  return `Low disk space near ${path.resolve(snapshot.targetPath) === path.resolve(snapshot.checkedPath) ? snapshot.checkedPath : `${snapshot.targetPath} (volume checked at ${snapshot.checkedPath})`}: ${formatDiskSpaceBytes(snapshot.availableBytes)} available; ${params.purpose} may fail.`;
}
//#endregion
export { formatDiskSpaceBytes as n, tryReadDiskSpace as r, createLowDiskSpaceWarning as t };
