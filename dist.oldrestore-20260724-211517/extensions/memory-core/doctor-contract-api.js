import crypto, { createHash } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import "../../routing-CwvmVRHd.js";
import { isDeepStrictEqual } from "node:util";
import { n as normalizeAgentId } from "../../agent-id-DDgUze4y.js";
import "../../sqlite-runtime-CAq0c_tq.js";
import "../../memory-core-host-status-BYxFcXad.js";
import "../../memory-core-host-engine-foundation-GFDZKXDt.js";
import "../../memory-core-host-engine-storage-eNQx81fD.js";
import { Y as resolveMemoryDreamingWorkspaces } from "../../dreaming-CM8RB1ct.js";
import {
  a as normalizeSessionIngestionState,
  i as normalizeDailyIngestionState,
  n as SESSION_INGESTION_STATE_RELATIVE_PATH,
  t as DAILY_INGESTION_STATE_RELATIVE_PATH,
} from "../../dreaming-phases-z-A3H73T.js";
import {
  _ as writeMemoryCoreWorkspaceEntries,
  c as SHORT_TERM_RECALL_NAMESPACE,
  g as readMemoryCoreWorkspaceEntries,
  n as DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
  o as SHORT_TERM_META_NAMESPACE,
  r as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
  s as SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
  t as DREAMING_DAILY_INGESTION_NAMESPACE,
  u as configureMemoryCoreDreamingState,
  v as writeMemoryCoreWorkspaceEntry,
} from "../../dreaming-state-DLMGVRgZ.js";
import {
  i as loadSqliteVecExtension,
  r as requireMemoryHostNodeSqlite,
} from "../../engine-storage-DV2x5DKD.js";
import { c as resolveUserPath } from "../../home-dir-DxrrpDft.js";
import {
  C as ensureMemoryIndexSchema,
  _ as MEMORY_INDEX_META_TABLE,
  g as MEMORY_INDEX_FTS_TABLE,
  h as MEMORY_INDEX_CHUNKS_TABLE,
  m as MEMORY_EMBEDDING_CACHE_TABLE,
  p as resolveOpenClawAgentSqlitePath,
  s as ensureOpenClawAgentDatabaseSchema,
  x as MEMORY_INDEX_VECTOR_TABLE,
  y as MEMORY_INDEX_SOURCES_TABLE,
} from "../../openclaw-agent-db-VC51jrBW.js";
import {
  n as legacyStateFileExists,
  t as archiveLegacyStateSource,
} from "../../runtime-doctor-DOtJb07X.js";
import {
  a as SHORT_TERM_STORE_RELATIVE_PATH,
  d as normalizeShortTermPhaseSignalStore,
  f as normalizeShortTermRecallStore,
  i as SHORT_TERM_PHASE_SIGNAL_RELATIVE_PATH,
} from "../../short-term-promotion-Km7alBR_.js";
//#region extensions/memory-core/src/migration/dreaming-state-comparison.ts
const LEGACY_SOURCE_ACKNOWLEDGEMENT_NAMESPACE = "legacy-dreaming-source-acknowledgements";
function targetNamespacesForSource(label) {
  if (label === "daily ingestion") return [DREAMING_DAILY_INGESTION_NAMESPACE];
  if (label === "session ingestion")
    return [DREAMING_SESSION_INGESTION_FILES_NAMESPACE, DREAMING_SESSION_INGESTION_SEEN_NAMESPACE];
  return [
    label === "short-term recall" ? SHORT_TERM_RECALL_NAMESPACE : SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
  ];
}
function asRecord$1(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
async function memoryCoreLegacyTargetHasRows(source) {
  return (
    await Promise.all(
      targetNamespacesForSource(source.label).map(
        async (namespace) =>
          (
            await readMemoryCoreWorkspaceEntries({
              namespace,
              workspaceDir: source.workspaceDir,
            })
          ).length,
      ),
    )
  ).some((count) => count > 0);
}
async function memoryCoreLegacySourceMatchesCanonical(source, raw) {
  if (source.label === "daily ingestion") {
    const rows = await readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
      workspaceDir: source.workspaceDir,
    });
    return isDeepStrictEqual(
      normalizeDailyIngestionState(raw),
      normalizeDailyIngestionState({
        version: 1,
        files: Object.fromEntries(rows.map((row) => [row.key, row.value])),
      }),
    );
  }
  if (source.label === "session ingestion") {
    const [fileRows, seenRows] = await Promise.all([
      readMemoryCoreWorkspaceEntries({
        namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
        workspaceDir: source.workspaceDir,
      }),
      readMemoryCoreWorkspaceEntries({
        namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
        workspaceDir: source.workspaceDir,
      }),
    ]);
    const chunksByScope = /* @__PURE__ */ new Map();
    for (const row of seenRows) {
      const chunks = chunksByScope.get(row.value.scope) ?? [];
      chunks.push({
        index: row.value.index,
        hashes: row.value.hashes,
      });
      chunksByScope.set(row.value.scope, chunks);
    }
    return isDeepStrictEqual(
      normalizeSessionIngestionState(raw),
      normalizeSessionIngestionState({
        version: 3,
        files: Object.fromEntries(fileRows.map((row) => [row.key, row.value])),
        seenMessages: Object.fromEntries(
          [...chunksByScope].map(([scope, chunks]) => [
            scope,
            chunks.toSorted((left, right) => left.index - right.index).flatMap((row) => row.hashes),
          ]),
        ),
      }),
    );
  }
  const [entryRows, metaRows] = await Promise.all([
    readMemoryCoreWorkspaceEntries({
      namespace:
        source.label === "short-term recall"
          ? SHORT_TERM_RECALL_NAMESPACE
          : SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
      workspaceDir: source.workspaceDir,
    }),
    readMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir: source.workspaceDir,
    }),
  ]);
  const metaKey = source.label === "short-term recall" ? "recall" : "phase";
  const updatedAt = metaRows.find((row) => row.key === metaKey)?.value.updatedAt;
  if (typeof updatedAt !== "string" || updatedAt.length === 0) return false;
  const canonicalRaw = {
    version: 1,
    updatedAt,
    entries: Object.fromEntries(entryRows.map((row) => [row.key, row.value])),
  };
  if (source.label === "short-term recall") {
    const canonical = normalizeShortTermRecallStore(canonicalRaw, updatedAt);
    const fallbackCandidates = /* @__PURE__ */ new Set([updatedAt]);
    for (const row of entryRows) {
      const value = asRecord$1(row.value);
      for (const key of ["firstRecalledAt", "lastRecalledAt"])
        if (typeof value?.[key] === "string") fallbackCandidates.add(value[key]);
    }
    return [...fallbackCandidates].some((fallback) =>
      isDeepStrictEqual(normalizeShortTermRecallStore(raw, fallback), canonical),
    );
  }
  return isDeepStrictEqual(
    normalizeShortTermPhaseSignalStore(raw, updatedAt),
    normalizeShortTermPhaseSignalStore(canonicalRaw, updatedAt),
  );
}
async function memoryCoreLegacySourceIsAcknowledged(source) {
  const contents = await fs$1.readFile(source.filePath);
  const sha256 = createHash("sha256").update(contents).digest("hex");
  const markerKey = `legacy-source:${source.label}`;
  if (
    (
      await readMemoryCoreWorkspaceEntries({
        namespace: LEGACY_SOURCE_ACKNOWLEDGEMENT_NAMESPACE,
        workspaceDir: source.workspaceDir,
      })
    ).find((row) => row.key === markerKey)?.value.sha256 === sha256
  )
    return true;
  let archiveNames = [];
  try {
    const archivePrefix = `${path.basename(source.filePath)}.migrated`;
    archiveNames = (await fs$1.readdir(path.dirname(source.filePath))).filter((name) => {
      if (name === archivePrefix) return true;
      const suffix = name.slice(archivePrefix.length + 1);
      const archiveIndex = Number(suffix);
      return (
        name.startsWith(`${archivePrefix}.`) &&
        Number.isSafeInteger(archiveIndex) &&
        archiveIndex >= 2 &&
        String(archiveIndex) === suffix
      );
    });
  } catch {}
  let matchesArchive = false;
  for (const archiveName of archiveNames)
    try {
      if (
        contents.equals(await fs$1.readFile(path.join(path.dirname(source.filePath), archiveName)))
      ) {
        matchesArchive = true;
        break;
      }
    } catch {}
  if (
    !matchesArchive &&
    !(await memoryCoreLegacySourceMatchesCanonical(source, JSON.parse(contents.toString("utf8"))))
  )
    return false;
  await writeMemoryCoreWorkspaceEntry({
    namespace: LEGACY_SOURCE_ACKNOWLEDGEMENT_NAMESPACE,
    workspaceDir: source.workspaceDir,
    key: markerKey,
    value: { sha256 },
  });
  return true;
}
const dreamingStateComparison = {
  targetHasRows: memoryCoreLegacyTargetHasRows,
  sourceIsAcknowledged: memoryCoreLegacySourceIsAcknowledged,
};
//#endregion
//#region extensions/memory-core/doctor-contract-api.ts
const LEGACY_MEMORY_SIDECAR_SUFFIXES = ["", "-wal", "-shm", "-journal"];
const LEGACY_MEMORY_SIDECAR_SCHEMA = "legacy_memory_sidecar";
const LEGACY_MEMORY_VECTOR_TABLE = "chunks_vec";
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
const LEGACY_MEMORY_SOURCE_COLUMNS = ["path", "source", "hash", "mtime", "size"];
const LEGACY_MEMORY_CHUNK_COLUMNS = [
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
];
const LEGACY_MEMORY_CACHE_COLUMNS = [
  "provider",
  "model",
  "provider_key",
  "hash",
  "embedding",
  "dims",
  "updated_at",
];
var LegacyMemoryRowsConflictError = class extends Error {
  constructor(tableName) {
    super(`legacy memory ${tableName} rows conflict with canonical memory index rows`);
    this.tableName = tableName;
  }
};
function tableExists(db, schema, tableName) {
  return Boolean(db.prepare(`SELECT 1 FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName));
}
function tableColumns(db, tableName, schema = "main") {
  const rows = db.prepare(`PRAGMA ${schema}.table_info(${tableName})`).all();
  return new Set(rows.flatMap((row) => (typeof row.name === "string" ? [row.name] : [])));
}
function tableHasColumns(db, tableName, expected, schema = "main") {
  const columns = tableColumns(db, tableName, schema);
  return expected.every((column) => columns.has(column));
}
function tableHasExactColumns(db, tableName, expected, schema = "main") {
  const columns = tableColumns(db, tableName, schema);
  return columns.size === expected.length && expected.every((column) => columns.has(column));
}
function hasLegacyMemoryIndexTables(db, schema = "main") {
  return (
    tableHasExactColumns(db, "meta", ["key", "value"], schema) &&
    tableHasExactColumns(db, "files", LEGACY_MEMORY_SOURCE_COLUMNS, schema) &&
    tableHasExactColumns(db, "chunks", LEGACY_MEMORY_CHUNK_COLUMNS, schema)
  );
}
function hasLegacyEmbeddingCacheTable(db, schema = "main") {
  return tableHasExactColumns(db, "embedding_cache", LEGACY_MEMORY_CACHE_COLUMNS, schema);
}
function hasLegacyVectorTable(db, schema = "main") {
  return tableHasColumns(db, LEGACY_MEMORY_VECTOR_TABLE, ["id", "embedding"], schema);
}
function tableRowCount(db, schema, tableName) {
  const row = db.prepare(`SELECT COUNT(*) AS count FROM ${schema}.${tableName}`).get();
  return Number(row?.count ?? 0);
}
function readLegacySidecarCounts(db, schema, options) {
  const vectorEntries = options.copyVectorRows
    ? readLegacyVectorEntriesForCopy(db, schema)
    : readLegacyVectorEntriesWithoutCopy(db, schema);
  return {
    sources: tableRowCount(db, schema, "files"),
    chunks: tableRowCount(db, schema, "chunks"),
    cacheEntries: hasLegacyEmbeddingCacheTable(db, schema)
      ? tableRowCount(db, schema, "embedding_cache")
      : 0,
    vectorEntries,
  };
}
function readLegacyVectorEntriesForCopy(db, schema) {
  if (!tableExists(db, schema, LEGACY_MEMORY_VECTOR_TABLE)) return 0;
  return hasLegacyVectorTable(db, schema)
    ? tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE)
    : void 0;
}
function readLegacyVectorEntriesWithoutCopy(db, schema) {
  if (!tableExists(db, schema, LEGACY_MEMORY_VECTOR_TABLE)) return 0;
  try {
    if (!hasLegacyVectorTable(db, schema)) return;
    return tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE);
  } catch {
    return;
  }
}
function formatLegacyVectorRows(count) {
  return count === void 0 ? "legacy vector rows" : `${count} vector row(s)`;
}
function assertLegacyRowsCopied(db, query, tableName) {
  const row = db.prepare(query).get();
  if (Number(row?.missing ?? 0) > 0) throw new LegacyMemoryRowsConflictError(tableName);
}
function readMemoryIndexMetaVectorDimensions(db, schema, tableName) {
  if (!tableExists(db, schema, tableName)) return;
  const meta = db
    .prepare(`SELECT value FROM ${schema}.${tableName} WHERE key = ?`)
    .get(MEMORY_INDEX_META_KEY);
  if (typeof meta?.value !== "string") return;
  try {
    const parsed = JSON.parse(meta.value);
    if (Number.isSafeInteger(parsed.vectorDims) && Number(parsed.vectorDims) > 0)
      return Number(parsed.vectorDims);
  } catch {}
}
function readVectorTableSqlDimensions(db, schema, tableName) {
  const row = db.prepare(`SELECT sql FROM ${schema}.sqlite_master WHERE name = ?`).get(tableName);
  if (typeof row?.sql !== "string") return;
  const match = /embedding\s+FLOAT\[(\d+)\]/i.exec(row.sql);
  const dimensions = Number(match?.[1] ?? 0);
  return Number.isSafeInteger(dimensions) && dimensions > 0 ? dimensions : void 0;
}
function readLegacyVectorDimensions(db, schema) {
  const metaDimensions = readMemoryIndexMetaVectorDimensions(db, schema, "meta");
  if (metaDimensions) return metaDimensions;
  const tableSqlDimensions = readVectorTableSqlDimensions(db, schema, LEGACY_MEMORY_VECTOR_TABLE);
  if (tableSqlDimensions) return tableSqlDimensions;
  const row = db
    .prepare(
      `SELECT length(embedding) AS bytes FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} WHERE embedding IS NOT NULL LIMIT 1`,
    )
    .get();
  const bytes = Number(row?.bytes ?? 0);
  if (Number.isSafeInteger(bytes) && bytes > 0 && bytes % Float32Array.BYTES_PER_ELEMENT === 0)
    return bytes / Float32Array.BYTES_PER_ELEMENT;
}
function readCanonicalVectorDimensions(db) {
  return (
    readVectorTableSqlDimensions(db, "main", "memory_index_chunks_vec") ??
    readMemoryIndexMetaVectorDimensions(db, "main", "memory_index_meta")
  );
}
function ensureCanonicalVectorTableForLegacyRows(db, schema) {
  if (
    !hasLegacyVectorTable(db, schema) ||
    tableRowCount(db, schema, LEGACY_MEMORY_VECTOR_TABLE) === 0
  )
    return;
  const dimensions = readLegacyVectorDimensions(db, schema);
  if (!Number.isSafeInteger(dimensions) || Number(dimensions) <= 0)
    throw new Error("legacy memory chunks_vec rows require vector dimensions before import");
  if (tableExists(db, "main", "memory_index_chunks_vec")) {
    const canonicalDimensions = readCanonicalVectorDimensions(db);
    if (!Number.isSafeInteger(canonicalDimensions) || Number(canonicalDimensions) <= 0)
      throw new Error(
        "canonical memory chunks_vec table requires vector dimensions before legacy import",
      );
    if (Number(canonicalDimensions) !== Number(dimensions))
      throw new Error(
        `legacy memory chunks_vec dimensions ${Number(dimensions)} do not match canonical memory chunks_vec dimensions ${Number(canonicalDimensions)}`,
      );
    return;
  }
  const canonicalMetaDimensions = readMemoryIndexMetaVectorDimensions(
    db,
    "main",
    MEMORY_INDEX_META_TABLE,
  );
  if (
    Number.isSafeInteger(canonicalMetaDimensions) &&
    Number(canonicalMetaDimensions) > 0 &&
    Number(canonicalMetaDimensions) !== Number(dimensions)
  )
    throw new Error(
      `legacy memory chunks_vec dimensions ${Number(dimensions)} do not match canonical memory chunks_vec dimensions ${Number(canonicalMetaDimensions)}`,
    );
  db.exec(
    `CREATE VIRTUAL TABLE IF NOT EXISTS main.${MEMORY_INDEX_VECTOR_TABLE} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${Number(dimensions)}]\n)`,
  );
}
function copyLegacyMemoryVectorRows(db, schema) {
  if (!hasLegacyVectorTable(db, schema)) return;
  ensureCanonicalVectorTableForLegacyRows(db, schema);
  if (!tableExists(db, "main", "memory_index_chunks_vec")) return;
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk
       WHERE chunk.id = legacy.id
     )`,
    `${LEGACY_MEMORY_VECTOR_TABLE} chunk references`,
  );
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     JOIN main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical ON canonical.id = legacy.id
     WHERE canonical.embedding IS NOT legacy.embedding`,
    LEGACY_MEMORY_VECTOR_TABLE,
  );
  db.exec(`
    INSERT OR IGNORE INTO main.${MEMORY_INDEX_VECTOR_TABLE} (id, embedding)
    SELECT legacy.id, legacy.embedding
    FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
    JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
    WHERE NOT EXISTS (
      SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
      WHERE canonical.id = legacy.id
    );
  `);
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.${LEGACY_MEMORY_VECTOR_TABLE} AS legacy
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_VECTOR_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.embedding IS legacy.embedding
     )`,
    LEGACY_MEMORY_VECTOR_TABLE,
  );
}
function copyLegacyMemoryFtsRows(db, schema) {
  if (!tableExists(db, "main", "memory_index_chunks_fts")) return;
  db.exec(`
    INSERT INTO main.${MEMORY_INDEX_FTS_TABLE} (
      text, id, path, source, model, start_line, end_line
    )
    SELECT legacy.text, legacy.id, legacy.path, legacy.source, legacy.model,
           legacy.start_line, legacy.end_line
    FROM ${schema}.chunks AS legacy
    JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
    WHERE NOT EXISTS (
      SELECT 1 FROM main.${MEMORY_INDEX_FTS_TABLE} AS canonical
      WHERE canonical.id = legacy.id
    );
  `);
  assertLegacyRowsCopied(
    db,
    `SELECT COUNT(*) AS missing
     FROM ${schema}.chunks AS legacy
     JOIN main.${MEMORY_INDEX_CHUNKS_TABLE} AS chunk ON chunk.id = legacy.id
     WHERE NOT EXISTS (
       SELECT 1 FROM main.${MEMORY_INDEX_FTS_TABLE} AS canonical
       WHERE canonical.id = legacy.id
         AND canonical.text IS legacy.text
         AND canonical.path IS legacy.path
         AND canonical.source IS legacy.source
         AND canonical.model IS legacy.model
         AND canonical.start_line IS legacy.start_line
         AND canonical.end_line IS legacy.end_line
     )`,
    "fts",
  );
}
function copyLegacyMemoryIndexRows(db, schema, options) {
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
  copyLegacyMemoryFtsRows(db, schema);
  if (options.copyVectorRows) copyLegacyMemoryVectorRows(db, schema);
  if (hasLegacyEmbeddingCacheTable(db, schema)) {
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
function importLegacyMemorySidecarIndex(params) {
  if (!params.legacySidecarDatabasePath || !fs.existsSync(params.legacySidecarDatabasePath))
    return {
      imported: false,
      reason: "missing-sidecar",
      sources: 0,
      chunks: 0,
      cacheEntries: 0,
      vectorEntries: 0,
      vectorEntriesImported: true,
    };
  params.db
    .prepare(`ATTACH DATABASE ? AS ${LEGACY_MEMORY_SIDECAR_SCHEMA}`)
    .run(params.legacySidecarDatabasePath);
  try {
    if (!hasLegacyMemoryIndexTables(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA))
      return {
        imported: false,
        reason: "legacy-schema-missing",
        sources: 0,
        chunks: 0,
        cacheEntries: 0,
        vectorEntries: 0,
        vectorEntriesImported: true,
      };
    const counts = readLegacySidecarCounts(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA, {
      copyVectorRows: params.copyVectorRows,
    });
    params.db.exec("SAVEPOINT import_legacy_sidecar_memory_index");
    try {
      copyLegacyMemoryIndexRows(params.db, LEGACY_MEMORY_SIDECAR_SCHEMA, {
        copyVectorRows: params.copyVectorRows,
      });
      params.db.exec("RELEASE import_legacy_sidecar_memory_index");
      return {
        imported: true,
        ...counts,
        vectorEntriesImported:
          counts.vectorEntries === 0 ||
          !params.requireVectorRows ||
          (params.copyVectorRows && counts.vectorEntries !== void 0),
      };
    } catch (err) {
      params.db.exec("ROLLBACK TO import_legacy_sidecar_memory_index");
      params.db.exec("RELEASE import_legacy_sidecar_memory_index");
      throw err;
    }
  } finally {
    params.db.exec(`DETACH DATABASE ${LEGACY_MEMORY_SIDECAR_SCHEMA}`);
  }
}
function resolveConfiguredAgentIds(config) {
  const cfg = config;
  const ids = /* @__PURE__ */ new Set();
  if (Array.isArray(cfg.agents?.list))
    for (const entry of cfg.agents.list) {
      if (!entry || typeof entry !== "object") continue;
      const id = entry.id;
      ids.add(normalizeAgentId(typeof id === "string" ? id : void 0));
    }
  if (ids.size === 0) ids.add(normalizeAgentId(void 0));
  return [...ids];
}
function asRecord(value) {
  return value && typeof value === "object" ? value : void 0;
}
function readAgentMemorySearch(config, agentId) {
  const agents = asRecord(asRecord(config)?.agents);
  return asRecord(
    (Array.isArray(agents?.list) ? agents.list : [])
      .map(asRecord)
      .find(
        (entry) => normalizeAgentId(typeof entry?.id === "string" ? entry.id : void 0) === agentId,
      )?.memorySearch,
  );
}
function readDefaultMemorySearch(config) {
  return asRecord(asRecord(asRecord(asRecord(config)?.agents)?.defaults)?.memorySearch);
}
function readTopLevelMemorySearch(config) {
  return asRecord(asRecord(config)?.memorySearch);
}
function readMemorySearchVectorExtensionPath(config, agentId) {
  const defaultVector = asRecord(asRecord(readDefaultMemorySearch(config)?.store)?.vector);
  const agentVector = asRecord(asRecord(readAgentMemorySearch(config, agentId)?.store)?.vector);
  const topLevelVector = asRecord(asRecord(readTopLevelMemorySearch(config)?.store)?.vector);
  const raw =
    agentVector?.extensionPath ?? defaultVector?.extensionPath ?? topLevelVector?.extensionPath;
  return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
function readMemorySearchVectorEnabled(config, agentId) {
  if (readMemorySearchProvider(config, agentId) === "none") return false;
  const defaultVector = asRecord(asRecord(readDefaultMemorySearch(config)?.store)?.vector);
  const agentVector = asRecord(asRecord(readAgentMemorySearch(config, agentId)?.store)?.vector);
  const topLevelVector = asRecord(asRecord(readTopLevelMemorySearch(config)?.store)?.vector);
  const raw = agentVector?.enabled ?? defaultVector?.enabled ?? topLevelVector?.enabled;
  return typeof raw === "boolean" ? raw : true;
}
function readMemorySearchProvider(config, agentId) {
  const raw =
    readAgentMemorySearch(config, agentId)?.provider ??
    readDefaultMemorySearch(config)?.provider ??
    readTopLevelMemorySearch(config)?.provider;
  return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
function readLegacyMemorySearchStorePaths(config, agentId) {
  const agentStore = asRecord(readAgentMemorySearch(config, agentId)?.store);
  const defaultsStore = asRecord(readDefaultMemorySearch(config)?.store);
  const topLevelStore = asRecord(readTopLevelMemorySearch(config)?.store);
  const paths = [];
  const seen = /* @__PURE__ */ new Set();
  for (const raw of [agentStore?.path, defaultsStore?.path, topLevelStore?.path]) {
    if (typeof raw !== "string" || !raw.trim()) continue;
    const trimmed = raw.trim();
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      paths.push(trimmed);
    }
  }
  return paths;
}
function readMemorySearchFtsTokenizer(config, agentId) {
  const agentFts = asRecord(asRecord(readAgentMemorySearch(config, agentId)?.store)?.fts);
  const defaultsFts = asRecord(asRecord(readDefaultMemorySearch(config)?.store)?.fts);
  const topLevelFts = asRecord(asRecord(readTopLevelMemorySearch(config)?.store)?.fts);
  const raw = agentFts?.tokenizer ?? defaultsFts?.tokenizer ?? topLevelFts?.tokenizer;
  return raw === "unicode61" || raw === "trigram" ? raw : void 0;
}
function isDiscoveredRetryMemorySidecarPath(params) {
  const sourcePath = path.resolve(params.source.legacyPath);
  const memoryDir = path.resolve(params.source.stateDir, "memory");
  const sourceName = path.basename(sourcePath);
  return (
    path.dirname(sourcePath) === memoryDir &&
    sourceName.startsWith(`${params.source.agentId}.retry-`) &&
    sourceName.endsWith(".sqlite")
  );
}
function resolveLegacyMemorySearchStorePath(rawPath, agentId, env) {
  return resolveUserPath(rawPath.replaceAll("{agentId}", agentId), env);
}
async function collectLegacyMemorySidecarSources(params) {
  const agentIds = new Set(resolveConfiguredAgentIds(params.config));
  const legacyDir = path.join(params.stateDir, "memory");
  const retrySidecars = [];
  try {
    const entries = await fs$1.readdir(legacyDir, { withFileTypes: true });
    for (const entry of entries)
      if (entry.isFile() && entry.name.endsWith(".sqlite")) {
        const stem = entry.name.slice(0, -7);
        const retryIndex = stem.indexOf(".retry-");
        const rawAgentId = retryIndex === -1 ? stem : stem.slice(0, retryIndex);
        const agentId = normalizeAgentId(rawAgentId);
        if (retryIndex !== -1 && rawAgentId === agentId && agentIds.has(agentId))
          retrySidecars.push({
            agentId,
            legacyPath: path.join(legacyDir, entry.name),
          });
      }
  } catch {}
  const migrationEnv = {
    ...params.env,
    OPENCLAW_STATE_DIR: params.stateDir,
  };
  const sources = [];
  const seen = /* @__PURE__ */ new Set();
  async function addSource(agentId, legacyPath) {
    const normalizedPath = path.resolve(legacyPath);
    const key = `${agentId}\0${normalizedPath}`;
    if (seen.has(key) || !(await legacyStateFileExists(normalizedPath))) return;
    seen.add(key);
    sources.push({
      agentId,
      legacyPath: normalizedPath,
      stateDir: params.stateDir,
      agentDatabasePath: resolveOpenClawAgentSqlitePath({
        agentId,
        env: migrationEnv,
      }),
    });
  }
  for (const agentId of agentIds) {
    for (const configuredPath of readLegacyMemorySearchStorePaths(params.config, agentId))
      await addSource(
        agentId,
        resolveLegacyMemorySearchStorePath(configuredPath, agentId, migrationEnv),
      );
    await addSource(agentId, path.join(legacyDir, `${agentId}.sqlite`));
  }
  for (const retrySidecar of retrySidecars)
    await addSource(retrySidecar.agentId, retrySidecar.legacyPath);
  return sources;
}
async function archiveLegacyMemorySidecar(params) {
  const existingSources = (
    await Promise.all(
      LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
        const filePath = `${params.source.legacyPath}${suffix}`;
        return (await legacyStateFileExists(filePath)) ? filePath : null;
      }),
    )
  ).filter((filePath) => filePath !== null);
  if (existingSources.length === 0) return;
  const existingArchives = (
    await Promise.all(
      existingSources.map(async (sourcePath) => {
        const archivedPath = `${sourcePath}.migrated`;
        return (await legacyStateFileExists(archivedPath)) ? archivedPath : null;
      }),
    )
  ).filter((filePath) => filePath !== null);
  if (existingArchives.length > 0) {
    params.warnings.push(
      `Left migrated Memory Core legacy memory index sidecar in place because ${existingArchives[0]} already exists`,
    );
    return;
  }
  const renamed = [];
  for (const sourcePath of existingSources) {
    const archivedPath = `${sourcePath}.migrated`;
    try {
      await fs$1.rename(sourcePath, archivedPath);
      renamed.push({
        sourcePath,
        archivedPath,
      });
    } catch (err) {
      for (const entry of renamed.toReversed())
        try {
          if (
            (await legacyStateFileExists(entry.archivedPath)) &&
            !(await legacyStateFileExists(entry.sourcePath))
          )
            await fs$1.rename(entry.archivedPath, entry.sourcePath);
        } catch (rollbackErr) {
          params.warnings.push(
            `Failed restoring Memory Core legacy memory index sidecar ${entry.archivedPath}: ${String(rollbackErr)}`,
          );
        }
      params.warnings.push(
        `Failed archiving Memory Core legacy memory index sidecar ${sourcePath}: ${String(err)}; restored ${renamed.length} already archived file(s)`,
      );
      return;
    }
  }
  params.changes.push(
    `Archived Memory Core legacy memory index sidecar -> ${params.source.legacyPath}.migrated`,
  );
}
async function preserveLegacyMemorySidecarRetryPath(params) {
  const retryPath = path.join(params.source.stateDir, "memory", `${params.source.agentId}.sqlite`);
  if (path.resolve(retryPath) === path.resolve(params.source.legacyPath)) return;
  if (isDiscoveredRetryMemorySidecarPath(params)) return;
  const targetBasePath =
    (
      await Promise.all(
        LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
          const targetPath = `${retryPath}${suffix}`;
          return (await legacyStateFileExists(targetPath)) ? targetPath : null;
        }),
      )
    ).filter((targetPath) => targetPath !== null).length === 0
      ? retryPath
      : path.join(
          params.source.stateDir,
          "memory",
          `${params.source.agentId}.retry-${crypto.createHash("sha256").update(path.resolve(params.source.legacyPath)).digest("hex").slice(0, 12)}.sqlite`,
        );
  if (await legacyStateFileExists(targetBasePath)) return;
  const existingSources = (
    await Promise.all(
      LEGACY_MEMORY_SIDECAR_SUFFIXES.map(async (suffix) => {
        const sourcePath = `${params.source.legacyPath}${suffix}`;
        return (await legacyStateFileExists(sourcePath))
          ? {
              sourcePath,
              targetPath: `${targetBasePath}${suffix}`,
            }
          : null;
      }),
    )
  ).filter((entry) => entry !== null);
  if (existingSources.length === 0) return;
  await fs$1.mkdir(path.dirname(targetBasePath), { recursive: true });
  const copied = [];
  try {
    for (const entry of existingSources) {
      await fs$1.copyFile(entry.sourcePath, entry.targetPath, fs$1.constants.COPYFILE_EXCL);
      copied.push(entry.targetPath);
    }
  } catch (err) {
    for (const targetPath of copied)
      try {
        await fs$1.rm(targetPath, { force: true });
      } catch {}
    params.warnings.push(
      `Failed copying Memory Core legacy memory index sidecar retry path ${params.source.legacyPath} -> ${retryPath}: ${String(err)}`,
    );
    return;
  }
  params.changes.push(
    `Copied Memory Core legacy memory index sidecar retry path -> ${targetBasePath}`,
  );
}
async function migrateLegacyMemorySidecarSource(params) {
  await fs$1.mkdir(path.dirname(params.source.agentDatabasePath), { recursive: true });
  const db = new (requireMemoryHostNodeSqlite().DatabaseSync)(params.source.agentDatabasePath, {
    allowExtension: true,
  });
  try {
    const migrationEnv = {
      ...params.env,
      OPENCLAW_STATE_DIR: params.source.stateDir,
    };
    ensureOpenClawAgentDatabaseSchema(db, {
      agentId: params.source.agentId,
      env: migrationEnv,
      path: params.source.agentDatabasePath,
      register: true,
    });
    const ftsTokenizer = readMemorySearchFtsTokenizer(params.config, params.source.agentId);
    ensureMemoryIndexSchema({
      db,
      cacheEnabled: true,
      ftsEnabled: true,
      ftsTokenizer,
    });
    const vectorEnabled = readMemorySearchVectorEnabled(params.config, params.source.agentId);
    const vectorExtensionPath = vectorEnabled
      ? readMemorySearchVectorExtensionPath(params.config, params.source.agentId)
      : void 0;
    const loadedVector = vectorEnabled
      ? await loadSqliteVecExtension({
          db,
          extensionPath: vectorExtensionPath
            ? resolveUserPath(vectorExtensionPath, params.env)
            : void 0,
        })
      : {
          ok: false,
          error: "vector search is disabled",
        };
    let result;
    try {
      result = importLegacyMemorySidecarIndex({
        db,
        legacySidecarDatabasePath: params.source.legacyPath,
        copyVectorRows: vectorEnabled && loadedVector.ok,
        requireVectorRows: vectorEnabled,
      });
    } catch (err) {
      if (err instanceof LegacyMemoryRowsConflictError && err.tableName === "files") {
        params.changes.push(
          `Resolved Memory Core legacy memory index conflict for agent ${params.source.agentId} by keeping canonical per-agent SQLite rows`,
        );
        return { archiveReady: true };
      }
      await preserveLegacyMemorySidecarRetryPath(params);
      params.warnings.push(
        `Skipped Memory Core legacy memory index import for agent ${params.source.agentId} because legacy rows could not be imported: ${String(err)}`,
      );
      return { archiveReady: false };
    }
    if (result.reason === "legacy-schema-missing") {
      await preserveLegacyMemorySidecarRetryPath(params);
      params.warnings.push(
        `Skipped Memory Core legacy memory index import for agent ${params.source.agentId} because the sidecar schema is not a legacy memory index`,
      );
      return { archiveReady: false };
    }
    if (!result.imported) {
      await preserveLegacyMemorySidecarRetryPath(params);
      return { archiveReady: false };
    }
    ensureMemoryIndexSchema({
      db,
      cacheEnabled: true,
      ftsEnabled: true,
      ftsTokenizer,
    });
    params.changes.push(
      `Migrated Memory Core legacy memory index for agent ${params.source.agentId} -> per-agent SQLite (${result.sources} source(s), ${result.chunks} chunk(s), ${result.cacheEntries} cache row(s))`,
    );
    if (!result.vectorEntriesImported) {
      await preserveLegacyMemorySidecarRetryPath(params);
      const vectorReason = loadedVector.ok
        ? "legacy vector table could not be validated"
        : (loadedVector.error ?? "unknown sqlite-vec load error");
      params.warnings.push(
        `Left Memory Core legacy memory index sidecar in place for agent ${params.source.agentId} because ${formatLegacyVectorRows(result.vectorEntries)} still require sqlite-vec: ${vectorReason}`,
      );
      return { archiveReady: false };
    }
    return { archiveReady: true };
  } finally {
    db.close();
  }
}
function groupLegacyMemorySidecarSourcesByPath(sources) {
  const groups = /* @__PURE__ */ new Map();
  for (const source of sources) {
    const group = groups.get(source.legacyPath);
    if (group) group.push(source);
    else groups.set(source.legacyPath, [source]);
  }
  return [...groups.values()];
}
function resolveConfiguredWorkspaces(config, env) {
  return resolveMemoryDreamingWorkspaces(config, { env }).map((entry) => entry.workspaceDir);
}
async function readJsonFile(filePath) {
  return JSON.parse(await fs$1.readFile(filePath, "utf8"));
}
async function collectLegacySources(config, env) {
  const sources = [];
  for (const workspaceDir of resolveConfiguredWorkspaces(config, env)) {
    const candidates = [
      {
        label: "daily ingestion",
        relativePath: DAILY_INGESTION_STATE_RELATIVE_PATH,
      },
      {
        label: "session ingestion",
        relativePath: SESSION_INGESTION_STATE_RELATIVE_PATH,
      },
      {
        label: "short-term recall",
        relativePath: SHORT_TERM_STORE_RELATIVE_PATH,
      },
      {
        label: "phase signals",
        relativePath: SHORT_TERM_PHASE_SIGNAL_RELATIVE_PATH,
      },
    ];
    for (const candidate of candidates) {
      const filePath = path.join(workspaceDir, candidate.relativePath);
      if (await legacyStateFileExists(filePath))
        sources.push({
          workspaceDir,
          label: candidate.label,
          filePath,
        });
    }
  }
  return sources;
}
async function migrateDailyIngestion(source) {
  const state = normalizeDailyIngestionState(await readJsonFile(source.filePath));
  await writeMemoryCoreWorkspaceEntries({
    namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
    workspaceDir: source.workspaceDir,
    entries: Object.entries(state.files).map(([key, value]) => ({
      key,
      value,
    })),
  });
  return Object.keys(state.files).length;
}
async function migrateSessionIngestion(source) {
  const state = normalizeSessionIngestionState(await readJsonFile(source.filePath));
  const seenEntries = Object.entries(state.seenMessages).flatMap(([scope, hashes]) =>
    Array.from({ length: Math.ceil(hashes.length / 512) }, (_, index) => ({
      key: `${scope}:${index}`,
      value: {
        scope,
        index,
        hashes: hashes.slice(index * 512, (index + 1) * 512),
      },
    })),
  );
  await Promise.all([
    writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir: source.workspaceDir,
      entries: Object.entries(state.files).map(([key, value]) => ({
        key,
        value,
      })),
    }),
    writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
      workspaceDir: source.workspaceDir,
      entries: seenEntries,
    }),
  ]);
  return Object.keys(state.files).length + Object.keys(state.seenMessages).length;
}
async function migrateShortTermRecall(source) {
  const nowIso = /* @__PURE__ */ new Date().toISOString();
  const state = normalizeShortTermRecallStore(await readJsonFile(source.filePath), nowIso);
  await Promise.all([
    writeMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_RECALL_NAMESPACE,
      workspaceDir: source.workspaceDir,
      entries: Object.entries(state.entries).map(([key, value]) => ({
        key,
        value,
      })),
    }),
    writeMemoryCoreWorkspaceEntry({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir: source.workspaceDir,
      key: "recall",
      value: { updatedAt: state.updatedAt },
    }),
  ]);
  return Object.keys(state.entries).length;
}
async function migratePhaseSignals(source) {
  const nowIso = /* @__PURE__ */ new Date().toISOString();
  const state = normalizeShortTermPhaseSignalStore(await readJsonFile(source.filePath), nowIso);
  await Promise.all([
    writeMemoryCoreWorkspaceEntries({
      namespace: SHORT_TERM_PHASE_SIGNAL_NAMESPACE,
      workspaceDir: source.workspaceDir,
      entries: Object.entries(state.entries).map(([key, value]) => ({
        key,
        value,
      })),
    }),
    writeMemoryCoreWorkspaceEntry({
      namespace: SHORT_TERM_META_NAMESPACE,
      workspaceDir: source.workspaceDir,
      key: "phase",
      value: { updatedAt: state.updatedAt },
    }),
  ]);
  return Object.keys(state.entries).length;
}
async function migrateSource(source) {
  if (source.label === "daily ingestion") return await migrateDailyIngestion(source);
  if (source.label === "session ingestion") return await migrateSessionIngestion(source);
  if (source.label === "short-term recall") return await migrateShortTermRecall(source);
  return await migratePhaseSignals(source);
}
const stateMigrations = [
  {
    id: "memory-core-dreams-json-to-sqlite",
    label: "Memory Core dreaming state",
    async detectLegacyState(params) {
      configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
      const sources = await collectLegacySources(params.config, params.env);
      if (sources.length === 0) return null;
      return {
        preview: sources.map(
          (source) => `- Memory Core ${source.label}: ${source.filePath} -> SQLite plugin state`,
        ),
      };
    },
    async migrateLegacyState(params) {
      configureMemoryCoreDreamingState(params.context.openPluginStateKeyedStore);
      const changes = [];
      const warnings = [];
      const notices = [];
      for (const source of await collectLegacySources(params.config, params.env)) {
        if (await dreamingStateComparison.targetHasRows(source)) {
          let sourceAcknowledged;
          try {
            sourceAcknowledged = await dreamingStateComparison.sourceIsAcknowledged(source);
          } catch (err) {
            warnings.push(
              `Skipped Memory Core ${source.label} import for ${source.workspaceDir} because the legacy source could not be compared: ${String(err)}`,
            );
            continue;
          }
          if (sourceAcknowledged) {
            notices.push(
              `Retained acknowledged Memory Core ${source.label} legacy source for rollback: ${source.filePath}`,
            );
            continue;
          }
          warnings.push(
            `Skipped Memory Core ${source.label} import for ${source.workspaceDir} because SQLite rows conflict with the legacy source; left legacy source in place`,
          );
          continue;
        }
        let imported;
        try {
          imported = await migrateSource(source);
        } catch (err) {
          warnings.push(
            `Skipped Memory Core ${source.label} import for ${source.workspaceDir} because the legacy source could not be imported: ${String(err)}`,
          );
          continue;
        }
        changes.push(
          `Migrated Memory Core ${source.label} -> SQLite plugin state (${imported} row(s))`,
        );
        await archiveLegacyStateSource({
          filePath: source.filePath,
          label: `Memory Core ${source.label}`,
          changes,
          warnings,
        });
      }
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
  {
    id: "memory-core-legacy-sidecar-index-to-agent-sqlite",
    label: "Memory Core legacy memory index sidecar",
    async detectLegacyState(params) {
      const sources = await collectLegacyMemorySidecarSources({
        config: params.config,
        env: params.env,
        stateDir: params.stateDir,
      });
      if (sources.length === 0) return null;
      return {
        preview: sources.map(
          (source) =>
            `- Memory Core legacy memory index: ${source.legacyPath} -> ${source.agentDatabasePath}`,
        ),
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const groups = groupLegacyMemorySidecarSourcesByPath(
        await collectLegacyMemorySidecarSources({
          config: params.config,
          env: params.env,
          stateDir: params.stateDir,
        }),
      );
      for (const sources of groups) {
        let archiveReady = true;
        for (const source of sources)
          try {
            const result = await migrateLegacyMemorySidecarSource({
              source,
              config: params.config,
              env: params.env,
              changes,
              warnings,
            });
            archiveReady &&= result.archiveReady;
          } catch (err) {
            archiveReady = false;
            await preserveLegacyMemorySidecarRetryPath({
              source,
              changes,
              warnings,
            });
            warnings.push(
              `Skipped Memory Core legacy memory index import for agent ${source.agentId} because the sidecar could not be imported: ${String(err)}`,
            );
          }
        if (archiveReady && sources[0])
          await archiveLegacyMemorySidecar({
            source: sources[0],
            changes,
            warnings,
          });
      }
      return {
        changes,
        warnings,
      };
    },
  },
];
//#endregion
export { stateMigrations };
