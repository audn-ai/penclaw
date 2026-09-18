import {
  a as OPENAI_CHATGPT_LOGIN_HINT,
  i as OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
  o as OPENAI_CHATGPT_LOGIN_LABEL,
  r as OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
  s as OPENAI_CODEX_WIZARD_GROUP,
} from "./auth-choice-copy-D_t1WwLd.js";
import {
  a as isOpenAIApiBaseUrl,
  n as OPENAI_CODEX_RESPONSES_BASE_URL,
  o as isOpenAICodexBaseUrl,
} from "./base-url-Cx2NFKoL.js";
import { t as OPENAI_CODEX_DEFAULT_MODEL } from "./default-models-GLjqEMz-.js";
import "./defaults-CdX9UGcX.js";
import "./persisted-B2tK2f7d.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./error-runtime-BIAwr399.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import {
  d as OPENAI_GPT_55_PRO_MODEL_ID,
  g as OPENAI_GPT_56_VARIANT_MODEL_IDS,
  l as OPENAI_GPT_54_PRO_MODEL_ID,
  o as OPENAI_GPT_54_MINI_MODEL_ID,
  s as OPENAI_GPT_54_MODEL_ID,
  t as OPENAI_CHATGPT_MODERN_MODEL_IDS,
  u as OPENAI_GPT_55_MODEL_ID,
} from "./model-route-contract-C-kqakLd.js";
import { n as resolveCodexAuthIdentity } from "./openai-chatgpt-auth-identity-BW3Y9D_T.js";
import { t as loginOpenAICodexDeviceCode } from "./openai-chatgpt-device-code-BTpq8k3V.js";
import { t as loginOpenAICodexOAuth } from "./openai-chatgpt-oauth.runtime.js";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-C3SBJpUX.js";
import { l as findCatalogTemplate } from "./provider-catalog-shared-CQScmZZs.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
import {
  d as cloneFirstTemplateModel,
  f as matchesExactOrPrefix,
  u as normalizeProviderId,
} from "./provider-model-shared-CYlCpWlu.js";
import {
  n as buildOpenAISyntheticCatalogEntry,
  t as buildOpenAIResponsesProviderHooks,
} from "./shared-7Ty07K1G.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  p as readStringValue,
} from "./string-coerce-DW4mBlAt.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { t as resolveOpenAICodexThinkingProfile } from "./thinking-policy-CxLaWOdl.js";
import { n as fetchOpenAIUsage, r as resolveOpenAIUsageAuth } from "./usage-PQJkpOTm.js";
//#region extensions/openai/openai-chatgpt-provider.ts
const PROVIDER_ID = "openai";
const OPENAI_CODEX_BASE_URL = OPENAI_CODEX_RESPONSES_BASE_URL;
const OPENAI_CODEX_LOGIN_ASSISTANT_PRIORITY = -30;
const OPENAI_CODEX_DEVICE_PAIRING_ASSISTANT_PRIORITY = -10;
const OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP = {
  off: null,
  xhigh: "xhigh",
  max: "max",
};
const OPENAI_CODEX_GPT_56_CONTEXT_TOKENS = 372e3;
const OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS = 4e5;
const OPENAI_CODEX_GPT_55_DEFAULT_RUNTIME_CONTEXT_TOKENS = 272e3;
const OPENAI_CODEX_GPT_55_PRO_NATIVE_CONTEXT_TOKENS = 1e6;
const OPENAI_CODEX_GPT_55_PRO_DEFAULT_CONTEXT_TOKENS = 272e3;
const OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS = 105e4;
const OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS = 272e3;
const OPENAI_CODEX_GPT_54_MINI_NATIVE_CONTEXT_TOKENS = 4e5;
const OPENAI_CODEX_GPT_53_SPARK_CONTEXT_TOKENS = 128e3;
const OPENAI_CODEX_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CODEX_GPT_55_PRO_COST = {
  input: 30,
  output: 180,
  cacheRead: 0,
  cacheWrite: 0,
};
const OPENAI_CODEX_GPT_54_COST = {
  input: 2.5,
  output: 15,
  cacheRead: 0.25,
  cacheWrite: 0,
};
const OPENAI_CODEX_GPT_54_PRO_COST = {
  input: 30,
  output: 180,
  cacheRead: 0,
  cacheWrite: 0,
};
const OPENAI_CODEX_GPT_54_MINI_COST = {
  input: 0.75,
  output: 4.5,
  cacheRead: 0.075,
  cacheWrite: 0,
};
const OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS = ["gpt-5.3-codex"];
/** Legacy codex rows first; fall back to catalog `gpt-5.4` when the API omits 5.3/5.2. */
const OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS = [
  ...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS,
  OPENAI_GPT_54_MODEL_ID,
];
const OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS = [
  OPENAI_GPT_54_MODEL_ID,
  OPENAI_GPT_54_PRO_MODEL_ID,
  ...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS,
];
const OPENAI_CODEX_IMAGE_CAPABLE_MODEL_IDS = [
  ...OPENAI_GPT_56_VARIANT_MODEL_IDS,
  OPENAI_GPT_55_MODEL_ID,
  OPENAI_GPT_55_PRO_MODEL_ID,
  OPENAI_GPT_54_MODEL_ID,
  OPENAI_GPT_54_PRO_MODEL_ID,
  OPENAI_GPT_54_MINI_MODEL_ID,
];
function isOpenAIOrLegacyCodexProvider(provider) {
  return normalizeProviderId(provider ?? "") === PROVIDER_ID;
}
function isLegacyCodexCompatBaseUrl(baseUrl) {
  const trimmed = baseUrl?.trim();
  return trimmed !== void 0 && /^https?:\/\/api\.githubcopilot\.com(?:\/v1)?\/?$/iu.test(trimmed);
}
function normalizeCodexTransportFields(params) {
  const useCodexTransport =
    !params.baseUrl ||
    isOpenAIApiBaseUrl(params.baseUrl) ||
    isOpenAICodexBaseUrl(params.baseUrl) ||
    isLegacyCodexCompatBaseUrl(params.baseUrl);
  const api =
    useCodexTransport &&
    (!params.api || params.api === "openai-responses" || params.api === "openai-completions")
      ? "openai-chatgpt-responses"
      : (params.api ?? void 0);
  return {
    api,
    baseUrl:
      api === "openai-chatgpt-responses" && useCodexTransport
        ? OPENAI_CODEX_BASE_URL
        : params.baseUrl,
  };
}
function hasImageInput(input) {
  return Array.isArray(input) && input.includes("image");
}
function matchesOpenAICodexImageCapableModel(modelId, modelName) {
  return [modelId, modelName]
    .filter((value) => typeof value === "string")
    .some((candidate) => matchesExactOrPrefix(candidate, OPENAI_CODEX_IMAGE_CAPABLE_MODEL_IDS));
}
/**
 * Restore native `["text", "image"]` input capability on resolved Codex rows
 * for known image-capable modern model IDs (GPT-5.4 through GPT-5.6).
 * Persisted/configured model rows can omit the `input` field
 * entirely when they were written by older OpenClaw versions. When that row wins
 * the catalog merge, `modelSupportsInput(entry, "image")` returns false and the
 * gateway's `chat.send` handler offloads inbound images as `media://inbound/<id>`
 * claim-check URIs instead of inlining them.
 *
 * Mirrors the Anthropic precedent set by upstream #83756.
 */
