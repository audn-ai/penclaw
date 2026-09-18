import { createReadStream, readFileSync, statSync } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import "../../number-runtime-B-n-wjMn.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import path from "node:path";
import process$1 from "node:process";
import { t as tryDispatchAcpReplyHook } from "../../acp-runtime-backend-BDpy5Nbx.js";
import "../../config-schema-B4teWnv2.js";
import { r as resolveExecutableFromPathEnv } from "../../executable-path-BP9CqJ6T.js";
import {
  n as runNodePtyCommand,
  t as decodeNodePtyResumeParams,
} from "../../node-host-Bq0uyz7u.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "../../number-coercion-CJQ8TR--.js";
import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import { t as createAcpxRuntimeService } from "../../register.runtime-BY8BCVP-.js";
//#region extensions/acpx/src/pi-session-paths.ts
function optionalString$1(value, maxLength) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= maxLength ? trimmed : void 0;
}
function piHome(env) {
  return (
    (process.platform === "win32" ? env.USERPROFILE?.trim() : env.HOME?.trim()) || os.homedir()
  );
}
function isPiSessionCatalogPathAbsolute(value, platform = process.platform) {
  if (platform !== "win32") return path.posix.isAbsolute(value);
  const root = path.win32.parse(value).root;
  return path.win32.isAbsolute(value) && root !== "\\" && root !== "/";
}
function resolveConfiguredPath(value, env, relativeBase) {
  const home = piHome(env);
  let resolved = value;
  if (value === "~") resolved = home;
  if (value.startsWith("~/") || value.startsWith("~\\")) resolved = path.join(home, value.slice(2));
  if (!isPiSessionCatalogPathAbsolute(resolved)) {
    if (relativeBase) return path.resolve(relativeBase, resolved);
    throw new Error("Pi session catalog requires absolute or home-relative storage paths");
  }
  return path.resolve(resolved);
}
function settingsSessionDir(file) {
  try {
    const value = JSON.parse(readFileSync(file, "utf8"));
    return isRecord(value) ? optionalString$1(value.sessionDir, 4096) : void 0;
  } catch {
    return;
  }
}
function piSessionStore(env, cwd = process.cwd()) {
  const customSessionDir = env.PI_CODING_AGENT_SESSION_DIR?.trim();
  if (customSessionDir)
    return {
      root: resolveConfiguredPath(customSessionDir, env),
      flat: true,
    };
  const home = piHome(env);
  const customAgentDir = env.PI_CODING_AGENT_DIR?.trim();
  const agentDir = customAgentDir
    ? resolveConfiguredPath(customAgentDir, env)
    : path.join(home, ".pi", "agent");
  const projectSessionDir = settingsSessionDir(path.join(cwd, ".pi", "settings.json"));
  if (projectSessionDir)
    return {
      root: resolveConfiguredPath(projectSessionDir, env, path.join(cwd, ".pi")),
      flat: true,
    };
  const globalSessionDir = settingsSessionDir(path.join(agentDir, "settings.json"));
  if (globalSessionDir)
    return {
      root: resolveConfiguredPath(globalSessionDir, env, agentDir),
      flat: true,
    };
  return {
    root: path.join(agentDir, "sessions"),
    flat: false,
  };
}
function piSessionStoreAvailable(env) {
  try {
    return statSync(piSessionStore(env).root).isDirectory();
  } catch {
    return false;
  }
}
//#endregion
//#region extensions/acpx/src/pi-session-store.ts
const MAX_DISCOVERY_FILES = 1e4;
const SUMMARY_SCAN_BATCH_SIZE = 100;
const MAX_SUMMARY_CACHE_ENTRIES = 256;
const MAX_SESSION_BYTES = 32 * 1024 * 1024;
const MAX_SUMMARY_LINE_BYTES = 1024 * 1024;
const APPEND_PROOF_EDGE_BYTES = 64 * 1024;
const IO_CONCURRENCY = 8;
const SESSION_ID_PATTERN$2 = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
const summaryCache = /* @__PURE__ */ new Map();
const threadFileCache = /* @__PURE__ */ new Map();
function threadCacheKey(storeRoot, threadId) {
  return `${storeRoot}\0${threadId}`;
}
function forgetCachedSummary(file) {
  const cached = summaryCache.get(file);
  const threadId = cached?.summary?.threadId;
  if (cached && threadId) {
    const key = threadCacheKey(cached.storeRoot, threadId);
    if (threadFileCache.get(key) === file) threadFileCache.delete(key);
  }
  summaryCache.delete(file);
}
function cacheSummary(file, value) {
  forgetCachedSummary(file);
  summaryCache.set(file, value);
  while (summaryCache.size > MAX_SUMMARY_CACHE_ENTRIES) {
    const oldest = summaryCache.keys().next().value;
    if (typeof oldest !== "string") break;
    forgetCachedSummary(oldest);
  }
}
function optionalString(value, maxLength) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= maxLength ? trimmed : void 0;
}
async function discoverPiSessionFiles(env) {
  const store = piSessionStore(env);
  let entries;
  try {
    entries = await fs$1.readdir(store.root, { withFileTypes: true });
  } catch {
    return {
      root: store.root,
      files: [],
    };
  }
  if (store.flat)
    return {
      root: store.root,
      files: entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
        .slice(0, MAX_DISCOVERY_FILES)
        .map((entry) => path.join(store.root, entry.name)),
    };
  const files = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || files.length >= MAX_DISCOVERY_FILES) continue;
    const directory = path.join(store.root, entry.name);
    let children;
    try {
      children = await fs$1.readdir(directory, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const child of children)
      if (child.isFile() && child.name.endsWith(".jsonl")) {
        files.push(path.join(directory, child.name));
        if (files.length >= MAX_DISCOVERY_FILES) break;
      }
  }
  return {
    root: store.root,
    files,
  };
}
async function mapConcurrent(values, limit, mapper) {
  const results = [];
  results.length = values.length;
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index]);
    }
  });
  await Promise.all(workers);
  return results;
}
async function piFileCandidates(env) {
  const { root, files } = await discoverPiSessionFiles(env);
  return (
    await mapConcurrent(files, IO_CONCURRENCY, async (file) => {
      try {
        const stats = await fs$1.stat(file);
        return stats.isFile()
          ? {
              file,
              storeRoot: root,
              identity: `${String(stats.dev)}:${String(stats.ino)}:${String(stats.birthtimeMs)}`,
              mtimeMs: stats.mtimeMs,
              size: stats.size,
            }
          : void 0;
      } catch {
        return;
      }
    })
  )
    .filter((candidate) => candidate !== void 0)
    .toSorted((left, right) => right.mtimeMs - left.mtimeMs);
}
function parsePiJsonLines(content) {
  return content.split(/\r?\n/u).flatMap((line) => {
    if (!line.trim()) return [];
    try {
      const value = JSON.parse(line);
      return isRecord(value) ? [value] : [];
    } catch {
      return [];
    }
  });
}
function textFromContent$1(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .flatMap((part) =>
      isRecord(part) && part.type === "text" && typeof part.text === "string" ? [part.text] : [],
    )
    .join("\n");
}
function timestampMs$1(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? void 0 : parsed;
  }
}
function processSummaryLine(state, line) {
  const entry = parsePiJsonLines(
    (line.at(-1) === 13 ? line.subarray(0, -1) : line).toString("utf8"),
  )[0];
  if (!entry) return;
  if (!state.header) {
    if (entry.type !== "session") {
      state.invalid = true;
      return;
    }
    state.header = entry;
    return;
  }
  if (entry.type === "session_info") state.name = optionalString(entry.name, 1e3);
  else if (
    !state.firstMessage &&
    entry.type === "message" &&
    isRecord(entry.message) &&
    entry.message.role === "user"
  )
    state.firstMessage = optionalString(textFromContent$1(entry.message.content), 1e3);
}
function appendSummaryBytes(state, bytes) {
  if (state.discarding || bytes.length === 0) return;
  if (state.pending.length + bytes.length > MAX_SUMMARY_LINE_BYTES) {
    state.pending = Buffer.alloc(0);
    state.discarding = true;
    return;
  }
  state.pending =
    state.pending.length === 0 ? Buffer.from(bytes) : Buffer.concat([state.pending, bytes]);
}
async function scanSummaryAppend(candidate, start, state) {
  if (start >= candidate.size || state.invalid) return;
  const stream = createReadStream(candidate.file, {
    start,
    end: candidate.size - 1,
  });
  for await (const value of stream) {
    const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
    let offset = 0;
    while (offset < chunk.length) {
      const newline = chunk.indexOf(10, offset);
      const end = newline < 0 ? chunk.length : newline;
      appendSummaryBytes(state, chunk.subarray(offset, end));
      if (newline < 0) break;
      if (!state.discarding) processSummaryLine(state, state.pending);
      state.pending = Buffer.alloc(0);
      state.discarding = false;
      if (state.invalid) return;
      offset = newline + 1;
    }
  }
}
async function readAppendProof(file, size) {
  const length = Math.min(size, APPEND_PROOF_EDGE_BYTES);
  if (length === 0)
    return {
      head: Buffer.alloc(0),
      tail: Buffer.alloc(0),
    };
  const handle = await fs$1.open(file, "r");
  try {
    const head = Buffer.alloc(length);
    const tail = Buffer.alloc(length);
    const [headRead, tailRead] = await Promise.all([
      handle.read(head, 0, length, 0),
      handle.read(tail, 0, length, size - length),
    ]);
    return {
      head: head.subarray(0, headRead.bytesRead),
      tail: tail.subarray(0, tailRead.bytesRead),
    };
  } finally {
    await handle.close();
  }
}
async function cachedPrefixIsUnchanged(candidate, cached) {
  if (cached.identity !== candidate.identity || cached.size >= candidate.size) return false;
  const current = await readAppendProof(candidate.file, cached.size);
  return (
    current.head.equals(cached.appendProof.head) && current.tail.equals(cached.appendProof.tail)
  );
}
async function readPiSessionSummary(candidate) {
  const cached = summaryCache.get(candidate.file);
  if (cached?.mtimeMs === candidate.mtimeMs && cached.size === candidate.size) {
    summaryCache.delete(candidate.file);
    summaryCache.set(candidate.file, cached);
    return cached.summary;
  }
  let summary;
  let scanState;
  let appendProof;
  try {
    const resumable =
      cached && (await cachedPrefixIsUnchanged(candidate, cached)) ? cached : void 0;
    scanState = resumable
      ? {
          ...resumable.scanState,
          pending: Buffer.from(resumable.scanState.pending),
        }
      : {
          pending: Buffer.alloc(0),
          discarding: false,
          invalid: false,
        };
    await scanSummaryAppend(candidate, resumable?.size ?? 0, scanState);
    appendProof = await readAppendProof(candidate.file, candidate.size);
    const projectedState = {
      ...scanState,
      pending: Buffer.from(scanState.pending),
    };
    if (!projectedState.discarding && projectedState.pending.length > 0)
      processSummaryLine(projectedState, projectedState.pending);
    const { header, name, firstMessage } = projectedState;
    const threadId = header?.type === "session" ? optionalString(header.id, 256) : void 0;
    if (header && threadId && SESSION_ID_PATTERN$2.test(threadId)) {
      const cwd = optionalString(header.cwd, 4096);
      const createdAt = timestampMs$1(header.timestamp);
      summary = {
        file: candidate.file,
        threadId,
        ...(name || firstMessage ? { name: name ?? firstMessage } : {}),
        ...(cwd ? { cwd } : {}),
        status: "stored",
        ...(createdAt !== void 0 ? { createdAt } : {}),
        updatedAt: candidate.mtimeMs,
        recencyAt: candidate.mtimeMs,
        source: "pi-cli",
        modelProvider: "pi",
        archived: false,
        canContinue: false,
        canArchive: false,
      };
    }
  } catch {
    return cached?.summary;
  }
  if (cached?.summary?.threadId && cached.summary.threadId !== summary?.threadId)
    threadFileCache.delete(threadCacheKey(cached.storeRoot, cached.summary.threadId));
  cacheSummary(candidate.file, {
    ...candidate,
    summary,
    scanState,
    appendProof,
  });
  if (summary)
    threadFileCache.set(threadCacheKey(candidate.storeRoot, summary.threadId), candidate.file);
  return summary;
}
function summaryMatches(summary, needle) {
  if (!needle) return true;
  return [summary.threadId, summary.name, summary.cwd].some((field) =>
    field?.toLocaleLowerCase().includes(needle),
  );
}
async function listPiSummaryPage(env, params) {
  const candidates = await piFileCandidates(env);
  const activeFiles = new Set(candidates.map((candidate) => candidate.file));
  for (const file of summaryCache.keys()) if (!activeFiles.has(file)) forgetCachedSummary(file);
  const target = params.offset + params.limit + 1;
  const matches = [];
  const needle = params.searchTerm?.toLocaleLowerCase();
  for (
    let index = 0;
    index < candidates.length && matches.length < target;
    index += SUMMARY_SCAN_BATCH_SIZE
  ) {
    const summaries = await mapConcurrent(
      candidates.slice(index, index + SUMMARY_SCAN_BATCH_SIZE),
      IO_CONCURRENCY,
      readPiSessionSummary,
    );
    for (const summary of summaries)
      if (summary && summaryMatches(summary, needle)) {
        matches.push(summary);
        if (matches.length >= target) break;
      }
  }
  return {
    summaries: matches.slice(params.offset, params.offset + params.limit),
    hasMore: matches.length > params.offset + params.limit,
  };
}
async function findPiSummary(threadId, env) {
  const candidates = await piFileCandidates(env);
  for (let index = 0; index < candidates.length; index += SUMMARY_SCAN_BATCH_SIZE) {
    const match = (
      await mapConcurrent(
        candidates.slice(index, index + SUMMARY_SCAN_BATCH_SIZE),
        IO_CONCURRENCY,
        readPiSessionSummary,
      )
    ).find((summary) => summary?.threadId === threadId);
    if (match) return match;
  }
}
async function readPiSessionById(threadId, env) {
  const cacheKey = threadCacheKey(piSessionStore(env).root, threadId);
  let file = threadFileCache.get(cacheKey);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!file) file = (await findPiSummary(threadId, env))?.file;
    if (!file) throw new Error("Pi session was not found");
    try {
      const stats = await fs$1.stat(file);
      if (!stats.isFile()) throw new Error("Pi session is not a file");
      if (stats.size > MAX_SESSION_BYTES)
        throw new RangeError("Pi session exceeds the 32 MiB read safety limit");
      const entries = parsePiJsonLines(await fs$1.readFile(file, "utf8"));
      if (entries[0]?.type === "session" && entries[0].id === threadId) return entries;
    } catch (error) {
      if (error instanceof RangeError) throw error;
      if (attempt > 0) throw new Error("Pi session is unavailable", { cause: error });
    }
    threadFileCache.delete(cacheKey);
    file = void 0;
  }
  throw new Error("Pi session changed during read");
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog.ts
const LOCAL_HOST_ID$1 = "gateway";
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT$1 = 100;
const MAX_SEARCH_LENGTH$1 = 500;
const MAX_CURSOR_LENGTH$1 = 128;
const MAX_TRANSCRIPT_ITEM_BYTES = 512 * 1024;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
const SESSION_ID_PATTERN$1 = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
function optionalPiString(value, maxLength) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= maxLength ? trimmed : void 0;
}
function boundedLimit(value, fallback = DEFAULT_PAGE_LIMIT) {
  if (value === void 0) return fallback;
  if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > MAX_PAGE_LIMIT$1)
    throw new Error(`limit must be an integer between 1 and ${String(MAX_PAGE_LIMIT$1)}`);
  return Number(value);
}
function encodeCursor(offset) {
  return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function decodeCursor(value) {
  if (value === void 0) return 0;
  const cursor = optionalPiString(value, MAX_CURSOR_LENGTH$1);
  if (!cursor) throw new Error("cursor is invalid");
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    if (!isRecord(parsed) || !Number.isInteger(parsed.offset) || Number(parsed.offset) < 0)
      throw new Error("invalid offset");
    return Number(parsed.offset);
  } catch (error) {
    throw new Error("cursor is invalid", { cause: error });
  }
}
function truncateUtf8(text, maxBytes) {
  if (Buffer.byteLength(text, "utf8") <= maxBytes) return text;
  let low = 0;
  let high = text.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (Buffer.byteLength(text.slice(0, middle), "utf8") <= maxBytes - 3) low = middle;
    else high = middle - 1;
  }
  const end = low > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(low - 1)) ? low - 1 : low;
  return `${text.slice(0, end)}…`;
}
function transcriptPage(items, limit, offset) {
  const end = Math.max(0, items.length - offset);
  const start = Math.max(0, end - limit);
  const page = [];
  let pageBytes = 2;
  for (let index = end - 1; index >= start; index -= 1) {
    const item = items[index];
    if (!item) continue;
    const bounded = {
      ...item,
      text: truncateUtf8(item.text ?? "", MAX_TRANSCRIPT_ITEM_BYTES),
    };
    const itemBytes = Buffer.byteLength(JSON.stringify(bounded), "utf8") + 1;
    if (page.length > 0 && pageBytes + itemBytes > MAX_TRANSCRIPT_PAGE_BYTES) break;
    page.unshift(bounded);
    pageBytes += itemBytes;
  }
  const consumed = offset + page.length;
  return {
    items: page,
    ...(consumed < items.length ? { nextCursor: encodeCursor(consumed) } : {}),
  };
}
function textFromContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .flatMap((part) => {
      if (!isRecord(part)) return [];
      if (part.type === "text" && typeof part.text === "string") return [part.text];
      if (part.type === "image") {
        const mimeType = optionalPiString(part.mimeType, 128);
        return [mimeType ? `[image: ${mimeType}]` : "[image]"];
      }
      return [];
    })
    .join("\n");
}
function timestampMs(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? void 0 : parsed;
  }
}
function parseListParams(value) {
  if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
  if (!isRecord(value)) throw new Error("Pi session list parameters must be an object");
  const unknown = Object.keys(value).find(
    (key) => !["searchTerm", "limit", "cursor"].includes(key),
  );
  if (unknown) throw new Error(`unknown Pi session list parameter: ${unknown}`);
  const searchTerm = optionalPiString(value.searchTerm, MAX_SEARCH_LENGTH$1);
  if (value.searchTerm !== void 0 && !searchTerm) throw new Error("searchTerm is invalid");
  const cursor = optionalPiString(value.cursor, MAX_CURSOR_LENGTH$1);
  if (value.cursor !== void 0 && !cursor) throw new Error("cursor is invalid");
  return {
    limit: boundedLimit(value.limit),
    ...(searchTerm ? { searchTerm } : {}),
    ...(cursor ? { cursor } : {}),
  };
}
function parseReadParams(value) {
  if (!isRecord(value)) throw new Error("Pi session read parameters must be an object");
  const unknown = Object.keys(value).find((key) => !["threadId", "limit", "cursor"].includes(key));
  if (unknown) throw new Error(`unknown Pi session read parameter: ${unknown}`);
  const threadId = optionalPiString(value.threadId, 256);
  if (!threadId || !SESSION_ID_PATTERN$1.test(threadId)) throw new Error("threadId is invalid");
  const cursor = optionalPiString(value.cursor, MAX_CURSOR_LENGTH$1);
  if (value.cursor !== void 0 && !cursor) throw new Error("cursor is invalid");
  return {
    threadId,
    limit: boundedLimit(value.limit),
    ...(cursor ? { cursor } : {}),
  };
}
async function listLocalPiSessionPage(value) {
  const params = parseListParams(value);
  const offset = decodeCursor(params.cursor);
  const { summaries, hasMore } = await listPiSummaryPage(process$1.env, {
    offset,
    limit: params.limit,
    ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
  });
  const page = summaries.map(({ file: _file, ...session }) => session);
  return {
    sessions: page,
    ...(hasMore ? { nextCursor: encodeCursor(offset + page.length) } : {}),
  };
}
function isoTimestamp(message, entry) {
  const value = timestampMs(message.timestamp) ?? timestampMs(entry.timestamp);
  if (value === void 0) return;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
function jsonText(value, maxLength = 2e4) {
  try {
    const text = JSON.stringify(value);
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  } catch {
    return;
  }
}
function activePiEntries(entries) {
  const header = entries[0];
  if ((header?.type === "session" && typeof header.version === "number" ? header.version : 1) < 2)
    return entries.slice(1);
  const body = entries.filter(
    (entry) => entry.type !== "session" && optionalPiString(entry.id, 256),
  );
  const byId = new Map(body.map((entry) => [String(entry.id), entry]));
  const active = [];
  let current = body.at(-1);
  const visited = /* @__PURE__ */ new Set();
  while (current) {
    const id = String(current.id);
    if (visited.has(id)) break;
    visited.add(id);
    active.push(current);
    const parentId = optionalPiString(current.parentId, 256);
    current = parentId ? byId.get(parentId) : void 0;
  }
  return active.toReversed();
}
function piMessageItems(entry) {
  if (!isRecord(entry.message)) return [];
  const message = entry.message;
  const role = message.role;
  const id = optionalPiString(entry.id, 256);
  const timestamp = isoTimestamp(message, entry);
  const model = optionalPiString(message.model, 256);
  const provider = optionalPiString(message.provider, 256);
  const modelRef = provider && model ? `${provider}/${model}` : model;
  const common = {
    ...(id ? { id } : {}),
    ...(timestamp ? { timestamp } : {}),
    ...(modelRef ? { model: modelRef } : {}),
  };
  if (role === "user") {
    const text = textFromContent(message.content);
    return text
      ? [
          {
            ...common,
            type: "userMessage",
            text,
          },
        ]
      : [];
  }
  if (role === "toolResult") {
    const toolName = optionalPiString(message.toolName, 256);
    const text = textFromContent(message.content);
    return [
      {
        ...common,
        type: "toolResult",
        text: toolName ? `${toolName}\n${text}` : text,
      },
    ];
  }
  if (role === "bashExecution") {
    const command = optionalPiString(message.command, 4096) ?? "bash";
    const output = typeof message.output === "string" ? message.output : "";
    const status =
      message.cancelled === true
        ? "command cancelled"
        : typeof message.exitCode === "number" && message.exitCode !== 0
          ? `command exited with code ${String(message.exitCode)}`
          : "";
    return [
      {
        ...common,
        type: "toolCall",
        text: `bash\n${command}`,
      },
      {
        ...common,
        ...(id ? { id: `${id}:result` } : {}),
        type: "toolResult",
        text: [output, status].filter(Boolean).join("\n\n"),
      },
    ];
  }
  if (role === "custom" || role === "hookMessage") {
    if (message.display !== true) return [];
    const customType = optionalPiString(message.customType, 256);
    const text = textFromContent(message.content);
    return text
      ? [
          {
            ...common,
            type: "other",
            text: customType ? `${customType}\n${text}` : text,
          },
        ]
      : [];
  }
  if (role !== "assistant" || !Array.isArray(message.content)) return [];
  return message.content.flatMap((part, index) => {
    if (!isRecord(part)) return [];
    const partCommon = {
      ...common,
      ...(id ? { id: `${id}:${String(index)}` } : {}),
    };
    if (part.type === "text" && typeof part.text === "string")
      return [
        {
          ...partCommon,
          type: "agentMessage",
          text: part.text,
        },
      ];
    if (part.type === "thinking" && typeof part.thinking === "string")
      return [
        {
          ...partCommon,
          type: "reasoning",
          text: part.thinking,
        },
      ];
    if (part.type === "toolCall") {
      const name = optionalPiString(part.name, 256) ?? "tool";
      const args = jsonText(part.arguments);
      return [
        {
          ...partCommon,
          type: "toolCall",
          text: args ? `${name}\n${args}` : name,
        },
      ];
    }
    return [];
  });
}
function piTranscriptItems(entries) {
  return activePiEntries(entries).flatMap((entry) => {
    if (entry.type === "message") return piMessageItems(entry);
    const id = optionalPiString(entry.id, 256);
    const timestamp = optionalPiString(entry.timestamp, 128);
    const common = {
      ...(id ? { id } : {}),
      ...(timestamp ? { timestamp } : {}),
    };
    if (entry.type === "compaction" && typeof entry.summary === "string")
      return [
        {
          ...common,
          type: "other",
          text: entry.summary,
        },
      ];
    if (entry.type === "branch_summary" && typeof entry.summary === "string")
      return [
        {
          ...common,
          type: "other",
          text: entry.summary,
        },
      ];
    if (entry.type === "custom_message" && entry.display === true) {
      const text = textFromContent(entry.content);
      return text
        ? [
            {
              ...common,
              type: "other",
              text,
            },
          ]
        : [];
    }
    return [];
  });
}
async function readLocalPiTranscriptPage(value) {
  const params = parseReadParams(value);
  const offset = decodeCursor(params.cursor);
  const page = transcriptPage(
    piTranscriptItems(await readPiSessionById(params.threadId, process$1.env)),
    params.limit,
    offset,
  );
  return {
    hostId: LOCAL_HOST_ID$1,
    label: "Local Pi",
    threadId: params.threadId,
    ...page,
  };
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog-plugin.ts
const PI_SESSIONS_LIST_COMMAND = "acpx.pi.sessions.list.v1";
const PI_SESSION_READ_COMMAND = "acpx.pi.sessions.read.v1";
const PI_TERMINAL_RESUME_COMMAND = "acpx.pi.terminal.resume.v1";
const CAPABILITY = "pi-sessions";
const LOCAL_HOST_ID = "gateway";
const MAX_PAGE_LIMIT = 100;
const MAX_HOSTS = 100;
const MAX_CURSOR_LENGTH = 128;
const MAX_SEARCH_LENGTH = 500;
const NODE_TIMEOUT_MS = 2e4;
const SESSION_ID_PATTERN = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
const TRANSCRIPT_ITEM_TYPES = /* @__PURE__ */ new Set([
  "userMessage",
  "agentMessage",
  "reasoning",
  "toolCall",
  "toolResult",
  "other",
]);
function validatePiThreadId(value) {
  if (typeof value !== "string" || !SESSION_ID_PATTERN.test(value))
    throw new Error("INVALID_REQUEST: threadId is invalid");
  return value;
}
function isOptionalString(value) {
  return value === void 0 || typeof value === "string";
}
function isOptionalNumber(value) {
  return value === void 0 || typeof value === "number";
}
function isNodeSession(value) {
  return (
    isRecord(value) &&
    typeof value.threadId === "string" &&
    SESSION_ID_PATTERN.test(value.threadId) &&
    typeof value.status === "string" &&
    value.status.length > 0 &&
    typeof value.archived === "boolean" &&
    typeof value.canContinue === "boolean" &&
    typeof value.canArchive === "boolean" &&
    isOptionalString(value.name) &&
    isOptionalString(value.cwd) &&
    isOptionalString(value.source) &&
    isOptionalString(value.modelProvider) &&
    isOptionalString(value.cliVersion) &&
    isOptionalString(value.gitBranch) &&
    isOptionalString(value.openClawSessionKey) &&
    isOptionalNumber(value.createdAt) &&
    isOptionalNumber(value.updatedAt) &&
    isOptionalNumber(value.recencyAt)
  );
}
function isNodeTranscriptItem(value) {
  return (
    isRecord(value) &&
    typeof value.type === "string" &&
    TRANSCRIPT_ITEM_TYPES.has(value.type) &&
    isOptionalString(value.id) &&
    isOptionalString(value.text) &&
    isOptionalString(value.timestamp) &&
    isOptionalString(value.model) &&
    (value.truncated === void 0 || typeof value.truncated === "boolean")
  );
}
function parseNodeParams(paramsJSON) {
  if (!paramsJSON) return;
  try {
    return JSON.parse(paramsJSON);
  } catch (error) {
    throw new Error("Pi session parameters must be valid JSON", { cause: error });
  }
}
function fullConfigCatalogEnabled(config) {
  if (!isRecord(config) || !isRecord(config.plugins) || !isRecord(config.plugins.entries))
    return true;
  const entry = config.plugins.entries.acpx;
  if (!isRecord(entry) || !isRecord(entry.config) || !isRecord(entry.config.piSessionCatalog))
    return true;
  return entry.config.piSessionCatalog.enabled !== false;
}
function isPiSessionCatalogEnabled(pluginConfig) {
  return (
    !isRecord(pluginConfig) ||
    !isRecord(pluginConfig.piSessionCatalog) ||
    pluginConfig.piSessionCatalog.enabled !== false
  );
}
function createPiSessionNodeHostCommands() {
  const storeAvailable = ({ config, env }) =>
    fullConfigCatalogEnabled(config) && piSessionStoreAvailable(env);
  return [
    {
      command: PI_SESSIONS_LIST_COMMAND,
      cap: CAPABILITY,
      dangerous: false,
      isAvailable: storeAvailable,
      handle: async (paramsJSON) =>
        JSON.stringify(await listLocalPiSessionPage(parseNodeParams(paramsJSON))),
    },
    {
      command: PI_SESSION_READ_COMMAND,
      cap: CAPABILITY,
      dangerous: false,
      isAvailable: storeAvailable,
      handle: async (paramsJSON) =>
        JSON.stringify(await readLocalPiTranscriptPage(parseNodeParams(paramsJSON))),
    },
    {
      command: PI_TERMINAL_RESUME_COMMAND,
      cap: CAPABILITY,
      dangerous: false,
      duplex: true,
      isAvailable: ({ config, env }) =>
        storeAvailable({
          config,
          env,
        }) && Boolean(resolveExecutableFromPathEnv("pi", env.PATH ?? "")),
      handle: async (paramsJSON, io) => {
        if (!io) throw new Error("Pi terminal command requires duplex transport");
        const params = decodeNodePtyResumeParams(paramsJSON, validatePiThreadId);
        const record = await requireLocalPiSession(params.threadId);
        const file = resolveExecutableFromPathEnv("pi", process$1.env.PATH ?? "");
        if (!file) throw new Error("Pi CLI is unavailable");
        return JSON.stringify(
          await runNodePtyCommand(
            {
              file,
              args: ["--session", params.threadId],
              cwd: record.cwd,
              cols: params.cols,
              rows: params.rows,
            },
            io,
          ),
        );
      },
    },
  ];
}
function createPiSessionNodeInvokePolicies() {
  return [
    {
      commands: [PI_SESSIONS_LIST_COMMAND, PI_SESSION_READ_COMMAND, PI_TERMINAL_RESUME_COMMAND],
      defaultPlatforms: ["macos", "linux", "windows"],
      handle: (context) =>
        context.command === PI_TERMINAL_RESUME_COMMAND ? { ok: true } : context.invokeNode(),
    },
  ];
}
function nodeLabel(node) {
  return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function unwrapNodePayload(value) {
  return isRecord(value) && typeof value.payloadJSON === "string"
    ? JSON.parse(value.payloadJSON)
    : value;
}
function setTerminalCapability(page, canOpenTerminal) {
  for (const session of page.sessions) session.canOpenTerminal = canOpenTerminal;
  return page;
}
async function listPiNodeHost(runtime, query, node) {
  const hostId = `node:${node.nodeId}`;
  const common = {
    hostId,
    label: nodeLabel(node),
    kind: "node",
    connected: node.connected === true,
    nodeId: node.nodeId,
  };
  if (node.connected !== true)
    return {
      ...common,
      sessions: [],
      error: {
        code: "NODE_OFFLINE",
        message: "Paired node is offline",
      },
    };
  try {
    const page = parseNodeSessionPage(
      unwrapNodePayload(
        await runtime.nodes.invoke({
          nodeId: node.nodeId,
          command: PI_SESSIONS_LIST_COMMAND,
          params: {
            ...(query.limitPerHost ? { limit: query.limitPerHost } : {}),
            ...(query.search?.trim()
              ? { searchTerm: query.search.trim().slice(0, MAX_SEARCH_LENGTH) }
              : {}),
            ...(query.cursors?.[hostId] ? { cursor: query.cursors[hostId] } : {}),
          },
          timeoutMs: NODE_TIMEOUT_MS,
          scopes: ["operator.write"],
        }),
      ),
    );
    const canOpenTerminal =
      (node.invocableCommands ?? node.commands)?.includes(PI_TERMINAL_RESUME_COMMAND) === true;
    return {
      ...common,
      ...setTerminalCapability(page, canOpenTerminal),
    };
  } catch {
    return {
      ...common,
      sessions: [],
      error: {
        code: "NODE_INVOKE_FAILED",
        message: "Paired node Pi sessions are unavailable",
      },
    };
  }
}
function parseNodeSessionPage(value) {
  if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > MAX_PAGE_LIMIT)
    throw new Error("Pi node returned an invalid session page");
  if (!value.sessions.every(isNodeSession))
    throw new Error("Pi node returned an invalid session page");
  const sessions = value.sessions;
  const nextCursor = optionalPiString(value.nextCursor, MAX_CURSOR_LENGTH);
  if (value.nextCursor !== void 0 && !nextCursor)
    throw new Error("Pi node returned an invalid cursor");
  return {
    sessions,
    ...(nextCursor ? { nextCursor } : {}),
  };
}
function parseNodeTranscriptPage(value, threadId) {
  if (
    !isRecord(value) ||
    value.threadId !== threadId ||
    !Array.isArray(value.items) ||
    value.items.length > MAX_PAGE_LIMIT ||
    !value.items.every(isNodeTranscriptItem)
  )
    throw new Error("Pi node returned an invalid transcript page");
  const nextCursor = optionalPiString(value.nextCursor, MAX_CURSOR_LENGTH);
  if (value.nextCursor !== void 0 && !nextCursor)
    throw new Error("Pi node returned an invalid cursor");
  return {
    hostId: LOCAL_HOST_ID,
    threadId,
    items: value.items,
    ...(nextCursor ? { nextCursor } : {}),
  };
}
async function listPiHosts(runtime, query) {
  const requested = query.hostIds ? new Set(query.hostIds) : void 0;
  const searchTerm = query.search?.trim().slice(0, MAX_SEARCH_LENGTH) || void 0;
  const hosts = [];
  if ((!requested || requested.has(LOCAL_HOST_ID)) && piSessionStoreAvailable(process$1.env))
    try {
      hosts.push({
        hostId: LOCAL_HOST_ID,
        label: "Local Pi",
        kind: "gateway",
        connected: true,
        ...(await listLocalPiSessionPage({
          limit: query.limitPerHost,
          ...(searchTerm ? { searchTerm } : {}),
          cursor: query.cursors?.[LOCAL_HOST_ID],
        }).then((page) =>
          setTerminalCapability(
            page,
            resolveExecutableFromPathEnv("pi", process$1.env.PATH ?? "") !== void 0,
          ),
        )),
      });
    } catch {
      hosts.push({
        hostId: LOCAL_HOST_ID,
        label: "Local Pi",
        kind: "gateway",
        connected: true,
        sessions: [],
        error: {
          code: "LOCAL_READ_FAILED",
          message: "Local Pi sessions are unavailable",
        },
      });
    }
  let nodes;
  try {
    nodes = (await runtime.nodes.list()).nodes;
  } catch {
    return hosts;
  }
  const eligible = nodes
    .filter(
      (node) =>
        node.commands?.includes(PI_SESSIONS_LIST_COMMAND) &&
        (!requested || requested.has(`node:${node.nodeId}`)),
    )
    .toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right)))
    .slice(0, MAX_HOSTS - hosts.length);
  const nodeHosts = await Promise.all(eligible.map((node) => listPiNodeHost(runtime, query, node)));
  return [...hosts, ...nodeHosts];
}
async function requireLocalPiSession(threadId) {
  const record = (
    await listLocalPiSessionPage({
      searchTerm: threadId,
      limit: MAX_PAGE_LIMIT,
    })
  ).sessions.find((session) => session.threadId === threadId);
  if (!record) throw new Error("Pi session is unavailable");
  return record;
}
async function resolveNodePiSession(params) {
  const record = parseNodeSessionPage(
    unwrapNodePayload(
      await params.runtime.nodes.invoke({
        nodeId: params.nodeId,
        command: PI_SESSIONS_LIST_COMMAND,
        params: {
          searchTerm: params.threadId,
          limit: MAX_PAGE_LIMIT,
        },
        timeoutMs: NODE_TIMEOUT_MS,
        scopes: ["operator.write"],
      }),
    ),
  ).sessions.find((session) => session.threadId === params.threadId);
  if (!record) throw new Error("Pi session is unavailable");
  return record;
}
async function openPiTerminal(params) {
  const title = `pi --session ${params.threadId.slice(0, 12)}…`;
  if (params.hostId === LOCAL_HOST_ID) {
    const record = await requireLocalPiSession(params.threadId);
    const executable = resolveExecutableFromPathEnv("pi", process$1.env.PATH ?? "");
    if (!executable) throw new Error("Pi CLI is unavailable");
    return {
      kind: "local",
      argv: [executable, "--session", params.threadId],
      ...(record.cwd ? { cwd: record.cwd } : {}),
      title,
    };
  }
  if (!params.hostId.startsWith("node:")) throw new Error("hostId is invalid");
  const nodeId = params.hostId.slice(5);
  if (
    !(await params.runtime.nodes.list()).nodes.find((candidate) => {
      const commands = candidate.invocableCommands ?? candidate.commands;
      return (
        candidate.nodeId === nodeId &&
        candidate.connected === true &&
        commands?.includes(PI_SESSIONS_LIST_COMMAND) === true &&
        commands.includes(PI_TERMINAL_RESUME_COMMAND)
      );
    })
  )
    throw new Error("paired-node Pi terminal is unavailable");
  const record = await resolveNodePiSession({
    runtime: params.runtime,
    nodeId,
    threadId: params.threadId,
  });
  return {
    kind: "node",
    nodeId,
    command: PI_TERMINAL_RESUME_COMMAND,
    paramsJSON: JSON.stringify({ threadId: params.threadId }),
    ...(record.cwd ? { cwd: record.cwd } : {}),
    title,
  };
}
async function readPiTranscript(runtime, request) {
  if (request.hostId === LOCAL_HOST_ID)
    return await readLocalPiTranscriptPage({
      threadId: request.threadId,
      ...(request.limit ? { limit: request.limit } : {}),
      ...(request.cursor ? { cursor: request.cursor } : {}),
    });
  if (!request.hostId.startsWith("node:")) throw new Error("hostId is invalid");
  const nodeId = request.hostId.slice(5);
  const node = (await runtime.nodes.list()).nodes.find(
    (candidate) =>
      candidate.nodeId === nodeId &&
      candidate.connected === true &&
      candidate.commands?.includes(PI_SESSION_READ_COMMAND),
  );
  if (!node) throw new Error("paired-node Pi session host is unavailable");
  return {
    ...parseNodeTranscriptPage(
      unwrapNodePayload(
        await runtime.nodes.invoke({
          nodeId,
          command: PI_SESSION_READ_COMMAND,
          params: {
            threadId: request.threadId,
            ...(request.limit ? { limit: request.limit } : {}),
            ...(request.cursor ? { cursor: request.cursor } : {}),
          },
          timeoutMs: NODE_TIMEOUT_MS,
          scopes: ["operator.write"],
        }),
      ),
      request.threadId,
    ),
    hostId: request.hostId,
    label: nodeLabel(node),
  };
}
function registerPiSessionCatalog(api) {
  if (!isPiSessionCatalogEnabled(api.pluginConfig)) return;
  api.registerSessionCatalog({
    id: "pi",
    label: "Pi",
    list: async (query) => await listPiHosts(api.runtime, query),
    read: async (request) => await readPiTranscript(api.runtime, request),
    openTerminal: async (request) =>
      await openPiTerminal({
        runtime: api.runtime,
        ...request,
      }),
  });
  for (const command of createPiSessionNodeHostCommands()) api.registerNodeHostCommand(command);
  for (const policy of createPiSessionNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
}
//#endregion
//#region extensions/acpx/index.ts
/**
 * ACPX runtime plugin entry. It registers the embedded ACP backend service and
 * wires reply-dispatch hooks into the plugin SDK runtime.
 */
function resolveReplyDispatchTimeoutMs(pluginConfig) {
  const timeoutSeconds = pluginConfig?.timeoutSeconds;
  return (
    finiteSecondsToTimerSafeMilliseconds(
      typeof timeoutSeconds === "number" && Number.isFinite(timeoutSeconds) && timeoutSeconds > 0
        ? timeoutSeconds
        : 120,
    ) ?? 1
  );
}
async function tryDispatchAcpReplyHookWithTimeout(event, ctx, timeoutMs) {
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
  timeout.unref?.();
  const abortSignal = ctx.abortSignal
    ? AbortSignal.any([ctx.abortSignal, timeoutController.signal])
    : timeoutController.signal;
  try {
    return await tryDispatchAcpReplyHook(event, {
      ...ctx,
      abortSignal,
    });
  } finally {
    clearTimeout(timeout);
  }
}
const plugin = {
  id: "acpx",
  name: "ACPX Runtime",
  description: "Embedded ACP runtime backend with plugin-owned session and transport management.",
  register(api) {
    const replyDispatchTimeoutMs = resolveReplyDispatchTimeoutMs(api.pluginConfig);
    registerPiSessionCatalog(api);
    api.registerService(
      createAcpxRuntimeService({
        pluginConfig: api.pluginConfig,
        openKeyedStore: (options) => api.runtime.state.openKeyedStore(options),
      }),
    );
    api.on(
      "reply_dispatch",
      (event, ctx) => tryDispatchAcpReplyHookWithTimeout(event, ctx, replyDispatchTimeoutMs),
      { timeoutMs: replyDispatchTimeoutMs },
    );
  },
};
//#endregion
export { plugin as default };
