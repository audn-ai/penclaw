import {
  a as OAuthPrompt,
  l as OAuthProviderInterface,
  r as OAuthCredentials,
} from "./provider-oauth-runtime-rAAEMnI0.js";
//#region extensions/openai/openai-chatgpt-oauth-flow.runtime.d.ts
type TokenSuccess = {
  type: "success";
  access: string;
  refresh: string;
  expires: number;
};
type TokenFailure = {
  type: "failed";
  message: string;
  status?: number;
};
type TokenResult = TokenSuccess | TokenFailure;
type TokenRequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
};
declare function resolveCallbackHost(env?: NodeJS.ProcessEnv): string;
declare function resolveRedirectUri(host?: string): string;
declare function exchangeAuthorizationCode(
  code: string,
  verifier: string,
  redirectUri?: string,
  options?: TokenRequestOptions,
): Promise<TokenResult>;
declare function refreshAccessToken(
  refreshToken: string,
  options?: TokenRequestOptions,
): Promise<TokenResult>;
declare function createAuthorizationFlow(originator?: string): Promise<{
  verifier: string;
  redirectUri: string;
  state: string;
  url: string;
}>;
/**
 * Login with OpenAI Codex OAuth
 *
 * @param options.onAuth - Called with URL and instructions when auth starts
 * @param options.onPrompt - Called to prompt user for manual code paste (fallback if no onManualCodeInput)
 * @param options.onProgress - Optional progress messages
 * @param options.onManualCodeInput - Optional promise that resolves with user-pasted code.
 *                                    Races with browser callback - whichever completes first wins.
 *                                    Useful for showing paste input immediately alongside browser flow.
 * @param options.originator - OAuth originator parameter (defaults to "openclaw")
 */
declare function loginOpenAICodex(options: {
  onAuth: (info: { url: string; instructions?: string }) => Promise<void> | void;
  onPrompt: (prompt: OAuthPrompt) => Promise<string>;
  onProgress?: (message: string) => void;
  onManualCodeInput?: () => Promise<string>;
  originator?: string;
  signal?: AbortSignal;
}): Promise<OAuthCredentials>;
/**
 * Refresh OpenAI Codex OAuth token
 */
declare function refreshOpenAICodexToken(refreshToken: string): Promise<OAuthCredentials>;
declare const openaiCodexOAuthProvider: OAuthProviderInterface;
declare const testing: {
  callbackHost: string;
  createAuthorizationFlow: typeof createAuthorizationFlow;
  exchangeAuthorizationCode: typeof exchangeAuthorizationCode;
  loginOpenAICodex: typeof loginOpenAICodex;
  refreshAccessToken: typeof refreshAccessToken;
  resolveCallbackHost: typeof resolveCallbackHost;
  resolveRedirectUri: typeof resolveRedirectUri;
};
//#endregion
export {
  testing as i,
  openaiCodexOAuthProvider as n,
  refreshOpenAICodexToken as r,
  loginOpenAICodex as t,
};
