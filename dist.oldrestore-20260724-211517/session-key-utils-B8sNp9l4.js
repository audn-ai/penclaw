import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/sessions/session-key-utils.ts
const CASE_PRESERVING_PEERS = [
  {
    channel: "signal",
    peerKinds: /* @__PURE__ */ new Set(["group"]),
    span: "segment",
    unscoped: true,
  },
  {
    channel: "matrix",
    peerKinds: /* @__PURE__ */ new Set(["channel", "group"]),
    span: "tail",
    unscoped: true,
  },
];
/** True when (channel, peerKind) owns a case-sensitive opaque peer ID. */
function isCasePreservingPeer(channel, peerKind) {
  return (
    findCasePreservingPeerDescriptor(
      normalizeLowercaseStringOrEmpty(channel),
      normalizeLowercaseStringOrEmpty(peerKind),
    ) !== void 0
  );
}
function findCasePreservingPeerDescriptor(channel, peerKind) {
  const c = normalizeLowercaseStringOrEmpty(channel);
  const k = normalizeLowercaseStringOrEmpty(peerKind);
  return CASE_PRESERVING_PEERS.find((d) => d.channel === c && d.peerKinds.has(k));
}
function requiresFoldedSessionKeyAliasProof(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw) return false;
  const parts = raw.split(":");
  let bodyStartIndex = 0;
  let hasAgentWrapper = false;
  while (
    parts.length - bodyStartIndex >= 3 &&
    normalizeOptionalLowercaseString(parts[bodyStartIndex]) === "agent"
  ) {
    hasAgentWrapper = true;
    bodyStartIndex += 2;
  }
  if (hasAgentWrapper)
    while (bodyStartIndex < parts.length && !normalizeOptionalString(parts[bodyStartIndex]))
      bodyStartIndex += 1;
  return (
    findCasePreservingPeerDescriptor(parts[bodyStartIndex], parts[bodyStartIndex + 1])?.span ===
    "tail"
  );
}
function normalizeSessionPeerId(params) {
  const peerId = (params.peerId ?? "").trim();
  if (!peerId) return "";
  return isCasePreservingPeer(params.channel, params.peerKind)
    ? peerId
    : normalizeLowercaseStringOrEmpty(peerId);
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const NORMALIZED_SESSION_KEY_CACHE_MAX_ENTRIES = 2048;
const NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH = 4096;
const normalizedSessionKeyCache = /* @__PURE__ */ new Map();
function readNormalizedSessionKeyCache(raw) {
  return raw.length <= NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH
    ? normalizedSessionKeyCache.get(raw)
    : void 0;
}
function writeNormalizedSessionKeyCache(raw, normalized) {
  if (raw.length > NORMALIZED_SESSION_KEY_CACHE_MAX_LENGTH) return;
  normalizedSessionKeyCache.set(raw, normalized);
  while (normalizedSessionKeyCache.size > NORMALIZED_SESSION_KEY_CACHE_MAX_ENTRIES) {
    const oldest = normalizedSessionKeyCache.keys().next().value;
    if (oldest === void 0) return;
    normalizedSessionKeyCache.delete(oldest);
  }
}
function mayContainCasePreservingPeer(raw) {
  const folded = raw.toLowerCase();
  return CASE_PRESERVING_PEERS.some((descriptor) => folded.includes(`${descriptor.channel}:`));
}
/**
 * Collect [start,end) index ranges in `raw` whose case must be preserved, per the
 * CASE_PRESERVING_PEERS registry. Spans may come from multiple descriptors; the
 * caller lowercases everything OUTSIDE their union — collect-then-emit, never
 * sequential transforms that could re-lowercase an already-preserved span.
 */
function collectCasePreservedSpans(raw) {
  const spans = [];
  for (const descriptor of CASE_PRESERVING_PEERS) {
    const channel = escapeRegExp(descriptor.channel);
    for (const peerKind of descriptor.peerKinds) {
      const kind = escapeRegExp(peerKind);
      if (descriptor.span === "segment") {
        const re = new RegExp(`(^|:)${channel}:${kind}:([^:]+)`, "gi");
        for (const match of raw.matchAll(re)) {
          const matched = match[0] ?? "";
          const segment = match[2] ?? "";
          const segStart = (match.index ?? 0) + matched.length - segment.length;
          spans.push({
            start: segStart,
            end: segStart + segment.length,
            trim: true,
          });
        }
      } else {
        const collectTailSpan = (tailStart) => {
          if (tailStart >= raw.length) return;
          const markerIndex = normalizeLowercaseStringOrEmpty(raw.slice(tailStart)).lastIndexOf(
            ":thread:",
          );
          if (markerIndex === -1) {
            spans.push({
              start: tailStart,
              end: raw.length,
              trim: false,
            });
            return;
          }
          spans.push({
            start: tailStart,
            end: tailStart + markerIndex,
            trim: false,
          });
          const threadIdStart = tailStart + markerIndex + 8;
          if (threadIdStart < raw.length)
            spans.push({
              start: threadIdStart,
              end: raw.length,
              trim: false,
            });
        };
        const scopedMatch = new RegExp(`^(?:agent:[^:]*:)+:*${channel}:${kind}:`, "i").exec(raw);
        if (scopedMatch) {
          collectTailSpan(scopedMatch[0].length);
          continue;
        }
        if (descriptor.unscoped) {
          const unscopedMatch = new RegExp(`^${channel}:${kind}:`, "i").exec(raw);
          if (unscopedMatch) collectTailSpan(unscopedMatch[0].length);
        }
      }
    }
  }
  return spans;
}
function normalizeSessionKeyPreservingOpaquePeerIds(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw) return "";
  const cached = readNormalizedSessionKeyCache(raw);
  if (cached !== void 0) return cached;
  if (!mayContainCasePreservingPeer(raw)) {
    const normalized = raw.toLowerCase();
    writeNormalizedSessionKeyCache(raw, normalized);
    return normalized;
  }
  const spans = collectCasePreservedSpans(raw)
    .filter((span) => span.end > span.start)
    .toSorted((a, b) => a.start - b.start);
  let normalized = "";
  let cursor = 0;
  for (const span of spans) {
    if (span.start < cursor) continue;
    normalized += normalizeLowercaseStringOrEmpty(raw.slice(cursor, span.start));
    const preserved = raw.slice(span.start, span.end);
    normalized += span.trim ? preserved.trim() : preserved;
    cursor = span.end;
  }
  normalized += normalizeLowercaseStringOrEmpty(raw.slice(cursor));
  writeNormalizedSessionKeyCache(raw, normalized);
  return normalized;
}
/**
 * Parse agent-scoped session keys in a canonical, case-insensitive way.
 * Returned values are canonicalized for stable comparisons/routing while
 * preserving provider-owned opaque peer IDs.
 */
