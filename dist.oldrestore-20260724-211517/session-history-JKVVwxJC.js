import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";
import "./path-guards-CBe_wA_B.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-BiEZcIls.js";
import {
  c as isToolCallBlock,
  l as resolveToolUseId,
  r as readClaudeCliFallbackSeed,
} from "./cli-session-history.claude-DNOnkIfT.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { _ as cliBackendLog } from "./helpers-CuMRsldS.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import {
  i as resolveSessionFilePathOptions,
  r as resolveSessionFilePath,
} from "./paths-TfuVT-K8.js";
import "./cli-session-history-QegNEJKL.js";
import {
  l as parseSessionEntries,
  s as migrateSessionEntries,
} from "./session-manager-BD4l9VJc.js";
import {
  a as isSilentReplyPrefixText,
  c as stripLeadingSilentToken,
  n as SILENT_REPLY_TOKEN,
  o as isSilentReplyText,
  s as startsWithSilentToken,
} from "./tokens-DKI4eGAu.js";
import {
  c as selectSessionTranscriptLeafControlledPath,
  o as parseSessionTranscriptTreeEntry,
  s as scanSessionTranscriptTree,
} from "./transcript-tree-DuZTyiYZ.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/command/attempt-execution.helpers.ts
/**
 * Helper functions for agent attempt execution, Claude CLI transcript probing,
 * fallback prompts, and ACP visible-text accumulation.
 */
const SESSION_FILE_MAX_RECORDS = 500;
function normalizeClaudeCliSessionId(sessionId) {
  const trimmed = sessionId?.trim();
  if (!trimmed || trimmed.includes("\0") || trimmed.includes("/") || trimmed.includes("\\")) return;
  return trimmed;
}
async function scanJsonlFile(filePath) {
  if (!filePath)
    return {
      fileExists: false,
      hasAssistant: false,
    };
  try {
    const stat = await fs.lstat(filePath);
    if (stat.isSymbolicLink() || !stat.isFile())
      return {
        fileExists: false,
        hasAssistant: false,
      };
    const fh = await fs.open(filePath, "r");
    try {
      const rl = readline.createInterface({ input: fh.createReadStream({ encoding: "utf-8" }) });
      let recordCount = 0;
      for await (const line of rl) {
        if (!line.trim()) continue;
        recordCount++;
        if (recordCount > SESSION_FILE_MAX_RECORDS) break;
        let obj;
        try {
          obj = JSON.parse(line);
        } catch {
          continue;
        }
        if (obj?.message?.role === "assistant")
          return {
            fileExists: true,
            hasAssistant: true,
          };
      }
      return {
        fileExists: true,
        hasAssistant: false,
      };
    } finally {
      await fh.close();
    }
  } catch {
    return {
      fileExists: false,
      hasAssistant: false,
    };
  }
}
async function jsonlFileHasAssistantMessage(filePath) {
  return (await scanJsonlFile(filePath)).hasAssistant;
}
/**
 * Check whether a session transcript file exists and contains at least one
 * assistant message, indicating that the SessionManager has flushed the
 * initial user+assistant exchange to disk.
 */
