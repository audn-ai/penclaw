import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  n as extractAssistantVisibleText,
  r as extractFirstTextBlock,
} from "./chat-message-content-CeBHi_A4.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  i as resolveSessionFilePathOptions,
  l as resolveStorePath,
  n as resolveDefaultSessionStorePath,
  r as resolveSessionFilePath,
} from "./paths-TfuVT-K8.js";
import {
  C as loadTranscriptEvents,
  L as readLatestTranscriptAssistantText,
  S as loadSessionEntry,
  Wt as redactTranscriptMessage,
  at as updateSessionEntry,
  j as persistSessionTranscriptTurn,
  st as upsertSessionEntry,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  n as parseSqliteSessionFileMarker,
  t as formatSqliteSessionFileMarker,
} from "./sqlite-marker-BejbySI1.js";
import { _t as resolveSessionStoreEntry } from "./store-CzZJhTF6.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-BUJrk10q.js";
import {
  c as isTranscriptOnlyOpenClawAssistantModel,
  n as OPENCLAW_TRANSCRIPT_ARTIFACT_API,
  r as OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER,
  t as OPENCLAW_DELIVERY_MIRROR_MODEL,
} from "./transcript-only-openclaw-assistant-BDZ_IroQ.js";
import {
  l as selectSessionTranscriptTreePathNodes,
  s as scanSessionTranscriptTree,
} from "./transcript-tree-DuZTyiYZ.js";
//#region src/config/sessions/transcript-assistant-message.ts
function applyBeforeMessageWriteToAssistant(params) {
  if (!params.beforeMessageWrite) return params.message;
  const nextMessage = params.beforeMessageWrite({
    message: params.message,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    sessionKey: params.sessionKey,
  });
  if (nextMessage?.role !== "assistant") return;
  return {
    ...nextMessage,
    ...(params.explicitIdempotencyKey ? { idempotencyKey: params.explicitIdempotencyKey } : {}),
  };
}
//#endregion
//#region src/config/sessions/transcript-recent-window.ts
function normalizeTranscriptTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function isWithinTranscriptWindow(timestamp, options) {
  return (
    (options.beforeTimestampMs === void 0 ||
      timestamp === void 0 ||
      timestamp < options.beforeTimestampMs) &&
    (options.minTimestampMs === void 0 ||
      timestamp === void 0 ||
      timestamp >= options.minTimestampMs)
  );
}
function normalizeRecentTranscriptLimit(limit) {
  return Math.max(1, Math.floor(limit ?? 10));
}
function readPreferredUpstreamUserText(message) {
  const meta =
    message["__openclaw"] && typeof message["__openclaw"] === "object"
      ? message["__openclaw"]
      : void 0;
  if (typeof meta?.upstreamUserText === "string") return meta.upstreamUserText.trim();
  return meta?.mirrorOrigin ? null : void 0;
}
//#endregion
//#region src/config/sessions/file-range.ts
async function readFileRangeAsync(fileHandle, position, length) {
  const buffer = Buffer.alloc(length);
  let offset = 0;
  while (offset < length) {
    const { bytesRead } = await fileHandle.read(buffer, offset, length - offset, position + offset);
    if (bytesRead <= 0) break;
    offset += bytesRead;
  }
  return offset === length ? buffer : buffer.subarray(0, offset);
}
//#endregion
//#region src/config/sessions/transcript-stream.ts
const DEFAULT_REVERSE_CHUNK_BYTES = 64 * 1024;
const MAX_REVERSE_CHUNK_BYTES = 1024 * 1024;
const MIN_REVERSE_CHUNK_BYTES = 1024;
/**
 * Stream the non-empty, trimmed JSONL lines of a transcript file in order.
 *
 * Returns an empty async iterator if the file does not exist, is empty, or is
 * not a regular file. Honours `options.signal` between lines so long scans can
 * cooperate with abort signals.
 */
async function* streamSessionTranscriptLines(filePath, options = {}) {
  let stat;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return;
  }
  if (!stat.isFile() || stat.size <= 0) return;
  if (options.signal?.aborted) return;
  const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  try {
    for await (const line of rl) {
      if (options.signal?.aborted) return;
      const trimmed = line.trim();
      if (!trimmed) continue;
      yield trimmed;
    }
  } finally {
    rl.close();
    stream.destroy();
  }
}
/**
 * Stream the non-empty, trimmed JSONL lines of a transcript file in reverse
 * (newest-first) order.
 *
 * Returns an empty async iterator if the file cannot be opened, is empty, or is
 * not a regular file. The implementation splits on newline bytes before UTF-8
 * decoding so multibyte characters survive arbitrary chunk boundaries.
 */
