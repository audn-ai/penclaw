import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { a as resolveToolsBySender } from "./group-policy-qBQEoR2A.js";
import { V as ChannelSecurityAdapter } from "./types.adapters-BND_5Qr-.js";
import { v as GroupPolicy } from "./types.base-ibSxQuK3.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import {
  ct as GroupToolPolicyConfig,
  st as GroupToolPolicyBySenderConfig,
} from "./types.slack-DOPma3IJ.js";
//#region src/channels/plugins/group-policy-warnings.d.ts
type GroupPolicyWarningCollector = (groupPolicy: GroupPolicy) => string[];
type AccountGroupPolicyWarningCollector<ResolvedAccount> = (params: {
  account: ResolvedAccount;
  cfg: OpenClawConfig;
}) => string[];
type ConfigGroupPolicyWarningCollector<
  Params extends {
    cfg: OpenClawConfig;
  },
> = (params: Params) => string[];
type WarningCollector<Params> = (params: Params) => string[];
declare function composeWarningCollectors<Params>(
  ...collectors: Array<WarningCollector<Params> | null | undefined>
): WarningCollector<Params>;
declare function projectWarningCollector<Params, Projected>(
  project: (params: Params) => Projected,
  collector: WarningCollector<Projected>,
): WarningCollector<Params>;
declare function projectConfigWarningCollector<
  Params extends {
    cfg: OpenClawConfig;
  },
>(
  collector: WarningCollector<{
    cfg: OpenClawConfig;
  }>,
): WarningCollector<Params>;
declare function projectConfigAccountIdWarningCollector<
  Params extends {
    cfg: OpenClawConfig;
    accountId?: string | null;
  },
>(
  collector: WarningCollector<{
    cfg: OpenClawConfig;
    accountId?: string | null;
  }>,
): WarningCollector<Params>;
declare function projectAccountWarningCollector<
  ResolvedAccount,
  Params extends {
    account: ResolvedAccount;
  },
>(collector: WarningCollector<ResolvedAccount>): WarningCollector<Params>;
declare function projectAccountConfigWarningCollector<
  ResolvedAccount,
  ProjectedCfg,
  Params extends {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
  },
>(
  projectCfg: (cfg: OpenClawConfig) => ProjectedCfg,
  collector: WarningCollector<{
    account: ResolvedAccount;
    cfg: ProjectedCfg;
  }>,
): WarningCollector<Params>;
declare function createConditionalWarningCollector<Params>(
  ...collectors: Array<(params: Params) => string | string[] | null | undefined | false>
): WarningCollector<Params>;
declare function composeAccountWarningCollectors<
  ResolvedAccount,
  Params extends {
    account: ResolvedAccount;
  },
