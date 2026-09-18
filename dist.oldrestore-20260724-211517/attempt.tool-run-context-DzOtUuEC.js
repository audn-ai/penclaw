import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { n as isAbortError } from "./abort-signal-DEbc_zqk.js";
import {
  n as MIN_PROMPT_BUDGET_TOKENS,
  t as MIN_PROMPT_BUDGET_RATIO,
} from "./agent-compaction-constants-BHnSZLzH.js";
import {
  B as COMPACTION_SUMMARY_PREFIX,
  R as BRANCH_SUMMARY_PREFIX,
  U as bashExecutionToText,
  V as COMPACTION_SUMMARY_SUFFIX,
  z as BRANCH_SUMMARY_SUFFIX,
} from "./agent-core-DJCbl_Iw.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as estimateStringChars } from "./cjk-chars-0PtNN_-l.js";
import {
  a as buildStageSplitPlan,
  i as buildOversizedFallbackPlan,
  l as sanitizeCompactionMessages,
  o as buildSummaryChunks,
  r as buildHistoryPrunePlan,
  s as computeAdaptiveChunkRatio,
  t as SAFETY_MARGIN,
} from "./compaction-planning-BCL9SM9y.js";
import "./utils-DtcDeqWS.js";
import { p as resolvePluginControlPlaneFingerprint } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { T as freezeDiagnosticTraceContext } from "./diagnostic-events-5-gsFhkM.js";
import { d as isGoogleModelApi } from "./embedded-agent-helpers-DH71Di6x.js";
import {
  r as isDeliveredMessagingToolResult,
  t as hasMessagingDeliveryReceipt,
} from "./embedded-agent-message-tool-source-reply-C7h4djeo.js";
import "./defaults-CdX9UGcX.js";
import { a as isMessagingToolSendAction } from "./embedded-agent-messaging-C_REpMqa.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import "./model-selection-DOlkTrQa.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { u as isTimeoutError } from "./failover-error-CYvhrluQ.js";
import "./session-manager-BD4l9VJc.js";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-C14lActR.js";
import { r as createLazyPromiseLoader } from "./lazy-promise-EhsWch5m.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import {
  b as parseStrictPositiveInteger,
  j as resolveTimerTimeoutMs,
  k as resolveOptionalIntegerOption,
} from "./number-coercion-CJQ8TR--.js";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-UWRY5bYu.js";
import { u as shouldPreserveThinkingBlocks } from "./provider-replay-helpers-DtVD32X4.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as retryAsync } from "./retry-CcVvEFm0.js";
import { _t as generateSummary$1 } from "./sessions-Duh5damM.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as isToolResultError } from "./tool-result-error-1qgstja-.js";
import { r as estimateToolResultReductionPotential } from "./tool-result-truncation-B3T_nFx6.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/transcript-policy.ts
/**
 * Transcript replay policy resolution.
 * Combines provider plugin replay hooks with core transport fallbacks so chat
 * history sanitization, tool IDs, thinking blocks, and turn validation align.
 */
const SIGNED_THINKING_PROVIDERS = /* @__PURE__ */ new Set([
  "anthropic",
  "amazon-bedrock",
  "anthropic-vertex",
]);
/** Return true when a provider family owns signed thinking blocks. */
function providerRequiresSignedThinking(provider) {
  return SIGNED_THINKING_PROVIDERS.has(normalizeProviderId(provider ?? ""));
}
/** Decide whether signed thinking can be replayed under the current provider policy. */
function shouldAllowProviderOwnedThinkingReplay(params) {
  const hasProviderOwnedSignedThinking =
    params.policy.preserveSignatures || providerRequiresSignedThinking(params.provider);
  return (
    isAnthropicApi(params.modelApi) &&
    params.policy.validateAnthropicTurns &&
    hasProviderOwnedSignedThinking &&
    !params.policy.dropThinkingBlocks
  );
}
const DEFAULT_TRANSCRIPT_POLICY = {
  sanitizeMode: "images-only",
  sanitizeToolCallIds: false,
  toolCallIdMode: void 0,
  duplicateToolCallIdStyle: void 0,
  preserveNativeAnthropicToolUseIds: false,
  repairToolUseResultPairing: true,
  preserveSignatures: false,
  sanitizeThoughtSignatures: void 0,
  dropThinkingBlocks: false,
  dropReasoningFromHistory: false,
  applyGoogleTurnOrdering: false,
  validateGeminiTurns: false,
  validateAnthropicTurns: false,
  allowSyntheticToolResults: false,
};
function isAnthropicApi(modelApi) {
  return modelApi === "anthropic-messages" || modelApi === "bedrock-converse-stream";
}
function isOpenAiResponsesCompatibleApi(modelApi) {
  return (
    modelApi === "openai-responses" ||
    modelApi === "openai-chatgpt-responses" ||
    modelApi === "azure-openai-responses"
  );
}
function isClaudeFamilyModelId(modelId) {
  const id = normalizeLowercaseStringOrEmpty(modelId);
  return /(?:^|[./:_-])claude(?:$|[./:_-])/.test(id);
}
function modelDisablesReasoningEffort(model) {
  return model?.compat?.supportsReasoningEffort === false;
}
function shouldPreserveReasoningContentReplay(params) {
  return params.model?.reasoning === true || requiresReasoningContentReplay(params.modelId);
}
/**
 * Provides a narrow replay-policy fallback for providers that do not have an
 * owning runtime plugin.
 *
 * This exists to preserve generic custom-provider behavior. Bundled providers
 * should express replay ownership through `buildReplayPolicy` instead.
 */
