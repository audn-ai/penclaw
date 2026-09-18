import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
//#region src/agents/cli-runner/tool-policy.ts
/** CLI backends cannot enforce runtime caps; keep only real restrictions. */
function resolveCliRuntimeToolsAllow(toolsAllow, toolsAllowIsDefault) {
  if (toolsAllow === void 0 || toolsAllowIsDefault) return;
  return toolsAllow.some((toolName) => normalizeToolName(toolName) === "*") ? void 0 : toolsAllow;
}
//#endregion
export { resolveCliRuntimeToolsAllow as t };
