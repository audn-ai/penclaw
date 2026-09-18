import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-C7N4Rwku.js";
import "./routing-CwvmVRHd.js";
import { c as createApprovalReactionTargetStore } from "./approval-reaction-runtime-BmaCRg-j.js";
import { n as getOptionalMatrixRuntime } from "./runtime-C3viBnoh.js";
//#region extensions/matrix/src/approval-reactions.ts
const MATRIX_APPROVAL_REACTION_META = {
  "allow-once": {
    emoji: "✅",
    label: "Allow once",
  },
  "allow-always": {
    emoji: "♾️",
    label: "Allow always",
  },
  deny: {
    emoji: "❌",
    label: "Deny",
  },
};
const MATRIX_APPROVAL_REACTION_ORDER = ["allow-once", "allow-always", "deny"];
const PERSISTENT_NAMESPACE = "matrix.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 1440 * 60 * 1e3;
function reportPersistentApprovalReactionError(error) {
  try {
    getOptionalMatrixRuntime()
      ?.logging.getChildLogger({
        plugin: "matrix",
        feature: "approval-reaction-state",
      })
      .warn("Matrix persistent approval reaction state failed", { error: String(error) });
  } catch {}
}
function readPersistedTarget(target) {
  const value = target;
  const accountId =
    typeof value?.accountId === "string" ? normalizeOptionalAccountId(value.accountId) : void 0;
  const approvalId = typeof value?.approvalId === "string" ? value.approvalId.trim() : "";
  const roomId = typeof value?.roomId === "string" ? value.roomId.trim() : "";
  const eventId = typeof value?.eventId === "string" ? value.eventId.trim() : "";
  if (
    !value ||
    !accountId ||
    !approvalId ||
    !Array.isArray(value.allowedDecisions) ||
    !roomId ||
    !eventId ||
    (value.approvalKind !== "exec" && value.approvalKind !== "plugin")
  )
    return null;
  return {
    accountId,
    approvalId,
    approvalKind: value.approvalKind,
    roomId,
    eventId,
    allowedDecisions: value.allowedDecisions,
  };
}
function openPersistentMatrixApprovalReactionStore() {
  return getOptionalMatrixRuntime()?.state.openKeyedStore({
    namespace: PERSISTENT_NAMESPACE,
    maxEntries: PERSISTENT_MAX_ENTRIES,
    defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
  });
}
const matrixApprovalReactionTargets = createApprovalReactionTargetStore({
  namespace: PERSISTENT_NAMESPACE,
  maxEntries: PERSISTENT_MAX_ENTRIES,
  defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
  openStore: openPersistentMatrixApprovalReactionStore,
  logPersistentError: reportPersistentApprovalReactionError,
  readPersistedTarget,
});
const matrixApprovalReactionTargetIndex = /* @__PURE__ */ new Map();
function pruneMatrixApprovalReactionTargetIndex() {
  const nowMs = Date.now();
  for (const [key, entry] of matrixApprovalReactionTargetIndex)
    if (entry.expiresAtMs <= nowMs) matrixApprovalReactionTargetIndex.delete(key);
  while (matrixApprovalReactionTargetIndex.size > PERSISTENT_MAX_ENTRIES) {
    const oldestKey = matrixApprovalReactionTargetIndex.keys().next().value;
    if (!oldestKey) return;
    matrixApprovalReactionTargetIndex.delete(oldestKey);
  }
}
function buildReactionTargetKey(accountId, roomId, eventId) {
  const normalizedAccountId = normalizeAccountId(accountId);
  const normalizedRoomId = roomId.trim();
  const normalizedEventId = eventId.trim();
  if (!normalizedAccountId || !normalizedRoomId || !normalizedEventId) return null;
  return JSON.stringify([normalizedAccountId, normalizedRoomId, normalizedEventId]);
}
function listMatrixApprovalReactionBindings(allowedDecisions) {
  const allowed = new Set(allowedDecisions);
  return MATRIX_APPROVAL_REACTION_ORDER.filter((decision) => allowed.has(decision)).map(
    (decision) => ({
      decision,
      emoji: MATRIX_APPROVAL_REACTION_META[decision].emoji,
      label: MATRIX_APPROVAL_REACTION_META[decision].label,
    }),
  );
}
function buildMatrixApprovalReactionHint(allowedDecisions) {
  const bindings = listMatrixApprovalReactionBindings(allowedDecisions);
  if (bindings.length === 0) return null;
  return `React here: ${bindings.map((binding) => `${binding.emoji} ${binding.label}`).join(", ")}`;
}
function resolveMatrixApprovalReactionDecision(reactionKey, allowedDecisions) {
  const normalizedReaction = reactionKey.trim();
  if (!normalizedReaction) return null;
  const allowed = new Set(allowedDecisions);
  for (const decision of MATRIX_APPROVAL_REACTION_ORDER) {
    if (!allowed.has(decision)) continue;
    if (MATRIX_APPROVAL_REACTION_META[decision].emoji === normalizedReaction) return decision;
  }
  return null;
}
function registerMatrixApprovalReactionTarget(params) {
  const accountId = normalizeAccountId(params.accountId);
  const key = buildReactionTargetKey(accountId, params.roomId, params.eventId);
  const approvalId = params.approvalId.trim();
  const allowedDecisions = Array.from(
    new Set(
      params.allowedDecisions.filter(
        (decision) =>
          decision === "allow-once" || decision === "allow-always" || decision === "deny",
      ),
    ),
  );
  if (
    !key ||
    !approvalId ||
    (params.approvalKind !== "exec" && params.approvalKind !== "plugin") ||
    allowedDecisions.length === 0
  )
    return;
  const ttlMs = Math.max(1, params.ttlMs ?? DEFAULT_REACTION_TARGET_TTL_MS);
  const target = {
    accountId,
    approvalId,
    approvalKind: params.approvalKind,
    roomId: params.roomId.trim(),
    eventId: params.eventId.trim(),
    allowedDecisions,
  };
  matrixApprovalReactionTargetIndex.delete(key);
  matrixApprovalReactionTargetIndex.set(key, {
    target,
    expiresAtMs: Date.now() + ttlMs,
  });
  pruneMatrixApprovalReactionTargetIndex();
  matrixApprovalReactionTargets.register(key, target, { ttlMs });
}
function unregisterMatrixApprovalReactionTarget(params) {
  const key = buildReactionTargetKey(params.accountId, params.roomId, params.eventId);
  if (!key) return;
  matrixApprovalReactionTargetIndex.delete(key);
  matrixApprovalReactionTargets.delete(key);
}
/** Retires every Matrix reaction anchor bound to one canonical approval. */
async function unregisterMatrixApprovalReactionTargetsForApproval(params) {
  const accountId = normalizeAccountId(params.accountId);
  const approvalId = params.approvalId.trim();
  if (!approvalId) return [];
  pruneMatrixApprovalReactionTargetIndex();
  const matches = /* @__PURE__ */ new Map();
  for (const [key, entry] of matrixApprovalReactionTargetIndex)
    if (
      entry.target.approvalId === approvalId &&
      entry.target.accountId === accountId &&
      entry.target.approvalKind === params.approvalKind
    )
      matches.set(key, entry.target);
  let persistentStore = void 0;
  try {
    persistentStore = openPersistentMatrixApprovalReactionStore();
    for (const entry of (await persistentStore?.entries()) ?? []) {
      if (entry.value.version !== 1) continue;
      const target = readPersistedTarget(entry.value.target);
      if (
        target?.approvalId === approvalId &&
        target.accountId === accountId &&
        target.approvalKind === params.approvalKind &&
        buildReactionTargetKey(target.accountId, target.roomId, target.eventId) === entry.key
      )
        matches.set(entry.key, target);
    }
  } catch (error) {
    reportPersistentApprovalReactionError(error);
  }
  const persistentDeletes = [];
  for (const [key] of matches) {
    matrixApprovalReactionTargetIndex.delete(key);
    matrixApprovalReactionTargets.delete(key);
    if (persistentStore) persistentDeletes.push(persistentStore.delete(key));
  }
  await Promise.allSettled(persistentDeletes);
  return Array.from(matches.values(), ({ accountId: ownerAccountId, roomId, eventId }) => ({
    accountId: ownerAccountId,
    roomId,
    eventId,
  }));
}
function resolveTarget(params) {
  const target = params.target;
  if (!target) return null;
  const decision = resolveMatrixApprovalReactionDecision(
    params.reactionKey,
    target.allowedDecisions,
  );
  if (!decision) return null;
  return {
    approvalId: target.approvalId,
    approvalKind: target.approvalKind,
    decision,
  };
}
async function resolveMatrixApprovalReactionTargetWithPersistence(params) {
  const accountId = normalizeAccountId(params.accountId);
  const key = buildReactionTargetKey(accountId, params.roomId, params.eventId);
  if (!key) return null;
  const target = await matrixApprovalReactionTargets.lookup(key);
  if (
    target &&
    (target.accountId !== accountId ||
      buildReactionTargetKey(target.accountId, target.roomId, target.eventId) !== key)
  )
    return null;
  if (target) {
    matrixApprovalReactionTargetIndex.delete(key);
    matrixApprovalReactionTargetIndex.set(key, {
      target,
      expiresAtMs: Date.now() + DEFAULT_REACTION_TARGET_TTL_MS,
    });
    pruneMatrixApprovalReactionTargetIndex();
  }
  return resolveTarget({
    target,
    reactionKey: params.reactionKey,
  });
}
//#endregion
export {
  unregisterMatrixApprovalReactionTarget as a,
  resolveMatrixApprovalReactionTargetWithPersistence as i,
  listMatrixApprovalReactionBindings as n,
  unregisterMatrixApprovalReactionTargetsForApproval as o,
  registerMatrixApprovalReactionTarget as r,
  buildMatrixApprovalReactionHint as t,
};