function buildUnownedProviderTransportReplayFallback(params) {
  const isGoogle = isGoogleModelApi(params.modelApi);
  const isAnthropic = isAnthropicApi(params.modelApi);
  const isStrictOpenAiCompatible = params.modelApi === "openai-completions";
  const requiresOpenAiCompatibleToolIdSanitization =
    params.modelApi === "openai-completions" ||
    params.modelApi === "openai-responses" ||
    params.modelApi === "openai-chatgpt-responses" ||
    params.modelApi === "azure-openai-responses";
  if (
    !isGoogle &&
    !isAnthropic &&
    !isStrictOpenAiCompatible &&
    !requiresOpenAiCompatibleToolIdSanitization
  )
    return;
  const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
  const isClaudeOpenAiResponses = isOpenAiResponsesCompatibleApi(params.modelApi)
    ? isClaudeFamilyModelId(modelId)
    : false;
  return {
    ...(isGoogle || isAnthropic ? { sanitizeMode: "full" } : {}),
    ...(isGoogle || isAnthropic || requiresOpenAiCompatibleToolIdSanitization
      ? {
          sanitizeToolCallIds: true,
          toolCallIdMode: "strict",
        }
      : {}),
    ...(isAnthropic ? { preserveSignatures: true } : {}),
    ...(isGoogle
      ? {
          sanitizeThoughtSignatures: {
            allowBase64Only: true,
            includeCamelCase: true,
          },
        }
      : {}),
    ...(isAnthropic && modelId.includes("claude")
      ? { dropThinkingBlocks: !shouldPreserveThinkingBlocks(modelId) }
      : {}),
    ...(isAnthropic && modelDisablesReasoningEffort(params.model)
      ? { dropThinkingBlocks: true }
      : {}),
    ...(isStrictOpenAiCompatible
      ? { dropReasoningFromHistory: !shouldPreserveReasoningContentReplay(params) }
      : {}),
    ...(isGoogle || isStrictOpenAiCompatible ? { applyAssistantFirstOrderingFix: true } : {}),
    ...(isGoogle || isStrictOpenAiCompatible ? { validateGeminiTurns: true } : {}),
    ...(isAnthropic || isStrictOpenAiCompatible || isClaudeOpenAiResponses
      ? { validateAnthropicTurns: true }
      : {}),
    ...(isGoogle || isAnthropic || isOpenAiResponsesCompatibleApi(params.modelApi)
      ? { allowSyntheticToolResults: true }
      : {}),
  };
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = /* @__PURE__ */ new Set([
  "kimi-for-coding",
  "kimi-k2.5",
  "kimi-k2.6",
  "kimi-k2.7-code",
  "kimi-k2-thinking",
  "kimi-k2-thinking-turbo",
  "mimo-v2-pro",
  "mimo-v2-omni",
  "mimo-v2.5",
  "mimo-v2.5-pro",
  "mimo-v2.6-pro",
]);
function requiresReasoningContentReplay(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  if (!normalized) return false;
  const parts = normalized.split("/").filter(Boolean);
  const finalPart = parts[parts.length - 1] ?? normalized;
  const candidates = [finalPart];
  const colonParts = finalPart.split(":").filter(Boolean);
  if (colonParts.length > 1)
    candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
  return candidates.some((candidate) => REASONING_CONTENT_REPLAY_MODEL_IDS.has(candidate));
}
function mergeTranscriptPolicy(policy, basePolicy = DEFAULT_TRANSCRIPT_POLICY) {
  if (!policy) return basePolicy;
  return {
    ...basePolicy,
    ...(policy.sanitizeMode != null ? { sanitizeMode: policy.sanitizeMode } : {}),
    ...(typeof policy.sanitizeToolCallIds === "boolean"
      ? { sanitizeToolCallIds: policy.sanitizeToolCallIds }
      : {}),
    ...(policy.toolCallIdMode ? { toolCallIdMode: policy.toolCallIdMode } : {}),
    ...(policy.duplicateToolCallIdStyle
      ? { duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle }
      : {}),
    ...(typeof policy.preserveNativeAnthropicToolUseIds === "boolean"
      ? { preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds }
      : {}),
    ...(typeof policy.repairToolUseResultPairing === "boolean"
      ? { repairToolUseResultPairing: policy.repairToolUseResultPairing }
      : {}),
    ...(typeof policy.preserveSignatures === "boolean"
      ? { preserveSignatures: policy.preserveSignatures }
      : {}),
    ...(policy.sanitizeThoughtSignatures
      ? { sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures }
      : {}),
    ...(typeof policy.dropThinkingBlocks === "boolean"
      ? { dropThinkingBlocks: policy.dropThinkingBlocks }
      : {}),
    ...(typeof policy.dropReasoningFromHistory === "boolean"
      ? { dropReasoningFromHistory: policy.dropReasoningFromHistory }
      : {}),
    ...(typeof policy.applyAssistantFirstOrderingFix === "boolean"
      ? { applyGoogleTurnOrdering: policy.applyAssistantFirstOrderingFix }
      : {}),
    ...(typeof policy.validateGeminiTurns === "boolean"
      ? { validateGeminiTurns: policy.validateGeminiTurns }
      : {}),
    ...(typeof policy.validateAnthropicTurns === "boolean"
      ? { validateAnthropicTurns: policy.validateAnthropicTurns }
      : {}),
    ...(typeof policy.allowSyntheticToolResults === "boolean"
      ? { allowSyntheticToolResults: policy.allowSyntheticToolResults }
      : {}),
  };
}
const transcriptPolicyCache = /* @__PURE__ */ new WeakMap();
function canCacheTranscriptPolicy(params) {
  if (!params.config) return false;
  return !params.env || params.env === process.env;
}
function resolveTranscriptPolicyCacheKey(params) {
  return JSON.stringify({
    provider: params.provider,
    modelApi: params.modelApi ?? "",
    modelId: params.modelId ?? "",
    dropsThinkingForReasoningCompat: modelDisablesReasoningEffort(params.model),
    preservesReasoningContentReplay: params.model?.reasoning === true,
    workspaceDir: params.workspaceDir ?? "",
    pluginControlPlane: resolvePluginControlPlaneFingerprint({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }),
  });
}
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
function resolveTranscriptPolicy(params) {
  const provider = normalizeProviderId(params.provider ?? "");
  const cacheConfig = canCacheTranscriptPolicy(params) ? params.config : void 0;
  const cacheKey = cacheConfig
    ? resolveTranscriptPolicyCacheKey({
        ...params,
        provider,
        config: cacheConfig,
      })
    : void 0;
  if (cacheConfig && cacheKey) {
    const cached = transcriptPolicyCache.get(cacheConfig)?.get(cacheKey);
    if (cached) return cached;
  }
  const runtimePlugin =
    params.runtimeHandle?.plugin ??
    (provider
      ? resolveProviderRuntimePlugin({
          provider,
          modelId: params.modelId,
          config: params.config,
          workspaceDir: params.workspaceDir,
          env: params.env,
        })
      : void 0);
  const context = {
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    provider,
    modelId: params.modelId ?? "",
    modelApi: params.modelApi,
    model: params.model,
  };
  const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
  const policy = buildReplayPolicy
    ? mergeTranscriptPolicy(buildReplayPolicy(context) ?? void 0)
    : mergeTranscriptPolicy(
        buildUnownedProviderTransportReplayFallback({
          modelApi: params.modelApi,
          modelId: params.modelId,
          model: params.model,
        }),
      );
  if (cacheConfig && cacheKey) {
    let configCache = transcriptPolicyCache.get(cacheConfig);
    if (!configCache) {
      configCache = /* @__PURE__ */ new Map();
      transcriptPolicyCache.set(cacheConfig, configCache);
    }
    configCache.set(cacheKey, policy);
  }
  return policy;
}
//#endregion
//#region src/agents/compaction-planning-worker.ts
/**
 * Runs CPU-heavy compaction planning in a worker thread when histories are
 * large enough to risk starving the main event loop.
 */
const COMPACTION_PLANNING_WORKER_TIMEOUT_MS = 6e4;
const COMPACTION_PLANNING_WORKER_MIN_MESSAGES = 64;
var CompactionPlanningWorkerError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "CompactionPlanningWorkerError";
  }
};
function resolveCompactionPlanningWorkerUrl(currentModuleUrl = import.meta.url) {
  const currentPath = fileURLToPath(currentModuleUrl);
  const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
  if (distIndex >= 0) {
    const distRoot = currentPath.slice(0, distIndex + 6);
    return pathToFileURL(path.join(distRoot, "agents", "compaction-planning.worker.js"));
  }
  const extension = path.extname(currentPath) || ".js";
  return new URL(`./compaction-planning.worker${extension}`, currentModuleUrl);
}
function runCompactionPlanningWorker(params) {
  if (params.signal?.aborted)
    return Promise.reject(
      toErrorObject(
        params.signal.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"),
        "Non-Error rejection",
      ),
    );
  const workerUrl = params.workerUrl ?? resolveCompactionPlanningWorkerUrl();
  const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
  let worker;
  try {
    worker = new Worker(workerUrl, {
      workerData: params.input,
      execArgv: sourceWorkerExecArgv,
    });
  } catch (error) {
    return Promise.reject(
      new CompactionPlanningWorkerError(
        error instanceof Error ? error.message : String(error),
        "unavailable",
      ),
    );
  }
  worker.unref?.();
  return new Promise((resolve, reject) => {
    let settled = false;
    const timeout = setTimeout(
      () => {
        settle(
          () =>
            reject(
              new CompactionPlanningWorkerError("compaction planning worker timed out", "timeout"),
            ),
          true,
        );
      },
      resolveTimerTimeoutMs(params.timeoutMs, COMPACTION_PLANNING_WORKER_TIMEOUT_MS),
    );
    const abort = () => {
      settle(
        () =>
          reject(
            toErrorObject(
              params.signal?.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"),
              "Non-Error rejection",
            ),
          ),
        true,
      );
    };
    const settle = (finish, terminate) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      params.signal?.removeEventListener("abort", abort);
      worker.removeAllListeners();
      if (terminate) worker.terminate();
      finish();
    };
    params.signal?.addEventListener("abort", abort, { once: true });
    worker.once("message", (message) => {
      settle(() => {
        if (message.status === "ok") {
          resolve(message.value);
          return;
        }
        reject(new CompactionPlanningWorkerError(message.error, "failed"));
      }, false);
    });
    worker.once("error", (error) => {
      const message = error instanceof Error ? error.message : String(error);
      settle(() => reject(new CompactionPlanningWorkerError(message, "unavailable")), true);
    });
    worker.once("exit", (code) => {
      if (code === 0) return;
      settle(
        () =>
          reject(
            new CompactionPlanningWorkerError(
              `compaction planning worker exited with code ${code}`,
              "unavailable",
            ),
          ),
        false,
      );
    });
  });
}
function shouldFallbackToMainThread(error) {
  return error instanceof CompactionPlanningWorkerError && error.code === "unavailable";
}
function shouldUsePlanningWorker(messageCount) {
  return messageCount >= COMPACTION_PLANNING_WORKER_MIN_MESSAGES;
}
async function runWithUnavailableFallback(params) {
  try {
    const value = await runCompactionPlanningWorker({
      input: params.input,
      signal: params.signal,
    });
    if (params.isExpected(value)) return value;
    throw new CompactionPlanningWorkerError(
      "unexpected compaction planning worker result",
      "failed",
    );
  } catch (error) {
    if (shouldFallbackToMainThread(error)) return params.fallback();
    throw error;
  }
}
/** Builds summary chunks, offloading large histories to the planning worker. */
async function buildSummaryChunksWithWorker(params) {
  const messages = sanitizeCompactionMessages(params.messages);
  if (!shouldUsePlanningWorker(messages.length)) return buildSummaryChunks(params);
  return (
    await runWithUnavailableFallback({
      input: {
        kind: "summaryChunks",
        messages,
        maxChunkTokens: params.maxChunkTokens,
      },
      signal: params.signal,
      fallback: () => ({
        kind: "summaryChunks",
        chunks: buildSummaryChunks(params),
      }),
      isExpected: (valueCandidate) => valueCandidate.kind === "summaryChunks",
    })
  ).chunks;
}
/** Builds an oversized-message fallback plan, using the worker when worthwhile. */
async function buildOversizedFallbackPlanWithWorker(params) {
  const messages = sanitizeCompactionMessages(params.messages);
  if (!shouldUsePlanningWorker(messages.length)) return buildOversizedFallbackPlan(params);
  const value = await runWithUnavailableFallback({
    input: {
      kind: "oversizedFallback",
      messages,
      contextWindow: params.contextWindow,
    },
    signal: params.signal,
    fallback: () => ({
      kind: "oversizedFallback",
      ...buildOversizedFallbackPlan(params),
    }),
    isExpected: (valueEntry) => valueEntry.kind === "oversizedFallback",
  });
  return {
    smallMessages: value.smallMessages,
    oversizedNotes: value.oversizedNotes,
  };
}
/** Builds a staged summarization split plan with worker fallback. */
async function buildStageSplitPlanWithWorker(params) {
  const messages = sanitizeCompactionMessages(params.messages);
  if (!shouldUsePlanningWorker(messages.length)) return buildStageSplitPlan(params);
  const value = await runWithUnavailableFallback({
    input: {
      kind: "stageSplit",
      messages,
      maxChunkTokens: params.maxChunkTokens,
      parts: params.parts,
      minMessagesForSplit: params.minMessagesForSplit,
    },
    signal: params.signal,
    fallback: () => ({
      kind: "stageSplit",
      ...buildStageSplitPlan(params),
    }),
    isExpected: (valueResult) => valueResult.kind === "stageSplit",
  });
  return value.mode === "split"
    ? {
        mode: "split",
        chunks: value.chunks,
      }
    : { mode: "single" };
}
/** Builds a history-pruning plan with worker fallback for large transcripts. */
async function buildHistoryPrunePlanWithWorker(params) {
  const messagesToSummarize = sanitizeCompactionMessages(params.messagesToSummarize);
  const turnPrefixMessages = sanitizeCompactionMessages(params.turnPrefixMessages);
  if (!shouldUsePlanningWorker(messagesToSummarize.length + turnPrefixMessages.length))
    return buildHistoryPrunePlan(params);
  const value = await runWithUnavailableFallback({
    input: {
      kind: "historyPrune",
      messagesToSummarize,
      turnPrefixMessages,
      tokensBefore: params.tokensBefore,
      contextWindowTokens: params.contextWindowTokens,
      maxHistoryShare: params.maxHistoryShare,
      parts: params.parts,
    },
    signal: params.signal,
    fallback: () => ({
      kind: "historyPrune",
      ...buildHistoryPrunePlan(params),
    }),
    isExpected: (valueValue) => valueValue.kind === "historyPrune",
  });
  return {
    summarizableTokens: value.summarizableTokens,
    newContentTokens: value.newContentTokens,
    maxHistoryTokens: value.maxHistoryTokens,
    pruned: value.pruned,
  };
}
/** Computes the adaptive compaction chunk ratio with worker fallback. */
async function computeAdaptiveChunkRatioWithWorker(params) {
  const messages = sanitizeCompactionMessages(params.messages);
  if (!shouldUsePlanningWorker(messages.length))
    return computeAdaptiveChunkRatio(params.messages, params.contextWindow);
  return (
    await runWithUnavailableFallback({
      input: {
        kind: "adaptiveChunkRatio",
        messages,
        contextWindow: params.contextWindow,
      },
      signal: params.signal,
      fallback: () => ({
        kind: "adaptiveChunkRatio",
        ratio: computeAdaptiveChunkRatio(params.messages, params.contextWindow),
      }),
      isExpected: (valueLocal) => valueLocal.kind === "adaptiveChunkRatio",
    })
  ).ratio;
}
//#endregion
//#region src/agents/compaction.ts
const log$1 = createSubsystemLogger("compaction");
const DEFAULT_SUMMARY_FALLBACK = "No prior history.";
const MERGE_SUMMARIES_INSTRUCTIONS = [
  "Merge these partial summaries into a single cohesive summary.",
  "",
  "MUST PRESERVE:",
  "- Active tasks and their current status (in-progress, blocked, pending)",
  "- Batch operation progress (e.g., '5/17 items completed')",
  "- The last thing the user requested and what was being done about it",
  "- Decisions made and their rationale",
  "- TODOs, open questions, and constraints",
  "- Any commitments or follow-ups promised",
  "",
  "PRIORITIZE recent context over older history. The agent needs to know",
  "what it was doing, not just what was discussed.",
].join("\n");
const IDENTIFIER_PRESERVATION_INSTRUCTIONS =
  "Preserve all opaque identifiers exactly as written (no shortening or reconstruction), including UUIDs, hashes, IDs, hostnames, IPs, ports, URLs, and file names.";
