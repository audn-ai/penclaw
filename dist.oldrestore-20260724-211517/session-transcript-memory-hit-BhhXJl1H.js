import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/plugin-sdk/session-transcript-memory-hit.ts
const SESSION_TRANSCRIPT_MEMORY_HIT_PREFIX = "transcript";
function requireMemoryKeySegment(value, label) {
  const normalized = normalizeOptionalString(value);
  if (!normalized)
    throw new Error(`Cannot build session transcript memory hit key without ${label}.`);
  return encodeURIComponent(normalized);
}
function decodeMemoryKeySegment(value) {
  try {
    return normalizeOptionalString(decodeURIComponent(value)) ?? null;
  } catch {
    return null;
  }
}
function syntheticSessionKey(identity) {
  return `agent:${identity.agentId}:${identity.sessionId}`;
}
/**
 * Builds the memory hit key for one session transcript.
 */
function formatSessionTranscriptMemoryHitKey(params) {
  const agentId = requireMemoryKeySegment(normalizeAgentId(params.agentId), "agentId");
  const sessionId = requireMemoryKeySegment(params.sessionId, "sessionId");
  return `${SESSION_TRANSCRIPT_MEMORY_HIT_PREFIX}:${agentId}:${sessionId}`;
}
/**
 * Parses a session transcript memory hit key.
 */
function parseSessionTranscriptMemoryHitKey(key) {
  const parts = key.split(":");
  if (parts.length !== 3 || parts[0] !== SESSION_TRANSCRIPT_MEMORY_HIT_PREFIX) return null;
  const agentId = decodeMemoryKeySegment(parts[1] ?? "");
  const sessionId = decodeMemoryKeySegment(parts[2] ?? "");
  if (!agentId || !sessionId) return null;
  return {
    agentId: normalizeAgentId(agentId),
    key: formatSessionTranscriptMemoryHitKey({
      agentId,
      sessionId,
    }),
    sessionId,
  };
}
/**
 * Maps a session transcript memory hit key back to visible session store keys.
 */
function resolveSessionTranscriptMemoryHitKeyToSessionKeys(params) {
  const identity = parseSessionTranscriptMemoryHitKey(params.key);
  if (!identity) return [];
  const deduped = uniqueStrings(
    Object.entries(params.store)
      .filter(([sessionKey, entry]) => {
        return (
          entry.sessionId === identity.sessionId &&
          normalizeAgentId(resolveAgentIdFromSessionKey(sessionKey)) === identity.agentId
        );
      })
      .map(([sessionKey]) => sessionKey),
  );
  if (deduped.length > 0) return deduped;
  return params.includeSyntheticFallback === false ? [] : [syntheticSessionKey(identity)];
}
//#endregion
export {
  parseSessionTranscriptMemoryHitKey as n,
  resolveSessionTranscriptMemoryHitKeyToSessionKeys as r,
  formatSessionTranscriptMemoryHitKey as t,
};