async function* streamSessionTranscriptLinesReverse(filePath, options = {}) {
  const requestedChunkBytes = Number.isFinite(options.chunkBytes)
    ? Math.max(MIN_REVERSE_CHUNK_BYTES, Math.floor(options.chunkBytes))
    : DEFAULT_REVERSE_CHUNK_BYTES;
  const chunkBytes = Math.min(requestedChunkBytes, MAX_REVERSE_CHUNK_BYTES);
  let fileHandle;
  try {
    fileHandle = await fs.promises.open(filePath, "r");
  } catch {
    return;
  }
  try {
    const stat = await fileHandle.stat();
    if (!stat.isFile() || stat.size <= 0 || options.signal?.aborted) return;
    let position = stat.size;
    let carry = Buffer.alloc(0);
    while (position > 0) {
      if (options.signal?.aborted) return;
      const readLength = Math.min(position, chunkBytes);
      position -= readLength;
      const chunk = await readFileRangeAsync(fileHandle, position, readLength);
      const combined = carry.length > 0 ? Buffer.concat([chunk, carry]) : chunk;
      let lineEnd = combined.length;
      for (let index = combined.length - 1; index >= 0; index -= 1) {
        if (combined[index] !== 10) continue;
        const line = decodeTrimmedLine(combined.subarray(index + 1, lineEnd));
        if (line) {
          yield line;
          if (options.signal?.aborted) return;
        }
        lineEnd = index;
      }
      carry = combined.subarray(0, lineEnd);
    }
    const firstLine = decodeTrimmedLine(carry);
    if (firstLine && !options.signal?.aborted) yield firstLine;
  } finally {
    await fileHandle.close().catch(() => void 0);
  }
}
function decodeTrimmedLine(line) {
  return line.toString("utf-8").trim();
}
//#endregion
//#region src/config/sessions/session-file.ts
/** Resolves the active SQLite transcript marker and persists it into the session store when needed. */
async function resolveAndPersistSessionFile(params) {
  const { sessionId, sessionKey, sessionStore, storePath } = params;
  const now = Date.now();
  const baseEntry = params.sessionEntry ??
    sessionStore[sessionKey] ?? {
      sessionId,
      updatedAt: now,
      sessionStartedAt: now,
    };
  const sessionFile = formatSqliteSessionFileMarker({
    agentId: normalizeAgentId(params.agentId),
    sessionId,
    storePath,
  });
  const persistedEntry = {
    ...baseEntry,
    sessionId,
    updatedAt: now,
    sessionStartedAt: baseEntry.sessionId === sessionId ? (baseEntry.sessionStartedAt ?? now) : now,
    sessionFile,
  };
  if (baseEntry.sessionId !== sessionId || baseEntry.sessionFile !== sessionFile) {
    sessionStore[sessionKey] = persistedEntry;
    await upsertSessionEntry(
      {
        storePath,
        sessionKey,
      },
      persistedEntry,
    );
    return {
      sessionFile,
      sessionEntry: persistedEntry,
    };
  }
  sessionStore[sessionKey] = persistedEntry;
  return {
    sessionFile,
    sessionEntry: persistedEntry,
  };
}
//#endregion
//#region src/config/sessions/transcript-file-resolve.ts
/**
 * Resolves the transcript file for a session and persists the resolved target
 * when the caller supplies the owning session store.
 */
