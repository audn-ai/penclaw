import { r as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-D2RPlnfc.js";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-UWRY5bYu.js";
import { t as createVpsAwareOAuthHandlers } from "./provider-oauth-flow-CKUkw2zL.js";
//#region src/plugins/provider-openai-chatgpt-oauth.ts
const OPENAI_CODEX_PROVIDER_ID = "openai";
const OPENAI_CODEX_OAUTH_METHOD_ID = "oauth";
function loadOpenAICodexOAuthFacade() {
  return loadActivatedBundledPluginPublicSurfaceModuleSync({
    dirName: "openai",
    artifactBasename: "api.js",
  });
}
function isOAuthCredential(value) {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return (
    record.type === "oauth" &&
    record.provider === OPENAI_CODEX_PROVIDER_ID &&
    typeof record.access === "string" &&
    typeof record.refresh === "string" &&
    typeof record.expires === "number"
  );
}
/** @deprecated OpenAI Codex OAuth is owned by the OpenAI plugin auth hook. */
async function loginOpenAICodexOAuth(params) {
  const oauthHandlers = { createVpsAwareHandlers: createVpsAwareOAuthHandlers };
  const oauth = resolveProviderRuntimePlugin({
    provider: OPENAI_CODEX_PROVIDER_ID,
    config: {},
    bundledProviderVitestCompat: true,
  })?.auth?.find((method) => method.id === OPENAI_CODEX_OAUTH_METHOD_ID);
  if (!oauth)
    return await loadOpenAICodexOAuthFacade().loginOpenAICodexOAuth({
      ...params,
      oauth: oauthHandlers,
    });
  const context = {
    config: {},
    prompter: params.prompter,
    runtime: params.runtime,
    isRemote: params.isRemote,
    openUrl: params.openUrl,
    signal: params.signal,
    onManualCodeInput: params.onManualCodeInput,
    oauth: oauthHandlers,
  };
  const credential = (await oauth.run(context)).profiles[0]?.credential;
  return isOAuthCredential(credential) ? credential : null;
}
//#endregion
export { loginOpenAICodexOAuth as t };
