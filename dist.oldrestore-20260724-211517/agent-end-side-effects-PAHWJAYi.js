import { randomUUID } from "node:crypto";
import {
  _ as resolveContextEngineCapabilities,
  n as buildAfterTurnRuntimeContextFromUsage,
  t as buildAfterTurnRuntimeContext,
} from "./attempt.prompt-helpers-CztYiE1m.js";
import { d as isGatewayDraining, r as enqueueCommandInLane } from "./command-queue-CVn1dJsm.js";
import {
  c as recordTaskRunProgressByRunId,
  i as failTaskRunByRunId,
  n as createQueuedTaskRun,
  t as completeTaskRunByRunId,
  u as startTaskRunByRunId,
} from "./detached-task-runtime-DYTrA0lL.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as GatewayDrainingError } from "./gateway-work-admission-yGjmBAjy.js";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-BibWlia2.js";
import { p as stripRuntimeContextCustomMessages } from "./internal-runtime-context-BW7WOTKc.js";
import {
  r as runAgentHarnessAgentEndHook,
  t as awaitAgentHarnessAgentEndHook,
} from "./lifecycle-hook-helpers-qaFalH5z.js";
import { t as log$1 } from "./logger-C5RMMskO.js";
import { D as findActiveSessionTask } from "./openclaw-tools-DGecpaCF.js";
import { s as resolveContextEngineOwnerPluginId } from "./registry-DXbEDAsr.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  c as updateTaskNotifyPolicyForOwner,
  i as findTaskByRunIdForOwner,
  n as cancelTaskByIdForOwner,
} from "./task-owner-access-CsO1Y--R.js";
import {
  n as rewriteTranscriptEntriesInSessionManager,
  t as rewriteTranscriptEntriesInRuntimeTranscript,
} from "./transcript-rewrite-BBGM2z7j.js";
//#region src/context-engine/runtime-settings.ts
const RUNTIME_REASON_CODES = /* @__PURE__ */ new Set([
  "provider_timeout",
  "provider_unavailable",
  "rate_limited",
  "context_overflow",
  "runtime_unavailable",
  "unknown",
]);
function normalizeNullableString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
function normalizeNullableNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function normalizeReasonCode(value) {
  const normalized = normalizeNullableString(value);
  if (!normalized) return null;
  if (RUNTIME_REASON_CODES.has(normalized)) return normalized;
  const lower = normalized.toLowerCase();
  if (lower.includes("timeout")) return "provider_timeout";
  if (lower.includes("rate") || lower.includes("limit") || lower.includes("429"))
    return "rate_limited";
  if (lower.includes("overflow") || lower.includes("context") || lower.includes("pressure"))
    return "context_overflow";
  if (lower.includes("runtime")) return "runtime_unavailable";
  if (lower.includes("provider") || lower.includes("primary") || lower.includes("unavailable"))
    return "provider_unavailable";
  return "unknown";
}
function buildContextEngineRuntimeSettings(params) {
  const hostId = normalizeNullableString(params.contextEngineHost.id);
  const selectedId = normalizeNullableString(params.selectedContextEngineId);
  const selectionSource =
    params.contextEngineSelectionSource ?? (selectedId ? "configured" : "unknown");
  const requestedModel = normalizeNullableString(params.requestedModel);
  const resolvedModel = normalizeNullableString(params.resolvedModel);
  const fallbackReason = normalizeReasonCode(params.fallbackReason);
  const degradedReason = normalizeReasonCode(params.degradedReason);
  const resolvedViaFallback =
    requestedModel !== null && resolvedModel !== null && requestedModel !== resolvedModel;
  return {
    schemaVersion: 1,
    runtime: {
      host: "openclaw",
      mode:
        params.mode ??
        (degradedReason
          ? "degraded"
          : fallbackReason || resolvedViaFallback
            ? "fallback"
            : "normal"),
      harnessId: normalizeNullableString(params.harnessId),
      runtimeId: normalizeNullableString(params.runtimeId),
    },
    model: {
      requested: requestedModel,
      resolved: resolvedModel,
      provider: normalizeNullableString(params.provider),
      family: normalizeNullableString(params.modelFamily),
    },
    contextEngineSelection: {
      selectedId,
      source: selectionSource,
    },
    executionHost: {
      id: hostId,
      label: normalizeNullableString(params.contextEngineHost.label),
    },
    limits: {
      promptTokenBudget: normalizeNullableNumber(params.promptTokenBudget),
      maxOutputTokens: normalizeNullableNumber(params.maxOutputTokens),
    },
    diagnostics: {
      fallbackReason,
      degradedReason,
    },
  };
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-maintenance.ts
/**
 * Schedules and runs deferred context-engine turn maintenance.
 */
const TURN_MAINTENANCE_TASK_KIND = "context_engine_turn_maintenance";
const TURN_MAINTENANCE_TASK_LABEL = "Context engine turn maintenance";
const TURN_MAINTENANCE_TASK_TASK = "Deferred context-engine maintenance after turn.";
const TURN_MAINTENANCE_LANE_PREFIX = "context-engine-turn-maintenance:";
const TURN_MAINTENANCE_LONG_WAIT_MS = 1e4;
const DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY = Symbol.for(
  "openclaw.contextEngineTurnMaintenanceAbortState",
);
const activeDeferredTurnMaintenanceRuns = /* @__PURE__ */ new Map();
function resolveDeferredTurnMaintenanceAbortState(processLike) {
  const existing = processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY];
  if (existing) return existing;
  const created = {
    registered: false,
    controllers: /* @__PURE__ */ new Set(),
    cleanupHandlers: /* @__PURE__ */ new Map(),
  };
  processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY] = created;
  return created;
}
function unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state) {
  if (!state.registered) return;
  for (const [signal, handler] of state.cleanupHandlers) processLike.off(signal, handler);
  state.cleanupHandlers.clear();
  state.registered = false;
}
function normalizeSessionKey(sessionKey) {
  return normalizeOptionalString(sessionKey) || void 0;
}
function resolveDeferredTurnMaintenanceLane(sessionKey) {
  return `${TURN_MAINTENANCE_LANE_PREFIX}${sessionKey}`;
}
async function disposeDeferredMaintenanceContextEngine(contextEngine) {
  try {
    await contextEngine.dispose?.();
  } catch (err) {
    log$1.warn("context engine dispose failed after deferred maintenance", {
      errorMessage: formatErrorMessage(err),
    });
  }
}
function createDeferredTurnMaintenanceAbortSignal(params) {
  if (typeof AbortController === "undefined")
    return {
      abortSignal: void 0,
      dispose: () => {},
    };
  const processLike = params?.processLike ?? process;
  const state = resolveDeferredTurnMaintenanceAbortState(processLike);
  const handleTerminationSignal = (signalName) => {
    const shouldReraise =
      typeof processLike.listenerCount === "function"
        ? processLike.listenerCount(signalName) === 1
        : false;
    for (const activeController of state.controllers)
      if (!activeController.signal.aborted)
        activeController.abort(
          /* @__PURE__ */ new Error(
            `received ${signalName} while waiting for deferred maintenance`,
          ),
        );
    state.controllers.clear();
    unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
    if (shouldReraise && typeof processLike.kill === "function")
      try {
        processLike.kill(processLike.pid ?? process.pid, signalName);
      } catch {}
  };
  if (!state.registered) {
    state.registered = true;
    const onSigint = () => handleTerminationSignal("SIGINT");
    const onSigterm = () => handleTerminationSignal("SIGTERM");
    state.cleanupHandlers.set("SIGINT", onSigint);
    state.cleanupHandlers.set("SIGTERM", onSigterm);
    processLike.on("SIGINT", onSigint);
    processLike.on("SIGTERM", onSigterm);
  }
  const controller = new AbortController();
  state.controllers.add(controller);
  let disposed = false;
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    state.controllers.delete(controller);
    if (state.controllers.size === 0)
      unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
  };
  return {
    abortSignal: controller.signal,
    dispose: cleanup,
  };
}
async function waitForDeferredTurnMaintenanceForSession(sessionKey) {
  const normalizedSessionKey = normalizeSessionKey(sessionKey);
  if (!normalizedSessionKey) return;
  await activeDeferredTurnMaintenanceRuns.get(normalizedSessionKey)?.promise;
}
function markDeferredTurnMaintenanceTaskScheduleFailure(params) {
  const errorMessage = formatErrorMessage(params.error);
  log$1.warn(`failed to schedule deferred context engine maintenance: ${errorMessage}`);
  cancelTaskByIdForOwner({
    taskId: params.taskId,
    callerOwnerKey: params.sessionKey,
    endedAt: Date.now(),
    terminalSummary: `Deferred maintenance could not be scheduled: ${errorMessage}`,
  });
}
function buildTurnMaintenanceTaskDescriptor(params) {
  const runId =
    params.runId ??
    `turn-maint:${params.sessionKey}:${Date.now().toString(36)}:${randomUUID().slice(0, 8)}`;
  return createQueuedTaskRun({
    runtime: "acp",
    taskKind: TURN_MAINTENANCE_TASK_KIND,
    sourceId: TURN_MAINTENANCE_TASK_KIND,
    requesterSessionKey: params.sessionKey,
    ownerKey: params.sessionKey,
    scopeKind: "session",
    runId,
    label: TURN_MAINTENANCE_TASK_LABEL,
    task: TURN_MAINTENANCE_TASK_TASK,
    notifyPolicy: params.notifyPolicy ?? "silent",
    deliveryStatus: params.deliveryStatus ?? "not_applicable",
    preferMetadata: true,
  });
}
function promoteTurnMaintenanceTaskVisibility(params) {
  return buildTurnMaintenanceTaskDescriptor({
    sessionKey: params.sessionKey,
    runId: params.runId,
    notifyPolicy: params.notifyPolicy,
    deliveryStatus: "pending",
  });
}
/**
 * Attach runtime-owned transcript rewrite helpers to an existing
 * context-engine runtime context payload.
 */
