import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { constants, createReadStream } from "node:fs";
import {
  access,
  appendFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, isAbsolute, join, resolve } from "node:path";
import { createInterface } from "node:readline";
import { EventStream } from "@openclaw/ai/event-stream";
import { createSseByteGuard, parseStreamingJson } from "@openclaw/ai/internal/runtime";
import "./llm-CMBgEkcN.js";
import { validateToolArguments, validateToolCall } from "@openclaw/ai/validation";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { n as TranscriptNotContinuableError } from "./errors-wmH7Ncz4.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { A as resolvePositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import {
  a as resolveClaudeFable5ModelIdentity,
  l as resolveClaudeSonnet5ModelIdentity,
} from "./src-Dcc_hMY6.js";
import { i as streamSimple, n as completeSimple } from "./stream-DzNMuPw6.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region packages/agent-core/src/reasoning.ts
const ENABLED_THINKING_LEVELS = /* @__PURE__ */ new Set([
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
]);
function isEnabledThinkingLevel(value) {
  return ENABLED_THINKING_LEVELS.has(value);
}
function resolveAgentReasoningOption(model, thinkingLevel) {
  if (thinkingLevel !== "off") return thinkingLevel;
  const offFallback =
    model.thinkingLevelMap?.off ??
    ((model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") &&
    resolveClaudeFable5ModelIdentity(model)
      ? "low"
      : void 0);
  if (isEnabledThinkingLevel(offFallback)) return offFallback;
  return model.api === "anthropic-messages" && resolveClaudeSonnet5ModelIdentity(model)
    ? "off"
    : void 0;
}
//#endregion
//#region packages/agent-core/src/runtime-deps.ts
function missingRuntimeDep(name) {
  return /* @__PURE__ */ new Error(
    `@openclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`,
  );
}
/** Resolve the stream function, preferring an explicit override over injected runtime deps. */
function resolveAgentCoreStreamFn(runtime, streamFn) {
  if (streamFn) return streamFn;
  if (runtime?.streamSimple) return runtime.streamSimple;
  throw missingRuntimeDep("streamSimple");
}
/** Resolve the completion function used by non-streaming helper flows. */
function resolveAgentCoreCompleteFn(runtime) {
  if (runtime?.completeSimple) return runtime.completeSimple;
  throw missingRuntimeDep("completeSimple");
}
//#endregion
//#region packages/agent-core/src/turn-interruption.ts
/** Canonical empty aborted/error assistant recorded when a run ends without output. */
function createFailureMessage(model, error, aborted) {
  return {
    role: "assistant",
    content: [
      {
        type: "text",
        text: "",
      },
    ],
    api: model.api,
    provider: model.provider,
    model: model.id,
    stopReason: aborted ? "aborted" : "error",
    errorMessage: error instanceof Error ? error.message : String(error),
    timestamp: Date.now(),
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
  };
}
const INTERRUPTED_TURN_GUIDANCE = `<turn_aborted>
The previous turn was interrupted. Any running background processes may still be active. If any tools or commands were aborted, they may have partially executed.
</turn_aborted>`;
/**
 * Aborts that end a turn as an intentional handoff (e.g. yield-style tools)
 * mark it with an abort reason carrying `turnHandoff: true`. Interruption
 * guidance is skipped for them: the next turn would otherwise be told tools
 * may have partially executed after a clean, deliberate stop.
 */
function isTurnHandoffAbort(signal) {
  if (!signal?.aborted) return false;
  const reason = signal.reason;
  return typeof reason === "object" && reason !== null && reason.turnHandoff === true;
}
function createInterruptedTurnMessage() {
  return {
    role: "custom",
    customType: "openclaw:turn-aborted",
    content: INTERRUPTED_TURN_GUIDANCE,
    display: false,
    timestamp: Date.now(),
  };
}
async function appendInterruptedTurnMessage(messages, emit) {
  const interruption = createInterruptedTurnMessage();
  messages.push(interruption);
  await emit({
    type: "message_start",
    message: interruption,
  });
  await emit({
    type: "message_end",
    message: interruption,
  });
}
function normalizeCoreContextMessages(messages) {
  return messages.map((message) => {
    if (message.role !== "custom" || message.customType !== "openclaw:turn-aborted") return message;
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
          : message.content,
      timestamp: message.timestamp,
    };
  });
}
//#endregion
//#region packages/agent-core/src/agent-loop.ts
const EventStreamConstructor = EventStream;
function appendTextDeltaToAssistantMessage(message, contentIndex, delta) {
  const content = [...message.content];
  const currentContent = content[contentIndex];
  content[contentIndex] =
    currentContent?.type === "text"
      ? {
          ...currentContent,
          text: currentContent.text + delta,
        }
      : {
          type: "text",
          text: delta,
        };
  return {
    ...message,
    content,
  };
}
function resolveAssistantMessageUpdate(event, currentMessage) {
  if ("partial" in event && event.partial) return event.partial;
  if (event.type === "text_delta")
    return appendTextDeltaToAssistantMessage(currentMessage, event.contentIndex, event.delta);
  return currentMessage;
}
function removeNonExecutableToolCalls(message) {
  if (message.stopReason === "toolUse") return message;
  const content = message.content.filter((item) => item.type !== "toolCall");
  return content.length === message.content.length
    ? message
    : {
        ...message,
        content,
      };
}
/**
 * Start an agent loop with a new prompt message.
 * The prompt is added to the context and events are emitted for it.
 */
function agentLoop(prompts, context, config, signal, streamFn, runtime) {
  const stream = createAgentStream();
  runAgentLoop(
    prompts,
    context,
    config,
    async (event) => {
      stream.push(event);
    },
    signal,
    streamFn,
    runtime,
  )
    .then((messages) => {
      stream.end(messages);
    })
    .catch((error) => {
      pushLoopFailure(stream, config, error, signal);
    });
  return stream;
}
/**
 * Continue an agent loop from the current context without adding a new message.
 * Used for retries - context already has user message or tool results.
 *
 * **Important:** The last message in context must convert to a `user` or `toolResult` message
 * via `convertToLlm`. If it doesn't, the LLM provider will reject the request.
 * This cannot be validated here since `convertToLlm` is only called once per turn.
 */
function agentLoopContinue(context, config, signal, streamFn, runtime) {
  const lastMessage = context.messages.at(-1);
  if (!lastMessage) throw new Error("Cannot continue: no messages in context");
  if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
  const stream = createAgentStream();
  runAgentLoopContinue(
    context,
    config,
    async (event) => {
      stream.push(event);
    },
    signal,
    streamFn,
    runtime,
  )
    .then((messages) => {
      stream.end(messages);
    })
    .catch((error) => {
      pushLoopFailure(stream, config, error, signal);
    });
  return stream;
}
/** Run a prompt-started loop and emit events through a caller-owned sink. */
async function runAgentLoop(prompts, context, config, emit, signal, streamFn, runtime) {
  const newMessages = [...prompts];
  const currentContext = {
    ...context,
    messages: [...context.messages, ...prompts],
  };
  await emit({ type: "agent_start" });
  await emit({ type: "turn_start" });
  for (const prompt of prompts) {
    await emit({
      type: "message_start",
      message: prompt,
    });
    await emit({
      type: "message_end",
      message: prompt,
    });
  }
  await runLoop(currentContext, newMessages, config, signal, emit, streamFn, runtime);
  return newMessages;
}
/** Continue an existing loop context and emit only newly produced messages. */
async function runAgentLoopContinue(context, config, emit, signal, streamFn, runtime) {
  const lastMessage = context.messages.at(-1);
  if (!lastMessage) throw new Error("Cannot continue: no messages in context");
  if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
  const newMessages = [];
  const currentContext = { ...context };
  await emit({ type: "agent_start" });
  await emit({ type: "turn_start" });
  await runLoop(currentContext, newMessages, config, signal, emit, streamFn, runtime);
  return newMessages;
}
function createAgentStream() {
  return new EventStreamConstructor(
    (event) => event.type === "agent_end",
    (event) => (event.type === "agent_end" ? event.messages : []),
  );
}
function pushLoopFailure(stream, config, error, signal) {
  const aborted = signal?.aborted === true;
  const failureMessage = createFailureMessage(config.model, error, aborted);
  stream.push({
    type: "message_start",
    message: failureMessage,
  });
  stream.push({
    type: "message_end",
    message: failureMessage,
  });
  stream.push({
    type: "turn_end",
    message: failureMessage,
    toolResults: [],
  });
  const messages = [failureMessage];
  if (aborted && !isTurnHandoffAbort(signal)) {
    const interruption = createInterruptedTurnMessage();
    messages.push(interruption);
    stream.push({
      type: "message_start",
      message: interruption,
    });
    stream.push({
      type: "message_end",
      message: interruption,
    });
  }
  stream.push({
    type: "agent_end",
    messages,
  });
}
/**
 * Main loop logic shared by agentLoop and agentLoopContinue.
 */
async function runLoop(
  initialContext,
  newMessages,
  initialConfig,
  signal,
  emit,
  streamFn,
  runtime,
) {
  let currentContext = initialContext;
  let config = initialConfig;
  let firstTurn = true;
  let turnOpen = true;
  let pendingMessages = (await config.getSteeringMessages?.()) || [];
  const stopIfAborted = async () => {
    if (!signal?.aborted) return false;
    const abortedMessage = createFailureMessage(
      config.model,
      signal.reason instanceof Error
        ? signal.reason
        : /* @__PURE__ */ new Error("Agent run aborted"),
      true,
    );
    newMessages.push(abortedMessage);
    if (!turnOpen) {
      await emit({ type: "turn_start" });
      turnOpen = true;
    }
    await emit({
      type: "message_start",
      message: abortedMessage,
    });
    await emit({
      type: "message_end",
      message: abortedMessage,
    });
    await emit({
      type: "turn_end",
      message: abortedMessage,
      toolResults: [],
    });
    turnOpen = false;
    if (!isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
    await emit({
      type: "agent_end",
      messages: newMessages,
    });
    return true;
  };
  while (true) {
    let hasMoreToolCalls = true;
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      if (await stopIfAborted()) return;
      if (!firstTurn) {
        await emit({ type: "turn_start" });
        turnOpen = true;
      } else firstTurn = false;
      if (pendingMessages.length > 0)
        for (const message of pendingMessages) {
          await emit({
            type: "message_start",
            message,
          });
          await emit({
            type: "message_end",
            message,
          });
          currentContext.messages.push(message);
          newMessages.push(message);
        }
      if (await stopIfAborted()) return;
      const message = await streamAssistantResponse(
        currentContext,
        config,
        signal,
        emit,
        streamFn,
        runtime,
      );
      newMessages.push(message);
      if (message.stopReason === "error" || message.stopReason === "aborted") {
        await emit({
          type: "turn_end",
          message,
          toolResults: [],
        });
        if (message.stopReason === "aborted" && signal?.aborted && !isTurnHandoffAbort(signal))
          await appendInterruptedTurnMessage(newMessages, emit);
        await emit({
          type: "agent_end",
          messages: newMessages,
        });
        return;
      }
      const toolCalls = message.content.filter((c) => c.type === "toolCall");
      const toolResults = [];
      hasMoreToolCalls = false;
      if (message.stopReason === "toolUse" && toolCalls.length > 0) {
        const executedToolBatch = await executeToolCalls(
          currentContext,
          message,
          config,
          signal,
          emit,
        );
        toolResults.push(...executedToolBatch.messages);
        hasMoreToolCalls = !executedToolBatch.terminate;
        for (const result of toolResults) {
          currentContext.messages.push(result);
          newMessages.push(result);
        }
      }
      await emit({
        type: "turn_end",
        message,
        toolResults,
      });
      turnOpen = false;
      if (await stopIfAborted()) return;
      const nextTurnContext = {
        message,
        toolResults,
        context: currentContext,
        newMessages,
      };
      const nextTurnSnapshot = await config.prepareNextTurn?.(nextTurnContext);
      if (nextTurnSnapshot) {
        currentContext = nextTurnSnapshot.context ?? currentContext;
        const nextModel = nextTurnSnapshot.model ?? config.model;
        const nextThinkingLevel = nextTurnSnapshot.thinkingLevel ?? config.thinkingLevel;
        const nextReasoning =
          (nextTurnSnapshot.thinkingLevel !== void 0 ||
            (nextTurnSnapshot.model !== void 0 && nextThinkingLevel !== void 0)) &&
          nextThinkingLevel !== void 0
            ? resolveAgentReasoningOption(nextModel, nextThinkingLevel)
            : config.reasoning;
        config = Object.assign({}, config, {
          model: nextModel,
          thinkingLevel: nextThinkingLevel,
          reasoning: nextReasoning,
        });
      }
      if (await stopIfAborted()) return;
      if (
        await config.shouldStopAfterTurn?.({
          message,
          toolResults,
          context: currentContext,
          newMessages,
        })
      ) {
        await emit({
          type: "agent_end",
          messages: newMessages,
        });
        return;
      }
      pendingMessages = (await config.getSteeringMessages?.()) || [];
      if (await stopIfAborted()) return;
    }
    const followUpMessages = (await config.getFollowUpMessages?.()) || [];
    if (followUpMessages.length > 0) {
      pendingMessages = followUpMessages;
      continue;
    }
    break;
  }
  await emit({
    type: "agent_end",
    messages: newMessages,
  });
}
/**
 * Stream an assistant response from the LLM.
 * This is where AgentMessage[] gets transformed to Message[] for the LLM.
 */
async function streamAssistantResponse(context, config, signal, emit, streamFn, runtime) {
  let messages = context.messages;
  if (config.transformContext) messages = await config.transformContext(messages, signal);
  messages = normalizeCoreContextMessages(messages);
  const llmMessages = await config.convertToLlm(messages);
  const llmContext = {
    systemPrompt: context.systemPrompt,
    messages: llmMessages,
    tools: context.tools,
  };
  const streamFunction = resolveAgentCoreStreamFn(runtime, streamFn);
  const resolvedApiKey =
    (config.getApiKey ? await config.getApiKey(config.model.provider) : void 0) || config.apiKey;
  const response = await streamFunction(config.model, llmContext, {
    ...config,
    apiKey: resolvedApiKey,
    signal,
  });
  let partialMessage = null;
  let addedPartial = false;
  for await (const event of response)
    switch (event.type) {
      case "start": {
        const message = event.partial;
        partialMessage = message;
        context.messages.push(message);
        addedPartial = true;
        await emit({
          type: "message_start",
          message: { ...message },
        });
        break;
      }
      case "text_start":
      case "text_delta":
      case "text_end":
      case "thinking_start":
      case "thinking_delta":
      case "thinking_end":
      case "toolcall_start":
      case "toolcall_delta":
      case "toolcall_end":
        if (partialMessage) {
          const message = resolveAssistantMessageUpdate(event, partialMessage);
          partialMessage = message;
          context.messages[context.messages.length - 1] = message;
          await emit({
            type: "message_update",
            assistantMessageEvent: event,
            message: { ...message },
          });
        }
        break;
      case "done":
      case "error": {
        const finalMessage = removeNonExecutableToolCalls(await response.result());
        if (addedPartial) context.messages[context.messages.length - 1] = finalMessage;
        else context.messages.push(finalMessage);
        if (!addedPartial)
          await emit({
            type: "message_start",
            message: { ...finalMessage },
          });
        await emit({
          type: "message_end",
          message: finalMessage,
        });
        return finalMessage;
      }
    }
  const finalMessage = removeNonExecutableToolCalls(await response.result());
  if (addedPartial) context.messages[context.messages.length - 1] = finalMessage;
  else {
    context.messages.push(finalMessage);
    await emit({
      type: "message_start",
      message: { ...finalMessage },
    });
  }
  await emit({
    type: "message_end",
    message: finalMessage,
  });
  return finalMessage;
}
/**
 * Execute tool calls from an assistant message.
 */
