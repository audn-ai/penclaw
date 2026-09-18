import { getApiProvider } from "@openclaw/ai/internal/runtime";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import {
  a as diagnosticProviderRequestIdHash,
  n as diagnosticErrorFailureKind,
  t as diagnosticErrorCategory,
} from "./diagnostic-error-metadata-yrw7ASmg.js";
import {
  T as freezeDiagnosticTraceContext,
  o as emitTrustedDiagnosticEvent,
  s as emitTrustedDiagnosticEventWithPrivateData,
  t as areDiagnosticsEnabledForProcess,
  w as formatDiagnosticTraceparent,
  x as createChildDiagnosticTraceContext,
} from "./diagnostic-events-5-gsFhkM.js";
import { t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-CU_-DTjY.js";
import { c as markDiagnosticRunProgress } from "./diagnostic-run-activity-C7EqD7j0.js";
import {
  l as fireAndForgetBoundedHook,
  t as getGlobalHookRunner,
} from "./hook-runner-global-CPEPIvCK.js";
import { s as emitDiagnosticsTimelineEvent } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { r as createBoundaryAwareStreamFnForModel } from "./provider-stream-DDVQiA6H.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { Ht as normalizeUsage, Rt as derivePromptTokens } from "./session-accessor-PZVNxFCV.js";
import { o as createAnthropicVertexStreamFnForModel } from "./simple-completion-runtime-DThW6g7z.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/embedded-agent-runner/stream-resolution.ts
/**
 * Resolves provider stream functions and API keys for embedded agents.
 */
const embeddedAgentBaseStreamFnCache = /* @__PURE__ */ new WeakMap();
function resolveEmbeddedAgentBaseStreamFn(params) {
  const cached = embeddedAgentBaseStreamFnCache.get(params.session);
  if (cached !== void 0 || embeddedAgentBaseStreamFnCache.has(params.session)) return cached;
  const baseStreamFn = params.session.agent.streamFn;
  embeddedAgentBaseStreamFnCache.set(params.session, baseStreamFn);
  return baseStreamFn;
}
function isDefaultOpenClawStreamFnForModel(model, streamFn) {
  if (!streamFn || streamFn === streamSimple) return true;
  const api = typeof model.api === "string" ? model.api.trim() : "";
  if (!api) return false;
  const provider = getApiProvider(api);
  return streamFn === provider?.streamSimple || streamFn === provider?.stream;
}
function hasResolvedRuntimeApiKey(apiKey) {
  return typeof apiKey === "string" && apiKey.trim().length > 0;
}
function isOpenAICodexResponsesModel(model) {
  return model.provider === "openai" && model.api === "openai-chatgpt-responses";
}
function resolveOpenClawNativeCodexResponsesStreamFn(params) {
  if (!isOpenAICodexResponsesModel(params.model)) return;
  if (!isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn)) return;
  return params.currentStreamFn ?? streamSimple;
}
function describeEmbeddedAgentStreamStrategy(params) {
  if (params.providerStreamFn) return "provider";
  if (params.model.provider === "anthropic-vertex") return "anthropic-vertex";
  if (
    resolveOpenClawNativeCodexResponsesStreamFn({
      model: params.model,
      currentStreamFn: params.currentStreamFn,
    })
  )
    return "openclaw-native-codex-responses";
  if (isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn))
    return createBoundaryAwareStreamFnForModel(params.model)
      ? `boundary-aware:${params.model.api}`
      : "stream-simple";
  if (
    hasResolvedRuntimeApiKey(params.resolvedApiKey) &&
    createBoundaryAwareStreamFnForModel(params.model)
  )
    return `boundary-aware:${params.model.api}`;
  return "session-custom";
}
async function resolveEmbeddedAgentApiKey(params) {
  const resolvedApiKey = params.resolvedApiKey?.trim();
  if (resolvedApiKey) return resolvedApiKey;
  return params.authStorage ? await params.authStorage.getApiKey(params.provider) : void 0;
}
function resolveEmbeddedAgentStreamFn(params) {
  if (params.providerStreamFn)
    return wrapEmbeddedAgentStreamFn(params.providerStreamFn, {
      runSignal: params.signal,
      resolvedApiKey: params.resolvedApiKey,
      authProfileId: params.authProfileId,
      authStorage: params.authStorage,
      providerId: params.model.provider,
      promptCacheKey: params.promptCacheKey,
      transformContext: (context) =>
        context.systemPrompt
          ? {
              ...context,
              systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt),
            }
          : context,
    });
  const currentStreamFn = params.currentStreamFn ?? streamSimple;
  if (params.model.provider === "anthropic-vertex")
    return createAnthropicVertexStreamFnForModel(params.model);
  const openClawNativeCodexResponsesStreamFn = resolveOpenClawNativeCodexResponsesStreamFn({
    model: params.model,
    currentStreamFn: params.currentStreamFn,
  });
  if (openClawNativeCodexResponsesStreamFn)
    return wrapEmbeddedAgentStreamFn(openClawNativeCodexResponsesStreamFn, {
      runSignal: params.signal,
      resolvedApiKey: params.resolvedApiKey,
      authProfileId: params.authProfileId,
      authStorage: params.authStorage,
      providerId: params.model.provider,
      sessionId: params.sessionId,
      promptCacheKey: params.promptCacheKey,
      transformContext: (context) =>
        context.systemPrompt
          ? {
              ...context,
              systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt),
            }
          : context,
    });
  if (
    isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn) ||
    hasResolvedRuntimeApiKey(params.resolvedApiKey) ||
    params.transportAuthAvailable ||
    (params.model.api === "anthropic-messages" && params.model.provider !== "anthropic")
  ) {
    const boundaryAwareStreamFn = createBoundaryAwareStreamFnForModel(params.model);
    if (boundaryAwareStreamFn)
      return wrapEmbeddedAgentStreamFn(boundaryAwareStreamFn, {
        runSignal: params.signal,
        resolvedApiKey: params.resolvedApiKey,
        authProfileId: params.authProfileId,
        authStorage: params.authStorage,
        providerId: params.model.provider,
        promptCacheKey: params.promptCacheKey,
      });
  }
  const promptCacheKey = params.promptCacheKey?.trim();
  if (!promptCacheKey) return currentStreamFn;
  return wrapEmbeddedAgentStreamFn(currentStreamFn, {
    runSignal: params.signal,
    resolvedApiKey: void 0,
    authProfileId: void 0,
    authStorage: void 0,
    providerId: params.model.provider,
    promptCacheKey,
  });
}
function wrapEmbeddedAgentStreamFn(inner, params) {
  const transformContext = params.transformContext ?? ((context) => context);
  const mergeRunSignal = (options) => {
    const embeddedOptions = options;
    const signal = embeddedOptions?.signal ?? params.runSignal;
    let merged =
      params.sessionId && !embeddedOptions?.sessionId
        ? {
            ...embeddedOptions,
            sessionId: params.sessionId,
          }
        : embeddedOptions;
    const promptCacheKey = params.promptCacheKey?.trim();
    if (promptCacheKey && !merged?.promptCacheKey)
      merged = {
        ...merged,
        promptCacheKey,
      };
    if (params.authProfileId && !merged?.authProfileId)
      merged = {
        ...merged,
        authProfileId: params.authProfileId,
      };
    return signal
      ? {
          ...merged,
          signal,
        }
      : merged;
  };
  if (!params.authStorage && !params.resolvedApiKey)
    return (m, context, options) => inner(m, transformContext(context), mergeRunSignal(options));
  const { authStorage, providerId, resolvedApiKey } = params;
  return async (m, context, options) => {
    const selectedApiKey =
      (await resolveEmbeddedAgentApiKey({
        provider: providerId,
        resolvedApiKey,
        authStorage,
      })) ?? options?.apiKey;
    return inner(m, transformContext(context), {
      ...mergeRunSignal(options),
      apiKey: selectedApiKey,
    });
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-events.ts
/**
 * Emits diagnostic model-call events around embedded-agent stream functions.
 */
const MODEL_CALL_STREAM_PROGRESS_INTERVAL_MS = 3e4;
const MODEL_CALL_STREAM_PROGRESS_REASON = "model_call:stream_progress";
const MODEL_CALL_STREAM_RETURN_TIMEOUT_MS = 1e3;
const TRACEPARENT_HEADER_NAME = "traceparent";
const TIMELINE_ATTRIBUTE_MAX_LENGTH = 256;
function utf8JsonByteLength(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value), "utf8");
  } catch {
    return;
  }
}
function assignRequestPayloadBytes(state, payload) {
  const bytes = utf8JsonByteLength(payload);
  if (bytes !== void 0) state.requestPayloadBytes = bytes;
}
function utf8StringByteLength(value) {
  return Buffer.byteLength(value, "utf8");
}
function jsonCharLength(value) {
  try {
    return JSON.stringify(value)?.length;
  } catch {
    return;
  }
}
function streamDeltaByteLength(chunk) {
  const type = chunk.type;
  if (
    (type === "text_delta" || type === "thinking_delta" || type === "toolcall_delta") &&
    typeof chunk.delta === "string"
  )
    return utf8StringByteLength(chunk.delta);
}
function responseStreamChunkByteLengthUnchecked(chunk) {
  if (!isRecord(chunk)) return utf8JsonByteLength(chunk);
  const deltaBytes = streamDeltaByteLength(chunk);
  if (deltaBytes !== void 0) return deltaBytes;
  if (!("partial" in chunk)) return utf8JsonByteLength(chunk);
  const { partial: _partial, ...snapshotlessChunk } = chunk;
  return utf8JsonByteLength(snapshotlessChunk);
}
function responseStreamChunkByteLength(chunk) {
  try {
    return responseStreamChunkByteLengthUnchecked(chunk);
  } catch {
    return;
  }
}
function streamContextModelContentFields(policy, streamContext) {
  if (!policy?.anyModelContent || !isRecord(streamContext)) return;
  const content = {
    ...(policy.inputMessages && Array.isArray(streamContext.messages)
      ? { inputMessages: cloneDiagnosticContentValue(streamContext.messages) }
      : {}),
    ...(policy.systemPrompt && typeof streamContext.systemPrompt === "string"
      ? { systemPrompt: streamContext.systemPrompt }
      : {}),
    ...(policy.toolDefinitions && Array.isArray(streamContext.tools)
      ? { toolDefinitions: cloneDiagnosticContentValue(streamContext.tools) }
      : {}),
  };
  return Object.keys(content).length > 0 ? content : void 0;
}
function streamContextModelPromptStats(streamContext) {
  if (!isRecord(streamContext)) return;
  const messages = Array.isArray(streamContext.messages) ? streamContext.messages : void 0;
  const tools = Array.isArray(streamContext.tools) ? streamContext.tools : void 0;
  const systemPrompt =
    typeof streamContext.systemPrompt === "string" ? streamContext.systemPrompt : void 0;
  const inputMessagesChars = messages ? jsonCharLength(messages) : void 0;
  const toolDefinitionsChars = tools ? jsonCharLength(tools) : void 0;
  const systemPromptChars = systemPrompt?.length;
  if (
    messages === void 0 &&
    tools === void 0 &&
    systemPromptChars === void 0 &&
    inputMessagesChars === void 0 &&
    toolDefinitionsChars === void 0
  )
    return;
  const totalChars =
    (inputMessagesChars ?? 0) + (systemPromptChars ?? 0) + (toolDefinitionsChars ?? 0);
  return {
    ...(messages ? { inputMessagesCount: messages.length } : {}),
    ...(inputMessagesChars !== void 0 ? { inputMessagesChars } : {}),
    ...(systemPromptChars !== void 0 ? { systemPromptChars } : {}),
    ...(tools ? { toolDefinitionsCount: tools.length } : {}),
    ...(toolDefinitionsChars !== void 0 ? { toolDefinitionsChars } : {}),
    totalChars,
  };
}
function normalizedModelCallUsage(rawUsage) {
  if (!isRecord(rawUsage)) return;
  const usage = normalizeUsage(rawUsage);
  if (!usage) return;
  const promptTokens = derivePromptTokens(usage);
  return {
    ...usage,
    ...(promptTokens !== void 0 ? { promptTokens } : {}),
  };
}
function observeModelCallUsage(state, value) {
  if (!isRecord(value)) return;
  let rawUsage;
  try {
    rawUsage = value.usage;
  } catch {
    return;
  }
  const usage = normalizedModelCallUsage(rawUsage);
  if (usage) state.usage = usage;
}
function observeOutputMessageContent(state, chunk) {
  if (!isRecord(chunk)) return;
  let type;
  let message;
  try {
    type = chunk.type;
    message = type === "done" ? chunk.message : type === "error" ? chunk.error : void 0;
  } catch {
    return;
  }
  if (message !== void 0) {
    observeModelCallUsage(state, message);
    if (state.contentCapture?.outputMessages)
      state.outputMessages = [cloneDiagnosticContentValue(message)];
  }
}
function observeResultMessageContent(state, startedAt, result) {
  state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
  observeModelCallUsage(state, result);
  if (state.contentCapture?.outputMessages && state.outputMessages === void 0)
    state.outputMessages = [cloneDiagnosticContentValue(result)];
  if (state.responseStreamBytes === 0) {
    const bytes = utf8JsonByteLength(result);
    if (bytes !== void 0) state.responseStreamBytes = bytes;
  }
}
function observeResponseChunk(state, startedAt, chunk) {
  state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
  observeOutputMessageContent(state, chunk);
  const bytes = responseStreamChunkByteLength(chunk);
  if (bytes !== void 0) state.responseStreamBytes += bytes;
}
function maybeEmitModelCallStreamProgress(eventBase, state) {
  if (!areDiagnosticsEnabledForProcess()) return;
  const now = Date.now();
  const progressFields = {
    runId: eventBase.runId,
    ...(eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {}),
    ...(eventBase.sessionId ? { sessionId: eventBase.sessionId } : {}),
    reason: MODEL_CALL_STREAM_PROGRESS_REASON,
  };
  markDiagnosticRunProgress(progressFields);
  if (
    state.lastStreamProgressAt !== void 0 &&
    now - state.lastStreamProgressAt < MODEL_CALL_STREAM_PROGRESS_INTERVAL_MS
  )
    return;
  state.lastStreamProgressAt = now;
  emitTrustedDiagnosticEvent({
    type: "run.progress",
    ...progressFields,
  });
}
function modelCallSizeTimingFields(state) {
  return {
    ...(state.requestPayloadBytes !== void 0
      ? { requestPayloadBytes: state.requestPayloadBytes }
      : {}),
    ...(state.responseStreamBytes > 0 ? { responseStreamBytes: state.responseStreamBytes } : {}),
    ...(state.timeToFirstByteMs !== void 0 ? { timeToFirstByteMs: state.timeToFirstByteMs } : {}),
  };
}
function isPromiseLike(value) {
  if (value === null || (typeof value !== "object" && typeof value !== "function")) return false;
  try {
    return typeof value.then === "function";
  } catch {
    return false;
  }
}
function asyncIteratorFactory(value) {
  if (value === null || typeof value !== "object") return;
  try {
    const asyncIterator = value[Symbol.asyncIterator];
    if (typeof asyncIterator !== "function") return;
    return () => asyncIterator.call(value);
  } catch {
    return;
  }
}
function baseModelCallEvent(ctx, callId, trace, promptStats) {
  return {
    runId: ctx.runId,
    callId,
    ...(ctx.sessionKey && { sessionKey: ctx.sessionKey }),
    ...(ctx.sessionId && { sessionId: ctx.sessionId }),
    provider: ctx.provider,
    model: ctx.model,
    ...(ctx.api && { api: ctx.api }),
    ...(ctx.transport && { transport: ctx.transport }),
    ...(ctx.contextTokenBudget ? { contextTokenBudget: ctx.contextTokenBudget } : {}),
    ...(ctx.contextWindowSource ? { contextWindowSource: ctx.contextWindowSource } : {}),
    ...(ctx.contextWindowReferenceTokens
      ? { contextWindowReferenceTokens: ctx.contextWindowReferenceTokens }
      : {}),
    ...(promptStats ? { promptStats } : {}),
    trace,
  };
}
function modelContentPrivateData(modelContent) {
  return modelContent ? { modelContent } : void 0;
}
function modelCallCompletedContent(state) {
  if (!state.modelContent && !state.outputMessages) return;
  return {
    ...state.modelContent,
    ...(state.outputMessages ? { outputMessages: state.outputMessages } : {}),
  };
}
function modelCallUsageField(state) {
  return state.usage ? { usage: state.usage } : {};
}
function boundedTimelineAttribute(value) {
  return truncateUtf16Safe(value?.trim() ?? "", TIMELINE_ATTRIBUTE_MAX_LENGTH) || void 0;
}
function emitProviderRequestTimelineEvent(eventBase, startedAt, durationMs, ok) {
  const provider = boundedTimelineAttribute(eventBase.provider);
  const model = boundedTimelineAttribute(eventBase.model);
  const api = boundedTimelineAttribute(eventBase.api);
  const transport = boundedTimelineAttribute(eventBase.transport);
  emitDiagnosticsTimelineEvent({
    type: "provider.request",
    name: "provider.request",
    timestamp: new Date(startedAt).toISOString(),
    runId: eventBase.runId,
    spanId: eventBase.callId,
    durationMs,
    provider,
    operation: api ?? transport ?? "model.call",
    ok,
    attributes: {
      ...(model ? { model } : {}),
      ...(api ? { api } : {}),
      ...(transport ? { transport } : {}),
    },
  });
}
function modelCallErrorFields(err) {
  const upstreamRequestIdHash = diagnosticProviderRequestIdHash(err);
  const failureKind = diagnosticErrorFailureKind(err);
  return {
    errorCategory: diagnosticErrorCategory(err),
    ...(failureKind
      ? {
          failureKind,
          memory: processMemoryUsageSnapshot(),
        }
      : {}),
    ...(upstreamRequestIdHash ? { upstreamRequestIdHash } : {}),
  };
}
function processMemoryUsageSnapshot() {
  try {
    const memory = process.memoryUsage();
    return {
      rssBytes: memory.rss,
      heapTotalBytes: memory.heapTotal,
      heapUsedBytes: memory.heapUsed,
      externalBytes: memory.external,
      arrayBuffersBytes: memory.arrayBuffers,
    };
  } catch {
    return;
  }
}
function modelCallHookEventBase(eventBase) {
  return {
    runId: eventBase.runId,
    callId: eventBase.callId,
    ...(eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {}),
    ...(eventBase.sessionId ? { sessionId: eventBase.sessionId } : {}),
    provider: eventBase.provider,
    model: eventBase.model,
    ...(eventBase.api ? { api: eventBase.api } : {}),
    ...(eventBase.transport ? { transport: eventBase.transport } : {}),
    ...(eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {}),
    ...(eventBase.contextWindowSource
      ? { contextWindowSource: eventBase.contextWindowSource }
      : {}),
    ...(eventBase.contextWindowReferenceTokens
      ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens }
      : {}),
  };
}
function modelCallHookContext(eventBase) {
  return Object.freeze({
    runId: eventBase.runId,
    trace: eventBase.trace,
    ...(eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {}),
    ...(eventBase.sessionId ? { sessionId: eventBase.sessionId } : {}),
    modelProviderId: eventBase.provider,
    modelId: eventBase.model,
    ...(eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {}),
    ...(eventBase.contextWindowSource
      ? { contextWindowSource: eventBase.contextWindowSource }
      : {}),
    ...(eventBase.contextWindowReferenceTokens
      ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens }
      : {}),
  });
}
function dispatchModelCallStartedHook(eventBase) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("model_call_started")) return;
  const event = Object.freeze(modelCallHookEventBase(eventBase));
  const hookCtx = modelCallHookContext(eventBase);
  fireAndForgetBoundedHook(
    () => hookRunner.runModelCallStarted(event, hookCtx),
    "model_call_started plugin hook failed",
  );
}
function dispatchModelCallEndedHook(eventBase, fields) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("model_call_ended")) return;
  const event = Object.freeze({
    ...modelCallHookEventBase(eventBase),
    ...fields,
  });
  const hookCtx = modelCallHookContext(eventBase);
  fireAndForgetBoundedHook(
    () => hookRunner.runModelCallEnded(event, hookCtx),
    "model_call_ended plugin hook failed",
  );
}
function emitModelCallStarted(eventBase, modelContent) {
  emitTrustedDiagnosticEventWithPrivateData(
    {
      type: "model.call.started",
      ...eventBase,
    },
    modelContentPrivateData(modelContent),
  );
  dispatchModelCallStartedHook(eventBase);
}
function emitModelCallCompleted(eventBase, startedAt, state) {
  if (state.terminalEventEmitted) return;
  state.terminalEventEmitted = true;
  const durationMs = Date.now() - startedAt;
  const sizeTimingFields = modelCallSizeTimingFields(state);
  emitProviderRequestTimelineEvent(eventBase, startedAt, durationMs, true);
  emitTrustedDiagnosticEventWithPrivateData(
    {
      type: "model.call.completed",
      ...eventBase,
      durationMs,
      ...sizeTimingFields,
      ...modelCallUsageField(state),
    },
    modelContentPrivateData(modelCallCompletedContent(state)),
  );
  dispatchModelCallEndedHook(eventBase, {
    durationMs,
    outcome: "completed",
    ...sizeTimingFields,
  });
}
function emitModelCallError(eventBase, startedAt, state, fields) {
  if (state.terminalEventEmitted) return;
  state.terminalEventEmitted = true;
  const durationMs = Date.now() - startedAt;
  const sizeTimingFields = modelCallSizeTimingFields(state);
  emitProviderRequestTimelineEvent(eventBase, startedAt, durationMs, false);
  emitTrustedDiagnosticEventWithPrivateData(
    {
      type: "model.call.error",
      ...eventBase,
      durationMs,
      ...sizeTimingFields,
      ...fields,
      ...modelCallUsageField(state),
    },
    modelContentPrivateData(modelCallCompletedContent(state)),
  );
  dispatchModelCallEndedHook(eventBase, {
    durationMs,
    outcome: "error",
    ...sizeTimingFields,
    ...fields,
  });
}
function withDiagnosticRequestContext(options, trace, state, callId) {
  const traceparent = formatDiagnosticTraceparent(trace);
  const originalOnPayload = options?.onPayload;
  const onPayload = (payload, model) => {
    if (!originalOnPayload) {
      assignRequestPayloadBytes(state, payload);
      return;
    }
    const result = originalOnPayload(payload, model);
    if (isPromiseLike(result))
      return result.then((replacement) => {
        assignRequestPayloadBytes(state, replacement ?? payload);
        return replacement;
      });
    assignRequestPayloadBytes(state, result ?? payload);
    return result;
  };
  if (!traceparent)
    return {
      ...options,
      requestId: callId,
      onPayload,
    };
  const headers = {};
  for (const [key, value] of Object.entries(options?.headers ?? {})) {
    if (key.toLowerCase() === TRACEPARENT_HEADER_NAME) continue;
    headers[key] = value;
  }
  headers[TRACEPARENT_HEADER_NAME] = traceparent;
  return {
    ...options,
    requestId: callId,
    headers,
    onPayload,
  };
}
async function safeReturnIterator(iterator) {
  let returnResult;
  try {
    returnResult = iterator.return?.();
  } catch {
    return;
  }
  if (!returnResult) return;
  let timeout;
  try {
    await Promise.race([
      Promise.resolve(returnResult).catch(() => void 0),
      new Promise((resolve) => {
        timeout = setTimeout(resolve, MODEL_CALL_STREAM_RETURN_TIMEOUT_MS);
        const unref = typeof timeout === "object" && timeout ? timeout.unref : void 0;
        if (unref) unref.call(timeout);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
async function* observeModelCallIterator(iterator, eventBase, startedAt, state) {
  let iteratorSettled = false;
  try {
    for (;;) {
      const next = await iterator.next();
      if (next.done) {
        iteratorSettled = true;
        break;
      }
      observeResponseChunk(state, startedAt, next.value);
      maybeEmitModelCallStreamProgress(eventBase, state);
      yield next.value;
    }
    emitModelCallCompleted(eventBase, startedAt, state);
  } catch (err) {
    iteratorSettled = true;
    emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
    throw err;
  } finally {
    if (!iteratorSettled) {
      await safeReturnIterator(iterator);
      emitModelCallCompleted(eventBase, startedAt, state);
    }
  }
}
function observeModelCallFinalResult(result, eventBase, startedAt, state) {
  observeResultMessageContent(state, startedAt, result);
  emitModelCallCompleted(eventBase, startedAt, state);
  return result;
}
function createObservedResultFunction(stream, eventBase, startedAt, state) {
  if (!isRecord(stream) || typeof stream.result !== "function") return;
  const resultFn = stream.result;
  return (...args) => {
    try {
      const result = resultFn.apply(stream, args);
      if (isPromiseLike(result))
        return result.then(
          (resolved) => observeModelCallFinalResult(resolved, eventBase, startedAt, state),
          (err) => {
            emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
            throw err;
          },
        );
      return observeModelCallFinalResult(result, eventBase, startedAt, state);
    } catch (err) {
      emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
      throw err;
    }
  };
}
function observeModelCallStream(stream, createIterator, eventBase, startedAt, state) {
  const observedIterator = () =>
    observeModelCallIterator(createIterator(), eventBase, startedAt, state)[Symbol.asyncIterator]();
  const observedResult = createObservedResultFunction(stream, eventBase, startedAt, state);
  let hasNonConfigurableIterator;
  try {
    hasNonConfigurableIterator =
      Object.getOwnPropertyDescriptor(stream, Symbol.asyncIterator)?.configurable === false;
  } catch {
    hasNonConfigurableIterator = true;
  }
  if (hasNonConfigurableIterator)
    return {
      [Symbol.asyncIterator]: observedIterator,
      ...(observedResult ? { result: observedResult } : {}),
    };
  return new Proxy(stream, {
    get(target, property, receiver) {
      if (property === Symbol.asyncIterator) return observedIterator;
      if (property === "result" && observedResult) return observedResult;
      const value = Reflect.get(target, property, receiver);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}
function observeModelCallResult(result, eventBase, startedAt, state) {
  const createIterator = asyncIteratorFactory(result);
  if (createIterator)
    return observeModelCallStream(result, createIterator, eventBase, startedAt, state);
  emitModelCallCompleted(eventBase, startedAt, state);
  return result;
}
/**
 * Wraps a model stream function with diagnostic model-call lifecycle events,
 * traceparent propagation, request/response byte accounting, optional captured
 * model content, progress heartbeats, and plugin hook dispatch.
 */
function wrapStreamFnWithDiagnosticModelCallEvents(streamFn, ctx) {
  return (model, streamContext, options) => {
    const callId = ctx.nextCallId();
    const trace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(ctx.trace));
    const eventBase = baseModelCallEvent(
      ctx,
      callId,
      trace,
      areDiagnosticsEnabledForProcess() ? streamContextModelPromptStats(streamContext) : void 0,
    );
    const modelContent = streamContextModelContentFields(ctx.contentCapture, streamContext);
    emitModelCallStarted(eventBase, modelContent);
    ctx.onStarted?.();
    const startedAt = Date.now();
    const state = {
      responseStreamBytes: 0,
      modelContent,
      contentCapture: ctx.contentCapture,
    };
    const propagatedOptions = withDiagnosticRequestContext(options, trace, state, callId);
    try {
      const result = streamFn(model, streamContext, propagatedOptions);
      if (isPromiseLike(result))
        return result.then(
          (resolved) => observeModelCallResult(resolved, eventBase, startedAt, state),
          (err) => {
            emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
            throw err;
          },
        );
      return observeModelCallResult(result, eventBase, startedAt, state);
    } catch (err) {
      emitModelCallError(eventBase, startedAt, state, modelCallErrorFields(err));
      throw err;
    }
  };
}
//#endregion
export {
  resolveEmbeddedAgentStreamFn as a,
  resolveEmbeddedAgentBaseStreamFn as i,
  describeEmbeddedAgentStreamStrategy as n,
  resolveEmbeddedAgentApiKey as r,
  wrapStreamFnWithDiagnosticModelCallEvents as t,
};