function applyOpenAICodexImageInputCapability(params) {
  if (hasImageInput(params.model.input)) return;
  if (!matchesOpenAICodexImageCapableModel(params.modelId, params.model.name)) return;
  return {
    ...params.model,
    input: ["text", "image"],
  };
}
function normalizeCodexTransport(model) {
  const canonicalModelId =
    normalizeLowercaseStringOrEmpty(model.id) === "gpt-5.4-codex"
      ? OPENAI_GPT_54_MODEL_ID
      : model.id;
  const canonicalName =
    normalizeLowercaseStringOrEmpty(model.name) === "gpt-5.4-codex"
      ? OPENAI_GPT_54_MODEL_ID
      : model.name;
  const normalizedTransport = normalizeCodexTransportFields({
    api: model.api,
    baseUrl: model.baseUrl,
  });
  const api = normalizedTransport.api ?? model.api;
  const baseUrl = normalizedTransport.baseUrl ?? model.baseUrl;
  if (
    api === model.api &&
    baseUrl === model.baseUrl &&
    canonicalModelId === model.id &&
    canonicalName === model.name
  )
    return model;
  return {
    ...model,
    id: canonicalModelId,
    name: canonicalName,
    api,
    baseUrl,
  };
}
function resolveCodexForwardCompatModel(ctx) {
  const trimmedModelId = ctx.modelId.trim();
  const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
  const synthBaseUrl = ctx.providerConfig?.baseUrl ?? OPENAI_CODEX_BASE_URL;
  if (OPENAI_GPT_56_VARIANT_MODEL_IDS.some((modelId) => modelId === lower)) {
    const registeredModel = withDefaultCodexContextMetadata({
      model: withCodexTransport(ctx.modelRegistry.find(PROVIDER_ID, trimmedModelId), synthBaseUrl),
      contextWindow: OPENAI_CODEX_GPT_56_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_56_CONTEXT_TOKENS,
    });
    if (registeredModel)
      return normalizeModelCompat({
        ...registeredModel,
        thinkingLevelMap: {
          ...OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP,
          ...registeredModel.thinkingLevelMap,
        },
      });
    return normalizeModelCompat({
      id: trimmedModelId,
      name: trimmedModelId,
      api: "openai-chatgpt-responses",
      provider: PROVIDER_ID,
      baseUrl: synthBaseUrl,
      reasoning: true,
      input: ["text", "image"],
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
      },
      contextWindow: OPENAI_CODEX_GPT_56_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_56_CONTEXT_TOKENS,
      maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      thinkingLevelMap: OPENAI_CODEX_GPT_56_THINKING_LEVEL_MAP,
    });
  }
  if (lower === "gpt-5.5")
    return (
      withDefaultCodexContextMetadata({
        model: withCodexTransport(
          ctx.modelRegistry.find(PROVIDER_ID, trimmedModelId),
          synthBaseUrl,
        ),
        contextWindow: OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS,
        contextTokens: OPENAI_CODEX_GPT_55_DEFAULT_RUNTIME_CONTEXT_TOKENS,
      }) ??
      normalizeModelCompat({
        id: trimmedModelId,
        name: trimmedModelId,
        api: "openai-chatgpt-responses",
        provider: PROVIDER_ID,
        baseUrl: synthBaseUrl,
        reasoning: true,
        input: ["text", "image"],
        cost: {
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
        },
        contextWindow: OPENAI_CODEX_GPT_55_CODEX_CONTEXT_TOKENS,
        contextTokens: OPENAI_CODEX_GPT_55_DEFAULT_RUNTIME_CONTEXT_TOKENS,
        maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      })
    );
  let templateIds;
  let patch;
  if (lower === "gpt-5.5-pro") {
    templateIds = OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS;
    patch = {
      contextWindow: OPENAI_CODEX_GPT_55_PRO_NATIVE_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_55_PRO_DEFAULT_CONTEXT_TOKENS,
      maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      cost: OPENAI_CODEX_GPT_55_PRO_COST,
    };
  } else if (lower === "gpt-5.4" || lower === "gpt-5.4-codex") {
    templateIds = OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
    patch = {
      contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
      maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      cost: OPENAI_CODEX_GPT_54_COST,
    };
  } else if (lower === "gpt-5.4-pro") {
    templateIds = OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
    patch = {
      contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
      maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      cost: OPENAI_CODEX_GPT_54_PRO_COST,
    };
  } else if (lower === "gpt-5.4-mini") {
    templateIds = OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
    patch = {
      contextWindow: OPENAI_CODEX_GPT_54_MINI_NATIVE_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
      maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      cost: OPENAI_CODEX_GPT_54_MINI_COST,
    };
  } else if (lower === "gpt-5.3-codex-spark") {
    templateIds = OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
    patch = {
      input: ["text"],
      contextWindow: OPENAI_CODEX_GPT_53_SPARK_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_53_SPARK_CONTEXT_TOKENS,
      maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
      cost: OPENAI_CODEX_GPT_54_MINI_COST,
    };
  } else return;
  patch = {
    ...patch,
    api: "openai-chatgpt-responses",
    baseUrl: synthBaseUrl,
  };
  return (
    cloneFirstTemplateModel({
      providerId: PROVIDER_ID,
      modelId: lower === "gpt-5.4-codex" ? "gpt-5.4" : trimmedModelId,
      templateIds,
      ctx,
      patch,
    }) ??
    normalizeModelCompat({
      id: lower === "gpt-5.4-codex" ? "gpt-5.4" : trimmedModelId,
      name: lower === "gpt-5.4-codex" ? "gpt-5.4" : trimmedModelId,
      api: "openai-chatgpt-responses",
      provider: PROVIDER_ID,
      baseUrl: synthBaseUrl,
      reasoning: true,
      input: patch?.input ?? ["text", "image"],
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
      },
      contextWindow: patch?.contextWindow ?? 2e5,
      contextTokens: patch?.contextTokens,
      maxTokens: patch?.maxTokens ?? 2e5,
    })
  );
}
function withDefaultCodexContextMetadata(params) {
  if (!params.model) return;
  const contextTokens =
    typeof params.model.contextTokens === "number"
      ? params.model.contextTokens
      : typeof params.model.contextWindow === "number" && params.model.contextWindow > 0
        ? Math.min(params.contextTokens, params.model.contextWindow)
        : params.contextTokens;
  const input = params.model.input?.includes("image")
    ? params.model.input
    : uniqueValues([...(params.model.input ?? ["text"]), "image"]);
  return {
    ...params.model,
    input,
    contextWindow: params.contextWindow,
    contextTokens,
  };
}
function withCodexTransport(model, baseUrl) {
  if (!model) return;
  return normalizeModelCompat({
    ...model,
    api: "openai-chatgpt-responses",
    baseUrl,
  });
}
function buildCodexCredentialExtra(identity) {
  const extra = {
    ...(identity.accountId ? { accountId: identity.accountId } : {}),
    ...(identity.chatgptPlanType ? { chatgptPlanType: identity.chatgptPlanType } : {}),
  };
  return Object.keys(extra).length > 0 ? extra : void 0;
}
function buildOpenAICodexAuthConfigPatch() {
  return { agents: { defaults: { models: { [OPENAI_CODEX_DEFAULT_MODEL]: {} } } } };
}
async function refreshOpenAICodexOAuthCredential(cred) {
  try {
    const { refreshOpenAICodexToken } =
      await import("./extensions/openai/openai-chatgpt-provider.runtime.js");
    const refreshed = await refreshOpenAICodexToken(cred.refresh);
    const identity = resolveCodexAuthIdentity({
      accessToken: refreshed.access,
      email: cred.email,
    });
    return {
      ...cred,
      ...refreshed,
      type: "oauth",
      provider: PROVIDER_ID,
      email: identity.email ?? cred.email,
      displayName: cred.displayName,
      ...buildCodexCredentialExtra(identity),
    };
  } catch (error) {
    const message = formatErrorMessage(error);
    if (
      /extract\s+accountid\s+from\s+token/i.test(message) &&
      typeof cred.access === "string" &&
      cred.access.trim().length > 0
    )
      return cred;
    throw error;
  }
}
async function runOpenAICodexOAuth(ctx) {
  const creds = await loginOpenAICodexOAuth({
    prompter: ctx.prompter,
    runtime: ctx.runtime,
    oauth: ctx.oauth,
    isRemote: ctx.isRemote,
    openUrl: ctx.openUrl,
    signal: ctx.signal,
    onManualCodeInput: ctx.onManualCodeInput,
    localBrowserMessage: "Complete sign-in in browser…",
  });
  if (!creds) return { profiles: [] };
  const identity = resolveCodexAuthIdentity({
    accessToken: creds.access,
    email: readStringValue(creds.email),
  });
  return buildOauthProviderAuthResult({
    providerId: PROVIDER_ID,
    defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
    configPatch: buildOpenAICodexAuthConfigPatch(),
    access: creds.access,
    refresh: creds.refresh,
    expires: creds.expires,
    email: identity.email,
    profileName: identity.profileName,
    credentialExtra: buildCodexCredentialExtra(identity),
  });
}
async function runOpenAICodexDeviceCode(ctx) {
  const spin = ctx.prompter.progress("Starting device code flow…");
  try {
    const creds = await loginOpenAICodexDeviceCode({
      ...(ctx.signal ? { signal: ctx.signal } : {}),
      onProgress: (message) => spin.update(message),
      onVerification: async ({ verificationUrl, userCode, expiresInMs }) => {
        const expiresInMinutes = Math.max(1, Math.round(expiresInMs / 6e4));
        if (ctx.isRemote) await ctx.openUrl(verificationUrl);
        await ctx.prompter.note(
          [
            ctx.isRemote
              ? "Open this URL in your LOCAL browser and enter the code below."
              : "Open this URL in your browser and enter the code below.",
            `URL: ${verificationUrl}`,
            `Code: ${userCode}`,
            `Code expires in ${expiresInMinutes} minutes. Never share it.`,
          ].join("\n"),
          "OpenAI Codex device code",
        );
        if (ctx.isRemote) {
          ctx.runtime.log(`\nOpen this URL in your LOCAL browser:\n\n${verificationUrl}\n`);
          return;
        }
        try {
          await ctx.openUrl(verificationUrl);
          ctx.runtime.log(`Open: ${verificationUrl}`);
        } catch {
          ctx.runtime.log(`Open manually: ${verificationUrl}`);
        }
      },
    });
    spin.stop("OpenAI device code complete");
    const identity = resolveCodexAuthIdentity({ accessToken: creds.access });
    return buildOauthProviderAuthResult({
      providerId: PROVIDER_ID,
      defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
      configPatch: buildOpenAICodexAuthConfigPatch(),
      access: creds.access,
      refresh: creds.refresh,
      expires: creds.expires,
      email: identity.email,
      profileName: identity.profileName,
      credentialExtra: buildCodexCredentialExtra(identity),
    });
  } catch (error) {
    spin.stop("OpenAI device code failed");
    ctx.runtime.error(formatErrorMessage(error));
    await ctx.prompter.note(
      "Trouble with device code login? See https://docs.openclaw.ai/start/faq",
      "OAuth help",
    );
    throw error;
  }
}
function buildOpenAICodexAuthDoctorHint(ctx) {
  if (ctx.profileId !== "openai:codex-cli") return;
  return "Deprecated profile. Run `openclaw models auth login --provider openai` or `openclaw configure`.";
}
function buildOpenAIChatGPTAuthMethods() {
  return [
    {
      id: "oauth",
      label: OPENAI_CHATGPT_LOGIN_LABEL,
      hint: OPENAI_CHATGPT_LOGIN_HINT,
      kind: "oauth",
      wizard: {
        choiceId: "openai",
        choiceLabel: OPENAI_CHATGPT_LOGIN_LABEL,
        choiceHint: OPENAI_CHATGPT_LOGIN_HINT,
        assistantPriority: OPENAI_CODEX_LOGIN_ASSISTANT_PRIORITY,
        onboardingFeatured: true,
        ...OPENAI_CODEX_WIZARD_GROUP,
      },
      run: async (ctx) => await runOpenAICodexOAuth(ctx),
    },
    {
      id: "device-code",
      label: OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
      hint: OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
      kind: "device_code",
      wizard: {
        choiceId: "openai-device-code",
        choiceLabel: OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
        choiceHint: OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
        assistantPriority: OPENAI_CODEX_DEVICE_PAIRING_ASSISTANT_PRIORITY,
        ...OPENAI_CODEX_WIZARD_GROUP,
      },
      run: async (ctx) => await runOpenAICodexDeviceCode(ctx),
    },
  ];
}
function buildOpenAICodexProviderHooks() {
  return {
    resolveDynamicModel: (ctx) => resolveCodexForwardCompatModel(ctx),
    buildAuthDoctorHint: (ctx) => buildOpenAICodexAuthDoctorHint(ctx),
    resolveThinkingProfile: ({ modelId, agentRuntime, compat }) =>
      resolveOpenAICodexThinkingProfile(modelId, agentRuntime, compat),
    isModernModelRef: ({ modelId }) =>
      matchesExactOrPrefix(modelId, OPENAI_CHATGPT_MODERN_MODEL_IDS),
    preferRuntimeResolvedModel: (ctx) => {
      if (!isOpenAIOrLegacyCodexProvider(ctx.provider)) return false;
      const id = ctx.modelId.trim().toLowerCase();
      return OPENAI_CHATGPT_MODERN_MODEL_IDS.some((modelId) => modelId === id);
    },
    ...buildOpenAIResponsesProviderHooks(),
    resolveReasoningOutputMode: () => "native",
    normalizeResolvedModel: (ctx) => {
      if (!isOpenAIOrLegacyCodexProvider(ctx.provider)) return;
      const transportNormalized = normalizeCodexTransport(ctx.model);
      const imageCapable =
        applyOpenAICodexImageInputCapability({
          modelId: ctx.modelId,
          model: transportNormalized,
        }) ?? transportNormalized;
      return imageCapable === ctx.model ? void 0 : imageCapable;
    },
    normalizeTransport: ({ provider, api, baseUrl }) => {
      if (!isOpenAIOrLegacyCodexProvider(provider)) return;
      const normalized = normalizeCodexTransportFields({
        api,
        baseUrl,
      });
      if (normalized.api === api && normalized.baseUrl === baseUrl) return;
      return normalized;
    },
    resolveUsageAuth: resolveOpenAIUsageAuth,
    fetchUsageSnapshot: fetchOpenAIUsage,
    refreshOAuth: async (cred) => await refreshOpenAICodexOAuthCredential(cred),
    augmentModelCatalog: (ctx) => {
      const gpt54Template = findCatalogTemplate({
        entries: ctx.entries,
        providerId: PROVIDER_ID,
        templateIds: OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS,
      });
      return [
        buildOpenAISyntheticCatalogEntry(
          findCatalogTemplate({
            entries: ctx.entries,
            providerId: PROVIDER_ID,
            templateIds: OPENAI_CODEX_GPT_55_PRO_TEMPLATE_MODEL_IDS,
          }),
          {
            id: OPENAI_GPT_55_PRO_MODEL_ID,
            reasoning: true,
            input: ["text", "image"],
            contextWindow: OPENAI_CODEX_GPT_55_PRO_NATIVE_CONTEXT_TOKENS,
            contextTokens: OPENAI_CODEX_GPT_55_PRO_DEFAULT_CONTEXT_TOKENS,
            cost: OPENAI_CODEX_GPT_55_PRO_COST,
          },
        ),
        buildOpenAISyntheticCatalogEntry(gpt54Template, {
          id: OPENAI_GPT_54_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
          contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
          cost: OPENAI_CODEX_GPT_54_COST,
        }),
        buildOpenAISyntheticCatalogEntry(gpt54Template, {
          id: OPENAI_GPT_54_PRO_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
          contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
          cost: OPENAI_CODEX_GPT_54_PRO_COST,
        }),
        buildOpenAISyntheticCatalogEntry(gpt54Template, {
          id: OPENAI_GPT_54_MINI_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_CODEX_GPT_54_MINI_NATIVE_CONTEXT_TOKENS,
          contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
          cost: OPENAI_CODEX_GPT_54_MINI_COST,
        }),
      ].filter((entry) => entry !== void 0);
    },
  };
}
//#endregion
export { buildOpenAICodexProviderHooks as n, buildOpenAIChatGPTAuthMethods as t };
