import {
  c as createRuntimeHealthRecordEnvelope,
  l as createRuntimeHealthStore,
} from "./registry-DXbEDAsr.js";
//#region src/agents/tool-schema-quarantine-health.ts
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
const quarantineStore = createRuntimeHealthStore({
  ownerId: "core:runtime-tool-quarantine-health",
  namespace: "schema-quarantines",
  maxEntries: 128,
  ttlMs: 1440 * 60 * 1e3,
  normalizeRecord: (value) => {
    if (!isNonEmptyString(value.toolName) || !isNonEmptyString(value.reason)) return;
    return {
      toolName: value.toolName,
      reason: value.reason,
      failedAtMs: value.failedAtMs,
      processId: value.processId,
      processToken: value.processToken,
      processStartTime: value.processStartTime,
      ...(isNonEmptyString(value.owner) ? { owner: value.owner } : {}),
    };
  },
  displayKey: (record) => JSON.stringify([record.owner ?? "", record.toolName]),
  pick: "latest",
});
function recordKey(record) {
  return JSON.stringify([record.owner ?? "", record.toolName, record.processId]);
}
function identityKey(identity) {
  return JSON.stringify([identity.owner ?? "", identity.toolName]);
}
const locallyPersistedKeys = /* @__PURE__ */ new Set();
function recordPersistedRuntimeToolSchemaQuarantine(quarantine) {
  const record = {
    toolName: quarantine.toolName,
    reason: quarantine.reason,
    ...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
    ...(quarantine.owner ? { owner: quarantine.owner } : {}),
  };
  quarantineStore.register(recordKey(record), record);
  locallyPersistedKeys.add(identityKey(record));
}
/**
 * Removes this process's persisted quarantines for tools that now validate
 * cleanly. `listHealthyTools` is only invoked when this process has persisted
 * quarantines, keeping the common per-run path free of work.
 */
function clearRecoveredPersistedRuntimeToolSchemaQuarantines(listHealthyTools) {
  if (locallyPersistedKeys.size === 0) return;
  const recoveredKeys = new Set(
    listHealthyTools()
      .map(identityKey)
      .filter((key) => locallyPersistedKeys.has(key)),
  );
  if (recoveredKeys.size === 0) return;
  quarantineStore.clearForProcess(process.pid, (record) => recoveredKeys.has(identityKey(record)));
  for (const key of recoveredKeys) locallyPersistedKeys.delete(key);
}
function listPersistedRuntimeToolSchemaQuarantines() {
  return quarantineStore.list().map((record) => {
    const quarantine = {
      toolName: record.toolName,
      reason: record.reason,
      failedAt: new Date(record.failedAtMs),
    };
    if (record.owner) quarantine.owner = record.owner;
    return quarantine;
  });
}
//#endregion
export {
  listPersistedRuntimeToolSchemaQuarantines as n,
  recordPersistedRuntimeToolSchemaQuarantine as r,
  clearRecoveredPersistedRuntimeToolSchemaQuarantines as t,
};
