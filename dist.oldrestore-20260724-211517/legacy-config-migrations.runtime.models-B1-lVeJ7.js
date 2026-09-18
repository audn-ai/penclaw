import { isDeepStrictEqual } from "node:util";
import "./utils-DtcDeqWS.js";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as isModelThinkingFormat } from "./types.models-BHfgMdAm.js";
//#region src/config/legacy.shared.ts
const getRecord = (value) => (isRecord(value) ? value : null);
const ensureRecord = (root, key) => {
  const existing = root[key];
  if (isRecord(existing)) return existing;
  const next = {};
  root[key] = next;
  return next;
};
const mergeMissing = (target, source) => {
  for (const [key, value] of Object.entries(source)) {
    if (value === void 0 || isBlockedObjectKey(key)) continue;
    const existing = target[key];
    if (existing === void 0) {
      target[key] = value;
      continue;
    }
    if (isRecord(existing) && isRecord(value)) mergeMissing(existing, value);
  }
};
const mapLegacyAudioTranscription = (value) => {
  const transcriber = getRecord(value);
  const command = Array.isArray(transcriber?.command) ? transcriber?.command : null;
  if (!command || command.length === 0) return null;
  if (typeof command[0] !== "string") return null;
  if (!command.every((part) => typeof part === "string")) return null;
  const rawExecutable = command[0].trim();
  if (!rawExecutable) return null;
  if (!isSafeExecutableValue(rawExecutable)) return null;
  const args = command.slice(1).map((part) => part.replace(/\{input\}/g, "{{MediaPath}}"));
  const timeoutSeconds =
    typeof transcriber?.timeoutSeconds === "number" ? transcriber?.timeoutSeconds : void 0;
  const result = {
    command: rawExecutable,
    type: "cli",
  };
  if (args.length > 0) result.args = args;
  if (timeoutSeconds !== void 0) result.timeoutSeconds = timeoutSeconds;
  return result;
};
const defineLegacyConfigMigration = (migration) => migration;
//#endregion
//#region src/commands/doctor/shared/legacy-models-add-metadata.ts
const LEGACY_MODELS_ADD_CODEX_MODEL_IDS = /* @__PURE__ */ new Set(["gpt-5.5", "gpt-5.5-pro"]);
const LEGACY_MODELS_ADD_CODEX_APIS = /* @__PURE__ */ new Set([
  "openai-codex-responses",
  "openai-chatgpt-responses",
]);
/** Return true when a model entry matches the legacy Codex `/models add` default shape. */
function isLegacyModelsAddCodexMetadataModel(params) {
  const model = params.model;
  if (normalizeProviderId(params.provider) !== "openai-codex" || !model) return false;
  const id = model.id?.trim().toLowerCase();
  if (!id || !LEGACY_MODELS_ADD_CODEX_MODEL_IDS.has(id)) return false;
  return (
    typeof model.api === "string" &&
    LEGACY_MODELS_ADD_CODEX_APIS.has(model.api) &&
    model.reasoning === true &&
    Array.isArray(model.input) &&
    model.input.length === 2 &&
    model.input[0] === "text" &&
    model.input[1] === "image" &&
    model.cost?.input === 5 &&
    model.cost.output === 30 &&
    model.cost.cacheRead === 0.5 &&
    model.cost.cacheWrite === 0 &&
    model.contextWindow === 4e5 &&
    model.contextTokens === 272e3 &&
    model.maxTokens === 128e3
  );
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.models.ts
const STALE_CONTEXT_WINDOW_FIXES = {
  "deepseek/deepseek-v4-flash": {
    stale: 2e5,
    correct: 1e6,
  },
  "xai/grok-4.20-0309-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-0309-non-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-beta-latest-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-beta-latest-non-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-experimental-beta-0304-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-experimental-beta-0304-non-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
  "xai/grok-4.20-non-reasoning": {
    stale: 2e6,
    correct: 1e6,
  },
};
function resolveStaleContextWindowFix(params) {
  const providerId = params.providerId.trim().toLowerCase();
  const modelId = params.modelId.trim().toLowerCase();
  const providerPrefix = `${providerId}/`;
  const scopedModelId = `${providerId}/${modelId.startsWith(providerPrefix) ? modelId.slice(providerPrefix.length) : modelId}`;
  const fix = STALE_CONTEXT_WINDOW_FIXES[scopedModelId];
  return fix && params.contextWindow === fix.stale ? fix : void 0;
}
function hasStaleContextWindowValue(providers) {
  const providersRecord = getRecord(providers);
  if (!providersRecord) return false;
  for (const [providerId, provider] of Object.entries(providersRecord)) {
    const models = getRecord(provider)?.models;
    if (!Array.isArray(models)) continue;
    for (const model of models) {
      const modelRecord = getRecord(model);
      const modelId = typeof modelRecord?.id === "string" ? modelRecord.id : void 0;
      const contextWindow = modelRecord?.contextWindow;
      if (!modelId || typeof contextWindow !== "number" || !Number.isFinite(contextWindow))
        continue;
      if (
        resolveStaleContextWindowFix({
          providerId,
          modelId,
          contextWindow,
        })
      )
        return true;
    }
  }
  return false;
}
function hasInvalidThinkingFormat(providers) {
  const providersRecord = getRecord(providers);
  if (!providersRecord) return false;
  for (const provider of Object.values(providersRecord)) {
    const models = getRecord(provider)?.models;
    if (!Array.isArray(models)) continue;
    for (const model of models) {
      const thinkingFormat = getRecord(getRecord(model)?.compat)?.thinkingFormat;
      if (typeof thinkingFormat === "string" && !isModelThinkingFormat(thinkingFormat)) return true;
    }
  }
  return false;
}
const LEGACY_VLLM_QWEN_THINKING_FORMAT_KEYS = ["qwenThinkingFormat", "qwen_thinking_format"];
function normalizeLegacyVllmQwenThinkingFormat(value) {
  if (typeof value !== "string") return;
  switch (
    value
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
  ) {
    case "chat-template":
    case "chat-template-argument":
    case "chat-template-arguments":
    case "chat-template-kwarg":
    case "chat-template-kwargs":
    case "qwen-chat-template":
      return "qwen-chat-template";
    case "enable-thinking":
    case "qwen":
    case "request-body":
    case "top-level":
      return "qwen";
    default:
      return;
  }
}
function getLegacyVllmQwenThinkingFormat(params) {
  for (const key of LEGACY_VLLM_QWEN_THINKING_FORMAT_KEYS)
    if (Object.hasOwn(params, key))
      return {
        key,
        value: params[key],
        compat: normalizeLegacyVllmQwenThinkingFormat(params[key]),
      };
}
function parseVllmAgentModelKey(key) {
  const trimmed = splitTrailingAuthProfile(key).model.trim();
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) return;
  if (normalizeProviderId(trimmed.slice(0, slashIndex)) !== "vllm") return;
  const modelId = trimmed.slice(slashIndex + 1).trim();
  return modelId && modelId !== "*" ? modelId : void 0;
}
function hasLegacyVllmQwenThinkingFormat(defaultModels) {
  const models = getRecord(defaultModels);
  if (!models) return false;
  for (const [key, entry] of Object.entries(models)) {
    if (!parseVllmAgentModelKey(key)) continue;
    const params = getRecord(getRecord(entry)?.params);
    if (params && getLegacyVllmQwenThinkingFormat(params)) return true;
  }
  return false;
}
function hasLegacyVllmQwenThinkingProviderParams(provider) {
  const params = getRecord(getRecord(provider)?.params);
  return Boolean(params && getLegacyVllmQwenThinkingFormat(params));
}
function hasLegacyVllmQwenThinkingModelParams(provider) {
  const models = getRecord(provider)?.models;
  if (!Array.isArray(models)) return false;
  return models.some((model) => {
    const params = getRecord(getRecord(model)?.params);
    return Boolean(params && getLegacyVllmQwenThinkingFormat(params));
  });
}
function hasLegacyVllmQwenThinkingParams(params) {
  const record = getRecord(params);
  return Boolean(record && getLegacyVllmQwenThinkingFormat(record));
}
function hasLegacyVllmQwenThinkingAgentParams(agents) {
  const list = getRecord(agents)?.list;
  if (!Array.isArray(list)) return false;
  return list.some((agent) => hasLegacyVllmQwenThinkingParams(getRecord(agent)?.params));
}
function findOrCreateVllmModelEntry(raw, modelId) {
  const modelsRoot = getOrCreateRecord(raw, "models");
  const providers = modelsRoot ? getOrCreateRecord(modelsRoot, "providers") : void 0;
  const vllm = providers ? getOrCreateVllmProvider(providers) : void 0;
  if (!vllm) return;
  if (vllm.models !== void 0 && !Array.isArray(vllm.models)) return;
  const models = Array.isArray(vllm.models) ? vllm.models : [];
  vllm.models = models;
  const providerModelId = `vllm/${modelId}`;
  for (const [index, model] of models.entries()) {
    const record = getRecord(model);
    if (record?.id === modelId || record?.id === providerModelId)
      return {
        model: record,
        index,
      };
  }
  const model = {
    id: modelId,
    name: modelId,
  };
  models.push(model);
  return {
    model,
    index: models.length - 1,
  };
}
function listExistingVllmModelTargets(raw) {
  const models = findVllmProvider(getRecord(getRecord(raw.models)?.providers))?.models;
  if (!Array.isArray(models)) return [];
  return models.flatMap((model, index) => {
    const record = getRecord(model);
    return record
      ? [
          {
            model: record,
            index,
          },
        ]
      : [];
  });
}
function collectVllmModelIdsFromSelection(value) {
  if (typeof value === "string") {
    const modelId = parseVllmAgentModelKey(value);
    return modelId ? [modelId] : [];
  }
  const record = getRecord(value);
  if (!record) return [];
  const ids = [];
  if (typeof record.primary === "string") {
    const primary = parseVllmAgentModelKey(record.primary);
    if (primary) ids.push(primary);
  }
  if (Array.isArray(record.fallbacks))
    for (const fallback of record.fallbacks) {
      if (typeof fallback !== "string") continue;
      const modelId = parseVllmAgentModelKey(fallback);
      if (modelId) ids.push(modelId);
    }
  return ids;
}
function collectVllmModelIdsFromAgentModelMap(value) {
  const models = getRecord(value);
  if (!models) return [];
  return Object.keys(models).flatMap((key) => {
    const modelId = parseVllmAgentModelKey(key);
    return modelId ? [modelId] : [];
  });
}
function createVllmModelTargets(raw, modelIds) {
  const targets = [];
  const seen = /* @__PURE__ */ new Set();
  for (const modelId of modelIds) {
    const target = findOrCreateVllmModelEntry(raw, modelId);
    if (!target || seen.has(target.model)) continue;
    seen.add(target.model);
    targets.push(target);
  }
  return targets;
}
function combineVllmModelTargets(...groups) {
  const targets = [];
  const seen = /* @__PURE__ */ new Set();
  for (const group of groups)
    for (const target of group) {
      if (seen.has(target.model)) continue;
      seen.add(target.model);
      targets.push(target);
    }
  return targets;
}
function collectVllmModelIdsFromAgentList(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((agent) => {
    const record = getRecord(agent);
    return record
      ? [
          ...collectVllmModelIdsFromSelection(record.model),
          ...collectVllmModelIdsFromAgentModelMap(record.models),
        ]
      : [];
  });
}
function getOrCreateRecord(root, key) {
  if (root[key] === void 0) {
    const next = {};
    root[key] = next;
    return next;
  }
  return getRecord(root[key]) ?? void 0;
}
function findVllmProvider(providers) {
  if (!providers) return;
  const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
  return key ? (getRecord(providers[key]) ?? void 0) : void 0;
}
function getOrCreateVllmProvider(providers) {
  const key = Object.keys(providers).find((entry) => normalizeProviderId(entry) === "vllm");
  if (key) return getRecord(providers[key]) ?? void 0;
  return getOrCreateRecord(providers, "vllm");
}
function hasLegacyVllmQwenThinkingNormalizedProvider(providers) {
  const providersRecord = getRecord(providers);
  if (!providersRecord || getRecord(providersRecord.vllm)) return false;
  const vllmProvider = findVllmProvider(providersRecord);
  return (
    hasLegacyVllmQwenThinkingProviderParams(vllmProvider) ||
    hasLegacyVllmQwenThinkingModelParams(vllmProvider)
  );
}
function preserveMigratedVllmQwenReasoning(model) {
  if (model.reasoning === void 0) model.reasoning = true;
}
function removeLegacyVllmQwenThinkingParams(params) {
  for (const key of LEGACY_VLLM_QWEN_THINKING_FORMAT_KEYS) delete params[key];
}
function applyLegacyVllmQwenThinkingFormat(params) {
  if (!params.legacyFormat.compat) {
    removeLegacyVllmQwenThinkingParams(params.legacyParams);
    params.changes.push(
      `Removed ${params.sourcePath}.${params.legacyFormat.key} (unrecognized value ${JSON.stringify(params.legacyFormat.value)}; configure models.providers.vllm.models[].compat.thinkingFormat if needed).`,
    );
    return true;
  }
  preserveMigratedVllmQwenReasoning(params.target.model);
  const compat = ensureRecord(params.target.model, "compat");
  const currentThinkingFormat = compat.thinkingFormat;
  if (typeof currentThinkingFormat === "string" && isModelThinkingFormat(currentThinkingFormat)) {
    removeLegacyVllmQwenThinkingParams(params.legacyParams);
    params.changes.push(
      `Removed ${params.sourcePath}.${params.legacyFormat.key}; models.providers.vllm.models[${params.target.index}].compat.thinkingFormat is already ${JSON.stringify(currentThinkingFormat)}.`,
    );
    return true;
  }
  compat.thinkingFormat = params.legacyFormat.compat;
  removeLegacyVllmQwenThinkingParams(params.legacyParams);
  params.changes.push(
    `Moved ${params.sourcePath}.${params.legacyFormat.key} to models.providers.vllm.models[${params.target.index}].compat.thinkingFormat (${JSON.stringify(params.legacyFormat.compat)}).`,
  );
  return true;
}
function removeUntargetedLegacyVllmQwenThinkingFormat(params) {
  removeLegacyVllmQwenThinkingParams(params.legacyParams);
  params.changes.push(
    `Removed ${params.sourcePath}.${params.legacyFormat.key}; no concrete vLLM model row or agent model ref exists, so configure models.providers.vllm.models[].compat.thinkingFormat on each Qwen model that needs it.`,
  );
}
const LEGACY_VLLM_QWEN_AGENT_THINKING_FORMAT_RULE = {
  path: ["agents", "defaults", "models"],
  message:
    'agents.defaults.models.<vllm-model>.params.qwenThinkingFormat is legacy; run "openclaw doctor --fix" to move it to models.providers.vllm.models[].compat.thinkingFormat.',
  match: (value) => hasLegacyVllmQwenThinkingFormat(value),
};
const LEGACY_VLLM_QWEN_PROVIDER_THINKING_FORMAT_RULE = {
  path: ["models", "providers", "vllm", "params"],
  message:
    'models.providers.vllm.params.qwenThinkingFormat is legacy; run "openclaw doctor --fix" to move it to models.providers.vllm.models[].compat.thinkingFormat.',
  match: (value) => hasLegacyVllmQwenThinkingProviderParams({ params: value }),
};
const LEGACY_VLLM_QWEN_PROVIDER_MODEL_THINKING_FORMAT_RULE = {
  path: ["models", "providers", "vllm", "models"],
  message:
    'models.providers.vllm.models[*].params.qwenThinkingFormat is legacy; run "openclaw doctor --fix" to move it to models.providers.vllm.models[].compat.thinkingFormat.',
  match: (value) => hasLegacyVllmQwenThinkingModelParams({ models: value }),
};
const LEGACY_VLLM_QWEN_NORMALIZED_PROVIDER_THINKING_FORMAT_RULE = {
  path: ["models", "providers"],
  message:
    'models.providers.<vllm>.params.qwenThinkingFormat is legacy; run "openclaw doctor --fix" to move it to models.providers.<vllm>.models[].compat.thinkingFormat.',
  match: (value) => hasLegacyVllmQwenThinkingNormalizedProvider(value),
};
const LEGACY_VLLM_QWEN_DEFAULT_PARAMS_THINKING_FORMAT_RULE = {
  path: ["agents", "defaults", "params"],
  message:
    'agents.defaults.params.qwenThinkingFormat is legacy; run "openclaw doctor --fix" to move it to models.providers.vllm.models[].compat.thinkingFormat.',
  match: (value) => hasLegacyVllmQwenThinkingParams(value),
};
const LEGACY_VLLM_QWEN_AGENT_PARAMS_THINKING_FORMAT_RULE = {
  path: ["agents"],
  message:
    'agents.list[].params.qwenThinkingFormat is legacy; run "openclaw doctor --fix" to move it to models.providers.vllm.models[].compat.thinkingFormat.',
  match: (value) => hasLegacyVllmQwenThinkingAgentParams(value),
};
const INVALID_THINKING_FORMAT_RULE = {
  path: ["models", "providers"],
  message:
    'models.providers.<id>.models[*].compat.thinkingFormat has an unrecognized value; run "openclaw doctor --fix" to remove it and restore the runtime default.',
  match: (value) => hasInvalidThinkingFormat(value),
};
const STALE_CONTEXT_WINDOW_RULE = {
  path: ["models", "providers"],
  message:
    'models.providers.<id>.models[*].contextWindow has a stale catalog value; run "openclaw doctor --fix" to repair it.',
  match: (value) => hasStaleContextWindowValue(value),
};
function normalizeString(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function preferredClaudeSeparator(provider) {
  return provider === "github-copilot" || provider === "copilot-proxy" ? "." : "-";
}
function claudeTargetModelId(family, separator, provider) {
  const version =
    family === "opus" && provider !== "venice" && provider !== "vercel-ai-gateway" ? "4.7" : "4.6";
  return `claude-${family}-${separator === "." ? version : version.replace(".", "-")}`;
}
function shouldUpgradeClaudeProvider(provider) {
  return (
    !provider ||
    provider === "anthropic" ||
    provider === "github-copilot" ||
    provider === "copilot-proxy" ||
    provider === "venice" ||
    provider === "vercel-ai-gateway"
  );
}
function upgradeRetiredGroqModelId(model) {
  switch (normalizeString(model)) {
    case "deepseek-r1-distill-llama-70b":
      return "llama-3.3-70b-versatile";
    case "gemma2-9b-it":
    case "llama3-8b-8192":
      return "llama-3.1-8b-instant";
    case "llama3-70b-8192":
      return "llama-3.3-70b-versatile";
    case "meta-llama/llama-4-maverick-17b-128e-instruct":
    case "moonshotai/kimi-k2-instruct":
    case "moonshotai/kimi-k2-instruct-0905":
      return "openai/gpt-oss-120b";
    case "mistral-saba-24b":
    case "qwen-qwq-32b":
      return "qwen/qwen3-32b";
    default:
      return null;
  }
}
function upgradeRetiredXaiModelId(model) {
  switch (normalizeString(model)) {
    case "grok-code-fast":
    case "grok-code-fast-1":
    case "grok-code-fast-1-0825":
      return "grok-build-0.1";
    case "grok-4-fast-reasoning":
    case "grok-4-1-fast-reasoning":
    case "grok-4-0709":
      return "grok-4.3";
    case "grok-imagine-image-pro":
      return "grok-imagine-image-quality";
    default:
      return null;
  }
}
function upgradeRetiredOpenAiModelId(model, provider) {
  const normalized = normalizeString(model);
  const codexProvider = provider === "openai-codex";
  if (codexProvider && normalized === "gpt-5.2") return "gpt-5.5";
  if (
    normalized === "gpt-5.2-codex" ||
    normalized === "gpt-5.1-codex" ||
    normalized === "gpt-5-codex"
  )
    return codexProvider ? "gpt-5.5" : "gpt-5.3-codex";
  if (normalized === "gpt-5-pro" || normalized === "gpt-5.2-pro") return "gpt-5.5-pro";
  if (normalized === "gpt-4.1-nano" || normalized === "gpt-5-nano") {
    if (codexProvider) return "gpt-5.4-mini";
    return "gpt-5.4-nano";
  }
  if (
    normalized === "gpt-4.1-mini" ||
    normalized === "gpt-4o-mini" ||
    normalized === "gpt-5.1-codex-mini" ||
    normalized === "gpt-5-mini"
  )
    return "gpt-5.4-mini";
  if (
    normalized === "gpt-4" ||
    normalized === "gpt-4-turbo" ||
    normalized === "gpt-4.1" ||
    normalized === "gpt-4o" ||
    normalized === "gpt-4o-2024-05-13" ||
    normalized === "gpt-4o-2024-08-06" ||
    normalized === "gpt-4o-2024-11-20" ||
    normalized === "gpt-5" ||
    normalized === "gpt-5-chat-latest" ||
    normalized === "gpt-5.1" ||
    normalized === "gpt-5.1-chat-latest" ||
    normalized === "gpt-5.1-codex-max" ||
    normalized === "gpt-5.2" ||
    normalized === "gpt-5.2-chat-latest"
  )
    return "gpt-5.5";
  return null;
}
function hasRetiredVersionPrefix(normalized, prefix) {
  if (normalized === prefix) return true;
  if (!normalized.startsWith(prefix)) return false;
  const next = normalized[prefix.length];
  return next === "-" || next === "." || next === ":" || next === "@";
}
function hasAnyRetiredVersionPrefix(normalized, prefixes) {
  return prefixes.some((prefix) => hasRetiredVersionPrefix(normalized, prefix));
}
function upgradeOldClaudeToken(token, separator, provider) {
  const normalized = normalizeString(token);
  if (!normalized) return null;
  const opusTarget = claudeTargetModelId("opus", separator, provider);
  const sonnetTarget = claudeTargetModelId("sonnet", separator, provider);
  if (
    normalized.startsWith("claude-opus-4-7") ||
    normalized.startsWith("claude-opus-4.7") ||
    normalized.startsWith("claude-opus-4-6") ||
    normalized.startsWith("claude-opus-4.6") ||
    normalized.startsWith("claude-sonnet-4-6") ||
    normalized.startsWith("claude-sonnet-4.6")
  )
    return null;
  if (normalized.startsWith("claude-haiku-4-5") || normalized.startsWith("claude-haiku-4.5"))
    return null;
  if (
    normalized === "claude-opus-4" ||
    hasAnyRetiredVersionPrefix(normalized, [
      "claude-opus-4-5",
      "claude-opus-4.5",
      "claude-opus-4-1",
      "claude-opus-4.1",
      "claude-opus-4-0",
      "claude-opus-4.0",
    ]) ||
    /^claude-opus-4-20\d{6}/.test(normalized)
  )
    return opusTarget;
  if (
    normalized === "claude-sonnet-4" ||
    hasAnyRetiredVersionPrefix(normalized, [
      "claude-sonnet-4-5",
      "claude-sonnet-4.5",
      "claude-sonnet-4-1",
      "claude-sonnet-4.1",
      "claude-sonnet-4-0",
      "claude-sonnet-4.0",
    ]) ||
    /^claude-sonnet-4-20\d{6}/.test(normalized)
  )
    return sonnetTarget;
  if (normalized.startsWith("claude-3") && normalized.includes("opus")) return opusTarget;
  if (
    normalized.startsWith("claude-3") &&
    (normalized.includes("sonnet") || normalized.includes("haiku"))
  )
    return sonnetTarget;
  if (normalized.startsWith("anthropic.claude-opus-")) {
    if (provider === "amazon-bedrock" || provider === "amazon-bedrock-mantle") return null;
    if (
      normalized.startsWith("anthropic.claude-opus-4-7") ||
      normalized.startsWith("anthropic.claude-opus-4-6")
    )
      return null;
    return `anthropic.${claudeTargetModelId("opus", "-", provider)}`;
  }
  if (
    normalized.startsWith("anthropic.claude-sonnet-") ||
    normalized.startsWith("anthropic.claude-haiku-")
  ) {
    if (provider === "amazon-bedrock" || provider === "amazon-bedrock-mantle") return null;
    if (normalized.startsWith("anthropic.claude-sonnet-4-6")) return null;
    return `anthropic.${claudeTargetModelId("sonnet", "-", provider)}`;
  }
  if (
    normalized === "opus-4.5" ||
    normalized === "opus-4.1" ||
    normalized === "opus-4" ||
    normalized === "opus-3"
  )
    return opusTarget;
  if (
    normalized === "sonnet-4.5" ||
    normalized === "sonnet-4.1" ||
    normalized === "sonnet-4.0" ||
    normalized === "sonnet-4" ||
    normalized === "sonnet-3.7" ||
    normalized === "sonnet-3.5" ||
    normalized === "sonnet-3" ||
    normalized === "haiku-3.5" ||
    normalized === "haiku-3"
  )
    return sonnetTarget;
  return null;
}
function upgradeOldClaudeModelPart(model, provider) {
  const separator = preferredClaudeSeparator(provider);
  const slashParts = model.split("/");
  const lastPart = slashParts.at(-1);
  if (lastPart) {
    const upgraded = upgradeOldClaudeToken(lastPart, separator, provider);
    if (upgraded) return [...slashParts.slice(0, -1), upgraded].join("/");
  }
  return upgradeOldClaudeToken(model, separator, provider);
}
function upgradeRetiredModelRef(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const split = splitTrailingAuthProfile(trimmed);
  const modelRef = split.model;
  const slash = modelRef.indexOf("/");
  const provider = slash > 0 ? modelRef.slice(0, slash).trim() : void 0;
  const model = slash > 0 ? modelRef.slice(slash + 1).trim() : modelRef;
  const normalizedProvider = normalizeString(provider);
  const normalizedModel = normalizeString(model);
  const retiredOwnerModel =
    normalizedProvider === "groq"
      ? upgradeRetiredGroqModelId(model)
      : normalizedProvider === "xai"
        ? upgradeRetiredXaiModelId(model)
        : normalizedProvider === "openai" ||
            normalizedProvider === "openai-codex" ||
            normalizedProvider === "github-copilot"
          ? upgradeRetiredOpenAiModelId(model, normalizedProvider)
          : void 0;
  if (retiredOwnerModel)
    return `${provider}/${retiredOwnerModel}${split.profile ? `@${split.profile}` : ""}`;
  if (
    (normalizedProvider === "github-copilot" || normalizedProvider === "copilot-proxy") &&
    normalizedModel === "grok-code-fast-1"
  )
    return `${provider}/gpt-5.4-mini${split.profile ? `@${split.profile}` : ""}`;
  if (!shouldUpgradeClaudeProvider(normalizedProvider || void 0)) return null;
  const upgradedModel = upgradeOldClaudeModelPart(model, normalizedProvider || void 0);
  if (!upgradedModel || upgradedModel === model) return null;
  return `${provider ? `${provider}/${upgradedModel}` : upgradedModel}${split.profile ? `@${split.profile}` : ""}`;
}
const MODEL_REF_STRING_KEYS = /* @__PURE__ */ new Set([
  "model",
  "primary",
  "summaryModel",
  "imageModel",
  "imageGenerationModel",
  "musicGenerationModel",
  "pdfModel",
  "videoGenerationModel",
]);
const MODEL_REF_ARRAY_KEYS = /* @__PURE__ */ new Set([
  "fallback",
  "fallbacks",
  "allowedModels",
  "modelFallbacks",
  "imageModelFallbacks",
]);
const MODEL_REF_MAP_KEYS = /* @__PURE__ */ new Set(["models"]);
function pathKey(path) {
  return path.slice(path.lastIndexOf(".") + 1);
}
function isChannelModelOverridePath(path) {
  return path.includes(".modelByChannel.");
}
function scanKnownModelRefs(value, key, path = "") {
  if (typeof value === "string")
    return Boolean(
      key &&
      (MODEL_REF_STRING_KEYS.has(key) || isChannelModelOverridePath(path)) &&
      upgradeRetiredModelRef(value),
    );
  if (Array.isArray(value))
    return value.some((entry, index) =>
      typeof entry === "string" && key && MODEL_REF_ARRAY_KEYS.has(key)
        ? Boolean(upgradeRetiredModelRef(entry))
        : scanKnownModelRefs(entry, void 0, `${path}.${index}`),
    );
  const record = getRecord(value);
  if (!record) return false;
  if (key && MODEL_REF_MAP_KEYS.has(key))
    return Object.keys(record).some((entryKey) => Boolean(upgradeRetiredModelRef(entryKey)));
  return Object.entries(record).some(([childKey, child]) =>
    scanKnownModelRefs(child, childKey, `${path}.${childKey}`),
  );
}
function rewriteModelRefString(value, path, changes) {
  const upgraded = upgradeRetiredModelRef(value);
  if (!upgraded) return value;
  changes.push(`Upgraded ${path} from ${JSON.stringify(value)} to ${JSON.stringify(upgraded)}.`);
  return upgraded;
}
function setRecordEntry(record, key, value) {
  Object.defineProperty(record, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}
function sanitizeModelRefMapEntry(value) {
  if (Array.isArray(value)) return value.map(sanitizeModelRefMapEntry);
  const record = getRecord(value);
  if (!record) return value;
  const sanitized = {};
  for (const [field, child] of Object.entries(record))
    if (!isBlockedObjectKey(field))
      setRecordEntry(sanitized, field, sanitizeModelRefMapEntry(child));
  return sanitized;
}
function modelRefValuesAreEqual(existing, incoming, path) {
  if (isDeepStrictEqual(existing, incoming)) return true;
  const normalizedExisting = rewriteKnownModelRefs(existing, path, []).value;
  const normalizedIncoming = rewriteKnownModelRefs(incoming, path, []).value;
  return isDeepStrictEqual(normalizedExisting, normalizedIncoming);
}
function mergeModelRefMapEntries(existing, incoming, path) {
  const existingRecord = getRecord(existing);
  const incomingRecord = getRecord(incoming);
  if (!existingRecord || !incomingRecord)
    return {
      value: sanitizeModelRefMapEntry(existing),
      conflicts: modelRefValuesAreEqual(existing, incoming, path) ? [] : ["value"],
    };
  const merged = sanitizeModelRefMapEntry(existingRecord);
  const conflicts = [];
  for (const [field, incomingValue] of Object.entries(incomingRecord)) {
    if (incomingValue === void 0 || isBlockedObjectKey(field)) continue;
    if (!hasOwnDefinedProperty(existingRecord, field)) {
      setRecordEntry(merged, field, sanitizeModelRefMapEntry(incomingValue));
      continue;
    }
    const existingValue = existingRecord[field];
    const fieldPath = `${path}.${field}`;
    if (modelRefValuesAreEqual(existingValue, incomingValue, fieldPath)) continue;
    const existingField = getRecord(existingValue);
    const incomingField = getRecord(incomingValue);
    if (existingField && incomingField) {
      const nested = mergeModelRefMapEntries(existingField, incomingField, fieldPath);
      setRecordEntry(merged, field, nested.value);
      conflicts.push(...nested.conflicts.map((c) => `${field}.${c}`));
      continue;
    }
    conflicts.push(field);
  }
  return {
    value: merged,
    conflicts,
  };
}
function rewriteModelRefMapKeys(record, path, changes) {
  let changed = false;
  const next = {};
  const consumedCanonicalKeys = /* @__PURE__ */ new Set();
  for (const [key, child] of Object.entries(record)) {
    const upgradedKey = upgradeRetiredModelRef(key);
    const nextKey = upgradedKey ?? key;
    if (!upgradedKey && consumedCanonicalKeys.has(key)) continue;
    if (upgradedKey) {
      changes.push(
        `Upgraded ${path} key from ${JSON.stringify(key)} to ${JSON.stringify(upgradedKey)}.`,
      );
      changed = true;
    }
    if (upgradedKey && !Object.hasOwn(next, nextKey) && Object.hasOwn(record, nextKey)) {
      setRecordEntry(next, nextKey, record[nextKey]);
      consumedCanonicalKeys.add(nextKey);
    }
    if (Object.hasOwn(next, nextKey)) {
      const existing = next[nextKey];
      const { value, conflicts } = mergeModelRefMapEntries(existing, child, `${path}.${nextKey}`);
      setRecordEntry(next, nextKey, value);
      const sortedConflicts = conflicts.toSorted();
      if (sortedConflicts.length > 0)
        changes.push(
          `Merged ${path} key ${JSON.stringify(key)} into ${JSON.stringify(nextKey)}; kept existing values for conflicting fields: ${sortedConflicts.join(", ")}.`,
        );
      else
        changes.push(`Merged ${path} key ${JSON.stringify(key)} into ${JSON.stringify(nextKey)}.`);
      continue;
    }
    setRecordEntry(next, nextKey, child);
  }
  return {
    value: changed ? next : record,
    changed,
  };
}
function rewriteKnownModelRefs(value, path, changes) {
  const key = pathKey(path);
  if (typeof value === "string") {
    if (!MODEL_REF_STRING_KEYS.has(key) && !isChannelModelOverridePath(path))
      return {
        value,
        changed: false,
      };
    const next = rewriteModelRefString(value, path, changes);
    return {
      value: next,
      changed: next !== value,
    };
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((entry, index) => {
      if (typeof entry === "string" && MODEL_REF_ARRAY_KEYS.has(key)) {
        const rewritten = rewriteModelRefString(entry, `${path}.${index}`, changes);
        changed ||= rewritten !== entry;
        return rewritten;
      }
      const rewritten = rewriteKnownModelRefs(entry, `${path}.${index}`, changes);
      changed ||= rewritten.changed;
      return rewritten.value;
    });
    return {
      value: changed ? next : value,
      changed,
    };
  }
  const record = getRecord(value);
  if (!record)
    return {
      value,
      changed: false,
    };
  let working = record;
  let changed = false;
  if (MODEL_REF_MAP_KEYS.has(key)) {
    const rewrittenKeys = rewriteModelRefMapKeys(record, path, changes);
    working = rewrittenKeys.value;
    changed ||= rewrittenKeys.changed;
  }
  const next = {};
  for (const [childKey, child] of Object.entries(working)) {
    const rewritten = rewriteKnownModelRefs(child, `${path}.${childKey}`, changes);
    changed ||= rewritten.changed;
    setRecordEntry(next, childKey, rewritten.value);
  }
  return {
    value: changed ? next : value,
    changed,
  };
}
const RETIRED_MODEL_REF_MESSAGE =
  'Configured retired model refs are no longer in the bundled catalogs; run "openclaw doctor --fix" to upgrade them.';
const LEGACY_OPENAI_CODEX_PROVIDER_ID = "openai-codex";
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS = [
  "apiKey",
  "auth",
  "request",
  "timeoutSeconds",
  "region",
  "injectNumCtxForOpenAICompat",
  "localService",
  "headers",
  "authHeader",
];
const CANONICAL_PROVIDER_MODEL_LEAK_KEYS = [
  "apiKey",
  "auth",
  "contextWindow",
  "contextTokens",
  "maxTokens",
  "timeoutSeconds",
  "region",
  "injectNumCtxForOpenAICompat",
  "params",
  "agentRuntime",
  "localService",
  "headers",
  "authHeader",
  "request",
];
function hasCanonicalOpenAIProvider(providers) {
  return Object.keys(providers).some(
    (providerId) => normalizeProviderId(providerId) === OPENAI_PROVIDER_ID,
  );
}
function normalizeLegacyOpenAIResponsesApi(providerId, provider, changes) {
  let changed = false;
  const next = { ...provider };
  if (next.api === LEGACY_OPENAI_CODEX_RESPONSES_API) {
    next.api = OPENAI_CHATGPT_RESPONSES_API;
    changes.push(
      `Moved models.providers.${providerId}.api "${LEGACY_OPENAI_CODEX_RESPONSES_API}" → "${OPENAI_CHATGPT_RESPONSES_API}".`,
    );
    changed = true;
  }
  if (Array.isArray(provider.models)) {
    let modelsChanged = false;
    const nextModels = provider.models.map((model, index) => {
      const modelRecord = getRecord(model);
      if (!modelRecord || modelRecord.api !== LEGACY_OPENAI_CODEX_RESPONSES_API) return model;
      modelsChanged = true;
      changes.push(
        `Moved models.providers.${providerId}.models[${index}].api "${LEGACY_OPENAI_CODEX_RESPONSES_API}" → "${OPENAI_CHATGPT_RESPONSES_API}".`,
      );
      return {
        ...modelRecord,
        api: OPENAI_CHATGPT_RESPONSES_API,
      };
    });
    if (modelsChanged) {
      next.models = nextModels;
      changed = true;
    }
  }
  return {
    value: next,
    changed,
  };
}
function hasOwnDefinedProperty(record, key) {
  return Object.hasOwn(record, key) && record[key] !== void 0;
}
function collectModelMergeBlockers(params) {
  const blockers = [];
  for (const key of MODEL_UNSCOPED_PROVIDER_DEFAULT_KEYS)
    if (hasOwnDefinedProperty(params.legacy, key))
      blockers.push(`models.providers.${LEGACY_OPENAI_CODEX_PROVIDER_ID}.${key}`);
  for (const key of CANONICAL_PROVIDER_MODEL_LEAK_KEYS)
    if (hasOwnDefinedProperty(params.canonical, key))
      blockers.push(`models.providers.${OPENAI_PROVIDER_ID}.${key}`);
  return blockers;
}
function getCanonicalOpenAIProviderEntry(providers) {
  const key = Object.keys(providers).find((k) => normalizeProviderId(k) === OPENAI_PROVIDER_ID);
  const value = key ? getRecord(providers[key]) : void 0;
  return key && value
    ? {
        key,
        value,
      }
    : void 0;
}
function getMergeableLegacyOpenAIModels(params) {
  const legacyModels = Array.isArray(params.legacy.models) ? params.legacy.models : [];
  const canonicalModels = Array.isArray(params.canonical.models) ? params.canonical.models : [];
  const canonicalModelIds = /* @__PURE__ */ new Set();
  const canonicalModelNames = /* @__PURE__ */ new Set();
  for (const m of canonicalModels) {
    const mr = getRecord(m);
    if (typeof mr?.id === "string" && mr.id) canonicalModelIds.add(mr.id);
    if (typeof mr?.name === "string" && mr.name) canonicalModelNames.add(mr.name);
  }
  return legacyModels.filter((m) => {
    const mr = getRecord(m);
    if (!mr) return false;
    const id = typeof mr.id === "string" ? mr.id : void 0;
    const name = typeof mr.name === "string" ? mr.name : void 0;
    if (!id && !name) return false;
    return id ? !canonicalModelIds.has(id) : name ? !canonicalModelNames.has(name) : false;
  });
}
function hasAutoFixableLegacyOpenAICodexProvider(providersValue) {
  const providers = getRecord(providersValue);
  if (!providers) return false;
  const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
  for (const [providerId, providerValue] of Object.entries(providers)) {
    const provider = getRecord(providerValue);
    if (!provider || normalizeProviderId(providerId) !== LEGACY_OPENAI_CODEX_PROVIDER_ID) continue;
    const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, []);
    if (normalized.changed || !canonicalEntry) return true;
    if (
      getMergeableLegacyOpenAIModels({
        canonical: canonicalEntry.value,
        legacy: normalized.value,
      }).length === 0
    )
      return true;
    if (
      collectModelMergeBlockers({
        canonical: canonicalEntry.value,
        legacy: normalized.value,
      }).length === 0
    )
      return true;
  }
  return false;
}
function collectBlockedLegacyOpenAICodexProviderWarnings(raw) {
  const providers = getRecord(getRecord(getRecord(raw)?.models)?.providers);
  const canonicalEntry = providers ? getCanonicalOpenAIProviderEntry(providers) : void 0;
  if (!providers || !canonicalEntry) return [];
  const warnings = [];
  for (const [providerId, providerValue] of Object.entries(providers)) {
    const provider = getRecord(providerValue);
    if (!provider || normalizeProviderId(providerId) !== LEGACY_OPENAI_CODEX_PROVIDER_ID) continue;
    const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, []);
    if (normalized.changed) continue;
    if (
      getMergeableLegacyOpenAIModels({
        canonical: canonicalEntry.value,
        legacy: normalized.value,
      }).length === 0
    )
      continue;
    const mergeBlockers = collectModelMergeBlockers({
      canonical: canonicalEntry.value,
      legacy: normalized.value,
    });
    if (mergeBlockers.length === 0) continue;
    warnings.push(
      `models.providers.${providerId} cannot be merged automatically into models.providers.${canonicalEntry.key} because provider-level defaults cannot be represented safely on merged models: ${mergeBlockers.join(", ")}. Move the affected model/provider defaults manually before removing models.providers.${providerId}.`,
    );
  }
  return warnings;
}
function buildMergedLegacyOpenAIModel(model, legacyProvider) {
  const modelRecord = getRecord(model);
  if (!modelRecord) return model;
  const patch = {};
  const legacyBaseUrl =
    typeof legacyProvider.baseUrl === "string" ? legacyProvider.baseUrl : void 0;
  const legacyApi = typeof legacyProvider.api === "string" ? legacyProvider.api : void 0;
  const legacyParams = getRecord(legacyProvider.params);
  const legacyAgentRuntime = getRecord(legacyProvider.agentRuntime);
  if (legacyBaseUrl && !modelRecord.baseUrl) patch.baseUrl = legacyBaseUrl;
  if (legacyApi && !modelRecord.api) patch.api = legacyApi;
  for (const key of ["contextWindow", "contextTokens", "maxTokens"])
    if (typeof legacyProvider[key] === "number" && modelRecord[key] === void 0)
      patch[key] = legacyProvider[key];
  if (legacyParams) {
    const modelParams = getRecord(modelRecord.params);
    if (modelParams)
      patch.params = {
        ...legacyParams,
        ...modelParams,
      };
    else if (modelRecord.params === void 0) patch.params = legacyParams;
  }
  if (legacyAgentRuntime && modelRecord.agentRuntime === void 0)
    patch.agentRuntime = legacyAgentRuntime;
  if (
    modelRecord.metadataSource === void 0 &&
    isLegacyModelsAddCodexMetadataModel({
      provider: LEGACY_OPENAI_CODEX_PROVIDER_ID,
      model: modelRecord,
    })
  )
    patch.metadataSource = "models-add";
  return Object.keys(patch).length > 0 ? Object.assign({}, modelRecord, patch) : model;
}
function migrateLegacyOpenAICodexProvider(raw, changes) {
  const models = getRecord(raw.models);
  const providers = getRecord(models?.providers);
  if (!models || !providers) return;
  let providersChanged = false;
  for (const [providerId, providerValue] of Object.entries({ ...providers })) {
    const provider = getRecord(providers[providerId]) ?? getRecord(providerValue);
    if (!provider) continue;
    const normalized = normalizeLegacyOpenAIResponsesApi(providerId, provider, changes);
    if (normalizeProviderId(providerId) !== LEGACY_OPENAI_CODEX_PROVIDER_ID) {
      if (normalized.changed) {
        providers[providerId] = normalized.value;
        providersChanged = true;
      }
      continue;
    }
    if (!hasCanonicalOpenAIProvider(providers)) {
      providers[OPENAI_PROVIDER_ID] = normalized.value;
      changes.push(
        `Moved models.providers.${LEGACY_OPENAI_CODEX_PROVIDER_ID} → models.providers.${OPENAI_PROVIDER_ID}.`,
      );
    } else {
      const canonicalEntry = getCanonicalOpenAIProviderEntry(providers);
      const canonicalKey = canonicalEntry?.key ?? OPENAI_PROVIDER_ID;
      const canonical = canonicalEntry?.value ?? {};
      const canonicalModels = Array.isArray(canonical.models) ? canonical.models : [];
      const modelsToMerge = getMergeableLegacyOpenAIModels({
        canonical,
        legacy: normalized.value,
      });
      const mergeBlockers =
        modelsToMerge.length > 0
          ? collectModelMergeBlockers({
              canonical,
              legacy: normalized.value,
            })
          : [];
      if (mergeBlockers.length > 0) {
        if (normalized.changed) {
          providers[providerId] = normalized.value;
          providersChanged = true;
          changes.push(
            `Skipped merging models.providers.${LEGACY_OPENAI_CODEX_PROVIDER_ID} into models.providers.${OPENAI_PROVIDER_ID} because provider-level defaults cannot be represented safely on merged models: ${mergeBlockers.join(", ")}.`,
          );
        }
        continue;
      }
      const stamped = modelsToMerge.map((m) => buildMergedLegacyOpenAIModel(m, normalized.value));
      if (stamped.length > 0) {
        providers[canonicalKey] = {
          ...canonical,
          models: [...canonicalModels, ...stamped],
        };
        const mergedIds = stamped
          .map((m) => {
            const mr = getRecord(m);
            return typeof mr?.id === "string" && mr.id
              ? mr.id
              : typeof mr?.name === "string" && mr.name
                ? mr.name
                : "unknown";
          })
          .join(", ");
        changes.push(
          `Merged ${stamped.length} model(s) from models.providers.${LEGACY_OPENAI_CODEX_PROVIDER_ID} into models.providers.${OPENAI_PROVIDER_ID}: ${mergedIds}.`,
        );
      } else
        changes.push(
          `Removed models.providers.${LEGACY_OPENAI_CODEX_PROVIDER_ID} because models.providers.${OPENAI_PROVIDER_ID} already exists.`,
        );
    }
    delete providers[providerId];
    providersChanged = true;
  }
  if (providersChanged) models.providers = providers;
}
const RETIRED_MODEL_REF_RULES = [
  "agents",
  "plugins",
  "messages",
  "tools",
  "hooks",
  "channels",
  "models",
].map((section) => ({
  path: [section],
  message: RETIRED_MODEL_REF_MESSAGE,
  match: (value) => scanKnownModelRefs(value),
}));
/** Legacy config migration specs for model/provider runtime config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS = [
  defineLegacyConfigMigration({
    id: "models.providers.openai-codex->models.providers.openai",
    describe: "Move legacy OpenAI Codex provider config to canonical OpenAI provider config",
    legacyRules: [
      {
        path: ["models", "providers"],
        message:
          'models.providers.openai-codex is legacy; run "openclaw doctor --fix" to move it to models.providers.openai.',
        match: (value) => hasAutoFixableLegacyOpenAICodexProvider(value),
      },
      {
        path: ["models", "providers"],
        message:
          'openai-codex-responses is legacy; run "openclaw doctor --fix" to use openai-chatgpt-responses.',
        match: (value) => {
          const providers = getRecord(value);
          return providers
            ? Object.values(providers).some((providerValue) => {
                const provider = getRecord(providerValue);
                return (
                  provider?.api === LEGACY_OPENAI_CODEX_RESPONSES_API ||
                  (Array.isArray(provider?.models) &&
                    provider.models.some(
                      (model) => getRecord(model)?.api === LEGACY_OPENAI_CODEX_RESPONSES_API,
                    ))
                );
              })
            : false;
        },
      },
    ],
    apply: migrateLegacyOpenAICodexProvider,
  }),
  defineLegacyConfigMigration({
    id: "models.retired-model-refs",
    describe: "Upgrade retired model refs to current catalog entries",
    legacyRules: RETIRED_MODEL_REF_RULES,
    apply: (raw, changes) => {
      const rewritten = rewriteKnownModelRefs(raw, "config", changes);
      const rewrittenRecord = getRecord(rewritten.value);
      if (!rewritten.changed || !rewrittenRecord) return;
      for (const key of Object.keys(raw)) delete raw[key];
      for (const [key, value] of Object.entries(rewrittenRecord)) setRecordEntry(raw, key, value);
    },
  }),
  defineLegacyConfigMigration({
    id: "agents.defaults.models.vllm.params.qwenThinkingFormat->models.providers.vllm.models.compat.thinkingFormat",
    describe: "Move legacy vLLM Qwen thinking params to model compat metadata",
    legacyRules: [
      LEGACY_VLLM_QWEN_AGENT_THINKING_FORMAT_RULE,
      LEGACY_VLLM_QWEN_PROVIDER_THINKING_FORMAT_RULE,
      LEGACY_VLLM_QWEN_PROVIDER_MODEL_THINKING_FORMAT_RULE,
      LEGACY_VLLM_QWEN_NORMALIZED_PROVIDER_THINKING_FORMAT_RULE,
      LEGACY_VLLM_QWEN_DEFAULT_PARAMS_THINKING_FORMAT_RULE,
      LEGACY_VLLM_QWEN_AGENT_PARAMS_THINKING_FORMAT_RULE,
    ],
    apply: (raw, changes) => {
      const agentsDefaults = getRecord(getRecord(raw.agents)?.defaults);
      const defaultModels = getRecord(agentsDefaults?.models);
      if (defaultModels)
        for (const [key, entry] of Object.entries(defaultModels)) {
          const modelId = parseVllmAgentModelKey(key);
          const entryRecord = getRecord(entry);
          const params = getRecord(entryRecord?.params);
          if (!modelId || !entryRecord || !params) continue;
          const legacyFormat = getLegacyVllmQwenThinkingFormat(params);
          if (!legacyFormat) continue;
          const target = legacyFormat.compat ? findOrCreateVllmModelEntry(raw, modelId) : void 0;
          if (legacyFormat.compat && !target) continue;
          applyLegacyVllmQwenThinkingFormat({
            sourcePath: `agents.defaults.models.${JSON.stringify(key)}.params`,
            legacyParams: params,
            target: target ?? {
              model: {},
              index: -1,
            },
            legacyFormat,
            changes,
          });
          if (Object.keys(params).length === 0) delete entryRecord.params;
        }
      const vllmProvider = findVllmProvider(getRecord(getRecord(raw.models)?.providers));
      const vllmModels = vllmProvider?.models;
      if (Array.isArray(vllmModels))
        for (const [index, model] of vllmModels.entries()) {
          const modelRecord = getRecord(model);
          const params = getRecord(modelRecord?.params);
          if (!modelRecord || !params) continue;
          const legacyFormat = getLegacyVllmQwenThinkingFormat(params);
          if (!legacyFormat) continue;
          applyLegacyVllmQwenThinkingFormat({
            sourcePath: `models.providers.vllm.models[${index}].params`,
            legacyParams: params,
            target: {
              model: modelRecord,
              index,
            },
            legacyFormat,
            changes,
          });
          if (Object.keys(params).length === 0) delete modelRecord.params;
        }
      const providerParams = getRecord(vllmProvider?.params);
      if (providerParams) {
        const providerLegacyFormat = getLegacyVllmQwenThinkingFormat(providerParams);
        if (providerLegacyFormat) {
          const providerModelIds = [
            ...collectVllmModelIdsFromSelection(agentsDefaults?.model),
            ...collectVllmModelIdsFromAgentModelMap(defaultModels),
            ...collectVllmModelIdsFromAgentList(getRecord(raw.agents)?.list),
          ];
          const targets = combineVllmModelTargets(
            listExistingVllmModelTargets(raw),
            createVllmModelTargets(raw, providerModelIds),
          );
          if (targets.length === 0)
            removeUntargetedLegacyVllmQwenThinkingFormat({
              sourcePath: "models.providers.vllm.params",
              legacyParams: providerParams,
              legacyFormat: providerLegacyFormat,
              changes,
            });
          else
            for (const target of targets)
              applyLegacyVllmQwenThinkingFormat({
                sourcePath: "models.providers.vllm.params",
                legacyParams: providerParams,
                target,
                legacyFormat: providerLegacyFormat,
                changes,
              });
          if (Object.keys(providerParams).length === 0) delete vllmProvider?.params;
        }
      }
      const defaultParams = getRecord(agentsDefaults?.params);
      if (defaultParams) {
        const defaultLegacyFormat = getLegacyVllmQwenThinkingFormat(defaultParams);
        if (defaultLegacyFormat) {
          const defaultModelIds = [
            ...collectVllmModelIdsFromSelection(agentsDefaults?.model),
            ...collectVllmModelIdsFromAgentModelMap(defaultModels),
          ];
          const targets =
            defaultModelIds.length > 0
              ? createVllmModelTargets(raw, defaultModelIds)
              : listExistingVllmModelTargets(raw);
          if (targets.length === 0)
            removeUntargetedLegacyVllmQwenThinkingFormat({
              sourcePath: "agents.defaults.params",
              legacyParams: defaultParams,
              legacyFormat: defaultLegacyFormat,
              changes,
            });
          else
            for (const target of targets)
              applyLegacyVllmQwenThinkingFormat({
                sourcePath: "agents.defaults.params",
                legacyParams: defaultParams,
                target,
                legacyFormat: defaultLegacyFormat,
                changes,
              });
          if (Object.keys(defaultParams).length === 0) delete agentsDefaults?.params;
        }
      }
      const agentList = getRecord(raw.agents)?.list;
      if (!Array.isArray(agentList)) return;
      for (const [index, agent] of agentList.entries()) {
        const agentRecord = getRecord(agent);
        const agentParams = getRecord(agentRecord?.params);
        const agentLegacyFormat = agentParams
          ? getLegacyVllmQwenThinkingFormat(agentParams)
          : void 0;
        if (!agentRecord || !agentParams || !agentLegacyFormat) continue;
        const explicitAgentModelIds = [
          ...collectVllmModelIdsFromSelection(agentRecord.model),
          ...collectVllmModelIdsFromAgentModelMap(agentRecord.models),
        ];
        const inheritedDefaultModelIds = [
          ...collectVllmModelIdsFromSelection(agentsDefaults?.model),
          ...collectVllmModelIdsFromAgentModelMap(defaultModels),
        ];
        const agentModelIds =
          explicitAgentModelIds.length > 0 ? explicitAgentModelIds : inheritedDefaultModelIds;
        const targets =
          agentModelIds.length > 0
            ? createVllmModelTargets(raw, agentModelIds)
            : listExistingVllmModelTargets(raw);
        if (targets.length === 0)
          removeUntargetedLegacyVllmQwenThinkingFormat({
            sourcePath: `agents.list[${index}].params`,
            legacyParams: agentParams,
            legacyFormat: agentLegacyFormat,
            changes,
          });
        else
          for (const target of targets)
            applyLegacyVllmQwenThinkingFormat({
              sourcePath: `agents.list[${index}].params`,
              legacyParams: agentParams,
              target,
              legacyFormat: agentLegacyFormat,
              changes,
            });
        if (Object.keys(agentParams).length === 0) delete agentRecord.params;
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "models.providers.*.models.*.compat.thinkingFormat-invalid",
    describe: "Remove unrecognized compat.thinkingFormat values from provider model entries",
    legacyRules: [INVALID_THINKING_FORMAT_RULE],
    apply: (raw, changes) => {
      const providers = getRecord(getRecord(raw.models)?.providers);
      if (!providers) return;
      for (const [providerId, provider] of Object.entries(providers)) {
        const models = getRecord(provider)?.models;
        if (!Array.isArray(models)) continue;
        for (const [index, model] of models.entries()) {
          const compat = getRecord(getRecord(model)?.compat);
          if (!compat) continue;
          const thinkingFormat = compat.thinkingFormat;
          if (typeof thinkingFormat !== "string" || isModelThinkingFormat(thinkingFormat)) continue;
          delete compat.thinkingFormat;
          changes.push(
            `Removed models.providers.${providerId}.models.${index}.compat.thinkingFormat (unrecognized value ${JSON.stringify(thinkingFormat)}; runtime default applies).`,
          );
        }
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "models.providers.*.models.*.contextWindow-stale",
    describe: "Repair stale contextWindow values to match catalog defaults",
    legacyRules: [STALE_CONTEXT_WINDOW_RULE],
    apply: (raw, changes) => {
      const providers = getRecord(getRecord(raw.models)?.providers);
      if (!providers) return;
      for (const [providerId, provider] of Object.entries(providers)) {
        const models = getRecord(provider)?.models;
        if (!Array.isArray(models)) continue;
        for (const [index, model] of models.entries()) {
          if (!getRecord(model)) continue;
          const modelId = typeof model.id === "string" ? model.id : void 0;
          if (!modelId) continue;
          const contextWindow = model.contextWindow;
          if (typeof contextWindow !== "number" || !Number.isFinite(contextWindow)) continue;
          const fix = resolveStaleContextWindowFix({
            providerId,
            modelId,
            contextWindow,
          });
          if (!fix) continue;
          model.contextWindow = fix.correct;
          changes.push(
            `Repaired models.providers.${providerId}.models[${index}].${modelId}.contextWindow (${contextWindow} → ${fix.correct} to match catalog default).`,
          );
        }
      }
    },
  }),
];
//#endregion
export {
  ensureRecord as a,
  mergeMissing as c,
  defineLegacyConfigMigration as i,
  collectBlockedLegacyOpenAICodexProviderWarnings as n,
  getRecord as o,
  isLegacyModelsAddCodexMetadataModel as r,
  mapLegacyAudioTranscription as s,
  LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS as t,
};
