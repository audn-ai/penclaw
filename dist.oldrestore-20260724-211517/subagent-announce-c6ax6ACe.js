import {
  n as buildAnnounceIdempotencyKey,
  t as buildAnnounceIdFromChildRun,
} from "./announce-idempotency-DRIcQ039.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import { A as waitForEmbeddedAgentRunEnd, d as isEmbeddedAgentRunActive } from "./runs-GL_-RIwi.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import "./message-channel-NQc9DJ6B.js";
import { r as dispatchGatewayMethodInProcess } from "./server-plugins-WbUfkNgn.js";
import { i as isCronSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./delivery-context-DXOSD_HH.js";
import {
  a as loadSessionEntryByKey,
  c as runAnnounceDeliveryWithRetry,
  d as formatAgentInternalEventsForPrompt,
  i as loadRequesterSessionEntry,
  n as deliverSubagentAnnouncement,
  o as resolveSubagentAnnounceTimeoutMs,
  s as resolveSubagentCompletionOrigin,
  t as resolveAnnounceOrigin,
} from "./subagent-announce-origin-4XzASDS-.js";
import { s as getSubagentDepthFromSessionStore } from "./subagent-capabilities-DP50Hfbb.js";
import {
  a as captureSubagentCompletionReply,
  c as readLatestSubagentOutputWithRetry,
  i as buildCompactAnnounceStatsLine,
  l as readSubagentOutput,
  m as isAnnounceSkip,
  n as applySubagentWaitOutcome,
  o as dedupeLatestChildCompletionRows,
  r as buildChildCompletionFindings,
  s as filterCurrentDirectChildCompletionRows,
  t as deleteSubagentSessionForCleanup,
  u as waitForSubagentRunOutcome,
} from "./subagent-session-cleanup-pTd7kOt-.js";
import { t as buildSubagentSystemPrompt } from "./subagent-system-prompt-CN-uQnXK.js";
import {
  c as stripLeadingSilentToken,
  l as stripSilentToken,
  n as SILENT_REPLY_TOKEN,
  o as isSilentReplyText,
  s as startsWithSilentToken,
} from "./tokens-DKI4eGAu.js";
//#region src/agents/subagent-announce.ts
/**
 * Subagent completion announcement coordinator.
 *
 * Captures child output, applies wait outcomes, routes announcements, and performs cleanup decisions.
 */
const defaultSubagentAnnounceDeps = {
  callGateway,
  dispatchGatewayMethodInProcess,
  getRuntimeConfig,
  loadSubagentRegistryRuntime,
};
let subagentAnnounceDeps = defaultSubagentAnnounceDeps;
const subagentRegistryRuntimeLoader = createLazyImportLoader(
  () => import("./subagent-announce.registry.runtime.js"),
);
function loadSubagentRegistryRuntime() {
  return subagentRegistryRuntimeLoader.load();
}
function buildAnnounceReplyInstruction(params) {
  if (params.requesterIsSubagent)
    return `Convert this completion into a concise internal orchestration update for your parent agent in your own words. Keep this internal context private (don't mention system/log/stats/session details or announce type). If this result is duplicate or no update is needed, reply ONLY: ${SILENT_REPLY_TOKEN}.`;
  if (params.expectsCompletionMessage)
    return `A completed ${params.announceType} is ready for parent review. Review/verify the result above before deciding whether the original task is done. If additional action is required, continue the task or record a follow-up; otherwise send a truthful user-facing update. Keep this internal context private (don't mention system/log/stats/session details or announce type). Reply ONLY: ${SILENT_REPLY_TOKEN} only when this exact result is already visible to the user in this same turn.`;
  return `A completed ${params.announceType} is ready for parent review. Review/verify the result above before deciding whether the original task is done. If additional action is required, continue the task or record a follow-up; otherwise send a truthful user-facing update. Keep this internal context private (don't mention system/log/stats/session details or announce type), and do not copy the internal event text verbatim. Reply ONLY: ${SILENT_REPLY_TOKEN} if this exact result was already delivered to the user in this same turn.`;
}
function buildAnnounceSteerMessage(events) {
  return (
    formatAgentInternalEventsForPrompt(events) ||
    "A background task finished. Process the completion update now."
  );
}
function hasUsableSessionEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  const sessionId = entry.sessionId;
  return typeof sessionId !== "string" || sessionId.trim() !== "";
}
function buildDescendantWakeMessage(params) {
  return [
    "[Subagent Context] Your prior run ended while waiting for descendant subagent completions.",
    "[Subagent Context] All pending descendants for that run have now settled.",
    "[Subagent Context] Continue your workflow using these results. Spawn more subagents if needed, otherwise send your final answer.",
    "",
    `Task: ${params.taskLabel}`,
    "",
    params.findings,
  ].join("\n");
}
const WAKE_RUN_SUFFIX = ":wake";
function stripWakeRunSuffixes(runId) {
  let next = runId.trim();
  while (next.endsWith(WAKE_RUN_SUFFIX)) next = next.slice(0, -5);
  return next || runId.trim();
}
function isWakeContinuationRun(runId) {
  const trimmed = runId.trim();
  if (!trimmed) return false;
  return stripWakeRunSuffixes(trimmed) !== trimmed;
}
function stripAndClassifyReply(text) {
  let result = text;
  let didStrip = false;
  const hasLeadingSilentToken = startsWithSilentToken(result, SILENT_REPLY_TOKEN);
  if (hasLeadingSilentToken) {
    result = stripLeadingSilentToken(result, SILENT_REPLY_TOKEN);
    didStrip = true;
  }
  if (hasLeadingSilentToken || result.toLowerCase().includes("NO_REPLY".toLowerCase())) {
    result = stripSilentToken(result, SILENT_REPLY_TOKEN);
    didStrip = true;
  }
  if (
    didStrip &&
    (!result.trim() || isSilentReplyText(result, "NO_REPLY") || isAnnounceSkip(result))
  )
    return null;
  return result;
}
async function wakeSubagentRunAfterDescendants(params) {
  if (params.signal?.aborted) return false;
  if (!hasUsableSessionEntry(loadSessionEntryByKey(params.childSessionKey))) return false;
  const announceTimeoutMs = resolveSubagentAnnounceTimeoutMs(
    subagentAnnounceDeps.getRuntimeConfig(),
  );
  const wakeMessage = buildDescendantWakeMessage({
    findings: params.findings,
    taskLabel: params.taskLabel,
  });
  let wakeRunId;
  try {
    wakeRunId =
      normalizeOptionalString(
        (
          await runAnnounceDeliveryWithRetry({
            operation: "descendant wake agent call",
            signal: params.signal,
            run: async () =>
              await subagentAnnounceDeps.dispatchGatewayMethodInProcess(
                "agent",
                {
                  sessionKey: params.childSessionKey,
                  message: wakeMessage,
                  deliver: false,
                  inputProvenance: {
                    kind: "inter_session",
                    sourceSessionKey: params.childSessionKey,
                    sourceChannel: "webchat",
                    sourceTool: "subagent_announce",
                  },
                  idempotencyKey: buildAnnounceIdempotencyKey(`${params.announceId}:wake`),
                },
                { timeoutMs: announceTimeoutMs },
              ),
          })
        )?.runId,
      ) ?? "";
  } catch {
    return false;
  }
  if (!wakeRunId) return false;
  const { replaceSubagentRunAfterSteer } = await loadSubagentRegistryRuntime();
  return replaceSubagentRunAfterSteer({
    previousRunId: params.runId,
    nextRunId: wakeRunId,
    preserveFrozenResultFallback: true,
    task: wakeMessage,
  });
}
async function runSubagentAnnounceFlow(params) {
  let didAnnounce = false;
  const expectsCompletionMessage = params.expectsCompletionMessage === true;
  const announceType = params.announceType ?? "subagent task";
  let shouldDeleteChildSession = params.cleanup === "delete";
  try {
    let targetRequesterSessionKey = params.requesterSessionKey;
    let targetRequesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
    const childSessionId = (() => {
      const entry = loadSessionEntryByKey(params.childSessionKey);
      return typeof entry?.sessionId === "string" && entry.sessionId.trim()
        ? entry.sessionId.trim()
        : void 0;
    })();
    const settleTimeoutMs = Math.min(Math.max(params.timeoutMs, 1), 12e4);
    let reply = params.roundOneReply;
    let outcome = params.outcome;
    if (childSessionId && isEmbeddedAgentRunActive(childSessionId)) {
      if (
        !(await waitForEmbeddedAgentRunEnd(childSessionId, settleTimeoutMs)) &&
        isEmbeddedAgentRunActive(childSessionId)
      ) {
        shouldDeleteChildSession = false;
        if (outcome?.status !== "timeout" || params.cleanup === "delete") return false;
      }
    }
    if (!reply && params.waitForCompletion !== false) {
      const applied = applySubagentWaitOutcome({
        wait: await waitForSubagentRunOutcome(params.childRunId, settleTimeoutMs),
        outcome,
        startedAt: params.startedAt,
        endedAt: params.endedAt,
      });
      outcome = applied.outcome;
      params.startedAt = applied.startedAt;
      params.endedAt = applied.endedAt;
    }
    if (!outcome) outcome = { status: "unknown" };
    const failedTerminalOutcome = outcome.status === "error";
    const allowFailedOutputCapture =
      !failedTerminalOutcome || (!params.roundOneReply && !params.fallbackReply);
    if (failedTerminalOutcome) reply = void 0;
    let requesterDepth = getSubagentDepthFromSessionStore(targetRequesterSessionKey);
    const requesterIsInternalSession = () =>
      requesterDepth >= 1 || isCronSessionKey(targetRequesterSessionKey);
    let childCompletionFindings;
    let subagentRegistryRuntime;
    try {
      subagentRegistryRuntime = await subagentAnnounceDeps.loadSubagentRegistryRuntime();
      if (
        requesterDepth >= 1 &&
        subagentRegistryRuntime.shouldIgnorePostCompletionAnnounceForSession(
          targetRequesterSessionKey,
        )
      )
        return true;
      if (
        Math.max(0, subagentRegistryRuntime.countPendingDescendantRuns(params.childSessionKey)) >
          0 &&
        announceType !== "cron job"
      ) {
        shouldDeleteChildSession = false;
        return false;
      }
      if (typeof subagentRegistryRuntime.listSubagentRunsForRequester === "function") {
        const directChildren = subagentRegistryRuntime.listSubagentRunsForRequester(
          params.childSessionKey,
          { requesterRunId: params.childRunId },
        );
        if (Array.isArray(directChildren) && directChildren.length > 0)
          childCompletionFindings = buildChildCompletionFindings(
            dedupeLatestChildCompletionRows(
              filterCurrentDirectChildCompletionRows(directChildren, {
                requesterSessionKey: params.childSessionKey,
                getLatestSubagentRunByChildSessionKey:
                  subagentRegistryRuntime.getLatestSubagentRunByChildSessionKey,
              }),
            ),
          );
      }
    } catch {}
    const announceId = buildAnnounceIdFromChildRun({
      childSessionKey: params.childSessionKey,
      childRunId: params.childRunId,
    });
    const childRunAlreadyWoken = isWakeContinuationRun(params.childRunId);
    if (
      params.wakeOnDescendantSettle === true &&
      childCompletionFindings?.trim() &&
      !childRunAlreadyWoken
    ) {
      const wakeAnnounceId = buildAnnounceIdFromChildRun({
        childSessionKey: params.childSessionKey,
        childRunId: stripWakeRunSuffixes(params.childRunId),
      });
      if (
        await wakeSubagentRunAfterDescendants({
          runId: params.childRunId,
          childSessionKey: params.childSessionKey,
          taskLabel: params.label || params.task || "task",
          findings: childCompletionFindings,
          announceId: wakeAnnounceId,
          signal: params.signal,
        })
      ) {
        shouldDeleteChildSession = false;
        return true;
      }
    }
    if (!childCompletionFindings) {
      const fallbackReply = failedTerminalOutcome
        ? void 0
        : normalizeOptionalString(params.fallbackReply);
      const fallbackIsSilent =
        Boolean(fallbackReply) &&
        (isAnnounceSkip(fallbackReply) || isSilentReplyText(fallbackReply, "NO_REPLY"));
      if (!reply && allowFailedOutputCapture)
        reply = await readSubagentOutput(params.childSessionKey, outcome);
      if (!reply?.trim() && allowFailedOutputCapture)
        reply = await readLatestSubagentOutputWithRetry({
          sessionKey: params.childSessionKey,
          maxWaitMs: params.timeoutMs,
          outcome,
        });
      if (!reply?.trim() && fallbackReply && !fallbackIsSilent) reply = fallbackReply;
      if (outcome?.status === "timeout" && reply?.trim() && params.waitForCompletion !== false)
        try {
          const applied = applySubagentWaitOutcome({
            wait: await waitForSubagentRunOutcome(params.childRunId, 0),
            outcome,
            startedAt: params.startedAt,
            endedAt: params.endedAt,
          });
          outcome = applied.outcome;
          params.startedAt = applied.startedAt;
          params.endedAt = applied.endedAt;
        } catch {}
      if (isAnnounceSkip(reply) || isSilentReplyText(reply, "NO_REPLY"))
        if (fallbackReply && !fallbackIsSilent) {
          const cleaned = stripAndClassifyReply(fallbackReply);
          if (cleaned === null) {
            if (isAnnounceSkip(reply) && isCronSessionKey(targetRequesterSessionKey))
              logWarn(
                `cron job completion for session=${targetRequesterSessionKey} run=${params.childRunId} suppressed by ANNOUNCE_SKIP; the agent replied with the skip sentinel instead of delivering a result`,
              );
            return true;
          }
          reply = cleaned;
        } else {
          if (isAnnounceSkip(reply) && isCronSessionKey(targetRequesterSessionKey))
            logWarn(
              `cron job completion for session=${targetRequesterSessionKey} run=${params.childRunId} suppressed by ANNOUNCE_SKIP; the agent replied with the skip sentinel instead of delivering a result`,
            );
          return true;
        }
      else if (reply) {
        const cleaned = stripAndClassifyReply(reply);
        if (cleaned === null)
          if (fallbackReply && !fallbackIsSilent) {
            const cleanedFallback = stripAndClassifyReply(fallbackReply);
            if (cleanedFallback === null) return true;
            reply = cleanedFallback;
          } else return true;
        else reply = cleaned;
      }
    }
    if (!outcome) outcome = { status: "unknown" };
    const statusLabel =
      outcome.status === "ok"
        ? "completed; ready for parent review"
        : outcome.status === "timeout"
          ? "timed out"
          : outcome.status === "error"
            ? `failed: ${outcome.error || "unknown error"}`
            : "finished with unknown status";
    const taskLabel = params.label || params.task || "task";
    const announceSessionId = childSessionId || "unknown";
    const findings = childCompletionFindings || reply || "(no output)";
    let requesterIsSubagent = requesterIsInternalSession();
    if (requesterIsSubagent) {
      const {
        isSubagentSessionRunActive,
        resolveRequesterForChildSession,
        shouldIgnorePostCompletionAnnounceForSession,
      } = subagentRegistryRuntime ?? (await loadSubagentRegistryRuntime());
      if (!isSubagentSessionRunActive(targetRequesterSessionKey)) {
        if (shouldIgnorePostCompletionAnnounceForSession(targetRequesterSessionKey)) return true;
        if (!hasUsableSessionEntry(loadSessionEntryByKey(targetRequesterSessionKey))) {
          const fallback = resolveRequesterForChildSession(targetRequesterSessionKey);
          if (!fallback?.requesterSessionKey) {
            shouldDeleteChildSession = false;
            return false;
          }
          targetRequesterSessionKey = fallback.requesterSessionKey;
          targetRequesterOrigin =
            normalizeDeliveryContext(fallback.requesterOrigin) ?? targetRequesterOrigin;
          requesterDepth = getSubagentDepthFromSessionStore(targetRequesterSessionKey);
          requesterIsSubagent = requesterIsInternalSession();
        }
      }
    }
    const replyInstruction = buildAnnounceReplyInstruction({
      requesterIsSubagent,
      announceType,
      expectsCompletionMessage,
    });
    const statsLine = await buildCompactAnnounceStatsLine({
      sessionKey: params.childSessionKey,
      startedAt: params.startedAt,
      endedAt: params.endedAt,
    });
    const internalEvents = [
      {
        type: "task_completion",
        source: announceType === "cron job" ? "cron" : "subagent",
        childSessionKey: params.childSessionKey,
        childSessionId: announceSessionId,
        announceType,
        taskLabel,
        status: outcome.status,
        statusLabel,
        result: findings,
        statsLine,
        replyInstruction,
      },
    ];
    const triggerMessage = buildAnnounceSteerMessage(internalEvents);
    let directOrigin = targetRequesterOrigin;
    if (!requesterIsSubagent) {
      const { entry } = loadRequesterSessionEntry(targetRequesterSessionKey);
      directOrigin = resolveAnnounceOrigin(entry, targetRequesterOrigin);
    }
    const completionDirectOrigin =
      expectsCompletionMessage && !requesterIsSubagent
        ? await resolveSubagentCompletionOrigin({
            childSessionKey: params.childSessionKey,
            requesterSessionKey: targetRequesterSessionKey,
            requesterOrigin: directOrigin,
            childRunId: params.childRunId,
            spawnMode: params.spawnMode,
            expectsCompletionMessage,
          })
        : targetRequesterOrigin;
    const directIdempotencyKey = buildAnnounceIdempotencyKey(announceId);
    const delivery = await deliverSubagentAnnouncement({
      requesterSessionKey: targetRequesterSessionKey,
      announceId,
      triggerMessage,
      steerMessage: triggerMessage,
      internalEvents,
      summaryLine: taskLabel,
      requesterSessionOrigin: targetRequesterOrigin,
      requesterOrigin:
        expectsCompletionMessage && !requesterIsSubagent
          ? completionDirectOrigin
          : targetRequesterOrigin,
      completionDirectOrigin,
      directOrigin,
      sourceSessionKey: params.childSessionKey,
      sourceChannel: INTERNAL_MESSAGE_CHANNEL,
      sourceTool: "subagent_announce",
      targetRequesterSessionKey,
      requesterIsSubagent,
      expectsCompletionMessage,
      bestEffortDeliver: params.bestEffortDeliver,
      directIdempotencyKey,
      signal: params.signal,
    });
    params.onDeliveryResult?.(delivery);
    didAnnounce = delivery.delivered || delivery.terminal === true;
    if (!delivery.delivered && delivery.path === "direct" && delivery.error)
      defaultRuntime.log(
        `[warn] Subagent completion direct announce failed for run ${params.childRunId}: ${delivery.error}`,
      );
  } catch (err) {
    defaultRuntime.error?.(`Subagent announce failed: ${String(err)}`);
  } finally {
    if (params.label)
      try {
        await subagentAnnounceDeps.callGateway({
          method: "sessions.patch",
          params: {
            key: params.childSessionKey,
            label: params.label,
          },
          timeoutMs: 1e4,
        });
      } catch {}
    if (shouldDeleteChildSession && (params.onBeforeDeleteChildSession?.() ?? true))
      await deleteSubagentSessionForCleanup({
        callGateway: subagentAnnounceDeps.callGateway,
        childSessionKey: params.childSessionKey,
        spawnMode: params.spawnMode,
      });
  }
  return didAnnounce;
}
const testing = {
  setDepsForTest(overrides) {
    const callGatewayOverride = overrides?.callGateway;
    const dispatchGatewayMethodInProcessOverride =
      overrides?.dispatchGatewayMethodInProcess ??
      (callGatewayOverride
        ? async (method, agentParams, options) =>
            await callGatewayOverride({
              method,
              params: agentParams,
              expectFinal: options?.expectFinal,
              timeoutMs: options?.timeoutMs,
            })
        : void 0);
    subagentAnnounceDeps = overrides
      ? {
          ...defaultSubagentAnnounceDeps,
          ...overrides,
          ...(dispatchGatewayMethodInProcessOverride
            ? { dispatchGatewayMethodInProcess: dispatchGatewayMethodInProcessOverride }
            : {}),
        }
      : defaultSubagentAnnounceDeps;
  },
};
//#endregion
export {
  buildSubagentSystemPrompt,
  captureSubagentCompletionReply,
  runSubagentAnnounceFlow,
  testing,
};
