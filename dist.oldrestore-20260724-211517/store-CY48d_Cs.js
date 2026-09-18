import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { s as isValidSecretRef } from "./ref-contract-DVV0zYUk.js";
import { c as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import "./worker-admission-BAoXlOyb.js";
//#region src/gateway/worker-environments/state.ts
const TRANSITIONS = {
  requested: ["provisioning", "failed"],
  provisioning: ["bootstrapping", "failed"],
  bootstrapping: ["ready", "draining", "orphaned"],
  ready: ["bootstrapping", "attached", "idle", "draining", "orphaned"],
  attached: ["idle", "draining", "orphaned"],
  idle: ["bootstrapping", "attached", "draining", "orphaned"],
  draining: ["destroying", "orphaned"],
  destroying: ["destroyed", "failed", "orphaned"],
  destroyed: [],
  failed: [],
  orphaned: [],
};
function parseWorkerEnvironmentState(value) {
  if (typeof value !== "string" || !Object.hasOwn(TRANSITIONS, value))
    throw new Error(`Invalid persisted worker environment state: ${String(value)}`);
  return value;
}
function canTransitionWorkerEnvironment(from, to) {
  return TRANSITIONS[from].some((candidate) => candidate === to);
}
function workerEnvironmentStateRequiresLease(state) {
  return state !== "requested" && state !== "provisioning" && state !== "failed";
}
//#endregion
//#region src/gateway/worker-environments/store.ts
var WorkerSessionAlreadyAttachedError = class extends Error {
  constructor(sessionId, environmentId) {
    super(`Session ${sessionId} is already attached to worker environment ${environmentId}`);
    this.sessionId = sessionId;
    this.environmentId = environmentId;
  }
};
const TERMINAL_STATES = ["destroyed", "failed", "orphaned"];
const WORKER_BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const MAX_HOST_KEY_LENGTH = 16384;
const WORKER_CREDENTIAL_HASH_PATTERN = /^[A-Za-z0-9_-]{43}$/u;
const OPENSSH_HOST_KEY_TYPE_PATTERN =
  /^(?:ssh|ecdsa-sha2|sk-(?:ssh|ecdsa-sha2))-[A-Za-z0-9@._+-]+$/u;
const OPENSSH_HOST_KEY_DATA_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/u;
function required(value, field) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(`Worker environment ${field} must be a non-empty string`);
  return value.trim();
}
function normalizeOpenSshHostKey(value) {
  if (
    typeof value !== "string" ||
    value.length > MAX_HOST_KEY_LENGTH ||
    value.includes("\n") ||
    value.includes("\r")
  )
    throw new Error("Worker environment SSH host key must be one OpenSSH public-key line");
  const tokens = value.trim().split(/\s+/u);
  const [algorithm, encodedKey] = tokens;
  if (
    tokens.length !== 2 ||
    !algorithm ||
    !encodedKey ||
    !OPENSSH_HOST_KEY_TYPE_PATTERN.test(algorithm) ||
    !OPENSSH_HOST_KEY_DATA_PATTERN.test(encodedKey) ||
    encodedKey.length % 4 !== 0
  )
    throw new Error("Worker environment SSH host key must use OpenSSH public-key format");
  return `${algorithm} ${encodedKey}`;
}
function teardownTerminalStateFrom(value) {
  if (value === null || value === "destroyed" || value === "failed") return value;
  throw new Error("Worker environment teardown terminal state is invalid");
}
function normalizeBootstrapReceipt(value) {
  const bundleHash = required(value.bundleHash, "bootstrap bundle hash");
  if (!WORKER_BUNDLE_HASH_PATTERN.test(bundleHash))
    throw new Error("Worker environment bootstrap bundle hash must be lowercase SHA-256 hex");
  if (!Array.isArray(value.protocolFeatures))
    throw new Error("Worker environment bootstrap protocol features must be an array");
  if (
    value.protocolFeatures.length > 64 ||
    value.protocolFeatures.some(
      (feature) => typeof feature !== "string" || feature.trim().length > 128,
    )
  )
    throw new Error("Worker environment bootstrap protocol features exceed admission limits");
  return {
    bundleHash,
    openclawVersion: required(value.openclawVersion, "bootstrap OpenClaw version"),
    protocolFeatures: normalizeSortedUniqueTrimmedStringList(value.protocolFeatures),
  };
}
function normalizeCredentialHash(value) {
  const credentialHash = required(value, "credential hash");
  if (!WORKER_CREDENTIAL_HASH_PATTERN.test(credentialHash))
    throw new Error("Worker credential hash must be a SHA-256 base64url digest");
  return credentialHash;
}
function normalizeSessionId(value) {
  if (value === null) return null;
  const sessionId = required(value, "credential session id");
  if (sessionId.length > 256)
    throw new Error("Worker credential session id exceeds the admission limit");
  return sessionId;
}
function normalizeAttachedSessionIds(value) {
  const sessionIds = normalizeSortedUniqueTrimmedStringList(value);
  for (const sessionId of sessionIds)
    if (sessionId.length > 256)
      throw new Error("Worker environment attached session id exceeds the admission limit");
  return sessionIds;
}
function assertCredentialSessionBinding(attachedSessionIds, sessionId) {
  if (sessionId !== (attachedSessionIds[0] ?? null))
    throw new Error("Worker credential session does not match the environment attachment");
}
function normalizeRpcSetVersion(value) {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error("Worker credential RPC-set version must be a positive safe integer");
  return value;
}
function normalizeExpiry(value) {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new Error("Worker credential expiry must be a non-negative safe integer");
  return value;
}
function normalizeWorkerSshEndpoint(value) {
  const host = required(value.host, "SSH host");
  const user = required(value.user, "SSH user");
  const hostKey = normalizeOpenSshHostKey(value.hostKey);
  if (!Number.isSafeInteger(value.port) || value.port < 1 || value.port > 65535)
    throw new Error("Worker environment SSH port must be an integer from 1 through 65535");
  if (!isValidSecretRef(value.keyRef))
    throw new Error("Worker environment SSH key must be a canonical SecretRef");
  return {
    host,
    port: value.port,
    user,
    hostKey,
    keyRef: { ...value.keyRef },
  };
}
function endpointFrom(row) {
  const {
    ssh_host: host,
    ssh_port: port,
    ssh_user: user,
    ssh_host_key: hostKey,
    ssh_key_ref_json: encoded,
  } = row;
  if (host === null || port === null || user === null || hostKey === null || encoded === null)
    return null;
  return normalizeWorkerSshEndpoint({
    host,
    port,
    user,
    hostKey,
    keyRef: JSON.parse(encoded),
  });
}
function bootstrapReceiptFrom(row) {
  const {
    bootstrap_bundle_hash: bundleHash,
    bootstrap_openclaw_version: openclawVersion,
    bootstrap_protocol_features_json: encodedFeatures,
  } = row;
  if (bundleHash === null && openclawVersion === null && encodedFeatures === null) return null;
  if (bundleHash === null || openclawVersion === null || encodedFeatures === null)
    throw new Error("Worker environment bootstrap receipt is incomplete");
  return normalizeBootstrapReceipt({
    bundleHash,
    openclawVersion,
    protocolFeatures: JSON.parse(encodedFeatures),
  });
}
function assertShape(state, leaseId, sshEndpoint, bootstrapReceipt, attachedSessionIds) {
  if (workerEnvironmentStateRequiresLease(state)) {
    if (!leaseId) throw new Error(`Worker environment state ${state} requires a provider lease`);
    if (!sshEndpoint)
      throw new Error("Worker environment provider lease requires an SSH endpoint reference");
  } else if (leaseId || sshEndpoint)
    throw new Error(`Worker environment state ${state} cannot retain a provider lease`);
  if (state === "bootstrapping" && bootstrapReceipt)
    throw new Error("Bootstrapping worker environment cannot retain a stale bootstrap receipt");
  if (state === "attached" && attachedSessionIds.length !== 1)
    throw new Error("Attached worker environment requires exactly one session id");
  if (state !== "attached" && attachedSessionIds.length !== 0)
    throw new Error("Only an attached worker environment may retain a session id");
}
function nextOwnerEpoch(ownerEpoch) {
  const next = ownerEpoch + 1;
  if (!Number.isSafeInteger(next)) throw new Error("Worker environment owner epoch is exhausted");
  return next;
}
function nextGlobalOwnerEpoch(db) {
  const latestEnvironment = executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_environments")
      .select(({ fn }) => fn.max("owner_epoch").as("owner_epoch")),
  );
  const latestTranscriptCommit = executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_transcript_commit_heads")
      .select(({ fn }) => fn.max("run_epoch").as("run_epoch")),
  );
  return nextOwnerEpoch(
    Math.max(latestEnvironment?.owner_epoch ?? 0, latestTranscriptCommit?.run_epoch ?? 0),
  );
}
function fromRow(row) {
  const record = {
    environmentId: row.environment_id,
    providerId: row.provider_id,
    profileId: row.profile_id,
    profileSnapshot: JSON.parse(row.profile_snapshot_json),
    provisionOperationId: row.provision_operation_id,
    leaseId: row.lease_id,
    sshEndpoint: endpointFrom(row),
    bootstrapReceipt: bootstrapReceiptFrom(row),
    ownerEpoch: row.owner_epoch,
    teardownTerminalState: teardownTerminalStateFrom(row.teardown_terminal_state),
    state: parseWorkerEnvironmentState(row.state),
    attachedSessionIds: normalizeAttachedSessionIds(JSON.parse(row.attached_session_ids_json)),
    createdAtMs: row.created_at_ms,
    updatedAtMs: row.updated_at_ms,
    stateChangedAtMs: row.state_changed_at_ms,
    idleSinceAtMs: row.idle_since_at_ms,
    destroyRequestedAtMs: row.destroy_requested_at_ms,
    lastError: row.last_error,
  };
  assertShape(
    record.state,
    record.leaseId,
    record.sshEndpoint,
    record.bootstrapReceipt,
    record.attachedSessionIds,
  );
  return record;
}
function credentialFromRow(row) {
  return {
    environmentId: row.environment_id,
    credentialHash: normalizeCredentialHash(row.credential_hash),
    bundleHash: row.bundle_hash,
    sessionId: row.session_id,
    rpcSetVersion: row.rpc_set_version,
    ownerEpoch: row.owner_epoch,
    expiresAtMs: row.expires_at_ms,
    deliveredAtMs: row.delivered_at_ms,
  };
}
const json = (value) => JSON.stringify(value);
const query = (db) => getNodeSqliteKysely(db);
function find(db, environmentId) {
  const row = executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_environments")
      .selectAll()
      .where("environment_id", "=", environmentId),
  );
  return row ? fromRow(row) : void 0;
}
function findCredential(db, environmentId) {
  const row = executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_environment_credentials")
      .selectAll()
      .where("environment_id", "=", environmentId),
  );
  return row ? credentialFromRow(row) : void 0;
}
function findCredentialByHash(db, credentialHash) {
  const row = executeSqliteQueryTakeFirstSync(
    db,
    query(db)
      .selectFrom("worker_environment_credentials")
      .selectAll()
      .where("credential_hash", "=", credentialHash),
  );
  return row ? credentialFromRow(row) : void 0;
}
function getRequired(db, environmentId) {
  const record = find(db, environmentId);
  if (!record) throw new Error(`Unknown worker environment: ${environmentId}`);
  return record;
}
function update(db, id, state, values) {
  if (
    executeSqliteQuerySync(
      db,
      query(db)
        .updateTable("worker_environments")
        .set(values)
        .where("environment_id", "=", id)
        .where("state", "=", state),
    ).numAffectedRows !== 1n
  )
    throw new Error(`Worker environment ${id} changed during update`);
  return getRequired(db, id);
}
function revokeCredential(db, environmentId) {
  executeSqliteQuerySync(
    db,
    query(db)
      .deleteFrom("worker_environment_credentials")
      .where("environment_id", "=", environmentId),
  );
}
function upsertCredential(db, credential) {
  executeSqliteQuerySync(
    db,
    query(db)
      .insertInto("worker_environment_credentials")
      .values(credential)
      .onConflict((conflict) =>
        conflict.column("environment_id").doUpdateSet({
          credential_hash: credential.credential_hash,
          bundle_hash: credential.bundle_hash,
          session_id: credential.session_id,
          rpc_set_version: credential.rpc_set_version,
          owner_epoch: credential.owner_epoch,
          expires_at_ms: credential.expires_at_ms,
          delivered_at_ms: credential.delivered_at_ms,
        }),
      ),
  );
}
function credentialInsert(params) {
  const sessionId = normalizeSessionId(params.input.sessionId);
  assertCredentialSessionBinding(params.attachedSessionIds, sessionId);
  const expiresAtMs = normalizeExpiry(params.input.expiresAtMs);
  if (expiresAtMs <= params.nowMs)
    throw new Error("Worker credential expiry must be in the future");
  return {
    environment_id: params.environmentId,
    credential_hash: normalizeCredentialHash(params.input.credentialHash),
    bundle_hash: params.bundleHash,
    session_id: sessionId,
    rpc_set_version: normalizeRpcSetVersion(params.input.rpcSetVersion),
    owner_epoch: params.ownerEpoch,
    expires_at_ms: expiresAtMs,
    delivered_at_ms: null,
  };
}
function listRows(db, reconcile) {
  const base = query(db).selectFrom("worker_environments").selectAll();
  const filtered = reconcile ? base.where("state", "not in", TERMINAL_STATES) : base;
  return executeSqliteQuerySync(
    db,
    (reconcile ? filtered.orderBy("provider_id") : filtered)
      .orderBy("created_at_ms")
      .orderBy("environment_id"),
  ).rows.map(fromRow);
}
function compareAttachmentAuthority(left, right) {
  if (left.ownerEpoch !== right.ownerEpoch) return left.ownerEpoch > right.ownerEpoch ? -1 : 1;
  if (left.stateChangedAtMs !== right.stateChangedAtMs)
    return left.stateChangedAtMs > right.stateChangedAtMs ? -1 : 1;
  if (left.environmentId === right.environmentId) return 0;
  return left.environmentId < right.environmentId ? -1 : 1;
}
function reconcileAttachedSessionOwners(db, nowMs) {
  const ownersBySession = /* @__PURE__ */ new Map();
  for (const record of listRows(db, false)) {
    if (record.state !== "attached") continue;
    const sessionId = record.attachedSessionIds[0];
    if (!sessionId) continue;
    const owners = ownersBySession.get(sessionId) ?? [];
    owners.push(record);
    ownersBySession.set(sessionId, owners);
  }
  for (const owners of ownersBySession.values()) {
    if (owners.length < 2) continue;
    const [, ...duplicates] = owners.toSorted(compareAttachmentAuthority);
    for (const duplicate of duplicates) {
      update(db, duplicate.environmentId, "attached", {
        owner_epoch: nextGlobalOwnerEpoch(db),
        state: "idle",
        attached_session_ids_json: json([]),
        updated_at_ms: nowMs,
        state_changed_at_ms: nowMs,
        idle_since_at_ms: nowMs,
      });
      revokeCredential(db, duplicate.environmentId);
    }
  }
}
function createWorkerEnvironmentStore(options = {}) {
  const path = (options.database ?? openOpenClawStateDatabase()).path;
  const now = options.now ?? Date.now;
  const read = () => openOpenClawStateDatabase({ path }).db;
  const write = (operation) =>
    runOpenClawStateWriteTransaction(({ db }) => operation(db), { path });
  write((db) => reconcileAttachedSessionOwners(db, now()));
  const writeCredential = (input) => {
    const environmentId = required(input.environmentId, "id");
    return write((db) => {
      const current = getRequired(db, environmentId);
      if (current.ownerEpoch !== input.expectedOwnerEpoch)
        throw new Error(`Worker environment ${environmentId} owner epoch changed`);
      if (current.state !== "ready" && current.state !== "idle" && current.state !== "attached")
        throw new Error(`Cannot mint worker credential in state ${current.state}`);
      if (current.destroyRequestedAtMs !== null)
        throw new Error("Cannot mint worker credential after destroy is requested");
      if (!current.bootstrapReceipt)
        throw new Error("Worker environment has no admitted bootstrap identity");
      const updatedAtMs = now();
      const ownerEpoch = Math.max(1, current.ownerEpoch);
      if (ownerEpoch !== current.ownerEpoch)
        update(db, environmentId, current.state, {
          owner_epoch: ownerEpoch,
          updated_at_ms: updatedAtMs,
        });
      upsertCredential(
        db,
        credentialInsert({
          input,
          environmentId,
          bundleHash: current.bootstrapReceipt.bundleHash,
          attachedSessionIds: current.attachedSessionIds,
          ownerEpoch,
          nowMs: updatedAtMs,
        }),
      );
      const credential = findCredential(db, environmentId);
      if (!credential) throw new Error("Worker credential persistence failed");
      return credential;
    });
  };
  return {
    createIntent(input) {
      const environmentId = required(input.environmentId, "id");
      const createdAtMs = now();
      return write((db) => {
        executeSqliteQuerySync(
          db,
          query(db)
            .insertInto("worker_environments")
            .values({
              environment_id: environmentId,
              provider_id: required(input.providerId, "provider id"),
              profile_id: required(input.profileId, "profile id"),
              profile_snapshot_json: json(input.profileSnapshot),
              provision_operation_id: required(
                input.provisionOperationId,
                "provision operation id",
              ),
              lease_id: null,
              ssh_host: null,
              ssh_port: null,
              ssh_user: null,
              ssh_host_key: null,
              ssh_key_ref_json: null,
              bootstrap_bundle_hash: null,
              bootstrap_openclaw_version: null,
              bootstrap_protocol_features_json: null,
              owner_epoch: 0,
              teardown_terminal_state: null,
              state: "requested",
              created_at_ms: createdAtMs,
              updated_at_ms: createdAtMs,
              state_changed_at_ms: createdAtMs,
              idle_since_at_ms: null,
              destroy_requested_at_ms: null,
              last_error: null,
            }),
        );
        return getRequired(db, environmentId);
      });
    },
    get: (environmentId) => find(read(), required(environmentId, "id")),
    getCredential: (environmentId) => findCredential(read(), required(environmentId, "id")),
    findCredentialByHash: (credentialHash) =>
      findCredentialByHash(read(), normalizeCredentialHash(credentialHash)),
    list: () => listRows(read(), false),
    listForReconcile: () => listRows(read(), true),
    requestDestroy(input) {
      const environmentId = required(input.environmentId, "id");
      return write((db) => {
        const current = getRequired(db, environmentId);
        if (current.state !== input.state)
          throw new Error(`Worker environment ${environmentId} changed before destroy request`);
        if (current.destroyRequestedAtMs !== null) return current;
        const requestedAtMs = now();
        const terminalState = input.terminalState ?? "destroyed";
        return update(db, environmentId, input.state, {
          updated_at_ms: requestedAtMs,
          destroy_requested_at_ms: requestedAtMs,
          teardown_terminal_state: terminalState,
          ...(input.lastError === void 0
            ? {}
            : { last_error: required(input.lastError, "last error") }),
        });
      });
    },
    transition(input) {
      const { from, to, patch = {} } = input;
      if (!canTransitionWorkerEnvironment(from, to))
        throw new Error(`Illegal worker environment transition: ${from} -> ${to}`);
      const environmentId = required(input.environmentId, "id");
      const updatedAtMs = now();
      return write((db) => {
        const current = getRequired(db, environmentId);
        if (current.state !== from)
          throw new Error(
            `Worker environment ${environmentId} state conflict: expected ${from}, found ${current.state}`,
          );
        if (input.expectedOwnerEpoch !== void 0 && current.ownerEpoch !== input.expectedOwnerEpoch)
          throw new Error(`Worker environment ${environmentId} owner epoch changed`);
        if (to === "attached" && current.destroyRequestedAtMs !== null)
          throw new Error("Cannot attach worker after destroy is requested");
        const clearsLeaseAfterTeardownFailure = to === "failed" && from === "destroying";
        if (
          clearsLeaseAfterTeardownFailure &&
          (current.destroyRequestedAtMs === null || current.teardownTerminalState !== "failed")
        )
          throw new Error("Failed bootstrap transition requires durable provider teardown intent");
        if (
          clearsLeaseAfterTeardownFailure &&
          (patch.leaseId !== null || patch.sshEndpoint !== null)
        )
          throw new Error(
            "Failed bootstrap transition requires explicit lease clearing after provider teardown",
          );
        const leaseId =
          patch.leaseId === void 0
            ? current.leaseId
            : patch.leaseId === null
              ? null
              : required(patch.leaseId, "lease id");
        if (current.leaseId && leaseId !== current.leaseId && !clearsLeaseAfterTeardownFailure)
          throw new Error("Worker environment provider lease id is immutable once persisted");
        const sshEndpoint =
          patch.sshEndpoint === void 0
            ? current.sshEndpoint
            : patch.sshEndpoint === null
              ? null
              : normalizeWorkerSshEndpoint(patch.sshEndpoint);
        const acceptsBootstrapReceipt = from === "bootstrapping" && to === "ready";
        if (patch.bootstrapReceipt !== void 0 && !acceptsBootstrapReceipt)
          throw new Error("Bootstrap receipt can only be recorded when a worker becomes ready");
        if (acceptsBootstrapReceipt && patch.bootstrapReceipt === void 0)
          throw new Error("Ready worker transition requires a bootstrap receipt");
        const acceptsAttachedCredential = to === "attached";
        const acceptsCredential = acceptsBootstrapReceipt || acceptsAttachedCredential;
        if (patch.credential !== void 0 && !acceptsCredential)
          throw new Error("Worker credential cannot be minted during this transition");
        if (acceptsCredential && patch.credential === void 0)
          throw new Error(
            `${to === "ready" ? "Ready" : "Attached"} worker transition requires a worker credential`,
          );
        const clearsBootstrapReceipt =
          to === "bootstrapping" && (from === "ready" || from === "idle");
        const bootstrapReceipt = clearsBootstrapReceipt
          ? null
          : patch.bootstrapReceipt === void 0
            ? current.bootstrapReceipt
            : normalizeBootstrapReceipt(patch.bootstrapReceipt);
        if (acceptsCredential && !bootstrapReceipt)
          throw new Error(
            `${to === "ready" ? "Ready" : "Attached"} worker requires bootstrap proof`,
          );
        const attachedSessionIds =
          to !== "attached"
            ? []
            : patch.attachedSessionIds === void 0
              ? current.attachedSessionIds
              : normalizeAttachedSessionIds(patch.attachedSessionIds);
        assertShape(to, leaseId, sshEndpoint, bootstrapReceipt, attachedSessionIds);
        const [attachedSessionId] = attachedSessionIds;
        if (to === "attached" && attachedSessionId) {
          const existingOwner = listRows(db, false).find(
            (record) =>
              record.environmentId !== environmentId &&
              record.state === "attached" &&
              record.attachedSessionIds[0] === attachedSessionId,
          );
          if (existingOwner)
            throw new WorkerSessionAlreadyAttachedError(
              attachedSessionId,
              existingOwner.environmentId,
            );
        }
        const revokesCredential =
          clearsBootstrapReceipt ||
          to === "attached" ||
          (from === "attached" && to === "idle") ||
          to === "draining" ||
          to === "destroyed" ||
          to === "failed" ||
          to === "orphaned";
        const ownerEpoch = acceptsBootstrapReceipt
          ? Math.max(1, current.ownerEpoch)
          : acceptsAttachedCredential ||
              ((from === "ready" || from === "idle" || from === "attached") &&
                (to === "bootstrapping" ||
                  (from === "attached" && to === "idle") ||
                  to === "draining" ||
                  to === "destroyed" ||
                  to === "failed" ||
                  to === "orphaned"))
            ? nextGlobalOwnerEpoch(db)
            : current.ownerEpoch;
        const record = update(db, environmentId, from, {
          lease_id: leaseId,
          ssh_host: sshEndpoint?.host ?? null,
          ssh_port: sshEndpoint?.port ?? null,
          ssh_user: sshEndpoint?.user ?? null,
          ssh_host_key: sshEndpoint?.hostKey ?? null,
          ssh_key_ref_json: sshEndpoint ? json(sshEndpoint.keyRef) : null,
          bootstrap_bundle_hash: bootstrapReceipt?.bundleHash ?? null,
          bootstrap_openclaw_version: bootstrapReceipt?.openclawVersion ?? null,
          bootstrap_protocol_features_json: bootstrapReceipt
            ? json(bootstrapReceipt.protocolFeatures)
            : null,
          owner_epoch: ownerEpoch,
          state: to,
          attached_session_ids_json: json(attachedSessionIds),
          updated_at_ms: updatedAtMs,
          state_changed_at_ms: updatedAtMs,
          idle_since_at_ms: to === "idle" ? updatedAtMs : null,
          last_error: "lastError" in patch ? patch.lastError?.trim() || null : null,
        });
        if (revokesCredential) revokeCredential(db, environmentId);
        if (patch.credential && bootstrapReceipt)
          upsertCredential(
            db,
            credentialInsert({
              input: patch.credential,
              environmentId,
              bundleHash: bootstrapReceipt.bundleHash,
              attachedSessionIds,
              ownerEpoch,
              nowMs: updatedAtMs,
            }),
          );
        return record;
      });
    },
    renewCredential(input) {
      return writeCredential(input);
    },
    markCredentialDelivered(input) {
      const environmentId = required(input.environmentId, "id");
      return write((db) => {
        const environment = getRequired(db, environmentId);
        const credential = findCredential(db, environmentId);
        if (
          !credential ||
          (environment.state !== "ready" &&
            environment.state !== "idle" &&
            environment.state !== "attached") ||
          environment.destroyRequestedAtMs !== null ||
          credential.credentialHash !== normalizeCredentialHash(input.credentialHash) ||
          credential.ownerEpoch !== input.ownerEpoch ||
          environment.ownerEpoch !== input.ownerEpoch ||
          credential.sessionId !== normalizeSessionId(input.sessionId)
        )
          throw new Error(`Worker environment ${environmentId} credential changed`);
        const deliveredAtMs = normalizeExpiry(input.deliveredAtMs);
        if (deliveredAtMs >= credential.expiresAtMs)
          throw new Error("Expired worker credential cannot be marked delivered");
        if (
          executeSqliteQuerySync(
            db,
            query(db)
              .updateTable("worker_environment_credentials")
              .set({ delivered_at_ms: deliveredAtMs })
              .where("environment_id", "=", environmentId)
              .where("credential_hash", "=", credential.credentialHash)
              .where("owner_epoch", "=", credential.ownerEpoch),
          ).numAffectedRows !== 1n
        )
          throw new Error(`Worker environment ${environmentId} credential changed`);
      });
    },
    recordError(input) {
      return write((db) =>
        update(db, required(input.environmentId, "id"), input.state, {
          updated_at_ms: now(),
          last_error: required(input.error, "last error"),
        }),
      );
    },
  };
}
//#endregion
export {
  createWorkerEnvironmentStore as n,
  normalizeWorkerSshEndpoint as r,
  WorkerSessionAlreadyAttachedError as t,
};