function buildContextEngineMaintenanceRuntimeContext(params) {
  return {
    ...params.runtimeContext,
    ...resolveContextEngineCapabilities({
      config: params.config,
      sessionKey: params.sessionKey,
      agentId: params.agentId,
      authProfileId: normalizeOptionalString(params.runtimeContext?.authProfileId),
      contextEnginePluginId: params.contextEnginePluginId,
      purpose: params.purpose ?? "context-engine.maintenance",
    }),
    ...(params.sessionTarget ? { sessionTarget: params.sessionTarget } : {}),
    ...(params.allowDeferredCompactionExecution ? { allowDeferredCompactionExecution: true } : {}),
    rewriteTranscriptEntries: async (request) => {
      if (params.sessionManager) {
        const sessionManager = params.sessionManager;
        const rewriteSessionManagerEntries = () =>
          rewriteTranscriptEntriesInSessionManager({
            sessionManager,
            replacements: request.replacements,
          });
        return params.withSessionManagerRewriteLock
          ? await params.withSessionManagerRewriteLock(rewriteSessionManagerEntries)
          : rewriteSessionManagerEntries();
      }
      const rewriteRuntimeTranscriptEntries = async () =>
        await rewriteTranscriptEntriesInRuntimeTranscript({
          scope: {
            sessionId: params.sessionId,
            sessionKey: params.sessionKey ?? params.sessionId,
            sessionFile: params.sessionFile,
            ...(params.agentId ? { agentId: params.agentId } : {}),
          },
          request,
          config: params.config,
        });
      return await rewriteRuntimeTranscriptEntries();
    },
  };
}
async function executeContextEngineMaintenance(params) {
  if (typeof params.contextEngine.maintain !== "function") return;
  const result = await params.contextEngine.maintain({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionTarget: params.sessionTarget,
    sessionFile: params.sessionFile,
    runtimeSettings: params.runtimeSettings,
    runtimeContext: buildContextEngineMaintenanceRuntimeContext({
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionTarget: params.sessionTarget,
      sessionFile: params.sessionFile,
      sessionManager: params.executionMode === "background" ? void 0 : params.sessionManager,
      withSessionManagerRewriteLock:
        params.executionMode === "background" ? void 0 : params.withSessionManagerRewriteLock,
      runtimeContext: params.runtimeContext,
      agentId: params.agentId,
      allowDeferredCompactionExecution: params.executionMode === "background",
      config: params.config,
      purpose: `context-engine.${params.reason}.maintenance`,
      contextEnginePluginId: resolveContextEngineOwnerPluginId(params.contextEngine),
    }),
  });
  if (result.changed)
    log$1.info(
      `[context-engine] maintenance(${params.reason}) changed transcript rewrittenEntries=${result.rewrittenEntries} bytesFreed=${result.bytesFreed} sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`,
    );
  return result;
}
async function runDeferredTurnMaintenanceWorker(params) {
  let surfacedUserNotice = false;
  let longRunningTimer = null;
  const shutdownAbort = createDeferredTurnMaintenanceAbortSignal();
  const surfaceMaintenanceUpdate = (summary, eventSummary) => {
    promoteTurnMaintenanceTaskVisibility({
      sessionKey: params.sessionKey,
      runId: params.runId,
      notifyPolicy: "state_changes",
    });
    surfacedUserNotice = true;
    recordTaskRunProgressByRunId({
      runId: params.runId,
      runtime: "acp",
      sessionKey: params.sessionKey,
      lastEventAt: Date.now(),
      progressSummary: summary,
      eventSummary,
    });
  };
  try {
    const runningAt = Date.now();
    startTaskRunByRunId({
      runId: params.runId,
      runtime: "acp",
      sessionKey: params.sessionKey,
      startedAt: runningAt,
      lastEventAt: runningAt,
      progressSummary: "Running deferred maintenance.",
      eventSummary: "Starting deferred maintenance.",
    });
    longRunningTimer = setTimeout(() => {
      try {
        surfaceMaintenanceUpdate(
          "Deferred maintenance is still running.",
          "Deferred maintenance is still running.",
        );
      } catch (error) {
        log$1.warn(`failed to surface deferred maintenance progress: ${String(error)}`);
      }
    }, TURN_MAINTENANCE_LONG_WAIT_MS);
    const result = await executeContextEngineMaintenance({
      contextEngine: params.contextEngine,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionTarget: params.sessionTarget,
      sessionFile: params.sessionFile,
      reason: "turn",
      sessionManager: params.sessionManager,
      runtimeContext: params.runtimeContext,
      runtimeSettings: params.runtimeSettings,
      agentId: params.agentId,
      config: params.config,
      executionMode: "background",
    });
    if (longRunningTimer) {
      clearTimeout(longRunningTimer);
      longRunningTimer = null;
    }
    const endedAt = Date.now();
    completeTaskRunByRunId({
      runId: params.runId,
      runtime: "acp",
      sessionKey: params.sessionKey,
      endedAt,
      lastEventAt: endedAt,
      progressSummary: result?.changed
        ? "Deferred maintenance completed with transcript changes."
        : "Deferred maintenance completed.",
      terminalSummary: result?.changed
        ? `Rewrote ${result.rewrittenEntries} transcript entr${result.rewrittenEntries === 1 ? "y" : "ies"} and freed ${result.bytesFreed} bytes.`
        : "No transcript changes were needed.",
    });
  } catch (err) {
    if (shutdownAbort.abortSignal?.aborted) {
      if (longRunningTimer) {
        clearTimeout(longRunningTimer);
        longRunningTimer = null;
      }
      const task = findTaskByRunIdForOwner({
        runId: params.runId,
        callerOwnerKey: params.sessionKey,
      });
      if (task)
        cancelTaskByIdForOwner({
          taskId: task.taskId,
          callerOwnerKey: params.sessionKey,
          endedAt: Date.now(),
          terminalSummary: "Deferred maintenance cancelled during shutdown.",
        });
      return;
    }
    if (longRunningTimer) {
      clearTimeout(longRunningTimer);
      longRunningTimer = null;
    }
    const endedAt = Date.now();
    const reason = formatErrorMessage(err);
    if (!surfacedUserNotice)
      promoteTurnMaintenanceTaskVisibility({
        sessionKey: params.sessionKey,
        runId: params.runId,
        notifyPolicy: "done_only",
      });
    failTaskRunByRunId({
      runId: params.runId,
      runtime: "acp",
      sessionKey: params.sessionKey,
      endedAt,
      lastEventAt: endedAt,
      error: reason,
      progressSummary: "Deferred maintenance failed.",
      terminalSummary: reason,
    });
    log$1.warn(`deferred context engine maintenance failed: ${reason}`);
  } finally {
    shutdownAbort.dispose();
    if (params.disposeContextEngineAfterMaintenance)
      await disposeDeferredMaintenanceContextEngine(params.contextEngine);
  }
}
function scheduleDeferredTurnMaintenance(params) {
  const sessionKey = normalizeSessionKey(params.sessionKey);
  if (!sessionKey) return;
  if (isGatewayDraining()) {
    params.onScheduleFailure?.(new GatewayDrainingError());
    return;
  }
  const activeRun = activeDeferredTurnMaintenanceRuns.get(sessionKey);
  if (activeRun) {
    const supersededParams = activeRun.rerunRequested ? activeRun.latestParams : void 0;
    activeRun.rerunRequested = true;
    activeRun.latestParams = {
      ...params,
      sessionKey,
    };
    if (
      supersededParams?.disposeContextEngineAfterMaintenance &&
      supersededParams.contextEngine !== params.contextEngine
    )
      disposeDeferredMaintenanceContextEngine(supersededParams.contextEngine);
    return activeRun.promise;
  }
  const existingTask = findActiveSessionTask({
    sessionKey,
    runtime: "acp",
    taskKind: TURN_MAINTENANCE_TASK_KIND,
  });
  const reusableTask = existingTask?.runId?.trim() ? existingTask : void 0;
  if (existingTask && !reusableTask) {
    updateTaskNotifyPolicyForOwner({
      taskId: existingTask.taskId,
      callerOwnerKey: sessionKey,
      notifyPolicy: "silent",
    });
    cancelTaskByIdForOwner({
      taskId: existingTask.taskId,
      callerOwnerKey: sessionKey,
      endedAt: Date.now(),
      terminalSummary: "Superseded by refreshed deferred maintenance task.",
    });
  }
  const task = reusableTask ?? buildTurnMaintenanceTaskDescriptor({ sessionKey });
  if (!task) {
    log$1.warn("[context-engine] failed to create deferred turn maintenance task", { sessionKey });
    return;
  }
  log$1.info(
    `[context-engine] deferred turn maintenance ${reusableTask ? "resuming" : "queued"} taskId=${task.taskId} sessionKey=${sessionKey} lane=${resolveDeferredTurnMaintenanceLane(sessionKey)}`,
  );
  const schedulerAbort = createDeferredTurnMaintenanceAbortSignal();
  let runPromise;
  try {
    runPromise = enqueueCommandInLane(resolveDeferredTurnMaintenanceLane(sessionKey), async () =>
      runDeferredTurnMaintenanceWorker({
        contextEngine: params.contextEngine,
        sessionId: params.sessionId,
        sessionKey,
        sessionTarget: params.sessionTarget,
        sessionFile: params.sessionFile,
        sessionManager: params.sessionManager,
        runtimeContext: params.runtimeContext,
        runtimeSettings: params.runtimeSettings,
        agentId: params.agentId,
        config: params.config,
        runId: task.runId,
        disposeContextEngineAfterMaintenance: params.disposeContextEngineAfterMaintenance,
      }),
    );
  } catch (err) {
    schedulerAbort.dispose();
    markDeferredTurnMaintenanceTaskScheduleFailure({
      sessionKey,
      taskId: task.taskId,
      error: err,
    });
    return;
  }
  const cleanupDeferredTurnMaintenance = async () => {
    schedulerAbort.dispose();
    const current = activeDeferredTurnMaintenanceRuns.get(sessionKey);
    if (current !== state) return;
    const shutdownTriggered = schedulerAbort.abortSignal?.aborted === true;
    const rerunParams =
      current.rerunRequested && !shutdownTriggered ? current.latestParams : void 0;
    const discardedRerunParams =
      current.rerunRequested && shutdownTriggered ? current.latestParams : void 0;
    activeDeferredTurnMaintenanceRuns.delete(sessionKey);
    if (rerunParams) await scheduleDeferredTurnMaintenance(rerunParams);
    else if (discardedRerunParams?.disposeContextEngineAfterMaintenance)
      await disposeDeferredMaintenanceContextEngine(discardedRerunParams.contextEngine);
  };
  const trackedPromise = runPromise
    .catch((err) => {
      params.onScheduleFailure?.(err);
      markDeferredTurnMaintenanceTaskScheduleFailure({
        sessionKey,
        taskId: task.taskId,
        error: err,
      });
    })
    .then(cleanupDeferredTurnMaintenance, async (err) => {
      await cleanupDeferredTurnMaintenance();
      throw err;
    });
  const state = {
    promise: trackedPromise,
    rerunRequested: false,
    latestParams: {
      ...params,
      sessionKey,
    },
  };
  activeDeferredTurnMaintenanceRuns.set(sessionKey, state);
  return trackedPromise;
}
/**
 * Run optional context-engine transcript maintenance and normalize the result.
 */
