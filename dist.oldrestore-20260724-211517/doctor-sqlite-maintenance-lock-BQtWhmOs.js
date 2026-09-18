import fs from "node:fs";
import path from "node:path";
import { n as acquireGatewayLock, t as GatewayLockError } from "./gateway-lock-CF4M_1yG.js";
import "./path-guards-CBe_wA_B.js";
import "./boundary-path-CBe_wA_B.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  i as resolveRootPathSync,
  n as resolvePathViaExistingAncestorSync,
} from "./root-path-D-mKQHrm.js";
//#region src/commands/doctor-sqlite-maintenance-lock.ts
/** Serializes offline SQLite maintenance against the Gateway state owner. */
const MAINTENANCE_LOCK_TIMEOUT_MS = 250;
const MAINTENANCE_LOCK_POLL_INTERVAL_MS = 25;
function assertMaintenancePathsOwnedByStateDir(env, operation, protectedPaths) {
  if (protectedPaths.length === 0) return;
  const stateDir = path.resolve(resolveStateDir(env));
  const stateCanonicalDir = resolvePathViaExistingAncestorSync(stateDir);
  for (const protectedPath of protectedPaths) {
    const absolutePath = path.resolve(protectedPath);
    let resolvedPath;
    try {
      if (!isPathInside(stateDir, absolutePath) && !isPathInside(stateCanonicalDir, absolutePath))
        throw new Error("path is not lexically owned by the active state directory");
      resolvedPath = resolveRootPathSync({
        absolutePath,
        boundaryLabel: "OpenClaw state directory",
        rootCanonicalPath: stateCanonicalDir,
        rootPath: stateDir,
      });
    } catch (error) {
      throw new Error(
        `Cannot run ${operation} for a path outside the active OpenClaw state directory: ${protectedPath}. Set OPENCLAW_STATE_DIR to the owning state directory and retry.`,
        { cause: error },
      );
    }
    if (
      resolvedPath.exists &&
      resolvedPath.kind === "file" &&
      fs.statSync(resolvedPath.canonicalPath).nlink > 1
    )
      throw new Error(
        `Cannot run ${operation} for a hard-linked path: ${protectedPath}. Remove the additional hard link and retry.`,
      );
  }
}
function isDestructiveDoctorSessionSqliteMode(mode) {
  return mode === "import" || mode === "compact" || mode === "restore" || mode === "recover";
}
/** Run one destructive doctor operation while excluding Gateway startup and peer maintenance. */
async function withDoctorSqliteMaintenanceLock(params, deps = {}) {
  const env = params.env ?? process.env;
  const acquireLock = deps.acquireLock ?? acquireGatewayLock;
  const lockOptions = deps.lockOptions;
  let lock;
  try {
    lock = await acquireLock({
      ...lockOptions,
      allowInTests: true,
      env,
      pollIntervalMs: lockOptions?.pollIntervalMs ?? MAINTENANCE_LOCK_POLL_INTERVAL_MS,
      role: "sqlite-maintenance",
      timeoutMs: lockOptions?.timeoutMs ?? MAINTENANCE_LOCK_TIMEOUT_MS,
    });
  } catch (error) {
    if (error instanceof GatewayLockError)
      throw new Error(
        `Cannot run ${params.operation} while the Gateway or another SQLite maintenance command owns this OpenClaw state directory. Stop the Gateway and retry.`,
        { cause: error },
      );
    throw error;
  }
  if (!lock)
    throw new Error(`Cannot run ${params.operation} without exclusive OpenClaw state ownership.`);
  try {
    assertMaintenancePathsOwnedByStateDir(env, params.operation, params.protectedPaths ?? []);
    return await params.run();
  } finally {
    await lock.release();
  }
}
//#endregion
export { withDoctorSqliteMaintenanceLock as n, isDestructiveDoctorSessionSqliteMode as t };
