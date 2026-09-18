import { O as estimateTokens } from "./agent-core-DJCbl_Iw.js";
import { p as stripRuntimeContextCustomMessages } from "./internal-runtime-context-BW7WOTKc.js";
import {
  a as stripToolResultDetails,
  n as repairToolUseResultPairing,
} from "./session-transcript-repair-BI2d8Y2b.js";
import "./sessions-Duh5damM.js";
import {
  n as extractToolResultId,
  t as extractToolCallsFromAssistant,
} from "./tool-call-id-Bl60ujZe.js";
//#region src/agents/compaction-planning.ts
/**
 * Planning helpers for transcript compaction. The module estimates sanitized
 * token usage, chooses chunking strategy, and preserves active tool-use pairs
 * while splitting history for summaries.
 */
/** Default share of context window targeted for compaction chunks. */
const BASE_CHUNK_RATIO = 0.4;
/** Lower bound for adaptive compaction chunk sizing. */
const MIN_CHUNK_RATIO = 0.15;
/** Buffer for estimateTokens() inaccuracy. */
const SAFETY_MARGIN = 1.2;
const DEFAULT_PARTS = 2;
/**
 * Overhead reserved for summary prompt, system prompt, prior summary, wrapper
 * tags, and high-reasoning summary generation.
 */
const SUMMARIZATION_OVERHEAD_TOKENS = 4096;
/** Estimates compaction tokens after removing fields that must not reach summarization. */
function estimateMessagesTokens(messages) {
  return sanitizeCompactionMessages(messages).reduce(
    (sum, message) => sum + estimateTokens(message),
    0,
  );
}
/**
 * Per-original-message token estimates, aligned 1:1 to the input array. Sanitizes
 * the full array once instead of wrapping and re-cloning each message in its own
 * 1-element array. Runtime-context entries are not model-visible, so they estimate
 * to 0 here just as sanitizeCompactionMessages([msg]) would drop them.
 */
