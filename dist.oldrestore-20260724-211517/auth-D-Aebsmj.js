import net from "node:net";
import { d as normalizeRateLimitClientIp } from "./auth-rate-limit-DYOdqnES.js";
import { p as isPrivateOrLoopbackIpAddress } from "./ip-CyyRxPli.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import {
  _ as resolveRequestClientIp,
  c as isTrustedProxyAddress,
  f as resolveClientIp,
  g as resolveLocalInterfaceAddressMatch,
  h as resolveHostName,
  i as isLoopbackHost,
  r as isLoopbackAddress,
  u as normalizeHostHeader,
} from "./net-BpMGIYrw.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./auth-resolve-PY0Y7GYi.js";
import { c as readTailscaleWhoisIdentity } from "./tailscale-DdW1pRs5.js";
//#region src/gateway/origin-check.ts
function parseOrigin(originRaw) {
  const trimmed = (originRaw ?? "").trim();
  if (!trimmed || trimmed === "null") return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\/[^/?#\\]+\/?$/i.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (url.username || url.password || !url.protocol || !url.host) return null;
    return {
      origin: normalizeLowercaseStringOrEmpty(
        url.origin === "null" ? `${url.protocol}//${url.host}` : url.origin,
      ),
      host: normalizeLowercaseStringOrEmpty(url.host),
      hostname: normalizeLowercaseStringOrEmpty(url.hostname),
    };
  } catch {
    return null;
  }
}
/** Validate a browser Origin against explicit allowlist, same-host, and local dev rules. */
function checkBrowserOrigin(params) {
  const parsedOrigin = parseOrigin(params.origin);
  if (!parsedOrigin)
    return {
      ok: false,
      reason: "origin missing or invalid",
    };
  const allowlist = new Set(
    (params.allowedOrigins ?? [])
      .map((value) => normalizeOptionalLowercaseString(value))
      .filter(Boolean),
  );
  if (allowlist.has("*") || allowlist.has(parsedOrigin.origin))
    return {
      ok: true,
      matchedBy: "allowlist",
    };
  const requestHost = normalizeHostHeader(params.requestHost);
  if (
    params.allowHostHeaderOriginFallback === true &&
    requestHost &&
    parsedOrigin.host === requestHost
  )
    return {
      ok: true,
      matchedBy: "host-header-fallback",
    };
  if (
    requestHost &&
    parsedOrigin.host === requestHost &&
    isTrustedSameOriginHost(requestHost, params.isLocalClient)
  )
    return {
      ok: true,
      matchedBy: "private-same-origin",
    };
  if (params.isLocalClient && isLoopbackHost(parsedOrigin.hostname))
    return {
      ok: true,
      matchedBy: "local-loopback",
    };
  return {
    ok: false,
    reason: "origin not allowed",
  };
}
function isTrustedSameOriginHost(hostHeader, isLocalClient) {
  const hostname = resolveHostName(hostHeader);
  if (!hostname) return false;
  if (isLoopbackHost(hostname)) return isLocalClient !== false;
  if (net.isIP(hostname) !== 0) return isPrivateOrLoopbackIpAddress(hostname);
  return hostname.endsWith(".local") || hostname.endsWith(".ts.net");
}
//#endregion
//#region src/gateway/rate-limit-attempt-serialization.ts
const pendingAttempts = new KeyedAsyncQueue();
function normalizeScope(scope) {
  return (scope ?? "default").trim() || "default";
}
function buildSerializationKey(ip, scope) {
  return `${normalizeScope(scope)}:${normalizeRateLimitClientIp(ip)}`;
}
/** Runs one attempt after prior work for the same stable key finishes. */
async function withSerializedKeyedAttempt(params) {
  return await pendingAttempts.enqueue(params.key, params.run);
}
/** Runs one rate-limit attempt after prior attempts for the same IP/scope finish. */
async function withSerializedRateLimitAttempt(params) {
  return await withSerializedKeyedAttempt({
    key: buildSerializationKey(params.ip, params.scope),
    run: params.run,
  });
}
//#endregion
//#region src/gateway/auth.ts
const LEGACY_OPENCLAW_ENV_NOTE =
  " Legacy CLAWDBOT_* and MOLTBOT_* environment variables are ignored; use OPENCLAW_* names.";
