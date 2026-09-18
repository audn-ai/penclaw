import "./fs-safe-defaults-B7hUN42l.js";
import {
  i as resetFileLockManagerForTest,
  r as drainFileLockManagerForTest,
  t as acquireFileLock$1,
} from "./file-lock-CnWt2hZ7.js";
import { t as getFileLockProcessStartTime } from "./pid-alive-FK23rkys.js";
import {
  n as shouldRemoveDeadOwnerOrExpiredLock,
  t as isLockOwnerDefinitelyStale,
} from "./stale-lock-file-CrWL3Pfl.js";
//#region src/plugin-sdk/file-lock.ts
/** Stable error code used when lock acquisition retries are exhausted. */
const FILE_LOCK_TIMEOUT_ERROR_CODE = "file_lock_timeout";
/** Stable error code used when stale lock recovery cannot proceed safely. */
const FILE_LOCK_STALE_ERROR_CODE = "file_lock_stale";
const FILE_LOCK_MANAGER_KEY = "openclaw.plugin-sdk.file-lock";
let currentProcessStartTime;
function getCurrentProcessStartTime() {
  if (currentProcessStartTime === void 0)
    currentProcessStartTime = getFileLockProcessStartTime(process.pid);
  return currentProcessStartTime;
}
function normalizeLockError(err) {
  if (err.code === "file_lock_timeout")
    throw Object.assign(new Error(err.message), {
      code: FILE_LOCK_TIMEOUT_ERROR_CODE,
      lockPath: err.lockPath ?? "",
    });
  if (err.code === "file_lock_stale")
    throw Object.assign(new Error(err.message), {
      code: FILE_LOCK_STALE_ERROR_CODE,
      lockPath: err.lockPath ?? "",
    });
  throw err;
}
/** Reset process-local file-lock state for tests that isolate lock managers. */
function resetFileLockStateForTest() {
  resetFileLockManagerForTest(FILE_LOCK_MANAGER_KEY, FILE_LOCK_MANAGER_KEY);
}
/** Wait for process-local file-lock state to drain before test teardown. */
async function drainFileLockStateForTest() {
  await drainFileLockManagerForTest(FILE_LOCK_MANAGER_KEY, FILE_LOCK_MANAGER_KEY);
}
/** Acquire a re-entrant process-local file lock backed by a `.lock` sidecar file. */
async function acquireFileLock(filePath, options) {
  const staleRecovery = options.staleRecovery ?? "remove-if-unchanged";
  try {
    const lock = await acquireFileLock$1(filePath, {
      managerKey: FILE_LOCK_MANAGER_KEY,
      staleMs: options.stale,
      retry: options.retries,
      staleRecovery,
      allowReentrant: true,
      payload: () => {
        const payload = {
          pid: process.pid,
          createdAt: /* @__PURE__ */ new Date().toISOString(),
        };
        const starttime = getCurrentProcessStartTime();
        if (starttime !== null) payload.starttime = starttime;
        return payload;
      },
      shouldReclaim: (params) =>
        staleRecovery === "fail-closed"
          ? isLockOwnerDefinitelyStale({ payload: params.payload })
          : shouldRemoveDeadOwnerOrExpiredLock({
              payload: params.payload,
              staleMs: params.staleMs,
              nowMs: params.nowMs,
            }),
      ...(staleRecovery === "remove-if-unchanged"
        ? {
            shouldRemoveStaleLock: (snapshot) =>
              shouldRemoveDeadOwnerOrExpiredLock({
                payload: snapshot.payload,
                staleMs: options.stale,
              }),
          }
        : {}),
    });
    return {
      lockPath: lock.lockPath,
      release: lock.release,
    };
  } catch (err) {
    return normalizeLockError(err);
  }
}
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
async function withFileLock(filePath, options, fn) {
  const lock = await acquireFileLock(filePath, options);
  try {
    return await fn();
  } finally {
    await lock.release();
  }
}
//#endregion
export {
  resetFileLockStateForTest as a,
  drainFileLockStateForTest as i,
  FILE_LOCK_TIMEOUT_ERROR_CODE as n,
  withFileLock as o,
  acquireFileLock as r,
  FILE_LOCK_STALE_ERROR_CODE as t,
};
