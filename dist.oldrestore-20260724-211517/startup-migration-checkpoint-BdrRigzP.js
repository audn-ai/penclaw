import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  u as withOpenClawStateStartupMigrationCheckpointDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { r as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DLqNjJHV.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/infra/startup-migration-checkpoint.ts
const STARTUP_MIGRATION_META_KEY = "startup-migrations";
const STARTUP_MIGRATION_BUILD_SEPARATOR = "\n";
const STARTUP_MIGRATION_LEASE_SCOPE = "startup-migrations";
const STARTUP_MIGRATION_LEASE_KEY = "global";
const STARTUP_MIGRATION_LEASE_TTL_MS = 5 * 6e4;
function formatStartupMigrationCheckpoint(version, buildIdentity) {
  return `${version}${STARTUP_MIGRATION_BUILD_SEPARATOR}${buildIdentity}`;
}
function resolveStartupMigrationBuildIdentity(moduleUrl = import.meta.url) {
  try {
    const require = createRequire(moduleUrl);
    for (const candidate of [
      "./build-info.json",
      "../build-info.json",
      "../../dist/build-info.json",
    ])
      try {
        const info = require(candidate);
        if (typeof info.builtAt !== "string" || !info.builtAt.trim()) continue;
        return info.builtAt.trim();
      } catch {}
  } catch {}
  return null;
}
function withStartupMigrationCheckpointDatabase(env, callback) {
  return withOpenClawStateStartupMigrationCheckpointDatabase(callback, { env });
}
function writeStartupMigrationCheckpointDatabase(env, callback) {
  return withStartupMigrationCheckpointDatabase(env, (db) =>
    runSqliteImmediateTransactionSync(db, () => callback(db)),
  );
}
function readStartupMigrationCheckpoint(env) {
  return withStartupMigrationCheckpointDatabase(env, (db) => {
    return (
      executeSqliteQueryTakeFirstSync(
        db,
        getNodeSqliteKysely(db)
          .selectFrom("schema_meta")
          .select("app_version as appVersion")
          .where("meta_key", "=", STARTUP_MIGRATION_META_KEY),
      )?.appVersion ?? null
    );
  });
}
function readStartupMigrationVersion(env = process.env) {
  return (
    readStartupMigrationCheckpoint(env)?.split(STARTUP_MIGRATION_BUILD_SEPARATOR, 1)[0] ?? null
  );
}
function needsStartupMigrationCheckpoint(params = {}) {
  const env = params.env ?? process.env;
  const buildIdentity =
    params.buildIdentity === void 0 ? resolveStartupMigrationBuildIdentity() : params.buildIdentity;
  if (buildIdentity === null) return true;
  return (
    readStartupMigrationCheckpoint(env) !==
    formatStartupMigrationCheckpoint(params.version ?? VERSION, buildIdentity)
  );
}
function acquireStartupMigrationLease(params = {}) {
  const env = params.env ?? process.env;
  const nowMs = params.nowMs ?? Date.now();
  const owner = params.owner ?? randomUUID();
  const expiresAt = nowMs + STARTUP_MIGRATION_LEASE_TTL_MS;
  writeStartupMigrationCheckpointDatabase(env, (db) => {
    const stateDb = getNodeSqliteKysely(db);
    executeSqliteQuerySync(
      db,
      stateDb
        .deleteFrom("state_leases")
        .where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE)
        .where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY)
        .where("expires_at", "<=", nowMs),
    );
    const existing = executeSqliteQueryTakeFirstSync(
      db,
      stateDb
        .selectFrom("state_leases")
        .select(["owner", "expires_at as expiresAt"])
        .where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE)
        .where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY),
    );
    if (existing)
      throw new Error(
        `OpenClaw startup migrations are already running for this state directory; retry after the other gateway finishes or after ${new Date(existing.expiresAt ?? expiresAt).toISOString()}.`,
      );
    executeSqliteQuerySync(
      db,
      stateDb.insertInto("state_leases").values({
        scope: STARTUP_MIGRATION_LEASE_SCOPE,
        lease_key: STARTUP_MIGRATION_LEASE_KEY,
        owner,
        expires_at: expiresAt,
        heartbeat_at: nowMs,
        payload_json: JSON.stringify({ version: VERSION }),
        created_at: nowMs,
        updated_at: nowMs,
      }),
    );
  });
  return {
    owner,
    heartbeat: (heartbeatParams = {}) => {
      const heartbeatNowMs = heartbeatParams.nowMs ?? Date.now();
      const heartbeatExpiresAt = heartbeatNowMs + STARTUP_MIGRATION_LEASE_TTL_MS;
      writeStartupMigrationCheckpointDatabase(env, (db) => {
        if (
          executeSqliteQuerySync(
            db,
            getNodeSqliteKysely(db)
              .updateTable("state_leases")
              .set({
                expires_at: heartbeatExpiresAt,
                heartbeat_at: heartbeatNowMs,
                updated_at: heartbeatNowMs,
              })
              .where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE)
              .where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY)
              .where("owner", "=", owner)
              .where("expires_at", ">", heartbeatNowMs),
          ).numAffectedRows !== 1n
        )
          throw new Error(
            "OpenClaw startup migration lease was lost before startup migrations completed; restart the gateway so migrations can run under a fresh lease.",
          );
      });
    },
    release: () => {
      writeStartupMigrationCheckpointDatabase(env, (db) => {
        executeSqliteQuerySync(
          db,
          getNodeSqliteKysely(db)
            .deleteFrom("state_leases")
            .where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE)
            .where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY)
            .where("owner", "=", owner),
        );
      });
    },
  };
}
function recordSuccessfulStartupMigrations(params = {}) {
  const env = params.env ?? process.env;
  const version = params.version ?? VERSION;
  const buildIdentity =
    params.buildIdentity === void 0 ? resolveStartupMigrationBuildIdentity() : params.buildIdentity;
  const nowMs = params.nowMs ?? Date.now();
  const checkpoint =
    buildIdentity === null ? version : formatStartupMigrationCheckpoint(version, buildIdentity);
  writeStartupMigrationCheckpointDatabase(env, (db) => {
    const stateDb = getNodeSqliteKysely(db);
    if (params.lease) {
      if (
        !executeSqliteQueryTakeFirstSync(
          db,
          stateDb
            .selectFrom("state_leases")
            .select("owner")
            .where("scope", "=", STARTUP_MIGRATION_LEASE_SCOPE)
            .where("lease_key", "=", STARTUP_MIGRATION_LEASE_KEY)
            .where("owner", "=", params.lease.owner)
            .where("expires_at", ">", nowMs),
        )
      )
        throw new Error(
          "OpenClaw startup migration lease was lost before checkpoint recording; restart the gateway so migrations can run under a fresh lease.",
        );
    }
    executeSqliteQuerySync(
      db,
      stateDb
        .insertInto("schema_meta")
        .values({
          meta_key: STARTUP_MIGRATION_META_KEY,
          role: "global",
          schema_version: buildIdentity === null ? 1 : 2,
          agent_id: null,
          app_version: checkpoint,
          created_at: nowMs,
          updated_at: nowMs,
        })
        .onConflict((conflict) =>
          conflict.column("meta_key").doUpdateSet({
            role: "global",
            schema_version: buildIdentity === null ? 1 : 2,
            agent_id: null,
            app_version: checkpoint,
            updated_at: nowMs,
          }),
        ),
    );
  });
}
//#endregion
export {
  acquireStartupMigrationLease,
  needsStartupMigrationCheckpoint,
  readStartupMigrationVersion,
  recordSuccessfulStartupMigrations,
};