const generateSummaryCompat = generateSummary$1;
function resolveIdentifierPreservationInstructions(instructions) {
  const policy = instructions?.identifierPolicy ?? "strict";
  if (policy === "off") return;
  if (policy === "custom") {
    const custom = instructions?.identifierInstructions?.trim();
    return custom && custom.length > 0 ? custom : IDENTIFIER_PRESERVATION_INSTRUCTIONS;
  }
  return IDENTIFIER_PRESERVATION_INSTRUCTIONS;
}
/** Combines identifier-preservation and caller-provided compaction instructions. */
function buildCompactionSummarizationInstructions(customInstructions, instructions) {
  const custom = customInstructions?.trim();
  const identifierPreservation = resolveIdentifierPreservationInstructions(instructions);
  if (!identifierPreservation && !custom) return;
  if (!custom) return identifierPreservation;
  if (!identifierPreservation) return `Additional focus:\n${custom}`;
  return `${identifierPreservation}\n\nAdditional focus:\n${custom}`;
}
async function summarizeChunks(params) {
  if (params.messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
  const chunks = await buildSummaryChunksWithWorker({
    messages: params.messages,
    maxChunkTokens: params.maxChunkTokens,
    signal: params.signal,
  });
  let summary = params.previousSummary;
  const effectiveInstructions = buildCompactionSummarizationInstructions(
    params.customInstructions,
    params.summarizationInstructions,
  );
  let hasGeneratedChunk = false;
  for (const chunk of chunks)
    try {
      summary = await retryAsync(
        () =>
          generateSummary(
            chunk,
            params.model,
            params.reserveTokens,
            params.apiKey,
            params.headers,
            params.signal,
            effectiveInstructions,
            summary,
          ),
        {
          attempts: 3,
          minDelayMs: 500,
          maxDelayMs: 5e3,
          jitter: 0.2,
          label: "compaction/generateSummary",
          shouldRetry: (err) => {
            if (params.signal.aborted) return false;
            if (!isAbortError(err) && isTimeoutError(err)) return false;
            return true;
          },
        },
      );
      hasGeneratedChunk = true;
    } catch (err) {
      if (params.signal.aborted) throw err;
      if (!isAbortError(err) && isTimeoutError(err)) throw err;
      if (!hasGeneratedChunk) throw err;
      const completedChunks = chunks.indexOf(chunk);
      log$1.warn("chunk summarization failed after retries; partial summary available", {
        err,
        completedChunks,
        totalChunks: chunks.length,
      });
      const partial = /* @__PURE__ */ new Error("partial summarization failure");
      partial.partialSummary = `${summary}\n\n[Partial summary: chunks 1-${completedChunks} of ${chunks.length} were summarized. Chunks ${completedChunks + 1}-${chunks.length} could not be processed.]`;
      throw partial;
    }
  return summary ?? DEFAULT_SUMMARY_FALLBACK;
}
function generateSummary(
  currentMessages,
  model,
  reserveTokens,
  apiKey,
  headers,
  signal,
  customInstructions,
  previousSummary,
) {
  if (generateSummary$1.length >= 8)
    return generateSummaryCompat(
      currentMessages,
      model,
      reserveTokens,
      apiKey,
      headers,
      signal,
      customInstructions,
      previousSummary,
    );
  return generateSummaryCompat(
    currentMessages,
    model,
    reserveTokens,
    apiKey,
    signal,
    customInstructions,
    previousSummary,
  );
}
/**
 * Summarize with progressive fallback for handling oversized messages.
 * If full summarization fails, tries partial summarization excluding oversized messages.
 */
async function summarizeWithFallback(params) {
  const { messages, contextWindow } = params;
  if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
  let partialSummaryFallback;
  try {
    return await summarizeChunks(params);
  } catch (fullError) {
    if (params.signal.aborted) throw fullError;
    log$1.warn(`Full summarization failed: ${formatErrorMessage(fullError)}`);
    partialSummaryFallback = fullError.partialSummary;
  }
  const { smallMessages, oversizedNotes } = await buildOversizedFallbackPlanWithWorker({
    messages,
    contextWindow,
    signal: params.signal,
  });
  if (smallMessages.length > 0 && smallMessages.length !== messages.length)
    try {
      return (
        (await summarizeChunks({
          ...params,
          messages: smallMessages,
        })) + (oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "")
      );
    } catch (partialError) {
      if (params.signal.aborted) throw partialError;
      log$1.warn(`Partial summarization also failed: ${formatErrorMessage(partialError)}`);
      const retryPartial = partialError.partialSummary;
      if (retryPartial)
        partialSummaryFallback =
          retryPartial + (oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "");
    }
  if (partialSummaryFallback) return partialSummaryFallback;
  return `Context contained ${messages.length} messages (${oversizedNotes.length} oversized). Summary unavailable due to size limits.`;
}
/** Extracts a compact timestamp range from a chunk of messages for merge metadata. */
function extractChunkTimeRange(chunk) {
  let earliest;
  let latest;
  for (const message of chunk) {
    const timestamp = message.timestamp;
    if (
      typeof timestamp !== "number" ||
      timestamp <= 0 ||
      !Number.isFinite(new Date(timestamp).getTime())
    )
      continue;
    earliest = earliest === void 0 ? timestamp : Math.min(earliest, timestamp);
    latest = latest === void 0 ? timestamp : Math.max(latest, timestamp);
  }
  if (earliest === void 0 || latest === void 0) return "";
  const format = (timestamp) => new Date(timestamp).toISOString().replace("T", " ").slice(0, 16);
  return ` [${earliest === latest ? format(earliest) : `${format(earliest)} — ${format(latest)}`} UTC]`;
}
/** Summarizes history in multiple stages when a single pass would be too large. */
async function summarizeInStages(params) {
  const { messages } = params;
  if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
  const plan = await buildStageSplitPlanWithWorker({
    messages,
    maxChunkTokens: params.maxChunkTokens,
    parts: params.parts,
    minMessagesForSplit: params.minMessagesForSplit,
    signal: params.signal,
  });
  if (plan.mode === "single") return summarizeWithFallback(params);
  const partialSummaries = [];
  for (const chunk of plan.chunks)
    partialSummaries.push(
      await summarizeWithFallback({
        ...params,
        messages: chunk,
        previousSummary: void 0,
      }),
    );
  if (partialSummaries.length === 1) {
    const summary = partialSummaries.at(0);
    if (summary === void 0) throw new Error("Compaction summary plan produced no summary");
    return summary;
  }
  const now = Date.now();
  const summaryMessages = partialSummaries.map((summary, index) => {
    const chunk = plan.chunks.at(index);
    if (!chunk) throw new Error(`Compaction summary plan is missing chunk ${index}`);
    const timeRange = extractChunkTimeRange(chunk);
    return {
      role: "user",
      content: `${index === 0 ? `[Chunk 1 — oldest messages${timeRange}]` : index === partialSummaries.length - 1 ? `[Chunk ${partialSummaries.length} — most recent messages${timeRange}]` : `[Chunk ${index + 1}/${partialSummaries.length}${timeRange}]`}\n${summary}`,
      timestamp: now - (partialSummaries.length - 1 - index),
    };
  });
  const custom = params.customInstructions?.trim();
  const mergeInstructions = custom
    ? `${MERGE_SUMMARIES_INSTRUCTIONS}\n\n${custom}`
    : MERGE_SUMMARIES_INSTRUCTIONS;
  return summarizeWithFallback({
    ...params,
    messages: summaryMessages,
    customInstructions: mergeInstructions,
  });
}
/** Resolves a positive context-window token count from model metadata. */
function resolveContextWindowTokens(model) {
  const effective = model?.contextTokens ?? model?.contextWindow;
  return Math.max(1, Math.floor(effective ?? 2e5));
}
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.ts
/**
 * Estimates prompt pressure and decides pre-prompt compaction routing.
 */
const PREEMPTIVE_OVERFLOW_ERROR_TEXT =
  "Context overflow: prompt too large for the model (precheck).";
const ESTIMATED_CHARS_PER_TOKEN = 4;
const TOOL_RESULT_CHARS_PER_TOKEN = 2;
const JSON_PAYLOAD_CHARS_PER_TOKEN = 3;
const MESSAGE_BOUNDARY_OVERHEAD_TOKENS = 12;
const CONTENT_BLOCK_OVERHEAD_TOKENS = 6;
const IMAGE_BLOCK_TOKENS = 2e3;
const TRUNCATION_ROUTE_BUFFER_TOKENS = 512;
function estimateStringTokenPressure(text, charsPerToken = ESTIMATED_CHARS_PER_TOKEN) {
  return Math.ceil(estimateStringChars(text) / charsPerToken);
}
function estimateJsonPayloadTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string"
      ? Math.ceil(estimateStringChars(serialized) / charsPerToken)
      : 1;
  } catch {
    return 256;
  }
}
function estimateIdentifierTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
  if (value == null) return 0;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  )
    return estimateStringTokenPressure(String(value), charsPerToken);
  return estimateJsonPayloadTokenPressure(value, charsPerToken);
}
function estimateContentBlockTokenPressure(block, charsPerToken = ESTIMATED_CHARS_PER_TOKEN) {
  if (typeof block === "string") return estimateStringTokenPressure(block, charsPerToken);
  if (!isRecord(block)) return estimateJsonPayloadTokenPressure(block, charsPerToken);
  const type = block.type;
  if (type === "text" && typeof block.text === "string")
    return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(block.text, charsPerToken);
  if (type === "thinking" && typeof block.thinking === "string")
    return (
      CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(block.thinking, charsPerToken)
    );
  if (type === "image") return IMAGE_BLOCK_TOKENS;
  return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateJsonPayloadTokenPressure(block, charsPerToken);
}
function estimateToolResultStringTokenPressure(text) {
  const conservativeToolResultEstimate = Math.ceil(text.length / TOOL_RESULT_CHARS_PER_TOKEN);
  const cjkAwareEstimate = estimateStringTokenPressure(text);
  return Math.max(conservativeToolResultEstimate, cjkAwareEstimate);
}
function estimateToolResultJsonTokenPressure(value) {
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string" ? estimateToolResultStringTokenPressure(serialized) : 1;
  } catch {
    return 256;
  }
}
function estimateToolResultBlockTokenPressure(block) {
  if (typeof block === "string") return estimateToolResultStringTokenPressure(block);
  if (!isRecord(block)) return estimateToolResultJsonTokenPressure(block);
  if (block.type === "text" && typeof block.text === "string")
    return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateToolResultStringTokenPressure(block.text);
  if (block.type === "thinking" && typeof block.thinking === "string")
    return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateToolResultStringTokenPressure(block.thinking);
  if (block.type === "image") return IMAGE_BLOCK_TOKENS;
  return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateToolResultJsonTokenPressure(block);
}
function estimateToolResultContentTokenPressure(content) {
  if (typeof content === "string") return estimateToolResultStringTokenPressure(content);
  if (Array.isArray(content))
    return content.reduce((sum, block) => sum + estimateToolResultBlockTokenPressure(block), 0);
  if (content !== void 0) return estimateToolResultJsonTokenPressure(content);
  return 0;
}
function estimateAssistantToolCallTokenPressure(block) {
  const args = block.arguments ?? block.input ?? block.args ?? {};
  return (
    CONTENT_BLOCK_OVERHEAD_TOKENS +
    estimateIdentifierTokenPressure(block.name, JSON_PAYLOAD_CHARS_PER_TOKEN) +
    estimateJsonPayloadTokenPressure(args, JSON_PAYLOAD_CHARS_PER_TOKEN)
  );
}
function estimateContentTokenPressure(content) {
  if (typeof content === "string") return estimateStringTokenPressure(content);
  if (Array.isArray(content))
    return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block), 0);
  if (content !== void 0) return estimateJsonPayloadTokenPressure(content);
  return 0;
}
function isToolResultMessage(message) {
  const record = message;
  return record.role === "toolResult" || record.role === "tool" || record.type === "toolResult";
}
function estimateMessageTokenPressure(message) {
  const record = message;
  let tokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS;
  if (isToolResultMessage(message)) {
    tokens += estimateToolResultContentTokenPressure(record.content);
    tokens += estimateIdentifierTokenPressure(record.toolName ?? record.tool_name);
    return tokens;
  }
  if (record.role === "bashExecution") {
    if (record.excludeFromContext === true) return 0;
    tokens += estimateStringTokenPressure(bashExecutionToText(record));
    return tokens;
  }
  if (record.role === "branchSummary") {
    const summary = typeof record.summary === "string" ? record.summary : "";
    tokens += estimateStringTokenPressure(BRANCH_SUMMARY_PREFIX + summary + BRANCH_SUMMARY_SUFFIX);
    return tokens;
  }
  if (record.role === "compactionSummary") {
    const summary = typeof record.summary === "string" ? record.summary : "";
    tokens += estimateStringTokenPressure(
      COMPACTION_SUMMARY_PREFIX + summary + COMPACTION_SUMMARY_SUFFIX,
    );
    return tokens;
  }
  if (record.role === "assistant") {
    const content = record.content;
    if (Array.isArray(content))
      for (const block of content)
        if (isRecord(block) && (block.type === "toolCall" || block.type === "tool_use"))
          tokens += estimateAssistantToolCallTokenPressure(block);
        else tokens += estimateContentBlockTokenPressure(block);
    else tokens += estimateContentTokenPressure(content);
    const toolCalls = record.toolCalls ?? record.tool_calls;
    if (Array.isArray(toolCalls))
      for (const toolCall of toolCalls)
        tokens += isRecord(toolCall)
          ? estimateAssistantToolCallTokenPressure(toolCall)
          : estimateJsonPayloadTokenPressure(toolCall);
    return tokens;
  }
  tokens += estimateContentTokenPressure(record.content);
  return tokens;
}
/**
 * Estimates the prompt pressure at the LLM boundary from transcript messages,
 * optional system prompt, and current prompt text. The result intentionally
 * includes a safety margin because this path runs before provider tokenization.
 */
