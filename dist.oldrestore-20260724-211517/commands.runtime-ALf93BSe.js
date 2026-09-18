import { spawn } from "node:child_process";
import crypto, { randomUUID } from "node:crypto";
import { constants, createWriteStream } from "node:fs";
import fs$1 from "node:fs/promises";
import "./fs-safe-RNq3oO57.js";
import { createServer } from "node:net";
import "./utils-DtcDeqWS.js";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { StringDecoder } from "node:string_decoder";
import JSON5 from "json5";
import * as tar from "tar";
import {
  _ as parseEnvAssignments,
  a as FLEET_GATEWAY_PORT,
  b as validateFleetImage,
  c as allocateHostPort,
  d as buildCellRunArgs,
  f as cellAuthSecretDir,
  g as cellOwnerId,
  h as cellNetworkName,
  i as FLEET_ENV_KEYS_LABEL,
  l as buildCellCreateArgs,
  m as cellDataDir,
  n as FLEET_ATTEMPT_LABEL,
  o as FLEET_OWNER_LABEL,
  p as cellContainerName,
  r as FLEET_DISK_LIMIT_LABEL,
  s as FLEET_TENANT_LABEL,
  u as buildCellEnvironment,
  v as validateCellContainerProfile,
  x as validateTenantId,
  y as validateDiskSize,
} from "./cell-profile-C89hQfv6.js";
import { t as attachChildProcessBridge } from "./child-process-bridge-Vp-FhPhG.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { o as isRecord$1 } from "./record-coerce-DHZ4bFlT.js";
import { n as replaceFileAtomic } from "./replace-file-CaPU6XwS.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-quSzXaPg.js";
//#region src/fleet/registry.ts
const FLEET_OPERATION_LEASE_SCOPE = "fleet-cell-operation";
const FLEET_OPERATION_LEASE_TTL_MS = 5 * 6e4;
function kyselyFor(db) {
  return getNodeSqliteKysely(db);
}
function parseRuntime(runtime) {
  if (runtime === "docker" || runtime === "podman") return runtime;
  throw new Error(`Unsupported fleet runtime in state database: ${runtime}`);
}
function rowToRecord(row) {
  return {
    tenantId: row.tenant_id,
    createdAtMs: row.created_at_ms,
    image: row.image,
    runtime: parseRuntime(row.runtime),
    hostPort: row.host_port,
    containerName: row.container_name,
    dataDir: row.data_dir,
  };
}
function recordToRow(record) {
  return {
    tenant_id: record.tenantId,
    created_at_ms: record.createdAtMs,
    image: record.image,
    runtime: record.runtime,
    host_port: record.hostPort,
    container_name: record.containerName,
    data_dir: record.dataDir,
  };
}
function listFleetCells(env = process.env) {
  const db = openOpenClawStateDatabase({ env }).db;
  return executeSqliteQuerySync(
    db,
    kyselyFor(db).selectFrom("fleet_cells").selectAll().orderBy("tenant_id", "asc"),
  ).rows.map(rowToRecord);
}
function getFleetCell(env, tenantId) {
  const db = openOpenClawStateDatabase({ env }).db;
  const row = executeSqliteQueryTakeFirstSync(
    db,
    kyselyFor(db).selectFrom("fleet_cells").selectAll().where("tenant_id", "=", tenantId),
  );
  return row ? rowToRecord(row) : void 0;
}
function reserveFleetCell(env, params) {
  return runOpenClawStateWriteTransaction(
    ({ db }) => {
      const kysely = kyselyFor(db);
      if (
        executeSqliteQueryTakeFirstSync(
          db,
          kysely
            .selectFrom("fleet_cells")
            .select("tenant_id")
            .where("tenant_id", "=", params.tenantId),
        )
      )
        throw new Error(`Fleet cell already exists: ${params.tenantId}`);
      const hostPort = allocateHostPort(
        executeSqliteQuerySync(db, kysely.selectFrom("fleet_cells").select("host_port")).rows.map(
          (row) => row.host_port,
        ),
        params.requestedPort,
      );
      const record = {
        tenantId: params.tenantId,
        createdAtMs: params.createdAtMs,
        image: params.image,
        runtime: params.runtime,
        hostPort,
        containerName: params.containerName,
        dataDir: params.dataDir,
      };
      executeSqliteQuerySync(db, kysely.insertInto("fleet_cells").values(recordToRow(record)));
      return record;
    },
    { env },
  );
}
function updateFleetCellImage(env, tenantId, image) {
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      if (
        executeSqliteQuerySync(
          db,
          kyselyFor(db).updateTable("fleet_cells").set({ image }).where("tenant_id", "=", tenantId),
        ).numAffectedRows !== 1n
      )
        throw new Error(`Fleet cell disappeared before its image could be updated: ${tenantId}`);
    },
    { env },
  );
}
function acquireFleetCellOperation(params) {
  const nowMs = params.nowMs ?? Date.now();
  const expiresAt = nowMs + FLEET_OPERATION_LEASE_TTL_MS;
  const owner = params.owner ?? crypto.randomUUID();
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      const kysely = kyselyFor(db);
      executeSqliteQuerySync(
        db,
        kysely
          .deleteFrom("state_leases")
          .where("scope", "=", FLEET_OPERATION_LEASE_SCOPE)
          .where("lease_key", "=", params.tenantId)
          .where("expires_at", "<=", nowMs),
      );
      const existing = executeSqliteQueryTakeFirstSync(
        db,
        kysely
          .selectFrom("state_leases")
          .select(["expires_at", "payload_json"])
          .where("scope", "=", FLEET_OPERATION_LEASE_SCOPE)
          .where("lease_key", "=", params.tenantId),
      );
      if (existing) {
        let operation = "fleet operation";
        try {
          const payload = existing.payload_json ? JSON.parse(existing.payload_json) : void 0;
          if (
            typeof payload === "object" &&
            payload !== null &&
            "operation" in payload &&
            typeof payload.operation === "string"
          )
            operation = `fleet ${payload.operation}`;
        } catch {}
        throw new Error(
          `Another ${operation} is already running for ${params.tenantId}; retry after ${new Date(existing.expires_at ?? expiresAt).toISOString()}.`,
        );
      }
      executeSqliteQuerySync(
        db,
        kysely.insertInto("state_leases").values({
          scope: FLEET_OPERATION_LEASE_SCOPE,
          lease_key: params.tenantId,
          owner,
          expires_at: expiresAt,
          heartbeat_at: nowMs,
          payload_json: JSON.stringify({ operation: params.operation }),
          created_at: nowMs,
          updated_at: nowMs,
        }),
      );
    },
    { env: params.env },
  );
  return {
    owner,
    heartbeat: (heartbeatNowMs = Date.now()) => {
      const heartbeatExpiresAt = heartbeatNowMs + FLEET_OPERATION_LEASE_TTL_MS;
      runOpenClawStateWriteTransaction(
        ({ db }) => {
          if (
            executeSqliteQuerySync(
              db,
              kyselyFor(db)
                .updateTable("state_leases")
                .set({
                  expires_at: heartbeatExpiresAt,
                  heartbeat_at: heartbeatNowMs,
                  updated_at: heartbeatNowMs,
                })
                .where("scope", "=", FLEET_OPERATION_LEASE_SCOPE)
                .where("lease_key", "=", params.tenantId)
                .where("owner", "=", owner)
                .where("expires_at", ">", heartbeatNowMs),
            ).numAffectedRows !== 1n
          )
            throw new Error(`Fleet operation lease was lost for ${params.tenantId}.`);
        },
        { env: params.env },
      );
    },
    release: () => {
      runOpenClawStateWriteTransaction(
        ({ db }) => {
          executeSqliteQuerySync(
            db,
            kyselyFor(db)
              .deleteFrom("state_leases")
              .where("scope", "=", FLEET_OPERATION_LEASE_SCOPE)
              .where("lease_key", "=", params.tenantId)
              .where("owner", "=", owner),
          );
        },
        { env: params.env },
      );
    },
  };
}
function deleteFleetCell(env, tenantId) {
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      executeSqliteQuerySync(
        db,
        kyselyFor(db).deleteFrom("fleet_cells").where("tenant_id", "=", tenantId),
      );
    },
    { env },
  );
}
//#endregion
//#region src/fleet/service-support.runtime.ts
const CELL_CONFIG_FILENAME = "openclaw.json";
const HEALTH_TIMEOUT_MS = 1e3;
const CELL_CONFIG_MAX_BYTES = 4 * 1024 * 1024;
const FLEET_OPERATION_HEARTBEAT_MS = 6e4;
function requiredRecord(value, label) {
  if (!isRecord$1(value)) throw new Error(`${label} must be an object.`);
  return value;
}
function optionalRecord(value, label) {
  if (value === void 0) return {};
  return requiredRecord(value, label);
}
function readAllowedOrigins(value) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || !value.every((origin) => typeof origin === "string"))
    throw new Error("gateway.controlUi.allowedOrigins must be an array of strings.");
  return value;
}
async function ensurePrivateDirectory(dir) {
  await fs$1.mkdir(dir, {
    recursive: true,
    mode: 448,
  });
  const stat = await fs$1.lstat(dir);
  if (!stat.isDirectory() || stat.isSymbolicLink())
    throw new Error(`Refusing to use non-directory fleet data path: ${dir}`);
  await fs$1.chmod(dir, 448);
}
async function prepareCellDirectories(record, authSecretDir, owner) {
  await Promise.all([
    ensurePrivateDirectory(record.dataDir),
    ensurePrivateDirectory(authSecretDir),
  ]);
  if (owner)
    await Promise.all([
      fs$1.chown(record.dataDir, owner.uid, owner.gid),
      fs$1.chown(authSecretDir, owner.uid, owner.gid),
    ]);
}
async function prepareCellConfig(record, owner) {
  const configPath = path.join(record.dataDir, CELL_CONFIG_FILENAME);
  let rootConfig;
  const cellRoot = await root(record.dataDir, {
    hardlinks: "reject",
    maxBytes: CELL_CONFIG_MAX_BYTES,
    nonBlockingRead: true,
    symlinks: "reject",
  });
  try {
    const read = await cellRoot.read(CELL_CONFIG_FILENAME);
    rootConfig = requiredRecord(JSON5.parse(read.buffer.toString("utf8")), "Cell config");
  } catch (error) {
    if (error instanceof FsSafeError && error.code === "not-found") rootConfig = {};
    else if (error instanceof FsSafeError)
      throw new Error(`Refusing to read unsafe cell config: ${configPath}`, { cause: error });
    else throw error;
  }
  const gateway = optionalRecord(rootConfig.gateway, "gateway");
  const auth = optionalRecord(gateway.auth, "gateway.auth");
  const controlUi = optionalRecord(gateway.controlUi, "gateway.controlUi");
  const nextAuth = {
    ...auth,
    mode: "token",
  };
  delete nextAuth.token;
  const origins = new Set(readAllowedOrigins(controlUi.allowedOrigins));
  origins.add(`http://localhost:${record.hostPort}`);
  origins.add(`http://127.0.0.1:${record.hostPort}`);
  const nextConfig = {
    ...rootConfig,
    gateway: {
      ...gateway,
      mode: "local",
      bind: "lan",
      auth: nextAuth,
      controlUi: {
        ...controlUi,
        allowedOrigins: [...origins],
      },
    },
  };
  await replaceFileAtomic({
    filePath: configPath,
    content: `${JSON.stringify(nextConfig, null, 2)}\n`,
    dirMode: 448,
    mode: 384,
    tempPrefix: CELL_CONFIG_FILENAME,
    copyFallbackOnPermissionError: true,
  });
  if (owner) await fs$1.chown(configPath, owner.uid, owner.gid);
}
function readHostIdentity(getuid, getgid) {
  const uid = getuid();
  const gid = getgid();
  if (uid === void 0 || gid === void 0) return;
  if (!Number.isSafeInteger(uid) || uid < 0 || !Number.isSafeInteger(gid) || gid < 0)
    throw new Error("Host uid and gid must be non-negative integers.");
  return {
    uid,
    gid,
  };
}
async function resolveContainerUser(params) {
  const match = params.user?.match(/^(\d+):(\d+)$/u);
  if (match) {
    const uid = Number(match[1]);
    const gid = Number(match[2]);
    return params.runtime === "podman"
      ? {
          mode: "podman-keep-id",
          uid,
          gid,
        }
      : {
          mode: "numeric",
          uid,
          gid,
        };
  }
  if (!params.hostIdentity) return;
  if (params.runtime === "podman")
    return params.hostIdentity.uid === 0
      ? void 0
      : {
          mode: "podman-keep-id",
          ...params.hostIdentity,
        };
  if (await params.containers.isDockerRootless())
    return {
      mode: "numeric",
      uid: 0,
      gid: 0,
    };
  return params.hostIdentity.uid === 0
    ? void 0
    : {
        mode: "numeric",
        ...params.hostIdentity,
      };
}
async function detectHostSelinux() {
  if (process.platform !== "linux") return false;
  try {
    await fs$1.access("/sys/fs/selinux");
    return true;
  } catch {
    return false;
  }
}
function inspectionState(record, inspection) {
  if (inspection.kind !== "ok") return inspection.state;
  return inspection.labels["openclaw.fleet.tenant"] === record.tenantId &&
    inspection.labels["openclaw.fleet.owner"] === cellOwnerId(record.dataDir)
    ? inspection.state
    : "unknown";
}
function assertManagedInspection(record, inspection) {
  if (inspection.kind === "missing")
    throw new Error(`Fleet container is missing for tenant ${record.tenantId}.`);
  if (inspection.kind === "unavailable")
    throw new Error(
      `Cannot inspect ${record.runtime} container for tenant ${record.tenantId}: ${inspection.error}`,
    );
  if (
    inspection.labels["openclaw.fleet.tenant"] !== record.tenantId ||
    inspection.labels["openclaw.fleet.owner"] !== cellOwnerId(record.dataDir)
  )
    throw new Error(
      `Refusing to manage ${record.containerName}: fleet ownership labels do not match tenant ${record.tenantId}.`,
    );
  return inspection;
}
async function probeCellHealth(params) {
  const url = `http://127.0.0.1:${params.port}/healthz`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
  let response;
  try {
    response = await params.fetchImpl(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
    });
    if (response.ok)
      return {
        status: "ok",
        url,
        httpStatus: response.status,
      };
    return {
      status: "failed",
      url,
      httpStatus: response.status,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      status: "failed",
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timeout);
    await response?.body?.cancel().catch(() => void 0);
  }
}
async function resolvePurgeTarget(rootDir, targetDir, tenantId) {
  const expectedTarget = path.resolve(rootDir, tenantId);
  if (path.resolve(targetDir) !== expectedTarget)
    throw new Error(`Refusing to purge data outside its fleet-owned directory: ${targetDir}`);
  let targetStat;
  try {
    targetStat = await fs$1.lstat(expectedTarget);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  if (targetStat.isSymbolicLink())
    throw new Error(`Refusing to purge a symlinked fleet tenant directory: ${targetDir}`);
  const root = await fs$1.realpath(rootDir);
  const target = await fs$1.realpath(targetDir);
  const relative = path.relative(root, target);
  if (
    target !== path.join(root, tenantId) ||
    !relative ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  )
    throw new Error(`Refusing to purge data outside its fleet-owned directory: ${targetDir}`);
  return target;
}
function requireCell(env, tenant) {
  const tenantId = validateTenantId(tenant);
  const record = getFleetCell(env, tenantId);
  if (!record) throw new Error(`Fleet cell not found: ${tenantId}`);
  return record;
}
function assertCurrentReservation(env, expected) {
  const current = getFleetCell(env, expected.tenantId);
  if (
    !current ||
    current.createdAtMs !== expected.createdAtMs ||
    current.image !== expected.image ||
    current.runtime !== expected.runtime ||
    current.hostPort !== expected.hostPort ||
    current.containerName !== expected.containerName ||
    current.dataDir !== expected.dataDir
  )
    throw new Error(`Fleet create reservation changed while provisioning ${expected.tenantId}.`);
}
function requirePositiveResource(value, label, context = "upgrade") {
  const parsed = Number(value);
  if (!value.trim() || !Number.isFinite(parsed) || parsed <= 0)
    throw new Error(`Cannot ${context} cell: inspected ${label} limit is missing or invalid.`);
  return value;
}
function requireInspectedGatewayToken(inspection, context) {
  const gatewayCredential = inspection.environment.OPENCLAW_GATEWAY_TOKEN;
  if (!gatewayCredential)
    throw new Error(`Cannot ${context} cell: existing container has no Gateway token environment.`);
  return gatewayCredential;
}
function requireInspectedAttemptId(inspection, context) {
  const attemptId = inspection.labels[FLEET_ATTEMPT_LABEL];
  if (!attemptId || !/^[a-f0-9]{32}$/u.test(attemptId))
    throw new Error(`Cannot ${context} cell: container attempt label is missing or invalid.`);
  return attemptId;
}
function requirePidsLimit(value, context = "upgrade") {
  if (value === void 0 || !Number.isSafeInteger(value) || value < 1)
    throw new Error(`Cannot ${context} cell: inspected PID limit is missing or invalid.`);
  return value;
}
function rebuildInspectedEnvironment(environment, labels, token, context = "upgrade") {
  const encodedKeys = labels[FLEET_ENV_KEYS_LABEL];
  if (encodedKeys === void 0)
    throw new Error(`Cannot ${context} cell: user environment provenance label is missing.`);
  const keys = encodedKeys ? encodedKeys.split(",") : [];
  if (new Set(keys).size !== keys.length || keys.toSorted().join(",") !== encodedKeys)
    throw new Error(`Cannot ${context} cell: user environment provenance label is invalid.`);
  return buildCellEnvironment(
    token,
    parseEnvAssignments(
      keys.map((key) => {
        const value = environment[key];
        if (value === void 0)
          throw new Error(`Cannot ${context} cell: inspected environment is missing ${key}.`);
        return `${key}=${value}`;
      }),
    ),
  );
}
function buildProfileBaseFromInspection(params) {
  return {
    tenantId: params.record.tenantId,
    containerName: params.record.containerName,
    networkName: cellNetworkName(params.record.tenantId),
    runtime: params.record.runtime,
    hostPort: params.record.hostPort,
    dataDir: params.record.dataDir,
    authSecretDir: cellAuthSecretDir(params.stateDir, params.record.tenantId),
    ownerId: cellOwnerId(params.record.dataDir),
    memory: requirePositiveResource(params.inspection.memory, "memory", params.context),
    cpus: requirePositiveResource(params.inspection.cpus, "CPU", params.context),
    pidsLimit: requirePidsLimit(params.inspection.pidsLimit, params.context),
    ...(params.inspection.labels["openclaw.fleet.disk-limit"] !== void 0
      ? { diskSize: params.inspection.labels[FLEET_DISK_LIMIT_LABEL] }
      : {}),
    environment: rebuildInspectedEnvironment(
      params.inspection.environment,
      params.inspection.labels,
      params.token,
      params.context,
    ),
    ...(params.containerUser ? { containerUser: params.containerUser } : {}),
    selinuxRelabel: params.selinuxRelabel,
  };
}
async function verifyReplacementHealthy(params) {
  const deadline = params.now() + params.timeoutMs;
  for (;;) {
    const replacement = await params.containers.inspect(
      params.record.runtime,
      params.record.containerName,
    );
    if (
      replacement.kind !== "ok" ||
      replacement.labels["openclaw.fleet.attempt"] !== params.attemptId ||
      !replacement.running
    )
      throw new Error(
        replacement.kind === "ok"
          ? `Replacement cell container is not running after ${params.context}.`
          : `Replacement cell container could not be verified after ${params.context}.`,
      );
    if (
      (
        await probeCellHealth({
          port: params.record.hostPort,
          fetchImpl: params.fetchImpl,
        })
      ).status === "ok"
    )
      return;
    if (params.now() >= deadline)
      throw new Error(`Replacement cell container did not become healthy after ${params.context}.`);
    params.checkpoint();
    await params.sleep(params.pollMs);
  }
}
async function cleanupFailedCreateContainer(record, containers, attemptId, checkpoint) {
  const inspection = await containers.inspect(record.runtime, record.containerName);
  if (inspection.kind === "missing") return true;
  if (inspection.kind === "unavailable") return false;
  const tenantLabel = inspection.labels[FLEET_TENANT_LABEL];
  const ownerLabel = inspection.labels[FLEET_OWNER_LABEL];
  if (tenantLabel !== record.tenantId || ownerLabel !== cellOwnerId(record.dataDir)) return true;
  if (inspection.labels["openclaw.fleet.attempt"] !== attemptId) return false;
  checkpoint();
  await containers.remove(record.runtime, record.containerName, true);
  return (await containers.inspect(record.runtime, record.containerName)).kind === "missing";
}
async function cleanupFailedCreateNetwork(record, containers, attemptId, checkpoint) {
  const networkName = cellNetworkName(record.tenantId);
  const inspection = await containers.inspectNetwork(record.runtime, networkName);
  if (inspection.kind === "missing") return true;
  if (inspection.kind === "unavailable") return false;
  const tenantLabel = inspection.labels[FLEET_TENANT_LABEL];
  const ownerLabel = inspection.labels[FLEET_OWNER_LABEL];
  if (tenantLabel !== record.tenantId || ownerLabel !== cellOwnerId(record.dataDir)) return true;
  if (
    inspection.labels["openclaw.fleet.attempt"] !== attemptId ||
    inspection.attachedContainers.length > 0
  )
    return false;
  checkpoint();
  await containers.removeNetwork(record.runtime, networkName);
  return (await containers.inspectNetwork(record.runtime, networkName)).kind === "missing";
}
function inspectionHasFleetOwner(record, inspection) {
  return (
    inspection.labels["openclaw.fleet.tenant"] === record.tenantId &&
    inspection.labels["openclaw.fleet.owner"] === cellOwnerId(record.dataDir)
  );
}
function assertManagedNetwork(record, inspection) {
  if (inspection.kind === "missing")
    throw new Error(`Fleet network is missing for tenant ${record.tenantId}.`);
  if (inspection.kind === "unavailable")
    throw new Error(
      `Cannot inspect ${record.runtime} network for tenant ${record.tenantId}: ${inspection.error}`,
    );
  if (
    inspection.labels["openclaw.fleet.tenant"] !== record.tenantId ||
    inspection.labels["openclaw.fleet.owner"] !== cellOwnerId(record.dataDir)
  )
    throw new Error(
      `Refusing to manage ${cellNetworkName(record.tenantId)}: fleet ownership labels do not match tenant ${record.tenantId}.`,
    );
  if (
    inspection.attachedContainers.filter((container) => container.name !== record.containerName)
      .length > 0 ||
    inspection.attachedContainers.length > 1
  )
    throw new Error(
      `Refusing to manage ${cellNetworkName(record.tenantId)}: unexpected containers are attached.`,
    );
  return inspection;
}
async function restorePreviousCell(params) {
  const current = await params.containers.inspect(
    params.record.runtime,
    params.record.containerName,
  );
  if (current.kind === "unavailable") throw new Error(current.error);
  if (current.kind === "ok") {
    if (!inspectionHasFleetOwner(params.record, current))
      throw new Error("container ownership changed during upgrade recovery");
    const currentAttemptId = current.labels[FLEET_ATTEMPT_LABEL];
    if (currentAttemptId === params.previousAttemptId) {
      if (current.running !== params.wasRunning) {
        params.checkpoint();
        await params.containers[current.running ? "stop" : "start"](
          params.record.runtime,
          params.record.containerName,
        );
      }
      return;
    }
    if (currentAttemptId !== params.nextAttemptId)
      throw new Error("container generation changed during upgrade recovery");
    params.checkpoint();
    await params.containers.remove(params.record.runtime, params.record.containerName, true);
  }
  params.checkpoint();
  await params.containers.run(params.oldProfile, params.wasRunning);
}
async function withFleetCellOperation(params) {
  const lease = acquireFleetCellOperation({
    env: params.env,
    tenantId: params.tenantId,
    operation: params.operationName,
  });
  let heartbeatError;
  const checkpoint = () => {
    try {
      lease.heartbeat();
      heartbeatError = void 0;
    } catch (error) {
      heartbeatError = error;
      throw error;
    }
  };
  const heartbeat = setInterval(() => {
    try {
      lease.heartbeat();
      heartbeatError = void 0;
    } catch (error) {
      heartbeatError = error;
    }
  }, FLEET_OPERATION_HEARTBEAT_MS);
  heartbeat.unref();
  let result;
  try {
    result = await params.operation(checkpoint);
    if (heartbeatError) checkpoint();
    else lease.heartbeat();
  } catch (error) {
    clearInterval(heartbeat);
    try {
      lease.release();
    } catch {}
    throw error;
  }
  clearInterval(heartbeat);
  lease.release();
  return result;
}
//#endregion
//#region src/fleet/backup.runtime.ts
const DEFAULT_FLEET_BACKUP_MAX_BYTES = 16 * 1024 ** 3;
const FLEET_BACKUP_MAX_ENTRIES = 1e6;
const MANIFEST_MAX_BYTES = 4 * 1024 * 1024;
const BACKUP_LEASE_PROBE_INTERVAL_MS = 3e4;
const RESTORE_VERIFY_TIMEOUT_MS = 6e4;
const RESTORE_VERIFY_POLL_MS = 1e3;
var BackupLinkCache = class extends Map {
  get(_key) {}
  set(_key, _value) {
    return this;
  }
};
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function timestampBasename(tenant, nowMs) {
  return `openclaw-fleet-backup-${tenant}-${new Date(nowMs)
    .toISOString()
    .replaceAll(":", "-")
    .replace(/\.\d{3}Z$/u, "Z")}.tgz`;
}
async function resolveOutputPath(out, basename) {
  if (!out) return path.resolve(process.cwd(), basename);
  const resolved = path.resolve(out);
  if (out.endsWith(path.sep) || out.endsWith("/") || out.endsWith("\\"))
    return path.join(resolved, basename);
  try {
    return (await fs$1.stat(resolved)).isDirectory() ? path.join(resolved, basename) : resolved;
  } catch {
    return resolved;
  }
}
async function canonicalizeForContainment(targetPath) {
  const resolved = path.resolve(targetPath);
  const suffix = [];
  let probe = resolved;
  for (;;)
    try {
      const real = await fs$1.realpath(probe);
      return path.join(real, ...suffix.toReversed());
    } catch {
      const parent = path.dirname(probe);
      if (parent === probe) return resolved;
      suffix.push(path.basename(probe));
      probe = parent;
    }
}
function isWithin(candidate, root) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
  );
}
function remapArchivePath(entryPath, manifestPath, dataTarget, authTarget) {
  const resolved = path.resolve(entryPath);
  if (resolved === manifestPath) return "manifest.json";
  if (isWithin(resolved, dataTarget)) {
    const relative = path.relative(dataTarget, resolved).split(path.sep).join(path.posix.sep);
    return relative ? path.posix.join("data", relative) : "data";
  }
  if (isWithin(resolved, authTarget)) {
    const relative = path.relative(authTarget, resolved).split(path.sep).join(path.posix.sep);
    return relative ? path.posix.join("auth", relative) : "auth";
  }
  throw new Error(`Fleet backup encountered a path outside the cell roots: ${entryPath}`);
}
async function backupFleetCell(params) {
  await params.containers.assertLocal(params.record.runtime);
  const inspection = await params.containers.inspect(
    params.record.runtime,
    params.record.containerName,
  );
  if (inspection.kind === "unavailable")
    throw new Error(
      `Cannot inspect ${params.record.runtime} container for tenant ${params.record.tenantId}: ${inspection.error}`,
    );
  if (inspection.kind === "ok") {
    assertManagedInspection(params.record, inspection);
    if (inspection.running)
      throw new Error(
        `Fleet cell ${params.record.tenantId} is running; stop it first (openclaw fleet stop ${params.record.tenantId}) so SQLite state is captured consistently.`,
      );
  }
  const dataTarget = await resolvePurgeTarget(
    path.join(params.stateDir, "fleet", "cells"),
    params.record.dataDir,
    params.record.tenantId,
  );
  if (!dataTarget)
    throw new Error(`Fleet cell ${params.record.tenantId} has no cell data to back up.`);
  const authTarget = await resolvePurgeTarget(
    path.join(params.stateDir, "fleet", "auth-profile-secrets"),
    cellAuthSecretDir(params.stateDir, params.record.tenantId),
    params.record.tenantId,
  );
  if (!authTarget)
    throw new Error(
      `Fleet cell ${params.record.tenantId} has no auth-secret directory to back up.`,
    );
  const nowMs = params.now();
  const archivePath = await resolveOutputPath(
    params.out,
    timestampBasename(params.record.tenantId, nowMs),
  );
  const canonicalOutput = await canonicalizeForContainment(archivePath);
  if ([dataTarget, authTarget].some((root) => isWithin(canonicalOutput, root)))
    throw new Error(
      "Fleet backup output must not be written inside the cell data or auth directory.",
    );
  try {
    await fs$1.lstat(archivePath);
    throw new Error(`Refusing to overwrite existing fleet backup archive: ${archivePath}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs$1.mkdir(path.dirname(archivePath), { recursive: true });
  const tempArchivePath = `${archivePath}.${randomUUID()}.tmp`;
  const tempRoot = await fs$1.realpath(os.tmpdir());
  const tempDir = await fs$1.mkdtemp(path.join(tempRoot, "openclaw-fleet-backup-"));
  const manifestPath = path.join(tempDir, "manifest.json");
  const manifest = {
    schemaVersion: 1,
    kind: "openclaw-fleet-cell-backup",
    tenant: params.record.tenantId,
    createdAt: new Date(nowMs).toISOString(),
    hostPort: params.record.hostPort,
    image: params.record.image,
    runtime: params.record.runtime,
  };
  let fileCount = 0;
  let skippedSymlinks = 0;
  let skippedSpecial = 0;
  let totalBytes = 0;
  let totalEntries = 0;
  let exceeded = false;
  let tooManyEntries = false;
  let leaseLost = false;
  let unrestorablePath;
  let lastLeaseProbeMs = params.now();
  const maxBytes = params.maxBytes ?? DEFAULT_FLEET_BACKUP_MAX_BYTES;
  const maxEntries = params.maxEntries ?? FLEET_BACKUP_MAX_ENTRIES;
  try {
    await fs$1.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 384 });
    const filter = (entryPath, stat) => {
      if (exceeded || tooManyEntries || leaseLost) return false;
      if (params.now() - lastLeaseProbeMs >= BACKUP_LEASE_PROBE_INTERVAL_MS) {
        lastLeaseProbeMs = params.now();
        try {
          params.checkpoint();
        } catch {
          leaseLost = true;
          return false;
        }
      }
      const type = "type" in stat ? stat.type : void 0;
      if ("isSymbolicLink" in stat ? stat.isSymbolicLink() : type === "SymbolicLink") {
        skippedSymlinks += 1;
        return false;
      }
      const isFile = "isFile" in stat ? stat.isFile() : type === "File";
      const isDirectory = "isDirectory" in stat ? stat.isDirectory() : type === "Directory";
      if (!isFile && !isDirectory) {
        skippedSpecial += 1;
        return false;
      }
      const archivedPath = remapArchivePath(entryPath, manifestPath, dataTarget, authTarget);
      if (!isAllowedRestorePath(archivedPath)) {
        unrestorablePath = unrestorablePath ?? entryPath;
        return false;
      }
      totalEntries += archivedPath.split("/").filter(Boolean).length;
      if (totalEntries > maxEntries) {
        tooManyEntries = true;
        return false;
      }
      if (isFile) {
        totalBytes += stat.size;
        fileCount += 1;
        if (totalBytes > maxBytes) {
          exceeded = true;
          return false;
        }
      }
      return true;
    };
    await pipeline(
      tar.c(
        {
          gzip: true,
          portable: true,
          preservePaths: true,
          linkCache: new BackupLinkCache(),
          filter,
          onWriteEntry: (entry) => {
            entry.path = remapArchivePath(entry.path, manifestPath, dataTarget, authTarget);
          },
        },
        [manifestPath, dataTarget, authTarget],
      ),
      createWriteStream(tempArchivePath, {
        flags: "wx",
        mode: 384,
      }),
    );
    try {
      params.checkpoint();
    } catch {
      leaseLost = true;
    }
    if (leaseLost)
      throw new Error(
        `Fleet backup for ${params.record.tenantId} lost its operation lease; the partial archive was discarded. Retry the backup.`,
      );
    if (exceeded)
      throw new Error(
        `Fleet backup exceeds the ${maxBytes}-byte limit; raise --max-bytes or reduce the cell data.`,
      );
    if (tooManyEntries)
      throw new Error(
        `Fleet backup exceeds the ${maxEntries}-entry limit; reduce the number of files in the cell data.`,
      );
    if (unrestorablePath !== void 0)
      throw new Error(
        `Fleet backup refuses a file name its restore path rules would reject: ${unrestorablePath}. Rename the file inside the cell and retry.`,
      );
    await publishArchive(tempArchivePath, archivePath);
    return {
      tenant: params.record.tenantId,
      archivePath,
      fileCount,
      skippedSymlinks,
      skippedSpecial,
      note: "Archive contains tenant state and auth secrets; store it like a credential.",
    };
  } finally {
    await fs$1.rm(tempArchivePath, { force: true }).catch(() => void 0);
    await fs$1
      .rm(tempDir, {
        recursive: true,
        force: true,
      })
      .catch(() => void 0);
  }
}
async function publishArchive(tempArchivePath, archivePath) {
  try {
    await fs$1.link(tempArchivePath, archivePath);
    return;
  } catch (error) {
    const code = error.code;
    if (code === "EEXIST")
      throw new Error(`Refusing to overwrite existing fleet backup archive: ${archivePath}`, {
        cause: error,
      });
    if (code !== "ENOTSUP" && code !== "EOPNOTSUPP" && code !== "EPERM") throw error;
  }
  try {
    await fs$1.copyFile(tempArchivePath, archivePath, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code === "EEXIST")
      throw new Error(`Refusing to overwrite existing fleet backup archive: ${archivePath}`, {
        cause: error,
      });
    await fs$1.rm(archivePath, { force: true }).catch(() => void 0);
    throw error;
  }
}
function isAllowedRestorePath(rawPath) {
  if (rawPath.includes("\\")) return false;
  const normalized = path.posix.normalize(rawPath);
  if (normalized !== rawPath || normalized.startsWith("/") || normalized.startsWith("../"))
    return false;
  return (
    normalized === "manifest.json" ||
    normalized === "data" ||
    normalized.startsWith("data/") ||
    normalized === "auth" ||
    normalized.startsWith("auth/")
  );
}
function restoreEntryKind(entry) {
  if ("isFile" in entry)
    return entry.isFile() ? "file" : entry.isDirectory() ? "directory" : "other";
  return entry.type === "File" ? "file" : entry.type === "Directory" ? "directory" : "other";
}
function resolveRestoreOwner(hostIdentity, containerUser) {
  if (hostIdentity?.uid !== 0) return;
  if (!containerUser)
    return {
      uid: 1e3,
      gid: 1e3,
    };
  return containerUser.uid > 0
    ? {
        uid: containerUser.uid,
        gid: containerUser.gid,
      }
    : void 0;
}
async function chownTree(root, owner) {
  await fs$1.chown(root, owner.uid, owner.gid);
  for (const entry of await fs$1.readdir(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`Refusing to chown symlink in restored fleet data: ${entryPath}`);
    if (entry.isDirectory()) await chownTree(entryPath, owner);
    else await fs$1.chown(entryPath, owner.uid, owner.gid);
  }
}
async function restoreFleetCell(params) {
  await params.containers.assertLocal(params.record.runtime);
  const archivePath = path.resolve(params.from);
  const archiveStat = await fs$1.lstat(archivePath);
  if (!archiveStat.isFile() || archiveStat.isSymbolicLink())
    throw new Error(`Fleet restore archive must be a regular file: ${archivePath}`);
  const canonicalArchive = await fs$1.realpath(archivePath);
  if (
    (
      await Promise.all([
        canonicalizeForContainment(params.record.dataDir),
        canonicalizeForContainment(cellAuthSecretDir(params.stateDir, params.record.tenantId)),
      ])
    ).some((root) => isWithin(canonicalArchive, root))
  )
    throw new Error(
      "Fleet restore archive must not be stored inside the cell data or auth directory.",
    );
  const inspectionResult = await params.containers.inspect(
    params.record.runtime,
    params.record.containerName,
  );
  if (inspectionResult.kind === "missing")
    throw new Error(
      `Fleet cell container is missing for ${params.record.tenantId}; remove the stale registration without purging data (openclaw fleet rm ${params.record.tenantId} --force), recreate a stopped cell with the intended image (openclaw fleet create ${params.record.tenantId} --no-start --image <image>), then retry fleet restore.`,
    );
  const inspection = assertManagedInspection(params.record, inspectionResult);
  if (inspection.running && !params.force)
    throw new Error(
      `Fleet cell ${params.record.tenantId} is running; pass --force to stop it and replace its state.`,
    );
  const wasRunning = inspection.running;
  requireInspectedGatewayToken(inspection, "restore");
  requireInspectedAttemptId(inspection, "restore");
  const tempRoot = path.join(params.stateDir, "fleet", "restore-tmp");
  await fs$1.mkdir(tempRoot, {
    recursive: true,
    mode: 448,
  });
  const tempDir = await fs$1.mkdtemp(path.join(tempRoot, `${params.record.tenantId}-`));
  await fs$1.chmod(tempDir, 448);
  let preserveTemp = false;
  let stoppedForRestore = false;
  let containerRemoved = false;
  let previousDisplaced = false;
  let stateSwapped = false;
  let replacementAttemptId = "";
  try {
    let invalidArchive = false;
    let totalBytes = 0;
    let totalEntries = 0;
    let exceeded = false;
    let tooManyEntries = false;
    const maxBytes = params.maxBytes ?? DEFAULT_FLEET_BACKUP_MAX_BYTES;
    const maxEntries = params.maxEntries ?? FLEET_BACKUP_MAX_ENTRIES;
    await tar.x({
      file: archivePath,
      cwd: tempDir,
      preservePaths: false,
      preserveOwner: false,
      strict: true,
      filter: (entryPath, entry) => {
        if (exceeded || tooManyEntries) return false;
        totalEntries += entryPath.split("/").filter(Boolean).length;
        if (totalEntries > maxEntries) {
          tooManyEntries = true;
          return false;
        }
        const kind = restoreEntryKind(entry);
        if (kind === "other" || !isAllowedRestorePath(entryPath)) {
          invalidArchive = true;
          return false;
        }
        if (kind === "file") {
          totalBytes += entry.size;
          if (totalBytes > maxBytes) {
            exceeded = true;
            return false;
          }
        }
        return true;
      },
    });
    if (exceeded)
      throw new Error(
        `Fleet restore exceeds the ${maxBytes}-byte limit; raise --max-bytes or use a smaller archive.`,
      );
    if (tooManyEntries)
      throw new Error(
        `Fleet restore exceeds the ${maxEntries}-entry limit; the archive is not a usable fleet cell backup.`,
      );
    if (invalidArchive) throw new Error("Archive is not a fleet cell backup or was tampered with.");
    const safeRoot = await root(tempDir, {
      symlinks: "reject",
      hardlinks: "reject",
      maxBytes: MANIFEST_MAX_BYTES,
      nonBlockingRead: true,
    });
    let manifest;
    try {
      manifest = JSON.parse((await safeRoot.read("manifest.json")).buffer.toString("utf8"));
    } catch (error) {
      throw new Error("Archive is not a fleet cell backup or was tampered with.", { cause: error });
    }
    if (
      typeof manifest !== "object" ||
      manifest === null ||
      !("kind" in manifest) ||
      manifest.kind !== "openclaw-fleet-cell-backup" ||
      !("schemaVersion" in manifest) ||
      manifest.schemaVersion !== 1 ||
      !("tenant" in manifest) ||
      typeof manifest.tenant !== "string"
    )
      throw new Error("Archive is not a fleet cell backup or was tampered with.");
    if (manifest.tenant !== params.record.tenantId)
      throw new Error(
        `Backup archive belongs to tenant ${manifest.tenant}; refusing to restore it into ${params.record.tenantId}.`,
      );
    const extractedData = path.join(tempDir, "data");
    const dataStat = await fs$1.lstat(extractedData);
    if (!dataStat.isDirectory() || dataStat.isSymbolicLink())
      throw new Error("Archive is not a fleet cell backup or was tampered with.");
    const extractedAuth = path.join(tempDir, "auth");
    let authStat;
    try {
      authStat = await fs$1.lstat(extractedAuth);
    } catch (error) {
      if (error.code === "ENOENT")
        throw new Error("Archive is not a fleet cell backup or was tampered with.", {
          cause: error,
        });
      throw error;
    }
    if (!authStat.isDirectory() || authStat.isSymbolicLink())
      throw new Error("Archive is not a fleet cell backup or was tampered with.");
    const containerUser = await resolveContainerUser({
      runtime: params.record.runtime,
      containers: params.containers,
      hostIdentity: params.hostIdentity,
      user: inspection.user,
    });
    const imageOwner = resolveRestoreOwner(params.hostIdentity, containerUser);
    const token = params.generateToken();
    const attemptId = params.generateAttemptId();
    replacementAttemptId = attemptId;
    const profile = {
      ...buildProfileBaseFromInspection({
        record: params.record,
        stateDir: params.stateDir,
        inspection,
        containerUser,
        selinuxRelabel: params.selinuxRelabel,
        token,
        context: "restore",
      }),
      image: inspection.imageId,
      attemptId,
    };
    validateCellContainerProfile(profile);
    const authSecretDir = cellAuthSecretDir(params.stateDir, params.record.tenantId);
    const dataTarget = await resolvePurgeTarget(
      path.join(params.stateDir, "fleet", "cells"),
      params.record.dataDir,
      params.record.tenantId,
    );
    const authTarget = await resolvePurgeTarget(
      path.join(params.stateDir, "fleet", "auth-profile-secrets"),
      authSecretDir,
      params.record.tenantId,
    );
    const replacedRoot = path.join(tempDir, "replaced");
    await fs$1.mkdir(replacedRoot, { mode: 448 });
    assertManagedNetwork(
      params.record,
      await params.containers.inspectNetwork(
        params.record.runtime,
        cellNetworkName(params.record.tenantId),
      ),
    );
    if (wasRunning) {
      params.checkpoint();
      assertManagedInspection(
        params.record,
        await params.containers.inspect(params.record.runtime, params.record.containerName),
      );
      await params.containers.stop(params.record.runtime, params.record.containerName);
      stoppedForRestore = true;
    }
    params.checkpoint();
    assertManagedInspection(
      params.record,
      await params.containers.inspect(params.record.runtime, params.record.containerName),
    );
    await params.containers.remove(params.record.runtime, params.record.containerName, false);
    containerRemoved = true;
    params.checkpoint();
    previousDisplaced = true;
    if (dataTarget) await fs$1.rename(dataTarget, path.join(replacedRoot, "data"));
    if (authTarget) await fs$1.rename(authTarget, path.join(replacedRoot, "auth"));
    await fs$1.rename(extractedData, params.record.dataDir);
    await fs$1.rename(extractedAuth, authSecretDir);
    stateSwapped = true;
    await prepareCellDirectories(params.record, authSecretDir, imageOwner);
    if (imageOwner)
      await Promise.all([
        chownTree(params.record.dataDir, imageOwner),
        chownTree(authSecretDir, imageOwner),
      ]);
    await prepareCellConfig(params.record, imageOwner);
    params.checkpoint();
    await params.containers.run(profile, wasRunning);
    if (wasRunning)
      await verifyReplacementHealthy({
        containers: params.containers,
        record: params.record,
        attemptId,
        fetchImpl: params.fetchImpl,
        now: params.now,
        sleep: params.sleep,
        checkpoint: params.checkpoint,
        timeoutMs: RESTORE_VERIFY_TIMEOUT_MS,
        pollMs: RESTORE_VERIFY_POLL_MS,
        context: "restore",
      });
    return {
      tenant: params.record.tenantId,
      archivePath,
      token,
      tokenNote: "Shown once. The previous Gateway token was rotated by this restore.",
      started: wasRunning,
      url: `http://127.0.0.1:${params.record.hostPort}`,
    };
  } catch (error) {
    if (containerRemoved) {
      preserveTemp = true;
      let replacementNote = "";
      try {
        const current = await params.containers.inspect(
          params.record.runtime,
          params.record.containerName,
        );
        if (
          current.kind === "ok" &&
          current.labels["openclaw.fleet.attempt"] === replacementAttemptId &&
          current.running
        ) {
          await params.containers.stop(params.record.runtime, params.record.containerName);
          replacementNote =
            " The interrupted replacement container was stopped; retry fleet restore to rotate a fresh Gateway token.";
        } else if (current.kind === "unavailable")
          replacementNote =
            " The replacement container state could not be verified; stop it manually before retrying fleet restore.";
      } catch {
        replacementNote =
          " The interrupted replacement container could not be stopped; stop it manually before retrying fleet restore.";
      }
      const recoveryNote = stateSwapped
        ? ` Restored data is already in place under the cell directories; displaced previous data is preserved at ${tempDir}/replaced.`
        : previousDisplaced
          ? ` Previous data is preserved at ${tempDir}/replaced and the extracted archive remains at ${tempDir}.`
          : ` Previous cell data remains in place; the extracted archive remains at ${tempDir}.`;
      throw new Error(
        `Fleet restore for ${params.record.tenantId} was interrupted after the cell container was removed: ${errorMessage(error)}.${replacementNote}${recoveryNote}`,
        { cause: error },
      );
    }
    if (stoppedForRestore)
      try {
        const current = assertManagedInspection(
          params.record,
          await params.containers.inspect(params.record.runtime, params.record.containerName),
        );
        if (
          !current.running &&
          current.labels["openclaw.fleet.attempt"] === inspection.labels["openclaw.fleet.attempt"]
        )
          await params.containers.start(params.record.runtime, params.record.containerName);
      } catch {}
    throw error;
  } finally {
    if (!preserveTemp)
      await fs$1
        .rm(tempDir, {
          recursive: true,
          force: true,
        })
        .catch(() => void 0);
  }
}
//#endregion
//#region src/fleet/containers.redaction.ts
function secretPrefixSuffixLength(text, redactValues) {
  let longest = 0;
  for (const value of redactValues) {
    const max = Math.min(value.length - 1, text.length);
    for (let length = max; length > longest; length -= 1)
      if (value.startsWith(text.slice(text.length - length))) {
        longest = length;
        break;
      }
  }
  return longest;
}
function createRedactingStreamWriter(target, redactValues) {
  const decoder = new StringDecoder("utf8");
  let pending = "";
  const redact = (text) => {
    let redacted = text;
    for (const value of redactValues)
      if (value) redacted = redacted.replaceAll(value, "<redacted>");
    return redacted;
  };
  const emit = (text) => {
    if (!text) return true;
    return target.write(redact(text));
  };
  return {
    write: (chunk) => {
      pending += decoder.write(chunk);
      const keep = secretPrefixSuffixLength(pending, redactValues);
      const cut = pending.length - keep;
      if (cut <= 0) return true;
      const writable = emit(pending.slice(0, cut));
      pending = pending.slice(cut);
      return writable;
    },
    flush: () => {
      emit(pending + decoder.end());
      pending = "";
    },
  };
}
//#endregion
//#region src/fleet/containers.runtime.ts
const DELIBERATE_STREAM_STOP_SIGNALS = /* @__PURE__ */ new Set([
  "SIGINT",
  "SIGTERM",
  "SIGHUP",
  "SIGQUIT",
  "SIGBREAK",
  "SIGPIPE",
]);
const COMMAND_TIMEOUT_MS = 10 * 6e4;
const COMMAND_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
var InvalidInspectOutputError = class extends Error {
  constructor() {
    super("container inspect returned an invalid response");
  }
};
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function requireRecord(value) {
  if (!isRecord(value)) throw new InvalidInspectOutputError();
  return value;
}
function requireString(value) {
  if (typeof value !== "string" || value.length === 0) throw new InvalidInspectOutputError();
  return value;
}
function requireBoolean(value) {
  if (typeof value !== "boolean") throw new InvalidInspectOutputError();
  return value;
}
function requireNonNegativeNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    throw new InvalidInspectOutputError();
  return value;
}
function readOptionalString(value) {
  if (value === void 0 || value === null || value === "") return;
  if (typeof value !== "string") throw new InvalidInspectOutputError();
  return value;
}
function readLabels(value) {
  if (value === void 0 || value === null) return {};
  const record = requireRecord(value);
  const labels = {};
  for (const [key, label] of Object.entries(record)) {
    if (typeof label !== "string") throw new InvalidInspectOutputError();
    labels[key] = label;
  }
  return labels;
}
function readStringRecord(value) {
  if (value === void 0 || value === null) return {};
  const record = requireRecord(value);
  for (const entry of Object.values(record))
    if (typeof entry !== "string") throw new InvalidInspectOutputError();
  return record;
}
function readStringArray(value) {
  if (value === void 0 || value === null) return [];
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string"))
    throw new InvalidInspectOutputError();
  return value;
}
function readOptionalBoolean(value) {
  if (value === void 0 || value === null) return;
  return requireBoolean(value);
}
function readRestartPolicy(value) {
  if (value === void 0 || value === null) return;
  return readOptionalString(requireRecord(value).Name);
}
function readPortBindings(value) {
  if (value === void 0 || value === null) return [];
  const bindings = [];
  for (const [containerPort, rawEntries] of Object.entries(requireRecord(value))) {
    if (!containerPort || !Array.isArray(rawEntries)) throw new InvalidInspectOutputError();
    for (const rawEntry of rawEntries) {
      const entry = requireRecord(rawEntry);
      bindings.push({
        containerPort,
        hostIp: requireString(entry.HostIp),
        hostPort: requireString(entry.HostPort),
      });
    }
  }
  return bindings;
}
function readNetworkAttachments(value) {
  if (value === void 0 || value === null) return [];
  const record = requireRecord(value);
  return Object.entries(record)
    .map(([id, rawAttachment]) => {
      if (!id) throw new InvalidInspectOutputError();
      const attachment = requireRecord(rawAttachment);
      const name = readOptionalString(attachment.Name ?? attachment.name);
      const normalized = { id };
      if (name) normalized.name = name;
      return normalized;
    })
    .toSorted((left, right) => left.id.localeCompare(right.id));
}
function readEnvironment(value) {
  if (value === void 0 || value === null) return {};
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string"))
    throw new InvalidInspectOutputError();
  const environment = {};
  for (const assignment of value) {
    const separator = assignment.indexOf("=");
    if (separator <= 0) throw new InvalidInspectOutputError();
    environment[assignment.slice(0, separator)] = assignment.slice(separator + 1);
  }
  return environment;
}
function readPidsLimit(value) {
  if (value === void 0 || value === null || value === 0) return;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new InvalidInspectOutputError();
  return value;
}
function parseInspectOutput(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new InvalidInspectOutputError();
  }
  if (!Array.isArray(parsed) || parsed.length !== 1) throw new InvalidInspectOutputError();
  const inspected = requireRecord(parsed[0]);
  const state = requireRecord(inspected.State);
  const config = requireRecord(inspected.Config);
  const hostConfig = requireRecord(inspected.HostConfig);
  const nanoCpus = requireNonNegativeNumber(hostConfig.NanoCpus);
  const user = readOptionalString(config.User);
  const usernsMode = readOptionalString(hostConfig.UsernsMode);
  return {
    kind: "ok",
    containerId: requireString(inspected.Id),
    state: requireString(state.Status),
    running: requireBoolean(state.Running),
    labels: readLabels(config.Labels),
    environment: readEnvironment(config.Env),
    imageId: requireString(inspected.Image),
    memory: String(requireNonNegativeNumber(hostConfig.Memory)),
    cpus: String(nanoCpus / 1e9),
    pidsLimit: readPidsLimit(hostConfig.PidsLimit),
    storageOpt: readStringRecord(hostConfig.StorageOpt),
    capDrop: readStringArray(hostConfig.CapDrop),
    effectiveCaps:
      inspected.EffectiveCaps === void 0 ? void 0 : readStringArray(inspected.EffectiveCaps),
    securityOpt: readStringArray(hostConfig.SecurityOpt),
    init: readOptionalBoolean(hostConfig.Init),
    restartPolicy: readRestartPolicy(hostConfig.RestartPolicy),
    portBindings: readPortBindings(hostConfig.PortBindings),
    ...(user ? { user } : {}),
    ...(usernsMode ? { usernsMode } : {}),
  };
}
function parseNetworkInspectOutput(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new InvalidInspectOutputError();
  }
  if (!Array.isArray(parsed) || parsed.length !== 1) throw new InvalidInspectOutputError();
  const inspected = requireRecord(parsed[0]);
  return {
    kind: "ok",
    labels: readLabels(inspected.Labels ?? inspected.labels),
    attachedContainers: readNetworkAttachments(inspected.Containers ?? inspected.containers),
    internal: readOptionalBoolean(inspected.Internal ?? inspected.internal) ?? false,
  };
}
function parseDockerContextEndpoint(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new Error("docker context inspect returned an invalid response");
  }
  if (!Array.isArray(parsed) || parsed.length !== 1)
    throw new Error("docker context inspect returned an invalid response");
  try {
    return requireString(
      requireRecord(requireRecord(requireRecord(parsed[0]).Endpoints).docker).Host,
    );
  } catch {
    throw new Error("docker context inspect returned an invalid response");
  }
}
function isLocalDockerEndpoint(endpoint) {
  const normalized = endpoint.toLowerCase();
  if (normalized.startsWith("unix:///")) return normalized.length > 8;
  return (
    process.platform === "win32" &&
    normalized.startsWith("npipe:////./pipe/") &&
    normalized.length > 17
  );
}
function parsePodmanServiceIsRemote(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new Error("podman info returned an invalid response");
  }
  try {
    const serviceIsRemote = requireRecord(requireRecord(parsed).host).serviceIsRemote;
    if (typeof serviceIsRemote !== "boolean") throw new Error();
    return serviceIsRemote;
  } catch {
    throw new Error("podman info returned an invalid response");
  }
}
function parseDockerRootlessInfo(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    throw new Error("docker info returned an invalid security-options response");
  }
  if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === "string"))
    throw new Error("docker info returned an invalid security-options response");
  return parsed.some((entry) => entry.split(",").includes("name=rootless"));
}
function readEnvironmentValues(args, extraValues) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index] ?? "";
    let assignment;
    if (arg === "--env" || arg === "-e") {
      assignment = args[index + 1];
      index += 1;
    } else if (arg.startsWith("--env=")) assignment = arg.slice(6);
    else if (arg.startsWith("-e=")) assignment = arg.slice(3);
    if (!assignment) continue;
    const separator = assignment.indexOf("=");
    if (separator >= 0 && separator < assignment.length - 1)
      values.push(assignment.slice(separator + 1));
  }
  for (const value of extraValues ?? []) if (value) values.push(value);
  return [...new Set(values)];
}
function redactEnvironmentValues(text, args, extraValues) {
  let redacted = text;
  const values = readEnvironmentValues(args, extraValues).toSorted(
    (left, right) => right.length - left.length,
  );
  for (const value of values) redacted = redacted.replaceAll(value, "<redacted>");
  return redacted;
}
function formatExecutorError(error, runtime, args, extraValues) {
  const detail =
    error instanceof Error ? redactEnvironmentValues(error.message, args, extraValues).trim() : "";
  return new Error(detail || `${runtime} container command failed`);
}
function commandFailureError(runtime, args, result, extraValues) {
  const detail = redactEnvironmentValues(result.stderr, args, extraValues).trim();
  return new Error(detail || `${runtime} container command failed with exit code ${result.code}`);
}
const defaultFleetContainerCommandExecutor = async (runtime, args, options) => {
  const result = await runCommandWithTimeout([runtime, ...args], {
    timeoutMs: COMMAND_TIMEOUT_MS,
    maxOutputBytes: COMMAND_MAX_OUTPUT_BYTES,
  });
  const normalized = {
    stdout: result.stdout,
    stderr: redactEnvironmentValues(result.stderr, args, options.redactValues),
    code: result.code ?? 1,
  };
  if (normalized.code !== 0 && !options.allowFailure)
    throw commandFailureError(runtime, args, normalized, options.redactValues);
  return normalized;
};
const defaultFleetContainerStreamExecutor = (runtime, args, options) =>
  new Promise((resolve, reject) => {
    const child = spawn(runtime, args, { stdio: ["ignore", "pipe", "pipe"] });
    attachChildProcessBridge(child);
    const stdout = createRedactingStreamWriter(process.stdout, options.redactValues);
    const stderr = createRedactingStreamWriter(process.stderr, options.redactValues);
    const onTargetError = () => {
      child.kill("SIGTERM");
    };
    process.stdout.once("error", onTargetError);
    process.stderr.once("error", onTargetError);
    const pipeWithBackpressure = (source, targetStream, writer) => {
      source?.on("data", (chunk) => {
        if (!writer.write(chunk)) {
          source.pause();
          targetStream.once("drain", () => source.resume());
        }
      });
    };
    pipeWithBackpressure(child.stdout, process.stdout, stdout);
    pipeWithBackpressure(child.stderr, process.stderr, stderr);
    child.once("error", reject);
    child.once("close", (code, signal) => {
      stdout.flush();
      stderr.flush();
      process.stdout.removeListener("error", onTargetError);
      process.stderr.removeListener("error", onTargetError);
      resolve({
        code,
        signal,
      });
    });
  });
