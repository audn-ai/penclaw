//#region extensions/anthropic/session-catalog-node-helpers.ts
function createNodeListFailedError(error) {
  const detail =
    error instanceof Error ? error.message.trim() : typeof error === "string" ? error.trim() : "";
  const summary = "Paired nodes could not be listed";
  return {
    code: "NODE_LIST_FAILED",
    message: detail && detail !== summary ? `${summary}: ${detail}` : summary,
  };
}
function resolveNodeLabel(node) {
  return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
//#endregion
export { resolveNodeLabel as n, createNodeListFailedError as t };
