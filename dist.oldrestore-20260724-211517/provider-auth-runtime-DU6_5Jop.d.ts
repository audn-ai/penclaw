import { g as resolveApiKeyForProvider$1 } from "./model-auth-DQnRyl6R.js";
import { n as TransientProviderRetryConfig } from "./operation-retry-x92MYk0c.js";
import { f as Model } from "./types-CqrbBnUB.js";
import { zl as ResolvedProviderRuntimeAuth } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugins/runtime/runtime-model-auth.runtime.d.ts
/**
 * Resolve request-ready auth for a runtime model, applying any provider-owned
 * `prepareRuntimeAuth` exchange on top of the standard credential lookup.
 */
declare function getRuntimeAuthForModel$1(params: {
  model: Model;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
}): Promise<ResolvedProviderRuntimeAuth>;
//#endregion
//#region src/agents/api-key-rotation.d.ts
type ApiKeyRetryParams = {
  apiKey: string;
  error: unknown;
  attempt: number;
};
type ExecuteWithApiKeyRotationOptions<T> = {
  provider: string;
  apiKeys: string[];
  execute: (apiKey: string) => Promise<T>;
  shouldRetry?: (
    params: ApiKeyRetryParams & {
      message: string;
    },
  ) => boolean;
  onRetry?: (
    params: ApiKeyRetryParams & {
      message: string;
    },
  ) => void;
  transientRetry?: TransientProviderRetryConfig;
};
/** Collect primary and live-discovered provider keys in stable de-duped order. */
declare function collectProviderApiKeysForExecution(params: {
  provider: string;
  primaryApiKey?: string;
}): string[];
/**
 * Execute a provider operation with key rotation and optional same-key transient
 * retries.
 */
declare function executeWithApiKeyRotation<T>(
  params: ExecuteWithApiKeyRotationOptions<T>,
): Promise<T>;
//#endregion
//#region src/plugin-sdk/provider-auth-runtime.d.ts
/**
 * OAuth authorization code and state captured by the local callback listener.
 */
type OAuthCallbackResult = {
  /** Authorization code returned by the OAuth provider callback. */ code: string /** State value returned by the callback and validated against the expected state. */;
  state: string;
};
/**
 * Non-secret auth profile metadata used by provider discovery helpers.
 */
type ProviderAuthProfileMetadata = {
  profileId?: string;
  accountId?: string;
};
declare function resolveProviderAuthProfileMetadata(params: {
  provider: string;
  cfg?: OpenClawConfig;
  profileId?: string;
  agentDir?: string;
}): ProviderAuthProfileMetadata;
declare function buildOAuthCallbackOriginResolver(
  /** HTTPS IdP hosts allowed to receive a CORS echo from the loopback callback. */

  allowedHosts: readonly string[] | undefined,
): (originHeader: string | string[] | undefined) => string | undefined;
/**
 * Generates a high-entropy OAuth state token for local callback validation.
 */
declare function generateOAuthState(): string;
/**
 * Parses a pasted OAuth redirect URL into callback code/state fields.
 */
declare function parseOAuthCallbackInput(
  /** Full redirect URL pasted by the operator after manual OAuth completion. */

  input: string,
  messages?: {
    /** Override for URLs that omit the state query parameter. */ missingState?: string /** Override for values that are not parseable redirect URLs. */;
    invalidInput?: string;
  },
):
  | OAuthCallbackResult
  | {
      error: string;
    };
/**
 * Starts a temporary loopback HTTP listener and waits for a validated OAuth callback.
 */
declare function waitForLocalOAuthCallback(params: {
  /** State token that the callback must echo before the listener resolves. */ expectedState: string /** Maximum wait time before the listener rejects. */;
  timeoutMs: number /** Loopback port to bind for the temporary callback server. */;
  port: number /** URL path accepted as the OAuth callback endpoint. */;
  callbackPath: string /** Redirect URI shown in progress messages and provider setup flows. */;
  redirectUri: string /** HTML success heading rendered after a valid callback. */;
  successTitle: string /** Optional progress message emitted once the listener starts. */;
  progressMessage?: string /** Loopback hostname to bind; defaults to localhost. */;
  hostname?: string /** Progress callback invoked after the server begins listening. */;
  onProgress?: (
    message: string,
  ) => void /** Stops and closes the callback listener when the owning login is cancelled. */;
  signal?: AbortSignal;
  /**
   * IdP hosts allowed to receive CORS echo on loopback callback preflights.
   */
  corsOriginAllowlist?: readonly string[];
}): Promise<OAuthCallbackResult>;
type ResolveApiKeyForProvider = typeof resolveApiKeyForProvider$1;
type GetRuntimeAuthForModel = typeof getRuntimeAuthForModel$1;
/**
 * Resolves provider API-key auth through the runtime auth module when available.
 */
declare function resolveApiKeyForProvider(
  /** Provider auth lookup params forwarded to the runtime auth module. */

  params: Parameters<ResolveApiKeyForProvider>[0],
): Promise<Awaited<ReturnType<ResolveApiKeyForProvider>>>;
/**
 * Resolves the prepared runtime auth payload for a concrete model request.
 */
declare function getRuntimeAuthForModel(
  /** Concrete model auth request forwarded to the runtime auth module. */

  params: Parameters<GetRuntimeAuthForModel>[0],
): Promise<Awaited<ReturnType<GetRuntimeAuthForModel>>>;
//#endregion
export {
  getRuntimeAuthForModel as a,
  resolveProviderAuthProfileMetadata as c,
  executeWithApiKeyRotation as d,
  generateOAuthState as i,
  waitForLocalOAuthCallback as l,
  ProviderAuthProfileMetadata as n,
  parseOAuthCallbackInput as o,
  buildOAuthCallbackOriginResolver as r,
  resolveApiKeyForProvider as s,
  OAuthCallbackResult as t,
  collectProviderApiKeysForExecution as u,
};
