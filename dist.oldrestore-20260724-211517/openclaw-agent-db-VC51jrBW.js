import { chmodSync, existsSync, lstatSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as formatErrorMessage$1 } from "./error-coercion-CrJRoLe1.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import {
  F as readSqliteUserVersion,
  I as clearNodeSqliteKyselyCacheForDatabase,
  L as executeSqliteQuerySync,
  M as resolveSqliteDatabaseFilePaths,
  O as assertSqliteSchemaContains,
  P as createNewerSqliteSchemaVersionError,
  d as resolveOpenClawStateSqliteDir,
  f as resolveOpenClawStateSqlitePath,
  i as detectOpenClawStateDatabaseSchemaMigrations,
  j as repairCanonicalSqliteUniqueIndexes,
  k as assertSqliteIntegrity,
  l as runOpenClawStateWriteTransaction,
  t as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { r as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DLqNjJHV.js";
import {
  i as registerSqliteCacheExitClose,
  n as configureSqlitePreSchemaPragmas,
  t as configureSqliteConnectionPragmas,
} from "./sqlite-wal-C_AVzaTm.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region packages/memory-host-sdk/src/host/error-utils.ts
const SECRET_PATTERNS = [
  /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g,
  /[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature)=([^&\s"'<>]+)/gi,
  /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken)"\s*:\s*"([^"]+)"/g,
  /--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd)\s+(["']?)([^\s"']+)\1/g,
  /Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)/g,
  /\bBearer\s+([A-Za-z0-9._\-+=]{18,})\b/g,
  /(^|[\s,;])(?:access_token|refresh_token|api[-_]?key|token|secret|password|passwd)=([^\s&#]+)/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
  /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
  /\b(ghp_[A-Za-z0-9]{20,})\b/g,
  /\b(github_pat_[A-Za-z0-9_]{20,})\b/g,
  /\b(xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
  /\b(xapp-[A-Za-z0-9-]{10,})\b/g,
  /\b(gsk_[A-Za-z0-9_-]{10,})\b/g,
  /\b(AIza[0-9A-Za-z\-_]{20,})\b/g,
  /\b(pplx-[A-Za-z0-9_-]{10,})\b/g,
  /\b(npm_[A-Za-z0-9]{10,})\b/g,
  /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
  /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
];
function maskToken(token) {
  if (token.length < 18) return "***";
  return `${sliceUtf16Safe(token, 0, 6)}...${sliceUtf16Safe(token, -4)}`;
}
function redactPemBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return "***";
  return `${lines[0]}\n...redacted...\n${lines[lines.length - 1]}`;
}
function redactMatch(match, groups) {
  if (match.includes("PRIVATE KEY-----")) return redactPemBlock(match);
  const token = groups.findLast((value) => typeof value === "string" && value.length > 0) ?? match;
  const masked = maskToken(token);
  if (token === match) return masked;
  const tokenOffset = match.lastIndexOf(token);
  if (tokenOffset < 0) return "***";
  return `${match.slice(0, tokenOffset)}${masked}${match.slice(tokenOffset + token.length)}`;
}
function redactSensitiveText(text) {
  let next = text;
  for (const pattern of SECRET_PATTERNS)
    next = next.replace(pattern, (...args) => redactMatch(args[0] ?? "", args.slice(1, -2)));
  return next;
}
/** Format memory-host errors through the canonical formatter and local redaction policy. */
function formatErrorMessage(err) {
  return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema.ts
const MEMORY_INDEX_META_TABLE = "memory_index_meta";
const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
const MEMORY_EMBEDDING_CACHE_TABLE = "memory_embedding_cache";
const MEMORY_INDEX_STATE_TABLE = "memory_index_state";
const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
const MEMORY_INDEX_PATHS_FTS_TABLE = "memory_index_paths_fts";
const MEMORY_INDEX_VECTOR_TABLE = "memory_index_chunks_vec";
const MEMORY_PATH_FTS_TRIGGER_NAMES = [
  "memory_index_paths_fts_after_insert",
  "memory_index_paths_fts_after_update",
  "memory_index_paths_fts_after_delete",
];
const LEGACY_MEMORY_INDEX_TRIGGERS = [
  "memory_files_revision_after_insert",
  "memory_files_revision_after_update",
  "memory_files_revision_after_delete",
  "memory_chunks_revision_after_insert",
  "memory_chunks_revision_after_update",
  "memory_chunks_revision_after_delete",
];
const LEGACY_MEMORY_INDEX_SOURCE_COLUMNS = ["path", "source", "hash", "mtime", "size"];
const MEMORY_INDEX_SOURCE_COLUMNS = ["id", ...LEGACY_MEMORY_INDEX_SOURCE_COLUMNS];
const MEMORY_INDEX_SOURCE_COLUMN_TYPES = /* @__PURE__ */ new Map([
  ["id", "INTEGER"],
  ["path", "TEXT"],
  ["source", "TEXT"],
  ["hash", "TEXT"],
  ["mtime", "INTEGER"],
  ["size", "INTEGER"],
]);
function tableColumnInfo(db, tableName, schema = "main") {
  return db
    .prepare(`PRAGMA ${schema}.table_xinfo(${tableName})`)
    .all()
    .flatMap((row) =>
      typeof row.name === "string" && typeof row.type === "string"
        ? [
            {
              name: row.name,
              type: row.type.toUpperCase(),
              notnull: Number(row.notnull ?? 0),
              pk: Number(row.pk ?? 0),
              defaultValue: typeof row.dflt_value === "string" ? row.dflt_value : null,
              hidden: Number(row.hidden ?? 0),
            },
          ]
        : [],
    );
}
function tableColumns(db, tableName, schema = "main") {
  return new Set(tableColumnInfo(db, tableName, schema).map((row) => row.name));
}
function tableHasExactColumns(db, tableName, expected, schema = "main") {
  const columns = tableColumns(db, tableName, schema);
  return columns.size === expected.length && expected.every((column) => columns.has(column));
}
function tablePrimaryKeyColumns(db, tableName) {
  return tableColumnInfo(db, tableName)
    .filter((row) => row.pk > 0)
    .toSorted((left, right) => left.pk - right.pk)
    .map((row) => row.name);
}
function tableHasPrimaryKey(db, tableName, expectedColumns) {
  const columns = tablePrimaryKeyColumns(db, tableName);
  return (
    columns.length === expectedColumns.length &&
    columns.every((column, index) => column === expectedColumns[index])
  );
}
function tableHasUniqueIndex(db, tableName, expectedColumns) {
  const indexes = db
    .prepare(`SELECT name, partial FROM pragma_index_list(?) WHERE "unique" = 1`)
    .all(tableName);
  if (indexes.length !== 1) return false;
  return indexes.some((index) => {
    if (typeof index.name !== "string" || Number(index.partial ?? 0) !== 0) return false;
    const columns = db
      .prepare(
        `SELECT cid, name, coll, "desc" AS sort_desc, key FROM pragma_index_xinfo(?) ORDER BY seqno`,
      )
      .all(index.name)
      .filter((row) => Number(row.key ?? 0) === 1);
    return (
      columns.length === expectedColumns.length &&
      columns.every(
        (column, columnIndex) =>
          Number(column.cid ?? -1) >= 0 &&
          column.name === expectedColumns[columnIndex] &&
          column.coll === "BINARY" &&
          Number(column.sort_desc ?? 0) === 0,
      )
    );
  });
}
function tableHasNoDeclaredCollations(db, tableName) {
  const row = db
    .prepare(`SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = ?`)
    .get(tableName);
  return typeof row?.sql === "string" && !/\bCOLLATE\b/iu.test(row.sql);
}
function tableHasCanonicalSourceColumnTypes(db) {
  return tableColumnInfo(db, MEMORY_INDEX_SOURCES_TABLE).every((column) => {
    const expectedType = MEMORY_INDEX_SOURCE_COLUMN_TYPES.get(column.name);
    const expectedDefault = column.name === "source" ? "'memory'" : null;
    if (
      column.type !== expectedType ||
      column.defaultValue !== expectedDefault ||
      column.hidden !== 0
    )
      return false;
    return true;
  });
}
function tableHasCanonicalSourceColumns(db) {
  return (
    tableHasCanonicalSourceColumnTypes(db) &&
    tableColumnInfo(db, "memory_index_sources").every((column) => {
      return column.name === "id" || column.notnull === 1;
    })
  );
}
function tableHasLegacySourceColumns(db, hasPathPrimaryKey) {
  return (
    tableHasCanonicalSourceColumnTypes(db) &&
    tableColumnInfo(db, "memory_index_sources").every((column) => {
      return (hasPathPrimaryKey && column.name === "path") || column.notnull === 1;
    })
  );
}
function tableHasIntegerRowIdPrimaryKey(db) {
  if (
    tableColumnInfo(db, "memory_index_sources").find((column) => column.name === "id")?.type !==
      "INTEGER" ||
    !tableHasPrimaryKey(db, "memory_index_sources", ["id"])
  )
    return false;
  return (
    db
      .prepare(`SELECT 1 AS found FROM pragma_index_list(?) WHERE origin = 'pk' LIMIT 1`)
      .get(MEMORY_INDEX_SOURCES_TABLE)?.found !== 1
  );
}
function tableExists(db, tableName) {
  return (
    db
      .prepare(`SELECT 1 AS found FROM sqlite_master WHERE type = 'table' AND name = ?`)
      .get(tableName)?.found === 1
  );
}
function assertLegacyRowsCopied(db, query, tableName) {
  const row = db.prepare(query).get();
  if (Number(row?.missing ?? 0) > 0)
    throw new Error(`legacy memory ${tableName} rows conflict with canonical memory index rows`);
}
/** Upgrade canonical memory sources to stable integer identities. */
function migrateMemoryIndexSourcesIdentity(db) {
  if (!tableExists(db, "memory_index_sources")) return;
  if (tableHasExactColumns(db, "memory_index_sources", MEMORY_INDEX_SOURCE_COLUMNS)) {
    if (
      tableHasCanonicalSourceColumns(db) &&
      tableHasIntegerRowIdPrimaryKey(db) &&
      tableHasNoDeclaredCollations(db, "memory_index_sources") &&
      tableHasUniqueIndex(db, "memory_index_sources", ["path", "source"])
    )
      return;
    throw new Error("canonical memory source identity schema is invalid");
  }
  if (!tableHasExactColumns(db, "memory_index_sources", LEGACY_MEMORY_INDEX_SOURCE_COLUMNS))
    throw new Error("canonical memory source identity schema is invalid");
  const hasPathPrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, ["path"]);
  const hasPathSourcePrimaryKey = tableHasPrimaryKey(db, MEMORY_INDEX_SOURCES_TABLE, [
    "path",
    "source",
  ]);
  if (!hasPathPrimaryKey && !hasPathSourcePrimaryKey)
    throw new Error("canonical memory source identity schema is invalid");
  if (!tableHasLegacySourceColumns(db, hasPathPrimaryKey))
    throw new Error("canonical memory source identity schema is invalid");
  const rebuildsPathFts = tableExists(db, MEMORY_INDEX_PATHS_FTS_TABLE);
  db.exec("SAVEPOINT migrate_memory_index_sources_identity");
  try {
    dropMemoryPathFtsTriggers(db);
    db.exec(`
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_insert;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_update;
      DROP TRIGGER IF EXISTS memory_index_sources_revision_after_delete;

      ALTER TABLE ${MEMORY_INDEX_SOURCES_TABLE}
        RENAME TO memory_index_sources_identity_migration;
      CREATE TABLE ${MEMORY_INDEX_SOURCES_TABLE} (
        id INTEGER PRIMARY KEY,
        path TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'memory',
        hash TEXT NOT NULL,
        mtime INTEGER NOT NULL,
        size INTEGER NOT NULL,
        UNIQUE (path, source)
      );
      INSERT INTO ${MEMORY_INDEX_SOURCES_TABLE} (id, path, source, hash, mtime, size)
      SELECT rowid, path, source, hash, mtime, size
      FROM memory_index_sources_identity_migration;
      DROP TABLE memory_index_sources_identity_migration;
    `);
    if (rebuildsPathFts) {
      db.exec(`
        DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE};
        INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
        SELECT id, path, source FROM ${MEMORY_INDEX_SOURCES_TABLE};
      `);
      ensureMemoryPathFtsTriggers(db);
    }
    db.exec("RELEASE migrate_memory_index_sources_identity");
  } catch (err) {
    db.exec("ROLLBACK TO migrate_memory_index_sources_identity");
    db.exec("RELEASE migrate_memory_index_sources_identity");
    throw err;
  }
}
function hasLegacyMemoryIndexTables(db, schema = "main") {
  return (
    tableHasExactColumns(db, "meta", ["key", "value"], schema) &&
    tableHasExactColumns(db, "files", ["path", "source", "hash", "mtime", "size"], schema) &&
    tableHasExactColumns(
      db,
      "chunks",
      [
        "id",
        "path",
        "source",
        "start_line",
        "end_line",
        "hash",
        "model",
        "text",
        "embedding",
        "updated_at",
      ],
      schema,
    )
  );
}
function hasLegacyEmbeddingCacheTable(db, schema = "main") {
  return tableHasExactColumns(
    db,
    "embedding_cache",
    ["provider", "model", "provider_key", "hash", "embedding", "dims", "updated_at"],
    schema,
  );
}
function copyLegacyMemoryIndexRows(db, schema, preservedEmbeddingCacheTable) {
  db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_META_TABLE} (key, value)
    SELECT key, value FROM ${schema}.meta;

    INSERT OR IGNORE INTO main.${MEMORY_INDEX_SOURCES_TABLE} (path, source, hash, mtime, size)
    SELECT path, source, hash, mtime, size FROM ${schema}.files;

    INSERT OR IGNORE INTO main.${MEMORY_INDEX_CHUNKS_TABLE} (
      id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
    )
    SELECT id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
    FROM ${schema}.chunks;
  `);
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.meta AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_META_TABLE} AS canonical
       WHERE canonical.key = legacy.key AND canonical.value IS legacy.value
     )`,
    "meta",
  );
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.files AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_SOURCES_TABLE} AS canonical
       WHERE canonical.path = legacy.path
         AND canonical.source IS legacy.source
         AND canonical.hash IS legacy.hash
         AND canonical.mtime IS legacy.mtime
         AND canonical.size IS legacy.size
     )`,
    "files",
  );
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.chunks AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.path IS legacy.path
         AND canonical.source IS legacy.source
         AND canonical.start_line IS legacy.start_line
         AND canonical.end_line IS legacy.end_line
         AND canonical.hash IS legacy.hash
         AND canonical.model IS legacy.model
         AND canonical.text IS legacy.text
         AND canonical.embedding IS legacy.embedding
         AND canonical.updated_at IS legacy.updated_at
     )`,
    "chunks",
  );
  if (
    preservedEmbeddingCacheTable !== "embedding_cache" &&
    hasLegacyEmbeddingCacheTable(db, schema)
  ) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS main.${MEMORY_EMBEDDING_CACHE_TABLE} (
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        provider_key TEXT NOT NULL,
        hash TEXT NOT NULL,
        embedding TEXT NOT NULL,
        dims INTEGER,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (provider, model, provider_key, hash)
      );
      INSERT OR IGNORE INTO main.${MEMORY_EMBEDDING_CACHE_TABLE} (
        provider, model, provider_key, hash, embedding, dims, updated_at
      )
      SELECT provider, model, provider_key, hash, embedding, dims, updated_at
      FROM ${schema}.embedding_cache;
    `);
    assertLegacyRowsCopied(
      db,
      `SELECT COUNT(*) AS missing
       FROM ${schema}.embedding_cache AS legacy
       WHERE NOT EXISTS (
         SELECT 1 FROM main.${MEMORY_EMBEDDING_CACHE_TABLE} AS canonical
         WHERE canonical.provider = legacy.provider
           AND canonical.model = legacy.model
           AND canonical.provider_key = legacy.provider_key
           AND canonical.hash = legacy.hash
           AND canonical.embedding IS legacy.embedding
           AND canonical.dims IS legacy.dims
           AND canonical.updated_at IS legacy.updated_at
       )`,
      "embedding_cache",
    );
  }
}
function migrateLegacyMemoryIndexTables(db, preservedEmbeddingCacheTable) {
  if (!hasLegacyMemoryIndexTables(db)) return;
  db.exec("SAVEPOINT migrate_legacy_memory_index_tables");
  try {
    copyLegacyMemoryIndexRows(db, "main", preservedEmbeddingCacheTable);
    if (preservedEmbeddingCacheTable !== "embedding_cache" && hasLegacyEmbeddingCacheTable(db))
      db.exec("DROP TABLE embedding_cache");
    for (const trigger of LEGACY_MEMORY_INDEX_TRIGGERS)
      db.exec(`DROP TRIGGER IF EXISTS ${trigger}`);
    db.exec(`
      DROP TABLE IF EXISTS chunks_fts;
      DROP TABLE chunks;
      DROP TABLE files;
      DROP TABLE meta;
      RELEASE migrate_legacy_memory_index_tables;
    `);
  } catch (err) {
    db.exec("ROLLBACK TO migrate_legacy_memory_index_tables");
    db.exec("RELEASE migrate_legacy_memory_index_tables");
    throw err;
  }
}
/** Drop the canonical source-to-path-FTS maintenance triggers. */
function dropMemoryPathFtsTriggers(db) {
  for (const triggerName of MEMORY_PATH_FTS_TRIGGER_NAMES)
    db.exec(`DROP TRIGGER IF EXISTS main.${triggerName}`);
}
/** Install the canonical source-to-path-FTS maintenance triggers. */
function ensureMemoryPathFtsTriggers(db) {
  db.exec(`
    -- The named integer source identity survives VACUUM and gives every
    -- FTS update/delete a direct rowid lookup instead of a virtual-table scan.
    CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_insert
    AFTER INSERT ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
      VALUES (NEW.id, NEW.path, NEW.source);
    END;
    CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_update
    AFTER UPDATE OF id, path, source ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
      WHERE rowid = OLD.id;
      INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
      VALUES (NEW.id, NEW.path, NEW.source);
    END;
    CREATE TRIGGER IF NOT EXISTS main.memory_index_paths_fts_after_delete
    AFTER DELETE ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      DELETE FROM ${MEMORY_INDEX_PATHS_FTS_TABLE}
      WHERE rowid = OLD.id;
    END;
  `);
}
function ensureMemoryPathFtsSchema(params) {
  params.db.exec("SAVEPOINT ensure_memory_index_paths_fts");
  try {
    params.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS ${MEMORY_INDEX_PATHS_FTS_TABLE} USING fts5(
        path,
        source UNINDEXED
        ${params.tokenizeClause}
      );
      -- The initial copy and trigger installation share this savepoint. Once
      -- populated, the triggers own completeness; per-row FTS probes are too costly.
      INSERT INTO ${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source)
      SELECT id, path, source
      FROM ${MEMORY_INDEX_SOURCES_TABLE}
      WHERE NOT EXISTS (SELECT 1 FROM ${MEMORY_INDEX_PATHS_FTS_TABLE} LIMIT 1);
    `);
    ensureMemoryPathFtsTriggers(params.db);
    params.db.exec("RELEASE ensure_memory_index_paths_fts");
  } catch (err) {
    params.db.exec("ROLLBACK TO ensure_memory_index_paths_fts");
    params.db.exec("RELEASE ensure_memory_index_paths_fts");
    throw err;
  }
}
/** Ensure canonical memory index tables and the optional FTS table exist. */
function ensureMemoryIndexSchema(params) {
  const embeddingCacheTable = params.embeddingCacheTable ?? "memory_embedding_cache";
  const ftsTable = params.ftsTable ?? "memory_index_chunks_fts";
  params.db.exec(`
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_META_TABLE} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_SOURCES_TABLE} (
      id INTEGER PRIMARY KEY,
      path TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'memory',
      hash TEXT NOT NULL,
      mtime INTEGER NOT NULL,
      size INTEGER NOT NULL,
      UNIQUE (path, source)
    );
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_CHUNKS_TABLE} (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'memory',
      start_line INTEGER NOT NULL,
      end_line INTEGER NOT NULL,
      hash TEXT NOT NULL,
      model TEXT NOT NULL,
      text TEXT NOT NULL,
      embedding TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ${MEMORY_INDEX_STATE_TABLE} (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      revision INTEGER NOT NULL
    );
    INSERT OR IGNORE INTO ${MEMORY_INDEX_STATE_TABLE} (id, revision) VALUES (1, 0);
  `);
  migrateMemoryIndexSourcesIdentity(params.db);
  params.db.exec(`

    CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert
    AFTER INSERT ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update
    AFTER UPDATE ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete
    AFTER DELETE ON ${MEMORY_INDEX_SOURCES_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;

    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert
    AFTER INSERT ON ${MEMORY_INDEX_CHUNKS_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
    AFTER UPDATE ON ${MEMORY_INDEX_CHUNKS_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;
    CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
    AFTER DELETE ON ${MEMORY_INDEX_CHUNKS_TABLE}
    BEGIN
      UPDATE ${MEMORY_INDEX_STATE_TABLE} SET revision = revision + 1 WHERE id = 1;
    END;

    CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
      ON ${MEMORY_INDEX_SOURCES_TABLE}(source);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
      ON ${MEMORY_INDEX_CHUNKS_TABLE}(path, source);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path
      ON ${MEMORY_INDEX_CHUNKS_TABLE}(path);
    CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
      ON ${MEMORY_INDEX_CHUNKS_TABLE}(source);
  `);
  migrateLegacyMemoryIndexTables(params.db, params.embeddingCacheTable);
  if (params.cacheEnabled) {
    const updatedAtIndex =
      embeddingCacheTable === "memory_embedding_cache"
        ? "idx_memory_embedding_cache_updated_at"
        : "idx_embedding_cache_updated_at";
    params.db.exec(`
      CREATE TABLE IF NOT EXISTS ${embeddingCacheTable} (
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        provider_key TEXT NOT NULL,
        hash TEXT NOT NULL,
        embedding TEXT NOT NULL,
        dims INTEGER,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (provider, model, provider_key, hash)
      );
      CREATE INDEX IF NOT EXISTS ${updatedAtIndex}
        ON ${embeddingCacheTable}(updated_at);
    `);
  }
  let ftsAvailable = false;
  let ftsError;
  if (params.ftsEnabled)
    try {
      const tokenizeClause =
        (params.ftsTokenizer ?? "unicode61") === "trigram"
          ? `, tokenize='trigram case_sensitive 0'`
          : "";
      params.db.exec(
        `CREATE VIRTUAL TABLE IF NOT EXISTS ${ftsTable} USING fts5(\n  text,\n  id UNINDEXED,\n  path UNINDEXED,\n  source UNINDEXED,\n  model UNINDEXED,\n  start_line UNINDEXED,\n  end_line UNINDEXED\n${tokenizeClause});`,
      );
      params.db.exec(`
        INSERT INTO ${ftsTable} (
          text, id, path, source, model, start_line, end_line
        )
        SELECT text, id, path, source, model, start_line, end_line
        FROM ${MEMORY_INDEX_CHUNKS_TABLE}
        WHERE NOT EXISTS (SELECT 1 FROM ${ftsTable} LIMIT 1);
      `);
      if (ftsTable === "memory_index_chunks_fts")
        ensureMemoryPathFtsSchema({
          db: params.db,
          tokenizeClause,
        });
      ftsAvailable = true;
    } catch (err) {
      const message = formatErrorMessage(err);
      ftsAvailable = false;
      ftsError = message;
    }
  return {
    ftsAvailable,
    ...(ftsError ? { ftsError } : {}),
  };
}
//#endregion
//#region src/state/openclaw-agent-db-session-migrations.ts
function readSqliteTableColumns(db, tableName) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName))
    throw new Error(`invalid SQLite table identifier: ${tableName}`);
  if (
    !db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)
  )
    return null;
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return new Set(rows.flatMap((row) => (typeof row.name === "string" ? [row.name] : [])));
}
function migrateSessionEntryStatusProjection(db, readStatus) {
  const columns = readSqliteTableColumns(db, "session_entries");
  if (!columns) return;
  if (!columns.has("status"))
    db.exec(
      "ALTER TABLE session_entries ADD COLUMN status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout'));",
    );
  const rows = db.prepare("SELECT session_key, entry_json FROM session_entries").all();
  const update = db.prepare("UPDATE session_entries SET status = ? WHERE session_key = ?");
  for (const row of rows)
    if (typeof row.session_key === "string")
      update.run(readStatus(row.entry_json), row.session_key);
}
//#endregion
//#region src/state/openclaw-agent-db-session-provenance.ts
function readMigratedEntry(value) {
  if (typeof value === "string")
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
    } catch {
      return;
    }
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function normalizedText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function addSessionProvenanceColumns(db, columns) {
  if (columns && !columns.has("session_entry_provenance"))
    db.exec(
      "ALTER TABLE sessions ADD COLUMN session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1));",
    );
  if (columns && !columns.has("acp_owned"))
    db.exec(
      "ALTER TABLE sessions ADD COLUMN acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1));",
    );
  if (columns && !columns.has("plugin_owner_id"))
    db.exec("ALTER TABLE sessions ADD COLUMN plugin_owner_id TEXT;");
  if (columns && !columns.has("hook_external_content_source"))
    db.exec(
      "ALTER TABLE sessions ADD COLUMN hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'));",
    );
}
function backfillSessionEntryProvenance(db, previousVersion) {
  if (previousVersion >= 8) return;
  const rows = db
    .prepare(`SELECT se.session_id, se.entry_json
       FROM session_entries AS se
       INNER JOIN sessions AS s
         ON s.session_id = se.session_id AND s.session_key = se.session_key;`)
    .all();
  const update = db.prepare(`
    UPDATE sessions
    SET session_entry_provenance = 1, acp_owned = ?, plugin_owner_id = ?,
        hook_external_content_source = ?
    WHERE session_id = ?;
  `);
  for (const row of rows) {
    const sessionId = normalizedText(row.session_id);
    const entry = readMigratedEntry(row.entry_json);
    if (!sessionId || !entry) continue;
    const hookSource = normalizedText(entry.hookExternalContentSource);
    const acp = entry.acp;
    update.run(
      acp && typeof acp === "object" && !Array.isArray(acp) ? 1 : 0,
      normalizedText(entry.pluginOwnerId),
      hookSource === "gmail" || hookSource === "webhook" ? hookSource : null,
      sessionId,
    );
  }
}
function backfillTranscriptMutationWatermarks(db) {
  if (
    db
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get("transcript_events")?.ok !== 1
  )
    return;
  db.exec(`
    UPDATE sessions
    SET
      transcript_updated_at = COALESCE(
        transcript_updated_at,
        (SELECT MAX(transcript_events.created_at)
         FROM transcript_events
         WHERE transcript_events.session_id = sessions.session_id)
      ),
      transcript_observed_at = COALESCE(transcript_observed_at, updated_at)
    WHERE EXISTS (
      SELECT 1 FROM transcript_events
      WHERE transcript_events.session_id = sessions.session_id
    );
  `);
}
//#endregion
//#region src/state/openclaw-agent-db.paths.ts
/** Resolve the SQLite file for one normalized agent id. */
function resolveOpenClawAgentSqlitePath(options) {
  const agentId = normalizeAgentId(options.agentId);
  return path.resolve(
    options.path ??
      path.join(
        path.dirname(resolveOpenClawStateSqliteDir(options.env ?? process.env)),
        "agents",
        agentId,
        "agent",
        "openclaw-agent.sqlite",
      ),
  );
}
//#endregion
//#region src/state/openclaw-agent-schema.generated.ts
/**
 * This file was generated from the SQLite schema source.
 * Please do not edit it manually.
 */
