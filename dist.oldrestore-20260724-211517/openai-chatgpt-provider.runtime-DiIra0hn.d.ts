import { r as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime-BDQLexAD.js";
import { r as OAuthCredentials } from "./provider-oauth-runtime-rAAEMnI0.js";
import { c as ensureGlobalUndiciEnvProxyDispatcher } from "./wsl-DTG0LfAO.js";

//#region extensions/openai/openai-chatgpt-provider.runtime.d.ts
type OpenAICodexProviderRuntimeDeps = {
  ensureGlobalUndiciEnvProxyDispatcher: typeof ensureGlobalUndiciEnvProxyDispatcher;
  getOAuthApiKey: typeof getOpenAICodexOAuthApiKey;
  refreshOpenAICodexToken: typeof refreshOpenAICodexToken$1;
};
declare function createOpenAICodexProviderRuntime(deps: OpenAICodexProviderRuntimeDeps): {
  getOAuthApiKey: typeof getOAuthApiKey;
  refreshOpenAICodexToken: typeof refreshOpenAICodexToken;
};
declare function getOAuthApiKey(
  ...args: Parameters<typeof getOpenAICodexOAuthApiKey>
): Promise<Awaited<ReturnType<typeof getOpenAICodexOAuthApiKey>>>;
declare function refreshOpenAICodexToken(
  ...args: Parameters<typeof refreshOpenAICodexToken$1>
): Promise<Awaited<ReturnType<typeof refreshOpenAICodexToken$1>>>;
declare function getOpenAICodexOAuthApiKey(
  providerId: string,
  credentials: Record<string, OAuthCredentials>,
): Promise<{
  newCredentials: OAuthCredentials;
  apiKey: string;
} | null>;
//#endregion
export { getOAuthApiKey as n, refreshOpenAICodexToken as r, createOpenAICodexProviderRuntime as t };
