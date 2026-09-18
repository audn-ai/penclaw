import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { r as applyInputProvenanceToUserMessage } from "./input-provenance-Xst3EirW.js";
import {
  i as jsonUtf8BytesOrInfinity,
  n as firstEnumerableOwnKeys,
  t as boundedJsonUtf8Bytes,
} from "./json-utf8-bytes-C14lActR.js";
import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
import {
  d as redactToolPayloadTextWithConfig,
  o as redactSensitiveFieldValueWithConfig,
  r as isSensitiveFieldKey,
} from "./redact-CUe6Oey5.js";
import { Wt as redactTranscriptMessage } from "./session-accessor-PZVNxFCV.js";
import {
  r as sanitizeToolCallInputs,
  t as makeMissingToolResult,
} from "./session-transcript-repair-BI2d8Y2b.js";
import {
  At as takeRuntimeUserTurnTranscriptRecorder,
  Ot as attachRuntimeUserTurnTranscriptRecorder,
  kt as takeRuntimeUserTurnTranscriptContext,
} from "./sessions-Duh5damM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  n as extractToolResultId,
  t as extractToolCallsFromAssistant,
} from "./tool-call-id-Bl60ujZe.js";
import {
  d as truncateToolResultMessage,
  f as formatContextLimitTruncationNotice,
  o as resolveLiveToolResultMaxChars,
  t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS,
} from "./tool-result-truncation-B3T_nFx6.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-BodrDS39.js";
import { c as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-BDZ_IroQ.js";
import {
  d as setRawSessionAppendMessage,
  u as getRawSessionAppendMessage,
} from "./transcript-rewrite-BBGM2z7j.js";
import {
  i as mergePreparedUserTurnMessageForRuntime,
  s as restorePreparedUserTurnOperationalMetaForRuntime,
} from "./user-turn-transcript-DGJJ5XRn.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/session-tool-result-state.ts
/** Tracks pending tool calls so sanitized transcript repair can flush in order. */
function createPendingToolCallState() {
  const pending = /* @__PURE__ */ new Map();
  return {
    size: () => pending.size,
    entries: () => pending.entries(),
    getToolName: (id) => pending.get(id),
    delete: (id) => {
      pending.delete(id);
    },
    clear: () => {
      pending.clear();
    },
    trackToolCalls: (calls) => {
      for (const call of calls) pending.set(call.id, call.name);
    },
    getPendingIds: () => Array.from(pending.keys()),
    shouldFlushForSanitizedDrop: () => pending.size > 0,
    shouldFlushBeforeNonToolResult: (nextRole, toolCallCount) =>
      pending.size > 0 && (toolCallCount === 0 || nextRole !== "assistant"),
    shouldFlushBeforeNewToolCalls: (toolCallCount) => pending.size > 0 && toolCallCount > 0,
  };
}
//#endregion
//#region src/agents/session-tool-result-guard.ts
/**
 * Session transcript guard for tool-call/result consistency.
 *
 * Caps large tool results, repairs missing results, applies redaction, and emits transcript update events.
 */
/**
 * Truncate oversized text content blocks in a tool result message.
 * Returns the original message if under the limit, or a new message with
 * truncated text blocks otherwise.
 */
function capToolResultSize(msg, maxChars) {
  if (msg.role !== "toolResult") return msg;
  return truncateToolResultMessage(msg, maxChars, {
    suffix: (truncatedChars) => formatContextLimitTruncationNotice(truncatedChars),
    minKeepChars: 2e3,
  });
}
function resolveMaxToolResultChars(opts) {
  return resolveIntegerOption(opts?.maxToolResultChars, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS, {
    min: 1,
  });
}
function isUserAgentMessage(message) {
  return message.role === "user";
}
function isExpectedCompactionAppend(entryId, appendedText) {
  const lines = appendedText
    .trimEnd()
    .split("\n")
    .filter((line) => line.length > 0);
  if (lines.length !== 1) return false;
  try {
    const line = lines.at(0);
    if (!line) return false;
    const entry = JSON.parse(line);
    return (
      typeof entry === "object" &&
      entry !== null &&
      Reflect.get(entry, "type") === "compaction" &&
      Reflect.get(entry, "id") === entryId
    );
  } catch {
    return false;
  }
}
function resolveEntryTranscriptSeq(sessionManager, entryId, seqByEntryId) {
  if (!entryId) return 0;
  const cached = seqByEntryId.get(entryId);
  if (cached !== void 0) return cached;
  let seq = 0;
  for (const entry of sessionManager.getBranch(entryId)) {
    if (entry.type === "message" || entry.type === "compaction") seq += 1;
    seqByEntryId.set(entry.id, seq);
  }
  return seqByEntryId.get(entryId);
}
function resolveAppendedMessageSeq(params) {
  if (typeof params.entryId !== "string") return;
  const parentSeq = resolveEntryTranscriptSeq(
    params.sessionManager,
    params.parentEntryId,
    params.seqByEntryId,
  );
  if (parentSeq === void 0) return;
  const messageSeq = parentSeq + 1;
  params.seqByEntryId.set(params.entryId, messageSeq);
  return messageSeq;
}
const MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES = 8192;
const MAX_PERSISTED_DETAIL_STRING_CHARS = 2e3;
const MAX_PERSISTED_DETAIL_SESSION_COUNT = 10;
const MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS = 200;
const MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS = 1024;
const MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS = 512;
const PERSISTED_DETAIL_REDACTION_BOUNDARY = "\0OPENCLAW_PERSISTED_DETAIL_BOUNDARY\0";
const PARTIAL_STRUCTURED_SECRET_VALUE_RE =
  /(?:["']?(?:api[-_]?key|apikey|token|secret|password|passwd|access[-_]?token|accesstoken|refresh[-_]?token|refreshtoken|auth[-_]?token|authtoken|client[-_]?secret|clientsecret|app[-_]?secret|appsecret|card[-_]?number|cardnumber|cvc|cvv)["']?\s*[:=]\s*["']?)(?!\*{3})(?=[^\s"',}\]]{8,})/i;
const PARTIAL_PRIVATE_KEY_BLOCK_RE =
  /-----BEGIN [A-Z0-9 ]*(?:PRIVATE KEY|OPENSSH PRIVATE KEY|RSA PRIVATE KEY|EC PRIVATE KEY|DSA PRIVATE KEY)-----/i;
function originalDetailsSizeFields(size) {
  return size.complete
    ? { originalDetailsBytes: size.bytes }
    : { originalDetailsBytesAtLeast: size.bytes };
}
function redactPersistedDetailString(
  value,
  maxChars = MAX_PERSISTED_DETAIL_STRING_CHARS,
  redactionConfig,
) {
  if (value.length <= maxChars) return redactToolPayloadTextWithConfig(value, redactionConfig);
  const redactedScan = redactToolPayloadTextWithConfig(
    `${sliceUtf16Safe(value, 0, maxChars)}${PERSISTED_DETAIL_REDACTION_BOUNDARY}${sliceUtf16Safe(value, maxChars, maxChars + MAX_PERSISTED_DETAIL_REDACTION_LOOKAHEAD_CHARS)}`,
    redactionConfig,
  );
  const boundaryIndex = redactedScan.indexOf(PERSISTED_DETAIL_REDACTION_BOUNDARY);
  const initialPersistedPrefix = truncateUtf16Safe(
    boundaryIndex >= 0
      ? redactedScan.slice(0, boundaryIndex)
      : "[OpenClaw persisted detail redacted: boundary marker removed]",
    Math.max(0, maxChars - Math.min(maxChars, MAX_PERSISTED_DETAIL_BOUNDARY_OVERLAP_CHARS)),
  );
  const persistedPrefix =
    PARTIAL_STRUCTURED_SECRET_VALUE_RE.test(initialPersistedPrefix) ||
    PARTIAL_PRIVATE_KEY_BLOCK_RE.test(initialPersistedPrefix)
      ? "[OpenClaw persisted detail redacted: partial secret span omitted]"
      : initialPersistedPrefix;
  return `${persistedPrefix}${persistedPrefix ? "\n" : ""}[OpenClaw persisted detail redacted: boundary overlap omitted]\n\n[OpenClaw persisted detail truncated: ${Math.max(0, value.length - maxChars)} original chars omitted]`;
}
function isSensitivePersistedDetailKey(key) {
  return Boolean(key && isSensitiveFieldKey(key));
}
function selectPersistedDetailRedactionKey(key, inheritedKey) {
  return isSensitivePersistedDetailKey(key) ? key : inheritedKey;
}
function redactedOriginalDetailKeys(src, redactionConfig) {
  return firstEnumerableOwnKeys(src, 40).map((key) =>
    redactToolPayloadTextWithConfig(key, redactionConfig),
  );
}
function redactPersistedDetailValue(value, depth = 0, redactionKey, redactionConfig) {
  if (typeof value === "string")
    return redactionKey
      ? redactSensitiveFieldValueWithConfig(redactionKey, value, redactionConfig)
      : redactToolPayloadTextWithConfig(value, redactionConfig);
  if (
    redactionKey &&
    (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
  )
    return redactSensitiveFieldValueWithConfig(redactionKey, String(value), redactionConfig);
  if (value === null || value === void 0 || typeof value !== "object") return value;
  if (depth >= 8) return "[OpenClaw persisted detail redacted: max depth exceeded]";
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const redacted = redactPersistedDetailValue(item, depth + 1, redactionKey, redactionConfig);
      changed ||= redacted !== item;
      return redacted;
    });
    return changed ? next : value;
  }
  const source = value;
  let changed = false;
  const next = {};
  for (const [key, field] of Object.entries(source)) {
    const redactedKey = redactToolPayloadTextWithConfig(key, redactionConfig);
    const redacted = redactPersistedDetailValue(
      field,
      depth + 1,
      selectPersistedDetailRedactionKey(key, redactionKey),
      redactionConfig,
    );
    changed ||= redactedKey !== key || redacted !== field;
    next[redactedKey] = redacted;
  }
  return changed ? next : value;
}
function redactPersistedSummaryField(key, value, maxStringChars, redactionConfig) {
  if (typeof value === "string")
    return redactPersistedDetailString(value, maxStringChars, redactionConfig);
  return redactPersistedDetailValue(
    value,
    0,
    selectPersistedDetailRedactionKey(key, void 0),
    redactionConfig,
  );
}
function sanitizePersistedSessionDetail(value, redactionConfig) {
  if (!value || typeof value !== "object") return value;
  const src = value;
  const out = {};
  for (const key of [
    "sessionId",
    "status",
    "pid",
    "startedAt",
    "endedAt",
    "runtimeMs",
    "cwd",
    "name",
    "truncated",
    "exitCode",
    "exitSignal",
  ]) {
    const field = src[key];
    if (field !== void 0) out[key] = redactPersistedSummaryField(key, field, 500, redactionConfig);
  }
  if (typeof src.command === "string")
    out.command = redactPersistedDetailString(src.command, 500, redactionConfig);
  return out;
}
function copyPersistedResultStateFields(out, src, maxStringChars, redactionConfig) {
  for (const key of ["disabled", "unavailable", "success"])
    if (typeof src[key] === "boolean") out[key] = src[key];
  if (typeof src.error === "string" && src.error)
    out.error = redactPersistedDetailString(src.error, maxStringChars, redactionConfig);
  else if (src.error) out.error = true;
}
function buildPersistedDetailsFallback(src, originalSize, sanitizedBytes, redactionConfig) {
  const fallback = {
    persistedDetailsTruncated: true,
    finalDetailsTruncated: true,
    ...originalDetailsSizeFields(originalSize),
  };
  if (sanitizedBytes !== void 0) fallback.sanitizedDetailsBytes = sanitizedBytes;
  if (src) {
    fallback.originalDetailKeys = redactedOriginalDetailKeys(src, redactionConfig);
    for (const key of [
      "status",
      "sessionId",
      "pid",
      "exitCode",
      "exitSignal",
      "truncated",
      "fullOutputPath",
      "spilledChars",
      "spillTruncated",
    ]) {
      const field = src[key];
      if (field !== void 0)
        fallback[key] = redactPersistedSummaryField(
          key,
          field,
          MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS,
          redactionConfig,
        );
    }
    copyPersistedResultStateFields(
      fallback,
      src,
      MAX_PERSISTED_DETAIL_FALLBACK_STRING_CHARS,
      redactionConfig,
    );
  }
  return fallback;
}
function enforcePersistedDetailsByteCap(value, src, originalSize, redactionConfig) {
  const sanitizedBytes = jsonUtf8BytesOrInfinity(value);
  if (sanitizedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return value;
  const fallback = buildPersistedDetailsFallback(
    src,
    originalSize,
    sanitizedBytes,
    redactionConfig,
  );
  if (jsonUtf8BytesOrInfinity(fallback) <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return fallback;
  return {
    persistedDetailsTruncated: true,
    finalDetailsTruncated: true,
    ...originalDetailsSizeFields(originalSize),
    sanitizedDetailsBytes: sanitizedBytes,
  };
}
function enforceRedactedPersistedDetailsByteCap(
  redacted,
  originalDetails,
  originalSize,
  redactionConfig,
) {
  const redactedBytes = jsonUtf8BytesOrInfinity(redacted);
  if (redactedBytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES) return redacted;
  if (originalDetails && typeof originalDetails === "object" && !Array.isArray(originalDetails))
    return buildPersistedDetailsFallback(
      originalDetails,
      originalSize,
      redactedBytes,
      redactionConfig,
    );
  return {
    persistedDetailsTruncated: true,
    finalDetailsTruncated: true,
    ...originalDetailsSizeFields(originalSize),
    sanitizedDetailsBytes: redactedBytes,
  };
}
function sanitizeToolResultDetailsForPersistence(details, redactionConfig) {
  if (details === void 0 || details === null) return details;
  const originalSize = boundedJsonUtf8Bytes(details, MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES);
  if (originalSize.complete && originalSize.bytes <= MAX_PERSISTED_TOOL_RESULT_DETAILS_BYTES)
    return enforceRedactedPersistedDetailsByteCap(
      redactPersistedDetailValue(details, 0, void 0, redactionConfig),
      details,
      originalSize,
      redactionConfig,
    );
  if (typeof details !== "object")
    return enforcePersistedDetailsByteCap(
      {
        persistedDetailsTruncated: true,
        ...originalDetailsSizeFields(originalSize),
        valueType: typeof details,
      },
      void 0,
      originalSize,
      redactionConfig,
    );
  const src = details;
  const out = {
    persistedDetailsTruncated: true,
    ...originalDetailsSizeFields(originalSize),
    originalDetailKeys: redactedOriginalDetailKeys(src, redactionConfig),
  };
  for (const key of [
    "status",
    "sessionId",
    "pid",
    "startedAt",
    "endedAt",
    "cwd",
    "name",
    "exitCode",
    "exitSignal",
    "retryInMs",
    "total",
    "totalLines",
    "totalChars",
    "truncated",
    "fullOutputPath",
    "spilledChars",
    "spillTruncated",
    "truncation",
  ]) {
    const field = src[key];
    if (field !== void 0)
      out[key] = redactPersistedSummaryField(
        key,
        field,
        MAX_PERSISTED_DETAIL_STRING_CHARS,
        redactionConfig,
      );
  }
  copyPersistedResultStateFields(out, src, MAX_PERSISTED_DETAIL_STRING_CHARS, redactionConfig);
  if (typeof src.tail === "string")
    out.tail = redactPersistedDetailString(
      src.tail,
      MAX_PERSISTED_DETAIL_STRING_CHARS,
      redactionConfig,
    );
  if (Array.isArray(src.sessions)) {
    out.sessions = src.sessions
      .slice(0, MAX_PERSISTED_DETAIL_SESSION_COUNT)
      .map((session) => sanitizePersistedSessionDetail(session, redactionConfig));
    if (src.sessions.length > MAX_PERSISTED_DETAIL_SESSION_COUNT)
      out.sessionsTruncated = src.sessions.length - MAX_PERSISTED_DETAIL_SESSION_COUNT;
  }
  return enforcePersistedDetailsByteCap(out, src, originalSize, redactionConfig);
}
function capToolResultDetails(msg, redactionConfig) {
  if (msg.role !== "toolResult") return msg;
  const details = msg.details;
  const sanitizedDetails = sanitizeToolResultDetailsForPersistence(details, redactionConfig);
  if (sanitizedDetails === details) return msg;
  const next = { ...msg };
  next.details = sanitizedDetails;
  return next;
}
function capToolResultForPersistence(msg, maxChars, redactionConfig) {
  return capToolResultDetails(capToolResultSize(msg, maxChars), redactionConfig);
}
function normalizePersistedToolResultName(message, fallbackName) {
  if (message.role !== "toolResult") return message;
  const toolResult = message;
  const rawToolName = toolResult.toolName;
  const normalizedToolName = normalizeOptionalString(rawToolName);
  if (normalizedToolName) {
    if (rawToolName === normalizedToolName) return toolResult;
    return {
      ...toolResult,
      toolName: normalizedToolName,
    };
  }
  const normalizedFallback = normalizeOptionalString(fallbackName);
  if (normalizedFallback)
    return {
      ...toolResult,
      toolName: normalizedFallback,
    };
  if (typeof rawToolName === "string")
    return {
      ...toolResult,
      toolName: "unknown",
    };
  return toolResult;
}
function isTranscriptOnlyOpenClawAssistantMessage(message) {
  if (!message || message.role !== "assistant") return false;
  return isTranscriptOnlyOpenClawAssistantModel(
    normalizeOptionalString(message.provider) ?? "",
    normalizeOptionalString(message.model) ?? "",
  );
}
function installSessionToolResultGuard(sessionManager, opts) {
  const originalAppend = getRawSessionAppendMessage(sessionManager);
  setRawSessionAppendMessage(sessionManager, originalAppend);
  const pendingState = createPendingToolCallState();
  const persistMessage = (message) => {
    const transformer = opts?.transformMessageForPersistence;
    return transformer ? transformer(message) : message;
  };
  const persistToolResult = (message, meta) => {
    const transformer = opts?.transformToolResultForPersistence;
    return transformer ? transformer(message, meta) : message;
  };
  const allowSyntheticToolResults = opts?.allowSyntheticToolResults ?? true;
  const missingToolResultText = opts?.missingToolResultText;
  const beforeWrite = opts?.beforeMessageWriteHook;
  const toolResultTransformerMayMutate = opts?.transformToolResultForPersistence !== void 0;
  const redactionConfig = opts?.redactLoggingConfig;
  const maxToolResultChars = resolveMaxToolResultChars(opts);
  const transcriptSeqByEntryId = /* @__PURE__ */ new Map();
  let suppressNextUserMessagePersistence = opts?.suppressNextUserMessagePersistence === true;
  const getSessionFile = () => sessionManager.getSessionFile?.();
  const appendMessageAndCacheTranscriptSeq = (message, options) => {
    const parentEntryId = sessionManager.getLeafId();
    const entryId = originalAppend(message, options);
    opts?.onMessagePersisted?.(message);
    const sessionFile = getSessionFile();
    if (!sessionFile)
      return {
        entryId,
        sessionFile,
      };
    return {
      entryId,
      sessionFile,
      messageSeq: resolveAppendedMessageSeq({
        sessionManager,
        entryId,
        parentEntryId,
        seqByEntryId: transcriptSeqByEntryId,
      }),
    };
  };
  const originalAppendCompaction = sessionManager.appendCompaction.bind(sessionManager);
  const guardedAppendCompaction = (...args) => {
    const append = () => originalAppendCompaction(...args);
    return opts?.withCompactionPersistence
      ? opts.withCompactionPersistence(append, isExpectedCompactionAppend)
      : append();
  };
  /**
   * Run the before_message_write hook. Returns the (possibly modified) message,
   * or null if the message should be blocked.
   */
  const applyBeforeWriteHook = (msg) => {
    if (!beforeWrite)
      return {
        message: msg,
        changed: false,
      };
    const result = beforeWrite({ message: msg });
    if (result?.block) return null;
    if (result?.message)
      return {
        message: result.message,
        changed: true,
      };
    return {
      message: msg,
      changed: false,
    };
  };
  const flushPendingToolResults = () => {
    if (pendingState.size() === 0) return;
    if (allowSyntheticToolResults)
      for (const [id, name] of pendingState.entries()) {
        const synthetic = makeMissingToolResult({
          toolCallId: id,
          toolName: name,
          text: missingToolResultText,
        });
        const persistedSynthetic = persistMessage(synthetic);
        const transformed = persistToolResult(persistedSynthetic, {
          toolCallId: id,
          toolName: name,
          isSynthetic: true,
        });
        const flushed = applyBeforeWriteHook(transformed);
        if (flushed)
          appendMessageAndCacheTranscriptSeq(
            capToolResultForPersistence(flushed.message, maxToolResultChars, redactionConfig),
            {
              invalidateSerializedPrefixCache:
                persistedSynthetic !== synthetic ||
                toolResultTransformerMayMutate ||
                flushed.changed,
            },
          );
      }
    pendingState.clear();
  };
  const clearPendingToolResults = () => {
    pendingState.clear();
  };
  const guardedAppend = (message, callerOptions) => {
    const callerInvalidatesCache = callerOptions?.invalidateSerializedPrefixCache === true;
    let nextMessage = message;
    if (message.role === "assistant") {
      const sanitized = sanitizeToolCallInputs([message], {
        allowedToolNames: opts?.allowedToolNames,
      });
      if (sanitized.length === 0) {
        if (pendingState.shouldFlushForSanitizedDrop()) flushPendingToolResults();
        return;
      }
      const sanitizedMessage = sanitized.at(0);
      if (!sanitizedMessage) return;
      nextMessage = sanitizedMessage;
    }
    const nextRole = nextMessage.role;
    if (nextRole === "toolResult") {
      const id = extractToolResultId(nextMessage);
      const toolName = id ? pendingState.getToolName(id) : void 0;
      if (id) pendingState.delete(id);
      const normalizedToolResult = normalizePersistedToolResultName(nextMessage, toolName);
      const persistedToolResult = persistMessage(normalizedToolResult);
      const capped = capToolResultForPersistence(
        persistedToolResult,
        maxToolResultChars,
        redactionConfig,
      );
      const transformed = persistToolResult(capped, {
        toolCallId: id ?? void 0,
        toolName,
        isSynthetic: false,
      });
      const persisted = applyBeforeWriteHook(transformed);
      if (!persisted) return;
      return appendMessageAndCacheTranscriptSeq(
        capToolResultForPersistence(persisted.message, maxToolResultChars, redactionConfig),
        {
          invalidateSerializedPrefixCache:
            callerInvalidatesCache ||
            persistedToolResult !== normalizedToolResult ||
            toolResultTransformerMayMutate ||
            persisted.changed,
        },
      ).entryId;
    }
    const stopReason = nextMessage.stopReason;
    const toolCalls =
      nextRole === "assistant" && stopReason !== "aborted" && stopReason !== "error"
        ? extractToolCallsFromAssistant(nextMessage)
        : [];
    if (
      !(
        nextRole === "assistant" &&
        toolCalls.length === 0 &&
        isTranscriptOnlyOpenClawAssistantMessage(nextMessage)
      ) &&
      pendingState.shouldFlushBeforeNonToolResult(nextRole, toolCalls.length)
    )
      flushPendingToolResults();
    if (!allowSyntheticToolResults && pendingState.shouldFlushBeforeNewToolCalls(toolCalls.length))
      flushPendingToolResults();
    const transformedMessage = persistMessage(nextMessage);
    const finalWrite = applyBeforeWriteHook(transformedMessage);
    if (!finalWrite) {
      if (isUserAgentMessage(transformedMessage)) opts?.onUserMessageBlocked?.(transformedMessage);
      return;
    }
    const finalMessage = finalWrite.message;
    const finalRole = finalMessage.role;
    if (
      finalRole === "assistant" &&
      toolCalls.length === 0 &&
      opts?.suppressTranscriptOnlyAssistantPersistence === true
    )
      return;
    if (
      finalRole === "assistant" &&
      opts?.suppressAssistantErrorPersistence === true &&
      finalMessage.stopReason === "error"
    )
      return;
    if (isUserAgentMessage(finalMessage) && suppressNextUserMessagePersistence) {
      suppressNextUserMessagePersistence = false;
      opts?.onUserMessagePersistenceSuppressed?.(finalMessage);
      return;
    }
    const {
      entryId: result,
      messageSeq,
      sessionFile,
    } = appendMessageAndCacheTranscriptSeq(finalMessage, {
      invalidateSerializedPrefixCache:
        callerInvalidatesCache || transformedMessage !== nextMessage || finalWrite.changed,
    });
    if (sessionFile)
      emitSessionTranscriptUpdate({
        sessionFile,
        sessionKey: opts?.sessionKey,
        ...(opts?.agentId ? { agentId: opts.agentId } : {}),
        message: finalMessage,
        messageId: typeof result === "string" ? result : void 0,
        ...(messageSeq !== void 0 ? { messageSeq } : {}),
      });
    if (toolCalls.length > 0) pendingState.trackToolCalls(toolCalls);
    if (isUserAgentMessage(finalMessage)) opts?.onUserMessagePersisted?.(finalMessage);
    if (finalRole === "assistant" && finalMessage.stopReason === "error")
      opts?.onAssistantErrorMessagePersisted?.(finalMessage);
    return result;
  };
  sessionManager.appendMessage = guardedAppend;
  sessionManager.appendCompaction = guardedAppendCompaction;
  return {
    flushPendingToolResults,
    clearPendingToolResults,
    clearNextUserMessagePersistenceSuppression: () => {
      suppressNextUserMessagePersistence = false;
    },
    getPendingIds: pendingState.getPendingIds,
  };
}
//#endregion
//#region src/agents/session-tool-result-guard-wrapper.ts
/**
 * Apply the tool-result guard to a SessionManager exactly once and expose
 * a flush method on the instance for easy teardown handling.
 */
function guardSessionManager(sessionManager, opts) {
  if (typeof sessionManager.flushPendingToolResults === "function") return sessionManager;
  const hookRunner = getGlobalHookRunner();
  let pendingPreparedUserTurnMessage = opts?.preparedUserTurnMessage;
  let queuedUserTurnTranscriptRecorder;
  const runtimeUserMessageByPersistedMessage = /* @__PURE__ */ new WeakMap();
  const beforeMessageWrite = (event) => {
    const runtimeUserMessage = runtimeUserMessageByPersistedMessage.get(event.message);
    let message = event.message;
    let changed = false;
    if (hookRunner?.hasHooks("before_message_write")) {
      const result = hookRunner.runBeforeMessageWrite(event, {
        agentId: opts?.agentId,
        sessionKey: opts?.sessionKey,
      });
      if (result?.block) {
        runtimeUserMessageByPersistedMessage.delete(event.message);
        queuedUserTurnTranscriptRecorder?.markBlocked();
        queuedUserTurnTranscriptRecorder = void 0;
        return result;
      }
      if (result?.message) {
        message = restorePreparedUserTurnOperationalMetaForRuntime({
          runtimeMessage: result.message,
          ...(event.message.role === "user" ? { preparedMessage: event.message } : {}),
        });
        changed = true;
      }
    }
    const redacted = redactTranscriptMessage(message, opts?.config);
    if (redacted !== message) {
      message = redacted;
      changed = true;
    }
    if (message.role !== "user" && queuedUserTurnTranscriptRecorder) {
      queuedUserTurnTranscriptRecorder.markBlocked();
      queuedUserTurnTranscriptRecorder = void 0;
    }
    if (message.role === "user" && queuedUserTurnTranscriptRecorder) {
      message = attachRuntimeUserTurnTranscriptRecorder(message, queuedUserTurnTranscriptRecorder);
      queuedUserTurnTranscriptRecorder = void 0;
    }
    if (runtimeUserMessage && message.role === "user")
      runtimeUserMessageByPersistedMessage.set(message, runtimeUserMessage);
    return changed ? { message } : void 0;
  };
  const transform = hookRunner?.hasHooks("tool_result_persist")
    ? (message, meta) => {
        return (
          hookRunner.runToolResultPersist(
            {
              toolName: meta.toolName,
              toolCallId: meta.toolCallId,
              message,
              isSynthetic: meta.isSynthetic,
            },
            {
              agentId: opts?.agentId,
              sessionKey: opts?.sessionKey,
              toolName: meta.toolName,
              toolCallId: meta.toolCallId,
            },
          )?.message ?? message
        );
      }
    : void 0;
  const guard = installSessionToolResultGuard(sessionManager, {
    sessionKey: opts?.sessionKey,
    agentId: opts?.agentId,
    transformMessageForPersistence: (message) => {
      queuedUserTurnTranscriptRecorder = void 0;
      const withProvenance = applyInputProvenanceToUserMessage(message, opts?.inputProvenance);
      const runtimeContext = takeRuntimeUserTurnTranscriptContext(message);
      const prepared = runtimeContext?.message ?? pendingPreparedUserTurnMessage;
      if (message.role === "user")
        opts?.onUserMessagePreparingForPersistence?.(message, runtimeContext?.recorder, prepared);
      const merged = mergePreparedUserTurnMessageForRuntime({
        runtimeMessage: withProvenance,
        ...(prepared ? { preparedMessage: prepared } : {}),
      });
      if (merged !== withProvenance)
        if (runtimeContext) queuedUserTurnTranscriptRecorder = runtimeContext.recorder;
        else pendingPreparedUserTurnMessage = void 0;
      if (message.role === "user" && merged.role === "user")
        runtimeUserMessageByPersistedMessage.set(merged, message);
      return merged;
    },
    transformToolResultForPersistence: transform,
    allowSyntheticToolResults: opts?.allowSyntheticToolResults,
    missingToolResultText: opts?.missingToolResultText,
    allowedToolNames: opts?.allowedToolNames,
    beforeMessageWriteHook: beforeMessageWrite,
    redactLoggingConfig: opts?.config?.logging,
    maxToolResultChars:
      typeof opts?.contextWindowTokens === "number"
        ? resolveLiveToolResultMaxChars({
            contextWindowTokens: opts.contextWindowTokens,
            cfg: opts.config,
            agentId: opts.agentId,
          })
        : void 0,
    suppressNextUserMessagePersistence: opts?.suppressNextUserMessagePersistence,
    suppressTranscriptOnlyAssistantPersistence: opts?.suppressTranscriptOnlyAssistantPersistence,
    suppressAssistantErrorPersistence: opts?.suppressAssistantErrorPersistence,
    onMessagePersisted: opts?.onMessagePersisted,
    withCompactionPersistence: opts?.withCompactionPersistence,
    onUserMessagePersisted: async (message) => {
      const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
      runtimeUserMessageByPersistedMessage.delete(message);
      takeRuntimeUserTurnTranscriptRecorder(message)?.markRuntimePersisted(message);
      await opts?.onUserMessagePersisted?.(message, runtimeMessage);
    },
    onUserMessagePersistenceSuppressed: async (message) => {
      const runtimeMessage = runtimeUserMessageByPersistedMessage.get(message);
      runtimeUserMessageByPersistedMessage.delete(message);
      await opts?.onUserMessagePersistenceSuppressed?.(message, runtimeMessage);
    },
    onUserMessageBlocked: opts?.onUserMessageBlocked,
    onAssistantErrorMessagePersisted: opts?.onAssistantErrorMessagePersisted,
  });
  sessionManager.flushPendingToolResults = guard.flushPendingToolResults;
  sessionManager.clearPendingToolResults = guard.clearPendingToolResults;
  sessionManager.clearNextUserMessagePersistenceSuppression =
    guard.clearNextUserMessagePersistenceSuppression;
  return sessionManager;
}
//#endregion
export { guardSessionManager as t };
