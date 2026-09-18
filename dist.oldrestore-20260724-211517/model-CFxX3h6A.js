import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import {
  C as setAgentEffectiveModelPrimary,
  o as resolveAgentEffectiveModelPrimary,
} from "./agent-scope-y9xQv_q1.js";
import "./agent-runtime-BiQiwmwD.js";
import { c as readString } from "./helpers-DtCn6Wrs.js";
import {
  a as HERMES_REASON_DEFAULT_MODEL_CONFIGURED,
  g as readHermesModelDetails,
  h as hermesItemSkipped,
  i as HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE,
  m as hermesItemError,
  p as hermesItemConflict,
  t as HERMES_REASON_ALREADY_CONFIGURED,
} from "./items-BLOMW86Q.js";
//#region extensions/migrate-hermes/model.ts
const HERMES_PROVIDER_ALIASES = {
  alibaba: "qwen",
  "alibaba-cloud": "qwen",
  "alibaba-coding": "qwen",
  "alibaba-coding-plan": "qwen",
  alibaba_coding: "qwen",
  alibaba_coding_plan: "qwen",
  aliyun: "qwen",
  "azure-foundry": "microsoft-foundry",
  bedrock: "amazon-bedrock",
  claude: "anthropic",
  "claude-code": "anthropic",
  copilot: "github-copilot",
  gemini: "google",
  github: "github-copilot",
  "github-copilot": "github-copilot",
  "github-model": "github-copilot",
  "github-models": "github-copilot",
  glm: "zai",
  google: "google",
  "google-ai-studio": "google",
  "google-gemini": "google",
  grok: "xai",
  kilo: "kilocode",
  "kilo-code": "kilocode",
  "kilo-gateway": "kilocode",
  kimi: "kimi",
  "kimi-cn": "moonshot",
  "kimi-for-coding": "kimi",
  "kimi-coding": "kimi",
  "kimi-coding-cn": "moonshot",
  "moonshot-cn": "moonshot",
  moonshot: "moonshot",
  "minimax-global": "minimax-portal",
  "minimax-cn": "minimax",
  "minimax-oauth": "minimax-portal",
  "minimax-portal": "minimax-portal",
  minimax_oauth: "minimax-portal",
  "opencode-zen": "opencode",
  "openai-api": "openai",
  "openai-codex": "openai",
  dashscope: "qwen",
  qwen: "qwen",
  "qwen-cli": "qwen-oauth",
  "qwen-oauth": "qwen-oauth",
  "qwen-portal": "qwen-oauth",
  "x-ai": "xai",
  "x-ai-oauth": "xai",
  "x.ai": "xai",
  "xai-grok-oauth": "xai",
  "xai-oauth": "xai",
  "grok-oauth": "xai",
  "z-ai": "zai",
  "z.ai": "zai",
  zen: "opencode",
  zhipu: "zai",
  vertex: "google-vertex",
};
const HERMES_CANONICAL_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "alibaba",
  "alibaba-coding-plan",
  "anthropic",
  "arcee",
  "azure-foundry",
  "bedrock",
  "copilot",
  "copilot-acp",
  "deepseek",
  "fireworks",
  "github-copilot",
  "gemini",
  "gmi",
  "huggingface",
  "kilo",
  "kilocode",
  "kimi-coding",
  "kimi-coding-cn",
  "kimi-for-coding",
  "lmstudio",
  "minimax",
  "minimax-cn",
  "minimax-oauth",
  "moa",
  "nous",
  "novita",
  "nvidia",
  "ollama-cloud",
  "openai-api",
  "openai-codex",
  "opencode",
  "opencode-go",
  "opencode-zen",
  "openrouter",
  "qwen-oauth",
  "stepfun",
  "tencent-tokenhub",
  "xai",
  "xai-oauth",
  "xiaomi",
  "zai",
  "vertex",
]);
const HERMES_DYNAMIC_KIMI_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "kimi",
  "kimi-coding",
  "kimi-for-coding",
  "moonshot",
]);
function normalizeHermesProviderId(provider) {
  const normalized = normalizeHermesCustomProviderId(provider);
  return HERMES_PROVIDER_ALIASES[normalized] ?? normalized;
}
function normalizeHermesCustomProviderId(provider) {
  const normalized = provider.trim().toLowerCase();
  return (normalized.startsWith("custom:") ? normalized.slice(7) : normalized).replaceAll(" ", "-");
}
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readBaseUrl(value) {
  return value
    ? (readString(value.base_url) ??
        readString(value.baseUrl) ??
        readString(value.url) ??
        readString(value.api))
    : void 0;
}
function readKimiBaseUrl(config, provider, env) {
  const model = asRecord(config.model);
  const selectedProvider = readString(model?.provider) ?? readString(config.provider);
  if (
    selectedProvider &&
    HERMES_DYNAMIC_KIMI_PROVIDER_IDS.has(normalizeHermesCustomProviderId(selectedProvider))
  ) {
    const modelBaseUrl = readBaseUrl(model);
    if (modelBaseUrl) return modelBaseUrl;
  }
  const providers = asRecord(config.providers);
  for (const [id, value] of Object.entries(providers ?? {}))
    if (
      normalizeHermesCustomProviderId(id) === normalizeHermesCustomProviderId(provider) &&
      asRecord(value)
    ) {
      const providerBaseUrl = readBaseUrl(asRecord(value));
      if (providerBaseUrl) return providerBaseUrl;
    }
  return env.KIMI_BASE_URL?.trim() || void 0;
}
function resolveHermesKimiProviderId(config, provider, env) {
  const sourceProvider = normalizeHermesCustomProviderId(provider);
  if (!HERMES_DYNAMIC_KIMI_PROVIDER_IDS.has(sourceProvider)) return;
  const baseUrl = readKimiBaseUrl(config, sourceProvider, env);
  if (baseUrl) {
    try {
      const parsed = new URL(baseUrl);
      const hostname = parsed.hostname.toLowerCase();
      const pathname = parsed.pathname.toLowerCase().replace(/\/+$/u, "");
      if (hostname === "api.kimi.com" && (pathname === "/coding" || pathname === "/coding/v1"))
        return "kimi";
      if (hostname === "api.moonshot.ai") return "moonshot";
    } catch {}
    return normalizeHermesProviderId(sourceProvider) === "moonshot" ? "moonshot" : "kimi";
  }
  return (env.KIMI_API_KEY?.trim() || env.KIMI_CODING_API_KEY?.trim())?.startsWith("sk-kimi-")
    ? "kimi"
    : "moonshot";
}
function hasExplicitHermesProvider(config, provider) {
  const normalized = normalizeHermesCustomProviderId(provider);
  if (HERMES_CANONICAL_PROVIDER_IDS.has(normalized)) return false;
  const providers = config.providers;
  if (
    providers &&
    typeof providers === "object" &&
    !Array.isArray(providers) &&
    Object.keys(providers).some((id) => normalizeHermesCustomProviderId(id) === normalized)
  )
    return true;
  return (
    Array.isArray(config.custom_providers) &&
    config.custom_providers.some((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
      const record = entry;
      const id = readString(record.name) ?? readString(record.id);
      return id ? normalizeHermesCustomProviderId(id) === normalized : false;
    })
  );
}
function resolveHermesConfiguredProviderId(config, provider, env = {}) {
  if (hasExplicitHermesProvider(config, provider)) return normalizeHermesCustomProviderId(provider);
  return resolveHermesKimiProviderId(config, provider, env) ?? normalizeHermesProviderId(provider);
}
function joinHermesProviderModel(config, provider, model, env) {
  if (!provider) return model;
  if (provider.trim().toLowerCase() === "auto") {
    const slash = model.indexOf("/");
    return slash > 0
      ? `${resolveHermesConfiguredProviderId(config, model.slice(0, slash), env)}/${model.slice(slash + 1)}`
      : model;
  }
  const explicitProvider = hasExplicitHermesProvider(config, provider);
  const normalizedProvider = resolveHermesConfiguredProviderId(config, provider, env);
  const slash = model.indexOf("/");
  if (slash > 0) {
    if (
      (explicitProvider
        ? normalizeHermesCustomProviderId(model.slice(0, slash))
        : resolveHermesConfiguredProviderId(config, model.slice(0, slash), env)) ===
      normalizedProvider
    )
      return `${normalizedProvider}/${model.slice(slash + 1)}`;
  }
  return model.startsWith(`${normalizedProvider}/`) ? model : `${normalizedProvider}/${model}`;
}
function resolveHermesModelRef(config, env = {}) {
  const model = config.model;
  if (typeof model === "string" && model.trim()) {
    const rawModel = model.trim();
    return joinHermesProviderModel(config, readString(config.provider), rawModel, env);
  }
  if (model && typeof model === "object" && !Array.isArray(model)) {
    const modelRecord = model;
    const rawModel = readString(modelRecord.default) ?? readString(modelRecord.model);
    const hasCustomEndpoint = Boolean(
      readString(modelRecord.base_url) ?? readString(modelRecord.baseUrl),
    );
    const provider = readString(modelRecord.provider) ?? (hasCustomEndpoint ? "custom" : void 0);
    return rawModel ? joinHermesProviderModel(config, provider, rawModel, env) : void 0;
  }
  const rootModel = readString(config.default_model) ?? readString(config.model_name);
  const rootProvider = readString(config.provider);
  return rootModel ? joinHermesProviderModel(config, rootProvider, rootModel, env) : void 0;
}
function resolveDefaultAgentModelState(config) {
  const agentId = resolveDefaultAgentId(config);
  return {
    agentId,
    effectivePrimary: resolveAgentEffectiveModelPrimary(config, agentId),
  };
}
function resolveCurrentModelRef(ctx) {
  return resolveDefaultAgentModelState(ctx.config).effectivePrimary;
}
var ModelApplyAbortError = class extends Error {
  constructor(status, reason) {
    super(reason);
    this.status = status;
    this.reason = reason;
    this.name = "ModelApplyAbortError";
  }
};
async function applyModelItem(ctx, item) {
  const details = readHermesModelDetails(item);
  if (!details || item.status !== "planned") return item;
  try {
    const configApi = ctx.runtime?.config;
    if (!configApi?.current || !configApi.mutateConfigFile)
      return hermesItemError(item, HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE);
    const currentState = resolveDefaultAgentModelState(configApi.current());
    if (currentState.effectivePrimary === details.model)
      return hermesItemSkipped(item, HERMES_REASON_ALREADY_CONFIGURED);
    if (currentState.effectivePrimary && !ctx.overwrite)
      return hermesItemConflict(item, HERMES_REASON_DEFAULT_MODEL_CONFIGURED);
    await configApi.mutateConfigFile({
      base: "runtime",
      afterWrite: { mode: "auto" },
      mutate(draft) {
        const mutationState = resolveDefaultAgentModelState(draft);
        if (mutationState.effectivePrimary === details.model)
          throw new ModelApplyAbortError("skipped", HERMES_REASON_ALREADY_CONFIGURED);
        if (mutationState.effectivePrimary && !ctx.overwrite)
          throw new ModelApplyAbortError("conflict", HERMES_REASON_DEFAULT_MODEL_CONFIGURED);
        setAgentEffectiveModelPrimary(draft, mutationState.agentId, details.model);
      },
    });
    return {
      ...item,
      status: "migrated",
    };
  } catch (err) {
    if (err instanceof ModelApplyAbortError)
      return err.status === "conflict"
        ? hermesItemConflict(item, err.reason)
        : hermesItemSkipped(item, err.reason);
    return hermesItemError(item, err instanceof Error ? err.message : String(err));
  }
}
//#endregion
export {
  resolveHermesConfiguredProviderId as a,
  resolveCurrentModelRef as i,
  normalizeHermesCustomProviderId as n,
  resolveHermesModelRef as o,
  normalizeHermesProviderId as r,
  applyModelItem as t,
};