function estimatePerMessageTokens(messages) {
  const detailStripped = stripToolResultDetails(messages);
  const modelVisible = new Set(stripRuntimeContextCustomMessages(detailStripped));
  return detailStripped.map((message) => (modelVisible.has(message) ? estimateTokens(message) : 0));
}
/** Removes runtime-only context and tool-result details before token estimates or summaries. */
function sanitizeCompactionMessages(messages) {
  return stripToolResultDetails(stripRuntimeContextCustomMessages(messages));
}
/** Clamps requested split parts to a usable count for the available messages. */
function normalizeCompactionParts(parts, messageCount) {
  if (!Number.isFinite(parts) || parts <= 1) return 1;
  return Math.min(Math.max(1, Math.floor(parts)), Math.max(1, messageCount));
}
/** Splits messages into roughly equal token-share chunks without separating active tool pairs. */
function splitMessagesByTokenShare(messages, parts = DEFAULT_PARTS) {
  if (messages.length === 0) return [];
  const normalizedParts = normalizeCompactionParts(parts, messages.length);
  if (normalizedParts <= 1) return [messages];
  const perMessageTokens = estimatePerMessageTokens(messages);
  const targetTokens = perMessageTokens.reduce((sum, tokens) => sum + tokens, 0) / normalizedParts;
  const chunks = [];
  let current = [];
  let currentTokens = 0;
  let pendingToolCallIds = /* @__PURE__ */ new Set();
  let pendingChunkStartIndex = null;
  let currentTokenCounts = [];
  const splitCurrentAtPendingBoundary = () => {
    if (
      pendingChunkStartIndex === null ||
      pendingChunkStartIndex <= 0 ||
      chunks.length >= normalizedParts - 1
    )
      return false;
    chunks.push(current.slice(0, pendingChunkStartIndex));
    current = current.slice(pendingChunkStartIndex);
    currentTokenCounts = currentTokenCounts.slice(pendingChunkStartIndex);
    currentTokens = currentTokenCounts.reduce((sum, tokens) => sum + tokens, 0);
    pendingChunkStartIndex = 0;
    return true;
  };
  for (const [index, message] of messages.entries()) {
    const messageTokens = perMessageTokens.at(index);
    if (messageTokens === void 0)
      throw new Error("Compaction token estimates are out of sync with messages");
    if (
      pendingToolCallIds.size === 0 &&
      chunks.length < normalizedParts - 1 &&
      current.length > 0 &&
      currentTokens + messageTokens > targetTokens
    ) {
      chunks.push(current);
      current = [];
      currentTokenCounts = [];
      currentTokens = 0;
      pendingChunkStartIndex = null;
    }
    current.push(message);
    currentTokenCounts.push(messageTokens);
    currentTokens += messageTokens;
    if (message.role === "assistant") {
      const toolCalls = extractToolCallsFromAssistant(message);
      const stopReason = message.stopReason;
      const keepsPending =
        stopReason !== "aborted" && stopReason !== "error" && toolCalls.length > 0;
      pendingToolCallIds = /* @__PURE__ */ new Set();
      if (keepsPending) for (const toolCall of toolCalls) pendingToolCallIds.add(toolCall.id);
      pendingChunkStartIndex = keepsPending ? current.length - 1 : null;
    } else if (message.role === "toolResult" && pendingToolCallIds.size > 0) {
      const resultId = extractToolResultId(message);
      if (!resultId) {
        pendingToolCallIds = /* @__PURE__ */ new Set();
        pendingChunkStartIndex = null;
      } else pendingToolCallIds.delete(resultId);
      if (
        pendingToolCallIds.size === 0 &&
        chunks.length < normalizedParts - 1 &&
        currentTokens > targetTokens
      ) {
        splitCurrentAtPendingBoundary();
        pendingChunkStartIndex = null;
      }
    }
  }
  if (pendingToolCallIds.size > 0 && currentTokens > targetTokens) splitCurrentAtPendingBoundary();
  if (current.length > 0) chunks.push(current);
  return chunks;
}
/** Chunks messages by a max-token budget while applying the shared estimator safety margin. */
function chunkMessagesByMaxTokens(messages, maxTokens) {
  if (messages.length === 0) return [];
  const effectiveMax = Math.max(1, Math.floor(maxTokens / SAFETY_MARGIN));
  const perMessageTokens = estimatePerMessageTokens(messages);
  const chunks = [];
  let currentChunk = [];
  let currentTokens = 0;
  for (const [index, message] of messages.entries()) {
    const messageTokens = perMessageTokens.at(index);
    if (messageTokens === void 0)
      throw new Error("Compaction token estimates are out of sync with messages");
    if (currentChunk.length > 0 && currentTokens + messageTokens > effectiveMax) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentTokens = 0;
    }
    currentChunk.push(message);
    currentTokens += messageTokens;
    if (messageTokens > effectiveMax) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentTokens = 0;
    }
  }
  if (currentChunk.length > 0) chunks.push(currentChunk);
  return chunks;
}
/**
 * Compute adaptive chunk ratio based on average message size.
 * When messages are large, we use smaller chunks to avoid exceeding model limits.
 */
