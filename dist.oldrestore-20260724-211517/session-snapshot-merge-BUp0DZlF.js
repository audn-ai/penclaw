import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-snapshot-merge.ts
const SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS = [
  "providerOverride",
  "modelOverride",
  "agentRuntimeOverride",
  "modelOverrideSource",
  "modelOverrideFallbackOriginProvider",
  "modelOverrideFallbackOriginModel",
  "authProfileOverride",
  "authProfileOverrideSource",
  "authProfileOverrideCompactionCount",
];
const MODEL_ROUTE_OVERRIDE_FIELDS = ["providerOverride", "modelOverride", "agentRuntimeOverride"];
const MODEL_OVERRIDE_RUNTIME_FIELDS = [
  "modelProvider",
  "model",
  "fallbackNoticeSelectedModel",
  "fallbackNoticeActiveModel",
  "fallbackNoticeReason",
  "contextTokens",
  "contextBudgetStatus",
];
const MODEL_OVERRIDE_RUNTIME_FIELD_SET = new Set(MODEL_OVERRIDE_RUNTIME_FIELDS);
const MODEL_OVERRIDE_DEPENDENT_FIELDS = /* @__PURE__ */ new Set([
  ...MODEL_OVERRIDE_RUNTIME_FIELDS,
  "liveModelSwitchPending",
  "thinkingLevel",
]);
const MODEL_OVERRIDE_CONFLICT_DEPENDENT_FIELDS = ["thinkingLevel"];
function anySessionFieldChanged(before, after, fields) {
  return fields.some((field) => !isDeepStrictEqual(before[field], after[field]));
}
/** Projects run-local snapshot changes without restoring concurrently changed fields. */
function projectSessionSnapshotChanges(params) {
  if (params.current.sessionId !== params.initial.sessionId) return {};
  const initial = params.initial;
  const next = params.next;
  const current = params.current;
  const patch = {};
  const patchRecord = patch;
  const fields = /* @__PURE__ */ new Set([
    ...Object.keys(params.initial),
    ...Object.keys(params.next),
  ]);
  const modelOverrideChanged = anySessionFieldChanged(
    initial,
    next,
    SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
  );
  const modelRouteOverrideChanged = anySessionFieldChanged(
    initial,
    next,
    MODEL_ROUTE_OVERRIDE_FIELDS,
  );
  const modelOverrideChangedConcurrently = anySessionFieldChanged(
    initial,
    current,
    SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
  );
  if (modelOverrideChanged && !modelOverrideChangedConcurrently) {
    for (const field of SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS)
      patchRecord[field] = Object.hasOwn(params.next, field) ? next[field] : void 0;
    if (modelRouteOverrideChanged)
      for (const field of MODEL_OVERRIDE_RUNTIME_FIELDS)
        patchRecord[field] = Object.hasOwn(params.next, field) ? next[field] : void 0;
    for (const field of MODEL_OVERRIDE_DEPENDENT_FIELDS) {
      if (modelRouteOverrideChanged && MODEL_OVERRIDE_RUNTIME_FIELD_SET.has(field)) continue;
      if (!isDeepStrictEqual(initial[field], next[field]))
        patchRecord[field] = Object.hasOwn(params.next, field) ? next[field] : void 0;
    }
    if (params.reassertLiveModelSwitchPending) patch.liveModelSwitchPending = true;
  }
  const runtimeModelChanged =
    !isDeepStrictEqual(initial.model, next.model) ||
    !isDeepStrictEqual(initial.modelProvider, next.modelProvider);
  const runtimeModelChangedConcurrently =
    !isDeepStrictEqual(current.model, initial.model) ||
    !isDeepStrictEqual(current.modelProvider, initial.modelProvider);
  if (
    runtimeModelChanged &&
    !runtimeModelChangedConcurrently &&
    !modelOverrideChanged &&
    !modelOverrideChangedConcurrently
  ) {
    patch.model = params.next.model;
    patch.modelProvider = params.next.modelProvider;
  }
  for (const field of fields) {
    if (
      field === "model" ||
      field === "modelProvider" ||
      SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS.includes(field)
    )
      continue;
    if (isDeepStrictEqual(initial[field], next[field])) continue;
    if (field === "updatedAt") {
      patch.updatedAt = Math.max(params.current.updatedAt, params.next.updatedAt);
      continue;
    }
    if (
      (modelOverrideChanged || modelOverrideChangedConcurrently) &&
      MODEL_OVERRIDE_DEPENDENT_FIELDS.has(field)
    )
      continue;
    if (!isDeepStrictEqual(current[field], initial[field])) continue;
    patchRecord[field] = Object.hasOwn(params.next, field) ? next[field] : void 0;
  }
  return patch;
}
/** Reports whether every caller-owned snapshot delta is present in the current row. */
function sessionSnapshotChangesApplied(params) {
  if (params.current.sessionId !== params.initial.sessionId) return false;
  const initial = params.initial;
  const next = params.next;
  const current = params.current;
  const fields = /* @__PURE__ */ new Set([
    ...Object.keys(params.initial),
    ...Object.keys(params.next),
    ...(params.touchedFields ?? []),
  ]);
  fields.delete("updatedAt");
  for (const field of fields)
    if (
      (params.touchedFields?.includes(field) === true ||
        !isDeepStrictEqual(initial[field], next[field])) &&
      !isDeepStrictEqual(current[field], next[field])
    )
      return false;
  return true;
}
/** Reports an explicit grouped-write conflict before any snapshot fields are committed. */
function sessionSnapshotTouchedFieldsConflict(params) {
  if (params.current.sessionId !== params.initial.sessionId) return true;
  const initial = params.initial;
  const next = params.next;
  const current = params.current;
  const fields = new Set(params.touchedFields ?? []);
  if (SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS.some((field) => fields.has(field))) {
    for (const field of MODEL_OVERRIDE_CONFLICT_DEPENDENT_FIELDS)
      if (!isDeepStrictEqual(initial[field], next[field])) fields.add(field);
  }
  return [...fields].some(
    (field) =>
      !isDeepStrictEqual(current[field], initial[field]) &&
      !isDeepStrictEqual(current[field], next[field]),
  );
}
/** Replaces a caller-held snapshot with the latest persisted row in place. */
function adoptPersistedSessionSnapshot(target, current) {
  const targetRecord = target;
  const currentRecord = current;
  for (const field of Object.keys(target))
    if (!Object.hasOwn(current, field)) delete targetRecord[field];
  for (const field of Object.keys(current)) targetRecord[field] = currentRecord[field];
}
/** Reports whether a model/auth selection transaction is the persisted winner. */
function sessionModelOverrideChangesApplied(params) {
  if (params.current.sessionId !== params.initial.sessionId) return false;
  const next = params.next;
  const current = params.current;
  const initial = params.initial;
  const changedDependentFields = [...MODEL_OVERRIDE_DEPENDENT_FIELDS].filter(
    (field) => !isDeepStrictEqual(initial[field], next[field]),
  );
  const modelRouteOverrideChanged = anySessionFieldChanged(
    initial,
    next,
    MODEL_ROUTE_OVERRIDE_FIELDS,
  );
  if (
    [
      ...SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
      ...(modelRouteOverrideChanged ? MODEL_OVERRIDE_RUNTIME_FIELDS : []),
      ...changedDependentFields,
    ].some((field) => !isDeepStrictEqual(current[field], next[field]))
  )
    return false;
  return !params.reassertLiveModelSwitchPending || params.current.liveModelSwitchPending === true;
}
/** Merges run-local snapshot changes into the latest persisted session row. */
function mergeSessionSnapshotChanges(params) {
  const merged = { ...params.current };
  const mergedRecord = merged;
  const patch = projectSessionSnapshotChanges(params);
  for (const field of Object.keys(patch))
    if (patch[field] === void 0) delete mergedRecord[field];
    else mergedRecord[field] = patch[field];
  return merged;
}
//#endregion
export {
  sessionModelOverrideChangesApplied as a,
  projectSessionSnapshotChanges as i,
  adoptPersistedSessionSnapshot as n,
  sessionSnapshotChangesApplied as o,
  mergeSessionSnapshotChanges as r,
  sessionSnapshotTouchedFieldsConflict as s,
  SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS as t,
};
