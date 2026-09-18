import {
  n as readClaudeCliCredentialsForSetup,
  r as readClaudeCliCredentialsForSetupNonInteractive,
  t as readClaudeCliCredentialsForRuntime,
} from "./cli-auth-seam-CFPlqLC8.js";
import { t as buildAnthropicCliBackend } from "./cli-backend-BNe_Tlgu.js";
import { t as buildClaudeCliCatalogEntries } from "./cli-catalog-DSQ9eRZ7.js";
import {
  i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS,
  r as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF,
  t as CLAUDE_CLI_BACKEND_ID,
} from "./cli-constants-CpgfT8aN.js";
import { t as buildAnthropicCliMigrationResult } from "./cli-migration-CXN_m674.js";
import { n as CLAUDE_CLI_OFF_THINKING_PROFILE } from "./cli-shared-KlT4css5.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  n as normalizeAnthropicProviderConfigForProvider,
  t as applyAnthropicConfigDefaults,
} from "./config-defaults-BdrX_r_H.js";
import { t as anthropicMediaUnderstandingProvider } from "./media-understanding-provider-BwEymh35.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import { C as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CJQ8TR--.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import { c as upsertAuthProfileWithLock } from "./profiles-DxTOoenK.js";
import "./cli-runtime-B2OG9Kfj.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-CXfFv7q7.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CLs4Yz61.js";
import {
  n as validateAnthropicSetupToken,
  t as buildTokenProfileId,
} from "./provider-auth-token-DyHOhkct.js";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-CsXQZZNW.js";
import {
  d as cloneFirstTemplateModel,
  n as NATIVE_ANTHROPIC_REPLAY_HOOKS,
  s as modelCostsEqual,
} from "./provider-model-shared-CYlCpWlu.js";
import { n as suggestOAuthProfileIdForLegacyDefault } from "./repair-bhv6VYT3.js";
import { n as createClaudeSessionNodeInvokePolicies } from "./session-catalog-node-commands-CLficL3t.js";
import { t as registerClaudeSessionDiscovery } from "./session-catalog-registration-C8pzyElx.js";
import {
  a as resolveClaudeFable5ModelIdentity,
  d as supportsClaudeNativeMaxEffort,
  f as supportsClaudeNativeXhighEffort,
  l as resolveClaudeSonnet5ModelIdentity,
  o as resolveClaudeModelIdentity,
  s as resolveClaudeMythos5ModelIdentity,
  u as supportsClaudeAdaptiveThinking,
} from "./src-Dcc_hMY6.js";
import { l as wrapAnthropicProviderStream } from "./stream-wrappers-DjAhfdSW.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as resolveAnthropicUsageAuth, n as fetchAnthropicUsage } from "./usage-BLSqcSpe.js";
//#region extensions/anthropic/register.runtime.ts
/**
 * Anthropic provider runtime registration. It owns API-key/setup-token/Claude
 * CLI auth, dynamic model normalization, usage auth, media, and stream wrappers.
 */
