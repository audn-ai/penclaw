//#region extensions/anthropic/session-catalog-node-helpers.d.ts
declare function createNodeListFailedError(error: unknown): {
  code: string;
  message: string;
};
declare function resolveNodeLabel(node: {
  displayName?: string;
  remoteIp?: string;
  nodeId: string;
}): string;
//#endregion
export { createNodeListFailedError, resolveNodeLabel };
