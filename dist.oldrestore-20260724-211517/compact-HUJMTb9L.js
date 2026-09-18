import fs from "node:fs/promises";
import os from "node:os";
import "./utils-DtcDeqWS.js";
import {
  n as getActiveNodeContext,
  t as formatActiveNodeContextLabel,
} from "./active-node-context-IT1PF0OW.js";
import { t as createBundleLspToolRuntime } from "./agent-bundle-lsp-runtime-DQ5X8F-g.js";
import { n as createBundleMcpToolRuntime } from "./agent-bundle-mcp-materialize-DxUEddBG.js";
import { O as estimateTokens } from "./agent-core-DJCbl_Iw.js";
import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import {
  _ as resolveRunModelFallbacksOverride,
  y as resolveSessionAgentIds,
} from "./agent-scope-y9xQv_q1.js";
import {
  i as isSilentOverflowProneModel,
  n as applyAgentAutoCompactionGuard,
  r as applyAgentCompactionSettingsFromConfig,
} from "./agent-settings-CAPRfR7V.js";
import {
  n as resolveProcessToolScopeKey,
  t as createOpenClawCodingTools,
} from "./agent-tools-CQdhKaa9.js";
import {
  a as resolveEmbeddedAgentStreamFn,
  i as resolveEmbeddedAgentBaseStreamFn,
  r as resolveEmbeddedAgentApiKey,
  t as wrapStreamFnWithDiagnosticModelCallEvents,
} from "./attempt.model-diagnostic-events-DQ7TPDX5.js";
import {
  g as listActiveProcessSessionReferences,
  m as resolveEmbeddedCompactionTarget,
  p as resolveCompactionHarnessRuntime,
} from "./attempt.prompt-helpers-CztYiE1m.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt.thread-helpers-Di7wVu5W.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Bdqodowg.js";
import {
  a as resolveBootstrapContextForRun,
  i as makeBootstrapWarn,
  s as resolveContextInjectionMode,
} from "./bootstrap-files-B9pwG25K.js";
import { r as buildAgentRuntimePlan } from "./build-DkA06gaM.js";
import "./message-channel-NQc9DJ6B.js";
import { d as listRegisteredPluginAgentPromptGuidance } from "./command-registration-CTCK5hi-.js";
import {
  i as resolveCompactionFailureReason,
  n as classifyCompactionReason,
  r as formatUnknownCompactionReasonDetail,
} from "./compact-reasons-DBEvigt9.js";
import {
  a as runBeforeCompactionHooks,
  c as createFileBackedCompactionCheckpointStore,
  d as readSessionLeafStateFromTranscriptAsync,
  f as resolveCompactionCheckpointTranscriptPosition,
  i as runAfterCompactionHooks,
  n as buildBeforeCompactionHookMetrics,
  o as runPostCompactionSideEffects,
  p as resolveSessionCompactionCheckpointReason,
  r as estimateTokensAfterCompaction,
  s as buildCompactionHarnessModelProvider,
  t as asCompactionHookRunner,
} from "./compaction-hooks-C1YwjfxH.js";
import { n as resolveSandboxContext } from "./context-CEFGZ0oc.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-ZYc39F9v.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BibJNI2C.js";
import {
  a as resolveReusableRuntimeModelAuth,
  r as providerUsesCredentialScopedModelMetadata,
  s as materializePreparedRuntimeModel,
} from "./credential-scoped-model-lT7pctV8.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import {
  a as resolveUserTimezone,
  i as resolveUserTimeFormat,
  n as formatUserTime,
} from "./date-time-CcWivhrg.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import {
  A as compactWithSafetyTimeout,
  j as resolveCompactionTimeoutMs,
} from "./diagnostic-DE-wbBb7.js";
import {
  E as getActiveDiagnosticTraceContext,
  S as createDiagnosticTraceContext,
  T as freezeDiagnosticTraceContext,
} from "./diagnostic-events-5-gsFhkM.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-CU_-DTjY.js";
import { r as resolveOpenClawReferencePaths } from "./docs-path-CIMgdwYZ.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-z5vi4lWv.js";
import {
  p as ensureSessionHeader,
  r as pickFallbackThinkingLevel,
} from "./embedded-agent-helpers-DH71Di6x.js";
import {
  n as applySkillEnvOverridesFromSnapshot,
  t as applySkillEnvOverrides,
} from "./env-overrides-CRAVPAsb.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { t as applyExtraParamsToAgent } from "./extra-params-udyUZGR2.js";
import {
  a as describeFailoverError,
  i as coerceToFailoverError,
} from "./failover-error-CYvhrluQ.js";
import {
  _ as resolveChannelMessageToolHints,
  g as listChannelSupportedActions,
  y as resolveChannelReactionGuidance,
} from "./gateway-Dyh1k_4Q.js";
import { t as resolveHeartbeatPromptForSystemPrompt } from "./heartbeat-system-prompt-DoqehDUJ.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { t as log } from "./logger-C5RMMskO.js";
import { t as getMachineDisplayName } from "./machine-name-CsNA1WMX.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import {
  n as applyLocalNoAuthHeaderOverride,
  p as resolveModelAuthMode,
  t as applyAuthHeaderOverride,
} from "./model-auth-BWFdcEzF.js";
import { t as MissingProviderAuthError } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { t as readAgentModelContextTokens } from "./model-context-tokens-C7jGfEZp.js";
import {
  i as resolveModelCandidateChain,
  o as runWithModelFallback,
  t as isFallbackSummaryError,
} from "./model-fallback-CQfk1H6I.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-B7OGjVYg.js";
import { r as resolveModelAsync } from "./model-uG6W-_2M.js";
import { r as ensureOpenClawModelsJson } from "./models-config-GFqrAsQr.js";
import {
  L as isDefaultAgentRuntimeId,
  i as isOpenAIProvider,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import { l as supportsModelTools } from "./openai-transport-stream-BFFr80cz.js";
import { n as resolveRuntimeOsLabel } from "./os-summary-CVk_nSu8.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-CUDA42wQ.js";
import {
  f as unwrapSecretSentinelsForProviderEgress,
  l as protectPreparedProviderRuntimeAuth,
} from "./provider-local-service-DLgcYp6u.js";
import { n as extractModelCompat } from "./provider-model-compat-oht7fX8H.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DpW-uV6A.js";
import {
  N as resolveProviderTextTransforms,
  W as transformProviderSystemPrompt,
  b as prepareProviderRuntimeAuth,
} from "./provider-runtime-DyIHJ2cX.js";
import { t as registerProviderStreamForModel } from "./provider-stream-DDVQiA6H.js";
import "./sandbox-BbGZOuCz.js";
import { t as isReasoningTagProvider } from "./provider-utils-kjTiHUHz.js";
import {
  n as resolvePreparedRuntimeModelAuth,
  t as resolvePreparedRuntimeAuthAttempts,
} from "./resolve-auth-CsTY2ugu.js";
import {
  n as resolveAgentRunSessionTarget,
  t as applyAgentRunSessionTargetIdentity,
} from "./run-session-target-B5hjrVU1.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-qskRkoSz.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-CwbL9nR9.js";
import {
  r as resolveEmbeddedSandboxInfoExecPolicy,
  t as buildEmbeddedSandboxInfo,
} from "./sandbox-info-lFWzuYWA.js";
import {
  i as resolveEmbeddedRunSkillEntries,
  n as mapSandboxSkillUsagePaths,
  r as resolveSandboxSkillRuntimeInputs,
  t as mapSandboxSkillEntriesForPrompt,
} from "./sandbox-skills-CKbK02Bv.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import {
  $ as logRuntimeToolSchemaQuarantine,
  A as flushPendingToolResultsAfterIdle,
  C as consumeCompactionSafeguardCancelReason,
  D as trackSessionManagerAccess,
  E as prewarmSessionFile,
  N as shouldRotateCompactionTranscript,
  O as getHistoryLimitFromSessionKey,
  P as dedupeDuplicateUserMessagesForCompaction,
  T as createPreparedEmbeddedAgentSettingsManager,
  X as validateReplayTurns,
  Y as sanitizeSessionHistory,
  _ as buildEmbeddedSystemPrompt,
  b as hasMeaningfulConversationContent,
  c as buildEmbeddedMessageActionDiscoveryInput,
  g as applySystemPromptToSession,
  h as toSessionToolAllowlist,
  j as rotateTranscriptAfterCompaction,
  k as limitHistoryTurns,
  m as collectRegisteredToolNames,
  o as selectAgentHarness,
  p as collectAllowedToolNames,
  s as selectAgentHarnessForPreparedModelProviders,
  v as createEmbeddedAgentResourceLoader,
  w as setCompactionSafeguardCancelReason,
  x as isRealConversationMessage,
  y as buildEmbeddedExtensionFactories,
} from "./selection-B2JBt0RT.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
  i as isCronSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import { d as repairSessionFileIfNeeded, t as SessionManager } from "./session-manager-BD4l9VJc.js";
