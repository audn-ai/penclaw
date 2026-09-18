import {
  o as getHeader,
  p as resolveTrustedHttpOperatorScopes,
} from "./http-auth-utils-Cm6rPa7b.js";
import { t as CLI_DEFAULT_OPERATOR_SCOPES } from "./method-scopes-DrxGpKMT.js";
import { o as WRITE_SCOPE } from "./operator-scopes-CpPJIv7P.js";
//#region src/gateway/server/plugin-route-runtime-scopes.ts
/** Resolves the scopes a plugin route receives after gateway HTTP authentication. */
function resolvePluginRouteRuntimeOperatorScopes(req, requestAuth, surface = "write-default") {
  if (surface === "trusted-operator") {
    if (!requestAuth.trustDeclaredOperatorScopes) return [...CLI_DEFAULT_OPERATOR_SCOPES];
    return resolveTrustedHttpOperatorScopes(req, requestAuth);
  }
  if (requestAuth.authMethod !== "trusted-proxy") return [WRITE_SCOPE];
  if (getHeader(req, "x-openclaw-scopes") === void 0) return [WRITE_SCOPE];
  return resolveTrustedHttpOperatorScopes(req, requestAuth);
}
//#endregion
export { resolvePluginRouteRuntimeOperatorScopes as t };