async function sessionFileHasContent(sessionFile) {
  return await jsonlFileHasAssistantMessage(sessionFile);
}
/** Resolves the expected Claude CLI transcript JSONL path for a session. */
function claudeCliSessionTranscriptPath(params) {
  const sessionId = normalizeClaudeCliSessionId(params.sessionId);
  if (!sessionId) return null;
  const workspaceDir = params.workspaceDir?.trim();
  if (!workspaceDir) return null;
  return path.join(
    resolveClaudeCliProjectDirForWorkspace({
      workspaceDir,
      homeDir: params.homeDir,
    }),
    `${sessionId}.jsonl`,
  );
}
const CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS = 250;
const CLAUDE_CLI_ORPHAN_PROBE_TAIL_BYTES = 1024 * 1024;
/** Checks whether Claude CLI has flushed assistant content for a session. */
async function claudeCliSessionTranscriptHasContent(params) {
  const expectedPath = claudeCliSessionTranscriptPath({
    sessionId: params.sessionId,
    workspaceDir: params.workspaceDir,
    homeDir: params.homeDir,
  });
  if (!expectedPath) return false;
  if ((await scanJsonlFile(expectedPath)).hasAssistant) return true;
  await new Promise((resolve) => {
    setTimeout(resolve, CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS);
  });
  const second = await scanJsonlFile(expectedPath);
  if (second.hasAssistant) return true;
  const sessionId = normalizeClaudeCliSessionId(params.sessionId);
  cliBackendLog.warn(
    `claude-cli transcript probe v4 miss (sessionId-deterministic path, grace ${CLAUDE_CLI_TRANSCRIPT_FLUSH_GRACE_MS}ms): sessionId=${sessionId ?? ""} expectedPath=${expectedPath} fileExists=${second.fileExists}`,
  );
  return false;
}
function toToolContentBlocks(content) {
  if (!Array.isArray(content)) return;
  return content.filter((item) => Boolean(item && typeof item === "object"));
}
function isClaudeTranscriptToolUseBlock(block) {
  const type = block.type;
  return type === "tool_use" || type === "server_tool_use" || type === "mcp_tool_use";
}
function isClaudeTranscriptToolResultBlock(block) {
  const type = block.type;
  return type === "tool_result" || (typeof type === "string" && type.endsWith("_tool_result"));
}
async function jsonlFileHasOrphanedTrailingToolUse(filePath) {
  try {
    const stat = await fs.lstat(filePath);
    if (stat.isSymbolicLink() || !stat.isFile()) return false;
    const fh = await fs.open(filePath, "r");
    try {
      const tailBytes = Math.min(stat.size, CLAUDE_CLI_ORPHAN_PROBE_TAIL_BYTES);
      const start = stat.size - tailBytes;
      const buffer = Buffer.alloc(tailBytes);
      const { bytesRead } = await fh.read(buffer, 0, tailBytes, start);
      let tailText = buffer.toString("utf-8", 0, bytesRead);
      if (start > 0) {
        const firstNewline = tailText.indexOf("\n");
        tailText = firstNewline === -1 ? "" : tailText.slice(firstNewline + 1);
      }
      let lastAssistantToolUseIds = /* @__PURE__ */ new Set();
      let answeredToolResultIds = /* @__PURE__ */ new Set();
      for (const line of tailText.split(/\r?\n/)) {
        if (!line.trim()) continue;
        let obj;
        try {
          obj = JSON.parse(line);
        } catch {
          continue;
        }
        const rec = obj;
        if (rec?.isSidechain === true) continue;
        const message = rec?.message;
        const role = message?.role;
        if (role === "assistant") {
          lastAssistantToolUseIds = /* @__PURE__ */ new Set();
          answeredToolResultIds = /* @__PURE__ */ new Set();
          const blocks = toToolContentBlocks(message?.content);
          if (!blocks) continue;
          for (const block of blocks)
            if (isClaudeTranscriptToolUseBlock(block)) {
              const id = resolveToolUseId(block);
              if (id) lastAssistantToolUseIds.add(id);
            } else if (isClaudeTranscriptToolResultBlock(block)) {
              const id = resolveToolUseId(block);
              if (id) answeredToolResultIds.add(id);
            }
        } else if (role === "user") {
          const blocks = toToolContentBlocks(message?.content);
          if (!blocks) continue;
          for (const block of blocks)
            if (isClaudeTranscriptToolResultBlock(block)) {
              const id = resolveToolUseId(block);
              if (id) answeredToolResultIds.add(id);
            }
        }
      }
      for (const id of lastAssistantToolUseIds) if (!answeredToolResultIds.has(id)) return true;
      return false;
    } finally {
      await fh.close();
    }
  } catch {
    return false;
  }
}
/** Checks whether the latest Claude CLI transcript tail has unanswered tool use. */
async function claudeCliSessionTranscriptHasOrphanedToolUse(params) {
  const expectedPath = claudeCliSessionTranscriptPath({
    sessionId: params.sessionId,
    workspaceDir: params.workspaceDir,
    homeDir: params.homeDir,
  });
  if (!expectedPath) return false;
  return await jsonlFileHasOrphanedTrailingToolUse(expectedPath);
}
/** Builds the retry prompt sent to fallback models after a failed attempt. */
function resolveFallbackRetryPrompt(params) {
  if (!params.isFallbackRetry) return params.body;
  const prelude = params.priorContextPrelude?.trim();
  if (!params.sessionHasHistory && !prelude) return params.body;
  const retryMarked = `[Retry after the previous model attempt failed or timed out]\n\n${params.body}`;
  return prelude ? `${prelude}\n\n${retryMarked}` : retryMarked;
}
const CLAUDE_CLI_FALLBACK_PRELUDE_DEFAULT_CHAR_BUDGET = 8e3;
const CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS = 64;
function extractFallbackTurnText(message) {
  const content = message.content;
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) {
    if (typeof block === "string") {
      parts.push(block);
      continue;
    }
    if (!block || typeof block !== "object") continue;
    const rec = block;
    if (typeof rec.text === "string") {
      parts.push(rec.text);
      continue;
    }
    if (isToolCallBlock(rec) && typeof rec.name === "string") {
      parts.push(`(tool call: ${rec.name})`);
      continue;
    }
    if (rec.type === "tool_result") {
      const inner = typeof rec.content === "string" ? rec.content : void 0;
      if (inner) parts.push(`(tool result: ${inner})`);
      else parts.push("(tool result)");
    }
  }
  return parts.join("\n").trim();
}
function formatFallbackTurns(turns, remainingBudget) {
  if (turns.length === 0 || remainingBudget <= 0)
    return {
      text: "",
      consumed: 0,
    };
  const lines = [];
  let consumed = 0;
  for (let i = turns.length - 1; i >= 0; i -= 1) {
    const turn = turns[i];
    if (!turn || typeof turn !== "object") continue;
    const role = turn.role;
    if (role !== "user" && role !== "assistant") continue;
    const text = extractFallbackTurnText(turn);
    if (!text) continue;
    const line = `${role}: ${text}`;
    if (consumed + line.length + 1 > remainingBudget) break;
    lines.push(line);
    consumed += line.length + 1;
  }
  lines.reverse();
  return {
    text: lines.join("\n"),
    consumed,
  };
}
/**
 * Format a previously-harvested Claude CLI session into a labeled prelude
 * suitable for prepending to a fallback candidate's prompt. Behavior matches
 * Claude Code's own resume strategy after compaction: prefer the explicit
 * summary, then append the most recent turns up to a char budget.
 *
 * Returns an empty string when neither a summary nor any usable turn fits in
 * the budget; callers can treat that as "no context to seed".
 */
