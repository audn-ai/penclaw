import { randomUUID } from "node:crypto";
import {
  chmodSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import fs$1, { readFile, readdir, stat } from "node:fs/promises";
import path, { join, resolve } from "node:path";
import { isProxy } from "node:util/types";
import pMap, { pMapSkip } from "p-map";
import {
  $ as FileError,
  A as findTurnStartIndex,
  B as COMPACTION_SUMMARY_PREFIX,
  C as prepareBranchEntries,
  D as estimateContextTokens,
  E as compact,
  F as serializeConversation,
  G as createBranchSummaryMessage,
  H as asAgentMessage,
  I as Session,
  J as NodeExecutionEnv,
  K as createCompactionSummaryMessage,
  L as buildSessionContext$1,
  M as getLastAssistantUsage,
  N as prepareCompaction,
  O as estimateTokens,
  P as shouldCompact,
  Q as ExecutionError,
  R as BRANCH_SUMMARY_PREFIX,
  S as generateBranchSummary,
  T as calculateContextTokens,
  U as bashExecutionToText,
  V as COMPACTION_SUMMARY_SUFFIX,
  W as convertToLlm,
  X as BranchSummaryError,
  Y as AgentHarnessError,
  Z as CompactionError,
  _ as formatPromptTemplateInvocation,
  a as DEFAULT_MAX_LINES,
  at as runAgentLoopContinue,
  b as collectEntriesForBranchSummary,
  c as truncateHead,
  ct as resolveAgentCoreCompleteFn,
  d as InMemorySessionStorage,
  et as SessionError,
  f as JsonlSessionStorage,
  g as formatSkillInvocation,
  h as CoreAgentHarness,
  i as DEFAULT_MAX_BYTES,
  it as runAgentLoop,
  j as generateSummary,
  k as findCutPoint,
  l as truncateLine,
  lt as resolveAgentCoreStreamFn,
  m as uuidv7,
  n as openClawAgentCoreRuntime,
  nt as agentLoop,
  ot as validateToolArguments,
  p as loadJsonlSessionMetadata,
  q as createCustomMessage,
  r as streamProxy,
  rt as agentLoopContinue,
  s as formatSize,
  st as validateToolCall,
  t as Agent,
  tt as toError,
  u as truncateTail,
  v as parseCommandArgs,
  w as DEFAULT_COMPACTION_SETTINGS,
  x as collectEntriesForBranchSummaryFromBranches,
  y as substituteArgs,
  z as BRANCH_SUMMARY_SUFFIX,
} from "./agent-core-DJCbl_Iw.js";
import "./store-CzZJhTF6.js";
import { i as getAgentDir, l as getSessionsDir } from "./config-DSj7k-uT.js";
import {
  n as TranscriptNotContinuableError,
  t as TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE,
} from "./errors-wmH7Ncz4.js";
import { n as sanitizeInlineImageBase64 } from "./inline-image-data-url-oC-MoRLP.js";
import { n as signalProcessTree, t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { n as replaceFileAtomic } from "./replace-file-CaPU6XwS.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { r as __exportAll } from "./rolldown-runtime-DE1ahGrs.js";
import {
  $ as resolveTranscriptSessionKeyBySessionId,
  Ct as serializeJsonlEntry,
  H as replaceSessionEntrySync,
  S as loadSessionEntry,
  St as appendSerializedJsonlEntrySync,
  Tt as writeJsonlEntriesSync,
  W as replaceTranscriptEventsSync,
  dt as canAdvanceOwnedSessionEntryCache,
  ft as publishOwnedSessionFileSnapshot,
  i as appendTranscriptMessageSync,
  n as appendTranscriptEventSync,
  w as loadTranscriptEventsSync,
  wt as serializeJsonlLine,
  xt as appendJsonlEntrySync,
} from "./session-accessor-PZVNxFCV.js";
import { t as makeMissingToolResult } from "./session-transcript-repair-BI2d8Y2b.js";
import {
  n as parseSqliteSessionFileMarker,
  t as formatSqliteSessionFileMarker,
} from "./sqlite-marker-BejbySI1.js";
import { t as STREAM_ERROR_FALLBACK_TEXT } from "./stream-message-shared-DKS8UMJ_.js";
import {
  n as extractToolResultId,
  t as extractToolCallsFromAssistant,
} from "./tool-call-id-Bl60ujZe.js";
import {
  c as selectSessionTranscriptLeafControlledPath,
  r as isSessionTranscriptSideAppendEntry,
} from "./transcript-tree-DuZTyiYZ.js";
//#region src/agents/runtime/index.ts
var runtime_exports = /* @__PURE__ */ __exportAll({
  Agent: () => Agent,
  AgentHarness: () => CoreAgentHarness,
  AgentHarnessError: () => AgentHarnessError,
  BRANCH_SUMMARY_PREFIX: () => BRANCH_SUMMARY_PREFIX,
  BRANCH_SUMMARY_SUFFIX: () => BRANCH_SUMMARY_SUFFIX,
  BranchSummaryError: () => BranchSummaryError,
  COMPACTION_SUMMARY_PREFIX: () => COMPACTION_SUMMARY_PREFIX,
  COMPACTION_SUMMARY_SUFFIX: () => COMPACTION_SUMMARY_SUFFIX,
  CompactionError: () => CompactionError,
  CoreAgentHarness: () => CoreAgentHarness,
  DEFAULT_COMPACTION_SETTINGS: () => DEFAULT_COMPACTION_SETTINGS,
  DEFAULT_MAX_BYTES: () => DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES: () => DEFAULT_MAX_LINES,
  ExecutionError: () => ExecutionError,
  FileError: () => FileError,
  GREP_MAX_LINE_LENGTH: () => 500,
  InMemorySessionStorage: () => InMemorySessionStorage,
  JsonlSessionStorage: () => JsonlSessionStorage,
  NodeExecutionEnv: () => NodeExecutionEnv,
  Session: () => Session,
  SessionError: () => SessionError,
  TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE: () => TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE,
  TranscriptNotContinuableError: () => TranscriptNotContinuableError,
  agentLoop: () => agentLoop,
  agentLoopContinue: () => agentLoopContinue,
  asAgentMessage: () => asAgentMessage,
  bashExecutionToText: () => bashExecutionToText,
  buildSessionContext: () => buildSessionContext$1,
  calculateContextTokens: () => calculateContextTokens,
  collectEntriesForBranchSummary: () => collectEntriesForBranchSummary,
  collectEntriesForBranchSummaryFromBranches: () => collectEntriesForBranchSummaryFromBranches,
  compact: () => compact,
  convertToLlm: () => convertToLlm,
  createBranchSummaryMessage: () => createBranchSummaryMessage,
  createCompactionSummaryMessage: () => createCompactionSummaryMessage,
  createCustomMessage: () => createCustomMessage,
  err: () => err,
  estimateContextTokens: () => estimateContextTokens,
  estimateTokens: () => estimateTokens,
  findCutPoint: () => findCutPoint,
  findTurnStartIndex: () => findTurnStartIndex,
  formatPromptTemplateInvocation: () => formatPromptTemplateInvocation,
  formatSize: () => formatSize,
  formatSkillInvocation: () => formatSkillInvocation,
  generateBranchSummary: () => generateBranchSummary,
  generateSummary: () => generateSummary,
  getLastAssistantUsage: () => getLastAssistantUsage,
  killProcessTree: () => killProcessTree,
  loadJsonlSessionMetadata: () => loadJsonlSessionMetadata,
  ok: () => ok,
  openClawAgentCoreRuntime: () => openClawAgentCoreRuntime,
  parseCommandArgs: () => parseCommandArgs,
  prepareBranchEntries: () => prepareBranchEntries,
  prepareCompaction: () => prepareCompaction,
  resolveAgentCoreCompleteFn: () => resolveAgentCoreCompleteFn,
  resolveAgentCoreStreamFn: () => resolveAgentCoreStreamFn,
  runAgentLoop: () => runAgentLoop,
  runAgentLoopContinue: () => runAgentLoopContinue,
  serializeConversation: () => serializeConversation,
  shouldCompact: () => shouldCompact,
  signalProcessTree: () => signalProcessTree,
  streamProxy: () => streamProxy,
  substituteArgs: () => substituteArgs,
  toError: () => toError,
  truncateHead: () => truncateHead,
  truncateLine: () => truncateLine,
  truncateTail: () => truncateTail,
  uuidv7: () => uuidv7,
  validateToolArguments: () => validateToolArguments,
  validateToolCall: () => validateToolCall,
});
//#endregion
//#region src/agents/session-file-repair.ts
/**
 * Persisted session JSONL repair helpers.
 * Drops malformed transcript entries, rewrites unreplayable blank/error turns,
 * and inserts missing code-mode tool results before replay.
 */
/**
 * Placeholder for blank user messages.
 * Preserves the user turn so strict providers that require at least one user
 * message do not reject the transcript.
 */
const BLANK_USER_FALLBACK_TEXT = "(continue)";
const CORRUPTED_IMAGE_FALLBACK_TEXT = "[image omitted: corrupted base64 payload]";
const MAX_CACHED_SESSION_REPAIRS = 8;
const MAX_INCREMENTAL_REPAIR_BYTES = 8n * 1024n * 1024n;
const MAX_CACHED_REPAIR_TOOL_RESULT_IDS = 4096;
const MAX_CACHED_REPAIR_TOOL_RESULT_ID_BYTES = 512 * 1024;
const sessionRepairCache = /* @__PURE__ */ new Map();
function invalidateSessionFileRepairCache(sessionFile) {
  const trimmed = sessionFile.trim();
  if (trimmed) {
    if (parseSqliteSessionFileMarker(trimmed)) {
      sessionRepairCache.delete(trimmed);
      return;
    }
    sessionRepairCache.delete(path.resolve(trimmed));
  }
}
async function readSessionRepairSnapshot(sessionFile) {
  if (parseSqliteSessionFileMarker(sessionFile)) return;
  try {
    const stat = await fs$1.stat(sessionFile, { bigint: true });
    return {
      dev: stat.dev,
      ino: stat.ino,
      size: stat.size,
      mtimeNs: stat.mtimeNs,
      ctimeNs: stat.ctimeNs,
    };
  } catch {
    return;
  }
}
function isSameSessionRepairSnapshot(left, right) {
  return (
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.size === right.size &&
    left.mtimeNs === right.mtimeNs &&
    left.ctimeNs === right.ctimeNs
  );
}
function isSameSessionRepairFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}
function rememberSessionRepair(sessionFile, state) {
  if (
    state.toolResultIds.size > MAX_CACHED_REPAIR_TOOL_RESULT_IDS ||
    countToolResultIdBytes(state.toolResultIds) > MAX_CACHED_REPAIR_TOOL_RESULT_ID_BYTES
  ) {
    sessionRepairCache.delete(sessionFile);
    return;
  }
  sessionRepairCache.delete(sessionFile);
  sessionRepairCache.set(sessionFile, state);
  while (sessionRepairCache.size > MAX_CACHED_SESSION_REPAIRS) {
    const oldestKey = sessionRepairCache.keys().next().value;
    if (!oldestKey) break;
    sessionRepairCache.delete(oldestKey);
  }
}
function countToolResultIdBytes(ids) {
  let bytes = 0;
  for (const id of ids) {
    bytes += Buffer.byteLength(id, "utf8");
    if (bytes > MAX_CACHED_REPAIR_TOOL_RESULT_ID_BYTES) break;
  }
  return bytes;
}
async function readSessionRepairSuffix(sessionFile, offset, length) {
  if (
    offset > BigInt(Number.MAX_SAFE_INTEGER) ||
    length > MAX_INCREMENTAL_REPAIR_BYTES ||
    length > BigInt(Number.MAX_SAFE_INTEGER)
  )
    return;
  const buffer = Buffer.alloc(Number(length));
  const file = await fs$1.open(sessionFile, "r");
  try {
    const { bytesRead } = await file.read(buffer, 0, buffer.length, Number(offset));
    return bytesRead === buffer.length ? buffer.toString("utf8") : void 0;
  } finally {
    await file.close();
  }
}
function isSessionHeader(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  return record.type === "session" && typeof record.id === "string" && record.id.length > 0;
}
/**
 * Detect a `type: "message"` entry whose `message.role` is missing, `null`, or
 * not a non-empty string. Such entries surface in the wild as "null role"
 * JSONL corruption (e.g. #77228 reported transcripts that contained 935+
 * entries with null roles after an earlier failure). They cannot be replayed
 * to any provider — every provider router branches on `message.role` — and
 * preserving them through repair just relocates the corruption from the
 * original file into the post-repair file. Treat them as malformed lines:
 * drop during repair so the cleaned transcript no longer carries them.
 */
function isStructurallyInvalidMessageEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  if (record.type !== "message") return false;
  if (!record.message || typeof record.message !== "object") return true;
  const role = record.message.role;
  return typeof role !== "string" || role.trim().length === 0;
}
function isAssistantEntryWithEmptyContent(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  if (record.type !== "message" || !record.message || typeof record.message !== "object")
    return false;
  const message = record.message;
  if (message.role !== "assistant") return false;
  if (!Array.isArray(message.content) || message.content.length !== 0) return false;
  return message.stopReason === "error";
}
function rewriteAssistantEntryWithEmptyContent(entry) {
  return {
    ...entry,
    message: {
      ...entry.message,
      content: [
        {
          type: "text",
          text: STREAM_ERROR_FALLBACK_TEXT,
        },
      ],
    },
  };
}
function isImageMimeType(value) {
  return typeof value === "string" && /^image\//iu.test(value.trim());
}
function containsNonAscii(value) {
  for (let index = 0; index < value.length; index += 1)
    if (value.charCodeAt(index) > 127) return true;
  return false;
}
function isCorruptedImageContentBlock(block) {
  if (!block || typeof block !== "object" || Array.isArray(block)) return false;
  const record = block;
  if (record.type !== "image" || typeof record.data !== "string") return false;
  const mimeType = [record.mimeType, record.mediaType, record.media_type].find(isImageMimeType);
  if (!mimeType) return false;
  return (
    containsNonAscii(record.data) ||
    sanitizeInlineImageBase64({
      base64: record.data,
      mimeType,
    }) === void 0
  );
}
function repairEntryWithCorruptedImageBlocks(entry) {
  const content = entry.message.content;
  if (!Array.isArray(content))
    return {
      entry,
      removedCorruptedImageBlocks: 0,
    };
  let removedCorruptedImageBlocks = 0;
  const nextContent = content.map((block) => {
    if (!isCorruptedImageContentBlock(block)) return block;
    removedCorruptedImageBlocks += 1;
    return {
      type: "text",
      text: CORRUPTED_IMAGE_FALLBACK_TEXT,
    };
  });
  if (removedCorruptedImageBlocks === 0)
    return {
      entry,
      removedCorruptedImageBlocks: 0,
    };
  return {
    entry: {
      ...entry,
      message: {
        ...entry.message,
        content: nextContent,
      },
    },
    removedCorruptedImageBlocks,
  };
}
function repairUserEntryWithBlankTextContent(entry) {
  const content = entry.message.content;
  if (typeof content === "string") {
    if (content.trim()) return { kind: "keep" };
    return {
      kind: "rewrite",
      entry: {
        ...entry,
        message: {
          ...entry.message,
          content: BLANK_USER_FALLBACK_TEXT,
        },
      },
    };
  }
  if (!Array.isArray(content)) return { kind: "keep" };
  let touched = false;
  const nextContent = content.filter((block) => {
    if (!block || typeof block !== "object") return true;
    if (block.type !== "text") return true;
    const text = block.text;
    if (typeof text !== "string" || text.trim().length > 0) return true;
    touched = true;
    return false;
  });
  if (nextContent.length === 0)
    return {
      kind: "rewrite",
      entry: {
        ...entry,
        message: {
          ...entry.message,
          content: [
            {
              type: "text",
              text: BLANK_USER_FALLBACK_TEXT,
            },
          ],
        },
      },
    };
  if (!touched) return { kind: "keep" };
  return {
    kind: "rewrite",
    entry: {
      ...entry,
      message: {
        ...entry.message,
        content: nextContent,
      },
    },
  };
}
function buildRepairSummaryParts(params) {
  const parts = [];
  if (params.droppedLines > 0) parts.push(`dropped ${params.droppedLines} malformed line(s)`);
  if (params.rewrittenAssistantMessages > 0)
    parts.push(`rewrote ${params.rewrittenAssistantMessages} assistant message(s)`);
  if (params.droppedBlankUserMessages > 0)
    parts.push(`dropped ${params.droppedBlankUserMessages} blank user message(s)`);
  if (params.rewrittenUserMessages > 0)
    parts.push(`rewrote ${params.rewrittenUserMessages} user message(s)`);
  if (params.removedCorruptedImageBlocks > 0)
    parts.push(`removed ${params.removedCorruptedImageBlocks} corrupted image block(s)`);
  if (params.insertedToolResults > 0)
    parts.push(`inserted ${params.insertedToolResults} missing tool result(s)`);
  return parts.length > 0 ? parts.join(", ") : "no changes";
}
function isCodeModeToolCallRepairCandidate(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  if (record.type !== "message" || !record.message || typeof record.message !== "object")
    return false;
  const message = record.message;
  return (
    message.role === "assistant" &&
    message.api === "openai-chatgpt-responses" &&
    message.provider === "openai" &&
    message.stopReason !== "error" &&
    message.stopReason !== "aborted"
  );
}
function normalizeTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function isOpenAIResponsesReplayApi(value) {
  const api = normalizeTrimmedString(value);
  return (
    api === "openai-responses" ||
    api === "azure-openai-responses" ||
    api === "openai-codex-responses"
  );
}
function isTranscriptOnlyDeliveryMirrorEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  if (record.type !== "message" || !record.message || typeof record.message !== "object")
    return false;
  const message = record.message;
  return (
    message.role === "assistant" &&
    normalizeTrimmedString(message.provider) === "openclaw" &&
    (normalizeTrimmedString(message.model) === "delivery-mirror" ||
      normalizeTrimmedString(message.model) === "gateway-injected")
  );
}
function isResponsesMessageToolRepairCandidate(entry) {
  if (!entry || typeof entry !== "object") return false;
  const record = entry;
  if (record.type !== "message" || !record.message || typeof record.message !== "object")
    return false;
  const message = record.message;
  return (
    message.role === "assistant" &&
    isOpenAIResponsesReplayApi(message.api) &&
    message.stopReason !== "error" &&
    message.stopReason !== "aborted"
  );
}
function isMessageToolCallName(value) {
  return normalizeTrimmedString(value).toLowerCase() === "message";
}
function findNextSessionMessageEntry(entries, startIndex) {
  for (let i = startIndex + 1; i < entries.length; i += 1) {
    const entry = entries[i];
    if (!entry || typeof entry !== "object") continue;
    const record = entry;
    if (record.type === "message" && record.message && typeof record.message === "object")
      return entry;
  }
}
function collectPersistedToolResultIds(entries) {
  const ids = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry;
    if (record.type !== "message" || !record.message || typeof record.message !== "object")
      continue;
    const message = record.message;
    if (message.role !== "toolResult") continue;
    const id = extractToolResultId(message);
    if (id) ids.add(id);
  }
  return ids;
}
function makeSyntheticToolResultEntry(params) {
  const message = makeMissingToolResult({
    toolCallId: params.toolCallId,
    toolName: params.toolName,
    text: "aborted",
  });
  return {
    type: "message",
    id: `repair-${randomUUID()}`,
    parentId: typeof params.parent.id === "string" ? params.parent.id : void 0,
    timestamp: /* @__PURE__ */ new Date().toISOString(),
    message,
  };
}
function insertMissingCodeModeToolResults(entries, existingResultIds = /* @__PURE__ */ new Set()) {
  const resultIds = new Set(existingResultIds);
  for (const resultId of collectPersistedToolResultIds(entries)) resultIds.add(resultId);
  let insertedToolResults = 0;
  const out = [];
  for (const entry of entries) {
    out.push(entry);
    if (!isCodeModeToolCallRepairCandidate(entry)) continue;
    const toolCalls = extractToolCallsFromAssistant(entry.message);
    for (const toolCall of toolCalls) {
      if (resultIds.has(toolCall.id)) continue;
      out.push(
        makeSyntheticToolResultEntry({
          parent: entry,
          toolCallId: toolCall.id,
          toolName: toolCall.name,
        }),
      );
      resultIds.add(toolCall.id);
      insertedToolResults += 1;
    }
  }
  return {
    entries: insertedToolResults > 0 ? out : entries,
    insertedToolResults,
    resultIds,
  };
}
function insertMissingMessageToolDeliveryMirrorResults(
  entries,
  existingResultIds = /* @__PURE__ */ new Set(),
) {
  const resultIds = new Set(existingResultIds);
  for (const resultId of collectPersistedToolResultIds(entries)) resultIds.add(resultId);
  let insertedToolResults = 0;
  const out = [];
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    out.push(entry);
    if (!isResponsesMessageToolRepairCandidate(entry)) continue;
    if (!isTranscriptOnlyDeliveryMirrorEntry(findNextSessionMessageEntry(entries, i))) continue;
    const toolCalls = extractToolCallsFromAssistant(entry.message);
    for (const toolCall of toolCalls) {
      if (!isMessageToolCallName(toolCall.name) || resultIds.has(toolCall.id)) continue;
      out.push(
        makeSyntheticToolResultEntry({
          parent: entry,
          toolCallId: toolCall.id,
          toolName: toolCall.name,
        }),
      );
      resultIds.add(toolCall.id);
      insertedToolResults += 1;
    }
  }
  return {
    entries: insertedToolResults > 0 ? out : entries,
    insertedToolResults,
    resultIds,
  };
}
function repairSessionLines(lines) {
  const entries = [];
  let droppedLines = 0;
  let rewrittenAssistantMessages = 0;
  let droppedBlankUserMessages = 0;
  let rewrittenUserMessages = 0;
  let removedCorruptedImageBlocks = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (isStructurallyInvalidMessageEntry(entry)) {
        droppedLines += 1;
        continue;
      }
      if (isAssistantEntryWithEmptyContent(entry)) {
        entries.push(rewriteAssistantEntryWithEmptyContent(entry));
        rewrittenAssistantMessages += 1;
        continue;
      }
      let entryForUserRepair = entry;
      if (
        entry &&
        typeof entry === "object" &&
        entry.type === "message" &&
        typeof entry.message === "object"
      ) {
        const imageRepair = repairEntryWithCorruptedImageBlocks(entry);
        entryForUserRepair = imageRepair.entry;
        removedCorruptedImageBlocks += imageRepair.removedCorruptedImageBlocks;
      }
      if (
        entryForUserRepair &&
        typeof entryForUserRepair === "object" &&
        entryForUserRepair.type === "message" &&
        typeof entryForUserRepair.message === "object" &&
        (entryForUserRepair.message?.role ?? void 0) === "user"
      ) {
        const repairedUser = repairUserEntryWithBlankTextContent(entryForUserRepair);
        if (repairedUser.kind === "drop") {
          droppedBlankUserMessages += 1;
          continue;
        }
        if (repairedUser.kind === "rewrite") {
          entries.push(repairedUser.entry);
          rewrittenUserMessages += 1;
          continue;
        }
      }
      entries.push(entryForUserRepair);
    } catch {
      droppedLines += 1;
    }
  }
  return {
    entries,
    droppedLines,
    rewrittenAssistantMessages,
    droppedBlankUserMessages,
    rewrittenUserMessages,
    removedCorruptedImageBlocks,
  };
}
function hasEntryRepairs(result) {
  return (
    result.droppedLines > 0 ||
    result.rewrittenAssistantMessages > 0 ||
    result.droppedBlankUserMessages > 0 ||
    result.rewrittenUserMessages > 0 ||
    result.removedCorruptedImageBlocks > 0
  );
}
async function tryIncrementalSessionRepair(params) {
  if (isSameSessionRepairSnapshot(params.cached.snapshot, params.currentSnapshot))
    return {
      repaired: false,
      droppedLines: 0,
      validatedSnapshot: params.currentSnapshot,
    };
  if (
    !params.trustedSnapshot ||
    !isSameSessionRepairSnapshot(params.trustedSnapshot, params.currentSnapshot) ||
    !params.cached.endsWithNewline ||
    !isSameSessionRepairFile(params.cached.snapshot, params.currentSnapshot) ||
    params.currentSnapshot.size <= params.cached.snapshot.size
  )
    return;
  const appendedText = await readSessionRepairSuffix(
    params.sessionFile,
    params.cached.snapshot.size,
    params.currentSnapshot.size - params.cached.snapshot.size,
  );
  if (!appendedText?.endsWith("\n")) return;
  const afterReadSnapshot = await readSessionRepairSnapshot(params.sessionFile);
  if (!afterReadSnapshot || !isSameSessionRepairSnapshot(params.currentSnapshot, afterReadSnapshot))
    return;
  const repairedEntries = repairSessionLines(appendedText.split(/\r?\n/));
  if (hasEntryRepairs(repairedEntries)) return;
  const codeModeToolResultRepair = insertMissingCodeModeToolResults(
    repairedEntries.entries,
    params.cached.toolResultIds,
  );
  if (codeModeToolResultRepair.insertedToolResults > 0) return;
  const messageDeliveryToolResultRepair = insertMissingMessageToolDeliveryMirrorResults(
    codeModeToolResultRepair.entries,
    codeModeToolResultRepair.resultIds,
  );
  if (messageDeliveryToolResultRepair.insertedToolResults > 0) return;
  rememberSessionRepair(params.sessionFile, {
    snapshot: afterReadSnapshot,
    toolResultIds: messageDeliveryToolResultRepair.resultIds,
    endsWithNewline: true,
  });
  return {
    repaired: false,
    droppedLines: 0,
    validatedSnapshot: afterReadSnapshot,
  };
}
/** Repair a persisted session JSONL file in place when replay-breaking corruption is found. */
async function repairSessionFileIfNeeded(params) {
  const sessionFileInput = params.sessionFile.trim();
  if (!sessionFileInput)
    return {
      repaired: false,
      droppedLines: 0,
      reason: "missing session file",
    };
  if (parseSqliteSessionFileMarker(sessionFileInput))
    return {
      repaired: false,
      droppedLines: 0,
      reason: "sqlite transcript",
    };
  const sessionFile = path.resolve(sessionFileInput);
  const beforeReadSnapshot = await readSessionRepairSnapshot(sessionFile);
  if (beforeReadSnapshot) {
    const cached = sessionRepairCache.get(sessionFile);
    if (cached) {
      const incremental = await tryIncrementalSessionRepair({
        sessionFile,
        currentSnapshot: beforeReadSnapshot,
        cached,
        trustedSnapshot: params.trustedSnapshot,
      });
      if (incremental) return incremental;
    }
  } else sessionRepairCache.delete(sessionFile);
  let content;
  try {
    content = await fs$1.readFile(sessionFile, "utf-8");
  } catch (err) {
    sessionRepairCache.delete(sessionFile);
    if (err?.code === "ENOENT")
      return {
        repaired: false,
        droppedLines: 0,
        reason: "missing session file",
      };
    const reason = `failed to read session file: ${err instanceof Error ? err.message : "unknown error"}`;
    params.warn?.(`session file repair skipped: ${reason} (${path.basename(sessionFile)})`);
    return {
      repaired: false,
      droppedLines: 0,
      reason,
    };
  }
  const repairedEntries = repairSessionLines(content.split(/\r?\n/));
  const {
    entries,
    droppedLines,
    rewrittenAssistantMessages,
    droppedBlankUserMessages,
    rewrittenUserMessages,
    removedCorruptedImageBlocks,
  } = repairedEntries;
  if (entries.length === 0) {
    sessionRepairCache.delete(sessionFile);
    return {
      repaired: false,
      droppedLines,
      reason: "empty session file",
    };
  }
  if (!isSessionHeader(entries[0])) {
    sessionRepairCache.delete(sessionFile);
    params.warn?.(
      `session file repair skipped: invalid session header (${path.basename(sessionFile)})`,
    );
    return {
      repaired: false,
      droppedLines,
      reason: "invalid session header",
    };
  }
  const codeModeToolResultRepair = insertMissingCodeModeToolResults(entries);
  let insertedToolResults = codeModeToolResultRepair.insertedToolResults;
  if (codeModeToolResultRepair.insertedToolResults > 0)
    entries.splice(0, entries.length, ...codeModeToolResultRepair.entries);
  const messageDeliveryToolResultRepair = insertMissingMessageToolDeliveryMirrorResults(
    entries,
    codeModeToolResultRepair.resultIds,
  );
  insertedToolResults += messageDeliveryToolResultRepair.insertedToolResults;
  if (messageDeliveryToolResultRepair.insertedToolResults > 0)
    entries.splice(0, entries.length, ...messageDeliveryToolResultRepair.entries);
  const repairedToolResultIds = messageDeliveryToolResultRepair.resultIds;
  if (!hasEntryRepairs(repairedEntries) && insertedToolResults === 0) {
    const afterReadSnapshot = await readSessionRepairSnapshot(sessionFile);
    const validatedSnapshot =
      beforeReadSnapshot &&
      afterReadSnapshot &&
      isSameSessionRepairSnapshot(beforeReadSnapshot, afterReadSnapshot)
        ? afterReadSnapshot
        : void 0;
    if (validatedSnapshot)
      rememberSessionRepair(sessionFile, {
        snapshot: validatedSnapshot,
        toolResultIds: repairedToolResultIds,
        endsWithNewline: content.endsWith("\n"),
      });
    else sessionRepairCache.delete(sessionFile);
    return {
      repaired: false,
      droppedLines: 0,
      ...(validatedSnapshot ? { validatedSnapshot } : {}),
    };
  }
  const cleaned = `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  const backupPath = `${sessionFile}.bak-${process.pid}-${Date.now()}`;
  let retainedBackupPath;
  try {
    const stat = await fs$1.stat(sessionFile).catch(() => null);
    await fs$1.writeFile(backupPath, content, "utf-8");
    if (stat) await fs$1.chmod(backupPath, stat.mode);
    await replaceFileAtomic({
      filePath: sessionFile,
      content: cleaned,
      preserveExistingMode: true,
      tempPrefix: `${path.basename(sessionFile)}.repair`,
    });
    await fs$1.unlink(backupPath).catch((cleanupErr) => {
      retainedBackupPath = backupPath;
      params.debug?.(
        `session file repair backup cleanup failed: ${cleanupErr instanceof Error ? cleanupErr.message : "unknown error"} (${path.basename(backupPath)})`,
      );
    });
  } catch (err) {
    sessionRepairCache.delete(sessionFile);
    return {
      repaired: false,
      droppedLines,
      rewrittenAssistantMessages,
      droppedBlankUserMessages,
      rewrittenUserMessages,
      removedCorruptedImageBlocks,
      reason: `repair failed: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
  let repairedSnapshot;
  try {
    const beforeVerifySnapshot = await readSessionRepairSnapshot(sessionFile);
    const persistedContent = await fs$1.readFile(sessionFile, "utf8");
    const afterVerifySnapshot = await readSessionRepairSnapshot(sessionFile);
    if (
      beforeVerifySnapshot &&
      afterVerifySnapshot &&
      persistedContent === cleaned &&
      isSameSessionRepairSnapshot(beforeVerifySnapshot, afterVerifySnapshot)
    )
      repairedSnapshot = afterVerifySnapshot;
  } catch {
    repairedSnapshot = void 0;
  }
  if (repairedSnapshot)
    rememberSessionRepair(sessionFile, {
      snapshot: repairedSnapshot,
      toolResultIds: repairedToolResultIds,
      endsWithNewline: true,
    });
  else sessionRepairCache.delete(sessionFile);
  params.debug?.(
    `session file repaired: ${buildRepairSummaryParts({
      droppedLines,
      rewrittenAssistantMessages,
      droppedBlankUserMessages,
      rewrittenUserMessages,
      removedCorruptedImageBlocks,
      insertedToolResults,
    })} (${path.basename(sessionFile)})`,
  );
  return {
    repaired: true,
    droppedLines,
    ...(repairedSnapshot ? { validatedSnapshot: repairedSnapshot } : {}),
    rewrittenAssistantMessages,
    droppedBlankUserMessages,
    rewrittenUserMessages,
    removedCorruptedImageBlocks,
    insertedToolResults,
    ...(retainedBackupPath ? { backupPath: retainedBackupPath } : {}),
  };
}
//#endregion
//#region src/agents/sessions/session-manager.ts
/**
 * JSONL-backed session tree manager.
 *
 * Reads, writes, forks, labels, and exports persisted session entries while preserving branch structure.
 */
