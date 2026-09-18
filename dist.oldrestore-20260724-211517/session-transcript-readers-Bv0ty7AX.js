import fs from "node:fs";
import { StringDecoder } from "node:string_decoder";
import { n as extractAssistantVisibleText } from "./chat-message-content-CeBHi_A4.js";
import "./src-Bl7G9qvi.js";
import { n as estimateTokensFromChars, t as estimateStringChars } from "./cjk-chars-0PtNN_-l.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-Btb1ssgA.js";
import "./utils-DtcDeqWS.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as hasInterSessionUserProvenance } from "./input-provenance-Xst3EirW.js";
import { f as stripInternalRuntimeContext } from "./internal-runtime-context-BW7WOTKc.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-C14lActR.js";
import {
  D as resolveIntegerOption,
  O as resolveNonNegativeIntegerOption,
} from "./number-coercion-CJQ8TR--.js";
import { w as materializeSessionArchiveForRead } from "./paths-TfuVT-K8.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import {
  Bt as hasNonzeroUsage,
  C as loadTranscriptEvents,
  Ht as normalizeUsage,
  X as resolveSessionTranscriptReadTarget,
  jt as selectVisibleTranscriptEventEntries,
  w as loadTranscriptEventsSync,
  zt as deriveSessionTotalTokens,
} from "./session-accessor-PZVNxFCV.js";
import {
  a as resolveSessionTranscriptCandidates,
  o as resolveSessionTranscriptResetArchiveCandidatesAsync,
} from "./session-transcript-files.fs-Cjj8g4Lp.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import {
  r as stripInboundMetadata,
  t as extractInboundSenderLabel,
} from "./strip-inbound-meta-CbJ4Y6Dq.js";
import {
  l as selectSessionTranscriptTreePathNodes,
  o as parseSessionTranscriptTreeEntry,
  s as scanSessionTranscriptTree,
} from "./transcript-tree-DuZTyiYZ.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/utils/transcript-tools.ts
/**
 * Transcript inspection helpers shared by session filesystem views and usage metrics.
 * Keep provider-specific block aliases centralized so both surfaces classify tools consistently.
 */
