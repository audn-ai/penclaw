import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-DoJxaJiY.js";
import {
  a as getDiagnosticSessionActivitySnapshot,
  u as resolveRunStaleThresholdMs,
} from "./diagnostic-run-activity-C7EqD7j0.js";
import "./message-channel-constants-CvbXi0yz.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-5_TQ_dr5.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import {
  D as retainReplyOperationUntilComplete,
  M as waitForReplyRunFollowupAdmission,
  O as runAfterReplyOperationClear,
  S as replyRunRegistry,
  c as createReplyOperation,
  g as isReplyRunEvidenceStale,
  i as ReplyRunFollowupAdmissionBlockedError,
  l as expireStaleReplyOperation,
  n as REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS,
  r as ReplyRunAlreadyActiveError,
  t as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS,
} from "./reply-run-registry-CmZS-dyq.js";
import "./message-channel-NQc9DJ6B.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { X as beginSessionWorkAdmission } from "./store-CzZJhTF6.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/shared/silent-reply-policy.ts
const DEFAULT_SILENT_REPLY_POLICY = {
  direct: "disallow",
  group: "allow",
  internal: "allow",
};
/** Classifies a reply context for silent-reply policy from explicit type, session key, or surface. */
function classifySilentReplyConversationType(params) {
  if (params.conversationType) return params.conversationType;
  const normalizedSessionKey = normalizeLowercaseStringOrEmpty(params.sessionKey);
  if (normalizedSessionKey.includes(":group:") || normalizedSessionKey.includes(":channel:"))
    return "group";
  if (normalizedSessionKey.includes(":direct:") || normalizedSessionKey.includes(":dm:"))
    return "direct";
  if (normalizeLowercaseStringOrEmpty(params.surface) === "webchat") return "direct";
  return "internal";
}
/** Resolves silent-reply policy with surface overrides while keeping direct replies audible. */
function resolveSilentReplyPolicyFromPolicies(params) {
  if (params.conversationType === "direct") return "disallow";
  return (
    params.surfacePolicy?.[params.conversationType] ??
    params.defaultPolicy?.[params.conversationType] ??
    DEFAULT_SILENT_REPLY_POLICY[params.conversationType]
  );
}
//#endregion
//#region src/auto-reply/reply/reply-turn-admission.ts
var QueuedFollowupLifecycleInvalidatedError = class extends Error {};
const lifecycleAdmissionByOperation = /* @__PURE__ */ new WeakMap();
/** Runs owner work with its admission marked as the initiating lifecycle context. */
async function runWithReplyOperationLifecycleAdmission(operation, run) {
  const admission = operation ? lifecycleAdmissionByOperation.get(operation) : void 0;
  return admission ? await admission.run(run) : await run();
}
function rejectLifecycleInvalidatedWork(params) {
  if (params.kind === "queued_followup")
    throw new QueuedFollowupLifecycleInvalidatedError(params.message);
  throw new Error(params.message);
}
function isAbortSignalAborted(signal) {
  return signal?.aborted === true;
}
function expireVisibleStaleOperation(operation) {
  if (!operation) return false;
  const idleMs = Date.now() - operation.lastActivityAtMs;
  if (operation.result)
    return idleMs >= 6e4 && expireStaleReplyOperation(operation, "terminal_unreleased");
  return isReplyRunEvidenceStale(operation) && expireStaleReplyOperation(operation, "no_activity");
}
function resolveVisibleActiveWaitMs(operation) {
  if (!operation) return REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS;
  const ageMs = Date.now() - operation.lastActivityAtMs;
  const activity = getDiagnosticSessionActivitySnapshot({
    sessionId: operation.sessionId,
    sessionKey: operation.key,
  });
  const remainingMs = operation.result
    ? REPLY_RUN_TERMINAL_SETTLE_TIMEOUT_MS - ageMs
    : resolveRunStaleThresholdMs(activity) - ageMs;
  return Math.min(REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, Math.max(1, remainingMs));
}
/** Waits for or claims the per-session reply run slot. */
async function admitReplyTurn(params) {
  let sessionId = params.sessionId;
  let expectedSessionId = params.expectedSessionId;
  const waitTimeoutMs = params.waitTimeoutMs ?? (params.kind === "queued_followup" ? 15e3 : void 0);
  const waitForFollowupAdmission = async (wait) => {
    params.onFollowupAdmissionWaitChange?.(true);
    try {
      return await wait();
    } finally {
      params.onFollowupAdmissionWaitChange?.(false);
    }
  };
  while (true) {
    if (isAbortSignalAborted(params.upstreamAbortSignal))
      return {
        status: "skipped",
        reason: "aborted",
      };
    try {
      const storePath = params.storePath;
      let operation;
      let admittedSessionEntry;
      let interruptedBeforeOperation = false;
      const admission = storePath
        ? await beginSessionWorkAdmission({
            scope: storePath,
            identities: [params.sessionKey],
            signal: params.upstreamAbortSignal,
            onInterrupt: () => {
              interruptedBeforeOperation = true;
              operation?.abortForRestart();
              params.onLifecycleInterrupt?.();
            },
            assertAllowed: () => {
              const currentEntry = loadSessionEntry({
                storePath,
                sessionKey: params.sessionKey,
                readConsistency: "latest",
              });
              admittedSessionEntry = currentEntry;
              if (expectedSessionId && !currentEntry)
                rejectLifecycleInvalidatedWork({
                  kind: params.kind,
                  message: `Session "${params.sessionKey}" was deleted while starting work. Retry.`,
                });
              const registeredOperation = replyRunRegistry.get(params.sessionKey);
              const rotationOperation = [registeredOperation, params.expectedActiveOperation].find(
                (candidate) => {
                  if (
                    !candidate ||
                    !expectedSessionId ||
                    currentEntry?.sessionId !== candidate.sessionId ||
                    !candidate.hasOwnedSessionId(expectedSessionId)
                  )
                    return false;
                  if (
                    candidate.result?.kind === "aborted" &&
                    candidate.result.code === "aborted_for_restart"
                  )
                    return false;
                  return candidate === registeredOperation || candidate.result !== null;
                },
              );
              const activeOperationRotatedExpectedSession = Boolean(
                rotationOperation && currentEntry?.sessionId === rotationOperation.sessionId,
              );
              if (
                expectedSessionId &&
                currentEntry?.sessionId !== expectedSessionId &&
                !activeOperationRotatedExpectedSession
              )
                rejectLifecycleInvalidatedWork({
                  kind: params.kind,
                  message: `Session "${params.sessionKey}" changed while starting work. Retry.`,
                });
              if (activeOperationRotatedExpectedSession)
                expectedSessionId = currentEntry?.sessionId;
              const archivedSessionError = resolveSessionWorkStartError(
                params.sessionKey || sessionId,
                currentEntry,
              );
              if (archivedSessionError)
                rejectLifecycleInvalidatedWork({
                  kind: params.kind,
                  message: archivedSessionError,
                });
              sessionId = currentEntry?.sessionId ?? sessionId;
            },
          })
        : void 0;
      if (interruptedBeforeOperation) {
        admission?.release();
        rejectLifecycleInvalidatedWork({
          kind: params.kind,
          message: `Session "${params.sessionKey}" changed while starting work. Retry.`,
        });
      }
      try {
        if (params.adoptOperation) {
          params.adoptOperation.updateSessionKey(params.sessionKey);
          operation = params.adoptOperation;
        } else
          operation = createReplyOperation({
            sessionKey: params.sessionKey,
            sessionId,
            resetTriggered: params.resetTriggered,
            routeThreadId: params.routeThreadId,
            upstreamAbortSignal: params.upstreamAbortSignal,
            respectFollowupAdmissionBarrier:
              params.kind === "queued_followup" || params.kind === "heartbeat",
          });
      } catch (error) {
        if (
          error instanceof ReplyRunAlreadyActiveError &&
          admission &&
          params.retainLifecycleAdmissionOnActive
        )
          return {
            status: "skipped",
            reason: "active-run",
            activeOperation: replyRunRegistry.get(params.sessionKey),
            lifecycleAdmission: admission,
          };
        admission?.release();
        throw error;
      }
      if (admission) {
        retainReplyOperationUntilComplete(operation);
        lifecycleAdmissionByOperation.set(operation, admission);
        runAfterReplyOperationClear(operation, () => {
          lifecycleAdmissionByOperation.delete(operation);
          admission.release();
        });
      }
      return {
        status: "owned",
        operation,
        ...(admittedSessionEntry ? { sessionEntry: admittedSessionEntry } : {}),
      };
    } catch (error) {
      if (isAbortSignalAborted(params.upstreamAbortSignal))
        return {
          status: "skipped",
          reason: "aborted",
        };
      if (error instanceof QueuedFollowupLifecycleInvalidatedError)
        return {
          status: "skipped",
          reason: "lifecycle-invalidated",
        };
      if (error instanceof ReplyRunFollowupAdmissionBlockedError) {
        if (params.kind === "heartbeat")
          return {
            status: "skipped",
            reason: "active-run",
          };
        const followupAdmission = await waitForFollowupAdmission(() =>
          waitForReplyRunFollowupAdmission(params.sessionKey, waitTimeoutMs ?? 15e3, {
            signal: params.upstreamAbortSignal,
          }),
        );
        if (!followupAdmission.settled)
          return {
            status: "skipped",
            reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
          };
        sessionId = followupAdmission.sessionId ?? sessionId;
        if (expectedSessionId && followupAdmission.sessionId)
          expectedSessionId = followupAdmission.sessionId;
        continue;
      }
      if (!(error instanceof ReplyRunAlreadyActiveError)) throw error;
      const activeOperation = replyRunRegistry.get(params.sessionKey);
      if (params.kind === "visible" && expireVisibleStaleOperation(activeOperation)) continue;
      if (params.kind === "heartbeat")
        return {
          status: "skipped",
          reason: "active-run",
          activeOperation,
        };
      if (params.waitForActive === false)
        return {
          status: "skipped",
          reason: "active-run",
          activeOperation,
        };
      const activeWaitTimeoutMs =
        params.kind === "visible" ? resolveVisibleActiveWaitMs(activeOperation) : waitTimeoutMs;
      if (
        !(await replyRunRegistry.waitForIdle(params.sessionKey, activeWaitTimeoutMs, {
          signal: params.upstreamAbortSignal,
        }))
      ) {
        if (params.kind === "visible" && !isAbortSignalAborted(params.upstreamAbortSignal)) {
          expireVisibleStaleOperation(replyRunRegistry.get(params.sessionKey) ?? activeOperation);
          continue;
        }
        return {
          status: "skipped",
          reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
          activeOperation,
        };
      }
      if (activeOperation) {
        sessionId = activeOperation.sessionId;
        if (
          expectedSessionId &&
          !(
            activeOperation.result?.kind === "aborted" &&
            activeOperation.result.code === "aborted_for_restart"
          )
        )
          expectedSessionId = activeOperation.sessionId;
      }
    }
  }
}
/** Resolves the default turn kind from reply options. */
function resolveReplyTurnKind(opts) {
  return opts?.isHeartbeat === true ? "heartbeat" : "visible";
}
//#endregion
//#region src/auto-reply/reply/effective-reply-route.ts
/** Resolves the effective reply route from current context and persisted session route. */
/** Returns true for synthetic providers that should not define a user channel route. */
function isSystemEventProvider(provider) {
  return provider === "heartbeat" || provider === "cron-event" || provider === "exec-event";
}
function isSessionsSendInterSessionHandoff(inputProvenance) {
  return (
    inputProvenance?.kind === "inter_session" &&
    inputProvenance.sourceTool?.toLowerCase() === "sessions_send"
  );
}
function resolveTrustedInheritedThreadId(entry) {
  const deliveryThreadId = entry?.deliveryContext?.threadId;
  if (deliveryThreadId == null) return;
  const routeThread = entry?.route?.thread;
  if (
    routeThread?.id != null &&
    (routeThread.source === "explicit" ||
      routeThread.source === "target" ||
      routeThread.source === "turn") &&
    stringifyRouteThreadId(routeThread.id) === stringifyRouteThreadId(deliveryThreadId)
  )
    return deliveryThreadId;
}
/** Resolves current, inherited, or persisted reply route for a session turn. */
function resolveEffectiveReplyRoute(params) {
  const currentSurface =
    normalizeMessageChannel(params.ctx.Provider) ??
    normalizeMessageChannel(params.ctx.Surface) ??
    normalizeMessageChannel(params.ctx.OriginatingChannel);
  const persistedDeliveryContext = params.entry?.deliveryContext;
  const persistedDeliveryChannel = normalizeMessageChannel(persistedDeliveryContext?.channel);
  const liveChatType = normalizeChatType(params.ctx.ChatType);
  const persistedChatType =
    params.entry?.route?.target?.chatType ??
    params.entry?.chatType ??
    normalizeChatType(params.entry?.origin?.chatType);
  if (
    isSessionsSendInterSessionHandoff(params.ctx.InputProvenance) &&
    currentSurface === "webchat" &&
    persistedDeliveryChannel &&
    persistedDeliveryChannel !== "webchat" &&
    persistedDeliveryContext?.to
  ) {
    const inheritedThreadId = resolveTrustedInheritedThreadId(params.entry);
    return {
      channel: persistedDeliveryChannel,
      to: persistedDeliveryContext.to,
      accountId: persistedDeliveryContext.accountId,
      ...(inheritedThreadId !== void 0 ? { threadId: inheritedThreadId } : {}),
      ...(persistedChatType ? { chatType: persistedChatType } : {}),
      inheritedExternalRoute: true,
    };
  }
  if (!isSystemEventProvider(params.ctx.Provider))
    return {
      channel: params.ctx.OriginatingChannel,
      to: params.ctx.OriginatingTo,
      accountId: params.ctx.AccountId,
      ...(liveChatType ? { chatType: liveChatType } : {}),
    };
  const persistedChannel = persistedDeliveryContext?.channel ?? params.entry?.lastChannel;
  const liveChannel = params.ctx.OriginatingChannel;
  const canInheritPersistedTuple =
    !liveChannel ||
    normalizeMessageChannel(liveChannel) === normalizeMessageChannel(persistedChannel);
  const chatType = liveChatType ?? (canInheritPersistedTuple ? persistedChatType : void 0);
  return {
    channel: liveChannel ?? persistedChannel,
    to:
      params.ctx.OriginatingTo ??
      (canInheritPersistedTuple ? (persistedDeliveryContext?.to ?? params.entry?.lastTo) : void 0),
    accountId:
      params.ctx.AccountId ??
      (canInheritPersistedTuple
        ? (persistedDeliveryContext?.accountId ?? params.entry?.lastAccountId)
        : void 0),
    ...(chatType ? { chatType } : {}),
  };
}
//#endregion
//#region src/auto-reply/reply/reply-timing-tracker.ts
const DEFAULT_TIMING_WARN_TOTAL_MS = 1e3;
const DEFAULT_TIMING_WARN_STAGE_MS = 500;
/** Checks config/env diagnostic flags for reply profiling. */
function isReplyProfilerEnabled(params) {
  const cfg = params?.config;
  const env = params?.env ?? process.env;
  return (
    isDiagnosticFlagEnabled("profiler", cfg, env) ||
    isDiagnosticFlagEnabled("reply.profiler", cfg, env)
  );
}
/** Creates a lightweight timing tracker for slow reply-stage diagnostics. */
function createReplyTimingTracker(params) {
  if (
    !(
      params.enabled ??
      isReplyProfilerEnabled({
        config: params.config,
        env: params.env,
      })
    )
  )
    return {
      async measure(_name, run) {
        return await run();
      },
      measureSync(_name, run) {
        return run();
      },
      logIfSlow() {},
    };
  const startedAt = Date.now();
  const spans = [];
  let didLog = false;
  const totalWarnMs = params.totalWarnMs ?? DEFAULT_TIMING_WARN_TOTAL_MS;
  const stageWarnMs = params.stageWarnMs ?? DEFAULT_TIMING_WARN_STAGE_MS;
  const toMs = (value) => Math.max(0, Math.round(value));
  const record = (name, spanStartedAt) => {
    spans.push({
      name,
      durationMs: toMs(Date.now() - spanStartedAt),
      elapsedMs: toMs(Date.now() - startedAt),
    });
  };
  const snapshot = () => ({
    totalMs: toMs(Date.now() - startedAt),
    spans: spans.slice(),
  });
  const shouldLog = (summary) =>
    summary.totalMs >= totalWarnMs || summary.spans.some((span) => span.durationMs >= stageWarnMs);
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
        record(name, spanStartedAt);
      }
    },
    measureSync(name, run) {
      const spanStartedAt = Date.now();
      try {
        return run();
      } finally {
        record(name, spanStartedAt);
      }
    },
    logIfSlow(logParams) {
      if (didLog) return;
      const summary = snapshot();
      if (!shouldLog(summary)) return;
      didLog = true;
      const suffix = [
        `totalMs=${summary.totalMs}`,
        `stages=${formatSpans(summary)}`,
        logParams.outcome ? `outcome=${logParams.outcome}` : void 0,
        logParams.reason ? `reason=${logParams.reason}` : void 0,
        logParams.error ? `error="${logParams.error}"` : void 0,
      ]
        .filter(Boolean)
        .join(" ");
      params.log.warn(`${logParams.message} ${suffix}`, {
        ...logParams.details,
        outcome: logParams.outcome,
        reason: logParams.reason,
        error: logParams.error,
        totalMs: summary.totalMs,
        spans: summary.spans,
      });
    },
  };
}
//#endregion
export {
  admitReplyTurn as a,
  classifySilentReplyConversationType as c,
  resolveEffectiveReplyRoute as i,
  resolveSilentReplyPolicyFromPolicies as l,
  isReplyProfilerEnabled as n,
  resolveReplyTurnKind as o,
  isSystemEventProvider as r,
  runWithReplyOperationLifecycleAdmission as s,
  createReplyTimingTracker as t,
};