async function runContextEngineMaintenance(params) {
  if (typeof params.contextEngine?.maintain !== "function") return;
  const executionMode = params.executionMode ?? "foreground";
  if (
    params.reason === "turn" &&
    executionMode !== "background" &&
    params.contextEngine.info.turnMaintenanceMode === "background"
  ) {
    try {
      const deferred = scheduleDeferredTurnMaintenance({
        contextEngine: params.contextEngine,
        sessionId: params.sessionId,
        sessionKey: params.sessionKey ?? params.sessionId,
        sessionTarget: params.sessionTarget,
        sessionFile: params.sessionFile,
        sessionManager: params.sessionManager,
        runtimeContext: params.runtimeContext,
        runtimeSettings: params.runtimeSettings,
        agentId: params.agentId,
        config: params.config,
        disposeContextEngineAfterMaintenance: params.disposeDeferredContextEngineAfterMaintenance,
        onScheduleFailure: params.onDeferredMaintenanceFailure,
      });
      if (deferred) params.onDeferredMaintenance?.(deferred);
    } catch (err) {
      log$1.warn(`failed to schedule deferred context engine maintenance: ${String(err)}`);
    }
    return;
  }
  try {
    return await executeContextEngineMaintenance({
      contextEngine: params.contextEngine,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionTarget: params.sessionTarget,
      sessionFile: params.sessionFile,
      reason: params.reason,
      sessionManager: params.sessionManager,
      withSessionManagerRewriteLock: params.withSessionManagerRewriteLock,
      runtimeContext: params.runtimeContext,
      runtimeSettings: params.runtimeSettings,
      agentId: params.agentId,
      executionMode,
      config: params.config,
    });
  } catch (err) {
    log$1.warn(`context engine maintain failed (${params.reason}): ${String(err)}`);
    return;
  }
}
//#endregion
//#region src/agents/harness/context-engine-lifecycle.ts
function buildHarnessContextEngineRuntimeSettings(params) {
  return (
    params.runtimeSettings ??
    (() => {
      const selectedId = params.contextEngine?.info.id;
      return buildContextEngineRuntimeSettings({
        contextEngineHost: params.contextEngineHostSupport ?? OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
        harnessId: params.harnessId,
        runtimeId: params.runtimeId,
        provider: params.providerId,
        requestedModel: params.requestedModelId,
        resolvedModel: params.modelId ?? params.requestedModelId,
        modelFamily: params.modelFamily ?? null,
        selectedContextEngineId: selectedId,
        contextEngineSelectionSource:
          selectedId === "legacy" ? "default" : selectedId ? "configured" : "unknown",
        promptTokenBudget: params.tokenBudget,
        maxOutputTokens: params.maxOutputTokens,
        fallbackReason: params.fallbackReason,
        degradedReason: params.degradedReason,
      });
    })()
  );
}
/**
 * Run optional bootstrap + bootstrap maintenance for a harness-owned context engine.
 */