const SESSION_HEADER_READ_CHUNK_BYTES = 4096;
const MAX_SESSION_HEADER_BYTES = 64 * 1024;
function createSessionId() {
  return uuidv7();
}
/** Generate a unique short ID (8 hex chars, collision-checked) */
function generateId(byId) {
  for (let i = 0; i < 100; i++) {
    const id = randomUUID().slice(0, 8);
    if (!byId.has(id)) return id;
  }
  return randomUUID();
}
/** Migrate v1 → v2: add id/parentId tree structure. Mutates in place. */
function migrateV1ToV2(entries, entriesByOriginalIndex) {
  const ids = /* @__PURE__ */ new Set();
  let prevId = null;
  for (const entry of entries) {
    if (entry.type === "session") {
      entry.version = 2;
      continue;
    }
    entry.id = generateId(ids);
    ids.add(entry.id);
    entry.parentId = prevId;
    prevId = entry.id;
    if (entry.type === "compaction") {
      const comp = entry;
      if (typeof comp.firstKeptEntryIndex === "number") {
        const targetEntry =
          entriesByOriginalIndex?.[comp.firstKeptEntryIndex] ?? entries[comp.firstKeptEntryIndex];
        if (targetEntry && targetEntry.type !== "session") comp.firstKeptEntryId = targetEntry.id;
        delete comp.firstKeptEntryIndex;
      }
    }
  }
}
/** Migrate v2 → v3: rename hookMessage role to custom. Mutates in place. */
function migrateV2ToV3(entries) {
  for (const entry of entries) {
    if (entry.type === "session") {
      entry.version = 3;
      continue;
    }
    if (entry.type === "message") {
      const msgEntry = entry;
      if (msgEntry.message && msgEntry.message.role === "hookMessage")
        msgEntry.message.role = "custom";
    }
  }
}
/**
 * Run all necessary migrations to bring entries to current version.
 * Mutates entries in place. Returns true if any migration was applied.
 */