function formatClaudeCliFallbackPrelude(seed, options) {
  const charBudget = Math.max(
    CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS,
    options?.charBudget ?? CLAUDE_CLI_FALLBACK_PRELUDE_DEFAULT_CHAR_BUDGET,
  );
  const sections = ["## Prior session context (from claude-cli)"];
  let remaining = charBudget - 42;
  if (seed.summaryText) {
    const summarySection = `\nSummary of earlier conversation:\n${seed.summaryText}`;
    if (summarySection.length <= remaining) {
      sections.push(summarySection);
      remaining -= summarySection.length;
    } else {
      const slice = truncateUtf16Safe(seed.summaryText, Math.max(0, remaining - 64));
      const lastBreak = slice.lastIndexOf(" ");
      const trimmed = lastBreak > 0 ? slice.slice(0, lastBreak).trimEnd() : slice.trimEnd();
      sections.push(`\nSummary of earlier conversation (truncated):\n${trimmed} …`);
      remaining = 0;
    }
  }
  if (remaining > CLAUDE_CLI_FALLBACK_PRELUDE_MIN_TURN_CHARS && seed.recentTurns.length > 0) {
    const { text } = formatFallbackTurns(seed.recentTurns, remaining - 32);
    if (text) sections.push(`\nRecent turns:\n${text}`);
  }
  if (sections.length === 1) return "";
  return sections.join("\n");
}
/**
 * Read the Claude CLI session pointed to by `cliSessionId` and format a
 * fallback prelude. Returns `""` when no session file is found or when the
 * harvested seed has no usable content.
 */
