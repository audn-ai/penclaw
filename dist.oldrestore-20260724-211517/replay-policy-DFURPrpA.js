import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/github-copilot/replay-policy.ts
const OMITTED_COPILOT_REASONING_TEXT = "[assistant reasoning omitted]";
function isCopilotClaudeModel(modelId) {
  return normalizeLowercaseStringOrEmpty(modelId).includes("claude");
}
function isThinkingBlock(value) {
  if (!value || typeof value !== "object") return false;
  const type = value.type;
  return type === "thinking" || type === "redacted_thinking";
}
function stripCopilotAssistantThinkingMessages(messages) {
  let touched = false;
  const sanitized = messages.map((message) => {
    if (!message || typeof message !== "object") return message;
    const record = message;
    if (record.role !== "assistant" || !Array.isArray(record.content)) return message;
    const content = record.content.filter((block) => !isThinkingBlock(block));
    if (content.length === record.content.length) return message;
    touched = true;
    return {
      ...message,
      content:
        content.length > 0
          ? content
          : [
              {
                type: "text",
                text: OMITTED_COPILOT_REASONING_TEXT,
              },
            ],
    };
  });
  return touched ? sanitized : messages;
}
function buildGithubCopilotReplayPolicy(modelId) {
  return isCopilotClaudeModel(modelId) ? { dropThinkingBlocks: true } : {};
}
function sanitizeGithubCopilotReplayHistory(ctx) {
  return isCopilotClaudeModel(ctx.modelId)
    ? stripCopilotAssistantThinkingMessages(ctx.messages)
    : ctx.messages;
}
//#endregion
export {
  sanitizeGithubCopilotReplayHistory as n,
  stripCopilotAssistantThinkingMessages as r,
  buildGithubCopilotReplayPolicy as t,
};
