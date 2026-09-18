import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
//#region src/infra/delivery-queue-sqlite.ts
function openStateDatabase(stateDir) {
  return openOpenClawStateDatabase({
    env: stateDir
      ? {
          ...process.env,
          OPENCLAW_STATE_DIR: stateDir,
        }
      : process.env,
  });
}
function enoent(queueName, id) {
  const err = /* @__PURE__ */ new Error(`No pending ${queueName} delivery queue entry ${id}`);
  err.code = "ENOENT";
  return err;
}
function inflate(row) {
  let parsed;
  try {
    parsed = JSON.parse(row.entry_json);
  } catch {
    return null;
  }
  return {
    ...parsed,
    id: row.id,
    enqueuedAt: Number(row.enqueued_at),
    retryCount: Number(row.retry_count),
    ...(row.last_attempt_at == null ? {} : { lastAttemptAt: Number(row.last_attempt_at) }),
    ...(row.last_error == null ? {} : { lastError: row.last_error }),
    ...(row.platform_send_started_at == null
      ? {}
      : { platformSendStartedAt: Number(row.platform_send_started_at) }),
    ...(row.recovery_state == null ? {} : { recoveryState: row.recovery_state }),
  };
}
function metadata(entry) {
  const item = entry;
  return {
    entryKind: item.kind,
    sessionKey: item.sessionKey ?? item.session?.key,
    channel: item.channel ?? item.route?.channel ?? item.deliveryContext?.channel,
    target: item.to ?? item.route?.to ?? item.deliveryContext?.to,
    accountId: item.accountId ?? item.route?.accountId ?? item.deliveryContext?.accountId,
  };
}
/** Insert or replace a delivery queue entry under a queue namespace. */
function upsertDeliveryQueueEntry(params) {
  const now = Date.now();
  const status = params.status ?? "pending";
  const meta = params.metadata ?? metadata(params.entry);
  const database = openStateDatabase(params.stateDir);
  const queueDb = getNodeSqliteKysely(database.db);
  executeSqliteQuerySync(
    database.db,
    queueDb
      .insertInto("delivery_queue_entries")
      .values({
        queue_name: params.queueName,
        id: params.entry.id,
        status,
        entry_kind: meta.entryKind ?? null,
        session_key: meta.sessionKey ?? null,
        channel: meta.channel ?? null,
        target: meta.target ?? null,
        account_id: meta.accountId ?? null,
        retry_count: params.entry.retryCount,
        last_attempt_at: params.entry.lastAttemptAt ?? null,
        last_error: params.entry.lastError ?? null,
        recovery_state: params.entry.recoveryState ?? null,
        platform_send_started_at: params.entry.platformSendStartedAt ?? null,
        entry_json: JSON.stringify(params.entry),
        enqueued_at: params.entry.enqueuedAt,
        updated_at: now,
        failed_at: status === "failed" ? now : null,
      })
      .onConflict((conflict) =>
        conflict.columns(["queue_name", "id"]).doUpdateSet({
          status: (eb) => eb.ref("excluded.status"),
          entry_kind: (eb) => eb.ref("excluded.entry_kind"),
          session_key: (eb) => eb.ref("excluded.session_key"),
          channel: (eb) => eb.ref("excluded.channel"),
          target: (eb) => eb.ref("excluded.target"),
          account_id: (eb) => eb.ref("excluded.account_id"),
          retry_count: (eb) => eb.ref("excluded.retry_count"),
          last_attempt_at: (eb) => eb.ref("excluded.last_attempt_at"),
          last_error: (eb) => eb.ref("excluded.last_error"),
          recovery_state: (eb) => eb.ref("excluded.recovery_state"),
          platform_send_started_at: (eb) => eb.ref("excluded.platform_send_started_at"),
          entry_json: (eb) => eb.ref("excluded.entry_json"),
          enqueued_at: (eb) => eb.ref("excluded.enqueued_at"),
          updated_at: (eb) => eb.ref("excluded.updated_at"),
          failed_at: (eb) => eb.ref("excluded.failed_at"),
        }),
      ),
  );
}
/** Load a single pending delivery queue entry. */
function loadDeliveryQueueEntry(queueName, id, stateDir) {
  const database = openStateDatabase(stateDir);
  const queueDb = getNodeSqliteKysely(database.db);
  const row = executeSqliteQueryTakeFirstSync(
    database.db,
    queueDb
      .selectFrom("delivery_queue_entries")
      .select([
        "id",
        "entry_json",
        "enqueued_at",
        "retry_count",
        "last_attempt_at",
        "last_error",
        "platform_send_started_at",
        "recovery_state",
      ])
      .where("queue_name", "=", queueName)
      .where("id", "=", id)
      .where("status", "=", "pending"),
  );
  return row ? inflate(row) : null;
}
/** Load all pending entries for a queue namespace in database order. */
function loadDeliveryQueueEntries(queueName, stateDir) {
  const database = openStateDatabase(stateDir);
  const queueDb = getNodeSqliteKysely(database.db);
  return executeSqliteQuerySync(
    database.db,
    queueDb
      .selectFrom("delivery_queue_entries")
      .select([
        "id",
        "entry_json",
        "enqueued_at",
        "retry_count",
        "last_attempt_at",
        "last_error",
        "platform_send_started_at",
        "recovery_state",
      ])
      .where("queue_name", "=", queueName)
      .where("status", "=", "pending")
      .orderBy("enqueued_at", "asc")
      .orderBy("id", "asc"),
  )
    .rows.map(inflate)
    .filter((entry) => entry != null);
}
/** Delete a pending delivery queue entry after successful delivery. */
function deleteDeliveryQueueEntry(queueName, id, stateDir) {
  const database = openStateDatabase(stateDir);
  const queueDb = getNodeSqliteKysely(database.db);
  executeSqliteQuerySync(
    database.db,
    queueDb
      .deleteFrom("delivery_queue_entries")
      .where("queue_name", "=", queueName)
      .where("id", "=", id)
      .where("status", "=", "pending"),
  );
}
/** Load, transform, and persist a pending delivery queue entry. */
function updateDeliveryQueueEntry(queueName, id, stateDir, update) {
  const current = loadDeliveryQueueEntry(queueName, id, stateDir);
  if (!current) throw enoent(queueName, id);
  upsertDeliveryQueueEntry({
    queueName,
    entry: update(current),
    stateDir,
  });
}
/** Count dead-lettered (failed) entries per queue namespace for health reporting. */
function countFailedDeliveryQueueEntries(stateDir) {
  const database = openStateDatabase(stateDir);
  const queueDb = getNodeSqliteKysely(database.db);
  return executeSqliteQuerySync(
    database.db,
    queueDb
      .selectFrom("delivery_queue_entries")
      .select((eb) => [
        "queue_name",
        eb.fn.countAll().as("failed_count"),
        eb.fn.min("failed_at").as("oldest_failed_at"),
      ])
      .where("status", "=", "failed")
      .groupBy("queue_name")
      .orderBy("queue_name", "asc"),
  ).rows.map((row) => ({
    queueName: row.queue_name,
    count: Number(row.failed_count),
    oldestFailedAt: row.oldest_failed_at == null ? null : Number(row.oldest_failed_at),
  }));
}
/** Mark a pending delivery queue entry as failed for later diagnostics. */
function moveDeliveryQueueEntryToFailed(queueName, id, stateDir) {
  const current = loadDeliveryQueueEntry(queueName, id, stateDir);
  if (!current) throw enoent(queueName, id);
  upsertDeliveryQueueEntry({
    queueName,
    entry: current,
    status: "failed",
    stateDir,
  });
}
/** Atomically fail a queue row only while its persisted status is still pending. */
function failPendingDeliveryQueueEntry(params) {
  if (params.entry.id !== params.id)
    throw new Error(`Delivery queue entry id mismatch: ${params.entry.id} != ${params.id}`);
  const now = Date.now();
  const failedEntry = {
    ...params.entry,
    lastError: params.lastError,
  };
  const database = openStateDatabase(params.stateDir);
  const queueDb = getNodeSqliteKysely(database.db);
  return executeSqliteQuerySync(
    database.db,
    queueDb
      .updateTable("delivery_queue_entries")
      .set({
        status: "failed",
        last_error: params.lastError,
        entry_json: JSON.stringify(failedEntry),
        updated_at: now,
        failed_at: now,
      })
      .where("queue_name", "=", params.queueName)
      .where("id", "=", params.id)
      .where("status", "=", params.expectedStatus),
  ).numAffectedRows === 1n
    ? { status: "failed" }
    : { status: "not_pending" };
}
//#endregion
export {
  loadDeliveryQueueEntry as a,
  upsertDeliveryQueueEntry as c,
  loadDeliveryQueueEntries as i,
  deleteDeliveryQueueEntry as n,
  moveDeliveryQueueEntryToFailed as o,
  failPendingDeliveryQueueEntry as r,
  updateDeliveryQueueEntry as s,
  countFailedDeliveryQueueEntries as t,
};
