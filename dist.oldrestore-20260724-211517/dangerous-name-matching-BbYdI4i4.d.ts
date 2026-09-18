import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/config/dangerous-name-matching.d.ts
type DangerousNameMatchingConfig = {
  dangerouslyAllowNameMatching?: boolean;
};
type ProviderDangerousNameMatchingScope = {
  prefix: string;
  account: Record<string, unknown>;
  dangerousNameMatchingEnabled: boolean;
  dangerousFlagPath: string;
};
type DangerousNameMatchingResolverInput = {
  providerConfig?: DangerousNameMatchingConfig | null | undefined;
  accountConfig?: DangerousNameMatchingConfig | null | undefined;
};
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
declare function isDangerousNameMatchingEnabled(
  config: DangerousNameMatchingConfig | null | undefined,
): boolean;
/** Resolves account-level dangerous name matching, inheriting the provider flag when unset. */
declare function resolveDangerousNameMatchingEnabled(
  input: DangerousNameMatchingResolverInput,
): boolean;
/** Collects provider/account scopes that policy and doctor surfaces can audit. */
declare function collectProviderDangerousNameMatchingScopes(
  cfg: OpenClawConfig,
  provider: string,
): ProviderDangerousNameMatchingScope[];
//#endregion
export {
  isDangerousNameMatchingEnabled as n,
  resolveDangerousNameMatchingEnabled as r,
  collectProviderDangerousNameMatchingScopes as t,
};
