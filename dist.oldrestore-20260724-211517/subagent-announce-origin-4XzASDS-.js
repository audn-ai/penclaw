import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as resolveExternalBestEffortDeliveryTarget } from "./best-effort-delivery-uosomAyH.js";
import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import {
  i as stripTargetTopicSuffix,
  n as stripTargetKindPrefix,
  r as stripTargetProviderPrefix,
} from "./channel-target-prefix-Co3r_2wp.js";
import { t as completionRequiresMessageToolDelivery } from "./completion-delivery-policy-BAClVBMv.js";
import { i as resolveConversationIdFromTargets } from "./conversation-binding-context-CFEd5JKR.js";
import { i as isOutboundDeliveryError } from "./deliver-types-eQDro8Up.js";
import {
  i as mergeDeliveryContext,
  n as deliveryContextFromSession,
  o as normalizeDeliveryContext,
} from "./delivery-context.shared-WPZGmi9R.js";
import "./config-BDv-QbJ6.js";
import "./call-BVMO6az_.js";
import {
  f as hasVisibleAgentPayload,
  i as getGatewayAgentResult,
  n as collectMessagingToolDeliveredMediaUrls,
  r as getAgentCommandDeliveryFailure,
  t as collectDeliveredMediaUrls,
  u as hasMessagingToolDeliveryEvidence,
  v as sourceDeliveryTargetsMatch,
  y as hasAcceptedSessionSpawn,
} from "./delivery-evidence-oVjLoAkq.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import {
  a as isAgentMediatedCompletionSourceTool,
  c as shouldPreserveUserFacingSessionStateForInputProvenance,
} from "./input-provenance-Xst3EirW.js";
import {
  n as INTERNAL_RUNTIME_CONTEXT_END,
  s as escapeInternalRuntimeContextDelimiters,
  t as INTERNAL_RUNTIME_CONTEXT_BEGIN,
} from "./internal-runtime-context-BW7WOTKc.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./message-channel-constants-CvbXi0yz.js";
import { a as resolveMainSessionKey } from "./main-session-nrmKYo2W.js";
import {
  i as normalizeMessageChannel,
  n as isGatewayMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import { i as isInternalMessageChannel } from "./message-channel-NQc9DJ6B.js";
import { t as sendMessage } from "./message-CmW4rY5a.js";
import { f as clampTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { t as resolveQueueSettings } from "./queue-DBlMyPZt.js";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-D8eZo-vR.js";
import {
  i as routeToDeliveryFields,
  r as routeFromConversationRef,
} from "./route-projection-DR6UNG24.js";
import { m as resolveActiveEmbeddedRunSessionId } from "./run-state-BJlMim-d.js";
import {
  d as isEmbeddedAgentRunActive,
  m as isEmbeddedRunAbandoned,
  s as formatEmbeddedAgentQueueFailureSummary,
  y as queueEmbeddedAgentMessageWithOutcomeAsync,
} from "./runs-GL_-RIwi.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { n as wrapPromptDataBlock } from "./sanitize-for-prompt-Drdy09dw.js";
import { r as dispatchGatewayMethodInProcess } from "./server-plugins-WbUfkNgn.js";
import "./sessions-CEG7v41b.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { n as normalizeConversationRef } from "./session-binding-normalization-sQL-8bRz.js";
import { n as getSessionBindingService } from "./session-binding-service-DPVMwWUH.js";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CkAy8Bjk.js";
import "./delivery-context-DXOSD_HH.js";
import {
  d as resolveAgentIdFromSessionKey,
  l as normalizeMainKey,
} from "./session-key-druuY-GG.js";
import {
  i as isCronSessionKey,
  l as parseCronRunScopeSuffix,
  r as isCronRunSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import { r as isSessionWriteLockAcquireError } from "./session-write-lock-error-CYOzPsPk.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { s as getSubagentDepthFromSessionStore } from "./subagent-capabilities-DP50Hfbb.js";
import { i as isSilentReplyPayloadText } from "./tokens-DKI4eGAu.js";
//#region src/agents/generated-attachments.ts
/**
 * Formats generated attachment references for agent-visible output.
 */
function generatedAttachmentReference(attachment) {
  return normalizeOptionalString(
    attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath,
  );
}
/** Return unique media URLs/paths from generated attachments. */
function mediaUrlsFromGeneratedAttachments(attachments) {
  return uniqueStrings(
    attachments?.flatMap((attachment) => generatedAttachmentReference(attachment) ?? []) ?? [],
  );
}
function nameFromGeneratedAttachment(attachment) {
  return (
    normalizeOptionalString(attachment.name) ??
    basenameFromAnyPath(generatedAttachmentReference(attachment) ?? "")
  );
}
/** Format generated attachment metadata as prompt-safe text lines. */
function formatGeneratedAttachmentLines(attachments) {
  if (!attachments?.length) return [];
  const lines = ["Attachments:"];
  for (const [index, attachment] of attachments.entries()) {
    const parts = [`${index + 1}.`];
    const type = normalizeOptionalString(attachment.type);
    const name = nameFromGeneratedAttachment(attachment);
    const mimeType = normalizeOptionalString(attachment.mimeType);
    const path = normalizeOptionalString(attachment.path ?? attachment.filePath);
    const url = normalizeOptionalString(attachment.url ?? attachment.mediaUrl);
    if (type) parts.push(`type=${type}`);
    if (name) parts.push(`name=${JSON.stringify(name)}`);
    if (mimeType) parts.push(`mimeType=${mimeType}`);
    if (path) parts.push(`path=${JSON.stringify(path)}`);
    else if (url) parts.push(`mediaUrl=${JSON.stringify(url)}`);
    lines.push(parts.join(" "));
  }
  return lines;
}
//#endregion
//#region src/agents/internal-event-contract.ts
const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
const GENERATED_MEDIA_COMPLETION_SOURCES = /* @__PURE__ */ new Set([
  "image_generation",
  "video_generation",
  "music_generation",
]);
/** Identifies completion events that can resume an exact cron run. */
function hasGeneratedMediaCompletionEvent(events) {
  return Boolean(
    events?.some(
      (event) =>
        event.type === "task_completion" && GENERATED_MEDIA_COMPLETION_SOURCES.has(event.source),
    ),
  );
}
//#endregion
//#region src/agents/internal-events.ts
/**
 * Internal runtime event prompt formatting.
 * Sanitizes background task completion events into protected runtime-context
 * blocks or plain prompt text.
 */
function sanitizeSingleLineField(value, fallback) {
  return (
    escapeInternalRuntimeContextDelimiters(value)
      .replace(/\r?\n+/g, " ")
      .trim() || fallback
  );
}
function sanitizeMultilineField(value, fallback) {
  return escapeInternalRuntimeContextDelimiters(value).replace(/\r\n/g, "\n").trim() || fallback;
}
function sanitizeMediaDirectiveValue(value) {
  let singleLine = "";
  for (const char of escapeInternalRuntimeContextDelimiters(value).replace(/\r?\n/g, " ")) {
    const code = char.charCodeAt(0);
    singleLine += code < 32 || code === 127 ? " " : char;
  }
  return singleLine.trim() || null;
}
function formatChildResultDataBlock(value) {
  return (
    wrapPromptDataBlock({
      label: "Child result",
      text: value,
    }) || "Child result: (no output)"
  );
}
function formatGeneratedMediaDirectiveLines(event) {
  const mediaUrls = Array.from(
    new Set(
      [...(event.mediaUrls ?? []), ...mediaUrlsFromGeneratedAttachments(event.attachments)]
        .map(sanitizeMediaDirectiveValue)
        .filter((value) => value !== null),
    ),
  );
  if (mediaUrls.length === 0) return [];
  return ["Generated media:", ...mediaUrls.map((mediaUrl) => `MEDIA:${mediaUrl}`)];
}
function formatTaskCompletionEvent(event, mode) {
  const sessionKey = sanitizeSingleLineField(event.childSessionKey, "unknown");
  const sessionId = sanitizeSingleLineField(event.childSessionId ?? "unknown", "unknown");
  const announceType = sanitizeSingleLineField(event.announceType, "unknown");
  const taskLabel = sanitizeSingleLineField(event.taskLabel, "unnamed task");
  const statusLabel = sanitizeSingleLineField(event.statusLabel, event.status);
  const result = formatChildResultDataBlock(event.result);
  const attachmentLines = formatGeneratedAttachmentLines(event.attachments);
  const mediaDirectiveLines = formatGeneratedMediaDirectiveLines(event);
  const lines =
    mode === "protected"
      ? ["[Internal task completion event]"]
      : [
          "A background task completed. Use this result to reply to the user in your normal assistant voice.",
          "",
        ];
  lines.push(
    `source: ${event.source}`,
    `session_key: ${sessionKey}`,
    `session_id: ${sessionId}`,
    `type: ${announceType}`,
    `task: ${taskLabel}`,
    `status: ${statusLabel}`,
    "",
    result,
  );
  if (attachmentLines.length > 0) lines.push("", ...attachmentLines);
  if (mediaDirectiveLines.length > 0) lines.push("", ...mediaDirectiveLines);
  if (event.statsLine?.trim()) lines.push("", sanitizeMultilineField(event.statsLine, ""));
  lines.push(
    "",
    mode === "protected" ? "Action:" : "Instruction:",
    sanitizeMultilineField(event.replyInstruction, ""),
  );
  return lines.join("\n");
}
/** Format internal runtime events for the protected runtime-context prompt block. */
function formatAgentInternalEventsForPrompt(events) {
  if (!events || events.length === 0) return "";
  const blocks = events
    .map((event) => {
      if (event.type === "task_completion") return formatTaskCompletionEvent(event, "protected");
      return "";
    })
    .filter((value) => value.trim().length > 0);
  if (blocks.length === 0) return "";
  return [
    INTERNAL_RUNTIME_CONTEXT_BEGIN,
    "OpenClaw runtime context (internal):",
    "This context is runtime-generated, not user-authored. Keep internal details private.",
    "",
    blocks.join("\n\n---\n\n"),
    INTERNAL_RUNTIME_CONTEXT_END,
  ].join("\n");
}
/** Format internal runtime events for plain prompts that lack context delimiters. */
function formatAgentInternalEventsForPlainPrompt(events) {
  if (!events || events.length === 0) return "";
  return events
    .map((event) => {
      if (event.type === "task_completion") return formatTaskCompletionEvent(event, "plain");
      return "";
    })
    .filter((value) => value.trim().length > 0)
    .join("\n\n---\n\n");
}
//#endregion
//#region src/shared/agent-run-status.ts
/**
 * Shared agent-run status predicates for gateway wait loops and delivery announcements.
 * Keep the status set aligned with the gateway protocol values that can still transition.
 */
/** Statuses that are not final and should keep waiters/subscribers attached. */
const NON_TERMINAL_AGENT_RUN_STATUSES = /* @__PURE__ */ new Set([
  "accepted",
  "started",
  "in_flight",
]);
/** Returns true for agent-run statuses that still need polling or live updates. */
function isNonTerminalAgentRunStatus(status) {
  return typeof status === "string" && NON_TERMINAL_AGENT_RUN_STATUSES.has(status);
}
//#endregion
//#region src/infra/outbound/bound-delivery-router.ts
function isActiveBinding(record) {
  return record.status === "active";
}
function resolveBindingForRequester(requester, bindings) {
  const matchingChannelAccount = bindings.filter((entry) => {
    const conversation = normalizeConversationRef(entry.conversation);
    return (
      conversation.channel === requester.channel && conversation.accountId === requester.accountId
    );
  });
  if (matchingChannelAccount.length === 0) return null;
  const exactConversation = matchingChannelAccount.find(
    (entry) =>
      normalizeConversationRef(entry.conversation).conversationId === requester.conversationId,
  );
  if (exactConversation) return exactConversation;
  if (matchingChannelAccount.length === 1) return matchingChannelAccount[0] ?? null;
  return null;
}
/** Creates a router that resolves task-completion delivery through active session bindings. */
function createBoundDeliveryRouter(service = getSessionBindingService()) {
  return {
    resolveDestination: (input) => {
      const targetSessionKey = input.targetSessionKey.trim();
      if (!targetSessionKey)
        return {
          binding: null,
          mode: "fallback",
          reason: "missing-target-session",
        };
      const activeBindings = service.listBySession(targetSessionKey).filter(isActiveBinding);
      if (activeBindings.length === 0)
        return {
          binding: null,
          mode: "fallback",
          reason: "no-active-binding",
        };
      if (!input.requester) {
        if (input.failClosed)
          return {
            binding: null,
            mode: "fallback",
            reason: "missing-requester",
          };
        if (activeBindings.length === 1)
          return {
            binding: activeBindings[0] ?? null,
            mode: "bound",
            reason: "single-active-binding",
          };
        return {
          binding: null,
          mode: "fallback",
          reason: "ambiguous-without-requester",
        };
      }
      const requester = normalizeConversationRef(input.requester);
      if (!requester.channel || !requester.conversationId)
        return {
          binding: null,
          mode: "fallback",
          reason: "invalid-requester",
        };
      const fromRequester = resolveBindingForRequester(requester, activeBindings);
      if (fromRequester)
        return {
          binding: fromRequester,
          mode: "bound",
          reason: "requester-match",
        };
      if (activeBindings.length === 1 && !input.failClosed)
        return {
          binding: activeBindings[0] ?? null,
          mode: "bound",
          reason: "single-active-binding-fallback",
        };
      return {
        binding: null,
        mode: "fallback",
        reason: "no-requester-match",
      };
    },
  };
}
//#endregion
//#region src/agents/subagent-announce-dispatch.ts
/** Converts a steer outcome into the shared delivery result shape. */
function mapSteerOutcomeToDeliveryResult(outcome) {
  if (outcome.status === "steered")
    return {
      delivered: true,
      path: "steered",
      deliveredAt: outcome.deliveredAt,
      enqueuedAt: outcome.enqueuedAt,
    };
  return {
    delivered: false,
    path: "none",
  };
}
/** Runs the ordered steer/direct announcement delivery strategy. */
async function runSubagentAnnounceDispatch(params) {
  const phases = [];
  const appendPhase = (phase, result) => {
    phases.push({
      phase,
      delivered: result.delivered,
      path: result.path,
      deliveredAt: result.deliveredAt,
      enqueuedAt: result.enqueuedAt,
      ...(result.reason ? { reason: result.reason } : {}),
      error: result.error,
    });
  };
  const withPhases = (result) => ({
    ...result,
    phases,
  });
  if (params.signal?.aborted)
    return withPhases({
      delivered: false,
      path: "none",
    });
  if (!params.expectsCompletionMessage) {
    const primarySteerOutcome = await params.steer();
    const primarySteer = mapSteerOutcomeToDeliveryResult(primarySteerOutcome);
    appendPhase("steer-primary", primarySteer);
    if (primarySteer.delivered) return withPhases(primarySteer);
    if (primarySteerOutcome.status === "dropped") return withPhases(primarySteer);
    const primaryDirect = await params.direct();
    appendPhase("direct-primary", primaryDirect);
    return withPhases(primaryDirect);
  }
  const primaryDirect = await params.direct();
  appendPhase("direct-primary", primaryDirect);
  if (primaryDirect.delivered || primaryDirect.terminal) return withPhases(primaryDirect);
  if (params.signal?.aborted) return withPhases(primaryDirect);
  const fallbackSteer = mapSteerOutcomeToDeliveryResult(await params.steer());
  appendPhase("steer-fallback", fallbackSteer);
  if (fallbackSteer.delivered) return withPhases(fallbackSteer);
  return withPhases(primaryDirect);
}
//#endregion
//#region src/agents/subagent-requester-store-key.ts
/**
 * Subagent requester store-key normalization.
 *
 * Converts raw requester session keys into the canonical registry key shape.
 */
/** Resolve the canonical store key for a subagent requester session. */
function resolveRequesterStoreKey(cfg, requesterSessionKey) {
  const raw = (requesterSessionKey ?? "").trim();
  if (!raw) return raw;
  if (raw === "global" || raw === "unknown") return raw;
  if (raw.startsWith("agent:")) return raw;
  const mainKey = normalizeMainKey(cfg?.session?.mainKey);
  if (raw === "main" || raw === mainKey) return resolveMainSessionKey(cfg);
  return `agent:${resolveAgentIdFromSessionKey(raw)}:${raw}`;
}
//#endregion
//#region src/agents/subagent-announce-delivery.ts
/**
 * Subagent completion announcement delivery.
 *
 * Routes completion payloads through gateway/channel/session paths and records delivery evidence.
 */
const DEFAULT_SUBAGENT_ANNOUNCE_TIMEOUT_MS = 12e4;
let subagentAnnounceDeliveryDeps = {
  dispatchGatewayMethodInProcess,
  getRuntimeConfig,
  getRequesterSessionActivity: (requesterSessionKey) => {
    const sessionId =
      resolveActiveEmbeddedRunSessionId(requesterSessionKey) ??
      loadRequesterSessionEntry(requesterSessionKey).entry?.sessionId;
    return {
      sessionId,
      isActive: Boolean(sessionId && isEmbeddedAgentRunActive(sessionId)),
    };
  },
  isRequesterSessionAbandoned: (requesterSessionKey, sessionId) =>
    isEmbeddedRunAbandoned({
      sessionKey: requesterSessionKey,
      sessionId,
    }),
  loadRequesterSessionEntry,
  queueEmbeddedAgentMessageWithOutcome: queueEmbeddedAgentMessageWithOutcomeAsync,
  sendMessage,
};
async function resolveQueueEmbeddedAgentMessageOutcome(sessionId, text, options) {
  return await subagentAnnounceDeliveryDeps.queueEmbeddedAgentMessageWithOutcome(
    sessionId,
    text,
    options,
  );
}
async function runAnnounceAgentCall(params) {
  return await subagentAnnounceDeliveryDeps.dispatchGatewayMethodInProcess(
    "agent",
    params.agentParams,
    {
      allowSyntheticCronRunContinuation: params.cronRunContinuation,
      expectFinal: params.expectFinal,
      forceSyntheticClient:
        params.cronRunContinuation === true ||
        shouldPreserveUserFacingSessionStateForInputProvenance(params.agentParams.inputProvenance),
      timeoutMs: params.timeoutMs,
    },
  );
}
function formatQueueWakeFailureError(fallback, outcome) {
  const summary = formatEmbeddedAgentQueueFailureSummary(outcome);
  return summary ? `${fallback}: ${summary}` : fallback;
}
function resolveBoundConversationOrigin(params) {
  const conversation = params.bindingConversation;
  const conversationId = conversation.conversationId?.trim() ?? "";
  const parentConversationId = conversation.parentConversationId?.trim() ?? "";
  const requesterConversationId = params.requesterConversation?.conversationId?.trim() ?? "";
  const requesterTo = params.requesterOrigin?.to?.trim();
  if (
    conversation.channel === "matrix" &&
    parentConversationId &&
    requesterConversationId &&
    parentConversationId === requesterConversationId &&
    requesterTo
  )
    return {
      channel: conversation.channel,
      accountId: conversation.accountId,
      to: requesterTo,
      ...(conversationId ? { threadId: conversationId } : {}),
    };
  const boundTarget = routeToDeliveryFields(routeFromConversationRef(conversation));
  const inferredThreadId =
    boundTarget.threadId ??
    (parentConversationId && parentConversationId !== conversationId ? conversationId : void 0) ??
    (params.requesterOrigin?.threadId != null && params.requesterOrigin.threadId !== ""
      ? stringifyRouteThreadId(params.requesterOrigin.threadId)
      : void 0);
  if (
    requesterTo &&
    conversationId &&
    requesterConversationId &&
    conversationId.toLowerCase() === requesterConversationId.toLowerCase()
  )
    return {
      channel: conversation.channel,
      accountId: conversation.accountId,
      to: requesterTo,
      threadId: inferredThreadId,
    };
  return {
    channel: conversation.channel,
    accountId: conversation.accountId,
    to: boundTarget.to,
    threadId: inferredThreadId,
  };
}
function resolveRequesterSessionActivity(requesterSessionKey) {
  const activity = subagentAnnounceDeliveryDeps.getRequesterSessionActivity(requesterSessionKey);
  if (activity.sessionId || activity.isActive) return activity;
  const { entry } = loadRequesterSessionEntry(requesterSessionKey);
  const sessionId = entry?.sessionId;
  return {
    sessionId,
    isActive: Boolean(sessionId && isEmbeddedAgentRunActive(sessionId)),
  };
}
function resolveDirectAnnounceTransientRetryDelaysMs() {
  return process.env.OPENCLAW_TEST_FAST === "1" ? [8, 16, 32] : [5e3, 1e4, 2e4];
}
function resolveCompactionSteerRetryDelaysMs() {
  return process.env.OPENCLAW_TEST_FAST === "1" ? [8, 16, 32, 64] : [1e3, 2e3, 4e3, 8e3];
}
async function resolveActiveWakeWithRetries(sessionId, message, wakeOptions, signal) {
  const compactionDeadlineMs =
    typeof wakeOptions.deliveryTimeoutMs === "number" && wakeOptions.deliveryTimeoutMs > 0
      ? Date.now() + wakeOptions.deliveryTimeoutMs
      : void 0;
  let currentOptions = wakeOptions;
  const resolveRetryOptions = () => {
    if (compactionDeadlineMs === void 0) return currentOptions;
    const remainingDeliveryTimeoutMs = compactionDeadlineMs - Date.now();
    if (remainingDeliveryTimeoutMs <= 0) return;
    return {
      ...currentOptions,
      deliveryTimeoutMs: remainingDeliveryTimeoutMs,
    };
  };
  let outcome = await resolveQueueEmbeddedAgentMessageOutcome(sessionId, message, currentOptions);
  const compactionRetryDelaysMs = resolveCompactionSteerRetryDelaysMs();
  let compactionRetryIndex = 0;
  for (;;) {
    if (outcome.queued || signal?.aborted) break;
    if (
      outcome.reason === "transcript_commit_wait_unsupported" &&
      currentOptions.waitForTranscriptCommit === true
    ) {
      const bestEffortOptions = { ...currentOptions };
      delete bestEffortOptions.waitForTranscriptCommit;
      currentOptions = bestEffortOptions;
      outcome = await resolveQueueEmbeddedAgentMessageOutcome(sessionId, message, currentOptions);
      continue;
    }
    if (
      outcome.reason === "source_reply_delivery_mode_mismatch" &&
      currentOptions.sourceReplyDeliveryMode !== void 0
    ) {
      const activeRunOptions = { ...currentOptions };
      delete activeRunOptions.sourceReplyDeliveryMode;
      currentOptions = activeRunOptions;
      outcome = await resolveQueueEmbeddedAgentMessageOutcome(sessionId, message, currentOptions);
      continue;
    }
    if (outcome.reason === "compacting") {
      const remainingDeliveryTimeoutMs =
        compactionDeadlineMs === void 0 ? void 0 : compactionDeadlineMs - Date.now();
      if (
        !(remainingDeliveryTimeoutMs === void 0
          ? compactionRetryIndex < compactionRetryDelaysMs.length
          : remainingDeliveryTimeoutMs > 0)
      )
        break;
      const scheduledDelayMs =
        compactionRetryDelaysMs[
          Math.min(compactionRetryIndex, compactionRetryDelaysMs.length - 1)
        ] ?? 0;
      const delayMs =
        remainingDeliveryTimeoutMs === void 0
          ? scheduledDelayMs
          : Math.min(scheduledDelayMs, remainingDeliveryTimeoutMs);
      if (delayMs <= 0 && remainingDeliveryTimeoutMs !== void 0) break;
      await waitForAnnounceRetryDelay(delayMs, signal);
      if (signal?.aborted) break;
      compactionRetryIndex += 1;
      const retryOptions = resolveRetryOptions();
      if (!retryOptions) break;
      outcome = await resolveQueueEmbeddedAgentMessageOutcome(sessionId, message, retryOptions);
      continue;
    }
    break;
  }
  return outcome;
}
function resolveSubagentAnnounceTimeoutMs(cfg) {
  const configured = cfg.agents?.defaults?.subagents?.announceTimeoutMs;
  return clampTimerTimeoutMs(configured) ?? DEFAULT_SUBAGENT_ANNOUNCE_TIMEOUT_MS;
}
function isInternalAnnounceRequesterSession(sessionKey) {
  return getSubagentDepthFromSessionStore(sessionKey) >= 1 || isCronSessionKey(sessionKey);
}
function summarizeDeliveryError(error) {
  if (error instanceof Error) return error.message || "error";
  if (typeof error === "string") return error;
  if (error === void 0 || error === null) return "unknown error";
  try {
    return JSON.stringify(error);
  } catch {
    return "error";
  }
}
const TRANSIENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS = [
  /\berrorcode=unavailable\b/i,
  /\bstatus\s*[:=]\s*"?unavailable\b/i,
  /\bUNAVAILABLE\b/,
  /no active .* listener/i,
  /gateway not connected/i,
  /gateway closed \(1006/i,
  /gateway timeout/i,
  /\ball models failed\b/i,
  /\ball profiles unavailable\b/i,
  /\boverloaded\b/i,
  /\b(econnreset|econnrefused|etimedout|enotfound|ehostunreach|network error)\b/i,
];
const SESSION_FILE_CHANGED_ANNOUNCE_RE =
  /session file changed while embedded prompt lock was released/i;
const PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS = [
  /unsupported channel/i,
  /unknown channel/i,
  /chat not found/i,
  /user not found/i,
  /bot.*not.*member/i,
  /bot was blocked by the user/i,
  /forbidden: bot was kicked/i,
  /recipient is not a valid/i,
  /outbound not configured for channel/i,
  SESSION_FILE_CHANGED_ANNOUNCE_RE,
];
function isSessionFileChangedAnnounceError(message) {
  return SESSION_FILE_CHANGED_ANNOUNCE_RE.test(message);
}
const ANNOUNCE_ERROR_CHAIN_KEYS = ["cause", "cleanupError", "error", "promptError", "reason"];
function isAnnounceErrorRecord(error) {
  return Boolean(error && typeof error === "object");
}
function hasAnnounceErrorMatch(error, matches, seen = /* @__PURE__ */ new Set()) {
  if (matches(error)) return true;
  if (!isAnnounceErrorRecord(error)) return false;
  if (seen.has(error)) return false;
  seen.add(error);
  return ANNOUNCE_ERROR_CHAIN_KEYS.some((key) => hasAnnounceErrorMatch(error[key], matches, seen));
}
function hasSessionFileChangedAnnounceError(error) {
  return hasAnnounceErrorMatch(error, (candidate) =>
    isSessionFileChangedAnnounceError(summarizeDeliveryError(candidate)),
  );
}
function isTransientAnnounceDeliveryError(error) {
  const message = summarizeDeliveryError(error);
  const topLevelPermanent = Boolean(
    message && PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((re) => re.test(message)),
  );
  if (topLevelPermanent && !isSessionFileChangedAnnounceError(message)) return false;
  if (hasSessionFileChangedAnnounceError(error)) return !hasAnnounceSendEvidence(error);
  if (
    hasAnnounceErrorMatch(
      error,
      (candidate) =>
        Boolean(candidate && typeof candidate === "object") &&
        candidate.gatewayCode === "UNAVAILABLE" &&
        /cron run continuation/i.test(summarizeDeliveryError(candidate)),
    )
  )
    return true;
  if (!message) return false;
  if (topLevelPermanent) return false;
  return TRANSIENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((re) => re.test(message));
}
function isPermanentAnnounceDeliveryError(error) {
  const message = summarizeDeliveryError(error);
  return (
    (message && PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((re) => re.test(message))) ||
    hasSessionFileChangedAnnounceError(error)
  );
}
function isIncompleteAnnounceAgentResultError(error) {
  const message = summarizeDeliveryError(error);
  return /(?:incomplete terminal response|code=incomplete_result)\b/i.test(message);
}
function isSessionWriteLockAnnounceAgentError(error) {
  if (isSessionWriteLockAcquireError(error)) return true;
  const message = summarizeDeliveryError(error);
  return (
    /\bSessionWriteLock(?:Timeout|Stale)Error\b/.test(message) ||
    /\bsession file lock(?:ed| stale)\b/i.test(message)
  );
}
function hasDirectAnnounceSendEvidence(error) {
  if (isOutboundDeliveryError(error) && error.sentBeforeError) return true;
  if (!isAnnounceErrorRecord(error)) return false;
  return error.sentBeforeError === true || error.visibleReplySent === true;
}
function hasAnnounceSendEvidence(error) {
  return hasAnnounceErrorMatch(error, hasDirectAnnounceSendEvidence);
}
async function waitForAnnounceRetryDelay(ms, signal) {
  if (ms <= 0) return;
  if (!signal) {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
    return;
  }
  if (signal.aborted) return;
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      resolve();
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
function readCronRunContinuation(params) {
  const entry = subagentAnnounceDeliveryDeps.loadRequesterSessionEntry(params.sessionKey).entry;
  const lifecycleRevision = entry?.cronRunContinuation?.lifecycleRevision;
  if (
    !lifecycleRevision ||
    (params.expectedLifecycleRevision !== void 0 &&
      lifecycleRevision !== params.expectedLifecycleRevision)
  )
    return;
  const sessionId = entry?.sessionId?.trim();
  return sessionId
    ? {
        lifecycleRevision,
        sessionId,
      }
    : void 0;
}
function cronRunContinuationLostError(message) {
  const error = new Error(message);
  error.cronRunContinuationLost = true;
  return error;
}
function isCronRunContinuationLostError(error) {
  return hasAnnounceErrorMatch(error, (candidate) => {
    if (!candidate || typeof candidate !== "object") return false;
    if (candidate.cronRunContinuationLost === true) return true;
    return (
      candidate.gatewayCode === "INVALID_REQUEST" &&
      /cron run continuation (?:owner was lost|base session was not persisted)/i.test(
        summarizeDeliveryError(candidate),
      )
    );
  });
}
async function runAnnounceDeliveryWithRetry(params) {
  const retryDelaysMs = resolveDirectAnnounceTransientRetryDelaysMs();
  for (const [retryIndex, delayMs] of retryDelaysMs.entries()) {
    if (params.signal?.aborted) throw new Error("announce delivery aborted");
    try {
      return await params.run();
    } catch (err) {
      if (!isTransientAnnounceDeliveryError(err) || params.signal?.aborted) throw err;
      const nextAttempt = retryIndex + 2;
      const maxAttempts = retryDelaysMs.length + 1;
      defaultRuntime.log(
        `[warn] Subagent announce ${params.operation} transient failure, retrying ${nextAttempt}/${maxAttempts} in ${Math.round(delayMs / 1e3)}s: ${summarizeDeliveryError(err)}`,
      );
      await waitForAnnounceRetryDelay(delayMs, params.signal);
    }
  }
  if (params.signal?.aborted) throw new Error("announce delivery aborted");
  return await params.run();
}
async function resolveSubagentCompletionOrigin(params) {
  const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
  const channel = normalizeOptionalLowercaseString(requesterOrigin?.channel);
  const to = requesterOrigin?.to?.trim();
  const accountId = normalizeAccountId(requesterOrigin?.accountId);
  const conversationId =
    stringifyRouteThreadId(
      requesterOrigin?.threadId != null && requesterOrigin.threadId !== ""
        ? requesterOrigin.threadId
        : void 0,
    ) ||
    resolveConversationIdFromTargets({ targets: [to] }) ||
    "";
  const requesterConversation =
    channel && conversationId
      ? {
          channel,
          accountId,
          conversationId,
        }
      : void 0;
  const router = createBoundDeliveryRouter();
  const requesterRoute = router.resolveDestination({
    eventKind: "task_completion",
    targetSessionKey: params.requesterSessionKey,
    requester: requesterConversation,
    failClosed: true,
  });
  if (requesterRoute.mode === "bound" && requesterRoute.binding)
    return mergeDeliveryContext(
      resolveBoundConversationOrigin({
        bindingConversation: requesterRoute.binding.conversation,
        requesterConversation,
        requesterOrigin,
      }),
      requesterOrigin,
    );
  const childRoute = router.resolveDestination({
    eventKind: "task_completion",
    targetSessionKey: params.childSessionKey,
    requester: requesterConversation,
    failClosed: true,
  });
  if (childRoute.mode === "bound" && childRoute.binding)
    return mergeDeliveryContext(
      resolveBoundConversationOrigin({
        bindingConversation: childRoute.binding.conversation,
        requesterConversation,
        requesterOrigin,
      }),
      requesterOrigin,
    );
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("subagent_delivery_target")) return requesterOrigin;
  try {
    const hookOrigin = normalizeDeliveryContext(
      (
        await hookRunner.runSubagentDeliveryTarget(
          {
            childSessionKey: params.childSessionKey,
            requesterSessionKey: params.requesterSessionKey,
            requesterOrigin,
            childRunId: params.childRunId,
            spawnMode: params.spawnMode,
            expectsCompletionMessage: params.expectsCompletionMessage,
          },
          {
            runId: params.childRunId,
            childSessionKey: params.childSessionKey,
            requesterSessionKey: params.requesterSessionKey,
          },
        )
      )?.origin,
    );
    if (!hookOrigin) return requesterOrigin;
    if (hookOrigin.channel && isInternalMessageChannel(hookOrigin.channel)) return requesterOrigin;
    return mergeDeliveryContext(hookOrigin, requesterOrigin);
  } catch {
    return requesterOrigin;
  }
}
function loadRequesterSessionEntry(requesterSessionKey) {
  const cfg = subagentAnnounceDeliveryDeps.getRuntimeConfig();
  const canonicalKey = resolveRequesterStoreKey(cfg, requesterSessionKey);
  const agentId = resolveAgentIdFromSessionKey(canonicalKey);
  return {
    cfg,
    entry: loadSessionEntry({
      storePath: resolveStorePath(cfg.session?.store, { agentId }),
      sessionKey: canonicalKey,
      clone: false,
    }),
    canonicalKey,
  };
}
function loadSessionEntryByKey(sessionKey) {
  const cfg = subagentAnnounceDeliveryDeps.getRuntimeConfig();
  const agentId = resolveAgentIdFromSessionKey(sessionKey);
  return loadSessionEntry({
    storePath: resolveStorePath(cfg.session?.store, { agentId }),
    sessionKey,
    clone: false,
  });
}
async function maybeSteerSubagentAnnounce(params) {
  if (params.signal?.aborted) return { status: "none" };
  const { cfg, entry } = loadRequesterSessionEntry(params.requesterSessionKey);
  const canonicalKey = resolveRequesterStoreKey(cfg, params.requesterSessionKey);
  const { sessionId, isActive } = resolveRequesterSessionActivity(canonicalKey);
  if (subagentAnnounceDeliveryDeps.isRequesterSessionAbandoned(canonicalKey, sessionId))
    return { status: "none" };
  if (!sessionId || !isActive) return { status: "none" };
  const queueSettings = resolveQueueSettings({
    cfg,
    channel: entry?.channel ?? entry?.lastChannel ?? entry?.origin?.provider,
    sessionEntry: entry,
  });
  const queueOptions = {
    deliveryTimeoutMs: params.deliveryTimeoutMs,
    steeringMode: "all",
    ...(queueSettings.debounceMs !== void 0 ? { debounceMs: queueSettings.debounceMs } : {}),
    waitForTranscriptCommit: true,
  };
  const queueOutcome = await resolveActiveWakeWithRetries(
    sessionId,
    params.steerMessage,
    queueOptions,
    params.signal,
  );
  if (queueOutcome.queued)
    return {
      status: "steered",
      deliveredAt: queueOutcome.deliveredAtMs,
      enqueuedAt: queueOutcome.enqueuedAtMs,
    };
  if (queueOutcome.reason === "stale_run") return { status: "none" };
  return { status: resolveRequesterSessionActivity(canonicalKey).isActive ? "dropped" : "none" };
}
function hasVisibleGatewayAgentPayload(response) {
  const result = getGatewayAgentResult(response);
  return Boolean(
    result && (hasVisibleAgentPayload(result) || hasMessagingToolDeliveryEvidence(result)),
  );
}
function hasVisibleNonSilentGatewayAgentPayload(response) {
  const result = getGatewayAgentResult(response);
  if (!result) return false;
  if (hasMessagingToolDeliveryEvidence(result)) return true;
  return (Array.isArray(result.payloads) ? result.payloads : []).some(
    isVisibleNonSilentGatewayAgentPayload,
  );
}
function isVisibleNonSilentGatewayAgentPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const record = payload;
  if (
    record.mediaUrl ||
    (Array.isArray(record.mediaUrls) && record.mediaUrls.length > 0) ||
    record.presentation ||
    record.interactive ||
    record.channelData
  )
    return true;
  return (
    typeof record.text === "string" &&
    record.text.trim() !== "" &&
    !isSilentReplyPayloadText(record.text, "NO_REPLY")
  );
}
function hasGatewayAgentMessagingToolDeliveryEvidence(response) {
  const result = getGatewayAgentResult(response);
  return Boolean(result && hasMessagingToolDeliveryEvidence(result));
}
function hasGatewayAgentCompletionSideEffectEvidence(response) {
  const result = getGatewayAgentResult(response);
  if (!result) return false;
  return (
    hasMessagingToolDeliveryEvidence(result) ||
    (Array.isArray(result.acceptedSessionSpawns) &&
      hasAcceptedSessionSpawn(result.acceptedSessionSpawns)) ||
    hasPositiveDeliveryCount(result.successfulCronAdds)
  );
}
function hasIntentionalSilentGatewayAgentPayload(response) {
  const result = getGatewayAgentResult(response);
  if (!result || !Array.isArray(result.payloads)) return false;
  return result.payloads.some(isIntentionalSilentGatewayAgentPayload);
}
function isIntentionalSilentGatewayAgentPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const record = payload;
  if (typeof record.text !== "string" || !isSilentReplyPayloadText(record.text, "NO_REPLY"))
    return false;
  return !(
    record.mediaUrl ||
    (Array.isArray(record.mediaUrls) && record.mediaUrls.length > 0) ||
    record.presentation ||
    record.interactive ||
    record.channelData
  );
}
function hasPositiveDeliveryCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function requiresAgentMediatedCompletionDelivery(params) {
  return params.expectsCompletionMessage && isAgentMediatedCompletionSourceTool(params.sourceTool);
}
function collectExpectedMediaFromInternalEvents(events) {
  if (!events?.length) return [];
  const mediaUrls = [];
  const seen = /* @__PURE__ */ new Set();
  for (const event of events) {
    const values = [
      ...(Array.isArray(event.mediaUrls) ? event.mediaUrls : []),
      ...mediaUrlsFromGeneratedAttachments(event.attachments),
    ];
    for (const value of values) {
      const normalized = typeof value === "string" ? value.trim() : "";
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      mediaUrls.push(normalized);
    }
  }
  return mediaUrls;
}
function getGatewayAgentCommandDeliveryFailure(response) {
  const result = getGatewayAgentResult(response);
  return result ? getAgentCommandDeliveryFailure(result) : void 0;
}
function isGatewayAgentRunPending(response) {
  if (!response || typeof response !== "object") return false;
  const status = response.status;
  return isNonTerminalAgentRunStatus(status);
}
function resolveGeneratedMediaCompletionLabel(params) {
  const sourceTool = params.sourceTool?.trim();
  if (sourceTool === "image_generate") return "image";
  if (sourceTool === "music_generate") return "music";
  if (sourceTool === "video_generate") return "video";
  const announceType = params.internalEvents
    ?.find((event) => event.type === "task_completion")
    ?.announceType?.trim()
    .toLowerCase();
  if (announceType?.includes("image")) return "image";
  if (announceType?.includes("music") || announceType?.includes("audio")) return "music";
  if (announceType?.includes("video")) return "video";
  return "media";
}
async function deliverGeneratedMediaCompletionDirect(params) {
  if (
    !params.deliveryTarget.deliver ||
    !params.deliveryTarget.channel ||
    !params.deliveryTarget.to ||
    params.mediaUrls.length === 0
  )
    return;
  const mediaLabel = resolveGeneratedMediaCompletionLabel({
    sourceTool: params.sourceTool,
    internalEvents: params.internalEvents,
  });
  const agentId = resolveAgentIdFromSessionKey(params.requesterSessionKey);
  const idempotencyKey = `${params.directIdempotencyKey}:generated-media-direct`;
  try {
    await subagentAnnounceDeliveryDeps.sendMessage({
      cfg: params.cfg,
      channel: params.deliveryTarget.channel,
      to: params.deliveryTarget.to,
      accountId: params.deliveryTarget.accountId,
      threadId: params.deliveryTarget.threadId,
      requesterSessionKey: params.requesterSessionKey,
      agentId,
      content: `The generated ${mediaLabel} is ready.`,
      mediaUrls: Array.from(params.mediaUrls),
      idempotencyKey,
      mirror: {
        sessionKey: params.requesterSessionKey,
        agentId,
        idempotencyKey,
      },
    });
    return {
      delivered: true,
      path: "direct",
    };
  } catch (err) {
    const terminal = hasAnnounceSendEvidence(err);
    return {
      delivered: false,
      path: "direct",
      error: `generated media direct delivery failed: ${summarizeDeliveryError(err)}`,
      ...(terminal ? { terminal: true } : {}),
    };
  }
}
function inferDeliveryTargetChatType(target) {
  const normalizedTo = normalizeOptionalLowercaseString(target.to);
  if (!normalizedTo) return;
  if (
    normalizedTo.startsWith("dm:") ||
    normalizedTo.startsWith("direct:") ||
    normalizedTo.startsWith("user:") ||
    normalizedTo.includes(":dm:") ||
    normalizedTo.includes(":direct:")
  )
    return "direct";
  if (normalizedTo.startsWith("channel:") || normalizedTo.startsWith("thread:")) return "channel";
  if (normalizedTo.startsWith("group:")) return "group";
  const channel = normalizeMessageChannel(target.channel);
  return channel
    ? getLoadedChannelPluginForRead(channel)?.messaging?.inferTargetChatType?.({
        to: target.to ?? "",
      })
    : void 0;
}
function isDirectMessageDeliveryTarget(target, requesterSessionKey) {
  if (target.threadId) return false;
  const targetChatType = inferDeliveryTargetChatType(target);
  if (targetChatType) return targetChatType === "direct";
  return deriveSessionChatTypeFromKey(requesterSessionKey) === "direct";
}
function resolveTextCompletionDirectFallback(events) {
  for (let index = (events?.length ?? 0) - 1; index >= 0; index -= 1) {
    const event = events?.[index];
    if (event?.type !== "task_completion" || event.source !== "subagent") continue;
    if (event.status !== "ok") continue;
    const result = typeof event.result === "string" ? event.result.trim() : "";
    if (result && result !== "(no output)") return result;
  }
}
function hasFailedSubagentNoOutputCompletion(events) {
  return (
    events?.some(
      (event) =>
        event.type === "task_completion" &&
        event.source === "subagent" &&
        event.status !== "ok" &&
        event.result.trim() === "(no output)",
    ) === true
  );
}
async function deliverTextCompletionDirect(params) {
  const content = resolveTextCompletionDirectFallback(params.internalEvents);
  if (
    !content ||
    !params.deliveryTarget.deliver ||
    !params.deliveryTarget.channel ||
    !params.deliveryTarget.to ||
    !isDirectMessageDeliveryTarget(params.deliveryTarget, params.requesterSessionKey)
  )
    return;
  const agentId = resolveAgentIdFromSessionKey(params.requesterSessionKey);
  const idempotencyKey = `${params.directIdempotencyKey}:text-direct`;
  try {
    await subagentAnnounceDeliveryDeps.sendMessage({
      cfg: params.cfg,
      channel: params.deliveryTarget.channel,
      to: params.deliveryTarget.to,
      accountId: params.deliveryTarget.accountId,
      threadId: params.deliveryTarget.threadId,
      requesterSessionKey: params.requesterSessionKey,
      agentId,
      conversationType: "direct",
      content,
      idempotencyKey,
      mirror: {
        sessionKey: params.requesterSessionKey,
        agentId,
        idempotencyKey,
      },
    });
    return {
      delivered: true,
      path: "direct",
    };
  } catch (err) {
    return {
      delivered: false,
      path: "direct",
      error: `text completion direct delivery failed: ${summarizeDeliveryError(err)}`,
    };
  }
}
function resolveGeneratedMediaDirectFallbackUrls(params) {
  const expected = uniqueStrings(normalizeStringEntries(params.expectedMediaUrls));
  const result = getGatewayAgentResult(params.announceResponse);
  if (!result) return expected;
  const delivered = new Set(
    params.requiresMessageToolDelivery
      ? collectMessagingToolDeliveredMediaUrlsForTarget(result, params.deliveryTarget)
      : collectAutomaticCompletionDeliveredMediaUrls({
          result,
          deliveryTarget: params.deliveryTarget,
          automaticDeliveryRequested: params.automaticDeliveryRequested,
          automaticDeliveryFailed: params.automaticDeliveryFailed === true,
        }),
  );
  return expected.filter((url) => !delivered.has(url));
}
function collectAutomaticCompletionDeliveredMediaUrls(params) {
  const urls = /* @__PURE__ */ new Set();
  const addUrls = (values) => {
    for (const value of values) if (value.trim()) urls.add(value);
  };
  if (params.automaticDeliveryRequested) {
    if (params.automaticDeliveryFailed)
      addUrls(
        collectPayloadOutcomeDeliveredMediaUrls(params.result, {
          countAmbiguousSinglePayloadFailure: true,
        }),
      );
    else if (hasPayloadDeliveryOutcomes(params.result))
      addUrls(
        collectPayloadOutcomeDeliveredMediaUrls(params.result, {
          countAmbiguousSinglePayloadFailure: false,
        }),
      );
    else if (!hasSuppressedPayloadDeliveryStatus(params.result))
      addUrls(collectPayloadMediaUrls(params.result));
  }
  addUrls(collectMessagingToolDeliveredMediaUrlsForTarget(params.result, params.deliveryTarget));
  return Array.from(urls);
}
function collectPayloadMediaUrls(result) {
  return collectDeliveredMediaUrls({
    payloads: Array.isArray(result.payloads) ? result.payloads : [],
  });
}
function getPayloadDeliveryStatusRecord(result) {
  return result.deliveryStatus && typeof result.deliveryStatus === "object"
    ? result.deliveryStatus
    : void 0;
}
function hasPayloadDeliveryOutcomes(result) {
  return Array.isArray(getPayloadDeliveryStatusRecord(result)?.payloadOutcomes);
}
function hasSuppressedPayloadDeliveryStatus(result) {
  return (
    normalizeOptionalLowercaseString(getPayloadDeliveryStatusRecord(result)?.status) ===
    "suppressed"
  );
}
function collectPayloadOutcomeDeliveredMediaUrls(result, options) {
  const payloads = Array.isArray(result.payloads) ? result.payloads : [];
  const deliveryStatus = getPayloadDeliveryStatusRecord(result);
  const payloadOutcomes = Array.isArray(deliveryStatus?.payloadOutcomes)
    ? deliveryStatus.payloadOutcomes
    : [];
  const urls = /* @__PURE__ */ new Set();
  for (const outcome of payloadOutcomes) {
    if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) continue;
    const record = outcome;
    const status = normalizeOptionalLowercaseString(record.status);
    const ambiguousSinglePayloadFailure =
      status === "failed" &&
      record.sentBeforeError === true &&
      options.countAmbiguousSinglePayloadFailure &&
      payloadOutcomes.length === 1 &&
      payloads.length === 1;
    if (status !== "sent" && !ambiguousSinglePayloadFailure) continue;
    const index =
      typeof record.index === "number" && Number.isInteger(record.index) ? record.index : void 0;
    const payload = index === void 0 ? void 0 : payloads[index];
    if (!payload) continue;
    for (const url of collectDeliveredMediaUrls({ payloads: [payload] })) urls.add(url);
  }
  return Array.from(urls);
}
function collectMessagingToolDeliveredMediaUrlsForTarget(result, deliveryTarget) {
  const targets = Array.isArray(result.messagingToolSentTargets)
    ? result.messagingToolSentTargets
    : [];
  const urls = /* @__PURE__ */ new Set();
  const targetedUrls = /* @__PURE__ */ new Set();
  for (const target of targets) {
    const targetMediaUrls = collectMessagingToolDeliveredMediaUrls({
      messagingToolSentTargets: [target],
    });
    if (!target || typeof target !== "object" || Array.isArray(target)) continue;
    const targetRecord = target;
    if (!(typeof targetRecord.to === "string" ? targetRecord.to.trim() : "")) {
      if (
        !deliveryTarget.to ||
        !sourceDeliveryTargetsMatch(
          {
            ...targetRecord,
            to: deliveryTarget.to,
          },
          deliveryTarget,
        )
      ) {
        for (const url of targetMediaUrls) targetedUrls.add(url);
        continue;
      }
      for (const url of targetMediaUrls) urls.add(url);
      continue;
    }
    for (const url of targetMediaUrls) targetedUrls.add(url);
    if (!sourceDeliveryTargetsMatch(targetRecord, deliveryTarget)) continue;
    for (const url of targetMediaUrls) urls.add(url);
  }
  for (const url of collectMessagingToolDeliveredMediaUrls({
    messagingToolSentMediaUrls: result.messagingToolSentMediaUrls,
  }))
    if (!targetedUrls.has(url)) urls.add(url);
  return Array.from(urls);
}
function stripNonDeliverableChannelForCompletionOrigin(context) {
  const normalized = normalizeDeliveryContext(context);
  if (!normalized?.channel) return normalized;
  const channel = normalizeMessageChannel(normalized.channel);
  if (!channel || isDeliverableMessageChannel(channel)) return normalized;
  const { channel: _channel, ...rest } = normalized;
  return normalizeDeliveryContext(rest);
}
async function sendSubagentAnnounceDirectly(params) {
  if (params.signal?.aborted)
    return {
      delivered: false,
      path: "none",
    };
  const cfg = subagentAnnounceDeliveryDeps.getRuntimeConfig();
  const announceTimeoutMs = resolveSubagentAnnounceTimeoutMs(cfg);
  const canonicalRequesterSessionKey = resolveRequesterStoreKey(
    cfg,
    params.targetRequesterSessionKey,
  );
  try {
    const completionDirectOrigin = normalizeDeliveryContext(params.completionDirectOrigin);
    const directOrigin = normalizeDeliveryContext(params.directOrigin);
    const requesterSessionOrigin = normalizeDeliveryContext(params.requesterSessionOrigin);
    const externalCompletionDirectOrigin =
      stripNonDeliverableChannelForCompletionOrigin(completionDirectOrigin);
    const completionExternalFallbackOrigin = mergeDeliveryContext(
      directOrigin,
      requesterSessionOrigin,
    );
    const effectiveDirectOrigin = params.expectsCompletionMessage
      ? mergeDeliveryContext(externalCompletionDirectOrigin, completionExternalFallbackOrigin)
      : directOrigin;
    const sessionOnlyOrigin = effectiveDirectOrigin?.channel
      ? effectiveDirectOrigin
      : requesterSessionOrigin;
    const requesterEntry = subagentAnnounceDeliveryDeps.loadRequesterSessionEntry(
      params.targetRequesterSessionKey,
    ).entry;
    const deliveryTarget = !params.requesterIsSubagent
      ? resolveExternalBestEffortDeliveryTarget({
          channel: effectiveDirectOrigin?.channel,
          to: effectiveDirectOrigin?.to,
          accountId: effectiveDirectOrigin?.accountId,
          threadId: effectiveDirectOrigin?.threadId,
        })
      : { deliver: false };
    const normalizedSessionOnlyOriginChannel = !params.requesterIsSubagent
      ? normalizeMessageChannel(sessionOnlyOrigin?.channel)
      : void 0;
    const sessionOnlyOriginChannel =
      normalizedSessionOnlyOriginChannel &&
      isGatewayMessageChannel(normalizedSessionOnlyOriginChannel)
        ? normalizedSessionOnlyOriginChannel
        : void 0;
    const sourceToolId =
      normalizeOptionalLowercaseString(params.sourceTool) ??
      (params.expectsCompletionMessage ? "subagent_announce" : "");
    const isSubagentCompletion = sourceToolId === "subagent_announce";
    const agentMediatedCompletion = requiresAgentMediatedCompletionDelivery({
      expectsCompletionMessage: params.expectsCompletionMessage,
      sourceTool: sourceToolId,
    });
    const expectedMediaUrls = collectExpectedMediaFromInternalEvents(params.internalEvents);
    const completionRouteRequiresMessageToolDelivery =
      params.expectsCompletionMessage &&
      completionRequiresMessageToolDelivery({
        cfg,
        requesterSessionKey: params.requesterSessionKey,
        targetRequesterSessionKey: canonicalRequesterSessionKey,
        requesterEntry,
        directOrigin: effectiveDirectOrigin,
        requesterSessionOrigin,
      });
    const subagentDirectMessageCompletionRequiresMessageTool =
      params.expectsCompletionMessage &&
      isSubagentCompletion &&
      deliveryTarget.deliver &&
      isDirectMessageDeliveryTarget(deliveryTarget, canonicalRequesterSessionKey);
    const requiresMessageToolDelivery =
      completionRouteRequiresMessageToolDelivery ||
      subagentDirectMessageCompletionRequiresMessageTool;
    const requesterActivity = resolveRequesterSessionActivity(canonicalRequesterSessionKey);
    if (
      params.expectsCompletionMessage &&
      subagentAnnounceDeliveryDeps.isRequesterSessionAbandoned(
        canonicalRequesterSessionKey,
        requesterActivity.sessionId,
      )
    )
      return {
        delivered: false,
        path: "none",
        reason: "requester_abandoned",
        error: "requester session abandoned after timeout",
      };
    let activeRequesterWakeFailed = false;
    let cronContinuation;
    const tryGeneratedMediaDirectDelivery = async (announceResponse, knownMissingMediaUrls) => {
      if (requesterActivity.isActive && !activeRequesterWakeFailed) return;
      const missingMediaUrls =
        knownMissingMediaUrls ??
        resolveGeneratedMediaDirectFallbackUrls({
          expectedMediaUrls,
          announceResponse,
          requiresMessageToolDelivery,
          automaticDeliveryRequested: shouldDeliverAgentFinal,
          automaticDeliveryFailed:
            !requiresMessageToolDelivery &&
            Boolean(getGatewayAgentCommandDeliveryFailure(announceResponse)),
          deliveryTarget,
        });
      return await deliverGeneratedMediaCompletionDirect({
        cfg,
        requesterSessionKey: canonicalRequesterSessionKey,
        directIdempotencyKey: params.directIdempotencyKey,
        deliveryTarget,
        mediaUrls: missingMediaUrls,
        internalEvents: params.internalEvents,
        sourceTool: params.sourceTool,
      });
    };
    const completionSourceReplyDeliveryMode = requiresMessageToolDelivery
      ? "message_tool_only"
      : void 0;
    const shouldDeliverAgentFinal = deliveryTarget.deliver && !requiresMessageToolDelivery;
    const requesterQueueSettings = resolveQueueSettings({
      cfg,
      channel:
        requesterEntry?.channel ??
        requesterEntry?.lastChannel ??
        requesterEntry?.origin?.provider ??
        requesterSessionOrigin?.channel ??
        directOrigin?.channel,
      sessionEntry: requesterEntry,
    });
    if (
      params.expectsCompletionMessage &&
      requesterActivity.sessionId &&
      requesterActivity.isActive
    ) {
      const wakeOptions = {
        deliveryTimeoutMs: announceTimeoutMs,
        steeringMode: "all",
        ...(completionSourceReplyDeliveryMode
          ? { sourceReplyDeliveryMode: completionSourceReplyDeliveryMode }
          : {}),
        ...(requesterQueueSettings.debounceMs !== void 0
          ? { debounceMs: requesterQueueSettings.debounceMs }
          : {}),
        waitForTranscriptCommit: true,
      };
      const wakeOutcome = await resolveActiveWakeWithRetries(
        requesterActivity.sessionId,
        params.triggerMessage,
        wakeOptions,
        params.signal,
      );
      if (wakeOutcome.queued)
        return {
          delivered: true,
          deliveredAt: wakeOutcome.deliveredAtMs,
          enqueuedAt: wakeOutcome.enqueuedAtMs,
          path: "steered",
        };
      activeRequesterWakeFailed = true;
      defaultRuntime.log(
        `[warn] Active requester session could not be woken for subagent completion; falling back to requester-agent handoff: ${formatQueueWakeFailureError("active requester session could not be woken", wakeOutcome)}`,
      );
    }
    if (
      params.expectsCompletionMessage &&
      isCronRunSessionKey(canonicalRequesterSessionKey) &&
      !resolveRequesterSessionActivity(canonicalRequesterSessionKey).isActive &&
      !agentMediatedCompletion
    ) {
      const generatedMediaDelivery = await tryGeneratedMediaDirectDelivery();
      if (generatedMediaDelivery) return generatedMediaDelivery;
      if (!agentMediatedCompletion)
        return {
          delivered: true,
          path: "none",
        };
    }
    if (params.signal?.aborted)
      return {
        delivered: false,
        path: "none",
      };
    if (
      params.expectsCompletionMessage &&
      parseCronRunScopeSuffix(canonicalRequesterSessionKey).runId !== void 0 &&
      hasGeneratedMediaCompletionEvent(params.internalEvents)
    ) {
      const continuation = readCronRunContinuation({ sessionKey: canonicalRequesterSessionKey });
      if (!continuation)
        return {
          delivered: false,
          path: "none",
          reason: "completion_handoff_unavailable",
          error: "cron run continuation is unavailable",
        };
      cronContinuation = continuation;
    }
    const directAgentThreadId = shouldDeliverAgentFinal
      ? stringifyRouteThreadId(deliveryTarget.threadId)
      : sessionOnlyOriginChannel
        ? stringifyRouteThreadId(sessionOnlyOrigin?.threadId)
        : void 0;
    const directAgentParams = {
      sessionKey: canonicalRequesterSessionKey,
      message: params.triggerMessage,
      deliver: shouldDeliverAgentFinal,
      bestEffortDeliver: params.bestEffortDeliver,
      internalEvents: params.internalEvents,
      channel: shouldDeliverAgentFinal ? deliveryTarget.channel : sessionOnlyOriginChannel,
      accountId: shouldDeliverAgentFinal
        ? deliveryTarget.accountId
        : sessionOnlyOriginChannel
          ? sessionOnlyOrigin?.accountId
          : void 0,
      to: shouldDeliverAgentFinal
        ? deliveryTarget.to
        : sessionOnlyOriginChannel
          ? sessionOnlyOrigin?.to
          : void 0,
      threadId: directAgentThreadId,
      inputProvenance: {
        kind: "inter_session",
        sourceSessionKey: params.sourceSessionKey,
        sourceChannel: params.sourceChannel ?? "webchat",
        sourceTool: params.sourceTool ?? "subagent_announce",
      },
      ...(completionSourceReplyDeliveryMode
        ? { sourceReplyDeliveryMode: completionSourceReplyDeliveryMode }
        : {}),
      idempotencyKey: params.directIdempotencyKey,
    };
    let directAnnounceResponse;
    try {
      directAnnounceResponse = await runAnnounceDeliveryWithRetry({
        operation: params.expectsCompletionMessage
          ? "completion direct announce agent call"
          : "direct announce agent call",
        signal: params.signal,
        run: async () => {
          let agentParams = directAgentParams;
          if (cronContinuation) {
            const continuation = readCronRunContinuation({
              sessionKey: canonicalRequesterSessionKey,
              expectedLifecycleRevision: cronContinuation.lifecycleRevision,
            });
            if (!continuation)
              throw cronRunContinuationLostError("cron run continuation changed before delivery");
            cronContinuation = continuation;
            agentParams = {
              ...directAgentParams,
              sessionId: continuation.sessionId,
            };
          }
          return await runAnnounceAgentCall({
            agentParams,
            cronRunContinuation: cronContinuation !== void 0,
            expectFinal: true,
            timeoutMs: announceTimeoutMs,
          });
        },
      });
    } catch (err) {
      if (isPermanentAnnounceDeliveryError(err) && hasAnnounceSendEvidence(err)) throw err;
      if (
        params.expectsCompletionMessage &&
        (shouldDeliverAgentFinal || subagentDirectMessageCompletionRequiresMessageTool) &&
        isSubagentCompletion &&
        isIncompleteAnnounceAgentResultError(err)
      ) {
        const textDelivery = await deliverTextCompletionDirect({
          cfg,
          requesterSessionKey: canonicalRequesterSessionKey,
          directIdempotencyKey: params.directIdempotencyKey,
          deliveryTarget,
          internalEvents: params.internalEvents,
        });
        if (textDelivery) return textDelivery;
      }
      if (
        activeRequesterWakeFailed &&
        agentMediatedCompletion &&
        expectedMediaUrls.length > 0 &&
        isSessionWriteLockAnnounceAgentError(err)
      ) {
        const generatedMediaDelivery = await tryGeneratedMediaDirectDelivery();
        if (generatedMediaDelivery) return generatedMediaDelivery;
      }
      throw err;
    }
    if (isGatewayAgentRunPending(directAnnounceResponse))
      return {
        delivered: true,
        path: "direct",
      };
    const directDeliveryFailure =
      shouldDeliverAgentFinal || requiresMessageToolDelivery
        ? getGatewayAgentCommandDeliveryFailure(directAnnounceResponse)
        : void 0;
    const shouldRequireGeneratedMediaDelivery =
      agentMediatedCompletion &&
      expectedMediaUrls.length > 0 &&
      (params.requesterIsSubagent || shouldDeliverAgentFinal || requiresMessageToolDelivery);
    const missingExpectedMediaUrls = shouldRequireGeneratedMediaDelivery
      ? resolveGeneratedMediaDirectFallbackUrls({
          expectedMediaUrls,
          announceResponse: directAnnounceResponse,
          requiresMessageToolDelivery,
          automaticDeliveryRequested: shouldDeliverAgentFinal,
          automaticDeliveryFailed: !requiresMessageToolDelivery && Boolean(directDeliveryFailure),
          deliveryTarget,
        })
      : [];
    if (shouldRequireGeneratedMediaDelivery && missingExpectedMediaUrls.length > 0) {
      const generatedMediaDelivery = await tryGeneratedMediaDirectDelivery(
        directAnnounceResponse,
        missingExpectedMediaUrls,
      );
      if (generatedMediaDelivery) return generatedMediaDelivery;
      return {
        delivered: false,
        path: "direct",
        reason: "generated_media_missing",
        error: "completion agent did not deliver generated media",
      };
    }
    if (directDeliveryFailure)
      return {
        delivered: false,
        path: "direct",
        error: directDeliveryFailure,
      };
    if (
      params.expectsCompletionMessage &&
      shouldDeliverAgentFinal &&
      isSubagentCompletion &&
      !hasVisibleGatewayAgentPayload(directAnnounceResponse) &&
      !hasGatewayAgentMessagingToolDeliveryEvidence(directAnnounceResponse) &&
      !hasIntentionalSilentGatewayAgentPayload(directAnnounceResponse)
    ) {
      const textDelivery = await deliverTextCompletionDirect({
        cfg,
        requesterSessionKey: canonicalRequesterSessionKey,
        directIdempotencyKey: params.directIdempotencyKey,
        deliveryTarget,
        internalEvents: params.internalEvents,
      });
      if (textDelivery) return textDelivery;
      if (hasFailedSubagentNoOutputCompletion(params.internalEvents))
        return {
          delivered: false,
          path: "direct",
          reason: "visible_reply_missing",
          error: "completion agent did not produce a visible reply",
        };
    }
    if (
      params.expectsCompletionMessage &&
      requiresMessageToolDelivery &&
      !hasGatewayAgentMessagingToolDeliveryEvidence(directAnnounceResponse) &&
      !hasIntentionalSilentGatewayAgentPayload(directAnnounceResponse)
    ) {
      if (hasFailedSubagentNoOutputCompletion(params.internalEvents))
        return {
          delivered: false,
          path: "direct",
          reason: "visible_reply_missing",
          error: "completion agent did not produce a visible reply",
        };
      if (subagentDirectMessageCompletionRequiresMessageTool) {
        const textDelivery = await deliverTextCompletionDirect({
          cfg,
          requesterSessionKey: canonicalRequesterSessionKey,
          directIdempotencyKey: params.directIdempotencyKey,
          deliveryTarget,
          internalEvents: params.internalEvents,
        });
        if (textDelivery) return textDelivery;
      }
      return {
        delivered: false,
        path: "direct",
        reason: "message_tool_delivery_missing",
        error: "completion agent did not use the message tool for message-tool-only delivery",
      };
    }
    const hasVisibleCompletionReply =
      hasVisibleNonSilentGatewayAgentPayload(directAnnounceResponse);
    const hasCompletionSideEffect =
      hasGatewayAgentCompletionSideEffectEvidence(directAnnounceResponse);
    const acceptsIntentionalSilentCompletion =
      hasIntentionalSilentGatewayAgentPayload(directAnnounceResponse) && !isSubagentCompletion;
    if (
      params.expectsCompletionMessage &&
      !shouldDeliverAgentFinal &&
      !requiresMessageToolDelivery &&
      !hasVisibleCompletionReply &&
      !hasCompletionSideEffect &&
      !acceptsIntentionalSilentCompletion
    )
      return {
        delivered: false,
        path: "direct",
        reason: "visible_reply_missing",
        error: "completion agent did not produce a visible reply",
      };
    if (
      params.expectsCompletionMessage &&
      shouldDeliverAgentFinal &&
      !isSubagentCompletion &&
      !hasVisibleGatewayAgentPayload(directAnnounceResponse)
    )
      return {
        delivered: false,
        path: "direct",
        reason: "visible_reply_missing",
        error: "completion agent did not produce a visible reply",
      };
    return {
      delivered: true,
      path: "direct",
    };
  } catch (err) {
    const terminal = isPermanentAnnounceDeliveryError(err) && hasAnnounceSendEvidence(err);
    const continuationUnavailable = isCronRunContinuationLostError(err);
    const continuationPending =
      !terminal &&
      !continuationUnavailable &&
      params.expectsCompletionMessage &&
      parseCronRunScopeSuffix(canonicalRequesterSessionKey).runId !== void 0 &&
      hasGeneratedMediaCompletionEvent(params.internalEvents);
    return {
      delivered: false,
      path: "direct",
      error: summarizeDeliveryError(err),
      ...(terminal ? { terminal: true } : {}),
      ...(continuationUnavailable ? { reason: "completion_handoff_unavailable" } : {}),
      ...(continuationPending ? { reason: "completion_handoff_pending" } : {}),
    };
  }
}
async function deliverSubagentAnnouncement(params) {
  return await runSubagentAnnounceDispatch({
    expectsCompletionMessage: params.expectsCompletionMessage,
    signal: params.signal,
    steer: async () =>
      await maybeSteerSubagentAnnounce({
        deliveryTimeoutMs: resolveSubagentAnnounceTimeoutMs(
          subagentAnnounceDeliveryDeps.getRuntimeConfig(),
        ),
        requesterSessionKey: params.requesterSessionKey,
        steerMessage: params.steerMessage,
        signal: params.signal,
      }),
    direct: async () =>
      await sendSubagentAnnounceDirectly({
        requesterSessionKey: params.requesterSessionKey,
        targetRequesterSessionKey: params.targetRequesterSessionKey,
        triggerMessage: params.triggerMessage,
        internalEvents: params.internalEvents,
        directIdempotencyKey: params.directIdempotencyKey,
        completionDirectOrigin: params.completionDirectOrigin,
        directOrigin: params.directOrigin,
        requesterSessionOrigin: params.requesterSessionOrigin,
        sourceSessionKey: params.sourceSessionKey,
        sourceChannel: params.sourceChannel,
        sourceTool: params.sourceTool,
        requesterIsSubagent: params.requesterIsSubagent,
        expectsCompletionMessage: params.expectsCompletionMessage,
        signal: params.signal,
        bestEffortDeliver: params.bestEffortDeliver,
      }),
  });
}
//#endregion
//#region src/agents/subagent-announce-origin.ts
/**
 * Subagent announcement origin resolver.
 *
 * Merges requester and session delivery context while avoiding stale thread ids after retargeting.
 */
function normalizeAnnounceRouteTarget(context) {
  const rawTo = normalizeOptionalString(context?.to);
  if (!rawTo) return;
  const channel = normalizeOptionalString(context?.channel);
  const messaging = channel ? getLoadedChannelPluginForRead(channel)?.messaging : void 0;
  const route = stripTargetTopicSuffix(
    stripTargetKindPrefix(stripTargetProviderPrefix(rawTo, channel ?? ""), ["group", "channel"]),
  );
  return (messaging?.normalizeTarget?.(route) ?? route) || void 0;
}
function shouldStripThreadFromAnnounceEntry(normalizedRequester, normalizedEntry) {
  if (
    !normalizedRequester?.to ||
    normalizedRequester.threadId != null ||
    normalizedEntry?.threadId == null
  )
    return false;
  const requesterTarget = normalizeAnnounceRouteTarget(normalizedRequester);
  const entryTarget = normalizeAnnounceRouteTarget(normalizedEntry);
  if (requesterTarget && entryTarget) return requesterTarget !== entryTarget;
  return false;
}
/** Resolve the delivery origin for a subagent completion announcement. */
function resolveAnnounceOrigin(entry, requesterOrigin) {
  const normalizedRequester = normalizeDeliveryContext(requesterOrigin);
  const normalizedEntry = deliveryContextFromSession(entry);
  if (normalizedRequester?.channel && isInternalMessageChannel(normalizedRequester.channel))
    return mergeDeliveryContext(
      {
        accountId: normalizedRequester.accountId,
        threadId: normalizedRequester.threadId,
      },
      normalizedEntry,
    );
  return mergeDeliveryContext(
    normalizedRequester,
    normalizedEntry && shouldStripThreadFromAnnounceEntry(normalizedRequester, normalizedEntry)
      ? (() => {
          const { threadId: _ignore, ...rest } = normalizedEntry;
          return rest;
        })()
      : normalizedEntry,
  );
}
//#endregion
export {
  loadSessionEntryByKey as a,
  runAnnounceDeliveryWithRetry as c,
  formatAgentInternalEventsForPrompt as d,
  AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION as f,
  mediaUrlsFromGeneratedAttachments as h,
  loadRequesterSessionEntry as i,
  isNonTerminalAgentRunStatus as l,
  formatGeneratedAttachmentLines as m,
  deliverSubagentAnnouncement as n,
  resolveSubagentAnnounceTimeoutMs as o,
  hasGeneratedMediaCompletionEvent as p,
  isInternalAnnounceRequesterSession as r,
  resolveSubagentCompletionOrigin as s,
  resolveAnnounceOrigin as t,
  formatAgentInternalEventsForPlainPrompt as u,
};
