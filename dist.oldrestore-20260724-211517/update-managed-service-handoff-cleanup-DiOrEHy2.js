import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/update-managed-service-handoff-cleanup.ts
const MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX = "openclaw-update-run-handoff-";
const MANAGED_SERVICE_UPDATE_HANDOFF_STALE_TTL_MS = 1440 * 6e4;
async function cleanupStaleManagedServiceUpdateHandoffs(params) {
  const tmpDir = params?.tmpDir ?? os.tmpdir();
  const nowMs = params?.nowMs ?? Date.now();
  const ttlMs = params?.ttlMs ?? MANAGED_SERVICE_UPDATE_HANDOFF_STALE_TTL_MS;
  let entries;
  try {
    entries = await fs.readdir(tmpDir, { withFileTypes: true });
  } catch {
    return 0;
  }
  let removed = 0;
  for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isDirectory() || !entry.name.startsWith("openclaw-update-run-handoff-")) continue;
    const dir = path.join(tmpDir, entry.name);
    let stats;
    try {
      stats = await fs.stat(dir);
    } catch {
      continue;
    }
    if (nowMs - stats.mtimeMs < ttlMs) continue;
    try {
      await fs.rm(dir, {
        recursive: true,
        force: true,
      });
      removed += 1;
    } catch {}
  }
  return removed;
}
//#endregion
export {
  cleanupStaleManagedServiceUpdateHandoffs as n,
  MANAGED_SERVICE_UPDATE_HANDOFF_TEMP_PREFIX as t,
};
