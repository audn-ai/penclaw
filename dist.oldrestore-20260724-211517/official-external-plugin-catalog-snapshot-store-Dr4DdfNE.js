import { existsSync } from "node:fs";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  f as resolveOpenClawStateSqlitePath,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
//#region src/plugins/official-external-plugin-catalog-snapshot-store.ts
/** Persists hosted official external plugin catalog snapshots in OpenClaw state. */
function resolveStoreEnv(options) {
  if (!options.stateDir) return options.env;
  return {
    ...(options.env ?? process.env),
    OPENCLAW_STATE_DIR: options.stateDir,
  };
}
function resolveStateDatabaseOptions(options) {
  const env = resolveStoreEnv(options);
  return {
    ...(env ? { env } : {}),
    ...(options.stateDatabasePath ? { path: options.stateDatabasePath } : {}),
  };
}
function resolveStateDatabasePath(options) {
  if (options.stateDatabasePath) return options.stateDatabasePath;
  return resolveOpenClawStateSqlitePath(resolveStoreEnv(options) ?? process.env);
}
function rowToTrustState(row) {
  if (
    row.trust_mode !== "signed" ||
    !row.trust_key_id ||
    row.trust_signature_count === null ||
    row.trust_threshold === null ||
    !row.trust_verified_at
  )
    return;
  return {
    mode: "signed",
    signedBy: row.trust_key_id,
    signatureCount: Number(row.trust_signature_count),
    threshold: Number(row.trust_threshold),
    verifiedAt: row.trust_verified_at,
  };
}
function decodeBase64Payload(payload) {
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}
function readMonotonicStateFromBody(body) {
  try {
    const document = JSON.parse(body);
    const feed =
      typeof document.payload === "string"
        ? JSON.parse(decodeBase64Payload(document.payload))
        : document;
    if (typeof feed.sequence !== "number" || typeof feed.generatedAt !== "string") return;
    return {
      mode: "signed-feed",
      sequence: feed.sequence,
      generatedAt: feed.generatedAt,
    };
  } catch {
    return;
  }
}
function isMonotonicRollback(params) {
  if (params.candidate.sequence < params.current.sequence) return true;
  if (params.candidate.sequence > params.current.sequence) return false;
  return Date.parse(params.candidate.generatedAt) < Date.parse(params.current.generatedAt);
}
function assertSignedSnapshotWriteIsMonotonic(params) {
  if (params.candidate?.mode !== "signed-feed" || params.current?.trust_mode !== "signed") return;
  const current = readMonotonicStateFromBody(params.current.body);
  if (!current) return;
  if (
    isMonotonicRollback({
      candidate: params.candidate,
      current,
    })
  )
    throw new Error("hosted catalog signed feed sequence is older than current snapshot");
}
function rowToSnapshot(row) {
  if (!row) return null;
  const metadata = {
    url: row.feed_url,
    status: Number(row.status),
    checksum: row.checksum,
    ...(row.etag ? { etag: row.etag } : {}),
    ...(row.last_modified ? { lastModified: row.last_modified } : {}),
  };
  const trust = rowToTrustState(row);
  return {
    body: row.body,
    metadata,
    savedAt: row.saved_at,
    ...(trust ? { trust } : {}),
  };
}
/** Creates a snapshot store backed by the shared `state/openclaw.sqlite` database. */
function createSqliteHostedOfficialExternalPluginCatalogSnapshotStore(options = {}) {
  return {
    async read(url) {
      if (!existsSync(resolveStateDatabasePath(options))) return null;
      const database = openOpenClawStateDatabase(resolveStateDatabaseOptions(options));
      const stateDb = getNodeSqliteKysely(database.db);
      return rowToSnapshot(
        executeSqliteQueryTakeFirstSync(
          database.db,
          stateDb
            .selectFrom("official_external_plugin_catalog_snapshots")
            .select([
              "feed_url",
              "body",
              "status",
              "etag",
              "last_modified",
              "checksum",
              "saved_at",
              "trust_mode",
              "trust_key_id",
              "trust_signature_count",
              "trust_threshold",
              "trust_verified_at",
            ])
            .where("feed_url", "=", url),
        ),
      );
    },
    async write(snapshot) {
      const now = Date.now();
      runOpenClawStateWriteTransaction((database) => {
        const stateDb = getNodeSqliteKysely(database.db);
        const current = executeSqliteQueryTakeFirstSync(
          database.db,
          stateDb
            .selectFrom("official_external_plugin_catalog_snapshots")
            .select([
              "feed_url",
              "body",
              "status",
              "etag",
              "last_modified",
              "checksum",
              "saved_at",
              "trust_mode",
              "trust_key_id",
              "trust_signature_count",
              "trust_threshold",
              "trust_verified_at",
            ])
            .where("feed_url", "=", snapshot.metadata.url),
        );
        assertSignedSnapshotWriteIsMonotonic({
          candidate: snapshot.monotonic,
          current,
        });
        executeSqliteQuerySync(
          database.db,
          stateDb
            .insertInto("official_external_plugin_catalog_snapshots")
            .values({
              feed_url: snapshot.metadata.url,
              body: snapshot.body,
              status: snapshot.metadata.status,
              etag: snapshot.metadata.etag ?? null,
              last_modified: snapshot.metadata.lastModified ?? null,
              checksum: snapshot.metadata.checksum,
              saved_at: snapshot.savedAt,
              updated_at_ms: now,
              trust_mode: snapshot.trust?.mode ?? null,
              trust_key_id: snapshot.trust?.signedBy ?? null,
              trust_signature_count: snapshot.trust?.signatureCount ?? null,
              trust_threshold: snapshot.trust?.threshold ?? null,
              trust_verified_at: snapshot.trust?.verifiedAt ?? null,
            })
            .onConflict((conflict) =>
              conflict.column("feed_url").doUpdateSet({
                body: snapshot.body,
                status: snapshot.metadata.status,
                etag: snapshot.metadata.etag ?? null,
                last_modified: snapshot.metadata.lastModified ?? null,
                checksum: snapshot.metadata.checksum,
                saved_at: snapshot.savedAt,
                updated_at_ms: now,
                trust_mode: snapshot.trust?.mode ?? null,
                trust_key_id: snapshot.trust?.signedBy ?? null,
                trust_signature_count: snapshot.trust?.signatureCount ?? null,
                trust_threshold: snapshot.trust?.threshold ?? null,
                trust_verified_at: snapshot.trust?.verifiedAt ?? null,
              }),
            ),
        );
      }, resolveStateDatabaseOptions(options));
    },
  };
}
//#endregion
export { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore };
