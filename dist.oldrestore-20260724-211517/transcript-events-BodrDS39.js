import { l as asPositiveSafeInteger } from "./number-coercion-CJQ8TR--.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/sessions/transcript-events.ts
const SESSION_TRANSCRIPT_LISTENERS = /* @__PURE__ */ new Set();
const INTERNAL_SESSION_TRANSCRIPT_LISTENERS = /* @__PURE__ */ new Set();
/** Registers a listener for normalized session transcript updates. */
function onSessionTranscriptUpdate(listener) {
  SESSION_TRANSCRIPT_LISTENERS.add(listener);
  return () => {
    SESSION_TRANSCRIPT_LISTENERS.delete(listener);
  };
}
/** Registers an internal listener for identity-only or file-backed transcript updates. */
function onInternalSessionTranscriptUpdate(listener) {
  INTERNAL_SESSION_TRANSCRIPT_LISTENERS.add(listener);
  return () => {
    INTERNAL_SESSION_TRANSCRIPT_LISTENERS.delete(listener);
  };
}
/** Emits a normalized transcript update to all registered listeners. */
function emitSessionTranscriptUpdate(update) {
  const nextUpdate = normalizeSessionTranscriptUpdate(update, { allowIdentityOnly: true });
  if (!nextUpdate) return;
  const publicUpdate = projectPublicSessionTranscriptUpdate(nextUpdate);
  if (publicUpdate) emitPublicSessionTranscriptUpdate(publicUpdate);
  emitInternalTranscriptUpdate(nextUpdate);
}
function normalizeSessionTranscriptUpdate(update, options) {
  const normalized = {
    sessionFile: update.sessionFile,
    target: update.target,
    sessionKey: update.sessionKey,
    agentId: update.agentId,
    sessionId: update.sessionId,
    message: update.message,
    messageId: update.messageId,
    messageSeq: update.messageSeq,
  };
  const trimmed = normalizeOptionalString(normalized.sessionFile);
  const target = normalizeUpdateTarget(normalized);
  if (!trimmed && (!options.allowIdentityOnly || !target)) return;
  const messageSeq = asPositiveSafeInteger(normalized.messageSeq);
  const sessionKey = normalizeOptionalString(normalized.sessionKey) ?? target?.sessionKey;
  const agentId = normalizeOptionalString(normalized.agentId) ?? target?.agentId;
  const sessionId = normalizeOptionalString(normalized.sessionId) ?? target?.sessionId;
  return {
    ...(trimmed ? { sessionFile: trimmed } : {}),
    ...(target ? { target } : {}),
    ...(sessionKey ? { sessionKey } : {}),
    ...(agentId ? { agentId } : {}),
    ...(sessionId ? { sessionId } : {}),
    ...(normalized.message !== void 0 ? { message: normalized.message } : {}),
    ...(normalizeOptionalString(normalized.messageId)
      ? { messageId: normalizeOptionalString(normalized.messageId) }
      : {}),
    ...(messageSeq !== void 0 ? { messageSeq } : {}),
  };
}
function emitPublicSessionTranscriptUpdate(nextUpdate) {
  for (const listener of SESSION_TRANSCRIPT_LISTENERS)
    try {
      listener(nextUpdate);
    } catch {}
}
function emitInternalTranscriptUpdate(nextUpdate) {
  for (const listener of INTERNAL_SESSION_TRANSCRIPT_LISTENERS)
    try {
      listener(nextUpdate);
    } catch {}
}
function projectPublicSessionTranscriptUpdate(update) {
  const target = update.target;
  if (!target) return;
  return {
    target,
    ...(update.sessionKey ? { sessionKey: update.sessionKey } : {}),
    ...(update.agentId ? { agentId: update.agentId } : {}),
    ...(update.sessionId ? { sessionId: update.sessionId } : {}),
    ...(update.message !== void 0 ? { message: update.message } : {}),
    ...(update.messageId ? { messageId: update.messageId } : {}),
    ...(update.messageSeq !== void 0 ? { messageSeq: update.messageSeq } : {}),
  };
}
function normalizeUpdateTarget(update) {
  const sessionKey =
    normalizeOptionalString(update.target?.sessionKey) ??
    normalizeOptionalString(update.sessionKey);
  const agentId =
    normalizeOptionalString(update.target?.agentId) ??
    normalizeOptionalString(update.agentId) ??
    (sessionKey ? parseAgentSessionKey(sessionKey)?.agentId : void 0);
  const sessionId =
    normalizeOptionalString(update.target?.sessionId) ?? normalizeOptionalString(update.sessionId);
  if (!agentId || !sessionId || !sessionKey) return;
  return {
    agentId,
    sessionId,
    sessionKey,
  };
}
//#endregion
export {
  onInternalSessionTranscriptUpdate as n,
  onSessionTranscriptUpdate as r,
  emitSessionTranscriptUpdate as t,
};
