import { t as ProviderAuthEvidence } from "./provider-env-vars-D_E_Txif.js";
import { f as Model } from "./types-CqrbBnUB.js";
import { i as AuthProfileCredential, s as AuthProfileStore } from "./types-Dzb4Vh4b.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/model-auth-env.d.ts
type EnvApiKeyResult = {
  apiKey: string;
  source: string;
};
type EnvApiKeyLookupOptions = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  aliasMap?: Readonly<Record<string, string>>;
  candidateMap?: Readonly<Record<string, readonly string[]>>;
  authEvidenceMap?: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
  setupProviderFallbackRefs?: readonly string[];
  skipSetupProviderFallback?: boolean;
};
/** Resolve an API key or auth-evidence marker for a provider from environment state. */
declare function resolveEnvApiKey(
  provider: string,
  env?: NodeJS.ProcessEnv,
  options?: EnvApiKeyLookupOptions,
): EnvApiKeyResult | null;
//#endregion
//#region src/agents/model-auth-runtime-shared.d.ts
/** Resolved credential material and provenance for one provider request. */
type ResolvedProviderAuth = {
  apiKey?: string;
  profileId?: string;
  source: string;
  mode: "api-key" | "oauth" | "token" | "aws-sdk";
};
/** Stable provider auth error code used by fallback/retry paths. */
type ProviderAuthErrorCode = "missing-api-key" | "missing-provider-auth";
/** Base provider auth error with a stable code for retry/fallback logic. */
declare class ProviderAuthError extends Error {
  readonly code: ProviderAuthErrorCode;
  readonly provider: string;
  constructor(code: ProviderAuthErrorCode, provider: string, message: string);
}
/** Auth error raised when a resolved provider auth source lacks usable material. */
declare class MissingProviderAuthError extends ProviderAuthError {
  readonly mode: ResolvedProviderAuth["mode"];
  readonly source: string;
  constructor(provider: string, auth: ResolvedProviderAuth);
}
/** Narrow unknown errors to provider auth errors, optionally by code. */
declare function isProviderAuthError(
  err: unknown,
  code?: ProviderAuthErrorCode,
): err is ProviderAuthError;
/** Narrow unknown errors to missing-provider-auth failures. */
declare function isMissingProviderAuthError(err: unknown): err is MissingProviderAuthError;
/** Return the AWS credential env var that proves SDK auth is configured. */
declare function resolveAwsSdkEnvVarName(env?: NodeJS.ProcessEnv): string | undefined;
/** Format the user-facing missing-auth error from auth provenance. */
declare function formatMissingAuthError(auth: ResolvedProviderAuth, provider: string): string;
/** Require a normalized API key or throw a provider-auth error. */
declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
//#endregion
//#region src/agents/model-auth.d.ts
type ProviderCredentialPrecedence = "profile-first" | "env-first";
/** Precomputed provider-auth lookup tables reused during one runtime turn. */
type RuntimeProviderAuthLookup = {
  envApiKey: Pick<
    EnvApiKeyLookupOptions,
    "aliasMap" | "candidateMap" | "authEvidenceMap" | "skipSetupProviderFallback"
  >;
  setupProviderFallbackRefs?: readonly string[];
  syntheticAuthProviderRefs?: readonly string[];
  syntheticAuthProviderRefsComplete?: boolean;
};
/** Builds stable env/synthetic auth lookup data for repeated provider checks. */
declare function createRuntimeProviderAuthLookup(params: {
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includePluginSyntheticAuth?: boolean;
}): RuntimeProviderAuthLookup;
/** Reads a literal or env-secret marker for a custom provider entry. */
declare function getCustomProviderApiKey(
  cfg: OpenClawConfig | undefined,
  provider: string,
): string | undefined;
type ResolvedCustomProviderApiKey = {
  apiKey: string;
  source: string;
};
/** Resolves custom provider API keys that are usable without mutating secret stores. */
declare function resolveUsableCustomProviderApiKey(params: {
  cfg: OpenClawConfig | undefined;
  provider: string;
  env?: NodeJS.ProcessEnv;
  secretSentinels?: boolean;
}): ResolvedCustomProviderApiKey | null;
/** True when a custom provider has a literal/env/local key available now. */
declare function hasUsableCustomProviderApiKey(
  cfg: OpenClawConfig | undefined,
  provider: string,
  env?: NodeJS.ProcessEnv,
): boolean;
/** True when explicit provider config should outrank profile/environment auth. */
declare function shouldPreferExplicitConfigApiKeyAuth(
  cfg: OpenClawConfig | undefined,
  provider: string,
): boolean;
type ProviderEntryApiKeyProfileReference =
  | {
      kind: "none";
    }
  | {
      kind: "literal";
      apiKey: string;
      source: string;
    }
  | {
      kind: "profile";
      profileId: string;
      credential: AuthProfileCredential;
      mode: ResolvedProviderAuth["mode"];
    }
  | {
      kind: "profile-incompatible";
      profileId: string;
      credentialProvider: string;
      credentialType: AuthProfileCredential["type"];
      reason: "credential-class" | "provider-binding";
    }
  | {
      kind: "marker";
    };
