import { l as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES } from "./worker-admission-BAoXlOyb.js";
//#region src/worker/transcript-message.ts
const SIZE_FRAME_ID = "00000000-0000-4000-8000-000000000000";
function cloneTextContent(part) {
  return {
    type: "text",
    text: part.text,
    ...(part.textSignature ? { textSignature: part.textSignature } : {}),
  };
}
function cloneImageContent(part) {
  return {
    type: "image",
    data: part.data,
    mimeType: part.mimeType,
  };
}
function cloneUsage(message) {
  return {
    role: "assistant",
    content: message.content.map((part) => {
      if (part.type === "text") return cloneTextContent(part);
      if (part.type === "thinking")
        return {
          type: "thinking",
          thinking: part.thinking,
          ...(part.thinkingSignature ? { thinkingSignature: part.thinkingSignature } : {}),
          ...(part.redacted === void 0 ? {} : { redacted: part.redacted }),
        };
      return {
        type: "toolCall",
        id: part.id,
        name: part.name,
        arguments: structuredClone(part.arguments),
        ...(part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {}),
        ...(part.executionMode ? { executionMode: part.executionMode } : {}),
      };
    }),
    api: message.api,
    provider: message.provider,
    model: message.model,
    ...(message.responseModel ? { responseModel: message.responseModel } : {}),
    ...(message.responseId ? { responseId: message.responseId } : {}),
    ...(message.diagnostics
      ? {
          diagnostics: message.diagnostics.map((diagnostic) => ({
            type: diagnostic.type,
            timestamp: diagnostic.timestamp,
            ...(diagnostic.error
              ? {
                  error: {
                    ...(diagnostic.error.name ? { name: diagnostic.error.name } : {}),
                    message: diagnostic.error.message,
                    ...(diagnostic.error.stack ? { stack: diagnostic.error.stack } : {}),
                    ...(diagnostic.error.code === void 0 ? {} : { code: diagnostic.error.code }),
                  },
                }
              : {}),
            ...(diagnostic.details ? { details: structuredClone(diagnostic.details) } : {}),
          })),
        }
      : {}),
    usage: {
      input: message.usage.input,
      output: message.usage.output,
      cacheRead: message.usage.cacheRead,
      cacheWrite: message.usage.cacheWrite,
      ...(message.usage.contextUsage
        ? { contextUsage: structuredClone(message.usage.contextUsage) }
        : {}),
      totalTokens: message.usage.totalTokens,
      cost: {
        input: message.usage.cost.input,
        output: message.usage.cost.output,
        cacheRead: message.usage.cost.cacheRead,
        cacheWrite: message.usage.cost.cacheWrite,
        total: message.usage.cost.total,
        ...(message.usage.cost.totalOrigin ? { totalOrigin: message.usage.cost.totalOrigin } : {}),
      },
    },
    stopReason: message.stopReason,
    ...(message.errorMessage ? { errorMessage: message.errorMessage } : {}),
    ...(message.errorCode ? { errorCode: message.errorCode } : {}),
    ...(message.errorType ? { errorType: message.errorType } : {}),
    ...(message.errorBody ? { errorBody: message.errorBody } : {}),
    timestamp: message.timestamp,
  };
}
function toWorkerTranscriptMessage(message) {
  if (message.role === "user")
    return {
      role: "user",
      content:
        typeof message.content === "string"
          ? [
              {
                type: "text",
                text: message.content,
              },
            ]
          : message.content.map((part) =>
              part.type === "text" ? cloneTextContent(part) : cloneImageContent(part),
            ),
      timestamp: message.timestamp,
    };
  if (message.role === "assistant") return cloneUsage(message);
  if (message.role === "toolResult")
    return {
      role: "toolResult",
      toolCallId: message.toolCallId,
      toolName: message.toolName,
      content: message.content.map((part) =>
        part.type === "text" ? cloneTextContent(part) : cloneImageContent(part),
      ),
      ...(message.details === void 0 ? {} : { details: structuredClone(message.details) }),
      isError: message.isError,
      timestamp: message.timestamp,
    };
}
function isWorkerTranscriptMessageFrameSafe(message) {
  const frame = {
    type: "req",
    id: SIZE_FRAME_ID,
    method: "worker.transcript.commit",
    params: {
      runEpoch: Number.MAX_SAFE_INTEGER,
      seq: Number.MAX_SAFE_INTEGER,
      baseLeafId: "x".repeat(256),
      messages: [message],
    },
  };
  try {
    return Buffer.byteLength(JSON.stringify(frame), "utf8") <= WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
  } catch {
    return false;
  }
}
//#endregion
export {
  toWorkerTranscriptMessage as a,
  isWorkerTranscriptMessageFrameSafe as i,
  cloneTextContent as n,
  cloneUsage as r,
  cloneImageContent as t,
};
