import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  H as formatMemoryDreamingDay,
  X as resolveMemoryLightDreamingConfig,
  Y as resolveMemoryDreamingWorkspaces,
  Z as resolveMemoryRemDreamingConfig,
} from "./dreaming-CM8RB1ct.js";
import { t as appendFailedDreamingEvent } from "./dreaming-events-DVeCOG4z.js";
import { t as writeDailyDreamingPhaseBlock } from "./dreaming-markdown-rS_8lNOS.js";
import {
  i as readRecentDreamDiaryEntries,
  o as runDetachedDreamNarrative,
  r as generateAndAppendDreamNarrative,
} from "./dreaming-narrative-DsWreRa1.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  _ as writeMemoryCoreWorkspaceEntries,
  g as readMemoryCoreWorkspaceEntries,
  m as normalizeMemoryCoreWorkspaceKey,
  n as DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
  r as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
  t as DREAMING_DAILY_INGESTION_NAMESPACE,
} from "./dreaming-state-DLMGVRgZ.js";
import "./memory-core-host-status-BYxFcXad.js";
import "./memory-core-host-engine-foundation-GFDZKXDt.js";
import {
  _ as sessionPathForFile,
  b as listSessionTranscriptCorpusEntriesForAgent,
  l as buildSessionEntry,
} from "./engine-qmd-sbHvD8ZT.js";
import "./memory-core-host-engine-qmd-Cgk374S9.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./dreaming-shared-BS6J1klu.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { x as parseUsageCountedSessionIdFromFileName } from "./paths-TfuVT-K8.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
import {
  c as filterFreshLightDreamingEntries,
  g as recordDreamingPhaseSignals,
  h as readShortTermRecallEntries,
  l as filterLiveShortTermRecallEntries,
  m as readLightStagedKeys,
  v as recordRemConsideredPhaseSignals,
  y as recordShortTermRecalls,
} from "./short-term-promotion-Km7alBR_.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { n as textSimilarity } from "./tokenize-C8vgcu8i.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/memory-core/src/dreaming-phases.ts
const MEMORY_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAILY_MEMORY_FILENAME_RE = /^(\d{4}-\d{2}-\d{2})(?:-[^/]+)?\.md$/i;
const DAILY_INGESTION_STATE_RELATIVE_PATH = path.join("memory", ".dreams", "daily-ingestion.json");
const DAILY_INGESTION_SCORE = 0.62;
const DAILY_INGESTION_MAX_SNIPPET_CHARS = 280;
const DAILY_INGESTION_MIN_SNIPPET_CHARS = 8;
const DAILY_INGESTION_MAX_CHUNK_LINES = 4;
const SESSION_INGESTION_STATE_RELATIVE_PATH = path.join(
  "memory",
  ".dreams",
  "session-ingestion.json",
);
const SESSION_CORPUS_RELATIVE_DIR = path.join("memory", ".dreams", "session-corpus");
const SESSION_INGESTION_SCORE = 0.58;
const SESSION_INGESTION_MAX_SNIPPET_CHARS = 280;
const SESSION_INGESTION_MIN_SNIPPET_CHARS = 12;
const SESSION_INGESTION_MAX_MESSAGES_PER_SWEEP = 240;
const SESSION_INGESTION_MAX_MESSAGES_PER_FILE = 80;
const SESSION_INGESTION_MIN_MESSAGES_PER_FILE = 12;
const SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION = 4096;
const SESSION_INGESTION_MAX_TRACKED_SCOPES = 2048;
const SESSION_CHECKPOINT_TRANSCRIPT_FILENAME_RE = /\.checkpoint\..+\.jsonl$/i;
const LIGHT_DIARY_HISTORY_LIMIT = 4;
const LIGHT_DIARY_SNIPPET_SIMILARITY_THRESHOLD = 0.35;
const GENERIC_DAY_HEADING_RE =
  /^(?:(?:mon|monday|tue|tues|tuesday|wed|wednesday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday)(?:,\s+)?)?(?:(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s*\d{4})?|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?|\d{4}[/-]\d{2}[/-]\d{2})$/i;
