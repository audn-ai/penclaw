//#region extensions/codex/src/app-server/protocol.ts
/** Namespace Codex keeps directly model-visible without exposing it to Code Mode guests. */
const CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE = "openclaw_direct";
function flattenCodexDynamicToolFunctions(tools) {
  return (tools ?? []).flatMap((tool) => (tool.type === "namespace" ? tool.tools : [tool]));
}
const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS = ["cli", "vscode"];
function isJsonObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function isRpcResponse(message) {
  return "id" in message && !("method" in message);
}
//#endregion
export {
  isRpcResponse as a,
  isJsonObject as i,
  CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE as n,
  flattenCodexDynamicToolFunctions as r,
  CODEX_INTERACTIVE_THREAD_SOURCE_KINDS as t,
};
