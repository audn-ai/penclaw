import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import {
  n as normalizeAllowedToolNames,
  t as isAllowedToolCallName,
} from "./tool-call-shared-BoRDqDVC.js";
//#region src/agents/thinking-block.ts
function isThinkingLikeBlock(block) {
  if (!block || typeof block !== "object") return false;
  const type = block.type;
  return type === "thinking" || type === "redacted_thinking";
}
//#endregion
//#region src/agents/tool-call-id.ts
/**
 * Tool call id normalization and extraction helpers.
 *
 * Keeps provider-specific id formats replay-safe while preserving allowed native ids.
 */
const NATIVE_ANTHROPIC_TOOL_USE_ID_RE = /^toolu_[A-Za-z0-9_]+$/;
const NATIVE_KIMI_TOOL_CALL_ID_RE = /^functions\.[A-Za-z0-9_-]+:\d+$/;
const OPENAI_TOOL_CALL_ID_RE = /^call_[A-Za-z0-9_-]+$/;
const STRICT9_LEN = 9;
const TOOL_CALL_TYPES = /* @__PURE__ */ new Set(["toolCall", "toolUse", "functionCall"]);
/**
 * Sanitize a tool call ID to be compatible with various providers.
 *
 * - "strict" mode: only [a-zA-Z0-9]
 * - "strict9" mode: only [a-zA-Z0-9], length 9 (Mistral tool call requirement)
 */
