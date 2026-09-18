import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/chat-queued-turns.ts
/**
 * Gateway-owned cancel identity for turns that have been admitted to the
 * followup/collect queue but are not yet (or no longer) active chat-send runs.
 *
 * Active runs stay in chatAbortControllers. Queued waits must NOT look like
 * active runs (projection, timeout ownership, terminal dedupe), but they must
 * remain abortable by authorized requesters after chat.send terminalizes.
 */
function resolveExactRunId(runId) {
  return runId.length > 0 ? runId : void 0;
}
function deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry) {
  if (chatQueuedTurns.get(runId) !== entry) return false;
  return chatQueuedTurns.delete(runId);
}
function registerQueuedChatTurn(params) {
  const runId = resolveExactRunId(params.runId);
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!runId || !sessionKey) return false;
  if (params.controller.signal.aborted) return false;
  const existing = params.chatQueuedTurns.get(runId);
  if (existing && existing.controller === params.controller) return true;
  if (existing) return false;
  const entry = {
    controller: params.controller,
    sessionId: params.sessionId,
    sessionKey,
    agentId: normalizeOptionalString(params.agentId)?.toLowerCase(),
    ownerConnId: normalizeOptionalString(params.ownerConnId),
    ownerDeviceId: normalizeOptionalString(params.ownerDeviceId),
  };
  params.chatQueuedTurns.set(runId, entry);
  params.controller.signal.addEventListener(
    "abort",
    () => {
      if (entry.abortable !== false)
        deleteQueuedChatTurnEntry(params.chatQueuedTurns, runId, entry);
    },
    { once: true },
  );
  return true;
}
function completeQueuedChatTurn(chatQueuedTurns, runId, controller) {
  const key = resolveExactRunId(runId);
  if (!key) return false;
  const entry = chatQueuedTurns.get(key);
  return entry?.controller === controller
    ? deleteQueuedChatTurnEntry(chatQueuedTurns, key, entry)
    : false;
}
/**
 * Retain the live run identity for idempotency while transferring cancellation
 * to a collect aggregate. Completion still removes the entry.
 */
function retireQueuedChatTurnCancellation(chatQueuedTurns, runId, controller) {
  const entry = getQueuedChatTurn(chatQueuedTurns, runId);
  if (!entry || entry.controller !== controller) return false;
  entry.abortable = false;
  return true;
}
function getQueuedChatTurn(chatQueuedTurns, runId) {
  const key = resolveExactRunId(runId);
  if (!key) return;
  return chatQueuedTurns.get(key);
}
/**
 * Abort a single queued turn by runId. Does not authorize; caller must check.
 * Returns false when missing or already aborted/removed.
 */
function abortQueuedChatTurnById(chatQueuedTurns, params) {
  const runId = resolveExactRunId(params.runId);
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!runId || !sessionKey) return { aborted: false };
  const entry = chatQueuedTurns.get(runId);
  if (!entry || entry.abortable === false) return { aborted: false };
  if (!params.allowSessionMismatch && entry.sessionKey !== sessionKey) return { aborted: false };
  if (!entry.controller.signal.aborted)
    entry.controller.abort(
      params.stopReason
        ? /* @__PURE__ */ new Error(`queued turn aborted: ${params.stopReason}`)
        : void 0,
    );
  deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry);
  return { aborted: true };
}
/**
 * List queued turns matching session keys / session ids / optional agent scope.
 * Authorization is left to the caller.
 */
function listQueuedChatTurnsForSession(params) {
  const sessionKeys = new Set(
    Array.from(params.sessionKeys, (k) => normalizeOptionalString(k)).filter((k) => Boolean(k)),
  );
  const sessionIds = new Set(
    Array.from(params.sessionIds ?? [], (id) => normalizeOptionalString(id)).filter((id) =>
      Boolean(id),
    ),
  );
  const agentId = normalizeOptionalString(params.agentId)?.toLowerCase();
  const defaultAgentId = normalizeOptionalString(params.defaultAgentId)?.toLowerCase();
  const matches = [];
  for (const [runId, entry] of params.chatQueuedTurns) {
    if (entry.abortable === false) continue;
    if (!sessionKeys.has(entry.sessionKey) && !sessionIds.has(entry.sessionId)) continue;
    if (agentId && entry.sessionKey === "global") {
      if ((entry.agentId ?? defaultAgentId)?.toLowerCase() !== agentId) continue;
    }
    matches.push({
      runId,
      entry,
    });
  }
  return matches;
}
/**
 * Abort all provided queued turns (already authorized by caller).
 * Order: abort signals first, then remove from map, so drain cannot promote mid-loop.
 */
function abortQueuedChatTurns(chatQueuedTurns, matches, stopReason) {
  const runIds = [];
  for (const { runId, entry } of matches) {
    if (chatQueuedTurns.get(runId) !== entry) continue;
    if (!entry.controller.signal.aborted)
      entry.controller.abort(
        stopReason ? /* @__PURE__ */ new Error(`queued turn aborted: ${stopReason}`) : void 0,
      );
    deleteQueuedChatTurnEntry(chatQueuedTurns, runId, entry);
    runIds.push(runId);
  }
  return runIds;
}
//#endregion
export {
  registerQueuedChatTurn as a,
  listQueuedChatTurnsForSession as i,
  abortQueuedChatTurns as n,
  retireQueuedChatTurnCancellation as o,
  completeQueuedChatTurn as r,
  abortQueuedChatTurnById as t,
};
