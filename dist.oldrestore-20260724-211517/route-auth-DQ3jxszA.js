import { m as tryBeginGatewayRootWorkAdmission } from "./gateway-work-admission-yGjmBAjy.js";
import {
  a as resolvePluginRoutePathContext,
  i as isProtectedPluginRoutePathFromContext,
  t as findMatchingPluginHttpRoutes,
} from "./route-match-CjzRe5Nj.js";
//#region src/gateway/server/http-work-admission.ts
async function runWithGatewayBoundaryWorkAdmission(reject, run) {
  const admission = tryBeginGatewayRootWorkAdmission();
  if (!admission) {
    reject();
    return true;
  }
  try {
    return await admission.run(async () => await run());
  } finally {
    admission.release();
  }
}
/** Runs one HTTP user-work route under the same root fence as Gateway RPCs. */
async function runWithGatewayHttpWorkAdmission(res, run) {
  return await runWithGatewayBoundaryWorkAdmission(() => {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Retry-After", "1");
    res.end(
      JSON.stringify({
        error: {
          message: "Gateway is temporarily unavailable while suspending or restarting",
          type: "service_unavailable",
          code: "gateway_unavailable",
        },
      }),
    );
  }, run);
}
function writeGatewayUpgradeServiceUnavailable(socket, body) {
  socket.write(
    `HTTP/1.1 503 Service Unavailable\r
Connection: close\r
Content-Type: text/plain; charset=utf-8\r
Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r
` + body,
  );
}
/** Holds upgrade admission until one plugin handler owns or declines the socket. */
async function runWithGatewayUpgradeWorkAdmission(socket, run) {
  return await runWithGatewayBoundaryWorkAdmission(() => {
    writeGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
    socket.destroy();
  }, run);
}
//#endregion
//#region src/gateway/server/plugins-http/route-auth.ts
/**
 * Gateway-auth decisions for plugin HTTP routes.
 */
function matchedPluginRoutesRequireGatewayAuth(routes) {
  return routes.some((route) => route.auth === "gateway");
}
/** Returns true when a plugin path must pass gateway auth before routing. */
function shouldEnforceGatewayAuthForPluginPath(registry, pathnameOrContext) {
  const pathContext =
    typeof pathnameOrContext === "string"
      ? resolvePluginRoutePathContext(pathnameOrContext)
      : pathnameOrContext;
  if (pathContext.malformedEncoding || pathContext.decodePassLimitReached) return true;
  if (isProtectedPluginRoutePathFromContext(pathContext)) return true;
  return matchedPluginRoutesRequireGatewayAuth(findMatchingPluginHttpRoutes(registry, pathContext));
}
//#endregion
export {
  writeGatewayUpgradeServiceUnavailable as a,
  runWithGatewayUpgradeWorkAdmission as i,
  shouldEnforceGatewayAuthForPluginPath as n,
  runWithGatewayHttpWorkAdmission as r,
  matchedPluginRoutesRequireGatewayAuth as t,
};