function estimateLlmBoundaryTokenPressure(params) {
  const historyTokens = params.messages.reduce(
    (sum, message) => sum + estimateMessageTokenPressure(message),
    0,
  );
  const systemTokens =
    typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0
      ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt)
      : 0;
  const promptTokens =
    MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
  return Math.max(0, Math.ceil((historyTokens + systemTokens + promptTokens) * SAFETY_MARGIN));
}
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
function estimateRenderedLlmBoundaryTokenPressure(params) {
  const systemTokens =
    typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0
      ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt)
      : 0;
  const promptTokens =
    MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
  return Math.max(0, Math.ceil((systemTokens + promptTokens) * SAFETY_MARGIN));
}
function normalizeLlmBoundaryTokenPressure(pressure) {
  if (!pressure || !Number.isFinite(pressure.estimatedPromptTokens)) return;
  return {
    estimatedPromptTokens: Math.max(0, Math.ceil(pressure.estimatedPromptTokens)),
    source: pressure.source.trim() || "rendered_llm_boundary",
    ...(typeof pressure.renderedChars === "number" && Number.isFinite(pressure.renderedChars)
      ? { renderedChars: Math.max(0, Math.ceil(pressure.renderedChars)) }
      : {}),
  };
}
/**
 * Decides whether a run should compact before submitting the prompt, and
 * whether reducible tool results can avoid or follow compaction. Rendered LLM
 * boundary pressure wins over local transcript estimates when supplied.
 */