>(
  baseCollector: WarningCollector<Params>,
  ...collectors: Array<(account: ResolvedAccount) => string | string[] | null | undefined | false>
): WarningCollector<Params>;
declare function buildOpenGroupPolicyWarning(params: {
  surface: string;
  openBehavior: string;
  remediation: string;
}): string;
declare function buildOpenGroupPolicyRestrictSendersWarning(params: {
  surface: string;
  openScope: string;
  groupPolicyPath: string;
  groupAllowFromPath: string;
  mentionGated?: boolean;
}): string;
declare function buildOpenGroupPolicyNoRouteAllowlistWarning(params: {
  surface: string;
  routeAllowlistPath: string;
  routeScope: string;
  groupPolicyPath: string;
  groupAllowFromPath: string;
  mentionGated?: boolean;
}): string;
declare function buildOpenGroupPolicyConfigureRouteAllowlistWarning(params: {
  surface: string;
  openScope: string;
  groupPolicyPath: string;
  routeAllowlistPath: string;
  mentionGated?: boolean;
}): string;
declare function collectOpenGroupPolicyRestrictSendersWarnings(
  params: Parameters<typeof buildOpenGroupPolicyRestrictSendersWarning>[0] & {
    groupPolicy: "open" | "allowlist" | "disabled";
  },
): string[];
declare function collectAllowlistProviderRestrictSendersWarnings(
  params: {
    cfg: OpenClawConfig;
    providerConfigPresent: boolean;
    configuredGroupPolicy?: GroupPolicy | null;
  } & Omit<Parameters<typeof collectOpenGroupPolicyRestrictSendersWarnings>[0], "groupPolicy">,
): string[];
/** Build an account-aware allowlist-provider warning collector for sender-restricted groups. */
declare function createAllowlistProviderRestrictSendersWarningCollector<ResolvedAccount>(
  params: {
    providerConfigPresent: (cfg: OpenClawConfig) => boolean;
    resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  } & Omit<
    Parameters<typeof collectAllowlistProviderRestrictSendersWarnings>[0],
    "cfg" | "providerConfigPresent" | "configuredGroupPolicy"
  >,
): AccountGroupPolicyWarningCollector<ResolvedAccount>;
/** Build a direct account-aware warning collector when the policy already lives on the account. */
declare function createOpenGroupPolicyRestrictSendersWarningCollector<ResolvedAccount>(
  params: {
    resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
    defaultGroupPolicy?: GroupPolicy;
  } & Omit<Parameters<typeof collectOpenGroupPolicyRestrictSendersWarnings>[0], "groupPolicy">,
): (account: ResolvedAccount) => string[];
declare function collectAllowlistProviderGroupPolicyWarnings(params: {
  cfg: OpenClawConfig;
  providerConfigPresent: boolean;
  configuredGroupPolicy?: GroupPolicy | null;
  collect: GroupPolicyWarningCollector;
}): string[];
/** Build a config-aware allowlist-provider warning collector from an arbitrary policy resolver. */
declare function createAllowlistProviderGroupPolicyWarningCollector<
  Params extends {
    cfg: OpenClawConfig;
  },
>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (params: Params) => GroupPolicy | null | undefined;
  collect: (
    params: Params & {
      groupPolicy: GroupPolicy;
    },
  ) => string[];
}): ConfigGroupPolicyWarningCollector<Params>;
declare function collectOpenProviderGroupPolicyWarnings(params: {
  cfg: OpenClawConfig;
  providerConfigPresent: boolean;
  configuredGroupPolicy?: GroupPolicy | null;
  collect: GroupPolicyWarningCollector;
}): string[];
/** Build a config-aware open-provider warning collector from an arbitrary policy resolver. */
declare function createOpenProviderGroupPolicyWarningCollector<
  Params extends {
    cfg: OpenClawConfig;
  },