function resolveGatewayAuthRequestContext(params) {
  const { req, trustedProxies } = params;
  const authSurface = params.authSurface ?? "http";
  const ip =
    params.clientIp ??
    resolveRequestClientIp(req, trustedProxies, params.allowRealIpFallback === true) ??
    req?.socket?.remoteAddress;
  return {
    authSurface,
    limiter: params.rateLimiter,
    ip,
    rateLimitScope: params.rateLimitScope ?? "shared-secret",
    localDirect: isLocalDirectRequest(req, trustedProxies, params.allowRealIpFallback === true),
  };
}
function hasExplicitSharedSecretAuth(connectAuth) {
  return Boolean(
    normalizeOptionalString(connectAuth?.token) || normalizeOptionalString(connectAuth?.password),
  );
}
function normalizeLogin(login) {
  return normalizeLowercaseStringOrEmpty(login);
}
function headerValue(value) {
  return Array.isArray(value) ? value[0] : value;
}
const TAILSCALE_TRUSTED_PROXIES = ["127.0.0.1", "::1"];
function resolveTailscaleClientIp(req) {
  if (!req) return;
  return resolveClientIp({
    remoteAddr: req.socket?.remoteAddress ?? "",
    forwardedFor: headerValue(req.headers?.["x-forwarded-for"]),
    trustedProxies: [...TAILSCALE_TRUSTED_PROXIES],
  });
}
/** Detect forwarded/proxy headers that make loopback requests ineligible for direct-local auth. */
/** Return true when forwarded headers make loopback direct-local auth unsafe. */
function hasForwardedRequestHeaders(req) {
  if (!req) return false;
  const headers = req.headers ?? {};
  return Boolean(
    headers.forwarded ||
    headers["x-real-ip"] ||
    Object.keys(headers).some((header) =>
      normalizeLowercaseStringOrEmpty(header).startsWith("x-forwarded-"),
    ),
  );
}
/** Return whether a request is a clean loopback request without forwarded identity headers. */
function isLocalDirectRequest(req, _trustedProxies, _allowRealIpFallback = false) {
  if (!req) return false;
  if (!hasForwardedRequestHeaders(req)) return isLoopbackAddress(req.socket?.remoteAddress);
  return false;
}
function getTailscaleUser(req) {
  if (!req) return null;
  const login = normalizeOptionalString(req.headers["tailscale-user-login"]);
  if (!login) return null;
  const nameRaw = req.headers["tailscale-user-name"];
  const profilePic = req.headers["tailscale-user-profile-pic"];
  return {
    login,
    name: normalizeOptionalString(nameRaw) ?? login,
    profilePic: normalizeOptionalString(profilePic),
  };
}
function hasTailscaleProxyHeaders(req) {
  if (!req) return false;
  return Boolean(
    req.headers["x-forwarded-for"] &&
    req.headers["x-forwarded-proto"] &&
    req.headers["x-forwarded-host"],
  );
}
function isTailscaleProxyRequest(req) {
  if (!req) return false;
  return isLoopbackAddress(req.socket?.remoteAddress) && hasTailscaleProxyHeaders(req);
}
async function resolveVerifiedTailscaleUser(params) {
  const { req, tailscaleWhois } = params;
  const tailscaleUser = getTailscaleUser(req);
  if (!tailscaleUser)
    return {
      ok: false,
      reason: "tailscale_user_missing",
    };
  if (!isTailscaleProxyRequest(req))
    return {
      ok: false,
      reason: "tailscale_proxy_missing",
    };
  const clientIp = resolveTailscaleClientIp(req);
  if (!clientIp)
    return {
      ok: false,
      reason: "tailscale_whois_failed",
    };
  const whois = await tailscaleWhois(clientIp);
  if (!whois?.login)
    return {
      ok: false,
      reason: "tailscale_whois_failed",
    };
  if (normalizeLogin(whois.login) !== normalizeLogin(tailscaleUser.login))
    return {
      ok: false,
      reason: "tailscale_user_mismatch",
    };
  return {
    ok: true,
    user: {
      login: whois.login,
      name: whois.name ?? tailscaleUser.name,
      profilePic: tailscaleUser.profilePic,
    },
  };
}
/** Validate that the selected gateway auth mode has the required resolved credentials/config. */
function assertGatewayAuthConfigured(auth, rawAuthConfig) {
  if (auth.mode === "token" && !auth.token) {
    if (auth.allowTailscale) return;
    throw new Error(
      `gateway auth mode is token, but no token was configured (set gateway.auth.token or OPENCLAW_GATEWAY_TOKEN).${LEGACY_OPENCLAW_ENV_NOTE}`,
    );
  }
  if (auth.mode === "password" && !auth.password) {
    if (rawAuthConfig?.password != null && typeof rawAuthConfig.password !== "string")
      throw new Error(
        "gateway auth mode is password, but gateway.auth.password contains a provider reference object instead of a resolved string — bootstrap secrets (gateway.auth.password) must be plaintext strings or set via the OPENCLAW_GATEWAY_PASSWORD environment variable because the secrets provider system has not initialised yet at gateway startup",
      );
    throw new Error(
      `gateway auth mode is password, but no password was configured.${LEGACY_OPENCLAW_ENV_NOTE}`,
    );
  }
  if (auth.mode === "trusted-proxy") {
    if (!auth.trustedProxy)
      throw new Error(
        "gateway auth mode is trusted-proxy, but no trustedProxy config was provided (set gateway.auth.trustedProxy)",
      );
    if (!auth.trustedProxy.userHeader || auth.trustedProxy.userHeader.trim() === "")
      throw new Error(
        "gateway auth mode is trusted-proxy, but trustedProxy.userHeader is empty (set gateway.auth.trustedProxy.userHeader)",
      );
    if (auth.token)
      throw new Error(
        "gateway auth mode is trusted-proxy, but a shared token is also configured; remove gateway.auth.token / OPENCLAW_GATEWAY_TOKEN because trusted-proxy and token auth are mutually exclusive",
      );
  }
}
/**
 * Check if the request came from a trusted proxy and extract user identity.
 * Returns the user identity if valid, or null with a reason if not.
 */
