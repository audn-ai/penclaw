import fs from "node:fs";
import "./memory-core-host-engine-storage-eNQx81fD.js";
import path from "node:path";
import { r as requireMemoryHostNodeSqlite } from "./engine-storage-DV2x5DKD.js";
//#region extensions/memory-core/src/qmd-session-artifacts.ts
const QMD_SESSION_ARTIFACT_TABLE = "openclaw_qmd_session_artifacts";
const QMD_SESSION_ARTIFACT_HIT = Symbol("openclaw.qmdSessionArtifactHit");
function ensureQmdSessionArtifactSchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS ${QMD_SESSION_ARTIFACT_TABLE} (
      collection TEXT NOT NULL,
      artifact_path TEXT NOT NULL,
      search_path TEXT NOT NULL,
      docid TEXT,
      memory_key TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      archived INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (collection, artifact_path)
    )`);
  try {
    db.exec(`ALTER TABLE ${QMD_SESSION_ARTIFACT_TABLE}
       ADD COLUMN archived INTEGER NOT NULL DEFAULT 0`);
  } catch {}
  db.exec(`CREATE INDEX IF NOT EXISTS idx_openclaw_qmd_session_artifacts_docid
     ON ${QMD_SESSION_ARTIFACT_TABLE} (docid)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_openclaw_qmd_session_artifacts_search_path
     ON ${QMD_SESSION_ARTIFACT_TABLE} (search_path)`);
}
function openQmdSessionArtifactDb(indexPath, readOnly = false) {
  const { DatabaseSync: SqliteDatabase } = requireMemoryHostNodeSqlite();
  if (!readOnly) fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  const db = new SqliteDatabase(indexPath, { readOnly });
  db.exec("PRAGMA busy_timeout = 1000");
  return db;
}
function attachQmdSessionArtifactHit(hit, identity) {
  Object.defineProperty(hit, QMD_SESSION_ARTIFACT_HIT, {
    configurable: true,
    enumerable: false,
    value: identity,
  });
  return hit;
}
function copyQmdSessionArtifactHit(source, target) {
  const identity = readQmdSessionArtifactIdentity(source);
  return identity ? attachQmdSessionArtifactHit(target, identity) : target;
}
function readQmdSessionArtifactIdentity(hit) {
  return hit[QMD_SESSION_ARTIFACT_HIT] ?? null;
}
function replaceQmdSessionArtifactMappings(params) {
  const db = openQmdSessionArtifactDb(params.indexPath);
  let transactionStarted = false;
  try {
    ensureQmdSessionArtifactSchema(db);
    const deleteCollection = db.prepare(
      `DELETE FROM ${QMD_SESSION_ARTIFACT_TABLE} WHERE collection = ?`,
    );
    const upsert = db.prepare(`INSERT INTO ${QMD_SESSION_ARTIFACT_TABLE}
       (collection, artifact_path, search_path, docid, memory_key, agent_id, session_id, archived, updated_at)
       VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?)
       ON CONFLICT(collection, artifact_path) DO UPDATE SET
         search_path=excluded.search_path,
         docid=NULL,
         memory_key=excluded.memory_key,
         agent_id=excluded.agent_id,
         session_id=excluded.session_id,
         archived=excluded.archived,
         updated_at=excluded.updated_at`);
    db.exec("BEGIN");
    transactionStarted = true;
    deleteCollection.run(params.collection);
    const updatedAt = Date.now();
    for (const mapping of params.mappings)
      upsert.run(
        mapping.collection,
        mapping.artifactPath,
        mapping.searchPath,
        mapping.memoryKey,
        mapping.agentId,
        mapping.sessionId,
        mapping.archived ? 1 : 0,
        updatedAt,
      );
    db.exec("COMMIT");
  } catch (err) {
    if (transactionStarted)
      try {
        db.exec("ROLLBACK");
      } catch {}
    throw err;
  } finally {
    db.close();
  }
}
function refreshQmdSessionArtifactDocIds(params) {
  const db = openQmdSessionArtifactDb(params.indexPath);
  let transactionStarted = false;
  try {
    ensureQmdSessionArtifactSchema(db);
    const rows = db
      .prepare(`SELECT d.hash AS docid, m.artifact_path AS artifact_path
         FROM ${QMD_SESSION_ARTIFACT_TABLE} m
         JOIN documents d
           ON d.collection = m.collection
          AND d.path = m.artifact_path
          AND d.active = 1
         WHERE m.collection = ?`)
      .all(params.collection);
    const updateDocId = db.prepare(`UPDATE ${QMD_SESSION_ARTIFACT_TABLE}
       SET docid = ?, updated_at = ?
       WHERE collection = ? AND artifact_path = ?`);
    db.exec("BEGIN");
    transactionStarted = true;
    const updatedAt = Date.now();
    for (const row of rows)
      updateDocId.run(row.docid, updatedAt, params.collection, row.artifact_path);
    db.exec("COMMIT");
  } catch (err) {
    if (transactionStarted)
      try {
        db.exec("ROLLBACK");
      } catch {}
    throw err;
  } finally {
    db.close();
  }
}
function resolveQmdSessionArtifactIdentity(lookup) {
  let db;
  try {
    db = openQmdSessionArtifactDb(lookup.indexPath, true);
  } catch {
    return null;
  }
  try {
    const row =
      findQmdSessionArtifactByDocId(db, lookup) ?? findQmdSessionArtifactByPath(db, lookup);
    return row
      ? {
          agentId: row.agentId,
          archived: row.archived === 1,
          memoryKey: row.memoryKey,
          sessionId: row.sessionId,
        }
      : null;
  } catch {
    return null;
  } finally {
    db.close();
  }
}
function findQmdSessionArtifactByDocId(db, lookup) {
  const docid = lookup.docid?.trim();
  if (!docid) return null;
  return pickQmdSessionArtifactRow(
    db
      .prepare(`SELECT collection, artifact_path, search_path, docid, archived, memory_key AS memoryKey,
              agent_id AS agentId, session_id AS sessionId
       FROM ${QMD_SESSION_ARTIFACT_TABLE}
       WHERE docid = ?`)
      .all(docid),
    lookup,
  );
}
function findQmdSessionArtifactByPath(db, lookup) {
  return pickQmdSessionArtifactRow(
    db
      .prepare(`SELECT collection, artifact_path, search_path, docid, archived, memory_key AS memoryKey,
              agent_id AS agentId, session_id AS sessionId
       FROM ${QMD_SESSION_ARTIFACT_TABLE}
       WHERE search_path = ?
          OR (collection = ? AND artifact_path = ?)`)
      .all(lookup.searchPath, lookup.collection ?? "", lookup.artifactPath ?? ""),
    lookup,
  );
}
function pickQmdSessionArtifactRow(rows, lookup) {
  if (rows.length === 0) return null;
  const exact = rows.find((row) => {
    if (lookup.collection && row.collection !== lookup.collection) return false;
    if (lookup.artifactPath && row.artifact_path !== lookup.artifactPath) return false;
    return row.search_path === lookup.searchPath;
  });
  if (exact) return exact;
  return rows.length === 1 ? (rows[0] ?? null) : null;
}
//#endregion
export {
  replaceQmdSessionArtifactMappings as a,
  refreshQmdSessionArtifactDocIds as i,
  copyQmdSessionArtifactHit as n,
  resolveQmdSessionArtifactIdentity as o,
  readQmdSessionArtifactIdentity as r,
  attachQmdSessionArtifactHit as t,
};
