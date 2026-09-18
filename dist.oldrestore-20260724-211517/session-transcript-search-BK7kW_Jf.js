import {
  d as openOpenClawAgentDatabase,
  f as runOpenClawAgentWriteTransaction,
} from "./openclaw-agent-db-VC51jrBW.js";
import "./utils-DtcDeqWS.js";
import {
  L as executeSqliteQuerySync,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  At as rebuildSessionTranscriptIndexInTransaction,
  Ot as deleteOrphanedTranscriptIndexRowsInTransaction,
  kt as listSessionsNeedingTranscriptIndexReconcile,
} from "./session-accessor-PZVNxFCV.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/config/sessions/session-transcript-search.ts
const log = createSubsystemLogger("sessions/search-index");
const SEARCH_SNIPPET_MAX_CHARS = 500;
const SEARCH_LIMIT_MAX = 25;
const SEARCH_QUERY_MAX_CHARS = 4096;
const runningReconciles = /* @__PURE__ */ new Map();
/**
 * Rebuilds every session whose index state lags its transcript rows, then
 * sweeps orphaned index rows. One write transaction per session keeps the
 * agent DB responsive to live appends between rebuilds.
 */
async function reconcileSessionTranscriptIndex(params) {
  const sessionIds = listSessionsNeedingTranscriptIndexReconcile(
    openOpenClawAgentDatabase({
      agentId: params.agentId,
      ...(params.env ? { env: params.env } : {}),
    }).db,
  );
  for (const sessionId of sessionIds) {
    runOpenClawAgentWriteTransaction(
      (agentDatabase) => {
        const rows = executeSqliteQuerySync(
          agentDatabase.db,
          getNodeSqliteKysely(agentDatabase.db)
            .selectFrom("transcript_events")
            .select(["seq", "event_json"])
            .where("session_id", "=", sessionId)
            .orderBy("seq", "asc"),
        ).rows;
        if (rows.length === 0) return;
        const events = rows.map((row) => JSON.parse(row.event_json));
        const maxSeq = rows[rows.length - 1]?.seq ?? -1;
        rebuildSessionTranscriptIndexInTransaction(agentDatabase.db, sessionId, events, maxSeq);
      },
      {
        agentId: params.agentId,
        ...(params.env ? { env: params.env } : {}),
      },
      { operationLabel: "sessions.search.reconcile" },
    );
    await new Promise((resolve) => {
      setImmediate(resolve);
    });
  }
  runOpenClawAgentWriteTransaction(
    (agentDatabase) => {
      deleteOrphanedTranscriptIndexRowsInTransaction(agentDatabase.db);
    },
    {
      agentId: params.agentId,
      ...(params.env ? { env: params.env } : {}),
    },
    { operationLabel: "sessions.search.orphan-sweep" },
  );
}
function startReconcile(params) {
  if (runningReconciles.has(params.agentId)) return;
  const pending = reconcileSessionTranscriptIndex(params)
    .catch((error) => {
      log.warn(
        `session transcript reconcile failed agent=${params.agentId} error=${error instanceof Error ? error.message : String(error)}`,
      );
    })
    .finally(() => {
      runningReconciles.delete(params.agentId);
    });
  runningReconciles.set(params.agentId, pending);
}
function toFtsQuery(query) {
  return query
    .trim()
    .split(/\s+/u)
    .map((token) => `"${token.replaceAll('"', '""')}"`)
    .join(" AND ");
}
/** Search the per-agent FTS index; kicks off one background reconcile when the index lags. */
function searchSessionTranscripts(params) {
  const query = params.query.trim();
  if (!query) throw new Error("query must not be empty");
  if (query.length > SEARCH_QUERY_MAX_CHARS)
    throw new Error(`query must not exceed ${SEARCH_QUERY_MAX_CHARS} characters`);
  const database = openOpenClawAgentDatabase({
    agentId: params.agentId,
    ...(params.env ? { env: params.env } : {}),
  });
  const dirtySessions = listSessionsNeedingTranscriptIndexReconcile(database.db);
  if (dirtySessions.length > 0) startReconcile(params);
  const indexing = dirtySessions.length > 0 || runningReconciles.has(params.agentId);
  const limit = Math.min(Math.max(1, params.limit ?? 10), SEARCH_LIMIT_MAX);
  const sessionKeys = params.sessionKeys ?? [];
  const whereSession =
    sessionKeys.length > 0
      ? ` AND sessions.session_key IN (${sessionKeys.map(() => "?").join(", ")})`
      : "";
  const statement = database.db.prepare(`
    SELECT sessions.session_key AS session_key, session_transcript_fts.session_id AS session_id,
      message_id, role, timestamp,
      snippet(session_transcript_fts, 0, '', '', ' … ', 48) AS snippet,
      bm25(session_transcript_fts) AS rank
    FROM session_transcript_fts
    JOIN sessions ON sessions.session_id = session_transcript_fts.session_id
    WHERE session_transcript_fts MATCH ?${whereSession}
      AND session_transcript_fts.session_id NOT IN (
        SELECT session_id FROM session_transcript_index_state WHERE needs_rebuild != 0
      )
    ORDER BY rank ASC, timestamp DESC, message_id ASC
    LIMIT ?
  `);
  const values = [toFtsQuery(query), ...sessionKeys, limit + 1];
  const hits = statement.all(...values).flatMap((row) => {
    if (
      typeof row.session_key !== "string" ||
      typeof row.session_id !== "string" ||
      typeof row.message_id !== "string" ||
      (row.role !== "user" && row.role !== "assistant") ||
      typeof row.snippet !== "string"
    )
      return [];
    const timestamp = typeof row.timestamp === "number" ? row.timestamp : Number(row.timestamp);
    const rank = typeof row.rank === "number" ? row.rank : Number(row.rank);
    return [
      {
        sessionKey: row.session_key,
        sessionId: row.session_id,
        messageId: row.message_id,
        role: row.role,
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
        snippet:
          row.snippet.length > SEARCH_SNIPPET_MAX_CHARS
            ? `${truncateUtf16Safe(row.snippet, SEARCH_SNIPPET_MAX_CHARS)}…`
            : row.snippet,
        score: Number.isFinite(rank) ? -rank : 0,
      },
    ];
  });
  return {
    hits: hits.slice(0, limit),
    indexing,
    truncated: hits.length > limit,
  };
}
//#endregion
export { searchSessionTranscripts as t };
