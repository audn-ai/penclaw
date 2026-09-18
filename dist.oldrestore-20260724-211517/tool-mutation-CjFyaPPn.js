import { r as asOptionalObjectRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/agents/tool-mutation.ts
/**
 * Tool mutation classification and fingerprinting.
 *
 * Identifies mutating tool calls and file targets so retry/recovery logic can reason about side effects.
 */
const MUTATING_TOOL_NAMES = /* @__PURE__ */ new Set([
  "write",
  "edit",
  "apply_patch",
  "exec",
  "bash",
  "process",
  "message",
  "sessions_spawn",
  "sessions_send",
  "cron",
  "gateway",
  "canvas",
  "computer",
  "nodes",
  "session_status",
  "create_goal",
  "update_goal",
]);
const FILE_MUTATING_TOOL_NAMES = /* @__PURE__ */ new Set(["edit", "write"]);
const FILE_TARGET_PATH_ARG_KEYS = ["path", "file_path", "filePath", "filepath", "file"];
const FILE_TARGET_OLDPATH_ARG_KEYS = ["oldPath", "old_path"];
const READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
  "get",
  "list",
  "read",
  "status",
  "show",
  "fetch",
  "search",
  "query",
  "view",
  "poll",
  "log",
  "inspect",
  "check",
  "probe",
  "runs",
]);
const PROCESS_MUTATING_ACTIONS = /* @__PURE__ */ new Set([
  "write",
  "send_keys",
  "submit",
  "paste",
  "kill",
  "clear",
  "remove",
]);
const PROCESS_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["list", "log"]);
const MESSAGE_READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
  "reactions",
  "read",
  "list_pins",
  "permissions",
  "thread_list",
  "search",
  "sticker_search",
  "member_info",
  "role_info",
  "emoji_list",
  "channel_info",
  "channel_list",
  "voice_status",
  "event_list",
]);
const REPLAY_SAFE_TOOL_NAMES = /* @__PURE__ */ new Set([
  "agents_list",
  "find",
  "get_goal",
  "glob",
  "grep",
  "image",
  "ls",
  "memory_get",
  "memory_search",
  "pdf",
  "read",
  "search",
  "sessions_history",
  "sessions_list",
  "sessions_search",
  "tool_describe",
  "tool_search",
  "update_plan",
  "web_fetch",
  "web_search",
  "x_search",
]);
const BROWSER_READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
  "console",
  "profiles",
  "snapshot",
  "status",
  "tabs",
]);
const COMPUTER_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["screenshot", "wait"]);
const GATEWAY_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["config.get", "config.schema.lookup"]);
const NODES_REPLAY_SAFE_ACTIONS = /* @__PURE__ */ new Set(["status", "describe", "pending"]);
const READ_ONLY_SHELL_COMMANDS = /* @__PURE__ */ new Set([
  "cat",
  "grep",
  "head",
  "ls",
  "pwd",
  "rg",
  "stat",
  "tail",
  "wc",
]);
const READ_ONLY_GH_PR_SUBCOMMANDS = /* @__PURE__ */ new Set([
  "checks",
  "diff",
  "list",
  "status",
  "view",
]);
const READ_ONLY_GH_ISSUE_SUBCOMMANDS = /* @__PURE__ */ new Set(["list", "status", "view"]);
const UNSAFE_RG_FLAGS = /* @__PURE__ */ new Set([
  "--hostname-bin",
  "--pre",
  "--pre-glob",
  "--search-zip",
  "-z",
]);
const UNSAFE_RG_VALUE_FLAGS = ["--hostname-bin", "--pre", "--pre-glob"];
const SHELL_EXPANSION_CHARS = /* @__PURE__ */ new Set(["$", "*", "?", "[", "]", "{", "}", "~"]);
function normalizeActionName(value) {
  return normalizeOptionalLowercaseString(value)?.replace(/[\s-]+/g, "_") || void 0;
}
function readShellCommand(record) {
  const command = record?.command ?? record?.cmd;
  if (typeof command !== "string") return;
  return command.trim() || void 0;
}
function tokenizeSimpleShellCommand(command) {
  if (/[;&|<>\n\r`]/.test(command) || command.includes("\\")) return;
  for (const char of SHELL_EXPANSION_CHARS) if (command.includes(char)) return;
  const tokens = [];
  let current = "";
  let quote;
  for (const char of command) {
    if (quote) {
      if (char === quote) quote = void 0;
      else current += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }
  if (quote) return;
  if (current) tokens.push(current);
  return tokens.length > 0 ? tokens : void 0;
}
function isReadOnlySedCommand(tokens) {
  const args = tokens.slice(1);
  if (args.some((token) => token === "--in-place" || token.startsWith("--in-place="))) return false;
  if (args.some((token) => token.startsWith("-") && token !== "-" && token.includes("i")))
    return false;
  if (args.some((token) => token === "-e" || token === "--expression")) return false;
  let sawSuppressAutoPrint = false;
  let expression;
  for (const token of args) {
    if (token === "--in-place" || token.startsWith("--in-place=")) return false;
    if (token === "--quiet" || token === "--silent") {
      sawSuppressAutoPrint = true;
      continue;
    }
    if (token.startsWith("-") && token !== "-") {
      if (token.includes("i")) return false;
      if (token.includes("n")) sawSuppressAutoPrint = true;
      continue;
    }
    expression ??= token;
    break;
  }
  return sawSuppressAutoPrint && expression != null && /^(\d+|\$)(,(\d+|\$))?p$/.test(expression);
}
function hasUnsafeRipgrepFlag(tokens) {
  return tokens.some((token) => {
    const normalized = normalizeLowercaseStringOrEmpty(token);
    return (
      UNSAFE_RG_FLAGS.has(normalized) ||
      UNSAFE_RG_VALUE_FLAGS.some((flag) => normalized.startsWith(`${flag}=`))
    );
  });
}
function isReadOnlyGhCommand(tokens) {
  if (
    tokens.some((token) => {
      const normalized = normalizeLowercaseStringOrEmpty(token);
      return (
        normalized === "--web" ||
        normalized.startsWith("--web=") ||
        /^-[a-z]*w[a-z]*(?:=.*)?$/.test(normalized)
      );
    })
  )
    return false;
  const area = normalizeLowercaseStringOrEmpty(tokens[1]);
  const action = normalizeLowercaseStringOrEmpty(tokens[2]);
  if (area === "search") return action.length > 0;
  if (area === "pr") return READ_ONLY_GH_PR_SUBCOMMANDS.has(action);
  if (area === "issue") return READ_ONLY_GH_ISSUE_SUBCOMMANDS.has(action);
  return false;
}
function isPlainReadOnlyShellCommand(command) {
  if (!command) return false;
  const tokens = tokenizeSimpleShellCommand(command);
  if (!tokens) return false;
  const executable = normalizeLowercaseStringOrEmpty(tokens[0]);
  if (executable === "rg" && hasUnsafeRipgrepFlag(tokens)) return false;
  if (READ_ONLY_SHELL_COMMANDS.has(executable)) return true;
  if (executable === "sed") return isReadOnlySedCommand(tokens);
  if (executable === "gh") return isReadOnlyGhCommand(tokens);
  return false;
}
function normalizeFingerprintValue(value) {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized ? normalizeLowercaseStringOrEmpty(normalized) : void 0;
  }
  if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean")
    return normalizeLowercaseStringOrEmpty(String(value));
}
function appendFingerprintAlias(parts, record, label, keys) {
  for (const key of keys) {
    const value = normalizeFingerprintValue(record?.[key]);
    if (!value) continue;
    parts.push(`${label}=${value}`);
    return true;
  }
  return false;
}
function isLikelyMutatingToolName(toolName) {
  const normalized = normalizeLowercaseStringOrEmpty(toolName);
  if (!normalized) return false;
  return (
    MUTATING_TOOL_NAMES.has(normalized) ||
    normalized.endsWith("_actions") ||
    normalized.startsWith("message_") ||
    normalized.includes("send")
  );
}
function isMutatingToolCall(toolName, args) {
  const normalized = normalizeLowercaseStringOrEmpty(toolName);
  const record = asOptionalObjectRecord(args);
  const action = normalizeActionName(record?.action);
  switch (normalized) {
    case "write":
    case "edit":
    case "apply_patch":
    case "sessions_spawn":
    case "sessions_send":
    case "create_goal":
    case "update_goal":
      return true;
    case "exec":
    case "bash":
      return !isPlainReadOnlyShellCommand(readShellCommand(record));
    case "process":
      return action != null && PROCESS_MUTATING_ACTIONS.has(action);
    case "message":
      return action == null || !MESSAGE_READ_ONLY_ACTIONS.has(action);
    case "computer":
      return action == null || !COMPUTER_REPLAY_SAFE_ACTIONS.has(action);
    case "subagents":
      return action === "kill" || action === "steer";
    case "session_status":
      return typeof record?.model === "string" && record.model.trim().length > 0;
    case "gateway":
      return action == null || !GATEWAY_REPLAY_SAFE_ACTIONS.has(action);
    case "nodes":
      return action == null || !NODES_REPLAY_SAFE_ACTIONS.has(action);
    default:
      if (normalized === "cron" || normalized === "canvas")
        return action == null || !READ_ONLY_ACTIONS.has(action);
      if (normalized.endsWith("_actions")) return action == null || !READ_ONLY_ACTIONS.has(action);
      if (normalized.startsWith("message_") || normalized.includes("send")) return true;
      return false;
  }
}
/** Return true only for tool calls whose structured contract proves replay safety. */
function isReplaySafeToolCall(toolName, args) {
  const normalized = normalizeLowercaseStringOrEmpty(toolName);
  const action = normalizeActionName(asOptionalObjectRecord(args)?.action);
  if (REPLAY_SAFE_TOOL_NAMES.has(normalized)) return true;
  switch (normalized) {
    case "exec":
    case "bash":
      return false;
    case "process":
      return action != null && PROCESS_REPLAY_SAFE_ACTIONS.has(action);
    case "message":
      return action != null && MESSAGE_READ_ONLY_ACTIONS.has(action);
    case "subagents":
      return action == null || action === "list";
    case "session_status":
      return !isMutatingToolCall(normalized, args);
    case "browser":
      return action != null && BROWSER_READ_ONLY_ACTIONS.has(action);
    case "computer":
      return action != null && COMPUTER_REPLAY_SAFE_ACTIONS.has(action);
    case "skill_workshop":
      return action === "list" || action === "inspect";
    case "transcripts":
      return action === "status";
    case "gateway":
      return action != null && GATEWAY_REPLAY_SAFE_ACTIONS.has(action);
    case "nodes":
      return action != null && NODES_REPLAY_SAFE_ACTIONS.has(action);
    default:
      if (normalized === "cron" || normalized === "canvas")
        return action != null && READ_ONLY_ACTIONS.has(action);
      return false;
  }
}
function buildToolActionFingerprint(toolName, args, meta) {
  if (!isMutatingToolCall(toolName, args)) return;
  const normalizedTool = normalizeLowercaseStringOrEmpty(toolName);
  const record = asOptionalObjectRecord(args);
  const action = normalizeActionName(record?.action);
  const parts = [`tool=${normalizedTool}`];
  if (action) parts.push(`action=${action}`);
  let hasStableTarget = false;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "path", [
      "path",
      "file_path",
      "filePath",
      "filepath",
      "file",
    ]) || hasStableTarget;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "oldpath", ["oldPath", "old_path"]) || hasStableTarget;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "newpath", ["newPath", "new_path"]) || hasStableTarget;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "to", ["to", "target"]) || hasStableTarget;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "messageid", ["messageId", "message_id"]) ||
    hasStableTarget;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "sessionkey", ["sessionKey", "session_key"]) ||
    hasStableTarget;
  hasStableTarget =
    appendFingerprintAlias(parts, record, "jobid", ["jobId", "job_id"]) || hasStableTarget;
  hasStableTarget = appendFingerprintAlias(parts, record, "id", ["id"]) || hasStableTarget;
  hasStableTarget = appendFingerprintAlias(parts, record, "model", ["model"]) || hasStableTarget;
  const normalizedMeta = normalizeOptionalLowercaseString(meta?.trim().replace(/\s+/g, " "));
  if (normalizedMeta && !hasStableTarget) parts.push(`meta=${normalizedMeta}`);
  return parts.join("|");
}
function isFileMutatingToolName(rawName) {
  return FILE_MUTATING_TOOL_NAMES.has(normalizeLowercaseStringOrEmpty(rawName));
}
function readArgFingerprintValue(record, keys) {
  if (!record) return;
  for (const key of keys) {
    const normalized = normalizeFingerprintValue(record[key]);
    if (normalized) return normalized;
  }
}
function extractFileTarget(toolName, args) {
  if (!isFileMutatingToolName(toolName)) return;
  const record = asOptionalObjectRecord(args);
  const path = readArgFingerprintValue(record, FILE_TARGET_PATH_ARG_KEYS);
  const oldpath = readArgFingerprintValue(record, FILE_TARGET_OLDPATH_ARG_KEYS);
  if (!path && !oldpath) return;
  return {
    ...(path !== void 0 ? { path } : {}),
    ...(oldpath !== void 0 ? { oldpath } : {}),
  };
}
function fileTargetsEqual(a, b) {
  return (a.path ?? "") === (b.path ?? "") && (a.oldpath ?? "") === (b.oldpath ?? "");
}
function buildToolMutationState(toolName, args, meta) {
  const actionFingerprint = buildToolActionFingerprint(toolName, args, meta);
  const fileTarget = extractFileTarget(toolName, args);
  return {
    mutatingAction: actionFingerprint != null,
    replaySafe: isReplaySafeToolCall(toolName, args),
    actionFingerprint,
    ...(fileTarget !== void 0 ? { fileTarget } : {}),
  };
}
function isSameToolMutationAction(existing, next) {
  if (existing.actionFingerprint != null || next.actionFingerprint != null) {
    if (existing.actionFingerprint == null || next.actionFingerprint == null) return false;
    if (existing.actionFingerprint === next.actionFingerprint) return true;
    if (
      isFileMutatingToolName(existing.toolName) &&
      isFileMutatingToolName(next.toolName) &&
      existing.fileTarget !== void 0 &&
      next.fileTarget !== void 0 &&
      fileTargetsEqual(existing.fileTarget, next.fileTarget)
    )
      return true;
    return false;
  }
  return existing.toolName === next.toolName && (existing.meta ?? "") === (next.meta ?? "");
}
//#endregion
export {
  isSameToolMutationAction as a,
  isReplaySafeToolCall as i,
  isLikelyMutatingToolName as n,
  isMutatingToolCall as r,
  buildToolMutationState as t,
};
