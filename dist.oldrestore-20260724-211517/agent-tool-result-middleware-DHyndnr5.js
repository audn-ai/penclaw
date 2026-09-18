import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
//#region src/plugins/tool-contracts.ts
function normalizePluginToolContractNames(contracts) {
  return normalizePluginToolNames(contracts?.tools);
}
function normalizePluginToolNames(names) {
  const normalized = /* @__PURE__ */ new Set();
  for (const name of names ?? []) {
    const trimmed = name.trim();
    if (trimmed) normalized.add(trimmed);
  }
  return [...normalized];
}
function findUndeclaredPluginToolNames(params) {
  const declared = new Set(normalizePluginToolNames(params.declaredNames));
  return normalizePluginToolNames(params.toolNames).filter((name) => !declared.has(name));
}
//#endregion
//#region src/plugins/agent-tool-result-middleware.ts
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES = ["openclaw", "codex"];
const AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET = new Set(AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES);
const LEGACY_AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES = { "codex-app-server": "codex" };
function normalizeAgentToolResultMiddlewareRuntime(runtime) {
  const normalized = runtime.trim().toLowerCase();
  const legacyRuntime = LEGACY_AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES[normalized];
  if (legacyRuntime) return legacyRuntime;
  return AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIME_SET.has(normalized) ? normalized : void 0;
}
function normalizeAgentToolResultMiddlewareRuntimes(options) {
  const requested = options?.runtimes ?? options?.harnesses;
  if (!requested) return [...AGENT_TOOL_RESULT_MIDDLEWARE_RUNTIMES];
  const normalized = [];
  for (const runtime of requested) {
    const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
    if (!value) continue;
    if (!normalized.includes(value)) normalized.push(value);
  }
  return normalized;
}
function normalizeAgentToolResultMiddlewareRuntimeIds(runtimes) {
  const normalized = [];
  for (const runtime of runtimes ?? []) {
    const value = normalizeAgentToolResultMiddlewareRuntime(runtime);
    if (value && !normalized.includes(value)) normalized.push(value);
  }
  return normalized;
}
function listAgentToolResultMiddlewares(runtime) {
  return (
    getActivePluginRegistry()
      ?.agentToolResultMiddlewares?.filter((entry) => entry.runtimes.includes(runtime))
      .map((entry) => entry.handler) ?? []
  );
}
//#endregion
export {
  normalizePluginToolContractNames as a,
  findUndeclaredPluginToolNames as i,
  normalizeAgentToolResultMiddlewareRuntimeIds as n,
  normalizePluginToolNames as o,
  normalizeAgentToolResultMiddlewareRuntimes as r,
  listAgentToolResultMiddlewares as t,
};
