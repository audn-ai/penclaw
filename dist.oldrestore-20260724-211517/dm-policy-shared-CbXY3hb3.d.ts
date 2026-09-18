import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";

//#region src/security/dm-policy-shared.d.ts
/**
 * Derive a stable main-DM owner from a single-entry allowlist.
 * Wildcards, multi-owner lists, and non-main DM scopes stay unpinned so callers keep route-specific sessions.
 */
declare function resolvePinnedMainDmOwnerFromAllowlist(params: {
  dmScope?: string | null;
  allowFrom?: Array<string | number> | null;
  normalizeEntry: (entry: string) => string | undefined;
}): string | null;
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function resolveEffectiveAllowFromLists(params: {
  allowFrom?: Array<string | number> | null;
  groupAllowFrom?: Array<string | number> | null;
  storeAllowFrom?: Array<string | number> | null;
  dmPolicy?: string | null;
  groupAllowFromFallbackToAllowFrom?: boolean | null;
}): {
  effectiveAllowFrom: string[];
  effectiveGroupAllowFrom: string[];
};
/** Admission decision returned by legacy DM/group access helpers. */
type DmGroupAccessDecision = "allow" | "block" | "pairing";
/** Stable reason codes used by channel plugins, command auth, and diagnostics. */
declare const DM_GROUP_ACCESS_REASON: {
  readonly GROUP_POLICY_ALLOWED: "group_policy_allowed";
  readonly GROUP_POLICY_DISABLED: "group_policy_disabled";
  readonly GROUP_POLICY_EMPTY_ALLOWLIST: "group_policy_empty_allowlist";
  readonly GROUP_POLICY_NOT_ALLOWLISTED: "group_policy_not_allowlisted";
  readonly DM_POLICY_OPEN: "dm_policy_open";
  readonly DM_POLICY_DISABLED: "dm_policy_disabled";
  readonly DM_POLICY_ALLOWLISTED: "dm_policy_allowlisted";
  readonly DM_POLICY_PAIRING_REQUIRED: "dm_policy_pairing_required";
  readonly DM_POLICY_NOT_ALLOWLISTED: "dm_policy_not_allowlisted";
};
/** Machine-readable reason code for a DM/group access decision. */
type DmGroupAccessReasonCode = (typeof DM_GROUP_ACCESS_REASON)[keyof typeof DM_GROUP_ACCESS_REASON];
type DmGroupAccessResult = {
  decision: DmGroupAccessDecision;
  reasonCode: DmGroupAccessReasonCode;
  reason: string;
};
/**
 * Resolve sender access for `dmPolicy=open`, where `*` means fully open and a configured
 * allowlist still restricts the accepted sender set.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveOpenDmAllowlistAccess(params: {
  effectiveAllowFrom: Array<string | number>;
  isSenderAllowed: (allowFrom: string[]) => boolean;
}): DmGroupAccessResult;
type DmGroupAccessInputParams = {
  isGroup: boolean;
  dmPolicy?: string | null;
  groupPolicy?: string | null;
  allowFrom?: Array<string | number> | null;
  groupAllowFrom?: Array<string | number> | null;
  storeAllowFrom?: Array<string | number> | null;
  groupAllowFromFallbackToAllowFrom?: boolean | null;
  isSenderAllowed: (allowFrom: string[]) => boolean;
};
/** @deprecated Use `resolveChannelMessageIngress` or `readChannelIngressStoreAllowFromForDmPolicy` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function readStoreAllowFromForDmPolicy(params: {
  provider: ChannelId;
  accountId: string;
  dmPolicy?: string | null;
  shouldRead?: boolean | null;
  readStore?: (provider: ChannelId, accountId: string) => Promise<string[]>;
}): Promise<string[]>;
/**
 * Resolve legacy DM/group sender admission from already-computed allowlists.
 * Group messages are evaluated against group policy first; DM policy applies only outside groups.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveDmGroupAccessDecision(params: {
  isGroup: boolean;
  dmPolicy?: string | null;
  groupPolicy?: string | null;
  effectiveAllowFrom: Array<string | number>;
  effectiveGroupAllowFrom: Array<string | number>;
  isSenderAllowed: (allowFrom: string[]) => boolean;
}): DmGroupAccessResult;
/**
 * Resolve legacy DM/group sender admission and return the effective allowlists used.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveDmGroupAccessWithLists(params: DmGroupAccessInputParams): {
  decision: DmGroupAccessDecision;
  reasonCode: DmGroupAccessReasonCode;
  reason: string;
  effectiveAllowFrom: string[];
  effectiveGroupAllowFrom: string[];
};
/**
 * Resolve legacy sender admission plus control-command authorization.
 * Control commands use configured allowlists, not pairing-store state, for group safety.
 *
 * @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`.
 */
declare function resolveDmGroupAccessWithCommandGate(
  params: DmGroupAccessInputParams & {
    command?: {
      useAccessGroups: boolean;
      allowTextCommands: boolean;
      hasControlCommand: boolean;
    };
  },
): {
  decision: DmGroupAccessDecision;
  reasonCode: DmGroupAccessReasonCode;
  reason: string;
  effectiveAllowFrom: string[];
  effectiveGroupAllowFrom: string[];
  commandAuthorized: boolean;
  shouldBlockControlCommand: boolean;
};
/** @deprecated Use `resolveChannelMessageIngress` from `openclaw/plugin-sdk/channel-ingress-runtime`. */
declare function resolveDmAllowState(params: {
  provider: ChannelId;
  accountId: string;
  allowFrom?: Array<string | number> | null;
  dmPolicy?: string | null;
  normalizeEntry?: (raw: string) => string;
  readStore?: (provider: ChannelId, accountId: string) => Promise<string[]>;
}): Promise<{
  configAllowFrom: string[];
  hasWildcard: boolean;
  allowCount: number;
  isMultiUserDm: boolean;
}>;
//#endregion
export {
  resolveDmAllowState as a,
  resolveDmGroupAccessWithLists as c,
  resolvePinnedMainDmOwnerFromAllowlist as d,
  readStoreAllowFromForDmPolicy as i,
  resolveEffectiveAllowFromLists as l,
  DmGroupAccessDecision as n,
  resolveDmGroupAccessDecision as o,
  DmGroupAccessReasonCode as r,
  resolveDmGroupAccessWithCommandGate as s,
  DM_GROUP_ACCESS_REASON as t,
  resolveOpenDmAllowlistAccess as u,
};
