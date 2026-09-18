import crypto from "node:crypto";
import { c as callGateway } from "./call-BVMO6az_.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import "./message-channel-NQc9DJ6B.js";
import {
  i as readLatestAssistantReplySnapshot,
  o as waitForAgentRunAndReadUpdatedAssistantReply,
} from "./run-wait-DMr8NMo_.js";
import { D as patchSessionEntry, S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import "./subagent-run-liveness-CYJpdt9z.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  c as resolveMainSessionAlias,
  s as resolveInternalSessionKey,
} from "./sessions-helpers-DN9IrrxU.js";
import { n as resolveStoredSubagentCapabilities } from "./subagent-capabilities-DP50Hfbb.js";
import {
  r as resolveSessionEntryForKey,
  t as buildLatestSubagentRunIndex,
} from "./subagent-list-D5vuKses.js";
import {
  _ as replaceSubagentRunAfterSteer,
  a as countPendingDescendantRuns,
  b as resolveFinalizedSubagentTaskState,
  m as markSubagentRunTerminated,
  n as clearSubagentRunSteerRestart,
  p as markSubagentRunForSteerRestart,
  x as resolveKilledSubagentTaskEndedAt,
} from "./subagent-registry-CZikbOhO.js";
import {
  c as listSubagentRunsForController,
  i as getLatestSubagentRunByChildSessionKey,
} from "./subagent-registry-read-BYGCPLV8.js";
import {
  E as subagentRuns,
  t as getSubagentRunsSnapshotForRead,
} from "./subagent-registry-state-tCJeOSqd.js";
import { a as sortSubagentRuns, r as resolveSubagentLabel } from "./subagents-utils--q1dbPqc.js";
import { F as SUBAGENT_KILL_TASK_ERROR } from "./task-registry-C44yDrOW.js";
//#region src/agents/subagent-control.ts
/**
 * Implements subagent control operations: list, kill, steer, and send-message.
 * The module enforces controller ownership before mutating child sessions or
 * routing internal follow-up messages.
 */
