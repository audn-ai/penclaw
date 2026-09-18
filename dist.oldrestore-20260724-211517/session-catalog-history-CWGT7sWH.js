import { t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-CpgfT8aN.js";
import { l as withSessionTranscriptWriteLock } from "./session-transcript-runtime-B2hvNHEH.js";
//#region extensions/anthropic/session-catalog-history.ts
function importedClaudeMessage(item, fallbackTimestamp) {
  const timestamp = item.timestamp ? Date.parse(item.timestamp) : fallbackTimestamp;
  const text = item.text?.trim() || "[Unsupported Claude transcript item]";
  if (item.type === "userMessage")
    return {
      role: "user",
      content: text,
      timestamp,
      __openclaw: { mirrorOrigin: "claude-catalog-import" },
    };
  return {
    role: "assistant",
    content: [
      {
        type: "text",
        text: `${item.type === "reasoning" ? "Thinking\n\n" : item.type === "toolCall" ? "Tool call\n\n" : item.type === "toolResult" ? "Tool result\n\n" : ""}${text}`,
      },
    ],
    timestamp,
    api: "anthropic-messages",
    provider: CLAUDE_CLI_BACKEND_ID,
    model: "native-history",
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      },
    },
    stopReason: "stop",
  };
}
async function importClaudeHistory(params) {
  const items = params.items.toReversed();
  await withSessionTranscriptWriteLock(params, async (transcript) => {
    for (const [index, item] of items.entries()) {
      const message = {
        ...importedClaudeMessage(item, Date.now() + index),
        idempotencyKey: `claude-catalog:${params.threadId}:${item.uuid ?? index}`,
      };
      await transcript.appendMessage({
        message,
        idempotencyLookup: "scan",
        cwd: params.cwd,
      });
    }
  });
}
//#endregion
export { importClaudeHistory as t };