const MANAGED_DAILY_DREAMING_BLOCKS = [
  {
    heading: "## Light Sleep",
    startMarker: "<!-- openclaw:dreaming:light:start -->",
    endMarker: "<!-- openclaw:dreaming:light:end -->",
  },
  {
    heading: "## REM Sleep",
    startMarker: "<!-- openclaw:dreaming:rem:start -->",
    endMarker: "<!-- openclaw:dreaming:rem:end -->",
  },
];
function calculateLookbackCutoffMs(nowMs, lookbackDays) {
  return nowMs - Math.max(0, lookbackDays) * 24 * 60 * 60 * 1e3;
}
function isDayWithinLookback(day, cutoffMs) {
  const dayMs = Date.parse(`${day}T23:59:59.999Z`);
  return Number.isFinite(dayMs) && dayMs >= cutoffMs;
}
function normalizeDailyListMarker(line) {
  return line
    .replace(/^\d+\.\s+/, "")
    .replace(/^[-*+]\s+/, "")
    .trim();
}
function normalizeDailyHeading(line) {
  const match = line.trim().match(/^#{1,6}\s+(.+)$/);
  if (!match) return null;
  const heading = match[1] ? normalizeDailyListMarker(match[1]) : "";
  if (!heading || DAILY_MEMORY_FILENAME_RE.test(heading) || isGenericDailyHeading(heading))
    return null;
  return truncateUtf16Safe(heading, DAILY_INGESTION_MAX_SNIPPET_CHARS).replace(/\s+/g, " ");
}
function isGenericDailyHeading(heading) {
  const normalized = heading.trim().replace(/\s+/g, " ");
  if (!normalized) return true;
  const lower = normalized.toLowerCase();
  if (lower === "today" || lower === "yesterday" || lower === "tomorrow") return true;
  if (lower === "morning" || lower === "afternoon" || lower === "evening" || lower === "night")
    return true;
  return GENERIC_DAY_HEADING_RE.test(normalized);
}
function normalizeDailySnippet(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("<!--")) return null;
  const withoutListMarker = normalizeDailyListMarker(trimmed);
  if (withoutListMarker.length < DAILY_INGESTION_MIN_SNIPPET_CHARS) return null;
  return truncateUtf16Safe(withoutListMarker, DAILY_INGESTION_MAX_SNIPPET_CHARS).replace(
    /\s+/g,
    " ",
  );
}
const REM_REFLECTION_TAG_BLACKLIST = /* @__PURE__ */ new Set([
  "assistant",
  "user",
  "system",
  "subagent",
  "the",
]);
function buildDailyChunkSnippet(heading, chunkLines, chunkKind) {
  const joiner = chunkKind === "list" ? "; " : " ";
  const body = chunkLines.join(joiner).trim();
  return truncateUtf16Safe(
    heading ? `${heading}: ${body}` : body,
    DAILY_INGESTION_MAX_SNIPPET_CHARS,
  )
    .replace(/\s+/g, " ")
    .trim();
}
function buildDailySnippetChunks(lines, limit) {
  const chunks = [];
  let activeHeading = null;
  let chunkLines = [];
  let chunkKind = null;
  let chunkStartLine = 0;
  let chunkEndLine = 0;
  const flushChunk = () => {
    if (chunkLines.length === 0) {
      chunkKind = null;
      chunkStartLine = 0;
      chunkEndLine = 0;
      return;
    }
    const snippet = buildDailyChunkSnippet(activeHeading, chunkLines, chunkKind);
    if (snippet.length >= DAILY_INGESTION_MIN_SNIPPET_CHARS)
      chunks.push({
        startLine: chunkStartLine,
        endLine: chunkEndLine,
        snippet,
      });
    chunkLines = [];
    chunkKind = null;
    chunkStartLine = 0;
    chunkEndLine = 0;
  };
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (typeof line !== "string") continue;
    const heading = normalizeDailyHeading(line);
    if (heading) {
      flushChunk();
      activeHeading = heading;
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("<!--")) {
      flushChunk();
      continue;
    }
    const snippet = normalizeDailySnippet(line);
    if (!snippet) {
      flushChunk();
      continue;
    }
    const nextKind = /^([-*+]\s+|\d+\.\s+)/.test(trimmed) ? "list" : "paragraph";
    const nextChunkLines = chunkLines.length === 0 ? [snippet] : [...chunkLines, snippet];
    const candidateSnippet = buildDailyChunkSnippet(activeHeading, nextChunkLines, nextKind);
    if (
      chunkLines.length > 0 &&
      (chunkKind !== nextKind ||
        chunkLines.length >= DAILY_INGESTION_MAX_CHUNK_LINES ||
        candidateSnippet.length > DAILY_INGESTION_MAX_SNIPPET_CHARS)
    )
      flushChunk();
    if (chunkLines.length === 0) {
      chunkStartLine = index + 1;
      chunkKind = nextKind;
    }
    chunkLines.push(snippet);
    chunkEndLine = index + 1;
    if (chunks.length >= limit) break;
  }
  flushChunk();
  return chunks.slice(0, limit);
}
function findManagedDailyDreamingHeadingIndex(lines, startIndex, heading) {
  for (let index = startIndex - 1; index >= 0; index -= 1) {
    const trimmed = lines[index]?.trim() ?? "";
    if (!trimmed) continue;
    return trimmed === heading ? index : null;
  }
  return null;
}
function isManagedDailyDreamingBoundary(line, blockByStartMarker) {
  const trimmed = line.trim();
  return /^#{1,6}\s+/.test(trimmed) || blockByStartMarker.has(trimmed);
}
function stripManagedDailyDreamingLines(lines) {
  const blockByStartMarker = new Map(
    MANAGED_DAILY_DREAMING_BLOCKS.map((block) => [block.startMarker, block]),
  );
  const sanitized = [...lines];
  for (let index = 0; index < sanitized.length; index += 1) {
    const block = blockByStartMarker.get(sanitized[index]?.trim() ?? "");
    if (!block) continue;
    let stripUntilIndex = -1;
    for (let cursor = index + 1; cursor < sanitized.length; cursor += 1) {
      const line = sanitized[cursor];
      if ((line?.trim() ?? "") === block.endMarker) {
        stripUntilIndex = cursor;
        break;
      }
      if (line && isManagedDailyDreamingBoundary(line, blockByStartMarker)) {
        stripUntilIndex = cursor - 1;
        break;
      }
    }
    if (stripUntilIndex < index) continue;
    const startIndex = findManagedDailyDreamingHeadingIndex(lines, index, block.heading) ?? index;
    for (let cursor = startIndex; cursor <= stripUntilIndex; cursor += 1) sanitized[cursor] = "";
    index = stripUntilIndex;
  }
  return sanitized;
}
function entryWithinLookback(entry, cutoffMs) {
  if ((entry.recallDays ?? []).some((day) => isDayWithinLookback(day, cutoffMs))) return true;
  const lastRecalledAtMs = Date.parse(entry.lastRecalledAt);
  return Number.isFinite(lastRecalledAtMs) && lastRecalledAtMs >= cutoffMs;
}
function filterRecallEntriesWithinLookback(params) {
  const cutoffMs = calculateLookbackCutoffMs(params.nowMs, params.lookbackDays);
  return params.entries.filter((entry) => entryWithinLookback(entry, cutoffMs));
}
function parseDailyMemoryFileName(fileName) {
  const day = fileName.match(DAILY_MEMORY_FILENAME_RE)?.[1];
  return day
    ? {
        fileName,
        day,
        canonical: fileName.toLowerCase() === `${day}.md`,
      }
    : null;
}
function compareDailyMemoryFilesByNewestDay(left, right) {
  const dayOrder = right.day.localeCompare(left.day);
  if (dayOrder !== 0) return dayOrder;
  if (left.canonical !== right.canonical) return left.canonical ? -1 : 1;
  return left.fileName.localeCompare(right.fileName);
}
function resolveWorkspaceMemoryRelativePath(workspaceDir, filePath) {
  const relativePath = path.relative(workspaceDir, filePath).replace(/\\/g, "/");
  if (relativePath && relativePath !== ".." && !relativePath.startsWith("../")) return relativePath;
  return `memory/${path.basename(filePath)}`;
}
function normalizeDailyIngestionState(raw) {
  const filesRaw = asNullableRecord(asNullableRecord(raw)?.files);
  if (!filesRaw)
    return {
      version: 1,
      files: {},
    };
  const files = {};
  for (const [key, value] of Object.entries(filesRaw)) {
    const file = asNullableRecord(value);
    if (!file || typeof key !== "string" || key.trim().length === 0) continue;
    const mtimeMs = Number(file.mtimeMs);
    const size = Number(file.size);
    if (!Number.isFinite(mtimeMs) || mtimeMs < 0 || !Number.isFinite(size) || size < 0) continue;
    const lastDreamingDayIngested = normalizeMemoryDay(file.lastDreamingDayIngested);
    files[key] = {
      mtimeMs: Math.floor(mtimeMs),
      size: Math.floor(size),
      ...(lastDreamingDayIngested ? { lastDreamingDayIngested } : {}),
    };
  }
  return {
    version: 1,
    files,
  };
}
function normalizeMemoryDay(value) {
  if (typeof value !== "string") return;
  const day = value.trim();
  return MEMORY_DAY_RE.test(day) ? day : void 0;
}
async function readDailyIngestionState(workspaceDir) {
  const entries = await readMemoryCoreWorkspaceEntries({
    namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
    workspaceDir,
  });
  return normalizeDailyIngestionState({
    version: 1,
    files: Object.fromEntries(entries.map((entry) => [entry.key, entry.value])),
  });
}
async function writeDailyIngestionState(workspaceDir, state) {
  await writeMemoryCoreWorkspaceEntries({
    namespace: DREAMING_DAILY_INGESTION_NAMESPACE,
    workspaceDir,
    entries: Object.entries(state.files).map(([key, value]) => ({
      key,
      value,
    })),
  });
}
function normalizeSessionIngestionState(raw) {
  const record = asNullableRecord(raw);
  const filesRaw = asNullableRecord(record?.files);
  const files = {};
  if (filesRaw)
    for (const [key, value] of Object.entries(filesRaw)) {
      const file = asNullableRecord(value);
      if (!file || key.trim().length === 0) continue;
      const mtimeMs = Number(file.mtimeMs);
      const size = Number(file.size);
      if (!Number.isFinite(mtimeMs) || mtimeMs < 0 || !Number.isFinite(size) || size < 0) continue;
      const lineCountRaw = Number(file.lineCount);
      const lastContentLineRaw = Number(file.lastContentLine);
      const lineCount =
        Number.isFinite(lineCountRaw) && lineCountRaw >= 0 ? Math.floor(lineCountRaw) : 0;
      const lastContentLine =
        Number.isFinite(lastContentLineRaw) && lastContentLineRaw >= 0
          ? Math.floor(lastContentLineRaw)
          : 0;
      files[key] = {
        mtimeMs: Math.floor(mtimeMs),
        size: Math.floor(size),
        contentHash: typeof file.contentHash === "string" ? file.contentHash.trim() : "",
        lineCount,
        lastContentLine: Math.min(lineCount, lastContentLine),
      };
    }
  const seenMessagesRaw = asNullableRecord(record?.seenMessages);
  const seenMessages = {};
  if (seenMessagesRaw)
    for (const [scope, value] of Object.entries(seenMessagesRaw)) {
      if (scope.trim().length === 0 || !Array.isArray(value)) continue;
      const unique = normalizeStringEntries([
        ...new Set(value.filter((entry) => typeof entry === "string")),
      ]).slice(-4096);
      if (unique.length > 0) seenMessages[scope] = unique;
    }
  return {
    version: 3,
    files,
    seenMessages,
  };
}
async function readSessionIngestionState(workspaceDir) {
  const [fileEntries, seenChunks] = await Promise.all([
    readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
    }),
    readMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
      workspaceDir,
    }),
  ]);
  const seenMessages = {};
  const chunksByScope = /* @__PURE__ */ new Map();
  for (const chunk of seenChunks) {
    const scope = chunk.value.scope.trim();
    if (!scope) continue;
    const chunks = chunksByScope.get(scope) ?? [];
    chunks.push({
      index: chunk.value.index,
      hashes: chunk.value.hashes,
    });
    chunksByScope.set(scope, chunks);
  }
  for (const [scope, chunks] of chunksByScope)
    seenMessages[scope] = chunks
      .toSorted((a, b) => a.index - b.index)
      .flatMap((chunk) => chunk.hashes);
  return normalizeSessionIngestionState({
    version: 3,
    files: Object.fromEntries(fileEntries.map((entry) => [entry.key, entry.value])),
    seenMessages,
  });
}
async function writeSessionIngestionState(workspaceDir, state) {
  const seenEntries = Object.entries(state.seenMessages).flatMap(([scope, hashes]) =>
    Array.from({ length: Math.ceil(hashes.length / 512) }, (_, index) => {
      const chunkHashes = hashes.slice(index * 512, (index + 1) * 512);
      return {
        key: `${scope}:${index}`,
        value: {
          scope,
          index,
          hashes: chunkHashes,
        },
      };
    }),
  );
  await Promise.all([
    writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
      workspaceDir,
      entries: Object.entries(state.files).map(([key, value]) => ({
        key,
        value,
      })),
    }),
    writeMemoryCoreWorkspaceEntries({
      namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
      workspaceDir,
      entries: seenEntries,
    }),
  ]);
}
function trimTrackedSessionScopes(seenMessages) {
  const keys = Object.keys(seenMessages);
  if (keys.length <= SESSION_INGESTION_MAX_TRACKED_SCOPES) return seenMessages;
  const keep = new Set(keys.toSorted().slice(-2048));
  const next = {};
  for (const [scope, hashes] of Object.entries(seenMessages))
    if (keep.has(scope)) next[scope] = hashes;
  return next;
}
function normalizeSessionCorpusSnippet(value) {
  return truncateUtf16Safe(value.replace(/\s+/g, " ").trim(), SESSION_INGESTION_MAX_SNIPPET_CHARS);
}
function hashSessionMessageId(value) {
  return createHash("sha1").update(value).digest("hex");
}
function buildSessionScopeKey(agentId, sessionId) {
  return `${agentId}:${parseUsageCountedSessionIdFromFileName(`${sessionId}.jsonl`) ?? sessionId}`;
}
function buildSessionFileScopeKey(agentId, absolutePath) {
  const fileName = path.basename(absolutePath);
  return buildSessionScopeKey(
    agentId,
    parseUsageCountedSessionIdFromFileName(fileName) ?? fileName,
  );
}
function mergeTrackedMessageHashes(existing, additions) {
  if (additions.length === 0) return existing;
  const seen = new Set(existing);
  const next = existing.slice();
  for (const hash of additions)
    if (!seen.has(hash)) {
      seen.add(hash);
      next.push(hash);
    }
  if (next.length <= SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION) return next;
  return next.slice(-4096);
}
function areStringArraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) if (a[index] !== b[index]) return false;
  return true;
}
function buildSessionStateKey(agentId, sessionPath) {
  return `${agentId}:${sessionPath}`;
}
function buildSqliteDreamingSessionPath(agentId, sessionId) {
  return path.join("sessions", agentId, sessionId).replace(/\\/g, "/");
}
function isCheckpointSessionTranscriptPath(absolutePath) {
  return SESSION_CHECKPOINT_TRANSCRIPT_FILENAME_RE.test(path.basename(absolutePath));
}
function buildSessionRenderedLine(params) {
  return truncateUtf16Safe(
    `[${`${params.agentId}/${params.sessionPath}#L${params.lineNumber}`}] ${params.snippet}`,
    344,
  );
}
function resolveSessionAgentsForWorkspace(params) {
  const { cfg, workspaceDir, primaryWorkspaceDir } = params;
  if (!cfg) return [];
  const target = normalizeMemoryCoreWorkspaceKey(workspaceDir);
  const match = resolveMemoryDreamingWorkspaces(cfg, {
    primaryWorkspaceDir,
    primaryAgentId: "main",
  }).find((entry) => normalizeMemoryCoreWorkspaceKey(entry.workspaceDir) === target);
  if (!match) return [];
  return uniqueStrings(match.agentIds.filter((agentId) => agentId.trim().length > 0)).toSorted();
}
async function appendSessionCorpusLines(params) {
  if (params.lines.length === 0) return [];
  const relativePath = path.posix.join("memory", ".dreams", "session-corpus", `${params.day}.txt`);
  const absolutePath = path.join(
    params.workspaceDir,
    SESSION_CORPUS_RELATIVE_DIR,
    `${params.day}.txt`,
  );
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  let existing = "";
  try {
    existing = await fs.readFile(absolutePath, "utf-8");
  } catch (err) {
    if (err?.code !== "ENOENT") throw err;
  }
  const normalizedExisting = existing.replace(/\r\n/g, "\n");
  const existingLineCount =
    normalizedExisting.length === 0
      ? 0
      : normalizedExisting.endsWith("\n")
        ? normalizedExisting.slice(0, -1).split("\n").length
        : normalizedExisting.split("\n").length;
  await appendRegularFile({
    filePath: absolutePath,
    content: `${params.lines.map((entry) => entry.rendered).join("\n")}\n`,
    rejectSymlinkParents: true,
  });
  return params.lines.map((entry, index) => {
    const lineNumber = existingLineCount + index + 1;
    return {
      path: relativePath,
      startLine: lineNumber,
      endLine: lineNumber,
      score: SESSION_INGESTION_SCORE,
      snippet: entry.snippet,
      source: "memory",
    };
  });
}
async function collectSessionIngestionBatches(params) {
  if (!params.cfg)
    return {
      batches: [],
      nextState: {
        version: 3,
        files: {},
        seenMessages: {},
      },
      changed:
        Object.keys(params.state.files).length > 0 ||
        Object.keys(params.state.seenMessages).length > 0,
    };
  const agentIds = resolveSessionAgentsForWorkspace({
    cfg: params.cfg,
    workspaceDir: params.workspaceDir,
    primaryWorkspaceDir: params.primaryWorkspaceDir,
  });
  const cutoffMs = calculateLookbackCutoffMs(params.nowMs, params.lookbackDays);
  const batchByDay = /* @__PURE__ */ new Map();
  const nextFiles = {};
  const nextSeenMessages = { ...params.state.seenMessages };
  let changed = false;
  const sessionFiles = [];
  for (const agentId of agentIds)
    for (const entry of await listSessionTranscriptCorpusEntriesForAgent(agentId)) {
      const absolutePath = entry.sessionFile;
      if (
        entry.artifactKind === "archive-artifact" ||
        isCheckpointSessionTranscriptPath(absolutePath)
      )
        continue;
      sessionFiles.push({
        agentId,
        absolutePath,
        generatedByDreamingNarrative: entry.generatedByDreamingNarrative === true,
        generatedByCronRun: entry.generatedByCronRun === true,
        sessionId: entry.sessionId,
        sessionPath:
          entry.transcriptSource === "sqlite"
            ? buildSqliteDreamingSessionPath(entry.agentId, entry.sessionId)
            : sessionPathForFile(absolutePath),
        ...(entry.transcriptSource === "sqlite" ? { transcriptSource: "sqlite" } : {}),
        ...(entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {}),
      });
    }
  const sortedFiles = sessionFiles.toSorted((a, b) => {
    if (a.agentId !== b.agentId) return a.agentId.localeCompare(b.agentId);
    return a.sessionPath.localeCompare(b.sessionPath);
  });
  const totalCap = SESSION_INGESTION_MAX_MESSAGES_PER_SWEEP;
  let remaining = totalCap;
  const perFileCap = Math.min(
    SESSION_INGESTION_MAX_MESSAGES_PER_FILE,
    Math.max(
      SESSION_INGESTION_MIN_MESSAGES_PER_FILE,
      Math.ceil(totalCap / Math.max(1, sortedFiles.length)),
    ),
  );
  for (const file of sortedFiles) {
    if (remaining <= 0) break;
    const stateKey = buildSessionStateKey(file.agentId, file.sessionPath);
    const previous = params.state.files[stateKey];
    let fingerprint;
    let entry;
    if (file.transcriptSource === "sqlite") {
      entry = await buildSessionEntry(file.absolutePath, {
        generatedByDreamingNarrative: file.generatedByDreamingNarrative,
        generatedByCronRun: file.generatedByCronRun,
        ...(file.updatedAtMs !== void 0 ? { updatedAtMs: file.updatedAtMs } : {}),
      });
      if (!entry) {
        if (previous) changed = true;
        continue;
      }
      fingerprint = {
        mtimeMs: Math.floor(Math.max(0, entry.mtimeMs)),
        size: Math.floor(Math.max(0, entry.size)),
      };
    } else {
      const stat = await fs.stat(file.absolutePath).catch((err) => {
        if (err?.code === "ENOENT") return null;
        throw err;
      });
      if (!stat) {
        if (previous) changed = true;
        continue;
      }
      fingerprint = {
        mtimeMs: Math.floor(Math.max(0, stat.mtimeMs)),
        size: Math.floor(Math.max(0, stat.size)),
      };
      const cursorAtEnd = previous !== void 0 && previous.lastContentLine >= previous.lineCount;
      if (
        previous !== void 0 &&
        previous.mtimeMs === fingerprint.mtimeMs &&
        previous.size === fingerprint.size &&
        previous.contentHash.length > 0 &&
        cursorAtEnd
      ) {
        nextFiles[stateKey] = expectDefined(previous, "unchanged dreaming file state");
        continue;
      }
      entry = await buildSessionEntry(file.absolutePath, {
        generatedByDreamingNarrative: file.generatedByDreamingNarrative,
        generatedByCronRun: file.generatedByCronRun,
      });
      if (!entry) continue;
    }
    if (entry.generatedByDreamingNarrative || entry.generatedByCronRun) {
      nextFiles[stateKey] = {
        mtimeMs: fingerprint.mtimeMs,
        size: fingerprint.size,
        contentHash: entry.hash.trim(),
        lineCount: entry.lineMap.length,
        lastContentLine: entry.lineMap.length,
      };
      if (
        !previous ||
        previous.mtimeMs !== fingerprint.mtimeMs ||
        previous.size !== fingerprint.size ||
        previous.contentHash !== entry.hash.trim() ||
        previous.lineCount !== entry.lineMap.length ||
        previous.lastContentLine !== entry.lineMap.length
      )
        changed = true;
      continue;
    }
    const contentHash = entry.hash.trim();
    if (
      previous &&
      previous.mtimeMs === fingerprint.mtimeMs &&
      previous.size === fingerprint.size &&
      previous.contentHash === contentHash &&
      previous.lineCount === entry.lineMap.length &&
      previous.lastContentLine >= previous.lineCount
    ) {
      nextFiles[stateKey] = previous;
      continue;
    }
    const sessionScope =
      file.transcriptSource === "sqlite"
        ? `${file.agentId}:${file.sessionPath}`
        : buildSessionFileScopeKey(file.agentId, file.absolutePath);
    const preFlipSessionScope =
      file.transcriptSource === "sqlite"
        ? buildSessionScopeKey(file.agentId, file.sessionId)
        : void 0;
    const previousSeen = nextSeenMessages[sessionScope] ?? [];
    const seenSet = new Set(previousSeen);
    const preFlipSeenSet = preFlipSessionScope
      ? new Set(nextSeenMessages[preFlipSessionScope] ?? [])
      : null;
    const newSeenHashes = [];
    const lines = entry.content.length > 0 ? entry.content.split("\n") : [];
    const lineCount = lines.length;
    let cursor =
      previous &&
      previous.mtimeMs === fingerprint.mtimeMs &&
      previous.size === fingerprint.size &&
      previous.contentHash === contentHash &&
      previous.lineCount === lineCount
        ? Math.max(0, Math.min(previous.lastContentLine, lineCount))
        : 0;
    const fileCap = Math.max(1, Math.min(perFileCap, remaining));
    let fileCount = 0;
    let lastScannedContentLine = cursor;
    for (let index = cursor; index < lines.length; index += 1) {
      if (fileCount >= fileCap || remaining <= 0) break;
      lastScannedContentLine = index + 1;
      const snippet = normalizeSessionCorpusSnippet(lines[index] ?? "");
      if (snippet.length < SESSION_INGESTION_MIN_SNIPPET_CHARS) continue;
      const lineNumber = entry.lineMap[index] ?? index + 1;
      const messageTimestampMs = entry.messageTimestampsMs[index] ?? 0;
      const day = formatMemoryDreamingDay(
        messageTimestampMs > 0 ? messageTimestampMs : fingerprint.mtimeMs,
        params.timezone,
      );
      if (!isDayWithinLookback(day, cutoffMs)) continue;
      const dedupeBasis =
        messageTimestampMs > 0 ? `ts:${Math.floor(messageTimestampMs)}` : `line:${lineNumber}`;
      const messageHash = hashSessionMessageId(`${sessionScope}\n${dedupeBasis}\n${snippet}`);
      const preFlipMessageHash = preFlipSessionScope
        ? hashSessionMessageId(`${preFlipSessionScope}\n${dedupeBasis}\n${snippet}`)
        : void 0;
      if (
        seenSet.has(messageHash) ||
        (preFlipMessageHash !== void 0 && preFlipSeenSet?.has(preFlipMessageHash))
      )
        continue;
      const rendered = buildSessionRenderedLine({
        agentId: file.agentId,
        sessionPath: file.sessionPath,
        lineNumber,
        snippet,
      });
      const bucket = batchByDay.get(day) ?? [];
      bucket.push({
        day,
        snippet,
        rendered,
      });
      batchByDay.set(day, bucket);
      seenSet.add(messageHash);
      newSeenHashes.push(messageHash);
      fileCount += 1;
      remaining -= 1;
    }
    if (lastScannedContentLine < cursor) lastScannedContentLine = cursor;
    cursor = Math.max(0, Math.min(lastScannedContentLine, lineCount));
    nextFiles[stateKey] = {
      mtimeMs: fingerprint.mtimeMs,
      size: fingerprint.size,
      contentHash,
      lineCount,
      lastContentLine: cursor,
    };
    const mergedSeen = mergeTrackedMessageHashes(previousSeen, newSeenHashes);
    nextSeenMessages[sessionScope] = mergedSeen;
    if (!areStringArraysEqual(mergedSeen, previousSeen)) changed = true;
    if (
      !previous ||
      previous.mtimeMs !== fingerprint.mtimeMs ||
      previous.size !== fingerprint.size ||
      previous.contentHash !== contentHash ||
      previous.lineCount !== lineCount ||
      previous.lastContentLine !== cursor
    )
      changed = true;
  }
  for (const [key, state] of Object.entries(params.state.files)) {
    if (!Object.hasOwn(nextFiles, key)) {
      changed = true;
      continue;
    }
    const next = nextFiles[key];
    if (!next || next.mtimeMs !== state.mtimeMs || next.size !== state.size) changed = true;
    if (
      next &&
      typeof state.contentHash === "string" &&
      state.contentHash.trim().length > 0 &&
      next.contentHash !== state.contentHash
    )
      changed = true;
    if (
      !next ||
      next.lineCount !== state.lineCount ||
      next.lastContentLine !== state.lastContentLine
    )
      changed = true;
  }
  const trimmedSeenMessages = trimTrackedSessionScopes(nextSeenMessages);
  for (const [scope, hashes] of Object.entries(trimmedSeenMessages))
    if (!areStringArraysEqual(params.state.seenMessages[scope] ?? [], hashes)) changed = true;
  for (const scope of Object.keys(params.state.seenMessages))
    if (!Object.hasOwn(trimmedSeenMessages, scope)) changed = true;
  const batches = [];
  for (const day of [...batchByDay.keys()].toSorted()) {
    const lines = batchByDay.get(day) ?? [];
    if (lines.length === 0) continue;
    const results = await appendSessionCorpusLines({
      workspaceDir: params.workspaceDir,
      day,
      lines,
    });
    if (results.length > 0)
      batches.push({
        day,
        results,
      });
  }
  return {
    batches,
    nextState: {
      version: 3,
      files: nextFiles,
      seenMessages: trimmedSeenMessages,
    },
    changed,
  };
}
async function ingestSessionTranscriptSignals(params) {
  const state = await readSessionIngestionState(params.workspaceDir);
  const collected = await collectSessionIngestionBatches({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
    primaryWorkspaceDir: params.primaryWorkspaceDir,
    lookbackDays: params.lookbackDays,
    nowMs: params.nowMs,
    timezone: params.timezone,
    state,
  });
  const ingestionDayBucket = formatMemoryDreamingDay(params.nowMs, params.timezone);
  for (const batch of collected.batches)
    await recordShortTermRecalls({
      workspaceDir: params.workspaceDir,
      query: `__dreaming_sessions__:${batch.day}`,
      results: batch.results,
      signalType: "daily",
      dedupeByQueryPerDay: true,
      dayBucket: ingestionDayBucket,
      nowMs: params.nowMs,
      timezone: params.timezone,
    });
  if (collected.changed) await writeSessionIngestionState(params.workspaceDir, collected.nextState);
}
async function collectDailyIngestionBatches(params) {
  const memoryDir = path.join(params.workspaceDir, "memory");
  const cutoffMs = calculateLookbackCutoffMs(params.nowMs, params.lookbackDays);
  const files = (
    await fs.readdir(memoryDir, { withFileTypes: true }).catch((err) => {
      if (err?.code === "ENOENT") return [];
      throw err;
    })
  )
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const file = parseDailyMemoryFileName(entry.name);
      if (!file) return null;
      if (!isDayWithinLookback(file.day, cutoffMs)) return null;
      return file;
    })
    .filter((entry) => entry !== null)
    .toSorted(compareDailyMemoryFilesByNewestDay);
  const batches = [];
  const nextFiles = {};
  let changed = false;
  const totalCap = Math.max(20, params.limit * 4);
  const perFileCap = Math.max(6, Math.ceil(totalCap / Math.max(1, Math.max(files.length, 1))));
  let total = 0;
  for (const file of files) {
    const relativePath = `memory/${file.fileName}`;
    const filePath = path.join(memoryDir, file.fileName);
    const stat = await fs.stat(filePath).catch((err) => {
      if (err?.code === "ENOENT") return null;
      throw err;
    });
    if (!stat) continue;
    const fingerprint = {
      mtimeMs: Math.floor(Math.max(0, stat.mtimeMs)),
      size: Math.floor(Math.max(0, stat.size)),
    };
    nextFiles[relativePath] = fingerprint;
    const previous = params.state.files[relativePath];
    const unchanged =
      previous !== void 0 &&
      previous.mtimeMs === fingerprint.mtimeMs &&
      previous.size === fingerprint.size;
    const previousDreamingDay = normalizeMemoryDay(previous?.lastDreamingDayIngested);
    if (unchanged && previousDreamingDay === params.ingestionDreamingDay) {
      nextFiles[relativePath] = {
        ...fingerprint,
        lastDreamingDayIngested: previousDreamingDay,
      };
      continue;
    }
    changed = true;
    const raw = await fs.readFile(filePath, "utf-8").catch((err) => {
      if (err?.code === "ENOENT") return "";
      throw err;
    });
    if (!raw) continue;
    const chunks = buildDailySnippetChunks(
      stripManagedDailyDreamingLines(raw.split(/\r?\n/)),
      perFileCap,
    );
    const results = [];
    for (const chunk of chunks) {
      results.push({
        path: relativePath,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        score: DAILY_INGESTION_SCORE,
        snippet: chunk.snippet,
        source: "memory",
      });
      if (results.length >= perFileCap || total + results.length >= totalCap) break;
    }
    if (results.length === 0) continue;
    batches.push({
      day: file.day,
      results,
    });
    total += results.length;
    nextFiles[relativePath] = {
      ...fingerprint,
      lastDreamingDayIngested: params.ingestionDreamingDay,
    };
    if (total >= totalCap) break;
  }
  if (!changed) {
    const previousKeys = Object.keys(params.state.files);
    const nextKeys = Object.keys(nextFiles);
    if (
      previousKeys.length !== nextKeys.length ||
      previousKeys.some((key) => !Object.hasOwn(nextFiles, key))
    )
      changed = true;
  }
  return {
    batches,
    nextState: {
      version: 1,
      files: nextFiles,
    },
    changed,
  };
}
async function ingestDailyMemorySignals(params) {
  const state = await readDailyIngestionState(params.workspaceDir);
  const ingestionDayBucket = formatMemoryDreamingDay(params.nowMs, params.timezone);
  const collected = await collectDailyIngestionBatches({
    workspaceDir: params.workspaceDir,
    lookbackDays: params.lookbackDays,
    limit: params.limit,
    nowMs: params.nowMs,
    ingestionDreamingDay: ingestionDayBucket,
    state,
  });
  for (const batch of collected.batches)
    await recordShortTermRecalls({
      workspaceDir: params.workspaceDir,
      query: `__dreaming_daily__:${batch.day}`,
      results: batch.results,
      signalType: "daily",
      dedupeByQueryPerDay: true,
      dayBucket: ingestionDayBucket,
      nowMs: params.nowMs,
      timezone: params.timezone,
    });
  if (collected.changed) await writeDailyIngestionState(params.workspaceDir, collected.nextState);
}
async function seedHistoricalDailyMemorySignals(params) {
  const normalizedPaths = uniqueStrings(normalizeStringEntries(params.filePaths));
  if (normalizedPaths.length === 0)
    return {
      importedFileCount: 0,
      importedSignalCount: 0,
      skippedPaths: [],
    };
  const resolved = normalizedPaths
    .map((filePath) => {
      const fileName = path.basename(filePath);
      const file = parseDailyMemoryFileName(fileName);
      if (!file)
        return {
          filePath,
          fileName,
          relativePath: "",
          file: null,
        };
      return {
        filePath,
        fileName,
        relativePath: resolveWorkspaceMemoryRelativePath(params.workspaceDir, filePath),
        file,
      };
    })
    .toSorted((a, b) => {
      if (a.file && b.file) return compareDailyMemoryFilesByNewestDay(a.file, b.file);
      if (a.file) return -1;
      if (b.file) return 1;
      return a.filePath.localeCompare(b.filePath);
    });
  const valid = resolved.filter((entry) => Boolean(entry.file));
  const skippedPaths = resolved.filter((entry) => !entry.file).map((entry) => entry.filePath);
  const totalCap = Math.max(20, params.limit * 4);
  const perFileCap = Math.max(6, Math.ceil(totalCap / Math.max(1, valid.length)));
  let importedSignalCount = 0;
  let importedFileCount = 0;
  for (const entry of valid) {
    if (importedSignalCount >= totalCap) break;
    const raw = await fs.readFile(entry.filePath, "utf-8").catch((err) => {
      if (err?.code === "ENOENT") {
        skippedPaths.push(entry.filePath);
        return "";
      }
      throw err;
    });
    if (!raw) continue;
    const chunks = buildDailySnippetChunks(
      stripManagedDailyDreamingLines(raw.split(/\r?\n/)),
      perFileCap,
    );
    const results = [];
    for (const chunk of chunks) {
      results.push({
        path: entry.relativePath,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        score: DAILY_INGESTION_SCORE,
        snippet: chunk.snippet,
        source: "memory",
      });
      if (results.length >= perFileCap || importedSignalCount + results.length >= totalCap) break;
    }
    if (results.length === 0) continue;
    await recordShortTermRecalls({
      workspaceDir: params.workspaceDir,
      query: `__dreaming_daily__:${entry.file.day}`,
      results,
      signalType: "daily",
      dedupeByQueryPerDay: true,
      dayBucket: formatMemoryDreamingDay(params.nowMs, params.timezone),
      nowMs: params.nowMs,
      timezone: params.timezone,
    });
    importedSignalCount += results.length;
    importedFileCount += 1;
  }
  return {
    importedFileCount,
    importedSignalCount,
    skippedPaths,
  };
}
function entryAverageScore(entry) {
  const signalCount = Math.max(
    0,
    Math.floor(entry.recallCount ?? 0) +
      Math.floor(entry.dailyCount ?? 0) +
      Math.floor(entry.groundedCount ?? 0),
  );
  return signalCount > 0 ? Math.max(0, Math.min(1, entry.totalScore / signalCount)) : 0;
}
function dedupeEntries(entries, threshold) {
  const deduped = [];
  for (const entry of entries) {
    const duplicate = deduped.find(
      (candidate) =>
        candidate.path === entry.path &&
        textSimilarity(candidate.snippet, entry.snippet) >= threshold,
    );
    if (duplicate) {
      if (entry.recallCount > duplicate.recallCount) duplicate.recallCount = entry.recallCount;
      duplicate.totalScore = Math.max(duplicate.totalScore, entry.totalScore);
      duplicate.maxScore = Math.max(duplicate.maxScore, entry.maxScore);
      duplicate.queryHashes = uniqueStrings([...duplicate.queryHashes, ...entry.queryHashes]);
      duplicate.recallDays = [
        .../* @__PURE__ */ new Set([...duplicate.recallDays, ...entry.recallDays]),
      ].toSorted();
      duplicate.conceptTags = uniqueStrings([...duplicate.conceptTags, ...entry.conceptTags]);
      duplicate.lastRecalledAt =
        Date.parse(entry.lastRecalledAt) > Date.parse(duplicate.lastRecalledAt)
          ? entry.lastRecalledAt
          : duplicate.lastRecalledAt;
      continue;
    }
    deduped.push({ ...entry });
  }
  return deduped;
}
function normalizeDiaryCoverageText(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}
function isEntryCoveredByRecentDiary(entry, recentDiaryEntries) {
  const snippet = normalizeDiaryCoverageText(entry.snippet);
  if (!snippet) return false;
  return recentDiaryEntries.some((diaryEntry) => {
    return (
      normalizeDiaryCoverageText(diaryEntry).includes(snippet) ||
      textSimilarity(entry.snippet, diaryEntry) >= LIGHT_DIARY_SNIPPET_SIMILARITY_THRESHOLD
    );
  });
}
function prioritizeLightEntriesByDiaryCoverage(entries, recentDiaryEntries) {
  if (recentDiaryEntries.length === 0) return entries;
  const fresh = [];
  const covered = [];
  for (const entry of entries)
    if (isEntryCoveredByRecentDiary(entry, recentDiaryEntries)) covered.push(entry);
    else fresh.push(entry);
  return [...fresh, ...covered];
}
function buildLightDreamingBody(entries) {
  if (entries.length === 0) return ["- No notable updates."];
  const lines = [];
  for (const entry of entries) {
    const snippet = entry.snippet || "(no snippet captured)";
    lines.push(`- Candidate: ${snippet}`);
    lines.push(`  - confidence: ${entryAverageScore(entry).toFixed(2)}`);
    lines.push(`  - evidence: ${entry.path}:${entry.startLine}-${entry.endLine}`);
    lines.push(`  - recalls: ${entry.recallCount}`);
    lines.push(`  - status: staged`);
  }
  return lines;
}
function calculateCandidateTruthConfidence(entry) {
  const recallStrength = Math.min(1, Math.log1p(entry.recallCount) / Math.log1p(6));
  const averageScore = entryAverageScore(entry);
  const consolidation = Math.min(1, (entry.recallDays?.length ?? 0) / 3);
  const conceptual = Math.min(1, (entry.conceptTags?.length ?? 0) / 6);
  return Math.max(
    0,
    Math.min(
      1,
      averageScore * 0.45 + recallStrength * 0.25 + consolidation * 0.2 + conceptual * 0.1,
    ),
  );
}
function selectRemCandidateTruths(entries, limit) {
  if (limit <= 0) return [];
  return dedupeEntries(
    entries.filter((entry) => !entry.promotedAt),
    0.88,
  )
    .map((entry) => ({
      key: entry.key,
      snippet: entry.snippet || "(no snippet captured)",
      confidence: calculateCandidateTruthConfidence(entry),
      evidence: `${entry.path}:${entry.startLine}-${entry.endLine}`,
    }))
    .filter((entry) => entry.confidence >= 0.45)
    .toSorted((a, b) => b.confidence - a.confidence || a.snippet.localeCompare(b.snippet))
    .slice(0, limit);
}
function buildRemReflections(entries, limit, minPatternStrength) {
  const tagStats = /* @__PURE__ */ new Map();
  for (const entry of entries)
    for (const tag of entry.conceptTags) {
      if (!tag || REM_REFLECTION_TAG_BLACKLIST.has(tag.toLowerCase())) continue;
      const stat = tagStats.get(tag) ?? {
        count: 0,
        evidence: /* @__PURE__ */ new Set(),
      };
      stat.count += 1;
      stat.evidence.add(`${entry.path}:${entry.startLine}-${entry.endLine}`);
      tagStats.set(tag, stat);
    }
  const ranked = [...tagStats.entries()]
    .map(([tag, stat]) => {
      return {
        tag,
        strength: Math.min(1, (stat.count / Math.max(1, entries.length)) * 2),
        stat,
      };
    })
    .filter((entry) => entry.strength >= minPatternStrength)
    .toSorted(
      (a, b) =>
        b.strength - a.strength || b.stat.count - a.stat.count || a.tag.localeCompare(b.tag),
    )
    .slice(0, limit);
  if (ranked.length === 0) return ["- No strong patterns surfaced."];
  const lines = [];
  for (const entry of ranked) {
    lines.push(`- Theme: \`${entry.tag}\` kept surfacing across ${entry.stat.count} memories.`);
    lines.push(`  - confidence: ${entry.strength.toFixed(2)}`);
    lines.push(`  - evidence: ${[...entry.stat.evidence].slice(0, 3).join(", ")}`);
    lines.push(`  - note: reflection`);
  }
  return lines;
}
function previewRemDreaming(params) {
  const reflections = buildRemReflections(params.entries, params.limit, params.minPatternStrength);
  const candidateSelections = selectRemCandidateTruths(
    params.entries,
    Math.max(1, Math.min(3, params.limit)),
  );
  const candidateTruths = candidateSelections.map((entry) => ({
    snippet: entry.snippet,
    confidence: entry.confidence,
    evidence: entry.evidence,
  }));
  const candidateKeys = uniqueStrings(candidateSelections.map((entry) => entry.key));
  const bodyLines = [
    "### Reflections",
    ...reflections,
    "",
    "### Possible Lasting Truths",
    ...(candidateTruths.length > 0
      ? candidateTruths.map(
          (entry) =>
            `- ${entry.snippet} [confidence=${entry.confidence.toFixed(2)} evidence=${entry.evidence}]`,
        )
      : ["- No strong candidate truths surfaced."]),
  ];
  return {
    sourceEntryCount: params.entries.length,
    reflections,
    candidateTruths,
    candidateKeys,
    bodyLines,
  };
}
async function runLightDreaming(params) {
  const nowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
  await ingestDailyMemorySignals({
    workspaceDir: params.workspaceDir,
    lookbackDays: params.config.lookbackDays,
    limit: params.config.limit,
    nowMs,
    timezone: params.config.timezone,
  });
  await ingestSessionTranscriptSignals({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
    primaryWorkspaceDir: params.primaryWorkspaceDir,
    lookbackDays: params.config.lookbackDays,
    nowMs,
    timezone: params.config.timezone,
  });
  const rankedEntries = dedupeEntries(
    (
      await filterLiveShortTermRecallEntries({
        workspaceDir: params.workspaceDir,
        entries: await filterFreshLightDreamingEntries({
          workspaceDir: params.workspaceDir,
          nowMs,
          entries: filterRecallEntriesWithinLookback({
            entries: await readShortTermRecallEntries({
              workspaceDir: params.workspaceDir,
              nowMs,
            }),
            nowMs,
            lookbackDays: params.config.lookbackDays,
          }),
        }),
      })
    ).toSorted((a, b) => {
      const byTime = Date.parse(b.lastRecalledAt) - Date.parse(a.lastRecalledAt);
      if (byTime !== 0) return byTime;
      return b.recallCount - a.recallCount;
    }),
    params.config.dedupeSimilarity,
  );
  const recentDiaryEntries = await readRecentDreamDiaryEntries({
    workspaceDir: params.workspaceDir,
    limit: LIGHT_DIARY_HISTORY_LIMIT,
  });
  const entries = prioritizeLightEntriesByDiaryCoverage(rankedEntries, recentDiaryEntries);
  const capped = entries.slice(0, params.config.limit);
  const bodyLines = buildLightDreamingBody(capped);
  await writeDailyDreamingPhaseBlock({
    workspaceDir: params.workspaceDir,
    phase: "light",
    bodyLines,
    nowMs,
    timezone: params.config.timezone,
    storage: params.config.storage,
  });
  await recordDreamingPhaseSignals({
    workspaceDir: params.workspaceDir,
    phase: "light",
    keys: capped.map((entry) => entry.key),
    nowMs,
  });
  if (params.config.enabled && entries.length > 0 && params.config.storage.mode !== "separate")
    params.logger.info(
      `memory-core: light dreaming staged ${Math.min(entries.length, params.config.limit)} candidate(s) [workspace=${params.workspaceDir}].`,
    );
  if (params.subagent && capped.length > 0) {
    const themes = uniqueStrings(capped.flatMap((e) => e.conceptTags).filter(Boolean));
    const data = {
      phase: "light",
      snippets: capped.map((e) => e.snippet).filter(Boolean),
      currentDate: formatMemoryDreamingDay(nowMs, params.config.timezone),
      ...(themes.length > 0 ? { themes } : {}),
      ...(recentDiaryEntries.length > 0 ? { recentDiaryEntries } : {}),
    };
    if (params.detachNarratives)
      runDetachedDreamNarrative({
        subagent: params.subagent,
        workspaceDir: params.workspaceDir,
        data,
        nowMs,
        timezone: params.config.timezone,
        model: params.config.execution?.model,
        logger: params.logger,
      });
    else
      await generateAndAppendDreamNarrative({
        subagent: params.subagent,
        workspaceDir: params.workspaceDir,
        data,
        nowMs,
        timezone: params.config.timezone,
        model: params.config.execution?.model,
        logger: params.logger,
      });
  }
}
async function runRemDreaming(params) {
  const nowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
  await ingestDailyMemorySignals({
    workspaceDir: params.workspaceDir,
    lookbackDays: params.config.lookbackDays,
    limit: params.config.limit,
    nowMs,
    timezone: params.config.timezone,
  });
  await ingestSessionTranscriptSignals({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
    primaryWorkspaceDir: params.primaryWorkspaceDir,
    lookbackDays: params.config.lookbackDays,
    nowMs,
    timezone: params.config.timezone,
  });
  const allEntries = await filterLiveShortTermRecallEntries({
    workspaceDir: params.workspaceDir,
    entries: filterRecallEntriesWithinLookback({
      entries: await readShortTermRecallEntries({
        workspaceDir: params.workspaceDir,
        nowMs,
      }),
      nowMs,
      lookbackDays: params.config.lookbackDays,
    }),
  });
  const lightKeys = await readLightStagedKeys({
    workspaceDir: params.workspaceDir,
    nowMs,
  });
  const stagedEntries =
    lightKeys.size > 0 ? allEntries.filter((entry) => lightKeys.has(entry.key)) : [];
  const entries = stagedEntries.length > 0 ? stagedEntries : allEntries;
  const preview = previewRemDreaming({
    entries,
    limit: params.config.limit,
    minPatternStrength: params.config.minPatternStrength,
  });
  await writeDailyDreamingPhaseBlock({
    workspaceDir: params.workspaceDir,
    phase: "rem",
    bodyLines: preview.bodyLines,
    nowMs,
    timezone: params.config.timezone,
    storage: params.config.storage,
  });
  if (stagedEntries.length > 0)
    await recordRemConsideredPhaseSignals({
      workspaceDir: params.workspaceDir,
      keys: stagedEntries.map((entry) => entry.key),
      nowMs,
    });
  await recordDreamingPhaseSignals({
    workspaceDir: params.workspaceDir,
    phase: "rem",
    keys: preview.candidateKeys,
    nowMs,
  });
  if (params.config.enabled && entries.length > 0 && params.config.storage.mode !== "separate")
    params.logger.info(
      `memory-core: REM dreaming wrote reflections from ${entries.length} recent memory trace(s) [workspace=${params.workspaceDir}].`,
    );
  if (params.subagent && entries.length > 0) {
    const snippets = preview.candidateTruths.map((t) => t.snippet).filter(Boolean);
    const themes = preview.reflections.filter(
      (r) => !r.startsWith("- No strong") && !r.startsWith("  -"),
    );
    const data = {
      phase: "rem",
      snippets:
        snippets.length > 0
          ? snippets
          : entries
              .slice(0, 8)
              .map((e) => e.snippet)
              .filter(Boolean),
      ...(themes.length > 0 ? { themes } : {}),
    };
    if (params.detachNarratives)
      runDetachedDreamNarrative({
        subagent: params.subagent,
        workspaceDir: params.workspaceDir,
        data,
        nowMs,
        timezone: params.config.timezone,
        model: params.config.execution?.model,
        logger: params.logger,
      });
    else
      await generateAndAppendDreamNarrative({
        subagent: params.subagent,
        workspaceDir: params.workspaceDir,
        data,
        nowMs,
        timezone: params.config.timezone,
        model: params.config.execution?.model,
        logger: params.logger,
      });
  }
}
async function runDreamingSweepPhases(params) {
  const sweepNowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
  const light = resolveMemoryLightDreamingConfig({
    pluginConfig: params.pluginConfig,
    cfg: params.cfg,
  });
  if (light.enabled && light.limit > 0)
    try {
      await runLightDreaming({
        workspaceDir: params.workspaceDir,
        cfg: params.cfg,
        config: light,
        logger: params.logger,
        subagent: params.subagent,
        nowMs: sweepNowMs,
        detachNarratives: params.detachNarratives,
      });
    } catch (err) {
      await appendFailedDreamingEvent({
        workspaceDir: params.workspaceDir,
        phase: "light",
        error: formatErrorMessage(err),
        storageMode: light.storage.mode,
        nowMs: sweepNowMs,
        logger: params.logger,
      });
      throw err;
    }
  const rem = resolveMemoryRemDreamingConfig({
    pluginConfig: params.pluginConfig,
    cfg: params.cfg,
  });
  if (rem.enabled && rem.limit > 0)
    try {
      await runRemDreaming({
        workspaceDir: params.workspaceDir,
        cfg: params.cfg,
        config: rem,
        logger: params.logger,
        subagent: params.subagent,
        nowMs: sweepNowMs,
        detachNarratives: params.detachNarratives,
      });
    } catch (err) {
      await appendFailedDreamingEvent({
        workspaceDir: params.workspaceDir,
        phase: "rem",
        error: formatErrorMessage(err),
        storageMode: rem.storage.mode,
        nowMs: sweepNowMs,
        logger: params.logger,
      });
      throw err;
    }
}
//#endregion
export {
  normalizeSessionIngestionState as a,
  seedHistoricalDailyMemorySignals as c,
  normalizeDailyIngestionState as i,
  SESSION_INGESTION_STATE_RELATIVE_PATH as n,
  previewRemDreaming as o,
  filterRecallEntriesWithinLookback as r,
  runDreamingSweepPhases as s,
  DAILY_INGESTION_STATE_RELATIVE_PATH as t,
};