async function bootstrapHarnessContextEngine(params) {
  if (
    !params.hadSessionFile ||
    !(params.contextEngine?.bootstrap || params.contextEngine?.maintain)
  )
    return;
  try {
    const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
    if (typeof params.contextEngine?.bootstrap === "function")
      await params.contextEngine.bootstrap({
        sessionId: params.sessionId,
        sessionKey: params.sessionKey,
        sessionTarget: params.sessionTarget,
        sessionFile: params.sessionFile,
        runtimeSettings,
        runtimeContext: params.runtimeContext,
      });
    await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
      contextEngine: params.contextEngine,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionTarget: params.sessionTarget,
      sessionFile: params.sessionFile,
      reason: "bootstrap",
      sessionManager: params.sessionManager,
      runtimeContext: params.runtimeContext,
      runtimeSettings,
      config: params.config,
    });
  } catch (bootstrapErr) {
    params.warn(`context engine bootstrap failed: ${String(bootstrapErr)}`);
  }
}
/**
 * Assemble model context through the active harness-owned context engine.
 */
async function assembleHarnessContextEngine(params) {
  if (!params.contextEngine) return;
  const messages = stripRuntimeContextCustomMessages(params.messages);
  const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
  return ensureAssembleResultShape(
    await params.contextEngine.assemble({
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      messages,
      tokenBudget: params.tokenBudget,
      ...(params.availableTools ? { availableTools: params.availableTools } : {}),
      ...(params.citationsMode ? { citationsMode: params.citationsMode } : {}),
      model: params.modelId,
      runtimeSettings,
      ...(params.prompt !== void 0 ? { prompt: params.prompt } : {}),
    }),
    params.contextEngine.info.id,
  );
}
/**
 * Validate that a context engine's assemble() return value matches the
 * AssembleResult contract before the runner consumes it. Engines that omit
 * `messages` or return a non-array previously crashed the runner downstream
 * when prompt assembly tried to read `activeSession.messages.length` (#75541).
 *
 * Throws a descriptive error so the runner's existing assemble try/catch can
 * log the offending engine id and fall back to the unmodified pipeline
 * messages instead of poisoning session state.
 */
