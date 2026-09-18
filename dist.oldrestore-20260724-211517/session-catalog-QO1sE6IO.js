import { spawn } from "node:child_process";
import process from "node:process";
import "./string-coerce-runtime-BUe4iD0r.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as resolveWindowsSpawnProgram,
  r as materializeWindowsSpawnProgram,
} from "./windows-spawn-C5RDaB22.js";
//#region extensions/opencode/session-catalog.ts
const LOCAL_HOST_ID = "gateway";
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 100;
const MAX_SEARCH_LENGTH = 500;
const MAX_CURSOR_LENGTH = 128;
const MAX_CLI_LIST_SESSIONS = 1e4;
const MAX_CLI_OUTPUT_BYTES = 32 * 1024 * 1024;
const MAX_TRANSCRIPT_ITEM_BYTES = 512 * 1024;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
const CLI_TIMEOUT_MS = 3e4;
const SESSION_ID_PATTERN = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
const SAFE_ENV_KEYS = [
  "APPDATA",
  "COMSPEC",
  "HOME",
  "LANG",
  "LC_ALL",
  "LOCALAPPDATA",
  "OPENCODE_DB",
  "PATH",
  "Path",
  "PATHEXT",
  "SYSTEMROOT",
  "TEMP",
  "TMP",
  "TMPDIR",
  "USERPROFILE",
  "WINDIR",
  "XDG_CACHE_HOME",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
  "XDG_STATE_HOME",
];
function optionalOpenCodeString(value, maxLength) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= maxLength ? trimmed : void 0;
}
function boundedLimit(value, fallback = DEFAULT_PAGE_LIMIT) {
  if (value === void 0) return fallback;
  if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > MAX_PAGE_LIMIT)
    throw new Error(`limit must be an integer between 1 and ${String(MAX_PAGE_LIMIT)}`);
  return Number(value);
}
function encodeCursor(offset) {
  return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function decodeCursor(value) {
  if (value === void 0) return 0;
  const cursor = optionalOpenCodeString(value, MAX_CURSOR_LENGTH);
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
function parseListParams(value) {
  if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
  if (!isRecord(value)) throw new Error("OpenCode session list parameters must be an object");
  const unknown = Object.keys(value).find(
    (key) => !["searchTerm", "limit", "cursor"].includes(key),
  );
  if (unknown) throw new Error(`unknown OpenCode session list parameter: ${unknown}`);
  const searchTerm = optionalOpenCodeString(value.searchTerm, MAX_SEARCH_LENGTH);
  if (value.searchTerm !== void 0 && !searchTerm) throw new Error("searchTerm is invalid");
  const cursor = optionalOpenCodeString(value.cursor, MAX_CURSOR_LENGTH);
  if (value.cursor !== void 0 && !cursor) throw new Error("cursor is invalid");
  return {
    limit: boundedLimit(value.limit),
    ...(searchTerm ? { searchTerm } : {}),
    ...(cursor ? { cursor } : {}),
  };
}
function parseReadParams(value) {
  if (!isRecord(value)) throw new Error("OpenCode session read parameters must be an object");
  const unknown = Object.keys(value).find((key) => !["threadId", "limit", "cursor"].includes(key));
  if (unknown) throw new Error(`unknown OpenCode session read parameter: ${unknown}`);
  const threadId = optionalOpenCodeString(value.threadId, 256);
  if (!threadId || !SESSION_ID_PATTERN.test(threadId)) throw new Error("threadId is invalid");
  const cursor = optionalOpenCodeString(value.cursor, MAX_CURSOR_LENGTH);
  if (value.cursor !== void 0 && !cursor) throw new Error("cursor is invalid");
  return {
    threadId,
    limit: boundedLimit(value.limit),
    ...(cursor ? { cursor } : {}),
  };
}
function resolveSpawnInvocation(args) {
  return materializeWindowsSpawnProgram(
    resolveWindowsSpawnProgram({
      command: "opencode",
      platform: process.platform,
      env: process.env,
      execPath: process.execPath,
      packageName: "opencode-ai",
    }),
    args,
  );
}
async function runOpenCode(args) {
  const invocation = resolveSpawnInvocation(args);
  const env = {
    OPENCODE_PURE: "1",
    NO_COLOR: "1",
  };
  for (const key of SAFE_ENV_KEYS) if (process.env[key] !== void 0) env[key] = process.env[key];
  const child = spawn(invocation.command, invocation.argv, {
    env,
    shell: invocation.shell,
    windowsHide: invocation.windowsHide,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const stdout = [];
  const stderr = [];
  let bytes = 0;
  let overflow = false;
  const timeout = setTimeout(() => child.kill("SIGKILL"), CLI_TIMEOUT_MS);
  timeout.unref?.();
  const collect = (target, chunk) => {
    bytes += chunk.length;
    if (bytes > MAX_CLI_OUTPUT_BYTES) {
      overflow = true;
      child.kill("SIGKILL");
      return;
    }
    target.push(chunk);
  };
  child.stdout.on("data", (chunk) => collect(stdout, chunk));
  child.stderr.on("data", (chunk) => collect(stderr, chunk));
  const exitCode = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  }).finally(() => clearTimeout(timeout));
  if (overflow) throw new Error("OpenCode session output exceeded the safety limit");
  if (exitCode !== 0) {
    const detail = Buffer.concat(stderr).toString("utf8").trim();
    throw new Error(detail || `OpenCode exited with code ${String(exitCode)}`);
  }
  return Buffer.concat(stdout).toString("utf8");
}
function parseOpenCodeSession(value) {
  if (!isRecord(value)) return;
  const threadId = optionalOpenCodeString(value.id, 256);
  if (!threadId || !SESSION_ID_PATTERN.test(threadId)) return;
  const name = optionalOpenCodeString(value.title, 1e3);
  const cwd = optionalOpenCodeString(value.directory, 4096);
  const createdAt =
    typeof value.created === "number" && Number.isFinite(value.created) ? value.created : void 0;
  const updatedAt =
    typeof value.updated === "number" && Number.isFinite(value.updated) ? value.updated : void 0;
  return {
    threadId,
    ...(name ? { name } : {}),
    ...(cwd ? { cwd } : {}),
    status: "stored",
    ...(createdAt !== void 0 ? { createdAt } : {}),
    ...(updatedAt !== void 0
      ? {
          updatedAt,
          recencyAt: updatedAt,
        }
      : {}),
    source: "opencode-cli",
    modelProvider: "opencode",
    archived: false,
    canContinue: false,
    canArchive: false,
  };
}
async function listLocalOpenCodeSessionPage(value) {
  const params = parseListParams(value);
  const offset = decodeCursor(params.cursor);
  const requestedCount = params.searchTerm
    ? MAX_CLI_LIST_SESSIONS
    : Math.min(MAX_CLI_LIST_SESSIONS, offset + params.limit + 1);
  const output = await runOpenCode([
    "--pure",
    "db",
    [
      "SELECT id, title, time_created AS created, time_updated AS updated,",
      "project_id AS projectId, directory FROM session",
      "WHERE parent_id IS NULL AND time_archived IS NULL",
      `ORDER BY time_updated DESC, id DESC LIMIT ${String(requestedCount)}`,
    ].join(" "),
    "--format",
    "json",
  ]);
  const parsed = output.trim() ? JSON.parse(output) : [];
  if (!Array.isArray(parsed) || parsed.length > MAX_CLI_LIST_SESSIONS)
    throw new Error("OpenCode returned an invalid session list");
  const needle = params.searchTerm?.toLocaleLowerCase();
  const sessions = parsed
    .flatMap((entry) => {
      const session = parseOpenCodeSession(entry);
      return session ? [session] : [];
    })
    .filter((session) => {
      if (!needle) return true;
      return [session.threadId, session.name, session.cwd].some((field) =>
        field?.toLocaleLowerCase().includes(needle),
      );
    });
  const page = sessions.slice(offset, offset + params.limit);
  return {
    sessions: page,
    ...(offset + page.length < sessions.length
      ? { nextCursor: encodeCursor(offset + page.length) }
      : {}),
  };
}
function jsonText(value, maxLength = 2e4) {
  try {
    const text = JSON.stringify(value);
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  } catch {
    return;
  }
}
function timestampFromInfo(info) {
  if (!isRecord(info.time) || typeof info.time.created !== "number") return;
  const date = new Date(info.time.created);
  return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
function openCodeTranscriptItems(value) {
  if (!isRecord(value) || !Array.isArray(value.messages))
    throw new Error("OpenCode returned an invalid session export");
  return value.messages.flatMap((message) => {
    if (!isRecord(message) || !isRecord(message.info) || !Array.isArray(message.parts)) return [];
    const info = message.info;
    const role = info.role;
    const messageId = optionalOpenCodeString(info.id, 256);
    const timestamp = timestampFromInfo(info);
    const modelId =
      role === "assistant"
        ? optionalOpenCodeString(info.modelID, 256)
        : isRecord(info.model)
          ? optionalOpenCodeString(info.model.modelID, 256)
          : void 0;
    const providerId =
      role === "assistant"
        ? optionalOpenCodeString(info.providerID, 256)
        : isRecord(info.model)
          ? optionalOpenCodeString(info.model.providerID, 256)
          : void 0;
    const model = providerId && modelId ? `${providerId}/${modelId}` : modelId;
    return message.parts.flatMap((part, partIndex) => {
      if (!isRecord(part)) return [];
      const id =
        optionalOpenCodeString(part.id, 256) ??
        (messageId ? `${messageId}:${String(partIndex)}` : void 0);
      const common = {
        ...(id ? { id } : {}),
        ...(timestamp ? { timestamp } : {}),
        ...(model ? { model } : {}),
      };
      if (part.type === "text" && typeof part.text === "string")
        return [
          {
            ...common,
            type: role === "user" ? "userMessage" : "agentMessage",
            text: part.text,
          },
        ];
      if (part.type === "reasoning" && typeof part.text === "string")
        return [
          {
            ...common,
            type: "reasoning",
            text: part.text,
          },
        ];
      if (part.type === "tool") {
        const tool = optionalOpenCodeString(part.tool, 256) ?? "tool";
        const state = isRecord(part.state) ? part.state : void 0;
        const callText = state && "input" in state ? jsonText(state.input) : void 0;
        const resultText =
          state?.status === "completed" && typeof state.output === "string"
            ? state.output
            : state?.status === "error" && typeof state.error === "string"
              ? state.error
              : void 0;
        return [
          {
            ...common,
            type: "toolCall",
            text: callText ? `${tool}\n${callText}` : tool,
          },
          ...(resultText
            ? [
                {
                  ...common,
                  ...(id ? { id: `${id}:result` } : {}),
                  type: "toolResult",
                  text: resultText,
                },
              ]
            : []),
        ];
      }
      if (part.type === "file") {
        const filename = optionalOpenCodeString(part.filename, 1e3);
        const mime = optionalOpenCodeString(part.mime, 256);
        return [
          {
            ...common,
            type: "other",
            text: `[Attachment${filename ? `: ${filename}` : ""}${mime ? ` (${mime})` : ""}]`,
          },
        ];
      }
      return [];
    });
  });
}
async function readLocalOpenCodeTranscriptPage(value) {
  const params = parseReadParams(value);
  const offset = decodeCursor(params.cursor);
  const output = await runOpenCode(["--pure", "export", params.threadId]);
  const page = transcriptPage(openCodeTranscriptItems(JSON.parse(output)), params.limit, offset);
  return {
    hostId: LOCAL_HOST_ID,
    label: "Local OpenCode",
    threadId: params.threadId,
    ...page,
  };
}
//#endregion
export {
  optionalOpenCodeString as n,
  readLocalOpenCodeTranscriptPage as r,
  listLocalOpenCodeSessionPage as t,
};