function buildClaudeCliFallbackContextPrelude(params) {
  const sessionId = params.cliSessionId?.trim();
  if (!sessionId) return "";
  const seed = readClaudeCliFallbackSeed({
    cliSessionId: sessionId,
    homeDir: params.homeDir,
  });
  if (!seed) return "";
  return formatClaudeCliFallbackPrelude(seed, { charBudget: params.charBudget });
}
/** Creates an accumulator that strips ACP silent-reply prefixes while streaming. */
function createAcpVisibleTextAccumulator() {
  let pendingSilentPrefix = "";
  let visibleText = "";
  let rawVisibleText = "";
  const startsWithWordChar = (chunk) => /^[\p{L}\p{N}]/u.test(chunk);
  const resolveNextCandidate = (base, chunk) => {
    if (!base) return chunk;
    if (isSilentReplyText(base, "NO_REPLY") && !chunk.startsWith(base) && startsWithWordChar(chunk))
      return chunk;
    if (chunk.startsWith(base) && chunk.length > base.length) return chunk;
    return `${base}${chunk}`;
  };
  const mergeVisibleChunk = (base, chunk) => {
    if (!base)
      return {
        rawText: chunk,
        delta: chunk,
      };
    if (chunk.startsWith(base) && chunk.length > base.length)
      return {
        rawText: chunk,
        delta: chunk.slice(base.length),
      };
    return {
      rawText: `${base}${chunk}`,
      delta: chunk,
    };
  };
  return {
    consume(chunk) {
      if (!chunk) return null;
      if (!visibleText) {
        const leadCandidate = resolveNextCandidate(pendingSilentPrefix, chunk);
        const trimmedLeadCandidate = leadCandidate.trim();
        if (
          isSilentReplyText(trimmedLeadCandidate, "NO_REPLY") ||
          isSilentReplyPrefixText(trimmedLeadCandidate, "NO_REPLY")
        ) {
          pendingSilentPrefix = leadCandidate;
          return null;
        }
        if (startsWithSilentToken(trimmedLeadCandidate, "NO_REPLY")) {
          const stripped = stripLeadingSilentToken(leadCandidate, SILENT_REPLY_TOKEN);
          if (stripped) {
            pendingSilentPrefix = "";
            rawVisibleText = leadCandidate;
            visibleText = stripped;
            return {
              text: stripped,
              delta: stripped,
            };
          }
          pendingSilentPrefix = leadCandidate;
          return null;
        }
        if (pendingSilentPrefix) {
          pendingSilentPrefix = "";
          rawVisibleText = leadCandidate;
          visibleText = leadCandidate;
          return {
            text: visibleText,
            delta: leadCandidate,
          };
        }
      }
      const nextVisible = mergeVisibleChunk(rawVisibleText, chunk);
      rawVisibleText = nextVisible.rawText;
      if (!nextVisible.delta) return null;
      visibleText = `${visibleText}${nextVisible.delta}`;
      return {
        text: visibleText,
        delta: nextVisible.delta,
      };
    },
    finalize() {
      return visibleText.trim();
    },
    finalizeRaw() {
      return visibleText;
    },
  };
}
/** Returns the tail of hook history capped at the configured maximum. */
function limitAgentHookHistoryMessages(messages, maxMessages = 100) {
  if (maxMessages <= 0) return [];
  return messages.slice(-maxMessages);
}
/** Builds hook-visible conversation messages from bounded history plus current turn. */
function buildAgentHookConversationMessages(params) {
  return [
    ...limitAgentHookHistoryMessages(params.historyMessages ?? []),
    ...(params.currentTurnMessages ?? []),
  ];
}
//#endregion
//#region src/agents/cli-runner/session-history.ts
/**
 * Loads and renders persisted session history for CLI session reseeding and
 * context-engine synchronization.
 */
