import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/sessions/session-chat-type-shared.ts
const CANONICAL_PEER_KINDS = /* @__PURE__ */ new Set(["direct", "dm", "group", "channel"]);
function isCanonicalPeerKind(value) {
  return CANONICAL_PEER_KINDS.has(value ?? "");
}
function hasAmbiguousCanonicalSessionPeerShape(scopedSessionKey) {
  const parts = scopedSessionKey.split(":");
  if (parts[0] === "agent") return false;
  return (
    [
      Boolean((parts[0] === "direct" || parts[0] === "dm") && parts[1]),
      Boolean(parts[0] && isCanonicalPeerKind(parts[1]) && parts[2]),
      Boolean(parts[0] && parts[1] && isCanonicalPeerKind(parts[2]) && parts[3]),
      deriveBuiltInLegacySessionChatType(scopedSessionKey) !== void 0,
    ].filter(Boolean).length > 1
  );
}
function parseCanonicalSessionPeerShape(scopedSessionKey) {
  const parts = scopedSessionKey.split(":");
  if (parts[0] === "agent" || hasAmbiguousCanonicalSessionPeerShape(scopedSessionKey)) return;
  let channel;
  let peerKind;
  let peerIdStart = 0;
  if (parts[0] === "direct" || parts[0] === "dm") {
    peerKind = parts[0];
    peerIdStart = 1;
  } else if (parts[0] && isCanonicalPeerKind(parts[1])) {
    channel = parts[0];
    peerKind = parts[1];
    peerIdStart = 2;
  } else if (parts[0] && parts[1] && isCanonicalPeerKind(parts[2])) {
    channel = parts[0];
    peerKind = parts[2];
    peerIdStart = 3;
  }
  if (!peerKind || !parts[peerIdStart]) return;
  const chatType = peerKind === "direct" || peerKind === "dm" ? "direct" : peerKind;
  return {
    ...(channel ? { channel } : {}),
    chatType,
  };
}
function deriveCanonicalSessionChatType(scopedSessionKey) {
  return parseCanonicalSessionPeerShape(scopedSessionKey)?.chatType;
}
function deriveBuiltInLegacySessionChatType(scopedSessionKey) {
  if (/^group:[^:]+(?::.*)?$/u.test(scopedSessionKey)) return "group";
  if (/^channel:[^:]+(?::.*)?$/u.test(scopedSessionKey)) return "channel";
  if (/^(?:whatsapp:)?[^:]+@g\.us$/.test(scopedSessionKey)) return "group";
  if (/^discord:(?:[^:]+:)?guild-[^:]+:channel-[^:]+$/.test(scopedSessionKey)) return "channel";
}
function deriveSessionChatTypeFromScopedKey(scopedSessionKey, deriveLegacySessionChatTypes = []) {
  const canonical = deriveCanonicalSessionChatType(scopedSessionKey);
  if (canonical) return canonical;
  const builtInLegacy = deriveBuiltInLegacySessionChatType(scopedSessionKey);
  if (builtInLegacy) return builtInLegacy;
  for (const deriveLegacySessionChatType of deriveLegacySessionChatTypes) {
    const derived = deriveLegacySessionChatType(scopedSessionKey);
    if (derived) return derived;
  }
  return "unknown";
}
/**
 * Best-effort chat-type extraction from session keys across canonical and legacy formats.
 */
function deriveSessionChatTypeFromKey(sessionKey, deriveLegacySessionChatTypes = []) {
  const raw = normalizeLowercaseStringOrEmpty(sessionKey);
  if (!raw) return "unknown";
  return deriveSessionChatTypeFromScopedKey(
    parseAgentSessionKey(raw)?.rest ?? raw,
    deriveLegacySessionChatTypes,
  );
}
//#endregion
export {
  hasAmbiguousCanonicalSessionPeerShape as n,
  parseCanonicalSessionPeerShape as r,
  deriveSessionChatTypeFromKey as t,
};