function authorizeTrustedProxy(params) {
  const { req, trustedProxies, trustedProxyConfig } = params;
  if (!req) return { reason: "trusted_proxy_no_request" };
  const remoteAddr = req.socket?.remoteAddress;
  if (!remoteAddr || !isTrustedProxyAddress(remoteAddr, trustedProxies))
    return { reason: "trusted_proxy_untrusted_source" };
  const remoteIsLoopback = isLoopbackAddress(remoteAddr);
  if (remoteIsLoopback && trustedProxyConfig.allowLoopback !== true)
    return { reason: "trusted_proxy_loopback_source" };
  if (!remoteIsLoopback) {
    const localInterfaceMatch = resolveLocalInterfaceAddressMatch(remoteAddr);
    if (localInterfaceMatch === void 0)
      return { reason: "trusted_proxy_local_interface_check_failed" };
    if (localInterfaceMatch) return { reason: "trusted_proxy_local_interface_source" };
  }
  const requiredHeaders = trustedProxyConfig.requiredHeaders ?? [];
  for (const header of requiredHeaders) {
    const value = headerValue(req.headers[normalizeLowercaseStringOrEmpty(header)]);
    if (!value || value.trim() === "") return { reason: `trusted_proxy_missing_header_${header}` };
  }
  const userHeaderValue = headerValue(
    req.headers[normalizeLowercaseStringOrEmpty(trustedProxyConfig.userHeader)],
  );
  if (!userHeaderValue || userHeaderValue.trim() === "")
    return { reason: "trusted_proxy_user_missing" };
  const user = userHeaderValue.trim();
  const allowUsers = trustedProxyConfig.allowUsers ?? [];
  if (allowUsers.length > 0 && !allowUsers.includes(user))
    return { reason: "trusted_proxy_user_not_allowed" };
  return { user };
}
function shouldAllowTailscaleHeaderAuth(authSurface) {
  return authSurface === "ws-control-ui";
}
function authorizeHttpBrowserOrigin(params) {
  if (params.authSurface !== "http") return null;
  const origin = params.browserOriginPolicy?.origin?.trim();
  if (!origin) return null;
  if (
    checkBrowserOrigin({
      requestHost: params.browserOriginPolicy?.requestHost,
      origin,
      allowedOrigins: params.browserOriginPolicy?.allowedOrigins,
      allowHostHeaderOriginFallback: params.browserOriginPolicy?.allowHostHeaderOriginFallback,
      isLocalClient: params.isLocalClient,
    }).ok
  )
    return null;
  return {
    ok: false,
    reason: params.reason,
  };
}
function authorizeTrustedProxyBrowserOrigin(params) {
  return authorizeHttpBrowserOrigin({
    ...params,
    isLocalClient: false,
    reason: "trusted_proxy_origin_not_allowed",
  });
}
function authorizeTokenAuth(params) {
  if (!params.authToken)
    return {
      ok: false,
      reason: "token_missing_config",
    };
  if (!params.connectToken)
    return {
      ok: false,
      reason: "token_missing",
    };
  if (!safeEqualSecret(params.connectToken, params.authToken)) {
    params.limiter?.recordFailure(params.ip, params.rateLimitScope);
    return {
      ok: false,
      reason: "token_mismatch",
    };
  }
  params.limiter?.reset(params.ip, params.rateLimitScope);
  return {
    ok: true,
    method: "token",
  };
}
function authorizePasswordAuth(params) {
  if (!params.authPassword)
    return {
      ok: false,
      reason: "password_missing_config",
    };
  if (!params.connectPassword)
    return {
      ok: false,
      reason: "password_missing",
    };
  if (!safeEqualSecret(params.connectPassword, params.authPassword)) {
    params.limiter?.recordFailure(params.ip, params.rateLimitScope);
    return {
      ok: false,
      reason: "password_mismatch",
    };
  }
  params.limiter?.reset(params.ip, params.rateLimitScope);
  return {
    ok: true,
    method: "password",
  };
}
function rejectIfRateLimited(params) {
  if (!params.limiter) return;
  const rlCheck = params.limiter.check(params.ip, params.rateLimitScope);
  if (rlCheck.allowed) return;
  return {
    ok: false,
    reason: "rate_limited",
    rateLimited: true,
    retryAfterMs: rlCheck.retryAfterMs,
  };
}
/** Authorize a gateway connection, including rate-limit handling around shared-secret failures. */
async function authorizeGatewayConnect(params) {
  const { auth } = params;
  const { authSurface, limiter, ip, rateLimitScope, localDirect } =
    resolveGatewayAuthRequestContext(params);
  if (limiter && shouldAllowTailscaleHeaderAuth(authSurface) && auth.allowTailscale && !localDirect)
    return await withSerializedRateLimitAttempt({
      ip,
      scope: rateLimitScope,
      run: async () => await authorizeGatewayConnectCore(params),
    });
  return await authorizeGatewayConnectCore(params);
}
async function authorizeGatewayConnectCore(params) {
  const { auth, connectAuth, req, trustedProxies } = params;
  const tailscaleWhois = params.tailscaleWhois ?? readTailscaleWhoisIdentity;
  const { authSurface, limiter, ip, rateLimitScope, localDirect } =
    resolveGatewayAuthRequestContext(params);
  const allowTailscaleHeaderAuth = shouldAllowTailscaleHeaderAuth(authSurface);
  if (auth.mode === "trusted-proxy") {
    if (!auth.trustedProxy)
      return {
        ok: false,
        reason: "trusted_proxy_config_missing",
      };
    if (!trustedProxies || trustedProxies.length === 0)
      return {
        ok: false,
        reason: "trusted_proxy_no_proxies_configured",
      };
    const result = authorizeTrustedProxy({
      req,
      trustedProxies,
      trustedProxyConfig: auth.trustedProxy,
    });
    if ("user" in result) {
      const originResult = authorizeTrustedProxyBrowserOrigin({
        authSurface,
        browserOriginPolicy: params.browserOriginPolicy,
      });
      if (originResult) return originResult;
      return {
        ok: true,
        method: "trusted-proxy",
        user: result.user,
      };
    }
    if (localDirect && auth.password && connectAuth?.password) {
      const rateLimitResult = rejectIfRateLimited({
        limiter,
        ip,
        rateLimitScope,
      });
      if (rateLimitResult) return rateLimitResult;
      return authorizePasswordAuth({
        authPassword: auth.password,
        connectPassword: connectAuth.password,
        limiter,
        ip,
        rateLimitScope,
      });
    }
    return {
      ok: false,
      reason: result.reason,
    };
  }
  if (auth.mode === "none") {
    const originResult = authorizeHttpBrowserOrigin({
      authSurface,
      browserOriginPolicy: params.browserOriginPolicy,
      isLocalClient: localDirect,
      reason: "origin_not_allowed",
    });
    if (originResult) return originResult;
    return {
      ok: true,
      method: "none",
    };
  }
  const rateLimitResult = rejectIfRateLimited({
    limiter,
    ip,
    rateLimitScope,
  });
  if (rateLimitResult) return rateLimitResult;
  if (
    allowTailscaleHeaderAuth &&
    auth.allowTailscale &&
    !localDirect &&
    !hasExplicitSharedSecretAuth(connectAuth)
  ) {
    const tailscaleCheck = await resolveVerifiedTailscaleUser({
      req,
      tailscaleWhois,
    });
    if (tailscaleCheck.ok) {
      limiter?.reset(ip, rateLimitScope);
      return {
        ok: true,
        method: "tailscale",
        user: tailscaleCheck.user.login,
      };
    }
  }
  if (auth.mode === "token")
    return authorizeTokenAuth({
      authToken: auth.token,
      connectToken: connectAuth?.token,
      limiter,
      ip,
      rateLimitScope,
    });
  if (auth.mode === "password")
    return authorizePasswordAuth({
      authPassword: auth.password,
      connectPassword: connectAuth?.password,
      limiter,
      ip,
      rateLimitScope,
    });
  limiter?.recordFailure(ip, rateLimitScope);
  return {
    ok: false,
    reason: "unauthorized",
  };
}
/** Authorize an HTTP gateway request with Tailscale forwarded-header auth disabled. */
async function authorizeHttpGatewayConnect(params) {
  return authorizeGatewayConnect({
    ...params,
    authSurface: "http",
  });
}
/** Authorize a Control UI websocket request with the WS-specific auth surface. */
async function authorizeWsControlUiGatewayConnect(params) {
  return authorizeGatewayConnect({
    ...params,
    authSurface: "ws-control-ui",
  });
}
//#endregion
export {
  isLocalDirectRequest as a,
  checkBrowserOrigin as c,
  hasForwardedRequestHeaders as i,
  authorizeHttpGatewayConnect as n,
  withSerializedKeyedAttempt as o,
  authorizeWsControlUiGatewayConnect as r,
  withSerializedRateLimitAttempt as s,
  assertGatewayAuthConfigured as t,
};
