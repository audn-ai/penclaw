import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import {
  c as retireSessionMcpRuntimeForSessionKey,
  s as retireSessionMcpRuntime,
} from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import {
  d as waitForDeferredTurnMaintenanceForSession,
  f as buildContextEngineRuntimeSettings,
  u as runContextEngineMaintenance,
} from "./agent-end-side-effects-PAHWJAYi.js";
import {
  T as withAgentRunLifecycleGeneration,
  b as registerAgentRunContext,
  f as getAgentEventLifecycleGeneration,
  n as captureAgentRunLifecycleGeneration,
  p as getAgentRunContext,
  r as claimAgentRunContext,
  t as assertAgentRunLifecycleGenerationCurrent,
  u as emitAgentItemEvent,
} from "./agent-events-D4UsOPeT.js";
import { n as createAgentHarnessTaskRuntimeScope } from "./agent-harness-task-runtime-scope-Cblo_5BC.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-C_WnQaQy.js";
import "./utils-DtcDeqWS.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  r as hasConfiguredModelFallbacks,
  y as resolveSessionAgentIds,
} from "./agent-scope-y9xQv_q1.js";
import { n as resolveProcessToolScopeKey } from "./agent-tools-CQdhKaa9.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import {
  _ as resolveContextEngineCapabilities,
  f as buildEmbeddedCompactionRuntimeContext,
  g as listActiveProcessSessionReferences,
  m as resolveEmbeddedCompactionTarget,
  p as resolveCompactionHarnessRuntime,
  r as forgetPromptBuildDrainCacheForRun,
} from "./attempt.prompt-helpers-CztYiE1m.js";
import { r as runAgentCleanupStep } from "./attempt.tool-run-context-DzOtUuEC.js";
import { r as buildAgentRuntimePlan } from "./build-DkA06gaM.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import {
  o as getCommandLaneSnapshot,
  r as enqueueCommandInLane,
} from "./command-queue-CVn1dJsm.js";
import { t as DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON } from "./compact-reasons-DBEvigt9.js";
import {
  n as isRecoverableNativeHarnessBindingFailure,
  t as maybeCompactAgentHarnessSession,
} from "./compaction-CYj78YER.js";
import {
  c as createFileBackedCompactionCheckpointStore,
  d as readSessionLeafStateFromTranscriptAsync,
  f as resolveCompactionCheckpointTranscriptPosition,
  o as runPostCompactionSideEffects,
  p as resolveSessionCompactionCheckpointReason,
  s as buildCompactionHarnessModelProvider,
  t as asCompactionHookRunner,
} from "./compaction-hooks-C1YwjfxH.js";
import { t as sanitizeForConsole } from "./console-sanitize-NjY4pEOW.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-ZYc39F9v.js";
import "./config-BDv-QbJ6.js";
import {
  a as resolveReusableRuntimeModelAuth,
  i as resolveCredentialScopedAuthAttemptModelDecision,
  n as hasPreparedAuthAttemptModelMetadata,
  r as providerUsesCredentialScopedModelMetadata,
  s as materializePreparedRuntimeModel,
  t as createPreparedRuntimeModelMaterializer,
} from "./credential-scoped-model-lT7pctV8.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import {
  d as hasOutboundDeliveryEvidence,
  u as hasMessagingToolDeliveryEvidence,
} from "./delivery-evidence-oVjLoAkq.js";
import {
  j as resolveCompactionTimeoutMs,
  k as compactContextEngineWithSafetyTimeout,
} from "./diagnostic-DE-wbBb7.js";
import { T as freezeDiagnosticTraceContext } from "./diagnostic-events-5-gsFhkM.js";
import { r as pickFallbackThinkingLevel } from "./embedded-agent-helpers-DH71Di6x.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  E as parseImageSizeError,
  T as parseImageDimensionError,
  _ as isFailoverAssistantError,
  b as isLikelyContextOverflowError,
  c as extractObservedOverflowTokenCount,
  f as isAuthAssistantError,
  h as isCompactionFailureError,
  i as classifyFailoverReason,
  l as formatAssistantErrorText,
  p as isBillingAssistantError,
  r as classifyAssistantFailoverReason,
  v as isFailoverErrorMessage,
  x as isRateLimitAssistantError,
  y as isGenericUnknownStreamErrorMessage,
} from "./errors-BwoE4095.js";
import {
  a as fingerprintResolvedAuthProfileCredential,
  i as fingerprintOpaqueRuntimeOwner,
  n as fingerprintAuthProfileOwnerShape,
  o as fingerprintResolvedProviderAuth,
  r as fingerprintAwsSdkRuntimeOwner,
} from "./execution-auth-binding-CmucNoqo.js";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-YdmPOjw-.js";
import "./auth-profiles-CX7JDmZ9.js";
import {
  a as describeFailoverError,
  f as resolveFailoverStatus,
  i as coerceToFailoverError,
  t as FailoverError,
} from "./failover-error-CYvhrluQ.js";
import {
  n as formatFastModeAutoProgressText,
  u as resolveFastModeForElapsed,
} from "./fast-mode-BhVbWk_p.js";
import {
  _ as resolveRateLimitProfileRotationLimit,
  a as buildUsageAgentMetaFields,
  b as createUsageAccumulator,
  c as resolveActiveErrorContext,
  d as resolveFinalAssistantVisibleText,
  f as resolveLatestCallUsage,
  g as resolveOverloadProfileRotationLimit,
  h as resolveOverloadFailoverBackoffMs,
  i as buildErrorAgentMeta,
  l as resolveEmbeddedAttemptBasePrompt,
  m as resolveNextSameModelRateLimitRetryCount,
  n as RUNTIME_AUTH_REFRESH_MIN_DELAY_MS,
  o as createCompactionDiagId,
  p as resolveMaxRunRetryIterations,
  r as RUNTIME_AUTH_REFRESH_RETRY_MS,
  s as isAssistantForModelRef,
  t as RUNTIME_AUTH_REFRESH_MARGIN_MS,
  u as resolveFinalAssistantRawText,
  v as resolveReportedModelRef,
  x as mergeUsageIntoAccumulator,
  y as resolveSameModelRateLimitRetryDelayMs,
} from "./helpers-BcP5pARq.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-BL_Cd-K4.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-BibWlia2.js";
import { t as ensureContextEnginesInitialized } from "./init-R35iJ-iC.js";
import { n as resolveGlobalLane, r as resolveSessionLane } from "./lanes-CVttd5qX.js";
import "./model-selection-DOlkTrQa.js";
import {
  n as shouldSwitchToLiveModel,
  t as clearLiveModelSwitchPending,
} from "./live-model-switch-Df5SQ2Af.js";
import { t as log$1 } from "./logger-C5RMMskO.js";
import { a as isMarkdownCapableMessageChannel } from "./message-channel-NQc9DJ6B.js";
import {
  n as applyLocalNoAuthHeaderOverride,
  o as getApiKeyForModel,
  t as applyAuthHeaderOverride,
} from "./model-auth-BWFdcEzF.js";
import { t as MissingProviderAuthError } from "./model-auth-runtime-shared-BVzqP6NP.js";
import { t as readAgentModelContextTokens } from "./model-context-tokens-C7jGfEZp.js";
import {
  f as shouldUseTransientCooldownProbeSlot,
  l as shouldSuppressRawErrorConsoleSuffix,
  s as buildApiErrorObservationFields,
  u as LiveSessionModelSwitchError,
} from "./model-fallback-CQfk1H6I.js";
import {
  i as buildModelAliasIndex,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-C_eCEq4B.js";
import { r as resolveModelAsync, t as createEmptyAgentDiscoveryStores } from "./model-uG6W-_2M.js";
import { r as ensureOpenClawModelsJson } from "./models-config-GFqrAsQr.js";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-CJQ8TR--.js";
import {
  L as isDefaultAgentRuntimeId,
  b as providerModelRouteAcceptsAuthMode,
  c as resolveContextConfigProviderForRuntime,
  d as resolveSelectedOpenAIRuntimeProvider,
  i as isOpenAIProvider,
  n as OPENAI_PROVIDER_ID,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import { S as hasOnlyAssistantReasoningContent } from "./openai-transport-stream-BFFr80cz.js";
import { f as isStrictAgenticExecutionContractActive } from "./openclaw-tools-DGecpaCF.js";
import "./sessions-CEG7v41b.js";
import "./backoff-Z63_cX9p.js";
import "./fast-mode-C6dQXWoG.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { t as buildEmbeddedRunPayloads } from "./payloads-Dc-EZj7M.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import {
  n as canRunPreparedAgentRuntimeAuthAttempt,
  r as prepareAgentRuntimeAuth,
} from "./prepare-auth-CUDA42wQ.js";
import { r as resolveSubscriptionAuthModeForProfiles } from "./profile-list-I4BheGlK.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { n as markAuthProfileSuccess } from "./profiles-DxTOoenK.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-DwukEoyu.js";
import { a as resolveProviderAuthProfileId } from "./provider-hook-runtime-UWRY5bYu.js";
import {
  f as unwrapSecretSentinelsForProviderEgress,
  l as protectPreparedProviderRuntimeAuth,
} from "./provider-local-service-DLgcYp6u.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DpW-uV6A.js";
import { b as prepareProviderRuntimeAuth } from "./provider-runtime-DyIHJ2cX.js";
import { t as redactIdentifier } from "./redact-identifier-CRU-WC7p.js";
import {
  o as resolveContextEngine,
  s as resolveContextEngineOwnerPluginId,
} from "./registry-DXbEDAsr.js";
import {
  a as getReplyPayloadMetadata,
  i as copyReplyPayloadMetadata,
  t as FAST_MODE_AUTO_PROGRESS_KIND,
} from "./reply-payload-BK_jICQ3.js";
import {
  n as resolveAgentRunSessionTarget,
  t as applyAgentRunSessionTargetIdentity,
} from "./run-session-target-B5hjrVU1.js";
import {
  c as resolveAgentRunAbortLifecycleFields,
  r as createAgentRunDirectAbortError,
  s as isAgentRunRestartAbortReason,
} from "./run-termination-BEbihwT8.js";
import {
  T as setActiveEmbeddedRun,
  b as resolveActiveEmbeddedRunHandleSessionId,
  f as isEmbeddedAgentRunHandleActive,
  r as clearActiveEmbeddedRun,
  x as resolveActiveEmbeddedRunHandleSessionIdBySessionFile,
} from "./runs-GL_-RIwi.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-qskRkoSz.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-CwbL9nR9.js";
import { i as getRuntimeConfigSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import {
  n as formatBillingErrorMessage,
  x as isTimeoutErrorMessage,
} from "./sanitize-user-facing-text-B_JqK9fo.js";
import {
  B as resolveReplayInvalidFlag,
  F as hasAttemptTerminalState,
  G as shouldTreatEmptyAssistantReplyAsSilent,
  H as resolveSilentToolResultReplyPayload,
  I as resolveAttemptReplayMetadata,
  K as createTrajectoryRuntimeRecorder,
  L as resolveEmptyResponseRetryInstruction,
  M as rotateTranscriptFileAfterCompaction,
  N as shouldRotateCompactionTranscript,
  R as resolveIncompleteTurnPayloadText,
  U as shouldRetryMissingAssistantTurn,
  V as resolveRunLivenessState,
  W as shouldRetrySilentErrorAssistantTurn,
  a as runAgentHarnessAttempt,
  d as formatEmbeddedRunStageSummary,
  et as createEmbeddedRunReplayState,
  f as shouldWarnEmbeddedRunStageSummary,
  l as EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE,
  o as selectAgentHarness,
  s as selectAgentHarnessForPreparedModelProviders,
  t as agentHarnessBuildsOpenClawTools,
  tt as observeReplayMetadata,
  u as createEmbeddedRunStageTracker,
  z as resolveReasoningOnlyRetryInstruction,
} from "./selection-B2JBt0RT.js";
import { a as resolveSecretSentinel, r as looksLikeSecretSentinel } from "./sentinel-Ccb6pnS1.js";
import {
  Ht as normalizeUsage,
  Lt as deriveContextPromptTokens,
  S as loadSessionEntry,
  Z as resolveSessionTranscriptRuntimeReadTarget,
  at as updateSessionEntry,
} from "./session-accessor-PZVNxFCV.js";
import {
  a as resolveStoredSessionKeyForSessionId,
  i as resolveSessionKeyForRequest,
} from "./session-CABQ2dYG.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { t as SessionManager } from "./session-manager-BD4l9VJc.js";
import { a as withSessionPlacementTurnAdmission } from "./session-placement-admission-C_WzNYGC.js";
import {
  a as resolveSessionSuspensionTarget,
  i as resolveSessionSuspensionReason,
  s as suspendSession,
} from "./session-suspension-BASgM8K9.js";
import { jt as classifyRateLimitWindow } from "./sessions-Duh5damM.js";
import {
  a as resolveHookModelSelection,
  i as resolveEmbeddedRuntimeModelPolicy,
  n as createNativeModelOwnedRuntimeModel,
  o as resolveNativeModelOwnedHarnessId,
  r as resolveAgentHarnessRunAdmissionError,
  t as buildBeforeModelResolveAttachments,
} from "./setup-B0vTrkmK.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { s as sleepWithAbort } from "./src-Dqmh2693.js";
import {
  i as ensureAuthProfileStore,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
} from "./store-B7DoDdVM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  n as resolveCandidateThinkingLevel,
  o as resolveAgentHarnessPreparedAuthSupport,
  s as resolveAgentHarnessPreparedRouteSupport,
} from "./thinking-runtime-D675lyzz.js";
import { t as DEFAULT_AGENT_TIMEOUT_MS } from "./timeout-CjPlNzdm.js";
import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DKI4eGAu.js";
import { n as isExecLikeToolName } from "./tool-error-summary-DDV0ZoKC.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-vc04OURE.js";
import {
  c as truncateOversizedToolResultsInActiveTarget,
  o as resolveLiveToolResultMaxChars,
  s as sessionLikelyHasOversizedToolResults,
} from "./tool-result-truncation-B3T_nFx6.js";
import { r as resolveCompactionSuccessorTranscript } from "./types-DM3O0Um7.js";
import {
  a as markAuthProfileFailure,
  s as resolveProfilesUnavailableReason,
} from "./usage-BZgGbRoq.js";
import { o as isProfileInCooldown } from "./usage-state-BQLO_Yob.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  n as mapThinkingLevelForProvider,
  r as normalizeContextTokenBudget,
} from "./utils-CefVZRZM.js";
import { n as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-jS7A43R-.js";
//#region src/agents/embedded-agent-runner/compact.queued.ts
/**
 * Queues embedded-agent session compaction onto the correct command lane.
 */
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
function shouldFallbackAfterHarnessCompaction(result) {
  return isRecoverableNativeHarnessBindingFailure(result);
}
function lockedCompactionRuntimeFailure(runtime) {
  return {
    ok: false,
    compacted: false,
    reason: runtime
      ? `Model selection is locked to native agent harness "${runtime}", but native compaction is unavailable.`
      : "Model selection is locked but the persisted agent harness is unavailable.",
    failure: { reason: "model_selection_locked" },
  };
}
const DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON =
  "failed to schedule background context-engine maintenance";
const MANUAL_COMPACTION_ACTIVE_RUN_REASON =
  "manual compaction unavailable while another embedded run is active";
const COMPACTION_ABORTED_REASON = "compaction aborted";
function createCompactionAbortedResult() {
  return {
    ok: false,
    compacted: false,
    reason: COMPACTION_ABORTED_REASON,
  };
}
function resolveManualCompactionActiveRunSessionId(params) {
  return (
    (isEmbeddedAgentRunHandleActive(params.sessionId) ? params.sessionId : void 0) ??
    (params.sessionKey ? resolveActiveEmbeddedRunHandleSessionId(params.sessionKey) : void 0) ??
    resolveActiveEmbeddedRunHandleSessionIdBySessionFile(params.sessionFile)
  );
}
function shouldDeferOwningContextEngineBudgetCompaction(params) {
  return (
    params.compactParams.deferOwningContextEngineCompaction === true &&
    params.compactParams.trigger === "budget" &&
    params.contextEngine.info.ownsCompaction === true &&
    params.contextEngine.info.turnMaintenanceMode === "background" &&
    typeof params.contextEngine.maintain === "function"
  );
}
function buildContextEngineCompactionSessionTarget$1(params) {
  const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
  const agentId = params.sessionTarget?.agentId ?? params.agentId ?? sqliteMarker?.agentId;
  const sessionKey = params.sessionTarget?.sessionKey ?? params.sessionKey ?? params.sessionId;
  const storePath = params.sessionTarget?.storePath ?? sqliteMarker?.storePath;
  return {
    ...(agentId ? { agentId } : {}),
    sessionId: params.sessionTarget?.sessionId ?? sqliteMarker?.sessionId ?? params.sessionId,
    ...(sessionKey ? { sessionKey } : {}),
    ...(storePath ? { storePath } : {}),
    ...(params.sessionTarget?.threadId !== void 0
      ? { threadId: params.sessionTarget.threadId }
      : {}),
  };
}
async function disposeContextEngine(contextEngine) {
  try {
    await contextEngine.dispose?.();
  } catch (err) {
    log$1.warn("context engine dispose failed", { errorMessage: formatErrorMessage(err) });
  }
}
async function deferOwningContextEngineBudgetCompaction(params) {
  let deferredScheduled = false;
  let deferredScheduleFailure;
  try {
    await runContextEngineMaintenance({
      contextEngine: params.contextEngine,
      sessionId: params.compactParams.sessionId,
      sessionKey: params.compactParams.sessionKey,
      sessionTarget: buildContextEngineCompactionSessionTarget$1(params.compactParams),
      sessionFile: params.compactParams.sessionFile,
      reason: "turn",
      runtimeContext: params.contextEngineRuntimeContext,
      runtimeSettings: params.contextEngineRuntimeSettings,
      config: params.compactParams.config,
      disposeDeferredContextEngineAfterMaintenance: true,
      onDeferredMaintenance: () => {
        deferredScheduled = true;
      },
      onDeferredMaintenanceFailure: (error) => {
        deferredScheduleFailure = error;
      },
    });
  } catch (err) {
    log$1.warn("failed to defer context-engine budget compaction", {
      errorMessage: formatErrorMessage(err),
    });
  }
  if (!deferredScheduled || deferredScheduleFailure) {
    log$1.warn(
      `[compaction] failed to schedule context-engine-owned budget compaction background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId}${deferredScheduleFailure ? ` error=${formatErrorMessage(deferredScheduleFailure)}` : ""})`,
    );
    return {
      ok: false,
      compacted: false,
      reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON,
      failure: { reason: "deferred_compaction_not_scheduled" },
    };
  }
  log$1.info(
    `[compaction] deferred context-engine-owned budget compaction to background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId} scheduled=${String(deferredScheduled)})`,
  );
  return {
    ok: true,
    compacted: false,
    reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON,
  };
}
function mergeSecondaryNativeHarnessCompactionDetails(params) {
  if (!params.nativeResult) return params.details;
  if (params.details && typeof params.details === "object" && !Array.isArray(params.details))
    return {
      ...params.details,
      [params.detailsKey]: params.nativeResult,
    };
  if (params.details !== void 0)
    return {
      contextEngine: params.details,
      [params.detailsKey]: params.nativeResult,
    };
  return { [params.detailsKey]: params.nativeResult };
}
/**
 * Compacts a session with lane queueing (session lane + global lane).
 * Use this from outside a lane context. If already inside a lane, use
 * `compactEmbeddedAgentSessionDirect` to avoid deadlocks.
 */
async function compactEmbeddedAgentSession(params) {
  if (params.trigger !== "manual") return await compactEmbeddedAgentSessionImpl(params);
  if (resolveManualCompactionActiveRunSessionId(params))
    return {
      ok: false,
      compacted: false,
      reason: MANUAL_COMPACTION_ACTIVE_RUN_REASON,
      failure: { reason: "active_run" },
    };
  const controller = new AbortController();
  const abortSignal = params.abortSignal
    ? AbortSignal.any([params.abortSignal, controller.signal])
    : controller.signal;
  const handle = {
    kind: "embedded",
    queueMessage: async () => {},
    isStreaming: () => true,
    isCompacting: () => true,
    abort: (reason) => controller.abort(reason ?? "user_abort"),
    cancel: (reason) => controller.abort(reason ?? "user_abort"),
  };
  setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
  try {
    return await compactEmbeddedAgentSessionImpl({
      ...params,
      abortSignal,
    });
  } finally {
    clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
  }
}
async function compactEmbeddedAgentSessionImpl(params) {
  if (params.abortSignal?.aborted) return createCompactionAbortedResult();
  ensureRuntimePluginsLoaded({
    config: params.config,
    workspaceDir: params.workspaceDir,
    allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
  });
  ensureContextEnginesInitialized();
  const agentIds = resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.config,
    agentId: params.agentId,
  });
  const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId);
  const resolvedWorkspaceDir = resolveUserPath(params.workspaceDir);
  const contextEngine = await resolveContextEngine(params.config, {
    agentDir,
    workspaceDir: resolvedWorkspaceDir,
  });
  let disposeContextEngineOnExit = true;
  try {
    return await compactResolvedContextEngine(
      params,
      contextEngine,
      agentDir,
      resolvedWorkspaceDir,
      () => {
        disposeContextEngineOnExit = false;
      },
    );
  } finally {
    if (disposeContextEngineOnExit) await disposeContextEngine(contextEngine);
  }
}
async function compactResolvedContextEngine(
  params,
  contextEngine,
  agentDir,
  resolvedWorkspaceDir,
  releaseContextEngineOwnership,
) {
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
  const lockedHarnessRuntime =
    params.modelSelectionLocked === true
      ? normalizeOptionalAgentRuntimeId(params.agentHarnessId)
      : void 0;
  if (
    params.modelSelectionLocked === true &&
    (!lockedHarnessRuntime || lockedHarnessRuntime === "auto")
  )
    return lockedCompactionRuntimeFailure();
  const selectedHarnessRuntime =
    params.modelSelectionLocked === true
      ? lockedHarnessRuntime
      : resolveCompactionHarnessRuntime({
          boundHarnessRuntime: params.agentHarnessId,
          preparedRuntimePlan: params.runtimePlan,
          configuredHarnessRuntime,
          provider: policyProvider,
          modelId: policyModelId,
        });
  const lockedNativeHarness =
    params.modelSelectionLocked === true && selectedHarnessRuntime !== "openclaw";
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
  const ceProvider = resolvedCompactionTarget.provider ?? "openai";
  const ceRuntimeProvider = resolvedCompactionTarget.runtimeProvider ?? ceProvider;
  const ceContextConfigProvider = resolvedCompactionTarget.contextProvider ?? ceProvider;
  const ceModelId = resolvedCompactionTarget.model ?? "gpt-5.6-sol";
  const { plan: reusableRuntimeAuthPlan, modelAuth: initialModelAuth } =
    resolveReusableRuntimeModelAuth({
      plan: params.runtimeAuthPlan ?? params.runtimePlan?.auth,
      provider: ceProvider,
      modelId: ceModelId,
      authProfileId: resolvedCompactionTarget.authProfileId,
    });
  const attemptNativeHarnessCompaction = shouldAttemptNativeHarnessCompaction({
    provider: ceProvider,
    nativeHarnessCompaction: resolvedCompactionTarget.nativeHarnessCompaction,
    selectedHarnessRuntime,
  });
  let effectiveRuntimeModel;
  let preparedHarnessRuntime = selectedHarnessRuntime;
  let preparedParams = params;
  try {
    await ensureSelectedAgentHarnessPlugin({
      config: params.config,
      provider: ceProvider,
      modelId: ceModelId,
      agentId: runtimePolicyAgentId,
      sessionKey: runtimePolicySessionKey,
      agentHarnessId: params.agentHarnessId,
      agentHarnessRuntimeOverride: selectedHarnessRuntime,
      workspaceDir: resolvedWorkspaceDir,
    });
    const {
      model: ceModel,
      authStorage,
      modelRegistry,
    } = await resolveModelAsync(
      ceRuntimeProvider,
      ceModelId,
      agentDir,
      params.config,
      initialModelAuth,
    );
    const ceRuntimeModel = ceModel;
    const runtimeAuthProfileStore = isOpenAIProvider(ceProvider)
      ? ensureAuthProfileStore(agentDir, {
          externalCliProviderIds: ["openai"],
          allowKeychainPrompt: false,
        })
      : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
    const selectHarnessForPreparedAttempts = (attempts) =>
      selectAgentHarnessForPreparedModelProviders({
        provider: ceProvider,
        modelId: ceModelId,
        modelProviders: attempts.map((attempt) =>
          buildCompactionHarnessModelProvider({
            model: ceRuntimeModel,
            plan: attempt.plan,
            attempt,
          }),
        ),
        config: params.config,
        agentId: runtimePolicyAgentId,
        sessionKey: runtimePolicySessionKey,
        agentHarnessId: params.agentHarnessId,
        agentHarnessRuntimeOverride: selectedHarnessRuntime,
      });
    const initialHarness = reusableRuntimeAuthPlan
      ? void 0
      : selectAgentHarness({
          provider: ceProvider,
          modelId: ceModelId,
          modelProvider: buildCompactionHarnessModelProvider({ model: ceRuntimeModel }),
          config: params.config,
          agentId: runtimePolicyAgentId,
          sessionKey: runtimePolicySessionKey,
          agentHarnessId: params.agentHarnessId,
          agentHarnessRuntimeOverride: selectedHarnessRuntime,
        });
    const prepareRuntimeAuth = (harness) =>
      prepareAgentRuntimeAuth({
        provider: ceProvider,
        modelId: ceModelId,
        modelApi: ceRuntimeModel?.api,
        modelBaseUrl: ceRuntimeModel?.baseUrl,
        config: params.config,
        env: process.env,
        agentDir,
        workspaceDir: resolvedWorkspaceDir,
        authProfileStore: runtimeAuthProfileStore,
        sessionAuthProfileId: resolvedCompactionTarget.authProfileId,
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
          `Prepared queued compaction auth routes did not converge on one agent harness for ${ceProvider}/${ceModelId}.`,
        );
      selectedPreparedHarness = confirmedHarness;
    }
    preparedHarnessRuntime = selectedPreparedHarness.id;
    const runtimeAuthPlan = runtimeAuthPreparation.plan;
    const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
      provider: ceRuntimeProvider,
      modelId: ceModelId,
      config: params.config,
      agentDir,
      workspaceDir: resolvedWorkspaceDir,
    });
    effectiveRuntimeModel = await materializePreparedRuntimeModel({
      plan: runtimeAuthPlan,
      provider: ceProvider,
      modelId: ceModelId,
      config: params.config,
      model: ceRuntimeModel,
      forceResolve:
        providerUsesProfileScopedModelMetadata && Boolean(runtimeAuthPlan.selectedAuthMode),
      resolveModel: async ({ config, authProfileId, authProfileMode }) => {
        const resolved = await resolveModelAsync(ceRuntimeProvider, ceModelId, agentDir, config, {
          authStorage,
          modelRegistry,
          skipAgentDiscovery: true,
          allowBundledStaticCatalogFallback: true,
          preferBundledStaticCatalogTransport: true,
          workspaceDir: resolvedWorkspaceDir,
          authProfileId,
          authProfileMode,
        });
        return {
          ...resolved,
          model: resolved.model,
        };
      },
    });
    preparedParams = {
      ...params,
      provider: ceProvider,
      model: ceModelId,
      agentHarnessId: preparedHarnessRuntime,
      ...(reusableRuntimeAuthPlan
        ? {
            authProfileId: runtimeAuthPlan.forwardedAuthProfileId,
            authProfileIdSource: runtimeAuthPlan.forwardedAuthProfileSource,
            runtimeAuthPlan,
          }
        : {
            authProfileId: resolvedCompactionTarget.authProfileId,
            authProfileIdSource: resolvedCompactionTarget.authProfileId
              ? params.authProfileIdSource
              : void 0,
            runtimeAuthPlan: void 0,
            runtimePlan: void 0,
          }),
    };
  } catch (err) {
    await disposeContextEngine(contextEngine);
    releaseContextEngineOwnership();
    throw err;
  }
  const resolvedContextTokenBudget =
    normalizeContextTokenBudget(
      resolveContextWindowInfo({
        cfg: params.config,
        provider: ceContextConfigProvider,
        modelId: ceModelId,
        modelContextTokens: readAgentModelContextTokens(effectiveRuntimeModel),
        modelContextWindow: effectiveRuntimeModel?.contextWindow,
        defaultTokens: 2e5,
      }).tokens,
    ) ?? 2e5;
  const requestedContextTokenBudget = normalizeContextTokenBudget(params.contextTokenBudget);
  const contextTokenBudget = Math.min(
    requestedContextTokenBudget ?? resolvedContextTokenBudget,
    resolvedContextTokenBudget,
  );
  const contextEngineRuntimeContext = buildCompactionContextEngineRuntimeContext({
    params: preparedParams,
    agentDir,
    harnessRuntime: preparedHarnessRuntime,
    contextTokenBudget,
    contextEnginePluginId: resolveContextEngineOwnerPluginId(contextEngine),
  });
  const contextEngineRuntimeSettings = buildContextEngineRuntimeSettings({
    contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
    provider: ceProvider,
    requestedModel: params.model,
    resolvedModel: ceModelId,
    selectedContextEngineId: contextEngine.info.id,
    contextEngineSelectionSource: contextEngine.info.id === "legacy" ? "default" : "configured",
    promptTokenBudget: contextTokenBudget,
  });
  const contextEngineOwnsCompaction = contextEngine.info.ownsCompaction === true;
  const harnessResult =
    attemptNativeHarnessCompaction && (!contextEngineOwnsCompaction || lockedNativeHarness)
      ? await maybeCompactAgentHarnessSession({
          ...preparedParams,
          runtimeModel: effectiveRuntimeModel,
          contextEngine,
          contextTokenBudget,
          contextEngineRuntimeContext,
        })
      : void 0;
  if (lockedNativeHarness)
    return harnessResult ?? lockedCompactionRuntimeFailure(selectedHarnessRuntime);
  if (harnessResult) {
    if (!shouldFallbackAfterHarnessCompaction(harnessResult)) return harnessResult;
    log$1.warn(
      `native harness compaction could not use its session binding; falling back to context engine: ${harnessResult.reason ?? "unknown"}`,
    );
  }
  if (
    shouldDeferOwningContextEngineBudgetCompaction({
      compactParams: preparedParams,
      contextEngine,
    })
  ) {
    const deferredResult = await deferOwningContextEngineBudgetCompaction({
      compactParams: preparedParams,
      contextEngine,
      contextEngineRuntimeContext,
      contextEngineRuntimeSettings,
    });
    if (deferredResult.ok) releaseContextEngineOwnership();
    return deferredResult;
  }
  const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
  const globalLane = resolveGlobalLane(params.lane);
  const enqueueGlobal =
    params.enqueue ?? ((task, opts) => enqueueCommandInLane(globalLane, task, opts));
  return await enqueueCommandInLane(sessionLane, () =>
    enqueueGlobal(async () => {
      let checkpointSnapshot;
      let checkpointSnapshotRetained = false;
      try {
        if (params.abortSignal?.aborted) return createCompactionAbortedResult();
        const engineOwnsCompaction = contextEngine.info.ownsCompaction === true;
        const isSqliteSessionTranscript = Boolean(parseSqliteSessionFileMarker(params.sessionFile));
        checkpointSnapshot = engineOwnsCompaction
          ? await compactionCheckpointStore.captureSnapshot({
              sessionFile: params.sessionFile,
              ...(isSqliteSessionTranscript
                ? { sessionManager: SessionManager.open(params.sessionFile) }
                : {}),
            })
          : null;
        const hookRunner = engineOwnsCompaction
          ? asCompactionHookRunner(getGlobalHookRunner())
          : null;
        const hookSessionKey = params.sessionKey?.trim() || params.sessionId;
        const { sessionAgentId } = resolveSessionAgentIds({
          sessionKey: params.sessionKey,
          config: params.config,
          agentId: params.agentId,
        });
        const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
        const hookCtx = {
          sessionId: params.sessionId,
          agentId: sessionAgentId,
          sessionKey: hookSessionKey,
          workspaceDir: resolvedWorkspaceDir,
          messageProvider: resolvedMessageProvider,
        };
        const runtimeContext = contextEngineRuntimeContext;
        if (hookRunner?.hasHooks?.("before_compaction") && hookRunner.runBeforeCompaction)
          try {
            await hookRunner.runBeforeCompaction(
              {
                messageCount: -1,
                sessionFile: params.sessionFile,
              },
              hookCtx,
            );
          } catch (err) {
            log$1.warn("before_compaction hook failed", { errorMessage: formatErrorMessage(err) });
          }
        let result;
        try {
          const compactionSessionTarget = buildContextEngineCompactionSessionTarget$1(params);
          result = await compactContextEngineWithSafetyTimeout(
            contextEngine,
            {
              sessionId: params.sessionId,
              sessionKey: hookSessionKey,
              ...(compactionSessionTarget.agentId
                ? { agentId: compactionSessionTarget.agentId }
                : {}),
              sessionTarget: compactionSessionTarget,
              tokenBudget: contextTokenBudget,
              currentTokenCount: params.currentTokenCount,
              compactionTarget: params.trigger === "manual" ? "threshold" : "budget",
              customInstructions: params.customInstructions,
              force:
                params.force === true ||
                params.forcePreflight === true ||
                params.preflightRequired === true ||
                params.trigger === "manual",
              runtimeContext: {
                ...runtimeContext,
                forceReason:
                  params.forcePreflight === true || params.preflightRequired === true
                    ? "preflight_required"
                    : params.trigger === "manual"
                      ? "manual"
                      : void 0,
                preflightCompactionTrigger: params.preflightCompactionTrigger,
              },
              runtimeSettings: contextEngineRuntimeSettings,
            },
            resolveCompactionTimeoutMs(params.config),
            params.abortSignal,
          );
        } catch (compactErr) {
          log$1.warn("context-engine compaction failed", {
            errorMessage: formatErrorMessage(compactErr),
          });
          result = {
            ok: false,
            compacted: false,
            reason: formatErrorMessage(compactErr),
          };
        }
        const delegatedSuccessor = resolveCompactionSuccessorTranscript(result);
        const delegatedSessionTarget = result.result?.sessionTarget;
        const delegatedSessionId = delegatedSuccessor.sessionId;
        const delegatedSessionFile = delegatedSuccessor.sessionFile;
        const delegatedRotatedTranscript =
          (typeof delegatedSessionId === "string" && delegatedSessionId !== params.sessionId) ||
          (typeof delegatedSessionFile === "string" && delegatedSessionFile !== params.sessionFile);
        let postCompactionSessionId = delegatedSessionId ?? params.sessionId;
        let postCompactionSessionFile = delegatedSessionFile ?? params.sessionFile;
        if (delegatedSessionTarget) {
          const resolvedDelegatedTarget = await resolveAgentRunSessionTarget({
            agentId: delegatedSessionTarget.agentId ?? sessionAgentId,
            config: params.config,
            sessionId: delegatedSessionTarget.sessionId ?? postCompactionSessionId,
            sessionKey: delegatedSessionTarget.sessionKey ?? params.sessionKey,
            sessionTarget: delegatedSessionTarget,
          });
          postCompactionSessionId = resolvedDelegatedTarget.sessionId;
          postCompactionSessionFile = resolvedDelegatedTarget.sessionFile;
        }
        let postCompactionLeafId;
        if (result.ok && result.compacted) {
          if (
            shouldRotateCompactionTranscript(params.config) &&
            !delegatedRotatedTranscript &&
            !isSqliteSessionTranscript
          )
            try {
              const rotation = await rotateTranscriptFileAfterCompaction({
                sessionFile: params.sessionFile,
              });
              if (rotation.rotated) {
                postCompactionSessionId = rotation.sessionId ?? postCompactionSessionId;
                postCompactionSessionFile = rotation.sessionFile ?? postCompactionSessionFile;
                postCompactionLeafId = rotation.leafId;
                log$1.info(
                  `[compaction] rotated active transcript after context-engine compaction (sessionKey=${params.sessionKey ?? params.sessionId})`,
                );
              }
            } catch (err) {
              log$1.warn("failed to rotate compacted transcript", {
                errorMessage: formatErrorMessage(err),
              });
            }
          if (params.config && params.sessionKey && checkpointSnapshot)
            try {
              const transcriptState =
                await readSessionLeafStateFromTranscriptAsync(postCompactionSessionFile);
              const checkpointPosition = resolveCompactionCheckpointTranscriptPosition({
                preferredLeafId: postCompactionLeafId,
                transcriptState,
              });
              checkpointSnapshotRetained =
                (await compactionCheckpointStore.persistCheckpoint({
                  cfg: params.config,
                  sessionKey: params.sessionKey,
                  sessionId: postCompactionSessionId,
                  reason: resolveSessionCompactionCheckpointReason({ trigger: params.trigger }),
                  snapshot: checkpointSnapshot,
                  summary: result.result?.summary,
                  firstKeptEntryId: result.result?.firstKeptEntryId,
                  tokensBefore: result.result?.tokensBefore,
                  tokensAfter: result.result?.tokensAfter,
                  postSessionFile: postCompactionSessionFile,
                  postLeafId: checkpointPosition.leafId,
                  postEntryId: checkpointPosition.entryId,
                })) !== null;
            } catch (err) {
              log$1.warn("failed to persist compaction checkpoint", {
                errorMessage: formatErrorMessage(err),
              });
            }
          await runContextEngineMaintenance({
            contextEngine,
            sessionId: postCompactionSessionId,
            sessionKey: params.sessionKey,
            sessionTarget: buildContextEngineCompactionSessionTarget$1({
              ...params,
              sessionFile: postCompactionSessionFile,
              sessionId: postCompactionSessionId,
              sessionTarget: delegatedSessionTarget ?? params.sessionTarget,
            }),
            sessionFile: postCompactionSessionFile,
            reason: "compaction",
            runtimeContext,
            runtimeSettings: contextEngineRuntimeSettings,
            config: params.config,
          });
        }
        if (engineOwnsCompaction && result.ok && result.compacted)
          await runPostCompactionSideEffects({
            config: params.config,
            sessionKey: params.sessionKey,
            sessionId: postCompactionSessionId,
            agentId: sessionAgentId,
            sessionFile: postCompactionSessionFile,
          });
        if (
          result.ok &&
          result.compacted &&
          hookRunner?.hasHooks?.("after_compaction") &&
          hookRunner.runAfterCompaction
        )
          try {
            const afterHookCtx = {
              ...hookCtx,
              sessionId: postCompactionSessionId,
            };
            await hookRunner.runAfterCompaction(
              {
                messageCount: -1,
                compactedCount: -1,
                tokenCount: result.result?.tokensAfter,
                sessionFile: postCompactionSessionFile,
                ...(postCompactionSessionId !== params.sessionId
                  ? { previousSessionId: params.sessionId }
                  : {}),
              },
              afterHookCtx,
            );
          } catch (err) {
            log$1.warn("after_compaction hook failed", { errorMessage: formatErrorMessage(err) });
          }
        let secondaryNativeHarnessCompaction;
        if (engineOwnsCompaction && result.ok && result.compacted && attemptNativeHarnessCompaction)
          try {
            secondaryNativeHarnessCompaction = await maybeCompactAgentHarnessSession(
              {
                ...preparedParams,
                sessionId: postCompactionSessionId,
                sessionFile: postCompactionSessionFile,
                runtimeModel: effectiveRuntimeModel,
                contextEngine,
                contextTokenBudget,
                contextEngineRuntimeContext,
              },
              { nativeCompactionRequest: "after_context_engine" },
            );
            if (secondaryNativeHarnessCompaction && !secondaryNativeHarnessCompaction.ok)
              log$1.warn(
                "secondary native harness compaction failed after context-engine compaction",
                { reason: secondaryNativeHarnessCompaction.reason },
              );
          } catch (err) {
            secondaryNativeHarnessCompaction = {
              ok: false,
              compacted: false,
              reason: formatErrorMessage(err),
            };
            log$1.warn(
              "secondary native harness compaction threw after context-engine compaction",
              { errorMessage: formatErrorMessage(err) },
            );
          }
        const secondaryNativeDetailsKey =
          normalizeOptionalAgentRuntimeId(preparedHarnessRuntime) === "codex"
            ? "codexNativeCompaction"
            : "nativeHarnessCompaction";
        return {
          ok: result.ok,
          compacted: result.compacted,
          reason: result.reason,
          result: result.result
            ? {
                summary: result.result.summary ?? "",
                firstKeptEntryId: result.result.firstKeptEntryId ?? "",
                tokensBefore: result.result.tokensBefore,
                tokensAfter: result.result.tokensAfter,
                details: mergeSecondaryNativeHarnessCompactionDetails({
                  details: result.result.details,
                  nativeResult: secondaryNativeHarnessCompaction,
                  detailsKey: secondaryNativeDetailsKey,
                }),
                ...(postCompactionSessionId !== params.sessionId
                  ? { sessionId: postCompactionSessionId }
                  : {}),
                ...(postCompactionSessionFile !== params.sessionFile
                  ? { sessionFile: postCompactionSessionFile }
                  : {}),
              }
            : void 0,
        };
      } finally {
        if (!checkpointSnapshotRetained)
          await compactionCheckpointStore.cleanupSnapshot(checkpointSnapshot);
      }
    }),
  );
}
function shouldAttemptNativeHarnessCompaction(params) {
  const selectedRuntime = normalizeOptionalAgentRuntimeId(params.selectedHarnessRuntime);
  if (!selectedRuntime || selectedRuntime === "auto" || selectedRuntime === "openclaw")
    return false;
  return isOpenAIProvider(params.provider) ? params.nativeHarnessCompaction === true : true;
}
function buildCompactionContextEngineRuntimeContext(params) {
  const { sessionAgentId } = resolveSessionAgentIds({
    sessionKey: params.params.sessionKey,
    config: params.params.config,
    agentId: params.params.agentId,
  });
  const { sessionFile: _sessionFile, ...runtimeParams } = params.params;
  return {
    ...runtimeParams,
    sessionTarget: buildContextEngineCompactionSessionTarget$1(params.params),
    ...buildEmbeddedCompactionRuntimeContext({
      sessionKey: params.params.sessionKey,
      messageChannel: params.params.messageChannel,
      messageProvider: params.params.messageProvider,
      agentAccountId: params.params.agentAccountId,
      currentChannelId: params.params.currentChannelId,
      currentThreadTs: params.params.currentThreadTs,
      currentMessageId: params.params.currentMessageId,
      authProfileId: params.params.authProfileId,
      authProfileIdSource: params.params.authProfileIdSource,
      runtimeAuthPlan: params.params.runtimeAuthPlan,
      workspaceDir: params.params.workspaceDir,
      cwd: params.params.cwd,
      agentDir: params.agentDir,
      config: params.params.config,
      skillsSnapshot: params.params.skillsSnapshot,
      senderIsOwner: params.params.senderIsOwner,
      senderId: params.params.senderId,
      provider: params.params.provider,
      modelId: params.params.model,
      harnessRuntime: params.harnessRuntime,
      modelSelectionLocked: params.params.modelSelectionLocked,
      modelFallbacksOverride: params.params.modelFallbacksOverride,
      thinkLevel: params.params.thinkLevel,
      reasoningLevel: params.params.reasoningLevel,
      bashElevated: params.params.bashElevated,
      extraSystemPrompt: params.params.extraSystemPrompt,
      sourceReplyDeliveryMode: params.params.sourceReplyDeliveryMode,
      ownerNumbers: params.params.ownerNumbers,
    }),
    ...resolveContextEngineCapabilities({
      config: params.params.config,
      sessionKey: params.params.sessionKey,
      agentId: sessionAgentId,
      authProfileId: params.params.authProfileId,
      contextEnginePluginId: params.contextEnginePluginId,
      purpose: "context-engine.compaction",
    }),
    tokenBudget: params.contextTokenBudget,
    currentTokenCount: params.params.currentTokenCount,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/failure-signal.ts
/**
 * Converts embedded run failures into provider failover signals.
 */
/**
 * Converts terminal tool errors from unattended embedded runs into failure signals.
 *
 * Cron runs need fatal execution-denied signals so schedulers do not treat blocked shell access as
 * a normal silent completion.
 */
const FAILURE_SIGNAL_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
function resolveFailureSignalCode(value) {
  for (const code of FAILURE_SIGNAL_CODES) if (value === code) return code;
}
/** Resolves fatal cron failure metadata from the last exec-like tool error, if applicable. */
function resolveEmbeddedRunFailureSignal(params) {
  if (params.trigger !== "cron") return;
  const lastToolError = params.lastToolError;
  if (!lastToolError || !isExecLikeToolName(lastToolError.toolName)) return;
  const code = resolveFailureSignalCode(normalizeOptionalString(lastToolError.errorCode));
  if (!code) return;
  const message = normalizeOptionalString(lastToolError.error) ?? code;
  return {
    kind: "execution_denied",
    source: "tool",
    ...(lastToolError.toolName ? { toolName: lastToolError.toolName } : {}),
    code,
    message,
    fatalForCron: true,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/post-compaction-loop-guard.ts
/**
 * Detects identical tool-call loops immediately after automatic compaction.
 *
 * The guard only observes a small post-compaction window; if compaction failed to break an
 * identical args/result loop, the runner aborts before spending unbounded tokens.
 */
const log = createSubsystemLogger("agents/post-compaction-guard");
const DEFAULT_WINDOW_SIZE = 3;
function asPositiveInt(value, fallback) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return fallback;
  return value;
}
/** Creates a stateful post-compaction loop detector for one embedded run. */
function createPostCompactionLoopGuard(config, options) {
  const state = {
    enabled: options?.enabled ?? true,
    windowSize: asPositiveInt(config?.windowSize, DEFAULT_WINDOW_SIZE),
    remainingAttempts: 0,
    history: [],
  };
  const armPostCompaction = () => {
    state.remainingAttempts = state.windowSize;
    state.history = [];
    if (state.enabled) log.info(`post-compaction guard armed for ${state.windowSize} attempts`);
  };
  const observe = (call) => {
    if (!state.enabled)
      return {
        shouldAbort: false,
        armed: false,
        remainingAttempts: 0,
      };
    if (state.remainingAttempts <= 0)
      return {
        shouldAbort: false,
        armed: false,
        remainingAttempts: 0,
      };
    state.remainingAttempts -= 1;
    state.history.push(call);
    const armedAfter = state.remainingAttempts > 0;
    const matches = state.history.filter(
      (entry) =>
        entry.toolName === call.toolName &&
        entry.argsHash === call.argsHash &&
        entry.resultHash === call.resultHash,
    );
    if (matches.length >= state.windowSize) {
      log.error(
        `post-compaction loop persisted: tool=${call.toolName} repeated ${matches.length} times with identical args+result post-compaction`,
      );
      return {
        shouldAbort: true,
        armed: armedAfter,
        remainingAttempts: state.remainingAttempts,
        detector: "compaction_loop_persisted",
        count: matches.length,
        toolName: call.toolName,
        message: `CRITICAL: tool ${call.toolName} repeated ${matches.length} times with identical arguments and identical results within ${state.windowSize} attempts after auto-compaction. The compaction did not break the loop. Aborting to prevent runaway resource use.`,
      };
    }
    return {
      shouldAbort: false,
      armed: armedAfter,
      remainingAttempts: state.remainingAttempts,
    };
  };
  const snapshot = () => ({
    armed: state.remainingAttempts > 0,
    remainingAttempts: state.remainingAttempts,
  });
  return {
    armPostCompaction,
    observe,
    snapshot,
  };
}
/** Error raised when the post-compaction loop guard aborts a run. */
var PostCompactionLoopPersistedError = class PostCompactionLoopPersistedError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "PostCompactionLoopPersistedError";
    this.detector = details.detector;
    this.count = details.count;
    this.toolName = details.toolName;
  }
  static fromVerdict(verdict) {
    return new PostCompactionLoopPersistedError(verdict.message, {
      detector: verdict.detector,
      count: verdict.count,
      toolName: verdict.toolName,
    });
  }
};
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-policy.ts
function shouldEscalateRetryLimit(reason) {
  return Boolean(
    reason && reason !== "timeout" && reason !== "format" && reason !== "session_expired",
  );
}
function isTerminalFormatFailure(params) {
  return (
    params.failoverFailure && params.failoverReason === "format" && params.allowFormatRetry !== true
  );
}
function shouldRotatePrompt(params) {
  if (params.timedOutByRunBudget) return false;
  return (
    params.failoverFailure &&
    params.failoverReason !== "timeout" &&
    !isTerminalFormatFailure(params)
  );
}
function isAssistantTimeoutFailure(params) {
  return (
    params.idleTimedOut ||
    (params.timedOut && !params.timedOutDuringCompaction && !params.timedOutDuringToolExecution)
  );
}
function isConcreteNonTimeoutAssistantFailure(params) {
  return (
    params.failoverFailure && Boolean(params.failoverReason) && params.failoverReason !== "timeout"
  );
}
function shouldRotateAssistant(params) {
  if (isTerminalFormatFailure(params)) return false;
  if (params.timedOutByRunBudget) return false;
  const timeoutFailure = isAssistantTimeoutFailure(params);
  if (
    params.harnessOwnsTransport &&
    (timeoutFailure || params.failoverReason === "timeout") &&
    !isConcreteNonTimeoutAssistantFailure(params)
  )
    return false;
  return (!params.aborted && params.failoverFailure) || timeoutFailure;
}
function assistantFallbackReason(params) {
  const failoverReason = params.failoverReason;
  if (params.failoverFailure && failoverReason && failoverReason !== "timeout")
    return failoverReason;
  return isAssistantTimeoutFailure(params) ? "timeout" : (failoverReason ?? "unknown");
}
/** Preserves an existing retry reason unless the current attempt produced a stronger signal. */
function mergeRetryFailoverReason(params) {
  return params.failoverReason ?? (params.timedOut ? "timeout" : null) ?? params.previous;
}
/**
 * Chooses whether a run should rotate auth profile, switch model fallback,
 * surface the error, continue normally, or return an error payload. Prompt,
 * assistant, and retry-limit stages intentionally use different action sets.
 */
function resolveRunFailoverDecision(params) {
  if (params.stage === "retry_limit") {
    if (params.fallbackConfigured && shouldEscalateRetryLimit(params.failoverReason))
      return {
        action: "fallback_model",
        reason: params.failoverReason ?? "unknown",
      };
    return { action: "return_error_payload" };
  }
  if (params.stage === "prompt") {
    if (params.failoverCode === "cli_max_turns")
      return {
        action: "surface_error",
        reason: params.failoverReason,
      };
    if (params.externalAbort)
      return {
        action: "surface_error",
        reason: params.failoverReason,
      };
    if (params.timedOutByRunBudget)
      return {
        action: "surface_error",
        reason: params.failoverReason,
      };
    if (params.harnessOwnsTransport && params.failoverReason === "timeout") {
      if (params.promptTimeoutFallbackSafe === true && params.fallbackConfigured)
        return {
          action: "fallback_model",
          reason: "timeout",
        };
      return {
        action: "surface_error",
        reason: params.failoverReason,
      };
    }
    if (!params.profileRotated && shouldRotatePrompt(params))
      return {
        action: "rotate_profile",
        reason: params.failoverReason,
      };
    if (params.fallbackConfigured && params.failoverFailure && !isTerminalFormatFailure(params))
      return {
        action: "fallback_model",
        reason: params.failoverReason ?? "unknown",
      };
    return {
      action: "surface_error",
      reason: params.failoverReason,
    };
  }
  if (params.externalAbort)
    return {
      action: "surface_error",
      reason: params.failoverReason,
    };
  if (isTerminalFormatFailure(params))
    return {
      action: "surface_error",
      reason: params.failoverReason,
    };
  const assistantShouldRotate = shouldRotateAssistant(params);
  if (!params.profileRotated && assistantShouldRotate)
    return {
      action: "rotate_profile",
      reason: params.failoverReason,
    };
  if (assistantShouldRotate && params.fallbackConfigured)
    return {
      action: "fallback_model",
      reason: assistantFallbackReason(params),
    };
  if (!assistantShouldRotate) return { action: "continue_normal" };
  return {
    action: "surface_error",
    reason: params.failoverReason,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/assistant-failover.ts
/**
 * Handles assistant-stage failover decisions during embedded-agent attempts.
 */
function resolveShortWindowRateLimitRetry(message) {
  const window = classifyRateLimitWindow(message);
  if (window.kind !== "short") return null;
  return window.retryAfterSeconds === void 0 ? {} : { retryAfterSeconds: window.retryAfterSeconds };
}
function isShortWindowRateLimitMessage(message) {
  return resolveShortWindowRateLimitRetry(message) !== null;
}
/**
 * Applies an assistant-stage failover decision and returns the next run action.
 * It owns auth-profile rotation, overload/rate-limit escalation, same-model
 * idle-timeout retry, and FailoverError construction for outer model fallback.
 */
async function handleAssistantFailover(params) {
  let overloadProfileRotations = params.overloadProfileRotations;
  let decision = params.initialDecision;
  const sameModelIdleTimeoutRetry = () => {
    params.warn(
      `[llm-idle-timeout] ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} produced no reply before the idle watchdog; retrying same model`,
    );
    return {
      action: "retry",
      overloadProfileRotations,
      retryKind: "same_model_idle_timeout",
      lastRetryFailoverReason: mergeRetryFailoverReason({
        previous: params.previousRetryFailoverReason,
        failoverReason: params.failoverReason,
        timedOut: true,
      }),
    };
  };
  const sameModelRateLimitRetry = () => ({
    action: "retry",
    overloadProfileRotations,
    retryKind: "same_model_rate_limit",
    lastRetryFailoverReason: mergeRetryFailoverReason({
      previous: params.previousRetryFailoverReason,
      failoverReason: params.failoverReason,
      timedOut: params.timedOut || params.idleTimedOut,
    }),
  });
  if (decision.action === "rotate_profile") {
    const failedProfileId = params.lastProfileId;
    const timeoutFailure = params.timedOut || params.idleTimedOut;
    const failureReason = params.assistantProfileFailureReason;
    const markFailedProfile = async () => {
      if (!failedProfileId || !failureReason) return;
      try {
        await params.maybeMarkAuthProfileFailure({
          profileId: failedProfileId,
          reason: failureReason,
          modelId: params.modelId,
        });
      } catch (err) {
        params.warn(`profile failure mark failed: ${String(err)}`);
      }
    };
    if (params.failoverReason === "overloaded") {
      overloadProfileRotations += 1;
      if (
        overloadProfileRotations > params.overloadProfileRotationLimit &&
        params.fallbackConfigured
      ) {
        const status = resolveFailoverStatus("overloaded");
        params.warn(
          `overload profile rotation cap reached for ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} after ${overloadProfileRotations} rotations; escalating to model fallback`,
        );
        await markFailedProfile();
        params.logAssistantFailoverDecision("fallback_model", { status });
        return {
          action: "throw",
          overloadProfileRotations,
          error: new FailoverError(
            "The AI service is temporarily overloaded. Please try again in a moment.",
            {
              reason: "overloaded",
              provider: params.activeErrorContext.provider,
              model: params.activeErrorContext.model,
              profileId: params.lastProfileId,
              status,
              rawError: params.lastAssistant?.errorMessage?.trim(),
            },
          ),
        };
      }
    }
    if (params.failoverReason === "rate_limit") {
      const shortWindowRetry = resolveShortWindowRateLimitRetry(params.lastAssistant?.errorMessage);
      if (
        params.allowSameModelRateLimitRetry &&
        shortWindowRetry &&
        (await params.maybeRetrySameModelRateLimit(shortWindowRetry))
      )
        return sameModelRateLimitRetry();
      params.maybeEscalateRateLimitProfileFallback({
        failoverProvider: params.activeErrorContext.provider,
        failoverModel: params.activeErrorContext.model,
        logFallbackDecision: params.logAssistantFailoverDecision,
      });
    }
    const rotated = await params.advanceAuthProfile();
    const markFailedProfilePromise = markFailedProfile();
    if (timeoutFailure && !params.isProbeSession && failedProfileId) {
      const timeoutLabel = params.idleTimedOut ? "idle timeout (model silent)" : "timed out";
      params.warn(`Profile ${failedProfileId} ${timeoutLabel}. Trying next account...`);
    }
    if (params.cloudCodeAssistFormatError && failedProfileId)
      params.warn(
        `Profile ${failedProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`,
      );
    if (rotated) {
      params.logAssistantFailoverDecision("rotate_profile");
      await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
      return {
        action: "retry",
        overloadProfileRotations,
        lastRetryFailoverReason: mergeRetryFailoverReason({
          previous: params.previousRetryFailoverReason,
          failoverReason: params.failoverReason,
          timedOut: params.timedOut || params.idleTimedOut,
        }),
      };
    }
    await markFailedProfilePromise;
    if (params.idleTimedOut && params.allowSameModelIdleTimeoutRetry)
      return sameModelIdleTimeoutRetry();
    decision = resolveRunFailoverDecision({
      stage: "assistant",
      allowFormatRetry: params.cloudCodeAssistFormatError,
      aborted: params.aborted,
      externalAbort: params.externalAbort,
      fallbackConfigured: params.fallbackConfigured,
      failoverFailure: params.failoverFailure,
      failoverReason: params.failoverReason,
      timedOut: params.timedOut,
      idleTimedOut: params.idleTimedOut,
      timedOutDuringCompaction: params.timedOutDuringCompaction,
      timedOutDuringToolExecution: params.timedOutDuringToolExecution,
      timedOutByRunBudget: params.timedOutByRunBudget,
      profileRotated: true,
    });
  }
  if (decision.action === "fallback_model") {
    await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
    const message = resolveAssistantFailoverErrorMessage(params);
    const status =
      resolveFailoverStatus(decision.reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
    params.logAssistantFailoverDecision("fallback_model", { status });
    const shouldSuspend =
      Boolean(params.sessionKey) &&
      (decision.reason === "rate_limit" || decision.reason === "billing");
    return {
      action: "throw",
      overloadProfileRotations,
      error: new FailoverError(message, {
        reason: decision.reason,
        provider: params.activeErrorContext.provider,
        model: params.activeErrorContext.model,
        profileId: params.lastProfileId,
        authMode: params.authMode,
        status,
        rawError: params.lastAssistant?.errorMessage?.trim(),
        suspend: shouldSuspend,
      }),
    };
  }
  if (decision.action === "surface_error") {
    if (!params.externalAbort && params.idleTimedOut && params.allowSameModelIdleTimeoutRetry)
      return sameModelIdleTimeoutRetry();
    params.logAssistantFailoverDecision("surface_error");
    if (!params.externalAbort && !params.timedOut && params.failoverFailure) {
      const message = resolveAssistantFailoverErrorMessage(params);
      const reason = resolveSurfaceErrorReason(decision.reason, params);
      const status =
        resolveFailoverStatus(reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
      const shouldSuspend =
        Boolean(params.sessionKey) && (reason === "rate_limit" || reason === "billing");
      return {
        action: "throw",
        overloadProfileRotations,
        error: new FailoverError(message, {
          reason,
          provider: params.activeErrorContext.provider,
          model: params.activeErrorContext.model,
          profileId: params.lastProfileId,
          authMode: params.authMode,
          status,
          rawError: params.lastAssistant?.errorMessage?.trim(),
          suspend: shouldSuspend,
        }),
      };
    }
  }
  return {
    action: "continue_normal",
    overloadProfileRotations,
  };
}
function resolveAssistantFailoverErrorMessage(params) {
  const timeoutFailure = params.timedOut || params.idleTimedOut;
  return (
    (params.lastAssistant
      ? formatAssistantErrorText(params.lastAssistant, {
          cfg: params.config,
          sessionKey: params.sessionKey,
          provider: params.activeErrorContext.provider,
          model: params.activeErrorContext.model,
          authMode: params.authMode,
        })
      : void 0) ||
    params.lastAssistant?.errorMessage?.trim() ||
    (timeoutFailure
      ? "LLM request timed out."
      : params.rateLimitFailure
        ? "LLM request rate limited."
        : params.billingFailure
          ? formatBillingErrorMessage(
              params.activeErrorContext.provider,
              params.activeErrorContext.model,
              params.authMode,
            )
          : params.authFailure
            ? "LLM request unauthorized."
            : "LLM request failed.")
  );
}
function resolveSurfaceErrorReason(declared, params) {
  if (declared) return declared;
  if (params.billingFailure) return "billing";
  if (params.authFailure) return "auth";
  if (params.rateLimitFailure) return "rate_limit";
  return "unknown";
}
//#endregion
//#region src/agents/auth-profiles/failure-copy.ts
function describeReason(reason, provider, allInCooldown) {
  if (allInCooldown)
    switch (reason) {
      case "auth":
      case "session_expired":
        return `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`;
      case "auth_permanent":
        return `${provider} isn't accepting your saved login anymore.`;
      case "billing":
        return `${provider} rejected the request — looks like a billing issue on the account.`;
      case "rate_limit":
        return `${provider} is asking us to slow down. Please wait a moment before trying again.`;
      case "overloaded":
        return `${provider} is overloaded right now. Please wait a moment before trying again.`;
      case "timeout":
        return `${provider} hasn't been responding. Please wait a moment before trying again.`;
      case "model_not_found":
        return `${provider} can't find the model you're using right now.`;
      case "server_error":
        return `${provider} is having issues right now. Please wait a moment before trying again.`;
      default:
        return `Couldn't reach ${provider} with any of your saved logins right now.`;
    }
  switch (reason) {
    case "auth":
    case "session_expired":
      return `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`;
    case "auth_permanent":
      return `${provider} isn't accepting your saved login.`;
    case "billing":
      return `${provider} rejected the request — looks like a billing issue on the account.`;
    default:
      return null;
  }
}
function shouldIncludeRecoveryHint(reason) {
  switch (reason) {
    case "auth":
    case "auth_permanent":
    case "session_expired":
    case "billing":
      return true;
    case "rate_limit":
    case "overloaded":
    case "timeout":
    case "server_error":
    case "model_not_found":
    case "format":
      return false;
    default:
      return true;
  }
}
function diagnosticSuffix(cause, primary) {
  if (cause === void 0 || cause === null) return null;
  const text = formatErrorMessage(cause).trim();
  if (!text || primary.includes(text)) return null;
  return ` (${text})`;
}
/**
 * Single source of truth for user-facing copy when an auth-profile rotation
 * fails. Composes a reason-specific sentence with an actionable next-step
 * derived from the provider's plugin manifest (`buildProviderAuthRecoveryHint`).
 *
 * Falls back to the underlying error's text when the reason maps to nothing
 * actionable, so we never produce worse copy than the raw error.
 */
function formatAuthProfileFailureMessage(params) {
  const description = describeReason(params.reason, params.provider, params.allInCooldown);
  if (!description) {
    const causeText = params.cause ? formatErrorMessage(params.cause).trim() : "";
    if (causeText) return causeText;
    return `Couldn't reach ${params.provider} with any of your saved logins right now.`;
  }
  const hint = shouldIncludeRecoveryHint(params.reason)
    ? buildProviderAuthRecoveryHint({
        provider: params.provider,
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: params.env,
      })
    : null;
  const suffix = diagnosticSuffix(params.cause, description);
  const parts = [description];
  if (hint) parts.push(hint);
  const message = parts.join(" ");
  return suffix ? `${message}${suffix}` : message;
}
//#endregion
//#region src/agents/runtime-auth-refresh.ts
/**
 * Runtime auth refresh timer helper.
 *
 * Clamps refresh deadlines before they are passed to setTimeout.
 */
/** Clamp an auth refresh deadline to a safe setTimeout delay. */
function clampRuntimeAuthRefreshDelayMs(params) {
  return resolveSafeTimeoutDelayMs(params.refreshAt - params.now, { minMs: params.minDelayMs });
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-controller.ts
/** Decides whether one automatic profile may bypass its current cooldown. */
function resolveEmbeddedAuthCooldownProbePolicy(params) {
  const autoProfileCandidates = params.profileCandidates.filter(
    (candidate) =>
      typeof candidate === "string" && candidate.length > 0 && candidate !== params.lockedProfileId,
  );
  const allAutoProfilesInCooldown =
    autoProfileCandidates.length > 0 &&
    autoProfileCandidates.every((candidate) =>
      isProfileInCooldown(params.authStore, candidate, void 0, params.modelId),
    );
  const unavailableReason = allAutoProfilesInCooldown
    ? (resolveProfilesUnavailableReason({
        store: params.authStore,
        profileIds: autoProfileCandidates,
      }) ?? "unknown")
    : null;
  return {
    allowProbe:
      params.allowTransientCooldownProbe &&
      allAutoProfilesInCooldown &&
      shouldUseTransientCooldownProbeSlot(unavailableReason),
    unavailableReason,
  };
}
/**
 * Coordinates auth profile selection, runtime auth preparation/refresh, and
 * profile failover for one embedded run. State is injected through accessors so
 * the runner can keep provider/model/auth snapshots in sync across retries.
 */
function createEmbeddedRunAuthController(params) {
  const baseRuntimeModel = params.getRuntimeModel();
  const baseEffectiveModel = params.getEffectiveModel();
  const commitPreparedModel = (preparedModel) => {
    preparedModel?.commit();
    if (preparedModel?.authRequirement) return;
    params.setRuntimeModel(baseRuntimeModel);
    params.setEffectiveModel(baseEffectiveModel);
  };
  const applyPreparedRuntimeRequestOverrides = (paramsForApply) => {
    const runtimeModel = applyPreparedRuntimeAuthToModel(
      paramsForApply.runtimeModel,
      paramsForApply.preparedAuth,
    );
    if (runtimeModel === paramsForApply.runtimeModel) return;
    params.setRuntimeModel(runtimeModel);
    params.setEffectiveModel(
      applyPreparedRuntimeAuthToModel(params.getEffectiveModel(), paramsForApply.preparedAuth),
    );
  };
  const hasRefreshableRuntimeAuth = () =>
    Boolean(params.getRuntimeAuthState()?.sourceApiKey.trim());
  const nextRuntimeAuthGeneration = () => (params.getRuntimeAuthState()?.generation ?? 0) + 1;
  const prepareRuntimeAuthForModel = async (prepareParams) => {
    const preparedAuth = await prepareProviderRuntimeAuth({
      provider: prepareParams.runtimeModel.provider,
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: process.env,
      context: {
        config: params.config,
        agentDir: params.agentDir,
        workspaceDir: params.workspaceDir,
        env: process.env,
        provider: prepareParams.runtimeModel.provider,
        modelId: params.getModelId(),
        model: prepareParams.runtimeModel,
        apiKey: unwrapSecretSentinelsForProviderEgress(
          prepareParams.apiKey,
          "provider runtime auth exchange",
        ),
        authMode: prepareParams.authMode,
        profileId: prepareParams.profileId,
      },
    });
    return protectPreparedProviderRuntimeAuth({
      provider: prepareParams.runtimeModel.provider,
      preparedAuth,
    });
  };
  const clearRuntimeAuthRefreshTimer = () => {
    const runtimeAuthState = params.getRuntimeAuthState();
    if (!runtimeAuthState?.refreshTimer) return;
    clearTimeout(runtimeAuthState.refreshTimer);
    runtimeAuthState.refreshTimer = void 0;
  };
  const stopRuntimeAuthRefreshTimer = () => {
    if (!params.getRuntimeAuthState()) return;
    params.setRuntimeAuthRefreshCancelled(true);
    clearRuntimeAuthRefreshTimer();
  };
  const refreshRuntimeAuth = async (reason) => {
    const runtimeAuthState = params.getRuntimeAuthState();
    if (!runtimeAuthState) return;
    if (runtimeAuthState.refreshInFlight) {
      await runtimeAuthState.refreshInFlight;
      return;
    }
    const refreshGeneration = runtimeAuthState.generation;
    const refreshProfileId = runtimeAuthState.profileId;
    const refreshPromise = (async () => {
      const currentRuntimeAuthState = params.getRuntimeAuthState();
      const sourceApiKey = currentRuntimeAuthState?.sourceApiKey.trim() ?? "";
      if (!sourceApiKey) throw new Error(`Runtime auth refresh requires a source credential.`);
      const runtimeModel = params.getRuntimeModel();
      params.log.debug(`Refreshing runtime auth for ${runtimeModel.provider} (${reason})...`);
      const preparedAuth = await prepareRuntimeAuthForModel({
        runtimeModel,
        apiKey: sourceApiKey,
        authMode: currentRuntimeAuthState?.authMode ?? "unknown",
        profileId: currentRuntimeAuthState?.profileId,
      });
      if (!preparedAuth?.apiKey)
        throw new Error(
          `Provider "${runtimeModel.provider}" does not support runtime auth refresh.`,
        );
      const activeRuntimeAuthState = params.getRuntimeAuthState();
      if (
        !activeRuntimeAuthState ||
        activeRuntimeAuthState.generation !== refreshGeneration ||
        activeRuntimeAuthState.profileId !== refreshProfileId ||
        activeRuntimeAuthState.sourceApiKey.trim() !== sourceApiKey
      ) {
        params.log.debug(
          `Ignoring stale runtime auth refresh for ${runtimeModel.provider}; auth state advanced before ${reason} refresh completed.`,
        );
        return;
      }
      params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
      applyPreparedRuntimeRequestOverrides({
        runtimeModel,
        preparedAuth,
      });
      params.setRuntimeAuthState({
        ...activeRuntimeAuthState,
        expiresAt: preparedAuth.expiresAt,
      });
      if (preparedAuth.expiresAt) {
        const remaining = preparedAuth.expiresAt - Date.now();
        params.log.debug(
          `Runtime auth refreshed for ${runtimeModel.provider}; expires in ${Math.max(0, Math.floor(remaining / 1e3))}s.`,
        );
      }
    })()
      .catch((err) => {
        const runtimeModel = params.getRuntimeModel();
        params.log.warn(
          `Runtime auth refresh failed for ${runtimeModel.provider}: ${formatErrorMessage(err)}`,
        );
        throw err;
      })
      .finally(() => {
        const activeState = params.getRuntimeAuthState();
        if (
          activeState &&
          activeState.generation === refreshGeneration &&
          activeState.refreshInFlight === refreshPromise
        )
          activeState.refreshInFlight = void 0;
      });
    runtimeAuthState.refreshInFlight = refreshPromise;
    await refreshPromise;
  };
  const scheduleRuntimeAuthRefresh = () => {
    const runtimeAuthState = params.getRuntimeAuthState();
    if (!runtimeAuthState || params.getRuntimeAuthRefreshCancelled()) return;
    const runtimeModel = params.getRuntimeModel();
    if (!hasRefreshableRuntimeAuth()) {
      params.log.warn(
        `Skipping runtime auth refresh scheduling for ${runtimeModel.provider}; source credential missing.`,
      );
      return;
    }
    if (!runtimeAuthState.expiresAt) return;
    clearRuntimeAuthRefreshTimer();
    const now = Date.now();
    const delayMs = clampRuntimeAuthRefreshDelayMs({
      refreshAt: runtimeAuthState.expiresAt - RUNTIME_AUTH_REFRESH_MARGIN_MS,
      now,
      minDelayMs: RUNTIME_AUTH_REFRESH_MIN_DELAY_MS,
    });
    const timer = setTimeout(() => {
      if (params.getRuntimeAuthRefreshCancelled()) return;
      refreshRuntimeAuth("scheduled")
        .then(() => scheduleRuntimeAuthRefresh())
        .catch(() => {
          if (params.getRuntimeAuthRefreshCancelled()) return;
          const retryTimer = setTimeout(() => {
            if (params.getRuntimeAuthRefreshCancelled()) return;
            refreshRuntimeAuth("scheduled-retry")
              .then(() => scheduleRuntimeAuthRefresh())
              .catch(() => void 0);
          }, RUNTIME_AUTH_REFRESH_RETRY_MS);
          const activeRuntimeAuthState = params.getRuntimeAuthState();
          if (activeRuntimeAuthState) activeRuntimeAuthState.refreshTimer = retryTimer;
          if (params.getRuntimeAuthRefreshCancelled() && activeRuntimeAuthState) {
            clearTimeout(retryTimer);
            activeRuntimeAuthState.refreshTimer = void 0;
          }
        });
    }, delayMs);
    runtimeAuthState.refreshTimer = timer;
    if (params.getRuntimeAuthRefreshCancelled()) {
      clearTimeout(timer);
      runtimeAuthState.refreshTimer = void 0;
    }
  };
  const resolveAuthProfileFailoverReason = (failoverParams) => {
    if (failoverParams.allInCooldown) {
      const profileIds = (failoverParams.profileIds ?? params.profileCandidates).filter(
        (id) => typeof id === "string" && id.length > 0,
      );
      return (
        resolveProfilesUnavailableReason({
          store: params.authStore,
          profileIds,
        }) ?? "unknown"
      );
    }
    return (
      classifyFailoverReason(failoverParams.message, { provider: params.getProvider() }) ?? "auth"
    );
  };
  const throwAuthProfileFailover = (failoverParams) => {
    const provider = params.getProvider();
    const modelId = params.getModelId();
    const messageForReason =
      failoverParams.message?.trim() ||
      (failoverParams.error ? formatErrorMessage(failoverParams.error).trim() : "");
    const reason = resolveAuthProfileFailoverReason({
      allInCooldown: failoverParams.allInCooldown,
      message: messageForReason,
      profileIds: params.profileCandidates,
    });
    const message =
      failoverParams.message?.trim() ||
      formatAuthProfileFailureMessage({
        reason,
        provider,
        allInCooldown: failoverParams.allInCooldown,
        cause: failoverParams.error,
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: process.env,
      });
    if (params.fallbackConfigured)
      throw new FailoverError(message, {
        reason,
        provider,
        model: modelId,
        authMode:
          reason === "billing"
            ? resolveSubscriptionAuthModeForProfiles({
                store: params.authStore,
                profileIds: failoverParams.allInCooldown
                  ? params.profileCandidates
                  : [params.profileCandidates[params.getProfileIndex()]],
              })
            : void 0,
        status: resolveFailoverStatus(reason),
        authProfileFailure: { allInCooldown: failoverParams.allInCooldown },
        cause: failoverParams.error,
      });
    if (failoverParams.error instanceof Error) throw failoverParams.error;
    throw new Error(message);
  };
  const resolveApiKeyForCandidate = async (
    candidate,
    model = params.getRuntimeModel(),
    allowAuthProfileFallback,
  ) => {
    return getApiKeyForModel({
      model,
      cfg: params.config,
      profileId: candidate,
      store: params.authStore,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      lockedProfile: candidate != null && candidate === params.lockedProfileId,
      allowAuthProfileFallback,
      secretSentinels: true,
    });
  };
  const applyApiKeyInfo = async (candidate, attemptIndex) => {
    const preparedModel = await params.prepareModelForAuthProfile?.(candidate, attemptIndex);
    const apiKeyInfo = await resolveApiKeyForCandidate(
      candidate,
      preparedModel?.runtimeModel,
      preparedModel?.allowAuthProfileFallback,
    );
    if (
      preparedModel?.authRequirement &&
      !providerModelRouteAcceptsAuthMode({
        requirement: preparedModel.authRequirement,
        mode: apiKeyInfo.mode ?? (apiKeyInfo.apiKey ? "api-key" : void 0),
      })
    )
      throw new Error(
        `Resolved ${apiKeyInfo.mode ?? "unknown"} credentials are incompatible with the selected ${preparedModel.authRequirement} route for ${preparedModel.runtimeModel.provider}.`,
      );
    params.setApiKeyInfo(apiKeyInfo);
    const resolvedProfileId = apiKeyInfo.profileId ?? candidate;
    if (!apiKeyInfo.apiKey) {
      if (apiKeyInfo.mode !== "aws-sdk")
        throw new MissingProviderAuthError(
          (preparedModel?.runtimeModel ?? params.getRuntimeModel()).provider,
          apiKeyInfo,
        );
      commitPreparedModel(preparedModel);
      const runtimeModel = params.getRuntimeModel();
      const AWS_SDK_AUTH_SENTINEL = "__aws_sdk_auth__";
      try {
        const preparedAuth = await prepareRuntimeAuthForModel({
          runtimeModel,
          apiKey: AWS_SDK_AUTH_SENTINEL,
          authMode: apiKeyInfo.mode,
          profileId: apiKeyInfo.profileId,
        });
        applyPreparedRuntimeRequestOverrides({
          runtimeModel,
          preparedAuth: preparedAuth ?? {},
        });
        if (preparedAuth?.apiKey) {
          clearRuntimeAuthRefreshTimer();
          params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
          params.setRuntimeAuthState({
            generation: nextRuntimeAuthGeneration(),
            sourceApiKey: AWS_SDK_AUTH_SENTINEL,
            authMode: apiKeyInfo.mode,
            profileId: resolvedProfileId,
            expiresAt: preparedAuth.expiresAt,
          });
          if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
          params.setLastProfileId(resolvedProfileId);
          return;
        }
      } catch (error) {
        params.log.warn(
          `prepareProviderRuntimeAuth failed for ${runtimeModel.provider}, falling back to sentinel: ${formatErrorMessage(error)}`,
        );
      }
      clearRuntimeAuthRefreshTimer();
      params.authStorage.setRuntimeApiKey(runtimeModel.provider, AWS_SDK_AUTH_SENTINEL);
      params.setRuntimeAuthState(null);
      params.setLastProfileId(resolvedProfileId);
      return;
    }
    commitPreparedModel(preparedModel);
    let runtimeAuthHandled = false;
    const runtimeModel = params.getRuntimeModel();
    const preparedAuth = await prepareRuntimeAuthForModel({
      runtimeModel,
      apiKey: apiKeyInfo.apiKey,
      authMode: apiKeyInfo.mode,
      profileId: apiKeyInfo.profileId,
    });
    applyPreparedRuntimeRequestOverrides({
      runtimeModel,
      preparedAuth: preparedAuth ?? {},
    });
    if (preparedAuth?.apiKey) {
      clearRuntimeAuthRefreshTimer();
      params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
      params.setRuntimeAuthState({
        generation: nextRuntimeAuthGeneration(),
        sourceApiKey: apiKeyInfo.apiKey,
        authMode: apiKeyInfo.mode,
        profileId: apiKeyInfo.profileId,
        expiresAt: preparedAuth.expiresAt,
      });
      if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
      runtimeAuthHandled = true;
    }
    if (!runtimeAuthHandled) {
      clearRuntimeAuthRefreshTimer();
      params.authStorage.setRuntimeApiKey(runtimeModel.provider, apiKeyInfo.apiKey);
      params.setRuntimeAuthState(null);
    }
    params.setLastProfileId(apiKeyInfo.profileId);
  };
  const advanceAuthProfile = async () => {
    if (params.lockedProfileId) return false;
    let nextIndex = params.getProfileIndex() + 1;
    while (nextIndex < params.profileCandidates.length) {
      const candidate = params.profileCandidates[nextIndex];
      if (
        candidate &&
        isProfileInCooldown(params.authStore, candidate, void 0, params.getModelId())
      ) {
        nextIndex += 1;
        continue;
      }
      try {
        await applyApiKeyInfo(candidate, nextIndex);
        params.setProfileIndex(nextIndex);
        params.setThinkLevel(params.initialThinkLevel);
        params.attemptedThinking.clear();
        return true;
      } catch (err) {
        if (candidate && candidate === params.lockedProfileId) throw err;
        nextIndex += 1;
      }
    }
    return false;
  };
  const initializeAuthProfile = async () => {
    try {
      const modelId = params.getModelId();
      const cooldownProbePolicy = resolveEmbeddedAuthCooldownProbePolicy({
        authStore: params.authStore,
        profileCandidates: params.profileCandidates,
        lockedProfileId: params.lockedProfileId,
        modelId,
        allowTransientCooldownProbe: params.allowTransientCooldownProbe,
      });
      let didTransientCooldownProbe = false;
      while (params.getProfileIndex() < params.profileCandidates.length) {
        const candidate = params.profileCandidates[params.getProfileIndex()];
        if (
          candidate &&
          candidate !== params.lockedProfileId &&
          isProfileInCooldown(params.authStore, candidate, void 0, modelId)
        )
          if (cooldownProbePolicy.allowProbe && !didTransientCooldownProbe) {
            didTransientCooldownProbe = true;
            params.log.warn(
              `probing cooldowned auth profile for ${params.getProvider()}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`,
            );
          } else {
            params.setProfileIndex(params.getProfileIndex() + 1);
            continue;
          }
        await applyApiKeyInfo(
          params.profileCandidates[params.getProfileIndex()],
          params.getProfileIndex(),
        );
        break;
      }
      if (params.getProfileIndex() >= params.profileCandidates.length)
        throwAuthProfileFailover({ allInCooldown: true });
    } catch (err) {
      if (err instanceof FailoverError) throw err;
      if (params.profileCandidates[params.getProfileIndex()] === params.lockedProfileId)
        throwAuthProfileFailover({
          allInCooldown: false,
          error: err,
        });
      if (!(await advanceAuthProfile()))
        throwAuthProfileFailover({
          allInCooldown: false,
          error: err,
        });
    }
  };
  const maybeRefreshRuntimeAuthForAuthError = async (errorText, retried) => {
    if (!params.getRuntimeAuthState() || retried) return false;
    if (!isFailoverErrorMessage(errorText, { provider: params.getProvider() })) return false;
    if (classifyFailoverReason(errorText, { provider: params.getProvider() }) !== "auth")
      return false;
    try {
      await refreshRuntimeAuth("auth-error");
      scheduleRuntimeAuthRefresh();
      return true;
    } catch {
      return false;
    }
  };
  return {
    applyAuthProfileCandidate: applyApiKeyInfo,
    advanceAuthProfile,
    initializeAuthProfile,
    maybeRefreshRuntimeAuthForAuthError,
    stopRuntimeAuthRefreshTimer,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.ts
/**
 * Returns the subset of failover reasons that should affect shared auth-profile
 * health. Local helper failures and request-shape/transport outcomes stay
 * session-local so one bad transcript or connection does not cool down an
 * otherwise healthy provider profile.
 */
function resolveAuthProfileFailureReason(params) {
  if (
    params.policy === "local" ||
    !params.failoverReason ||
    (params.policy === "local_transient" &&
      (params.failoverReason === "overloaded" ||
        (params.failoverReason === "rate_limit" && params.transientRateLimit === true))) ||
    params.failoverReason === "server_error" ||
    params.failoverReason === "empty_response" ||
    params.failoverReason === "context_overflow" ||
    params.failoverReason === "format"
  )
    return null;
  if (params.failoverReason === "timeout" && params.providerStarted !== true) return null;
  return params.failoverReason;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-store.ts
function resolveAttemptDispatchApiKey(params) {
  if (params.runtimeAuthState) return;
  return params.apiKeyInfo?.apiKey;
}
function createEmptyAuthProfileStore() {
  return {
    version: 1,
    profiles: {},
  };
}
function createScopedAuthProfileStore(store, profileIds) {
  const profiles = store.profiles ?? {};
  const normalizedProfileIds = (Array.isArray(profileIds) ? profileIds : [profileIds])
    .map((profileId) => profileId?.trim())
    .filter((profileId) => Boolean(profileId));
  const scopedProfiles = Object.fromEntries(
    normalizedProfileIds.flatMap((profileId) => {
      const credential = profiles[profileId];
      return credential ? [[profileId, credential]] : [];
    }),
  );
  const scopedRuntimeExternalProfileIds = (store.runtimeExternalProfileIds ?? []).filter(
    (profileId) => scopedProfiles[profileId],
  );
  const scopedRuntimePersistedProfileIds = (store.runtimePersistedProfileIds ?? []).filter(
    (profileId) => scopedProfiles[profileId],
  );
  return Object.keys(scopedProfiles).length > 0
    ? {
        version: store.version,
        profiles: scopedProfiles,
        ...(scopedRuntimePersistedProfileIds.length > 0
          ? { runtimePersistedProfileIds: scopedRuntimePersistedProfileIds }
          : {}),
        ...(scopedRuntimeExternalProfileIds.length > 0 ||
        store.runtimeExternalProfileIdsAuthoritative === true
          ? { runtimeExternalProfileIds: scopedRuntimeExternalProfileIds }
          : {}),
        ...(store.runtimeExternalProfileIdsAuthoritative === true
          ? { runtimeExternalProfileIdsAuthoritative: true }
          : {}),
      }
    : createEmptyAuthProfileStore();
}
//#endregion
//#region src/agents/embedded-agent-runner/run/backend.ts
/**
 * Dispatches embedded attempts to native harness or OpenClaw backend execution.
 */
/**
 * Backend bridge for executing one embedded-agent attempt through the selected harness.
 */
async function runEmbeddedAttemptWithBackend(params) {
  return runAgentHarnessAttempt(params);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/codex-app-server-recovery.ts
function hasCodexAppServerRecoveryRetryBudget(params) {
  return !params.alreadyRetried && params.runLoopIterations < params.maxRunLoopIterations;
}
/**
 * Decides whether a Codex app-server failure can be retried by replaying the
 * same turn. The retry is intentionally narrow: stdio-only, replay-safe, once
 * per run, and only before any assistant/tool/item side effects escape.
 */
function resolveCodexAppServerRecoveryRetry(params) {
  const failure = params.attempt.codexAppServerFailure;
  if (!failure)
    return {
      retry: false,
      reason: "not_codex_app_server_failure",
    };
  if (
    failure.kind !== "client_closed_before_turn_completed" &&
    failure.kind !== "turn_completion_idle_timeout"
  )
    return {
      retry: false,
      reason: failure.kind,
    };
  if (
    failure.kind === "turn_completion_idle_timeout" &&
    failure.turnWatchTimeoutKind !== "completion"
  )
    return {
      retry: false,
      reason: failure.turnWatchTimeoutKind ?? "unknown_turn_watch_timeout",
    };
  if (failure.transport !== "stdio")
    return {
      retry: false,
      reason: "non_stdio_transport",
    };
  if (!params.retryAvailable)
    return {
      retry: false,
      reason: "retry_exhausted",
    };
  if (!failure.replaySafe || !params.attempt.replayMetadata.replaySafe)
    return {
      retry: false,
      reason: failure.replayBlockedReason ?? "replay_unsafe",
    };
  if (params.attempt.assistantTexts.some((text) => text.trim().length > 0))
    return {
      retry: false,
      reason: "assistant_output",
    };
  if (
    params.attempt.toolMetas.length > 0 ||
    params.attempt.clientToolCalls ||
    params.attempt.lastToolError ||
    params.attempt.didSendDeterministicApprovalPrompt
  )
    return {
      retry: false,
      reason: "tool_activity",
    };
  if (params.attempt.itemLifecycle.startedCount > 0 || params.attempt.itemLifecycle.activeCount > 0)
    return {
      retry: false,
      reason: "active_item",
    };
  return { retry: true };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-observation.ts
/**
 * Logs redacted failover decisions for embedded-agent attempts.
 */
/**
 * Derives timeout failure reasons for logs that were built from timeout state
 * before the normal provider error classifier had a raw error to inspect.
 */
function normalizeFailoverDecisionObservationBase(base) {
  return {
    ...base,
    failoverReason: base.failoverReason ?? (base.timedOut ? "timeout" : null),
    profileFailureReason: base.profileFailureReason ?? (base.timedOut ? "timeout" : null),
  };
}
/**
 * Captures sanitized failover context and returns a decision logger. The closure
 * keeps prompt/assistant failover branches consistent while still allowing the
 * final decision and HTTP status to be supplied at the action point.
 */
function createFailoverDecisionLogger(base) {
  const normalizedBase = normalizeFailoverDecisionObservationBase(base);
  const safeProfileId = normalizedBase.profileId
    ? redactIdentifier(normalizedBase.profileId, { len: 12 })
    : void 0;
  const safeRunId = sanitizeForConsole(normalizedBase.runId) ?? "-";
  const safeProvider = sanitizeForConsole(normalizedBase.provider) ?? "-";
  const safeModel = sanitizeForConsole(normalizedBase.model) ?? "-";
  const safeSourceProvider = sanitizeForConsole(normalizedBase.sourceProvider) ?? safeProvider;
  const safeSourceModel = sanitizeForConsole(normalizedBase.sourceModel) ?? safeModel;
  const profileText = safeProfileId ?? "-";
  const reasonText = normalizedBase.failoverReason ?? "none";
  const sourceChanged = safeSourceProvider !== safeProvider || safeSourceModel !== safeModel;
  return (decision, extra) => {
    const observedError = buildApiErrorObservationFields(normalizedBase.rawError);
    const safeRawErrorPreview = sanitizeForConsole(observedError.rawErrorPreview);
    const rawErrorConsoleSuffix =
      safeRawErrorPreview &&
      !shouldSuppressRawErrorConsoleSuffix(observedError.providerRuntimeFailureKind)
        ? ` rawError=${safeRawErrorPreview}`
        : "";
    log$1.warn("embedded run failover decision", {
      event: "embedded_run_failover_decision",
      tags: ["error_handling", "failover", normalizedBase.stage, decision],
      runId: normalizedBase.runId,
      stage: normalizedBase.stage,
      decision,
      failoverReason: normalizedBase.failoverReason,
      profileFailureReason: normalizedBase.profileFailureReason,
      provider: normalizedBase.provider,
      model: normalizedBase.model,
      sourceProvider: normalizedBase.sourceProvider ?? normalizedBase.provider,
      sourceModel: normalizedBase.sourceModel ?? normalizedBase.model,
      profileId: safeProfileId,
      fallbackConfigured: normalizedBase.fallbackConfigured,
      timedOut: normalizedBase.timedOut,
      aborted: normalizedBase.aborted,
      status: extra?.status,
      ...observedError,
      consoleMessage: `embedded run failover decision: runId=${safeRunId} stage=${normalizedBase.stage} decision=${decision} reason=${reasonText} from=${safeSourceProvider}/${safeSourceModel}${sourceChanged ? ` to=${safeProvider}/${safeModel}` : ""} profile=${profileText}${rawErrorConsoleSuffix}`,
    });
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/fallbacks.ts
/**
 * Resolves whether this embedded run has any model fallback path available.
 * Per-run overrides are authoritative so compaction/replay callers can force
 * either a fallback lane or a no-fallback lane independent of agent defaults.
 */
function hasEmbeddedRunConfiguredModelFallbacks(params) {
  if (params.modelFallbacksOverride !== void 0) return params.modelFallbacksOverride.length > 0;
  return hasConfiguredModelFallbacks({
    cfg: params.cfg,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
}
//#endregion
//#region src/agents/embedded-agent-runner/run/handled-reply.ts
function buildHandledReplyPayloads(reply) {
  const normalized = reply ?? { text: "NO_REPLY" };
  return [
    {
      text: normalized.text,
      mediaUrl: normalized.mediaUrl,
      mediaUrls: normalized.mediaUrls,
      replyToId: normalized.replyToId,
      audioAsVoice: normalized.audioAsVoice,
      isError: normalized.isError,
      isReasoning: normalized.isReasoning,
    },
  ];
}
/** Creates a fresh breaker counter for one embedded run loop. */
function createIdleTimeoutBreakerState() {
  return { consecutiveIdleTimeoutsBeforeOutput: 0 };
}
/**
 * Update the breaker counter from the latest attempt's outcome and report
 * whether the cap is now tripped. Designed to be called from the outer run
 * loop right after an embedded attempt completes.
 *
 * Pure function modulo the mutable `state.consecutiveIdleTimeoutsBeforeOutput`
 * field, so the caller decides where the state lives (typically a `let` in
 * the outer loop).
 *
 * Decision table:
 *   idleTimedOut  completedModelProgress   action
 *   ------------  ----------------------   ------
 *   true          false                    count += 1   (wedged provider candidate)
 *   true          true                     count = 0    (model is alive but slow tail)
 *   false         true                     count = 0    (clean progress, all good)
 *   false         false                    count unchanged (e.g. non-timeout error;
 *                                                          don't poison or reset)
 *
 * The "false / false" branch matters: a non-timeout error attempt with no
 * completed progress should not reset the breaker (it isn't a sign the
 * provider is healthy), but it also shouldn't increment it (the issue at hand
 * is idle timeouts, not arbitrary errors).
 *
 * `outputTokens` is intentionally not part of the reset condition. Some
 * transports can accumulate billed output tokens from partial tool-call
 * argument deltas before the model stalls; those tokens are cost, not completed
 * progress, so they must not keep the breaker disarmed.
 */
function stepIdleTimeoutBreaker(state, input, options) {
  const cap = options?.cap ?? 5;
  if (input.idleTimedOut && !input.completedModelProgress)
    state.consecutiveIdleTimeoutsBeforeOutput += 1;
  else if (input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput = 0;
  return {
    consecutive: state.consecutiveIdleTimeoutsBeforeOutput,
    tripped: cap > 0 && state.consecutiveIdleTimeoutsBeforeOutput >= cap,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/lane-runtime.ts
const EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS = 3e4;
const EMBEDDED_RUN_LANE_HEARTBEAT_MS = EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS / 2;
function resolveEmbeddedRunLaneTimeoutMs(timeoutMs) {
  const defaultLaneTimeoutMs = DEFAULT_AGENT_TIMEOUT_MS + EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs >= 2147e6)
    return defaultLaneTimeoutMs;
  return addTimerTimeoutGraceMs(Math.floor(timeoutMs), 3e4) ?? defaultLaneTimeoutMs;
}
function withEmbeddedRunLaneTimeout(opts, laneTaskTimeoutMs) {
  if (opts?.taskTimeoutMs !== void 0) return opts;
  return {
    ...opts,
    taskTimeoutMs: laneTaskTimeoutMs,
  };
}
function resolveEmbeddedRunSessionQueuePriority(trigger) {
  switch (trigger) {
    case "user":
    case "manual":
      return "foreground";
    case "cron":
    case "heartbeat":
    case "memory":
    case "overflow":
      return "background";
    default:
      return "normal";
  }
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-bootstrap.ts
const NO_REAL_CONVERSATION_MESSAGES_REASON = "no real conversation messages";
function buildContextEngineCompactionSessionTarget(params) {
  const sqliteMarker = parseSqliteSessionFileMarker(params.sessionFile);
  const agentId = params.sessionTarget?.agentId ?? sqliteMarker?.agentId ?? params.agentId;
  const sessionKey = params.sessionTarget?.sessionKey ?? params.sessionKey ?? params.sessionId;
  const storePath =
    params.sessionTarget?.storePath ??
    sqliteMarker?.storePath ??
    resolveStorePath(params.config?.session?.store, { agentId });
  return {
    agentId,
    sessionId: params.sessionTarget?.sessionId ?? sqliteMarker?.sessionId ?? params.sessionId,
    ...(sessionKey ? { sessionKey } : {}),
    ...(storePath ? { storePath } : {}),
    ...(params.sessionTarget?.threadId !== void 0
      ? { threadId: params.sessionTarget.threadId }
      : {}),
  };
}
function isNoRealConversationCompactionNoop(params) {
  return (
    params.ok === true &&
    params.compacted === false &&
    params.reason === NO_REAL_CONVERSATION_MESSAGES_REASON
  );
}
async function resetNoRealConversationTokenSnapshot(params) {
  if (!params.sessionKey) return;
  const storePath = resolveStorePath(params.config?.session?.store, { agentId: params.agentId });
  try {
    await updateSessionEntry(
      {
        storePath,
        sessionKey: params.sessionKey,
      },
      async () => ({
        totalTokens: 0,
        totalTokensFresh: true,
        inputTokens: void 0,
        outputTokens: void 0,
        cacheRead: void 0,
        cacheWrite: void 0,
        contextBudgetStatus: void 0,
        updatedAt: Date.now(),
      }),
      {
        skipMaintenance: true,
        takeCacheOwnership: true,
      },
    );
  } catch (err) {
    log$1.warn(
      `[context-overflow-precheck] failed to reset stale context snapshot for ${params.sessionKey}: ${String(err)}`,
    );
  }
}
/** Best-effort read-only session-key lookup for callers that only provide sessionId. */
function backfillSessionKey(params) {
  const trimmed = normalizeOptionalString(params.sessionKey);
  if (trimmed) return trimmed;
  if (!params.config || !params.sessionId) return;
  try {
    return normalizeOptionalString(
      (normalizeOptionalString(params.agentId)
        ? resolveStoredSessionKeyForSessionId({
            cfg: params.config,
            sessionId: params.sessionId,
            agentId: params.agentId,
          })
        : resolveSessionKeyForRequest({
            cfg: params.config,
            sessionId: params.sessionId,
            clone: false,
          })
      ).sessionKey,
    );
  } catch (err) {
    log$1.warn(
      `[backfillSessionKey] Failed to resolve sessionKey for sessionId=${redactRunIdentifier(sanitizeForLog(params.sessionId))}: ${formatErrorMessage(err)}`,
    );
    return;
  }
}
function assertAgentHarnessRunAdmission(params) {
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!sessionKey) return;
  const admissionAgentId = params.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
  const storePath =
    normalizeOptionalString(params.sessionTarget?.storePath) ??
    resolveStorePath(params.config?.session?.store, { agentId: admissionAgentId });
  const durableEntry = loadSessionEntry({
    ...(admissionAgentId ? { agentId: admissionAgentId } : {}),
    readConsistency: "latest",
    sessionKey,
    storePath,
  });
  const admissionError = resolveAgentHarnessRunAdmissionError({
    agentHarnessId: params.agentHarnessId,
    entry: durableEntry,
    modelSelectionLocked: params.modelSelectionLocked,
    sessionId: params.sessionId,
    sessionKey,
  });
  if (admissionError) throw new Error(admissionError);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/lane-controller.ts
function createEmbeddedRunLaneController(options) {
  const initialParams = options.getParams();
  const sessionQueuePriority = resolveEmbeddedRunSessionQueuePriority(initialParams.trigger);
  const laneTaskTimeoutMs = resolveEmbeddedRunLaneTimeoutMs(initialParams.timeoutMs);
  const laneTaskAbortController = new AbortController();
  const laneTaskReleaseController = new AbortController();
  let laneTaskProgressAtMs = Date.now();
  const noteLaneTaskProgress = () => {
    laneTaskProgressAtMs = Date.now();
  };
  const throwIfAborted = () => {
    const params = options.getParams();
    if (!params.abortSignal?.aborted) return;
    const reason = params.abortSignal.reason;
    if (reason instanceof Error) throw reason;
    const abortError =
      reason !== void 0
        ? new Error("Operation aborted", { cause: reason })
        : /* @__PURE__ */ new Error("Operation aborted");
    abortError.name = "AbortError";
    throw abortError;
  };
  const withLaneTimeout = (opts) =>
    withEmbeddedRunLaneTimeout(
      {
        ...opts,
        taskTimeoutProgressAtMs: () => laneTaskProgressAtMs,
        taskTimeoutAbortSignal: laneTaskAbortController.signal,
        taskTimeoutAbortGraceMs: EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS,
        taskTimeoutReleaseSignal: laneTaskReleaseController.signal,
      },
      laneTaskTimeoutMs,
    );
  const withRunLaneWait = (opts) => {
    const params = options.getParams();
    if (!opts?.onWait && !params.onLaneWait) return opts;
    return {
      ...opts,
      onWait: (waitMs, queuedAhead) => {
        opts?.onWait?.(waitMs, queuedAhead);
        options.getParams().onLaneWait?.({
          waitMs,
          queuedAhead,
          waiting: true,
        });
      },
    };
  };
  const noteLaneWaitIfBusy = (lane) => {
    const params = options.getParams();
    if (!params.onLaneWait) return;
    const snapshot = getCommandLaneSnapshot(lane);
    if (snapshot.queuedCount > 0 || snapshot.activeCount >= snapshot.maxConcurrent)
      params.onLaneWait({
        waitMs: 0,
        queuedAhead: snapshot.queuedCount + snapshot.activeCount,
        waiting: true,
      });
  };
  const enqueueGlobal = (task, opts) => {
    const globalOpts = {
      ...opts,
      priority: sessionQueuePriority,
    };
    const taskWithCurrentLifecycle = async () => {
      let params = options.getParams();
      params.onLaneWait?.({
        waitMs: 0,
        queuedAhead: 0,
        waiting: false,
      });
      throwIfAborted();
      let lifecycleGeneration = options.getLifecycleGeneration();
      const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
      const existingContext = getAgentRunContext(params.runId);
      if (lifecycleGeneration !== currentLifecycleGeneration) {
        const wasQueuedBeforeRotation =
          options.initialQueuedLifecycleGeneration === lifecycleGeneration;
        const canResumeAcrossRotation = sessionQueuePriority === "foreground";
        const newerSameIdExecutionOwnsContext =
          existingContext?.lifecycleGeneration === currentLifecycleGeneration;
        if (!wasQueuedBeforeRotation || !canResumeAcrossRotation || newerSameIdExecutionOwnsContext)
          assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
        lifecycleGeneration = currentLifecycleGeneration;
        options.setLifecycleGeneration(lifecycleGeneration);
        params = {
          ...params,
          lifecycleGeneration,
        };
        options.setParams(params);
      }
      assertAgentHarnessRunAdmission(params);
      return await withAgentRunLifecycleGeneration(lifecycleGeneration, () =>
        withSessionPlacementTurnAdmission(
          {
            sessionId: params.sessionId,
            ...(params.agentId ? { agentId: params.agentId } : {}),
            ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
            runId: params.runId,
          },
          params,
          () => {
            claimAgentRunContext(params.runId, {
              ...existingContext,
              sessionKey: params.sessionKey ?? existingContext?.sessionKey,
              sessionId: params.sessionId ?? existingContext?.sessionId,
              lifecycleGeneration,
            });
            return task();
          },
        ),
      );
    };
    const params = options.getParams();
    if (params.enqueue)
      return params.enqueue(taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
    noteLaneWaitIfBusy(options.globalLane);
    return enqueueCommandInLane(
      options.globalLane,
      taskWithCurrentLifecycle,
      withLaneTimeout(withRunLaneWait(globalOpts)),
    );
  };
  const enqueueSession = (task, opts) => {
    const sessionOpts = {
      ...opts,
      priority: sessionQueuePriority,
    };
    const taskWithLaneAdmission = () => {
      options.getParams().onLaneWait?.({
        waitMs: 0,
        queuedAhead: 0,
        waiting: false,
      });
      return task();
    };
    const params = options.getParams();
    if (params.enqueue) return params.enqueue(taskWithLaneAdmission, withRunLaneWait(sessionOpts));
    noteLaneWaitIfBusy(options.sessionLane);
    return enqueueCommandInLane(
      options.sessionLane,
      taskWithLaneAdmission,
      withRunLaneWait(sessionOpts),
    );
  };
  return {
    enqueueGlobal,
    enqueueSession,
    laneTaskAbortController,
    laneTaskReleaseController,
    noteLaneTaskProgress,
    throwIfAborted,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/progress-controller.ts
function createEmbeddedRunProgressController(params) {
  const fastModeStartedAtMs = params.attempt.fastModeStartedAtMs ?? params.startedAtMs;
  const fastModeAutoOnSeconds = params.attempt.fastModeAutoOnSeconds ?? 60;
  const fastModeAutoProgressState = params.attempt.fastModeAutoProgressState ?? {
    offAnnounced: false,
    resetAnnounced: false,
  };
  const notifyExecutionPhase = (phase, extra) => {
    params.noteLaneTaskProgress();
    params.attempt.onExecutionPhase?.({
      phase,
      ...extra,
    });
  };
  const notifyRunProgress = (info) => {
    params.noteLaneTaskProgress();
    params.attempt.onRunProgress?.(info);
  };
  const emitFastModeAutoProgress = async (payload) => {
    const summary = formatFastModeAutoProgressText(payload);
    try {
      emitAgentItemEvent({
        runId: params.attempt.runId,
        ...(params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {}),
        data: {
          itemId: `fast-mode-auto:${payload.enabled ? "on" : "off"}`,
          kind: "status",
          title: "Fast",
          phase: "update",
          status: "running",
          summary,
        },
      });
    } catch (error) {
      log$1.debug(`embedded run fast mode auto global event failed: ${formatErrorMessage(error)}`);
    }
    try {
      await params.attempt.onAgentEvent?.({
        stream: "item",
        data: {
          kind: "status",
          title: "Fast",
          phase: "update",
          summary,
        },
        ...(params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {}),
      });
    } catch (error) {
      log$1.debug(`embedded run fast mode auto event failed: ${formatErrorMessage(error)}`);
    }
    try {
      await params.attempt.onToolResult?.({
        text: summary,
        channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND },
      });
    } catch (error) {
      log$1.debug(`embedded run fast mode auto progress failed: ${formatErrorMessage(error)}`);
    }
  };
  const maybeAnnounceFastModeAutoOff = async () => {
    if (params.attempt.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
    const next = resolveFastModeForElapsed({
      mode: "auto",
      startedAtMs: fastModeStartedAtMs,
      fastAutoOnSeconds: fastModeAutoOnSeconds,
    });
    if (next.enabled) return;
    fastModeAutoProgressState.offAnnounced = true;
    await emitFastModeAutoProgress(next);
  };
  const notifyToolResult = async (payload) => {
    await params.attempt.onToolResult?.(payload);
  };
  const notifyAgentEvent = async (event) => {
    await params.attempt.onAgentEvent?.(event);
  };
  const resolveAttemptFastMode = () => {
    const resolved = resolveFastModeForElapsed({
      mode: params.attempt.fastMode,
      startedAtMs: fastModeStartedAtMs,
      fastAutoOnSeconds: fastModeAutoOnSeconds,
    });
    return resolved.mode === void 0 ? void 0 : resolved.enabled;
  };
  const resolveAttemptFastModeParam = () => {
    if (params.attempt.fastMode === "auto") return resolveAttemptFastMode;
    return resolveAttemptFastMode();
  };
  const maybeEmitFastModeAutoReset = async () => {
    if (
      params.attempt.fastMode !== "auto" ||
      !fastModeAutoProgressState.offAnnounced ||
      fastModeAutoProgressState.resetAnnounced
    )
      return;
    fastModeAutoProgressState.resetAnnounced = true;
    await emitFastModeAutoProgress({
      enabled: true,
      elapsedSeconds: 0,
      fastAutoOnSeconds: fastModeAutoOnSeconds,
    });
  };
  const maybeEmitFastModeAutoResetBestEffort = async () => {
    try {
      await maybeEmitFastModeAutoReset();
    } catch (error) {
      log$1.warn(`embedded run fast mode auto reset progress failed: ${formatErrorMessage(error)}`);
    }
  };
  return {
    fastModeAutoOnSeconds,
    fastModeAutoProgressState,
    fastModeStartedAtMs,
    maybeAnnounceFastModeAutoOff,
    maybeEmitFastModeAutoResetBestEffort,
    notifyAgentEvent,
    notifyExecutionPhase,
    notifyRunProgress,
    notifyToolResult,
    resolveAttemptFastModeParam,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/retry-limit.ts
/**
 * Converts retry-limit exhaustion into failover errors or terminal replies.
 */
/**
 * Converts retry-limit exhaustion into either a failover escalation or a local
 * user-visible error payload. Replay-safe provider failures throw FailoverError
 * so the outer run loop can switch models; non-escalating reasons preserve
 * retry metadata on the returned run result.
 */
function handleRetryLimitExhaustion(params) {
  if (params.decision.action === "fallback_model")
    throw new FailoverError(params.message, {
      reason: params.decision.reason,
      provider: params.provider,
      model: params.model,
      profileId: params.profileId,
      status: resolveFailoverStatus(params.decision.reason),
    });
  return {
    payloads: [
      {
        text: "Request failed after repeated internal retries. Please try again, or use /new to start a fresh session.",
        isError: true,
      },
    ],
    meta: {
      durationMs: params.durationMs,
      agentMeta: params.agentMeta,
      ...(params.replayInvalid ? { replayInvalid: true } : {}),
      ...(params.livenessState ? { livenessState: params.livenessState } : {}),
      error: {
        kind: "retry_limit",
        message: params.message,
      },
    },
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-attempt-result.ts
function normalizeEmbeddedRunAttemptResult(attempt) {
  const raw = attempt;
  return {
    ...attempt,
    assistantTexts: raw.assistantTexts ?? [],
    toolMetas: raw.toolMetas ?? [],
    acceptedSessionSpawns: raw.acceptedSessionSpawns ?? [],
    messagesSnapshot: raw.messagesSnapshot ?? [],
    messagingToolSentTexts: raw.messagingToolSentTexts ?? [],
    messagingToolSentMediaUrls: raw.messagingToolSentMediaUrls ?? [],
    messagingToolSentTargets: raw.messagingToolSentTargets ?? [],
    messagingToolSourceReplyPayloads: raw.messagingToolSourceReplyPayloads ?? [],
    didDeliverSourceReplyViaMessageTool: raw.didDeliverSourceReplyViaMessageTool === true,
    itemLifecycle: raw.itemLifecycle ?? {
      startedCount: 0,
      completedCount: 0,
      activeCount: 0,
    },
    replayMetadata: resolveAttemptReplayMetadata(raw),
    currentAttemptReplayMetadata: raw.currentAttemptReplayMetadata ?? void 0,
  };
}
function hasCompletedModelProgressForIdleBreaker(attempt) {
  return (
    attempt.assistantTexts.some((text) => text.trim().length > 0) ||
    attempt.toolMetas.length > 0 ||
    (attempt.clientToolCalls?.length ?? 0) > 0 ||
    hasOutboundDeliveryEvidence(attempt) ||
    attempt.itemLifecycle.completedCount > 0
  );
}
function buildTraceToolSummary(params) {
  if (!params.toolMetas?.length) return;
  const tools = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of params.toolMetas) {
    const toolName = normalizeOptionalString(entry.toolName);
    if (!toolName || seen.has(toolName)) continue;
    seen.add(toolName);
    tools.push(toolName);
  }
  const failedToolCalls = params.toolMetas.filter((entry) => entry.isError === true).length;
  return {
    calls: params.toolMetas.length,
    tools,
    failures: failedToolCalls || Number(params.fallbackHadFailure),
  };
}
const OPENAI_RESPONSES_API = "openai-responses";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function normalizeRuntimeId(value) {
  return value?.trim().toLowerCase() ?? "";
}
function resolveAttemptTrajectoryAttribution(params) {
  const authProfileProvider = normalizeRuntimeId(
    params.runtimePlan.auth?.authProfileProviderForAuth,
  );
  if (
    normalizeRuntimeId(params.runtimePlan.observability?.harnessId) === "codex" &&
    authProfileProvider !== "openai" &&
    normalizeRuntimeId(params.model.provider) === "openai" &&
    normalizeRuntimeId(params.model.api) === OPENAI_RESPONSES_API
  )
    return {
      modelApi: OPENAI_CODEX_RESPONSES_API,
      modelId: params.modelId,
      provider: OPENAI_PROVIDER_ID,
    };
  return {
    ...(params.model.api ? { modelApi: params.model.api } : {}),
    modelId: params.modelId,
    provider: params.provider,
  };
}
function resolveInitialThinkLevel(params) {
  if (params.requested) return params.requested;
  return resolveThinkingDefault({
    cfg: params.config ?? {},
    provider: params.provider,
    model: params.modelId,
    catalog: [
      {
        provider: params.provider,
        id: params.modelId,
        name: params.modelId,
        reasoning: params.model.reasoning,
      },
    ],
  });
}
/** Marks only request parameters that OpenClaw applies to provider egress. */
function resolveRequestStreamTransportOverrides(streamParams) {
  return streamParams && Object.keys(streamParams).length > 0 ? "present" : void 0;
}
function resolveInitialEmbeddedRunModel(params) {
  const cfg = params.config ?? {};
  const configuredDefault = resolveDefaultModelForAgent({
    cfg,
    agentId: params.agentId,
  });
  const explicitProvider = normalizeOptionalString(params.provider);
  const explicitModel = normalizeOptionalString(params.model);
  const defaultProvider = configuredDefault.provider || "openai";
  if (explicitProvider && explicitModel)
    return {
      provider: explicitProvider,
      modelId: explicitModel,
    };
  if (explicitModel) {
    const provider = explicitProvider ?? defaultProvider;
    const resolved = resolveModelRefFromString({
      cfg,
      raw: explicitModel,
      defaultProvider: provider,
      aliasIndex: buildModelAliasIndex({
        cfg,
        defaultProvider: provider,
      }),
    });
    return {
      provider: explicitProvider ?? resolved?.ref.provider ?? provider,
      modelId: resolved?.ref.model ?? explicitModel,
    };
  }
  return {
    provider: explicitProvider ?? defaultProvider,
    modelId: configuredDefault.model || "gpt-5.6-sol",
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/skill-workshop-attempt-params.ts
function resolveSkillWorkshopAttemptParams(params) {
  return {
    skillWorkshopProposalOnly: params.skillWorkshopProposalOnly,
    skillWorkshopProposalEnv: params.skillWorkshopProposalEnv,
    skillWorkshopOrigin: params.skillWorkshopOrigin,
    skillWorkshopProposalMutationBudget: params.skillWorkshopProposalMutationBudget,
    skillWorkshopProposalReviewCompletion: params.skillWorkshopProposalReviewCompletion,
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-outcome.ts
function hasRestartAbortReason(value) {
  let candidate = value;
  for (let depth = 0; depth < 3; depth += 1) {
    if (isAgentRunRestartAbortReason(candidate)) return true;
    if (!(candidate instanceof Error)) return false;
    try {
      if (candidate.cause === void 0) return false;
      candidate = candidate.cause;
    } catch {
      return false;
    }
  }
  return false;
}
/** Projects private attempt metadata into the canonical agent terminal outcome. */
function resolveEmbeddedRunAttemptTerminalOutcome(params) {
  const { attempt } = params;
  const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
  const attemptTimedOut = attempt.timedOut || attempt.idleTimedOut;
  const timedOut = attemptTimedOut || abortFields.stopReason === "timeout";
  const timedOutDuringPrompt =
    attemptTimedOut &&
    !attempt.timedOutDuringCompaction &&
    attempt.timedOutDuringToolExecution !== true;
  const timeoutPhase =
    attempt.promptTimeoutOutcome?.timeoutPhase ?? (timedOutDuringPrompt ? "provider" : void 0);
  const providerStarted =
    attempt.promptTimeoutOutcome?.providerStarted ?? (timedOutDuringPrompt ? true : void 0);
  const restartAborted = hasRestartAbortReason(attempt.promptError);
  const assistantStopReason = attempt.promptError ? void 0 : params.assistant?.stopReason;
  const stopReason =
    attemptTimedOut && timeoutPhase === void 0 && providerStarted !== true
      ? void 0
      : (abortFields.stopReason ??
        (restartAborted ? "restart" : void 0) ??
        (!timedOut && attempt.aborted ? "aborted" : void 0) ??
        (!timedOut ? assistantStopReason : void 0));
  return buildAgentRunTerminalOutcome({
    status: timedOut
      ? "timeout"
      : abortFields.aborted ||
          attempt.aborted ||
          attempt.promptError ||
          assistantStopReason === "error"
        ? "error"
        : "ok",
    error: attempt.promptError ?? params.assistant?.errorMessage,
    stopReason,
    livenessState: attempt.promptTimeoutOutcome?.livenessState,
    timeoutPhase,
    providerStarted,
  });
}
function isEmbeddedRunTerminalTimeout(outcome) {
  return outcome.reason === "hard_timeout" || outcome.reason === "timed_out";
}
function isEmbeddedRunTerminalAbort(outcome) {
  return outcome.reason === "aborted" || outcome.reason === "cancelled";
}
function isEmbeddedRunTerminalInterrupted(outcome) {
  return isEmbeddedRunTerminalTimeout(outcome) || isEmbeddedRunTerminalAbort(outcome);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-media-payloads.ts
/**
 * Merges media emitted by tools into the channel payloads produced by the
 * assistant turn. The first non-reasoning reply owns the media so text and
 * attachments stay together; metadata is preserved for delivery bookkeeping.
 */
function mergeAttemptToolMediaPayloads(params) {
  const mediaUrls = Array.from(
    new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []),
  );
  if (mediaUrls.length === 0 && !params.toolAudioAsVoice && !params.toolTrustedLocalMedia)
    return params.payloads;
  const payloads = params.payloads?.length ? [...params.payloads] : [];
  const payloadIndex = payloads.findIndex((payload) => !payload.isReasoning);
  if (payloadIndex >= 0) {
    const payload = payloads.at(payloadIndex);
    if (!payload) return payloads;
    if (
      params.sourceReplyDeliveryMode === "message_tool_only" &&
      getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror
    )
      return payloads;
    const mergedMediaUrls = Array.from(
      /* @__PURE__ */ new Set([...(payload.mediaUrls ?? []), ...mediaUrls]),
    );
    payloads[payloadIndex] = copyReplyPayloadMetadata(payload, {
      ...payload,
      mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : void 0,
      mediaUrl: payload.mediaUrl ?? mergedMediaUrls[0],
      audioAsVoice: payload.audioAsVoice || params.toolAudioAsVoice || void 0,
      trustedLocalMedia: payload.trustedLocalMedia || params.toolTrustedLocalMedia || void 0,
    });
    return payloads;
  }
  return [
    ...payloads,
    {
      mediaUrls: mediaUrls.length ? mediaUrls : void 0,
      mediaUrl: mediaUrls[0],
      audioAsVoice: params.toolAudioAsVoice || void 0,
      trustedLocalMedia: params.toolTrustedLocalMedia || void 0,
    },
  ];
}
//#endregion
//#region src/agents/embedded-agent-runner/run.ts
/**
 * Top-level embedded-agent run orchestration entrypoint.
 */
const MAX_SAME_MODEL_IDLE_TIMEOUT_RETRIES = 1;
const MID_TURN_PRECHECK_CONTINUATION_PROMPT =
  "Continue from the current transcript after the latest tool result. Do not repeat the original user request, and do not rerun completed tools unless the transcript shows they are still needed.";
const COMPACTION_CONTINUATION_RETRY_INSTRUCTION =
  "The previous attempt compacted the conversation context before producing a final user-visible answer. Continue from the compacted transcript and produce the final answer now. Do not restart from scratch, do not repeat completed work, and do not rerun tools unless the transcript clearly lacks required evidence.";
const BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX =
  "Before accepting the previous final answer, apply this revision request and produce the revised final answer. Do not repeat completed work or rerun tools unless the request explicitly requires it.";
const MAX_BEFORE_AGENT_FINALIZE_REVISIONS = 3;
function buildBeforeAgentFinalizeRetryPrompt(reason) {
  return `${BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX}\n\n${reason}`;
}
const POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS = 1e3;
function runEmbeddedAgent(paramsInput) {
  const internalParamsInput = paramsInput;
  const requestedProvider = normalizeOptionalString(internalParamsInput.provider);
  const requestedModel = normalizeOptionalString(internalParamsInput.model);
  const needsConfiguredDefault =
    !internalParamsInput.config && !requestedProvider && !requestedModel;
  const config =
    internalParamsInput.config ??
    (needsConfiguredDefault ? (getRuntimeConfigSnapshot() ?? void 0) : void 0);
  const lifecycleGeneration =
    internalParamsInput.lifecycleGeneration ??
    captureAgentRunLifecycleGeneration(internalParamsInput.runId);
  return withAgentRunLifecycleGeneration(lifecycleGeneration, () =>
    runEmbeddedAgentInternal({
      ...internalParamsInput,
      config,
      lifecycleGeneration,
    }),
  );
}
async function runEmbeddedAgentInternal(paramsInput) {
  const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
  const skillWorkshopProposalMutationBudget = paramsBase.skillWorkshopProposalOnly
    ? (paramsBase.skillWorkshopProposalMutationBudget ?? { remaining: 1 })
    : void 0;
  let lifecycleGeneration = paramsBase.lifecycleGeneration;
  const queuedLifecycleGeneration = getAgentEventLifecycleGeneration();
  const effectiveSessionKey = backfillSessionKey({
    config: paramsBase.config,
    sessionId: paramsBase.sessionId,
    sessionKey: paramsBase.sessionKey,
    agentId: paramsBase.agentId,
  });
  assertAgentHarnessRunAdmission({
    ...paramsBase,
    sessionKey: effectiveSessionKey,
  });
  const runSessionTarget = await resolveAgentRunSessionTarget({
    ...paramsBase,
    sessionKey: effectiveSessionKey,
  });
  let params = {
    ...paramsBase,
    agentId: paramsBase.agentId ?? runSessionTarget.agentId,
    sessionId: runSessionTarget.sessionId,
    sessionKey: normalizeOptionalString(effectiveSessionKey ?? runSessionTarget.sessionKey),
    sessionFile: runSessionTarget.sessionFile,
    skillWorkshopProposalMutationBudget,
  };
  const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
  const globalLane = resolveGlobalLane(params.lane);
  const failureSuspension = resolveSessionSuspensionTarget();
  const suspendForFailure = (suspensionParams) => {
    const suspension = {
      ...suspensionParams,
      laneId: globalLane,
    };
    if (failureSuspension.mode === "defer") {
      failureSuspension.defer(suspension);
      return;
    }
    suspendSession(suspension);
  };
  const {
    enqueueGlobal,
    enqueueSession,
    laneTaskAbortController,
    laneTaskReleaseController,
    noteLaneTaskProgress,
    throwIfAborted,
  } = createEmbeddedRunLaneController({
    getLifecycleGeneration: () => lifecycleGeneration,
    getParams: () => params,
    globalLane,
    initialQueuedLifecycleGeneration: queuedLifecycleGeneration,
    sessionLane,
    setLifecycleGeneration: (generation) => {
      lifecycleGeneration = generation;
    },
    setParams: (nextParams) => {
      params = nextParams;
    },
  });
  const channelHint = params.messageChannel ?? params.messageProvider;
  const resolvedToolResultFormat =
    params.toolResultFormat ??
    (channelHint
      ? isMarkdownCapableMessageChannel(channelHint)
        ? "markdown"
        : "plain"
      : "markdown");
  const isProbeSession = params.sessionId?.startsWith("probe-") ?? false;
  throwIfAborted();
  return enqueueSession(async () => {
    throwIfAborted();
    params.replyOperation?.markWaitingForDeferredMaintenance();
    try {
      await waitForDeferredTurnMaintenanceForSession(params.sessionKey);
    } finally {
      params.replyOperation?.markDeferredMaintenanceWaitEnded();
    }
    throwIfAborted();
    return enqueueGlobal(async () => {
      throwIfAborted();
      const started = Date.now();
      const startupStages = createEmbeddedRunStageTracker();
      let startupStagesEmitted = false;
      const {
        fastModeAutoOnSeconds,
        fastModeAutoProgressState,
        fastModeStartedAtMs: fastModeStarted,
        maybeAnnounceFastModeAutoOff,
        maybeEmitFastModeAutoResetBestEffort,
        notifyAgentEvent,
        notifyExecutionPhase,
        notifyRunProgress,
        notifyToolResult,
        resolveAttemptFastModeParam,
      } = createEmbeddedRunProgressController({
        attempt: params,
        noteLaneTaskProgress,
        startedAtMs: started,
      });
      const emitStartupStageSummary = (phase) => {
        const summary = startupStages.snapshot();
        const shouldWarn = shouldWarnEmbeddedRunStageSummary(summary);
        if (!shouldWarn && !log$1.isEnabled("trace")) return;
        const message = formatEmbeddedRunStageSummary(
          `[trace:embedded-run] startup stages: runId=${params.runId} sessionId=${params.sessionId} phase=${phase}`,
          summary,
        );
        if (shouldWarn) log$1.warn(message);
        else log$1.trace(message);
      };
      params.onExecutionStarted?.({ lifecycleGeneration });
      notifyExecutionPhase("runner_entered");
      const workspaceResolution = resolveRunWorkspaceDir({
        workspaceDir: params.workspaceDir,
        sessionKey: params.sessionKey,
        agentId: params.agentId,
        config: params.config,
      });
      const resolvedWorkspace = workspaceResolution.workspaceDir;
      const isCanonicalWorkspace =
        resolveUserPath(
          resolveAgentWorkspaceDir(params.config ?? {}, workspaceResolution.agentId),
        ) === resolvedWorkspace;
      const redactedSessionId = redactRunIdentifier(params.sessionId);
      const redactedSessionKey = redactRunIdentifier(params.sessionKey);
      const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
      if (workspaceResolution.usedFallback)
        log$1.warn(
          `[workspace-fallback] caller=runEmbeddedAgent reason=${workspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${workspaceResolution.agentId} workspace=${redactedWorkspace}`,
        );
      startupStages.mark("workspace");
      notifyExecutionPhase("workspace");
      ensureRuntimePluginsLoaded({
        config: params.config,
        workspaceDir: resolvedWorkspace,
        allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
      });
      startupStages.mark("runtime-plugins");
      notifyExecutionPhase("runtime_plugins");
      let { provider, modelId } = resolveInitialEmbeddedRunModel({
        config: params.config,
        agentId: workspaceResolution.agentId,
        provider: params.provider,
        model: params.model,
      });
      const agentDir =
        params.agentDir ?? resolveAgentDir(params.config ?? {}, workspaceResolution.agentId);
      const normalizedSessionKey = params.sessionKey?.trim();
      const fallbackConfigured = hasEmbeddedRunConfiguredModelFallbacks({
        cfg: params.config,
        agentId: params.agentId,
        sessionKey: normalizedSessionKey,
        modelFallbacksOverride: params.modelFallbacksOverride,
      });
      const resolvedSessionKey =
        normalizedSessionKey ?? params.sessionTarget?.sessionKey ?? params.sessionId;
      const hookRunner = getGlobalHookRunner();
      const hookCtx = {
        runId: params.runId,
        jobId: params.jobId,
        agentId: workspaceResolution.agentId,
        sessionKey: resolvedSessionKey,
        sessionId: params.sessionId,
        workspaceDir: resolvedWorkspace,
        modelProviderId: provider,
        modelId,
        trigger: params.trigger,
        ...buildAgentHookContextChannelFields(params),
      };
      if (params.trigger === "cron" && hookRunner?.hasHooks("before_agent_reply")) {
        notifyExecutionPhase("before_agent_reply", {
          provider,
          model: modelId,
        });
        const hookResult = await hookRunner.runBeforeAgentReply(
          { cleanedBody: params.prompt },
          hookCtx,
        );
        if (hookResult?.handled)
          return {
            payloads: buildHandledReplyPayloads(hookResult.reply),
            meta: {
              durationMs: Date.now() - started,
              agentMeta: {
                sessionId: params.sessionId,
                provider,
                model: modelId,
              },
              finalAssistantVisibleText: hookResult.reply?.text ?? "NO_REPLY",
              finalAssistantRawText: hookResult.reply?.text ?? "NO_REPLY",
            },
          };
        notifyExecutionPhase("runtime_plugins", {
          provider,
          model: modelId,
        });
      }
      const hookSelection = await resolveHookModelSelection({
        prompt: params.prompt,
        attachments: buildBeforeModelResolveAttachments(params.images),
        provider,
        modelId,
        modelSelectionLocked: params.modelSelectionLocked,
        hookRunner,
        hookContext: hookCtx,
      });
      const modelSelectionChangedByHook =
        hookSelection.provider !== provider || hookSelection.modelId !== modelId;
      provider = hookSelection.provider;
      modelId = hookSelection.modelId;
      const requestedModelId = modelId;
      const beforeAgentStartResult = hookSelection.beforeAgentStartResult;
      const requestStreamTransportOverrides = resolveRequestStreamTransportOverrides(
        params.streamParams,
      );
      startupStages.mark("hooks");
      await ensureSelectedAgentHarnessPlugin({
        provider,
        modelId,
        config: params.config,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        agentHarnessId: params.agentHarnessId,
        agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
        requestTransportOverrides: requestStreamTransportOverrides,
        workspaceDir: resolvedWorkspace,
      });
      let agentHarness = selectAgentHarness({
        provider,
        modelId,
        ...(requestStreamTransportOverrides
          ? { modelProvider: { requestTransportOverrides: requestStreamTransportOverrides } }
          : {}),
        config: params.config,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        agentHarnessId: params.agentHarnessId,
        agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
      });
      let pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
      const expectedHarnessArtifact = params.expectedAgentHarnessRuntimeArtifact;
      if (expectedHarnessArtifact && expectedHarnessArtifact.harnessId !== agentHarness.id)
        throw new Error(
          `Verified inference requires agent harness ${expectedHarnessArtifact.harnessId}, but ${agentHarness.id} was selected.`,
        );
      if (expectedHarnessArtifact && !agentHarness.runtimeArtifact)
        throw new Error(
          `Agent harness ${agentHarness.id} cannot attest the verified inference runtime artifact.`,
        );
      const nativeModelOwnedHarnessId = resolveNativeModelOwnedHarnessId({
        agentHarnessId: params.agentHarnessId,
        modelSelectionLocked: params.modelSelectionLocked,
        selectedHarnessId: agentHarness.id,
      });
      const nativeModelOwned = nativeModelOwnedHarnessId !== void 0;
      const modelConfigProvider = provider;
      let resolvedModelProvider = provider;
      let firstModelResolution;
      let modelResolution;
      if (nativeModelOwned)
        modelResolution = {
          model: createNativeModelOwnedRuntimeModel({
            provider,
            modelId,
          }),
          ...createEmptyAgentDiscoveryStores(),
        };
      else {
        const selectedRuntimeProvider = resolveSelectedOpenAIRuntimeProvider({
          provider,
          harnessRuntime: agentHarness.id,
          agentHarnessId: agentHarness.id,
          authProfileProvider: params.authProfileId?.split(":", 1)[0],
          authProfileId: params.authProfileId,
          config: params.config,
          workspaceDir: resolvedWorkspace,
        });
        const modelResolutionProviders =
          selectedRuntimeProvider !== provider ? [selectedRuntimeProvider, provider] : [provider];
        for (const candidateProvider of modelResolutionProviders) {
          const candidateResolution = await resolveModelAsync(
            candidateProvider,
            modelId,
            agentDir,
            params.config,
            {
              skipAgentDiscovery: true,
              allowBundledStaticCatalogFallback: pluginHarnessOwnsTransport,
              preferBundledStaticCatalogTransport: pluginHarnessOwnsTransport,
              workspaceDir: resolvedWorkspace,
              authProfileId: params.authProfileId,
            },
          );
          firstModelResolution ??= candidateResolution;
          if (candidateResolution.model) {
            resolvedModelProvider = candidateProvider;
            modelResolution = candidateResolution;
            break;
          }
        }
        if (!modelResolution && pluginHarnessOwnsTransport)
          modelResolution ??= firstModelResolution;
        if (!modelResolution) {
          await ensureOpenClawModelsJson(params.config, agentDir, {
            workspaceDir: resolvedWorkspace,
          });
          for (const candidateProvider of modelResolutionProviders) {
            const candidateResolution = await resolveModelAsync(
              candidateProvider,
              modelId,
              agentDir,
              params.config,
              {
                workspaceDir: resolvedWorkspace,
                authProfileId: params.authProfileId,
                allowBundledStaticCatalogFallback: true,
              },
            );
            firstModelResolution ??= candidateResolution;
            if (candidateResolution.model) {
              resolvedModelProvider = candidateProvider;
              modelResolution = candidateResolution;
              break;
            }
          }
        }
        modelResolution ??= firstModelResolution;
      }
      if (!modelResolution)
        throw new FailoverError(`Unknown model: ${provider}/${modelId}`, {
          reason: "model_not_found",
          provider,
          model: modelId,
          sessionId: params.sessionId,
          lane: globalLane,
        });
      provider = resolvedModelProvider;
      const { model, error, authStorage, modelRegistry } = modelResolution;
      if (!model)
        throw new FailoverError(error ?? `Unknown model: ${provider}/${modelId}`, {
          reason: "model_not_found",
          provider,
          model: modelId,
          sessionId: params.sessionId,
          lane: globalLane,
        });
      let runtimeModel = model;
      const resolveEffectiveModel = (candidate) =>
        resolveEmbeddedRuntimeModelPolicy({
          cfg: params.config,
          provider,
          contextConfigProvider: resolveContextConfigProviderForRuntime({
            provider: modelConfigProvider,
            runtimeId: agentHarness.id,
            config: params.config,
          }),
          modelId,
          runtimeModel: candidate,
          nativeModelOwned,
        });
      const initialResolvedRuntimeModel = resolveEffectiveModel(runtimeModel);
      let contextTokenBudget = initialResolvedRuntimeModel.contextTokenBudget;
      let contextWindowInfo = initialResolvedRuntimeModel.contextWindowInfo;
      let outerContextTokenMeta =
        contextTokenBudget === void 0 ? {} : { contextTokens: contextTokenBudget };
      let effectiveModel = initialResolvedRuntimeModel.effectiveModel;
      const applyResolvedRuntimeModel = (
        candidate,
        resolved = resolveEffectiveModel(candidate),
      ) => {
        runtimeModel = candidate;
        effectiveModel = resolved.effectiveModel;
        contextTokenBudget = resolved.contextTokenBudget;
        contextWindowInfo = resolved.contextWindowInfo;
        outerContextTokenMeta =
          contextTokenBudget === void 0 ? {} : { contextTokens: contextTokenBudget };
      };
      const buildHarnessModelProvider = (candidate, plan, preparedAuthAttempt) => {
        const route = plan?.modelRoute;
        const routeSupport = resolveAgentHarnessPreparedRouteSupport(plan);
        const requestTransportOverrides =
          requestStreamTransportOverrides ?? routeSupport.requestTransportOverrides;
        return {
          api: route?.api ?? candidate.api,
          baseUrl: route?.baseUrl ?? candidate.baseUrl,
          ...(requestTransportOverrides ? { requestTransportOverrides } : {}),
          ...(routeSupport.runtimePolicy ? { runtimePolicy: routeSupport.runtimePolicy } : {}),
          ...(plan
            ? {
                preparedAuth: resolveAgentHarnessPreparedAuthSupport({
                  plan,
                  ...(preparedAuthAttempt?.kind === "profile" ||
                  preparedAuthAttempt?.kind === "direct"
                    ? { source: preparedAuthAttempt.kind }
                    : {}),
                }),
              }
            : {}),
        };
      };
      const selectHarnessForModel = (candidate, plan, preparedAuthAttempt) => {
        const selected = selectAgentHarness({
          provider,
          modelId,
          modelProvider: buildHarnessModelProvider(candidate, plan, preparedAuthAttempt),
          config: params.config,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          agentHarnessId: params.agentHarnessId,
          agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
        });
        if (nativeModelOwnedHarnessId && selected.id !== nativeModelOwnedHarnessId)
          throw new Error(
            `Prepared model route changed the session-pinned agent harness from "${nativeModelOwnedHarnessId}" to "${selected.id}".`,
          );
        return selected;
      };
      const selectHarnessForPreparedAttempts = (candidate, attempts) => {
        const selected = selectAgentHarnessForPreparedModelProviders({
          provider,
          modelId,
          modelProviders: attempts.map((attempt) => {
            const route = attempt.plan.modelRoute;
            const attemptModel = route
              ? {
                  ...candidate,
                  api: route.api,
                  baseUrl: route.baseUrl,
                }
              : candidate;
            return buildHarnessModelProvider(attemptModel, attempt.plan, attempt);
          }),
          config: params.config,
          agentId: params.agentId,
          sessionKey: params.sessionKey,
          agentHarnessId: params.agentHarnessId,
          agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
        });
        if (nativeModelOwnedHarnessId && selected.id !== nativeModelOwnedHarnessId)
          throw new Error(
            `Prepared auth routes changed the session-pinned agent harness from "${nativeModelOwnedHarnessId}" to "${selected.id}".`,
          );
        return selected;
      };
      startupStages.mark("model-resolution");
      notifyExecutionPhase("model_resolution", {
        provider,
        model: modelId,
      });
      agentHarness = selectHarnessForModel(effectiveModel);
      pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
      const authStages = log$1.isEnabled("trace") ? createEmbeddedRunStageTracker() : void 0;
      const usesOpenAIAuthRouting = provider === OPENAI_PROVIDER_ID;
      const openClawNativeCodexResponsesNeedsAuthBootstrap =
        !pluginHarnessOwnsTransport &&
        provider === "openai" &&
        effectiveModel.api === "openai-chatgpt-responses";
      let piExternalCliAuthScope = pluginHarnessOwnsTransport
        ? { ignoreAutoPreferredProfile: false }
        : openClawNativeCodexResponsesNeedsAuthBootstrap
          ? {
              providerIds: [OPENAI_PROVIDER_ID],
              ignoreAutoPreferredProfile: false,
            }
          : resolveExternalCliAuthOverlayScopeFromSelection({
              provider,
              cfg: params.config,
              agentId: params.agentId,
              modelId,
              workspaceDir: resolvedWorkspace,
              userLockedAuthProfileId:
                params.authProfileIdSource === "user" ? params.authProfileId : void 0,
            });
      let noExternalAuthStore;
      if (!pluginHarnessOwnsTransport && !piExternalCliAuthScope.providerIds) {
        noExternalAuthStore = ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
          allowKeychainPrompt: false,
        });
        piExternalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
          provider,
          cfg: params.config,
          agentId: params.agentId,
          modelId,
          workspaceDir: resolvedWorkspace,
          store: noExternalAuthStore,
          userLockedAuthProfileId:
            params.authProfileIdSource === "user" ? params.authProfileId : void 0,
        });
      }
      authStages?.mark("scope");
      const attemptAuthProfileStore = usesOpenAIAuthRouting
        ? ensureAuthProfileStore(agentDir, {
            externalCliProviderIds: [OPENAI_PROVIDER_ID],
            allowKeychainPrompt: false,
          })
        : pluginHarnessOwnsTransport
          ? ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false })
          : piExternalCliAuthScope.providerIds
            ? ensureAuthProfileStore(agentDir, {
                externalCliProviderIds: piExternalCliAuthScope.providerIds,
                allowKeychainPrompt: false,
              })
            : (noExternalAuthStore ??
              ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
                allowKeychainPrompt: false,
              }));
      authStages?.mark("store");
      const requestedProfileId = params.authProfileId?.trim() || void 0;
      const lockedProfileId = params.authProfileIdSource === "user" ? requestedProfileId : void 0;
      const preferredProfileId =
        piExternalCliAuthScope.ignoreAutoPreferredProfile && !lockedProfileId
          ? void 0
          : requestedProfileId;
      const createAuthPreparation = () =>
        prepareAgentRuntimeAuth({
          provider,
          modelId,
          modelApi: model.api,
          modelBaseUrl: model.baseUrl,
          requestTransportOverrides: requestStreamTransportOverrides,
          config: params.config,
          env: process.env,
          agentDir,
          workspaceDir: resolvedWorkspace,
          authProfileStore: attemptAuthProfileStore,
          sessionAuthProfileId: preferredProfileId,
          sessionAuthProfileSource: params.authProfileIdSource,
          harnessId: agentHarness.id,
          harnessRuntime: agentHarness.id,
          harnessAuthBootstrap: agentHarness.authBootstrap,
          allowHarnessAuthProfileForwarding: true,
          allowTransientCooldownProbe: params.allowTransientCooldownProbe === true,
          resolveProviderPreferredProfileId: (context) =>
            resolveProviderAuthProfileId({
              provider,
              config: params.config,
              workspaceDir: resolvedWorkspace,
              env: process.env,
              context,
            }),
        });
      const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
        provider,
        modelId,
        config: params.config,
        agentDir,
        workspaceDir: resolvedWorkspace,
      });
      const { materialize: materializeAuthPlan, materializeUncached: materializeAuthPlanUncached } =
        createPreparedRuntimeModelMaterializer({
          provider,
          modelId,
          config: params.config,
          getModel: () => runtimeModel,
          nativeModelOwned,
          requestedProfileId: params.authProfileId,
          providerUsesProfileScopedModelMetadata,
          resolveModel: ({ config, authProfileId, authProfileMode }) =>
            resolveModelAsync(provider, modelId, agentDir, config, {
              authStorage,
              modelRegistry,
              skipAgentDiscovery: true,
              allowBundledStaticCatalogFallback: true,
              preferBundledStaticCatalogTransport: true,
              workspaceDir: resolvedWorkspace,
              authProfileId,
              authProfileMode,
            }),
        });
      let resolvedAuthPreparation = createAuthPreparation();
      let preparedAuthAttempts = resolvedAuthPreparation.attempts;
      let activePreparedAuthPlan = resolvedAuthPreparation.plan;
      applyResolvedRuntimeModel(await materializeAuthPlan(activePreparedAuthPlan));
      authStages?.mark("prepare-plan");
      const finalizedHarness = selectHarnessForPreparedAttempts(
        effectiveModel,
        preparedAuthAttempts,
      );
      if (finalizedHarness.id !== agentHarness.id) {
        agentHarness = finalizedHarness;
        pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
        resolvedAuthPreparation = createAuthPreparation();
        preparedAuthAttempts = resolvedAuthPreparation.attempts;
        activePreparedAuthPlan = resolvedAuthPreparation.plan;
        applyResolvedRuntimeModel(await materializeAuthPlan(activePreparedAuthPlan));
        if (
          selectHarnessForPreparedAttempts(effectiveModel, preparedAuthAttempts).id !==
          agentHarness.id
        )
          throw new Error(
            `Prepared auth route did not converge on one agent harness for ${provider}/${modelId}.`,
          );
      }
      authStages?.mark("harness");
      const genericCompactionRecoveryAllowed = !pluginHarnessOwnsTransport;
      const profileCandidates = preparedAuthAttempts.map((attempt) => attempt.profileId);
      const forwardedPluginHarnessProfileId = pluginHarnessOwnsTransport
        ? activePreparedAuthPlan.forwardedAuthProfileId
        : void 0;
      const profileFailureStore = attemptAuthProfileStore;
      let profileIndex = 0;
      const traceAttempts = [];
      const traceAttemptUsesFallback = (attempt) =>
        attempt.result === "rotate_profile" || attempt.result === "fallback_model";
      const resolveRuntimeFallbackReason = () => {
        return (
          traceAttempts.findLast(
            (attempt) => attempt.result === "fallback_model" && typeof attempt.reason === "string",
          )?.reason ??
          lastRetryFailoverReason ??
          null
        );
      };
      const buildEmbeddedContextEngineRuntimeSettings = (settingsParams) => {
        const fallbackReason = resolveRuntimeFallbackReason();
        return buildContextEngineRuntimeSettings({
          contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
          provider,
          requestedModel: requestedModelId,
          resolvedModel: modelId,
          selectedContextEngineId: contextEngine.info.id,
          contextEngineSelectionSource:
            contextEngine.info.id === "legacy" ? "default" : "configured",
          promptTokenBudget: settingsParams.tokenBudget,
          maxOutputTokens: settingsParams.maxOutputTokens,
          fallbackReason,
          degradedReason: settingsParams.degradedReason,
        });
      };
      const requestedThinkLevel = resolveInitialThinkLevel({
        requested: params.thinkLevel,
        config: params.config,
        provider,
        modelId,
        model: effectiveModel,
      });
      const initialThinkLevel = modelSelectionChangedByHook
        ? (resolveCandidateThinkingLevel({
            cfg: params.config,
            provider,
            modelId,
            level: requestedThinkLevel,
            catalog: [
              {
                provider,
                id: modelId,
                api: effectiveModel.api,
                reasoning: effectiveModel.reasoning,
                params: effectiveModel.params,
                compat: effectiveModel.compat,
              },
            ],
            agentId: params.agentId,
            sessionKey: params.sessionKey,
            agentRuntime: agentHarness.id,
          }) ?? requestedThinkLevel)
        : requestedThinkLevel;
      let thinkLevel = initialThinkLevel;
      const attemptedThinking = /* @__PURE__ */ new Set();
      let apiKeyInfo = null;
      const getApiKeyInfo = () => apiKeyInfo;
      let lastProfileId;
      let runtimeAuthState = null;
      let runtimeAuthRefreshCancelled = false;
      const pluginHarnessOwnsAuthBootstrap =
        pluginHarnessOwnsTransport && agentHarness.authBootstrap === "harness";
      const preparedApiKeyRoute = activePreparedAuthPlan.modelRoute?.authRequirement === "api-key";
      const pluginHarnessHasPreparedApiKeyAttempt = preparedAuthAttempts.some(
        (attempt) => attempt.plan.modelRoute?.authRequirement === "api-key",
      );
      const pluginHarnessNeedsOpenClawAuthBootstrap =
        pluginHarnessOwnsTransport &&
        usesOpenAIAuthRouting &&
        (preparedApiKeyRoute ||
          (!pluginHarnessOwnsAuthBootstrap &&
            profileCandidates.some((profileId) => Boolean(profileId))));
      const findPreparedAuthAttempt = (profileId, attemptIndex) => {
        const attempt =
          attemptIndex === void 0
            ? preparedAuthAttempts.find((candidate) => candidate.profileId === profileId)
            : preparedAuthAttempts[attemptIndex];
        return attempt?.profileId === profileId ? attempt : void 0;
      };
      let preparedProfileAttempted = false;
      const prepareAuthAttempt = async (attempt) => {
        if (
          !canRunPreparedAgentRuntimeAuthAttempt({
            attempt,
            priorProfileAttempted: preparedProfileAttempted,
          })
        )
          throw new Error(
            `Prepared direct auth fallback cannot bypass unavailable profiles for ${provider}/${modelId}.`,
          );
        const modelDecision = resolveCredentialScopedAuthAttemptModelDecision({
          attempt,
          priorProfileAttempted: preparedProfileAttempted,
          requestedProfileId: params.authProfileId,
          providerUsesProfileScopedModelMetadata,
        });
        const nextRuntimeModel = modelDecision.shouldMaterialize
          ? modelDecision.forceResolve
            ? await materializeAuthPlanUncached(attempt.plan, true)
            : await materializeAuthPlan(attempt.plan)
          : runtimeModel;
        const nextResolvedModel = resolveEffectiveModel(nextRuntimeModel);
        if (
          selectHarnessForPreparedAttempts(nextResolvedModel.effectiveModel, preparedAuthAttempts)
            .id !== agentHarness.id
        )
          throw new Error(
            `Prepared auth retry changed the selected agent harness for ${provider}/${modelId}.`,
          );
        preparedProfileAttempted ||= attempt.kind === "profile";
        return {
          runtimeModel: nextRuntimeModel,
          authRequirement: modelDecision.authRequirement,
          allowAuthProfileFallback: attempt.allowAuthProfileFallback,
          commit() {
            applyResolvedRuntimeModel(nextRuntimeModel, nextResolvedModel);
            activePreparedAuthPlan = attempt.plan;
          },
        };
      };
      const prepareModelForAuthProfile =
        hasPreparedAuthAttemptModelMetadata({
          attempts: preparedAuthAttempts,
          providerUsesProfileScopedModelMetadata,
        }) &&
        (!pluginHarnessOwnsAuthBootstrap || pluginHarnessHasPreparedApiKeyAttempt)
          ? async (profileId, attemptIndex) => {
              const attempt = findPreparedAuthAttempt(profileId, attemptIndex);
              if (!attempt)
                throw new Error(
                  `Auth profile "${profileId ?? "(none)"}" is outside the prepared attempts for ${provider}/${modelId}.`,
                );
              const prepared = await prepareAuthAttempt(attempt);
              if (attempt.plan.modelRoute && !prepared.authRequirement)
                throw new Error(`Prepared route metadata is missing for ${provider}/${modelId}.`);
              return {
                runtimeModel: prepared.runtimeModel,
                authRequirement: prepared.authRequirement,
                allowAuthProfileFallback: prepared.allowAuthProfileFallback,
                commit: () => prepared.commit(),
              };
            }
          : void 0;
      const {
        applyAuthProfileCandidate,
        advanceAuthProfile,
        initializeAuthProfile,
        maybeRefreshRuntimeAuthForAuthError,
        stopRuntimeAuthRefreshTimer,
      } = createEmbeddedRunAuthController({
        config: params.config,
        agentDir,
        workspaceDir: resolvedWorkspace,
        authStore: attemptAuthProfileStore,
        authStorage,
        profileCandidates,
        lockedProfileId,
        initialThinkLevel,
        attemptedThinking,
        fallbackConfigured,
        allowTransientCooldownProbe: params.allowTransientCooldownProbe === true,
        getProvider: () => provider,
        getModelId: () => modelId,
        getRuntimeModel: () => runtimeModel,
        setRuntimeModel: (next) => {
          runtimeModel = next;
        },
        getEffectiveModel: () => effectiveModel,
        setEffectiveModel: (next) => {
          effectiveModel = next;
        },
        getApiKeyInfo,
        setApiKeyInfo: (next) => {
          apiKeyInfo = next;
        },
        getLastProfileId: () => lastProfileId,
        setLastProfileId: (next) => {
          lastProfileId = next;
        },
        getRuntimeAuthState: () => runtimeAuthState,
        setRuntimeAuthState: (next) => {
          runtimeAuthState = next;
        },
        getRuntimeAuthRefreshCancelled: () => runtimeAuthRefreshCancelled,
        setRuntimeAuthRefreshCancelled: (next) => {
          runtimeAuthRefreshCancelled = next;
        },
        getProfileIndex: () => profileIndex,
        setProfileIndex: (next) => {
          profileIndex = next;
        },
        ...(prepareModelForAuthProfile ? { prepareModelForAuthProfile } : {}),
        setThinkLevel: (next) => {
          thinkLevel = next;
        },
        log: log$1,
      });
      authStages?.mark("controller");
      const advancePluginHarnessAuthAttempt = async () => {
        if (!pluginHarnessOwnsTransport || lockedProfileId) return false;
        let nextIndex = profileIndex + 1;
        while (nextIndex < preparedAuthAttempts.length) {
          const candidateAttempt = preparedAuthAttempts[nextIndex];
          if (!candidateAttempt) {
            nextIndex += 1;
            continue;
          }
          const candidate = candidateAttempt.profileId;
          if (
            candidate &&
            isProfileInCooldown(attemptAuthProfileStore, candidate, void 0, modelId)
          ) {
            nextIndex += 1;
            continue;
          }
          if (
            !canRunPreparedAgentRuntimeAuthAttempt({
              attempt: candidateAttempt,
              priorProfileAttempted: preparedProfileAttempted,
            })
          )
            return false;
          if (candidateAttempt.plan.modelRoute?.authRequirement === "api-key")
            try {
              await applyAuthProfileCandidate(candidate, nextIndex);
              profileIndex = nextIndex;
              thinkLevel = initialThinkLevel;
              attemptedThinking.clear();
              return true;
            } catch {
              nextIndex += 1;
              continue;
            }
          if (!candidate || candidateAttempt.plan.forwardedAuthProfileId !== candidate) {
            nextIndex += 1;
            continue;
          }
          const prepared = await prepareAuthAttempt(candidateAttempt);
          stopRuntimeAuthRefreshTimer();
          apiKeyInfo = null;
          runtimeAuthState = null;
          prepared.commit();
          profileIndex = nextIndex;
          lastProfileId = candidate;
          thinkLevel = initialThinkLevel;
          attemptedThinking.clear();
          return true;
        }
        return false;
      };
      const advanceAttemptAuthProfile = pluginHarnessOwnsAuthBootstrap
        ? advancePluginHarnessAuthAttempt
        : advanceAuthProfile;
      if (!pluginHarnessOwnsTransport || pluginHarnessNeedsOpenClawAuthBootstrap)
        await initializeAuthProfile();
      else if (lockedProfileId) lastProfileId = lockedProfileId;
      else if (forwardedPluginHarnessProfileId) {
        const initialAttempt = preparedAuthAttempts[profileIndex];
        const initialProfileInCooldown =
          initialAttempt?.kind === "profile" &&
          isProfileInCooldown(attemptAuthProfileStore, initialAttempt.profileId, void 0, modelId);
        const cooldownProbePolicy = resolveEmbeddedAuthCooldownProbePolicy({
          authStore: attemptAuthProfileStore,
          profileCandidates,
          lockedProfileId,
          modelId,
          allowTransientCooldownProbe: params.allowTransientCooldownProbe === true,
        });
        if (initialProfileInCooldown && !cooldownProbePolicy.allowProbe) {
          if (!(await advancePluginHarnessAuthAttempt()))
            throw new Error(
              `Prepared auth profiles are temporarily unavailable for ${provider}/${modelId}.`,
            );
        } else {
          if (initialProfileInCooldown)
            log$1.warn(
              `probing cooldowned auth profile for ${provider}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`,
            );
          preparedProfileAttempted = initialAttempt?.kind === "profile";
          lastProfileId = forwardedPluginHarnessProfileId;
        }
      }
      authStages?.mark("initialize");
      if (authStages)
        log$1.trace(
          formatEmbeddedRunStageSummary(
            `[trace:embedded-run] auth stages: runId=${params.runId} sessionId=${params.sessionId} phase=auth`,
            authStages.snapshot(),
          ),
        );
      startupStages.mark("auth");
      notifyExecutionPhase("auth", {
        provider,
        model: modelId,
      });
      const resolveRunAttemptAuthProfileStore = () => {
        if (!pluginHarnessOwnsTransport) return attemptAuthProfileStore;
        const activePlan = activePreparedAuthPlan;
        const activeProfileIds = activePlan.modelRoute
          ? [
              activePlan.forwardedAuthProfileId,
              ...(activePlan.forwardedAuthProfileCandidateIds ?? []),
            ]
          : [lastProfileId];
        return createScopedAuthProfileStore(
          attemptAuthProfileStore,
          activeProfileIds.filter((profileId) => Boolean(profileId)),
        );
      };
      const harnessBuildsOpenClawTools = agentHarnessBuildsOpenClawTools(agentHarness.id);
      const { sessionAgentId } = resolveSessionAgentIds({
        sessionKey: params.sessionKey,
        config: params.config,
        agentId: params.agentId,
      });
      const executionContract = isStrictAgenticExecutionContractActive({
        config: params.config,
        sessionKey: params.sessionKey,
        agentId: params.agentId,
        provider,
        modelId,
      })
        ? "strict-agentic"
        : "default";
      const maxReasoningOnlyRetryAttempts = 2;
      const maxEmptyResponseRetryAttempts = 1;
      const MAX_TIMEOUT_COMPACTION_ATTEMPTS = 2;
      const MAX_OVERFLOW_COMPACTION_ATTEMPTS = 3;
      const MAX_RUN_LOOP_ITERATIONS = resolveMaxRunRetryIterations(
        profileCandidates.length,
        params.config,
        sessionAgentId,
      );
      let overflowCompactionAttempts = 0;
      let toolResultTruncationAttempted = false;
      let bootstrapPromptWarningSignaturesSeen =
        params.bootstrapPromptWarningSignaturesSeen ??
        (params.bootstrapPromptWarningSignature ? [params.bootstrapPromptWarningSignature] : []);
      const usageAccumulator = createUsageAccumulator();
      let lastRunPromptUsage;
      let autoCompactionCount = 0;
      let lastCompactionTokensAfter;
      let lastContextBudgetStatus;
      let runLoopIterations = 0;
      let overloadProfileRotations = 0;
      let consecutiveSameModelRateLimitRetries = 0;
      let reasoningOnlyRetryAttempts = 0;
      let emptyResponseRetryAttempts = 0;
      let compactionContinuationRetryAttempts = 0;
      let beforeAgentFinalizeRevisionAttempts = 0;
      let sameModelIdleTimeoutRetries = 0;
      const idleTimeoutBreakerState = createIdleTimeoutBreakerState();
      const resolvedLoopDetectionConfig = resolveToolLoopDetectionConfig({
        cfg: params.config,
        agentId: sessionAgentId,
      });
      const postCompactionGuard = createPostCompactionLoopGuard(
        resolvedLoopDetectionConfig?.postCompactionGuard,
        { enabled: resolvedLoopDetectionConfig?.enabled !== false },
      );
      let postCompactionAbortController;
      let postCompactionAbortError;
      const attemptTerminalToolPresentation = {
        ordinal: -1,
        value: void 0,
      };
      let nextToolOutcomeOrdinal = 0;
      const allocateToolOutcomeOrdinal = () => nextToolOutcomeOrdinal++;
      const readAttemptTerminalToolPresentation = () => attemptTerminalToolPresentation.value;
      const observeToolOutcome = (observation) => {
        const observationOrdinal =
          observation.toolCallOrdinal ?? attemptTerminalToolPresentation.ordinal + 1;
        if (observationOrdinal >= attemptTerminalToolPresentation.ordinal) {
          attemptTerminalToolPresentation.ordinal = observationOrdinal;
          attemptTerminalToolPresentation.value = observation.terminalPresentation;
        }
        if (observation.presentationOnly) return;
        const verdict = postCompactionGuard.observe(observation);
        if (verdict.shouldAbort) {
          postCompactionAbortError ??= PostCompactionLoopPersistedError.fromVerdict(verdict);
          laneTaskAbortController.abort(postCompactionAbortError);
          postCompactionAbortController?.abort(postCompactionAbortError);
        }
      };
      let lastRetryFailoverReason = null;
      let compactionContinuationRetryInstruction = null;
      let rateLimitProfileRotations = 0;
      let timeoutCompactionAttempts = 0;
      let codexAppServerRecoveryRetries = 0;
      const MAX_EMPTY_ERROR_RETRIES = 3;
      let emptyErrorRetries = 0;
      const MAX_MISSING_ASSISTANT_RETRIES = 1;
      let missingAssistantRetryAttempts = 0;
      const overloadFailoverBackoffMs = resolveOverloadFailoverBackoffMs(params.config);
      const overloadProfileRotationLimit = resolveOverloadProfileRotationLimit(params.config);
      const rateLimitProfileRotationLimit = resolveRateLimitProfileRotationLimit(params.config);
      let activeSessionId = params.sessionId;
      let activeSessionFile = params.sessionFile;
      let activeSessionTarget = buildContextEngineCompactionSessionTarget({
        agentId: params.agentId ?? sessionAgentId,
        config: params.config,
        sessionFile: activeSessionFile,
        sessionId: activeSessionId,
        sessionKey: resolvedSessionKey,
        sessionTarget: params.sessionTarget,
      });
      const adoptActiveSessionId = (nextSessionId) => {
        if (!nextSessionId || nextSessionId === activeSessionId) return;
        activeSessionId = nextSessionId;
        params.replyOperation?.updateSessionId(activeSessionId);
        params.onSessionIdChanged?.(activeSessionId);
        registerAgentRunContext(params.runId, {
          sessionId: activeSessionId,
          lifecycleGeneration,
        });
      };
      const adoptActiveSessionTarget = async (nextSessionTarget) => {
        if (!nextSessionTarget) return;
        const resolvedTarget = await resolveAgentRunSessionTarget({
          agentId: nextSessionTarget.agentId ?? sessionAgentId,
          config: params.config,
          sessionId: nextSessionTarget.sessionId ?? activeSessionId,
          sessionKey: nextSessionTarget.sessionKey ?? resolvedSessionKey,
          sessionTarget: nextSessionTarget,
        });
        activeSessionTarget = nextSessionTarget;
        activeSessionFile = resolvedTarget.sessionFile;
        adoptActiveSessionId(resolvedTarget.sessionId);
      };
      let suppressNextUserMessagePersistence = params.suppressNextUserMessagePersistence ?? false;
      let activePrompt = {
        persisted: suppressNextUserMessagePersistence,
        internal: false,
      };
      const activateInternalPrompt = (prompt, persisted) => {
        activePrompt = {
          override: prompt,
          persisted,
          internal: true,
        };
        suppressNextUserMessagePersistence = persisted;
      };
      const onUserMessagePersisted = (message) => {
        const blockedBeforeAgentRun = message["__openclaw"]?.beforeAgentRunBlocked;
        const markCurrentUserMessagePersisted = () => {
          activePrompt.persisted = true;
          params.onUserMessagePersisted?.(message);
        };
        const recorder = params.userTurnTranscriptRecorder;
        if (!recorder) {
          markCurrentUserMessagePersisted();
          return;
        }
        const markWhenPersisted = (persisted) => {
          if (persisted?.message || recorder.hasPersisted()) markCurrentUserMessagePersisted();
        };
        if (blockedBeforeAgentRun !== void 0) {
          const canonicalPersistence = recorder
            .persistBlocked(message)
            .then(markWhenPersisted)
            .catch((persistError) => {
              log$1.warn(
                `failed to persist canonical blocked embedded user turn transcript: ${formatErrorMessage(persistError)}`,
              );
            });
          recorder.markRuntimePersistencePending(canonicalPersistence);
          return;
        }
        const canonicalPersistence = recorder
          .persistApproved()
          .then(markWhenPersisted)
          .catch((persistError) => {
            log$1.warn(
              `failed to persist canonical embedded user turn transcript: ${formatErrorMessage(persistError)}`,
            );
          });
        recorder.markRuntimePersistencePending(canonicalPersistence);
      };
      const continueFromCurrentTranscript = () => {
        activateInternalPrompt(MID_TURN_PRECHECK_CONTINUATION_PROMPT, true);
      };
      const waitForCurrentUserMessagePersistence = async () => {
        if (params.userTurnTranscriptRecorder?.hasRuntimePersistencePending() === true)
          await params.userTurnTranscriptRecorder.waitForRuntimePersistence();
      };
      const maybeEscalateRateLimitProfileFallback = (paramsLocal) => {
        rateLimitProfileRotations += 1;
        if (rateLimitProfileRotations <= rateLimitProfileRotationLimit || !fallbackConfigured)
          return;
        const status = resolveFailoverStatus("rate_limit");
        log$1.warn(
          `rate-limit profile rotation cap reached for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${rateLimitProfileRotations} rotations; escalating to model fallback`,
        );
        paramsLocal.logFallbackDecision("fallback_model", { status });
        throw new FailoverError(
          "The AI service is temporarily rate-limited. Please try again in a moment.",
          {
            reason: "rate_limit",
            provider: paramsLocal.failoverProvider,
            model: paramsLocal.failoverModel,
            profileId: lastProfileId,
            sessionId: activeSessionId,
            lane: globalLane,
            status,
          },
        );
      };
      const maybeMarkAuthProfileFailure = async (failure) => {
        if (params.authProfileStateMode === "read-only") return;
        const { profileId, reason } = failure;
        if (!profileId || !reason) return;
        if (pluginHarnessOwnsTransport && reason === "timeout") return;
        await markAuthProfileFailure({
          store: profileFailureStore,
          profileId,
          reason,
          cfg: params.config,
          agentDir,
          runId: params.runId,
          modelId: failure.modelId,
        });
      };
      const markAuthProfileSuccessAfterRun = () => {
        if (params.authProfileStateMode === "read-only" || !lastProfileId) return;
        const successProfileId = lastProfileId;
        const safeSuccessProfileId = redactIdentifier(successProfileId, { len: 12 });
        const successProvider = resolveAuthProfileStateProvider(
          profileFailureStore,
          successProfileId,
          provider,
        );
        const successStarted = Date.now();
        markAuthProfileSuccess({
          store: profileFailureStore,
          provider: successProvider,
          profileId: successProfileId,
          agentDir: params.agentDir,
        })
          .then(() => {
            const durationMs = Date.now() - successStarted;
            if (durationMs >= POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS)
              log$1.warn(
                `post-run auth-profile success bookkeeping completed after ${durationMs}ms: runId=${params.runId} sessionId=${params.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId}`,
              );
            else if (log$1.isEnabled("trace"))
              log$1.trace(
                `post-run auth-profile success bookkeeping completed: runId=${params.runId} sessionId=${params.sessionId} durationMs=${durationMs}`,
              );
          })
          .catch((err) => {
            log$1.warn(
              `post-run auth-profile success bookkeeping failed: runId=${params.runId} sessionId=${params.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId} error=${formatErrorMessage(err)}`,
            );
          });
      };
      const resolveRunAuthProfileFailureReason = (failoverReason, opts) =>
        resolveAuthProfileFailureReason({
          failoverReason,
          providerStarted: opts?.providerStarted,
          transientRateLimit: opts?.transientRateLimit,
          policy: params.authProfileFailurePolicy,
        });
      const maybeBackoffBeforeOverloadFailover = async (reason) => {
        if (reason !== "overloaded" || overloadFailoverBackoffMs <= 0) return;
        log$1.warn(
          `overload backoff before failover for ${provider}/${modelId}: delayMs=${overloadFailoverBackoffMs}`,
        );
        try {
          await sleepWithAbort(overloadFailoverBackoffMs, params.abortSignal);
        } catch (err) {
          if (params.abortSignal?.aborted) {
            const abortErr = new Error("Operation aborted", { cause: err });
            abortErr.name = "AbortError";
            throw abortErr;
          }
          throw err;
        }
      };
      const maybeRetrySameModelRateLimit = async (retry) => {
        if (consecutiveSameModelRateLimitRetries >= 3) return false;
        const delayMs = resolveSameModelRateLimitRetryDelayMs({
          retriesSoFar: consecutiveSameModelRateLimitRetries,
          retryAfterSeconds: retry?.retryAfterSeconds,
        });
        log$1.warn(
          `rate-limit same-model retry ${consecutiveSameModelRateLimitRetries + 1}/3 for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)}: delayMs=${delayMs}`,
        );
        try {
          await sleepWithAbort(delayMs, params.abortSignal);
        } catch (err) {
          if (params.abortSignal?.aborted) {
            const abortErr = new Error("Operation aborted", { cause: err });
            abortErr.name = "AbortError";
            throw abortErr;
          }
          throw err;
        }
        consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
          retriesSoFar: consecutiveSameModelRateLimitRetries,
          retriedSameModelRateLimit: true,
        });
        return true;
      };
      ensureContextEnginesInitialized();
      const contextEngine = await resolveContextEngine(params.config, {
        agentDir,
        workspaceDir: resolvedWorkspace,
      });
      const resolveContextEnginePluginId = () => resolveContextEngineOwnerPluginId(contextEngine);
      startupStages.mark("context-engine");
      notifyExecutionPhase("context_engine", {
        provider,
        model: modelId,
      });
      try {
        const resolveActiveHookContext = () => ({
          ...hookCtx,
          sessionId: activeSessionId,
        });
        const adoptCompactionTranscript = async (compactResult) => {
          const previousSessionId = activeSessionId;
          const nextSessionTarget = compactResult.result?.sessionTarget;
          const successor = resolveCompactionSuccessorTranscript(compactResult);
          await adoptActiveSessionTarget(
            nextSessionTarget && successor.sessionId
              ? {
                  ...nextSessionTarget,
                  sessionId: nextSessionTarget.sessionId ?? successor.sessionId,
                }
              : nextSessionTarget,
          );
          if (
            !nextSessionTarget &&
            successor.sessionFile &&
            successor.sessionFile !== activeSessionFile
          )
            activeSessionFile = successor.sessionFile;
          adoptActiveSessionId(successor.sessionId);
          return successor.sessionId && successor.sessionId !== previousSessionId
            ? previousSessionId
            : void 0;
        };
        const onCompactionHookMessages = async (payload) => {
          const messages = payload.messages.filter((message) => message.trim().length > 0);
          if (messages.length === 0) return;
          await params.onAgentEvent?.({
            stream: "compaction",
            data: {
              phase: payload.phase === "before" ? "start" : "end",
              ...(payload.phase === "after" ? { completed: true } : {}),
              messages,
            },
            ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
          });
        };
        const runOwnsCompactionBeforeHook = async (reason) => {
          if (
            contextEngine.info.ownsCompaction !== true ||
            !hookRunner?.hasHooks("before_compaction")
          )
            return;
          try {
            await hookRunner.runBeforeCompaction(
              {
                messageCount: -1,
                sessionFile: activeSessionFile,
              },
              resolveActiveHookContext(),
            );
          } catch (hookErr) {
            log$1.warn(`before_compaction hook failed during ${reason}: ${String(hookErr)}`);
          }
        };
        const runOwnsCompactionAfterHook = async (reason, compactResult, previousSessionId) => {
          if (
            contextEngine.info.ownsCompaction !== true ||
            !compactResult.ok ||
            !compactResult.compacted ||
            !hookRunner?.hasHooks("after_compaction")
          )
            return;
          try {
            await hookRunner.runAfterCompaction(
              {
                messageCount: -1,
                compactedCount: -1,
                tokenCount: compactResult.result?.tokensAfter,
                sessionFile:
                  resolveCompactionSuccessorTranscript(compactResult).sessionFile ??
                  activeSessionFile,
                ...(previousSessionId ? { previousSessionId } : {}),
              },
              resolveActiveHookContext(),
            );
          } catch (hookErr) {
            log$1.warn(`after_compaction hook failed during ${reason}: ${String(hookErr)}`);
          }
        };
        let authRetryPending = false;
        let accumulatedReplayState = createEmbeddedRunReplayState();
        let lastTurnTotal;
        while (true) {
          if (runLoopIterations >= MAX_RUN_LOOP_ITERATIONS) {
            const message = `Exceeded retry limit after ${runLoopIterations} attempts (max=${MAX_RUN_LOOP_ITERATIONS}).`;
            log$1.error(
              `[run-retry-limit] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} attempts=${runLoopIterations} maxAttempts=${MAX_RUN_LOOP_ITERATIONS}`,
            );
            return handleRetryLimitExhaustion({
              message,
              decision: resolveRunFailoverDecision({
                stage: "retry_limit",
                fallbackConfigured,
                failoverReason: lastRetryFailoverReason,
              }),
              provider,
              model: modelId,
              profileId: lastProfileId,
              durationMs: Date.now() - started,
              agentMeta: buildErrorAgentMeta({
                sessionId: activeSessionId,
                sessionFile: activeSessionFile,
                provider,
                model: model.id,
                ...outerContextTokenMeta,
                usageAccumulator,
                lastRunPromptUsage,
                lastTurnTotal,
              }),
              replayInvalid: accumulatedReplayState.replayInvalid ? true : void 0,
              livenessState: "blocked",
            });
          }
          runLoopIterations += 1;
          const runtimeAuthRetry = authRetryPending;
          authRetryPending = false;
          attemptedThinking.add(thinkLevel);
          await fs.mkdir(resolvedWorkspace, { recursive: true });
          if (!startupStagesEmitted)
            startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.workspace);
          const basePrompt =
            activePrompt.override ??
            resolveEmbeddedAttemptBasePrompt({
              nativeModelOwned,
              provider,
              prompt: params.prompt,
            });
          const prompt = compactionContinuationRetryInstruction
            ? `${basePrompt}\n\n${compactionContinuationRetryInstruction}`
            : basePrompt;
          const resolvedStreamApiKey = resolveAttemptDispatchApiKey({
            apiKeyInfo,
            runtimeAuthState,
          });
          const attemptFastMode = resolveAttemptFastModeParam();
          const trajectorySessionFile = resolvedSessionKey
            ? (
                await resolveSessionTranscriptRuntimeReadTarget({
                  agentId: workspaceResolution.agentId,
                  sessionId: activeSessionId,
                  sessionKey: resolvedSessionKey,
                  storePath: resolveStorePath(params.config?.session?.store, {
                    agentId: workspaceResolution.agentId,
                  }),
                })
              ).sessionFile
            : activeSessionFile;
          if (!startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.prompt);
          const runtimePlan = buildAgentRuntimePlan({
            provider,
            modelId,
            model: effectiveModel,
            modelApi: effectiveModel.api,
            harnessId: agentHarness.id,
            harnessRuntime: agentHarness.id,
            preparedAuthPlan: activePreparedAuthPlan,
            config: params.config,
            workspaceDir: resolvedWorkspace,
            agentDir,
            agentId: workspaceResolution.agentId,
            thinkingLevel: mapThinkingLevelForProvider(thinkLevel),
            extraParamsOverride: {
              ...params.streamParams,
              fastMode: attemptFastMode,
            },
          });
          const trajectoryAttribution = resolveAttemptTrajectoryAttribution({
            model: effectiveModel,
            modelId,
            provider,
            runtimePlan,
          });
          const hostTrajectoryRecorder =
            agentHarness.id === "codex" && !params.disableTrajectory
              ? createTrajectoryRuntimeRecorder({
                  cfg: params.config,
                  env: process.env,
                  runId: params.runId,
                  sessionId: activeSessionId,
                  sessionKey: resolvedSessionKey,
                  sessionFile: trajectorySessionFile,
                  provider: trajectoryAttribution.provider,
                  modelId: trajectoryAttribution.modelId,
                  modelApi: trajectoryAttribution.modelApi,
                  workspaceDir: resolvedWorkspace,
                })
              : void 0;
          const runAttemptAuthProfileStore = resolveRunAttemptAuthProfileStore();
          if (!startupStagesEmitted) {
            startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.runtimePlan);
            startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
            notifyExecutionPhase("attempt_dispatch", {
              provider,
              model: modelId,
            });
            emitStartupStageSummary(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
            startupStagesEmitted = true;
          }
          const attemptAbortController = new AbortController();
          postCompactionAbortController = attemptAbortController;
          const parentAbortSignal = params.abortSignal;
          const relayParentAbort = () => {
            laneTaskAbortController.abort(parentAbortSignal?.reason);
            attemptAbortController.abort(parentAbortSignal?.reason);
          };
          if (parentAbortSignal?.aborted) relayParentAbort();
          else parentAbortSignal?.addEventListener("abort", relayParentAbort, { once: true });
          let progressInterval;
          const stopLaneProgressHeartbeat = () => {
            if (progressInterval) {
              clearInterval(progressInterval);
              progressInterval = void 0;
            }
            attemptAbortController.signal.removeEventListener("abort", stopLaneProgressHeartbeat);
          };
          const startLaneProgressHeartbeat = () => {
            if (progressInterval || attemptAbortController.signal.aborted) return;
            progressInterval = setInterval(
              () => noteLaneTaskProgress(),
              EMBEDDED_RUN_LANE_HEARTBEAT_MS,
            );
            progressInterval.unref?.();
            attemptAbortController.signal.addEventListener("abort", stopLaneProgressHeartbeat, {
              once: true,
            });
          };
          let timeoutReleaseTimer;
          const clearAttemptTimeoutRelease = () => {
            if (timeoutReleaseTimer) {
              clearTimeout(timeoutReleaseTimer);
              timeoutReleaseTimer = void 0;
            }
          };
          const armAttemptTimeoutRelease = (reason) => {
            if (timeoutReleaseTimer) return;
            timeoutReleaseTimer = setTimeout(
              () => laneTaskReleaseController.abort(reason),
              EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS,
            );
            timeoutReleaseTimer.unref?.();
          };
          let attemptCancellationRequested = false;
          const codexAppServerRecoveryRetryAvailable = hasCodexAppServerRecoveryRetryBudget({
            alreadyRetried: codexAppServerRecoveryRetries > 0,
            runLoopIterations,
            maxRunLoopIterations: MAX_RUN_LOOP_ITERATIONS,
          });
          const rawAttempt = await runEmbeddedAttemptWithBackend({
            sessionId: activeSessionId,
            sessionKey: resolvedSessionKey,
            promptCacheKey: params.promptCacheKey,
            sandboxSessionKey: params.sandboxSessionKey,
            trigger: params.trigger,
            memoryFlushWritePath: params.memoryFlushWritePath,
            messageChannel: params.messageChannel,
            messageProvider: params.messageProvider,
            clientCaps: params.clientCaps,
            chatType: params.chatType,
            agentAccountId: params.agentAccountId,
            messageTo: params.messageTo,
            messageThreadId: params.messageThreadId,
            messageActionTurnCapability: params.messageActionTurnCapability,
            groupId: params.groupId,
            groupChannel: params.groupChannel,
            groupSpace: params.groupSpace,
            memberRoleIds: params.memberRoleIds,
            spawnedBy: params.spawnedBy,
            isCanonicalWorkspace,
            senderId: params.senderId,
            senderName: params.senderName,
            senderUsername: params.senderUsername,
            senderE164: params.senderE164,
            senderIsOwner: params.senderIsOwner,
            approvalReviewerDeviceId: params.approvalReviewerDeviceId,
            currentChannelId: params.currentChannelId,
            chatId: params.chatId,
            channelContext: params.channelContext,
            currentMessagingTarget: params.currentMessagingTarget,
            currentThreadTs: params.currentThreadTs,
            currentMessageId: params.currentMessageId,
            currentInboundAudio: params.currentInboundAudio,
            replyToMode: params.replyToMode,
            hasRepliedRef: params.hasRepliedRef,
            sessionFile: activeSessionFile,
            sessionTarget: activeSessionTarget,
            trajectorySessionFile,
            trajectoryRecorder: hostTrajectoryRecorder,
            workspaceDir: resolvedWorkspace,
            cwd: params.cwd,
            agentDir,
            config: params.config,
            allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
            ...(nativeModelOwned
              ? {}
              : {
                  contextEngine,
                  contextTokenBudget,
                  contextWindowInfo,
                }),
            skillsSnapshot: params.skillsSnapshot,
            prompt,
            transcriptPrompt: params.transcriptPrompt,
            userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
            skipPreparedUserTurnMessage: activePrompt.internal,
            currentInboundEventKind: params.currentInboundEventKind,
            currentInboundContext: params.currentInboundContext,
            images: params.images,
            imageOrder: params.imageOrder,
            clientTools: params.clientTools,
            disableTools: params.disableTools,
            provider,
            modelId,
            requestedModelId,
            fallbackActive: modelId !== requestedModelId || Boolean(resolveRuntimeFallbackReason()),
            fallbackReason: resolveRuntimeFallbackReason(),
            isFinalFallbackAttempt: params.isFinalFallbackAttempt,
            agentHarnessId: agentHarness.id,
            agentHarnessRuntimeOverride: agentHarness.id,
            modelSelectionLocked: params.modelSelectionLocked,
            ...(params.onSuccessfulAuthBinding || expectedHarnessArtifact
              ? { captureRuntimeArtifact: true }
              : {}),
            ...(expectedHarnessArtifact
              ? { expectedRuntimeArtifact: expectedHarnessArtifact.artifact }
              : {}),
            ...(params.sessionKey
              ? {
                  agentHarnessTaskRuntimeScope: createAgentHarnessTaskRuntimeScope({
                    requesterSessionKey: params.sessionKey,
                  }),
                }
              : {}),
            runtimePlan,
            model: applyAuthHeaderOverride(
              applyLocalNoAuthHeaderOverride(effectiveModel, apiKeyInfo),
              runtimeAuthState ? null : apiKeyInfo,
              params.config,
            ),
            resolvedApiKey: resolvedStreamApiKey,
            authProfileId: lastProfileId,
            authProfileIdSource: lockedProfileId ? "user" : "auto",
            initialReplayState: accumulatedReplayState,
            authStorage,
            authProfileStore: runAttemptAuthProfileStore,
            toolAuthProfileStore: harnessBuildsOpenClawTools ? attemptAuthProfileStore : void 0,
            modelRegistry,
            agentId: workspaceResolution.agentId,
            beforeAgentStartResult,
            thinkLevel,
            onToolOutcome: observeToolOutcome,
            allocateToolOutcomeOrdinal,
            onToolStreamBoundary: maybeAnnounceFastModeAutoOff,
            onRunProgress: notifyRunProgress,
            fastMode: attemptFastMode,
            fastModeAuto: params.fastMode === "auto",
            ...(params.fastMode === "auto"
              ? {
                  fastModeStartedAtMs: fastModeStarted,
                  fastModeAutoOnSeconds,
                  fastModeAutoProgressState,
                }
              : {}),
            verboseLevel: params.verboseLevel,
            reasoningLevel: params.reasoningLevel,
            toolResultFormat: resolvedToolResultFormat,
            toolProgressDetail: params.toolProgressDetail,
            execOverrides: params.execOverrides,
            bashElevated: params.bashElevated,
            timeoutMs: params.timeoutMs,
            runTimeoutOverrideMs: params.runTimeoutOverrideMs,
            runId: params.runId,
            lifecycleGeneration,
            abortSignal: attemptAbortController.signal,
            onAttemptTimeoutArmed: pluginHarnessOwnsTransport ? void 0 : startLaneProgressHeartbeat,
            onAttemptTimeout: pluginHarnessOwnsTransport ? void 0 : armAttemptTimeoutRelease,
            onAttemptAbort: () => {
              attemptCancellationRequested = true;
              if (!params.abortSignal?.aborted) params.replyOperation?.abortByUser();
              if (!pluginHarnessOwnsTransport) {
                stopLaneProgressHeartbeat();
                laneTaskAbortController.abort();
              }
            },
            replyOperation: params.replyOperation,
            shouldEmitToolResult: params.shouldEmitToolResult,
            shouldEmitToolOutput: params.shouldEmitToolOutput,
            onPartialReply: params.onPartialReply,
            onAssistantMessageStart: params.onAssistantMessageStart,
            onBlockReply: params.onBlockReply,
            onBlockReplyFlush: params.onBlockReplyFlush,
            blockReplyBreak: params.blockReplyBreak,
            blockReplyChunking: params.blockReplyChunking,
            onReasoningStream: params.onReasoningStream,
            streamReasoningInNonStreamModes: params.streamReasoningInNonStreamModes,
            onReasoningEnd: params.onReasoningEnd,
            onToolResult: notifyToolResult,
            onAgentToolResult: params.onAgentToolResult,
            onAgentEvent: notifyAgentEvent,
            deferTerminalLifecycle:
              params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
            deferTerminalLifecycleEnd:
              params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
            onExecutionPhase: params.onExecutionPhase,
            extraSystemPrompt: params.extraSystemPrompt,
            sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
            taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
            inputProvenance: params.inputProvenance,
            streamParams: params.streamParams,
            modelRun: params.modelRun,
            disableTrajectory: params.disableTrajectory,
            ...resolveSkillWorkshopAttemptParams(params),
            promptMode: params.promptMode,
            ownerNumbers: params.ownerNumbers,
            enforceFinalTag: params.enforceFinalTag,
            silentExpected: params.silentExpected,
            suppressLiveStreamOutput: params.suppressLiveStreamOutput,
            bootstrapContextMode: params.bootstrapContextMode,
            bootstrapContextRunKind: params.bootstrapContextRunKind,
            jobId: params.jobId,
            toolsAllow: params.toolsAllow,
            ...(params.crestodianTool ? { crestodianTool: params.crestodianTool } : {}),
            cleanupBundleMcpOnRunEnd: params.cleanupBundleMcpOnRunEnd,
            disableMessageTool: params.disableMessageTool,
            forceRestartSafeTools: params.forceRestartSafeTools,
            forceMessageTool: params.forceMessageTool,
            enableHeartbeatTool: params.enableHeartbeatTool,
            forceHeartbeatTool: params.forceHeartbeatTool,
            requireExplicitMessageTarget: params.requireExplicitMessageTarget,
            internalEvents: params.internalEvents,
            bootstrapPromptWarningSignaturesSeen,
            bootstrapPromptWarningSignature:
              bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
            suppressNextUserMessagePersistence,
            beforeAgentFinalizeRevisionAttempts,
            maxBeforeAgentFinalizeRevisions: MAX_BEFORE_AGENT_FINALIZE_REVISIONS,
            suppressTranscriptOnlyAssistantPersistence:
              params.suppressTranscriptOnlyAssistantPersistence,
            suppressAssistantErrorPersistence: params.suppressAssistantErrorPersistence,
            onUserMessagePersisted,
            onUserMessagePersistenceInvalidated: () => {
              activePrompt.persisted = false;
            },
            onAssistantErrorMessagePersisted: params.onAssistantErrorMessagePersisted,
          })
            .catch((err) => {
              throw postCompactionAbortError ?? err;
            })
            .finally(() => {
              clearAttemptTimeoutRelease();
              stopLaneProgressHeartbeat();
              parentAbortSignal?.removeEventListener?.("abort", relayParentAbort);
              if (postCompactionAbortController === attemptAbortController)
                postCompactionAbortController = void 0;
            });
          if (postCompactionAbortError) throw postCompactionAbortError;
          const attempt = normalizeEmbeddedRunAttemptResult(rawAttempt);
          await waitForCurrentUserMessagePersistence();
          suppressNextUserMessagePersistence = activePrompt.persisted;
          if (attemptCancellationRequested) {
            throwIfAborted();
            throw createAgentRunDirectAbortError();
          }
          const {
            aborted,
            externalAbort,
            promptError,
            promptErrorSource,
            preflightRecovery,
            timedOut,
            idleTimedOut,
            timedOutDuringCompaction,
            sessionIdUsed,
            sessionFileUsed,
            lastAssistant: sessionLastAssistant,
            currentAttemptAssistant,
          } = attempt;
          const timedOutDuringToolExecution = attempt.timedOutDuringToolExecution ?? false;
          const timedOutByRunBudget = attempt.timedOutByRunBudget ?? false;
          const sessionAssistantForCandidate =
            !currentAttemptAssistant &&
            !isAssistantForModelRef(sessionLastAssistant, {
              provider: effectiveModel.provider,
              model: effectiveModel.id,
            })
              ? void 0
              : sessionLastAssistant;
          const attemptAssistant = currentAttemptAssistant ?? sessionAssistantForCandidate;
          const terminalOutcome = resolveEmbeddedRunAttemptTerminalOutcome({
            attempt,
            assistant: currentAttemptAssistant,
            abortSignal: params.abortSignal,
          });
          const terminalAborted = isEmbeddedRunTerminalAbort(terminalOutcome);
          const terminalTimedOut = isEmbeddedRunTerminalTimeout(terminalOutcome);
          const terminalInterrupted = isEmbeddedRunTerminalInterrupted(terminalOutcome);
          const signalOwnedInterruption =
            terminalInterrupted && params.abortSignal?.aborted === true;
          const terminalIdleTimedOut = terminalTimedOut && idleTimedOut;
          const setTerminalLifecycleMeta = (meta) => {
            const { stopReason, ...remainingMeta } = meta;
            const terminalStopReason = terminalInterrupted
              ? terminalOutcome.stopReason
              : stopReason;
            attempt.setTerminalLifecycleMeta?.({
              ...remainingMeta,
              ...(terminalStopReason ? { stopReason: terminalStopReason } : {}),
              aborted: terminalAborted,
            });
          };
          const previousActiveSessionId = activeSessionId;
          const previousActiveSessionFile = activeSessionFile;
          adoptActiveSessionId(sessionIdUsed);
          if (sessionFileUsed && sessionFileUsed !== activeSessionFile)
            activeSessionFile = sessionFileUsed;
          if (
            (sessionIdUsed && sessionIdUsed !== previousActiveSessionId) ||
            (sessionFileUsed && sessionFileUsed !== previousActiveSessionFile)
          ) {
            const activeSqliteMarker = parseSqliteSessionFileMarker(activeSessionFile);
            activeSessionTarget = activeSqliteMarker
              ? {
                  agentId: activeSqliteMarker.agentId,
                  sessionId: activeSqliteMarker.sessionId,
                  sessionKey: resolvedSessionKey,
                  storePath: activeSqliteMarker.storePath,
                }
              : void 0;
          }
          bootstrapPromptWarningSignaturesSeen =
            attempt.bootstrapPromptWarningSignaturesSeen ??
            (attempt.bootstrapPromptWarningSignature
              ? Array.from(
                  /* @__PURE__ */ new Set([
                    ...bootstrapPromptWarningSignaturesSeen,
                    attempt.bootstrapPromptWarningSignature,
                  ]),
                )
              : bootstrapPromptWarningSignaturesSeen);
          const lastAssistantUsage = normalizeUsage(sessionLastAssistant?.usage);
          const callUsage = resolveLatestCallUsage({
            currentAttemptCandidates: [
              normalizeUsage(currentAttemptAssistant?.usage),
              normalizeUsage(attempt.promptCache?.lastCallUsage),
            ],
            carriedCandidates: [lastRunPromptUsage, lastAssistantUsage],
          });
          const attemptUsage = attempt.attemptUsage ?? callUsage.currentAttempt;
          mergeUsageIntoAccumulator(usageAccumulator, attemptUsage);
          lastRunPromptUsage = callUsage.latest;
          lastTurnTotal = callUsage.latest?.total;
          const breakerStep = stepIdleTimeoutBreaker(idleTimeoutBreakerState, {
            idleTimedOut: terminalIdleTimedOut,
            completedModelProgress: hasCompletedModelProgressForIdleBreaker(attempt),
            outputTokens: attemptUsage?.output,
          });
          if (breakerStep.tripped) {
            const breakerMessage = `Idle-timeout cost-runaway breaker tripped: ${breakerStep.consecutive} consecutive idle timeouts without completed model progress (cap=5). Halting further attempts to bound paid model calls. See issue #76293.`;
            log$1.error(
              `[idle-timeout-circuit-breaker-tripped] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} consecutive=${breakerStep.consecutive} cap=5`,
            );
            return handleRetryLimitExhaustion({
              message: breakerMessage,
              decision: resolveRunFailoverDecision({
                stage: "retry_limit",
                fallbackConfigured,
                failoverReason: lastRetryFailoverReason,
              }),
              provider,
              model: modelId,
              profileId: lastProfileId,
              durationMs: Date.now() - started,
              agentMeta: buildErrorAgentMeta({
                sessionId: activeSessionId,
                sessionFile: activeSessionFile,
                provider,
                model: model.id,
                ...outerContextTokenMeta,
                usageAccumulator,
                lastRunPromptUsage,
                lastTurnTotal,
              }),
              replayInvalid: accumulatedReplayState.replayInvalid ? true : void 0,
              livenessState: "blocked",
            });
          }
          const attemptCompactionCount = Math.max(0, attempt.compactionCount ?? 0);
          autoCompactionCount += attemptCompactionCount;
          if (
            typeof attempt.compactionTokensAfter === "number" &&
            Number.isFinite(attempt.compactionTokensAfter) &&
            attempt.compactionTokensAfter >= 0
          )
            lastCompactionTokensAfter = Math.floor(attempt.compactionTokensAfter);
          if (attempt.contextBudgetStatus) lastContextBudgetStatus = attempt.contextBudgetStatus;
          const activeErrorContext = resolveActiveErrorContext({
            provider,
            model: modelId,
            assistant: attemptAssistant,
          });
          const resolveReplayInvalidForAttempt = (incompleteTurnText) =>
            accumulatedReplayState.replayInvalid ||
            resolveReplayInvalidFlag({
              attempt,
              incompleteTurnText,
            });
          if (resolveReplayInvalidForAttempt(null)) accumulatedReplayState.replayInvalid = true;
          accumulatedReplayState = observeReplayMetadata(
            accumulatedReplayState,
            attempt.replayMetadata,
          );
          const formattedAssistantErrorText = sessionAssistantForCandidate
            ? formatAssistantErrorText(sessionAssistantForCandidate, {
                cfg: params.config,
                sessionKey: resolvedSessionKey ?? params.sessionId,
                provider: activeErrorContext.provider,
                model: activeErrorContext.model,
                authMode: lastProfileId
                  ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type
                  : void 0,
              })
            : void 0;
          const assistantErrorText =
            sessionAssistantForCandidate?.stopReason === "error"
              ? sessionAssistantForCandidate.errorMessage?.trim() || formattedAssistantErrorText
              : void 0;
          const canRestartForLiveSwitch =
            !hasOutboundDeliveryEvidence(attempt) &&
            !attempt.didSendDeterministicApprovalPrompt &&
            !attempt.lastToolError &&
            (attempt.toolMetas?.length ?? 0) === 0 &&
            (attempt.assistantTexts?.length ?? 0) === 0;
          if (!signalOwnedInterruption && !nativeModelOwned && preflightRecovery?.handled) {
            const retryingFromTranscript = preflightRecovery.source === "mid-turn";
            log$1.info(
              `[context-overflow-precheck] early recovery route=${preflightRecovery.route} completed for ${provider}/${modelId}; ` +
                (retryingFromTranscript ? "retrying from current transcript" : "retrying prompt"),
            );
            if (retryingFromTranscript) continueFromCurrentTranscript();
            continue;
          }
          const requestedSelection = shouldSwitchToLiveModel({
            cfg: params.config,
            sessionKey: resolvedSessionKey,
            agentId: params.agentId,
            defaultProvider: DEFAULT_PROVIDER,
            defaultModel: DEFAULT_MODEL,
            currentProvider: provider,
            currentModel: modelId,
            currentAgentRuntimeOverride: params.agentHarnessRuntimeOverride,
            currentAuthProfileId: preferredProfileId,
            currentAuthProfileIdSource: params.authProfileIdSource,
          });
          if (!signalOwnedInterruption && requestedSelection && canRestartForLiveSwitch) {
            await clearLiveModelSwitchPending({
              cfg: params.config,
              sessionKey: resolvedSessionKey,
              agentId: params.agentId,
            });
            log$1.info(
              `live session model switch requested during active attempt for ${params.sessionId}: ${provider}/${modelId} -> ${requestedSelection.provider}/${requestedSelection.model}`,
            );
            throw new LiveSessionModelSwitchError(requestedSelection);
          }
          if (
            genericCompactionRecoveryAllowed &&
            contextTokenBudget !== void 0 &&
            timedOut &&
            !signalOwnedInterruption &&
            !timedOutDuringCompaction &&
            !timedOutDuringToolExecution &&
            !timedOutByRunBudget
          ) {
            const lastTurnPromptTokens = deriveContextPromptTokens({
              lastCallUsage: lastRunPromptUsage,
            });
            const tokenUsedRatio =
              lastTurnPromptTokens != null && contextTokenBudget > 0
                ? lastTurnPromptTokens / contextTokenBudget
                : 0;
            if (timeoutCompactionAttempts >= MAX_TIMEOUT_COMPACTION_ATTEMPTS)
              log$1.warn(
                `[timeout-compaction] already attempted timeout compaction ${timeoutCompactionAttempts} time(s); falling through to failover rotation`,
              );
            else if (tokenUsedRatio > 0.65) {
              const timeoutDiagId = createCompactionDiagId();
              timeoutCompactionAttempts++;
              log$1.warn(
                `[timeout-compaction] LLM timed out with high prompt token usage (${Math.round(tokenUsedRatio * 100)}%); attempting compaction before retry (attempt ${timeoutCompactionAttempts}/${MAX_TIMEOUT_COMPACTION_ATTEMPTS}) diagId=${timeoutDiagId}`,
              );
              let timeoutCompactResult;
              await runOwnsCompactionBeforeHook("timeout recovery");
              try {
                const timeoutCompactionRuntimeContext = {
                  ...buildEmbeddedCompactionRuntimeContext({
                    sessionKey: params.sessionKey,
                    messageChannel: params.messageChannel,
                    messageProvider: params.messageProvider,
                    clientCaps: params.clientCaps,
                    chatType: params.chatType,
                    agentAccountId: params.agentAccountId,
                    currentChannelId: params.currentChannelId,
                    currentThreadTs: params.currentThreadTs,
                    currentMessageId: params.currentMessageId,
                    authProfileId: lastProfileId,
                    authProfileIdSource: lockedProfileId ? "user" : "auto",
                    runtimeAuthPlan: runtimePlan.auth,
                    workspaceDir: resolvedWorkspace,
                    agentDir,
                    config: params.config,
                    skillsSnapshot: params.skillsSnapshot,
                    senderId: params.senderId,
                    provider,
                    modelId,
                    harnessRuntime: agentHarness.id,
                    modelSelectionLocked: params.modelSelectionLocked,
                    modelFallbacksOverride: params.modelFallbacksOverride,
                    thinkLevel,
                    reasoningLevel: params.reasoningLevel,
                    bashElevated: params.bashElevated,
                    extraSystemPrompt: params.extraSystemPrompt,
                    sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
                    ownerNumbers: params.ownerNumbers,
                    activeProcessSessions: listActiveProcessSessionReferences({
                      scopeKey: resolveProcessToolScopeKey({
                        sessionKey: params.sandboxSessionKey?.trim() || params.sessionKey,
                        sessionId: activeSessionId,
                        agentId: sessionAgentId,
                      }),
                    }),
                  }),
                  ...resolveContextEngineCapabilities({
                    config: params.config,
                    sessionKey: params.sessionKey,
                    agentId: sessionAgentId,
                    contextEnginePluginId: resolveContextEnginePluginId(),
                    purpose: "context-engine.timeout-compaction",
                  }),
                  onCompactionHookMessages,
                  ...(attempt.promptCache ? { promptCache: attempt.promptCache } : {}),
                  runId: params.runId,
                  trigger: "timeout_recovery",
                  diagId: timeoutDiagId,
                  attempt: timeoutCompactionAttempts,
                  maxAttempts: MAX_TIMEOUT_COMPACTION_ATTEMPTS,
                };
                timeoutCompactResult = await compactContextEngineWithSafetyTimeout(
                  contextEngine,
                  {
                    sessionId: activeSessionId,
                    sessionKey: resolvedSessionKey,
                    agentId: sessionAgentId,
                    sessionTarget: buildContextEngineCompactionSessionTarget({
                      agentId: sessionAgentId,
                      config: params.config,
                      sessionFile: activeSessionFile,
                      sessionId: activeSessionId,
                      sessionKey: resolvedSessionKey,
                      sessionTarget: activeSessionTarget,
                    }),
                    tokenBudget: contextTokenBudget,
                    force: true,
                    compactionTarget: "budget",
                    runtimeContext: timeoutCompactionRuntimeContext,
                    runtimeSettings: buildEmbeddedContextEngineRuntimeSettings({
                      tokenBudget: contextTokenBudget,
                    }),
                  },
                  resolveCompactionTimeoutMs(params.config),
                  params.abortSignal,
                );
              } catch (compactErr) {
                log$1.warn(
                  `[timeout-compaction] contextEngine.compact() threw during timeout recovery for ${provider}/${modelId}: ${String(compactErr)}`,
                );
                timeoutCompactResult = {
                  ok: false,
                  compacted: false,
                  reason: String(compactErr),
                };
              }
              const previousSessionId = timeoutCompactResult.compacted
                ? await adoptCompactionTranscript(timeoutCompactResult)
                : void 0;
              await runOwnsCompactionAfterHook(
                "timeout recovery",
                timeoutCompactResult,
                previousSessionId,
              );
              if (timeoutCompactResult.compacted) {
                autoCompactionCount += 1;
                if (
                  typeof timeoutCompactResult.result?.tokensAfter === "number" &&
                  Number.isFinite(timeoutCompactResult.result.tokensAfter) &&
                  timeoutCompactResult.result.tokensAfter >= 0
                )
                  lastCompactionTokensAfter = Math.floor(timeoutCompactResult.result.tokensAfter);
                if (contextEngine.info.ownsCompaction === true)
                  await runPostCompactionSideEffects({
                    config: params.config,
                    sessionKey: params.sessionKey,
                    sessionId: activeSessionId,
                    agentId: sessionAgentId,
                    sessionFile: activeSessionFile,
                  });
                log$1.info(
                  `[timeout-compaction] compaction succeeded for ${provider}/${modelId}; retrying prompt`,
                );
                postCompactionGuard.armPostCompaction();
                continue;
              } else
                log$1.warn(
                  `[timeout-compaction] compaction did not reduce context for ${provider}/${modelId}; falling through to normal handling`,
                );
            }
          }
          const contextOverflowError =
            !aborted && !signalOwnedInterruption
              ? (() => {
                  if (promptError) {
                    const errorText = formatErrorMessage(promptError);
                    if (isLikelyContextOverflowError(errorText))
                      return {
                        text: errorText,
                        source: "promptError",
                      };
                    return null;
                  }
                  if (assistantErrorText && isLikelyContextOverflowError(assistantErrorText))
                    return {
                      text: assistantErrorText,
                      source: "assistantError",
                    };
                  return null;
                })()
              : null;
          if (
            contextOverflowError &&
            genericCompactionRecoveryAllowed &&
            contextTokenBudget !== void 0
          ) {
            const overflowDiagId = createCompactionDiagId();
            const errorText = contextOverflowError.text;
            const msgCount = attempt.messagesSnapshot?.length ?? 0;
            const observedOverflowTokens = extractObservedOverflowTokenCount(errorText);
            const preflightEstimatedPromptTokens =
              typeof preflightRecovery?.estimatedPromptTokens === "number" &&
              Number.isFinite(preflightRecovery.estimatedPromptTokens) &&
              preflightRecovery.estimatedPromptTokens > 0
                ? Math.ceil(preflightRecovery.estimatedPromptTokens)
                : void 0;
            const overflowTokenCountForCompaction =
              observedOverflowTokens ??
              preflightEstimatedPromptTokens ??
              (contextTokenBudget > 0 ? contextTokenBudget + 1 : void 0);
            log$1.warn(
              `[context-overflow-diag] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} source=${contextOverflowError.source} messages=${msgCount} sessionFile=${activeSessionFile} diagId=${overflowDiagId} compactionAttempts=${overflowCompactionAttempts} observedTokens=${observedOverflowTokens ?? "unknown"} preflightEstimatedTokens=${preflightEstimatedPromptTokens ?? "unknown"} compactionTokens=${overflowTokenCountForCompaction ?? "unknown"} error=${truncateUtf16Safe(errorText, 200)}`,
            );
            const isCompactionFailure = isCompactionFailureError(errorText);
            const hadAttemptLevelCompaction = attemptCompactionCount > 0;
            if (
              !isCompactionFailure &&
              hadAttemptLevelCompaction &&
              overflowCompactionAttempts < MAX_OVERFLOW_COMPACTION_ATTEMPTS
            ) {
              overflowCompactionAttempts++;
              log$1.warn(
                `context overflow persisted after in-attempt compaction (attempt ${overflowCompactionAttempts}/${MAX_OVERFLOW_COMPACTION_ATTEMPTS}); retrying prompt without additional compaction for ${provider}/${modelId}`,
              );
              if (preflightRecovery?.source === "mid-turn") continueFromCurrentTranscript();
              continue;
            }
            if (
              !isCompactionFailure &&
              !hadAttemptLevelCompaction &&
              overflowCompactionAttempts < MAX_OVERFLOW_COMPACTION_ATTEMPTS
            ) {
              if (log$1.isEnabled("debug"))
                log$1.debug(
                  `[compaction-diag] decision diagId=${overflowDiagId} branch=compact isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${overflowCompactionAttempts + 1} maxAttempts=${MAX_OVERFLOW_COMPACTION_ATTEMPTS}`,
                );
              overflowCompactionAttempts++;
              log$1.warn(
                `context overflow detected (attempt ${overflowCompactionAttempts}/${MAX_OVERFLOW_COMPACTION_ATTEMPTS}); attempting auto-compaction for ${provider}/${modelId}`,
              );
              let compactResult;
              let previousSessionId;
              await runOwnsCompactionBeforeHook("overflow recovery");
              try {
                const overflowCompactionRuntimeContext = {
                  ...buildEmbeddedCompactionRuntimeContext({
                    sessionKey: params.sessionKey,
                    messageChannel: params.messageChannel,
                    messageProvider: params.messageProvider,
                    clientCaps: params.clientCaps,
                    chatType: params.chatType,
                    agentAccountId: params.agentAccountId,
                    currentChannelId: params.currentChannelId,
                    currentThreadTs: params.currentThreadTs,
                    currentMessageId: params.currentMessageId,
                    authProfileId: lastProfileId,
                    authProfileIdSource: lockedProfileId ? "user" : "auto",
                    runtimeAuthPlan: runtimePlan.auth,
                    workspaceDir: resolvedWorkspace,
                    agentDir,
                    config: params.config,
                    skillsSnapshot: params.skillsSnapshot,
                    senderId: params.senderId,
                    provider,
                    modelId,
                    harnessRuntime: agentHarness.id,
                    modelSelectionLocked: params.modelSelectionLocked,
                    modelFallbacksOverride: params.modelFallbacksOverride,
                    thinkLevel,
                    reasoningLevel: params.reasoningLevel,
                    bashElevated: params.bashElevated,
                    extraSystemPrompt: params.extraSystemPrompt,
                    sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
                    ownerNumbers: params.ownerNumbers,
                    activeProcessSessions: listActiveProcessSessionReferences({
                      scopeKey: resolveProcessToolScopeKey({
                        sessionKey: params.sandboxSessionKey?.trim() || params.sessionKey,
                        sessionId: activeSessionId,
                        agentId: sessionAgentId,
                      }),
                    }),
                  }),
                  ...resolveContextEngineCapabilities({
                    config: params.config,
                    sessionKey: params.sessionKey,
                    agentId: sessionAgentId,
                    contextEnginePluginId: resolveContextEnginePluginId(),
                    purpose: "context-engine.overflow-compaction",
                  }),
                  onCompactionHookMessages,
                  ...(attempt.promptCache ? { promptCache: attempt.promptCache } : {}),
                  runId: params.runId,
                  trigger: "overflow",
                  ...(overflowTokenCountForCompaction !== void 0
                    ? { currentTokenCount: overflowTokenCountForCompaction }
                    : {}),
                  diagId: overflowDiagId,
                  attempt: overflowCompactionAttempts,
                  maxAttempts: MAX_OVERFLOW_COMPACTION_ATTEMPTS,
                };
                const overflowCompactionRuntimeSettings = buildEmbeddedContextEngineRuntimeSettings(
                  {
                    tokenBudget: contextTokenBudget,
                    degradedReason: "context_overflow",
                  },
                );
                compactResult = await compactContextEngineWithSafetyTimeout(
                  contextEngine,
                  {
                    sessionId: activeSessionId,
                    sessionKey: resolvedSessionKey,
                    agentId: sessionAgentId,
                    sessionTarget: buildContextEngineCompactionSessionTarget({
                      agentId: sessionAgentId,
                      config: params.config,
                      sessionFile: activeSessionFile,
                      sessionId: activeSessionId,
                      sessionKey: resolvedSessionKey,
                      sessionTarget: activeSessionTarget,
                    }),
                    tokenBudget: contextTokenBudget,
                    ...(overflowTokenCountForCompaction !== void 0
                      ? { currentTokenCount: overflowTokenCountForCompaction }
                      : {}),
                    force: true,
                    compactionTarget: "budget",
                    runtimeContext: overflowCompactionRuntimeContext,
                    runtimeSettings: overflowCompactionRuntimeSettings,
                  },
                  resolveCompactionTimeoutMs(params.config),
                  params.abortSignal,
                );
                if (compactResult.ok && compactResult.compacted) {
                  previousSessionId = await adoptCompactionTranscript(compactResult);
                  await runContextEngineMaintenance({
                    contextEngine,
                    sessionId: activeSessionId,
                    sessionKey: params.sessionKey,
                    sessionTarget: activeSessionTarget,
                    sessionFile: activeSessionFile,
                    reason: "compaction",
                    runtimeContext: overflowCompactionRuntimeContext,
                    runtimeSettings: overflowCompactionRuntimeSettings,
                    config: params.config,
                    agentId: sessionAgentId,
                  });
                }
              } catch (compactErr) {
                log$1.warn(
                  `contextEngine.compact() threw during overflow recovery for ${provider}/${modelId}: ${String(compactErr)}`,
                );
                compactResult = {
                  ok: false,
                  compacted: false,
                  reason: String(compactErr),
                };
              }
              await runOwnsCompactionAfterHook(
                "overflow recovery",
                compactResult,
                previousSessionId,
              );
              if (preflightRecovery && isNoRealConversationCompactionNoop(compactResult)) {
                lastCompactionTokensAfter = void 0;
                lastContextBudgetStatus = void 0;
                await resetNoRealConversationTokenSnapshot({
                  config: params.config,
                  sessionKey: params.sessionKey,
                  agentId: sessionAgentId,
                });
                log$1.info(
                  `[context-overflow-precheck] stale token state had no real conversation messages for ${provider}/${modelId}; resetting the context snapshot and retrying prompt`,
                );
                if (preflightRecovery.source === "mid-turn") continueFromCurrentTranscript();
                continue;
              }
              if (compactResult.compacted) {
                await adoptCompactionTranscript(compactResult);
                if (
                  typeof compactResult.result?.tokensAfter === "number" &&
                  Number.isFinite(compactResult.result.tokensAfter) &&
                  compactResult.result.tokensAfter >= 0
                )
                  lastCompactionTokensAfter = Math.floor(compactResult.result.tokensAfter);
                if (preflightRecovery?.route === "compact_then_truncate") {
                  const truncResult = await truncateOversizedToolResultsInActiveTarget({
                    scope: {
                      sessionId: activeSessionId,
                      sessionKey: params.sessionKey ?? activeSessionId,
                      sessionFile: activeSessionFile,
                      agentId: sessionAgentId,
                    },
                    contextWindowTokens: contextTokenBudget,
                    maxCharsOverride: resolveLiveToolResultMaxChars({
                      contextWindowTokens: contextTokenBudget,
                      cfg: params.config,
                      agentId: sessionAgentId,
                    }),
                    config: params.config,
                    protectTrailingToolResults: true,
                  });
                  if (truncResult.truncated)
                    log$1.info(
                      `[context-overflow-precheck] post-compaction tool-result truncation succeeded for ${provider}/${modelId}; truncated ${truncResult.truncatedCount} tool result(s)`,
                    );
                  else
                    log$1.warn(
                      `[context-overflow-precheck] post-compaction tool-result truncation did not help for ${provider}/${modelId}: ${truncResult.reason ?? "unknown"}`,
                    );
                }
                autoCompactionCount += 1;
                log$1.info(`auto-compaction succeeded for ${provider}/${modelId}; retrying prompt`);
                postCompactionGuard.armPostCompaction();
                if (preflightRecovery?.source === "mid-turn") continueFromCurrentTranscript();
                else {
                  await waitForCurrentUserMessagePersistence();
                  if (activePrompt.internal)
                    suppressNextUserMessagePersistence = activePrompt.persisted;
                  else if (activePrompt.persisted)
                    activateInternalPrompt(MID_TURN_PRECHECK_CONTINUATION_PROMPT, true);
                }
                continue;
              }
              log$1.warn(
                `auto-compaction failed for ${provider}/${modelId}: ${compactResult.reason ?? "nothing to compact"}`,
              );
            }
            if (!toolResultTruncationAttempted) {
              const contextWindowTokens = contextTokenBudget;
              const toolResultMaxChars = resolveLiveToolResultMaxChars({
                contextWindowTokens,
                cfg: params.config,
                agentId: sessionAgentId,
              });
              if (
                attempt.messagesSnapshot
                  ? sessionLikelyHasOversizedToolResults({
                      messages: attempt.messagesSnapshot,
                      contextWindowTokens,
                      maxCharsOverride: toolResultMaxChars,
                    })
                  : false
              ) {
                toolResultTruncationAttempted = true;
                log$1.warn(
                  `[context-overflow-recovery] Attempting tool result truncation for ${provider}/${modelId} (contextWindow=${contextWindowTokens} tokens)`,
                );
                const truncResult = await truncateOversizedToolResultsInActiveTarget({
                  scope: {
                    sessionId: activeSessionId,
                    sessionKey: params.sessionKey ?? activeSessionId,
                    sessionFile: activeSessionFile,
                    agentId: sessionAgentId,
                  },
                  contextWindowTokens,
                  maxCharsOverride: toolResultMaxChars,
                  config: params.config,
                  protectTrailingToolResults: preflightRecovery?.route === "compact_then_truncate",
                });
                if (truncResult.truncated) {
                  log$1.info(
                    `[context-overflow-recovery] Truncated ${truncResult.truncatedCount} tool result(s); retrying prompt`,
                  );
                  if (preflightRecovery?.source === "mid-turn") continueFromCurrentTranscript();
                  continue;
                }
                log$1.warn(
                  `[context-overflow-recovery] Tool result truncation did not help: ${truncResult.reason ?? "unknown"}`,
                );
              }
            }
            if (
              (isCompactionFailure ||
                overflowCompactionAttempts >= MAX_OVERFLOW_COMPACTION_ATTEMPTS) &&
              log$1.isEnabled("debug")
            )
              log$1.debug(
                `[compaction-diag] decision diagId=${overflowDiagId} branch=give_up isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${overflowCompactionAttempts} maxAttempts=${MAX_OVERFLOW_COMPACTION_ATTEMPTS}`,
              );
            const kind = isCompactionFailure ? "compaction_failure" : "context_overflow";
            const overflowRecoveryText =
              "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
            log$1.warn(
              `[context-overflow-recovery] exhausted provider overflow recovery for ${provider}/${modelId}; livenessState=blocked suggestedAction=reset_or_new kind=${kind}`,
            );
            setTerminalLifecycleMeta({
              replayInvalid: resolveReplayInvalidForAttempt(),
              livenessState: "blocked",
            });
            return {
              payloads: [
                {
                  text: overflowRecoveryText,
                  isError: true,
                },
              ],
              meta: {
                durationMs: Date.now() - started,
                agentMeta: buildErrorAgentMeta({
                  sessionId: sessionIdUsed,
                  sessionFile: activeSessionFile,
                  provider,
                  model: model.id,
                  ...outerContextTokenMeta,
                  usageAccumulator,
                  lastRunPromptUsage,
                  lastAssistant: attemptAssistant,
                  lastTurnTotal,
                }),
                systemPromptReport: attempt.systemPromptReport,
                finalAssistantVisibleText: overflowRecoveryText,
                finalAssistantRawText: overflowRecoveryText,
                finalPromptText: attempt.finalPromptText,
                replayInvalid: resolveReplayInvalidForAttempt(),
                livenessState: "blocked",
                error: {
                  kind,
                  message: errorText,
                },
              },
            };
          }
          if (promptErrorSource === "hook:before_agent_run" && !terminalInterrupted) {
            const errorText = formatErrorMessage(promptError);
            const replayInvalid = resolveReplayInvalidForAttempt();
            setTerminalLifecycleMeta({
              replayInvalid,
              livenessState: "blocked",
            });
            return {
              payloads: [
                {
                  text: errorText,
                  isError: true,
                },
              ],
              meta: {
                durationMs: Date.now() - started,
                agentMeta: buildErrorAgentMeta({
                  sessionId: sessionIdUsed,
                  sessionFile: activeSessionFile,
                  provider,
                  model: model.id,
                  ...outerContextTokenMeta,
                  usageAccumulator,
                  lastRunPromptUsage,
                  lastAssistant: attemptAssistant,
                  lastTurnTotal,
                }),
                systemPromptReport: attempt.systemPromptReport,
                finalAssistantVisibleText: errorText,
                finalAssistantRawText: errorText,
                finalPromptText: void 0,
                replayInvalid,
                livenessState: "blocked",
                error: {
                  kind: "hook_block",
                  message: errorText,
                },
              },
            };
          }
          const hasRecoverableCodexAppServerTimeoutOutcome = Boolean(
            attempt.codexAppServerFailure && attempt.promptTimeoutOutcome,
          );
          let shouldSurfaceCodexCompletionTimeout = false;
          if (promptError && promptErrorSource !== "compaction" && attempt.codexAppServerFailure) {
            if (
              resolveCodexAppServerRecoveryRetry({
                attempt,
                retryAvailable: codexAppServerRecoveryRetryAvailable,
              }).retry
            ) {
              throwIfAborted();
              codexAppServerRecoveryRetries += 1;
              suppressNextUserMessagePersistence = true;
              log$1.warn(
                `codex app-server replay-safe failure; retrying once failureKind=${attempt.codexAppServerFailure?.kind} runId=${params.runId} sessionId=${params.sessionId}`,
              );
              continue;
            }
            shouldSurfaceCodexCompletionTimeout =
              attempt.codexAppServerFailure?.kind === "turn_completion_idle_timeout" &&
              attempt.timedOut;
            if (
              attempt.codexAppServerFailure &&
              !hasRecoverableCodexAppServerTimeoutOutcome &&
              !shouldSurfaceCodexCompletionTimeout
            )
              throw toErrorObject(promptError, "Prompt failed");
          }
          if (
            promptError &&
            !terminalInterrupted &&
            promptErrorSource !== "compaction" &&
            !hasRecoverableCodexAppServerTimeoutOutcome &&
            !shouldSurfaceCodexCompletionTimeout
          ) {
            const promptAuthMode = lastProfileId
              ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type
              : void 0;
            const normalizedPromptFailover = coerceToFailoverError(promptError, {
              provider: activeErrorContext.provider,
              model: activeErrorContext.model,
              profileId: lastProfileId,
              authMode: promptAuthMode,
              sessionId: sessionIdUsed,
              lane: globalLane,
            });
            const promptErrorDetails = normalizedPromptFailover
              ? describeFailoverError(normalizedPromptFailover)
              : describeFailoverError(promptError);
            if (normalizedPromptFailover?.suspend)
              suspendForFailure({
                cfg: params.config,
                agentDir,
                sessionId: activeSessionId ?? params.sessionId,
                reason: resolveSessionSuspensionReason(normalizedPromptFailover.reason),
                failedProvider: normalizedPromptFailover.provider ?? provider,
                failedModel: normalizedPromptFailover.model ?? modelId,
              });
            const errorText = promptErrorDetails.message || formatErrorMessage(promptError);
            if (await maybeRefreshRuntimeAuthForAuthError(errorText, runtimeAuthRetry)) {
              authRetryPending = true;
              continue;
            }
            if (/incorrect role information|roles must alternate/i.test(errorText)) {
              setTerminalLifecycleMeta({
                replayInvalid: resolveReplayInvalidForAttempt(),
                livenessState: "blocked",
              });
              return {
                payloads: [
                  {
                    text: "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.",
                    isError: true,
                  },
                ],
                meta: {
                  durationMs: Date.now() - started,
                  agentMeta: buildErrorAgentMeta({
                    sessionId: sessionIdUsed,
                    sessionFile: activeSessionFile,
                    provider,
                    model: model.id,
                    ...outerContextTokenMeta,
                    usageAccumulator,
                    lastRunPromptUsage,
                    lastAssistant: attemptAssistant,
                    lastTurnTotal,
                  }),
                  systemPromptReport: attempt.systemPromptReport,
                  finalPromptText: attempt.finalPromptText,
                  replayInvalid: resolveReplayInvalidForAttempt(),
                  livenessState: "blocked",
                  error: {
                    kind: "role_ordering",
                    message: errorText,
                  },
                },
              };
            }
            const imageSizeError = parseImageSizeError(errorText);
            if (imageSizeError) {
              const maxMb = imageSizeError.maxMb;
              const maxMbLabel =
                typeof maxMb === "number" && Number.isFinite(maxMb) ? `${maxMb}` : null;
              const maxBytesHint = maxMbLabel ? ` (max ${maxMbLabel}MB)` : "";
              setTerminalLifecycleMeta({
                replayInvalid: resolveReplayInvalidForAttempt(),
                livenessState: "blocked",
              });
              return {
                payloads: [
                  {
                    text: `Image too large for the model${maxBytesHint}. Please compress or resize the image and try again.`,
                    isError: true,
                  },
                ],
                meta: {
                  durationMs: Date.now() - started,
                  agentMeta: buildErrorAgentMeta({
                    sessionId: sessionIdUsed,
                    sessionFile: activeSessionFile,
                    provider,
                    model: model.id,
                    ...outerContextTokenMeta,
                    usageAccumulator,
                    lastRunPromptUsage,
                    lastAssistant: attemptAssistant,
                    lastTurnTotal,
                  }),
                  systemPromptReport: attempt.systemPromptReport,
                  finalPromptText: attempt.finalPromptText,
                  replayInvalid: resolveReplayInvalidForAttempt(),
                  livenessState: "blocked",
                  error: {
                    kind: "image_size",
                    message: errorText,
                  },
                },
              };
            }
            const promptFailoverReason =
              promptErrorDetails.reason ?? classifyFailoverReason(errorText, { provider });
            const promptProfileFailureReason = resolveRunAuthProfileFailureReason(
              promptFailoverReason,
              {
                providerStarted: promptErrorSource === "prompt",
                transientRateLimit:
                  promptFailoverReason === "rate_limit" && isShortWindowRateLimitMessage(errorText),
              },
            );
            const promptFailoverFailure =
              promptFailoverReason !== null || isFailoverErrorMessage(errorText, { provider });
            const promptTimeoutFallbackSafe =
              promptErrorSource === "prompt" &&
              promptFailoverReason === "timeout" &&
              !attempt.codexAppServerFailure &&
              attempt.promptTimeoutOutcome?.replayInvalid !== true &&
              attempt.replayMetadata.replaySafe;
            const failedPromptProfileId = lastProfileId;
            const logPromptFailoverDecision = createFailoverDecisionLogger({
              stage: "prompt",
              runId: params.runId,
              rawError: errorText,
              failoverReason: promptFailoverReason,
              profileFailureReason: promptProfileFailureReason,
              provider,
              model: modelId,
              sourceProvider: provider,
              sourceModel: modelId,
              profileId: failedPromptProfileId,
              fallbackConfigured,
              aborted,
            });
            if (promptFailoverReason === "rate_limit")
              maybeEscalateRateLimitProfileFallback({
                failoverProvider: provider,
                failoverModel: modelId,
                logFallbackDecision: logPromptFailoverDecision,
              });
            let promptFailoverDecision = resolveRunFailoverDecision({
              stage: "prompt",
              aborted,
              externalAbort,
              fallbackConfigured,
              failoverCode: promptErrorDetails.code,
              failoverFailure: promptFailoverFailure,
              failoverReason: promptFailoverReason,
              harnessOwnsTransport: pluginHarnessOwnsTransport,
              promptTimeoutFallbackSafe,
              timedOutByRunBudget,
              profileRotated: false,
            });
            if (
              promptFailoverDecision.action === "rotate_profile" &&
              (await advanceAttemptAuthProfile())
            ) {
              if (failedPromptProfileId && promptProfileFailureReason)
                maybeMarkAuthProfileFailure({
                  profileId: failedPromptProfileId,
                  reason: promptProfileFailureReason,
                  modelId,
                }).catch((err) => {
                  log$1.warn(`prompt profile failure mark failed: ${String(err)}`);
                });
              traceAttempts.push({
                provider,
                model: modelId,
                result: promptFailoverReason === "timeout" ? "timeout" : "rotate_profile",
                ...(promptFailoverReason ? { reason: promptFailoverReason } : {}),
                stage: "prompt",
              });
              lastRetryFailoverReason = mergeRetryFailoverReason({
                previous: lastRetryFailoverReason,
                failoverReason: promptFailoverReason,
              });
              logPromptFailoverDecision("rotate_profile");
              await maybeBackoffBeforeOverloadFailover(promptFailoverReason);
              continue;
            }
            if (promptFailoverDecision.action === "rotate_profile")
              promptFailoverDecision = resolveRunFailoverDecision({
                stage: "prompt",
                aborted,
                externalAbort,
                fallbackConfigured,
                failoverCode: promptErrorDetails.code,
                failoverFailure: promptFailoverFailure,
                failoverReason: promptFailoverReason,
                harnessOwnsTransport: pluginHarnessOwnsTransport,
                promptTimeoutFallbackSafe,
                timedOutByRunBudget,
                profileRotated: true,
              });
            if (failedPromptProfileId && promptProfileFailureReason)
              try {
                await maybeMarkAuthProfileFailure({
                  profileId: failedPromptProfileId,
                  reason: promptProfileFailureReason,
                  modelId,
                });
              } catch (err) {
                log$1.warn(`prompt profile failure mark failed: ${String(err)}`);
              }
            const fallbackThinking = pickFallbackThinkingLevel({
              message: errorText,
              attempted: attemptedThinking,
            });
            if (fallbackThinking) {
              log$1.warn(
                `unsupported thinking level for ${provider}/${modelId}; retrying with ${fallbackThinking}`,
              );
              thinkLevel = fallbackThinking;
              continue;
            }
            if (promptFailoverDecision.action === "fallback_model") {
              const fallbackReason = promptFailoverDecision.reason ?? "unknown";
              const status = resolveFailoverStatus(fallbackReason);
              traceAttempts.push({
                provider,
                model: modelId,
                result: promptFailoverReason === "timeout" ? "timeout" : "fallback_model",
                reason: fallbackReason,
                stage: "prompt",
                ...(typeof status === "number" ? { status } : {}),
              });
              logPromptFailoverDecision("fallback_model", { status });
              await maybeBackoffBeforeOverloadFailover(promptFailoverReason);
              throw (
                normalizedPromptFailover ??
                new FailoverError(errorText, {
                  reason: fallbackReason,
                  provider,
                  model: modelId,
                  profileId: lastProfileId,
                  authMode: promptAuthMode,
                  sessionId: sessionIdUsed,
                  lane: globalLane,
                  status,
                })
              );
            }
            if (promptFailoverDecision.action === "surface_error") {
              traceAttempts.push({
                provider,
                model: modelId,
                result: promptFailoverReason === "timeout" ? "timeout" : "surface_error",
                ...(promptFailoverReason ? { reason: promptFailoverReason } : {}),
                stage: "prompt",
              });
              logPromptFailoverDecision("surface_error");
            }
            throw toErrorObject(promptError, "Prompt failed");
          }
          const fallbackThinking = pickFallbackThinkingLevel({
            message: attemptAssistant?.errorMessage,
            attempted: attemptedThinking,
          });
          if (fallbackThinking && !terminalInterrupted) {
            log$1.warn(
              `unsupported thinking level for ${provider}/${modelId}; retrying with ${fallbackThinking}`,
            );
            thinkLevel = fallbackThinking;
            continue;
          }
          const authFailure = isAuthAssistantError(attemptAssistant);
          const rateLimitFailure = isRateLimitAssistantError(attemptAssistant);
          const billingFailure = isBillingAssistantError(attemptAssistant);
          const failoverFailure = isFailoverAssistantError(attemptAssistant);
          const assistantFailoverReason = classifyAssistantFailoverReason(attemptAssistant);
          const assistantProviderStarted =
            Boolean(currentAttemptAssistant?.provider) || terminalOutcome.providerStarted === true;
          const assistantProfileFailoverReason =
            assistantFailoverReason ??
            (assistantProviderStarted && (timedOut || idleTimedOut) ? "timeout" : null);
          const assistantProfileFailureReason = resolveRunAuthProfileFailureReason(
            assistantProfileFailoverReason,
            {
              providerStarted: assistantProviderStarted,
              transientRateLimit:
                assistantProfileFailoverReason === "rate_limit" &&
                isShortWindowRateLimitMessage(attemptAssistant?.errorMessage),
            },
          );
          const cloudCodeAssistFormatError = attempt.cloudCodeAssistFormatError;
          const imageDimensionError = parseImageDimensionError(
            attemptAssistant?.errorMessage ?? "",
          );
          const genericUnknownReasoningError =
            assistantFailoverReason === "timeout" &&
            isGenericUnknownStreamErrorMessage(attemptAssistant?.errorMessage ?? "") &&
            Boolean(attemptAssistant && hasOnlyAssistantReasoningContent(attemptAssistant));
          if (
            !authFailure &&
            !rateLimitFailure &&
            !billingFailure &&
            !cloudCodeAssistFormatError &&
            !imageDimensionError &&
            !terminalInterrupted &&
            !promptError &&
            (assistantFailoverReason === null ||
              genericUnknownReasoningError ||
              assistantFailoverReason === "no_error_details" ||
              assistantFailoverReason === "unclassified" ||
              assistantFailoverReason === "unknown" ||
              assistantFailoverReason === "server_error") &&
            shouldRetrySilentErrorAssistantTurn({
              attempt,
              assistant: attemptAssistant,
            }) &&
            emptyErrorRetries < MAX_EMPTY_ERROR_RETRIES
          ) {
            emptyErrorRetries += 1;
            log$1.warn(
              `[empty-error-retry] stopReason=error non-visible-output; resubmitting attempt=${emptyErrorRetries}/${MAX_EMPTY_ERROR_RETRIES} provider=${attemptAssistant?.provider ?? provider} model=${attemptAssistant?.model ?? model.id} sessionKey=${params.sessionKey ?? params.sessionId}`,
            );
            continue;
          }
          const failedAssistantProfileId = lastProfileId;
          const logAssistantFailoverDecision = createFailoverDecisionLogger({
            stage: "assistant",
            runId: params.runId,
            rawError: attemptAssistant?.errorMessage?.trim(),
            failoverReason: assistantFailoverReason,
            profileFailureReason: assistantProfileFailureReason,
            provider: activeErrorContext.provider,
            model: activeErrorContext.model,
            sourceProvider: attemptAssistant?.provider ?? provider,
            sourceModel: attemptAssistant?.model ?? modelId,
            profileId: failedAssistantProfileId,
            fallbackConfigured,
            timedOut,
            aborted,
          });
          if (
            !signalOwnedInterruption &&
            authFailure &&
            (await maybeRefreshRuntimeAuthForAuthError(
              attemptAssistant?.errorMessage ?? "",
              runtimeAuthRetry,
            ))
          ) {
            authRetryPending = true;
            continue;
          }
          if (imageDimensionError && lastProfileId) {
            const details = [
              imageDimensionError.messageIndex !== void 0
                ? `message=${imageDimensionError.messageIndex}`
                : null,
              imageDimensionError.contentIndex !== void 0
                ? `content=${imageDimensionError.contentIndex}`
                : null,
              imageDimensionError.maxDimensionPx !== void 0
                ? `limit=${imageDimensionError.maxDimensionPx}px`
                : null,
            ]
              .filter(Boolean)
              .join(" ");
            log$1.warn(
              `Profile ${lastProfileId} rejected image payload${details ? ` (${details})` : ""}.`,
            );
          }
          const assistantFailoverDecision = resolveRunFailoverDecision({
            stage: "assistant",
            allowFormatRetry: cloudCodeAssistFormatError,
            aborted,
            externalAbort: externalAbort || signalOwnedInterruption,
            fallbackConfigured,
            failoverFailure,
            failoverReason: assistantFailoverReason,
            timedOut,
            idleTimedOut,
            timedOutDuringCompaction,
            timedOutDuringToolExecution,
            harnessOwnsTransport: pluginHarnessOwnsTransport,
            timedOutByRunBudget,
            profileRotated: false,
          });
          const assistantFailoverOutcome = await handleAssistantFailover({
            initialDecision: assistantFailoverDecision,
            aborted,
            externalAbort: externalAbort || signalOwnedInterruption,
            fallbackConfigured,
            failoverFailure,
            failoverReason: assistantFailoverReason,
            timedOut,
            idleTimedOut,
            timedOutDuringCompaction,
            timedOutDuringToolExecution,
            timedOutByRunBudget,
            allowSameModelIdleTimeoutRetry:
              timedOut &&
              idleTimedOut &&
              !timedOutDuringCompaction &&
              !fallbackConfigured &&
              canRestartForLiveSwitch &&
              sameModelIdleTimeoutRetries < MAX_SAME_MODEL_IDLE_TIMEOUT_RETRIES,
            allowSameModelRateLimitRetry: rateLimitProfileRotations < rateLimitProfileRotationLimit,
            assistantProfileFailureReason,
            lastProfileId,
            modelId,
            provider,
            activeErrorContext,
            lastAssistant: attemptAssistant,
            config: params.config,
            sessionKey: params.sessionKey ?? params.sessionId,
            authFailure,
            rateLimitFailure,
            billingFailure,
            authMode: lastProfileId
              ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type
              : void 0,
            cloudCodeAssistFormatError,
            isProbeSession,
            overloadProfileRotations,
            overloadProfileRotationLimit,
            previousRetryFailoverReason: lastRetryFailoverReason,
            logAssistantFailoverDecision,
            warn: (message) => log$1.warn(message),
            maybeMarkAuthProfileFailure,
            maybeEscalateRateLimitProfileFallback,
            maybeRetrySameModelRateLimit,
            maybeBackoffBeforeOverloadFailover,
            advanceAuthProfile: advanceAttemptAuthProfile,
          });
          overloadProfileRotations = assistantFailoverOutcome.overloadProfileRotations;
          if (assistantFailoverOutcome.action === "retry") {
            const retryTraceResult =
              assistantFailoverOutcome.retryKind === "same_model_rate_limit"
                ? "same_model_rate_limit"
                : assistantFailoverOutcome.retryKind === "same_model_idle_timeout" ||
                    assistantFailoverReason === "timeout"
                  ? "timeout"
                  : "rotate_profile";
            traceAttempts.push({
              provider: activeErrorContext.provider,
              model: activeErrorContext.model,
              result: retryTraceResult,
              ...(assistantFailoverReason ? { reason: assistantFailoverReason } : {}),
              stage: "assistant",
            });
            if (assistantFailoverOutcome.retryKind === "same_model_idle_timeout")
              sameModelIdleTimeoutRetries += 1;
            if (assistantFailoverOutcome.retryKind !== "same_model_rate_limit")
              consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
                retriesSoFar: consecutiveSameModelRateLimitRetries,
                retriedSameModelRateLimit: false,
              });
            lastRetryFailoverReason = assistantFailoverOutcome.lastRetryFailoverReason;
            continue;
          }
          consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
            retriesSoFar: consecutiveSameModelRateLimitRetries,
            retriedSameModelRateLimit: false,
          });
          if (assistantFailoverOutcome.action === "throw") {
            traceAttempts.push({
              provider: activeErrorContext.provider,
              model: activeErrorContext.model,
              result:
                assistantFailoverReason === "timeout"
                  ? "timeout"
                  : assistantFailoverDecision.action === "fallback_model"
                    ? "fallback_model"
                    : "error",
              ...(assistantFailoverReason ? { reason: assistantFailoverReason } : {}),
              stage: "assistant",
              ...(typeof assistantFailoverOutcome.error.status === "number"
                ? { status: assistantFailoverOutcome.error.status }
                : {}),
            });
            if (assistantFailoverOutcome.error.suspend)
              suspendForFailure({
                cfg: params.config,
                agentDir,
                sessionId: activeSessionId ?? params.sessionId,
                reason: resolveSessionSuspensionReason(assistantFailoverOutcome.error.reason),
                failedProvider: assistantFailoverOutcome.error.provider ?? provider,
                failedModel: assistantFailoverOutcome.error.model ?? modelId,
              });
            throw assistantFailoverOutcome.error;
          }
          const usageMeta = buildUsageAgentMetaFields({
            usageAccumulator,
            lastAssistantUsage: attemptAssistant?.usage,
            lastRunPromptUsage,
            lastTurnTotal,
          });
          const reportedModelRef = resolveReportedModelRef({
            provider,
            model: model.id,
            assistant: attemptAssistant,
          });
          const agentMeta = {
            sessionId: sessionIdUsed,
            sessionFile: sessionFileUsed,
            provider: reportedModelRef.provider,
            model: reportedModelRef.model,
            ...outerContextTokenMeta,
            agentHarnessId: attempt.agentHarnessId,
            usage: usageMeta.usage,
            lastCallUsage: usageMeta.lastCallUsage,
            promptTokens: usageMeta.promptTokens,
            ...(lastContextBudgetStatus ? { contextBudgetStatus: lastContextBudgetStatus } : {}),
            compactionCount: autoCompactionCount > 0 ? autoCompactionCount : void 0,
            compactionTokensAfter: lastCompactionTokensAfter,
          };
          const finalAssistantVisibleText = resolveFinalAssistantVisibleText(attemptAssistant);
          const finalAssistantRawText = resolveFinalAssistantRawText(attemptAssistant);
          const payloads = buildEmbeddedRunPayloads({
            assistantTexts: attempt.assistantTexts,
            assistantMessageIndex: attempt.lastAssistantTextMessageIndex,
            assistantTranscriptOwned: attempt.assistantTranscriptOwned,
            toolMetas: attempt.toolMetas,
            lastAssistant: attempt.lastAssistant,
            currentAssistant: currentAttemptAssistant ?? null,
            lastToolError: attempt.lastToolError,
            config: params.config,
            isCronTrigger: params.trigger === "cron",
            isHeartbeatTrigger: params.trigger === "heartbeat",
            sessionKey: params.sessionKey ?? params.sessionId,
            provider: activeErrorContext.provider,
            model: activeErrorContext.model,
            authMode: lastProfileId
              ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type
              : void 0,
            verboseLevel: params.verboseLevel,
            reasoningLevel: params.reasoningLevel,
            thinkingLevel: params.thinkLevel,
            toolResultFormat: resolvedToolResultFormat,
            suppressToolErrorWarnings: params.suppressToolErrorWarnings,
            inlineToolResultsAllowed: false,
            didSendViaMessagingTool: attempt.didSendViaMessagingTool,
            didDeliverSourceReplyViaMessageTool:
              attempt.didDeliverSourceReplyViaMessageTool === true,
            messagingToolSentTargets: attempt.messagingToolSentTargets,
            messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
            sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
            agentId: params.agentId,
            runId: params.runId,
            runAborted: terminalInterrupted,
            didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
            heartbeatToolResponse: attempt.heartbeatToolResponse,
          });
          const payloadsWithToolMedia = mergeAttemptToolMediaPayloads({
            payloads,
            toolMediaUrls: attempt.toolMediaUrls,
            toolAudioAsVoice: attempt.toolAudioAsVoice,
            toolTrustedLocalMedia: attempt.toolTrustedLocalMedia,
            sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
          });
          const timedOutDuringPrompt =
            terminalTimedOut && !timedOutDuringCompaction && !timedOutDuringToolExecution;
          const finalAssistantStopReason = (attemptAssistant?.stopReason ?? "")
            .trim()
            .toLowerCase();
          const recoveredFinalAssistantTextAfterPromptTimeout =
            timedOutDuringPrompt &&
            ["completed", "end_turn", "stop"].includes(finalAssistantStopReason)
              ? (finalAssistantVisibleText ?? finalAssistantRawText)?.trim()
              : void 0;
          const payloadAlreadyContainsRecoveredFinalAssistant =
            recoveredFinalAssistantTextAfterPromptTimeout
              ? (payloadsWithToolMedia ?? []).some(
                  (payload) =>
                    payload?.isError !== true &&
                    payload?.isReasoning !== true &&
                    typeof payload.text === "string" &&
                    payload.text.trim() === recoveredFinalAssistantTextAfterPromptTimeout,
                )
              : false;
          const recoveredFinalAssistantPayloadsAfterPromptTimeout =
            recoveredFinalAssistantTextAfterPromptTimeout &&
            !payloadAlreadyContainsRecoveredFinalAssistant
              ? [{ text: recoveredFinalAssistantTextAfterPromptTimeout }]
              : void 0;
          const hasSuccessfulFinalAssistantAfterPromptTimeout =
            timedOutDuringPrompt &&
            Boolean(
              payloadAlreadyContainsRecoveredFinalAssistant ||
              recoveredFinalAssistantPayloadsAfterPromptTimeout?.length,
            );
          const hasPartialAssistantTextAfterPromptTimeout =
            timedOutDuringPrompt &&
            (attempt.assistantTexts ?? []).some((text) => text.trim().length > 0) &&
            !attempt.clientToolCalls &&
            !attempt.yieldDetected &&
            !attempt.didSendViaMessagingTool &&
            !attempt.didSendDeterministicApprovalPrompt &&
            !attempt.lastToolError &&
            (attempt.toolMetas?.length ?? 0) === 0;
          const attemptToolSummary = buildTraceToolSummary({
            toolMetas: attempt.toolMetas,
            fallbackHadFailure: Boolean(attempt.lastToolError),
          });
          const failureSignal = resolveEmbeddedRunFailureSignal({
            trigger: params.trigger,
            lastToolError: attempt.lastToolError,
          });
          if (
            timedOutDuringPrompt &&
            !hasSuccessfulFinalAssistantAfterPromptTimeout &&
            (shouldSurfaceCodexCompletionTimeout || !hasMessagingToolDeliveryEvidence(attempt))
          ) {
            const defaultTimeoutText = idleTimedOut
              ? "The model did not produce a response before the model idle timeout. Please try again, or increase `models.providers.<id>.timeoutSeconds` for slow local or self-hosted providers. If `agents.defaults.timeoutSeconds` or a run-specific timeout is lower, raise that ceiling too; provider timeouts cannot extend the whole agent run."
              : "Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.";
            const timeoutText = attempt.promptTimeoutOutcome?.message?.trim() || defaultTimeoutText;
            const replayInvalid =
              attempt.promptTimeoutOutcome?.replayInvalid ?? resolveReplayInvalidForAttempt(null);
            const livenessState =
              attempt.promptTimeoutOutcome?.livenessState ??
              resolveRunLivenessState({
                payloadCount: hasPartialAssistantTextAfterPromptTimeout ? 0 : payloads.length,
                aborted: terminalAborted,
                timedOut: terminalTimedOut,
                attempt,
                incompleteTurnText: null,
              });
            const timeoutPhase =
              attempt.promptTimeoutOutcome?.timeoutPhase ?? terminalOutcome.timeoutPhase;
            const providerStarted =
              attempt.promptTimeoutOutcome?.providerStarted ?? terminalOutcome.providerStarted;
            const timeoutAttribution = {
              ...(timeoutPhase ? { timeoutPhase } : {}),
              ...(typeof providerStarted === "boolean" ? { providerStarted } : {}),
            };
            setTerminalLifecycleMeta({
              replayInvalid,
              livenessState,
              ...timeoutAttribution,
            });
            return {
              payloads: [
                ...(hasPartialAssistantTextAfterPromptTimeout ? [] : payloadsWithToolMedia || []),
                {
                  text: timeoutText,
                  isError: true,
                },
              ],
              meta: {
                durationMs: Date.now() - started,
                agentMeta,
                aborted: terminalAborted,
                systemPromptReport: attempt.systemPromptReport,
                finalPromptText: attempt.finalPromptText,
                finalAssistantVisibleText,
                finalAssistantRawText,
                replayInvalid,
                livenessState,
                ...timeoutAttribution,
                ...(shouldSurfaceCodexCompletionTimeout
                  ? {
                      error: {
                        kind: "incomplete_turn",
                        message: timeoutText,
                        fallbackSafe: false,
                      },
                    }
                  : {}),
                toolSummary: attemptToolSummary,
                ...(failureSignal ? { failureSignal } : {}),
                agentHarnessResultClassification: attempt.agentHarnessResultClassification,
              },
              didSendViaMessagingTool: attempt.didSendViaMessagingTool,
              didDeliverSourceReplyViaMessageTool:
                attempt.didDeliverSourceReplyViaMessageTool === true,
              didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
              messagingToolSentTexts: attempt.messagingToolSentTexts,
              messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
              messagingToolSentTargets: attempt.messagingToolSentTargets,
              messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
              heartbeatToolResponse: attempt.heartbeatToolResponse,
              successfulCronAdds: attempt.successfulCronAdds,
              acceptedSessionSpawns: attempt.acceptedSessionSpawns,
            };
          }
          const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
            isCronTrigger: params.trigger === "cron",
            payloadCount: payloadsWithToolMedia?.length ?? 0,
            aborted: terminalAborted,
            timedOut: terminalTimedOut,
            attempt,
          });
          const payloadsForTerminalPath = recoveredFinalAssistantPayloadsAfterPromptTimeout
            ? recoveredFinalAssistantPayloadsAfterPromptTimeout
            : payloadsWithToolMedia?.length
              ? payloadsWithToolMedia
              : silentToolResultReplyPayload
                ? [silentToolResultReplyPayload]
                : payloadsWithToolMedia;
          const payloadCount = payloadsForTerminalPath?.length ?? 0;
          const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
            allowEmptyAssistantReplyAsSilent: params.allowEmptyAssistantReplyAsSilent,
            payloadCount,
            aborted: terminalAborted,
            timedOut: terminalTimedOut,
            attempt,
          });
          const nextReasoningOnlyRetryInstruction = emptyAssistantReplyIsSilent
            ? null
            : resolveReasoningOnlyRetryInstruction({
                provider: activeErrorContext.provider,
                modelId: activeErrorContext.model,
                modelApi: effectiveModel.api,
                executionContract,
                aborted: terminalAborted,
                timedOut: terminalTimedOut,
                attempt,
              });
          const nextEmptyResponseRetryInstruction = emptyAssistantReplyIsSilent
            ? null
            : resolveEmptyResponseRetryInstruction({
                provider: activeErrorContext.provider,
                modelId: activeErrorContext.model,
                modelApi: effectiveModel.api,
                executionContract,
                payloadCount,
                aborted: terminalAborted,
                timedOut: terminalTimedOut,
                attempt,
              });
          if (
            nextReasoningOnlyRetryInstruction &&
            reasoningOnlyRetryAttempts < maxReasoningOnlyRetryAttempts
          ) {
            reasoningOnlyRetryAttempts += 1;
            activateInternalPrompt(nextReasoningOnlyRetryInstruction, false);
            log$1.warn(
              `reasoning-only assistant turn detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} — retrying ${reasoningOnlyRetryAttempts}/${maxReasoningOnlyRetryAttempts} with visible-answer continuation`,
            );
            continue;
          }
          const reasoningOnlyRetriesExhausted =
            nextReasoningOnlyRetryInstruction &&
            reasoningOnlyRetryAttempts >= maxReasoningOnlyRetryAttempts;
          if (
            !emptyAssistantReplyIsSilent &&
            shouldRetryMissingAssistantTurn({
              payloadCount,
              aborted: terminalAborted,
              promptError,
              timedOut: terminalTimedOut,
              attempt,
            }) &&
            missingAssistantRetryAttempts < MAX_MISSING_ASSISTANT_RETRIES
          ) {
            missingAssistantRetryAttempts += 1;
            suppressNextUserMessagePersistence = activePrompt.persisted;
            log$1.warn(
              `missing assistant terminal message detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} — retrying ${missingAssistantRetryAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} with same prompt`,
            );
            continue;
          }
          if (
            !nextReasoningOnlyRetryInstruction &&
            nextEmptyResponseRetryInstruction &&
            emptyResponseRetryAttempts < maxEmptyResponseRetryAttempts
          ) {
            emptyResponseRetryAttempts += 1;
            activateInternalPrompt(nextEmptyResponseRetryInstruction, false);
            log$1.warn(
              `empty response detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} — retrying ${emptyResponseRetryAttempts}/${maxEmptyResponseRetryAttempts} with visible-answer continuation`,
            );
            continue;
          }
          const incompleteTurnText = emptyAssistantReplyIsSilent
            ? null
            : resolveIncompleteTurnPayloadText({
                payloadCount,
                aborted: terminalAborted,
                externalAbort: externalAbort || signalOwnedInterruption,
                timedOut: terminalTimedOut,
                attempt,
              });
          const incompleteTurnFallbackSafe = Boolean(
            incompleteTurnText &&
            !terminalInterrupted &&
            !promptError &&
            !attempt.lastToolError &&
            !hasAttemptTerminalState(attempt) &&
            !accumulatedReplayState.hadPotentialSideEffects,
          );
          const terminalToolPresentation = incompleteTurnFallbackSafe
            ? readAttemptTerminalToolPresentation()
            : void 0;
          if (
            !emptyAssistantReplyIsSilent &&
            attemptCompactionCount > 0 &&
            payloadCount === 0 &&
            !terminalInterrupted &&
            !promptError &&
            !attempt.clientToolCalls &&
            !attempt.yieldDetected &&
            !attempt.didSendDeterministicApprovalPrompt &&
            !attempt.lastToolError &&
            !accumulatedReplayState.hadPotentialSideEffects &&
            compactionContinuationRetryAttempts < 1
          ) {
            compactionContinuationRetryAttempts += 1;
            compactionContinuationRetryInstruction = COMPACTION_CONTINUATION_RETRY_INSTRUCTION;
            log$1.warn(
              `compaction interrupted visible final answer: runId=${params.runId} sessionId=${params.sessionId} compactions=${attemptCompactionCount} — retrying ${compactionContinuationRetryAttempts}/1 with compacted-transcript continuation`,
            );
            postCompactionGuard.armPostCompaction();
            continue;
          }
          compactionContinuationRetryInstruction = null;
          if (reasoningOnlyRetriesExhausted && !finalAssistantVisibleText)
            log$1.warn(
              `reasoning-only retries exhausted: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} attempts=${reasoningOnlyRetryAttempts}/${maxReasoningOnlyRetryAttempts} — surfacing incomplete-turn error`,
            );
          if (reasoningOnlyRetriesExhausted && !finalAssistantVisibleText) {
            const incompletePayloadText = terminalToolPresentation
              ? terminalToolPresentation.concat(
                  "\n\n",
                  "⚠️ Agent couldn't generate a response. Please try again.",
                )
              : "⚠️ Agent couldn't generate a response. Please try again.";
            const replayInvalid = resolveReplayInvalidForAttempt(incompletePayloadText);
            const livenessState = resolveRunLivenessState({
              payloadCount: 0,
              aborted: terminalAborted,
              timedOut: terminalTimedOut,
              attempt,
              incompleteTurnText: incompletePayloadText,
            });
            setTerminalLifecycleMeta({
              replayInvalid,
              livenessState,
            });
            if (lastProfileId)
              await maybeMarkAuthProfileFailure({
                profileId: lastProfileId,
                reason: assistantProfileFailureReason,
                modelId,
              });
            return {
              payloads: [
                {
                  text: incompletePayloadText,
                  isError: true,
                },
              ],
              meta: {
                durationMs: Date.now() - started,
                agentMeta,
                aborted: terminalAborted,
                systemPromptReport: attempt.systemPromptReport,
                finalPromptText: attempt.finalPromptText,
                finalAssistantVisibleText,
                finalAssistantRawText,
                replayInvalid,
                livenessState,
                error: {
                  kind: "incomplete_turn",
                  message: "Agent couldn't generate a response.",
                  fallbackSafe: incompleteTurnFallbackSafe,
                  terminalPresentation: terminalToolPresentation !== void 0,
                },
                toolSummary: attemptToolSummary,
                ...(failureSignal ? { failureSignal } : {}),
                agentHarnessResultClassification: attempt.agentHarnessResultClassification,
              },
              didSendViaMessagingTool: attempt.didSendViaMessagingTool,
              didDeliverSourceReplyViaMessageTool:
                attempt.didDeliverSourceReplyViaMessageTool === true,
              didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
              messagingToolSentTexts: attempt.messagingToolSentTexts,
              messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
              messagingToolSentTargets: attempt.messagingToolSentTargets,
              messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
              heartbeatToolResponse: attempt.heartbeatToolResponse,
              successfulCronAdds: attempt.successfulCronAdds,
              acceptedSessionSpawns: attempt.acceptedSessionSpawns,
            };
          }
          if (
            !nextReasoningOnlyRetryInstruction &&
            nextEmptyResponseRetryInstruction &&
            emptyResponseRetryAttempts >= maxEmptyResponseRetryAttempts
          )
            log$1.warn(
              `empty response retries exhausted: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} attempts=${emptyResponseRetryAttempts}/${maxEmptyResponseRetryAttempts} — surfacing incomplete-turn error`,
            );
          if (incompleteTurnText) {
            const replayInvalid = resolveReplayInvalidForAttempt(incompleteTurnText);
            const livenessState = resolveRunLivenessState({
              payloadCount,
              aborted: terminalAborted,
              timedOut: terminalTimedOut,
              attempt,
              incompleteTurnText,
            });
            setTerminalLifecycleMeta({
              replayInvalid,
              livenessState,
            });
            const incompleteStopReason =
              attempt.currentAttemptAssistant?.stopReason ?? attempt.lastAssistant?.stopReason;
            const replayMetadata = resolveAttemptReplayMetadata(attempt);
            log$1.warn(
              `incomplete turn detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} stopReason=${incompleteStopReason ?? "missing"} hasLastAssistant=${attempt.lastAssistant ? "yes" : "no"} hasCurrentAttemptAssistant=${attempt.currentAttemptAssistant ? "yes" : "no"} payloads=${payloadCount} tools=${attempt.toolMetas?.length ?? 0} replaySafe=${replayMetadata.replaySafe ? "yes" : "no"} compactions=${attemptCompactionCount} reasoningRetries=${reasoningOnlyRetryAttempts}/${maxReasoningOnlyRetryAttempts} emptyRetries=${emptyResponseRetryAttempts}/${maxEmptyResponseRetryAttempts} missingAssistantRetries=${missingAssistantRetryAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} — ` +
                (terminalToolPresentation
                  ? "surfacing tool-authored terminal presentation"
                  : "surfacing error to user"),
            );
            if (lastProfileId)
              await maybeMarkAuthProfileFailure({
                profileId: lastProfileId,
                reason: assistantProfileFailureReason,
                modelId,
              });
            return {
              payloads: [
                {
                  text: terminalToolPresentation
                    ? terminalToolPresentation.concat("\n\n", incompleteTurnText)
                    : incompleteTurnText,
                  isError: true,
                },
              ],
              meta: {
                durationMs: Date.now() - started,
                agentMeta,
                aborted: terminalAborted,
                systemPromptReport: attempt.systemPromptReport,
                finalPromptText: attempt.finalPromptText,
                finalAssistantVisibleText,
                finalAssistantRawText,
                replayInvalid,
                livenessState,
                error: {
                  kind: "incomplete_turn",
                  message: "Agent couldn't generate a response.",
                  fallbackSafe: incompleteTurnFallbackSafe,
                  terminalPresentation: terminalToolPresentation !== void 0,
                },
                toolSummary: attemptToolSummary,
                ...(failureSignal ? { failureSignal } : {}),
                agentHarnessResultClassification: attempt.agentHarnessResultClassification,
              },
              didSendViaMessagingTool: attempt.didSendViaMessagingTool,
              didDeliverSourceReplyViaMessageTool:
                attempt.didDeliverSourceReplyViaMessageTool === true,
              didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
              messagingToolSentTexts: attempt.messagingToolSentTexts,
              messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
              messagingToolSentTargets: attempt.messagingToolSentTargets,
              messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
              heartbeatToolResponse: attempt.heartbeatToolResponse,
              successfulCronAdds: attempt.successfulCronAdds,
              acceptedSessionSpawns: attempt.acceptedSessionSpawns,
            };
          }
          const beforeAgentFinalizeRevisionReason = attempt.beforeAgentFinalizeRevisionReason;
          const shouldHonorBeforeAgentFinalizeRevision =
            !terminalInterrupted &&
            !promptError &&
            !attempt.clientToolCalls &&
            !attempt.yieldDetected &&
            !emptyAssistantReplyIsSilent;
          if (beforeAgentFinalizeRevisionReason && shouldHonorBeforeAgentFinalizeRevision) {
            beforeAgentFinalizeRevisionAttempts += 1;
            activateInternalPrompt(
              buildBeforeAgentFinalizeRetryPrompt(beforeAgentFinalizeRevisionReason),
              true,
            );
            compactionContinuationRetryInstruction = null;
            log$1.warn(
              `before_agent_finalize requested one more pass: runId=${params.runId} sessionId=${params.sessionId} attempt=${beforeAgentFinalizeRevisionAttempts}/${MAX_BEFORE_AGENT_FINALIZE_REVISIONS}`,
            );
            continue;
          }
          log$1.debug(
            `embedded run done: runId=${params.runId} sessionId=${params.sessionId} durationMs=${Date.now() - started} aborted=${aborted}`,
          );
          markAuthProfileSuccessAfterRun();
          const successfulProfileId = lastProfileId;
          const successfulCredential = successfulProfileId
            ? attemptAuthProfileStore.profiles[successfulProfileId]
            : void 0;
          const successfulApiKeyInfo = getApiKeyInfo();
          const successfulPluginHarnessApiKeyInfo = (() => {
            const apiKey = successfulApiKeyInfo?.apiKey;
            if (!pluginHarnessOwnsTransport || !apiKey || !looksLikeSecretSentinel(apiKey))
              return successfulApiKeyInfo;
            const resolvedApiKey = resolveSecretSentinel(apiKey);
            return resolvedApiKey
              ? {
                  ...successfulApiKeyInfo,
                  apiKey: resolvedApiKey,
                }
              : null;
          })();
          const authFingerprint =
            successfulCredential?.type === "oauth" && successfulProfileId
              ? fingerprintResolvedAuthProfileCredential({
                  profileId: successfulProfileId,
                  credential: successfulCredential,
                  resolvedAuth: successfulApiKeyInfo,
                })
              : successfulCredential && successfulProfileId && pluginHarnessOwnsAuthBootstrap
                ? attempt.authBindingFingerprint
                : successfulCredential && successfulProfileId && pluginHarnessOwnsTransport
                  ? fingerprintResolvedAuthProfileCredential({
                      profileId: successfulProfileId,
                      credential: successfulCredential,
                      resolvedAuth: successfulPluginHarnessApiKeyInfo,
                    })
                  : successfulApiKeyInfo
                    ? fingerprintResolvedProviderAuth(successfulApiKeyInfo)
                    : void 0;
          const authProfileOwnerFingerprint =
            successfulProfileId && successfulCredential !== void 0
              ? fingerprintAuthProfileOwnerShape({
                  profileId: successfulProfileId,
                  credential: successfulCredential,
                })
              : void 0;
          const runtimeArtifact = pluginHarnessOwnsTransport ? attempt.runtimeArtifact : void 0;
          const runtimeOwnerFingerprint = authFingerprint
            ? void 0
            : successfulApiKeyInfo?.mode === "aws-sdk"
              ? fingerprintAwsSdkRuntimeOwner({
                  provider,
                  backendId: agentHarness.id,
                  auth: successfulApiKeyInfo,
                })
              : pluginHarnessOwnsTransport
                ? fingerprintOpaqueRuntimeOwner({
                    kind: "plugin-harness",
                    runner: "embedded",
                    provider,
                    backendId: agentHarness.id,
                    ...(runtimeArtifact
                      ? { runtimeArtifactFingerprint: runtimeArtifact.fingerprint }
                      : {}),
                    ...(successfulProfileId ? { authProfileId: successfulProfileId } : {}),
                    ...(authProfileOwnerFingerprint ? { authProfileOwnerFingerprint } : {}),
                  })
                : void 0;
          const runtimeOwnerKind =
            (runtimeOwnerFingerprint && successfulApiKeyInfo?.mode === "aws-sdk"
              ? "aws-sdk"
              : runtimeOwnerFingerprint && pluginHarnessOwnsTransport
                ? "plugin-harness"
                : void 0) ?? (pluginHarnessOwnsTransport ? "plugin-harness" : void 0);
          params.onSuccessfulAuthBinding?.({
            ...(successfulProfileId ? { authProfileId: successfulProfileId } : {}),
            agentHarnessId: agentHarness.id,
            ...(authFingerprint ? { authFingerprint } : {}),
            ...(runtimeOwnerFingerprint ? { runtimeOwnerFingerprint } : {}),
            ...(runtimeOwnerKind ? { runtimeOwnerKind } : {}),
            ...(runtimeOwnerKind ? { runtimeOwnerId: agentHarness.id } : {}),
            ...(runtimeArtifact
              ? {
                  runtimeArtifactId: runtimeArtifact.id,
                  runtimeArtifactFingerprint: runtimeArtifact.fingerprint,
                }
              : {}),
          });
          const replayInvalid = resolveReplayInvalidForAttempt(null);
          const livenessState = attempt.yieldDetected
            ? "paused"
            : resolveRunLivenessState({
                payloadCount,
                aborted: terminalAborted,
                timedOut: terminalTimedOut,
                attempt,
                incompleteTurnText: null,
              });
          const stopReason = attempt.clientToolCalls
            ? "tool_calls"
            : attempt.yieldDetected
              ? "end_turn"
              : attemptAssistant?.stopReason;
          const terminalPayloads = emptyAssistantReplyIsSilent
            ? [{ text: SILENT_REPLY_TOKEN }]
            : payloadsForTerminalPath;
          setTerminalLifecycleMeta({
            replayInvalid,
            livenessState,
            stopReason,
            yielded: attempt.yieldDetected === true,
          });
          return {
            payloads: terminalPayloads?.length ? terminalPayloads : void 0,
            ...(attempt.diagnosticTrace
              ? { diagnosticTrace: freezeDiagnosticTraceContext(attempt.diagnosticTrace) }
              : {}),
            meta: {
              durationMs: Date.now() - started,
              agentMeta,
              aborted: terminalAborted,
              systemPromptReport: attempt.systemPromptReport,
              finalPromptText: attempt.finalPromptText,
              finalAssistantVisibleText,
              finalAssistantRawText,
              replayInvalid,
              livenessState,
              agentHarnessResultClassification: attempt.agentHarnessResultClassification,
              ...(attempt.yieldDetected ? { yielded: true } : {}),
              ...(emptyAssistantReplyIsSilent ? { terminalReplyKind: "silent-empty" } : {}),
              stopReason,
              pendingToolCalls: attempt.clientToolCalls?.map((call) => ({
                id: randomBytes(5).toString("hex").slice(0, 9),
                name: call.name,
                arguments: JSON.stringify(call.params),
              })),
              executionTrace: {
                winnerProvider: reportedModelRef.provider,
                winnerModel: reportedModelRef.model,
                attempts:
                  traceAttempts.length > 0 || attemptAssistant?.provider || attemptAssistant?.model
                    ? [
                        ...traceAttempts,
                        {
                          provider: reportedModelRef.provider,
                          model: reportedModelRef.model,
                          result: "success",
                          stage: "assistant",
                        },
                      ]
                    : void 0,
                fallbackUsed: traceAttempts.some(traceAttemptUsesFallback),
                runner: "embedded",
              },
              requestShaping: {
                ...(lastProfileId ? { authMode: "auth-profile" } : {}),
                ...(thinkLevel ? { thinking: thinkLevel } : {}),
                ...(params.reasoningLevel ? { reasoning: params.reasoningLevel } : {}),
                ...(params.verboseLevel ? { verbose: params.verboseLevel } : {}),
                ...(params.blockReplyBreak ? { blockStreaming: params.blockReplyBreak } : {}),
              },
              toolSummary: attemptToolSummary,
              ...(failureSignal ? { failureSignal } : {}),
              completion: {
                ...(stopReason ? { stopReason } : {}),
                ...(stopReason ? { finishReason: stopReason } : {}),
                ...(stopReason?.toLowerCase().includes("refusal") ? { refusal: true } : {}),
              },
              contextManagement:
                autoCompactionCount > 0 ? { lastTurnCompactions: autoCompactionCount } : void 0,
            },
            didSendViaMessagingTool: attempt.didSendViaMessagingTool,
            didDeliverSourceReplyViaMessageTool:
              attempt.didDeliverSourceReplyViaMessageTool === true,
            didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
            messagingToolSentTexts: attempt.messagingToolSentTexts,
            messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
            messagingToolSentTargets: attempt.messagingToolSentTargets,
            messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
            heartbeatToolResponse: attempt.heartbeatToolResponse,
            successfulCronAdds: attempt.successfulCronAdds,
            acceptedSessionSpawns: attempt.acceptedSessionSpawns,
          };
        }
      } finally {
        if (params.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoResetBestEffort();
        forgetPromptBuildDrainCacheForRun(params.runId);
        stopRuntimeAuthRefreshTimer();
        await runAgentCleanupStep({
          runId: params.runId,
          sessionId: params.sessionId,
          step: "context-engine-dispose",
          log: log$1,
          cleanup: async () => {
            await contextEngine.dispose?.();
          },
        });
        if (params.cleanupBundleMcpOnRunEnd === true)
          await runAgentCleanupStep({
            runId: params.runId,
            sessionId: params.sessionId,
            step: "bundle-mcp-retire",
            log: log$1,
            cleanup: async () => {
              const onError = (errorLocal, sessionId) => {
                log$1.warn(
                  `bundle-mcp cleanup failed after run for ${sessionId}: ${formatErrorMessage(errorLocal)}`,
                );
              };
              if (
                !(await retireSessionMcpRuntimeForSessionKey({
                  sessionKey: params.sessionKey,
                  reason: "embedded-run-end",
                  preserveActiveLeases: true,
                  onError,
                }))
              )
                await retireSessionMcpRuntime({
                  sessionId: params.sessionId,
                  reason: "embedded-run-end",
                  preserveActiveLeases: true,
                  onError,
                });
            },
          });
      }
    });
  });
}
function resolveAuthProfileStateProvider(store, profileId, fallbackProvider) {
  const profileProvider = store.profiles?.[profileId]?.provider?.trim();
  if (profileProvider) return profileProvider;
  return profileId.split(":", 1)[0]?.trim() || fallbackProvider;
}
//#endregion
export {
  formatAuthProfileFailureMessage as n,
  compactEmbeddedAgentSession as r,
  runEmbeddedAgent as t,
};
