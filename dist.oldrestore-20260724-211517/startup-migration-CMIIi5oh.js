import fs from "node:fs/promises";
import path from "node:path";
import {
  _ as isSessionStoreTempArtifactName,
  d as SESSION_STORE_TEMP_STALE_MS,
} from "./paths-TfuVT-K8.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { d as migrateOrphanedSessionKeys } from "./state-migrations-BSw_FCn6.js";
import { i as resolveAllAgentSessionStoreTargetsSync } from "./targets-CjMfpXbt.js";
//#region src/config/sessions/store-temp-cleanup.ts
const DELETE_CONCURRENCY = 16;
async function hasValidPrimaryStore(storePath) {
  try {
    return isRecord(JSON.parse(await fs.readFile(storePath, "utf8")));
  } catch {
    return false;
  }
}
/** Removes stale atomic-write temps only when the primary store is recoverable. */
async function sweepOrphanSessionStoreTemps(params) {
  const storeDir = path.dirname(params.storePath);
  const storeBasename = path.basename(params.storePath);
  const cutoffMs = (params.nowMs ?? Date.now()) - SESSION_STORE_TEMP_STALE_MS;
  const entries = await fs.readdir(storeDir, { withFileTypes: true }).catch(() => []);
  const { results: staleCandidates } = await runTasksWithConcurrency({
    limit: DELETE_CONCURRENCY,
    tasks: entries
      .filter(
        (entry) => entry.isFile() && isSessionStoreTempArtifactName(entry.name, storeBasename),
      )
      .map((entry) => async () => {
        const candidatePath = path.join(storeDir, entry.name);
        const stat = await fs.stat(candidatePath).catch(() => null);
        if (!stat?.isFile() || stat.mtimeMs > cutoffMs) return null;
        return candidatePath;
      }),
  });
  const stalePaths = staleCandidates.filter((candidatePath) => typeof candidatePath === "string");
  if (stalePaths.length === 0 || !(await hasValidPrimaryStore(params.storePath))) return 0;
  const { results } = await runTasksWithConcurrency({
    limit: DELETE_CONCURRENCY,
    tasks: stalePaths.map((candidatePath) => async () => {
      try {
        await fs.unlink(candidatePath);
        return 1;
      } catch {
        return 0;
      }
    }),
  });
  let removedCount = 0;
  for (const removed of results) removedCount += removed;
  return removedCount;
}
//#endregion
//#region src/config/sessions/startup-migration.ts
/**
 * Run session migration and orphan-temp cleanup before runtime store reads.
 *
 * Both passes are idempotent and failure-isolated: startup continues if either
 * fails, but warnings stay visible for operator follow-up.
 */
async function runSessionStartupMigration(params) {
  const migrate = params.deps?.migrateOrphanedSessionKeys ?? migrateOrphanedSessionKeys;
  try {
    const result = await migrate({
      cfg: params.cfg,
      env: params.env ?? process.env,
    });
    if (result.changes.length > 0)
      params.log.info(
        `session: canonicalized orphaned session keys:\n${result.changes.map((c) => `- ${c}`).join("\n")}`,
      );
    if (result.warnings.length > 0)
      params.log.warn(
        `session: session key migration warnings:\n${result.warnings.map((w) => `- ${w}`).join("\n")}`,
      );
  } catch (err) {
    params.log.warn(
      `session: orphaned session key migration failed during startup; continuing: ${String(err)}`,
    );
  }
  const resolveTargets =
    params.deps?.resolveAllAgentSessionStoreTargetsSync ?? resolveAllAgentSessionStoreTargetsSync;
  const sweepTemps = params.deps?.sweepOrphanSessionStoreTemps ?? sweepOrphanSessionStoreTemps;
  try {
    let removedFiles = 0;
    for (const target of resolveTargets(params.cfg, { env: params.env ?? process.env }))
      removedFiles += await sweepTemps({ storePath: target.storePath });
    if (removedFiles > 0)
      params.log.info(`session: removed ${removedFiles} stale session store temp file(s)`);
  } catch (err) {
    params.log.warn(
      `session: stale session store temp cleanup failed during startup; continuing: ${String(err)}`,
    );
  }
}
//#endregion
export { runSessionStartupMigration as t };
