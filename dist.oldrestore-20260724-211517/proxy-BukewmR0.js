import {
  resolveOpenAIReasoningEffortForModel,
  supportsOpenAIReasoningEffort,
} from "@openclaw/ai/internal/openai";
import {
  a as patchCodexNativeWebSearchPayload,
  o as resolveCodexNativeSearchActivation,
} from "./codex-native-web-search-core-DGXC1P49.js";
import { t as log$1 } from "./logger-C5RMMskO.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { _ as parseStrictFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import {
  a as resolveOpenAIResponsesPayloadPolicy,
  c as stripCompletionMessagesToRoleContent,
  i as applyOpenAIResponsesPayloadPolicy,
  r as createOpenAIResponsesTransportStreamFn,
  s as flattenCompletionMessagesToStringContent,
} from "./openai-transport-stream-BFFr80cz.js";
import { i as resolveProviderRequestPolicy } from "./provider-attribution-CdW1rMjo.js";
import { l as resolveProviderRequestPolicyConfig } from "./provider-request-config-DpW-uV6A.js";
import {
  A as mapThinkingLevelToReasoningEffort,
  M as applyAnthropicEphemeralCacheControlMarkers,
  P as resolveAnthropicEphemeralCacheControl,
  k as streamWithPayloadPatch,
  y as normalizeOpenAICompatibleReasoningPayload,
} from "./provider-stream-shared-CMy-5I0G.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as streamSimple, l as emitModelTransportDebug } from "./stream-DzNMuPw6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  i as normalizeFastMode,
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/llm/providers/stream-wrappers/anthropic-family-cache-semantics.ts
function isAnthropicModelRef(modelId) {
  return normalizeLowercaseStringOrEmpty(modelId).startsWith("anthropic/");
}
/** Matches Application Inference Profile ARNs across all AWS partitions with Bedrock. */
const BEDROCK_APP_INFERENCE_PROFILE_ARN_RE = /^arn:aws(-cn|-us-gov)?:bedrock:/;
function isAnthropicBedrockModel(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  if (normalized.includes("anthropic.claude") || normalized.includes("anthropic/claude"))
    return true;
  if (
    BEDROCK_APP_INFERENCE_PROFILE_ARN_RE.test(normalized) &&
    normalized.includes(":application-inference-profile/")
  )
    return (normalized.split(":application-inference-profile/")[1] ?? "").includes("claude");
  return false;
}
function isAnthropicFamilyCacheTtlEligible(params) {
  const normalizedProvider = normalizeOptionalLowercaseString(params.provider);
  if (normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex") return true;
  if (normalizedProvider === "amazon-bedrock") return isAnthropicBedrockModel(params.modelId);
  return params.modelApi === "anthropic-messages";
}
function resolveAnthropicCacheRetentionFamily(params) {
  const normalizedProvider = normalizeOptionalLowercaseString(params.provider);
  if (normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex")
    return "anthropic-direct";
  if (
    normalizedProvider === "amazon-bedrock" &&
    params.hasExplicitCacheConfig &&
    typeof params.modelId === "string"
  ) {
    if (isAnthropicBedrockModel(params.modelId)) return "anthropic-bedrock";
    if (
      BEDROCK_APP_INFERENCE_PROFILE_ARN_RE.test(normalizeLowercaseStringOrEmpty(params.modelId)) &&
      normalizeLowercaseStringOrEmpty(params.modelId).includes(":application-inference-profile/")
    )
      return "anthropic-bedrock";
  }
  if (
    normalizedProvider !== "amazon-bedrock" &&
    params.hasExplicitCacheConfig &&
    params.modelApi === "anthropic-messages"
  )
    return "custom-anthropic-api";
}
//#endregion
//#region src/agents/openai-text-verbosity.ts
/**
 * OpenAI text verbosity normalization for provider-owned stream parameters.
 *
 * Invalid operator-supplied values are ignored with a warning instead of leaking into API payloads.
 */
function normalizeOpenAITextVerbosity(value) {
  if (typeof value !== "string") return;
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "low" || normalized === "medium" || normalized === "high") return normalized;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAITextVerbosity(extraParams) {
  const raw = extraParams?.textVerbosity ?? extraParams?.text_verbosity;
  const normalized = normalizeOpenAITextVerbosity(raw);
  if (raw !== void 0 && normalized === void 0) {
    const rawSummary = typeof raw === "string" ? raw : typeof raw;
    log$1.warn(`ignoring invalid OpenAI text verbosity param: ${rawSummary}`);
  }
  return normalized;
}
//#endregion
//#region src/llm/providers/stream-wrappers/openai.ts
const log = createSubsystemLogger("llm/providers/stream-wrappers");
function resolveOpenAITextVerbosityForModel(model, verbosity) {
  const api = normalizeOptionalLowercaseString(model.api);
  const provider = normalizeOptionalLowercaseString(model.provider);
  const id = normalizeOptionalLowercaseString(model.id);
  if (api === "openai-responses" && provider === "openai" && id === "chat-latest") return "medium";
  return verbosity;
}
function resolveOpenAIRequestCapabilities(model) {
  const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
  return resolveProviderRequestPolicyConfig({
    provider: readStringValue(model.provider),
    api: readStringValue(model.api),
    baseUrl: readStringValue(model.baseUrl),
    compat,
    capability: "llm",
    transport: "stream",
  }).capabilities;
}
function shouldApplyOpenAIAttributionHeaders(model) {
  const attributionProvider = resolveOpenAIRequestCapabilities(model).attributionProvider;
  return attributionProvider === "openai" ? attributionProvider : void 0;
}
function shouldUseCodexNativeTransport(model) {
  if (readStringValue(model.api) !== "openai-chatgpt-responses") return false;
  return resolveOpenAIRequestCapabilities(model).endpointClass === "openai";
}
function shouldApplyOpenAIServiceTier(model) {
  return resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "disable" }).allowsServiceTier;
}
function isCodeModeEnabled(config) {
  const tools = config?.tools;
  if (!tools || typeof tools !== "object") return false;
  const codeMode = tools.codeMode;
  if (codeMode === true) return true;
  return Boolean(codeMode && typeof codeMode === "object" && codeMode.enabled === true);
}
function readPayloadToolField(record, field) {
  try {
    return record[field];
  } catch {
    return;
  }
}
function isPromiseLike(value) {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof value.then === "function"
  );
}
function readPayloadToolName(tool) {
  if (!tool || typeof tool !== "object") return;
  const record = tool;
  const name = readPayloadToolField(record, "name");
  if (typeof name === "string") return name;
  const fn = readPayloadToolField(record, "function");
  if (!fn || typeof fn !== "object") return;
  const fnName = readPayloadToolField(fn, "name");
  return typeof fnName === "string" ? fnName : void 0;
}
function isCodeModePayloadToolName(name) {
  return name === "exec" || name === "wait";
}
function filterCodeModeToolDeclarations(declarations) {
  if (!Array.isArray(declarations)) return;
  return declarations.filter((declaration) =>
    isCodeModePayloadToolName(readPayloadToolName(declaration)),
  );
}
function filterCodeModeGroupedToolDeclarations(tool) {
  if (!tool || typeof tool !== "object" || Array.isArray(tool)) return;
  const record = tool;
  const filteredGroups = {};
  for (const key of ["functionDeclarations", "function_declarations"]) {
    const filtered = filterCodeModeToolDeclarations(readPayloadToolField(record, key));
    if (filtered === void 0) continue;
    if (filtered.length > 0) filteredGroups[key] = filtered;
  }
  return Object.keys(filteredGroups).length > 0 ? filteredGroups : void 0;
}
function filterCodeModePayloadTools(payload) {
  if (!payload || typeof payload !== "object") return;
  const record = payload;
  if (!Array.isArray(record.tools)) return;
  record.tools = record.tools.flatMap((tool) => {
    if (isCodeModePayloadToolName(readPayloadToolName(tool))) return [tool];
    const grouped = filterCodeModeGroupedToolDeclarations(tool);
    return grouped ? [grouped] : [];
  });
}
function filterCodeModePayloadHookResult(payload, nextPayload) {
  const finalPayload = nextPayload === void 0 ? payload : nextPayload;
  filterCodeModePayloadTools(finalPayload);
  return nextPayload === void 0 ? void 0 : finalPayload;
}
function hasCodeModeVisibleTools(context) {
  if (!Array.isArray(context.tools)) return false;
  const names = new Set(context.tools.map(readPayloadToolName).filter(Boolean));
  return names.has("exec") && names.has("wait");
}
function shouldApplyOpenAIReasoningCompatibility(model) {
  const api = readStringValue(model.api);
  const provider = readStringValue(model.provider);
  if (!api || !provider) return false;
  return resolveOpenAIRequestCapabilities(model).supportsOpenAIReasoningCompatPayload;
}
function shouldFlattenOpenAICompletionMessages(model) {
  const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
  return model.api === "openai-completions" && compat?.requiresStringContent === true;
}
function shouldStripOpenAICompletionTools(model) {
  const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
  return model.api === "openai-completions" && compat?.supportsTools === false;
}
function shouldStripOpenAICompletionMessageKeys(model) {
  const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
  return model.api === "openai-completions" && compat?.strictMessageKeys === true;
}
function hasResponsesWebSearchTool(tools) {
  if (!Array.isArray(tools)) return false;
  return tools.some((tool) => {
    if (!isRecord(tool)) return false;
    if (tool.type === "web_search") return true;
    if (tool.type === "function" && tool.name === "web_search") return true;
    const fn = tool.function;
    return isRecord(fn) && fn.name === "web_search";
  });
}
function resolveOpenAIThinkingPayloadEffort(params) {
  const provider = normalizeOptionalLowercaseString(params.model.provider);
  const defaultEffort = mapThinkingLevelToReasoningEffort(params.thinkingLevel);
  const usesNativeMax = provider === "openai" && supportsOpenAIReasoningEffort(params.model, "max");
  const mapped =
    provider === "openai" &&
    (params.thinkingLevel === "max" || (params.thinkingLevel === "minimal" && usesNativeMax))
      ? (resolveOpenAIReasoningEffortForModel({
          model: params.model,
          effort: params.thinkingLevel,
        }) ?? defaultEffort)
      : defaultEffort;
  if (mapped !== "minimal" || !hasResponsesWebSearchTool(params.payloadObj.tools)) return mapped;
  return (
    resolveOpenAIReasoningEffortForModel({
      model: params.model,
      effort: "low",
    }) ?? mapped
  );
}
function raiseMinimalReasoningForResponsesWebSearchPayload(params) {
  const reasoning = params.payloadObj.reasoning;
  if (!isRecord(reasoning) || reasoning.effort !== "minimal") return;
  if (!hasResponsesWebSearchTool(params.payloadObj.tools)) return;
  const nextEffort = resolveOpenAIReasoningEffortForModel({
    model: params.model,
    effort: "low",
  });
  if (nextEffort && nextEffort !== "minimal" && nextEffort !== "none")
    reasoning.effort = nextEffort;
}
function normalizeOpenAIServiceTier(value) {
  if (typeof value !== "string") return;
  const normalized = normalizeOptionalLowercaseString(value);
  if (
    normalized === "auto" ||
    normalized === "default" ||
    normalized === "flex" ||
    normalized === "priority"
  )
    return normalized;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAIServiceTier(extraParams) {
  const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
  const normalized = normalizeOpenAIServiceTier(raw);
  if (raw !== void 0 && normalized === void 0) {
    const rawSummary = typeof raw === "string" ? raw : typeof raw;
    log.warn(`ignoring invalid OpenAI service tier param: ${rawSummary}`);
  }
  return normalized;
}
function normalizeOpenAIFastMode(value) {
  if (typeof value === "function") return normalizeOpenAIFastMode(value());
  if (typeof value === "boolean") return value;
  const fastMode = normalizeFastMode(value);
  if (fastMode === "auto") return;
  if (typeof fastMode === "boolean") return fastMode;
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) return;
  if (
    normalized === "on" ||
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "1" ||
    normalized === "fast"
  )
    return true;
  if (
    normalized === "off" ||
    normalized === "false" ||
    normalized === "no" ||
    normalized === "0" ||
    normalized === "normal"
  )
    return false;
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function resolveOpenAIFastMode(extraParams) {
  const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
  const normalized = normalizeOpenAIFastMode(raw);
  if (
    raw !== void 0 &&
    normalized === void 0 &&
    typeof raw !== "function" &&
    normalizeFastMode(raw) !== "auto"
  ) {
    const rawSummary = typeof raw === "string" ? raw : typeof raw;
    log.warn(`ignoring invalid OpenAI fast mode param: ${rawSummary}`);
  }
  return normalized;
}
function applyOpenAIFastModePayloadOverrides(params) {
  if (params.payloadObj.service_tier === void 0 && shouldApplyOpenAIServiceTier(params.model))
    params.payloadObj.service_tier = "priority";
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIResponsesContextManagementWrapper(baseStreamFn, extraParams) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const policy = resolveOpenAIResponsesPayloadPolicy(model, {
      extraParams,
      enablePromptCacheStripping: true,
      enableServerCompaction: true,
      storeMode: "provider-policy",
    });
    if (
      policy.explicitStore === void 0 &&
      !policy.useServerCompaction &&
      !policy.shouldStripStore &&
      !policy.shouldStripPromptCache &&
      !policy.shouldStripDisabledReasoningPayload
    )
      return underlying(model, context, options);
    const originalOnPayload = options?.onPayload;
    const replayResponsesItemIds =
      (policy.shouldStripStore ? false : policy.explicitStore) ?? options?.replayResponsesItemIds;
    const nextOptions = {
      ...options,
      ...(replayResponsesItemIds === void 0 ? {} : { replayResponsesItemIds }),
      onPayload: (payload) => {
        if (payload && typeof payload === "object")
          applyOpenAIResponsesPayloadPolicy(payload, policy);
        return originalOnPayload?.(payload, model);
      },
    };
    return underlying(model, context, nextOptions);
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIReasoningCompatibilityWrapper(baseStreamFn) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!shouldApplyOpenAIReasoningCompatibility(model)) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      applyOpenAIResponsesPayloadPolicy(
        payloadObj,
        resolveOpenAIResponsesPayloadPolicy(model, { storeMode: "preserve" }),
      );
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIStringContentWrapper(baseStreamFn) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!shouldFlattenOpenAICompletionMessages(model)) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      if (!Array.isArray(payloadObj.messages)) return;
      payloadObj.messages = flattenCompletionMessagesToStringContent(payloadObj.messages);
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAICompletionsStrictMessageKeysWrapper(baseStreamFn) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!shouldStripOpenAICompletionMessageKeys(model)) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      if (!Array.isArray(payloadObj.messages)) return;
      payloadObj.messages = stripCompletionMessagesToRoleContent(payloadObj.messages);
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAICompletionsToolsCompatWrapper(baseStreamFn) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!shouldStripOpenAICompletionTools(model)) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      delete payloadObj.tools;
      delete payloadObj.tool_choice;
      delete payloadObj.parallel_tool_calls;
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIThinkingLevelWrapper(baseStreamFn, thinkingLevel) {
  const underlying = baseStreamFn ?? streamSimple;
  if (!thinkingLevel) return underlying;
  return (model, context, options) => {
    if (!shouldApplyOpenAIReasoningCompatibility(model)) {
      if (thinkingLevel === "off") return underlying(model, context, options);
      return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
        raiseMinimalReasoningForResponsesWebSearchPayload({
          model,
          payloadObj,
        });
      });
    }
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      const existingReasoning = payloadObj.reasoning;
      if (thinkingLevel === "off") {
        if (existingReasoning !== void 0) delete payloadObj.reasoning;
        return;
      }
      const reasoningEffort = resolveOpenAIThinkingPayloadEffort({
        model,
        payloadObj,
        thinkingLevel,
      });
      if (existingReasoning === "none") {
        payloadObj.reasoning = { effort: reasoningEffort };
        return;
      }
      if (
        existingReasoning &&
        typeof existingReasoning === "object" &&
        !Array.isArray(existingReasoning)
      ) {
        existingReasoning.effort = reasoningEffort;
        raiseMinimalReasoningForResponsesWebSearchPayload({
          model,
          payloadObj,
        });
      }
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIFastModeWrapper(baseStreamFn, enabled = true) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (
      normalizeOpenAIFastMode(enabled) !== true ||
      (model.api !== "openai-responses" &&
        model.api !== "openai-chatgpt-responses" &&
        model.api !== "azure-openai-responses") ||
      model.provider !== "openai"
    )
      return underlying(model, context, options);
    const originalOnPayload = options?.onPayload;
    return underlying(model, context, {
      ...options,
      onPayload: (payload) => {
        if (payload && typeof payload === "object")
          applyOpenAIFastModePayloadOverrides({
            payloadObj: payload,
            model,
          });
        return originalOnPayload?.(payload, model);
      },
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIServiceTierWrapper(baseStreamFn, serviceTier) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!shouldApplyOpenAIServiceTier(model)) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
      if (payloadObj.service_tier === void 0) payloadObj.service_tier = serviceTier;
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAITextVerbosityWrapper(baseStreamFn, verbosity) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (model.api !== "openai-responses" && model.api !== "openai-chatgpt-responses")
      return underlying(model, context, options);
    const resolvedVerbosity = resolveOpenAITextVerbosityForModel(model, verbosity);
    const shouldOverrideExistingVerbosity =
      model.api === "openai-chatgpt-responses" || resolvedVerbosity !== verbosity;
    const originalOnPayload = options?.onPayload;
    return underlying(model, context, {
      ...options,
      onPayload: (payload) => {
        if (payload && typeof payload === "object") {
          const payloadObj = payload;
          const existingText =
            payloadObj.text && typeof payloadObj.text === "object" ? payloadObj.text : {};
          if (shouldOverrideExistingVerbosity || existingText.verbosity === void 0)
            payloadObj.text = {
              ...existingText,
              verbosity: resolvedVerbosity,
            };
        }
        return originalOnPayload?.(payload, model);
      },
    });
  };
}
/** @deprecated OpenAI Codex provider-owned stream helper; do not use from third-party plugins. */
function createCodexNativeWebSearchWrapper(baseStreamFn, params) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (
      (params.codeModeToolSurfaceEnabled === true || isCodeModeEnabled(params.config)) &&
      hasCodeModeVisibleTools(context)
    ) {
      emitModelTransportDebug(
        log,
        `skipping Codex native web search because code mode owns the model tool surface for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`,
      );
      const originalOnPayload = options?.onPayload;
      const codeModeOptions = {
        ...options,
        openclawCodeModeToolSurface: true,
        onPayload: (payload) => {
          filterCodeModePayloadTools(payload);
          const nextPayload = originalOnPayload?.(payload, model);
          if (isPromiseLike(nextPayload))
            return Promise.resolve(nextPayload).then((resolvedPayload) =>
              filterCodeModePayloadHookResult(payload, resolvedPayload),
            );
          return filterCodeModePayloadHookResult(payload, nextPayload);
        },
      };
      return underlying(model, context, codeModeOptions);
    }
    if (params.nativeWebSearchAllowedByToolPolicy === false) {
      log.debug(
        `skipping Codex native web search (tool_policy_denied) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`,
      );
      return underlying(model, context, options);
    }
    const activation = resolveCodexNativeSearchActivation({
      config: params.config,
      modelProvider: readStringValue(model.provider),
      modelApi: readStringValue(model.api),
      modelId: readStringValue(model.id),
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      sandboxToolPolicy: params.sandboxToolPolicy,
      messageProvider: params.messageProvider,
      agentAccountId: params.agentAccountId,
      groupId: params.groupId,
      groupChannel: params.groupChannel,
      groupSpace: params.groupSpace,
      spawnedBy: params.spawnedBy,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
      agentDir: params.agentDir,
    });
    if (activation.state !== "native_active") {
      if (activation.codexNativeEnabled)
        log.debug(
          `skipping Codex native web search (${activation.inactiveReason ?? "inactive"}) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`,
        );
      return underlying(model, context, options);
    }
    log.debug(
      `activating Codex native web search (${activation.codexMode}) for ${model.provider ?? "unknown"}/${model.id ?? "unknown"}`,
    );
    const originalOnPayload = options?.onPayload;
    return underlying(model, context, {
      ...options,
      onPayload: (payload) => {
        const result = patchCodexNativeWebSearchPayload({
          payload,
          config: params.config,
        });
        if (result.status === "payload_not_object")
          log.debug(
            "Skipping Codex native web search injection because provider payload is not an object",
          );
        else if (result.status === "native_tool_already_present")
          log.debug("Codex native web search tool already present in provider payload");
        else if (result.status === "injected")
          log.debug("Injected Codex native web search tool into provider payload");
        return originalOnPayload?.(payload, model);
      },
    });
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIDefaultTransportWrapper(baseStreamFn) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const mergedOptions = {
      ...options,
      transport: options?.transport ?? "auto",
    };
    return underlying(model, context, mergedOptions);
  };
}
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
function createOpenAIAttributionHeadersWrapper(baseStreamFn, opts) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const attributionProvider = shouldApplyOpenAIAttributionHeaders(model);
    if (!attributionProvider) return underlying(model, context, options);
    return (
      shouldUseCodexNativeTransport(model) &&
        (baseStreamFn === void 0 || baseStreamFn === streamSimple)
        ? (opts?.codexNativeTransportStreamFn ?? createOpenAIResponsesTransportStreamFn())
        : underlying
    )(model, context, {
      ...options,
      headers: resolveProviderRequestPolicyConfig({
        provider: attributionProvider,
        api: readStringValue(model.api),
        baseUrl: readStringValue(model.baseUrl),
        capability: "llm",
        transport: "stream",
        callerHeaders: options?.headers,
        precedence: "defaults-win",
      }).headers,
    });
  };
}
//#endregion
//#region src/llm/providers/stream-wrappers/minimax.ts
const MINIMAX_FAST_MODEL_IDS = /* @__PURE__ */ new Map([
  ["MiniMax-M2.7", "MiniMax-M2.7-highspeed"],
]);
function resolveMinimaxFastModelId(modelId) {
  if (typeof modelId !== "string") return;
  return MINIMAX_FAST_MODEL_IDS.get(modelId.trim());
}
function isMinimaxAnthropicMessagesModel(model) {
  return (
    model.api === "anthropic-messages" &&
    (model.provider === "minimax" || model.provider === "minimax-portal")
  );
}
/**
 * MiniMax-M3 (and any forward-compatible MiniMax-M3.x successor) emits proper
 * Anthropic-shape thinking blocks (`content_block_start` with `type:"thinking"`
 * + `thinking_delta`) and **requires** thinking to be active to produce any
 * visible text. Pinning `thinking: { type: "disabled" }` on M3 makes the model
 * return an empty content array with `stop_reason: "end_turn"` and 1 output
 * token, observed against `https://api.minimax.io/anthropic/v1/messages`.
 *
 * The legacy MiniMax-M2.x family still needs the disable-thinking shim
 * because their Anthropic-compat streams leak `reasoning_content` in
 * OpenAI-style deltas (see {@link createMinimaxThinkingDisabledWrapper}).
 */
