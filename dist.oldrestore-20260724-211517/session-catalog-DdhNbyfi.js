import "./input-provenance-Xst3EirW.js";
import {
  d as parseCliReseedPrompt,
  n as parseClaudeCliHistoryEntry,
  o as resolveClaudeCliPromptTextCandidates,
  s as resolveClaudeCliTimestampMs,
} from "./cli-session-history.claude-DNOnkIfT.js";
//#region src/gateway/cli-session-history.claude-activity.ts
function classifyClaudeCliHistoryEntry(params) {
  const entry = params.entry;
  const content = entry.message?.content;
  if (entry.type !== "user" || entry.message?.role !== "user") return { humanTurn: false };
  if (typeof content !== "string" && !Array.isArray(content)) return { humanTurn: false };
  const candidates = resolveClaudeCliPromptTextCandidates(entry, content);
  if (
    candidates.length === 0 ||
    candidates.some(
      ({ text }) =>
        text.startsWith("[Inter-session message]") || parseCliReseedPrompt(text).kind !== "none",
    )
  )
    return { humanTurn: false };
  if (
    parseClaudeCliHistoryEntry(
      entry,
      params.cliSessionId,
      params.sourceLineNumber,
      /* @__PURE__ */ new Map(),
      { reseedMode: "preserve" },
    )?.role !== "user"
  )
    return { humanTurn: false };
  const occurredAt = resolveClaudeCliTimestampMs(entry.timestamp);
  return {
    humanTurn: true,
    userText: candidates[0]?.text,
    ...(occurredAt === void 0 ? {} : { occurredAt }),
  };
}
/** Classifies one native JSONL row through the same filters used by history import. */
function classifyClaudeCliHistoryLine(params) {
  let entry;
  try {
    entry = JSON.parse(params.line);
  } catch {
    return { humanTurn: false };
  }
  return classifyClaudeCliHistoryEntry({
    ...params,
    entry,
  });
}
/** Applies native history filters to an already-decoded catalog user message. */
function classifyClaudeCliHistoryMessage(params) {
  return classifyClaudeCliHistoryEntry({
    cliSessionId: params.cliSessionId,
    sourceLineNumber: params.sourceLineNumber,
    entry: {
      type: "user",
      timestamp: params.timestamp,
      message: {
        role: "user",
        content: params.content,
      },
    },
  });
}
//#endregion
export { classifyClaudeCliHistoryMessage as n, classifyClaudeCliHistoryLine as t };
