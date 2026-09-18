//#region src/gateway/control-ui-shared.ts
const CONTROL_UI_AVATAR_PREFIX = "/avatar";
/** Normalizes a Control UI base path to either "" or a leading-slash path without trailing slash. */
function normalizeControlUiBasePath(basePath) {
  if (!basePath) return "";
  let normalized = basePath.trim();
  if (!normalized) return "";
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized === "/") return "";
  if (normalized.endsWith("/")) normalized = normalized.slice(0, -1);
  return normalized;
}
/** Builds the gateway-served avatar URL for an agent under the provided base path. */
function buildControlUiAvatarUrl(basePath, agentId) {
  return basePath
    ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/${agentId}`
    : `${CONTROL_UI_AVATAR_PREFIX}/${agentId}`;
}
//#endregion
export {
  buildControlUiAvatarUrl as n,
  normalizeControlUiBasePath as r,
  CONTROL_UI_AVATAR_PREFIX as t,
};