function isMinimaxModelRequiringThinking(model) {
  const modelId = typeof model.id === "string" ? model.id.trim() : "";
  return /^MiniMax-M3(\b|[-.])/i.test(modelId);
}
function isDisabledThinkingPayload(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    value.type === "disabled"
  );
}
function isEnabledThinkingPayload(value) {
  return (
    value !== null && typeof value === "object" && !Array.isArray(value) && value.type === "enabled"
  );
}
function resolvePositiveMaxTokens(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
/** @deprecated MiniMax provider-owned stream helper; do not use from third-party plugins. */
function createMinimaxFastModeWrapper(baseStreamFn, fastMode) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (
      (typeof fastMode === "function" ? fastMode() : fastMode) !== true ||
      model.api !== "anthropic-messages" ||
      (model.provider !== "minimax" && model.provider !== "minimax-portal")
    )
      return underlying(model, context, options);
    const fastModelId = resolveMinimaxFastModelId(model.id);
    if (!fastModelId) return underlying(model, context, options);
    return underlying(
      {
        ...model,
        id: fastModelId,
      },
      context,
      options,
    );
  };
}
/**
 * Legacy MiniMax (M2.x) Anthropic-compatible streaming endpoint returns
 * reasoning_content in OpenAI-style delta chunks ({delta: {content: "",
 * reasoning_content: "..."}}) rather than the native Anthropic thinking
 * block format. The shared Anthropic provider cannot process this format
 * and leaks the reasoning text as visible content. Disable thinking in the
 * outgoing payload so MiniMax does not produce reasoning_content deltas
 * during streaming.
 *
 * Skipped for MiniMax-M3 and M3.x, which emit proper Anthropic-shape thinking
 * blocks and require thinking enabled to produce any visible content.
 * The Anthropic transport builds `thinking: { type: "disabled" }` when no
 * resolved thinking level exists, so M3 removes that implicit disabled payload.
 * See {@link isMinimaxModelRequiringThinking}.
 */
