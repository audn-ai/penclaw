import { v as GroupPolicy } from "./types.base-ibSxQuK3.js";

//#region src/plugin-sdk/group-access.d.ts
/** Reason code returned when evaluating a sender against group policy. */
type SenderGroupAccessReason =
  | "allowed"
  | "disabled"
  | "empty_allowlist"
  | "sender_not_allowlisted";
/** Sender-level group access decision plus the effective group policy. */
type SenderGroupAccessDecision = {
  allowed: boolean;
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
  reason: SenderGroupAccessReason;
};
/** Reason code returned when evaluating a configured group route. */
type GroupRouteAccessReason =
  | "allowed"
  | "disabled"
  | "empty_allowlist"
  | "route_not_allowlisted"
  | "route_disabled";
/** Route-level group access decision plus the effective group policy. */
type GroupRouteAccessDecision = {
  allowed: boolean;
  groupPolicy: GroupPolicy;
  reason: GroupRouteAccessReason;
};
/** Reason code returned when evaluating a precomputed allowlist match. */
type MatchedGroupAccessReason =
  | "allowed"
  | "disabled"
  | "missing_match_input"
  | "empty_allowlist"
  | "not_allowlisted";
/** Matched-input group access decision plus the effective group policy. */
type MatchedGroupAccessDecision = {
  allowed: boolean;
  groupPolicy: GroupPolicy;
  reason: MatchedGroupAccessReason;
};
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function resolveSenderScopedGroupPolicy(params: {
  groupPolicy: GroupPolicy;
  groupAllowFrom: string[];
}): GroupPolicy;
/** @deprecated Use route descriptors with `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function evaluateGroupRouteAccessForPolicy(params: {
  groupPolicy: GroupPolicy;
  routeAllowlistConfigured: boolean;
  routeMatched: boolean;
  routeEnabled?: boolean;
}): GroupRouteAccessDecision;
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function evaluateMatchedGroupAccessForPolicy(params: {
  groupPolicy: GroupPolicy;
  allowlistConfigured: boolean;
  allowlistMatched: boolean;
  requireMatchInput?: boolean;
  hasMatchInput?: boolean;
}): MatchedGroupAccessDecision;
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function evaluateSenderGroupAccessForPolicy(params: {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied?: boolean;
  groupAllowFrom: string[];
  senderId: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
}): SenderGroupAccessDecision;
/** @deprecated Use `resolveOpenProviderRuntimeGroupPolicy` plus `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function evaluateSenderGroupAccess(params: {
  providerConfigPresent: boolean;
  configuredGroupPolicy?: GroupPolicy;
  defaultGroupPolicy?: GroupPolicy;
  groupAllowFrom: string[];
  senderId: string;
  isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
}): SenderGroupAccessDecision;
//#endregion
export {
  SenderGroupAccessDecision as a,
  evaluateMatchedGroupAccessForPolicy as c,
  resolveSenderScopedGroupPolicy as d,
  MatchedGroupAccessReason as i,
  evaluateSenderGroupAccess as l,
  GroupRouteAccessReason as n,
  SenderGroupAccessReason as o,
  MatchedGroupAccessDecision as r,
  evaluateGroupRouteAccessForPolicy as s,
  GroupRouteAccessDecision as t,
  evaluateSenderGroupAccessForPolicy as u,
};
