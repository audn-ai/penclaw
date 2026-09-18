import { parseStreamingJson } from "@openclaw/ai/internal/runtime";
import "./worker-admission-BAoXlOyb.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { i as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-widVBq0t.js";
//#region src/worker/inference-stream.runtime.ts
function emptyAssistantMessage(modelRef) {
  return {
    role: "assistant",
    content: [],
    api: "openai-responses",
    provider: modelRef.provider,
    model: modelRef.model,
    stopReason: "stop",
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
    timestamp: Date.now(),
  };
}
function processInferenceEvent(payload, partial, tolerateMissingState) {
  const event = payload.event;
  switch (event.type) {
    case "start":
      partial.api = event.resolvedModel.api;
      partial.provider = event.resolvedModel.provider;
      partial.model = event.resolvedModel.model;
      partial.timestamp = event.timestamp;
      return {
        type: "start",
        partial,
      };
    case "text_start":
      partial.content[event.contentIndex] = {
        type: "text",
        text: "",
        ...(event.contentSignature === void 0 ? {} : { textSignature: event.contentSignature }),
      };
      return {
        type: "text_start",
        contentIndex: event.contentIndex,
        partial,
      };
    case "text_delta": {
      const content = partial.content[event.contentIndex];
      if (content?.type !== "text") {
        if (tolerateMissingState) return;
        throw new Error("worker inference text delta has no active text block");
      }
      content.text += event.delta;
      return {
        type: "text_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
        partial,
      };
    }
    case "text_end": {
      const content = partial.content[event.contentIndex];
      if (content?.type !== "text") {
        if (tolerateMissingState) return;
        throw new Error("worker inference text end has no active text block");
      }
      if (event.contentSignature !== void 0) content.textSignature = event.contentSignature;
      return {
        type: "text_end",
        contentIndex: event.contentIndex,
        content: content.text,
        partial,
      };
    }
    case "thinking_start":
      partial.content[event.contentIndex] = {
        type: "thinking",
        thinking: "",
      };
      return {
        type: "thinking_start",
        contentIndex: event.contentIndex,
        partial,
      };
    case "thinking_delta": {
      const content = partial.content[event.contentIndex];
      if (content?.type !== "thinking") {
        if (tolerateMissingState) return;
        throw new Error("worker inference thinking delta has no active thinking block");
      }
      content.thinking += event.delta;
      return {
        type: "thinking_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
        partial,
      };
    }
    case "thinking_end": {
      const content = partial.content[event.contentIndex];
      if (content?.type !== "thinking") {
        if (tolerateMissingState) return;
        throw new Error("worker inference thinking end has no active thinking block");
      }
      if (event.contentSignature !== void 0) content.thinkingSignature = event.contentSignature;
      return {
        type: "thinking_end",
        contentIndex: event.contentIndex,
        content: content.thinking,
        partial,
      };
    }
    case "toolcall_start":
      partial.content[event.contentIndex] = {
        type: "toolCall",
        id: event.id,
        name: event.toolName,
        arguments: {},
        partialJson: "",
      };
      return {
        type: "toolcall_start",
        contentIndex: event.contentIndex,
        partial,
      };
    case "toolcall_delta": {
      const content = partial.content[event.contentIndex];
      if (content?.type !== "toolCall") {
        if (tolerateMissingState) return;
        throw new Error("worker inference tool delta has no active tool call");
      }
      const streaming = content;
      streaming.partialJson = `${streaming.partialJson ?? ""}${event.delta}`;
      content.arguments = parseStreamingJson(streaming.partialJson);
      return {
        type: "toolcall_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
        partial,
      };
    }
    case "toolcall_end": {
      const content = partial.content[event.contentIndex];
      if (content?.type !== "toolCall") {
        if (tolerateMissingState) return;
        throw new Error("worker inference tool end has no active tool call");
      }
      delete content.partialJson;
      return {
        type: "toolcall_end",
        contentIndex: event.contentIndex,
        toolCall: content,
        partial,
      };
    }
  }
}
function terminalErrorMessage(partial, outcome) {
  partial.stopReason = outcome.reason === "cancelled" ? "aborted" : "error";
  partial.errorMessage = outcome.message;
  if (outcome.usage) partial.usage = structuredClone(outcome.usage);
  return partial;
}
function transcriptSafeErrorMessage(modelRef, message) {
  if (isWorkerTranscriptMessageFrameSafe(message)) return message;
  const replacement = emptyAssistantMessage(modelRef);
  replacement.stopReason = message.stopReason === "aborted" ? "aborted" : "error";
  replacement.errorMessage = "Worker inference result exceeds the transcript message limit.";
  return replacement;
}
function createWorkerInferenceStreamAdapter(adapter) {
  let modelCallSeq = 0;
  return (inferenceRequest) => {
    const stream = (0, event_stream_exports.createAssistantMessageEventStream)();
    const partial = emptyAssistantMessage(adapter.modelRef);
    let streamHasGap = false;
    let settled = false;
    modelCallSeq += 1;
    const turnSuffix = `:${modelCallSeq}`;
    const identity = {
      runEpoch: adapter.runEpoch,
      sessionId: adapter.sessionId,
      runId: adapter.runId,
      turnId: `${adapter.turnId.slice(0, 256 - turnSuffix.length)}${turnSuffix}`,
    };
    const request = {
      ...identity,
      modelRef: inferenceRequest.modelRef,
      context: structuredClone(inferenceRequest.context),
      options: structuredClone(inferenceRequest.options),
    };
    const finishAborted = () => {
      if (settled) return;
      settled = true;
      partial.stopReason = "aborted";
      partial.errorMessage = "Worker inference aborted.";
      stream.push({
        type: "error",
        reason: "aborted",
        error: transcriptSafeErrorMessage(adapter.modelRef, partial),
      });
      stream.end();
    };
    const abort = () => {
      adapter.client
        .cancel(identity)
        .catch(() => void 0)
        .finally(finishAborted);
    };
    if (inferenceRequest.signal?.aborted) {
      partial.stopReason = "aborted";
      partial.errorMessage = "Worker inference aborted before start.";
      stream.push({
        type: "error",
        reason: "aborted",
        error: transcriptSafeErrorMessage(adapter.modelRef, partial),
      });
      stream.end();
      return stream;
    }
    inferenceRequest.signal?.addEventListener("abort", abort, { once: true });
    adapter.client
      .start(request, {
        onStreamGap: () => {
          streamHasGap = true;
        },
        onEvent: (event) => {
          const projected = processInferenceEvent(event, partial, streamHasGap);
          if (projected) stream.push(projected);
        },
      })
      .then((outcome) => {
        if (settled) return;
        settled = true;
        if (outcome.type === "done") {
          if (!isWorkerTranscriptMessageFrameSafe(outcome.message)) {
            const message = emptyAssistantMessage(adapter.modelRef);
            message.stopReason = "error";
            message.errorMessage = "Worker inference result exceeds the transcript message limit.";
            stream.push({
              type: "error",
              reason: "error",
              error: message,
            });
            stream.end();
            return;
          }
          const reason = outcome.message.stopReason;
          const message = structuredClone(outcome.message);
          stream.push({
            type: "done",
            reason,
            message,
          });
          stream.end();
          return;
        }
        const message = transcriptSafeErrorMessage(
          adapter.modelRef,
          terminalErrorMessage(partial, outcome),
        );
        const reason = outcome.reason === "cancelled" ? "aborted" : "error";
        stream.push({
          type: "error",
          reason,
          error: message,
        });
        stream.end();
      })
      .catch((error) => {
        if (settled) return;
        settled = true;
        partial.stopReason = inferenceRequest.signal?.aborted ? "aborted" : "error";
        partial.errorMessage = error instanceof Error ? error.message : String(error);
        stream.push({
          type: "error",
          reason: partial.stopReason,
          error: transcriptSafeErrorMessage(adapter.modelRef, partial),
        });
        stream.end();
      })
      .finally(() => {
        inferenceRequest.signal?.removeEventListener("abort", abort);
      });
    return stream;
  };
}
//#endregion
export { createWorkerInferenceStreamAdapter };
