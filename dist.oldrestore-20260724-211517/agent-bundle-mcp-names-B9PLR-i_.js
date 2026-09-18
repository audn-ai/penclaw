import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/agents/agent-bundle-mcp-names.ts
/** Sanitizes MCP server/tool names into stable model-facing tool ids. */
const TOOL_NAME_SAFE_RE = /[^A-Za-z0-9_-]/g;
const TOOL_NAME_MAX_PREFIX = 30;
const TOOL_NAME_MAX_TOTAL = 64;
function sanitizeToolFragment(raw, fallback, maxChars) {
  const normalized = raw.trim().replace(TOOL_NAME_SAFE_RE, "-") || fallback;
  const providerSafe = /^[A-Za-z]/.test(normalized) ? normalized : `${fallback}-${normalized}`;
  if (!maxChars) return providerSafe;
  return providerSafe.length > maxChars ? providerSafe.slice(0, maxChars) : providerSafe;
}
/** Sanitize one MCP server name and reserve it in the provided set. */
function sanitizeServerName(raw, usedNames) {
  const base = sanitizeToolFragment(raw, "mcp", TOOL_NAME_MAX_PREFIX);
  let candidate = base;
  let n = 2;
  while (usedNames.has(normalizeLowercaseStringOrEmpty(candidate))) {
    const suffix = `-${n}`;
    candidate = `${base.slice(0, Math.max(1, TOOL_NAME_MAX_PREFIX - suffix.length))}${suffix}`;
    n += 1;
  }
  usedNames.add(normalizeLowercaseStringOrEmpty(candidate));
  return candidate;
}
function sanitizeToolName(raw) {
  return sanitizeToolFragment(raw, "tool");
}
/** Normalizes reserved tool names for collision checks. */
function normalizeReservedToolNames(names) {
  return new Set(
    Array.from(names ?? [], (name) => normalizeOptionalLowercaseString(name)).filter((name) =>
      Boolean(name),
    ),
  );
}
/** Build a safe model-facing tool name from server and tool fragments. */
function buildSafeToolName(params) {
  const cleanedToolName = sanitizeToolName(params.toolName);
  const maxToolChars = Math.max(1, TOOL_NAME_MAX_TOTAL - params.serverName.length - 2);
  const truncatedToolName = cleanedToolName.slice(0, maxToolChars);
  let candidateToolName = truncatedToolName || "tool";
  let candidate = `${params.serverName}__${candidateToolName}`;
  let n = 2;
  while (params.reservedNames.has(normalizeLowercaseStringOrEmpty(candidate))) {
    const suffix = `-${n}`;
    candidateToolName = `${(truncatedToolName || "tool").slice(0, Math.max(1, maxToolChars - suffix.length))}${suffix}`;
    candidate = `${params.serverName}__${candidateToolName}`;
    n += 1;
  }
  return candidate;
}
//#endregion
export { normalizeReservedToolNames as n, sanitizeServerName as r, buildSafeToolName as t };
