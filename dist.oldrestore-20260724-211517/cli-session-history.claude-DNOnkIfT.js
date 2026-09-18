import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  r as normalizeCliSessionReseedReceipt,
  t as getCliSessionBinding,
} from "./cli-session-binding-CfY4fqsE.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { _ as attachOpenClawTranscriptMeta } from "./session-transcript-readers-Bv0ty7AX.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/cli-runner/reseed-envelope.ts
const RESEED_HEADER = [
  "Continue this conversation using the OpenClaw transcript below as prior session history.",
  "Treat it as authoritative context for this fresh CLI session.",
  "",
  "<conversation_history>",
].join("\n");
const RESEED_PREFIX = `${RESEED_HEADER}\n`;
const RESEED_USER_BOUNDARY = "\n</conversation_history>\n\n<next_user_message>\n";
const RESEED_USER_CLOSE = "\n</next_user_message>";
function hashCliReseedPrompt(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
function parseCliReseedPrompt(text) {
  if (!text.startsWith(RESEED_PREFIX))
    return text.startsWith(RESEED_HEADER) ? { kind: "invalid" } : { kind: "none" };
  const boundaryIndex = text.indexOf(RESEED_USER_BOUNDARY);
  if (boundaryIndex !== text.lastIndexOf(RESEED_USER_BOUNDARY)) return { kind: "invalid" };
  if (boundaryIndex <= RESEED_PREFIX.length) return { kind: "invalid" };
  const promptStart = boundaryIndex + 46;
  const closeIndex = text.lastIndexOf(RESEED_USER_CLOSE);
  if (closeIndex < promptStart) return { kind: "invalid" };
  return {
    kind: "legacy",
    userMessage: text.slice(promptStart, closeIndex),
  };
}
//#endregion
//#region src/chat/tool-content.ts
const TOOL_USE_ID_FIELDS = ["id", "tool_call_id", "toolCallId", "tool_use_id", "toolUseId"];
function normalizeToolContentType(value) {
  return typeof value === "string" ? value.toLowerCase() : "";
}
/** Accepts tool-call content type spellings used by provider SDKs and persisted transcripts. */
function isToolCallContentType(value) {
  const type = normalizeToolContentType(value);
  return type === "toolcall" || type === "tool_call" || type === "tooluse" || type === "tool_use";
}
/** Accepts tool-result content type spellings used by provider SDKs and persisted transcripts. */
function isToolResultContentType(value) {
  const type = normalizeToolContentType(value);
  return type === "toolresult" || type === "tool_result";
}
/** Narrows unknown chat content blocks to provider-shaped tool-call blocks. */
function isToolCallBlock(block) {
  return isToolCallContentType(block.type);
}
/** Narrows unknown chat content blocks to provider-shaped tool-result blocks. */
function isToolResultBlock(block) {
  return isToolResultContentType(block.type);
}
/** Reads the stable tool-use id across snake_case and camelCase provider field names. */
function resolveToolUseId(block) {
  for (const field of TOOL_USE_ID_FIELDS) {
    const id = normalizeOptionalString(block[field]);
    if (id) return id;
  }
}
//#endregion
//#region src/gateway/cli-session-history.claude.ts
const CLAUDE_CLI_PROVIDER = "claude-cli";
const CLAUDE_PROJECTS_RELATIVE_DIR = path.join(".claude", "projects");
function resolveHistoryHomeDir(homeDir) {
  return normalizeOptionalString(homeDir) || process.env.HOME || os.homedir();
}
function resolveClaudeProjectsDir(homeDir) {
  return path.join(resolveHistoryHomeDir(homeDir), CLAUDE_PROJECTS_RELATIVE_DIR);
}
function resolveClaudeCliBindingSessionId(entry) {
  return getCliSessionBinding(entry, CLAUDE_CLI_PROVIDER)?.sessionId;
}
function resolveClaudeCliTimestampMs(value) {
  if (typeof value !== "string") return;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveClaudeCliUsage(raw) {
  if (!raw || typeof raw !== "object") return;
  const input = asFiniteNumber(raw.input_tokens);
  const output = asFiniteNumber(raw.output_tokens);
  const cacheRead = asFiniteNumber(raw.cache_read_input_tokens);
  const cacheWrite = asFiniteNumber(raw.cache_creation_input_tokens);
  if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0)
    return;
  return {
    ...(input !== void 0 ? { input } : {}),
    ...(output !== void 0 ? { output } : {}),
    ...(cacheRead !== void 0 ? { cacheRead } : {}),
    ...(cacheWrite !== void 0 ? { cacheWrite } : {}),
  };
}
function cloneJsonValue(value) {
  return structuredClone(value);
}
function removeContentBlock(content, blockIndex) {
  const nextContent = cloneJsonValue(content);
  nextContent.splice(blockIndex, 1);
  return nextContent.length > 0 ? nextContent : null;
}
function normalizeClaudeCliContent(content, toolNameRegistry) {
  if (!Array.isArray(content)) return cloneJsonValue(content);
  const normalized = [];
  for (const item of content) {
    if (!item || typeof item !== "object") {
      normalized.push(cloneJsonValue(item));
      continue;
    }
    const block = cloneJsonValue(item);
    const type = typeof block.type === "string" ? block.type : "";
    if (type === "tool_use") {
      const id = normalizeOptionalString(block.id) ?? "";
      const name = normalizeOptionalString(block.name) ?? "";
      if (id && name) toolNameRegistry.set(id, name);
      if (block.input !== void 0 && block.arguments === void 0)
        block.arguments = cloneJsonValue(block.input);
      block.type = "toolcall";
      delete block.input;
      normalized.push(block);
      continue;
    }
    if (type === "tool_result") {
      const toolUseId = resolveToolUseId(block);
      if (!block.name && toolUseId) {
        const toolName = toolNameRegistry.get(toolUseId);
        if (toolName) block.name = toolName;
      }
      normalized.push(block);
      continue;
    }
    normalized.push(block);
  }
  return normalized;
}
function getMessageBlocks(message) {
  if (!message || typeof message !== "object") return null;
  const content = message.content;
  return Array.isArray(content) ? content : null;
}
function isAssistantToolCallMessage(message) {
  if (!message || typeof message !== "object") return false;
  if (message.role !== "assistant") return false;
  const blocks = getMessageBlocks(message);
  return Boolean(blocks && blocks.length > 0 && blocks.every(isToolCallBlock));
}
function isUserToolResultMessage(message) {
  if (!message || typeof message !== "object") return false;
  if (message.role !== "user") return false;
  const blocks = getMessageBlocks(message);
  return Boolean(blocks && blocks.length > 0 && blocks.every(isToolResultBlock));
}
function coalesceClaudeCliToolMessages(messages) {
  const coalesced = [];
  for (let index = 0; index < messages.length; index += 1) {
    const current = messages.at(index);
    if (current === void 0) break;
    const next = messages[index + 1];
    if (!isAssistantToolCallMessage(current) || !isUserToolResultMessage(next)) {
      coalesced.push(current);
      continue;
    }
    const callBlocks = getMessageBlocks(current) ?? [];
    const resultBlocks = getMessageBlocks(next) ?? [];
    const callIds = new Set(callBlocks.map(resolveToolUseId).filter((id) => Boolean(id)));
    if (
      !(
        resultBlocks.length > 0 &&
        resultBlocks.every((block) => {
          const toolUseId = resolveToolUseId(block);
          return Boolean(toolUseId && callIds.has(toolUseId));
        })
      )
    ) {
      coalesced.push(current);
      continue;
    }
    coalesced.push({
      ...current,
      content: [...callBlocks.map(cloneJsonValue), ...resultBlocks.map(cloneJsonValue)],
    });
    index += 1;
  }
  return coalesced;
}
function resolveClaudeCliPromptTextCandidates(entry, content) {
  if (entry.isMeta === true || entry.isCompactSummary === true) return [];
  if (typeof content === "string") return [{ text: content }];
  if (
    content.some(
      (item) =>
        item !== null && typeof item === "object" && "type" in item && item.type === "tool_result",
    )
  )
    return [];
  return content.flatMap((item, blockIndex) =>
    item !== null &&
    typeof item === "object" &&
    "type" in item &&
    item.type === "text" &&
    "text" in item &&
    typeof item.text === "string"
      ? [
          {
            text: item.text,
            blockIndex,
          },
        ]
      : [],
  );
}
function parseClaudeCliHistoryEntry(
  entry,
  cliSessionId,
  sourceLineNumber,
  toolNameRegistry,
  options,
) {
  if (entry.isSidechain === true || !entry.message || typeof entry.message !== "object")
    return null;
  const type = typeof entry.type === "string" ? entry.type : void 0;
  const role = typeof entry.message.role === "string" ? entry.message.role : void 0;
  if ((type !== "user" && type !== "assistant") || role !== type) return null;
  const timestamp = resolveClaudeCliTimestampMs(entry.timestamp);
  const externalId = normalizeOptionalString(entry.uuid);
  const baseMeta = {
    id: externalId ?? `claude-cli:${cliSessionId}:line:${sourceLineNumber}`,
    importedFrom: CLAUDE_CLI_PROVIDER,
    cliSessionId,
    ...(externalId ? { externalId } : {}),
  };
  let content =
    typeof entry.message.content === "string" || Array.isArray(entry.message.content)
      ? normalizeClaudeCliContent(entry.message.content, toolNameRegistry)
      : void 0;
  if (content === void 0) return null;
  if (type === "user") {
    const reseedState = options.reseedState;
    const promptTextCandidates = resolveClaudeCliPromptTextCandidates(entry, content);
    if (
      options.reseedMode === "recover" &&
      reseedState &&
      !reseedState.inspectedFirstUser &&
      promptTextCandidates.length > 0
    ) {
      reseedState.inspectedFirstUser = true;
      if (reseedState.receipt) {
        const candidate = promptTextCandidates.length === 1 ? promptTextCandidates[0] : void 0;
        if (candidate && hashCliReseedPrompt(candidate.text) === reseedState.receipt.promptHash) {
          if (candidate.blockIndex === void 0 || !Array.isArray(content)) return null;
          const nextContent = removeContentBlock(content, candidate.blockIndex);
          if (!nextContent) return null;
          content = nextContent;
        }
      } else
        for (const candidate of promptTextCandidates) {
          const reseedPrompt = parseCliReseedPrompt(candidate.text);
          if (reseedPrompt.kind === "legacy") {
            if (candidate.blockIndex === void 0) {
              if (!reseedPrompt.userMessage) return null;
              content = reseedPrompt.userMessage;
            } else if (Array.isArray(content)) {
              if (!reseedPrompt.userMessage) {
                const contentWithoutReseed = removeContentBlock(content, candidate.blockIndex);
                if (!contentWithoutReseed) return null;
                content = contentWithoutReseed;
                break;
              }
              const nextContent = cloneJsonValue(content);
              const block = nextContent[candidate.blockIndex];
              if (block && typeof block === "object") block.text = reseedPrompt.userMessage;
              content = nextContent;
            }
            break;
          }
        }
    }
    return attachOpenClawTranscriptMeta(
      {
        role: "user",
        content,
        ...(timestamp !== void 0 ? { timestamp } : {}),
      },
      baseMeta,
    );
  }
  return attachOpenClawTranscriptMeta(
    {
      role: "assistant",
      content,
      api: "anthropic-messages",
      provider: CLAUDE_CLI_PROVIDER,
      ...(normalizeOptionalString(entry.message.model) ? { model: entry.message.model } : {}),
      ...(normalizeOptionalString(entry.message.stop_reason)
        ? { stopReason: entry.message.stop_reason }
        : {}),
      ...(resolveClaudeCliUsage(entry.message.usage)
        ? { usage: resolveClaudeCliUsage(entry.message.usage) }
        : {}),
      ...(timestamp !== void 0 ? { timestamp } : {}),
    },
    baseMeta,
  );
}
function resolveClaudeCliSessionFilePath(params) {
  const sessionId = params.cliSessionId.trim();
  if (
    !sessionId ||
    sessionId === "." ||
    sessionId === ".." ||
    path.isAbsolute(sessionId) ||
    sessionId.includes("/") ||
    sessionId.includes("\\")
  )
    return;
  const projectsDir = resolveClaudeProjectsDir(params.homeDir);
  let projectEntries;
  try {
    projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of projectEntries) {
    if (!entry.isDirectory()) continue;
    const projectDir = path.join(projectsDir, entry.name);
    const candidate = path.resolve(projectDir, `${sessionId}.jsonl`);
    const resolvedProjectDir = path.resolve(projectDir);
    if (!candidate.startsWith(`${resolvedProjectDir}${path.sep}`)) continue;
    if (fs.existsSync(candidate)) return candidate;
  }
}
/** Reads visible messages for a bound Claude CLI session. */
function readClaudeCliSessionMessages(params) {
  const filePath = resolveClaudeCliSessionFilePath(params);
  if (!filePath) return [];
  let content;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return [];
  }
  const messages = [];
  const toolNameRegistry = /* @__PURE__ */ new Map();
  const localSessionId = normalizeOptionalString(params.localSessionId);
  const normalizedReceipt = normalizeCliSessionReseedReceipt(params.reseedReceipt);
  const reseedState = {
    receipt:
      normalizedReceipt && normalizedReceipt.localSessionId === localSessionId
        ? normalizedReceipt
        : void 0,
    inspectedFirstUser: false,
  };
  const lines = content.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex] ?? "";
    if (!line.trim()) continue;
    try {
      const message = parseClaudeCliHistoryEntry(
        JSON.parse(line),
        params.cliSessionId,
        lineIndex + 1,
        toolNameRegistry,
        {
          reseedMode: "recover",
          reseedState,
        },
      );
      if (message) messages.push(message);
    } catch {}
  }
  return coalesceClaudeCliToolMessages(messages);
}
function isCompactBoundary(entry) {
  if (entry.type !== "system") return false;
  const subtype = entry.subtype;
  return typeof subtype === "string" && subtype === "compact_boundary";
}
function extractCompactBoundaryFallbackText(entry) {
  const content = entry.content;
  return typeof content === "string" && content.trim() ? content.trim() : void 0;
}
function extractSummaryText(entry) {
  if (entry.type !== "summary") return;
  const summary = entry.summary;
  return typeof summary === "string" && summary.trim() ? summary.trim() : void 0;
}
function readClaudeCliFallbackSeed(params) {
  const filePath = resolveClaudeCliSessionFilePath(params);
  if (!filePath) return;
  let content;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return;
  }
  let pendingSummary;
  let lastSummary;
  let lastBoundaryFallback;
  let windowedTurns = [];
  const toolNameRegistry = /* @__PURE__ */ new Map();
  const lines = content.split(/\r?\n/);
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex] ?? "";
    if (!line.trim()) continue;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    const explicitSummary = extractSummaryText(parsed);
    if (explicitSummary) {
      pendingSummary = explicitSummary;
      continue;
    }
    if (isCompactBoundary(parsed)) {
      lastSummary = pendingSummary;
      pendingSummary = void 0;
      lastBoundaryFallback = extractCompactBoundaryFallbackText(parsed) ?? lastBoundaryFallback;
      windowedTurns = [];
      toolNameRegistry.clear();
      continue;
    }
    const message = parseClaudeCliHistoryEntry(
      parsed,
      params.cliSessionId,
      lineIndex + 1,
      toolNameRegistry,
      { reseedMode: "preserve" },
    );
    if (message) windowedTurns.push(message);
  }
  const recentTurns = coalesceClaudeCliToolMessages(windowedTurns);
  const resolvedSummaryText = lastSummary ?? pendingSummary ?? lastBoundaryFallback;
  if (!resolvedSummaryText && recentTurns.length === 0) return;
  return {
    ...(resolvedSummaryText ? { summaryText: resolvedSummaryText } : {}),
    recentTurns,
  };
}
//#endregion
export {
  resolveClaudeCliBindingSessionId as a,
  isToolCallBlock as c,
  parseCliReseedPrompt as d,
  readClaudeCliSessionMessages as i,
  resolveToolUseId as l,
  parseClaudeCliHistoryEntry as n,
  resolveClaudeCliPromptTextCandidates as o,
  readClaudeCliFallbackSeed as r,
  resolveClaudeCliTimestampMs as s,
  CLAUDE_CLI_PROVIDER as t,
  hashCliReseedPrompt as u,
};