const OPENCLAW_AGENT_SCHEMA_SQL = `CREATE TABLE IF NOT EXISTS schema_meta (
  meta_key TEXT NOT NULL PRIMARY KEY,
  role TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  agent_id TEXT,
  app_version TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT NOT NULL PRIMARY KEY,
  session_key TEXT NOT NULL,
  session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  transcript_updated_at INTEGER DEFAULT NULL,
  transcript_observed_at INTEGER DEFAULT NULL,
  session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
  acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
  plugin_owner_id TEXT,
  hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
  started_at INTEGER,
  ended_at INTEGER,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
  channel TEXT,
  account_id TEXT,
  primary_conversation_id TEXT,
  model_provider TEXT,
  model TEXT,
  agent_harness_id TEXT,
  parent_session_key TEXT,
  spawned_by TEXT,
  display_name TEXT,
  FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_updated_at
  ON sessions(updated_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_created_at
  ON sessions(created_at DESC, session_id);

CREATE INDEX IF NOT EXISTS idx_agent_sessions_conversation
  ON sessions(primary_conversation_id, updated_at DESC, session_id)
  WHERE primary_conversation_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS session_routes (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agent_session_routes_session_id
  ON session_routes(session_id);

CREATE TABLE IF NOT EXISTS conversations (
  conversation_id TEXT NOT NULL PRIMARY KEY,
  channel TEXT NOT NULL,
  account_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),
  peer_id TEXT NOT NULL,
  parent_conversation_id TEXT,
  thread_id TEXT,
  native_channel_id TEXT,
  native_direct_user_id TEXT,
  label TEXT,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_conversations_lookup
  ON conversations(channel, account_id, kind, peer_id, thread_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_conversations_identity
  ON conversations(
    channel,
    account_id,
    kind,
    peer_id,
    IFNULL(parent_conversation_id, ''),
    IFNULL(thread_id, '')
  );

CREATE INDEX IF NOT EXISTS idx_agent_conversations_updated
  ON conversations(updated_at DESC, conversation_id);

CREATE TABLE IF NOT EXISTS session_conversations (
  session_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'participant', 'related')),
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, conversation_id, role),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agent_session_conversations_conversation
  ON session_conversations(conversation_id, last_seen_at DESC, session_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_session_conversations_primary
  ON session_conversations(session_id)
  WHERE role = 'primary';

CREATE TABLE IF NOT EXISTS session_entries (
  session_key TEXT NOT NULL PRIMARY KEY,
  session_id TEXT NOT NULL,
  entry_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agent_session_entries_updated_at
  ON session_entries(updated_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_entries_session_updated
  ON session_entries(session_id, updated_at DESC, session_key);

CREATE INDEX IF NOT EXISTS idx_agent_session_entries_status
  ON session_entries(status, session_key)
  WHERE status IS NOT NULL;

CREATE TABLE IF NOT EXISTS transcript_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trajectory_runtime_events (
  session_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  run_id TEXT,
  event_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, seq),
  FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agent_trajectory_runtime_run
  ON trajectory_runtime_events(session_id, run_id, seq)
  WHERE run_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS transcript_event_identities (
  session_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event_type TEXT,
  parent_id TEXT,
  message_idempotency_key TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (session_id, event_id),
  FOREIGN KEY (session_id, seq) REFERENCES transcript_events(session_id, seq) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_transcript_message_idempotency
  ON transcript_event_identities(session_id, message_idempotency_key)
  WHERE message_idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_parent
  ON transcript_event_identities(session_id, parent_id)
  WHERE parent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_transcript_event_sequence
  ON transcript_event_identities(session_id, event_type, seq DESC);

CREATE TABLE IF NOT EXISTS cache_entries (
  scope TEXT NOT NULL,
  key TEXT NOT NULL,
  value_json TEXT,
  blob BLOB,
  expires_at INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (scope, key)
);

CREATE INDEX IF NOT EXISTS idx_agent_cache_expiry
  ON cache_entries(scope, expires_at, key)
  WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_agent_cache_updated
  ON cache_entries(scope, updated_at DESC, key);

CREATE TABLE IF NOT EXISTS auth_profile_store (
  store_key TEXT NOT NULL PRIMARY KEY,
  store_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_profile_state (
  state_key TEXT NOT NULL PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_index_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_index_sources (
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  hash TEXT NOT NULL,
  mtime INTEGER NOT NULL,
  size INTEGER NOT NULL,
  UNIQUE (path, source)
);

CREATE TABLE IF NOT EXISTS memory_index_chunks (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'memory',
  start_line INTEGER NOT NULL,
  end_line INTEGER NOT NULL,
  hash TEXT NOT NULL,
  model TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_embedding_cache (
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  provider_key TEXT NOT NULL,
  hash TEXT NOT NULL,
  embedding TEXT NOT NULL,
  dims INTEGER,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, model, provider_key, hash)
);

CREATE TABLE IF NOT EXISTS memory_index_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS session_transcript_index_state (
  session_id TEXT NOT NULL PRIMARY KEY,
  indexed_seq INTEGER NOT NULL,
  leaf_event_id TEXT,
  needs_rebuild INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE VIRTUAL TABLE IF NOT EXISTS session_transcript_fts USING fts5(
  text,
  session_id UNINDEXED,
  message_id UNINDEXED,
  role UNINDEXED,
  timestamp UNINDEXED,
  tokenize = 'unicode61 remove_diacritics 2'
);

INSERT OR IGNORE INTO memory_index_state (id, revision) VALUES (1, 0);

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_insert
AFTER INSERT ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_update
AFTER UPDATE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_sources_revision_after_delete
AFTER DELETE ON memory_index_sources
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_insert
AFTER INSERT ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_update
AFTER UPDATE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE TRIGGER IF NOT EXISTS memory_index_chunks_revision_after_delete
AFTER DELETE ON memory_index_chunks
BEGIN
  UPDATE memory_index_state SET revision = revision + 1 WHERE id = 1;
END;

CREATE INDEX IF NOT EXISTS idx_memory_embedding_cache_updated_at
  ON memory_embedding_cache(updated_at);

CREATE INDEX IF NOT EXISTS idx_memory_index_sources_source
  ON memory_index_sources(source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path_source
  ON memory_index_chunks(path, source);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_path
  ON memory_index_chunks(path);

CREATE INDEX IF NOT EXISTS idx_memory_index_chunks_source
  ON memory_index_chunks(source);\n`;