const TOOL_CALL_TYPES = /* @__PURE__ */ new Set(["tool_use", "toolcall", "tool_call"]);
const TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["tool_result", "tool_result_error"]);
const normalizeType = (value) => {
  return typeof value === "string" ? (normalizeOptionalLowercaseString(value) ?? "") : "";
};
/** Extracts de-duplicated tool names from direct fields and structured content blocks. */
const extractToolCallNames = (message) => {
  const names = /* @__PURE__ */ new Set();
  const toolNameRaw = message.toolName ?? message.tool_name;
  const toolName = typeof toolNameRaw === "string" ? normalizeOptionalString(toolNameRaw) : void 0;
  if (toolName) names.add(toolName);
  const content = message.content;
  if (!Array.isArray(content)) return Array.from(names);
  for (const entry of content) {
    if (!entry || typeof entry !== "object") continue;
    const block = entry;
    const type = normalizeType(block.type);
    if (!TOOL_CALL_TYPES.has(type)) continue;
    const name = typeof block.name === "string" ? normalizeOptionalString(block.name) : void 0;
    if (name) names.add(name);
  }
  return Array.from(names);
};
/** Returns whether a transcript message contains any recognized tool-call marker. */
const hasToolCall = (message) => extractToolCallNames(message).length > 0;
/** Counts recognized tool-result blocks and the subset explicitly marked as errors. */
const countToolResults = (message) => {
  const content = message.content;
  if (!Array.isArray(content))
    return {
      total: 0,
      errors: 0,
    };
  let total = 0;
  let errors = 0;
  for (const entry of content) {
    if (!entry || typeof entry !== "object") continue;
    const block = entry;
    const type = normalizeType(block.type);
    if (!TOOL_RESULT_TYPES.has(type)) continue;
    total += 1;
    if (block.is_error === true) errors += 1;
  }
  return {
    total,
    errors,
  };
};
//#endregion
//#region src/shared/chat-envelope.ts
const ENVELOPE_PREFIX = /^\[([^\]]+)\]\s*/;
const ENVELOPE_CHANNELS = [
  "WebChat",
  "WhatsApp",
  "Telegram",
  "Signal",
  "Slack",
  "Discord",
  "Google Chat",
  "iMessage",
  "Teams",
  "Matrix",
  "Zalo",
  "Zalo Personal",
  "iMessage",
];
const MESSAGE_ID_LINE = /^\s*\[message_id:\s*[^\]]+\]\s*$/i;
function looksLikeEnvelopeHeader(header) {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(header)) return true;
  if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(header)) return true;
  return ENVELOPE_CHANNELS.some((label) => header.startsWith(`${label} `));
}
/** Removes recognized channel/timestamp prefixes while preserving user-authored bracket text. */
function stripEnvelope(text) {
  const match = text.match(ENVELOPE_PREFIX);
  if (!match) return text;
  if (!looksLikeEnvelopeHeader(match[1] ?? "")) return text;
  return text.slice(match[0].length);
}
/** Removes standalone message-id hint lines without touching inline user mentions. */
function stripMessageIdHints(text) {
  if (!/\[message_id:/i.test(text)) return text;
  const lines = text.split(/\r?\n/);
  const filtered = lines.filter((line) => !MESSAGE_ID_LINE.test(line));
  return filtered.length === lines.length ? text : filtered.join("\n");
}
//#endregion
//#region src/auto-reply/reply/display-text-sanitize.ts
/** Removes internal runtime metadata before showing text to users. */
function stripInternalMetadataForDisplay(text) {
  return stripInboundMetadata(stripInternalRuntimeContext(text));
}
/** Removes user-envelope and message-id hints from display text. */
function stripUserEnvelopeForDisplay(text) {
  return stripMessageIdHints(stripEnvelope(stripInternalMetadataForDisplay(text)));
}
//#endregion
//#region src/gateway/chat-sanitize.ts
function extractMessageSenderLabel(entry) {
  if (typeof entry.senderLabel === "string" && entry.senderLabel.trim())
    return entry.senderLabel.trim();
  if (typeof entry.content === "string") return extractInboundSenderLabel(entry.content);
  if (Array.isArray(entry.content))
    for (const item of entry.content) {
      if (!item || typeof item !== "object") continue;
      const text = item.text;
      if (typeof text !== "string") continue;
      const senderLabel = extractInboundSenderLabel(text);
      if (senderLabel) return senderLabel;
    }
  if (typeof entry.text === "string") return extractInboundSenderLabel(entry.text);
  return null;
}
function stripEnvelopeFromContentWithRole(content, role) {
  const stripUserEnvelope = role === "user";
  let changed = false;
  return {
    content: content.map((item) => {
      if (!item || typeof item !== "object") return item;
      const entry = item;
      if (
        !(
          entry.type === "text" ||
          (role === "user" && entry.type === "input_text") ||
          (role === "assistant" && (entry.type === "input_text" || entry.type === "output_text"))
        ) ||
        typeof entry.text !== "string"
      )
        return item;
      const stripped = stripUserEnvelope
        ? stripUserEnvelopeForDisplay(entry.text)
        : stripInternalMetadataForDisplay(entry.text);
      if (stripped === entry.text) return item;
      changed = true;
      return {
        ...entry,
        text: stripped,
      };
    }),
    changed,
  };
}
/** Strips OpenClaw envelope metadata from one display message without mutating it. */
function stripEnvelopeFromMessage(message) {
  if (!message || typeof message !== "object") return message;
  const entry = message;
  const role = typeof entry.role === "string" ? normalizeLowercaseStringOrEmpty(entry.role) : "";
  const stripUserEnvelope = role === "user";
  let changed = false;
  const next = { ...entry };
  const senderLabel = stripUserEnvelope ? extractMessageSenderLabel(entry) : null;
  if (senderLabel && entry.senderLabel !== senderLabel) {
    next.senderLabel = senderLabel;
    changed = true;
  }
  if (typeof entry.content === "string") {
    const stripped = stripUserEnvelope
      ? stripUserEnvelopeForDisplay(entry.content)
      : stripInternalMetadataForDisplay(entry.content);
    if (stripped !== entry.content) {
      next.content = stripped;
      changed = true;
    }
  } else if (Array.isArray(entry.content)) {
    const updated = stripEnvelopeFromContentWithRole(entry.content, role);
    if (updated.changed) {
      next.content = updated.content;
      changed = true;
    }
  } else if (typeof entry.text === "string") {
    const stripped = stripUserEnvelope
      ? stripUserEnvelopeForDisplay(entry.text)
      : stripInternalMetadataForDisplay(entry.text);
    if (stripped !== entry.text) {
      next.text = stripped;
      changed = true;
    }
  }
  return changed ? next : message;
}
/** Strips envelope metadata from a message array, preserving the original array when unchanged. */
function stripEnvelopeFromMessages(messages) {
  if (messages.length === 0) return messages;
  let changed = false;
  const next = messages.map((message) => {
    const stripped = stripEnvelopeFromMessage(message);
    if (stripped !== message) changed = true;
    return stripped;
  });
  return changed ? next : messages;
}
//#endregion
//#region src/gateway/session-transcript-json.ts
/** Reads a nonblank transcript field while preserving its original whitespace. */
function readNonBlankStringPreservingWhitespace(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
const TRANSCRIPT_FIELD_REGEX_CACHE = /* @__PURE__ */ new Map();
function getTranscriptFieldRegexes(field) {
  let cached = TRANSCRIPT_FIELD_REGEX_CACHE.get(field);
  if (!cached) {
    const escapedField = escapeRegExp(field);
    cached = {
      stringRe: new RegExp(`"${escapedField}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`),
      nullRe: new RegExp(`"${escapedField}"\\s*:\\s*null`),
      numberRe: new RegExp(`"${escapedField}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`),
    };
    TRANSCRIPT_FIELD_REGEX_CACHE.set(field, cached);
  }
  return cached;
}
function extractJsonStringFieldPrefix(prefix, field) {
  const match = getTranscriptFieldRegexes(field).stringRe.exec(prefix);
  if (!match) return;
  try {
    return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
  } catch {
    return;
  }
}
function extractJsonNullableStringFieldPrefix(prefix, field) {
  if (getTranscriptFieldRegexes(field).nullRe.test(prefix)) return null;
  return extractJsonStringFieldPrefix(prefix, field);
}
function extractJsonNumberFieldPrefix(prefix, field) {
  const match = getTranscriptFieldRegexes(field).numberRe.exec(prefix);
  if (!match) return;
  const decoded = Number(match[1]);
  return Number.isFinite(decoded) ? decoded : void 0;
}
//#endregion
//#region src/gateway/session-transcript-index.fs.ts
const TRANSCRIPT_INDEX_READ_CHUNK_BYTES = 64 * 1024;
const MAX_TRANSCRIPT_INDEX_CACHE_ENTRIES = 256;
const MAX_TRANSCRIPT_INDEX_PARSE_LINE_BYTES = 256 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS$1 = 64 * 1024;
const TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER$1 = "[chat.history omitted: message too large]";
const transcriptIndexCache = /* @__PURE__ */ new Map();
const transcriptIndexBuilds = /* @__PURE__ */ new Map();
async function yieldTranscriptIndexScan() {
  await new Promise((resolve) => {
    setImmediate(resolve);
  });
}
function touchCachedIndex(filePath, entry) {
  transcriptIndexCache.delete(filePath);
  transcriptIndexCache.set(filePath, entry);
  return entry.index;
}
function setCachedIndex(filePath, entry) {
  transcriptIndexCache.set(filePath, entry);
  while (transcriptIndexCache.size > MAX_TRANSCRIPT_INDEX_CACHE_ENTRIES) {
    const oldestKey = transcriptIndexCache.keys().next().value;
    if (typeof oldestKey !== "string" || !oldestKey) break;
    transcriptIndexCache.delete(oldestKey);
  }
}
function selectTranscriptIndexView(index, view) {
  return view === "all"
    ? {
        ...index,
        entries: index.allEntries,
      }
    : index;
}
function isIndexableTranscriptRecord(record) {
  return Boolean(record && typeof record === "object" && !Array.isArray(record));
}
function isVisibleTranscriptRecord(record) {
  return Boolean(record.message) || record.type === "compaction";
}
function buildOversizedIndexedRawEntry(params) {
  const prefix = params.line.slice(0, OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS$1);
  const messageMatch = /"message"\s*:/.exec(prefix);
  const recordPrefix = messageMatch ? prefix.slice(0, messageMatch.index) : prefix;
  const id = extractJsonStringFieldPrefix(prefix, "id");
  const parentId = extractJsonNullableStringFieldPrefix(prefix, "parentId");
  const type = extractJsonStringFieldPrefix(prefix, "type");
  const timestamp =
    extractJsonStringFieldPrefix(recordPrefix, "timestamp") ??
    extractJsonNumberFieldPrefix(recordPrefix, "timestamp");
  const role = extractJsonStringFieldPrefix(prefix, "role") ?? "assistant";
  const record = {
    ...(type ? { type } : {}),
    ...(id ? { id } : {}),
    ...(parentId !== void 0 ? { parentId } : {}),
    ...(timestamp !== void 0 ? { timestamp } : {}),
    message: {
      role,
      content: [
        {
          type: "text",
          text: TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER$1,
        },
      ],
      __openclaw: {
        truncated: true,
        reason: "oversized",
      },
    },
  };
  const treeEntry = parseSessionTranscriptTreeEntry(record);
  return {
    ...(id ? { id } : {}),
    ...(treeEntry ? { parentId: treeEntry.parentId } : parentId !== void 0 ? { parentId } : {}),
    offset: params.offset,
    byteLength: params.byteLength,
    record,
  };
}
async function visitTranscriptJsonLines(filePath, visit) {
  const handle = await fs.promises.open(filePath, "r");
  try {
    const decoder = new StringDecoder("utf8");
    const buffer = Buffer.allocUnsafe(TRANSCRIPT_INDEX_READ_CHUNK_BYTES);
    let carry = "";
    let carryOffset = 0;
    let nextOffset = 0;
    while (true) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
      if (bytesRead <= 0) break;
      const chunk = buffer.subarray(0, bytesRead);
      const lines = (carry + decoder.write(chunk)).split("\n");
      carry = lines.pop() ?? "";
      let lineOffset = carryOffset;
      for (const rawLine of lines) {
        const line = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
        const byteLength = Buffer.byteLength(line, "utf8");
        visit(line, lineOffset, byteLength);
        lineOffset += Buffer.byteLength(rawLine, "utf8") + 1;
      }
      nextOffset += bytesRead;
      carryOffset = nextOffset - Buffer.byteLength(carry, "utf8");
      await yieldTranscriptIndexScan();
    }
    const tail = carry + decoder.end();
    if (tail) {
      const line = tail.endsWith("\r") ? tail.slice(0, -1) : tail;
      visit(line, carryOffset, Buffer.byteLength(line, "utf8"));
    }
  } finally {
    await handle.close();
  }
}
function buildActiveTreeEntries(params) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  let currentId = params.leafId;
  while (currentId) {
    if (seen.has(currentId)) return [];
    seen.add(currentId);
    const entry = params.byId.get(currentId);
    if (!entry) break;
    out.push(entry);
    currentId = entry.parentId ?? void 0;
  }
  return out.toReversed();
}
function toIndexedEntries(rawEntries) {
  const entries = [];
  let seq = 0;
  for (const entry of rawEntries) {
    if (!isVisibleTranscriptRecord(entry.record)) continue;
    seq += 1;
    entries.push({
      seq,
      ...(entry.id ? { id: entry.id } : {}),
      offset: entry.offset,
      byteLength: entry.byteLength,
      record: entry.record,
    });
  }
  return entries;
}
async function buildSessionTranscriptIndex(filePath, stat) {
  const rawEntries = [];
  await visitTranscriptJsonLines(filePath, (line, offset, byteLength) => {
    if (!line.trim()) return;
    if (byteLength > MAX_TRANSCRIPT_INDEX_PARSE_LINE_BYTES) {
      const rawEntry = buildOversizedIndexedRawEntry({
        line,
        offset,
        byteLength,
      });
      if (!rawEntry) return;
      rawEntries.push(rawEntry);
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      return;
    }
    if (!isIndexableTranscriptRecord(parsed)) return;
    const id = readNonBlankStringPreservingWhitespace(parsed.id);
    const parentId =
      parsed.parentId === null
        ? null
        : (readNonBlankStringPreservingWhitespace(parsed.parentId) ?? void 0);
    const treeEntry = parseSessionTranscriptTreeEntry(parsed);
    const rawEntry = {
      ...(id ? { id } : {}),
      ...(treeEntry ? { parentId: treeEntry.parentId } : parentId !== void 0 ? { parentId } : {}),
      offset,
      byteLength,
      record: parsed,
    };
    rawEntries.push(rawEntry);
  });
  const tree = scanSessionTranscriptTree(rawEntries.map((entry) => entry.record));
  const rawByRecord = new Map(rawEntries.map((entry) => [entry.record, entry]));
  const byId = /* @__PURE__ */ new Map();
  for (const node of tree.nodes) {
    const rawEntry = rawByRecord.get(node.entry);
    if (rawEntry) {
      rawEntry.parentId = node.parentId;
      byId.set(node.id, rawEntry);
    }
  }
  const activeRawEntries = tree.hasExplicitLeafUpdate
    ? buildActiveTreeEntries({
        byId,
        leafId: tree.leafId,
      })
    : rawEntries;
  return {
    filePath,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    hasTreeEntries: tree.hasExplicitLeafUpdate,
    ...(tree.hasExplicitLeafUpdate ? { leafId: tree.leafId } : {}),
    entries: toIndexedEntries(activeRawEntries),
    allEntries: toIndexedEntries(rawEntries),
  };
}
/** Reads or builds the visible transcript index for a JSONL session file. */
async function readSessionTranscriptIndex(filePath, opts = {}) {
  let stat;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    transcriptIndexCache.delete(filePath);
    return null;
  }
  if (!stat.isFile()) {
    transcriptIndexCache.delete(filePath);
    return null;
  }
  if (opts.cache === "skip")
    return selectTranscriptIndexView(await buildSessionTranscriptIndex(filePath, stat), opts.view);
  const cached = transcriptIndexCache.get(filePath);
  if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size)
    return selectTranscriptIndexView(touchCachedIndex(filePath, cached), opts.view);
  const inFlight = transcriptIndexBuilds.get(filePath);
  if (inFlight && inFlight.mtimeMs === stat.mtimeMs && inFlight.size === stat.size)
    return selectTranscriptIndexView(await inFlight.promise, opts.view);
  const promise = buildSessionTranscriptIndex(filePath, stat);
  transcriptIndexBuilds.set(filePath, {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    promise,
  });
  const index = await promise.finally(() => {
    if (transcriptIndexBuilds.get(filePath)?.promise === promise)
      transcriptIndexBuilds.delete(filePath);
  });
  setCachedIndex(filePath, {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    index,
  });
  return selectTranscriptIndexView(index, opts.view);
}
//#endregion
//#region src/gateway/session-utils.fs.ts
const sessionTitleFieldsCache = /* @__PURE__ */ new Map();
const MAX_SESSION_TITLE_FIELDS_CACHE_ENTRIES = 5e3;
const transcriptMessageCountCache = /* @__PURE__ */ new Map();
const MAX_TRANSCRIPT_MESSAGE_COUNT_CACHE_ENTRIES = 5e3;
const TRANSCRIPT_ASYNC_READ_CHUNK_BYTES = 64 * 1024;
function readSessionTitleFieldsCacheKey(filePath, opts) {
  return `${filePath}\t${opts?.includeInterSession === true ? "1" : "0"}`;
}
function getCachedSessionTitleFields(cacheKey, stat) {
  const cached = sessionTitleFieldsCache.get(cacheKey);
  if (!cached) return null;
  if (cached.mtimeMs !== stat.mtimeMs || cached.size !== stat.size) {
    sessionTitleFieldsCache.delete(cacheKey);
    return null;
  }
  sessionTitleFieldsCache.delete(cacheKey);
  sessionTitleFieldsCache.set(cacheKey, cached);
  return {
    firstUserMessage: cached.firstUserMessage,
    lastMessagePreview: cached.lastMessagePreview,
  };
}
function setCachedSessionTitleFields(cacheKey, stat, value) {
  sessionTitleFieldsCache.set(cacheKey, {
    ...value,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
  });
  while (sessionTitleFieldsCache.size > MAX_SESSION_TITLE_FIELDS_CACHE_ENTRIES) {
    const oldestKey = sessionTitleFieldsCache.keys().next().value;
    if (typeof oldestKey !== "string" || !oldestKey) break;
    sessionTitleFieldsCache.delete(oldestKey);
  }
}
function getCachedTranscriptMessageCount(filePath, stat) {
  const cached = transcriptMessageCountCache.get(filePath);
  if (!cached) return null;
  if (cached.mtimeMs !== stat.mtimeMs || cached.size !== stat.size) {
    transcriptMessageCountCache.delete(filePath);
    return null;
  }
  transcriptMessageCountCache.delete(filePath);
  transcriptMessageCountCache.set(filePath, cached);
  return cached.count;
}
function setCachedTranscriptMessageCount(filePath, stat, count) {
  transcriptMessageCountCache.set(filePath, {
    mtimeMs: stat.mtimeMs,
    size: stat.size,
    count,
  });
  while (transcriptMessageCountCache.size > MAX_TRANSCRIPT_MESSAGE_COUNT_CACHE_ENTRIES) {
    const oldestKey = transcriptMessageCountCache.keys().next().value;
    if (typeof oldestKey !== "string" || !oldestKey) break;
    transcriptMessageCountCache.delete(oldestKey);
  }
}
async function yieldTranscriptScan() {
  await new Promise((resolve) => {
    setImmediate(resolve);
  });
}
/** Attach OpenClaw metadata to a transcript message without dropping existing metadata. */
function attachOpenClawTranscriptMeta(message, meta) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return message;
  const record = message;
  const existing =
    record["__openclaw"] &&
    typeof record["__openclaw"] === "object" &&
    !Array.isArray(record["__openclaw"])
      ? record["__openclaw"]
      : {};
  return {
    ...record,
    __openclaw: {
      ...existing,
      ...meta,
    },
  };
}
function readTranscriptMessageIdempotencyKey(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return;
  const value = message.idempotencyKey;
  return typeof value === "string" && value.trim() ? value : void 0;
}
/** Read all visible transcript messages for a session from the first existing candidate file. */
function readSessionMessages(sessionId, storePath, sessionFile, agentId) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return [];
  return transcriptRecordsToMessages(readSelectedTranscriptRecords(filePath));
}
const RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
function normalizeRecentSessionReadOptions(opts) {
  const maxMessages = resolveNonNegativeIntegerOption(opts?.maxMessages, 0);
  return {
    maxMessages,
    maxBytes: resolveIntegerOption(opts?.maxBytes, RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES, {
      min: 1024,
    }),
    maxLines: resolveIntegerOption(opts?.maxLines, maxMessages * 20 + 20, { min: maxMessages }),
  };
}
async function readRecentTranscriptTailLinesAsync(filePath, stat, opts) {
  const { maxBytes, maxLines } = normalizeRecentSessionReadOptions(opts);
  const readLen = Math.min(stat.size, maxBytes);
  const readStart = Math.max(0, stat.size - readLen);
  const handle = await fs.promises.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(readLen);
    const { bytesRead } = await handle.read(buffer, 0, readLen, readStart);
    if (bytesRead <= 0) return [];
    return buffer
      .toString("utf-8", 0, bytesRead)
      .split(/\r?\n/)
      .slice(readStart > 0 ? 1 : 0)
      .filter((line) => line.trim().length > 0)
      .slice(-maxLines);
  } finally {
    await handle.close();
  }
}
const MAX_TRANSCRIPT_PARSE_LINE_BYTES = 256 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS = 64 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS = 64 * 1024;
const TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER = "[chat.history omitted: message too large]";
function isOversizedTranscriptLine(line) {
  return Buffer.byteLength(line, "utf8") > MAX_TRANSCRIPT_PARSE_LINE_BYTES;
}
function isJsonObjectFieldToken(source, tokenIndex) {
  for (let index = tokenIndex - 1; index >= 0; index--) {
    const char = source.charAt(index);
    if (/\s/.test(char)) continue;
    return char === "{" || char === ",";
  }
  return true;
}
function extractJsonStringFieldWindow(source, field, startIndex = 0, endIndex = source.length) {
  const fieldToken = JSON.stringify(field);
  let searchIndex = startIndex;
  while (searchIndex < endIndex) {
    const tokenIndex = source.indexOf(fieldToken, searchIndex);
    if (tokenIndex < 0 || tokenIndex >= endIndex) return;
    searchIndex = tokenIndex + fieldToken.length;
    if (!isJsonObjectFieldToken(source, tokenIndex)) continue;
    const match = /^\s*:\s*"((?:\\.|[^"\\])*)"/.exec(source.slice(searchIndex, endIndex));
    if (!match) continue;
    try {
      return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
    } catch {
      return;
    }
  }
}
function extractJsonStringFieldSuffix(source, field) {
  return extractJsonStringFieldWindow(
    source,
    field,
    Math.max(0, source.length - OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS),
  );
}
function buildOversizedTranscriptRecord(line) {
  const prefix = line.slice(0, OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS);
  const messageMatch = /"message"\s*:/.exec(prefix);
  const recordPrefix = messageMatch ? prefix.slice(0, messageMatch.index) : prefix;
  const id = extractJsonStringFieldPrefix(prefix, "id");
  const parentId = extractJsonNullableStringFieldPrefix(prefix, "parentId");
  const type = extractJsonStringFieldPrefix(prefix, "type");
  const timestamp =
    extractJsonStringFieldPrefix(recordPrefix, "timestamp") ??
    extractJsonNumberFieldPrefix(recordPrefix, "timestamp");
  const role = extractJsonStringFieldPrefix(prefix, "role") ?? "assistant";
  const idempotencyKey =
    extractJsonStringFieldPrefix(prefix, "idempotencyKey") ??
    extractJsonStringFieldSuffix(line, "idempotencyKey");
  return {
    record: {
      ...(type ? { type } : {}),
      ...(id ? { id } : {}),
      ...(parentId !== void 0 ? { parentId } : {}),
      ...(timestamp !== void 0 ? { timestamp } : {}),
      message: {
        role,
        ...(idempotencyKey ? { idempotencyKey } : {}),
        content: [
          {
            type: "text",
            text: TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER,
          },
        ],
        __openclaw: {
          truncated: true,
          reason: "oversized",
        },
      },
    },
  };
}
function parseTailTranscriptRecord(line) {
  if (isOversizedTranscriptLine(line)) return buildOversizedTranscriptRecord(line);
  try {
    const parsed = JSON.parse(line);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return { record: parsed };
  } catch {
    return null;
  }
}
function selectBoundedActiveTailRecords(entries, opts) {
  const tree = scanSessionTranscriptTree(entries.map((entry) => entry.record));
  if (opts?.failClosedOnInvalidLeafControl === true && tree.hasInvalidLeafControl) return [];
  if (!tree.hasExplicitLeafUpdate) return entries;
  const recordsByValue = new Map(entries.map((entry) => [entry.record, entry]));
  const activeBranch = selectSessionTranscriptTreePathNodes(tree, tree.leafId).flatMap((node) => {
    const entry = recordsByValue.get(node.entry);
    return entry ? [entry] : [];
  });
  const firstActiveRecord = activeBranch[0];
  const firstActiveIndex = firstActiveRecord ? entries.indexOf(firstActiveRecord) : -1;
  if (firstActiveIndex > 0)
    for (let index = firstActiveIndex - 1; index >= 0; index -= 1) {
      const entry = entries[index];
      if (entry?.record.type === "compaction") return [entry, ...activeBranch];
    }
  return activeBranch;
}
function readTranscriptRecords(filePath) {
  const records = [];
  visitTranscriptLines(filePath, (line) => {
    if (!line.trim()) return;
    const record = parseTailTranscriptRecord(line);
    if (record && record.record.type !== "session") records.push(record);
  });
  return records;
}
function selectActiveTranscriptRecords(records) {
  return selectBoundedActiveTailRecords(records);
}
function readSelectedTranscriptRecords(filePath) {
  try {
    return selectActiveTranscriptRecords(readTranscriptRecords(filePath));
  } catch {
    return [];
  }
}
function transcriptRecordsToMessages(records) {
  const messages = [];
  let messageSeq = 0;
  for (const entry of records) {
    const message = parsedSessionEntryToMessage(entry.record, messageSeq + 1);
    if (message) {
      messageSeq += 1;
      messages.push(message);
    }
  }
  return messages;
}
function parseRecentTranscriptTailMessages(lines, maxMessages) {
  return transcriptRecordsToMessages(
    selectBoundedActiveTailRecords(
      lines.flatMap((line) => {
        const entry = parseTailTranscriptRecord(line);
        return entry ? [entry] : [];
      }),
      { failClosedOnInvalidLeafControl: true },
    ),
  ).slice(-maxMessages);
}
function visitTranscriptLines(filePath, visit) {
  const fd = fs.openSync(filePath, "r");
  try {
    const decoder = new StringDecoder("utf8");
    const buffer = Buffer.allocUnsafe(64 * 1024);
    let carry = "";
    while (true) {
      const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (bytesRead <= 0) break;
      const lines = (carry + decoder.write(buffer.subarray(0, bytesRead))).split(/\r?\n/);
      carry = lines.pop() ?? "";
      for (const line of lines) visit(line);
    }
    const tail = carry + decoder.end();
    if (tail) visit(tail);
  } finally {
    fs.closeSync(fd);
  }
}
async function visitTranscriptLinesAsync(filePath, visit) {
  const handle = await fs.promises.open(filePath, "r");
  try {
    const decoder = new StringDecoder("utf8");
    const buffer = Buffer.allocUnsafe(TRANSCRIPT_ASYNC_READ_CHUNK_BYTES);
    let carry = "";
    while (true) {
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
      if (bytesRead <= 0) break;
      const lines = (carry + decoder.write(buffer.subarray(0, bytesRead))).split(/\r?\n/);
      carry = lines.pop() ?? "";
      for (const line of lines) visit(line);
      await yieldTranscriptScan();
    }
    const tail = carry + decoder.end();
    if (tail) visit(tail);
  } finally {
    await handle.close();
  }
}
async function readSessionMessagesAsync$1(sessionId, storePath, sessionFile, opts, agentId) {
  return (
    await readSessionMessagesWithSourceAsync$1(sessionId, storePath, sessionFile, opts, agentId)
  ).messages;
}
async function readSessionMessagesWithSourceAsync$1(
  sessionId,
  storePath,
  sessionFile,
  opts,
  agentId,
) {
  if (opts.mode === "recent") {
    const { mode: _modeValue, ...recentOpts } = opts;
    return await readRecentSessionMessagesWithSourceAsync(
      sessionId,
      storePath,
      sessionFile,
      recentOpts,
      agentId,
    );
  }
  const filePath =
    opts.allowResetArchiveFallback === true
      ? await findExistingTranscriptHistoryPathAsync(sessionId, storePath, sessionFile, agentId, {
          resetArchiveOnly: opts.resetArchiveOnly === true,
        })
      : findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return { messages: [] };
  return {
    messages:
      (await readSessionTranscriptIndex(filePath))?.entries.flatMap((entry) =>
        indexedTranscriptEntryToMessages(entry),
      ) ?? [],
    transcriptPath: filePath,
  };
}
async function readSessionMessageByIdAsync$1(sessionId, storePath, sessionFile, messageId, opts) {
  const filePath =
    opts?.allowResetArchiveFallback === true
      ? await findExistingTranscriptHistoryPathAsync(
          sessionId,
          storePath,
          sessionFile,
          opts.agentId,
          { resetArchiveOnly: opts.resetArchiveOnly === true },
        )
      : findExistingTranscriptPath(sessionId, storePath, sessionFile, opts?.agentId);
  if (!filePath)
    return {
      oversized: false,
      found: false,
    };
  const index = await readSessionTranscriptIndex(filePath);
  if (!index)
    return {
      oversized: false,
      found: false,
    };
  const entry = index.entries.find((candidate) => candidate.id === messageId);
  if (!entry)
    return {
      oversized: false,
      found: false,
    };
  if (entry.byteLength > MAX_TRANSCRIPT_PARSE_LINE_BYTES)
    return {
      oversized: true,
      found: true,
      seq: entry.seq,
    };
  return {
    message: indexedTranscriptEntryToMessage(entry),
    seq: entry.seq,
    oversized: false,
    found: true,
  };
}
async function visitSessionMessagesAsync$1(
  sessionId,
  storePath,
  sessionFile,
  visit,
  opts,
  agentId,
) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return 0;
  const index = await readSessionTranscriptIndex(filePath, { cache: opts.cache });
  if (!index) return 0;
  for (const entry of index.entries) {
    const message = indexedTranscriptEntryToMessage(entry);
    if (message) visit(message, entry.seq);
  }
  return index.entries.length;
}
async function readSessionMessageCountAsync$1(sessionId, storePath, sessionFile, agentId) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return 0;
  return await readSessionMessageCountFromPathAsync(filePath);
}
async function readRecentSessionMessagesAsync(sessionId, storePath, sessionFile, opts, agentId) {
  return (
    await readRecentSessionMessagesWithSourceAsync(sessionId, storePath, sessionFile, opts, agentId)
  ).messages;
}
async function readRecentSessionMessagesWithSourceAsync(
  sessionId,
  storePath,
  sessionFile,
  opts,
  agentId,
) {
  const normalized = normalizeRecentSessionReadOptions(opts);
  const { maxMessages } = normalized;
  if (maxMessages === 0) return { messages: [] };
  const filePath =
    opts?.allowResetArchiveFallback === true
      ? await findExistingTranscriptHistoryPathAsync(sessionId, storePath, sessionFile, agentId, {
          resetArchiveOnly: opts.resetArchiveOnly === true,
        })
      : findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return { messages: [] };
  return {
    messages: await readRecentSessionMessagesFromPathAsync(filePath, normalized),
    transcriptPath: filePath,
  };
}
async function readRecentSessionMessagesFromPathAsync(filePath, opts) {
  const { maxMessages } = opts;
  let stat;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return [];
  }
  if (stat.size === 0) return [];
  return parseRecentTranscriptTailMessages(
    await readRecentTranscriptTailLinesAsync(filePath, stat, { ...opts }),
    maxMessages,
  );
}
async function readRecentSessionMessagesWithStatsAsync$1(
  sessionId,
  storePath,
  sessionFile,
  opts,
  agentId,
) {
  const filePath =
    opts.allowResetArchiveFallback === true
      ? await findExistingTranscriptHistoryPathAsync(sessionId, storePath, sessionFile, agentId, {
          resetArchiveOnly: opts.resetArchiveOnly === true,
        })
      : findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath)
    return {
      messages: [],
      totalMessages: 0,
    };
  const totalMessages = await readSessionMessageCountFromPathAsync(filePath);
  const messages = await readRecentSessionMessagesFromPathAsync(
    filePath,
    normalizeRecentSessionReadOptions(opts),
  );
  const firstSeq = Math.max(1, totalMessages - messages.length + 1);
  return {
    messages: messages.map((message, index) =>
      attachOpenClawTranscriptMeta(message, { seq: firstSeq + index }),
    ),
    totalMessages,
    transcriptPath: filePath,
  };
}
async function readSessionMessagesPageWithStatsAsync$1(
  sessionId,
  storePath,
  sessionFile,
  opts,
  agentId,
) {
  const filePath =
    opts.allowResetArchiveFallback === true
      ? await findExistingTranscriptHistoryPathAsync(sessionId, storePath, sessionFile, agentId)
      : findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath)
    return {
      messages: [],
      totalMessages: 0,
    };
  const index = await readSessionTranscriptIndex(filePath);
  if (!index)
    return {
      messages: [],
      totalMessages: 0,
      transcriptPath: filePath,
    };
  const totalMessages = index.entries.length;
  const offset = Math.min(resolveNonNegativeIntegerOption(opts.offset, 0), totalMessages);
  const maxMessages = resolveNonNegativeIntegerOption(opts.maxMessages, 0);
  const endExclusive = Math.max(0, totalMessages - offset);
  const start = Math.max(0, endExclusive - maxMessages);
  return {
    messages: index.entries
      .slice(start, endExclusive)
      .flatMap((entry) => indexedTranscriptEntryToMessages(entry)),
    totalMessages,
    transcriptPath: filePath,
  };
}
function parsedSessionEntryToMessage(parsed, seq) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const entry = parsed;
  if (entry.message) {
    const recordTimestampMs =
      typeof entry.timestamp === "string"
        ? Date.parse(entry.timestamp)
        : typeof entry.timestamp === "number"
          ? entry.timestamp
          : NaN;
    const idempotencyKey = readTranscriptMessageIdempotencyKey(entry.message);
    return attachOpenClawTranscriptMeta(entry.message, {
      ...(typeof entry.id === "string" ? { id: entry.id } : {}),
      ...(idempotencyKey ? { idempotencyKey } : {}),
      ...(Number.isFinite(recordTimestampMs) ? { recordTimestampMs } : {}),
      seq,
    });
  }
  if (entry.type === "compaction") {
    const ts = typeof entry.timestamp === "string" ? Date.parse(entry.timestamp) : NaN;
    return {
      role: "system",
      content: [
        {
          type: "text",
          text: "Compaction",
        },
      ],
      timestamp: Number.isFinite(ts) ? ts : Date.now(),
      __openclaw: {
        kind: "compaction",
        id: typeof entry.id === "string" ? entry.id : void 0,
        seq,
      },
    };
  }
  return null;
}
function indexedTranscriptEntryToMessage(entry) {
  return parsedSessionEntryToMessage(entry.record, entry.seq);
}
function indexedTranscriptEntryToMessages(entry) {
  const message = indexedTranscriptEntryToMessage(entry);
  return message ? [message] : [];
}
function capArrayByJsonBytes(items, maxBytes) {
  if (items.length === 0)
    return {
      items,
      bytes: 2,
    };
  const parts = items.map((item) => jsonUtf8Bytes(item));
  let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
  let start = 0;
  while (bytes > maxBytes && start < items.length - 1) {
    bytes -= expectDefined(parts[start], "parts entry at start") + 1;
    start += 1;
  }
  return {
    items: start > 0 ? items.slice(start) : items,
    bytes,
  };
}
const MAX_LINES_TO_SCAN = 10;
function readSessionTitleFieldsFromTranscript$1(sessionId, storePath, sessionFile, agentId, opts) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath)
    return {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
  }
  const cacheKey = readSessionTitleFieldsCacheKey(filePath, opts);
  const cached = getCachedSessionTitleFields(cacheKey, stat);
  if (cached) return cached;
  if (stat.size === 0) {
    const empty = {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
    setCachedSessionTitleFields(cacheKey, stat, empty);
    return empty;
  }
  let fd = null;
  try {
    fd = fs.openSync(filePath, "r");
    const size = stat.size;
    let firstUserMessage = null;
    try {
      const chunk = readTranscriptHeadChunk(fd);
      if (chunk) firstUserMessage = extractFirstUserMessageFromTranscriptChunk(chunk, opts);
    } catch {}
    let lastMessagePreview = null;
    try {
      lastMessagePreview = readLastMessagePreviewFromOpenTranscript({
        fd,
        size,
      });
    } catch {}
    const result = {
      firstUserMessage,
      lastMessagePreview,
    };
    setCachedSessionTitleFields(cacheKey, stat, result);
    return result;
  } catch {
    return {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
  } finally {
    if (fd !== null)
      try {
        fs.closeSync(fd);
      } catch {}
  }
}
async function readSessionTitleFieldsFromTranscriptAsync$1(
  sessionId,
  storePath,
  sessionFile,
  agentId,
  opts,
) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath)
    return {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
  let stat;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
  }
  const cacheKey = readSessionTitleFieldsCacheKey(filePath, opts);
  const cached = getCachedSessionTitleFields(cacheKey, stat);
  if (cached) return cached;
  if (stat.size === 0) {
    const empty = {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
    setCachedSessionTitleFields(cacheKey, stat, empty);
    return empty;
  }
  let handle = null;
  try {
    handle = await fs.promises.open(filePath, "r");
    let firstUserMessage = null;
    try {
      const chunk = await readTranscriptHeadChunkAsync(handle);
      if (chunk) firstUserMessage = extractFirstUserMessageFromTranscriptChunk(chunk, opts);
    } catch {}
    let lastMessagePreview = null;
    try {
      lastMessagePreview = await readLastMessagePreviewFromOpenTranscriptAsync({
        handle,
        size: stat.size,
      });
    } catch {}
    const result = {
      firstUserMessage,
      lastMessagePreview,
    };
    setCachedSessionTitleFields(cacheKey, stat, result);
    return result;
  } catch {
    return {
      firstUserMessage: null,
      lastMessagePreview: null,
    };
  } finally {
    if (handle) await handle.close().catch(() => void 0);
  }
}
function extractTextFromContent(content) {
  if (typeof content === "string")
    return stripInlineDirectiveTagsForDisplay(content).text.trim() || null;
  if (!Array.isArray(content)) return null;
  for (const part of content) {
    if (!part || typeof part.text !== "string") continue;
    if (part.type === "text" || part.type === "output_text" || part.type === "input_text") {
      const normalized = stripInlineDirectiveTagsForDisplay(part.text).text.trim();
      if (normalized) return normalized;
    }
  }
  return null;
}
function readTranscriptHeadChunk(fd, maxBytes = 8192) {
  const buf = Buffer.alloc(maxBytes);
  const bytesRead = fs.readSync(fd, buf, 0, buf.length, 0);
  if (bytesRead <= 0) return null;
  return buf.toString("utf-8", 0, bytesRead);
}
async function readTranscriptHeadChunkAsync(handle, maxBytes = 8192) {
  const buffer = Buffer.alloc(maxBytes);
  const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
  if (bytesRead <= 0) return null;
  return buffer.toString("utf-8", 0, bytesRead);
}
function extractFirstUserMessageFromTranscriptChunk(chunk, opts) {
  const lines = chunk.split(/\r?\n/).slice(0, MAX_LINES_TO_SCAN);
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line)?.message;
      if (msg?.role !== "user") continue;
      if (opts?.includeInterSession !== true && hasInterSessionUserProvenance(msg)) continue;
      const text = extractTextFromContent(msg.content);
      if (text) return text;
    } catch {}
  }
  return null;
}
function findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId) {
  return (
    resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((p) =>
      fs.existsSync(p),
    ) ?? null
  );
}
async function findExistingTranscriptHistoryPathAsync(
  sessionId,
  storePath,
  sessionFile,
  agentId,
  opts,
) {
  if (opts?.resetArchiveOnly !== true) {
    const activePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
    if (activePath) return activePath;
  }
  for (const archivePath of await resolveSessionTranscriptResetArchiveCandidatesAsync(
    sessionId,
    storePath,
    sessionFile,
    agentId,
  ))
    if ((await fs.promises.stat(archivePath).catch(() => null))?.isFile()) {
      if (opts?.resetArchiveOnly !== true) {
        const refreshedActivePath = findExistingTranscriptPath(
          sessionId,
          storePath,
          sessionFile,
          agentId,
        );
        if (refreshedActivePath) return refreshedActivePath;
      }
      try {
        return materializeSessionArchiveForRead(archivePath);
      } catch {
        continue;
      }
    }
  return null;
}
async function resolveSessionHistoryTranscriptPathAsync(sessionId, storePath, sessionFile, opts) {
  return opts?.allowResetArchiveFallback === true
    ? findExistingTranscriptHistoryPathAsync(sessionId, storePath, sessionFile, opts.agentId)
    : findExistingTranscriptPath(sessionId, storePath, sessionFile, opts?.agentId);
}
async function readSessionMessageCountFromPathAsync(filePath) {
  let stat = null;
  try {
    stat = await fs.promises.stat(filePath);
    const cached = getCachedTranscriptMessageCount(filePath, stat);
    if (typeof cached === "number") return cached;
  } catch {}
  const count = (await readSessionTranscriptIndex(filePath))?.entries.length ?? 0;
  if (stat) setCachedTranscriptMessageCount(filePath, stat, count);
  return count;
}
function withOpenTranscriptFd(filePath, read) {
  let fd = null;
  try {
    fd = fs.openSync(filePath, "r");
    return read(fd);
  } catch {
  } finally {
    if (fd !== null) fs.closeSync(fd);
  }
  return null;
}
const LAST_MSG_MAX_BYTES = 16384;
function extractLastMessagePreviewFromTranscriptLines(lines) {
  const selected = selectBoundedActiveTailRecords(
    lines.flatMap((line) => {
      const parsed = parseTailTranscriptRecord(line);
      return parsed ? [parsed] : [];
    }),
    { failClosedOnInvalidLeafControl: true },
  );
  for (let index = selected.length - 1; index >= 0; index -= 1) {
    const msg = selected[index]?.record.message;
    if (msg?.role !== "user" && msg?.role !== "assistant") continue;
    const text = extractTextFromContent(msg.content);
    if (text) return text;
  }
  return null;
}
function readLastMessagePreviewFromOpenTranscript(params) {
  const readStart = Math.max(0, params.size - LAST_MSG_MAX_BYTES);
  const readLen = Math.min(params.size, LAST_MSG_MAX_BYTES);
  const buf = Buffer.alloc(readLen);
  fs.readSync(params.fd, buf, 0, readLen, readStart);
  return extractLastMessagePreviewFromTranscriptLines(
    buf
      .toString("utf-8")
      .split(/\r?\n/)
      .filter((l) => l.trim())
      .slice(-20),
  );
}
async function readLastMessagePreviewFromOpenTranscriptAsync(params) {
  const readStart = Math.max(0, params.size - LAST_MSG_MAX_BYTES);
  const readLen = Math.min(params.size, LAST_MSG_MAX_BYTES);
  const buffer = Buffer.alloc(readLen);
  const { bytesRead } = await params.handle.read(buffer, 0, readLen, readStart);
  if (bytesRead <= 0) return null;
  return extractLastMessagePreviewFromTranscriptLines(
    buffer
      .toString("utf-8", 0, bytesRead)
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .slice(-20),
  );
}
function extractTranscriptUsageCost(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
  const cost = raw.cost;
  if (!cost || typeof cost !== "object" || Array.isArray(cost)) return;
  const total = cost.total;
  return typeof total === "number" && Number.isFinite(total) && total >= 0 ? total : void 0;
}
function resolvePositiveUsageNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function extractTranscriptContentEstimatedChars(content) {
  if (typeof content === "string") {
    const normalized = stripInlineDirectiveTagsForDisplay(content).text.trim();
    return normalized ? estimateStringChars(normalized) : 0;
  }
  if (!Array.isArray(content)) return 0;
  let chars = 0;
  for (const part of content) {
    if (!part || typeof part !== "object" || Array.isArray(part)) continue;
    const record = part;
    if (typeof record.text !== "string") continue;
    const type = typeof record.type === "string" ? record.type : "text";
    if (type !== "text" && type !== "output_text" && type !== "input_text") continue;
    const normalized = stripInlineDirectiveTagsForDisplay(record.text).text.trim();
    if (normalized) chars += estimateStringChars(normalized);
  }
  return chars;
}
function extractTranscriptTokenEstimateFromLine(line) {
  if (isOversizedTranscriptLine(line)) return null;
  try {
    const parsed = JSON.parse(line);
    const message =
      parsed.message && typeof parsed.message === "object" && !Array.isArray(parsed.message)
        ? parsed.message
        : void 0;
    if (!message) return null;
    const role = typeof message.role === "string" ? message.role : void 0;
    if (role !== "user" && role !== "assistant") return null;
    const modelProvider =
      typeof message.provider === "string"
        ? message.provider.trim()
        : typeof parsed.provider === "string"
          ? parsed.provider.trim()
          : void 0;
    const model =
      typeof message.model === "string"
        ? message.model.trim()
        : typeof parsed.model === "string"
          ? parsed.model.trim()
          : void 0;
    if (role === "assistant" && modelProvider === "openclaw" && model === "delivery-mirror")
      return null;
    const contentChars = extractTranscriptContentEstimatedChars(message.content);
    if (contentChars <= 0) return null;
    return {
      estimatedChars: contentChars,
      hasModelIdentity: role === "assistant" && Boolean(modelProvider || model),
    };
  } catch {
    return null;
  }
}
function extractUsageSnapshotFromTranscriptLine(line) {
  if (isOversizedTranscriptLine(line)) return null;
  try {
    const parsed = JSON.parse(line);
    const message =
      parsed.message && typeof parsed.message === "object" && !Array.isArray(parsed.message)
        ? parsed.message
        : void 0;
    if (!message) return null;
    const role = typeof message.role === "string" ? message.role : void 0;
    if (role && role !== "assistant") return null;
    const usageRaw =
      message.usage && typeof message.usage === "object" && !Array.isArray(message.usage)
        ? message.usage
        : parsed.usage && typeof parsed.usage === "object" && !Array.isArray(parsed.usage)
          ? parsed.usage
          : void 0;
    const usage = normalizeUsage(usageRaw);
    const totalTokens = resolvePositiveUsageNumber(deriveSessionTotalTokens({ usage }));
    const costUsd = extractTranscriptUsageCost(usageRaw);
    const modelProvider =
      typeof message.provider === "string"
        ? message.provider.trim()
        : typeof parsed.provider === "string"
          ? parsed.provider.trim()
          : void 0;
    const model =
      typeof message.model === "string"
        ? message.model.trim()
        : typeof parsed.model === "string"
          ? parsed.model.trim()
          : void 0;
    const isDeliveryMirror = modelProvider === "openclaw" && model === "delivery-mirror";
    const hasMeaningfulUsage =
      hasNonzeroUsage(usage) ||
      typeof totalTokens === "number" ||
      (typeof costUsd === "number" && Number.isFinite(costUsd));
    if (!hasMeaningfulUsage && !Boolean(modelProvider || model)) return null;
    if (isDeliveryMirror && !hasMeaningfulUsage) return null;
    const snapshot = {};
    if (!isDeliveryMirror) {
      if (modelProvider) snapshot.modelProvider = modelProvider;
      if (model) snapshot.model = model;
    }
    if (typeof usage?.input === "number" && Number.isFinite(usage.input))
      snapshot.inputTokens = usage.input;
    if (typeof usage?.output === "number" && Number.isFinite(usage.output))
      snapshot.outputTokens = usage.output;
    if (typeof usage?.cacheRead === "number" && Number.isFinite(usage.cacheRead))
      snapshot.cacheRead = usage.cacheRead;
    if (typeof usage?.cacheWrite === "number" && Number.isFinite(usage.cacheWrite))
      snapshot.cacheWrite = usage.cacheWrite;
    if (usage?.contextUsage) snapshot.contextUsage = usage.contextUsage;
    if (typeof totalTokens === "number") {
      snapshot.totalTokens = totalTokens;
      snapshot.totalTokensFresh = true;
    }
    if (typeof costUsd === "number" && Number.isFinite(costUsd)) snapshot.costUsd = costUsd;
    return snapshot;
  } catch {
    return null;
  }
}
function extractAggregateUsageFromTranscriptLines(lines) {
  const snapshot = {};
  let sawSnapshot = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let cacheRead = 0;
  let cacheWrite = 0;
  let sawInputTokens = false;
  let sawOutputTokens = false;
  let sawCacheRead = false;
  let sawCacheWrite = false;
  let costUsdTotal = 0;
  let sawCost = false;
  let estimatedTranscriptChars = 0;
  let sawEstimatedTranscriptContent = false;
  let sawEstimateModelIdentity = false;
  for (const line of lines) {
    const estimate = extractTranscriptTokenEstimateFromLine(line);
    if (estimate) {
      estimatedTranscriptChars += estimate.estimatedChars;
      sawEstimatedTranscriptContent = true;
      sawEstimateModelIdentity ||= estimate.hasModelIdentity;
    }
    const current = extractUsageSnapshotFromTranscriptLine(line);
    if (!current) continue;
    sawSnapshot = true;
    if (current.modelProvider) snapshot.modelProvider = current.modelProvider;
    if (current.model) snapshot.model = current.model;
    if (typeof current.inputTokens === "number") {
      inputTokens += current.inputTokens;
      sawInputTokens = true;
    }
    if (typeof current.outputTokens === "number") {
      outputTokens += current.outputTokens;
      sawOutputTokens = true;
    }
    if (typeof current.cacheRead === "number") {
      cacheRead += current.cacheRead;
      sawCacheRead = true;
    }
    if (typeof current.cacheWrite === "number") {
      cacheWrite += current.cacheWrite;
      sawCacheWrite = true;
    }
    if (current.contextUsage) snapshot.contextUsage = current.contextUsage;
    else delete snapshot.contextUsage;
    if (current.contextUsage?.state === "unavailable") {
      delete snapshot.totalTokens;
      delete snapshot.totalTokensFresh;
    } else if (typeof current.totalTokens === "number") {
      snapshot.totalTokens = current.totalTokens;
      snapshot.totalTokensFresh = true;
    }
    if (typeof current.costUsd === "number" && Number.isFinite(current.costUsd)) {
      costUsdTotal += current.costUsd;
      sawCost = true;
    }
  }
  if (!sawSnapshot) return null;
  if (sawInputTokens) snapshot.inputTokens = inputTokens;
  if (sawOutputTokens) snapshot.outputTokens = outputTokens;
  if (sawCacheRead) snapshot.cacheRead = cacheRead;
  if (sawCacheWrite) snapshot.cacheWrite = cacheWrite;
  if (sawCost) snapshot.costUsd = costUsdTotal;
  if (
    typeof snapshot.totalTokens !== "number" &&
    sawEstimatedTranscriptContent &&
    sawEstimateModelIdentity
  ) {
    const estimatedTotalTokens = estimateTokensFromChars(estimatedTranscriptChars);
    if (estimatedTotalTokens > 0) {
      snapshot.totalTokens = estimatedTotalTokens;
      snapshot.totalTokensFresh = true;
    }
  }
  return snapshot;
}
function extractAggregateUsageFromTranscriptChunk(chunk) {
  return extractAggregateUsageFromTranscriptLines(
    chunk.split(/\r?\n/).filter((line) => line.trim().length > 0),
  );
}
async function readLatestSessionUsageFromTranscriptAsync$1(
  sessionId,
  storePath,
  sessionFile,
  agentId,
) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return null;
  try {
    if ((await fs.promises.stat(filePath)).size === 0) return null;
    const lines = [];
    await visitTranscriptLinesAsync(filePath, (line) => {
      if (line.trim()) lines.push(line);
    });
    return extractAggregateUsageFromTranscriptLines(lines);
  } catch {
    return null;
  }
}
function readRecentSessionUsageFromTranscript$1(
  sessionId,
  storePath,
  sessionFile,
  agentId,
  maxBytes,
) {
  const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
  if (!filePath) return null;
  return withOpenTranscriptFd(filePath, (fd) => {
    const stat = fs.fstatSync(fd);
    if (stat.size === 0) return null;
    const readLen = Math.min(stat.size, Math.max(1024, Math.floor(maxBytes)));
    const readStart = Math.max(0, stat.size - readLen);
    const buf = Buffer.alloc(readLen);
    const bytesRead = fs.readSync(fd, buf, 0, readLen, readStart);
    if (bytesRead <= 0) return null;
    return extractAggregateUsageFromTranscriptChunk(
      buf
        .toString("utf-8", 0, bytesRead)
        .split(/\r?\n/)
        .slice(readStart > 0 ? 1 : 0)
        .join("\n"),
    );
  });
}
const PREVIEW_READ_SIZES = [64 * 1024, 256 * 1024, 1024 * 1024];
function normalizeRole(role, isTool) {
  if (isTool) return "tool";
  switch (normalizeLowercaseStringOrEmpty(role)) {
    case "user":
      return "user";
    case "assistant":
      return "assistant";
    case "system":
      return "system";
    case "tool":
      return "tool";
    default:
      return "other";
  }
}
function truncatePreviewText(text, maxChars) {
  if (text.length <= maxChars) return text;
  return `${truncateUtf16Safe(text, maxChars - 3)}...`;
}
function extractPreviewText(message) {
  if (normalizeLowercaseStringOrEmpty(message.role) === "assistant") {
    const assistantText = extractAssistantVisibleText(message);
    if (assistantText) {
      const normalized = stripInlineDirectiveTagsForDisplay(assistantText).text.trim();
      return normalized ? normalized : null;
    }
    return null;
  }
  if (typeof message.content === "string") {
    const normalized = stripInlineDirectiveTagsForDisplay(message.content).text.trim();
    return normalized ? normalized : null;
  }
  if (Array.isArray(message.content)) {
    const parts = message.content
      .map((entry) =>
        typeof entry?.text === "string" ? stripInlineDirectiveTagsForDisplay(entry.text).text : "",
      )
      .filter((text) => text.trim().length > 0);
    if (parts.length > 0) return parts.join("\n").trim();
  }
  if (typeof message.text === "string") {
    const normalized = stripInlineDirectiveTagsForDisplay(message.text).text.trim();
    return normalized ? normalized : null;
  }
  return null;
}
function isToolCall(message) {
  return hasToolCall(message);
}
function extractToolNames(message) {
  return extractToolCallNames(message);
}
function extractMediaSummary(message) {
  if (!Array.isArray(message.content)) return null;
  for (const entry of message.content) {
    const raw = normalizeLowercaseStringOrEmpty(entry?.type);
    if (!raw || raw === "text" || raw === "toolcall" || raw === "tool_call") continue;
    return `[${raw}]`;
  }
  return null;
}
function buildSessionPreviewItems(messages, maxItems, maxChars) {
  const items = [];
  for (const message of messages) {
    if (!message || typeof message !== "object" || Array.isArray(message)) continue;
    const previewMessage = message;
    const toolCall = isToolCall(previewMessage);
    const role = normalizeRole(previewMessage.role, toolCall);
    let text = extractPreviewText(previewMessage);
    if (!text) {
      const toolNames = extractToolNames(previewMessage);
      if (toolNames.length > 0) {
        const shown = toolNames.slice(0, 2);
        const overflow = toolNames.length - shown.length;
        text = `call ${shown.join(", ")}`;
        if (overflow > 0) text += ` +${overflow}`;
      }
    }
    if (!text) text = extractMediaSummary(previewMessage);
    if (!text) continue;
    let trimmed = text.trim();
    if (!trimmed) continue;
    if (role === "user") trimmed = stripEnvelope(trimmed);
    trimmed = truncatePreviewText(trimmed, maxChars);
    items.push({
      role,
      text: trimmed,
    });
  }
  if (items.length <= maxItems) return items;
  return items.slice(-maxItems);
}
function readRecentMessagesFromTranscript(filePath, maxMessages, readBytes) {
  let fd = null;
  try {
    fd = fs.openSync(filePath, "r");
    const size = fs.fstatSync(fd).size;
    if (size === 0) return [];
    const readStart = Math.max(0, size - readBytes);
    const readLen = Math.min(size, readBytes);
    const buf = Buffer.alloc(readLen);
    fs.readSync(fd, buf, 0, readLen, readStart);
    const tailLines = buf
      .toString("utf-8")
      .split(/\r?\n/)
      .filter((l) => l.trim())
      .slice(-200);
    const collected = [];
    for (let i = tailLines.length - 1; i >= 0; i--) {
      const line = expectDefined(tailLines[i], "tail lines entry at i");
      try {
        const msg = JSON.parse(line)?.message;
        if (msg && typeof msg === "object") {
          collected.push(msg);
          if (collected.length >= maxMessages) break;
        }
      } catch {}
    }
    return collected.toReversed();
  } catch {
    return [];
  } finally {
    if (fd !== null) fs.closeSync(fd);
  }
}
function readSessionPreviewItemsFromTranscript$1(
  sessionId,
  storePath,
  sessionFile,
  agentId,
  maxItems,
  maxChars,
) {
  const filePath = resolveSessionTranscriptCandidates(
    sessionId,
    storePath,
    sessionFile,
    agentId,
  ).find((p) => fs.existsSync(p));
  if (!filePath) return [];
  const boundedItems = Math.max(1, Math.min(maxItems, 50));
  const boundedChars = Math.max(20, Math.min(maxChars, 2e3));
  for (const readSize of PREVIEW_READ_SIZES) {
    const messages = readRecentMessagesFromTranscript(filePath, boundedItems, readSize);
    if (messages.length > 0 || readSize === PREVIEW_READ_SIZES[PREVIEW_READ_SIZES.length - 1])
      return buildSessionPreviewItems(messages, boundedItems, boundedChars);
  }
  return [];
}
//#endregion
//#region src/gateway/session-transcript-readers.ts
function resolveTranscriptReadTarget(scope) {
  const target = resolveSessionTranscriptReadTarget(scope);
  const marker = parseSqliteSessionFileMarker(target.sessionFile);
  const storePath = resolveConcreteReadStorePath(scope.storePath);
  return {
    agentId: target.agentId ?? marker?.agentId,
    sessionFile: target.sessionFile,
    sessionId: marker?.sessionId ?? target.sessionId,
    ...(target.sessionKey ? { sessionKey: target.sessionKey } : {}),
    ...((storePath ?? marker?.storePath) ? { storePath: storePath ?? marker?.storePath } : {}),
  };
}
function resolveConcreteReadStorePath(storePath) {
  const trimmed = storePath?.trim();
  if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
  return trimmed;
}
function isSqliteReadTarget(target) {
  return parseSqliteSessionFileMarker(target.sessionFile) !== void 0;
}
function toTranscriptReadScope(target) {
  return {
    ...(target.agentId ? { agentId: target.agentId } : {}),
    sessionId: target.sessionId,
    ...(target.sessionKey ? { sessionKey: target.sessionKey } : {}),
    ...(target.storePath ? { storePath: target.storePath } : {}),
  };
}
function readTranscriptRecordTimestampMs(event) {
  const raw = event.timestamp;
  const timestampMs =
    typeof raw === "string" ? Date.parse(raw) : typeof raw === "number" ? raw : NaN;
  return Number.isFinite(timestampMs) ? timestampMs : void 0;
}
function extractMessageRecord(event) {
  if (!event || typeof event !== "object" || Array.isArray(event)) return;
  const record = event;
  if (record.message === void 0) return;
  const recordTimestampMs = readTranscriptRecordTimestampMs(event);
  return {
    ...(typeof record.id === "string" ? { id: record.id } : {}),
    message: record.message,
    ...(recordTimestampMs !== void 0 ? { recordTimestampMs } : {}),
  };
}
function extractMessageRecordsFromEventEntries(entries) {
  return entries.flatMap((entry) => {
    const record = extractMessageRecord(entry.event);
    return record
      ? [
          {
            ...record,
            seq: entry.seq,
          },
        ]
      : [];
  });
}
function readSqliteMessageRecordsSync(target) {
  return extractMessageRecordsFromEventEntries(
    selectVisibleTranscriptEventEntries(loadTranscriptEventsSync(toTranscriptReadScope(target))),
  );
}
async function readSqliteMessageRecords(target) {
  return extractMessageRecordsFromEventEntries(
    selectVisibleTranscriptEventEntries(await loadTranscriptEvents(toTranscriptReadScope(target))),
  );
}
function readSqliteMessagesSync(target) {
  return readSqliteMessageRecordsSync(target).map(sqliteRecordMessageWithSeq);
}
function normalizeRecentSqliteReadOptions(opts) {
  const maxMessages = Math.max(0, Math.floor(opts?.maxMessages ?? 0));
  const maxBytes =
    typeof opts?.maxBytes === "number" && Number.isFinite(opts.maxBytes)
      ? Math.max(1024, Math.floor(opts.maxBytes))
      : 8 * 1024 * 1024;
  const defaultMaxLines = maxMessages * 20 + 20;
  return {
    maxMessages,
    maxBytes,
    maxLines:
      typeof opts?.maxLines === "number" && Number.isFinite(opts.maxLines)
        ? Math.max(maxMessages, Math.floor(opts.maxLines))
        : defaultMaxLines,
  };
}
function selectRecentSqliteEventEntries(entries, opts) {
  const selected = [];
  let bytes = 0;
  for (const entry of entries.toReversed()) {
    const line = JSON.stringify(entry.event);
    const lineBytes = Buffer.byteLength(line) + 1;
    if (selected.length > 0 && bytes + lineBytes > opts.maxBytes) break;
    selected.push(entry);
    bytes += lineBytes;
    if (selected.length >= opts.maxLines) break;
  }
  return selected.toReversed();
}
async function readRecentSqliteMessageRecords(target, opts) {
  const normalized = normalizeRecentSqliteReadOptions(opts);
  const records = extractMessageRecordsFromEventEntries(
    selectRecentSqliteEventEntries(
      selectVisibleTranscriptEventEntries(
        await loadTranscriptEvents(toTranscriptReadScope(target)),
      ),
      normalized,
    ),
  );
  return normalized.maxMessages > 0 ? records.slice(-normalized.maxMessages) : [];
}
function readRecentSqliteUsageMessages(target, maxBytes) {
  return extractMessageRecordsFromEventEntries(
    selectRecentSqliteEventEntries(
      selectVisibleTranscriptEventEntries(loadTranscriptEventsSync(toTranscriptReadScope(target))),
      {
        maxBytes: Math.max(
          1024,
          Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8 * 1024 * 1024),
        ),
        maxLines: 1e3,
      },
    ),
  ).map((record) => record.message);
}
function sqliteRecordMessageWithSeq(record) {
  return attachOpenClawTranscriptMeta(record.message, {
    ...(record.id ? { id: record.id } : {}),
    ...(record.recordTimestampMs !== void 0 ? { recordTimestampMs: record.recordTimestampMs } : {}),
    seq: record.seq,
  });
}
function extractMessageRole(message) {
  return message && typeof message === "object" && !Array.isArray(message) ? message.role : void 0;
}
function extractMessageText(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return null;
  const record = message;
  if (typeof record.content === "string") return record.content.trim() || null;
  if (Array.isArray(record.content))
    return (
      record.content
        .map((entry) =>
          entry && typeof entry === "object" && typeof entry.text === "string" ? entry.text : "",
        )
        .filter((part) => part.trim())
        .join("\n")
        .trim() || null
    );
  if (typeof record.text === "string") return record.text.trim() || null;
  return null;
}
function readSqliteTitleFields(target, opts) {
  const messages = readSqliteMessagesSync(target);
  const firstUser = messages.find((message) => {
    if (extractMessageRole(message) !== "user") return false;
    return opts?.includeInterSession === true || !hasInterSessionUserProvenance(message);
  });
  const lastText = messages.toReversed().map(extractMessageText).find(Boolean) ?? null;
  return {
    firstUserMessage: firstUser ? extractMessageText(firstUser) : null,
    lastMessagePreview: lastText,
  };
}
function extractSqliteUsageSnapshot(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return null;
  const record = message;
  const usageRaw =
    record.usage && typeof record.usage === "object" && !Array.isArray(record.usage)
      ? record.usage
      : void 0;
  const usage = normalizeUsage(usageRaw);
  const normalizedUsage = usage ?? {};
  const totalTokens = deriveSessionTotalTokens({ usage });
  const modelProvider = typeof record.provider === "string" ? record.provider.trim() : void 0;
  const model = typeof record.model === "string" ? record.model.trim() : void 0;
  const costUsd =
    typeof usageRaw?.cost?.total === "number" && Number.isFinite(usageRaw.cost.total)
      ? usageRaw.cost.total
      : usageRaw?.costUsd;
  const hasMeaningfulUsage =
    hasNonzeroUsage(usage) ||
    typeof totalTokens === "number" ||
    (typeof costUsd === "number" && Number.isFinite(costUsd) && costUsd > 0);
  const isDeliveryMirror = modelProvider === "openclaw" && model === "delivery-mirror";
  if (!hasMeaningfulUsage && !modelProvider && !model) return null;
  if (isDeliveryMirror && !hasMeaningfulUsage) return null;
  return {
    ...(!isDeliveryMirror && modelProvider ? { modelProvider } : {}),
    ...(!isDeliveryMirror && model ? { model } : {}),
    ...(typeof normalizedUsage.input === "number" ? { inputTokens: normalizedUsage.input } : {}),
    ...(typeof normalizedUsage.output === "number" ? { outputTokens: normalizedUsage.output } : {}),
    ...(typeof normalizedUsage.cacheRead === "number"
      ? { cacheRead: normalizedUsage.cacheRead }
      : {}),
    ...(typeof normalizedUsage.cacheWrite === "number"
      ? { cacheWrite: normalizedUsage.cacheWrite }
      : {}),
    ...(typeof totalTokens === "number"
      ? {
          totalTokens,
          totalTokensFresh: true,
        }
      : {}),
    ...(typeof costUsd === "number" && Number.isFinite(costUsd) ? { costUsd } : {}),
  };
}
function readSqliteAggregateUsageSnapshot(target) {
  return aggregateSqliteUsageSnapshots(readSqliteMessagesSync(target));
}
function aggregateSqliteUsageSnapshots(messages) {
  const aggregate = {};
  let sawUsage = false;
  let inputTokens = 0;
  let outputTokens = 0;
  let cacheRead = 0;
  let cacheWrite = 0;
  let costUsd = 0;
  let sawInput = false;
  let sawOutput = false;
  let sawCacheRead = false;
  let sawCacheWrite = false;
  let sawCost = false;
  for (const message of messages) {
    const snapshot = extractSqliteUsageSnapshot(message);
    if (!snapshot) continue;
    sawUsage = true;
    if (snapshot.modelProvider) aggregate.modelProvider = snapshot.modelProvider;
    if (snapshot.model) aggregate.model = snapshot.model;
    if (typeof snapshot.inputTokens === "number") {
      inputTokens += snapshot.inputTokens;
      sawInput = true;
    }
    if (typeof snapshot.outputTokens === "number") {
      outputTokens += snapshot.outputTokens;
      sawOutput = true;
    }
    if (typeof snapshot.cacheRead === "number") {
      cacheRead += snapshot.cacheRead;
      sawCacheRead = true;
    }
    if (typeof snapshot.cacheWrite === "number") {
      cacheWrite += snapshot.cacheWrite;
      sawCacheWrite = true;
    }
    if (typeof snapshot.totalTokens === "number") {
      aggregate.totalTokens = snapshot.totalTokens;
      aggregate.totalTokensFresh = true;
    }
    if (typeof snapshot.costUsd === "number") {
      costUsd += snapshot.costUsd;
      sawCost = true;
    }
  }
  if (!sawUsage) return null;
  if (sawInput) aggregate.inputTokens = inputTokens;
  if (sawOutput) aggregate.outputTokens = outputTokens;
  if (sawCacheRead) aggregate.cacheRead = cacheRead;
  if (sawCacheWrite) aggregate.cacheWrite = cacheWrite;
  if (sawCost) aggregate.costUsd = costUsd;
  return aggregate;
}
function buildSqlitePreviewItems(target, maxItems, maxChars) {
  return buildSessionPreviewItems(readSqliteMessagesSync(target), maxItems, maxChars);
}
/** Reads display messages asynchronously through the reader seam. */
async function readSessionMessagesAsync(scope, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) {
    if (opts.mode === "recent") {
      const records = await readRecentSqliteMessageRecords(target, opts);
      if (records.length === 0 && opts.allowResetArchiveFallback === true)
        return await readRecentSessionMessagesAsync(
          target.sessionId,
          target.storePath,
          void 0,
          {
            ...opts,
            resetArchiveOnly: true,
          },
          target.agentId,
        );
      return records.map(sqliteRecordMessageWithSeq);
    }
    const records = await readSqliteMessageRecords(target);
    if (records.length === 0 && opts.allowResetArchiveFallback === true)
      return await readSessionMessagesAsync$1(
        target.sessionId,
        target.storePath,
        void 0,
        opts,
        target.agentId,
      );
    return records.map(sqliteRecordMessageWithSeq);
  }
  return await readSessionMessagesAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    opts,
    target.agentId,
  );
}
/** Reads display messages with source metadata through the reader seam. */
async function readSessionMessagesWithSourceAsync(scope, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) {
    const records =
      opts.mode === "recent"
        ? await readRecentSqliteMessageRecords(target, opts)
        : await readSqliteMessageRecords(target);
    if (records.length === 0 && opts.allowResetArchiveFallback === true)
      return await readSessionMessagesWithSourceAsync$1(
        target.sessionId,
        target.storePath,
        void 0,
        {
          ...opts,
          resetArchiveOnly: true,
        },
        target.agentId,
      );
    return {
      messages: records.map(sqliteRecordMessageWithSeq),
      transcriptPath: target.sessionFile,
    };
  }
  return await readSessionMessagesWithSourceAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    opts,
    target.agentId,
  );
}
/** Finds one display message by transcript id through the reader seam. */
async function readSessionMessageByIdAsync(scope, messageId, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) {
    const found = (await readSqliteMessageRecords(target)).find(
      (record) => record.id === messageId,
    );
    if (found)
      return {
        found: true,
        message: found.message,
        oversized: false,
        seq: found.seq,
      };
    if (opts?.allowResetArchiveFallback === true)
      return await readSessionMessageByIdAsync$1(
        target.sessionId,
        target.storePath,
        void 0,
        messageId,
        {
          ...opts,
          agentId: target.agentId,
          resetArchiveOnly: true,
        },
      );
    return {
      found: false,
      oversized: false,
    };
  }
  return await readSessionMessageByIdAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    messageId,
    {
      ...opts,
      agentId: target.agentId,
    },
  );
}
/** Visits display messages asynchronously through the reader seam. */
async function visitSessionMessagesAsync(scope, visit, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) {
    let count = 0;
    for (const record of await readSqliteMessageRecords(target)) {
      visit(record.message, record.seq);
      count += 1;
    }
    return count;
  }
  return await visitSessionMessagesAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    visit,
    opts,
    target.agentId,
  );
}
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) return (await readSqliteMessageRecords(target)).length;
  return await readSessionMessageCountAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    target.agentId,
  );
}
/** Reads recent messages with total-count metadata asynchronously through the reader seam. */
async function readRecentSessionMessagesWithStatsAsync(scope, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) {
    const records = await readSqliteMessageRecords(target);
    const recentRecords = await readRecentSqliteMessageRecords(target, opts);
    if (
      records.length === 0 &&
      recentRecords.length === 0 &&
      opts.allowResetArchiveFallback === true
    )
      return await readRecentSessionMessagesWithStatsAsync$1(
        target.sessionId,
        target.storePath,
        void 0,
        {
          ...opts,
          resetArchiveOnly: true,
        },
        target.agentId,
      );
    return {
      messages: recentRecords.map(sqliteRecordMessageWithSeq),
      totalMessages: records.length,
      transcriptPath: target.sessionFile,
    };
  }
  return await readRecentSessionMessagesWithStatsAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    opts,
    target.agentId,
  );
}
/** Reads one offset page with total-count metadata through the reader seam. */
async function readSessionMessagesPageWithStatsAsync(scope, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) {
    const records = await readSqliteMessageRecords(target);
    if (records.length === 0 && opts.allowResetArchiveFallback === true)
      return await readSessionMessagesPageWithStatsAsync$1(
        target.sessionId,
        target.storePath,
        void 0,
        {
          ...opts,
          resetArchiveOnly: true,
        },
        target.agentId,
      );
    const totalMessages = records.length;
    const offset = Math.min(
      Math.max(0, Math.floor(Number.isFinite(opts.offset) ? opts.offset : 0)),
      totalMessages,
    );
    const maxMessages = Math.max(
      0,
      Math.floor(Number.isFinite(opts.maxMessages) ? opts.maxMessages : 0),
    );
    const endExclusive = Math.max(0, totalMessages - offset);
    const start = Math.max(0, endExclusive - maxMessages);
    return {
      messages: records.slice(start, endExclusive).map(sqliteRecordMessageWithSeq),
      totalMessages,
      transcriptPath: target.sessionFile,
    };
  }
  return await readSessionMessagesPageWithStatsAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    opts,
    target.agentId,
  );
}
/** Reads title and preview text from a transcript through the reader seam. */
function readSessionTitleFieldsFromTranscript(scope, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) return readSqliteTitleFields(target, opts);
  return readSessionTitleFieldsFromTranscript$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    target.agentId,
    opts,
  );
}
/** Reads title and preview text asynchronously through the reader seam. */
async function readSessionTitleFieldsFromTranscriptAsync(scope, opts) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) return readSqliteTitleFields(target, opts);
  return await readSessionTitleFieldsFromTranscriptAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    target.agentId,
    opts,
  );
}
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) return readSqliteAggregateUsageSnapshot(target);
  return await readLatestSessionUsageFromTranscriptAsync$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    target.agentId,
  );
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target))
    return aggregateSqliteUsageSnapshots(readRecentSqliteUsageMessages(target, maxBytes));
  return readRecentSessionUsageFromTranscript$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    target.agentId,
    maxBytes,
  );
}
/** Reads compact session preview items through the reader seam. */
function readSessionPreviewItemsFromTranscript(scope, maxItems, maxChars) {
  const target = resolveTranscriptReadTarget(scope);
  if (isSqliteReadTarget(target)) return buildSqlitePreviewItems(target, maxItems, maxChars);
  return readSessionPreviewItemsFromTranscript$1(
    target.sessionId,
    target.storePath,
    target.sessionFile,
    target.agentId,
    maxItems,
    maxChars,
  );
}
//#endregion
export {
  countToolResults as A,
  resolveSessionHistoryTranscriptPathAsync as C,
  stripInternalMetadataForDisplay as D,
  stripEnvelopeFromMessages as E,
  stripEnvelope as O,
  readSessionMessagesAsync$1 as S,
  stripEnvelopeFromMessage as T,
  attachOpenClawTranscriptMeta as _,
  readSessionMessageByIdAsync as a,
  indexedTranscriptEntryToMessages as b,
  readSessionMessagesPageWithStatsAsync as c,
  readSessionTitleFieldsFromTranscript as d,
  readSessionTitleFieldsFromTranscriptAsync as f,
  visitSessionMessagesAsync as g,
  sqliteRecordMessageWithSeq as h,
  readRecentSessionUsageFromTranscript as i,
  extractToolCallNames as j,
  stripMessageIdHints as k,
  readSessionMessagesWithSourceAsync as l,
  resolveTranscriptReadTarget as m,
  readLatestSessionUsageFromTranscriptAsync as n,
  readSessionMessageCountAsync as o,
  readSqliteMessageRecords as p,
  readRecentSessionMessagesWithStatsAsync as r,
  readSessionMessagesAsync as s,
  isSqliteReadTarget as t,
  readSessionPreviewItemsFromTranscript as u,
  capArrayByJsonBytes as v,
  readSessionTranscriptIndex as w,
  readSessionMessages as x,
  findExistingTranscriptPath as y,
};
