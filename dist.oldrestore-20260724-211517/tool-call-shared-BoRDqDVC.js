import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/tool-call-shared.ts
/**
 * Shared tool-call name validation helpers.
 * Keeps model-supplied tool names compact, normalized, and policy-checked
 * before routing them to any tool execution surface.
 */
const TOOL_CALL_NAME_MAX_CHARS = 64;
const TOOL_CALL_NAME_RE = /^[A-Za-z0-9_:.-]+$/;
/** Normalize an optional iterable of allowed tool names for lookup. */
function normalizeAllowedToolNames(allowedToolNames) {
  if (!allowedToolNames) return null;
  const normalized = /* @__PURE__ */ new Set();
  for (const name of allowedToolNames) {
    if (typeof name !== "string") continue;
    const trimmed = name.trim();
    if (!trimmed) continue;
    normalized.add(normalizeLowercaseStringOrEmpty(trimmed));
  }
  return normalized.size > 0 ? normalized : null;
}
/** Return whether a model-supplied tool call name is syntactically and policy allowed. */
function isAllowedToolCallName(name, allowedToolNames) {
  if (typeof name !== "string") return false;
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (trimmed.length > TOOL_CALL_NAME_MAX_CHARS || !TOOL_CALL_NAME_RE.test(trimmed)) return false;
  if (!allowedToolNames) return true;
  return allowedToolNames.has(normalizeLowercaseStringOrEmpty(trimmed));
}
//#endregion
export { normalizeAllowedToolNames as n, isAllowedToolCallName as t };
