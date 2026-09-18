import { isOpenAIGpt56Model, projectRuntimeToolInputSchema } from "@openclaw/ai/internal/openai";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import "./parse-finite-number-Z7n6tXLk.js";
import {
  n as resolveMoonshotThinkingKeep,
  r as resolveMoonshotThinkingType,
  t as createMoonshotThinkingWrapper,
} from "./moonshot-thinking-B6iq8Wyv.js";
import { _ as parseStrictFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { t as createCorePluginStateSyncKeyedStore } from "./plugin-state-store-CdAHpy0G.js";
import {
  D as createToolStreamWrapper,
  o as createGoogleThinkingPayloadWrapper,
} from "./provider-stream-shared-CMy-5I0G.js";
import {
  _ as createOpenAITextVerbosityWrapper,
  a as createMinimaxFastModeWrapper,
  b as resolveOpenAIServiceTier,
  c as createOpenAIAttributionHeadersWrapper,
  f as createOpenAIFastModeWrapper,
  g as createOpenAIStringContentWrapper,
  h as createOpenAIServiceTierWrapper,
  i as isProxyReasoningUnsupported,
  m as createOpenAIResponsesContextManagementWrapper,
  p as createOpenAIReasoningCompatibilityWrapper,
  r as createOpenRouterWrapper,
  s as createCodexNativeWebSearchWrapper,
  t as createKilocodeWrapper,
  v as createOpenAIThinkingLevelWrapper,
  x as resolveOpenAITextVerbosity,
  y as resolveOpenAIFastMode,
} from "./proxy-BukewmR0.js";
import { i as resolveProxyFetchFromEnv } from "./proxy-fetch-BNm7PiNO.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/llm/providers/stream-wrappers/anthropic-family-tool-payload-compat.ts
function readPayloadField(record, field) {
  try {
    return {
      ok: true,
      value: Reflect.get(record, field),
    };
  } catch {
    return { ok: false };
  }
}
function isProviderSupportedSchemaViolation(violation) {
  return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
function projectJsonObjectSchema(schema, path) {
  const projection = projectRuntimeToolInputSchema(schema, path);
  if (
    !isRecord(projection.schema) ||
    projection.violations.some((violation) => !isProviderSupportedSchemaViolation(violation))
  )
    return;
  const properties = projection.schema.properties;
  const required = projection.schema.required;
  if (
    (properties !== void 0 && properties !== null && !isRecord(properties)) ||
    (required !== void 0 &&
      required !== null &&
      (!Array.isArray(required) || required.some((entry) => typeof entry !== "string")))
  )
    return;
  const normalizedSchema = { ...projection.schema };
  if (properties === null) delete normalizedSchema.properties;
  if (required === null) delete normalizedSchema.required;
  return normalizedSchema;
}
function snapshotJsonRecord(value) {
  try {
    const serialized = JSON.stringify(value);
    if (!serialized) return;
    const snapshot = JSON.parse(serialized);
    return isRecord(snapshot) ? snapshot : void 0;
  } catch {
    return;
  }
}
function snapshotToolMetadata(tool) {
  let fields;
  try {
    fields = Object.keys(tool);
  } catch {
    return;
  }
  const metadata = {};
  for (const field of fields) {
    if (field === "function" || field === "type") continue;
    const read = readPayloadField(tool, field);
    if (!read.ok) continue;
    try {
      const serialized = JSON.stringify(read.value);
      if (serialized !== void 0) metadata[field] = JSON.parse(serialized);
    } catch {}
  }
  return metadata;
}
function hasOpenAiAnthropicToolPayloadCompatFlag(model) {
  if (!model.compat || typeof model.compat !== "object" || Array.isArray(model.compat))
    return false;
  return model.compat.requiresOpenAiAnthropicToolPayload === true;
}
function requiresAnthropicToolPayloadCompatibilityForModel(model, options) {
  if (model.api !== "anthropic-messages") return false;
  return (
    Boolean(options?.toolSchemaMode || options?.toolChoiceMode) ||
    hasOpenAiAnthropicToolPayloadCompatFlag(model)
  );
}
function usesOpenAiFunctionAnthropicToolSchemaForModel(model, options) {
  return (
    options?.toolSchemaMode === "openai-functions" || hasOpenAiAnthropicToolPayloadCompatFlag(model)
  );
}
function usesOpenAiStringModeAnthropicToolChoiceForModel(model, options) {
  return (
    options?.toolChoiceMode === "openai-string-modes" ||
    hasOpenAiAnthropicToolPayloadCompatFlag(model)
  );
}
function normalizeOpenAiFunctionAnthropicToolDefinition(tool) {
  if (!isRecord(tool)) return;
  const functionField = readPayloadField(tool, "function");
  if (!functionField.ok) return;
  if (isRecord(functionField.value)) {
    const nameField = readPayloadField(functionField.value, "name");
    if (!nameField.ok) return;
    const name = normalizeOptionalString(nameField.value) ?? void 0;
    if (!name) return;
    const parametersField = readPayloadField(functionField.value, "parameters");
    if (!parametersField.ok) return;
    const parameters =
      parametersField.value === void 0
        ? void 0
        : projectJsonObjectSchema(parametersField.value, `${name}.parameters`);
    if (parametersField.value !== void 0 && !parameters) return;
    const functionSpec = {
      name,
      ...(parameters ? { parameters } : {}),
    };
    const descriptionField = readPayloadField(functionField.value, "description");
    if (
      descriptionField.ok &&
      typeof descriptionField.value === "string" &&
      descriptionField.value.trim()
    )
      functionSpec.description = descriptionField.value;
    const strictField = readPayloadField(functionField.value, "strict");
    if (strictField.ok && (typeof strictField.value === "boolean" || strictField.value === null))
      functionSpec.strict = strictField.value;
    const metadata = snapshotToolMetadata(tool);
    if (!metadata) return;
    return {
      kind: "function",
      name,
      projectedKind: "function",
      tool: {
        ...metadata,
        type: "function",
        function: functionSpec,
      },
    };
  }
  const nameField = readPayloadField(tool, "name");
  if (!nameField.ok) return;
  const rawName = normalizeOptionalString(nameField.value) ?? "";
  if (!rawName) {
    const snapshot = snapshotJsonRecord(tool);
    if (!snapshot) return;
    if (snapshot.type === "custom" && isRecord(snapshot.custom)) {
      const name = normalizeOptionalString(snapshot.custom.name) ?? void 0;
      if (!name) return;
      const inputSchema = snapshot.custom.input_schema;
      if (inputSchema === void 0)
        return {
          kind: "custom",
          name,
          projectedKind: "custom",
          tool: snapshot,
        };
      const parameters = projectJsonObjectSchema(inputSchema, `${name}.input_schema`);
      if (!parameters) return;
      const functionSpec = {
        name,
        parameters,
      };
      if (typeof snapshot.custom.description === "string" && snapshot.custom.description.trim())
        functionSpec.description = snapshot.custom.description;
      return {
        kind: "custom",
        name,
        projectedKind: "function",
        tool: {
          type: "function",
          function: functionSpec,
        },
      };
    }
    return { tool: snapshot };
  }
  const inputSchemaField = readPayloadField(tool, "input_schema");
  if (!inputSchemaField.ok) return;
  let parameters = {
    type: "object",
    properties: {},
  };
  if (isRecord(inputSchemaField.value)) {
    parameters = projectJsonObjectSchema(inputSchemaField.value, `${rawName}.input_schema`);
    if (!parameters) return;
  } else {
    const parametersField = readPayloadField(tool, "parameters");
    if (!parametersField.ok) return;
    if (isRecord(parametersField.value)) {
      parameters = projectJsonObjectSchema(parametersField.value, `${rawName}.parameters`);
      if (!parameters) return;
    } else if (inputSchemaField.value !== void 0 || parametersField.value !== void 0) return;
  }
  const functionSpec = {
    name: rawName,
    parameters,
  };
  const descriptionField = readPayloadField(tool, "description");
  if (
    descriptionField.ok &&
    typeof descriptionField.value === "string" &&
    descriptionField.value.trim()
  )
    functionSpec.description = descriptionField.value;
  const strictField = readPayloadField(tool, "strict");
  if (strictField.ok && typeof strictField.value === "boolean")
    functionSpec.strict = strictField.value;
  return {
    kind: "function",
    name: rawName,
    projectedKind: "function",
    tool: {
      type: "function",
      function: functionSpec,
    },
  };
}
function projectOpenAiFunctionAnthropicTools(tools) {
  const projectedTools = [];
  const customFunctionNames = /* @__PURE__ */ new Set();
  const customNames = /* @__PURE__ */ new Set();
  const functionNames = /* @__PURE__ */ new Set();
  for (const tool of tools) {
    const projection = normalizeOpenAiFunctionAnthropicToolDefinition(tool);
    if (!projection) continue;
    projectedTools.push(projection.tool);
    if (projection.kind === "custom" && projection.name) {
      customNames.add(projection.name);
      if (projection.projectedKind === "function") customFunctionNames.add(projection.name);
    } else if (projection.kind === "function" && projection.name)
      functionNames.add(projection.name);
  }
  return {
    customFunctionNames,
    customNames,
    functionNames,
    tools: projectedTools,
  };
}
function isProjectedToolAvailable(projection, kind, name) {
  return (
    !projection || (kind === "custom" ? projection.customNames : projection.functionNames).has(name)
  );
}
function projectToolChoiceKind(projection, kind, name) {
  return kind === "custom" && projection.customFunctionNames.has(name) ? "function" : kind;
}
function normalizeAllowedToolChoice(choice, toolProjection) {
  if (!toolProjection || !isRecord(choice.allowed_tools)) return choice;
  const mode = choice.allowed_tools.mode;
  if ((mode !== "auto" && mode !== "required") || !Array.isArray(choice.allowed_tools.tools))
    return choice;
  const tools = choice.allowed_tools.tools.flatMap((tool) => {
    const snapshot = snapshotJsonRecord(tool);
    if (!snapshot) return [];
    const kind =
      snapshot.type === "custom" || snapshot.type === "function" ? snapshot.type : void 0;
    const definition = kind && isRecord(snapshot[kind]) ? snapshot[kind] : void 0;
    const name = definition ? (normalizeOptionalString(definition.name) ?? "") : "";
    if (!kind || !name || !isProjectedToolAvailable(toolProjection, kind, name)) return [];
    return projectToolChoiceKind(toolProjection, kind, name) === "function"
      ? [
          {
            type: "function",
            function: { name },
          },
        ]
      : [
          {
            type: "custom",
            custom: { name },
          },
        ];
  });
  if (tools.length === 0) {
    if (mode === "auto") return "none";
    throw new Error(
      "OpenAI-compatible Anthropic tool_choice requires a tool, but no allowed tools survived payload conversion",
    );
  }
  return {
    type: "allowed_tools",
    allowed_tools: {
      mode,
      tools,
    },
  };
}
function normalizeOpenAiStringModeAnthropicToolChoice(toolChoice, toolProjection) {
  if (typeof toolChoice === "string") {
    if (toolChoice === "auto" && toolProjection?.tools.length === 0) return;
    if (toolChoice === "required" && toolProjection?.tools.length === 0)
      throw new Error(
        "OpenAI-compatible Anthropic tool_choice requires a tool, but no tools survived payload conversion",
      );
    return toolChoice;
  }
  if (!toolChoice || typeof toolChoice !== "object" || Array.isArray(toolChoice)) return toolChoice;
  const choice = toolChoice;
  if (choice.type === "auto") {
    if (toolProjection?.tools.length === 0) return;
    return "auto";
  }
  if (choice.type === "none") return "none";
  if (choice.type === "required" || choice.type === "any") {
    if (toolProjection && toolProjection.tools.length === 0)
      throw new Error(
        "OpenAI-compatible Anthropic tool_choice requires a tool, but no tools survived payload conversion",
      );
    return "required";
  }
  if (choice.type === "tool" && typeof choice.name === "string" && choice.name.trim()) {
    const name = choice.name.trim();
    if (!isProjectedToolAvailable(toolProjection, "function", name))
      throw new Error(
        `OpenAI-compatible Anthropic tool_choice requested unavailable tool "${name}" after payload conversion`,
      );
    return {
      type: "function",
      function: { name },
    };
  }
  if (choice.type === "function" && isRecord(choice.function)) {
    const name = normalizeOptionalString(choice.function.name) ?? "";
    if (name && !isProjectedToolAvailable(toolProjection, "function", name))
      throw new Error(
        `OpenAI-compatible Anthropic tool_choice requested unavailable tool "${name}" after payload conversion`,
      );
    if (name)
      return {
        type: "function",
        function: { name },
      };
  }
  if (choice.type === "custom" && isRecord(choice.custom)) {
    const name = normalizeOptionalString(choice.custom.name) ?? "";
    if (name && !isProjectedToolAvailable(toolProjection, "custom", name))
      throw new Error(
        `OpenAI-compatible Anthropic tool_choice requested unavailable tool "${name}" after payload conversion`,
      );
    if (name)
      return toolProjection && projectToolChoiceKind(toolProjection, "custom", name) === "function"
        ? {
            type: "function",
            function: { name },
          }
        : {
            type: "custom",
            custom: { name },
          };
  }
  if (choice.type === "allowed_tools") return normalizeAllowedToolChoice(choice, toolProjection);
  return toolChoice;
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createAnthropicToolPayloadCompatibilityWrapper(baseStreamFn, options) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, streamOptions) => {
    const originalOnPayload = streamOptions?.onPayload;
    return underlying(model, context, {
      ...streamOptions,
      onPayload: (payload) => {
        if (
          payload &&
          typeof payload === "object" &&
          requiresAnthropicToolPayloadCompatibilityForModel(model, options)
        ) {
          const payloadObj = payload;
          let toolProjection;
          if (
            Array.isArray(payloadObj.tools) &&
            usesOpenAiFunctionAnthropicToolSchemaForModel(model, options)
          ) {
            toolProjection = projectOpenAiFunctionAnthropicTools(payloadObj.tools);
            if (toolProjection.tools.length > 0) payloadObj.tools = toolProjection.tools;
            else delete payloadObj.tools;
          }
          if (usesOpenAiStringModeAnthropicToolChoiceForModel(model, options)) {
            const toolChoice = normalizeOpenAiStringModeAnthropicToolChoice(
              payloadObj.tool_choice,
              toolProjection,
            );
            if (toolChoice === void 0) delete payloadObj.tool_choice;
            else payloadObj.tool_choice = toolChoice;
          }
          if (
            isOpenAIGpt56Model(model) &&
            toolProjection?.tools.some((tool) => tool.type === "function")
          )
            payloadObj.reasoning_effort = "none";
        }
        return originalOnPayload?.(payload, model);
      },
    });
  };
}
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
function createOpenAIAnthropicToolPayloadCompatibilityWrapper(baseStreamFn) {
  return createAnthropicToolPayloadCompatibilityWrapper(baseStreamFn, {
    toolSchemaMode: "openai-functions",
    toolChoiceMode: "openai-string-modes",
  });
}
//#endregion
//#region src/agents/embedded-agent-runner/openrouter-model-capabilities.ts
/**
 * Runtime OpenRouter model capability detection.
 *
 * When an OpenRouter model is not in the built-in static list, we look up its
 * actual capabilities from a cached copy of the OpenRouter model catalog.
 *
 * Cache layers (checked in order):
 * 1. In-memory Map (instant, cleared on process restart)
 * 2. Shared SQLite state cache
 * 3. OpenRouter API fetch (populates both layers)
 *
 * Model capabilities are assumed stable — the cache has no TTL expiry.
 * A background refresh is triggered only when a model is not found in
 * the cache (i.e. a newly added model on OpenRouter).
 *
 * Sync callers can read whatever is already cached. Async callers can await a
 * one-time fetch so the first unknown-model lookup resolves with real
 * capabilities instead of the text-only fallback.
 */
const log = createSubsystemLogger("openrouter-model-capabilities");
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
const FETCH_TIMEOUT_MS = 1e4;
const OPENROUTER_MODELS_RESPONSE_MAX_BYTES = 16 * 1024 * 1024;
const SQLITE_CACHE_OWNER_ID = "core:openrouter-model-capabilities";
const SQLITE_CACHE_NAMESPACE = "models.v3";
const SQLITE_CACHE_MAX_ENTRIES = 1e4;
function isValidCapabilities(value) {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return (
    typeof record.name === "string" &&
    Array.isArray(record.input) &&
    typeof record.reasoning === "boolean" &&
    typeof record.contextWindow === "number" &&
    typeof record.maxTokens === "number"
  );
}
function openSqliteCacheStore() {
  return createCorePluginStateSyncKeyedStore({
    ownerId: SQLITE_CACHE_OWNER_ID,
    namespace: SQLITE_CACHE_NAMESPACE,
    maxEntries: SQLITE_CACHE_MAX_ENTRIES,
  });
}
function writeSqliteCache(map) {
  try {
    const store = openSqliteCacheStore();
    store.clear();
    for (const [id, capabilities] of map) store.register(id, capabilities);
  } catch (err) {
    const message = formatErrorMessage(err);
    log.debug(`Failed to write OpenRouter SQLite cache: ${message}`);
  }
}
function readSqliteCache() {
  try {
    const entries = openSqliteCacheStore().entries();
    if (entries.length === 0) return;
    const map = /* @__PURE__ */ new Map();
    for (const { key, value } of entries) if (isValidCapabilities(value)) map.set(key, value);
    return map.size > 0 ? map : void 0;
  } catch (err) {
    const message = formatErrorMessage(err);
    log.debug(`Failed to read OpenRouter SQLite cache: ${message}`);
    return;
  }
}
let cache;
let fetchInFlight;
const skipNextMissRefresh = /* @__PURE__ */ new Set();
function parseModel(model) {
  const input = ["text"];
  if (
    ((model.architecture?.modality ?? model.modality ?? "").split("->")[0] ?? "").includes("image")
  )
    input.push("image");
  const supportedParameters = Array.isArray(model.supported_parameters)
    ? model.supported_parameters
    : void 0;
  return {
    name: model.name || model.id,
    input,
    reasoning: supportedParameters?.includes("reasoning") ?? false,
    ...(supportedParameters ? { supportsTools: supportedParameters.includes("tools") } : {}),
    contextWindow: model.top_provider?.context_length ?? model.context_length ?? 128e3,
    maxTokens:
      model.top_provider?.max_completion_tokens ??
      model.max_completion_tokens ??
      model.max_output_tokens ??
      8192,
    cost: {
      input: (parseStrictFiniteNumber(model.pricing?.prompt) ?? 0) * 1e6,
      output: (parseStrictFiniteNumber(model.pricing?.completion) ?? 0) * 1e6,
      cacheRead: (parseStrictFiniteNumber(model.pricing?.input_cache_read) ?? 0) * 1e6,
      cacheWrite: (parseStrictFiniteNumber(model.pricing?.input_cache_write) ?? 0) * 1e6,
    },
  };
}
async function cancelUnreadResponseBody(response) {
  if (response && !response.bodyUsed) await response.body?.cancel().catch(() => void 0);
}
async function doFetch() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let response;
  try {
    response = await (resolveProxyFetchFromEnv() ?? globalThis.fetch)(OPENROUTER_MODELS_URL, {
      signal: controller.signal,
    });
    if (!response.ok) {
      log.warn(`OpenRouter models API returned ${response.status}`);
      return;
    }
    const bytes = await readResponseWithLimit(response, OPENROUTER_MODELS_RESPONSE_MAX_BYTES, {
      onOverflow: ({ size }) =>
        /* @__PURE__ */ new Error(`OpenRouter models response too large: ${size} bytes`),
    });
    const models = JSON.parse(bytes.toString("utf8")).data ?? [];
    const map = /* @__PURE__ */ new Map();
    for (const model of models) {
      if (!model.id) continue;
      map.set(model.id, parseModel(model));
    }
    cache = map;
    writeSqliteCache(map);
    log.debug(`Cached ${map.size} OpenRouter models from API`);
  } catch (err) {
    const message = formatErrorMessage(err);
    log.warn(`Failed to fetch OpenRouter models: ${message}`);
  } finally {
    clearTimeout(timeout);
    await cancelUnreadResponseBody(response);
  }
}
function triggerFetch() {
  if (fetchInFlight) return;
  fetchInFlight = doFetch().finally(() => {
    fetchInFlight = void 0;
  });
}
/**
 * Ensure the cache is populated. Checks in-memory first, then SQLite, then
 * triggers a background API fetch as a last resort.
 * Does not block — returns immediately.
 */
