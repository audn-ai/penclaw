import {
  p as resolveTrustedHttpOperatorScopes,
  t as authorizeGatewayHttpRequestOrReply,
} from "./http-auth-utils-Cm6rPa7b.js";
import {
  a as sendJson,
  i as sendInvalidRequest,
  o as sendMethodNotAllowed,
  s as sendMissingScopeForbidden,
} from "./http-common-Czxz795c.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-DrxGpKMT.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import { i as killSubagentRunAdmin } from "./subagent-control-D-LCbeU1.js";
import "./http-utils-B3cLzhCe.js";
//#region src/gateway/session-kill-http.ts
function resolveSessionKeyFromPath(pathname) {
  const match = pathname.match(/^\/sessions\/([^/]+)\/kill$/);
  if (!match) return { matched: false };
  try {
    const decoded = decodeURIComponent(match[1] ?? "").trim();
    if (!decoded)
      return {
        error: "invalid-session-key",
        matched: true,
      };
    return {
      matched: true,
      sessionKey: decoded,
    };
  } catch {
    return {
      error: "invalid-session-key",
      matched: true,
    };
  }
}
async function handleSessionKillHttpRequest(req, res, opts) {
  const cfg = getRuntimeConfig();
  const sessionKeyResolution = resolveSessionKeyFromPath(
    new URL(req.url ?? "/", "http://localhost").pathname,
  );
  if (!sessionKeyResolution.matched) return false;
  if ("error" in sessionKeyResolution) {
    sendInvalidRequest(res, "invalid session key");
    return true;
  }
  const { sessionKey } = sessionKeyResolution;
  if (req.method !== "POST") {
    sendMethodNotAllowed(res, "POST");
    return true;
  }
  const requestAuth = await authorizeGatewayHttpRequestOrReply({
    req,
    res,
    auth: opts.auth,
    trustedProxies: opts.trustedProxies ?? cfg.gateway?.trustedProxies,
    allowRealIpFallback: opts.allowRealIpFallback ?? cfg.gateway?.allowRealIpFallback,
    rateLimiter: opts.rateLimiter,
  });
  if (!requestAuth) return true;
  const scopeAuth = authorizeOperatorScopesForRequiredScope(
    ADMIN_SCOPE,
    resolveTrustedHttpOperatorScopes(req, requestAuth),
  );
  if (!scopeAuth.allowed) {
    sendMissingScopeForbidden(res, scopeAuth.missingScope);
    return true;
  }
  const { entry, canonicalKey } = loadSessionEntry(sessionKey);
  if (!entry) {
    sendJson(res, 404, {
      ok: false,
      error: {
        type: "not_found",
        message: `Session not found: ${sessionKey}`,
      },
    });
    return true;
  }
  sendJson(res, 200, {
    ok: true,
    killed: (
      await killSubagentRunAdmin({
        cfg,
        sessionKey: canonicalKey,
      })
    ).killed,
  });
  return true;
}
//#endregion
export { handleSessionKillHttpRequest };
