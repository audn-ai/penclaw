import { r as ChannelAccountSnapshot } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/plugins/account-helpers.d.ts
/**
 * Creates reusable account id listing and default-account resolution helpers for a channel.
 */
declare function createAccountListHelpers(
  channelKey: string,
  options?: {
    normalizeAccountId?: (id: string) => string;
    allowUnlistedDefaultAccount?: boolean;
    implicitDefaultAccount?: {
      channelKeys?: readonly string[];
      envVars?: readonly string[];
    };
    hasImplicitDefaultAccount?: (cfg: OpenClawConfig) => boolean;
  },
): {
  listConfiguredAccountIds: (cfg: OpenClawConfig) => string[];
  listAccountIds: (cfg: OpenClawConfig) => string[];
  resolveDefaultAccountId: (cfg: OpenClawConfig) => string;
};
/**
 * Checks whether a config/env value should count as an account being configured.
 */
declare function hasConfiguredAccountValue(value: unknown): boolean;
/**
 * Combines configured, additional, implicit, and fallback account ids into stable order.
 */
declare function listCombinedAccountIds(params: {
  configuredAccountIds: Iterable<string>;
  additionalAccountIds?: Iterable<string>;
  implicitAccountId?: string | undefined;
  fallbackAccountIdWhenEmpty?: string | undefined;
}): string[];
/**
 * Resolves the default account id from a listed account set and optional configured preference.
 */
declare function resolveListedDefaultAccountId(params: {
  accountIds: readonly string[];
  configuredDefaultAccountId?: string | undefined;
  allowUnlistedDefaultAccount?: boolean;
  ambiguousFallbackAccountId?: string | undefined;
  normalizeListedAccountId?: ((accountId: string) => string) | undefined;
}): string;
/**
 * Merges channel-level config with account-level overrides.
 */
declare function mergeAccountConfig<TConfig extends Record<string, unknown>>(params: {
  channelConfig: TConfig | undefined;
  accountConfig: Partial<TConfig> | undefined;
  omitKeys?: string[];
  nestedObjectKeys?: string[];
}): TConfig;
/**
 * Resolves an account config by id, then merges it over channel-level defaults.
 */
declare function resolveMergedAccountConfig<TConfig extends Record<string, unknown>>(params: {
  channelConfig: TConfig | undefined;
  accounts: Record<string, Partial<TConfig>> | undefined;
  accountId: string;
  omitKeys?: string[];
  normalizeAccountId?: (accountId: string) => string;
  nestedObjectKeys?: string[];
}): TConfig;
type AccountSnapshotInput = {
  accountId?: string | null;
  enabled?: boolean | null;
  name?: string | null | undefined;
};
/**
 * Builds a safe account snapshot for status/setup surfaces.
 */
declare function describeAccountSnapshot(params: {
  account: AccountSnapshotInput;
  configured?: boolean | undefined;
  extra?: Record<string, unknown> | undefined;
}): ChannelAccountSnapshot;
/**
 * Builds a webhook-mode account snapshot with the standard mode field.
 */
declare function describeWebhookAccountSnapshot(params: {
  account: AccountSnapshotInput;
  configured?: boolean | undefined;
  mode?: string | undefined;
  extra?: Record<string, unknown> | undefined;
}): ChannelAccountSnapshot;
//#endregion
export {
  listCombinedAccountIds as a,
  resolveMergedAccountConfig as c,
  hasConfiguredAccountValue as i,
  describeAccountSnapshot as n,
  mergeAccountConfig as o,
  describeWebhookAccountSnapshot as r,
  resolveListedDefaultAccountId as s,
  createAccountListHelpers as t,
};
