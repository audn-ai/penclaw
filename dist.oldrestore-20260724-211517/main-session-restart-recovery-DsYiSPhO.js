import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  f as getAgentEventLifecycleGeneration,
  g as listAgentRunsForSession,
} from "./agent-events-D4UsOPeT.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import {
  n as deliveryContextFromSession,
  o as normalizeDeliveryContext,
} from "./delivery-context.shared-WPZGmi9R.js";
import { f as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-yGjmBAjy.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-5_TQ_dr5.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  o as resolveSessionTranscriptPathInDir,
  r as resolveSessionFilePath,
} from "./paths-TfuVT-K8.js";
import { a as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-YbK8a1_s.js";
import {
  f as listActiveEmbeddedRunSessionIds,
  p as listActiveEmbeddedRunSessionKeys,
} from "./run-state-BJlMim-d.js";
import "./message-channel-NQc9DJ6B.js";
import { n as resolveSendPolicy } from "./send-policy-2la2ZHDC.js";
import {
  b as loadExactSessionEntry,
  ht as listSessionEntriesByStatus,
  o as applySessionEntryReplacements,
} from "./session-accessor-PZVNxFCV.js";
import { t as resolveAgentSessionDirs } from "./session-dirs-D4v_ujH0.js";
import "./sessions-CEG7v41b.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import {
  a as isSubagentSessionKey,
  i as isCronSessionKey,
  n as isAcpSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import { h as resolveGatewaySessionStoreTarget } from "./session-utils-DjTWBI0J.js";
import "./code-mode-control-tools-B27uc_a6.js";
import {
  X as beginSessionWorkAdmission,
  it as cancelSessionWorkAdmissionHandoff,
  vt as buildRestartRecoveryClaimCleanupPatch,
} from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { i as resolveAllAgentSessionStoreTargetsSync } from "./targets-CjMfpXbt.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-kgNtplfz.js";
//#region src/agents/main-session-restart-claim.ts
function matchesExpectedRestartRecoveryClaim(entry, expected) {
  return Boolean(
    entry &&
    entry.sessionId === expected.sessionId &&
    entry.status === "running" &&
    entry.abortedLastRun === true &&
    normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === expected.recoveryRunId &&
    normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) ===
      expected.recoverySourceRunId,
  );
}
function loadExpectedRestartRecoveryClaim(params) {
  const exact = loadExactSessionEntry({
    readConsistency: "latest",
    sessionKey: params.expected.sessionKey,
    storePath: params.storePath,
  });
  return exact?.sessionKey === params.expected.sessionKey &&
    matchesExpectedRestartRecoveryClaim(exact.entry, params.expected)
    ? exact.entry
    : void 0;
}
function buildUnresumableSessionNoticeIdempotencyKey(entry) {
  return `main-session-restart-recovery:${normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) ?? normalizeOptionalString(entry.restartRecoveryDeliveryRunId) ?? entry.sessionId}:failed-notice`;
}
//#endregion
//#region src/agents/main-session-restart-dispatch.ts
const log$1 = createSubsystemLogger("main-session-restart-recovery");
const RESTART_RECOVERY_RESUME_MESSAGE =
  "[System] Your previous turn was interrupted by a gateway restart while OpenClaw was waiting on tool/model work. Continue from the existing transcript and finish the interrupted response.";
