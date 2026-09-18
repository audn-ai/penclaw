import { r as disposeAllSessionMcpRuntimes } from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import {
  a as isChatAbortControllerEntryAbortable,
  c as removeChatAbortControllerEntry,
  r as abortTrackedChatRunById,
} from "./chat-abort-DGc7CDOP.js";
import { n as abortQueuedChatTurns } from "./chat-queued-turns-DWyXqGgL.js";
import {
  m as triggerInternalHook,
  n as createInternalHookEvent,
} from "./internal-hooks-CckLIOgu.js";
import { a as closePluginStateDatabase } from "./plugin-state-store-CdAHpy0G.js";
import "./plugins-BKdf-5tW.js";
import { n as disposeRegisteredAgentHarnesses } from "./registry-ef8V3P8D.js";
import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import {
  n as collectGatewayProcessMemoryUsageMb,
  o as measureGatewayRestartTrace,
  s as recordGatewayRestartTrace,
} from "./restart-trace-BLjTAm1g.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { i as createAgentRunRestartAbortError } from "./run-termination-BEbihwT8.js";
import { n as createChatAbortMarker } from "./server-chat-state-BIl6X0N8.js";
import { r as drainActiveSessionsForShutdown } from "./session-reset-service-DmIkbVGF.js";
import { t as clearSessionSuspensionTimers } from "./session-suspension-BASgM8K9.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/gateway/server-close.ts
const shutdownLog = createSubsystemLogger("gateway/shutdown");
const GATEWAY_SHUTDOWN_HOOK_TIMEOUT_MS = 5e3;
const GATEWAY_PRE_RESTART_HOOK_TIMEOUT_MS = 1e4;
const ACTIVE_SESSIONS_SHUTDOWN_DRAIN_TIMEOUT_MS = 2e3;
const WEBSOCKET_CLOSE_GRACE_MS = 1e3;
const WEBSOCKET_CLOSE_FORCE_CONTINUE_MS = 250;
const HTTP_CLOSE_GRACE_MS = 1e3;
const HTTP_CLOSE_FORCE_WAIT_MS = 5e3;
const MCP_RUNTIME_CLOSE_GRACE_MS = 5e3;
const LSP_RUNTIME_CLOSE_GRACE_MS = 5e3;
const RESTART_REPLY_DRAIN_POLL_MS = 100;
const RESTART_REPLY_POST_ABORT_DRAIN_TIMEOUT_MS = 1e3;
const RESTART_REPLY_POST_ABORT_DRAIN_POLL_MS = 50;
const RESTART_TERMINAL_PERSISTENCE_WAIT_TIMEOUT_MS = 1e3;
const RESTART_MARKER_SLOW_WARNING_MS = 1e3;
/** Create a timeout promise plus cleanup hook for shutdown races. */
function createTimeoutRace(timeoutMs, onTimeout) {
  let timer = null;
  timer = setTimeout(() => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    resolve(onTimeout());
  }, timeoutMs);
  timer.unref?.();
  let resolve;
  return {
    promise: new Promise((innerResolve) => {
      resolve = innerResolve;
    }),
    clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}
