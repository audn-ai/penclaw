import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import "./utils-DtcDeqWS.js";
import {
  A as assertSqliteTableIntegrity,
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  m as normalizeSqliteNumber,
  r as closeOpenClawStateDatabase,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DLqNjJHV.js";
//#region src/tasks/task-registry.sqlite.shared.ts
function parseSqliteJsonValue(raw) {
  if (!raw?.trim()) return;
  try {
    return JSON.parse(raw);
  } catch {
    return;
  }
}
function parseDeliveryContextJson(raw) {
  const parsed = parseSqliteJsonValue(raw);
  if (!isRecord(parsed)) return;
  return normalizeDeliveryContext({
    channel: typeof parsed.channel === "string" ? parsed.channel : void 0,
    to: typeof parsed.to === "string" ? parsed.to : void 0,
    accountId: typeof parsed.accountId === "string" ? parsed.accountId : void 0,
    threadId:
      typeof parsed.threadId === "string" || typeof parsed.threadId === "number"
        ? parsed.threadId
        : void 0,
  });
}
//#endregion
//#region src/tasks/task-registry.types.ts
const TASK_RUNTIMES = /* @__PURE__ */ new Set(["subagent", "acp", "cli", "cron"]);
const TASK_STATUSES = /* @__PURE__ */ new Set([
  "queued",
  "running",
  "succeeded",
  "failed",
  "timed_out",
  "cancelled",
  "lost",
]);
const TASK_DELIVERY_STATUSES = /* @__PURE__ */ new Set([
  "pending",
  "delivered",
  "session_queued",
  "failed",
  "parent_missing",
  "not_applicable",
]);
const TASK_NOTIFY_POLICIES = /* @__PURE__ */ new Set(["done_only", "state_changes", "silent"]);
const TASK_TERMINAL_OUTCOMES = /* @__PURE__ */ new Set(["succeeded", "blocked"]);
const TASK_SCOPE_KINDS = /* @__PURE__ */ new Set(["session", "system"]);
function parsePersistedTaskValue(value, values, label) {
  if (typeof value === "string" && values.has(value)) return value;
  throw new Error(`Invalid persisted task ${label}: ${JSON.stringify(value)}`);
}
function parseTaskRuntime(value) {
  return parsePersistedTaskValue(value, TASK_RUNTIMES, "runtime");
}
function parseTaskStatus(value) {
  return parsePersistedTaskValue(value, TASK_STATUSES, "status");
}
function parseTaskDeliveryStatus(value) {
  return parsePersistedTaskValue(value, TASK_DELIVERY_STATUSES, "delivery status");
}
function parseTaskNotifyPolicy(value) {
  return parsePersistedTaskValue(value, TASK_NOTIFY_POLICIES, "notify policy");
}
function parseTaskScopeKind(value) {
  return parsePersistedTaskValue(value, TASK_SCOPE_KINDS, "scope kind");
}
function parseOptionalTaskTerminalOutcome(value) {
  if (value == null || value === "") return;
  return parsePersistedTaskValue(value, TASK_TERMINAL_OUTCOMES, "terminal outcome");
}
//#endregion
//#region src/tasks/task-registry.store.sqlite.ts
const TASK_RUN_SELECT_COLUMNS = [
  "task_id",
  "runtime",
  "task_kind",
  "source_id",
  "requester_session_key",
  "owner_key",
  "scope_kind",
  "child_session_key",
  "parent_flow_id",
  "parent_task_id",
  "agent_id",
  "requester_agent_id",
  "run_id",
  "label",
  "task",
  "status",
  "delivery_status",
  "notify_policy",
  "created_at",
  "started_at",
  "ended_at",
  "last_event_at",
  "cleanup_after",
  "tool_use_count",
  "last_tool_name",
  "error",
  "progress_summary",
  "terminal_summary",
  "terminal_outcome",
  "detail_json",
];
let cachedDatabase = null;
function serializeJson(value) {
  return value === void 0 ? null : (JSON.stringify(value) ?? null);
}
function parseJsonValue(raw) {
  if (!raw?.trim()) return;
  try {
    return JSON.parse(raw);
  } catch {
    return;
  }
}
function rowToTaskRecord(row) {
  const startedAt = normalizeSqliteNumber(row.started_at);
  const endedAt = normalizeSqliteNumber(row.ended_at);
  const lastEventAt = normalizeSqliteNumber(row.last_event_at);
  const cleanupAfter = normalizeSqliteNumber(row.cleanup_after);
  const toolUseCount = normalizeSqliteNumber(row.tool_use_count);
  const scopeKind = parseTaskScopeKind(row.scope_kind);
  const terminalOutcome = parseOptionalTaskTerminalOutcome(row.terminal_outcome);
  const detail = parseJsonValue(row.detail_json);
  const requesterSessionKey =
    scopeKind === "system" ? "" : row.requester_session_key?.trim() || row.owner_key;
  return {
    taskId: row.task_id,
    runtime: parseTaskRuntime(row.runtime),
    ...(row.task_kind ? { taskKind: row.task_kind } : {}),
    ...(row.source_id ? { sourceId: row.source_id } : {}),
    requesterSessionKey,
    ownerKey: row.owner_key,
    scopeKind,
    ...(row.child_session_key ? { childSessionKey: row.child_session_key } : {}),
    ...(row.parent_flow_id ? { parentFlowId: row.parent_flow_id } : {}),
    ...(row.parent_task_id ? { parentTaskId: row.parent_task_id } : {}),
    ...(row.agent_id ? { agentId: row.agent_id } : {}),
    ...(row.requester_agent_id ? { requesterAgentId: row.requester_agent_id } : {}),
    ...(row.run_id ? { runId: row.run_id } : {}),
    ...(row.label ? { label: row.label } : {}),
    task: row.task,
    status: parseTaskStatus(row.status),
    deliveryStatus: parseTaskDeliveryStatus(row.delivery_status),
    notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
    createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
    ...(startedAt != null ? { startedAt } : {}),
    ...(endedAt != null ? { endedAt } : {}),
    ...(lastEventAt != null ? { lastEventAt } : {}),
    ...(cleanupAfter != null ? { cleanupAfter } : {}),
    ...(toolUseCount != null ? { toolUseCount } : {}),
    ...(row.last_tool_name ? { lastToolName: row.last_tool_name } : {}),
    ...(row.error ? { error: row.error } : {}),
    ...(row.progress_summary ? { progressSummary: row.progress_summary } : {}),
    ...(row.terminal_summary !== null ? { terminalSummary: row.terminal_summary } : {}),
    ...(terminalOutcome ? { terminalOutcome } : {}),
    ...(detail !== void 0 ? { detail } : {}),
  };
}
function rowToTaskDeliveryState(row) {
  const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
  const lastNotifiedEventAt = normalizeSqliteNumber(row.last_notified_event_at);
  return {
    taskId: row.task_id,
    ...(requesterOrigin ? { requesterOrigin } : {}),
    ...(lastNotifiedEventAt != null ? { lastNotifiedEventAt } : {}),
  };
}
function bindTaskRecordBase(record) {
  return {
    task_id: record.taskId,
    runtime: record.runtime,
    task_kind: record.taskKind ?? null,
    source_id: record.sourceId ?? null,
    requester_session_key: record.scopeKind === "system" ? "" : record.requesterSessionKey,
    owner_key: record.ownerKey,
    scope_kind: record.scopeKind,
    child_session_key: record.childSessionKey ?? null,
    parent_flow_id: record.parentFlowId ?? null,
    parent_task_id: record.parentTaskId ?? null,
    agent_id: record.agentId ?? null,
    requester_agent_id: record.requesterAgentId ?? null,
    run_id: record.runId ?? null,
    label: record.label ?? null,
    task: record.task,
    status: record.status,
    delivery_status: record.deliveryStatus,
    notify_policy: record.notifyPolicy,
    created_at: record.createdAt,
    started_at: record.startedAt ?? null,
    ended_at: record.endedAt ?? null,
    last_event_at: record.lastEventAt ?? null,
    cleanup_after: record.cleanupAfter ?? null,
    tool_use_count: record.toolUseCount ?? null,
    last_tool_name: record.lastToolName ?? null,
    error: record.error ?? null,
    progress_summary: record.progressSummary ?? null,
    terminal_summary: record.terminalSummary ?? null,
    terminal_outcome: record.terminalOutcome ?? null,
    detail_json: serializeJson(record.detail),
  };
}
function bindTaskDeliveryState(state) {
  return {
    task_id: state.taskId,
    requester_origin_json: serializeJson(state.requesterOrigin),
    last_notified_event_at: state.lastNotifiedEventAt ?? null,
  };
}
function getTaskRegistryKysely(db) {
  return getNodeSqliteKysely(db);
}
function pruneRowsNotInSnapshot(params) {
  params.db.exec(`CREATE TEMP TABLE IF NOT EXISTS ${params.tempTableName} (id TEXT PRIMARY KEY)`);
  params.db.exec(`DELETE FROM ${params.tempTableName}`);
  const insert = params.db.prepare(`INSERT OR IGNORE INTO ${params.tempTableName} (id) VALUES (?)`);
  for (const id of params.ids) insert.run(id);
  params.db.exec(`
    DELETE FROM ${params.tableName}
    WHERE NOT EXISTS (
      SELECT 1 FROM ${params.tempTableName}
      WHERE ${params.tempTableName}.id = ${params.tableName}.${params.columnName}
    )
  `);
  params.db.exec(`DELETE FROM ${params.tempTableName}`);
}
function selectTaskRows(db) {
  return executeSqliteQuerySync(
    db,
    getTaskRegistryKysely(db)
      .selectFrom("task_runs")
      .select(TASK_RUN_SELECT_COLUMNS)
      .orderBy("created_at", "asc")
      .orderBy("task_id", "asc"),
  ).rows;
}
function selectTaskRowsByOwnerKey(db, ownerKey) {
  const selectColumns = TASK_RUN_SELECT_COLUMNS.join(", ");
  return db
    .prepare(`SELECT ${selectColumns}
       FROM task_runs NOT INDEXED
       WHERE owner_key = ?
       ORDER BY created_at ASC, task_id ASC`)
    .all(ownerKey);
}
function selectTaskRowsByRuntimeSourceId(db, runtime, sourceId) {
  let query = getTaskRegistryKysely(db)
    .selectFrom("task_runs")
    .select(TASK_RUN_SELECT_COLUMNS)
    .where("runtime", "=", runtime);
  if (sourceId !== void 0) query = query.where("source_id", "=", sourceId);
  return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("task_id", "asc"))
    .rows;
}
function selectTaskDeliveryStateRows(db) {
  return executeSqliteQuerySync(
    db,
    getTaskRegistryKysely(db)
      .selectFrom("task_delivery_state")
      .select(["task_id", "requester_origin_json", "last_notified_event_at"])
      .orderBy("task_id", "asc"),
  ).rows;
}
function upsertTaskRow(db, row) {
  executeSqliteQuerySync(
    db,
    getTaskRegistryKysely(db)
      .insertInto("task_runs")
      .values(row)
      .onConflict((conflict) =>
        conflict.column("task_id").doUpdateSet({
          runtime: (eb) => eb.ref("excluded.runtime"),
          task_kind: (eb) => eb.ref("excluded.task_kind"),
          source_id: (eb) => eb.ref("excluded.source_id"),
          requester_session_key: (eb) => eb.ref("excluded.requester_session_key"),
          owner_key: (eb) => eb.ref("excluded.owner_key"),
          scope_kind: (eb) => eb.ref("excluded.scope_kind"),
          child_session_key: (eb) => eb.ref("excluded.child_session_key"),
          parent_flow_id: (eb) => eb.ref("excluded.parent_flow_id"),
          parent_task_id: (eb) => eb.ref("excluded.parent_task_id"),
          agent_id: (eb) => eb.ref("excluded.agent_id"),
          requester_agent_id: (eb) => eb.ref("excluded.requester_agent_id"),
          run_id: (eb) => eb.ref("excluded.run_id"),
          label: (eb) => eb.ref("excluded.label"),
          task: (eb) => eb.ref("excluded.task"),
          status: (eb) => eb.ref("excluded.status"),
          delivery_status: (eb) => eb.ref("excluded.delivery_status"),
          notify_policy: (eb) => eb.ref("excluded.notify_policy"),
          created_at: (eb) => eb.ref("excluded.created_at"),
          started_at: (eb) => eb.ref("excluded.started_at"),
          ended_at: (eb) => eb.ref("excluded.ended_at"),
          last_event_at: (eb) => eb.ref("excluded.last_event_at"),
          cleanup_after: (eb) => eb.ref("excluded.cleanup_after"),
          tool_use_count: (eb) => eb.ref("excluded.tool_use_count"),
          last_tool_name: (eb) => eb.ref("excluded.last_tool_name"),
          error: (eb) => eb.ref("excluded.error"),
          progress_summary: (eb) => eb.ref("excluded.progress_summary"),
          terminal_summary: (eb) => eb.ref("excluded.terminal_summary"),
          terminal_outcome: (eb) => eb.ref("excluded.terminal_outcome"),
          detail_json: (eb) => eb.ref("excluded.detail_json"),
        }),
      ),
  );
}
function replaceTaskDeliveryStateRow(db, row) {
  executeSqliteQuerySync(
    db,
    getTaskRegistryKysely(db)
      .insertInto("task_delivery_state")
      .values(row)
      .onConflict((conflict) =>
        conflict.column("task_id").doUpdateSet({
          requester_origin_json: (eb) => eb.ref("excluded.requester_origin_json"),
          last_notified_event_at: (eb) => eb.ref("excluded.last_notified_event_at"),
        }),
      ),
  );
}
function deleteTaskRowsWithDeliveryState(db, taskId) {
  const kysely = getTaskRegistryKysely(db);
  executeSqliteQuerySync(
    db,
    kysely.deleteFrom("task_delivery_state").where("task_id", "=", taskId),
  );
  executeSqliteQuerySync(db, kysely.deleteFrom("task_runs").where("task_id", "=", taskId));
}
function openTaskRegistryDatabase() {
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
  const database = openTaskRegistryDatabase();
  runOpenClawStateWriteTransaction(() => {
    write(database);
  });
}
function loadTaskRegistryStateFromSqlite() {
  const { db, path } = openTaskRegistryDatabase();
  return runSqliteDeferredTransactionSync(db, () => {
    assertSqliteTableIntegrity(db, path, "task_runs");
    assertSqliteTableIntegrity(db, path, "task_delivery_state");
    const taskRows = selectTaskRows(db);
    const deliveryRows = selectTaskDeliveryStateRows(db);
    return {
      tasks: new Map(taskRows.map((row) => [row.task_id, rowToTaskRecord(row)])),
      deliveryStates: new Map(
        deliveryRows.map((row) => [row.task_id, rowToTaskDeliveryState(row)]),
      ),
    };
  });
}
function listTaskRegistryRecordsByOwnerKeyFromSqlite(ownerKey) {
  const key = ownerKey.trim();
  if (!key) return [];
  const { db } = openTaskRegistryDatabase();
  return selectTaskRowsByOwnerKey(db, key).map(rowToTaskRecord);
}
/** Reads task rows for one runtime/source without restoring the process registry snapshot. */
function listTaskRegistryRecordsByRuntimeSourceIdFromSqlite(params) {
  const sourceId = params.sourceId?.trim();
  if (params.sourceId !== void 0 && !sourceId) return [];
  const { db } = openTaskRegistryDatabase();
  return selectTaskRowsByRuntimeSourceId(db, params.runtime, sourceId).map(rowToTaskRecord);
}
function saveTaskRegistryStateToSqlite(snapshot) {
  withWriteTransaction(({ db }) => {
    const kysely = getTaskRegistryKysely(db);
    const taskIds = [...snapshot.tasks.keys()];
    if (taskIds.length === 0) {
      executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state"));
      executeSqliteQuerySync(db, kysely.deleteFrom("task_runs"));
      return;
    }
    pruneRowsNotInSnapshot({
      db,
      tableName: "task_runs",
      columnName: "task_id",
      tempTableName: "openclaw_live_task_run_ids",
      ids: taskIds,
    });
    const deliveryTaskIds = [...snapshot.deliveryStates.keys()];
    if (deliveryTaskIds.length === 0)
      executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state"));
    else
      pruneRowsNotInSnapshot({
        db,
        tableName: "task_delivery_state",
        columnName: "task_id",
        tempTableName: "openclaw_live_task_delivery_ids",
        ids: deliveryTaskIds,
      });
    for (const task of snapshot.tasks.values()) upsertTaskRow(db, bindTaskRecordBase(task));
    for (const state of snapshot.deliveryStates.values())
      replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
  });
}
function upsertTaskRegistryRecordToSqlite(task) {
  withWriteTransaction(({ db }) => {
    upsertTaskRow(db, bindTaskRecordBase(task));
  });
}
function upsertTaskWithDeliveryStateToSqlite(params) {
  withWriteTransaction(({ db }) => {
    upsertTaskRow(db, bindTaskRecordBase(params.task));
    if (params.deliveryState)
      replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(params.deliveryState));
    else
      executeSqliteQuerySync(
        db,
        getTaskRegistryKysely(db)
          .deleteFrom("task_delivery_state")
          .where("task_id", "=", params.task.taskId),
      );
  });
}
function deleteTaskRegistryRecordFromSqlite(taskId) {
  withWriteTransaction(({ db }) => {
    deleteTaskRowsWithDeliveryState(db, taskId);
  });
}
function deleteTaskAndDeliveryStateFromSqlite(taskId) {
  withWriteTransaction(({ db }) => {
    deleteTaskRowsWithDeliveryState(db, taskId);
  });
}
function upsertTaskDeliveryStateToSqlite(state) {
  withWriteTransaction(({ db }) => {
    replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
  });
}
function deleteTaskDeliveryStateFromSqlite(taskId) {
  withWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getTaskRegistryKysely(db).deleteFrom("task_delivery_state").where("task_id", "=", taskId),
    );
  });
}
function closeTaskRegistryDatabase() {
  cachedDatabase = null;
  closeOpenClawStateDatabase();
}
//#endregion
export {
  listTaskRegistryRecordsByOwnerKeyFromSqlite as a,
  saveTaskRegistryStateToSqlite as c,
  upsertTaskWithDeliveryStateToSqlite as d,
  parseTaskNotifyPolicy as f,
  deleteTaskRegistryRecordFromSqlite as i,
  upsertTaskDeliveryStateToSqlite as l,
  deleteTaskAndDeliveryStateFromSqlite as n,
  listTaskRegistryRecordsByRuntimeSourceIdFromSqlite as o,
  parseDeliveryContextJson as p,
  deleteTaskDeliveryStateFromSqlite as r,
  loadTaskRegistryStateFromSqlite as s,
  closeTaskRegistryDatabase as t,
  upsertTaskRegistryRecordToSqlite as u,
};