async function resolveSessionTranscriptFile(params) {
  const sessionPathOpts = resolveSessionFilePathOptions({
    agentId: params.agentId,
    storePath: params.storePath,
  });
  let sessionFile = resolveSessionFilePath(params.sessionId, params.sessionEntry, sessionPathOpts);
  let sessionEntry = params.sessionEntry;
  if (params.sessionStore && params.storePath) {
    const resolvedSessionFile = await resolveAndPersistSessionFile({
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionStore: params.sessionStore,
      storePath: params.storePath,
      sessionEntry,
      agentId: sessionPathOpts?.agentId,
    });
    sessionFile = resolvedSessionFile.sessionFile;
    sessionEntry = resolvedSessionFile.sessionEntry;
  }
  return {
    sessionFile,
    sessionEntry,
  };
}
//#endregion
//#region src/config/sessions/transcript.ts
function parseAssistantTranscriptText(line, options) {
  const parsed = JSON.parse(line);
  const message = parsed.message;
  if (!message || message.role !== "assistant") return;
  if (
    options?.excludeTranscriptOnlyOpenClawAssistant &&
    isTranscriptOnlyOpenClawAssistantMessage(message)
  )
    return;
  const text = extractAssistantVisibleText(message)?.trim();
  if (!text) return;
  return {
    ...(typeof parsed.id === "string" && parsed.id ? { id: parsed.id } : {}),
    text,
    ...(typeof message.timestamp === "number" && Number.isFinite(message.timestamp)
      ? { timestamp: message.timestamp }
      : {}),
  };
}
function isTranscriptOnlyOpenClawAssistantMessage(message) {
  return isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model);
}
function parseRecentConversationText(line, options = {}) {
  const parsed = JSON.parse(line);
  const message = parsed.message;
  if (
    !message ||
    (message.role !== "user" && message.role !== "assistant") ||
    (options.role && message.role !== options.role)
  )
    return;
  if (message.role === "assistant" && isTranscriptOnlyOpenClawAssistantMessage(message)) return;
  const upstreamUserText =
    options.preferUpstreamUserText && message.role === "user"
      ? readPreferredUpstreamUserText(message)
      : void 0;
  if (upstreamUserText === null) return;
  const text =
    message.role === "assistant"
      ? extractAssistantVisibleText(message)
      : (upstreamUserText ?? extractFirstTextBlock(message)?.trim());
  if (!text) return;
  const provenance =
    message.provenance && typeof message.provenance === "object" ? message.provenance : void 0;
  return {
    ...(typeof parsed.id === "string" && parsed.id ? { id: parsed.id } : {}),
    role: message.role,
    text,
    ...(normalizeTranscriptTimestamp(message.timestamp) !== void 0
      ? { timestamp: normalizeTranscriptTimestamp(message.timestamp) }
      : {}),
    ...(typeof provenance?.sourceChannel === "string" && provenance.sourceChannel.trim()
      ? { sourceChannel: provenance.sourceChannel.trim() }
      : {}),
  };
}
async function readRecentUserAssistantTextFromSqliteTranscript(scope, options = {}) {
  return (await readRecentUserAssistantTextFromSqliteTranscriptWithPresence(scope, options)).recent;
}
async function readRecentUserAssistantTextFromSqliteTranscriptWithPresence(scope, options = {}) {
  const events = await loadTranscriptEvents({
    agentId: scope.agentId,
    sessionId: scope.sessionId,
    storePath: scope.storePath,
  });
  const limit = normalizeRecentTranscriptLimit(options.limit);
  const recent = [];
  for (const event of events.toReversed()) {
    const entry = parseRecentConversationText(JSON.stringify(event), options);
    if (!entry) continue;
    if (!isWithinTranscriptWindow(entry.timestamp, options)) continue;
    recent.push(entry);
    if (recent.length >= limit) break;
  }
  return {
    recent: recent.toReversed(),
    hasEvents: events.length > 0,
  };
}
function resolveSessionConversationTranscriptTarget(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return {};
  const agentId = params.agentId ?? resolveAgentIdFromSessionKey(sessionKey) ?? "main";
  const storePath = params.storePath ?? resolveDefaultSessionStorePath(agentId);
  const entry = loadSessionEntry({
    agentId,
    sessionKey,
    storePath,
  });
  if (!entry?.sessionId) return {};
  return {
    sessionFile: resolveSessionFilePath(entry.sessionId, entry, {
      sessionsDir: path.dirname(storePath),
      agentId,
    }),
    sqliteScope: {
      agentId,
      sessionId: entry.sessionId,
      storePath,
    },
  };
}
async function readRecentUserAssistantTextFromSessionTranscript(sessionFile, options = {}) {
  const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
  if (sqliteMarker)
    return await readRecentUserAssistantTextFromSqliteTranscript(sqliteMarker, options);
  if (!sessionFile?.trim()) return [];
  const limit = normalizeRecentTranscriptLimit(options.limit);
  const recent = [];
  for await (const line of streamSessionTranscriptLinesReverse(sessionFile))
    try {
      const entry = parseRecentConversationText(line, options);
      if (!entry) continue;
      if (!isWithinTranscriptWindow(entry.timestamp, options)) continue;
      recent.push(entry);
      if (recent.length >= limit) break;
    } catch {
      continue;
    }
  return recent.toReversed();
}
async function readRecentUserAssistantTextForSession(params) {
  const target = resolveSessionConversationTranscriptTarget(params);
  if (target.sqliteScope)
    return (
      await readRecentUserAssistantTextFromSqliteTranscriptWithPresence(target.sqliteScope, params)
    ).recent;
  return await readRecentUserAssistantTextFromSessionTranscript(target.sessionFile, params);
}
async function readLatestAssistantTextFromSessionTranscript(sessionFile) {
  const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
  if (sqliteMarker)
    return readLatestTranscriptAssistantText({
      agentId: sqliteMarker.agentId,
      sessionId: sqliteMarker.sessionId,
      storePath: sqliteMarker.storePath,
    });
  if (!sessionFile?.trim()) return;
  for await (const line of streamSessionTranscriptLinesReverse(sessionFile))
    try {
      const assistantText = parseAssistantTranscriptText(line, {
        excludeTranscriptOnlyOpenClawAssistant: true,
      });
      if (assistantText) return assistantText;
    } catch {
      continue;
    }
}
async function readTailAssistantTextFromSessionTranscript(sessionFile, options) {
  const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
  if (sqliteMarker) {
    const events = await loadTranscriptEvents({
      agentId: sqliteMarker.agentId,
      sessionId: sqliteMarker.sessionId,
      storePath: sqliteMarker.storePath,
    });
    for (const event of events.toReversed()) {
      const parsed = event;
      if (!parsed.message || typeof parsed.message !== "object") continue;
      if (parsed.message.role !== "assistant") return;
      const assistantText = parseAssistantTranscriptText(JSON.stringify(event), {
        excludeTranscriptOnlyOpenClawAssistant:
          options?.excludeTranscriptOnlyOpenClawAssistant === true,
      });
      if (assistantText) return assistantText;
      if (
        options?.excludeTranscriptOnlyOpenClawAssistant !== true ||
        !isTranscriptOnlyOpenClawAssistantMessage(parsed.message)
      )
        return;
    }
    return;
  }
  if (!sessionFile?.trim()) return;
  for await (const line of streamSessionTranscriptLinesReverse(sessionFile))
    try {
      const parsed = JSON.parse(line);
      if (!parsed.message || typeof parsed.message !== "object") continue;
      const assistantText = parseAssistantTranscriptText(line, options);
      if (assistantText) return assistantText;
      if (
        options?.excludeTranscriptOnlyOpenClawAssistant === true &&
        isTranscriptOnlyOpenClawAssistantMessage(parsed.message)
      )
        continue;
      return;
    } catch {
      continue;
    }
}
async function appendAssistantMessageToSessionTranscript(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey)
    return {
      ok: false,
      reason: "missing sessionKey",
    };
  const mirrorText = resolveMirroredTranscriptText({
    text: params.text,
    mediaUrls: params.mediaUrls,
  });
  if (!mirrorText)
    return {
      ok: false,
      reason: "empty text",
    };
  return appendExactAssistantMessageToSessionTranscript({
    agentId: params.agentId,
    sessionKey,
    ...(params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {}),
    ...(params.expectedLifecycleRevision
      ? { expectedLifecycleRevision: params.expectedLifecycleRevision }
      : {}),
    ...(params.expectedSessionState ? { expectedSessionState: params.expectedSessionState } : {}),
    storePath: params.storePath,
    idempotencyKey: params.idempotencyKey,
    updateMode: params.updateMode,
    config: params.config,
    ...(params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}),
    message: {
      role: "assistant",
      content: [
        {
          type: "text",
          text: mirrorText,
        },
      ],
      api: OPENCLAW_TRANSCRIPT_ARTIFACT_API,
      provider: OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER,
      model: OPENCLAW_DELIVERY_MIRROR_MODEL,
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
      stopReason: "stop",
      timestamp: Date.now(),
      ...(params.deliveryMirror ? { openclawDeliveryMirror: params.deliveryMirror } : {}),
    },
  });
}
async function appendExactAssistantMessageToSessionTranscript(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey)
    return {
      ok: false,
      reason: "missing sessionKey",
    };
  if (params.message.role !== "assistant")
    return {
      ok: false,
      reason: "message role must be assistant",
    };
  const explicitAgentId = params.agentId?.trim() || void 0;
  const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
  const transcriptAgentId = explicitAgentId ?? sessionAgentId;
  const storeAgentId = transcriptAgentId ?? resolveAgentIdFromSessionKey(sessionKey);
  const storePath =
    params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId: storeAgentId });
  const resolved = resolveSessionStoreEntry({
    store: Object.fromEntries(
      listSessionEntries({
        agentId: transcriptAgentId,
        storePath,
      }).map(({ sessionKey: entryKey, entry }) => [entryKey, entry]),
    ),
    sessionKey,
  });
  const entry = resolved.existing;
  if (params.expectedSessionId && entry?.sessionId !== params.expectedSessionId)
    return {
      ok: false,
      code: "session-rebound",
      reason: `session rebound for sessionKey: ${sessionKey}`,
    };
  if (
    params.expectedLifecycleRevision !== void 0 &&
    entry?.lifecycleRevision !== params.expectedLifecycleRevision
  )
    return {
      ok: false,
      code: "session-rebound",
      reason: `session rebound for sessionKey: ${sessionKey}`,
    };
  if (!entry?.sessionId)
    return {
      ok: false,
      reason: `unknown sessionKey: ${sessionKey}`,
    };
  const appendToSessionFile = async (currentEntry, sessionFile) => {
    const explicitIdempotencyKey = params.idempotencyKey ?? params.message.idempotencyKey;
    const message = {
      ...params.message,
      ...(explicitIdempotencyKey ? { idempotencyKey: explicitIdempotencyKey } : {}),
    };
    const preparedUnkeyedMessage =
      !explicitIdempotencyKey && params.beforeMessageWrite
        ? applyBeforeMessageWriteToAssistant({
            message,
            beforeMessageWrite: params.beforeMessageWrite,
            agentId: transcriptAgentId,
            sessionKey: resolved.normalizedKey,
          })
        : message;
    if (!preparedUnkeyedMessage)
      return {
        ok: false,
        code: "blocked",
        reason: "blocked by before_message_write",
      };
    const identifiedDeliveryMirror =
      Boolean(explicitIdempotencyKey) && isIdentifiedDeliveryMirror(params.message);
    let latestEquivalentAssistantId;
    const turn = await persistSessionTranscriptTurn(
      {
        sessionId: currentEntry.sessionId,
        sessionKey: resolved.normalizedKey,
        storePath,
        ...(sessionFile ? { sessionFile } : {}),
        ...(transcriptAgentId ? { agentId: transcriptAgentId } : {}),
      },
      {
        cwd: currentEntry.spawnedCwd,
        ...(params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {}),
        ...(params.expectedLifecycleRevision !== void 0
          ? { expectedLifecycleRevision: params.expectedLifecycleRevision }
          : {}),
        ...(params.expectedSessionState
          ? { expectedSessionState: params.expectedSessionState }
          : {}),
        ...(params.config ? { config: params.config } : {}),
        updateMode: params.updateMode ?? "inline",
        touchSessionEntry: true,
        messages: [
          {
            message: preparedUnkeyedMessage,
            ...(explicitIdempotencyKey ? { idempotencyLookup: "scan" } : {}),
            ...(explicitIdempotencyKey && params.beforeMessageWrite
              ? {
                  prepareMessageAfterIdempotencyCheck: (candidate) =>
                    applyBeforeMessageWriteToAssistant({
                      message: candidate,
                      beforeMessageWrite: params.beforeMessageWrite,
                      explicitIdempotencyKey,
                      agentId: transcriptAgentId,
                      sessionKey: resolved.normalizedKey,
                    }),
                }
              : {}),
            shouldAppend: async (target) => {
              latestEquivalentAssistantId =
                isRedundantDeliveryMirror(params.message) && !identifiedDeliveryMirror
                  ? await findLatestEquivalentAssistantMessageId(
                      target,
                      preparedUnkeyedMessage,
                      params.config,
                    )
                  : void 0;
              return !latestEquivalentAssistantId;
            },
          },
        ],
      },
    );
    if (turn.rejectedReason === "session-rebound")
      return {
        ok: false,
        code: "session-rebound",
        reason: `session rebound for sessionKey: ${sessionKey}`,
      };
    if (latestEquivalentAssistantId)
      return {
        ok: true,
        sessionFile: turn.sessionFile,
        messageId: latestEquivalentAssistantId,
      };
    const appendedResult = turn.messages[0];
    if (!appendedResult)
      return {
        ok: false,
        code: "blocked",
        reason: "blocked by before_message_write",
      };
    const { messageId } = appendedResult;
    if (!params.expectedSessionId)
      try {
        if (parseSqliteSessionFileMarker(turn.sessionFile))
          await touchSqliteAssistantAppendSessionEntry({
            agentId: transcriptAgentId,
            currentEntry,
            sessionFile: turn.sessionFile,
            sessionKey: resolved.normalizedKey,
            storePath,
          });
        else
          return {
            ok: false,
            reason: `unexpected transcript target: ${turn.sessionFile}`,
          };
      } catch (err) {
        return {
          ok: false,
          reason: formatErrorMessage(err),
        };
      }
    return {
      ok: true,
      sessionFile: turn.sessionFile,
      messageId,
    };
  };
  let result;
  if (params.expectedSessionId) result = await appendToSessionFile(entry);
  else result = await appendToSessionFile(entry);
  return result;
}
async function touchSqliteAssistantAppendSessionEntry(params) {
  const now = Date.now();
  const buildPatch = (entry) => ({
    updatedAt: Math.max(entry?.updatedAt ?? 0, now),
    sessionStartedAt: entry?.sessionStartedAt ?? params.currentEntry.sessionStartedAt ?? now,
    sessionFile: params.sessionFile,
  });
  await updateSessionEntry(
    {
      agentId: params.agentId,
      sessionKey: params.sessionKey,
      storePath: params.storePath,
    },
    (entry) => {
      if (entry.sessionId !== params.currentEntry.sessionId) return null;
      return buildPatch(entry);
    },
  );
}
function isRedundantDeliveryMirror(message) {
  return message.provider === "openclaw" && message.model === "delivery-mirror";
}
async function readLatestVisibleTranscriptMessage(scope) {
  const events = await loadTranscriptEvents(scope).catch(() => []);
  const tree = scanSessionTranscriptTree(events);
  const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
  const visibleEvents =
    visiblePath.length > 0
      ? visiblePath.map((node) => node.entry)
      : tree.hasLeafControl
        ? []
        : events;
  for (const event of visibleEvents.toReversed()) {
    if (!event || typeof event !== "object" || Array.isArray(event)) continue;
    const record = event;
    if (record.message === void 0) continue;
    return {
      ...(typeof record.id === "string" ? { id: record.id } : {}),
      message: record.message,
    };
  }
}
function isIdentifiedDeliveryMirror(message) {
  const marker = message.openclawDeliveryMirror;
  return (
    isRedundantDeliveryMirror(message) &&
    (marker?.kind === "channel-final" || marker?.kind === "channel-final-suppressed")
  );
}
function extractAssistantMessageText(message) {
  if (!Array.isArray(message.content)) return null;
  const parts = message.content
    .filter(
      (part) =>
        part.type === "text" && typeof part.text === "string" && part.text.trim().length > 0,
    )
    .map((part) => part.text.trim());
  return parts.length > 0 ? parts.join("\n").trim() : null;
}
async function findLatestEquivalentAssistantMessageId(target, message, config) {
  const expectedText = extractAssistantMessageText(redactTranscriptMessage(message, config));
  if (!expectedText) return;
  if (target.storePath && target.sessionId) {
    const latest = await readLatestVisibleTranscriptMessage({
      ...(target.agentId ? { agentId: target.agentId } : {}),
      sessionId: target.sessionId,
      ...(target.sessionKey ? { sessionKey: target.sessionKey } : {}),
      storePath: target.storePath,
    });
    if (latest?.message?.role !== "assistant") return;
    return (latest
      ? extractAssistantMessageText(redactTranscriptMessage(latest.message, config))
      : void 0) === expectedText
      ? latest?.id
      : void 0;
  }
  for await (const line of streamSessionTranscriptLinesReverse(target.sessionFile))
    try {
      const parsed = JSON.parse(line);
      const candidate = parsed.message;
      if (!candidate) continue;
      if (candidate.role !== "assistant") return;
      if (extractAssistantMessageText(redactTranscriptMessage(candidate, config)) !== expectedText)
        return;
      if (typeof parsed.id === "string" && parsed.id) return parsed.id;
      return;
    } catch {
      continue;
    }
}
//#endregion
export {
  readTailAssistantTextFromSessionTranscript as a,
  streamSessionTranscriptLines as c,
  readRecentUserAssistantTextForSession as i,
  readFileRangeAsync as l,
  appendExactAssistantMessageToSessionTranscript as n,
  resolveSessionTranscriptFile as o,
  readLatestAssistantTextFromSessionTranscript as r,
  resolveAndPersistSessionFile as s,
  appendAssistantMessageToSessionTranscript as t,
};
