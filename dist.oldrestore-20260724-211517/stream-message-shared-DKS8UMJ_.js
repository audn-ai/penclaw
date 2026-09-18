//#region src/agents/stream-message-shared.ts
function buildUsageWithNoCost(params) {
  const input = params.input ?? 0;
  const output = params.output ?? 0;
  return {
    input,
    output,
    cacheRead: params.cacheRead ?? 0,
    cacheWrite: params.cacheWrite ?? 0,
    totalTokens: params.totalTokens ?? input + output,
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      total: 0,
    },
  };
}
function buildAssistantMessage(params) {
  return {
    role: "assistant",
    content: params.content,
    stopReason: params.stopReason,
    api: params.model.api,
    provider: params.model.provider,
    model: params.model.id,
    usage: params.usage,
    timestamp: params.timestamp ?? Date.now(),
  };
}
function buildAssistantMessageWithZeroUsage(params) {
  return buildAssistantMessage({
    model: params.model,
    content: params.content,
    stopReason: params.stopReason,
    usage: buildUsageWithNoCost({}),
    timestamp: params.timestamp,
  });
}
const STREAM_ERROR_FALLBACK_TEXT = "[assistant turn failed before producing content]";
function buildStreamErrorAssistantMessage(params) {
  return {
    ...buildAssistantMessageWithZeroUsage({
      model: params.model,
      content: [
        {
          type: "text",
          text: STREAM_ERROR_FALLBACK_TEXT,
        },
      ],
      stopReason: "error",
      timestamp: params.timestamp,
    }),
    stopReason: "error",
    errorMessage: params.errorMessage,
  };
}
//#endregion
export {
  buildUsageWithNoCost as i,
  buildAssistantMessage as n,
  buildStreamErrorAssistantMessage as r,
  STREAM_ERROR_FALLBACK_TEXT as t,
};
