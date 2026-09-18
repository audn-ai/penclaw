import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import {
  a as AuthProfileFailureReason,
  c as OAuthCredential,
  i as AuthProfileCredential,
  o as AuthProfileIdRepairResult,
  r as AuthProfileBlockedSource,
  s as AuthProfileStore,
} from "./types-Dzb4Vh4b.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/agents/auth-profiles/constants.d.ts
/** @deprecated Anthropic provider-owned CLI profile id; do not use from third-party plugins. */
declare const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** @deprecated OpenAI provider-owned CLI profile id; do not use from third-party plugins. */
declare const CODEX_CLI_PROFILE_ID = "openai:codex-cli";
//#endregion
//#region src/agents/auth-profiles/credential-state.d.ts
/** Reason code for why a stored auth credential can or cannot be used. */
type AuthCredentialReasonCode =
  | "ok"
  | "missing_credential"
  | "invalid_expires"
  | "expired"
  | "unresolved_ref"
  | "malformed_api_key";
/** Default OAuth access-token refresh margin before expiry. */
declare const DEFAULT_OAUTH_REFRESH_MARGIN_MS: number;
/** Normalized expiry state for token-style credentials. */
type TokenExpiryState = "missing" | "valid" | "expiring" | "expired" | "invalid_expires";
/** Returns true when an OAuth credential has a non-expiring access token. */
declare function hasUsableOAuthCredential(
  credential: OAuthCredential | undefined,
  opts?: {
    now?: number;
    refreshMarginMs?: number;
  },
): boolean;
//#endregion
//#region src/agents/provider-auth-aliases.d.ts
/** Inputs that control plugin metadata and trust scope for auth alias lookup. */
type ProviderAuthAliasLookupParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
};
/** Clear provider auth alias cache for tests that mutate plugin metadata. */
declare function resetProviderAuthAliasMapCacheForTest(): void;
/** Resolve canonical auth provider aliases from plugin metadata. */
declare function resolveProviderAuthAliasMap(
  params?: ProviderAuthAliasLookupParams,
): Record<string, string>;
/** Resolve the provider ID that should be used for credential lookup. */
declare function resolveProviderIdForAuth(
  provider: string,
  params?: ProviderAuthAliasLookupParams,
): string;
//#endregion
//#region src/agents/auth-profiles/order.d.ts
/** Reason a profile is or is not eligible for provider auth. */
type AuthProfileEligibilityReasonCode =
  | AuthCredentialReasonCode
  | "profile_missing"
  | "provider_mismatch"
  | "mode_mismatch";