import { t as guardSessionManager } from "./session-tool-result-guard-wrapper-BNpL0uO1.js";
import { i as sanitizeToolUseResultPairing } from "./session-transcript-repair-BI2d8Y2b.js";
import {
  a as resolveSessionLockMaxHoldFromTimeout,
  s as resolveSessionWriteLockOptions,
  t as acquireSessionWriteLock,
} from "./session-write-lock-ByENUoH7.js";
import { o as createAgentSession } from "./sessions-Duh5damM.js";
import { t as detectRuntimeShell } from "./shell-utils-MIUiOyvx.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import {
  i as ensureAuthProfileStore,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
} from "./store-B7DoDdVM.js";
import { a as resolveAgentPromptSurfaceForSessionKey } from "./system-prompt-params-D6TwvfQB.js";
import { n as collectRuntimeChannelCapabilities } from "./system-prompt-report-X6XHxLFh.js";
import { i as wrapStreamFnTextTransforms } from "./text-transforms.runtime-CUzg1NnO.js";
import { n as resolveCandidateThinkingLevel } from "./thinking-runtime-D675lyzz.js";
import {
  n as filterRuntimeCompatibleTools,
  t as filterProviderNormalizableTools,
} from "./tool-schema-projection-ZrMdwk4s.js";
import { t as splitSdkTools } from "./tool-split-CUOp_ft8.js";
import {
  a as TranscriptFileState,
  c as readTranscriptFileState,
  l as writeTranscriptFileAtomic,
} from "./transcript-rewrite-BBGM2z7j.js";
import {
  n as mapThinkingLevelForProvider,
  r as normalizeContextTokenBudget,
  t as mapThinkingLevel,
} from "./utils-CefVZRZM.js";
import { s as resolveSkillsPromptForRun } from "./workspace-DR7anktc.js";
//#region src/agents/embedded-agent-runner/compaction-session-agent.ts
async function prepareCompactionSessionAgent(params) {
  const authStorage =
    params.authStorage &&
    typeof params.authStorage === "object" &&
    "getApiKey" in params.authStorage &&
    typeof params.authStorage.getApiKey === "function"
      ? params.authStorage
      : void 0;
  const transportApiKey = authStorage
    ? await resolveEmbeddedAgentApiKey({
        provider: params.effectiveModel.provider,
        resolvedApiKey: params.resolvedApiKey,
        authStorage,
      })
    : params.resolvedApiKey;
  params.session.agent.streamFn = resolveEmbeddedAgentStreamFn({
    currentStreamFn: resolveEmbeddedAgentBaseStreamFn({ session: params.session }),
    providerStreamFn: params.providerStreamFn,
    sessionId: params.sessionId,
    signal: params.signal,
    model: params.effectiveModel,
    resolvedApiKey: params.resolvedApiKey,
    transportAuthAvailable: Boolean(transportApiKey?.trim()),
    authProfileId: params.runtimePlan?.auth.forwardedAuthProfileId,
    authStorage: params.authStorage,
  });
  const providerTextTransforms = resolveProviderTextTransforms({
    provider: params.provider,
    config: params.config,
    workspaceDir: params.effectiveWorkspace,
  });
  if (providerTextTransforms)
    params.session.agent.streamFn = wrapStreamFnTextTransforms({
      streamFn: params.session.agent.streamFn,
      input: providerTextTransforms.input,
      output: providerTextTransforms.output,
      transformSystemPrompt: false,
    });
  const providerThinkingLevel = mapThinkingLevelForProvider(params.thinkLevel);
  const preparedRuntimeExtraParams = params.runtimePlan?.transport.resolveExtraParams({
    thinkingLevel: providerThinkingLevel,
    agentId: params.sessionAgentId,
    workspaceDir: params.effectiveWorkspace,
    model: params.effectiveModel,
  });
  return applyExtraParamsToAgent(
    params.session.agent,
    params.config,
    params.provider,
    params.modelId,
    void 0,
    providerThinkingLevel,
    params.sessionAgentId,
    params.effectiveWorkspace,
    params.effectiveModel,
    params.agentDir,
    void 0,
    {
      ...(preparedRuntimeExtraParams ? { preparedExtraParams: preparedRuntimeExtraParams } : {}),
      nativeWebSearchPolicyContext: {
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
      },
    },
  );
}
//#endregion
//#region src/agents/embedded-agent-runner/manual-compaction-boundary.ts
function replaceLatestCompactionBoundary(params) {
  return params.entries.map((entry) => {
    if (entry.type !== "compaction" || entry.id !== params.compactionEntryId) return entry;
    return {
      ...entry,
      firstKeptEntryId: entry.id,
    };
  });
}
function entryCreatesCompactionInputMessage(entry) {
  return (
    entry.type === "message" || entry.type === "custom_message" || entry.type === "branch_summary"
  );
}
function hasMessagesToSummarizeBeforeKeptTail(params) {
  const compactionIndex = params.branch.findIndex((entry) => entry.id === params.compaction.id);
  const firstKeptIndex = params.branch.findIndex(
    (entry) => entry.id === params.compaction.firstKeptEntryId,
  );
  if (compactionIndex <= 0 || firstKeptIndex < 0 || firstKeptIndex >= compactionIndex) return false;
  let boundaryStartIndex = 0;
  for (let i = compactionIndex - 1; i >= 0; i -= 1) {
    const entry = params.branch[i];
    if (entry?.type !== "compaction") continue;
    const previousFirstKeptIndex = params.branch.findIndex(
      (candidate) => candidate.id === entry.firstKeptEntryId,
    );
    boundaryStartIndex = previousFirstKeptIndex >= 0 ? previousFirstKeptIndex : i + 1;
    break;
  }
  return params.branch
    .slice(boundaryStartIndex, firstKeptIndex)
    .some((entry) => entryCreatesCompactionInputMessage(entry));
}
/** Rewrite the latest manual compaction leaf so replay starts from its summary. */
async function hardenManualCompactionBoundary(params) {
  const state = await readTranscriptFileState(params.sessionFile);
  const header = state.getHeader();
  if (!header)
    return {
      applied: false,
      messages: [],
    };
  const leaf = state.getLeafEntry();
  if (leaf?.type !== "compaction") {
    const sessionContext = state.buildSessionContext();
    return {
      applied: false,
      leafId: state.getLeafId() ?? void 0,
      messages: sessionContext.messages,
    };
  }
  const sessionContext = state.buildSessionContext();
  if (params.preserveRecentTail)
    return {
      applied: false,
      firstKeptEntryId: leaf.firstKeptEntryId,
      leafId: state.getLeafId() ?? void 0,
      messages: sessionContext.messages,
    };
  if (leaf.firstKeptEntryId === leaf.id)
    return {
      applied: false,
      firstKeptEntryId: leaf.id,
      leafId: state.getLeafId() ?? void 0,
      messages: sessionContext.messages,
    };
  if (
    !leaf.summary.trim() ||
    !hasMessagesToSummarizeBeforeKeptTail({
      branch: state.getBranch(leaf.id),
      compaction: leaf,
    })
  )
    return {
      applied: false,
      firstKeptEntryId: leaf.firstKeptEntryId,
      leafId: state.getLeafId() ?? void 0,
      messages: sessionContext.messages,
    };
  const replacedEntries = replaceLatestCompactionBoundary({
    entries: state.getEntries(),
    compactionEntryId: leaf.id,
  });
  const replacedState = new TranscriptFileState({
    header,
    entries: replacedEntries,
  });
  await writeTranscriptFileAtomic(params.sessionFile, [header, ...replacedEntries]);
  const replacedSessionContext = replacedState.buildSessionContext();
  return {
    applied: true,
    firstKeptEntryId: leaf.id,
    leafId: replacedState.getLeafId() ?? void 0,
    messages: replacedSessionContext.messages,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.ts
/**
 * Implements embedded-agent transcript compaction and runtime handoff.
 */
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
function hasRealConversationContent(msg, messages, index) {
  return isRealConversationMessage(msg, messages, index);
}
function createCompactionDiagId() {
  return `cmp-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
function resolveCompactionProviderStream(params) {
  return registerProviderStreamForModel({
    model: params.effectiveModel,
    cfg: params.config,
    agentDir: params.agentDir,
    workspaceDir: params.effectiveWorkspace,
  });
}
function normalizeObservedTokenCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
function getMessageTextChars(msg) {
  const content = msg.content;
  if (typeof content === "string") return content.length;
  if (!Array.isArray(content)) return 0;
  let total = 0;
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const text = block.text;
    if (typeof text === "string") total += text.length;
  }
  return total;
}
function resolveMessageToolLabel(msg) {
  const candidate = msg.toolName ?? msg.name ?? msg.tool;
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : void 0;
}
function summarizeCompactionMessages(messages) {
  let historyTextChars = 0;
  let toolResultChars = 0;
  const contributors = [];
  let estTokens = 0;
  let tokenEstimationFailed = false;
  for (const msg of messages) {
    const role = typeof msg.role === "string" ? msg.role : "unknown";
    const chars = getMessageTextChars(msg);
    historyTextChars += chars;
    if (role === "toolResult") toolResultChars += chars;
    contributors.push({
      role,
      chars,
      tool: resolveMessageToolLabel(msg),
    });
    if (!tokenEstimationFailed)
      try {
        estTokens += estimateTokens(msg);
      } catch {
        tokenEstimationFailed = true;
      }
  }
  return {
    messages: messages.length,
    historyTextChars,
    toolResultChars,
    estTokens: tokenEstimationFailed ? void 0 : estTokens,
    contributors: selectTopContributors(contributors),
  };
}
function selectTopContributors(contributors) {
  const selected = [];
  for (const contributor of contributors) {
    let insertAt = selected.length;
    for (let index = 0; index < selected.length; index += 1) {
      const selectedContributor = selected.at(index);
      if (selectedContributor && contributor.chars > selectedContributor.chars) {
        insertAt = index;
        break;
      }
    }
    if (insertAt < 3) {
      selected.splice(insertAt, 0, contributor);
      if (selected.length > 3) selected.pop();
    } else if (selected.length < 3) selected.push(contributor);
  }
  return selected;
}
function containsRealConversationMessages(messages) {
  return messages.some((message, index, allMessages) =>
    hasRealConversationContent(message, allMessages, index),
  );
}
function hasExplicitCompactionModel(params) {
  return Boolean(params.config?.agents?.defaults?.compaction?.model?.trim());
}
function resolveCompactionFallbacksOverride(params) {
  if (params.modelSelectionLocked) return [];
  return (
    params.modelFallbacksOverride ??
    resolveRunModelFallbacksOverride({
      cfg: params.config,
      sessionKey: params.sessionKey,
    })
  );
}
function hasCompactionModelFallbackCandidates(params) {
  const fallbacksOverride = resolveCompactionFallbacksOverride(params);
  const defaultFallbacks = resolveAgentModelFallbackValues(params.config?.agents?.defaults?.model);
  return (fallbacksOverride ?? defaultFallbacks).length > 0;
}
function classifyCompactionFallbackResult(result, provider, model) {
  if (result.ok) return null;
  const reason = result.reason?.trim();
  if (!reason) return null;
  const failoverError = coerceToFailoverError(
    Object.assign(new Error(result.failure?.rawError ?? reason), {
      status: result.failure?.status,
      code: result.failure?.code,
    }),
    {
      provider,
      model,
    },
  );
  return failoverError ? { error: failoverError } : null;
}
function fallbackFailureToCompactionResult(err) {
  return {
    ok: false,
    compacted: false,
    reason: isFallbackSummaryError(err) ? err.message : formatErrorMessage(err),
  };
}
/**
 * Core compaction logic without lane queueing.
 * Use this when already inside a session/global lane to avoid deadlocks.
 */
async function compactEmbeddedAgentSessionDirect(paramsInput) {
  const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
  const lockedHarnessRuntime = normalizeOptionalAgentRuntimeId(paramsBase.agentHarnessId);
  if (paramsBase.modelSelectionLocked === true && lockedHarnessRuntime !== "openclaw")
    return {
      ok: false,
      compacted: false,
      reason: lockedHarnessRuntime
        ? `Model selection is locked to native agent harness "${lockedHarnessRuntime}"; generic compaction is unavailable.`
        : "Model selection is locked but the persisted agent harness is unavailable.",
      failure: { reason: "model_selection_locked" },
    };
  const runSessionTarget = await resolveAgentRunSessionTarget(paramsBase);
  const params = {
    ...paramsBase,
    agentId: paramsBase.agentId ?? runSessionTarget.agentId,
    sessionId: runSessionTarget.sessionId,
    sessionKey: paramsBase.sessionKey ?? runSessionTarget.sessionKey,
    sessionFile: runSessionTarget.sessionFile,
  };
  if (hasExplicitCompactionModel(params) || !hasCompactionModelFallbackCandidates(params))
    return await compactEmbeddedAgentSessionDirectOnce(params);
  const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
    config: params.config,
    provider: params.provider,
    modelId: params.model,
    authProfileId: params.authProfileId,
    modelSelectionLocked: params.modelSelectionLocked,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const primaryProvider = resolvedCompactionTarget.provider ?? "openai";
  const primaryModel = resolvedCompactionTarget.model ?? "gpt-5.6-sol";
  const requestedPrimaryProvider = params.provider?.trim() || "openai";
  const fallbacksOverride = resolveCompactionFallbacksOverride(params);
  const resolvedPrimaryCandidate = resolveModelCandidateChain({
    cfg: params.config,
    provider: primaryProvider,
    model: primaryModel,
    fallbacksOverride,
  })[0];
  const fallbackAgentId = resolveSessionAgentIds({
    sessionKey: params.sandboxSessionKey ?? params.sessionKey,
    config: params.config,
    agentId: params.agentId,
  }).sessionAgentId;
  const fallbackSessionKey = params.sandboxSessionKey ?? params.sessionKey ?? params.sessionId;
  try {
    return (
      await runWithModelFallback({
        cfg: params.config,
        provider: primaryProvider,
        model: primaryModel,
        runId: params.runId ?? params.sessionId,
        agentDir: params.agentDir,
        agentId: fallbackAgentId,
        sessionId: params.sessionId,
        sessionKey: fallbackSessionKey,
        abortSignal: params.abortSignal,
        prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
          await ensureSelectedAgentHarnessPlugin({
            config: params.config,
            provider,
            modelId: model,
            agentId: fallbackAgentId,
            sessionKey: fallbackSessionKey,
            agentHarnessRuntimeOverride,
            workspaceDir: params.workspaceDir,
          });
        },
        fallbacksOverride,
        classifyResult: ({ result, provider, model }) =>
          classifyCompactionFallbackResult(result, provider, model),
        run: async (provider, model) => {
          const isPrimaryCandidate =
            provider === resolvedPrimaryCandidate?.provider &&
            model === resolvedPrimaryCandidate.model;
          const preservesPrimaryAuth =
            isPrimaryCandidate ||
            provider === primaryProvider ||
            provider === requestedPrimaryProvider;
          const authProfileId = preservesPrimaryAuth ? params.authProfileId : void 0;
          const candidateThinkLevel = resolveCandidateThinkingLevel({
            cfg: params.config,
            provider,
            modelId: model,
            level: params.thinkLevel,
            agentId: fallbackAgentId,
            sessionKey: fallbackSessionKey,
            agentRuntime: params.agentHarnessId,
          });
          return await compactEmbeddedAgentSessionDirectOnce({
            ...params,
            provider,
            model,
            authProfileId,
            authProfileIdSource: preservesPrimaryAuth ? params.authProfileIdSource : void 0,
            thinkLevel: candidateThinkLevel,
            runtimeAuthPlan: isPrimaryCandidate ? params.runtimeAuthPlan : void 0,
            runtimePlan: isPrimaryCandidate ? params.runtimePlan : void 0,
          });
        },
      })
    ).result;
  } catch (err) {
    return fallbackFailureToCompactionResult(err);
  }
}
async function compactEmbeddedAgentSessionDirectOnce(params) {
  const startedAt = Date.now();
  const diagId = params.diagId?.trim() || createCompactionDiagId();
  const trigger = params.trigger ?? "manual";
  const attempt = params.attempt ?? 1;
  const maxAttempts = params.maxAttempts ?? 1;
  const runId = params.runId ?? params.sessionId;
  const compactionModelCallTrace = freezeDiagnosticTraceContext(
    getActiveDiagnosticTraceContext() ?? createDiagnosticTraceContext(),
  );
  const diagnosticCompactionRunId = `${runId}:compaction:${diagId}`;
  let diagnosticModelCallSeq = 0;
  const resolvedWorkspace = resolveUserPath(params.workspaceDir);
  ensureRuntimePluginsLoaded({
    config: params.config,
    workspaceDir: resolvedWorkspace,
    allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
  });
  const earlyAgentIds = resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.config,
    agentId: params.agentId,
  });
  const agentDir =
    params.agentDir ?? resolveAgentDir(params.config ?? {}, earlyAgentIds.sessionAgentId);
  const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey;
  const runtimePolicyAgentId =
    params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey)
      ? void 0
      : params.agentId;
  const policyCompactionTarget = resolveEmbeddedCompactionTarget({
    config: params.config,
    provider: params.provider,
    modelId: params.model,
    authProfileId: params.authProfileId,
    modelSelectionLocked: params.modelSelectionLocked,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const policyProvider = policyCompactionTarget.provider ?? "openai";
  const policyModelId = policyCompactionTarget.model ?? "gpt-5.6-sol";
  const configuredHarnessPolicy = resolveAgentHarnessPolicy({
    provider: policyProvider,
    modelId: policyModelId,
    config: params.config,
    agentId: runtimePolicyAgentId,
    sessionKey: runtimePolicySessionKey,
  });
  const configuredHarnessRuntime =
    configuredHarnessPolicy.runtimeSource &&
    configuredHarnessPolicy.runtimeSource !== "implicit" &&
    !isDefaultAgentRuntimeId(configuredHarnessPolicy.runtime)
      ? configuredHarnessPolicy.runtime
      : void 0;
  const boundHarnessRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
  const selectedHarnessRuntime = resolveCompactionHarnessRuntime({
    boundHarnessRuntime,
    preparedRuntimePlan: params.runtimePlan,
    configuredHarnessRuntime,
    provider: policyProvider,
    modelId: policyModelId,
  });
  const selectedHarnessRuntimeOverride = boundHarnessRuntime ? void 0 : selectedHarnessRuntime;
  const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
    config: params.config,
    provider: params.provider,
    modelId: params.model,
    authProfileId: params.authProfileId,
    harnessRuntime: selectedHarnessRuntime,
    modelSelectionLocked: params.modelSelectionLocked,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const provider = resolvedCompactionTarget.provider ?? "openai";
  const runtimeProvider = resolvedCompactionTarget.runtimeProvider ?? provider;
  const contextConfigProvider = resolvedCompactionTarget.contextProvider ?? provider;
  const modelId = resolvedCompactionTarget.model ?? "gpt-5.6-sol";
  const {
    plan: reusableRuntimeAuthPlan,
    authProfileId,
    modelAuth: initialModelAuth,
  } = resolveReusableRuntimeModelAuth({
    plan: params.runtimeAuthPlan ?? params.runtimePlan?.auth,
    provider,
    modelId,
    authProfileId: resolvedCompactionTarget.authProfileId,
  });
  await ensureSelectedAgentHarnessPlugin({
    config: params.config,
    provider,
    modelId,
    agentId: runtimePolicyAgentId,
    sessionKey: runtimePolicySessionKey,
    agentHarnessId: boundHarnessRuntime,
    agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride,
    workspaceDir: resolvedWorkspace,
  });
  let thinkLevel = params.thinkLevel ?? "off";
  const attemptedThinking = /* @__PURE__ */ new Set();
  const fail = (reason, err) => {
    const failureReason = classifyCompactionReason(reason);
    const failure = err ? describeFailoverError(err) : void 0;
    const detail =
      failureReason === "unknown" ? formatUnknownCompactionReasonDetail(reason) : void 0;
    const detailSuffix = detail ? ` detail=${detail}` : "";
    log.warn(
      `[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=failed reason=${failureReason}${detailSuffix} durationMs=${Date.now() - startedAt}`,
    );
    return {
      ok: false,
      compacted: false,
      reason,
      failure: failure
        ? {
            reason: failure.reason,
            status: failure.status,
            code: failure.code,
            rawError: failure.rawError ?? failure.message,
          }
        : void 0,
    };
  };
  await ensureOpenClawModelsJson(params.config, agentDir, { workspaceDir: resolvedWorkspace });
  const { model, error, authStorage, modelRegistry } = await resolveModelAsync(
    runtimeProvider,
    modelId,
    agentDir,
    params.config,
    initialModelAuth,
  );
  if (!model) return fail(error ?? `Unknown model: ${runtimeProvider}/${modelId}`);
  const runtimeAuthProfileStore = isOpenAIProvider(provider)
    ? ensureAuthProfileStore(agentDir, {
        externalCliProviderIds: ["openai"],
        allowKeychainPrompt: false,
      })
    : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
  const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
    provider: runtimeProvider,
    modelId,
    config: params.config,
    agentDir,
    workspaceDir: resolvedWorkspace,
  });
  const selectHarnessForPreparedAttempts = (attempts) =>
    selectAgentHarnessForPreparedModelProviders({
      provider,
      modelId,
      modelProviders: attempts.map((authAttempt) =>
        buildCompactionHarnessModelProvider({
          model,
          plan: authAttempt.plan,
          attempt: authAttempt,
        }),
      ),
      config: params.config,
      agentId: runtimePolicyAgentId,
      sessionKey: runtimePolicySessionKey,
      agentHarnessId: boundHarnessRuntime,
      agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride,
    });
  const initialHarness = reusableRuntimeAuthPlan
    ? void 0
    : selectAgentHarness({
        provider,
        modelId,
        modelProvider: buildCompactionHarnessModelProvider({ model }),
        config: params.config,
        agentId: runtimePolicyAgentId,
        sessionKey: runtimePolicySessionKey,
        agentHarnessId: boundHarnessRuntime,
        agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride,
      });
  const prepareRuntimeAuth = (harness) =>
    prepareAgentRuntimeAuth({
      provider,
      modelId,
      modelApi: model.api,
      modelBaseUrl: model.baseUrl,
      config: params.config,
      env: process.env,
      agentDir,
      workspaceDir: resolvedWorkspace,
      authProfileStore: runtimeAuthProfileStore,
      sessionAuthProfileId: authProfileId,
      sessionAuthProfileSource: params.authProfileIdSource,
      harnessId: harness.id,
      harnessRuntime: harness.id,
      harnessAuthBootstrap: harness.authBootstrap,
    });
  let runtimeAuthPreparation = reusableRuntimeAuthPlan
    ? {
        plan: reusableRuntimeAuthPlan,
        attempts: [
          {
            kind: "implicit",
            plan: reusableRuntimeAuthPlan,
          },
        ],
      }
    : prepareRuntimeAuth(initialHarness);
  let selectedPreparedHarness = selectHarnessForPreparedAttempts(runtimeAuthPreparation.attempts);
  if (!reusableRuntimeAuthPlan && selectedPreparedHarness.id !== initialHarness?.id) {
    runtimeAuthPreparation = prepareRuntimeAuth(selectedPreparedHarness);
    const confirmedHarness = selectHarnessForPreparedAttempts(runtimeAuthPreparation.attempts);
    if (confirmedHarness.id !== selectedPreparedHarness.id)
      throw new Error(
        `Prepared compaction auth routes did not converge on one agent harness for ${provider}/${modelId}.`,
      );
    selectedPreparedHarness = confirmedHarness;
  }
  const preparedHarnessRuntime = selectedPreparedHarness.id;
  const resolvePreparedModel = ({
    config,
    authProfileId: profileId,
    authProfileMode: resolvedAuthProfileMode,
  }) =>
    resolveModelAsync(runtimeProvider, modelId, agentDir, config, {
      authStorage,
      modelRegistry,
      skipAgentDiscovery: true,
      allowBundledStaticCatalogFallback: true,
      preferBundledStaticCatalogTransport: true,
      workspaceDir: resolvedWorkspace,
      authProfileId: profileId,
      authProfileMode: resolvedAuthProfileMode,
    });
  const materializeAuthAttemptModel = async (materializeParams) =>
    (await materializePreparedRuntimeModel({
      plan: materializeParams.plan,
      provider,
      modelId,
      config: params.config,
      model: materializeParams.model,
      forceResolve: materializeParams.forceResolve,
      resolveModel: resolvePreparedModel,
    })) ?? materializeParams.model;
  const resolveRuntimeAuthAttempt = () =>
    resolvePreparedRuntimeAuthAttempts({
      attempts: runtimeAuthPreparation.attempts,
      store: runtimeAuthProfileStore,
      modelId,
      model,
      materializeModel: materializeAuthAttemptModel,
      forceCredentialScopedDirectModelResolve: providerUsesProfileScopedModelMetadata,
      resolveAuth: async ({ attempt: preparedAttempt, model: attemptModel }) =>
        await resolvePreparedRuntimeModelAuth({
          plan: preparedAttempt.plan,
          model: attemptModel,
          cfg: params.config,
          store: runtimeAuthProfileStore,
          agentDir,
          workspaceDir: resolvedWorkspace,
          ...(preparedAttempt.allowAuthProfileFallback !== void 0
            ? { allowAuthProfileFallback: preparedAttempt.allowAuthProfileFallback }
            : {}),
          secretSentinels: true,
        }),
      errorMessage: `Prepared compaction auth attempts could not be resolved for ${provider}/${modelId}.`,
    });
  let resolvedAuthAttempt;
  try {
    resolvedAuthAttempt = await resolveRuntimeAuthAttempt();
  } catch (err) {
    return fail(formatErrorMessage(err), err);
  }
  let runtimeModel = resolvedAuthAttempt.model;
  const apiKeyInfo = resolvedAuthAttempt.auth;
  const resolvedRuntimeAuthPlan = resolvedAuthAttempt.plan;
  let hasRuntimeAuthExchange = false;
  try {
    if (!apiKeyInfo.apiKey) {
      if (apiKeyInfo.mode !== "aws-sdk")
        throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
    } else {
      const preparedAuth = protectPreparedProviderRuntimeAuth({
        provider: runtimeModel.provider,
        preparedAuth: await prepareProviderRuntimeAuth({
          provider: runtimeModel.provider,
          config: params.config,
          workspaceDir: resolvedWorkspace,
          env: process.env,
          context: {
            config: params.config,
            agentDir,
            workspaceDir: resolvedWorkspace,
            env: process.env,
            provider: runtimeModel.provider,
            modelId,
            model: runtimeModel,
            apiKey: unwrapSecretSentinelsForProviderEgress(
              apiKeyInfo.apiKey,
              "provider runtime auth exchange",
            ),
            authMode: apiKeyInfo.mode,
            profileId: apiKeyInfo.profileId,
          },
        }),
      });
      runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
      const runtimeApiKey = preparedAuth?.apiKey ?? apiKeyInfo.apiKey;
      hasRuntimeAuthExchange = Boolean(preparedAuth?.apiKey);
      if (!runtimeApiKey)
        throw new Error(`Provider "${runtimeModel.provider}" runtime auth returned no apiKey.`);
      authStorage.setRuntimeApiKey(runtimeModel.provider, runtimeApiKey);
    }
  } catch (err) {
    return fail(formatErrorMessage(err), err);
  }
  await fs.mkdir(resolvedWorkspace, { recursive: true });
  const sandboxSessionKey =
    params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
  const sandbox = await resolveSandboxContext({
    config: params.config,
    execOverrides: params.execOverrides,
    sessionKey: sandboxSessionKey,
    workspaceDir: resolvedWorkspace,
  });
  const effectiveWorkspace = sandbox?.enabled
    ? sandbox.workspaceAccess === "rw"
      ? resolvedWorkspace
      : sandbox.workspaceDir
    : resolvedWorkspace;
  const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
  if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace)
    throw new Error(
      "cwd override is not supported for sandboxed embedded compaction runs; omit cwd or use the agent workspace as cwd",
    );
  const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : (requestedCwd ?? effectiveWorkspace);
  await fs.mkdir(effectiveWorkspace, { recursive: true });
  const isSqliteSessionTranscript = Boolean(parseSqliteSessionFileMarker(params.sessionFile));
  if (!isSqliteSessionTranscript)
    await ensureSessionHeader({
      sessionFile: params.sessionFile,
      sessionId: params.sessionId,
      cwd: effectiveCwd,
    });
  const { sessionAgentId: effectiveSkillAgentId } = earlyAgentIds;
  let restoreSkillEnv;
  let compactionSessionManager = null;
  let checkpointSnapshot = null;
  let checkpointSnapshotRetained = false;
  try {
    const {
      skillsEligibility,
      skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace,
      skillsSnapshot: skillsSnapshotForRun,
      skillsWorkspaceDir: effectiveSkillsWorkspace,
      workspaceOnly: loadSkillsWorkspaceOnly,
    } = resolveSandboxSkillRuntimeInputs({
      sandbox,
      effectiveWorkspace,
      skillsSnapshot: params.skillsSnapshot,
    });
    const { shouldLoadSkillEntries, skillEntries } = resolveEmbeddedRunSkillEntries({
      workspaceDir: effectiveSkillsWorkspace,
      config: params.config,
      agentId: effectiveSkillAgentId,
      eligibility: skillsEligibility,
      skillsSnapshot: skillsSnapshotForRun,
      workspaceOnly: loadSkillsWorkspaceOnly,
    });
    restoreSkillEnv = skillsSnapshotForRun
      ? applySkillEnvOverridesFromSnapshot({
          snapshot: skillsSnapshotForRun,
          config: params.config,
        })
      : applySkillEnvOverrides({
          skills: skillEntries ?? [],
          config: params.config,
        });
    const promptSkillEntries = mapSandboxSkillEntriesForPrompt({
      entries: shouldLoadSkillEntries ? skillEntries : void 0,
      skillsWorkspaceDir: effectiveSkillsWorkspace,
      skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace,
    });
    const skillUsagePaths = mapSandboxSkillUsagePaths({
      paths: sandbox?.skillUsagePaths,
      skillsWorkspaceDir: effectiveSkillsWorkspace,
      skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace,
    });
    const skillsPrompt = resolveSkillsPromptForRun({
      skillsSnapshot: skillsSnapshotForRun,
      entries: promptSkillEntries,
      config: params.config,
      workspaceDir: effectiveSkillsPromptWorkspace,
      agentId: effectiveSkillAgentId,
      eligibility: skillsEligibility,
    });
    const sessionLabel = params.sessionKey ?? params.sessionId;
    const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
    const { contextFiles } =
      resolveContextInjectionMode(params.config, effectiveSkillAgentId) === "never"
        ? { contextFiles: [] }
        : await resolveBootstrapContextForRun({
            workspaceDir: effectiveWorkspace,
            config: params.config,
            sessionKey: params.sessionKey,
            sessionId: params.sessionId,
            agentId: effectiveSkillAgentId,
            warn: makeBootstrapWarn({
              sessionLabel,
              warn: (message) => log.warn(message),
            }),
          });
    const runtimeModelWithContext = runtimeModel;
    const resolvedContextTokenBudget =
      normalizeContextTokenBudget(
        resolveContextWindowInfo({
          cfg: params.config,
          provider: contextConfigProvider,
          modelId,
          modelContextTokens: readAgentModelContextTokens(runtimeModel),
          modelContextWindow: runtimeModelWithContext.contextWindow,
          defaultTokens: 2e5,
        }).tokens,
      ) ?? 2e5;
    const requestedContextTokenBudget =
      normalizeContextTokenBudget(params.contextTokenBudget) ??
      normalizeContextTokenBudget(params.tokenBudget);
    const contextTokenBudget = Math.min(
      requestedContextTokenBudget ?? resolvedContextTokenBudget,
      resolvedContextTokenBudget,
    );
    const effectiveModel = applyAuthHeaderOverride(
      applyLocalNoAuthHeaderOverride(
        contextTokenBudget < (runtimeModelWithContext.contextWindow ?? Infinity)
          ? {
              ...runtimeModelWithContext,
              contextWindow: contextTokenBudget,
            }
          : runtimeModelWithContext,
        apiKeyInfo,
      ),
      hasRuntimeAuthExchange ? null : apiKeyInfo,
      params.config,
    );
    const reuseFullRuntimePlan = params.runtimePlan?.auth === resolvedRuntimeAuthPlan;
    const preparedRuntimePlan =
      (reuseFullRuntimePlan ? params.runtimePlan : void 0) ??
      buildAgentRuntimePlan({
        provider,
        modelId,
        model: effectiveModel,
        modelApi: effectiveModel.api,
        harnessId: preparedHarnessRuntime,
        harnessRuntime: preparedHarnessRuntime,
        authProfileMode: resolvedRuntimeAuthPlan.selectedAuthMode,
        sessionAuthProfileId: resolvedRuntimeAuthPlan.forwardedAuthProfileId,
        sessionAuthProfileSource: resolvedRuntimeAuthPlan.forwardedAuthProfileSource,
        sessionAuthProfileCandidateIds: resolvedRuntimeAuthPlan.forwardedAuthProfileCandidateIds,
        modelRoute: resolvedRuntimeAuthPlan.modelRoute,
        config: params.config,
        workspaceDir: effectiveWorkspace,
        agentDir,
        agentId: effectiveSkillAgentId,
        thinkingLevel: mapThinkingLevelForProvider(thinkLevel),
      });
    const runtimePlan = reuseFullRuntimePlan
      ? preparedRuntimePlan
      : {
          ...preparedRuntimePlan,
          auth: resolvedRuntimeAuthPlan,
        };
    const runAbortController = new AbortController();
    const spawnWorkspaceDir =
      effectiveCwd !== effectiveWorkspace
        ? resolvedWorkspace
        : resolveAttemptSpawnWorkspaceDir({
            sandbox,
            resolvedWorkspace,
          });
    const runtimeCapabilityProfile = resolveConversationCapabilityProfile({
      config: params.config,
      sessionKey: sandboxSessionKey,
      runSessionKey:
        params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0,
      sessionId: params.sessionId,
      runId: params.runId,
      agentDir,
      agentAccountId: params.agentAccountId,
      messageProvider: resolvedMessageProvider,
      chatType: params.chatType,
      groupId: params.groupId,
      groupChannel: params.groupChannel,
      groupSpace: params.groupSpace,
      spawnedBy: params.spawnedBy,
      senderId: params.senderId,
      senderName: params.senderName,
      senderUsername: params.senderUsername,
      senderE164: params.senderE164,
      senderIsOwner: params.senderIsOwner,
      modelProvider: effectiveModel.provider,
      modelId,
      modelApi: effectiveModel.api,
      modelContextWindowTokens: contextTokenBudget,
      workspaceDir: effectiveWorkspace,
      cwd: effectiveCwd,
      spawnWorkspaceDir,
      skillsSnapshot: skillsSnapshotForRun,
      sandboxToolPolicy: sandbox?.tools,
    });
    const toolsEnabled = supportsModelTools(effectiveModel);
    const toolsRaw = toolsEnabled
      ? createOpenClawCodingTools({
          exec: {
            ...params.execOverrides,
            config: params.config,
            elevated: params.bashElevated,
          },
          sandbox,
          messageProvider: resolvedMessageProvider,
          clientCaps: params.clientCaps,
          chatType: params.chatType,
          agentAccountId: params.agentAccountId,
          sessionKey: sandboxSessionKey,
          runSessionKey:
            params.sessionKey && params.sessionKey !== sandboxSessionKey
              ? params.sessionKey
              : void 0,
          sessionId: params.sessionId,
          runId: params.runId,
          oneShotCliRun: params.oneShotCliRun,
          groupId: params.groupId,
          groupChannel: params.groupChannel,
          groupSpace: params.groupSpace,
          spawnedBy: params.spawnedBy,
          senderId: params.senderId,
          senderName: params.senderName,
          senderUsername: params.senderUsername,
          senderE164: params.senderE164,
          allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
          agentDir,
          cwd: effectiveCwd,
          workspaceDir: effectiveWorkspace,
          spawnWorkspaceDir,
          config: params.config,
          abortSignal: runAbortController.signal,
          sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
          modelProvider: effectiveModel.provider,
          modelId,
          modelHasVision: effectiveModel.input?.includes("image") ?? false,
          modelCompat: extractModelCompat(effectiveModel),
          modelApi: effectiveModel.api,
          modelContextWindowTokens: contextTokenBudget,
          skillsSnapshot: skillsSnapshotForRun,
          skillUsagePaths,
          conversationCapabilityProfile: runtimeCapabilityProfile,
          modelAuthMode: resolveModelAuthMode(effectiveModel.provider, params.config, void 0, {
            workspaceDir: effectiveWorkspace,
          }),
        })
      : [];
    const runtimePlanModelContext = {
      workspaceDir: effectiveWorkspace,
      modelApi: effectiveModel.api,
      model: effectiveModel,
    };
    const normalizableToolProjection = filterProviderNormalizableTools(
      toolsEnabled ? toolsRaw : [],
    );
    logRuntimeToolSchemaQuarantine({
      diagnostics: normalizableToolProjection.diagnostics,
      tools: toolsEnabled ? toolsRaw : [],
      runId,
      agentId: effectiveSkillAgentId,
      sessionKey: params.sessionKey,
      sessionId: params.sessionId,
    });
    const tools = runtimePlan.tools.normalize(
      [...normalizableToolProjection.tools],
      runtimePlanModelContext,
    );
    const bundleMcpRuntime = toolsEnabled
      ? await createBundleMcpToolRuntime({
          workspaceDir: effectiveWorkspace,
          cfg: params.config,
          reservedToolNames: tools.map((tool) => tool.name),
        })
      : void 0;
    const bundleLspRuntime = toolsEnabled
      ? await createBundleLspToolRuntime({
          workspaceDir: effectiveWorkspace,
          cfg: params.config,
          reservedToolNames: [
            ...tools.map((tool) => tool.name),
            ...(bundleMcpRuntime?.tools.map((tool) => tool.name) ?? []),
          ],
        })
      : void 0;
    const filteredBundledTools = applyFinalEffectiveToolPolicy({
      bundledTools: [...(bundleMcpRuntime?.tools ?? []), ...(bundleLspRuntime?.tools ?? [])],
      config: params.config,
      conversationCapabilityProfile: runtimeCapabilityProfile,
      warn: (message) => log.warn(message),
    });
    const normalizableBundledToolProjection = filterProviderNormalizableTools(filteredBundledTools);
    if (normalizableBundledToolProjection.diagnostics.length > 0)
      logRuntimeToolSchemaQuarantine({
        diagnostics: normalizableBundledToolProjection.diagnostics,
        tools: filteredBundledTools,
        runId,
        agentId: effectiveSkillAgentId,
        sessionKey: params.sessionKey,
        sessionId: params.sessionId,
      });
    const normalizedBundledTools =
      filteredBundledTools.length > 0
        ? runtimePlan.tools.normalize(
            [...normalizableBundledToolProjection.tools],
            runtimePlanModelContext,
          )
        : filteredBundledTools;
    const projectedEffectiveTools = [...tools, ...normalizedBundledTools];
    const toolSchemaProjection = filterRuntimeCompatibleTools(projectedEffectiveTools);
    logRuntimeToolSchemaQuarantine({
      diagnostics: toolSchemaProjection.diagnostics,
      tools: projectedEffectiveTools,
      runId,
      agentId: effectiveSkillAgentId,
      sessionKey: params.sessionKey,
      sessionId: params.sessionId,
    });
    const effectiveTools = [...toolSchemaProjection.tools];
    const allowedToolNames = collectAllowedToolNames({ tools: effectiveTools });
    runtimePlan.tools.logDiagnostics(effectiveTools, runtimePlanModelContext);
    const machineName = await getMachineDisplayName();
    const runtimeChannel = normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
    const runtimeCapabilities = collectRuntimeChannelCapabilities({
      cfg: params.config,
      channel: runtimeChannel,
      accountId: params.agentAccountId,
    });
    const reactionGuidance =
      runtimeChannel && params.config
        ? resolveChannelReactionGuidance({
            cfg: params.config,
            channel: runtimeChannel,
            accountId: params.agentAccountId,
          })
        : void 0;
    const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
      sessionKey: params.sessionKey,
      config: params.config,
      agentId: params.agentId,
    });
    const channelActions = runtimeChannel
      ? listChannelSupportedActions(
          buildEmbeddedMessageActionDiscoveryInput({
            cfg: params.config,
            channel: runtimeChannel,
            currentChannelId: params.currentChannelId,
            currentThreadTs: params.currentThreadTs,
            currentMessageId: params.currentMessageId,
            accountId: params.agentAccountId,
            sessionKey: params.sessionKey,
            sessionId: params.sessionId,
            agentId: sessionAgentId,
            senderId: params.senderId,
          }),
        )
      : void 0;
    const messageToolHints = runtimeChannel
      ? resolveChannelMessageToolHints({
          cfg: params.config,
          channel: runtimeChannel,
          accountId: params.agentAccountId,
        })
      : void 0;
    const runtimeInfo = {
      agentId: sessionAgentId,
      sessionKey: params.sessionKey,
      host: machineName,
      os: resolveRuntimeOsLabel(),
      arch: os.arch(),
      node: process.version,
      model: `${provider}/${modelId}`,
      shell: detectRuntimeShell(),
      channel: runtimeChannel,
      chatType: params.chatType,
      capabilities: runtimeCapabilities,
      channelActions,
      activeProcessSessions: listActiveProcessSessionReferences({
        scopeKey: resolveProcessToolScopeKey({
          sessionKey: sandboxSessionKey,
          agentId: sessionAgentId,
        }),
      }),
      activeNode: formatActiveNodeContextLabel(getActiveNodeContext()),
    };
    const sandboxInfoExecPolicy = resolveEmbeddedSandboxInfoExecPolicy({
      config: params.config,
      agentId: sessionAgentId,
      sessionKey: params.sessionKey,
      sandboxAvailable: sandbox?.enabled === true,
      execOverrides: params.execOverrides,
    });
    const sandboxInfo = buildEmbeddedSandboxInfo(
      sandbox,
      params.bashElevated,
      sandboxInfoExecPolicy,
    );
    const reasoningTagHint = isReasoningTagProvider(provider, {
      config: params.config,
      workspaceDir: effectiveWorkspace,
      env: process.env,
      modelId,
      modelApi: effectiveModel.api,
      model: effectiveModel,
    });
    const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
    const userTimeFormat = resolveUserTimeFormat(params.config?.agents?.defaults?.timeFormat);
    const userTime = formatUserTime(/* @__PURE__ */ new Date(), userTimezone, userTimeFormat);
    const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
    const promptMode =
      isSubagentSessionKey(params.sessionKey) || isCronSessionKey(params.sessionKey)
        ? "minimal"
        : "full";
    const nativeCommandGuidanceLines = listRegisteredPluginAgentPromptGuidance({
      surface: promptSurface,
    });
    const openClawReferences = await resolveOpenClawReferencePaths({
      workspaceDir: effectiveWorkspace,
      argv1: process.argv[1],
      cwd: effectiveCwd,
      moduleUrl: import.meta.url,
    });
    const promptContributionContext = {
      config: params.config,
      agentDir,
      workspaceDir: effectiveWorkspace,
      provider,
      modelId,
      promptMode,
      runtimeChannel,
      runtimeCapabilities,
      agentId: sessionAgentId,
    };
    const promptContribution =
      runtimePlan.prompt.resolveSystemPromptContribution(promptContributionContext);
    const buildSystemPromptText = (defaultThinkLevel) => {
      const builtSystemPrompt = buildEmbeddedSystemPrompt({
        config: params.config,
        agentId: sessionAgentId,
        workspaceDir: effectiveWorkspace,
        defaultThinkLevel,
        reasoningLevel: params.reasoningLevel ?? "off",
        extraSystemPrompt: params.extraSystemPrompt,
        ownerNumbers: params.ownerNumbers,
        reasoningTagHint,
        heartbeatPrompt: resolveHeartbeatPromptForSystemPrompt({
          config: params.config,
          agentId: sessionAgentId,
          defaultAgentId,
        }),
        skillsPrompt,
        docsPath: openClawReferences.docsPath ?? void 0,
        sourcePath: openClawReferences.sourcePath ?? void 0,
        promptMode,
        promptSurface,
        sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
        acpEnabled: isAcpRuntimeSpawnAvailable({
          config: params.config,
          sandboxed: sandboxInfo?.enabled === true,
        }),
        runtimeInfo,
        reactionGuidance,
        messageToolHints,
        sandboxInfo,
        tools: effectiveTools,
        userTimezone,
        userTime,
        userTimeFormat,
        contextFiles,
        promptContribution,
        nativeCommandGuidanceLines,
      });
      return transformProviderSystemPrompt({
        provider,
        config: params.config,
        workspaceDir: effectiveWorkspace,
        context: {
          config: params.config,
          agentDir,
          workspaceDir: effectiveWorkspace,
          provider,
          modelId,
          promptMode,
          runtimeChannel,
          runtimeCapabilities,
          agentId: sessionAgentId,
          systemPrompt: builtSystemPrompt,
        },
      });
    };
    const compactionTimeoutMs = resolveCompactionTimeoutMs(params.config);
    const sessionLock = await acquireSessionWriteLock({
      sessionFile: params.sessionFile,
      ...resolveSessionWriteLockOptions(params.config, {
        maxHoldMsFallback: resolveSessionLockMaxHoldFromTimeout({ timeoutMs: compactionTimeoutMs }),
      }),
    });
    try {
      if (!isSqliteSessionTranscript) {
        await repairSessionFileIfNeeded({
          sessionFile: params.sessionFile,
          debug: (message) => log.debug(message),
          warn: (message) => log.warn(message),
        });
        await prewarmSessionFile(params.sessionFile);
      }
      const transcriptPolicy = runtimePlan.transcript.resolvePolicy(runtimePlanModelContext);
      const sessionManager = guardSessionManager(SessionManager.open(params.sessionFile), {
        agentId: sessionAgentId,
        sessionKey: params.sessionKey,
        config: params.config,
        contextWindowTokens: contextTokenBudget,
        allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
        missingToolResultText:
          effectiveModel.api === "openai-responses" ||
          effectiveModel.api === "azure-openai-responses" ||
          effectiveModel.api === "openai-chatgpt-responses"
            ? "aborted"
            : void 0,
        allowedToolNames,
      });
      checkpointSnapshot = await compactionCheckpointStore.captureSnapshot({
        sessionManager,
        sessionFile: params.sessionFile,
      });
      compactionSessionManager = sessionManager;
      trackSessionManagerAccess(params.sessionFile);
      const settingsManager = createPreparedEmbeddedAgentSettingsManager({
        cwd: effectiveCwd,
        agentDir,
        cfg: params.config,
        pluginMetadataSnapshot: getCurrentPluginMetadataSnapshot({
          config: params.config,
          env: process.env,
          workspaceDir: effectiveWorkspace,
        }),
        contextTokenBudget,
      });
      const resourceLoader = createEmbeddedAgentResourceLoader({
        cwd: effectiveCwd,
        agentDir,
        settingsManager,
        extensionFactories: buildEmbeddedExtensionFactories({
          cfg: params.config,
          sessionManager,
          provider,
          modelId,
          model: effectiveModel,
        }),
      });
      await resourceLoader.reload();
      applyAgentCompactionSettingsFromConfig({
        settingsManager,
        cfg: params.config,
        contextTokenBudget,
      });
      applyAgentAutoCompactionGuard({
        settingsManager,
        silentOverflowProneProvider: isSilentOverflowProneModel({
          provider,
          modelId,
          baseUrl: effectiveModel.baseUrl ?? void 0,
        }),
      });
      const { customTools } = splitSdkTools({
        tools: effectiveTools,
        sandboxEnabled: Boolean(sandbox?.enabled),
        toolHookContext: {
          agentId: sessionAgentId,
          config: params.config,
          cwd: effectiveCwd,
          sessionKey: sandboxSessionKey,
          sessionId: params.sessionId,
          runId: params.runId,
          channelId: params.currentChannelId,
        },
      });
      const sessionToolAllowlist = toSessionToolAllowlist(collectRegisteredToolNames(customTools));
      const providerStreamFn = resolveCompactionProviderStream({
        effectiveModel,
        config: params.config,
        agentDir,
        effectiveWorkspace,
      });
      while (true) {
        attemptedThinking.add(thinkLevel);
        const systemPromptText = buildSystemPromptText(thinkLevel);
        let session;
        try {
          session = (
            await createAgentSession({
              cwd: effectiveCwd,
              agentDir,
              authStorage,
              modelRegistry,
              model: effectiveModel,
              thinkingLevel: mapThinkingLevel(thinkLevel),
              tools: sessionToolAllowlist,
              customTools,
              sessionManager,
              settingsManager,
              resourceLoader,
            })
          ).session;
          session.setActiveToolsByName(sessionToolAllowlist);
          applySystemPromptToSession(session, systemPromptText);
          await prepareCompactionSessionAgent({
            session,
            providerStreamFn,
            sessionId: params.sessionId,
            signal: runAbortController.signal,
            effectiveModel,
            resolvedApiKey: hasRuntimeAuthExchange ? void 0 : apiKeyInfo?.apiKey,
            authStorage,
            config: params.config,
            provider,
            modelId,
            thinkLevel,
            sessionAgentId,
            effectiveWorkspace,
            agentDir,
            runtimePlan,
            sessionKey: sandboxSessionKey,
            sandboxToolPolicy: sandbox?.tools,
            messageProvider: resolvedMessageProvider,
            agentAccountId: params.agentAccountId,
            groupId: params.groupId,
            groupChannel: params.groupChannel,
            groupSpace: params.groupSpace,
            spawnedBy: params.spawnedBy,
            senderId: params.senderId,
            senderName: params.senderName,
            senderUsername: params.senderUsername,
            senderE164: params.senderE164,
          });
          session.agent.streamFn = wrapStreamFnWithDiagnosticModelCallEvents(
            session.agent.streamFn,
            {
              runId: diagnosticCompactionRunId,
              ...(params.sessionKey && { sessionKey: params.sessionKey }),
              sessionId: params.sessionId,
              provider,
              model: modelId,
              api: effectiveModel.api,
              transport: session.agent.transport,
              contextTokenBudget,
              trace: compactionModelCallTrace,
              contentCapture: resolveDiagnosticModelContentCapturePolicy(params.config),
              nextCallId: () =>
                `${diagnosticCompactionRunId}:model:${(diagnosticModelCallSeq += 1)}`,
            },
          );
          const dedupedValidated = dedupeDuplicateUserMessagesForCompaction(
            await validateReplayTurns({
              messages: await sanitizeSessionHistory({
                messages: session.messages,
                modelApi: effectiveModel.api,
                modelId,
                provider,
                allowedToolNames,
                config: params.config,
                workspaceDir: effectiveWorkspace,
                env: process.env,
                model: effectiveModel,
                sessionManager,
                sessionId: params.sessionId,
                policy: transcriptPolicy,
                preserveLatestAssistantThinking: false,
              }),
              modelApi: effectiveModel.api,
              modelId,
              provider,
              config: params.config,
              workspaceDir: effectiveWorkspace,
              env: process.env,
              model: effectiveModel,
              sessionId: params.sessionId,
              policy: transcriptPolicy,
            }),
          );
          session.agent.state.messages = dedupedValidated;
          const originalMessages = session.messages.slice();
          const truncated = limitHistoryTurns(
            session.messages,
            getHistoryLimitFromSessionKey(params.sessionKey, params.config),
          );
          const limited = transcriptPolicy.repairToolUseResultPairing
            ? sanitizeToolUseResultPairing(truncated, {
                erroredAssistantResultPolicy: "drop",
                ...(effectiveModel.api === "openai-responses" ||
                effectiveModel.api === "azure-openai-responses" ||
                effectiveModel.api === "openai-chatgpt-responses"
                  ? { missingToolResultText: "aborted" }
                  : {}),
              })
            : truncated;
          if (limited.length > 0) session.agent.state.messages = limited;
          const hookRunner = asCompactionHookRunner(getGlobalHookRunner());
          const observedTokenCount = normalizeObservedTokenCount(params.currentTokenCount);
          const beforeHookMetrics = buildBeforeCompactionHookMetrics({
            originalMessages,
            currentMessages: session.messages,
            observedTokenCount,
            estimateTokensFn: estimateTokens,
          });
          const { hookSessionKey, missingSessionKey } = await runBeforeCompactionHooks({
            hookRunner,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            sessionAgentId,
            workspaceDir: effectiveWorkspace,
            messageProvider: resolvedMessageProvider,
            metrics: beforeHookMetrics,
            onHookMessages: params.onCompactionHookMessages,
          });
          const { messageCountOriginal } = beforeHookMetrics;
          const diagEnabled = log.isEnabled("debug");
          const preMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
          if (diagEnabled && preMetrics) {
            log.debug(
              `[compaction-diag] start runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} pre.messages=${preMetrics.messages} pre.historyTextChars=${preMetrics.historyTextChars} pre.toolResultChars=${preMetrics.toolResultChars} pre.estTokens=${preMetrics.estTokens ?? "unknown"}`,
            );
            log.debug(
              `[compaction-diag] contributors diagId=${diagId} top=${JSON.stringify(preMetrics.contributors)}`,
            );
          }
          if (!containsRealConversationMessages(session.messages)) {
            log.info(
              `[compaction] skipping — no real conversation messages (sessionKey=${params.sessionKey ?? params.sessionId})`,
            );
            return {
              ok: true,
              compacted: false,
              reason: "no real conversation messages",
            };
          }
          const compactStartedAt = Date.now();
          const messageCountCompactionInput = messageCountOriginal;
          let fullSessionTokensBefore = 0;
          try {
            fullSessionTokensBefore = limited.reduce((sum, msg) => sum + estimateTokens(msg), 0);
          } catch {}
          const activeSession = session;
          const result = await compactWithSafetyTimeout(
            () => {
              setCompactionSafeguardCancelReason(compactionSessionManager, void 0);
              return activeSession.compact(params.customInstructions);
            },
            compactionTimeoutMs,
            {
              abortSignal: params.abortSignal,
              onCancel: () => {
                activeSession.abortCompaction();
              },
            },
          );
          let effectiveFirstKeptEntryId = result.firstKeptEntryId;
          let postCompactionLeafId =
            typeof sessionManager.getLeafId === "function"
              ? (sessionManager.getLeafId() ?? void 0)
              : void 0;
          let transcriptRotationSessionManager = sessionManager;
          if (params.trigger === "manual" && !isSqliteSessionTranscript)
            try {
              const hardenedBoundary = await hardenManualCompactionBoundary({
                sessionFile: params.sessionFile,
                preserveRecentTail:
                  typeof params.config?.agents?.defaults?.compaction?.keepRecentTokens === "number",
              });
              if (hardenedBoundary.applied) {
                effectiveFirstKeptEntryId =
                  hardenedBoundary.firstKeptEntryId ?? effectiveFirstKeptEntryId;
                postCompactionLeafId = hardenedBoundary.leafId ?? postCompactionLeafId;
                session.agent.state.messages = hardenedBoundary.messages;
                transcriptRotationSessionManager = await readTranscriptFileState(
                  params.sessionFile,
                );
              }
            } catch (err) {
              log.warn("[compaction] failed to harden manual compaction boundary", {
                errorMessage: formatErrorMessage(err),
              });
            }
          const tokensAfter = estimateTokensAfterCompaction({
            messagesAfter: session.messages,
            observedTokenCount,
            fullSessionTokensBefore,
            estimateTokensFn: estimateTokens,
          });
          const messageCountAfter = session.messages.length;
          const compactedCount = Math.max(0, messageCountCompactionInput - messageCountAfter);
          let transcriptRotation = { rotated: false };
          if (shouldRotateCompactionTranscript(params.config) && !isSqliteSessionTranscript)
            try {
              transcriptRotation = await rotateTranscriptAfterCompaction({
                sessionManager: transcriptRotationSessionManager,
                sessionFile: params.sessionFile,
              });
            } catch (err) {
              log.warn("[compaction] post-compaction transcript rotation failed", {
                errorMessage: formatErrorMessage(err),
                errorStack: err instanceof Error ? err.stack : void 0,
              });
            }
          const activeSessionId = transcriptRotation.sessionId ?? params.sessionId;
          const activeSessionFile = transcriptRotation.sessionFile ?? params.sessionFile;
          const activePostLeafId = transcriptRotation.leafId ?? postCompactionLeafId;
          if (transcriptRotation.rotated)
            log.info(
              `[compaction] rotated active transcript after compaction (sessionKey=${params.sessionKey ?? params.sessionId})`,
            );
          await runPostCompactionSideEffects({
            config: params.config,
            sessionKey: params.sessionKey,
            sessionId: activeSessionId,
            agentId: sessionAgentId,
            sessionFile: activeSessionFile,
          });
          if (params.config && params.sessionKey && checkpointSnapshot)
            try {
              const checkpointPosition = resolveCompactionCheckpointTranscriptPosition({
                preferredLeafId: activePostLeafId,
                transcriptState: await readSessionLeafStateFromTranscriptAsync(activeSessionFile),
              });
              checkpointSnapshotRetained =
                (await compactionCheckpointStore.persistCheckpoint({
                  cfg: params.config,
                  sessionKey: params.sessionKey,
                  sessionId: activeSessionId,
                  reason: resolveSessionCompactionCheckpointReason({ trigger: params.trigger }),
                  snapshot: checkpointSnapshot,
                  summary: result.summary,
                  firstKeptEntryId: effectiveFirstKeptEntryId,
                  tokensBefore: observedTokenCount ?? result.tokensBefore,
                  tokensAfter,
                  postSessionFile: activeSessionFile,
                  postLeafId: checkpointPosition.leafId,
                  postEntryId: checkpointPosition.entryId,
                  createdAt: compactStartedAt,
                })) !== null;
            } catch (err) {
              log.warn("failed to persist compaction checkpoint", {
                errorMessage: formatErrorMessage(err),
              });
            }
          const postMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
          if (diagEnabled && preMetrics && postMetrics)
            log.debug(
              `[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=compacted reason=none durationMs=${Date.now() - compactStartedAt} retrying=false post.messages=${postMetrics.messages} post.historyTextChars=${postMetrics.historyTextChars} post.toolResultChars=${postMetrics.toolResultChars} post.estTokens=${postMetrics.estTokens ?? "unknown"} delta.messages=${postMetrics.messages - preMetrics.messages} delta.historyTextChars=${postMetrics.historyTextChars - preMetrics.historyTextChars} delta.toolResultChars=${postMetrics.toolResultChars - preMetrics.toolResultChars} delta.estTokens=${typeof preMetrics.estTokens === "number" && typeof postMetrics.estTokens === "number" ? postMetrics.estTokens - preMetrics.estTokens : "unknown"}`,
            );
          await runAfterCompactionHooks({
            hookRunner,
            sessionId: activeSessionId,
            sessionAgentId,
            hookSessionKey,
            missingSessionKey,
            workspaceDir: effectiveWorkspace,
            messageProvider: resolvedMessageProvider,
            messageCountAfter,
            tokensAfter,
            compactedCount,
            sessionFile: activeSessionFile,
            ...(activeSessionId !== params.sessionId
              ? { previousSessionId: params.sessionId }
              : {}),
            summaryLength: typeof result.summary === "string" ? result.summary.length : void 0,
            tokensBefore: result.tokensBefore,
            firstKeptEntryId: effectiveFirstKeptEntryId,
            onHookMessages: params.onCompactionHookMessages,
          });
          return {
            ok: true,
            compacted: true,
            result: {
              summary: result.summary,
              firstKeptEntryId: effectiveFirstKeptEntryId,
              tokensBefore: observedTokenCount ?? result.tokensBefore,
              tokensAfter,
              details: result.details,
              sessionId: transcriptRotation.sessionId,
              sessionFile: transcriptRotation.sessionFile,
            },
          };
        } catch (err) {
          const fallbackThinking = pickFallbackThinkingLevel({
            message: formatErrorMessage(err),
            attempted: attemptedThinking,
          });
          if (fallbackThinking) {
            log.warn(
              `[compaction] request rejected for ${provider}/${modelId}; retrying with ${fallbackThinking}`,
            );
            thinkLevel = fallbackThinking;
            continue;
          }
          throw err;
        } finally {
          try {
            await flushPendingToolResultsAfterIdle({
              agent: session?.agent,
              sessionManager,
            });
          } catch {}
          try {
            session?.dispose();
          } catch {}
        }
      }
    } finally {
      try {
        await bundleMcpRuntime?.dispose();
      } catch {}
      try {
        await bundleLspRuntime?.dispose();
      } catch {}
      await sessionLock.release();
    }
  } catch (err) {
    return fail(
      resolveCompactionFailureReason({
        reason: formatErrorMessage(err),
        safeguardCancelReason: consumeCompactionSafeguardCancelReason(compactionSessionManager),
      }),
      err,
    );
  } finally {
    if (!checkpointSnapshotRetained)
      await compactionCheckpointStore.cleanupSnapshot(checkpointSnapshot);
    restoreSkillEnv?.();
  }
}
const testing = {
  hasRealConversationContent,
  hasMeaningfulConversationContent,
  containsRealConversationMessages,
  estimateTokensAfterCompaction,
  buildBeforeCompactionHookMetrics,
  hardenManualCompactionBoundary,
  resolveCompactionProviderStream,
  prepareCompactionSessionAgent,
  runBeforeCompactionHooks,
  runAfterCompactionHooks,
  runPostCompactionSideEffects,
};
//#endregion
export { compactEmbeddedAgentSessionDirect, testing };
