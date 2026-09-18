import { a as toToolDefinitions } from "./agent-tool-definition-adapter-BdyK5IN2.js";
import { t as createOpenClawCodingTools } from "./agent-tools-CQdhKaa9.js";
import { n as buildBootstrapContextForFiles } from "./bootstrap-files-B9pwG25K.js";
import { t as SessionManager } from "./session-manager-BD4l9VJc.js";
import { t as guardSessionManager } from "./session-tool-result-guard-wrapper-BNpL0uO1.js";
import {
  mt as ModelRegistry,
  o as createAgentSession,
  ot as SettingsManager,
  s as DefaultResourceLoader,
  xt as AuthStorage,
} from "./sessions-Duh5damM.js";
import "./worker-admission-BAoXlOyb.js";
import { n as createNativeModelOwnedRuntimeModel } from "./setup-B0vTrkmK.js";
import { t as getProcessSupervisor } from "./supervisor-BdR4bacv.js";
import {
  a as toWorkerTranscriptMessage,
  i as isWorkerTranscriptMessageFrameSafe,
  n as cloneTextContent,
  r as cloneUsage,
  t as cloneImageContent,
} from "./transcript-message-widVBq0t.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-y83k6oxW.js";
import {
  g as loadWorkspaceBootstrapFiles,
  t as DEFAULT_AGENTS_FILENAME,
} from "./workspace-DXzCbuC0.js";
//#region src/worker/embedded-agent-live.runtime.ts
const MAX_LIVE_EVENT_BYTES = 32 * 1024;
const MAX_LIVE_PREVIEW_BYTES = 4 * 1024;
function liveEventBytes(event) {
  try {
    return Buffer.byteLength(JSON.stringify(event), "utf8");
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}
function truncateLiveText(value) {
  if (Buffer.byteLength(value, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
  const suffix = "…";
  return `${truncateUtf8Prefix(value, MAX_LIVE_PREVIEW_BYTES - Buffer.byteLength(suffix, "utf8"))}${suffix}`;
}
function boundLiveValue(value) {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === void 0) return null;
    if (Buffer.byteLength(serialized, "utf8") <= MAX_LIVE_PREVIEW_BYTES)
      return structuredClone(value);
    return {
      truncated: true,
      preview: truncateLiveText(serialized),
    };
  } catch {
    return {
      truncated: true,
      preview: "[unserializable live payload]",
    };
  }
}
function boundLiveEvent(event) {
  if (liveEventBytes(event) <= MAX_LIVE_EVENT_BYTES) return structuredClone(event);
  let bounded;
  if (event.kind === "assistant") {
    const text = truncateLiveText(event.payload.text);
    bounded = {
      kind: "assistant",
      payload: {
        ...event.payload,
        text,
        delta: text,
        replace: true,
      },
    };
  } else if (event.kind === "thinking")
    bounded = {
      kind: "thinking",
      payload: {
        text: truncateLiveText(event.payload.text),
        delta: truncateLiveText(event.payload.delta),
      },
    };
  else if (event.kind === "tool")
    if (event.payload.phase === "start")
      bounded = {
        kind: "tool",
        payload: {
          ...event.payload,
          args: boundLiveValue(event.payload.args),
        },
      };
    else if (event.payload.phase === "update")
      bounded = {
        kind: "tool",
        payload: {
          ...event.payload,
          partialResult: boundLiveValue(event.payload.partialResult),
        },
      };
    else
      bounded = {
        kind: "tool",
        payload: {
          ...event.payload,
          result: boundLiveValue(event.payload.result),
        },
      };
  else if (event.kind === "lifecycle" && event.payload.phase === "error")
    bounded = {
      kind: "lifecycle",
      payload: {
        ...event.payload,
        error: truncateLiveText(event.payload.error),
      },
    };
  else throw new Error(`worker live ${event.kind} event exceeds the protocol payload limit`);
  if (liveEventBytes(bounded) > MAX_LIVE_EVENT_BYTES)
    throw new Error(`worker live ${event.kind} event cannot fit the protocol payload limit`);
  return bounded;
}
function coalescePendingLiveEvent(pending, event) {
  const index = pending.length - 1;
  const previous = pending[index];
  if (!previous) return false;
  if (previous.kind === "assistant" && event.kind === "assistant") {
    pending[index] = boundLiveEvent({
      kind: "assistant",
      payload: {
        ...event.payload,
        delta: event.payload.text,
        replace: true,
      },
    });
    return true;
  }
  if (previous.kind === "thinking" && event.kind === "thinking") {
    if (event.payload.text === "" && event.payload.delta === "") return false;
    pending[index] = boundLiveEvent({
      kind: "thinking",
      payload: {
        text: event.payload.text,
        delta: `${previous.payload.delta}${event.payload.delta}`,
      },
    });
    return true;
  }
  if (
    previous.kind === "tool" &&
    previous.payload.phase === "update" &&
    event.kind === "tool" &&
    event.payload.phase === "update" &&
    previous.payload.toolCallId === event.payload.toolCallId
  ) {
    pending[index] = boundLiveEvent(event);
    return true;
  }
  return false;
}
function readAssistantText(message) {
  if (message.role !== "assistant") return "";
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}
function readAssistantThinking(message) {
  if (message.role !== "assistant") return "";
  return message.content
    .filter((part) => part.type === "thinking")
    .map((part) => part.thinking)
    .join("");
}
function createWorkerLiveRuntime(client) {
  const pendingLiveEvents = [];
  let liveDrain;
  let liveDegraded = false;
  const startLiveDrain = () => {
    if (liveDrain || liveDegraded || pendingLiveEvents.length === 0) return;
    liveDrain = (async () => {
      while (true) {
        const event = pendingLiveEvents.shift();
        if (!event) return;
        await client.emit(event);
      }
    })()
      .catch(() => {
        liveDegraded = true;
        pendingLiveEvents.length = 0;
      })
      .finally(() => {
        liveDrain = void 0;
        startLiveDrain();
      });
  };
  const enqueueLive = (event) => {
    if (liveDegraded) return;
    try {
      const bounded = boundLiveEvent(event);
      if (!coalescePendingLiveEvent(pendingLiveEvents, bounded)) pendingLiveEvents.push(bounded);
      startLiveDrain();
    } catch {
      liveDegraded = true;
      pendingLiveEvents.length = 0;
    }
  };
  const flush = async () => {
    let drain = liveDrain;
    while (drain) {
      await drain;
      drain = liveDrain;
    }
  };
  const startedAt = Date.now();
  let lifecycleFinished = false;
  let terminalLiveEvent;
  let streamedText = "";
  let streamedThinking = "";
  const handleSessionEvent = (event) => {
    if (event.type === "agent_start") {
      enqueueLive({
        kind: "lifecycle",
        payload: {
          phase: "start",
          startedAt,
        },
      });
      return;
    }
    if (event.type === "message_start" && event.message.role === "assistant") {
      streamedText = "";
      streamedThinking = "";
      return;
    }
    if (event.type === "message_update") {
      if (event.assistantMessageEvent.type === "text_delta") {
        streamedText = readAssistantText(event.message);
        enqueueLive({
          kind: "assistant",
          payload: {
            text: streamedText,
            delta: event.assistantMessageEvent.delta,
          },
        });
      } else if (event.assistantMessageEvent.type === "thinking_delta") {
        streamedThinking = readAssistantThinking(event.message);
        enqueueLive({
          kind: "thinking",
          payload: {
            text: streamedThinking,
            delta: event.assistantMessageEvent.delta,
          },
        });
      }
      return;
    }
    if (event.type === "message_end" && event.message.role === "assistant") {
      const finalText = readAssistantText(event.message);
      if (finalText !== streamedText)
        enqueueLive({
          kind: "assistant",
          payload: {
            text: finalText,
            delta: finalText,
            replace: true,
          },
        });
      const finalThinking = readAssistantThinking(event.message);
      if (finalThinking !== streamedThinking)
        enqueueLive({
          kind: "thinking",
          payload: {
            text: finalThinking,
            delta: finalThinking,
          },
        });
      return;
    }
    if (event.type === "tool_execution_start") {
      enqueueLive({
        kind: "tool",
        payload: {
          phase: "start",
          name: event.toolName,
          toolCallId: event.toolCallId,
          args: event.args,
          ...(event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
        },
      });
      return;
    }
    if (event.type === "tool_execution_update") {
      enqueueLive({
        kind: "tool",
        payload: {
          phase: "update",
          name: event.toolName,
          toolCallId: event.toolCallId,
          partialResult: event.partialResult,
          ...(event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
        },
      });
      return;
    }
    if (event.type === "tool_execution_end") {
      enqueueLive({
        kind: "tool",
        payload: {
          phase: "result",
          name: event.toolName,
          toolCallId: event.toolCallId,
          isError: event.isError,
          result: event.result,
          ...(event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
        },
      });
      return;
    }
    if (event.type === "agent_end") {
      lifecycleFinished = true;
      const lastAssistant = event.messages
        .toReversed()
        .find((message) => message.role === "assistant");
      if (lastAssistant?.stopReason === "error")
        terminalLiveEvent = {
          kind: "lifecycle",
          payload: {
            phase: "error",
            startedAt,
            endedAt: Date.now(),
            error: lastAssistant.errorMessage ?? "Worker inference failed.",
            fallbackExhaustedFailure: true,
          },
        };
      else if (lastAssistant?.stopReason === "aborted")
        terminalLiveEvent = {
          kind: "lifecycle",
          payload: {
            phase: "end",
            startedAt,
            endedAt: Date.now(),
            stopReason: "aborted",
            aborted: true,
          },
        };
      else
        terminalLiveEvent = {
          kind: "lifecycle",
          payload: {
            phase: "end",
            startedAt,
            endedAt: Date.now(),
          },
        };
    }
  };
  const enqueueRunFailure = (failure) => {
    if (lifecycleFinished) return;
    if (failure.aborted)
      terminalLiveEvent = {
        kind: "lifecycle",
        payload: {
          phase: "end",
          startedAt,
          endedAt: Date.now(),
          stopReason: "aborted",
          aborted: true,
        },
      };
    else
      terminalLiveEvent = {
        kind: "lifecycle",
        payload: {
          phase: "error",
          startedAt,
          endedAt: Date.now(),
          error: failure.error.message,
          fallbackExhaustedFailure: true,
        },
      };
  };
  const emitTerminal = async () => {
    if (!terminalLiveEvent) return;
    await client.emit(boundLiveEvent(terminalLiveEvent));
  };
  return {
    handleSessionEvent,
    enqueueRunFailure,
    flush,
    emitTerminal,
  };
}
//#endregion
//#region src/worker/embedded-agent-transcript.runtime.ts
function toAgentMessage(message) {
  if (message.role === "user")
    return {
      role: "user",
      content: message.content.map((part) =>
        part.type === "text" ? cloneTextContent(part) : cloneImageContent(part),
      ),
      timestamp: message.timestamp,
    };
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
  return {
    ...cloneUsage(message),
    diagnostics: message.diagnostics?.map((diagnostic) => structuredClone(diagnostic)),
  };
}
function toWorkerInferenceMessage(message) {
  if (message.role === "user")
    return {
      role: "user",
      content:
        typeof message.content === "string"
          ? message.content
          : message.content.map((part) =>
              part.type === "text" ? cloneTextContent(part) : cloneImageContent(part),
            ),
      timestamp: message.timestamp,
      ...(message.runtimeContextCarrier ? { runtimeContextCarrier: true } : {}),
    };
  const projected = toWorkerTranscriptMessage(message);
  if (!projected) throw new Error(`Unsupported inference message role: ${message.role}`);
  return projected;
}
function windowWorkerInferenceMessages(messages) {
  if (messages.length <= 1024) return messages;
  const minimumStart = messages.length - WORKER_INFERENCE_MAX_CONTEXT_MESSAGES;
  for (let index = minimumStart; index < messages.length; index += 1)
    if (messages[index]?.role === "user") return messages.slice(index);
  throw new Error("Worker inference context has no complete user turn within the message limit.");
}
function toWorkerInferenceContext(context) {
  return {
    ...(context.systemPrompt === void 0 ? {} : { systemPrompt: context.systemPrompt }),
    messages: windowWorkerInferenceMessages(context.messages).map(toWorkerInferenceMessage),
    ...(context.tools
      ? {
          tools: context.tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: structuredClone(tool.parameters),
          })),
        }
      : {}),
  };
}
function createWorkerTranscriptRuntime(client) {
  const pendingTranscriptMessages = [];
  const onMessagePersisted = (message) => {
    const projected = toWorkerTranscriptMessage(message);
    if (projected) {
      if (!isWorkerTranscriptMessageFrameSafe(projected))
        throw new Error("Worker transcript message exceeds the protocol payload limit.");
      pendingTranscriptMessages.push(projected);
    }
  };
  const flushTranscript = async () => {
    while (pendingTranscriptMessages.length > 0) {
      const batch = pendingTranscriptMessages.slice(0, 64);
      await client.commit(batch);
      pendingTranscriptMessages.splice(0, batch.length);
    }
  };
  let sessionWriteQueue = Promise.resolve();
  const withSessionWriteLock = (operation) => {
    const result = sessionWriteQueue.then(async () => {
      const value = await operation();
      await flushTranscript();
      return value;
    });
    sessionWriteQueue = result.then(
      () => void 0,
      () => void 0,
    );
    return result;
  };
  return {
    onMessagePersisted,
    withSessionWriteLock,
  };
}
//#endregion
//#region src/worker/embedded-agent.runtime.ts
const LOCAL_WORKER_TOOL_NAMES = ["read", "write", "edit", "apply_patch", "exec", "process"];
function toError(value, fallback) {
  return value instanceof Error ? value : new Error(fallback, { cause: value });
}
async function runWorkerEmbeddedTurn(params) {
  const model = createNativeModelOwnedRuntimeModel({
    provider: params.modelRef.provider,
    modelId: params.modelRef.model,
  });
  const authStorage = AuthStorage.inMemory({});
  const modelRegistry = ModelRegistry.inMemory(authStorage);
  const settingsManager = SettingsManager.inMemory({
    compaction: { enabled: false },
    retry: { enabled: false },
  });
  const contextFiles = buildBootstrapContextForFiles(
    (await loadWorkspaceBootstrapFiles(params.cwd)).filter(
      (file) => file.name === DEFAULT_AGENTS_FILENAME,
    ),
    {},
  );
  const resourceLoader = new DefaultResourceLoader({
    cwd: params.cwd,
    agentDir: params.stateDir,
    settingsManager,
    noExtensions: true,
    noSkills: true,
    noPromptTemplates: true,
    noThemes: true,
    noContextFiles: true,
    ...(params.systemPrompt === void 0 ? {} : { appendSystemPrompt: [params.systemPrompt] }),
    agentsFilesOverride: () => ({ agentsFiles: contextFiles }),
  });
  await resourceLoader.reload();
  const baseSessionManager = SessionManager.inMemory(params.cwd);
  for (const message of params.initialMessages ?? [])
    baseSessionManager.appendMessage(toAgentMessage(message));
  const transcriptRuntime = createWorkerTranscriptRuntime(params.transcript);
  const sessionManager = guardSessionManager(baseSessionManager, {
    suppressNextUserMessagePersistence: params.suppressPromptTranscript,
    onMessagePersisted: transcriptRuntime.onMessagePersisted,
  });
  const toolNameSet = new Set(LOCAL_WORKER_TOOL_NAMES);
  const localTools = createOpenClawCodingTools({
    cwd: params.cwd,
    workspaceDir: params.cwd,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    runSessionKey: params.sessionKey,
    runId: params.runId,
    oneShotCliRun: true,
    senderIsOwner: true,
    disableMessageTool: true,
    runtimeToolAllowlist: [...LOCAL_WORKER_TOOL_NAMES],
    modelProvider: params.modelRef.provider,
    modelId: params.modelRef.model,
    modelApi: model.api,
    modelContextWindowTokens: model.contextWindow,
    config: { plugins: { enabled: false } },
    exec: {
      host: "gateway",
      security: "full",
      ask: "off",
    },
    toolConstructionPlan: {
      includeBaseCodingTools: true,
      includeShellTools: true,
      includeChannelTools: false,
      includeOpenClawTools: false,
      includePluginTools: false,
    },
  }).filter((tool) => toolNameSet.has(tool.name));
  const discoveredToolNames = new Set(localTools.map((tool) => tool.name));
  for (const toolName of LOCAL_WORKER_TOOL_NAMES)
    if (!discoveredToolNames.has(toolName))
      throw new Error(`Worker coding tool unavailable: ${toolName}`);
  const { session } = await createAgentSession({
    cwd: params.cwd,
    agentDir: params.stateDir,
    authStorage,
    modelRegistry,
    model,
    thinkingLevel: "medium",
    tools: [...LOCAL_WORKER_TOOL_NAMES],
    customTools: toToolDefinitions(localTools),
    noTools: "all",
    sessionManager,
    settingsManager,
    resourceLoader,
    withSessionWriteLock: transcriptRuntime.withSessionWriteLock,
  });
  session.agent.sessionId = params.sessionId;
  session.setActiveToolsByName([...LOCAL_WORKER_TOOL_NAMES]);
  session.agent.streamFn = (_model, context, options) =>
    params.inference.stream({
      modelRef: params.modelRef,
      context: toWorkerInferenceContext(context),
      options: structuredClone(params.inferenceOptions ?? {}),
      ...(options?.signal ? { signal: options.signal } : {}),
    });
  const liveRuntime = createWorkerLiveRuntime(params.live);
  const unsubscribe = session.subscribe(liveRuntime.handleSessionEvent);
  const abortTurn = () => session.agent.abort();
  params.signal?.addEventListener("abort", abortTurn, { once: true });
  let runFailure;
  try {
    if (params.signal?.aborted) throw toError(params.signal.reason, "Worker agent turn aborted.");
    await session.agent.prompt({
      role: "user",
      content: [
        {
          type: "text",
          text: params.prompt,
        },
      ],
      timestamp: Date.now(),
    });
    await session.agent.waitForIdle();
    if (params.signal?.aborted) throw toError(params.signal.reason, "Worker agent turn aborted.");
    const terminalAssistant = session.agent.state.messages
      .toReversed()
      .find((message) => message.role === "assistant");
    if (terminalAssistant?.stopReason === "error")
      throw new Error(terminalAssistant.errorMessage ?? "Worker inference failed.");
    if (terminalAssistant?.stopReason === "aborted")
      throw new Error(terminalAssistant.errorMessage ?? "Worker inference was aborted.");
  } catch (error) {
    runFailure = params.signal?.aborted
      ? toError(params.signal.reason, "Worker agent turn aborted.")
      : toError(error, "Worker agent turn failed.");
    liveRuntime.enqueueRunFailure({
      aborted: params.signal?.aborted === true,
      error: runFailure,
    });
  }
  let finalTranscriptFailure;
  try {
    try {
      await transcriptRuntime.withSessionWriteLock(() => void 0);
    } catch (error) {
      finalTranscriptFailure = toError(error, "Worker transcript flush failed.");
    }
    await liveRuntime.flush();
    if (finalTranscriptFailure === void 0) await liveRuntime.emitTerminal();
  } finally {
    params.signal?.removeEventListener("abort", abortTurn);
    unsubscribe();
    getProcessSupervisor().cancelScope(params.sessionKey, "manual-cancel");
    session.dispose();
  }
  if (runFailure !== void 0) throw runFailure;
  if (finalTranscriptFailure !== void 0) throw finalTranscriptFailure;
  return {
    messages: session.agent.state.messages.flatMap((message) => {
      const projected = toWorkerTranscriptMessage(message);
      return projected ? [projected] : [];
    }),
  };
}
//#endregion
export { runWorkerEmbeddedTurn };
