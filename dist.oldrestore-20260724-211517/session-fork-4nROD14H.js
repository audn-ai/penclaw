import {
  a as isModelSelectionLocked,
  r as ModelSelectionLockedError,
} from "./model-overrides-BlzAR7Nc.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  Y as resolveSessionParentForkDecision,
  _ as forkSessionEntryFromParentTarget,
  v as forkSessionFromParentTranscript,
} from "./session-accessor-PZVNxFCV.js";
//#region src/auto-reply/reply/session-fork.ts
const MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE =
  "Model-selection-locked sessions cannot create child sessions from parent context.";
function assertParentSessionForkAllowed(parentEntry) {
  if (isModelSelectionLocked(parentEntry))
    throw new ModelSelectionLockedError(MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
}
function resolveParentForkStorePath(params) {
  return (
    params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId: params.agentId })
  );
}
async function resolveParentForkDecision(params) {
  assertParentSessionForkAllowed(params.parentEntry);
  return await resolveSessionParentForkDecision({
    parentEntry: params.parentEntry,
    storePath: resolveParentForkStorePath(params),
  });
}
async function forkSessionFromParent(params) {
  assertParentSessionForkAllowed(params.parentEntry);
  const storePath = resolveParentForkStorePath(params);
  const fork = await forkSessionFromParentTranscript({
    agentId: params.agentId,
    parentEntry: params.parentEntry,
    parentSessionKey: params.parentSessionKey,
    sessionKey: params.sessionKey,
    storePath,
    ...(params.targetStorePath ? { targetStorePath: params.targetStorePath } : {}),
  });
  return fork.status === "created" ? fork.transcript : null;
}
function normalizeForkTarget(params) {
  const keys = /* @__PURE__ */ new Set();
  const remember = (value) => {
    const trimmed = value.trim();
    if (trimmed) keys.add(trimmed);
  };
  remember(params.canonicalKey);
  for (const key of params.storeKeys ?? []) remember(key);
  return {
    canonicalKey: params.canonicalKey,
    storeKeys: [...keys],
  };
}
/**
 * Forks the parent transcript and persists the child session entry through one
 * storage boundary operation.
 */
async function forkSessionEntryFromParent(params) {
  const storePath = resolveParentForkStorePath(params);
  return await forkSessionEntryFromParentTarget({
    agentId: params.agentId,
    decisionSkipPatch: params.decisionSkipPatch,
    fallbackEntry: params.fallbackEntry,
    parentTarget: normalizeForkTarget({
      canonicalKey: params.parentSessionKey,
      storeKeys: params.parentStoreKeys,
    }),
    patch: params.patch,
    sessionTarget: normalizeForkTarget({
      canonicalKey: params.sessionKey,
      storeKeys: params.sessionStoreKeys,
    }),
    skipForkWhen: params.skipForkWhen,
    skipPatch: params.skipPatch,
    storePath,
  });
}
//#endregion
export {
  resolveParentForkDecision as i,
  forkSessionEntryFromParent as n,
  forkSessionFromParent as r,
  MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE as t,
};