/** Eligibility decision for one auth profile candidate. */
type AuthProfileEligibility = {
  eligible: boolean;
  reasonCode: AuthProfileEligibilityReasonCode;
};
/** Returns true when a stored credential can authenticate the requested provider. */
/** Resolves whether a profile can be used for a provider right now. */
declare function resolveAuthProfileEligibility(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  profileId: string;
  now?: number;
}): AuthProfileEligibility;
type ResolveAuthProfileOrderParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  preferredProfile?: string /** Model that will consume the profile, for model-scoped cooldowns. */;
  forModel?: string /** Read-only status keeps unresolved refs ordered so availability remains unknown. */;
  readinessMode?: "execution" | "read-only";
};
type AuthProfileOrderResolution = {
  profileIds: string[] /** An authored store/config order owns selection, including an empty result. */;
  hasExplicitOrder: boolean;
};
/** Resolves ordered usable auth profiles plus whether an explicit order owns selection. */
declare function resolveAuthProfileOrderWithMetadata(
  params: ResolveAuthProfileOrderParams,
): AuthProfileOrderResolution;
/** Resolves ordered usable auth profile ids for a provider. */
declare function resolveAuthProfileOrder(params: ResolveAuthProfileOrderParams): string[];
//#endregion
//#region src/agents/auth-profiles/display.d.ts
/** Builds the human-readable profile label used in status and auth listings. */
declare function resolveAuthProfileDisplayLabel(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  profileId: string;
}): string;
//#endregion
//#region src/agents/auth-profiles/doctor.d.ts
type FormatAuthDoctorHintParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  profileId?: string;
};
/** Formats provider-specific auth doctor guidance for a profile/store. */
declare function formatAuthDoctorHint(params: FormatAuthDoctorHintParams): Promise<string>;
//#endregion
//#region src/agents/auth-profiles/oauth.d.ts
type ResolveApiKeyForProfileResult = {
  apiKey: string;
  provider: string;
  email?: string;
  profileId: string;
  profileType: AuthProfileCredential["type"];
  credential?: AuthProfileCredential;
};
/** Detect provider errors caused by single-use OAuth refresh token races. */
type ResolveApiKeyForProfileParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  profileId: string;
  agentDir?: string;
  forceRefresh?: boolean;
};
/** Refresh one OAuth credential and merge provider-returned token fields. */
declare function refreshOAuthCredentialForRuntime(params: {
  credential: OAuthCredential;
}): Promise<OAuthCredential | null>;
/** Resolve a selected auth profile into the provider API key string. */
declare function resolveApiKeyForProfile(
  params: ResolveApiKeyForProfileParams,
): Promise<ResolveApiKeyForProfileResult | null>;
//#endregion
//#region src/agents/auth-profiles/profile-list.d.ts
/** Deduplicates profile ids while preserving first-seen order. */
declare function dedupeProfileIds(profileIds: string[]): string[];
/** Lists auth profile ids whose credential provider matches the requested provider. */
declare function listProfilesForProvider(store: AuthProfileStore, provider: string): string[];
//#endregion
//#region src/agents/auth-profiles/upsert-with-lock.d.ts
/** Upserts an auth profile under the store lock, returning null on store write failure. */
declare function upsertAuthProfileWithLock(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
}): Promise<AuthProfileStore | null>;
//#endregion
//#region src/agents/auth-profiles/profiles.d.ts
/** Sets or clears explicit auth profile order for a provider. */
declare function setAuthProfileOrder(params: {
  agentDir?: string;
  provider: string;
  order?: string[] | null;
}): Promise<AuthProfileStore | null>;
/** Upserts an auth profile immediately into the local store. */
declare function upsertAuthProfile(params: {
  profileId: string;
  credential: AuthProfileCredential;
  agentDir?: string;
}): void;
/** Removes all auth profiles and related state for a provider. */
declare function removeProviderAuthProfilesWithLock(params: {
  provider: string;
  agentDir?: string;
}): Promise<AuthProfileStore | null>;
/** Mark a profile as successfully used and update ordering/usage metadata. */
declare function markAuthProfileSuccess(params: {
  store: AuthProfileStore;
  provider: string;
  profileId: string;
  agentDir?: string;
}): Promise<void>;
//#endregion
//#region src/agents/auth-profiles/repair.d.ts
/** Suggests a modern OAuth profile id for a legacy provider:default profile. */
declare function suggestOAuthProfileIdForLegacyDefault(params: {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  legacyProfileId: string;
}): string | null;
/** Migrates config auth profile references away from a legacy OAuth default id. */
declare function repairOAuthProfileIdMismatch(params: {
  cfg: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  legacyProfileId?: string;
}): AuthProfileIdRepairResult;
//#endregion
//#region src/agents/auth-profiles/usage-state.d.ts
/**
 * Check if a profile is currently in cooldown (due to rate limits, overload, or other transient failures).
 */
declare function isProfileInCooldown(
  store: AuthProfileStore,
  profileId: string,
  now?: number,
  forModel?: string,
): boolean;
/**
 * Return the soonest `unusableUntil` timestamp (ms epoch) among the given
 * profiles, or `null` when no profile has a recorded cooldown. Note: the
 * returned timestamp may be in the past if the cooldown has already expired.
 */
declare function getSoonestCooldownExpiry(
  store: AuthProfileStore,
  profileIds: string[],
  options?: {
    now?: number;
    forModel?: string;
  },
): number | null;
/**
 * Clear expired cooldowns from all profiles in the store.
 *
 * When `cooldownUntil` or `disabledUntil` has passed, the corresponding fields
 * are removed and error counters are reset so the profile gets a fresh start
 * (circuit-breaker half-open -> closed). Without this, a stale `errorCount`
 * causes the *next* transient failure to immediately escalate to a much longer
 * cooldown -- the root cause of profiles appearing "stuck" after rate limits.
 *
 * `cooldownUntil` and `disabledUntil` are handled independently: if a profile
 * has both and only one has expired, only that field is cleared.
 *
 * Mutates the in-memory store; disk persistence happens lazily on the next
 * store write (e.g. `markAuthProfileSuccess` / `markAuthProfileFailure`), which
 * matches the existing save pattern throughout the auth-profiles module.
 *
 * @returns `true` if any profile was modified.
 */
