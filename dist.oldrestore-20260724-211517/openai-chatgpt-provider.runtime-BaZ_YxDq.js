import { r as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime.js";
import "./runtime-env-D0V-7Gqz.js";
import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-BoVfmODy.js";
//#region extensions/openai/openai-chatgpt-provider.runtime.ts
function createOpenAICodexProviderRuntime(deps) {
  return {
    async getOAuthApiKey(...args) {
      deps.ensureGlobalUndiciEnvProxyDispatcher();
      return await deps.getOAuthApiKey(...args);
    },
    async refreshOpenAICodexToken(...args) {
      deps.ensureGlobalUndiciEnvProxyDispatcher();
      return await deps.refreshOpenAICodexToken(...args);
    },
  };
}
const runtime = createOpenAICodexProviderRuntime({
  ensureGlobalUndiciEnvProxyDispatcher,
  getOAuthApiKey: getOpenAICodexOAuthApiKey,
  refreshOpenAICodexToken: refreshOpenAICodexToken$1,
});
async function getOAuthApiKey(...args) {
  return await runtime.getOAuthApiKey(...args);
}
async function refreshOpenAICodexToken(...args) {
  return await runtime.refreshOpenAICodexToken(...args);
}
async function getOpenAICodexOAuthApiKey(providerId, credentials) {
  if (providerId !== "openai") throw new Error(`Unknown OAuth provider: ${providerId}`);
  let creds = credentials[providerId];
  if (!creds) return null;
  if (Date.now() >= creds.expires) creds = await refreshOpenAICodexToken$1(creds.refresh);
  return {
    newCredentials: creds,
    apiKey: creds.access,
  };
}
//#endregion
export { getOAuthApiKey as n, refreshOpenAICodexToken as r, createOpenAICodexProviderRuntime as t };
