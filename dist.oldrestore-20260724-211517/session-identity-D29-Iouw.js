import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region packages/acp-core/src/runtime/session-identity.ts
/** Normalize a stored identity state value from metadata. */
function normalizeIdentityState(value) {
  if (value !== "pending" && value !== "resolved") return;
  return value;
}
/** Normalize where an ACP identity observation came from. */
function normalizeIdentitySource(value) {
  if (value !== "ensure" && value !== "status" && value !== "event") return;
  return value;
}
/** Normalize an identity object and infer pending/resolved state from stable ids. */
function normalizeIdentity(identity) {
  if (!identity) return;
  const state = normalizeIdentityState(identity.state);
  const source = normalizeIdentitySource(identity.source);
  const acpxRecordId = normalizeOptionalString(identity.acpxRecordId);
  const acpxSessionId = normalizeOptionalString(identity.acpxSessionId);
  const agentSessionId = normalizeOptionalString(identity.agentSessionId);
  const lastUpdatedAt =
    typeof identity.lastUpdatedAt === "number" && Number.isFinite(identity.lastUpdatedAt)
      ? identity.lastUpdatedAt
      : void 0;
  if (
    !state &&
    !source &&
    !Boolean(acpxRecordId || acpxSessionId || agentSessionId) &&
    lastUpdatedAt === void 0
  )
    return;
  return {
    state: state ?? (Boolean(acpxSessionId || agentSessionId) ? "resolved" : "pending"),
    ...(acpxRecordId ? { acpxRecordId } : {}),
    ...(acpxSessionId ? { acpxSessionId } : {}),
    ...(agentSessionId ? { agentSessionId } : {}),
    source: source ?? "status",
    lastUpdatedAt: lastUpdatedAt ?? Date.now(),
  };
}
/** Read identity ids from a runtime handle shape. */
function readIdentityIdsFromHandle(handle) {
  return {
    acpxRecordId: normalizeOptionalString(handle.acpxRecordId),
    acpxSessionId: normalizeOptionalString(handle.backendSessionId),
    agentSessionId: normalizeOptionalString(handle.agentSessionId),
  };
}
/** Build an identity only when at least one stable id is known. */
function buildSessionIdentity(params) {
  const { acpxRecordId, acpxSessionId, agentSessionId } = params.ids;
  if (!acpxRecordId && !acpxSessionId && !agentSessionId) return;
  return {
    state: params.state,
    ...(acpxRecordId ? { acpxRecordId } : {}),
    ...(acpxSessionId ? { acpxSessionId } : {}),
    ...(agentSessionId ? { agentSessionId } : {}),
    source: params.source,
    lastUpdatedAt: params.now,
  };
}
/** Resolve normalized ACP identity from persisted session metadata. */
function resolveSessionIdentityFromMeta(meta) {
  if (!meta) return;
  return normalizeIdentity(meta.identity);
}
/** Return true when an identity has a backend or agent session id. */
function identityHasStableSessionId(identity) {
  return Boolean(identity?.acpxSessionId || identity?.agentSessionId);
}
/** Resolve the runtime resume id, preferring agent session id over ACP backend id. */
function resolveRuntimeResumeSessionId(identity) {
  if (!identity) return;
  return (
    normalizeOptionalString(identity.agentSessionId) ??
    normalizeOptionalString(identity.acpxSessionId)
  );
}
/** Return true when identity is absent or still pending. */
function isSessionIdentityPending(identity) {
  if (!identity) return true;
  return identity.state === "pending";
}
/** Compare identities ignoring lastUpdatedAt timestamp churn. */
function identityEquals(left, right) {
  const a = normalizeIdentity(left);
  const b = normalizeIdentity(right);
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.state === b.state &&
    a.acpxRecordId === b.acpxRecordId &&
    a.acpxSessionId === b.acpxSessionId &&
    a.agentSessionId === b.agentSessionId &&
    a.source === b.source
  );
}
/** Merge current and incoming identity observations without downgrading resolved ids. */
function mergeSessionIdentity(params) {
  const current = normalizeIdentity(params.current);
  const incoming = normalizeIdentity(params.incoming);
  if (!current) {
    if (!incoming) return;
    return {
      ...incoming,
      lastUpdatedAt: params.now,
    };
  }
  if (!incoming) return current;
  const currentResolved = current.state === "resolved";
  const incomingResolved = incoming.state === "resolved";
  const allowIncomingValue = !currentResolved || incomingResolved;
  const nextRecordId =
    allowIncomingValue && incoming.acpxRecordId ? incoming.acpxRecordId : current.acpxRecordId;
  const nextAcpxSessionId =
    allowIncomingValue && incoming.acpxSessionId ? incoming.acpxSessionId : current.acpxSessionId;
  const nextAgentSessionId =
    allowIncomingValue && incoming.agentSessionId
      ? incoming.agentSessionId
      : current.agentSessionId;
  const nextState = Boolean(nextAcpxSessionId || nextAgentSessionId)
    ? "resolved"
    : currentResolved
      ? "resolved"
      : incoming.state;
  const nextSource = allowIncomingValue ? incoming.source : current.source;
  return {
    state: nextState,
    ...(nextRecordId ? { acpxRecordId: nextRecordId } : {}),
    ...(nextAcpxSessionId ? { acpxSessionId: nextAcpxSessionId } : {}),
    ...(nextAgentSessionId ? { agentSessionId: nextAgentSessionId } : {}),
    source: nextSource,
    lastUpdatedAt: params.now,
  };
}
/** Create a pending identity from an ensure-session handle. */
function createIdentityFromEnsure(params) {
  return buildSessionIdentity({
    ids: readIdentityIdsFromHandle(params.handle),
    state: "pending",
    source: "ensure",
    now: params.now,
  });
}
/** Create an identity from a runtime event handle. */
function createIdentityFromHandleEvent(params) {
  const ids = readIdentityIdsFromHandle(params.handle);
  return buildSessionIdentity({
    ids,
    state: ids.agentSessionId ? "resolved" : "pending",
    source: "event",
    now: params.now,
  });
}
/** Create an identity from runtime status output. */
function createIdentityFromStatus(params) {
  if (!params.status) return;
  const details = params.status.details;
  const acpxRecordId =
    normalizeOptionalString(params.status.acpxRecordId) ??
    normalizeOptionalString(details?.acpxRecordId);
  const acpxSessionId =
    normalizeOptionalString(params.status.backendSessionId) ??
    normalizeOptionalString(details?.backendSessionId) ??
    normalizeOptionalString(details?.acpxSessionId);
  const agentSessionId =
    normalizeOptionalString(params.status.agentSessionId) ??
    normalizeOptionalString(details?.agentSessionId);
  if (!acpxRecordId && !acpxSessionId && !agentSessionId) return;
  return {
    state: Boolean(acpxSessionId || agentSessionId) ? "resolved" : "pending",
    ...(acpxRecordId ? { acpxRecordId } : {}),
    ...(acpxSessionId ? { acpxSessionId } : {}),
    ...(agentSessionId ? { agentSessionId } : {}),
    source: "status",
    lastUpdatedAt: params.now,
  };
}
/** Convert ACP identity ids into runtime handle resume identifiers. */
function resolveRuntimeHandleIdentifiersFromIdentity(identity) {
  if (!identity) return {};
  return {
    ...(identity.acpxSessionId ? { backendSessionId: identity.acpxSessionId } : {}),
    ...(identity.agentSessionId ? { agentSessionId: identity.agentSessionId } : {}),
  };
}
//#endregion
export {
  identityHasStableSessionId as a,
  resolveRuntimeHandleIdentifiersFromIdentity as c,
  identityEquals as i,
  resolveRuntimeResumeSessionId as l,
  createIdentityFromHandleEvent as n,
  isSessionIdentityPending as o,
  createIdentityFromStatus as r,
  mergeSessionIdentity as s,
  createIdentityFromEnsure as t,
  resolveSessionIdentityFromMeta as u,
};
