import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
//#region src/gateway/worker-environments/placement-record.ts
function required(value, field) {
  const normalized = value.trim();
  if (!normalized) throw new Error(`Worker session placement ${field} must be a non-empty string`);
  return normalized;
}
function nullableRequired(value, field) {
  return value === null ? null : required(value, field);
}
function normalizeEpoch(value, field) {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error(`Worker session placement ${field} must be a positive safe integer`);
  return value;
}
function normalizeCursor(value, field) {
  if (value !== null && (!Number.isSafeInteger(value) || value < 0))
    throw new Error(`Worker session placement ${field} must be a non-negative safe integer`);
  return value;
}
function advanceCursor(current, value, field) {
  if (value === void 0) return current;
  const next = normalizeCursor(value, field);
  if (next === null || current === null) return next ?? current;
  return Math.max(current, next);
}
function normalizeIdentity(input) {
  return {
    sessionId: required(input.sessionId, "session id"),
    agentId: required(input.agentId, "agent id"),
    sessionKey: required(input.sessionKey, "session key"),
  };
}
function nextGeneration(generation) {
  const next = generation + 1;
  if (!Number.isSafeInteger(next))
    throw new Error("Worker session placement generation is exhausted");
  return next;
}
function localTurnClaimForState(turnClaim, state) {
  if (turnClaim?.owner === "worker")
    throw new Error(`Worker turn claim cannot survive placement ${state}`);
  return turnClaim;
}
function workerTurnClaimForState(turnClaim, state) {
  if (turnClaim?.owner === "local")
    throw new Error(`Local turn claim cannot survive placement ${state}`);
  return turnClaim;
}
function unclaimedTurnForState(turnClaim, state) {
  if (turnClaim !== null) throw new Error(`Turn claim cannot survive placement ${state}`);
  return null;
}
function assertRecordShape(record) {
  if (record.state === "local" || record.state === "requested") {
    if (
      record.environmentId !== null ||
      record.activeOwnerEpoch !== null ||
      record.workspaceBaseManifestRef !== null ||
      record.remoteWorkspaceDir !== null ||
      record.workerBundleHash !== null ||
      record.lastTranscriptAckCursor !== null ||
      record.lastLiveEventAckCursor !== null ||
      record.recoveryError !== null
    )
      throw new Error(`Worker session placement ${record.state} cannot retain worker metadata`);
  } else if (record.state === "provisioning") {
    if (
      record.activeOwnerEpoch !== null ||
      record.workspaceBaseManifestRef !== null ||
      record.remoteWorkspaceDir !== null ||
      record.workerBundleHash !== null ||
      record.lastTranscriptAckCursor !== null ||
      record.lastLiveEventAckCursor !== null ||
      record.recoveryError !== null
    )
      throw new Error("Provisioning worker session placement can only retain an environment id");
  } else if (record.state === "syncing") {
    if (
      !record.environmentId ||
      record.activeOwnerEpoch !== null ||
      record.workspaceBaseManifestRef !== null ||
      record.remoteWorkspaceDir !== null ||
      !record.workerBundleHash ||
      record.lastTranscriptAckCursor !== null ||
      record.lastLiveEventAckCursor !== null ||
      record.recoveryError !== null
    )
      throw new Error("Syncing worker session placement requires an environment and bundle");
  } else if (record.state === "starting") {
    if (
      !record.environmentId ||
      record.activeOwnerEpoch !== null ||
      !record.workspaceBaseManifestRef ||
      !record.remoteWorkspaceDir ||
      !record.workerBundleHash ||
      record.lastTranscriptAckCursor !== null ||
      record.lastLiveEventAckCursor !== null ||
      record.recoveryError !== null
    )
      throw new Error("Starting worker session placement requires complete workspace metadata");
  } else if (
    record.state === "active" ||
    record.state === "draining" ||
    record.state === "reconciling" ||
    record.state === "reclaimed"
  ) {
    if (
      !record.environmentId ||
      record.activeOwnerEpoch === null ||
      !record.workspaceBaseManifestRef ||
      !record.remoteWorkspaceDir ||
      !record.workerBundleHash ||
      record.recoveryError !== null
    )
      throw new Error(
        `Worker session placement ${record.state} requires complete worker ownership`,
      );
    normalizeEpoch(record.activeOwnerEpoch, "active owner epoch");
  } else if (!record.recoveryError)
    throw new Error("Failed worker session placement requires a recovery error");
  if (
    record.turnClaim?.owner === "local" &&
    record.state !== "local" &&
    record.state !== "requested" &&
    record.state !== "failed"
  )
    throw new Error("Local turn claim requires local, dispatch-barrier, or failed placement");
  if (record.turnClaim?.owner === "worker") {
    if (
      !(record.state === "active" || record.state === "draining") ||
      record.activeOwnerEpoch !== record.turnClaim.ownerEpoch
    )
      throw new Error("Worker turn claim requires the active or draining worker owner epoch");
  }
}
//#endregion
//#region src/gateway/worker-environments/placement-state.ts
const WORKER_SESSION_PLACEMENT_STATES = [
  "local",
  "requested",
  "provisioning",
  "syncing",
  "starting",
  "active",
  "draining",
  "reconciling",
  "reclaimed",
  "failed",
];
const WORKER_SESSION_PLACEMENT_TRANSITIONS = {
  local: ["requested"],
  requested: ["provisioning", "failed"],
  provisioning: ["syncing", "failed"],
  syncing: ["starting", "failed"],
  starting: ["active", "failed"],
  active: ["draining"],
  draining: ["reconciling"],
  reconciling: ["local", "reclaimed", "failed"],
  reclaimed: ["requested"],
  failed: [],
};
function parseWorkerSessionPlacementState(value) {
  if (WORKER_SESSION_PLACEMENT_STATES.includes(value)) return value;
  throw new Error(`Invalid worker session placement state: ${value}`);
}
function canTransitionWorkerSessionPlacement(from, to) {
  return WORKER_SESSION_PLACEMENT_TRANSITIONS[from].includes(to);
}
//#endregion
//#region src/gateway/worker-environments/placement-row-codec.ts
const query = (db) => getNodeSqliteKysely(db);
const EMPTY_WORKER_METADATA = {
  environmentId: null,
  activeOwnerEpoch: null,
  workspaceBaseManifestRef: null,
  remoteWorkspaceDir: null,
  workerBundleHash: null,
  lastTranscriptAckCursor: null,
  lastLiveEventAckCursor: null,
  recoveryError: null,
};
function parseTurnClaim(row) {
  if (row.turn_claim_owner === null) return null;
  const claimId = required(row.turn_claim_id ?? "", "turn claim id");
  const runId = required(row.turn_claim_run_id ?? "", "turn claim run id");
  const generation = row.turn_claim_generation;
  if (generation === null || !Number.isSafeInteger(generation) || generation < 0)
    throw new Error("Worker session placement turn claim generation is invalid");
  if (row.turn_claim_owner === "local") {
    if (row.turn_claim_owner_epoch !== null)
      throw new Error("Local turn claim cannot retain a worker owner epoch");
    return {
      owner: "local",
      claimId,
      runId,
      generation,
      ownerEpoch: null,
    };
  }
  if (row.turn_claim_owner === "worker")
    return {
      owner: "worker",
      claimId,
      runId,
      generation,
      ownerEpoch: normalizeEpoch(row.turn_claim_owner_epoch ?? 0, "turn claim owner epoch"),
    };
  throw new Error(`Invalid worker session turn claim owner: ${row.turn_claim_owner}`);
}
function ownedWorkerMetadata(parsed, state) {
  if (
    parsed.environmentId === null ||
    parsed.activeOwnerEpoch === null ||
    parsed.workspaceBaseManifestRef === null ||
    parsed.remoteWorkspaceDir === null ||
    parsed.workerBundleHash === null
  )
    throw new Error(`Worker session placement ${state} requires complete worker ownership`);
  return {
    environmentId: parsed.environmentId,
    activeOwnerEpoch: parsed.activeOwnerEpoch,
    workspaceBaseManifestRef: parsed.workspaceBaseManifestRef,
    remoteWorkspaceDir: parsed.remoteWorkspaceDir,
    workerBundleHash: parsed.workerBundleHash,
    lastTranscriptAckCursor: parsed.lastTranscriptAckCursor,
    lastLiveEventAckCursor: parsed.lastLiveEventAckCursor,
    recoveryError: null,
  };
}
function fromRow(row) {
  const state = parseWorkerSessionPlacementState(row.state);
  const parsed = {
    environmentId:
      row.environment_id === null ? null : required(row.environment_id, "environment id"),
    activeOwnerEpoch:
      row.active_owner_epoch === null
        ? null
        : normalizeEpoch(row.active_owner_epoch, "active owner epoch"),
    workspaceBaseManifestRef: nullableRequired(
      row.workspace_base_manifest_ref,
      "workspace base manifest ref",
    ),
    remoteWorkspaceDir: nullableRequired(row.remote_workspace_dir, "remote workspace directory"),
    workerBundleHash: nullableRequired(row.worker_bundle_hash, "worker bundle hash"),
    lastTranscriptAckCursor: normalizeCursor(
      row.last_transcript_ack_cursor,
      "transcript ACK cursor",
    ),
    lastLiveEventAckCursor: normalizeCursor(row.last_live_event_ack_cursor, "live ACK cursor"),
  };
  const recoveryError = nullableRequired(row.recovery_error, "recovery error");
  const turnClaim = parseTurnClaim(row);
  const base = {
    sessionId: row.session_id,
    agentId: row.agent_id,
    sessionKey: row.session_key,
    generation: row.transition_generation,
    createdAtMs: row.created_at_ms,
    updatedAtMs: row.updated_at_ms,
    stateChangedAtMs: row.state_changed_at_ms,
  };
  assertRecordShape({
    state,
    ...parsed,
    recoveryError,
    turnClaim,
  });
  switch (state) {
    case "local":
      return {
        ...base,
        state,
        turnClaim: localTurnClaimForState(turnClaim, state),
        ...EMPTY_WORKER_METADATA,
      };
    case "requested":
      return {
        ...base,
        state,
        turnClaim: localTurnClaimForState(turnClaim, state),
        ...EMPTY_WORKER_METADATA,
      };
    case "provisioning":
      return {
        ...base,
        state,
        turnClaim: unclaimedTurnForState(turnClaim, state),
        ...EMPTY_WORKER_METADATA,
        environmentId: parsed.environmentId,
      };
    case "syncing":
      if (parsed.environmentId === null || parsed.workerBundleHash === null)
        throw new Error("Syncing worker session placement requires an environment and bundle");
      return {
        ...base,
        state,
        turnClaim: unclaimedTurnForState(turnClaim, state),
        ...EMPTY_WORKER_METADATA,
        environmentId: parsed.environmentId,
        workerBundleHash: parsed.workerBundleHash,
      };
    case "starting":
      if (
        parsed.environmentId === null ||
        parsed.workspaceBaseManifestRef === null ||
        parsed.remoteWorkspaceDir === null ||
        parsed.workerBundleHash === null
      )
        throw new Error("Starting worker session placement requires complete workspace metadata");
      return {
        ...base,
        state,
        turnClaim: unclaimedTurnForState(turnClaim, state),
        ...EMPTY_WORKER_METADATA,
        environmentId: parsed.environmentId,
        workspaceBaseManifestRef: parsed.workspaceBaseManifestRef,
        remoteWorkspaceDir: parsed.remoteWorkspaceDir,
        workerBundleHash: parsed.workerBundleHash,
      };
    case "active":
      return {
        ...base,
        state,
        turnClaim: workerTurnClaimForState(turnClaim, state),
        ...ownedWorkerMetadata(parsed, state),
      };
    case "draining":
      return {
        ...base,
        state,
        turnClaim: workerTurnClaimForState(turnClaim, state),
        ...ownedWorkerMetadata(parsed, state),
      };
    case "reconciling":
      return {
        ...base,
        state,
        turnClaim: unclaimedTurnForState(turnClaim, state),
        ...ownedWorkerMetadata(parsed, state),
      };
    case "reclaimed":
      return {
        ...base,
        state,
        turnClaim: unclaimedTurnForState(turnClaim, state),
        ...ownedWorkerMetadata(parsed, state),
      };
    case "failed":
      if (recoveryError === null)
        throw new Error("Failed worker session placement requires a recovery error");
      return {
        ...base,
        state,
        turnClaim: localTurnClaimForState(turnClaim, state),
        environmentId: parsed.environmentId,
        activeOwnerEpoch: parsed.activeOwnerEpoch,
        workspaceBaseManifestRef: parsed.workspaceBaseManifestRef,
        remoteWorkspaceDir: parsed.remoteWorkspaceDir,
        workerBundleHash: parsed.workerBundleHash,
        lastTranscriptAckCursor: parsed.lastTranscriptAckCursor,
        lastLiveEventAckCursor: parsed.lastLiveEventAckCursor,
        recoveryError,
      };
  }
  return state;
}
function find(db, sessionId) {
  const row = executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_session_placements")
      .selectAll()
      .where("session_id", "=", sessionId),
  );
  return row ? fromRow(row) : void 0;
}
function getRequired(db, sessionId) {
  const record = find(db, sessionId);
  if (!record) throw new Error(`Unknown worker session placement: ${sessionId}`);
  return record;
}
function assertIdentity(record, identity) {
  if (record.agentId !== identity.agentId || record.sessionKey !== identity.sessionKey)
    throw new Error(`Worker session placement identity changed for ${identity.sessionId}`);
}
function insertLocal(db, identity, nowMs) {
  executeSqliteQuerySync(
    db,
    query(db).insertInto("worker_session_placements").values({
      session_id: identity.sessionId,
      agent_id: identity.agentId,
      session_key: identity.sessionKey,
      state: "local",
      environment_id: null,
      transition_generation: 0,
      active_owner_epoch: null,
      workspace_base_manifest_ref: null,
      remote_workspace_dir: null,
      worker_bundle_hash: null,
      last_transcript_ack_cursor: null,
      last_live_event_ack_cursor: null,
      recovery_error: null,
      turn_claim_owner: null,
      turn_claim_id: null,
      turn_claim_run_id: null,
      turn_claim_generation: null,
      turn_claim_owner_epoch: null,
      created_at_ms: nowMs,
      updated_at_ms: nowMs,
      state_changed_at_ms: nowMs,
    }),
  );
  return getRequired(db, identity.sessionId);
}
function ensureLocal(db, identity, nowMs) {
  const current = find(db, identity.sessionId);
  if (current) {
    assertIdentity(current, identity);
    return current;
  }
  return insertLocal(db, identity, nowMs);
}
function transitionValues(current, to, patch, nowMs) {
  const environmentId =
    to === "local" || to === "requested"
      ? null
      : patch.environmentId === void 0
        ? current.environmentId
        : patch.environmentId === null
          ? null
          : required(patch.environmentId, "environment id");
  const activeOwnerEpoch =
    to === "local" ||
    to === "requested" ||
    to === "provisioning" ||
    to === "syncing" ||
    to === "starting"
      ? null
      : patch.activeOwnerEpoch === void 0
        ? current.activeOwnerEpoch
        : patch.activeOwnerEpoch === null
          ? null
          : normalizeEpoch(patch.activeOwnerEpoch, "active owner epoch");
  const generation = nextGeneration(current.generation);
  const clearsWorkerMetadata = to === "local" || to === "requested";
  const values = {
    session_id: current.sessionId,
    agent_id: current.agentId,
    session_key: current.sessionKey,
    state: to,
    environment_id: environmentId,
    transition_generation: generation,
    active_owner_epoch: activeOwnerEpoch,
    workspace_base_manifest_ref: clearsWorkerMetadata
      ? null
      : patch.workspaceBaseManifestRef === void 0
        ? current.workspaceBaseManifestRef
        : patch.workspaceBaseManifestRef === null
          ? null
          : required(patch.workspaceBaseManifestRef, "workspace base manifest ref"),
    remote_workspace_dir: clearsWorkerMetadata
      ? null
      : patch.remoteWorkspaceDir === void 0
        ? current.remoteWorkspaceDir
        : patch.remoteWorkspaceDir === null
          ? null
          : required(patch.remoteWorkspaceDir, "remote workspace directory"),
    worker_bundle_hash: clearsWorkerMetadata
      ? null
      : patch.workerBundleHash === void 0
        ? current.workerBundleHash
        : patch.workerBundleHash === null
          ? null
          : required(patch.workerBundleHash, "worker bundle hash"),
    last_transcript_ack_cursor: clearsWorkerMetadata
      ? null
      : patch.lastTranscriptAckCursor === void 0
        ? current.lastTranscriptAckCursor
        : normalizeCursor(patch.lastTranscriptAckCursor, "transcript ACK cursor"),
    last_live_event_ack_cursor: clearsWorkerMetadata
      ? null
      : patch.lastLiveEventAckCursor === void 0
        ? current.lastLiveEventAckCursor
        : normalizeCursor(patch.lastLiveEventAckCursor, "live ACK cursor"),
    recovery_error: clearsWorkerMetadata
      ? null
      : patch.recoveryError === void 0
        ? current.recoveryError
        : patch.recoveryError === null
          ? null
          : required(patch.recoveryError, "recovery error"),
    turn_claim_owner: null,
    turn_claim_id: null,
    turn_claim_run_id: null,
    turn_claim_generation: null,
    turn_claim_owner_epoch: null,
    created_at_ms: current.createdAtMs,
    updated_at_ms: nowMs,
    state_changed_at_ms: nowMs,
  };
  assertRecordShape({
    state: to,
    environmentId,
    activeOwnerEpoch,
    workspaceBaseManifestRef: values.workspace_base_manifest_ref,
    remoteWorkspaceDir: values.remote_workspace_dir,
    workerBundleHash: values.worker_bundle_hash,
    lastTranscriptAckCursor: values.last_transcript_ack_cursor,
    lastLiveEventAckCursor: values.last_live_event_ack_cursor,
    recoveryError: values.recovery_error,
    turnClaim: null,
  });
  return values;
}
//#endregion
//#region src/gateway/worker-environments/placement-turn-claims.ts
const turnClaimReleaseWaiters = /* @__PURE__ */ new Map();
function waitersFor(path, sessionId) {
  let bySession = turnClaimReleaseWaiters.get(path);
  if (!bySession) {
    bySession = /* @__PURE__ */ new Map();
    turnClaimReleaseWaiters.set(path, bySession);
  }
  let waiters = bySession.get(sessionId);
  if (!waiters) {
    waiters = /* @__PURE__ */ new Set();
    bySession.set(sessionId, waiters);
  }
  return waiters;
}
function signalTurnClaimRelease(path, sessionId) {
  const bySession = turnClaimReleaseWaiters.get(path);
  const waiters = bySession?.get(sessionId);
  if (!waiters) return;
  bySession?.delete(sessionId);
  if (bySession?.size === 0) turnClaimReleaseWaiters.delete(path);
  for (const resolve of waiters) resolve();
}
function createPlacementTurnClaimOps(runtime) {
  const { path, now, read, write } = runtime;
  return {
    claimTurn(input) {
      const identity = normalizeIdentity(input);
      const claimId = required(input.claimId, "turn claim id");
      const runId = required(input.runId, "turn claim run id");
      const owner =
        input.owner.kind === "local"
          ? { kind: "local" }
          : {
              kind: "worker",
              environmentId: required(input.owner.environmentId, "turn owner environment id"),
              ownerEpoch: normalizeEpoch(input.owner.ownerEpoch, "turn owner epoch"),
            };
      return write((db) => {
        const current = ensureLocal(db, identity, now());
        if (current.turnClaim)
          throw new Error(`Session ${identity.sessionId} already has an active turn claim`);
        if (owner.kind === "local") {
          if (current.state !== "local")
            throw new Error(
              `Local turn rejected for session ${identity.sessionId} in placement ${current.state}`,
            );
        } else if (
          current.state !== "active" ||
          current.environmentId !== owner.environmentId ||
          current.activeOwnerEpoch !== owner.ownerEpoch
        )
          throw new Error(`Worker turn rejected for session ${identity.sessionId}: stale owner`);
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set({
                turn_claim_owner: owner.kind,
                turn_claim_id: claimId,
                turn_claim_run_id: runId,
                turn_claim_generation: current.generation,
                turn_claim_owner_epoch: owner.kind === "worker" ? owner.ownerEpoch : null,
                updated_at_ms: now(),
              })
              .where("session_id", "=", current.sessionId)
              .where("state", "=", current.state)
              .where("transition_generation", "=", current.generation)
              .where("turn_claim_owner", "is", null),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Session ${identity.sessionId} placement changed during turn admission`);
        return {
          sessionId: current.sessionId,
          claimId,
          runId,
          placementGeneration: current.generation,
          owner,
        };
      });
    },
    releaseTurn(claim) {
      const sessionId = required(claim.sessionId, "session id");
      const claimId = required(claim.claimId, "turn claim id");
      const runId = required(claim.runId, "turn claim run id");
      const released = write((db) => {
        const current = getRequired(db, sessionId);
        const persisted = current.turnClaim;
        const workerMayFinish = current.state === "active" || current.state === "draining";
        if (
          !persisted ||
          persisted.claimId !== claimId ||
          persisted.runId !== runId ||
          persisted.generation !== claim.placementGeneration ||
          persisted.owner !== claim.owner.kind ||
          (claim.owner.kind === "worker" &&
            (persisted.ownerEpoch !== claim.owner.ownerEpoch ||
              !workerMayFinish ||
              current.environmentId !== claim.owner.environmentId ||
              current.activeOwnerEpoch !== claim.owner.ownerEpoch))
        )
          throw new Error(`Session ${sessionId} turn claim changed before release`);
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set({
                turn_claim_owner: null,
                turn_claim_id: null,
                turn_claim_run_id: null,
                turn_claim_generation: null,
                turn_claim_owner_epoch: null,
                updated_at_ms: now(),
              })
              .where("session_id", "=", sessionId)
              .where("turn_claim_id", "=", claimId)
              .where("turn_claim_run_id", "=", runId)
              .where("turn_claim_generation", "=", claim.placementGeneration),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Session ${sessionId} turn claim changed during release`);
        return getRequired(db, sessionId);
      });
      signalTurnClaimRelease(path, sessionId);
      return released;
    },
    clearLocalTurnClaimsAfterRestart() {
      const clearedSessionIds = write((db) => {
        const sessionIds = executeSqliteQuerySync(
          db,
          query(db)
            .selectFrom("worker_session_placements")
            .select("session_id")
            .where("turn_claim_owner", "=", "local"),
        ).rows.map((row) => row.session_id);
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set({
                turn_claim_owner: null,
                turn_claim_id: null,
                turn_claim_run_id: null,
                turn_claim_generation: null,
                turn_claim_owner_epoch: null,
                updated_at_ms: now(),
              })
              .where("turn_claim_owner", "=", "local"),
          ).numAffectedRows !== BigInt(sessionIds.length)
        )
          throw new Error("Local turn claims changed during restart recovery");
        return sessionIds;
      });
      for (const sessionId of clearedSessionIds) signalTurnClaimRelease(path, sessionId);
      return clearedSessionIds.length;
    },
    async waitForTurnClaimRelease(sessionIdInput, waitOptions) {
      const sessionId = required(sessionIdInput, "session id");
      if (!Number.isSafeInteger(waitOptions.timeoutMs) || waitOptions.timeoutMs < 0)
        throw new Error("Worker session turn claim wait timeout must be a non-negative integer");
      if (!find(read(), sessionId)?.turnClaim) return;
      await new Promise((resolve, reject) => {
        let settled = false;
        const waiters = waitersFor(path, sessionId);
        const finish = (error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          waitOptions.signal?.removeEventListener("abort", onAbort);
          waiters.delete(onRelease);
          if (waiters.size === 0) {
            const bySession = turnClaimReleaseWaiters.get(path);
            bySession?.delete(sessionId);
            if (bySession?.size === 0) turnClaimReleaseWaiters.delete(path);
          }
          if (error) reject(error);
          else resolve();
        };
        const onRelease = () => finish();
        const onAbort = () =>
          finish(/* @__PURE__ */ new Error(`Turn claim wait aborted for session ${sessionId}`));
        const timer = setTimeout(
          () =>
            finish(
              /* @__PURE__ */ new Error(
                `Timed out waiting for session ${sessionId} turn claim release`,
              ),
            ),
          waitOptions.timeoutMs,
        );
        waiters.add(onRelease);
        waitOptions.signal?.addEventListener("abort", onAbort, { once: true });
        if (!find(read(), sessionId)?.turnClaim) finish();
        else if (waitOptions.signal?.aborted) onAbort();
      });
    },
    validateTurnClaim(claim) {
      const current = find(read(), required(claim.sessionId, "session id"));
      const persisted = current?.turnClaim;
      return (
        persisted !== void 0 &&
        persisted !== null &&
        persisted.claimId === claim.claimId &&
        persisted.runId === claim.runId &&
        persisted.generation === claim.placementGeneration &&
        persisted.owner === claim.owner.kind &&
        (claim.owner.kind === "local" ||
          (persisted.ownerEpoch === claim.owner.ownerEpoch &&
            (current?.state === "active" || current?.state === "draining") &&
            current.environmentId === claim.owner.environmentId &&
            current.activeOwnerEpoch === claim.owner.ownerEpoch))
      );
    },
    updateAckCursors(input) {
      const sessionId = required(input.claim.sessionId, "session id");
      const claimId = required(input.claim.claimId, "turn claim id");
      const runId = required(input.claim.runId, "turn claim run id");
      if (
        !Number.isSafeInteger(input.claim.placementGeneration) ||
        input.claim.placementGeneration < 0
      )
        throw new Error("Worker session placement turn claim generation is invalid");
      if (input.claim.owner.kind !== "worker")
        throw new Error("Only a worker turn claim can acknowledge worker cursors");
      const placementGeneration = input.claim.placementGeneration;
      const environmentId = required(input.claim.owner.environmentId, "environment id");
      const ownerEpoch = normalizeEpoch(input.claim.owner.ownerEpoch, "active owner epoch");
      return write((db) => {
        const current = getRequired(db, sessionId);
        const persisted = current.turnClaim;
        if (
          !(current.state === "active" || current.state === "draining") ||
          current.environmentId !== environmentId ||
          current.activeOwnerEpoch !== ownerEpoch ||
          persisted?.owner !== "worker" ||
          persisted.claimId !== claimId ||
          persisted.runId !== runId ||
          persisted.generation !== placementGeneration ||
          persisted.ownerEpoch !== ownerEpoch
        )
          throw new Error(`Cannot ACK stale worker turn for session ${sessionId}`);
        const transcript = advanceCursor(
          current.lastTranscriptAckCursor,
          input.transcript,
          "transcript ACK cursor",
        );
        const liveEvent = advanceCursor(
          current.lastLiveEventAckCursor,
          input.liveEvent,
          "live ACK cursor",
        );
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set({
                last_transcript_ack_cursor: transcript,
                last_live_event_ack_cursor: liveEvent,
                updated_at_ms: now(),
              })
              .where("session_id", "=", sessionId)
              .where("state", "=", current.state)
              .where("transition_generation", "=", current.generation)
              .where("environment_id", "=", environmentId)
              .where("active_owner_epoch", "=", ownerEpoch)
              .where("turn_claim_owner", "=", "worker")
              .where("turn_claim_id", "=", claimId)
              .where("turn_claim_run_id", "=", runId)
              .where("turn_claim_generation", "=", placementGeneration)
              .where("turn_claim_owner_epoch", "=", ownerEpoch),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Worker session placement ${sessionId} changed during ACK`);
        return getRequired(db, sessionId);
      });
    },
  };
}
//#endregion
//#region src/gateway/worker-environments/placement-store.ts
function updateTransition(db, current, to, patch, nowMs) {
  const values = transitionValues(current, to, patch, nowMs);
  if (
    executeSqliteQuerySync(
      db,
      query(db)
        .updateTable("worker_session_placements")
        .set(values)
        .where("session_id", "=", current.sessionId)
        .where("state", "=", current.state)
        .where("transition_generation", "=", current.generation)
        .where("turn_claim_owner", "is", null),
    ).numAffectedRows !== 1n
  )
    throw new Error(`Worker session placement ${current.sessionId} changed during transition`);
  return getRequired(db, current.sessionId);
}
function createWorkerSessionPlacementStore(options = {}) {
  const path = (options.database ?? openOpenClawStateDatabase()).path;
  const now = options.now ?? Date.now;
  const runtime = {
    path,
    now,
    read: () => openOpenClawStateDatabase({ path }).db,
    write: (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path }),
  };
  const { read, write } = runtime;
  return {
    ...createPlacementTurnClaimOps(runtime),
    get(sessionId) {
      return find(read(), required(sessionId, "session id"));
    },
    getMany(sessionIds) {
      const normalizedIds = [
        ...new Set(sessionIds.map((sessionId) => required(sessionId, "session id"))),
      ];
      const records = /* @__PURE__ */ new Map();
      const db = read();
      for (let offset = 0; offset < normalizedIds.length; offset += 250) {
        const chunk = normalizedIds.slice(offset, offset + 250);
        for (const row of executeSqliteQuerySync(
          db,
          query(db)
            .selectFrom("worker_session_placements")
            .selectAll()
            .where("session_id", "in", chunk),
        ).rows) {
          const record = fromRow(row);
          records.set(record.sessionId, record);
        }
      }
      return records;
    },
    startDispatch(input) {
      const identity = normalizeIdentity(input);
      return write((db) => {
        const current = ensureLocal(db, identity, now());
        if (current.state !== "local" && current.state !== "reclaimed")
          throw new Error(
            `Cannot dispatch session ${identity.sessionId} from placement ${current.state}`,
          );
        const updatedAtMs = now();
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set({
                state: "requested",
                environment_id: null,
                transition_generation: nextGeneration(current.generation),
                active_owner_epoch: null,
                workspace_base_manifest_ref: null,
                remote_workspace_dir: null,
                worker_bundle_hash: null,
                last_transcript_ack_cursor: null,
                last_live_event_ack_cursor: null,
                recovery_error: null,
                updated_at_ms: updatedAtMs,
                state_changed_at_ms: updatedAtMs,
              })
              .where("session_id", "=", current.sessionId)
              .where("state", "=", current.state)
              .where("transition_generation", "=", current.generation),
          ).numAffectedRows !== 1n
        )
          throw new Error(
            `Session ${identity.sessionId} placement changed during dispatch barrier`,
          );
        return getRequired(db, identity.sessionId);
      });
    },
    transition(input) {
      if (!canTransitionWorkerSessionPlacement(input.from, input.to))
        throw new Error(
          `Illegal worker session placement transition: ${input.from} -> ${input.to}`,
        );
      if (input.from === "draining" && input.to === "reconciling")
        throw new Error("Use startReconcile after fencing the drained worker environment");
      const sessionId = required(input.sessionId, "session id");
      return write((db) => {
        const current = getRequired(db, sessionId);
        if (current.state !== input.from || current.generation !== input.expectedGeneration)
          throw new Error(
            `Worker session placement ${sessionId} changed: expected ${input.from}@${input.expectedGeneration}, found ${current.state}@${current.generation}`,
          );
        if (current.turnClaim)
          throw new Error(`Cannot transition session ${sessionId} during an active turn`);
        return updateTransition(db, current, input.to, input.patch ?? {}, now());
      });
    },
    startDrain(input) {
      const sessionId = required(input.sessionId, "session id");
      const environmentId = required(input.environmentId, "environment id");
      const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
      return write((db) => {
        const current = getRequired(db, sessionId);
        if (
          current.state !== "active" ||
          current.generation !== input.expectedGeneration ||
          current.environmentId !== environmentId ||
          current.activeOwnerEpoch !== ownerEpoch
        )
          throw new Error(`Cannot drain stale worker placement for session ${sessionId}`);
        const values = transitionValues(current, "draining", {}, now());
        const turnClaim = current.turnClaim;
        if (turnClaim) {
          values.turn_claim_owner = turnClaim.owner;
          values.turn_claim_id = turnClaim.claimId;
          values.turn_claim_run_id = turnClaim.runId;
          values.turn_claim_generation = turnClaim.generation;
          values.turn_claim_owner_epoch = turnClaim.ownerEpoch;
        }
        assertRecordShape({
          state: "draining",
          environmentId,
          activeOwnerEpoch: ownerEpoch,
          workspaceBaseManifestRef: values.workspace_base_manifest_ref,
          remoteWorkspaceDir: values.remote_workspace_dir,
          workerBundleHash: values.worker_bundle_hash,
          lastTranscriptAckCursor: values.last_transcript_ack_cursor,
          lastLiveEventAckCursor: values.last_live_event_ack_cursor,
          recoveryError: values.recovery_error,
          turnClaim,
        });
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set(values)
              .where("session_id", "=", sessionId)
              .where("state", "=", "active")
              .where("transition_generation", "=", current.generation)
              .where("environment_id", "=", environmentId)
              .where("active_owner_epoch", "=", ownerEpoch),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Worker session placement ${sessionId} changed during drain`);
        return getRequired(db, sessionId);
      });
    },
    startReconcile(input) {
      const sessionId = required(input.sessionId, "session id");
      const environmentId = required(input.environmentId, "environment id");
      const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
      const outcome = write((db) => {
        const current = getRequired(db, sessionId);
        if (
          current.state !== "draining" ||
          current.generation !== input.expectedGeneration ||
          current.environmentId !== environmentId ||
          current.activeOwnerEpoch !== ownerEpoch
        )
          throw new Error(`Cannot reconcile stale worker placement for session ${sessionId}`);
        const releasedClaim = current.turnClaim !== null;
        const values = transitionValues(current, "reconciling", {}, now());
        const update = query(db)
          .updateTable("worker_session_placements")
          .set(values)
          .where("session_id", "=", sessionId)
          .where("state", "=", "draining")
          .where("transition_generation", "=", current.generation)
          .where("environment_id", "=", environmentId)
          .where("active_owner_epoch", "=", ownerEpoch);
        if (
          executeSqliteQuerySync(
            db,
            current.turnClaim
              ? update
                  .where("turn_claim_owner", "=", "worker")
                  .where("turn_claim_id", "=", current.turnClaim.claimId)
                  .where("turn_claim_run_id", "=", current.turnClaim.runId)
                  .where("turn_claim_generation", "=", current.turnClaim.generation)
                  .where("turn_claim_owner_epoch", "=", current.turnClaim.ownerEpoch)
              : update.where("turn_claim_owner", "is", null),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Worker session placement ${sessionId} changed during reconcile`);
        return {
          record: getRequired(db, sessionId),
          releasedClaim,
        };
      });
      if (outcome.releasedClaim) signalTurnClaimRelease(path, sessionId);
      return outcome.record;
    },
    validateWorkerOwner(input) {
      const current = find(read(), required(input.sessionId, "session id"));
      return (
        current?.state === "active" &&
        current.environmentId === required(input.environmentId, "environment id") &&
        current.activeOwnerEpoch === normalizeEpoch(input.ownerEpoch, "active owner epoch")
      );
    },
    fail(input) {
      const sessionId = required(input.sessionId, "session id");
      const recoveryError = required(input.recoveryError, "recovery error");
      const outcome = write((db) => {
        const current = getRequired(db, sessionId);
        if (input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration)
          throw new Error(`Worker session placement ${sessionId} changed before failure`);
        if (current.state === "failed") {
          if (
            executeSqliteQuerySync(
              db,
              query(db)
                .updateTable("worker_session_placements")
                .set({
                  recovery_error: recoveryError,
                  updated_at_ms: now(),
                })
                .where("session_id", "=", sessionId)
                .where("state", "=", "failed")
                .where("transition_generation", "=", current.generation),
            ).numAffectedRows !== 1n
          )
            throw new Error(`Worker session placement ${sessionId} changed during failure update`);
          return {
            record: getRequired(db, sessionId),
            releasedClaim: false,
          };
        }
        if (!canTransitionWorkerSessionPlacement(current.state, "failed"))
          throw new Error(`Cannot fail worker session placement from ${current.state}`);
        const localClaim = current.turnClaim?.owner === "local" ? current.turnClaim : null;
        const updatedAtMs = now();
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_session_placements")
              .set({
                state: "failed",
                transition_generation: nextGeneration(current.generation),
                recovery_error: recoveryError,
                turn_claim_owner: localClaim ? "local" : null,
                turn_claim_id: localClaim?.claimId ?? null,
                turn_claim_run_id: localClaim?.runId ?? null,
                turn_claim_generation: localClaim?.generation ?? null,
                turn_claim_owner_epoch: null,
                updated_at_ms: updatedAtMs,
                state_changed_at_ms: updatedAtMs,
              })
              .where("session_id", "=", sessionId)
              .where("state", "=", current.state)
              .where("transition_generation", "=", current.generation),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Worker session placement ${sessionId} changed during failure`);
        return {
          record: getRequired(db, sessionId),
          releasedClaim: current.turnClaim?.owner === "worker",
        };
      });
      if (outcome.releasedClaim) signalTurnClaimRelease(path, sessionId);
      return outcome.record;
    },
    adoptActive(input) {
      const sessionId = required(input.sessionId, "session id");
      const environmentId = required(input.environmentId, "environment id");
      const ownerEpoch = normalizeEpoch(input.ownerEpoch, "active owner epoch");
      const current = getRequired(read(), sessionId);
      if (
        current.state !== "active" ||
        current.environmentId !== environmentId ||
        current.activeOwnerEpoch !== ownerEpoch ||
        (input.expectedGeneration !== void 0 && current.generation !== input.expectedGeneration)
      )
        throw new Error(`Cannot adopt stale worker placement for session ${sessionId}`);
      return current;
    },
    listForReconcile() {
      const db = read();
      return executeSqliteQuerySync(
        db,
        query(db)
          .selectFrom("worker_session_placements")
          .selectAll()
          .where("state", "not in", ["local", "reclaimed"])
          .orderBy("updated_at_ms")
          .orderBy("session_id"),
      ).rows.map(fromRow);
    },
    list() {
      const db = read();
      return executeSqliteQuerySync(
        db,
        query(db).selectFrom("worker_session_placements").selectAll().orderBy("session_id"),
      ).rows.map(fromRow);
    },
  };
}
//#endregion
export { createWorkerSessionPlacementStore };
