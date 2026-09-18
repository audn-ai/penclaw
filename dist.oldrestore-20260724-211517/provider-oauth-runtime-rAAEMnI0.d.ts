import { f as Model } from "./types-CqrbBnUB.js";

//#region src/plugin-sdk/provider-oauth-runtime.d.ts
/** Normalized OAuth credential bundle persisted by provider auth profiles. */
type OAuthCredentials = {
  /** Refresh token or provider-equivalent long-lived credential. */ refresh: string /** Access token or provider-equivalent bearer credential. */;
  access: string /** Absolute epoch milliseconds when the access token should be considered expired. */;
  expires: number;
  [key: string]: unknown;
};
/** Stable provider id used by OAuth credential and config routing. */
type OAuthProviderId = string;
/** @deprecated Use OAuthProviderId instead. */
type OAuthProvider = OAuthProviderId;
/** Manual input prompt shown during OAuth login flows. */
type OAuthPrompt = {
  /** Prompt text shown to the operator. */ message: string /** Optional placeholder for manual text entry. */;
  placeholder?: string /** Whether empty input should be accepted instead of reprompting. */;
  allowEmpty?: boolean;
};
/** Parsed OAuth callback/code input accepted by manual and callback-server flows. */
type OAuthAuthorizationInput = {
  /** Authorization code parsed from a callback URL, query string, or pasted code. */ code?: string /** Optional OAuth state parsed from callback URL, query string, or `code#state` input. */;
  state?: string;
};
/** Authorization URL and optional instructions shown before OAuth completion. */
type OAuthAuthInfo = {
  /** Provider authorization URL shown to the user. */ url: string /** Optional provider-specific instruction text for manual flows. */;
  instructions?: string;
};
/** One selectable OAuth login option. */
type OAuthSelectOption = {
  /** Stable option id returned when the operator selects this entry. */ id: string /** Human-readable option label shown in the selector. */;
  label: string;
};
/** Selector prompt used when a provider offers multiple OAuth login choices. */
type OAuthSelectPrompt = {
  /** Prompt text shown above the selectable options. */ message: string /** Options available for the operator to choose from. */;
  options: OAuthSelectOption[];
};
/** UI/runtime callbacks used by provider OAuth login implementations. */
interface OAuthLoginCallbacks {
  /** Emits authorization URL/instructions to the UI before waiting for completion. */
  onAuth: (info: OAuthAuthInfo) => void;
  /** Prompts for manual input such as pasted callback URLs or authorization codes. */
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  /** Reports human-readable login progress without exposing secrets. */
  onProgress?: (message: string) => void;
  /** Optional direct manual-code entry hook used when callback-server flows cannot complete. */
  onManualCodeInput?: () => Promise<string>;
  /** Show an interactive selector and return the selected option id, or undefined on cancel. */
  onSelect?: (prompt: OAuthSelectPrompt) => Promise<string | undefined>;
  /** Cancels pending OAuth waits and prompts when aborted. */
  signal?: AbortSignal;
}
/** Provider OAuth contract implemented by provider plugins. */
interface OAuthProviderInterface {
  /** Stable provider id used for credential and config routing. */
  readonly id: OAuthProviderId;
  /** Human-readable provider name shown in login flows. */
  readonly name: string;
  /** Run the login flow and return credentials to persist. */
  login(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>;
  /** Whether login uses a local callback server and supports manual code input. */
  usesCallbackServer?: boolean;
  /** Refresh expired credentials and return updated credentials to persist. */
  refreshToken(credentials: OAuthCredentials): Promise<OAuthCredentials>;
  /** Convert credentials to an API key string for the provider. */
  getApiKey(credentials: OAuthCredentials): string;
  /** Optionally adjust models for this provider, such as updating baseUrl. */
  modifyModels?(models: Model[], credentials: OAuthCredentials): Model[];
}
/** @deprecated Use OAuthProviderInterface instead. */
interface OAuthProviderInfo {
  /** Stable provider id used for credential and config routing. */
  id: OAuthProviderId;
  /** Human-readable provider name shown in login flows. */
  name: string;
  /** Whether this provider can currently start OAuth login. */
  available: boolean;
}
/**
 * Renders the local OAuth callback success page after provider authentication completes.
 */
declare function oauthSuccessHtml(
  /** Success message rendered in the local OAuth completion page. */

  message: string,
): string;
/**
 * Renders the local OAuth callback error page without exposing raw credential material.
 */
declare function oauthErrorHtml(
  /** Error message rendered in the local OAuth completion page. */

  message: string /** Optional provider-specific error details rendered below the message. */,

  details?: string,
): string;
/** Generates an OAuth PKCE verifier and SHA-256 challenge using base64url encoding. */
declare function generatePKCE(): Promise<{
  verifier: string;
  challenge: string;
}>;
/** Generates a random base64url OAuth state value for CSRF protection. */
declare function generateOAuthState(): string;
/**
 * Parses callback URLs, raw query strings, `code#state`, or plain pasted codes.
 * Empty input returns an empty object so callers can keep prompting.
 */
declare function parseOAuthAuthorizationInput(
  /** Raw callback URL, query string, `code#state`, or pasted code. */

  input: string,
): OAuthAuthorizationInput;
/** Converts provider `expires_in` seconds into safe positive milliseconds. */
declare function resolveOAuthTokenLifetimeMs(
  /** Provider `expires_in` value in seconds. */

  value: unknown,
): number | undefined;
/** Resolves provider token lifetime into an absolute expiry timestamp with optional refresh skew. */
declare function resolveOAuthTokenExpiresAt(
  /** Provider `expires_in` value in seconds. */

  value: unknown,
  options?: {
    /** Current timestamp override for deterministic expiry calculations. */ nowMs?: number /** Milliseconds to subtract so refresh happens before provider expiry. */;
    refreshSkewMs?: number;
  },
): number | undefined;
/**
 * Creates the shared cancellation error used by abortable OAuth login flows.
 */
declare function createOAuthLoginCancelledError(): Error;
/** Throws the shared OAuth cancellation error when a login signal is already aborted. */
declare function throwIfOAuthLoginAborted(
  /** Abort signal attached to the OAuth login flow. */

  signal?: AbortSignal,
): void;
/** Races a pending OAuth login step against the login abort signal and normalizes rejections. */
declare function withOAuthLoginAbort<T>(
  /** Pending OAuth login operation to race against abort. */

  promise: Promise<T> /** Abort signal attached to the OAuth login flow. */,

  signal?: AbortSignal /** Optional cleanup hook called when the login is aborted. */,

  onAbort?: () => void,
): Promise<T>;
/** Combines a caller abort signal with a bounded timeout signal for OAuth HTTP requests. */
declare function buildOAuthRequestSignal(options: {
  /** Optional caller-provided signal to combine with the timeout signal. */ signal?: AbortSignal /** Request timeout in milliseconds before the generated signal aborts. */;
  timeoutMs: number;
}): AbortSignal;
//#endregion
export {
  withOAuthLoginAbort as S,
  oauthSuccessHtml as _,
  OAuthPrompt as a,
  resolveOAuthTokenLifetimeMs as b,
  OAuthProviderInfo as c,
  OAuthSelectPrompt as d,
  buildOAuthRequestSignal as f,
  oauthErrorHtml as g,
  generatePKCE as h,
  OAuthLoginCallbacks as i,
  OAuthProviderInterface as l,
  generateOAuthState as m,
  OAuthAuthorizationInput as n,
  OAuthProvider as o,
  createOAuthLoginCancelledError as p,
  OAuthCredentials as r,
  OAuthProviderId as s,
  OAuthAuthInfo as t,
  OAuthSelectOption as u,
  parseOAuthAuthorizationInput as v,
  throwIfOAuthLoginAborted as x,
  resolveOAuthTokenExpiresAt as y,
};
