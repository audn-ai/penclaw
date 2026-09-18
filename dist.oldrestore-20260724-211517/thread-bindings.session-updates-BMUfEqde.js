import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import "./routing-CwvmVRHd.js";
import {
  A as shouldPersistBindingMutations,
  D as saveBindingsToDisk,
  O as setBindingRecord,
  c as ensureBindingsLoaded,
  t as BINDINGS_BY_THREAD_ID,
  x as resolveBindingIdsForSession,
} from "./thread-bindings.state-Da_kQ-2B.js";
//#region extensions/discord/src/monitor/thread-bindings.session-shared.ts
function normalizeNonNegativeMs(raw) {
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.floor(raw));
}
function resolveBindingIdsForTargetSession(params) {
  ensureBindingsLoaded();
  const targetSessionKey = params.targetSessionKey.trim();
  if (!targetSessionKey) return [];
  return resolveBindingIdsForSession({
    targetSessionKey,
    accountId: params.accountId ? normalizeAccountId(params.accountId) : void 0,
    targetKind: params.targetKind,
  });
}
function updateBindingsForTargetSession(ids, update) {
  if (ids.length === 0) return [];
  const now = Date.now();
  const updated = [];
  for (const bindingKey of ids) {
    const existing = BINDINGS_BY_THREAD_ID.get(bindingKey);
    if (!existing) continue;
    const nextRecord = update(existing, now);
    setBindingRecord(nextRecord);
    updated.push(nextRecord);
  }
  if (updated.length > 0 && shouldPersistBindingMutations()) saveBindingsToDisk({ force: true });
  return updated;
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-updates.ts
function setThreadBindingIdleTimeoutBySessionKey(params) {
  const ids = resolveBindingIdsForTargetSession(params);
  const idleTimeoutMs = normalizeNonNegativeMs(params.idleTimeoutMs);
  return updateBindingsForTargetSession(ids, (existing, now) => ({
    ...existing,
    idleTimeoutMs,
    lastActivityAt: now,
  }));
}
function setThreadBindingMaxAgeBySessionKey(params) {
  const ids = resolveBindingIdsForTargetSession(params);
  const maxAgeMs = normalizeNonNegativeMs(params.maxAgeMs);
  return updateBindingsForTargetSession(ids, (existing, now) => ({
    ...existing,
    maxAgeMs,
    boundAt: now,
    lastActivityAt: now,
  }));
}
//#endregion
export {
  setThreadBindingMaxAgeBySessionKey as n,
  resolveBindingIdsForTargetSession as r,
  setThreadBindingIdleTimeoutBySessionKey as t,
};
