import { mt as ZodType } from "./schemas-CkRCGSfd.js";
import { H as ChannelSetupAdapter } from "./types.adapters-BND_5Qr-.js";
import { N as ChannelSetupInput } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/plugins/setup-helpers.d.ts
declare function applyAccountNameToChannelSection(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  name?: string;
  alwaysUseAccounts?: boolean;
}): OpenClawConfig;
/** Moves a root-level channel name into `accounts.default` before adding named accounts. */
declare function migrateBaseNameToDefaultAccount(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  alwaysUseAccounts?: boolean;
}): OpenClawConfig;
/** Applies setup-time account naming and optional root-name migration in one step. */
declare function prepareScopedSetupConfig(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  name?: string;
  alwaysUseAccounts?: boolean;
  migrateBaseName?: boolean;
}): OpenClawConfig;
/** Applies a setup patch using account-scoped config semantics. */
declare function applySetupAccountConfigPatch(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  patch: Record<string, unknown>;
}): OpenClawConfig;
/** Creates a setup adapter that turns validated setup input into an account config patch. */
declare function createPatchedAccountSetupAdapter(params: {
  channelKey: string;
  alwaysUseAccounts?: boolean;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  validateInput?: ChannelSetupAdapter["validateInput"];
  buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
/** Creates a Zod-backed setup input validator with an optional typed semantic check. */
declare function createZodSetupInputValidator<T extends ChannelSetupInput>(params: {
  schema: ZodType<T>;
  validate?: (params: { cfg: OpenClawConfig; accountId: string; input: T }) => string | null;
}): NonNullable<ChannelSetupAdapter["validateInput"]>;
type SetupInputPresenceRequirement = {
  someOf: string[];
  message: string;
};
declare function createSetupInputPresenceValidator(params: {
  defaultAccountOnlyEnvError?: string;
  whenNotUseEnv?: SetupInputPresenceRequirement[];
  validate?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: ChannelSetupInput;
  }) => string | null;
}): NonNullable<ChannelSetupAdapter["validateInput"]>;
/** Creates a setup adapter that supports env-backed default account auth and patched credentials. */
declare function createEnvPatchedAccountSetupAdapter(params: {
  channelKey: string;
  alwaysUseAccounts?: boolean;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  defaultAccountOnlyEnvError: string;
  missingCredentialError: string;
  hasCredentials: (input: ChannelSetupInput) => boolean;
  validateInput?: ChannelSetupAdapter["validateInput"];
  buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
/** Patches channel config at root for default accounts or under `accounts.<id>` for named accounts. */
declare function patchScopedAccountConfig(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  patch: Record<string, unknown>;
  accountPatch?: Record<string, unknown>;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  scopeDefaultToAccounts?: boolean;
}): OpenClawConfig;
/**
 * Promotes legacy single-account channel fields into the account map for multi-account setup.
 */
declare function moveSingleAccountChannelSectionToDefaultAccount(params: {
  cfg: OpenClawConfig;
  channelKey: string;
}): OpenClawConfig;
//#endregion
export {
  createSetupInputPresenceValidator as a,
  moveSingleAccountChannelSectionToDefaultAccount as c,
  createPatchedAccountSetupAdapter as i,
  patchScopedAccountConfig as l,
  applySetupAccountConfigPatch as n,
  createZodSetupInputValidator as o,
  createEnvPatchedAccountSetupAdapter as r,
  migrateBaseNameToDefaultAccount as s,
  applyAccountNameToChannelSection as t,
  prepareScopedSetupConfig as u,
};
