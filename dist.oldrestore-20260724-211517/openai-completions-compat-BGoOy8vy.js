import { r as resolveProviderRequestCapabilities } from "./provider-attribution-CdW1rMjo.js";
//#region src/agents/openai-completions-compat.ts
function isDefaultRouteProvider(provider, ...ids) {
  return provider !== void 0 && ids.includes(provider);
}
/** Resolves default request flags for an OpenAI-compatible completions endpoint. */
function resolveOpenAICompletionsCompatDefaults(input) {
  const {
    provider,
    endpointClass,
    knownProviderFamily,
    supportsNativeStreamingUsageCompat = false,
    supportsOpenAICompletionsStreamingUsageCompat = false,
    usesExplicitProxyLikeEndpoint = false,
  } = input;
  const isDefaultRoute = endpointClass === "default";
  const usesConfiguredNonOpenAIEndpoint =
    endpointClass !== "default" && endpointClass !== "openai-public";
  const isMoonshotLike =
    knownProviderFamily === "moonshot" ||
    knownProviderFamily === "modelstudio" ||
    endpointClass === "moonshot-native" ||
    endpointClass === "modelstudio-native";
  const isModelStudioLike =
    knownProviderFamily === "modelstudio" ||
    endpointClass === "modelstudio-native" ||
    (isDefaultRoute && isDefaultRouteProvider(provider, "dashscope", "modelstudio", "qwen"));
  const isZai =
    endpointClass === "zai-native" ||
    (isDefaultRoute && isDefaultRouteProvider(input.provider, "zai"));
  const isDeepSeek =
    endpointClass === "deepseek-native" ||
    (isDefaultRoute && isDefaultRouteProvider(input.provider, "deepseek"));
  const isTogether =
    knownProviderFamily === "together" ||
    (isDefaultRoute && isDefaultRouteProvider(input.provider, "together"));
  const isXiaomi =
    endpointClass === "xiaomi-native" ||
    (isDefaultRoute && isDefaultRouteProvider(input.provider, "xiaomi"));
  const isNonStandard =
    endpointClass === "cerebras-native" ||
    endpointClass === "chutes-native" ||
    endpointClass === "deepseek-native" ||
    endpointClass === "mistral-public" ||
    endpointClass === "opencode-native" ||
    endpointClass === "xai-native" ||
    isXiaomi ||
    isZai ||
    (isDefaultRoute &&
      isDefaultRouteProvider(input.provider, "cerebras", "chutes", "deepseek", "opencode", "xai"));
  const isOpenRouterLike = input.provider === "openrouter" || endpointClass === "openrouter";
  const isLocalEndpoint = endpointClass === "local";
  const usesMaxTokens =
    endpointClass === "chutes-native" ||
    endpointClass === "mistral-public" ||
    knownProviderFamily === "mistral" ||
    isTogether ||
    (isDefaultRoute && isDefaultRouteProvider(provider, "chutes"));
  return {
    supportsStore:
      !isNonStandard && knownProviderFamily !== "mistral" && !usesExplicitProxyLikeEndpoint,
    supportsDeveloperRole: !isNonStandard && !isMoonshotLike && !usesConfiguredNonOpenAIEndpoint,
    supportsReasoningEffort:
      !isZai &&
      !isTogether &&
      knownProviderFamily !== "mistral" &&
      endpointClass !== "xai-native" &&
      !usesExplicitProxyLikeEndpoint,
    supportsUsageInStreaming:
      supportsOpenAICompletionsStreamingUsageCompat ||
      (!isNonStandard &&
        (isLocalEndpoint ||
          !usesConfiguredNonOpenAIEndpoint ||
          supportsNativeStreamingUsageCompat)),
    maxTokensField: usesMaxTokens ? "max_tokens" : "max_completion_tokens",
    thinkingFormat:
      isDeepSeek || isXiaomi
        ? "deepseek"
        : isZai
          ? "zai"
          : isTogether
            ? "together"
            : isOpenRouterLike
              ? "openrouter"
              : "openai",
    visibleReasoningDetailTypes: isOpenRouterLike ? ["response.output_text", "response.text"] : [],
    supportsStrictMode: !isZai && !usesConfiguredNonOpenAIEndpoint,
    requiresReasoningContentOnAssistantMessages: isDeepSeek || isXiaomi,
    requiresNonEmptyUserOrAssistantMessage: isModelStudioLike,
  };
}
function resolveOpenAICompletionsCompatDefaultsFromCapabilities(input) {
  return resolveOpenAICompletionsCompatDefaults(input);
}
/** Detects endpoint capabilities and defaults for an OpenAI-completions model. */
function detectOpenAICompletionsCompat(model) {
  const capabilities = resolveProviderRequestCapabilities({
    provider: model.provider,
    api: "openai-completions",
    baseUrl: model.baseUrl,
    capability: "llm",
    transport: "stream",
    modelId: model.id,
    compat: model.compat && typeof model.compat === "object" ? model.compat : void 0,
  });
  return {
    capabilities,
    defaults: resolveOpenAICompletionsCompatDefaultsFromCapabilities({
      provider: model.provider,
      ...capabilities,
    }),
  };
}
//#endregion
export { detectOpenAICompletionsCompat as t };
