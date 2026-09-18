//#region src/gateway/cli-session-history.claude-activity.d.ts
type ClaudeCliHistoryLineClassification = {
  humanTurn: boolean;
  occurredAt?: number;
  userText?: string;
};
/** Classifies one native JSONL row through the same filters used by history import. */
declare function classifyClaudeCliHistoryLine(params: {
  line: string;
  cliSessionId: string;
  sourceLineNumber: number;
}): ClaudeCliHistoryLineClassification;
/** Applies native history filters to an already-decoded catalog user message. */
declare function classifyClaudeCliHistoryMessage(params: {
  content: unknown;
  timestamp?: unknown;
  cliSessionId: string;
  sourceLineNumber: number;
}): ClaudeCliHistoryLineClassification;
//#endregion
export {
  classifyClaudeCliHistoryLine as n,
  classifyClaudeCliHistoryMessage as r,
  ClaudeCliHistoryLineClassification as t,
};