declare function clearExpiredCooldowns(store: AuthProfileStore, now?: number): boolean;
//#endregion
//#region src/agents/auth-profiles/usage.d.ts
/**
 * Infer the most likely reason all candidate profiles are currently unavailable.
 *
 * We prefer explicit active `disabledReason` values (for example billing/auth)
 * over generic cooldown buckets, then fall back to failure-count signals.
 */
declare function resolveProfilesUnavailableReason(params: {
  store: AuthProfileStore;
  profileIds: string[];
  now?: number;
}): AuthProfileFailureReason | null;
/** Returns the regular transient-failure cooldown duration for an error count. */
declare function calculateAuthProfileCooldownMs(errorCount: number): number;
/** Resolves the display-facing unusable timestamp, honoring provider bypasses. */
declare function resolveProfileUnusableUntilForDisplay(
  store: AuthProfileStore,
  profileId: string,
): number | null;
/**
 * Mark a profile as failed for a specific reason. Billing and permanent-auth
 * failures are treated as "disabled" (longer backoff) vs the regular cooldown
 * window.
 */
declare function markAuthProfileFailure(params: {
  store: AuthProfileStore;
  profileId: string;
  reason: AuthProfileFailureReason;
  cfg?: OpenClawConfig;
  agentDir?: string;
  runId?: string;
  modelId?: string;
}): Promise<void>;
/** Marks a profile blocked until a provider-reported reset timestamp. */
declare function markAuthProfileBlockedUntil(params: {
  store: AuthProfileStore;
  profileId: string;
  blockedUntil: number;
  source: AuthProfileBlockedSource;
  agentDir?: string;
  runId?: string;
  modelId?: string;
}): Promise<void>;
/**
 * Mark a profile as transiently failed. Applies stepped backoff cooldown.
 * Cooldown times: 30s, 1min, 5min (capped).
 * Uses store lock to avoid overwriting concurrent usage updates.
 */
declare function markAuthProfileCooldown(params: {
  store: AuthProfileStore;
  profileId: string;
  agentDir?: string;
  runId?: string;
}): Promise<void>;
/**
 * Clear cooldown for a profile (e.g., manual reset).
 * Uses store lock to avoid overwriting concurrent usage updates.
 */
declare function clearAuthProfileCooldown(params: {
  store: AuthProfileStore;
  profileId: string;
  agentDir?: string;
}): Promise<void>;
//#endregion
export {
  resolveProviderAuthAliasMap as A,
  resolveAuthProfileDisplayLabel as C,
  resolveAuthProfileOrderWithMetadata as D,
  resolveAuthProfileOrder as E,
  hasUsableOAuthCredential as F,
  CLAUDE_CLI_PROFILE_ID as I,
  CODEX_CLI_PROFILE_ID as L,
  AuthCredentialReasonCode as M,
  DEFAULT_OAUTH_REFRESH_MARGIN_MS as N,
  ProviderAuthAliasLookupParams as O,
  TokenExpiryState as P,
  formatAuthDoctorHint as S,
  resolveAuthProfileEligibility as T,
  upsertAuthProfileWithLock as _,
  markAuthProfileFailure as a,
  refreshOAuthCredentialForRuntime as b,
  clearExpiredCooldowns as c,
  repairOAuthProfileIdMismatch as d,
  suggestOAuthProfileIdForLegacyDefault as f,
  upsertAuthProfile as g,
  setAuthProfileOrder as h,
  markAuthProfileCooldown as i,
  resolveProviderIdForAuth as j,
  resetProviderAuthAliasMapCacheForTest as k,
  getSoonestCooldownExpiry as l,
  removeProviderAuthProfilesWithLock as m,
  clearAuthProfileCooldown as n,
  resolveProfileUnusableUntilForDisplay as o,
  markAuthProfileSuccess as p,
  markAuthProfileBlockedUntil as r,
  resolveProfilesUnavailableReason as s,
  calculateAuthProfileCooldownMs as t,
  isProfileInCooldown as u,
  dedupeProfileIds as v,
  AuthProfileEligibilityReasonCode as w,
  resolveApiKeyForProfile as x,
  listProfilesForProvider as y,
};