type ProviderEntryApiKeyBindingResolution =
  | {
      kind: "none";
    }
  | {
      kind: "literal";
      apiKey: string;
      source: string;
    }
  | {
      kind: "profile-resolved";
      auth: ResolvedProviderAuth;
    }
  | {
      kind: "profile-incompatible";
      profileId: string;
      credentialProvider: string;
      credentialType: AuthProfileCredential["type"];
      reason: "credential-class" | "provider-binding";
    }
  | {
      kind: "profile-unresolved";
      profileId: string;
      error?: unknown;
    };
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
declare function canUseProfileAsProviderEntryApiKey(params: {
  cfg?: OpenClawConfig;
  provider: string;
  credential: AuthProfileCredential;
}): boolean;
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
declare function resolveProviderEntryApiKeyProfileReference(params: {
  cfg?: OpenClawConfig;
  provider: string;
  store: AuthProfileStore;
}): ProviderEntryApiKeyProfileReference;
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
declare function resolveProviderEntryApiKeyBinding(params: {
  cfg?: OpenClawConfig;
  provider: string;
  store: AuthProfileStore;
  agentDir?: string;
  secretSentinels?: boolean;
}): Promise<ProviderEntryApiKeyBindingResolution>;
/** True when a custom local provider can use a synthetic no-auth placeholder. */
declare function hasSyntheticLocalProviderAuthConfig(params: {
  cfg: OpenClawConfig | undefined;
  provider: string;
}): boolean;
/** Fast auth-availability check for runtime provider/model selection. */
declare function hasRuntimeAvailableProviderAuth(params: {
  provider: string;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  allowPluginSyntheticAuth?: boolean;
  runtimeLookup?: RuntimeProviderAuthLookup;
  modelApi?: string;
}): boolean;
/** Resolves the credential that should be used for one provider request. */
declare function resolveApiKeyForProvider(params: {
  provider: string;
  cfg?: OpenClawConfig;
  profileId?: string;
  preferredProfile?: string;
  store?: AuthProfileStore;
  agentDir?: string;
  workspaceDir?: string;
  /** When true, treat profileId as a user-locked selection that must not be
   *  silently overridden by env/config credentials. */
  lockedProfile?: boolean;
  forceRefresh?: boolean;
  credentialPrecedence?: ProviderCredentialPrecedence /** Skip implicit profile discovery for a prepared env/config fallback attempt. */;
  allowAuthProfileFallback?: boolean /** Skip plugin setup fallback when the prepared route already excludes it. */;
  skipSetupProviderFallback?: boolean;
  modelId?: string;
  modelApi?: string /** Keep SecretRef-backed model credentials opaque until a sentinel-aware transport boundary. */;
  secretSentinels?: boolean;
}): Promise<ResolvedProviderAuth>;
type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
declare function resolveModelAuthMode(
  provider?: string,
  cfg?: OpenClawConfig,
  store?: AuthProfileStore,
  options?: {
    workspaceDir?: string;
  },
): ModelAuthMode | undefined;
/** Checks provider auth availability, including profile fallback order. */
declare function hasAvailableAuthForProvider(params: {
  provider: string;
  cfg?: OpenClawConfig;
  preferredProfile?: string;
  store?: AuthProfileStore;
  agentDir?: string;
  workspaceDir?: string;
  modelId?: string;
  modelApi?: string;
}): Promise<boolean>;
/** Resolves request credentials from the provider attached to a model descriptor. */
declare function getApiKeyForModel(params: {
  model: Model;
  cfg?: OpenClawConfig;
  profileId?: string;
  preferredProfile?: string;
  store?: AuthProfileStore;
  agentDir?: string;
  workspaceDir?: string;
  lockedProfile?: boolean;
  credentialPrecedence?: ProviderCredentialPrecedence;
  allowAuthProfileFallback?: boolean;
  skipSetupProviderFallback?: boolean;
  secretSentinels?: boolean;
}): Promise<ResolvedProviderAuth>;
/** Clears auth for local OpenAI-compatible servers that explicitly use no auth. */
declare function applyLocalNoAuthHeaderOverride<T extends Model>(
  model: T,
  auth: ResolvedProviderAuth | null | undefined,
): T;
declare function applySecretRefHeaderSentinels<T extends Model>(
  model: T,
  cfg: OpenClawConfig | undefined,
): T;
/**
 * When the provider config sets `authHeader: true`, inject an explicit
 * `Authorization: Bearer <apiKey>` header into the model so downstream SDKs
 * (e.g. `@google/genai`) send credentials via the standard HTTP Authorization
 * header instead of vendor-specific headers like `x-goog-api-key`.
 *
 * This is a no-op when `authHeader` is not `true`, when no API key is
 * available, or when the API key is a synthetic marker (e.g. local-server
 * placeholders) rather than a real credential.
 */