const PROVIDER_ID = "anthropic";
const DEFAULT_ANTHROPIC_MODEL = "anthropic/claude-opus-4-8";
const ANTHROPIC_OPUS_48_MODEL_ID = "claude-opus-4-8";
const ANTHROPIC_OPUS_48_DOT_MODEL_ID = "claude-opus-4.8";
const ANTHROPIC_OPUS_47_MODEL_ID = "claude-opus-4-7";
const ANTHROPIC_OPUS_47_DOT_MODEL_ID = "claude-opus-4.7";
const ANTHROPIC_GA_1M_CONTEXT_TOKENS = 1048576;
const ANTHROPIC_EXACT_1M_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS = 128e3;
const ANTHROPIC_SONNET_5_STANDARD_PRICING_START_MS = Date.UTC(2026, 8, 1);
const ANTHROPIC_SONNET_5_PROMOTIONAL_COST = {
  input: 2,
  output: 10,
  cacheRead: 0.2,
  cacheWrite: 2.5,
};
const ANTHROPIC_SONNET_5_STANDARD_COST = {
  input: 3,
  output: 15,
  cacheRead: 0.3,
  cacheWrite: 3.75,
};
const ANTHROPIC_OPUS_46_MODEL_ID = "claude-opus-4-6";
const ANTHROPIC_OPUS_46_DOT_MODEL_ID = "claude-opus-4.6";
const ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS = [
  ANTHROPIC_OPUS_46_MODEL_ID,
  ANTHROPIC_OPUS_46_DOT_MODEL_ID,
];
const ANTHROPIC_SONNET_46_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_SONNET_46_DOT_MODEL_ID = "claude-sonnet-4.6";
const ANTHROPIC_SETUP_TOKEN_NOTE_LINES = [
  "Anthropic setup-token auth is supported in OpenClaw.",
  "OpenClaw prefers Claude CLI reuse when it is available on the host.",
  "Anthropic staff told us this OpenClaw path is allowed again.",
  `If you want a direct API billing path instead, use ${formatCliCommand("openclaw models auth login --provider anthropic --method api-key --set-default")} or ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`,
];
function resolveAnthropicSonnet5Cost(nowMs = Date.now()) {
  return nowMs >= ANTHROPIC_SONNET_5_STANDARD_PRICING_START_MS
    ? ANTHROPIC_SONNET_5_STANDARD_COST
    : ANTHROPIC_SONNET_5_PROMOTIONAL_COST;
}
const CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS = CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS.map((ref) =>
  ref.startsWith(`claude-cli/`) ? `anthropic/${ref.slice(CLAUDE_CLI_BACKEND_ID.length + 1)}` : ref,
);
async function upsertAuthProfileWithLockOrThrow(params) {
  if (!(await upsertAuthProfileWithLock(params)))
    throw new Error(
      "Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.",
    );
}
function normalizeAnthropicSetupTokenInput(value) {
  return value.replaceAll(/\s+/g, "").trim();
}
function resolveAnthropicSetupTokenProfileId(rawProfileId) {
  if (typeof rawProfileId === "string") {
    const trimmed = rawProfileId.trim();
    if (trimmed.length > 0) {
      if (trimmed.startsWith(`${PROVIDER_ID}:`)) return trimmed;
      return buildTokenProfileId({
        provider: PROVIDER_ID,
        name: trimmed,
      });
    }
  }
  return `${PROVIDER_ID}:default`;
}
function resolveAnthropicSetupTokenExpiry(rawExpiresIn) {
  if (typeof rawExpiresIn !== "string" || rawExpiresIn.trim().length === 0) return;
  return resolveExpiresAtMsFromDurationMs(
    parseDurationMs(rawExpiresIn.trim(), { defaultUnit: "d" }),
  );
}
async function runAnthropicSetupTokenAuth(ctx) {
  const token =
    (typeof ctx.opts?.token === "string" && ctx.opts.token.trim().length > 0
      ? normalizeAnthropicSetupTokenInput(ctx.opts.token)
      : void 0) ??
    normalizeAnthropicSetupTokenInput(
      await ctx.prompter.text({
        message: "Paste Anthropic setup-token",
        validate: (value) => validateAnthropicSetupToken(normalizeAnthropicSetupTokenInput(value)),
      }),
    );
  const tokenError = validateAnthropicSetupToken(token);
  if (tokenError) throw new Error(tokenError);
  const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts?.tokenProfileId);
  const expires = resolveAnthropicSetupTokenExpiry(ctx.opts?.tokenExpiresIn);
  return {
    profiles: [
      {
        profileId,
        credential: {
          type: "token",
          provider: PROVIDER_ID,
          token,
          ...(expires ? { expires } : {}),
        },
      },
    ],
    defaultModel: DEFAULT_ANTHROPIC_MODEL,
    notes: [...ANTHROPIC_SETUP_TOKEN_NOTE_LINES],
  };
}
async function runAnthropicSetupTokenNonInteractive(ctx) {
  const rawToken =
    typeof ctx.opts.token === "string" ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : "";
  const tokenError = validateAnthropicSetupToken(rawToken);
  if (tokenError) {
    ctx.runtime.error(
      ["Anthropic setup-token auth requires --token with a valid setup-token.", tokenError].join(
        "\n",
      ),
    );
    ctx.runtime.exit(1);
    return null;
  }
  const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts.tokenProfileId);
  const expires = resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
  await upsertAuthProfileWithLockOrThrow({
    profileId,
    credential: {
      type: "token",
      provider: PROVIDER_ID,
      token: rawToken,
      ...(expires ? { expires } : {}),
    },
    agentDir: ctx.agentDir,
  });
  ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[0]);
  ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[1]);
  const withProfile = applyAuthProfileConfig(ctx.config, {
    profileId,
    provider: PROVIDER_ID,
    mode: "token",
  });
  const existingModelConfig =
    withProfile.agents?.defaults?.model && typeof withProfile.agents.defaults.model === "object"
      ? withProfile.agents.defaults.model
      : {};
  return {
    ...withProfile,
    agents: {
      ...withProfile.agents,
      defaults: {
        ...withProfile.agents?.defaults,
        model: {
          ...existingModelConfig,
          primary: DEFAULT_ANTHROPIC_MODEL,
        },
      },
    },
  };
}
function resolveAnthropic46ForwardCompatModel(params) {
  const trimmedModelId = params.ctx.modelId.trim();
  const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
  if (trimmedModelId !== lower) return;
  if (
    !(
      lower === params.dashModelId ||
      lower === params.dotModelId ||
      lower.startsWith(`${params.dashModelId}-`) ||
      lower.startsWith(`${params.dotModelId}-`)
    )
  )
    return;
  const templateIds = [];
  if (lower.startsWith(params.dashModelId))
    templateIds.push(lower.replace(params.dashModelId, params.dashTemplateId));
  if (lower.startsWith(params.dotModelId))
    templateIds.push(lower.replace(params.dotModelId, params.dotTemplateId));
  templateIds.push(...params.fallbackTemplateIds);
  return cloneFirstTemplateModel({
    providerId: PROVIDER_ID,
    modelId: trimmedModelId,
    templateIds,
    ctx: params.ctx,
    patch:
      normalizeLowercaseStringOrEmpty(params.ctx.provider) === "claude-cli"
        ? { provider: CLAUDE_CLI_BACKEND_ID }
        : void 0,
  });
}
function buildAnthropicForwardCompatModel(ctx) {
  const trimmedModelId = ctx.modelId.trim();
  const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
  const normalizedProvider = normalizeLowercaseStringOrEmpty(ctx.provider);
  if (trimmedModelId !== lower || !matchesAnthropicModernModel(lower)) return;
  if (isAnthropicMandatoryClaude5Model(lower) && normalizedProvider !== PROVIDER_ID) return;
  const provider = normalizedProvider === "claude-cli" ? CLAUDE_CLI_BACKEND_ID : PROVIDER_ID;
  return {
    id: trimmedModelId,
    name: trimmedModelId,
    provider,
    api: "anthropic-messages",
    baseUrl: "https://api.anthropic.com",
    reasoning: true,
    input: ["text", "image"],
    cost: isAnthropicMandatoryClaude5Model(trimmedModelId)
      ? {
          input: 10,
          output: 50,
          cacheRead: 1,
          cacheWrite: 12.5,
        }
      : isAnthropicSonnet5Model(trimmedModelId) && provider === PROVIDER_ID
        ? resolveAnthropicSonnet5Cost()
        : {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
    contextWindow: resolveAnthropicFixedContextWindow(trimmedModelId) ?? 2e5,
    maxTokens: isAnthropic128kOutputModel(trimmedModelId)
      ? ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS
      : 64e3,
    ...(supportsClaudeNativeXhighEffort({ id: trimmedModelId })
      ? {
          thinkingLevelMap: {
            ...(isAnthropicMandatoryClaude5Model(trimmedModelId)
              ? {
                  off: "low",
                  minimal: "low",
                }
              : {}),
            xhigh: "xhigh",
            max: "max",
          },
        }
      : supportsAnthropicNativeMaxEffort(trimmedModelId)
        ? { thinkingLevelMap: { max: "max" } }
        : {}),
  };
}
function resolveAnthropicForwardCompatModel(ctx) {
  return (
    resolveAnthropic46ForwardCompatModel({
      ctx,
      dashModelId: ANTHROPIC_OPUS_48_MODEL_ID,
      dotModelId: ANTHROPIC_OPUS_48_DOT_MODEL_ID,
      dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
      dotTemplateId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
      fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS,
    }) ??
    resolveAnthropic46ForwardCompatModel({
      ctx,
      dashModelId: ANTHROPIC_OPUS_47_MODEL_ID,
      dotModelId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
      dashTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
      dotTemplateId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
      fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS,
    }) ??
    resolveAnthropic46ForwardCompatModel({
      ctx,
      dashModelId: ANTHROPIC_OPUS_46_MODEL_ID,
      dotModelId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
      dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
      dotTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
      fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS,
    }) ??
    resolveAnthropic46ForwardCompatModel({
      ctx,
      dashModelId: ANTHROPIC_SONNET_46_MODEL_ID,
      dotModelId: ANTHROPIC_SONNET_46_DOT_MODEL_ID,
      dashTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
      dotTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
      fallbackTemplateIds: [ANTHROPIC_SONNET_46_MODEL_ID, ANTHROPIC_SONNET_46_DOT_MODEL_ID],
    }) ??
    buildAnthropicForwardCompatModel(ctx)
  );
}
function isAnthropicGa1MModel(modelId) {
  return supportsClaudeAdaptiveThinking({ id: modelId });
}
function isAnthropicFable5Model(modelId) {
  return resolveClaudeFable5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicMythos5Model(modelId) {
  return resolveClaudeMythos5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicMandatoryClaude5Model(modelId) {
  return isAnthropicFable5Model(modelId) || isAnthropicMythos5Model(modelId);
}
function isAnthropicSonnet5Model(modelId) {
  return resolveClaudeSonnet5ModelIdentity({ id: modelId }) !== void 0;
}
function resolveAnthropicFixedContextWindow(modelId) {
  if (isAnthropicMandatoryClaude5Model(modelId) || isAnthropicSonnet5Model(modelId))
    return ANTHROPIC_EXACT_1M_CONTEXT_TOKENS;
  return isAnthropicGa1MModel(modelId) ? ANTHROPIC_GA_1M_CONTEXT_TOKENS : void 0;
}
function isAnthropic128kOutputModel(modelId) {
  if (isAnthropicMandatoryClaude5Model(modelId) || isAnthropicSonnet5Model(modelId)) return true;
  return /^claude-opus-4-8(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity({ id: modelId }));
}
function isAnthropicLargeImageModel(modelId) {
  return supportsClaudeNativeXhighEffort({ id: modelId });
}
function isAnthropicMythosPreviewModel(modelId) {
  return /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(
    resolveClaudeModelIdentity({ id: modelId }),
  );
}
function supportsAnthropicNativeMaxEffort(modelId) {
  return supportsClaudeNativeMaxEffort({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasConfiguredModelContextOverride(config, provider, modelId) {
  const providers = config?.models?.providers;
  if (!providers || typeof providers !== "object") return false;
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
  for (const [providerId, providerConfig] of Object.entries(providers)) {
    if (normalizeLowercaseStringOrEmpty(providerId) !== normalizedProvider) continue;
    if (!Array.isArray(providerConfig?.models)) continue;
    for (const model of providerConfig.models) {
      if (
        normalizeLowercaseStringOrEmpty(typeof model?.id === "string" ? model.id : "") !==
        normalizedModelId
      )
        continue;
      if (
        (typeof model?.contextTokens === "number" && model.contextTokens > 0) ||
        (typeof model?.contextWindow === "number" && model.contextWindow > 0)
      )
        return true;
    }
  }
  return false;
}
function applyAnthropicFixedContextWindow(params) {
  const fixedContextWindow = resolveAnthropicFixedContextWindow(params.contractModelId);
  if (fixedContextWindow === void 0) return;
  if (hasConfiguredModelContextOverride(params.config, params.provider, params.modelId)) return;
  const exactContextWindow =
    isAnthropicMandatoryClaude5Model(params.contractModelId) ||
    isAnthropicSonnet5Model(params.contractModelId);
  const nextContextWindow = exactContextWindow
    ? fixedContextWindow
    : Math.max(params.model.contextWindow ?? 0, fixedContextWindow);
  const nextContextTokens = exactContextWindow
    ? fixedContextWindow
    : typeof params.model.contextTokens === "number"
      ? Math.max(params.model.contextTokens, fixedContextWindow)
      : fixedContextWindow;
  if (
    nextContextWindow === params.model.contextWindow &&
    nextContextTokens === params.model.contextTokens
  )
    return;
  return {
    ...params.model,
    contextWindow: nextContextWindow,
    contextTokens: nextContextTokens,
  };
}
function applyAnthropicModernMaxTokens(params) {
  if (!isAnthropic128kOutputModel(params.modelId)) return;
  if ((params.model.maxTokens ?? 0) >= ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS) return;
  return {
    ...params.model,
    maxTokens: ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS,
  };
}
function applyAnthropicThinkingLevelMap(params) {
  const mandatoryClaude5 = isAnthropicMandatoryClaude5Model(params.modelId);
  const nativeXhigh = mandatoryClaude5 || supportsClaudeNativeXhighEffort({ id: params.modelId });
  if (!supportsAnthropicNativeMaxEffort(params.modelId)) return;
  const current = params.model.thinkingLevelMap;
  const nativeDefaults = isAnthropicMythosPreviewModel(params.modelId)
    ? { max: "max" }
    : {
        ...(mandatoryClaude5
          ? {
              off: "low",
              minimal: "low",
            }
          : {}),
        xhigh: nativeXhigh ? "xhigh" : null,
        max: "max",
      };
  const currentEfforts = current;
  if (Object.keys(nativeDefaults).every((level) => currentEfforts?.[level] !== void 0)) return;
  return {
    ...params.model,
    thinkingLevelMap: {
      ...nativeDefaults,
      ...current,
    },
  };
}
function matchesAnthropicModernModel(modelId) {
  return supportsClaudeAdaptiveThinking({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasImageInput(input) {
  return Array.isArray(input) && input.includes("image");
}
function supportsAnthropicImageInput(modelId, modelName) {
  return [modelId, modelName]
    .filter((value) => typeof value === "string")
    .some((candidate) => matchesAnthropicModernModel(candidate));
}
function resolveAnthropicImageMediaInput(modelId, modelName) {
  if (!supportsAnthropicImageInput(modelId, modelName)) return;
  const largeImageModel = [modelId, modelName]
    .filter((value) => typeof value === "string")
    .some((ref) => isAnthropicLargeImageModel(ref));
  return {
    image: {
      maxSidePx: largeImageModel ? 2576 : 1568,
      preferredSidePx: largeImageModel ? 2576 : 1568,
      tokenMode: "provider",
    },
  };
}
function applyAnthropicImageInputCapability(params) {
  if (hasImageInput(params.model.input)) return;
  if (!supportsAnthropicImageInput(params.modelId, params.model.name)) return;
  return {
    ...params.model,
    input: ["text", "image"],
  };
}
function applyAnthropicSonnet5Cost(params) {
  if (!isAnthropicSonnet5Model(params.modelId)) return;
  const cost = resolveAnthropicSonnet5Cost();
  if (modelCostsEqual(params.model.cost, cost)) return;
  return {
    ...params.model,
    cost,
  };
}
function normalizeAnthropicResolvedModel(ctx) {
  const contractModelId = resolveClaudeModelIdentity({
    id: ctx.modelId,
    params: ctx.model.params,
  });
  if (
    isAnthropicMandatoryClaude5Model(contractModelId) &&
    normalizeLowercaseStringOrEmpty(ctx.provider) !== PROVIDER_ID
  )
    return;
  const contractModel =
    (isAnthropicMandatoryClaude5Model(contractModelId) ||
      isAnthropicSonnet5Model(contractModelId)) &&
    !ctx.model.reasoning
      ? {
          ...ctx.model,
          reasoning: true,
        }
      : ctx.model;
  const imageCapableModel =
    applyAnthropicImageInputCapability({
      modelId: contractModelId,
      model: contractModel,
    }) ?? contractModel;
  const mediaInput = resolveAnthropicImageMediaInput(contractModelId, imageCapableModel.name);
  const mediaInputModel = mediaInput
    ? {
        ...imageCapableModel,
        mediaInput: {
          ...mediaInput,
          ...imageCapableModel.mediaInput,
          image: {
            ...mediaInput.image,
            ...imageCapableModel.mediaInput?.image,
          },
        },
      }
    : imageCapableModel;
  const outputModel =
    applyAnthropicModernMaxTokens({
      modelId: contractModelId,
      model: mediaInputModel,
    }) ?? mediaInputModel;
  const thinkingLevelModel =
    applyAnthropicThinkingLevelMap({
      modelId: contractModelId,
      model: outputModel,
    }) ?? outputModel;
  const contextWindowModel =
    applyAnthropicFixedContextWindow({
      config: ctx.config,
      provider: ctx.provider,
      modelId: ctx.modelId,
      contractModelId,
      model: thinkingLevelModel,
    }) ?? thinkingLevelModel;
  const pricingModel =
    normalizeLowercaseStringOrEmpty(ctx.provider) === PROVIDER_ID
      ? (applyAnthropicSonnet5Cost({
          modelId: contractModelId,
          model: contextWindowModel,
        }) ?? contextWindowModel)
      : contextWindowModel;
  return pricingModel === ctx.model ? void 0 : pricingModel;
}
function buildAnthropicAuthDoctorHint(params) {
  const legacyProfileId = params.profileId ?? "anthropic:default";
  const suggested = suggestOAuthProfileIdForLegacyDefault({
    cfg: params.config,
    store: params.store,
    provider: PROVIDER_ID,
    legacyProfileId,
  });
  if (!suggested || suggested === legacyProfileId) return "";
  const storeOauthProfiles = listProfilesForProvider(params.store, PROVIDER_ID)
    .filter((id) => params.store.profiles[id]?.type === "oauth")
    .join(", ");
  const cfgMode = params.config?.auth?.profiles?.[legacyProfileId]?.mode;
  const cfgProvider = params.config?.auth?.profiles?.[legacyProfileId]?.provider;
  return [
    "Doctor hint (for GitHub issue):",
    `- provider: ${PROVIDER_ID}`,
    `- config: ${legacyProfileId}${cfgProvider || cfgMode ? ` (provider=${cfgProvider ?? "?"}, mode=${cfgMode ?? "?"})` : ""}`,
    `- auth store oauth profiles: ${storeOauthProfiles || "(none)"}`,
    `- suggested profile: ${suggested}`,
    `Fix: run "${formatCliCommand("openclaw doctor --yes")}"`,
  ].join("\n");
}
function resolveClaudeCliSyntheticAuth() {
  const credential = readClaudeCliCredentialsForRuntime();
  if (!credential) return;
  return credential.type === "oauth"
    ? {
        apiKey: credential.access,
        source: "Claude CLI native auth",
        mode: "oauth",
        expiresAt: credential.expires,
      }
    : {
        apiKey: credential.token,
        source: "Claude CLI native auth",
        mode: "token",
        expiresAt: credential.expires,
      };
}
async function runAnthropicCliMigration(ctx) {
  const credential = readClaudeCliCredentialsForSetup();
  if (!credential)
    throw new Error(
      [
        "Claude CLI is not authenticated on this host.",
        `Run ${formatCliCommand("claude auth login")} first, then re-run this setup.`,
      ].join("\n"),
    );
  return buildAnthropicCliMigrationResult(ctx.config, credential);
}
async function runAnthropicCliMigrationNonInteractive(ctx) {
  const credential = readClaudeCliCredentialsForSetupNonInteractive();
  if (!credential) {
    ctx.runtime.error(
      [
        'Auth choice "anthropic-cli" requires Claude CLI auth on this host.',
        `Run ${formatCliCommand("claude auth login")} first.`,
      ].join("\n"),
    );
    ctx.runtime.exit(1);
    return null;
  }
  const result = buildAnthropicCliMigrationResult(ctx.config, credential);
  const currentDefaults = ctx.config.agents?.defaults;
  const currentModel = currentDefaults?.model;
  const currentFallbacks =
    currentModel && typeof currentModel === "object" && "fallbacks" in currentModel
      ? currentModel.fallbacks
      : void 0;
  const migratedModel = result.configPatch?.agents?.defaults?.model;
  const migratedFallbacks =
    migratedModel && typeof migratedModel === "object" && "fallbacks" in migratedModel
      ? migratedModel.fallbacks
      : void 0;
  const nextFallbacks = Array.isArray(migratedFallbacks) ? migratedFallbacks : currentFallbacks;
  return {
    ...ctx.config,
    ...result.configPatch,
    agents: {
      ...ctx.config.agents,
      ...result.configPatch?.agents,
      defaults: {
        ...currentDefaults,
        ...result.configPatch?.agents?.defaults,
        model: {
          ...(Array.isArray(nextFallbacks) ? { fallbacks: nextFallbacks } : {}),
          primary: result.defaultModel,
        },
      },
    },
  };
}
/** Build the full Anthropic provider descriptor used by runtime registration. */
function buildAnthropicProvider() {
  const providerId = "anthropic";
  const defaultAnthropicModel = DEFAULT_ANTHROPIC_MODEL;
  return {
    id: providerId,
    label: "Anthropic",
    docsPath: "/providers/models",
    hookAliases: [CLAUDE_CLI_BACKEND_ID],
    envVars: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
    oauthProfileIdRepairs: [
      {
        legacyProfileId: "anthropic:default",
        promptLabel: "Anthropic",
      },
    ],
    auth: [
      {
        id: "cli",
        label: "Claude CLI",
        hint: "Reuse a local Claude CLI login and run Anthropic models through the Claude CLI runtime",
        kind: "custom",
        wizard: {
          choiceId: "anthropic-cli",
          choiceLabel: "Anthropic Claude CLI",
          choiceHint: "Reuse a local Claude CLI login on this host",
          assistantPriority: -20,
          groupId: "anthropic",
          groupLabel: "Anthropic",
          groupHint: "Claude CLI + API key",
          modelAllowlist: {
            allowedKeys: [...CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS],
            initialSelections: [CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF],
            message: "Claude CLI models",
          },
        },
        run: async (ctx) => await runAnthropicCliMigration(ctx),
        runNonInteractive: async (ctx) =>
          await runAnthropicCliMigrationNonInteractive({
            config: ctx.config,
            runtime: ctx.runtime,
            agentDir: ctx.agentDir,
          }),
      },
      {
        id: "setup-token",
        label: "Anthropic setup-token",
        hint: "Manual bearer token path",
        kind: "token",
        wizard: {
          choiceId: "setup-token",
          choiceLabel: "Anthropic setup-token",
          choiceHint: "Manual token path",
          assistantPriority: 40,
          groupId: "anthropic",
          groupLabel: "Anthropic",
          groupHint: "Claude CLI + API key + token",
        },
        run: async (ctx) => await runAnthropicSetupTokenAuth(ctx),
        runNonInteractive: async (ctx) => await runAnthropicSetupTokenNonInteractive(ctx),
      },
      createProviderApiKeyAuthMethod({
        providerId,
        methodId: "api-key",
        label: "Anthropic API key",
        hint: "Direct Anthropic API key",
        optionKey: "anthropicApiKey",
        flagName: "--anthropic-api-key",
        envVar: "ANTHROPIC_API_KEY",
        promptMessage: "Enter Anthropic API key",
        defaultModel: defaultAnthropicModel,
        expectedProviders: ["anthropic"],
        wizard: {
          choiceId: "apiKey",
          choiceLabel: "Anthropic API key",
          groupId: "anthropic",
          groupLabel: "Anthropic",
          groupHint: "Claude CLI + API key",
        },
      }),
    ],
    normalizeConfig: ({ provider, providerConfig }) =>
      normalizeAnthropicProviderConfigForProvider({
        provider,
        providerConfig,
      }),
    applyConfigDefaults: ({ config, env }) =>
      applyAnthropicConfigDefaults({
        config,
        env,
      }),
    resolveDynamicModel: (ctx) => {
      const model = resolveAnthropicForwardCompatModel(ctx);
      if (!model) return;
      return (
        normalizeAnthropicResolvedModel({
          config: ctx.config,
          provider: ctx.provider,
          modelId: ctx.modelId,
          model,
        }) ?? model
      );
    },
    normalizeResolvedModel: (ctx) => normalizeAnthropicResolvedModel(ctx),
    resolveSyntheticAuth: ({ provider }) =>
      normalizeLowercaseStringOrEmpty(provider) === "claude-cli"
        ? resolveClaudeCliSyntheticAuth()
        : void 0,
    augmentModelCatalog: () => buildClaudeCliCatalogEntries(),
    ...NATIVE_ANTHROPIC_REPLAY_HOOKS,
    isModernModelRef: ({ provider, modelId }) =>
      matchesAnthropicModernModel(modelId) &&
      (!isAnthropicMandatoryClaude5Model(modelId) ||
        normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID),
    resolveReasoningOutputMode: () => "native",
    resolveThinkingProfile: ({ provider, modelId, params }) => {
      const contractModelId = resolveClaudeModelIdentity({
        id: modelId,
        params,
      });
      return isAnthropicMandatoryClaude5Model(contractModelId) &&
        normalizeLowercaseStringOrEmpty(provider) !== PROVIDER_ID
        ? CLAUDE_CLI_OFF_THINKING_PROFILE
        : resolveClaudeThinkingProfile(contractModelId, void 0, {
            includeNativeMax: [PROVIDER_ID, CLAUDE_CLI_BACKEND_ID].includes(
              normalizeLowercaseStringOrEmpty(provider),
            ),
          });
    },
    wrapStreamFn: wrapAnthropicProviderStream,
    resolveUsageAuth: resolveAnthropicUsageAuth,
    fetchUsageSnapshot: fetchAnthropicUsage,
    isCacheTtlEligible: () => true,
    buildAuthDoctorHint: (ctx) =>
      buildAnthropicAuthDoctorHint({
        config: ctx.config,
        store: ctx.store,
        profileId: ctx.profileId,
      }),
  };
}
/** Register Anthropic provider, Claude CLI backend, and media understanding provider. */
function registerAnthropicPlugin(api) {
  api.registerCliBackend(buildAnthropicCliBackend());
  api.registerProvider(buildAnthropicProvider());
  api.registerMediaUnderstandingProvider(anthropicMediaUnderstandingProvider);
  registerClaudeSessionDiscovery(api);
  for (const policy of createClaudeSessionNodeInvokePolicies())
    api.registerNodeInvokePolicy(policy);
}
//#endregion
export { registerAnthropicPlugin as n, buildAnthropicProvider as t };
