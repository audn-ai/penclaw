import fs from "node:fs/promises";
import "../../fs-safe-RNq3oO57.js";
import os from "node:os";
import path from "node:path";
import { o as resolveAgentWorkspaceDir } from "../../agent-scope-config-DVIR1nBa.js";
import { l as resolveAgentIdByWorkspacePath } from "../../agent-scope-y9xQv_q1.js";
import { r as resolveHookConfig } from "../../config-CzBjCjbr.js";
import { i as sanitizeModelSpecialTokens } from "../../external-content-rRQGoatE.js";
import { i as hasInterSessionUserProvenance } from "../../input-provenance-Xst3EirW.js";
import { t as generateSlugViaLLM } from "../../llm-slug-generator-BdAFwEvj.js";
import { y as resolveStateDir } from "../../paths-DEklnbzU.js";
import { a as root } from "../../secure-temp-dir-DMUMnweR.js";
import {
  C as loadTranscriptEvents,
  Mt as selectVisibleTranscriptEvents,
} from "../../session-accessor-PZVNxFCV.js";
import {
  d as resolveAgentIdFromSessionKey,
  v as toAgentStoreSessionKey,
} from "../../session-key-druuY-GG.js";
import { c as parseAgentSessionKey } from "../../session-key-utils-B8sNp9l4.js";
import { n as parseSqliteSessionFileMarker } from "../../sqlite-marker-BejbySI1.js";
import { t as createSubsystemLogger } from "../../subsystem-Nlw-XKx1.js";
import { i as isOpenClawDeliveryMirrorAssistantMessage } from "../../transcript-only-openclaw-assistant-BDZ_IroQ.js";
import { h as shortenHomePath } from "../../utils-DtcDeqWS.js";
//#region src/hooks/bundled/session-memory/transcript.ts
const SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX = String.raw`(?:(?:\|DSML\|)|(?:\uFF5CDSML\uFF5C))?`;
const SESSION_MEMORY_TOOL_DIRECTIVE_KIND = String.raw`(?:tool_calls?|function_calls?|tool_use_error)`;
const SESSION_MEMORY_DROP_BLOCK_RE = new RegExp(
  String.raw`<${SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX}${SESSION_MEMORY_TOOL_DIRECTIVE_KIND}\b[^>]*>` +
    String.raw`[\s\S]*?(?:<\/${SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX}${SESSION_MEMORY_TOOL_DIRECTIVE_KIND}>|$)`,
  "gi",
);
const SESSION_MEMORY_ROLE_DIRECTIVE_BLOCK_RE = /<(system|assistant|user)\b[^>]*>[\s\S]*?<\/\1>/gi;
const SESSION_MEMORY_ROLE_DIRECTIVE_TAG_RE = /<\/?(?:system|assistant|user)\b[^>]*>/gi;
const SESSION_MEMORY_MEDIA_PLACEHOLDER_RE = /(^|\n)\s*<media:[^>]+>(?:\s*\([^)]*\))?\s*/gi;
const SESSION_MEMORY_TRAILING_NO_REPLY_RE = /(?:^|\n)\s*NO_REPLY\s*$/i;
function isNoReplyMarker(text) {
  const trimmed = text.trim();
  return /^NO_REPLY$/i.test(trimmed) || /^\{\s*"action"\s*:\s*"NO_REPLY"\s*\}$/i.test(trimmed);
}
function sanitizeSessionMemoryTranscriptText(text) {
  if (isNoReplyMarker(text)) return null;
  return (
    sanitizeModelSpecialTokens(text)
      .replace(SESSION_MEMORY_DROP_BLOCK_RE, "")
      .replace(SESSION_MEMORY_ROLE_DIRECTIVE_BLOCK_RE, "")
      .replace(SESSION_MEMORY_ROLE_DIRECTIVE_TAG_RE, "")
      .replace(SESSION_MEMORY_MEDIA_PLACEHOLDER_RE, "$1")
      .replace(SESSION_MEMORY_TRAILING_NO_REPLY_RE, "")
      .trim() || null
  );
}
function extractTextMessageContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return;
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const candidate = block;
    if (candidate.type === "text" && typeof candidate.text === "string") return candidate.text;
  }
}
function renderSessionMemoryMessage(entry) {
  if (!entry || typeof entry !== "object") return;
  const record = entry;
  if (record.type !== "message" || !record.message) return;
  const role = record.message.role;
  if ((role !== "user" && role !== "assistant") || !("content" in record.message)) return;
  if (role === "user" && hasInterSessionUserProvenance(record.message)) return;
  const text = extractTextMessageContent(record.message.content);
  const sanitized = text ? sanitizeSessionMemoryTranscriptText(text) : null;
  if (!sanitized) return;
  if (sanitized.startsWith("/"))
    return role === "user"
      ? {
          isDeliveryMirror: false,
          role,
        }
      : void 0;
  return {
    isDeliveryMirror: isOpenClawDeliveryMirrorAssistantMessage(record.message),
    role,
    text: sanitized,
  };
}
/** Renders recent user/assistant transcript events into session memory text. */
function getRecentSessionContentFromEvents(events, messageCount = 15) {
  const allMessages = [];
  let lastAssistantText;
  for (const event of events) {
    const rendered = renderSessionMemoryMessage(event);
    if (!rendered) continue;
    if (rendered.role === "user") lastAssistantText = void 0;
    if (!rendered.text) continue;
    if (rendered.isDeliveryMirror && rendered.text === lastAssistantText) continue;
    allMessages.push(`${rendered.role}: ${rendered.text}`);
    if (rendered.role === "assistant") lastAssistantText = rendered.text;
  }
  return allMessages.slice(-messageCount).join("\n");
}
async function getRecentSessionContent(sessionFilePath, messageCount = 15) {
  try {
    return getRecentSessionContentFromEvents(
      (await fs.readFile(sessionFilePath, "utf-8"))
        .trim()
        .split("\n")
        .flatMap((line) => {
          try {
            return [JSON.parse(line)];
          } catch {
            return [];
          }
        }),
      messageCount,
    );
  } catch {
    return null;
  }
}
async function getRecentSessionContentWithResetFallback(sessionFilePath, messageCount = 15) {
  const primary = await getRecentSessionContent(sessionFilePath, messageCount);
  if (primary) return primary;
  try {
    const dir = path.dirname(sessionFilePath);
    const resetPrefix = `${path.basename(sessionFilePath)}.reset.`;
    const resetCandidates = (await fs.readdir(dir))
      .filter((name) => name.startsWith(resetPrefix))
      .toSorted();
    if (resetCandidates.length === 0) return primary;
    const latestReset = resetCandidates.at(-1);
    if (latestReset === void 0) return primary;
    return (await getRecentSessionContent(path.join(dir, latestReset), messageCount)) || primary;
  } catch {
    return primary;
  }
}
function stripResetSuffix(fileName) {
  const resetIndex = fileName.indexOf(".reset.");
  return resetIndex === -1 ? fileName : fileName.slice(0, resetIndex);
}
async function findPreviousSessionFile(params) {
  try {
    const files = await fs.readdir(params.sessionsDir);
    const fileSet = new Set(files);
    const currentBaseName = params.currentSessionFile
      ? path.basename(params.currentSessionFile)
      : void 0;
    const baseFromReset = currentBaseName ? stripResetSuffix(currentBaseName) : void 0;
    if (baseFromReset && fileSet.has(baseFromReset))
      return path.join(params.sessionsDir, baseFromReset);
    if (currentBaseName?.includes(".reset.") && fileSet.has(currentBaseName))
      return path.join(params.sessionsDir, currentBaseName);
    const trimmedSessionId = params.sessionId?.trim();
    if (trimmedSessionId) {
      const canonicalFile = `${trimmedSessionId}.jsonl`;
      if (fileSet.has(canonicalFile)) return path.join(params.sessionsDir, canonicalFile);
      const [canonicalResetVariant] = files
        .filter((name) => name.startsWith(`${canonicalFile}.reset.`))
        .toSorted()
        .toReversed();
      if (canonicalResetVariant !== void 0)
        return path.join(params.sessionsDir, canonicalResetVariant);
      const [topicVariant] = files
        .filter(
          (name) =>
            name.startsWith(`${trimmedSessionId}-topic-`) &&
            name.endsWith(".jsonl") &&
            !name.includes(".reset."),
        )
        .toSorted()
        .toReversed();
      if (topicVariant !== void 0) return path.join(params.sessionsDir, topicVariant);
      const [topicResetVariant] = files
        .filter(
          (name) => name.startsWith(`${trimmedSessionId}-topic-`) && name.includes(".jsonl.reset."),
        )
        .toSorted()
        .toReversed();
      if (topicResetVariant !== void 0) return path.join(params.sessionsDir, topicResetVariant);
    }
    if (!params.currentSessionFile) return;
    const [nonResetFile] = files
      .filter((name) => name.endsWith(".jsonl") && !name.includes(".reset."))
      .toSorted()
      .toReversed();
    if (nonResetFile !== void 0) return path.join(params.sessionsDir, nonResetFile);
    const [resetFile] = files
      .filter((name) => name.includes(".jsonl.reset."))
      .toSorted()
      .toReversed();
    if (resetFile !== void 0) return path.join(params.sessionsDir, resetFile);
  } catch {}
}
//#endregion
//#region src/hooks/bundled/session-memory/handler.ts
/**
 * Session memory hook handler
 *
 * Saves session context to memory when /new or /reset command is triggered
 * Creates a new dated memory file with a timestamp slug by default
 */