function parseAgentSessionKey(sessionKey) {
  const raw = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
  if (!raw) return null;
  const parts = raw.split(":");
  if (parts.length < 3 || !parts[1] || !parts[2]) return null;
  if (parts[0] !== "agent") return null;
  const agentId = normalizeOptionalString(parts[1]);
  const rest = parts.slice(2).join(":");
  if (!agentId || !rest) return null;
  return {
    agentId,
    rest,
  };
}
function isCronRunSessionKey(sessionKey) {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) return false;
  return /^cron:[^:]+:run:[^:]+(?::|$)/.test(parsed.rest);
}
/**
 * Splits the terminal per-run `:run:<id>` scope off an isolated cron session key
 * (`agent:<id>:cron:<job>:run:<runId>`), yielding the cache-stable base key.
 * The run scope is only ever appended to cron keys, so this is gated to that exact
 * shape: any other key (including channel ids that embed a `:run:` segment) is returned
 * unchanged with `runId` undefined, never truncating an unrelated session identity.
 */
function parseCronRunScopeSuffix(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw)
    return {
      baseSessionKey: void 0,
      runId: void 0,
    };
  const parsed = parseAgentSessionKey(raw);
  if (!parsed || !/^cron:[^:]+:run:[^:]+$/.test(parsed.rest))
    return {
      baseSessionKey: raw,
      runId: void 0,
    };
  const markerIndex = raw.toLowerCase().lastIndexOf(":run:");
  return {
    baseSessionKey: raw.slice(0, markerIndex),
    runId: raw.slice(markerIndex + 5),
  };
}
function isCronSessionKey(sessionKey) {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) return false;
  return normalizeOptionalLowercaseString(parsed.rest)?.startsWith("cron:") === true;
}
function isSubagentSessionKey(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw) return false;
  if (normalizeOptionalLowercaseString(raw)?.startsWith("subagent:")) return true;
  return (
    normalizeOptionalLowercaseString(parseAgentSessionKey(raw)?.rest)?.startsWith("subagent:") ===
    true
  );
}
function getSubagentDepth(sessionKey) {
  const raw = normalizeOptionalLowercaseString(sessionKey);
  if (!raw) return 0;
  return (
    (parseAgentSessionKey(raw)?.rest ?? raw).toLowerCase().match(/(^|:)subagent:/g)?.length ?? 0
  );
}
function isAcpSessionKey(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw) return false;
  if (normalizeLowercaseStringOrEmpty(raw).startsWith("acp:")) return true;
  return (
    normalizeOptionalLowercaseString(parseAgentSessionKey(raw)?.rest)?.startsWith("acp:") === true
  );
}
function parseThreadSessionSuffix(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw)
    return {
      baseSessionKey: void 0,
      threadId: void 0,
    };
  const markerIndex = normalizeLowercaseStringOrEmpty(raw).lastIndexOf(":thread:");
  return {
    baseSessionKey: markerIndex === -1 ? raw : raw.slice(0, markerIndex),
    threadId: normalizeOptionalString(markerIndex === -1 ? void 0 : raw.slice(markerIndex + 8)),
  };
}
const SESSION_DELIVERY_PEER_KINDS = /* @__PURE__ */ new Set(["channel", "direct", "dm", "group"]);
/** Parse only complete external delivery shapes; nested ownership stays opaque. */
function parseSessionDeliveryRoute(sessionKey) {
  const parsedThread = parseThreadSessionSuffix(sessionKey);
  const parsed = parseAgentSessionKey(parsedThread.baseSessionKey ?? sessionKey);
  if (!parsed) return null;
  const parts = parsed.rest.split(":");
  if (parts[0] === "agent" || parts.length < 3) return null;
  const channel = normalizeOptionalLowercaseString(parts[0]);
  if (!channel) return null;
  if (parts.length >= 4 && (parts[2] === "direct" || parts[2] === "dm")) {
    const accountId = normalizeOptionalString(parts[1]);
    const firstPeerIdSegment = normalizeOptionalString(parts[3]);
    const peerId = normalizeOptionalString(parts.slice(3).join(":"));
    if (!accountId || !firstPeerIdSegment || !peerId) return null;
    return {
      accountId,
      channel,
      peerId,
      peerKind: parts[2],
      threadId: parsedThread.threadId,
    };
  }
  const peerKind = parts[1];
  const firstPeerIdSegment = normalizeOptionalString(parts[2]);
  const peerId = normalizeOptionalString(parts.slice(2).join(":"));
  if (!peerKind || !SESSION_DELIVERY_PEER_KINDS.has(peerKind) || !firstPeerIdSegment || !peerId)
    return null;
  return {
    channel,
    peerId,
    peerKind,
    threadId: parsedThread.threadId,
  };
}
function parseRawSessionConversationRef(sessionKey) {
  const raw = normalizeOptionalString(sessionKey);
  if (!raw) return null;
  const rawParts = raw.split(":");
  const hasAgentWrapper = normalizeOptionalLowercaseString(rawParts[0]) === "agent";
  if (hasAgentWrapper && (!normalizeOptionalString(rawParts[1]) || rawParts.length < 3))
    return null;
  const bodyStartIndex = hasAgentWrapper ? 2 : 0;
  const parts = rawParts.slice(bodyStartIndex);
  if (normalizeOptionalLowercaseString(parts[0]) === "agent") return null;
  if (parts.length < 3 || !normalizeOptionalString(parts[2])) return null;
  const channel = normalizeOptionalLowercaseString(parts[0]);
  const kind = normalizeOptionalLowercaseString(parts[1]);
  if (!channel || (kind !== "group" && kind !== "channel")) return null;
  const rawId = normalizeOptionalString(parts.slice(2).join(":"));
  const prefix = normalizeOptionalString(rawParts.slice(0, bodyStartIndex + 2).join(":"));
  if (!rawId || !prefix) return null;
  return {
    channel,
    kind,
    rawId,
    prefix,
  };
}
//#endregion
export {
  isSubagentSessionKey as a,
  parseAgentSessionKey as c,
  parseSessionDeliveryRoute as d,
  parseThreadSessionSuffix as f,
  isCronSessionKey as i,
  parseCronRunScopeSuffix as l,
  isAcpSessionKey as n,
  normalizeSessionKeyPreservingOpaquePeerIds as o,
  requiresFoldedSessionKeyAliasProof as p,
  isCronRunSessionKey as r,
  normalizeSessionPeerId as s,
  getSubagentDepth as t,
  parseRawSessionConversationRef as u,
};