async function executeToolCalls(currentContext, assistantMessage, config, signal, emit) {
  const toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall");
  const resolvedToolCalls = /* @__PURE__ */ new Map();
  let hasSequentialToolCall = false;
  if (config.toolExecution !== "sequential")
    for (const toolCall of toolCalls) {
      const resolution = await resolveToolCallTool(
        currentContext,
        assistantMessage,
        toolCall,
        config,
        signal,
        resolvedToolCalls,
      );
      if (resolution.kind === "resolved" && resolution.tool?.executionMode === "sequential") {
        hasSequentialToolCall = true;
        break;
      }
      if (signal?.aborted) break;
    }
  if (config.toolExecution === "sequential" || hasSequentialToolCall)
    return executeToolCallsSequential(
      currentContext,
      assistantMessage,
      toolCalls,
      resolvedToolCalls,
      config,
      signal,
      emit,
    );
  return executeToolCallsParallel(
    currentContext,
    assistantMessage,
    toolCalls,
    resolvedToolCalls,
    config,
    signal,
    emit,
  );
}
function hidesToolCallFromChannelProgress(context, toolCall, resolvedToolCalls) {
  const resolution = resolvedToolCalls.get(toolCall);
  return (
    (resolution?.kind === "resolved"
      ? resolution.tool
      : context.tools?.find((candidate) => candidate.name === toolCall.name)
    )?.hideFromChannelProgress === true
  );
}
async function executeToolCallsSequential(
  currentContext,
  assistantMessage,
  toolCalls,
  resolvedToolCalls,
  config,
  signal,
  emit,
) {
  const finalizedCalls = [];
  const messages = [];
  for (const toolCall of toolCalls) {
    const hideFromChannelProgress = hidesToolCallFromChannelProgress(
      currentContext,
      toolCall,
      resolvedToolCalls,
    );
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments,
      ...(hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
    });
    const preparation = await prepareToolCall(
      currentContext,
      assistantMessage,
      toolCall,
      config,
      signal,
      resolvedToolCalls,
    );
    let finalized;
    if (preparation.kind === "immediate")
      finalized = {
        toolCall,
        result: preparation.result,
        isError: preparation.isError,
        executionStarted: false,
        ...(preparation.errorKind ? { errorKind: preparation.errorKind } : {}),
        ...(hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
      };
    else
      finalized = await finalizeExecutedToolCall(
        currentContext,
        assistantMessage,
        preparation,
        await executePreparedToolCall(preparation, signal, emit),
        config,
        signal,
      );
    await emitToolExecutionEnd(finalized, emit);
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    finalizedCalls.push(finalized);
    messages.push(toolResultMessage);
    if (signal?.aborted) break;
  }
  return {
    messages,
    terminate: shouldTerminateToolBatch(finalizedCalls),
  };
}
async function executeToolCallsParallel(
  currentContext,
  assistantMessage,
  toolCalls,
  resolvedToolCalls,
  config,
  signal,
  emit,
) {
  const finalizedCalls = [];
  for (const toolCall of toolCalls) {
    const hideFromChannelProgress = hidesToolCallFromChannelProgress(
      currentContext,
      toolCall,
      resolvedToolCalls,
    );
    await emit({
      type: "tool_execution_start",
      toolCallId: toolCall.id,
      toolName: toolCall.name,
      args: toolCall.arguments,
      ...(hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
    });
    const preparation = await prepareToolCall(
      currentContext,
      assistantMessage,
      toolCall,
      config,
      signal,
      resolvedToolCalls,
    );
    if (preparation.kind === "immediate") {
      const finalized = {
        toolCall,
        result: preparation.result,
        isError: preparation.isError,
        executionStarted: false,
        ...(preparation.errorKind ? { errorKind: preparation.errorKind } : {}),
        ...(hideFromChannelProgress ? { hideFromChannelProgress: true } : {}),
      };
      await emitToolExecutionEnd(finalized, emit);
      finalizedCalls.push(finalized);
      if (signal?.aborted) break;
      continue;
    }
    finalizedCalls.push(async () => {
      const executed = await executePreparedToolCall(preparation, signal, emit);
      const finalized = await finalizeExecutedToolCall(
        currentContext,
        assistantMessage,
        preparation,
        executed,
        config,
        signal,
      );
      await emitToolExecutionEnd(finalized, emit);
      return finalized;
    });
    if (signal?.aborted) break;
  }
  const orderedFinalizedCalls = await Promise.all(
    finalizedCalls.map((entry) => (typeof entry === "function" ? entry() : Promise.resolve(entry))),
  );
  const messages = [];
  for (const finalized of orderedFinalizedCalls) {
    const toolResultMessage = createToolResultMessage(finalized);
    await emitToolResultMessage(toolResultMessage, emit);
    messages.push(toolResultMessage);
  }
  return {
    messages,
    terminate: shouldTerminateToolBatch(orderedFinalizedCalls),
  };
}
function shouldTerminateToolBatch(finalizedCalls) {
  return (
    finalizedCalls.length > 0 &&
    finalizedCalls.every((finalized) => finalized.result.terminate === true)
  );
}
function prepareToolCallArguments(tool, toolCall) {
  if (!tool.prepareArguments) return toolCall;
  const preparedArguments = tool.prepareArguments(toolCall.arguments);
  if (preparedArguments === toolCall.arguments) return toolCall;
  return {
    ...toolCall,
    arguments: preparedArguments,
  };
}
async function resolveToolCallTool(
  currentContext,
  assistantMessage,
  toolCall,
  config,
  signal,
  resolvedToolCalls,
) {
  const cached = resolvedToolCalls?.get(toolCall);
  if (cached) return cached;
  let resolution;
  try {
    let tool = currentContext.tools?.find((t) => t.name === toolCall.name);
    if (!tool) {
      const resolvedTool = await config.resolveDeferredTool?.(
        {
          assistantMessage,
          toolCall,
          context: currentContext,
        },
        signal,
      );
      if (resolvedTool && resolvedTool.name !== toolCall.name)
        throw new Error(
          `Deferred tool resolver returned "${resolvedTool.name}" for requested "${toolCall.name}"`,
        );
      tool = resolvedTool;
      if (tool) currentContext.tools = [...(currentContext.tools ?? []), tool];
    }
    resolution = {
      kind: "resolved",
      ...(tool ? { tool } : {}),
    };
  } catch (error) {
    resolution = {
      kind: "error",
      error,
    };
  }
  resolvedToolCalls?.set(toolCall, resolution);
  return resolution;
}
async function prepareToolCall(
  currentContext,
  assistantMessage,
  toolCall,
  config,
  signal,
  resolvedToolCalls,
) {
  const resolution = await resolveToolCallTool(
    currentContext,
    assistantMessage,
    toolCall,
    config,
    signal,
    resolvedToolCalls,
  );
  if (resolution.kind === "error")
    return {
      kind: "immediate",
      result: createErrorToolResult(
        signal?.aborted
          ? "Operation aborted"
          : resolution.error instanceof Error
            ? resolution.error.message
            : String(resolution.error),
      ),
      isError: true,
    };
  const tool = resolution.tool;
  if (!tool)
    return {
      kind: "immediate",
      result: createErrorToolResult(`Tool ${toolCall.name} not found`),
      isError: true,
    };
  let preparedToolCall;
  try {
    preparedToolCall = prepareToolCallArguments(tool, toolCall);
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true,
    };
  }
  let validatedArgs;
  try {
    validatedArgs = validateToolArguments(tool, preparedToolCall);
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true,
      errorKind: "argument-validation",
    };
  }
  try {
    if (config.beforeToolCall) {
      const beforeResult = await config.beforeToolCall(
        {
          assistantMessage,
          toolCall,
          args: validatedArgs,
          context: currentContext,
        },
        signal,
      );
      if (signal?.aborted)
        return {
          kind: "immediate",
          result: createErrorToolResult("Operation aborted"),
          isError: true,
        };
      if (beforeResult?.block)
        return {
          kind: "immediate",
          result: createErrorToolResult(beforeResult.reason || "Tool execution was blocked"),
          isError: true,
        };
    }
    if (signal?.aborted)
      return {
        kind: "immediate",
        result: createErrorToolResult("Operation aborted"),
        isError: true,
      };
    return {
      kind: "prepared",
      toolCall,
      tool,
      args: validatedArgs,
    };
  } catch (error) {
    return {
      kind: "immediate",
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true,
    };
  }
}
async function executePreparedToolCall(prepared, signal, emit) {
  if (signal?.aborted)
    return {
      result: createErrorToolResult("Operation aborted"),
      isError: true,
      executionStarted: false,
    };
  const updateEvents = [];
  let acceptingUpdates = true;
  try {
    const result = await prepared.tool.execute(
      prepared.toolCall.id,
      prepared.args,
      signal,
      (partialResult) => {
        if (!acceptingUpdates) return;
        updateEvents.push(
          Promise.resolve(
            emit({
              type: "tool_execution_update",
              toolCallId: prepared.toolCall.id,
              toolName: prepared.toolCall.name,
              args: prepared.toolCall.arguments,
              partialResult,
              ...(prepared.tool.hideFromChannelProgress === true
                ? { hideFromChannelProgress: true }
                : {}),
            }),
          ),
        );
      },
    );
    acceptingUpdates = false;
    await Promise.all(updateEvents);
    return {
      result,
      isError: false,
      executionStarted: true,
    };
  } catch (error) {
    acceptingUpdates = false;
    await Promise.all(updateEvents);
    return {
      result: createErrorToolResult(error instanceof Error ? error.message : String(error)),
      isError: true,
      executionStarted: true,
    };
  } finally {
    acceptingUpdates = false;
  }
}
async function finalizeExecutedToolCall(
  currentContext,
  assistantMessage,
  prepared,
  executed,
  config,
  signal,
) {
  let result = executed.result;
  let isError = executed.isError;
  if (executed.executionStarted && config.afterToolCall)
    try {
      const afterResult = await config.afterToolCall(
        {
          assistantMessage,
          toolCall: prepared.toolCall,
          args: prepared.args,
          result,
          isError,
          context: currentContext,
        },
        signal,
      );
      if (afterResult) {
        result = {
          content: afterResult.content ?? result.content,
          details: afterResult.details ?? result.details,
          terminate: afterResult.terminate ?? result.terminate,
        };
        isError = afterResult.isError ?? isError;
      }
    } catch (error) {
      result = createErrorToolResult(error instanceof Error ? error.message : String(error));
      isError = true;
    }
  return {
    toolCall: prepared.toolCall,
    result,
    isError,
    executionStarted: executed.executionStarted,
    ...(prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}),
  };
}
function createErrorToolResult(message) {
  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
    details: {},
  };
}
async function emitToolExecutionEnd(finalized, emit) {
  await emit({
    type: "tool_execution_end",
    toolCallId: finalized.toolCall.id,
    toolName: finalized.toolCall.name,
    result: finalized.result,
    isError: finalized.isError,
    executionStarted: finalized.executionStarted,
    ...(finalized.errorKind ? { errorKind: finalized.errorKind } : {}),
    ...(finalized.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}),
  });
}
function createToolResultMessage(finalized) {
  return {
    role: "toolResult",
    toolCallId: finalized.toolCall.id,
    toolName: finalized.toolCall.name,
    content: finalized.result.content,
    details: finalized.result.details,
    isError: finalized.isError,
    timestamp: Date.now(),
  };
}
async function emitToolResultMessage(toolResultMessage, emit) {
  await emit({
    type: "message_start",
    message: toolResultMessage,
  });
  await emit({
    type: "message_end",
    message: toolResultMessage,
  });
}
//#endregion
//#region packages/agent-core/src/agent.ts
function defaultConvertToLlm(messages) {
  return messages.filter(
    (message) =>
      message.role === "user" || message.role === "assistant" || message.role === "toolResult",
  );
}
const DEFAULT_MODEL = {
  id: "unknown",
  name: "unknown",
  api: "unknown",
  provider: "unknown",
  baseUrl: "",
  reasoning: false,
  input: [],
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
  },
  contextWindow: 0,
  maxTokens: 0,
};
function createMutableAgentState(initialState) {
  let tools = initialState?.tools?.slice() ?? [];
  let messages = initialState?.messages?.slice() ?? [];
  return {
    systemPrompt: initialState?.systemPrompt ?? "",
    model: initialState?.model ?? DEFAULT_MODEL,
    thinkingLevel: initialState?.thinkingLevel ?? "off",
    get tools() {
      return tools;
    },
    set tools(nextTools) {
      tools = nextTools.slice();
    },
    get messages() {
      return messages;
    },
    set messages(nextMessages) {
      messages = nextMessages.slice();
    },
    isStreaming: false,
    streamingMessage: void 0,
    pendingToolCalls: /* @__PURE__ */ new Set(),
    errorMessage: void 0,
  };
}
var PendingMessageQueue = class {
  constructor(mode) {
    this.messages = [];
    this.mode = mode;
  }
  enqueue(message) {
    this.messages.push(message);
  }
  hasItems() {
    return this.messages.length > 0;
  }
  drain() {
    if (this.mode === "all") {
      const drained = this.messages.slice();
      this.messages = [];
      return drained;
    }
    const first = this.messages[0];
    if (!first) return [];
    this.messages = this.messages.slice(1);
    return [first];
  }
  clear() {
    this.messages = [];
  }
};
/**
 * Stateful wrapper around the low-level agent loop.
 *
 * `Agent` owns the current transcript, emits lifecycle events, executes tools,
 * and exposes queueing APIs for steering and follow-up messages.
 */
var Agent$1 = class {
  constructor(options = {}) {
    this.listeners = /* @__PURE__ */ new Set();
    this.mutableState = createMutableAgentState(options.initialState);
    this.convertToLlm = options.convertToLlm ?? defaultConvertToLlm;
    this.transformContext = options.transformContext;
    this.runtime = options.runtime;
    this.streamFn = resolveAgentCoreStreamFn(options.runtime, options.streamFn);
    this.getApiKey = options.getApiKey;
    this.onPayload = options.onPayload;
    this.onResponse = options.onResponse;
    this.beforeToolCall = options.beforeToolCall;
    this.resolveDeferredTool = options.resolveDeferredTool;
    this.afterToolCall = options.afterToolCall;
    this.prepareNextTurn = options.prepareNextTurn;
    this.steeringQueue = new PendingMessageQueue(options.steeringMode ?? "one-at-a-time");
    this.followUpQueue = new PendingMessageQueue(options.followUpMode ?? "one-at-a-time");
    this.sessionId = options.sessionId;
    this.thinkingBudgets = options.thinkingBudgets;
    this.transport = options.transport ?? "auto";
    this.maxRetryDelayMs = options.maxRetryDelayMs;
    this.toolExecution = options.toolExecution ?? "parallel";
  }
  /**
   * Subscribe to agent lifecycle events.
   *
   * Listener promises are awaited in subscription order and are included in
   * the current run's settlement. Listeners also receive the active abort
   * signal for the current run.
   *
   * `agent_end` is the final emitted event for a run, but the agent does not
   * become idle until all awaited listeners for that event have settled.
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  /**
   * Current agent state.
   *
   * Assigning `state.tools` or `state.messages` copies the provided top-level array.
   */
  get state() {
    return this.mutableState;
  }
  /** Controls how queued steering messages are drained. */
  set steeringMode(mode) {
    this.steeringQueue.mode = mode;
  }
  get steeringMode() {
    return this.steeringQueue.mode;
  }
  /** Controls how queued follow-up messages are drained. */
  set followUpMode(mode) {
    this.followUpQueue.mode = mode;
  }
  get followUpMode() {
    return this.followUpQueue.mode;
  }
  /** Queue a message to be injected after the current assistant turn finishes. */
  steer(message) {
    this.steeringQueue.enqueue(message);
  }
  /** Queue a message to run only after the agent would otherwise stop. */
  followUp(message) {
    this.followUpQueue.enqueue(message);
  }
  /** Remove all queued steering messages. */
  clearSteeringQueue() {
    this.steeringQueue.clear();
  }
  /** Remove all queued follow-up messages. */
  clearFollowUpQueue() {
    this.followUpQueue.clear();
  }
  /** Remove all queued steering and follow-up messages. */
  clearAllQueues() {
    this.clearSteeringQueue();
    this.clearFollowUpQueue();
  }
  /** Returns true when either queue still contains pending messages. */
  hasQueuedMessages() {
    return this.steeringQueue.hasItems() || this.followUpQueue.hasItems();
  }
  /** Active abort signal for the current run, if any. */
  get signal() {
    return this.activeRun?.abortController.signal;
  }
  /** Abort the current run, if one is active. */
  abort(reason) {
    this.activeRun?.abortController.abort(reason);
  }
  /**
   * Resolve when the current run and all awaited event listeners have finished.
   *
   * This resolves after `agent_end` listeners settle.
   */
  waitForIdle() {
    return this.activeRun?.promise ?? Promise.resolve();
  }
  /** Clear transcript state, runtime state, and queued messages. */
  reset() {
    this.mutableState.messages = [];
    this.mutableState.isStreaming = false;
    this.mutableState.streamingMessage = void 0;
    this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
    this.mutableState.errorMessage = void 0;
    this.clearFollowUpQueue();
    this.clearSteeringQueue();
  }
  async prompt(input, images) {
    if (this.activeRun)
      throw new Error(
        "Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.",
      );
    const messages = this.normalizePromptInput(input, images);
    await this.runPromptMessages(messages);
  }
  /** Continue from the current transcript. The last message must be a user or tool-result message. */
  async continue() {
    if (this.activeRun)
      throw new Error("Agent is already processing. Wait for completion before continuing.");
    const lastMessage = this.mutableState.messages[this.mutableState.messages.length - 1];
    if (!lastMessage) throw new Error("No messages to continue from");
    if (lastMessage.role === "assistant") {
      const queuedSteering = this.steeringQueue.drain();
      if (queuedSteering.length > 0) {
        await this.runPromptMessages(queuedSteering, { skipInitialSteeringPoll: true });
        return;
      }
      const queuedFollowUps = this.followUpQueue.drain();
      if (queuedFollowUps.length > 0) {
        await this.runPromptMessages(queuedFollowUps);
        return;
      }
      throw new TranscriptNotContinuableError(lastMessage.role);
    }
    await this.runContinuation();
  }
  normalizePromptInput(input, images) {
    if (Array.isArray(input)) return input;
    if (typeof input !== "string") return [input];
    const content = [
      {
        type: "text",
        text: input,
      },
    ];
    if (images && images.length > 0) content.push(...images);
    return [
      {
        role: "user",
        content,
        timestamp: Date.now(),
      },
    ];
  }
  async runPromptMessages(messages, options = {}) {
    await this.runWithLifecycle(async (signal) => {
      await runAgentLoop(
        messages,
        this.createContextSnapshot(),
        this.createLoopConfig(options),
        (event) => this.processEvents(event),
        signal,
        this.streamFn,
      );
    });
  }
  async runContinuation() {
    await this.runWithLifecycle(async (signal) => {
      await runAgentLoopContinue(
        this.createContextSnapshot(),
        this.createLoopConfig(),
        (event) => this.processEvents(event),
        signal,
        this.streamFn,
      );
    });
  }
  createContextSnapshot() {
    return {
      systemPrompt: this.mutableState.systemPrompt,
      messages: this.mutableState.messages.slice(),
      tools: this.mutableState.tools.slice(),
    };
  }
  createLoopConfig(options = {}) {
    let skipInitialSteeringPoll = options.skipInitialSteeringPoll === true;
    return {
      model: this.mutableState.model,
      thinkingLevel: this.mutableState.thinkingLevel,
      reasoning: resolveAgentReasoningOption(
        this.mutableState.model,
        this.mutableState.thinkingLevel,
      ),
      sessionId: this.sessionId,
      onPayload: this.onPayload,
      onResponse: this.onResponse,
      transport: this.transport,
      thinkingBudgets: this.thinkingBudgets,
      maxRetryDelayMs: this.maxRetryDelayMs,
      toolExecution: this.toolExecution,
      beforeToolCall: this.beforeToolCall,
      resolveDeferredTool: this.resolveDeferredTool,
      afterToolCall: this.afterToolCall,
      prepareNextTurn: this.prepareNextTurn
        ? async () => await this.prepareNextTurn?.(this.signal)
        : void 0,
      convertToLlm: this.convertToLlm,
      transformContext: this.transformContext,
      getApiKey: this.getApiKey,
      getSteeringMessages: async () => {
        if (skipInitialSteeringPoll) {
          skipInitialSteeringPoll = false;
          return [];
        }
        return this.steeringQueue.drain();
      },
      getFollowUpMessages: async () => this.followUpQueue.drain(),
    };
  }
  async runWithLifecycle(executor) {
    if (this.activeRun) throw new Error("Agent is already processing.");
    const abortController = new AbortController();
    let resolvePromise = () => {};
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    this.activeRun = {
      promise,
      resolve: resolvePromise,
      abortController,
    };
    this.mutableState.isStreaming = true;
    this.mutableState.streamingMessage = void 0;
    this.mutableState.errorMessage = void 0;
    try {
      await executor(abortController.signal);
    } catch (error) {
      await this.handleRunFailure(error, abortController.signal.aborted);
    } finally {
      this.finishRun();
    }
  }
  async handleRunFailure(error, aborted) {
    const failureMessage = createFailureMessage(this.mutableState.model, error, aborted);
    await this.processEvents({
      type: "message_start",
      message: failureMessage,
    });
    await this.processEvents({
      type: "message_end",
      message: failureMessage,
    });
    await this.processEvents({
      type: "turn_end",
      message: failureMessage,
      toolResults: [],
    });
    const messages = [failureMessage];
    if (aborted && !isTurnHandoffAbort(this.signal))
      await appendInterruptedTurnMessage(messages, (event) => this.processEvents(event));
    await this.processEvents({
      type: "agent_end",
      messages,
    });
  }
  finishRun() {
    this.mutableState.isStreaming = false;
    this.mutableState.streamingMessage = void 0;
    this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
    this.activeRun?.resolve();
    this.activeRun = void 0;
  }
  /**
   * Reduce internal state for a loop event, then await listeners.
   *
   * `agent_end` only means no further loop events will be emitted. The run is
   * considered idle later, after all awaited listeners for `agent_end` finish
   * and `finishRun()` clears runtime-owned state.
   */
  async processEvents(event) {
    switch (event.type) {
      case "agent_start":
      case "turn_start":
      case "tool_execution_update":
        break;
      case "message_start":
        this.mutableState.streamingMessage = event.message;
        break;
      case "message_update":
        this.mutableState.streamingMessage = event.message;
        break;
      case "message_end":
        this.mutableState.streamingMessage = void 0;
        this.mutableState.messages.push(event.message);
        break;
      case "tool_execution_start": {
        const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
        pendingToolCalls.add(event.toolCallId);
        this.mutableState.pendingToolCalls = pendingToolCalls;
        break;
      }
      case "tool_execution_end": {
        const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
        pendingToolCalls.delete(event.toolCallId);
        this.mutableState.pendingToolCalls = pendingToolCalls;
        break;
      }
      case "turn_end":
        if (event.message.role === "assistant" && event.message.errorMessage)
          this.mutableState.errorMessage = event.message.errorMessage;
        break;
      case "agent_end":
        this.mutableState.streamingMessage = void 0;
        break;
    }
    const signal = this.activeRun?.abortController.signal;
    if (!signal) throw new Error("Agent listener invoked outside active run");
    for (const listener of this.listeners) await listener(event, signal);
  }
};
//#endregion
//#region packages/agent-core/src/harness/types.ts
/**
 * @deprecated Use `toErrorObject` from `@openclaw/normalization-core/error-coercion`.
 * Kept through the next major release for the shipped agent-core plugin API.
 */
