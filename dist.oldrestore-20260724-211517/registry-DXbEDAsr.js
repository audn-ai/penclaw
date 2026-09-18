import { randomUUID } from "node:crypto";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { n as getProcessStartTime } from "./pid-alive-FK23rkys.js";
import { t as createCorePluginStateSyncKeyedStore } from "./plugin-state-store-CdAHpy0G.js";
import { n as defaultSlotIdForKey } from "./slots-kpL659LX.js";
import { t as isStringOption } from "./string-readers-A0wspDGq.js";
//#region src/plugin-state/runtime-health-store.ts
const currentProcessToken = randomUUID();
function hasValidEnvelope(value) {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return (
    typeof record.processId === "number" &&
    Number.isInteger(record.processId) &&
    record.processId > 0 &&
    typeof record.processToken === "string" &&
    record.processToken.length > 0 &&
    (record.processStartTime === null ||
      (typeof record.processStartTime === "number" &&
        Number.isFinite(record.processStartTime) &&
        record.processStartTime >= 0)) &&
    typeof record.failedAtMs === "number" &&
    Number.isFinite(record.failedAtMs)
  );
}
/** Builds the common health envelope for records owned by this process. */
function createRuntimeHealthRecordEnvelope(failedAt) {
  return {
    processId: process.pid,
    processToken: currentProcessToken,
    processStartTime: getProcessStartTime(process.pid),
    failedAtMs: failedAt.getTime(),
  };
}
function processLooksLive(record) {
  if (record.processId === process.pid) return record.processToken === currentProcessToken;
  const currentStartTime = getProcessStartTime(record.processId);
  return currentStartTime !== null && currentStartTime === record.processStartTime;
}
/** Opens a SQLite-backed health record namespace shared across runtime processes. */
function createRuntimeHealthStore(options) {
  const openStore = () =>
    createCorePluginStateSyncKeyedStore({
      ownerId: options.ownerId,
      namespace: options.namespace,
      maxEntries: options.maxEntries,
      ...(options.ttlMs != null ? { defaultTtlMs: options.ttlMs } : {}),
    });
  const normalize = (value) => (hasValidEnvelope(value) ? options.normalizeRecord(value) : void 0);
  return {
    register(key, record) {
      openStore().register(key, record);
    },
    list() {
      try {
        const byGroup = /* @__PURE__ */ new Map();
        for (const entry of openStore().entries()) {
          const record = normalize(entry.value);
          if (!record || !processLooksLive(record)) continue;
          const groupKey = options.displayKey(record);
          const existing = byGroup.get(groupKey);
          if (
            !existing ||
            (options.pick === "latest"
              ? record.failedAtMs > existing.failedAtMs
              : record.failedAtMs < existing.failedAtMs)
          )
            byGroup.set(groupKey, record);
        }
        return [...byGroup.values()];
      } catch {
        return [];
      }
    },
    clearForProcess(processId, matches) {
      try {
        const store = openStore();
        for (const entry of store.entries()) {
          const record = normalize(entry.value);
          if (record?.processId === processId && (!matches || matches(record)))
            store.delete(entry.key);
        }
      } catch {}
    },
  };
}
//#endregion
//#region src/context-engine/quarantine-health.ts
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
const quarantineStore = createRuntimeHealthStore({
  ownerId: "core:context-engine-quarantine-health",
  namespace: "runtime-quarantines",
  maxEntries: 64,
  normalizeRecord: (value) => {
    if (
      !isNonEmptyString(value.engineId) ||
      !isNonEmptyString(value.operation) ||
      !isNonEmptyString(value.reason)
    )
      return;
    return {
      engineId: value.engineId,
      operation: value.operation,
      reason: value.reason,
      failedAtMs: value.failedAtMs,
      processId: value.processId,
      processToken: value.processToken,
      processStartTime: value.processStartTime,
      ...(isNonEmptyString(value.owner) ? { owner: value.owner } : {}),
    };
  },
  displayKey: (record) => record.engineId,
  pick: "earliest",
});
function recordKey(record) {
  return JSON.stringify([record.engineId, record.processId]);
}
function recordPersistedContextEngineQuarantine(quarantine) {
  const record = {
    engineId: quarantine.engineId,
    operation: quarantine.operation,
    reason: quarantine.reason,
    ...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
    ...(quarantine.owner ? { owner: quarantine.owner } : {}),
  };
  quarantineStore.register(recordKey(record), record);
}
function listPersistedContextEngineQuarantines() {
  return quarantineStore.list().map((record) => {
    const quarantine = {
      engineId: record.engineId,
      operation: record.operation,
      reason: record.reason,
      failedAt: new Date(record.failedAtMs),
    };
    if (record.owner) quarantine.owner = record.owner;
    return quarantine;
  });
}
function clearPersistedContextEngineQuarantineForProcess(engineId, processId) {
  quarantineStore.clearForProcess(
    processId,
    engineId === void 0 ? void 0 : (record) => record.engineId === engineId,
  );
}
//#endregion
//#region src/context-engine/registry.ts
const LEGACY_SESSION_KEY_COMPAT = Symbol.for("openclaw.contextEngine.sessionKeyCompat");
const RESOLVED_CONTEXT_ENGINE_METADATA = /* @__PURE__ */ new WeakMap();
const RUNTIME_QUARANTINE_PROXY_STATE = /* @__PURE__ */ new WeakMap();
const SESSION_KEY_COMPAT_METHODS = [
  "bootstrap",
  "maintain",
  "ingest",
  "ingestBatch",
  "afterTurn",
  "assemble",
  "compact",
];
const LEGACY_COMPAT_METHOD_KEYS = {
  bootstrap: ["sessionKey", "runtimeSettings", "sessionTarget", "runtimeContext"],
  maintain: ["sessionKey", "runtimeSettings", "sessionTarget", "runtimeContext"],
  ingest: ["sessionKey"],
  ingestBatch: ["sessionKey"],
  afterTurn: ["sessionKey", "runtimeSettings", "sessionTarget", "runtimeContext"],
  assemble: ["sessionKey", "prompt", "runtimeSettings"],
  compact: ["sessionKey", "runtimeSettings", "sessionTarget", "runtimeContext"],
};
function isSessionKeyCompatMethodName(value) {
  return isStringOption(value, SESSION_KEY_COMPAT_METHODS);
}
function hasOwnLegacyCompatKey(params, key) {
  return params !== null && typeof params === "object" && Object.hasOwn(params, key);
}
function withoutLegacyCompatKeys(params, keys) {
  const legacyParams = { ...params };
  for (const key of keys) delete legacyParams[key];
  return legacyParams;
}
function issueRejectsLegacyCompatKeyStrictly(issue, key) {
  if (!issue || typeof issue !== "object") return false;
  const issueRecord = issue;
  if (
    issueRecord.code === "unrecognized_keys" &&
    Array.isArray(issueRecord.keys) &&
    issueRecord.keys.some((issueKey) => issueKey === key)
  )
    return true;
  return isLegacyCompatErrorForKey(issueRecord.message, key);
}
function* iterateErrorChain(error) {
  let current = error;
  const seen = /* @__PURE__ */ new Set();
  while (current !== void 0 && current !== null && !seen.has(current)) {
    yield current;
    seen.add(current);
    if (typeof current !== "object") break;
    current = current.cause;
  }
}
const LEGACY_UNKNOWN_FIELD_PATTERNS = {
  sessionKey: [
    /\bunrecognized key(?:\(s\)|s)? in object:.*['"`]sessionKey['"`]/i,
    /\badditional propert(?:y|ies)\b.*['"`]sessionKey['"`]/i,
    /\bmust not have additional propert(?:y|ies)\b.*['"`]sessionKey['"`]/i,
    /\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionKey['"`]/i,
    /\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionKey['"`]/i,
    /['"`]sessionKey['"`].*\b(?:was|is)\s+not allowed\b/i,
    /"code"\s*:\s*"unrecognized_keys"[^]*"sessionKey"/i,
  ],
  prompt: [
    /\bunrecognized key(?:\(s\)|s)? in object:.*['"`]prompt['"`]/i,
    /\badditional propert(?:y|ies)\b.*['"`]prompt['"`]/i,
    /\bmust not have additional propert(?:y|ies)\b.*['"`]prompt['"`]/i,
    /\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]prompt['"`]/i,
    /\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]prompt['"`]/i,
    /['"`]prompt['"`].*\b(?:was|is)\s+not allowed\b/i,
    /"code"\s*:\s*"unrecognized_keys"[^]*"prompt"/i,
  ],
  runtimeSettings: [
    /\bunrecognized key(?:\(s\)|s)? in object:.*['"`]runtimeSettings['"`]/i,
    /\badditional propert(?:y|ies)\b.*['"`]runtimeSettings['"`]/i,
    /\bmust not have additional propert(?:y|ies)\b.*['"`]runtimeSettings['"`]/i,
    /\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeSettings['"`]/i,
    /\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeSettings['"`]/i,
    /['"`]runtimeSettings['"`].*\b(?:was|is)\s+not allowed\b/i,
    /"code"\s*:\s*"unrecognized_keys"[^]*"runtimeSettings"/i,
  ],
  sessionTarget: [
    /\bunrecognized key(?:\(s\)|s)? in object:.*['"`]sessionTarget['"`]/i,
    /\badditional propert(?:y|ies)\b.*['"`]sessionTarget['"`]/i,
    /\bmust not have additional propert(?:y|ies)\b.*['"`]sessionTarget['"`]/i,
    /\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionTarget['"`]/i,
    /\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]sessionTarget['"`]/i,
    /['"`]sessionTarget['"`].*\b(?:was|is)\s+not allowed\b/i,
    /"code"\s*:\s*"unrecognized_keys"[^]*"sessionTarget"/i,
  ],
  runtimeContext: [
    /\bunrecognized key(?:\(s\)|s)? in object:.*['"`]runtimeContext['"`]/i,
    /\badditional propert(?:y|ies)\b.*['"`]runtimeContext['"`]/i,
    /\bmust not have additional propert(?:y|ies)\b.*['"`]runtimeContext['"`]/i,
    /\b(?:unexpected|extraneous)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeContext['"`]/i,
    /\b(?:unknown|invalid)\s+(?:property|properties|field|fields|key|keys)\b.*['"`]runtimeContext['"`]/i,
    /['"`]runtimeContext['"`].*\b(?:was|is)\s+not allowed\b/i,
    /"code"\s*:\s*"unrecognized_keys"[^]*"runtimeContext"/i,
  ],
};
function isLegacyCompatUnknownFieldValidationMessage(message, key) {
  return LEGACY_UNKNOWN_FIELD_PATTERNS[key].some((pattern) => pattern.test(message));
}
function isLegacyCompatErrorForKey(error, key) {
  for (const candidate of iterateErrorChain(error)) {
    if (Array.isArray(candidate)) {
      if (candidate.some((entry) => issueRejectsLegacyCompatKeyStrictly(entry, key))) return true;
      continue;
    }
    if (typeof candidate === "string") {
      if (isLegacyCompatUnknownFieldValidationMessage(candidate, key)) return true;
      continue;
    }
    if (!candidate || typeof candidate !== "object") continue;
    const issueContainer = candidate;
    if (
      Array.isArray(issueContainer.issues) &&
      issueContainer.issues.some((issue) => issueRejectsLegacyCompatKeyStrictly(issue, key))
    )
      return true;
    if (
      Array.isArray(issueContainer.errors) &&
      issueContainer.errors.some((issue) => issueRejectsLegacyCompatKeyStrictly(issue, key))
    )
      return true;
    if (
      typeof issueContainer.message === "string" &&
      isLegacyCompatUnknownFieldValidationMessage(issueContainer.message, key)
    )
      return true;
  }
  return false;
}
function detectRejectedLegacyCompatKeys(error, allowedKeys) {
  const rejectedKeys = /* @__PURE__ */ new Set();
  for (const key of allowedKeys) if (isLegacyCompatErrorForKey(error, key)) rejectedKeys.add(key);
  return rejectedKeys;
}
async function invokeWithLegacyCompat(method, params, allowedKeys, opts) {
  const activeRejectedKeys = new Set(opts?.rejectedKeys ?? []);
  const availableKeys = allowedKeys.filter((key) => hasOwnLegacyCompatKey(params, key));
  if (availableKeys.length === 0) return await method(params);
  let currentParams =
    activeRejectedKeys.size > 0 ? withoutLegacyCompatKeys(params, activeRejectedKeys) : params;
  try {
    return await method(currentParams);
  } catch (error) {
    let currentError = error;
    while (true) {
      const rejectedKeys = detectRejectedLegacyCompatKeys(currentError, availableKeys);
      let learnedNewKey = false;
      for (const key of rejectedKeys)
        if (!activeRejectedKeys.has(key)) {
          activeRejectedKeys.add(key);
          learnedNewKey = true;
        }
      if (!learnedNewKey) throw currentError;
      opts?.onLegacyModeDetected?.();
      opts?.onLegacyKeysDetected?.(rejectedKeys);
      currentParams = withoutLegacyCompatKeys(params, activeRejectedKeys);
      try {
        return await method(currentParams);
      } catch (retryError) {
        currentError = retryError;
      }
    }
  }
}
function wrapContextEngineWithSessionKeyCompat(engine) {
  if (engine[LEGACY_SESSION_KEY_COMPAT]) return engine;
  const rejectedKeys = /* @__PURE__ */ new Set();
  return new Proxy(engine, {
    get(target, property, receiver) {
      if (property === LEGACY_SESSION_KEY_COMPAT) return true;
      const value = Reflect.get(target, property, receiver);
      if (typeof value !== "function") return value;
      if (!isSessionKeyCompatMethodName(property)) return value.bind(target);
      return (params) => {
        const method = value.bind(target);
        const allowedKeys = LEGACY_COMPAT_METHOD_KEYS[property];
        return invokeWithLegacyCompat(method, params, allowedKeys, {
          onLegacyKeysDetected: (keys) => {
            for (const key of keys) rejectedKeys.add(key);
          },
          rejectedKeys,
        });
      };
    },
  });
}
function wrapResolvedContextEngine(engine, metadata) {
  const compatWrapped = wrapContextEngineWithSessionKeyCompat(engine);
  const wrapped =
    metadata.defaultEngineId &&
    metadata.factoryCtx &&
    metadata.engineId !== metadata.defaultEngineId
      ? wrapContextEngineWithRuntimeQuarantine({
          engine: compatWrapped,
          engineId: metadata.engineId,
          owner: metadata.owner,
          defaultEngineId: metadata.defaultEngineId,
          factoryCtx: metadata.factoryCtx,
        })
      : compatWrapped;
  RESOLVED_CONTEXT_ENGINE_METADATA.set(wrapped, metadata);
  return wrapped;
}
const CONTEXT_ENGINE_REGISTRY_STATE = Symbol.for("openclaw.contextEngineRegistryState");
const CORE_CONTEXT_ENGINE_OWNER = "core";
const PUBLIC_CONTEXT_ENGINE_OWNER = "public-sdk";
const contextEngineRegistryState = resolveGlobalSingleton(CONTEXT_ENGINE_REGISTRY_STATE, () => ({
  engines: /* @__PURE__ */ new Map(),
  quarantinedEngines: /* @__PURE__ */ new Map(),
}));
function getContextEngineRegistryState() {
  return contextEngineRegistryState;
}
function requireContextEngineOwner(owner) {
  const normalizedOwner = owner.trim();
  if (!normalizedOwner)
    throw new Error(
      `registerContextEngineForOwner: owner must be a non-empty string, got ${JSON.stringify(owner)}`,
    );
  return normalizedOwner;
}
function formatContextEngineError(error) {
  return error instanceof Error ? error.message : String(error);
}
function recordContextEngineQuarantine(params) {
  const registryState = getContextEngineRegistryState();
  const existing = registryState.quarantinedEngines.get(params.engineId);
  if (existing) return existing;
  const quarantine = {
    engineId: params.engineId,
    operation: params.operation,
    reason: formatContextEngineError(params.error),
    failedAt: /* @__PURE__ */ new Date(),
    ...(params.owner ? { owner: params.owner } : {}),
  };
  registryState.quarantinedEngines.set(params.engineId, quarantine);
  try {
    recordPersistedContextEngineQuarantine(quarantine);
  } catch {}
  const ownerSuffix = params.owner ? ` owner=${sanitizeForLog(params.owner)}` : "";
  console.error(
    `[context-engine] Context engine "${sanitizeForLog(params.engineId)}"${ownerSuffix} failed during ${sanitizeForLog(params.operation)}: ${sanitizeForLog(quarantine.reason)}; quarantining it for this process and falling back to default engine "${params.defaultEngineId}".`,
  );
  return quarantine;
}
function getContextEngineQuarantine(engineId) {
  return getContextEngineRegistryState().quarantinedEngines.get(engineId);
}
function listContextEngineQuarantines() {
  const quarantines = [];
  for (const entry of getContextEngineRegistryState().quarantinedEngines.values()) {
    const quarantine = {
      engineId: entry.engineId,
      operation: entry.operation,
      reason: entry.reason,
      failedAt: new Date(entry.failedAt),
    };
    if (entry.owner) quarantine.owner = entry.owner;
    quarantines.push(quarantine);
  }
  const seenEngineIds = new Set(quarantines.map((entry) => entry.engineId));
  for (const entry of listPersistedContextEngineQuarantines()) {
    if (seenEngineIds.has(entry.engineId)) continue;
    quarantines.push(entry);
    seenEngineIds.add(entry.engineId);
  }
  return quarantines;
}
function clearContextEngineRuntimeQuarantine(engineId) {
  const quarantinedEngines = getContextEngineRegistryState().quarantinedEngines;
  if (engineId === void 0) {
    quarantinedEngines.clear();
    clearPersistedContextEngineQuarantineForProcess(void 0, process.pid);
    return;
  }
  quarantinedEngines.delete(engineId);
  clearPersistedContextEngineQuarantineForProcess(engineId, process.pid);
}
/**
 * Register a context engine implementation under an explicit trusted owner.
 */
function registerContextEngineForOwner(id, factory, owner, opts) {
  const normalizedOwner = requireContextEngineOwner(owner);
  const lifecycle = opts?.lifecycle ?? "runtime";
  const registry = getContextEngineRegistryState().engines;
  const existing = registry.get(id);
  if (id === defaultSlotIdForKey("contextEngine") && normalizedOwner !== CORE_CONTEXT_ENGINE_OWNER)
    return {
      ok: false,
      existingOwner: CORE_CONTEXT_ENGINE_OWNER,
    };
  if (existing && existing.owner !== normalizedOwner)
    return {
      ok: false,
      existingOwner: existing.owner,
    };
  if (existing?.lifecycle === "runtime" && lifecycle === "readOnlyDiscovery") return { ok: true };
  if (existing && opts?.allowSameOwnerRefresh !== true)
    return {
      ok: false,
      existingOwner: existing.owner,
    };
  registry.set(id, {
    factory,
    owner: normalizedOwner,
    lifecycle,
  });
  if (lifecycle === "runtime") clearContextEngineRuntimeQuarantine(id);
  return { ok: true };
}
/**
 * Public SDK entry point for third-party registrations.
 *
 * This path is intentionally unprivileged: it cannot claim core-owned ids and
 * it cannot safely refresh an existing registration because the caller's
 * identity is not authenticated.
 */
function registerContextEngine(id, factory) {
  return registerContextEngineForOwner(id, factory, PUBLIC_CONTEXT_ENGINE_OWNER);
}
/** Returns registration metadata so callers can distinguish discovery snapshots from runtime entries. */
function getContextEngineRegistration(id) {
  return getContextEngineRegistryState().engines.get(id);
}
/**
 * List all registered engine ids.
 */
function listContextEngineIds() {
  return [...getContextEngineRegistryState().engines.keys()];
}
function clearContextEnginesForOwner(owner) {
  const normalizedOwner = requireContextEngineOwner(owner);
  const registry = getContextEngineRegistryState().engines;
  for (const [id, entry] of registry.entries())
    if (entry.owner === normalizedOwner) {
      registry.delete(id);
      clearContextEngineRuntimeQuarantine(id);
    }
}
/**
 * Return the trusted plugin id that registered a resolved context engine.
 */
function resolveContextEngineOwnerPluginId(engine) {
  if (!engine) return;
  const owner = resolveEffectiveContextEngineMetadata(engine)?.owner;
  if (!owner?.startsWith("plugin:")) return;
  return owner.slice(7).trim() || void 0;
}
function resolveEffectiveContextEngineMetadata(engine) {
  const quarantineState = RUNTIME_QUARANTINE_PROXY_STATE.get(engine);
  if (quarantineState && getContextEngineQuarantine(quarantineState.engineId)) {
    const fallbackEngine = quarantineState.getResolvedFallbackEngine();
    return (
      (fallbackEngine ? RESOLVED_CONTEXT_ENGINE_METADATA.get(fallbackEngine) : void 0) ?? {
        owner: CORE_CONTEXT_ENGINE_OWNER,
      }
    );
  }
  return RESOLVED_CONTEXT_ENGINE_METADATA.get(engine);
}
function describeResolvedContextEngineContractError(engineId, engine) {
  if (!engine || typeof engine !== "object")
    return `Context engine "${engineId}" factory returned ${JSON.stringify(engine)} instead of a ContextEngine object.`;
  const candidate = engine;
  const issues = [];
  const info = candidate.info;
  if (!info || typeof info !== "object") issues.push("missing info");
  else {
    const infoRecord = info;
    if (!(typeof infoRecord.id === "string" ? infoRecord.id.trim() : ""))
      issues.push("missing info.id");
    if (typeof infoRecord.name !== "string" || !infoRecord.name.trim())
      issues.push("missing info.name");
  }
  if (typeof candidate.ingest !== "function") issues.push("missing ingest()");
  if (typeof candidate.assemble !== "function") issues.push("missing assemble()");
  if (typeof candidate.compact !== "function") issues.push("missing compact()");
  if (issues.length === 0) return null;
  return `Context engine "${engineId}" factory returned an invalid ContextEngine: ${issues.join(", ")}.`;
}
const GUARDED_CONTEXT_ENGINE_METHODS = /* @__PURE__ */ new Set([
  "bootstrap",
  "maintain",
  "ingest",
  "ingestBatch",
  "afterTurn",
  "assemble",
  "compact",
  "prepareSubagentSpawn",
  "onSubagentEnded",
]);
function contextEngineFallbackResult(methodName) {
  switch (methodName) {
    case "bootstrap":
      return {
        bootstrapped: false,
        reason: "context engine downgraded to legacy",
      };
    case "maintain":
      return {
        changed: false,
        bytesFreed: 0,
        rewrittenEntries: 0,
        reason: "context engine downgraded to legacy",
      };
    case "ingest":
      return { ingested: false };
    case "ingestBatch":
      return { ingestedCount: 0 };
    case "afterTurn":
    case "prepareSubagentSpawn":
    case "onSubagentEnded":
      return;
    case "assemble":
    case "compact":
      throw new Error(`No legacy fallback result for ${methodName}`);
  }
}
function contextEngineAbortSignal(methodParams) {
  if (!methodParams || typeof methodParams !== "object") return;
  const signal = methodParams.abortSignal;
  if (signal && typeof signal === "object" && "aborted" in signal) return signal;
}
function contextEngineAbortError(methodParams) {
  const signal = contextEngineAbortSignal(methodParams);
  if (!signal?.aborted) return;
  const reason = signal.reason;
  if (reason instanceof Error) return reason;
  return createAbortError(
    typeof reason === "string" && reason ? reason : "Context engine operation aborted.",
  );
}
function isContextEngineAbortRejection(error, methodParams) {
  const signal = contextEngineAbortSignal(methodParams);
  if (!signal?.aborted) return false;
  if (error === signal.reason) return true;
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      error.name === "AbortError" ||
      message.includes("abort") ||
      message.includes("cancelled") ||
      message.includes("canceled")
    );
  }
  return typeof error === "string" && /abort|cancelled|canceled/iu.test(error);
}
async function invokeFallbackContextEngineMethod(params) {
  const fallbackEngine = await params.getFallbackEngine();
  const fallbackMethod = fallbackEngine[params.methodName];
  if (typeof fallbackMethod === "function")
    return await fallbackMethod.call(fallbackEngine, params.methodParams);
  return contextEngineFallbackResult(params.methodName);
}
function wrapContextEngineWithRuntimeQuarantine(params) {
  let fallbackEnginePromise;
  let resolvedFallbackEngine;
  const getFallbackEngine = () => {
    fallbackEnginePromise ??= resolveDefaultContextEngine(
      params.defaultEngineId,
      params.factoryCtx,
    ).then((engine) => {
      resolvedFallbackEngine = engine;
      return engine;
    });
    return fallbackEnginePromise;
  };
  const fallbackInfo = () => {
    return (
      resolvedFallbackEngine?.info ?? {
        id: params.defaultEngineId,
        name:
          params.defaultEngineId === "legacy"
            ? "Legacy Context Engine"
            : `${params.defaultEngineId} Context Engine`,
      }
    );
  };
  const isQuarantined = () => Boolean(getContextEngineQuarantine(params.engineId));
  const proxy = new Proxy(params.engine, {
    get(target, property, receiver) {
      if (property === "info" && isQuarantined()) return fallbackInfo();
      const value = Reflect.get(target, property, receiver);
      if (typeof value !== "function" || !GUARDED_CONTEXT_ENGINE_METHODS.has(property))
        return typeof value === "function" ? value.bind(target) : value;
      const methodName = property;
      return async (methodParams) => {
        const aborted = contextEngineAbortError(methodParams);
        if (aborted) throw aborted;
        if (isQuarantined())
          return await invokeFallbackContextEngineMethod({
            getFallbackEngine,
            methodName,
            methodParams,
          });
        try {
          return await value.call(target, methodParams);
        } catch (error) {
          if (isContextEngineAbortRejection(error, methodParams)) throw error;
          recordContextEngineQuarantine({
            engineId: params.engineId,
            owner: params.owner,
            operation: methodName,
            error,
            defaultEngineId: params.defaultEngineId,
          });
          if (methodName === "compact" || methodName === "prepareSubagentSpawn") throw error;
          try {
            return await invokeFallbackContextEngineMethod({
              getFallbackEngine,
              methodName,
              methodParams,
            });
          } catch {
            throw error;
          }
        }
      };
    },
  });
  RUNTIME_QUARANTINE_PROXY_STATE.set(proxy, {
    engineId: params.engineId,
    getResolvedFallbackEngine: () => resolvedFallbackEngine,
  });
  return proxy;
}
/**
 * Resolve which ContextEngine to use based on plugin slot configuration.
 *
 * Resolution order:
 *   1. `config.plugins.slots.contextEngine` (explicit slot override)
 *   2. Default slot value ("legacy")
 *
 * When `config` is provided it is forwarded to the factory as part of a
 * {@link ContextEngineFactoryContext}. Additional runtime paths can be
 * supplied via `options`. Existing no-arg factories continue to work
 * because JavaScript permits extra arguments at call sites.
 *
 * Non-default engines that fail (unregistered, factory throw, or contract
 * violation) are logged and silently replaced by the default engine.
 * Throws only when the default engine itself cannot be resolved.
 */
async function resolveContextEngine(config, options) {
  const slotValue = config?.plugins?.slots?.contextEngine;
  const engineId =
    typeof slotValue === "string" && slotValue.trim()
      ? slotValue.trim()
      : defaultSlotIdForKey("contextEngine");
  const defaultEngineId = defaultSlotIdForKey("contextEngine");
  const isDefaultEngine = engineId === defaultEngineId;
  const factoryCtx = {
    config,
    agentDir: options?.agentDir,
    workspaceDir: options?.workspaceDir,
  };
  if (!isDefaultEngine ? getContextEngineQuarantine(engineId) : void 0)
    return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
  const entry = getContextEngineRegistryState().engines.get(engineId);
  if (!entry) {
    if (isDefaultEngine)
      throw new Error(
        `Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`,
      );
    recordContextEngineQuarantine({
      engineId,
      operation: "resolve",
      error: "not registered",
      defaultEngineId,
    });
    return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
  }
  if (!isDefaultEngine && entry.lifecycle === "readOnlyDiscovery") {
    console.warn(
      `[context-engine] Context engine "${engineId}" owner=${entry.owner} is registered for read-only discovery only; falling back to default engine "${defaultEngineId}" without quarantine until runtime activation registers it.`,
    );
    return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
  }
  let engine;
  try {
    engine = await entry.factory(factoryCtx);
  } catch (factoryError) {
    if (isDefaultEngine) throw factoryError;
    recordContextEngineQuarantine({
      engineId,
      owner: entry.owner,
      operation: "factory",
      error: factoryError,
      defaultEngineId,
    });
    return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
  }
  let contractError;
  try {
    contractError = describeResolvedContextEngineContractError(engineId, engine);
  } catch (validationError) {
    if (isDefaultEngine) throw validationError;
    recordContextEngineQuarantine({
      engineId,
      owner: entry.owner,
      operation: "contract-validation",
      error: validationError,
      defaultEngineId,
    });
    return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
  }
  if (contractError) {
    if (isDefaultEngine) throw new Error(contractError);
    recordContextEngineQuarantine({
      engineId,
      owner: entry.owner,
      operation: "contract-validation",
      error: contractError,
      defaultEngineId,
    });
    return resolveDefaultContextEngine(defaultEngineId, factoryCtx);
  }
  return wrapResolvedContextEngine(engine, {
    owner: entry.owner,
    engineId,
    defaultEngineId,
    factoryCtx,
  });
}
/**
 * Resolve the default context engine as a last-resort fallback.
 *
 * This helper is intentionally strict: if the default engine itself fails,
 * there is no further fallback and the error must propagate.
 */
async function resolveDefaultContextEngine(defaultEngineId, factoryCtx) {
  const defaultEntry = getContextEngineRegistryState().engines.get(defaultEngineId);
  if (!defaultEntry)
    throw new Error(
      `[context-engine] fallback failed: default engine "${defaultEngineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`,
    );
  const engine = await defaultEntry.factory(factoryCtx);
  const contractError = describeResolvedContextEngineContractError(defaultEngineId, engine);
  if (contractError) throw new Error(`[context-engine] ${contractError}`);
  return wrapResolvedContextEngine(engine, {
    owner: defaultEntry.owner,
    engineId: defaultEngineId,
  });
}
//#endregion
export {
  registerContextEngineForOwner as a,
  createRuntimeHealthRecordEnvelope as c,
  registerContextEngine as i,
  createRuntimeHealthStore as l,
  getContextEngineRegistration as n,
  resolveContextEngine as o,
  listContextEngineQuarantines as r,
  resolveContextEngineOwnerPluginId as s,
  clearContextEnginesForOwner as t,
};