function normalizeFiniteTimestamp$1(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function buildResumeMessage(pendingFinalDeliveryText) {
  const sanitizedPendingText =
    typeof pendingFinalDeliveryText === "string"
      ? sanitizePendingFinalDeliveryText(pendingFinalDeliveryText)
      : "";
  if (sanitizedPendingText)
    return `${RESTART_RECOVERY_RESUME_MESSAGE}\n\nNote: The interrupted final reply was captured: "${sanitizedPendingText}"`;
  return RESTART_RECOVERY_RESUME_MESSAGE;
}
function resolveRestartRecoveryDeliveryContext(params) {
  const activeRunDeliveryContext = normalizeDeliveryContext(
    params.entry.restartRecoveryDeliveryContext,
  );
  const hasActiveRunDeliveryClaim =
    normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId) !== void 0;
  const deliveryContext =
    normalizeDeliveryContext(params.entry.pendingFinalDeliveryContext) ??
    activeRunDeliveryContext ??
    (params.includeSessionDeliveryFallback && !hasActiveRunDeliveryClaim
      ? deliveryContextFromSession(params.entry)
      : void 0);
  const channel = normalizeOptionalString(deliveryContext?.channel);
  const to = normalizeOptionalString(deliveryContext?.to);
  if (!channel || !to || !isDeliverableMessageChannel(channel)) return;
  if (
    params.cfg &&
    resolveSendPolicy({
      cfg: params.cfg,
      entry: params.entry,
      sessionKey: params.sessionKey,
      channel,
      chatType: params.entry.chatType,
    }) === "deny"
  )
    return;
  return {
    ...deliveryContext,
    channel,
    to,
  };
}
function normalizeRestartRecoveryTerminalStatus(value) {
  return value === "error" || value === "ok" || value === "timeout" ? value : void 0;
}
async function probeRestartRecoveryTerminalStatus(runId) {
  try {
    const result = await callGateway({
      method: "agent.wait",
      params: {
        runId,
        timeoutMs: 0,
      },
      timeoutMs: 2e3,
    });
    const status = normalizeRestartRecoveryTerminalStatus(result.status);
    return status === "timeout" && typeof result.endedAt !== "number" ? void 0 : status;
  } catch {
    return;
  }
}
async function settleRestartRecoveryDispatch(params) {
  await applySessionEntryReplacements({
    sessionKeys: params.sessionKeys,
    storePath: params.storePath,
    update: (entries) => {
      const current = entries
        .filter(
          ({ entry }) =>
            entry.sessionId === params.expectedSessionId &&
            normalizeOptionalString(entry.restartRecoveryDeliveryRunId) ===
              params.expectedRecoveryRunId &&
            normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) ===
              params.expectedRecoverySourceRunId,
        )
        .toSorted((a, b) => (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0))[0];
      if (!current) return { result: void 0 };
      const entry = current.entry;
      const now = Date.now();
      if (params.terminalStatus) {
        entry.abortedLastRun = params.terminalStatus !== "ok";
        entry.status =
          params.terminalStatus === "ok"
            ? "done"
            : params.terminalStatus === "timeout"
              ? "timeout"
              : "failed";
        entry.endedAt = now;
        const startedAt = normalizeFiniteTimestamp$1(entry.startedAt);
        if (startedAt !== void 0) entry.runtimeMs = Math.max(0, now - startedAt);
        entry.restartRecoveryForceSafeTools = void 0;
        Object.assign(
          entry,
          buildRestartRecoveryClaimCleanupPatch({
            entry,
            recordTerminalSource: true,
            terminalSourceRunId: params.expectedRecoverySourceRunId,
          }),
        );
      } else entry.abortedLastRun = false;
      entry.updatedAt = now;
      if (entry.pendingFinalDelivery || entry.pendingFinalDeliveryText)
        if (params.pendingFinalDeliveryText) {
          entry.pendingFinalDeliveryLastAttemptAt = now;
          entry.pendingFinalDeliveryAttemptCount =
            (entry.pendingFinalDeliveryAttemptCount ?? 0) + 1;
          entry.pendingFinalDeliveryLastError = null;
          entry.pendingFinalDeliveryText = params.pendingFinalDeliveryText;
        } else {
          entry.pendingFinalDelivery = void 0;
          entry.pendingFinalDeliveryText = void 0;
          entry.pendingFinalDeliveryCreatedAt = void 0;
          entry.pendingFinalDeliveryLastAttemptAt = void 0;
          entry.pendingFinalDeliveryAttemptCount = void 0;
          entry.pendingFinalDeliveryLastError = void 0;
          entry.pendingFinalDeliveryContext = void 0;
        }
      return {
        result: void 0,
        replacements: [
          {
            sessionKey: current.sessionKey,
            entry,
          },
        ],
      };
    },
  });
}
async function resumeMainSession(params) {
  const sanitizedPendingText =
    typeof params.pendingFinalDeliveryText === "string"
      ? sanitizePendingFinalDeliveryText(params.pendingFinalDeliveryText)
      : "";
  const deliveryContext = resolveRestartRecoveryDeliveryContext({
    cfg: params.cfg,
    entry: params.entry,
    sessionKey: params.sessionKey,
  });
  const claimedRunId = normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId);
  const sourceRunId = normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
  const recoveryRunId = claimedRunId && claimedRunId !== sourceRunId ? claimedRunId : randomUUID();
  const reusingRecoveryRunId = recoveryRunId === claimedRunId;
  const dispatchSessionKey = params.canonicalSessionKey ?? params.sessionKey;
  const recoverySessionKeys = Array.from(
    /* @__PURE__ */ new Set([dispatchSessionKey, params.sessionKey]),
  );
  try {
    if (
      !(await applySessionEntryReplacements({
        sessionKeys: [params.sessionKey],
        storePath: params.storePath,
        update: (entries) => {
          const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
          if (
            !entry ||
            entry.sessionId !== params.entry.sessionId ||
            entry.status !== "running" ||
            entry.abortedLastRun !== true ||
            normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !== claimedRunId ||
            normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !== sourceRunId
          )
            return { result: false };
          entry.restartRecoveryDeliveryRunId = recoveryRunId;
          if (params.forceRestartSafeTools) entry.restartRecoveryForceSafeTools = true;
          entry.updatedAt = Date.now();
          return {
            result: true,
            replacements: [
              {
                sessionKey: params.sessionKey,
                entry,
              },
            ],
          };
        },
      }))
    )
      throw new Error("restart recovery session ownership changed before dispatch");
    const agentParams = {
      message: buildResumeMessage(sanitizedPendingText),
      sessionKey: dispatchSessionKey,
      expectedExistingSessionId: params.entry.sessionId,
      ...(params.sessionWorkAdmissionHandoffId
        ? { internalRuntimeHandoffId: params.sessionWorkAdmissionHandoffId }
        : {}),
      idempotencyKey: recoveryRunId,
      deliver: Boolean(deliveryContext),
      lane: "main",
      ...(params.forceRestartSafeTools ? { forceRestartSafeTools: true } : {}),
    };
    if (deliveryContext) {
      agentParams.channel = deliveryContext.channel;
      agentParams.to = deliveryContext.to;
      agentParams.bestEffortDeliver = true;
      if (deliveryContext.accountId) agentParams.accountId = deliveryContext.accountId;
      if (deliveryContext.threadId != null) agentParams.threadId = String(deliveryContext.threadId);
    }
    if (params.forceRestartSafeTools)
      log$1.info(`dispatching restart-safe recovery for ${params.sessionKey}`);
    const dispatchResult = await callGateway({
      method: "agent",
      params: agentParams,
      timeoutMs: 1e4,
    });
    let terminalStatus = normalizeRestartRecoveryTerminalStatus(dispatchResult.status);
    if (!terminalStatus && reusingRecoveryRunId && dispatchResult.status === "accepted")
      terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId);
    await settleRestartRecoveryDispatch({
      expectedRecoveryRunId: recoveryRunId,
      expectedRecoverySourceRunId: sourceRunId,
      expectedSessionId: params.entry.sessionId,
      pendingFinalDeliveryText: sanitizedPendingText,
      sessionKeys: recoverySessionKeys,
      storePath: params.storePath,
      terminalStatus,
    });
    log$1.info(
      `resumed interrupted main session: ${params.sessionKey}${sanitizedPendingText ? " (with pending payload)" : ""}`,
    );
    return true;
  } catch (error) {
    if (
      reusingRecoveryRunId &&
      error instanceof Error &&
      error.name === "GatewayClientRequestError"
    ) {
      const terminalStatus = await probeRestartRecoveryTerminalStatus(recoveryRunId);
      if (terminalStatus) {
        await settleRestartRecoveryDispatch({
          expectedRecoveryRunId: recoveryRunId,
          expectedRecoverySourceRunId: sourceRunId,
          expectedSessionId: params.entry.sessionId,
          pendingFinalDeliveryText: sanitizedPendingText,
          sessionKeys: recoverySessionKeys,
          storePath: params.storePath,
          terminalStatus,
        });
        log$1.info(`settled completed restart recovery for ${params.sessionKey}`);
        return true;
      }
    }
    log$1.warn(`failed to resume interrupted main session ${params.sessionKey}: ${String(error)}`);
    return false;
  }
}
//#endregion
//#region src/agents/main-session-restart-recovery.ts
/**
 * Post-restart recovery for main sessions interrupted while holding a transcript lock.
 */