const OPENCLAW_AGENT_DB_DIR_MODE = 448;
const OPENCLAW_AGENT_DB_FILE_MODE = 384;
const OPENCLAW_AGENT_DB_SLOW_OPEN_MS = 1e3;
const OPENCLAW_AGENT_CANONICAL_UNIQUE_INDEXES = [
  {
    name: "idx_agent_conversations_identity",
    definition: `
      ON conversations(
        channel,
        account_id,
        kind,
        peer_id,
        IFNULL(parent_conversation_id, ''),
        IFNULL(thread_id, '')
      )
    `,
  },
  {
    name: "idx_agent_session_conversations_primary",
    definition: `
      ON session_conversations(session_id)
      WHERE role = 'primary'
    `,
  },
  {
    name: "idx_agent_transcript_message_idempotency",
    definition: `
      ON transcript_event_identities(session_id, message_idempotency_key)
      WHERE message_idempotency_key IS NOT NULL
    `,
  },
];
const agentDbLog = createSubsystemLogger("state/agent-db");
const cachedDatabases = /* @__PURE__ */ new Map();
function logSlowAgentDatabaseOpen(params) {
  if (params.elapsedMs < OPENCLAW_AGENT_DB_SLOW_OPEN_MS) return;
  agentDbLog.warn("slow OpenClaw agent database open", {
    agentId: params.agentId,
    elapsedMs: params.elapsedMs,
    path: params.path,
    thresholdMs: OPENCLAW_AGENT_DB_SLOW_OPEN_MS,
  });
}
function assertSupportedAgentSchemaVersion(db, pathname) {
  const userVersion = readSqliteUserVersion(db);
  if (userVersion > 8)
    throw createNewerSqliteSchemaVersionError("OpenClaw agent database", pathname, userVersion, 8);
}
function migratedSessionColumn(columns, columnName, fallback) {
  return columns.has(columnName) ? columnName : fallback;
}
function dropLegacySessionTranscriptSearchSchema(db) {
  db.exec("DROP TABLE IF EXISTS session_transcript_files;");
  if (
    db
      .prepare("PRAGMA table_info(session_transcript_fts)")
      .all()
      .some((row) => row.name === "session_key")
  )
    db.exec(`
      DROP TABLE IF EXISTS session_transcript_fts;
      DROP TABLE IF EXISTS session_transcript_index_state;
    `);
}
function dropLegacyMemoryIndexSchema(db) {
  if (
    !db
      .prepare("PRAGMA table_info(memory_index_sources)")
      .all()
      .some((row) => row.name === "source_kind")
  )
    return;
  db.exec(`
    DROP TABLE IF EXISTS memory_index_chunks_fts;
    DROP TABLE IF EXISTS memory_index_chunks;
    DROP TABLE IF EXISTS memory_index_sources;
  `);
}
function migrateOpenClawAgentSchema(db) {
  const userVersion = readSqliteUserVersion(db);
  if (userVersion >= 8) return;
  if (userVersion < 7) {
    db.exec("DROP INDEX IF EXISTS idx_agent_sessions_status;");
    migrateSessionEntryStatusProjection(db, (entryJson) => {
      const entry = parseMigratedSessionEntry(entryJson);
      return entry ? migratedStatus(entry.status) : null;
    });
  }
  if (userVersion < 6) db.exec("DROP INDEX IF EXISTS idx_agent_session_entries_session_id;");
  if (userVersion < 3) db.exec("DROP INDEX IF EXISTS idx_agent_transcript_events_session;");
  const columns = readSqliteTableColumns(db, "sessions");
  if (columns && !columns.has("transcript_updated_at"))
    db.exec("ALTER TABLE sessions ADD COLUMN transcript_updated_at INTEGER DEFAULT NULL;");
  if (columns && !columns.has("transcript_observed_at"))
    db.exec("ALTER TABLE sessions ADD COLUMN transcript_observed_at INTEGER DEFAULT NULL;");
  addSessionProvenanceColumns(db, columns);
  if (!columns) return;
  if (userVersion > 1) {
    backfillTranscriptMutationWatermarks(db);
    return;
  }
  const copyColumns = [
    "session_id",
    "session_key",
    "session_scope",
    "created_at",
    "updated_at",
    "session_entry_provenance",
    "acp_owned",
    "plugin_owner_id",
    "hook_external_content_source",
    "started_at",
    "ended_at",
    "status",
    "chat_type",
    "channel",
    "account_id",
    "primary_conversation_id",
    "model_provider",
    "model",
    "agent_harness_id",
    "parent_session_key",
    "spawned_by",
    "display_name",
  ];
  const selectColumns = [
    "session_id",
    "session_key",
    migratedSessionColumn(columns, "session_scope", "'conversation'"),
    "created_at",
    "updated_at",
    migratedSessionColumn(columns, "session_entry_provenance", "0"),
    migratedSessionColumn(columns, "acp_owned", "0"),
    migratedSessionColumn(columns, "plugin_owner_id", "NULL"),
    migratedSessionColumn(columns, "hook_external_content_source", "NULL"),
    migratedSessionColumn(columns, "started_at", "NULL"),
    migratedSessionColumn(columns, "ended_at", "NULL"),
    migratedSessionColumn(columns, "status", "NULL"),
    migratedSessionColumn(columns, "chat_type", "NULL"),
    migratedSessionColumn(columns, "channel", "NULL"),
    migratedSessionColumn(columns, "account_id", "NULL"),
    migratedSessionColumn(columns, "primary_conversation_id", "NULL"),
    migratedSessionColumn(columns, "model_provider", "NULL"),
    migratedSessionColumn(columns, "model", "NULL"),
    migratedSessionColumn(columns, "agent_harness_id", "NULL"),
    migratedSessionColumn(columns, "parent_session_key", "NULL"),
    migratedSessionColumn(columns, "spawned_by", "NULL"),
    migratedSessionColumn(columns, "display_name", "NULL"),
  ];
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id TEXT NOT NULL PRIMARY KEY,
      channel TEXT NOT NULL,
      account_id TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('direct', 'group', 'channel')),
      peer_id TEXT NOT NULL,
      parent_conversation_id TEXT,
      thread_id TEXT,
      native_channel_id TEXT,
      native_direct_user_id TEXT,
      label TEXT,
      metadata_json TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  db.exec(`
      DROP TABLE IF EXISTS sessions_new;
      CREATE TABLE sessions_new (
        session_id TEXT NOT NULL PRIMARY KEY,
        session_key TEXT NOT NULL,
        session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        transcript_updated_at INTEGER DEFAULT NULL,
        transcript_observed_at INTEGER DEFAULT NULL,
        session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
        acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
        plugin_owner_id TEXT,
        hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
        started_at INTEGER,
        ended_at INTEGER,
        status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
        chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
        channel TEXT,
        account_id TEXT,
        primary_conversation_id TEXT,
        model_provider TEXT,
        model TEXT,
        agent_harness_id TEXT,
        parent_session_key TEXT,
        spawned_by TEXT,
        display_name TEXT,
        FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
      );
      INSERT INTO sessions_new (${copyColumns.join(", ")})
      SELECT ${selectColumns.join(", ")} FROM sessions;
      DROP TABLE sessions;
      ALTER TABLE sessions_new RENAME TO sessions;
    `);
  backfillTranscriptMutationWatermarks(db);
}
function parseMigratedSessionEntry(value) {
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function migratedObjectField(entry, key) {
  const value = entry[key];
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function migratedText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function migratedNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function migratedChatType(value) {
  if (value === "direct" || value === "group" || value === "channel") return value;
  return null;
}
function migratedStatus(value) {
  if (
    value === "running" ||
    value === "done" ||
    value === "failed" ||
    value === "killed" ||
    value === "timeout"
  )
    return value;
  return null;
}
function migratedSessionScope(entry, sessionKey) {
  const chatType = migratedChatType(entry.chatType);
  const normalizedKey = sessionKey.trim().toLowerCase();
  if (chatType === "direct" && (normalizedKey === "main" || normalizedKey.endsWith(":main")))
    return "shared-main";
  if (chatType === "group" || chatType === "channel") return chatType;
  return "conversation";
}
function migratedEntryChannel(entry) {
  const deliveryContext = migratedObjectField(entry, "deliveryContext");
  const origin = migratedObjectField(entry, "origin");
  return (
    migratedText(entry.channel) ??
    migratedText(deliveryContext?.channel) ??
    migratedText(entry.lastChannel) ??
    migratedText(origin?.provider)
  );
}
function migratedEntryAccountId(entry) {
  const deliveryContext = migratedObjectField(entry, "deliveryContext");
  const origin = migratedObjectField(entry, "origin");
  return (
    migratedText(deliveryContext?.accountId) ??
    migratedText(entry.lastAccountId) ??
    migratedText(origin?.accountId)
  );
}
function migratedEntryDisplayName(entry) {
  return (
    migratedText(entry.displayName) ??
    migratedText(entry.label) ??
    migratedText(entry.subject) ??
    migratedText(entry.groupId)
  );
}
function backfillOpenClawAgentSchema(db, previousVersion) {
  if (previousVersion >= 2) return;
  db.exec(`
    INSERT OR REPLACE INTO session_routes (session_key, session_id, updated_at)
    SELECT se.session_key, se.session_id, se.updated_at
    FROM session_entries AS se
    INNER JOIN sessions AS s ON s.session_id = se.session_id;
  `);
  const rows = db
    .prepare(`
        SELECT se.session_key, se.session_id, se.entry_json
        FROM session_entries AS se
        INNER JOIN sessions AS s ON s.session_id = se.session_id;
      `)
    .all();
  const update = db.prepare(`
    UPDATE sessions
    SET
      session_scope = ?,
      started_at = ?,
      ended_at = ?,
      status = ?,
      chat_type = ?,
      channel = ?,
      account_id = ?,
      model_provider = ?,
      model = ?,
      agent_harness_id = ?,
      parent_session_key = ?,
      spawned_by = ?,
      display_name = ?
    WHERE session_id = ?;
  `);
  for (const row of rows) {
    const sessionKey = migratedText(row.session_key);
    const sessionId = migratedText(row.session_id);
    const entry = parseMigratedSessionEntry(row.entry_json);
    if (!sessionKey || !sessionId || !entry) continue;
    update.run(
      migratedSessionScope(entry, sessionKey),
      migratedNumber(entry.startedAt),
      migratedNumber(entry.endedAt),
      migratedStatus(entry.status),
      migratedChatType(entry.chatType),
      migratedEntryChannel(entry),
      migratedEntryAccountId(entry),
      migratedText(entry.modelProvider),
      migratedText(entry.model),
      migratedText(entry.agentHarnessId),
      migratedText(entry.parentSessionKey),
      migratedText(entry.spawnedBy),
      migratedEntryDisplayName(entry),
      sessionId,
    );
  }
}
function ensureOpenClawAgentDatabasePermissions(pathname, options) {
  const dir = path.dirname(pathname);
  const defaultPath = resolveOpenClawAgentSqlitePath({
    agentId: options.agentId,
    env: options.env,
  });
  const isDefaultAgentDatabase = path.resolve(pathname) === path.resolve(defaultPath);
  const dirExisted = existsSync(dir);
  mkdirSync(dir, {
    recursive: true,
    mode: OPENCLAW_AGENT_DB_DIR_MODE,
  });
  if (isDefaultAgentDatabase || !dirExisted) chmodSync(dir, OPENCLAW_AGENT_DB_DIR_MODE);
  for (const candidate of resolveSqliteDatabaseFilePaths(pathname))
    if (existsSync(candidate)) chmodSync(candidate, OPENCLAW_AGENT_DB_FILE_MODE);
}
function readExistingSchemaMeta(db) {
  if (
    !db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_meta'")
      .get()
  )
    return null;
  const row = db
    .prepare("SELECT role, schema_version, agent_id FROM schema_meta WHERE meta_key = 'primary'")
    .get();
  if (!row) return null;
  return {
    agentId: typeof row.agent_id === "string" ? row.agent_id : null,
    role: typeof row.role === "string" ? row.role : null,
    schemaVersion: typeof row.schema_version === "number" ? row.schema_version : null,
  };
}
function assertExistingSchemaOwner(existing, agentId, pathname) {
  if (!existing) return;
  if (existing.role !== "agent")
    throw new Error(
      `OpenClaw agent database ${pathname} has schema role ${existing.role ?? "unknown"}; expected agent.`,
    );
  if (!existing.agentId) throw new Error(`OpenClaw agent database ${pathname} has no agent owner.`);
  if (normalizeAgentId(existing.agentId) !== agentId)
    throw new Error(
      `OpenClaw agent database ${pathname} belongs to agent ${existing.agentId}; requested agent ${agentId}.`,
    );
}
/** Require the exact agent owner and schema before offline file maintenance. */
function assertOpenClawAgentDatabaseForMaintenance(database, options) {
  const agentId = normalizeAgentId(options.agentId);
  const metadata = readExistingSchemaMeta(database);
  if (!metadata)
    throw new Error(
      `OpenClaw agent database ${options.pathname} has no schema ownership metadata.`,
    );
  assertExistingSchemaOwner(metadata, agentId, options.pathname);
  const userVersion = readSqliteUserVersion(database);
  if (userVersion > 8)
    throw createNewerSqliteSchemaVersionError(
      "OpenClaw agent database",
      options.pathname,
      userVersion,
      8,
    );
  if (userVersion !== 8)
    throw new Error(
      `OpenClaw agent database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`,
    );
  if (metadata.schemaVersion !== 8)
    throw new Error(
      `OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 8; run openclaw doctor --fix before compacting it.`,
    );
  assertSqliteSchemaContains(database, options.pathname, OPENCLAW_AGENT_SCHEMA_SQL);
}
function ensureAgentSchema(db, agentId, pathname) {
  db.exec("PRAGMA foreign_keys = OFF;");
  try {
    runSqliteImmediateTransactionSync(db, () => {
      assertExistingSchemaOwner(readExistingSchemaMeta(db), agentId, pathname);
      assertSupportedAgentSchemaVersion(db, pathname);
      const previousVersion = readSqliteUserVersion(db);
      dropLegacyMemoryIndexSchema(db);
      dropLegacySessionTranscriptSearchSchema(db);
      migrateMemoryIndexSourcesIdentity(db);
      migrateOpenClawAgentSchema(db);
      db.exec(OPENCLAW_AGENT_SCHEMA_SQL);
      repairCanonicalSqliteUniqueIndexes(db, pathname, OPENCLAW_AGENT_CANONICAL_UNIQUE_INDEXES);
      backfillOpenClawAgentSchema(db, previousVersion);
      backfillSessionEntryProvenance(db, previousVersion);
      const kysely = getNodeSqliteKysely(db);
      db.exec(`PRAGMA user_version = 8;`);
      const now = Date.now();
      executeSqliteQuerySync(
        db,
        kysely
          .insertInto("schema_meta")
          .values({
            meta_key: "primary",
            role: "agent",
            schema_version: 8,
            agent_id: agentId,
            app_version: null,
            created_at: now,
            updated_at: now,
          })
          .onConflict((conflict) =>
            conflict.column("meta_key").doUpdateSet({
              role: "agent",
              schema_version: 8,
              agent_id: agentId,
              app_version: null,
              updated_at: now,
            }),
          ),
      );
    });
  } finally {
    db.exec("PRAGMA foreign_keys = ON;");
  }
}
/** Initialize agent schema/ownership metadata on an independently managed connection. */
function ensureOpenClawAgentDatabaseSchema(db, options) {
  const agentId = normalizeAgentId(options.agentId);
  const databaseOptions = {
    ...options,
    agentId,
  };
  const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
  ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
  assertAgentDatabaseIntegrityBeforeMutation(db, pathname);
  configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
  ensureAgentSchema(db, agentId, pathname);
  ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
  if (options.register === true)
    registerAgentDatabase({
      agentId,
      path: pathname,
      env: options.env,
    });
}
function registerAgentDatabase(params) {
  let sizeBytes = null;
  try {
    sizeBytes = statSync(params.path).size;
  } catch {
    sizeBytes = null;
  }
  const lastSeenAt = Date.now();
  runOpenClawStateWriteTransaction(
    (database) => {
      const db = getNodeSqliteKysely(database.db);
      executeSqliteQuerySync(
        database.db,
        db
          .insertInto("agent_databases")
          .values({
            agent_id: params.agentId,
            path: params.path,
            schema_version: 8,
            last_seen_at: lastSeenAt,
            size_bytes: sizeBytes,
          })
          .onConflict((conflict) =>
            conflict.columns(["agent_id", "path"]).doUpdateSet({
              schema_version: 8,
              last_seen_at: lastSeenAt,
              size_bytes: sizeBytes,
            }),
          ),
      );
    },
    { env: params.env },
  );
}
function unregisterAgentDatabase(params) {
  runOpenClawStateWriteTransaction(
    (database) => {
      const db = getNodeSqliteKysely(database.db);
      executeSqliteQuerySync(
        database.db,
        db
          .deleteFrom("agent_databases")
          .where("agent_id", "=", params.agentId)
          .where("path", "=", params.path),
      );
    },
    { env: params.env },
  );
}
function hasUnavailableMissingSqlitePath(pathname) {
  for (const candidate of resolveSqliteDatabaseFilePaths(pathname))
    try {
      lstatSync(candidate);
      return true;
    } catch (error) {
      if (error.code !== "ENOENT") return true;
    }
  let ancestor = path.dirname(pathname);
  while (true) {
    try {
      const stat = lstatSync(ancestor);
      if (!stat.isSymbolicLink()) return !stat.isDirectory();
      try {
        return !statSync(ancestor).isDirectory();
      } catch {
        return true;
      }
    } catch (error) {
      if (error.code !== "ENOENT") return true;
    }
    const parent = path.dirname(ancestor);
    if (parent === ancestor) return false;
    ancestor = parent;
  }
}
/** List agent databases recorded in the shared OpenClaw state registry. */
function listOpenClawRegisteredAgentDatabases(options = {}) {
  const pathname = path.resolve(
    options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env),
  );
  if (!existsSync(pathname)) {
    if (hasUnavailableMissingSqlitePath(pathname))
      throw new Error(`OpenClaw state database ${pathname} is unavailable.`);
    return [];
  }
  if (detectOpenClawStateDatabaseSchemaMigrations(options).length > 0)
    throw new Error(
      `OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`,
    );
  const database = new (requireNodeSqlite().DatabaseSync)(pathname, { readOnly: true });
  try {
    database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
    if (readSqliteUserVersion(database) > 2)
      throw new Error(
        `OpenClaw state database ${pathname} uses a newer schema than this OpenClaw build.`,
      );
    const registryTable = database
      .prepare("SELECT type FROM sqlite_master WHERE name = 'agent_databases'")
      .get();
    if (!registryTable) return [];
    if (registryTable.type !== "table")
      throw new Error(`OpenClaw state database ${pathname} has an invalid agent registry.`);
    return executeSqliteQuerySync(
      database,
      getNodeSqliteKysely(database)
        .selectFrom("agent_databases")
        .selectAll()
        .orderBy("agent_id", "asc")
        .orderBy("path", "asc"),
    ).rows.map((row) => ({
      agentId: normalizeAgentId(row.agent_id),
      path: row.path,
      schemaVersion: row.schema_version,
      lastSeenAt: row.last_seen_at,
      sizeBytes: row.size_bytes,
    }));
  } finally {
    clearNodeSqliteKyselyCacheForDatabase(database);
    database.close();
  }
}
/** Read a database's durable role and agent owner without mutating it. */
function inspectOpenClawAgentDatabaseOwner(pathname) {
  const sqlite = requireNodeSqlite();
  let db;
  try {
    db = new sqlite.DatabaseSync(pathname, { readOnly: true });
    db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
    assertSupportedAgentSchemaVersion(db, pathname);
    const existing = readExistingSchemaMeta(db);
    if (!existing) return { status: "unowned" };
    if (existing.role !== "agent" || !existing.agentId) return { status: "unreadable" };
    return {
      status: "owned",
      agentId: normalizeAgentId(existing.agentId),
    };
  } catch {
    return { status: "unreadable" };
  } finally {
    db?.close();
  }
}
function assertAgentDatabaseIntegrityBeforeMutation(database, pathname) {
  database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
  assertSqliteIntegrity(database, pathname);
}
/** Open or return a cached per-agent database after schema and owner validation. */
function openOpenClawAgentDatabase(options) {
  const agentId = normalizeAgentId(options.agentId);
  const databaseOptions = {
    ...options,
    agentId,
  };
  const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
  const cached = cachedDatabases.get(pathname);
  if (cached?.db.isOpen) {
    if (cached.agentId !== agentId)
      throw new Error(
        `OpenClaw agent database ${pathname} is already open for agent ${cached.agentId}; requested agent ${agentId}.`,
      );
    return cached;
  }
  if (cached) {
    cached.walMaintenance.close();
    clearNodeSqliteKyselyCacheForDatabase(cached.db);
    cachedDatabases.delete(pathname);
  }
  const openStartedAt = Date.now();
  ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
  const db = new (requireNodeSqlite().DatabaseSync)(pathname);
  const walMaintenance = (() => {
    let maintenance;
    try {
      assertAgentDatabaseIntegrityBeforeMutation(db, pathname);
      configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
      maintenance = configureSqliteConnectionPragmas(db, {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: `openclaw-agent:${agentId}`,
        databasePath: pathname,
        foreignKeys: true,
        synchronous: "NORMAL",
      });
      ensureAgentSchema(db, agentId, pathname);
      return maintenance;
    } catch (err) {
      maintenance?.close();
      db.close();
      throw err;
    }
  })();
  ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
  const database = {
    agentId,
    db,
    path: pathname,
    walMaintenance,
  };
  try {
    registerAgentDatabase({
      agentId,
      path: pathname,
      env: options.env,
    });
  } catch (error) {
    closeCachedOpenClawAgentDatabase(database);
    throw error;
  }
  cachedDatabases.set(pathname, database);
  unregisterExitClose ??= registerSqliteCacheExitClose(closeOpenClawAgentDatabases);
  logSlowAgentDatabaseOpen({
    agentId,
    elapsedMs: Date.now() - openStartedAt,
    path: pathname,
  });
  return database;
}
/** Run a synchronous immediate transaction against an agent database. */
const postCommitPublications = /* @__PURE__ */ new WeakMap();
/** Queue a non-throwing runtime publication on the outer database commit edge. */
function deferOpenClawAgentPostCommitPublication(database, publish) {
  const publications = postCommitPublications.get(database);
  if (!publications) return false;
  publications.push(publish);
  return true;
}
function runOpenClawAgentWriteTransaction(operation, options, transactionOptions = {}) {
  const database = openOpenClawAgentDatabase(options);
  const enteredNestedTransaction = database.db.isTransaction;
  const publications = enteredNestedTransaction ? postCommitPublications.get(database) : [];
  const publicationStart = publications?.length ?? 0;
  if (!enteredNestedTransaction && publications) postCommitPublications.set(database, publications);
  let result;
  try {
    result = runSqliteImmediateTransactionSync(
      database.db,
      () => {
        const operationResult = operation(database);
        if (!enteredNestedTransaction)
          ensureOpenClawAgentDatabasePermissions(database.path, options);
        return operationResult;
      },
      {
        busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
        databaseLabel: database.path,
        ...transactionOptions,
        operationLabel: transactionOptions.operationLabel ?? "agent.write",
      },
    );
  } catch (error) {
    publications?.splice(publicationStart);
    throw error;
  } finally {
    if (!enteredNestedTransaction && publications) postCommitPublications.delete(database);
  }
  if (!enteredNestedTransaction) for (const publish of publications ?? []) publish();
  return result;
}
let unregisterExitClose = null;
function closeCachedOpenClawAgentDatabase(database) {
  database.walMaintenance.close();
  clearNodeSqliteKyselyCacheForDatabase(database.db);
  if (database.db.isOpen) database.db.close();
}
/** Return whether the exact cached agent database pathname is still open. */
function isOpenClawAgentDatabaseOpen(pathname) {
  return cachedDatabases.get(path.resolve(pathname))?.db.isOpen === true;
}
/** Close one cached agent database identified by its exact resolved pathname. */
function closeOpenClawAgentDatabaseByPath(pathname) {
  const resolvedPath = path.resolve(pathname);
  const database = cachedDatabases.get(resolvedPath);
  if (!database) return false;
  closeCachedOpenClawAgentDatabase(database);
  cachedDatabases.delete(resolvedPath);
  if (cachedDatabases.size === 0) {
    unregisterExitClose?.();
    unregisterExitClose = null;
  }
  return true;
}
/** Close and unregister one transient agent database by exact cached pathname. */
function disposeOpenClawAgentDatabaseByPath(pathname, options = {}) {
  const resolvedPath = path.resolve(pathname);
  const database = cachedDatabases.get(resolvedPath);
  if (!database || database.path !== resolvedPath) return false;
  try {
    unregisterAgentDatabase({
      agentId: database.agentId,
      path: resolvedPath,
      ...(options.env ? { env: options.env } : {}),
    });
  } finally {
    closeOpenClawAgentDatabaseByPath(resolvedPath);
  }
  return true;
}
/** Close all cached agent database handles. */
function closeOpenClawAgentDatabases() {
  unregisterExitClose?.();
  unregisterExitClose = null;
  for (const database of cachedDatabases.values()) closeCachedOpenClawAgentDatabase(database);
  cachedDatabases.clear();
}
//#endregion
export {
  ensureMemoryIndexSchema as C,
  dropMemoryPathFtsTriggers as S,
  formatErrorMessage as T,
  MEMORY_INDEX_META_TABLE as _,
  disposeOpenClawAgentDatabaseByPath as a,
  MEMORY_INDEX_STATE_TABLE as b,
  inspectOpenClawAgentDatabaseOwner as c,
  openOpenClawAgentDatabase as d,
  runOpenClawAgentWriteTransaction as f,
  MEMORY_INDEX_FTS_TABLE as g,
  MEMORY_INDEX_CHUNKS_TABLE as h,
  deferOpenClawAgentPostCommitPublication as i,
  isOpenClawAgentDatabaseOpen as l,
  MEMORY_EMBEDDING_CACHE_TABLE as m,
  closeOpenClawAgentDatabaseByPath as n,
  ensureOpenClawAgentDatabasePermissions as o,
  resolveOpenClawAgentSqlitePath as p,
  closeOpenClawAgentDatabases as r,
  ensureOpenClawAgentDatabaseSchema as s,
  assertOpenClawAgentDatabaseForMaintenance as t,
  listOpenClawRegisteredAgentDatabases as u,
  MEMORY_INDEX_PATHS_FTS_TABLE as v,
  ensureMemoryPathFtsTriggers as w,
  MEMORY_INDEX_VECTOR_TABLE as x,
  MEMORY_INDEX_SOURCES_TABLE as y,
};
