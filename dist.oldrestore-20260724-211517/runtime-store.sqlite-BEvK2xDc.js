import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  d as openOpenClawAgentDatabase,
  f as runOpenClawAgentWriteTransaction,
} from "./openclaw-agent-db-VC51jrBW.js";
import "./session-key-druuY-GG.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { o as resolveSqliteTargetFromSessionStorePath } from "./targets-CjMfpXbt.js";
import "./paths-Bo64bnX2.js";
//#region src/trajectory/runtime-store.sqlite.ts
/** Appends runtime trajectory events to the per-agent SQLite session store. */
function appendSqliteTrajectoryRuntimeEvents(scope, events) {
  if (events.length === 0) return;
  const options = toDatabaseOptions(scope);
  const maxRuntimeBytes = Math.max(1, Math.floor(scope.maxRuntimeBytes ?? 10485760));
  runOpenClawAgentWriteTransaction((database) => {
    const db = getTrajectoryKysely(database.db);
    let seq = readNextTrajectorySeq(database, scope.sessionId);
    for (const event of events) {
      const eventJson = JSON.stringify(event);
      executeSqliteQuerySync(
        database.db,
        db.insertInto("trajectory_runtime_events").values({
          session_id: scope.sessionId,
          seq,
          run_id: event.runId ?? null,
          event_json: eventJson,
          created_at: readTrajectoryEventTimestamp(event) ?? Date.now(),
        }),
      );
      seq += 1;
    }
    trimSqliteTrajectoryRuntimeWindow(database, scope.sessionId, maxRuntimeBytes);
  }, options);
}
/** Loads runtime trajectory events from per-agent SQLite rows in storage order. */
async function loadSqliteTrajectoryRuntimeEvents(scope) {
  return loadSqliteTrajectoryRuntimeEventsSync(scope);
}
/** Loads runtime trajectory events synchronously for CLI and export paths. */
function loadSqliteTrajectoryRuntimeEventsSync(scope) {
  return loadSqliteTrajectoryRuntimeEventRowsSync(scope).map((row) => row.event);
}
/** Loads runtime trajectory event rows with storage seqs for follow/export cursors. */
function loadSqliteTrajectoryRuntimeEventRowsSync(scope) {
  const database = openOpenClawAgentDatabase(toDatabaseOptions(scope));
  let query = getTrajectoryKysely(database.db)
    .selectFrom("trajectory_runtime_events")
    .select(["seq", "event_json"])
    .where("session_id", "=", scope.sessionId)
    .orderBy("seq", "asc");
  const afterSeq = scope.afterSeq;
  if (afterSeq !== void 0 && Number.isFinite(afterSeq))
    query = query.where("seq", ">", Math.floor(afterSeq));
  const maxEvents = scope.maxEvents;
  if (maxEvents !== void 0 && Number.isFinite(maxEvents))
    query = query.limit(Math.max(0, Math.floor(maxEvents)));
  return executeSqliteQuerySync(database.db, query).rows.map((row) => ({
    event: JSON.parse(row.event_json),
    seq: row.seq,
  }));
}
function getTrajectoryKysely(database) {
  return getNodeSqliteKysely(database);
}
function toDatabaseOptions(scope) {
  const requestedAgentId = scope.agentId ? normalizeAgentId(scope.agentId) : void 0;
  const target = resolveSqliteTargetFromSessionStorePath(
    scope.storePath,
    requestedAgentId ? { agentId: requestedAgentId } : {},
  );
  if (requestedAgentId && target.agentId && requestedAgentId !== target.agentId)
    throw new Error(
      `SQLite trajectory store path belongs to agent ${target.agentId}; requested agent ${requestedAgentId}.`,
    );
  return {
    agentId: requestedAgentId ?? target.agentId ?? "main",
    ...(scope.env ? { env: scope.env } : {}),
    ...(target.path ? { path: target.path } : {}),
  };
}
function readNextTrajectorySeq(database, sessionId) {
  const db = getTrajectoryKysely(database.db);
  const row = executeSqliteQueryTakeFirstSync(
    database.db,
    db
      .selectFrom("trajectory_runtime_events")
      .select((eb) => eb.fn.max("seq").as("max_seq"))
      .where("session_id", "=", sessionId),
  );
  if (row?.max_seq === null || row?.max_seq === void 0) return 0;
  return normalizeSqliteNumber(row.max_seq) + 1;
}
function trimSqliteTrajectoryRuntimeWindow(database, sessionId, maxRuntimeBytes) {
  const db = getTrajectoryKysely(database.db);
  const rows = executeSqliteQuerySync(
    database.db,
    db
      .selectFrom("trajectory_runtime_events")
      .select(["seq", "event_json"])
      .where("session_id", "=", sessionId)
      .orderBy("seq", "asc"),
  ).rows;
  const removableSeqs = oldestTrajectorySeqsPastByteWindow(rows, maxRuntimeBytes);
  if (removableSeqs.length === 0) return;
  executeSqliteQuerySync(
    database.db,
    db
      .deleteFrom("trajectory_runtime_events")
      .where("session_id", "=", sessionId)
      .where("seq", "in", removableSeqs),
  );
}
function oldestTrajectorySeqsPastByteWindow(rows, maxRuntimeBytes) {
  let totalBytes = rows.reduce((total, row) => total + trajectoryJsonlRowBytes(row.event_json), 0);
  const removableSeqs = [];
  for (const row of rows) {
    if (totalBytes <= maxRuntimeBytes) break;
    removableSeqs.push(row.seq);
    totalBytes -= trajectoryJsonlRowBytes(row.event_json);
  }
  return removableSeqs;
}
function trajectoryJsonlRowBytes(eventJson) {
  return Buffer.byteLength(eventJson, "utf8") + 1;
}
function readTrajectoryEventTimestamp(event) {
  const parsed = Date.parse(event.ts);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function normalizeSqliteNumber(value) {
  return typeof value === "bigint" ? Number(value) : value;
}
//#endregion
export {
  loadSqliteTrajectoryRuntimeEventRowsSync as n,
  loadSqliteTrajectoryRuntimeEvents as r,
  appendSqliteTrajectoryRuntimeEvents as t,
};
