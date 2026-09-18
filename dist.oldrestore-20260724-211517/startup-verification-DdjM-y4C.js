import { createHash } from "node:crypto";
import "./number-runtime-B-n-wjMn.js";
import fs from "node:fs/promises";
import path from "node:path";
import { w as resolveMatrixSqliteStateEnv } from "./crypto-state-store-Dng6snPT.js";
import { t as formatMatrixErrorMessage } from "./errors-DJRnBTUk.js";
import { n as readJsonFileWithFallback } from "./json-store-CSxUwOCu.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { t as getMatrixRuntime } from "./runtime-C3viBnoh.js";
import {
  l as resolveMatrixStoragePaths,
  o as recordCurrentStorageMetaDeviceId,
} from "./storage-DhdP97oK.js";
//#region extensions/matrix/src/matrix/monitor/startup-verification.ts
const STARTUP_VERIFICATION_STATE_FILENAME = "startup-verification.json";
const STARTUP_VERIFICATION_NAMESPACE = "startup-verification";
const STARTUP_VERIFICATION_MIGRATIONS_NAMESPACE = "startup-verification-migrations";
const STARTUP_VERIFICATION_MAX_ENTRIES = 1e3;
const DEFAULT_STARTUP_VERIFICATION_MODE = "if-unverified";
const DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS = 24;
const DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS = 3600 * 1e3;
function normalizeCooldownHours(value) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return DEFAULT_STARTUP_VERIFICATION_COOLDOWN_HOURS;
  return Math.max(0, value);
}
function resolveStartupVerificationStatePath(params) {
  const storagePaths = resolveMatrixStoragePaths({
    homeserver: params.auth.homeserver,
    userId: params.auth.userId,
    accessToken: params.auth.accessToken,
    accountId: params.auth.accountId,
    deviceId: params.auth.deviceId,
    env: params.env,
    stateDir: params.stateDir,
  });
  return path.join(storagePaths.rootDir, STARTUP_VERIFICATION_STATE_FILENAME);
}
function buildStartupVerificationKey(auth) {
  return auth.accountId.trim() || "default";
}
function createStartupVerificationStore(params) {
  return getMatrixRuntime().state.openKeyedStore({
    namespace: STARTUP_VERIFICATION_NAMESPACE,
    maxEntries: STARTUP_VERIFICATION_MAX_ENTRIES,
    env: resolveMatrixSqliteStateEnv(params),
  });
}
function createStartupVerificationMigrationStore(params) {
  return getMatrixRuntime().state.openKeyedStore({
    namespace: STARTUP_VERIFICATION_MIGRATIONS_NAMESPACE,
    maxEntries: STARTUP_VERIFICATION_MAX_ENTRIES,
    env: resolveMatrixSqliteStateEnv(params),
  });
}
function buildStartupVerificationImportKey(params) {
  const accountId = params.auth.accountId.trim() || "default";
  return `${accountId}:${createHash("sha256").update(accountId).update("\0").update(params.legacyFilePath).digest("hex")}`;
}
async function readLegacyStartupVerificationState(filePath) {
  const { value } = await readJsonFileWithFallback(filePath, null);
  return value && typeof value === "object" ? value : null;
}
async function readStartupVerificationState(params) {
  const store = createStartupVerificationStore(params);
  const key = buildStartupVerificationKey(params.auth);
  const value = await store.lookup(key);
  if (value && typeof value === "object") return value;
  const migrationStore = createStartupVerificationMigrationStore(params);
  const legacyImportKey = buildStartupVerificationImportKey({
    auth: params.auth,
    legacyFilePath: params.legacyFilePath,
  });
  if (await migrationStore.lookup(legacyImportKey)) return null;
  const legacy = await readLegacyStartupVerificationState(params.legacyFilePath);
  if (legacy)
    await store
      .register(key, legacy)
      .then(async () => {
        if (typeof legacy.deviceId === "string" && legacy.deviceId.trim())
          recordCurrentStorageMetaDeviceId({
            rootDir: path.dirname(params.legacyFilePath),
            deviceId: legacy.deviceId,
          });
        await migrationStore.register(legacyImportKey, { importedAt: Date.now() });
        await fs.rm(params.legacyFilePath, { force: true }).catch(() => {});
      })
      .catch(() => {});
  return legacy;
}
async function writeStartupVerificationState(params) {
  await createStartupVerificationStore(params).register(
    buildStartupVerificationKey(params.auth),
    params.state,
  );
  await createStartupVerificationMigrationStore(params)
    .register(
      buildStartupVerificationImportKey({
        auth: params.auth,
        legacyFilePath: params.legacyFilePath,
      }),
      { importedAt: Date.now() },
    )
    .catch(() => {});
  if (typeof params.state.deviceId === "string" && params.state.deviceId.trim())
    recordCurrentStorageMetaDeviceId({
      rootDir: path.dirname(params.legacyFilePath),
      deviceId: params.state.deviceId,
    });
  await fs.rm(params.legacyFilePath, { force: true }).catch(() => {});
}
async function clearStartupVerificationState(params) {
  await createStartupVerificationStore(params)
    .delete(buildStartupVerificationKey(params.auth))
    .catch(() => {});
  await createStartupVerificationMigrationStore(params)
    .register(
      buildStartupVerificationImportKey({
        auth: params.auth,
        legacyFilePath: params.legacyFilePath,
      }),
      { importedAt: Date.now() },
    )
    .catch(() => {});
  await fs.rm(params.legacyFilePath, { force: true }).catch(() => {});
}
function resolveStateCooldownMs(state, cooldownMs) {
  if (state?.outcome === "failed")
    return Math.min(cooldownMs, DEFAULT_STARTUP_VERIFICATION_FAILURE_COOLDOWN_MS);
  return cooldownMs;
}
function resolveRetryAfterMs(params) {
  const attemptedAtMs = Date.parse(params.attemptedAt ?? "");
  if (!Number.isFinite(attemptedAtMs)) return;
  const remaining = attemptedAtMs + params.cooldownMs - params.nowMs;
  return remaining > 0 ? remaining : void 0;
}
function resolveStartupVerificationTimestamp(nowMs) {
  return (
    timestampMsToIsoString(nowMs) ??
    timestampMsToIsoString(Date.now()) ??
    "1970-01-01T00:00:00.000Z"
  );
}
function shouldHonorCooldown(params) {
  if (!params.state || params.stateCooldownMs <= 0) return false;
  if (
    params.state.userId &&
    params.verification.userId &&
    params.state.userId !== params.verification.userId
  )
    return false;
  if (
    params.state.deviceId &&
    params.verification.deviceId &&
    params.state.deviceId !== params.verification.deviceId
  )
    return false;
  return (
    resolveRetryAfterMs({
      attemptedAt: params.state.attemptedAt,
      cooldownMs: params.stateCooldownMs,
      nowMs: params.nowMs,
    }) !== void 0
  );
}
function hasPendingSelfVerification(verifications) {
  return verifications.some(
    (entry) => entry.isSelfVerification && !entry.completed && entry.pending,
  );
}
async function ensureMatrixStartupVerification(params) {
  if (params.auth.encryption !== true || !params.client.crypto) return { kind: "unsupported" };
  const verification = await params.client.getOwnDeviceVerificationStatus();
  const statePath =
    params.stateFilePath ??
    resolveStartupVerificationStatePath({
      auth: params.auth,
      env: params.env,
      stateDir: params.stateDir,
    });
  const stateDir = params.stateDir ?? path.dirname(statePath);
  if (verification.verified) {
    await clearStartupVerificationState({
      auth: params.auth,
      env: params.env,
      stateDir,
      legacyFilePath: statePath,
    });
    return {
      kind: "verified",
      verification,
    };
  }
  if ((params.accountConfig.startupVerification ?? DEFAULT_STARTUP_VERIFICATION_MODE) === "off") {
    await clearStartupVerificationState({
      auth: params.auth,
      env: params.env,
      stateDir,
      legacyFilePath: statePath,
    });
    return {
      kind: "disabled",
      verification,
    };
  }
  if (hasPendingSelfVerification(await params.client.crypto.listVerifications().catch(() => [])))
    return {
      kind: "pending",
      verification,
    };
  const cooldownMs =
    normalizeCooldownHours(params.accountConfig.startupVerificationCooldownHours) * 60 * 60 * 1e3;
  const nowMs = params.nowMs ?? Date.now();
  const attemptedAt = resolveStartupVerificationTimestamp(nowMs);
  const state = await readStartupVerificationState({
    auth: params.auth,
    env: params.env,
    stateDir,
    legacyFilePath: statePath,
  });
  const stateCooldownMs = resolveStateCooldownMs(state, cooldownMs);
  if (
    shouldHonorCooldown({
      state,
      verification,
      stateCooldownMs,
      nowMs,
    })
  )
    return {
      kind: "cooldown",
      verification,
      retryAfterMs: resolveRetryAfterMs({
        attemptedAt: state?.attemptedAt,
        cooldownMs: stateCooldownMs,
        nowMs,
      }),
    };
  try {
    const request = await params.client.crypto.requestVerification({ ownUser: true });
    await writeStartupVerificationState({
      auth: params.auth,
      env: params.env,
      stateDir,
      legacyFilePath: statePath,
      state: {
        userId: verification.userId,
        deviceId: verification.deviceId,
        attemptedAt,
        outcome: "requested",
        requestId: request.id,
        transactionId: request.transactionId,
      },
    });
    return {
      kind: "requested",
      verification,
      requestId: request.id,
      transactionId: request.transactionId ?? void 0,
    };
  } catch (err) {
    const error = formatMatrixErrorMessage(err);
    await writeStartupVerificationState({
      auth: params.auth,
      env: params.env,
      stateDir,
      legacyFilePath: statePath,
      state: {
        userId: verification.userId,
        deviceId: verification.deviceId,
        attemptedAt,
        outcome: "failed",
        error,
      },
    }).catch(() => {});
    return {
      kind: "request-failed",
      verification,
      error,
    };
  }
}
//#endregion
export { ensureMatrixStartupVerification };
