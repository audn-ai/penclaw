import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/plugin-sdk/migration.ts
/** Shared migration failure reason when an item lacks required paths. */
const MIGRATION_REASON_MISSING_SOURCE_OR_TARGET = "missing source or target";
/** Shared migration conflict reason when a target already exists. */
const MIGRATION_REASON_TARGET_EXISTS = "target exists";
/** Creates a migration item, defaulting new provider output to the planned state. */
function createMigrationItem(params) {
  return {
    ...params,
    status: params.status ?? "planned",
  };
}
/** Marks a planned item as blocked by an existing target value. */
function markMigrationItemConflict(item, reason) {
  return {
    ...item,
    status: "conflict",
    reason,
  };
}
/** Marks an item as failed during detection or apply. */
function markMigrationItemError(item, reason) {
  return {
    ...item,
    status: "error",
    reason,
  };
}
/** Marks an item as intentionally skipped, usually for manual follow-up. */
function markMigrationItemSkipped(item, reason) {
  return {
    ...item,
    status: "skipped",
    reason,
  };
}
/** Counts migration item statuses for provider plans, apply results, and CLI reports. */
function summarizeMigrationItems(items) {
  return {
    total: items.length,
    planned: items.filter((item) => item.status === "planned").length,
    migrated: items.filter((item) => item.status === "migrated").length,
    skipped: items.filter((item) => item.status === "skipped").length,
    conflicts: items.filter((item) => item.status === "conflict").length,
    errors: items.filter((item) => item.status === "error").length,
    sensitive: items.filter((item) => item.sensitive).length,
  };
}
const REDACTED_MIGRATION_VALUE = "[redacted]";
const SECRET_KEY_MARKERS = [
  "accesstoken",
  "apikey",
  "authorization",
  "bearertoken",
  "clientsecret",
  "cookie",
  "credential",
  "password",
  "privatekey",
  "refreshtoken",
  "secret",
];
const SECRET_VALUE_PATTERNS = [
  /\bBearer\s+[A-Za-z0-9._~+/=-]+/gu,
  /\bsk-[A-Za-z0-9_-]{8,}\b/gu,
  /\bgh[pousr]_[A-Za-z0-9_]{16,}\b/gu,
  /\bxox[abprs]-[A-Za-z0-9-]{8,}\b/gu,
  /\bAIza[0-9A-Za-z_-]{12,}\b/gu,
];
function normalizeSecretKey(key) {
  return key.toLowerCase().replaceAll(/[^a-z0-9]/gu, "");
}
function isSecretKey(key) {
  const normalized = normalizeSecretKey(key);
  if (normalized === "token" || normalized.endsWith("token")) return true;
  if (normalized === "auth" || normalized === "authorization") return true;
  return SECRET_KEY_MARKERS.some((marker) => normalized.includes(marker));
}
var MigrationConfigPatchConflictError = class extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason;
    this.name = "MigrationConfigPatchConflictError";
  }
};
const MIGRATION_REASON_UNSAFE_CONFIG_PATCH_PATH = "unsafe config patch path";
function isSafeMigrationConfigPath(path) {
  return (
    path.length > 0 && path.every((segment) => segment.length > 0 && !isBlockedObjectKey(segment))
  );
}
function cloneMigrationConfigValue(value) {
  if (Array.isArray(value)) return value.map((entry) => cloneMigrationConfigValue(entry));
  if (!isRecord(value)) return structuredClone(value);
  const next = {};
  for (const [key, entry] of Object.entries(value))
    if (!isBlockedObjectKey(key)) next[key] = cloneMigrationConfigValue(entry);
  return next;
}
/** Reads a nested config value, returning undefined when a parent is not an object. */
function readMigrationConfigPath(root, path) {
  if (!isSafeMigrationConfigPath(path)) return;
  let current = root;
  for (const segment of path) {
    if (!isRecord(current)) return;
    current = current[segment];
  }
  return current;
}
/** Deep-merges object patches and replaces scalar/array values with a cloned target value. */
function mergeMigrationConfigValue(left, right) {
  if (!isRecord(left) || !isRecord(right)) return cloneMigrationConfigValue(right);
  const next = { ...left };
  for (const [key, value] of Object.entries(right)) {
    if (isBlockedObjectKey(key)) continue;
    next[key] = mergeMigrationConfigValue(next[key], value);
  }
  return next;
}
/** Writes a config patch path in-place, creating missing object parents as needed. */
function writeMigrationConfigPath(root, path, value) {
  if (!isSafeMigrationConfigPath(path)) throw new Error(MIGRATION_REASON_UNSAFE_CONFIG_PATCH_PATH);
  let current = root;
  for (const segment of path.slice(0, -1)) {
    const existing = current[segment];
    if (!isRecord(existing)) current[segment] = {};
    current = current[segment];
  }
  const leaf = path.at(-1);
  if (!leaf) throw new Error(MIGRATION_REASON_UNSAFE_CONFIG_PATCH_PATH);
  current[leaf] = mergeMigrationConfigValue(current[leaf], value);
}
/** Checks whether a config patch would overwrite existing leaf keys without `--overwrite`. */
function hasMigrationConfigPatchConflict(config, path, value) {
  if (!isRecord(value)) return readMigrationConfigPath(config, path) !== void 0;
  const existing = readMigrationConfigPath(config, path);
  if (!isRecord(existing)) return false;
  return Object.keys(value).some(
    (key) => !isBlockedObjectKey(key) && Object.hasOwn(existing, key) && existing[key] !== void 0,
  );
}
/** Builds a planned or conflicting config-merge migration item. */
function createMigrationConfigPatchItem(params) {
  return createMigrationItem({
    id: params.id,
    kind: "config",
    action: "merge",
    source: params.source,
    target: params.target,
    status: params.conflict ? "conflict" : "planned",
    reason: params.conflict ? (params.reason ?? "target exists") : void 0,
    message: params.message,
    sensitive: params.sensitive,
    details: {
      ...params.details,
      path: params.path,
      value: params.value,
    },
  });
}
/** Builds a skipped item that records user-facing manual migration guidance. */
function createMigrationManualItem(params) {
  return createMigrationItem({
    id: params.id,
    kind: "manual",
    action: "manual",
    source: params.source,
    status: "skipped",
    message: params.message,
    reason: params.recommendation,
  });
}
/** Reads config patch metadata from an item produced by `createMigrationConfigPatchItem`. */
function readMigrationConfigPatchDetails(item) {
  const path = item.details?.path;
  if (!Array.isArray(path) || !path.every((segment) => typeof segment === "string")) return;
  return {
    path,
    value: item.details?.value,
  };
}
/** Applies one planned config patch through the runtime config writer and returns its final status. */
async function applyMigrationConfigPatchItem(ctx, item) {
  if (item.status !== "planned") return item;
  const details = readMigrationConfigPatchDetails(item);
  if (!details) return markMigrationItemError(item, "missing config patch");
  if (!isSafeMigrationConfigPath(details.path))
    return markMigrationItemError(item, MIGRATION_REASON_UNSAFE_CONFIG_PATCH_PATH);
  const configApi = ctx.runtime?.config;
  if (!configApi?.current || !configApi.mutateConfigFile)
    return markMigrationItemError(item, "config runtime unavailable");
  try {
    const currentConfig = configApi.current();
    if (
      !ctx.overwrite &&
      hasMigrationConfigPatchConflict(currentConfig, details.path, details.value)
    )
      return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
    await configApi.mutateConfigFile({
      base: "runtime",
      afterWrite: { mode: "auto" },
      mutate(draft) {
        if (!ctx.overwrite && hasMigrationConfigPatchConflict(draft, details.path, details.value))
          throw new MigrationConfigPatchConflictError(MIGRATION_REASON_TARGET_EXISTS);
        writeMigrationConfigPath(draft, details.path, details.value);
      },
    });
    return {
      ...item,
      status: "migrated",
    };
  } catch (err) {
    if (err instanceof MigrationConfigPatchConflictError)
      return markMigrationItemConflict(item, err.reason);
    return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
  }
}
/** Manual items never mutate state; applying one preserves the skipped/manual status. */
function applyMigrationManualItem(item) {
  return markMigrationItemSkipped(item, item.reason ?? "manual follow-up required");
}
function isSecretReferenceLike(value) {
  if (!isRecord(value)) return false;
  return (
    value.source === "env" &&
    typeof value.id === "string" &&
    (value.provider === void 0 || typeof value.provider === "string")
  );
}
function redactString(value) {
  let next = value;
  for (const pattern of SECRET_VALUE_PATTERNS)
    next = next.replace(pattern, REDACTED_MIGRATION_VALUE);
  return next;
}
function redactMigrationValueInternal(value, seen) {
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) return value.map((entry) => redactMigrationValueInternal(entry, seen));
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return REDACTED_MIGRATION_VALUE;
  seen.add(value);
  const record = value;
  const next = {};
  const redactSensitiveDetailsValue =
    record.sensitive === true && isRecord(record.details) && Object.hasOwn(record.details, "value");
  for (const [key, entry] of Object.entries(record)) {
    if (key === "details" && redactSensitiveDetailsValue && isRecord(entry)) {
      const details = redactMigrationValueInternal(entry, seen);
      next[key] = isRecord(details)
        ? {
            ...details,
            value: REDACTED_MIGRATION_VALUE,
          }
        : REDACTED_MIGRATION_VALUE;
      continue;
    }
    if (isSecretKey(key) && !isSecretReferenceLike(entry)) {
      next[key] = REDACTED_MIGRATION_VALUE;
      continue;
    }
    next[key] = redactMigrationValueInternal(entry, seen);
  }
  return next;
}
/** Redacts likely secret values while preserving SecretRef-like objects for operator context. */
function redactMigrationValue(value) {
  return redactMigrationValueInternal(value, /* @__PURE__ */ new WeakSet());
}
/** Redacts sensitive fields from one migration item before report/output serialization. */
function redactMigrationItem(item) {
  return redactMigrationValue(item);
}
/** Redacts sensitive fields from a full migration plan before report/output serialization. */
function redactMigrationPlan(plan) {
  return redactMigrationValue(plan);
}
//#endregion
export {
  redactMigrationValue as _,
  createMigrationConfigPatchItem as a,
  hasMigrationConfigPatchConflict as c,
  markMigrationItemSkipped as d,
  mergeMigrationConfigValue as f,
  redactMigrationPlan as g,
  redactMigrationItem as h,
  applyMigrationManualItem as i,
  markMigrationItemConflict as l,
  readMigrationConfigPath as m,
  MIGRATION_REASON_TARGET_EXISTS as n,
  createMigrationItem as o,
  readMigrationConfigPatchDetails as p,
  applyMigrationConfigPatchItem as r,
  createMigrationManualItem as s,
  MIGRATION_REASON_MISSING_SOURCE_OR_TARGET as t,
  markMigrationItemError as u,
  summarizeMigrationItems as v,
  writeMigrationConfigPath as y,
};