function computeAdaptiveChunkRatio(messages, contextWindow) {
  if (messages.length === 0) return BASE_CHUNK_RATIO;
  const avgRatio =
    ((estimateMessagesTokens(messages) / messages.length) * SAFETY_MARGIN) / contextWindow;
  if (avgRatio > 0.1) {
    const reduction = Math.min(avgRatio * 2, BASE_CHUNK_RATIO - MIN_CHUNK_RATIO);
    return Math.max(MIN_CHUNK_RATIO, BASE_CHUNK_RATIO - reduction);
  }
  return BASE_CHUNK_RATIO;
}
/** Builds sanitized chunks for summarization prompts. */
function buildSummaryChunks(params) {
  return chunkMessagesByMaxTokens(
    sanitizeCompactionMessages(params.messages),
    params.maxChunkTokens,
  );
}
/** Separates messages too large to summarize and emits compact placeholder notes for them. */
function buildOversizedFallbackPlan(params) {
  const smallMessages = [];
  const oversizedNotes = [];
  const perMessageTokens = estimatePerMessageTokens(params.messages);
  const oversizedThreshold = params.contextWindow * 0.5;
  for (const [index, msg] of params.messages.entries()) {
    const tokens = perMessageTokens.at(index);
    if (tokens === void 0)
      throw new Error("Compaction token estimates are out of sync with messages");
    if (tokens * 1.2 > oversizedThreshold) {
      const role = msg.role ?? "message";
      oversizedNotes.push(
        `[Large ${role} (~${Math.round(tokens / 1e3)}K tokens) omitted from summary]`,
      );
    } else smallMessages.push(msg);
  }
  return {
    smallMessages,
    oversizedNotes,
  };
}
/** Plans whether to split a summarization stage based on message count and token budget. */
function buildStageSplitPlan(params) {
  const minMessagesForSplit = Math.max(2, params.minMessagesForSplit ?? 4);
  const parts = normalizeCompactionParts(params.parts ?? DEFAULT_PARTS, params.messages.length);
  const totalTokens = estimateMessagesTokens(params.messages);
  if (
    parts <= 1 ||
    params.messages.length < minMessagesForSplit ||
    totalTokens <= params.maxChunkTokens
  )
    return { mode: "single" };
  const chunks = splitMessagesByTokenShare(params.messages, parts).filter(
    (chunk) => chunk.length > 0,
  );
  return chunks.length > 1
    ? {
        mode: "split",
        chunks,
      }
    : { mode: "single" };
}
/** Drops oldest token-share chunks until history fits the requested context share. */
function pruneHistoryForContextShare(params) {
  const defaultShare = params.mode === "handoff" ? 0.2 : 0.5;
  const maxHistoryShare = params.maxHistoryShare ?? defaultShare;
  const budgetTokens = Math.max(1, Math.floor(params.maxContextTokens * maxHistoryShare));
  let keptMessages = params.messages;
  const allDroppedMessages = [];
  let droppedChunks = 0;
  let droppedMessages = 0;
  let droppedTokens = 0;
  const parts = normalizeCompactionParts(params.parts ?? DEFAULT_PARTS, keptMessages.length);
  while (keptMessages.length > 0 && estimateMessagesTokens(keptMessages) > budgetTokens) {
    const chunks = splitMessagesByTokenShare(keptMessages, parts);
    if (chunks.length <= 1) break;
    const [dropped, ...rest] = chunks;
    if (!dropped) break;
    const repairReport = repairToolUseResultPairing(rest.flat());
    const repairedKept = repairReport.messages;
    const orphanedCount = repairReport.droppedOrphanCount;
    droppedChunks += 1;
    droppedMessages += dropped.length + orphanedCount;
    droppedTokens += estimateMessagesTokens(dropped);
    allDroppedMessages.push(...dropped);
    keptMessages = repairedKept;
  }
  return {
    messages: keptMessages,
    droppedMessagesList: allDroppedMessages,
    droppedChunks,
    droppedMessages,
    droppedTokens,
    keptTokens: estimateMessagesTokens(keptMessages),
    budgetTokens,
  };
}
/** Computes whether new content exceeds the history budget and plans pruning when needed. */
function buildHistoryPrunePlan(params) {
  const summarizableTokens =
    estimateMessagesTokens(params.messagesToSummarize) +
    estimateMessagesTokens(params.turnPrefixMessages);
  const newContentTokens = Math.max(0, Math.floor(params.tokensBefore - summarizableTokens));
  const maxHistoryTokens = Math.floor(
    params.contextWindowTokens * params.maxHistoryShare * SAFETY_MARGIN,
  );
  if (newContentTokens <= maxHistoryTokens)
    return {
      summarizableTokens,
      newContentTokens,
      maxHistoryTokens,
    };
  return {
    summarizableTokens,
    newContentTokens,
    maxHistoryTokens,
    pruned: pruneHistoryForContextShare({
      messages: params.messagesToSummarize,
      maxContextTokens: params.contextWindowTokens,
      maxHistoryShare: params.maxHistoryShare,
      parts: params.parts,
    }),
  };
}
//#endregion
export {
  buildStageSplitPlan as a,
  estimateMessagesTokens as c,
  buildOversizedFallbackPlan as i,
  sanitizeCompactionMessages as l,
  SUMMARIZATION_OVERHEAD_TOKENS as n,
  buildSummaryChunks as o,
  buildHistoryPrunePlan as r,
  computeAdaptiveChunkRatio as s,
  SAFETY_MARGIN as t,
};
