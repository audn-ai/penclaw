import crypto from "node:crypto";
import { createRequire } from "node:module";
import { v as onAgentEvent } from "./agent-events-D4UsOPeT.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C_WnQaQy.js";
import { n as shouldRouteCompletionThroughRequesterSession } from "./completion-delivery-policy-BAClVBMv.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  f as runWithGatewayIndependentRootWorkAdmission,
  o as isGatewayRestartDraining,
} from "./gateway-work-admission-yGjmBAjy.js";
import { o as requestHeartbeat } from "./heartbeat-wake-B-63db0Y.js";
import { r as createLazyPromiseLoader } from "./lazy-promise-EhsWch5m.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import "./message-channel-NQc9DJ6B.js";
import {
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  m as normalizeSqliteNumber,
  r as closeOpenClawStateDatabase,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { a as enqueueSystemEvent } from "./system-events-CIAdjAwz.js";
import {
  n as getTaskRegistryObservers,
  r as getTaskRegistryStore,
} from "./task-registry.store-DBm1hqnY.js";
import {
  f as parseTaskNotifyPolicy,
  p as parseDeliveryContextJson,
} from "./task-registry.store.sqlite-W50bLikV.js";
import { n as resolveTaskCleanupAfter } from "./task-retention-B_-KmPzc.js";
import {
  a as sanitizeTaskStatusText,
  i as formatTaskStatusTitleText,
} from "./task-status-DAPY5YOX.js";
//#region src/tasks/task-flow-registry.types.ts
const TASK_FLOW_SYNC_MODES = /* @__PURE__ */ new Set(["task_mirrored", "managed"]);
const TASK_FLOW_STATUSES = /* @__PURE__ */ new Set([
  "queued",
  "running",
  "waiting",
  "blocked",
  "succeeded",
  "failed",
  "cancelled",
  "lost",
]);
function parsePersistedFlowValue(value, values, label) {
  if (typeof value === "string" && values.has(value)) return value;
  throw new Error(`Invalid persisted task flow ${label}: ${JSON.stringify(value)}`);
}
function parseOptionalTaskFlowSyncMode(value) {
  if (value == null || value === "") return;
  return parsePersistedFlowValue(value, TASK_FLOW_SYNC_MODES, "sync mode");
}
function parseTaskFlowStatus(value) {
  return parsePersistedFlowValue(value, TASK_FLOW_STATUSES, "status");
}
//#endregion
//#region src/tasks/task-flow-registry.store.sqlite.ts
let cachedDatabase = null;
function serializeJson(value) {
  return value === void 0 ? null : JSON.stringify(value);
}
function parseJsonValue(raw) {
  if (!raw?.trim()) return;
  try {
    return JSON.parse(raw);
  } catch {
    return;
  }
}
function rowToSyncMode(row) {
  const syncMode = parseOptionalTaskFlowSyncMode(row.sync_mode);
  if (syncMode) return syncMode;
  return row.shape === "single_task" ? "task_mirrored" : "managed";
}
function rowToFlowRecord(row) {
  const endedAt = normalizeSqliteNumber(row.ended_at);
  const cancelRequestedAt = normalizeSqliteNumber(row.cancel_requested_at);
  const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
  const stateJson = parseJsonValue(row.state_json);
  const waitJson = parseJsonValue(row.wait_json);
  return {
    flowId: row.flow_id,
    syncMode: rowToSyncMode(row),
    ownerKey: row.owner_key,
    ...(requesterOrigin ? { requesterOrigin } : {}),
    ...(row.controller_id ? { controllerId: row.controller_id } : {}),
    revision: normalizeSqliteNumber(row.revision) ?? 0,
    status: parseTaskFlowStatus(row.status),
    notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
    goal: row.goal,
    ...(row.current_step ? { currentStep: row.current_step } : {}),
    ...(row.blocked_task_id ? { blockedTaskId: row.blocked_task_id } : {}),
    ...(row.blocked_summary ? { blockedSummary: row.blocked_summary } : {}),
    ...(stateJson !== void 0 ? { stateJson } : {}),
    ...(waitJson !== void 0 ? { waitJson } : {}),
    ...(cancelRequestedAt != null ? { cancelRequestedAt } : {}),
    createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
    updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0,
    ...(endedAt != null ? { endedAt } : {}),
  };
}
function bindFlowRecord(record) {
  return {
    flow_id: record.flowId,
    sync_mode: record.syncMode,
    shape: null,
    owner_key: record.ownerKey,
    requester_origin_json: serializeJson(record.requesterOrigin),
    controller_id: record.controllerId ?? null,
    revision: record.revision,
    status: record.status,
    notify_policy: record.notifyPolicy,
    goal: record.goal,
    current_step: record.currentStep ?? null,
    blocked_task_id: record.blockedTaskId ?? null,
    blocked_summary: record.blockedSummary ?? null,
    state_json: serializeJson(record.stateJson),
    wait_json: serializeJson(record.waitJson),
    cancel_requested_at: record.cancelRequestedAt ?? null,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    ended_at: record.endedAt ?? null,
  };
}
function getFlowRegistryKysely(db) {
  return getNodeSqliteKysely(db);
}
function pruneFlowsNotInSnapshot(params) {
  const tempTableName = "openclaw_live_flow_ids";
  params.db.exec(`CREATE TEMP TABLE IF NOT EXISTS ${tempTableName} (id TEXT PRIMARY KEY)`);
  params.db.exec(`DELETE FROM ${tempTableName}`);
  const insert = params.db.prepare(`INSERT OR IGNORE INTO ${tempTableName} (id) VALUES (?)`);
  for (const id of params.ids) insert.run(id);
  params.db.exec(`
    DELETE FROM flow_runs
    WHERE NOT EXISTS (
      SELECT 1 FROM ${tempTableName}
      WHERE ${tempTableName}.id = flow_runs.flow_id
    )
  `);
  params.db.exec(`DELETE FROM ${tempTableName}`);
}
function selectFlowRows(db) {
  return executeSqliteQuerySync(
    db,
    getFlowRegistryKysely(db)
      .selectFrom("flow_runs")
      .select([
        "flow_id",
        "sync_mode",
        "shape",
        "owner_key",
        "requester_origin_json",
        "controller_id",
        "revision",
        "status",
        "notify_policy",
        "goal",
        "current_step",
        "blocked_task_id",
        "blocked_summary",
        "state_json",
        "wait_json",
        "cancel_requested_at",
        "created_at",
        "updated_at",
        "ended_at",
      ])
      .orderBy("created_at", "asc")
      .orderBy("flow_id", "asc"),
  ).rows;
}
function upsertFlowRow(db, row) {
  executeSqliteQuerySync(
    db,
    getFlowRegistryKysely(db)
      .insertInto("flow_runs")
      .values(row)
      .onConflict((conflict) =>
        conflict.column("flow_id").doUpdateSet({
          sync_mode: (eb) => eb.ref("excluded.sync_mode"),
          owner_key: (eb) => eb.ref("excluded.owner_key"),
          requester_origin_json: (eb) => eb.ref("excluded.requester_origin_json"),
          controller_id: (eb) => eb.ref("excluded.controller_id"),
          revision: (eb) => eb.ref("excluded.revision"),
          status: (eb) => eb.ref("excluded.status"),
          notify_policy: (eb) => eb.ref("excluded.notify_policy"),
          goal: (eb) => eb.ref("excluded.goal"),
          current_step: (eb) => eb.ref("excluded.current_step"),
          blocked_task_id: (eb) => eb.ref("excluded.blocked_task_id"),
          blocked_summary: (eb) => eb.ref("excluded.blocked_summary"),
          state_json: (eb) => eb.ref("excluded.state_json"),
          wait_json: (eb) => eb.ref("excluded.wait_json"),
          cancel_requested_at: (eb) => eb.ref("excluded.cancel_requested_at"),
          created_at: (eb) => eb.ref("excluded.created_at"),
          updated_at: (eb) => eb.ref("excluded.updated_at"),
          ended_at: (eb) => eb.ref("excluded.ended_at"),
        }),
      ),
  );
}
function openFlowRegistryDatabase() {
  const database = openOpenClawStateDatabase();
  const pathname = database.path;
  if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen)
    return cachedDatabase;
  if (cachedDatabase && !cachedDatabase.db.isOpen) cachedDatabase = null;
  cachedDatabase = {
    db: database.db,
    path: pathname,
  };
  return cachedDatabase;
}
function withWriteTransaction(write) {
  const database = openFlowRegistryDatabase();
  runOpenClawStateWriteTransaction(() => {
    write(database);
  });
}
function loadTaskFlowRegistryStateFromSqlite() {
  const { db } = openFlowRegistryDatabase();
  const rows = selectFlowRows(db);
  return { flows: new Map(rows.map((row) => [row.flow_id, rowToFlowRecord(row)])) };
}
function saveTaskFlowRegistryStateToSqlite(snapshot) {
  withWriteTransaction(({ db }) => {
    const kysely = getFlowRegistryKysely(db);
    const flowIds = [...snapshot.flows.keys()];
    if (flowIds.length === 0) {
      executeSqliteQuerySync(db, kysely.deleteFrom("flow_runs"));
      return;
    }
    pruneFlowsNotInSnapshot({
      db,
      ids: flowIds,
    });
    for (const flow of snapshot.flows.values()) upsertFlowRow(db, bindFlowRecord(flow));
  });
}
function upsertTaskFlowRegistryRecordToSqlite(flow) {
  withWriteTransaction(({ db }) => {
    upsertFlowRow(db, bindFlowRecord(flow));
  });
}
function deleteTaskFlowRegistryRecordFromSqlite(flowId) {
  withWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getFlowRegistryKysely(db).deleteFrom("flow_runs").where("flow_id", "=", flowId),
    );
  });
}
function closeTaskFlowRegistryDatabase() {
  cachedDatabase = null;
  closeOpenClawStateDatabase();
}
let configuredFlowRegistryStore = {
  loadSnapshot: loadTaskFlowRegistryStateFromSqlite,
  saveSnapshot: saveTaskFlowRegistryStateToSqlite,
  upsertFlow: upsertTaskFlowRegistryRecordToSqlite,
  deleteFlow: deleteTaskFlowRegistryRecordFromSqlite,
  close: closeTaskFlowRegistryDatabase,
};
let configuredFlowRegistryObservers = null;
function getTaskFlowRegistryStore() {
  return configuredFlowRegistryStore;
}
function getTaskFlowRegistryObservers() {
  return configuredFlowRegistryObservers;
}
//#endregion
//#region src/tasks/task-flow-registry.ts
const log$1 = createSubsystemLogger("tasks/task-flow-registry");
let flows = /* @__PURE__ */ new Map();
let taskFlowRegistryRestoreState = { status: "uninitialized" };
function cloneStructuredValue(value) {
  if (value === void 0) return;
  return structuredClone(value);
}
function cloneFlowRecord(record) {
  return {
    ...record,
    ...(record.requesterOrigin
      ? { requesterOrigin: cloneStructuredValue(record.requesterOrigin) }
      : {}),
    ...(record.stateJson !== void 0 ? { stateJson: cloneStructuredValue(record.stateJson) } : {}),
    ...(record.waitJson !== void 0 ? { waitJson: cloneStructuredValue(record.waitJson) } : {}),
  };
}
function normalizeRestoredFlowRecord(record) {
  const syncMode = record.syncMode === "task_mirrored" ? "task_mirrored" : "managed";
  const controllerId =
    syncMode === "managed"
      ? (normalizeOptionalString(record.controllerId) ?? "core/legacy-restored")
      : void 0;
  return {
    ...record,
    syncMode,
    ownerKey: assertFlowOwnerKey(record.ownerKey),
    ...(record.requesterOrigin
      ? { requesterOrigin: cloneStructuredValue(record.requesterOrigin) }
      : {}),
    ...(controllerId ? { controllerId } : {}),
    currentStep: normalizeOptionalString(record.currentStep),
    blockedTaskId: normalizeOptionalString(record.blockedTaskId),
    blockedSummary: normalizeOptionalString(record.blockedSummary),
    ...(record.stateJson !== void 0 ? { stateJson: cloneStructuredValue(record.stateJson) } : {}),
    ...(record.waitJson !== void 0 ? { waitJson: cloneStructuredValue(record.waitJson) } : {}),
    revision: Math.max(0, record.revision),
    cancelRequestedAt: record.cancelRequestedAt ?? void 0,
    endedAt: record.endedAt ?? void 0,
  };
}
function snapshotFlowRecords(source) {
  return [...source.values()].map((record) => cloneFlowRecord(record));
}
function emitFlowRegistryObserverEvent(createEvent) {
  const observers = getTaskFlowRegistryObservers();
  if (!observers?.onEvent) return;
  try {
    observers.onEvent(createEvent());
  } catch {}
}
function ensureNotifyPolicy$1(notifyPolicy) {
  return notifyPolicy ?? "done_only";
}
function normalizeJsonBlob(value) {
  return value === void 0 ? void 0 : cloneStructuredValue(value);
}
function assertFlowOwnerKey(ownerKey) {
  const normalized = normalizeOptionalString(ownerKey);
  if (!normalized) throw new Error("Flow ownerKey is required.");
  return normalized;
}
function assertControllerId(controllerId) {
  const normalized = normalizeOptionalString(controllerId);
  if (!normalized) throw new Error("Managed flow controllerId is required.");
  return normalized;
}
function resolveFlowBlockedSummary(task) {
  if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return;
  return (
    normalizeOptionalString(task.terminalSummary) ?? normalizeOptionalString(task.progressSummary)
  );
}
function deriveTaskFlowStatusFromTask(task) {
  if (task.status === "queued") return "queued";
  if (task.status === "running") return "running";
  if (task.status === "succeeded")
    return task.terminalOutcome === "blocked" ? "blocked" : "succeeded";
  if (task.status === "cancelled") return "cancelled";
  if (task.status === "lost") return "lost";
  return "failed";
}
function isTerminalTaskFlowStatus(status) {
  return (
    status === "succeeded" ||
    status === "blocked" ||
    status === "failed" ||
    status === "cancelled" ||
    status === "lost"
  );
}
function resolveTaskMirroredFlowTiming(task, isTerminal) {
  if (!isTerminal) return { updatedAt: task.lastEventAt ?? task.createdAt };
  const endedAt = task.endedAt ?? task.lastEventAt ?? task.createdAt;
  return {
    updatedAt: endedAt,
    endedAt,
  };
}
function restoreTaskFlowRegistryOnce() {
  switch (taskFlowRegistryRestoreState.status) {
    case "ready":
      return;
    case "failed":
      throw taskFlowRegistryRestoreState.error;
    case "restoring":
      throw new Error("Task-flow registry restore is already in progress.");
    case "uninitialized":
      break;
  }
  taskFlowRegistryRestoreState = { status: "restoring" };
  try {
    const restored = getTaskFlowRegistryStore().loadSnapshot();
    const restoredFlows = /* @__PURE__ */ new Map();
    for (const [flowId, flow] of restored.flows)
      restoredFlows.set(flowId, normalizeRestoredFlowRecord(flow));
    flows = restoredFlows;
    taskFlowRegistryRestoreState = { status: "ready" };
  } catch (error) {
    flows = /* @__PURE__ */ new Map();
    const message = formatErrorMessage(error);
    const restoreError = new Error(`Task-flow registry restore failed: ${message}`, {
      cause: error,
    });
    taskFlowRegistryRestoreState = {
      status: "failed",
      error: restoreError,
      message,
    };
    log$1.warn("Failed to restore task-flow registry", {
      error: message,
      consoleMessage: `Failed to restore task-flow registry: ${message}`,
    });
    throw restoreError;
  }
  emitFlowRegistryObserverEvent(() => ({
    kind: "restored",
    flows: snapshotFlowRecords(flows),
  }));
}
function ensureTaskFlowRegistryReady() {
  restoreTaskFlowRegistryOnce();
}
function getTaskFlowRegistryRestoreFailure() {
  try {
    ensureTaskFlowRegistryReady();
    return null;
  } catch {
    return taskFlowRegistryRestoreState.status === "failed"
      ? taskFlowRegistryRestoreState.message
      : "Task-flow registry restore did not complete.";
  }
}
function reloadTaskFlowRegistryFromStore() {
  flows = /* @__PURE__ */ new Map();
  taskFlowRegistryRestoreState = { status: "uninitialized" };
  ensureTaskFlowRegistryReady();
}
function createFlowSnapshotWith(next, deletedFlowId) {
  const snapshot = new Map(snapshotFlowRecords(flows).map((flow) => [flow.flowId, flow]));
  if (deletedFlowId) snapshot.delete(deletedFlowId);
  if (next) snapshot.set(next.flowId, cloneFlowRecord(next));
  return snapshot;
}
function persistFlowUpsert(flow) {
  const store = getTaskFlowRegistryStore();
  if (store.upsertFlow) {
    store.upsertFlow(cloneFlowRecord(flow));
    return;
  }
  store.saveSnapshot({ flows: createFlowSnapshotWith(flow) });
}
function tryPersistFlowUpsert(flow, operation) {
  try {
    persistFlowUpsert(flow);
    return true;
  } catch (error) {
    log$1.warn("Failed to persist task-flow registry upsert", {
      operation,
      flowId: flow.flowId,
      error,
    });
    return false;
  }
}
function persistFlowDelete(flowId) {
  const store = getTaskFlowRegistryStore();
  if (store.deleteFlow) {
    store.deleteFlow(flowId);
    return;
  }
  store.saveSnapshot({ flows: createFlowSnapshotWith(void 0, flowId) });
}
function tryPersistFlowDelete(flowId) {
  try {
    persistFlowDelete(flowId);
    return true;
  } catch (error) {
    log$1.warn("Failed to persist task-flow registry delete", {
      flowId,
      error,
    });
    return false;
  }
}
function buildFlowRecord(params) {
  const now = params.createdAt ?? Date.now();
  const syncMode = params.syncMode ?? "managed";
  const controllerId = syncMode === "managed" ? assertControllerId(params.controllerId) : void 0;
  return {
    flowId: crypto.randomUUID(),
    syncMode,
    ownerKey: assertFlowOwnerKey(params.ownerKey),
    ...(params.requesterOrigin
      ? { requesterOrigin: cloneStructuredValue(params.requesterOrigin) }
      : {}),
    ...(controllerId ? { controllerId } : {}),
    revision: Math.max(0, params.revision ?? 0),
    status: params.status ?? "queued",
    notifyPolicy: ensureNotifyPolicy$1(params.notifyPolicy),
    goal: params.goal,
    currentStep: normalizeOptionalString(params.currentStep),
    blockedTaskId: normalizeOptionalString(params.blockedTaskId),
    blockedSummary: normalizeOptionalString(params.blockedSummary),
    ...(normalizeJsonBlob(params.stateJson) !== void 0
      ? { stateJson: normalizeJsonBlob(params.stateJson) }
      : {}),
    ...(normalizeJsonBlob(params.waitJson) !== void 0
      ? { waitJson: normalizeJsonBlob(params.waitJson) }
      : {}),
    ...(params.cancelRequestedAt != null ? { cancelRequestedAt: params.cancelRequestedAt } : {}),
    createdAt: now,
    updatedAt: params.updatedAt ?? now,
    ...(params.endedAt != null ? { endedAt: params.endedAt } : {}),
  };
}
function applyFlowPatch(current, patch) {
  const controllerId =
    patch.controllerId === void 0
      ? current.controllerId
      : normalizeOptionalString(patch.controllerId);
  if (current.syncMode === "managed") assertControllerId(controllerId);
  return {
    ...current,
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.notifyPolicy ? { notifyPolicy: patch.notifyPolicy } : {}),
    ...(patch.goal ? { goal: patch.goal } : {}),
    controllerId,
    currentStep:
      patch.currentStep === void 0
        ? current.currentStep
        : normalizeOptionalString(patch.currentStep),
    blockedTaskId:
      patch.blockedTaskId === void 0
        ? current.blockedTaskId
        : normalizeOptionalString(patch.blockedTaskId),
    blockedSummary:
      patch.blockedSummary === void 0
        ? current.blockedSummary
        : normalizeOptionalString(patch.blockedSummary),
    stateJson: patch.stateJson === void 0 ? current.stateJson : normalizeJsonBlob(patch.stateJson),
    waitJson: patch.waitJson === void 0 ? current.waitJson : normalizeJsonBlob(patch.waitJson),
    cancelRequestedAt:
      patch.cancelRequestedAt === void 0
        ? current.cancelRequestedAt
        : (patch.cancelRequestedAt ?? void 0),
    revision: current.revision + 1,
    updatedAt: patch.updatedAt ?? Date.now(),
    endedAt: patch.endedAt === void 0 ? current.endedAt : (patch.endedAt ?? void 0),
  };
}
function writeFlowRecord(next, previous) {
  if (!tryPersistFlowUpsert(next, previous ? "update" : "create")) return null;
  flows.set(next.flowId, next);
  emitFlowRegistryObserverEvent(() => ({
    kind: "upserted",
    flow: cloneFlowRecord(next),
    ...(previous ? { previous: cloneFlowRecord(previous) } : {}),
  }));
  return cloneFlowRecord(next);
}
function createFlowRecord(params) {
  ensureTaskFlowRegistryReady();
  return writeFlowRecord(buildFlowRecord(params));
}
function createManagedTaskFlow(params) {
  return createFlowRecord({
    ...params,
    syncMode: "managed",
    controllerId: assertControllerId(params.controllerId),
  });
}
function createTaskFlowForTask(params) {
  const terminalFlowStatus = deriveTaskFlowStatusFromTask(params.task);
  const timing = resolveTaskMirroredFlowTiming(
    params.task,
    isTerminalTaskFlowStatus(terminalFlowStatus),
  );
  return createFlowRecord({
    syncMode: "task_mirrored",
    ownerKey: params.task.ownerKey,
    requesterOrigin: params.requesterOrigin,
    status: terminalFlowStatus,
    notifyPolicy: params.task.notifyPolicy,
    goal:
      normalizeOptionalString(params.task.label) ?? (params.task.task.trim() || "Background task"),
    blockedTaskId:
      terminalFlowStatus === "blocked" ? normalizeOptionalString(params.task.taskId) : void 0,
    blockedSummary: resolveFlowBlockedSummary(params.task),
    createdAt: params.task.createdAt,
    updatedAt: timing.updatedAt,
    ...(timing.endedAt !== void 0 ? { endedAt: timing.endedAt } : {}),
  });
}
function updateFlowRecordByIdUnchecked(flowId, patch) {
  ensureTaskFlowRegistryReady();
  const current = flows.get(flowId);
  if (!current) return null;
  return writeFlowRecord(applyFlowPatch(current, patch), current);
}
function updateFlowRecordByIdExpectedRevision(params) {
  ensureTaskFlowRegistryReady();
  const current = flows.get(params.flowId);
  if (!current)
    return {
      applied: false,
      reason: "not_found",
    };
  if (current.revision !== params.expectedRevision)
    return {
      applied: false,
      reason: "revision_conflict",
      current: cloneFlowRecord(current),
    };
  const flow = writeFlowRecord(applyFlowPatch(current, params.patch), current);
  if (!flow)
    return {
      applied: false,
      reason: "persist_failed",
      current: cloneFlowRecord(current),
    };
  return {
    applied: true,
    flow,
  };
}
function setFlowWaiting(params) {
  return updateFlowRecordByIdExpectedRevision({
    flowId: params.flowId,
    expectedRevision: params.expectedRevision,
    patch: {
      status:
        normalizeOptionalString(params.blockedTaskId) ||
        normalizeOptionalString(params.blockedSummary)
          ? "blocked"
          : "waiting",
      currentStep: params.currentStep,
      stateJson: params.stateJson,
      waitJson: params.waitJson,
      blockedTaskId: params.blockedTaskId,
      blockedSummary: params.blockedSummary,
      endedAt: null,
      updatedAt: params.updatedAt,
    },
  });
}
function resumeFlow(params) {
  return updateFlowRecordByIdExpectedRevision({
    flowId: params.flowId,
    expectedRevision: params.expectedRevision,
    patch: {
      status: params.status ?? "queued",
      currentStep: params.currentStep,
      stateJson: params.stateJson,
      waitJson: null,
      blockedTaskId: null,
      blockedSummary: null,
      endedAt: null,
      updatedAt: params.updatedAt,
    },
  });
}
function finishFlow(params) {
  const endedAt = params.endedAt ?? params.updatedAt ?? Date.now();
  return updateFlowRecordByIdExpectedRevision({
    flowId: params.flowId,
    expectedRevision: params.expectedRevision,
    patch: {
      status: "succeeded",
      currentStep: params.currentStep,
      stateJson: params.stateJson,
      waitJson: null,
      blockedTaskId: null,
      blockedSummary: null,
      endedAt,
      updatedAt: params.updatedAt ?? endedAt,
    },
  });
}
function failFlow(params) {
  const endedAt = params.endedAt ?? params.updatedAt ?? Date.now();
  return updateFlowRecordByIdExpectedRevision({
    flowId: params.flowId,
    expectedRevision: params.expectedRevision,
    patch: {
      status: "failed",
      currentStep: params.currentStep,
      stateJson: params.stateJson,
      waitJson: null,
      blockedTaskId: params.blockedTaskId,
      blockedSummary: params.blockedSummary,
      endedAt,
      updatedAt: params.updatedAt ?? endedAt,
    },
  });
}
function requestFlowCancel(params) {
  return updateFlowRecordByIdExpectedRevision({
    flowId: params.flowId,
    expectedRevision: params.expectedRevision,
    patch: {
      cancelRequestedAt: params.cancelRequestedAt ?? params.updatedAt ?? Date.now(),
      updatedAt: params.updatedAt,
    },
  });
}
function syncFlowFromTaskResult(task) {
  const flowId = task.parentFlowId?.trim();
  if (!flowId)
    return {
      ok: true,
      flow: null,
    };
  const flow = getTaskFlowById(flowId);
  if (!flow)
    return {
      ok: true,
      flow: null,
    };
  if (flow.syncMode !== "task_mirrored")
    return {
      ok: true,
      flow,
    };
  const terminalFlowStatus = deriveTaskFlowStatusFromTask(task);
  const isTerminal = isTerminalTaskFlowStatus(terminalFlowStatus);
  const timing = resolveTaskMirroredFlowTiming(
    {
      createdAt: flow.createdAt,
      lastEventAt: task.lastEventAt,
      endedAt: task.endedAt,
    },
    isTerminal,
  );
  const updated = updateFlowRecordByIdUnchecked(flowId, {
    status: terminalFlowStatus,
    notifyPolicy: task.notifyPolicy,
    goal: normalizeOptionalString(task.label) ?? (task.task.trim() || "Background task"),
    blockedTaskId: terminalFlowStatus === "blocked" ? task.taskId.trim() || null : null,
    blockedSummary:
      terminalFlowStatus === "blocked" ? (resolveFlowBlockedSummary(task) ?? null) : null,
    waitJson: null,
    updatedAt: timing.updatedAt,
    ...(isTerminal ? { endedAt: timing.endedAt ?? timing.updatedAt } : { endedAt: null }),
  });
  if (!updated)
    return {
      ok: false,
      reason: "persist_failed",
      current: flow,
    };
  return {
    ok: true,
    flow: updated,
  };
}
function getTaskFlowById(flowId) {
  ensureTaskFlowRegistryReady();
  const flow = flows.get(flowId);
  return flow ? cloneFlowRecord(flow) : void 0;
}
function listTaskFlowsForOwnerKey(ownerKey) {
  ensureTaskFlowRegistryReady();
  const normalizedOwnerKey = ownerKey.trim();
  if (!normalizedOwnerKey) return [];
  return [...flows.values()]
    .filter((flow) => flow.ownerKey.trim() === normalizedOwnerKey)
    .map((flow) => cloneFlowRecord(flow))
    .toSorted((left, right) => right.createdAt - left.createdAt);
}
function findLatestTaskFlowForOwnerKey(ownerKey) {
  const flow = listTaskFlowsForOwnerKey(ownerKey)[0];
  return flow ? cloneFlowRecord(flow) : void 0;
}
function resolveTaskFlowForLookupToken(token) {
  const lookup = token.trim();
  if (!lookup) return;
  return getTaskFlowById(lookup) ?? findLatestTaskFlowForOwnerKey(lookup);
}
function listTaskFlowRecords() {
  ensureTaskFlowRegistryReady();
  return [...flows.values()]
    .map((flow) => cloneFlowRecord(flow))
    .toSorted((left, right) => right.createdAt - left.createdAt);
}
function deleteTaskFlowRecordById(flowId) {
  ensureTaskFlowRegistryReady();
  const current = flows.get(flowId);
  if (!current) return false;
  if (!tryPersistFlowDelete(flowId)) return false;
  flows.delete(flowId);
  emitFlowRegistryObserverEvent(() => ({
    kind: "deleted",
    flowId,
    previous: cloneFlowRecord(current),
  }));
  return true;
}
//#endregion
//#region src/tasks/detached-task-runtime-contract.ts
const SUBAGENT_KILL_TASK_ERROR = "Subagent run killed.";
//#endregion
//#region src/tasks/native-subagent-task.ts
const CHILDLESS_NATIVE_SUBAGENT_DEFINITIONS = [
  {
    taskKind: "codex-native",
    runIdPrefix: "codex-thread:",
  },
  {
    taskKind: "copilot-native",
    runIdPrefix: "copilot-agent:",
  },
];
function resolveChildlessNativeSubagentTaskDefinition(task) {
  if (task.runtime !== "subagent" || task.childSessionKey?.trim()) return;
  return CHILDLESS_NATIVE_SUBAGENT_DEFINITIONS.find(
    (definition) =>
      task.taskKind === definition.taskKind &&
      [task.sourceId, task.runId].some((candidate) =>
        candidate?.trim().startsWith(definition.runIdPrefix),
      ),
  );
}
function isChildlessNativeSubagentTask(task) {
  return resolveChildlessNativeSubagentTaskDefinition(task) !== void 0;
}
//#endregion
//#region src/tasks/task-cancellation-state.ts
function isProvisionalSubagentKillTask(task) {
  return (
    task.runtime === "subagent" &&
    task.status === "cancelled" &&
    task.error === "Subagent run killed."
  );
}
function isTaskFlowCancellationPending(task) {
  return (
    task.status === "queued" || task.status === "running" || isProvisionalSubagentKillTask(task)
  );
}
//#endregion
//#region src/tasks/task-executor-policy.ts
/** Returns whether a task status is terminal for delivery and retention policy. */
function isTerminalTaskStatus(status) {
  return (
    status === "succeeded" ||
    status === "failed" ||
    status === "timed_out" ||
    status === "cancelled" ||
    status === "lost"
  );
}
function resolveTaskDisplayTitle(task) {
  return formatTaskStatusTitleText(
    task.label?.trim() ||
      (task.runtime === "acp"
        ? "ACP background task"
        : task.runtime === "subagent"
          ? "Subagent task"
          : task.task.trim() || "Background task"),
  );
}
function resolveTaskRunLabel(task) {
  return task.runId ? ` (run ${task.runId.slice(0, 8)})` : "";
}
function formatTaskTerminalMessage(task, options = {}) {
  const title = resolveTaskDisplayTitle(task);
  const runLabel = resolveTaskRunLabel(task);
  const summary = sanitizeTaskStatusText(task.terminalSummary, {
    errorContext: task.status !== "succeeded" || task.terminalOutcome === "blocked",
  });
  if (task.status === "succeeded") {
    if (task.terminalOutcome === "blocked")
      return summary
        ? `Background task blocked: ${title}${runLabel}. ${summary}`
        : `Background task blocked: ${title}${runLabel}.`;
    if (options.surface === "parent_session") {
      const reviewNext = "Next: parent will review/verify before calling it done.";
      return summary
        ? `Background task ready for review: ${title}${runLabel}. ${summary} ${reviewNext}`
        : `Background task ready for review: ${title}${runLabel}. ${reviewNext}`;
    }
    return summary
      ? `Background task done: ${title}${runLabel}. ${summary}`
      : `Background task done: ${title}${runLabel}.`;
  }
  if (task.status === "timed_out") return `Background task timed out: ${title}${runLabel}.`;
  if (task.status === "lost") {
    const error = sanitizeTaskStatusText(task.error, { errorContext: true });
    const fallbackSummary = sanitizeTaskStatusText(task.terminalSummary, { errorContext: true });
    return `Background task lost: ${title}${runLabel}. ${error || fallbackSummary || "Backing session disappeared."}`;
  }
  if (task.status === "cancelled") {
    if (task.runtime === "subagent")
      return `Background task cancellation requested: ${title}${runLabel}.`;
    return `Background task cancelled: ${title}${runLabel}.`;
  }
  const error = sanitizeTaskStatusText(task.error, { errorContext: true });
  const fallbackSummary = sanitizeTaskStatusText(task.terminalSummary, { errorContext: true });
  return error
    ? `Background task failed: ${title}${runLabel}. ${error}`
    : fallbackSummary
      ? `Background task failed: ${title}${runLabel}. ${fallbackSummary}`
      : `Background task failed: ${title}${runLabel}.`;
}
function shouldUseParentReviewTaskTerminalMessage(task) {
  return (
    task.runtime === "acp" &&
    task.status === "succeeded" &&
    task.terminalOutcome !== "blocked" &&
    Boolean(task.childSessionKey?.trim())
  );
}
function formatTaskBlockedFollowupMessage(task) {
  if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return null;
  return `Task needs follow-up: ${resolveTaskDisplayTitle(task)}${resolveTaskRunLabel(task)}. ${sanitizeTaskStatusText(task.terminalSummary, { errorContext: true }) || "Task is blocked and needs follow-up."}`;
}
function formatTaskStateChangeMessage(task, event) {
  const title = resolveTaskDisplayTitle(task);
  if (event.kind === "running") return `Background task started: ${title}.`;
  if (event.kind === "progress") {
    const summary = sanitizeTaskStatusText(event.summary);
    return summary ? `Background task update: ${title}. ${summary}` : null;
  }
  return null;
}
function shouldAutoDeliverTaskTerminalUpdate(task) {
  if (task.notifyPolicy === "silent") return false;
  if (task.runtime === "subagent" && task.status !== "cancelled") return false;
  if (
    task.runtime === "subagent" &&
    task.status === "cancelled" &&
    task.error === "Subagent run killed."
  )
    return false;
  if (!isTerminalTaskStatus(task.status)) return false;
  return task.deliveryStatus === "pending";
}
function shouldAutoDeliverTaskStateChange(task) {
  return (
    task.notifyPolicy === "state_changes" &&
    task.deliveryStatus === "pending" &&
    !isTerminalTaskStatus(task.status)
  );
}
function shouldSuppressDuplicateTerminalDelivery(params) {
  if (!params.task.runId?.trim()) return false;
  if (
    !(
      params.task.runtime === "acp" ||
      (params.task.runtime === "subagent" && params.task.status === "cancelled")
    )
  )
    return false;
  if (params.task.runtime === "subagent" && params.peerDeliveryCovered) return true;
  return Boolean(params.preferredTaskId && params.preferredTaskId !== params.task.taskId);
}
//#endregion
//#region src/tasks/task-registry-records.ts
function cloneTaskRecord(record) {
  return {
    ...record,
    ...(record.detail !== void 0 ? { detail: structuredClone(record.detail) } : {}),
  };
}
function normalizeTaskTimestamps(task) {
  let createdAt = task.createdAt;
  for (const candidate of [task.startedAt, task.lastEventAt, task.endedAt])
    if (typeof candidate === "number" && candidate < createdAt) createdAt = candidate;
  const startedAt =
    typeof task.startedAt === "number" ? Math.max(task.startedAt, createdAt) : task.startedAt;
  const lastEventAt =
    typeof task.lastEventAt === "number"
      ? Math.max(task.lastEventAt, startedAt ?? createdAt)
      : task.lastEventAt;
  const endedAt =
    typeof task.endedAt === "number"
      ? Math.max(task.endedAt, startedAt ?? createdAt)
      : task.endedAt;
  if (
    createdAt === task.createdAt &&
    startedAt === task.startedAt &&
    lastEventAt === task.lastEventAt &&
    endedAt === task.endedAt
  )
    return task;
  const normalized = {
    ...task,
    createdAt,
  };
  if (typeof startedAt === "number") normalized.startedAt = startedAt;
  if (typeof lastEventAt === "number") normalized.lastEventAt = lastEventAt;
  if (typeof endedAt === "number") normalized.endedAt = endedAt;
  return normalized;
}
function cloneTaskDeliveryState(state) {
  return {
    ...state,
    ...(state.requesterOrigin ? { requesterOrigin: { ...state.requesterOrigin } } : {}),
  };
}
//#endregion
//#region src/tasks/task-registry.process-state.ts
const TASK_REGISTRY_PROCESS_STATE_KEY = Symbol.for("openclaw.taskRegistry.state");
/** Returns the singleton in-process task registry state. */
function getTaskRegistryProcessState() {
  const globalState = globalThis;
  globalState[TASK_REGISTRY_PROCESS_STATE_KEY] ??= {
    tasks: /* @__PURE__ */ new Map(),
    taskDeliveryStates: /* @__PURE__ */ new Map(),
    taskIdsByRunId: /* @__PURE__ */ new Map(),
    taskIdsByOwnerKey: /* @__PURE__ */ new Map(),
    taskIdsByParentFlowId: /* @__PURE__ */ new Map(),
    taskIdsByRelatedSessionKey: /* @__PURE__ */ new Map(),
    tasksWithPendingDelivery: /* @__PURE__ */ new Set(),
  };
  return globalState[TASK_REGISTRY_PROCESS_STATE_KEY];
}
//#endregion
//#region src/tasks/task-registry.ts
const log = createSubsystemLogger("tasks/registry");
const TASK_FLOW_SYNC_RETRY_DELAYS_MS = [1e3, 5e3, 25e3, 12e4, 6e5];
const taskRegistryProcessState = getTaskRegistryProcessState();
const tasks = taskRegistryProcessState.tasks;
const taskDeliveryStates = taskRegistryProcessState.taskDeliveryStates;
const taskIdsByRunId = taskRegistryProcessState.taskIdsByRunId;
const taskIdsByOwnerKey = taskRegistryProcessState.taskIdsByOwnerKey;
const taskIdsByParentFlowId = taskRegistryProcessState.taskIdsByParentFlowId;
const taskIdsByRelatedSessionKey = taskRegistryProcessState.taskIdsByRelatedSessionKey;
const tasksWithPendingDelivery = taskRegistryProcessState.tasksWithPendingDelivery;
let listenerStarted = false;
let taskRegistryRestoreState = { status: "uninitialized" };
const taskFlowSyncRetryTimers = /* @__PURE__ */ new Map();
const TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY = Symbol.for(
  "openclaw.taskRegistry.deliveryRuntimeOverride",
);
const TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY = Symbol.for(
  "openclaw.taskRegistry.controlRuntimeOverride",
);
const require = createRequire(import.meta.url);
const TASK_REGISTRY_CONTROL_RUNTIME_CANDIDATES = [
  "./task-registry-control.runtime.js",
  "./task-registry-control.runtime.ts",
];
const deliveryRuntimeLoader = createLazyPromiseLoader(
  () => import("./task-registry-delivery-runtime-BUyk_6HT.js"),
  { cacheRejections: true },
);
const controlRuntimeLoader = createLazyPromiseLoader(
  () =>
    Promise.resolve().then(() => {
      for (const candidate of TASK_REGISTRY_CONTROL_RUNTIME_CANDIDATES)
        try {
          return require(candidate);
        } catch {}
      throw new Error("Failed to load task registry control runtime.");
    }),
  { cacheRejections: true },
);
var ParentFlowLinkError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ParentFlowLinkError";
  }
};
function isParentFlowLinkError(error) {
  return error instanceof ParentFlowLinkError;
}
function isActiveTaskStatus(status) {
  return status === "queued" || status === "running";
}
function isTerminalFlowStatus(status) {
  return (
    status === "succeeded" || status === "failed" || status === "cancelled" || status === "lost"
  );
}
function assertTaskOwner(params) {
  if (!params.ownerKey.trim() && params.scopeKind !== "system")
    throw new Error("Task ownerKey is required.");
}
function assertParentFlowLinkAllowed(params) {
  const flowId = params.parentFlowId?.trim();
  if (!flowId) return;
  if (params.scopeKind !== "session")
    throw new ParentFlowLinkError(
      "scope_kind_not_session",
      "Only session-scoped tasks can link to flows.",
      { flowId },
    );
  const flow = getTaskFlowById(flowId);
  if (!flow)
    throw new ParentFlowLinkError("parent_flow_not_found", `Parent flow not found: ${flowId}`, {
      flowId,
    });
  if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(params.ownerKey))
    throw new ParentFlowLinkError(
      "owner_key_mismatch",
      "Task ownerKey must match parent flow ownerKey.",
      { flowId },
    );
  if (flow.cancelRequestedAt != null)
    throw new ParentFlowLinkError(
      "cancel_requested",
      "Parent flow cancellation has already been requested.",
      {
        flowId,
        status: flow.status,
      },
    );
  if (isTerminalFlowStatus(flow.status))
    throw new ParentFlowLinkError("terminal", `Parent flow is already ${flow.status}.`, {
      flowId,
      status: flow.status,
    });
}
function ensureLinkedTaskFlowRegistryReady(task) {
  if (task.parentFlowId?.trim()) ensureTaskFlowRegistryReady();
}
function ensureTaskCancellationReady(task) {
  const runId = task.runId?.trim();
  const linkedTasks =
    runId && (task.runtime === "acp" || task.runtime === "subagent")
      ? getTasksByRunScope({
          runId,
          runtime: task.runtime,
          sessionKey: task.childSessionKey,
        })
      : [task];
  for (const linkedTask of linkedTasks.length > 0 ? linkedTasks : [task])
    ensureLinkedTaskFlowRegistryReady(linkedTask);
}
function snapshotTaskRecords(source) {
  return [...source.values()].map((record) => cloneTaskRecord(record));
}
function emitTaskRegistryObserverEvent(createEvent) {
  const observers = getTaskRegistryObservers();
  if (!observers?.onEvent) return;
  try {
    observers.onEvent(createEvent());
  } catch (error) {
    log.warn("Task registry observer failed", {
      event: "task-registry",
      error,
    });
  }
}
function persistTaskUpsert(task, pendingDeliveryState) {
  const store = getTaskRegistryStore();
  const deliveryState = pendingDeliveryState ?? taskDeliveryStates.get(task.taskId);
  if (store.upsertTaskWithDeliveryState) {
    store.upsertTaskWithDeliveryState({
      task,
      ...(deliveryState ? { deliveryState } : {}),
    });
    return;
  }
  if (!deliveryState && store.upsertTask) {
    store.upsertTask(task);
    return;
  }
  store.saveSnapshot({
    tasks: new Map(tasks).set(task.taskId, task),
    deliveryStates: deliveryState
      ? new Map(taskDeliveryStates).set(task.taskId, deliveryState)
      : taskDeliveryStates,
  });
}
function tryPersistTaskUpsert(task, operation, pendingDeliveryState) {
  try {
    persistTaskUpsert(task, pendingDeliveryState);
    return true;
  } catch (error) {
    log.warn("Failed to persist task registry upsert", {
      operation,
      taskId: task.taskId,
      runId: task.runId,
      error,
    });
    return false;
  }
}
function persistTaskDelete(taskId) {
  const store = getTaskRegistryStore();
  if (store.deleteTaskWithDeliveryState) {
    store.deleteTaskWithDeliveryState(taskId);
    return;
  }
  const projectedTasks = new Map(tasks);
  projectedTasks.delete(taskId);
  const projectedDeliveryStates = new Map(taskDeliveryStates);
  projectedDeliveryStates.delete(taskId);
  store.saveSnapshot({
    tasks: projectedTasks,
    deliveryStates: projectedDeliveryStates,
  });
}
function tryPersistTaskDelete(taskId) {
  try {
    persistTaskDelete(taskId);
    return true;
  } catch (error) {
    log.warn("Failed to persist task registry delete", {
      taskId,
      error,
    });
    return false;
  }
}
function persistTaskDeliveryStateUpsert(state) {
  const store = getTaskRegistryStore();
  if (store.upsertDeliveryState) {
    store.upsertDeliveryState(state);
    return;
  }
  const projectedDeliveryStates = new Map(taskDeliveryStates);
  projectedDeliveryStates.set(state.taskId, cloneTaskDeliveryState(state));
  store.saveSnapshot({
    tasks,
    deliveryStates: projectedDeliveryStates,
  });
}
function tryPersistTaskDeliveryStateUpsert(state) {
  try {
    persistTaskDeliveryStateUpsert(state);
    return true;
  } catch (error) {
    log.warn("Failed to persist task delivery state", {
      taskId: state.taskId,
      error,
    });
    return false;
  }
}
function clearTaskRegistryMemory() {
  clearTaskFlowSyncRetries();
  tasks.clear();
  taskDeliveryStates.clear();
  taskIdsByRunId.clear();
  taskIdsByOwnerKey.clear();
  taskIdsByParentFlowId.clear();
  taskIdsByRelatedSessionKey.clear();
  tasksWithPendingDelivery.clear();
}
function ensureDeliveryStatus(params) {
  if (params.scopeKind === "system") return "not_applicable";
  return params.ownerKey.trim() ? "pending" : "parent_missing";
}
function ensureNotifyPolicy(params) {
  if (params.notifyPolicy) return params.notifyPolicy;
  return (params.deliveryStatus ??
    ensureDeliveryStatus({
      ownerKey: params.ownerKey,
      scopeKind: params.scopeKind,
    })) === "not_applicable"
    ? "silent"
    : "done_only";
}
function resolveTaskScopeKind(params) {
  if (params.scopeKind) return params.scopeKind;
  return params.requesterSessionKey.trim() ? "session" : "system";
}
function resolveTaskRequesterSessionKey(params) {
  const requesterSessionKey = params.requesterSessionKey?.trim();
  if (requesterSessionKey) return requesterSessionKey;
  if (params.scopeKind === "system") return "";
  return params.ownerKey?.trim() ?? "";
}
function resolveTaskOwnerKey(params) {
  return params.ownerKey?.trim() || params.requesterSessionKey.trim();
}
function normalizeTaskSummary(value) {
  return value?.replace(/\s+/g, " ").trim() || void 0;
}
function normalizeTaskStatus(value) {
  return value === "running" ||
    value === "queued" ||
    value === "succeeded" ||
    value === "failed" ||
    value === "timed_out" ||
    value === "cancelled" ||
    value === "lost"
    ? value
    : "queued";
}
function normalizeTaskTerminalOutcome(value) {
  return value === "succeeded" || value === "blocked" ? value : void 0;
}
function shouldApplyRunScopedStatusUpdate(params) {
  if (
    params.currentRuntime === "subagent" &&
    params.nextStatus === "cancelled" &&
    params.nextError === "Subagent run killed." &&
    isTerminalTaskStatus(params.currentStatus) &&
    !(params.currentStatus === "cancelled" && params.currentError === "Subagent run killed.")
  )
    return false;
  if (params.currentStatus === params.nextStatus) return true;
  if (!isTerminalTaskStatus(params.currentStatus)) return true;
  if (!isTerminalTaskStatus(params.nextStatus)) return false;
  if (
    params.currentStatus === "cancelled" &&
    (params.nextStatus === "succeeded" ||
      params.nextStatus === "failed" ||
      params.nextStatus === "timed_out")
  )
    return (
      (params.currentRuntime === "subagent" &&
        params.currentEndedAt !== void 0 &&
        params.nextEndedAt !== void 0 &&
        params.nextEndedAt < params.currentEndedAt) ||
      (params.currentRuntime === "subagent" &&
        Boolean(params.currentChildSessionKey?.trim()) &&
        params.currentError === "Subagent run killed.")
    );
  return params.currentStatus === "succeeded" && params.nextStatus !== "lost";
}
function resolveTaskTerminalOutcome(params) {
  const normalized = normalizeTaskTerminalOutcome(params.terminalOutcome);
  if (normalized) return normalized;
  return params.status === "succeeded" ? "succeeded" : void 0;
}
function mapAgentRunTerminalOutcomeToTaskStatus(outcome) {
  switch (outcome.reason) {
    case "completed":
      return "succeeded";
    case "hard_timeout":
    case "timed_out":
      return "timed_out";
    case "cancelled":
    case "aborted":
      return "cancelled";
    case "blocked":
    case "abandoned":
    case "failed":
      return "failed";
    default:
      return outcome.reason;
  }
}
function resolveTaskLifecycleTerminalError(params) {
  return params.runtime === "subagent" && params.status === "cancelled"
    ? SUBAGENT_KILL_TASK_ERROR
    : params.error;
}
function buildTaskLifecycleTerminalOutcome(params) {
  return buildAgentRunTerminalOutcome({
    status: params.phase === "error" ? "error" : params.data?.aborted === true ? "timeout" : "ok",
    error: params.data?.error,
    stopReason: params.data?.stopReason,
    livenessState: params.data?.livenessState,
    timeoutPhase: params.data?.timeoutPhase,
    providerStarted: params.data?.providerStarted,
    startedAt: params.startedAt,
    endedAt: params.endedAt,
  });
}
function appendTaskEvent(event) {
  const summary = normalizeTaskSummary(event.summary);
  return {
    at: event.at,
    kind: event.kind,
    ...(summary ? { summary } : {}),
  };
}
function loadTaskRegistryDeliveryRuntime() {
  const deliveryRuntimeOverride = globalThis[TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY];
  if (deliveryRuntimeOverride) return Promise.resolve(deliveryRuntimeOverride);
  return deliveryRuntimeLoader.load();
}
function loadTaskRegistryControlRuntime() {
  const controlRuntimeOverride = globalThis[TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY];
  if (controlRuntimeOverride) return Promise.resolve(controlRuntimeOverride);
  return controlRuntimeLoader.load();
}
function addRunIdIndex(taskId, runId) {
  const trimmed = runId?.trim();
  if (!trimmed) return;
  let ids = taskIdsByRunId.get(trimmed);
  if (!ids) {
    ids = /* @__PURE__ */ new Set();
    taskIdsByRunId.set(trimmed, ids);
  }
  ids.add(taskId);
}
function addIndexedKey(index, key, taskId) {
  let ids = index.get(key);
  if (!ids) {
    ids = /* @__PURE__ */ new Set();
    index.set(key, ids);
  }
  ids.add(taskId);
}
function deleteIndexedKey(index, key, taskId) {
  const ids = index.get(key);
  if (!ids) return;
  ids.delete(taskId);
  if (ids.size === 0) index.delete(key);
}
function getTaskRelatedSessionIndexKeys(task) {
  return uniqueStrings(
    [normalizeOptionalString(task.ownerKey), normalizeOptionalString(task.childSessionKey)].filter(
      Boolean,
    ),
  );
}
function addOwnerKeyIndex(taskId, task) {
  const key = normalizeOptionalString(task.ownerKey);
  if (!key) return;
  addIndexedKey(taskIdsByOwnerKey, key, taskId);
}
function deleteOwnerKeyIndex(taskId, task) {
  const key = normalizeOptionalString(task.ownerKey);
  if (!key) return;
  deleteIndexedKey(taskIdsByOwnerKey, key, taskId);
}
function addParentFlowIdIndex(taskId, task) {
  const key = task.parentFlowId?.trim();
  if (!key) return;
  addIndexedKey(taskIdsByParentFlowId, key, taskId);
}
function deleteParentFlowIdIndex(taskId, task) {
  const key = task.parentFlowId?.trim();
  if (!key) return;
  deleteIndexedKey(taskIdsByParentFlowId, key, taskId);
}
function addRelatedSessionKeyIndex(taskId, task) {
  for (const sessionKey of getTaskRelatedSessionIndexKeys(task))
    addIndexedKey(taskIdsByRelatedSessionKey, sessionKey, taskId);
}
function deleteRelatedSessionKeyIndex(taskId, task) {
  for (const sessionKey of getTaskRelatedSessionIndexKeys(task))
    deleteIndexedKey(taskIdsByRelatedSessionKey, sessionKey, taskId);
}
function rebuildRunIdIndex() {
  taskIdsByRunId.clear();
  for (const [taskId, task] of tasks.entries()) addRunIdIndex(taskId, task.runId);
}
function rebuildOwnerKeyIndex() {
  taskIdsByOwnerKey.clear();
  for (const [taskId, task] of tasks.entries()) addOwnerKeyIndex(taskId, task);
}
function rebuildParentFlowIdIndex() {
  taskIdsByParentFlowId.clear();
  for (const [taskId, task] of tasks.entries()) addParentFlowIdIndex(taskId, task);
}
function rebuildRelatedSessionKeyIndex() {
  taskIdsByRelatedSessionKey.clear();
  for (const [taskId, task] of tasks.entries()) addRelatedSessionKeyIndex(taskId, task);
}
function getTasksByRunId(runId) {
  const ids = taskIdsByRunId.get(runId.trim());
  if (!ids || ids.size === 0) return [];
  return [...ids].map((taskId) => tasks.get(taskId)).filter((task) => Boolean(task));
}
function taskRunScopeKey(task) {
  return [
    task.runtime,
    task.scopeKind,
    normalizeOptionalString(task.ownerKey) ?? "",
    normalizeOptionalString(task.childSessionKey) ?? "",
  ].join("\0");
}
function getTasksByRunScope(params) {
  const matches = getTasksByRunId(params.runId).filter(
    (task) => !params.runtime || task.runtime === params.runtime,
  );
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (sessionKey) {
    const childMatches = matches.filter(
      (task) => normalizeOptionalString(task.childSessionKey) === sessionKey,
    );
    if (childMatches.length > 0) return childMatches;
    return matches.filter(
      (task) =>
        task.scopeKind === "session" && normalizeOptionalString(task.ownerKey) === sessionKey,
    );
  }
  return new Set(matches.map((task) => taskRunScopeKey(task))).size <= 1 ? matches : [];
}
function getPeerTasksForDelivery(task) {
  if (!task.runId?.trim()) return [];
  return getTasksByRunId(task.runId).filter(
    (candidate) =>
      candidate.runtime === task.runtime &&
      candidate.scopeKind === task.scopeKind &&
      (normalizeOptionalString(candidate.ownerKey) ?? "") ===
        (normalizeOptionalString(task.ownerKey) ?? "") &&
      (normalizeOptionalString(candidate.childSessionKey) ?? "") ===
        (normalizeOptionalString(task.childSessionKey) ?? ""),
  );
}
function taskLookupPriority(task) {
  return task.runtime === "cli" ? 1 : 0;
}
function pickPreferredRunIdTask(matches) {
  return [...matches].toSorted((left, right) => {
    const priorityDiff = taskLookupPriority(left) - taskLookupPriority(right);
    if (priorityDiff !== 0) return priorityDiff;
    return left.createdAt - right.createdAt;
  })[0];
}
function compareTasksNewestFirst(left, right) {
  const createdAtDiff = right.createdAt - left.createdAt;
  if (createdAtDiff !== 0) return createdAtDiff;
  return (right.insertionIndex ?? 0) - (left.insertionIndex ?? 0);
}
function findExistingTaskForCreate(params) {
  const runId = params.runId?.trim();
  const runScopeMatches = runId
    ? getTasksByRunId(runId).filter((task) => {
        if (
          task.runtime !== params.runtime ||
          task.scopeKind !== params.scopeKind ||
          (normalizeOptionalString(task.ownerKey) ?? "") !==
            (normalizeOptionalString(params.ownerKey) ?? "") ||
          (normalizeOptionalString(task.childSessionKey) ?? "") !==
            (normalizeOptionalString(params.childSessionKey) ?? "")
        )
          return false;
        if (params.runtime === "acp") return true;
        return (
          (normalizeOptionalString(task.parentFlowId) ?? "") ===
          (normalizeOptionalString(params.parentFlowId) ?? "")
        );
      })
    : [];
  const exact = runId
    ? runScopeMatches.find(
        (task) =>
          (normalizeOptionalString(task.label) ?? "") ===
            (normalizeOptionalString(params.label) ?? "") &&
          (normalizeOptionalString(task.task) ?? "") ===
            (normalizeOptionalString(params.task) ?? ""),
      )
    : void 0;
  if (exact) return exact;
  if (!runId || params.runtime !== "acp") return;
  if (runScopeMatches.length === 0) return;
  return pickPreferredRunIdTask(runScopeMatches);
}
function mergeExistingTaskForCreate(existing, params) {
  ensureLinkedTaskFlowRegistryReady(existing);
  const patch = {};
  const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
  const currentDeliveryState = taskDeliveryStates.get(existing.taskId);
  if (requesterOrigin && !currentDeliveryState?.requesterOrigin) {
    if (
      !upsertTaskDeliveryState({
        taskId: existing.taskId,
        requesterOrigin,
        lastNotifiedEventAt: currentDeliveryState?.lastNotifiedEventAt,
      }).requesterOrigin
    )
      return null;
  }
  if (params.sourceId?.trim() && !existing.sourceId?.trim())
    patch.sourceId = params.sourceId.trim();
  if (params.taskKind?.trim() && !existing.taskKind?.trim())
    patch.taskKind = params.taskKind.trim();
  if (params.parentFlowId?.trim() && !existing.parentFlowId?.trim()) {
    assertParentFlowLinkAllowed({
      ownerKey: existing.ownerKey,
      scopeKind: existing.scopeKind,
      parentFlowId: params.parentFlowId,
    });
    patch.parentFlowId = params.parentFlowId.trim();
  }
  if (params.parentTaskId?.trim() && !existing.parentTaskId?.trim())
    patch.parentTaskId = params.parentTaskId.trim();
  if (params.agentId?.trim() && !existing.agentId?.trim()) patch.agentId = params.agentId.trim();
  if (params.requesterAgentId?.trim() && !existing.requesterAgentId?.trim())
    patch.requesterAgentId = params.requesterAgentId.trim();
  const nextLabel = params.label?.trim();
  if (params.preferMetadata) {
    if (nextLabel && (normalizeOptionalString(existing.label) ?? "") !== nextLabel)
      patch.label = nextLabel;
    const nextTask = params.task.trim();
    if (nextTask && (normalizeOptionalString(existing.task) ?? "") !== nextTask)
      patch.task = nextTask;
  } else if (nextLabel && !existing.label?.trim()) patch.label = nextLabel;
  if (params.deliveryStatus === "pending" && existing.deliveryStatus !== "delivered")
    patch.deliveryStatus = "pending";
  const notifyPolicy = ensureNotifyPolicy({
    notifyPolicy: params.notifyPolicy,
    deliveryStatus: params.deliveryStatus,
    ownerKey: existing.ownerKey,
    scopeKind: existing.scopeKind,
  });
  if (notifyPolicy !== existing.notifyPolicy && existing.notifyPolicy === "silent")
    patch.notifyPolicy = notifyPolicy;
  if (params.detail !== void 0) patch.detail = params.detail;
  if (Object.keys(patch).length === 0) return cloneTaskRecord(existing);
  return updateTask(existing.taskId, patch);
}
function resolveTaskAgentId(params) {
  return (
    normalizeOptionalString(params.explicitAgentId) ??
    parseAgentSessionKey(params.childSessionKey)?.agentId ??
    parseAgentSessionKey(params.ownerKey)?.agentId ??
    parseAgentSessionKey(params.requesterSessionKey)?.agentId
  );
}
function resolveTaskRequesterAgentId(params) {
  const explicitRequesterAgentId = normalizeOptionalString(params.explicitRequesterAgentId);
  return (
    (explicitRequesterAgentId ? normalizeAgentId(explicitRequesterAgentId) : void 0) ??
    parseAgentSessionKey(params.ownerKey)?.agentId ??
    parseAgentSessionKey(params.requesterSessionKey)?.agentId
  );
}
function taskTerminalDeliveryIdempotencyKey(task) {
  const outcome = task.status === "succeeded" ? (task.terminalOutcome ?? "default") : "default";
  return `task-terminal:${task.taskId}:${task.status}:${outcome}`;
}
function resolveTaskStateChangeIdempotencyKey(params) {
  if (params.owner.flowId)
    return `flow-event:${params.owner.flowId}:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
  return `task-event:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
}
function resolveTaskTerminalIdempotencyKey(task) {
  const owner = resolveTaskDeliveryOwner(task);
  if (owner.flowId) {
    const outcome = task.status === "succeeded" ? (task.terminalOutcome ?? "default") : "default";
    return `flow-terminal:${owner.flowId}:${task.taskId}:${task.status}:${outcome}`;
  }
  return taskTerminalDeliveryIdempotencyKey(task);
}
function getLinkedFlowForDelivery(task) {
  const flowId = task.parentFlowId?.trim();
  if (!flowId || task.scopeKind !== "session") return;
  const flow = getTaskFlowById(flowId);
  if (!flow) return;
  if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(task.ownerKey)) return;
  return flow;
}
function resolveTaskDeliveryOwner(task) {
  const flow = getLinkedFlowForDelivery(task);
  if (flow)
    return {
      sessionKey: flow.ownerKey.trim(),
      requesterOrigin: normalizeDeliveryContext(
        flow.requesterOrigin ?? taskDeliveryStates.get(task.taskId)?.requesterOrigin,
      ),
      flowId: flow.flowId,
    };
  if (task.scopeKind !== "session") return {};
  return {
    sessionKey: task.ownerKey.trim(),
    requesterOrigin: normalizeDeliveryContext(taskDeliveryStates.get(task.taskId)?.requesterOrigin),
  };
}
function syncManagedFlowCancellationFromTask(task) {
  const flowId = task.parentFlowId?.trim();
  if (!flowId) return;
  let flow = getTaskFlowById(flowId);
  if (
    !flow ||
    flow.syncMode !== "managed" ||
    flow.cancelRequestedAt == null ||
    isTerminalFlowStatus(flow.status)
  )
    return;
  if (listTasksForFlowId(flowId).some(isTaskFlowCancellationPending)) return;
  const endedAt = task.endedAt ?? task.lastEventAt ?? Date.now();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = updateFlowRecordByIdExpectedRevision({
      flowId,
      expectedRevision: flow.revision,
      patch: {
        status: "cancelled",
        blockedTaskId: null,
        blockedSummary: null,
        waitJson: null,
        endedAt,
        updatedAt: endedAt,
      },
    });
    if (result.applied || result.reason === "not_found") return;
    flow = result.current;
    if (
      !flow ||
      flow.syncMode !== "managed" ||
      flow.cancelRequestedAt == null ||
      isTerminalFlowStatus(flow.status)
    )
      return;
    if (listTasksForFlowId(flowId).some(isTaskFlowCancellationPending)) return;
  }
}
function scheduleTaskFlowSyncRetry(task, operation, attempt = 0) {
  const taskId = task.taskId.trim();
  if (!taskId || taskFlowSyncRetryTimers.has(taskId)) return;
  const delayMs = TASK_FLOW_SYNC_RETRY_DELAYS_MS[attempt];
  if (delayMs == null) {
    log.warn("Exhausted parent flow sync retries from task", {
      operation,
      taskId,
      flowId: task.parentFlowId,
    });
    return;
  }
  const retryTimer = setTimeout(() => {
    taskFlowSyncRetryTimers.delete(taskId);
    runWithGatewayIndependentRootWorkAdmission(async () => {
      const current = tasks.get(taskId);
      if (!current) return;
      const flowId = current.parentFlowId?.trim();
      if (!flowId || findLatestTaskForFlowId(flowId)?.taskId !== taskId) return;
      const result = syncFlowFromTaskResult(current);
      if (!result.ok) {
        log.warn("Failed to retry parent flow sync from task", {
          operation,
          taskId,
          flowId: current.parentFlowId,
          reason: result.reason,
        });
        scheduleTaskFlowSyncRetry(current, operation, attempt + 1);
      }
    }).catch((error) => {
      log.warn("Failed to admit parent flow sync retry from task", {
        operation,
        taskId,
        flowId: task.parentFlowId,
        error,
      });
    });
  }, delayMs);
  retryTimer.unref?.();
  taskFlowSyncRetryTimers.set(taskId, retryTimer);
}
function syncFlowFromTaskAfterTaskMutation(task, operation) {
  const result = syncFlowFromTaskResult(task);
  if (result.ok) return;
  log.warn("Failed to sync parent flow from task mutation", {
    operation,
    taskId: task.taskId,
    flowId: task.parentFlowId,
    reason: result.reason,
  });
  scheduleTaskFlowSyncRetry(task, operation);
}
function clearTaskFlowSyncRetries() {
  for (const timer of taskFlowSyncRetryTimers.values()) clearTimeout(timer);
  taskFlowSyncRetryTimers.clear();
}
function restoreTaskRegistryOnce() {
  switch (taskRegistryRestoreState.status) {
    case "ready":
      return;
    case "failed":
      throw taskRegistryRestoreState.error;
    case "restoring":
      throw new Error("Task registry restore is already in progress.");
    case "uninitialized":
      break;
  }
  taskRegistryRestoreState = { status: "restoring" };
  try {
    const restored = getTaskRegistryStore().loadSnapshot();
    const restoredTasks = /* @__PURE__ */ new Map();
    for (const [taskId, task] of restored.tasks.entries())
      restoredTasks.set(taskId, normalizeTaskTimestamps(task));
    const restoredDeliveryStates = new Map(restored.deliveryStates);
    clearTaskRegistryMemory();
    for (const [taskId, task] of restoredTasks.entries()) tasks.set(taskId, task);
    for (const [taskId, state] of restoredDeliveryStates.entries())
      taskDeliveryStates.set(taskId, state);
    rebuildRunIdIndex();
    rebuildOwnerKeyIndex();
    rebuildParentFlowIdIndex();
    rebuildRelatedSessionKeyIndex();
    taskRegistryRestoreState = { status: "ready" };
    if (restoredTasks.size > 0 || restoredDeliveryStates.size > 0)
      emitTaskRegistryObserverEvent(() => ({
        kind: "restored",
        tasks: snapshotTaskRecords(tasks),
      }));
  } catch (error) {
    clearTaskRegistryMemory();
    const message = formatErrorMessage(error);
    const restoreError = new Error(`Task registry restore failed: ${message}`, { cause: error });
    taskRegistryRestoreState = {
      status: "failed",
      error: restoreError,
    };
    log.warn("Failed to restore task registry", {
      error: message,
      consoleMessage: `Failed to restore task registry: ${message}`,
    });
    throw restoreError;
  }
}
function ensureTaskRegistryReady() {
  restoreTaskRegistryOnce();
  ensureListener();
}
function reloadTaskRegistryFromStore() {
  clearTaskRegistryMemory();
  taskRegistryRestoreState = { status: "uninitialized" };
  ensureTaskRegistryReady();
}
function updateTask(taskId, patch) {
  const current = tasks.get(taskId);
  if (!current) return null;
  const next = normalizeTaskTimestamps({
    ...current,
    ...patch,
    ...(patch.detail !== void 0 ? { detail: structuredClone(patch.detail) } : {}),
  });
  if (Object.hasOwn(patch, "error") && patch.error === void 0) delete next.error;
  if (Object.hasOwn(patch, "childSessionKey") && patch.childSessionKey === void 0)
    delete next.childSessionKey;
  if (isTerminalTaskStatus(next.status) && typeof next.cleanupAfter !== "number") {
    const createdAt = next.createdAt ?? Date.now();
    const cleanupAfter = resolveTaskCleanupAfter({
      ...next,
      createdAt,
    });
    Object.assign(next, cleanupAfter === void 0 ? {} : { cleanupAfter });
  }
  const sessionIndexChanged =
    normalizeOptionalString(current.ownerKey) !== normalizeOptionalString(next.ownerKey) ||
    normalizeOptionalString(current.childSessionKey) !==
      normalizeOptionalString(next.childSessionKey);
  const parentFlowIndexChanged = current.parentFlowId?.trim() !== next.parentFlowId?.trim();
  ensureLinkedTaskFlowRegistryReady(current);
  ensureLinkedTaskFlowRegistryReady(next);
  if (!tryPersistTaskUpsert(next, "update")) return null;
  tasks.set(taskId, next);
  if (patch.runId && patch.runId !== current.runId) rebuildRunIdIndex();
  if (sessionIndexChanged) {
    deleteOwnerKeyIndex(taskId, current);
    addOwnerKeyIndex(taskId, next);
    deleteRelatedSessionKeyIndex(taskId, current);
    addRelatedSessionKeyIndex(taskId, next);
  }
  if (parentFlowIndexChanged) {
    deleteParentFlowIdIndex(taskId, current);
    addParentFlowIdIndex(taskId, next);
  }
  syncFlowFromTaskAfterTaskMutation(next, "update");
  try {
    syncManagedFlowCancellationFromTask(next);
  } catch (error) {
    log.warn("Failed to finalize managed flow cancellation from task update", {
      taskId,
      flowId: next.parentFlowId,
      error,
    });
  }
  emitTaskRegistryObserverEvent(() => ({
    kind: "upserted",
    task: cloneTaskRecord(next),
    previous: cloneTaskRecord(current),
  }));
  return cloneTaskRecord(next);
}
function upsertTaskDeliveryState(state) {
  const current = taskDeliveryStates.get(state.taskId);
  const next = {
    taskId: state.taskId,
    ...(state.requesterOrigin
      ? { requesterOrigin: normalizeDeliveryContext(state.requesterOrigin) }
      : {}),
    ...(state.lastNotifiedEventAt != null
      ? { lastNotifiedEventAt: state.lastNotifiedEventAt }
      : {}),
  };
  if (!next.requesterOrigin && typeof next.lastNotifiedEventAt !== "number" && !current)
    return cloneTaskDeliveryState({ taskId: state.taskId });
  if (!tryPersistTaskDeliveryStateUpsert(next))
    return current
      ? cloneTaskDeliveryState(current)
      : cloneTaskDeliveryState({ taskId: state.taskId });
  taskDeliveryStates.set(state.taskId, next);
  return cloneTaskDeliveryState(next);
}
function getTaskDeliveryState(taskId) {
  const state = taskDeliveryStates.get(taskId);
  return state ? cloneTaskDeliveryState(state) : void 0;
}
function canDeliverTaskToRequesterOrigin(task) {
  const owner = resolveTaskDeliveryOwner(task);
  if (shouldRouteCompletionThroughRequesterSession(owner.sessionKey)) return false;
  return canDeliverToRequesterOrigin(owner.requesterOrigin);
}
function canDeliverToRequesterOrigin(origin) {
  const channel = origin?.channel?.trim();
  const to = origin?.to?.trim();
  return Boolean(channel && to && isDeliverableMessageChannel(channel));
}
function canDeliverParentReviewTaskToBoundDiscordThread(task) {
  if (!shouldUseParentReviewTaskTerminalMessage(task)) return false;
  const origin = resolveTaskDeliveryOwner(task).requesterOrigin;
  const channel = origin?.channel?.trim().toLowerCase();
  const to = origin?.to?.trim().toLowerCase();
  const threadId = String(origin?.threadId ?? "").trim();
  return Boolean(
    channel === "discord" &&
    to?.startsWith("channel:") &&
    threadId &&
    canDeliverToRequesterOrigin(origin),
  );
}
function resolveMissingOwnerDeliveryStatus(task) {
  return task.scopeKind === "system" ? "not_applicable" : "parent_missing";
}
function queueTaskSystemEvent(task, text) {
  const owner = resolveTaskDeliveryOwner(task);
  const ownerKey = owner.sessionKey?.trim();
  if (!ownerKey) return false;
  enqueueSystemEvent(text, {
    sessionKey: ownerKey,
    contextKey: `task:${task.taskId}`,
    deliveryContext: owner.requesterOrigin,
  });
  requestHeartbeat({
    source: "background-task",
    intent: "immediate",
    reason: "background-task",
    sessionKey: ownerKey,
  });
  return true;
}
function queueBlockedTaskFollowup(task) {
  const followupText = formatTaskBlockedFollowupMessage(task);
  if (!followupText) return false;
  const owner = resolveTaskDeliveryOwner(task);
  const ownerKey = owner.sessionKey?.trim();
  if (!ownerKey) return false;
  enqueueSystemEvent(followupText, {
    sessionKey: ownerKey,
    contextKey: `task:${task.taskId}:blocked-followup`,
    deliveryContext: owner.requesterOrigin,
  });
  requestHeartbeat({
    source: "background-task-blocked",
    intent: "immediate",
    reason: "background-task-blocked",
    sessionKey: ownerKey,
  });
  return true;
}
async function maybeDeliverTaskTerminalUpdate(taskId) {
  return await runTaskDeliveryWithIndependentAdmission(taskId, async () =>
    maybeDeliverTaskTerminalUpdateUnderAdmission(taskId),
  );
}
async function runTaskDeliveryWithIndependentAdmission(taskId, deliver) {
  ensureTaskRegistryReady();
  let admitted = false;
  try {
    return await runWithGatewayIndependentRootWorkAdmission(async () => {
      admitted = true;
      return await deliver();
    });
  } catch (error) {
    if (!admitted && isGatewayRestartDraining()) {
      ensureTaskRegistryReady();
      const current = tasks.get(taskId);
      return current ? cloneTaskRecord(current) : null;
    }
    throw error;
  }
}
async function maybeDeliverTaskTerminalUpdateUnderAdmission(taskId) {
  ensureTaskRegistryReady();
  const current = tasks.get(taskId);
  if (!current || !shouldAutoDeliverTaskTerminalUpdate(current))
    return current ? cloneTaskRecord(current) : null;
  if (tasksWithPendingDelivery.has(taskId)) return cloneTaskRecord(current);
  tasksWithPendingDelivery.add(taskId);
  try {
    const latest = tasks.get(taskId);
    if (!latest || !shouldAutoDeliverTaskTerminalUpdate(latest))
      return latest ? cloneTaskRecord(latest) : null;
    const peers = latest.runId ? getPeerTasksForDelivery(latest) : [];
    const isSubagentCancellation = latest.runtime === "subagent" && latest.status === "cancelled";
    const preferred = pickPreferredRunIdTask(
      isSubagentCancellation
        ? peers.filter((candidate) => shouldAutoDeliverTaskTerminalUpdate(candidate))
        : peers,
    );
    const peerDeliveryCovered =
      isSubagentCancellation &&
      peers.some(
        (candidate) =>
          candidate.taskId !== latest.taskId &&
          (candidate.deliveryStatus === "delivered" ||
            candidate.deliveryStatus === "session_queued"),
      );
    if (
      shouldSuppressDuplicateTerminalDelivery({
        task: latest,
        preferredTaskId: preferred?.taskId,
        peerDeliveryCovered,
      })
    )
      return updateTask(taskId, {
        deliveryStatus: "not_applicable",
        lastEventAt: Date.now(),
      });
    const owner = resolveTaskDeliveryOwner(latest);
    const ownerSessionKey = owner.sessionKey?.trim();
    if (!ownerSessionKey)
      return updateTask(taskId, {
        deliveryStatus: resolveMissingOwnerDeliveryStatus(latest),
        lastEventAt: Date.now(),
      });
    const shouldRouteParentReview = shouldUseParentReviewTaskTerminalMessage(latest);
    const shouldDeliverParentReviewDirect = canDeliverParentReviewTaskToBoundDiscordThread(latest);
    const canDeliverDirect =
      canDeliverTaskToRequesterOrigin(latest) || shouldDeliverParentReviewDirect;
    const directEventText = formatTaskTerminalMessage(latest);
    const sessionEventText = formatTaskTerminalMessage(
      latest,
      shouldRouteParentReview ? { surface: "parent_session" } : void 0,
    );
    if ((shouldRouteParentReview && !shouldDeliverParentReviewDirect) || !canDeliverDirect)
      try {
        queueTaskSystemEvent(latest, sessionEventText);
        if (latest.terminalOutcome === "blocked") queueBlockedTaskFollowup(latest);
        return updateTask(taskId, {
          deliveryStatus:
            shouldRouteParentReview && canDeliverDirect ? "pending" : "session_queued",
          lastEventAt: Date.now(),
        });
      } catch (error) {
        log.warn("Failed to queue background task session delivery", {
          taskId,
          ownerKey: latest.ownerKey,
          error,
        });
        return updateTask(taskId, {
          deliveryStatus: "failed",
          lastEventAt: Date.now(),
        });
      }
    try {
      const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
      const beforeSend = tasks.get(taskId);
      if (!beforeSend || !shouldAutoDeliverTaskTerminalUpdate(beforeSend))
        return beforeSend ? cloneTaskRecord(beforeSend) : null;
      const requesterAgentId = parseAgentSessionKey(ownerSessionKey)?.agentId;
      const idempotencyKey = resolveTaskTerminalIdempotencyKey(latest);
      await sendMessage({
        channel: owner.requesterOrigin?.channel,
        to: owner.requesterOrigin?.to ?? "",
        accountId: owner.requesterOrigin?.accountId,
        threadId: owner.requesterOrigin?.threadId,
        content: shouldDeliverParentReviewDirect ? sessionEventText : directEventText,
        agentId: requesterAgentId,
        idempotencyKey,
        mirror: {
          sessionKey: ownerSessionKey,
          agentId: requesterAgentId,
          idempotencyKey,
        },
      });
      const afterSend = tasks.get(taskId);
      if (!afterSend || !shouldAutoDeliverTaskTerminalUpdate(afterSend))
        return afterSend ? cloneTaskRecord(afterSend) : null;
      if (afterSend.terminalOutcome === "blocked") queueBlockedTaskFollowup(afterSend);
      return updateTask(taskId, {
        deliveryStatus: "delivered",
        lastEventAt: Date.now(),
      });
    } catch (error) {
      log.warn("Failed to deliver background task update", {
        taskId,
        ownerKey: ownerSessionKey,
        requesterOrigin: owner.requesterOrigin,
        error,
      });
      const beforeFallback = tasks.get(taskId);
      if (!beforeFallback || !shouldAutoDeliverTaskTerminalUpdate(beforeFallback))
        return beforeFallback ? cloneTaskRecord(beforeFallback) : null;
      try {
        queueTaskSystemEvent(beforeFallback, sessionEventText);
        if (beforeFallback.terminalOutcome === "blocked") queueBlockedTaskFollowup(beforeFallback);
      } catch (fallbackError) {
        log.warn("Failed to queue background task fallback event", {
          taskId,
          ownerKey: latest.ownerKey,
          error: fallbackError,
        });
      }
      return updateTask(taskId, {
        deliveryStatus: "failed",
        lastEventAt: Date.now(),
      });
    }
  } finally {
    tasksWithPendingDelivery.delete(taskId);
  }
}
async function maybeDeliverTaskStateChangeUpdate(taskId, latestEvent) {
  return await runTaskDeliveryWithIndependentAdmission(taskId, async () =>
    maybeDeliverTaskStateChangeUpdateUnderAdmission(taskId, latestEvent),
  );
}
async function maybeDeliverTaskStateChangeUpdateUnderAdmission(taskId, latestEvent) {
  ensureTaskRegistryReady();
  const current = tasks.get(taskId);
  if (!current || !shouldAutoDeliverTaskStateChange(current))
    return current ? cloneTaskRecord(current) : null;
  const deliveryState = getTaskDeliveryState(taskId);
  if (!latestEvent || (deliveryState?.lastNotifiedEventAt ?? 0) >= latestEvent.at)
    return cloneTaskRecord(current);
  const eventText = formatTaskStateChangeMessage(current, latestEvent);
  if (!eventText) return cloneTaskRecord(current);
  try {
    const owner = resolveTaskDeliveryOwner(current);
    const ownerSessionKey = owner.sessionKey?.trim();
    if (!ownerSessionKey)
      return updateTask(taskId, {
        deliveryStatus: resolveMissingOwnerDeliveryStatus(current),
        lastEventAt: Date.now(),
      });
    if (!canDeliverTaskToRequesterOrigin(current)) {
      queueTaskSystemEvent(current, eventText);
      upsertTaskDeliveryState({
        taskId,
        requesterOrigin: deliveryState?.requesterOrigin,
        lastNotifiedEventAt: latestEvent.at,
      });
      return updateTask(taskId, { lastEventAt: Date.now() });
    }
    const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
    const requesterAgentId = parseAgentSessionKey(ownerSessionKey)?.agentId;
    const idempotencyKey = resolveTaskStateChangeIdempotencyKey({
      task: current,
      latestEvent,
      owner,
    });
    await sendMessage({
      channel: owner.requesterOrigin?.channel,
      to: owner.requesterOrigin?.to ?? "",
      accountId: owner.requesterOrigin?.accountId,
      threadId: owner.requesterOrigin?.threadId,
      content: eventText,
      agentId: requesterAgentId,
      idempotencyKey,
      mirror: {
        sessionKey: ownerSessionKey,
        agentId: requesterAgentId,
        idempotencyKey,
      },
    });
    upsertTaskDeliveryState({
      taskId,
      requesterOrigin: deliveryState?.requesterOrigin,
      lastNotifiedEventAt: latestEvent.at,
    });
    return updateTask(taskId, { lastEventAt: Date.now() });
  } catch (error) {
    log.warn("Failed to deliver background task state change", {
      taskId,
      ownerKey: current.ownerKey,
      error,
    });
    return cloneTaskRecord(current);
  }
}
function setTaskCleanupAfterById(params) {
  ensureTaskRegistryReady();
  return updateTask(params.taskId, { cleanupAfter: params.cleanupAfter });
}
function markTaskTerminalById(params) {
  ensureTaskRegistryReady();
  const patch = {
    status: params.status,
    ...(params.childSessionKey !== void 0
      ? { childSessionKey: params.childSessionKey?.trim() || void 0 }
      : {}),
    endedAt: params.endedAt,
    lastEventAt: params.lastEventAt ?? params.endedAt,
    ...(params.terminalSummary !== void 0
      ? {
          terminalSummary: params.preserveTerminalSummary
            ? (params.terminalSummary ?? void 0)
            : normalizeTaskSummary(params.terminalSummary),
        }
      : {}),
    ...(params.terminalOutcome !== void 0
      ? {
          terminalOutcome: resolveTaskTerminalOutcome({
            status: params.status,
            terminalOutcome: params.terminalOutcome,
          }),
        }
      : {}),
    ...(params.detail !== void 0 ? { detail: structuredClone(params.detail) } : {}),
  };
  if (Object.hasOwn(params, "error")) patch.error = params.error;
  return updateTask(params.taskId, patch);
}
function markTaskLostById(params) {
  ensureTaskRegistryReady();
  return updateTask(params.taskId, {
    status: "lost",
    endedAt: params.endedAt,
    lastEventAt: params.lastEventAt ?? params.endedAt,
    ...(params.error !== void 0 ? { error: params.error } : {}),
    ...(params.cleanupAfter !== void 0 ? { cleanupAfter: params.cleanupAfter } : {}),
  });
}
function updateTasksByRunId(params) {
  const matches = getTasksByRunScope(params);
  if (matches.length === 0) return [];
  const updated = [];
  for (const match of matches) {
    const task = updateTask(match.taskId, params.patch);
    if (task) updated.push(task);
  }
  return updated;
}
function ensureListener() {
  if (listenerStarted) return;
  listenerStarted = true;
  onAgentEvent((evt) => {
    restoreTaskRegistryOnce();
    const scopedTasks = getTasksByRunScope({
      runId: evt.runId,
      sessionKey: evt.sessionKey,
    });
    if (scopedTasks.length === 0) return;
    const now = evt.ts || Date.now();
    for (const current of scopedTasks) {
      if (isTerminalTaskStatus(current.status)) continue;
      const patch = { lastEventAt: now };
      if (evt.stream === "lifecycle") {
        const phase = typeof evt.data?.phase === "string" ? evt.data.phase : void 0;
        const startedAt =
          typeof evt.data?.startedAt === "number" ? evt.data.startedAt : current.startedAt;
        const endedAt = typeof evt.data?.endedAt === "number" ? evt.data.endedAt : void 0;
        if (startedAt) patch.startedAt = startedAt;
        if (phase === "start") patch.status = "running";
        else if (phase === "end") {
          const terminal = buildTaskLifecycleTerminalOutcome({
            phase,
            data: evt.data,
            startedAt,
            endedAt: endedAt ?? now,
          });
          patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
          patch.endedAt = terminal.endedAt ?? now;
          const error = resolveTaskLifecycleTerminalError({
            runtime: current.runtime,
            status: patch.status,
            error: terminal.error,
          });
          if (error) patch.error = error;
        } else if (phase === "error") {
          const terminal = buildTaskLifecycleTerminalOutcome({
            phase,
            data: evt.data,
            startedAt,
            endedAt: endedAt ?? now,
          });
          patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
          patch.endedAt = terminal.endedAt ?? now;
          patch.error =
            resolveTaskLifecycleTerminalError({
              runtime: current.runtime,
              status: patch.status,
              error: terminal.error,
            }) ?? current.error;
        }
      } else if (evt.stream === "error")
        patch.error = typeof evt.data?.error === "string" ? evt.data.error : current.error;
      else if (evt.stream === "tool" && evt.data?.phase === "start") {
        const toolName = typeof evt.data.name === "string" ? evt.data.name.trim() : "";
        if (toolName) {
          patch.toolUseCount = (current.toolUseCount ?? 0) + 1;
          patch.lastToolName = toolName;
        }
      }
      const stateChangeEvent =
        patch.status && patch.status !== current.status
          ? appendTaskEvent({
              at: now,
              kind: patch.status,
              summary:
                patch.status === "failed"
                  ? (patch.error ?? current.error)
                  : patch.status === "succeeded"
                    ? current.terminalSummary
                    : void 0,
            })
          : void 0;
      if (updateTask(current.taskId, patch)) {
        maybeDeliverTaskStateChangeUpdate(current.taskId, stateChangeEvent);
        maybeDeliverTaskTerminalUpdate(current.taskId);
      }
    }
  });
}
function createTaskRecord(params) {
  ensureTaskRegistryReady();
  const requesterSessionKey = resolveTaskRequesterSessionKey(params);
  const scopeKind = resolveTaskScopeKind({
    scopeKind: params.scopeKind,
    requesterSessionKey,
  });
  const ownerKey = resolveTaskOwnerKey({
    requesterSessionKey,
    ownerKey: params.ownerKey,
  });
  const agentId = resolveTaskAgentId({
    explicitAgentId: params.agentId,
    childSessionKey: params.childSessionKey,
    ownerKey,
    requesterSessionKey,
  });
  const requesterAgentId = resolveTaskRequesterAgentId({
    explicitRequesterAgentId: params.requesterAgentId,
    ownerKey,
    requesterSessionKey,
  });
  assertTaskOwner({
    ownerKey,
    scopeKind,
  });
  assertParentFlowLinkAllowed({
    ownerKey,
    scopeKind,
    parentFlowId: params.parentFlowId,
  });
  const existing = findExistingTaskForCreate({
    runtime: params.runtime,
    ownerKey,
    scopeKind,
    childSessionKey: params.childSessionKey,
    parentFlowId: params.parentFlowId,
    runId: params.runId,
    label: params.label,
    task: params.task,
  });
  if (existing)
    return mergeExistingTaskForCreate(existing, {
      ...params,
      agentId,
    });
  const now = Date.now();
  const taskId = crypto.randomUUID();
  const status = normalizeTaskStatus(params.status);
  const deliveryStatus =
    params.deliveryStatus ??
    ensureDeliveryStatus({
      ownerKey,
      scopeKind,
    });
  const notifyPolicy = ensureNotifyPolicy({
    notifyPolicy: params.notifyPolicy,
    deliveryStatus,
    ownerKey,
    scopeKind,
  });
  const lastEventAt = params.lastEventAt ?? params.startedAt ?? now;
  const record = normalizeTaskTimestamps({
    taskId,
    runtime: params.runtime,
    taskKind: normalizeOptionalString(params.taskKind),
    sourceId: normalizeOptionalString(params.sourceId),
    requesterSessionKey,
    ownerKey,
    scopeKind,
    childSessionKey: params.childSessionKey,
    parentFlowId: normalizeOptionalString(params.parentFlowId),
    parentTaskId: normalizeOptionalString(params.parentTaskId),
    agentId,
    requesterAgentId,
    runId: normalizeOptionalString(params.runId),
    label: normalizeOptionalString(params.label),
    task: params.task,
    status,
    deliveryStatus,
    notifyPolicy,
    createdAt: now,
    startedAt: params.startedAt,
    lastEventAt,
    cleanupAfter: params.cleanupAfter,
    progressSummary: normalizeTaskSummary(params.progressSummary),
    terminalSummary: normalizeTaskSummary(params.terminalSummary),
    terminalOutcome: resolveTaskTerminalOutcome({
      status,
      terminalOutcome: params.terminalOutcome,
    }),
    ...(params.detail !== void 0 ? { detail: structuredClone(params.detail) } : {}),
  });
  if (isTerminalTaskStatus(record.status) && typeof record.cleanupAfter !== "number") {
    const cleanupAfter = resolveTaskCleanupAfter(record);
    Object.assign(record, cleanupAfter === void 0 ? {} : { cleanupAfter });
  }
  const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
  const deliveryState = requesterOrigin
    ? {
        taskId,
        requesterOrigin,
      }
    : void 0;
  if (!tryPersistTaskUpsert(record, "create", deliveryState)) return null;
  tasks.set(taskId, record);
  if (requesterOrigin) taskDeliveryStates.set(taskId, deliveryState);
  addRunIdIndex(taskId, record.runId);
  addOwnerKeyIndex(taskId, record);
  addParentFlowIdIndex(taskId, record);
  addRelatedSessionKeyIndex(taskId, record);
  syncFlowFromTaskAfterTaskMutation(record, "create");
  emitTaskRegistryObserverEvent(() => ({
    kind: "upserted",
    task: cloneTaskRecord(record),
  }));
  if (isTerminalTaskStatus(record.status)) maybeDeliverTaskTerminalUpdate(taskId);
  return cloneTaskRecord(record);
}
function updateTaskStateByRunId(params) {
  ensureTaskRegistryReady();
  const matches = getTasksByRunScope(params);
  if (matches.length === 0) return [];
  const updated = [];
  for (const current of matches) {
    const patch = {};
    const nextStatus = params.status ? normalizeTaskStatus(params.status) : current.status;
    if (
      params.status &&
      !shouldApplyRunScopedStatusUpdate({
        currentStatus: current.status,
        currentRuntime: current.runtime,
        currentChildSessionKey: current.childSessionKey,
        currentError: current.error,
        currentEndedAt: current.endedAt,
        nextStatus,
        nextError: params.error,
        nextEndedAt: params.endedAt,
      })
    )
      continue;
    const eventAt = params.lastEventAt ?? params.endedAt ?? Date.now();
    if (params.status) patch.status = normalizeTaskStatus(params.status);
    if (params.startedAt != null) patch.startedAt = params.startedAt;
    if (params.endedAt != null) patch.endedAt = params.endedAt;
    if (params.lastEventAt != null) patch.lastEventAt = params.lastEventAt;
    if (params.childSessionKey !== void 0)
      patch.childSessionKey = params.childSessionKey?.trim() || void 0;
    if (params.clearError) patch.error = void 0;
    else if (
      current.status === "cancelled" &&
      nextStatus !== "cancelled" &&
      params.error === void 0
    )
      patch.error = void 0;
    else if (params.error !== void 0) patch.error = params.error;
    if (params.progressSummary !== void 0)
      patch.progressSummary = normalizeTaskSummary(params.progressSummary);
    if (params.terminalSummary !== void 0)
      patch.terminalSummary = params.preserveTerminalSummary
        ? (params.terminalSummary ?? void 0)
        : normalizeTaskSummary(params.terminalSummary);
    if (params.terminalOutcome !== void 0)
      patch.terminalOutcome = resolveTaskTerminalOutcome({
        status: nextStatus,
        terminalOutcome: params.terminalOutcome,
      });
    if (params.detail !== void 0) patch.detail = params.detail;
    if (params.suppressDelivery) patch.deliveryStatus = "not_applicable";
    const eventSummary =
      normalizeTaskSummary(params.eventSummary) ??
      (nextStatus === "failed"
        ? normalizeTaskSummary(params.error ?? current.error)
        : nextStatus === "succeeded"
          ? normalizeTaskSummary(params.terminalSummary ?? current.terminalSummary)
          : void 0);
    const nextEvent =
      (params.status && params.status !== current.status) ||
      Boolean(normalizeTaskSummary(params.eventSummary))
        ? appendTaskEvent({
            at: eventAt,
            kind:
              params.status && normalizeTaskStatus(params.status) !== current.status
                ? normalizeTaskStatus(params.status)
                : "progress",
            summary: eventSummary,
          })
        : void 0;
    const task = updateTask(current.taskId, patch);
    if (task) {
      updated.push(task);
      if (!params.suppressDelivery) {
        maybeDeliverTaskStateChangeUpdate(task.taskId, nextEvent);
        maybeDeliverTaskTerminalUpdate(task.taskId);
      }
    }
  }
  return updated;
}
function updateTaskDeliveryByRunId(params) {
  ensureTaskRegistryReady();
  const patch = { deliveryStatus: params.deliveryStatus };
  if (params.error !== void 0) patch.error = params.error;
  return updateTasksByRunId({
    runId: params.runId,
    runtime: params.runtime,
    sessionKey: params.sessionKey,
    patch,
  });
}
function markTaskRunningByRunId(params) {
  return updateTaskStateByRunId({
    runId: params.runId,
    runtime: params.runtime,
    sessionKey: params.sessionKey,
    status: "running",
    startedAt: params.startedAt,
    lastEventAt: params.lastEventAt,
    progressSummary: params.progressSummary,
    eventSummary: params.eventSummary,
  });
}
function recordTaskProgressByRunId(params) {
  return updateTaskStateByRunId({
    runId: params.runId,
    runtime: params.runtime,
    sessionKey: params.sessionKey,
    lastEventAt: params.lastEventAt,
    progressSummary: params.progressSummary,
    eventSummary: params.eventSummary,
  });
}
function finalizeTaskRunByRunId(params) {
  return updateTaskStateByRunId({
    runId: params.runId,
    runtime: params.runtime,
    sessionKey: params.sessionKey,
    childSessionKey: params.childSessionKey,
    status: params.status,
    startedAt: params.startedAt,
    endedAt: params.endedAt,
    lastEventAt: params.lastEventAt,
    error: params.error,
    clearError: params.clearError,
    progressSummary: params.progressSummary,
    terminalSummary: params.terminalSummary,
    preserveTerminalSummary: params.preserveTerminalSummary,
    terminalOutcome: params.terminalOutcome,
    detail: params.detail,
    suppressDelivery: params.suppressDelivery,
  });
}
function setTaskRunDeliveryStatusByRunId(params) {
  return updateTaskDeliveryByRunId(params);
}
function updateTaskNotifyPolicyById(params) {
  ensureTaskRegistryReady();
  return updateTask(params.taskId, {
    notifyPolicy: params.notifyPolicy,
    lastEventAt: Date.now(),
  });
}
function linkTaskToFlowById(params) {
  ensureTaskRegistryReady();
  const flowId = params.flowId.trim();
  if (!flowId) return null;
  const current = tasks.get(params.taskId);
  if (!current) return null;
  if (current.parentFlowId?.trim()) return cloneTaskRecord(current);
  assertParentFlowLinkAllowed({
    ownerKey: current.ownerKey,
    scopeKind: current.scopeKind,
    parentFlowId: flowId,
  });
  return updateTask(params.taskId, { parentFlowId: flowId });
}
async function cancelTaskById(params) {
  ensureTaskRegistryReady();
  const task = tasks.get(params.taskId.trim());
  if (!task)
    return {
      found: false,
      cancelled: false,
      reason: "Task not found.",
    };
  const requestedReason = params.reason?.trim();
  const cancellationError =
    requestedReason && requestedReason !== "Subagent run killed."
      ? requestedReason
      : "Cancelled by operator.";
  let isProvisionalSubagentKill =
    task.runtime === "subagent" &&
    task.status === "cancelled" &&
    task.error === "Subagent run killed.";
  if (
    !isProvisionalSubagentKill &&
    (task.status === "succeeded" ||
      task.status === "failed" ||
      task.status === "timed_out" ||
      task.status === "lost" ||
      task.status === "cancelled")
  )
    return {
      found: true,
      cancelled: false,
      reason: "Task is already terminal.",
      task: cloneTaskRecord(task),
    };
  const childSessionKey = task.childSessionKey?.trim();
  try {
    ensureTaskCancellationReady(task);
    if (task.runtime !== "cli") {
      if (task.runtime === "cron") {
        const { cancelActiveCronTaskRun } = await loadTaskRegistryControlRuntime();
        if (
          !cancelActiveCronTaskRun({
            runId: task.runId,
            reason: params.reason?.trim() || "Cancelled by operator.",
          })
        ) {
          if (childSessionKey)
            return {
              found: true,
              cancelled: false,
              reason: "Cron task has no active cancellation handle.",
              task: cloneTaskRecord(task),
            };
        }
      } else if (!childSessionKey) {
        if (!isChildlessNativeSubagentTask(task))
          return {
            found: true,
            cancelled: false,
            reason: "Task has no cancellable child session.",
            task: cloneTaskRecord(task),
          };
      }
      if (task.runtime === "cron") {
      } else if (!childSessionKey) {
      } else if (task.runtime === "acp") {
        const { getAcpSessionManager } = await loadTaskRegistryControlRuntime();
        await getAcpSessionManager().cancelSession({
          cfg: params.cfg,
          sessionKey: childSessionKey,
          reason: params.reason?.trim() || "task-cancel",
        });
      } else if (task.runtime === "subagent") {
        const { killSubagentRunAdmin } = await loadTaskRegistryControlRuntime();
        const result = await killSubagentRunAdmin({
          cfg: params.cfg,
          sessionKey: childSessionKey,
        });
        const current = tasks.get(task.taskId);
        if (current?.status === "cancelled" && current.error === "Subagent run killed.")
          isProvisionalSubagentKill = true;
        if (current?.status === "succeeded")
          return {
            found: true,
            cancelled: false,
            reason: "Subagent completed while cancellation was in progress.",
            task: cloneTaskRecord(current),
          };
        if (current && isTerminalTaskStatus(current.status) && current.status !== "cancelled")
          return {
            found: true,
            cancelled: false,
            reason: `Subagent became ${current.status} while cancellation was in progress.`,
            task: cloneTaskRecord(current),
          };
        if (current?.status === "cancelled" && !isProvisionalSubagentKill)
          return {
            found: true,
            cancelled: false,
            reason: "Subagent was cancelled while cancellation was in progress.",
            task: cloneTaskRecord(current),
          };
        if (result.found && result.targetState?.state === "terminal") {
          const reconciled = finalizeTaskRunByRunId({
            runId: task.runId?.trim() || result.runId,
            runtime: "subagent",
            sessionKey: childSessionKey,
            ...result.targetState.task,
          }).find((candidate) => candidate.taskId === task.taskId);
          if (!reconciled)
            return {
              found: true,
              cancelled: false,
              reason: "Subagent became terminal, but task state reconciliation failed to persist.",
              task: cloneTaskRecord(tasks.get(task.taskId) ?? task),
            };
          if (
            result.targetState.task.status === "cancelled" &&
            result.targetState.task.error === "Subagent run killed."
          )
            isProvisionalSubagentKill = true;
          else
            return {
              found: true,
              cancelled: false,
              reason:
                result.targetState.task.status === "succeeded"
                  ? "Subagent completed while cancellation was in progress."
                  : `Subagent became ${result.targetState.task.status} while cancellation was in progress.`,
              task: cloneTaskRecord(reconciled),
            };
        }
        if (result.found && result.targetState?.state === "finalizing")
          return {
            found: true,
            cancelled: false,
            reason: "Subagent completion is still being finalized.",
            task: cloneTaskRecord(current ?? task),
          };
        if ((!result.found || !result.killed) && !isProvisionalSubagentKill)
          return {
            found: true,
            cancelled: false,
            reason: result.found ? "Subagent was not running." : "Subagent task not found.",
            task: cloneTaskRecord(current ?? task),
          };
      } else
        return {
          found: true,
          cancelled: false,
          reason: "Task runtime does not support cancellation yet.",
          task: cloneTaskRecord(task),
        };
    }
    const eventAt = Date.now();
    const current = tasks.get(task.taskId) ?? task;
    const endedAt = isProvisionalSubagentKill ? (current.endedAt ?? eventAt) : eventAt;
    const updated =
      (task.runtime === "acp" || task.runtime === "subagent") && task.runId?.trim()
        ? (updateTaskStateByRunId({
            runId: task.runId,
            runtime: task.runtime,
            sessionKey: childSessionKey,
            status: "cancelled",
            endedAt,
            lastEventAt: eventAt,
            error: cancellationError,
          }).find((record) => record.taskId === task.taskId) ?? null)
        : updateTask(task.taskId, {
            status: "cancelled",
            endedAt,
            lastEventAt: eventAt,
            error: cancellationError,
          });
    if (!updated)
      return {
        found: true,
        cancelled: false,
        reason: "Task persistence failed.",
        task: cloneTaskRecord(task),
      };
    if (updated) maybeDeliverTaskTerminalUpdate(updated.taskId);
    return {
      found: true,
      cancelled: true,
      task: updated ?? cloneTaskRecord(task),
    };
  } catch (error) {
    return {
      found: true,
      cancelled: false,
      reason: formatErrorMessage(error),
      task: cloneTaskRecord(task),
    };
  }
}
function assertTaskCancellationReadyById(taskId) {
  ensureTaskRegistryReady();
  const task = tasks.get(taskId.trim());
  if (!task) return null;
  if (!isTerminalTaskStatus(task.status) || isProvisionalSubagentKillTask(task))
    ensureTaskCancellationReady(task);
  return cloneTaskRecord(task);
}
function listTaskRecordsUnsorted() {
  ensureTaskRegistryReady();
  return snapshotTaskRecords(tasks);
}
function listTaskRecords() {
  ensureTaskRegistryReady();
  return [...tasks.values()]
    .map((task, insertionIndex) => Object.assign({}, cloneTaskRecord(task), { insertionIndex }))
    .toSorted(compareTasksNewestFirst)
    .map(({ insertionIndex: _, ...task }) => task);
}
function hasActiveTaskForChildSessionKey(params) {
  ensureTaskRegistryReady();
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!sessionKey) return false;
  const ids = taskIdsByRelatedSessionKey.get(sessionKey);
  if (!ids) return false;
  for (const taskId of ids) {
    if (taskId === params.excludeTaskId) continue;
    const task = tasks.get(taskId);
    if (
      task &&
      isActiveTaskStatus(task.status) &&
      normalizeOptionalString(task.childSessionKey) === sessionKey
    )
      return true;
  }
  return false;
}
function getTaskById(taskId) {
  ensureTaskRegistryReady();
  const task = tasks.get(taskId.trim());
  return task ? cloneTaskRecord(task) : void 0;
}
function findTaskByRunId(runId) {
  ensureTaskRegistryReady();
  const task = pickPreferredRunIdTask(getTasksByRunId(runId));
  return task ? cloneTaskRecord(task) : void 0;
}
function listTasksFromIndex(index, key) {
  const ids = index.get(key);
  if (!ids || ids.size === 0) return [];
  return [...ids]
    .map((taskId, insertionIndex) => {
      const task = tasks.get(taskId);
      return task ? Object.assign({}, cloneTaskRecord(task), { insertionIndex }) : null;
    })
    .filter((task) => Boolean(task))
    .toSorted(compareTasksNewestFirst)
    .map(({ insertionIndex: _, ...task }) => task);
}
function listTasksForSessionKey(sessionKey) {
  ensureTaskRegistryReady();
  const key = normalizeOptionalString(sessionKey);
  if (!key) return [];
  return listTasksFromIndex(taskIdsByRelatedSessionKey, key);
}
function listTasksForAgentId(agentId) {
  ensureTaskRegistryReady();
  const lookup = agentId.trim();
  if (!lookup) return [];
  return snapshotTaskRecords(tasks)
    .filter((task) => task.agentId?.trim() === lookup)
    .toSorted(compareTasksNewestFirst);
}
function findLatestTaskForFlowId(flowId) {
  const task = listTasksForFlowId(flowId)[0];
  return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForOwnerKey(ownerKey) {
  ensureTaskRegistryReady();
  const key = normalizeOptionalString(ownerKey);
  if (!key) return [];
  return listTasksFromIndex(taskIdsByOwnerKey, key);
}
function listFreshTasksForOwnerKey(ownerKey) {
  ensureTaskRegistryReady();
  const key = normalizeOptionalString(ownerKey);
  if (!key) return [];
  const store = getTaskRegistryStore();
  if (store.listTasksForOwnerKey)
    try {
      const merged = /* @__PURE__ */ new Map();
      for (const task of store.listTasksForOwnerKey(key))
        merged.set(task.taskId, cloneTaskRecord(normalizeTaskTimestamps(task)));
      return [...merged.values()]
        .map((task, insertionIndex) => Object.assign({}, task, { insertionIndex }))
        .toSorted(compareTasksNewestFirst)
        .map(({ insertionIndex: _, ...task }) => task);
    } catch (error) {
      log.warn("Failed to read fresh owner task registry records", {
        ownerKey: key,
        error,
      });
    }
  return listTasksFromIndex(taskIdsByOwnerKey, key);
}
function listTasksForFlowId(flowId) {
  ensureTaskRegistryReady();
  const key = flowId.trim();
  if (!key) return [];
  return listTasksFromIndex(taskIdsByParentFlowId, key);
}
function findLatestTaskForRelatedSessionKey(sessionKey) {
  const task = listTasksForRelatedSessionKey(sessionKey)[0];
  return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForRelatedSessionKey(sessionKey) {
  ensureTaskRegistryReady();
  const key = normalizeOptionalString(sessionKey);
  if (!key) return [];
  return listTasksFromIndex(taskIdsByRelatedSessionKey, key);
}
function resolveTaskForLookupToken(token) {
  const lookup = token.trim();
  if (!lookup) return;
  return (
    getTaskById(lookup) ?? findTaskByRunId(lookup) ?? findLatestTaskForRelatedSessionKey(lookup)
  );
}
function deleteTaskRecordById(taskId) {
  ensureTaskRegistryReady();
  const current = tasks.get(taskId);
  if (!current) return false;
  ensureLinkedTaskFlowRegistryReady(current);
  if (!tryPersistTaskDelete(taskId)) return false;
  deleteOwnerKeyIndex(taskId, current);
  deleteParentFlowIdIndex(taskId, current);
  deleteRelatedSessionKeyIndex(taskId, current);
  tasks.delete(taskId);
  taskDeliveryStates.delete(taskId);
  rebuildRunIdIndex();
  emitTaskRegistryObserverEvent(() => ({
    kind: "deleted",
    taskId: current.taskId,
    previous: cloneTaskRecord(current),
  }));
  return true;
}
//#endregion
export {
  isTerminalTaskStatus as A,
  failFlow as B,
  maybeDeliverTaskTerminalUpdate as C,
  setTaskCleanupAfterById as D,
  resolveTaskForLookupToken as E,
  SUBAGENT_KILL_TASK_ERROR as F,
  listTaskFlowRecords as G,
  finishFlow as H,
  createManagedTaskFlow as I,
  requestFlowCancel as J,
  listTaskFlowsForOwnerKey as K,
  createTaskFlowForTask as L,
  isTaskFlowCancellationPending as M,
  isChildlessNativeSubagentTask as N,
  setTaskRunDeliveryStatusByRunId as O,
  resolveChildlessNativeSubagentTaskDefinition as P,
  updateFlowRecordByIdExpectedRevision as Q,
  deleteTaskFlowRecordById as R,
  markTaskTerminalById as S,
  reloadTaskRegistryFromStore as T,
  getTaskFlowById as U,
  findLatestTaskFlowForOwnerKey as V,
  getTaskFlowRegistryRestoreFailure as W,
  resumeFlow as X,
  resolveTaskFlowForLookupToken as Y,
  setFlowWaiting as Z,
  listTasksForOwnerKey as _,
  ensureTaskRegistryReady as a,
  markTaskLostById as b,
  getTaskById as c,
  linkTaskToFlowById as d,
  listFreshTasksForOwnerKey as f,
  listTasksForFlowId as g,
  listTasksForAgentId as h,
  deleteTaskRecordById as i,
  isProvisionalSubagentKillTask as j,
  updateTaskNotifyPolicyById as k,
  hasActiveTaskForChildSessionKey as l,
  listTaskRecordsUnsorted as m,
  cancelTaskById as n,
  finalizeTaskRunByRunId as o,
  listTaskRecords as p,
  reloadTaskFlowRegistryFromStore as q,
  createTaskRecord as r,
  findTaskByRunId as s,
  assertTaskCancellationReadyById as t,
  isParentFlowLinkError as u,
  listTasksForRelatedSessionKey as v,
  recordTaskProgressByRunId as w,
  markTaskRunningByRunId as x,
  listTasksForSessionKey as y,
  ensureTaskFlowRegistryReady as z,
};
