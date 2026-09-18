import express from "express";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./cdp.helpers-ChuUODxP.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/browser/src/browser/csrf.ts
function firstHeader(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}
function isMutatingMethod(method) {
  const m = (method || "").trim().toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}
function isLoopbackUrl(value) {
  const v = value.trim();
  if (!v || v === "null") return false;
  try {
    return isLoopbackHost(new URL(v).hostname);
  } catch {
    return false;
  }
}
/** Return true when a request should be rejected as browser-originated CSRF. */
function shouldRejectBrowserMutation(params) {
  if (!isMutatingMethod(params.method)) return false;
  if (normalizeLowercaseStringOrEmpty(params.secFetchSite) === "cross-site") return true;
  const origin = (params.origin ?? "").trim();
  if (origin) return !isLoopbackUrl(origin);
  const referer = (params.referer ?? "").trim();
  if (referer) return !isLoopbackUrl(referer);
  return false;
}
/** Create middleware that rejects unsafe browser-control mutations. */
function browserMutationGuardMiddleware() {
  return (req, res, next) => {
    const method = (req.method || "").trim().toUpperCase();
    if (method === "OPTIONS") return next();
    if (
      shouldRejectBrowserMutation({
        method,
        origin: firstHeader(req.headers.origin),
        referer: firstHeader(req.headers.referer),
        secFetchSite: firstHeader(req.headers["sec-fetch-site"]),
      })
    ) {
      res.status(403).send("Forbidden");
      return;
    }
    next();
  };
}
//#endregion
//#region extensions/browser/src/browser/http-auth.ts
function firstHeaderValue(value) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}
function parseBearerToken(authorization) {
  if (!normalizeLowercaseStringOrEmpty(authorization).startsWith("bearer ")) return;
  return authorization.slice(7).trim() || void 0;
}
function parseBasicPassword(authorization) {
  if (!normalizeLowercaseStringOrEmpty(authorization).startsWith("basic ")) return;
  const encoded = authorization.slice(6).trim();
  if (!encoded) return;
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const sep = decoded.indexOf(":");
    if (sep < 0) return;
    return decoded.slice(sep + 1).trim() || void 0;
  } catch {
    return;
  }
}
/** Return true when request headers satisfy browser-control auth. */
function isAuthorizedBrowserRequest(req, auth) {
  const authorization = firstHeaderValue(req.headers.authorization).trim();
  if (auth.token) {
    const bearer = parseBearerToken(authorization);
    if (bearer && safeEqualSecret(bearer, auth.token)) return true;
  }
  if (auth.password) {
    const passwordHeader = firstHeaderValue(req.headers["x-openclaw-password"]).trim();
    if (passwordHeader && safeEqualSecret(passwordHeader, auth.password)) return true;
    const basicPassword = parseBasicPassword(authorization);
    if (basicPassword && safeEqualSecret(basicPassword, auth.password)) return true;
  }
  return false;
}
//#endregion
//#region extensions/browser/src/browser/server-middleware.ts
const BROWSER_AUTH_VERIFIED_FLAG = "__openclawBrowserAuthVerified";
/** Returns whether Browser auth middleware already verified this request. */
function hasVerifiedBrowserAuth(req) {
  return req[BROWSER_AUTH_VERIFIED_FLAG] === true;
}
function markVerifiedBrowserAuth(req) {
  req[BROWSER_AUTH_VERIFIED_FLAG] = true;
}
/** Installs common Browser control-server middleware. */
function installBrowserCommonMiddleware(app) {
  app.use((req, res, next) => {
    const ctrl = new AbortController();
    const abort = () => ctrl.abort(/* @__PURE__ */ new Error("request aborted"));
    req.once("aborted", abort);
    res.once("close", () => {
      if (!res.writableEnded) abort();
    });
    Object.defineProperty(req, "signal", {
      value: ctrl.signal,
      configurable: true,
    });
    next();
  });
  app.use(browserMutationGuardMiddleware());
  app.use(express.json({ limit: "1mb" }));
}
/** Installs optional token/password auth for Browser control-server requests. */
function installBrowserAuthMiddleware(app, auth) {
  if (!auth.token && !auth.password) return;
  app.use((req, res, next) => {
    if (isAuthorizedBrowserRequest(req, auth)) {
      markVerifiedBrowserAuth(req);
      return next();
    }
    res.status(401).send("Unauthorized");
  });
}
//#endregion
export {
  installBrowserAuthMiddleware as n,
  installBrowserCommonMiddleware as r,
  hasVerifiedBrowserAuth as t,
};
