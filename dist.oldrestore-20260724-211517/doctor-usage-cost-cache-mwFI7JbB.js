import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { i as maybeScrubConfigAuditLog } from "./doctor-config-audit-scrub-Amqp5CRl.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
//#region src/commands/doctor-usage-cost-cache.ts
/** Doctor cleanup for rebuildable legacy usage-cost cache sidecars. */
const LEGACY_USAGE_COST_TEMP_GRACE_MS = 1e4;
function isLegacyUsageCostCacheTempName(name) {
  return (
    /^\.usage-cost-cache\.\d+\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u.test(
      name,
    ) ||
    /^\.usage-cost-cache(?:\.json)?\.\d+\.tmp$/u.test(name) ||
    /^\.usage-cost-cache\.json\.lock\.\d+(?:\.\d+)?\.tmp$/u.test(name)
  );
}
async function detectLegacyUsageCostCacheFiles(params) {
  const stateDir = resolveStateDir(params?.env ?? process.env, params?.homedir ?? os.homedir);
  const sessionDirs = [path.join(stateDir, "sessions")];
  const agentsDir = path.join(stateDir, "agents");
  const agentEntries = await fs.readdir(agentsDir, { withFileTypes: true }).catch(() => []);
  for (const entry of agentEntries)
    if (entry.isDirectory()) sessionDirs.push(path.join(agentsDir, entry.name, "sessions"));
  const files = [];
  for (const sessionDir of sessionDirs) {
    const entries = await fs.readdir(sessionDir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const filePath = path.join(sessionDir, entry.name);
      if (entry.name === ".usage-cost-cache.json" || entry.name === ".usage-cost-cache.json.lock") {
        files.push(filePath);
        continue;
      }
      if (isLegacyUsageCostCacheTempName(entry.name)) {
        const stats = await fs.stat(filePath).catch(() => null);
        if (stats && Date.now() - stats.mtimeMs >= LEGACY_USAGE_COST_TEMP_GRACE_MS)
          files.push(filePath);
      }
    }
  }
  return files.toSorted();
}
async function maybeRemoveLegacyUsageCostCacheFiles(params) {
  const files = await detectLegacyUsageCostCacheFiles(params);
  if (files.length === 0) return;
  if (!params.shouldRepair) {
    note(
      `${files.length} rebuildable usage-cost cache ${files.length === 1 ? "file remains" : "files remain"}. Run \`openclaw doctor --fix\` to remove ${files.length === 1 ? "it" : "them"}.`,
      "Usage cost cache",
    );
    return;
  }
  const failures = [];
  for (const filePath of files)
    await fs.rm(filePath, { force: true }).catch((error) => {
      failures.push(`${filePath}: ${String(error)}`);
    });
  if (failures.length > 0) {
    note(
      `Failed removing legacy usage-cost cache files:\n${failures.join("\n")}`,
      "Usage cost cache",
    );
    return;
  }
  note(
    `Removed ${files.length} rebuildable legacy usage-cost cache ${files.length === 1 ? "file" : "files"}; SQLite rebuilds the cache on demand.`,
    "Usage cost cache",
  );
}
async function maybeRepairLegacyRuntimeFiles(shouldRepair, env) {
  await maybeScrubConfigAuditLog({
    shouldRepair,
    env,
  });
  await maybeRemoveLegacyUsageCostCacheFiles({
    shouldRepair,
    env,
  });
}
//#endregion
export { maybeRepairLegacyRuntimeFiles };