>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (params: Params) => GroupPolicy | null | undefined;
  collect: (
    params: Params & {
      groupPolicy: GroupPolicy;
    },
  ) => string[];
}): ConfigGroupPolicyWarningCollector<Params>;
/** Build an account-aware allowlist-provider warning collector for simple open-policy warnings. */
declare function createAllowlistProviderOpenWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  buildOpenWarning: Parameters<typeof buildOpenGroupPolicyWarning>[0];
}): AccountGroupPolicyWarningCollector<ResolvedAccount>;
declare function collectOpenGroupPolicyRouteAllowlistWarnings(params: {
  groupPolicy: "open" | "allowlist" | "disabled";
  routeAllowlistConfigured: boolean;
  restrictSenders: Parameters<typeof buildOpenGroupPolicyRestrictSendersWarning>[0];
  noRouteAllowlist: Parameters<typeof buildOpenGroupPolicyNoRouteAllowlistWarning>[0];
}): string[];
/** Build an account-aware allowlist-provider warning collector for route-allowlisted groups. */
declare function createAllowlistProviderRouteAllowlistWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  resolveRouteAllowlistConfigured: (account: ResolvedAccount) => boolean;
  restrictSenders: Parameters<typeof buildOpenGroupPolicyRestrictSendersWarning>[0];
  noRouteAllowlist: Parameters<typeof buildOpenGroupPolicyNoRouteAllowlistWarning>[0];
}): AccountGroupPolicyWarningCollector<ResolvedAccount>;
declare function collectOpenGroupPolicyConfiguredRouteWarnings(params: {
  groupPolicy: "open" | "allowlist" | "disabled";
  routeAllowlistConfigured: boolean;
  configureRouteAllowlist: Parameters<typeof buildOpenGroupPolicyConfigureRouteAllowlistWarning>[0];
  missingRouteAllowlist: Parameters<typeof buildOpenGroupPolicyWarning>[0];
}): string[];
/** Build an account-aware open-provider warning collector for configured-route channels. */
declare function createOpenProviderConfiguredRouteWarningCollector<ResolvedAccount>(params: {
  providerConfigPresent: (cfg: OpenClawConfig) => boolean;
  resolveGroupPolicy: (account: ResolvedAccount) => GroupPolicy | null | undefined;
  resolveRouteAllowlistConfigured: (account: ResolvedAccount) => boolean;
  configureRouteAllowlist: Parameters<typeof buildOpenGroupPolicyConfigureRouteAllowlistWarning>[0];
  missingRouteAllowlist: Parameters<typeof buildOpenGroupPolicyWarning>[0];
}): AccountGroupPolicyWarningCollector<ResolvedAccount>;
//#endregion
//#region src/config/group-scope-tree.d.ts
type ScopeNode = {
  requireMention?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
  introHint?: string;
};
type ScopeTree = {
  defaults?: ScopeNode;
  scopes: Record<string, ScopeNode>;
};
type ScopePath = string[];
type ScopeToolPolicySender = Omit<Parameters<typeof resolveToolsBySender>[0], "toolsBySender">;
declare function buildChannelGroupsScopeTree(
  cfg: OpenClawConfig,
  channel: ChannelId,
  accountId?: string | null,
): ScopeTree;
declare function resolveScopeKeyCaseInsensitive(
  tree: ScopeTree,
  key: string | null | undefined,
): string | undefined;
declare function resolveScopeRequireMention(params: {
  tree: ScopeTree;
  path: ScopePath;
  requireMentionOverride?: boolean;
  overrideOrder?: "before-config" | "after-config";
  configuredScopeDefaultsToNoMention?: boolean;
}): boolean;
declare function resolveScopeToolsPolicy(
  params: {
    tree: ScopeTree;
    path: ScopePath;
  } & ScopeToolPolicySender,
): GroupToolPolicyConfig | undefined;
declare function resolveScopeIntroHint(params: {
  tree: ScopeTree;
  path: ScopePath;
}): string | undefined;
//#endregion
//#region src/plugin-sdk/channel-policy.d.ts
/** Normalizes allowFrom entries into trimmed unique string identifiers. */
declare function normalizeAllowFromList(list: Array<string | number> | undefined | null): string[];
/** Coerces native feature settings to the supported boolean/auto shape. */
declare function coerceNativeSetting(value: unknown): boolean | "auto" | undefined;
/**
 * Candidate allowlist inspected for dangerous name/email/nick matching warnings.
 * `pathLabel` is emitted in doctor output, so callers should pass the exact config path.
 */
type ChannelMutableAllowlistCandidate = {
  pathLabel: string;
  list: unknown;
};
/**
 * Create a warning collector for mutable name/email/nick allowlists while stable-id matching is required.
 * Channel plugins provide a detector for entries that depend on dangerous name matching.
 */
declare function createDangerousNameMatchingMutableAllowlistWarningCollector(params: {
  channel: string;
  detector: (entry: string) => boolean;
  collectLists: (scope: {
    prefix: string;
    account: Record<string, unknown>;
    dangerousFlagPath: string;
  }) => ChannelMutableAllowlistCandidate[];
}): ({ cfg }: { cfg: OpenClawConfig }) => string[];
/**
 * Compose the common account-scoped DM policy resolver with restrict-senders group warnings.
 * This is the shared adapter shape for channels whose DM security and group policy live together.
 */
declare function createRestrictSendersChannelSecurity<
  ResolvedAccount extends {
    accountId?: string | null;
  },