function migrateToCurrentVersion(entries, entriesByOriginalIndex) {
  const version = entries.find((e) => e.type === "session")?.version ?? 1;
  if (version >= 3) return false;
  if (version < 2) migrateV1ToV2(entries, entriesByOriginalIndex);
  if (version < 3) migrateV2ToV3(entries);
  return true;
}
/** Exported for testing */
function migrateSessionEntries(entries) {
  migrateToCurrentVersion(entries);
}
/** Exported for compaction.test.ts */
function parseSessionEntries(content) {
  return parseJsonlEntries(content);
}
function getLatestCompactionEntry(entries) {
  for (const entry of entries.toReversed()) if (entry.type === "compaction") return entry;
  return null;
}
/**
 * Build the session context from entries using tree traversal.
 * If leafId is provided, walks from that entry to root.
 * Handles compaction and branch summaries along the path.
 */
function buildSessionContext(entries, leafId, byIdInput) {
  let contextEntries = entries;
  let contextById = byIdInput;
  if (leafId === void 0) {
    const selectedEntries = selectSessionTranscriptLeafControlledPath(entries);
    if (selectedEntries !== void 0) {
      contextEntries = selectedEntries;
      contextById = void 0;
    }
  }
  let byId = contextById;
  if (!byId) {
    byId = /* @__PURE__ */ new Map();
    for (const entry of contextEntries) byId.set(entry.id, entry);
  }
  let leaf;
  if (leafId === null)
    return {
      messages: [],
      thinkingLevel: "off",
      model: null,
    };
  if (leafId) leaf = byId.get(leafId);
  if (!leaf) leaf = contextEntries[contextEntries.length - 1];
  if (!leaf)
    return {
      messages: [],
      thinkingLevel: "off",
      model: null,
    };
  const path = [];
  let current = leaf;
  while (current) {
    path.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : void 0;
  }
  return buildSessionContext$1(path);
}
/**
 * Compute the default session directory for a cwd.
 * Encodes cwd into a safe directory name under ~/.openclaw/agent/sessions/.
 */
