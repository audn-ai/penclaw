import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { a as listGitWorktrees, t as commandError, u as runGit } from "./git-CvJkUhVJ.js";
import {
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  i as isPidDefinitelyDead,
  t as getFileLockProcessStartTime,
} from "./pid-alive-FK23rkys.js";
import { t as isLockOwnerDefinitelyStale } from "./stale-lock-file-CrWL3Pfl.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/worktrees/git-lock.ts
const OPENCLAW_LOCK_PATTERN = /^openclaw pid=(\d+)$/;
async function lockState(record) {
  const entry = (await listGitWorktrees(record.repoRoot)).find(
    (candidate) => path.resolve(candidate.path) === path.resolve(record.path),
  );
  if (!entry || entry.lockedReason === void 0) return { kind: "none" };
  const match = OPENCLAW_LOCK_PATTERN.exec(entry.lockedReason);
  if (!match)
    return {
      kind: "foreign",
      reason: entry.lockedReason,
    };
  const pid = Number(match[1]);
  return isPidDefinitelyDead(pid)
    ? {
        kind: "dead",
        pid,
      }
    : {
        kind: "live",
        pid,
      };
}
async function lockWorktreeForProcess(record) {
  const result = await runGit(record.repoRoot, [
    "worktree",
    "lock",
    "--reason",
    `openclaw pid=${process.pid}`,
    record.path,
  ]);
  if (result.code !== 0) {
    const state = await lockState(record);
    if (state.kind !== "live" || state.pid !== process.pid)
      throw commandError("git worktree lock", result);
  }
}
async function unlockWorktree(record) {
  const result = await runGit(record.repoRoot, ["worktree", "unlock", record.path]);
  if (result.code !== 0) throw commandError("git worktree unlock", result);
}
//#endregion
//#region src/agents/worktrees/registry.ts
function dbFor(env) {
  return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
  return getNodeSqliteKysely(db);
}
function kyselyLeaseFor(db) {
  return getNodeSqliteKysely(db);
}
function rowToRecord(row) {
  return {
    id: row.id,
    name: row.path.split(/[\\/]/).at(-1) ?? row.id,
    repoFingerprint: row.repo_fingerprint,
    repoRoot: row.repo_root,
    path: row.path,
    branch: row.branch,
    baseRef: row.base_ref,
    ownerKind: row.owner_kind,
    ...(row.owner_id ? { ownerId: row.owner_id } : {}),
    ...(row.snapshot_ref ? { snapshotRef: row.snapshot_ref } : {}),
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at,
    ...(row.removed_at == null ? {} : { removedAt: row.removed_at }),
  };
}
function recordToRow(record) {
  return {
    id: record.id,
    repo_fingerprint: record.repoFingerprint,
    repo_root: record.repoRoot,
    path: record.path,
    branch: record.branch,
    base_ref: record.baseRef,
    owner_kind: record.ownerKind,
    owner_id: record.ownerId ?? null,
    snapshot_ref: record.snapshotRef ?? null,
    created_at: record.createdAt,
    last_active_at: record.lastActiveAt,
    removed_at: record.removedAt ?? null,
  };
}
function listRegistryWorktrees(env) {
  const db = dbFor(env);
  return executeSqliteQuerySync(
    db,
    kyselyFor(db)
      .selectFrom("worktrees")
      .selectAll()
      .orderBy("created_at", "desc")
      .orderBy("id", "asc"),
  ).rows.map(rowToRecord);
}
function getRegistryWorktree(env, id) {
  const db = dbFor(env);
  const row = executeSqliteQuerySync(
    db,
    kyselyFor(db).selectFrom("worktrees").selectAll().where("id", "=", id),
  ).rows[0];
  return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByPath(env, worktreePath) {
  const db = dbFor(env);
  const row = executeSqliteQuerySync(
    db,
    kyselyFor(db)
      .selectFrom("worktrees")
      .selectAll()
      .where("path", "=", worktreePath)
      .where("removed_at", "is", null)
      .orderBy("created_at", "desc")
      .limit(1),
  ).rows[0];
  return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByOwner(env, ownerKind, ownerId) {
  const db = dbFor(env);
  const row = executeSqliteQuerySync(
    db,
    kyselyFor(db)
      .selectFrom("worktrees")
      .selectAll()
      .where("owner_kind", "=", ownerKind)
      .where("owner_id", "=", ownerId)
      .where("removed_at", "is", null)
      .orderBy("created_at", "desc")
      .limit(1),
  ).rows[0];
  return row ? rowToRecord(row) : void 0;
}
function findRegistryWorktreeByPath(env, worktreePath) {
  const db = dbFor(env);
  const row = executeSqliteQuerySync(
    db,
    kyselyFor(db)
      .selectFrom("worktrees")
      .selectAll()
      .where("path", "=", worktreePath)
      .orderBy("created_at", "desc")
      .limit(1),
  ).rows[0];
  return row ? rowToRecord(row) : void 0;
}
function insertRegistryWorktree(env, record) {
  const db = dbFor(env);
  runOpenClawStateWriteTransaction(() => {
    executeSqliteQuerySync(db, kyselyFor(db).insertInto("worktrees").values(recordToRow(record)));
  });
}
function updateRegistryWorktree(env, id, patch) {
  const db = dbFor(env);
  const values = {};
  if (patch.lastActiveAt !== void 0) values.last_active_at = patch.lastActiveAt;
  if ("removedAt" in patch) values.removed_at = patch.removedAt ?? null;
  if ("snapshotRef" in patch) values.snapshot_ref = patch.snapshotRef ?? null;
  runOpenClawStateWriteTransaction(() => {
    executeSqliteQuerySync(
      db,
      kyselyFor(db).updateTable("worktrees").set(values).where("id", "=", id),
    );
  });
}
function deleteRegistryWorktree(env, id) {
  const db = dbFor(env);
  runOpenClawStateWriteTransaction(() => {
    executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("id", "=", id));
  });
}
const WORKTREE_RUN_LEASE_SCOPE_PREFIX = "worktree-run:";
const WORKTREE_REMOVING_LEASE_KEY = "__removing__";
function worktreeRunLeaseScope(worktreeId) {
  return `${WORKTREE_RUN_LEASE_SCOPE_PREFIX}${worktreeId}`;
}
function parseLeaseOwnerPayload(payloadJson) {
  if (!payloadJson) return {};
  try {
    const parsed = JSON.parse(payloadJson);
    return {
      pid: typeof parsed.pid === "number" ? parsed.pid : void 0,
      starttime: typeof parsed.starttime === "number" ? parsed.starttime : void 0,
    };
  } catch {
    return {};
  }
}
function collectLiveRunLeases(db, k, scope, checks) {
  const rows = executeSqliteQuerySync(
    db,
    k
      .selectFrom("state_leases")
      .select(["lease_key", "owner", "payload_json"])
      .where("scope", "=", scope),
  ).rows;
  const livePids = [];
  const staleKeys = [];
  let removingToken;
  for (const row of rows) {
    const payload = parseLeaseOwnerPayload(row.payload_json);
    const stale = isLockOwnerDefinitelyStale({
      payload,
      isPidDefinitelyDead: checks.isPidDefinitelyDead,
      getProcessStartTime: checks.getProcessStartTime,
    });
    if (row.lease_key === WORKTREE_REMOVING_LEASE_KEY) {
      if (stale) staleKeys.push(row.lease_key);
      else removingToken = row.owner;
      continue;
    }
    if (stale) {
      staleKeys.push(row.lease_key);
      continue;
    }
    if (payload.pid !== void 0) livePids.push(payload.pid);
  }
  if (staleKeys.length > 0)
    executeSqliteQuerySync(
      db,
      k.deleteFrom("state_leases").where("scope", "=", scope).where("lease_key", "in", staleKeys),
    );
  return {
    livePids,
    ...(removingToken !== void 0 ? { removingToken } : {}),
  };
}
function admitWorktreeRunLeaseRow(env, params) {
  runOpenClawStateWriteTransaction(
    (database) => {
      const db = database.db;
      const k = kyselyLeaseFor(db);
      const scope = worktreeRunLeaseScope(params.worktreeId);
      const record = executeSqliteQuerySync(
        db,
        k
          .selectFrom("worktrees")
          .select(["path", "removed_at"])
          .where("id", "=", params.worktreeId),
      ).rows[0];
      const worktreePath = record?.path ?? params.worktreeId;
      if (!record || record.removed_at != null)
        throw new Error(`managed worktree was removed: ${worktreePath}`);
      const { removingToken } = collectLiveRunLeases(db, k, scope, params.checks ?? {});
      if (removingToken !== void 0)
        throw new Error(`managed worktree was removed: ${worktreePath}`);
      executeSqliteQuerySync(
        db,
        k.insertInto("state_leases").values({
          scope,
          lease_key: params.token,
          owner: `${params.pid}:${params.startTime ?? ""}`,
          expires_at: null,
          heartbeat_at: null,
          payload_json: JSON.stringify({
            pid: params.pid,
            starttime: params.startTime ?? void 0,
          }),
          created_at: params.now,
          updated_at: params.now,
        }),
      );
    },
    { env },
  );
}
function claimWorktreeRemovalRow(env, params) {
  runOpenClawStateWriteTransaction(
    (database) => {
      const db = database.db;
      const k = kyselyLeaseFor(db);
      const scope = worktreeRunLeaseScope(params.worktreeId);
      const { livePids, removingToken } = collectLiveRunLeases(db, k, scope, params.checks ?? {});
      if (!params.force && livePids.length > 0)
        throw new Error(`worktree is busy: locked by live pid ${livePids[0]}`);
      if (removingToken !== void 0 && removingToken !== params.token)
        throw new Error("worktree removal is already in progress");
      const payloadJson = JSON.stringify({
        pid: params.pid,
        starttime: params.startTime ?? void 0,
      });
      executeSqliteQuerySync(
        db,
        k
          .insertInto("state_leases")
          .values({
            scope,
            lease_key: WORKTREE_REMOVING_LEASE_KEY,
            owner: params.token,
            expires_at: null,
            heartbeat_at: null,
            payload_json: payloadJson,
            created_at: params.now,
            updated_at: params.now,
          })
          .onConflict((conflict) =>
            conflict.columns(["scope", "lease_key"]).doUpdateSet({
              owner: params.token,
              payload_json: payloadJson,
              updated_at: params.now,
            }),
          ),
      );
    },
    { env },
  );
}
function releaseWorktreeRunLeaseRow(env, worktreeId, token) {
  const db = dbFor(env);
  runOpenClawStateWriteTransaction(
    () => {
      executeSqliteQuerySync(
        db,
        kyselyLeaseFor(db)
          .deleteFrom("state_leases")
          .where("scope", "=", worktreeRunLeaseScope(worktreeId))
          .where("lease_key", "=", token),
      );
    },
    { env },
  );
}
function finalizeWorktreeRemovalRows(env, worktreeId) {
  const db = dbFor(env);
  runOpenClawStateWriteTransaction(
    () => {
      executeSqliteQuerySync(
        db,
        kyselyLeaseFor(db)
          .deleteFrom("state_leases")
          .where("scope", "=", worktreeRunLeaseScope(worktreeId)),
      );
    },
    { env },
  );
}
function abortWorktreeRemovalRow(env, worktreeId, token) {
  const db = dbFor(env);
  runOpenClawStateWriteTransaction(
    () => {
      executeSqliteQuerySync(
        db,
        kyselyLeaseFor(db)
          .deleteFrom("state_leases")
          .where("scope", "=", worktreeRunLeaseScope(worktreeId))
          .where("lease_key", "=", WORKTREE_REMOVING_LEASE_KEY)
          .where("owner", "=", token),
      );
    },
    { env },
  );
}
function hasLiveWorktreeRunLeaseRow(env, worktreeId, checks) {
  return runOpenClawStateWriteTransaction(
    (database) => {
      const db = database.db;
      const { livePids } = collectLiveRunLeases(
        db,
        kyselyLeaseFor(db),
        worktreeRunLeaseScope(worktreeId),
        checks ?? {},
      );
      return livePids.length > 0;
    },
    { env },
  );
}
//#endregion
//#region src/agents/worktrees/run-lease.ts
const log = createSubsystemLogger("agents/worktrees");
const RELEASE_MAX_ATTEMPTS = 3;
const heldGitLocks = /* @__PURE__ */ new Map();
const gitLockTransitionTails = /* @__PURE__ */ new Map();
let ownerChecks = {};
let resolveSelfStartTime = getFileLockProcessStartTime;
let releaseRunLeaseRow = releaseWorktreeRunLeaseRow;
let unlockWorktreeImpl = unlockWorktree;
const pendingLeaseCleanups = /* @__PURE__ */ new Set();
let exitCleanupRegistered = false;
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
async function withGitLockTransition(id, operation) {
  const previous = gitLockTransitionTails.get(id) ?? Promise.resolve();
  let finish;
  const current = new Promise((resolve) => {
    finish = resolve;
  });
  const tail = previous.then(() => current);
  gitLockTransitionTails.set(id, tail);
  await previous;
  try {
    return await operation();
  } finally {
    finish();
    if (gitLockTransitionTails.get(id) === tail) gitLockTransitionTails.delete(id);
  }
}
async function retainGitLock(env, id) {
  await withGitLockTransition(id, async () => {
    const held = heldGitLocks.get(id) ?? {
      refcount: 0,
      gitLocked: false,
    };
    const needsLock = held.refcount === 0 && !held.gitLocked;
    held.refcount += 1;
    heldGitLocks.set(id, held);
    if (!needsLock) return;
    const record = getRegistryWorktree(env, id);
    if (!record) return;
    try {
      await lockWorktreeForProcess(record);
      held.gitLocked = true;
    } catch (error) {
      log.warn(`worktree git lock unavailable for ${id}: ${errorMessage(error)}`);
    }
  });
}
async function releaseGitLock(cleanup) {
  return await withGitLockTransition(cleanup.id, async () => {
    let held = heldGitLocks.get(cleanup.id);
    if (!cleanup.refcountReleased) {
      cleanup.refcountReleased = true;
      if (held) held.refcount -= 1;
    }
    held = heldGitLocks.get(cleanup.id);
    if (!held) {
      cleanup.gitUnlockPending = false;
      return true;
    }
    if (held.refcount > 0) {
      cleanup.gitUnlockPending = false;
      return true;
    }
    if (!held.gitLocked) {
      heldGitLocks.delete(cleanup.id);
      cleanup.gitUnlockPending = false;
      return true;
    }
    const record = getRegistryWorktree(cleanup.env, cleanup.id);
    if (!record) {
      heldGitLocks.delete(cleanup.id);
      cleanup.gitUnlockPending = false;
      return true;
    }
    try {
      await unlockWorktreeImpl(record);
    } catch (error) {
      cleanup.gitUnlockPending = true;
      log.warn(`failed to unlock worktree ${cleanup.id}: ${errorMessage(error)}`);
      return false;
    }
    heldGitLocks.delete(cleanup.id);
    cleanup.gitUnlockPending = false;
    return true;
  });
}
async function realpathOrSelf(candidate) {
  try {
    return await fs.realpath(candidate);
  } catch {
    return path.resolve(candidate);
  }
}
async function resolveWorktreeIdForPath(params) {
  const env = params.env ?? process.env;
  const boundId = params.sessionEntry?.worktree?.id;
  if (boundId !== void 0) {
    const record = getRegistryWorktree(env, boundId);
    if (!record || record.removedAt !== void 0)
      throw new Error(`managed worktree was removed: ${record?.path ?? boundId}`);
    return boundId;
  }
  const records = listRegistryWorktrees(env).filter((record) => record.removedAt === void 0);
  if (records.length === 0) return;
  const bases = /* @__PURE__ */ new Map();
  for (const record of records) bases.set(record.id, await realpathOrSelf(record.path));
  const seen = /* @__PURE__ */ new Set();
  for (const candidate of params.candidatePaths) {
    if (!candidate || seen.has(candidate)) continue;
    seen.add(candidate);
    const real = await realpathOrSelf(candidate);
    for (const record of records) {
      const base = bases.get(record.id);
      if (base && (real === base || real.startsWith(`${base}${path.sep}`))) return record.id;
    }
  }
}
function deleteRunLeaseRowWithRetries(cleanup) {
  for (let attempt = 1; attempt <= RELEASE_MAX_ATTEMPTS; attempt += 1)
    try {
      releaseRunLeaseRow(cleanup.env, cleanup.id, cleanup.token);
      return true;
    } catch (error) {
      log.warn(
        `failed to release worktree run lease for ${cleanup.id} (attempt ${attempt}): ${errorMessage(error)}`,
      );
    }
  return false;
}
async function runLeaseCleanup(cleanup) {
  if (!cleanup.rowDeleted) {
    if (!deleteRunLeaseRowWithRetries(cleanup)) return false;
    cleanup.rowDeleted = true;
  }
  return await releaseGitLock(cleanup);
}
async function drainPendingLeaseCleanups() {
  for (const cleanup of pendingLeaseCleanups)
    if (await runLeaseCleanup(cleanup)) pendingLeaseCleanups.delete(cleanup);
}
function ensureExitCleanupRegistered() {
  if (exitCleanupRegistered) return;
  exitCleanupRegistered = true;
  process.on("exit", () => {
    for (const cleanup of pendingLeaseCleanups)
      if (!cleanup.rowDeleted)
        try {
          releaseRunLeaseRow(cleanup.env, cleanup.id, cleanup.token);
        } catch {}
  });
}
async function acquireWorktreeRunLease(id, opts = {}) {
  const env = opts.env ?? process.env;
  ensureExitCleanupRegistered();
  await drainPendingLeaseCleanups();
  const token = randomUUID();
  const pid = process.pid;
  admitWorktreeRunLeaseRow(env, {
    worktreeId: id,
    token,
    pid,
    startTime: resolveSelfStartTime(pid),
    now: Date.now(),
    checks: ownerChecks,
  });
  await retainGitLock(env, id);
  const cleanup = {
    env,
    id,
    token,
    rowDeleted: false,
    refcountReleased: false,
    gitUnlockPending: false,
  };
  let released = false;
  return {
    id,
    token,
    release: async () => {
      if (released) return;
      released = true;
      if (!(await runLeaseCleanup(cleanup))) pendingLeaseCleanups.add(cleanup);
    },
  };
}
function claimWorktreeRemoval(env, params) {
  const pid = process.pid;
  claimWorktreeRemovalRow(env, {
    ...params,
    pid,
    startTime: resolveSelfStartTime(pid),
    now: Date.now(),
    checks: ownerChecks,
  });
}
function finalizeWorktreeRemoval(env, worktreeId) {
  finalizeWorktreeRemovalRows(env, worktreeId);
}
function abortWorktreeRemoval(env, worktreeId, token) {
  abortWorktreeRemovalRow(env, worktreeId, token);
}
function hasLiveWorktreeRunLease(env, worktreeId) {
  return hasLiveWorktreeRunLeaseRow(env, worktreeId, ownerChecks);
}
//#endregion
export {
  unlockWorktree as _,
  hasLiveWorktreeRunLease as a,
  findLiveRegistryWorktreeByOwner as c,
  getRegistryWorktree as d,
  insertRegistryWorktree as f,
  lockWorktreeForProcess as g,
  lockState as h,
  finalizeWorktreeRemoval as i,
  findLiveRegistryWorktreeByPath as l,
  updateRegistryWorktree as m,
  acquireWorktreeRunLease as n,
  resolveWorktreeIdForPath as o,
  listRegistryWorktrees as p,
  claimWorktreeRemoval as r,
  deleteRegistryWorktree as s,
  abortWorktreeRemoval as t,
  findRegistryWorktreeByPath as u,
};
