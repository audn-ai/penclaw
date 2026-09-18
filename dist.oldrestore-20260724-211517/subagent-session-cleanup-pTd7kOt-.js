import { r as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-C_WnQaQy.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import {
  n as sanitizeTextContent,
  t as extractAssistantText,
} from "./chat-history-text-BrNFNoZX.js";
import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import "./config-BDv-QbJ6.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as wrapPromptDataBlock } from "./sanitize-for-prompt-Drdy09dw.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { s as readSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import "./runs-GL_-RIwi.js";
import "./sessions-CEG7v41b.js";
import { n as safeParseJson } from "./src-Bl7G9qvi.js";
import { f as readSessionEntry } from "./store-CzZJhTF6.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
import { t as compareSubagentRunGeneration } from "./subagent-run-generation-DZIUUsme.js";
import "./server-plugins-WbUfkNgn.js";
import {
  n as SILENT_REPLY_TOKEN,
  o as isSilentReplyText,
  t as HEARTBEAT_TOKEN,
} from "./tokens-DKI4eGAu.js";
//#region src/agents/tools/sessions-send-tokens.ts
/**
 * sessions_send sentinel tokens.
 *
 * Defines non-deliverable reply markers used by sessions_send and subagent completion delivery.
 */
/** Suppresses a subagent completion announcement. */
const ANNOUNCE_SKIP_TOKEN = "ANNOUNCE_SKIP";
/** Suppresses a direct reply delivery. */
const REPLY_SKIP_TOKEN = "REPLY_SKIP";
const NON_DELIVERABLE_REPLY_TOKENS = [
  ANNOUNCE_SKIP_TOKEN,
  REPLY_SKIP_TOKEN,
  SILENT_REPLY_TOKEN,
  HEARTBEAT_TOKEN,
];
/** Returns true when text is exactly the announce-skip sentinel. */
function isAnnounceSkip(text) {
  return (text ?? "").trim() === ANNOUNCE_SKIP_TOKEN;
}
/** Returns true when text is exactly the reply-skip sentinel. */
function isReplySkip(text) {
  return (text ?? "").trim() === REPLY_SKIP_TOKEN;
}
/** Returns true when text is any non-deliverable sessions reply sentinel. */
function isNonDeliverableSessionsReply(text) {
  return NON_DELIVERABLE_REPLY_TOKENS.some((token) => isSilentReplyText(text, token));
}
//#endregion
//#region src/agents/subagent-announce-capture.ts
/**
 * Helpers for capturing the latest subagent completion reply after a run ends.
 *
 * Completion output can lag behind lifecycle state, so callers can retry briefly
 * before sending an empty or stale announcement.
 */
/** Reads subagent output repeatedly until non-empty text appears or the bounded wait expires. */
async function readLatestSubagentOutputWithRetryUsing(params) {
  const maxWaitMs = Math.max(0, Math.min(params.maxWaitMs, 15e3));
  let waitedMs = 0;
  let result;
  while (waitedMs < maxWaitMs) {
    result = await params.readSubagentOutput(params.sessionKey, params.outcome);
    if (result?.trim()) return result;
    const remainingMs = maxWaitMs - waitedMs;
    if (remainingMs <= 0) break;
    const sleepMs = Math.min(params.retryIntervalMs, remainingMs);
    await new Promise((resolve) => {
      setTimeout(resolve, sleepMs);
    });
    waitedMs += sleepMs;
  }
  return result;
}
/** Captures immediate output first, then optionally waits for a delayed completion reply. */
async function captureSubagentCompletionReplyUsing(params) {
  const immediate = await params.readSubagentOutput(params.sessionKey);
  if (immediate?.trim()) return immediate;
  if (params.waitForReply === false) return;
  return await readLatestSubagentOutputWithRetryUsing({
    sessionKey: params.sessionKey,
    maxWaitMs: params.maxWaitMs,
    retryIntervalMs: params.retryIntervalMs,
    readSubagentOutput: params.readSubagentOutput,
  });
}
//#endregion
//#region src/agents/subagent-yield-output.ts
/**
 * sessions_yield transcript detectors.
 *
 * Accepts provider-specific tool-call and tool-result shapes used by transcript repair and announce capture.
 */
function readToolName(value) {
  const record = asOptionalRecord(value);
  if (!record) return;
  return readTrimmedStringAlias(record, [
    "name",
    "toolName",
    "tool_name",
    "functionName",
    "function_name",
  ]);
}
function isToolCallBlock(value) {
  const record = asOptionalRecord(value);
  if (!record) return false;
  return (
    record.type === "toolCall" ||
    record.type === "tool_use" ||
    record.type === "toolUse" ||
    record.type === "functionCall" ||
    record.type === "function_call"
  );
}
/** Returns true when an assistant message requested the sessions_yield tool. */
function assistantCallsSessionsYield(message) {
  const record = asOptionalRecord(message);
  if (!record || record.role !== "assistant" || !Array.isArray(record.content)) return false;
  return record.content.some(
    (block) => isToolCallBlock(block) && readToolName(block) === "sessions_yield",
  );
}
function parseJsonObject(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) return;
  return asOptionalRecord(safeParseJson(trimmed));
}
function readStructuredToolPayload(content) {
  const record = asOptionalRecord(content);
  if (record) return record;
  if (typeof content === "string") return parseJsonObject(content);
  if (!Array.isArray(content)) return;
  for (const block of content) {
    const blockRecord = asOptionalRecord(block);
    if (!blockRecord) continue;
    const text = blockRecord.text;
    if (typeof text !== "string") continue;
    const parsed = parseJsonObject(text);
    if (parsed) return parsed;
  }
}
/** Returns true when a tool result represents a completed sessions_yield handoff. */
function isSessionsYieldToolResult(message, previousAssistantCalledYield) {
  const record = asOptionalRecord(message);
  if (!record || (record.role !== "toolResult" && record.role !== "tool")) return false;
  if (readToolName(record) === "sessions_yield") return true;
  if (!previousAssistantCalledYield) return false;
  if (asOptionalRecord(record.details)?.status === "yielded") return true;
  return readStructuredToolPayload(record.content)?.status === "yielded";
}
//#endregion
//#region src/agents/subagent-announce-output.ts
/**
 * Subagent completion output capture.
 *
 * Reads child session output, detects waiting states, and formats completion findings for announcements.
 */
const FAST_TEST_RETRY_INTERVAL_MS = 8;
let subagentAnnounceOutputDeps = {
  callGateway,
  getRuntimeConfig,
  readSessionEntry,
  readSessionMessagesAsync,
  resolveAgentIdFromSessionKey,
  resolveStorePath,
};
function isFastTestMode() {
  return process.env.OPENCLAW_TEST_FAST === "1";
}
function withSubagentOutcomeTiming(outcome, timing) {
  const startedAt = asFiniteNumber(timing.startedAt) ?? asFiniteNumber(outcome.startedAt);
  const endedAt = asFiniteNumber(timing.endedAt) ?? asFiniteNumber(outcome.endedAt);
  const nextTiming = {};
  if (typeof startedAt === "number") nextTiming.startedAt = startedAt;
  if (typeof endedAt === "number") nextTiming.endedAt = endedAt;
  if (typeof startedAt === "number" && typeof endedAt === "number")
    nextTiming.elapsedMs = Math.max(0, endedAt - startedAt);
  return {
    ...outcome,
    ...nextTiming,
  };
}
function extractSubagentAssistantText(message) {
  if (!message || typeof message !== "object") return "";
  if (message.role !== "assistant") return "";
  const content = message.content;
  if (typeof content === "string") return sanitizeTextContent(content);
  return extractAssistantText(message) ?? "";
}
function countAssistantToolCalls(message) {
  if (!message || typeof message !== "object") return 0;
  const content = message.content;
  const contentToolCalls = Array.isArray(content)
    ? content.filter(
        (block) =>
          block &&
          typeof block === "object" &&
          (block.type === "toolCall" || block.type === "tool_use"),
      ).length
    : 0;
  const toolCalls = message.toolCalls ?? message.tool_calls;
  return contentToolCalls + (Array.isArray(toolCalls) ? toolCalls.length : 0);
}
function summarizeSubagentOutputHistory(messages) {
  const snapshot = {};
  let previousAssistantCalledYield = false;
  for (const message of messages) {
    if (!message || typeof message !== "object") continue;
    if (message.role === "assistant") {
      if (assistantCallsSessionsYield(message)) {
        snapshot.latestAssistantText = void 0;
        snapshot.latestSilentText = void 0;
        snapshot.waitingForContinuation = true;
        previousAssistantCalledYield = true;
        continue;
      }
      const text = extractSubagentAssistantText(message).trim();
      if (!text) {
        snapshot.latestToolCallCount =
          (snapshot.latestToolCallCount ?? 0) + countAssistantToolCalls(message);
        snapshot.waitingForContinuation = false;
        previousAssistantCalledYield = false;
        continue;
      }
      if (isAnnounceSkip(text) || isSilentReplyText(text, "NO_REPLY")) {
        snapshot.latestSilentText = text;
        snapshot.latestAssistantText = void 0;
        snapshot.waitingForContinuation = false;
        previousAssistantCalledYield = false;
        continue;
      }
      snapshot.latestSilentText = void 0;
      snapshot.latestAssistantText = text;
      snapshot.waitingForContinuation = false;
      previousAssistantCalledYield = false;
      continue;
    }
    if (isSessionsYieldToolResult(message, previousAssistantCalledYield)) {
      snapshot.latestAssistantText = void 0;
      snapshot.latestSilentText = void 0;
      snapshot.waitingForContinuation = true;
      previousAssistantCalledYield = false;
      continue;
    }
    previousAssistantCalledYield = false;
  }
  return snapshot;
}
function selectSubagentOutputText(snapshot) {
  if (snapshot.waitingForContinuation) return;
  if (snapshot.latestSilentText) return snapshot.latestSilentText;
  if (snapshot.latestAssistantText) return snapshot.latestAssistantText;
  if (snapshot.latestToolCallCount && snapshot.latestToolCallCount > 0)
    return `${snapshot.latestToolCallCount} tool call(s) made without visible output.`;
}
async function readSubagentOutput(sessionKey, _outcome, options) {
  let messages;
  if (options?.sessionFile)
    messages = await subagentAnnounceOutputDeps.readSessionMessagesAsync(
      {
        sessionFile: options.sessionFile,
        sessionId: sessionKey,
      },
      {
        mode: "recent",
        maxMessages: 100,
        maxBytes: 1024 * 1024,
      },
    );
  const history =
    messages === void 0
      ? await subagentAnnounceOutputDeps.callGateway({
          method: "chat.history",
          params: {
            sessionKey,
            limit: 100,
          },
        })
      : void 0;
  const selected = selectSubagentOutputText(
    summarizeSubagentOutputHistory(
      messages ?? (Array.isArray(history?.messages) ? history.messages : []),
    ),
  );
  if (selected?.trim()) return selected;
}
async function readLatestSubagentOutputWithRetry(params) {
  return await readLatestSubagentOutputWithRetryUsing({
    sessionKey: params.sessionKey,
    maxWaitMs: params.maxWaitMs,
    outcome: params.outcome,
    retryIntervalMs: isFastTestMode() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
    readSubagentOutput,
  });
}
async function waitForSubagentRunOutcome(runId, timeoutMs) {
  const waitMs = Math.max(0, Math.floor(timeoutMs));
  return await subagentAnnounceOutputDeps.callGateway({
    method: "agent.wait",
    params: {
      runId,
      timeoutMs: waitMs,
    },
    timeoutMs: waitMs + 2e3,
  });
}
function applySubagentWaitOutcome(params) {
  const next = {
    outcome: params.outcome,
    startedAt: params.startedAt,
    endedAt: params.endedAt,
  };
  if (typeof params.wait?.startedAt === "number" && typeof next.startedAt !== "number")
    next.startedAt = params.wait.startedAt;
  if (typeof params.wait?.endedAt === "number" && typeof next.endedAt !== "number")
    next.endedAt = params.wait.endedAt;
  const waitError = typeof params.wait?.error === "string" ? params.wait.error : void 0;
  const terminalOutcome = buildAgentRunTerminalOutcomeFromWaitResult(params.wait);
  let outcome = next.outcome;
  if (terminalOutcome?.status === "timeout") outcome = { status: "timeout" };
  else if (terminalOutcome?.reason === "aborted" || terminalOutcome?.reason === "cancelled")
    outcome = {
      status: "error",
      error: "subagent run terminated",
    };
  else if (
    terminalOutcome?.reason === "blocked" ||
    terminalOutcome?.reason === "abandoned" ||
    terminalOutcome?.reason === "failed"
  )
    outcome = {
      status: "error",
      error: terminalOutcome.error ?? waitError,
    };
  else if (terminalOutcome?.reason === "completed") outcome = { status: "ok" };
  next.outcome = outcome ? withSubagentOutcomeTiming(outcome, next) : void 0;
  return next;
}
async function captureSubagentCompletionReply(sessionKey, options) {
  return await captureSubagentCompletionReplyUsing({
    sessionKey,
    waitForReply: options?.waitForReply,
    maxWaitMs: isFastTestMode() ? 50 : 1500,
    retryIntervalMs: isFastTestMode() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
    readSubagentOutput: async (nextSessionKey) =>
      await readSubagentOutput(nextSessionKey, options?.outcome, {
        sessionFile: options?.sessionFile,
      }),
  });
}
function describeSubagentOutcome(outcome) {
  if (!outcome) return "unknown";
  if (outcome.status === "ok") return "ok";
  if (outcome.status === "timeout") return "timeout";
  if (outcome.status === "error")
    return outcome.error?.trim() ? `error: ${outcome.error.trim()}` : "error";
  return "unknown";
}
function formatChildResultData(resultText) {
  return (
    wrapPromptDataBlock({
      label: "Child result",
      text: resultText?.trim() || "(no output)",
    }) || "Child result: (no output)"
  );
}
function selectChildCompletionResultText(child) {
  return (
    child.completion?.resultText ??
    child.delivery?.payload?.frozenResultText ??
    child.completion?.fallbackResultText ??
    child.delivery?.payload?.fallbackFrozenResultText ??
    child.frozenResultText ??
    void 0
  )?.trim();
}
function buildChildCompletionFindings(children) {
  const sorted = [...children].toSorted((a, b) => {
    if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
    return (
      (typeof a.endedAt === "number" ? a.endedAt : Number.MAX_SAFE_INTEGER) -
      (typeof b.endedAt === "number" ? b.endedAt : Number.MAX_SAFE_INTEGER)
    );
  });
  const sections = [];
  for (const [index, child] of sorted.entries()) {
    const resultText = selectChildCompletionResultText(child);
    const outcome = describeSubagentOutcome(child.outcome);
    if (
      child.outcome?.status === "ok" &&
      resultText &&
      (isAnnounceSkip(resultText) || isSilentReplyText(resultText, "NO_REPLY"))
    )
      continue;
    const title =
      child.label?.trim() ||
      child.task.trim() ||
      child.childSessionKey.trim() ||
      `child ${index + 1}`;
    const displayIndex = sections.length + 1;
    sections.push(
      [`${displayIndex}. ${title}`, `status: ${outcome}`, formatChildResultData(resultText)].join(
        "\n",
      ),
    );
  }
  if (sections.length === 0) return;
  return ["Child completion results:", "", ...sections].join("\n\n");
}
function dedupeLatestChildCompletionRows(children) {
  const latestByChildSessionKey = /* @__PURE__ */ new Map();
  for (const child of children) {
    const existing = latestByChildSessionKey.get(child.childSessionKey);
    if (!existing || compareSubagentRunGeneration(child, existing) > 0)
      latestByChildSessionKey.set(child.childSessionKey, child);
  }
  return [...latestByChildSessionKey.values()];
}
function filterCurrentDirectChildCompletionRows(children, params) {
  if (typeof params.getLatestSubagentRunByChildSessionKey !== "function") return children;
  return children.filter((child) => {
    const latest = params.getLatestSubagentRunByChildSessionKey?.(child.childSessionKey);
    if (!latest) return true;
    return (
      latest.runId === child.runId && latest.requesterSessionKey === params.requesterSessionKey
    );
  });
}
function formatTokenCount(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}m`;
  if (value >= 1e3) {
    const formattedThousands = (value / 1e3).toFixed(1);
    if (Number(formattedThousands) >= 1e3) return `${(value / 1e6).toFixed(1)}m`;
    return `${formattedThousands}k`;
  }
  return String(Math.round(value));
}
async function buildCompactAnnounceStatsLine(params) {
  const cfg = subagentAnnounceOutputDeps.getRuntimeConfig();
  const agentId = subagentAnnounceOutputDeps.resolveAgentIdFromSessionKey(params.sessionKey);
  const storePath = subagentAnnounceOutputDeps.resolveStorePath(cfg.session?.store, { agentId });
  let entry = subagentAnnounceOutputDeps.readSessionEntry(storePath, params.sessionKey);
  const tokenWaitAttempts = isFastTestMode() ? 1 : 3;
  for (let attempt = 0; attempt < tokenWaitAttempts; attempt += 1) {
    if (
      typeof entry?.inputTokens === "number" ||
      typeof entry?.outputTokens === "number" ||
      typeof entry?.totalTokens === "number"
    )
      break;
    if (!isFastTestMode())
      await new Promise((resolve) => {
        setTimeout(resolve, 150);
      });
    entry = subagentAnnounceOutputDeps.readSessionEntry(storePath, params.sessionKey);
  }
  const input = typeof entry?.inputTokens === "number" ? entry.inputTokens : 0;
  const output = typeof entry?.outputTokens === "number" ? entry.outputTokens : 0;
  const ioTotal = input + output;
  const promptCache = typeof entry?.totalTokens === "number" ? entry.totalTokens : void 0;
  const parts = [
    `runtime ${formatDurationCompact(typeof params.startedAt === "number" && typeof params.endedAt === "number" ? Math.max(0, params.endedAt - params.startedAt) : void 0) ?? "n/a"}`,
    `tokens ${formatTokenCount(ioTotal)} (in ${formatTokenCount(input)} / out ${formatTokenCount(output)})`,
  ];
  if (typeof promptCache === "number" && promptCache > ioTotal)
    parts.push(`prompt/cache ${formatTokenCount(promptCache)}`);
  return `Stats: ${parts.join(" • ")}`;
}
//#endregion
//#region src/agents/subagent-session-cleanup.ts
/** Deletes a child subagent session and optionally emits session-mode lifecycle hooks. */
async function deleteSubagentSessionForCleanup(params) {
  try {
    await params.callGateway({
      method: "sessions.delete",
      params: {
        key: params.childSessionKey,
        deleteTranscript: true,
        emitLifecycleHooks: params.spawnMode === "session",
      },
      timeoutMs: 1e4,
    });
  } catch (error) {
    params.onError?.(error);
  }
}
//#endregion
export {
  captureSubagentCompletionReply as a,
  readLatestSubagentOutputWithRetry as c,
  withSubagentOutcomeTiming as d,
  ANNOUNCE_SKIP_TOKEN as f,
  isReplySkip as g,
  isNonDeliverableSessionsReply as h,
  buildCompactAnnounceStatsLine as i,
  readSubagentOutput as l,
  isAnnounceSkip as m,
  applySubagentWaitOutcome as n,
  dedupeLatestChildCompletionRows as o,
  REPLY_SKIP_TOKEN as p,
  buildChildCompletionFindings as r,
  filterCurrentDirectChildCompletionRows as s,
  deleteSubagentSessionForCleanup as t,
  waitForSubagentRunOutcome as u,
};
