import { Buffer } from "node:buffer";
import "./session-accessor-PZVNxFCV.js";
import {
  b as registerAgentRunContext,
  f as getAgentEventLifecycleGeneration,
  l as emitAgentEventForOwner,
  m as getAgentRunContextOwnerStatus,
  p as getAgentRunContext,
  r as claimAgentRunContext,
  x as releaseAgentRunContext,
} from "./agent-events-D4UsOPeT.js";
import {
  g as sanitizeToolResult,
  h as sanitizeToolArgs,
  n as capLiveExecResult,
} from "./embedded-agent-subscribe.tools-Bv1-LBFe.js";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-FRp1oGK4.js";
import { t as resolveWorkerSessionTarget } from "./session-target-CAMdjbd6.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
//#region src/gateway/worker-environments/live-events.ts
const DEFAULT_WINDOW_SIZE = 128;
const DEFAULT_MAX_PENDING_BYTES = 512 * 1024;
const DEFAULT_MAX_SESSIONS = 128;
const DEFAULT_MAX_ACTIVE_RUNS = 32;
const MAX_FENCED_ENVIRONMENTS = 4096;
function invalidEvent() {
  return {
    ok: false,
    details: { reason: "invalid-event" },
  };
}
function capacityExceeded() {
  return {
    ok: false,
    details: { reason: "capacity-exceeded" },
  };
}
function resolveLiveEventTarget(config, sessionId) {
  const target = resolveWorkerSessionTarget(config, sessionId);
  if (!target) return;
  return {
    ...(target.agentId ? { agentId: target.agentId } : {}),
    sessionId: target.sessionId,
    sessionKey: target.sessionKey,
  };
}
function prepareBoundLiveSession(config, binding) {
  if (!isValidLiveSessionBinding(binding)) return;
  const target = resolveLiveEventTarget(config, binding.sessionId);
  return target
    ? {
        ...binding,
        target,
      }
    : void 0;
}
function isValidLiveSessionBinding(binding) {
  return (
    binding.environmentId.length > 0 &&
    binding.sessionId.length > 0 &&
    Number.isSafeInteger(binding.runEpoch) &&
    binding.runEpoch >= 0
  );
}
function prepareBoundLiveSessionSafely(config, binding) {
  try {
    return prepareBoundLiveSession(config, binding);
  } catch {
    return;
  }
}
function matchesSessionIdentityMutation(binding, prepared, mutation) {
  return ("current" in mutation ? [mutation.previous, mutation.current] : [mutation.previous]).some(
    (target) =>
      target.sessionId === binding.sessionId ||
      (prepared ? target.sessionKeys.includes(prepared.target.sessionKey) : false),
  );
}
function prepareLiveEventData(event) {
  const payload = structuredClone(event.payload);
  if (event.kind !== "tool") return payload;
  const toolName = normalizeToolName(event.payload.name);
  payload.name = toolName;
  if (event.payload.phase === "start") payload.args = sanitizeToolArgs(event.payload.args);
  else if (event.payload.phase === "update") {
    const partialResult = sanitizeToolResult(event.payload.partialResult);
    payload.partialResult = toolName === "exec" ? capLiveExecResult(partialResult) : partialResult;
  } else {
    const result = sanitizeToolResult(event.payload.result);
    payload.result = toolName === "exec" ? capLiveExecResult(result) : result;
  }
  return payload;
}
function isDefinitiveTerminal(event) {
  return (
    event.kind === "lifecycle" &&
    (event.payload.phase === "end" ||
      (event.payload.phase === "error" &&
        (event.payload.aborted === true || event.payload.fallbackExhaustedFailure === true)))
  );
}
function createWorkerLiveEventReceiver(options) {
  const boundSessions = /* @__PURE__ */ new Map();
  const sessionBindings = /* @__PURE__ */ new Map();
  const fencedEnvironmentEpochs = /* @__PURE__ */ new Map();
  const staleSessions = /* @__PURE__ */ new Set();
  const windows = /* @__PURE__ */ new Map();
  const startupBindingOwners = new Map(
    options.startupBindings
      .filter(isValidLiveSessionBinding)
      .map(({ environmentId, runEpoch }) => [environmentId, runEpoch]),
  );
  const startupOwners = new Map(
    [...options.startupOwners].filter(
      ([environmentId, ownerEpoch]) =>
        environmentId.length > 0 &&
        Number.isSafeInteger(ownerEpoch) &&
        ownerEpoch >= 0 &&
        startupBindingOwners.get(environmentId) === ownerEpoch,
    ),
  );
  const windowSize = Math.max(1, Math.floor(options.windowSize ?? DEFAULT_WINDOW_SIZE));
  const maxActiveRuns = Math.max(1, Math.floor(options.maxActiveRuns ?? DEFAULT_MAX_ACTIVE_RUNS));
  const maxPendingBytes = Math.max(
    1,
    Math.floor(options.maxPendingBytes ?? DEFAULT_MAX_PENDING_BYTES),
  );
  const maxSessions = Math.max(1, Math.floor(options.maxSessions ?? DEFAULT_MAX_SESSIONS));
  let committedConfig = options.getConfig();
  for (const binding of options.startupBindings) {
    if (!isValidLiveSessionBinding(binding)) continue;
    const existing = sessionBindings.get(binding.sessionId);
    if (
      !existing ||
      binding.runEpoch > existing.runEpoch ||
      (binding.runEpoch === existing.runEpoch && binding.environmentId === existing.environmentId)
    )
      sessionBindings.set(binding.sessionId, { ...binding });
  }
  for (const binding of sessionBindings.values()) {
    const prepared = prepareBoundLiveSessionSafely(committedConfig, binding);
    if (prepared) boundSessions.set(binding.sessionId, prepared);
    else staleSessions.add(binding.sessionId);
  }
  const rotateCredential = (rotation) => {
    if (
      !rotation.credentialHash ||
      !rotation.environmentId ||
      !rotation.previousCredentialHash ||
      !rotation.sessionId ||
      !Number.isSafeInteger(rotation.runEpoch) ||
      rotation.runEpoch < 0
    )
      return false;
    const window = windows.get(rotation.sessionId);
    if (
      window?.credentialHash === rotation.previousCredentialHash &&
      window.environmentId === rotation.environmentId &&
      window.runEpoch === rotation.runEpoch
    ) {
      window.credentialHash = rotation.credentialHash;
      return true;
    }
    return false;
  };
  const releaseRun = (window, runId) => {
    const owned = window.activeRuns.get(runId);
    if (!owned) return;
    window.activeRuns.delete(runId);
    releaseAgentRunContext(runId, owned.claimId);
  };
  const fenceReleasedRun = (window, runId) => {
    if (!window.terminalRuns.has(runId)) window.terminalRuns.set(runId, window.ackedSeq);
    releaseRun(window, runId);
  };
  const clearWindow = (window) => {
    windows.delete(window.sessionId);
    for (const runId of window.activeRuns.keys()) releaseRun(window, runId);
    window.pending.clear();
    window.pendingBytes = 0;
    window.terminalRuns.clear();
  };
  const bindSessionWithConfig = (binding, config) => {
    if (!isValidLiveSessionBinding(binding)) return false;
    const existing = sessionBindings.get(binding.sessionId);
    if (
      (existing && binding.runEpoch < existing.runEpoch) ||
      (existing &&
        binding.runEpoch === existing.runEpoch &&
        binding.environmentId !== existing.environmentId)
    )
      return false;
    const prepared = prepareBoundLiveSessionSafely(config, binding);
    if (!prepared) {
      if (
        existing?.environmentId === binding.environmentId &&
        existing.runEpoch === binding.runEpoch
      )
        staleSessions.add(binding.sessionId);
      return false;
    }
    const window = windows.get(binding.sessionId);
    if (
      window &&
      (window.environmentId !== binding.environmentId || window.runEpoch !== binding.runEpoch)
    )
      clearWindow(window);
    sessionBindings.set(binding.sessionId, { ...binding });
    boundSessions.set(binding.sessionId, prepared);
    staleSessions.delete(binding.sessionId);
    const retainedWindow = windows.get(binding.sessionId);
    if (retainedWindow) {
      retainedWindow.target = prepared.target;
      for (const [runId, owned] of retainedWindow.activeRuns)
        if (
          getAgentRunContextOwnerStatus(runId, owned.claimId, owned.lifecycleGeneration) ===
          "active"
        )
          registerAgentRunContext(
            runId,
            {
              ...(prepared.target.agentId ? { agentId: prepared.target.agentId } : {}),
              isControlUiVisible: owned.controlUiVisible,
              lifecycleGeneration: owned.lifecycleGeneration,
              projectSessionActive: true,
              sessionId: binding.sessionId,
              sessionKey: prepared.target.sessionKey,
            },
            owned.claimId,
          );
    }
    return true;
  };
  const bindSession = (binding) => bindSessionWithConfig(binding, committedConfig);
  const rebindAll = (config) => {
    committedConfig = config;
    for (const binding of sessionBindings.values()) bindSessionWithConfig(binding, committedConfig);
  };
  let unsubscribeSessionIdentityMutation;
  const start = () => {
    if (unsubscribeSessionIdentityMutation) return;
    unsubscribeSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
      for (const binding of sessionBindings.values())
        if (
          matchesSessionIdentityMutation(binding, boundSessions.get(binding.sessionId), mutation)
        ) {
          if (!bindSessionWithConfig(binding, committedConfig)) {
            startupOwners.delete(binding.environmentId);
            const window = windows.get(binding.sessionId);
            if (window) clearWindow(window);
          }
        }
    });
    for (const binding of sessionBindings.values())
      if (!bindSessionWithConfig(binding, committedConfig))
        startupOwners.delete(binding.environmentId);
  };
  const resyncRequired = (ackedSeq) => ({
    ok: false,
    details: {
      reason: "resync-required",
      ackedSeq,
      expectedSeq: ackedSeq + 1,
    },
  });
  const resyncWindow = (window) => {
    window.pending.clear();
    window.pendingBytes = 0;
    return resyncRequired(window.ackedSeq);
  };
  const resolveOrCreateWindow = (sessionId, params) => {
    const binding = boundSessions.get(sessionId);
    if (!binding)
      return {
        ok: false,
        details: { reason: "session-not-attached" },
      };
    if (
      binding.environmentId !== params.identity.environmentId ||
      binding.runEpoch !== params.request.runEpoch
    )
      return {
        ok: false,
        details: { reason: "epoch-mismatch" },
      };
    if (staleSessions.has(sessionId))
      return {
        ok: false,
        details: { reason: "session-not-attached" },
      };
    let window = windows.get(sessionId);
    if (window) {
      if (
        params.request.runEpoch !== window.runEpoch ||
        params.identity.credentialHash !== window.credentialHash ||
        params.identity.environmentId !== window.environmentId
      )
        return {
          ok: false,
          details: { reason: "epoch-mismatch" },
        };
    } else {
      if (
        startupOwners.get(params.identity.environmentId) !== params.request.runEpoch &&
        params.request.lastAckedSeq !== 0
      )
        return resyncRequired(0);
      if (windows.size >= maxSessions) return capacityExceeded();
      window = {
        activeRuns: /* @__PURE__ */ new Map(),
        ackedSeq: params.request.lastAckedSeq,
        credentialHash: params.identity.credentialHash,
        environmentId: params.identity.environmentId,
        pending: /* @__PURE__ */ new Map(),
        pendingBytes: 0,
        runEpoch: params.request.runEpoch,
        sessionId,
        target: binding.target,
        terminalRuns: /* @__PURE__ */ new Map(),
      };
      windows.set(sessionId, window);
      startupOwners.delete(params.identity.environmentId);
    }
    if (params.request.seq <= window.ackedSeq)
      return {
        ok: true,
        result: { ackedSeq: window.ackedSeq },
      };
    if (params.request.lastAckedSeq > window.ackedSeq) return resyncWindow(window);
    return window;
  };
  const pruneReleasedRuns = (window) => {
    for (const [runId, owned] of window.activeRuns) {
      const ownerStatus = getAgentRunContextOwnerStatus(
        runId,
        owned.claimId,
        owned.lifecycleGeneration,
      );
      if (ownerStatus === void 0) {
        clearWindow(window);
        return resyncRequired(0);
      }
      if (ownerStatus !== "active") fenceReleasedRun(window, runId);
    }
  };
  const hasReachableBufferedTerminal = (window, admittedRunId, countedRunIds) => {
    for (let seq = window.ackedSeq + 2; seq <= window.ackedSeq + windowSize; seq += 1) {
      const pending = window.pending.get(seq);
      if (!pending) return false;
      const pendingRunId = pending.request.runId;
      if (countedRunIds.has(pendingRunId)) {
        if (isDefinitiveTerminal(pending.request.event)) return true;
        continue;
      }
      if (pendingRunId !== admittedRunId) return false;
    }
    return false;
  };
  const claimRun = (window, runId, allowBufferedTerminalCapacity) => {
    if (window.terminalRuns.has(runId)) return invalidEvent();
    const owned = window.activeRuns.get(runId);
    if (owned) {
      const context = getAgentRunContext(runId);
      const ownerStatus = getAgentRunContextOwnerStatus(
        runId,
        owned.claimId,
        owned.lifecycleGeneration,
      );
      if (ownerStatus === void 0) {
        clearWindow(window);
        return resyncRequired(0);
      }
      if (
        ownerStatus !== "active" ||
        context?.sessionId !== window.sessionId ||
        context.sessionKey !== window.target.sessionKey ||
        context.agentId !== window.target.agentId ||
        context.lifecycleGeneration !== owned.lifecycleGeneration ||
        context.isControlUiVisible !== owned.controlUiVisible
      ) {
        fenceReleasedRun(window, runId);
        return invalidEvent();
      }
      return owned;
    }
    const pruneFailure = pruneReleasedRuns(window);
    if (pruneFailure) return pruneFailure;
    const countedRunIds = /* @__PURE__ */ new Set();
    for (const activeRunId of window.activeRuns.keys())
      if (!window.terminalRuns.has(activeRunId)) countedRunIds.add(activeRunId);
    if (
      countedRunIds.size >= maxActiveRuns &&
      !(allowBufferedTerminalCapacity && hasReachableBufferedTerminal(window, runId, countedRunIds))
    )
      return capacityExceeded();
    const lifecycleGeneration = getAgentEventLifecycleGeneration();
    const existingContext = getAgentRunContext(runId);
    const controlUiVisible = existingContext?.isControlUiVisible ?? false;
    const adoptExistingUnowned = existingContext !== void 0;
    if (
      existingContext &&
      (existingContext.sessionId !== window.sessionId ||
        existingContext.sessionKey !== window.target.sessionKey ||
        existingContext.agentId !== window.target.agentId ||
        existingContext.lifecycleGeneration !== lifecycleGeneration)
    )
      return invalidEvent();
    const claimId = claimAgentRunContext(
      runId,
      {
        ...(window.target.agentId ? { agentId: window.target.agentId } : {}),
        isControlUiVisible: controlUiVisible,
        lifecycleGeneration,
        projectSessionActive: true,
        sessionId: window.sessionId,
        sessionKey: window.target.sessionKey,
      },
      {
        adoptExistingUnowned,
        exclusive: true,
        onClearRequested: (clearedClaimId) => {
          if (window.activeRuns.get(runId)?.claimId === clearedClaimId)
            fenceReleasedRun(window, runId);
        },
        ownsContext: true,
        trackOwner: true,
      },
    );
    if (!claimId) return invalidEvent();
    const claimed = {
      claimId,
      controlUiVisible,
      lifecycleGeneration,
    };
    window.activeRuns.set(runId, claimed);
    return claimed;
  };
  const publish = (window, request, allowBufferedTerminalCapacity) => {
    const owned = claimRun(window, request.runId, allowBufferedTerminalCapacity);
    if ("ok" in owned) return owned;
    if (isDefinitiveTerminal(request.event)) window.terminalRuns.set(request.runId, request.seq);
    emitAgentEventForOwner(
      {
        runId: request.runId,
        stream: request.event.kind,
        data: prepareLiveEventData(request.event),
      },
      owned.claimId,
    );
  };
  const drain = (window, first, firstPending) => {
    let request = first;
    let buffered = firstPending;
    let publishedPrefix = false;
    while (request) {
      const failed = publish(window, request, buffered !== void 0);
      if (failed) {
        if (failed.details.reason === "capacity-exceeded" && buffered)
          return {
            ok: true,
            result: { ackedSeq: window.ackedSeq },
          };
        if (buffered) {
          if (window.pending.delete(request.seq)) window.pendingBytes -= buffered.sizeBytes;
        }
        if (failed.details.reason === "capacity-exceeded" && !publishedPrefix) {
          clearWindow(window);
          return failed;
        }
        return publishedPrefix
          ? {
              ok: true,
              result: { ackedSeq: window.ackedSeq },
            }
          : failed;
      }
      if (buffered) {
        if (window.pending.delete(request.seq)) window.pendingBytes -= buffered.sizeBytes;
      }
      window.ackedSeq = request.seq;
      publishedPrefix = true;
      const oldestRetainedSeq = window.ackedSeq - windowSize;
      for (const [runId, terminalSeq] of window.terminalRuns)
        if (!window.activeRuns.has(runId) && terminalSeq <= oldestRetainedSeq)
          window.terminalRuns.delete(runId);
      const next = window.pending.get(window.ackedSeq + 1);
      if (!next) break;
      request = next.request;
      buffered = next;
    }
    return {
      ok: true,
      result: { ackedSeq: window.ackedSeq },
    };
  };
  const apply = (params) => {
    if (!params.identity.sessionId)
      return {
        ok: false,
        details: { reason: "session-not-attached" },
      };
    if (params.request.runEpoch !== params.identity.ownerEpoch)
      return {
        ok: false,
        details: { reason: "epoch-mismatch" },
      };
    if (
      params.request.runEpoch <= (fencedEnvironmentEpochs.get(params.identity.environmentId) ?? -1)
    )
      return invalidEvent();
    const sessionId = params.identity.sessionId;
    const window = resolveOrCreateWindow(sessionId, params);
    if ("ok" in window) return window;
    const { seq } = params.request;
    const expectedSeq = window.ackedSeq + 1;
    if (seq > window.ackedSeq + windowSize) return resyncWindow(window);
    if (seq === expectedSeq) {
      const pending = window.pending.get(seq);
      return drain(window, pending?.request ?? params.request, pending);
    }
    if (window.pending.has(seq))
      return {
        ok: true,
        result: { ackedSeq: window.ackedSeq },
      };
    const sizeBytes = Buffer.byteLength(JSON.stringify(params.request.event), "utf8");
    if (window.pendingBytes + sizeBytes > maxPendingBytes) return resyncWindow(window);
    window.pending.set(seq, {
      request: params.request,
      sizeBytes,
    });
    window.pendingBytes += sizeBytes;
    return {
      ok: true,
      result: { ackedSeq: window.ackedSeq },
    };
  };
  const clearEnvironment = (environmentId) => {
    startupOwners.delete(environmentId);
    let fencedEpoch = fencedEnvironmentEpochs.get(environmentId) ?? -1;
    for (const [sessionId, binding] of sessionBindings)
      if (binding.environmentId === environmentId) {
        fencedEpoch = Math.max(fencedEpoch, binding.runEpoch);
        sessionBindings.delete(sessionId);
        boundSessions.delete(sessionId);
        staleSessions.delete(sessionId);
      }
    for (const window of windows.values())
      if (window.environmentId === environmentId) {
        fencedEpoch = Math.max(fencedEpoch, window.runEpoch);
        clearWindow(window);
      }
    if (fencedEpoch >= 0) {
      fencedEnvironmentEpochs.delete(environmentId);
      fencedEnvironmentEpochs.set(environmentId, fencedEpoch);
      if (fencedEnvironmentEpochs.size > MAX_FENCED_ENVIRONMENTS) {
        const oldestEnvironmentId = fencedEnvironmentEpochs.keys().next().value;
        if (oldestEnvironmentId) fencedEnvironmentEpochs.delete(oldestEnvironmentId);
      }
    }
  };
  const clear = () => {
    unsubscribeSessionIdentityMutation?.();
    unsubscribeSessionIdentityMutation = void 0;
    for (const window of windows.values()) clearWindow(window);
    boundSessions.clear();
    sessionBindings.clear();
    fencedEnvironmentEpochs.clear();
    staleSessions.clear();
    startupOwners.clear();
  };
  return {
    apply,
    bindSession,
    clear,
    clearEnvironment,
    rebindAll,
    rotateCredential,
    start,
  };
}
//#endregion
export { createWorkerLiveEventReceiver };