function isMissingContainerError(stderr) {
  const normalized = stderr.toLowerCase();
  return (
    normalized.includes("no such object") ||
    normalized.includes("no such container") ||
    normalized.includes("no container with name or id") ||
    /container .+ does not exist/u.test(normalized)
  );
}
function isMissingNetworkError(stderr) {
  const normalized = stderr.toLowerCase();
  return (
    normalized.includes("no such network") ||
    normalized.includes("network not found") ||
    /network .+ not found/u.test(normalized) ||
    /network .+ does not exist/u.test(normalized)
  );
}
function validateNetworkName(networkName) {
  const normalized = networkName.trim();
  if (!normalized || normalized.startsWith("-")) throw new Error("Fleet network name is invalid.");
  return normalized;
}
function validateContainerName(containerName) {
  const normalized = containerName.trim();
  if (!normalized || normalized.startsWith("-"))
    throw new Error("Fleet container name is invalid.");
  return normalized;
}
function buildLogsArgs(containerName, options) {
  const args = ["logs"];
  if (options.follow) args.push("--follow");
  if (options.tail !== void 0) {
    if (!Number.isSafeInteger(options.tail) || options.tail < 1)
      throw new Error("Fleet logs --tail must be a positive integer.");
    args.push("--tail", String(options.tail));
  }
  if (options.since !== void 0) {
    if (!options.since || options.since.startsWith("-") || /[\s\p{Cc}]/u.test(options.since))
      throw new Error(
        "Fleet logs --since must be non-empty, must not start with '-', and must not contain whitespace or control characters.",
      );
    args.push("--since", options.since);
  }
  args.push(validateContainerName(containerName));
  return args;
}
function createFleetContainerRuntime(
  executor = defaultFleetContainerCommandExecutor,
  streamExecutor = defaultFleetContainerStreamExecutor,
) {
  const execute = async (runtime, args, options = {}) => {
    try {
      const result = await executor(runtime, args, options);
      if (result.code !== 0 && !options.allowFailure)
        throw commandFailureError(runtime, args, result, options.redactValues);
      return {
        ...result,
        stderr: redactEnvironmentValues(result.stderr, args, options.redactValues),
      };
    } catch (error) {
      throw formatExecutorError(error, runtime, args, options.redactValues);
    }
  };
  return {
    async assertLocal(runtime) {
      if (runtime === "podman") {
        if (
          parsePodmanServiceIsRemote((await execute("podman", ["info", "--format", "json"])).stdout)
        )
          throw new Error("Fleet requires local Podman; remote cells are not supported.");
        return;
      }
      if (
        !isLocalDockerEndpoint(
          parseDockerContextEndpoint((await execute("docker", ["context", "inspect"])).stdout),
        )
      )
        throw new Error("Fleet requires a local Docker endpoint; remote cells are not supported.");
    },
    async inspect(runtime, containerName) {
      const args = ["container", "inspect", validateContainerName(containerName)];
      let result;
      try {
        result = await execute(runtime, args, { allowFailure: true });
      } catch (error) {
        return {
          kind: "unavailable",
          state: "unknown",
          error: formatExecutorError(error, runtime, args).message,
        };
      }
      if (result.code !== 0) {
        if (isMissingContainerError(result.stderr))
          return {
            kind: "missing",
            state: "missing",
          };
        return {
          kind: "unavailable",
          state: "unknown",
          error: result.stderr.trim() || `${runtime} container inspect failed`,
        };
      }
      try {
        return parseInspectOutput(result.stdout);
      } catch {
        return {
          kind: "unavailable",
          state: "unknown",
          error: "container inspect returned an invalid response",
        };
      }
    },
    async inspectNetwork(runtime, networkName) {
      const args = ["network", "inspect", validateNetworkName(networkName)];
      let result;
      try {
        result = await execute(runtime, args, { allowFailure: true });
      } catch (error) {
        return {
          kind: "unavailable",
          error: formatExecutorError(error, runtime, args).message,
        };
      }
      if (result.code !== 0) {
        if (isMissingNetworkError(result.stderr)) return { kind: "missing" };
        return {
          kind: "unavailable",
          error: result.stderr.trim() || `${runtime} network inspect failed`,
        };
      }
      try {
        return parseNetworkInspectOutput(result.stdout);
      } catch {
        return {
          kind: "unavailable",
          error: "network inspect returned an invalid response",
        };
      }
    },
    async isDockerRootless() {
      return parseDockerRootlessInfo(
        (await execute("docker", ["info", "--format", "{{json .SecurityOptions}}"])).stdout,
      );
    },
    async run(profile, start) {
      const tempRoot = await fs$1.realpath(os.tmpdir());
      const tempDir = await fs$1.mkdtemp(path.join(tempRoot, "openclaw-fleet-env-"));
      const environmentFile = path.join(tempDir, "cell.env");
      try {
        const args = start
          ? buildCellRunArgs(profile, { environmentFile })
          : buildCellCreateArgs(profile, { environmentFile });
        const content = Object.entries(profile.environment)
          .toSorted(([left], [right]) => left.localeCompare(right))
          .map(([key, value]) => `${key}=${value}\n`)
          .join("");
        await fs$1.writeFile(environmentFile, content, {
          encoding: "utf8",
          mode: 384,
        });
        await execute(profile.runtime, args, { redactValues: Object.values(profile.environment) });
      } finally {
        await fs$1.rm(tempDir, {
          recursive: true,
          force: true,
        });
      }
    },
    async pull(runtime, image) {
      await execute(runtime, ["pull", validateFleetImage(image)]);
    },
    async createNetwork(runtime, networkName, labels, options) {
      const labelArgs = Object.entries(labels)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .flatMap(([key, value]) => ["--label", `${key}=${value}`]);
      await execute(runtime, [
        "network",
        "create",
        "--driver",
        "bridge",
        ...(options.internal ? ["--internal"] : []),
        ...labelArgs,
        validateNetworkName(networkName),
      ]);
    },
    async removeNetwork(runtime, networkName) {
      await execute(runtime, ["network", "rm", validateNetworkName(networkName)]);
    },
    async start(runtime, containerName) {
      await execute(runtime, ["start", validateContainerName(containerName)]);
    },
    async stop(runtime, containerName) {
      await execute(runtime, ["stop", validateContainerName(containerName)]);
    },
    async restart(runtime, containerName) {
      await execute(runtime, ["restart", validateContainerName(containerName)]);
    },
    async logs(runtime, containerName, options) {
      const result = await streamExecutor(runtime, buildLogsArgs(containerName, options), {
        redactValues: options.redactValues,
      });
      if (result.code === 0) return;
      const deliberateStop =
        result.signal !== null && DELIBERATE_STREAM_STOP_SIGNALS.has(result.signal);
      if (options.follow && (deliberateStop || result.code === 130)) return;
      throw new Error(
        `${runtime} logs failed with ${result.signal ? `signal ${result.signal}` : `exit code ${result.code ?? 1}`}.`,
      );
    },
    async remove(runtime, containerName, force) {
      await execute(runtime, [
        "rm",
        ...(force ? ["--force"] : []),
        validateContainerName(containerName),
      ]);
    },
  };
}
//#endregion
//#region src/fleet/doctor.runtime.ts
function finding(check, status, detail) {
  return {
    check,
    status,
    detail,
  };
}
async function directoryFindings(params) {
  try {
    const stat = await fs$1.lstat(params.dir);
    if (!stat.isDirectory() || stat.isSymbolicLink())
      return [finding(params.check, "fail", `${params.dir} is not a real directory.`)];
    const findings = [
      (stat.mode & 511) === 448
        ? finding(params.check, "pass", `${params.dir} is a private 0700 directory.`)
        : finding(
            params.check,
            "fail",
            `${params.dir} has mode 0${(stat.mode & 511).toString(8)}; expected 0700.`,
          ),
    ];
    if (params.expectedUid !== void 0 && params.expectedUid > 0 && stat.uid !== params.expectedUid)
      findings.push(
        finding(
          `${params.check}-owner`,
          "warn",
          `${params.dir} is owned by uid ${stat.uid}; container uid is ${params.expectedUid}.`,
        ),
      );
    return findings;
  } catch (error) {
    return [
      finding(
        params.check,
        "fail",
        `${params.dir} cannot be inspected: ${error instanceof Error ? error.message : String(error)}.`,
      ),
    ];
  }
}
function diskLimitFinding(runtime, diskLimit, applied) {
  try {
    validateDiskSize(diskLimit);
  } catch {
    return finding(
      "disk-limit",
      "fail",
      `Container disk limit label is malformed and would break upgrade/restore replay: ${diskLimit}.`,
    );
  }
  if (runtime === "docker" && applied !== diskLimit)
    return finding(
      "disk-limit",
      "fail",
      `Container disk limit label is ${diskLimit} but the applied storage option is ${applied ?? "unset"}.`,
    );
  return finding(
    "disk-limit",
    "pass",
    runtime === "docker"
      ? `Container writable-layer disk limit is ${diskLimit}.`
      : `Container writable-layer disk limit was requested as ${diskLimit}; Podman does not expose the applied storage option for verification.`,
  );
}
async function runFleetDoctor(params) {
  const records = params.tenant
    ? [requireCell(params.env, params.tenant)]
    : listFleetCells(params.env);
  const stateDir = resolveStateDir(params.env);
  return await Promise.all(
    records.map(async (record) => {
      const findings = [];
      try {
        await params.containers.assertLocal(record.runtime);
        findings.push(
          finding("runtime-local", "pass", `${record.runtime} uses a local container endpoint.`),
        );
      } catch (error) {
        findings.push(
          finding(
            "runtime-local",
            "fail",
            `${record.runtime} locality check failed: ${error instanceof Error ? error.message : String(error)}.`,
          ),
        );
        return {
          tenant: record.tenantId,
          findings,
        };
      }
      let inspection;
      try {
        inspection = await params.containers.inspect(record.runtime, record.containerName);
      } catch (error) {
        findings.push(
          finding(
            "container-present",
            "fail",
            `Container inspection failed: ${error instanceof Error ? error.message : String(error)}.`,
          ),
        );
        return {
          tenant: record.tenantId,
          findings,
        };
      }
      if (inspection.kind !== "ok") {
        findings.push(
          finding(
            "container-present",
            "fail",
            inspection.kind === "missing"
              ? `Container ${record.containerName} is missing.`
              : `Container inspection failed: ${inspection.error}.`,
          ),
        );
        return {
          tenant: record.tenantId,
          findings,
        };
      }
      findings.push(
        finding("container-present", "pass", `Container ${record.containerName} is present.`),
      );
      const owned =
        inspection.labels["openclaw.fleet.tenant"] === record.tenantId &&
        inspection.labels["openclaw.fleet.owner"] === cellOwnerId(record.dataDir);
      findings.push(
        owned
          ? finding(
              "container-owned",
              "pass",
              `Container ownership labels match tenant ${record.tenantId}.`,
            )
          : finding(
              "container-owned",
              "fail",
              `Container ownership labels do not match tenant ${record.tenantId}.`,
            ),
      );
      findings.push(
        inspection.running
          ? finding("container-running", "pass", `Container ${record.containerName} is running.`)
          : finding("container-running", "warn", `Container ${record.containerName} is stopped.`),
      );
      if (owned) {
        if (inspection.running) {
          const health = await probeCellHealth({
            port: record.hostPort,
            fetchImpl: params.fetchImpl,
          });
          findings.push(
            health.status === "ok"
              ? finding(
                  "gateway-health",
                  "pass",
                  `Gateway health check returned HTTP ${health.httpStatus}.`,
                )
              : finding(
                  "gateway-health",
                  "fail",
                  `Gateway health check failed: ${health.status === "failed" ? health.error : health.reason}.`,
                ),
          );
        } else
          findings.push(
            finding(
              "gateway-health",
              "warn",
              "Gateway health check was skipped because the container is stopped.",
            ),
          );
        const capsDropped =
          inspection.capDrop.includes("ALL") ||
          (inspection.effectiveCaps !== void 0 && inspection.effectiveCaps.length === 0);
        findings.push(
          capsDropped
            ? finding("cap-drop", "pass", "Container drops all Linux capabilities.")
            : finding("cap-drop", "fail", "Container does not drop all Linux capabilities."),
        );
        findings.push(
          inspection.securityOpt.some(
            (option) => option === "no-new-privileges" || option === "no-new-privileges:true",
          )
            ? finding("security-opt", "pass", "Container enables no-new-privileges.")
            : finding("security-opt", "fail", "Container does not enable no-new-privileges."),
        );
        findings.push(
          inspection.init === true
            ? finding("init", "pass", "Container init is enabled.")
            : finding("init", "fail", "Container init is not enabled."),
        );
        for (const [check, value] of [
          ["pids-limit", inspection.pidsLimit],
          ["memory-limit", Number(inspection.memory)],
          ["cpu-limit", Number(inspection.cpus)],
        ])
          findings.push(
            typeof value === "number" && Number.isFinite(value) && value > 0
              ? finding(check, "pass", `${check} is positive.`)
              : finding(check, "fail", `${check} is missing or invalid.`),
          );
        findings.push(
          inspection.restartPolicy === "unless-stopped"
            ? finding("restart-policy", "pass", "Restart policy is unless-stopped.")
            : finding(
                "restart-policy",
                "fail",
                `Restart policy is ${inspection.restartPolicy ?? "unset"}; expected unless-stopped.`,
              ),
        );
        const expectedPort = String(record.hostPort);
        const binding = inspection.portBindings[0];
        const validBinding =
          inspection.portBindings.length === 1 &&
          binding?.containerPort === `18789/tcp` &&
          binding.hostIp === "127.0.0.1" &&
          binding.hostPort === expectedPort;
        findings.push(
          validBinding
            ? finding("port-binding", "pass", `Gateway port is bound to 127.0.0.1:${expectedPort}.`)
            : finding(
                "port-binding",
                "fail",
                `Gateway port binding must be exactly ${FLEET_GATEWAY_PORT}/tcp to 127.0.0.1:${expectedPort}.`,
              ),
        );
        const diskLimit = inspection.labels[FLEET_DISK_LIMIT_LABEL];
        if (diskLimit !== void 0)
          findings.push(diskLimitFinding(record.runtime, diskLimit, inspection.storageOpt.size));
        else if (inspection.storageOpt.size !== void 0)
          findings.push(
            finding(
              "disk-limit",
              "pass",
              `Container writable-layer disk limit is ${inspection.storageOpt.size}.`,
            ),
          );
        findings.push(
          inspection.environment.OPENCLAW_GATEWAY_TOKEN
            ? finding("gateway-token-env", "pass", "Gateway token environment is present.")
            : finding(
                "gateway-token-env",
                "fail",
                "Gateway token environment is missing or empty.",
              ),
        );
      }
      const networkName = cellNetworkName(record.tenantId);
      const network = await params.containers.inspectNetwork(record.runtime, networkName);
      if (network.kind !== "ok")
        findings.push(
          finding(
            "network-present",
            "fail",
            network.kind === "missing"
              ? `Network ${networkName} is missing.`
              : `Network inspection failed: ${network.error}.`,
          ),
        );
      else {
        findings.push(finding("network-present", "pass", `Network ${networkName} is present.`));
        const networkOwned =
          network.labels["openclaw.fleet.tenant"] === record.tenantId &&
          network.labels["openclaw.fleet.owner"] === cellOwnerId(record.dataDir);
        findings.push(
          networkOwned
            ? finding(
                "network-owned",
                "pass",
                `Network ownership labels match tenant ${record.tenantId}.`,
              )
            : finding(
                "network-owned",
                "fail",
                `Network ownership labels do not match tenant ${record.tenantId}.`,
              ),
        );
        const foreignAttachments = network.attachedContainers.filter(
          (attachment) => attachment.name !== record.containerName,
        );
        findings.push(
          foreignAttachments.length > 0
            ? finding(
                "network-attachments",
                "fail",
                "Unexpected containers are attached to the cell network.",
              )
            : record.runtime === "docker" &&
                inspection.running &&
                network.attachedContainers.length !== 1
              ? finding(
                  "network-attachments",
                  "fail",
                  "The running cell container is not attached to its network.",
                )
              : finding(
                  "network-attachments",
                  "pass",
                  "No unexpected containers are attached to the network.",
                ),
        );
        findings.push(
          network.internal && record.runtime === "docker"
            ? finding(
                "network-egress",
                "fail",
                "Docker internal networking breaks the published loopback Gateway port.",
              )
            : network.internal
              ? finding("network-egress", "pass", "egress: internal")
              : finding("network-egress", "pass", "egress: bridge (unrestricted)"),
        );
      }
      const userMatch = inspection.user?.match(/^(\d+):(\d+)$/u);
      const expectedUid = userMatch && Number(userMatch[1]) > 0 ? Number(userMatch[1]) : void 0;
      findings.push(
        ...(await directoryFindings({
          check: "data-dir",
          dir: record.dataDir,
          expectedUid,
        })),
      );
      findings.push(
        ...(await directoryFindings({
          check: "auth-dir",
          dir: cellAuthSecretDir(stateDir, record.tenantId),
          expectedUid,
        })),
      );
      return {
        tenant: record.tenantId,
        findings,
      };
    }),
  );
}
//#endregion
//#region src/fleet/service.runtime.ts
const OFFICIAL_IMAGE_UID = 1e3;
const OFFICIAL_IMAGE_GID = 1e3;
const CELL_VERIFY_TIMEOUT_MS = 6e4;
const CELL_VERIFY_POLL_MS = 1e3;
async function probeLoopbackPort(port) {
  return await new Promise((resolve) => {
    const server = createServer();
    server.once("error", (error) => {
      resolve(error.code !== "EADDRINUSE");
    });
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
  });
}
function createFleetService(options = {}) {
  const env = options.env ?? process.env;
  const containers = options.containers ?? createFleetContainerRuntime();
  const fetchImpl = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  const { generateToken = () => crypto.randomBytes(16).toString("hex") } = options;
  const generateAttemptId =
    options.generateAttemptId ?? (() => crypto.randomBytes(16).toString("hex"));
  const getuid = options.getuid ?? (() => process.getuid?.());
  const getgid = options.getgid ?? (() => process.getgid?.());
  const sleep =
    options.sleep ??
    ((ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      }));
  const selinuxEnabled = options.selinuxEnabled ?? detectHostSelinux;
  const updateImage = options.updateImage ?? updateFleetCellImage;
  const probePort = options.probePort ?? probeLoopbackPort;
  return {
    async create(createOptions) {
      const tenantId = validateTenantId(createOptions.tenant);
      const image = validateFleetImage(createOptions.image ?? "ghcr.io/openclaw/openclaw:latest");
      const runtime = createOptions.runtime ?? "docker";
      const network = createOptions.network ?? "bridge";
      const diskSize =
        createOptions.disk === void 0 ? void 0 : validateDiskSize(createOptions.disk);
      const { gatewayToken } = createOptions;
      if (gatewayToken !== void 0 && !gatewayToken.trim())
        throw new Error("Gateway token must not be empty.");
      const token = gatewayToken ?? generateToken();
      const environment = buildCellEnvironment(token, parseEnvAssignments(createOptions.env ?? []));
      const attemptId = generateAttemptId();
      await containers.assertLocal(runtime);
      if (network === "internal" && runtime === "docker")
        throw new Error(
          "Docker cannot publish loopback ports for containers on --internal networks, so the cell Gateway's 127.0.0.1 port would be unreachable and health-gated operations would always fail. Use --runtime podman for internal cells, or keep the default bridge network and enforce Docker egress policy with host firewall rules (DOCKER-USER chain).",
        );
      return await withFleetCellOperation({
        env,
        tenantId,
        operationName: "create",
        operation: async (checkpoint) => {
          checkpoint();
          const stateDir = resolveStateDir(env);
          const usedPorts = new Set(listFleetCells(env).map((cell) => cell.hostPort));
          const reservation = {
            tenantId,
            createdAtMs: now(),
            image,
            runtime,
            containerName: cellContainerName(tenantId),
            dataDir: cellDataDir(stateDir, tenantId),
          };
          let record;
          if (createOptions.port !== void 0) {
            const candidatePort = allocateHostPort(usedPorts, createOptions.port);
            if (!(await probePort(candidatePort)))
              throw new Error(
                `Host port ${candidatePort} is already in use on 127.0.0.1 by another process.`,
              );
            record = reserveFleetCell(env, {
              ...reservation,
              requestedPort: candidatePort,
            });
          } else {
            const unavailablePorts = new Set(usedPorts);
            while (!record) {
              for (const cell of listFleetCells(env)) unavailablePorts.add(cell.hostPort);
              const candidate = allocateHostPort(unavailablePorts);
              if (!(await probePort(candidate))) {
                unavailablePorts.add(candidate);
                continue;
              }
              try {
                record = reserveFleetCell(env, {
                  ...reservation,
                  requestedPort: candidate,
                });
              } catch (error) {
                if (getFleetCell(env, tenantId)) throw error;
                if (!listFleetCells(env).some((cell) => cell.hostPort === candidate)) throw error;
                unavailablePorts.add(candidate);
              }
            }
          }
          let result;
          let networkAttempted = false;
          let containerAttempted = false;
          try {
            const authSecretDir = cellAuthSecretDir(stateDir, tenantId);
            const hostIdentity = readHostIdentity(getuid, getgid);
            const containerUser = await resolveContainerUser({
              runtime,
              containers,
              hostIdentity,
            });
            const imageOwner =
              hostIdentity?.uid === 0 && !containerUser
                ? {
                    uid: OFFICIAL_IMAGE_UID,
                    gid: OFFICIAL_IMAGE_GID,
                  }
                : void 0;
            const profile = {
              tenantId,
              containerName: record.containerName,
              networkName: cellNetworkName(tenantId),
              image,
              runtime,
              hostPort: record.hostPort,
              dataDir: record.dataDir,
              authSecretDir,
              ownerId: cellOwnerId(record.dataDir),
              attemptId,
              memory: createOptions.memory ?? "2g",
              cpus: createOptions.cpus ?? "2",
              ...(diskSize ? { diskSize } : {}),
              pidsLimit: createOptions.pidsLimit ?? 512,
              environment,
              ...(containerUser ? { containerUser } : {}),
              selinuxRelabel: await selinuxEnabled(),
            };
            validateCellContainerProfile(profile);
            checkpoint();
            await prepareCellDirectories(record, authSecretDir, imageOwner);
            assertCurrentReservation(env, record);
            const started = createOptions.start !== false;
            networkAttempted = true;
            checkpoint();
            await containers.createNetwork(
              runtime,
              profile.networkName,
              {
                [FLEET_TENANT_LABEL]: tenantId,
                [FLEET_OWNER_LABEL]: profile.ownerId,
                [FLEET_ATTEMPT_LABEL]: attemptId,
              },
              { internal: network === "internal" },
            );
            assertCurrentReservation(env, record);
            containerAttempted = true;
            checkpoint();
            await containers.run(profile, false);
            assertCurrentReservation(env, record);
            checkpoint();
            await prepareCellConfig(record, imageOwner);
            assertCurrentReservation(env, record);
            if (started) {
              checkpoint();
              await containers.start(runtime, record.containerName);
              assertCurrentReservation(env, record);
            }
            const url = `http://127.0.0.1:${record.hostPort}`;
            result = {
              tenant: tenantId,
              containerName: record.containerName,
              port: record.hostPort,
              image,
              runtime,
              started,
              token,
              tokenNote: "Shown once. Store this Gateway token securely.",
              url,
              nextStep: `Open ${url}, then configure per-tenant channel accounts inside the cell.`,
            };
          } catch (error) {
            let releaseReservation = true;
            try {
              if (containerAttempted)
                releaseReservation = await cleanupFailedCreateContainer(
                  record,
                  containers,
                  attemptId,
                  checkpoint,
                );
              if (releaseReservation && networkAttempted)
                releaseReservation = await cleanupFailedCreateNetwork(
                  record,
                  containers,
                  attemptId,
                  checkpoint,
                );
            } catch {
              releaseReservation = false;
            }
            if (releaseReservation)
              try {
                checkpoint();
                deleteFleetCell(env, tenantId);
              } catch {}
            if (
              diskSize &&
              error instanceof Error &&
              /storage[ -]?opt|pquota|backingfs/iu.test(error.message)
            )
              throw new Error(
                `Fleet cannot enforce --disk on this container storage backend: ${error.message}. --disk requires Docker overlay2 on XFS with the pquota mount option (or btrfs/zfs storage drivers), or Podman overlay storage on XFS. Retry without --disk or move container storage to a supported filesystem.`,
                { cause: error },
              );
            throw error;
          }
          if (result.started)
            try {
              await verifyReplacementHealthy({
                containers,
                record,
                attemptId,
                fetchImpl,
                now,
                sleep,
                checkpoint,
                timeoutMs: CELL_VERIFY_TIMEOUT_MS,
                pollMs: CELL_VERIFY_POLL_MS,
                context: "create",
              });
            } catch (error) {
              throw new Error(
                `Fleet cell ${tenantId} was created but did not become healthy within 60s; inspect it with \`openclaw fleet status ${tenantId}\` or \`openclaw fleet logs ${tenantId}\`, or remove it with \`openclaw fleet rm ${tenantId} --force\`.`,
                { cause: error },
              );
            }
          return result;
        },
      });
    },
    async list() {
      const records = listFleetCells(env);
      const localityChecks = /* @__PURE__ */ new Map();
      const inspections = await Promise.all(
        records.map(async (record) => {
          try {
            let locality = localityChecks.get(record.runtime);
            if (!locality) {
              locality = containers.assertLocal(record.runtime);
              localityChecks.set(record.runtime, locality);
            }
            await locality;
            return await containers.inspect(record.runtime, record.containerName);
          } catch (error) {
            return {
              kind: "unavailable",
              state: "unknown",
              error: error instanceof Error ? error.message : String(error),
            };
          }
        }),
      );
      return records.map((record, index) => ({
        tenant: record.tenantId,
        state: inspectionState(
          record,
          inspections[index] ?? {
            kind: "unavailable",
            state: "unknown",
            error: "inspect result missing",
          },
        ),
        port: record.hostPort,
        image: record.image,
        created: new Date(record.createdAtMs).toISOString(),
      }));
    },
    async status(tenant) {
      const record = requireCell(env, tenant);
      let inspection;
      try {
        await containers.assertLocal(record.runtime);
        inspection = await containers.inspect(record.runtime, record.containerName);
      } catch (error) {
        inspection = {
          kind: "unavailable",
          state: "unknown",
          error: error instanceof Error ? error.message : String(error),
        };
      }
      const url = `http://127.0.0.1:${record.hostPort}/healthz`;
      let container;
      let health;
      if (inspection.kind === "ok") {
        const managed =
          inspection.labels["openclaw.fleet.tenant"] === record.tenantId &&
          inspection.labels["openclaw.fleet.owner"] === cellOwnerId(record.dataDir);
        container = {
          state: managed ? inspection.state : "unknown",
          running: inspection.running,
          managed,
          ...(managed ? { imageId: inspection.imageId } : {}),
        };
        health =
          managed && inspection.running
            ? await probeCellHealth({
                port: record.hostPort,
                fetchImpl,
              })
            : {
                status: "skipped",
                url,
                reason: managed ? "container is not running" : "fleet ownership mismatch",
              };
      } else if (inspection.kind === "missing") {
        container = {
          state: "missing",
          running: false,
          managed: false,
        };
        health = {
          status: "skipped",
          url,
          reason: "container is missing",
        };
      } else {
        container = {
          state: "unknown",
          running: false,
          managed: false,
          error: inspection.error,
        };
        health = {
          status: "skipped",
          url,
          reason: "container runtime unavailable",
        };
      }
      return {
        tenant: record.tenantId,
        containerName: record.containerName,
        runtime: record.runtime,
        port: record.hostPort,
        image: record.image,
        created: new Date(record.createdAtMs).toISOString(),
        dataDir: record.dataDir,
        container,
        health,
      };
    },
    async lifecycle(tenant, action) {
      const tenantId = validateTenantId(tenant);
      await containers.assertLocal(requireCell(env, tenantId).runtime);
      return await withFleetCellOperation({
        env,
        tenantId,
        operationName: action,
        operation: async (checkpoint) => {
          const record = requireCell(env, tenantId);
          await containers.assertLocal(record.runtime);
          assertManagedInspection(
            record,
            await containers.inspect(record.runtime, record.containerName),
          );
          checkpoint();
          await containers[action](record.runtime, record.containerName);
          return {
            tenant: record.tenantId,
            action,
          };
        },
      });
    },
    async logs(logOptions) {
      const record = requireCell(env, validateTenantId(logOptions.tenant));
      await containers.assertLocal(record.runtime);
      const inspection = assertManagedInspection(
        record,
        await containers.inspect(record.runtime, record.containerName),
      );
      const gatewayCredential = inspection.environment.OPENCLAW_GATEWAY_TOKEN;
      await containers.logs(record.runtime, inspection.containerId, {
        follow: logOptions.follow,
        tail: logOptions.tail,
        since: logOptions.since,
        redactValues: gatewayCredential ? [gatewayCredential] : [],
      });
    },
    async upgrade(tenant, requestedImage) {
      const tenantId = validateTenantId(tenant);
      const explicitImage = requestedImage === void 0 ? void 0 : validateFleetImage(requestedImage);
      await containers.assertLocal(requireCell(env, tenantId).runtime);
      return await withFleetCellOperation({
        env,
        tenantId,
        operationName: "upgrade",
        operation: async (checkpoint) => {
          const record = requireCell(env, tenantId);
          await containers.assertLocal(record.runtime);
          const inspection = assertManagedInspection(
            record,
            await containers.inspect(record.runtime, record.containerName),
          );
          const image = explicitImage ?? validateFleetImage(record.image);
          const token = requireInspectedGatewayToken(inspection, "upgrade");
          const containerUser = await resolveContainerUser({
            runtime: record.runtime,
            containers,
            hostIdentity: readHostIdentity(getuid, getgid),
            user: inspection.user,
          });
          const previousAttemptId = requireInspectedAttemptId(inspection, "upgrade");
          const nextAttemptId = generateAttemptId();
          const profileBase = buildProfileBaseFromInspection({
            record,
            stateDir: resolveStateDir(env),
            inspection,
            containerUser,
            selinuxRelabel: await selinuxEnabled(),
            token,
            context: "upgrade",
          });
          const oldProfile = {
            ...profileBase,
            image: inspection.imageId,
            attemptId: previousAttemptId,
          };
          const nextProfile = {
            ...profileBase,
            image,
            attemptId: nextAttemptId,
          };
          validateCellContainerProfile(oldProfile);
          validateCellContainerProfile(nextProfile);
          checkpoint();
          await containers.pull(record.runtime, image);
          checkpoint();
          assertManagedNetwork(
            record,
            await containers.inspectNetwork(record.runtime, cellNetworkName(record.tenantId)),
          );
          try {
            if (inspection.running) {
              checkpoint();
              await containers.stop(record.runtime, record.containerName);
            }
            checkpoint();
            await containers.remove(record.runtime, record.containerName, false);
            checkpoint();
            await containers.run(nextProfile, true);
            await verifyReplacementHealthy({
              containers,
              record,
              attemptId: nextAttemptId,
              fetchImpl,
              now,
              sleep,
              checkpoint,
              timeoutMs: CELL_VERIFY_TIMEOUT_MS,
              pollMs: CELL_VERIFY_POLL_MS,
              context: "upgrade",
            });
            checkpoint();
            updateImage(env, record.tenantId, image);
          } catch (error) {
            try {
              await restorePreviousCell({
                record,
                containers,
                oldProfile,
                previousAttemptId,
                nextAttemptId,
                wasRunning: inspection.running,
                checkpoint,
              });
            } catch {
              throw new Error(
                `Fleet upgrade failed for ${record.tenantId}; the previous container could not be restored.`,
                { cause: error },
              );
            }
            throw new Error(
              `Fleet upgrade failed for ${record.tenantId}; the previous container was restored.`,
              { cause: error },
            );
          }
          return {
            tenant: record.tenantId,
            action: "upgrade",
            image,
          };
        },
      });
    },
    async backup(params) {
      const tenantId = validateTenantId(params.tenant);
      return await withFleetCellOperation({
        env,
        tenantId,
        operationName: "backup",
        operation: async (checkpoint) => {
          checkpoint();
          return await backupFleetCell({
            record: requireCell(env, tenantId),
            stateDir: resolveStateDir(env),
            containers,
            now,
            checkpoint,
            out: params.out,
            maxBytes: params.maxBytes,
          });
        },
      });
    },
    async restore(params) {
      const tenantId = validateTenantId(params.tenant);
      return await withFleetCellOperation({
        env,
        tenantId,
        operationName: "restore",
        operation: async (checkpoint) => {
          return await restoreFleetCell({
            record: requireCell(env, tenantId),
            stateDir: resolveStateDir(env),
            containers,
            fetchImpl,
            now,
            sleep,
            checkpoint,
            generateToken,
            generateAttemptId,
            hostIdentity: readHostIdentity(getuid, getgid),
            selinuxRelabel: await selinuxEnabled(),
            from: params.from,
            force: params.force,
            maxBytes: params.maxBytes,
          });
        },
      });
    },
    async doctor(tenant) {
      return await runFleetDoctor({
        env,
        containers,
        fetchImpl,
        tenant,
        getuid,
        getgid,
      });
    },
    async remove(params) {
      if (params.purgeData && !params.force) throw new Error("--purge-data requires --force.");
      const tenantId = validateTenantId(params.tenant);
      await containers.assertLocal(requireCell(env, tenantId).runtime);
      return await withFleetCellOperation({
        env,
        tenantId,
        operationName: "rm",
        operation: async (checkpoint) => {
          const record = requireCell(env, tenantId);
          await containers.assertLocal(record.runtime);
          const stateDir = resolveStateDir(env);
          const authSecretDir = cellAuthSecretDir(stateDir, record.tenantId);
          const purgeTargets = [];
          if (params.purgeData) {
            const dataTarget = await resolvePurgeTarget(
              path.join(stateDir, "fleet", "cells"),
              record.dataDir,
              record.tenantId,
            );
            if (dataTarget) purgeTargets.push(dataTarget);
            const authTarget = await resolvePurgeTarget(
              path.join(stateDir, "fleet", "auth-profile-secrets"),
              authSecretDir,
              record.tenantId,
            );
            if (authTarget) purgeTargets.push(authTarget);
          }
          const inspection = await containers.inspect(record.runtime, record.containerName);
          if (inspection.kind === "unavailable")
            throw new Error(
              `Cannot inspect ${record.runtime} container for tenant ${record.tenantId}: ${inspection.error}`,
            );
          const networkName = cellNetworkName(record.tenantId);
          const networkInspection = await containers.inspectNetwork(record.runtime, networkName);
          if (networkInspection.kind === "unavailable")
            throw new Error(
              `Cannot inspect ${record.runtime} network for tenant ${record.tenantId}: ${networkInspection.error}`,
            );
          if (networkInspection.kind === "ok") assertManagedNetwork(record, networkInspection);
          if (inspection.kind === "ok") {
            assertManagedInspection(record, inspection);
            if (inspection.running && !params.force)
              throw new Error(
                `Fleet cell ${record.tenantId} is running; use --force to remove it.`,
              );
            checkpoint();
            await containers.remove(record.runtime, record.containerName, params.force === true);
          }
          if (networkInspection.kind === "ok") {
            checkpoint();
            await containers.removeNetwork(record.runtime, networkName);
          }
          if (purgeTargets.length > 0) {
            checkpoint();
            await Promise.all(
              purgeTargets.map((target) =>
                fs$1.rm(target, {
                  recursive: true,
                  force: true,
                }),
              ),
            );
          }
          checkpoint();
          deleteFleetCell(env, record.tenantId);
          return {
            tenant: record.tenantId,
            action: "rm",
            dataPurged: params.purgeData === true,
          };
        },
      });
    },
  };
}
//#endregion
//#region src/cli/fleet-cli/commands.runtime.ts
const fleetService = createFleetService();
async function runFleetCreateCommand(options) {
  const result = await fleetService.create(options);
  if (options.json) {
    defaultRuntime.writeJson(result);
    return;
  }
  defaultRuntime.log(`Tenant: ${result.tenant}`);
  defaultRuntime.log(`Container: ${result.containerName}`);
  defaultRuntime.log(`Port: ${result.port}`);
  defaultRuntime.log(`Token: ${result.token}`);
  defaultRuntime.log(result.tokenNote);
  defaultRuntime.log(`Next: ${result.nextStep}`);
}
async function runFleetBackupCommand(options) {
  const result = await fleetService.backup(options);
  if (options.json) {
    defaultRuntime.writeJson(result);
    return;
  }
  defaultRuntime.log(`Archive: ${result.archivePath}`);
  if (result.skippedSymlinks > 0 || result.skippedSpecial > 0)
    defaultRuntime.log(
      `Skipped ${result.skippedSymlinks} symlink(s) and ${result.skippedSpecial} special file(s); Fleet archives regular files and directories only.`,
    );
  defaultRuntime.log(result.note);
}
async function runFleetRestoreCommand(options) {
  const result = await fleetService.restore(options);
  if (options.json) {
    defaultRuntime.writeJson(result);
    return;
  }
  defaultRuntime.log(`Tenant: ${result.tenant}`);
  defaultRuntime.log(`Token: ${result.token}`);
  defaultRuntime.log(result.tokenNote);
}
async function runFleetDoctorCommand(options) {
  const reports = await fleetService.doctor(options.tenant);
  if (options.json) defaultRuntime.writeJson(reports);
  else {
    for (const report of reports) {
      defaultRuntime.log(`${report.tenant}:`);
      const nonPass = report.findings.filter((entry) => entry.status !== "pass");
      if (nonPass.length === 0) defaultRuntime.log("  ok");
      else
        for (const entry of nonPass)
          defaultRuntime.log(`  [${entry.status}] ${entry.check}: ${entry.detail}`);
    }
    const failures = reports
      .flatMap((report) => report.findings)
      .filter((entry) => entry.status === "fail").length;
    const warnings = reports
      .flatMap((report) => report.findings)
      .filter((entry) => entry.status === "warn").length;
    defaultRuntime.log(
      `Summary: ${reports.length} cell(s), ${failures} failure(s), ${warnings} warning(s).`,
    );
  }
  if (reports.some((report) => report.findings.some((entry) => entry.status === "fail")))
    process.exitCode = 1;
}
async function runFleetListCommand(options) {
  const cells = await fleetService.list();
  if (options.json) {
    defaultRuntime.writeJson({ cells });
    return;
  }
  if (cells.length === 0) {
    defaultRuntime.log("No fleet cells.");
    return;
  }
  defaultRuntime.log(
    renderTable({
      width: getTerminalTableWidth(),
      columns: [
        {
          key: "tenant",
          header: "Tenant",
          minWidth: 10,
          flex: true,
        },
        {
          key: "state",
          header: "State",
          minWidth: 10,
        },
        {
          key: "port",
          header: "Port",
          minWidth: 7,
        },
        {
          key: "image",
          header: "Image",
          minWidth: 24,
          flex: true,
        },
        {
          key: "created",
          header: "Created",
          minWidth: 24,
        },
      ],
      rows: cells.map((cell) => ({
        tenant: cell.tenant,
        state: cell.state,
        port: String(cell.port),
        image: cell.image,
        created: cell.created,
      })),
    }).trimEnd(),
  );
}
function formatHealth(health) {
  if (health.status === "ok") return `ok (HTTP ${health.httpStatus})`;
  if (health.status === "failed") return `failed (${health.error})`;
  return `skipped (${health.reason})`;
}
async function runFleetStatusCommand(options) {
  const result = await fleetService.status(options.tenant);
  if (options.json) {
    defaultRuntime.writeJson(result);
    return;
  }
  defaultRuntime.log(`Tenant: ${result.tenant}`);
  defaultRuntime.log(`Container: ${result.containerName}`);
  defaultRuntime.log(`State: ${result.container.state}`);
  defaultRuntime.log(`Port: ${result.port}`);
  defaultRuntime.log(`Image: ${result.image}`);
  defaultRuntime.log(`Created: ${result.created}`);
  defaultRuntime.log(`Data: ${result.dataDir}`);
  defaultRuntime.log(`Health: ${formatHealth(result.health)}`);
}
async function runFleetLogsCommand(options) {
  await fleetService.logs(options);
}
async function runFleetLifecycleCommand(options) {
  const result = await fleetService.lifecycle(options.tenant, options.action);
  defaultRuntime.log(`${result.action} complete for fleet cell ${result.tenant}.`);
}
async function runFleetUpgradeCommand(options) {
  const result = await fleetService.upgrade(options.tenant, options.image);
  defaultRuntime.log(`Upgraded fleet cell ${result.tenant} to ${result.image}.`);
}
async function runFleetRemoveCommand(options) {
  const result = await fleetService.remove(options);
  defaultRuntime.log(
    result.dataPurged
      ? `Removed fleet cell ${result.tenant} and purged its data.`
      : `Removed fleet cell ${result.tenant}; data retained.`,
  );
}
//#endregion
export {
  runFleetBackupCommand,
  runFleetCreateCommand,
  runFleetDoctorCommand,
  runFleetLifecycleCommand,
  runFleetListCommand,
  runFleetLogsCommand,
  runFleetRemoveCommand,
  runFleetRestoreCommand,
  runFleetStatusCommand,
  runFleetUpgradeCommand,
};
