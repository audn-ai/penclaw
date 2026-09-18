import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { h as SecretRef } from "./types.secrets-C15Z_eLX.js";

//#region src/agents/auth-profiles/legacy-oauth-ref.d.ts
/** Legacy OAuth ref source persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_SOURCE = "openclaw-credentials";
/** Legacy OAuth ref provider persisted by older credential stores. */
declare const LEGACY_OAUTH_REF_PROVIDER = "openai-codex";
type LegacyOAuthRef = {
  source: typeof LEGACY_OAUTH_REF_SOURCE;
  provider: typeof LEGACY_OAUTH_REF_PROVIDER;
  id: string;
};
//#endregion
//#region src/agents/auth-profiles/types.d.ts
/** Provider identifier recorded on auth profile credentials. */
type OAuthProvider = string;
/** Refreshable OAuth credential fields persisted for provider auth profiles. */
type OAuthCredentials = {
  access: string;
  refresh: string;
  expires: number;
  provider?: OAuthProvider;
  email?: string;
  enterpriseUrl?: string;
  projectId?: string;
  accountId?: string;
  chatgptPlanType?: string /** Non-secret subscription plan captured from external CLI logins (e.g. "max"). */;
  subscriptionType?: string /** Non-secret rate-limit tier captured from external CLI logins (e.g. "default_max_20x"). */;
  rateLimitTier?: string;
  idToken?: string;
};
/** API-key credential with optional secret reference indirection. */
type ApiKeyCredential = {
  type: "api_key";
  provider: string;
  key?: string;
  keyRef?: SecretRef /** Explicit opt-out for copying this profile when creating another agent. */;
  copyToAgents?: boolean;
  email?: string;
  displayName?: string /** Optional provider-specific metadata (e.g., account IDs, gateway IDs). */;
  metadata?: Record<string, string>;
};
/** Static token credential that OpenClaw does not refresh. */
type TokenCredential = {
  /**
   * Static bearer-style token (often OAuth access token / PAT).
   * Not refreshable by OpenClaw (unlike `type: "oauth"`).
   */
  type: "token";
  provider: string;
  token?: string;
  tokenRef?: SecretRef /** Explicit opt-out for copying this profile when creating another agent. */;
  copyToAgents?: boolean /** Optional expiry timestamp (ms since epoch). */;
  expires?: number;
  email?: string;
  displayName?: string;
};
/** Refreshable OAuth credential plus provider metadata and legacy references. */
type OAuthCredential = OAuthCredentials & {
  type: "oauth";
  provider: string;
  oauthRef?: LegacyOAuthRef;
  clientId?: string;
  /**
   * OAuth refresh tokens are not portable by default. Provider-owned flows may
   * set this only when copying refresh material across agents is known safe.
   */
  copyToAgents?: boolean;
  email?: string;
  displayName?: string;
};
/** Credential variants supported by auth profiles. */
type AuthProfileCredential = ApiKeyCredential | TokenCredential | OAuthCredential;
/** Closed reasons that drive cooldown, disable, and failure counters. */
type AuthProfileFailureReason =
  | "auth"
  | "auth_permanent"
  | "format"
  | "overloaded"
  | "rate_limit"
  | "billing"
  | "timeout"
  | "model_not_found"
  | "session_expired"
  | "empty_response"
  | "no_error_details"
  | "unclassified"
  | "unknown";
/** Profile-wide blocked reason reported by provider usage probes. */
type AuthProfileBlockedReason = "subscription_limit";
/** Source that marked a profile as blocked. */
type AuthProfileBlockedSource = "codex_rate_limits" | "wham";
/** Per-profile usage statistics for round-robin and cooldown tracking */
type ProfileUsageStats = {
  lastUsed?: number;
  blockedUntil?: number;
  blockedReason?: AuthProfileBlockedReason;
  blockedSource?: AuthProfileBlockedSource;
  blockedModel?: string;
  cooldownUntil?: number;
  cooldownReason?: AuthProfileFailureReason;
  cooldownModel?: string;
  disabledUntil?: number;
  disabledReason?: AuthProfileFailureReason;
  errorCount?: number;
  failureCounts?: Partial<Record<AuthProfileFailureReason, number>>;
  lastFailureAt?: number;
};
/** Durable, non-secret auth profile selection state. */
type AuthProfileState = {
  /**
   * Optional per-agent preferred profile order overrides.
   * This lets you lock/override auth rotation for a specific agent without
   * changing the global config.
   */
  order?: Record<string, string[]>;
  lastGood?: Record<string, string> /** Usage statistics per profile for round-robin rotation */;
  usageStats?: Record<string, ProfileUsageStats>;
};
/** Persisted credential payload without runtime-only selection state. */
type AuthProfileSecretsStore = {
  version: number;
  profiles: Record<string, AuthProfileCredential>;
};
/** Effective in-memory auth store combining credentials, state, and overlays. */
type AuthProfileStore = AuthProfileSecretsStore &
  AuthProfileState & {
    /** Runtime-only provenance for credentials cloned from persisted auth stores. */ runtimePersistedProfileIds?: string[] /** Runtime-only provenance for external OAuth profiles overlaid onto this store. */;
    runtimeExternalProfileIds?: string[] /** True when the runtime external profile set was freshly resolved, even if empty. */;
    runtimeExternalProfileIdsAuthoritative?: boolean;
  };
/** Result returned by config/store auth profile id repair. */
type AuthProfileIdRepairResult = {
  config: OpenClawConfig;
  changes: string[];
  migrated: boolean;
  fromProfileId?: string;
  toProfileId?: string;
};
//#endregion
export {
  AuthProfileFailureReason as a,
  OAuthCredential as c,
  TokenCredential as d,
  AuthProfileCredential as i,
  OAuthProvider as l,
  AuthProfileBlockedReason as n,
  AuthProfileIdRepairResult as o,
  AuthProfileBlockedSource as r,
  AuthProfileStore as s,
  ApiKeyCredential as t,
  ProfileUsageStats as u,
};