function ensureAssembleResultShape(result, engineId) {
  if (!result || typeof result !== "object")
    throw new Error(
      `context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got ${describeAssembleResultType(result)})`,
    );
  const candidate = result;
  if (!Array.isArray(candidate.messages))
    throw new Error(
      `context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got messages of type ${describeAssembleResultType(candidate.messages)})`,
    );
  return result;
}
function describeAssembleResultType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
/**
 * Finalize a completed harness turn via afterTurn or ingest fallbacks.
 */
async function finalizeHarnessContextEngineTurn(params) {
  if (!params.contextEngine) return { postTurnFinalizationSucceeded: true };
  const conversationSnapshot = buildContextEngineConversationSnapshot({
    messagesSnapshot: params.messagesSnapshot,
    prePromptMessageCount: params.prePromptMessageCount,
  });
  const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
  let postTurnFinalizationSucceeded = true;
  if (typeof params.contextEngine.afterTurn === "function")
    try {
      await params.contextEngine.afterTurn({
        sessionId: params.sessionIdUsed,
        sessionKey: params.sessionKey,
        sessionTarget: params.sessionTarget,
        sessionFile: params.sessionFile,
        messages: conversationSnapshot.messages,
        prePromptMessageCount: conversationSnapshot.prePromptMessageCount,
        tokenBudget: params.tokenBudget,
        runtimeSettings,
        runtimeContext: params.runtimeContext,
        isHeartbeat: params.isHeartbeat,
      });
    } catch (afterTurnErr) {
      postTurnFinalizationSucceeded = false;
      params.warn(`context engine afterTurn failed: ${String(afterTurnErr)}`);
    }
  else {
    const newMessages = conversationSnapshot.messages.slice(
      conversationSnapshot.prePromptMessageCount,
    );
    if (newMessages.length > 0)
      if (typeof params.contextEngine.ingestBatch === "function")
        try {
          await params.contextEngine.ingestBatch({
            sessionId: params.sessionIdUsed,
            sessionKey: params.sessionKey,
            messages: newMessages,
            isHeartbeat: params.isHeartbeat,
          });
        } catch (ingestErr) {
          postTurnFinalizationSucceeded = false;
          params.warn(`context engine ingest failed: ${String(ingestErr)}`);
        }
      else
        for (const msg of newMessages)
          try {
            await params.contextEngine.ingest?.({
              sessionId: params.sessionIdUsed,
              sessionKey: params.sessionKey,
              message: msg,
              isHeartbeat: params.isHeartbeat,
            });
          } catch (ingestErr) {
            postTurnFinalizationSucceeded = false;
            params.warn(`context engine ingest failed: ${String(ingestErr)}`);
          }
  }
  if (
    !params.promptError &&
    !params.aborted &&
    !params.yieldAborted &&
    postTurnFinalizationSucceeded
  )
    await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
      contextEngine: params.contextEngine,
      sessionId: params.sessionIdUsed,
      sessionKey: params.sessionKey,
      sessionTarget: params.sessionTarget,
      sessionFile: params.sessionFile,
      reason: "turn",
      sessionManager: params.sessionManager,
      runtimeContext: params.runtimeContext,
      runtimeSettings,
      config: params.config,
    });
  return { postTurnFinalizationSucceeded };
}
function buildContextEngineConversationSnapshot(params) {
  const prePromptMessages = stripRuntimeContextCustomMessages(
    params.messagesSnapshot.slice(0, params.prePromptMessageCount),
  );
  const turnMessages = stripRuntimeContextCustomMessages(
    params.messagesSnapshot.slice(params.prePromptMessageCount),
  );
  return {
    messages: [...prePromptMessages, ...turnMessages],
    prePromptMessageCount: prePromptMessages.length,
  };
}
/**
 * Build runtime context passed into harness context-engine hooks.
 */