declare function applyAuthHeaderOverride<T extends Model>(
  model: T,
  auth: ResolvedProviderAuth | null | undefined,
  cfg: OpenClawConfig | undefined,
): T;
//#endregion
export {
  EnvApiKeyResult as A,
  ProviderAuthError as C,
  isProviderAuthError as D,
  isMissingProviderAuthError as E,
  requireApiKey as O,
  MissingProviderAuthError as S,
  formatMissingAuthError as T,
  resolveModelAuthMode as _,
  applyAuthHeaderOverride as a,
  resolveUsableCustomProviderApiKey as b,
  canUseProfileAsProviderEntryApiKey as c,
  getCustomProviderApiKey as d,
  hasAvailableAuthForProvider as f,
  resolveApiKeyForProvider as g,
  hasUsableCustomProviderApiKey as h,
  RuntimeProviderAuthLookup as i,
  resolveEnvApiKey as j,
  resolveAwsSdkEnvVarName as k,
  createRuntimeProviderAuthLookup as l,
  hasSyntheticLocalProviderAuthConfig as m,
  ProviderCredentialPrecedence as n,
  applyLocalNoAuthHeaderOverride as o,
  hasRuntimeAvailableProviderAuth as p,
  ProviderEntryApiKeyBindingResolution as r,
  applySecretRefHeaderSentinels as s,
  ModelAuthMode as t,
  getApiKeyForModel as u,
  resolveProviderEntryApiKeyBinding as v,
  ResolvedProviderAuth as w,
  shouldPreferExplicitConfigApiKeyAuth as x,
  resolveProviderEntryApiKeyProfileReference as y,
};