function getDefaultSessionDir(cwd, agentDir = getAgentDir()) {
  const sessionDir = join(
    agentDir,
    "sessions",
    `--${cwd.replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}--`,
  );
  if (!existsSync(sessionDir)) mkdirSync(sessionDir, { recursive: true });
  return sessionDir;
}
/** Exported for testing */
function loadEntriesFromFile(filePath) {
  if (!existsSync(filePath)) return [];
  const entries = parseJsonlEntries(readFileSync(filePath, "utf8"));
  return hasReadableSessionHeader(entries) ? entries : [];
}
function loadEntriesFromFileWithSnapshot(filePath) {
  const resolvedPath = resolve(filePath);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let beforeReadSnapshot;
    try {
      beforeReadSnapshot = readSessionFileSnapshot(resolvedPath);
    } catch {
      sessionEntriesCache.delete(resolvedPath);
      return {
        entries: [],
        snapshot: void 0,
      };
    }
    const cached = sessionEntriesCache.get(resolvedPath);
    if (cached && isSameSessionFileSnapshot(cached.snapshot, beforeReadSnapshot)) {
      const afterCacheSnapshot = readSessionFileSnapshotIfExists(resolvedPath);
      if (afterCacheSnapshot && isSameSessionFileSnapshot(beforeReadSnapshot, afterCacheSnapshot))
        return {
          entries: copyFileEntries(cached.entries),
          snapshot: afterCacheSnapshot,
        };
      continue;
    }
    const content = readFileSync(resolvedPath, "utf8");
    const entries = parseJsonlEntries(content);
    const afterParseSnapshot = readSessionFileSnapshotIfExists(resolvedPath);
    if (afterParseSnapshot && isSameSessionFileSnapshot(beforeReadSnapshot, afterParseSnapshot))
      return {
        entries: rememberSessionEntries(
          resolvedPath,
          afterParseSnapshot,
          entries,
          content.endsWith("\n"),
        ),
        snapshot: afterParseSnapshot,
      };
  }
  sessionEntriesCache.delete(resolvedPath);
  throw new Error(`session file changed repeatedly while loading: ${resolvedPath}`);
}
const MAX_CACHED_SESSION_FILES = 8;
const MAX_CACHED_SESSION_BYTES = 32n * 1024n * 1024n;
const sessionEntriesCache = /* @__PURE__ */ new Map();
function readSessionFileSnapshot(filePath) {
  const fileStat = statSync(filePath, { bigint: true });
  return {
    dev: fileStat.dev,
    ino: fileStat.ino,
    size: fileStat.size,
    mtimeNs: fileStat.mtimeNs,
    ctimeNs: fileStat.ctimeNs,
  };
}
function isSameSessionFileSnapshot(left, right) {
  return (
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.size === right.size &&
    left.mtimeNs === right.mtimeNs &&
    left.ctimeNs === right.ctimeNs
  );
}
function rememberSessionEntries(filePath, snapshot, entries, endsWithNewline) {
  if (!hasReadableSessionHeader(entries)) {
    sessionEntriesCache.delete(filePath);
    return entries.length === 0 ? entries : [];
  }
  if (!hasCacheableSessionHeader(entries)) {
    sessionEntriesCache.delete(filePath);
    return entries;
  }
  if (snapshot.size > MAX_CACHED_SESSION_BYTES) {
    sessionEntriesCache.delete(filePath);
    return copyFileEntries(entries.map(freezeFileEntry));
  }
  const cachedEntries = entries.map((entry) => {
    if (Object.isFrozen(entry)) return entry;
    return freezeFileEntry(entry);
  });
  const cached = {
    snapshot,
    entries: cachedEntries,
    endsWithNewline,
  };
  sessionEntriesCache.delete(filePath);
  sessionEntriesCache.set(filePath, cached);
  trimSessionEntriesCache();
  return copyFileEntries(cachedEntries);
}
function trimSessionEntriesCache() {
  let cachedBytes = 0n;
  for (const cached of sessionEntriesCache.values()) cachedBytes += cached.snapshot.size;
  while (
    sessionEntriesCache.size > MAX_CACHED_SESSION_FILES ||
    cachedBytes > MAX_CACHED_SESSION_BYTES
  ) {
    const oldestKey = sessionEntriesCache.keys().next().value;
    if (!oldestKey) break;
    cachedBytes -= sessionEntriesCache.get(oldestKey)?.snapshot.size ?? 0n;
    sessionEntriesCache.delete(oldestKey);
  }
}
function hasCacheableSessionHeader(entries) {
  if (entries.length === 0) return true;
  const header = entries[0];
  if (!header || header.type !== "session" || typeof header.id !== "string") return false;
  return header.version === 3;
}
function rememberWrittenSessionEntries(filePath, expectedContent) {
  const resolvedPath = resolve(filePath);
  invalidateSessionFileRepairCache(resolvedPath);
  let beforeReadSnapshot;
  try {
    beforeReadSnapshot = readSessionFileSnapshot(resolvedPath);
  } catch {
    sessionEntriesCache.delete(resolvedPath);
    return {
      snapshot: void 0,
      verifiedWrite: false,
      stableRead: false,
    };
  }
  if (beforeReadSnapshot.size > MAX_CACHED_SESSION_BYTES) {
    sessionEntriesCache.delete(resolvedPath);
    return {
      snapshot: beforeReadSnapshot,
      verifiedWrite: false,
      stableRead: false,
    };
  }
  let content;
  let afterReadSnapshot;
  try {
    content = readFileSync(resolvedPath, "utf8");
    afterReadSnapshot = readSessionFileSnapshot(resolvedPath);
  } catch {
    sessionEntriesCache.delete(resolvedPath);
    return {
      snapshot: void 0,
      verifiedWrite: false,
      stableRead: false,
    };
  }
  if (
    (expectedContent !== void 0 && content !== expectedContent) ||
    !isSameSessionFileSnapshot(beforeReadSnapshot, afterReadSnapshot)
  ) {
    sessionEntriesCache.delete(resolvedPath);
    return {
      snapshot: afterReadSnapshot,
      verifiedWrite: false,
      stableRead: false,
    };
  }
  rememberSessionEntries(
    resolvedPath,
    afterReadSnapshot,
    parseJsonlEntries(content),
    content.endsWith("\n"),
  );
  return {
    snapshot: afterReadSnapshot,
    verifiedWrite: expectedContent !== void 0,
    stableRead: true,
  };
}
function rememberAppendedSessionEntry(
  filePath,
  previousSnapshot,
  beforeAppendSnapshot,
  serializedAppend,
  cacheOwnedAppend,
  publishOwnedAppend,
  invalidateSerializedPrefixCache,
) {
  const resolvedPath = resolve(filePath);
  const appendedByteLength = BigInt(Buffer.byteLength(serializedAppend, "utf8"));
  const isVerifiedOwnedAppend = (snapshot) =>
    Boolean(
      publishOwnedAppend &&
      beforeAppendSnapshot &&
      snapshot &&
      snapshot.dev === beforeAppendSnapshot.dev &&
      snapshot.ino === beforeAppendSnapshot.ino &&
      snapshot.size === beforeAppendSnapshot.size + appendedByteLength,
    );
  if (!cacheOwnedAppend) {
    sessionEntriesCache.delete(resolvedPath);
    invalidateSessionFileRepairCache(resolvedPath);
    const snapshot = readSessionFileSnapshotIfExists(resolvedPath);
    return {
      snapshot,
      cacheAdvanced: false,
      ownedAppendVerified: isVerifiedOwnedAppend(snapshot),
    };
  }
  if (
    !previousSnapshot ||
    !beforeAppendSnapshot ||
    !isSameSessionFileSnapshot(previousSnapshot, beforeAppendSnapshot)
  ) {
    sessionEntriesCache.delete(resolvedPath);
    invalidateSessionFileRepairCache(resolvedPath);
    return {
      snapshot: readSessionFileSnapshotIfExists(resolvedPath),
      cacheAdvanced: false,
      ownedAppendVerified: false,
    };
  }
  const cached = sessionEntriesCache.get(resolvedPath);
  const snapshot = readSessionFileSnapshotIfExists(resolvedPath);
  const expectedSize = beforeAppendSnapshot.size + appendedByteLength;
  if (
    !snapshot ||
    !cached ||
    cached.snapshot.dev !== previousSnapshot.dev ||
    cached.snapshot.ino !== previousSnapshot.ino ||
    snapshot.dev !== beforeAppendSnapshot.dev ||
    snapshot.ino !== beforeAppendSnapshot.ino ||
    snapshot.size !== expectedSize ||
    !isSameSessionFileSnapshot(cached.snapshot, previousSnapshot)
  ) {
    sessionEntriesCache.delete(resolvedPath);
    invalidateSessionFileRepairCache(resolvedPath);
    return {
      snapshot,
      cacheAdvanced: false,
      ownedAppendVerified: false,
    };
  }
  if (invalidateSerializedPrefixCache) {
    sessionEntriesCache.delete(resolvedPath);
    invalidateSessionFileRepairCache(resolvedPath);
    return {
      snapshot,
      cacheAdvanced: false,
      ownedAppendVerified: true,
    };
  }
  if (snapshot.size > MAX_CACHED_SESSION_BYTES) {
    sessionEntriesCache.delete(resolvedPath);
    return {
      snapshot,
      cacheAdvanced: false,
      ownedAppendVerified: true,
    };
  }
  const persistedEntry = JSON.parse(
    serializedAppend.startsWith("\n") ? serializedAppend.slice(1) : serializedAppend,
  );
  cached.entries.push(freezeFileEntry(normalizeLoadedFileEntry(persistedEntry)));
  cached.snapshot = snapshot;
  cached.endsWithNewline = true;
  sessionEntriesCache.delete(resolvedPath);
  sessionEntriesCache.set(resolvedPath, cached);
  trimSessionEntriesCache();
  return {
    snapshot,
    cacheAdvanced: true,
    ownedAppendVerified: true,
  };
}
function publishRememberedSessionFileSnapshot(filePath, snapshot) {
  if (!snapshot) return;
  if (
    publishOwnedSessionFileSnapshot({
      sessionFile: filePath,
      snapshot,
    }) === false
  ) {
    sessionEntriesCache.delete(resolve(filePath));
    invalidateSessionFileRepairCache(filePath);
  }
}
function jsonSerializationCanRunUserCode(value, ancestors = /* @__PURE__ */ new Set()) {
  if (typeof value === "bigint")
    return Object.getOwnPropertyDescriptor(BigInt.prototype, "toJSON") !== void 0;
  if ((typeof value !== "object" && typeof value !== "function") || value === null) return false;
  try {
    if (isProxy(value) || ancestors.has(value)) return true;
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== null)
      return true;
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (
      descriptors.toJSON ||
      (prototype !== null && Object.getOwnPropertyDescriptor(prototype, "toJSON")) ||
      Object.values(descriptors).some(
        (descriptor) => descriptor.get !== void 0 || descriptor.set !== void 0,
      )
    )
      return true;
    ancestors.add(value);
    try {
      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
          const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
          if (
            !descriptor ||
            descriptor.get !== void 0 ||
            descriptor.set !== void 0 ||
            ("value" in descriptor && jsonSerializationCanRunUserCode(descriptor.value, ancestors))
          )
            return true;
        }
        return false;
      }
      return Object.values(descriptors).some(
        (descriptor) =>
          descriptor.enumerable &&
          "value" in descriptor &&
          jsonSerializationCanRunUserCode(descriptor.value, ancestors),
      );
    } finally {
      ancestors.delete(value);
    }
  } catch {
    return true;
  }
}
function hasOwnProperty(value, key) {
  return Object.hasOwn(value, key);
}
function hasAssistantToolCallArguments(message) {
  if (!Array.isArray(message.content)) return false;
  return message.content.some(
    (part) => part.type === "toolCall" && hasOwnProperty(part, "arguments"),
  );
}
function messageSerializesOwnedValues(message) {
  if (message.role === "toolResult") return hasOwnProperty(message, "details");
  if (message.role === "assistant") return hasAssistantToolCallArguments(message);
  if (message.role === "custom") return hasOwnProperty(message, "details");
  return false;
}
function readSessionFileSnapshotIfExists(filePath) {
  try {
    return readSessionFileSnapshot(filePath);
  } catch {
    return;
  }
}
function sessionFileNeedsAppendSeparator(filePath, snapshot) {
  if (!snapshot || snapshot.size === 0n) return false;
  const resolvedPath = resolve(filePath);
  const cached = sessionEntriesCache.get(resolvedPath);
  if (cached && isSameSessionFileSnapshot(cached.snapshot, snapshot))
    return !cached.endsWithNewline;
  const fileDescriptor = openSync(resolvedPath, "r");
  try {
    const lastByte = Buffer.allocUnsafe(1);
    return readSync(fileDescriptor, lastByte, 0, 1, snapshot.size - 1n) === 1 && lastByte[0] !== 10;
  } finally {
    closeSync(fileDescriptor);
  }
}
function revalidateLoadedSessionFile(filePath, loaded) {
  const currentSnapshot = readSessionFileSnapshotIfExists(resolve(filePath));
  if (
    loaded.snapshot &&
    currentSnapshot &&
    isSameSessionFileSnapshot(loaded.snapshot, currentSnapshot)
  )
    return loaded;
  if (!loaded.snapshot && !currentSnapshot) return loaded;
  return loadEntriesFromFileWithSnapshot(filePath);
}
function loadSqliteMarkedSessionFile(sessionFile, options = {}) {
  const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
  if (!sqliteMarker) return;
  const sessionKey = resolveTranscriptSessionKeyBySessionId(sqliteMarker);
  if (!sessionKey)
    throw new Error(`Cannot open SQLite session without session entry: ${sqliteMarker.sessionId}`);
  const entries = loadTranscriptEventsSync(sqliteMarker);
  const header = entries.find((e) => isJsonRecord(e) && e.type === "session");
  return {
    cwd: options.cwdOverride ?? header?.cwd ?? options.fallbackCwd ?? process.cwd(),
    entries,
    sessionKey,
    sqliteMarker,
  };
}
function copyFileEntries(entries) {
  const copy = entries.slice();
  const header = copy.at(0);
  if (header?.type === "session" && Object.isFrozen(header)) copy[0] = cloneFileEntry(header);
  return copy;
}
function cloneFileEntry(entry) {
  return structuredClone(entry);
}
function freezeFileEntry(entry) {
  freezeJsonLikeValue(entry);
  return entry;
}
function freezeJsonLikeValue(value, seen = /* @__PURE__ */ new WeakSet()) {
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) for (const item of value) freezeJsonLikeValue(item, seen);
  else for (const item of Object.values(value)) freezeJsonLikeValue(item, seen);
  Object.freeze(value);
}
function parseJsonlEntries(content) {
  const entries = [];
  const lines = content.trim().split("\n");
  let skipped = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      entries.push(normalizeLoadedFileEntry(entry));
    } catch {
      skipped++;
    }
  }
  if (skipped > 0)
    logWarn(
      `parseJsonlEntries: skipped ${skipped} malformed JSONL line(s) — ${entries.length} valid entries were loaded`,
    );
  return entries;
}
/**
 * Repairs legacy JSONL message shapes (string assistant/toolResult content) into
 * canonical block arrays. Every legacy-JSONL ingress point — file-era transcript
 * reads and the doctor SQLite import — must apply this so the SQLite store only
 * ever holds canonical rows; the SQLite read path does no repair.
 */
function normalizeLoadedFileEntry(entry) {
  if (!isJsonRecord(entry) || entry.type !== "message" || !isJsonRecord(entry.message))
    return entry;
  const message = entry.message;
  if (
    (message.role === "assistant" || message.role === "toolResult") &&
    typeof message.content === "string"
  )
    message.content = [
      {
        type: "text",
        text: message.content,
      },
    ];
  else if (message.role === "toolResult" && isJsonRecord(message.content))
    message.content = [message.content];
  return entry;
}
function hasReadableSessionHeader(entries) {
  const header = entries[0];
  return header?.type === "session" && typeof header.id === "string";
}
function isJsonRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isSessionEntryType(type) {
  switch (type) {
    case "message":
    case "thinking_level_change":
    case "model_change":
    case "compaction":
    case "branch_summary":
    case "custom":
    case "custom_message":
    case "label":
    case "session_info":
      return true;
    default:
      return false;
  }
}
function isIndexedSessionEntry(entry) {
  if (!isJsonRecord(entry)) return false;
  return isSessionEntryType(entry.type) && typeof entry.id === "string" && entry.id.length > 0;
}
function parseParentLinkedOpaqueEntry(record) {
  if (
    !isJsonRecord(record) ||
    record.type === "session" ||
    record.type === "leaf" ||
    typeof record.id !== "string" ||
    record.id.length === 0 ||
    (record.parentId !== null && typeof record.parentId !== "string")
  )
    return;
  return {
    id: record.id,
    parentId: record.parentId,
  };
}
function parseOpaqueLeafEntry(record) {
  if (
    !isJsonRecord(record) ||
    record.type !== "leaf" ||
    typeof record.id !== "string" ||
    record.id.length === 0 ||
    (record.parentId !== null && typeof record.parentId !== "string")
  )
    return;
  if (record.targetId !== null && typeof record.targetId !== "string") return;
  if (
    record.appendParentId !== void 0 &&
    record.appendParentId !== null &&
    typeof record.appendParentId !== "string"
  )
    return;
  if (record.appendMode !== void 0 && record.appendMode !== "side") return;
  return {
    id: record.id,
    parentId: record.parentId,
    targetId: record.targetId,
    ...(record.appendParentId !== void 0 ? { appendParentId: record.appendParentId } : {}),
    ...(record.appendMode === "side" ? { appendMode: record.appendMode } : {}),
  };
}
function partitionSessionFileEntries(entries) {
  const fileEntries = [];
  const opaqueEntries = [];
  const fileEntriesByOriginalIndex = [];
  const acceptsLegacyEntries =
    (entries.find(
      (entry) => isJsonRecord(entry) && entry.type === "session" && typeof entry.id === "string",
    )?.version ?? 1) < 2;
  let hasHeader = false;
  for (const [originalIndex, entry] of entries.entries()) {
    if (
      !hasHeader &&
      isJsonRecord(entry) &&
      entry.type === "session" &&
      typeof entry.id === "string"
    ) {
      fileEntries.push(entry);
      fileEntriesByOriginalIndex[originalIndex] = entry;
      hasHeader = true;
      continue;
    }
    if (
      isIndexedSessionEntry(entry) ||
      (acceptsLegacyEntries && isJsonRecord(entry) && isSessionEntryType(entry.type))
    ) {
      fileEntries.push(entry);
      fileEntriesByOriginalIndex[originalIndex] = entry;
      continue;
    }
    opaqueEntries.push({
      index: fileEntries.length,
      record: entry,
    });
  }
  return {
    fileEntries,
    opaqueEntries,
    fileEntriesByOriginalIndex,
  };
}
function buildCorruptSessionBackupPath(filePath) {
  return `${filePath}.corrupt-${/* @__PURE__ */ new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}.jsonl`;
}
function recoverCorruptSessionEntries(filePath, cwd) {
  const content = readFileSync(filePath, "utf8");
  if (content.trim().length === 0) return null;
  const parsedEntries = parseJsonlEntries(content);
  const header = parsedEntries.find(
    (entry) => entry.type === "session" && typeof entry.id === "string",
  ) ?? {
    type: "session",
    version: 3,
    id: createSessionId(),
    timestamp: /* @__PURE__ */ new Date().toISOString(),
    cwd,
  };
  const recoveredEntries = parsedEntries.filter((entry) => entry.type !== "session");
  const backupPath = buildCorruptSessionBackupPath(filePath);
  const backupMode = statSync(filePath).mode & 511;
  writeFileSync(backupPath, content, {
    encoding: "utf8",
    mode: backupMode || 384,
  });
  chmodSync(backupPath, backupMode || 384);
  return [header, ...recoveredEntries];
}
function readFirstSessionFileLine(filePath) {
  const fd = openSync(filePath, "r");
  try {
    const chunks = [];
    let totalBytes = 0;
    while (totalBytes < MAX_SESSION_HEADER_BYTES) {
      const buffer = Buffer.alloc(
        Math.min(SESSION_HEADER_READ_CHUNK_BYTES, MAX_SESSION_HEADER_BYTES - totalBytes),
      );
      const bytesRead = readSync(fd, buffer, 0, buffer.length, totalBytes);
      if (bytesRead === 0) break;
      const newlineIndex = buffer.indexOf(10);
      if (newlineIndex >= 0 && newlineIndex < bytesRead) {
        chunks.push(buffer.subarray(0, newlineIndex));
        return Buffer.concat(chunks).toString("utf8");
      }
      chunks.push(buffer.subarray(0, bytesRead));
      totalBytes += bytesRead;
    }
    return chunks.length > 0 ? Buffer.concat(chunks).toString("utf8") : void 0;
  } finally {
    closeSync(fd);
  }
}
function readSessionHeaderFromFile(filePath) {
  try {
    const firstLine = readFirstSessionFileLine(filePath);
    if (!firstLine) return;
    const header = JSON.parse(firstLine);
    if (header.type !== "session" || typeof header.id !== "string") return;
    return header;
  } catch {
    return;
  }
}
/** Exported for testing */
function findMostRecentSession(sessionDir, cwd) {
  try {
    return (
      readdirSync(sessionDir)
        .filter((f) => f.endsWith(".jsonl"))
        .map((f) => join(sessionDir, f))
        .map((path) => ({
          path,
          header: readSessionHeaderFromFile(path),
        }))
        .filter(
          (candidate) =>
            candidate.header !== void 0 && (cwd === void 0 || candidate.header.cwd === cwd),
        )
        .map((candidate) => ({
          path: candidate.path,
          mtime: statSync(candidate.path).mtime,
        }))
        .toSorted((a, b) => b.mtime.getTime() - a.mtime.getTime())[0]?.path || null
    );
  } catch {
    return null;
  }
}
function isMessageWithContent(message) {
  return typeof message.role === "string" && "content" in message;
}
function extractTextContent(message) {
  const content = message.content;
  if (typeof content === "string") return content;
  return content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join(" ");
}
function getLastActivityTime(entries) {
  let lastActivityTime;
  for (const entry of entries) {
    if (entry.type !== "message") continue;
    const message = entry.message;
    if (!isMessageWithContent(message)) continue;
    if (message.role !== "user" && message.role !== "assistant") continue;
    const msgTimestamp = message.timestamp;
    if (typeof msgTimestamp === "number") {
      lastActivityTime = Math.max(lastActivityTime ?? 0, msgTimestamp);
      continue;
    }
    const entryTimestamp = entry.timestamp;
    if (typeof entryTimestamp === "string") {
      const t = new Date(entryTimestamp).getTime();
      if (!Number.isNaN(t)) lastActivityTime = Math.max(lastActivityTime ?? 0, t);
    }
  }
  return lastActivityTime;
}
function getSessionModifiedDate(entries, header, statsMtime) {
  const lastActivityTime = getLastActivityTime(entries);
  if (typeof lastActivityTime === "number" && lastActivityTime > 0)
    return new Date(lastActivityTime);
  const headerTime =
    typeof header.timestamp === "string" ? new Date(header.timestamp).getTime() : NaN;
  return !Number.isNaN(headerTime) ? new Date(headerTime) : statsMtime;
}
async function buildSessionInfo(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    const entries = [];
    const lines = content.trim().split("\n");
    let skipped = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        entries.push(JSON.parse(line));
      } catch {
        skipped++;
      }
    }
    if (skipped > 0)
      logWarn(
        `buildSessionInfo: skipped ${skipped} malformed JSONL line(s) in ${filePath} — ${entries.length} valid entries were loaded`,
      );
    if (entries.length === 0) return null;
    const header = entries[0];
    if (!header || header.type !== "session") return null;
    const stats = await stat(filePath);
    let messageCount = 0;
    let firstMessage = "";
    const allMessages = [];
    let name;
    for (const entry of entries) {
      if (entry.type === "session_info") name = entry.name?.trim() || void 0;
      if (entry.type !== "message") continue;
      messageCount++;
      const message = entry.message;
      if (!isMessageWithContent(message)) continue;
      if (message.role !== "user" && message.role !== "assistant") continue;
      const textContent = extractTextContent(message);
      if (!textContent) continue;
      allMessages.push(textContent);
      if (!firstMessage && message.role === "user") firstMessage = textContent;
    }
    const cwd = typeof header.cwd === "string" ? header.cwd : "";
    const parentSessionPath = header.parentSession;
    const modified = getSessionModifiedDate(entries, header, stats.mtime);
    return {
      path: filePath,
      id: header.id,
      cwd,
      name,
      parentSessionPath,
      created: new Date(header.timestamp),
      modified,
      messageCount,
      firstMessage: firstMessage || "(no messages)",
      allMessagesText: allMessages.join(" "),
    };
  } catch {
    return null;
  }
}
function sessionInfoMatchesCwd(info, cwd) {
  return cwd === void 0 || info.cwd === cwd;
}
const MAX_CONCURRENT_SESSION_INFO_LOADS = 10;
async function listSessionsFromDir(dir, onProgress, progressOffset = 0, progressTotal, cwd) {
  if (!existsSync(dir)) return [];
  try {
    const files = (await readdir(dir)).filter((f) => f.endsWith(".jsonl")).map((f) => join(dir, f));
    const total = progressTotal ?? files.length;
    let loaded = 0;
    return (
      await pMap(
        files,
        async (file) => {
          try {
            return (await buildSessionInfo(file)) ?? pMapSkip;
          } catch {
            return pMapSkip;
          } finally {
            loaded++;
            onProgress?.(progressOffset + loaded, total);
          }
        },
        {
          concurrency: MAX_CONCURRENT_SESSION_INFO_LOADS,
          stopOnError: false,
        },
      )
    ).filter((info) => sessionInfoMatchesCwd(info, cwd));
  } catch {
    return [];
  }
}
/**
 * Manages conversation sessions as append-only trees stored in JSONL files.
 *
 * Each session entry has an id and parentId forming a tree structure. The "leaf"
 * pointer tracks the current position. Appending creates a child of the current leaf.
 * Branching moves the leaf to an earlier entry, allowing new branches without
 * modifying history.
 *
 * Use buildSessionContext() to get the resolved message list for the LLM, which
 * handles compaction summaries and follows the path from root to current leaf.
 */