function sanitizeToolCallId(id, mode = "strict") {
  if (!id || typeof id !== "string") {
    if (mode === "strict9") return "defaultid";
    return "defaulttoolid";
  }
  if (mode === "strict9") {
    const alphanumericOnly = id.replace(/[^a-zA-Z0-9]/g, "");
    if (alphanumericOnly.length >= STRICT9_LEN) return alphanumericOnly.slice(0, STRICT9_LEN);
    if (alphanumericOnly.length > 0) return shortHash(alphanumericOnly, STRICT9_LEN);
    return shortHash("sanitized", STRICT9_LEN);
  }
  if (isNativeKimiToolCallId(id)) return id;
  const alphanumericOnly = id.replace(/[^a-zA-Z0-9]/g, "");
  return alphanumericOnly.length > 0 ? alphanumericOnly : "sanitizedtoolid";
}
function extractToolCallsFromAssistant(msg) {
  const content = msg.content;
  if (!Array.isArray(content)) return [];
  const toolCalls = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const rec = block;
    if (typeof rec.id !== "string" || !rec.id) continue;
    if (typeof rec.type === "string" && TOOL_CALL_TYPES.has(rec.type))
      toolCalls.push({
        id: rec.id,
        name: typeof rec.name === "string" ? rec.name : void 0,
      });
  }
  return toolCalls;
}
function extractToolResultId(msg) {
  return extractToolResultIds(msg)[0] ?? null;
}
function extractToolResultIds(msg) {
  const ids = [];
  const record = msg;
  for (const value of [
    record.toolCallId,
    record.toolUseId,
    record.tool_call_id,
    record.tool_use_id,
    record.callId,
    record.call_id,
  ]) {
    if (typeof value !== "string") continue;
    const id = value.trim();
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
}
function hasToolCallInput(block) {
  const hasInput = "input" in block ? block.input !== void 0 && block.input !== null : false;
  const hasArguments =
    "arguments" in block ? block.arguments !== void 0 && block.arguments !== null : false;
  return hasInput || hasArguments;
}
function toolCallNeedsReplayMutation(block) {
  const rawName = typeof block.name === "string" ? block.name : void 0;
  const trimmedName = rawName?.trim();
  return Boolean(rawName) && rawName !== trimmedName;
}
function isReplaySafeThinkingAssistantMessage(message, allowedToolNames) {
  const content = message.content;
  if (!Array.isArray(content)) return false;
  let sawThinking = false;
  let sawToolCall = false;
  const seenToolCallIds = /* @__PURE__ */ new Set();
  for (const block of content) {
    if (isThinkingLikeBlock(block)) {
      sawThinking = true;
      continue;
    }
    if (!block || typeof block !== "object") continue;
    const typedBlock = block;
    if (typeof typedBlock.type !== "string" || !TOOL_CALL_TYPES.has(typedBlock.type)) continue;
    sawToolCall = true;
    const toolCallId = typeof typedBlock.id === "string" ? typedBlock.id.trim() : "";
    if (
      !hasToolCallInput(typedBlock) ||
      !toolCallId ||
      seenToolCallIds.has(toolCallId) ||
      !isAllowedToolCallName(typedBlock.name, allowedToolNames) ||
      toolCallNeedsReplayMutation(typedBlock)
    )
      return false;
    seenToolCallIds.add(toolCallId);
  }
  return sawThinking && sawToolCall;
}
function collectReplaySafeThinkingToolIds(messages, allowedToolNames) {
  const reserved = /* @__PURE__ */ new Set();
  const preservedIndexes = /* @__PURE__ */ new Set();
  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
    if (!message || typeof message !== "object" || message.role !== "assistant") continue;
    const assistant = message;
    if (!isReplaySafeThinkingAssistantMessage(assistant, allowedToolNames)) continue;
    const toolCalls = extractToolCallsFromAssistant(assistant);
    if (toolCalls.some((toolCall) => reserved.has(toolCall.id))) continue;
    preservedIndexes.add(index);
    for (const toolCall of toolCalls) reserved.add(toolCall.id);
  }
  return {
    reservedIds: reserved,
    preservedIndexes,
  };
}
function shortHash(text, length = 8) {
  return sha256HexPrefix(text, length);
}
function isNativeAnthropicToolUseId(id) {
  return NATIVE_ANTHROPIC_TOOL_USE_ID_RE.test(id);
}
function isNativeKimiToolCallId(id) {
  return NATIVE_KIMI_TOOL_CALL_ID_RE.test(id);
}
function makeUniqueToolId(params) {
  if (params.mode === "strict9") {
    const base = sanitizeToolCallId(params.id, params.mode);
    const candidate = base.length >= STRICT9_LEN ? base.slice(0, STRICT9_LEN) : "";
    if (candidate && !params.used.has(candidate)) return candidate;
    for (let i = 0; i < 1e3; i += 1) {
      const hashed = shortHash(`${params.id}:${i}`, STRICT9_LEN);
      if (!params.used.has(hashed)) return hashed;
    }
    return shortHash(`${params.id}:${Date.now()}`, STRICT9_LEN);
  }
  const MAX_LEN = 40;
  const base = sanitizeToolCallId(params.id, params.mode).slice(0, MAX_LEN);
  if (!params.used.has(base)) return base;
  const hash = shortHash(params.id);
  const separator = params.mode === "strict" ? "" : "_";
  const maxBaseLen = MAX_LEN - separator.length - hash.length;
  const candidate = `${base.length > maxBaseLen ? base.slice(0, maxBaseLen) : base}${separator}${hash}`;
  if (!params.used.has(candidate)) return candidate;
  for (let i = 2; i < 1e3; i += 1) {
    const suffix = params.mode === "strict" ? `x${i}` : `_${i}`;
    const next = `${candidate.slice(0, MAX_LEN - suffix.length)}${suffix}`;
    if (!params.used.has(next)) return next;
  }
  const ts = params.mode === "strict" ? `t${Date.now()}` : `_${Date.now()}`;
  return `${candidate.slice(0, MAX_LEN - ts.length)}${ts}`;
}
function createOccurrenceAwareResolver(mode, options) {
  const used = new Set(options?.reservedIds ?? []);
  const assistantOccurrences = /* @__PURE__ */ new Map();
  const orphanToolResultOccurrences = /* @__PURE__ */ new Map();
  const pendingByRawId = /* @__PURE__ */ new Map();
  const preserveNativeAnthropicToolUseIds = options?.preserveNativeAnthropicToolUseIds === true;
  const duplicateToolCallIdStyle = options?.duplicateToolCallIdStyle;
  const allocate = (seed) => {
    const next = makeUniqueToolId({
      id: seed,
      used,
      mode,
    });
    used.add(next);
    return next;
  };
  const allocateOpenAIStyleId = (id, occurrence) => {
    for (let attempt = 0; ; attempt += 1) {
      const candidate = `call_${shortHash(`${id}:${occurrence}:${attempt}`, 24)}`;
      if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
      }
    }
  };
  const allocatePreservingNativeAnthropicId = (id, occurrence) => {
    if (
      duplicateToolCallIdStyle === "openai" &&
      occurrence === 1 &&
      OPENAI_TOOL_CALL_ID_RE.test(id) &&
      !used.has(id)
    ) {
      used.add(id);
      return id;
    }
    if (
      preserveNativeAnthropicToolUseIds &&
      isNativeAnthropicToolUseId(id) &&
      occurrence === 1 &&
      !used.has(id)
    ) {
      used.add(id);
      return id;
    }
    return allocate(occurrence === 1 ? id : `${id}:${occurrence}`);
  };
  const resolveAssistantId = (id) => {
    const occurrence = (assistantOccurrences.get(id) ?? 0) + 1;
    assistantOccurrences.set(id, occurrence);
    const next =
      duplicateToolCallIdStyle === "openai" && occurrence > 1
        ? allocateOpenAIStyleId(id, occurrence)
        : allocatePreservingNativeAnthropicId(id, occurrence);
    const pending = pendingByRawId.get(id);
    if (pending) pending.push(next);
    else pendingByRawId.set(id, [next]);
    return next;
  };
  const resolveToolResultId = (id) => {
    const pending = pendingByRawId.get(id);
    if (pending && pending.length > 0) {
      const next = pending.shift();
      if (pending.length === 0) pendingByRawId.delete(id);
      return next;
    }
    const occurrence = (orphanToolResultOccurrences.get(id) ?? 0) + 1;
    orphanToolResultOccurrences.set(id, occurrence);
    if (
      preserveNativeAnthropicToolUseIds &&
      isNativeAnthropicToolUseId(id) &&
      occurrence === 1 &&
      !used.has(id)
    ) {
      used.add(id);
      return id;
    }
    return allocate(`${id}:tool_result:${occurrence}`);
  };
  const preserveAssistantId = (id) => {
    used.add(id);
    const pending = pendingByRawId.get(id);
    if (pending) pending.push(id);
    else pendingByRawId.set(id, [id]);
    return id;
  };
  return {
    resolveAssistantId,
    resolveToolResultId,
    preserveAssistantId,
  };
}
function rewriteAssistantToolCallIds(params) {
  const content = params.message.content;
  if (!Array.isArray(content)) return params.message;
  let changed = false;
  const next = content.map((block) => {
    if (!block || typeof block !== "object") return block;
    const rec = block;
    const type = rec.type;
    const id = rec.id;
    if (
      (type !== "functionCall" && type !== "toolUse" && type !== "toolCall") ||
      typeof id !== "string" ||
      !id
    )
      return block;
    const nextId = params.resolveId(id);
    if (nextId === id) return block;
    changed = true;
    return Object.assign({}, block, { id: nextId });
  });
  if (!changed) return params.message;
  return {
    ...params.message,
    content: next,
  };
}
function rewriteToolResultIds(params) {
  const idFields = ["toolCallId", "toolUseId", "tool_call_id", "tool_use_id", "callId", "call_id"];
  const record = params.message;
  const rawIds = /* @__PURE__ */ new Map();
  for (const field of idFields) {
    const rawId = record[field];
    if (typeof rawId === "string" && rawId) rawIds.set(field, rawId);
  }
  const primaryRawId =
    rawIds.get("call_id") ??
    rawIds.get("callId") ??
    rawIds.get("tool_call_id") ??
    rawIds.get("tool_use_id") ??
    rawIds.get("toolCallId") ??
    rawIds.get("toolUseId");
  if (!primaryRawId) return params.message;
  const resolvedId = params.resolveId(primaryRawId);
  const updates = {};
  for (const [field, rawId] of rawIds) if (resolvedId !== rawId) updates[field] = resolvedId;
  if (typeof record.toolCallId !== "string" && resolvedId) updates.toolCallId = resolvedId;
  if (Object.keys(updates).length === 0) return params.message;
  return {
    ...params.message,
    ...updates,
  };
}
/**
 * Sanitize tool call IDs for provider compatibility.
 *
 * @param messages - The messages to sanitize
 * @param mode - "strict" (alphanumeric only) or "strict9" (alphanumeric length 9)
 * @param options.duplicateToolCallIdStyle - Optional provider-safe style for repeated IDs
 */