function createMinimaxThinkingDisabledWrapper(baseStreamFn, thinkingLevel) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (!isMinimaxAnthropicMessagesModel(model)) return underlying(model, context, options);
    const requiresThinking = isMinimaxModelRequiringThinking(model);
    const originalOnPayload = options?.onPayload;
    return underlying(model, context, {
      ...options,
      onPayload: (payload) => {
        if (payload && typeof payload === "object") {
          const payloadObj = payload;
          if (requiresThinking) {
            if (thinkingLevel === void 0 && isDisabledThinkingPayload(payloadObj.thinking))
              delete payloadObj.thinking;
            else if (
              thinkingLevel !== "off" &&
              (isEnabledThinkingPayload(payloadObj.thinking) ||
                isDisabledThinkingPayload(payloadObj.thinking))
            ) {
              payloadObj.thinking = { type: "adaptive" };
              const maxTokens = resolvePositiveMaxTokens(options?.maxTokens);
              if (maxTokens !== void 0) payloadObj.max_tokens = maxTokens;
            }
          }
          if (!requiresThinking && payloadObj.thinking === void 0)
            payloadObj.thinking = { type: "disabled" };
        }
        return originalOnPayload?.(payload, model);
      },
    });
  };
}
//#endregion
//#region src/llm/providers/stream-wrappers/proxy.ts
const KILOCODE_FEATURE_HEADER = "X-KILOCODE-FEATURE";
const KILOCODE_FEATURE_DEFAULT = "openclaw";
const KILOCODE_FEATURE_ENV_VAR = "KILOCODE_FEATURE";
function resolveKilocodeAppHeaders() {
  const feature = process.env[KILOCODE_FEATURE_ENV_VAR]?.trim() || KILOCODE_FEATURE_DEFAULT;
  return { [KILOCODE_FEATURE_HEADER]: feature };
}
function readExtraParam(extraParams, keys) {
  if (!extraParams) return;
  for (const key of keys) if (Object.hasOwn(extraParams, key)) return extraParams[key];
}
function resolveBooleanParam(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return;
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) return;
  if (["1", "true", "yes", "on", "enable", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disable", "disabled"].includes(normalized)) return false;
}
function resolveOpenRouterResponseCacheTtlSeconds(value) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseStrictFiniteNumber(value)
        : void 0;
  if (parsed === void 0) return;
  return String(Math.max(1, Math.min(86400, Math.trunc(parsed))));
}
function shouldApplyOpenRouterResponseCacheHeaders(model) {
  const provider = readStringValue(model.provider);
  const endpointClass = resolveProviderRequestPolicy({
    provider,
    api: readStringValue(model.api),
    baseUrl: readStringValue(model.baseUrl),
    capability: "llm",
    transport: "stream",
  }).endpointClass;
  return (
    endpointClass === "openrouter" ||
    (endpointClass === "default" && normalizeOptionalLowercaseString(provider) === "openrouter")
  );
}
function resolveOpenRouterResponseCacheHeaders(model, extraParams) {
  if (!shouldApplyOpenRouterResponseCacheHeaders(model)) return;
  const configuredCache = resolveBooleanParam(
    readExtraParam(extraParams, ["responseCache", "response_cache"]),
  );
  const clearCache = resolveBooleanParam(
    readExtraParam(extraParams, ["responseCacheClear", "response_cache_clear"]),
  );
  const cacheEnabled = configuredCache ?? (clearCache ? true : void 0);
  if (cacheEnabled === void 0) return;
  const headers = { "X-OpenRouter-Cache": cacheEnabled ? "true" : "false" };
  if (!cacheEnabled) return headers;
  const ttl = resolveOpenRouterResponseCacheTtlSeconds(
    readExtraParam(extraParams, [
      "responseCacheTtlSeconds",
      "response_cache_ttl_seconds",
      "responseCacheTtl",
      "response_cache_ttl",
    ]),
  );
  if (ttl) headers["X-OpenRouter-Cache-TTL"] = ttl;
  if (clearCache) headers["X-OpenRouter-Cache-Clear"] = "true";
  return headers;
}
/** @deprecated OpenRouter provider-owned stream helper; do not use from third-party plugins. */
function createOpenRouterSystemCacheWrapper(baseStreamFn, extraParams) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const provider = readStringValue(model.provider);
    const modelId = readStringValue(model.id);
    const endpointClass = resolveProviderRequestPolicy({
      provider,
      api: readStringValue(model.api),
      baseUrl: readStringValue(model.baseUrl),
      capability: "llm",
      transport: "stream",
    }).endpointClass;
    if (
      !modelId ||
      !isAnthropicModelRef(modelId) ||
      !(
        endpointClass === "openrouter" ||
        (endpointClass === "default" && normalizeOptionalLowercaseString(provider) === "openrouter")
      )
    )
      return underlying(model, context, options);
    const cacheRetention =
      readCacheRetention(options?.cacheRetention) ??
      readCacheRetention(extraParams?.cacheRetention);
    return streamWithPayloadPatch(
      underlying,
      model,
      context,
      stripCacheRetentionOption(options),
      (payloadObj) => {
        applyAnthropicEphemeralCacheControlMarkers(
          payloadObj,
          resolveAnthropicEphemeralCacheControl(readStringValue(model.baseUrl), cacheRetention) ??
            null,
        );
      },
    );
  };
}
function readCacheRetention(value) {
  return value === "long" || value === "none" || value === "short" ? value : void 0;
}
function stripCacheRetentionOption(options) {
  if (!options || !Object.hasOwn(options, "cacheRetention")) return options;
  const { cacheRetention: _cacheRetention, ...rest } = options;
  return rest;
}
/** @deprecated OpenRouter provider-owned stream helper; do not use from third-party plugins. */
function createOpenRouterWrapper(baseStreamFn, thinkingLevel, extraParams) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const providerHeaders = resolveOpenRouterResponseCacheHeaders(model, extraParams);
    const headers = resolveProviderRequestPolicyConfig({
      provider: readStringValue(model.provider) ?? "openrouter",
      api: readStringValue(model.api),
      baseUrl: readStringValue(model.baseUrl),
      capability: "llm",
      transport: "stream",
      callerHeaders: options?.headers,
      providerHeaders,
      precedence: "caller-wins",
    }).headers;
    return streamWithPayloadPatch(
      underlying,
      model,
      context,
      {
        ...options,
        headers,
      },
      (payload) => {
        normalizeOpenAICompatibleReasoningPayload(payload, thinkingLevel);
      },
    );
  };
}
/** @deprecated Proxy provider-owned stream helper; do not use from third-party plugins. */
function isProxyReasoningUnsupported(modelId) {
  const trimmed = normalizeOptionalLowercaseString(modelId);
  const slashIndex = trimmed?.indexOf("/") ?? -1;
  return slashIndex > 0 && trimmed?.slice(0, slashIndex) === "x-ai";
}
/** @deprecated Kilocode provider-owned stream helper; do not use from third-party plugins. */
function createKilocodeWrapper(baseStreamFn, thinkingLevel) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const headers = resolveProviderRequestPolicyConfig({
      provider: readStringValue(model.provider) ?? "kilocode",
      api: readStringValue(model.api),
      baseUrl: readStringValue(model.baseUrl),
      capability: "llm",
      transport: "stream",
      callerHeaders: options?.headers,
      providerHeaders: resolveKilocodeAppHeaders(),
      precedence: "defaults-win",
    }).headers;
    return streamWithPayloadPatch(
      underlying,
      model,
      context,
      {
        ...options,
        headers,
      },
      (payload) => {
        normalizeOpenAICompatibleReasoningPayload(payload, thinkingLevel);
      },
    );
  };
}
//#endregion
export {
  isAnthropicModelRef as C,
  isAnthropicFamilyCacheTtlEligible as S,
  createOpenAITextVerbosityWrapper as _,
  createMinimaxFastModeWrapper as a,
  resolveOpenAIServiceTier as b,
  createOpenAIAttributionHeadersWrapper as c,
  createOpenAIDefaultTransportWrapper as d,
  createOpenAIFastModeWrapper as f,
  createOpenAIStringContentWrapper as g,
  createOpenAIServiceTierWrapper as h,
  isProxyReasoningUnsupported as i,
  createOpenAICompletionsStrictMessageKeysWrapper as l,
  createOpenAIResponsesContextManagementWrapper as m,
  createOpenRouterSystemCacheWrapper as n,
  createMinimaxThinkingDisabledWrapper as o,
  createOpenAIReasoningCompatibilityWrapper as p,
  createOpenRouterWrapper as r,
  createCodexNativeWebSearchWrapper as s,
  createKilocodeWrapper as t,
  createOpenAICompletionsToolsCompatWrapper as u,
  createOpenAIThinkingLevelWrapper as v,
  resolveAnthropicCacheRetentionFamily as w,
  resolveOpenAITextVerbosity as x,
  resolveOpenAIFastMode as y,
};
