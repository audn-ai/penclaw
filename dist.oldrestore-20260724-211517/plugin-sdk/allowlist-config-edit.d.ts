import { t as ChannelId } from "../channel-id.types-DjYEl-_2.js";
import { n as ChannelAllowlistAdapter } from "../types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/allowlist-config-edit.d.ts
type AllowlistConfigPaths = {
  readPaths: string[][];
  writePath: string[];
  cleanupPaths?: string[][];
};
/** Named allowlist entries attached to a route-specific override. */
type AllowlistGroupOverride = {
  label: string;
  entries: string[];
};
/** Per-entry display-name lookup results for channel allowlist UIs. */
type AllowlistNameResolution = Array<{
  input: string;
  resolved: boolean;
  name?: string | null;
}>;
type AllowlistNormalizer = (params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  values: Array<string | number>;
}) => string[];
type AllowlistAccountResolver<ResolvedAccount> = (params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => ResolvedAccount;
/** Resolve modern DM/group allowlist paths for account-scoped channel config writes. */
declare function resolveDmGroupAllowlistConfigPaths(scope: "dm" | "group"): AllowlistConfigPaths;
/** Resolve DM-only paths that still read and clean up the old nested dm.allowFrom location. */
declare function resolveLegacyDmAllowlistConfigPaths(
  scope: "dm" | "group",
): AllowlistConfigPaths | null;
/** Coerce stored allowlist entries into presentable non-empty strings. */
declare function readConfiguredAllowlistEntries(
  entries: Array<string | number> | null | undefined,
): string[];
/** Collect labeled allowlist overrides from a flat keyed record. */
declare function collectAllowlistOverridesFromRecord<T>(params: {
  record: Record<string, T | undefined> | null | undefined;
  label: (key: string, value: T) => string;
  resolveEntries: (value: T) => Array<string | number> | null | undefined;
}): AllowlistGroupOverride[];
/** Collect labeled allowlist overrides from an outer record with nested child records. */
declare function collectNestedAllowlistOverridesFromRecord<Outer, Inner>(params: {
  record: Record<string, Outer | undefined> | null | undefined;
  outerLabel: (key: string, value: Outer) => string;
  resolveOuterEntries: (value: Outer) => Array<string | number> | null | undefined;
  resolveChildren: (value: Outer) => Record<string, Inner | undefined> | null | undefined;
  innerLabel: (outerKey: string, innerKey: string, inner: Inner) => string;
  resolveInnerEntries: (value: Inner) => Array<string | number> | null | undefined;
}): AllowlistGroupOverride[];
/** Build an account-scoped flat override resolver from a keyed allowlist record. */
declare function createFlatAllowlistOverrideResolver<ResolvedAccount, Entry>(params: {
  resolveRecord: (account: ResolvedAccount) => Record<string, Entry | undefined> | null | undefined;
  label: (key: string, value: Entry) => string;
  resolveEntries: (value: Entry) => Array<string | number> | null | undefined;
}): (account: ResolvedAccount) => AllowlistGroupOverride[];
/** Build an account-scoped nested override resolver from hierarchical allowlist records. */
declare function createNestedAllowlistOverrideResolver<ResolvedAccount, Outer, Inner>(params: {
  resolveRecord: (account: ResolvedAccount) => Record<string, Outer | undefined> | null | undefined;
  outerLabel: (key: string, value: Outer) => string;
  resolveOuterEntries: (value: Outer) => Array<string | number> | null | undefined;
  resolveChildren: (value: Outer) => Record<string, Inner | undefined> | null | undefined;
  innerLabel: (outerKey: string, innerKey: string, inner: Inner) => string;
  resolveInnerEntries: (value: Inner) => Array<string | number> | null | undefined;
}): (account: ResolvedAccount) => AllowlistGroupOverride[];
/** Build the common account-scoped token-gated allowlist name resolver. */
declare function createAccountScopedAllowlistNameResolver<ResolvedAccount>(params: {
  resolveAccount: (params: { cfg: OpenClawConfig; accountId?: string | null }) => ResolvedAccount;
  resolveToken: (account: ResolvedAccount) => string | null | undefined;
  resolveNames: (params: { token: string; entries: string[] }) => Promise<AllowlistNameResolution>;
}): NonNullable<ChannelAllowlistAdapter["resolveNames"]>;
/** Build the default account-scoped allowlist editor used by channel plugins with config-backed lists. */
declare function buildAccountScopedAllowlistConfigEditor(params: {
  channelId: ChannelId;
  normalize: AllowlistNormalizer;
  resolvePaths: (scope: "dm" | "group") => AllowlistConfigPaths | null;
}): NonNullable<ChannelAllowlistAdapter["applyConfigEdit"]>;
/** Build the common DM/group allowlist adapter used by channels that store both lists in config. */
declare function buildDmGroupAccountAllowlistAdapter<ResolvedAccount>(params: {
  channelId: ChannelId;
  resolveAccount: AllowlistAccountResolver<ResolvedAccount>;
  normalize: AllowlistNormalizer;
  resolveDmAllowFrom: (
    account: ResolvedAccount,
    context: {
      cfg: OpenClawConfig;
      accountId?: string | null;
    },
  ) => Array<string | number> | null | undefined;
  resolveGroupAllowFrom: (account: ResolvedAccount) => Array<string | number> | null | undefined;
  resolveDmPolicy?: (account: ResolvedAccount) => string | null | undefined;
  resolveGroupPolicy?: (account: ResolvedAccount) => string | null | undefined;
  resolveGroupOverrides?: (account: ResolvedAccount) => AllowlistGroupOverride[] | undefined;
}): Pick<ChannelAllowlistAdapter, "supportsScope" | "readConfig" | "applyConfigEdit">;
/** Build the common DM-only allowlist adapter for channels with legacy dm.allowFrom fallback paths. */
declare function buildLegacyDmAccountAllowlistAdapter<ResolvedAccount>(params: {
  channelId: ChannelId;
  resolveAccount: AllowlistAccountResolver<ResolvedAccount>;
  normalize: AllowlistNormalizer;
  resolveDmAllowFrom: (
    account: ResolvedAccount,
    context: {
      cfg: OpenClawConfig;
      accountId?: string | null;
    },
  ) => Array<string | number> | null | undefined;
  resolveGroupPolicy?: (account: ResolvedAccount) => string | null | undefined;
  resolveGroupOverrides?: (account: ResolvedAccount) => AllowlistGroupOverride[] | undefined;
}): Pick<ChannelAllowlistAdapter, "supportsScope" | "readConfig" | "applyConfigEdit">;
//#endregion
export {
  AllowlistGroupOverride,
  AllowlistNameResolution,
  buildAccountScopedAllowlistConfigEditor,
  buildDmGroupAccountAllowlistAdapter,
  buildLegacyDmAccountAllowlistAdapter,
  collectAllowlistOverridesFromRecord,
  collectNestedAllowlistOverridesFromRecord,
  createAccountScopedAllowlistNameResolver,
  createFlatAllowlistOverrideResolver,
  createNestedAllowlistOverrideResolver,
  readConfiguredAllowlistEntries,
  resolveDmGroupAllowlistConfigPaths,
  resolveLegacyDmAllowlistConfigPaths,
};
