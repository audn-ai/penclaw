//#region src/channels/plugins/dm-access.d.ts
/**
 * Selects whether canonical DM fields live at the top level or under `dm`.
 */
type ChannelDmAllowFromMode = "topOnly" | "topOrNested" | "nestedOnly";
/**
 * Supported direct-message policy values for channel account config.
 */
type ChannelDmPolicy = "pairing" | "allowlist" | "open" | "disabled";
/**
 * Normalized DM access view consumed by channel setup and reply gates.
 */
type ChannelDmAccess = {
  dmPolicy?: ChannelDmPolicy;
  allowFrom?: Array<string | number>;
};
/**
 * Mutable config record used while migrating channel account DM fields.
 */
type DmAccessRecord = Record<string, unknown>;
/**
 * Result returned by compatibility helpers after optional DM config mutation.
 */
type CompatMutationResult = {
  entry: DmAccessRecord;
  changed: boolean;
};
/**
 * Narrows a raw string to a supported channel DM policy.
 */
declare function normalizeChannelDmPolicy(value: string | undefined): ChannelDmPolicy | undefined;
/**
 * Resolves the effective DM policy from account, parent account, and default policy.
 */
declare function resolveChannelDmPolicy(params: {
  account?: DmAccessRecord | null;
  parent?: DmAccessRecord | null;
  mode?: ChannelDmAllowFromMode;
  defaultPolicy?: string;
}): ChannelDmPolicy | undefined;
/**
 * Resolves the effective DM allowlist from account or parent account config.
 */
declare function resolveChannelDmAllowFrom(params: {
  account?: DmAccessRecord | null;
  parent?: DmAccessRecord | null;
  mode?: ChannelDmAllowFromMode;
}): Array<string | number> | undefined;
/**
 * Resolves policy and allowlist together for channel access checks.
 */
declare function resolveChannelDmAccess(params: {
  account?: DmAccessRecord | null;
  parent?: DmAccessRecord | null;
  mode?: ChannelDmAllowFromMode;
  defaultPolicy?: string;
}): ChannelDmAccess;
/**
 * Writes a canonical DM allowlist and removes the matching legacy alias.
 */
declare function setCanonicalDmAllowFrom(params: {
  entry: DmAccessRecord;
  mode: ChannelDmAllowFromMode;
  allowFrom: Array<string | number>;
  pathPrefix: string;
  changes?: string[];
  reason: string;
}): void;
/**
 * Migrates legacy `dm.*` aliases into the canonical DM access fields.
 */
declare function normalizeLegacyDmAliases(params: {
  entry: DmAccessRecord;
  pathPrefix: string;
  changes: string[];
  promoteAllowFrom?: boolean;
}): CompatMutationResult;
/**
 * Ensures `dmPolicy="open"` has the wildcard allowlist required by access gates.
 */
declare function ensureOpenDmPolicyAllowFromWildcard(params: {
  entry: DmAccessRecord;
  mode: ChannelDmAllowFromMode;
  pathPrefix: string;
  changes: string[];
}): void;
//#endregion
export {
  DmAccessRecord as a,
  normalizeLegacyDmAliases as c,
  resolveChannelDmPolicy as d,
  setCanonicalDmAllowFrom as f,
  CompatMutationResult as i,
  resolveChannelDmAccess as l,
  ChannelDmAllowFromMode as n,
  ensureOpenDmPolicyAllowFromWildcard as o,
  ChannelDmPolicy as r,
  normalizeChannelDmPolicy as s,
  ChannelDmAccess as t,
  resolveChannelDmAllowFrom as u,
};