function ensureOpenRouterModelCache() {
  if (cache) return;
  const stored = readSqliteCache();
  if (stored) {
    cache = stored;
    log.debug(`Loaded ${stored.size} OpenRouter models from SQLite cache`);
    return;
  }
  triggerFetch();
}
/**
 * Ensure capabilities for a specific model are available before first use.
 *
 * Known cached entries return immediately. Unknown entries wait for at most
 * one catalog fetch, then leave sync resolution to read from the populated
 * cache on the same request.
 *
 * @deprecated OpenRouter provider-owned catalog helper; do not use from third-party plugins.
 */
async function loadOpenRouterModelCapabilities(modelId) {
  ensureOpenRouterModelCache();
  if (cache?.has(modelId)) return;
  let fetchPromise = fetchInFlight;
  if (!fetchPromise) {
    triggerFetch();
    fetchPromise = fetchInFlight;
  }
  await fetchPromise;
  if (!cache?.has(modelId)) skipNextMissRefresh.add(modelId);
}
/**
 * Synchronously look up model capabilities from the cache.
 *
 * If a model is not found but the cache exists, a background refresh is
 * triggered in case it's a newly added model not yet in the cache.
 *
 * @deprecated OpenRouter provider-owned catalog helper; do not use from third-party plugins.
 */