function shouldPreemptivelyCompactBeforePrompt(params) {
  let messagesForPressure = params.messages;
  const llmBoundaryTokenPressure = normalizeLlmBoundaryTokenPressure(
    params.llmBoundaryTokenPressure,
  );
  let estimatedPromptTokens =
    llmBoundaryTokenPressure?.estimatedPromptTokens ??
    estimateLlmBoundaryTokenPressure({
      messages: params.messages,
      systemPrompt: params.systemPrompt,
      prompt: params.prompt,
    });
  let pressureSource = llmBoundaryTokenPressure?.source ?? "transcript_estimate";
  if (params.unwindowedMessages && params.unwindowedMessages !== params.messages) {
    const unwindowedEstimatedPromptTokens = estimateLlmBoundaryTokenPressure({
      messages: params.unwindowedMessages,
      systemPrompt: params.systemPrompt,
      prompt: params.prompt,
    });
    if (unwindowedEstimatedPromptTokens > estimatedPromptTokens) {
      estimatedPromptTokens = unwindowedEstimatedPromptTokens;
      messagesForPressure = params.unwindowedMessages;
      pressureSource = "unwindowed_transcript_estimate";
    }
  }
  const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
  const requestedReserveTokens = Math.max(0, Math.floor(params.reserveTokens));
  const minPromptBudget = Math.min(
    MIN_PROMPT_BUDGET_TOKENS,
    Math.max(1, Math.floor(contextTokenBudget * MIN_PROMPT_BUDGET_RATIO)),
  );
  const effectiveReserveTokens = Math.min(
    requestedReserveTokens,
    Math.max(0, contextTokenBudget - minPromptBudget),
  );
  const promptBudgetBeforeReserve = Math.max(1, contextTokenBudget - effectiveReserveTokens);
  const overflowTokens = Math.max(0, estimatedPromptTokens - promptBudgetBeforeReserve);
  const toolResultPotential = estimateToolResultReductionPotential({
    messages: messagesForPressure,
    contextWindowTokens: params.contextTokenBudget,
    maxCharsOverride: params.toolResultMaxChars,
  });
  const overflowChars = overflowTokens * ESTIMATED_CHARS_PER_TOKEN;
  const truncateOnlyThresholdChars = Math.max(
    overflowChars + TRUNCATION_ROUTE_BUFFER_TOKENS * ESTIMATED_CHARS_PER_TOKEN,
    Math.ceil(overflowChars * 1.5),
  );
  const toolResultReducibleChars = toolResultPotential.maxReducibleChars;
  let route = "fits";
  if (overflowTokens > 0)
    if (toolResultReducibleChars <= 0) route = "compact_only";
    else if (toolResultReducibleChars >= truncateOnlyThresholdChars)
      route = "truncate_tool_results_only";
    else route = "compact_then_truncate";
  return {
    route,
    shouldCompact: route === "compact_only" || route === "compact_then_truncate",
    estimatedPromptTokens,
    pressureSource,
    promptBudgetBeforeReserve,
    overflowTokens,
    toolResultReducibleChars,
    effectiveReserveTokens,
  };
}
/** Formats the compact operator log line for one pre-prompt budget check. */
function formatPrePromptPrecheckLog(params) {
  const { result } = params;
  return `[context-overflow-precheck] pre-prompt check sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"} provider=${params.provider}/${params.modelId} route=${result.route} estimatedPromptTokens=${result.estimatedPromptTokens} pressureSource=${result.pressureSource ?? "unknown"} promptBudgetBeforeReserve=${result.promptBudgetBeforeReserve} overflowTokens=${result.overflowTokens} toolResultReducibleChars=${result.toolResultReducibleChars} reserveTokens=${params.reserveTokens} effectiveReserveTokens=${result.effectiveReserveTokens} contextTokenBudget=${params.contextTokenBudget} messages=${params.messageCount} unwindowedMessages=${params.unwindowedMessageCount ?? params.messageCount} sessionFile=${params.sessionFile}`;
}
/** Converts the pre-prompt decision into the persisted session context-budget status record. */
function buildPrePromptContextBudgetStatus(params) {
  const { result } = params;
  const remainingPromptBudgetTokens = Math.max(
    0,
    result.promptBudgetBeforeReserve - result.estimatedPromptTokens,
  );
  return {
    schemaVersion: 1,
    source: "pre-prompt-estimate",
    updatedAt: params.now ?? Date.now(),
    provider: params.provider,
    model: params.modelId,
    route: result.route,
    shouldCompact: result.shouldCompact,
    estimatedPromptTokens: result.estimatedPromptTokens,
    contextTokenBudget: Math.max(1, Math.floor(params.contextTokenBudget)),
    promptBudgetBeforeReserve: result.promptBudgetBeforeReserve,
    reserveTokens: Math.max(0, Math.floor(params.reserveTokens)),
    effectiveReserveTokens: result.effectiveReserveTokens,
    remainingPromptBudgetTokens,
    overflowTokens: result.overflowTokens,
    toolResultReducibleChars: result.toolResultReducibleChars,
    messageCount: Math.max(0, Math.floor(params.messageCount)),
    unwindowedMessageCount: Math.max(
      0,
      Math.floor(params.unwindowedMessageCount ?? params.messageCount),
    ),
    ...(params.sessionId ? { sessionId: params.sessionId } : {}),
  };
}
//#endregion
//#region src/agents/run-cleanup-timeout.ts
/**
 * Agent cleanup timeout guard.
 *
 * Bounds cleanup steps so run completion cannot hang forever while preserving late-failure diagnostics.
 */
