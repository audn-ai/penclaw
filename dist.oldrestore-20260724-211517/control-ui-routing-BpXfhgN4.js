//#region src/gateway/control-ui-http-utils.ts
/** Returns true for idempotent HTTP methods that can read Control UI assets. */
function isReadHttpMethod(method) {
  return method === "GET" || method === "HEAD";
}
/** Sends a plain-text response with the standard UTF-8 content type. */
function respondPlainText(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(body);
}
/** Sends the shared plain-text 404 response for Control UI routes. */
function respondNotFound(res) {
  respondPlainText(res, 404, "Not Found");
}
//#endregion
//#region src/gateway/control-ui-routing.ts
const ROOT_MOUNTED_GATEWAY_PROBE_PATHS = /* @__PURE__ */ new Set([
  "/health",
  "/healthz",
  "/ready",
  "/readyz",
]);
const CONTROL_UI_PLUGIN_MANAGER_PATH = "/settings/plugins";
/** Keep the plugin recovery surface ahead of plugin-owned HTTP routes. */
function isControlUiPluginManagerRequest(params) {
  if (!isReadHttpMethod(params.method)) return false;
  const path = `${params.basePath}${CONTROL_UI_PLUGIN_MANAGER_PATH}`;
  return params.pathname === path || params.pathname === `${path}/`;
}
/** Core-owned standalone approval document namespace, before plugin routing. */
function isControlUiApprovalDocumentPath(params) {
  const root = `${params.basePath}/approve`;
  if (params.pathname === root || params.pathname === `${root}/`) return true;
  const prefix = `${root}/`;
  if (!params.pathname.startsWith(prefix)) return false;
  const encodedId = params.pathname.slice(prefix.length);
  return encodedId.length > 0 && !encodedId.includes("/");
}
/** Classify an HTTP request as Control UI serving, redirect, 404, or non-Control-UI. */
function classifyControlUiRequest(params) {
  const { basePath, pathname, search, method } = params;
  if (!basePath) {
    if (pathname === "/ui" || pathname.startsWith("/ui/")) return { kind: "not-found" };
    if (ROOT_MOUNTED_GATEWAY_PROBE_PATHS.has(pathname)) return { kind: "not-control-ui" };
    if (pathname === "/plugins" || pathname.startsWith("/plugins/"))
      return { kind: "not-control-ui" };
    if (pathname === "/api" || pathname.startsWith("/api/")) return { kind: "not-control-ui" };
    if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
    return { kind: "serve" };
  }
  if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath)
    return { kind: "not-control-ui" };
  if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
  if (pathname === basePath)
    return {
      kind: "redirect",
      location: `${basePath}/${search}`,
    };
  return { kind: "serve" };
}
//#endregion
export {
  respondNotFound as a,
  isReadHttpMethod as i,
  isControlUiApprovalDocumentPath as n,
  respondPlainText as o,
  isControlUiPluginManagerRequest as r,
  classifyControlUiRequest as t,
};
