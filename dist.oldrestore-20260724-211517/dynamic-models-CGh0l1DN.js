import { t as resolveFirstGithubToken } from "./auth-C1hKAo6B.js";
import { n as resolveGithubCopilotDomain } from "./domain-D8-95X4Y.js";
import {
  n as fetchCopilotModelCatalog,
  r as resolveCopilotForwardCompatModel,
  t as PROVIDER_ID,
} from "./models-gdqXT4QH.js";
import { i as getCachedLiveCatalogValue } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/github-copilot/dynamic-models.ts
function dynamicModelScope(profileId, authProfileMode) {
  const normalizedProfileId = profileId?.trim();
  return normalizedProfileId
    ? `profile:${normalizedProfileId}`
    : authProfileMode
      ? `direct:${authProfileMode}`
      : "unscoped";
}
async function loadGithubCopilotRuntime() {
  return await import("./extensions/github-copilot/register.runtime.js");
}
function createGithubCopilotDynamicModelHooks(params) {
  const preparedDynamicModels = /* @__PURE__ */ new WeakMap();
  async function resolveCatalog(ctx) {
    if (!params.discoveryEnabled(ctx.config)) return null;
    const { DEFAULT_COPILOT_API_BASE_URL, resolveCopilotApiToken } =
      await loadGithubCopilotRuntime();
    const { githubToken, hasProfile } = await resolveFirstGithubToken({
      agentDir: ctx.agentDir,
      env: ctx.env,
      ...(ctx.config ? { config: ctx.config } : {}),
      ...(ctx.profileId ? { profileId: ctx.profileId } : {}),
      ...(ctx.authProfileMode ? { authProfileMode: ctx.authProfileMode } : {}),
    });
    if (!hasProfile && !githubToken) return null;
    let baseUrl = DEFAULT_COPILOT_API_BASE_URL;
    let copilotApiToken;
    if (githubToken)
      try {
        const token = await resolveCopilotApiToken({
          githubToken,
          env: ctx.env,
          githubDomain: resolveGithubCopilotDomain({
            env: ctx.env,
            config: ctx.config,
          }),
        });
        baseUrl = token.baseUrl;
        copilotApiToken = token.token;
      } catch {
        baseUrl = DEFAULT_COPILOT_API_BASE_URL;
      }
    let discoveredModels = [];
    if (copilotApiToken)
      try {
        discoveredModels = await getCachedLiveCatalogValue({
          keyParts: [PROVIDER_ID, "models", baseUrl, copilotApiToken],
          load: async () =>
            await fetchCopilotModelCatalog({
              copilotApiToken,
              baseUrl,
            }),
        });
      } catch {
        discoveredModels = [];
      }
    return {
      baseUrl,
      models: discoveredModels,
    };
  }
  async function runCatalog(ctx) {
    const catalog = await resolveCatalog(ctx);
    return catalog ? { provider: catalog } : null;
  }
  async function prepareDynamicModel(ctx) {
    const catalog = await resolveCatalog({
      agentDir: ctx.agentDir,
      env: process.env,
      ...(ctx.config ? { config: ctx.config } : {}),
      ...(ctx.authProfileId ? { profileId: ctx.authProfileId } : {}),
      ...(ctx.authProfileMode ? { authProfileMode: ctx.authProfileMode } : {}),
    });
    const models = /* @__PURE__ */ new Map();
    if (catalog)
      for (const model of catalog.models)
        models.set(model.id, {
          ...model,
          provider: PROVIDER_ID,
          baseUrl: catalog.baseUrl,
        });
    let scopedModels = preparedDynamicModels.get(ctx.modelRegistry);
    if (!scopedModels) {
      scopedModels = /* @__PURE__ */ new Map();
      preparedDynamicModels.set(ctx.modelRegistry, scopedModels);
    }
    scopedModels.set(dynamicModelScope(ctx.authProfileId, ctx.authProfileMode), models);
  }
  function resolveDynamicModel(ctx) {
    return (
      preparedDynamicModels
        .get(ctx.modelRegistry)
        ?.get(dynamicModelScope(ctx.authProfileId, ctx.authProfileMode))
        ?.get(ctx.modelId) ?? resolveCopilotForwardCompatModel(ctx)
    );
  }
  return {
    prepareDynamicModel,
    resolveDynamicModel,
    runCatalog,
    preferRuntimeResolvedModel: ({ config }) => params.discoveryEnabled(config),
  };
}
//#endregion
export { createGithubCopilotDynamicModelHooks as t };