const AGENT_CLEANUP_STEP_TIMEOUT_MS = 1e4;
const AGENT_CLEANUP_STEP_TIMEOUT_ENV = "OPENCLAW_AGENT_CLEANUP_TIMEOUT_MS";
const TRAJECTORY_FLUSH_TIMEOUT_ENV = "OPENCLAW_TRAJECTORY_FLUSH_TIMEOUT_MS";
const CLEANUP_TIMEOUT_DETAILS_MAX_CHARS = 512;
const CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX = "...[truncated]";
function parseTimeoutEnvValue(value) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  return parseStrictPositiveInteger(trimmed);
}
function resolveCleanupTimeoutDetails(getTimeoutDetails) {
  try {
    const timeoutDetails = getTimeoutDetails?.()?.trim();
    return timeoutDetails ? ` details=${truncateCleanupTimeoutDetails(timeoutDetails)}` : "";
  } catch (error) {
    return ` detailsError=${truncateCleanupTimeoutDetails(formatErrorMessage(error))}`;
  }
}
function truncateCleanupTimeoutDetails(value) {
  if (value.length <= CLEANUP_TIMEOUT_DETAILS_MAX_CHARS) return value;
  return `${truncateUtf16Safe(value, Math.max(0, CLEANUP_TIMEOUT_DETAILS_MAX_CHARS - 14))}${CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX}`;
}
function resolveAgentCleanupStepTimeoutMs(params) {
  const explicitTimeoutMs = resolveOptionalIntegerOption(params.timeoutMs, { min: 1 });
  if (explicitTimeoutMs !== void 0) return explicitTimeoutMs;
  const env = params.env ?? process.env;
  if (params.step === "openclaw-trajectory-flush") {
    const trajectoryTimeoutMs = parseTimeoutEnvValue(env[TRAJECTORY_FLUSH_TIMEOUT_ENV]);
    if (trajectoryTimeoutMs !== void 0) return trajectoryTimeoutMs;
  }
  return parseTimeoutEnvValue(env[AGENT_CLEANUP_STEP_TIMEOUT_ENV]) ?? AGENT_CLEANUP_STEP_TIMEOUT_MS;
}
/** Run one cleanup step with timeout logging and late-rejection handling. */
async function runAgentCleanupStep(params) {
  const timeoutMs = resolveAgentCleanupStepTimeoutMs({
    step: params.step,
    timeoutMs: params.timeoutMs,
    env: params.env,
  });
  let timeoutHandle;
  let timedOut = false;
  const cleanupPromise = Promise.resolve().then(params.cleanup);
  const observedCleanupPromise = cleanupPromise.catch((error) => {
    if (!timedOut)
      params.log.warn(
        `agent cleanup failed: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`,
      );
  });
  const timeoutPromise = new Promise((resolve) => {
    timeoutHandle = setTimeout(() => {
      timedOut = true;
      resolve("timeout");
    }, timeoutMs);
    timeoutHandle.unref?.();
  });
  const result = await Promise.race([observedCleanupPromise.then(() => "done"), timeoutPromise]);
  if (timeoutHandle) clearTimeout(timeoutHandle);
  if (result === "timeout") {
    const details = resolveCleanupTimeoutDetails(params.getTimeoutDetails);
    params.log.warn(
      `agent cleanup timed out: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} timeoutMs=${timeoutMs}${details}`,
    );
    cleanupPromise.catch((error) => {
      params.log.warn(
        `agent cleanup rejected after timeout: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`,
      );
    });
  }
}
//#endregion
//#region src/agents/harness/tool-result-middleware.ts
/**
 * Runs native harness tool-result middleware around tool execution results.
 */