const log = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
const MAX_RECOVERY_RETRIES = 3;
const RETRY_BACKOFF_MULTIPLIER = 2;
const UNRESUMABLE_SESSION_NOTICE =
  "I was interrupted by a gateway restart and couldn't safely resume the previous turn. Please send that last request again and I'll pick it up cleanly.";
function shouldSkipMainRecovery(entry, sessionKey) {
  if (typeof entry.spawnDepth === "number" && entry.spawnDepth > 0) return true;
  if (entry.subagentRole != null) return true;
  return (
    isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) || isAcpSessionKey(sessionKey)
  );
}
function normalizeStringSet(values) {
  const normalized = /* @__PURE__ */ new Set();
  for (const value of values ?? []) {
    const trimmed = value.trim();
    if (trimmed) normalized.add(trimmed);
  }
  return normalized;
}
function normalizeFiniteTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function hasCurrentProcessOwner(params) {
  if (params.activeSessionIds.has(params.entry.sessionId)) return true;
  return params.activeSessionIds.size === 0 && params.activeSessionKeys.has(params.sessionKey);
}
function normalizeTranscriptLockPath(lockPath) {
  const trimmed = lockPath.trim();
  if (!path.basename(trimmed).endsWith(".jsonl.lock")) return;
  const resolved = path.resolve(trimmed);
  try {
    return path.join(fs.realpathSync(path.dirname(resolved)), path.basename(resolved));
  } catch {
    return resolved;
  }
}
function resolveEntryTranscriptLockPaths(params) {
  const paths = /* @__PURE__ */ new Set();
  const push = (resolvePath) => {
    try {
      paths.add(path.resolve(`${resolvePath()}.lock`));
    } catch {}
  };
  push(() =>
    resolveSessionFilePath(params.entry.sessionId, params.entry, {
      sessionsDir: params.sessionsDir,
    }),
  );
  push(() => resolveSessionTranscriptPathInDir(params.entry.sessionId, params.sessionsDir));
  return [...paths];
}
async function markRestartAbortedMainSessions(params) {
  const sessionKeys = normalizeStringSet(params.sessionKeys);
  const sessionIds = normalizeStringSet(params.sessionIds);
  const preferSessionIdMatch = sessionIds.size > 0;
  const activeRuns = [...(params.activeRuns ?? [])]
    .map((run) => ({
      runId: run.runId.trim(),
      lifecycleGeneration: run.lifecycleGeneration.trim(),
      sessionKey: run.sessionKey.trim(),
      sessionId: run.sessionId.trim(),
      observedAt: normalizeFiniteTimestamp(run.observedAt),
    }))
    .filter((run) => run.runId && run.lifecycleGeneration && (run.sessionKey || run.sessionId));
  const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
  const result = {
    marked: 0,
    skipped: 0,
  };
  if (sessionKeys.size === 0 && sessionIds.size === 0) return result;
  const storePaths = /* @__PURE__ */ new Set();
  const env =
    params.stateDir === void 0
      ? process.env
      : {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        };
  const stateDir = resolveStateDir(env);
  const configs = [params.cfg, ...(params.additionalCfgs ?? [])].filter((cfg) => Boolean(cfg));
  for (const cfg of configs) {
    try {
      for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env }))
        storePaths.add(path.resolve(target.storePath));
    } catch (err) {
      log.warn(`failed to resolve configured session stores for restart marker: ${String(err)}`);
    }
    for (const sessionKey of sessionKeys)
      try {
        const target = resolveGatewaySessionStoreTarget({
          cfg,
          key: sessionKey,
        });
        storePaths.add(path.resolve(target.storePath));
        for (const storeKey of target.storeKeys) {
          const trimmed = storeKey.trim();
          if (trimmed) sessionKeys.add(trimmed);
        }
      } catch (err) {
        log.warn(
          `failed to resolve session store for restart marker ${sessionKey}: ${String(err)}`,
        );
      }
  }
  for (const sessionsDir of await resolveAgentSessionDirs(stateDir))
    storePaths.add(path.join(sessionsDir, "sessions.json"));
  for (const storePath of storePaths) {
    const storeResult = await applySessionEntryReplacements({
      storePath,
      requireWriteSuccess: true,
      update: (entries) => {
        const replacements = [];
        const counts = {
          marked: 0,
          skipped: 0,
        };
        for (const { sessionKey, entry } of entries) {
          const registeredActiveRuns = listAgentRunsForSession({
            sessionKey,
            sessionId: entry.sessionId,
          });
          const matchingActiveRuns = activeRuns.filter(
            (run) =>
              (run.sessionId ? run.sessionId === entry.sessionId : run.sessionKey === sessionKey) &&
              (entry.status === "running" ||
                run.observedAt === void 0 ||
                normalizeFiniteTimestamp(entry.updatedAt) === void 0 ||
                (entry.updatedAt < run.observedAt &&
                  run.lifecycleGeneration !== currentLifecycleGeneration)) &&
              params.isActiveRun?.(run) !== false,
          );
          if (
            entry.status !== "running" &&
            matchingActiveRuns.length === 0 &&
            registeredActiveRuns.length === 0
          )
            continue;
          if (
            !(typeof entry.sessionId === "string" && sessionIds.has(entry.sessionId)
              ? true
              : !preferSessionIdMatch && sessionKeys.has(sessionKey))
          )
            continue;
          if (shouldSkipMainRecovery(entry, sessionKey)) {
            counts.skipped++;
            continue;
          }
          const wasRunning = entry.status === "running";
          entry.status = "running";
          entry.abortedLastRun = true;
          if (!wasRunning) {
            entry.startedAt = void 0;
            entry.endedAt = void 0;
            entry.runtimeMs = void 0;
          }
          const recoveryRuns = /* @__PURE__ */ new Map();
          for (const run of entry.restartRecoveryRuns ?? [])
            if (run.lifecycleGeneration === currentLifecycleGeneration)
              recoveryRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, run);
          const replaceActiveRunMarker = (run) => {
            for (const [key, existingRun] of recoveryRuns)
              if (existingRun.runId === run.runId) recoveryRuns.delete(key);
            recoveryRuns.set(`${run.runId}\u0000${run.lifecycleGeneration}`, run);
          };
          for (const run of registeredActiveRuns) replaceActiveRunMarker(run);
          for (const run of matchingActiveRuns)
            replaceActiveRunMarker({
              runId: run.runId,
              lifecycleGeneration: run.lifecycleGeneration,
            });
          entry.restartRecoveryRuns = [...recoveryRuns.values()].toSorted((a, b) =>
            a.runId === b.runId
              ? a.lifecycleGeneration.localeCompare(b.lifecycleGeneration)
              : a.runId.localeCompare(b.runId),
          );
          entry.updatedAt = Date.now();
          replacements.push({
            sessionKey,
            entry,
          });
          counts.marked++;
        }
        return {
          result: counts,
          replacements,
        };
      },
    });
    result.marked += storeResult.marked;
    result.skipped += storeResult.skipped;
  }
  if (result.marked > 0)
    log.warn(
      `marked ${result.marked} interrupted main session(s) for restart recovery${params.reason ? ` (${params.reason})` : ""}`,
    );
  return result;
}
async function markStartupOrphanedMainSessionsForRecovery(params) {
  const result = {
    marked: 0,
    skipped: 0,
  };
  const providedActiveSessionIds =
    params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
  const providedActiveSessionKeys =
    params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
  const updatedBeforeMs = normalizeFiniteTimestamp(params.updatedBeforeMs);
  const resolveActiveSessionIds = () =>
    providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
  const resolveActiveSessionKeys = () =>
    providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
  for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
    const storeResult = await applySessionEntryReplacements({
      storePath,
      statuses: ["running"],
      update: (entries) => {
        const replacements = [];
        const counts = {
          marked: 0,
          skipped: 0,
        };
        for (const { sessionKey, entry } of entries) {
          if (entry.status !== "running" || entry.abortedLastRun === true) continue;
          if (shouldSkipMainRecovery(entry, sessionKey)) {
            counts.skipped++;
            continue;
          }
          const updatedAt = normalizeFiniteTimestamp(entry.updatedAt);
          if (updatedBeforeMs !== void 0 && updatedAt !== void 0 && updatedAt > updatedBeforeMs)
            continue;
          if (
            hasCurrentProcessOwner({
              activeSessionIds: resolveActiveSessionIds(),
              activeSessionKeys: resolveActiveSessionKeys(),
              entry,
              sessionKey,
            })
          )
            continue;
          entry.abortedLastRun = true;
          entry.updatedAt = Date.now();
          replacements.push({
            sessionKey,
            entry,
          });
          counts.marked++;
        }
        return {
          result: counts,
          replacements,
        };
      },
    });
    result.marked += storeResult.marked;
    result.skipped += storeResult.skipped;
  }
  if (result.marked > 0)
    log.warn(`marked ${result.marked} startup-orphaned main session(s) for restart recovery`);
  return result;
}
function getMessageRole(message) {
  if (!message || typeof message !== "object") return;
  const role = message.role;
  return typeof role === "string" ? role : void 0;
}
function isMeaningfulTailMessage(message) {
  const role = getMessageRole(message);
  if (!role || role === "system") return false;
  return true;
}
function readCodeModeWaitCall(message) {
  if (
    !message ||
    typeof message !== "object" ||
    getMessageRole(message) !== "assistant" ||
    message.stopReason !== "toolUse"
  )
    return;
  const content = message.content;
  if (!Array.isArray(content)) return;
  const supportedTypes = /* @__PURE__ */ new Set([
    "text",
    "thinking",
    "toolCall",
    "toolUse",
    "tool_use",
  ]);
  if (
    content.some(
      (block) =>
        !block ||
        typeof block !== "object" ||
        !supportedTypes.has(String(block.type)) ||
        (block.type === "text" && Boolean(normalizeOptionalString(block.text))),
    )
  )
    return;
  const toolCalls = content.filter((block) => {
    const type = block.type;
    return type === "toolCall" || type === "toolUse" || type === "tool_use";
  });
  if (toolCalls.length !== 1) return;
  const block = toolCalls[0];
  if (normalizeOptionalString(block.name) !== "wait") return;
  const args = block.arguments ?? block.input;
  const runId = args && typeof args === "object" ? normalizeOptionalString(args.runId) : void 0;
  if (!runId) return;
  const toolCallId = normalizeOptionalString(block.id);
  return {
    runId,
    ...(toolCallId ? { toolCallId } : {}),
  };
}
function isResumableTailMessage(message) {
  const role = getMessageRole(message);
  return role === "user" || role === "tool" || role === "toolResult";
}
function isPendingAssistantToolCall(message) {
  if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant")
    return false;
  if (normalizeOptionalString(message.stopReason) !== "toolUse") return false;
  const content = message.content;
  if (!Array.isArray(content)) return false;
  let hasToolCall = false;
  for (const block of content) {
    if (!block || typeof block !== "object") return false;
    const type = normalizeOptionalString(block.type);
    if (type === "toolCall" || type === "toolUse" || type === "tool_use") {
      hasToolCall = true;
      continue;
    }
    if (type === "thinking") continue;
    if (type === "text" && !normalizeOptionalString(block.text)) continue;
    return false;
  }
  return hasToolCall;
}
function readCodeModeCheckpoint(message) {
  if (!message || typeof message !== "object") return;
  const role = getMessageRole(message);
  if (role !== "tool" && role !== "toolResult") return;
  const toolName = normalizeOptionalString(message.toolName);
  if (toolName !== "exec" && toolName !== "wait") return;
  const content = message.content;
  if (!Array.isArray(content)) return;
  const text = normalizeOptionalString(
    content.find((block) => block && typeof block === "object" && block.type === "text")?.text,
  );
  if (!text) return;
  try {
    const result = JSON.parse(text);
    if (result.status === "completed" || result.status === "failed")
      return { replaySafe: result.replaySafe === true };
    const runId = normalizeOptionalString(result.runId);
    return result.status === "waiting" && runId
      ? {
          replaySafe: result.replaySafe === true,
          runId,
        }
      : void 0;
  } catch {
    return;
  }
}
function hasReplaySafeCodeModeCheckpointInCurrentTurn(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (getMessageRole(message) === "user") return false;
    if (readCodeModeCheckpoint(message)?.replaySafe === true) return true;
  }
  return false;
}
function isRestartAbortTailArtifact(message) {
  if (!message || typeof message !== "object" || getMessageRole(message) !== "assistant")
    return false;
  const stopReason = normalizeOptionalString(message.stopReason);
  if (stopReason !== "error" && stopReason !== "aborted") return false;
  const errorMessage = normalizeOptionalString(message.errorMessage);
  const content = message.content;
  return (
    Array.isArray(content) &&
    content.length === 0 &&
    (errorMessage === "Request was aborted" || errorMessage === "This operation was aborted")
  );
}
function isRestartAbortedWaitFailure(message) {
  if (!message || typeof message !== "object" || getMessageRole(message) !== "toolResult")
    return false;
  const record = message;
  if (normalizeOptionalString(record.toolName) !== "wait" || record.isError !== true) return false;
  const details = record.details;
  if (
    !details ||
    typeof details !== "object" ||
    details.status !== "failed" ||
    details.code !== "internal_error"
  )
    return false;
  const content = record.content;
  const contentText = Array.isArray(content)
    ? content
        .filter((block) => block && typeof block === "object" && block.type === "text")
        .map((block) => normalizeOptionalString(block.text) ?? "")
        .join("\n")
    : "";
  const errorText = normalizeOptionalString(details.error) ?? normalizeOptionalString(contentText);
  return /^(?:(?:Abort)?Error:\s*)?(?:The|This) operation was aborted\.?$/u.test(errorText ?? "");
}
function isRestartAbortedWaitResultArtifact(message, waitMessage) {
  if (!isRestartAbortedWaitFailure(message)) return false;
  const toolCallId = normalizeOptionalString(message.toolCallId);
  const waitCall = readCodeModeWaitCall(waitMessage);
  return Boolean(toolCallId && waitCall?.toolCallId === toolCallId);
}
function isApprovalPendingToolResult(message) {
  if (!message || typeof message !== "object" || getMessageRole(message) !== "toolResult")
    return false;
  const details = message.details;
  if (!details || typeof details !== "object") return false;
  return details.status === "approval-pending";
}
function resolveMainSessionResumePolicy(messages, forceRestartSafeTools = false) {
  const meaningfulMessages = messages.toReversed().filter(isMeaningfulTailMessage);
  if (isRestartAbortTailArtifact(meaningfulMessages[0])) meaningfulMessages.shift();
  if (isRestartAbortedWaitResultArtifact(meaningfulMessages[0], meaningfulMessages[1]))
    meaningfulMessages.shift();
  const lastMeaningful = meaningfulMessages[0];
  if (forceRestartSafeTools && isPendingAssistantToolCall(lastMeaningful))
    return {
      blockReason: null,
      forceRestartSafeTools: true,
    };
  if (isRestartAbortedWaitFailure(lastMeaningful)) {
    const waitCall = readCodeModeWaitCall(meaningfulMessages[1]);
    const checkpoint = readCodeModeCheckpoint(meaningfulMessages[2]);
    return waitCall && checkpoint?.replaySafe === true && checkpoint.runId === waitCall.runId
      ? {
          blockReason: null,
          forceRestartSafeTools: true,
        }
      : {
          blockReason: "failed Code Mode wait cannot be matched to a replay-safe checkpoint",
          forceRestartSafeTools: false,
        };
  }
  const waitCall = readCodeModeWaitCall(lastMeaningful);
  if (waitCall) {
    const checkpoint = readCodeModeCheckpoint(meaningfulMessages[1]);
    return checkpoint?.replaySafe === true && checkpoint.runId === waitCall.runId
      ? {
          blockReason: null,
          forceRestartSafeTools: true,
        }
      : {
          blockReason: "Code Mode wait checkpoint is not replay-safe",
          forceRestartSafeTools: false,
        };
  }
  const tailCheckpoint = readCodeModeCheckpoint(lastMeaningful);
  if (tailCheckpoint)
    return tailCheckpoint.replaySafe
      ? {
          blockReason: null,
          forceRestartSafeTools: true,
        }
      : {
          blockReason: "Code Mode wait checkpoint is not replay-safe",
          forceRestartSafeTools: false,
        };
  if (!lastMeaningful || !isResumableTailMessage(lastMeaningful))
    return {
      blockReason: "transcript tail is not resumable",
      forceRestartSafeTools: false,
    };
  if (isApprovalPendingToolResult(lastMeaningful))
    return {
      blockReason: "transcript tail is a stale approval-pending tool result",
      forceRestartSafeTools: false,
    };
  return {
    blockReason: null,
    forceRestartSafeTools: false,
  };
}
async function markSessionFailed(params) {
  const marked = await applySessionEntryReplacements({
    sessionKeys: [params.sessionKey],
    storePath: params.storePath,
    update: (entries) => {
      const entry = entries.find((entry) => entry.sessionKey === params.sessionKey)?.entry;
      if (
        !entry ||
        entry.sessionId !== params.expectedSessionId ||
        entry.status !== "running" ||
        entry.abortedLastRun !== true ||
        normalizeOptionalString(entry.restartRecoveryDeliveryRunId) !==
          params.expectedRecoveryRunId ||
        normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) !==
          params.expectedRecoverySourceRunId
      )
        return { result: false };
      entry.status = "failed";
      entry.abortedLastRun = true;
      entry.endedAt = Date.now();
      entry.updatedAt = entry.endedAt;
      entry.pendingFinalDelivery = void 0;
      entry.pendingFinalDeliveryText = void 0;
      entry.pendingFinalDeliveryCreatedAt = void 0;
      entry.pendingFinalDeliveryLastAttemptAt = void 0;
      entry.pendingFinalDeliveryAttemptCount = void 0;
      entry.pendingFinalDeliveryLastError = void 0;
      entry.pendingFinalDeliveryContext = void 0;
      Object.assign(
        entry,
        buildRestartRecoveryClaimCleanupPatch({
          entry,
          recordTerminalSource: true,
        }),
      );
      return {
        result: true,
        replacements: [
          {
            sessionKey: params.sessionKey,
            entry,
          },
        ],
      };
    },
  });
  if (marked)
    log.warn(`marked interrupted main session failed: ${params.sessionKey} (${params.reason})`);
  return marked;
}
async function sendUnresumableSessionNotice(params) {
  const messageParams = {
    to: params.deliveryContext.to,
    message: UNRESUMABLE_SESSION_NOTICE,
    bestEffort: true,
  };
  if (params.deliveryContext.threadId != null)
    messageParams.threadId = params.deliveryContext.threadId;
  const actionParams = {
    channel: params.deliveryContext.channel,
    action: "send",
    sessionKey: params.sessionKey,
    sessionId: params.entry.sessionId,
    idempotencyKey: buildUnresumableSessionNoticeIdempotencyKey(params.entry),
    params: messageParams,
  };
  const accountId = normalizeOptionalString(params.deliveryContext.accountId);
  if (accountId) actionParams.accountId = accountId;
  try {
    await callGateway({
      method: "message.action",
      params: actionParams,
      timeoutMs: 1e4,
      clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
      mode: GATEWAY_CLIENT_MODES.BACKEND,
    });
    log.info(
      `sent interrupted main session recovery notice: ${params.sessionKey} (${params.reason})`,
    );
  } catch (err) {
    log.warn(
      `failed to send interrupted main session recovery notice ${params.sessionKey}: ${String(err)}`,
    );
  }
}
async function writeUnresumableSessionNotice(params) {
  const result = await appendAssistantMessageToSessionTranscript({
    agentId: resolveAgentIdFromSessionKey(params.sessionKey),
    sessionKey: params.sessionKey,
    expectedSessionId: params.entry.sessionId,
    expectedSessionState: {
      abortedLastRun: params.entry.abortedLastRun,
      restartRecoveryDeliveryRequestFingerprint:
        params.entry.restartRecoveryDeliveryRequestFingerprint,
      restartRecoveryDeliveryRunId: params.entry.restartRecoveryDeliveryRunId,
      restartRecoveryDeliverySourceRunId: params.entry.restartRecoveryDeliverySourceRunId,
      status: params.entry.status,
      updatedAt: params.entry.updatedAt,
    },
    storePath: params.storePath,
    text: UNRESUMABLE_SESSION_NOTICE,
    idempotencyKey: buildUnresumableSessionNoticeIdempotencyKey(params.entry),
  }).catch((error) => ({
    ok: false,
    reason: String(error),
  }));
  if (!result.ok)
    log.warn(
      `failed to write interrupted main session notice ${params.sessionKey}: ${result.reason}`,
    );
  return result.ok;
}
async function markRestartAbortedMainSessionsFromLocks(params) {
  const result = {
    marked: 0,
    skipped: 0,
  };
  const sessionsDir = path.resolve(params.sessionsDir);
  const interruptedLockPaths = new Set(
    params.cleanedLocks
      .map((lock) => normalizeTranscriptLockPath(lock.lockPath))
      .filter((lockPath) => Boolean(lockPath)),
  );
  if (interruptedLockPaths.size === 0) return result;
  const storeResult = await applySessionEntryReplacements({
    storePath: path.join(sessionsDir, "sessions.json"),
    statuses: ["running"],
    update: (entries) => {
      const replacements = [];
      const counts = {
        marked: 0,
        skipped: 0,
      };
      for (const { sessionKey, entry } of entries) {
        if (entry.status !== "running") continue;
        if (shouldSkipMainRecovery(entry, sessionKey)) {
          counts.skipped++;
          continue;
        }
        if (
          !resolveEntryTranscriptLockPaths({
            entry,
            sessionsDir,
          }).some((lockPath) => interruptedLockPaths.has(lockPath))
        )
          continue;
        entry.abortedLastRun = true;
        replacements.push({
          sessionKey,
          entry,
        });
        counts.marked++;
      }
      return {
        result: counts,
        replacements,
      };
    },
  });
  result.marked += storeResult.marked;
  result.skipped += storeResult.skipped;
  if (result.marked > 0)
    log.warn(`marked ${result.marked} interrupted main session(s) from stale transcript locks`);
  return result;
}
function resolveRecoveryDispatchSessionKey(params) {
  if (!params.cfg) return params.sessionKey;
  try {
    const target = resolveGatewaySessionStoreTarget({
      cfg: params.cfg,
      key: params.sessionKey,
    });
    return !params.cfg.session?.store ||
      path.resolve(target.storePath) === path.resolve(params.storePath)
      ? target.canonicalKey
      : void 0;
  } catch (err) {
    log.warn(`failed to resolve recovery store for ${params.sessionKey}: ${String(err)}`);
    return;
  }
}
async function recoverStore(params) {
  const result = {
    recovered: 0,
    failed: 0,
    skipped: 0,
  };
  const providedActiveSessionIds =
    params.activeSessionIds === void 0 ? void 0 : normalizeStringSet(params.activeSessionIds);
  const providedActiveSessionKeys =
    params.activeSessionKeys === void 0 ? void 0 : normalizeStringSet(params.activeSessionKeys);
  const resolveActiveSessionIds = () =>
    providedActiveSessionIds ?? normalizeStringSet(listActiveEmbeddedRunSessionIds());
  const resolveActiveSessionKeys = () =>
    providedActiveSessionKeys ?? normalizeStringSet(listActiveEmbeddedRunSessionKeys());
  let entries;
  try {
    if (params.expectedClaim) {
      const entry = loadExpectedRestartRecoveryClaim({
        expected: params.expectedClaim,
        storePath: params.storePath,
      });
      entries = entry
        ? [
            {
              sessionKey: params.expectedClaim.sessionKey,
              entry,
            },
          ]
        : [];
    } else entries = listSessionEntriesByStatus({ storePath: params.storePath }, ["running"]);
  } catch (err) {
    log.warn(`failed to load session store ${params.storePath}: ${String(err)}`);
    result.failed++;
    return result;
  }
  for (const { sessionKey, entry } of entries.toSorted((a, b) =>
    a.sessionKey.localeCompare(b.sessionKey),
  )) {
    if (!entry || entry.status !== "running" || entry.abortedLastRun !== true) continue;
    if (shouldSkipMainRecovery(entry, sessionKey)) {
      result.skipped++;
      continue;
    }
    if (resolveSessionWorkStartError(sessionKey, entry)) {
      result.skipped++;
      continue;
    }
    const resolvedDispatchSessionKey = resolveRecoveryDispatchSessionKey({
      cfg: params.cfg,
      sessionKey,
      storePath: params.storePath,
    });
    if (!resolvedDispatchSessionKey) {
      result.skipped++;
      continue;
    }
    const dispatchSessionKey =
      params.expectedClaim?.canonicalSessionKey ?? resolvedDispatchSessionKey;
    if (
      hasCurrentProcessOwner({
        activeSessionIds: resolveActiveSessionIds(),
        activeSessionKeys: resolveActiveSessionKeys(),
        entry,
        sessionKey,
      })
    ) {
      result.skipped++;
      continue;
    }
    const resumeDedupeKey = sessionKey;
    if (params.resumedSessionKeys.has(resumeDedupeKey)) {
      result.skipped++;
      continue;
    }
    if (
      entry.pendingFinalDelivery === true &&
      entry.pendingFinalDeliveryText &&
      entry.restartRecoveryForceSafeTools === true
    ) {
      if (
        await resumeMainSession({
          canonicalSessionKey: dispatchSessionKey,
          cfg: params.cfg,
          entry,
          storePath: params.storePath,
          sessionKey,
          pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
          forceRestartSafeTools: true,
          sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
        })
      ) {
        params.resumedSessionKeys.add(resumeDedupeKey);
        result.recovered++;
      } else result.failed++;
      continue;
    }
    let messages;
    try {
      messages = await readSessionMessagesAsync(
        {
          agentId: resolveAgentIdFromSessionKey(sessionKey),
          sessionEntry: entry,
          sessionId: entry.sessionId,
          sessionKey,
          storePath: params.storePath,
        },
        {
          mode: "recent",
          maxMessages: 20,
          maxBytes: 256 * 1024,
        },
      );
    } catch (err) {
      if (entry.pendingFinalDelivery === true && entry.pendingFinalDeliveryText) {
        log.warn(
          `transcript unavailable for ${sessionKey}; resuming its durable pending final delivery`,
        );
        if (
          await resumeMainSession({
            canonicalSessionKey: dispatchSessionKey,
            cfg: params.cfg,
            entry,
            storePath: params.storePath,
            sessionKey,
            pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
            sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
          })
        ) {
          params.resumedSessionKeys.add(resumeDedupeKey);
          result.recovered++;
        } else result.failed++;
        continue;
      }
      log.warn(`failed to read transcript for ${sessionKey}: ${String(err)}`);
      result.failed++;
      continue;
    }
    if (entry.pendingFinalDelivery === true && entry.pendingFinalDeliveryText) {
      if (
        await resumeMainSession({
          canonicalSessionKey: dispatchSessionKey,
          cfg: params.cfg,
          entry,
          storePath: params.storePath,
          sessionKey,
          pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
          forceRestartSafeTools: hasReplaySafeCodeModeCheckpointInCurrentTurn(messages),
          sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
        })
      ) {
        params.resumedSessionKeys.add(resumeDedupeKey);
        result.recovered++;
      } else result.failed++;
      continue;
    }
    const transcriptResumePolicy = resolveMainSessionResumePolicy(
      messages,
      entry.restartRecoveryForceSafeTools === true,
    );
    const resumePolicy = {
      ...transcriptResumePolicy,
      forceRestartSafeTools:
        entry.restartRecoveryForceSafeTools === true ||
        transcriptResumePolicy.forceRestartSafeTools,
    };
    if (resumePolicy.blockReason) {
      const deliveryContext = resolveRestartRecoveryDeliveryContext({
        cfg: params.cfg,
        entry,
        includeSessionDeliveryFallback: true,
        sessionKey,
      });
      if (
        !deliveryContext &&
        !(await writeUnresumableSessionNotice({
          entry,
          sessionKey,
          storePath: params.storePath,
        }))
      ) {
        result.failed++;
        continue;
      }
      if (
        await markSessionFailed({
          expectedRecoveryRunId: normalizeOptionalString(entry.restartRecoveryDeliveryRunId),
          expectedRecoverySourceRunId: normalizeOptionalString(
            entry.restartRecoveryDeliverySourceRunId,
          ),
          expectedSessionId: entry.sessionId,
          storePath: params.storePath,
          sessionKey,
          reason: resumePolicy.blockReason,
        })
      ) {
        if (deliveryContext)
          await sendUnresumableSessionNotice({
            deliveryContext,
            entry,
            reason: resumePolicy.blockReason,
            sessionKey,
          });
        result.failed++;
      } else result.skipped++;
      continue;
    }
    if (
      await resumeMainSession({
        canonicalSessionKey: dispatchSessionKey,
        cfg: params.cfg,
        entry,
        storePath: params.storePath,
        sessionKey,
        pendingFinalDeliveryText: entry.pendingFinalDeliveryText,
        forceRestartSafeTools: resumePolicy.forceRestartSafeTools,
        sessionWorkAdmissionHandoffId: params.sessionWorkAdmissionHandoffId,
      })
    ) {
      params.resumedSessionKeys.add(resumeDedupeKey);
      result.recovered++;
    } else result.failed++;
  }
  return result;
}
async function resolveRestartRecoveryStorePaths(params) {
  const storePaths = /* @__PURE__ */ new Set();
  const stateDir = params.stateDir ?? resolveStateDir(process.env);
  for (const sessionsDir of await resolveAgentSessionDirs(stateDir))
    storePaths.add(path.join(sessionsDir, "sessions.json"));
  if (params.cfg) {
    const env = {
      ...process.env,
      OPENCLAW_STATE_DIR: stateDir,
    };
    for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env }))
      storePaths.add(path.resolve(target.storePath));
  }
  return [...storePaths].toSorted((a, b) => a.localeCompare(b));
}
async function recoverRestartAbortedMainSessions(params = {}) {
  const result = {
    recovered: 0,
    failed: 0,
    skipped: 0,
  };
  const resumedSessionKeys = params.resumedSessionKeys ?? /* @__PURE__ */ new Set();
  for (const storePath of await resolveRestartRecoveryStorePaths(params)) {
    const storeResult = await recoverStore({
      cfg: params.cfg,
      storePath,
      resumedSessionKeys,
      activeSessionIds: params.activeSessionIds,
      activeSessionKeys: params.activeSessionKeys,
    });
    result.recovered += storeResult.recovered;
    result.failed += storeResult.failed;
    result.skipped += storeResult.skipped;
  }
  if (result.recovered > 0 || result.failed > 0)
    log.info(
      `main-session restart recovery complete: recovered=${result.recovered} failed=${result.failed} skipped=${result.skipped}`,
    );
  return result;
}
/** Retries one exact durable Control UI row from its owning per-agent SQLite store. */
async function retryRestartAbortedMainSessionRecovery(params) {
  const expectedClaim = {
    canonicalSessionKey: params.canonicalSessionKey,
    recoveryRunId: params.expectedRecoveryRunId,
    recoverySourceRunId: params.expectedRecoverySourceRunId,
    sessionId: params.expectedSessionId,
    sessionKey: params.sessionKey,
  };
  if (
    !loadExpectedRestartRecoveryClaim({
      expected: expectedClaim,
      storePath: params.storePath,
    })
  )
    return {
      recovered: 0,
      failed: 0,
      skipped: 0,
    };
  const assertClaimCurrent = () => {
    if (
      !loadExpectedRestartRecoveryClaim({
        expected: expectedClaim,
        storePath: params.storePath,
      })
    )
      throw new Error("restart recovery session ownership changed before dispatch");
  };
  const admission = await beginSessionWorkAdmission({
    scope: params.storePath,
    identities: [params.sessionKey, params.canonicalSessionKey, params.expectedSessionId],
    assertAllowed: assertClaimCurrent,
    revalidateAllowed: assertClaimCurrent,
  });
  const handoffId = admission.createHandoff();
  try {
    return await admission.run(
      async () =>
        await recoverStore({
          cfg: params.cfg,
          storePath: params.storePath,
          resumedSessionKeys: /* @__PURE__ */ new Set(),
          expectedClaim,
          sessionWorkAdmissionHandoffId: handoffId,
        }),
    );
  } finally {
    cancelSessionWorkAdmissionHandoff(handoffId);
  }
}
async function recoverStartupOrphanedMainSessions(params = {}) {
  const startupRecoveryCutoffMs = params.updatedBeforeMs ?? Date.now();
  const marked = await markStartupOrphanedMainSessionsForRecovery({
    cfg: params.cfg,
    stateDir: params.stateDir,
    activeSessionIds: params.activeSessionIds,
    activeSessionKeys: params.activeSessionKeys,
    updatedBeforeMs: startupRecoveryCutoffMs,
  });
  const recovered = await recoverRestartAbortedMainSessions({
    cfg: params.cfg,
    stateDir: params.stateDir,
    resumedSessionKeys: params.resumedSessionKeys,
    activeSessionIds: params.activeSessionIds,
    activeSessionKeys: params.activeSessionKeys,
  });
  return {
    marked: marked.marked,
    recovered: recovered.recovered,
    failed: recovered.failed,
    skipped: marked.skipped + recovered.skipped,
  };
}
function scheduleRestartAbortedMainSessionRecovery(params = {}) {
  const initialDelay = params.delayMs ?? DEFAULT_RECOVERY_DELAY_MS;
  const maxRetries = params.maxRetries ?? MAX_RECOVERY_RETRIES;
  const resumedSessionKeys = /* @__PURE__ */ new Set();
  const startupRecoveryCutoffMs = Date.now();
  const runRecoveryAttempt = (attempt, delay) => {
    runWithGatewayIndependentRootWorkAdmission(
      async () =>
        await recoverStartupOrphanedMainSessions({
          cfg: params.cfg,
          stateDir: params.stateDir,
          resumedSessionKeys,
          updatedBeforeMs: startupRecoveryCutoffMs,
        }),
    )
      .then((result) => {
        if (result.failed > 0 && attempt < maxRetries)
          scheduleAttempt(attempt + 1, delay * RETRY_BACKOFF_MULTIPLIER);
      })
      .catch((err) => {
        if (attempt < maxRetries) {
          log.warn(`main-session restart recovery failed: ${String(err)}`);
          scheduleAttempt(attempt + 1, delay * RETRY_BACKOFF_MULTIPLIER);
        } else log.warn(`main-session restart recovery gave up: ${String(err)}`);
      });
  };
  const scheduleAttempt = (attempt, delay) => {
    if (delay <= 0) {
      runRecoveryAttempt(attempt, delay);
      return;
    }
    setTimeout(() => {
      runRecoveryAttempt(attempt, delay);
    }, delay).unref?.();
  };
  scheduleAttempt(1, initialDelay);
}
//#endregion
export {
  recoverStartupOrphanedMainSessions as a,
  recoverRestartAbortedMainSessions as i,
  markRestartAbortedMainSessionsFromLocks as n,
  retryRestartAbortedMainSessionRecovery as o,
  markStartupOrphanedMainSessionsForRecovery as r,
  scheduleRestartAbortedMainSessionRecovery as s,
  markRestartAbortedMainSessions as t,
};
