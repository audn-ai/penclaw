import { a as SessionAcpIdentity, c as SessionAcpMeta } from "./types-Bst3_XVW.js";
import { s as AcpRuntimeHandle, u as AcpRuntimeStatus } from "./types-D85xy4rc.js";

//#region packages/acp-core/src/runtime/session-identity.d.ts
/** Resolve normalized ACP identity from persisted session metadata. */
declare function resolveSessionIdentityFromMeta(
  meta: SessionAcpMeta | undefined,
): SessionAcpIdentity | undefined;
/** Return true when an identity has a backend or agent session id. */
declare function identityHasStableSessionId(identity: SessionAcpIdentity | undefined): boolean;
/** Resolve the runtime resume id, preferring agent session id over ACP backend id. */
declare function resolveRuntimeResumeSessionId(
  identity: SessionAcpIdentity | undefined,
): string | undefined;
/** Return true when identity is absent or still pending. */
declare function isSessionIdentityPending(identity: SessionAcpIdentity | undefined): boolean;
/** Compare identities ignoring lastUpdatedAt timestamp churn. */
declare function identityEquals(
  left: SessionAcpIdentity | undefined,
  right: SessionAcpIdentity | undefined,
): boolean;
/** Merge current and incoming identity observations without downgrading resolved ids. */
declare function mergeSessionIdentity(params: {
  current: SessionAcpIdentity | undefined;
  incoming: SessionAcpIdentity | undefined;
  now: number;
}): SessionAcpIdentity | undefined;
/** Create a pending identity from an ensure-session handle. */
declare function createIdentityFromEnsure(params: {
  handle: AcpRuntimeHandle;
  now: number;
}): SessionAcpIdentity | undefined;
/** Create an identity from a runtime event handle. */
declare function createIdentityFromHandleEvent(params: {
  handle: AcpRuntimeHandle;
  now: number;
}): SessionAcpIdentity | undefined;
/** Create an identity from runtime status output. */
declare function createIdentityFromStatus(params: {
  status: AcpRuntimeStatus | undefined;
  now: number;
}): SessionAcpIdentity | undefined;
/** Convert ACP identity ids into runtime handle resume identifiers. */
declare function resolveRuntimeHandleIdentifiersFromIdentity(
  identity: SessionAcpIdentity | undefined,
): {
  backendSessionId?: string;
  agentSessionId?: string;
};
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