function getOpenRouterModelCapabilities(modelId) {
  const skipMissRefresh = skipNextMissRefresh.delete(modelId);
  if (!skipMissRefresh) ensureOpenRouterModelCache();
  const result = cache?.get(modelId);
  if (!result && skipMissRefresh) return;
  if (!result && cache && !fetchInFlight) triggerFetch();
  return result;
}
//#endregion
//#region src/plugin-sdk/provider-stream.ts
function hasFastModeParam(extraParams) {
  return Boolean(
    extraParams &&
    (Object.hasOwn(extraParams, "fastMode") || Object.hasOwn(extraParams, "fast_mode")),
  );
}
function resolveBooleanFastMode(extraParams) {
  const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
  if (typeof raw === "function") {
    const resolved = raw();
    return typeof resolved === "boolean" ? resolved : void 0;
  }
  return typeof raw === "boolean" ? raw : void 0;
}
/** Builds provider hook objects for one supported stream-wrapper family. */
function buildProviderStreamFamilyHooks(family) {
  switch (family) {
    case "google-thinking":
      return {
        wrapStreamFn: (ctx) => createGoogleThinkingPayloadWrapper(ctx.streamFn, ctx.thinkingLevel),
      };
    case "moonshot-thinking":
      return {
        wrapStreamFn: (ctx) => {
          const thinkingType = resolveMoonshotThinkingType({
            configuredThinking: ctx.extraParams?.thinking,
            thinkingLevel: ctx.thinkingLevel,
          });
          const thinkingKeep = resolveMoonshotThinkingKeep({
            configuredThinking: ctx.extraParams?.thinking,
          });
          return createMoonshotThinkingWrapper(ctx.streamFn, thinkingType, thinkingKeep);
        },
      };
    case "kilocode-thinking":
      return {
        wrapStreamFn: (ctx) => {
          const thinkingLevel =
            ctx.modelId === "kilo/auto" || isProxyReasoningUnsupported(ctx.modelId)
              ? void 0
              : ctx.thinkingLevel;
          return createKilocodeWrapper(ctx.streamFn, thinkingLevel);
        },
      };
    case "minimax-fast-mode":
      return {
        wrapStreamFn: (ctx) =>
          createMinimaxFastModeWrapper(ctx.streamFn, () => resolveBooleanFastMode(ctx.extraParams)),
      };
    case "openai-responses-defaults":
      return {
        wrapStreamFn: (ctx) => {
          let nextStreamFn = createOpenAIAttributionHeadersWrapper(ctx.streamFn);
          if (hasFastModeParam(ctx.extraParams))
            nextStreamFn = createOpenAIFastModeWrapper(nextStreamFn, () =>
              resolveOpenAIFastMode(ctx.extraParams),
            );
          const serviceTier = resolveOpenAIServiceTier(ctx.extraParams);
          if (serviceTier) nextStreamFn = createOpenAIServiceTierWrapper(nextStreamFn, serviceTier);
          const textVerbosity = resolveOpenAITextVerbosity(ctx.extraParams);
          if (textVerbosity)
            nextStreamFn = createOpenAITextVerbosityWrapper(nextStreamFn, textVerbosity);
          nextStreamFn = createCodexNativeWebSearchWrapper(nextStreamFn, {
            config: ctx.config,
            agentDir: ctx.agentDir,
            agentId: ctx.agentId,
            nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy,
          });
          nextStreamFn = createOpenAIStringContentWrapper(nextStreamFn);
          return createOpenAIResponsesContextManagementWrapper(
            createOpenAIReasoningCompatibilityWrapper(
              createOpenAIThinkingLevelWrapper(nextStreamFn, ctx.thinkingLevel),
            ),
            ctx.extraParams,
          );
        },
      };
    case "openrouter-thinking":
      return {
        wrapStreamFn: (ctx) => {
          const thinkingLevel =
            ctx.modelId === "auto" || isProxyReasoningUnsupported(ctx.modelId)
              ? void 0
              : ctx.thinkingLevel;
          return createOpenRouterWrapper(ctx.streamFn, thinkingLevel, ctx.extraParams);
        },
      };
    case "tool-stream-default-on":
      return {
        wrapStreamFn: (ctx) =>
          createToolStreamWrapper(ctx.streamFn, ctx.extraParams?.tool_stream !== false),
      };
  }
  throw new Error("Unsupported provider stream family");
}
/** @deprecated Google provider-owned stream hook shortcut; use local provider hooks instead. */
const GOOGLE_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("google-thinking");
/** @deprecated Kilocode provider-owned stream hook shortcut; use local provider hooks instead. */
const KILOCODE_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("kilocode-thinking");
/** @deprecated Moonshot provider-owned stream hook shortcut; use local provider hooks instead. */
const MOONSHOT_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("moonshot-thinking");
/** @deprecated MiniMax provider-owned stream hook shortcut; use local provider hooks instead. */
const MINIMAX_FAST_MODE_STREAM_HOOKS = buildProviderStreamFamilyHooks("minimax-fast-mode");
/** @deprecated OpenAI provider-owned stream hook shortcut; use local provider hooks instead. */
const OPENAI_RESPONSES_STREAM_HOOKS = buildProviderStreamFamilyHooks("openai-responses-defaults");
/** @deprecated OpenRouter provider-owned stream hook shortcut; use local provider hooks instead. */
const OPENROUTER_THINKING_STREAM_HOOKS = buildProviderStreamFamilyHooks("openrouter-thinking");
/** @deprecated Provider-owned stream hook shortcut; use local provider hooks instead. */
const TOOL_STREAM_DEFAULT_ON_HOOKS = buildProviderStreamFamilyHooks("tool-stream-default-on");
//#endregion
export {
  OPENAI_RESPONSES_STREAM_HOOKS as a,
  buildProviderStreamFamilyHooks as c,
  createAnthropicToolPayloadCompatibilityWrapper as d,
  createOpenAIAnthropicToolPayloadCompatibilityWrapper as f,
  MOONSHOT_THINKING_STREAM_HOOKS as i,
  getOpenRouterModelCapabilities as l,
  KILOCODE_THINKING_STREAM_HOOKS as n,
  OPENROUTER_THINKING_STREAM_HOOKS as o,
  MINIMAX_FAST_MODE_STREAM_HOOKS as r,
  TOOL_STREAM_DEFAULT_ON_HOOKS as s,
  GOOGLE_THINKING_STREAM_HOOKS as t,
  loadOpenRouterModelCapabilities as u,
};