/** Maximum transcript size read for CLI session history. */
const MAX_CLI_SESSION_HISTORY_FILE_BYTES = 5 * 1024 * 1024;
/** Maximum transcript messages exposed to CLI hook history. */
const MAX_CLI_SESSION_HISTORY_MESSAGES = 100;
/** Minimum reseed-history prompt budget for fresh CLI sessions. */
const MAX_CLI_SESSION_RESEED_HISTORY_CHARS = 12 * 1024;
/** Maximum automatic reseed-history prompt budget derived from context size. */
const MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS = 256 * 1024;
const CLI_SESSION_RESEED_HISTORY_CONTEXT_SHARE = 0.08;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const CLI_SESSION_HISTORY_HEADER_READ_BYTES = 64 * 1024;
const RAW_TRANSCRIPT_RESEED_ALLOWED_REASONS = /* @__PURE__ */ new Set([
  "missing-transcript",
  "orphaned-tool-use",
  "message-policy",
  "system-prompt",
  "cwd",
  "mcp",
  "session-expired",
]);
/** Resolves how much prior transcript text may reseed a fresh CLI session. */
function resolveAutoCliSessionReseedHistoryChars(contextWindowTokens) {
  if (!Number.isFinite(contextWindowTokens) || contextWindowTokens <= 0)
    return MAX_CLI_SESSION_RESEED_HISTORY_CHARS;
  const contextShareChars = Math.floor(
    contextWindowTokens * CLI_SESSION_RESEED_HISTORY_CONTEXT_SHARE * CHARS_PER_TOKEN_ESTIMATE,
  );
  return Math.max(
    MAX_CLI_SESSION_RESEED_HISTORY_CHARS,
    Math.min(MAX_AUTO_CLI_SESSION_RESEED_HISTORY_CHARS, contextShareChars),
  );
}
function coerceHistoryText(content) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .flatMap((block) => {
      if (!block || typeof block !== "object") return [];
      const text = block.text;
      return typeof text === "string" && text.trim().length > 0 ? [text.trim()] : [];
    })
    .join("\n")
    .trim();
}
function coerceHistoryTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") return value;
  return 0;
}
function historyEntryToContextEngineMessage(entry) {
  if (entry.type === "message") return entry.message;
  if (entry.type === "custom_message")
    return {
      role: "custom",
      customType: typeof entry.customType === "string" ? entry.customType : "custom",
      content: entry.content,
      display: entry.display !== false,
      details: entry.details,
      timestamp: coerceHistoryTimestamp(entry.timestamp),
    };
  if (entry.type === "branch_summary")
    return {
      role: "branchSummary",
      summary: typeof entry.summary === "string" ? entry.summary : "",
      fromId: typeof entry.fromId === "string" ? entry.fromId : "root",
      timestamp: coerceHistoryTimestamp(entry.timestamp),
    };
}
function loadContextEngineMessagesFromEntries(entries) {
  return entries.flatMap((entry) => {
    const message = historyEntryToContextEngineMessage(entry);
    return message ? [message] : [];
  });
}
function renderHistoryMessage(message) {
  if (!message || typeof message !== "object") return;
  const entry = message;
  const role =
    entry.role === "assistant"
      ? "Assistant"
      : entry.role === "user"
        ? "User"
        : entry.role === "compactionSummary"
          ? "Compaction summary"
          : void 0;
  if (!role) return;
  const text =
    entry.role === "compactionSummary" && typeof entry.summary === "string"
      ? entry.summary.trim()
      : coerceHistoryText(entry.content);
  return text ? `${role}: ${text}` : void 0;
}
/** Builds a reseed prompt that carries prior OpenClaw transcript context. */
function buildCliSessionHistoryPrompt(params) {
  const maxHistoryChars = params.maxHistoryChars ?? 12288;
  const firstEntry = params.messages[0];
  const firstIsCompaction =
    Boolean(firstEntry) &&
    typeof firstEntry === "object" &&
    firstEntry.role === "compactionSummary";
  const summaryRendered = firstIsCompaction ? renderHistoryMessage(firstEntry) : void 0;
  const tailRaw = (firstIsCompaction ? params.messages.slice(1) : params.messages)
    .flatMap((message) => {
      const rendered = renderHistoryMessage(message);
      return rendered ? [rendered] : [];
    })
    .join("\n\n")
    .trim();
  const truncationMarker = "[OpenClaw reseed history truncated; older turns dropped]";
  const renderTruncatedSummaryWithTail = (renderedSummary) => {
    const tailBudget =
      tailRaw.length > 0 ? Math.min(tailRaw.length, Math.floor(maxHistoryChars / 2)) : 0;
    const separatorBudget = tailBudget > 0 ? 2 : 1;
    const summaryTruncated = truncateUtf16Safe(
      renderedSummary,
      Math.max(0, maxHistoryChars - 56 - separatorBudget - tailBudget),
    ).trimEnd();
    const tailTruncated = tailBudget > 0 ? sliceUtf16Safe(tailRaw, -tailBudget).trimStart() : "";
    return [truncationMarker, summaryTruncated, tailTruncated].filter(Boolean).join("\n");
  };
  let renderedHistory;
  if (summaryRendered)
    if (summaryRendered.length >= maxHistoryChars)
      renderedHistory = renderTruncatedSummaryWithTail(summaryRendered);
    else if (tailRaw.length === 0) renderedHistory = summaryRendered;
    else {
      const summaryBlock = `${summaryRendered}\n\n`;
      const remainingBudget = maxHistoryChars - summaryBlock.length;
      if (remainingBudget <= 0) renderedHistory = renderTruncatedSummaryWithTail(summaryRendered);
      else if (tailRaw.length > remainingBudget)
        renderedHistory = `${summaryBlock}${truncationMarker}\n${sliceUtf16Safe(tailRaw, -remainingBudget).trimStart()}`;
      else renderedHistory = `${summaryBlock}${tailRaw}`;
    }
  else
    renderedHistory =
      tailRaw.length > maxHistoryChars
        ? `${truncationMarker}\n${sliceUtf16Safe(tailRaw, -maxHistoryChars).trimStart()}`
        : tailRaw;
  if (!renderedHistory) return;
  return [
    "Continue this conversation using the OpenClaw transcript below as prior session history.",
    "Treat it as authoritative context for this fresh CLI session.",
    "",
    "<conversation_history>",
    renderedHistory,
    "</conversation_history>",
    "",
    "<next_user_message>",
    params.prompt,
    "</next_user_message>",
  ].join("\n");
}
async function safeRealpath(filePath) {
  try {
    return await fs.realpath(filePath);
  } catch {
    return;
  }
}
function isFileNotFoundError(error) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
async function readCliSessionHeaderLine(filePath) {
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(CLI_SESSION_HISTORY_HEADER_READ_BYTES);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const firstChunk = buffer.subarray(0, bytesRead).toString("utf-8");
    const lineEnd = firstChunk.indexOf("\n");
    if (lineEnd < 0) return;
    const line = firstChunk.slice(0, lineEnd);
    return JSON.parse(line).type === "session" ? line : void 0;
  } catch {
    return;
  } finally {
    await handle.close();
  }
}
async function readBoundedCliSessionTranscript(filePath, fileSize) {
  if (fileSize <= 5242880)
    return {
      content: await fs.readFile(filePath, "utf-8"),
      truncated: false,
    };
  cliBackendLog.warn(
    `cli session history truncated to last ${MAX_CLI_SESSION_HISTORY_FILE_BYTES} bytes: ${filePath}`,
  );
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(MAX_CLI_SESSION_HISTORY_FILE_BYTES);
    await handle.read(buffer, 0, buffer.length, fileSize - buffer.length);
    const tail = buffer.toString("utf-8");
    const firstLineEnd = tail.indexOf("\n");
    const completeTail = firstLineEnd >= 0 ? tail.slice(firstLineEnd + 1) : "";
    const headerLine = await readCliSessionHeaderLine(filePath);
    return {
      content: headerLine ? `${headerLine}\n${completeTail}` : completeTail,
      truncated: true,
    };
  } finally {
    await handle.close();
  }
}
function isSafeTruncatedCliSessionTail(entries) {
  const tree = scanSessionTranscriptTree(entries);
  if (tree.hasLeafControl) return !tree.hasInvalidLeafControl;
  const rawIds = /* @__PURE__ */ new Set();
  const childParentIds = /* @__PURE__ */ new Set();
  let truncatedRootParentId;
  for (const entry of entries) {
    const node = parseSessionTranscriptTreeEntry(entry);
    if (!node) continue;
    if (node.appendMode === "side") return false;
    if (node.parentId === null) {
      rawIds.add(node.id);
      continue;
    }
    if (!rawIds.has(node.parentId)) {
      if (truncatedRootParentId !== void 0 || childParentIds.size > 0) return false;
      truncatedRootParentId = node.parentId;
      rawIds.add(node.id);
      continue;
    }
    if (childParentIds.has(node.parentId)) return false;
    childParentIds.add(node.parentId);
    rawIds.add(node.id);
  }
  return true;
}
function parseCliSessionEntries(content) {
  for (const line of content.trim().split("\n")) {
    if (!line.trim()) continue;
    try {
      JSON.parse(line);
    } catch (error) {
      cliBackendLog.warn(`cli session history parse failed: ${formatErrorMessage(error)}`);
      return;
    }
  }
  return parseSessionEntries(content);
}
function resolveSafeCliSessionFile(params) {
  const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.config,
    agentId: params.agentId,
  });
  const pathOptions = resolveSessionFilePathOptions({
    agentId: sessionAgentId ?? defaultAgentId,
    storePath: params.config?.session?.store,
  });
  const sessionFile = resolveSessionFilePath(
    params.sessionId,
    { sessionFile: params.sessionFile },
    pathOptions,
  );
  return {
    sessionFile,
    sessionsDir: pathOptions?.sessionsDir ?? path.dirname(sessionFile),
  };
}
async function loadCliSessionEntries(params) {
  try {
    const { sessionFile, sessionsDir } = resolveSafeCliSessionFile(params);
    const entryStat = await fs.lstat(sessionFile);
    if (!entryStat.isFile() || entryStat.isSymbolicLink()) return [];
    const realSessionsDir = (await safeRealpath(sessionsDir)) ?? path.resolve(sessionsDir);
    const realSessionFile = await safeRealpath(sessionFile);
    if (
      !realSessionFile ||
      realSessionFile === realSessionsDir ||
      !isPathInside(realSessionsDir, realSessionFile)
    )
      return [];
    const stat = await fs.stat(realSessionFile);
    if (!stat.isFile()) return [];
    const transcript = await readBoundedCliSessionTranscript(realSessionFile, stat.size);
    const entries = parseCliSessionEntries(transcript.content);
    if (!entries) return [];
    const rawSessionEntries = entries.filter((entry) => entry.type !== "session");
    if (transcript.truncated && !isSafeTruncatedCliSessionTail(rawSessionEntries)) {
      cliBackendLog.warn(
        `cli session history truncated tail skipped because branch controls are incomplete: ${realSessionFile}`,
      );
      return [];
    }
    migrateSessionEntries(entries);
    const sessionEntries = entries.filter((entry) => entry.type !== "session");
    if (transcript.truncated && !isSafeTruncatedCliSessionTail(sessionEntries)) {
      cliBackendLog.warn(
        `cli session history truncated tail skipped because branch controls are incomplete: ${realSessionFile}`,
      );
      return [];
    }
    return selectSessionTranscriptLeafControlledPath(sessionEntries) ?? sessionEntries;
  } catch (error) {
    if (!isFileNotFoundError(error))
      cliBackendLog.warn(`cli session history load failed: ${formatErrorMessage(error)}`);
    return [];
  }
}
/** Checks whether a safe, bounded transcript file exists for a CLI session. */
async function hasCliSessionTranscript(params) {
  try {
    const { sessionFile, sessionsDir } = resolveSafeCliSessionFile(params);
    const entryStat = await fs.lstat(sessionFile);
    if (!entryStat.isFile() || entryStat.isSymbolicLink()) return false;
    const realSessionsDir = (await safeRealpath(sessionsDir)) ?? path.resolve(sessionsDir);
    const realSessionFile = await safeRealpath(sessionFile);
    if (
      !realSessionFile ||
      realSessionFile === realSessionsDir ||
      !isPathInside(realSessionsDir, realSessionFile)
    )
      return false;
    return (await fs.stat(realSessionFile)).isFile();
  } catch {
    return false;
  }
}
/** Loads transcript messages for CLI lifecycle hook context. */
async function loadCliSessionHistoryMessages(params) {
  return limitAgentHookHistoryMessages(
    (await loadCliSessionEntries(params)).flatMap((entry) => {
      const candidate = entry;
      return candidate.type === "message" ? [candidate.message] : [];
    }),
    MAX_CLI_SESSION_HISTORY_MESSAGES,
  );
}
/** Loads transcript messages formatted for context-engine updates. */
async function loadCliSessionContextEngineMessages(params) {
  const entries = await loadCliSessionEntries(params);
  const latestCompactionIndex = entries.findLastIndex((entry) => {
    const candidate = entry;
    return candidate.type === "compaction" && typeof candidate.summary === "string";
  });
  if (latestCompactionIndex < 0) return loadContextEngineMessagesFromEntries(entries);
  const compaction = entries[latestCompactionIndex];
  const summary = typeof compaction.summary === "string" ? compaction.summary.trim() : "";
  if (!summary) return loadContextEngineMessagesFromEntries(entries);
  const tailMessages = loadContextEngineMessagesFromEntries(
    entries.slice(latestCompactionIndex + 1),
  );
  return [
    {
      role: "compactionSummary",
      summary,
      timestamp: coerceHistoryTimestamp(compaction.timestamp),
      tokensBefore: typeof compaction.tokensBefore === "number" ? compaction.tokensBefore : 0,
      ...(typeof compaction.tokensAfter === "number"
        ? { tokensAfter: compaction.tokensAfter }
        : {}),
      ...(typeof compaction.firstKeptEntryId === "string"
        ? { firstKeptEntryId: compaction.firstKeptEntryId }
        : {}),
      ...(compaction.details !== void 0 ? { details: compaction.details } : {}),
    },
    ...tailMessages,
  ];
}
/** Loads compacted/raw transcript messages eligible for CLI session reseeding. */
async function loadCliSessionReseedMessages(params) {
  const entries = await loadCliSessionEntries(params);
  const loadRawTail = () => {
    if (
      params.allowRawTranscriptReseed !== true ||
      !params.rawTranscriptReseedReason ||
      !RAW_TRANSCRIPT_RESEED_ALLOWED_REASONS.has(params.rawTranscriptReseedReason)
    )
      return [];
    return limitAgentHookHistoryMessages(
      entries.flatMap((entry) => {
        const candidate = entry;
        return candidate.type === "message" ? [candidate.message] : [];
      }),
      MAX_CLI_SESSION_HISTORY_MESSAGES,
    );
  };
  const latestCompactionIndex = entries.findLastIndex((entry) => {
    const candidate = entry;
    return candidate.type === "compaction" && typeof candidate.summary === "string";
  });
  if (latestCompactionIndex < 0) return loadRawTail();
  const compaction = entries[latestCompactionIndex];
  const summary = typeof compaction.summary === "string" ? compaction.summary.trim() : "";
  if (!summary) return loadRawTail();
  const tailMessages = entries.slice(latestCompactionIndex + 1).flatMap((entry) => {
    const candidate = entry;
    return candidate.type === "message" ? [candidate.message] : [];
  });
  return [
    {
      role: "compactionSummary",
      summary,
    },
    ...limitAgentHookHistoryMessages(tailMessages, MAX_CLI_SESSION_HISTORY_MESSAGES - 1),
  ];
}
//#endregion
export {
  loadCliSessionReseedMessages as a,
  buildClaudeCliFallbackContextPrelude as c,
  createAcpVisibleTextAccumulator as d,
  resolveFallbackRetryPrompt as f,
  loadCliSessionHistoryMessages as i,
  claudeCliSessionTranscriptHasContent as l,
  hasCliSessionTranscript as n,
  resolveAutoCliSessionReseedHistoryChars as o,
  sessionFileHasContent as p,
  loadCliSessionContextEngineMessages as r,
  buildAgentHookConversationMessages as s,
  buildCliSessionHistoryPrompt as t,
  claudeCliSessionTranscriptHasOrphanedToolUse as u,
};
