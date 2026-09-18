import {
  d as normalizeBlockedLivenessWaitStatus,
  o as normalizeAgentRunTimeoutPhase,
  r as buildAgentRunTerminalOutcomeFromWaitResult,
} from "./agent-run-terminal-outcome-C_WnQaQy.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { r as stripToolMessages, t as extractAssistantText } from "./chat-history-text-BrNFNoZX.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  S as resolveDateTimestampMs,
  a as addTimerTimeoutGraceMs,
  f as clampTimerTimeoutMs,
  g as parseFiniteNumber,
  l as asPositiveSafeInteger,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { t as hasRetryableConnectionErrorCode } from "./retryable-network-errors-B0nC5Yz8.js";
import {
  a as isOpenClawInternalSourceReplyMirrorAssistantMessage,
  o as isOpenClawMessageToolMirrorAssistantMessage,
  s as isTranscriptOnlyOpenClawAssistantMessage,
} from "./transcript-only-openclaw-assistant-BDZ_IroQ.js";
let runWaitDeps = { callGateway };
function resolveRunWaitTimeoutMs(value) {
  return clampTimerTimeoutMs(parseFiniteNumber(value) ?? 1) ?? 1;
}
function resolveRunWaitDeadlineAtMs(params) {
  if (params.deadlineAtMs !== void 0)
    return asDateTimestampMs(params.deadlineAtMs) ?? resolveDateTimestampMs(Date.now());
  return (
    resolveExpiresAtMsFromDurationMs(resolveRunWaitTimeoutMs(params.timeoutMs)) ??
    resolveDateTimestampMs(Date.now())
  );
}
function normalizeAgentWaitResult(status, wait) {
  const stopReason = typeof wait?.stopReason === "string" ? wait.stopReason : void 0;
  const normalized = normalizeTerminalOutcomeForWait(
    buildAgentRunTerminalOutcomeFromWaitResult({
      ...wait,
      status,
    }),
    status,
    wait?.livenessState,
  );
  return {
    status: normalized.status,
    error: normalized.error,
    startedAt: typeof wait?.startedAt === "number" ? wait.startedAt : void 0,
    endedAt: typeof wait?.endedAt === "number" ? wait.endedAt : void 0,
    stopReason,
    livenessState: typeof wait?.livenessState === "string" ? wait.livenessState : void 0,
    yielded: wait?.yielded === true ? true : void 0,
    pendingError: wait?.pendingError === true ? true : void 0,
    timeoutPhase: normalizeAgentRunTimeoutPhase(wait?.timeoutPhase),
    providerStarted: asBoolean(wait?.providerStarted),
  };
}
function normalizeTerminalOutcomeForWait(outcome, fallbackStatus, livenessState) {
  if (outcome?.reason === "hard_timeout")
    return {
      status: outcome.status,
      error: outcome.error,
    };
  return normalizeBlockedLivenessWaitStatus({
    status: outcome?.status ?? fallbackStatus,
    livenessState,
    error: outcome?.error,
  });
}
const RECOVERABLE_AGENT_WAIT_ERROR_PATTERNS = [
  /gateway closed \(1006/i,
  /transport close/i,
  /connection loss/i,
  /connection closed/i,
  /gateway not connected/i,
  /no active .* listener/i,
  /socket hang up/i,
];
/** Return true for transient gateway/transport failures that callers may retry. */
function isRecoverableAgentWaitError(error) {
  const message = error?.trim();
  if (!message) return false;
  if (message.includes("gateway timeout")) return false;
  return (
    hasRetryableConnectionErrorCode(message) ||
    RECOVERABLE_AGENT_WAIT_ERROR_PATTERNS.some((pattern) => pattern.test(message))
  );
}
function normalizePendingRunIds(runIds) {
  const seen = /* @__PURE__ */ new Set();
  for (const runId of runIds) {
    const normalized = runId.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
  }
  return [...seen];
}
function isWaitedReplyTranscriptArtifact(message) {
  return (
    isTranscriptOnlyOpenClawAssistantMessage(message) ||
    isOpenClawMessageToolMirrorAssistantMessage(message) ||
    isInterSessionInputMessage(message)
  );
}
function isInterSessionInputMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return false;
  const provenance = message.provenance;
  return (
    Boolean(provenance) &&
    typeof provenance === "object" &&
    !Array.isArray(provenance) &&
    provenance.kind === "inter_session"
  );
}
function isWaitedReplyTurnBoundary(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return false;
  return message.role === "user" || isInterSessionInputMessage(message);
}
function snapshotAssistantReply(message) {
  const text = extractAssistantText(message);
  if (!text?.trim()) return;
  let fingerprint;
  try {
    fingerprint = JSON.stringify(message);
  } catch {
    fingerprint = text;
  }
  return {
    text,
    fingerprint,
  };
}
function readTranscriptMessageSeq(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return;
  const meta = message["__openclaw"];
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
  return asPositiveSafeInteger(meta.seq);
}
function readInternalSourceReplyMessageSeq(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return;
  const marker = message.openclawMessageToolMirror;
  if (!marker || typeof marker !== "object" || Array.isArray(marker)) return;
  return asPositiveSafeInteger(marker.sourceMessageSeq);
}
function resolveLatestAssistantReplySnapshot(messages, opts) {
  let latestReply = {};
  const internalSourceReplies = [];
  let sawTranscriptArtifact = false;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const candidate = messages[i];
    if (!candidate || typeof candidate !== "object") continue;
    if (opts?.stopAtTranscriptArtifact === true && isWaitedReplyTurnBoundary(candidate)) {
      const boundarySeq = readTranscriptMessageSeq(candidate);
      const currentInternalSourceReply = boundarySeq
        ? internalSourceReplies.find(
            (reply) => reply.sourceMessageSeq !== void 0 && reply.sourceMessageSeq > boundarySeq,
          )
        : void 0;
      if (currentInternalSourceReply) return currentInternalSourceReply.snapshot;
      if (!boundarySeq && internalSourceReplies.length > 0) sawTranscriptArtifact = true;
      internalSourceReplies.length = 0;
      break;
    }
    if (candidate.role !== "assistant") continue;
    if (
      opts?.stopAtTranscriptArtifact === true &&
      isOpenClawInternalSourceReplyMirrorAssistantMessage(candidate)
    ) {
      const snapshot = snapshotAssistantReply(candidate);
      const sourceMessageSeq = readInternalSourceReplyMessageSeq(candidate);
      if (snapshot)
        internalSourceReplies.push({
          snapshot,
          sourceMessageSeq,
        });
      if (!sourceMessageSeq) sawTranscriptArtifact = true;
      continue;
    }
    if (isWaitedReplyTranscriptArtifact(candidate)) {
      if (opts?.stopAtTranscriptArtifact === true) sawTranscriptArtifact = true;
      continue;
    }
    const snapshot = snapshotAssistantReply(candidate);
    if (!snapshot) continue;
    if (opts?.stopAtTranscriptArtifact !== true) return snapshot;
    if (!latestReply.text) latestReply = snapshot;
  }
  if (opts?.stopAtTranscriptArtifact === true) {
    if (internalSourceReplies.length > 0) sawTranscriptArtifact = true;
    if (sawTranscriptArtifact) return {};
  }
  return latestReply;
}
function hasUpdatedAssistantReplySnapshot(latestReply, baseline) {
  if (!latestReply.text) return false;
  if (!baseline) return true;
  if (baseline.fingerprint !== void 0) return latestReply.fingerprint !== baseline.fingerprint;
  if (baseline.text !== void 0) return latestReply.text !== baseline.text;
  return true;
}
/** Read the latest non-tool assistant message for a session. */
async function readLatestAssistantReplySnapshot(params) {
  const history = await (params.callGateway ?? runWaitDeps.callGateway)({
    method: "chat.history",
    params: {
      sessionKey: params.sessionKey,
      limit: params.limit ?? 50,
    },
  });
  return resolveLatestAssistantReplySnapshot(
    stripToolMessages(Array.isArray(history?.messages) ? history.messages : []),
    { stopAtTranscriptArtifact: params.stopAtTranscriptArtifact },
  );
}
/** Read only the latest assistant text for call sites that do not need fingerprints. */
async function readLatestAssistantReply(params) {
  return (
    await readLatestAssistantReplySnapshot({
      sessionKey: params.sessionKey,
      limit: params.limit,
      callGateway: params.callGateway,
    })
  ).text;
}
/** Wait for one agent run through the gateway and normalize timeout/error states. */
async function waitForAgentRun(params) {
  const timeoutMs = resolveRunWaitTimeoutMs(params.timeoutMs);
  try {
    const wait = await (params.callGateway ?? runWaitDeps.callGateway)({
      method: "agent.wait",
      params: {
        runId: params.runId,
        timeoutMs,
      },
      timeoutMs: addTimerTimeoutGraceMs(timeoutMs, 2e3),
    });
    if (wait?.status === "timeout") return normalizeAgentWaitResult("timeout", wait);
    if (wait?.status === "pending") return normalizeAgentWaitResult("pending", wait);
    if (wait?.status === "error") return normalizeAgentWaitResult("error", wait);
    return normalizeAgentWaitResult("ok", wait);
  } catch (err) {
    const error = formatErrorMessage(err);
    return {
      status: error.includes("gateway timeout") ? "timeout" : "error",
      error,
    };
  }
}
/** Wait for a run and return a reply only when it differs from the supplied baseline. */
async function waitForAgentRunAndReadUpdatedAssistantReply(params) {
  const wait = await waitForAgentRun({
    runId: params.runId,
    timeoutMs: params.timeoutMs,
    callGateway: params.callGateway,
  });
  if (wait.status !== "ok") return wait;
  const latestReply = await readLatestAssistantReplySnapshot({
    sessionKey: params.sessionKey,
    limit: params.limit,
    stopAtTranscriptArtifact: true,
    callGateway: params.callGateway,
  });
  const replyText = hasUpdatedAssistantReplySnapshot(latestReply, params.baseline)
    ? latestReply.text
    : void 0;
  return {
    ...wait,
    replyText,
  };
}
/** Wait until the current and newly spawned pending run IDs are drained or timed out. */
async function waitForAgentRunsToDrain(params) {
  const deadlineAtMs = resolveRunWaitDeadlineAtMs(params);
  let pendingRunIds = new Set(
    normalizePendingRunIds(params.initialPendingRunIds ?? params.getPendingRunIds()),
  );
  while (pendingRunIds.size > 0 && Date.now() < deadlineAtMs) {
    const remainingMs = Math.max(1, deadlineAtMs - Date.now());
    await Promise.allSettled(
      [...pendingRunIds].map((runId) =>
        waitForAgentRun({
          runId,
          timeoutMs: remainingMs,
          callGateway: params.callGateway,
        }),
      ),
    );
    pendingRunIds = new Set(normalizePendingRunIds(params.getPendingRunIds()));
  }
  return {
    timedOut: pendingRunIds.size > 0,
    pendingRunIds: [...pendingRunIds],
    deadlineAtMs,
  };
}
//#endregion
export {
  waitForAgentRun as a,
  readLatestAssistantReplySnapshot as i,
  isRecoverableAgentWaitError as n,
  waitForAgentRunAndReadUpdatedAssistantReply as o,
  readLatestAssistantReply as r,
  waitForAgentRunsToDrain as s,
  hasUpdatedAssistantReplySnapshot as t,
};