function buildHarnessContextEngineRuntimeContext(params) {
  return buildAfterTurnRuntimeContext(params);
}
/**
 * Build runtime context passed into harness context-engine hooks from usage data.
 */
function buildHarnessContextEngineRuntimeContextFromUsage(params) {
  return buildAfterTurnRuntimeContextFromUsage(params);
}
/**
 * Run optional transcript maintenance for a harness-owned context engine.
 */
async function runHarnessContextEngineMaintenance(params) {
  const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
  return await runContextEngineMaintenance({
    contextEngine: params.contextEngine,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionTarget: params.sessionTarget,
    sessionFile: params.sessionFile,
    reason: params.reason,
    sessionManager: params.sessionManager,
    runtimeContext: params.runtimeContext,
    runtimeSettings,
    executionMode: params.executionMode,
    onDeferredMaintenance: params.onDeferredMaintenance,
    config: params.config,
  });
}
/**
 * Return true when a non-legacy context engine should affect plugin harness behavior.
 */
function isActiveHarnessContextEngine(contextEngine) {
  return Boolean(contextEngine && contextEngine.info.id !== "legacy");
}
//#endregion
//#region src/agents/harness/agent-end-side-effects.ts
/**
 * Agent-end side effect runner.
 *
 * Harnesses use this to trigger core research capture and plugin agent_end hooks
 * either fire-and-forget or awaited during tests/shutdown.
 */
