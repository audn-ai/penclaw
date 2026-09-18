import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { once } from "node:events";
import fs from "node:fs/promises";
import { isIP } from "node:net";
import path, { posix } from "node:path";
import { WebSocketServer } from "ws";
import {
  a as buildHarnessContextEngineRuntimeContext,
  c as isActiveHarnessContextEngine,
  i as bootstrapHarnessContextEngine,
  l as runHarnessContextEngineMaintenance,
  n as runAgentEndSideEffects,
  o as buildHarnessContextEngineRuntimeContextFromUsage,
  r as assembleHarnessContextEngine,
  s as finalizeHarnessContextEngineTurn,
  t as awaitAgentEndSideEffects,
} from "./agent-end-side-effects-PAHWJAYi.js";
import { c as emitAgentEvent } from "./agent-events-D4UsOPeT.js";
import {
  f as buildAgentHarnessUserInputAnswers,
  l as resolveAgentHarnessBeforePromptBuildResult,
  m as emptyAgentHarnessUserInputAnswers,
  o as loadCodexBundleMcpThreadConfig,
  p as deliverAgentHarnessUserInputPrompt,
} from "./agent-harness-runtime-BjY9gsEs.js";
import {
  n as deliverAgentHarnessTaskCompletion,
  r as isDurableAgentHarnessCompletionDelivery,
  t as createAgentHarnessTaskRuntime,
} from "./agent-harness-task-runtime-BOBB_nyT.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { a as getBeforeToolCallPolicyDiagnosticState } from "./agent-tools.before-tool-call-B7gv78c3.js";
import {
  n as resolveCodexAppServerForOpenClawToolPolicy,
  t as resolveCodexAppServerForModelProvider,
} from "./app-server-policy-DhwIH4JE.js";
import {
  S as updateActiveTurnItemIds,
  _ as readCodexNotificationItem,
  a as isCodexTurnAbortMarkerNotification,
  b as shouldDisarmAssistantCompletionIdleWatch,
  c as isPendingOpenClawDynamicToolCompletionNotification,
  d as isRawReasoningCompletionNotification,
  f as isRawToolOutputCompletionNotification,
  g as isTerminalTurnStatus,
  h as isRetryableErrorNotification,
  i as isAssistantCompletionReleaseNotification,
  l as isRawAssistantProgressNotification,
  m as isReasoningProgressNotification,
  n as describeNotificationActivity,
  o as isFileChangePatchUpdatedNotification,
  p as isReasoningItemCompletionNotification,
  r as isAssistantCommentaryCompletionNotification,
  s as isNativeToolProgressNotification,
  t as codexExecutionToolName,
  u as isRawFunctionToolOutputCompletionNotification,
  v as readNotificationItemId,
  x as updateActiveCompletionBlockerItemIds,
  y as readRawResponseToolCallId,
} from "./attempt-notifications-jKAL7Gfs.js";
import { r as runAgentCleanupStep } from "./attempt.tool-run-context-DzOtUuEC.js";
import { n as prepareCodexAppServerAuthBinding } from "./auth-binding-DvgxrKs_.js";
import { n as resolveCodexBindingAppServerConnection } from "./binding-connection-D_wKlTHe.js";
import {
  n as buildBootstrapContextForFiles,
  o as resolveBootstrapFilesForRun,
} from "./bootstrap-files-B9pwG25K.js";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-BTxju7z9.js";
import { r as formatCodexDisplayText } from "./command-formatters-BGtw1ew1.js";
import {
  a as runCodexComputerUseLiveTest,
  r as killStaleComputerUseMcpChildren,
  t as ensureCodexComputerUse,
} from "./computer-use-Cov7_CRJ.js";
import {
  _ as resolveCodexPluginsPolicy,
  b as shouldAutoApproveCodexAppServerApprovals,
  d as readCodexPluginConfig,
  g as resolveCodexModelBackedReviewerPolicyContext,
  h as resolveCodexComputerUseConfig,
  l as isCodexSandboxExecServerEnabled,
  s as isCodexAppServerApprovalPolicyAllowedByRequirements,
  x as withMcpElicitationsApprovalPolicy,
  y as resolveOpenClawExecPolicyForCodexAppServer,
} from "./config-C1imjxk6.js";
import { n as resolveSandboxContext } from "./context-CEFGZ0oc.js";
import { t as buildMemorySystemPromptAddition } from "./delegate-DXtLyRKu.js";
import {
  C as createDiagnosticTraceContextFromActiveScope,
  T as freezeDiagnosticTraceContext,
  h as onInternalDiagnosticEvent,
  o as emitTrustedDiagnosticEvent,
  s as emitTrustedDiagnosticEventWithPrivateData,
} from "./diagnostic-events-5-gsFhkM.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-CU_-DTjY.js";
import "./number-runtime-B-n-wjMn.js";
import {
  $ as shouldBlockTerminalReleaseForNonTerminalDynamicToolResult,
  B as buildCodexNativeHookRelayDisabledConfig,
  C as resolveCodexMessageToolProvider,
  D as shouldWarnCodexDynamicToolBuildStageSummary,
  E as shouldRequireCodexSandboxExecServerEnvironment,
  F as sanitizeCodexToolResponse,
  G as scheduleCodexNativeHookRelayUnregister,
  H as emitCodexNativePreToolUseFailureDiagnostic,
  I as readCodexMirroredSessionHistoryMessages,
  J as hasPendingDynamicToolTerminalDiagnostic,
  K as resolveCodexLocalRuntimeAttribution,
  M as inferCodexDynamicToolMeta,
  N as resolveCodexToolProgressDetailMode,
  P as sanitizeCodexToolArguments,
  Q as resolveTerminalDynamicToolBatchAction,
  R as CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS,
  S as resolveCodexExternalSandboxPolicyForOpenClawSandbox,
  T as shouldEnableCodexAppServerNativeToolSurface,
  U as resolveCodexNativeHookRelayEvents,
  V as createCodexNativeHookRelay,
  W as resolveCodexNativeHookRelayTtlMs,
  X as isMatchingDynamicToolTerminalDiagnostic,
  Y as isDynamicToolTerminalDiagnosticEvent,
  Z as resolveDynamicToolCallTimeoutMs,
  _ as createCodexDynamicToolBuildStageTracker,
  a as emitDynamicToolStartedDiagnostic,
  b as resolveCodexAppServerExecutionCwd,
  d as resolveCodexStartupTimeoutMs,
  et as shouldReleaseTurnAfterTerminalDynamicTool,
  f as resolveCodexTurnAssistantCompletionIdleTimeoutMs,
  g as buildDynamicTools,
  h as withCodexStartupTimeout,
  i as emitDynamicToolErrorDiagnostic,
  j as shouldEmitTranscriptToolProgress,
  k as CodexAppServerEventProjector,
  l as CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS,
  m as resolveCodexTurnTerminalIdleTimeoutMs,
  n as handleCodexAppServerApprovalRequest,
  nt as toCodexDynamicToolProtocolResponse,
  o as emitDynamicToolTerminalDiagnostic,
  p as resolveCodexTurnCompletionIdleTimeoutMs,
  q as handleDynamicToolCallWithTimeout,
  r as handleCodexAppServerElicitationRequest,
  rt as resolveCodexToolAbortTerminalReason,
  s as resolveCodexProviderWebSearchSupport,
  t as createCodexDynamicToolBridge,
  tt as toCodexDynamicToolProgressResponse,
  u as resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs,
  v as disableCodexPluginThreadConfig,
  w as resolveCodexSandboxEnvironmentSelection,
  x as resolveCodexAppServerHookChannelId,
  y as formatCodexDynamicToolBuildStageSummary,
  z as buildCodexNativeHookRelayConfig,
} from "./dynamic-tools-CQSO10gc.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { v as loadExecApprovals } from "./exec-approvals-Bz218bS2.js";
import "./core-V3U0lOIj.js";
import "./session-store-runtime-BwE6SlGz.js";
import "./exec-approvals-runtime-gbeupxm-.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./agent-runtime-BiQiwmwD.js";
import {
  n as formatFastModeAutoProgressText,
  u as resolveFastModeForElapsed,
} from "./fast-mode-BhVbWk_p.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./diagnostic-runtime-CpZ_ot5_.js";
import {
  r as assertContextEngineHostSupport,
  t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
} from "./host-compat-BibWlia2.js";
import {
  a as runAgentHarnessLlmInputHook,
  n as getAgentHarnessHookRunner,
  o as runAgentHarnessLlmOutputHook,
} from "./lifecycle-hook-helpers-qaFalH5z.js";
import { A as isHostScopedAgentToolActive } from "./local-model-lean-D3O2n_2v.js";
import { t as log } from "./logger-C5RMMskO.js";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "./message-tool-delivery-hints-8OSBEg_c.js";
import {
  n as readCodexNotificationThreadId,
  r as readCodexNotificationTurnId,
  t as isCodexNotificationForTurn,
} from "./notification-correlation-BtXfV0Pa.js";
import { j as resolveTimerTimeoutMs, s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { l as supportsModelTools } from "./openai-transport-stream-BFFr80cz.js";
import {
  i as defaultCodexAppInventoryCache,
  n as buildCodexAppServerRuntimeFingerprint,
  r as buildCodexPluginAppCacheKey,
} from "./plugin-app-cache-key-Dx0ZqdxR.js";
import { i as isJsonObject, r as flattenCodexDynamicToolFunctions } from "./protocol-BMifTfdW.js";
import {
  a as readCodexDynamicToolCallParams,
  i as assertCodexTurnStartResponse,
} from "./protocol-validators-CfDblFS1.js";
import {
  a as shouldRefreshCodexRateLimitsForUsageLimitMessage,
  i as resolveCodexUsageLimitResetAtMs,
  n as formatCodexUsageLimitErrorMessage,
} from "./rate-limits-CGMwC7L1.js";
import { s as resolveContextEngineOwnerPluginId } from "./registry-DXbEDAsr.js";
import { t as FAST_MODE_AUTO_PROGRESS_KIND } from "./reply-payload-BK_jICQ3.js";
import { c as resolveAgentRunAbortLifecycleFields } from "./run-termination-BEbihwT8.js";
import { T as setActiveEmbeddedRun, r as clearActiveEmbeddedRun } from "./runs-GL_-RIwi.js";
import {
  h as sessionBindingIdentity,
  p as reclaimCurrentCodexSessionGeneration,
} from "./session-binding-CxW6VTON.js";
import {
  A as resolveCodexAppServerHomeDir,
  C as resolveCodexAppServerAuthAccountCacheKey,
  D as resolveCodexAppServerPreparedApiKeyCacheKey,
  E as resolveCodexAppServerFallbackApiKeyCacheKey,
  N as isCodexAppServerApprovalRequest,
  O as resolveCodexAppServerPreparedAuthHandoff,
  P as isCodexAppServerConnectionClosedError,
  S as rememberCodexRateLimitsRead,
  T as resolveCodexAppServerAuthProfileIdForAgent,
  a as clearSharedCodexAppServerClientIfCurrentAndUnclaimed,
  b as readCodexRateLimitsRevision,
  c as getLeasedSharedCodexAppServerClient,
  d as releaseLeasedSharedCodexAppServerClient,
  h as retireSharedCodexAppServerClientIfCurrent,
  i as clearSharedCodexAppServerClientIfCurrent,
  j as CodexAppServerRpcError,
  l as isCodexAppServerStartSelectionChangedError,
  m as retainSharedCodexAppServerClientIfCurrent,
  w as resolveCodexAppServerAuthProfileId,
  x as readRecentCodexRateLimits,
  y as ensureCodexAppServerClientRuntime,
} from "./shared-client-a36Mluj-.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import { c as isBlockedHostnameOrIp, t as SsrFBlockedError } from "./ssrf-keFRGQLq.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  A as fitCodexProjectedContextForTurnStart,
  B as unsubscribeCodexThreadBestEffort,
  F as CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS,
  G as shouldBuildCodexPluginThreadConfig,
  H as buildCodexPluginThreadConfig,
  I as CodexAppServerUnsafeSubscriptionError,
  L as closeCodexStartupClientBestEffort,
  M as resolveCodexContextEngineProjectionMaxChars,
  N as resolveCodexContextEngineProjectionReserveTokens,
  P as CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
  R as interruptCodexTurnBestEffort,
  T as isCrestodianOnlyCodexDynamicToolAllowlist,
  U as buildCodexPluginThreadConfigInputFingerprint,
  W as mergeCodexThreadConfigs,
  a as buildDeveloperInstructions,
  b as isCodexAppServerProfilerEnabled,
  c as codexDynamicToolsFingerprint,
  g as startOrResumeThread,
  i as buildContextEngineBinding,
  j as projectContextEngineAssemblyForCodex,
  k as resolveCodexDynamicToolsLoadingForRuntime,
  l as codexLegacyDynamicToolsFingerprint,
  n as areCodexDynamicToolFingerprintsCompatible,
  o as buildTurnCollaborationMode,
  p as resolveCodexAppServerThreadModelSelection,
  s as buildTurnStartParams,
  u as isContextEngineBindingCompatible,
  v as resolveCodexWebSearchPlan,
  z as retireCodexAppServerClientAfterTimedOutTurn,
} from "./thread-lifecycle-BI8tSeEg.js";
import {
  i as mirrorPromptAtTurnStartBestEffort,
  n as createCodexAppServerUserMessagePersistenceNotifier,
  o as buildCodexUserPromptMessage,
  t as codexTranscriptMirrorRuntime,
} from "./transcript-mirror-CqPkRu1h.js";
import { r as markAuthProfileBlockedUntil } from "./usage-BZgGbRoq.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/codex/src/app-server/attempt-steering.ts
/**
 * Debounced steering queue for forwarding user text to an active Codex
 * app-server turn.
 */
const CODEX_STEER_ALL_DEBOUNCE_MS = 500;
/**
 * Creates a queue that batches steer text while still serializing app-server
 * `turn/steer` requests.
 */
function createCodexSteeringQueue(params) {
  let batchedTexts = [];
  let batchTimer;
  let sendChain = Promise.resolve();
  const clearBatchTimer = () => {
    if (batchTimer) {
      clearTimeout(batchTimer);
      batchTimer = void 0;
    }
  };
  const sendTexts = async (texts) => {
    if (texts.length === 0) return;
    if (params.signal.aborted) throw new Error("codex app-server steering queue aborted");
    await params.client.request("turn/steer", {
      threadId: params.threadId,
      expectedTurnId: params.turnId,
      input: texts.map(toCodexTextInput),
    });
  };
  const enqueueSend = (texts) => {
    const send = sendChain.then(() => sendTexts(texts));
    sendChain = send.catch((error) => {
      log.debug("codex app-server queued steer failed", { error });
    });
    return send;
  };
  const flushBatch = () => {
    clearBatchTimer();
    const items = batchedTexts;
    batchedTexts = [];
    const send = enqueueSend(items.map((item) => item.text));
    send.then(
      () => {
        for (const item of items) item.resolve();
      },
      (error) => {
        for (const item of items) item.reject(error);
      },
    );
    return send;
  };
  return {
    async queue(text, options) {
      if (params.answerPendingUserInput(text)) return;
      return await new Promise((resolve, reject) => {
        batchedTexts.push({
          text,
          resolve,
          reject,
        });
        clearBatchTimer();
        const debounceMs = normalizeCodexSteerDebounceMs(options?.debounceMs);
        if (debounceMs === 0) {
          flushBatch().catch(() => void 0);
          return;
        }
        batchTimer = setTimeout(() => {
          batchTimer = void 0;
          flushBatch().catch(() => void 0);
        }, debounceMs);
      });
    },
    async flushPending() {
      await flushBatch().catch(() => void 0);
    },
    cancel() {
      clearBatchTimer();
      const items = batchedTexts;
      batchedTexts = [];
      for (const item of items)
        item.reject(/* @__PURE__ */ new Error("codex app-server steering queue cancelled"));
    },
  };
}
/** Normalizes steer debounce milliseconds, preserving explicit zero. */
function normalizeCodexSteerDebounceMs(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : CODEX_STEER_ALL_DEBOUNCE_MS;
}
/** Converts plain text into the Codex app-server user-input shape. */
function toCodexTextInput(text) {
  return {
    type: "text",
    text,
    text_elements: [],
  };
}
//#endregion
//#region extensions/codex/src/app-server/user-input-bridge.ts
/**
 * Bridges Codex item/tool user-input requests to OpenClaw messaging prompts and
 * turns replies into app-server answer payloads.
 */
/** Creates a per-turn bridge for pending Codex user-input requests. */
function createCodexUserInputBridge(params) {
  let pending;
  const resolvePending = (value) => {
    const current = pending;
    if (!current) return;
    pending = void 0;
    current.cleanup();
    current.resolve(value);
  };
  return {
    async handleRequest(request) {
      const requestParams = readUserInputParams(request.params);
      if (!requestParams) return;
      if (requestParams.threadId !== params.threadId || requestParams.turnId !== params.turnId)
        return;
      if (requestParams.questions.length === 0) return emptyUserInputResponse();
      resolvePending(emptyUserInputResponse());
      return new Promise((resolve) => {
        const abortListener = () => resolvePending(emptyUserInputResponse());
        const cleanup = () => params.signal?.removeEventListener("abort", abortListener);
        pending = {
          requestId: request.id,
          threadId: requestParams.threadId,
          turnId: requestParams.turnId,
          itemId: requestParams.itemId,
          questions: requestParams.questions,
          resolve,
          cleanup,
        };
        params.signal?.addEventListener("abort", abortListener, { once: true });
        if (params.signal?.aborted) {
          resolvePending(emptyUserInputResponse());
          return;
        }
        deliverUserInputPrompt(params.paramsForRun, requestParams.questions).catch((error) => {
          log.warn("failed to deliver codex user input prompt", { error });
        });
      });
    },
    handleQueuedMessage(text) {
      const current = pending;
      if (!current) return false;
      resolvePending(buildUserInputResponse(current.questions, text));
      return true;
    },
    handleNotification(notification) {
      if (notification.method !== "serverRequest/resolved" || !pending) return;
      const notificationParams = isJsonObject(notification.params) ? notification.params : void 0;
      const requestId = notificationParams ? readRequestId(notificationParams) : void 0;
      if (
        notificationParams &&
        readString$4(notificationParams, "threadId") === pending.threadId &&
        requestId !== void 0 &&
        String(requestId) === String(pending.requestId)
      )
        resolvePending(emptyUserInputResponse());
    },
    cancelPending() {
      resolvePending(emptyUserInputResponse());
    },
  };
}
function readUserInputParams(value) {
  if (!isJsonObject(value)) return;
  const threadId = readString$4(value, "threadId");
  const turnId = readString$4(value, "turnId");
  const itemId = readString$4(value, "itemId");
  const questionsRaw = value.questions;
  if (!threadId || !turnId || !itemId || !Array.isArray(questionsRaw)) return;
  return {
    threadId,
    turnId,
    itemId,
    questions: questionsRaw.map(readQuestion).filter((question) => Boolean(question)),
  };
}
function readQuestion(value) {
  if (!isJsonObject(value)) return;
  const id = readString$4(value, "id");
  const header = readString$4(value, "header");
  const question = readString$4(value, "question");
  if (!id || !header || !question) return;
  return {
    id,
    header,
    question,
    isOther: value.isOther === true,
    isSecret: value.isSecret === true,
    options: readOptions(value.options),
  };
}
function readOptions(value) {
  if (!Array.isArray(value)) return null;
  const options = value.map(readOption).filter((option) => Boolean(option));
  return options.length > 0 ? options : null;
}
function readOption(value) {
  if (!isJsonObject(value)) return;
  const label = readString$4(value, "label");
  const description = readString$4(value, "description") ?? "";
  return label
    ? {
        label,
        description,
      }
    : void 0;
}
async function deliverUserInputPrompt(params, questions) {
  await deliverAgentHarnessUserInputPrompt(params, questions, {
    formatText: formatCodexDisplayText,
    intro: "Codex needs input:",
  });
}
function buildUserInputResponse(questions, inputText) {
  return buildAgentHarnessUserInputAnswers(questions, inputText);
}
function emptyUserInputResponse() {
  return emptyAgentHarnessUserInputAnswers();
}
function readString$4(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : void 0;
}
function readRequestId(record) {
  const value = record.requestId;
  return typeof value === "string" || typeof value === "number" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-active-turn.ts
async function activateCodexAttemptTurn(resources, turnRuntime, lifecycle, notifications, turn) {
  const {
    prompt,
    state: resourceState,
    projectorRef,
    trajectoryRecorder,
    pendingNativePreToolUseFailures,
  } = resources;
  const { context, turnState } = prompt;
  const { runtime, attemptTools } = context;
  const { connection } = runtime;
  const {
    params,
    runAbortController,
    terminalState,
    abortExplicitly,
    abortFromUpstream,
    bindingStore,
    bindingIdentity,
    sessionAgentId,
    sandboxSessionKey,
    effectiveCwd,
  } = connection;
  const { dynamicToolParams, computerContextEpoch } = attemptTools;
  const { state, userInputBridgeRef, steeringQueueRef, turnWatches } = turnRuntime;
  const { emitExecutionPhaseOnce, emitLifecycleStart, maybeAnnounceFastModeAutoOff } = lifecycle;
  const { enqueueNotification } = notifications;
  const activeTurnId = turn.turn.id;
  const streamState = {
    eventEmitted: false,
    needsTerminalSnapshot: false,
  };
  emitExecutionPhaseOnce("turn_accepted", { phase: "turn_accepted" });
  userInputBridgeRef.current = createCodexUserInputBridge({
    paramsForRun: params,
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
    signal: runAbortController.signal,
  });
  trajectoryRecorder?.recordEvent("prompt.submitted", {
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
    prompt: turnState.codexTurnPromptText,
    imagesCount: params.images?.length ?? 0,
  });
  projectorRef.current = new CodexAppServerEventProjector(
    {
      ...dynamicToolParams,
      onAgentEvent: (event) => {
        if (event.stream === "assistant" && typeof event.data.delta === "string") {
          streamState.eventEmitted = true;
          streamState.needsTerminalSnapshot ||= event.data.replaceable === true;
        }
        return dynamicToolParams.onAgentEvent?.(event);
      },
    },
    resourceState.thread.threadId,
    activeTurnId,
    {
      nativePostToolUseRelayEnabled:
        resourceState.nativeHookRelay?.allowedEvents.includes("post_tool_use") === true &&
        resourceState.nativeHookRelay.shouldRelayEvent("post_tool_use"),
      readRecentRateLimits: () => readRecentCodexRateLimits(resourceState.client),
      runAbortSignal: runAbortController.signal,
      trajectoryRecorder,
      onNativeToolResultRecorded: maybeAnnounceFastModeAutoOff,
      upstreamUserText: turnState.codexTurnPromptText,
      onContextCompacted: () => {
        computerContextEpoch.value += 1;
        delete computerContextEpoch.frameToolCallId;
        delete computerContextEpoch.frameImageIdentity;
      },
    },
  );
  if (isTerminalTurnStatus(turn.turn.status)) state.terminalTurnNotificationQueued = true;
  emitLifecycleStart();
  const activeProjector = projectorRef.current;
  turnWatches.armTerminalIdleWatch();
  turnWatches.touchActivity("turn:start", { arm: true });
  turnWatches.armAttemptIdleWatch();
  turnWatches.touchActivity("turn:start", { attemptProgress: true });
  for (const failure of pendingNativePreToolUseFailures.splice(0))
    activeProjector.recordNativeToolPreToolUseFailure(failure);
  if (resourceState.turnRoute)
    try {
      await resourceState.turnRoute.bindTurn(activeTurnId);
    } catch (error) {
      if (!state.terminalTurnNotificationQueued) throw error;
      await resourceState.turnRoute.drain();
      if (!state.completed) {
        turnWatches.clearAllTimers();
        throw error;
      }
    }
  if (!state.completed && isTerminalTurnStatus(turn.turn.status))
    await enqueueNotification(
      {
        method: "turn/completed",
        params: {
          threadId: resourceState.thread.threadId,
          turnId: activeTurnId,
          turn: turn.turn,
        },
      },
      {
        threadId: resourceState.thread.threadId,
        turnId: activeTurnId,
      },
    );
  const activeSteeringQueue = createCodexSteeringQueue({
    client: resourceState.client,
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
    answerPendingUserInput: (text) =>
      userInputBridgeRef.current?.handleQueuedMessage(text) ?? false,
    signal: runAbortController.signal,
  });
  steeringQueueRef.current = activeSteeringQueue;
  const handle = {
    kind: "embedded",
    runId: params.runId,
    queueMessage: async (text, optionsLocal) => activeSteeringQueue.queue(text, optionsLocal),
    isStreaming: () => !state.completed && !runAbortController.signal.aborted,
    isStopped: () => state.completed || state.timedOut || runAbortController.signal.aborted,
    isAbortable: () =>
      !terminalState.terminalOutcomeFrozen || terminalState.sharedAbortAllowedAfterTerminalOutcome,
    isCompacting: () => projectorRef.current?.isCompacting() ?? false,
    sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
    cancel: () => abortExplicitly("cancelled"),
    abort: () => abortExplicitly("aborted"),
  };
  params.replyOperation?.attachBackend(handle);
  setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
  const freezeRunTerminalOutcome = () => {
    if (terminalState.terminalOutcomeFrozen) return;
    terminalState.terminalOutcomeFrozen = true;
    params.abortSignal?.removeEventListener("abort", abortFromUpstream);
  };
  const notifyUserMessagePersisted = createCodexAppServerUserMessagePersistenceNotifier(params);
  mirrorPromptAtTurnStartBestEffort({
    params,
    agentId: sessionAgentId,
    notifyUserMessagePersisted,
    sessionKey: sandboxSessionKey,
    cwd: effectiveCwd,
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
    upstreamUserText: turnState.codexTurnPromptText,
  });
  const abortListener = () => {
    if (state.timedOut) {
      (async () => {
        if (resourceState.thread.connectionScope !== "supervision")
          await bindingStore.mutate(bindingIdentity, {
            kind: "clear",
            threadId: resourceState.thread.threadId,
          });
        await retireCodexAppServerClientAfterTimedOutTurn(resourceState.client, {
          threadId: resourceState.thread.threadId,
          turnId: activeTurnId,
          reason: String(runAbortController.signal.reason ?? "timeout"),
          suspectPhysicalClient: state.turnWatchTimeoutKind === "terminal",
        });
      })().finally(() => state.resolveCompletion?.());
      return;
    }
    interruptCodexTurnBestEffort(resourceState.client, {
      threadId: resourceState.thread.threadId,
      turnId: activeTurnId,
    });
    state.resolveCompletion?.();
  };
  runAbortController.signal.addEventListener("abort", abortListener, { once: true });
  if (runAbortController.signal.aborted) abortListener();
  return {
    activeTurnId,
    activeProjector,
    streamState,
    handle,
    freezeRunTerminalOutcome,
    notifyUserMessagePersisted,
    abortListener,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-cleanup.ts
async function cleanupCodexAttempt(resources, turnRuntime, lifecycle, requestRuntime, activeTurn) {
  const {
    prompt,
    state: resourceState,
    trajectoryRecorder,
    releaseCurrentRoute,
    releaseSharedClientLeaseAndRetireOneShotClient,
    releaseSandboxExecEnvironment,
  } = resources;
  const { connection } = prompt.context.runtime;
  const { params, options, runAbortController } = connection;
  const { state, steeringQueueRef, userInputBridgeRef, turnWatches } = turnRuntime;
  const {
    maybeEmitFastModeAutoResetBestEffort,
    emitLifecycleTerminal,
    buildLifecycleTerminalMeta,
  } = lifecycle;
  const { codexModelCallDiagnostics } = requestRuntime;
  const { activeTurnId, abortListener, handle, freezeRunTerminalOutcome } = activeTurn;
  if (params.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoResetBestEffort();
  codexModelCallDiagnostics.emitError(
    "codex app-server run completed without model-call terminal event",
  );
  emitLifecycleTerminal({
    phase: "error",
    error: "codex app-server run completed without lifecycle terminal event",
    ...buildLifecycleTerminalMeta({
      aborted: runAbortController.signal.aborted && !state.clientClosedAbort,
      timedOut: state.timedOut,
    }),
  });
  if (trajectoryRecorder && !resourceState.trajectoryEndRecorded)
    trajectoryRecorder.recordEvent("session.ended", {
      status:
        state.timedOut || (runAbortController.signal.aborted && !state.clientClosedAbort)
          ? "interrupted"
          : "cleanup",
      threadId: resourceState.thread.threadId,
      turnId: activeTurnId,
      timedOut: state.timedOut,
      aborted: runAbortController.signal.aborted && !state.clientClosedAbort,
    });
  await runAgentCleanupStep({
    runId: params.runId,
    sessionId: params.sessionId,
    step: "codex-trajectory-flush",
    log,
    cleanup: async () => trajectoryRecorder?.flush(),
  });
  if (!state.timedOut && !runAbortController.signal.aborted)
    await steeringQueueRef.current?.flushPending();
  if (!state.timedOut)
    await unsubscribeCodexThreadBestEffort(resourceState.client, {
      threadId: resourceState.thread.threadId,
      timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS,
    });
  userInputBridgeRef.current?.cancelPending();
  turnWatches.clearAllTimers();
  releaseCurrentRoute();
  await releaseSharedClientLeaseAndRetireOneShotClient();
  if (resourceState.nativeHookRelay)
    if (state.shouldDelayNativeHookRelayUnregister)
      scheduleCodexNativeHookRelayUnregister({
        relay: resourceState.nativeHookRelay,
        hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec,
      });
    else resourceState.nativeHookRelay.unregister();
  await releaseSandboxExecEnvironment();
  runAbortController.signal.removeEventListener("abort", abortListener);
  steeringQueueRef.current?.cancel();
  freezeRunTerminalOutcome();
  params.replyOperation?.detachBackend(handle);
  clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
}
//#endregion
//#region extensions/codex/src/app-server/workspace-dir-cache.ts
/** Process-local cache of Codex workspaces already created by the run loop. */
const codexWorkspaceDirCache = /* @__PURE__ */ new Set();
//#endregion
//#region extensions/codex/src/app-server/run-attempt-lifecycle.ts
const CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN = 4;
function shouldKeepCodexSharedAbortOpen(params) {
  if (params.explicitCancellationObserved || params.result.aborted || params.result.externalAbort)
    return false;
  return params.trigger === "memory" || !params.attemptSucceeded;
}
function withCodexAppServerFastModeServiceTier(appServer, params) {
  const fastMode = typeof params.fastMode === "function" ? params.fastMode() : params.fastMode;
  const serviceTier = fastMode === void 0 ? appServer.serviceTier : fastMode ? "priority" : void 0;
  if (serviceTier === appServer.serviceTier) return appServer;
  if (serviceTier)
    return {
      ...appServer,
      serviceTier,
    };
  return {
    ...appServer,
    serviceTier: null,
  };
}
function estimateCodexAppServerProjectedTurnTokens(params) {
  const inputChars = params.prompt.length + (params.developerInstructions?.length ?? 0);
  return Math.max(1, Math.ceil(inputChars / CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN));
}
async function ensureCodexWorkspaceDirOnce(workspaceDir) {
  const normalized = path.resolve(workspaceDir);
  if (codexWorkspaceDirCache.has(normalized)) {
    try {
      if ((await fs.stat(normalized)).isDirectory()) return;
    } catch (error) {
      if ((typeof error === "object" && error ? error.code : void 0) !== "ENOENT") throw error;
    }
    codexWorkspaceDirCache.delete(normalized);
  }
  await fs.mkdir(normalized, { recursive: true });
  codexWorkspaceDirCache.add(normalized);
}
async function emitCodexAppServerEvent(params, event) {
  try {
    emitAgentEvent({
      runId: params.runId,
      stream: event.stream,
      data: event.data,
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    });
  } catch (error) {
    log.debug("codex app-server global agent event emit failed", { error });
  }
  try {
    await params.onAgentEvent?.(event);
  } catch (error) {
    log.debug("codex app-server agent event handler threw", { error });
  }
}
async function runCodexAgentEndHook(params, hookParams) {
  const sideEffectParams = {
    ...hookParams,
    ctx: {
      ...hookParams.ctx,
      config: params.config,
    },
  };
  if (!params.messageChannel && !params.messageProvider) {
    await awaitAgentEndSideEffects(sideEffectParams);
    return;
  }
  runAgentEndSideEffects(sideEffectParams);
}
//#endregion
//#region extensions/codex/src/app-server/startup-binding.ts
const CODEX_APP_SERVER_NATIVE_THREAD_FALLBACK_MAX_TOKENS = 3e5;
const CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS = 2e4;
const CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_TOKENS = 8e3;
const CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_RATIO = 0.5;
const CODEX_APP_SERVER_BYTE_UNITS = {
  b: 1,
  k: 1024,
  kb: 1024,
  kib: 1024,
  m: 1024 * 1024,
  mb: 1024 * 1024,
  mib: 1024 * 1024,
  g: 1024 * 1024 * 1024,
  gb: 1024 * 1024 * 1024,
  gib: 1024 * 1024 * 1024,
  t: 1024 * 1024 * 1024 * 1024,
  tb: 1024 * 1024 * 1024 * 1024,
  tib: 1024 * 1024 * 1024 * 1024,
};
const codexSessionRecordCache = /* @__PURE__ */ new Map();
function parseCodexAppServerByteLimit(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
  if (typeof value !== "string") return;
  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/i);
  if (!match) return;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount <= 0) return;
  const unit = (match[2] ?? "b").toLowerCase();
  const multiplier = CODEX_APP_SERVER_BYTE_UNITS[unit];
  if (multiplier === void 0) return;
  return Math.max(1, Math.round(amount * multiplier));
}
async function listCodexAppServerRolloutFilesForThread(agentDir, threadId, codexHome) {
  const resolvedAgentDir = path.resolve(agentDir);
  const resolvedCodexHome = codexHome?.trim()
    ? path.resolve(codexHome)
    : resolveCodexAppServerHomeDir(resolvedAgentDir);
  const roots = [
    path.join(resolvedCodexHome, "sessions"),
    path.join(resolveCodexAppServerHomeDir(resolvedAgentDir), "sessions"),
    path.join(resolvedAgentDir, "agent", "codex-home", "sessions"),
    path.join(path.dirname(resolvedAgentDir), "codex-home", "sessions"),
  ];
  const files = [];
  const visited = /* @__PURE__ */ new Set();
  for (const root of roots) {
    if (visited.has(root)) continue;
    visited.add(root);
    const stack = [root];
    while (stack.length > 0) {
      const dir = stack.pop();
      if (!dir) continue;
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          stack.push(file);
          continue;
        }
        if (!entry.isFile() || !entry.name.endsWith(".jsonl") || !entry.name.includes(threadId))
          continue;
        try {
          files.push({
            path: file,
            bytes: (await fs.stat(file)).size,
          });
        } catch {}
      }
    }
  }
  return files;
}
async function readCodexSessionRecordForSessionFile(sessionFile) {
  if (isSqliteSessionFileMarker(sessionFile)) return;
  const sessionsFile = path.join(path.dirname(sessionFile), "sessions.json");
  const resolvedSessionFile = path.resolve(sessionFile);
  let stat;
  try {
    stat = await fs.stat(sessionsFile);
  } catch {
    codexSessionRecordCache.delete(resolvedSessionFile);
    return;
  }
  const cached = codexSessionRecordCache.get(resolvedSessionFile);
  if (
    cached?.sessionsFile === sessionsFile &&
    cached.mtimeMs === stat.mtimeMs &&
    cached.size === stat.size
  )
    return cached.record;
  let store;
  try {
    store = JSON.parse(await fs.readFile(sessionsFile, "utf8"));
  } catch {
    codexSessionRecordCache.delete(resolvedSessionFile);
    return;
  }
  if (!isJsonObject(store)) {
    codexSessionRecordCache.delete(resolvedSessionFile);
    return;
  }
  let found;
  for (const [sessionKey, record] of Object.entries(store)) {
    if (!isJsonObject(record) || typeof record.sessionFile !== "string") continue;
    if (path.resolve(record.sessionFile) !== resolvedSessionFile) continue;
    found = {
      sessionKey,
      ...record,
    };
    break;
  }
  codexSessionRecordCache.set(resolvedSessionFile, {
    sessionsFile,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    record: found,
  });
  return found;
}
function isSqliteSessionFileMarker(sessionFile) {
  return parseSqliteSessionFileMarker(sessionFile) !== void 0;
}
async function readCodexAppServerRolloutTokenSnapshot(file) {
  let handle;
  try {
    handle = await fs.open(file, "r");
  } catch {
    return;
  }
  let snapshot;
  try {
    for await (const line of handle.readLines()) {
      const lineSnapshot = readCodexAppServerRolloutTokenSnapshotLine(line);
      if (lineSnapshot !== void 0) {
        snapshot ??= {};
        if (lineSnapshot.totalTokens !== void 0) snapshot.totalTokens = lineSnapshot.totalTokens;
        if (lineSnapshot.modelContextWindow !== void 0)
          snapshot.modelContextWindow = lineSnapshot.modelContextWindow;
      }
    }
  } finally {
    await handle.close();
  }
  return snapshot;
}
function readCodexAppServerRolloutTokenSnapshotLine(line) {
  if (!line.trim()) return;
  try {
    const parsed = JSON.parse(line);
    const payload = isJsonObject(parsed) ? parsed.payload : void 0;
    const info =
      isJsonObject(payload) && payload.type === "token_count" && isJsonObject(payload.info)
        ? payload.info
        : void 0;
    if (!info) return;
    const usage = isJsonObject(info.last_token_usage)
      ? info.last_token_usage
      : isJsonObject(info.total_token_usage)
        ? info.total_token_usage
        : void 0;
    const value = usage?.total_tokens ?? usage?.totalTokens;
    const totalTokens = typeof value === "number" && Number.isFinite(value) ? value : void 0;
    const windowValue = info.model_context_window ?? info.modelContextWindow;
    const modelContextWindow =
      typeof windowValue === "number" && Number.isFinite(windowValue) && windowValue > 0
        ? Math.floor(windowValue)
        : void 0;
    const snapshot = {};
    if (totalTokens !== void 0) snapshot.totalTokens = totalTokens;
    if (modelContextWindow !== void 0) snapshot.modelContextWindow = modelContextWindow;
    return snapshot.totalTokens !== void 0 || snapshot.modelContextWindow !== void 0
      ? snapshot
      : void 0;
  } catch {
    return;
  }
}
function toNonNegativeInt(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
  return Math.floor(value);
}
function readCompactionConfig(config) {
  return isJsonObject(config?.agents?.defaults?.compaction)
    ? config.agents.defaults.compaction
    : void 0;
}
function resolveCodexAppServerNativeThreadReserveTokens(config) {
  const compaction = readCompactionConfig(config);
  const reserveTokens = toNonNegativeInt(compaction?.reserveTokens);
  const reserveTokensFloor = toNonNegativeInt(compaction?.reserveTokensFloor);
  if (reserveTokens !== void 0)
    return Math.max(
      reserveTokens,
      reserveTokensFloor ?? CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS,
    );
  return reserveTokensFloor ?? CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS;
}
function resolveCodexAppServerNativeThreadTokenFuse(params) {
  const projectedTurnTokens =
    typeof params.projectedTurnTokens === "number" &&
    Number.isFinite(params.projectedTurnTokens) &&
    params.projectedTurnTokens > 0
      ? Math.floor(params.projectedTurnTokens)
      : 0;
  const contextWindow =
    params.modelContextWindow ?? CODEX_APP_SERVER_NATIVE_THREAD_FALLBACK_MAX_TOKENS;
  const minPromptBudget = Math.min(
    CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_TOKENS,
    Math.max(1, Math.floor(contextWindow * CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_RATIO)),
  );
  const effectiveReserveTokens = Math.min(
    params.reserveTokens,
    Math.max(0, contextWindow - minPromptBudget),
  );
  return Math.max(1, contextWindow - effectiveReserveTokens - projectedTurnTokens);
}
function maxFiniteNumber(values) {
  const nums = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (nums.length === 0) return;
  return Math.max(...nums);
}
function minFiniteNumber(values) {
  const nums = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (nums.length === 0) return;
  return Math.min(...nums);
}
function hasContextEngineThreadBootstrapProjection(binding) {
  return binding.contextEngine?.projection?.mode === "thread_bootstrap";
}
/** Clears and drops a binding when the native Codex thread is too large to resume safely. */
async function rotateOversizedCodexAppServerStartupBinding(params) {
  const binding = params.binding;
  if (!binding?.threadId) return binding;
  if (binding.connectionScope === "supervision") return binding;
  const sessionRecord = await readCodexSessionRecordForSessionFile(params.sessionFile);
  const rolloutFiles = await listCodexAppServerRolloutFilesForThread(
    params.agentDir,
    binding.threadId,
    params.codexHome,
  );
  const compaction = readCompactionConfig(params.config);
  const shouldDeferByteGuard =
    compaction?.truncateAfterCompaction === true &&
    params.contextEngineActive === true &&
    hasContextEngineThreadBootstrapProjection(binding);
  if (compaction?.truncateAfterCompaction === true && !shouldDeferByteGuard) {
    const maxBytes = parseCodexAppServerByteLimit(compaction.maxActiveTranscriptBytes);
    if (maxBytes !== void 0) {
      const oversizedFiles = rolloutFiles.filter((file) => file.bytes >= maxBytes);
      if (oversizedFiles.length > 0) {
        log.warn(
          "codex app-server native transcript exceeded active byte limit; starting a fresh thread",
          {
            threadId: binding.threadId,
            maxBytes,
            files: oversizedFiles.map((file) => ({
              path: file.path,
              bytes: file.bytes,
            })),
          },
        );
        await params.bindingStore.mutate(params.identity, {
          kind: "clear",
          threadId: binding.threadId,
        });
        return;
      }
    }
  }
  const nativeTokenSnapshots = await Promise.all(
    rolloutFiles.map(async (file) => readCodexAppServerRolloutTokenSnapshot(file.path)),
  );
  const nativeTokens = maxFiniteNumber(
    nativeTokenSnapshots.map((snapshot) => snapshot?.totalTokens),
  );
  const nativeModelContextWindow = maxFiniteNumber(
    nativeTokenSnapshots.map((snapshot) => snapshot?.modelContextWindow),
  );
  const sessionModelContextWindow =
    typeof sessionRecord?.contextTokens === "number" &&
    Number.isFinite(sessionRecord.contextTokens) &&
    sessionRecord.contextTokens > 0
      ? Math.floor(sessionRecord.contextTokens)
      : void 0;
  const reserveTokens = resolveCodexAppServerNativeThreadReserveTokens(params.config);
  const maxTokens = resolveCodexAppServerNativeThreadTokenFuse({
    modelContextWindow: minFiniteNumber([nativeModelContextWindow, sessionModelContextWindow]),
    reserveTokens,
    projectedTurnTokens: params.projectedTurnTokens,
  });
  const sessionTokens =
    sessionRecord?.totalTokensFresh !== false &&
    typeof sessionRecord?.totalTokens === "number" &&
    Number.isFinite(sessionRecord.totalTokens)
      ? sessionRecord.totalTokens
      : void 0;
  const tokenCount = maxFiniteNumber([sessionTokens, nativeTokens]);
  if (tokenCount !== void 0 && tokenCount >= maxTokens) {
    log.warn(
      "codex app-server native transcript exceeded active token limit; starting a fresh thread",
      {
        threadId: binding.threadId,
        maxTokens,
        sessionKey: sessionRecord?.sessionKey,
        sessionTokens,
        nativeTokens,
        nativeModelContextWindow,
        sessionModelContextWindow,
        reserveTokens,
        projectedTurnTokens: params.projectedTurnTokens,
      },
    );
    await params.bindingStore.mutate(params.identity, {
      kind: "clear",
      threadId: binding.threadId,
    });
    return;
  }
  if (compaction?.truncateAfterCompaction !== true) return binding;
  if (shouldDeferByteGuard) {
    log.debug(
      "codex app-server deferring native transcript byte guard for context-engine thread bootstrap",
      {
        threadId: binding.threadId,
        engineId: binding.contextEngine?.engineId,
        epoch: binding.contextEngine?.projection?.epoch,
        fingerprint: binding.contextEngine?.projection?.fingerprint,
      },
    );
    return binding;
  }
  return binding;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-connection.ts
async function prepareCodexAttemptConnection({ params, options }) {
  const attemptStartedAt = Date.now();
  const profilerEnabled = isCodexAppServerProfilerEnabled(params.config);
  const codexModelCallTrace = freezeDiagnosticTraceContext(
    createDiagnosticTraceContextFromActiveScope(),
  );
  const codexModelContentCapture = resolveDiagnosticModelContentCapturePolicy(params.config);
  const codexModelCallId = `${params.runId}:codex-model:1`;
  const fastModeAutoStartedAtMs =
    typeof params.fastModeStartedAtMs === "number" && Number.isFinite(params.fastModeStartedAtMs)
      ? params.fastModeStartedAtMs
      : void 0;
  const fastModeAutoProgressState = params.fastModeAutoProgressState ?? {
    offAnnounced: false,
    resetAnnounced: false,
  };
  const preDynamicStartupStages = createCodexDynamicToolBuildStageTracker({
    enabled: profilerEnabled,
  });
  const attemptClientFactory = options.clientFactory ?? getLeasedSharedCodexAppServerClient;
  const runtimeArtifactRequest =
    params.captureRuntimeArtifact || params.expectedRuntimeArtifact
      ? params.expectedRuntimeArtifact
        ? { expected: params.expectedRuntimeArtifact }
        : {}
      : void 0;
  const pluginConfig = readCodexPluginConfig(options.pluginConfig);
  const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig });
  const { sessionAgentId } = resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.config,
    agentId: params.agentId,
  });
  const beforeToolCallPolicy = getBeforeToolCallPolicyDiagnosticState();
  preDynamicStartupStages.mark("config");
  const resolvedWorkspace = resolveUserPath(params.workspaceDir);
  await ensureCodexWorkspaceDirOnce(resolvedWorkspace);
  preDynamicStartupStages.mark("workspace");
  const sandboxSessionKey =
    params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
  const contextSessionKey = params.sessionKey?.trim() || sandboxSessionKey;
  const sandbox = await resolveSandboxContext({
    config: params.config,
    sessionKey: sandboxSessionKey,
    workspaceDir: resolvedWorkspace,
  });
  preDynamicStartupStages.mark("sandbox");
  const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
    execOverrides: params.execOverrides,
    approvals: loadExecApprovals(),
    config: params.config,
    agentId: sessionAgentId,
  });
  const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
  const bindingIdentity = sessionBindingIdentity({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    config: params.config,
  });
  const bindingStore = options.bindingStore;
  preDynamicStartupStages.mark("session-agent");
  let activeContextEngine = isActiveHarnessContextEngine(params.contextEngine)
    ? params.contextEngine
    : void 0;
  const isInactiveThreadBootstrapBinding = (binding) =>
    !activeContextEngine && binding?.contextEngine?.projection?.mode === "thread_bootstrap";
  let startupBinding = await bindingStore.read(bindingIdentity);
  if (!startupBinding && bindingIdentity.kind === "session" && bindingIdentity.sessionKey) {
    if (
      !(await reclaimCurrentCodexSessionGeneration({
        bindingStore,
        identity: bindingIdentity,
        config: params.config,
      }))
    )
      throw new Error(
        `Codex session generation is no longer current: ${bindingIdentity.sessionId}`,
      );
    startupBinding = await bindingStore.read(bindingIdentity);
  }
  preDynamicStartupStages.mark("read-binding");
  const usesSupervisionConnection = startupBinding?.connectionScope === "supervision";
  if (usesSupervisionConnection) activeContextEngine = void 0;
  if (usesSupervisionConnection && pluginConfig.supervision?.enabled !== true)
    throw new Error(
      "Codex supervision is disabled; refusing to open a native user-home supervised session",
    );
  const resolveRuntimeOptionsForBinding = (selection) =>
    resolveCodexBindingAppServerConnection({
      binding: startupBinding,
      pluginConfig,
      execPolicy,
      modelProvider: selection.modelProvider,
      model: selection.model,
      config: params.config,
      agentDir,
      openClawSandboxActive: sandbox?.enabled === true,
    }).appServer;
  const initialStartupBindingHadInactiveThreadBootstrap =
    isInactiveThreadBootstrapBinding(startupBinding);
  const preparedAuthRoute = usesSupervisionConnection
    ? void 0
    : params.runtimePlan?.auth.modelRoute;
  const startupAuthProfileCandidate = usesSupervisionConnection
    ? void 0
    : preparedAuthRoute
      ? params.runtimePlan?.auth.forwardedAuthProfileId
      : (params.runtimePlan?.auth.forwardedAuthProfileId ??
        params.authProfileId ??
        startupBinding?.authProfileId);
  const resolvedStartupAuthProfileId = usesSupervisionConnection
    ? void 0
    : preparedAuthRoute
      ? startupAuthProfileCandidate
      : params.authProfileStore
        ? resolveCodexAppServerAuthProfileId({
            authProfileId: startupAuthProfileCandidate,
            store: params.authProfileStore,
            config: params.config,
          })
        : resolveCodexAppServerAuthProfileIdForAgent({
            authProfileId: startupAuthProfileCandidate,
            agentDir,
            config: params.config,
          });
  const {
    authProfileId: startupAuthProfileId,
    nativeAuthProfile,
    preparedAuth: startupPreparedAuth,
  } = usesSupervisionConnection
    ? {
        authProfileId: void 0,
        nativeAuthProfile: true,
        preparedAuth: void 0,
      }
    : await resolveCodexAppServerPreparedAuthHandoff({
        authRequirement: preparedAuthRoute?.authRequirement,
        resolvedApiKey: params.resolvedApiKey,
        authProfileId: resolvedStartupAuthProfileId,
        authProfileStore: params.authProfileStore,
        agentDir,
        config: params.config,
        subscriptionProfileRequiredError:
          "Prepared Codex subscription route requires a forwarded OpenAI OAuth or token profile.",
        subscriptionProfileUnusableError: "Prepared Codex subscription auth profile is unusable.",
      });
  const startupClientAuthProfileId =
    usesSupervisionConnection || startupPreparedAuth?.kind === "api-key"
      ? null
      : startupAuthProfileId;
  const resolveReviewerPolicyContext = (binding) => {
    const nativeModelOwned = binding?.preserveNativeModel === true;
    return resolveCodexModelBackedReviewerPolicyContext({
      provider: nativeModelOwned ? "codex" : params.provider,
      model: nativeModelOwned ? binding.model : params.modelId,
      bindingModelProvider: binding?.modelProvider,
      bindingModel: binding?.model,
      nativeAuthProfile,
    });
  };
  let reviewerPolicyContext = resolveReviewerPolicyContext(startupBinding);
  preDynamicStartupStages.mark("auth-profile");
  let configuredAppServer = resolveRuntimeOptionsForBinding({
    modelProvider: reviewerPolicyContext.modelProvider,
    model: reviewerPolicyContext.model,
  });
  const effectiveWorkspace = sandbox?.enabled
    ? sandbox.workspaceAccess === "rw"
      ? resolvedWorkspace
      : sandbox.workspaceDir
    : resolvedWorkspace;
  const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
  if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace)
    throw new Error(
      "cwd override is not supported for sandboxed Codex app-server runs; omit cwd or use the agent workspace as cwd",
    );
  const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : (requestedCwd ?? effectiveWorkspace);
  await ensureCodexWorkspaceDirOnce(effectiveWorkspace);
  preDynamicStartupStages.mark("effective-workspace");
  const resolvePolicyAppServer = () =>
    resolveCodexAppServerForOpenClawToolPolicy({
      appServer: configuredAppServer,
      pluginConfig,
      env: process.env,
      shouldPromote:
        beforeToolCallPolicy.hasBeforeToolCallHook ||
        beforeToolCallPolicy.trustedToolPolicies.length > 0,
      execPolicy,
      canUseUntrustedApprovalPolicy:
        configuredAppServer.start.transport !== "stdio" ||
        isCodexAppServerApprovalPolicyAllowedByRequirements("untrusted"),
    });
  let policyAppServer = resolvePolicyAppServer();
  let appServer = resolveCodexAppServerForModelProvider({
    appServer: policyAppServer,
    provider: reviewerPolicyContext.modelProvider,
    model: reviewerPolicyContext.model,
    config: params.config,
    env: process.env,
    agentDir,
  });
  if (configuredAppServer.approvalPolicy === "never" && appServer.approvalPolicy === "untrusted")
    log.info("codex app-server approval policy promoted for OpenClaw tool policy", {
      from: "never",
      to: "untrusted",
      beforeToolCallHook: beforeToolCallPolicy.hasBeforeToolCallHook,
      trustedToolPolicies: beforeToolCallPolicy.trustedToolPolicies,
    });
  preDynamicStartupStages.mark("app-server-policy");
  preDynamicStartupStages.mark("native-hook-relay");
  const terminalState = {
    explicitCancellationObserved: false,
    explicitCancellationReason: void 0,
    terminalOutcomeFrozen: false,
    sharedAbortAllowedAfterTerminalOutcome: false,
  };
  const runAbortController = new AbortController();
  let attemptAbortNotified = false;
  const notifyAttemptAbort = () => {
    if (attemptAbortNotified) return;
    attemptAbortNotified = true;
    params.onAttemptAbort?.();
  };
  const abortExplicitly = (reason) => {
    if (terminalState.terminalOutcomeFrozen) {
      if (terminalState.sharedAbortAllowedAfterTerminalOutcome) notifyAttemptAbort();
      return;
    }
    notifyAttemptAbort();
    terminalState.explicitCancellationObserved = true;
    terminalState.explicitCancellationReason ??= reason;
    runAbortController.abort(reason);
  };
  const abortFromUpstream = () => {
    abortExplicitly(params.abortSignal?.reason ?? "upstream_abort");
  };
  if (params.abortSignal?.aborted) abortFromUpstream();
  else params.abortSignal?.addEventListener("abort", abortFromUpstream, { once: true });
  startupBinding = await rotateOversizedCodexAppServerStartupBinding({
    binding: startupBinding,
    bindingStore,
    identity: bindingIdentity,
    sessionFile: params.sessionFile,
    agentDir,
    codexHome: appServer.start.env?.CODEX_HOME,
    config: params.config,
    contextEngineActive: Boolean(activeContextEngine),
  });
  const initialInactiveThreadBootstrapBindingForcedFreshStart =
    initialStartupBindingHadInactiveThreadBootstrap && !startupBinding?.threadId;
  preDynamicStartupStages.mark("rotate-binding");
  reviewerPolicyContext = resolveReviewerPolicyContext(startupBinding);
  configuredAppServer = resolveRuntimeOptionsForBinding({
    modelProvider: reviewerPolicyContext.modelProvider,
    model: reviewerPolicyContext.model,
  });
  policyAppServer = resolvePolicyAppServer();
  appServer = resolveCodexAppServerForModelProvider({
    appServer: policyAppServer,
    provider: reviewerPolicyContext.modelProvider,
    model: reviewerPolicyContext.model,
    config: params.config,
    env: process.env,
    agentDir,
  });
  const nativeHookRelayEvents = resolveCodexNativeHookRelayEvents({
    configuredEvents: options.nativeHookRelay?.events,
    appServer,
  });
  const mutable = {
    startupBinding,
    pluginAppServer: appServer,
  };
  const resolveRuntimeOptionsForCurrentBinding = (selection) =>
    resolveCodexBindingAppServerConnection({
      binding: mutable.startupBinding,
      pluginConfig,
      execPolicy,
      modelProvider: selection.modelProvider,
      model: selection.model,
      config: params.config,
      agentDir,
      openClawSandboxActive: sandbox?.enabled === true,
    }).appServer;
  return {
    params,
    options,
    attemptStartedAt,
    profilerEnabled,
    codexModelCallTrace,
    codexModelContentCapture,
    codexModelCallId,
    fastModeAutoStartedAtMs,
    fastModeAutoProgressState,
    preDynamicStartupStages,
    attemptClientFactory,
    runtimeArtifactRequest,
    pluginConfig,
    computerUseConfig,
    sessionAgentId,
    resolvedWorkspace,
    sandboxSessionKey,
    contextSessionKey,
    sandbox,
    agentDir,
    bindingIdentity,
    bindingStore,
    activeContextEngine,
    isInactiveThreadBootstrapBinding,
    usesSupervisionConnection,
    startupAuthProfileId,
    startupPreparedAuth,
    startupClientAuthProfileId,
    effectiveWorkspace,
    effectiveCwd,
    appServer,
    nativeHookRelayEvents,
    runAbortController,
    terminalState,
    abortExplicitly,
    abortFromUpstream,
    resolveReviewerPolicyContext,
    resolveRuntimeOptionsForCurrentBinding,
    mutable,
    initialStartupBindingHadInactiveThreadBootstrap,
    initialInactiveThreadBootstrapBindingForcedFreshStart,
  };
}
//#endregion
//#region extensions/codex/src/app-server/attempt-context.ts
/**
 * Builds Codex app-server prompt context, workspace bootstrap injections,
 * system-prompt reports, and context-engine projection decisions.
 */
const CODEX_NATIVE_PROJECT_DOC_BASENAMES = /* @__PURE__ */ new Set(["agents.md"]);
const CODEX_INHERITED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = /* @__PURE__ */ new Set(["tools.md"]);
const CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = /* @__PURE__ */ new Set([
  "identity.md",
  "soul.md",
  "user.md",
]);
const CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = /* @__PURE__ */ new Set([
  ...CODEX_INHERITED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES,
  ...CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES,
]);
const CODEX_HEARTBEAT_CONTEXT_BASENAME = "heartbeat.md";
const CODEX_MEMORY_CONTEXT_BASENAME = "memory.md";
const CODEX_MEMORY_TOOL_NAMES = /* @__PURE__ */ new Set(["memory_search", "memory_get"]);
const CODEX_BOOTSTRAP_CONTEXT_ORDER = /* @__PURE__ */ new Map([
  ["soul.md", 10],
  ["identity.md", 20],
  ["user.md", 30],
  ["tools.md", 40],
  ["bootstrap.md", 50],
  ["memory.md", 60],
  ["heartbeat.md", 70],
]);
/** Reads mirrored Codex session history for harness hooks. */
async function readMirroredSessionHistoryMessages(params) {
  const messages = await readCodexMirroredSessionHistoryMessages(params);
  if (!messages)
    log.warn("failed to read mirrored session history for codex harness hooks", {
      sessionFile: params.sessionFile,
    });
  return messages;
}
/** Reads a valid thread-bootstrap projection request from context-engine output. */
function readContextEngineThreadBootstrapProjection(projection) {
  if (projection?.mode !== "thread_bootstrap") return;
  const epoch = projection.epoch?.trim();
  if (!epoch) {
    log.warn(
      "context engine requested Codex thread-bootstrap projection without an epoch; using per-turn projection",
    );
    return;
  }
  const fingerprint = projection.fingerprint?.trim();
  return {
    mode: "thread_bootstrap",
    epoch,
    ...(fingerprint ? { fingerprint } : {}),
  };
}
/**
 * Decides whether an existing Codex thread can reuse its context-engine
 * bootstrap projection or must be reprojected.
 */
function resolveContextEngineBootstrapProjectionDecision(params) {
  const bindingProjection = params.startupBinding?.contextEngine?.projection;
  if (!params.startupBinding?.threadId || !bindingProjection)
    return {
      project: true,
      reason: !params.startupBinding?.threadId
        ? "missing-thread-binding"
        : "missing-projection-binding",
    };
  if (
    !params.expectedBinding ||
    !isContextEngineBindingCompatible(params.startupBinding.contextEngine, params.expectedBinding)
  )
    return {
      project: true,
      reason: "context-engine-binding-mismatch",
    };
  if (
    !areCodexDynamicToolFingerprintsCompatible({
      previous: params.startupBinding.dynamicToolsFingerprint,
      next: params.dynamicToolsFingerprint,
      nextLegacy: params.legacyDynamicToolsFingerprint,
    })
  )
    return {
      project: true,
      reason: "dynamic-tools-mismatch",
    };
  return bindingProjection.mode !== "thread_bootstrap" ||
    bindingProjection.epoch !== params.projection.epoch ||
    bindingProjection.fingerprint !== params.projection.fingerprint
    ? {
        project: true,
        reason: "projection-mismatch",
      }
    : {
        project: false,
        reason: "matching-thread-bootstrap-binding",
      };
}
/**
 * Loads workspace bootstrap files and partitions them into Codex-native prompt,
 * developer-instruction, heartbeat, and memory-tool contexts.
 */
async function buildCodexWorkspaceBootstrapContext(params) {
  try {
    const memoryToolsAvailable =
      params.memoryToolNames.length > 0 &&
      canRouteCodexWorkspaceMemoryThroughTools({
        config: params.params.config,
        agentId: params.params.agentId ?? params.sessionAgentId,
        workspaceDir: params.effectiveWorkspace,
      });
    const bootstrapFiles = await resolveBootstrapFilesForRun({
      workspaceDir: params.resolvedWorkspace,
      config: params.params.config,
      sessionKey: params.sessionKey,
      sessionId: params.params.sessionId,
      agentId: params.params.agentId ?? params.sessionAgentId,
      warn: (message) => log.warn(message),
      contextMode: params.params.bootstrapContextMode,
      runKind: params.params.bootstrapContextRunKind,
    });
    const memoryToolRoutedBootstrapFiles = memoryToolsAvailable
      ? selectCodexWorkspaceMemoryReferenceFiles({
          bootstrapFiles,
          workspaceDir: params.resolvedWorkspace,
        })
      : [];
    const memoryReferenceFiles = memoryToolRoutedBootstrapFiles.map((file) =>
      remapCodexContextFilePath({
        file: toCodexEmbeddedContextFile(file),
        sourceWorkspaceDir: params.resolvedWorkspace,
        targetWorkspaceDir: params.effectiveWorkspace,
      }),
    );
    const contextFiles = buildBootstrapContextForFiles(
      memoryToolsAvailable
        ? bootstrapFiles.filter(
            (file) =>
              !isCodexWorkspaceRootMemoryBootstrapFile({
                file,
                workspaceDir: params.resolvedWorkspace,
              }),
          )
        : bootstrapFiles,
      {
        config: params.params.config,
        agentId: params.params.agentId ?? params.sessionAgentId,
        warn: (message) => log.warn(message),
      },
    ).map((file) =>
      remapCodexContextFilePath({
        file,
        sourceWorkspaceDir: params.resolvedWorkspace,
        targetWorkspaceDir: params.effectiveWorkspace,
      }),
    );
    const promptContextFiles = selectCodexWorkspacePromptContextFiles(contextFiles, {
      excludeMemory: memoryToolsAvailable,
      memoryWorkspaceDir: params.effectiveWorkspace,
    });
    const developerInstructionFiles = shouldInjectCodexOpenClawPromptContext(params.params)
      ? selectCodexWorkspaceInheritedDeveloperInstructionFiles(contextFiles)
      : [];
    const turnScopedDeveloperInstructionFiles = shouldInjectCodexOpenClawPromptContext(
      params.params,
    )
      ? selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles)
      : [];
    const heartbeatReferenceFiles = selectCodexWorkspaceHeartbeatReferenceFiles(contextFiles);
    return {
      bootstrapFiles,
      contextFiles,
      promptContextFiles,
      developerInstructionFiles,
      turnScopedDeveloperInstructionFiles,
      heartbeatReferenceFiles,
      memoryReferenceFiles,
      memoryToolRoutedBootstrapFiles,
      memoryToolNames: [...params.memoryToolNames],
      memoryToolRouted: memoryToolsAvailable,
      promptContext: renderCodexWorkspaceBootstrapPromptContext(promptContextFiles),
      developerInstructions:
        renderCodexWorkspaceThreadDeveloperInstructions(developerInstructionFiles),
      turnScopedDeveloperInstructions: renderCodexWorkspaceCollaborationDeveloperInstructions(
        turnScopedDeveloperInstructionFiles,
      ),
      memoryCollaborationInstructions: shouldInjectCodexOpenClawPromptContext(params.params)
        ? renderCodexWorkspaceMemoryCollaborationInstructions({
            files: memoryReferenceFiles,
            toolNames: params.memoryToolNames,
            memoryToolRouted: memoryToolsAvailable,
            citationsMode: params.params.config?.memory?.citations,
            agentId: params.params.agentId ?? params.sessionAgentId,
            agentSessionKey: params.sessionKey,
          })
        : void 0,
      heartbeatCollaborationInstructions:
        renderCodexWorkspaceHeartbeatReference(heartbeatReferenceFiles),
    };
  } catch (error) {
    log.warn("failed to load codex workspace bootstrap instructions", { error });
    return {
      bootstrapFiles: [],
      contextFiles: [],
    };
  }
}
/**
 * Builds the prompt-size, bootstrap-file, skill, and tool-schema accounting
 * report for a Codex run.
 */
function buildCodexSystemPromptReport(params) {
  const toolEntries = flattenCodexDynamicToolFunctions(params.tools).map(buildCodexToolReportEntry);
  const schemaChars = toolEntries.reduce((sum, tool) => sum + tool.schemaChars, 0);
  const skillsPrompt = params.skillsPrompt.trim();
  const bootstrapMaxChars = readPositiveNumber(
    params.attempt.config?.agents?.defaults?.bootstrapMaxChars,
  );
  const bootstrapTotalMaxChars = readPositiveNumber(
    params.attempt.config?.agents?.defaults?.bootstrapTotalMaxChars,
  );
  return {
    source: "run",
    generatedAt: Date.now(),
    sessionId: params.attempt.sessionId,
    sessionKey: params.sessionKey,
    provider: params.attempt.provider,
    model: params.attempt.modelId,
    workspaceDir: params.workspaceDir,
    ...(bootstrapMaxChars ? { bootstrapMaxChars } : {}),
    ...(bootstrapTotalMaxChars ? { bootstrapTotalMaxChars } : {}),
    systemPrompt: {
      chars: params.developerInstructions.length,
      projectContextChars: 0,
      nonProjectContextChars: params.developerInstructions.length,
      hash: sha256Text(params.developerInstructions),
    },
    injectedWorkspaceFiles: buildCodexBootstrapInjectionStats({
      bootstrapFiles: params.workspaceBootstrapContext.bootstrapFiles,
      injectedFiles: params.workspaceBootstrapContext.promptContextFiles ?? [],
      developerInstructionFiles: [
        ...(params.workspaceBootstrapContext.developerInstructionFiles ?? []),
        ...(params.workspaceBootstrapContext.turnScopedDeveloperInstructionFiles ?? []),
      ],
      memoryToolRoutedBootstrapFiles:
        params.workspaceBootstrapContext.memoryToolRoutedBootstrapFiles ?? [],
      memoryToolRouted: params.workspaceBootstrapContext.memoryToolRouted === true,
    }),
    skills: {
      promptChars: skillsPrompt.length,
      hash: sha256Text(skillsPrompt),
      entries: buildCodexSkillReportEntries(skillsPrompt),
    },
    tools: {
      listChars: 0,
      schemaChars,
      entries: toolEntries,
    },
  };
}
function buildCodexSkillReportEntries(skillsPrompt) {
  if (!skillsPrompt) return [];
  return Array.from(skillsPrompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi))
    .map((match) => match[0] ?? "")
    .map((block) => ({
      name: block.match(/<name>\s*([^<]+?)\s*<\/name>/i)?.[1]?.trim() || "(unknown)",
      blockChars: block.length,
    }))
    .filter((entry) => entry.blockChars > 0);
}
function buildCodexToolReportEntry(tool) {
  const summary = tool.description.trim();
  if (tool.deferLoading === true)
    return {
      name: tool.name,
      summaryChars: summary.length,
      summaryHash: sha256Text(summary),
      schemaChars: 0,
      schemaHash: stableJsonHash(null),
      propertiesCount: null,
    };
  return {
    name: tool.name,
    summaryChars: summary.length,
    summaryHash: sha256Text(summary),
    ...buildCodexToolSchemaStats(tool.inputSchema),
  };
}
function buildCodexToolSchemaStats(schema) {
  const schemaChars = (() => {
    try {
      return JSON.stringify(schema).length;
    } catch {
      return 0;
    }
  })();
  const properties =
    isJsonObject(schema) && isJsonObject(schema.properties) ? schema.properties : null;
  return {
    schemaChars,
    schemaHash: stableJsonHash(schema),
    propertiesCount: properties ? Object.keys(properties).length : null,
  };
}
function sha256Text(value) {
  return createHash("sha256").update(value).digest("hex");
}
function normalizeForStableHash(value) {
  if (Array.isArray(value)) return value.map((entry) => normalizeForStableHash(entry));
  if (value && typeof value === "object") {
    const record = value;
    return Object.fromEntries(
      Object.keys(record)
        .toSorted((left, right) => left.localeCompare(right))
        .map((key) => [key, normalizeForStableHash(record[key])]),
    );
  }
  return value;
}
function stableJsonHash(value) {
  return sha256Text(JSON.stringify(normalizeForStableHash(value)) ?? "null");
}
function buildCodexBootstrapInjectionStats(params) {
  const injectedIndex = indexCodexContextFileContent(params.injectedFiles);
  const developerInstructionIndex = indexCodexContextFileContent(
    params.developerInstructionFiles ?? [],
  );
  const memoryToolRoutedPaths = new Set(
    (params.memoryToolRoutedBootstrapFiles ?? [])
      .map((file) => readNonEmptyString(file.path))
      .filter(isNonEmptyString$1)
      .map(normalizeCodexContextFilePath),
  );
  return params.bootstrapFiles.map((file) => {
    const fileName = readNonEmptyString(file.name);
    const pathValue = readNonEmptyString(file.path) ?? fileName ?? "";
    const displayName = (fileName ?? getCodexContextFileDisplayBasename(pathValue)) || pathValue;
    const baseName = getCodexContextFileBasename(pathValue || fileName || "");
    const rawChars = file.missing ? 0 : (file.content ?? "").trimEnd().length;
    const memoryToolRoutedFile =
      baseName === CODEX_MEMORY_CONTEXT_BASENAME &&
      params.memoryToolRouted === true &&
      memoryToolRoutedPaths.has(normalizeCodexContextFilePath(pathValue));
    const injected = memoryToolRoutedFile
      ? void 0
      : (readCodexIndexedContextFileContent(injectedIndex, pathValue, fileName) ??
        readCodexIndexedContextFileContent(developerInstructionIndex, pathValue, fileName));
    let injectedChars = memoryToolRoutedFile ? 0 : (injected?.length ?? 0);
    let truncated = memoryToolRoutedFile ? false : !file.missing && injectedChars < rawChars;
    if (injected === void 0) {
      if (CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName)) {
        injectedChars = rawChars;
        truncated = false;
      } else if (baseName === CODEX_HEARTBEAT_CONTEXT_BASENAME) {
        injectedChars = 0;
        truncated = false;
      }
    }
    return {
      name: displayName,
      path: pathValue,
      missing: file.missing,
      rawChars,
      injectedChars,
      truncated,
    };
  });
}
function indexCodexContextFileContent(files) {
  const byPath = /* @__PURE__ */ new Map();
  const byBaseName = /* @__PURE__ */ new Map();
  for (const file of files) {
    const pathValue = readNonEmptyString(file.path);
    if (!pathValue) continue;
    if (!byPath.has(pathValue)) byPath.set(pathValue, file.content);
    const baseName = getCodexContextFileBasename(pathValue);
    if (baseName && !byBaseName.has(baseName)) byBaseName.set(baseName, file.content);
  }
  return {
    byPath,
    byBaseName,
  };
}
function readCodexIndexedContextFileContent(index, pathValue, fileName) {
  const pathContent = index.byPath.get(pathValue);
  if (pathContent !== void 0) return pathContent;
  if (fileName) {
    const nameContent = index.byPath.get(fileName);
    if (nameContent !== void 0) return nameContent;
  }
  const baseName = getCodexContextFileBasename(fileName ?? pathValue);
  return baseName ? index.byBaseName.get(baseName) : void 0;
}
function readPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
function readNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
/**
 * Builds OpenClaw-provided workspace prompt context for the current Codex turn.
 */
function buildCodexOpenClawPromptContext(params) {
  if (!shouldInjectCodexOpenClawPromptContext(params.params)) return;
  const sections = [
    params.workspacePromptContext?.trim()
      ? ["## OpenClaw Workspace Context", "", params.workspacePromptContext.trim()].join("\n")
      : void 0,
  ].filter(isNonEmptyString$1);
  if (sections.length === 0) return;
  return [
    "OpenClaw runtime context for this turn:",
    "Treat this OpenClaw-provided context as supporting project/user reference for the current request.",
    "",
    ...sections,
  ].join("\n");
}
function shouldInjectCodexOpenClawPromptContext(params) {
  return !(
    params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron"
  );
}
/** Renders loaded OpenClaw skill prompts as Codex collaboration instructions. */
function renderCodexSkillsCollaborationInstructions(params) {
  if (!shouldInjectCodexOpenClawPromptContext(params.attempt)) return;
  return params.skillsPrompt?.trim()
    ? ["## OpenClaw Skills", "", params.skillsPrompt.trim()].join("\n")
    : void 0;
}
/**
 * Prepends OpenClaw context while preserving leading delivery metadata as
 * routing guidance instead of user request text.
 */
function prependCodexOpenClawPromptContext(prompt, context, options = {}) {
  const { deliveryHint, prompt: promptWithoutDeliveryHint } = splitLeadingCodexDeliveryHint(prompt);
  if (!context?.trim() && (!deliveryHint || options.preservePromptWithoutContext)) return prompt;
  const promptSection = promptWithoutDeliveryHint.startsWith(
    "OpenClaw assembled context for this turn:",
  )
    ? promptWithoutDeliveryHint
    : ["Current user request:", promptWithoutDeliveryHint].join("\n");
  const deliverySection = deliveryHint
    ? [
        "OpenClaw delivery metadata:",
        "This delivery metadata is runtime routing guidance, not the user's request.",
        deliveryHint,
      ].join("\n")
    : void 0;
  return [context?.trim(), deliverySection, promptSection].filter(Boolean).join("\n\n");
}
/**
 * Maps the surviving user-request portion of an input range after delivery
 * metadata has been relocated before the request.
 */
function resolveCodexDeliveryHintPreservedInputRange(params) {
  const { prompt, promptInputRange, decoratedPrompt } = params;
  const { deliveryHint, prompt: promptWithoutDeliveryHint } = splitLeadingCodexDeliveryHint(prompt);
  if (
    !deliveryHint ||
    !promptInputRange ||
    promptInputRange.start < 0 ||
    promptInputRange.end < promptInputRange.start ||
    promptInputRange.end > prompt.length ||
    !decoratedPrompt.endsWith(promptWithoutDeliveryHint)
  )
    return;
  const promptWithoutDeliveryHintStart = prompt.length - promptWithoutDeliveryHint.length;
  const inputStart = Math.max(promptInputRange.start, promptWithoutDeliveryHintStart);
  const inputEnd = Math.max(
    inputStart,
    Math.min(
      promptInputRange.end,
      promptWithoutDeliveryHint.length + promptWithoutDeliveryHintStart,
    ),
  );
  const decoratedPromptSuffixStart = decoratedPrompt.length - promptWithoutDeliveryHint.length;
  const requestHeader = "Current user request:\n";
  const requestHeaderStart = decoratedPromptSuffixStart - 22;
  return {
    start:
      inputStart === promptWithoutDeliveryHintStart &&
      decoratedPrompt.slice(requestHeaderStart, decoratedPromptSuffixStart) === requestHeader
        ? requestHeaderStart
        : decoratedPromptSuffixStart + inputStart - promptWithoutDeliveryHintStart,
    end: decoratedPromptSuffixStart + inputEnd - promptWithoutDeliveryHintStart,
  };
}
function splitLeadingCodexDeliveryHint(prompt) {
  const trimmedStart = prompt.trimStart();
  const matchedHint = MESSAGE_TOOL_DELIVERY_HINTS.find((hint) => trimmedStart.startsWith(hint));
  if (!matchedHint) return { prompt };
  return {
    deliveryHint: matchedHint,
    prompt: trimmedStart
      .slice(matchedHint.length)
      .replace(/^\s*\n/, "")
      .trimStart(),
  };
}
function renderCodexWorkspaceBootstrapPromptContext(contextFiles) {
  const files = contextFiles;
  if (files.length === 0) return;
  const lines = [
    "OpenClaw loaded these user-editable workspace files for the current turn. Codex loads AGENTS.md natively. TOOLS.md is provided as inherited Codex developer instructions. SOUL.md, IDENTITY.md, and USER.md are provided as turn-scoped collaboration instructions so native Codex subagents do not inherit them. HEARTBEAT.md is handled by heartbeat collaboration-mode guidance. Those files are not repeated here.",
    "",
    "# Project Context",
    "",
    "The following project context files have been loaded:",
  ];
  lines.push("");
  for (const file of files) lines.push(`## ${file.path}`, "", file.content, "");
  return lines.join("\n").trim();
}
function selectCodexWorkspacePromptContextFiles(contextFiles, options = {}) {
  const excludeMemory = options.excludeMemory ?? true;
  return contextFiles
    .filter((file) => {
      const baseName = getCodexContextFileBasename(file.path);
      return (
        baseName &&
        !CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName) &&
        !CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES.has(baseName) &&
        baseName !== CODEX_HEARTBEAT_CONTEXT_BASENAME &&
        (!excludeMemory ||
          !isCodexWorkspaceRootMemoryContextFile({
            file,
            workspaceDir: options.memoryWorkspaceDir,
          })) &&
        !isMissingCodexBootstrapContextFile(file)
      );
    })
    .toSorted(compareCodexContextFiles);
}
function selectCodexWorkspaceInheritedDeveloperInstructionFiles(contextFiles) {
  return selectCodexWorkspaceDeveloperInstructionFiles(
    contextFiles,
    CODEX_INHERITED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES,
  );
}
function selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) {
  return selectCodexWorkspaceDeveloperInstructionFiles(
    contextFiles,
    CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES,
  );
}
function selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, basenames) {
  return contextFiles
    .filter((file) => {
      const baseName = getCodexContextFileBasename(file.path);
      return (
        baseName &&
        basenames.has(baseName) &&
        !isMissingCodexBootstrapContextFile(file) &&
        file.content.trim().length > 0
      );
    })
    .toSorted(compareCodexContextFiles);
}
function renderCodexWorkspaceThreadDeveloperInstructions(files) {
  return renderCodexWorkspaceDeveloperInstructions({
    files,
    header: "## OpenClaw Workspace Instructions",
    preamble:
      "OpenClaw loaded these workspace instruction files from the active agent workspace. Internalize and follow them accordingly.",
  });
}
function renderCodexWorkspaceCollaborationDeveloperInstructions(files) {
  return renderCodexWorkspaceDeveloperInstructions({
    files,
    header: "## OpenClaw Agent Soul",
    preamble:
      "OpenClaw loaded these workspace instruction files from the active agent workspace. They are the canonical definitions of who you are, how you think and work, and the human you work alongside. Internalize and follow them accordingly.",
    wrapperTag: "AGENT_SOUL",
  });
}
function renderCodexWorkspaceDeveloperInstructions(params) {
  const { files, header, preamble, wrapperTag } = params;
  if (files.length === 0) return;
  const lines = [header, "", preamble, ""];
  if (wrapperTag) lines.push(`<${wrapperTag}>`, "");
  for (const file of files) lines.push(`### ${file.path}`, "", file.content, "");
  if (wrapperTag) lines.push(`</${wrapperTag}>`);
  return lines.join("\n").trim();
}
function selectCodexWorkspaceHeartbeatReferenceFiles(contextFiles) {
  return contextFiles
    .filter((file) => {
      return (
        getCodexContextFileBasename(file.path) === CODEX_HEARTBEAT_CONTEXT_BASENAME &&
        !isMissingCodexBootstrapContextFile(file) &&
        file.content.trim().length > 0
      );
    })
    .toSorted(compareCodexContextFiles);
}
function renderCodexWorkspaceHeartbeatReference(files) {
  if (files.length === 0) return;
  const lines = [
    "## OpenClaw Heartbeat Workspace",
    "",
    "HEARTBEAT.md exists in the active agent workspace. Read it before proceeding with this heartbeat, then decide what action is appropriate.",
    "",
  ];
  for (const file of files) lines.push(`- ${file.path}`);
  return lines.join("\n").trim();
}
function selectCodexWorkspaceMemoryReferenceFiles(params) {
  return params.bootstrapFiles
    .filter((file) => {
      return (
        isCodexWorkspaceRootMemoryBootstrapFile({
          file,
          workspaceDir: params.workspaceDir,
        }) &&
        !file.missing &&
        (file.content ?? "").trim().length > 0
      );
    })
    .toSorted(compareCodexBootstrapFiles);
}
/**
 * Renders a memory-file reference that points Codex at memory tools instead of
 * embedding MEMORY.md contents.
 */
function renderCodexWorkspaceMemoryReference(params) {
  if (params.files.length === 0) return;
  const lines = [
    "## OpenClaw Workspace Memory",
    "",
    `MEMORY.md exists in the active agent workspace as a memory file, not an instruction file. OpenClaw does not paste its contents into native Codex turns; use ${(params.toolNames?.length ? params.toolNames : Array.from(CODEX_MEMORY_TOOL_NAMES)).join(" or ")} when durable memory is relevant and the tools are available.`,
    "",
  ];
  for (const file of params.files) lines.push(`- ${file.path}`);
  return lines.join("\n").trim();
}
function renderCodexWorkspaceMemoryCollaborationInstructions(params) {
  const sections = [
    params.memoryToolRouted
      ? renderCodexMemoryRecallInstructions({
          toolNames: params.toolNames,
          citationsMode: params.citationsMode,
          agentId: params.agentId,
          agentSessionKey: params.agentSessionKey,
        })
      : void 0,
    renderCodexWorkspaceMemoryReference({
      files: params.files,
      toolNames: params.toolNames,
    }),
  ].filter(isNonEmptyString$1);
  return sections.length > 0 ? sections.join("\n\n") : void 0;
}
function renderCodexMemoryRecallInstructions(params) {
  const memoryPrompt = buildMemorySystemPromptAddition({
    availableTools: new Set(params.toolNames),
    citationsMode: params.citationsMode,
    agentId: params.agentId,
    agentSessionKey: params.agentSessionKey,
  });
  if (!memoryPrompt) return;
  return [memoryPrompt, renderCodexMemoryToolSearchBridge(params.toolNames)]
    .filter(isNonEmptyString$1)
    .join("\n")
    .trim();
}
function renderCodexMemoryToolSearchBridge(toolNames) {
  const memoryToolNames = toolNames
    .map((name) => normalizeCodexDynamicToolName(name))
    .filter((name) => CODEX_MEMORY_TOOL_NAMES.has(name))
    .toSorted();
  if (memoryToolNames.length === 0) return;
  return `Codex may expose ${memoryToolNames.join(" and ")} as deferred tools. When the memory guidance above calls for memory recall, use an already-loaded memory tool directly. If the needed memory tool is deferred and not currently callable, use \`tool_search\` to load it, then call that memory tool.`;
}
/** Lists available memory tool names understood by Codex workspace memory routing. */
function getCodexWorkspaceMemoryToolNames(tools) {
  const availableToolNames = new Set(
    flattenCodexDynamicToolFunctions(tools).map((tool) => normalizeCodexDynamicToolName(tool.name)),
  );
  return Array.from(CODEX_MEMORY_TOOL_NAMES).filter((name) => availableToolNames.has(name));
}
function canRouteCodexWorkspaceMemoryThroughTools(params) {
  if (!params.config) return false;
  return isSameCodexWorkspacePath(
    resolveAgentWorkspaceDir(params.config, params.agentId),
    params.workspaceDir,
  );
}
function isMissingCodexBootstrapContextFile(file) {
  return file.content.trimStart().startsWith("[MISSING] Expected at:");
}
function toCodexEmbeddedContextFile(file) {
  return {
    path: readNonEmptyString(file.path) ?? readNonEmptyString(file.name) ?? "",
    content: file.content ?? "",
  };
}
function isCodexWorkspaceRootMemoryBootstrapFile(params) {
  return isCodexWorkspaceRootMemoryPath({
    filePath: readNonEmptyString(params.file.path) ?? readNonEmptyString(params.file.name) ?? "",
    workspaceDir: params.workspaceDir,
  });
}
function isCodexWorkspaceRootMemoryContextFile(params) {
  if (!params.workspaceDir) return false;
  return isCodexWorkspaceRootMemoryPath({
    filePath: params.file.path,
    workspaceDir: params.workspaceDir,
  });
}
function isCodexWorkspaceRootMemoryPath(params) {
  const filePath = params.filePath.trim();
  if (!filePath) return false;
  return (
    (path.isAbsolute(filePath)
      ? path.resolve(filePath)
      : path.resolve(params.workspaceDir, filePath)) ===
    path.join(path.resolve(params.workspaceDir), "MEMORY.md")
  );
}
function isSameCodexWorkspacePath(left, right) {
  return path.resolve(left) === path.resolve(right);
}
/**
 * Remaps bootstrap file paths from the resolved workspace to the effective Codex
 * workspace while preserving platform path separators.
 */
function remapCodexContextFilePath(params) {
  const relativePath = path.relative(params.sourceWorkspaceDir, params.file.path);
  if (
    !relativePath ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath) ||
    params.sourceWorkspaceDir === params.targetWorkspaceDir
  )
    return params.file;
  const targetUsesPosixSeparators =
    params.targetWorkspaceDir.includes("/") && !params.targetWorkspaceDir.includes("\\");
  const normalizedRelativePath = targetUsesPosixSeparators
    ? relativePath.replaceAll("\\", "/")
    : relativePath.replaceAll("/", "\\");
  return {
    ...params.file,
    path: targetUsesPosixSeparators
      ? path.posix.join(params.targetWorkspaceDir, normalizedRelativePath)
      : path.win32.join(params.targetWorkspaceDir, normalizedRelativePath),
  };
}
function compareCodexContextFiles(left, right) {
  const leftPath = normalizeCodexContextFilePath(left.path);
  const rightPath = normalizeCodexContextFilePath(right.path);
  const leftBase = getCodexContextFileBasename(left.path);
  const rightBase = getCodexContextFileBasename(right.path);
  const leftOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(leftBase) ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(rightBase) ?? Number.MAX_SAFE_INTEGER;
  if (leftOrder !== rightOrder) return leftOrder - rightOrder;
  if (leftBase !== rightBase) return leftBase.localeCompare(rightBase);
  return leftPath.localeCompare(rightPath);
}
function compareCodexBootstrapFiles(left, right) {
  return compareCodexContextFiles(
    toCodexEmbeddedContextFile(left),
    toCodexEmbeddedContextFile(right),
  );
}
function normalizeCodexContextFilePath(filePath) {
  return filePath.trim().replaceAll("\\", "/").toLowerCase();
}
function getCodexContextFileDisplayBasename(filePath) {
  return filePath.trim().replaceAll("\\", "/").split("/").pop()?.trim() ?? "";
}
function getCodexContextFileBasename(filePath) {
  return normalizeCodexContextFilePath(filePath).split("/").pop() ?? "";
}
function normalizeCodexDynamicToolName(name) {
  return name.trim().toLowerCase();
}
function isNonEmptyString$1(value) {
  return typeof value === "string" && value.length > 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-state.ts
async function clearCodexBindingAfterInvalidImagePayload(bindingStore, identity, fields) {
  const currentBinding = await bindingStore.read(identity);
  const expectedThreadId = fields.threadId ?? currentBinding?.threadId;
  if (!expectedThreadId) return;
  if (currentBinding && currentBinding.threadId !== expectedThreadId) {
    log.warn(
      "codex app-server image payload error detected for unbound thread; preserving thread binding",
      {
        ...fields,
        boundThreadId: currentBinding.threadId,
      },
    );
    return;
  }
  if (currentBinding?.connectionScope === "supervision") {
    log.warn(
      "codex app-server image payload error detected for supervised thread; preserving native binding",
      fields,
    );
    return;
  }
  log.warn("codex app-server image payload error detected; clearing thread binding", fields);
  await bindingStore.mutate(identity, {
    kind: "clear",
    threadId: expectedThreadId,
  });
}
async function markCodexAppServerBindingCoveredThroughTurn(params) {
  await params.bindingStore.mutate(params.identity, {
    kind: "patch",
    threadId: params.threadId,
    patch: { historyCoveredThrough: /* @__PURE__ */ new Date().toISOString() },
  });
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
function shouldUseFreshCodexThreadAfterContextEngineOverflow(params) {
  if (!params.contextEngineActive || params.thread.lifecycle.action !== "resumed") return false;
  const message = formatErrorMessage(params.error);
  return (
    /ran out of room in the model'?s context window/iu.test(message) ||
    /context window/iu.test(message) ||
    /context length/iu.test(message) ||
    /maximum context/iu.test(message) ||
    /too many tokens/iu.test(message)
  );
}
function isCodexActiveCompactTurnError(error) {
  if (!(error instanceof CodexAppServerRpcError)) return false;
  const data = isJsonObject(error.data) ? error.data : void 0;
  const codexErrorInfo = isJsonObject(data?.codexErrorInfo) ? data.codexErrorInfo : void 0;
  return (
    (isJsonObject(codexErrorInfo?.activeTurnNotSteerable)
      ? codexErrorInfo.activeTurnNotSteerable
      : void 0
    )?.turnKind === "compact"
  );
}
function readCodexFinalizationHookNotification(notification, threadId, turnId) {
  if (notification.method !== "hook/started" && notification.method !== "hook/completed") return;
  const params = isJsonObject(notification.params) ? notification.params : void 0;
  const run = params && isJsonObject(params.run) ? params.run : void 0;
  if (
    params?.threadId !== threadId ||
    params.turnId !== turnId ||
    (run?.eventName !== "stop" && run?.eventName !== "subagentStop") ||
    typeof run.id !== "string" ||
    !run.id
  )
    return;
  if (notification.method === "hook/started")
    return {
      phase: "started",
      runId: run.id,
    };
  return {
    phase: "completed",
    runId: run.id,
    status: typeof run.status === "string" ? run.status : void 0,
  };
}
function joinPresentSections(...sections) {
  return sections.filter((section) => Boolean(section?.trim())).join("\n\n");
}
function prependCurrentInboundContext(prompt, context) {
  const text = context?.text.trim();
  return text ? [text, prompt].filter(Boolean).join("\n\n") : prompt;
}
function waitForCodexNotificationDispatchTurn() {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}
function buildCodexAppServerTimeoutDiagnostics(params) {
  const readString = (key) => {
    const value = params.details?.[key];
    return typeof value === "string" && value.trim() ? value : void 0;
  };
  const readNumber = (key) => {
    const value = params.details?.[key];
    return typeof value === "number" && Number.isFinite(value) ? value : void 0;
  };
  const readBoolean = (key) => {
    const value = params.details?.[key];
    return typeof value === "boolean" ? value : void 0;
  };
  return {
    ...(params.idleMs !== void 0 ? { idleMs: params.idleMs } : {}),
    ...(params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}),
    ...(params.lastActivityReason ? { lastActivityReason: params.lastActivityReason } : {}),
    ...(readString("lastNotificationMethod")
      ? { lastNotificationMethod: readString("lastNotificationMethod") }
      : {}),
    ...(readString("lastNotificationItemId")
      ? { lastNotificationItemId: readString("lastNotificationItemId") }
      : {}),
    ...(readString("lastNotificationItemType")
      ? { lastNotificationItemType: readString("lastNotificationItemType") }
      : {}),
    ...(readString("lastNotificationItemRole")
      ? { lastNotificationItemRole: readString("lastNotificationItemRole") }
      : {}),
    ...(readString("lastAssistantTextPreview")
      ? { lastAssistantTextPreview: readString("lastAssistantTextPreview") }
      : {}),
    ...(readNumber("activeAppServerTurnRequests") !== void 0
      ? { activeAppServerTurnRequests: readNumber("activeAppServerTurnRequests") }
      : {}),
    ...(readNumber("activeTurnItemCount") !== void 0
      ? { activeTurnItemCount: readNumber("activeTurnItemCount") }
      : {}),
    ...(readBoolean("terminalTurnNotificationQueued") !== void 0
      ? { terminalTurnNotificationQueued: readBoolean("terminalTurnNotificationQueued") }
      : {}),
    ...(readBoolean("completionIdleWatchArmed") !== void 0
      ? { completionIdleWatchArmed: readBoolean("completionIdleWatchArmed") }
      : {}),
    ...(readBoolean("assistantCompletionIdleWatchArmed") !== void 0
      ? { assistantCompletionIdleWatchArmed: readBoolean("assistantCompletionIdleWatchArmed") }
      : {}),
    ...(readBoolean("terminalIdleWatchArmed") !== void 0
      ? { terminalIdleWatchArmed: readBoolean("terminalIdleWatchArmed") }
      : {}),
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-context.ts
async function prepareCodexAttemptContext(runtime, attemptTools) {
  const {
    connection,
    runtimeParams,
    activeSessionId,
    activeSessionFile,
    buildActiveRunAttemptParams,
    effectiveContextWindowInfo,
    effectiveContextTokenBudget,
    effectiveRuntimeProviderId,
    effectiveRuntimeModelId,
    hookChannelId,
  } = runtime;
  const {
    params,
    sessionAgentId,
    contextSessionKey,
    activeContextEngine,
    initialStartupBindingHadInactiveThreadBootstrap,
    sandboxSessionKey,
    effectiveWorkspace,
    effectiveCwd,
    agentDir,
    usesSupervisionConnection,
    resolvedWorkspace,
    initialInactiveThreadBootstrapBindingForcedFreshStart,
  } = connection;
  const { toolBridge } = attemptTools;
  const activeTranscriptTarget = {
    agentId: sessionAgentId,
    sessionFile: activeSessionFile,
    sessionId: activeSessionId,
    sessionKey: contextSessionKey,
  };
  const historyState = {
    messages:
      !activeContextEngine && initialStartupBindingHadInactiveThreadBootstrap
        ? []
        : ((await readMirroredSessionHistoryMessages(activeTranscriptTarget)) ?? []),
  };
  const hadSessionTranscriptState = historyState.messages.length > 0;
  const hookContextWindowFields = {
    ...(effectiveContextWindowInfo?.tokens
      ? { contextTokenBudget: effectiveContextWindowInfo.tokens }
      : effectiveContextTokenBudget
        ? { contextTokenBudget: effectiveContextTokenBudget }
        : {}),
    ...(effectiveContextWindowInfo?.source
      ? { contextWindowSource: effectiveContextWindowInfo.source }
      : {}),
    ...(effectiveContextWindowInfo?.referenceTokens
      ? { contextWindowReferenceTokens: effectiveContextWindowInfo.referenceTokens }
      : {}),
  };
  const hookContext = {
    runId: params.runId,
    agentId: sessionAgentId,
    sessionKey: sandboxSessionKey,
    sessionId: params.sessionId,
    workspaceDir: params.workspaceDir,
    messageProvider: params.messageProvider ?? void 0,
    trigger: params.trigger,
    channelId: hookChannelId,
    ...hookContextWindowFields,
  };
  const hookRunner = getAgentHarnessHookRunner();
  const activeContextEnginePluginId = activeContextEngine
    ? resolveContextEngineOwnerPluginId(activeContextEngine)
    : void 0;
  const buildActiveContextEngineRuntimeContext = () =>
    buildHarnessContextEngineRuntimeContext({
      attempt: buildActiveRunAttemptParams(),
      workspaceDir: effectiveWorkspace,
      cwd: effectiveCwd,
      agentDir,
      activeAgentId: sessionAgentId,
      contextEnginePluginId: activeContextEnginePluginId,
      tokenBudget: effectiveContextTokenBudget,
    });
  if (activeContextEngine) {
    await bootstrapHarnessContextEngine({
      hadSessionFile: hadSessionTranscriptState,
      contextEngine: activeContextEngine,
      sessionId: activeSessionId,
      sessionKey: contextSessionKey,
      sessionFile: activeSessionFile,
      sessionTarget: params.sessionTarget,
      runtimeContext: buildActiveContextEngineRuntimeContext(),
      contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
      providerId: effectiveRuntimeProviderId,
      requestedModelId: usesSupervisionConnection ? void 0 : params.requestedModelId,
      modelId: effectiveRuntimeModelId,
      fallbackReason: usesSupervisionConnection ? void 0 : params.fallbackReason,
      degradedReason: usesSupervisionConnection ? void 0 : params.degradedReason,
      runMaintenance: runHarnessContextEngineMaintenance,
      config: params.config,
      warn: (message) => log.warn(message),
    });
    historyState.messages =
      (await readMirroredSessionHistoryMessages(activeTranscriptTarget)) ?? historyState.messages;
  }
  const workspaceBootstrapContext = await buildCodexWorkspaceBootstrapContext({
    params: runtimeParams,
    resolvedWorkspace,
    effectiveWorkspace,
    sessionKey: contextSessionKey,
    sessionAgentId,
    memoryToolNames: getCodexWorkspaceMemoryToolNames(toolBridge.availableSpecs),
  });
  const baseDeveloperInstructions = joinPresentSections(
    buildDeveloperInstructions(runtimeParams, { dynamicTools: toolBridge.availableSpecs }),
    workspaceBootstrapContext.developerInstructions,
  );
  return {
    runtime,
    attemptTools,
    activeTranscriptTarget,
    historyState,
    hookContext,
    hookContextWindowFields,
    hookRunner,
    buildActiveContextEngineRuntimeContext,
    workspaceBootstrapContext,
    baseDeveloperInstructions,
    openClawPromptContext: buildCodexOpenClawPromptContext({
      params: runtimeParams,
      workspacePromptContext: workspaceBootstrapContext.promptContext,
    }),
    skillsCollaborationInstructions: renderCodexSkillsCollaborationInstructions({
      attempt: runtimeParams,
      skillsPrompt: params.skillsSnapshot?.prompt,
    }),
    promptState: {
      promptText: params.prompt,
      promptContextRange: void 0,
      developerInstructions: baseDeveloperInstructions,
      prePromptMessageCount: historyState.messages.length,
      contextEngineProjection: void 0,
      precomputedStaleBindingContinuityProjectionApplied: false,
      staleBindingContinuityForcedFreshStart: false,
      inactiveThreadBootstrapBindingForcedFreshStart:
        initialInactiveThreadBootstrapBindingForcedFreshStart,
    },
    codexContextProjectionMaxChars: resolveCodexContextEngineProjectionMaxChars({
      contextTokenBudget: effectiveContextTokenBudget,
      reserveTokens: resolveCodexContextEngineProjectionReserveTokens({ config: params.config }),
    }),
  };
}
//#endregion
//#region extensions/codex/src/app-server/attempt-diagnostics.ts
/**
 * Diagnostic helpers for Codex app-server model calls and plugin-thread config
 * eligibility.
 */
/** Reads a tool schema field in either app-server or OpenClaw naming. */
function readCodexDiagnosticToolParameters(tool) {
  return tool.inputSchema ?? tool.parameters;
}
/** Builds compact diagnostic tool definitions for trusted private telemetry. */
function buildCodexDiagnosticToolDefinitions(tools) {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: readCodexDiagnosticToolParameters(tool),
  }));
}
/** Returns the serialized UTF-8 byte length for a JSON-compatible value. */
function utf8JsonByteLength(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value), "utf8");
  } catch {
    return;
  }
}
/** Builds a short namespaced fingerprint for sensitive log values. */
function fingerprintCodexLogValue(namespace, value) {
  const hash = createHash("sha256");
  hash.update(namespace);
  hash.update("\0");
  hash.update(value);
  return `sha256:${hash.digest("hex").slice(0, 16)}`;
}
/**
 * Builds redacted diagnostics explaining whether plugin thread config was
 * eligible for a Codex app-server attempt.
 */
function buildCodexPluginThreadConfigEligibilityLogData(params) {
  return {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    enabled: params.pluginThreadConfigRequired,
    policyConfigured: params.resolvedPluginPolicy?.configured === true,
    policyEnabled: params.resolvedPluginPolicy?.enabled === true,
    allowAllPlugins: params.resolvedPluginPolicy?.allowAllPlugins === true,
    pluginConfigKeys: params.resolvedPluginPolicy?.pluginPolicies
      .map((plugin) => plugin.configKey)
      .toSorted(),
    enabledPluginConfigKeys: params.enabledPluginConfigKeys,
    appCacheKeyFingerprint: fingerprintCodexLogValue(
      "openclaw:codex:plugin-app-cache-key:v1",
      params.pluginAppCacheKey,
    ),
    authProfileId: params.startupAuthProfileId,
    appServerTransport: params.appServer.start.transport,
    appServerCommandSource: params.appServer.start.commandSource,
  };
}
/**
 * Creates lifecycle emitters for trusted model-call diagnostics with optional
 * private payload capture.
 */
function createCodexModelCallDiagnosticEmitter(params) {
  const now = params.now ?? (() => Date.now());
  const toolDefinitions = params.capture.toolDefinitions
    ? buildCodexDiagnosticToolDefinitions(params.tools)
    : void 0;
  let startedAt = now();
  let started = false;
  let terminalEmitted = false;
  let requestPayloadBytes;
  const privateData = (modelContent) =>
    modelContent && Object.keys(modelContent).length > 0 ? { modelContent } : void 0;
  const buildContent = () => {
    const modelContent = {
      ...(params.capture.inputMessages ? { inputMessages: params.buildInputMessages() } : {}),
      ...(params.capture.systemPrompt ? { systemPrompt: params.buildSystemPrompt() } : {}),
      ...(toolDefinitions ? { toolDefinitions } : {}),
    };
    return Object.keys(modelContent).length > 0 ? modelContent : void 0;
  };
  const requestPayloadBytesField = () =>
    requestPayloadBytes !== void 0 ? { requestPayloadBytes } : {};
  return {
    setRequestPayloadBytes(bytes) {
      requestPayloadBytes = bytes;
    },
    emitStarted() {
      startedAt = now();
      started = true;
      emitTrustedDiagnosticEventWithPrivateData(
        {
          type: "model.call.started",
          ...params.baseFields,
        },
        privateData(buildContent()),
      );
    },
    emitCompleted(result) {
      if (!started || terminalEmitted) return;
      terminalEmitted = true;
      emitTrustedDiagnosticEventWithPrivateData(
        {
          type: "model.call.completed",
          ...params.baseFields,
          durationMs: Math.max(0, now() - startedAt),
          ...requestPayloadBytesField(),
        },
        privateData({
          ...buildContent(),
          ...(params.capture.outputMessages
            ? {
                outputMessages: result.lastAssistant
                  ? [result.lastAssistant]
                  : result.assistantTexts,
              }
            : {}),
        }),
      );
    },
    emitError(error, fields = {}) {
      if (!started || terminalEmitted) return;
      terminalEmitted = true;
      emitTrustedDiagnosticEventWithPrivateData(
        {
          type: "model.call.error",
          ...params.baseFields,
          durationMs: Math.max(0, now() - startedAt),
          errorCategory: fields.failureKind ?? "error",
          ...(fields.failureKind ? { failureKind: fields.failureKind } : {}),
          ...requestPayloadBytesField(),
        },
        privateData({
          ...buildContent(),
          ...(params.capture.outputMessages ? { outputMessages: [] } : {}),
        }),
      );
      params.onErrorDiagnostic?.(error);
    },
  };
}
/** Classifies model-call failures into timeout/abort buckets for diagnostics. */
function classifyCodexModelCallFailureKind(params) {
  if (params.timedOut || params.turnCompletionIdleTimedOut) return "timeout";
  const errorMessage = params.error ? params.formatError(params.error).toLowerCase() : "";
  if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) return "timeout";
  if (params.runAborted && !params.clientClosedAbort)
    return (typeof params.abortReason === "string"
      ? params.abortReason.toLowerCase()
      : params.abortReason
        ? params.formatError(params.abortReason).toLowerCase()
        : ""
    ).includes("timeout")
      ? "timeout"
      : "aborted";
  return errorMessage.includes("aborted") ? "aborted" : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-results.ts
const CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_USER_MESSAGE =
  "Codex stopped before confirming the turn was complete. The response may be incomplete; retry if needed.";
const CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_SIDE_EFFECT_USER_MESSAGE =
  "Codex stopped before confirming the turn was complete. Some work may already have been performed; verify the current state before retrying.";
const CODEX_APP_SERVER_TERMINAL_IDLE_USER_MESSAGE =
  "Codex stopped responding: no activity arrived for the turn's liveness window, so the turn was ended and the connection was replaced. Retry to continue on a fresh session.";
/** Joins terminal assistant text blocks into the final attempt answer. */
function collectTerminalAssistantText(result) {
  return result.assistantTexts.join("\n\n").trim();
}
/**
 * Builds the user-facing timeout outcome when Codex stops without a terminal
 * turn event.
 */
function buildCodexAppServerPromptTimeoutOutcome(params) {
  if (!params.turnCompletionIdleTimedOut) return;
  if (params.turnWatchTimeoutKind === "terminal") {
    if (collectTerminalAssistantText(params.result)) return;
    const terminalReplayBlockedReason = resolveCodexAppServerReplayBlockedReason(params.result);
    return {
      message: CODEX_APP_SERVER_TERMINAL_IDLE_USER_MESSAGE,
      ...(terminalReplayBlockedReason
        ? {
            replayInvalid: true,
            livenessState: "abandoned",
          }
        : {}),
    };
  }
  if (params.turnWatchTimeoutKind !== void 0 && params.turnWatchTimeoutKind !== "completion")
    return;
  const replayBlockedReason = resolveCodexAppServerReplayBlockedReason(params.result);
  return {
    message:
      replayBlockedReason === "tool_activity" ||
      replayBlockedReason === "potential_side_effect" ||
      replayBlockedReason === "active_item"
        ? CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_SIDE_EFFECT_USER_MESSAGE
        : CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_USER_MESSAGE,
    ...(replayBlockedReason
      ? {
          replayInvalid: true,
          livenessState: "abandoned",
        }
      : {}),
  };
}
/** Explains why an incomplete app-server turn cannot be safely replayed. */
function resolveCodexAppServerReplayBlockedReason(result) {
  if (result.replayMetadata.hadPotentialSideEffects) return "potential_side_effect";
  if (result.assistantTexts.some((text) => text.trim().length > 0)) return "assistant_output";
  if (
    result.toolMetas.length > 0 ||
    result.clientToolCalls ||
    result.lastToolError ||
    result.didSendDeterministicApprovalPrompt
  )
    return "tool_activity";
  if (result.itemLifecycle.startedCount > 0 || result.itemLifecycle.activeCount > 0)
    return "active_item";
}
/** Builds an attempt result for failures before the app-server turn starts. */
function buildCodexTurnStartFailureResult(params) {
  return {
    aborted: false,
    externalAbort: false,
    timedOut: false,
    idleTimedOut: false,
    timedOutDuringCompaction: false,
    timedOutDuringToolExecution: false,
    promptError: params.message,
    promptErrorSource: "prompt",
    sessionIdUsed: params.params.sessionId,
    messagesSnapshot: params.messagesSnapshot,
    assistantTexts: [],
    toolMetas: [],
    lastAssistant: void 0,
    currentAttemptAssistant: void 0,
    didSendViaMessagingTool: false,
    messagingToolSentTexts: [],
    messagingToolSentMediaUrls: [],
    messagingToolSentTargets: [],
    messagingToolSourceReplyPayloads: [],
    cloudCodeAssistFormatError: false,
    replayMetadata: {
      hadPotentialSideEffects: false,
      replaySafe: true,
    },
    itemLifecycle: {
      startedCount: 0,
      completedCount: 0,
      activeCount: 0,
    },
    systemPromptReport: params.systemPromptReport,
  };
}
/** Detects app-server errors caused by invalid image payload data. */
function isInvalidCodexImagePayloadError(message) {
  if (typeof message !== "string" || !message.trim()) return false;
  const normalizedMessage = message.replace(/[_-]+/gu, " ");
  return (
    /\b(?:invalid|malformed)\b[\s\S]{0,120}\b(?:image|image url|base64)\b/iu.test(
      normalizedMessage,
    ) ||
    /\b(?:image|image url|base64)\b[\s\S]{0,120}\b(?:invalid|malformed)\b/iu.test(normalizedMessage)
  );
}
//#endregion
//#region extensions/codex/src/app-server/trajectory.ts
const SENSITIVE_FIELD_RE = /(?:authorization|cookie|credential|key|password|passwd|secret|token)/iu;
const PRIVATE_PAYLOAD_FIELD_RE = /(?:image|screenshot|attachment|fileData|dataUri)/iu;
const AUTHORIZATION_VALUE_RE = /\b(Bearer|Basic)\s+[A-Za-z0-9+/._~=-]{8,}/giu;
const JWT_VALUE_RE = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu;
const COOKIE_PAIR_RE = /\b([A-Za-z][A-Za-z0-9_.-]{1,64})=([A-Za-z0-9+/._~%=-]{16,})(?=;|\s|$)/gu;
const TRAJECTORY_RUNTIME_EVENT_MAX_BYTES = 256 * 1024;
const TRAJECTORY_RUNTIME_OVERSIZE_PRESERVED_DATA_KEYS = ["usage", "promptCache"];
function boundedTrajectoryEvent(event) {
  const line = JSON.stringify(event);
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes <= TRAJECTORY_RUNTIME_EVENT_MAX_BYTES) return event;
  const originalData =
    event.data && typeof event.data === "object" && !Array.isArray(event.data) ? event.data : {};
  const originalDataKeys = Object.keys(originalData);
  const preservedDataKeys = /* @__PURE__ */ new Set();
  const baseData = {
    truncated: true,
    originalBytes: bytes,
    limitBytes: TRAJECTORY_RUNTIME_EVENT_MAX_BYTES,
    reason: "trajectory-event-size-limit",
  };
  const buildTruncatedEvent = (includeDroppedFields) => {
    const data = { ...baseData };
    for (const key of TRAJECTORY_RUNTIME_OVERSIZE_PRESERVED_DATA_KEYS)
      if (preservedDataKeys.has(key)) data[key] = originalData[key];
    if (includeDroppedFields) {
      const droppedFields = originalDataKeys.filter((key) => !preservedDataKeys.has(key));
      if (droppedFields.length > 0) data.droppedFields = droppedFields;
    }
    const truncatedEvent = {
      ...event,
      data,
    };
    const truncated = JSON.stringify(truncatedEvent);
    if (Buffer.byteLength(truncated, "utf8") <= TRAJECTORY_RUNTIME_EVENT_MAX_BYTES)
      return truncatedEvent;
  };
  let best = buildTruncatedEvent(true) ?? buildTruncatedEvent(false);
  if (!best) return;
  for (const key of TRAJECTORY_RUNTIME_OVERSIZE_PRESERVED_DATA_KEYS) {
    if (!Object.hasOwn(originalData, key)) continue;
    preservedDataKeys.add(key);
    const next = buildTruncatedEvent(true) ?? buildTruncatedEvent(false);
    if (next) {
      best = next;
      continue;
    }
    preservedDataKeys.delete(key);
  }
  return best;
}
function createCodexHostTrajectorySink(params) {
  return {
    write: (event) => {
      params.recorder.recordEvent(event.type, event.data);
    },
    flush: async () => {
      await params.recorder.flush();
    },
  };
}
/** Creates a trajectory recorder when trajectory capture is enabled for the environment. */
function createCodexTrajectoryRecorder(params) {
  if (!parseTrajectoryEnabled(params.env ?? process.env)) return null;
  const sqliteMarker = parseSqliteSessionFileMarker(
    params.trajectorySessionFile ?? params.attempt.sessionFile,
  );
  if (!sqliteMarker || sqliteMarker.sessionId !== params.attempt.sessionId) {
    params.warn?.("codex trajectory capture requires a matching SQLite session target", {
      sessionId: params.attempt.sessionId,
      reason: sqliteMarker ? "session-id-mismatch" : "non-sqlite-session-target",
    });
    return null;
  }
  if (!params.trajectoryRecorder) {
    params.warn?.("codex trajectory capture requires the SQLite host recorder", {
      sessionId: params.attempt.sessionId,
      reason: "sqlite-recorder-unavailable",
    });
    return null;
  }
  const sink = createCodexHostTrajectorySink({ recorder: params.trajectoryRecorder });
  let seq = 0;
  const attribution = resolveCodexLocalRuntimeAttribution(params.attempt);
  return {
    recordEvent: (type, data) => {
      const event = boundedTrajectoryEvent({
        traceSchema: "openclaw-trajectory",
        schemaVersion: 1,
        traceId: params.attempt.sessionId,
        source: "runtime",
        type,
        ts: /* @__PURE__ */ new Date().toISOString(),
        seq: (seq += 1),
        sourceSeq: seq,
        sessionId: params.attempt.sessionId,
        sessionKey: params.attempt.sessionKey,
        runId: params.attempt.runId,
        workspaceDir: params.cwd,
        provider: attribution.provider,
        modelId: params.attempt.modelId,
        modelApi: attribution.api,
        data: data ? sanitizeValue(data) : void 0,
      });
      if (event) sink.write(event);
    },
    flush: sink.flush,
  };
}
/** Records compiled prompt/tool context at the start of a Codex runtime attempt. */
function recordCodexTrajectoryContext(recorder, params) {
  if (!recorder) return;
  recorder.recordEvent("context.compiled", {
    systemPrompt: params.developerInstructions,
    prompt: params.prompt ?? params.attempt.prompt,
    imagesCount: params.attempt.images?.length ?? 0,
    tools: toTrajectoryToolDefinitions(params.tools),
  });
}
/** Records final Codex model completion metadata and assistant snapshots. */
function recordCodexTrajectoryCompletion(recorder, params) {
  if (!recorder) return;
  recorder.recordEvent("model.completed", {
    threadId: params.threadId,
    turnId: params.turnId,
    timedOut: params.timedOut,
    yieldDetected: params.yieldDetected ?? false,
    aborted: params.result.aborted,
    promptError: normalizeCodexTrajectoryError(params.result.promptError),
    usage: params.result.attemptUsage,
    assistantTexts: params.result.assistantTexts,
    messagesSnapshot: params.result.messagesSnapshot,
  });
}
function parseTrajectoryEnabled(env) {
  const value = env.OPENCLAW_TRAJECTORY?.trim().toLowerCase();
  if (value === "1" || value === "true" || value === "yes" || value === "on") return true;
  if (value === "0" || value === "false" || value === "no" || value === "off") return false;
  return true;
}
function toTrajectoryToolDefinitions(tools) {
  if (!tools || tools.length === 0) return;
  return flattenCodexDynamicToolFunctions(tools)
    .flatMap((tool) => {
      const name = tool.name?.trim();
      if (!name) return [];
      return [
        {
          name,
          description: tool.description,
          parameters: sanitizeValue(tool.inputSchema),
        },
      ];
    })
    .toSorted((left, right) => left.name.localeCompare(right.name));
}
function sanitizeValue(value, depth = 0, key = "") {
  if (value == null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") {
    if (SENSITIVE_FIELD_RE.test(key)) return "<redacted>";
    if (value.startsWith("data:") && value.length > 256)
      return `<redacted data-uri ${value.slice(0, value.indexOf(",")).length} chars>`;
    if (PRIVATE_PAYLOAD_FIELD_RE.test(key) && value.length > 256) return "<redacted payload>";
    const redacted = redactSensitiveString(value);
    return redacted.length > 2e4 ? `${truncateUtf16Safe(redacted, 2e4)}…` : redacted;
  }
  if (depth >= 6) return "<truncated>";
  if (Array.isArray(value))
    return value.slice(0, 100).map((entry) => sanitizeValue(entry, depth + 1, key));
  if (typeof value === "object") {
    const next = {};
    for (const [keyLocal, child] of Object.entries(value).slice(0, 100))
      next[keyLocal] = sanitizeValue(child, depth + 1, keyLocal);
    return next;
  }
  return JSON.stringify(value);
}
function redactSensitiveString(value) {
  return value
    .replace(AUTHORIZATION_VALUE_RE, "$1 <redacted>")
    .replace(JWT_VALUE_RE, "<redacted-jwt>")
    .replace(COOKIE_PAIR_RE, "$1=<redacted>");
}
/** Converts arbitrary prompt errors into trajectory-safe text. */
function normalizeCodexTrajectoryError(value) {
  if (!value) return null;
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return "Unknown error";
  }
}
//#endregion
//#region extensions/codex/src/app-server/usage-limit-error.ts
/**
 * Enriches Codex usage-limit failures with current rate-limit information and
 * marks blocked auth profiles when Codex exposes a reset time.
 */
const CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS = 5e3;
/** Marks a Codex auth profile blocked until the reset time advertised by rate limits. */
async function markCodexAuthProfileBlockedFromRateLimits(params) {
  const authProfileId = params.authProfileId?.trim();
  if (!authProfileId || !params.params.authProfileStore) return;
  const blockedUntil = resolveCodexUsageLimitResetAtMs(params.rateLimits);
  if (!blockedUntil) return;
  try {
    await markAuthProfileBlockedUntil({
      store: params.params.authProfileStore,
      profileId: authProfileId,
      blockedUntil,
      source: "codex_rate_limits",
      agentDir: params.params.agentDir,
      runId: params.params.runId,
      modelId: params.params.modelId,
    });
  } catch (error) {
    log.debug("failed to mark Codex auth profile blocked from app-server limits", {
      authProfileId,
      error: formatErrorMessage(error),
    });
  }
}
/** Formats a turn-start usage-limit error, refreshing rate limits when needed. */
async function formatCodexTurnStartUsageLimitError(params) {
  return refreshCodexUsageLimitError({
    client: params.client,
    source: readCodexTurnStartUsageLimitErrorSource(
      params.client,
      params.error,
      params.errorNotification,
      params.rateLimitsRevisionBeforeTurnStart,
    ),
    timeoutMs: params.timeoutMs,
    signal: params.signal,
  });
}
/** Refreshes a generic prompt usage-limit message into a reset-aware message. */
async function refreshCodexUsageLimitPromptError(params) {
  if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(params.message)) return;
  return (
    await refreshCodexUsageLimitError({
      client: params.client,
      source: {
        message: params.message,
        codexErrorInfo: "usageLimitExceeded",
        rateLimits: readRecentCodexRateLimits(params.client),
      },
      timeoutMs: params.timeoutMs,
      signal: params.signal,
    })
  )?.message;
}
async function refreshCodexUsageLimitError(params) {
  const initialMessage = formatCodexUsageLimitErrorMessage(params.source);
  if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(initialMessage))
    return initialMessage
      ? {
          message: initialMessage,
          ...(params.source.rateLimitsTrustedForProfile
            ? { rateLimitsForProfile: params.source.rateLimits }
            : {}),
        }
      : void 0;
  const rateLimits = await readCodexRateLimitsFromAppServerForUsageLimitError({
    client: params.client,
    timeoutMs: params.timeoutMs,
    signal: params.signal,
  });
  if (!rateLimits)
    return initialMessage
      ? {
          message: initialMessage,
          ...(params.source.rateLimitsTrustedForProfile
            ? { rateLimitsForProfile: params.source.rateLimits }
            : {}),
        }
      : void 0;
  const message =
    formatCodexUsageLimitErrorMessage({
      message: params.source.message,
      codexErrorInfo: params.source.codexErrorInfo,
      rateLimits,
    }) ?? initialMessage;
  return message
    ? {
        message,
        rateLimitsForProfile: rateLimits,
      }
    : void 0;
}
async function readCodexRateLimitsFromAppServerForUsageLimitError(params) {
  if (params.signal?.aborted) return;
  try {
    const rateLimits = await params.client.request(CODEX_CONTROL_METHODS.rateLimits, void 0, {
      timeoutMs: resolveCodexUsageLimitRateLimitRefreshTimeoutMs(params.timeoutMs),
      signal: params.signal,
    });
    rememberCodexRateLimitsRead(params.client, rateLimits);
    return rateLimits;
  } catch (error) {
    log.debug("codex app-server rate-limit refresh failed after usage-limit error", {
      error: formatErrorMessage(error),
    });
    return;
  }
}
function resolveCodexUsageLimitRateLimitRefreshTimeoutMs(timeoutMs) {
  if (timeoutMs === void 0 || !Number.isFinite(timeoutMs) || timeoutMs <= 0)
    return CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS;
  return Math.max(100, Math.min(timeoutMs, CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS));
}
function readCodexTurnStartUsageLimitErrorSource(
  client,
  error,
  errorNotification,
  rateLimitsRevisionBeforeTurnStart,
) {
  const notificationError = readCodexErrorNotification(errorNotification);
  const errorPayload = readCodexErrorPayload(error);
  const rateLimits = errorPayload.rateLimits ?? readRecentCodexRateLimits(client);
  const cacheUpdatedDuringTurnStart =
    rateLimitsRevisionBeforeTurnStart !== void 0 &&
    readCodexRateLimitsRevision(client) > rateLimitsRevisionBeforeTurnStart;
  return {
    message: notificationError?.message ?? errorPayload.message ?? formatErrorMessage(error),
    codexErrorInfo: notificationError?.codexErrorInfo ?? errorPayload.codexErrorInfo,
    rateLimits,
    rateLimitsTrustedForProfile: errorPayload.rateLimits !== void 0 || cacheUpdatedDuringTurnStart,
  };
}
function readCodexErrorNotification(notification) {
  if (notification?.method !== "error" || !isJsonObject(notification.params)) return;
  const error = notification.params.error;
  return isJsonObject(error)
    ? {
        message: readString$3(error, "message"),
        codexErrorInfo: error.codexErrorInfo,
      }
    : void 0;
}
function readCodexErrorPayload(error) {
  const message = error instanceof Error ? error.message : void 0;
  if (!error || typeof error !== "object" || !("data" in error)) return { message };
  const data = error.data;
  if (!isJsonObject(data)) return { message };
  const nestedError = isJsonObject(data.error) ? data.error : data;
  const rateLimits = nestedError.rateLimits ?? data.rateLimits;
  return {
    message: readString$3(nestedError, "message") ?? message,
    codexErrorInfo: nestedError.codexErrorInfo,
    rateLimits,
  };
}
function readString$3(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-finalize.ts
async function finalizeCodexAttempt(
  resources,
  turnRuntime,
  lifecycle,
  notifications,
  requestRuntime,
  activeTurn,
) {
  const { prompt, state: resourceState, trajectoryRecorder, markTrajectoryEndRecorded } = resources;
  const { context, systemPromptReport } = prompt;
  const { runtime, attemptTools, activeTranscriptTarget, historyState, hookContext } = context;
  const { hookContextWindowFields, hookRunner, promptState } = context;
  const { connection, preparedAuthBinding, activeSessionId, activeSessionFile } = runtime;
  const {
    buildActiveRunAttemptParams,
    effectiveContextTokenBudget,
    effectiveRuntimeProviderId,
    effectiveRuntimeModelId,
  } = runtime;
  const {
    params,
    terminalState,
    runAbortController,
    activeContextEngine,
    bindingStore,
    bindingIdentity,
    appServer,
    usesSupervisionConnection,
    sessionAgentId,
    contextSessionKey,
    effectiveCwd,
    effectiveWorkspace,
    agentDir,
    attemptStartedAt,
  } = connection;
  const { toolBridge, toolState } = attemptTools;
  const {
    state,
    completion,
    pendingOpenClawDynamicToolCompletionIds,
    activeTurnItemIds,
    activeCompletionBlockerItemIds,
    activeFinalizationHookRunIds,
    turnWatches,
  } = turnRuntime;
  const { emitLifecycleTerminal, buildLifecycleTerminalMeta } = lifecycle;
  const { drainNotificationQueue } = notifications;
  const { codexModelCallDiagnostics } = requestRuntime;
  const {
    activeTurnId,
    activeProjector,
    streamState,
    freezeRunTerminalOutcome,
    notifyUserMessagePersisted,
  } = activeTurn;
  await completion;
  await drainNotificationQueue();
  const hasQuiescentCompletedAssistant =
    activeProjector.hasCompletedTerminalAssistantText() &&
    state.activeAppServerTurnRequests === 0 &&
    activeTurnItemIds.size === 0 &&
    activeCompletionBlockerItemIds.size === 0 &&
    pendingOpenClawDynamicToolCompletionIds.size === 0 &&
    activeFinalizationHookRunIds.size === 0 &&
    state.unsettledFinalizationHookCount === 0 &&
    state.rejectedFinalizationHookAssistant === void 0;
  const hasRecoverableCompletedAssistant =
    !turnWatches.isCompletionIdleWatchPinnedByTerminalError() &&
    turnWatches.isAssistantCompletionIdleWatchArmed() &&
    hasQuiescentCompletedAssistant;
  const recoveredTurnWatchTimeout =
    state.turnCompletionIdleTimedOut &&
    !terminalState.explicitCancellationObserved &&
    !state.terminalTurnNotificationQueued &&
    hasRecoverableCompletedAssistant &&
    activeProjector.recoverCompletedTerminalAssistantAfterTurnWatchTimeout();
  if (recoveredTurnWatchTimeout) {
    log.warn(
      "codex app-server recovered completed assistant output after missing turn completion",
      {
        threadId: resourceState.thread.threadId,
        turnId: activeTurnId,
        timeoutKind: state.turnWatchTimeoutKind,
        idleMs: state.turnWatchTimeoutIdleMs,
        timeoutMs: state.turnWatchTimeoutMs,
      },
    );
    trajectoryRecorder?.recordEvent("turn.watch_timeout_recovered", {
      threadId: resourceState.thread.threadId,
      turnId: activeTurnId,
      timeoutKind: state.turnWatchTimeoutKind,
      idleMs: state.turnWatchTimeoutIdleMs,
      timeoutMs: state.turnWatchTimeoutMs,
    });
  }
  const result = activeProjector.buildResult(toolBridge.telemetry, {
    yieldDetected: toolState.yieldDetected,
  });
  const effectiveTimedOut = state.timedOut && !recoveredTurnWatchTimeout;
  const effectiveTurnCompletionIdleTimedOut =
    state.turnCompletionIdleTimedOut && !recoveredTurnWatchTimeout;
  const isFinalAborted = () =>
    result.aborted ||
    terminalState.explicitCancellationObserved ||
    (runAbortController.signal.aborted && !state.clientClosedAbort && !recoveredTurnWatchTimeout);
  const clientClosedPromptErrorForFinal =
    state.clientClosedPromptError && hasRecoverableCompletedAssistant
      ? void 0
      : state.clientClosedPromptError;
  let finalPromptError =
    clientClosedPromptErrorForFinal ??
    (effectiveTurnCompletionIdleTimedOut
      ? state.turnCompletionIdleTimeoutMessage
      : effectiveTimedOut
        ? "codex app-server attempt timed out"
        : result.promptError);
  const finalPromptErrorMessage =
    typeof finalPromptError === "string"
      ? finalPromptError
      : finalPromptError
        ? formatErrorMessage(finalPromptError)
        : void 0;
  if (isInvalidCodexImagePayloadError(finalPromptErrorMessage))
    await clearCodexBindingAfterInvalidImagePayload(bindingStore, bindingIdentity, {
      phase: "turn_completed",
      threadId: resourceState.thread.threadId,
      turnId: activeTurnId,
      error: finalPromptErrorMessage,
    });
  if (
    resourceState.thread.connectionScope !== "supervision" &&
    shouldUseFreshCodexThreadAfterContextEngineOverflow({
      error: finalPromptError,
      contextEngineActive: Boolean(activeContextEngine),
      thread: resourceState.thread,
    })
  ) {
    log.warn(
      "codex app-server context-engine turn overflowed after resume; clearing thread binding for recovery",
      {
        threadId: resourceState.thread.threadId,
        turnId: activeTurnId,
        error: finalPromptErrorMessage,
      },
    );
    await bindingStore.mutate(bindingIdentity, {
      kind: "clear",
      threadId: resourceState.thread.threadId,
    });
  }
  const refreshedUsageLimitPromptError = await refreshCodexUsageLimitPromptError({
    client: resourceState.client,
    message: finalPromptErrorMessage,
    timeoutMs: appServer.requestTimeoutMs,
    signal: runAbortController.signal,
  });
  if (refreshedUsageLimitPromptError) finalPromptError = refreshedUsageLimitPromptError;
  const finalPromptErrorSource =
    effectiveTimedOut || clientClosedPromptErrorForFinal ? "prompt" : result.promptErrorSource;
  const codexAppServerFailureKind = clientClosedPromptErrorForFinal
    ? "client_closed_before_turn_completed"
    : effectiveTurnCompletionIdleTimedOut
      ? "turn_completion_idle_timeout"
      : void 0;
  const replayBlockedReason = codexAppServerFailureKind
    ? resolveCodexAppServerReplayBlockedReason(result)
    : void 0;
  const promptTimeoutOutcome = buildCodexAppServerPromptTimeoutOutcome({
    result,
    turnCompletionIdleTimedOut: effectiveTurnCompletionIdleTimedOut,
    turnWatchTimeoutKind: state.turnWatchTimeoutKind,
  });
  const failureDiagnostics =
    codexAppServerFailureKind === "turn_completion_idle_timeout" &&
    state.turnWatchTimeoutKind === "completion"
      ? buildCodexAppServerTimeoutDiagnostics({
          idleMs: state.turnWatchTimeoutIdleMs,
          timeoutMs: state.turnWatchTimeoutMs,
          lastActivityReason: state.turnWatchTimeoutLastActivityReason,
          details: state.turnWatchTimeoutDetails,
        })
      : void 0;
  const codexAppServerFailure = codexAppServerFailureKind
    ? {
        kind: codexAppServerFailureKind,
        ...(codexAppServerFailureKind === "turn_completion_idle_timeout" &&
        state.turnWatchTimeoutKind
          ? { turnWatchTimeoutKind: state.turnWatchTimeoutKind }
          : {}),
        transport: appServer.start.transport,
        threadId: resourceState.thread.threadId,
        turnId: activeTurnId,
        replaySafe: replayBlockedReason === void 0,
        ...(replayBlockedReason ? { replayBlockedReason } : {}),
        ...(failureDiagnostics ? { diagnostics: failureDiagnostics } : {}),
      }
    : void 0;
  const finalAborted = isFinalAborted();
  const completedTurnStatus = activeProjector.getCompletedTurnStatus();
  const completedWithoutTerminalNotification =
    state.completed &&
    !state.terminalTurnNotificationQueued &&
    !state.timedOut &&
    clientClosedPromptErrorForFinal === void 0;
  const attemptSucceeded =
    !finalAborted &&
    !effectiveTimedOut &&
    (finalPromptError === null || finalPromptError === void 0) &&
    result.agentHarnessResultClassification === void 0 &&
    (completedTurnStatus === "completed" ||
      recoveredTurnWatchTimeout ||
      completedWithoutTerminalNotification);
  terminalState.sharedAbortAllowedAfterTerminalOutcome = shouldKeepCodexSharedAbortOpen({
    trigger: params.trigger,
    result,
    attemptSucceeded,
    explicitCancellationObserved: terminalState.explicitCancellationObserved,
  });
  freezeRunTerminalOutcome();
  const modelCallFailureKind =
    classifyCodexModelCallFailureKind({
      error: finalPromptError,
      timedOut: effectiveTimedOut,
      turnCompletionIdleTimedOut: effectiveTurnCompletionIdleTimedOut,
      runAborted: finalAborted,
      abortReason: terminalState.explicitCancellationReason ?? runAbortController.signal.reason,
      clientClosedAbort: state.clientClosedAbort,
      formatError: formatErrorMessage,
    }) ?? (finalAborted ? "aborted" : void 0);
  if (modelCallFailureKind)
    codexModelCallDiagnostics.emitError(
      finalPromptError ?? "codex app-server attempt interrupted",
      { failureKind: modelCallFailureKind },
    );
  else if (finalPromptError) codexModelCallDiagnostics.emitError(finalPromptError);
  else codexModelCallDiagnostics.emitCompleted(result);
  const assistantTranscriptOwned = await codexTranscriptMirrorRuntime.mirrorBestEffort({
    params,
    agentId: sessionAgentId,
    notifyUserMessagePersisted,
    result,
    sessionKey: contextSessionKey,
    cwd: effectiveCwd,
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
  });
  if (activeContextEngine) {
    const contextEnginePluginId = resolveContextEngineOwnerPluginId(activeContextEngine);
    const isHeartbeat =
      params.bootstrapContextRunKind === "heartbeat" ||
      params.bootstrapContextRunKind === "commitment-only";
    const finalMessages =
      (await readMirroredSessionHistoryMessages(activeTranscriptTarget)) ??
      historyState.messages.concat(result.messagesSnapshot);
    await finalizeHarnessContextEngineTurn({
      contextEngine: activeContextEngine,
      promptError: Boolean(finalPromptError),
      aborted: finalAborted,
      yieldAborted: Boolean(result.yieldDetected),
      sessionIdUsed: activeSessionId,
      sessionKey: contextSessionKey,
      sessionFile: activeSessionFile,
      sessionTarget: params.sessionTarget,
      messagesSnapshot: finalMessages,
      prePromptMessageCount: promptState.prePromptMessageCount,
      tokenBudget: effectiveContextTokenBudget,
      runtimeContext: buildHarnessContextEngineRuntimeContextFromUsage({
        attempt: buildActiveRunAttemptParams(),
        workspaceDir: effectiveWorkspace,
        cwd: effectiveCwd,
        agentDir,
        activeAgentId: sessionAgentId,
        contextEnginePluginId,
        tokenBudget: effectiveContextTokenBudget,
        lastCallUsage: result.attemptUsage,
        promptCache: result.promptCache,
      }),
      contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
      providerId: usesSupervisionConnection
        ? (resourceState.thread.modelProvider ?? effectiveRuntimeProviderId)
        : params.provider,
      requestedModelId: usesSupervisionConnection ? void 0 : params.requestedModelId,
      modelId: usesSupervisionConnection
        ? (resourceState.thread.model ?? effectiveRuntimeModelId)
        : params.modelId,
      fallbackReason: usesSupervisionConnection ? void 0 : params.fallbackReason,
      degradedReason: usesSupervisionConnection ? void 0 : params.degradedReason,
      runMaintenance: runHarnessContextEngineMaintenance,
      config: params.config,
      warn: (message) => log.warn(message),
      isHeartbeat,
    });
  }
  runAgentHarnessLlmOutputHook({
    event: {
      runId: params.runId,
      sessionId: params.sessionId,
      provider: usesSupervisionConnection
        ? (resourceState.thread.modelProvider ?? effectiveRuntimeProviderId)
        : params.provider,
      model: usesSupervisionConnection
        ? (resourceState.thread.model ?? effectiveRuntimeModelId)
        : params.modelId,
      ...hookContextWindowFields,
      resolvedRef: usesSupervisionConnection
        ? `${resourceState.thread.modelProvider ?? effectiveRuntimeProviderId}/${resourceState.thread.model ?? effectiveRuntimeModelId}`
        : (params.runtimePlan?.observability.resolvedRef ?? `${params.provider}/${params.modelId}`),
      ...(!usesSupervisionConnection && params.runtimePlan?.observability.harnessId
        ? { harnessId: params.runtimePlan.observability.harnessId }
        : {}),
      assistantTexts: result.assistantTexts,
      ...(result.lastAssistant ? { lastAssistant: result.lastAssistant } : {}),
      ...(result.attemptUsage ? { usage: result.attemptUsage } : {}),
    },
    ctx: hookContext,
    hookRunner,
  });
  await runCodexAgentEndHook(params, {
    event: {
      messages: result.messagesSnapshot,
      success: !finalAborted && !finalPromptError,
      ...(finalPromptError ? { error: formatErrorMessage(finalPromptError) } : {}),
      durationMs: Date.now() - attemptStartedAt,
    },
    ctx: hookContext,
    hookRunner,
  });
  state.shouldDelayNativeHookRelayUnregister =
    completedTurnStatus === "completed" &&
    !effectiveTimedOut &&
    !runAbortController.signal.aborted &&
    !finalAborted &&
    !finalPromptError;
  if (state.shouldDelayNativeHookRelayUnregister)
    try {
      await markCodexAppServerBindingCoveredThroughTurn({
        bindingStore,
        identity: bindingIdentity,
        threadId: resourceState.thread.threadId,
      });
    } catch (error) {
      if (resourceState.thread.connectionScope === "supervision") throw error;
      if (
        !(await bindingStore.mutate(bindingIdentity, {
          kind: "clear",
          threadId: resourceState.thread.threadId,
        }))
      )
        throw error;
      log.warn(
        "codex app-server binding coverage update failed after completed turn; cleared stale binding",
        {
          threadId: resourceState.thread.threadId,
          turnId: activeTurnId,
          error,
        },
      );
    }
  recordCodexTrajectoryCompletion(trajectoryRecorder, {
    attempt: params,
    result,
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
    timedOut: effectiveTimedOut,
    yieldDetected: toolState.yieldDetected,
  });
  trajectoryRecorder?.recordEvent("session.ended", {
    status: finalPromptError
      ? "error"
      : finalAborted || effectiveTimedOut
        ? "interrupted"
        : "success",
    threadId: resourceState.thread.threadId,
    turnId: activeTurnId,
    timedOut: effectiveTimedOut,
    yieldDetected: toolState.yieldDetected,
    promptError: normalizeCodexTrajectoryError(finalPromptError),
  });
  markTrajectoryEndRecorded();
  const terminalAssistantText = collectTerminalAssistantText(result);
  if (
    terminalAssistantText &&
    (!streamState.eventEmitted || streamState.needsTerminalSnapshot) &&
    !finalAborted &&
    !finalPromptError
  )
    emitCodexAppServerEvent(params, {
      stream: "assistant",
      data: { text: terminalAssistantText },
    });
  emitLifecycleTerminal(
    finalPromptError
      ? {
          phase: "error",
          error: formatErrorMessage(finalPromptError),
          ...buildLifecycleTerminalMeta({
            aborted: finalAborted,
            timedOut: effectiveTimedOut,
          }),
        }
      : {
          phase: "end",
          ...buildLifecycleTerminalMeta({
            aborted: finalAborted,
            timedOut: effectiveTimedOut,
          }),
        },
  );
  return {
    ...result,
    timedOut: effectiveTimedOut,
    aborted: finalAborted,
    promptError: finalPromptError,
    promptErrorSource: finalPromptErrorSource,
    ...(codexAppServerFailure ? { codexAppServerFailure } : {}),
    ...(promptTimeoutOutcome ? { promptTimeoutOutcome } : {}),
    ...(assistantTranscriptOwned ? { assistantTranscriptOwned: true } : {}),
    ...(resourceState.runtimeArtifact ? { runtimeArtifact: resourceState.runtimeArtifact } : {}),
    ...(!finalAborted && !effectiveTimedOut && !finalPromptError && preparedAuthBinding
      ? { authBindingFingerprint: preparedAuthBinding.fingerprint }
      : {}),
    systemPromptReport,
  };
}
//#endregion
//#region extensions/codex/src/app-server/attempt-notification-state.ts
/**
 * State machine for Codex app-server turn notifications and idle-watch updates.
 */
/** Emits coarse execution phases exactly once from app-server notifications. */
function reportCodexExecutionNotification(params) {
  const { notification } = params;
  if (notification.method === "turn/started") {
    params.emitExecutionPhaseOnce("turn_accepted", { phase: "turn_accepted" });
    return;
  }
  if (notification.method === "item/agentMessage/delta") {
    params.emitExecutionPhaseOnce("assistant_output_started", {
      phase: "assistant_output_started",
    });
    return;
  }
  if (notification.method !== "item/started") return;
  const item = readCodexNotificationItem(notification.params);
  const tool = item ? codexExecutionToolName(item) : void 0;
  if (!item || !tool) return;
  params.emitExecutionPhaseOnce(`tool:${item.id}`, {
    phase: "tool_execution_started",
    tool,
    itemId: item.id,
  });
}
/** Returns true when a notification ends the current app-server turn. */
function isTerminalCodexTurnNotificationForTurn(params) {
  if (!isCodexNotificationForTurn(params.notification.params, params.threadId, params.turnId))
    return false;
  return (
    params.notification.method === "turn/completed" ||
    isCodexTurnAbortMarkerNotification(params.notification, {
      currentPromptTexts: params.currentPromptTexts,
    })
  );
}
/**
 * Applies one notification to active item tracking, idle watches, and terminal
 * turn state.
 */
function applyCodexTurnNotificationState(params) {
  const { notification, turnWatches } = params;
  const isCurrentTurnNotification = isCodexNotificationForTurn(
    notification.params,
    params.threadId,
    params.turnId,
  );
  const isTurnCompletion = notification.method === "turn/completed" && isCurrentTurnNotification;
  let turnCrossedToolHandoff = params.turnCrossedToolHandoff;
  if (isCurrentTurnNotification) {
    turnWatches.touchActivity(`notification:${notification.method}`, {
      details: describeNotificationActivity(notification),
      attemptProgress: true,
    });
    params.onReportExecutionNotification(notification);
    updateActiveTurnItemIds(notification, params.activeTurnItemIds);
    updateActiveCompletionBlockerItemIds(notification, params.activeCompletionBlockerItemIds);
    if (notification.method === "item/completed" && params.activeTurnItemIds.size === 0)
      params.onScheduleTerminalDynamicToolReleaseCheck();
  }
  const unblockedAssistantCompletionRelease =
    isCurrentTurnNotification &&
    turnWatches.isAssistantCompletionIdleWatchArmed() &&
    notification.method === "item/completed" &&
    params.activeTurnItemIds.size === 0;
  const trackedDynamicToolCompletion = isPendingOpenClawDynamicToolCompletionNotification(
    notification,
    params.pendingOpenClawDynamicToolCompletionIds,
  );
  const rawToolOutputCompletion = isRawToolOutputCompletionNotification(notification);
  if (
    isCurrentTurnNotification &&
    (rawToolOutputCompletion || isNativeToolProgressNotification(notification))
  )
    turnCrossedToolHandoff = true;
  const assistantCompletionCanRelease = isAssistantCompletionReleaseNotification(
    notification,
    turnCrossedToolHandoff,
  );
  const postToolProgressNeedsTerminalGuard =
    isCurrentTurnNotification &&
    turnCrossedToolHandoff &&
    (((isRawAssistantProgressNotification(notification) ||
      isRawReasoningCompletionNotification(notification)) &&
      params.activeTurnItemIds.size === 0) ||
      isReasoningProgressNotification(notification));
  const postToolPatchUpdateNeedsTerminalGuard =
    isCurrentTurnNotification &&
    turnCrossedToolHandoff &&
    isFileChangePatchUpdatedNotification(notification);
  const rawResponseItemCompletedWithNoActiveItems =
    isCurrentTurnNotification &&
    notification.method === "rawResponseItem/completed" &&
    params.activeTurnItemIds.size === 0 &&
    params.activeAppServerTurnRequests === 0 &&
    !assistantCompletionCanRelease &&
    !postToolProgressNeedsTerminalGuard &&
    !rawToolOutputCompletion;
  const shouldArmNoToolPostProgressReplyWatch =
    isCurrentTurnNotification &&
    !turnCrossedToolHandoff &&
    params.activeTurnItemIds.size === 0 &&
    (isReasoningItemCompletionNotification(notification) ||
      isAssistantCommentaryCompletionNotification(notification));
  const shouldArmNoToolPostRawProgressReplyWatch =
    !turnCrossedToolHandoff &&
    rawResponseItemCompletedWithNoActiveItems &&
    (isRawReasoningCompletionNotification(notification) ||
      isRawAssistantProgressNotification(notification));
  const shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem =
    isCurrentTurnNotification &&
    notification.method === "item/completed" &&
    params.activeTurnItemIds.size === 0 &&
    !trackedDynamicToolCompletion &&
    !assistantCompletionCanRelease &&
    !shouldArmNoToolPostProgressReplyWatch;
  const shouldUsePostToolContinuationWatch =
    turnCrossedToolHandoff &&
    (postToolProgressNeedsTerminalGuard ||
      postToolPatchUpdateNeedsTerminalGuard ||
      rawToolOutputCompletion ||
      trackedDynamicToolCompletion ||
      shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem);
  const armPostToolContinuationWatch = () => {
    turnWatches.armCompletionIdleWatch({
      timeoutMs: params.postToolRawAssistantCompletionIdleTimeoutMs,
    });
    turnWatches.extendAttemptIdleWatch(params.postToolRawAssistantCompletionIdleTimeoutMs);
  };
  const armPostProgressReplyWatch = () => {
    turnWatches.armCompletionIdleWatch({ timeoutMs: CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS });
    turnWatches.extendAttemptIdleWatch(CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS);
  };
  if (isCurrentTurnNotification && notification.method === "error") {
    if (isRetryableErrorNotification(notification.params)) turnWatches.disarmCompletionIdleWatch();
    else turnWatches.armCompletionIdleWatch({ pinnedByTerminalError: true });
    turnWatches.disarmAssistantCompletionIdleWatch();
  } else if (isTurnCompletion) turnWatches.disarmAssistantCompletionIdleWatch();
  else if (isCurrentTurnNotification && assistantCompletionCanRelease)
    turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
  else if (postToolProgressNeedsTerminalGuard || postToolPatchUpdateNeedsTerminalGuard)
    armPostToolContinuationWatch();
  else if (shouldArmNoToolPostProgressReplyWatch || shouldArmNoToolPostRawProgressReplyWatch)
    armPostProgressReplyWatch();
  else if (trackedDynamicToolCompletion) armPostToolContinuationWatch();
  else if (unblockedAssistantCompletionRelease)
    turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
  else if (shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem)
    if (shouldUsePostToolContinuationWatch) armPostToolContinuationWatch();
    else turnWatches.armCompletionIdleWatch();
  else if (rawResponseItemCompletedWithNoActiveItems) turnWatches.armCompletionIdleWatch();
  else if (isCurrentTurnNotification && rawToolOutputCompletion) armPostToolContinuationWatch();
  else if (isCurrentTurnNotification && shouldDisarmAssistantCompletionIdleWatch(notification))
    turnWatches.disarmAssistantCompletionIdleWatch();
  if (
    turnWatches.isCompletionIdleWatchArmed() &&
    !turnWatches.isCompletionIdleWatchPinnedByTerminalError() &&
    notification.method !== "turn/completed" &&
    isCurrentTurnNotification &&
    !trackedDynamicToolCompletion &&
    !rawToolOutputCompletion &&
    !postToolProgressNeedsTerminalGuard &&
    !postToolPatchUpdateNeedsTerminalGuard &&
    !rawResponseItemCompletedWithNoActiveItems &&
    !shouldArmNoToolPostProgressReplyWatch &&
    !shouldArmNoToolPostRawProgressReplyWatch &&
    !shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem
  )
    turnWatches.disarmCompletionIdleWatch();
  if (trackedDynamicToolCompletion) {
    const itemId = readNotificationItemId(notification);
    if (itemId) {
      params.pendingOpenClawDynamicToolCompletionIds.delete(itemId);
      params.onScheduleTerminalDynamicToolReleaseCheck();
    }
  }
  return {
    isCurrentTurnNotification,
    isTurnAbortMarker:
      isCurrentTurnNotification &&
      isCodexTurnAbortMarkerNotification(notification, {
        currentPromptTexts: params.currentPromptTexts,
      }),
    isTurnTerminal: isTerminalCodexTurnNotificationForTurn({
      notification,
      threadId: params.threadId,
      turnId: params.turnId,
      currentPromptTexts: params.currentPromptTexts,
    }),
    turnCrossedToolHandoff,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-lifecycle-controller.ts
function createCodexAttemptLifecycleController(resources, turnRuntime) {
  const { prompt, state: resourceState, trajectoryRecorder } = resources;
  const { connection } = prompt.context.runtime;
  const {
    params,
    attemptStartedAt,
    runAbortController,
    fastModeAutoStartedAtMs,
    fastModeAutoProgressState,
  } = connection;
  const { state, activeTurnItemIds, pendingOpenClawDynamicToolCompletionIds, turnWatches } =
    turnRuntime;
  const releaseTurnAfterTerminalDynamicTool = (value) => {
    if (
      !shouldReleaseTurnAfterTerminalDynamicTool({
        completed: state.completed,
        aborted: runAbortController.signal.aborted,
        responseSuccess: value.response.success,
        currentTurnHadNonTerminalDynamicToolResult:
          state.currentTurnHadNonTerminalDynamicToolResult,
        activeAppServerTurnRequests: state.activeAppServerTurnRequests,
        activeTurnItemIdsCount: activeTurnItemIds.size,
        pendingOpenClawDynamicToolCompletionIdsCount: pendingOpenClawDynamicToolCompletionIds.size,
      })
    )
      return;
    state.pendingTerminalDynamicToolRelease = void 0;
    trajectoryRecorder?.recordEvent("turn.dynamic_tool_terminal_release", {
      threadId: value.call.threadId,
      turnId: value.call.turnId,
      toolCallId: value.call.callId,
      name: value.call.tool,
      durationMs: value.durationMs,
    });
    log.info("codex app-server turn released after terminal dynamic tool result", {
      threadId: value.call.threadId,
      turnId: value.call.turnId,
      toolCallId: value.call.callId,
      tool: value.call.tool,
      durationMs: value.durationMs,
    });
    interruptCodexTurnBestEffort(resourceState.client, {
      threadId: value.call.threadId,
      turnId: value.call.turnId,
      timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
    });
    state.completed = true;
    turnWatches.clearCompletionIdleTimer();
    turnWatches.clearAssistantCompletionIdleTimer();
    turnWatches.clearTerminalIdleTimer();
    state.resolveCompletion?.();
  };
  const scheduleTerminalDynamicToolReleaseCheck = () => {
    if (
      state.terminalDynamicToolReleaseCheckScheduled ||
      (!state.pendingTerminalDynamicToolRelease &&
        !state.currentTurnHadNonTerminalDynamicToolResult)
    )
      return;
    state.terminalDynamicToolReleaseCheckScheduled = true;
    setImmediate(() => {
      state.terminalDynamicToolReleaseCheckScheduled = false;
      const action = resolveTerminalDynamicToolBatchAction({
        activeAppServerTurnRequests: state.activeAppServerTurnRequests,
        activeTurnItemIdsCount: activeTurnItemIds.size,
        pendingOpenClawDynamicToolCompletionIdsCount: pendingOpenClawDynamicToolCompletionIds.size,
        currentTurnHadNonTerminalDynamicToolResult:
          state.currentTurnHadNonTerminalDynamicToolResult,
        hasPendingTerminalDynamicToolRelease: state.pendingTerminalDynamicToolRelease !== void 0,
      });
      if (action === "release-pending-terminal" && state.pendingTerminalDynamicToolRelease)
        releaseTurnAfterTerminalDynamicTool(state.pendingTerminalDynamicToolRelease);
      else if (action === "clear-nonterminal-batch") {
        state.pendingTerminalDynamicToolRelease = void 0;
        state.currentTurnHadNonTerminalDynamicToolResult = false;
      }
    }).unref?.();
  };
  const scheduleTurnReleaseAfterTerminalDynamicTool = (value) => {
    state.pendingTerminalDynamicToolRelease = value;
    scheduleTerminalDynamicToolReleaseCheck();
  };
  const emitLifecycleStart = () => {
    emitCodexAppServerEvent(params, {
      stream: "lifecycle",
      data: {
        phase: "start",
        startedAt: attemptStartedAt,
      },
    });
    state.lifecycleStarted = true;
  };
  const emitLifecycleTerminal = (data) => {
    if (!state.lifecycleStarted || state.lifecycleTerminalEmitted) return;
    emitCodexAppServerEvent(params, {
      stream: "lifecycle",
      data: {
        startedAt: attemptStartedAt,
        endedAt: Date.now(),
        ...data,
        ...((params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd)
          ? { phase: "finishing" }
          : {}),
      },
    });
    state.lifecycleTerminalEmitted = true;
  };
  const buildLifecycleTerminalMeta = (input) => {
    const abortFields = input.aborted
      ? resolveAgentRunAbortLifecycleFields(runAbortController.signal)
      : void 0;
    if (input.timedOut || abortFields?.stopReason === "timeout")
      return {
        aborted: true,
        status: "timed_out",
        stopReason: "timeout",
        timeoutPhase: "provider",
        providerStarted: true,
      };
    return input.aborted
      ? {
          aborted: true,
          status: "cancelled",
          stopReason: "stop",
        }
      : void 0;
  };
  const executionPhaseKeys = /* @__PURE__ */ new Set();
  const emitExecutionPhaseOnce = (key, info) => {
    if (executionPhaseKeys.has(key)) return;
    executionPhaseKeys.add(key);
    params.onExecutionPhase?.({
      provider: params.provider,
      model: params.modelId,
      backend: "codex-app-server",
      ...info,
    });
  };
  const reportExecutionNotification = (notification) => {
    reportCodexExecutionNotification({
      notification,
      emitExecutionPhaseOnce,
    });
  };
  const emitFastModeAutoProgress = async (payload) => {
    const summary = formatFastModeAutoProgressText(payload);
    await emitCodexAppServerEvent(params, {
      stream: "item",
      data: {
        kind: "status",
        title: "Fast",
        phase: "update",
        summary,
      },
    });
    try {
      await params.onToolResult?.({
        text: summary,
        channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND },
      });
    } catch (error) {
      log.debug("codex app-server fast mode auto progress delivery failed", { error });
    }
  };
  const maybeAnnounceFastModeAutoOff = async () => {
    if (
      params.fastModeAuto !== true ||
      fastModeAutoStartedAtMs === void 0 ||
      fastModeAutoProgressState.offAnnounced
    )
      return;
    const next = resolveFastModeForElapsed({
      mode: "auto",
      startedAtMs: fastModeAutoStartedAtMs,
      fastAutoOnSeconds: params.fastModeAutoOnSeconds,
    });
    if (next.enabled) return;
    fastModeAutoProgressState.offAnnounced = true;
    await emitFastModeAutoProgress(next);
  };
  const maybeEmitFastModeAutoReset = async () => {
    if (
      params.fastModeAuto !== true ||
      !fastModeAutoProgressState.offAnnounced ||
      fastModeAutoProgressState.resetAnnounced
    )
      return;
    fastModeAutoProgressState.resetAnnounced = true;
    await emitFastModeAutoProgress({
      enabled: true,
      elapsedSeconds: 0,
      fastAutoOnSeconds: params.fastModeAutoOnSeconds,
    });
  };
  const maybeEmitFastModeAutoResetBestEffort = async () => {
    try {
      await maybeEmitFastModeAutoReset();
    } catch (error) {
      log.warn(
        `codex app-server fast mode auto reset progress failed: ${formatErrorMessage(error)}`,
      );
    }
  };
  return {
    scheduleTerminalDynamicToolReleaseCheck,
    scheduleTurnReleaseAfterTerminalDynamicTool,
    emitLifecycleStart,
    emitLifecycleTerminal,
    buildLifecycleTerminalMeta,
    emitExecutionPhaseOnce,
    reportExecutionNotification,
    maybeAnnounceFastModeAutoOff,
    maybeEmitFastModeAutoResetBestEffort,
  };
}
//#endregion
//#region extensions/codex/src/app-server/turn-router.ts
/** Keyed routing for all turn traffic on one shared Codex app-server client. */
const DEFAULT_PREBIND_NOTIFICATION_LIMIT = 256;
const CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS = 3e4;
const routers = /* @__PURE__ */ new WeakMap();
/** Returns the sole router installed on a physical app-server client. */
function getCodexAppServerTurnRouter(client) {
  const existing = routers.get(client);
  if (existing) return existing;
  const router = new ClientTurnRouter(client);
  routers.set(client, router);
  return router;
}
var ClientTurnRouter = class {
  constructor(client) {
    this.routes = /* @__PURE__ */ new Map();
    this.nativeTurnCompletionWatchers = /* @__PURE__ */ new Map();
    this.disposed = false;
    client.addNotificationHandler((notification) => this.routeNotification(notification));
    client.addRequestHandler((request) => this.routeRequest(request));
    client.addCloseHandler(() => this.dispose());
  }
  reserveThread(options) {
    this.assertActive();
    const threadId = requireId(options.threadId, "thread id");
    if (this.routes.has(threadId))
      throw new Error(`codex app-server thread route already reserved: ${threadId}`);
    const route = {
      threadId,
      controller: new AbortController(),
      ended: deferred(),
      activated: deferred(),
      gate: "open",
      pending: [],
      notificationTail: Promise.resolve(),
      nativeTurnCompleted: false,
    };
    this.routes.set(threadId, route);
    if (options.onNotification || options.onRequest) this.activateNow(route, options);
    const releaseOn = options.releaseOn;
    if (releaseOn) {
      const release = () => this.release(route, abortReason(releaseOn));
      releaseOn.addEventListener("abort", release, { once: true });
      route.detachReleaseOn = () => releaseOn.removeEventListener("abort", release);
      if (releaseOn.aborted) release();
    }
    return {
      threadId,
      signal: route.controller.signal,
      activate: (handlers) => this.activate(route, handlers),
      armTurn: () => this.armTurn(route),
      bindTurn: (turnId) => this.bindTurn(route, turnId),
      cancelTurn: () => this.cancelTurn(route),
      waitForTurnCompletion: (waitOptions) => this.waitForTurnCompletion(route, waitOptions),
      drain: () => this.drainNotifications(route),
      release: () => this.release(route),
    };
  }
  watchNativeTurnCompletion(options) {
    this.assertActive();
    const threadId = requireId(options.threadId, "thread id");
    const turnId = requireId(options.turnId, "turn id");
    let settle;
    const completion = new Promise((resolve) => {
      settle = resolve;
    });
    const watchers = this.nativeTurnCompletionWatchers.get(threadId) ?? /* @__PURE__ */ new Set();
    this.nativeTurnCompletionWatchers.set(threadId, watchers);
    let settled = false;
    const finish = (completed) => {
      if (settled) return;
      settled = true;
      watchers.delete(watcher);
      if (watchers.size === 0) this.nativeTurnCompletionWatchers.delete(threadId);
      clearTimeout(timeout);
      settle(completed);
    };
    const touch = () => {
      timeout.refresh();
    };
    const watcher = {
      turnId,
      finish,
      touch,
    };
    watchers.add(watcher);
    const timeout = setTimeout(() => finish(false), Math.max(1, options.timeoutMs));
    timeout.unref?.();
    return {
      completion,
      cancel: () => finish(false),
    };
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const route of this.routes.values())
      this.release(route, /* @__PURE__ */ new Error("codex app-server turn router closed"));
    for (const watchers of this.nativeTurnCompletionWatchers.values())
      for (const watcher of watchers) watcher.finish(false);
  }
  async activate(route, handlers) {
    this.assertRoute(route);
    this.activateNow(route, handlers);
    await this.waitForNotifications(route);
    this.assertRoute(route);
  }
  activateNow(route, handlers) {
    if (route.handlers)
      throw new Error(`codex app-server thread route already activated: ${route.threadId}`);
    this.assertRoute(route);
    if (!handlers.onNotification && !handlers.onRequest)
      throw new Error("codex app-server thread route requires a notification or request handler");
    route.handlers = handlers;
    if (!handlers.onNotification) route.pending.length = 0;
    else if (route.gate !== "armed") this.flushNotifications(route);
    route.activated.resolve();
  }
  armTurn(route) {
    this.assertRoute(route);
    if (route.gate !== "open")
      throw new Error(`codex app-server thread route cannot arm from ${route.gate}`);
    route.gate = "armed";
    route.nativeTurnCompleted = false;
    route.binding = deferred();
  }
  async cancelTurn(route) {
    if (route.released || route.gate !== "armed") return;
    route.gate = "open";
    route.binding?.resolve();
    route.binding = void 0;
    this.flushNotifications(route);
    await this.waitForNotifications(route);
    this.assertRoute(route);
  }
  async bindTurn(route, turnIdInput) {
    this.assertRoute(route);
    if (!route.handlers)
      throw new Error("codex app-server thread route must be activated before binding a turn");
    if (route.gate !== "armed")
      throw new Error(`codex app-server thread route cannot bind from ${route.gate}`);
    const turnId = requireId(turnIdInput, "turn id");
    route.gate = "bound";
    route.turnId = turnId;
    this.flushNotifications(route);
    route.binding?.resolve();
    await this.waitForNotifications(route);
    this.assertRoute(route);
  }
  routeNotification(notification) {
    if (this.disposed) return;
    const scope = readScope(notification.params);
    const watchers = scope.threadId
      ? this.nativeTurnCompletionWatchers.get(scope.threadId)
      : void 0;
    const route = scope.threadId ? this.routes.get(scope.threadId) : void 0;
    if (!watchers && !route) return;
    const terminal = isCodexTerminalTurnNotification(notification);
    if (scope.turnId && watchers) {
      for (const watcher of watchers)
        if (watcher.turnId === scope.turnId)
          if (terminal) watcher.finish(true);
          else watcher.touch();
    }
    if (!route) return;
    const routeScope = {
      threadId: route.threadId,
      ...(scope.turnId ? { turnId: scope.turnId } : {}),
    };
    const receivedAtMs = Date.now();
    if (route.gate !== "bound" && terminal)
      if (route.nativeTurnCompletion) route.nativeTurnCompletion.resolve();
      else route.nativeTurnCompleted = true;
    if (!route.handlers) {
      this.bufferNotification(route, notification, routeScope, receivedAtMs);
      return;
    }
    const handler = route.handlers.onNotification;
    if (!handler) return;
    if (route.gate === "bound" && scope.turnId && scope.turnId !== route.turnId) return;
    if (route.gate === "armed") {
      this.bufferNotification(route, notification, routeScope, receivedAtMs);
      return;
    }
    route.handlers.onNotificationReceived?.(notification, routeScope, receivedAtMs);
    this.enqueueNotification(route, handler, notification, routeScope);
    return route.notificationTail;
  }
  async routeRequest(request) {
    if (this.disposed) return;
    const scope = readScope(request.params);
    if (!scope.threadId) return;
    const route = this.routes.get(scope.threadId);
    if (!route || route.released) return;
    if (!route.handlers) await route.activated.promise;
    if (route.released || !route.handlers) return;
    const handler = route.handlers.onRequest;
    if (!handler) return;
    while (route.gate === "armed") {
      await route.binding?.promise;
      if (route.released) return;
    }
    if (route.gate === "bound") {
      if (scope.turnId && scope.turnId !== route.turnId) return;
      if (route.released) return;
    }
    await this.waitForNotifications(route);
    if (route.released) return;
    try {
      const result = await handler(request, {
        threadId: scope.threadId,
        ...(scope.turnId ? { turnId: scope.turnId } : {}),
      });
      return route.released ? void 0 : result;
    } catch (error) {
      if (route.released) return;
      throw error;
    }
  }
  flushNotifications(route) {
    const handler = route.handlers?.onNotification;
    if (!handler) return;
    for (const pending of route.pending.splice(0))
      if (
        !pending.scope.turnId ||
        route.gate !== "bound" ||
        pending.scope.turnId === route.turnId
      ) {
        route.handlers?.onNotificationReceived?.(
          pending.notification,
          pending.scope,
          pending.receivedAtMs,
        );
        this.enqueueNotification(route, handler, pending.notification, pending.scope);
      }
  }
  bufferNotification(route, notification, scope, receivedAtMs) {
    if (route.pending.length < DEFAULT_PREBIND_NOTIFICATION_LIMIT) {
      route.pending.push({
        notification,
        receivedAtMs,
        scope,
      });
      return;
    }
    const error = /* @__PURE__ */ new Error(
      `codex app-server pre-bind notification buffer exceeded ${DEFAULT_PREBIND_NOTIFICATION_LIMIT} entries for thread ${route.threadId}`,
    );
    log.warn(error.message);
    this.release(route, error);
  }
  enqueueNotification(route, handler, notification, scope) {
    if (route.released) return;
    route.notificationTail = route.notificationTail
      .then(() => handler(notification, scope))
      .catch((error) => {
        if (!route.released)
          log.warn("codex app-server keyed notification handler failed", {
            method: notification.method,
            threadId: route.threadId,
            turnId: route.turnId,
            error,
          });
      });
  }
  async waitForNotifications(route) {
    await Promise.race([route.notificationTail, route.ended.promise]);
  }
  async drainNotifications(route) {
    await route.notificationTail;
  }
  async waitForTurnCompletion(route, options) {
    this.assertRoute(route);
    if (route.nativeTurnCompleted) {
      route.nativeTurnCompleted = false;
      return true;
    }
    if (route.nativeTurnCompletion)
      throw new Error(`codex app-server turn completion wait already active: ${route.threadId}`);
    const completion = deferred();
    route.nativeTurnCompletion = completion;
    let timeout;
    let removeAbort;
    const timedOut = new Promise((resolve) => {
      timeout = setTimeout(() => resolve(false), Math.max(1, options.timeoutMs));
    });
    const aborted = new Promise((resolve) => {
      const signal = options.signal;
      if (!signal) return;
      const onAbort = () => resolve(false);
      signal.addEventListener("abort", onAbort, { once: true });
      removeAbort = () => signal.removeEventListener("abort", onAbort);
      if (signal.aborted) onAbort();
    });
    try {
      return await Promise.race([
        completion.promise.then(() => true),
        route.ended.promise.then(() => false),
        timedOut,
        aborted,
      ]);
    } finally {
      if (route.nativeTurnCompletion === completion) route.nativeTurnCompletion = void 0;
      if (timeout) clearTimeout(timeout);
      removeAbort?.();
    }
  }
  release(route, error = /* @__PURE__ */ new Error("codex app-server thread route is released")) {
    if (route.released) return;
    route.released = error;
    route.pending.length = 0;
    route.ended.resolve();
    route.activated.resolve();
    route.binding?.resolve();
    route.detachReleaseOn?.();
    route.controller.abort(error);
    if (this.routes.get(route.threadId) === route) this.routes.delete(route.threadId);
  }
  assertActive() {
    if (this.disposed) throw new Error("codex app-server turn router is closed");
  }
  assertRoute(route) {
    if (route.released) throw route.released;
  }
};
/** True after Codex will not continue the exact turn. */
function isCodexTerminalTurnNotification(notification) {
  if (notification.method === "turn/completed") return true;
  return (
    notification.method === "error" &&
    isJsonObject(notification.params) &&
    notification.params.willRetry === false
  );
}
function deferred() {
  let resolve;
  return {
    promise: new Promise((resolvePromise) => {
      resolve = resolvePromise;
    }),
    resolve,
  };
}
function abortReason(signal) {
  return signal.reason instanceof Error
    ? signal.reason
    : new Error(String(signal.reason ?? "codex app-server thread route aborted"));
}
function readScope(value) {
  if (!isJsonObject(value)) return {};
  const threadId = readCodexNotificationThreadId(value);
  const turnId = readCodexNotificationTurnId(value);
  return {
    ...(threadId ? { threadId } : {}),
    ...(turnId ? { turnId } : {}),
  };
}
function requireId(value, label) {
  const normalized = value.trim();
  if (!normalized) throw new Error(`codex app-server ${label} must not be empty`);
  return normalized;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-notification-controller.ts
function createCodexAttemptNotificationController(resources, turnRuntime, lifecycle) {
  const { prompt, state: resourceState, projectorRef, registerNativeSubagentMonitor } = resources;
  const { context, turnState } = prompt;
  const { attemptTools, runtime } = context;
  const { connection } = runtime;
  const { appServer, runAbortController } = connection;
  const { allocateCodexToolOutcomeOrdinal } = attemptTools;
  const {
    state,
    turnIdRef,
    userInputBridgeRef,
    steeringQueueRef,
    turnWatches,
    activeTurnItemIds,
    activeCompletionBlockerItemIds,
    activeFinalizationHookRunIds,
    finalizationHookBatchStatuses,
    pendingOpenClawDynamicToolCompletionIds,
    postToolRawAssistantCompletionIdleTimeoutMs,
  } = turnRuntime;
  const {
    scheduleTerminalDynamicToolReleaseCheck,
    reportExecutionNotification,
    maybeAnnounceFastModeAutoOff,
  } = lifecycle;
  const isTerminalTurnNotificationForTurn = (notification, notificationTurnId) =>
    isTerminalCodexTurnNotificationForTurn({
      notification,
      threadId: resourceState.thread.threadId,
      turnId: notificationTurnId,
      currentPromptTexts: [turnState.codexTurnPromptText],
    });
  const handleNotification = async (notification) => {
    const projector = projectorRef.current;
    const turnId = turnIdRef.current;
    const steeringQueue = steeringQueueRef.current;
    userInputBridgeRef.current?.handleNotification(notification);
    if (!projector || !turnId) {
      if (notification.method === "error") state.latestStartupErrorNotification = notification;
      return;
    }
    const notificationState = applyCodexTurnNotificationState({
      notification,
      threadId: resourceState.thread.threadId,
      turnId,
      currentPromptTexts: [turnState.codexTurnPromptText],
      turnWatches,
      activeTurnItemIds,
      activeCompletionBlockerItemIds,
      activeAppServerTurnRequests: state.activeAppServerTurnRequests,
      pendingOpenClawDynamicToolCompletionIds,
      turnCrossedToolHandoff: state.turnCrossedToolHandoff,
      postToolRawAssistantCompletionIdleTimeoutMs,
      onScheduleTerminalDynamicToolReleaseCheck: scheduleTerminalDynamicToolReleaseCheck,
      onReportExecutionNotification: reportExecutionNotification,
    });
    state.turnCrossedToolHandoff = notificationState.turnCrossedToolHandoff;
    const hookNotification = readCodexFinalizationHookNotification(
      notification,
      resourceState.thread.threadId,
      turnId,
    );
    if (hookNotification?.phase === "started") {
      if (activeFinalizationHookRunIds.size === 0) finalizationHookBatchStatuses.clear();
      activeFinalizationHookRunIds.add(hookNotification.runId);
      turnWatches.disarmAssistantCompletionIdleWatch();
    }
    if (notificationState.isTurnTerminal) state.terminalTurnNotificationQueued = true;
    try {
      await waitForCodexNotificationDispatchTurn();
      await projector.handleNotification(notification);
      const canRelease =
        isAssistantCompletionReleaseNotification(notification, state.turnCrossedToolHandoff) ||
        (notificationState.isCurrentTurnNotification &&
          state.turnCrossedToolHandoff &&
          notification.method === "rawResponseItem/completed" &&
          projector.canReleaseLatestTerminalAssistantAfterToolHandoff());
      if (notificationState.isCurrentTurnNotification && canRelease) {
        const itemId = projector.getLatestTerminalAssistantCandidate()?.itemId;
        if (
          state.rejectedFinalizationHookAssistant &&
          itemId &&
          itemId !== state.rejectedFinalizationHookAssistant.itemId
        )
          state.rejectedFinalizationHookAssistant = void 0;
        else if (state.rejectedFinalizationHookAssistant)
          turnWatches.disarmAssistantCompletionIdleWatch();
        else if (
          activeFinalizationHookRunIds.size === 0 &&
          !state.terminalTurnNotificationQueued &&
          state.activeAppServerTurnRequests === 0 &&
          activeTurnItemIds.size === 0 &&
          activeCompletionBlockerItemIds.size === 0 &&
          pendingOpenClawDynamicToolCompletionIds.size === 0 &&
          projector.hasLatestTerminalAssistantCandidateText()
        )
          turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
      }
      if (
        notificationState.isCurrentTurnNotification &&
        activeTurnItemIds.size === 0 &&
        isRawFunctionToolOutputCompletionNotification(notification)
      )
        await maybeAnnounceFastModeAutoOff();
    } catch (error) {
      log.debug("codex app-server projector notification threw", {
        method: notification.method,
        error,
      });
    } finally {
      if (hookNotification?.phase === "completed") {
        state.unsettledFinalizationHookCount = Math.max(
          0,
          state.unsettledFinalizationHookCount - 1,
        );
        activeFinalizationHookRunIds.delete(hookNotification.runId);
        finalizationHookBatchStatuses.set(hookNotification.runId, hookNotification.status);
        if (activeFinalizationHookRunIds.size === 0) {
          const statuses = new Set(finalizationHookBatchStatuses.values());
          if (statuses.has("blocked") && !statuses.has("stopped")) {
            const itemId = projector.getLatestTerminalAssistantCandidate()?.itemId;
            state.rejectedFinalizationHookAssistant = itemId ? { itemId } : {};
            turnWatches.disarmAssistantCompletionIdleWatch();
          } else state.rejectedFinalizationHookAssistant = void 0;
        }
        if (
          activeFinalizationHookRunIds.size === 0 &&
          state.rejectedFinalizationHookAssistant === void 0 &&
          !state.terminalTurnNotificationQueued &&
          state.activeAppServerTurnRequests === 0 &&
          activeTurnItemIds.size === 0 &&
          activeCompletionBlockerItemIds.size === 0 &&
          pendingOpenClawDynamicToolCompletionIds.size === 0 &&
          projector.hasLatestTerminalAssistantCandidateText()
        )
          turnWatches.armAssistantCompletionIdleWatch({
            lastNotificationMethod: notification.method,
            hookRunId: hookNotification.runId,
            hookStatus: hookNotification.status,
          });
      }
      if (notificationState.isTurnTerminal) {
        if (notificationState.isTurnAbortMarker) projector.markAborted();
        if (!state.timedOut && !runAbortController.signal.aborted)
          await steeringQueue?.flushPending();
        state.completed = true;
        turnWatches.clearCompletionIdleTimer();
        turnWatches.clearAssistantCompletionIdleTimer();
        turnWatches.clearTerminalIdleTimer();
        state.resolveCompletion?.();
      }
    }
  };
  const waitForActiveNativeTurnCompletion = async () => {
    const route = resourceState.turnRoute;
    if (!route) return false;
    return await route.waitForTurnCompletion({
      timeoutMs: Math.min(appServer.requestTimeoutMs, CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS),
      signal: runAbortController.signal,
    });
  };
  const noteNotificationReceived = (notification, scope, receivedAtMs) => {
    const projector = projectorRef.current;
    const turnId = turnIdRef.current;
    if (!projector || !turnId) return;
    if (isTerminalTurnNotificationForTurn(notification, turnId))
      state.terminalTurnNotificationQueued = true;
    if (scope.turnId === turnId) {
      const modelToolCallId = readRawResponseToolCallId(notification);
      if (modelToolCallId) allocateCodexToolOutcomeOrdinal?.(modelToolCallId);
      const nativeItem = readCodexNotificationItem(notification.params);
      if (nativeItem?.type === "webSearch") projector.recordNativeToolOutcome(nativeItem);
    }
    if (
      readCodexFinalizationHookNotification(notification, resourceState.thread.threadId, turnId)
        ?.phase === "started"
    ) {
      state.unsettledFinalizationHookCount += 1;
      turnWatches.disarmAssistantCompletionIdleWatch();
    }
    turnWatches.noteNotificationReceived(notification.method, { receivedAtMs });
  };
  const enqueueNotification = async (notification, scope) => {
    log.trace("codex app-server raw notification received", {
      method: notification.method,
      ...scope,
    });
    await handleNotification(notification);
  };
  const drainNotificationQueue = async () => {
    await resourceState.turnRoute?.drain();
  };
  registerNativeSubagentMonitor(resourceState.thread.threadId);
  return {
    waitForActiveNativeTurnCompletion,
    noteNotificationReceived,
    enqueueNotification,
    drainNotificationQueue,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-prompt.ts
async function prepareCodexAttemptPrompt(context) {
  const {
    runtime,
    attemptTools,
    historyState,
    hookContext,
    workspaceBootstrapContext,
    baseDeveloperInstructions,
    openClawPromptContext,
    skillsCollaborationInstructions,
    promptState,
    codexContextProjectionMaxChars,
  } = context;
  const {
    connection,
    buildActiveRunAttemptParams,
    effectiveContextTokenBudget,
    effectiveRuntimeModelId,
    effectiveRuntimeProviderId,
  } = runtime;
  const {
    params,
    activeContextEngine,
    usesSupervisionConnection,
    mutable,
    isInactiveThreadBootstrapBinding,
    bindingStore,
    bindingIdentity,
    agentDir,
    appServer,
    contextSessionKey,
    effectiveWorkspace,
  } = connection;
  const { toolBridge } = attemptTools;
  const applyFreshThreadContinuityProjection = () => {
    const projection = projectContextEngineAssemblyForCodex({
      assembledMessages: historyState.messages,
      originalHistoryMessages: historyState.messages,
      prompt: params.prompt,
      maxRenderedContextChars: codexContextProjectionMaxChars,
    });
    promptState.promptText = projection.promptText;
    promptState.promptContextRange = projection.promptContextRange;
    promptState.prePromptMessageCount = projection.prePromptMessageCount;
  };
  const applyActiveContextEngineProjection = async (decisionStartupBinding) => {
    if (!activeContextEngine) return;
    const assembled = await assembleHarnessContextEngine({
      contextEngine: activeContextEngine,
      sessionId: runtime.activeSessionId,
      sessionKey: contextSessionKey,
      messages: historyState.messages,
      tokenBudget: effectiveContextTokenBudget,
      availableTools: new Set(
        flattenCodexDynamicToolFunctions(toolBridge.availableSpecs)
          .map((tool) => tool.name)
          .filter(isNonEmptyString),
      ),
      citationsMode: params.config?.memory?.citations,
      modelId: effectiveRuntimeModelId,
      contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
      providerId: effectiveRuntimeProviderId,
      requestedModelId: usesSupervisionConnection ? void 0 : params.requestedModelId,
      fallbackReason: usesSupervisionConnection ? void 0 : params.fallbackReason,
      degradedReason: usesSupervisionConnection ? void 0 : params.degradedReason,
      prompt: params.prompt,
    });
    if (!assembled) throw new Error("context engine assemble returned no result");
    const contextEngineProjection = readContextEngineThreadBootstrapProjection(
      assembled.contextProjection,
    );
    const projection = projectContextEngineAssemblyForCodex({
      assembledMessages: assembled.messages,
      originalHistoryMessages: historyState.messages,
      prompt: params.prompt,
      systemPromptAddition: assembled.systemPromptAddition,
      maxRenderedContextChars: codexContextProjectionMaxChars,
      toolPayloadMode: contextEngineProjection ? "preserve" : "elide",
    });
    const projectionDecision = contextEngineProjection
      ? resolveContextEngineBootstrapProjectionDecision({
          startupBinding: decisionStartupBinding,
          expectedBinding: buildContextEngineBinding(
            buildActiveRunAttemptParams(),
            contextEngineProjection,
          ),
          projection: contextEngineProjection,
          dynamicToolsFingerprint: codexDynamicToolsFingerprint(toolBridge.specs),
          legacyDynamicToolsFingerprint: codexLegacyDynamicToolsFingerprint(toolBridge.specs),
        })
      : {
          project: true,
          reason: "per-turn-projection",
        };
    const decisionBinding = decisionStartupBinding;
    log.info("codex app-server context-engine projection decision", {
      sessionId: params.sessionId,
      sessionKey: contextSessionKey,
      engineId: activeContextEngine.info.id,
      mode: contextEngineProjection?.mode ?? assembled.contextProjection?.mode ?? "per_turn",
      epoch: contextEngineProjection?.epoch,
      fingerprint: contextEngineProjection?.fingerprint,
      previousThreadId: decisionBinding?.threadId,
      previousEpoch: decisionBinding?.contextEngine?.projection?.epoch,
      previousFingerprint: decisionBinding?.contextEngine?.projection?.fingerprint,
      projected: projectionDecision.project,
      reason: projectionDecision.reason,
      assembledMessages: assembled.messages.length,
      originalHistoryMessages: historyState.messages.length,
      projectedPromptChars: projection.promptText.length,
      developerInstructionAdditionChars: projection.developerInstructionAddition?.length ?? 0,
    });
    promptState.contextEngineProjection = contextEngineProjection;
    promptState.promptText = projectionDecision.project ? projection.promptText : params.prompt;
    promptState.promptContextRange = projectionDecision.project
      ? projection.promptContextRange
      : void 0;
    promptState.developerInstructions = joinPresentSections(
      baseDeveloperInstructions,
      projection.developerInstructionAddition,
    );
    promptState.prePromptMessageCount = projection.prePromptMessageCount;
  };
  if (activeContextEngine)
    try {
      await applyActiveContextEngineProjection(
        runtime.nativeToolSurfaceEnabled ? mutable.startupBinding : void 0,
      );
    } catch (assembleErr) {
      log.warn("context engine assemble failed; using Codex baseline prompt", {
        error: formatErrorMessage(assembleErr),
      });
    }
  const codexModelInputHistoryMessages = [];
  const buildPromptFromCurrentInputs = () =>
    resolveAgentHarnessBeforePromptBuildResult({
      prompt: prependCurrentInboundContext(promptState.promptText, params.currentInboundContext),
      developerInstructions: promptState.developerInstructions,
      messages: codexModelInputHistoryMessages,
      ctx: hookContext,
      bootstrapContextRunKind: params.bootstrapContextRunKind,
      ...("beforeAgentStartResult" in params
        ? { beforeAgentStartResult: params.beforeAgentStartResult }
        : {}),
    });
  const resolveShiftedPromptInputRange = (prompt, promptInputRange, turnPromptText) => {
    if (
      !promptInputRange ||
      promptInputRange.start < 0 ||
      promptInputRange.end < promptInputRange.start ||
      promptInputRange.end > prompt.length ||
      !turnPromptText.endsWith(prompt)
    )
      return;
    const turnPromptOffset = turnPromptText.length - prompt.length;
    return {
      start: turnPromptOffset + promptInputRange.start,
      end: turnPromptOffset + promptInputRange.end,
    };
  };
  const resolveShiftedPromptContextRange = (prompt, promptInputRange, turnPromptText) => {
    const promptTextInputOffset = promptInputRange
      ? promptInputRange.end - promptState.promptText.length
      : void 0;
    if (
      !promptState.promptContextRange ||
      !promptInputRange ||
      promptTextInputOffset === void 0 ||
      promptInputRange.start < 0 ||
      promptInputRange.end < promptInputRange.start ||
      promptInputRange.end > prompt.length ||
      promptTextInputOffset < promptInputRange.start ||
      prompt.slice(promptTextInputOffset, promptInputRange.end) !== promptState.promptText ||
      !turnPromptText.endsWith(prompt)
    )
      return;
    const promptTextOffset = prompt.endsWith(promptState.promptText)
      ? prompt.length - promptState.promptText.length
      : promptTextInputOffset;
    if (promptTextOffset < 0) return;
    const turnPromptOffset = turnPromptText.length - prompt.length + promptTextOffset;
    const contextRange = {
      start: turnPromptOffset + promptState.promptContextRange.start,
      end: turnPromptOffset + promptState.promptContextRange.end,
    };
    return {
      contextRange,
      requestRange: {
        start: contextRange.end,
        end: turnPromptOffset + promptState.promptText.length,
      },
    };
  };
  const decorateCodexTurnPromptText = (promptBuildResult) => {
    const turnPromptText = prependCodexOpenClawPromptContext(
      promptBuildResult.prompt,
      openClawPromptContext,
      {
        preservePromptWithoutContext:
          params.bootstrapContextMode === "lightweight" &&
          params.bootstrapContextRunKind === "cron",
      },
    );
    const projectedRanges = resolveShiftedPromptContextRange(
      promptBuildResult.prompt,
      promptBuildResult.promptInputRange,
      turnPromptText,
    );
    const preservedRange =
      resolveShiftedPromptInputRange(
        promptBuildResult.prompt,
        promptBuildResult.promptInputRange,
        turnPromptText,
      ) ??
      resolveCodexDeliveryHintPreservedInputRange({
        prompt: promptBuildResult.prompt,
        promptInputRange: promptBuildResult.promptInputRange,
        decoratedPrompt: turnPromptText,
      });
    return fitCodexProjectedContextForTurnStart({
      promptText: turnPromptText,
      contextRange: projectedRanges?.contextRange,
      requestRange: projectedRanges?.requestRange,
      preservedRange,
    });
  };
  const firstPromptBuild = await buildPromptFromCurrentInputs();
  const turnState = {
    promptBuild: firstPromptBuild,
    codexTurnPromptText: decorateCodexTurnPromptText(firstPromptBuild),
  };
  const buildRenderedCodexDeveloperInstructions = () =>
    joinPresentSections(
      turnState.promptBuild.developerInstructions,
      buildTurnCollaborationMode(params, {
        turnScopedDeveloperInstructions: workspaceBootstrapContext.turnScopedDeveloperInstructions,
        skillsCollaborationInstructions,
        memoryCollaborationInstructions: workspaceBootstrapContext.memoryCollaborationInstructions,
        heartbeatCollaborationInstructions:
          workspaceBootstrapContext.heartbeatCollaborationInstructions,
      }).settings.developer_instructions ?? void 0,
    );
  const rebuildCodexPromptBuildFromCurrentProjection = async () => {
    turnState.promptBuild = await buildPromptFromCurrentInputs();
    turnState.codexTurnPromptText = decorateCodexTurnPromptText(turnState.promptBuild);
  };
  const rebuildCodexTurnPromptTextFromCurrentProjection = async () => {
    const nextPromptBuild = await buildPromptFromCurrentInputs();
    turnState.promptBuild = {
      ...turnState.promptBuild,
      prompt: nextPromptBuild.prompt,
      promptInputRange: nextPromptBuild.promptInputRange,
    };
    turnState.codexTurnPromptText = decorateCodexTurnPromptText(nextPromptBuild);
  };
  const selectNewerVisibleHistoryAfterBinding = (binding) => {
    const cutoff = Date.parse(binding.historyCoveredThrough ?? "");
    return historyState.messages.filter((message) => {
      if (message.role !== "user" && message.role !== "assistant") return false;
      const record = message;
      const meta = record["__openclaw"];
      const mirrorIdentity =
        meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mirrorIdentity : void 0;
      const mirrorOrigin =
        meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mirrorOrigin : void 0;
      const timestamp =
        typeof message.timestamp === "number"
          ? message.timestamp
          : typeof message.timestamp === "string"
            ? Date.parse(message.timestamp)
            : NaN;
      return (
        !(
          typeof record.idempotencyKey === "string" &&
          record.idempotencyKey.startsWith("codex-app-server:")
        ) &&
        mirrorOrigin !== "codex-app-server" &&
        !(typeof mirrorIdentity === "string" && mirrorIdentity.startsWith("codex-app-server:")) &&
        Number.isFinite(timestamp) &&
        timestamp > (Number.isFinite(cutoff) ? cutoff : 0)
      );
    });
  };
  const applyResumeStaleBindingContinuityProjection = (binding) => {
    const newerVisibleMessages = selectNewerVisibleHistoryAfterBinding(binding);
    if (newerVisibleMessages.length === 0) return false;
    const projection = projectContextEngineAssemblyForCodex({
      assembledMessages: newerVisibleMessages,
      originalHistoryMessages: historyState.messages,
      prompt: params.prompt,
      maxRenderedContextChars: codexContextProjectionMaxChars,
    });
    promptState.promptText = projection.promptText;
    promptState.promptContextRange = projection.promptContextRange;
    promptState.prePromptMessageCount = projection.prePromptMessageCount;
    return true;
  };
  const precomputeNoContextEngineStaleBindingProjection = () => {
    promptState.precomputedStaleBindingContinuityProjectionApplied = false;
    promptState.staleBindingContinuityForcedFreshStart = false;
    const binding = mutable.startupBinding;
    if (activeContextEngine || !binding?.threadId || binding.pendingSupervisionBranch) return false;
    if (isInactiveThreadBootstrapBinding(binding)) {
      promptState.inactiveThreadBootstrapBindingForcedFreshStart = true;
      return false;
    }
    const projected = applyResumeStaleBindingContinuityProjection(binding);
    promptState.precomputedStaleBindingContinuityProjectionApplied = projected;
    return projected;
  };
  const applyNoContextEngineContinuityProjection = (action, binding) => {
    if (activeContextEngine || !historyState.messages.some((message) => message.role === "user"))
      return false;
    if (action === "resumed" && promptState.precomputedStaleBindingContinuityProjectionApplied)
      return true;
    if (action === "started" && promptState.staleBindingContinuityForcedFreshStart) return true;
    if (action === "started" && promptState.inactiveThreadBootstrapBindingForcedFreshStart)
      return false;
    if (action === "resumed" && binding)
      return applyResumeStaleBindingContinuityProjection(binding);
    if (action === "started") {
      applyFreshThreadContinuityProjection();
      return true;
    }
    return false;
  };
  if (precomputeNoContextEngineStaleBindingProjection())
    await rebuildCodexPromptBuildFromCurrentProjection();
  const rotateStartupBindingForProjectedTurn = async () => {
    const binding = mutable.startupBinding;
    if (!binding?.threadId) return;
    const previousThreadId = binding.threadId;
    const hadInactiveThreadBootstrapBinding = isInactiveThreadBootstrapBinding(binding);
    mutable.startupBinding = await rotateOversizedCodexAppServerStartupBinding({
      binding,
      bindingStore,
      identity: bindingIdentity,
      sessionFile: params.sessionFile,
      agentDir,
      codexHome: appServer.start.env?.CODEX_HOME,
      config: params.config,
      contextEngineActive: Boolean(activeContextEngine),
      projectedTurnTokens: estimateCodexAppServerProjectedTurnTokens({
        prompt: turnState.codexTurnPromptText,
        developerInstructions: buildRenderedCodexDeveloperInstructions(),
      }),
    });
    if (mutable.startupBinding?.threadId) return;
    promptState.inactiveThreadBootstrapBindingForcedFreshStart = hadInactiveThreadBootstrapBinding;
    promptState.staleBindingContinuityForcedFreshStart =
      promptState.precomputedStaleBindingContinuityProjectionApplied &&
      !promptState.inactiveThreadBootstrapBindingForcedFreshStart;
    if (promptState.staleBindingContinuityForcedFreshStart) applyFreshThreadContinuityProjection();
    if (activeContextEngine) {
      promptState.contextEngineProjection = void 0;
      try {
        await applyActiveContextEngineProjection(void 0);
      } catch (assembleErr) {
        log.warn("context engine assemble failed; using Codex baseline prompt", {
          error: formatErrorMessage(assembleErr),
        });
      }
    }
    await rebuildCodexPromptBuildFromCurrentProjection();
    log.info("codex app-server rebuilt turn prompt after native thread rotation", {
      sessionId: params.sessionId,
      sessionKey: contextSessionKey,
      previousThreadId,
      promptChars: turnState.codexTurnPromptText.length,
      developerInstructionChars: buildRenderedCodexDeveloperInstructions()?.length ?? 0,
    });
  };
  await rotateStartupBindingForProjectedTurn();
  return {
    context,
    codexModelInputHistoryMessages,
    turnState,
    buildRenderedCodexDeveloperInstructions,
    rebuildCodexTurnPromptTextFromCurrentProjection,
    applyNoContextEngineContinuityProjection,
    systemPromptReport: buildCodexSystemPromptReport({
      attempt: params,
      sessionKey: contextSessionKey,
      workspaceDir: effectiveWorkspace,
      developerInstructions: buildRenderedCodexDeveloperInstructions(),
      workspaceBootstrapContext,
      skillsPrompt: skillsCollaborationInstructions ? (params.skillsSnapshot?.prompt ?? "") : "",
      tools: toolBridge.availableSpecs,
    }),
  };
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-notification.ts
const CODEX_SUBAGENT_NOTIFICATION_START = "<subagent_notification>";
const CODEX_SUBAGENT_NOTIFICATION_END = "</subagent_notification>";
/** Extracts trusted subagent completion payloads from a Codex server notification. */
function extractCodexNativeSubagentCompletions(notification) {
  const params = isJsonObject(notification.params) ? notification.params : void 0;
  if (!params) return [];
  const item = isJsonObject(params.item) ? params.item : void 0;
  if (!item) return [];
  const text = readTrustedInterAgentCommunicationContent(item);
  if (!text) return [];
  const author = readTrustedInterAgentCommunicationAuthor(item);
  return extractCodexNativeSubagentCompletionsFromText(text).filter(
    (completion) => completion.agentPath === author,
  );
}
/** Parses one or more tagged subagent completion payloads from commentary text. */
function extractCodexNativeSubagentCompletionsFromText(text) {
  const completions = [];
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf(CODEX_SUBAGENT_NOTIFICATION_START, cursor);
    if (start < 0) break;
    const bodyStart = start + 23;
    const end = text.indexOf(CODEX_SUBAGENT_NOTIFICATION_END, bodyStart);
    if (end < 0) break;
    const parsed = parseCodexNativeSubagentNotificationBody(text.slice(bodyStart, end));
    if (parsed) completions.push(parsed);
    cursor = end + 24;
  }
  return completions;
}
const codexNativeSubagentNotifications = {
  fromNotification: extractCodexNativeSubagentCompletions,
  fromText: extractCodexNativeSubagentCompletionsFromText,
};
function parseCodexNativeSubagentNotificationBody(body) {
  let payload;
  try {
    payload = JSON.parse(body.trim());
  } catch {
    return;
  }
  if (!isJsonObject(payload)) return;
  const agentPath = readString$2(payload, "agent_path")?.trim();
  const status = isJsonObject(payload.status) ? payload.status : void 0;
  if (!agentPath || !status) return;
  const statusEntry = readCompletionStatus(status);
  if (!statusEntry) return;
  return {
    agentPath,
    status: statusEntry.status,
    statusLabel: statusEntry.label,
    result: statusEntry.result,
  };
}
function readCompletionStatus(status) {
  for (const [rawKey, value] of Object.entries(status)) {
    const mappedStatus = mapCompletionStatus(normalizeStatusKey(rawKey));
    if (!mappedStatus) continue;
    const result = stringifyResult(value, mappedStatus);
    return {
      status: mappedStatus,
      label:
        mappedStatus === "succeeded" && result.kind === "no_final_assistant_message"
          ? "completed_without_final_message"
          : rawKey,
      result: result.text,
    };
  }
}
function mapCompletionStatus(value) {
  if (value === "completed" || value === "succeeded" || value === "success") return "succeeded";
  if (
    value === "cancelled" ||
    value === "canceled" ||
    value === "interrupted" ||
    value === "shutdown"
  )
    return "cancelled";
  if (
    value === "failed" ||
    value === "error" ||
    value === "errored" ||
    value === "systemerror" ||
    value === "notfound"
  )
    return "failed";
}
function stringifyResult(value, status) {
  if (typeof value === "string") {
    const text = value.trim();
    if (text) return { text };
    return status === "succeeded"
      ? completedWithoutFinalAssistantMessage()
      : { text: "(no output)" };
  }
  if (value === null || value === void 0)
    return status === "succeeded"
      ? completedWithoutFinalAssistantMessage()
      : { text: "(no output)" };
  try {
    return { text: JSON.stringify(value) };
  } catch {
    return { text: "(unserializable output)" };
  }
}
function completedWithoutFinalAssistantMessage() {
  return {
    text: "Codex native subagent completed without a final assistant message.",
    kind: "no_final_assistant_message",
  };
}
function readTrustedInterAgentCommunicationContent(item) {
  const communication = readTrustedInterAgentCommunication(item);
  return typeof communication?.content === "string" ? communication.content : void 0;
}
function readTrustedInterAgentCommunicationAuthor(item) {
  const communication = readTrustedInterAgentCommunication(item);
  return typeof communication?.author === "string" ? communication.author : void 0;
}
function readTrustedInterAgentCommunication(item) {
  if (
    readString$2(item, "type") !== "message" ||
    readString$2(item, "role") !== "assistant" ||
    readString$2(item, "phase") !== "commentary"
  )
    return;
  const text = extractSingleTextPart(item);
  if (!text) return;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return;
  }
  if (!isJsonObject(parsed)) return;
  if (
    typeof parsed.author !== "string" ||
    typeof parsed.recipient !== "string" ||
    typeof parsed.content !== "string" ||
    parsed.trigger_turn !== false
  )
    return;
  return parsed;
}
function extractSingleTextPart(item) {
  const content = item.content;
  if (!Array.isArray(content) || content.length !== 1) return;
  const [entry] = content;
  if (!isJsonObject(entry)) return;
  const type = readString$2(entry, "type");
  if (type !== "output_text" && type !== "text") return;
  return readString$2(entry, "text")?.trim();
}
function readString$2(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : void 0;
}
function normalizeStatusKey(value) {
  return value.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-task-ids.ts
/**
 * Shared identifiers for representing Codex native subagents as OpenClaw task
 * runtime rows.
 */
/** Task runtime namespace for Codex native subagent task rows. */
const CODEX_NATIVE_SUBAGENT_RUNTIME = "subagent";
/** Task kind used to distinguish native Codex subagents from other subagent runtimes. */
const CODEX_NATIVE_SUBAGENT_TASK_KIND = "codex-native";
/** Run id prefix for task rows keyed by Codex child thread ids. */
const CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX = "codex-thread:";
//#endregion
//#region extensions/codex/src/app-server/native-subagent-task-mirror.ts
/** Projects Codex thread and collab-agent notifications into task lifecycle updates. */
var CodexNativeSubagentTaskMirror = class {
  constructor(params, runtime) {
    this.params = params;
    this.runtime = runtime;
    this.mirrorStateByThreadId = /* @__PURE__ */ new Map();
    this.terminalRunIds = /* @__PURE__ */ new Set();
    this.authoritativeRunIds = /* @__PURE__ */ new Set();
    this.expectedAuthoritativeRunIds = /* @__PURE__ */ new Set();
    this.now = params.now ?? Date.now;
  }
  markAuthoritativeCompletion(childThreadId) {
    const runId = codexNativeSubagentRunId(childThreadId);
    this.authoritativeRunIds.add(runId);
    this.terminalRunIds.add(runId);
  }
  markAuthoritativeCompletionExpected(childThreadId) {
    this.expectedAuthoritativeRunIds.add(codexNativeSubagentRunId(childThreadId));
  }
  handleNotification(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    if (!params) return;
    if (notification.method === "thread/started") {
      this.handleThreadStarted(params);
      return;
    }
    if (notification.method === "thread/status/changed") {
      this.handleThreadStatusChanged(params);
      return;
    }
    if (notification.method === "item/started" || notification.method === "item/completed") {
      const item = isJsonObject(params.item) ? params.item : void 0;
      if (
        notification.method === "item/completed" &&
        item &&
        readString$1(item, "type") === "subAgentActivity"
      ) {
        this.handleSubagentActivityItem(params);
        return;
      }
      this.handleCollabAgentItem(params);
    }
  }
  handleThreadStarted(params) {
    const notification = readThreadStartedNotification(params);
    if (!notification) return;
    const thread = notification.thread;
    const spawn = readSubagentThreadSpawnSource(thread.source, this.params.parentThreadId);
    if (!spawn) return;
    const threadId = thread.id.trim();
    const label =
      trimOptional(spawn.agent_nickname) ??
      trimOptional(thread.agentNickname) ??
      trimOptional(spawn.agent_role) ??
      trimOptional(thread.agentRole) ??
      "Codex subagent";
    const task =
      trimOptional(thread.preview) ??
      `Codex native subagent${label === "Codex subagent" ? "" : ` ${label}`}`;
    const createdAt = secondsToMillis(thread.createdAt) ?? this.now();
    if (
      !this.createRunningTask({
        threadId,
        label,
        task,
        startedAt: createdAt,
        progressSummary: "Codex native subagent started.",
      })
    )
      return;
    this.applyStatus(threadId, thread.status);
  }
  handleThreadStatusChanged(params) {
    const notification = readThreadStatusChangedNotification(params);
    if (!notification) return;
    this.applyStatus(notification.threadId, notification.status);
  }
  applyStatus(threadId, status) {
    if (this.mirrorStateByThreadId.get(threadId) === "failed") return;
    const statusType = status?.type;
    if (!statusType) return;
    const runId = codexNativeSubagentRunId(threadId);
    if (this.authoritativeRunIds.has(runId)) return;
    if (this.terminalRunIds.has(runId) && statusType !== "systemError") return;
    const eventAt = this.now();
    if (statusType === "active") {
      this.runtime.recordTaskRunProgressByRunId({
        runId,
        lastEventAt: eventAt,
        progressSummary: "Codex native subagent is active.",
      });
      return;
    }
    if (statusType === "idle") {
      this.runtime.recordTaskRunProgressByRunId({
        runId,
        lastEventAt: eventAt,
        progressSummary: "Codex native subagent is idle.",
      });
      return;
    }
    if (statusType === "systemError") {
      if (this.expectedAuthoritativeRunIds.has(runId)) {
        this.terminalRunIds.delete(runId);
        this.runtime.recordTaskRunProgressByRunId({
          runId,
          lastEventAt: eventAt,
          progressSummary: "Codex native subagent hit a system error; awaiting recovery.",
        });
        return;
      }
      this.terminalRunIds.add(runId);
      this.runtime.finalizeTaskRunByRunId({
        runId,
        status: "failed",
        endedAt: eventAt,
        lastEventAt: eventAt,
        error: "Codex app-server reported a system error for the native subagent thread.",
        progressSummary: "Codex native subagent hit a system error.",
        terminalSummary: "Codex native subagent failed.",
      });
      return;
    }
    if (statusType === "notLoaded")
      this.runtime.recordTaskRunProgressByRunId({
        runId,
        lastEventAt: eventAt,
        progressSummary: "Codex native subagent is not loaded.",
      });
  }
  handleCollabAgentItem(params) {
    const item = isJsonObject(params.item) ? params.item : void 0;
    if (!item || readString$1(item, "type") !== "collabAgentToolCall") return;
    if (
      (readString$1(item, "senderThreadId") ?? readString$1(params, "threadId")) !==
      this.params.parentThreadId
    )
      return;
    const isSpawnAgentTool = normalizeToolName(readString$1(item, "tool")) === "spawnagent";
    const receiverThreadIds = readStringArray$1(item.receiverThreadIds);
    const agentsStates = readAgentsStates(item.agentsStates);
    const spawnChildThreadIds = /* @__PURE__ */ new Set([
      ...receiverThreadIds,
      ...agentsStates.keys(),
    ]);
    if (isSpawnAgentTool)
      for (const childThreadId of spawnChildThreadIds)
        this.createTaskFromCollabSpawnItem(childThreadId, item);
    const toolCallStatus = normalizeCollabToolCallStatus(readString$1(item, "status"));
    const terminalToolCallThreadIds = /* @__PURE__ */ new Set();
    if (isSpawnAgentTool && isBlockedOrFailedCollabToolCallStatus(toolCallStatus)) {
      for (const threadId of spawnChildThreadIds) terminalToolCallThreadIds.add(threadId);
      for (const threadId of agentsStates.keys()) terminalToolCallThreadIds.add(threadId);
    }
    const terminalAgentStateThreadIds = /* @__PURE__ */ new Set();
    for (const [threadId, state] of agentsStates) {
      const normalizedStatus = normalizeAgentStateStatus(state.status);
      if (
        terminalToolCallThreadIds.has(threadId) &&
        isNonTerminalAgentStateStatus(normalizedStatus)
      )
        continue;
      this.applyCollabAgentStatus(threadId, normalizedStatus, state.message);
      if (isTerminalAgentStateStatus(normalizedStatus)) terminalAgentStateThreadIds.add(threadId);
    }
    if (isBlockedOrFailedCollabToolCallStatus(toolCallStatus))
      for (const threadId of terminalToolCallThreadIds) {
        if (terminalAgentStateThreadIds.has(threadId)) continue;
        const state = agentsStates.get(threadId);
        this.applyCollabAgentStatus(threadId, toolCallStatus, state?.message);
      }
  }
  handleSubagentActivityItem(params) {
    const item = isJsonObject(params.item) ? params.item : void 0;
    if (
      !item ||
      readString$1(item, "type") !== "subAgentActivity" ||
      readString$1(params, "threadId") !== this.params.parentThreadId
    )
      return;
    const threadId = trimOptional(readString$1(item, "agentThreadId"));
    const kind = normalizeSubagentActivityKind(readString$1(item, "kind"));
    if (!threadId || !kind) return;
    if (kind === "started") {
      this.createTaskFromSubagentActivity(threadId, trimOptional(readString$1(item, "agentPath")));
      return;
    }
    if (this.mirrorStateByThreadId.get(threadId) !== "mirrored") return;
    const message =
      kind === "interacted"
        ? "Codex native subagent received more input."
        : "Codex native subagent was interrupted.";
    this.applyCollabAgentStatus(
      threadId,
      kind === "interacted" ? "running" : "interrupted",
      message,
    );
  }
  createTaskFromSubagentActivity(threadId, agentPath) {
    const eventAt = this.now();
    this.createRunningTask({
      threadId,
      label: "Codex subagent",
      task: agentPath ? `Codex native subagent ${agentPath}` : "Codex native subagent",
      startedAt: eventAt,
      progressSummary: "Codex native subagent started.",
    });
  }
  createTaskFromCollabSpawnItem(threadId, item) {
    const prompt = trimOptional(readString$1(item, "prompt"));
    const createdAt = this.now();
    this.createRunningTask({
      threadId,
      label: "Codex subagent",
      task: prompt ?? "Codex native subagent",
      startedAt: createdAt,
      progressSummary: "Codex native subagent spawned.",
    });
  }
  createRunningTask(params) {
    const threadId = params.threadId.trim();
    if (!threadId || this.mirrorStateByThreadId.get(threadId) === "mirrored") return false;
    this.mirrorStateByThreadId.set(threadId, "mirrored");
    const runId = codexNativeSubagentRunId(threadId);
    if (
      !this.runtime.tryCreateRunningTaskRun({
        sourceId: runId,
        agentId: this.params.agentId,
        runId,
        label: params.label,
        task: params.task,
        notifyPolicy: "silent",
        deliveryStatus: "not_applicable",
        preferMetadata: true,
        startedAt: params.startedAt,
        lastEventAt: this.now(),
        progressSummary: params.progressSummary,
      })
    ) {
      this.mirrorStateByThreadId.set(threadId, "failed");
      return false;
    }
    this.terminalRunIds.delete(runId);
    this.authoritativeRunIds.delete(runId);
    return true;
  }
  applyCollabAgentStatus(threadId, status, message) {
    if (this.mirrorStateByThreadId.get(threadId) === "failed") return;
    const normalizedStatus = normalizeAgentStateStatus(status);
    if (!normalizedStatus) return;
    const runId = codexNativeSubagentRunId(threadId);
    if (this.authoritativeRunIds.has(runId)) return;
    if (this.terminalRunIds.has(runId) && isNonTerminalAgentStateStatus(normalizedStatus)) return;
    const eventAt = this.now();
    if (normalizedStatus === "pendingInit" || normalizedStatus === "running") {
      this.runtime.recordTaskRunProgressByRunId({
        runId,
        lastEventAt: eventAt,
        progressSummary:
          trimOptional(message) ??
          (normalizedStatus === "pendingInit"
            ? "Codex native subagent is initializing."
            : "Codex native subagent is running."),
      });
      return;
    }
    if (normalizedStatus === "completed") {
      this.terminalRunIds.add(runId);
      const summary = trimOptional(message) ?? "Codex native subagent completed.";
      if (this.expectedAuthoritativeRunIds.has(runId))
        this.runtime.recordTaskRunProgressByRunId({
          runId,
          lastEventAt: eventAt,
          progressSummary: summary,
        });
      else
        this.runtime.finalizeTaskRunByRunId({
          runId,
          status: "succeeded",
          endedAt: eventAt,
          lastEventAt: eventAt,
          progressSummary: summary,
          terminalSummary: summary,
        });
      return;
    }
    if (normalizedStatus === "blocked") {
      this.terminalRunIds.add(runId);
      this.runtime.finalizeTaskRunByRunId({
        runId,
        status: "succeeded",
        endedAt: eventAt,
        lastEventAt: eventAt,
        progressSummary: trimOptional(message) ?? "Codex native subagent blocked.",
        terminalSummary: trimOptional(message) ?? "Codex native subagent blocked.",
        terminalOutcome: "blocked",
      });
      return;
    }
    this.terminalRunIds.add(runId);
    this.runtime.finalizeTaskRunByRunId({
      runId,
      status:
        normalizedStatus === "interrupted" || normalizedStatus === "shutdown"
          ? "cancelled"
          : "failed",
      endedAt: eventAt,
      lastEventAt: eventAt,
      error: trimOptional(message) ?? `Codex native subagent status: ${normalizedStatus}`,
      progressSummary: trimOptional(message) ?? `Codex native subagent ${normalizedStatus}.`,
      terminalSummary: trimOptional(message) ?? "Codex native subagent did not complete.",
    });
  }
};
/** Converts a Codex child thread id into the OpenClaw task-runtime run id. */
function codexNativeSubagentRunId(threadId) {
  return `${CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX}${threadId.trim()}`;
}
/** Reads a subagent thread-spawn source only when it belongs to the expected parent thread. */
function readSubagentThreadSpawnSource(source, parentThreadId) {
  if (!source || typeof source !== "object" || !("subAgent" in source)) return;
  const subAgent = source.subAgent;
  if (!subAgent || typeof subAgent !== "object" || !("thread_spawn" in subAgent)) return;
  const spawn = subAgent.thread_spawn;
  if (!spawn || typeof spawn !== "object") return;
  return spawn.parent_thread_id === parentThreadId ? spawn : void 0;
}
function readThreadStartedNotification(params) {
  const thread = params.thread;
  if (!isJsonObject(thread) || typeof thread.id !== "string") return;
  return { thread };
}
function readThreadStatusChangedNotification(params) {
  if (typeof params.threadId !== "string") return;
  const status = params.status;
  if (!isJsonObject(status) || !isCodexThreadStatusType(status.type)) return;
  return {
    threadId: params.threadId,
    status,
  };
}
function isCodexThreadStatusType(value) {
  return value === "notLoaded" || value === "idle" || value === "systemError" || value === "active";
}
function readAgentsStates(value) {
  const states = /* @__PURE__ */ new Map();
  if (!isJsonObject(value)) return states;
  for (const [threadId, rawState] of Object.entries(value)) {
    if (!isJsonObject(rawState)) continue;
    const status = readString$1(rawState, "status");
    const message = readNullableString(rawState, "message");
    states.set(threadId, {
      status,
      message,
    });
  }
  return states;
}
function readStringArray$1(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readString$1(value, key) {
  const entry = value[key];
  return typeof entry === "string" ? entry : void 0;
}
function readNullableString(value, key) {
  const entry = value[key];
  return typeof entry === "string" || entry === null ? entry : void 0;
}
function normalizeToolName(value) {
  return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
function normalizeSubagentActivityKind(value) {
  const key = value?.replace(/[^a-z]/giu, "").toLowerCase();
  return key === "started" || key === "interacted" || key === "interrupted" ? key : void 0;
}
function normalizeCollabToolCallStatus(value) {
  const key = value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
  if (key === "completed" || key === "succeeded" || key === "success") return "completed";
  if (key === "failed" || key === "error" || key === "errored") return "failed";
  if (key === "blocked" || key === "declined") return "blocked";
  if (key === "inprogress" || key === "running") return "running";
  return value?.trim();
}
function isBlockedOrFailedCollabToolCallStatus(value) {
  return value === "failed" || value === "blocked";
}
function isNonTerminalAgentStateStatus(value) {
  return value === "pendingInit" || value === "running";
}
function isTerminalAgentStateStatus(value) {
  return value !== void 0 && !isNonTerminalAgentStateStatus(value);
}
function normalizeAgentStateStatus(value) {
  const key = value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
  if (!key) return;
  if (key === "pendinginit") return "pendingInit";
  if (key === "inprogress" || key === "running") return "running";
  if (key === "completed" || key === "succeeded" || key === "success") return "completed";
  if (key === "interrupted" || key === "cancelled" || key === "canceled" || key === "shutdown")
    return key === "shutdown" ? "shutdown" : "interrupted";
  if (key === "failed" || key === "error" || key === "systemerror") return "failed";
  if (key === "blocked" || key === "declined") return "blocked";
  return value?.trim();
}
function secondsToMillis(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  return value * 1e3;
}
function trimOptional(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-monitor.ts
/**
 * Mirrors Codex native subagent lifecycle and completion into OpenClaw task
 * runtime records, with app-server history as the recovery source.
 */
const DEFAULT_RECOVERY_POLL_DELAYS_MS = [2e3, 5e3, 1e4, 15e3, 3e4, 6e4, 12e4, 3e5];
const DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS = [5e3, 15e3, 3e4, 6e4, 12e4, 3e5];
const RECENT_TERMINAL_TASK_RECONCILE_GRACE_MS = 6e4;
const THREAD_READ_TIMEOUT_MS = 3e4;
const NATIVE_SUBAGENT_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
  "thread/started",
  "thread/status/changed",
  "turn/started",
  "turn/completed",
  "item/agentMessage/delta",
  "item/started",
  "item/completed",
  "rawResponseItem/completed",
]);
const RECOVERY_REVISION_NOTIFICATION_METHODS = /* @__PURE__ */ new Set([
  "thread/started",
  "thread/status/changed",
  "turn/started",
  "turn/completed",
]);
const defaultRuntime = {
  createAgentHarnessTaskRuntime,
  deliverAgentHarnessTaskCompletion,
};
const monitors = /* @__PURE__ */ new WeakMap();
const completionDeliveryOwners = /* @__PURE__ */ new Map();
function registerMonitor(params) {
  let monitor = monitors.get(params.client);
  if (!monitor) {
    monitor = new Monitor(params.client, params.runtime ?? defaultRuntime, {
      retainClient: params.retainClient,
    });
    monitors.set(params.client, monitor);
  }
  return monitor.registerParent({
    parentThreadId: params.parentThreadId,
    requesterSessionKey: params.requesterSessionKey,
    taskRuntimeScope: params.taskRuntimeScope,
    agentId: params.agentId,
  });
}
var Monitor = class {
  constructor(client, runtime = defaultRuntime, options = {}) {
    this.client = client;
    this.runtime = runtime;
    this.parentStates = /* @__PURE__ */ new Map();
    this.childStates = /* @__PURE__ */ new Map();
    this.childThreadIdsByAgentPath = /* @__PURE__ */ new Map();
    this.taskReconciliations = /* @__PURE__ */ new Map();
    this.taskReconciliationTimers = /* @__PURE__ */ new Map();
    this.threadStatusRevisions = /* @__PURE__ */ new Map();
    this.disposed = false;
    this.recoveryPollDelaysMs = options.recoveryPollDelaysMs ?? DEFAULT_RECOVERY_POLL_DELAYS_MS;
    this.completionDeliveryRetryDelaysMs =
      options.completionDeliveryRetryDelaysMs ?? DEFAULT_COMPLETION_DELIVERY_RETRY_DELAYS_MS;
    this.completionDeliveryMaxRetries =
      options.completionDeliveryMaxRetries ?? this.completionDeliveryRetryDelaysMs.length;
    this.now = options.now ?? Date.now;
    this.retainClient = options.retainClient;
    this.removeNotificationHandler = client.addNotificationHandler(async (notification) => {
      if (!NATIVE_SUBAGENT_NOTIFICATION_METHODS.has(notification.method)) return;
      await this.handleNotification(notification);
    });
    this.removeCloseHandler = client.addCloseHandler(() => this.dispose());
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.removeNotificationHandler();
    this.removeCloseHandler();
    for (const timer of this.taskReconciliationTimers.values()) clearTimeout(timer);
    this.taskReconciliationTimers.clear();
    for (const childState of this.childStates.values()) {
      if (childState.terminal && childState.pendingCompletion) {
        this.clearRecoveryTimers(childState);
        continue;
      }
      this.unregisterChild(childState);
    }
    this.releaseRetainedClient();
    for (const state of this.parentStates.values()) state.ownerCount = 0;
    for (const [parentThreadId] of this.parentStates)
      if (
        ![...this.childStates.values()].some(
          (childState) => childState.parentThreadId === parentThreadId,
        )
      )
        this.parentStates.delete(parentThreadId);
  }
  registerParent(params) {
    const parentThreadId = params.parentThreadId.trim();
    if (!parentThreadId)
      throw new Error("Codex native subagent monitor requires a parent thread id");
    if (this.disposed) throw new Error("Codex native subagent monitor is closed");
    let state = this.parentStates.get(parentThreadId);
    if (
      state?.requesterSessionKey &&
      params.requesterSessionKey &&
      state.requesterSessionKey !== params.requesterSessionKey
    )
      throw new Error(`Codex thread ${parentThreadId} is already bound to another session`);
    if (!state) {
      state = {
        parentThreadId,
        ownerCount: 0,
      };
      this.parentStates.set(parentThreadId, state);
    }
    state.ownerCount += 1;
    state.requesterSessionKey ??= params.requesterSessionKey;
    state.taskRuntimeScope ??= params.taskRuntimeScope;
    state.agentId ??= params.agentId;
    this.prepareParentTaskRuntime(state);
    for (const childState of this.childStates.values())
      if (childState.parentThreadId === parentThreadId && childState.pendingCompletion)
        this.deliverPendingCompletion(state, childState);
    let registered = true;
    const registeredState = state;
    this.reconcileTaskRowsForParent(registeredState).catch((error) => {
      log.warn("Failed to reconcile Codex native subagent task rows", {
        parentThreadId,
        error: formatErrorMessage(error),
      });
    });
    return {
      unregister: () => {
        if (!registered) return;
        registered = false;
        const current = this.parentStates.get(parentThreadId);
        if (current) {
          current.ownerCount -= 1;
          this.pruneParentIfUnused(current);
        }
      },
    };
  }
  prepareParentTaskRuntime(state) {
    if (!state.requesterSessionKey || !state.taskRuntimeScope) return;
    state.taskRuntime ??= this.runtime.createAgentHarnessTaskRuntime({
      runtime: CODEX_NATIVE_SUBAGENT_RUNTIME,
      taskKind: CODEX_NATIVE_SUBAGENT_TASK_KIND,
      scope: state.taskRuntimeScope,
      runIdPrefix: CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX,
    });
    state.mirror ??= new CodexNativeSubagentTaskMirror(
      {
        parentThreadId: state.parentThreadId,
        requesterSessionKey: state.requesterSessionKey,
        agentId: state.agentId,
      },
      state.taskRuntime,
    );
  }
  /** Handles one notification from the client-wide router observer. */
  async handleNotification(notification) {
    if (this.disposed) return;
    const state = this.resolveMirrorState(notification);
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    const startedThread = isJsonObject(params?.thread) ? params.thread : void 0;
    const threadId =
      readString(params, "threadId")?.trim() ?? readString(startedThread, "id")?.trim();
    const threadStatus = isJsonObject(params?.status)
      ? normalizeIdentifier(readString(params.status, "type"))
      : void 0;
    const tracksRecoveryRevision = Boolean(threadId && this.threadStatusRevisions.has(threadId));
    if (
      RECOVERY_REVISION_NOTIFICATION_METHODS.has(notification.method) &&
      threadId &&
      tracksRecoveryRevision
    )
      this.threadStatusRevisions.get(threadId).value += 1;
    if (
      !state &&
      (!threadId ||
        (!this.parentStates.has(threadId) &&
          !this.childStates.has(threadId) &&
          !tracksRecoveryRevision))
    )
      return;
    if (state?.mirror)
      try {
        state.mirror.handleNotification(notification);
      } catch (error) {
        log.warn("Failed to mirror Codex native subagent lifecycle event", {
          method: notification.method,
          error: formatErrorMessage(error),
        });
      }
    const childState = threadId ? this.childStates.get(threadId) : void 0;
    if (notification.method === "turn/started" && childState) this.resumeChild(childState);
    this.captureChildAssistantMessage(notification);
    await this.handleChildTurnCompletion(notification);
    if (notification.method === "thread/status/changed" && threadId && threadStatus)
      if (threadStatus !== "systemerror") {
        if (childState) this.clearSystemErrorFallback(childState);
      } else {
        if (childState) {
          this.resumeChild(childState, { scheduleRecovery: false });
          this.setRecoveryFallback(
            childState,
            systemErrorFallbackCompletion(childState.childThreadId),
            this.now(),
          );
        }
        this.reconcileChildThread(threadId)
          .catch((error) => {
            this.logRecoveryFailure(threadId, error);
            return false;
          })
          .then((reconciled) => {
            if (!reconciled && childState && this.childStates.get(threadId) === childState)
              this.scheduleRecoveryPoll(childState);
          });
      }
    await this.handleCompletionNotification(notification);
  }
  resumeChild(childState, options = {}) {
    if (childState.terminal) return;
    this.observeActiveChild(childState);
    this.clearRecoveryTimers(childState);
    childState.recoveryAttempt = 0;
    if (options.scheduleRecovery !== false) this.scheduleRecoveryPoll(childState);
  }
  observeActiveChild(childState) {
    childState.settledWithoutCompletion = false;
    childState.fallbackCompletion = void 0;
    this.releaseClientRetention ??= this.retainClient?.();
  }
  settleResumableChild(childState) {
    if (childState.terminal) return;
    childState.settledWithoutCompletion = true;
    childState.fallbackCompletion = void 0;
    this.clearRecoveryTimers(childState);
    this.releaseClientRetentionIfIdle();
  }
  captureChildAssistantMessage(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    const childThreadId = readString(params, "threadId")?.trim();
    const childState = childThreadId ? this.childStates.get(childThreadId) : void 0;
    if (!childState || childState.terminal) return;
    if (notification.method === "item/agentMessage/delta") {
      const turnId = readString(params, "turnId");
      const itemId = readString(params, "itemId");
      const delta = readString(params, "delta");
      if (turnId && itemId && delta)
        this.recordChildAssistantMessage(childState, turnId, itemId, delta);
      return;
    }
    if (notification.method !== "item/started" && notification.method !== "item/completed") return;
    this.captureChildAssistantMessageItem(
      childState,
      readString(params, "turnId"),
      isJsonObject(params?.item) ? params.item : void 0,
    );
  }
  captureChildAssistantMessageItem(childState, turnId, item) {
    if (readString(item, "type") !== "agentMessage" || !turnId) return;
    const itemId = readString(item, "id");
    if (!itemId) return;
    const messages = this.getChildAssistantMessages(childState, turnId);
    if (readString(item, "phase") === "commentary") messages.commentaryIds.add(itemId);
    else messages.finalMessageIds.add(itemId);
    const text = readString(item, "text");
    if (text) this.recordChildAssistantMessage(childState, turnId, itemId, text, { replace: true });
  }
  captureChildTurnAssistantMessages(childState, turn) {
    const turnId = readString(turn, "id");
    if (!turnId || !Array.isArray(turn.items)) return;
    for (const item of turn.items)
      this.captureChildAssistantMessageItem(childState, turnId, isJsonObject(item) ? item : void 0);
  }
  recordChildAssistantMessage(childState, turnId, itemId, text, options = {}) {
    const messages = this.getChildAssistantMessages(childState, turnId);
    if (!messages.texts.has(itemId)) messages.order.push(itemId);
    const existing = messages.texts.get(itemId) ?? "";
    messages.texts.set(itemId, options.replace ? text : `${existing}${text}`);
  }
  getChildAssistantMessages(childState, turnId) {
    let messages = childState.assistantMessagesByTurn.get(turnId);
    if (!messages) {
      messages = {
        texts: /* @__PURE__ */ new Map(),
        order: [],
        commentaryIds: /* @__PURE__ */ new Set(),
        finalMessageIds: /* @__PURE__ */ new Set(),
      };
      childState.assistantMessagesByTurn.set(turnId, messages);
    }
    return messages;
  }
  async handleChildTurnCompletion(notification) {
    if (notification.method !== "turn/completed") return;
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    const childThreadId = readString(params, "threadId")?.trim();
    const childState = childThreadId ? this.childStates.get(childThreadId) : void 0;
    const state = childState ? this.parentStates.get(childState.parentThreadId) : void 0;
    const turn = isJsonObject(params?.turn) ? params.turn : void 0;
    if (!state || !childState || !turn || childState.terminal) return;
    const turnId = readString(turn, "id");
    if (normalizeIdentifier(readString(turn, "status")) === "interrupted") {
      if (turnId) childState.assistantMessagesByTurn.delete(turnId);
      this.settleResumableChild(childState);
      return;
    }
    this.captureChildTurnAssistantMessages(childState, turn);
    const completion = toChildTurnCompletion(childState, turn);
    if (!completion) return;
    await this.processObservedCompletion(state, childState, completion);
  }
  /** Reads one child through app-server history and delivers a terminal result when present. */
  async reconcileChildThread(childThreadIdInput) {
    const childState = this.childStates.get(childThreadIdInput.trim());
    if (!childState || childState.terminal || this.disposed) return false;
    if (childState.recoveryInFlight) return await childState.recoveryInFlight;
    const recovery = this.reconcileChildState(childState);
    childState.recoveryInFlight = recovery;
    try {
      return await recovery;
    } finally {
      if (childState.recoveryInFlight === recovery) childState.recoveryInFlight = void 0;
    }
  }
  resolveMirrorState(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    if (!params) return;
    if (notification.method === "thread/started") {
      const thread = isJsonObject(params.thread) ? params.thread : void 0;
      const parentThreadId = readThreadParentThreadId(thread);
      const childThreadId = thread ? readString(thread, "id")?.trim() : void 0;
      const agentPath = readString(readThreadSpawnSource(thread), "agent_path")?.trim();
      const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
      if (state && childThreadId && parentThreadId)
        return this.registerChildThread(
          parentThreadId,
          childThreadId,
          agentPath === void 0 ? {} : { agentPath },
        )
          ? state
          : void 0;
      return state;
    }
    if (
      notification.method === "thread/status/changed" ||
      notification.method === "turn/started" ||
      notification.method === "turn/completed" ||
      notification.method === "item/agentMessage/delta"
    ) {
      const childThreadId = readString(params, "threadId")?.trim();
      const parentThreadId = childThreadId
        ? this.childStates.get(childThreadId)?.parentThreadId
        : void 0;
      return parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
    }
    if (notification.method === "item/started" || notification.method === "item/completed") {
      const item = isJsonObject(params.item) ? params.item : void 0;
      const parentThreadId = item
        ? (readString(item, "senderThreadId") ?? readString(params, "threadId"))?.trim()
        : void 0;
      const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
      if (state && parentThreadId) {
        if (
          notification.method === "item/completed" &&
          readString(item, "type") === "subAgentActivity"
        ) {
          const childThreadId = readString(item, "agentThreadId")?.trim();
          const agentPath = readString(item, "agentPath");
          if (childThreadId)
            this.registerChildThread(
              parentThreadId,
              childThreadId,
              agentPath === void 0 ? {} : { agentPath },
            );
          return state;
        }
        const childThreadIds =
          normalizeIdentifier(readString(item, "tool")) === "spawnagent"
            ? /* @__PURE__ */ new Set([
                ...readStringArray(item?.receiverThreadIds),
                ...readObjectStringKeys(item?.agentsStates),
              ])
            : new Set(readStringArray(item?.receiverThreadIds));
        let accepted = true;
        for (const childThreadId of childThreadIds)
          accepted = Boolean(this.registerChildThread(parentThreadId, childThreadId)) && accepted;
        if (!accepted) return;
      }
      return state;
    }
  }
  async handleCompletionNotification(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    const parentThreadId = params ? readString(params, "threadId")?.trim() : void 0;
    const state = parentThreadId ? this.parentStates.get(parentThreadId) : void 0;
    if (!state) return;
    for (const nativeCompletion of codexNativeSubagentNotifications.fromNotification(
      notification,
    )) {
      const childThreadId = this.childThreadIdsByAgentPath.get(
        buildParentAgentPathKey(state.parentThreadId, nativeCompletion.agentPath),
      );
      const childState = childThreadId ? this.childStates.get(childThreadId) : void 0;
      if (
        !childState ||
        childState.parentThreadId !== state.parentThreadId ||
        childState.terminal
      ) {
        log.warn("Ignoring Codex native subagent completion for unknown child thread", {
          parentThreadId: state.parentThreadId,
          agentPath: nativeCompletion.agentPath,
        });
        continue;
      }
      const completion = {
        childThreadId: childState.childThreadId,
        status: nativeCompletion.status,
        statusLabel: nativeCompletion.statusLabel,
        result: nativeCompletion.result,
      };
      await this.processObservedCompletion(state, childState, completion);
    }
  }
  async processObservedCompletion(state, childState, completion) {
    if (!isNoFinalCompletion(completion)) {
      await this.processCompletion(state, childState, completion);
      return;
    }
    this.resumeChild(childState, { scheduleRecovery: false });
    this.setRecoveryFallback(childState, completion, this.now());
    await this.reconcileChildThread(childState.childThreadId).catch((error) => {
      this.logRecoveryFailure(childState.childThreadId, error);
      return false;
    });
  }
  async reconcileChildState(childState) {
    const state = this.parentStates.get(childState.parentThreadId);
    if (!state) return false;
    const statusRead = this.retainThreadStatusRevision(childState.childThreadId);
    try {
      const recovery = await this.readThreadRecovery(childState.childThreadId);
      if (!statusRead.isCurrent() || this.childStates.get(childState.childThreadId) !== childState)
        return false;
      if (recovery.parentThreadId && recovery.parentThreadId !== childState.parentThreadId) {
        log.warn("Codex native subagent parent did not match monitor state", {
          childThreadId: childState.childThreadId,
          expectedParentThreadId: childState.parentThreadId,
          actualParentThreadId: recovery.parentThreadId,
        });
        this.unregisterChild(childState);
        return false;
      }
      if (recovery.threadState === "active") {
        this.observeActiveChild(childState);
        return false;
      }
      if (recovery.threadState === "other") this.clearSystemErrorFallback(childState);
      if (recovery.resumable) {
        this.settleResumableChild(childState);
        return false;
      }
      const completion = recovery.completion;
      if (!completion) {
        if (recovery.fallbackCompletion)
          this.setRecoveryFallback(
            childState,
            recovery.fallbackCompletion,
            recovery.fallbackCompletion.completedAt ?? this.now(),
          );
        return false;
      }
      if (isNoFinalCompletion(completion)) {
        this.setRecoveryFallback(childState, completion, completion.completedAt ?? this.now());
        return false;
      }
      await this.processCompletion(state, childState, completion, completion.completedAt);
      return true;
    } finally {
      statusRead.release();
    }
  }
  requestThreadRead(childThreadId, includeTurns) {
    return this.client.request(
      "thread/read",
      {
        threadId: childThreadId,
        includeTurns,
      },
      { timeoutMs: THREAD_READ_TIMEOUT_MS },
    );
  }
  requestLatestThreadTurn(childThreadId) {
    return this.client.request(
      "thread/turns/list",
      {
        threadId: childThreadId,
        limit: 1,
        sortDirection: "desc",
        itemsView: "full",
      },
      { timeoutMs: THREAD_READ_TIMEOUT_MS },
    );
  }
  async readThreadRecovery(childThreadId) {
    const response = await this.requestThreadRead(childThreadId, true).catch(() =>
      this.requestThreadRead(childThreadId, false),
    );
    const thread = isJsonObject(response.thread) ? response.thread : void 0;
    if (!thread || readString(thread, "id")?.trim() !== childThreadId)
      return {
        resumable: false,
        threadState: "unavailable",
      };
    const threadStatus = isJsonObject(thread.status)
      ? normalizeIdentifier(readString(thread.status, "type"))
      : void 0;
    let completion;
    let fallbackCompletion;
    let resumable = false;
    let threadState =
      threadStatus === "active"
        ? "active"
        : threadStatus === "systemerror"
          ? "system_error"
          : threadStatus
            ? "other"
            : "unavailable";
    if (threadStatus === "systemerror") {
      const turnsResponse = await this.requestLatestThreadTurn(childThreadId).catch(() => void 0);
      const data =
        isJsonObject(turnsResponse) && Array.isArray(turnsResponse.data) ? turnsResponse.data : [];
      const latestTurn = isJsonObject(data[0]) ? data[0] : void 0;
      const latestTurnStatus = normalizeIdentifier(readString(latestTurn, "status"));
      completion =
        latestTurn && latestTurnStatus === "failed"
          ? readTurnCompletion(latestTurn, childThreadId)
          : void 0;
      if (latestTurnStatus === "inprogress") threadState = "active";
      else if (!completion) fallbackCompletion = systemErrorFallbackCompletion(childThreadId);
    } else if (threadStatus !== "active") {
      const turnRecovery = readThreadTurnRecovery(thread, childThreadId);
      completion = turnRecovery.completion;
      resumable = turnRecovery.resumable;
    }
    return {
      parentThreadId: readThreadParentThreadId(thread),
      completion,
      fallbackCompletion,
      resumable,
      threadState,
    };
  }
  async processCompletion(state, childState, completion, eventAt = this.now()) {
    if (childState.terminal) return;
    if (!this.claimCompletionDelivery(state, childState)) {
      this.unregisterChild(childState);
      return;
    }
    childState.terminal = true;
    this.clearRecoveryTimers(childState);
    state.mirror?.markAuthoritativeCompletion(completion.childThreadId);
    state.taskRuntime?.finalizeTaskRunByRunId({
      runId: codexNativeSubagentRunId(completion.childThreadId),
      status: completion.status,
      endedAt: eventAt,
      lastEventAt: eventAt,
      ...(completion.status === "succeeded" ? {} : { error: completion.result }),
      progressSummary: completion.result,
      terminalSummary: completion.result,
    });
    if (!state.requesterSessionKey || !state.taskRuntimeScope) {
      this.unregisterChild(childState);
      return;
    }
    childState.pendingCompletion = completion;
    state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
      runId: codexNativeSubagentRunId(completion.childThreadId),
      deliveryStatus: "pending",
    });
    this.releaseClientRetentionIfIdle();
    await this.deliverPendingCompletion(state, childState);
  }
  async deliverPendingCompletion(state, childState) {
    const completion = childState.pendingCompletion;
    if (!completion || !state.requesterSessionKey || !state.taskRuntimeScope) return;
    if (childState.deliveringCompletion || childState.completionDeliveryTimer) return;
    childState.deliveringCompletion = true;
    try {
      const delivery = await this.runtime.deliverAgentHarnessTaskCompletion({
        scope: state.taskRuntimeScope,
        childSessionKey: codexNativeSubagentRunId(completion.childThreadId),
        childSessionId: completion.childThreadId,
        announceId: `codex-native:${state.parentThreadId}:${completion.childThreadId}:${completion.status}`,
        announceType: "Codex native subagent",
        taskLabel: "Codex native subagent",
        status: completion.status,
        statusLabel: completion.statusLabel,
        result: completion.result,
        replyInstruction:
          "Use the Codex native subagent result to continue or wrap up the parent task. If this is a Discord/channel session, send the visible response with the message tool instead of only writing a transcript final answer. Reply in your normal assistant voice and do not expose internal notification markup.",
      });
      if (isDurableAgentHarnessCompletionDelivery(delivery)) {
        childState.pendingCompletion = void 0;
        childState.completionDeliveryAttempt = 0;
        state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
          runId: codexNativeSubagentRunId(completion.childThreadId),
          deliveryStatus: "delivered",
        });
        this.unregisterChild(childState);
        return;
      }
      const error = delivery.error ?? "completion delivery did not produce a parent response";
      state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
        runId: codexNativeSubagentRunId(completion.childThreadId),
        deliveryStatus: "pending",
        error,
      });
      this.scheduleCompletionDeliveryRetry(childState, error);
    } catch (error) {
      const message = formatErrorMessage(error);
      state.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
        runId: codexNativeSubagentRunId(completion.childThreadId),
        deliveryStatus: "pending",
        error: message,
      });
      this.scheduleCompletionDeliveryRetry(childState, message);
      log.warn("Failed to deliver Codex native subagent completion", {
        parentThreadId: state.parentThreadId,
        childThreadId: completion.childThreadId,
        error: message,
      });
    } finally {
      childState.deliveringCompletion = false;
    }
  }
  scheduleCompletionDeliveryRetry(childState, error) {
    if (
      !childState.pendingCompletion ||
      childState.completionDeliveryTimer ||
      this.childStates.get(childState.childThreadId) !== childState
    )
      return;
    if (childState.completionDeliveryAttempt >= this.completionDeliveryMaxRetries) {
      this.parentStates
        .get(childState.parentThreadId)
        ?.taskRuntime?.setDetachedTaskDeliveryStatusByRunId({
          runId: codexNativeSubagentRunId(childState.childThreadId),
          deliveryStatus: "failed",
          error,
        });
      this.unregisterChild(childState);
      return;
    }
    const delayMs = delayForAttempt(
      this.completionDeliveryRetryDelaysMs,
      childState.completionDeliveryAttempt++,
    );
    childState.completionDeliveryTimer = setTimeout(() => {
      childState.completionDeliveryTimer = void 0;
      if (this.childStates.get(childState.childThreadId) !== childState) return;
      const state = this.parentStates.get(childState.parentThreadId);
      if (state) this.deliverPendingCompletion(state, childState);
    }, delayMs);
    unrefTimer(childState.completionDeliveryTimer);
  }
  registerChildThread(parentThreadIdInput, childThreadIdInput, options = {}) {
    const parentThreadId = parentThreadIdInput.trim();
    const childThreadId = childThreadIdInput.trim();
    if (!parentThreadId || !childThreadId || this.disposed) return;
    let childState = this.childStates.get(childThreadId);
    if (childState && childState.parentThreadId !== parentThreadId) {
      log.warn("Ignoring Codex native subagent child reparenting", {
        childThreadId,
        existingParentThreadId: childState.parentThreadId,
        attemptedParentThreadId: parentThreadId,
      });
      return;
    }
    if (!childState) {
      this.releaseClientRetention ??= this.retainClient?.();
      childState = {
        childThreadId,
        parentThreadId,
        agentPathKeys: /* @__PURE__ */ new Set(),
        assistantMessagesByTurn: /* @__PURE__ */ new Map(),
        recoveryAttempt: 0,
        terminal: false,
        settledWithoutCompletion: false,
        completionDeliveryAttempt: 0,
        deliveringCompletion: false,
      };
      this.childStates.set(childThreadId, childState);
      this.threadStatusRevisions.set(
        childThreadId,
        this.threadStatusRevisions.get(childThreadId) ?? {
          value: 0,
          readers: 0,
        },
      );
    }
    this.registerAgentPath(childState, childThreadId);
    this.parentStates
      .get(parentThreadId)
      ?.mirror?.markAuthoritativeCompletionExpected(childThreadId);
    const agentPath = normalizeOptionalString(options.agentPath);
    if (agentPath) this.registerAgentPath(childState, agentPath);
    this.scheduleRecoveryPoll(childState);
    return childState;
  }
  registerAgentPath(childState, agentPath) {
    const key = buildParentAgentPathKey(childState.parentThreadId, agentPath);
    const existingChild = this.childThreadIdsByAgentPath.get(key);
    if (existingChild && existingChild !== childState.childThreadId) {
      log.warn("Ignoring conflicting Codex native subagent agent path", {
        parentThreadId: childState.parentThreadId,
        agentPath,
        existingChildThreadId: existingChild,
        attemptedChildThreadId: childState.childThreadId,
      });
      return;
    }
    this.childThreadIdsByAgentPath.set(key, childState.childThreadId);
    childState.agentPathKeys.add(key);
  }
  unregisterChild(childState) {
    this.clearRecoveryTimers(childState);
    if (childState.completionDeliveryTimer) clearTimeout(childState.completionDeliveryTimer);
    const deliveryOwnerKey = childState.deliveryOwnerKey;
    if (deliveryOwnerKey && completionDeliveryOwners.get(deliveryOwnerKey) === childState)
      completionDeliveryOwners.delete(deliveryOwnerKey);
    childState.deliveryOwnerKey = void 0;
    for (const key of childState.agentPathKeys)
      if (this.childThreadIdsByAgentPath.get(key) === childState.childThreadId)
        this.childThreadIdsByAgentPath.delete(key);
    if (this.childStates.get(childState.childThreadId) === childState)
      this.childStates.delete(childState.childThreadId);
    if (this.threadStatusRevisions.get(childState.childThreadId)?.readers === 0)
      this.threadStatusRevisions.delete(childState.childThreadId);
    this.releaseClientRetentionIfIdle();
    const state = this.parentStates.get(childState.parentThreadId);
    if (state) this.pruneParentIfUnused(state);
  }
  releaseClientRetentionIfIdle() {
    if (
      [...this.childStates.values()].some(
        (childState) => !childState.terminal && !childState.settledWithoutCompletion,
      )
    )
      return;
    this.releaseRetainedClient();
  }
  releaseRetainedClient() {
    const release = this.releaseClientRetention;
    this.releaseClientRetention = void 0;
    release?.();
  }
  claimCompletionDelivery(state, childState) {
    const requesterSessionKey = state.requesterSessionKey?.trim();
    if (!requesterSessionKey) return true;
    const key = `${requesterSessionKey}\0${childState.childThreadId}`;
    const owner = completionDeliveryOwners.get(key);
    if (owner) return owner === childState;
    const runId = codexNativeSubagentRunId(childState.childThreadId);
    if (
      state.taskRuntime
        ?.listTaskRecords()
        .some((task) => task.runId === runId && task.deliveryStatus === "delivered")
    )
      return false;
    completionDeliveryOwners.set(key, childState);
    childState.deliveryOwnerKey = key;
    return true;
  }
  pruneParentIfUnused(state) {
    if (state.ownerCount > 0) return;
    for (const childState of this.childStates.values())
      if (childState.parentThreadId === state.parentThreadId) return;
    if (this.parentStates.get(state.parentThreadId) === state)
      this.parentStates.delete(state.parentThreadId);
  }
  scheduleRecoveryPoll(childState) {
    if (
      childState.terminal ||
      childState.settledWithoutCompletion ||
      childState.recoveryTimer ||
      this.disposed ||
      this.recoveryPollDelaysMs.length === 0
    )
      return;
    const delayMs = delayForAttempt(this.recoveryPollDelaysMs, childState.recoveryAttempt++);
    childState.recoveryTimer = setTimeout(() => {
      childState.recoveryTimer = void 0;
      this.reconcileChildThread(childState.childThreadId)
        .catch((error) => {
          this.logRecoveryFailure(childState.childThreadId, error);
          return false;
        })
        .then(async (reconciled) => {
          if (reconciled || this.childStates.get(childState.childThreadId) !== childState) return;
          const fallback = childState.fallbackCompletion;
          const state = this.parentStates.get(childState.parentThreadId);
          if (fallback && state && childState.recoveryAttempt >= 2) {
            await this.processCompletion(
              state,
              childState,
              fallback,
              fallback.completedAt ?? this.now(),
            );
            return;
          }
          this.scheduleRecoveryPoll(childState);
        });
    }, delayMs);
    unrefTimer(childState.recoveryTimer);
  }
  setRecoveryFallback(childState, completion, eventAt) {
    if (childState.terminal) return;
    const current = childState.fallbackCompletion;
    if (
      current?.status === completion.status &&
      current.statusLabel === completion.statusLabel &&
      current.result === completion.result
    )
      return;
    if (childState.recoveryTimer) {
      clearTimeout(childState.recoveryTimer);
      childState.recoveryTimer = void 0;
    }
    childState.recoveryAttempt = 0;
    childState.fallbackCompletion = {
      ...completion,
      completedAt: eventAt,
    };
    this.scheduleRecoveryPoll(childState);
  }
  clearSystemErrorFallback(childState) {
    if (childState.fallbackCompletion?.statusLabel !== "system_error") return;
    childState.fallbackCompletion = void 0;
  }
  retainThreadStatusRevision(threadId) {
    const revision = this.threadStatusRevisions.get(threadId) ?? {
      value: 0,
      readers: 0,
    };
    this.threadStatusRevisions.set(threadId, revision);
    revision.readers += 1;
    const capturedValue = revision.value;
    let retained = true;
    return {
      isCurrent: () =>
        this.threadStatusRevisions.get(threadId) === revision && revision.value === capturedValue,
      release: () => {
        if (!retained) return;
        retained = false;
        revision.readers -= 1;
        if (
          revision.readers === 0 &&
          !this.childStates.has(threadId) &&
          this.threadStatusRevisions.get(threadId) === revision
        )
          this.threadStatusRevisions.delete(threadId);
      },
    };
  }
  clearRecoveryTimers(childState) {
    if (childState.recoveryTimer) {
      clearTimeout(childState.recoveryTimer);
      childState.recoveryTimer = void 0;
    }
  }
  async reconcileTaskRowsForParent(state) {
    if (
      this.disposed ||
      this.parentStates.get(state.parentThreadId) !== state ||
      !state.taskRuntime ||
      !state.requesterSessionKey ||
      !state.taskRuntimeScope
    )
      return;
    const candidates = /* @__PURE__ */ new Map();
    for (const task of state.taskRuntime.listTaskRecords()) {
      if (
        task.requesterSessionKey !== state.requesterSessionKey ||
        !this.shouldReconcileCodexNativeTask(task)
      )
        continue;
      const childThreadId = task.runId.slice(13).trim();
      candidates.set(childThreadId, {
        requesterSessionKey: state.requesterSessionKey,
        childThreadId,
        recoveryAttempt: 0,
        taskRuntimeScope: state.taskRuntimeScope,
        agentId: state.agentId,
        taskRuntime: state.taskRuntime,
      });
    }
    for (const candidate of candidates.values()) await this.reconcileTaskCandidate(candidate);
  }
  async reconcileTaskCandidate(candidate) {
    const key = `${candidate.requesterSessionKey}\0${candidate.childThreadId}`;
    const scheduled = this.taskReconciliationTimers.get(key);
    if (scheduled) {
      clearTimeout(scheduled);
      this.taskReconciliationTimers.delete(key);
    }
    const existing = this.taskReconciliations.get(key);
    if (existing) {
      await existing;
      return;
    }
    const reconciliation = this.reconcileTaskCandidateOnce(candidate);
    this.taskReconciliations.set(key, reconciliation);
    try {
      await reconciliation;
    } finally {
      if (this.taskReconciliations.get(key) === reconciliation)
        this.taskReconciliations.delete(key);
    }
  }
  scheduleTaskCandidateReconciliation(candidate) {
    const key = `${candidate.requesterSessionKey}\0${candidate.childThreadId}`;
    if (
      this.disposed ||
      this.recoveryPollDelaysMs.length === 0 ||
      this.taskReconciliationTimers.has(key)
    )
      return;
    const delayMs = delayForAttempt(this.recoveryPollDelaysMs, candidate.recoveryAttempt++);
    const timer = setTimeout(() => {
      this.taskReconciliationTimers.delete(key);
      this.reconcileTaskCandidate(candidate).catch((error) => {
        this.logRecoveryFailure(candidate.childThreadId, error);
        this.scheduleTaskCandidateReconciliation(candidate);
      });
    }, delayMs);
    this.taskReconciliationTimers.set(key, timer);
    unrefTimer(timer);
  }
  async reconcileTaskCandidateOnce(candidate) {
    const runId = codexNativeSubagentRunId(candidate.childThreadId);
    const task = candidate.taskRuntime.listTaskRecords().find((record) => record.runId === runId);
    if (
      !task ||
      task.requesterSessionKey !== candidate.requesterSessionKey ||
      !this.shouldReconcileCodexNativeTask(task)
    )
      return;
    const childBeforeRead = this.childStates.get(candidate.childThreadId);
    const statusRead = this.retainThreadStatusRevision(candidate.childThreadId);
    try {
      let recovery;
      try {
        recovery = await this.readThreadRecovery(candidate.childThreadId);
      } catch (error) {
        this.logRecoveryFailure(candidate.childThreadId, error);
        this.scheduleTaskCandidateReconciliation(candidate);
        return;
      }
      if (
        !statusRead.isCurrent() ||
        this.childStates.get(candidate.childThreadId) !== childBeforeRead
      ) {
        this.scheduleTaskCandidateReconciliation(candidate);
        return;
      }
      const parentThreadId = recovery.parentThreadId;
      if (!parentThreadId) {
        this.scheduleTaskCandidateReconciliation(candidate);
        return;
      }
      let state = this.parentStates.get(parentThreadId);
      if (state && state.requesterSessionKey !== candidate.requesterSessionKey) return;
      if (!state) {
        state = {
          parentThreadId,
          ownerCount: 0,
          requesterSessionKey: candidate.requesterSessionKey,
          taskRuntimeScope: candidate.taskRuntimeScope,
          agentId: candidate.agentId,
          taskRuntime: candidate.taskRuntime,
        };
        this.prepareParentTaskRuntime(state);
        this.parentStates.set(parentThreadId, state);
      }
      const childState = this.registerChildThread(parentThreadId, candidate.childThreadId);
      if (!childState) {
        this.pruneParentIfUnused(state);
        return;
      }
      if (recovery.threadState === "active") this.observeActiveChild(childState);
      if (recovery.threadState === "other") this.clearSystemErrorFallback(childState);
      if (recovery.resumable) {
        this.settleResumableChild(childState);
        return;
      }
      const completion = recovery.completion;
      if (!completion) {
        if (recovery.fallbackCompletion) {
          this.setRecoveryFallback(
            childState,
            recovery.fallbackCompletion,
            recovery.fallbackCompletion.completedAt ?? this.now(),
          );
          return;
        }
        this.scheduleRecoveryPoll(childState);
        return;
      }
      if (isNoFinalCompletion(completion)) {
        this.setRecoveryFallback(childState, completion, completion.completedAt ?? this.now());
        return;
      }
      await this.processCompletion(state, childState, completion, completion.completedAt);
    } finally {
      statusRead.release();
    }
  }
  shouldReconcileCodexNativeTask(task) {
    if (task.status === "queued" || task.status === "running" || task.deliveryStatus === "pending")
      return true;
    if (task.deliveryStatus !== "not_applicable" || task.endedAt === void 0) return false;
    return task.endedAt >= this.now() - RECENT_TERMINAL_TASK_RECONCILE_GRACE_MS;
  }
  logRecoveryFailure(childThreadId, error) {
    log.debug("Codex native subagent history is not ready", {
      childThreadId,
      error: formatErrorMessage(error),
    });
  }
};
const codexNativeSubagentMonitorRuntime = {
  Monitor,
  register: registerMonitor,
};
function readThreadTurnRecovery(thread, childThreadId) {
  const turns = Array.isArray(thread.turns) ? thread.turns : [];
  for (let index = turns.length - 1; index >= 0; index -= 1) {
    const turn = turns[index];
    if (!isJsonObject(turn)) continue;
    const status = normalizeIdentifier(readString(turn, "status"));
    return {
      completion: readTurnCompletion(turn, childThreadId),
      resumable: status === "interrupted",
    };
  }
  return { resumable: false };
}
function toChildTurnCompletion(childState, turn) {
  const status = normalizeIdentifier(readString(turn, "status"));
  if (status === "completed") {
    const turnId = readString(turn, "id");
    const result = turnId ? lastChildAssistantMessage(childState, turnId) : void 0;
    return {
      childThreadId: childState.childThreadId,
      status: "succeeded",
      statusLabel: result ? "turn_completed" : "completed_without_final_message",
      result: result ?? "Codex native subagent completed without a final assistant message.",
    };
  }
  if (status === "failed")
    return {
      childThreadId: childState.childThreadId,
      status: "failed",
      statusLabel: "turn_failed",
      result: readTurnErrorMessage(turn) ?? "Codex native subagent failed.",
    };
}
function lastChildAssistantMessage(childState, turnId) {
  const messages = childState.assistantMessagesByTurn.get(turnId);
  if (!messages) return;
  for (const itemId of messages.order.toReversed())
    if (messages.finalMessageIds.has(itemId) && !messages.commentaryIds.has(itemId)) {
      const text = normalizeOptionalString(messages.texts.get(itemId));
      if (text) return text;
    }
}
function readTurnErrorMessage(turn) {
  const error = isJsonObject(turn.error) ? turn.error : void 0;
  return (
    normalizeOptionalString(readString(error, "message")) ??
    normalizeOptionalString(
      isJsonObject(error?.codexErrorInfo) ? readString(error.codexErrorInfo, "message") : void 0,
    )
  );
}
function systemErrorFallbackCompletion(childThreadId) {
  return {
    childThreadId,
    status: "failed",
    statusLabel: "system_error",
    result: "Codex app-server reported a system error for the native subagent thread.",
  };
}
function readTurnCompletion(turn, childThreadId) {
  const status = normalizeIdentifier(readString(turn, "status"));
  if (status === "inprogress" || !status) return;
  const result = readLastAgentMessage(turn);
  const completedAtSeconds = asFiniteNumber(turn.completedAt);
  const completedAt = completedAtSeconds === void 0 ? void 0 : Math.round(completedAtSeconds * 1e3);
  if (status === "completed")
    return {
      childThreadId,
      status: "succeeded",
      statusLabel: result ? "task_complete" : "completed_without_final_message",
      result: result ?? "Codex native subagent completed without a final assistant message.",
      completedAt,
    };
  if (status === "interrupted") return;
  if (status === "failed")
    return {
      childThreadId,
      status: "failed",
      statusLabel: "task_failed",
      result: readTurnErrorMessage(turn) ?? result ?? "Codex native subagent failed.",
      completedAt,
    };
}
function readLastAgentMessage(turn) {
  const items = Array.isArray(turn.items) ? turn.items : [];
  let legacyResult;
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (!isJsonObject(item)) continue;
    if (normalizeIdentifier(readString(item, "type")) !== "agentmessage") continue;
    const text = readString(item, "text")?.trim();
    if (!text) continue;
    const phase = normalizeIdentifier(readString(item, "phase"));
    if (phase === "finalanswer") return text;
    if (!phase) legacyResult ??= text;
  }
  return legacyResult;
}
function buildParentAgentPathKey(parentThreadId, agentPath) {
  return `${parentThreadId}\0${agentPath}`;
}
function isNoFinalCompletion(completion) {
  return (
    completion.status === "succeeded" &&
    completion.statusLabel === "completed_without_final_message"
  );
}
function delayForAttempt(delays, attempt) {
  return Math.max(1, delays[Math.min(attempt, delays.length - 1)] ?? 1);
}
function readThreadParentThreadId(thread) {
  return (
    readString(thread, "parentThreadId")?.trim() ??
    readString(readThreadSpawnSource(thread), "parent_thread_id")?.trim()
  );
}
function readThreadSpawnSource(thread) {
  const source = isJsonObject(thread?.source) ? thread.source : void 0;
  const subAgent = isJsonObject(source?.subAgent) ? source.subAgent : void 0;
  return isJsonObject(subAgent?.thread_spawn) ? subAgent.thread_spawn : void 0;
}
function readString(record, key) {
  const value = record?.[key];
  return typeof value === "string" ? value : void 0;
}
function readStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readObjectStringKeys(value) {
  return isJsonObject(value) ? Object.keys(value).filter((entry) => entry.trim() !== "") : [];
}
function normalizeIdentifier(value) {
  return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
function unrefTimer(timer) {
  if (typeof timer === "object" && timer && "unref" in timer) timer.unref();
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server-registry.ts
const sandboxExecServerRegistry = {
  servers: /* @__PURE__ */ new Map(),
  async closeAll() {
    const servers = await Promise.allSettled(this.servers.values());
    this.servers.clear();
    await Promise.all(
      servers.map(async (entry) => {
        if (entry.status !== "fulfilled") return;
        const server = entry.value;
        server.refCount = 0;
        if (server.closed) return;
        server.closed = true;
        for (const client of server.server.clients) client.close(1001, "shutdown");
        await new Promise((resolve) => {
          server.server.close(() => resolve());
        });
      }),
    );
  },
};
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/json-rpc.ts
/** JSON-RPC error code used when a sandbox exec-server method is unknown. */
const JSON_RPC_NOT_FOUND = -32004;
/** Protocol-level error carrying the JSON-RPC error code to send to the client. */
var JsonRpcProtocolError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
/** Parses raw WebSocket data into a JSON-RPC request object. */
function parseRequest(data) {
  const text = (
    Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data)
  ).toString("utf8");
  return requireObject(JSON.parse(text), "JSON-RPC request");
}
/** Validates that a JSON value is a non-array object. */
function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label} must be an object.`);
  return value;
}
/** Validates a non-empty string JSON-RPC parameter. */
function requireString(value, label) {
  if (typeof value !== "string" || !value) throw new Error(`${label} must be a non-empty string.`);
  return value;
}
/** Validates a base64 payload parameter as a string; decoding happens at call sites. */
function requireBase64String(value, label) {
  if (typeof value !== "string") throw new Error(`${label} must be a string.`);
  return value;
}
/** Validates a finite numeric JSON-RPC parameter. */
function requireNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error(`${label} must be a finite number.`);
  return value;
}
/** Validates a non-empty string-array JSON-RPC parameter. */
function requireStringArray(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string"))
    throw new Error(`${label} must be a string array.`);
  if (value.length === 0) throw new Error(`${label} must not be empty.`);
  return value;
}
/** Reads HTTP headers from JSON-RPC params, defaulting to an empty header list. */
function readHttpHeaders(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry, index) => {
    const record = requireObject(entry, `header ${index}`);
    return {
      name: requireString(record.name, "header name"),
      value: requireString(record.value, "header value"),
    };
  });
}
/** Sends a JSON-RPC success response over the WebSocket. */
function sendResult(socket, id, result) {
  socket.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id,
      result: result === void 0 ? {} : result,
    }),
  );
}
/** Sends a JSON-RPC error response over the WebSocket. */
function sendError(socket, id, code, message) {
  socket.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: id ?? null,
      error: {
        code,
        message,
      },
    }),
  );
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/fs-policy.ts
/**
 * Resolves Codex filesystem sandbox policy payloads into OpenClaw path/glob
 * checks for sandbox exec-server filesystem operations.
 */
/** Resolves request-local sandbox policy and asserts each requested path has the needed access. */
function assertFsSandboxAccess(execServer, record, requests) {
  assertResolvedFsSandboxAccess(resolveFsSandboxPolicy(execServer, record), requests);
}
/** Parses a Codex managed filesystem sandbox context into normalized access entries. */
function resolveFsSandboxPolicy(execServer, record) {
  if (record.sandbox === void 0 || record.sandbox === null) return;
  const sandbox = requireObject(record.sandbox, "fs sandbox context");
  const permissions = requireObject(sandbox.permissions, "fs sandbox permissions");
  const permissionType = requireString(permissions.type, "fs sandbox permissions type");
  if (permissionType === "disabled" || permissionType === "external")
    return {
      unrestricted: true,
      entries: [],
    };
  if (permissionType !== "managed")
    throw new Error(`Unsupported Codex fs sandbox permission type: ${permissionType}`);
  const fileSystem = requireObject(permissions.file_system, "fs sandbox file system permissions");
  const fileSystemType = requireString(fileSystem.type, "fs sandbox file system permissions type");
  if (fileSystemType === "unrestricted")
    return {
      unrestricted: true,
      entries: [],
    };
  if (fileSystemType !== "restricted")
    throw new Error(`Unsupported Codex fs sandbox file system type: ${fileSystemType}`);
  if (!Array.isArray(fileSystem.entries))
    throw new Error("fs sandbox file system entries must be an array.");
  const cwd = readFsSandboxCwd(execServer, sandbox);
  return {
    unrestricted: false,
    entries: fileSystem.entries.flatMap((entry, index) => {
      const resolved = resolveFsSandboxEntry(
        requireObject(entry, `fs sandbox entry ${index}`),
        cwd,
      );
      return resolved ? [resolved] : [];
    }),
  };
}
function readFsSandboxCwd(execServer, sandbox) {
  if (sandbox.cwd === void 0 || sandbox.cwd === null)
    return normalizeSandboxAbsolutePath(execServer.sandbox.containerWorkdir, "sandbox cwd");
  return normalizeSandboxAbsolutePath(requireString(sandbox.cwd, "sandbox cwd"), "sandbox cwd");
}
function resolveFsSandboxEntry(entry, cwd) {
  const access = readFsAccessMode(entry.access);
  const pathSpec = requireObject(entry.path, "fs sandbox entry path");
  const pathType = requireString(pathSpec.type, "fs sandbox entry path type");
  if (pathType === "path")
    return {
      kind: "path",
      path: normalizeSandboxAbsolutePath(
        requireString(pathSpec.path, "fs sandbox path"),
        "fs sandbox path",
      ),
      access,
    };
  if (pathType === "special") {
    if (isNonGrantingFsSpecialPath(requireObject(pathSpec.value, "fs sandbox special path")))
      return;
    return {
      kind: "path",
      path: resolveFsSpecialPath(requireObject(pathSpec.value, "fs sandbox special path"), cwd),
      access,
    };
  }
  if (pathType === "glob_pattern") {
    const pattern = requireString(pathSpec.pattern, "fs sandbox glob pattern");
    const absolutePattern = normalizeSandboxGlobPattern(
      pattern.startsWith("/") ? pattern : posix.join(cwd, pattern),
    );
    return {
      kind: "glob",
      pattern: absolutePattern,
      matcher: compileSandboxGlobPattern(absolutePattern),
      literalPrefix: sandboxGlobLiteralPrefix(absolutePattern),
      access,
    };
  }
  throw new Error(`Unsupported Codex fs sandbox path type: ${pathType}`);
}
function isNonGrantingFsSpecialPath(value) {
  const kind = requireString(value.kind, "fs sandbox special path kind");
  return kind === "minimal" || kind === "unknown";
}
function readFsAccessMode(value) {
  if (value === "read" || value === "write" || value === "none") return value;
  if (value === "deny") return "none";
  throw new Error("fs sandbox entry access must be read, write, none, or deny.");
}
function resolveFsSpecialPath(value, cwd) {
  const kind = requireString(value.kind, "fs sandbox special path kind");
  if (kind === "root") return "/";
  if (kind === "project_roots" || kind === "current_working_directory") {
    const subpath =
      value.subpath === void 0 || value.subpath === null
        ? void 0
        : requireString(value.subpath, "fs sandbox project roots subpath");
    return normalizeSandboxAbsolutePath(
      subpath ? posix.join(cwd, subpath) : cwd,
      "fs sandbox project roots path",
    );
  }
  if (kind === "slash_tmp" || kind === "tmpdir") return "/tmp";
  throw new Error(`Unsupported Codex fs sandbox special path: ${kind}`);
}
/** Asserts access against an already resolved filesystem sandbox policy. */
function assertResolvedFsSandboxAccess(policy, requests) {
  if (!policy?.unrestricted && policy)
    for (const request of requests) {
      const access = resolveFsAccess(policy, request.path);
      if (request.access === "read" && access === "none")
        throw new Error(`Codex fs sandbox denied read access to ${request.path}`);
      if (request.access === "write" && access !== "write")
        throw new Error(`Codex fs sandbox denied write access to ${request.path}`);
    }
}
function resolveFsAccess(policy, rawPath) {
  if (policy.unrestricted) return "write";
  const target = normalizeSandboxAbsolutePath(rawPath, "fs path");
  let selected;
  for (const entry of policy.entries) {
    if (!fsSandboxEntryMatches(entry, target)) continue;
    const candidate = {
      specificity: fsSandboxEntrySpecificity(entry),
      rank: fsAccessRank(entry.access),
      access: entry.access,
    };
    if (
      !selected ||
      candidate.specificity > selected.specificity ||
      (candidate.specificity === selected.specificity && candidate.rank > selected.rank)
    )
      selected = candidate;
  }
  return selected?.access ?? "none";
}
/** Rejects recursive writes/removes that would cross protected read-only descendants. */
function assertNoReadOnlyDescendant(policy, rawPath, operation) {
  if (!policy || policy.unrestricted) return;
  const target = normalizeSandboxAbsolutePath(rawPath, "fs path");
  const protectedDescendant = policy.entries.find((entry) => {
    if (entry.access === "write" || !fsSandboxEntryCanAffectDescendant(entry, target)) return false;
    if (entry.kind === "glob") return true;
    const protectedPath = entry.path;
    return protectedPath && resolveFsAccess(policy, protectedPath) !== "write";
  });
  if (protectedDescendant) {
    const protectedPath =
      protectedDescendant.kind === "path" ? protectedDescendant.path : protectedDescendant.pattern;
    throw new Error(
      `Codex fs sandbox denied recursive ${operation} of ${rawPath} because ${protectedPath} is not writable.`,
    );
  }
}
/** Normalizes and validates an absolute POSIX path inside the sandbox namespace. */
function normalizeSandboxAbsolutePath(rawPath, label) {
  if (!rawPath || rawPath.includes("\0") || !rawPath.startsWith("/"))
    throw new Error(`${label} must be an absolute sandbox path.`);
  const normalized = posix.normalize(rawPath);
  return normalized === "//" ? "/" : normalized;
}
/** Returns true when target is root itself or a descendant of root. */
function pathContains(root, target) {
  return root === "/" || target === root || target.startsWith(`${root}/`);
}
function fsSandboxEntryMatches(entry, target) {
  if (entry.kind === "path") return pathContains(entry.path, target);
  return entry.matcher.test(target);
}
function fsSandboxEntryCanAffectDescendant(entry, target) {
  if (entry.kind === "path") return pathContains(target, entry.path) && target !== entry.path;
  return pathContains(target, entry.literalPrefix) || pathContains(entry.literalPrefix, target);
}
function fsSandboxEntrySpecificity(entry) {
  return pathSpecificity(entry.kind === "path" ? entry.path : entry.literalPrefix);
}
function pathSpecificity(filePath) {
  return filePath === "/" ? 0 : filePath.split("/").filter(Boolean).length;
}
function fsAccessRank(access) {
  if (access === "none") return 2;
  if (access === "write") return 1;
  return 0;
}
function normalizeSandboxGlobPattern(pattern) {
  if (!pattern || pattern.includes("\0") || !pattern.startsWith("/"))
    throw new Error("fs sandbox glob pattern must be absolute.");
  return pattern.replace(/\/{2,}/gu, "/");
}
function compileSandboxGlobPattern(pattern) {
  let source = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    const next = pattern[index + 1];
    if (char === "*" && next === "*" && pattern[index + 2] === "/") {
      source += "(?:.*/)?";
      index += 2;
    } else if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
    } else if (char === "*") source += "[^/]*";
    else if (char === "?") source += "[^/]";
    else if (char === "[") {
      const compiledClass = compileSandboxGlobCharacterClass(pattern, index);
      source += compiledClass.source;
      index = compiledClass.endIndex;
    } else source += char?.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&") ?? "";
  }
  source += "$";
  return new RegExp(source, "u");
}
function compileSandboxGlobCharacterClass(pattern, startIndex) {
  let index = startIndex + 1;
  if (index >= pattern.length) throw new Error("fs sandbox glob character class must be closed.");
  const negated = pattern[index] === "!" || pattern[index] === "^";
  if (negated) index += 1;
  let body = "";
  for (; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "]" && body)
      return {
        source: `[${negated ? "^" : ""}${body}]`,
        endIndex: index,
      };
    if (!char || char === "/")
      throw new Error("fs sandbox glob character class cannot match path separators.");
    body += escapeSandboxGlobCharacterClassChar(char, body.length === 0);
  }
  throw new Error("fs sandbox glob character class must be closed.");
}
function escapeSandboxGlobCharacterClassChar(char, first) {
  if (char === "\\" || char === "]") return `\\${char}`;
  if (first && char === "^") return "\\^";
  return char;
}
function sandboxGlobLiteralPrefix(pattern) {
  const wildcardIndex = pattern.search(/[*?[]/u);
  const prefix = wildcardIndex === -1 ? pattern : pattern.slice(0, wildcardIndex);
  const slash = prefix.lastIndexOf("/");
  if (slash <= 0) return "/";
  return normalizeSandboxAbsolutePath(prefix.slice(0, slash), "fs sandbox glob prefix");
}
/** Safely joins a single directory entry name onto a sandbox parent path. */
function joinSandboxChildPath(parent, child) {
  if (!child || child === "." || child === ".." || child.includes("/") || child.includes("\0"))
    throw new Error(`Invalid sandbox directory entry name: ${child}`);
  return parent.endsWith("/") ? `${parent}${child}` : `${parent}/${child}`;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/runtime.ts
/** Returns the configured sandbox backend or fails the current JSON-RPC request. */
function requireBackend(execServer) {
  const backend = execServer.sandbox.backend;
  if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
  return backend;
}
/** Returns the configured filesystem bridge or fails the current JSON-RPC request. */
function requireFsBridge(execServer) {
  const fsBridge = execServer.sandbox.fsBridge;
  if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
  return fsBridge;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/filesystem.ts
/**
 * Implements filesystem JSON-RPC handlers for the Codex sandbox exec-server
 * with OpenClaw sandbox policy checks before every bridge operation.
 */
const CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES = 512 * 1024 * 1024;
/** Reads a sandbox file as base64 after read-policy and size checks. */
async function readFile$1(execServer, params) {
  const record = requireObject(params, "fs/readFile params");
  const filePath = requireString(record.path, "path");
  assertFsSandboxAccess(execServer, record, [
    {
      path: filePath,
      access: "read",
    },
  ]);
  const fsBridge = requireFsBridge(execServer);
  const stat = await fsBridge.stat({ filePath });
  if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
  if (stat.type === "file" && stat.size > CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES)
    throw new Error(
      `file is too large to read through Codex sandbox exec-server: ${stat.size} bytes`,
    );
  return { dataBase64: (await fsBridge.readFile({ filePath })).toString("base64") };
}
/** Writes base64 data to an existing sandbox directory after write-policy checks. */
async function writeFile$1(execServer, params) {
  const record = requireObject(params, "fs/writeFile params");
  const filePath = requireString(record.path, "path");
  assertFsSandboxAccess(execServer, record, [
    {
      path: filePath,
      access: "write",
    },
  ]);
  const fsBridge = requireFsBridge(execServer);
  if ((await fsBridge.stat({ filePath: posix.dirname(filePath) }))?.type !== "directory")
    throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
  await fsBridge.writeFile({
    filePath,
    data: Buffer.from(requireBase64String(record.dataBase64, "dataBase64"), "base64"),
    mkdir: false,
  });
}
/** Creates a sandbox directory, respecting recursive and parent-directory semantics. */
async function createDirectory(execServer, params) {
  const record = requireObject(params, "fs/createDirectory params");
  const filePath = requireString(record.path, "path");
  assertFsSandboxAccess(execServer, record, [
    {
      path: filePath,
      access: "write",
    },
  ]);
  const fsBridge = requireFsBridge(execServer);
  if (record.recursive === false) {
    const parentPath = posix.dirname(filePath);
    if ((await fsBridge.stat({ filePath: parentPath }))?.type !== "directory")
      throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
  }
  await fsBridge.mkdirp({ filePath });
}
/** Returns normalized metadata for a sandbox path. */
async function getMetadata(execServer, params) {
  const record = requireObject(params, "fs/getMetadata params");
  const filePath = requireString(record.path, "path");
  assertFsSandboxAccess(execServer, record, [
    {
      path: filePath,
      access: "read",
    },
  ]);
  const stat = await requireFsBridge(execServer).stat({ filePath });
  if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
  return metadataResponse(stat);
}
/** Lists sandbox directory entries visible under the resolved filesystem policy. */
async function readDirectory(execServer, params) {
  const record = requireObject(params, "fs/readDirectory params");
  return {
    entries: await listDirectoryEntries(
      execServer,
      requireString(record.path, "path"),
      resolveFsSandboxPolicy(execServer, record),
    ),
  };
}
async function listDirectoryEntries(execServer, filePath, fsSandboxPolicy) {
  assertResolvedFsSandboxAccess(fsSandboxPolicy, [
    {
      path: filePath,
      access: "read",
    },
  ]);
  const fsBridge = requireFsBridge(execServer);
  const backend = requireBackend(execServer);
  const resolved = fsBridge.resolvePath({ filePath });
  if (!resolved) throw new Error(`Cannot resolve sandbox path: ${filePath}`);
  const result = await backend.runShellCommand({
    script:
      'find "$1" -mindepth 1 -maxdepth 1 -exec sh -c \'for path do name=${path##*/}; if [ -L "$path" ]; then kind=o; elif [ -d "$path" ]; then kind=d; elif [ -f "$path" ]; then kind=f; else kind=o; fi; printf "%s\\t%s\\n" "$kind" "$name"; done\' sh {} +',
    args: [resolved.containerPath],
    allowFailure: true,
  });
  if (result.code !== 0) {
    const stderr = result.stderr.toString("utf8").trim();
    throw new Error(stderr || `sandbox directory listing failed with code ${result.code}`);
  }
  return result.stdout
    .toString("utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [kind = "o", fileName = ""] = line.split("	");
      return {
        fileName,
        isDirectory: kind === "d",
        isFile: kind === "f",
      };
    });
}
/** Removes a sandbox path after rejecting writes outside policy or under read-only descendants. */
async function removePath(execServer, params) {
  const record = requireObject(params, "fs/remove params");
  const filePath = requireString(record.path, "path");
  const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
  assertResolvedFsSandboxAccess(fsSandboxPolicy, [
    {
      path: filePath,
      access: "write",
    },
  ]);
  if (record.recursive !== false) assertNoReadOnlyDescendant(fsSandboxPolicy, filePath, "remove");
  await requireFsBridge(execServer).remove({
    filePath,
    recursive: record.recursive !== false,
    force: record.force !== false,
  });
}
/** Copies sandbox files or recursive directories while enforcing source and destination policy. */
async function copyPath(execServer, params) {
  const record = requireObject(params, "fs/copy params");
  const sourcePath = requireString(record.sourcePath ?? record.source, "sourcePath");
  const destinationPath = requireString(
    record.destinationPath ?? record.destination,
    "destinationPath",
  );
  const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
  assertResolvedFsSandboxAccess(fsSandboxPolicy, [
    {
      path: sourcePath,
      access: "read",
    },
    {
      path: destinationPath,
      access: "write",
    },
  ]);
  await copySandboxPath(execServer, {
    sourcePath,
    destinationPath,
    recursive: record.recursive === true,
    fsSandboxPolicy,
  });
}
async function copySandboxPath(execServer, params) {
  const fsBridge = execServer.sandbox.fsBridge;
  if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
  assertResolvedFsSandboxAccess(params.fsSandboxPolicy, [
    {
      path: params.sourcePath,
      access: "read",
    },
    {
      path: params.destinationPath,
      access: "write",
    },
  ]);
  const sourceStat = await fsBridge.stat({ filePath: params.sourcePath });
  if (!sourceStat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
  if (sourceStat?.type === "directory") {
    if (!params.recursive)
      throw new Error(`Cannot copy directory without recursive=true: ${params.sourcePath}`);
    if (
      pathContains(
        normalizeSandboxAbsolutePath(params.sourcePath, "copy source path"),
        normalizeSandboxAbsolutePath(params.destinationPath, "copy destination path"),
      )
    )
      throw new Error("Cannot recursively copy a directory into itself.");
    await fsBridge.mkdirp({ filePath: params.destinationPath });
    for (const entry of await listDirectoryEntries(
      execServer,
      params.sourcePath,
      params.fsSandboxPolicy,
    )) {
      if (!entry.isDirectory && !entry.isFile)
        throw new Error(`Cannot copy unsupported filesystem entry: ${entry.fileName}`);
      await copySandboxPath(execServer, {
        sourcePath: joinSandboxChildPath(params.sourcePath, entry.fileName),
        destinationPath: joinSandboxChildPath(params.destinationPath, entry.fileName),
        recursive: true,
        fsSandboxPolicy: params.fsSandboxPolicy,
      });
    }
    return;
  }
  const data = await fsBridge.readFile({ filePath: params.sourcePath });
  await fsBridge.writeFile({
    filePath: params.destinationPath,
    data,
    mkdir: true,
  });
}
function metadataResponse(stat) {
  return {
    isDirectory: stat?.type === "directory",
    isFile: stat?.type === "file",
    isSymlink: false,
    createdAtMs: 0,
    modifiedAtMs: stat?.mtimeMs ?? 0,
  };
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/http.ts
/**
 * Implements sandboxed HTTP requests for Codex native tools by routing network
 * access through the active OpenClaw sandbox backend.
 */
/** Maximum JSON-line size accepted from the streaming HTTP helper process. */
const SANDBOX_HTTP_STREAM_LINE_MAX_CHARS = 256 * 1024;
/** Handles one sandbox HTTP JSON-RPC request, optionally streaming response body deltas. */
async function httpRequest(execServer, socket, params) {
  const record = requireObject(params, "http/request params");
  const requestId = requireString(record.requestId, "requestId");
  const url = requireString(record.url, "url");
  assertSandboxHttpRequestTargetAllowed(url);
  const request = {
    method: requireString(record.method, "method"),
    url,
    headers: readHttpHeaders(record.headers),
    bodyBase64: typeof record.bodyBase64 === "string" ? record.bodyBase64 : void 0,
    timeoutMs:
      typeof record.timeoutMs === "number" && record.timeoutMs > 0
        ? Math.floor(record.timeoutMs)
        : void 0,
    streamResponse: record.streamResponse === true,
  };
  if (request.streamResponse)
    return await runStreamingSandboxHttpRequest(execServer, socket, requestId, request);
  return await runSandboxHttpRequest(execServer, {
    ...request,
    streamResponse: false,
  });
}
function assertSandboxHttpRequestTargetAllowed(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new SsrFBlockedError("Invalid URL supplied to sandbox http/request");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    throw new SsrFBlockedError(
      `Blocked non-HTTP(S) protocol in sandbox http/request: ${parsed.protocol}`,
    );
  if (isBlockedHostnameOrIp(parsed.hostname))
    throw new SsrFBlockedError(
      `Blocked hostname or private/internal IP in sandbox http/request: ${parsed.hostname}`,
    );
}
async function runSandboxHttpRequest(execServer, params) {
  const result = await requireBackend(execServer).runShellCommand({
    script: SANDBOX_HTTP_REQUEST_SCRIPT,
    stdin: JSON.stringify(params),
    allowFailure: true,
  });
  if (result.code !== 0) {
    const stderr = result.stderr.toString("utf8").trim();
    throw new Error(stderr || `sandbox http/request failed with code ${result.code}`);
  }
  const parsed = JSON.parse(result.stdout.toString("utf8"));
  if (typeof parsed.status !== "number" || !Array.isArray(parsed.headers))
    throw new Error("sandbox http/request returned an invalid response envelope");
  return {
    status: parsed.status,
    headers: readHttpHeaders(parsed.headers),
    bodyBase64: typeof parsed.bodyBase64 === "string" ? parsed.bodyBase64 : "",
  };
}
async function runStreamingSandboxHttpRequest(execServer, socket, requestId, params) {
  const backend = requireBackend(execServer);
  const execSpec = await backend.buildExecSpec({
    command: SANDBOX_HTTP_REQUEST_SCRIPT,
    workdir: execServer.sandbox.containerWorkdir,
    env: {},
    usePty: false,
  });
  let child;
  try {
    const [command, ...args] = execSpec.argv;
    if (!command) throw new Error("OpenClaw sandbox HTTP exec spec did not provide a command.");
    child = spawn(command, args, {
      env: execSpec.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (error) {
    try {
      await backend.finalizeExec?.({
        status: "failed",
        exitCode: null,
        timedOut: false,
        token: execSpec.finalizeToken,
      });
    } catch (finalizeError) {
      log.warn("codex sandbox http/request finalize after start failure failed", {
        error: finalizeError,
      });
    }
    throw error;
  }
  const abortOnSocketClose = () => child.kill("SIGTERM");
  socket.once("close", abortOnSocketClose);
  child.once("close", () => {
    socket.off("close", abortOnSocketClose);
  });
  child.stdin.on("error", (error) => {
    if (error.code === "EPIPE" || error.code === "ERR_STREAM_DESTROYED") return;
    log.warn("codex sandbox http/request stdin write failed", { error });
  });
  child.stdin.end(JSON.stringify(params));
  return await readStreamingSandboxHttpResponse({
    child,
    execSpec,
    finalizeExec: backend.finalizeExec,
    requestId,
    socket,
  });
}
function readStreamingSandboxHttpResponse(params) {
  return new Promise((resolve, reject) => {
    let headerResolved = false;
    let failed = false;
    let childFailure = null;
    let lastBodySeq = 0;
    let stdoutBuffer = "";
    let stderr = "";
    const finalize = async (status, exitCode) => {
      await params.finalizeExec?.({
        status,
        exitCode,
        timedOut: false,
        token: params.execSpec.finalizeToken,
      });
    };
    const fail = (message, exitCode) => {
      if (failed) return;
      failed = true;
      finalize("failed", exitCode).catch((error) => {
        log.warn("codex sandbox http/request finalize failed", { error });
      });
      if (headerResolved) {
        sendHttpBodyDelta(params.socket, {
          requestId: params.requestId,
          seq: lastBodySeq + 1,
          deltaBase64: "",
          done: true,
          error: message,
        });
        return;
      }
      reject(new Error(message));
    };
    params.child.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString("utf8");
      let newline = stdoutBuffer.indexOf("\n");
      while (newline >= 0) {
        const line = stdoutBuffer.slice(0, newline).trim();
        stdoutBuffer = stdoutBuffer.slice(newline + 1);
        if (line)
          try {
            const message = requireObject(JSON.parse(line), "http stream message");
            const type = requireString(message.type, "http stream message type");
            if (type === "headers") {
              headerResolved = true;
              resolve({
                status: requireNumber(message.status, "http status"),
                headers: readHttpHeaders(message.headers),
                bodyBase64: "",
              });
            } else if (type === "bodyDelta") {
              const seq = requireNumber(message.seq, "http body sequence");
              lastBodySeq = Math.max(lastBodySeq, seq);
              sendHttpBodyDelta(params.socket, {
                requestId: params.requestId,
                seq,
                deltaBase64: typeof message.deltaBase64 === "string" ? message.deltaBase64 : "",
                done: message.done === true,
                error: typeof message.error === "string" ? message.error : null,
              });
            }
          } catch (error) {
            fail(error instanceof Error ? error.message : String(error), null);
          }
        newline = stdoutBuffer.indexOf("\n");
      }
      if (stdoutBuffer.length > SANDBOX_HTTP_STREAM_LINE_MAX_CHARS) {
        params.child.kill("SIGKILL");
        fail(
          `sandbox http/request produced an unterminated stdout line longer than ${SANDBOX_HTTP_STREAM_LINE_MAX_CHARS} characters`,
          null,
        );
      }
    });
    params.child.stderr.on("data", (chunk) => {
      stderr = `${stderr}${chunk.toString("utf8")}`.slice(-4096);
    });
    params.child.once("error", (error) => {
      childFailure ??= error.message;
    });
    params.child.once("close", (code) => {
      const exitCode = code ?? 1;
      if (failed) return;
      if (childFailure) {
        fail(childFailure, exitCode);
        return;
      }
      if (exitCode === 0) {
        finalize("completed", exitCode).catch((error) => {
          log.warn("codex sandbox http/request finalize failed", { error });
        });
        if (!headerResolved)
          reject(/* @__PURE__ */ new Error("sandbox http/request exited before returning headers"));
        return;
      }
      fail(stderr.trim() || `sandbox http/request failed with code ${exitCode}`, exitCode);
    });
  });
}
const SANDBOX_HTTP_REQUEST_SCRIPT = String.raw`
tmp=$(mktemp "$TMPDIR/openclaw-http.XXXXXX.py" 2>/dev/null || mktemp "/tmp/openclaw-http.XXXXXX.py") || exit 1
trap 'rm -f "$tmp"' EXIT
cat > "$tmp" <<'PY'
import base64
import json
import ipaddress
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request

def emit(payload):
    print(json.dumps(payload, separators=(",", ":")), flush=True)

def response_headers(response):
    return [{"name": name, "value": value} for name, value in response.headers.items()]

BLOCKED_HOSTNAMES = {
    "localhost",
    "localhost.localdomain",
    "metadata.google.internal",
}
CLOUD_METADATA_IP_ADDRESSES = {
    "100.100.100.200",
    "fd00:ec2::254",
}
BLOCKED_IPV4_NETWORKS = tuple(
    ipaddress.ip_network(network)
    for network in (
        "100.64.0.0/10",
        "198.18.0.0/15",
    )
)
BLOCKED_IPV6_NETWORKS = tuple(
    ipaddress.ip_network(network)
    for network in (
        "100::/64",
        "2001:2::/48",
        "2001:20::/28",
        "2001:db8::/32",
        "fec0::/10",
    )
)
PINNED_ADDRESSES = {}

def normalize_hostname(hostname):
    return (hostname or "").strip("[]").rstrip(".").lower()

def is_blocked_hostname(hostname):
    normalized = normalize_hostname(hostname)
    return (
        normalized in BLOCKED_HOSTNAMES
        or normalized.endswith(".localhost")
        or normalized.endswith(".local")
        or normalized.endswith(".internal")
    )

def is_blocked_ip(address):
    try:
        parsed = ipaddress.ip_address(address)
    except ValueError:
        return False
    embedded_ipv4 = extract_embedded_ipv4(parsed)
    if embedded_ipv4 is not None and is_blocked_ip(str(embedded_ipv4)):
        return True
    if str(parsed).lower() in CLOUD_METADATA_IP_ADDRESSES:
        return True
    if isinstance(parsed, ipaddress.IPv4Address):
        if any(parsed in network for network in BLOCKED_IPV4_NETWORKS):
            return True
    else:
        if any(parsed in network for network in BLOCKED_IPV6_NETWORKS):
            return True
    return (
        parsed.is_loopback
        or parsed.is_private
        or parsed.is_link_local
        or parsed.is_multicast
        or parsed.is_reserved
        or parsed.is_unspecified
    )

def ipv4_from_int(value):
    return ipaddress.IPv4Address(value & 0xffffffff)

def extract_embedded_ipv4(address):
    if not isinstance(address, ipaddress.IPv6Address):
        return None
    if address.ipv4_mapped is not None:
        return address.ipv4_mapped
    value = int(address)
    hextets = [(value >> shift) & 0xffff for shift in range(112, -1, -16)]
    if hextets[:6] == [0, 0, 0, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[:6] == [0x64, 0xff9b, 0, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[:6] == [0x64, 0xff9b, 1, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[0] == 0x2002:
        return ipv4_from_int((hextets[1] << 16) | hextets[2])
    if hextets[0] == 0x2001 and hextets[1] == 0:
        return ipv4_from_int(((hextets[6] << 16) | hextets[7]) ^ 0xffffffff)
    if (hextets[4] & 0xfcff) == 0 and hextets[5] == 0x5efe:
        return ipv4_from_int((hextets[6] << 16) | hextets[7])
    return None

def assert_url_allowed(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("http/request only supports http and https URLs")
    hostname = normalize_hostname(parsed.hostname)
    if not hostname or is_blocked_hostname(hostname) or is_blocked_ip(hostname):
        raise ValueError("Blocked hostname or private/internal/special-use IP address")
    try:
        results = socket.getaddrinfo(hostname, parsed.port, proto=socket.IPPROTO_TCP)
    except socket.gaierror as error:
        raise ValueError(f"Unable to resolve hostname: {hostname}") from error
    addresses = {entry[4][0] for entry in results if entry[4]}
    if not addresses or any(is_blocked_ip(address) for address in addresses):
        raise ValueError("Blocked: resolves to private/internal/special-use IP address")
    PINNED_ADDRESSES[hostname] = sorted(addresses)

class GuardedRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        assert_url_allowed(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def pinned_getaddrinfo(original_getaddrinfo):
    def getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
        pinned = PINNED_ADDRESSES.get(normalize_hostname(host))
        if not pinned:
            return original_getaddrinfo(host, port, family, type, proto, flags)
        results = []
        for address in pinned:
            results.extend(original_getaddrinfo(address, port, family, type, proto, flags))
        return results
    return getaddrinfo

def handle_response(input_data, response):
    headers = response_headers(response)
    status = int(getattr(response, "status", getattr(response, "code", 0)))
    if input_data.get("streamResponse"):
        emit({"type": "headers", "status": status, "headers": headers})
        seq = 1
        while True:
            chunk = response.read(65536)
            if not chunk:
                break
            emit({
                "type": "bodyDelta",
                "seq": seq,
                "deltaBase64": base64.b64encode(chunk).decode("ascii"),
                "done": False,
            })
            seq += 1
        emit({"type": "bodyDelta", "seq": seq, "deltaBase64": "", "done": True})
        return
    body = response.read()
    emit({
        "status": status,
        "headers": headers,
        "bodyBase64": base64.b64encode(body).decode("ascii"),
    })

def main():
    input_data = json.load(sys.stdin)
    url = str(input_data.get("url", ""))
    assert_url_allowed(url)
    body_base64 = input_data.get("bodyBase64")
    data = base64.b64decode(body_base64) if isinstance(body_base64, str) else None
    request = urllib.request.Request(
        url,
        data=data,
        method=str(input_data.get("method", "GET")),
    )
    for header in input_data.get("headers") or []:
        request.add_header(str(header.get("name", "")), str(header.get("value", "")))
    timeout_ms = input_data.get("timeoutMs")
    timeout = None
    if isinstance(timeout_ms, (int, float)) and timeout_ms > 0:
        timeout = timeout_ms / 1000
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), GuardedRedirectHandler)
    original_getaddrinfo = socket.getaddrinfo
    socket.getaddrinfo = pinned_getaddrinfo(original_getaddrinfo)
    try:
        with opener.open(request, timeout=timeout) as response:
            handle_response(input_data, response)
    except urllib.error.HTTPError as response:
        handle_response(input_data, response)
    finally:
        socket.getaddrinfo = original_getaddrinfo

if __name__ == "__main__":
    main()
PY
python3 "$tmp"
`.trim();
function sendHttpBodyDelta(socket, params) {
  if (socket.readyState !== 1) return;
  socket.send(
    JSON.stringify({
      jsonrpc: "2.0",
      method: "http/request/bodyDelta",
      params: {
        requestId: params.requestId,
        seq: params.seq,
        deltaBase64: params.deltaBase64,
        done: params.done,
        error: params.error ?? null,
      },
    }),
  );
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/processes.ts
/**
 * Manages subprocess lifecycle, streaming output buffers, stdin writes, and
 * termination for Codex sandbox exec-server process RPCs.
 */
const ENV_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RETAINED_PROCESS_OUTPUT_BYTES = 1024 * 1024;
const CLOSED_PROCESS_EVICTION_MS = 6e4;
/** Starts a sandbox-backed process and registers it in the connection-local process table. */
async function startProcess(execServer, processes, socket, params) {
  const record = requireObject(params, "process/start params");
  const processId = requireString(record.processId, "processId");
  if (processes.has(processId)) throw new Error(`process already exists: ${processId}`);
  const argv = requireStringArray(record.argv, "argv");
  const cwd = requireString(record.cwd, "cwd");
  rejectUnsupportedArg0(record.arg0);
  const env = readProcessEnv(record);
  const managed = {
    processId,
    chunks: [],
    retainedOutputBytes: 0,
    nextSeq: 1,
    exited: false,
    exitCode: null,
    closed: false,
    failure: null,
    tty: record.tty === true,
    pipeStdin: record.pipeStdin === true,
    abortController: new AbortController(),
    child: null,
    finalized: false,
    waiters: [],
    emitNotification: (method, notificationParams) => {
      if (socket.readyState === 1)
        socket.send(
          JSON.stringify({
            jsonrpc: "2.0",
            method,
            params: notificationParams,
          }),
        );
    },
    evictProcess: () => {
      if (managed.evictionTimer) return;
      managed.evictionTimer = setTimeout(() => {
        if (processes.get(processId) === managed && managed.closed) processes.delete(processId);
      }, CLOSED_PROCESS_EVICTION_MS);
      managed.evictionTimer.unref?.();
    },
  };
  processes.set(processId, managed);
  try {
    await runProcess(execServer, managed, {
      argv,
      cwd,
      env,
    });
  } catch (error) {
    processes.delete(processId);
    managed.failure = error instanceof Error ? error.message : String(error);
    managed.exitCode = null;
    managed.exited = true;
    managed.closed = true;
    notifyProcessWaiters(managed);
    throw error;
  }
  return { processId };
}
async function runProcess(execServer, managed, params) {
  const backend = execServer.sandbox.backend;
  if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
  throwIfProcessStartCancelled(managed);
  const execSpec = await backend.buildExecSpec({
    command: shellCommandFromArgv(params.argv),
    workdir: params.cwd,
    env: params.env,
    usePty: false,
  });
  managed.finalizeToken = execSpec.finalizeToken;
  managed.finalizeExec = backend.finalizeExec;
  let child;
  try {
    if (managed.abortController.signal.aborted) throw new Error("process start cancelled");
    const [command, ...args] = execSpec.argv;
    if (!command) throw new Error("OpenClaw sandbox exec spec did not provide a command.");
    child = spawn(command, args, {
      env: execSpec.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (error) {
    managed.failure = error instanceof Error ? error.message : String(error);
    await finalizeProcess(managed).catch((finalizeError) => {
      log.warn("codex sandbox exec-server finalize after start failure failed", {
        processId: managed.processId,
        error: finalizeError instanceof Error ? finalizeError.message : String(finalizeError),
      });
    });
    throw error;
  }
  managed.child = child;
  const abortListener = () => child.kill("SIGTERM");
  managed.abortController.signal.addEventListener("abort", abortListener, { once: true });
  child.stdout.on("data", (chunk) =>
    appendProcessChunk(managed, managed.tty ? "pty" : "stdout", chunk),
  );
  child.stderr.on("data", (chunk) => appendProcessChunk(managed, "stderr", chunk));
  child.once("error", (error) => {
    managed.failure ??= error.message;
    notifyProcessWaiters(managed);
  });
  child.once("close", (code) => {
    managed.abortController.signal.removeEventListener("abort", abortListener);
    emitProcessClosed(managed, code ?? 1);
  });
  if (!managed.tty && !managed.pipeStdin) child.stdin.end();
}
function throwIfProcessStartCancelled(managed) {
  if (managed.abortController.signal.aborted) throw new Error("process start cancelled");
}
function appendProcessChunk(managed, stream, data) {
  if (data.length === 0) return;
  const chunk = {
    seq: managed.nextSeq,
    stream,
    chunk: data.toString("base64"),
  };
  managed.chunks.push(chunk);
  managed.retainedOutputBytes += data.length;
  while (managed.retainedOutputBytes > RETAINED_PROCESS_OUTPUT_BYTES && managed.chunks.length > 1) {
    const removed = managed.chunks.shift();
    if (!removed) break;
    managed.retainedOutputBytes -= Buffer.from(removed.chunk, "base64").byteLength;
  }
  managed.nextSeq += 1;
  managed.emitNotification("process/output", {
    processId: managed.processId,
    seq: chunk.seq,
    stream: chunk.stream,
    chunk: chunk.chunk,
  });
  notifyProcessWaiters(managed);
}
function emitProcessClosed(managed, exitCode) {
  if (!managed.exited) {
    const exitSeq = managed.nextSeq;
    managed.nextSeq += 1;
    managed.exitCode = exitCode;
    managed.exited = true;
    if (exitCode !== null)
      managed.emitNotification("process/exited", {
        processId: managed.processId,
        seq: exitSeq,
        exitCode,
      });
  }
  if (!managed.closed) {
    const closeSeq = managed.nextSeq;
    managed.nextSeq += 1;
    managed.closed = true;
    managed.emitNotification("process/closed", {
      processId: managed.processId,
      seq: closeSeq,
    });
  }
  finalizeProcess(managed).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    managed.failure ??= message;
    log.warn("codex sandbox exec-server finalize failed", {
      processId: managed.processId,
      error: message,
    });
  });
  managed.evictProcess();
  notifyProcessWaiters(managed);
}
async function finalizeProcess(managed) {
  if (managed.finalized) return;
  managed.finalized = true;
  managed.child?.stdin.destroy();
  await managed.finalizeExec?.({
    status: managed.failure ? "failed" : "completed",
    exitCode: managed.exitCode,
    timedOut: false,
    token: managed.finalizeToken,
  });
}
function limitProcessChunks(chunks, maxBytes) {
  if (!maxBytes) return chunks;
  const retained = [];
  let retainedBytes = 0;
  for (const chunk of chunks) {
    const byteLength = Buffer.from(chunk.chunk, "base64").byteLength;
    if (retained.length > 0 && retainedBytes + byteLength > maxBytes) break;
    retained.push(chunk);
    retainedBytes += byteLength;
    if (retainedBytes >= maxBytes) break;
  }
  return retained;
}
/** Reads buffered process output, optionally waiting for new output or process close. */
async function readProcess(processes, params) {
  const record = requireObject(params, "process/read params");
  const managed = requireProcess(processes, requireString(record.processId, "processId"));
  const afterSeq = typeof record.afterSeq === "number" ? record.afterSeq : 0;
  const waitMs = typeof record.waitMs === "number" && record.waitMs > 0 ? record.waitMs : 0;
  if (!managed.exited && !hasChunksAtOrAfter(managed, afterSeq) && waitMs > 0)
    await waitForProcessUpdate(managed, waitMs);
  const chunks = limitProcessChunks(
    managed.chunks.filter((chunk) => chunk.seq > afterSeq),
    typeof record.maxBytes === "number" && record.maxBytes > 0 ? record.maxBytes : void 0,
  );
  const lastChunk = chunks.at(-1);
  return {
    chunks,
    nextSeq: lastChunk ? lastChunk.seq + 1 : managed.nextSeq,
    exited: managed.exited,
    exitCode: managed.exitCode,
    closed: managed.closed,
    failure: managed.failure,
  };
}
/** Writes base64 stdin data to a running process when stdin is still open. */
function writeProcess(processes, params) {
  const record = requireObject(params, "process/write params");
  const processId = requireString(record.processId, "processId");
  const managed = processes.get(processId);
  if (!managed) return { status: "unknownProcess" };
  const chunk = Buffer.from(requireString(record.chunk, "chunk"), "base64");
  if ((!managed.tty && !managed.pipeStdin) || managed.closed || !managed.child?.stdin.writable)
    return { status: "stdinClosed" };
  managed.child.stdin.write(chunk);
  return { status: "accepted" };
}
/** Requests process termination and reports whether it was running at call time. */
function terminateProcess(processes, params) {
  const processId = requireString(
    requireObject(params, "process/terminate params").processId,
    "processId",
  );
  const managed = processes.get(processId);
  if (!managed) return { running: false };
  const running = !managed.exited;
  managed.abortController.abort();
  managed.child?.kill("SIGTERM");
  if (running && !managed.child) emitProcessClosed(managed, null);
  return { running };
}
function waitForProcessUpdate(managed, waitMs) {
  return new Promise((resolve) => {
    const timer = setTimeout(done, Math.min(waitMs, 3e4));
    function done() {
      clearTimeout(timer);
      managed.waiters = managed.waiters.filter((waiter) => waiter !== done);
      resolve();
    }
    managed.waiters.push(done);
  });
}
function notifyProcessWaiters(managed) {
  const waiters = managed.waiters;
  managed.waiters = [];
  for (const waiter of waiters) waiter();
}
function hasChunksAtOrAfter(managed, afterSeq) {
  return managed.chunks.some((chunk) => chunk.seq > afterSeq);
}
function shellCommandFromArgv(argv) {
  return argv.map(shellEscape).join(" ");
}
function shellEscape(value) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function requireProcess(processes, processId) {
  const managed = processes.get(processId);
  if (!managed) throw new Error(`unknown process: ${processId}`);
  return managed;
}
function rejectUnsupportedArg0(value) {
  if (value === void 0 || value === null) return;
  if (typeof value === "string")
    throw new Error("Codex sandbox exec-server does not support arg0 overrides.");
  throw new Error("arg0 must be a string or null.");
}
function readEnv(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const env = {};
  for (const [key, rawValue] of Object.entries(value))
    if (typeof rawValue === "string" && ENV_KEY_RE.test(key)) env[key] = rawValue;
  return env;
}
function readProcessEnv(record) {
  return {
    ...buildEnvFromPolicy(record.envPolicy),
    ...readEnv(record.env),
  };
}
function buildEnvFromPolicy(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const policy = value;
  const inheritedEnv = readEnv(policy.set);
  const includeOnly = readStringList(policy.includeOnly);
  if (includeOnly.length > 0) filterEnvKeys(inheritedEnv, includeOnly, true);
  return inheritedEnv;
}
function filterEnvKeys(env, patterns, keepMatches) {
  if (patterns.length === 0) return;
  const regexes = patterns.map((pattern) => wildcardPatternToRegex(pattern));
  for (const key of Object.keys(env))
    if (regexes.some((regex) => regex.test(key)) !== keepMatches) delete env[key];
}
function wildcardPatternToRegex(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`^${escaped.replaceAll("*", ".*").replaceAll("?", ".")}$`, "iu");
}
function readStringList(value) {
  return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server.ts
/**
 * Hosts the local OpenClaw sandbox exec-server that Codex app-server native
 * execution can register as an external environment.
 */
const CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES = 100 * 1024 * 1024;
/** Starts or reuses a sandbox exec-server and registers it with Codex app-server. */
async function ensureCodexSandboxExecServerEnvironment(params) {
  if (!params.sandbox?.enabled || !params.sandbox.backend) return;
  if (!canExposeLocalExecServerToAppServer(params.appServerStartOptions))
    throw new Error(
      "OpenClaw Codex exec-server uses a local loopback URL and cannot be registered with a remote Codex app-server.",
    );
  const execServer = await acquireOpenClawExecServer(params.sandbox);
  try {
    await params.client.request(
      "environment/add",
      {
        environmentId: execServer.environmentId,
        execServerUrl: execServer.url,
      },
      {
        timeoutMs: params.timeoutMs,
        signal: params.signal,
      },
    );
  } catch (error) {
    await releaseOpenClawExecServer(execServer);
    if (isEnvironmentAddUnsupported(error)) {
      log.warn("codex app-server does not support remote environments yet", {
        environmentId: execServer.environmentId,
      });
      return;
    }
    throw error;
  }
  return {
    environmentId: execServer.environmentId,
    cwd: params.sandbox.containerWorkdir,
  };
}
/** Releases the sandbox exec-server lease associated with a sandbox runtime. */
async function releaseCodexSandboxExecServerEnvironment(sandbox) {
  if (!sandbox?.enabled) return;
  const server = await sandboxExecServerRegistry.servers
    .get(sandbox.runtimeId)
    ?.catch(() => void 0);
  if (server) await releaseOpenClawExecServer(server);
}
function isEnvironmentAddUnsupported(error) {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("environment/add") &&
    (error.message.includes("unknown variant") || error.message.includes("Method not found"))
  );
}
function canExposeLocalExecServerToAppServer(startOptions) {
  if (!startOptions || startOptions.transport !== "websocket") return true;
  if (typeof startOptions.url !== "string") return false;
  try {
    const host = new URL(startOptions.url).hostname.toLowerCase();
    const ipHost = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
    if (host === "localhost" || ipHost === "::1") return true;
    return isIP(ipHost) === 4 && ipHost.split(".")[0] === "127";
  } catch {
    return false;
  }
}
async function acquireOpenClawExecServer(sandbox) {
  const key = sandbox.runtimeId;
  while (true) {
    const promise =
      sandboxExecServerRegistry.servers.get(key) ?? startAndRememberOpenClawExecServer(sandbox);
    const server = await promise;
    if (!server.closed && sandboxExecServerRegistry.servers.get(key) === promise) {
      server.refCount += 1;
      return server;
    }
  }
}
function startAndRememberOpenClawExecServer(sandbox) {
  const created = startOpenClawExecServer(sandbox);
  const key = sandbox.runtimeId;
  sandboxExecServerRegistry.servers.set(key, created);
  created.catch(() => {
    if (sandboxExecServerRegistry.servers.get(key) === created)
      sandboxExecServerRegistry.servers.delete(key);
  });
  return created;
}
async function startOpenClawExecServer(sandbox) {
  const server = new WebSocketServer({
    host: "127.0.0.1",
    port: 0,
    maxPayload: CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES,
  });
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("OpenClaw Codex exec-server did not bind to a TCP port.");
  const environmentId = buildEnvironmentId(sandbox);
  const authPath = `/openclaw-${randomUUID()}`;
  const execServer = {
    authPath,
    closed: false,
    environmentId,
    refCount: 0,
    url: `ws://127.0.0.1:${address.port}${authPath}`,
    sandbox,
    server,
  };
  server.on("connection", (socket, request) => {
    socket.on("error", handleExecServerSocketError);
    if (!isAuthorizedExecServerRequest(execServer, request)) {
      socket.close(1008, "unauthorized");
      return;
    }
    handleConnection(execServer, socket);
  });
  log.info("codex sandbox exec-server started", {
    environmentId,
    runtimeId: sandbox.runtimeId,
    backendId: sandbox.backendId,
  });
  return execServer;
}
async function releaseOpenClawExecServer(execServer) {
  if (execServer.closed) return;
  execServer.refCount = Math.max(0, execServer.refCount - 1);
  if (execServer.refCount > 0) return;
  const current = await sandboxExecServerRegistry.servers
    .get(execServer.sandbox.runtimeId)
    ?.catch(() => void 0);
  if (execServer.refCount > 0 || execServer.closed) return;
  if (current === execServer)
    sandboxExecServerRegistry.servers.delete(execServer.sandbox.runtimeId);
  await closeOpenClawExecServer(execServer);
}
async function closeOpenClawExecServer(execServer) {
  if (execServer.closed) return;
  execServer.closed = true;
  for (const client of execServer.server.clients) client.close(1001, "shutdown");
  await new Promise((resolve) => {
    execServer.server.close(() => resolve());
  });
}
function buildEnvironmentId(sandbox) {
  return `openclaw-sandbox-${createHash("sha256").update(sandbox.runtimeId).digest("hex").slice(0, 16)}`;
}
function isAuthorizedExecServerRequest(execServer, request) {
  return new URL(request.url ?? "", "ws://127.0.0.1").pathname === execServer.authPath;
}
function handleConnection(execServer, socket) {
  const processes = /* @__PURE__ */ new Map();
  socket.on("message", (data) => {
    handleMessage(execServer, processes, socket, data).catch((error) => {
      log.warn("codex sandbox exec-server message failed", { error });
    });
  });
  socket.on("close", () => {
    for (const process of processes.values()) process.abortController.abort();
  });
}
function handleExecServerSocketError(error) {
  log.debug("codex sandbox exec-server websocket failed", { error });
}
async function handleMessage(execServer, processes, socket, data) {
  const request = parseRequest(data);
  if (!request.method) {
    sendError(socket, request.id, -32600, "Invalid Request");
    return;
  }
  const method = request.method;
  if (request.id === void 0) {
    if (method !== "initialized")
      sendError(socket, -1, -32600, `Unexpected notification: ${method}`);
    return;
  }
  try {
    const result = await dispatchRequest(execServer, processes, socket, {
      ...request,
      method,
    });
    sendResult(socket, request.id, result);
  } catch (error) {
    sendError(
      socket,
      request.id,
      error instanceof JsonRpcProtocolError ? error.code : -32603,
      error instanceof Error ? error.message : String(error),
    );
  }
}
async function dispatchRequest(execServer, processes, socket, request) {
  switch (request.method) {
    case "initialize":
      return { sessionId: randomUUID() };
    case "process/start":
      return startProcess(execServer, processes, socket, request.params);
    case "process/read":
      return await readProcess(processes, request.params);
    case "process/write":
      return writeProcess(processes, request.params);
    case "process/terminate":
      return terminateProcess(processes, request.params);
    case "fs/readFile":
      return await readFile$1(execServer, request.params);
    case "fs/writeFile":
      await writeFile$1(execServer, request.params);
      return {};
    case "fs/createDirectory":
      await createDirectory(execServer, request.params);
      return {};
    case "fs/getMetadata":
      return await getMetadata(execServer, request.params);
    case "fs/readDirectory":
      return await readDirectory(execServer, request.params);
    case "fs/remove":
      await removePath(execServer, request.params);
      return {};
    case "fs/copy":
      await copyPath(execServer, request.params);
      return {};
    case "http/request":
      return await httpRequest(execServer, socket, request.params);
    default:
      throw new Error(`Unsupported OpenClaw sandbox exec-server method: ${request.method}`);
  }
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-resources.ts
function prepareCodexAttemptResources(prompt) {
  const { context, turnState, buildRenderedCodexDeveloperInstructions } = prompt;
  const { runtime, attemptTools } = context;
  const { connection, hookChannelId } = runtime;
  const {
    params,
    effectiveCwd,
    sessionAgentId,
    sandboxSessionKey,
    runAbortController,
    sandbox,
    options,
    nativeHookRelayEvents,
  } = connection;
  const { toolBridge } = attemptTools;
  const hostTrajectoryRecorder = params.trajectoryRecorder;
  const trajectoryRecorder = createCodexTrajectoryRecorder({
    attempt: params,
    cwd: effectiveCwd,
    developerInstructions: buildRenderedCodexDeveloperInstructions(),
    prompt: turnState.codexTurnPromptText,
    trajectoryRecorder: hostTrajectoryRecorder,
    trajectorySessionFile: params.trajectorySessionFile,
    tools: toolBridge.availableSpecs,
    warn: (message, fields) => log.warn(message, fields),
  });
  const state = {
    client: void 0,
    thread: void 0,
    runtimeArtifact: void 0,
    turnRouter: void 0,
    turnRoute: void 0,
    routeActivated: false,
    detachRouteAbort: () => void 0,
    trajectoryEndRecorded: false,
    nativeHookRelay: void 0,
    nativeSubagentMonitor: void 0,
    nativePreToolUseFailureFallbackActive: false,
    nativePreToolUseFailureFallbackTerminalReason: void 0,
    releaseSharedClientLease: void 0,
    sharedCodexClientRetiredForOneShotCleanup: false,
    sandboxExecEnvironmentAcquired: false,
    codexEnvironmentSelection: void 0,
    codexExecutionCwd: effectiveCwd,
    codexSandboxPolicy: void 0,
    restartContextEngineCodexThread: void 0,
  };
  const pendingNativePreToolUseFailures = [];
  const projectorRef = {};
  const emitNativePreToolUseFailure = (failure) => {
    emitCodexNativePreToolUseFailureDiagnostic({
      agentId: sessionAgentId,
      sessionId: params.sessionId,
      sessionKey: sandboxSessionKey,
      runId: params.runId,
      signal: runAbortController.signal,
      failure,
      ...(state.nativePreToolUseFailureFallbackActive
        ? {
            terminalReason:
              state.nativePreToolUseFailureFallbackTerminalReason ?? failure.disposition,
          }
        : {}),
    });
  };
  const flushPendingNativePreToolUseFailures = () => {
    for (const failure of pendingNativePreToolUseFailures.splice(0))
      emitNativePreToolUseFailure(failure);
  };
  const activateNativePreToolUseFailureFallback = () => {
    if (!state.nativePreToolUseFailureFallbackActive) {
      state.nativePreToolUseFailureFallbackTerminalReason = runAbortController.signal.aborted
        ? resolveCodexToolAbortTerminalReason(runAbortController.signal)
        : void 0;
      state.nativePreToolUseFailureFallbackActive = true;
    }
    flushPendingNativePreToolUseFailures();
  };
  const releaseSharedClientLeaseOnce = () => {
    const release = state.releaseSharedClientLease;
    if (!release) return;
    state.releaseSharedClientLease = void 0;
    release();
  };
  const retireSharedCodexClientForOneShotCleanup = async () => {
    if (params.cleanupBundleMcpOnRunEnd !== true || state.sharedCodexClientRetiredForOneShotCleanup)
      return;
    state.sharedCodexClientRetiredForOneShotCleanup = true;
    const retired = retireSharedCodexAppServerClientIfCurrent(state.client);
    log.info("codex app-server one-shot cleanup retired shared client", {
      runId: params.runId,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      activeLeases: retired?.activeLeases ?? null,
      closed: retired?.closed ?? false,
      matchedSharedClient: Boolean(retired),
    });
    if (retired?.closed)
      await state.client.closeAndWait({
        exitTimeoutMs: 2e3,
        forceKillDelayMs: 250,
      });
  };
  const releaseSharedClientLeaseAndRetireOneShotClient = async () => {
    releaseSharedClientLeaseOnce();
    await retireSharedCodexClientForOneShotCleanup();
  };
  const releaseSandboxExecEnvironment = async () => {
    if (state.sandboxExecEnvironmentAcquired) {
      state.sandboxExecEnvironmentAcquired = false;
      await releaseCodexSandboxExecServerEnvironment(sandbox);
    }
  };
  const unregisterNativeSubagentMonitor = () => {
    state.nativeSubagentMonitor?.unregister();
    state.nativeSubagentMonitor = void 0;
  };
  const registerNativeSubagentMonitor = (parentThreadId) => {
    unregisterNativeSubagentMonitor();
    state.nativeSubagentMonitor = codexNativeSubagentMonitorRuntime.register({
      client: state.client,
      parentThreadId,
      requesterSessionKey: params.sessionKey,
      taskRuntimeScope: params.agentHarnessTaskRuntimeScope,
      agentId: sessionAgentId,
      retainClient: () => retainSharedCodexAppServerClientIfCurrent(state.client),
    });
  };
  const releaseCurrentRoute = () => {
    state.detachRouteAbort();
    state.detachRouteAbort = () => void 0;
    state.turnRoute?.release();
    state.turnRoute = void 0;
    state.routeActivated = false;
    unregisterNativeSubagentMonitor();
  };
  const startupTimeoutMs = resolveCodexStartupTimeoutMs({
    timeoutMs: params.timeoutMs,
    timeoutFloorMs: options.startupTimeoutFloorMs,
  });
  const buildNativeHookRelayFinalConfigPatch = (decision) => {
    state.nativeHookRelay?.unregister();
    state.nativeHookRelay = createCodexNativeHookRelay({
      options: options.nativeHookRelay,
      generation:
        decision.action === "resume" ? decision.binding.nativeHookRelayGeneration : void 0,
      generationMismatchGraceMs:
        decision.action === "resume" && !decision.binding.nativeHookRelayGeneration
          ? CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS
          : void 0,
      events: nativeHookRelayEvents,
      agentId: sessionAgentId,
      sessionId: params.sessionId,
      sessionKey: sandboxSessionKey,
      config: params.config,
      runId: params.runId,
      channelId: hookChannelId,
      attemptTimeoutMs: params.timeoutMs,
      startupTimeoutMs,
      turnStartTimeoutMs: params.timeoutMs,
      signal: runAbortController.signal,
      onPreToolUseFailure: (failure) => {
        const projector = projectorRef.current;
        if (projector) projector.recordNativeToolPreToolUseFailure(failure);
        else if (state.nativePreToolUseFailureFallbackActive) emitNativePreToolUseFailure(failure);
        else pendingNativePreToolUseFailures.push(failure);
      },
    });
    return {
      configPatch: state.nativeHookRelay
        ? buildCodexNativeHookRelayConfig({
            relay: state.nativeHookRelay,
            events: nativeHookRelayEvents,
            hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec,
          })
        : options.nativeHookRelay?.enabled === false
          ? buildCodexNativeHookRelayDisabledConfig()
          : void 0,
      nativeHookRelayGeneration: state.nativeHookRelay?.generation,
    };
  };
  return {
    prompt,
    trajectoryRecorder,
    state,
    projectorRef,
    pendingNativePreToolUseFailures,
    markTrajectoryEndRecorded: () => {
      state.trajectoryEndRecorded = true;
    },
    activateNativePreToolUseFailureFallback,
    releaseSharedClientLeaseOnce,
    releaseSharedClientLeaseAndRetireOneShotClient,
    releaseSandboxExecEnvironment,
    registerNativeSubagentMonitor,
    releaseCurrentRoute,
    startupTimeoutMs,
    buildNativeHookRelayFinalConfigPatch,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-route.ts
async function prepareCodexAttemptRoute(
  resources,
  turnRuntime,
  notifications,
  handleServerRequest,
) {
  const {
    prompt,
    state: resourceState,
    trajectoryRecorder,
    releaseCurrentRoute,
    registerNativeSubagentMonitor,
    activateNativePreToolUseFailureFallback,
    releaseSandboxExecEnvironment,
    releaseSharedClientLeaseOnce,
  } = resources;
  const { connection } = prompt.context.runtime;
  const { params, runAbortController, abortFromUpstream } = connection;
  const { state, turnIdRef, turnWatches } = turnRuntime;
  const { noteNotificationReceived, enqueueNotification } = notifications;
  const attachRouteAbort = (route) => {
    const onAbort = () => {
      if (
        state.completed ||
        state.terminalTurnNotificationQueued ||
        runAbortController.signal.aborted
      )
        return;
      const reasonText = formatErrorMessage(route.signal.reason);
      const closedClient = reasonText.includes("turn router closed");
      state.clientClosedPromptError = closedClient
        ? "codex app-server client closed before turn completed"
        : `codex app-server turn route closed before turn completed: ${reasonText}`;
      state.clientClosedAbort = closedClient;
      const activeTurnId = turnIdRef.current;
      if (activeTurnId)
        trajectoryRecorder?.recordEvent("turn.client_closed", {
          threadId: resourceState.thread.threadId,
          turnId: activeTurnId,
        });
      log.warn(state.clientClosedPromptError, {
        threadId: resourceState.thread.threadId,
        turnId: activeTurnId,
      });
      runAbortController.abort(closedClient ? "client_closed" : "turn_route_closed");
      state.completed = true;
      turnWatches.clearAllTimers();
      state.resolveCompletion?.();
    };
    route.signal.addEventListener("abort", onAbort, { once: true });
    if (route.signal.aborted) onAbort();
    return () => route.signal.removeEventListener("abort", onAbort);
  };
  const ensureCurrentThreadRoute = async () => {
    if (resourceState.turnRoute?.threadId !== resourceState.thread.threadId) {
      releaseCurrentRoute();
      resourceState.turnRoute = resourceState.turnRouter.reserveThread({
        threadId: resourceState.thread.threadId,
        releaseOn: runAbortController.signal,
      });
    }
    if (!resourceState.turnRoute) throw new Error("codex app-server turn route was not reserved");
    if (!resourceState.routeActivated) {
      if (!resourceState.nativeSubagentMonitor)
        registerNativeSubagentMonitor(resourceState.thread.threadId);
      resourceState.detachRouteAbort = attachRouteAbort(resourceState.turnRoute);
      await resourceState.turnRoute.activate({
        onNotificationReceived: noteNotificationReceived,
        onNotification: enqueueNotification,
        onRequest: handleServerRequest,
      });
      resourceState.routeActivated = true;
    }
    return resourceState.turnRoute;
  };
  try {
    await ensureCurrentThreadRoute();
  } catch (error) {
    activateNativePreToolUseFailureFallback();
    releaseCurrentRoute();
    resourceState.nativeHookRelay?.unregister();
    await releaseSandboxExecEnvironment();
    releaseSharedClientLeaseOnce();
    params.abortSignal?.removeEventListener("abort", abortFromUpstream);
    throw error;
  }
  return { ensureCurrentThreadRoute };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-runtime.ts
async function prepareCodexAttemptRuntime(connection) {
  const {
    params,
    pluginConfig,
    usesSupervisionConnection,
    appServer,
    startupAuthProfileId,
    startupPreparedAuth,
    startupClientAuthProfileId,
    agentDir,
    preDynamicStartupStages,
    effectiveWorkspace,
    contextSessionKey,
    sandboxSessionKey,
    sessionAgentId,
    sandbox,
    attemptClientFactory,
    runAbortController,
    activeContextEngine,
    mutable,
  } = connection;
  const preparedAuthBinding =
    !usesSupervisionConnection && appServer.start.homeScope !== "user" && startupAuthProfileId
      ? await prepareCodexAppServerAuthBinding({
          authProfileId: startupAuthProfileId,
          authProfileStore: params.authProfileStore,
          agentDir,
          config: params.config,
        })
      : void 0;
  const attemptAuthProfileStore = preparedAuthBinding?.authProfileStore ?? params.authProfileStore;
  const effectiveContextWindowInfo = usesSupervisionConnection ? void 0 : params.contextWindowInfo;
  const effectiveContextTokenBudget = usesSupervisionConnection
    ? void 0
    : params.contextTokenBudget;
  const effectiveRuntimeProviderId = usesSupervisionConnection
    ? (mutable.startupBinding?.modelProvider ?? "codex")
    : params.provider;
  const effectiveRuntimeModelId = usesSupervisionConnection
    ? (mutable.startupBinding?.model ?? "codex-native")
    : params.modelId;
  const {
    authProfileId: _outerAuthProfileId,
    contextWindowInfo: _outerContextWindowInfo,
    contextTokenBudget: _outerContextTokenBudget,
    model: _outerModel,
    modelId: _outerModelId,
    provider: _outerProvider,
    runtimePlan: _outerRuntimePlan,
    requestedModelId: _outerRequestedModelId,
    fallbackReason: _outerFallbackReason,
    degradedReason: _outerDegradedReason,
    thinkLevel: _outerThinkLevel,
    fastMode: _outerFastMode,
    ...paramsWithoutOuterNativeOwnership
  } = params;
  const supervisedRuntimeModel = {
    id: effectiveRuntimeModelId,
    name: effectiveRuntimeModelId,
    provider: effectiveRuntimeProviderId,
    api: "openai-chatgpt-responses",
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow: void 0,
    maxTokens: void 0,
  };
  const runtimeParams = usesSupervisionConnection
    ? {
        ...paramsWithoutOuterNativeOwnership,
        provider: "codex",
        modelId: effectiveRuntimeModelId,
        model: supervisedRuntimeModel,
        thinkLevel: _outerThinkLevel,
        sessionKey: contextSessionKey,
      }
    : {
        ...params,
        authProfileStore: attemptAuthProfileStore,
        sessionKey: contextSessionKey,
        ...(startupAuthProfileId ? { authProfileId: startupAuthProfileId } : {}),
      };
  const activeSessionId = params.sessionId;
  const activeSessionFile = params.sessionFile;
  const buildActiveRunAttemptParams = () => ({
    ...runtimeParams,
    sessionId: activeSessionId,
    sessionFile: activeSessionFile,
  });
  const startupAuthAccountCacheKey = usesSupervisionConnection
    ? void 0
    : startupPreparedAuth?.kind === "api-key"
      ? resolveCodexAppServerPreparedApiKeyCacheKey(startupPreparedAuth.apiKey)
      : startupPreparedAuth?.kind === "profile"
        ? startupPreparedAuth.snapshot?.secretFreeCacheKey
        : await resolveCodexAppServerAuthAccountCacheKey({
            authProfileId: startupAuthProfileId,
            authProfileStore: attemptAuthProfileStore,
            agentDir,
            config: params.config,
          });
  const startupEnvApiKeyCacheKey = usesSupervisionConnection
    ? void 0
    : startupPreparedAuth || startupAuthProfileId
      ? void 0
      : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start });
  preDynamicStartupStages.mark("auth-cache");
  const bundleMcpThreadConfig = await loadCodexBundleMcpThreadConfig({
    workspaceDir: effectiveWorkspace,
    cfg: params.config,
    toolsEnabled: usesSupervisionConnection || supportsModelTools(params.model),
    disableTools: params.disableTools,
    toolsAllow: params.toolsAllow,
  });
  preDynamicStartupStages.mark("bundle-mcp");
  const sandboxExecServerEnabled = isCodexSandboxExecServerEnabled(pluginConfig);
  const nativeToolSurfaceEnabled = shouldEnableCodexAppServerNativeToolSurface(
    runtimeParams,
    sandbox,
    {
      agentId: sessionAgentId,
      runtimeSessionKey: sandboxSessionKey,
      sandboxExecServerEnabled,
    },
  );
  preDynamicStartupStages.mark("native-tool-surface");
  const nativeProviderWebSearchSupport =
    resolveCodexWebSearchPlan({
      config: params.config,
      disableTools: params.disableTools,
      nativeToolSurfaceEnabled,
    }).kind === "native-hosted"
      ? await resolveCodexProviderWebSearchSupport({
          clientFactory: attemptClientFactory,
          appServer,
          authProfileId: startupClientAuthProfileId,
          preparedAuth: startupPreparedAuth,
          agentDir,
          config: params.config,
          modelProviderOverride: usesSupervisionConnection
            ? mutable.startupBinding?.modelProvider
            : resolveCodexAppServerThreadModelSelection({
                provider: params.provider,
                model: params.modelId,
                binding: mutable.startupBinding,
                authProfileId: startupAuthProfileId,
                authProfileStore: attemptAuthProfileStore,
                agentDir,
                config: params.config,
              }).modelProvider,
          signal: runAbortController.signal,
        })
      : "unsupported";
  preDynamicStartupStages.mark("provider-capabilities");
  for (const diagnostic of bundleMcpThreadConfig.diagnostics)
    log.warn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
  if (activeContextEngine)
    assertContextEngineHostSupport({
      contextEngine: activeContextEngine,
      operation: "agent-run",
      host: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
    });
  const hookChannelId = resolveCodexAppServerHookChannelId(params, sandboxSessionKey);
  preDynamicStartupStages.mark("context-engine-support");
  return {
    connection,
    preparedAuthBinding,
    runtimeParams,
    activeSessionId,
    activeSessionFile,
    buildActiveRunAttemptParams,
    attemptAuthProfileStore,
    effectiveContextWindowInfo,
    effectiveContextTokenBudget,
    effectiveRuntimeProviderId,
    effectiveRuntimeModelId,
    startupAuthAccountCacheKey,
    startupEnvApiKeyCacheKey,
    bundleMcpThreadConfig,
    sandboxExecServerEnabled,
    nativeToolSurfaceEnabled,
    nativeProviderWebSearchSupport,
    hookChannelId,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-tools.ts
function toTranscriptToolResult(response) {
  const sanitized = sanitizeCodexToolResponse(response);
  const contentItems = Array.isArray(sanitized.contentItems) ? sanitized.contentItems : [];
  const result = {
    ...sanitized,
    content: contentItems.map(toTranscriptToolResultContentItem),
  };
  delete result.contentItems;
  delete result.success;
  return result;
}
function toTranscriptToolResultContentItem(item) {
  if (!item || typeof item !== "object")
    return {
      type: "text",
      text: "",
    };
  const record = item;
  if (record.type === "inputText")
    return {
      type: "text",
      text: typeof record.text === "string" ? record.text : "",
    };
  if (record.type === "inputImage")
    return typeof record.imageUrl === "string"
      ? {
          type: "image",
          url: record.imageUrl,
        }
      : {
          type: "text",
          text: formatUnsupportedCodexDynamicToolOutput(record.type),
        };
  return {
    type: "text",
    text: formatUnsupportedCodexDynamicToolOutput(record.type),
  };
}
function formatUnsupportedCodexDynamicToolOutput(type) {
  const rawType = typeof type === "string" ? type.replace(/\s+/g, " ").trim() : "";
  return `[Unsupported Codex dynamic tool output: ${rawType ? truncateUtf16Safe(rawType, 80) : "unknown"}${rawType.length > 80 ? "..." : ""}]`;
}
function createCodexDynamicToolExecutionRegistry() {
  const executions = /* @__PURE__ */ new Map();
  const keyFor = (call) => JSON.stringify([call.threadId, call.turnId, call.callId]);
  return {
    get(call) {
      return executions.get(keyFor(call));
    },
    claim(call, start) {
      const existing = executions.get(keyFor(call));
      if (existing)
        return {
          execution: existing,
          replayed: true,
        };
      const execution = start();
      executions.set(keyFor(call), execution);
      return {
        execution,
        replayed: false,
      };
    },
  };
}
function handleApprovalRequest(params) {
  return handleCodexAppServerApprovalRequest({
    method: params.method,
    requestParams: params.params,
    paramsForRun: params.paramsForRun,
    threadId: params.threadId,
    turnId: params.turnId,
    nativeHookRelay: params.nativeHookRelay,
    autoApprove: params.autoApprove,
    signal: params.signal,
    onNativeToolFailureDisposition: params.onNativeToolFailureDisposition,
  });
}
function resolveCodexDynamicToolDirectNames(params, hostCrestodianActive = false) {
  const names = [];
  if (hostCrestodianActive && isCrestodianOnlyCodexDynamicToolAllowlist(params.toolsAllow))
    names.push("crestodian");
  if (params.sourceReplyDeliveryMode === "message_tool_only") names.push("message");
  return names;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-server-requests.ts
function createCodexAttemptServerRequestController(resources, turnRuntime, lifecycle) {
  const { prompt, state: resourceState, projectorRef, trajectoryRecorder } = resources;
  const { context } = prompt;
  const { runtime, attemptTools } = context;
  const { connection } = runtime;
  const { params, computerUseConfig, runAbortController, appServer, sessionAgentId } = connection;
  const {
    toolBridge,
    toolOutcomeOrdinals,
    suppressedDynamicToolOutcomeOrdinals,
    allocateCodexToolOutcomeOrdinal,
  } = attemptTools;
  const {
    state,
    turnIdRef,
    userInputBridgeRef,
    openClawDynamicToolExecutions,
    pendingOpenClawDynamicToolCompletionIds,
    postToolRawAssistantCompletionIdleTimeoutMs,
    turnWatches,
  } = turnRuntime;
  const {
    emitExecutionPhaseOnce,
    scheduleTurnReleaseAfterTerminalDynamicTool,
    scheduleTerminalDynamicToolReleaseCheck,
  } = lifecycle;
  const handleServerRequest = async (request, scope) => {
    const turnId = turnIdRef.current;
    const projector = projectorRef.current;
    let armCompletionWatchOnResponse = false;
    let requestCountsAsTurnActivity = false;
    const markCurrentTurnRequestProgress = () => {
      state.activeAppServerTurnRequests += 1;
      turnWatches.clearCompletionIdleTimer();
      turnWatches.disarmAssistantCompletionIdleWatch();
      requestCountsAsTurnActivity = true;
      turnWatches.touchActivity(`request:${request.method}:start`, { attemptProgress: true });
    };
    try {
      if (!turnId) return;
      if (request.method === "mcpServer/elicitation/request") {
        if (!scope.turnId || scope.turnId === turnId) {
          armCompletionWatchOnResponse = true;
          markCurrentTurnRequestProgress();
        }
        return await handleCodexAppServerElicitationRequest({
          requestParams: request.params,
          paramsForRun: params,
          threadId: resourceState.thread.threadId,
          turnId,
          pluginAppPolicyContext: resourceState.thread.pluginAppPolicyContext,
          ...(computerUseConfig.enabled
            ? { computerUseMcpServerName: computerUseConfig.mcpServerName }
            : {}),
          signal: runAbortController.signal,
        });
      }
      if (request.method === "item/tool/requestUserInput") {
        if (scope.turnId === turnId) {
          armCompletionWatchOnResponse = true;
          markCurrentTurnRequestProgress();
        }
        return userInputBridgeRef.current?.handleRequest({
          id: request.id,
          params: request.params,
        });
      }
      if (request.method !== "item/tool/call") {
        if (isCodexAppServerApprovalRequest(request.method)) {
          if (scope.turnId === turnId) {
            armCompletionWatchOnResponse = true;
            markCurrentTurnRequestProgress();
          }
          return handleApprovalRequest({
            method: request.method,
            params: request.params,
            paramsForRun: params,
            threadId: resourceState.thread.threadId,
            turnId,
            nativeHookRelay: resourceState.nativeHookRelay,
            autoApprove: shouldAutoApproveCodexAppServerApprovals(appServer),
            signal: runAbortController.signal,
            onNativeToolFailureDisposition: (itemId, disposition) =>
              projector?.recordNativeToolApprovalFailure(itemId, disposition),
          });
        }
        return;
      }
      const call = readCodexDynamicToolCallParams(request.params);
      if (!call || call.threadId !== resourceState.thread.threadId || call.turnId !== turnId)
        return;
      const replayedExecution = openClawDynamicToolExecutions.get(call);
      if (replayedExecution) {
        armCompletionWatchOnResponse = true;
        markCurrentTurnRequestProgress();
        state.turnCrossedToolHandoff = true;
        return toCodexDynamicToolProtocolResponse(await replayedExecution);
      }
      const toolCallOrdinal = allocateCodexToolOutcomeOrdinal?.(call.callId);
      armCompletionWatchOnResponse = true;
      markCurrentTurnRequestProgress();
      state.turnCrossedToolHandoff = true;
      pendingOpenClawDynamicToolCompletionIds.add(call.callId);
      trajectoryRecorder?.recordEvent("tool.call", {
        threadId: call.threadId,
        turnId: call.turnId,
        toolCallId: call.callId,
        name: call.tool,
        arguments: call.arguments,
      });
      projector?.recordDynamicToolCall({
        callId: call.callId,
        tool: call.tool,
        arguments: call.arguments,
      });
      emitExecutionPhaseOnce(`tool:${call.callId}`, {
        phase: "tool_execution_started",
        tool: call.tool,
        toolCallId: call.callId,
      });
      emitDynamicToolStartedDiagnostic({
        call,
        agentId: sessionAgentId,
        runId: params.runId,
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
      });
      const toolMeta = inferCodexDynamicToolMeta(
        call,
        resolveCodexToolProgressDetailMode(params.toolProgressDetail),
      );
      const toolArgs = sanitizeCodexToolArguments(call.arguments);
      const shouldEmitDynamicToolProgress = shouldEmitTranscriptToolProgress(call.tool, toolArgs);
      if (shouldEmitDynamicToolProgress)
        emitCodexAppServerEvent(params, {
          stream: "tool",
          data: {
            phase: "start",
            name: call.tool,
            toolCallId: call.callId,
            ...(toolMeta ? { meta: toolMeta } : {}),
            ...(toolArgs ? { args: toolArgs } : {}),
          },
        });
      const dynamicToolTimeoutMs = resolveDynamicToolCallTimeoutMs({
        call,
        config: params.config,
      });
      const toolStartedAt = Date.now();
      let terminalDiagnosticObserved = false;
      const unsubscribeToolDiagnosticObserver = onInternalDiagnosticEvent((event) => {
        if (
          isDynamicToolTerminalDiagnosticEvent(event) &&
          isMatchingDynamicToolTerminalDiagnostic({
            event,
            call,
            runId: params.runId,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
          })
        )
          terminalDiagnosticObserved = true;
      });
      try {
        const { execution } = openClawDynamicToolExecutions.claim(call, () =>
          handleDynamicToolCallWithTimeout({
            call,
            toolBridge,
            signal: runAbortController.signal,
            timeoutMs: dynamicToolTimeoutMs,
            toolCallOrdinal,
            onAgentToolResult: params.onAgentToolResult,
            onFallbackSelected: () => {
              if (toolCallOrdinal !== void 0)
                suppressedDynamicToolOutcomeOrdinals.add(toolCallOrdinal);
            },
            onTimeout: () => {
              trajectoryRecorder?.recordEvent("tool.timeout", {
                threadId: call.threadId,
                turnId: call.turnId,
                toolCallId: call.callId,
                name: call.tool,
                timeoutMs: dynamicToolTimeoutMs,
              });
            },
          }),
        );
        const response = await execution;
        const protocolResponse = toCodexDynamicToolProtocolResponse(response);
        if (!protocolResponse.success && toolCallOrdinal !== void 0) {
          suppressedDynamicToolOutcomeOrdinals.add(toolCallOrdinal);
          params.onToolOutcome?.({
            toolName: call.tool,
            argsHash: "",
            resultHash: "",
            toolCallOrdinal,
            terminalPresentation: void 0,
            presentationOnly: true,
          });
        }
        const toolDurationMs = Math.max(0, Date.now() - toolStartedAt);
        trajectoryRecorder?.recordEvent("tool.result", {
          threadId: call.threadId,
          turnId: call.turnId,
          toolCallId: call.callId,
          name: call.tool,
          success: protocolResponse.success,
          contentItems: protocolResponse.contentItems,
        });
        projector?.recordDynamicToolResult({
          callId: call.callId,
          tool: call.tool,
          asyncStarted: response.asyncStarted === true,
          success: protocolResponse.success,
          terminalType:
            response.diagnosticTerminalType ?? (protocolResponse.success ? "completed" : "error"),
          sideEffectEvidence: response.sideEffectEvidence === true,
          contentItems: protocolResponse.contentItems,
        });
        if (shouldEmitDynamicToolProgress) {
          const progressResponse = toCodexDynamicToolProgressResponse(response, protocolResponse);
          emitCodexAppServerEvent(params, {
            stream: "tool",
            data: {
              phase: "result",
              name: call.tool,
              toolCallId: call.callId,
              ...(toolMeta ? { meta: toolMeta } : {}),
              isError: !protocolResponse.success,
              result: toTranscriptToolResult(progressResponse),
            },
          });
        }
        if (
          !terminalDiagnosticObserved &&
          !hasPendingDynamicToolTerminalDiagnostic({
            call,
            runId: params.runId,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
          })
        )
          emitDynamicToolTerminalDiagnostic({
            response,
            call,
            agentId: sessionAgentId,
            runId: params.runId,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            durationMs: toolDurationMs,
          });
        pendingOpenClawDynamicToolCompletionIds.delete(call.callId);
        if (response.terminate === true)
          scheduleTurnReleaseAfterTerminalDynamicTool({
            call,
            response,
            durationMs: toolDurationMs,
          });
        else if (!shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response))
          scheduleTerminalDynamicToolReleaseCheck();
        else {
          state.currentTurnHadNonTerminalDynamicToolResult = true;
          state.pendingTerminalDynamicToolRelease = void 0;
        }
        return protocolResponse;
      } catch (error) {
        pendingOpenClawDynamicToolCompletionIds.delete(call.callId);
        if (
          !terminalDiagnosticObserved &&
          !hasPendingDynamicToolTerminalDiagnostic({
            call,
            runId: params.runId,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
          })
        )
          emitDynamicToolErrorDiagnostic({
            call,
            agentId: sessionAgentId,
            runId: params.runId,
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            durationMs: Math.max(0, Date.now() - toolStartedAt),
          });
        throw error;
      } finally {
        toolOutcomeOrdinals.delete(call.callId);
        unsubscribeToolDiagnosticObserver();
      }
    } finally {
      if (requestCountsAsTurnActivity) {
        state.activeAppServerTurnRequests = Math.max(0, state.activeAppServerTurnRequests - 1);
        const postToolContinuationTimeoutMs =
          request.method === "item/tool/call" && state.turnCrossedToolHandoff
            ? postToolRawAssistantCompletionIdleTimeoutMs
            : void 0;
        turnWatches.touchActivity(`request:${request.method}:response`, {
          arm: armCompletionWatchOnResponse,
          attemptProgress: true,
          ...(postToolContinuationTimeoutMs !== void 0
            ? { attemptTimeoutMs: postToolContinuationTimeoutMs }
            : {}),
        });
        if (armCompletionWatchOnResponse && postToolContinuationTimeoutMs !== void 0)
          turnWatches.armCompletionIdleWatch({ timeoutMs: postToolContinuationTimeoutMs });
        scheduleTerminalDynamicToolReleaseCheck();
      } else turnWatches.scheduleProgressWatches();
    }
  };
  return { handleServerRequest };
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-health.ts
const COMPUTER_USE_HEALTH_MONITOR_STATE = Symbol.for("openclaw.codexComputerUseHealthMonitorState");
function getComputerUseHealthMonitorState() {
  const globalState = globalThis;
  globalState[COMPUTER_USE_HEALTH_MONITOR_STATE] ??= { monitors: /* @__PURE__ */ new WeakMap() };
  return globalState[COMPUTER_USE_HEALTH_MONITOR_STATE];
}
function startCodexComputerUseHealthMonitor(params) {
  const state = getComputerUseHealthMonitorState();
  const existing = state.monitors.get(params.client);
  if (!params.config.enabled || !params.config.healthCheckEnabled) {
    if (existing) clearComputerUseHealthMonitor(params.client, existing);
    return {
      started: false,
      reason: params.config.enabled ? "health_disabled" : "disabled",
    };
  }
  const fingerprint = buildComputerUseHealthMonitorFingerprint(params.config);
  const intervalMs = params.config.healthCheckIntervalMinutes * 6e4;
  if (
    existing?.fingerprint === fingerprint &&
    existing.repairComputerUseMcpChildren === params.repairComputerUseMcpChildren
  )
    return {
      started: false,
      intervalMs,
      reason: "already_started",
    };
  if (existing) clearComputerUseHealthMonitor(params.client, existing);
  const repairComputerUseMcpChildren =
    params.repairComputerUseMcpChildren ??
    (() => killStaleComputerUseMcpChildren({ ancestorPid: params.client.getTransportPid() }));
  const monitor = {
    fingerprint,
    intervalMs,
    repairComputerUseMcpChildren: params.repairComputerUseMcpChildren,
    timer: setInterval(() => {
      runCodexComputerUseHealthProbe(params.client, params.config, monitor, {
        repairComputerUseMcpChildren,
      });
    }, intervalMs),
    disposeCloseHandler: () => void 0,
    running: false,
  };
  monitor.timer.unref?.();
  monitor.disposeCloseHandler = params.client.addCloseHandler((client) => {
    const active = state.monitors.get(client);
    if (active) clearComputerUseHealthMonitor(client, active);
  });
  state.monitors.set(params.client, monitor);
  return {
    started: true,
    intervalMs,
  };
}
function buildComputerUseHealthMonitorFingerprint(config) {
  return JSON.stringify({
    autoRepair: config.autoRepair,
    healthCheckIntervalMinutes: config.healthCheckIntervalMinutes,
    liveTestTimeoutMs: config.liveTestTimeoutMs,
    mcpServerName: config.mcpServerName,
    toolCallTimeoutMs: config.toolCallTimeoutMs,
  });
}
async function runCodexComputerUseHealthProbe(client, config, monitor, options) {
  if (monitor.running) return;
  monitor.running = true;
  try {
    const { liveTest, repair } = await runCodexComputerUseLiveTest({
      config,
      repairComputerUseMcpChildren: options.repairComputerUseMcpChildren,
      request: async (method, requestParams, requestOptions) =>
        await client.request(method, requestParams, {
          timeoutMs: requestOptions?.timeoutMs ?? config.liveTestTimeoutMs,
        }),
    });
    if (!liveTest.ok) {
      log.warn("codex computer-use periodic health failed", {
        mcpServerName: config.mcpServerName,
        attempts: liveTest.attempts,
        timeoutMs: liveTest.timeoutMs,
        error: liveTest.error,
        repair,
      });
      return;
    }
    if (repair?.killedPids.length)
      log.info("codex computer-use periodic health repaired stale children", {
        mcpServerName: config.mcpServerName,
        killedPids: repair.killedPids,
      });
  } catch (error) {
    log.warn("codex computer-use periodic health probe crashed", {
      mcpServerName: config.mcpServerName,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    monitor.running = false;
  }
}
function clearComputerUseHealthMonitor(client, monitor) {
  clearInterval(monitor.timer);
  monitor.disposeCloseHandler();
  getComputerUseHealthMonitorState().monitors.delete(client);
}
//#endregion
//#region extensions/codex/src/app-server/attempt-startup.ts
/**
 * Startup orchestration for Codex app-server attempts, including shared-client
 * leasing, plugin thread config, sandbox execution environment, and thread
 * lifecycle binding.
 */
const CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS = 3;
const CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED =
  "CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED";
/** True when a pre-write context restart must replay on the newly selected owner. */
function isCodexContextRestartSelectionChangedError(error) {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED
  );
}
/**
 * Starts or resumes the Codex app-server thread and returns the resources the
 * run loop must later release.
 */
async function startCodexAttemptThread(params) {
  let pluginAppServer = params.appServer;
  const startupRuntimeAuthProfileId =
    params.startupPreparedAuth?.kind === "profile"
      ? params.startupPreparedAuth.profileId
      : (params.startupAuthProfileId ?? void 0);
  const startupRuntimeAuthProfileStore =
    params.startupPreparedAuth?.kind === "profile" ? params.startupPreparedAuth.store : void 0;
  let releaseSharedClientLease;
  let startupClientForAbandonedRequestCleanup;
  let releaseStartupResourcesOnTimeout;
  let startupAbandoned = false;
  const startupAbandonController = new AbortController();
  const abandonStartupAcquire = () => startupAbandonController.abort();
  params.signal.addEventListener("abort", abandonStartupAcquire, { once: true });
  try {
    const startupResult = await withCodexStartupTimeout({
      timeoutMs: params.startupTimeoutMs,
      signal: params.signal,
      onTimeout: async () => {
        startupAbandoned = true;
        startupAbandonController.abort();
        await params.onStartupTimeout();
        await releaseStartupResourcesOnTimeout?.();
        releaseSharedClientLease?.();
        releaseSharedClientLease = void 0;
        await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
        startupClientForAbandonedRequestCleanup = void 0;
      },
      operation: async () => {
        const threadConfig = mergeCodexThreadConfigs(params.bundleMcpThreadConfig?.configPatch);
        const pluginThreadConfigRequired =
          !params.nativeToolSurfaceEnabled ||
          shouldBuildCodexPluginThreadConfig(params.pluginConfig);
        const pluginThreadConfigPluginConfig = params.nativeToolSurfaceEnabled
          ? params.pluginConfig
          : disableCodexPluginThreadConfig(params.pluginConfig);
        const resolvedPluginPolicy = pluginThreadConfigRequired
          ? resolveCodexPluginsPolicy(pluginThreadConfigPluginConfig)
          : void 0;
        const computerUseMcpElicitationDelegationRequired = params.computerUseConfig.enabled;
        const mcpElicitationDelegationRequired =
          resolvedPluginPolicy?.enabled === true || computerUseMcpElicitationDelegationRequired;
        const enabledPluginConfigKeys = resolvedPluginPolicy
          ? resolvedPluginPolicy.pluginPolicies
              .filter((plugin) => plugin.enabled)
              .map((plugin) => plugin.configKey)
              .toSorted()
          : void 0;
        pluginAppServer = mcpElicitationDelegationRequired
          ? {
              ...params.appServer,
              approvalPolicy: withMcpElicitationsApprovalPolicy(params.appServer.approvalPolicy),
            }
          : params.appServer;
        let attemptedClient;
        const startupAttempt = async () => {
          let startupClientLease;
          let startupClient;
          let startupAttemptError;
          let startupAttemptSucceeded = false;
          try {
            const attemptParams = params.buildAttemptParams();
            startupClient = await params.attemptClientFactory({
              startOptions: params.appServer.start,
              ...(params.startupPreparedAuth
                ? { preparedAuth: params.startupPreparedAuth }
                : { authProfileId: params.startupAuthProfileId }),
              authProfileStore: attemptParams.authProfileStore,
              authBindingFingerprint: params.startupAuthBindingFingerprint,
              ...(params.runtimeArtifactRequest
                ? {
                    runtimeArtifactMode: "capture",
                    ...(params.runtimeArtifactRequest.expected
                      ? { expectedRuntimeArtifact: params.runtimeArtifactRequest.expected }
                      : {}),
                  }
                : {}),
              agentDir: params.agentDir,
              config: params.config,
              onStartedClient: (client) => {
                startupClientForAbandonedRequestCleanup = client;
                if (startupAbandoned || startupAbandonController.signal.aborted)
                  closeCodexStartupClientBestEffort(client);
              },
              abandonSignal: startupAbandonController.signal,
              timeoutMs: params.appServer.requestTimeoutMs,
            });
            const activeStartupClient = startupClient;
            let startupClientLeaseReleased = false;
            startupClientLease = () => {
              if (startupClientLeaseReleased) return;
              startupClientLeaseReleased = true;
              releaseLeasedSharedCodexAppServerClient(activeStartupClient);
            };
            releaseSharedClientLease = startupClientLease;
            attemptedClient = activeStartupClient;
            startupClientForAbandonedRequestCleanup = activeStartupClient;
            if (startupAbandoned) throw new Error("codex app-server startup timed out");
            if (startupAbandonController.signal.aborted)
              throw new Error("codex app-server startup aborted");
            let runtimeArtifact;
            if (params.runtimeArtifactRequest) {
              const {
                readCodexAppServerClientRuntimeArtifact,
                validateCodexAppServerRuntimeArtifact,
              } = await import("./runtime-artifact-BF9V7baL.js");
              runtimeArtifact = readCodexAppServerClientRuntimeArtifact(activeStartupClient);
              const expected = params.runtimeArtifactRequest.expected;
              const matchesExpected =
                !expected ||
                Boolean(
                  runtimeArtifact &&
                  runtimeArtifact.id === expected.id &&
                  runtimeArtifact.fingerprint === expected.fingerprint,
                );
              if (
                !runtimeArtifact ||
                !matchesExpected ||
                !(await validateCodexAppServerRuntimeArtifact(
                  runtimeArtifact,
                  startupAbandonController.signal,
                ))
              ) {
                retireSharedCodexAppServerClientIfCurrent(activeStartupClient);
                throw new Error(
                  expected
                    ? "Codex app-server runtime artifact does not match verified inference"
                    : "Codex app-server runtime artifact is unavailable or stale",
                );
              }
            }
            ensureCodexAppServerClientRuntime(activeStartupClient, {
              agentDir: params.agentDir,
              authProfileId: startupRuntimeAuthProfileId,
              authMode:
                params.startupPreparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
              authProfileStore: startupRuntimeAuthProfileStore ?? attemptParams.authProfileStore,
              config: params.config,
            });
            const turnRouter = getCodexAppServerTurnRouter(activeStartupClient);
            await ensureCodexComputerUse({
              client: activeStartupClient,
              pluginConfig: params.pluginConfig,
              config: params.config,
              agentDir: params.agentDir,
              timeoutMs: params.appServer.requestTimeoutMs,
              signal: startupAbandonController.signal,
            });
            const startupRuntimeIdentity = activeStartupClient.getRuntimeIdentity();
            const pluginAppCacheKey = buildCodexPluginAppCacheKey({
              appServer: params.appServer,
              agentDir: params.agentDir,
              authProfileId: startupRuntimeAuthProfileId,
              accountId: params.startupAuthAccountCacheKey,
              envApiKeyFingerprint: params.startupEnvApiKeyCacheKey,
              appServerVersion: activeStartupClient.getServerVersion(),
              runtimeIdentity: startupRuntimeIdentity,
            });
            const appServerRuntimeFingerprint = buildCodexAppServerRuntimeFingerprint({
              appServer: params.appServer,
              appServerVersion: activeStartupClient.getServerVersion(),
              runtimeIdentity: startupRuntimeIdentity,
            });
            const pluginThreadConfigInputFingerprint = pluginThreadConfigRequired
              ? buildCodexPluginThreadConfigInputFingerprint({
                  pluginConfig: pluginThreadConfigPluginConfig,
                  appCacheKey: pluginAppCacheKey,
                })
              : void 0;
            log.debug(
              "codex plugin thread config eligibility",
              buildCodexPluginThreadConfigEligibilityLogData({
                sessionId: attemptParams.sessionId,
                sessionKey: attemptParams.sessionKey ?? "",
                pluginThreadConfigRequired,
                resolvedPluginPolicy,
                enabledPluginConfigKeys,
                pluginAppCacheKey,
                startupAuthProfileId: startupRuntimeAuthProfileId,
                appServer: params.appServer,
              }),
            );
            let startupSandboxEnvironment;
            let startupSandboxEnvironmentAcquired = false;
            const releaseStartupSandboxEnvironment = async () => {
              if (startupSandboxEnvironmentAcquired) {
                startupSandboxEnvironmentAcquired = false;
                await releaseCodexSandboxExecServerEnvironment(params.sandbox);
              }
            };
            releaseStartupResourcesOnTimeout = releaseStartupSandboxEnvironment;
            try {
              startupSandboxEnvironment = shouldRequireCodexSandboxExecServerEnvironment({
                sandbox: params.sandbox,
                nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
                sandboxExecServerEnabled: params.sandboxExecServerEnabled,
              })
                ? await ensureCodexSandboxExecServerEnvironment({
                    client: activeStartupClient,
                    sandbox: params.sandbox ?? null,
                    appServerStartOptions: params.appServer.start,
                    timeoutMs: params.appServer.requestTimeoutMs,
                    signal: startupAbandonController.signal,
                  })
                : void 0;
              startupSandboxEnvironmentAcquired = Boolean(startupSandboxEnvironment);
              if (startupAbandonController.signal.aborted) {
                await releaseStartupSandboxEnvironment();
                throw new Error("codex app-server startup aborted");
              }
              if (
                params.sandbox?.enabled &&
                params.nativeToolSurfaceEnabled &&
                params.sandboxExecServerEnabled &&
                !startupSandboxEnvironment
              )
                throw new Error(
                  "Codex app-server did not register an OpenClaw sandbox exec-server environment.",
                );
            } catch (error) {
              await releaseStartupSandboxEnvironment();
              throw error;
            }
            const startupEnvironmentSelection = resolveCodexSandboxEnvironmentSelection(
              startupSandboxEnvironment,
              params.nativeToolSurfaceEnabled,
            );
            const startupExecutionCwd = resolveCodexAppServerExecutionCwd({
              effectiveCwd: params.effectiveCwd,
              localWorkspaceRoot: params.effectiveWorkspace,
              environment: startupSandboxEnvironment,
              nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
              remoteWorkspaceRoot: params.appServer.remoteWorkspaceRoot,
            });
            const startupSandboxPolicy = startupSandboxEnvironment
              ? resolveCodexExternalSandboxPolicyForOpenClawSandbox(params.sandbox)
              : void 0;
            let startupReservation;
            const releaseStartupReservation = () => {
              startupReservation?.release();
              startupReservation = void 0;
            };
            const reserveStartupThread = (threadId) => {
              if (startupReservation) {
                if (startupReservation.threadId !== threadId)
                  throw new Error(
                    `codex app-server reserved ${startupReservation.threadId} but started ${threadId}`,
                  );
                return { release: releaseStartupReservation };
              }
              startupReservation = turnRouter.reserveThread({
                threadId,
                releaseOn: params.signal,
              });
              return { release: releaseStartupReservation };
            };
            const releaseStartupResources = async () => {
              releaseStartupReservation();
              await releaseStartupSandboxEnvironment();
            };
            releaseStartupResourcesOnTimeout = releaseStartupResources;
            const buildThreadLifecycleParams = (signal, reserveResumeThread) => ({
              client: activeStartupClient,
              reserveResumeThread,
              bindingStore: params.bindingStore,
              params: params.buildAttemptParams(),
              agentId: params.sessionAgentId,
              cwd: startupExecutionCwd,
              dynamicTools: params.dynamicTools,
              persistentWebSearchAllowed: params.persistentWebSearchAllowed,
              webSearchAllowed: params.webSearchAllowed,
              appServer: pluginAppServer,
              developerInstructions: params.developerInstructions,
              config: threadConfig,
              finalConfigPatch: params.finalConfigPatch,
              buildFinalConfigPatch: params.buildFinalConfigPatch,
              nativeHookRelayGeneration: params.nativeHookRelayGeneration,
              nativeCodeModeEnabled: params.nativeToolSurfaceEnabled,
              nativeProviderWebSearchSupport: params.nativeProviderWebSearchSupport,
              nativeCodeModeOnlyEnabled: params.appServer.codeModeOnly,
              userMcpServersEnabled: params.nativeToolSurfaceEnabled,
              mcpServersFingerprint: params.bundleMcpThreadConfig.fingerprint,
              mcpServersFingerprintEvaluated: params.bundleMcpThreadConfig.evaluated,
              environmentSelection: startupEnvironmentSelection,
              appServerRuntimeFingerprint,
              contextEngineProjection: params.contextEngineProjection,
              signal,
              pluginThreadConfig: pluginThreadConfigRequired
                ? {
                    enabled: true,
                    inputFingerprint: pluginThreadConfigInputFingerprint,
                    enabledPluginConfigKeys,
                    build: () =>
                      buildCodexPluginThreadConfig({
                        pluginConfig: pluginThreadConfigPluginConfig,
                        request: (method, requestParams) =>
                          activeStartupClient.request(method, requestParams, {
                            timeoutMs: params.appServer.requestTimeoutMs,
                            signal,
                          }),
                        configCwd: startupExecutionCwd,
                        appCache: defaultCodexAppInventoryCache,
                        appCacheKey: pluginAppCacheKey,
                      }),
                  }
                : void 0,
            });
            try {
              const startupThread = await startOrResumeThread(
                buildThreadLifecycleParams(startupAbandonController.signal, reserveStartupThread),
              );
              try {
                reserveStartupThread(startupThread.threadId);
              } catch (error) {
                if (
                  !(await unsubscribeCodexThreadBestEffort(activeStartupClient, {
                    threadId: startupThread.threadId,
                    timeoutMs: 5e3,
                  }))
                )
                  throw new CodexAppServerUnsafeSubscriptionError(
                    "Codex startup subscription cleanup failed",
                    { cause: error },
                  );
                throw error;
              }
              if (startupAbandonController.signal.aborted)
                throw new Error("codex app-server startup aborted");
              const startupRoute = startupReservation;
              if (!startupRoute)
                throw new Error("codex app-server startup did not reserve its thread route");
              startupSandboxEnvironmentAcquired = false;
              startCodexComputerUseHealthMonitor({
                client: activeStartupClient,
                config: params.computerUseConfig,
              });
              startupAttemptSucceeded = true;
              return {
                client: activeStartupClient,
                turnRouter,
                turnRoute: startupRoute,
                thread: startupThread,
                sandboxEnvironment: startupSandboxEnvironment,
                environmentSelection: startupEnvironmentSelection,
                executionCwd: startupExecutionCwd,
                sandboxPolicy: startupSandboxPolicy,
                ...(runtimeArtifact ? { runtimeArtifact } : {}),
                restartContextEngineCodexThread: async () => {
                  try {
                    return await startOrResumeThread(buildThreadLifecycleParams(params.signal));
                  } catch (error) {
                    if (!isCodexAppServerStartSelectionChangedError(error)) throw error;
                    retireSharedCodexAppServerClientIfCurrent(activeStartupClient);
                    throw Object.assign(
                      new Error("codex app-server client is closed", { cause: error }),
                      { code: CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED },
                    );
                  }
                },
              };
            } catch (error) {
              await releaseStartupResources();
              throw error;
            } finally {
              if (releaseStartupResourcesOnTimeout === releaseStartupResources)
                releaseStartupResourcesOnTimeout = void 0;
            }
          } catch (error) {
            startupAttemptError = error;
            if (!startupAbandoned && !params.signal.aborted && !startupClient) {
              const sharedClient = clearSharedCodexAppServerClientIfCurrentAndUnclaimed(
                startupClientForAbandonedRequestCleanup,
              );
              if (sharedClient.found && !sharedClient.closed)
                startupClientForAbandonedRequestCleanup = void 0;
            }
            throw error;
          } finally {
            if (!startupAttemptSucceeded) {
              if (releaseSharedClientLease === startupClientLease)
                releaseSharedClientLease = void 0;
              startupClientLease?.();
              if (startupAbandoned || params.signal.aborted) {
                if (startupClientForAbandonedRequestCleanup === startupClient)
                  startupClientForAbandonedRequestCleanup = void 0;
                await closeCodexStartupClientBestEffort(startupClient);
              } else if (
                !isCodexAppServerStartSelectionChangedError(startupAttemptError) &&
                (shouldClearSharedClientAfterStartupRace(startupAttemptError) ||
                  shouldClearSharedClientAfterStartupFailure({
                    error: startupAttemptError,
                    spawnedBy: params.spawnedBy,
                  }))
              ) {
                if (startupClientForAbandonedRequestCleanup === startupClient)
                  startupClientForAbandonedRequestCleanup = void 0;
                await closeCodexStartupClientBestEffort(startupClient);
              }
            }
          }
        };
        for (
          let attempt = 1;
          attempt <= CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS;
          attempt += 1
        )
          try {
            return await startupAttempt();
          } catch (error) {
            const selectionChanged = isCodexAppServerStartSelectionChangedError(error);
            if (
              startupAbandoned ||
              params.signal.aborted ||
              (!selectionChanged && !isCodexAppServerConnectionClosedError(error))
            )
              throw error;
            const failedClient = attemptedClient;
            const refreshedSharedClient = selectionChanged
              ? retireSharedCodexAppServerClientIfCurrent(failedClient)
              : clearSharedCodexAppServerClientIfCurrent(failedClient);
            if (startupClientForAbandonedRequestCleanup === failedClient)
              startupClientForAbandonedRequestCleanup = void 0;
            if (attempt >= CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS) {
              log.warn(
                selectionChanged
                  ? "codex app-server executable selection kept changing during startup; retries exhausted"
                  : "codex app-server connection closed during startup; retries exhausted",
                {
                  attempt,
                  maxAttempts: CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS,
                  refreshedSharedClient,
                  error: formatErrorMessage(error),
                },
              );
              throw error;
            }
            log.warn(
              selectionChanged
                ? "codex app-server executable selection changed during startup; restarting app-server and retrying"
                : "codex app-server connection closed during startup; restarting app-server and retrying",
              {
                attempt,
                nextAttempt: attempt + 1,
                maxAttempts: CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS,
                refreshedSharedClient,
                error: formatErrorMessage(error),
              },
            );
          }
        throw new Error("codex app-server startup retry loop exited unexpectedly");
      },
    });
    startupClientForAbandonedRequestCleanup = void 0;
    if (!releaseSharedClientLease)
      throw new Error("codex app-server startup succeeded without a shared client lease");
    return {
      ...startupResult,
      pluginAppServer,
      releaseSharedClientLease,
    };
  } catch (error) {
    if (params.signal.aborted || shouldClearSharedClientAfterStartupAbandon(error)) {
      releaseSharedClientLease?.();
      releaseSharedClientLease = void 0;
      await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
      startupClientForAbandonedRequestCleanup = void 0;
    } else if (
      !isCodexAppServerStartSelectionChangedError(error) &&
      (shouldClearSharedClientAfterStartupRace(error) ||
        shouldClearSharedClientAfterStartupFailure({
          error,
          spawnedBy: params.spawnedBy,
        }))
    ) {
      releaseSharedClientLease?.();
      releaseSharedClientLease = void 0;
      await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
      startupClientForAbandonedRequestCleanup = void 0;
    }
    throw error;
  } finally {
    params.signal.removeEventListener("abort", abandonStartupAcquire);
  }
}
function shouldClearSharedClientAfterStartupAbandon(error) {
  return (
    error instanceof Error &&
    (error.message === "codex app-server startup timed out" ||
      error.message === "codex app-server startup aborted")
  );
}
function shouldClearSharedClientAfterStartupRace(error) {
  return (
    error instanceof Error &&
    (shouldClearSharedClientAfterStartupAbandon(error) || error.message.endsWith(" timed out"))
  );
}
function shouldClearSharedClientAfterStartupFailure(params) {
  if (!(params.error instanceof Error)) return !params.spawnedBy;
  if (params.error.message.includes("write EPIPE")) return true;
  return !params.spawnedBy;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-start.ts
async function startCodexAttemptRuntime(resources) {
  const {
    prompt,
    state,
    trajectoryRecorder,
    activateNativePreToolUseFailureFallback,
    releaseSandboxExecEnvironment,
    releaseSharedClientLeaseOnce,
    releaseCurrentRoute,
    startupTimeoutMs,
    buildNativeHookRelayFinalConfigPatch,
  } = resources;
  const {
    context,
    turnState,
    buildRenderedCodexDeveloperInstructions,
    rebuildCodexTurnPromptTextFromCurrentProjection,
    applyNoContextEngineContinuityProjection,
  } = prompt;
  const { runtime, attemptTools, promptState } = context;
  const {
    connection,
    runtimeParams,
    preparedAuthBinding,
    buildActiveRunAttemptParams,
    startupAuthAccountCacheKey,
    startupEnvApiKeyCacheKey,
    bundleMcpThreadConfig,
    nativeToolSurfaceEnabled,
    nativeProviderWebSearchSupport,
    sandboxExecServerEnabled,
  } = runtime;
  const { toolBridge, toolState } = attemptTools;
  const {
    params,
    attemptClientFactory,
    bindingStore,
    appServer,
    pluginConfig,
    computerUseConfig,
    startupClientAuthProfileId,
    runtimeArtifactRequest,
    startupPreparedAuth,
    agentDir,
    sessionAgentId,
    effectiveWorkspace,
    effectiveCwd,
    sandbox,
    runAbortController,
    usesSupervisionConnection,
    resolveReviewerPolicyContext,
    resolveRuntimeOptionsForCurrentBinding,
    startupAuthProfileId,
    abortFromUpstream,
  } = connection;
  let pluginAppServer = withCodexAppServerFastModeServiceTier(appServer, runtimeParams);
  try {
    emitCodexAppServerEvent(params, {
      stream: "codex_app_server.lifecycle",
      data: { phase: "startup" },
    });
    const startupResult = await startCodexAttemptThread({
      attemptClientFactory,
      bindingStore,
      appServer: pluginAppServer,
      pluginConfig,
      computerUseConfig,
      startupAuthProfileId: startupClientAuthProfileId,
      startupAuthBindingFingerprint: preparedAuthBinding?.fingerprint,
      ...(runtimeArtifactRequest ? { runtimeArtifactRequest } : {}),
      startupPreparedAuth,
      startupAuthAccountCacheKey,
      startupEnvApiKeyCacheKey,
      agentDir,
      config: params.config,
      buildAttemptParams: buildActiveRunAttemptParams,
      sessionAgentId,
      effectiveWorkspace,
      effectiveCwd,
      dynamicTools: toolBridge.specs,
      persistentWebSearchAllowed: toolState.persistentWebSearchAllowed,
      webSearchAllowed: toolState.webSearchAllowed,
      developerInstructions: turnState.promptBuild.developerInstructions,
      buildFinalConfigPatch: buildNativeHookRelayFinalConfigPatch,
      bundleMcpThreadConfig,
      nativeToolSurfaceEnabled,
      nativeProviderWebSearchSupport,
      sandboxExecServerEnabled,
      sandbox,
      contextEngineProjection: promptState.contextEngineProjection,
      startupTimeoutMs,
      signal: runAbortController.signal,
      onStartupTimeout: () => runAbortController.abort("codex_startup_timeout"),
      spawnedBy: params.spawnedBy,
    });
    state.client = startupResult.client;
    state.thread = startupResult.thread;
    state.runtimeArtifact = startupResult.runtimeArtifact;
    state.turnRouter = startupResult.turnRouter;
    state.turnRoute = startupResult.turnRoute;
    state.sandboxExecEnvironmentAcquired = Boolean(startupResult.sandboxEnvironment);
    state.releaseSharedClientLease = startupResult.releaseSharedClientLease;
    state.restartContextEngineCodexThread = startupResult.restartContextEngineCodexThread;
    pluginAppServer = startupResult.pluginAppServer;
    if (
      usesSupervisionConnection &&
      (state.thread.connectionScope !== "supervision" ||
        state.thread.supervisionSourceThreadId !==
          connection.mutable.startupBinding?.supervisionSourceThreadId)
    )
      throw new Error("Codex supervised thread lost its private connection ownership");
    if (state.thread.lifecycle.action === "started" || state.thread.lifecycle.action === "forked") {
      const activePolicy = resolveReviewerPolicyContext(state.thread);
      const activeAppServer = resolveCodexAppServerForModelProvider({
        appServer: resolveRuntimeOptionsForCurrentBinding({
          modelProvider: activePolicy.modelProvider,
          model: activePolicy.model,
        }),
        provider: activePolicy.modelProvider,
        model: activePolicy.model,
        config: params.config,
        env: process.env,
        agentDir,
      });
      const previousReviewer = pluginAppServer.approvalsReviewer;
      pluginAppServer = {
        ...pluginAppServer,
        approvalsReviewer: activeAppServer.approvalsReviewer,
      };
      if (pluginAppServer.approvalsReviewer !== previousReviewer)
        log.info("codex app-server approval reviewer updated from active thread model provider", {
          from: previousReviewer,
          to: pluginAppServer.approvalsReviewer,
          modelProvider: activePolicy.modelProvider,
        });
    }
    state.codexEnvironmentSelection = startupResult.environmentSelection;
    state.codexExecutionCwd = startupResult.executionCwd;
    state.codexSandboxPolicy = startupResult.sandboxPolicy;
    emitCodexAppServerEvent(params, {
      stream: "codex_app_server.lifecycle",
      data: {
        phase: "thread_ready",
        threadId: state.thread.threadId,
      },
    });
  } catch (error) {
    activateNativePreToolUseFailureFallback();
    releaseCurrentRoute();
    state.nativeHookRelay?.unregister();
    await releaseSandboxExecEnvironment();
    releaseSharedClientLeaseOnce();
    params.abortSignal?.removeEventListener("abort", abortFromUpstream);
    throw error;
  }
  if (applyNoContextEngineContinuityProjection(state.thread.lifecycle.action, state.thread))
    await rebuildCodexTurnPromptTextFromCurrentProjection();
  trajectoryRecorder?.recordEvent("session.started", {
    sessionFile: params.sessionFile,
    threadId: state.thread.threadId,
    authProfileId: startupAuthProfileId,
    workspaceDir: effectiveWorkspace,
    toolCount: flattenCodexDynamicToolFunctions(toolBridge.specs).length,
  });
  recordCodexTrajectoryContext(trajectoryRecorder, {
    attempt: params,
    cwd: effectiveCwd,
    developerInstructions: buildRenderedCodexDeveloperInstructions(),
    prompt: turnState.codexTurnPromptText,
    tools: toolBridge.availableSpecs,
  });
  connection.mutable.pluginAppServer = pluginAppServer;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-tool-setup.ts
async function prepareCodexAttemptTools(runtime) {
  const {
    connection,
    bundleMcpThreadConfig,
    runtimeParams,
    effectiveRuntimeModelId,
    nativeToolSurfaceEnabled,
    nativeProviderWebSearchSupport,
    hookChannelId,
  } = runtime;
  const {
    params,
    preDynamicStartupStages,
    mutable,
    startupAuthProfileId,
    resolvedWorkspace,
    effectiveWorkspace,
    effectiveCwd,
    sandboxSessionKey,
    sandbox,
    runAbortController,
    sessionAgentId,
    pluginConfig,
    profilerEnabled,
  } = connection;
  const preDynamicSummary = preDynamicStartupStages.snapshot();
  if (shouldWarnCodexDynamicToolBuildStageSummary(preDynamicSummary))
    log.warn(
      `codex app-server pre-dynamic startup timings runId=${params.runId} sessionId=${params.sessionId} totalMs=${preDynamicSummary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(preDynamicSummary)}`,
      {
        runId: params.runId,
        sessionId: params.sessionId,
        totalMs: preDynamicSummary.totalMs,
        stages: preDynamicSummary.stages,
        hasStartupBinding: Boolean(mutable.startupBinding?.threadId),
        startupAuthProfileId: startupAuthProfileId ?? null,
        bundleMcpDiagnosticCount: bundleMcpThreadConfig.diagnostics.length,
        nativeToolSurfaceEnabled,
      },
    );
  const toolState = {
    yieldDetected: false,
    persistentWebSearchAllowed: void 0,
    webSearchAllowed: false,
  };
  const toolOutcomeOrdinals = /* @__PURE__ */ new Map();
  const suppressedDynamicToolOutcomeOrdinals = /* @__PURE__ */ new Set();
  const onCodexToolOutcome = params.onToolOutcome
    ? (observation) => {
        if (
          observation.toolCallOrdinal !== void 0 &&
          suppressedDynamicToolOutcomeOrdinals.has(observation.toolCallOrdinal)
        )
          return;
        params.onToolOutcome?.(observation);
      }
    : void 0;
  const baseAllocateToolOutcomeOrdinal = params.allocateToolOutcomeOrdinal;
  const allocateCodexToolOutcomeOrdinal = baseAllocateToolOutcomeOrdinal
    ? (toolCallId) => {
        const reservedOrdinal = toolCallId ? toolOutcomeOrdinals.get(toolCallId) : void 0;
        if (reservedOrdinal !== void 0) return reservedOrdinal;
        const ordinal = baseAllocateToolOutcomeOrdinal(toolCallId);
        if (toolCallId) toolOutcomeOrdinals.set(toolCallId, ordinal);
        return ordinal;
      }
    : void 0;
  const dynamicToolParams =
    allocateCodexToolOutcomeOrdinal || onCodexToolOutcome
      ? {
          ...runtimeParams,
          ...(allocateCodexToolOutcomeOrdinal
            ? { allocateToolOutcomeOrdinal: allocateCodexToolOutcomeOrdinal }
            : {}),
          ...(onCodexToolOutcome ? { onToolOutcome: onCodexToolOutcome } : {}),
        }
      : runtimeParams;
  const computerContextEpoch = { value: 0 };
  const commonToolParams = {
    params: dynamicToolParams,
    resolvedWorkspace,
    effectiveWorkspace,
    effectiveCwd,
    sandboxSessionKey,
    sandbox,
    nativeToolSurfaceEnabled,
    nativeProviderWebSearchSupport,
    runAbortController,
    sessionAgentId,
    pluginConfig,
    profilerEnabled,
    onYieldDetected: () => {
      toolState.yieldDetected = true;
    },
    onCodexAppServerEvent: (event) => {
      emitCodexAppServerEvent(params, event);
    },
    computerContextEpoch,
  };
  const tools = await buildDynamicTools({
    ...commonToolParams,
    onPersistentWebSearchPolicyResolved: (allowed) => {
      toolState.persistentWebSearchAllowed = allowed;
    },
    onWebSearchPolicyResolved: (allowed) => {
      toolState.webSearchAllowed = allowed;
    },
  });
  const registeredTools = await buildDynamicTools({
    ...commonToolParams,
    forceHeartbeatTool: true,
    ignoreDisableMessageTool: true,
    ignoreRuntimePlan: true,
  });
  return {
    tools,
    registeredTools,
    dynamicToolParams,
    computerContextEpoch,
    toolBridge: createCodexDynamicToolBridge({
      tools,
      registeredTools,
      signal: runAbortController.signal,
      computerContextEpoch,
      loading: resolveCodexDynamicToolsLoadingForRuntime(pluginConfig, effectiveRuntimeModelId, {
        connectionClass: connection.appServer.connectionClass,
      }),
      directToolNames: resolveCodexDynamicToolDirectNames(
        params,
        isHostScopedAgentToolActive("crestodian"),
      ),
      hookContext: {
        agentId: sessionAgentId,
        config: params.config,
        workspaceDir: effectiveWorkspace,
        sessionId: params.sessionId,
        sessionKey: sandboxSessionKey,
        runId: params.runId,
        channelId: hookChannelId,
        currentChannelProvider: resolveCodexMessageToolProvider(params),
        currentChannelId: params.currentChannelId,
        currentMessagingTarget: params.currentMessagingTarget,
        currentMessageId: params.currentMessageId,
        currentThreadId: params.currentThreadTs,
        replyToMode: params.replyToMode,
        hasRepliedRef: params.hasRepliedRef,
        sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
        onToolOutcome: onCodexToolOutcome,
        allocateToolOutcomeOrdinal: allocateCodexToolOutcomeOrdinal,
      },
    }),
    toolState,
    toolOutcomeOrdinals,
    suppressedDynamicToolOutcomeOrdinals,
    onCodexToolOutcome,
    allocateCodexToolOutcomeOrdinal,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-turn-request.ts
async function prepareCodexAttemptTurnRequest(
  resources,
  turnRuntime,
  ensureCurrentThreadRoute,
  waitForActiveNativeTurnCompletion,
) {
  const { prompt, state: resourceState, releaseCurrentRoute } = resources;
  const { context, turnState, buildRenderedCodexDeveloperInstructions } = prompt;
  const { runtime, attemptTools, hookContextWindowFields, workspaceBootstrapContext } = context;
  const { connection, runtimeParams, effectiveRuntimeProviderId, effectiveRuntimeModelId } =
    runtime;
  const { tools } = attemptTools;
  const {
    params,
    usesSupervisionConnection,
    codexModelCallId,
    codexModelCallTrace,
    codexModelContentCapture,
    appServer,
    runAbortController,
  } = connection;
  const { state } = turnRuntime;
  const buildCodexModelInputMessages = () => [
    ...prompt.codexModelInputHistoryMessages,
    buildCodexUserPromptMessage({
      ...runtimeParams,
      prompt: turnState.codexTurnPromptText,
    }),
  ];
  const codexModelCallDiagnostics = createCodexModelCallDiagnosticEmitter({
    baseFields: {
      runId: params.runId,
      callId: codexModelCallId,
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
      sessionId: params.sessionId,
      provider: usesSupervisionConnection
        ? (resourceState.thread.modelProvider ?? effectiveRuntimeProviderId)
        : params.provider,
      model: usesSupervisionConnection
        ? (resourceState.thread.model ?? effectiveRuntimeModelId)
        : params.modelId,
      api: usesSupervisionConnection ? runtimeParams.model.api : params.model.api,
      transport: appServer.start.transport,
      ...hookContextWindowFields,
      trace: codexModelCallTrace,
    },
    capture: codexModelContentCapture,
    tools,
    buildInputMessages: buildCodexModelInputMessages,
    buildSystemPrompt: buildRenderedCodexDeveloperInstructions,
    onErrorDiagnostic: (error) => {
      log.debug("codex app-server model call diagnostic ended with error", {
        error: formatErrorMessage(error),
      });
    },
  });
  const throwIfTurnStartAcceptedAfterAbort = () => {
    if (!runAbortController.signal.aborted) return;
    const reason = runAbortController.signal.reason;
    if (reason instanceof Error) throw reason;
    const error = new Error(
      typeof reason === "string" && reason.length > 0
        ? reason
        : "codex app-server turn start aborted before acceptance",
    );
    error.name = "AbortError";
    throw error;
  };
  const startCodexTurn = async () => {
    const activeTurnRoute = await ensureCurrentThreadRoute();
    const turnAppServer = withCodexAppServerFastModeServiceTier(
      connection.mutable.pluginAppServer,
      runtimeParams,
    );
    connection.mutable.pluginAppServer = turnAppServer;
    const turnStartParams = buildTurnStartParams(runtimeParams, {
      threadId: resourceState.thread.threadId,
      cwd: resourceState.codexExecutionCwd,
      appServer: turnAppServer,
      promptText: turnState.codexTurnPromptText,
      sandboxPolicy: resourceState.codexSandboxPolicy,
      environmentSelection: resourceState.codexEnvironmentSelection,
      ...(usesSupervisionConnection
        ? {}
        : {
            model: resourceState.thread.model,
            modelProvider: resourceState.thread.modelProvider,
          }),
      turnScopedDeveloperInstructions: workspaceBootstrapContext.turnScopedDeveloperInstructions,
      skillsCollaborationInstructions: context.skillsCollaborationInstructions,
      memoryCollaborationInstructions: workspaceBootstrapContext.memoryCollaborationInstructions,
      heartbeatCollaborationInstructions:
        workspaceBootstrapContext.heartbeatCollaborationInstructions,
      preserveNativeTurnSettings: usesSupervisionConnection,
    });
    codexModelCallDiagnostics.setRequestPayloadBytes(utf8JsonByteLength(turnStartParams));
    state.latestStartupErrorNotification = void 0;
    state.rateLimitsRevisionBeforeLastTurnStart = readCodexRateLimitsRevision(resourceState.client);
    activeTurnRoute.armTurn();
    emitCodexAppServerEvent(params, {
      stream: "codex_app_server.lifecycle",
      data: {
        phase: "turn_starting",
        threadId: resourceState.thread.threadId,
        model: turnStartParams.model,
        effort: turnStartParams.effort,
        collaborationEffort: turnStartParams.collaborationMode?.settings.reasoning_effort,
      },
    });
    let acceptedTurnId;
    try {
      const startedTurn = assertCodexTurnStartResponse(
        await resourceState.client.request("turn/start", turnStartParams, {
          timeoutMs: params.timeoutMs,
          signal: runAbortController.signal,
        }),
      );
      acceptedTurnId = startedTurn.turn.id;
      throwIfTurnStartAcceptedAfterAbort();
      return startedTurn;
    } catch (error) {
      if (acceptedTurnId) {
        interruptCodexTurnBestEffort(resourceState.client, {
          threadId: resourceState.thread.threadId,
          turnId: acceptedTurnId,
          timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
        });
        releaseCurrentRoute();
      } else await activeTurnRoute.cancelTurn();
      throw error;
    }
  };
  if (
    resourceState.thread.lifecycle.action === "resumed" &&
    (resourceState.thread.lifecycle.activeTurnIds?.length ?? 0) > 0
  ) {
    log.info("codex app-server resumed thread has active native turn; waiting before turn/start", {
      threadId: resourceState.thread.threadId,
    });
    emitCodexAppServerEvent(params, {
      stream: "codex_app_server.lifecycle",
      data: {
        phase: "turn_start_waiting_for_native_turn",
        threadId: resourceState.thread.threadId,
      },
    });
    if (await waitForActiveNativeTurnCompletion()) await resourceState.turnRoute?.drain();
    else if (!runAbortController.signal.aborted)
      log.warn(
        "codex app-server active native turn did not complete before turn/start wait timed out",
        { threadId: resourceState.thread.threadId },
      );
  }
  const buildLlmInputEvent = () => ({
    runId: params.runId,
    sessionId: params.sessionId,
    provider: usesSupervisionConnection
      ? (resourceState.thread.modelProvider ?? effectiveRuntimeProviderId)
      : params.provider,
    model: usesSupervisionConnection
      ? (resourceState.thread.model ?? effectiveRuntimeModelId)
      : params.modelId,
    systemPrompt: buildRenderedCodexDeveloperInstructions(),
    prompt: turnState.codexTurnPromptText,
    historyMessages: prompt.codexModelInputHistoryMessages,
    imagesCount: params.images?.length ?? 0,
    tools,
  });
  return {
    codexModelCallDiagnostics,
    startCodexTurn,
    buildLlmInputEvent,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-turn-start.ts
async function startCodexAttemptTurn(resources, turnRuntime, notifications, requestRuntime) {
  const {
    prompt,
    state: resourceState,
    trajectoryRecorder,
    markTrajectoryEndRecorded,
    activateNativePreToolUseFailureFallback,
    releaseCurrentRoute,
    releaseSandboxExecEnvironment,
    releaseSharedClientLeaseAndRetireOneShotClient,
  } = resources;
  const { context, turnState, systemPromptReport } = prompt;
  const { runtime, historyState, hookContext, hookContextWindowFields, hookRunner } = context;
  const { connection, runtimeParams, effectiveRuntimeProviderId, effectiveRuntimeModelId } =
    runtime;
  const {
    params,
    usesSupervisionConnection,
    runAbortController,
    activeContextEngine,
    bindingStore,
    bindingIdentity,
    appServer,
    attemptStartedAt,
    startupAuthProfileId,
    abortFromUpstream,
  } = connection;
  const { state, turnIdRef } = turnRuntime;
  const { waitForActiveNativeTurnCompletion } = notifications;
  const { codexModelCallDiagnostics, startCodexTurn, buildLlmInputEvent } = requestRuntime;
  let turn;
  try {
    codexModelCallDiagnostics.emitStarted();
    runAgentHarnessLlmInputHook({
      event: buildLlmInputEvent(),
      ctx: hookContext,
      hookRunner,
    });
    turn = await startCodexTurn();
  } catch (error) {
    let turnStartError = error;
    if (isCodexActiveCompactTurnError(turnStartError)) {
      log.info("codex app-server turn/start blocked by active compact turn; waiting to retry", {
        threadId: resourceState.thread.threadId,
      });
      if ((await waitForActiveNativeTurnCompletion()) && !runAbortController.signal.aborted) {
        emitCodexAppServerEvent(params, {
          stream: "codex_app_server.lifecycle",
          data: {
            phase: "turn_start_retry_after_compact",
            threadId: resourceState.thread.threadId,
          },
        });
        try {
          turn = await startCodexTurn();
        } catch (retryError) {
          turnStartError = retryError;
        }
      }
    }
    if (
      turn === void 0 &&
      resourceState.thread.connectionScope !== "supervision" &&
      shouldUseFreshCodexThreadAfterContextEngineOverflow({
        error: turnStartError,
        contextEngineActive: Boolean(activeContextEngine),
        thread: resourceState.thread,
      }) &&
      resourceState.restartContextEngineCodexThread
    ) {
      log.warn(
        "codex app-server context-engine turn overflowed on resume; retrying with fresh thread",
        {
          threadId: resourceState.thread.threadId,
          error: formatErrorMessage(turnStartError),
        },
      );
      try {
        if (
          !(await bindingStore.mutate(bindingIdentity, {
            kind: "clear",
            threadId: resourceState.thread.threadId,
          }))
        )
          log.warn(
            "codex app-server preserved newer context-engine binding after resume overflow; skipping fresh retry",
            {
              threadId: resourceState.thread.threadId,
              error: formatErrorMessage(turnStartError),
            },
          );
        else {
          resourceState.thread = await resourceState.restartContextEngineCodexThread();
          const retryBinding = await bindingStore.read(bindingIdentity);
          if (
            retryBinding &&
            retryBinding.threadId === resourceState.thread.threadId &&
            retryBinding.contextEngine?.projection
          ) {
            await bindingStore.mutate(bindingIdentity, {
              kind: "patch",
              threadId: retryBinding.threadId,
              patch: {
                contextEngine: {
                  ...retryBinding.contextEngine,
                  projection: void 0,
                },
              },
            });
            log.info(
              "codex app-server cleared stale context-engine projection after overflow retry",
              {
                threadId: resourceState.thread.threadId,
                previousEpoch: retryBinding.contextEngine.projection.epoch,
              },
            );
          }
          emitCodexAppServerEvent(params, {
            stream: "codex_app_server.lifecycle",
            data: {
              phase: "thread_ready_retry",
              threadId: resourceState.thread.threadId,
            },
          });
          try {
            turn = await startCodexTurn();
          } catch (retryError) {
            turnStartError = retryError;
          }
        }
      } catch (retrySetupError) {
        turnStartError = retrySetupError;
      }
    }
    if (turn === void 0) {
      const usageLimitError = await formatCodexTurnStartUsageLimitError({
        client: resourceState.client,
        error: turnStartError,
        errorNotification: state.latestStartupErrorNotification,
        rateLimitsRevisionBeforeTurnStart: state.rateLimitsRevisionBeforeLastTurnStart,
        timeoutMs: appServer.requestTimeoutMs,
        signal: runAbortController.signal,
      });
      const message = usageLimitError?.message ?? formatErrorMessage(turnStartError);
      if (isInvalidCodexImagePayloadError(message))
        await clearCodexBindingAfterInvalidImagePayload(bindingStore, bindingIdentity, {
          phase: "turn_start",
          threadId: resourceState.thread.threadId,
          error: message,
        });
      emitCodexAppServerEvent(params, {
        stream: "codex_app_server.lifecycle",
        data: {
          phase: "turn_start_failed",
          error: message,
        },
      });
      trajectoryRecorder?.recordEvent("session.ended", {
        status: "error",
        threadId: resourceState.thread.threadId,
        timedOut: state.timedOut,
        aborted: runAbortController.signal.aborted,
        promptError: message,
      });
      markTrajectoryEndRecorded();
      runAgentHarnessLlmOutputHook({
        event: {
          runId: params.runId,
          sessionId: params.sessionId,
          provider: usesSupervisionConnection
            ? (resourceState.thread.modelProvider ?? effectiveRuntimeProviderId)
            : params.provider,
          model: usesSupervisionConnection
            ? (resourceState.thread.model ?? effectiveRuntimeModelId)
            : params.modelId,
          ...hookContextWindowFields,
          resolvedRef: usesSupervisionConnection
            ? `${resourceState.thread.modelProvider ?? effectiveRuntimeProviderId}/${resourceState.thread.model ?? effectiveRuntimeModelId}`
            : (params.runtimePlan?.observability.resolvedRef ??
              `${params.provider}/${params.modelId}`),
          ...(!usesSupervisionConnection && params.runtimePlan?.observability.harnessId
            ? { harnessId: params.runtimePlan.observability.harnessId }
            : {}),
          assistantTexts: [],
        },
        ctx: hookContext,
        hookRunner,
      });
      const failureKind = classifyCodexModelCallFailureKind({
        error: turnStartError,
        timedOut: state.timedOut,
        turnCompletionIdleTimedOut: state.turnCompletionIdleTimedOut,
        runAborted: runAbortController.signal.aborted,
        abortReason: runAbortController.signal.reason,
        clientClosedAbort: state.clientClosedAbort,
        formatError: formatErrorMessage,
      });
      codexModelCallDiagnostics.emitError(message, failureKind ? { failureKind } : {});
      const messagesSnapshot = [
        ...historyState.messages,
        buildCodexUserPromptMessage({
          ...runtimeParams,
          prompt: turnState.codexTurnPromptText,
        }),
      ];
      await runCodexAgentEndHook(params, {
        event: {
          messages: messagesSnapshot,
          success: false,
          error: message,
          durationMs: Date.now() - attemptStartedAt,
        },
        ctx: hookContext,
        hookRunner,
      });
      if (!state.timedOut)
        await unsubscribeCodexThreadBestEffort(resourceState.client, {
          threadId: resourceState.thread.threadId,
          timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS,
        });
      releaseCurrentRoute();
      activateNativePreToolUseFailureFallback();
      resourceState.nativeHookRelay?.unregister();
      await releaseSandboxExecEnvironment();
      await runAgentCleanupStep({
        runId: params.runId,
        sessionId: params.sessionId,
        step: "codex-trajectory-flush-startup-failure",
        log,
        cleanup: async () => trajectoryRecorder?.flush(),
      });
      params.abortSignal?.removeEventListener("abort", abortFromUpstream);
      await releaseSharedClientLeaseAndRetireOneShotClient();
      if (usageLimitError) {
        await markCodexAuthProfileBlockedFromRateLimits({
          params,
          authProfileId: startupAuthProfileId,
          rateLimits: usageLimitError.rateLimitsForProfile,
        });
        return {
          result: buildCodexTurnStartFailureResult({
            params,
            message: usageLimitError.message,
            messagesSnapshot,
            systemPromptReport,
          }),
        };
      }
      if (isCodexContextRestartSelectionChangedError(turnStartError))
        return {
          result: {
            ...buildCodexTurnStartFailureResult({
              params,
              message,
              messagesSnapshot,
              systemPromptReport,
            }),
            codexAppServerFailure: {
              kind: "client_closed_before_turn_completed",
              transport: appServer.start.transport,
              threadId: resourceState.thread.threadId,
              replaySafe: true,
            },
          },
        };
      throw turnStartError;
    }
  }
  if (!turn) {
    activateNativePreToolUseFailureFallback();
    await releaseSharedClientLeaseAndRetireOneShotClient();
    throw new Error("codex app-server turn/start failed without an error");
  }
  turnIdRef.current = turn.turn.id;
  return { turn };
}
//#endregion
//#region extensions/codex/src/app-server/attempt-turn-watches.ts
/**
 * Idle-watch controller for Codex app-server turn progress, completion, and
 * terminal-event gaps.
 */
/**
 * Creates a controller that arms/disarms timers as Codex app-server
 * notifications and tool handoffs progress.
 */
function createCodexAttemptTurnWatchController(params) {
  let completionIdleTimer;
  let completionIdleWatchArmed = false;
  let completionIdleWatchPinnedByTerminalError = false;
  let completionIdleTimeoutOverrideMs;
  let assistantCompletionIdleTimer;
  let assistantCompletionIdleWatchArmed = false;
  let assistantCompletionLastActivityAt = Date.now();
  let assistantCompletionLastActivityDetails;
  let attemptIdleTimer;
  let attemptIdleWatchArmed = false;
  let terminalIdleTimer;
  let terminalIdleWatchArmed = false;
  let completionLastActivityAt = Date.now();
  let completionLastActivityReason = "startup";
  let completionLastActivityDetails;
  let attemptIdleTimeoutOverrideMs;
  let attemptLastProgressAt = Date.now();
  let attemptLastProgressReason = "startup";
  let attemptLastProgressDetails;
  const turnCompletionIdleTimeoutMs = resolveTimerTimeoutMs(params.turnCompletionIdleTimeoutMs, 1);
  const turnAssistantCompletionIdleTimeoutMs = resolveTimerTimeoutMs(
    params.turnAssistantCompletionIdleTimeoutMs,
    1,
  );
  const turnAttemptIdleTimeoutMs = resolveTimerTimeoutMs(params.turnAttemptIdleTimeoutMs, 1);
  const turnTerminalIdleTimeoutMs = resolveTimerTimeoutMs(params.turnTerminalIdleTimeoutMs, 1);
  const interruptTimeoutMs = resolveTimerTimeoutMs(params.interruptTimeoutMs, 1);
  const resolveWatchTimeoutMs = (timeoutMs) => resolveTimerTimeoutMs(timeoutMs, 1);
  const clearCompletionIdleTimer = () => {
    if (completionIdleTimer) {
      clearTimeout(completionIdleTimer);
      completionIdleTimer = void 0;
    }
  };
  const clearTerminalIdleTimer = () => {
    if (terminalIdleTimer) {
      clearTimeout(terminalIdleTimer);
      terminalIdleTimer = void 0;
    }
  };
  const clearAssistantCompletionIdleTimer = () => {
    if (assistantCompletionIdleTimer) {
      clearTimeout(assistantCompletionIdleTimer);
      assistantCompletionIdleTimer = void 0;
    }
  };
  const clearAttemptIdleTimer = () => {
    if (attemptIdleTimer) {
      clearTimeout(attemptIdleTimer);
      attemptIdleTimer = void 0;
    }
  };
  const clearAllTimers = () => {
    clearAttemptIdleTimer();
    clearCompletionIdleTimer();
    clearAssistantCompletionIdleTimer();
    clearTerminalIdleTimer();
  };
  function scheduleCompletionIdleWatch() {
    clearCompletionIdleTimer();
    if (
      params.isCompleted() ||
      params.signal.aborted ||
      !completionIdleWatchArmed ||
      params.getActiveAppServerTurnRequests() > 0 ||
      params.getActiveCompletionBlockerItemCount() > 0
    )
      return;
    const elapsedMs = Math.max(0, Date.now() - completionLastActivityAt);
    const delayMs = Math.max(
      1,
      (completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs) - elapsedMs,
    );
    completionIdleTimer = setTimeout(fireCompletionIdleTimeout, delayMs);
    completionIdleTimer.unref?.();
  }
  function scheduleAssistantCompletionIdleWatch() {
    clearAssistantCompletionIdleTimer();
    if (
      params.isCompleted() ||
      params.signal.aborted ||
      !assistantCompletionIdleWatchArmed ||
      params.getActiveFinalizationHookCount() > 0
    )
      return;
    const elapsedMs = Math.max(0, Date.now() - assistantCompletionLastActivityAt);
    const delayMs = Math.max(1, turnAssistantCompletionIdleTimeoutMs - elapsedMs);
    assistantCompletionIdleTimer = setTimeout(fireAssistantCompletionIdleRelease, delayMs);
    assistantCompletionIdleTimer.unref?.();
  }
  function scheduleAttemptIdleWatch() {
    clearAttemptIdleTimer();
    if (params.isCompleted() || params.signal.aborted || !attemptIdleWatchArmed) return;
    const elapsedMs = Math.max(0, Date.now() - attemptLastProgressAt);
    const delayMs = Math.max(
      1,
      (attemptIdleTimeoutOverrideMs ?? turnAttemptIdleTimeoutMs) - elapsedMs,
    );
    attemptIdleTimer = setTimeout(fireAttemptIdleTimeout, delayMs);
    attemptIdleTimer.unref?.();
  }
  function scheduleTerminalIdleWatch() {
    clearTerminalIdleTimer();
    if (
      params.isCompleted() ||
      params.signal.aborted ||
      !terminalIdleWatchArmed ||
      params.getActiveAppServerTurnRequests() > 0
    )
      return;
    const elapsedMs = Math.max(0, Date.now() - completionLastActivityAt);
    const delayMs = Math.max(1, turnTerminalIdleTimeoutMs - elapsedMs);
    terminalIdleTimer = setTimeout(fireTerminalIdleTimeout, delayMs);
    terminalIdleTimer.unref?.();
  }
  function scheduleProgressWatches() {
    scheduleAttemptIdleWatch();
    scheduleCompletionIdleWatch();
    scheduleTerminalIdleWatch();
  }
  function isCompletionIdleTimeoutDueBeforeAttempt(timeoutMs) {
    if (
      params.isCompleted() ||
      params.isTerminalTurnNotificationQueued() ||
      params.signal.aborted ||
      !completionIdleWatchArmed ||
      params.getActiveAppServerTurnRequests() > 0 ||
      params.getActiveCompletionBlockerItemCount() > 0
    )
      return false;
    const completionTimeoutMs = completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs;
    if (completionTimeoutMs > timeoutMs) return false;
    return Math.max(0, Date.now() - completionLastActivityAt) >= completionTimeoutMs;
  }
  function recordAttemptProgress(reason, options) {
    attemptIdleTimeoutOverrideMs =
      options?.attemptTimeoutMs !== void 0
        ? resolveWatchTimeoutMs(options.attemptTimeoutMs)
        : void 0;
    attemptLastProgressAt = completionLastActivityAt;
    attemptLastProgressReason = reason;
    attemptLastProgressDetails = options?.details;
    params.onAttemptProgress(reason, options?.details);
    scheduleAttemptIdleWatch();
  }
  function fireAssistantCompletionIdleRelease() {
    if (params.isCompleted() || params.signal.aborted || !assistantCompletionIdleWatchArmed) return;
    if (
      params.getActiveAppServerTurnRequests() > 0 ||
      params.getActiveTurnItemCount() > 0 ||
      params.getActiveFinalizationHookCount() > 0
    ) {
      scheduleAssistantCompletionIdleWatch();
      return;
    }
    if (!params.canReleaseAssistantCompletionIdle()) {
      assistantCompletionIdleWatchArmed = false;
      assistantCompletionLastActivityDetails = void 0;
      clearAssistantCompletionIdleTimer();
      return;
    }
    const idleMs = Math.max(0, Date.now() - assistantCompletionLastActivityAt);
    if (idleMs < turnAssistantCompletionIdleTimeoutMs) {
      scheduleAssistantCompletionIdleWatch();
      return;
    }
    assistantCompletionIdleWatchArmed = false;
    clearCompletionIdleTimer();
    clearTerminalIdleTimer();
    const turnId = params.getTurnId();
    params.onRecordEvent("turn.assistant_completion_idle_release", {
      threadId: params.threadId,
      turnId,
      idleMs,
      timeoutMs: turnAssistantCompletionIdleTimeoutMs,
      ...assistantCompletionLastActivityDetails,
    });
    log.warn(
      "codex app-server turn released after completed assistant item without terminal event",
      {
        threadId: params.threadId,
        turnId,
        idleMs,
        timeoutMs: turnAssistantCompletionIdleTimeoutMs,
        ...assistantCompletionLastActivityDetails,
      },
    );
    if (turnId)
      params.onInterruptTurn({
        threadId: params.threadId,
        turnId,
        timeoutMs: interruptTimeoutMs,
      });
    params.onCompleted();
    params.onResolveCompletion();
  }
  function fireAttemptIdleTimeout() {
    if (params.isCompleted() || params.signal.aborted || !attemptIdleWatchArmed) return;
    const idleMs = Math.max(0, Date.now() - attemptLastProgressAt);
    const timeoutMs = attemptIdleTimeoutOverrideMs ?? turnAttemptIdleTimeoutMs;
    if (idleMs < timeoutMs) {
      scheduleAttemptIdleWatch();
      return;
    }
    if (isCompletionIdleTimeoutDueBeforeAttempt(timeoutMs)) {
      fireCompletionIdleTimeout();
      return;
    }
    const timeout = {
      kind: "progress",
      idleMs,
      timeoutMs,
      lastActivityReason: attemptLastProgressReason,
      details: attemptLastProgressDetails,
    };
    params.onTimeout(timeout);
    params.onMarkTimedOut();
    params.onRecordEvent("turn.progress_idle_timeout", {
      threadId: params.threadId,
      turnId: params.getTurnId(),
      idleMs,
      timeoutMs: timeout.timeoutMs,
      lastActivityReason: timeout.lastActivityReason,
      ...timeout.details,
    });
    log.warn("codex app-server turn idle timed out waiting for progress", {
      threadId: params.threadId,
      turnId: params.getTurnId(),
      idleMs,
      timeoutMs: timeout.timeoutMs,
      lastActivityReason: timeout.lastActivityReason,
      ...timeout.details,
    });
    params.onAbort("turn_progress_idle_timeout");
  }
  function fireCompletionIdleTimeout() {
    if (
      params.isCompleted() ||
      params.isTerminalTurnNotificationQueued() ||
      params.signal.aborted ||
      !completionIdleWatchArmed ||
      params.getActiveAppServerTurnRequests() > 0 ||
      params.getActiveCompletionBlockerItemCount() > 0
    )
      return;
    const timeoutMs = completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs;
    const idleMs = Math.max(0, Date.now() - completionLastActivityAt);
    if (idleMs < timeoutMs) {
      scheduleCompletionIdleWatch();
      return;
    }
    const details = {
      ...completionLastActivityDetails,
      activeAppServerTurnRequests: params.getActiveAppServerTurnRequests(),
      activeTurnItemCount: params.getActiveTurnItemCount(),
      terminalTurnNotificationQueued: params.isTerminalTurnNotificationQueued(),
      completionIdleWatchArmed,
      assistantCompletionIdleWatchArmed,
      terminalIdleWatchArmed,
    };
    const timeout = {
      kind: "completion",
      idleMs,
      timeoutMs,
      lastActivityReason: completionLastActivityReason,
      details,
    };
    params.onTimeout(timeout);
    params.onMarkTimedOut();
    params.onRecordEvent("turn.completion_idle_timeout", {
      threadId: params.threadId,
      turnId: params.getTurnId(),
      idleMs,
      timeoutMs,
      lastActivityReason: timeout.lastActivityReason,
      ...timeout.details,
    });
    log.warn("codex app-server turn idle timed out waiting for completion", {
      threadId: params.threadId,
      turnId: params.getTurnId(),
      idleMs,
      timeoutMs,
      lastActivityReason: timeout.lastActivityReason,
      ...timeout.details,
    });
    params.onAbort("turn_completion_idle_timeout");
  }
  function fireTerminalIdleTimeout() {
    if (
      params.isCompleted() ||
      params.isTerminalTurnNotificationQueued() ||
      params.signal.aborted ||
      !terminalIdleWatchArmed ||
      params.getActiveAppServerTurnRequests() > 0
    )
      return;
    const idleMs = Math.max(0, Date.now() - completionLastActivityAt);
    if (idleMs < turnTerminalIdleTimeoutMs) {
      scheduleTerminalIdleWatch();
      return;
    }
    const timeout = {
      kind: "terminal",
      idleMs,
      timeoutMs: turnTerminalIdleTimeoutMs,
      lastActivityReason: completionLastActivityReason,
      details: completionLastActivityDetails,
    };
    params.onTimeout(timeout);
    params.onMarkTimedOut();
    params.onRecordEvent("turn.terminal_idle_timeout", {
      threadId: params.threadId,
      turnId: params.getTurnId(),
      idleMs,
      timeoutMs: timeout.timeoutMs,
      lastActivityReason: timeout.lastActivityReason,
      ...timeout.details,
    });
    log.warn("codex app-server turn idle timed out waiting for terminal event", {
      threadId: params.threadId,
      turnId: params.getTurnId(),
      idleMs,
      timeoutMs: timeout.timeoutMs,
      lastActivityReason: timeout.lastActivityReason,
      ...timeout.details,
    });
    params.onAbort("turn_terminal_idle_timeout");
  }
  return {
    isCompletionIdleWatchArmed: () => completionIdleWatchArmed,
    isCompletionIdleWatchPinnedByTerminalError: () => completionIdleWatchPinnedByTerminalError,
    isAssistantCompletionIdleWatchArmed: () => assistantCompletionIdleWatchArmed,
    armAttemptIdleWatch: () => {
      attemptIdleWatchArmed = true;
      scheduleAttemptIdleWatch();
    },
    armTerminalIdleWatch: () => {
      terminalIdleWatchArmed = true;
      scheduleTerminalIdleWatch();
    },
    armCompletionIdleWatch: (options) => {
      completionIdleWatchArmed = true;
      completionIdleWatchPinnedByTerminalError = options?.pinnedByTerminalError === true;
      completionIdleTimeoutOverrideMs =
        options?.timeoutMs !== void 0 ? resolveWatchTimeoutMs(options.timeoutMs) : void 0;
      scheduleCompletionIdleWatch();
    },
    disarmCompletionIdleWatch: () => {
      completionIdleWatchArmed = false;
      completionIdleWatchPinnedByTerminalError = false;
      completionIdleTimeoutOverrideMs = void 0;
      clearCompletionIdleTimer();
    },
    armAssistantCompletionIdleWatch: (details) => {
      assistantCompletionIdleWatchArmed = true;
      assistantCompletionLastActivityAt = Date.now();
      assistantCompletionLastActivityDetails = details;
      scheduleAssistantCompletionIdleWatch();
    },
    disarmAssistantCompletionIdleWatch: () => {
      assistantCompletionIdleWatchArmed = false;
      assistantCompletionLastActivityDetails = void 0;
      clearAssistantCompletionIdleTimer();
    },
    touchActivity: (reason, options) => {
      completionLastActivityAt = Date.now();
      completionLastActivityReason = reason;
      completionLastActivityDetails = options?.details;
      completionIdleTimeoutOverrideMs = void 0;
      if (options?.attemptProgress) recordAttemptProgress(reason, options);
      params.onProgressDiagnostic(reason);
      if (options?.arm) {
        completionIdleWatchArmed = true;
        completionIdleWatchPinnedByTerminalError = false;
      }
      scheduleProgressWatches();
    },
    noteNotificationReceived: (method, options) => {
      const now = Date.now();
      completionLastActivityAt = Math.max(
        completionLastActivityAt,
        Math.min(now, options?.receivedAtMs ?? now),
      );
      completionLastActivityReason = `notification:${method}`;
      if (options?.details !== void 0) completionLastActivityDetails = options.details;
      if (options?.attemptProgress) recordAttemptProgress(completionLastActivityReason, options);
    },
    extendAttemptIdleWatch: (timeoutMs) => {
      attemptIdleTimeoutOverrideMs = resolveWatchTimeoutMs(timeoutMs);
      scheduleAttemptIdleWatch();
    },
    scheduleProgressWatches,
    clearCompletionIdleTimer,
    clearAssistantCompletionIdleTimer,
    clearTerminalIdleTimer,
    clearAttemptIdleTimer,
    clearAllTimers,
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-turn-state.ts
const CODEX_NATIVE_HOOK_RELAY_RENEW_INTERVAL_MS = 6e4;
function createCodexAttemptTurnState(resources) {
  const {
    prompt,
    state: resourceState,
    projectorRef,
    trajectoryRecorder,
    startupTimeoutMs,
  } = resources;
  const { context } = prompt;
  const { connection } = context.runtime;
  const { params, options, appServer, runAbortController } = connection;
  const state = {
    latestStartupErrorNotification: void 0,
    rateLimitsRevisionBeforeLastTurnStart: void 0,
    completed: false,
    terminalTurnNotificationQueued: false,
    timedOut: false,
    turnCompletionIdleTimedOut: false,
    turnWatchTimeoutKind: void 0,
    turnWatchTimeoutIdleMs: void 0,
    turnWatchTimeoutMs: void 0,
    turnWatchTimeoutLastActivityReason: void 0,
    turnWatchTimeoutDetails: void 0,
    turnCompletionIdleTimeoutMessage: void 0,
    clientClosedPromptError: void 0,
    clientClosedAbort: false,
    shouldDelayNativeHookRelayUnregister: false,
    lifecycleStarted: false,
    lifecycleTerminalEmitted: false,
    resolveCompletion: void 0,
    nativeHookRelayLastRenewedAt: 0,
    activeAppServerTurnRequests: 0,
    unsettledFinalizationHookCount: 0,
    rejectedFinalizationHookAssistant: void 0,
    turnCrossedToolHandoff: false,
    pendingTerminalDynamicToolRelease: void 0,
    terminalDynamicToolReleaseCheckScheduled: false,
    currentTurnHadNonTerminalDynamicToolResult: false,
  };
  const completion = new Promise((resolve) => {
    state.resolveCompletion = resolve;
  });
  const turnCompletionIdleTimeoutMs = resolveCodexTurnCompletionIdleTimeoutMs(
    options.turnCompletionIdleTimeoutMs ?? appServer.turnCompletionIdleTimeoutMs,
  );
  const turnAssistantCompletionIdleTimeoutMs = resolveCodexTurnAssistantCompletionIdleTimeoutMs(
    options.turnAssistantCompletionIdleTimeoutMs,
  );
  const postToolRawAssistantCompletionIdleTimeoutMs =
    resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs(
      options.postToolRawAssistantCompletionIdleTimeoutMs ??
        appServer.postToolRawAssistantCompletionIdleTimeoutMs,
      turnAssistantCompletionIdleTimeoutMs,
    );
  const turnTerminalIdleTimeoutMs = resolveCodexTurnTerminalIdleTimeoutMs(
    options.turnTerminalIdleTimeoutMs,
    params.runTimeoutOverrideMs,
  );
  const turnAttemptIdleTimeoutMs = Math.max(100, Math.floor(params.timeoutMs));
  const pendingOpenClawDynamicToolCompletionIds = /* @__PURE__ */ new Set();
  const openClawDynamicToolExecutions = createCodexDynamicToolExecutionRegistry();
  const activeTurnItemIds = /* @__PURE__ */ new Set();
  const activeCompletionBlockerItemIds = /* @__PURE__ */ new Set();
  const activeFinalizationHookRunIds = /* @__PURE__ */ new Set();
  const finalizationHookBatchStatuses = /* @__PURE__ */ new Map();
  const turnIdRef = {};
  const userInputBridgeRef = {};
  const steeringQueueRef = {};
  const renewNativeHookRelayForTurnProgress = () => {
    if (!resourceState.nativeHookRelay || options.nativeHookRelay?.ttlMs !== void 0) return;
    const now = Date.now();
    const renewsRecently =
      now - state.nativeHookRelayLastRenewedAt < CODEX_NATIVE_HOOK_RELAY_RENEW_INTERVAL_MS;
    const expiresSoon =
      now >= resourceState.nativeHookRelay.expiresAtMs - CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
    if (renewsRecently && !expiresSoon) return;
    state.nativeHookRelayLastRenewedAt = now;
    resourceState.nativeHookRelay.renew(
      resolveCodexNativeHookRelayTtlMs({
        explicitTtlMs: void 0,
        attemptTimeoutMs: turnAttemptIdleTimeoutMs,
        startupTimeoutMs,
        turnStartTimeoutMs: params.timeoutMs,
      }),
    );
  };
  return {
    state,
    completion,
    turnCompletionIdleTimeoutMs,
    turnAssistantCompletionIdleTimeoutMs,
    postToolRawAssistantCompletionIdleTimeoutMs,
    turnTerminalIdleTimeoutMs,
    turnAttemptIdleTimeoutMs,
    pendingOpenClawDynamicToolCompletionIds,
    openClawDynamicToolExecutions,
    activeTurnItemIds,
    activeCompletionBlockerItemIds,
    activeFinalizationHookRunIds,
    finalizationHookBatchStatuses,
    turnIdRef,
    userInputBridgeRef,
    steeringQueueRef,
    renewNativeHookRelayForTurnProgress,
    turnWatches: createCodexAttemptTurnWatchController({
      threadId: resourceState.thread.threadId,
      signal: runAbortController.signal,
      getTurnId: () => turnIdRef.current,
      isCompleted: () => state.completed,
      isTerminalTurnNotificationQueued: () => state.terminalTurnNotificationQueued,
      getActiveAppServerTurnRequests: () => state.activeAppServerTurnRequests,
      getActiveTurnItemCount: () => activeTurnItemIds.size,
      getActiveCompletionBlockerItemCount: () => activeCompletionBlockerItemIds.size,
      getActiveFinalizationHookCount: () => state.unsettledFinalizationHookCount,
      canReleaseAssistantCompletionIdle: () =>
        projectorRef.current?.hasLatestTerminalAssistantCandidateText() === true,
      turnCompletionIdleTimeoutMs,
      turnAssistantCompletionIdleTimeoutMs,
      turnAttemptIdleTimeoutMs,
      turnTerminalIdleTimeoutMs,
      interruptTimeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
      onInterruptTurn: (input) => interruptCodexTurnBestEffort(resourceState.client, input),
      onTimeout: (timeout) => {
        state.timedOut = true;
        state.turnCompletionIdleTimedOut = true;
        state.turnWatchTimeoutKind = timeout.kind;
        state.turnWatchTimeoutIdleMs = timeout.idleMs;
        state.turnWatchTimeoutMs = timeout.timeoutMs;
        state.turnWatchTimeoutLastActivityReason = timeout.lastActivityReason;
        state.turnWatchTimeoutDetails = timeout.details;
        state.turnCompletionIdleTimeoutMessage =
          "codex app-server turn idle timed out waiting for turn/completed";
      },
      onMarkTimedOut: () => projectorRef.current?.markTimedOut(),
      onAbort: (reason) => runAbortController.abort(reason),
      onCompleted: () => {
        state.completed = true;
      },
      onResolveCompletion: () => state.resolveCompletion?.(),
      onRecordEvent: (name, fields) => trajectoryRecorder?.recordEvent(name, fields),
      onAttemptProgress: (reason) => {
        renewNativeHookRelayForTurnProgress();
        params.onRunProgress?.({
          reason,
          provider: params.provider,
          model: params.modelId,
          backend: "codex-app-server",
        });
      },
      onProgressDiagnostic: (reason) => {
        emitTrustedDiagnosticEvent({
          type: "run.progress",
          runId: params.runId,
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          reason: `codex_app_server:${reason}`,
        });
      },
    }),
  };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt.ts
async function runCodexAppServerAttempt(params, options) {
  const runtime = await prepareCodexAttemptRuntime(
    await prepareCodexAttemptConnection({
      params,
      options,
    }),
  );
  const resources = prepareCodexAttemptResources(
    await prepareCodexAttemptPrompt(
      await prepareCodexAttemptContext(runtime, await prepareCodexAttemptTools(runtime)),
    ),
  );
  await startCodexAttemptRuntime(resources);
  const turnRuntime = createCodexAttemptTurnState(resources);
  const lifecycle = createCodexAttemptLifecycleController(resources, turnRuntime);
  const notifications = createCodexAttemptNotificationController(resources, turnRuntime, lifecycle);
  const { ensureCurrentThreadRoute } = await prepareCodexAttemptRoute(
    resources,
    turnRuntime,
    notifications,
    createCodexAttemptServerRequestController(resources, turnRuntime, lifecycle)
      .handleServerRequest,
  );
  const turnRequest = await prepareCodexAttemptTurnRequest(
    resources,
    turnRuntime,
    ensureCurrentThreadRoute,
    notifications.waitForActiveNativeTurnCompletion,
  );
  const turnStart = await startCodexAttemptTurn(resources, turnRuntime, notifications, turnRequest);
  if ("result" in turnStart) return turnStart.result;
  const activeTurn = await activateCodexAttemptTurn(
    resources,
    turnRuntime,
    lifecycle,
    notifications,
    turnStart.turn,
  );
  try {
    return await finalizeCodexAttempt(
      resources,
      turnRuntime,
      lifecycle,
      notifications,
      turnRequest,
      activeTurn,
    );
  } finally {
    await cleanupCodexAttempt(resources, turnRuntime, lifecycle, turnRequest, activeTurn);
  }
}
//#endregion
export { runCodexAppServerAttempt };
