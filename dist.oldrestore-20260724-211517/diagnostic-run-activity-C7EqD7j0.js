import { h as onInternalDiagnosticEvent } from "./diagnostic-events-5-gsFhkM.js";
//#region src/logging/diagnostic-run-activity.ts
const BLOCKED_TOOL_CALL_ABORT_FLOOR_MS = 15 * 6e4;
const RUN_STALE_TAKEOVER_MS = 10 * 6e4;
function resolveRunStaleThresholdMs(activity) {
  return activity.activeWorkKind === "tool_call"
    ? Math.max(RUN_STALE_TAKEOVER_MS, BLOCKED_TOOL_CALL_ABORT_FLOOR_MS)
    : RUN_STALE_TAKEOVER_MS;
}
const activityByRef = /* @__PURE__ */ new Map();
const activityByRunId = /* @__PURE__ */ new Map();
let embeddedRunSequence = 0;
function sessionRefs(params) {
  const refs = [];
  const sessionId = params.sessionId?.trim();
  const sessionKey = params.sessionKey?.trim();
  if (sessionId) refs.push(`id:${sessionId}`);
  if (sessionKey) refs.push(`key:${sessionKey}`);
  return refs;
}
function registerSessionActivityRefs(activity, params) {
  activity.sessionId ??= params.sessionId;
  activity.sessionKey ??= params.sessionKey;
  for (const ref of sessionRefs(params)) activityByRef.set(ref, activity);
  if (params.runId) activityByRunId.set(params.runId, activity);
}
function replaceSessionActivityReferences(source, target) {
  for (const [ref, activity] of activityByRef)
    if (activity === source) activityByRef.set(ref, target);
  for (const [runId, activity] of activityByRunId)
    if (activity === source) activityByRunId.set(runId, target);
}
function mergeSessionActivity(target, source) {
  target.sessionId ??= source.sessionId;
  target.sessionKey ??= source.sessionKey;
  for (const [key, embeddedRun] of source.activeEmbeddedRuns)
    target.activeEmbeddedRuns.set(key, embeddedRun);
  for (const [key, tool] of source.activeTools) target.activeTools.set(key, tool);
  for (const [key, modelCall] of source.activeModelCalls)
    target.activeModelCalls.set(key, modelCall);
  for (const [ownerRef, cutoff] of source.recoveredOwnerStartEventCutoffs)
    target.recoveredOwnerStartEventCutoffs.set(
      ownerRef,
      Math.max(cutoff, target.recoveredOwnerStartEventCutoffs.get(ownerRef) ?? 0),
    );
  if (source.lastProgressAt > target.lastProgressAt) {
    target.lastProgressAt = source.lastProgressAt;
    target.lastProgressReason = source.lastProgressReason;
  }
  replaceSessionActivityReferences(source, target);
}
function resolveSessionActivity(params) {
  let activity;
  if (params.runId) {
    const byRun = activityByRunId.get(params.runId);
    if (byRun) activity = byRun;
  }
  for (const ref of sessionRefs(params)) {
    const byRef = activityByRef.get(ref);
    if (!byRef) continue;
    if (!activity) activity = byRef;
    else if (activity !== byRef) mergeSessionActivity(activity, byRef);
  }
  if (activity) {
    registerSessionActivityRefs(activity, params);
    return activity;
  }
  if (!params.create) return;
  const created = {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    activeEmbeddedRuns: /* @__PURE__ */ new Map(),
    activeTools: /* @__PURE__ */ new Map(),
    activeModelCalls: /* @__PURE__ */ new Map(),
    recoveredOwnerStartEventCutoffs: /* @__PURE__ */ new Map(),
    lastProgressAt: Date.now(),
  };
  registerSessionActivityRefs(created, params);
  return created;
}
function touchSessionActivity(activity, reason, now = Date.now()) {
  activity.lastProgressAt = now;
  activity.lastProgressReason = reason;
}
function toolKey(event) {
  return `${event.runId ?? event.sessionId ?? event.sessionKey ?? "unknown"}:${event.toolCallId ?? event.toolName}`;
}
function modelCallKey(event) {
  return `${event.runId ?? "unknown"}:${event.provider ?? "provider"}:${event.model ?? "model"}`;
}
function recordToolStarted(event) {
  const activity = resolveSessionActivity({
    ...event,
    create: true,
  });
  if (!activity) return;
  if (shouldIgnoreRecoveredOwnerStartEvent(activity, event)) return;
  const now = Date.now();
  activity.activeTools.set(toolKey(event), {
    runId: event.runId,
    sessionId: event.sessionId,
    sessionKey: event.sessionKey,
    sequence: event.seq,
    toolName: event.toolName,
    toolCallId: event.toolCallId,
    startedAt: now,
    lastProgressAt: now,
  });
  touchSessionActivity(activity, `tool:${event.toolName}:started`, now);
}
function recordToolEnded(event) {
  const activity = resolveSessionActivity(event);
  if (!activity) return;
  activity.activeTools.delete(toolKey(event));
  touchSessionActivity(activity, `tool:${event.toolName}:ended`);
}
function recordModelStarted(event) {
  const activity = resolveSessionActivity({
    ...event,
    create: true,
  });
  if (!activity) return;
  if (shouldIgnoreRecoveredOwnerStartEvent(activity, event)) return;
  activity.activeModelCalls.set(modelCallKey(event), {
    runId: event.runId,
    sessionId: event.sessionId,
    sessionKey: event.sessionKey,
    sequence: event.seq,
  });
  touchSessionActivity(activity, "model_call:started");
}
function recordModelEnded(event) {
  const activity = resolveSessionActivity(event);
  if (!activity) return;
  activity.activeModelCalls.delete(modelCallKey(event));
  touchSessionActivity(activity, "model_call:ended");
}
function recordRunProgress(event) {
  markDiagnosticRunProgress(event);
}
function markDiagnosticRunProgress(params) {
  const activity = resolveSessionActivity({
    ...params,
    create: true,
  });
  if (!activity) return;
  touchSessionActivity(activity, params.reason);
}
function recordRunCompleted(event) {
  const activity = resolveSessionActivity(event);
  if (!activity) return;
  activityByRunId.delete(event.runId);
  activity.activeTools.clear();
  activity.activeModelCalls.clear();
  activity.activeEmbeddedRuns.clear();
  touchSessionActivity(activity, "run:completed");
}
function markDiagnosticEmbeddedRunStarted(params) {
  const activity = resolveSessionActivity({
    ...params,
    create: true,
  });
  if (!activity) return;
  activity.activeEmbeddedRuns.set(resolveEmbeddedRunWorkKey(params), {
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sequence: ++embeddedRunSequence,
  });
  touchSessionActivity(activity, "embedded_run:started");
}
function markDiagnosticEmbeddedRunEnded(params) {
  const activity = resolveSessionActivity(params);
  if (!activity) return;
  activity.activeEmbeddedRuns.delete(resolveEmbeddedRunWorkKey(params));
  if (params.clearRunActivity !== false) {
    activity.activeTools.clear();
    activity.activeModelCalls.clear();
  }
  touchSessionActivity(activity, "embedded_run:ended");
}
function resolveEmbeddedRunWorkKey(params) {
  return params.workKey ?? params.sessionId;
}
function ownerRefsForRecovery(params) {
  const refs = [params.activeSessionId?.trim(), params.sessionId?.trim()].filter((ref) =>
    Boolean(ref),
  );
  return new Set(refs);
}
function ownerRefsForStartedEvent(event) {
  return [event.runId?.trim(), event.sessionId?.trim()].filter((ref) => Boolean(ref));
}
function markerBelongsToRecoveredOwner(marker, ownerRefs) {
  return (
    (marker.runId !== void 0 && ownerRefs.has(marker.runId)) ||
    (marker.sessionId !== void 0 && ownerRefs.has(marker.sessionId))
  );
}
function embeddedRunStartedAfter(embeddedRun, sequence) {
  return sequence !== void 0 && embeddedRun.sequence > sequence;
}
function activityMarkerStartedAfter(marker, sequence) {
  return sequence !== void 0 && marker.sequence !== void 0 && marker.sequence > sequence;
}
function clearRecoveredOwnerEmbeddedRuns(activity, ownerRefs, recoveryStartedAfterSequence) {
  if (ownerRefs.size === 0) return;
  for (const [key, embeddedRun] of activity.activeEmbeddedRuns)
    if (
      embeddedRun.sessionId !== void 0 &&
      ownerRefs.has(embeddedRun.sessionId) &&
      !embeddedRunStartedAfter(embeddedRun, recoveryStartedAfterSequence)
    )
      activity.activeEmbeddedRuns.delete(key);
}
function hasEmbeddedRunStartedAfter(activity, sequence) {
  if (sequence === void 0) return activity.activeEmbeddedRuns.size > 0;
  for (const embeddedRun of activity.activeEmbeddedRuns.values())
    if (embeddedRun.sequence > sequence) return true;
  return false;
}
function clearRecoveredOwnerMarkers(activity, ownerRefs, recoveryStartedAfterSequence) {
  if (ownerRefs.size === 0) return;
  for (const [key, tool] of activity.activeTools)
    if (
      markerBelongsToRecoveredOwner(tool, ownerRefs) &&
      !activityMarkerStartedAfter(tool, recoveryStartedAfterSequence)
    )
      activity.activeTools.delete(key);
  for (const [key, modelCall] of activity.activeModelCalls)
    if (
      markerBelongsToRecoveredOwner(modelCall, ownerRefs) &&
      !activityMarkerStartedAfter(modelCall, recoveryStartedAfterSequence)
    )
      activity.activeModelCalls.delete(key);
}
function pruneActivityStartedBeforeRecoveryCutoff(
  activity,
  recoveryStartedAfterEmbeddedRunSequence,
  recoveryStartedAfterDiagnosticEventSequence,
) {
  if (
    recoveryStartedAfterEmbeddedRunSequence === void 0 &&
    recoveryStartedAfterDiagnosticEventSequence === void 0
  )
    return;
  for (const [key, embeddedRun] of activity.activeEmbeddedRuns)
    if (!embeddedRunStartedAfter(embeddedRun, recoveryStartedAfterEmbeddedRunSequence))
      activity.activeEmbeddedRuns.delete(key);
  for (const [key, tool] of activity.activeTools)
    if (!activityMarkerStartedAfter(tool, recoveryStartedAfterDiagnosticEventSequence))
      activity.activeTools.delete(key);
  for (const [key, modelCall] of activity.activeModelCalls)
    if (!activityMarkerStartedAfter(modelCall, recoveryStartedAfterDiagnosticEventSequence))
      activity.activeModelCalls.delete(key);
}
function rememberRecoveredOwnerStartEventCutoffs(
  activity,
  ownerRefs,
  recoveryStartedAfterSequence,
) {
  if (recoveryStartedAfterSequence === void 0) return;
  for (const ownerRef of ownerRefs)
    activity.recoveredOwnerStartEventCutoffs.set(
      ownerRef,
      Math.max(
        recoveryStartedAfterSequence,
        activity.recoveredOwnerStartEventCutoffs.get(ownerRef) ?? 0,
      ),
    );
}
function shouldIgnoreRecoveredOwnerStartEvent(activity, event) {
  if (event.seq === void 0) return false;
  for (const ownerRef of ownerRefsForStartedEvent(event)) {
    const cutoff = activity.recoveredOwnerStartEventCutoffs.get(ownerRef);
    if (cutoff !== void 0 && event.seq <= cutoff) return true;
  }
  return false;
}
function clearDiagnosticEmbeddedRunActivityForSession(params) {
  const shouldCreateCutoffActivity = params.recoveryStartedAfterDiagnosticEventSequence !== void 0;
  const activity = resolveSessionActivity({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    runId: params.activeSessionId,
    create: shouldCreateCutoffActivity,
  });
  if (!activity)
    return {
      cleared: false,
      blockedByActiveEmbeddedRun: false,
    };
  if (params.activeSessionId)
    registerSessionActivityRefs(activity, {
      sessionId: params.activeSessionId,
      sessionKey: params.sessionKey,
      runId: params.activeSessionId,
    });
  const ownerRefs = ownerRefsForRecovery(params);
  rememberRecoveredOwnerStartEventCutoffs(
    activity,
    ownerRefs,
    params.recoveryStartedAfterDiagnosticEventSequence,
  );
  if (
    activity.activeEmbeddedRuns.size === 0 &&
    activity.activeTools.size === 0 &&
    activity.activeModelCalls.size === 0
  )
    return {
      cleared: false,
      blockedByActiveEmbeddedRun: false,
    };
  clearRecoveredOwnerEmbeddedRuns(
    activity,
    ownerRefs,
    params.recoveryStartedAfterEmbeddedRunSequence,
  );
  clearRecoveredOwnerMarkers(
    activity,
    ownerRefs,
    params.recoveryStartedAfterDiagnosticEventSequence,
  );
  if (activity.activeEmbeddedRuns.size > 0) {
    if (hasEmbeddedRunStartedAfter(activity, params.recoveryStartedAfterEmbeddedRunSequence)) {
      pruneActivityStartedBeforeRecoveryCutoff(
        activity,
        params.recoveryStartedAfterEmbeddedRunSequence,
        params.recoveryStartedAfterDiagnosticEventSequence,
      );
      touchSessionActivity(activity, "embedded_run:recovery_skipped_active_owner");
      return {
        cleared: false,
        blockedByActiveEmbeddedRun: true,
      };
    }
    activity.activeEmbeddedRuns.clear();
  }
  activity.activeTools.clear();
  activity.activeModelCalls.clear();
  touchSessionActivity(activity, "embedded_run:ended");
  return {
    cleared: true,
    blockedByActiveEmbeddedRun: false,
  };
}
function getDiagnosticSessionActivitySnapshot(params, now = Date.now()) {
  const activity = resolveSessionActivity(params);
  if (!activity) return {};
  let activeWorkKind;
  if (activity.activeTools.size > 0) activeWorkKind = "tool_call";
  else if (activity.activeModelCalls.size > 0) activeWorkKind = "model_call";
  else if (activity.activeEmbeddedRuns.size > 0) activeWorkKind = "embedded_run";
  let activeTool;
  for (const tool of activity.activeTools.values())
    if (!activeTool || tool.startedAt < activeTool.startedAt) activeTool = tool;
  return {
    activeWorkKind,
    ...(activity.activeEmbeddedRuns.size > 0 ? { hasActiveEmbeddedRun: true } : {}),
    activeToolName: activeTool?.toolName,
    activeToolCallId: activeTool?.toolCallId,
    activeToolAgeMs: activeTool ? Math.max(0, now - activeTool.startedAt) : void 0,
    lastProgressAgeMs: Math.max(0, now - activity.lastProgressAt),
    lastProgressReason: activity.lastProgressReason,
  };
}
function getDiagnosticEmbeddedRunActivitySequence() {
  return embeddedRunSequence;
}
function resetDiagnosticRunActivityForTest() {
  activityByRef.clear();
  activityByRunId.clear();
  embeddedRunSequence = 0;
  unregisterDiagnosticRunActivityListener?.();
  unregisterDiagnosticRunActivityListener = void 0;
  registerDiagnosticRunActivityListener();
}
let unregisterDiagnosticRunActivityListener;
function registerDiagnosticRunActivityListener() {
  if (unregisterDiagnosticRunActivityListener) return;
  unregisterDiagnosticRunActivityListener = onInternalDiagnosticEvent((event) => {
    switch (event.type) {
      case "tool.execution.started":
        recordToolStarted(event);
        return;
      case "tool.execution.completed":
      case "tool.execution.error":
      case "tool.execution.blocked":
        recordToolEnded(event);
        return;
      case "model.call.started":
        recordModelStarted(event);
        return;
      case "model.call.completed":
      case "model.call.error":
        recordModelEnded(event);
        return;
      case "run.progress":
        recordRunProgress(event);
        return;
      case "run.completed":
        recordRunCompleted(event);
      default:
    }
  });
}
registerDiagnosticRunActivityListener();
//#endregion
export {
  getDiagnosticSessionActivitySnapshot as a,
  markDiagnosticRunProgress as c,
  getDiagnosticEmbeddedRunActivitySequence as i,
  resetDiagnosticRunActivityForTest as l,
  RUN_STALE_TAKEOVER_MS as n,
  markDiagnosticEmbeddedRunEnded as o,
  clearDiagnosticEmbeddedRunActivityForSession as r,
  markDiagnosticEmbeddedRunStarted as s,
  BLOCKED_TOOL_CALL_ABORT_FLOOR_MS as t,
  resolveRunStaleThresholdMs as u,
};
