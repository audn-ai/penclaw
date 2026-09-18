import { Ot as ProviderAuthResult } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/provider-auth-result.d.ts
/**
 * Builds the standard auth result payload for OAuth-style provider login flows.
 *
 * The helper emits both the credential profile and the config patch expected by setup callers,
 * while normalizing model refs so OAuth imports do not persist retired catalog ids.
 */
declare function buildOauthProviderAuthResult(params: {
  /** Provider id stored on the auth profile credential and profile id. */ providerId: string /** Default model ref to seed into config when no explicit patch is supplied. */;
  defaultModel: string /** OAuth access token persisted in the generated auth profile. */;
  access: string /** Optional OAuth refresh token persisted when present. */;
  refresh?:
    | string
    | null /** Optional expiry timestamp or date-like value normalized to Date-safe milliseconds. */;
  expires?:
    | number
    | null /** Account email used for credential metadata and default profile naming. */;
  email?: string | null /** Human-readable account label stored in credential metadata. */;
  displayName?: string | null /** Explicit profile name used when deriving the auth profile id. */;
  profileName?: string | null /** Optional prefix added to the generated auth profile id. */;
  profilePrefix?: string /** Provider-specific credential fields merged into the OAuth credential. */;
  credentialExtra?: Record<
    string,
    unknown
  > /** Explicit config patch to emit after model-ref normalization. */;
  configPatch?: Partial<OpenClawConfig> /** Optional setup notes forwarded to provider login callers. */;
  notes?: string[];
}): ProviderAuthResult;
//#endregion
export { buildOauthProviderAuthResult as t };
