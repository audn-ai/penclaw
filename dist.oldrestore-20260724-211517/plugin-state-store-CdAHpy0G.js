import { C as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CJQ8TR--.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  f as resolveOpenClawStateSqlitePath,
  l as runOpenClawStateWriteTransaction,
  m as normalizeSqliteNumber,
  r as closeOpenClawStateDatabase,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import "./node-sqlite-BJtdZavS.js";
//#region src/plugin-state/plugin-state-store.types.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
  constructor(message, options) {
    super(message, { cause: options.cause });
    this.name = "PluginStateStoreError";
    this.code = options.code;
    this.operation = options.operation;
    if (options.path) this.path = options.path;
  }
};
const MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN = 5e4;
let cachedDatabase = null;
function createPluginStateError(params) {
  return new PluginStateStoreError(params.message, {
    code: params.code,
    operation: params.operation,
    ...(params.path ? { path: params.path } : {}),
    cause: params.cause,
  });
}
function resolvePluginStateExpiresAtMs(params) {
  if (params.ttlMs == null) return null;
  const expiresAt = resolveExpiresAtMsFromDurationMs(params.ttlMs, { nowMs: params.now });
  if (expiresAt === void 0)
    throw createPluginStateError({
      code: "PLUGIN_STATE_INVALID_INPUT",
      operation: params.operation,
      message: "Plugin state ttlMs cannot produce a valid expiry timestamp.",
      ...(params.path ? { path: params.path } : {}),
    });
  return expiresAt;
}
function wrapPluginStateError(
  error,
  operation,
  fallbackCode,
  message,
  pathname = resolveOpenClawStateSqlitePath(process.env),
) {
  if (error instanceof PluginStateStoreError) return error;
  return createPluginStateError({
    code: fallbackCode,
    operation,
    message,
    path: pathname,
    cause: error,
  });
}
function parseStoredJson(raw, operation) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw createPluginStateError({
      code: "PLUGIN_STATE_CORRUPT",
      operation,
      message: "Plugin state entry contains corrupt JSON.",
      path: resolveOpenClawStateSqlitePath(process.env),
      cause: error,
    });
  }
}
function rowToEntry(row, operation) {
  const expiresAt = normalizeSqliteNumber(row.expires_at);
  return {
    key: row.entry_key,
    value: parseStoredJson(row.value_json, operation),
    createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
    ...(expiresAt != null ? { expiresAt } : {}),
  };
}
function getPluginStateKysely(db) {
  return getNodeSqliteKysely(db);
}
function bindPluginStateEntry(params) {
  return {
    plugin_id: params.pluginId,
    namespace: params.namespace,
    entry_key: params.key,
    value_json: params.valueJson,
    created_at: params.createdAt,
    expires_at: params.expiresAt,
  };
}
function upsertPluginStateEntry(db, row) {
  executeSqliteQuerySync(
    db,
    getPluginStateKysely(db)
      .insertInto("plugin_state_entries")
      .values(row)
      .onConflict((conflict) =>
        conflict.columns(["plugin_id", "namespace", "entry_key"]).doUpdateSet({
          value_json: (eb) => eb.ref("excluded.value_json"),
          created_at: (eb) => eb.ref("excluded.created_at"),
          expires_at: (eb) => eb.ref("excluded.expires_at"),
        }),
      ),
  );
}
function insertPluginStateEntryIfAbsent(db, row) {
  const result = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db).insertInto("plugin_state_entries").orIgnore().values(row),
  );
  return Number(result.numAffectedRows ?? 0) > 0;
}
function selectPluginStateEntry(db, params) {
  return executeSqliteQueryTakeFirstSync(
    db,
    getPluginStateKysely(db)
      .selectFrom("plugin_state_entries")
      .select(["plugin_id", "namespace", "entry_key", "value_json", "created_at", "expires_at"])
      .where("plugin_id", "=", params.pluginId)
      .where("namespace", "=", params.namespace)
      .where("entry_key", "=", params.key)
      .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])),
  );
}
function selectPluginStateEntries(db, params) {
  return executeSqliteQuerySync(
    db,
    getPluginStateKysely(db)
      .selectFrom("plugin_state_entries")
      .select(["plugin_id", "namespace", "entry_key", "value_json", "created_at", "expires_at"])
      .where("plugin_id", "=", params.pluginId)
      .where("namespace", "=", params.namespace)
      .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]))
      .orderBy("created_at", "asc")
      .orderBy("entry_key", "asc"),
  ).rows;
}
function deletePluginStateEntry(db, params) {
  const result = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db)
      .deleteFrom("plugin_state_entries")
      .where("plugin_id", "=", params.pluginId)
      .where("namespace", "=", params.namespace)
      .where("entry_key", "=", params.key),
  );
  return Number(result.numAffectedRows ?? 0);
}
function deleteExpiredPluginStateNamespaceEntries(db, params) {
  executeSqliteQuerySync(
    db,
    getPluginStateKysely(db)
      .deleteFrom("plugin_state_entries")
      .where("plugin_id", "=", params.pluginId)
      .where("namespace", "=", params.namespace)
      .where("expires_at", "is not", null)
      .where("expires_at", "<=", params.now),
  );
}
function countLivePluginStateNamespaceEntries(db, params) {
  return countRow(
    executeSqliteQueryTakeFirstSync(
      db,
      getPluginStateKysely(db)
        .selectFrom("plugin_state_entries")
        .select((eb) => eb.fn.countAll().as("count"))
        .where("plugin_id", "=", params.pluginId)
        .where("namespace", "=", params.namespace)
        .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])),
    ),
  );
}
function countLivePluginStateEntries(db, params) {
  return countRow(
    executeSqliteQueryTakeFirstSync(
      db,
      getPluginStateKysely(db)
        .selectFrom("plugin_state_entries")
        .select((eb) => eb.fn.countAll().as("count"))
        .where("plugin_id", "=", params.pluginId)
        .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)])),
    ),
  );
}
function deleteOldestPluginStateNamespaceEntries(db, params) {
  const keys = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db)
      .selectFrom("plugin_state_entries")
      .select(["entry_key"])
      .where("plugin_id", "=", params.pluginId)
      .where("namespace", "=", params.namespace)
      .where("entry_key", "!=", params.protectedKey)
      .where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", params.now)]))
      .orderBy("created_at", "asc")
      .orderBy("entry_key", "asc")
      .limit(params.limit),
  ).rows;
  for (const row of keys)
    deletePluginStateEntry(db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      key: row.entry_key,
    });
}
function sweepExpiredPluginStateEntriesFromDatabase(db, now) {
  const result = executeSqliteQuerySync(
    db,
    getPluginStateKysely(db)
      .deleteFrom("plugin_state_entries")
      .where("expires_at", "is not", null)
      .where("expires_at", "<=", now),
  );
  return Number(result.numAffectedRows ?? 0);
}
function openPluginStateDatabase(operation = "open", options = {}) {
  const pathname = resolveOpenClawStateSqlitePath(options.env ?? process.env);
  if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen)
    return cachedDatabase;
  if (cachedDatabase && !cachedDatabase.db.isOpen) cachedDatabase = null;
  try {
    const database = openOpenClawStateDatabase(options);
    cachedDatabase = {
      db: database.db,
      path: database.path,
    };
    return cachedDatabase;
  } catch (error) {
    throw wrapPluginStateError(
      error,
      operation,
      "PLUGIN_STATE_OPEN_FAILED",
      "Failed to open the plugin state database.",
      pathname,
    );
  }
}
function countRow(row) {
  const raw = row?.count ?? 0;
  return typeof raw === "bigint" ? Number(raw) : raw;
}
function envOptions(env) {
  return env ? { env } : {};
}
function runWriteTransaction(operation, write, options = {}) {
  const store = openPluginStateDatabase(operation, options);
  return runOpenClawStateWriteTransaction(() => {
    return write(store);
  }, options);
}
function enforcePostRegisterLimits(params) {
  if (params.overflowPolicy === "reject-new") return;
  const namespaceCount = countLivePluginStateNamespaceEntries(params.store.db, {
    pluginId: params.pluginId,
    namespace: params.namespace,
    now: params.now,
  });
  if (namespaceCount > params.maxEntries)
    deleteOldestPluginStateNamespaceEntries(params.store.db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      protectedKey: params.protectedKey,
      now: params.now,
      limit: namespaceCount - params.maxEntries,
    });
  const pluginCount = countLivePluginStateEntries(params.store.db, {
    pluginId: params.pluginId,
    now: params.now,
  });
  const maxPluginEntries = resolveMaxPluginStateEntriesPerPlugin();
  if (pluginCount <= maxPluginEntries) return;
  deleteOldestPluginStateNamespaceEntries(params.store.db, {
    pluginId: params.pluginId,
    namespace: params.namespace,
    protectedKey: params.protectedKey,
    now: params.now,
    limit: pluginCount - maxPluginEntries,
  });
  if (
    countLivePluginStateEntries(params.store.db, {
      pluginId: params.pluginId,
      now: params.now,
    }) > maxPluginEntries
  )
    throw createPluginStateError({
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
      message: `Plugin state for ${params.pluginId} exceeds the ${maxPluginEntries} live row limit.`,
      path: params.store.path,
    });
}
function assertCanInsertPluginStateEntry(params) {
  if (params.overflowPolicy !== "reject-new") return;
  if (
    countLivePluginStateNamespaceEntries(params.store.db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      now: params.now,
    }) >= params.maxEntries
  )
    throw createPluginStateError({
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
      message: `Plugin state namespace ${params.namespace} for ${params.pluginId} reached its ${params.maxEntries}-row limit.`,
      path: params.store.path,
    });
  const maxPluginEntries = resolveMaxPluginStateEntriesPerPlugin();
  if (
    countLivePluginStateEntries(params.store.db, {
      pluginId: params.pluginId,
      now: params.now,
    }) >= maxPluginEntries
  )
    throw createPluginStateError({
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
      message: `Plugin state for ${params.pluginId} reached the ${maxPluginEntries} live row limit.`,
      path: params.store.path,
    });
}
function resolveMaxPluginStateEntriesPerPlugin() {
  return 5e4;
}
function pluginStateRegister(params) {
  try {
    runWriteTransaction(
      "register",
      (store) => {
        const now = Date.now();
        const expiresAt = resolvePluginStateExpiresAtMs({
          ttlMs: params.ttlMs,
          now,
          operation: "register",
          path: store.path,
        });
        deleteExpiredPluginStateNamespaceEntries(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          now,
        });
        if (
          !selectPluginStateEntry(store.db, {
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            now,
          })
        )
          assertCanInsertPluginStateEntry({
            store,
            pluginId: params.pluginId,
            namespace: params.namespace,
            maxEntries: params.maxEntries,
            overflowPolicy: params.overflowPolicy,
            now,
          });
        upsertPluginStateEntry(
          store.db,
          bindPluginStateEntry({
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            valueJson: params.valueJson,
            createdAt: now,
            expiresAt,
          }),
        );
        enforcePostRegisterLimits({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
          protectedKey: params.key,
        });
      },
      envOptions(params.env),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "register",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to register plugin state entry.",
    );
  }
}
function pluginStateRegisterIfAbsent(params) {
  try {
    return runWriteTransaction(
      "register",
      (store) => {
        const now = Date.now();
        const expiresAt = resolvePluginStateExpiresAtMs({
          ttlMs: params.ttlMs,
          now,
          operation: "register",
          path: store.path,
        });
        deleteExpiredPluginStateNamespaceEntries(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          now,
        });
        if (
          selectPluginStateEntry(store.db, {
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            now,
          })
        )
          return false;
        assertCanInsertPluginStateEntry({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
        });
        if (
          !insertPluginStateEntryIfAbsent(
            store.db,
            bindPluginStateEntry({
              pluginId: params.pluginId,
              namespace: params.namespace,
              key: params.key,
              valueJson: params.valueJson,
              createdAt: now,
              expiresAt,
            }),
          )
        )
          return false;
        enforcePostRegisterLimits({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
          protectedKey: params.key,
        });
        return true;
      },
      envOptions(params.env),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "register",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to register plugin state entry.",
    );
  }
}
function pluginStateUpdate(params) {
  try {
    return runWriteTransaction(
      "register",
      (store) => {
        const now = Date.now();
        deleteExpiredPluginStateNamespaceEntries(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          now,
        });
        const existing = selectPluginStateEntry(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now,
        });
        const next = params.updateValueJson(
          existing ? parseStoredJson(existing.value_json, "lookup") : void 0,
        );
        if (!next) return false;
        if (!existing)
          assertCanInsertPluginStateEntry({
            store,
            pluginId: params.pluginId,
            namespace: params.namespace,
            maxEntries: params.maxEntries,
            overflowPolicy: params.overflowPolicy,
            now,
          });
        const expiresAt = resolvePluginStateExpiresAtMs({
          ttlMs: next.ttlMs,
          now,
          operation: "register",
          path: store.path,
        });
        upsertPluginStateEntry(
          store.db,
          bindPluginStateEntry({
            pluginId: params.pluginId,
            namespace: params.namespace,
            key: params.key,
            valueJson: next.valueJson,
            createdAt: now,
            expiresAt,
          }),
        );
        enforcePostRegisterLimits({
          store,
          pluginId: params.pluginId,
          namespace: params.namespace,
          maxEntries: params.maxEntries,
          overflowPolicy: params.overflowPolicy,
          now,
          protectedKey: params.key,
        });
        return true;
      },
      envOptions(params.env),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "register",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to update plugin state entry.",
    );
  }
}
function pluginStateLookup(params) {
  try {
    const { db } = openPluginStateDatabase("lookup", envOptions(params.env));
    const row = selectPluginStateEntry(db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      key: params.key,
      now: Date.now(),
    });
    return row ? parseStoredJson(row.value_json, "lookup") : void 0;
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "lookup",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to read plugin state entry.",
    );
  }
}
function pluginStateConsume(params) {
  try {
    return runWriteTransaction(
      "consume",
      (store) => {
        const row = selectPluginStateEntry(store.db, {
          pluginId: params.pluginId,
          namespace: params.namespace,
          key: params.key,
          now: Date.now(),
        });
        if (!row) return;
        deletePluginStateEntry(store.db, params);
        return parseStoredJson(row.value_json, "consume");
      },
      envOptions(params.env),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "consume",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to consume plugin state entry.",
    );
  }
}
function pluginStateDelete(params) {
  try {
    return runWriteTransaction(
      "delete",
      ({ db }) => {
        return deletePluginStateEntry(db, params) > 0;
      },
      envOptions(params.env),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "delete",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to delete plugin state entry.",
    );
  }
}
function pluginStateEntries(params) {
  try {
    const { db } = openPluginStateDatabase("entries", envOptions(params.env));
    return selectPluginStateEntries(db, {
      pluginId: params.pluginId,
      namespace: params.namespace,
      now: Date.now(),
    }).map((row) => rowToEntry(row, "entries"));
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "entries",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to list plugin state entries.",
    );
  }
}
function pluginStateClear(params) {
  try {
    runWriteTransaction(
      "clear",
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getPluginStateKysely(db)
            .deleteFrom("plugin_state_entries")
            .where("plugin_id", "=", params.pluginId)
            .where("namespace", "=", params.namespace),
        );
      },
      envOptions(params.env),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "clear",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to clear plugin state namespace.",
    );
  }
}
function sweepExpiredPluginStateEntries() {
  try {
    return runWriteTransaction("sweep", ({ db }) =>
      sweepExpiredPluginStateEntriesFromDatabase(db, Date.now()),
    );
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "sweep",
      "PLUGIN_STATE_WRITE_FAILED",
      "Failed to sweep expired plugin state entries.",
    );
  }
}
function isPluginStateDatabaseOpen() {
  return cachedDatabase?.db.isOpen === true;
}
function countPluginStateLiveEntries(pluginId) {
  try {
    const { db } = openPluginStateDatabase("entries");
    return countLivePluginStateEntries(db, {
      pluginId,
      now: Date.now(),
    });
  } catch (error) {
    throw wrapPluginStateError(
      error,
      "entries",
      "PLUGIN_STATE_READ_FAILED",
      "Failed to count plugin state entries.",
    );
  }
}
function closePluginStateDatabase() {
  cachedDatabase = null;
  closeOpenClawStateDatabase();
}
//#endregion
//#region src/plugin-state/plugin-state-store.ts
const NAMESPACE_PATTERN = /^[a-z0-9][a-z0-9._-]*$/iu;
const MAX_NAMESPACE_BYTES = 128;
const MAX_KEY_BYTES = 512;
const MAX_JSON_DEPTH = 64;
const namespaceOptionSignatures = /* @__PURE__ */ new Map();
const textEncoder = new TextEncoder();
function invalidInput(message, operation = "register") {
  return new PluginStateStoreError(message, {
    code: "PLUGIN_STATE_INVALID_INPUT",
    operation,
  });
}
function assertMaxBytes(label, value, max, operation = "register") {
  if (textEncoder.encode(value).byteLength > max)
    throw invalidInput(`plugin state ${label} must be <= ${max} bytes`, operation);
}
function validateNamespace(value, operation = "open") {
  const trimmed = value.trim();
  if (!NAMESPACE_PATTERN.test(trimmed))
    throw invalidInput(`plugin state namespace must be a safe path segment: ${value}`, operation);
  assertMaxBytes("namespace", trimmed, MAX_NAMESPACE_BYTES, operation);
  return trimmed;
}
function validateKey(value, operation = "register") {
  const trimmed = value.trim();
  if (!trimmed) throw invalidInput("plugin state entry key must not be empty", operation);
  assertMaxBytes("entry key", trimmed, MAX_KEY_BYTES, operation);
  return trimmed;
}
function validateMaxEntries(value) {
  if (!Number.isInteger(value) || value < 1)
    throw invalidInput("plugin state maxEntries must be an integer >= 1", "open");
  return value;
}
function validateOverflowPolicy(value) {
  if (value === void 0 || value === "evict-oldest") return "evict-oldest";
  if (value === "reject-new") return value;
  throw invalidInput("plugin state overflowPolicy must be evict-oldest or reject-new", "open");
}
function validateOptionalTtlMs(value, operation = "register") {
  if (value == null) return;
  if (!Number.isSafeInteger(value) || value < 1)
    throw invalidInput("plugin state ttlMs must be a positive integer", operation);
  return value;
}
function assertPlainJsonValue(value, seen, path, depth = 0) {
  if (depth > MAX_JSON_DEPTH)
    throw new PluginStateStoreError(
      `plugin state value nesting exceeds maximum depth of ${MAX_JSON_DEPTH}`,
      {
        code: "PLUGIN_STATE_LIMIT_EXCEEDED",
        operation: "register",
      },
    );
  if (value === null) return;
  const valueType = typeof value;
  if (valueType === "string" || valueType === "boolean") return;
  if (valueType === "number") {
    if (!Number.isFinite(value))
      throw invalidInput(`plugin state value at ${path} must be a finite number`);
    return;
  }
  if (valueType !== "object")
    throw invalidInput(`plugin state value at ${path} must be JSON-serializable`);
  const objectValue = value;
  if (seen.has(objectValue))
    throw invalidInput(`plugin state value at ${path} must not contain circular references`);
  seen.add(objectValue);
  try {
    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        if (!(index in value))
          throw invalidInput(`plugin state array at ${path} must not be sparse`);
        assertPlainJsonValue(value[index], seen, `${path}[${index}]`, depth + 1);
      }
      return;
    }
    if (Object.getPrototypeOf(objectValue) !== Object.prototype)
      throw invalidInput(`plugin state object at ${path} must be a plain object`);
    const descriptorEntries = Object.entries(Object.getOwnPropertyDescriptors(objectValue));
    const enumerableKeys = Object.keys(objectValue);
    if (Object.getOwnPropertySymbols(objectValue).length > 0)
      throw invalidInput(`plugin state object at ${path} must not use symbol keys`);
    if (descriptorEntries.length !== enumerableKeys.length)
      throw invalidInput(`plugin state object at ${path} must not use non-enumerable properties`);
    for (const [key, descriptor] of descriptorEntries) {
      if (descriptor.get || descriptor.set || !("value" in descriptor))
        throw invalidInput(`plugin state object at ${path}.${key} must use data properties`);
      assertPlainJsonValue(descriptor.value, seen, `${path}.${key}`, depth + 1);
    }
  } finally {
    seen.delete(objectValue);
  }
}
function assertJsonSerializable(value) {
  assertPlainJsonValue(value, /* @__PURE__ */ new WeakSet(), "value");
}
function assertValueSize(json) {
  if (textEncoder.encode(json).byteLength > 65536)
    throw new PluginStateStoreError("plugin state value exceeds 64KB limit", {
      code: "PLUGIN_STATE_LIMIT_EXCEEDED",
      operation: "register",
    });
}
function prepareRegisterParams(key, value, defaultTtlMs, opts) {
  const normalizedKey = validateKey(key, "register");
  assertJsonSerializable(value);
  const json = JSON.stringify(value);
  if (json === void 0)
    throw invalidInput("plugin state value must be JSON-serializable", "register");
  assertValueSize(json);
  const ttlMs = validateOptionalTtlMs(opts?.ttlMs, "register") ?? defaultTtlMs;
  return {
    key: normalizedKey,
    valueJson: json,
    ...(ttlMs != null ? { ttlMs } : {}),
  };
}
function assertConsistentOptions(pluginId, namespace, signature) {
  const key = `${pluginId}\0${namespace}`;
  const existing = namespaceOptionSignatures.get(key);
  if (!existing) {
    namespaceOptionSignatures.set(key, signature);
    return;
  }
  if (
    existing.maxEntries !== signature.maxEntries ||
    existing.overflowPolicy !== signature.overflowPolicy ||
    existing.defaultTtlMs !== signature.defaultTtlMs
  )
    throw invalidInput(
      `plugin state namespace ${namespace} for ${pluginId} was reopened with incompatible options`,
      "open",
    );
}
function createKeyedStoreForPluginId(pluginId, options) {
  const namespace = validateNamespace(options.namespace);
  const maxEntries = validateMaxEntries(options.maxEntries);
  const overflowPolicy = validateOverflowPolicy(options.overflowPolicy);
  const defaultTtlMs = validateOptionalTtlMs(options.defaultTtlMs);
  const env = options.env;
  assertConsistentOptions(pluginId, namespace, {
    maxEntries,
    overflowPolicy,
    defaultTtlMs,
  });
  return {
    async register(key, value, opts) {
      const params = prepareRegisterParams(key, value, defaultTtlMs, opts);
      pluginStateRegister({
        pluginId,
        namespace,
        key: params.key,
        valueJson: params.valueJson,
        maxEntries,
        overflowPolicy,
        ...(env ? { env } : {}),
        ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
      });
    },
    async registerIfAbsent(key, value, opts) {
      const params = prepareRegisterParams(key, value, defaultTtlMs, opts);
      return pluginStateRegisterIfAbsent({
        pluginId,
        namespace,
        key: params.key,
        valueJson: params.valueJson,
        maxEntries,
        overflowPolicy,
        ...(env ? { env } : {}),
        ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
      });
    },
    async update(key, updateValue, opts) {
      const normalizedKey = validateKey(key, "register");
      return pluginStateUpdate({
        pluginId,
        namespace,
        key: normalizedKey,
        maxEntries,
        overflowPolicy,
        updateValueJson: (current) => {
          const next = updateValue(current);
          if (next === void 0) return;
          const params = prepareRegisterParams(normalizedKey, next, defaultTtlMs, opts);
          return {
            valueJson: params.valueJson,
            ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
          };
        },
        ...(env ? { env } : {}),
      });
    },
    async lookup(key) {
      const normalizedKey = validateKey(key, "lookup");
      return pluginStateLookup({
        pluginId,
        namespace,
        key: normalizedKey,
        ...(env ? { env } : {}),
      });
    },
    async consume(key) {
      const normalizedKey = validateKey(key, "consume");
      return pluginStateConsume({
        pluginId,
        namespace,
        key: normalizedKey,
        ...(env ? { env } : {}),
      });
    },
    async delete(key) {
      const normalizedKey = validateKey(key, "delete");
      return pluginStateDelete({
        pluginId,
        namespace,
        key: normalizedKey,
        ...(env ? { env } : {}),
      });
    },
    async entries() {
      return pluginStateEntries({
        pluginId,
        namespace,
        ...(env ? { env } : {}),
      });
    },
    async clear() {
      pluginStateClear({
        pluginId,
        namespace,
        ...(env ? { env } : {}),
      });
    },
  };
}
function createSyncKeyedStoreForPluginId(pluginId, options) {
  const namespace = validateNamespace(options.namespace);
  const maxEntries = validateMaxEntries(options.maxEntries);
  const overflowPolicy = validateOverflowPolicy(options.overflowPolicy);
  const defaultTtlMs = validateOptionalTtlMs(options.defaultTtlMs);
  const env = options.env;
  assertConsistentOptions(pluginId, namespace, {
    maxEntries,
    overflowPolicy,
    defaultTtlMs,
  });
  return {
    register(key, value, opts) {
      const params = prepareRegisterParams(key, value, defaultTtlMs, opts);
      pluginStateRegister({
        pluginId,
        namespace,
        key: params.key,
        valueJson: params.valueJson,
        maxEntries,
        overflowPolicy,
        ...(env ? { env } : {}),
        ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
      });
    },
    registerIfAbsent(key, value, opts) {
      const params = prepareRegisterParams(key, value, defaultTtlMs, opts);
      return pluginStateRegisterIfAbsent({
        pluginId,
        namespace,
        key: params.key,
        valueJson: params.valueJson,
        maxEntries,
        overflowPolicy,
        ...(env ? { env } : {}),
        ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
      });
    },
    update(key, updateValue, opts) {
      const normalizedKey = validateKey(key, "register");
      return pluginStateUpdate({
        pluginId,
        namespace,
        key: normalizedKey,
        maxEntries,
        overflowPolicy,
        updateValueJson: (current) => {
          const next = updateValue(current);
          if (next === void 0) return;
          const params = prepareRegisterParams(normalizedKey, next, defaultTtlMs, opts);
          return {
            valueJson: params.valueJson,
            ...(params.ttlMs != null ? { ttlMs: params.ttlMs } : {}),
          };
        },
        ...(env ? { env } : {}),
      });
    },
    lookup(key) {
      const normalizedKey = validateKey(key, "lookup");
      return pluginStateLookup({
        pluginId,
        namespace,
        key: normalizedKey,
        ...(env ? { env } : {}),
      });
    },
    consume(key) {
      const normalizedKey = validateKey(key, "consume");
      return pluginStateConsume({
        pluginId,
        namespace,
        key: normalizedKey,
        ...(env ? { env } : {}),
      });
    },
    delete(key) {
      const normalizedKey = validateKey(key, "delete");
      return pluginStateDelete({
        pluginId,
        namespace,
        key: normalizedKey,
        ...(env ? { env } : {}),
      });
    },
    entries() {
      return pluginStateEntries({
        pluginId,
        namespace,
        ...(env ? { env } : {}),
      });
    },
    clear() {
      pluginStateClear({
        pluginId,
        namespace,
        ...(env ? { env } : {}),
      });
    },
  };
}
/** Opens an async plugin-state namespace for a non-core plugin id. */
function createPluginStateKeyedStore(pluginId, options) {
  if (pluginId.startsWith("core:"))
    throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
  return createKeyedStoreForPluginId(pluginId, options);
}
/** Opens a sync plugin-state namespace for a non-core plugin id. */
function createPluginStateSyncKeyedStore(pluginId, options) {
  if (pluginId.startsWith("core:"))
    throw invalidInput("Plugin ids starting with 'core:' are reserved for core consumers.", "open");
  return createSyncKeyedStoreForPluginId(pluginId, options);
}
/** Opens a sync plugin-state namespace for a trusted core owner id. */
function createCorePluginStateSyncKeyedStore(options) {
  return createSyncKeyedStoreForPluginId(options.ownerId, options);
}
//#endregion
export {
  closePluginStateDatabase as a,
  sweepExpiredPluginStateEntries as c,
  MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN as i,
  createPluginStateKeyedStore as n,
  countPluginStateLiveEntries as o,
  createPluginStateSyncKeyedStore as r,
  isPluginStateDatabaseOpen as s,
  createCorePluginStateSyncKeyedStore as t,
};
