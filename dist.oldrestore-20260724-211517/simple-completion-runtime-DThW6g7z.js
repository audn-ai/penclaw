import { supportsOpenAIReasoningEffort } from "@openclaw/ai/internal/openai";
import { clampThinkingLevel, getApiProvider } from "@openclaw/ai/internal/runtime";
import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-y9xQv_q1.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./defaults-CdX9UGcX.js";
import {
  o as fingerprintResolvedProviderAuth,
  t as fingerprintAuthProfileCredential,
} from "./execution-auth-binding-CmucNoqo.js";
import { i as loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-D2RPlnfc.js";
import {
  n as applyLocalNoAuthHeaderOverride,
  o as getApiKeyForModel,
  r as applySecretRefHeaderSentinels,
} from "./model-auth-BWFdcEzF.js";
import { r as formatMissingAuthError } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import "./provider-runtime-DyIHJ2cX.js";
import {
  i as buildModelAliasIndex,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { n as resolveModel, r as resolveModelAsync } from "./model-uG6W-_2M.js";
import { i as isOpenAIProvider, n as OPENAI_PROVIDER_ID } from "./openai-routing-Cu28Ynzk.js";
import "./model-selection-DOlkTrQa.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { f as wrapProviderSimpleCompletionStreamFn } from "./provider-hook-runtime-UWRY5bYu.js";
import {
  f as unwrapSecretSentinelsForProviderEgress,
  l as protectPreparedProviderRuntimeAuth,
} from "./provider-local-service-DLgcYp6u.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DpW-uV6A.js";
import { i as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import {
  a as prepareTransportAwareSimpleModel,
  c as ensureCustomApiRegistered,
  i as createOpenClawTransportStreamFnForModel,
  n as buildTransportAwareSimpleStreamFn,
  o as resolveTransportAwareSimpleApi,
  t as registerProviderStreamForModel,
} from "./provider-stream-DDVQiA6H.js";
import {
  C as sanitizeGoogleThinkingPayload,
  k as streamWithPayloadPatch,
} from "./provider-stream-shared-CMy-5I0G.js";
import { l as resolveClaudeSonnet5ModelIdentity } from "./src-Dcc_hMY6.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { i as streamSimple, n as completeSimple } from "./stream-DzNMuPw6.js";
import { n as resolveUtilityModelRefForAgent } from "./utility-model-wOa6LPAB.js";
//#region src/agents/simple-completion-scope.ts
const workspaceByResolver = /* @__PURE__ */ new WeakMap();
/** Keep request-local workspace scope without growing the public completion SDK signature. */
function bindSimpleCompletionModelResolverWorkspace(resolver, workspaceDir) {
  const scopedResolver = (provider, modelId, agentDir, cfg, options) =>
    resolver(provider, modelId, agentDir, cfg, options);
  workspaceByResolver.set(scopedResolver, workspaceDir);
  return scopedResolver;
}
function resolveSimpleCompletionModelResolverWorkspace(resolver) {
  return resolver ? workspaceByResolver.get(resolver) : void 0;
}
//#endregion
//#region src/agents/anthropic-vertex-stream.ts
/**
 * Anthropic Vertex stream facade.
 * Keeps Vertex-specific provider implementation in the bundled provider plugin
 * while core imports a small stable factory.
 */
function loadAnthropicVertexStreamFacade() {
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: "anthropic-vertex",
    artifactBasename: "api.js",
  });
}
/** Creates an Anthropic Vertex stream function through the bundled provider facade. */
function createAnthropicVertexStreamFnForModel(model, env = process.env) {
  return loadAnthropicVertexStreamFacade().createAnthropicVertexStreamFnForModel(model, env);
}
//#endregion
//#region src/agents/google-simple-completion-stream.ts
/**
 * Google simple-completion stream adapter.
 *
 * This registers a patched Google stream API that keeps the normal Google
 * backend but sanitizes unsupported thinking payload options for simple models.
 */
/** Custom API id for the Google simple-completion stream adapter. */
const GOOGLE_SIMPLE_COMPLETION_API = "openclaw-google-generative-ai-simple";
const SOURCE_API = "google-generative-ai";
function resolveGoogleSimpleThinkingLevel(model, reasoning) {
  switch (reasoning) {
    case "adaptive":
      return reasoning;
    case "off":
    case "minimal":
    case "low":
    case "medium":
    case "high":
    case "max":
    case "xhigh":
      return clampThinkingLevel(model, reasoning);
    default:
      return;
  }
}
function buildGoogleSimpleCompletionStreamFn() {
  return (model, context, options) => {
    const googleModel = {
      ...model,
      api: SOURCE_API,
    };
    return streamWithPayloadPatch(streamSimple, googleModel, context, options, (payload) => {
      sanitizeGoogleThinkingPayload({
        payload,
        modelId: model.id,
        thinkingLevel: resolveGoogleSimpleThinkingLevel(googleModel, options?.reasoning),
      });
    });
  };
}
/** Rewrites Google generative-ai models to the simple-completion adapter when needed. */
function prepareGoogleSimpleCompletionModel(model) {
  if (model.api !== SOURCE_API) return model;
  ensureCustomApiRegistered(GOOGLE_SIMPLE_COMPLETION_API, buildGoogleSimpleCompletionStreamFn());
  return {
    ...model,
    api: GOOGLE_SIMPLE_COMPLETION_API,
  };
}
//#endregion
//#region src/agents/simple-completion-transport.ts
const PROVIDER_SIMPLE_COMPLETION_API_PREFIX = "openclaw-provider-simple:";
function resolveAnthropicVertexSimpleApi(baseUrl) {
  return `openclaw-anthropic-vertex-simple:${baseUrl?.trim() ? encodeURIComponent(baseUrl.trim()) : "default"}`;
}
function normalizeCodexResponsesBaseUrlForOpenAISdk(baseUrl) {
  const normalized = baseUrl?.trim().replace(/\/+$/u, "") || "https://chatgpt.com/backend-api";
  try {
    const parsed = new URL(normalized);
    const path = parsed.pathname.replace(/\/+$/u, "").toLowerCase();
    if (
      parsed.hostname.toLowerCase() === "chatgpt.com" &&
      [
        "/backend-api",
        "/backend-api/v1",
        "/backend-api/codex",
        "/backend-api/codex/v1",
        "/backend-api/codex/responses",
      ].includes(path)
    ) {
      parsed.pathname = "/backend-api/codex";
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString().replace(/\/$/u, "");
    }
  } catch {}
  if (normalized.endsWith("/codex/responses")) return normalized.slice(0, -10);
  if (normalized.endsWith("/codex")) return normalized;
  return `${normalized}/codex`;
}
function resolveProviderSimpleCompletionApi(model) {
  const parts = [model.provider, model.id, model.api, model.baseUrl || "default"];
  return `${PROVIDER_SIMPLE_COMPLETION_API_PREFIX}${parts.map((part) => encodeURIComponent(part)).join(":")}`;
}
function applyProviderSimpleCompletionWrapper(model, cfg) {
  if (model.api.startsWith(PROVIDER_SIMPLE_COMPLETION_API_PREFIX)) return model;
  const sourceProvider = getApiProvider(model.api);
  if (!sourceProvider) return model;
  const sourceApi = model.api;
  const sourceStreamFn = (runtimeModel, context, options) =>
    sourceProvider.streamSimple(
      {
        ...runtimeModel,
        api: sourceApi,
      },
      context,
      options,
    );
  const streamFn = wrapProviderSimpleCompletionStreamFn({
    provider: model.provider,
    config: cfg,
    context: {
      config: cfg,
      provider: model.provider,
      modelId: model.id,
      model,
      streamFn: sourceStreamFn,
    },
  });
  if (!streamFn) return model;
  const api = resolveProviderSimpleCompletionApi(model);
  ensureCustomApiRegistered(api, streamFn);
  return {
    ...model,
    api,
  };
}
function prepareCodexSimpleTransportModel(model, cfg) {
  if (model.provider !== "openai" || model.api !== "openai-chatgpt-responses") return;
  const transportModel = {
    ...model,
    baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(model.baseUrl),
  };
  const api = resolveTransportAwareSimpleApi(model.api);
  const streamFn = createOpenClawTransportStreamFnForModel(transportModel, { cfg });
  if (!api || !streamFn) return;
  ensureCustomApiRegistered(api, streamFn);
  return {
    ...transportModel,
    api,
  };
}
function prepareModelForSimpleCompletion(params) {
  const { model, cfg } = params;
  if (
    !getApiProvider(model.api) &&
    registerProviderStreamForModel({
      model,
      cfg,
    })
  )
    return applyProviderSimpleCompletionWrapper(model, cfg);
  const codexTransportModel = prepareCodexSimpleTransportModel(model, cfg);
  if (codexTransportModel) return applyProviderSimpleCompletionWrapper(codexTransportModel, cfg);
  const transportAwareModel = prepareTransportAwareSimpleModel(model, { cfg });
  if (transportAwareModel !== model) {
    const streamFn = buildTransportAwareSimpleStreamFn(model, { cfg });
    if (streamFn) {
      ensureCustomApiRegistered(transportAwareModel.api, streamFn);
      return applyProviderSimpleCompletionWrapper(transportAwareModel, cfg);
    }
  }
  if (model.api === "google-generative-ai")
    return applyProviderSimpleCompletionWrapper(prepareGoogleSimpleCompletionModel(model), cfg);
  if (model.provider === "anthropic-vertex") {
    const api = resolveAnthropicVertexSimpleApi(model.baseUrl);
    ensureCustomApiRegistered(api, createAnthropicVertexStreamFnForModel(model));
    return applyProviderSimpleCompletionWrapper(
      {
        ...model,
        api,
      },
      cfg,
    );
  }
  return applyProviderSimpleCompletionWrapper(model, cfg);
}
//#endregion
//#region src/agents/simple-completion-runtime.ts
function resolveSimpleCompletionSelectionForAgent(params) {
  const fallbackRef = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  const modelRef =
    params.modelRef?.trim() ||
    (params.useUtilityModel
      ? resolveUtilityModelRefForAgent({
          cfg: params.cfg,
          agentId: params.agentId,
          primaryProvider: fallbackRef.provider,
        })
      : void 0) ||
    resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
  const split = modelRef ? splitTrailingAuthProfile(modelRef) : null;
  const aliasIndex = buildModelAliasIndex({
    cfg: params.cfg,
    defaultProvider: fallbackRef.provider || "openai",
  });
  const resolved = split
    ? resolveModelRefFromString({
        raw: split.model,
        defaultProvider: fallbackRef.provider || "openai",
        aliasIndex,
      })
    : null;
  const provider = resolved?.ref.provider ?? fallbackRef.provider;
  const modelId = resolved?.ref.model ?? fallbackRef.model;
  if (!provider || !modelId) return null;
  return {
    provider,
    modelId,
    ...resolveSimpleCompletionRuntimeProvider({
      cfg: params.cfg,
      agentId: params.agentId,
      provider,
      modelId,
    }),
    profileId: split?.profile || void 0,
    agentDir: params.agentDir?.trim() || resolveAgentDir(params.cfg, params.agentId),
  };
}
function resolveSimpleCompletionRuntimeProvider(params) {
  if (!isOpenAIProvider(params.provider)) return {};
  return resolveAgentHarnessPolicy({
    provider: params.provider,
    modelId: params.modelId,
    config: params.cfg,
    agentId: params.agentId,
  }).runtime === "codex"
    ? { runtimeProvider: OPENAI_PROVIDER_ID }
    : {};
}
async function setRuntimeApiKeyForCompletion(params) {
  if (params.model.provider === "github-copilot") {
    const { resolveCopilotApiToken } = await import("./plugin-sdk/provider-auth.js");
    const copilotToken = await resolveCopilotApiToken({
      githubToken: unwrapSecretSentinelsForProviderEgress(
        params.apiKey,
        "GitHub Copilot runtime auth exchange",
      ),
      config: params.cfg,
    });
    const runtimeApiKey =
      protectPreparedProviderRuntimeAuth({
        provider: params.model.provider,
        preparedAuth: {
          apiKey: copilotToken.token,
          baseUrl: copilotToken.baseUrl,
        },
      })?.apiKey ?? copilotToken.token;
    params.authStorage.setRuntimeApiKey(params.model.provider, runtimeApiKey);
    return {
      apiKey: runtimeApiKey,
      model: {
        ...params.model,
        baseUrl: copilotToken.baseUrl,
      },
    };
  }
  const preparedAuth = protectPreparedProviderRuntimeAuth({
    provider: params.model.provider,
    preparedAuth: await prepareProviderRuntimeAuth({
      provider: params.model.provider,
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env: process.env,
      context: {
        config: params.cfg,
        workspaceDir: params.workspaceDir,
        env: process.env,
        provider: params.model.provider,
        modelId: params.model.id,
        model: params.model,
        apiKey: unwrapSecretSentinelsForProviderEgress(
          params.apiKey,
          "provider runtime auth exchange",
        ),
        authMode: params.authMode,
        profileId: params.profileId,
      },
    }),
  });
  const runtimeApiKey = preparedAuth?.apiKey?.trim() || params.apiKey;
  params.authStorage.setRuntimeApiKey(params.model.provider, runtimeApiKey);
  return {
    apiKey: runtimeApiKey,
    model: applyPreparedRuntimeAuthToModel(params.model, preparedAuth),
  };
}
function hasMissingApiKeyAllowance(params) {
  return Boolean(params.allowMissingApiKeyModes?.includes(params.mode));
}
async function prepareSimpleCompletionModel(params) {
  const workspaceDir = resolveSimpleCompletionModelResolverWorkspace(params.modelResolver);
  const resolved =
    params.useAsyncModelResolution || params.skipAgentDiscovery
      ? await (params.modelResolver ?? resolveModelAsync)(
          params.provider,
          params.modelId,
          params.agentDir,
          params.cfg,
          {
            ...(params.allowBundledStaticCatalogFallback !== void 0
              ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback }
              : {}),
            ...(params.skipAgentDiscovery ? { skipAgentDiscovery: true } : {}),
            workspaceDir,
            authProfileId: params.profileId,
            preferredProfile: params.preferredProfile,
          },
        )
      : resolveModel(params.provider, params.modelId, params.agentDir, params.cfg, {
          workspaceDir,
          authProfileId: params.profileId,
          preferredProfile: params.preferredProfile,
        });
  if (!resolved.model)
    return { error: resolved.error ?? `Unknown model: ${params.provider}/${params.modelId}` };
  let auth;
  const authStore = params.bindAuthOwner
    ? ensureAuthProfileStore(params.agentDir, {
        readOnly: true,
        allowKeychainPrompt: false,
        config: params.cfg,
      })
    : void 0;
  try {
    auth = await getApiKeyForModel({
      model: resolved.model,
      cfg: params.cfg,
      agentDir: params.agentDir,
      workspaceDir,
      profileId: params.profileId,
      preferredProfile: params.preferredProfile,
      ...(authStore ? { store: authStore } : {}),
      ...(params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {}),
      secretSentinels: true,
    });
  } catch (err) {
    return {
      error: `Auth lookup failed for provider "${resolved.model.provider}": ${formatErrorMessage(err)}`,
    };
  }
  const rawApiKey = auth.apiKey?.trim();
  if (
    !rawApiKey &&
    !hasMissingApiKeyAllowance({
      mode: auth.mode,
      allowMissingApiKeyModes: params.allowMissingApiKeyModes,
    })
  )
    return {
      error: formatMissingAuthError(auth, resolved.model.provider),
      auth,
    };
  let authValue = rawApiKey;
  let resolvedModel = resolved.model;
  if (rawApiKey) {
    const runtimeCredential = await setRuntimeApiKeyForCompletion({
      authStorage: resolved.authStorage,
      model: resolved.model,
      apiKey: rawApiKey,
      authMode: auth.mode,
      cfg: params.cfg,
      workspaceDir: workspaceDir ?? params.agentDir,
      profileId: auth.profileId,
    });
    authValue = runtimeCredential.apiKey;
    resolvedModel = runtimeCredential.model;
  }
  const resolvedAuth = {
    ...auth,
    apiKey: authValue,
  };
  const profileCredential = params.profileId ? authStore?.profiles[params.profileId] : void 0;
  const sourceAuthFingerprint = params.bindAuthOwner
    ? profileCredential?.type === "oauth" && params.profileId
      ? fingerprintAuthProfileCredential({
          profileId: params.profileId,
          credential: profileCredential,
        })
      : fingerprintResolvedProviderAuth(auth)
    : void 0;
  return {
    model: applySecretRefHeaderSentinels(
      applyLocalNoAuthHeaderOverride(resolvedModel, resolvedAuth),
      params.cfg,
    ),
    auth: resolvedAuth,
    ...(sourceAuthFingerprint ? { sourceAuthFingerprint } : {}),
  };
}
async function prepareSimpleCompletionModelForAgent(params) {
  const selection = resolveSimpleCompletionSelectionForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
    agentDir: params.agentDir,
    modelRef: params.modelRef,
    useUtilityModel: params.useUtilityModel,
  });
  if (!selection) return { error: `No model configured for agent ${params.agentId}.` };
  const prepared = await prepareSimpleCompletionModel({
    cfg: params.cfg,
    provider: selection.runtimeProvider ?? selection.provider,
    modelId: selection.modelId,
    agentDir: selection.agentDir,
    profileId: selection.profileId,
    preferredProfile: params.preferredProfile,
    allowMissingApiKeyModes: params.allowMissingApiKeyModes,
    ...(params.allowBundledStaticCatalogFallback !== void 0
      ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback }
      : {}),
    useAsyncModelResolution: params.useAsyncModelResolution,
    skipAgentDiscovery: params.skipAgentDiscovery,
    bindAuthOwner: params.bindAuthOwner,
    modelResolver: params.modelResolver,
  });
  if ("error" in prepared)
    return {
      ...prepared,
      selection,
    };
  return {
    selection,
    model: prepared.model,
    auth: prepared.auth,
    ...(prepared.sourceAuthFingerprint
      ? { sourceAuthFingerprint: prepared.sourceAuthFingerprint }
      : {}),
  };
}
async function completeWithPreparedSimpleCompletionModel(params) {
  const completionModel = prepareModelForSimpleCompletion({
    model: params.model,
    cfg: params.cfg,
  });
  const { reasoning: rawReasoning, ...options } = params.options ?? {};
  const reasoning = normalizeSimpleCompletionReasoning(rawReasoning, completionModel);
  return await completeSimple(completionModel, params.context, {
    ...options,
    ...(reasoning ? { reasoning } : {}),
    apiKey: params.auth.apiKey,
  });
}
function normalizeSimpleCompletionReasoning(reasoning, model) {
  switch (reasoning) {
    case void 0:
      return;
    case "off":
      return resolveClaudeSonnet5ModelIdentity(model) ? "off" : void 0;
    case "adaptive":
      return "medium";
    case "ultra":
    case "max":
      return isOpenAIProvider(model.provider) && supportsOpenAIReasoningEffort(model, "max")
        ? "max"
        : "xhigh";
    default:
      return reasoning;
  }
}
//#endregion
export {
  normalizeCodexResponsesBaseUrlForOpenAISdk as a,
  resolveSimpleCompletionSelectionForAgent as i,
  prepareSimpleCompletionModel as n,
  createAnthropicVertexStreamFnForModel as o,
  prepareSimpleCompletionModelForAgent as r,
  bindSimpleCompletionModelResolverWorkspace as s,
  completeWithPreparedSimpleCompletionModel as t,
};