/** Maximum recent-run window accepted by subagent control UI/tools. */
const MAX_RECENT_MINUTES = 1440;
const STEER_RATE_LIMIT_MS = 2e3;
const STEER_ABORT_SETTLE_TIMEOUT_MS = 5e3;
const SUBAGENT_REPLY_HISTORY_LIMIT = 50;
const steerRateLimit = /* @__PURE__ */ new Map();
let subagentControlDeps = {
  callGateway,
  patchSessionEntry,
};
const subagentControlRuntimeLoader = createLazyImportLoader(
  () => import("./subagent-control.runtime.js"),
);
function loadSubagentControlRuntime() {
  return subagentControlRuntimeLoader.load();
}
async function resolveSubagentControlRuntime() {
  if (
    subagentControlDeps.abortEmbeddedAgentRun &&
    subagentControlDeps.isEmbeddedAgentRunActive &&
    subagentControlDeps.clearSessionQueues
  )
    return {
      abortEmbeddedAgentRun: subagentControlDeps.abortEmbeddedAgentRun,
      isEmbeddedAgentRunActive: subagentControlDeps.isEmbeddedAgentRunActive,
      clearSessionQueues: subagentControlDeps.clearSessionQueues,
    };
  const runtime = await loadSubagentControlRuntime();
  return {
    abortEmbeddedAgentRun:
      subagentControlDeps.abortEmbeddedAgentRun ?? runtime.abortEmbeddedAgentRun,
    isEmbeddedAgentRunActive:
      subagentControlDeps.isEmbeddedAgentRunActive ?? runtime.isEmbeddedAgentRunActive,
    clearSessionQueues: subagentControlDeps.clearSessionQueues ?? runtime.clearSessionQueues,
  };
}
/** Resolves which subagent runs the caller is allowed to control. */
function resolveSubagentController(params) {
  const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
  const callerSessionKey = resolveInternalSessionKey({
    key: params.agentSessionKey?.trim() || alias,
    alias,
    mainKey,
  });
  if (!isSubagentSessionKey(callerSessionKey))
    return {
      controllerSessionKey: callerSessionKey,
      callerSessionKey,
      callerIsSubagent: false,
      controlScope: "children",
    };
  return {
    controllerSessionKey: callerSessionKey,
    callerSessionKey,
    callerIsSubagent: true,
    controlScope: resolveStoredSubagentCapabilities(callerSessionKey, { cfg: params.cfg })
      .controlScope,
  };
}
function isSubagentRunVisibleToSession(entry, sessionKey) {
  const controllerKey = entry.controllerSessionKey?.trim();
  const requesterKey = entry.requesterSessionKey.trim();
  return controllerKey === sessionKey || requesterKey === sessionKey;
}
/** Lists latest child runs controlled by a session key. */
function listControlledSubagentRuns(controllerSessionKey) {
  const key = controllerSessionKey.trim();
  if (!key) return [];
  const latestByChildSessionKey = buildLatestSubagentRunIndex(
    getSubagentRunsSnapshotForRead(subagentRuns),
  ).latestByChildSessionKey;
  return sortSubagentRuns(
    Array.from(latestByChildSessionKey.values()).filter((entry) =>
      isSubagentRunVisibleToSession(entry, key),
    ),
  );
}
function ensureControllerOwnsRun(params) {
  if (
    (params.entry.controllerSessionKey?.trim() || params.entry.requesterSessionKey) ===
    params.controller.controllerSessionKey
  )
    return;
  return "Subagents can only control runs spawned from their own session.";
}
function isFinishedForSteerControl(entry, hasPendingDescendants) {
  return Boolean(entry.endedAt) && entry.pauseReason !== "sessions_yield" && !hasPendingDescendants;
}
function resolveSubagentKillTargetState(entry) {
  if (entry.endedReason === "subagent-killed" && entry.suppressAnnounceReason !== "steer-restart") {
    const taskEndedAt = resolveKilledSubagentTaskEndedAt(entry);
    return typeof taskEndedAt === "number"
      ? {
          state: "terminal",
          task: {
            status: "cancelled",
            endedAt: taskEndedAt,
            lastEventAt: taskEndedAt,
            error: SUBAGENT_KILL_TASK_ERROR,
            progressSummary: entry.completion?.resultText ?? void 0,
            terminalSummary: null,
          },
        }
      : void 0;
  }
  const terminal = resolveFinalizedSubagentTaskState(entry);
  if (terminal)
    return {
      state: "terminal",
      task: terminal,
    };
  return typeof entry.endedAt === "number" &&
    entry.pauseReason !== "sessions_yield" &&
    (entry.endedReason !== "subagent-killed" || entry.suppressAnnounceReason === "steer-restart")
    ? { state: "finalizing" }
    : void 0;
}
async function persistSubagentAbortedLastRun(params) {
  if (!params.hasSessionEntry) return;
  try {
    await subagentControlDeps.patchSessionEntry(
      {
        storePath: params.storePath,
        sessionKey: params.childSessionKey,
      },
      (current) => ({
        ...current,
        abortedLastRun: params.abortedLastRun,
        updatedAt: Date.now(),
      }),
      { replaceEntry: true },
    );
  } catch (error) {
    logVerbose(
      `subagents control kill: failed to persist abortedLastRun=${params.abortedLastRun} for ${params.childSessionKey}: ${formatErrorMessage(error)}`,
    );
  }
}
function markSubagentRunTerminatedBestEffort(params) {
  try {
    return markSubagentRunTerminated(params);
  } catch (error) {
    logVerbose(
      `subagents control kill: failed to persist ${params.runId ?? params.childSessionKey ?? "unknown"}: ${formatErrorMessage(error)}`,
    );
    return 0;
  }
}
async function killSubagentRun(params) {
  const initialTargetState = resolveSubagentKillTargetState(params.entry);
  if (initialTargetState) {
    if (
      params.entry.endedReason === "subagent-killed" &&
      params.entry.suppressAnnounceReason !== "steer-restart"
    )
      markSubagentRunTerminatedBestEffort({
        runId: params.entry.runId,
        childSessionKey: params.entry.childSessionKey,
        reason: "killed",
      });
    return {
      killed: false,
      targetState: initialTargetState,
    };
  }
  if (params.entry.endedAt && params.entry.pauseReason !== "sessions_yield")
    return { killed: false };
  const childSessionKey = params.entry.childSessionKey;
  const resolved = resolveSessionEntryForKey({
    cfg: params.cfg,
    key: childSessionKey,
    cache: params.cache,
  });
  const sessionId = resolved.entry?.sessionId;
  const runtime = await resolveSubagentControlRuntime();
  const targetStateAfterRuntimeLoad = resolveSubagentKillTargetState(params.entry);
  if (targetStateAfterRuntimeLoad) {
    if (
      params.entry.endedReason === "subagent-killed" &&
      params.entry.suppressAnnounceReason !== "steer-restart"
    )
      markSubagentRunTerminatedBestEffort({
        runId: params.entry.runId,
        childSessionKey,
        reason: "killed",
      });
    return {
      killed: false,
      sessionId,
      targetState: targetStateAfterRuntimeLoad,
    };
  }
  const active = sessionId ? runtime.isEmbeddedAgentRunActive(sessionId) : false;
  const aborted = sessionId ? runtime.abortEmbeddedAgentRun(sessionId) : false;
  const cleared = runtime.clearSessionQueues([childSessionKey, sessionId]);
  if (cleared.followupCleared > 0 || cleared.laneCleared > 0)
    logVerbose(
      `subagents control kill: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`,
    );
  if (active && !aborted)
    return {
      killed: false,
      sessionId,
    };
  const persistAbortedLastRun = (abortedLastRun) =>
    persistSubagentAbortedLastRun({
      childSessionKey,
      storePath: resolved.storePath,
      hasSessionEntry: resolved.entry !== void 0,
      abortedLastRun,
    });
  await persistAbortedLastRun(true);
  const targetState = resolveSubagentKillTargetState(params.entry);
  if (targetState) {
    const killedTarget =
      targetState.state === "terminal" &&
      targetState.task.status === "cancelled" &&
      targetState.task.error === "Subagent run killed.";
    if (killedTarget)
      markSubagentRunTerminatedBestEffort({
        runId: params.entry.runId,
        childSessionKey,
        reason: "killed",
      });
    else await persistAbortedLastRun(false);
    return {
      killed: killedTarget && (aborted || cleared.followupCleared > 0 || cleared.laneCleared > 0),
      sessionId,
      targetState,
    };
  }
  return {
    killed:
      markSubagentRunTerminatedBestEffort({
        runId: params.entry.runId,
        childSessionKey,
        reason: "killed",
      }) > 0 ||
      aborted ||
      cleared.followupCleared > 0 ||
      cleared.laneCleared > 0,
    sessionId,
  };
}
async function cascadeKillChildren(params) {
  const childRunsBySessionKey = /* @__PURE__ */ new Map();
  for (const run of listSubagentRunsForController(params.parentChildSessionKey)) {
    const childKey = run.childSessionKey?.trim();
    if (!childKey) continue;
    const latest = getLatestSubagentRunByChildSessionKey(childKey);
    const latestControllerSessionKey =
      latest?.controllerSessionKey?.trim() || latest?.requesterSessionKey?.trim();
    if (
      !latest ||
      latest.runId !== run.runId ||
      latestControllerSessionKey !== params.parentChildSessionKey
    )
      continue;
    childRunsBySessionKey.set(childKey, run);
  }
  const childRuns = Array.from(childRunsBySessionKey.values());
  const seenChildSessionKeys = params.seenChildSessionKeys ?? /* @__PURE__ */ new Set();
  let killed = 0;
  const labels = [];
  for (const run of childRuns) {
    const childKey = run.childSessionKey?.trim();
    if (!childKey || seenChildSessionKeys.has(childKey)) continue;
    seenChildSessionKeys.add(childKey);
    if (!run.endedAt || run.pauseReason === "sessions_yield") {
      if (
        (
          await killSubagentRun({
            cfg: params.cfg,
            entry: run,
            cache: params.cache,
          })
        ).killed
      ) {
        killed += 1;
        labels.push(resolveSubagentLabel(run));
      }
    }
    const cascade = await cascadeKillChildren({
      cfg: params.cfg,
      parentChildSessionKey: childKey,
      cache: params.cache,
      seenChildSessionKeys,
    });
    killed += cascade.killed;
    labels.push(...cascade.labels);
  }
  return {
    killed,
    labels,
  };
}
/** Kills every currently controlled child run and its descendants. */
async function killAllControlledSubagentRuns(params) {
  if (params.controller.controlScope !== "children")
    return {
      status: "forbidden",
      error: "Leaf subagents cannot control other sessions.",
      killed: 0,
      labels: [],
    };
  const cache = /* @__PURE__ */ new Map();
  const seenChildSessionKeys = /* @__PURE__ */ new Set();
  const killedLabels = [];
  let killed = 0;
  for (const entry of params.runs) {
    const childKey = entry.childSessionKey?.trim();
    if (!childKey || seenChildSessionKeys.has(childKey)) continue;
    const currentEntry = getLatestSubagentRunByChildSessionKey(childKey);
    if (!currentEntry || currentEntry.runId !== entry.runId) continue;
    seenChildSessionKeys.add(childKey);
    if (!currentEntry.endedAt || currentEntry.pauseReason === "sessions_yield") {
      if (
        (
          await killSubagentRun({
            cfg: params.cfg,
            entry: currentEntry,
            cache,
          })
        ).killed
      ) {
        killed += 1;
        killedLabels.push(resolveSubagentLabel(currentEntry));
      }
    }
    const cascade = await cascadeKillChildren({
      cfg: params.cfg,
      parentChildSessionKey: childKey,
      cache,
      seenChildSessionKeys,
    });
    killed += cascade.killed;
    killedLabels.push(...cascade.labels);
  }
  return {
    status: "ok",
    killed,
    labels: killedLabels,
  };
}
/** Kills one controlled subagent run and any active descendants. */
async function killControlledSubagentRun(params) {
  const ownershipError = ensureControllerOwnsRun({
    controller: params.controller,
    entry: params.entry,
  });
  if (ownershipError)
    return {
      status: "forbidden",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      error: ownershipError,
    };
  if (params.controller.controlScope !== "children")
    return {
      status: "forbidden",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      error: "Leaf subagents cannot control other sessions.",
    };
  const currentEntry = getLatestSubagentRunByChildSessionKey(params.entry.childSessionKey);
  if (!currentEntry || currentEntry.runId !== params.entry.runId)
    return {
      status: "done",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      label: resolveSubagentLabel(params.entry),
      text: `${resolveSubagentLabel(params.entry)} is already finished.`,
    };
  const killCache = /* @__PURE__ */ new Map();
  const stopResult = await killSubagentRun({
    cfg: params.cfg,
    entry: currentEntry,
    cache: killCache,
  });
  const seenChildSessionKeys = /* @__PURE__ */ new Set();
  const targetChildKey = params.entry.childSessionKey?.trim();
  if (targetChildKey) seenChildSessionKeys.add(targetChildKey);
  const cascade = await cascadeKillChildren({
    cfg: params.cfg,
    parentChildSessionKey: params.entry.childSessionKey,
    cache: killCache,
    seenChildSessionKeys,
  });
  if (!stopResult.killed && cascade.killed === 0)
    return {
      status: "done",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      label: resolveSubagentLabel(params.entry),
      text: `${resolveSubagentLabel(params.entry)} is already finished.`,
    };
  const cascadeText =
    cascade.killed > 0 ? ` (+ ${cascade.killed} descendant${cascade.killed === 1 ? "" : "s"})` : "";
  return {
    status: "ok",
    runId: params.entry.runId,
    sessionKey: params.entry.childSessionKey,
    label: resolveSubagentLabel(params.entry),
    cascadeKilled: cascade.killed,
    cascadeLabels: cascade.killed > 0 ? cascade.labels : void 0,
    text: stopResult.killed
      ? `killed ${resolveSubagentLabel(params.entry)}${cascadeText}.`
      : `killed ${cascade.killed} descendant${cascade.killed === 1 ? "" : "s"} of ${resolveSubagentLabel(params.entry)}.`,
  };
}
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
async function killSubagentRunAdmin(params) {
  const targetSessionKey = params.sessionKey.trim();
  if (!targetSessionKey)
    return {
      found: false,
      killed: false,
    };
  const entry = getLatestSubagentRunByChildSessionKey(targetSessionKey);
  if (!entry)
    return {
      found: false,
      killed: false,
    };
  const killCache = /* @__PURE__ */ new Map();
  const stopResult = await killSubagentRun({
    cfg: params.cfg,
    entry,
    cache: killCache,
  });
  const seenChildSessionKeys = /* @__PURE__ */ new Set([targetSessionKey]);
  const cascade = await cascadeKillChildren({
    cfg: params.cfg,
    parentChildSessionKey: targetSessionKey,
    cache: killCache,
    seenChildSessionKeys,
  });
  const targetState = resolveSubagentKillTargetState(entry) ?? stopResult.targetState;
  const killedTarget =
    targetState?.state === "terminal" &&
    targetState.task.status === "cancelled" &&
    targetState.task.error === "Subagent run killed.";
  const stopResultAlreadyClearedAbort =
    stopResult.targetState !== void 0 &&
    !(
      stopResult.targetState.state === "terminal" &&
      stopResult.targetState.task.status === "cancelled" &&
      stopResult.targetState.task.error === "Subagent run killed."
    );
  if (targetState && !killedTarget && !stopResultAlreadyClearedAbort) {
    const resolved = resolveSessionEntryForKey({
      cfg: params.cfg,
      key: targetSessionKey,
      cache: killCache,
    });
    await persistSubagentAbortedLastRun({
      childSessionKey: targetSessionKey,
      storePath: resolved.storePath,
      hasSessionEntry: resolved.entry !== void 0,
      abortedLastRun: false,
    });
  }
  return {
    found: true,
    killed: stopResult.killed || cascade.killed > 0,
    ...(targetState ? { targetState } : {}),
    runId: entry.runId,
    sessionKey: entry.childSessionKey,
    cascadeKilled: cascade.killed,
    cascadeLabels: cascade.killed > 0 ? cascade.labels : void 0,
  };
}
/** Restarts a controlled subagent run with a new steering message. */
async function steerControlledSubagentRun(params) {
  const ownershipError = ensureControllerOwnsRun({
    controller: params.controller,
    entry: params.entry,
  });
  if (ownershipError)
    return {
      status: "forbidden",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      error: ownershipError,
    };
  if (params.controller.controlScope !== "children")
    return {
      status: "forbidden",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      error: "Leaf subagents cannot control other sessions.",
    };
  const targetHasPendingDescendants = countPendingDescendantRuns(params.entry.childSessionKey) > 0;
  if (isFinishedForSteerControl(params.entry, targetHasPendingDescendants))
    return {
      status: "done",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      text: `${resolveSubagentLabel(params.entry)} is already finished.`,
    };
  if (params.controller.callerSessionKey === params.entry.childSessionKey)
    return {
      status: "forbidden",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      error: "Subagents cannot steer themselves.",
    };
  const currentEntry = getLatestSubagentRunByChildSessionKey(params.entry.childSessionKey);
  const currentHasPendingDescendants = currentEntry
    ? countPendingDescendantRuns(currentEntry.childSessionKey) > 0
    : false;
  if (
    !currentEntry ||
    currentEntry.runId !== params.entry.runId ||
    isFinishedForSteerControl(currentEntry, currentHasPendingDescendants)
  )
    return {
      status: "done",
      runId: params.entry.runId,
      sessionKey: params.entry.childSessionKey,
      text: `${resolveSubagentLabel(params.entry)} is already finished.`,
    };
  const rateKey = `${params.controller.callerSessionKey}:${params.entry.childSessionKey}`;
  if (process.env.VITEST !== "true") {
    const now = Date.now();
    if (now - (steerRateLimit.get(rateKey) ?? 0) < STEER_RATE_LIMIT_MS)
      return {
        status: "rate_limited",
        runId: params.entry.runId,
        sessionKey: params.entry.childSessionKey,
        error: "Steer rate limit exceeded. Wait a moment before sending another steer.",
      };
    steerRateLimit.set(rateKey, now);
  }
  markSubagentRunForSteerRestart(params.entry.runId);
  const targetSession = resolveSessionEntryForKey({
    cfg: params.cfg,
    key: params.entry.childSessionKey,
    cache: /* @__PURE__ */ new Map(),
  });
  const sessionId =
    typeof targetSession.entry?.sessionId === "string" && targetSession.entry.sessionId.trim()
      ? targetSession.entry.sessionId.trim()
      : void 0;
  const restartSessionId = sessionId ? crypto.randomUUID() : void 0;
  const runtime = await resolveSubagentControlRuntime();
  if (sessionId) {
    const active = runtime.isEmbeddedAgentRunActive(sessionId);
    const aborted = runtime.abortEmbeddedAgentRun(sessionId);
    if (active && !aborted) {
      clearSubagentRunSteerRestart(params.entry.runId);
      return {
        status: "error",
        runId: params.entry.runId,
        sessionKey: params.entry.childSessionKey,
        sessionId,
        error: "Subagent reply is already finalizing and can no longer be restarted.",
      };
    }
  }
  const cleared = runtime.clearSessionQueues([params.entry.childSessionKey, sessionId]);
  if (cleared.followupCleared > 0 || cleared.laneCleared > 0)
    logVerbose(
      `subagents control steer: cleared followups=${cleared.followupCleared} lane=${cleared.laneCleared} keys=${cleared.keys.join(",")}`,
    );
  try {
    await subagentControlDeps.callGateway({
      method: "agent.wait",
      params: {
        runId: params.entry.runId,
        timeoutMs: STEER_ABORT_SETTLE_TIMEOUT_MS,
      },
      timeoutMs: 7e3,
    });
  } catch {}
  const idempotencyKey = crypto.randomUUID();
  let runId = idempotencyKey;
  try {
    const response = await subagentControlDeps.callGateway({
      method: "agent",
      params: {
        message: params.message,
        sessionKey: params.entry.childSessionKey,
        sessionId: restartSessionId,
        idempotencyKey,
        deliver: false,
        channel: INTERNAL_MESSAGE_CHANNEL,
        lane: AGENT_LANE_SUBAGENT,
        timeout: 0,
      },
      timeoutMs: 1e4,
    });
    if (typeof response?.runId === "string" && response.runId) runId = response.runId;
  } catch (err) {
    clearSubagentRunSteerRestart(params.entry.runId);
    const error = formatErrorMessage(err);
    return {
      status: "error",
      runId,
      sessionKey: params.entry.childSessionKey,
      sessionId: restartSessionId,
      error,
    };
  }
  if (
    !replaceSubagentRunAfterSteer({
      previousRunId: params.entry.runId,
      nextRunId: runId,
      fallback: params.entry,
      runTimeoutSeconds: params.entry.runTimeoutSeconds ?? 0,
      task: params.message,
    })
  ) {
    clearSubagentRunSteerRestart(params.entry.runId);
    return {
      status: "error",
      runId,
      sessionKey: params.entry.childSessionKey,
      sessionId: restartSessionId,
      error: "failed to replace steered subagent run",
    };
  }
  return {
    status: "accepted",
    runId,
    sessionKey: params.entry.childSessionKey,
    sessionId: restartSessionId,
    mode: "restart",
    label: resolveSubagentLabel(params.entry),
    text: `steered ${resolveSubagentLabel(params.entry)}.`,
  };
}
/** Sends a follow-up message to a controlled subagent and waits for a reply. */
async function sendControlledSubagentMessage(params) {
  const ownershipError = ensureControllerOwnsRun({
    controller: params.controller,
    entry: params.entry,
  });
  if (ownershipError)
    return {
      status: "forbidden",
      error: ownershipError,
    };
  if (params.controller.controlScope !== "children")
    return {
      status: "forbidden",
      error: "Leaf subagents cannot control other sessions.",
    };
  const currentEntry = getLatestSubagentRunByChildSessionKey(params.entry.childSessionKey);
  if (!currentEntry || currentEntry.runId !== params.entry.runId)
    return {
      status: "done",
      runId: params.entry.runId,
      text: `${resolveSubagentLabel(params.entry)} is already finished.`,
    };
  const targetSessionKey = params.entry.childSessionKey;
  const parsed = parseAgentSessionKey(targetSessionKey);
  const targetSessionEntry = loadSessionEntry({
    storePath: resolveStorePath(params.cfg.session?.store, { agentId: parsed?.agentId }),
    sessionKey: targetSessionKey,
    clone: false,
  });
  const targetSessionId =
    typeof targetSessionEntry?.sessionId === "string" && targetSessionEntry.sessionId.trim()
      ? targetSessionEntry.sessionId.trim()
      : void 0;
  const idempotencyKey = crypto.randomUUID();
  let runId = idempotencyKey;
  try {
    const baselineReply = await readLatestAssistantReplySnapshot({
      sessionKey: targetSessionKey,
      limit: SUBAGENT_REPLY_HISTORY_LIMIT,
      callGateway: subagentControlDeps.callGateway,
    });
    const response = await subagentControlDeps.callGateway({
      method: "agent",
      params: {
        message: params.message,
        sessionKey: targetSessionKey,
        sessionId: targetSessionId,
        idempotencyKey,
        deliver: false,
        channel: INTERNAL_MESSAGE_CHANNEL,
        lane: AGENT_LANE_SUBAGENT,
        timeout: 0,
      },
      timeoutMs: 1e4,
    });
    const responseRunId = typeof response?.runId === "string" ? response.runId : void 0;
    if (responseRunId) runId = responseRunId;
    const result = await waitForAgentRunAndReadUpdatedAssistantReply({
      runId,
      sessionKey: targetSessionKey,
      timeoutMs: 3e4,
      limit: SUBAGENT_REPLY_HISTORY_LIMIT,
      baseline: baselineReply,
      callGateway: subagentControlDeps.callGateway,
    });
    if (result.status === "timeout")
      return {
        status: "timeout",
        runId,
      };
    if (result.status === "error")
      return {
        status: "error",
        runId,
        error: result.error ?? "unknown error",
      };
    return {
      status: "ok",
      runId,
      replyText: result.replyText,
    };
  } catch (err) {
    const error = formatErrorMessage(err);
    return {
      status: "error",
      runId,
      error,
    };
  }
}
//#endregion
export {
  listControlledSubagentRuns as a,
  steerControlledSubagentRun as c,
  killSubagentRunAdmin as i,
  killAllControlledSubagentRuns as n,
  resolveSubagentController as o,
  killControlledSubagentRun as r,
  sendControlledSubagentMessage as s,
  MAX_RECENT_MINUTES as t,
};