function sanitizeToolCallIdsForCloudCodeAssist(messages, mode = "strict", options) {
  const allowedToolNames = normalizeAllowedToolNames(options?.allowedToolNames);
  const replaySafeThinking =
    options?.preserveReplaySafeThinkingToolCallIds === true
      ? collectReplaySafeThinkingToolIds(messages, allowedToolNames)
      : void 0;
  const { resolveAssistantId, resolveToolResultId, preserveAssistantId } =
    createOccurrenceAwareResolver(mode, {
      ...options,
      reservedIds: replaySafeThinking?.reservedIds,
    });
  let changed = false;
  const out = messages.map((msg, index) => {
    if (!msg || typeof msg !== "object") return msg;
    const role = msg.role;
    if (role === "assistant") {
      const assistant = msg;
      if (replaySafeThinking?.preservedIndexes.has(index)) {
        for (const toolCall of extractToolCallsFromAssistant(assistant))
          preserveAssistantId(toolCall.id);
        return msg;
      }
      const next = rewriteAssistantToolCallIds({
        message: assistant,
        resolveId: resolveAssistantId,
      });
      if (next !== msg) changed = true;
      return next;
    }
    if (role === "toolResult") {
      const next = rewriteToolResultIds({
        message: msg,
        resolveId: resolveToolResultId,
      });
      if (next !== msg) changed = true;
      return next;
    }
    return msg;
  });
  return changed ? out : messages;
}
//#endregion
export {
  isThinkingLikeBlock as a,
  sanitizeToolCallIdsForCloudCodeAssist as i,
  extractToolResultId as n,
  extractToolResultIds as r,
  extractToolCallsFromAssistant as t,
};