const log = createSubsystemLogger("hooks/session-memory");
function pickDateTimePart(parts, type) {
  return parts.find((part) => part.type === type)?.value;
}
function resolveLocalTimeZone() {
  const timeZone = process.env.TZ?.trim();
  if (!timeZone) return;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(/* @__PURE__ */ new Date());
    return timeZone;
  } catch {
    return;
  }
}
function formatLocalSessionTimestamp(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: resolveLocalTimeZone(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).formatToParts(date);
  const year = pickDateTimePart(parts, "year") ?? String(date.getFullYear()).padStart(4, "0");
  const month = pickDateTimePart(parts, "month") ?? String(date.getMonth() + 1).padStart(2, "0");
  const day = pickDateTimePart(parts, "day") ?? String(date.getDate()).padStart(2, "0");
  const hour = pickDateTimePart(parts, "hour") ?? String(date.getHours()).padStart(2, "0");
  const minute = pickDateTimePart(parts, "minute") ?? String(date.getMinutes()).padStart(2, "0");
  const second = pickDateTimePart(parts, "second") ?? String(date.getSeconds()).padStart(2, "0");
  const timeZoneName = [...parts]
    .toReversed()
    .find((part) => part.type === "timeZoneName")
    ?.value?.trim();
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}:${second}`,
    timeSlug: `${hour}${minute}`,
    timeZoneName,
  };
}
async function resolveAvailableMemoryFilename(params) {
  const basename = `${params.dateStr}-${params.slug}`;
  let suffix = 1;
  while (true) {
    const filename = suffix === 1 ? `${basename}.md` : `${basename}-${suffix}.md`;
    try {
      await fs.access(path.join(params.memoryDir, filename));
      suffix += 1;
    } catch (err) {
      if (err.code === "ENOENT") return filename;
      throw err;
    }
  }
}
async function getRecentSqliteSessionContent(marker, messageCount) {
  try {
    return getRecentSessionContentFromEvents(
      selectVisibleTranscriptEvents(
        await loadTranscriptEvents({
          agentId: marker.agentId,
          sessionId: marker.sessionId,
          storePath: marker.storePath,
        }),
      ),
      messageCount,
    );
  } catch {
    return null;
  }
}
function resolveDisplaySessionKey(params) {
  if (!params.cfg || !params.workspaceDir) return params.sessionKey;
  const workspaceAgentId = resolveAgentIdByWorkspacePath(params.cfg, params.workspaceDir);
  const parsed = parseAgentSessionKey(params.sessionKey);
  if (!workspaceAgentId || !parsed || workspaceAgentId === parsed.agentId) return params.sessionKey;
  return toAgentStoreSessionKey({
    agentId: workspaceAgentId,
    requestKey: parsed.rest,
  });
}
/**
 * Save session context to memory when /new or /reset command is triggered
 */
const pendingSessionMemoryWrites = /* @__PURE__ */ new Set();
async function flushSessionMemoryWritesForTest() {
  await Promise.allSettled(pendingSessionMemoryWrites);
}
async function saveSessionMemoryNow(event) {
  try {
    log.debug("Hook triggered for reset/new command", { action: event.action });
    const context = event.context || {};
    const cfg = context.cfg;
    const contextWorkspaceDir =
      typeof context.workspaceDir === "string" && context.workspaceDir.trim().length > 0
        ? context.workspaceDir
        : void 0;
    const agentId = resolveAgentIdFromSessionKey(event.sessionKey);
    const workspaceDir =
      contextWorkspaceDir ||
      (cfg
        ? resolveAgentWorkspaceDir(cfg, agentId)
        : path.join(resolveStateDir(process.env, os.homedir), "workspace"));
    const displaySessionKey = resolveDisplaySessionKey({
      cfg,
      workspaceDir: contextWorkspaceDir,
      sessionKey: event.sessionKey,
    });
    const memoryDir = path.join(workspaceDir, "memory");
    await fs.mkdir(memoryDir, { recursive: true });
    const localTimestamp = formatLocalSessionTimestamp(new Date(event.timestamp));
    const dateStr = localTimestamp.date;
    const sessionEntry = context.previousSessionEntry || context.sessionEntry || {};
    const currentSessionId = sessionEntry.sessionId;
    let currentSessionFile = sessionEntry.sessionFile || void 0;
    if (!currentSessionFile || currentSessionFile.includes(".reset.")) {
      const sessionsDirs = /* @__PURE__ */ new Set();
      if (currentSessionFile) sessionsDirs.add(path.dirname(currentSessionFile));
      sessionsDirs.add(path.join(workspaceDir, "sessions"));
      for (const sessionsDir of sessionsDirs) {
        const recoveredSessionFile = await findPreviousSessionFile({
          sessionsDir,
          currentSessionFile,
          sessionId: currentSessionId,
        });
        if (!recoveredSessionFile) continue;
        currentSessionFile = recoveredSessionFile;
        log.debug("Found previous session file", { file: currentSessionFile });
        break;
      }
    }
    log.debug("Session context resolved", {
      sessionId: currentSessionId,
      sessionFile: currentSessionFile,
      hasCfg: Boolean(cfg),
    });
    const sessionFile = currentSessionFile || void 0;
    const hookConfig = resolveHookConfig(cfg, "session-memory");
    const messageCount =
      typeof hookConfig?.messages === "number" && hookConfig.messages > 0
        ? hookConfig.messages
        : 15;
    let slug = null;
    let sessionContent = null;
    if (sessionFile) {
      const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
      sessionContent = sqliteMarker
        ? await getRecentSqliteSessionContent(sqliteMarker, messageCount)
        : await getRecentSessionContentWithResetFallback(sessionFile, messageCount);
      log.debug("Session content loaded", {
        length: sessionContent?.length ?? 0,
        messageCount,
      });
      const allowLlmSlug =
        !(
          process.env.OPENCLAW_TEST_FAST === "1" ||
          process.env.VITEST === "true" ||
          process.env.VITEST === "1" ||
          false
        ) && hookConfig?.llmSlug === true;
      if (sessionContent && cfg && allowLlmSlug) {
        log.debug("Calling generateSlugViaLLM...");
        const slugModel = typeof hookConfig?.model === "string" ? hookConfig.model : void 0;
        slug = await generateSlugViaLLM({
          sessionContent,
          cfg,
          model: slugModel,
        });
        log.debug("Generated slug", { slug });
      }
    }
    if (!slug) {
      slug = localTimestamp.timeSlug;
      log.debug("Using fallback timestamp slug", { slug });
    }
    const filename = await resolveAvailableMemoryFilename({
      memoryDir,
      dateStr,
      slug,
    });
    const memoryFilePath = path.join(memoryDir, filename);
    log.debug("Memory file path resolved", {
      filename,
      path: shortenHomePath(memoryFilePath),
    });
    const timeStr = localTimestamp.time;
    const timeZoneSuffix = localTimestamp.timeZoneName ? ` ${localTimestamp.timeZoneName}` : "";
    const sessionId = sessionEntry.sessionId || "unknown";
    const source = context.commandSource || "unknown";
    const entryParts = [
      `# Session: ${dateStr} ${timeStr}${timeZoneSuffix}`,
      "",
      `- **Session Key**: ${displaySessionKey}`,
      `- **Session ID**: ${sessionId}`,
      `- **Source**: ${source}`,
      "",
    ];
    if (sessionContent) entryParts.push("## Conversation Summary", "", sessionContent, "");
    const entry = entryParts.join("\n");
    await (await root(memoryDir)).write(filename, entry, { encoding: "utf-8" });
    log.debug("Memory file written successfully");
    const relPath = shortenHomePath(memoryFilePath);
    log.info(`Session context saved to ${relPath}`);
  } catch (err) {
    if (err instanceof Error)
      log.error("Failed to save session memory", {
        errorName: err.name,
        errorMessage: err.message,
        stack: err.stack,
      });
    else log.error("Failed to save session memory", { error: String(err) });
  }
}
const saveSessionToMemory = (event) => {
  const isResetCommand = event.action === "new" || event.action === "reset";
  if (event.type !== "command" || !isResetCommand) return;
  const writePromise = saveSessionMemoryNow(event);
  pendingSessionMemoryWrites.add(writePromise);
  writePromise.finally(() => {
    pendingSessionMemoryWrites.delete(writePromise);
  });
};
//#endregion
export { saveSessionToMemory as default, flushSessionMemoryWritesForTest };