>(params: {
  /** Channel config key used for default account lookup and warning collection. */ channelKey: string /** Reads the account-level DM policy value before shared defaults are applied. */;
  resolveDmPolicy: (
    account: ResolvedAccount,
  ) =>
    | string
    | null
    | undefined /** Reads account-level sender allowlist entries for DM policy resolution. */;
  resolveDmAllowFrom: (
    account: ResolvedAccount,
  ) =>
    | Array<string | number>
    | null
    | undefined /** Reads the group policy value used by restrict-senders warnings. */;
  resolveGroupPolicy: (
    account: ResolvedAccount,
  ) => GroupPolicy | null | undefined /** Operator-facing surface name in warning text. */;
  surface: string /** Operator-facing description of who can trigger when group policy is open. */;
  openScope: string /** Config path shown for the group policy field that should be restricted. */;
  groupPolicyPath: string /** Config path shown for the group sender allowlist field. */;
  groupAllowFromPath: string /** Whether group replies require mentions, reducing open-policy warning severity. */;
  mentionGated?: boolean /** Override for channels whose provider presence is not the channel config key itself. */;
  providerConfigPresent?: (
    cfg: OpenClawConfig,
  ) => boolean /** Fallback account id used when scoped config inherits from another account. */;
  resolveFallbackAccountId?: (
    account: ResolvedAccount,
  ) =>
    | string
    | null
    | undefined /** Default DM policy when the account and shared defaults omit one. */;
  defaultDmPolicy?: string /** Account-scoped allowlist path suffix for warning/proof output. */;
  allowFromPathSuffix?: string /** Account-scoped policy path suffix for warning/proof output. */;
  policyPathSuffix?: string /** Channel id used when formatting pairing approval hints. */;
  approveChannelId?: string /** Explicit pairing approval hint, when the default channel hint is not correct. */;
  approveHint?: string /** Normalizes configured DM allowlist entries before sender matching. */;
  normalizeDmEntry?: (
    raw: string,
  ) => string /** Allows non-default accounts to inherit shared defaults from the default account. */;
  inheritSharedDefaultsFromDefaultAccount?: boolean;
}): ChannelSecurityAdapter<ResolvedAccount>;
//#endregion
export {
  createOpenGroupPolicyRestrictSendersWarningCollector as A,
  composeAccountWarningCollectors as C,
  createAllowlistProviderRestrictSendersWarningCollector as D,
  createAllowlistProviderOpenWarningCollector as E,
  projectConfigAccountIdWarningCollector as F,
  projectConfigWarningCollector as I,
  projectWarningCollector as L,
  createOpenProviderGroupPolicyWarningCollector as M,
  projectAccountConfigWarningCollector as N,
  createAllowlistProviderRouteAllowlistWarningCollector as O,
  projectAccountWarningCollector as P,
  collectOpenProviderGroupPolicyWarnings as S,
  createAllowlistProviderGroupPolicyWarningCollector as T,
  collectAllowlistProviderGroupPolicyWarnings as _,
  normalizeAllowFromList as a,
  collectOpenGroupPolicyRestrictSendersWarnings as b,
  ScopeTree as c,
  resolveScopeKeyCaseInsensitive as d,
  resolveScopeRequireMention as f,
  buildOpenGroupPolicyWarning as g,
  buildOpenGroupPolicyRestrictSendersWarning as h,
  createRestrictSendersChannelSecurity as i,
  createOpenProviderConfiguredRouteWarningCollector as j,
  createConditionalWarningCollector as k,
  buildChannelGroupsScopeTree as l,
  buildOpenGroupPolicyConfigureRouteAllowlistWarning as m,
  coerceNativeSetting as n,
  ScopeNode as o,
  resolveScopeToolsPolicy as p,
  createDangerousNameMatchingMutableAllowlistWarningCollector as r,
  ScopePath as s,
  ChannelMutableAllowlistCandidate as t,
  resolveScopeIntroHint as u,
  collectAllowlistProviderRestrictSendersWarnings as v,
  composeWarningCollectors as w,
  collectOpenGroupPolicyRouteAllowlistWarnings as x,
  collectOpenGroupPolicyConfiguredRouteWarnings as y,
};