function toError(error) {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);
  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error(String(error));
  }
}
/** Error returned by {@link FileSystem} file operations. */
var FileError = class extends Error {
  constructor(code, message, path, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "FileError";
    this.code = code;
    this.path = path;
  }
};
/** Error returned by {@link ExecutionEnv.exec}. */
var ExecutionError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "ExecutionError";
    this.code = code;
  }
};
/** Error returned by compaction helpers. */
var CompactionError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "CompactionError";
    this.code = code;
  }
};
/** Error returned by branch summarization helpers. */
var BranchSummaryError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "BranchSummaryError";
    this.code = code;
  }
};
/** Error thrown by session storage, repositories, and session tree operations. */
var SessionError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "SessionError";
    this.code = code;
  }
};
/** Public AgentHarness failure with a stable top-level classification. */
var AgentHarnessError = class extends Error {
  constructor(code, message, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.name = "AgentHarnessError";
    this.code = code;
  }
};
//#endregion
//#region packages/agent-core/src/harness/env/nodejs.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function resolvePath(cwd, path) {
  return isAbsolute(path) ? path : resolve(cwd, path);
}
/** Convert user-facing timeout seconds into a positive, timer-safe millisecond delay. */
function resolveExecTimeoutMs(timeoutSeconds) {
  if (typeof timeoutSeconds !== "number" || !Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0)
    return;
  const milliseconds = Math.floor(timeoutSeconds * 1e3);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return 1;
  return Math.min(milliseconds, MAX_TIMER_TIMEOUT_MS);
}
function fileKindFromStats(stats) {
  if (stats.isFile()) return "file";
  if (stats.isDirectory()) return "directory";
  if (stats.isSymbolicLink()) return "symlink";
}
function fileInfoFromStats(path, stats) {
  const kind = fileKindFromStats(stats);
  if (!kind) return err(new FileError("invalid", "Unsupported file type", path));
  return ok({
    name: basename(path),
    path,
    kind,
    size: stats.size,
    mtimeMs: stats.mtimeMs,
  });
}
function isNodeError(error) {
  return error instanceof Error && "code" in error;
}
function toFileError(error, path) {
  if (error instanceof FileError) return error;
  const cause = toErrorObject(error, "Non-Error thrown");
  if (isNodeError(error)) {
    const message = error.message;
    switch (error.code) {
      case "ABORT_ERR":
        return new FileError("aborted", message, path, cause);
      case "ENOENT":
        return new FileError("not_found", message, path, cause);
      case "EACCES":
      case "EPERM":
        return new FileError("permission_denied", message, path, cause);
      case "ENOTDIR":
        return new FileError("not_directory", message, path, cause);
      case "EISDIR":
        return new FileError("is_directory", message, path, cause);
      case "EINVAL":
        return new FileError("invalid", message, path, cause);
      default:
        break;
    }
  }
  return new FileError("unknown", cause.message, path, cause);
}
function abortResult(signal, path) {
  return signal?.aborted ? err(new FileError("aborted", "aborted", path)) : void 0;
}
function listenForChildOutputErrors(child, onError) {
  for (const streamName of ["stdout", "stderr"])
    child[streamName]?.on("error", (error) => onError(streamName, error));
}
async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
async function runCommand(command, args, timeoutMs) {
  return await new Promise((resolveLocal) => {
    let stdout = "";
    let child;
    try {
      child = spawn(command, args, {
        stdio: ["ignore", "pipe", "ignore"],
        windowsHide: true,
      });
    } catch {
      resolveLocal({
        stdout: "",
        status: null,
      });
      return;
    }
    const timeout = setTimeout(() => {
      if (child.pid)
        killProcessTree(child.pid, {
          force: true,
          detached: false,
        });
    }, timeoutMs);
    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    listenForChildOutputErrors(child, () => {
      if (child.pid)
        killProcessTree(child.pid, {
          force: true,
          detached: false,
        });
      clearTimeout(timeout);
      resolveLocal({
        stdout: "",
        status: null,
      });
    });
    child.on("error", () => {
      clearTimeout(timeout);
      resolveLocal({
        stdout: "",
        status: null,
      });
    });
    child.on("close", (status) => {
      clearTimeout(timeout);
      resolveLocal({
        stdout,
        status,
      });
    });
  });
}
async function findBashOnPath() {
  const result =
    process.platform === "win32"
      ? await runCommand("where", ["bash.exe"], 5e3)
      : await runCommand("which", ["bash"], 5e3);
  if (result.status !== 0 || !result.stdout) return null;
  const firstMatch = result.stdout.trim().split(/\r?\n/)[0];
  return firstMatch && (await pathExists(firstMatch)) ? firstMatch : null;
}
async function getShellConfig(customShellPath) {
  if (customShellPath) {
    if (await pathExists(customShellPath))
      return ok({
        shell: customShellPath,
        args: ["-c"],
      });
    return err(
      new ExecutionError("shell_unavailable", `Custom shell path not found: ${customShellPath}`),
    );
  }
  if (process.platform === "win32") {
    const candidates = [];
    const programFiles = process.env.ProgramFiles;
    if (programFiles) candidates.push(`${programFiles}\\Git\\bin\\bash.exe`);
    const programFilesX86 = process.env["ProgramFiles(x86)"];
    if (programFilesX86) candidates.push(`${programFilesX86}\\Git\\bin\\bash.exe`);
    for (const candidate of candidates)
      if (await pathExists(candidate))
        return ok({
          shell: candidate,
          args: ["-c"],
        });
    const bashOnPath = await findBashOnPath();
    if (bashOnPath)
      return ok({
        shell: bashOnPath,
        args: ["-c"],
      });
    return err(new ExecutionError("shell_unavailable", "No bash shell found"));
  }
  if (await pathExists("/bin/bash"))
    return ok({
      shell: "/bin/bash",
      args: ["-c"],
    });
  const bashOnPath = await findBashOnPath();
  if (bashOnPath)
    return ok({
      shell: bashOnPath,
      args: ["-c"],
    });
  return ok({
    shell: "sh",
    args: ["-c"],
  });
}
function getShellEnv(baseEnv, extraEnv) {
  return {
    ...process.env,
    ...baseEnv,
    ...extraEnv,
  };
}
/** Node-backed execution environment for agent harness filesystem and shell operations. */
var NodeExecutionEnv = class {
  constructor(options) {
    this.cwd = options.cwd;
    this.shellPath = options.shellPath;
    this.shellEnv = options.shellEnv;
  }
  async absolutePath(path) {
    return ok(resolvePath(this.cwd, path));
  }
  async joinPath(parts) {
    return ok(join(...parts));
  }
  async exec(command, options) {
    if (options?.abortSignal?.aborted) return err(new ExecutionError("aborted", "aborted"));
    const cwd = options?.cwd ? resolvePath(this.cwd, options.cwd) : this.cwd;
    const shellConfig = await getShellConfig(this.shellPath);
    if (!shellConfig.ok) return shellConfig;
    return await new Promise((resolvePromise) => {
      let stdout = "";
      let stderr = "";
      let settled = false;
      let timedOut = false;
      let callbackError;
      let child;
      const timeoutRef = {};
      const onAbort = () => {
        if (child?.pid) killProcessTree(child.pid, { force: true });
      };
      const settle = (result) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (options?.abortSignal) options.abortSignal.removeEventListener("abort", onAbort);
        if (settled) return;
        settled = true;
        resolvePromise(result);
      };
      try {
        child = spawn(shellConfig.value.shell, [...shellConfig.value.args, command], {
          cwd,
          detached: process.platform !== "win32",
          env: getShellEnv(this.shellEnv, options?.env),
          stdio: ["ignore", "pipe", "pipe"],
          windowsHide: true,
        });
      } catch (error) {
        const cause = toErrorObject(error, "Non-Error thrown");
        settle(err(new ExecutionError("spawn_error", cause.message, cause)));
        return;
      }
      const timeoutMs = resolveExecTimeoutMs(options?.timeout);
      timeoutRef.current =
        timeoutMs === void 0
          ? void 0
          : setTimeout(() => {
              timedOut = true;
              if (child?.pid) killProcessTree(child.pid, { force: true });
            }, timeoutMs);
      if (options?.abortSignal)
        if (options.abortSignal.aborted) onAbort();
        else options.abortSignal.addEventListener("abort", onAbort, { once: true });
      child.stdout?.setEncoding("utf8");
      child.stderr?.setEncoding("utf8");
      child.stdout?.on("data", (chunk) => {
        stdout += chunk;
        try {
          options?.onStdout?.(chunk);
        } catch (error) {
          const cause = toErrorObject(error, "Non-Error thrown");
          callbackError = new ExecutionError("callback_error", cause.message, cause);
          onAbort();
        }
      });
      child.stderr?.on("data", (chunk) => {
        stderr += chunk;
        try {
          options?.onStderr?.(chunk);
        } catch (error) {
          const cause = toErrorObject(error, "Non-Error thrown");
          callbackError = new ExecutionError("callback_error", cause.message, cause);
          onAbort();
        }
      });
      const onStreamError = (stream, error) => {
        if (settled) return;
        onAbort();
        settle(
          err(new ExecutionError("spawn_error", `${stream} read error: ${error.message}`, error)),
        );
      };
      listenForChildOutputErrors(child, onStreamError);
      child.on("error", (error) => {
        settle(err(new ExecutionError("spawn_error", error.message, error)));
      });
      child.on("close", (code) => {
        if (callbackError) {
          settle(err(callbackError));
          return;
        }
        if (timedOut) {
          settle(err(new ExecutionError("timeout", `timeout:${options?.timeout}`)));
          return;
        }
        if (options?.abortSignal?.aborted) {
          settle(err(new ExecutionError("aborted", "aborted")));
          return;
        }
        settle(
          ok({
            stdout,
            stderr,
            exitCode: code ?? 0,
          }),
        );
      });
    });
  }
  async readTextFile(path, abortSignal) {
    const resolved = resolvePath(this.cwd, path);
    const aborted = abortResult(abortSignal, resolved);
    if (aborted) return aborted;
    try {
      return ok(
        await readFile(resolved, {
          encoding: "utf8",
          signal: abortSignal,
        }),
      );
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async readTextLines(path, options) {
    const resolved = resolvePath(this.cwd, path);
    const aborted = abortResult(options?.abortSignal, resolved);
    if (aborted) return aborted;
    if (options?.maxLines !== void 0 && options.maxLines <= 0) return ok([]);
    let stream;
    let lineReader;
    try {
      stream = createReadStream(resolved, {
        encoding: "utf8",
        signal: options?.abortSignal,
      });
      lineReader = createInterface({
        input: stream,
        crlfDelay: Infinity,
      });
      const lines = [];
      for await (const line of lineReader) {
        const loopAbort = abortResult(options?.abortSignal, resolved);
        if (loopAbort) return loopAbort;
        lines.push(line);
        if (options?.maxLines !== void 0 && lines.length >= options.maxLines) break;
      }
      const afterReadAbort = abortResult(options?.abortSignal, resolved);
      if (afterReadAbort) return afterReadAbort;
      return ok(lines);
    } catch (error) {
      return err(toFileError(error, resolved));
    } finally {
      lineReader?.close();
      stream?.destroy();
    }
  }
  async readBinaryFile(path, abortSignal) {
    const resolved = resolvePath(this.cwd, path);
    const aborted = abortResult(abortSignal, resolved);
    if (aborted) return aborted;
    try {
      return ok(await readFile(resolved, { signal: abortSignal }));
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async writeFile(path, content, abortSignal) {
    const resolved = resolvePath(this.cwd, path);
    const aborted = abortResult(abortSignal, resolved);
    if (aborted) return aborted;
    try {
      await mkdir(resolve(resolved, ".."), { recursive: true });
      const afterMkdirAbort = abortResult(abortSignal, resolved);
      if (afterMkdirAbort) return afterMkdirAbort;
      await writeFile(resolved, content, { signal: abortSignal });
      return ok(void 0);
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async appendFile(path, content) {
    const resolved = resolvePath(this.cwd, path);
    try {
      await mkdir(resolve(resolved, ".."), { recursive: true });
      await appendFile(resolved, content);
      return ok(void 0);
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async fileInfo(path) {
    const resolved = resolvePath(this.cwd, path);
    try {
      return fileInfoFromStats(resolved, await lstat(resolved));
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async listDir(path, abortSignal) {
    const resolved = resolvePath(this.cwd, path);
    const aborted = abortResult(abortSignal, resolved);
    if (aborted) return aborted;
    try {
      const entries = await readdir(resolved, { withFileTypes: true });
      const infos = [];
      for (const entry of entries) {
        const loopAbort = abortResult(abortSignal, resolved);
        if (loopAbort) return loopAbort;
        const entryPath = resolve(resolved, entry.name);
        try {
          const info = fileInfoFromStats(entryPath, await lstat(entryPath));
          if (info.ok) infos.push(info.value);
        } catch (error) {
          return err(toFileError(error, entryPath));
        }
      }
      return ok(infos);
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async canonicalPath(path) {
    const resolved = resolvePath(this.cwd, path);
    try {
      return ok(await realpath(resolved));
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async exists(path) {
    const result = await this.fileInfo(path);
    if (result.ok) return ok(true);
    if (result.error.code === "not_found") return ok(false);
    return err(result.error);
  }
  async createDir(path, options) {
    const resolved = resolvePath(this.cwd, path);
    try {
      await mkdir(resolved, { recursive: options?.recursive ?? true });
      return ok(void 0);
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async remove(path, options) {
    const resolved = resolvePath(this.cwd, path);
    try {
      await rm(resolved, {
        recursive: options?.recursive ?? false,
        force: options?.force ?? false,
      });
      return ok(void 0);
    } catch (error) {
      return err(toFileError(error, resolved));
    }
  }
  async createTempDir(prefix = "tmp-") {
    try {
      return ok(await mkdtemp(join(tmpdir(), prefix)));
    } catch (error) {
      return err(toFileError(error));
    }
  }
  async createTempFile(options) {
    const dir = await this.createTempDir("tmp-");
    if (!dir.ok) return dir;
    const filePath = join(
      dir.value,
      `${options?.prefix ?? ""}${randomUUID()}${options?.suffix ?? ""}`,
    );
    try {
      await writeFile(filePath, "");
      return ok(filePath);
    } catch (error) {
      return err(toFileError(error, filePath));
    }
  }
  async cleanup() {}
};
//#endregion
//#region packages/agent-core/src/harness/session/timestamps.ts
/** Parse an ISO-like session timestamp to milliseconds. */
function parseSessionTimestampMs(value) {
  if (typeof value !== "string" || !value.trim()) return;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
/** Parse a required timestamp or throw a labeled validation error. */
function requireSessionTimestampMs(value, label) {
  const parsed = parseSessionTimestampMs(value);
  if (parsed === void 0) throw new Error(`${label} must be a valid timestamp`);
  return parsed;
}
//#endregion
//#region packages/agent-core/src/harness/messages.ts
function asAgentMessage(message) {
  return message;
}
function normalizeCompactionSummaryTimestamp(timestamp) {
  if (typeof timestamp === "number") return timestamp;
  return parseSessionTimestampMs(timestamp) ?? 0;
}
const COMPACTION_SUMMARY_PREFIX = `The conversation history before this point was compacted into the following summary:

<summary>
`;
const COMPACTION_SUMMARY_SUFFIX = `
</summary>`;
const BRANCH_SUMMARY_PREFIX = `The following is a summary of a branch that this conversation came back from:

<summary>
`;
const BRANCH_SUMMARY_SUFFIX = `</summary>`;
/** Render a shell execution record as user-visible context text for the model. */
function bashExecutionToText(msg) {
  let text = `Ran \`${msg.command}\`\n`;
  if (msg.output) text += `\`\`\`\n${msg.output}\n\`\`\``;
  else text += "(no output)";
  if (msg.cancelled) text += "\n\n(command cancelled)";
  else if (msg.exitCode !== null && msg.exitCode !== void 0 && msg.exitCode !== 0)
    text += `\n\nCommand exited with code ${msg.exitCode}`;
  if (msg.truncated && msg.fullOutputPath)
    text += `\n\n[Output truncated. Full output: ${msg.fullOutputPath}]`;
  return text;
}
/** Build a persisted branch summary message from the repository timestamp string. */
function createBranchSummaryMessage(summary, fromId, timestamp) {
  return {
    role: "branchSummary",
    summary,
    fromId,
    timestamp: requireSessionTimestampMs(timestamp, "branch summary timestamp"),
  };
}
/** Build a persisted compaction summary message from the repository timestamp string. */
function createCompactionSummaryMessage(summary, tokensBefore, timestamp) {
  return {
    role: "compactionSummary",
    summary,
    tokensBefore,
    timestamp: requireSessionTimestampMs(timestamp, "compaction summary timestamp"),
  };
}
/** Build a custom transcript message that can be shown and replayed into context. */
function createCustomMessage(customType, content, display, details, timestamp) {
  return {
    role: "custom",
    customType,
    content,
    display,
    details,
    timestamp: requireSessionTimestampMs(timestamp, "custom message timestamp"),
  };
}
/** Convert harness transcript messages into the LLM-facing message sequence. */
function convertToLlm(messages) {
  return messages
    .map((m) => {
      const message = m;
      switch (message.role) {
        case "bashExecution":
          if (message.excludeFromContext) return;
          return {
            role: "user",
            content: [
              {
                type: "text",
                text: bashExecutionToText(message),
              },
            ],
            timestamp: message.timestamp,
          };
        case "custom": {
          const content =
            typeof message.content === "string"
              ? [
                  {
                    type: "text",
                    text: message.content,
                  },
                ]
              : message.content;
          const runtimeContextCarrier = message.details?.runtimeContextCarrier === true;
          return {
            role: "user",
            content,
            timestamp: message.timestamp,
            ...(runtimeContextCarrier ? { runtimeContextCarrier: true } : {}),
          };
        }
        case "branchSummary":
          return {
            role: "user",
            content: [
              {
                type: "text",
                text: BRANCH_SUMMARY_PREFIX + message.summary + BRANCH_SUMMARY_SUFFIX,
              },
            ],
            timestamp: message.timestamp,
          };
        case "compactionSummary":
          return {
            role: "user",
            content: [
              {
                type: "text",
                text: COMPACTION_SUMMARY_PREFIX + message.summary + COMPACTION_SUMMARY_SUFFIX,
              },
            ],
            timestamp: normalizeCompactionSummaryTimestamp(message.timestamp),
          };
        case "user":
        case "assistant":
        case "toolResult":
          return message;
        default:
          return;
      }
    })
    .filter((m) => m !== void 0);
}
//#endregion
//#region packages/agent-core/src/harness/session/session.ts
/** Build model context from the active session branch and its latest state markers. */
function buildSessionContext(pathEntries) {
  let thinkingLevel = "off";
  let model = null;
  let compaction = null;
  for (const entry of pathEntries)
    if (entry.type === "thinking_level_change") thinkingLevel = entry.thinkingLevel;
    else if (entry.type === "model_change")
      model = {
        provider: entry.provider,
        modelId: entry.modelId,
      };
    else if (entry.type === "message" && entry.message.role === "assistant")
      model = {
        provider: entry.message.provider,
        modelId: entry.message.model,
      };
    else if (entry.type === "compaction") compaction = entry;
  const messages = [];
  const appendMessage = (entry) => {
    if (entry.type === "message") messages.push(entry.message);
    else if (entry.type === "custom_message")
      messages.push(
        asAgentMessage(
          createCustomMessage(
            entry.customType,
            entry.content,
            entry.display,
            entry.details,
            entry.timestamp,
          ),
        ),
      );
    else if (entry.type === "branch_summary" && entry.summary)
      messages.push(
        asAgentMessage(createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp)),
      );
  };
  if (compaction) {
    messages.push(
      asAgentMessage(
        createCompactionSummaryMessage(
          compaction.summary,
          compaction.tokensBefore,
          compaction.timestamp,
        ),
      ),
    );
    const compactionIdx = pathEntries.findIndex(
      (e) => e.type === "compaction" && e.id === compaction.id,
    );
    let foundFirstKept = false;
    for (const entry of pathEntries.slice(0, compactionIdx)) {
      if (entry.id === compaction.firstKeptEntryId) foundFirstKept = true;
      if (foundFirstKept) appendMessage(entry);
    }
    for (const entry of pathEntries.slice(compactionIdx + 1)) appendMessage(entry);
  } else for (const entry of pathEntries) appendMessage(entry);
  return {
    messages,
    thinkingLevel,
    model,
  };
}
/** High-level session API backed by pluggable tree storage. */
var Session = class {
  constructor(storage) {
    this.storage = storage;
  }
  getMetadata() {
    return this.storage.getMetadata();
  }
  getStorage() {
    return this.storage;
  }
  getLeafId() {
    return this.storage.getLeafId();
  }
  getAppendParentId() {
    return this.storage.getAppendParentId?.() ?? this.storage.getLeafId();
  }
  getEntry(id) {
    return this.storage.getEntry(id);
  }
  getEntries() {
    return this.storage.getEntries();
  }
  async getBranch(fromId) {
    const leafId = fromId ?? (await this.storage.getLeafId());
    return this.storage.getPathToRoot(leafId);
  }
  async buildContext() {
    return buildSessionContext(await this.getBranch());
  }
  getLabel(id) {
    return this.storage.getLabel(id);
  }
  async getSessionName() {
    const entries = await this.storage.findEntries("session_info");
    return entries[entries.length - 1]?.name?.trim() || void 0;
  }
  async appendTypedEntry(entry) {
    await this.storage.appendEntry(entry);
    return entry.id;
  }
  async appendMessage(message) {
    return this.appendTypedEntry({
      type: "message",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      message,
    });
  }
  async appendThinkingLevelChange(thinkingLevel) {
    return this.appendTypedEntry({
      type: "thinking_level_change",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      thinkingLevel,
    });
  }
  async appendModelChange(provider, modelId) {
    return this.appendTypedEntry({
      type: "model_change",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      provider,
      modelId,
    });
  }
  async appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook) {
    return this.appendTypedEntry({
      type: "compaction",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      summary,
      firstKeptEntryId,
      tokensBefore,
      details,
      fromHook,
    });
  }
  /** Append a non-LLM transcript marker for harness-specific state. */
  async appendCustomEntry(customType, data) {
    return this.appendTypedEntry({
      type: "custom",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      customType,
      data,
    });
  }
  /** Append harness-specific content that can also be replayed into model context. */
  async appendCustomMessageEntry(customType, content, display, details) {
    return this.appendTypedEntry({
      type: "custom_message",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      customType,
      content,
      display,
      details,
    });
  }
  /** Record or clear the display label for an existing session entry. */
  async appendLabel(targetId, label) {
    if (!(await this.storage.getEntry(targetId)))
      throw new SessionError("not_found", `Entry ${targetId} not found`);
    return this.appendTypedEntry({
      type: "label",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      targetId,
      label,
    });
  }
  async appendSessionName(name) {
    return this.appendTypedEntry({
      type: "session_info",
      id: await this.storage.createEntryId(),
      parentId: await this.getAppendParentId(),
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      name: name.trim(),
    });
  }
  /** Move the visible branch leaf and optionally attach a summary of the abandoned branch. */
  async moveTo(entryId, summary) {
    if (entryId !== null && !(await this.storage.getEntry(entryId)))
      throw new SessionError("not_found", `Entry ${entryId} not found`);
    await this.storage.setLeafId(entryId);
    if (!summary) return;
    return this.appendTypedEntry({
      type: "branch_summary",
      id: await this.storage.createEntryId(),
      parentId: entryId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      fromId: entryId ?? "root",
      summary: summary.summary,
      details: summary.details,
      fromHook: summary.fromHook,
    });
  }
};
//#endregion
//#region packages/agent-core/src/harness/compaction/utils.ts
/** Create an empty file-operation accumulator. */
function createFileOps() {
  return {
    read: /* @__PURE__ */ new Set(),
    written: /* @__PURE__ */ new Set(),
    edited: /* @__PURE__ */ new Set(),
  };
}
/** Add file operations from assistant tool calls to an accumulator. */
function extractFileOpsFromMessage(message, fileOps) {
  if (message.role !== "assistant") return;
  if (!("content" in message) || !Array.isArray(message.content)) return;
  for (const block of message.content) {
    if (typeof block !== "object" || block === null) continue;
    if (!("type" in block) || block.type !== "toolCall") continue;
    if (!("arguments" in block) || !("name" in block)) continue;
    const args = block.arguments;
    if (!args) continue;
    const path = typeof args.path === "string" ? args.path : void 0;
    if (!path) continue;
    switch (block.name) {
      case "read":
        fileOps.read.add(path);
        break;
      case "write":
        fileOps.written.add(path);
        break;
      case "edit":
        fileOps.edited.add(path);
        break;
    }
  }
}
/** Compute sorted read-only and modified file lists from accumulated operations. */
function computeFileLists(fileOps) {
  const modified = /* @__PURE__ */ new Set([...fileOps.edited, ...fileOps.written]);
  return {
    readFiles: [...fileOps.read].filter((f) => !modified.has(f)).toSorted(),
    modifiedFiles: [...modified].toSorted(),
  };
}
/** Format file lists as summary metadata tags. */
function formatFileOperations(readFiles, modifiedFiles) {
  const sections = [];
  if (readFiles.length > 0) sections.push(`<read-files>\n${readFiles.join("\n")}\n</read-files>`);
  if (modifiedFiles.length > 0)
    sections.push(`<modified-files>\n${modifiedFiles.join("\n")}\n</modified-files>`);
  if (sections.length === 0) return "";
  return `\n\n${sections.join("\n\n")}`;
}
const TOOL_RESULT_MAX_CHARS = 2e3;
function safeJsonStringify$1(value) {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return "[unserializable]";
  }
}
function truncateForSummary(text, maxChars) {
  if (text.length <= maxChars) return text;
  const sliced = truncateUtf16Safe(text, maxChars);
  return `${sliced}\n\n[... ${text.length - sliced.length} more characters truncated]`;
}
/** Extract text that compaction both estimates and includes in summary prompts. */
function getCompactionContentBlockText(block) {
  if (block.type === "text" && block.text) return block.text;
  if (block.type !== "toolResult" && block.type !== "tool_result") return "";
  if (block.text) return block.text;
  return typeof block.content === "string" ? block.content : "";
}
/** Serialize LLM messages to plain text for summarization prompts. */
function serializeConversation(messages) {
  const parts = [];
  for (const msg of messages)
    if (msg.role === "user") {
      const content =
        typeof msg.content === "string"
          ? msg.content
          : msg.content
              .filter((c) => c.type === "text")
              .map((c) => c.text)
              .join("");
      if (content) parts.push(`[User]: ${content}`);
    } else if (msg.role === "assistant") {
      const textParts = [];
      const thinkingParts = [];
      const toolCalls = [];
      for (const block of msg.content)
        if (block.type === "text") textParts.push(block.text);
        else if (block.type === "thinking") thinkingParts.push(block.thinking);
        else if (block.type === "toolCall") {
          const args = block.arguments;
          const argsStr = Object.entries(args)
            .map(([k, v]) => `${k}=${safeJsonStringify$1(v)}`)
            .join(", ");
          toolCalls.push(`${block.name}(${argsStr})`);
        }
      if (thinkingParts.length > 0) parts.push(`[Assistant thinking]: ${thinkingParts.join("\n")}`);
      if (textParts.length > 0) parts.push(`[Assistant]: ${textParts.join("\n")}`);
      if (toolCalls.length > 0) parts.push(`[Assistant tool calls]: ${toolCalls.join("; ")}`);
    } else if (msg.role === "toolResult") {
      const content = msg.content.map(getCompactionContentBlockText).join("");
      if (content)
        parts.push(`[Tool result]: ${truncateForSummary(content, TOOL_RESULT_MAX_CHARS)}`);
    }
  return parts.join("\n\n");
}
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.ts
function safeJsonStringify(value) {
  try {
    return JSON.stringify(value) ?? "undefined";
  } catch {
    return "[unserializable]";
  }
}
function extractFileOperations(messages, entries, prevCompactionIndex) {
  const fileOps = createFileOps();
  if (prevCompactionIndex >= 0) {
    const prevCompaction = entries[prevCompactionIndex];
    if (!prevCompaction.fromHook && prevCompaction.details) {
      const details = prevCompaction.details;
      if (Array.isArray(details.readFiles)) for (const f of details.readFiles) fileOps.read.add(f);
      if (Array.isArray(details.modifiedFiles))
        for (const f of details.modifiedFiles) fileOps.edited.add(f);
    }
  }
  for (const msg of messages) extractFileOpsFromMessage(msg, fileOps);
  return fileOps;
}
function getMessageFromEntry$1(entry) {
  if (entry.type === "message") return entry.message;
  if (entry.type === "custom_message")
    return asAgentMessage(
      createCustomMessage(
        entry.customType,
        entry.content,
        entry.display,
        entry.details,
        entry.timestamp,
      ),
    );
  if (entry.type === "branch_summary")
    return asAgentMessage(createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp));
  if (entry.type === "compaction")
    return asAgentMessage(
      createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp),
    );
}
function getMessageFromEntryForCompaction(entry) {
  if (entry.type === "compaction") return;
  return getMessageFromEntry$1(entry);
}
/** Default compaction settings used by the harness. */
const DEFAULT_COMPACTION_SETTINGS = {
  enabled: true,
  reserveTokens: 16384,
  keepRecentTokens: 2e4,
};
/** Calculate total context tokens from provider usage. */
function calculateContextTokens(usage) {
  if (usage.contextUsage?.state === "available") return usage.contextUsage.totalTokens;
  return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function getAssistantUsage(msg) {
  if (msg.role === "assistant" && "usage" in msg) {
    const assistantMsg = msg;
    if (
      assistantMsg.stopReason !== "aborted" &&
      assistantMsg.stopReason !== "error" &&
      assistantMsg.usage
    )
      return assistantMsg.usage;
  }
}
/** Return usage from the last successful assistant message in session entries. */
function getLastAssistantUsage(entries) {
  for (const entry of entries.toReversed())
    if (entry.type === "message") {
      const usage = getAssistantUsage(entry.message);
      if (usage) return usage;
    }
}
function getLastAssistantUsageInfo(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages.at(i);
    if (!message) continue;
    const usage = getAssistantUsage(message);
    if (usage && usage.contextUsage?.state !== "unavailable")
      return {
        usage,
        index: i,
      };
  }
}
/** Estimate context tokens for messages using provider usage when available. */
function estimateContextTokens(messages) {
  const usageInfo = getLastAssistantUsageInfo(messages);
  if (!usageInfo) {
    let estimated = 0;
    for (const message of messages) estimated += estimateTokens(message);
    return {
      tokens: estimated,
      usageTokens: 0,
      trailingTokens: estimated,
      lastUsageIndex: null,
    };
  }
  const usageTokens = calculateContextTokens(usageInfo.usage);
  let trailingTokens = 0;
  for (const message of messages.slice(usageInfo.index + 1))
    trailingTokens += estimateTokens(message);
  return {
    tokens: usageTokens + trailingTokens,
    usageTokens,
    trailingTokens,
    lastUsageIndex: usageInfo.index,
  };
}
/** Return whether context usage exceeds the configured compaction threshold. */
function shouldCompact(contextTokens, contextWindow, settings) {
  if (!settings.enabled) return false;
  return contextTokens > contextWindow - settings.reserveTokens;
}
const IMAGE_BLOCK_CHARS = 4800;
function countContentBlockChars(content) {
  let chars = 0;
  for (const block of content)
    if (block.type === "image") chars += IMAGE_BLOCK_CHARS;
    else chars += getCompactionContentBlockText(block).length;
  return chars;
}
/** Estimate token count for one message using a conservative character heuristic. */
function estimateTokens(message) {
  let chars = 0;
  const harnessMessage = message;
  switch (harnessMessage.role) {
    case "user": {
      const content = harnessMessage.content;
      if (typeof content === "string") chars = content.length;
      else if (Array.isArray(content)) chars = countContentBlockChars(content);
      return Math.ceil(chars / 4);
    }
    case "assistant": {
      const assistant = harnessMessage;
      for (const block of assistant.content)
        if (block.type === "text") chars += block.text.length;
        else if (block.type === "thinking") chars += block.thinking.length;
        else if (block.type === "toolCall")
          chars += block.name.length + safeJsonStringify(block.arguments).length;
      return Math.ceil(chars / 4);
    }
    case "custom":
    case "toolResult":
      if (typeof harnessMessage.content === "string") chars = harnessMessage.content.length;
      else chars = countContentBlockChars(harnessMessage.content);
      return Math.ceil(chars / 4);
    case "bashExecution":
      chars = harnessMessage.command.length + harnessMessage.output.length;
      return Math.ceil(chars / 4);
    case "branchSummary":
    case "compactionSummary":
      chars = harnessMessage.summary.length;
      return Math.ceil(chars / 4);
  }
  return 0;
}
function findValidCutPoints(entries, startIndex, endIndex) {
  const cutPoints = [];
  for (let i = startIndex; i < endIndex; i++) {
    const entry = entries[i];
    if (!entry) continue;
    switch (entry.type) {
      case "message":
        switch (entry.message.role) {
          case "bashExecution":
          case "custom":
          case "branchSummary":
          case "compactionSummary":
          case "user":
          case "assistant":
            cutPoints.push(i);
            break;
          case "toolResult":
            break;
        }
        break;
      case "thinking_level_change":
      case "model_change":
      case "compaction":
      case "branch_summary":
      case "custom":
      case "custom_message":
      case "label":
      case "session_info":
      case "leaf":
        break;
    }
    if (entry.type === "branch_summary" || entry.type === "custom_message") cutPoints.push(i);
  }
  return cutPoints;
}
/** Find the user-visible message that starts the turn containing an entry. */
function findTurnStartIndex(entries, entryIndex, startIndex) {
  for (let i = entryIndex; i >= startIndex; i--) {
    const entry = entries[i];
    if (!entry) continue;
    if (entry.type === "branch_summary" || entry.type === "custom_message") return i;
    if (entry.type === "message") {
      const role = entry.message.role;
      if (role === "user" || role === "bashExecution") return i;
    }
  }
  return -1;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
function findCutPoint(entries, startIndex, endIndex, keepRecentTokens) {
  const cutPoints = findValidCutPoints(entries, startIndex, endIndex);
  if (cutPoints.length === 0)
    return {
      firstKeptEntryIndex: startIndex,
      turnStartIndex: -1,
      isSplitTurn: false,
    };
  let accumulatedTokens = 0;
  const firstCutIndex = cutPoints.at(0);
  if (firstCutIndex === void 0)
    return {
      firstKeptEntryIndex: startIndex,
      turnStartIndex: -1,
      isSplitTurn: false,
    };
  let cutIndex = firstCutIndex;
  for (let i = endIndex - 1; i >= startIndex; i--) {
    const entry = entries[i];
    if (!entry || entry.type !== "message") continue;
    const messageTokens = estimateTokens(entry.message);
    accumulatedTokens += messageTokens;
    if (accumulatedTokens >= keepRecentTokens) {
      const lastCutIndex = cutPoints.at(-1);
      if (lastCutIndex === void 0)
        throw new Error("compaction cut-point list became empty during selection");
      cutIndex = lastCutIndex;
      for (const cutPoint of cutPoints)
        if (cutPoint >= i) {
          cutIndex = cutPoint;
          break;
        }
      break;
    }
  }
  while (cutIndex > startIndex) {
    const prevEntry = entries[cutIndex - 1];
    if (!prevEntry) break;
    if (prevEntry.type === "compaction") break;
    if (prevEntry.type === "message") break;
    cutIndex--;
  }
  const cutEntry = entries[cutIndex];
  if (!cutEntry) throw new Error("compaction cut point does not reference a session entry");
  const isUserMessage = cutEntry.type === "message" && cutEntry.message.role === "user";
  const turnStartIndex = isUserMessage ? -1 : findTurnStartIndex(entries, cutIndex, startIndex);
  return {
    firstKeptEntryIndex: cutIndex,
    turnStartIndex,
    isSplitTurn: !isUserMessage && turnStartIndex !== -1,
  };
}
const SUMMARIZATION_SYSTEM_PROMPT = `You are a context summarization assistant. Your task is to read a conversation between a user and an AI assistant, then produce a structured summary following the exact format specified.

Do NOT continue the conversation. Do NOT respond to any questions in the conversation. ONLY output the structured summary.`;
const SUMMARIZATION_PROMPT = `The messages above are a conversation to summarize. Create a structured context checkpoint summary that another LLM will use to continue the work.

Use this EXACT format:

## Goal
[What is the user trying to accomplish? Can be multiple items if the session covers different tasks.]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned by user]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of what should happen next]

## Critical Context
- [Any data, examples, or references needed to continue]
- [Or "(none)" if not applicable]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
const UPDATE_SUMMARIZATION_PROMPT = `The messages above are NEW conversation messages to incorporate into the existing summary provided in <previous-summary> tags.

Update the existing structured summary with new information. RULES:
- PRESERVE all existing information from the previous summary
- ADD new progress, decisions, and context from the new messages
- UPDATE the Progress section: move items from "In Progress" to "Done" when completed
- UPDATE "Next Steps" based on what was accomplished
- PRESERVE exact file paths, function names, and error messages
- If something is no longer relevant, you may remove it

Use this EXACT format:

## Goal
[Preserve existing goals, add new ones if the task expanded]

## Constraints & Preferences
- [Preserve existing, add new ones discovered]

## Progress
### Done
- [x] [Include previously done items AND newly completed items]

### In Progress
- [ ] [Current work - update based on progress]

### Blocked
- [Current blockers - remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context, add new if needed]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
function createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel) {
  const options = {
    maxTokens,
    signal,
    apiKey,
    headers,
  };
  const fableReasoning =
    (model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") &&
    resolveClaudeFable5ModelIdentity(model) !== void 0;
  if ((model.reasoning || fableReasoning) && thinkingLevel)
    options.reasoning = resolveAgentReasoningOption(model, thinkingLevel);
  return options;
}
async function completeSummarization(model, context, options, streamFn, runtime) {
  if (streamFn) return (await streamFn(model, context, options)).result();
  return await resolveAgentCoreCompleteFn(runtime)(model, context, options);
}
/** Runs one summarization completion and maps abort/error stops to CompactionError. */
async function runSummarizationCompletion(params) {
  const summarizationMessages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: params.promptText,
        },
      ],
      timestamp: Date.now(),
    },
  ];
  const response = await completeSummarization(
    params.model,
    {
      systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
      messages: summarizationMessages,
    },
    createSummarizationOptions(
      params.model,
      params.maxTokens,
      params.apiKey,
      params.headers,
      params.signal,
      params.thinkingLevel,
    ),
    params.streamFn,
    params.runtime,
  );
  if (response.stopReason === "aborted")
    return err(
      new CompactionError("aborted", response.errorMessage || `${params.errorLabel} aborted`),
    );
  if (response.stopReason === "error")
    return err(
      new CompactionError(
        "summarization_failed",
        `${params.errorLabel} failed: ${response.errorMessage || "Unknown error"}`,
      ),
    );
  return ok(
    response.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n"),
  );
}
/** Generate or update a conversation summary for compaction. */
async function generateSummary(
  currentMessages,
  model,
  reserveTokens,
  apiKey,
  headers,
  signal,
  customInstructions,
  previousSummary,
  thinkingLevel,
  streamFn,
  runtime,
) {
  const maxTokens = Math.min(
    Math.floor(0.8 * reserveTokens),
    model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY,
  );
  let basePrompt = previousSummary ? UPDATE_SUMMARIZATION_PROMPT : SUMMARIZATION_PROMPT;
  if (customInstructions) basePrompt = `${basePrompt}\n\nAdditional focus: ${customInstructions}`;
  let promptText = `<conversation>\n${serializeConversation(convertToLlm(currentMessages))}\n</conversation>\n\n`;
  if (previousSummary)
    promptText += `<previous-summary>\n${previousSummary}\n</previous-summary>\n\n`;
  promptText += basePrompt;
  return await runSummarizationCompletion({
    promptText,
    model,
    maxTokens,
    apiKey,
    headers,
    signal,
    thinkingLevel,
    streamFn,
    runtime,
    errorLabel: "Summarization",
  });
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
function prepareCompaction(pathEntries, settings) {
  if (pathEntries.at(-1)?.type === "compaction" || pathEntries.length === 0) return ok(void 0);
  let prevCompactionIndex = -1;
  for (let i = pathEntries.length - 1; i >= 0; i--)
    if (pathEntries.at(i)?.type === "compaction") {
      prevCompactionIndex = i;
      break;
    }
  let previousSummary;
  let boundaryStart = 0;
  if (prevCompactionIndex >= 0) {
    const prevCompaction = pathEntries[prevCompactionIndex];
    previousSummary = prevCompaction.summary;
    const firstKeptEntryIndex = pathEntries.findIndex(
      (entry) => entry.id === prevCompaction.firstKeptEntryId,
    );
    boundaryStart = firstKeptEntryIndex >= 0 ? firstKeptEntryIndex : prevCompactionIndex + 1;
  }
  const boundaryEnd = pathEntries.length;
  const tokensBefore = estimateContextTokens(buildSessionContext(pathEntries).messages).tokens;
  const cutPoint = findCutPoint(pathEntries, boundaryStart, boundaryEnd, settings.keepRecentTokens);
  const firstKeptEntry = pathEntries[cutPoint.firstKeptEntryIndex];
  if (!firstKeptEntry?.id)
    return err(
      new CompactionError(
        "invalid_session",
        "First kept entry has no UUID - session may need migration",
      ),
    );
  const firstKeptEntryId = firstKeptEntry.id;
  const historyEnd = cutPoint.isSplitTurn ? cutPoint.turnStartIndex : cutPoint.firstKeptEntryIndex;
  const messagesToSummarize = [];
  for (let i = boundaryStart; i < historyEnd; i++) {
    const entry = pathEntries.at(i);
    const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
    if (msg) messagesToSummarize.push(msg);
  }
  const turnPrefixMessages = [];
  if (cutPoint.isSplitTurn)
    for (let i = cutPoint.turnStartIndex; i < cutPoint.firstKeptEntryIndex; i++) {
      const entry = pathEntries.at(i);
      const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
      if (msg) turnPrefixMessages.push(msg);
    }
  const fileOps = extractFileOperations(messagesToSummarize, pathEntries, prevCompactionIndex);
  if (cutPoint.isSplitTurn)
    for (const msg of turnPrefixMessages) extractFileOpsFromMessage(msg, fileOps);
  return ok({
    firstKeptEntryId,
    messagesToSummarize,
    turnPrefixMessages,
    isSplitTurn: cutPoint.isSplitTurn,
    tokensBefore,
    previousSummary,
    fileOps,
    settings,
  });
}
const TURN_PREFIX_SUMMARIZATION_PROMPT = `This is the PREFIX of a turn that was too large to keep. The SUFFIX (recent work) is retained.

Summarize the prefix to provide context for the retained suffix:

## Original Request
[What did the user ask for in this turn?]

## Early Progress
- [Key decisions and work done in the prefix]

## Context for Suffix
- [Information needed to understand the retained recent work]

Be concise. Focus on what's needed to understand the kept suffix.`;
/** Generate compaction summary data from prepared session history. */
async function compact(
  preparation,
  model,
  apiKey,
  headers,
  customInstructions,
  signal,
  thinkingLevel,
  streamFn,
  runtime,
) {
  const {
    firstKeptEntryId,
    messagesToSummarize,
    turnPrefixMessages,
    isSplitTurn,
    tokensBefore,
    previousSummary,
    fileOps,
    settings,
  } = preparation;
  if (!firstKeptEntryId)
    return err(
      new CompactionError(
        "invalid_session",
        "First kept entry has no UUID - session may need migration",
      ),
    );
  let summary;
  if (isSplitTurn && turnPrefixMessages.length > 0) {
    const historyResult =
      messagesToSummarize.length > 0
        ? await generateSummary(
            messagesToSummarize,
            model,
            settings.reserveTokens,
            apiKey,
            headers,
            signal,
            customInstructions,
            previousSummary,
            thinkingLevel,
            streamFn,
            runtime,
          )
        : ok("No prior history.");
    if (!historyResult.ok) return err(historyResult.error);
    const turnPrefixResult = await generateTurnPrefixSummary(
      turnPrefixMessages,
      model,
      settings.reserveTokens,
      apiKey,
      headers,
      signal,
      thinkingLevel,
      streamFn,
      runtime,
    );
    if (!turnPrefixResult.ok) return err(turnPrefixResult.error);
    summary = `${historyResult.value}\n\n---\n\n**Turn Context (split turn):**\n\n${turnPrefixResult.value}`;
  } else {
    const summaryResult = await generateSummary(
      messagesToSummarize,
      model,
      settings.reserveTokens,
      apiKey,
      headers,
      signal,
      customInstructions,
      previousSummary,
      thinkingLevel,
      streamFn,
      runtime,
    );
    if (!summaryResult.ok) return err(summaryResult.error);
    summary = summaryResult.value;
  }
  const { readFiles, modifiedFiles } = computeFileLists(fileOps);
  summary += formatFileOperations(readFiles, modifiedFiles);
  return ok({
    summary,
    firstKeptEntryId,
    tokensBefore,
    details: {
      readFiles,
      modifiedFiles,
    },
  });
}
async function generateTurnPrefixSummary(
  messages,
  model,
  reserveTokens,
  apiKey,
  headers,
  signal,
  thinkingLevel,
  streamFn,
  runtime,
) {
  const maxTokens = Math.min(
    Math.floor(0.5 * reserveTokens),
    model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY,
  );
  return await runSummarizationCompletion({
    promptText: `<conversation>\n${serializeConversation(convertToLlm(messages))}\n</conversation>\n\n${TURN_PREFIX_SUMMARIZATION_PROMPT}`,
    model,
    maxTokens,
    apiKey,
    headers,
    signal,
    thinkingLevel,
    streamFn,
    runtime,
    errorLabel: "Turn prefix summarization",
  });
}
//#endregion
//#region packages/agent-core/src/harness/compaction/branch-summarization.ts
/** Collect entries that should be summarized before navigating to a different session tree entry. */
function collectEntriesForBranchSummaryFromBranches(oldBranch, targetBranch) {
  const oldPath = new Set(oldBranch.map((entry) => entry.id));
  let commonAncestorId = null;
  for (const targetEntry of targetBranch.toReversed())
    if (oldPath.has(targetEntry.id)) {
      commonAncestorId = targetEntry.id;
      break;
    }
  const firstSummarizedIndex =
    commonAncestorId === null
      ? 0
      : oldBranch.findIndex((entry) => entry.id === commonAncestorId) + 1;
  return {
    entries: oldBranch.slice(firstSummarizedIndex),
    commonAncestorId,
  };
}
/** Collect concrete session entries to summarize before moving from one leaf to another. */
async function collectEntriesForBranchSummary(session, oldLeafId, targetId) {
  if (!oldLeafId)
    return {
      entries: [],
      commonAncestorId: null,
    };
  return collectEntriesForBranchSummaryFromBranches(
    await session.getBranch(oldLeafId),
    await session.getBranch(targetId),
  );
}
function getMessageFromEntry(entry) {
  switch (entry.type) {
    case "message":
      if (entry.message.role === "toolResult") return;
      return entry.message;
    case "custom_message":
      return asAgentMessage(
        createCustomMessage(
          entry.customType,
          entry.content,
          entry.display,
          entry.details,
          entry.timestamp,
        ),
      );
    case "branch_summary":
      return asAgentMessage(
        createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp),
      );
    case "compaction":
      return asAgentMessage(
        createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp),
      );
    case "thinking_level_change":
    case "model_change":
    case "custom":
    case "label":
    case "session_info":
    case "leaf":
      return;
  }
}
/** Prepare branch entries for summarization within an optional token budget. */
function prepareBranchEntries(entries, tokenBudget = 0) {
  const messages = [];
  const fileOps = createFileOps();
  let totalTokens = 0;
  for (const entry of entries)
    if (entry.type === "branch_summary" && !entry.fromHook && entry.details) {
      const details = entry.details;
      if (Array.isArray(details.readFiles)) for (const f of details.readFiles) fileOps.read.add(f);
      if (Array.isArray(details.modifiedFiles))
        for (const f of details.modifiedFiles) fileOps.edited.add(f);
    }
  for (const entry of entries.toReversed()) {
    const message = getMessageFromEntry(entry);
    if (!message) continue;
    extractFileOpsFromMessage(message, fileOps);
    const tokens = estimateTokens(message);
    if (tokenBudget > 0 && totalTokens + tokens > tokenBudget) {
      if (entry.type === "compaction" || entry.type === "branch_summary") {
        if (totalTokens < tokenBudget * 0.9) {
          messages.unshift(message);
          totalTokens += tokens;
        }
      }
      break;
    }
    messages.unshift(message);
    totalTokens += tokens;
  }
  return {
    messages,
    fileOps,
    totalTokens,
  };
}
const BRANCH_SUMMARY_PREAMBLE = `The user explored a different conversation branch before returning here.
Summary of that exploration:

`;
const BRANCH_SUMMARY_PROMPT = `Create a structured summary of this conversation branch for context when returning later.

Use this EXACT format:

## Goal
[What was the user trying to accomplish in this branch?]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Work that was started but not finished]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [What should happen next to continue this work]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate a summary for abandoned branch entries. */
async function generateBranchSummary(entries, options) {
  const {
    model,
    apiKey,
    headers,
    signal,
    customInstructions,
    replaceInstructions,
    reserveTokens = 16384,
  } = options;
  const { messages, fileOps } = prepareBranchEntries(
    entries,
    (model.contextWindow || 128e3) - reserveTokens,
  );
  if (messages.length === 0)
    return ok({
      summary: "No content to summarize",
      readFiles: [],
      modifiedFiles: [],
    });
  const conversationText = serializeConversation(convertToLlm(messages));
  let instructions;
  if (replaceInstructions && customInstructions) instructions = customInstructions;
  else if (customInstructions)
    instructions = `${BRANCH_SUMMARY_PROMPT}\n\nAdditional focus: ${customInstructions}`;
  else instructions = BRANCH_SUMMARY_PROMPT;
  const context = {
    systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `<conversation>\n${conversationText}\n</conversation>\n\n${instructions}`,
          },
        ],
        timestamp: Date.now(),
      },
    ],
  };
  const streamOptions = {
    apiKey,
    headers,
    signal,
    maxTokens: 2048,
  };
  const response = options.streamFn
    ? await (await options.streamFn(model, context, streamOptions)).result()
    : await resolveAgentCoreCompleteFn(options.runtime)(model, context, streamOptions);
  if (response.stopReason === "aborted")
    return err(
      new BranchSummaryError("aborted", response.errorMessage || "Branch summary aborted"),
    );
  if (response.stopReason === "error")
    return err(
      new BranchSummaryError(
        "summarization_failed",
        `Branch summary failed: ${response.errorMessage || "Unknown error"}`,
      ),
    );
  let summary = response.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");
  summary = BRANCH_SUMMARY_PREAMBLE + summary;
  const { readFiles, modifiedFiles } = computeFileLists(fileOps);
  summary += formatFileOperations(readFiles, modifiedFiles);
  return ok({
    summary: summary || "No summary generated",
    readFiles,
    modifiedFiles,
  });
}
//#endregion
//#region packages/agent-core/src/harness/prompt-template-arguments.ts
/** Parse an argument string using simple shell-style single and double quotes. */
function parseCommandArgs(argsString) {
  const args = [];
  let current = "";
  let inQuote = null;
  let hasToken = false;
  for (const char of argsString)
    if (inQuote)
      if (char === inQuote) inQuote = null;
      else {
        hasToken = true;
        current += char;
      }
    else if (char === '"' || char === "'") {
      hasToken = true;
      inQuote = char;
    } else if (/\s/.test(char)) {
      if (hasToken) {
        args.push(current);
        current = "";
        hasToken = false;
      }
    } else {
      hasToken = true;
      current += char;
    }
  if (hasToken) args.push(current);
  return args;
}
function parseSafeNonNegativeInteger(raw) {
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : void 0;
}
/**
 * Substitute prompt template placeholders (`$1`, `$@`, `$ARGUMENTS`, `${@:N}`, `${@:N:L}`) with command arguments.
 *
 * Unsafe integer placeholders resolve to empty text instead of throwing, so malformed templates cannot abort prompt
 * loading or invocation.
 */
function substituteArgs(content, args) {
  let result = content;
  result = result.replace(/\$(\d+)/g, (_, num) => {
    const parsed = parseSafeNonNegativeInteger(num);
    if (parsed === void 0 || parsed <= 0) return "";
    return args[parsed - 1] ?? "";
  });
  result = result.replace(/\$\{@:(\d+)(?::(\d+))?\}/g, (_, startStr, lengthStr) => {
    const parsedStart = parseSafeNonNegativeInteger(startStr);
    if (parsedStart === void 0) return "";
    let start = parsedStart - 1;
    if (start < 0) start = 0;
    if (lengthStr) {
      const length = parseSafeNonNegativeInteger(lengthStr);
      if (length === void 0) return "";
      return args.slice(start, start + length).join(" ");
    }
    return args.slice(start).join(" ");
  });
  const allArgs = args.join(" ");
  result = result.replace(/\$ARGUMENTS/g, allArgs);
  result = result.replace(/\$@/g, allArgs);
  return result;
}
/** Format a prompt template invocation using command-style argument substitution. */
function formatPromptTemplateInvocation(template, args = []) {
  return substituteArgs(template.content, args);
}
//#endregion
//#region packages/agent-core/src/harness/skills.ts
/** Format a skill invocation prompt, optionally appending additional user instructions. */
function formatSkillInvocation(skill, additionalInstructions) {
  const skillBlock = `<skill name="${skill.name}" location="${skill.filePath}">\nReferences are relative to ${dirnameEnvPath(skill.filePath)}.\n\n${skill.content}\n</skill>`;
  return additionalInstructions ? `${skillBlock}\n\n${additionalInstructions}` : skillBlock;
}
function dirnameEnvPath(path) {
  const normalized = path.replace(/\/+$/, "");
  const slashIndex = normalized.lastIndexOf("/");
  return slashIndex <= 0 ? "/" : normalized.slice(0, slashIndex);
}
//#endregion
//#region packages/agent-core/src/harness/agent-harness.ts
function createUserMessage(text, images) {
  const content = [
    {
      type: "text",
      text,
    },
  ];
  if (images) content.push(...images);
  return {
    role: "user",
    content,
    timestamp: Date.now(),
  };
}
function cloneStreamOptions(streamOptions) {
  return {
    ...streamOptions,
    headers: streamOptions?.headers ? { ...streamOptions.headers } : void 0,
    metadata: streamOptions?.metadata ? { ...streamOptions.metadata } : void 0,
  };
}
function mergeHeaders(...headers) {
  const merged = {};
  let hasHeaders = false;
  for (const entry of headers) {
    if (!entry) continue;
    Object.assign(merged, entry);
    hasHeaders = true;
  }
  return hasHeaders ? merged : void 0;
}
function applyStreamOptionsPatch(base, patch) {
  const result = cloneStreamOptions(base);
  if (!patch) return result;
  if (Object.hasOwn(patch, "transport")) result.transport = patch.transport;
  if (Object.hasOwn(patch, "timeoutMs")) result.timeoutMs = patch.timeoutMs;
  if (Object.hasOwn(patch, "maxRetries")) result.maxRetries = patch.maxRetries;
  if (Object.hasOwn(patch, "maxRetryDelayMs")) result.maxRetryDelayMs = patch.maxRetryDelayMs;
  if (Object.hasOwn(patch, "cacheRetention")) result.cacheRetention = patch.cacheRetention;
  if (Object.hasOwn(patch, "headers"))
    if (patch.headers === void 0) result.headers = void 0;
    else {
      const headers = { ...result.headers };
      for (const [key, value] of Object.entries(patch.headers))
        if (value === void 0) delete headers[key];
        else headers[key] = value;
      result.headers = Object.keys(headers).length > 0 ? headers : void 0;
    }
  if (Object.hasOwn(patch, "metadata"))
    if (patch.metadata === void 0) result.metadata = void 0;
    else {
      const metadata = { ...result.metadata };
      for (const [key, value] of Object.entries(patch.metadata))
        if (value === void 0) delete metadata[key];
        else metadata[key] = value;
      result.metadata = Object.keys(metadata).length > 0 ? metadata : void 0;
    }
  return result;
}
const SUBSCRIBER_EVENT_TYPE = "*";
function normalizeHarnessError(error, fallbackCode) {
  if (error instanceof AgentHarnessError) return error;
  const cause = toErrorObject(error, "Non-Error thrown");
  if (cause instanceof SessionError) return new AgentHarnessError("session", cause.message, cause);
  if (cause instanceof CompactionError)
    return new AgentHarnessError("compaction", cause.message, cause);
  if (cause instanceof BranchSummaryError)
    return new AgentHarnessError("branch_summary", cause.message, cause);
  return new AgentHarnessError(fallbackCode, cause.message, cause);
}
function normalizeHookError(error) {
  return normalizeHarnessError(error, "hook");
}
/** Stateful harness for running, steering, compacting, and navigating sessions. */
var CoreAgentHarness = class {
  constructor(options) {
    this.phase = "idle";
    this.pendingSessionWrites = [];
    this.tools = /* @__PURE__ */ new Map();
    this.steerQueue = [];
    this.followUpQueue = [];
    this.nextTurnQueue = [];
    this.handlers = /* @__PURE__ */ new Map();
    this.env = options.env;
    this.session = options.session;
    this.resources = options.resources ?? {};
    this.streamOptions = cloneStreamOptions(options.streamOptions);
    this.systemPrompt = options.systemPrompt;
    this.getApiKeyAndHeaders = options.getApiKeyAndHeaders;
    this.runtime = options.runtime;
    for (const tool of options.tools ?? []) this.tools.set(tool.name, tool);
    this.model = options.model;
    this.thinkingLevel = options.thinkingLevel ?? "off";
    this.activeToolNames =
      options.activeToolNames ?? (options.tools ?? []).map((tool) => tool.name);
    this.steeringQueueMode = options.steeringMode ?? "one-at-a-time";
    this.followUpQueueMode = options.followUpMode ?? "one-at-a-time";
  }
  getHandlers(type) {
    return this.handlers.get(type);
  }
  async emitOwn(event, signal) {
    for (const listener of this.getHandlers(SUBSCRIBER_EVENT_TYPE) ?? [])
      try {
        await listener(event, signal);
      } catch (error) {
        throw normalizeHookError(error);
      }
  }
  async emitAny(event, signal) {
    for (const listener of this.getHandlers(SUBSCRIBER_EVENT_TYPE) ?? [])
      try {
        await listener(event, signal);
      } catch (error) {
        throw normalizeHookError(error);
      }
  }
  async emitHook(event) {
    const handlers = this.getHandlers(event.type);
    if (!handlers || handlers.size === 0) return;
    let lastResult;
    for (const handler of handlers)
      try {
        const result = await handler(event);
        if (result !== void 0) lastResult = result;
      } catch (error) {
        throw normalizeHookError(error);
      }
    return lastResult;
  }
  async emitBeforeProviderRequest(model, sessionId, streamOptions) {
    const handlers = this.getHandlers("before_provider_request");
    let current = cloneStreamOptions(streamOptions);
    if (!handlers || handlers.size === 0) return current;
    for (const handler of handlers)
      try {
        const result = await handler({
          type: "before_provider_request",
          model,
          sessionId,
          streamOptions: cloneStreamOptions(current),
        });
        if (result?.streamOptions) current = applyStreamOptionsPatch(current, result.streamOptions);
      } catch (error) {
        throw normalizeHookError(error);
      }
    return current;
  }
  async emitBeforeProviderPayload(model, payload) {
    const handlers = this.getHandlers("before_provider_payload");
    let current = payload;
    if (!handlers || handlers.size === 0) return current;
    for (const handler of handlers)
      try {
        const result = await handler({
          type: "before_provider_payload",
          model,
          payload: current,
        });
        if (result !== void 0) current = result.payload;
      } catch (error) {
        throw normalizeHookError(error);
      }
    return current;
  }
  async emitQueueUpdate() {
    await this.emitOwn({
      type: "queue_update",
      steer: [...this.steerQueue],
      followUp: [...this.followUpQueue],
      nextTurn: [...this.nextTurnQueue],
    });
  }
  startRunPromise() {
    let finish = () => {};
    this.runPromise = new Promise((resolve) => {
      finish = resolve;
    });
    return () => {
      this.runPromise = void 0;
      finish();
    };
  }
  async createTurnState() {
    const context = await this.session.buildContext();
    const resources = this.getResources();
    const sessionMetadata = await this.session.getMetadata();
    const tools = [...this.tools.values()];
    const activeTools = this.activeToolNames
      .map((name) => this.tools.get(name))
      .filter((tool) => tool !== void 0);
    let systemPrompt = "You are a helpful assistant.";
    if (typeof this.systemPrompt === "string") systemPrompt = this.systemPrompt;
    else if (this.systemPrompt)
      systemPrompt = await this.systemPrompt({
        env: this.env,
        session: this.session,
        model: this.model,
        thinkingLevel: this.thinkingLevel,
        activeTools,
        resources,
      });
    return {
      messages: context.messages,
      resources,
      streamOptions: cloneStreamOptions(this.streamOptions),
      sessionId: sessionMetadata.id,
      systemPrompt,
      model: this.model,
      thinkingLevel: this.thinkingLevel,
      tools,
      activeTools,
    };
  }
  createContext(turnState, systemPrompt) {
    return {
      systemPrompt: systemPrompt ?? turnState.systemPrompt,
      messages: turnState.messages.slice(),
      tools: turnState.activeTools.slice(),
    };
  }
  createStreamFn(getTurnState) {
    return async (model, context, streamOptions) => {
      const turnState = getTurnState();
      const auth = await this.getApiKeyAndHeaders?.(model);
      const snapshotOptions = {
        ...turnState.streamOptions,
        headers: mergeHeaders(turnState.streamOptions.headers, auth?.headers),
      };
      const requestOptions = await this.emitBeforeProviderRequest(
        model,
        turnState.sessionId,
        snapshotOptions,
      );
      return resolveAgentCoreStreamFn(this.runtime)(model, context, {
        cacheRetention: requestOptions.cacheRetention,
        headers: requestOptions.headers,
        maxRetries: requestOptions.maxRetries,
        maxRetryDelayMs: requestOptions.maxRetryDelayMs,
        metadata: requestOptions.metadata,
        onPayload: async (payload) => await this.emitBeforeProviderPayload(model, payload),
        onResponse: async (response) => {
          const headers = { ...response.headers };
          await this.emitOwn(
            {
              type: "after_provider_response",
              status: response.status,
              headers,
            },
            streamOptions?.signal,
          );
        },
        reasoning: streamOptions?.reasoning,
        signal: streamOptions?.signal,
        sessionId: turnState.sessionId,
        timeoutMs: requestOptions.timeoutMs,
        transport: requestOptions.transport,
        apiKey: auth?.apiKey,
      });
    };
  }
  async drainQueuedMessages(queue, mode) {
    const messages = mode === "all" ? queue.splice(0) : queue.splice(0, 1);
    if (messages.length === 0) return messages;
    try {
      await this.emitQueueUpdate();
      return messages;
    } catch (error) {
      queue.unshift(...messages);
      throw normalizeHookError(error);
    }
  }
  createLoopConfig(getTurnState, setTurnState) {
    const turnState = getTurnState();
    return {
      model: turnState.model,
      thinkingLevel: turnState.thinkingLevel,
      reasoning: resolveAgentReasoningOption(turnState.model, turnState.thinkingLevel),
      convertToLlm,
      transformContext: async (messages) => {
        return (
          (
            await this.emitHook({
              type: "context",
              messages: [...messages],
            })
          )?.messages ?? messages
        );
      },
      beforeToolCall: async ({ toolCall, args }) => {
        const result = await this.emitHook({
          type: "tool_call",
          toolCallId: toolCall.id,
          toolName: toolCall.name,
          input: args,
        });
        return result
          ? {
              block: result.block,
              reason: result.reason,
            }
          : void 0;
      },
      afterToolCall: async ({ toolCall, args, result, isError }) => {
        const patch = await this.emitHook({
          type: "tool_result",
          toolCallId: toolCall.id,
          toolName: toolCall.name,
          input: args,
          content: result.content,
          details: result.details,
          isError,
        });
        return patch
          ? {
              content: patch.content,
              details: patch.details,
              isError: patch.isError,
              terminate: patch.terminate,
            }
          : void 0;
      },
      prepareNextTurn: async () => {
        await this.flushPendingSessionWrites();
        const nextTurnState = await this.createTurnState();
        setTurnState(nextTurnState);
        return {
          context: this.createContext(nextTurnState),
          model: nextTurnState.model,
          thinkingLevel: nextTurnState.thinkingLevel,
        };
      },
      getSteeringMessages: async () =>
        this.drainQueuedMessages(this.steerQueue, this.steeringQueueMode),
      getFollowUpMessages: async () =>
        this.drainQueuedMessages(this.followUpQueue, this.followUpQueueMode),
    };
  }
  validateToolNames(toolNames, tools = this.tools) {
    const missing = toolNames.filter((name) => !tools.has(name));
    if (missing.length > 0)
      throw new AgentHarnessError("invalid_argument", `Unknown tool(s): ${missing.join(", ")}`);
  }
  async flushPendingSessionWrites() {
    while (this.pendingSessionWrites.length > 0) {
      const write = this.pendingSessionWrites.at(0);
      if (!write) break;
      if (write.type === "message") await this.session.appendMessage(write.message);
      else if (write.type === "model_change")
        await this.session.appendModelChange(write.provider, write.modelId);
      else if (write.type === "thinking_level_change")
        await this.session.appendThinkingLevelChange(write.thinkingLevel);
      else if (write.type === "custom")
        await this.session.appendCustomEntry(write.customType, write.data);
      else if (write.type === "custom_message")
        await this.session.appendCustomMessageEntry(
          write.customType,
          write.content,
          write.display,
          write.details,
        );
      else if (write.type === "label") await this.session.appendLabel(write.targetId, write.label);
      else if (write.type === "session_info")
        await this.session.appendSessionName(write.name ?? "");
      else if (write.type === "leaf") await this.session.getStorage().setLeafId(write.targetId);
      this.pendingSessionWrites.shift();
    }
  }
  async handleAgentEvent(event, signal) {
    if (event.type === "message_end") {
      await this.session.appendMessage(event.message);
      await this.emitAny(event, signal);
      return;
    }
    if (event.type === "turn_end") {
      let eventError;
      try {
        await this.emitAny(event, signal);
      } catch (error) {
        eventError = error;
      }
      const hadPendingMutations = this.pendingSessionWrites.length > 0;
      await this.flushPendingSessionWrites();
      if (eventError) throw toLintErrorObject(eventError, "Non-Error thrown");
      await this.emitOwn({
        type: "save_point",
        hadPendingMutations,
      });
      return;
    }
    if (event.type === "agent_end") {
      await this.flushPendingSessionWrites();
      this.phase = "idle";
      await this.emitAny(event, signal);
      await this.emitOwn(
        {
          type: "settled",
          nextTurnCount: this.nextTurnQueue.length,
        },
        signal,
      );
      return;
    }
    await this.emitAny(event, signal);
  }
  async emitRunFailure(model, error, aborted, signal) {
    const failureMessage = createFailureMessage(model, error, aborted);
    await this.handleAgentEvent(
      {
        type: "message_start",
        message: failureMessage,
      },
      signal,
    );
    await this.handleAgentEvent(
      {
        type: "message_end",
        message: failureMessage,
      },
      signal,
    );
    await this.handleAgentEvent(
      {
        type: "turn_end",
        message: failureMessage,
        toolResults: [],
      },
      signal,
    );
    const messages = [failureMessage];
    if (aborted && !isTurnHandoffAbort(signal))
      await appendInterruptedTurnMessage(messages, (event) => this.handleAgentEvent(event, signal));
    await this.handleAgentEvent(
      {
        type: "agent_end",
        messages,
      },
      signal,
    );
    return messages;
  }
  async executeTurn(turnState, text, options) {
    let activeTurnState = turnState;
    const promptMessage = createUserMessage(text, options?.images);
    let messages = [promptMessage];
    if (this.nextTurnQueue.length > 0) {
      const queuedMessages = this.nextTurnQueue.splice(0);
      try {
        await this.emitQueueUpdate();
      } catch (error) {
        this.nextTurnQueue.unshift(...queuedMessages);
        throw normalizeHookError(error);
      }
      messages = [...queuedMessages, promptMessage];
    }
    const beforeResult = await this.emitHook({
      type: "before_agent_start",
      prompt: text,
      images: options?.images,
      systemPrompt: turnState.systemPrompt,
      resources: turnState.resources,
    });
    if (beforeResult?.messages) messages = [...messages, ...beforeResult.messages];
    const abortController = new AbortController();
    const getTurnState = () => activeTurnState;
    const setTurnState = (nextTurnState) => {
      activeTurnState = nextTurnState;
    };
    this.runAbortController = abortController;
    const runResultPromise = (async () => {
      try {
        return await runAgentLoop(
          messages,
          this.createContext(turnState, beforeResult?.systemPrompt),
          this.createLoopConfig(getTurnState, setTurnState),
          (event) => this.handleAgentEvent(event, abortController.signal),
          abortController.signal,
          this.createStreamFn(getTurnState),
        );
      } catch (error) {
        try {
          return await this.emitRunFailure(
            activeTurnState.model,
            error,
            abortController.signal.aborted,
            abortController.signal,
          );
        } catch (failureError) {
          const cause = new AggregateError(
            [error, failureError].map((value) => toErrorObject(value, "Non-Error thrown")),
            "Agent run failed and failure reporting failed",
          );
          throw new AgentHarnessError("unknown", cause.message, cause);
        }
      }
    })();
    try {
      const newMessages = await runResultPromise;
      for (const message of newMessages.toReversed())
        if (message.role === "assistant") return message;
      throw new AgentHarnessError(
        "invalid_state",
        "AgentHarness prompt completed without an assistant message",
      );
    } finally {
      try {
        await this.flushPendingSessionWrites();
      } finally {
        this.runAbortController = void 0;
      }
    }
  }
  async prompt(text, options) {
    if (this.phase !== "idle") throw new AgentHarnessError("busy", "AgentHarness is busy");
    this.phase = "turn";
    const finishRunPromise = this.startRunPromise();
    try {
      const turnState = await this.createTurnState();
      return await this.executeTurn(turnState, text, options);
    } catch (error) {
      this.phase = "idle";
      throw normalizeHarnessError(error, "unknown");
    } finally {
      finishRunPromise();
    }
  }
  async skill(name, additionalInstructions) {
    if (this.phase !== "idle") throw new AgentHarnessError("busy", "AgentHarness is busy");
    this.phase = "turn";
    const finishRunPromise = this.startRunPromise();
    try {
      const turnState = await this.createTurnState();
      const skill = (turnState.resources.skills ?? []).find((candidate) => candidate.name === name);
      if (!skill) throw new AgentHarnessError("invalid_argument", `Unknown skill: ${name}`);
      return await this.executeTurn(
        turnState,
        formatSkillInvocation(skill, additionalInstructions),
      );
    } catch (error) {
      this.phase = "idle";
      throw normalizeHarnessError(error, "unknown");
    } finally {
      finishRunPromise();
    }
  }
  async promptFromTemplate(name, args = []) {
    if (this.phase !== "idle") throw new AgentHarnessError("busy", "AgentHarness is busy");
    this.phase = "turn";
    const finishRunPromise = this.startRunPromise();
    try {
      const turnState = await this.createTurnState();
      const template = (turnState.resources.promptTemplates ?? []).find(
        (candidate) => candidate.name === name,
      );
      if (!template)
        throw new AgentHarnessError("invalid_argument", `Unknown prompt template: ${name}`);
      return await this.executeTurn(turnState, formatPromptTemplateInvocation(template, args));
    } catch (error) {
      this.phase = "idle";
      throw normalizeHarnessError(error, "unknown");
    } finally {
      finishRunPromise();
    }
  }
  async steer(text, options) {
    if (this.phase === "idle")
      throw new AgentHarnessError("invalid_state", "Cannot steer while idle");
    this.steerQueue.push(createUserMessage(text, options?.images));
    await this.emitQueueUpdate();
  }
  async followUp(text, options) {
    if (this.phase === "idle")
      throw new AgentHarnessError("invalid_state", "Cannot follow up while idle");
    this.followUpQueue.push(createUserMessage(text, options?.images));
    await this.emitQueueUpdate();
  }
  async nextTurn(text, options) {
    this.nextTurnQueue.push(createUserMessage(text, options?.images));
    await this.emitQueueUpdate();
  }
  async appendMessage(message) {
    try {
      if (this.phase === "idle") await this.session.appendMessage(message);
      else
        this.pendingSessionWrites.push({
          type: "message",
          message,
        });
    } catch (error) {
      throw normalizeHarnessError(error, "session");
    }
  }
  async compact(customInstructions) {
    if (this.phase !== "idle")
      throw new AgentHarnessError("busy", "compact() requires idle harness");
    this.phase = "compaction";
    try {
      const model = this.model;
      if (!model) throw new AgentHarnessError("invalid_state", "No model set for compaction");
      const auth = await this.getApiKeyAndHeaders?.(model);
      if (!auth) throw new AgentHarnessError("auth", "No auth available for compaction");
      const branchEntries = await this.session.getBranch();
      const preparationResult = prepareCompaction(branchEntries, DEFAULT_COMPACTION_SETTINGS);
      if (!preparationResult.ok) throw preparationResult.error;
      const preparation = preparationResult.value;
      if (!preparation) throw new AgentHarnessError("compaction", "Nothing to compact");
      const hookResult = await this.emitHook({
        type: "session_before_compact",
        preparation,
        branchEntries,
        customInstructions,
        signal: new AbortController().signal,
      });
      if (hookResult?.cancel) throw new AgentHarnessError("compaction", "Compaction cancelled");
      const provided = hookResult?.compaction;
      const compactResult = provided
        ? {
            ok: true,
            value: provided,
          }
        : await compact(
            preparation,
            model,
            auth.apiKey,
            auth.headers,
            customInstructions,
            void 0,
            this.thinkingLevel,
            void 0,
            this.runtime,
          );
      if (!compactResult.ok) throw compactResult.error;
      const result = compactResult.value;
      const entryId = await this.session.appendCompaction(
        result.summary,
        result.firstKeptEntryId,
        result.tokensBefore,
        result.details,
        provided !== void 0,
      );
      const entry = await this.session.getEntry(entryId);
      if (entry?.type === "compaction")
        await this.emitOwn({
          type: "session_compact",
          compactionEntry: entry,
          fromHook: provided !== void 0,
        });
      return result;
    } catch (error) {
      throw normalizeHarnessError(error, "compaction");
    } finally {
      this.phase = "idle";
    }
  }
  async navigateTree(targetId, options) {
    if (this.phase !== "idle")
      throw new AgentHarnessError("busy", "navigateTree() requires idle harness");
    this.phase = "branch_summary";
    try {
      const oldLeafId = await this.session.getLeafId();
      if (oldLeafId === targetId) return { cancelled: false };
      const targetEntry = await this.session.getEntry(targetId);
      if (!targetEntry)
        throw new AgentHarnessError("invalid_argument", `Entry ${targetId} not found`);
      const { entries, commonAncestorId } = await collectEntriesForBranchSummary(
        this.session,
        oldLeafId,
        targetId,
      );
      const preparation = {
        targetId,
        oldLeafId,
        commonAncestorId,
        entriesToSummarize: entries,
        userWantsSummary: options?.summarize ?? false,
        customInstructions: options?.customInstructions,
        replaceInstructions: options?.replaceInstructions,
        label: options?.label,
      };
      const signal = new AbortController().signal;
      const hookResult = await this.emitHook({
        type: "session_before_tree",
        preparation,
        signal,
      });
      if (hookResult?.cancel) return { cancelled: true };
      let summaryEntry;
      let summaryText = hookResult?.summary?.summary;
      let summaryDetails = hookResult?.summary?.details;
      if (!summaryText && options?.summarize && entries.length > 0) {
        const model = this.model;
        if (!model) throw new AgentHarnessError("invalid_state", "No model set for branch summary");
        const auth = await this.getApiKeyAndHeaders?.(model);
        if (!auth) throw new AgentHarnessError("auth", "No auth available for branch summary");
        const branchSummary = await generateBranchSummary(entries, {
          model,
          apiKey: auth.apiKey,
          headers: auth.headers,
          signal: new AbortController().signal,
          runtime: this.runtime,
          customInstructions: hookResult?.customInstructions ?? options?.customInstructions,
          replaceInstructions: hookResult?.replaceInstructions ?? options?.replaceInstructions,
        });
        if (!branchSummary.ok) {
          if (branchSummary.error.code === "aborted") return { cancelled: true };
          throw new AgentHarnessError(
            "branch_summary",
            branchSummary.error.message,
            branchSummary.error,
          );
        }
        summaryText = branchSummary.value.summary;
        summaryDetails = {
          readFiles: branchSummary.value.readFiles,
          modifiedFiles: branchSummary.value.modifiedFiles,
        };
      }
      let editorText;
      let newLeafId;
      if (targetEntry.type === "message" && targetEntry.message.role === "user") {
        newLeafId = targetEntry.parentId;
        const content = targetEntry.message.content;
        editorText =
          typeof content === "string"
            ? content
            : content
                .filter((c) => c.type === "text")
                .map((c) => c.text)
                .join("");
      } else if (targetEntry.type === "custom_message") {
        newLeafId = targetEntry.parentId;
        editorText =
          typeof targetEntry.content === "string"
            ? targetEntry.content
            : targetEntry.content
                .filter((c) => c.type === "text")
                .map((c) => c.text)
                .join("");
      } else newLeafId = targetId;
      const summaryId = await this.session.moveTo(
        newLeafId,
        summaryText
          ? {
              summary: summaryText,
              details: summaryDetails,
              fromHook: hookResult?.summary !== void 0,
            }
          : void 0,
      );
      if (summaryId) {
        const entry = await this.session.getEntry(summaryId);
        if (entry?.type === "branch_summary") summaryEntry = entry;
      }
      await this.emitOwn({
        type: "session_tree",
        newLeafId: await this.session.getLeafId(),
        oldLeafId,
        summaryEntry,
        fromHook: hookResult?.summary !== void 0,
      });
      return {
        cancelled: false,
        editorText,
        summaryEntry,
      };
    } catch (error) {
      throw normalizeHarnessError(error, "branch_summary");
    } finally {
      this.phase = "idle";
    }
  }
  getModel() {
    return this.model;
  }
  getThinkingLevel() {
    return this.thinkingLevel;
  }
  async setModel(model) {
    try {
      const previousModel = this.model;
      if (this.phase === "idle") await this.session.appendModelChange(model.provider, model.id);
      else
        this.pendingSessionWrites.push({
          type: "model_change",
          provider: model.provider,
          modelId: model.id,
        });
      this.model = model;
      await this.emitOwn({
        type: "model_select",
        model,
        previousModel,
        source: "set",
      });
    } catch (error) {
      throw normalizeHarnessError(error, "session");
    }
  }
  async setThinkingLevel(level) {
    try {
      const previousLevel = this.thinkingLevel;
      if (this.phase === "idle") await this.session.appendThinkingLevelChange(level);
      else
        this.pendingSessionWrites.push({
          type: "thinking_level_change",
          thinkingLevel: level,
        });
      this.thinkingLevel = level;
      await this.emitOwn({
        type: "thinking_level_select",
        level,
        previousLevel,
      });
    } catch (error) {
      throw normalizeHarnessError(error, "session");
    }
  }
  async setActiveTools(toolNames) {
    try {
      this.validateToolNames(toolNames);
      this.activeToolNames = [...toolNames];
    } catch (error) {
      throw normalizeHarnessError(error, "invalid_argument");
    }
  }
  getSteeringMode() {
    return this.steeringQueueMode;
  }
  async setSteeringMode(mode) {
    this.steeringQueueMode = mode;
  }
  getFollowUpMode() {
    return this.followUpQueueMode;
  }
  async setFollowUpMode(mode) {
    this.followUpQueueMode = mode;
  }
  getResources() {
    return {
      skills: this.resources.skills?.slice(),
      promptTemplates: this.resources.promptTemplates?.slice(),
    };
  }
  async setResources(resources) {
    const previousResources = this.getResources();
    this.resources = {
      skills: resources.skills?.slice(),
      promptTemplates: resources.promptTemplates?.slice(),
    };
    await this.emitOwn({
      type: "resources_update",
      resources: this.getResources(),
      previousResources,
    });
  }
  getStreamOptions() {
    return cloneStreamOptions(this.streamOptions);
  }
  async setStreamOptions(streamOptions) {
    this.streamOptions = cloneStreamOptions(streamOptions);
  }
  async setTools(tools, activeToolNames) {
    try {
      const nextTools = new Map(tools.map((tool) => [tool.name, tool]));
      const nextActiveToolNames = activeToolNames ? [...activeToolNames] : this.activeToolNames;
      this.validateToolNames(nextActiveToolNames, nextTools);
      this.tools = nextTools;
      this.activeToolNames = [...nextActiveToolNames];
    } catch (error) {
      throw normalizeHarnessError(error, "invalid_argument");
    }
  }
  async abort() {
    const clearedSteer = [...this.steerQueue];
    const clearedFollowUp = [...this.followUpQueue];
    this.steerQueue = [];
    this.followUpQueue = [];
    this.runAbortController?.abort();
    const errors = [];
    try {
      await this.emitQueueUpdate();
    } catch (error) {
      errors.push(toErrorObject(error, "Non-Error thrown"));
    }
    try {
      await this.waitForIdle();
    } catch (error) {
      errors.push(toErrorObject(error, "Non-Error thrown"));
    }
    try {
      await this.emitOwn({
        type: "abort",
        clearedSteer,
        clearedFollowUp,
      });
    } catch (error) {
      errors.push(toErrorObject(error, "Non-Error thrown"));
    }
    if (errors.length > 0)
      throw normalizeHarnessError(
        errors.length === 1 ? errors[0] : new AggregateError(errors, "Abort completed with errors"),
        "hook",
      );
    return {
      clearedSteer,
      clearedFollowUp,
    };
  }
  async waitForIdle() {
    await this.runPromise;
  }
  subscribe(listener) {
    let handlers = this.handlers.get(SUBSCRIBER_EVENT_TYPE);
    if (!handlers) {
      handlers = /* @__PURE__ */ new Set();
      this.handlers.set(SUBSCRIBER_EVENT_TYPE, handlers);
    }
    handlers.add(listener);
    return () => handlers.delete(listener);
  }
  on(type, handler) {
    let handlers = this.handlers.get(type);
    if (!handlers) {
      handlers = /* @__PURE__ */ new Set();
      this.handlers.set(type, handlers);
    }
    handlers.add(handler);
    return () => handlers.delete(handler);
  }
};
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
//#region packages/agent-core/src/harness/session/uuid.ts
let lastTimestamp = -Infinity;
let sequence = 0;
function fillRandomBytes(bytes) {
  const crypto = globalThis.crypto;
  if (crypto?.getRandomValues) {
    crypto.getRandomValues(bytes);
    return;
  }
  for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
}
/** Generate a monotonic UUIDv7 string. */
function uuidv7() {
  const random = /* @__PURE__ */ new Uint8Array(16);
  fillRandomBytes(random);
  const timestamp = Date.now();
  if (timestamp > lastTimestamp) {
    sequence = new DataView(random.buffer, random.byteOffset + 6, 4).getUint32(0);
    lastTimestamp = timestamp;
  } else {
    sequence = (sequence + 1) >>> 0;
    if (sequence === 0) lastTimestamp++;
  }
  const bytes = /* @__PURE__ */ new Uint8Array(16);
  bytes[0] = (lastTimestamp / 1099511627776) & 255;
  bytes[1] = (lastTimestamp / 4294967296) & 255;
  bytes[2] = (lastTimestamp / 16777216) & 255;
  bytes[3] = (lastTimestamp / 65536) & 255;
  bytes[4] = (lastTimestamp / 256) & 255;
  bytes[5] = lastTimestamp & 255;
  bytes[6] = 112 | ((sequence >>> 28) & 15);
  bytes[7] = (sequence >>> 20) & 255;
  bytes[8] = 128 | ((sequence >>> 14) & 63);
  bytes[9] = (sequence >>> 6) & 255;
  const randomLowBits = random.at(10);
  if (randomLowBits === void 0) throw new Error("UUID random buffer is shorter than 11 bytes");
  bytes[10] = ((sequence & 63) << 2) | (randomLowBits & 3);
  bytes.set(random.subarray(11), 11);
  return formatUuid(bytes);
}
function formatUuid(bytes) {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
//#endregion
//#region packages/agent-core/src/harness/session/storage-base.ts
function updateLabelCache(labelsById, entry) {
  if (entry.type !== "label") return;
  const label = entry.label?.trim();
  if (label) labelsById.set(entry.targetId, label);
  else labelsById.delete(entry.targetId);
}
function buildLabelsById(entries) {
  const labelsById = /* @__PURE__ */ new Map();
  for (const entry of entries) updateLabelCache(labelsById, entry);
  return labelsById;
}
function isSideAppendEntry(entry) {
  return entry.appendMode === "side";
}
function generateEntryId(byId) {
  for (let i = 0; i < 100; i++) {
    const id = uuidv7().slice(0, 8);
    if (!byId.has(id)) return id;
  }
  return uuidv7();
}
/** Return the visible-leaf update represented by one session tree entry. */
function leafIdUpdateAfterEntry(entry) {
  if (entry.type !== "leaf" && isSideAppendEntry(entry)) return;
  switch (entry.type) {
    case "leaf":
      return entry.targetId;
    case "message":
    case "thinking_level_change":
    case "model_change":
    case "compaction":
    case "branch_summary":
    case "custom":
    case "custom_message":
    case "label":
    case "session_info":
      return entry.id;
    default:
      return;
  }
}
/** Return the raw parent for the next append after applying a tree entry. */
function appendParentIdAfterEntry(entry) {
  return entry.type === "leaf"
    ? entry.appendParentId === void 0
      ? entry.targetId
      : entry.appendParentId
    : entry.id;
}
function resolveLeafId(entries) {
  let leafId = null;
  for (const entry of entries) {
    const update = leafIdUpdateAfterEntry(entry);
    if (update !== void 0) leafId = update;
  }
  return leafId;
}
function resolveAppendParentId(entries) {
  let appendParentId = null;
  for (const entry of entries) appendParentId = appendParentIdAfterEntry(entry);
  return appendParentId;
}
function buildLogicalParentsById(entries) {
  const logicalParentsById = /* @__PURE__ */ new Map();
  let leafId = null;
  let appendParentId = null;
  for (const entry of entries) {
    const leafUpdate = leafIdUpdateAfterEntry(entry);
    if (
      leafUpdate === entry.id &&
      !isSideAppendEntry(entry) &&
      entry.parentId === appendParentId &&
      leafId !== appendParentId
    )
      logicalParentsById.set(entry.id, leafId);
    if (leafUpdate !== void 0) leafId = leafUpdate;
    appendParentId = appendParentIdAfterEntry(entry);
  }
  return logicalParentsById;
}
var BaseSessionStorage = class {
  constructor(
    metadata,
    entries,
    leafId = resolveLeafId(entries),
    appendParentId = resolveAppendParentId(entries),
  ) {
    this.metadata = metadata;
    this.entries = entries;
    this.byId = new Map(entries.map((entry) => [entry.id, entry]));
    this.labelsById = buildLabelsById(entries);
    this.logicalParentsById = buildLogicalParentsById(entries);
    this.leafId = leafId;
    this.appendParentId = appendParentId;
    if (this.leafId !== null && !this.byId.has(this.leafId))
      throw new SessionError("invalid_session", `Entry ${this.leafId} not found`);
    if (this.appendParentId !== null && !this.byId.has(this.appendParentId))
      throw new SessionError("invalid_session", `Append parent ${this.appendParentId} not found`);
  }
  async getMetadata() {
    return this.metadata;
  }
  async getLeafId() {
    if (this.leafId !== null && !this.byId.has(this.leafId))
      throw new SessionError("invalid_session", `Entry ${this.leafId} not found`);
    return this.leafId;
  }
  async getAppendParentId() {
    if (this.appendParentId !== null && !this.byId.has(this.appendParentId))
      throw new SessionError("invalid_session", `Append parent ${this.appendParentId} not found`);
    return this.appendParentId;
  }
  createLeafEntry(leafId) {
    if (leafId !== null && !this.byId.has(leafId))
      throw new SessionError("not_found", `Entry ${leafId} not found`);
    return {
      type: "leaf",
      id: generateEntryId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      targetId: leafId,
    };
  }
  async createEntryId() {
    return generateEntryId(this.byId);
  }
  validateEntryForAppend(entry) {
    const leafId = leafIdUpdateAfterEntry(entry);
    const leafIsNewEntry = entry.type !== "leaf" && leafId === entry.id;
    if (leafId !== void 0 && leafId !== null && !leafIsNewEntry && !this.byId.has(leafId))
      throw new SessionError("not_found", `Entry ${leafId} not found`);
    const appendParentId = appendParentIdAfterEntry(entry);
    const appendParentIsNewEntry = entry.type !== "leaf" && appendParentId === entry.id;
    if (appendParentId !== null && !appendParentIsNewEntry && !this.byId.has(appendParentId))
      throw new SessionError("not_found", `Append parent ${appendParentId} not found`);
  }
  recordEntry(entry) {
    this.validateEntryForAppend(entry);
    const leafId = leafIdUpdateAfterEntry(entry);
    if (
      leafId === entry.id &&
      !isSideAppendEntry(entry) &&
      entry.parentId === this.appendParentId &&
      this.leafId !== this.appendParentId
    )
      this.logicalParentsById.set(entry.id, this.leafId);
    this.entries.push(entry);
    this.byId.set(entry.id, entry);
    updateLabelCache(this.labelsById, entry);
    if (leafId !== void 0) this.leafId = leafId;
    this.appendParentId = appendParentIdAfterEntry(entry);
  }
  async getEntry(id) {
    return this.byId.get(id);
  }
  async findEntries(type) {
    return this.entries.filter((entry) => entry.type === type);
  }
  async getLabel(id) {
    return this.labelsById.get(id);
  }
  async getPathToRoot(leafId) {
    if (leafId === null) return [];
    const path = [];
    let current = this.byId.get(leafId);
    if (!current) throw new SessionError("not_found", `Entry ${leafId} not found`);
    const seen = /* @__PURE__ */ new Set();
    while (current) {
      if (seen.has(current.id))
        throw new SessionError("invalid_session", `Cycle found at entry ${current.id}`);
      seen.add(current.id);
      if (current.type !== "leaf") path.unshift(current);
      const parentId =
        current.type === "leaf"
          ? current.targetId
          : this.logicalParentsById.has(current.id)
            ? (this.logicalParentsById.get(current.id) ?? null)
            : current.parentId;
      if (!parentId) break;
      const parent = this.byId.get(parentId);
      if (!parent) throw new SessionError("invalid_session", `Entry ${parentId} not found`);
      current = parent;
    }
    return path;
  }
  async getEntries() {
    return [...this.entries];
  }
};
//#endregion
//#region packages/agent-core/src/harness/session/jsonl-storage.ts
function getFileSystemResultOrThrow(result, message) {
  if (!result.ok)
    throw new SessionError(
      result.error.code === "not_found" ? "not_found" : "storage",
      `${message}: ${result.error.message}`,
      result.error,
    );
  return result.value;
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function invalidSession(filePath, message, cause) {
  return new SessionError(
    "invalid_session",
    `Invalid JSONL session file ${filePath}: ${message}`,
    cause,
  );
}
function invalidEntry(filePath, lineNumber, message, cause) {
  return new SessionError(
    "invalid_entry",
    `Invalid JSONL session file ${filePath}: line ${lineNumber} ${message}`,
    cause,
  );
}
function parseHeaderLine(line, filePath) {
  let parsed;
  try {
    parsed = JSON.parse(line);
  } catch (error) {
    throw invalidSession(
      filePath,
      "first line is not a valid session header",
      toErrorObject(error, "Non-Error thrown"),
    );
  }
  if (!isRecord(parsed)) throw invalidSession(filePath, "first line is not a valid session header");
  if (parsed.type !== "session")
    throw invalidSession(filePath, "first line is not a valid session header");
  if (parsed.version !== 3) throw invalidSession(filePath, "unsupported session version");
  if (typeof parsed.id !== "string" || !parsed.id)
    throw invalidSession(filePath, "session header is missing id");
  if (typeof parsed.timestamp !== "string" || !parsed.timestamp)
    throw invalidSession(filePath, "session header is missing timestamp");
  if (parseSessionTimestampMs(parsed.timestamp) === void 0)
    throw invalidSession(filePath, "session header has invalid timestamp");
  if (typeof parsed.cwd !== "string" || !parsed.cwd)
    throw invalidSession(filePath, "session header is missing cwd");
  if (parsed.parentSession !== void 0 && typeof parsed.parentSession !== "string")
    throw invalidSession(filePath, "session header parentSession must be a string");
  return {
    type: "session",
    version: 3,
    id: parsed.id,
    timestamp: parsed.timestamp,
    cwd: parsed.cwd,
    parentSession: parsed.parentSession,
  };
}
function parseEntryLine(line, filePath, lineNumber) {
  let parsed;
  try {
    parsed = JSON.parse(line);
  } catch (error) {
    throw invalidEntry(
      filePath,
      lineNumber,
      "is not valid JSON",
      toErrorObject(error, "Non-Error thrown"),
    );
  }
  if (!isRecord(parsed)) throw invalidEntry(filePath, lineNumber, "is not a valid session entry");
  if (typeof parsed.type !== "string")
    throw invalidEntry(filePath, lineNumber, "is missing entry type");
  if (typeof parsed.id !== "string" || !parsed.id)
    throw invalidEntry(filePath, lineNumber, "is missing entry id");
  if (parsed.parentId !== null && typeof parsed.parentId !== "string")
    throw invalidEntry(filePath, lineNumber, "has invalid parentId");
  if (typeof parsed.timestamp !== "string" || !parsed.timestamp)
    throw invalidEntry(filePath, lineNumber, "is missing timestamp");
  if (parseSessionTimestampMs(parsed.timestamp) === void 0)
    throw invalidEntry(filePath, lineNumber, "has invalid timestamp");
  if (parsed.type === "leaf" && parsed.targetId !== null && typeof parsed.targetId !== "string")
    throw invalidEntry(filePath, lineNumber, "has invalid targetId");
  if (
    parsed.type === "leaf" &&
    parsed.appendParentId !== void 0 &&
    parsed.appendParentId !== null &&
    typeof parsed.appendParentId !== "string"
  )
    throw invalidEntry(filePath, lineNumber, "has invalid appendParentId");
  if (parsed.appendMode !== void 0 && parsed.appendMode !== "side")
    throw invalidEntry(filePath, lineNumber, "has invalid appendMode");
  return parsed;
}
function headerToSessionMetadata(header, path) {
  return {
    id: header.id,
    createdAt: header.timestamp,
    cwd: header.cwd,
    path,
    parentSessionPath: header.parentSession,
  };
}
/** Read only the JSONL session header and convert it to session metadata. */
async function loadJsonlSessionMetadata(fs, filePath) {
  const line = getFileSystemResultOrThrow(
    await fs.readTextLines(filePath, { maxLines: 1 }),
    `Failed to read session header ${filePath}`,
  )[0];
  if (line?.trim()) return headerToSessionMetadata(parseHeaderLine(line, filePath), filePath);
  throw invalidSession(filePath, "missing session header");
}
async function loadJsonlStorage(fs, filePath) {
  const lines = getFileSystemResultOrThrow(
    await fs.readTextFile(filePath),
    `Failed to read session ${filePath}`,
  ).split("\n");
  const headerIndex = lines.findIndex((line) => line.trim());
  if (headerIndex === -1) throw invalidSession(filePath, "missing session header");
  const headerLine = lines.at(headerIndex);
  if (headerLine === void 0) throw invalidSession(filePath, "missing session header");
  const header = parseHeaderLine(headerLine, filePath);
  const entries = [];
  let leafId = null;
  let appendParentId = null;
  for (const [offset, line] of lines.slice(headerIndex + 1).entries()) {
    if (!line.trim()) continue;
    const entry = parseEntryLine(line, filePath, headerIndex + offset + 2);
    entries.push(entry);
    const leafUpdate = leafIdUpdateAfterEntry(entry);
    if (leafUpdate !== void 0) leafId = leafUpdate;
    appendParentId = appendParentIdAfterEntry(entry);
  }
  return {
    header,
    entries,
    leafId,
    appendParentId,
  };
}
/** Append-only JSONL-backed storage for one session tree. */
var JsonlSessionStorage = class JsonlSessionStorage extends BaseSessionStorage {
  constructor(fs, filePath, header, entries, leafId, appendParentId) {
    super(headerToSessionMetadata(header, filePath), entries, leafId, appendParentId);
    this.fs = fs;
    this.filePath = filePath;
  }
  static async open(fs, filePath) {
    const loaded = await loadJsonlStorage(fs, filePath);
    return new JsonlSessionStorage(
      fs,
      filePath,
      loaded.header,
      loaded.entries,
      loaded.leafId,
      loaded.appendParentId,
    );
  }
  /** Create a new JSONL file with a session header and no entries. */
  static async create(fs, filePath, options) {
    const header = {
      type: "session",
      version: 3,
      id: options.sessionId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      cwd: options.cwd,
      parentSession: options.parentSessionPath,
    };
    getFileSystemResultOrThrow(
      await fs.writeFile(filePath, `${JSON.stringify(header)}\n`),
      `Failed to create session ${filePath}`,
    );
    return new JsonlSessionStorage(fs, filePath, header, [], null, null);
  }
  async setLeafId(leafId) {
    const entry = this.createLeafEntry(leafId);
    getFileSystemResultOrThrow(
      await this.fs.appendFile(this.filePath, `${JSON.stringify(entry)}\n`),
      `Failed to append session leaf ${entry.id}`,
    );
    this.recordEntry(entry);
  }
  async appendEntry(entry) {
    this.validateEntryForAppend(entry);
    getFileSystemResultOrThrow(
      await this.fs.appendFile(this.filePath, `${JSON.stringify(entry)}\n`),
      `Failed to append session entry ${entry.id}`,
    );
    this.recordEntry(entry);
  }
};
//#endregion
//#region packages/agent-core/src/harness/session/memory-storage.ts
/** Volatile session storage used by tests and in-process harness callers. */
var InMemorySessionStorage = class extends BaseSessionStorage {
  constructor(options) {
    super(
      options?.metadata ?? {
        id: uuidv7(),
        createdAt: /* @__PURE__ */ new Date().toISOString(),
      },
      options?.entries ? [...options.entries] : [],
    );
  }
  async setLeafId(leafId) {
    this.recordEntry(this.createLeafEntry(leafId));
  }
  async appendEntry(entry) {
    this.recordEntry(entry);
  }
};
//#endregion
//#region packages/agent-core/src/harness/utils/truncate.ts
const DEFAULT_MAX_LINES = 2e3;
const DEFAULT_MAX_BYTES = 50 * 1024;
const GREP_MAX_LINE_LENGTH = 500;
const runtimeBuffer = globalThis.Buffer;
function splitLinesForCounting(content) {
  if (content.length === 0) return [];
  const lines = content.split("\n");
  if (content.endsWith("\n")) lines.pop();
  return lines;
}
function findFirstNonAscii(content) {
  for (let index = 0; index < content.length; index++)
    if (content.charCodeAt(index) > 127) return index;
  return -1;
}
function utf8ByteLength(content) {
  if (runtimeBuffer) return runtimeBuffer.byteLength(content, "utf8");
  const firstNonAscii = findFirstNonAscii(content);
  if (firstNonAscii === -1) return content.length;
  let bytes = firstNonAscii;
  for (let i = firstNonAscii; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code <= 127) bytes += 1;
    else if (code <= 2047) bytes += 2;
    else if (code >= 55296 && code <= 56319 && i + 1 < content.length) {
      const next = content.charCodeAt(i + 1);
      if (next >= 56320 && next <= 57343) {
        bytes += 4;
        i++;
      } else bytes += 3;
    } else bytes += 3;
  }
  return bytes;
}
function replaceUnpairedSurrogates(content) {
  let output = "";
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code >= 55296 && code <= 56319) {
      if (i + 1 < content.length) {
        const next = content.charCodeAt(i + 1);
        if (next >= 56320 && next <= 57343) {
          output += content.charAt(i) + content.charAt(i + 1);
          i++;
          continue;
        }
      }
      output += "�";
    } else if (code >= 56320 && code <= 57343) output += "�";
    else output += content.charAt(i);
  }
  return output;
}
/**
 * Format byte counts for compact tool-output diagnostics.
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
function resolveTruncationInput(content, options) {
  const maxLines = options.maxLines ?? 2e3;
  const maxBytes = options.maxBytes ?? 51200;
  const totalBytes = utf8ByteLength(content);
  const lines = splitLinesForCounting(content);
  return {
    lines,
    totalLines: lines.length,
    totalBytes,
    maxLines,
    maxBytes,
  };
}
function buildTruncationResult(input, params) {
  return {
    content: params.content,
    truncated: params.truncated,
    truncatedBy: params.truncatedBy,
    totalLines: input.totalLines,
    totalBytes: input.totalBytes,
    outputLines: params.outputLines,
    outputBytes: params.outputBytes ?? utf8ByteLength(params.content),
    lastLinePartial: params.lastLinePartial ?? false,
    firstLineExceedsLimit: params.firstLineExceedsLimit ?? false,
    maxLines: input.maxLines,
    maxBytes: input.maxBytes,
  };
}
/**
 * Keep the beginning of content while respecting independent line and byte ceilings.
 *
 * Head truncation preserves complete lines; a first line that exceeds the byte
 * ceiling produces empty output and sets firstLineExceedsLimit.
 */
function truncateHead(content, options = {}) {
  const input = resolveTruncationInput(content, options);
  if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes)
    return buildTruncationResult(input, {
      content,
      truncated: false,
      truncatedBy: null,
      outputLines: input.totalLines,
      outputBytes: input.totalBytes,
    });
  const firstLine = input.lines[0];
  if (firstLine !== void 0 && utf8ByteLength(firstLine) > input.maxBytes)
    return buildTruncationResult(input, {
      content: "",
      truncated: true,
      truncatedBy: "bytes",
      outputLines: 0,
      outputBytes: 0,
      firstLineExceedsLimit: true,
    });
  const outputLinesArr = [];
  let outputBytesCount = 0;
  let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
  for (const [i, line] of input.lines.slice(0, input.maxLines).entries()) {
    const lineBytes = utf8ByteLength(line) + (i > 0 ? 1 : 0);
    if (outputBytesCount + lineBytes > input.maxBytes) {
      truncatedBy = "bytes";
      break;
    }
    outputLinesArr.push(line);
    outputBytesCount += lineBytes;
  }
  if (
    input.totalLines > input.maxLines &&
    outputLinesArr.length >= input.maxLines &&
    outputBytesCount <= input.maxBytes
  )
    truncatedBy = "lines";
  return buildTruncationResult(input, {
    content: outputLinesArr.join("\n"),
    truncated: true,
    truncatedBy,
    outputLines: outputLinesArr.length,
  });
}
/**
 * Keep the end of content while respecting independent line and byte ceilings.
 *
 * Tail truncation preserves recent output for command errors and may keep a
 * partial first line when one final line alone exceeds the byte ceiling.
 */
function truncateTail(content, options = {}) {
  const input = resolveTruncationInput(content, options);
  if (input.totalLines <= input.maxLines && input.totalBytes <= input.maxBytes)
    return buildTruncationResult(input, {
      content,
      truncated: false,
      truncatedBy: null,
      outputLines: input.totalLines,
      outputBytes: input.totalBytes,
    });
  const outputLinesArr = [];
  let outputBytesCount = 0;
  let truncatedBy = input.totalLines > input.maxLines ? "lines" : "bytes";
  let lastLinePartial = false;
  for (let i = input.lines.length - 1; i >= 0 && outputLinesArr.length < input.maxLines; i--) {
    const line = input.lines.at(i);
    if (line === void 0) continue;
    const lineBytes = utf8ByteLength(line) + (outputLinesArr.length > 0 ? 1 : 0);
    if (outputBytesCount + lineBytes > input.maxBytes) {
      truncatedBy = "bytes";
      if (outputLinesArr.length === 0) {
        const truncatedLine = truncateStringToBytesFromEnd(line, input.maxBytes);
        outputLinesArr.unshift(truncatedLine);
        outputBytesCount = utf8ByteLength(truncatedLine);
        lastLinePartial = true;
      }
      break;
    }
    outputLinesArr.unshift(line);
    outputBytesCount += lineBytes;
  }
  if (
    input.totalLines > input.maxLines &&
    outputLinesArr.length >= input.maxLines &&
    outputBytesCount <= input.maxBytes
  )
    truncatedBy = "lines";
  return buildTruncationResult(input, {
    content: outputLinesArr.join("\n"),
    truncated: true,
    truncatedBy,
    outputLines: outputLinesArr.length,
    lastLinePartial,
  });
}
/**
 * Truncate a string to fit within a byte limit (from the end).
 * Handles multi-byte UTF-8 characters correctly.
 */
function truncateStringToBytesFromEnd(str, maxBytes) {
  if (maxBytes <= 0) return "";
  let outputBytes = 0;
  let start = str.length;
  let needsReplacement = false;
  for (let i = str.length; i > 0;) {
    let characterStart = i - 1;
    const code = str.charCodeAt(characterStart);
    let characterBytes;
    let unpairedSurrogate = false;
    if (code >= 56320 && code <= 57343 && characterStart > 0) {
      const previous = str.charCodeAt(characterStart - 1);
      if (previous >= 55296 && previous <= 56319) {
        characterStart--;
        characterBytes = 4;
      } else {
        characterBytes = 3;
        unpairedSurrogate = true;
      }
    } else if (code >= 55296 && code <= 57343) {
      characterBytes = 3;
      unpairedSurrogate = true;
    } else characterBytes = code <= 127 ? 1 : code <= 2047 ? 2 : 3;
    if (outputBytes + characterBytes > maxBytes) break;
    outputBytes += characterBytes;
    start = characterStart;
    needsReplacement ||= unpairedSurrogate;
    i = characterStart;
  }
  const output = str.slice(start);
  return needsReplacement ? replaceUnpairedSurrogates(output) : output;
}
/**
 * Trim a single display line and mark it with the grep-style truncation suffix.
 *
 * The cut point is backed off by one code unit when it would otherwise split a
 * surrogate pair, so emoji / CJK Extension B characters crossing the boundary
 * stay intact instead of rendering as replacement characters.
 */
function truncateLine(line, maxChars = 500) {
  if (line.length <= maxChars)
    return {
      text: line,
      wasTruncated: false,
    };
  let cut = maxChars;
  if (cut < line.length) {
    const lastCode = line.charCodeAt(cut - 1);
    if (lastCode >= 55296 && lastCode <= 56319) {
      const nextCode = line.charCodeAt(cut);
      if (nextCode >= 56320 && nextCode <= 57343) cut -= 1;
    }
  }
  return {
    text: `${line.slice(0, cut)}... [truncated]`,
    wasTruncated: true,
  };
}
//#endregion
//#region src/agents/runtime/proxy.ts
/**
 * Proxy stream function for apps that route LLM calls through a server.
 * The server manages auth and proxies requests to LLM providers.
 */
const PROXY_ERROR_BODY_MAX_BYTES = 16 * 1024 * 1024;
const PROXY_SSE_STREAM_MAX_BYTES = 16 * 1024 * 1024;
const PROXY_SSE_PENDING_BUFFER_MAX_BYTES = PROXY_SSE_STREAM_MAX_BYTES;
const PROXY_SSE_READ_IDLE_TIMEOUT_MS = 12e4;
var ProxyMessageEventStream = class extends event_stream_exports.EventStream {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") return event.message;
        if (event.type === "error") return event.error;
        throw new Error("Unexpected event type");
      },
    );
  }
};
/**
 * Stream function that proxies through a server instead of calling LLM providers directly.
 * The server strips the partial field from delta events to reduce bandwidth.
 * We reconstruct the partial message client-side.
 *
 * Use this as the `streamFn` option when creating an Agent that needs to go through a proxy.
 *
 * @example
 * ```typescript
 * const agent = new Agent({
 *   streamFn: (model, context, options) =>
 *     streamProxy(model, context, {
 *       ...options,
 *       authToken: await getAuthToken(),
 *       proxyUrl: "https://genai.example.com",
 *     }),
 * });
 * ```
 */
function buildProxyRequestOptions(options) {
  return {
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    reasoning: options.reasoning,
    cacheRetention: options.cacheRetention,
    sessionId: options.sessionId,
    promptCacheKey: options.promptCacheKey,
    metadata: options.metadata,
    transport: options.transport,
    thinkingBudgets: options.thinkingBudgets,
    maxRetryDelayMs: options.maxRetryDelayMs,
    timeoutMs: options.timeoutMs,
  };
}
function sanitizeProxyModel(model) {
  const { headers: _headers, ...safeModel } = model;
  return safeModel;
}
function resolveProxyReadIdleTimeoutMs(timeoutMs) {
  return resolvePositiveTimerTimeoutMs(timeoutMs, PROXY_SSE_READ_IDLE_TIMEOUT_MS);
}
function createProxyRequestTimeoutError(timeoutMs) {
  const error = /* @__PURE__ */ new Error(`Proxy request timed out after ${timeoutMs}ms`);
  error.name = "TimeoutError";
  return error;
}
function buildProxyRequestAbort(callerSignal, timeoutMs) {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(createProxyRequestTimeoutError(timeoutMs));
  }, timeoutMs);
  return {
    signal: callerSignal
      ? AbortSignal.any([callerSignal, timeoutController.signal])
      : timeoutController.signal,
    clear: () => {
      clearTimeout(timeoutId);
    },
  };
}
function isProxyRequestTimeoutError(params) {
  if (params.callerSignal?.aborted || !params.requestSignal.aborted) return false;
  if (!(params.error instanceof Error)) return false;
  return (
    params.error.name === "AbortError" ||
    params.error.name === "TimeoutError" ||
    params.error.message === "Request was aborted"
  );
}
async function readProxyErrorData(response, readIdleTimeoutMs) {
  const bytes = await readResponseWithLimit(response, PROXY_ERROR_BODY_MAX_BYTES, {
    onOverflow: ({ maxBytes }) =>
      /* @__PURE__ */ new Error(`Proxy error body exceeded ${maxBytes} bytes`),
    chunkTimeoutMs: readIdleTimeoutMs,
    onIdleTimeout: ({ chunkTimeoutMs }) =>
      /* @__PURE__ */ new Error(
        `Proxy error body stalled: no data received for ${chunkTimeoutMs}ms`,
      ),
  });
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function readProxySseChunk(reader, readIdleTimeoutMs) {
  let timeoutId;
  let timedOut = false;
  return await new Promise((resolve, reject) => {
    const timeoutError = /* @__PURE__ */ new Error(
      `Proxy SSE stream stalled: no data received for ${readIdleTimeoutMs}ms`,
    );
    timeoutId = setTimeout(() => {
      timedOut = true;
      reader.cancel(timeoutError);
      reject(timeoutError);
    }, readIdleTimeoutMs);
    reader.read().then(
      (result) => {
        if (timeoutId !== void 0) clearTimeout(timeoutId);
        if (!timedOut) resolve(result);
      },
      (error) => {
        if (timeoutId !== void 0) clearTimeout(timeoutId);
        if (!timedOut) reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
function assertProxySsePendingBufferWithinLimit(buffer, reader) {
  if (new TextEncoder().encode(buffer).byteLength <= PROXY_SSE_PENDING_BUFFER_MAX_BYTES) return;
  const error = /* @__PURE__ */ new Error(
    `Proxy SSE pending buffer exceeded ${PROXY_SSE_PENDING_BUFFER_MAX_BYTES} bytes`,
  );
  reader.cancel(error).catch(() => void 0);
  throw error;
}
function streamProxy(model, context, options) {
  const stream = new ProxyMessageEventStream();
  (async () => {
    const partial = {
      role: "assistant",
      stopReason: "stop",
      content: [],
      api: model.api,
      provider: model.provider,
      model: model.id,
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
    let reader;
    const readIdleTimeoutMs = resolveProxyReadIdleTimeoutMs(options.timeoutMs);
    const abortHandler = () => {
      if (reader) reader.cancel("Request aborted by user").catch(() => {});
    };
    if (options.signal) options.signal.addEventListener("abort", abortHandler);
    try {
      const requestAbort = buildProxyRequestAbort(options.signal, readIdleTimeoutMs);
      const response = await fetch(`${options.proxyUrl}/api/stream`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: sanitizeProxyModel(model),
          context,
          options: buildProxyRequestOptions(options),
        }),
        signal: requestAbort.signal,
      })
        .catch((error) => {
          if (
            isProxyRequestTimeoutError({
              error,
              callerSignal: options.signal,
              requestSignal: requestAbort.signal,
            })
          )
            throw new Error(`Proxy request timed out after ${readIdleTimeoutMs}ms`, {
              cause: error instanceof Error ? error : void 0,
            });
          throw error;
        })
        .finally(() => {
          requestAbort.clear();
        });
      if (!response.ok) {
        let errorMessage = `Proxy error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await readProxyErrorData(response, readIdleTimeoutMs);
          if (errorData?.error) errorMessage = `Proxy error: ${errorData.error}`;
        } catch (error) {
          if (error instanceof Error && error.message.startsWith("Proxy error body")) throw error;
        }
        throw new Error(errorMessage);
      }
      reader = response.body.getReader();
      const sseReader = createSseByteGuard(reader, {
        maxBytes: PROXY_SSE_STREAM_MAX_BYTES,
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`Proxy SSE stream exceeded ${maxBytes} bytes`),
      });
      const decoder = new TextDecoder();
      let buffer = "";
      let terminalEventSeen = false;
      const processSseLine = (line) => {
        if (!line.startsWith("data: ")) return;
        const data = line.slice(6).trim();
        if (!data) return;
        const event = processProxyEvent(JSON.parse(data), partial);
        if (!event) return;
        terminalEventSeen = event.type === "done" || event.type === "error";
        stream.push(event);
      };
      while (true) {
        const { done, value } = await readProxySseChunk(sseReader, readIdleTimeoutMs);
        if (done) break;
        if (options.signal?.aborted) throw new Error("Request aborted by user");
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        assertProxySsePendingBufferWithinLimit(buffer, reader);
        for (const line of lines) processSseLine(line);
      }
      if (options.signal?.aborted) throw new Error("Request aborted by user");
      buffer += decoder.decode();
      if (buffer.trim()) processSseLine(buffer);
      if (!terminalEventSeen) throw new Error("Proxy stream ended before terminal event");
      stream.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const reason = options.signal?.aborted ? "aborted" : "error";
      partial.stopReason = reason;
      partial.errorMessage = errorMessage;
      stream.push({
        type: "error",
        reason,
        error: partial,
      });
      stream.end();
    } finally {
      try {
        reader?.releaseLock();
      } catch {}
      if (options.signal) options.signal.removeEventListener("abort", abortHandler);
    }
  })();
  return stream;
}
/**
 * Process a proxy event and update the partial message.
 */