const log = createSubsystemLogger("agents/harness");
async function runCoreAgentEndSideEffects(params) {
  try {
    const { scheduleSkillExperienceReview } =
      await import("./experience-review-default-DVscnlL2.js");
    scheduleSkillExperienceReview({
      event: params.event,
      ctx: params.ctx,
      ...(params.ctx.config ? { config: params.ctx.config } : {}),
    });
  } catch (error) {
    log.warn(`skill experience review scheduling failed: ${String(error)}`);
  }
  try {
    const { runSkillResearchAutoCapture } = await import("./autocapture-BG1B--Na.js");
    await runSkillResearchAutoCapture({
      event: params.event,
      ctx: params.ctx,
      ...(params.ctx.config ? { config: params.ctx.config } : {}),
    });
  } catch (error) {
    log.warn(`skill research auto-capture failed: ${String(error)}`);
  }
}
/** Starts agent-end side effects without waiting for completion. */
function runAgentEndSideEffects(params) {
  runCoreAgentEndSideEffects(params);
  runAgentHarnessAgentEndHook(params);
}
/** Runs agent-end side effects and waits for plugin/core completion. */
async function awaitAgentEndSideEffects(params) {
  await runCoreAgentEndSideEffects(params);
  await awaitAgentHarnessAgentEndHook(params);
}
//#endregion
export {
  buildHarnessContextEngineRuntimeContext as a,
  isActiveHarnessContextEngine as c,
  waitForDeferredTurnMaintenanceForSession as d,
  buildContextEngineRuntimeSettings as f,
  bootstrapHarnessContextEngine as i,
  runHarnessContextEngineMaintenance as l,
  runAgentEndSideEffects as n,
  buildHarnessContextEngineRuntimeContextFromUsage as o,
  assembleHarnessContextEngine as r,
  finalizeHarnessContextEngineTurn as s,
  awaitAgentEndSideEffects as t,
  runContextEngineMaintenance as u,
};
