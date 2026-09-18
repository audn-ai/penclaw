import crypto from "node:crypto";
import { n as isAbortError } from "./abort-signal-DEbc_zqk.js";
import {
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import {
  a as resolveInheritedToolPolicyForSession,
  i as resolveGroupToolPolicy,
  o as resolveSubagentToolPolicyForSession,
  r as resolveEffectiveToolPolicy,
} from "./agent-tools.policy-BQgyHzcD.js";
import { n as hasActiveApprovalNativeRouteRuntime } from "./approval-native-route-coordinator-Bz8uAvSP.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { t as resolveCommandAuthorization } from "./command-auth-CUBmRLXD.js";
import {
  a as isNativeCommandTurn,
  c as resolveCommandTurnTargetSessionKey,
  s as resolveCommandTurnContext,
} from "./command-turn-context-DXqYoJ8B.js";
import { r as matchPluginCommand } from "./commands-E5FKOfF0.js";
import { s as takeCommandSessionMetadataChanges } from "./commands-goal-8338SFRd.js";
import { r as findCommandByNativeName } from "./commands-registry-CqMJIODs.js";
import {
  i as resolveTextCommand,
  r as normalizeCommandBody,
} from "./commands-registry-normalize-C6c5CQe0.js";
import "./thinking-CVcRbjTC.js";
import {
  S as touchConversationBindingRecord,
  _ as toPluginConversationBinding,
  f as isPluginOwnedSessionBindingRecord,
  i as buildPluginBindingErrorText,
  p as markPluginBindingFallbackNoticeShown,
  r as buildPluginBindingDeclinedText,
  s as buildPluginBindingUnavailableText,
  u as hasShownPluginBindingFallbackNotice,
  x as resolveConversationBindingRecord,
} from "./conversation-binding-B-BUd2yg.js";
import { i as resolveConversationBindingContextFromMessage } from "./conversation-binding-input-D7ZTI22L.js";
import { o as runReplyPayloadSendingHook } from "./deliver-CpY6iKDw.js";
import { i as isOutboundDeliveryError } from "./deliver-types-eQDro8Up.js";
import {
  _ as markDiagnosticSessionProgress,
  a as logMessageDispatchStarted,
  c as logMessageReceived,
  i as logMessageDispatchCompleted,
} from "./diagnostic-DE-wbBb7.js";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-5-gsFhkM.js";
import "./message-channel-constants-CvbXi0yz.js";
import { n as RUN_STALE_TAKEOVER_MS } from "./diagnostic-run-activity-C7EqD7j0.js";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-Bnz26kFk.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  a as shouldAttemptTtsPayload,
  c as normalizeTtsAutoMode,
  o as shouldCleanTtsDirectiveText,
  r as resolveConfiguredTtsMode,
} from "./gateway-startup-speech-providers-DRg9FZJd.js";
import "./message-channel-NQc9DJ6B.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { r as resolveGroupSessionKey } from "./group-DxnHkVUi.js";
import "./model-selection-DOlkTrQa.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-jOYXwwnX.js";
import {
  n as getGlobalPluginRegistry,
  t as getGlobalHookRunner,
  u as fireAndForgetHook,
} from "./hook-runner-global-CPEPIvCK.js";
import { t as finalizeInboundContext } from "./inbound-context-DpKaYErg.js";
import {
  n as commitInboundDedupe,
  r as releaseInboundDedupe,
  t as claimInboundDedupe,
} from "./inbound-dedupe-MnitJkW7.js";
import { t as hasInboundAudio } from "./inbound-media-BABB4m9T.js";
import {
  m as triggerInternalHook,
  n as createInternalHookEvent,
} from "./internal-hooks-CckLIOgu.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { t as applyMergePatch } from "./merge-patch-r9Hm65ir.js";
import {
  n as hasTrustedMessageAuditListeners,
  t as emitTrustedMessageAuditEvent,
} from "./message-audit-events-CED2DE_D.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import {
  c as toPluginInboundClaimEvent,
  i as toInternalMessageReceivedContext,
  l as toPluginMessageContext,
  n as deriveInboundMessageHookContext,
  s as toPluginInboundClaimContext,
  u as toPluginMessageReceivedEvent,
} from "./message-hook-mappers-D15eDaaQ.js";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-B5OUoWal.js";
import { t as resolveChannelModelOverride } from "./model-overrides-C-j1UGRr.js";
import {
  i as buildModelAliasIndex,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { n as resolveOriginMessageProvider } from "./origin-routing-DR55bzxd.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  a as sanitizePendingFinalDeliveryText,
  t as buildPendingFinalDeliveryText,
} from "./pending-final-delivery-YbK8a1_s.js";
import {
  l as measureDiagnosticsTimelineSpan,
  u as measureDiagnosticsTimelineSpanSync,
} from "./plugin-metadata-snapshot-BMgImu0m.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import {
  a as createReplyDispatcherWithTyping,
  c as readDispatcherFailedCounts,
  i as createReplyDispatcher,
  n as captureReplyDispatchDeliveryOutcome,
  o as markReplyDispatchBeforeDeliverDeadlineOwned,
  r as composeReplyDispatchBeforeDeliver,
  s as waitForReplyDispatcherIdle,
  t as appendReplyDispatcherBeforeDeliverCancelled,
} from "./reply-dispatcher-BdFXrJUS.js";
import {
  a as getReplyPayloadMetadata,
  f as markReplyPayloadAsTtsSupplement,
  h as setReplyPayloadMetadata,
  i as copyReplyPayloadMetadata,
  l as isReplyPayloadStatusNotice,
  s as isFastModeAutoProgressPayload,
} from "./reply-payload-BK_jICQ3.js";
import {
  m as resolveSendableOutboundReplyParts,
  s as hasOutboundReplyContent,
} from "./reply-payload-DDwHXDkv.js";
import {
  A as waitForReplyBarrierSettlement,
  N as beginReplyOperationFinalizationWork,
  S as replyRunRegistry,
  d as forceClearReplyRunBySessionId,
} from "./reply-run-registry-CmZS-dyq.js";
import {
  a as resolveReplyDeliveryAccountId,
  o as resolveReplyToMode,
  t as createReplyDeliveryContext,
} from "./reply-threading-MGgPZ60G.js";
import {
  a as admitReplyTurn,
  i as resolveEffectiveReplyRoute,
  l as resolveSilentReplyPolicyFromPolicies,
  n as isReplyProfilerEnabled,
  o as resolveReplyTurnKind,
  s as runWithReplyOperationLifecycleAdmission,
} from "./reply-timing-tracker-D0tgm09L.js";
import { n as consumeReplyUsageState } from "./reply-usage-state-CKAjdMbE.js";
import { t as resolveRoutedDeliveryThreadId } from "./routed-delivery-thread-D658xqyQ.js";
import { o as selectAgentHarness } from "./selection-B2JBt0RT.js";
import { n as resolveSendPolicy } from "./send-policy-2la2ZHDC.js";
import { S as loadSessionEntry, at as updateSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { n as getSessionBindingService } from "./session-binding-service-DPVMwWUH.js";
import { t as isParentOwnedBackgroundAcpSession } from "./session-interaction-mode-OIH_Dwbr.js";
import { r as normalizeExplicitSessionKey } from "./session-key-Beu1vXbM.js";
import { n as isAcpSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { r as readAcpSessionMeta } from "./session-meta-IQvNG5NK.js";
import { r as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DgCFENjt.js";
import {
  a as resolveSourceReplyVisibilityPolicy,
  r as isUnauthorizedTextSlashCommand,
  t as isExplicitSourceReplyCommand,
} from "./source-reply-delivery-mode-a6QeCVR1.js";
import { n as resolveStoredModelOverride } from "./stored-model-override-C_kkI27o.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  o as resolveSubagentCapabilityStore,
  t as isSubagentEnvelopeSession,
} from "./subagent-capabilities-DP50Hfbb.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as isRecoverableTerminalSessionStatus } from "./terminal-status-A3S2hMpU.js";
import { u as normalizeVerboseLevel } from "./thinking.shared-BWnbgBUO.js";
import {
  c as mergeAlsoAllowPolicy,
  h as resolveToolProfilePolicy,
} from "./tool-policy-1QHiwXPv.js";
import { t as isToolAllowedByPolicies } from "./tool-policy-match-Bq6mIgOa.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-kgNtplfz.js";
import {
  n as stageRemoteInboundMediaIfNeeded,
  t as resolveRunTypingPolicy,
  u as withFullRuntimeReplyConfig,
} from "./typing-policy-DrqVO4vg.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/auto-reply/dispatch-dispatcher.ts
const settledTasksByDispatcher = /* @__PURE__ */ new WeakMap();
/** Register post-delivery work owned by the dispatcher's settle lifecycle. */
function registerReplyDispatcherSettledTask(dispatcher, task) {
  const tasks = settledTasksByDispatcher.get(dispatcher) ?? /* @__PURE__ */ new Set();
  tasks.add(task);
  settledTasksByDispatcher.set(dispatcher, tasks);
}
async function runReplyDispatcherSettledTasks(dispatcher) {
  const tasks = settledTasksByDispatcher.get(dispatcher);
  if (!tasks) return;
  settledTasksByDispatcher.delete(dispatcher);
  for (const task of tasks) await task();
}
/** Mark a dispatcher complete, wait for pending work, then run optional cleanup. */
async function settleReplyDispatcher(params) {
  params.dispatcher.markComplete();
  try {
    await params.dispatcher.waitForIdle();
    await runReplyDispatcherSettledTasks(params.dispatcher);
  } finally {
    settledTasksByDispatcher.delete(params.dispatcher);
    await params.onSettled?.();
  }
}
/** Run work with a dispatcher and always drain it before returning or throwing. */
async function withReplyDispatcher(params) {
  try {
    return await params.run();
  } finally {
    await settleReplyDispatcher(params);
  }
}
//#endregion
//#region src/channels/plugins/exec-approval-local.ts
function shouldSuppressLocalExecApprovalPrompt(params) {
  const channel = params.channel ? normalizeChannelId(params.channel) : null;
  if (!channel) return false;
  return (
    getChannelPlugin(channel)?.outbound?.shouldSuppressLocalPayloadPrompt?.({
      cfg: params.cfg,
      accountId: params.accountId,
      payload: params.payload,
      hint: {
        kind: "approval-pending",
        approvalKind: "exec",
        nativeRouteActive: hasActiveApprovalNativeRouteRuntime({
          channel,
          accountId: params.accountId,
          approvalKind: "exec",
        }),
      },
    }) ?? false
  );
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.abort.ts
var DispatchReplyOperationAbortedError = class extends Error {
  constructor() {
    super("Dispatch reply operation aborted");
    this.name = "AbortError";
  }
};
function isDispatchReplyOperationAbortedError(error) {
  return error instanceof DispatchReplyOperationAbortedError;
}
function runWithDispatchAbortSignal(signal, run, onWorkStarted) {
  if (signal?.aborted) return Promise.reject(new DispatchReplyOperationAbortedError());
  const shouldStopForAbort = () => signal?.aborted === true;
  let settled = false;
  let abortHandler;
  const work = Promise.resolve()
    .then(run)
    .then(
      (value) => {
        settled = true;
        return value;
      },
      (error) => {
        settled = true;
        if (shouldStopForAbort() && isAbortError(error))
          throw new DispatchReplyOperationAbortedError();
        throw error;
      },
    );
  onWorkStarted?.(work);
  if (!signal) return work;
  const aborted = new Promise((_, reject) => {
    abortHandler = () => {
      if (!settled && shouldStopForAbort()) reject(new DispatchReplyOperationAbortedError());
    };
    signal.addEventListener("abort", abortHandler, { once: true });
  });
  return Promise.race([work, aborted]).finally(() => {
    settled = true;
    if (abortHandler) signal.removeEventListener("abort", abortHandler);
  });
}
function createAbortAwareDispatcher(params) {
  const sendIfActive = (send) => (payload) => (params.isAborted() ? false : send(payload));
  const dispatcher = {
    sendToolResult: sendIfActive(params.dispatcher.sendToolResult),
    sendBlockReply: sendIfActive(params.dispatcher.sendBlockReply),
    sendFinalReply: sendIfActive(params.dispatcher.sendFinalReply),
    waitForIdle: () => params.dispatcher.waitForIdle(),
    getQueuedCounts: () => params.dispatcher.getQueuedCounts(),
    getFailedCounts: () => readDispatcherFailedCounts(params.dispatcher),
    markComplete: () => {
      if (!params.isAborted()) params.dispatcher.markComplete();
    },
  };
  if (params.dispatcher.getCancelledCounts)
    dispatcher.getCancelledCounts = () => params.dispatcher.getCancelledCounts();
  return dispatcher;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.audit.ts
function resolveCompletedInboundAuditReason(reason) {
  switch (reason) {
    case "fast_abort":
      return "fast_abort";
    case "plugin-bound-handled":
      return "plugin_bound_handled";
    case "plugin-bound-fallback-missing-plugin":
    case "plugin-bound-fallback-no-handler":
      return "plugin_bound_unavailable";
    case "plugin-bound-declined":
      return "plugin_bound_declined";
    case "before_dispatch_handled":
      return "before_dispatch_handled";
    case "acp_dispatch":
      return "acp_dispatch_completed";
    case "acp_empty_prompt":
      return "acp_dispatch_empty";
    default:
      return;
  }
}
function resolveSkippedInboundAuditReason(reason) {
  switch (reason) {
    case "duplicate":
      return "duplicate";
    case "reply-operation-active":
      return "reply_operation_active";
    case "reply_operation_aborted":
      return "reply_operation_aborted";
    default:
      return;
  }
}
function resolveInboundMessageAuditTerminal(outcome, reason) {
  if (reason === "plugin-bound-error")
    return {
      status: "failed",
      outcome: "failed",
      errorCode: "message_processing_failed",
      reasonCode: "plugin_bound_error",
    };
  if (reason?.startsWith("acp_error:"))
    return {
      status: "failed",
      outcome: "failed",
      errorCode: "message_processing_failed",
      reasonCode: "acp_dispatch_failed",
    };
  if (reason === "reply_operation_aborted")
    return {
      status: "blocked",
      outcome: "skipped",
      reasonCode: "reply_operation_aborted",
    };
  if (reason === "acp_aborted")
    return {
      status: "blocked",
      outcome: "skipped",
      reasonCode: "acp_dispatch_aborted",
    };
  if (outcome === "completed") {
    const reasonCode = resolveCompletedInboundAuditReason(reason);
    return {
      status: "succeeded",
      outcome: "completed",
      ...(reasonCode ? { reasonCode } : {}),
    };
  }
  if (outcome === "skipped") {
    const reasonCode = resolveSkippedInboundAuditReason(reason);
    return {
      status: "blocked",
      outcome: "skipped",
      ...(reasonCode ? { reasonCode } : {}),
    };
  }
  return {
    status: "failed",
    outcome: "failed",
    errorCode: "message_processing_failed",
  };
}
/**
 * Captures one terminal event for the reply-processing boundary. Channel admission and
 * pre-dispatch drops remain outside this boundary and need their own ingress projection.
 */
function createInboundMessageAuditTerminal(params) {
  if (!hasTrustedMessageAuditListeners()) return;
  const startedAt = Date.now();
  let notedTerminal;
  let observedRunId = normalizeOptionalString(params.replyOptions?.runId);
  let finished = false;
  const emitTerminal = (terminal, counts) => {
    if (finished) return;
    finished = true;
    const { ctx, cfg } = params;
    const occurredAt = Date.now();
    const sessionKey =
      normalizeOptionalString(ctx.SessionKey) ??
      normalizeOptionalString(ctx.CommandTargetSessionKey);
    const actorId = normalizeOptionalString(ctx.SenderId);
    const accountId = normalizeOptionalString(ctx.AccountId);
    const conversationId =
      normalizeOptionalString(ctx.NativeChannelId) ??
      normalizeOptionalString(ctx.OriginatingTo) ??
      normalizeOptionalString(ctx.To) ??
      normalizeOptionalString(ctx.From);
    const messageId =
      normalizeOptionalString(ctx.MessageSidFull) ??
      normalizeOptionalString(ctx.MessageSid) ??
      normalizeOptionalString(ctx.MessageSidFirst) ??
      normalizeOptionalString(ctx.MessageSidLast);
    const terminalFields = resolveInboundMessageAuditTerminal(
      terminal.outcome,
      terminal.options?.reason,
    );
    let agentId = normalizeOptionalString(ctx.AgentId);
    try {
      agentId = resolveSessionAgentId({
        sessionKey,
        config: cfg,
        agentId: ctx.AgentId,
      });
    } catch {}
    try {
      emitTrustedMessageAuditEvent({
        occurredAt,
        kind: "message",
        action: "message.inbound.processed",
        ...terminalFields,
        actorType: actorId ? "channel_sender" : "system",
        actorId: actorId ?? "gateway",
        ...(agentId ? { agentId } : {}),
        ...(observedRunId ? { runId: observedRunId } : {}),
        direction: "inbound",
        channel:
          normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel) ||
          normalizeLowercaseStringOrEmpty(ctx.Surface) ||
          normalizeLowercaseStringOrEmpty(ctx.Provider) ||
          "unknown",
        conversationKind: normalizeChatType(ctx.ChatType) ?? "unknown",
        durationMs: Math.max(0, occurredAt - startedAt),
        resultCount: counts.tool + counts.block + counts.final,
        ...(accountId ? { accountId } : {}),
        ...(conversationId ? { conversationId } : {}),
        ...(messageId ? { messageId } : {}),
      });
    } catch {}
  };
  return {
    note(outcome, options) {
      notedTerminal = {
        outcome,
        ...(options ? { options } : {}),
      };
    },
    observeRunId(runId) {
      observedRunId = normalizeOptionalString(runId) ?? observedRunId;
    },
    finishSuccess(result) {
      emitTerminal(notedTerminal ?? { outcome: "completed" }, result.counts);
    },
    finishError() {
      let counts = {
        tool: 0,
        block: 0,
        final: 0,
      };
      try {
        counts = params.dispatcher.getQueuedCounts();
      } catch {}
      emitTerminal({ outcome: "error" }, counts);
    },
  };
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.runtime.ts
/** Runtime-only dispatch dependencies shared by config-driven reply delivery. */
/** Runtime-only dispatch dependencies shared by config-driven reply delivery. */
function loadSessionStoreEntry(params) {
  return loadSessionEntry(params);
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.context.ts
function routeThreadIdsDiffer(left, right) {
  if (left === void 0 || right === void 0) return false;
  return String(left) !== String(right);
}
function isSlackDirectRoutedThreadTurn(ctx) {
  if (normalizeChatType(ctx.ChatType) !== "direct") return false;
  if (ctx.MessageThreadId == null && ctx.TransportThreadId == null) return false;
  return [ctx.Provider, ctx.Surface, ctx.OriginatingChannel].some(
    (value) => normalizeOptionalString(value)?.toLowerCase() === "slack",
  );
}
function shouldLetSlackRoutedThreadBypassBusyReplyOperation(params) {
  return (
    isSlackDirectRoutedThreadTurn(params.ctx) &&
    routeThreadIdsDiffer(params.activeOperation?.routeThreadId, params.routeThreadId)
  );
}
function resolveRoutedPolicyConversationType(ctx) {
  const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
  if (commandTargetSessionKey && commandTargetSessionKey !== ctx.SessionKey) return;
  const chatType = normalizeChatType(ctx.ChatType);
  if (chatType === "direct") return "direct";
  if (chatType === "group" || chatType === "channel") return "group";
}
function resolveSessionStoreLookup(ctx, cfg) {
  const sessionKey = normalizeOptionalString(
    resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey,
  );
  if (!sessionKey) return {};
  const agentId = resolveSessionAgentId({
    sessionKey,
    config: cfg,
    fallbackAgentId: ctx.AgentId,
  });
  const storePath = resolveStorePath(cfg.session?.store, { agentId });
  try {
    const entry = loadSessionStoreEntry({
      agentId,
      storePath,
      sessionKey,
      readConsistency: "latest",
      clone: false,
    });
    return {
      sessionKey,
      storePath,
      entry,
      store: entry ? { [sessionKey]: entry } : void 0,
    };
  } catch {
    return {
      sessionKey,
      storePath,
    };
  }
}
function resolveBoundAcpDispatchSessionKey(params) {
  const bindingContext = resolveConversationBindingContextFromMessage({
    cfg: params.cfg,
    ctx: params.ctx,
  });
  if (!bindingContext) return;
  const binding = getSessionBindingService().resolveByConversation({
    channel: bindingContext.channel,
    accountId: bindingContext.accountId,
    conversationId: bindingContext.conversationId,
    ...(bindingContext.parentConversationId
      ? { parentConversationId: bindingContext.parentConversationId }
      : {}),
  });
  const targetSessionKey = normalizeOptionalString(binding?.targetSessionKey);
  if (!binding || !targetSessionKey || !isAcpSessionKey(targetSessionKey)) return;
  if (isPluginOwnedSessionBindingRecord(binding)) return;
  getSessionBindingService().touch(binding.bindingId);
  return targetSessionKey;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.harness-defaults.ts
function createShouldEmitVerboseProgress(params) {
  const resolveCurrentExplicitLevel = () => {
    if (params.sessionKey && params.storePath)
      try {
        return normalizeVerboseLevel(
          loadSessionStoreEntry({
            ...(params.agentId ? { agentId: params.agentId } : {}),
            storePath: params.storePath,
            sessionKey: params.sessionKey,
            readConsistency: "latest",
            clone: false,
          })?.verboseLevel ?? "",
        );
      } catch {}
    return normalizeVerboseLevel(params.initialExplicitLevel ?? "");
  };
  const resolveLevel = () => {
    const explicitLevel = resolveCurrentExplicitLevel();
    if (explicitLevel) return explicitLevel;
    return normalizeVerboseLevel(params.fallbackLevel) ?? "off";
  };
  return {
    shouldEmit: () => resolveLevel() !== "off",
    shouldEmitFull: () => resolveLevel() === "full",
  };
}
function resolveHarnessDefaultChannel(params) {
  const originatingChannel =
    typeof params.ctx.OriginatingChannel === "string" ? params.ctx.OriginatingChannel : void 0;
  return (
    params.entry?.channel ??
    params.entry?.origin?.provider ??
    originatingChannel ??
    params.ctx.Provider ??
    params.ctx.Surface
  );
}
function resolveHarnessDefaultParentSessionKey(params) {
  return (
    params.entry?.parentSessionKey ??
    params.ctx.ModelParentSessionKey ??
    params.ctx.ParentSessionKey
  );
}
function resolveTurnModelOverride(replyOptions) {
  if (replyOptions?.isHeartbeat !== true) return;
  return normalizeOptionalString(replyOptions.heartbeatModelOverride);
}
function resolveChannelModelCandidate(params) {
  if (!params.cfg.channels?.modelByChannel) return;
  const channel = resolveHarnessDefaultChannel({
    ctx: params.ctx,
    entry: params.entry,
  });
  const channelModelOverride = resolveChannelModelOverride({
    cfg: params.cfg,
    channel,
    groupId: params.entry?.groupId,
    groupChatType: params.entry?.chatType ?? params.ctx.ChatType,
    groupChannel: params.entry?.groupChannel ?? params.ctx.GroupChannel,
    groupSubject: params.entry?.subject ?? params.ctx.GroupSubject,
    parentSessionKey: params.parentSessionKey,
    directUserIds: [
      params.entry?.origin?.nativeDirectUserId,
      params.entry?.origin?.from,
      params.entry?.origin?.to,
      params.ctx.OriginatingTo,
      params.ctx.From,
      params.ctx.SenderId,
    ],
  });
  if (!channelModelOverride) return;
  return resolveModelRefFromString({
    raw: channelModelOverride.model,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
  })?.ref;
}
function resolveStoredModelCandidate(params) {
  const storedModelRef = resolveStoredModelOverride({
    loadSessionEntry: (sessionKey) => {
      const agentId = resolveSessionAgentId({
        sessionKey,
        config: params.cfg,
        fallbackAgentId: params.sessionAgentId,
      });
      return loadSessionStoreEntry({
        agentId,
        storePath: resolveStorePath(params.cfg.session?.store, { agentId }),
        sessionKey,
        readConsistency: "latest",
        clone: false,
      });
    },
    sessionEntry: params.entry,
    sessionStore: params.sessionStore,
    sessionKey: params.sessionKey,
    parentSessionKey: params.parentSessionKey,
    defaultProvider: params.defaultProvider,
  });
  if (!storedModelRef) return;
  return {
    provider: storedModelRef.provider ?? params.defaultProvider,
    model: storedModelRef.model,
  };
}
function resolveModelOverrideCandidate(params) {
  if (!params.modelOverride) return;
  return resolveModelRefFromString({
    raw: params.modelOverride,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
  })?.ref;
}
function resolveHarnessSourceVisibleRepliesDefault(params) {
  if (isNativeCommandTurn(resolveCommandTurnContext(params.ctx))) return;
  try {
    const defaultModelRef = resolveDefaultModelForAgent({
      cfg: params.cfg,
      agentId: params.sessionAgentId,
    });
    const aliasIndex = buildModelAliasIndex({
      cfg: params.cfg,
      defaultProvider: defaultModelRef.provider,
    });
    const parentSessionKey = resolveHarnessDefaultParentSessionKey(params);
    const channelModelCandidate = resolveChannelModelCandidate({
      aliasIndex,
      cfg: params.cfg,
      ctx: params.ctx,
      defaultProvider: defaultModelRef.provider,
      entry: params.entry,
      parentSessionKey,
    });
    const storedModelCandidate = resolveStoredModelCandidate({
      cfg: params.cfg,
      defaultProvider: defaultModelRef.provider,
      entry: params.entry,
      parentSessionKey,
      sessionAgentId: params.sessionAgentId,
      sessionKey: params.sessionKey,
      sessionStore: params.sessionStore,
    });
    const turnModelCandidate = resolveModelOverrideCandidate({
      aliasIndex,
      defaultProvider: defaultModelRef.provider,
      modelOverride: params.turnModelOverride,
    });
    const resolveCandidateDefault = (candidate) => {
      const agentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
        provider: candidate.provider,
        entry: params.entry,
        cfg: params.cfg,
      });
      return selectAgentHarness({
        provider: candidate.provider,
        modelId: candidate.model,
        config: params.cfg,
        agentId: params.sessionAgentId,
        sessionKey: params.sessionKey,
        agentHarnessId:
          params.entry?.modelSelectionLocked === true ? params.entry.agentHarnessId : void 0,
        agentHarnessRuntimeOverride,
      }).deliveryDefaults?.sourceVisibleReplies;
    };
    const selectedModelCandidate =
      turnModelCandidate ?? storedModelCandidate ?? channelModelCandidate;
    if (selectedModelCandidate) return resolveCandidateDefault(selectedModelCandidate);
    const sourceProvider = normalizeOptionalString(
      params.entry?.origin?.provider ?? params.ctx.Provider ?? params.ctx.Surface,
    );
    if (sourceProvider) {
      const sourceDefault = resolveCandidateDefault({ provider: sourceProvider });
      if (sourceDefault) return sourceDefault;
    }
    return resolveCandidateDefault(defaultModelRef);
  } catch (error) {
    logVerbose(
      `dispatch-from-config: could not resolve harness visible-reply defaults: ${formatErrorMessage(error)}`,
    );
    return;
  }
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.lifecycle.ts
function createDispatchReplyOperationCoordinator(params) {
  let dispatchReplyOperation;
  let dispatchAbortOperation;
  let preDispatchAbortOperation;
  let preDispatchLifecycleAdmission;
  let preDispatchLifecycleAbortController;
  let dispatchLifecycleAbortController;
  let preDispatchLifecycleInterrupted = false;
  const dispatchLifecycleWork = /* @__PURE__ */ new Set();
  const trackDispatchLifecycleWork = (work) => {
    if (!dispatchReplyOperation && !preDispatchLifecycleAdmission) return;
    const settled = work.then(
      () => {},
      () => {},
    );
    dispatchLifecycleWork.add(settled);
    settled.then(() => {
      dispatchLifecycleWork.delete(settled);
    });
  };
  const waitForDispatchLifecycleWorkAndDelivery = async () => {
    await Promise.allSettled(Array.from(dispatchLifecycleWork));
    await waitForReplyDispatcherIdle(params.dispatcher);
  };
  const releasePreDispatchLifecycleAdmission = async (afterWorkBarrier) => {
    const admission = preDispatchLifecycleAdmission;
    const preDispatchAbortController = preDispatchLifecycleAbortController;
    const dispatchAbortController = dispatchLifecycleAbortController;
    preDispatchLifecycleAdmission = void 0;
    if (!admission) return;
    const pendingWork = Array.from(dispatchLifecycleWork);
    const clearAbortControllers = () => {
      if (preDispatchLifecycleAbortController === preDispatchAbortController)
        preDispatchLifecycleAbortController = void 0;
      if (dispatchLifecycleAbortController === dispatchAbortController)
        dispatchLifecycleAbortController = void 0;
    };
    if (!afterWorkBarrier && pendingWork.length === 0) {
      clearAbortControllers();
      admission.release();
      return;
    }
    try {
      await Promise.allSettled(pendingWork);
      if (afterWorkBarrier)
        await waitForReplyBarrierSettlement(
          afterWorkBarrier(),
          params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.(),
        );
    } finally {
      clearAbortControllers();
      admission.release();
    }
  };
  const runWithDispatchLifecycleAdmission = async (run) => {
    if (dispatchReplyOperation)
      return await runWithReplyOperationLifecycleAdmission(dispatchReplyOperation, run);
    return preDispatchLifecycleAdmission
      ? await preDispatchLifecycleAdmission.run(run)
      : await run();
  };
  const ensureDispatchReplyOperation = async (phase) => {
    if (phase === "dispatch") {
      await releasePreDispatchLifecycleAdmission(() =>
        waitForReplyDispatcherIdle(params.dispatcher),
      );
      if (preDispatchLifecycleInterrupted)
        return { status: dispatchReplyOperation ? "aborted" : "busy" };
    }
    if (dispatchReplyOperation) return { status: "ready" };
    if (dispatchAbortOperation && !dispatchAbortOperation.result)
      return dispatchReplyOperation ? { status: "ready" } : { status: "busy" };
    if (
      phase === "dispatch" &&
      preDispatchAbortOperation?.result &&
      preDispatchAbortOperation.result.kind !== "completed" &&
      !dispatchReplyOperation
    ) {
      dispatchAbortOperation = preDispatchAbortOperation;
      return { status: "busy" };
    }
    if (!params.dispatchOperationSessionKey) return { status: "ready" };
    const operationSessionId =
      dispatchAbortOperation?.sessionId ??
      params.operationSessionStoreEntry.entry?.sessionId ??
      crypto.randomUUID();
    const replyTurnKind = resolveReplyTurnKind(params.replyOptions);
    const allowActivePreDispatch = phase === "pre_dispatch" && replyTurnKind === "visible";
    if (
      phase === "dispatch" &&
      replyTurnKind === "visible" &&
      params.replyOptions?.queuedFollowupLifecycle !== void 0 &&
      replyRunRegistry.get(params.dispatchOperationSessionKey) !== void 0
    )
      return { status: "ready" };
    const allowSlackRoutedThreadBypass =
      phase === "dispatch" &&
      shouldLetSlackRoutedThreadBypassBusyReplyOperation({
        activeOperation: replyRunRegistry.get(params.dispatchOperationSessionKey),
        ctx: params.ctx,
        routeThreadId: params.routeThreadId,
      });
    const lifecycleOnlyAbortController =
      allowActivePreDispatch || allowSlackRoutedThreadBypass ? new AbortController() : void 0;
    const onLifecycleInterrupt = () => {
      preDispatchLifecycleInterrupted = true;
      lifecycleOnlyAbortController?.abort();
    };
    let admission = await admitReplyTurn({
      sessionKey: params.dispatchOperationSessionKey,
      sessionId: operationSessionId,
      expectedSessionId: params.resolveOperationExpectedSessionId(),
      expectedActiveOperation: params.initialDispatchReplyOperation,
      storePath: params.operationSessionStoreEntry.storePath,
      kind: replyTurnKind,
      resetTriggered: false,
      routeThreadId: params.routeThreadId,
      upstreamAbortSignal: params.replyOptions?.abortSignal,
      waitForActive: !allowActivePreDispatch && !allowSlackRoutedThreadBypass,
      retainLifecycleAdmissionOnActive: allowActivePreDispatch || allowSlackRoutedThreadBypass,
      onLifecycleInterrupt,
    });
    if (
      admission.status === "skipped" &&
      admission.reason === "active-run" &&
      replyTurnKind === "visible" &&
      isRecoverableTerminalSessionStatus(params.operationSessionStoreEntry.entry?.status) &&
      admission.activeOperation?.sessionId === params.operationSessionStoreEntry.entry?.sessionId &&
      !admission.activeOperation?.terminalRecovery
    ) {
      if (
        forceClearReplyRunBySessionId(
          admission.activeOperation?.sessionId ?? operationSessionId,
          /* @__PURE__ */ new Error("clearing stale terminal reply operation"),
        )
      ) {
        admission.lifecycleAdmission?.release();
        logVerbose(
          `dispatch-from-config: cleared stale active reply operation for terminal session ${params.dispatchOperationSessionKey}`,
        );
        admission = await admitReplyTurn({
          sessionKey: params.dispatchOperationSessionKey,
          sessionId: operationSessionId,
          expectedSessionId: params.resolveOperationExpectedSessionId(),
          expectedActiveOperation: params.initialDispatchReplyOperation,
          storePath: params.operationSessionStoreEntry.storePath,
          kind: replyTurnKind,
          resetTriggered: false,
          routeThreadId: params.routeThreadId,
          upstreamAbortSignal: params.replyOptions?.abortSignal,
          waitForActive: !allowActivePreDispatch && !allowSlackRoutedThreadBypass,
          retainLifecycleAdmissionOnActive: allowActivePreDispatch || allowSlackRoutedThreadBypass,
          onLifecycleInterrupt,
        });
      }
    }
    if (admission.status === "skipped") {
      if (allowActivePreDispatch && admission.reason === "active-run") {
        preDispatchAbortOperation = admission.activeOperation;
        preDispatchLifecycleAdmission = admission.lifecycleAdmission;
        preDispatchLifecycleAbortController = lifecycleOnlyAbortController;
        return { status: "ready" };
      }
      if (
        admission.reason === "active-run" &&
        shouldLetSlackRoutedThreadBypassBusyReplyOperation({
          activeOperation: admission.activeOperation,
          ctx: params.ctx,
          routeThreadId: params.routeThreadId,
        })
      ) {
        preDispatchLifecycleAdmission = admission.lifecycleAdmission;
        dispatchLifecycleAbortController = lifecycleOnlyAbortController;
        logVerbose(
          `dispatch-from-config: allowing Slack routed thread ${params.routeThreadId} while ${params.dispatchOperationSessionKey} has an active reply operation in another Slack thread`,
        );
        return { status: "ready" };
      }
      admission.lifecycleAdmission?.release();
      dispatchAbortOperation = admission.activeOperation;
      logVerbose(
        `dispatch-from-config: skipped reply operation admission for ${params.dispatchOperationSessionKey}; reason=${admission.reason}`,
      );
      return { status: "busy" };
    }
    if (
      replyTurnKind === "visible" &&
      isRecoverableTerminalSessionStatus(params.operationSessionStoreEntry.entry?.status) &&
      operationSessionId === params.operationSessionStoreEntry.entry?.sessionId
    )
      admission.operation.markTerminalRecovery();
    dispatchReplyOperation = admission.operation;
    dispatchReplyOperation.retainFailureUntilComplete();
    dispatchAbortOperation = admission.operation;
    return { status: "ready" };
  };
  const getPreDispatchAbortOperation = () => dispatchAbortOperation ?? preDispatchAbortOperation;
  let cachedPreDispatchAbortSignal;
  let cachedDispatchAbortSignal;
  const getPreDispatchAbortSignal = () => {
    const operationSignal = getPreDispatchAbortOperation()?.abortSignal;
    const lifecycleSignal = preDispatchLifecycleAbortController?.signal;
    const upstreamSignal = params.replyOptions?.abortSignal;
    if (
      cachedPreDispatchAbortSignal &&
      cachedPreDispatchAbortSignal.operationSignal === operationSignal &&
      cachedPreDispatchAbortSignal.lifecycleSignal === lifecycleSignal &&
      cachedPreDispatchAbortSignal.upstreamSignal === upstreamSignal
    )
      return cachedPreDispatchAbortSignal.signal;
    const abortSignals = [operationSignal, lifecycleSignal, upstreamSignal].filter((signal) =>
      Boolean(signal),
    );
    const signal = abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0];
    cachedPreDispatchAbortSignal = {
      operationSignal,
      lifecycleSignal,
      upstreamSignal,
      signal,
    };
    return signal;
  };
  const getDispatchAbortSignal = () => {
    const operationSignal =
      dispatchReplyOperation?.abortSignal ?? dispatchLifecycleAbortController?.signal;
    const upstreamSignal = operationSignal ? void 0 : params.replyOptions?.abortSignal;
    if (
      cachedDispatchAbortSignal &&
      cachedDispatchAbortSignal.operationSignal === operationSignal &&
      cachedDispatchAbortSignal.upstreamSignal === upstreamSignal
    )
      return cachedDispatchAbortSignal.signal;
    const signal = operationSignal ?? upstreamSignal;
    cachedDispatchAbortSignal = {
      operationSignal,
      upstreamSignal,
      signal,
    };
    return signal;
  };
  const getQueuedFollowupAbortSignal = () =>
    dispatchReplyOperation?.abortSignal ?? params.replyOptions?.abortSignal;
  let observedReplyDelivery = false;
  const markObservedReplyDelivery = async () => {
    if (observedReplyDelivery) return;
    observedReplyDelivery = true;
    await params.replyOptions?.onObservedReplyDelivery?.();
  };
  const getReplyOptions = () => {
    const abortSignal = getDispatchAbortSignal();
    const onAgentRunStart = params.messageAuditTerminal
      ? (runId) => {
          params.messageAuditTerminal?.observeRunId(runId);
          params.replyOptions?.onAgentRunStart?.(runId);
        }
      : void 0;
    if (!abortSignal && !onAgentRunStart) return params.replyOptions;
    return {
      ...params.replyOptions,
      ...(abortSignal
        ? {
            abortSignal,
            queuedFollowupAbortSignal: getQueuedFollowupAbortSignal(),
          }
        : {}),
      ...(onAgentRunStart ? { onAgentRunStart } : {}),
      ...(dispatchReplyOperation ? { replyOperation: dispatchReplyOperation } : {}),
    };
  };
  const completeDispatchReplyOperation = () => {
    const completionBarrier = waitForDispatchLifecycleWorkAndDelivery();
    releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
    if (dispatchReplyOperation)
      dispatchReplyOperation.completeWithAfterClearBarrier(
        completionBarrier,
        params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.(),
      );
  };
  const failDispatchReplyOperation = (error) => {
    const completionBarrier = waitForDispatchLifecycleWorkAndDelivery();
    releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
    if (!dispatchReplyOperation) return;
    dispatchReplyOperation.freezeAbort();
    if (!dispatchReplyOperation.result) dispatchReplyOperation.fail("run_failed", error);
    dispatchReplyOperation.completeWithAfterClearBarrier(
      completionBarrier,
      params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.(),
    );
  };
  const isDispatchOperationAborted = () => getDispatchAbortSignal()?.aborted === true;
  const isPreDispatchOperationAborted = () => getPreDispatchAbortSignal()?.aborted === true;
  const throwIfDispatchOperationAborted = () => {
    if (isDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
  };
  return {
    completeDispatchReplyOperation,
    dispatchHookDispatcher: createAbortAwareDispatcher({
      dispatcher: params.dispatcher,
      isAborted: isPreDispatchOperationAborted,
    }),
    ensureDispatchReplyOperation,
    failDispatchReplyOperation,
    getDispatchAbortOperation: () => dispatchAbortOperation,
    getDispatchAbortSignal,
    getDispatchReplyOperation: () => dispatchReplyOperation,
    getReplyOptions,
    getObservedReplyDelivery: () => observedReplyDelivery,
    getPreDispatchAbortSignal,
    isDispatchOperationAborted,
    isPreDispatchOperationAborted,
    markObservedReplyDelivery,
    releasePreDispatchLifecycleAdmission,
    runWithDispatchLifecycleAdmission,
    throwIfDispatchOperationAborted,
    trackDispatchLifecycleWork,
  };
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.payloads.ts
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
function createFinalDispatchPayloadDedupeKey(payload) {
  const metadata = getReplyPayloadMetadata(payload);
  return JSON.stringify({
    payload: {
      text: payload.text,
      mediaUrl: payload.mediaUrl,
      mediaUrls: payload.mediaUrls,
      trustedLocalMedia: payload.trustedLocalMedia,
      sensitiveMedia: payload.sensitiveMedia,
      presentation: payload.presentation,
      delivery: payload.delivery,
      interactive: payload.interactive,
      btw: payload.btw,
      replyToId: payload.replyToId,
      replyToTag: payload.replyToTag,
      replyToCurrent: payload.replyToCurrent,
      audioAsVoice: payload.audioAsVoice,
      spokenText: payload.spokenText,
      ttsSupplement: payload.ttsSupplement,
      isError: payload.isError,
      isReasoning: payload.isReasoning,
      isCommentary: payload.isCommentary,
      isReasoningSnapshot: payload.isReasoningSnapshot,
      isCompactionNotice: payload.isCompactionNotice,
      isFallbackNotice: payload.isFallbackNotice,
      isStatusNotice: payload.isStatusNotice,
      channelData: payload.channelData,
    },
    identity: {
      assistantMessageIndex: metadata?.assistantMessageIndex,
      assistantTranscriptOwned: metadata?.assistantTranscriptOwned,
      replyToIdExplicit: metadata?.replyToIdExplicit,
      replyDelivery: metadata?.replyDelivery,
      replyDeliverySource: metadata?.replyDeliverySource,
      sourceReplyTranscriptMirror: metadata?.sourceReplyTranscriptMirror,
    },
  });
}
function formatSuppressedReplyPayloadForLog(reply) {
  const metadata = getReplyPayloadMetadata(reply);
  const text = normalizeOptionalString(reply.text);
  const textPreview = text ? truncateUtf16Safe(text.replace(/\s+/g, " "), 160) : void 0;
  const sendableParts = resolveSendableOutboundReplyParts(reply);
  const richParts = [
    reply.presentation ? "presentation" : void 0,
    reply.interactive ? "interactive" : void 0,
    reply.channelData ? "channelData" : void 0,
  ].filter(Boolean);
  return [
    `textChars=${text?.length ?? 0}`,
    `media=${sendableParts.mediaCount}`,
    `rich=${richParts.length ? richParts.join("|") : "none"}`,
    `error=${reply.isError === true}`,
    `beforeAgentRunBlocked=${metadata?.beforeAgentRunBlocked === true}`,
    `deliverDespiteSuppression=${metadata?.deliverDespiteSourceReplySuppression === true}`,
    textPreview ? `textPreview=${JSON.stringify(textPreview)}` : void 0,
  ]
    .filter(Boolean)
    .join(" ");
}
async function maybeApplyTtsToReplyPayload(params) {
  if (isReplyPayloadStatusNotice(params.payload)) return params.payload;
  if (
    !shouldAttemptTtsPayload({
      cfg: params.cfg,
      ttsAuto: params.ttsAuto,
      agentId: params.agentId,
      channelId: params.channel,
      accountId: params.accountId,
    })
  )
    return params.payload;
  const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
  const ttsPayload = await maybeApplyTtsToPayload(params);
  return ttsPayload === params.payload
    ? ttsPayload
    : copyReplyPayloadMetadata(params.payload, ttsPayload);
}
function createFinalizationAwareTtsPayloadApplier(params) {
  return async (ttsParams) => {
    const replyOperation = params.getReplyOperation();
    const finishFinalizationWork = replyOperation
      ? beginReplyOperationFinalizationWork(replyOperation, RUN_STALE_TAKEOVER_MS)
      : void 0;
    try {
      return await maybeApplyTtsToReplyPayload({
        ...ttsParams,
        inboundAudio: params.hasInboundAudio(),
      });
    } finally {
      finishFinalizationWork?.();
      replyOperation?.recordActivity();
    }
  };
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.pending-final.ts
function matchesPendingFinalDeliveryIdentity(entry, expected) {
  if (Boolean(entry.pendingFinalDelivery || entry.pendingFinalDeliveryText) !== expected.present)
    return false;
  if (expected.intentId)
    return normalizeOptionalString(entry.pendingFinalDeliveryIntentId) === expected.intentId;
  return (
    entry.pendingFinalDeliveryCreatedAt === expected.createdAt &&
    normalizeOptionalString(entry.pendingFinalDeliveryText) === expected.text
  );
}
async function clearPendingFinalDeliveryAfterSuccess(params) {
  const identity = params.identity;
  if (!params.storePath || !params.sessionKey || !identity?.present) return;
  await updateSessionEntry(
    {
      storePath: params.storePath,
      sessionKey: params.sessionKey,
    },
    async (entry) => {
      if (!matchesPendingFinalDeliveryIdentity(entry, identity)) return null;
      if (!entry.pendingFinalDelivery && !entry.pendingFinalDeliveryText) return null;
      return {
        pendingFinalDelivery: void 0,
        pendingFinalDeliveryText: void 0,
        pendingFinalDeliveryCreatedAt: void 0,
        pendingFinalDeliveryLastAttemptAt: void 0,
        pendingFinalDeliveryAttemptCount: void 0,
        pendingFinalDeliveryLastError: void 0,
        pendingFinalDeliveryContext: void 0,
        pendingFinalDeliveryIntentId: void 0,
        updatedAt: Date.now(),
      };
    },
    {
      skipMaintenance: true,
      takeCacheOwnership: true,
    },
  );
}
function capturePendingFinalDeliveryIdentity(params) {
  if (!params.storePath || !params.sessionKey) return;
  try {
    const entry = loadSessionEntry({
      storePath: params.storePath,
      sessionKey: params.sessionKey,
      hydrateSkillPromptRefs: false,
      readConsistency: "latest",
    });
    if (
      params.intentId &&
      normalizeOptionalString(entry?.pendingFinalDeliveryIntentId) !== params.intentId
    )
      return { present: false };
    return {
      present: Boolean(entry?.pendingFinalDelivery || entry?.pendingFinalDeliveryText),
      intentId: params.intentId ?? normalizeOptionalString(entry?.pendingFinalDeliveryIntentId),
      createdAt:
        typeof entry?.pendingFinalDeliveryCreatedAt === "number"
          ? entry.pendingFinalDeliveryCreatedAt
          : void 0,
      text: normalizeOptionalString(entry?.pendingFinalDeliveryText),
    };
  } catch {
    return params.intentId
      ? {
          present: true,
          intentId: params.intentId,
        }
      : void 0;
  }
}
function buildPendingFinalDeliveryRetryText(payloads) {
  return sanitizePendingFinalDeliveryText(
    payloads
      .map(
        (payload) =>
          getReplyPayloadMetadata(payload)?.pendingFinalDeliveryRetryText ??
          buildPendingFinalDeliveryText([payload]),
      )
      .filter(Boolean)
      .join("\n\n"),
  );
}
function resolvePendingFinalDeliveryPayloads(params) {
  const intentReplies = params.intentId
    ? params.replies.filter((reply) => {
        const metadata = getReplyPayloadMetadata(reply);
        return (
          metadata?.pendingFinalDeliveryIntentId === params.intentId &&
          metadata?.pendingFinalDeliveryRetryText !== void 0
        );
      })
    : [];
  const intentContributors = intentReplies.filter(
    (reply) => getReplyPayloadMetadata(reply)?.pendingFinalDeliveryRetryText,
  );
  const intentText = buildPendingFinalDeliveryRetryText(intentContributors);
  if (
    intentReplies.length > 0 &&
    intentText.replace(/\s+/g, " ").trim() === params.pendingText.replace(/\s+/g, " ").trim()
  )
    return intentContributors;
  const contributingReplies = params.replies.filter(
    (reply) => buildPendingFinalDeliveryText([reply]) !== "",
  );
  if (buildPendingFinalDeliveryText(contributingReplies) === params.pendingText)
    return contributingReplies;
  const exactMatches = contributingReplies.filter(
    (reply) => buildPendingFinalDeliveryText([reply]) === params.pendingText,
  );
  return exactMatches.length === 1 ? exactMatches : void 0;
}
async function reconcilePendingFinalDeliveryAfterSettlement(params) {
  const identity = params.identity;
  if (!params.storePath || !params.sessionKey || !identity?.present) return;
  await updateSessionEntry(
    {
      storePath: params.storePath,
      sessionKey: params.sessionKey,
    },
    async (entry) => {
      if (!matchesPendingFinalDeliveryIdentity(entry, identity)) return null;
      const pendingText = normalizeOptionalString(entry.pendingFinalDeliveryText);
      if (!entry.pendingFinalDelivery && !pendingText) return null;
      const pendingPayloads = pendingText
        ? resolvePendingFinalDeliveryPayloads({
            intentId: identity.intentId,
            pendingText,
            replies: params.replies,
          })
        : void 0;
      const pendingPayloadSet = pendingPayloads ? new Set(pendingPayloads) : void 0;
      const relevantDeliveries = pendingPayloadSet
        ? params.deliveries.filter((delivery) => pendingPayloadSet.has(delivery.payload))
        : params.deliveries;
      const ownsEveryPendingPayload =
        !pendingPayloadSet || relevantDeliveries.length === pendingPayloadSet.size;
      const failedBeforeDeliver = relevantDeliveries.filter(
        (delivery) => delivery.outcome === "failed-before-deliver",
      );
      if (relevantDeliveries.length > 0 && failedBeforeDeliver.length === relevantDeliveries.length)
        return null;
      if (pendingPayloadSet && ownsEveryPendingPayload && failedBeforeDeliver.length > 0) {
        const retryText = buildPendingFinalDeliveryRetryText(
          failedBeforeDeliver.map((delivery) => delivery.payload),
        );
        if (retryText)
          return {
            pendingFinalDelivery: true,
            pendingFinalDeliveryText: retryText,
            updatedAt: Date.now(),
          };
      }
      return {
        pendingFinalDelivery: void 0,
        pendingFinalDeliveryText: void 0,
        pendingFinalDeliveryCreatedAt: void 0,
        pendingFinalDeliveryLastAttemptAt: void 0,
        pendingFinalDeliveryAttemptCount: void 0,
        pendingFinalDeliveryLastError: void 0,
        pendingFinalDeliveryContext: void 0,
        pendingFinalDeliveryIntentId: void 0,
        updatedAt: Date.now(),
      };
    },
    {
      skipMaintenance: true,
      takeCacheOwnership: true,
    },
  );
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.plugin-binding.ts
function shouldBypassPluginOwnedBindingForCommand(ctx, cfg) {
  const commandTurn = resolveCommandTurnContext(ctx);
  if (
    (commandTurn.kind === "native" || commandTurn.kind === "text-slash") &&
    !commandTurn.authorized
  )
    return false;
  if (isNativeCommandTurn(commandTurn) && commandTurn.authorized) return true;
  if (!isExplicitSourceReplyCommand(ctx, cfg)) return false;
  const commandBody = normalizeCommandBody(commandTurn.body ?? ctx.CommandBody ?? "", {
    botUsername: ctx.BotUsername,
  });
  if (!commandBody.startsWith("/")) return false;
  if (resolveTextCommand(commandBody)) return true;
  const provider = normalizeOptionalString(ctx.Provider ?? ctx.Surface);
  if (
    commandTurn.commandName &&
    findCommandByNativeName(commandTurn.commandName, provider, {
      includeBundledChannelFallback: true,
    })
  )
    return true;
  return Boolean(
    matchPluginCommand(commandBody, {
      channel: normalizeOptionalString(ctx.Surface ?? ctx.Provider),
    }),
  );
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.runtime-loaders.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime.js"));
const getReplyFromConfigRuntimeLoader = createLazyImportLoader(
  () => import("./get-reply-from-config.runtime.js"),
);
const abortRuntimeLoader = createLazyImportLoader(() => import("./abort.runtime.js"));
const runtimePluginsLoader = createLazyImportLoader(() => import("./runtime-plugins.runtime.js"));
const replyMediaPathsRuntimeLoader = createLazyImportLoader(
  () => import("./reply-media-paths.runtime.js"),
);
function loadRouteReplyRuntime() {
  return routeReplyRuntimeLoader.load();
}
function loadGetReplyFromConfigRuntime() {
  return getReplyFromConfigRuntimeLoader.load();
}
function loadAbortRuntime() {
  return abortRuntimeLoader.load();
}
function loadRuntimePlugins() {
  return runtimePluginsLoader.load();
}
function loadReplyMediaPathsRuntime() {
  return replyMediaPathsRuntimeLoader.load();
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.timing.ts
const replyHotPathTimingLog = createSubsystemLogger("auto-reply/reply-timing");
const REPLY_HOT_PATH_TIMING_WARN_TOTAL_MS = 1e3;
const REPLY_HOT_PATH_TIMING_WARN_STAGE_MS = 500;
function createReplyHotPathTimingTracker(options = {}) {
  if (!options.profilerEnabled)
    return {
      async measure(_name, run) {
        return await run();
      },
      logIfSlow() {},
    };
  const startedAt = Date.now();
  let didLog = false;
  const spans = [];
  const toMs = (value) => Math.max(0, Math.round(value));
  const snapshot = () => ({
    totalMs: toMs(Date.now() - startedAt),
    spans: spans.slice(),
  });
  const shouldLog = (summary) =>
    summary.totalMs >= REPLY_HOT_PATH_TIMING_WARN_TOTAL_MS ||
    summary.spans.some((span) => span.durationMs >= REPLY_HOT_PATH_TIMING_WARN_STAGE_MS);
  const formatSpans = (summary) =>
    summary.spans.length > 0
      ? summary.spans
          .map((span) => `${span.name}:${span.durationMs}ms@${span.elapsedMs}ms`)
          .join(",")
      : "none";
  return {
    async measure(name, run) {
      const spanStartedAt = Date.now();
      try {
        return await run();
      } finally {
        spans.push({
          name,
          durationMs: toMs(Date.now() - spanStartedAt),
          elapsedMs: toMs(Date.now() - startedAt),
        });
      }
    },
    logIfSlow(params) {
      if (didLog) return;
      const summary = snapshot();
      if (!shouldLog(summary)) return;
      didLog = true;
      replyHotPathTimingLog.warn(
        `reply hot path timings channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} outcome=${params.outcome} totalMs=${summary.totalMs} stages=${formatSpans(summary)}${params.reason ? ` reason=${params.reason}` : ""}`,
        {
          channel: params.channel,
          messageId: params.messageId,
          sessionKey: params.sessionKey,
          outcome: params.outcome,
          reason: params.reason,
          totalMs: summary.totalMs,
          spans: summary.spans,
        },
      );
    },
  };
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.transcript.ts
async function mirrorDeliveredReplyToTranscript(params) {
  const mirror = params.metadata;
  if (!mirror) return;
  try {
    const result = await appendAssistantMessageToSessionTranscript({
      sessionKey: mirror.sessionKey,
      agentId: mirror.agentId,
      ...(mirror.expectedSessionId ? { expectedSessionId: mirror.expectedSessionId } : {}),
      text: mirror.text,
      mediaUrls: mirror.preferText && mirror.text ? void 0 : mirror.mediaUrls,
      idempotencyKey: mirror.idempotencyKey,
      ...(mirror.deliveryMirror ? { deliveryMirror: mirror.deliveryMirror } : {}),
      ...(mirror.storePath ? { storePath: mirror.storePath } : {}),
      updateMode: "inline",
      config: params.cfg,
      beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
    });
    if (!result.ok) logVerbose(`dispatch-from-config: transcript mirror skipped: ${result.reason}`);
  } catch (error) {
    logVerbose(
      `dispatch-from-config: transcript mirror failed after delivery: ${formatErrorMessage(error)}`,
    );
  }
}
/** Reads final outcome counters from dispatchers that expose them. */
function getDispatcherFinalOutcomeCounts(dispatcher) {
  return {
    cancelled: dispatcher.getCancelledCounts?.().final ?? 0,
    failed: readDispatcherFailedCounts(dispatcher).final,
  };
}
function transcriptMirrorForDeliveredPayload(metadata, payload) {
  const sendable = resolveSendableOutboundReplyParts(payload);
  if (!sendable.text && sendable.mediaUrls.length === 0) return;
  return {
    ...metadata,
    text: sendable.text,
    mediaUrls: sendable.mediaUrls.length > 0 ? sendable.mediaUrls : void 0,
  };
}
const STALE_FOREGROUND_SUPPRESSED_FINAL_TEXT =
  "Channel final suppressed before delivery: stale foreground";
function captureSuppressedTranscriptMirror(params) {
  const payloadMetadata = getReplyPayloadMetadata(params.payload);
  if (
    !params.metadata.transcriptOwner ||
    payloadMetadata?.foregroundDeliverySuppression?.reason !== "stale-foreground"
  )
    return;
  const sourceMessageId = normalizeOptionalString(params.metadata.deliveryMirror?.sourceMessageId);
  if (!sourceMessageId) return;
  const { transcriptOwner: _transcriptOwner, ...metadata } = params.metadata;
  return {
    ...metadata,
    text: STALE_FOREGROUND_SUPPRESSED_FINAL_TEXT,
    mediaUrls: void 0,
    preferText: true,
    idempotencyKey: `channel-final-suppressed:${sourceMessageId}:${params.deliveryId ?? "single"}`,
    deliveryMirror: {
      kind: "channel-final-suppressed",
      reason: "stale-foreground",
      sourceMessageId,
    },
  };
}
function captureDeliveredTranscriptMirror(params) {
  if (!params.metadata || !params.dispatcher.appendBeforeDeliver)
    return () => (params.metadata?.transcriptOwner ? void 0 : params.metadata);
  const metadata = params.metadata;
  let deliveredMetadata;
  let suppressedMetadata;
  let observedFinal = false;
  const { idempotencyKey, sessionKey } = metadata;
  params.dispatcher.appendBeforeDeliver((payload, info) => {
    if (info.kind !== "final") return payload;
    if (getReplyPayloadMetadata(payload)?.finalDeliveryCapture !== params.captureToken)
      return payload;
    observedFinal = true;
    const payloadMirror = getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror;
    if (
      payloadMirror &&
      payloadMirror.idempotencyKey === idempotencyKey &&
      payloadMirror.sessionKey === sessionKey
    )
      deliveredMetadata = transcriptMirrorForDeliveredPayload(
        {
          ...payloadMirror,
          ...(metadata.expectedSessionId ? { expectedSessionId: metadata.expectedSessionId } : {}),
          storePath: metadata.storePath,
        },
        payload,
      );
    else if (
      !payloadMirror &&
      !metadata.transcriptOwner &&
      (!idempotencyKey || metadata.deliveryMirror)
    )
      deliveredMetadata = transcriptMirrorForDeliveredPayload(metadata, payload);
    return payload;
  });
  appendReplyDispatcherBeforeDeliverCancelled(params.dispatcher, (payload, info) => {
    if (info.kind !== "final") return;
    if (getReplyPayloadMetadata(payload)?.finalDeliveryCapture !== params.captureToken) return;
    observedFinal = true;
    suppressedMetadata = captureSuppressedTranscriptMirror({
      metadata,
      payload,
      deliveryId: params.deliveryId,
    });
  });
  return () =>
    observedFinal
      ? (suppressedMetadata ?? deliveredMetadata)
      : metadata.transcriptOwner
        ? void 0
        : metadata;
}
async function mirrorTranscriptAfterDispatcherSettled(params) {
  const after = getDispatcherFinalOutcomeCounts(params.dispatcher);
  const metadata = params.metadata();
  if (!metadata) return;
  if (
    !(metadata.deliveryMirror?.kind === "channel-final-suppressed") &&
    (after.cancelled > params.before.cancelled || after.failed > params.before.failed)
  )
    return;
  await mirrorDeliveredReplyToTranscript({
    metadata,
    cfg: params.cfg,
  });
}
//#endregion
//#region src/auto-reply/reply/routing-policy.ts
/** Resolves whether replies should route to the originating channel or current surface. */
/** Computes source-routing and typing suppression for a reply turn. */
function resolveReplyRoutingDecision(params) {
  const originatingChannel = normalizeMessageChannel(params.originatingChannel);
  const providerChannel = normalizeMessageChannel(params.provider);
  const surfaceChannel = normalizeMessageChannel(params.surface);
  const currentSurface = providerChannel ?? surfaceChannel;
  const isInternalWebchatTurn =
    currentSurface === "webchat" &&
    (surfaceChannel === "webchat" || !surfaceChannel) &&
    params.explicitDeliverRoute !== true;
  const shouldRouteToOriginating = Boolean(
    !params.suppressDirectUserDelivery &&
    !isInternalWebchatTurn &&
    params.isRoutableChannel(originatingChannel) &&
    params.originatingTo &&
    originatingChannel !== currentSurface,
  );
  return {
    originatingChannel,
    currentSurface,
    isInternalWebchatTurn,
    shouldRouteToOriginating,
    shouldSuppressTyping:
      params.suppressDirectUserDelivery === true ||
      shouldRouteToOriginating ||
      originatingChannel === "webchat",
  };
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.ts
/** Main reply dispatch pipeline from finalized config/context to delivery payloads. */
function createReplyDispatchEvent(params) {
  const { shouldSendToolSummaries, ...event } = params;
  return Object.defineProperty(event, "shouldSendToolSummaries", {
    enumerable: true,
    get: shouldSendToolSummaries,
  });
}
/** Dispatches a reply from config, context, command handling, agent run, and delivery policy. */
async function dispatchReplyFromConfig(params) {
  const messageAuditTerminal = createInboundMessageAuditTerminal(params);
  try {
    const result = await dispatchReplyFromConfigInner(params, messageAuditTerminal);
    messageAuditTerminal?.finishSuccess(result);
    return result;
  } catch (error) {
    messageAuditTerminal?.finishError();
    throw error;
  }
}
async function dispatchReplyFromConfigInner(params, messageAuditTerminal) {
  const { ctx, cfg, dispatcher } = params;
  if (params.replyOptions?.abortSignal?.aborted) {
    messageAuditTerminal?.note("skipped", { reason: "reply_operation_aborted" });
    return {
      queuedFinal: false,
      counts: dispatcher.getQueuedCounts(),
    };
  }
  const diagnosticsEnabled = isDiagnosticsEnabled(cfg);
  const channel = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider ?? "unknown");
  const chatId = ctx.To ?? ctx.From;
  const messageId =
    ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
  const sessionKey =
    normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.CommandTargetSessionKey);
  const startTime = diagnosticsEnabled ? Date.now() : 0;
  const canTrackSession = diagnosticsEnabled && Boolean(sessionKey);
  const initialSessionStoreEntry = resolveSessionStoreLookup(ctx, cfg);
  const messageLifecycle = createDiagnosticMessageLifecycle({
    enabled: diagnosticsEnabled,
    channel,
    chatId,
    messageId,
    sessionKey,
    sessionId:
      initialSessionStoreEntry.sessionKey === sessionKey
        ? initialSessionStoreEntry.entry?.sessionId
        : void 0,
    source: "dispatch",
    processingReason: "message_start",
    startedAtMs: startTime,
    trackSessionState: canTrackSession,
  });
  const traceAttributes = {
    surface: channel,
    hasSessionKey: Boolean(sessionKey),
    hasRunId: typeof params.replyOptions?.runId === "string",
  };
  const replyHotPathTiming = createReplyHotPathTimingTracker({
    profilerEnabled: isReplyProfilerEnabled({ config: cfg }),
  });
  const traceReplyPhase = (name, run) =>
    replyHotPathTiming.measure(name, () =>
      measureDiagnosticsTimelineSpan(name, run, {
        phase: "agent-turn",
        config: cfg,
        attributes: traceAttributes,
      }),
    );
  let agentDispatchStartedAt = 0;
  const recordProcessed = (outcome, opts) => {
    messageAuditTerminal?.note(outcome, opts);
    if (diagnosticsEnabled)
      replyHotPathTiming.logIfSlow({
        channel,
        messageId,
        sessionKey,
        outcome,
        reason: opts?.reason,
      });
    messageLifecycle.markProcessed(outcome, opts);
  };
  const recordAgentDispatchStarted = () => {
    if (!diagnosticsEnabled || agentDispatchStartedAt > 0) return;
    agentDispatchStartedAt = Date.now();
    logMessageDispatchStarted({
      channel,
      sessionKey: acpDispatchSessionKey,
      source: "replyResolver",
    });
  };
  const recordAgentDispatchCompleted = (outcome, opts) => {
    if (!diagnosticsEnabled || agentDispatchStartedAt <= 0) return;
    logMessageDispatchCompleted({
      channel,
      sessionKey: acpDispatchSessionKey,
      source: "replyResolver",
      durationMs: Date.now() - agentDispatchStartedAt,
      outcome,
      reason: opts?.reason,
      error: opts?.error,
    });
  };
  const markProcessing = () => {
    messageLifecycle.markProcessing();
  };
  const markIdle = (reason) => {
    messageLifecycle.markIdle(reason);
  };
  let inboundDedupeReplayUnsafe = false;
  const markInboundDedupeReplayUnsafe = () => {
    inboundDedupeReplayUnsafe = true;
  };
  const boundAcpDispatchSessionKey = resolveBoundAcpDispatchSessionKey({
    ctx,
    cfg,
  });
  const acpDispatchSessionKey =
    boundAcpDispatchSessionKey ?? initialSessionStoreEntry.sessionKey ?? sessionKey;
  const sourceSessionKey = normalizeOptionalString(ctx.SessionKey);
  const dispatchOperationSessionKey =
    sourceSessionKey ?? initialSessionStoreEntry.sessionKey ?? sessionKey ?? acpDispatchSessionKey;
  const operationSessionStoreEntry =
    sourceSessionKey &&
    initialSessionStoreEntry.sessionKey &&
    sourceSessionKey !== initialSessionStoreEntry.sessionKey
      ? resolveSessionStoreLookup(
          {
            ...ctx,
            CommandTargetSessionKey: void 0,
          },
          cfg,
        )
      : initialSessionStoreEntry;
  const initialDispatchReplyOperation = dispatchOperationSessionKey
    ? replyRunRegistry.get(dispatchOperationSessionKey)
    : void 0;
  if (
    params.replyOptions?.isHeartbeat === true &&
    dispatchOperationSessionKey &&
    initialDispatchReplyOperation
  ) {
    messageAuditTerminal?.note("skipped", { reason: "reply-operation-active" });
    return {
      queuedFinal: false,
      counts: dispatcher.getQueuedCounts(),
    };
  }
  const markProgress = () => {
    if (!canTrackSession || !sessionKey) return;
    markDiagnosticSessionProgress({ sessionKey });
    if (acpDispatchSessionKey && acpDispatchSessionKey !== sessionKey)
      markDiagnosticSessionProgress({ sessionKey: acpDispatchSessionKey });
  };
  const sessionStoreEntry = boundAcpDispatchSessionKey
    ? resolveSessionStoreLookup(
        {
          ...ctx,
          SessionKey: boundAcpDispatchSessionKey,
        },
        cfg,
      )
    : initialSessionStoreEntry;
  let preparedSessionBinding =
    sessionStoreEntry.sessionKey && sessionStoreEntry.entry?.sessionId
      ? {
          sessionKey: sessionStoreEntry.sessionKey,
          sessionId: sessionStoreEntry.entry.sessionId,
          storePath: sessionStoreEntry.storePath,
        }
      : void 0;
  let preparedOperationSessionBinding =
    operationSessionStoreEntry.sessionKey && operationSessionStoreEntry.entry?.sessionId
      ? {
          sessionKey: operationSessionStoreEntry.sessionKey,
          sessionId: operationSessionStoreEntry.entry.sessionId,
          storePath: operationSessionStoreEntry.storePath,
        }
      : void 0;
  const sessionKeysMatch = (left, right) =>
    Boolean(
      left &&
      right &&
      normalizeExplicitSessionKey(left, ctx) === normalizeExplicitSessionKey(right, ctx),
    );
  const notePreparedSession = (binding) => {
    if (sessionKeysMatch(binding.sessionKey, sessionStoreEntry.sessionKey))
      preparedSessionBinding = binding;
    if (sessionKeysMatch(binding.sessionKey, operationSessionStoreEntry.sessionKey))
      preparedOperationSessionBinding = binding;
    params.replyOptions?.onSessionPrepared?.(binding);
  };
  const resolveOperationExpectedSessionId = () =>
    preparedOperationSessionBinding?.sessionId ?? operationSessionStoreEntry.entry?.sessionId;
  const resolvePreparedTranscriptBinding = (mirrorSessionKey) => {
    if (
      !preparedSessionBinding ||
      !sessionKeysMatch(mirrorSessionKey, preparedSessionBinding.sessionKey)
    )
      return;
    return preparedSessionBinding;
  };
  const sessionAgentId = resolveSessionAgentId({
    sessionKey: acpDispatchSessionKey,
    config: cfg,
    fallbackAgentId: ctx.AgentId,
  });
  const sessionAgentCfg = resolveAgentConfig(cfg, sessionAgentId);
  const verboseProgress = createShouldEmitVerboseProgress({
    agentId: sessionAgentId,
    sessionKey: acpDispatchSessionKey,
    storePath: sessionStoreEntry.storePath,
    initialExplicitLevel: sessionStoreEntry.entry?.verboseLevel,
    fallbackLevel:
      normalizeVerboseLevel(
        sessionStoreEntry.entry?.verboseLevel ??
          sessionAgentCfg?.verboseDefault ??
          cfg.agents?.defaults?.verboseDefault ??
          "",
      ) ?? "off",
  });
  const shouldEmitVerboseProgress = verboseProgress.shouldEmit;
  const shouldEmitFullVerboseProgress = verboseProgress.shouldEmitFull;
  const replyRoute = resolveEffectiveReplyRoute({
    ctx,
    entry: sessionStoreEntry.entry,
  });
  const routeThreadId = resolveRoutedDeliveryThreadId({
    ctx,
    sessionKey: acpDispatchSessionKey,
  });
  const routeReplyThreadId = replyRoute.threadId ?? routeThreadId;
  const inboundAudio = hasInboundAudio(ctx);
  const sessionTtsAuto = normalizeTtsAutoMode(sessionStoreEntry.entry?.ttsAuto);
  const workspaceDir = resolveAgentWorkspaceDir(cfg, sessionAgentId);
  const {
    completeDispatchReplyOperation,
    dispatchHookDispatcher,
    ensureDispatchReplyOperation,
    failDispatchReplyOperation,
    getDispatchAbortOperation,
    getDispatchAbortSignal,
    getDispatchReplyOperation,
    getObservedReplyDelivery,
    getPreDispatchAbortSignal,
    getReplyOptions,
    isDispatchOperationAborted,
    isPreDispatchOperationAborted,
    markObservedReplyDelivery,
    releasePreDispatchLifecycleAdmission,
    runWithDispatchLifecycleAdmission,
    throwIfDispatchOperationAborted,
    trackDispatchLifecycleWork,
  } = createDispatchReplyOperationCoordinator({
    ctx,
    dispatcher,
    dispatchOperationSessionKey,
    initialDispatchReplyOperation,
    messageAuditTerminal,
    operationSessionStoreEntry,
    replyOptions: params.replyOptions,
    resolveOperationExpectedSessionId,
    routeThreadId,
  });
  const maybeApplyTtsWithFinalizationLease = createFinalizationAwareTtsPayloadApplier({
    getReplyOperation: getDispatchReplyOperation,
    hasInboundAudio: () =>
      inboundAudio || getDispatchReplyOperation()?.acceptedSteeredInboundAudio === true,
  });
  const { ensureRuntimePluginsLoaded } = await traceReplyPhase("reply.load_runtime_plugins", () =>
    loadRuntimePlugins(),
  );
  await traceReplyPhase("reply.ensure_runtime_plugins", () => {
    ensureRuntimePluginsLoaded({
      config: cfg,
      workspaceDir,
    });
  });
  const hookRunner = getGlobalHookRunner();
  const timestamp =
    typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0;
  const messageIdForHook =
    ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
  const hookCtx = { ...ctx };
  const buildHookState = (sourceCtx) => {
    const nextHookContext = deriveInboundMessageHookContext(sourceCtx, {
      messageId: messageIdForHook,
    });
    return {
      hookContext: nextHookContext,
      inboundClaimContext: toPluginInboundClaimContext(nextHookContext),
      inboundClaimEvent: toPluginInboundClaimEvent(nextHookContext, {
        commandAuthorized:
          typeof ctx.CommandAuthorized === "boolean" ? ctx.CommandAuthorized : void 0,
        wasMentioned: typeof ctx.WasMentioned === "boolean" ? ctx.WasMentioned : void 0,
      }),
    };
  };
  let { hookContext, inboundClaimContext, inboundClaimEvent } = buildHookState(hookCtx);
  const { isGroup, groupId } = hookContext;
  let hookMediaPrepared = false;
  let hookMediaMetadataStaged = false;
  const prepareHookMediaMetadata = async () => {
    if (hookMediaPrepared) return;
    hookMediaPrepared = true;
    if (
      await traceReplyPhase("reply.stage_remote_media_for_dispatch", () =>
        stageRemoteInboundMediaIfNeeded({
          ctx: hookCtx,
          cfg,
          sessionKey: acpDispatchSessionKey,
          workspaceDir,
          remoteMediaMode: "cache",
        }),
      )
    ) {
      hookMediaMetadataStaged = true;
      ({ hookContext, inboundClaimContext, inboundClaimEvent } = buildHookState(hookCtx));
    }
  };
  const buildMessageReceivedHookContext = () => {
    const mediaRemoteHost = normalizeOptionalString(ctx.MediaRemoteHost);
    const hasUnstagedRemoteMediaMetadata = Boolean(
      hookContext.mediaPath ||
      hookContext.mediaUrl ||
      hookContext.mediaType ||
      hookContext.mediaPaths?.length ||
      hookContext.mediaUrls?.length ||
      hookContext.mediaTypes?.length,
    );
    if (hookMediaMetadataStaged || !mediaRemoteHost || !hasUnstagedRemoteMediaMetadata)
      return hookContext;
    const messageReceivedCtx = { ...hookCtx };
    delete messageReceivedCtx.MediaPath;
    delete messageReceivedCtx.MediaPaths;
    delete messageReceivedCtx.MediaUrl;
    delete messageReceivedCtx.MediaUrls;
    delete messageReceivedCtx.MediaType;
    delete messageReceivedCtx.MediaTypes;
    return {
      ...buildHookState(messageReceivedCtx).hookContext,
      mediaRemoteHost,
      mediaStagingPending: true,
      originalMediaPath: hookContext.mediaPath,
      originalMediaUrl: hookContext.mediaUrl,
      originalMediaType: hookContext.mediaType,
      originalMediaPaths: hookContext.mediaPaths,
      originalMediaUrls: hookContext.mediaUrls,
      originalMediaTypes: hookContext.mediaTypes,
    };
  };
  const sessionAcpMeta = sessionStoreEntry.sessionKey
    ? readAcpSessionMeta({ sessionKey: sessionStoreEntry.sessionKey })
    : void 0;
  const suppressAcpChildUserDelivery = isParentOwnedBackgroundAcpSession(
    sessionAcpMeta && sessionStoreEntry.entry
      ? {
          ...sessionStoreEntry.entry,
          acp: sessionAcpMeta,
        }
      : sessionStoreEntry.entry,
  );
  const normalizedRouteReplyChannel = normalizeMessageChannel(replyRoute.channel);
  const normalizedProviderChannel = normalizeMessageChannel(ctx.Provider);
  const normalizedSurfaceChannel = normalizeMessageChannel(ctx.Surface);
  const normalizedCurrentSurface = normalizedProviderChannel ?? normalizedSurfaceChannel;
  const effectiveExplicitDeliverRoute =
    ctx.ExplicitDeliverRoute === true || replyRoute.inheritedExternalRoute === true;
  const isInternalWebchatTurn =
    normalizedCurrentSurface === "webchat" &&
    (normalizedSurfaceChannel === "webchat" || !normalizedSurfaceChannel) &&
    !effectiveExplicitDeliverRoute;
  const routeReplyRuntime = Boolean(
    !suppressAcpChildUserDelivery &&
    !isInternalWebchatTurn &&
    normalizedRouteReplyChannel &&
    replyRoute.to &&
    normalizedRouteReplyChannel !== normalizedCurrentSurface,
  )
    ? await loadRouteReplyRuntime()
    : void 0;
  const {
    originatingChannel: routeReplyChannel,
    currentSurface,
    shouldRouteToOriginating,
    shouldSuppressTyping,
  } = resolveReplyRoutingDecision({
    provider: ctx.Provider,
    surface: ctx.Surface,
    explicitDeliverRoute: effectiveExplicitDeliverRoute,
    originatingChannel: replyRoute.channel,
    originatingTo: replyRoute.to,
    suppressDirectUserDelivery: suppressAcpChildUserDelivery,
    isRoutableChannel: routeReplyRuntime?.isRoutableChannel ?? (() => false),
  });
  const routeReplyTo = replyRoute.to;
  const deliveryChannel = shouldRouteToOriginating ? routeReplyChannel : currentSurface;
  const shouldPrepareRoutedReplyDelivery = shouldRouteToOriginating && Boolean(routeReplyChannel);
  const replyContextAccountId = routeReplyChannel
    ? resolveReplyDeliveryAccountId(cfg, routeReplyChannel, replyRoute.accountId)
    : void 0;
  const routedReplyAccountId = shouldPrepareRoutedReplyDelivery ? replyContextAccountId : void 0;
  const routedReplyDelivery = shouldPrepareRoutedReplyDelivery
    ? createReplyDeliveryContext(
        resolveReplyToMode(cfg, routeReplyChannel, routedReplyAccountId, replyRoute.chatType),
        replyRoute.chatType,
      )
    : void 0;
  let normalizeReplyMediaPaths;
  const getNormalizeReplyMediaPaths = async () => {
    if (normalizeReplyMediaPaths) return normalizeReplyMediaPaths;
    const { createReplyMediaPathNormalizer } = await loadReplyMediaPathsRuntime();
    normalizeReplyMediaPaths = createReplyMediaPathNormalizer({
      cfg,
      sessionKey: acpDispatchSessionKey,
      workspaceDir,
      messageProvider: deliveryChannel,
      accountId: replyContextAccountId,
      groupId,
      groupChannel: ctx.GroupChannel,
      groupSpace: ctx.GroupSpace,
      requesterSenderId: ctx.SenderId,
      requesterSenderName: ctx.SenderName,
      requesterSenderUsername: ctx.SenderUsername,
      requesterSenderE164: ctx.SenderE164,
    });
    return normalizeReplyMediaPaths;
  };
  const normalizeReplyMediaPayload = async (payload) => {
    if (!resolveSendableOutboundReplyParts(payload).hasMedia) return payload;
    return await (
      await getNormalizeReplyMediaPaths()
    )(payload);
  };
  const routeReplyToOriginating = async (payload, options) => {
    if (!shouldRouteToOriginating || !routeReplyChannel || !routeReplyTo || !routeReplyRuntime)
      return null;
    markInboundDedupeReplayUnsafe();
    const agentRuntimeSessionKey =
      ctx.CommandSource === "native"
        ? (resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey)
        : ctx.SessionKey;
    return await routeReplyRuntime.routeReply({
      payload,
      channel: routeReplyChannel,
      to: routeReplyTo,
      sessionKey: agentRuntimeSessionKey,
      policySessionKey: resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey,
      policyConversationType: resolveRoutedPolicyConversationType(ctx),
      accountId: routedReplyAccountId,
      requesterSenderId: ctx.SenderId,
      requesterSenderName: ctx.SenderName,
      requesterSenderUsername: ctx.SenderUsername,
      requesterSenderE164: ctx.SenderE164,
      threadId: routeReplyThreadId,
      replyDelivery: routedReplyDelivery,
      cfg,
      abortSignal: options?.abortSignal,
      mirror: options?.mirror,
      isGroup,
      groupId,
      replyKind: options?.kind ?? "final",
      runId: params.replyOptions?.runId,
    });
  };
  const isRoutedReplyDelivered = (result) => result.ok && result.suppressed !== true;
  /**
   * Helper to send a payload via route-reply (async).
   * Only used when actually routing to a different provider.
   * Note: Only called when shouldRouteToOriginating is true, so
   * routeReplyChannel and routeReplyTo are guaranteed to be defined.
   */
  const sendPayloadAsync = async (payload, abortSignal, mirror, kind = "tool") => {
    if (!routeReplyRuntime || !routeReplyChannel || !routeReplyTo) return;
    const effectiveAbortSignal = abortSignal ?? getDispatchAbortSignal();
    if (effectiveAbortSignal?.aborted) return;
    const result = await routeReplyToOriginating(payload, {
      abortSignal: effectiveAbortSignal,
      mirror,
      kind,
    });
    if (result && !result.ok)
      logVerbose(`dispatch-from-config: route-reply failed: ${result.error ?? "unknown error"}`);
  };
  const deliverBindingPayload = async (payload, mode) => {
    const result = await routeReplyToOriginating(payload, {
      kind: mode === "terminal" ? "final" : "tool",
    });
    if (result) {
      if (!result.ok)
        logVerbose(
          `dispatch-from-config: route-reply (plugin binding notice) failed: ${result.error ?? "unknown error"}`,
        );
      return result.ok;
    }
    markInboundDedupeReplayUnsafe();
    return mode === "additive"
      ? dispatcher.sendToolResult(payload)
      : dispatcher.sendFinalReply(payload);
  };
  const sendBindingNotice = async (payload, mode) => {
    if (suppressAutomaticSourceDelivery) return false;
    return await deliverBindingPayload(payload, mode);
  };
  const pluginOwnedBindingRecord =
    inboundClaimContext.conversationId && inboundClaimContext.channelId
      ? resolveConversationBindingRecord({
          channel: inboundClaimContext.channelId,
          accountId:
            inboundClaimContext.accountId ??
            cfg.channels?.[inboundClaimContext.channelId]?.defaultAccount ??
            "default",
          conversationId: inboundClaimContext.conversationId,
          parentConversationId: inboundClaimContext.parentConversationId,
        })
      : null;
  const pluginOwnedBinding = isPluginOwnedSessionBindingRecord(pluginOwnedBindingRecord)
    ? toPluginConversationBinding(pluginOwnedBindingRecord)
    : null;
  const sendPolicy = resolveSendPolicy({
    cfg,
    entry: sessionStoreEntry.entry,
    sessionKey: sessionStoreEntry.sessionKey ?? sessionKey,
    channel:
      (shouldRouteToOriginating ? routeReplyChannel : void 0) ??
      sessionStoreEntry.entry?.channel ??
      replyRoute.channel ??
      ctx.Surface ??
      ctx.Provider ??
      void 0,
    chatType: sessionStoreEntry.entry?.chatType,
  });
  const {
    globalPolicy,
    globalProviderPolicy,
    agentPolicy,
    agentProviderPolicy,
    profile,
    providerProfile,
    profileAlsoAllow,
    providerProfileAlsoAllow,
  } = resolveEffectiveToolPolicy({
    config: cfg,
    sessionKey: acpDispatchSessionKey,
    agentId: sessionAgentId,
  });
  const chatType = normalizeChatType(ctx.ChatType);
  const silentReplyConversationType = resolveRoutedPolicyConversationType(ctx);
  const silentReplySurface = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider);
  const emptyFinalAllowedAsSilent =
    silentReplyConversationType !== void 0 &&
    resolveSilentReplyPolicyFromPolicies({
      conversationType: silentReplyConversationType,
      defaultPolicy: cfg.agents?.defaults?.silentReply,
      surfacePolicy: silentReplySurface ? cfg.surfaces?.[silentReplySurface]?.silentReply : void 0,
    }) === "allow";
  const configuredVisibleReplies =
    chatType === "group" || chatType === "channel"
      ? (cfg.messages?.groupChat?.visibleReplies ?? cfg.messages?.visibleReplies)
      : cfg.messages?.visibleReplies;
  const harnessDefaultVisibleReplies =
    configuredVisibleReplies === void 0 && chatType !== "group" && chatType !== "channel"
      ? resolveHarnessSourceVisibleRepliesDefault({
          cfg,
          ctx,
          entry: sessionStoreEntry.entry,
          sessionAgentId,
          sessionKey: acpDispatchSessionKey,
          sessionStore: sessionStoreEntry.store,
          turnModelOverride: resolveTurnModelOverride(params.replyOptions),
        })
      : void 0;
  const effectiveVisibleReplies = configuredVisibleReplies ?? harnessDefaultVisibleReplies;
  const runtimeProfileAlsoAllow =
    params.replyOptions?.sourceReplyDeliveryMode === "message_tool_only" ||
    (ctx.InboundEventKind === "room_event" && !isInternalWebchatTurn) ||
    (params.replyOptions?.sourceReplyDeliveryMode === void 0 &&
      !isExplicitSourceReplyCommand(ctx, cfg) &&
      (configuredVisibleReplies === "message_tool" ||
        (!isInternalWebchatTurn && effectiveVisibleReplies === "message_tool")))
      ? ["message"]
      : [];
  const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), [
    ...(profileAlsoAllow ?? []),
    ...runtimeProfileAlsoAllow,
  ]);
  const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(providerProfile), [
    ...(providerProfileAlsoAllow ?? []),
    ...runtimeProfileAlsoAllow,
  ]);
  const groupResolution = resolveGroupSessionKey(ctx);
  const groupPolicy = resolveGroupToolPolicy({
    config: cfg,
    sessionKey: acpDispatchSessionKey,
    messageProvider: resolveOriginMessageProvider({
      originatingChannel: ctx.OriginatingChannel,
      provider: ctx.Provider ?? ctx.Surface,
    }),
    groupId: groupResolution?.id,
    groupChannel:
      normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject),
    groupSpace: normalizeOptionalString(ctx.GroupSpace),
    accountId: ctx.AccountId,
    senderId: normalizeOptionalString(ctx.SenderId),
    senderName: normalizeOptionalString(ctx.SenderName),
    senderUsername: normalizeOptionalString(ctx.SenderUsername),
    senderE164: normalizeOptionalString(ctx.SenderE164),
  });
  const subagentStore = resolveSubagentCapabilityStore(acpDispatchSessionKey, { cfg });
  const messageToolAvailable = isToolAllowedByPolicies("message", [
    profilePolicy,
    providerProfilePolicy,
    globalProviderPolicy,
    agentProviderPolicy,
    globalPolicy,
    agentPolicy,
    groupPolicy,
    acpDispatchSessionKey &&
    isSubagentEnvelopeSession(acpDispatchSessionKey, {
      cfg,
      store: subagentStore,
    })
      ? resolveSubagentToolPolicyForSession(cfg, acpDispatchSessionKey, { store: subagentStore })
      : void 0,
    resolveInheritedToolPolicyForSession(cfg, acpDispatchSessionKey, { store: subagentStore }),
  ]);
  const sourceReplyPolicy = resolveSourceReplyVisibilityPolicy({
    cfg,
    ctx,
    requested: params.replyOptions?.sourceReplyDeliveryMode,
    strictMessageToolOnly: ctx.InboundEventKind === "room_event" && !isInternalWebchatTurn,
    sendPolicy,
    suppressAcpChildUserDelivery,
    explicitSuppressTyping: params.replyOptions?.suppressTyping === true,
    shouldSuppressTyping,
    messageToolAvailable,
    defaultVisibleReplies: harnessDefaultVisibleReplies,
  });
  const {
    sourceReplyDeliveryMode,
    sessionStableSourceReplyDeliveryMode,
    suppressAutomaticSourceDelivery,
    suppressDelivery,
    sendPolicyDenied,
    deliverySuppressionReason,
    suppressHookUserDelivery,
    suppressHookReplyLifecycle,
  } = sourceReplyPolicy;
  const reasoningPayloadsEnabled = params.replyOptions?.reasoningPayloadsEnabled === true;
  const commentaryPayloadsEnabled = params.replyOptions?.commentaryPayloadsEnabled === true;
  const attachSourceReplyDeliveryMode = (result) =>
    sourceReplyDeliveryMode === "message_tool_only" || sendPolicyDenied
      ? {
          ...result,
          ...(sourceReplyDeliveryMode === "message_tool_only" ? { sourceReplyDeliveryMode } : {}),
          ...(sendPolicyDenied ? { sendPolicyDenied: true } : {}),
        }
      : result;
  const explicitCommandTurnCtx = isExplicitSourceReplyCommand(ctx, cfg);
  const unauthorizedTextSlashSourceReplyCtx =
    (chatType === "group" || chatType === "channel") && isUnauthorizedTextSlashCommand(ctx);
  const shouldDeliverPluginBindingReply =
    !suppressAutomaticSourceDelivery ||
    explicitCommandTurnCtx ||
    (ctx.InboundEventKind !== "room_event" && !unauthorizedTextSlashSourceReplyCtx);
  const inboundDedupeClaim = claimInboundDedupe(ctx);
  if (inboundDedupeClaim.status === "duplicate" || inboundDedupeClaim.status === "inflight") {
    recordProcessed("skipped", { reason: "duplicate" });
    return attachSourceReplyDeliveryMode({
      queuedFinal: false,
      counts: dispatcher.getQueuedCounts(),
    });
  }
  const commitInboundDedupeIfClaimed = () => {
    if (inboundDedupeClaim.status === "claimed") commitInboundDedupe(inboundDedupeClaim.key);
  };
  const releaseInboundDedupeIfClaimed = () => {
    if (inboundDedupeClaim.status === "claimed") releaseInboundDedupe(inboundDedupeClaim.key);
  };
  const finishReplyOperationBusyDispatch = (opts) => {
    releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(dispatcher));
    if (opts?.recordAgentDispatchCompleted)
      recordAgentDispatchCompleted("completed", { reason: "reply-operation-active" });
    recordProcessed("skipped", { reason: "reply-operation-active" });
    markIdle("message_completed");
    if (opts?.dedupeDisposition === "release") releaseInboundDedupeIfClaimed();
    else commitInboundDedupeIfClaimed();
    return attachSourceReplyDeliveryMode({
      queuedFinal: false,
      counts: dispatcher.getQueuedCounts(),
      ...(opts?.sessionMetadataChanges
        ? { sessionMetadataChanges: opts.sessionMetadataChanges }
        : {}),
    });
  };
  const finishReplyOperationAbortedDispatch = () => {
    commitInboundDedupeIfClaimed();
    recordProcessed("completed", { reason: "reply_operation_aborted" });
    markIdle("message_completed");
    completeDispatchReplyOperation();
    return attachSourceReplyDeliveryMode({
      queuedFinal: false,
      counts: dispatcher.getQueuedCounts(),
    });
  };
  let pluginFallbackReason;
  const emitMessageReceivedHooks = () => {
    if (
      ctx.SuppressMessageReceivedHooks !== true &&
      hookRunner?.hasHooks("message_received") === true
    ) {
      const messageReceivedHookContext = buildMessageReceivedHookContext();
      fireAndForgetHook(
        hookRunner.runMessageReceived(
          toPluginMessageReceivedEvent(messageReceivedHookContext),
          toPluginMessageContext(messageReceivedHookContext),
        ),
        "dispatch-from-config: message_received plugin hook failed",
      );
    }
    if (ctx.SuppressMessageReceivedHooks !== true && sessionKey) {
      const messageReceivedHookContext = buildMessageReceivedHookContext();
      fireAndForgetHook(
        triggerInternalHook(
          createInternalHookEvent("message", "received", sessionKey, {
            ...toInternalMessageReceivedContext(messageReceivedHookContext),
            timestamp,
          }),
        ),
        "dispatch-from-config: message_received internal hook failed",
      );
    }
  };
  markProcessing();
  try {
    const abortRuntime = params.fastAbortResolver ? null : await loadAbortRuntime();
    const fastAbortResolver = params.fastAbortResolver ?? abortRuntime?.tryFastAbortFromMessage;
    const formatAbortReplyTextResolver =
      params.formatAbortReplyTextResolver ?? abortRuntime?.formatAbortReplyText;
    if (!fastAbortResolver || !formatAbortReplyTextResolver)
      throw new Error("abort runtime unavailable");
    const fastAbort = await fastAbortResolver({
      ctx,
      cfg,
    });
    if (fastAbort.handled) {
      if (pluginOwnedBinding) touchConversationBindingRecord(pluginOwnedBinding.bindingId);
      emitMessageReceivedHooks();
      let queuedFinal = false;
      let routedFinalCount = 0;
      if (!suppressDelivery) {
        const payload = {
          text: formatAbortReplyTextResolver(fastAbort.stoppedSubagents, fastAbort.rejectionReason),
        };
        const result = await routeReplyToOriginating(payload);
        if (result) {
          queuedFinal = result.ok;
          if (isRoutedReplyDelivered(result)) routedFinalCount += 1;
          if (!result.ok)
            logVerbose(
              `dispatch-from-config: route-reply (abort) failed: ${result.error ?? "unknown error"}`,
            );
        } else {
          markInboundDedupeReplayUnsafe();
          queuedFinal = dispatcher.sendFinalReply(payload);
        }
      } else
        logVerbose(
          `dispatch-from-config: fast_abort reply suppressed by ${deliverySuppressionReason} (session=${sessionKey ?? "unknown"})`,
        );
      const counts = dispatcher.getQueuedCounts();
      counts.final += routedFinalCount;
      recordProcessed("completed", { reason: "fast_abort" });
      markIdle("message_completed");
      commitInboundDedupeIfClaimed();
      completeDispatchReplyOperation();
      return attachSourceReplyDeliveryMode({
        queuedFinal,
        counts,
      });
    }
    const preDispatchAcquisition = await ensureDispatchReplyOperation("pre_dispatch");
    if (preDispatchAcquisition.status === "aborted") return finishReplyOperationAbortedDispatch();
    if (preDispatchAcquisition.status === "busy")
      return finishReplyOperationBusyDispatch({ dedupeDisposition: "release" });
    if (pluginOwnedBinding) {
      if (isPreDispatchOperationAborted()) return finishReplyOperationAbortedDispatch();
      touchConversationBindingRecord(pluginOwnedBinding.bindingId);
      if (shouldBypassPluginOwnedBindingForCommand(ctx, cfg))
        logVerbose(
          `plugin-bound inbound command escaped plugin binding (plugin=${pluginOwnedBinding.pluginId} session=${sessionKey ?? "unknown"}); falling through to command processing`,
        );
      else if (sendPolicyDenied || (suppressDelivery && !suppressAutomaticSourceDelivery))
        logVerbose(
          `plugin-bound inbound skipped under ${deliverySuppressionReason} (plugin=${pluginOwnedBinding.pluginId} session=${sessionKey ?? "unknown"}); falling through to suppressed agent processing`,
        );
      else {
        logVerbose(
          `plugin-bound inbound routed to ${pluginOwnedBinding.pluginId} conversation=${pluginOwnedBinding.conversationId}`,
        );
        const bindingAuthorization = resolveCommandAuthorization({
          ctx,
          cfg,
          commandAuthorized: ctx.CommandAuthorized,
        });
        const targetedClaimOutcome = hookRunner?.runInboundClaimForPluginOutcome
          ? await (async () => {
              await prepareHookMediaMetadata();
              if (isPreDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
              const authorizedInboundClaimEvent = {
                ...inboundClaimEvent,
                senderIsOwner: bindingAuthorization.senderIsOwner,
              };
              return await runWithDispatchLifecycleAdmission(
                async () =>
                  await hookRunner.runInboundClaimForPluginOutcome(
                    pluginOwnedBinding.pluginId,
                    authorizedInboundClaimEvent,
                    {
                      ...inboundClaimContext,
                      pluginBinding: pluginOwnedBinding,
                    },
                  ),
              );
            })()
          : (() => {
              return (getGlobalPluginRegistry()?.plugins.some(
                (plugin) => plugin.id === pluginOwnedBinding.pluginId && plugin.status === "loaded",
              ) ?? false)
                ? { status: "no_handler" }
                : { status: "missing_plugin" };
            })();
        if (isPreDispatchOperationAborted()) return finishReplyOperationAbortedDispatch();
        switch (targetedClaimOutcome.status) {
          case "handled":
            if (targetedClaimOutcome.result.reply && shouldDeliverPluginBindingReply)
              await deliverBindingPayload(targetedClaimOutcome.result.reply, "terminal");
            markIdle("plugin_binding_dispatch");
            recordProcessed("completed", { reason: "plugin-bound-handled" });
            commitInboundDedupeIfClaimed();
            completeDispatchReplyOperation();
            return attachSourceReplyDeliveryMode({
              queuedFinal: false,
              counts: dispatcher.getQueuedCounts(),
            });
          case "missing_plugin":
          case "no_handler":
            pluginFallbackReason =
              targetedClaimOutcome.status === "missing_plugin"
                ? "plugin-bound-fallback-missing-plugin"
                : "plugin-bound-fallback-no-handler";
            if (
              (chatType === "group" || chatType === "channel") &&
              ctx.WasMentioned === false &&
              !explicitCommandTurnCtx &&
              ctx.GroupRequireMention !== false
            ) {
              markIdle("plugin_binding_fallback_unmentioned");
              recordProcessed("completed", { reason: pluginFallbackReason });
              commitInboundDedupeIfClaimed();
              completeDispatchReplyOperation();
              return attachSourceReplyDeliveryMode({
                queuedFinal: false,
                counts: dispatcher.getQueuedCounts(),
              });
            }
            if (!hasShownPluginBindingFallbackNotice(pluginOwnedBinding.bindingId)) {
              if (
                await sendBindingNotice(
                  { text: buildPluginBindingUnavailableText(pluginOwnedBinding) },
                  "additive",
                )
              )
                markPluginBindingFallbackNoticeShown(pluginOwnedBinding.bindingId);
            }
            break;
          case "declined":
            await sendBindingNotice(
              { text: buildPluginBindingDeclinedText(pluginOwnedBinding) },
              "terminal",
            );
            markIdle("plugin_binding_declined");
            recordProcessed("completed", { reason: "plugin-bound-declined" });
            commitInboundDedupeIfClaimed();
            completeDispatchReplyOperation();
            return attachSourceReplyDeliveryMode({
              queuedFinal: false,
              counts: dispatcher.getQueuedCounts(),
            });
          case "error":
            logVerbose(
              `plugin-bound inbound claim failed for ${pluginOwnedBinding.pluginId}: ${targetedClaimOutcome.error}`,
            );
            await sendBindingNotice(
              { text: buildPluginBindingErrorText(pluginOwnedBinding) },
              "terminal",
            );
            markIdle("plugin_binding_error");
            recordProcessed("completed", { reason: "plugin-bound-error" });
            commitInboundDedupeIfClaimed();
            completeDispatchReplyOperation();
            return attachSourceReplyDeliveryMode({
              queuedFinal: false,
              counts: dispatcher.getQueuedCounts(),
            });
        }
      }
    }
    emitMessageReceivedHooks();
    const shouldSuppressDefaultToolProgressMessages = () => !shouldEmitVerboseProgress();
    const shouldSendVerboseProgressMessages = () => !shouldSuppressDefaultToolProgressMessages();
    const shouldSendToolSummaries = () => shouldSendVerboseProgressMessages();
    const notifiedSessionMetadataChangeKeys = /* @__PURE__ */ new Set();
    let sessionMetadataChangesForResult;
    const notifySessionMetadataChanges = (changes) => {
      if (!changes?.length) return;
      const freshChanges = [];
      for (const change of changes) {
        const key = JSON.stringify([change.sessionKey, change.agentId ?? null, change.reason]);
        if (notifiedSessionMetadataChangeKeys.has(key)) continue;
        notifiedSessionMetadataChangeKeys.add(key);
        freshChanges.push(change);
      }
      if (freshChanges.length === 0) return;
      sessionMetadataChangesForResult = [
        ...(sessionMetadataChangesForResult ?? []),
        ...freshChanges,
      ];
      params.onSessionMetadataChanges?.(freshChanges);
    };
    const shouldDeliverVerboseProgressDespiteSourceSuppression = () =>
      suppressAutomaticSourceDelivery &&
      sourceReplyDeliveryMode === "message_tool_only" &&
      ctx.InboundEventKind !== "room_event" &&
      !sendPolicyDenied &&
      shouldEmitVerboseProgress() &&
      shouldSendVerboseProgressMessages();
    const shouldDeliverForcedToolProgressDespiteSourceSuppression = () =>
      suppressAutomaticSourceDelivery &&
      sourceReplyDeliveryMode === "message_tool_only" &&
      ctx.InboundEventKind !== "room_event" &&
      !sendPolicyDenied &&
      params.replyOptions?.forceToolResultProgress === true;
    const shouldDeliverFastModeAutoProgressDespiteSourceSuppression = () =>
      suppressAutomaticSourceDelivery &&
      sourceReplyDeliveryMode === "message_tool_only" &&
      ctx.InboundEventKind !== "room_event" &&
      !sendPolicyDenied;
    let finalReplyDeliveryStarted = false;
    const hasExecApprovalPayload = (payload) => {
      const execApproval =
        payload.channelData &&
        typeof payload.channelData === "object" &&
        !Array.isArray(payload.channelData)
          ? payload.channelData.execApproval
          : void 0;
      return execApproval && typeof execApproval === "object" && !Array.isArray(execApproval);
    };
    const shouldSuppressLateTextOnlyToolProgress = (payload) => {
      if (!finalReplyDeliveryStarted) return false;
      return (
        !resolveSendableOutboundReplyParts(payload).hasMedia && !hasExecApprovalPayload(payload)
      );
    };
    let pendingCommentaryProgress = null;
    const deliverCommentaryProgressMessage = async (text) => {
      if (!shouldSendToolSummaries() || shouldSuppressProgressDelivery()) return;
      const payload = { text: `💬 ${text}` };
      if (shouldSuppressLateTextOnlyToolProgress(payload)) return;
      if (shouldRouteToOriginating) await sendPayloadAsync(payload, void 0, false);
      else {
        markInboundDedupeReplayUnsafe();
        dispatcher.sendToolResult(payload);
      }
    };
    const flushPendingCommentaryProgress = async () => {
      const pending = pendingCommentaryProgress;
      pendingCommentaryProgress = null;
      const text = pending?.text.trim();
      if (!text) return;
      await deliverCommentaryProgressMessage(text);
    };
    const noteCommentaryProgress = async (payload) => {
      const itemId = payload.itemId?.trim() || void 0;
      const text = payload.progressText ?? "";
      const updatesBufferedItem =
        pendingCommentaryProgress !== null &&
        pendingCommentaryProgress.itemId !== void 0 &&
        pendingCommentaryProgress.itemId === itemId;
      if (!text.trim()) {
        if (updatesBufferedItem) pendingCommentaryProgress = null;
        return;
      }
      if (pendingCommentaryProgress && !updatesBufferedItem) await flushPendingCommentaryProgress();
      pendingCommentaryProgress = {
        itemId,
        text,
      };
    };
    const shouldSuppressMessageToolOnlyTextErrorProgress = (payload) => {
      if (
        sourceReplyDeliveryMode !== "message_tool_only" ||
        shouldEmitFullVerboseProgress() ||
        payload.isError !== true
      )
        return false;
      return (
        !resolveSendableOutboundReplyParts(payload).hasMedia && !hasExecApprovalPayload(payload)
      );
    };
    const sendFinalPayload = async (payload, options = {}) => {
      const abortSignal = options.abortSignal ?? getDispatchAbortSignal();
      const throwIfFinalDeliveryAborted = () => {
        if (abortSignal?.aborted) throw new DispatchReplyOperationAbortedError();
      };
      throwIfFinalDeliveryAborted();
      await flushPendingCommentaryProgress();
      throwIfFinalDeliveryAborted();
      const payloadMetadata = getReplyPayloadMetadata(payload);
      const sourceReplySessionBinding = resolvePreparedTranscriptBinding(
        payloadMetadata?.sourceReplyTranscriptMirror?.sessionKey,
      );
      const sourceReplyTranscriptMirror = payloadMetadata?.sourceReplyTranscriptMirror
        ? {
            ...payloadMetadata.sourceReplyTranscriptMirror,
            ...(sourceReplySessionBinding
              ? { expectedSessionId: sourceReplySessionBinding.sessionId }
              : {}),
            storePath: sourceReplySessionBinding?.storePath ?? sessionStoreEntry.storePath,
          }
        : void 0;
      const hasTranscriptOwner =
        payloadMetadata?.assistantMessageIndex !== void 0 ||
        payloadMetadata?.assistantTranscriptOwned === true;
      const hasVisibleFinalContent = hasOutboundReplyContent(payload, { trimText: true });
      if (hasVisibleFinalContent) {
        markInboundDedupeReplayUnsafe();
        finalReplyDeliveryStarted = true;
      }
      const ttsPayload =
        payload.isReasoning === true || payload.isCommentary === true
          ? payload
          : await maybeApplyTtsWithFinalizationLease({
              payload,
              cfg,
              channel: deliveryChannel,
              kind: "final",
              ttsAuto: sessionTtsAuto,
              agentId: sessionAgentId,
              accountId: replyRoute.accountId,
            });
      throwIfFinalDeliveryAborted();
      const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
      throwIfFinalDeliveryAborted();
      const result = await routeReplyToOriginating(normalizedPayload, {
        abortSignal,
        kind: "final",
        ...(hasTranscriptOwner ? { mirror: false } : {}),
      });
      if (result) {
        if (!result.ok)
          logVerbose(
            `dispatch-from-config: route-reply (final) failed: ${result.error ?? "unknown error"}`,
          );
        if (isRoutedReplyDelivered(result))
          await mirrorDeliveredReplyToTranscript({
            metadata: sourceReplyTranscriptMirror,
            cfg,
          });
        return {
          queuedFinal: result.ok,
          routedFinalCount: isRoutedReplyDelivered(result) ? 1 : 0,
        };
      }
      throwIfFinalDeliveryAborted();
      const transcriptMirrorSessionKey =
        acpDispatchSessionKey ?? sessionStoreEntry.sessionKey ?? sessionKey;
      const transcriptMirrorSourceId =
        normalizeOptionalString(messageIdForHook) ??
        normalizeOptionalString(params.replyOptions?.runId);
      const transcriptMirrorSessionBinding = resolvePreparedTranscriptBinding(
        transcriptMirrorSessionKey,
      );
      const transcriptMirror =
        sourceReplyTranscriptMirror ??
        (normalizedCurrentSurface === "slack" &&
        hasVisibleFinalContent &&
        transcriptMirrorSessionKey
          ? transcriptMirrorForDeliveredPayload(
              {
                sessionKey: transcriptMirrorSessionKey,
                agentId: sessionAgentId,
                ...(transcriptMirrorSessionBinding
                  ? { expectedSessionId: transcriptMirrorSessionBinding.sessionId }
                  : {}),
                storePath: transcriptMirrorSessionBinding?.storePath ?? sessionStoreEntry.storePath,
                preferText: true,
                ...(hasTranscriptOwner ? { transcriptOwner: true } : {}),
                idempotencyKey: transcriptMirrorSourceId
                  ? `channel-final:${transcriptMirrorSourceId}:${options.deliveryId ?? "single"}`
                  : void 0,
                deliveryMirror: {
                  kind: "channel-final",
                  ...(transcriptMirrorSourceId
                    ? { sourceMessageId: transcriptMirrorSourceId }
                    : {}),
                },
              },
              normalizedPayload,
            )
          : void 0);
      markInboundDedupeReplayUnsafe();
      const finalOutcomeBefore = transcriptMirror
        ? getDispatcherFinalOutcomeCounts(dispatcher)
        : void 0;
      const finalDeliveryCapture = transcriptMirror ? {} : void 0;
      const deliveredTranscriptMirror = transcriptMirror
        ? captureDeliveredTranscriptMirror({
            dispatcher,
            metadata: transcriptMirror,
            deliveryId: options.deliveryId,
            captureToken: finalDeliveryCapture,
          })
        : void 0;
      if (finalDeliveryCapture)
        setReplyPayloadMetadata(normalizedPayload, { finalDeliveryCapture });
      const deliveryOutcome = captureReplyDispatchDeliveryOutcome(normalizedPayload);
      const queuedFinal = dispatcher.sendFinalReply(normalizedPayload);
      const dispatcherOutcome =
        queuedFinal && deliveryOutcome.isTracked() ? deliveryOutcome.promise : void 0;
      if (queuedFinal && deliveredTranscriptMirror && finalOutcomeBefore)
        registerReplyDispatcherSettledTask(dispatcher, () =>
          mirrorTranscriptAfterDispatcherSettled({
            dispatcher,
            before: finalOutcomeBefore,
            metadata: deliveredTranscriptMirror,
            cfg,
          }),
        );
      return {
        queuedFinal,
        routedFinalCount: 0,
        ...(queuedFinal && dispatcherOutcome ? { dispatcherOutcome } : {}),
      };
    };
    if (hookRunner?.hasHooks("before_dispatch")) {
      const beforeDispatchResult = await traceReplyPhase("reply.before_dispatch_hooks", () =>
        runWithDispatchLifecycleAdmission(
          async () =>
            await runWithDispatchAbortSignal(
              getPreDispatchAbortSignal(),
              () =>
                hookRunner.runBeforeDispatch(
                  {
                    content: hookContext.content,
                    body: hookContext.bodyForAgent ?? hookContext.body,
                    channel: hookContext.channelId,
                    sessionKey: sessionStoreEntry.sessionKey ?? sessionKey,
                    senderId: hookContext.senderId,
                    replyToId: hookContext.replyToId,
                    replyToIdFull: hookContext.replyToIdFull,
                    replyToBody: hookContext.replyToBody,
                    replyToSender: hookContext.replyToSender,
                    replyToIsQuote: hookContext.replyToIsQuote,
                    isGroup: hookContext.isGroup,
                    timestamp: hookContext.timestamp,
                  },
                  {
                    channelId: hookContext.channelId,
                    accountId: hookContext.accountId,
                    conversationId: inboundClaimContext.conversationId,
                    sessionKey: sessionStoreEntry.sessionKey ?? sessionKey,
                    senderId: hookContext.senderId,
                    replyToId: hookContext.replyToId,
                    replyToIdFull: hookContext.replyToIdFull,
                    replyToBody: hookContext.replyToBody,
                    replyToSender: hookContext.replyToSender,
                    replyToIsQuote: hookContext.replyToIsQuote,
                  },
                ),
              trackDispatchLifecycleWork,
            ),
        ),
      );
      if (beforeDispatchResult?.handled) {
        const text = beforeDispatchResult.text;
        let queuedFinal = false;
        let routedFinalCount = 0;
        if (text && !suppressDelivery) {
          const handledReply = await sendFinalPayload(
            { text },
            {
              abortSignal: getPreDispatchAbortSignal(),
              deliveryId: "before-dispatch",
            },
          );
          queuedFinal = handledReply.queuedFinal;
          routedFinalCount += handledReply.routedFinalCount;
        }
        const counts = dispatcher.getQueuedCounts();
        counts.final += routedFinalCount;
        recordProcessed("completed", { reason: "before_dispatch_handled" });
        markIdle("message_completed");
        commitInboundDedupeIfClaimed();
        completeDispatchReplyOperation();
        return attachSourceReplyDeliveryMode({
          queuedFinal,
          counts,
        });
      }
    }
    if (hookRunner?.hasHooks("reply_dispatch")) {
      const replyDispatchResult = await traceReplyPhase("reply.reply_dispatch_hooks", () =>
        runWithDispatchLifecycleAdmission(
          async () =>
            await runWithDispatchAbortSignal(
              getPreDispatchAbortSignal(),
              () =>
                hookRunner.runReplyDispatch(
                  createReplyDispatchEvent({
                    ctx,
                    runId: params.replyOptions?.runId,
                    sessionKey: acpDispatchSessionKey,
                    toolsAllow: params.replyOptions?.toolsAllow,
                    images: params.replyOptions?.images,
                    inboundAudio,
                    sessionTtsAuto,
                    ttsChannel: deliveryChannel,
                    suppressUserDelivery: suppressHookUserDelivery,
                    suppressReplyLifecycle: suppressHookReplyLifecycle,
                    sourceReplyDeliveryMode,
                    shouldRouteToOriginating,
                    originatingChannel: routeReplyChannel,
                    originatingTo: routeReplyTo,
                    originatingAccountId: replyContextAccountId,
                    originatingThreadId: routeReplyThreadId,
                    originatingChatType: replyRoute.chatType,
                    shouldSendToolSummaries,
                    sendPolicy,
                  }),
                  {
                    cfg,
                    dispatcher: dispatchHookDispatcher,
                    abortSignal: getPreDispatchAbortSignal() ?? params.replyOptions?.abortSignal,
                    onReplyStart: params.replyOptions?.onReplyStart,
                    recordProcessed,
                    markIdle,
                  },
                ),
              trackDispatchLifecycleWork,
            ),
        ),
      );
      if (replyDispatchResult?.handled) {
        commitInboundDedupeIfClaimed();
        completeDispatchReplyOperation();
        return attachSourceReplyDeliveryMode({
          queuedFinal: replyDispatchResult.queuedFinal,
          counts: replyDispatchResult.counts,
        });
      }
    }
    const dispatchAcquisition = await ensureDispatchReplyOperation("dispatch");
    if (dispatchAcquisition.status === "aborted") return finishReplyOperationAbortedDispatch();
    if (dispatchAcquisition.status === "busy")
      return finishReplyOperationBusyDispatch({ dedupeDisposition: "release" });
    if (suppressDelivery)
      logVerbose(
        `Delivery suppressed by ${deliverySuppressionReason} for session ${sessionStoreEntry.sessionKey ?? sessionKey ?? "unknown"} — agent will still process the message`,
      );
    const toolStartStatusesSent = /* @__PURE__ */ new Set();
    let toolStartStatusCount = 0;
    let didSendPlanStatusNotice = false;
    const normalizeWorkingLabel = (label) => {
      const collapsed = label.replace(/\s+/g, " ").trim();
      if (collapsed.length <= 80) return collapsed;
      return `${truncateUtf16Safe(collapsed, 77).trimEnd()}...`;
    };
    const formatPlanUpdateText = (payload) => {
      const explanation = payload.explanation?.replace(/\s+/g, " ").trim();
      const steps = (payload.steps ?? [])
        .map((step) => step.replace(/\s+/g, " ").trim())
        .filter(Boolean);
      if (steps.length > 0) return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
      return explanation || "Planning next steps.";
    };
    const maybeSendWorkingStatus = async (label) => {
      if (shouldSuppressProgressDelivery()) return;
      const normalizedLabel = normalizeWorkingLabel(label);
      if (!shouldEmitVerboseProgress() || true) return;
      toolStartStatusesSent.add(normalizedLabel);
      toolStartStatusCount += 1;
      const payload = { text: `Working: ${normalizedLabel}` };
      if (shouldRouteToOriginating) {
        await sendPayloadAsync(payload, void 0, false);
        return;
      }
      markInboundDedupeReplayUnsafe();
      dispatcher.sendToolResult(payload);
    };
    const sendPlanUpdate = async (payload) => {
      if (
        shouldSuppressProgressDelivery() ||
        !shouldSendVerboseProgressMessages() ||
        didSendPlanStatusNotice
      )
        return;
      didSendPlanStatusNotice = true;
      const replyPayload = {
        text: formatPlanUpdateText(payload),
        isStatusNotice: true,
      };
      if (shouldRouteToOriginating) {
        await sendPayloadAsync(replyPayload, void 0, false);
        return;
      }
      markInboundDedupeReplayUnsafe();
      dispatcher.sendToolResult(replyPayload);
    };
    const summarizeApprovalLabel = (payload) => {
      if (payload.status === "pending") {
        const command = normalizeOptionalString(payload.command);
        if (command) return normalizeWorkingLabel(`awaiting approval: ${command}`);
        return "awaiting approval";
      }
      if (payload.status === "unavailable") {
        const message = normalizeOptionalString(payload.message);
        if (message) return normalizeWorkingLabel(message);
        return "approval unavailable";
      }
      return "";
    };
    const summarizePatchLabel = (payload) => {
      const summary = normalizeOptionalString(payload.summary);
      if (summary) return normalizeWorkingLabel(summary);
      const title = normalizeOptionalString(payload.title);
      if (title) return normalizeWorkingLabel(title);
      return "";
    };
    let accumulatedBlockText = "";
    let accumulatedBlockTtsText = "";
    let blockCount = 0;
    const cleanBlockTtsDirectiveText = shouldCleanTtsDirectiveText({
      cfg,
      ttsAuto: sessionTtsAuto,
      agentId: sessionAgentId,
      channelId: deliveryChannel,
      accountId: replyRoute.accountId,
    })
      ? createTtsDirectiveTextStreamCleaner()
      : void 0;
    const resolveToolDeliveryPayload = (payload) => {
      if (
        shouldSuppressLocalExecApprovalPrompt({
          channel: normalizeMessageChannel(ctx.Surface ?? ctx.Provider),
          cfg,
          accountId: ctx.AccountId,
          payload,
        })
      )
        return null;
      if (shouldSendToolSummaries()) return payload;
      const execApproval =
        payload.channelData &&
        typeof payload.channelData === "object" &&
        !Array.isArray(payload.channelData)
          ? payload.channelData.execApproval
          : void 0;
      if (execApproval && typeof execApproval === "object" && !Array.isArray(execApproval))
        return payload;
      if (isFastModeAutoProgressPayload(payload)) return payload;
      if (!resolveSendableOutboundReplyParts(payload).hasMedia) return null;
      return {
        ...payload,
        text: void 0,
      };
    };
    const typing = resolveRunTypingPolicy({
      requestedPolicy: params.replyOptions?.typingPolicy,
      suppressTyping: sourceReplyPolicy.suppressTyping,
      originatingChannel: routeReplyChannel,
      systemEvent: shouldRouteToOriginating,
    });
    const shouldSuppressProgressDelivery = () =>
      sendPolicyDenied ||
      (suppressDelivery && !shouldDeliverVerboseProgressDespiteSourceSuppression());
    const hasVisibleRegularVerboseToolProgress = () =>
      shouldEmitVerboseProgress() &&
      !shouldEmitFullVerboseProgress() &&
      shouldSendVerboseProgressMessages() &&
      ctx.InboundEventKind !== "room_event" &&
      !shouldSuppressProgressDelivery();
    let observedVisibleToolErrorProgress = false;
    const markVisibleToolErrorProgress = () => {
      if (hasVisibleRegularVerboseToolProgress()) observedVisibleToolErrorProgress = true;
    };
    const hasFailedProgressStatus = (payload) =>
      payload.phase === "error" ||
      payload.status === "failed" ||
      payload.status === "error" ||
      (typeof payload.exitCode === "number" && payload.exitCode !== 0);
    const shouldSuppressToolErrorWarnings = () => {
      if (params.replyOptions?.suppressToolErrorWarnings !== void 0)
        return params.replyOptions.suppressToolErrorWarnings;
      if (!shouldEmitVerboseProgress()) return false;
      return observedVisibleToolErrorProgress ? true : void 0;
    };
    const suppressToolErrorWarnings =
      params.replyOptions?.suppressToolErrorWarnings ??
      (observedVisibleToolErrorProgress ? true : void 0);
    const onToolResultFromReplyOptions = params.replyOptions?.onToolResult;
    const onPlanUpdateFromReplyOptions = params.replyOptions?.onPlanUpdate;
    const onApprovalEventFromReplyOptions = params.replyOptions?.onApprovalEvent;
    const onPatchSummaryFromReplyOptions = params.replyOptions?.onPatchSummary;
    const allowSuppressedSourceProgressCallbacks =
      params.replyOptions?.allowProgressCallbacksWhenSourceDeliverySuppressed === true;
    const isChannelOwnedToolResultProgressPayload = (payload) => {
      const text = normalizeOptionalString(payload.text);
      return Boolean(text?.startsWith("🛠️") || text?.startsWith("🔧"));
    };
    const shouldForwardToolResultProgressCallback = (payload, isFastModeAutoProgress) => {
      if (isFastModeAutoProgress)
        return shouldForwardProgressCallback({ forwardWhenSourceDeliverySuppressed: true });
      if (
        allowSuppressedSourceProgressCallbacks &&
        isChannelOwnedToolResultProgressPayload(payload)
      )
        return shouldForwardProgressCallback({ forwardWhenSourceDeliverySuppressed: true });
      return shouldSendToolSummaries() && shouldForwardProgressCallback();
    };
    const shouldAllowQuietChannelOwnedProgressCallbacks = (options) =>
      options?.requiresToolSummaryVisibility === true &&
      (params.replyOptions?.suppressDefaultToolProgressMessages === true ||
        options.allowWhenToolSummariesHidden === true);
    let hasPendingDirectBlockReplyDelivery = false;
    const waitForPendingDirectBlockReplyDelivery = async (abortSignal) => {
      if (!hasPendingDirectBlockReplyDelivery) return;
      hasPendingDirectBlockReplyDelivery = false;
      await waitForReplyDispatcherIdle(dispatcher, abortSignal);
    };
    const shouldForwardProgressCallback = (options) => {
      if (
        options?.requiresToolSummaryVisibility === true &&
        !shouldSendToolSummaries() &&
        !shouldAllowQuietChannelOwnedProgressCallbacks(options)
      )
        return false;
      return (
        !suppressAutomaticSourceDelivery ||
        (allowSuppressedSourceProgressCallbacks &&
          !sendPolicyDenied &&
          options?.forwardWhenSourceDeliverySuppressed === true)
      );
    };
    const preserveProgressCallbackStartOrder =
      params.replyOptions?.preserveProgressCallbackStartOrder === true;
    let progressCallbackStartTail = Promise.resolve();
    const reserveProgressCallbackStart = () => {
      const previousStart = progressCallbackStartTail;
      let releaseStart;
      progressCallbackStartTail = new Promise((resolve) => {
        releaseStart = resolve;
      });
      return {
        previousStart,
        releaseStart: () => releaseStart?.(),
      };
    };
    const wrapProgressCallback = (callback, options) => {
      if (!callback) return;
      const runProgressCallback = async (args, noteCallbackStarted) => {
        try {
          if (isDispatchOperationAborted()) return;
          getDispatchReplyOperation()?.recordActivity();
          markProgress();
          if (options?.waitForDirectBlockReplyDelivery) {
            await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
            if (isDispatchOperationAborted()) return;
          }
          if (shouldForwardProgressCallback(options)) {
            if (preserveProgressCallbackStartOrder && options?.onForward)
              await options.onForward(...args);
            else if (!preserveProgressCallbackStartOrder) await options?.onForward?.(...args);
            const callbackResult = callback(...args);
            noteCallbackStarted();
            const result = await callbackResult;
            if (result === false) return result;
            await options?.onVisible?.(...args);
          }
          return;
        } finally {
          noteCallbackStarted();
        }
      };
      return (...args) => {
        if (!preserveProgressCallbackStartOrder) return runProgressCallback(args, () => void 0);
        const start = reserveProgressCallbackStart();
        return (async () => {
          await start.previousStart;
          return await runProgressCallback(args, start.releaseStart);
        })();
      };
    };
    const deliverStandaloneCommentaryProgress = shouldEmitVerboseProgress();
    const itemEventForwardingOptions = {
      forwardWhenSourceDeliverySuppressed: true,
      requiresToolSummaryVisibility: true,
    };
    const canForwardItemEvents =
      Boolean(params.replyOptions?.onItemEvent) &&
      shouldForwardProgressCallback(itemEventForwardingOptions);
    const canForwardSuppressedSourceItemEvents =
      suppressAutomaticSourceDelivery &&
      allowSuppressedSourceProgressCallbacks &&
      canForwardItemEvents;
    const forwardItemEvent = canForwardItemEvents
      ? wrapProgressCallback(params.replyOptions?.onItemEvent, {
          ...itemEventForwardingOptions,
          waitForDirectBlockReplyDelivery: true,
          onForward: (payload) =>
            preserveProgressCallbackStartOrder &&
            deliverStandaloneCommentaryProgress &&
            payload.kind === "preamble"
              ? noteCommentaryProgress(payload)
              : void 0,
          onVisible: (payload) => {
            if (hasFailedProgressStatus(payload)) markVisibleToolErrorProgress();
          },
        })
      : void 0;
    const onItemEvent =
      deliverStandaloneCommentaryProgress || canForwardItemEvents
        ? async (payload) => {
            if (isDispatchOperationAborted()) return;
            if (!forwardItemEvent) markProgress();
            if (
              (!forwardItemEvent || !preserveProgressCallbackStartOrder) &&
              deliverStandaloneCommentaryProgress &&
              payload.kind === "preamble"
            )
              await noteCommentaryProgress(payload);
            return await forwardItemEvent?.(payload);
          }
        : void 0;
    params.replyOptions?.onVerboseProgressVisibility?.(
      () =>
        deliverStandaloneCommentaryProgress &&
        shouldSendVerboseProgressMessages() &&
        !shouldSuppressProgressDelivery(),
    );
    const replyResolver =
      params.replyResolver ??
      (await traceReplyPhase("reply.load_reply_resolver", () => loadGetReplyFromConfigRuntime()))
        .getReplyFromConfig;
    const replyConfig = withFullRuntimeReplyConfig(
      params.configOverride ? applyMergePatch(cfg, params.configOverride) : cfg,
    );
    recordAgentDispatchStarted();
    const replyResult = await runWithDispatchLifecycleAdmission(
      async () =>
        await runWithDispatchAbortSignal(
          getDispatchAbortSignal(),
          () =>
            traceReplyPhase("reply.run_reply_resolver", () =>
              replyResolver(
                ctx,
                {
                  ...getReplyOptions(),
                  sourceReplyDeliveryMode,
                  sessionPromptSourceReplyDeliveryMode: sessionStableSourceReplyDeliveryMode,
                  onSessionMetadataChanges: notifySessionMetadataChanges,
                  onSessionPrepared: notePreparedSession,
                  onObservedReplyDelivery: markObservedReplyDelivery,
                  suppressToolErrorWarnings,
                  shouldSuppressToolErrorWarnings,
                  typingPolicy: typing.typingPolicy,
                  suppressTyping: typing.suppressTyping,
                  onPartialReply: wrapProgressCallback(params.replyOptions?.onPartialReply),
                  onReasoningStream: wrapProgressCallback(params.replyOptions?.onReasoningStream),
                  streamReasoningInNonStreamModes:
                    params.replyOptions?.streamReasoningInNonStreamModes,
                  onReasoningEnd: wrapProgressCallback(params.replyOptions?.onReasoningEnd),
                  onAssistantMessageStart: wrapProgressCallback(
                    params.replyOptions?.onAssistantMessageStart,
                  ),
                  onBlockReplyQueued: wrapProgressCallback(params.replyOptions?.onBlockReplyQueued),
                  onToolStart: wrapProgressCallback(params.replyOptions?.onToolStart, {
                    allowWhenToolSummariesHidden:
                      params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
                    forwardWhenSourceDeliverySuppressed: true,
                    requiresToolSummaryVisibility: true,
                    waitForDirectBlockReplyDelivery: true,
                    onForward: async () => {
                      await flushPendingCommentaryProgress();
                    },
                  }),
                  onItemEvent,
                  commentaryProgressEnabled:
                    deliverStandaloneCommentaryProgress ||
                    canForwardSuppressedSourceItemEvents ||
                    params.replyOptions?.commentaryProgressEnabled,
                  reasoningPayloadsEnabled,
                  commentaryPayloadsEnabled,
                  onCommandOutput: wrapProgressCallback(params.replyOptions?.onCommandOutput, {
                    forwardWhenSourceDeliverySuppressed: true,
                    requiresToolSummaryVisibility: true,
                    waitForDirectBlockReplyDelivery: true,
                    onVisible: (payload) => {
                      if (hasFailedProgressStatus(payload)) markVisibleToolErrorProgress();
                    },
                  }),
                  onCompactionStart: wrapProgressCallback(params.replyOptions?.onCompactionStart, {
                    allowWhenToolSummariesHidden:
                      params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
                    forwardWhenSourceDeliverySuppressed: true,
                    requiresToolSummaryVisibility: true,
                    waitForDirectBlockReplyDelivery: true,
                  }),
                  onCompactionEnd: wrapProgressCallback(params.replyOptions?.onCompactionEnd, {
                    allowWhenToolSummariesHidden:
                      params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
                    forwardWhenSourceDeliverySuppressed: true,
                    requiresToolSummaryVisibility: true,
                    waitForDirectBlockReplyDelivery: true,
                  }),
                  onToolResult: (payload) => {
                    getDispatchReplyOperation()?.recordActivity();
                    markProgress();
                    const run = async () => {
                      if (isDispatchOperationAborted()) return;
                      await waitForPendingDirectBlockReplyDelivery(
                        getDispatchAbortOperation()?.abortSignal,
                      );
                      if (isDispatchOperationAborted()) return;
                      markInboundDedupeReplayUnsafe();
                      await flushPendingCommentaryProgress();
                      if (
                        payload.isError === true &&
                        replyConfig.messages?.suppressToolErrors === true
                      )
                        return;
                      const isFastModeAutoProgress = isFastModeAutoProgressPayload(payload);
                      const isFastModeAutoProgressDelivery =
                        isFastModeAutoProgress &&
                        shouldDeliverFastModeAutoProgressDespiteSourceSuppression();
                      const isForcedToolProgress =
                        shouldDeliverForcedToolProgressDespiteSourceSuppression();
                      const progressCallbackForwarded = shouldForwardToolResultProgressCallback(
                        payload,
                        isFastModeAutoProgress,
                      );
                      if (progressCallbackForwarded) await onToolResultFromReplyOptions?.(payload);
                      if (isDispatchOperationAborted()) return;
                      if (
                        isFastModeAutoProgress &&
                        progressCallbackForwarded &&
                        onToolResultFromReplyOptions
                      )
                        return;
                      if (sendPolicyDenied) return;
                      if (
                        shouldSuppressProgressDelivery() &&
                        !isFastModeAutoProgressDelivery &&
                        !isForcedToolProgress
                      )
                        return;
                      const visibleToolPayload = isForcedToolProgress
                        ? payload
                        : resolveToolDeliveryPayload(payload);
                      if (!visibleToolPayload) return;
                      const ttsPayload = await maybeApplyTtsWithFinalizationLease({
                        payload: visibleToolPayload,
                        cfg,
                        channel: deliveryChannel,
                        kind: "tool",
                        ttsAuto: sessionTtsAuto,
                        agentId: sessionAgentId,
                        accountId: replyRoute.accountId,
                      });
                      const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
                      const deliveryPayload = isForcedToolProgress
                        ? normalizedPayload
                        : resolveToolDeliveryPayload(normalizedPayload);
                      if (!deliveryPayload) return;
                      if (isDispatchOperationAborted()) return;
                      if (
                        shouldSuppressLateTextOnlyToolProgress(deliveryPayload) &&
                        !isFastModeAutoProgressPayload(deliveryPayload) &&
                        !isForcedToolProgress
                      )
                        return;
                      if (shouldSuppressMessageToolOnlyTextErrorProgress(deliveryPayload)) return;
                      if (
                        shouldSuppressDefaultToolProgressMessages() &&
                        !isFastModeAutoProgressPayload(deliveryPayload) &&
                        !isForcedToolProgress
                      ) {
                        if (
                          !resolveSendableOutboundReplyParts(deliveryPayload).hasMedia &&
                          !hasExecApprovalPayload(deliveryPayload)
                        )
                          return;
                      }
                      if (deliveryPayload.isError === true) markVisibleToolErrorProgress();
                      if (shouldRouteToOriginating)
                        await sendPayloadAsync(deliveryPayload, void 0, false);
                      else {
                        markInboundDedupeReplayUnsafe();
                        dispatcher.sendToolResult(deliveryPayload);
                      }
                    };
                    return run();
                  },
                  onPlanUpdate: async (payload) => {
                    if (isDispatchOperationAborted()) return;
                    markProgress();
                    await waitForPendingDirectBlockReplyDelivery(
                      getDispatchAbortOperation()?.abortSignal,
                    );
                    if (isDispatchOperationAborted()) return;
                    markInboundDedupeReplayUnsafe();
                    if (
                      shouldForwardProgressCallback({
                        forwardWhenSourceDeliverySuppressed: true,
                        requiresToolSummaryVisibility: true,
                      })
                    )
                      await onPlanUpdateFromReplyOptions?.(payload);
                    if (isDispatchOperationAborted()) return;
                    if (payload.phase !== "update" || shouldSuppressDefaultToolProgressMessages())
                      return;
                    await sendPlanUpdate({
                      explanation: payload.explanation,
                      steps: payload.steps,
                    });
                  },
                  onApprovalEvent: async (payload) => {
                    if (isDispatchOperationAborted()) return;
                    markProgress();
                    await waitForPendingDirectBlockReplyDelivery(
                      getDispatchAbortOperation()?.abortSignal,
                    );
                    if (isDispatchOperationAborted()) return;
                    markInboundDedupeReplayUnsafe();
                    if (
                      shouldForwardProgressCallback({
                        forwardWhenSourceDeliverySuppressed: true,
                        requiresToolSummaryVisibility: true,
                      })
                    )
                      await onApprovalEventFromReplyOptions?.(payload);
                    if (isDispatchOperationAborted()) return;
                    if (
                      payload.phase !== "requested" ||
                      shouldSuppressDefaultToolProgressMessages()
                    )
                      return;
                    const label = summarizeApprovalLabel({
                      status: payload.status,
                      command: payload.command,
                      message: payload.message,
                    });
                    if (!label) return;
                    await maybeSendWorkingStatus(label);
                  },
                  onPatchSummary: async (payload) => {
                    if (isDispatchOperationAborted()) return;
                    markProgress();
                    await waitForPendingDirectBlockReplyDelivery(
                      getDispatchAbortOperation()?.abortSignal,
                    );
                    if (isDispatchOperationAborted()) return;
                    markInboundDedupeReplayUnsafe();
                    if (
                      shouldForwardProgressCallback({
                        forwardWhenSourceDeliverySuppressed: true,
                        requiresToolSummaryVisibility: true,
                      })
                    )
                      await onPatchSummaryFromReplyOptions?.(payload);
                    if (isDispatchOperationAborted()) return;
                    if (payload.phase !== "end" || shouldSuppressDefaultToolProgressMessages())
                      return;
                    const label = summarizePatchLabel({
                      summary: payload.summary,
                      title: payload.title,
                    });
                    if (!label) return;
                    await maybeSendWorkingStatus(label);
                  },
                  onBlockReply: (payload, context) => {
                    markProgress();
                    const run = async () => {
                      if (isDispatchOperationAborted()) return;
                      if (
                        payload.isReasoning !== true &&
                        payload.isCommentary !== true &&
                        hasOutboundReplyContent(payload, { trimText: true })
                      )
                        markInboundDedupeReplayUnsafe();
                      await flushPendingCommentaryProgress();
                      if (suppressDelivery) return;
                      if (payload.isReasoning === true && !reasoningPayloadsEnabled) return;
                      if (payload.isCommentary === true && !commentaryPayloadsEnabled) return;
                      const isStatusNotice = isReplyPayloadStatusNotice(payload);
                      if (
                        payload.text &&
                        !isStatusNotice &&
                        payload.isReasoning !== true &&
                        payload.isCommentary !== true
                      ) {
                        const joinsBufferedTtsDirective =
                          cleanBlockTtsDirectiveText?.hasBufferedDirectiveText() === true;
                        if (accumulatedBlockText.length > 0) accumulatedBlockText += "\n";
                        accumulatedBlockText += payload.text;
                        if (accumulatedBlockTtsText.length > 0 && !joinsBufferedTtsDirective)
                          accumulatedBlockTtsText += "\n";
                        accumulatedBlockTtsText += payload.text;
                        blockCount++;
                      }
                      const visiblePayload =
                        payload.text &&
                        cleanBlockTtsDirectiveText &&
                        !isStatusNotice &&
                        payload.isReasoning !== true &&
                        payload.isCommentary !== true
                          ? (() => {
                              const text = cleanBlockTtsDirectiveText.push(payload.text);
                              return copyReplyPayloadMetadata(payload, {
                                ...payload,
                                text: text.trim() ? text : void 0,
                              });
                            })()
                          : payload;
                      if (!hasOutboundReplyContent(visiblePayload, { trimText: true })) return;
                      const payloadMetadata = getReplyPayloadMetadata(payload);
                      const queuedContext =
                        payloadMetadata?.assistantMessageIndex !== void 0
                          ? {
                              ...context,
                              assistantMessageIndex: payloadMetadata.assistantMessageIndex,
                            }
                          : context;
                      if (!suppressAutomaticSourceDelivery)
                        await params.replyOptions?.onBlockReplyQueued?.(
                          visiblePayload,
                          queuedContext,
                        );
                      if (isDispatchOperationAborted()) return;
                      const ttsPayload =
                        payload.isReasoning === true || payload.isCommentary === true
                          ? visiblePayload
                          : await maybeApplyTtsWithFinalizationLease({
                              payload: visiblePayload,
                              cfg,
                              channel: deliveryChannel,
                              kind: "block",
                              ttsAuto: sessionTtsAuto,
                              agentId: sessionAgentId,
                              accountId: replyRoute.accountId,
                            });
                      const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
                      if (isDispatchOperationAborted()) return;
                      if (shouldRouteToOriginating)
                        await sendPayloadAsync(
                          normalizedPayload,
                          context?.abortSignal,
                          false,
                          "block",
                        );
                      else {
                        markInboundDedupeReplayUnsafe();
                        if (dispatcher.sendBlockReply(normalizedPayload))
                          hasPendingDirectBlockReplyDelivery = true;
                      }
                    };
                    return run();
                  },
                },
                replyConfig,
              ),
            ),
          trackDispatchLifecycleWork,
        ),
    );
    notifySessionMetadataChanges(takeCommandSessionMetadataChanges(ctx));
    const finalDispatchAcquisition = await ensureDispatchReplyOperation("dispatch");
    if (finalDispatchAcquisition.status === "aborted") return finishReplyOperationAbortedDispatch();
    if (finalDispatchAcquisition.status === "busy")
      return finishReplyOperationBusyDispatch({
        recordAgentDispatchCompleted: true,
        ...(sessionMetadataChangesForResult
          ? { sessionMetadataChanges: sessionMetadataChangesForResult }
          : {}),
      });
    if (ctx.AcpDispatchTailAfterReset === true) {
      ctx.AcpDispatchTailAfterReset = false;
      if (hookRunner?.hasHooks("reply_dispatch")) {
        const tailDispatchResult = await runWithDispatchLifecycleAdmission(
          async () =>
            await runWithDispatchAbortSignal(
              getDispatchAbortSignal(),
              () =>
                hookRunner.runReplyDispatch(
                  createReplyDispatchEvent({
                    ctx,
                    runId: params.replyOptions?.runId,
                    sessionKey: acpDispatchSessionKey,
                    toolsAllow: params.replyOptions?.toolsAllow,
                    images: params.replyOptions?.images,
                    inboundAudio,
                    sessionTtsAuto,
                    ttsChannel: deliveryChannel,
                    suppressUserDelivery: suppressHookUserDelivery,
                    suppressReplyLifecycle: suppressHookReplyLifecycle,
                    sourceReplyDeliveryMode,
                    shouldRouteToOriginating,
                    originatingChannel: routeReplyChannel,
                    originatingTo: routeReplyTo,
                    originatingAccountId: replyContextAccountId,
                    originatingThreadId: routeReplyThreadId,
                    originatingChatType: replyRoute.chatType,
                    shouldSendToolSummaries,
                    sendPolicy,
                    isTailDispatch: true,
                  }),
                  {
                    cfg,
                    dispatcher: dispatchHookDispatcher,
                    abortSignal: getPreDispatchAbortSignal() ?? params.replyOptions?.abortSignal,
                    onReplyStart: params.replyOptions?.onReplyStart,
                    recordProcessed,
                    markIdle,
                  },
                ),
              trackDispatchLifecycleWork,
            ),
        );
        if (tailDispatchResult?.handled) {
          recordAgentDispatchCompleted("completed");
          completeDispatchReplyOperation();
          return attachSourceReplyDeliveryMode({
            queuedFinal: tailDispatchResult.queuedFinal,
            counts: tailDispatchResult.counts,
            ...(sessionMetadataChangesForResult
              ? { sessionMetadataChanges: sessionMetadataChangesForResult }
              : {}),
          });
        }
      }
    }
    const replies = replyResult ? (Array.isArray(replyResult) ? replyResult : [replyResult]) : [];
    const pendingFinalDelivery = {
      storePath: sessionStoreEntry.storePath,
      sessionKey: sessionStoreEntry.sessionKey ?? sessionKey,
    };
    const replyPendingIntentIds = new Set(
      replies
        .map((reply) => getReplyPayloadMetadata(reply)?.pendingFinalDeliveryIntentId)
        .filter((intentId) => Boolean(intentId)),
    );
    const pendingFinalDeliveryIdentity = capturePendingFinalDeliveryIdentity({
      ...pendingFinalDelivery,
      intentId: replyPendingIntentIds.size === 1 ? [...replyPendingIntentIds][0] : void 0,
    });
    if (preserveProgressCallbackStartOrder) await progressCallbackStartTail;
    await flushPendingCommentaryProgress();
    const beforeAgentRunBlocked = replies.some(
      (reply) => getReplyPayloadMetadata(reply)?.beforeAgentRunBlocked === true,
    );
    let queuedFinal = false;
    let routedFinalCount = 0;
    let attemptedFinalDelivery = false;
    let finalDeliveryFailed = false;
    const finalDeliveries = [];
    let allQueuedFinalsObserved = true;
    const shouldDeliverDespiteSourceReplySuppression = (reply) =>
      suppressAutomaticSourceDelivery &&
      !sendPolicyDenied &&
      getReplyPayloadMetadata(reply)?.deliverDespiteSourceReplySuppression === true &&
      (ctx.InboundEventKind !== "room_event" || explicitCommandTurnCtx);
    const sentFinalPayloadDedupeKeys = /* @__PURE__ */ new Set();
    for (const [replyIndex, reply] of replies.entries()) {
      throwIfDispatchOperationAborted();
      if (reply.isReasoning === true && !reasoningPayloadsEnabled) continue;
      if (reply.isCommentary === true && !commentaryPayloadsEnabled) continue;
      if (suppressDelivery && !shouldDeliverDespiteSourceReplySuppression(reply)) {
        if (hasOutboundReplyContent(reply, { trimText: true }))
          logVerbose(
            [
              `dispatch-from-config: final reply suppressed by ${deliverySuppressionReason || "source delivery policy"}`,
              `(session=${acpDispatchSessionKey ?? sessionKey ?? "unknown"}`,
              `provider=${ctx.Provider ?? "unknown"}`,
              `surface=${ctx.Surface ?? "unknown"}`,
              `chatType=${chatType ?? "unknown"}`,
              `inboundEventKind=${ctx.InboundEventKind ?? "unknown"}`,
              `message=${ctx.MessageSidFull ?? ctx.MessageSid ?? "unknown"}`,
              `${formatSuppressedReplyPayloadForLog(reply)})`,
            ].join(" "),
          );
        continue;
      }
      const finalPayloadDedupeKey = createFinalDispatchPayloadDedupeKey(reply);
      if (sentFinalPayloadDedupeKeys.has(finalPayloadDedupeKey)) continue;
      sentFinalPayloadDedupeKeys.add(finalPayloadDedupeKey);
      attemptedFinalDelivery = true;
      const finalReply = await sendFinalPayload(reply, { deliveryId: String(replyIndex) });
      queuedFinal = finalReply.queuedFinal || queuedFinal;
      routedFinalCount += finalReply.routedFinalCount;
      if (finalReply.queuedFinal)
        if (finalReply.dispatcherOutcome)
          finalDeliveries.push({
            outcome: finalReply.dispatcherOutcome,
            payload: reply,
          });
        else allQueuedFinalsObserved = false;
      if (!finalReply.queuedFinal && finalReply.routedFinalCount === 0) finalDeliveryFailed = true;
    }
    if (attemptedFinalDelivery && !finalDeliveryFailed) {
      if (queuedFinal && allQueuedFinalsObserved) {
        const reconcilePendingFinal = Promise.all(
          finalDeliveries.map(async (delivery) => ({
            outcome: await delivery.outcome,
            payload: delivery.payload,
          })),
        )
          .then(async (deliveries) => {
            await reconcilePendingFinalDeliveryAfterSettlement({
              ...pendingFinalDelivery,
              deliveries,
              identity: pendingFinalDeliveryIdentity,
              replies,
            });
          })
          .catch((error) => {
            logVerbose(
              `dispatch-from-config: pending final reconciliation failed: ${formatErrorMessage(error)}`,
            );
          });
        registerReplyDispatcherSettledTask(dispatcher, () => reconcilePendingFinal);
      } else
        await clearPendingFinalDeliveryAfterSuccess({
          ...pendingFinalDelivery,
          identity: pendingFinalDeliveryIdentity,
        });
      throwIfDispatchOperationAborted();
    }
    if (!suppressDelivery) {
      if (
        resolveConfiguredTtsMode(cfg, {
          agentId: sessionAgentId,
          channelId: deliveryChannel,
          accountId: replyRoute.accountId,
        }) === "final" &&
        replies.length === 0 &&
        blockCount > 0 &&
        accumulatedBlockTtsText.trim()
      )
        try {
          await waitForPendingDirectBlockReplyDelivery(getDispatchAbortSignal());
          throwIfDispatchOperationAborted();
          const ttsSyntheticReply = await maybeApplyTtsWithFinalizationLease({
            payload: { text: accumulatedBlockTtsText },
            cfg,
            channel: deliveryChannel,
            kind: "final",
            ttsAuto: sessionTtsAuto,
            agentId: sessionAgentId,
            accountId: replyRoute.accountId,
          });
          throwIfDispatchOperationAborted();
          if (ttsSyntheticReply.mediaUrl) {
            const normalizedTtsOnlyPayload = await normalizeReplyMediaPayload(
              markReplyPayloadAsTtsSupplement(
                {
                  mediaUrl: ttsSyntheticReply.mediaUrl,
                  audioAsVoice: ttsSyntheticReply.audioAsVoice,
                  spokenText: accumulatedBlockTtsText,
                  trustedLocalMedia: true,
                },
                accumulatedBlockTtsText,
                { visibleTextAlreadyDelivered: true },
              ),
            );
            throwIfDispatchOperationAborted();
            const result = await routeReplyToOriginating(normalizedTtsOnlyPayload, {
              abortSignal: getDispatchAbortSignal(),
              kind: "final",
            });
            if (result) {
              queuedFinal = result.ok || queuedFinal;
              if (isRoutedReplyDelivered(result)) routedFinalCount += 1;
              if (!result.ok)
                logVerbose(
                  `dispatch-from-config: route-reply (tts-only) failed: ${result.error ?? "unknown error"}`,
                );
            } else {
              throwIfDispatchOperationAborted();
              markInboundDedupeReplayUnsafe();
              queuedFinal = dispatcher.sendFinalReply(normalizedTtsOnlyPayload) || queuedFinal;
            }
          }
        } catch (err) {
          if (isDispatchReplyOperationAbortedError(err)) throw err;
          logVerbose(
            `dispatch-from-config: accumulated block TTS failed: ${formatErrorMessage(err)}`,
          );
        }
    }
    await waitForPendingDirectBlockReplyDelivery(getDispatchAbortSignal());
    const counts = dispatcher.getQueuedCounts();
    counts.final += routedFinalCount;
    commitInboundDedupeIfClaimed();
    recordAgentDispatchCompleted("completed");
    recordProcessed("completed", pluginFallbackReason ? { reason: pluginFallbackReason } : void 0);
    markIdle("message_completed");
    completeDispatchReplyOperation();
    return attachSourceReplyDeliveryMode({
      queuedFinal,
      counts,
      ...(sessionMetadataChangesForResult
        ? { sessionMetadataChanges: sessionMetadataChangesForResult }
        : {}),
      ...(getObservedReplyDelivery() ? { observedReplyDelivery: true } : {}),
      ...(!queuedFinal && !getObservedReplyDelivery() && !emptyFinalAllowedAsSilent
        ? { noVisibleReplyFallbackEligible: true }
        : {}),
      ...(beforeAgentRunBlocked ? { beforeAgentRunBlocked } : {}),
    });
  } catch (err) {
    if (isDispatchReplyOperationAbortedError(err)) return finishReplyOperationAbortedDispatch();
    if (inboundDedupeClaim.status === "claimed")
      if (inboundDedupeReplayUnsafe) commitInboundDedupe(inboundDedupeClaim.key);
      else releaseInboundDedupe(inboundDedupeClaim.key);
    recordAgentDispatchCompleted("error", { error: String(err) });
    recordProcessed("error", { error: String(err) });
    markIdle("message_error");
    failDispatchReplyOperation(err);
    throw err;
  }
}
//#endregion
//#region src/auto-reply/dispatch.ts
/** Auto-reply dispatch orchestration, hook composition, and foreground delivery fencing. */
const foregroundReplyFenceByKey = /* @__PURE__ */ new Map();
const replyPayloadSendingDispatchers = /* @__PURE__ */ new WeakSet();
function applyRuntimeToolsAllow(replyOptions, toolsAllow) {
  if (toolsAllow === void 0) return replyOptions;
  return {
    ...replyOptions,
    toolsAllow,
  };
}
function normalizeForegroundReplyFencePart(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function resolveForegroundReplyFenceKey(finalized) {
  const sessionKey = normalizeForegroundReplyFencePart(finalized.SessionKey);
  const channel =
    normalizeForegroundReplyFencePart(finalized.OriginatingChannel) ??
    normalizeForegroundReplyFencePart(finalized.Surface) ??
    normalizeForegroundReplyFencePart(finalized.Provider);
  const target =
    normalizeForegroundReplyFencePart(finalized.OriginatingTo) ??
    normalizeForegroundReplyFencePart(finalized.NativeChannelId) ??
    normalizeForegroundReplyFencePart(finalized.From) ??
    normalizeForegroundReplyFencePart(finalized.To);
  if (!sessionKey || !channel || !target) return;
  return JSON.stringify([
    "foreground",
    channel,
    normalizeForegroundReplyFencePart(finalized.AccountId) ?? "default",
    sessionKey,
    normalizeChatType(finalized.ChatType) ?? "unknown",
    target,
  ]);
}
function beginForegroundReplyFence(finalized) {
  const key = resolveForegroundReplyFenceKey(finalized);
  if (!key) return;
  const state = foregroundReplyFenceByKey.get(key) ?? {
    generation: 0,
    visibleDeliveryGeneration: 0,
    activeDispatches: 0,
    activeGenerations: /* @__PURE__ */ new Map(),
    suspendedGenerations: /* @__PURE__ */ new Set(),
    waiters: /* @__PURE__ */ new Set(),
  };
  state.generation += 1;
  state.activeDispatches += 1;
  state.activeGenerations.set(
    state.generation,
    (state.activeGenerations.get(state.generation) ?? 0) + 1,
  );
  foregroundReplyFenceByKey.set(key, state);
  return {
    key,
    generation: state.generation,
    state,
  };
}
function notifyForegroundReplyFenceWaiters(state) {
  const waiters = [...state.waiters];
  state.waiters.clear();
  for (const resolve of waiters) resolve();
}
function setForegroundReplyFenceAdmissionWaiting(snapshot, waiting) {
  if (!snapshot) return;
  const state = foregroundReplyFenceByKey.get(snapshot.key);
  if (state !== snapshot.state) return;
  if (waiting) {
    if (state.activeGenerations.delete(snapshot.generation))
      state.suspendedGenerations.add(snapshot.generation);
  } else if (state.suspendedGenerations.delete(snapshot.generation))
    state.activeGenerations.set(snapshot.generation, 1);
  notifyForegroundReplyFenceWaiters(state);
}
function hasNewerActiveForegroundReplyFenceGeneration(state, generation) {
  for (const [activeGeneration, count] of state.activeGenerations)
    if (activeGeneration > generation && count > 0) return true;
  return false;
}
async function shouldCancelForegroundReplyDelivery(snapshot) {
  if (!snapshot) return false;
  while (true) {
    const state = foregroundReplyFenceByKey.get(snapshot.key);
    if (!state) return false;
    if (state.visibleDeliveryGeneration > snapshot.generation) return true;
    if (!hasNewerActiveForegroundReplyFenceGeneration(state, snapshot.generation)) return false;
    await new Promise((resolve) => {
      state.waiters.add(resolve);
    });
  }
}
function markForegroundReplyFenceVisibleDelivery(snapshot, payload, deliveryResult) {
  if (!snapshot || !hasOutboundReplyContent(payload, { trimText: true })) return;
  if (isExplicitlyNonVisibleDelivery(deliveryResult)) return;
  markForegroundReplyFenceVisibleDeliveryGeneration(snapshot);
}
function markForegroundReplyFenceVisibleDeliveryGeneration(snapshot) {
  if (!snapshot) return;
  const state = foregroundReplyFenceByKey.get(snapshot.key);
  if (!state) return;
  state.visibleDeliveryGeneration = Math.max(state.visibleDeliveryGeneration, snapshot.generation);
  notifyForegroundReplyFenceWaiters(state);
}
function isExplicitlyNonVisibleDelivery(deliveryResult) {
  return (
    typeof deliveryResult === "object" &&
    deliveryResult !== null &&
    !Array.isArray(deliveryResult) &&
    "visibleReplySent" in deliveryResult &&
    deliveryResult.visibleReplySent === false
  );
}
function isExplicitlyVisibleDelivery(deliveryResult) {
  return (
    typeof deliveryResult === "object" &&
    deliveryResult !== null &&
    !Array.isArray(deliveryResult) &&
    deliveryResult.visibleReplySent === true
  );
}
function isVisiblePartialDeliveryError(error) {
  if (isOutboundDeliveryError(error)) return error.sentBeforeError;
  return (
    typeof error === "object" &&
    error !== null &&
    !Array.isArray(error) &&
    (error.visibleReplySent === true || error.sentBeforeError === true)
  );
}
async function runForegroundReplyFenceFreshSettledDelivery(snapshot, onFreshSettledDelivery) {
  if (!onFreshSettledDelivery) return;
  if (await shouldCancelForegroundReplyDelivery(snapshot)) return;
  try {
    if (isExplicitlyVisibleDelivery(await onFreshSettledDelivery()))
      markForegroundReplyFenceVisibleDeliveryGeneration(snapshot);
  } catch (err) {
    if (isVisiblePartialDeliveryError(err))
      markForegroundReplyFenceVisibleDeliveryGeneration(snapshot);
    throw err;
  }
}
function endForegroundReplyFence(snapshot) {
  const state = foregroundReplyFenceByKey.get(snapshot.key);
  if (!state) return;
  const activeGenerationCount = state.activeGenerations.get(snapshot.generation) ?? 0;
  if (activeGenerationCount <= 1) state.activeGenerations.delete(snapshot.generation);
  else state.activeGenerations.set(snapshot.generation, activeGenerationCount - 1);
  state.suspendedGenerations.delete(snapshot.generation);
  state.activeDispatches -= 1;
  notifyForegroundReplyFenceWaiters(state);
  if (state.activeDispatches <= 0) foregroundReplyFenceByKey.delete(snapshot.key);
}
function resolveDispatcherSilentReplyContext(ctx, cfg) {
  const finalized = finalizeInboundContext(ctx);
  const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(finalized);
  const policySessionKey = commandTargetSessionKey ?? finalized.SessionKey;
  const chatType = normalizeChatType(finalized.ChatType);
  const conversationType =
    commandTargetSessionKey && commandTargetSessionKey !== finalized.SessionKey
      ? void 0
      : chatType === "direct"
        ? "direct"
        : chatType === "group" || chatType === "channel"
          ? "group"
          : void 0;
  return {
    cfg,
    sessionKey: policySessionKey,
    surface: finalized.Surface ?? finalized.Provider,
    conversationType,
  };
}
function resolveInboundReplyHookTarget(finalized, hookCtx) {
  if (typeof finalized.OriginatingTo === "string" && finalized.OriginatingTo.trim())
    return finalized.OriginatingTo;
  if (hookCtx.isGroup) return hookCtx.conversationId ?? hookCtx.to ?? hookCtx.from;
  return hookCtx.from || hookCtx.conversationId || hookCtx.to || "";
}
function buildMessageSendingBeforeDeliver(ctx) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("message_sending")) return;
  const finalized = finalizeInboundContext(ctx);
  const hookCtx = deriveInboundMessageHookContext(finalized);
  const replyTarget = resolveInboundReplyHookTarget(finalized, hookCtx);
  return markReplyDispatchBeforeDeliverDeadlineOwned(async (payload) => {
    if (!payload.text) return payload;
    const result = await hookRunner.runMessageSending(
      {
        content: payload.text,
        to: replyTarget,
      },
      toPluginMessageContext(hookCtx),
    );
    if (result?.cancel) return null;
    if (result?.content != null)
      return copyReplyPayloadMetadata(payload, {
        ...payload,
        text: result.content,
      });
    return payload;
  });
}
function buildReplyPayloadSendingBeforeDeliver(ctx, runState) {
  const finalized = finalizeInboundContext(ctx);
  const hookCtx = deriveInboundMessageHookContext(finalized);
  return markReplyDispatchBeforeDeliverDeadlineOwned(async (payload, info) => {
    const runId = runState.runId;
    const hookedPayload = await runReplyPayloadSendingHook({
      payload,
      kind: info.kind,
      channel: finalized.Surface ?? finalized.Provider,
      sessionKey: finalized.SessionKey,
      runId,
      usageState: consumeReplyUsageState(runId),
      context: {
        ...toPluginMessageContext(hookCtx),
        runId,
      },
    });
    return hookedPayload && hasOutboundReplyContent(hookedPayload) ? hookedPayload : null;
  });
}
function bindReplyPayloadRunState(replyOptions, runState) {
  const onAgentRunStart = replyOptions?.onAgentRunStart;
  return {
    ...replyOptions,
    onAgentRunStart: (runId) => {
      runState.runId = runId;
      onAgentRunStart?.(runId);
    },
  };
}
function installReplyPayloadSendingBeforeDeliver(dispatcher, ctx, runState) {
  if (replyPayloadSendingDispatchers.has(dispatcher)) return;
  const beforeDeliver = buildReplyPayloadSendingBeforeDeliver(ctx, runState);
  if (!beforeDeliver || !dispatcher.appendBeforeDeliver) return;
  dispatcher.appendBeforeDeliver(beforeDeliver);
  replyPayloadSendingDispatchers.add(dispatcher);
}
function markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, beforeDeliver) {
  if (beforeDeliver) replyPayloadSendingDispatchers.add(dispatcher);
}
function buildDispatchTimelineAttributes(ctx) {
  const commandTurn = resolveCommandTurnContext(ctx);
  return {
    surface:
      typeof ctx.Surface === "string"
        ? ctx.Surface
        : typeof ctx.Provider === "string"
          ? ctx.Provider
          : "unknown",
    hasSessionKey:
      typeof ctx.SessionKey === "string" || typeof ctx.CommandTargetSessionKey === "string",
    commandSource: commandTurn.source,
  };
}
function finalizeDispatchResult(result, dispatcher) {
  const cancelledCounts = dispatcher.getCancelledCounts?.();
  const failedCounts = dispatcher.getFailedCounts?.();
  if (!cancelledCounts && !failedCounts) return result;
  const resultCounts = {
    tool: result.counts?.tool ?? 0,
    block: result.counts?.block ?? 0,
    final: result.counts?.final ?? 0,
  };
  const counts = {
    tool: Math.max(0, resultCounts.tool - (cancelledCounts?.tool ?? 0) - (failedCounts?.tool ?? 0)),
    block: Math.max(
      0,
      resultCounts.block - (cancelledCounts?.block ?? 0) - (failedCounts?.block ?? 0),
    ),
    final: Math.max(
      0,
      resultCounts.final - (cancelledCounts?.final ?? 0) - (failedCounts?.final ?? 0),
    ),
  };
  const hasFailedCounts =
    (failedCounts?.tool ?? 0) > 0 ||
    (failedCounts?.block ?? 0) > 0 ||
    (failedCounts?.final ?? 0) > 0;
  return {
    ...result,
    queuedFinal: result.queuedFinal && counts.final > 0,
    counts,
    ...(hasFailedCounts ? { failedCounts } : {}),
  };
}
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
async function dispatchInboundMessage(params) {
  const replyOptions = applyRuntimeToolsAllow(params.replyOptions, params.toolsAllow);
  const replyPayloadRunState = params.replyPayloadRunState ?? { runId: replyOptions?.runId };
  const replyOptionsWithRunState = bindReplyPayloadRunState(replyOptions, replyPayloadRunState);
  const finalized = measureDiagnosticsTimelineSpanSync(
    "auto_reply.finalize_context",
    () => finalizeInboundContext(params.ctx),
    {
      phase: "agent-turn",
      config: params.cfg,
      attributes: buildDispatchTimelineAttributes(params.ctx),
    },
  );
  if (isDiagnosticsEnabled(params.cfg))
    logMessageReceived({
      sessionKey: finalized.SessionKey,
      channel: finalized.Surface ?? finalized.Provider,
      chatId: finalized.To ?? finalized.From,
      messageId: finalized.MessageSid ?? finalized.MessageSidFirst ?? finalized.MessageSidLast,
      source: "dispatchInboundMessage",
    });
  installReplyPayloadSendingBeforeDeliver(params.dispatcher, finalized, replyPayloadRunState);
  return finalizeDispatchResult(
    await withReplyDispatcher({
      dispatcher: params.dispatcher,
      run: () =>
        measureDiagnosticsTimelineSpan(
          "auto_reply.dispatch_reply_from_config",
          () =>
            dispatchReplyFromConfig({
              ctx: finalized,
              cfg: params.cfg,
              dispatcher: params.dispatcher,
              replyOptions: replyOptionsWithRunState,
              replyResolver: params.replyResolver,
              onSessionMetadataChanges: params.onSessionMetadataChanges,
            }),
          {
            phase: "agent-turn",
            config: params.cfg,
            attributes: buildDispatchTimelineAttributes(finalized),
          },
        ),
    }),
    params.dispatcher,
  );
}
/** Creates a buffered dispatcher with typing, hooks, and stale foreground delivery suppression. */
async function dispatchInboundMessageWithBufferedDispatcher(params) {
  const finalized = finalizeInboundContext(params.ctx);
  const foregroundReplyFence = beginForegroundReplyFence(finalized);
  const silentReplyContext = resolveDispatcherSilentReplyContext(finalized, params.cfg);
  const replyPayloadRunState = { runId: params.replyOptions?.runId };
  const replyPayloadBeforeDeliver = buildReplyPayloadSendingBeforeDeliver(
    finalized,
    replyPayloadRunState,
  );
  const globalBeforeDeliver = composeReplyDispatchBeforeDeliver(
    replyPayloadBeforeDeliver,
    buildMessageSendingBeforeDeliver(finalized),
  );
  const configuredBeforeDeliver = params.dispatcherOptions.beforeDeliver
    ? composeReplyDispatchBeforeDeliver(
        {
          hook: params.dispatcherOptions.beforeDeliver,
          options: params.dispatcherOptions.beforeDeliverOptions,
        },
        replyPayloadBeforeDeliver,
      )
    : globalBeforeDeliver;
  const beforeDeliver =
    foregroundReplyFence || configuredBeforeDeliver
      ? markReplyDispatchBeforeDeliverDeadlineOwned(async (payload, info) => {
          if (await shouldCancelForegroundReplyDelivery(foregroundReplyFence)) {
            setReplyPayloadMetadata(payload, {
              foregroundDeliverySuppression: { reason: "stale-foreground" },
            });
            return null;
          }
          const deliverPayload = configuredBeforeDeliver
            ? await configuredBeforeDeliver(payload, info)
            : payload;
          if (!deliverPayload) return null;
          if (await shouldCancelForegroundReplyDelivery(foregroundReplyFence)) {
            setReplyPayloadMetadata(payload, {
              foregroundDeliverySuppression: { reason: "stale-foreground" },
            });
            return null;
          }
          return deliverPayload;
        })
      : void 0;
  const deliver = async (payload, info) => {
    try {
      const result = await params.dispatcherOptions.deliver(payload, info);
      markForegroundReplyFenceVisibleDelivery(foregroundReplyFence, payload, result);
      return result;
    } catch (err) {
      if (isVisiblePartialDeliveryError(err))
        markForegroundReplyFenceVisibleDelivery(foregroundReplyFence, payload, {
          visibleReplySent: true,
        });
      throw err;
    }
  };
  const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } =
    createReplyDispatcherWithTyping({
      ...params.dispatcherOptions,
      deliver,
      beforeDeliver,
      silentReplyContext: params.dispatcherOptions.silentReplyContext ?? silentReplyContext,
    });
  markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, replyPayloadBeforeDeliver);
  try {
    return await dispatchInboundMessage({
      ctx: finalized,
      cfg: params.cfg,
      dispatcher,
      toolsAllow: params.toolsAllow,
      replyResolver: params.replyResolver,
      replyOptions: {
        ...params.replyOptions,
        ...replyOptions,
        onFollowupAdmissionWaitChange: (waiting) => {
          setForegroundReplyFenceAdmissionWaiting(foregroundReplyFence, waiting);
        },
      },
      replyPayloadRunState,
      onSessionMetadataChanges: params.onSessionMetadataChanges,
    });
  } finally {
    try {
      if (isExplicitlyVisibleDelivery(await params.dispatcherOptions.onSettled?.()))
        markForegroundReplyFenceVisibleDeliveryGeneration(foregroundReplyFence);
      await runForegroundReplyFenceFreshSettledDelivery(
        foregroundReplyFence,
        params.dispatcherOptions.onFreshSettledDelivery,
      );
    } finally {
      if (foregroundReplyFence) endForegroundReplyFence(foregroundReplyFence);
      markRunComplete();
      markDispatchIdle();
    }
  }
}
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
async function dispatchInboundMessageWithDispatcher(params) {
  const silentReplyContext = resolveDispatcherSilentReplyContext(params.ctx, params.cfg);
  const replyPayloadRunState = { runId: params.replyOptions?.runId };
  const replyPayloadBeforeDeliver = buildReplyPayloadSendingBeforeDeliver(
    params.ctx,
    replyPayloadRunState,
  );
  const globalBeforeDeliver = composeReplyDispatchBeforeDeliver(
    replyPayloadBeforeDeliver,
    buildMessageSendingBeforeDeliver(params.ctx),
  );
  const composedBeforeDeliver = params.dispatcherOptions.beforeDeliver
    ? composeReplyDispatchBeforeDeliver(
        {
          hook: params.dispatcherOptions.beforeDeliver,
          options: params.dispatcherOptions.beforeDeliverOptions,
        },
        replyPayloadBeforeDeliver,
      )
    : globalBeforeDeliver;
  const dispatcher = createReplyDispatcher({
    ...params.dispatcherOptions,
    beforeDeliver: composedBeforeDeliver,
    silentReplyContext: params.dispatcherOptions.silentReplyContext ?? silentReplyContext,
  });
  markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, replyPayloadBeforeDeliver);
  return await dispatchInboundMessage({
    ctx: params.ctx,
    cfg: params.cfg,
    dispatcher,
    toolsAllow: params.toolsAllow,
    replyResolver: params.replyResolver,
    replyOptions: params.replyOptions,
    replyPayloadRunState,
  });
}
//#endregion
export {
  settleReplyDispatcher as a,
  dispatchReplyFromConfig as i,
  dispatchInboundMessageWithBufferedDispatcher as n,
  withReplyDispatcher as o,
  dispatchInboundMessageWithDispatcher as r,
  dispatchInboundMessage as t,
};