const log = createSubsystemLogger("agents/harness");
const MAX_MIDDLEWARE_CONTENT_BLOCKS = 200;
const MAX_MIDDLEWARE_TEXT_CHARS = 1e5;
const MAX_MIDDLEWARE_IMAGE_DATA_CHARS = 5e6;
const MAX_MIDDLEWARE_CONTENT_DEPTH = 20;
const MAX_MIDDLEWARE_DETAILS_BYTES = 1e5;
const MAX_MIDDLEWARE_DETAILS_DEPTH = 20;
const MAX_MIDDLEWARE_DETAILS_KEYS = 1e3;
const NESTED_TOOL_RESULT_BLOCK_TYPES = /* @__PURE__ */ new Set(["toolresult", "tool_result"]);
function isValidMiddlewareContentBlock(value) {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (value.type === "text")
    return typeof value.text === "string" && value.text.length <= MAX_MIDDLEWARE_TEXT_CHARS;
  if (value.type === "image")
    return (
      typeof value.mimeType === "string" &&
      value.mimeType.trim().length > 0 &&
      typeof value.data === "string" &&
      value.data.length <= MAX_MIDDLEWARE_IMAGE_DATA_CHARS
    );
  return false;
}
function hasValidMiddlewareDetailsShape(
  value,
  state = {
    keys: 0,
    seen: /* @__PURE__ */ new WeakSet(),
  },
  depth = 0,
) {
  if (value === void 0 || value === null) return true;
  if (depth > MAX_MIDDLEWARE_DETAILS_DEPTH) return false;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return true;
  if (typeof value !== "object") return false;
  if (state.seen.has(value)) return false;
  state.seen.add(value);
  if (Array.isArray(value)) {
    state.keys += value.length;
    if (state.keys > MAX_MIDDLEWARE_DETAILS_KEYS) return false;
    for (const entry of value)
      if (!hasValidMiddlewareDetailsShape(entry, state, depth + 1)) return false;
    return true;
  }
  for (const entry of Object.values(value)) {
    state.keys += 1;
    if (state.keys > MAX_MIDDLEWARE_DETAILS_KEYS) return false;
    if (!hasValidMiddlewareDetailsShape(entry, state, depth + 1)) return false;
  }
  return true;
}
function isValidMiddlewareDetails(value) {
  if (value === void 0) return true;
  if (!hasValidMiddlewareDetailsShape(value)) return false;
  const size = boundedJsonUtf8Bytes(value, MAX_MIDDLEWARE_DETAILS_BYTES);
  return size.complete && size.bytes <= MAX_MIDDLEWARE_DETAILS_BYTES;
}
function isValidMiddlewareToolResult(value) {
  if (!isRecord(value) || !Array.isArray(value.content)) return false;
  if (value.content.length > MAX_MIDDLEWARE_CONTENT_BLOCKS) return false;
  return (
    value.content.every(isValidMiddlewareContentBlock) && isValidMiddlewareDetails(value.details)
  );
}
function createMiddlewareContentCoerceState() {
  return {
    depth: 0,
    seen: /* @__PURE__ */ new Set(),
  };
}
function descendMiddlewareContentCoerceState(value, state) {
  if (state.depth >= MAX_MIDDLEWARE_CONTENT_DEPTH) return;
  if (value !== null && typeof value === "object") {
    if (state.seen.has(value)) return;
    const seen = new Set(state.seen);
    seen.add(value);
    return {
      depth: state.depth + 1,
      seen,
    };
  }
  return {
    depth: state.depth + 1,
    seen: state.seen,
  };
}
function stringifyMiddlewareTextPayload(value) {
  const seen = /* @__PURE__ */ new WeakSet();
  try {
    return JSON.stringify(value, (_key, val) => {
      if (typeof val === "bigint") return val.toString();
      if (typeof val === "function" || typeof val === "symbol" || val === void 0) return;
      if (val !== null && typeof val === "object") {
        if (seen.has(val)) return;
        seen.add(val);
      }
      return val;
    });
  } catch {
    return;
  }
}
function coerceMiddlewareText(value, state = createMiddlewareContentCoerceState(), options = {}) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
    return String(value);
  if (!isRecord(value)) return;
  const nextState = descendMiddlewareContentCoerceState(value, state);
  if (!nextState) return;
  for (const key of ["text", "output", "result", "message"]) {
    const text = coerceMiddlewareText(value[key], nextState, options);
    if (text !== void 0) return text;
  }
  const content = value.content;
  if (Array.isArray(content)) {
    const chunks = coerceMiddlewareContentArray(content, nextState, options)
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .filter((text) => text.length > 0);
    return chunks.length > 0 ? chunks.join("\n") : void 0;
  }
  return stringifyMiddlewareTextPayload(value);
}
function appendMiddlewareContentBlock(blocks, block) {
  if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) return;
  if (block.type !== "text") {
    blocks.push(block);
    return;
  }
  if (!block.text) return;
  const previous = blocks.at(-1);
  if (previous?.type !== "text") {
    blocks.push({
      type: "text",
      text: truncateUtf16Safe(block.text, MAX_MIDDLEWARE_TEXT_CHARS),
    });
    return;
  }
  const remainingChars = MAX_MIDDLEWARE_TEXT_CHARS - previous.text.length - 1;
  if (remainingChars <= 0) return;
  previous.text = `${previous.text}\n${truncateUtf16Safe(block.text, remainingChars)}`;
}
function coerceMiddlewareContentArray(content, state, options = {}) {
  const blocks = [];
  let inspectedBlocks = 0;
  for (const entry of content) {
    inspectedBlocks += 1;
    if (
      inspectedBlocks > MAX_MIDDLEWARE_CONTENT_BLOCKS ||
      blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS
    )
      break;
    const coercedBlocks = coerceMiddlewareContentBlocks(entry, state, options);
    if (coercedBlocks.length > 0) {
      for (const block of coercedBlocks) {
        appendMiddlewareContentBlock(blocks, block);
        if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
      }
      continue;
    }
    const text = coerceMiddlewareText(entry, state, options);
    if (text)
      appendMiddlewareContentBlock(blocks, {
        type: "text",
        text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS),
      });
  }
  return blocks;
}
function coerceMiddlewareContentBlocks(
  value,
  state = createMiddlewareContentCoerceState(),
  options = {},
) {
  if (isValidMiddlewareContentBlock(value)) return [value];
  if (
    options.sanitizeContent === true &&
    isRecord(value) &&
    value.type === "text" &&
    typeof value.text === "string"
  )
    return [
      {
        type: "text",
        text: truncateUtf16Safe(value.text, MAX_MIDDLEWARE_TEXT_CHARS),
      },
    ];
  if (!isRecord(value) || typeof value.type !== "string") return [];
  const normalizedType = value.type.toLowerCase();
  if (!NESTED_TOOL_RESULT_BLOCK_TYPES.has(normalizedType)) return [];
  const content = value.content;
  if (Array.isArray(content) && content.length > 0) {
    const nextState = descendMiddlewareContentCoerceState(value, state);
    return nextState ? coerceMiddlewareContentArray(content, nextState, options) : [];
  }
  const text =
    coerceMiddlewareText(content, state, options) ?? coerceMiddlewareText(value, state, options);
  if (!text) return [];
  return [
    {
      type: "text",
      text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS),
    },
  ];
}
function coerceMiddlewareToolResult(value, options = {}) {
  if (isValidMiddlewareToolResult(value)) return value;
  if (!isRecord(value) || !Array.isArray(value.content)) return;
  const content = [];
  const state = createMiddlewareContentCoerceState();
  let inspectedBlocks = 0;
  for (const block of value.content) {
    inspectedBlocks += 1;
    if (inspectedBlocks > MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
    for (const coerced of coerceMiddlewareContentBlocks(block, state, options)) {
      content.push(coerced);
      if (content.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
    }
    if (content.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
  }
  if (content.length === 0) return;
  const details = isValidMiddlewareDetails(value.details)
    ? value.details
    : options.sanitizeDetails === true
      ? sanitizeMiddlewareDetailsValue(value.details)
      : void 0;
  if (details === void 0 && !isValidMiddlewareDetails(value.details)) return;
  const result = {
    ...value,
    content,
    details,
  };
  return isValidMiddlewareToolResult(result) ? result : void 0;
}
/**
 * Coerce an arbitrary value into a JSON-safe shape that satisfies
 * `isValidMiddlewareDetails`. Round-trips through `JSON.stringify` with a
 * WeakSet replacer that drops functions, symbols, and `undefined`; coerces
 * bigints to their decimal string form; breaks cycles at the offending
 * reference; and collapses payloads larger than the validator byte cap to a
 * `{ truncated, originalSizeBytes }` marker. Returns `null` for inputs that
 * cannot be represented at all (top-level function/symbol/undefined).
 */
function sanitizeMiddlewareDetailsValue(value) {
  const seen = /* @__PURE__ */ new WeakSet();
  try {
    const serialized = JSON.stringify(value, (_key, val) => {
      if (typeof val === "bigint") return val.toString();
      if (val !== null && typeof val === "object") {
        if (seen.has(val)) return;
        seen.add(val);
      }
      return val;
    });
    if (serialized === void 0) return null;
    const serializedBytes = Buffer.byteLength(serialized, "utf8");
    if (serializedBytes > MAX_MIDDLEWARE_DETAILS_BYTES)
      return {
        truncated: true,
        originalSizeBytes: serializedBytes,
      };
    return JSON.parse(serialized);
  } catch {
    return null;
  }
}
/**
 * Coerce an incoming tool result into a shape the validator will accept,
 * before any middleware runs. Tool emitters legitimately produce raw
 * dependency payloads on `details` (channel SDK objects with methods, exec
 * traces with cycles back to the runner, large attachment metadata). The
 * harness owes a registered middleware a JSON-safe view of that payload;
 * subsequent middleware-side mutations are still validated strictly.
 */
function sanitizeToolResultForMiddleware(result) {
  const coerced = coerceMiddlewareToolResult(result, {
    sanitizeContent: true,
    sanitizeDetails: true,
  });
  if (coerced) return coerced;
  if (result.details === void 0 || result.details === null) return result;
  if (isValidMiddlewareDetails(result.details)) return result;
  return {
    ...result,
    details: sanitizeMiddlewareDetailsValue(result.details),
  };
}
function buildMiddlewareFailureResult() {
  return {
    content: [
      {
        type: "text",
        text: "Tool output unavailable due to post-processing error.",
      },
    ],
    details: {
      status: "error",
      middlewareError: true,
    },
  };
}
function buildDeliveredMessagingFailureFallback(event, result) {
  if (
    event.isError === true ||
    isToolResultError(result) ||
    !isMessagingToolSendAction(event.toolName, event.args) ||
    !isDeliveredMessagingToolResult({
      toolName: event.toolName,
      args: event.args,
      result,
    }) ||
    !hasMessagingDeliveryReceipt(result)
  )
    return;
  return {
    content: [
      {
        type: "text",
        text: "Message delivered, but result post-processing failed.",
      },
    ],
    details: {
      ok: true,
      deliveryStatus: "sent",
      middlewareWarning: "post-processing failed",
    },
  };
}
function reconcileDeliveredMessagingFailure(result, fallback) {
  return fallback && isRecord(result.details) && result.details.middlewareError === true
    ? fallback
    : result;
}
function createAgentToolResultMiddlewareRunner(ctx, handlers) {
  const middlewareContext = {
    ...ctx,
    harness: ctx.harness ?? ctx.runtime,
  };
  let resolvedHandlers = handlers;
  const resolvedHandlersLoader = createLazyPromiseLoader(async () => {
    const { loadAgentToolResultMiddlewaresForRuntime } =
      await import("./agent-tool-result-middleware-loader-WwZr8Gju.js");
    return loadAgentToolResultMiddlewaresForRuntime({ runtime: ctx.runtime });
  });
  const resolveHandlers = async () => {
    if (resolvedHandlers) return resolvedHandlers;
    resolvedHandlers = await resolvedHandlersLoader.load();
    return resolvedHandlers;
  };
  return {
    async applyToolResultMiddleware(event) {
      const handlersForRun = await resolveHandlers();
      if (handlersForRun.length === 0) return event.result;
      const deliveredMessagingFallback = buildDeliveredMessagingFailureFallback(
        event,
        event.result,
      );
      let current = sanitizeToolResultForMiddleware(event.result);
      for (const handler of handlersForRun)
        try {
          const coercedCandidate = coerceMiddlewareToolResult(
            (
              await handler(
                {
                  ...event,
                  result: current,
                },
                middlewareContext,
              )
            )?.result ?? current,
          );
          if (coercedCandidate) current = coercedCandidate;
          else {
            log.warn(
              `[${ctx.runtime}] discarded invalid tool result middleware output for ${truncateUtf16Safe(event.toolName, 120)}`,
            );
            return reconcileDeliveredMessagingFailure(
              buildMiddlewareFailureResult(),
              deliveredMessagingFallback,
            );
          }
        } catch {
          log.warn(
            `[${ctx.runtime}] tool result middleware failed for ${truncateUtf16Safe(event.toolName, 120)}`,
          );
          return reconcileDeliveredMessagingFailure(
            buildMiddlewareFailureResult(),
            deliveredMessagingFallback,
          );
        }
      return reconcileDeliveredMessagingFailure(current, deliveredMessagingFallback);
    },
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.tool-run-context.ts
/**
 * Builds tool run context passed to embedded-agent tool handlers.
 */
/**
 * Builds the stable tool-run context forwarded into an embedded-attempt execution.
 */
function buildEmbeddedAttemptToolRunContext(params) {
  return {
    trigger: params.trigger,
    jobId: params.jobId,
    memoryFlushWritePath: params.memoryFlushWritePath,
    ...(params.toolsAllow ? { runtimeToolAllowlist: params.toolsAllow } : {}),
    ...(params.trace ? { trace: freezeDiagnosticTraceContext(params.trace) } : {}),
  };
}
//#endregion
export {
  buildPrePromptContextBudgetStatus as a,
  formatPrePromptPrecheckLog as c,
  summarizeInStages as d,
  buildHistoryPrunePlanWithWorker as f,
  shouldAllowProviderOwnedThinkingReplay as g,
  resolveTranscriptPolicy as h,
  PREEMPTIVE_OVERFLOW_ERROR_TEXT as i,
  shouldPreemptivelyCompactBeforePrompt as l,
  providerRequiresSignedThinking as m,
  createAgentToolResultMiddlewareRunner as n,
  estimateLlmBoundaryTokenPressure as o,
  computeAdaptiveChunkRatioWithWorker as p,
  runAgentCleanupStep as r,
  estimateRenderedLlmBoundaryTokenPressure as s,
  buildEmbeddedAttemptToolRunContext as t,
  resolveContextWindowTokens as u,
};
