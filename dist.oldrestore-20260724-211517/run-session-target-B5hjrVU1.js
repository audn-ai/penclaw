import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { Q as resolveSessionTranscriptRuntimeTarget } from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/run-session-target.ts
/** Resolves the active runtime target used by current run/session internals. */
async function resolveAgentRunSessionTarget(params) {
  const sessionTarget = params.sessionTarget;
  const agentId = normalizeOptionalString(sessionTarget?.agentId) ?? params.agentId;
  const sessionId = normalizeOptionalString(sessionTarget?.sessionId) ?? params.sessionId;
  const sessionKey = normalizeOptionalString(sessionTarget?.sessionKey) ?? params.sessionKey;
  const effectiveAgentId = agentId ?? resolveAgentIdFromSessionKey(sessionKey);
  if (sessionTarget && !sessionKey)
    throw new Error(`Cannot resolve run session target without a session key: ${sessionId}`);
  if (sessionTarget && sessionKey) {
    const storePath =
      normalizeOptionalString(sessionTarget.storePath) ??
      resolveStorePath(params.config?.session?.store, { agentId: effectiveAgentId });
    return await resolveSessionTranscriptRuntimeTarget({
      ...(effectiveAgentId ? { agentId: effectiveAgentId } : {}),
      sessionId,
      sessionKey,
      storePath,
      ...(sessionTarget.threadId !== void 0 ? { threadId: sessionTarget.threadId } : {}),
    });
  }
  const sessionFile = normalizeOptionalString(params.sessionFile);
  if (sessionFile)
    return {
      agentId: effectiveAgentId ?? "",
      sessionFile,
      sessionId,
      sessionKey: sessionKey ?? "",
    };
  if (!sessionKey)
    throw new Error(`Cannot resolve run session target without a session key: ${sessionId}`);
  const storePath = resolveStorePath(params.config?.session?.store, { agentId: effectiveAgentId });
  return await resolveSessionTranscriptRuntimeTarget({
    ...(effectiveAgentId ? { agentId: effectiveAgentId } : {}),
    sessionId,
    sessionKey,
    storePath,
  });
}
/** Applies identity fields from the explicit target before legacy backfills run. */
function applyAgentRunSessionTargetIdentity(params) {
  const target = params.sessionTarget;
  if (!target) return params;
  return {
    ...params,
    agentId: normalizeOptionalString(target.agentId) ?? params.agentId,
    sessionId: normalizeOptionalString(target.sessionId) ?? params.sessionId,
    sessionKey: normalizeOptionalString(target.sessionKey) ?? params.sessionKey,
  };
}
//#endregion
export { resolveAgentRunSessionTarget as n, applyAgentRunSessionTargetIdentity as t };