function processProxyEvent(proxyEvent, partial) {
  switch (proxyEvent.type) {
    case "start":
      return {
        type: "start",
        partial,
      };
    case "text_start":
      partial.content[proxyEvent.contentIndex] = {
        type: "text",
        text: "",
        ...(proxyEvent.contentSignature !== void 0
          ? { textSignature: proxyEvent.contentSignature }
          : {}),
      };
      return {
        type: "text_start",
        contentIndex: proxyEvent.contentIndex,
        partial,
      };
    case "text_delta": {
      const content = partial.content[proxyEvent.contentIndex];
      if (content?.type === "text") {
        content.text += proxyEvent.delta;
        return {
          type: "text_delta",
          contentIndex: proxyEvent.contentIndex,
          delta: proxyEvent.delta,
          partial,
        };
      }
      throw new Error("Received text_delta for non-text content");
    }
    case "text_end": {
      const content = partial.content[proxyEvent.contentIndex];
      if (content?.type === "text") {
        if (proxyEvent.contentSignature !== void 0)
          content.textSignature = proxyEvent.contentSignature;
        return {
          type: "text_end",
          contentIndex: proxyEvent.contentIndex,
          content: content.text,
          partial,
        };
      }
      throw new Error("Received text_end for non-text content");
    }
    case "thinking_start":
      partial.content[proxyEvent.contentIndex] = {
        type: "thinking",
        thinking: "",
      };
      return {
        type: "thinking_start",
        contentIndex: proxyEvent.contentIndex,
        partial,
      };
    case "thinking_delta": {
      const content = partial.content[proxyEvent.contentIndex];
      if (content?.type === "thinking") {
        content.thinking += proxyEvent.delta;
        return {
          type: "thinking_delta",
          contentIndex: proxyEvent.contentIndex,
          delta: proxyEvent.delta,
          partial,
        };
      }
      throw new Error("Received thinking_delta for non-thinking content");
    }
    case "thinking_end": {
      const content = partial.content[proxyEvent.contentIndex];
      if (content?.type === "thinking") {
        content.thinkingSignature = proxyEvent.contentSignature;
        return {
          type: "thinking_end",
          contentIndex: proxyEvent.contentIndex,
          content: content.thinking,
          partial,
        };
      }
      throw new Error("Received thinking_end for non-thinking content");
    }
    case "toolcall_start":
      partial.content[proxyEvent.contentIndex] = {
        type: "toolCall",
        id: proxyEvent.id,
        name: proxyEvent.toolName,
        arguments: {},
        partialJson: "",
      };
      return {
        type: "toolcall_start",
        contentIndex: proxyEvent.contentIndex,
        partial,
      };
    case "toolcall_delta": {
      const content = partial.content[proxyEvent.contentIndex];
      if (content?.type === "toolCall") {
        const streamingContent = content;
        streamingContent.partialJson = `${streamingContent.partialJson ?? ""}${proxyEvent.delta}`;
        content.arguments = parseStreamingJson(streamingContent.partialJson) || {};
        partial.content[proxyEvent.contentIndex] = { ...content };
        return {
          type: "toolcall_delta",
          contentIndex: proxyEvent.contentIndex,
          delta: proxyEvent.delta,
          partial,
        };
      }
      throw new Error("Received toolcall_delta for non-toolCall content");
    }
    case "toolcall_end": {
      const content = partial.content[proxyEvent.contentIndex];
      if (content?.type === "toolCall") {
        delete content.partialJson;
        return {
          type: "toolcall_end",
          contentIndex: proxyEvent.contentIndex,
          toolCall: content,
          partial,
        };
      }
      return;
    }
    case "done":
      partial.stopReason = proxyEvent.reason;
      partial.usage = proxyEvent.usage;
      return {
        type: "done",
        reason: proxyEvent.reason,
        message: partial,
      };
    case "error":
      partial.stopReason = proxyEvent.reason;
      partial.errorMessage = proxyEvent.errorMessage;
      partial.usage = proxyEvent.usage;
      return {
        type: "error",
        reason: proxyEvent.reason,
        error: partial,
      };
    default:
      console.warn(`Unhandled proxy event type: ${proxyEvent.type}`);
      return;
  }
}
//#endregion
//#region src/plugin-sdk/agent-core.ts
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
const openClawAgentCoreRuntime = {
  completeSimple,
  streamSimple,
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
var Agent = class extends Agent$1 {
  constructor(options = {}) {
    super({
      runtime: openClawAgentCoreRuntime,
      ...options,
    });
  }
};
//#endregion
export {
  FileError as $,
  findTurnStartIndex as A,
  COMPACTION_SUMMARY_PREFIX as B,
  prepareBranchEntries as C,
  estimateContextTokens as D,
  compact as E,
  serializeConversation as F,
  createBranchSummaryMessage as G,
  asAgentMessage as H,
  Session as I,
  NodeExecutionEnv as J,
  createCompactionSummaryMessage as K,
  buildSessionContext as L,
  getLastAssistantUsage as M,
  prepareCompaction as N,
  estimateTokens as O,
  shouldCompact as P,
  ExecutionError as Q,
  BRANCH_SUMMARY_PREFIX as R,
  generateBranchSummary as S,
  calculateContextTokens as T,
  bashExecutionToText as U,
  COMPACTION_SUMMARY_SUFFIX as V,
  convertToLlm as W,
  BranchSummaryError as X,
  AgentHarnessError as Y,
  CompactionError as Z,
  formatPromptTemplateInvocation as _,
  DEFAULT_MAX_LINES as a,
  runAgentLoopContinue as at,
  collectEntriesForBranchSummary as b,
  truncateHead as c,
  resolveAgentCoreCompleteFn as ct,
  InMemorySessionStorage as d,
  SessionError as et,
  JsonlSessionStorage as f,
  formatSkillInvocation as g,
  CoreAgentHarness as h,
  DEFAULT_MAX_BYTES as i,
  runAgentLoop as it,
  generateSummary as j,
  findCutPoint as k,
  truncateLine as l,
  resolveAgentCoreStreamFn as lt,
  uuidv7 as m,
  openClawAgentCoreRuntime as n,
  agentLoop as nt,
  GREP_MAX_LINE_LENGTH as o,
  validateToolArguments as ot,
  loadJsonlSessionMetadata as p,
  createCustomMessage as q,
  streamProxy as r,
  agentLoopContinue as rt,
  formatSize as s,
  validateToolCall as st,
  Agent as t,
  toError as tt,
  truncateTail as u,
  parseCommandArgs as v,
  DEFAULT_COMPACTION_SETTINGS as w,
  collectEntriesForBranchSummaryFromBranches as x,
  substituteArgs as y,
  BRANCH_SUMMARY_SUFFIX as z,
};