var SessionManager = class SessionManager {
  constructor(cwd, sessionDir, sessionFile, persist, loadedSessionFile, sqlitePersistence) {
    this.sessionId = "";
    this.flushed = false;
    this.fileEntries = [];
    this.opaqueFileEntries = [];
    this.byId = /* @__PURE__ */ new Map();
    this.opaqueParentsById = /* @__PURE__ */ new Map();
    this.logicalParentsById = /* @__PURE__ */ new Map();
    this.invalidLeafControlIds = /* @__PURE__ */ new Set();
    this.labelsById = /* @__PURE__ */ new Map();
    this.labelTimestampsById = /* @__PURE__ */ new Map();
    this.leafId = null;
    this.appendParentId = null;
    this.recoveredCorruptHeader = false;
    this.cwd = cwd;
    this.sessionDir = sessionDir;
    this.shouldPersist = persist;
    this.sqlitePersistence = sqlitePersistence;
    if (persist && sessionDir && !existsSync(sessionDir))
      mkdirSync(sessionDir, { recursive: true });
    if (sessionFile)
      if (sqlitePersistence)
        this.setLoadedSqliteSessionFile(
          sessionFile,
          loadedSessionFile ?? {
            entries: [],
            snapshot: void 0,
          },
        );
      else
        this.setLoadedSessionFile(
          sessionFile,
          loadedSessionFile ?? loadEntriesFromFileWithSnapshot(sessionFile),
        );
    else this.newSession();
  }
  /** Switch to a different session file (used for resume and branching) */
  setSessionFile(sessionFile) {
    const sqliteLoaded = loadSqliteMarkedSessionFile(sessionFile, { fallbackCwd: this.cwd });
    if (sqliteLoaded) {
      this.cwd = sqliteLoaded.cwd;
      this.sqlitePersistence = {
        ...sqliteLoaded.sqliteMarker,
        sessionKey: sqliteLoaded.sessionKey,
      };
      this.setLoadedSqliteSessionFile(sessionFile, {
        entries: sqliteLoaded.entries,
        snapshot: void 0,
      });
      return;
    }
    this.sqlitePersistence = void 0;
    this.setLoadedSessionFile(sessionFile, loadEntriesFromFileWithSnapshot(sessionFile));
  }
  setLoadedSessionFile(sessionFile, loaded) {
    this.sessionFile = resolve(sessionFile);
    this.sessionFileSnapshot = void 0;
    this.recoveredCorruptHeader = false;
    if (existsSync(this.sessionFile)) {
      const partitioned = partitionSessionFileEntries(loaded.entries);
      this.fileEntries = partitioned.fileEntries;
      this.opaqueFileEntries = partitioned.opaqueEntries;
      this.sessionFileSnapshot = loaded.snapshot;
      if (this.fileEntries.length === 0) {
        const recoveredEntries = recoverCorruptSessionEntries(this.sessionFile, this.cwd);
        if (recoveredEntries && hasReadableSessionHeader(recoveredEntries)) {
          const recovered = partitionSessionFileEntries(recoveredEntries);
          this.fileEntries = recovered.fileEntries;
          this.opaqueFileEntries = recovered.opaqueEntries;
          const header = this.fileEntries.find((e) => e.type === "session");
          this.sessionId = header?.id ?? createSessionId();
          migrateToCurrentVersion(this.fileEntries, recovered.fileEntriesByOriginalIndex);
          this.buildIndex();
          this.replacePersistedTranscript();
          this.recoveredCorruptHeader = true;
          this.flushed = true;
          return;
        }
        const explicitPath = this.sessionFile;
        this.newSession();
        this.sessionFile = explicitPath;
        this.replacePersistedTranscript();
        this.flushed = true;
        return;
      }
      const header = this.fileEntries.find((e) => e.type === "session");
      this.sessionId = header?.id ?? createSessionId();
      const migrated = migrateToCurrentVersion(
        this.fileEntries,
        partitioned.fileEntriesByOriginalIndex,
      );
      this.buildIndex();
      if (migrated) this.replacePersistedTranscript();
      this.flushed = true;
    } else {
      const explicitPath = this.sessionFile;
      this.newSession();
      this.sessionFile = explicitPath;
    }
  }
  setLoadedSqliteSessionFile(sessionFile, loaded) {
    this.sessionFile = sessionFile;
    this.sessionFileSnapshot = void 0;
    this.recoveredCorruptHeader = false;
    const partitioned = partitionSessionFileEntries(loaded.entries);
    if (partitioned.fileEntries.length === 0) {
      this.newSession({ id: this.sqlitePersistence?.sessionId });
      this.sessionFile = sessionFile;
      return;
    }
    this.fileEntries = partitioned.fileEntries;
    this.opaqueFileEntries = partitioned.opaqueEntries;
    const header = this.fileEntries.find((e) => e.type === "session");
    this.sessionId = header?.id ?? this.sqlitePersistence?.sessionId ?? createSessionId();
    migrateToCurrentVersion(this.fileEntries, partitioned.fileEntriesByOriginalIndex);
    this.buildIndex();
    this.flushed = true;
  }
  newSession(options) {
    this.recoveredCorruptHeader = false;
    this.sessionFileSnapshot = void 0;
    this.sessionId = options?.id ?? createSessionId();
    const timestamp = /* @__PURE__ */ new Date().toISOString();
    const header = {
      type: "session",
      version: 3,
      id: this.sessionId,
      timestamp,
      cwd: this.cwd,
      parentSession: options?.parentSession,
    };
    this.fileEntries = [header];
    this.opaqueFileEntries = [];
    this.byId.clear();
    this.opaqueParentsById.clear();
    this.logicalParentsById.clear();
    this.invalidLeafControlIds.clear();
    this.labelsById.clear();
    this.leafId = null;
    this.appendParentId = null;
    this.promptReleasedSideBranchParentId = void 0;
    this.flushed = false;
    if (this.shouldPersist) {
      const fileTimestamp = timestamp.replace(/[:.]/g, "-");
      this.sessionFile = join(this.getSessionDir(), `${fileTimestamp}_${this.sessionId}.jsonl`);
    }
    return this.sessionFile;
  }
  resolveOpaqueLeafTargetId(targetId) {
    if (targetId === null || this.byId.has(targetId)) return targetId;
    return this.resolveCanonicalParentId(targetId);
  }
  resolveOpaqueAppendParentId(parentId) {
    if (parentId === null || this.byId.has(parentId) || this.opaqueParentsById.has(parentId))
      return parentId;
    return this.resolveCanonicalParentId(parentId);
  }
  resolveOpaqueLeafControl(leafEntry) {
    if (!leafEntry) return;
    const isKnownReference = (id) =>
      id === null ||
      this.byId.has(id) ||
      (this.opaqueParentsById.has(id) && !this.invalidLeafControlIds.has(id));
    if (
      !isKnownReference(leafEntry.targetId) ||
      (leafEntry.appendParentId !== void 0 && !isKnownReference(leafEntry.appendParentId))
    )
      return;
    const leafId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
    return {
      leafId,
      appendParentId:
        leafEntry.appendParentId === void 0
          ? leafId
          : this.resolveOpaqueAppendParentId(leafEntry.appendParentId),
      ...(leafEntry.appendMode ? { appendMode: leafEntry.appendMode } : {}),
    };
  }
  buildIndex() {
    this.byId.clear();
    this.opaqueParentsById.clear();
    this.logicalParentsById.clear();
    this.invalidLeafControlIds.clear();
    this.labelsById.clear();
    this.labelTimestampsById.clear();
    this.leafId = null;
    this.appendParentId = null;
    this.promptReleasedSideBranchParentId = void 0;
    let opaqueIndex = 0;
    for (let index = 0; index <= this.fileEntries.length; index += 1) {
      while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
        const opaqueRecord = this.opaqueFileEntries[opaqueIndex]?.record;
        const leafEntry = parseOpaqueLeafEntry(opaqueRecord);
        if (leafEntry) {
          const leafState = this.resolveOpaqueLeafControl(leafEntry);
          if (!leafState) {
            this.invalidLeafControlIds.add(leafEntry.id);
            this.opaqueParentsById.set(
              leafEntry.id,
              this.resolveOpaqueAppendParentId(leafEntry.parentId),
            );
            opaqueIndex += 1;
            continue;
          }
          this.opaqueParentsById.set(leafEntry.id, leafState.leafId);
          this.leafId = leafState.leafId;
          this.appendParentId = leafState.appendParentId;
          this.promptReleasedSideBranchParentId =
            leafState.appendMode === "side" ? leafState.appendParentId : void 0;
          opaqueIndex += 1;
          continue;
        }
        const link = parseParentLinkedOpaqueEntry(opaqueRecord);
        if (link) {
          this.opaqueParentsById.set(link.id, link.parentId);
          this.appendParentId = link.id;
          if (this.promptReleasedSideBranchParentId !== void 0)
            this.promptReleasedSideBranchParentId = link.id;
        }
        opaqueIndex += 1;
      }
      const entry = this.fileEntries[index];
      if (!isIndexedSessionEntry(entry)) continue;
      if (
        !Object.hasOwn(entry, "parentId") ||
        (!isSessionTranscriptSideAppendEntry(entry) &&
          entry.parentId === this.appendParentId &&
          this.leafId !== this.appendParentId)
      )
        this.logicalParentsById.set(entry.id, this.leafId);
      this.byId.set(entry.id, entry);
      this.appendParentId = entry.id;
      if (isSessionTranscriptSideAppendEntry(entry))
        this.promptReleasedSideBranchParentId = entry.id;
      else {
        this.leafId = entry.id;
        this.promptReleasedSideBranchParentId = void 0;
      }
      if (entry.type === "label")
        if (entry.label) {
          this.labelsById.set(entry.targetId, entry.label);
          this.labelTimestampsById.set(entry.targetId, entry.timestamp);
        } else {
          this.labelsById.delete(entry.targetId);
          this.labelTimestampsById.delete(entry.targetId);
        }
    }
  }
  resolveCanonicalParentId(parentId) {
    const seen = /* @__PURE__ */ new Set();
    let currentId = parentId;
    while (currentId && !this.byId.has(currentId)) {
      if (seen.has(currentId)) return null;
      seen.add(currentId);
      currentId = this.opaqueParentsById.get(currentId) ?? null;
    }
    return currentId;
  }
  normalizeEntryParent(entry) {
    const parentId = this.logicalParentsById.has(entry.id)
      ? (this.logicalParentsById.get(entry.id) ?? null)
      : this.resolveCanonicalParentId(entry.parentId);
    let normalized =
      parentId === entry.parentId
        ? entry
        : {
            ...entry,
            parentId,
          };
    if (
      normalized.type === "compaction" &&
      !this.byId.has(normalized.firstKeptEntryId) &&
      this.opaqueParentsById.has(normalized.firstKeptEntryId)
    ) {
      const firstKeptEntryId =
        this.resolveCanonicalParentId(normalized.firstKeptEntryId) ??
        this.findFirstCanonicalDescendantOnBranch(
          normalized.firstKeptEntryId,
          normalized.parentId,
        ) ??
        this.findFirstCanonicalDescendant(normalized.firstKeptEntryId) ??
        parentId;
      if (firstKeptEntryId && firstKeptEntryId !== normalized.firstKeptEntryId)
        normalized = {
          ...normalized,
          firstKeptEntryId,
        };
    }
    return normalized;
  }
  findFirstCanonicalDescendantOnBranch(opaqueId, leafId) {
    const seen = /* @__PURE__ */ new Set();
    let currentId = leafId;
    let firstCanonicalDescendant;
    while (currentId && !seen.has(currentId)) {
      if (currentId === opaqueId) return firstCanonicalDescendant;
      seen.add(currentId);
      const entry = this.byId.get(currentId);
      if (entry) {
        firstCanonicalDescendant = entry.id;
        currentId = entry.parentId;
      } else currentId = this.opaqueParentsById.get(currentId) ?? null;
    }
  }
  findFirstCanonicalDescendant(opaqueId) {
    for (const entry of this.fileEntries) {
      if (!isIndexedSessionEntry(entry)) continue;
      const seen = /* @__PURE__ */ new Set();
      let parentId = entry.parentId;
      while (parentId && this.opaqueParentsById.has(parentId) && !seen.has(parentId)) {
        if (parentId === opaqueId) return entry.id;
        seen.add(parentId);
        parentId = this.opaqueParentsById.get(parentId) ?? null;
      }
    }
  }
  resolveBranchTargetId(branchFromId) {
    if (this.byId.has(branchFromId)) return branchFromId;
    if (!this.opaqueParentsById.has(branchFromId)) return;
    return this.resolveCanonicalParentId(branchFromId);
  }
  clampOpaqueFileEntryIndexes() {
    let previousOpaqueIndex = 0;
    for (const opaqueEntry of this.opaqueFileEntries) {
      opaqueEntry.index = Math.max(
        previousOpaqueIndex,
        Math.min(opaqueEntry.index, this.fileEntries.length),
      );
      previousOpaqueIndex = opaqueEntry.index;
    }
  }
  createLeafControl(parentId, appendParentId = this.appendParentId, appendMode) {
    return {
      type: "leaf",
      id: generateId({ has: (id) => this.byId.has(id) || this.opaqueParentsById.has(id) }),
      parentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      targetId: this.leafId,
      ...(appendParentId !== this.leafId ? { appendParentId } : {}),
      ...(appendMode ? { appendMode } : {}),
    };
  }
  rememberLeafControl(leafEntry) {
    this.opaqueFileEntries.push({
      index: this.fileEntries.length,
      record: leafEntry,
    });
    this.opaqueParentsById.set(leafEntry.id, this.leafId);
  }
  getPersistedFileEntries(leafAppendParentId = this.appendParentId, leafAppendMode) {
    this.clampOpaqueFileEntryIndexes();
    const entries = [];
    let opaqueIndex = 0;
    for (let index = 0; index <= this.fileEntries.length; index += 1) {
      while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
        entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
        opaqueIndex += 1;
      }
      const entry = this.fileEntries[index];
      if (entry) entries.push(entry);
    }
    while (opaqueIndex < this.opaqueFileEntries.length) {
      entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
      opaqueIndex += 1;
    }
    let persistedLeafId = null;
    let persistedAppendParentId = null;
    let rawTailId = null;
    for (const entry of entries) {
      const leafEntry = parseOpaqueLeafEntry(entry);
      if (leafEntry) {
        rawTailId = leafEntry.id;
        if (this.invalidLeafControlIds.has(leafEntry.id)) continue;
        const targetId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
        persistedLeafId = targetId;
        persistedAppendParentId =
          leafEntry.appendParentId === void 0
            ? targetId
            : this.resolveOpaqueAppendParentId(leafEntry.appendParentId);
        continue;
      }
      if (isIndexedSessionEntry(entry)) {
        persistedLeafId = entry.id;
        persistedAppendParentId = entry.id;
        rawTailId = entry.id;
        continue;
      }
      const opaqueLink = parseParentLinkedOpaqueEntry(entry);
      if (opaqueLink) {
        persistedAppendParentId = opaqueLink.id;
        rawTailId = opaqueLink.id;
      }
    }
    if (persistedLeafId !== this.leafId || persistedAppendParentId !== this.appendParentId) {
      const leafEntry = this.createLeafControl(rawTailId, leafAppendParentId, leafAppendMode);
      this.rememberLeafControl(leafEntry);
      entries.push(leafEntry);
    }
    return entries;
  }
  getSerializedFileLinesForRewrite() {
    return this.getPersistedFileEntries().map(serializeJsonlLine);
  }
  clearPreservedOpaqueFileEntries() {
    this.opaqueFileEntries = [];
    this.opaqueParentsById.clear();
    this.invalidLeafControlIds.clear();
    this.appendParentId = null;
    this.promptReleasedSideBranchParentId = void 0;
  }
  writeFullFile(leafAppendParentId = this.appendParentId, leafAppendMode) {
    if (!this.sessionFile) return "";
    return writeJsonlEntriesSync(
      this.sessionFile,
      this.getPersistedFileEntries(leafAppendParentId, leafAppendMode),
    );
  }
  replacePersistedTranscript(options) {
    if (!this.shouldPersist) return;
    const leafAppendParentId =
      options?.leafAppendParentId === void 0 ? this.appendParentId : options.leafAppendParentId;
    if (this.sqlitePersistence) {
      replaceTranscriptEventsSync(
        {
          agentId: this.sqlitePersistence.agentId,
          sessionId: this.sqlitePersistence.sessionId,
          sessionKey: this.sqlitePersistence.sessionKey,
          storePath: this.sqlitePersistence.storePath,
        },
        this.getPersistedFileEntries(leafAppendParentId, options?.leafAppendMode),
      );
      this.flushed = true;
      return;
    }
    if (!this.sessionFile) return;
    const content = this.writeFullFile(leafAppendParentId, options?.leafAppendMode);
    const rememberedWrite = rememberWrittenSessionEntries(this.sessionFile, content);
    this.sessionFileSnapshot = rememberedWrite.snapshot;
    if (rememberedWrite.verifiedWrite && options?.publishSnapshot !== false)
      publishRememberedSessionFileSnapshot(this.sessionFile, rememberedWrite.snapshot);
  }
  isPersisted() {
    return this.shouldPersist;
  }
  getCwd() {
    return this.cwd;
  }
  getSessionDir() {
    return this.sessionDir;
  }
  getSessionId() {
    return this.sessionId;
  }
  wasRecoveredFromCorruptHeader() {
    return this.recoveredCorruptHeader;
  }
  getSessionFile() {
    return this.sessionFile;
  }
  /**
   * Remove matching entries near the canonical tail and rewrite once.
   * Declared trailing metadata can survive above the removed entries; all
   * surviving canonical/opaque children are reparented to the retained branch.
   */
  removeTrailingEntries(predicate, options) {
    let preservedStart = this.fileEntries.length;
    while (preservedStart > 1) {
      const entry = this.fileEntries[preservedStart - 1];
      if (!isIndexedSessionEntry(entry) || !options?.preserveTrailing?.(entry)) break;
      preservedStart -= 1;
    }
    let removeStart = preservedStart;
    while (removeStart > 1) {
      const entry = this.fileEntries[removeStart - 1];
      if (!isIndexedSessionEntry(entry) || !predicate(entry)) break;
      removeStart -= 1;
    }
    if (removeStart === preservedStart) return 0;
    const shiftOpaqueIndexesAfterRemoval = (start, count) => {
      for (const opaqueEntry of this.opaqueFileEntries) {
        const removedBeforeOpaque = Math.max(0, Math.min(count, opaqueEntry.index - start));
        opaqueEntry.index -= removedBeforeOpaque;
      }
    };
    const removedCount = preservedStart - removeStart;
    shiftOpaqueIndexesAfterRemoval(removeStart, removedCount);
    const removedEntries = this.fileEntries.splice(removeStart, removedCount);
    const removedParentById = new Map(removedEntries.map((entry) => [entry.id, entry.parentId]));
    for (let index = removeStart; index < this.fileEntries.length;) {
      const entry = this.fileEntries[index];
      if (
        isIndexedSessionEntry(entry) &&
        entry.type === "label" &&
        removedParentById.has(entry.targetId)
      ) {
        removedParentById.set(entry.id, entry.parentId);
        shiftOpaqueIndexesAfterRemoval(index, 1);
        this.fileEntries.splice(index, 1);
        continue;
      }
      index += 1;
    }
    const resolveRetainedParentId = (parentId) => {
      const seen = /* @__PURE__ */ new Set();
      let currentId = parentId;
      while (currentId && removedParentById.has(currentId) && !seen.has(currentId)) {
        seen.add(currentId);
        currentId = removedParentById.get(currentId) ?? null;
      }
      return currentId;
    };
    const replacementParentId = resolveRetainedParentId(removedEntries[0]?.parentId ?? null);
    this.fileEntries = this.fileEntries.map((entry) => {
      if (!isIndexedSessionEntry(entry)) return entry;
      const parentId = resolveRetainedParentId(entry.parentId);
      return parentId === entry.parentId
        ? entry
        : {
            ...entry,
            parentId,
          };
    });
    this.opaqueFileEntries = this.opaqueFileEntries.map((opaqueEntry) => {
      if (!isJsonRecord(opaqueEntry.record)) return opaqueEntry;
      const record = opaqueEntry.record;
      const parentId =
        record.parentId === null || typeof record.parentId === "string"
          ? resolveRetainedParentId(record.parentId)
          : void 0;
      const leafEntry = parseOpaqueLeafEntry(record);
      const targetId = leafEntry ? resolveRetainedParentId(leafEntry.targetId) : void 0;
      const appendParentId =
        leafEntry?.appendParentId !== void 0
          ? resolveRetainedParentId(leafEntry.appendParentId)
          : void 0;
      if (
        (parentId === void 0 || parentId === record.parentId) &&
        (targetId === void 0 || targetId === leafEntry?.targetId) &&
        (appendParentId === void 0 || appendParentId === leafEntry?.appendParentId)
      )
        return opaqueEntry;
      return {
        ...opaqueEntry,
        record: {
          ...record,
          ...(parentId !== void 0 ? { parentId } : {}),
          ...(targetId !== void 0 ? { targetId } : {}),
          ...(appendParentId !== void 0 ? { appendParentId } : {}),
        },
      };
    });
    this.clampOpaqueFileEntryIndexes();
    this.buildIndex();
    this.leafId = this.resolveCanonicalParentId(replacementParentId);
    this.appendParentId = replacementParentId;
    this.replacePersistedTranscript();
    return removedEntries.length;
  }
  persistRecord(entry, options, publishSnapshot = true) {
    if (this.sqlitePersistence) {
      this.persistSqliteRecord(entry, options);
      return;
    }
    if (!this.shouldPersist || !this.sessionFile) return;
    if (!this.fileEntries.some((e) => e.type === "message" && e.message.role === "assistant")) {
      this.flushed = false;
      return;
    }
    if (!this.flushed) {
      const content = this.writeFullFile();
      this.flushed = true;
      const rememberedWrite = rememberWrittenSessionEntries(this.sessionFile, content);
      this.sessionFileSnapshot = rememberedWrite.snapshot;
      if (rememberedWrite.verifiedWrite && publishSnapshot)
        publishRememberedSessionFileSnapshot(this.sessionFile, rememberedWrite.snapshot);
    } else {
      const serializationCanRunUserCode = jsonSerializationCanRunUserCode(entry);
      const serializedEntry = serializeJsonlEntry(entry);
      const beforeAppendSnapshot = readSessionFileSnapshotIfExists(this.sessionFile);
      const invalidateSerializedPrefixCache =
        options?.invalidateSerializedPrefixCache === true || serializationCanRunUserCode;
      const canPublishOwnedAppend =
        !serializationCanRunUserCode &&
        Boolean(
          beforeAppendSnapshot &&
          canAdvanceOwnedSessionEntryCache({
            sessionFile: this.sessionFile,
            snapshot: beforeAppendSnapshot,
          }),
        );
      const cacheOwnedAppend = canPublishOwnedAppend && !invalidateSerializedPrefixCache;
      const serializedAppend = appendSerializedJsonlEntrySync(this.sessionFile, serializedEntry, {
        prefixNewline: sessionFileNeedsAppendSeparator(this.sessionFile, beforeAppendSnapshot),
      });
      const rememberedAppend = rememberAppendedSessionEntry(
        this.sessionFile,
        this.sessionFileSnapshot,
        beforeAppendSnapshot,
        serializedAppend,
        cacheOwnedAppend,
        canPublishOwnedAppend,
        invalidateSerializedPrefixCache,
      );
      this.sessionFileSnapshot = rememberedAppend.snapshot;
      if (rememberedAppend.ownedAppendVerified && publishSnapshot)
        publishRememberedSessionFileSnapshot(this.sessionFile, rememberedAppend.snapshot);
      else if (cacheOwnedAppend)
        this.setLoadedSessionFile(
          this.sessionFile,
          revalidateLoadedSessionFile(this.sessionFile, {
            entries: this.fileEntries,
            snapshot: beforeAppendSnapshot,
          }),
        );
    }
  }
  persist(entry, options) {
    this.persistRecord(entry, options);
  }
  persistSqliteRecord(entry, options) {
    if (!isIndexedSessionEntry(entry)) return;
    const persistence = this.sqlitePersistence;
    if (!persistence) return;
    const scope = {
      agentId: persistence.agentId,
      sessionId: persistence.sessionId,
      sessionKey: persistence.sessionKey,
      storePath: persistence.storePath,
    };
    if (entry.type !== "message") {
      appendTranscriptEventSync(scope, entry);
      return;
    }
    const result = appendTranscriptMessageSync(scope, {
      cwd: this.cwd,
      eventId: entry.id,
      ...(options?.config ? { config: options.config } : {}),
      ...(options?.idempotencyLookup ? { idempotencyLookup: options.idempotencyLookup } : {}),
      message: entry.message,
      now: Date.parse(entry.timestamp),
      parentId: entry.parentId,
    });
    if (
      options?.idempotencyLookup === "caller-checked" &&
      (!result?.appended || result.messageId !== entry.id)
    )
      throw new Error(`Session transcript append was not persisted: ${entry.id}`);
  }
  /**
   * Resync the in-memory snapshot/cache after the transcript file was rewritten
   * out-of-band (for example the embedded-run header normalization in
   * prepareSessionManagerForRun). Without this the cached sessionFileSnapshot
   * still describes the pre-rewrite file, so the first append takes the
   * snapshot-mismatch branch in rememberAppendedSessionEntry, drops the warm
   * cache, and the next open reparses the whole transcript.
   */
  syncSnapshotAfterHeaderRewrite(expectedContent) {
    if (!this.sessionFile) return;
    const rememberedWrite = rememberWrittenSessionEntries(this.sessionFile, expectedContent);
    this.sessionFileSnapshot = rememberedWrite.snapshot;
    if (rememberedWrite.verifiedWrite)
      publishRememberedSessionFileSnapshot(this.sessionFile, rememberedWrite.snapshot);
  }
  /**
   * Preserve entries appended while the active prompt released its file lock.
   * Attach them as a side branch so rewrites retain external state without
   * moving the prepared reply branch or adding delivery mirrors to its context.
   */
  mergePromptReleasedSessionEntries(entries, options) {
    this.assertPromptReleasedEntriesPreserveActiveLeaf(entries);
    let sideBranchParentId =
      this.promptReleasedSideBranchParentId === void 0
        ? this.leafId
        : this.promptReleasedSideBranchParentId;
    let persistedLeafId = this.leafId;
    let persistedAppendParentId = this.appendParentId;
    let persistedAppendMode = this.promptReleasedSideBranchParentId === void 0 ? "active" : "side";
    let sawPersistedStateUpdate = false;
    let rawTailId = null;
    for (const sourceEntry of entries) {
      if (sourceEntry.type === "prompt_released_opaque") {
        this.opaqueFileEntries.push({
          index: this.fileEntries.length,
          record: sourceEntry.record,
        });
        const leafEntry = parseOpaqueLeafEntry(sourceEntry.record);
        if (leafEntry) {
          rawTailId = leafEntry.id;
          const leafState = this.resolveOpaqueLeafControl(leafEntry);
          if (!leafState) {
            this.invalidLeafControlIds.add(leafEntry.id);
            this.opaqueParentsById.set(
              leafEntry.id,
              this.resolveOpaqueAppendParentId(leafEntry.parentId),
            );
            continue;
          }
          this.opaqueParentsById.set(leafEntry.id, leafState.leafId);
          sideBranchParentId = leafState.appendParentId;
          persistedLeafId = leafState.leafId;
          persistedAppendParentId = leafState.appendParentId;
          persistedAppendMode = leafState.appendMode === "side" ? "side" : "active";
          sawPersistedStateUpdate = true;
          continue;
        }
        const link = parseParentLinkedOpaqueEntry(sourceEntry.record);
        if (link) {
          this.opaqueParentsById.set(link.id, link.parentId);
          sideBranchParentId = link.id;
          persistedAppendParentId = link.id;
          sawPersistedStateUpdate = true;
          rawTailId = link.id;
        }
        continue;
      }
      if (this.byId.has(sourceEntry.id)) throw new Error(`Entry ${sourceEntry.id} already exists`);
      if (sourceEntry.type === "label" && !this.byId.has(sourceEntry.targetId))
        throw new Error(`Entry ${sourceEntry.targetId} not found`);
      const entry = {
        ...sourceEntry,
        parentId: sideBranchParentId,
      };
      this.fileEntries.push(entry);
      this.byId.set(entry.id, entry);
      sideBranchParentId = entry.id;
      persistedAppendParentId = entry.id;
      if (isSessionTranscriptSideAppendEntry(entry)) persistedAppendMode = "side";
      else {
        persistedLeafId = entry.id;
        persistedAppendMode = "active";
      }
      sawPersistedStateUpdate = true;
      rawTailId = entry.id;
      if (entry.type === "label")
        if (entry.label) {
          this.labelsById.set(entry.targetId, entry.label);
          this.labelTimestampsById.set(entry.targetId, entry.timestamp);
        } else {
          this.labelsById.delete(entry.targetId);
          this.labelTimestampsById.delete(entry.targetId);
        }
    }
    this.promptReleasedSideBranchParentId = sideBranchParentId;
    if (this.sessionFile)
      this.sessionFileSnapshot = readSessionFileSnapshotIfExists(this.sessionFile);
    if (
      options?.persistLeaf !== true ||
      !this.shouldPersist ||
      !this.sessionFile ||
      !sawPersistedStateUpdate ||
      (persistedLeafId === this.leafId &&
        persistedAppendParentId === sideBranchParentId &&
        persistedAppendMode === "side")
    )
      return;
    const hasAssistant = this.fileEntries.some(
      (entry) => entry.type === "message" && entry.message.role === "assistant",
    );
    if (this.sqlitePersistence) {
      const leafEntry = this.createLeafControl(rawTailId, sideBranchParentId, "side");
      appendTranscriptEventSync(
        {
          agentId: this.sqlitePersistence.agentId,
          sessionId: this.sqlitePersistence.sessionId,
          sessionKey: this.sqlitePersistence.sessionKey,
          storePath: this.sqlitePersistence.storePath,
        },
        leafEntry,
      );
      this.rememberLeafControl(leafEntry);
      this.flushed = true;
      return {
        publishedEntries: [
          {
            kind: "id",
            id: leafEntry.id,
          },
        ],
      };
    }
    if (!this.flushed || !hasAssistant) {
      this.replacePersistedTranscript({
        publishSnapshot: false,
        leafAppendParentId: sideBranchParentId,
        leafAppendMode: "side",
      });
      this.flushed = true;
      if (!this.sessionFileSnapshot)
        throw new Error(`Unable to snapshot restored session file: ${this.sessionFile}`);
      return {
        sessionFileSnapshot: this.sessionFileSnapshot,
        requiresReload: true,
      };
    }
    const leafEntry = this.createLeafControl(rawTailId, sideBranchParentId, "side");
    this.persistRecord(leafEntry, void 0, false);
    this.rememberLeafControl(leafEntry);
    if (!this.sessionFileSnapshot)
      throw new Error(`Unable to snapshot restored session file: ${this.sessionFile}`);
    return {
      sessionFileSnapshot: this.sessionFileSnapshot,
      publishedEntries: [
        {
          kind: "id",
          id: leafEntry.id,
        },
      ],
    };
  }
  assertPromptReleasedEntriesPreserveActiveLeaf(entries) {
    let sideBranchParentId =
      this.promptReleasedSideBranchParentId === void 0
        ? this.leafId
        : this.promptReleasedSideBranchParentId;
    for (const entry of entries) {
      if (entry.type !== "prompt_released_opaque") {
        sideBranchParentId = entry.id;
        continue;
      }
      const leaf = parseOpaqueLeafEntry(entry.record);
      if (leaf && entry.preserveActiveLeaf) {
        const appendParentId = leaf.appendParentId === void 0 ? leaf.targetId : leaf.appendParentId;
        if (
          leaf.appendMode !== "side" ||
          leaf.targetId !== this.leafId ||
          leaf.parentId !== sideBranchParentId ||
          appendParentId !== sideBranchParentId
        )
          throw new Error("prompt-released side leaf changed the active branch");
        continue;
      }
      const link = parseParentLinkedOpaqueEntry(entry.record);
      if (link) sideBranchParentId = link.id;
    }
  }
  appendEntry(entry, options) {
    if (
      !isSessionTranscriptSideAppendEntry(entry) &&
      entry.parentId === this.appendParentId &&
      this.leafId !== this.appendParentId
    )
      this.logicalParentsById.set(entry.id, this.leafId);
    this.fileEntries.push(entry);
    this.byId.set(entry.id, entry);
    this.leafId = entry.id;
    this.appendParentId = entry.id;
    this.promptReleasedSideBranchParentId = void 0;
    this.persist(entry, options);
  }
  /** Append a message as child of current leaf, then advance leaf. Returns entry id.
   * Does not allow writing CompactionSummaryMessage and BranchSummaryMessage directly.
   * Reason: we want these to be top-level entries in the session, not message session entries,
   * so it is easier to find them.
   * These need to be appended via appendCompaction() and appendBranchSummary() methods.
   */
  appendMessage(message, options) {
    const invalidateSerializedPrefixCache =
      options?.invalidateSerializedPrefixCache === true || messageSerializesOwnedValues(message);
    const entry = {
      type: "message",
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      message,
    };
    this.appendEntry(entry, {
      ...options,
      invalidateSerializedPrefixCache,
    });
    return entry.id;
  }
  /** Append a thinking level change as child of current leaf, then advance leaf. Returns entry id. */
  appendThinkingLevelChange(thinkingLevel) {
    const entry = {
      type: "thinking_level_change",
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      thinkingLevel,
    };
    this.appendEntry(entry);
    return entry.id;
  }
  /** Append a model change as child of current leaf, then advance leaf. Returns entry id. */
  appendModelChange(provider, modelId) {
    const entry = {
      type: "model_change",
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      provider,
      modelId,
    };
    this.appendEntry(entry);
    return entry.id;
  }
  /** Append a compaction summary as child of current leaf, then advance leaf. Returns entry id. */
  appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook) {
    const entry = {
      type: "compaction",
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      summary,
      firstKeptEntryId,
      tokensBefore,
      details,
      fromHook,
    };
    this.appendEntry(entry, {
      invalidateSerializedPrefixCache: fromHook === true || details !== void 0,
    });
    return entry.id;
  }
  /** Append a custom entry (for extensions) as child of current leaf, then advance leaf. Returns entry id. */
  appendCustomEntry(customType, data) {
    const entry = {
      type: "custom",
      customType,
      data,
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    };
    this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
    return entry.id;
  }
  /** Append a session info entry (e.g., display name). Returns entry id. */
  appendSessionInfo(name) {
    const entry = {
      type: "session_info",
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      name: name.trim(),
    };
    this.appendEntry(entry);
    return entry.id;
  }
  /** Get the current session name from the latest session_info entry, if any. */
  getSessionName() {
    const entries = this.getEntries();
    for (const entry of entries.toReversed())
      if (entry.type === "session_info") return entry.name?.trim() || void 0;
  }
  /**
   * Append a custom message entry (for extensions) that participates in LLM context.
   * @param customType Extension identifier for filtering on reload
   * @param content Message content (string or TextContent/ImageContent array)
   * @param display Whether to show in TUI (true = styled display, false = hidden)
   * @param details Optional extension-specific metadata (not sent to LLM)
   * @returns Entry id
   */
  appendCustomMessageEntry(customType, content, display, details) {
    const entry = {
      type: "custom_message",
      customType,
      content,
      display,
      details,
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    };
    this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
    return entry.id;
  }
  getLeafId() {
    return this.leafId;
  }
  getLeafEntry() {
    return this.leafId ? this.getEntry(this.leafId) : void 0;
  }
  getEntry(id) {
    const entry = this.byId.get(id);
    return entry ? this.normalizeEntryParent(entry) : void 0;
  }
  /**
   * Get all direct children of an entry.
   */
  getChildren(parentId) {
    const children = [];
    for (const entry of this.byId.values()) {
      const normalizedEntry = this.normalizeEntryParent(entry);
      if (normalizedEntry.parentId === parentId) children.push(normalizedEntry);
    }
    return children;
  }
  /**
   * Get the label for an entry, if any.
   */
  getLabel(id) {
    return this.labelsById.get(id);
  }
  /**
   * Set or clear a label on an entry.
   * Labels are user-defined markers for bookmarking/navigation.
   * Pass undefined or empty string to clear the label.
   */
  appendLabelChange(targetId, label) {
    if (!this.byId.has(targetId)) throw new Error(`Entry ${targetId} not found`);
    const entry = {
      type: "label",
      id: generateId(this.byId),
      parentId: this.appendParentId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      targetId,
      label,
    };
    this.appendEntry(entry);
    if (label) {
      this.labelsById.set(targetId, label);
      this.labelTimestampsById.set(targetId, entry.timestamp);
    } else {
      this.labelsById.delete(targetId);
      this.labelTimestampsById.delete(targetId);
    }
    return entry.id;
  }
  /**
   * Walk from entry to root, returning all entries in path order.
   * Includes all entry types (messages, compaction, model changes, etc.).
   * Use buildSessionContext() to get the resolved messages for the LLM.
   */
  getBranch(fromId) {
    const path = [];
    const startId = fromId ?? this.leafId;
    const seen = /* @__PURE__ */ new Set();
    let currentId = startId;
    while (currentId && !seen.has(currentId)) {
      seen.add(currentId);
      const current = this.byId.get(currentId);
      if (current) {
        const normalizedCurrent = this.normalizeEntryParent(current);
        path.unshift(normalizedCurrent);
        currentId = normalizedCurrent.parentId;
      } else currentId = this.opaqueParentsById.get(currentId) ?? null;
    }
    return path;
  }
  /**
   * Build the session context (what gets sent to the LLM).
   * Uses tree traversal from current leaf.
   */
  buildSessionContext() {
    return buildSessionContext$1(this.getBranch());
  }
  /**
   * Get session header.
   */
  getHeader() {
    const h = this.fileEntries.find((e) => e.type === "session");
    return h ? h : null;
  }
  /**
   * Get all session entries (excludes header). Returns a shallow copy.
   * The session is append-only: use appendXXX() to add entries, branch() to
   * change the leaf pointer. Entries cannot be modified or deleted.
   */
  getEntries() {
    return this.fileEntries
      .filter((entry) => entry.type !== "session")
      .map((entry) => this.normalizeEntryParent(entry));
  }
  /**
   * Get the session as a tree structure. Returns a shallow defensive copy of all entries.
   * A well-formed session has exactly one root (first entry with parentId === null).
   * Orphaned entries (broken parent chain) are also returned as roots.
   */
  getTree() {
    const entries = this.getEntries();
    const nodeMap = /* @__PURE__ */ new Map();
    const roots = [];
    for (const entry of entries) {
      const label = this.labelsById.get(entry.id);
      const labelTimestamp = this.labelTimestampsById.get(entry.id);
      nodeMap.set(entry.id, {
        entry,
        children: [],
        label,
        labelTimestamp,
      });
    }
    for (const entry of entries) {
      const node = nodeMap.get(entry.id);
      const parentId = this.resolveCanonicalParentId(entry.parentId);
      if (parentId === null || parentId === entry.id) roots.push(node);
      else {
        const parent = nodeMap.get(parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      }
    }
    const stack = [...roots];
    while (stack.length > 0) {
      const node = stack.pop();
      node.children.sort(
        (a, b) => new Date(a.entry.timestamp).getTime() - new Date(b.entry.timestamp).getTime(),
      );
      stack.push(...node.children);
    }
    return roots;
  }
  /**
   * Start a new branch from an earlier entry.
   * Moves the leaf pointer to the specified entry. The next appendXXX() call
   * will create a child of that entry, forming a new branch. Existing entries
   * are not modified or deleted.
   */
  branch(branchFromId) {
    const branchTargetId = this.resolveBranchTargetId(branchFromId);
    if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
    this.leafId = branchTargetId;
    this.appendParentId = branchTargetId;
    this.promptReleasedSideBranchParentId = void 0;
  }
  /**
   * Reset the leaf pointer to null (before any entries).
   * The next appendXXX() call will create a new root entry (parentId = null).
   * Use this when navigating to re-edit the first user message.
   */
  resetLeaf() {
    this.leafId = null;
    this.appendParentId = null;
    this.promptReleasedSideBranchParentId = void 0;
  }
  /**
   * Start a new branch with a summary of the abandoned path.
   * Same as branch(), but also appends a branch_summary entry that captures
   * context from the abandoned conversation path.
   */
  branchWithSummary(branchFromId, summary, details, fromHook) {
    const branchTargetId = branchFromId === null ? null : this.resolveBranchTargetId(branchFromId);
    if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
    this.leafId = branchTargetId;
    this.appendParentId = branchTargetId;
    const entry = {
      type: "branch_summary",
      id: generateId(this.byId),
      parentId: branchTargetId,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
      fromId: branchTargetId ?? "root",
      summary,
      details,
      fromHook,
    };
    this.appendEntry(entry, {
      invalidateSerializedPrefixCache: fromHook === true || details !== void 0,
    });
    return entry.id;
  }
  collectBranchedSessionPath(leafId) {
    const opaqueById = /* @__PURE__ */ new Map();
    for (const opaqueEntry of this.opaqueFileEntries) {
      const link =
        parseOpaqueLeafEntry(opaqueEntry.record) ??
        parseParentLinkedOpaqueEntry(opaqueEntry.record);
      if (link && isJsonRecord(opaqueEntry.record)) opaqueById.set(link.id, opaqueEntry.record);
    }
    const reversedNodes = [];
    const seen = /* @__PURE__ */ new Set();
    let currentId = leafId;
    while (currentId && !seen.has(currentId)) {
      seen.add(currentId);
      const entry = this.byId.get(currentId);
      if (entry) {
        reversedNodes.push({
          type: "entry",
          entry,
        });
        if (this.logicalParentsById.has(entry.id)) {
          let physicalId = entry.parentId;
          while (physicalId && !seen.has(physicalId)) {
            const physicalRecord = opaqueById.get(physicalId);
            if (!physicalRecord || !this.opaqueParentsById.has(physicalId)) break;
            seen.add(physicalId);
            reversedNodes.push({
              type: "opaque",
              id: physicalId,
              record: physicalRecord,
            });
            physicalId = this.opaqueParentsById.get(physicalId) ?? null;
          }
          currentId = this.logicalParentsById.get(entry.id) ?? null;
        } else currentId = entry.parentId;
        continue;
      }
      const record = opaqueById.get(currentId);
      if (!record || !this.opaqueParentsById.has(currentId)) break;
      reversedNodes.push({
        type: "opaque",
        id: currentId,
        record,
      });
      currentId = this.opaqueParentsById.get(currentId) ?? null;
    }
    const entries = [];
    const opaqueEntries = [];
    const usedIds = /* @__PURE__ */ new Set();
    let tailId = null;
    for (const node of reversedNodes.toReversed()) {
      if (node.type === "entry") {
        if (node.entry.type === "label") continue;
        const branchEntry =
          node.entry.parentId === tailId
            ? node.entry
            : {
                ...node.entry,
                parentId: tailId,
              };
        entries.push(branchEntry);
        usedIds.add(branchEntry.id);
        tailId = branchEntry.id;
        continue;
      }
      if (parseOpaqueLeafEntry(node.record)) continue;
      opaqueEntries.push({
        index: entries.length + 1,
        record: {
          ...node.record,
          parentId: tailId,
        },
      });
      usedIds.add(node.id);
      tailId = node.id;
    }
    return {
      entries,
      opaqueEntries,
      tailId,
      usedIds,
    };
  }
  /**
   * Create a new session file containing only the path from root to the specified leaf.
   * Useful for extracting a single conversation path from a branched session.
   * Returns the new session file path, or undefined if not persisting.
   */
  createBranchedSession(leafId) {
    const previousSessionFile = this.sessionFile;
    const branchPath = this.collectBranchedSessionPath(leafId);
    if (branchPath.entries.length === 0) throw new Error(`Entry ${leafId} not found`);
    const newSessionId = createSessionId();
    const timestamp = /* @__PURE__ */ new Date().toISOString();
    const fileTimestamp = timestamp.replace(/[:.]/g, "-");
    const sqlitePersistence = this.sqlitePersistence;
    const newSessionFile = sqlitePersistence
      ? formatSqliteSessionFileMarker({
          agentId: sqlitePersistence.agentId,
          sessionId: newSessionId,
          storePath: sqlitePersistence.storePath,
        })
      : join(this.getSessionDir(), `${fileTimestamp}_${newSessionId}.jsonl`);
    const header = {
      type: "session",
      version: 3,
      id: newSessionId,
      timestamp,
      cwd: this.cwd,
      parentSession: this.shouldPersist ? previousSessionFile : void 0,
    };
    const pathEntryIds = new Set(branchPath.entries.map((entry) => entry.id));
    const labelsToWrite = [];
    for (const [targetId, label] of this.labelsById)
      if (pathEntryIds.has(targetId))
        labelsToWrite.push({
          targetId,
          label,
          timestamp: this.labelTimestampsById.get(targetId),
        });
    if (this.shouldPersist) {
      let parentId = branchPath.tailId;
      const labelEntries = [];
      for (const { targetId, label, timestamp: labelTimestamp } of labelsToWrite) {
        const labelEntry = {
          type: "label",
          id: generateId(branchPath.usedIds),
          parentId,
          timestamp: labelTimestamp,
          targetId,
          label,
        };
        branchPath.usedIds.add(labelEntry.id);
        labelEntries.push(labelEntry);
        parentId = labelEntry.id;
      }
      this.fileEntries = [header, ...branchPath.entries, ...labelEntries];
      this.opaqueFileEntries = branchPath.opaqueEntries;
      this.sessionId = newSessionId;
      this.sessionFile = newSessionFile;
      this.sessionFileSnapshot = void 0;
      if (sqlitePersistence) {
        const updatedAt = Date.now();
        const previousEntry = loadSessionEntry({
          agentId: sqlitePersistence.agentId,
          sessionKey: sqlitePersistence.sessionKey,
          storePath: sqlitePersistence.storePath,
        });
        this.sqlitePersistence = {
          ...sqlitePersistence,
          sessionId: newSessionId,
        };
        replaceSessionEntrySync(
          {
            agentId: sqlitePersistence.agentId,
            sessionKey: sqlitePersistence.sessionKey,
            storePath: sqlitePersistence.storePath,
          },
          {
            ...(previousEntry ?? { updatedAt }),
            sessionFile: newSessionFile,
            sessionId: newSessionId,
            updatedAt,
          },
        );
      }
      this.buildIndex();
      if (this.fileEntries.some((e) => e.type === "message" && e.message.role === "assistant")) {
        this.replacePersistedTranscript();
        this.flushed = true;
      } else this.flushed = false;
      return newSessionFile;
    }
    const labelEntries = [];
    let parentId = branchPath.tailId;
    for (const { targetId, label, timestamp: labelTimestamp } of labelsToWrite) {
      const labelEntry = {
        type: "label",
        id: generateId(branchPath.usedIds),
        parentId,
        timestamp: labelTimestamp,
        targetId,
        label,
      };
      branchPath.usedIds.add(labelEntry.id);
      labelEntries.push(labelEntry);
      parentId = labelEntry.id;
    }
    this.fileEntries = [header, ...branchPath.entries, ...labelEntries];
    this.opaqueFileEntries = branchPath.opaqueEntries;
    this.sessionId = newSessionId;
    this.buildIndex();
  }
  /**
   * Create a new session.
   * @param cwd Working directory (stored in session header)
   * @param sessionDir Optional session directory. If omitted, uses default (~/.openclaw/agent/sessions/<encoded-cwd>/).
   */
  static create(cwd, sessionDir) {
    const dir = sessionDir ?? getDefaultSessionDir(cwd);
    return new SessionManager(cwd, dir, void 0, true);
  }
  /**
   * Open a specific session file.
   * @param path Path to session file
   * @param sessionDir Optional session directory for /new or /branch. If omitted, derives from file's parent.
   * @param cwdOverride Optional cwd override instead of the session header cwd.
   */
  static open(path, sessionDir, cwdOverride) {
    const sqliteLoaded = loadSqliteMarkedSessionFile(path, { cwdOverride });
    if (sqliteLoaded)
      return new SessionManager(
        sqliteLoaded.cwd,
        sessionDir ?? "",
        path,
        true,
        {
          entries: sqliteLoaded.entries,
          snapshot: void 0,
        },
        {
          ...sqliteLoaded.sqliteMarker,
          sessionKey: sqliteLoaded.sessionKey,
        },
      );
    const loaded = revalidateLoadedSessionFile(path, loadEntriesFromFileWithSnapshot(path));
    const header = loaded.entries.find((e) => e.type === "session");
    const cwd = cwdOverride ?? header?.cwd ?? process.cwd();
    const dir = sessionDir ?? resolve(path, "..");
    return new SessionManager(cwd, dir, path, true, loaded);
  }
  /**
   * Continue the most recent session, or create new if none.
   * @param cwd Working directory
   * @param sessionDir Optional session directory. If omitted, uses default (~/.openclaw/agent/sessions/<encoded-cwd>/).
   */
  static continueRecent(cwd, sessionDir) {
    const dir = sessionDir ?? getDefaultSessionDir(cwd);
    const mostRecent = findMostRecentSession(dir, cwd);
    if (mostRecent) return new SessionManager(cwd, dir, mostRecent, true);
    return new SessionManager(cwd, dir, void 0, true);
  }
  /** Create an in-memory session (no file persistence) */
  static inMemory(cwd = process.cwd()) {
    return new SessionManager(cwd, "", void 0, false);
  }
  /**
   * Fork a session from another project directory into the current project.
   * Creates a new session in the target cwd with the full history from the source session.
   * @param sourcePath Path to the source session file
   * @param targetCwd Target working directory (where the new session will be stored)
   * @param sessionDir Optional session directory. If omitted, uses default for targetCwd.
   */
  static forkFrom(sourcePath, targetCwd, sessionDir) {
    const sourceEntries = loadEntriesFromFile(sourcePath);
    if (sourceEntries.length === 0)
      throw new Error(`Cannot fork: source session file is empty or invalid: ${sourcePath}`);
    if (!sourceEntries.find((e) => e.type === "session"))
      throw new Error(`Cannot fork: source session has no header: ${sourcePath}`);
    const dir = sessionDir ?? getDefaultSessionDir(targetCwd);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const newSessionId = createSessionId();
    const timestamp = /* @__PURE__ */ new Date().toISOString();
    const newSessionFile = join(dir, `${timestamp.replace(/[:.]/g, "-")}_${newSessionId}.jsonl`);
    appendJsonlEntrySync(newSessionFile, {
      type: "session",
      version: 3,
      id: newSessionId,
      timestamp,
      cwd: targetCwd,
      parentSession: sourcePath,
    });
    for (const entry of sourceEntries)
      if (entry.type !== "session") appendJsonlEntrySync(newSessionFile, entry);
    return new SessionManager(targetCwd, dir, newSessionFile, true);
  }
  /**
   * List all sessions for a directory.
   * @param cwd Working directory (used to compute default session directory)
   * @param sessionDir Optional session directory. If omitted, uses default (~/.openclaw/agent/sessions/<encoded-cwd>/).
   * @param onProgress Optional callback for progress updates (loaded, total)
   */
  static async list(cwd, sessionDir, onProgress) {
    const sessions = await listSessionsFromDir(
      sessionDir ?? getDefaultSessionDir(cwd),
      onProgress,
      0,
      void 0,
      cwd,
    );
    sessions.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    return sessions;
  }
  /**
   * List all sessions across all project directories.
   * @param onProgress Optional callback for progress updates (loaded, total)
   */
  static async listAll(onProgress) {
    const sessionsDir = getSessionsDir();
    try {
      if (!existsSync(sessionsDir)) return [];
      const dirs = (await readdir(sessionsDir, { withFileTypes: true }))
        .filter((e) => e.isDirectory())
        .map((e) => join(sessionsDir, e.name));
      let totalFiles = 0;
      const dirFiles = [];
      for (const dir of dirs)
        try {
          const files = (await readdir(dir)).filter((f) => f.endsWith(".jsonl"));
          dirFiles.push(files.map((f) => join(dir, f)));
          totalFiles += files.length;
        } catch {
          dirFiles.push([]);
        }
      let loaded = 0;
      const sessions = await pMap(
        dirFiles.flat(),
        async (file) => {
          try {
            return (await buildSessionInfo(file)) ?? pMapSkip;
          } catch {
            return pMapSkip;
          } finally {
            loaded++;
            onProgress?.(loaded, totalFiles);
          }
        },
        {
          concurrency: MAX_CONCURRENT_SESSION_INFO_LOADS,
          stopOnError: false,
        },
      );
      sessions.sort((a, b) => b.modified.getTime() - a.modified.getTime());
      return sessions;
    } catch {
      return [];
    }
  }
};
//#endregion
export {
  getLatestCompactionEntry as a,
  normalizeLoadedFileEntry as c,
  repairSessionFileIfNeeded as d,
  runtime_exports as f,
  getDefaultSessionDir as i,
  parseSessionEntries as l,
  buildSessionContext as n,
  loadEntriesFromFile as o,
  findMostRecentSession as r,
  migrateSessionEntries as s,
  SessionManager as t,
  invalidateSessionFileRepairCache as u,
};
