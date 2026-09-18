import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-y9xQv_q1.js";
import {
  a as resolveEmbeddedAgentStreamFn,
  t as wrapStreamFnWithDiagnosticModelCallEvents,
} from "./attempt.model-diagnostic-events-DQ7TPDX5.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import {
  C as createDiagnosticTraceContextFromActiveScope,
  T as freezeDiagnosticTraceContext,
  f as isDiagnosticsEnabled,
  o as emitTrustedDiagnosticEvent,
} from "./diagnostic-events-5-gsFhkM.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-CU_-DTjY.js";
import { t as applyExtraParamsToAgent } from "./extra-params-udyUZGR2.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { n as loadModelCatalog } from "./model-catalog-DxYvPELu.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import "./config-BDv-QbJ6.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import "./model-selection-DOlkTrQa.js";
import {
  f as modelCatalogLogicalKey,
  i as buildModelAliasIndex,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { r as resolveModelAsync } from "./model-uG6W-_2M.js";
import {
  n as createModelVisibilityPolicy,
  t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
} from "./model-visibility-policy-BqHiELXR.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { t as registerProviderStreamForModel } from "./provider-stream-DDVQiA6H.js";
import { Bt as hasNonzeroUsage, Ht as normalizeUsage } from "./session-accessor-PZVNxFCV.js";
import { n as resolveSessionAuthProfileOverride } from "./session-override-vEd0_Hdb.js";
import { t as resolveWorkerSessionTarget } from "./session-target-CAMdjbd6.js";
import {
  a as normalizeCodexResponsesBaseUrlForOpenAISdk,
  n as prepareSimpleCompletionModel,
  s as bindSimpleCompletionModelResolverWorkspace,
} from "./simple-completion-runtime-DThW6g7z.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import { i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-D2Sx-NyU.js";
import { t as mapThinkingLevel } from "./utils-CefVZRZM.js";
//#region src/gateway/worker-environments/inference-runtime.ts
const MAX_PENDING_TOOL_DELTA_BYTES = 1024 * 1024;
const MAX_PENDING_TOOL_DELTAS = 4096;
const ERROR_MESSAGES = {
  "model-not-approved": "Model is not approved for this agent.",
  "invalid-context": "Inference context is invalid.",
  "epoch-mismatch": "Worker run epoch does not match.",
  "session-not-attached": "Worker session is not attached.",
  "provider-error": "Model provider request failed.",
  cancelled: "Inference request was cancelled.",
};
function inferenceError(reason, usage) {
  return {
    type: "error",
    reason,
    message: ERROR_MESSAGES[reason],
    ...(usage ? { usage: structuredClone(usage) } : {}),
  };
}
function safeAssistantMessage(params) {
  return {
    role: "assistant",
    content: structuredClone(params.message.content),
    api: params.modelIdentity.api,
    provider: params.modelIdentity.provider,
    model: params.modelIdentity.model,
    ...(params.message.responseModel ? { responseModel: params.message.responseModel } : {}),
    ...(params.message.responseId ? { responseId: params.message.responseId } : {}),
    usage: structuredClone(params.message.usage),
    stopReason: params.stopReason,
    timestamp: params.message.timestamp,
  };
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function copyTool(tool) {
  if (!isRecord(tool.parameters) || tool.parameters.type !== "object") return;
  return {
    name: tool.name,
    description: tool.description,
    parameters: structuredClone(tool.parameters),
  };
}
function buildContext(context) {
  const tools = [];
  for (const tool of context.tools ?? []) {
    const copied = copyTool(tool);
    if (!copied) return;
    tools.push(copied);
  }
  return {
    ...(context.systemPrompt !== void 0 ? { systemPrompt: context.systemPrompt } : {}),
    messages: structuredClone(context.messages),
    ...(tools.length > 0 ? { tools } : {}),
  };
}
function optionBudgetsFitModel(options, model) {
  if (options.maxTokens !== void 0 && options.maxTokens > model.maxTokens) return false;
  for (const budget of Object.values(options.thinkingBudgets ?? {}))
    if (budget !== void 0 && budget > model.maxTokens) return false;
  return true;
}
function buildStreamOptions(params) {
  const options = params.request.options;
  return {
    ...(options.temperature !== void 0 ? { temperature: options.temperature } : {}),
    ...(options.maxTokens !== void 0 ? { maxTokens: options.maxTokens } : {}),
    ...(options.reasoning !== void 0 ? { reasoning: mapThinkingLevel(options.reasoning) } : {}),
    ...(options.thinkingBudgets ? { thinkingBudgets: { ...options.thinkingBudgets } } : {}),
    signal: params.signal,
    sessionId: params.request.sessionId,
    ...(params.apiKey ? { apiKey: params.apiKey } : {}),
  };
}
function contentAt(message, index) {
  return message.content[index];
}
function toWorkerStreamEvent(event, modelIdentity) {
  switch (event.type) {
    case "start":
      return {
        type: "start",
        resolvedModel: {
          api: modelIdentity.api,
          provider: modelIdentity.provider,
          model: modelIdentity.model,
        },
        timestamp: event.partial.timestamp,
      };
    case "text_start": {
      const content = contentAt(event.partial, event.contentIndex);
      return {
        type: "text_start",
        contentIndex: event.contentIndex,
        ...(content?.type === "text" && content.textSignature
          ? { contentSignature: content.textSignature }
          : {}),
      };
    }
    case "text_delta":
      return {
        type: "text_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
      };
    case "text_end": {
      const content = contentAt(event.partial, event.contentIndex);
      return {
        type: "text_end",
        contentIndex: event.contentIndex,
        ...(content?.type === "text" && content.textSignature
          ? { contentSignature: content.textSignature }
          : {}),
      };
    }
    case "thinking_start":
      return {
        type: "thinking_start",
        contentIndex: event.contentIndex,
      };
    case "thinking_delta":
      return {
        type: "thinking_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
      };
    case "thinking_end": {
      const content = contentAt(event.partial, event.contentIndex);
      return {
        type: "thinking_end",
        contentIndex: event.contentIndex,
        ...(content?.type === "thinking" && content.thinkingSignature
          ? { contentSignature: content.thinkingSignature }
          : {}),
      };
    }
    case "toolcall_start":
    case "toolcall_delta":
    case "toolcall_end":
    case "done":
    case "error":
      return;
  }
}
function emitWorkerInferenceUsage(params) {
  if (!isDiagnosticsEnabled(params.config)) return;
  const usage = normalizeUsage(params.usage);
  if (!hasNonzeroUsage(usage)) return;
  const input = usage.input ?? 0;
  const output = usage.output ?? 0;
  const cacheRead = usage.cacheRead ?? 0;
  const cacheWrite = usage.cacheWrite ?? 0;
  const promptTokens = input + cacheRead + cacheWrite;
  const total = usage.total ?? promptTokens + output;
  const costUsd = estimateUsageCost({
    usage,
    cost: resolveModelCostConfig({
      provider: params.model.provider,
      model: params.model.id,
      config: params.config,
    }),
  });
  emitTrustedDiagnosticEvent({
    type: "model.usage",
    trace: freezeDiagnosticTraceContext(params.trace),
    sessionKey: params.target.sessionKey,
    sessionId: params.request.sessionId,
    channel: "worker",
    agentId: params.target.agentId,
    provider: params.model.provider,
    model: params.model.id,
    usage: {
      input,
      output,
      cacheRead,
      cacheWrite,
      promptTokens,
      total,
    },
    context: {
      limit: params.model.contextTokens ?? params.model.contextWindow,
      ...(usage.contextUsage?.state === "available"
        ? { used: usage.contextUsage.promptTokens }
        : {}),
    },
    ...(costUsd !== void 0 ? { costUsd } : {}),
    durationMs: params.durationMs,
  });
}
const DEFAULT_DEPENDENCIES = {
  now: Date.now,
  resolveSessionTarget: (config, sessionId) => {
    const target = resolveWorkerSessionTarget(config, sessionId);
    if (!target) return;
    return {
      ...target,
      agentId: target.agentId ?? resolveDefaultAgentId(config),
    };
  },
  loadManifestSnapshot: loadManifestMetadataSnapshot,
  loadCatalog: loadModelCatalog,
  resolveDefaultModel: resolveDefaultModelForAgent,
  resolveSessionAuthProfile: resolveSessionAuthProfileOverride,
  resolveModel: resolveModelAsync,
  prepareModel: prepareSimpleCompletionModel,
  resolveProviderStream: registerProviderStreamForModel,
  resolveStream: resolveEmbeddedAgentStreamFn,
  applyStreamPolicy: applyExtraParamsToAgent,
  stream: streamSimple,
  wrapStream: wrapStreamFnWithDiagnosticModelCallEvents,
  createTrace: createDiagnosticTraceContextFromActiveScope,
  recordUsage: emitWorkerInferenceUsage,
};
function resolveReturnedProfileSource(entry, profileId) {
  if (!profileId) return;
  if (entry.authProfileOverride?.trim() !== profileId) return "auto";
  return (
    entry.authProfileOverrideSource ??
    (typeof entry.authProfileOverrideCompactionCount === "number" ? "auto" : "user")
  );
}
async function resolveApprovedModel(params) {
  const { config, target, request, dependencies } = params;
  const rawRef = `${request.modelRef.provider}/${request.modelRef.model}`;
  if (splitTrailingAuthProfile(rawRef).profile) return;
  const workspaceDir = resolveAgentWorkspaceDir(config, target.agentId);
  const agentDir = resolveAgentDir(config, target.agentId);
  const manifestSnapshot = dependencies.loadManifestSnapshot({
    config,
    workspaceDir,
  });
  const defaultModel = dependencies.resolveDefaultModel({
    cfg: config,
    agentId: target.agentId,
    manifestPlugins: manifestSnapshot.plugins,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  const agentModels = resolveAgentConfig(config, target.agentId)?.models;
  const aliasConfig = agentModels
    ? {
        ...config,
        agents: {
          ...config.agents,
          defaults: {
            ...config.agents?.defaults,
            models: {
              ...config.agents?.defaults?.models,
              ...agentModels,
            },
          },
        },
      }
    : config;
  const aliasIndex = buildModelAliasIndex({
    cfg: aliasConfig,
    defaultProvider: defaultModel.provider,
    manifestPlugins: manifestSnapshot.plugins,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  const resolved = resolveModelRefFromString({
    cfg: aliasConfig,
    raw: rawRef,
    defaultProvider: defaultModel.provider,
    aliasIndex,
    manifestPlugins: manifestSnapshot.plugins,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  if (
    !resolved ||
    normalizeProviderId(resolved.ref.provider) !== normalizeProviderId(request.modelRef.provider)
  )
    return;
  const policy = createModelVisibilityPolicy({
    cfg: config,
    catalog: await dependencies.loadCatalog({
      agentDir,
      config,
      metadataSnapshot: manifestSnapshot,
      useCache: false,
      workspaceDir,
    }),
    defaultProvider: defaultModel.provider,
    defaultModel: `${defaultModel.provider}/${defaultModel.model}`,
    agentId: target.agentId,
    manifestPlugins: manifestSnapshot.plugins,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  const resolvedKey = modelCatalogLogicalKey({
    provider: resolved.ref.provider,
    id: resolved.ref.model,
  });
  if (
    !(
      policy.allowedCatalog.some((entry) => resolvedKey === modelCatalogLogicalKey(entry)) ||
      policy.retainedKeys.has(resolvedKey)
    ) ||
    !policy.allows(resolved.ref)
  )
    return;
  const configuredDefaultProfile =
    resolvedKey ===
    modelCatalogLogicalKey({
      provider: defaultModel.provider,
      id: defaultModel.model,
    })
      ? splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(config, target.agentId) ?? "")
          .profile
      : void 0;
  const harnessPolicy = resolveAgentHarnessPolicy({
    provider: resolved.ref.provider,
    modelId: resolved.ref.model,
    config,
    agentId: target.agentId,
    sessionKey: target.sessionKey,
  });
  const agentRuntimeId =
    harnessPolicy.runtimeSource !== "implicit" || config.plugins?.entries?.codex?.enabled === true
      ? harnessPolicy.runtime
      : void 0;
  const sessionProfileId = await dependencies.resolveSessionAuthProfile({
    cfg: config,
    provider: resolved.ref.provider,
    acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
      provider: resolved.ref.provider,
      harnessRuntime: harnessPolicy.runtime,
      config,
    }),
    agentDir,
    sessionEntry: target.sessionEntry,
    sessionStore: target.sessionStore,
    sessionKey: target.sessionKey,
    storePath: target.storePath,
    isNewSession: false,
  });
  const sessionProfileSource = resolveReturnedProfileSource(target.sessionEntry, sessionProfileId);
  const selectedProfile =
    sessionProfileId && sessionProfileSource === "user"
      ? {
          id: sessionProfileId,
          source: sessionProfileSource,
        }
      : configuredDefaultProfile
        ? {
            id: configuredDefaultProfile,
            source: "user",
          }
        : sessionProfileId
          ? {
              id: sessionProfileId,
              source: sessionProfileSource,
            }
          : void 0;
  const modelResolver = bindSimpleCompletionModelResolverWorkspace(
    (provider, modelId, resolvedAgentDir, cfg, options) =>
      dependencies.resolveModel(provider, modelId, resolvedAgentDir, cfg, {
        ...options,
        ...(agentRuntimeId ? { agentRuntimeId } : {}),
        workspaceDir,
      }),
    workspaceDir,
  );
  const prepared = await dependencies.prepareModel({
    cfg: config,
    provider: resolved.ref.provider,
    modelId: resolved.ref.model,
    agentDir,
    ...(selectedProfile?.source === "user" ? { profileId: selectedProfile.id } : {}),
    ...(selectedProfile ? { preferredProfile: selectedProfile.id } : {}),
    ...(selectedProfile?.source === "user" ? { bindAuthOwner: true } : {}),
    allowMissingApiKeyModes: ["aws-sdk"],
    useAsyncModelResolution: true,
    modelResolver,
  });
  return {
    provider: resolved.ref.provider,
    model: resolved.ref.model,
    agentDir,
    workspaceDir,
    prepared,
  };
}
function createWorkerInferenceExecutor(overrides = {}) {
  const dependencies = {
    ...DEFAULT_DEPENDENCIES,
    ...overrides,
  };
  return async (params) => {
    const { identity, request, signal } = params;
    if (identity.sessionId !== request.sessionId) return inferenceError("session-not-attached");
    if (identity.ownerEpoch !== request.runEpoch) return inferenceError("epoch-mismatch");
    if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
    const config = params.config ?? getRuntimeConfig();
    const target = dependencies.resolveSessionTarget(config, request.sessionId);
    if (!target) return inferenceError("session-not-attached");
    const context = buildContext(request.context);
    if (!context) return inferenceError("invalid-context");
    const approved = await resolveApprovedModel({
      config,
      target,
      request,
      dependencies,
    });
    if (!approved) return inferenceError("model-not-approved");
    if ("error" in approved.prepared) return inferenceError("provider-error");
    const modelIdentity = {
      api: approved.prepared.model.api,
      provider: approved.provider,
      model: approved.model,
    };
    const logicalModel = approved.prepared.model;
    const providerModel =
      logicalModel.provider === "openai" && logicalModel.api === "openai-chatgpt-responses"
        ? {
            ...logicalModel,
            baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(logicalModel.baseUrl),
          }
        : logicalModel;
    const providerStream = dependencies.resolveProviderStream({
      model: providerModel,
      cfg: config,
      agentDir: approved.agentDir,
      workspaceDir: approved.workspaceDir,
      registerStream: false,
    });
    const authValue = approved.prepared.auth.apiKey;
    const streamAgent = {
      streamFn: dependencies.resolveStream({
        currentStreamFn: dependencies.stream,
        ...(providerStream ? { providerStreamFn: providerStream } : {}),
        sessionId: request.sessionId,
        signal,
        model: providerModel,
        resolvedApiKey: authValue,
        authProfileId: approved.prepared.auth.profileId,
      }),
    };
    const streamPolicyOptions = {
      ...(request.options.temperature !== void 0
        ? { temperature: request.options.temperature }
        : {}),
      ...(request.options.maxTokens !== void 0 ? { maxTokens: request.options.maxTokens } : {}),
      ...(request.options.reasoning !== void 0 ? { reasoning: request.options.reasoning } : {}),
      ...(request.options.thinkingBudgets
        ? { thinkingBudgets: { ...request.options.thinkingBudgets } }
        : {}),
    };
    dependencies.applyStreamPolicy(
      streamAgent,
      config,
      approved.provider,
      approved.model,
      streamPolicyOptions,
      streamPolicyOptions.reasoning,
      target.agentId,
      approved.workspaceDir,
      providerModel,
      approved.agentDir,
    );
    const scopedStream = streamAgent.streamFn;
    const model = providerModel;
    if (!optionBudgetsFitModel(request.options, model)) return inferenceError("invalid-context");
    if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
    const startedAt = dependencies.now();
    const trace = dependencies.createTrace();
    let modelCallSeq = 0;
    const stream = dependencies.wrapStream(scopedStream, {
      runId: request.runId,
      sessionKey: target.sessionKey,
      sessionId: request.sessionId,
      provider: model.provider,
      model: model.id,
      api: model.api,
      contextTokenBudget: model.contextTokens ?? model.contextWindow,
      trace,
      contentCapture: resolveDiagnosticModelContentCapturePolicy(config),
      nextCallId: () => `${request.runId}:${request.turnId}:worker-model:${(modelCallSeq += 1)}`,
    });
    let usageRecorded = false;
    const recordUsage = (usage) => {
      if (usageRecorded) return;
      usageRecorded = true;
      dependencies.recordUsage({
        config,
        target,
        request,
        model,
        usage,
        durationMs: Math.max(0, dependencies.now() - startedAt),
        trace,
      });
    };
    const pendingToolDeltas = /* @__PURE__ */ new Map();
    let pendingToolDeltaBytes = 0;
    let pendingToolDeltaCount = 0;
    const startedToolCalls = /* @__PURE__ */ new Set();
    const startToolCall = (contentIndex, partial) => {
      if (startedToolCalls.has(contentIndex)) return true;
      const content = contentAt(partial, contentIndex);
      if (content?.type !== "toolCall" || !content.id || !content.name) return false;
      params.emit({
        type: "toolcall_start",
        contentIndex,
        id: content.id,
        toolName: content.name,
      });
      startedToolCalls.add(contentIndex);
      for (const delta of pendingToolDeltas.get(contentIndex) ?? []) {
        params.emit({
          type: "toolcall_delta",
          contentIndex,
          delta,
        });
        pendingToolDeltaBytes -= Buffer.byteLength(delta, "utf8");
        pendingToolDeltaCount -= 1;
      }
      pendingToolDeltas.delete(contentIndex);
      return true;
    };
    const providerAbort = new AbortController();
    const providerSignal = AbortSignal.any([signal, providerAbort.signal]);
    try {
      const events = await stream(
        model,
        context,
        buildStreamOptions({
          request,
          signal: providerSignal,
          apiKey: authValue,
        }),
      );
      for await (const event of events) {
        if (event.type === "done") {
          recordUsage(event.message.usage);
          if (signal.aborted || !params.isCurrent())
            return inferenceError("cancelled", event.message.usage);
          return {
            type: "done",
            message: safeAssistantMessage({
              message: event.message,
              modelIdentity,
              stopReason: event.reason,
            }),
          };
        }
        if (event.type === "error") {
          recordUsage(event.error.usage);
          return inferenceError(
            event.reason === "aborted" ? "cancelled" : "provider-error",
            event.error.usage,
          );
        }
        if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
        if (event.type === "toolcall_start") {
          startToolCall(event.contentIndex, event.partial);
          continue;
        }
        if (event.type === "toolcall_delta") {
          if (startedToolCalls.has(event.contentIndex))
            params.emit({
              type: event.type,
              contentIndex: event.contentIndex,
              delta: event.delta,
            });
          else {
            const pending = pendingToolDeltas.get(event.contentIndex) ?? [];
            pendingToolDeltaBytes += Buffer.byteLength(event.delta, "utf8");
            pendingToolDeltaCount += 1;
            if (
              pendingToolDeltaBytes > MAX_PENDING_TOOL_DELTA_BYTES ||
              pendingToolDeltaCount > MAX_PENDING_TOOL_DELTAS
            )
              return inferenceError("provider-error");
            pending.push(event.delta);
            pendingToolDeltas.set(event.contentIndex, pending);
            startToolCall(event.contentIndex, event.partial);
          }
          continue;
        }
        if (event.type === "toolcall_end") {
          if (!startToolCall(event.contentIndex, event.partial))
            return inferenceError("provider-error");
          params.emit({
            type: event.type,
            contentIndex: event.contentIndex,
          });
          continue;
        }
        const workerEvent = toWorkerStreamEvent(event, modelIdentity);
        if (workerEvent) params.emit(workerEvent);
      }
      return inferenceError(signal.aborted ? "cancelled" : "provider-error");
    } catch {
      return inferenceError(signal.aborted ? "cancelled" : "provider-error");
    } finally {
      providerAbort.abort();
    }
  };
}
const executeWorkerInference = createWorkerInferenceExecutor();
//#endregion
export { createWorkerInferenceExecutor, executeWorkerInference };
