import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import "./utils-DtcDeqWS.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
//#region src/agents/code-mode-control-tools.ts
/**
 * Tags Code Mode exec/wait control tools and normalizes hook params for the
 * exec-compatible before-tool-call surface.
 */
/** Model-visible Code Mode exec tool name. */
const CODE_MODE_EXEC_TOOL_NAME = "exec";
/** Model-visible Code Mode wait tool name. */
const CODE_MODE_WAIT_TOOL_NAME = "wait";
/** Direct tools whose structured results cannot cross the JSON-only guest bridge. */
const CODE_MODE_DIRECT_TOOL_NAMES = /* @__PURE__ */ new Set(["computer", "image"]);
/** Hook metadata kind for Code Mode exec tools. */
const CODE_MODE_EXEC_TOOL_KIND = "code_mode_exec";
const codeModeControlTools = /* @__PURE__ */ new WeakSet();
/** Mark a tool as owned by code mode control flow. */
function markCodeModeControlTool(tool) {
  codeModeControlTools.add(tool);
  return tool;
}
/** Replicate code-mode identity from an original tool object to a wrapper. */
function copyCodeModeControlToolIdentity(original, wrapper) {
  if (codeModeControlTools.has(original)) codeModeControlTools.add(wrapper);
}
/** Return whether a tool was marked as code-mode owned. */
function isCodeModeControlTool(tool) {
  return codeModeControlTools.has(tool);
}
/** Return whether a provider payload tool may remain model-visible in Code Mode. */
function isCodeModeModelVisibleToolName(name) {
  return name === "exec" || name === "wait" || CODE_MODE_DIRECT_TOOL_NAMES.has(name);
}
function isCodeModeExecTool(tool) {
  return isCodeModeControlTool(tool) && normalizeToolName(tool.name) === "exec";
}
function resolveCodeModeExecToolInputKind(params) {
  if (!isPlainObject(params)) return;
  const language = params.language;
  if (language === void 0 || language === "javascript") return "javascript";
  if (language === "typescript") return "typescript";
}
function normalizeCodeModeExecParams(params) {
  if (!isPlainObject(params)) return params;
  const code = params.code;
  const command = params.command;
  if (typeof code === "string" && typeof command !== "string")
    return {
      ...params,
      command: params.code,
    };
  if (typeof command === "string" && typeof code !== "string")
    return {
      ...params,
      code: params.command,
    };
  return params;
}
/** Build before-tool-call metadata for a marked code-mode exec tool. */
function getCodeModeExecBeforeHookMetadata(params) {
  if (!isCodeModeExecTool(params.tool)) return;
  const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
  return {
    toolKind: CODE_MODE_EXEC_TOOL_KIND,
    ...(toolInputKind && { toolInputKind }),
  };
}
/** Build before-tool-call metadata when only the tool kind is available. */
function getCodeModeExecBeforeHookMetadataForToolKind(params) {
  if (params.toolKind !== CODE_MODE_EXEC_TOOL_KIND) return;
  const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
  return {
    toolKind: CODE_MODE_EXEC_TOOL_KIND,
    ...(toolInputKind && { toolInputKind }),
  };
}
/** Normalize before-hook params for a marked code-mode exec tool. */
function normalizeCodeModeExecBeforeHookParams(params) {
  if (!isCodeModeExecTool(params.tool)) return params.params;
  return normalizeCodeModeExecParams(params.params);
}
/** Normalize before-hook params when only the code-mode tool kind is available. */
function normalizeCodeModeExecBeforeHookParamsForToolKind(params) {
  if (params.toolKind !== CODE_MODE_EXEC_TOOL_KIND) return params.params;
  return normalizeCodeModeExecParams(params.params);
}
/** Reconcile hook-adjusted `code` and `command` fields after code-mode normalization. */
function reconcileCodeModeExecBeforeHookParams(params) {
  if (
    !isCodeModeExecTool(params.tool) ||
    !isPlainObject(params.originalParams) ||
    !isPlainObject(params.hookParams) ||
    !isPlainObject(params.adjustedParams)
  )
    return params.adjustedParams;
  const hookCode = params.hookParams.code;
  const hookCommand = params.hookParams.command;
  if (typeof hookCode !== "string" || hookCode !== hookCommand) return params.adjustedParams;
  const adjustedCode = params.adjustedParams.code;
  const adjustedCommand = params.adjustedParams.command;
  const adjustedCodeChanged = typeof adjustedCode === "string" && adjustedCode !== hookCode;
  const adjustedCommandChanged =
    typeof adjustedCommand === "string" && adjustedCommand !== hookCode;
  if (adjustedCodeChanged === adjustedCommandChanged) return params.adjustedParams;
  if (adjustedCodeChanged)
    return {
      ...params.adjustedParams,
      command: adjustedCode,
    };
  if (adjustedCommandChanged)
    return {
      ...params.adjustedParams,
      code: adjustedCommand,
    };
  return params.adjustedParams;
}
//#endregion
export {
  getCodeModeExecBeforeHookMetadataForToolKind as a,
  markCodeModeControlTool as c,
  reconcileCodeModeExecBeforeHookParams as d,
  getCodeModeExecBeforeHookMetadata as i,
  normalizeCodeModeExecBeforeHookParams as l,
  CODE_MODE_WAIT_TOOL_NAME as n,
  isCodeModeControlTool as o,
  copyCodeModeControlToolIdentity as r,
  isCodeModeModelVisibleToolName as s,
  CODE_MODE_EXEC_TOOL_NAME as t,
  normalizeCodeModeExecBeforeHookParamsForToolKind as u,
};