/** Run one shutdown step and record a warning instead of aborting the whole close. */
async function shutdownStep(name, fn, warnings) {
  try {
    await fn();
    return true;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    shutdownLog.warn(`${name}: ${detail}`);
    recordShutdownWarning(warnings, name);
    return false;
  }
}
/** Record a shutdown warning once. */
function recordShutdownWarning(warnings, name) {
  if (!warnings.includes(name)) warnings.push(name);
}
/** Count pending replies and active runs that must drain before restart shutdown. */
function getRestartReplyDrainCounts(params) {
  const pendingReplyCount = params.getPendingReplyCount();
  const activeRuns = listRestartDrainRuns(params.chatAbortControllers).length;
  const queuedTurns = Array.from(
    params.chatQueuedTurns.values(),
    (entry) => entry.controller.signal.aborted,
  ).filter((aborted) => !aborted).length;
  return {
    pendingReplies:
      Number.isFinite(pendingReplyCount) && pendingReplyCount > 0
        ? Math.floor(pendingReplyCount)
        : 0,
    activeRuns,
    queuedTurns,
  };
}
/** List unaborted runs still owned by the restart lifecycle. */
function listUnabortedRestartRuns(chatAbortControllers) {
  return Array.from(chatAbortControllers.entries()).filter(
    ([, entry]) => !entry.controller.signal.aborted,
  );
}
/** List runtime-active runs participating in restart drain. */
function listRestartDrainRuns(chatAbortControllers) {
  return listUnabortedRestartRuns(chatAbortControllers).filter(
    ([, entry]) => entry.registrationCleanupRequested !== true,
  );
}
/** List active runs whose session lifecycle still needs restart recovery. */
function listRestartRecoveryRuns(chatAbortControllers) {
  return listUnabortedRestartRuns(chatAbortControllers).filter(
    ([, entry]) =>
      entry.controlUiVisible !== false &&
      (entry.registrationCleanupRequested !== true ||
        entry.projectSessionTerminalPersisted !== true),
  );
}
/** Format drain counts for shutdown logs. */
function formatRestartReplyDrainDetails(counts) {
  const details = [];
  if (counts.pendingReplies > 0) details.push(`${counts.pendingReplies} pending reply(ies)`);
  if (counts.activeRuns > 0) details.push(`${counts.activeRuns} active run(s)`);
  if (counts.queuedTurns > 0) details.push(`${counts.queuedTurns} queued turn(s)`);
  return details.length > 0 ? details.join(", ") : "no pending reply work";
}
/** Sleep helper with unref'd timer for restart drain polling. */
async function sleepForRestartReplyDrain(delayMs) {
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs).unref?.();
  });
}
/** Wait for pending replies and active runs to drain before restart shutdown. */
async function waitForRestartReplyDrain(params) {
  const timeoutMs = Math.max(0, Math.floor(params.timeoutMs));
  const pollMs = Math.max(25, Math.floor(params.pollMs ?? RESTART_REPLY_DRAIN_POLL_MS));
  let counts = getRestartReplyDrainCounts(params);
  if (counts.pendingReplies <= 0 && counts.activeRuns <= 0 && counts.queuedTurns <= 0)
    return {
      drained: true,
      elapsedMs: 0,
      counts,
    };
  if (timeoutMs <= 0)
    return {
      drained: false,
      elapsedMs: 0,
      counts,
    };
  const startedAt = Date.now();
  for (;;) {
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs >= timeoutMs)
      return {
        drained: false,
        elapsedMs,
        counts,
      };
    await sleepForRestartReplyDrain(Math.min(pollMs, timeoutMs - elapsedMs));
    counts = getRestartReplyDrainCounts(params);
    if (counts.pendingReplies <= 0 && counts.activeRuns <= 0 && counts.queuedTurns <= 0)
      return {
        drained: true,
        elapsedMs: Date.now() - startedAt,
        counts,
      };
  }
}
function collectActiveRestartSessionRefs(params) {
  const sessionKeys = /* @__PURE__ */ new Set();
  const sessionIds = /* @__PURE__ */ new Set();
  const activeRuns = /* @__PURE__ */ new Map();
  const observedAt = Date.now();
  const addRun = (run) => {
    sessionKeys.add(run.sessionKey);
    sessionIds.add(run.sessionId);
    activeRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, {
      ...run,
      observedAt: run.observedAt ?? observedAt,
    });
  };
  for (const [runId, entry] of listRestartRecoveryRuns(params.chatAbortControllers)) {
    const sessionKey = entry.sessionKey.trim();
    if (sessionKey) sessionKeys.add(sessionKey);
    const sessionId =
      (entry.kind === "agent" || !sessionKey
        ? void 0
        : params.resolveActiveSessionIdForKey?.(sessionKey)) || entry.sessionId.trim();
    if (sessionId) sessionIds.add(sessionId);
    if (runId && entry.lifecycleGeneration && sessionKey && sessionId)
      addRun({
        runId,
        lifecycleGeneration: entry.lifecycleGeneration,
        sessionKey,
        sessionId,
        observedAt: entry.projectSessionTerminalObservedAt,
      });
  }
  for (const candidate of params.restartRecoveryCandidates?.values() ?? []) {
    const resolvedSessionId = params.resolveActiveSessionIdForKey?.(candidate.sessionKey);
    addRun({
      ...candidate,
      sessionId: resolvedSessionId || candidate.sessionId,
    });
  }
  return {
    sessionKeys,
    sessionIds,
    activeRuns: [...activeRuns.values()],
  };
}
async function settleTerminalSessionPersistenceForRestart(chatAbortControllers) {
  const pending = listUnabortedRestartRuns(chatAbortControllers).flatMap(([, entry]) => {
    const persistence = entry.projectSessionTerminalPersistence;
    if (entry.projectSessionActive !== false || !persistence) return [];
    return [
      {
        entry,
        persistence,
      },
    ];
  });
  if (pending.length === 0) return;
  const timeout = createTimeoutRace(RESTART_TERMINAL_PERSISTENCE_WAIT_TIMEOUT_MS, () => null);
  const results = await Promise.race([
    Promise.allSettled(pending.map(({ persistence }) => persistence)),
    timeout.promise,
  ]);
  timeout.clear();
  if (!results) {
    shutdownLog.warn(
      `terminal session persistence did not settle within ${RESTART_TERMINAL_PERSISTENCE_WAIT_TIMEOUT_MS}ms; preserving restart recovery`,
    );
    return;
  }
  for (const [index, result] of results.entries()) {
    const tracked = pending[index];
    if (!tracked || tracked.entry.projectSessionTerminalPersistence !== tracked.persistence)
      continue;
    tracked.entry.projectSessionTerminalPersistence = void 0;
    if (result.status === "fulfilled") tracked.entry.projectSessionTerminalPersisted = true;
  }
}
async function markActiveRunsForRestartRecovery(params) {
  if (!params.markMainSessionsAbortedForRestart) return;
  await settleTerminalSessionPersistenceForRestart(params.chatAbortControllers);
  const refs = collectActiveRestartSessionRefs(params);
  if (refs.sessionKeys.size === 0 && refs.sessionIds.size === 0) return;
  try {
    const markerTimeout = createTimeoutRace(RESTART_MARKER_SLOW_WARNING_MS, () => "timeout");
    const markerOutcome = Promise.resolve(
      params.markMainSessionsAbortedForRestart({
        ...refs,
        reason: params.reason,
        isActiveRun: (run) => {
          const entry = params.chatAbortControllers.get(run.runId);
          const candidate = params.restartRecoveryCandidates?.get(run.runId);
          return (
            (entry &&
              !entry.controller.signal.aborted &&
              (entry.registrationCleanupRequested !== true ||
                entry.projectSessionTerminalPersisted !== true) &&
              entry.lifecycleGeneration === run.lifecycleGeneration) ||
            candidate?.lifecycleGeneration === run.lifecycleGeneration
          );
        },
      }),
    ).then(
      () => ({ status: "completed" }),
      (error) => ({
        status: "failed",
        error,
      }),
    );
    const firstOutcome = await Promise.race([markerOutcome, markerTimeout.promise]);
    markerTimeout.clear();
    if (firstOutcome === "timeout") {
      shutdownLog.warn(
        `restart session marker did not settle within ${RESTART_MARKER_SLOW_WARNING_MS}ms; waiting before shutdown`,
      );
      recordShutdownWarning(params.warnings, "restart-main-session-marker");
      const delayedOutcome = await markerOutcome;
      if (delayedOutcome.status === "failed") throw delayedOutcome.error;
    } else if (firstOutcome.status === "failed") throw firstOutcome.error;
    for (const run of refs.activeRuns) params.restartRecoveryCandidates?.delete(run.runId);
  } catch (err) {
    shutdownLog.warn(`failed to mark active main session(s) for restart recovery: ${String(err)}`);
    recordShutdownWarning(params.warnings, "restart-main-session-marker");
  }
}
/** Abort active chat runs that did not drain before restart shutdown. */
function abortActiveRunsForRestart(params) {
  let aborted = 0;
  for (const [runId, entry] of listUnabortedRestartRuns(params.chatAbortControllers)) {
    if (!isChatAbortControllerEntryAbortable(entry)) continue;
    if (entry.projectSessionActive === false) {
      entry.abortStopReason = "restart";
      entry.controller.abort(createAgentRunRestartAbortError());
      removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
      params.chatRunState.abortedRuns.set(runId, createChatAbortMarker());
      params.chatRunState.clearRun(runId);
      const removed = params.removeChatRun(runId, runId, entry.sessionKey);
      params.agentRunSeq.delete(runId);
      if (removed?.clientRunId) params.agentRunSeq.delete(removed.clientRunId);
      aborted += 1;
      continue;
    }
    if (
      abortTrackedChatRunById(
        {
          ...params,
          chatRunBuffers: params.chatRunState.buffers,
        },
        {
          runId,
          sessionKey: entry.sessionKey,
          stopReason: "restart",
        },
      ).aborted
    )
      aborted += 1;
  }
  return aborted;
}
/** Abort queued owners before active teardown can promote them into the closing runtime. */
function abortQueuedTurnsForRestart(params) {
  const matches = Array.from(params.chatQueuedTurns, ([runId, entry]) => ({
    runId,
    entry,
  }));
  return abortQueuedChatTurns(params.chatQueuedTurns, matches, "restart").length;
}
/** Drain or abort pending reply work before restart shutdown proceeds. */
async function drainRestartPendingRepliesForShutdown(params) {
  const initialCounts = getRestartReplyDrainCounts(params);
  if (
    initialCounts.pendingReplies <= 0 &&
    initialCounts.activeRuns <= 0 &&
    initialCounts.queuedTurns <= 0
  ) {
    abortQueuedTurnsForRestart(params);
    await markActiveRunsForRestartRecovery({
      ...params,
      reason: "gateway restart shutdown",
    });
    abortActiveRunsForRestart(params);
    return;
  }
  const timeoutMs = Math.max(0, Math.floor(params.timeoutMs));
  if (timeoutMs > 0)
    shutdownLog.info(
      `waiting for ${formatRestartReplyDrainDetails(initialCounts)} before restart shutdown (timeout ${timeoutMs}ms)`,
    );
  const drainResult = await waitForRestartReplyDrain({
    getPendingReplyCount: params.getPendingReplyCount,
    chatAbortControllers: params.chatAbortControllers,
    chatQueuedTurns: params.chatQueuedTurns,
    timeoutMs,
  });
  if (drainResult.drained) {
    abortQueuedTurnsForRestart(params);
    await markActiveRunsForRestartRecovery({
      ...params,
      reason: "gateway restart shutdown",
    });
    abortActiveRunsForRestart(params);
    shutdownLog.info(`restart reply drain completed after ${drainResult.elapsedMs}ms`);
    return;
  }
  shutdownLog.warn(
    `restart reply drain timed out after ${drainResult.elapsedMs}ms with ${formatRestartReplyDrainDetails(drainResult.counts)} still active; continuing shutdown`,
  );
  recordShutdownWarning(params.warnings, "restart-reply-drain");
  const abortedQueuedTurns = abortQueuedTurnsForRestart(params);
  if (abortedQueuedTurns > 0)
    shutdownLog.warn(`aborted ${abortedQueuedTurns} queued turn(s) during restart shutdown`);
  if (
    drainResult.counts.activeRuns <= 0 &&
    (params.restartRecoveryCandidates?.size ?? 0) === 0 &&
    listRestartRecoveryRuns(params.chatAbortControllers).length === 0
  )
    return;
  await markActiveRunsForRestartRecovery({
    ...params,
    reason: "gateway restart shutdown",
  });
  const abortedRuns = abortActiveRunsForRestart(params);
  if (abortedRuns <= 0) return;
  shutdownLog.warn(`aborted ${abortedRuns} active run(s) during restart shutdown`);
  if (
    (
      await waitForRestartReplyDrain({
        getPendingReplyCount: params.getPendingReplyCount,
        chatAbortControllers: params.chatAbortControllers,
        chatQueuedTurns: params.chatQueuedTurns,
        timeoutMs: RESTART_REPLY_POST_ABORT_DRAIN_TIMEOUT_MS,
        pollMs: RESTART_REPLY_POST_ABORT_DRAIN_POLL_MS,
      })
    ).drained
  )
    shutdownLog.info("restart reply drain completed after abort cleanup");
}
async function triggerGatewayLifecycleHookWithTimeout(params) {
  let timeout;
  const hookPromise = triggerInternalHook(params.event);
  hookPromise.catch(() => void 0);
  try {
    const result = await Promise.race([
      hookPromise.then(() => "completed"),
      new Promise((resolve) => {
        timeout = setTimeout(() => resolve("timeout"), params.timeoutMs);
        timeout.unref?.();
      }),
    ]);
    if (result === "timeout")
      shutdownLog.warn(
        `${params.hookName} hook timed out after ${params.timeoutMs}ms; continuing shutdown`,
      );
    return result;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
async function disposeRuntimeWithShutdownGrace(params) {
  const disposePromise = Promise.resolve()
    .then(params.dispose)
    .catch((err) => {
      shutdownLog.warn(`${params.label} runtime disposal failed during shutdown: ${String(err)}`);
      recordShutdownWarning(params.warnings, params.label);
    });
  const disposeTimeout = createTimeoutRace(params.graceMs, () => {
    shutdownLog.warn(
      `${params.label} runtime disposal exceeded ${params.graceMs}ms; continuing shutdown`,
    );
    recordShutdownWarning(params.warnings, params.label);
  });
  await Promise.race([disposePromise, disposeTimeout.promise]);
  disposeTimeout.clear();
}
async function disposeAllBundleLspRuntimesOnDemand() {
  const { disposeAllBundleLspRuntimes } = await import("./agent-bundle-lsp-runtime-CB57UxdM.js");
  await disposeAllBundleLspRuntimes();
}
async function stopGmailWatcherOnDemand() {
  const { stopGmailWatcher } = await import("./gmail-watcher-CSdWq-tq.js");
  await stopGmailWatcher();
}
async function runGatewayClosePrelude(params) {
  params.stopDiagnostics?.();
  params.clearSkillsRefreshTimer?.();
  params.skillsChangeUnsub?.();
  params.disposeAuthRateLimiter?.();
  params.disposeBrowserAuthRateLimiter();
  params.stopModelPricingRefresh?.();
  await params.stopChannelHealthMonitor?.();
  params.stopReadinessEventLoopHealth?.();
  params.clearSecretsRuntimeSnapshot?.();
  await params.closeMcpServer?.().catch(() => {});
}
function isServerNotRunningError(err) {
  return Boolean(
    err && typeof err === "object" && "code" in err && err.code === "ERR_SERVER_NOT_RUNNING",
  );
}
async function waitForHttpClose(params) {
  const timeout = createTimeoutRace(params.timeoutMs, () => false);
  try {
    return await Promise.race([
      params.closePromise.then(
        () => true,
        (err) => {
          throw err;
        },
      ),
      timeout.promise,
    ]).catch((err) => {
      const detail = err instanceof Error ? err.message : String(err);
      shutdownLog.warn(`${params.label}: ${detail}`);
      recordShutdownWarning(params.warnings, params.label);
      return true;
    });
  } finally {
    timeout.clear();
  }
}
function createGatewayCloseHandler(params) {
  return async (opts) => {
    const start = Date.now();
    const warnings = [];
    const reason = (normalizeOptionalString(opts?.reason) ?? "") || "gateway stopping";
    const restartExpectedMs =
      typeof opts?.restartExpectedMs === "number" && Number.isFinite(opts.restartExpectedMs)
        ? Math.max(0, Math.floor(opts.restartExpectedMs))
        : null;
    const measureCloseStep = (name, run) =>
      measureGatewayRestartTrace(`restart.close.${name}`, run, [["reason", reason]]);
    try {
      clearSessionSuspensionTimers();
      shutdownLog.debug(`shutdown started: ${reason}`);
      await measureCloseStep("config-reloader", () =>
        shutdownStep("config-reloader", () => params.configReloader.stop(), warnings),
      );
      await measureCloseStep("gateway-shutdown-hook", () =>
        shutdownStep(
          "gateway:shutdown",
          async () => {
            if (
              (await triggerGatewayLifecycleHookWithTimeout({
                event: createInternalHookEvent("gateway", "shutdown", "gateway:shutdown", {
                  reason,
                  restartExpectedMs,
                }),
                hookName: "gateway:shutdown",
                timeoutMs: GATEWAY_SHUTDOWN_HOOK_TIMEOUT_MS,
              })) === "timeout"
            )
              recordShutdownWarning(warnings, "gateway:shutdown");
          },
          warnings,
        ),
      );
      if (restartExpectedMs !== null)
        await measureCloseStep("gateway-pre-restart-hook", () =>
          shutdownStep(
            "gateway:pre-restart",
            async () => {
              if (
                (await triggerGatewayLifecycleHookWithTimeout({
                  event: createInternalHookEvent("gateway", "pre-restart", "gateway:pre-restart", {
                    reason,
                    restartExpectedMs,
                  }),
                  hookName: "gateway:pre-restart",
                  timeoutMs: GATEWAY_PRE_RESTART_HOOK_TIMEOUT_MS,
                })) === "timeout"
              )
                recordShutdownWarning(warnings, "gateway:pre-restart");
            },
            warnings,
          ),
        );
      if (restartExpectedMs !== null && params.getPendingReplyCount) {
        const drainTimeoutMs =
          typeof opts?.drainTimeoutMs === "number" && Number.isFinite(opts.drainTimeoutMs)
            ? Math.max(0, Math.floor(opts.drainTimeoutMs))
            : 0;
        await measureCloseStep("reply-drain", () =>
          shutdownStep(
            "restart-reply-drain",
            () =>
              drainRestartPendingRepliesForShutdown({
                getPendingReplyCount: params.getPendingReplyCount,
                chatAbortControllers: params.chatAbortControllers,
                chatQueuedTurns: params.chatQueuedTurns,
                restartRecoveryCandidates: params.restartRecoveryCandidates,
                chatRunState: params.chatRunState,
                removeChatRun: params.removeChatRun,
                agentRunSeq: params.agentRunSeq,
                broadcast: params.broadcast,
                nodeSendToSession: params.nodeSendToSession,
                markMainSessionsAbortedForRestart: params.markMainSessionsAbortedForRestart,
                resolveActiveSessionIdForKey: params.resolveActiveSessionIdForKey,
                timeoutMs: drainTimeoutMs,
                warnings,
              }),
            warnings,
          ),
        );
      }
      if (params.drainActiveSessionsForShutdown)
        await measureCloseStep("session-end-drain", () =>
          shutdownStep(
            "session-end-drain",
            async () => {
              const drainReason = restartExpectedMs !== null ? "restart" : "shutdown";
              const result = await params.drainActiveSessionsForShutdown({
                reason: drainReason,
                totalTimeoutMs: ACTIVE_SESSIONS_SHUTDOWN_DRAIN_TIMEOUT_MS,
              });
              if (result.timedOut) {
                shutdownLog.warn(
                  `session-end-drain timed out after ${ACTIVE_SESSIONS_SHUTDOWN_DRAIN_TIMEOUT_MS}ms after ${result.emittedSessionIds.length} sessions; continuing shutdown`,
                );
                recordShutdownWarning(warnings, "session-end-drain");
              }
            },
            warnings,
          ),
        );
      if (params.bonjourStop) await shutdownStep("bonjour", () => params.bonjourStop(), warnings);
      if (params.tailscaleCleanup)
        await shutdownStep("tailscale", () => params.tailscaleCleanup(), warnings);
      if (params.postReadySidecars?.length)
        await measureCloseStep("post-ready-sidecars", async () => {
          for (const [index, sidecar] of params.postReadySidecars.entries())
            await shutdownStep(`post-ready-sidecar/${index}`, () => sidecar.stop(), warnings);
        });
      if (params.pluginServices)
        await measureCloseStep("plugin-services", () =>
          shutdownStep("plugin-services", () => params.pluginServices.stop(), warnings),
        );
      await measureCloseStep("channels", async () => {
        const channelIds = params.channelIds ?? listChannelPlugins().map((plugin) => plugin.id);
        for (const channelId of channelIds)
          await shutdownStep(`channel/${channelId}`, () => params.stopChannel(channelId), warnings);
      });
      await shutdownStep("agent-harnesses", () => disposeRegisteredAgentHarnesses(), warnings);
      await measureCloseStep("bundle-runtimes", async () => {
        await Promise.all([
          disposeRuntimeWithShutdownGrace({
            label: "bundle-mcp",
            dispose: params.disposeSessionMcpRuntimes ?? disposeAllSessionMcpRuntimes,
            graceMs: MCP_RUNTIME_CLOSE_GRACE_MS,
            warnings,
          }),
          disposeRuntimeWithShutdownGrace({
            label: "bundle-lsp",
            dispose: params.disposeBundleLspRuntimes ?? disposeAllBundleLspRuntimesOnDemand,
            graceMs: LSP_RUNTIME_CLOSE_GRACE_MS,
            warnings,
          }),
        ]);
      });
      await shutdownStep("plugin-state-store", () => closePluginStateDatabase(), warnings);
      await measureCloseStep("gmail-watcher", () =>
        shutdownStep("gmail-watcher", () => stopGmailWatcherOnDemand(), warnings),
      );
      params.cron.stop();
      params.heartbeatRunner.stop();
      await shutdownStep(
        "task-registry-maintenance",
        () => params.stopTaskRegistryMaintenance?.(),
        warnings,
      );
      await shutdownStep("update-check", () => params.updateCheckStop?.(), warnings);
      for (const timer of params.nodePresenceTimers.values()) clearInterval(timer);
      params.nodePresenceTimers.clear();
      params.broadcast("shutdown", {
        reason,
        restartExpectedMs,
      });
      clearInterval(params.tickInterval);
      clearInterval(params.healthInterval);
      clearInterval(params.dedupeCleanup);
      if (params.mediaCleanup) clearInterval(params.mediaCleanup);
      if (params.worktreeCleanup) clearInterval(params.worktreeCleanup);
      params.skillCuratorCleanup();
      if (params.agentUnsub) await shutdownStep("agent-unsub", () => params.agentUnsub(), warnings);
      if (params.heartbeatUnsub)
        await shutdownStep("heartbeat-unsub", () => params.heartbeatUnsub(), warnings);
      if (params.transcriptUnsub)
        await shutdownStep("transcript-unsub", () => params.transcriptUnsub(), warnings);
      if (params.lifecycleUnsub)
        await shutdownStep("lifecycle-unsub", () => params.lifecycleUnsub(), warnings);
      if (params.taskUnsub) await shutdownStep("task-unsub", () => params.taskUnsub(), warnings);
      params.chatRunState.clear();
      let clientCloseFailures = 0;
      for (const c of params.clients)
        try {
          c.socket.close(
            1012,
            c.connectionKind === "worker" ? "gateway-shutdown" : "service restart",
          );
        } catch {
          clientCloseFailures++;
        }
      if (clientCloseFailures > 0) {
        shutdownLog.warn(`failed to close ${clientCloseFailures} WebSocket client(s)`);
        recordShutdownWarning(warnings, "ws-clients");
      }
      params.clients.clear();
      await measureCloseStep("websocket-server", async () => {
        const wsClients = params.wss.clients ?? /* @__PURE__ */ new Set();
        const closePromise = new Promise((resolve) => {
          params.wss.close(() => resolve());
        });
        const websocketGraceTimeout = createTimeoutRace(WEBSOCKET_CLOSE_GRACE_MS, () => false);
        const closedWithinGrace = await Promise.race([
          closePromise.then(() => true),
          websocketGraceTimeout.promise,
        ]);
        websocketGraceTimeout.clear();
        if (!closedWithinGrace) {
          shutdownLog.warn(
            `websocket server close exceeded ${WEBSOCKET_CLOSE_GRACE_MS}ms; forcing shutdown continuation with ${wsClients.size} tracked client(s)`,
          );
          recordShutdownWarning(warnings, "websocket-server");
          for (const client of wsClients)
            try {
              client.terminate();
            } catch {}
          const websocketForceTimeout = createTimeoutRace(WEBSOCKET_CLOSE_FORCE_CONTINUE_MS, () => {
            shutdownLog.warn(
              `websocket server close still pending after ${WEBSOCKET_CLOSE_FORCE_CONTINUE_MS}ms force window; continuing shutdown`,
            );
          });
          await Promise.race([closePromise, websocketForceTimeout.promise]);
          websocketForceTimeout.clear();
        }
      });
      await measureCloseStep("http-server", async () => {
        const servers =
          params.httpServers && params.httpServers.length > 0
            ? params.httpServers
            : [params.httpServer];
        for (let i = 0; i < servers.length; i++) {
          const httpServer = servers[i];
          const label = servers.length > 1 ? `http-server[${i}]` : "http-server";
          if (typeof httpServer.closeIdleConnections === "function")
            httpServer.closeIdleConnections();
          const closePromise = new Promise((resolve, reject) => {
            httpServer.close((err) => {
              if (!err || isServerNotRunningError(err)) {
                resolve();
                return;
              }
              reject(err);
            });
          });
          closePromise.catch(() => void 0);
          if (
            !(await waitForHttpClose({
              closePromise,
              timeoutMs: HTTP_CLOSE_GRACE_MS,
              label,
              warnings,
            }))
          ) {
            shutdownLog.warn(
              `${label} close exceeded ${HTTP_CLOSE_GRACE_MS}ms; forcing connection shutdown and waiting for close`,
            );
            recordShutdownWarning(warnings, label);
            httpServer.closeAllConnections?.();
            if (
              !(await waitForHttpClose({
                closePromise,
                timeoutMs: HTTP_CLOSE_FORCE_WAIT_MS,
                label,
                warnings,
              }))
            )
              throw new Error(
                `${label} close still pending after forced connection shutdown (${HTTP_CLOSE_FORCE_WAIT_MS}ms)`,
              );
          }
        }
      });
    } finally {
      try {
        params.releasePluginRouteRegistry?.();
      } catch {}
    }
    const durationMs = Date.now() - start;
    if (warnings.length > 0)
      shutdownLog.warn(
        `shutdown completed in ${durationMs}ms with warnings: ${warnings.join(", ")}`,
      );
    else shutdownLog.info(`shutdown completed cleanly in ${durationMs}ms`);
    recordGatewayRestartTrace("restart.close.total", durationMs, [
      ["reason", reason],
      ["restartExpectedMs", restartExpectedMs ?? "none"],
      ...collectGatewayProcessMemoryUsageMb(),
    ]);
    return {
      durationMs,
      warnings,
    };
  };
}
//#endregion
export { createGatewayCloseHandler, drainActiveSessionsForShutdown, runGatewayClosePrelude };
