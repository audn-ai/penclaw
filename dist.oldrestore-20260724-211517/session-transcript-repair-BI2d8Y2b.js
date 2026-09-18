import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  p as readStringValue,
  t as hasNonEmptyString,
} from "./string-coerce-DW4mBlAt.js";
import {
  a as isThinkingLikeBlock,
  n as extractToolResultId,
  r as extractToolResultIds,
  t as extractToolCallsFromAssistant,
} from "./tool-call-id-Bl60ujZe.js";
import {
  n as normalizeAllowedToolNames,
  t as isAllowedToolCallName,
} from "./tool-call-shared-BoRDqDVC.js";
//#region src/agents/session-transcript-repair.ts
/**
 * Transcript repair helpers for tool-call replay.
 *
 * Normalizes raw tool-call blocks and synthesizes missing tool results without rewriting trusted local payloads.
 */
const RAW_TOOL_CALL_BLOCK_TYPES = /* @__PURE__ */ new Set([
  "toolCall",
  "toolUse",
  "functionCall",
  "tool_call",
  "tool_use",
  "function_call",
]);
function isRawToolCallBlock(block) {
  if (!block || typeof block !== "object") return false;
  const type = block.type;
  return typeof type === "string" && RAW_TOOL_CALL_BLOCK_TYPES.has(type);
}
function hasToolCallInput(block) {
  const hasInput = "input" in block ? block.input !== void 0 && block.input !== null : false;
  const hasArguments =
    "arguments" in block ? block.arguments !== void 0 && block.arguments !== null : false;
  return hasInput || hasArguments;
}
function hasToolCallId(block) {
  return (
    hasNonEmptyString(block.id) ||
    hasNonEmptyString(block.call_id) ||
    hasNonEmptyString(block.toolCallId) ||
    hasNonEmptyString(block.toolUseId) ||
    hasNonEmptyString(block.tool_call_id) ||
    hasNonEmptyString(block.tool_use_id)
  );
}
function hasPartialJson(block) {
  return typeof block.partialJson === "string";
}
function isCompleteJsonObject(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
  } catch {
    return false;
  }
}
function isFinalizedOpenAIResponsesToolCall(message, block) {
  if (
    message.role !== "assistant" ||
    !("stopReason" in message) ||
    message.stopReason !== "toolUse" ||
    !hasPartialJson(block) ||
    typeof block.id !== "string" ||
    "input" in block ||
    !block.arguments ||
    typeof block.arguments !== "object" ||
    Array.isArray(block.arguments) ||
    (!isCompleteJsonObject(block.partialJson) &&
      (block.partialJson.trim() !== "" || Object.keys(block.arguments).length > 0))
  )
    return false;
  const separator = block.id.indexOf("|");
  return separator > 0 && separator < block.id.length - 1;
}
function sanitizeToolCallBlock(block) {
  const rawName = readStringValue(block.name);
  const trimmedName = rawName?.trim();
  const hasTrimmedName = typeof trimmedName === "string" && trimmedName.length > 0;
  const normalizedName = hasTrimmedName ? trimmedName : void 0;
  const nameChanged = hasTrimmedName && rawName !== trimmedName;
  if (!nameChanged) return block;
  const next = { ...block };
  if (nameChanged && normalizedName) next.name = normalizedName;
  return next;
}
function countRawToolCallBlocks(content) {
  let count = 0;
  for (const block of content) if (isRawToolCallBlock(block)) count += 1;
  return count;
}
function isReplaySafeThinkingAssistantTurn(content, allowedToolNames) {
  let sawToolCall = false;
  const seenToolCallIds = /* @__PURE__ */ new Set();
  for (const block of content) {
    if (!isRawToolCallBlock(block)) continue;
    sawToolCall = true;
    const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
    if (
      !hasToolCallInput(block) ||
      hasPartialJson(block) ||
      !toolCallId ||
      seenToolCallIds.has(toolCallId) ||
      !isAllowedToolCallName(block.name, allowedToolNames)
    )
      return false;
    seenToolCallIds.add(toolCallId);
    if (sanitizeToolCallBlock(block) !== block) return false;
  }
  return sawToolCall;
}
function hasSessionsSpawnAttachmentToolCall(content) {
  for (const block of content) {
    if (!isRawToolCallBlock(block) || block.name !== "sessions_spawn") continue;
    const input = block.input;
    if (!input || typeof input !== "object") continue;
    const attachments = input.attachments;
    if (Array.isArray(attachments) && attachments.length > 0) return true;
  }
  return false;
}
const DEFAULT_MISSING_TOOL_RESULT_TEXT =
  "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.";
const SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY = "openclawSyntheticMissingToolResult";
function makeMissingToolResult(params) {
  return {
    role: "toolResult",
    toolCallId: params.toolCallId,
    toolName: params.toolName ?? "unknown",
    content: [
      {
        type: "text",
        text: params.text ?? DEFAULT_MISSING_TOOL_RESULT_TEXT,
      },
    ],
    details: { [SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true },
    isError: true,
    timestamp: Date.now(),
  };
}
function isSyntheticMissingToolResult(msg) {
  if (!msg.isError) return false;
  const details = msg.details;
  if (
    details &&
    typeof details === "object" &&
    details[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY] === true
  )
    return true;
  const content = msg.content;
  if (!Array.isArray(content)) return false;
  return content.some(
    (block) =>
      typeof block === "object" &&
      block !== null &&
      block.type === "text" &&
      block.text === DEFAULT_MISSING_TOOL_RESULT_TEXT,
  );
}
function normalizeToolResultName(message, fallbackName) {
  const rawToolName = message.toolName;
  const normalizedToolName = normalizeOptionalString(rawToolName);
  if (normalizedToolName) {
    if (rawToolName === normalizedToolName) return message;
    return {
      ...message,
      toolName: normalizedToolName,
    };
  }
  const normalizedFallback = normalizeOptionalString(fallbackName);
  if (normalizedFallback)
    return {
      ...message,
      toolName: normalizedFallback,
    };
  if (typeof rawToolName === "string")
    return {
      ...message,
      toolName: "unknown",
    };
  return message;
}
function normalizeLegacyToolResultId(message, toolCalls) {
  if (extractToolResultId(message) || toolCalls.length !== 1) return message;
  const [toolCall] = toolCalls;
  if (!toolCall) return message;
  const toolResultName = normalizeOptionalString(message.toolName);
  const toolCallName = normalizeOptionalString(toolCall.name);
  if (toolResultName && toolCallName && toolResultName !== toolCallName) return message;
  return {
    ...message,
    toolCallId: toolCall.id,
    isError: true,
  };
}
function stripToolResultDetails(messages) {
  let touched = false;
  const out = [];
  for (const msg of messages) {
    if (!msg || typeof msg !== "object" || msg.role !== "toolResult") {
      out.push(msg);
      continue;
    }
    if (!("details" in msg)) {
      out.push(msg);
      continue;
    }
    const sanitized = { ...msg };
    delete sanitized.details;
    touched = true;
    out.push(sanitized);
  }
  return touched ? out : messages;
}
function collectFollowingToolResults(messages, index) {
  const ids = /* @__PURE__ */ new Set();
  const assistant = messages[index];
  const currentToolCalls =
    assistant && typeof assistant === "object" && assistant.role === "assistant"
      ? extractToolCallsFromAssistant(assistant)
      : [];
  let sawNonToolResult = false;
  let displaced = false;
  for (let nextIndex = index + 1; nextIndex < messages.length; nextIndex += 1) {
    const message = messages[nextIndex];
    if (!message || typeof message !== "object") {
      sawNonToolResult = true;
      continue;
    }
    if (message.role === "assistant" && assistantHasToolCalls(message)) break;
    if (message.role === "toolResult") {
      const resultIds = extractToolResultIds(
        normalizeLegacyToolResultId(message, currentToolCalls),
      );
      for (const id of resultIds) ids.add(id);
      displaced ||= resultIds.length > 0 && sawNonToolResult;
      continue;
    }
    sawNonToolResult = true;
  }
  return {
    ids,
    displaced,
  };
}
function repairToolCallInputs(messages, options) {
  let droppedToolCalls = 0;
  let droppedAssistantMessages = 0;
  let changed = false;
  const out = [];
  const allowedToolNames = normalizeAllowedToolNames(options?.allowedToolNames);
  const allowProviderOwnedThinkingReplay = options?.allowProviderOwnedThinkingReplay === true;
  const preservedThinkingToolCallIds = /* @__PURE__ */ new Set();
  const priorToolCallIds = /* @__PURE__ */ new Set();
  for (const [index, msg] of messages.entries()) {
    if (!msg || typeof msg !== "object") {
      changed = true;
      continue;
    }
    if (msg.role !== "assistant" || !Array.isArray(msg.content)) {
      out.push(msg);
      continue;
    }
    if (
      allowProviderOwnedThinkingReplay &&
      msg.content.some((block) => isThinkingLikeBlock(block)) &&
      countRawToolCallBlocks(msg.content) > 0
    ) {
      const replaySafeToolCalls = extractToolCallsFromAssistant(msg);
      const followingToolResults = collectFollowingToolResults(messages, index);
      if (
        isReplaySafeThinkingAssistantTurn(msg.content, allowedToolNames) &&
        replaySafeToolCalls.every(
          (toolCall) =>
            !preservedThinkingToolCallIds.has(toolCall.id) &&
            (!hasSessionsSpawnAttachmentToolCall(msg.content) ||
              followingToolResults.ids.has(toolCall.id)) &&
            (!followingToolResults.displaced || !priorToolCallIds.has(toolCall.id)),
        )
      ) {
        for (const toolCall of replaySafeToolCalls) {
          preservedThinkingToolCallIds.add(toolCall.id);
          priorToolCallIds.add(toolCall.id);
        }
        changed ||= followingToolResults.displaced;
        out.push(msg);
      } else {
        droppedToolCalls += countRawToolCallBlocks(msg.content);
        droppedAssistantMessages += 1;
        changed = true;
      }
      continue;
    }
    const nextContent = [];
    let droppedInMessage = 0;
    let messageChanged = false;
    for (const block of msg.content) {
      if (isRawToolCallBlock(block)) {
        if (
          !hasToolCallInput(block) ||
          !hasToolCallId(block) ||
          !isAllowedToolCallName(block.name, allowedToolNames)
        ) {
          droppedToolCalls += 1;
          droppedInMessage += 1;
          changed = true;
          messageChanged = true;
          continue;
        }
      }
      let workBlock = block;
      if (isRawToolCallBlock(block) && hasPartialJson(block)) {
        if (!isFinalizedOpenAIResponsesToolCall(msg, block)) {
          droppedToolCalls += 1;
          droppedInMessage += 1;
          changed = true;
          messageChanged = true;
          continue;
        }
        const stripped = { ...block };
        delete stripped.partialJson;
        workBlock = stripped;
        changed = true;
        messageChanged = true;
      }
      if (isRawToolCallBlock(workBlock)) {
        if (RAW_TOOL_CALL_BLOCK_TYPES.has(workBlock.type ?? "")) {
          if (
            normalizeLowercaseStringOrEmpty(
              typeof workBlock.name === "string" ? workBlock.name.trim() : void 0,
            ) === "sessions_spawn"
          ) {
            const sanitized = sanitizeToolCallBlock(workBlock);
            if (sanitized !== workBlock) {
              changed = true;
              messageChanged = true;
            }
            nextContent.push(sanitized);
          } else if (typeof workBlock.name === "string") {
            const rawName = workBlock.name;
            const trimmedName = rawName.trim();
            if (rawName !== trimmedName && trimmedName) {
              const renamed = {
                ...workBlock,
                name: trimmedName,
              };
              nextContent.push(renamed);
              changed = true;
              messageChanged = true;
            } else nextContent.push(workBlock);
          } else nextContent.push(workBlock);
          continue;
        }
      }
      nextContent.push(workBlock);
    }
    if (droppedInMessage > 0) {
      if (nextContent.length === 0) {
        droppedAssistantMessages += 1;
        changed = true;
        continue;
      }
      const nextMessage = {
        ...msg,
        content: nextContent,
      };
      for (const toolCall of extractToolCallsFromAssistant(nextMessage))
        priorToolCallIds.add(toolCall.id);
      out.push(nextMessage);
      continue;
    }
    if (messageChanged) {
      const nextMessage = {
        ...msg,
        content: nextContent,
      };
      for (const toolCall of extractToolCallsFromAssistant(nextMessage))
        priorToolCallIds.add(toolCall.id);
      out.push(nextMessage);
      continue;
    }
    for (const toolCall of extractToolCallsFromAssistant(msg)) priorToolCallIds.add(toolCall.id);
    out.push(msg);
  }
  return {
    messages: changed ? out : messages,
    droppedToolCalls,
    droppedAssistantMessages,
  };
}
function sanitizeToolCallInputs(messages, options) {
  return repairToolCallInputs(messages, options).messages;
}
function sanitizeToolUseResultPairing(messages, options) {
  return repairToolUseResultPairing(messages, options).messages;
}
function shouldDropErroredAssistantResults(options) {
  return options?.erroredAssistantResultPolicy === "drop";
}
function assistantHasToolCalls(message) {
  if (!message || typeof message !== "object" || message.role !== "assistant") return false;
  return extractToolCallsFromAssistant(message).length > 0;
}
function collectLaterMatchingToolResults(params) {
  const resultsById = /* @__PURE__ */ new Map();
  const toolCallIds = new Set(params.toolCalls.map((toolCall) => toolCall.id));
  for (let index = params.startIndex; index < params.messages.length; index += 1) {
    const candidate = params.messages[index];
    if (!candidate || typeof candidate !== "object" || candidate.role !== "toolResult") continue;
    const normalizedLegacyResult = normalizeLegacyToolResultId(candidate, params.toolCalls);
    const id = extractToolResultId(normalizedLegacyResult);
    if (!id || !toolCallIds.has(id) || params.seenToolResultIds.has(id) || resultsById.has(id))
      continue;
    resultsById.set(
      id,
      normalizeToolResultName(normalizedLegacyResult, params.toolNamesById.get(id)),
    );
  }
  return resultsById;
}
function repairToolUseResultPairing(messages, options) {
  const out = [];
  const added = [];
  const seenToolResultIds = /* @__PURE__ */ new Set();
  const toolResultPositions = /* @__PURE__ */ new Map();
  let droppedDuplicateCount = 0;
  let droppedOrphanCount = 0;
  let moved = false;
  let changed = false;
  const pushToolResult = (msg) => {
    const id = extractToolResultId(msg);
    if (id && seenToolResultIds.has(id)) {
      const existingIdx = toolResultPositions.get(id);
      if (existingIdx !== void 0) {
        const existing = out[existingIdx];
        if (
          existing &&
          isSyntheticMissingToolResult(existing) &&
          !isSyntheticMissingToolResult(msg)
        ) {
          out[existingIdx] = msg;
          const addedIdx = added.findIndex((a) => extractToolResultId(a) === id);
          if (addedIdx !== -1) added.splice(addedIdx, 1);
          droppedDuplicateCount += 1;
          changed = true;
          return;
        }
      }
      droppedDuplicateCount += 1;
      changed = true;
      return;
    }
    if (id) {
      seenToolResultIds.add(id);
      toolResultPositions.set(id, out.length);
    }
    out.push(msg);
  };
  for (let i = 0; i < messages.length; i += 1) {
    const msg = messages.at(i);
    if (!msg || typeof msg !== "object") {
      changed = true;
      continue;
    }
    const role = msg.role;
    if (role !== "assistant") {
      if (role !== "toolResult") out.push(msg);
      else {
        droppedOrphanCount += 1;
        changed = true;
      }
      continue;
    }
    const assistant = msg;
    const toolCalls = extractToolCallsFromAssistant(assistant);
    if (toolCalls.length === 0) {
      out.push(msg);
      continue;
    }
    const toolCallIds = /* @__PURE__ */ new Set();
    const toolCallNamesById = /* @__PURE__ */ new Map();
    for (const toolCall of toolCalls) {
      toolCallIds.add(toolCall.id);
      if (typeof toolCall.name === "string") toolCallNamesById.set(toolCall.id, toolCall.name);
    }
    const spanResultsById = /* @__PURE__ */ new Map();
    const remainder = [];
    let j = i + 1;
    for (; j < messages.length; j += 1) {
      const next = messages.at(j);
      if (!next || typeof next !== "object") {
        changed = true;
        continue;
      }
      const nextRole = next.role;
      if (nextRole === "assistant") {
        if (assistantHasToolCalls(next)) break;
        remainder.push(next);
        continue;
      }
      if (nextRole === "toolResult") {
        const toolResult = normalizeLegacyToolResultId(next, toolCalls);
        const id = extractToolResultId(toolResult);
        if (id && seenToolResultIds.has(id)) {
          pushToolResult(normalizeToolResultName(toolResult, toolCallNamesById.get(id)));
          continue;
        }
        if (id && toolCallIds.has(id)) {
          if (toolResult !== next) changed = true;
          const normalizedToolResult = normalizeToolResultName(
            toolResult,
            toolCallNamesById.get(id),
          );
          if (normalizedToolResult !== toolResult) changed = true;
          const existingSpan = spanResultsById.get(id);
          if (!existingSpan) spanResultsById.set(id, normalizedToolResult);
          else if (
            isSyntheticMissingToolResult(existingSpan) &&
            !isSyntheticMissingToolResult(normalizedToolResult)
          ) {
            spanResultsById.set(id, normalizedToolResult);
            droppedDuplicateCount += 1;
            changed = true;
          } else {
            droppedDuplicateCount += 1;
            changed = true;
          }
          continue;
        }
      }
      if (nextRole !== "toolResult") remainder.push(next);
      else {
        droppedOrphanCount += 1;
        changed = true;
      }
    }
    const stopReason = assistant.stopReason;
    if (stopReason === "error" || stopReason === "aborted") {
      if (!shouldDropErroredAssistantResults(options)) {
        out.push(msg);
        for (const toolCall of toolCalls) {
          const result = spanResultsById.get(toolCall.id);
          if (!result) continue;
          pushToolResult(result);
        }
      } else if (spanResultsById.size > 0) changed = true;
      else changed = true;
      for (const rem of remainder) out.push(rem);
      i = j - 1;
      continue;
    }
    out.push(msg);
    if (spanResultsById.size > 0 && remainder.length > 0) {
      moved = true;
      changed = true;
    }
    const laterResultsById = collectLaterMatchingToolResults({
      messages,
      startIndex: j,
      toolCalls,
      toolNamesById: toolCallNamesById,
      seenToolResultIds,
    });
    for (const call of toolCalls) {
      const existing = spanResultsById.get(call.id);
      if (existing) pushToolResult(existing);
      else {
        const laterResult = laterResultsById.get(call.id);
        if (laterResult) {
          laterResultsById.delete(call.id);
          moved = true;
          changed = true;
          pushToolResult(laterResult);
        } else {
          const missing = makeMissingToolResult({
            toolCallId: call.id,
            toolName: call.name,
            text: options?.missingToolResultText,
          });
          added.push(missing);
          changed = true;
          pushToolResult(missing);
        }
      }
    }
    for (const rem of remainder) {
      if (!rem || typeof rem !== "object") {
        out.push(rem);
        continue;
      }
      out.push(rem);
    }
    i = j - 1;
  }
  const changedOrMoved = changed || moved;
  return {
    messages: changedOrMoved ? out : messages,
    added,
    droppedDuplicateCount,
    droppedOrphanCount,
    moved: changedOrMoved,
  };
}
//#endregion
export {
  stripToolResultDetails as a,
  sanitizeToolUseResultPairing as i,
  repairToolUseResultPairing as n,
  sanitizeToolCallInputs as r,
  makeMissingToolResult as t,
};
