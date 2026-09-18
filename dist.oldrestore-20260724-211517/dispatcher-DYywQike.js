import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { t as registerBrowserRoutes } from "./routes-FohuCP_M.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./config-CzdiqFrD.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/browser/src/browser/request-policy.ts
/**
 * Request policy helpers for profile-aware Browser control server routes.
 */
/** Normalizes route paths so mutation-policy checks compare stable slash forms. */
function normalizeBrowserRequestPath(value) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.length <= 1) return withLeadingSlash;
  return withLeadingSlash.replace(/\/+$/, "");
}
/** Returns true when a control request mutates persistent browser profile state. */
function isPersistentBrowserProfileMutation(method, path) {
  const normalizedPath = normalizeBrowserRequestPath(path);
  if (
    method === "POST" &&
    (normalizedPath === "/profiles/create" ||
      normalizedPath === "/profiles/import" ||
      normalizedPath === "/reset-profile")
  )
    return true;
  return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
/**
 * Returns true for the system-profile cookie import route. Import must run where
 * the user's Keychain lives, so it is exempt from the host-local persistent
 * mutation block while remaining blocked over a node proxy.
 */
function isBrowserSystemProfileImport(method, path) {
  return method === "POST" && normalizeBrowserRequestPath(path) === "/profiles/import";
}
/**
 * Returns true for routes that only make sense on the host that owns the local
 * Keychain and Chrome-family profiles: system-profile listing and import. These
 * must be dispatched host-local and never proxied to a browser node.
 */
function isBrowserHostLocalRoute(method, path) {
  if (isBrowserSystemProfileImport(method, path)) return true;
  const normalizedPath = normalizeBrowserRequestPath(path);
  return (
    (method === "GET" &&
      (normalizedPath === "/system-profiles" ||
        normalizedPath === "/system-profile-import/status")) ||
    (method === "POST" && normalizedPath === "/system-profile-import/dismiss")
  );
}
/** Resolves the requested profile from query, body, or route defaults. */
function resolveRequestedBrowserProfile(params) {
  const queryProfile = normalizeOptionalString(params.query?.profile);
  if (queryProfile) return queryProfile;
  if (params.body && typeof params.body === "object") {
    const bodyProfile =
      "profile" in params.body ? normalizeOptionalString(params.body.profile) : void 0;
    if (bodyProfile) return bodyProfile;
  }
  return normalizeOptionalString(params.profile);
}
//#endregion
//#region extensions/browser/src/browser/routes/dispatcher.ts
/**
 * Browser route dispatcher.
 *
 * Provides an in-process request/response adapter so Gateway nodes can invoke
 * the same route handlers without opening an HTTP socket.
 */
function compileRoute(path) {
  const paramNames = [];
  const parts = path.split("/").map((part) => {
    if (part.startsWith(":")) {
      const name = part.slice(1);
      paramNames.push(name);
      return "([^/]+)";
    }
    return escapeRegExp(part);
  });
  return {
    regex: new RegExp(`^${parts.join("/")}$`),
    paramNames,
  };
}
function createRegistry() {
  const routes = [];
  const register = (method) => (path, handler) => {
    const { regex, paramNames } = compileRoute(path);
    routes.push({
      method,
      path,
      regex,
      paramNames,
      handler,
    });
  };
  return {
    routes,
    router: {
      get: register("GET"),
      post: register("POST"),
      delete: register("DELETE"),
    },
  };
}
/** Create an in-process dispatcher for registered browser routes. */
function createBrowserRouteDispatcher(ctx) {
  const registry = createRegistry();
  registerBrowserRoutes(registry.router, ctx);
  return {
    dispatch: async (req) => {
      const method = req.method;
      const path = normalizeBrowserRequestPath(req.path) || "/";
      const query = req.query ?? {};
      const body = req.body;
      const signal = req.signal;
      const match = registry.routes.find((route) => {
        if (route.method !== method) return false;
        return route.regex.test(path);
      });
      if (!match)
        return {
          status: 404,
          body: { error: "Not Found" },
        };
      const exec = match.regex.exec(path);
      const params = {};
      if (exec)
        for (const [idx, name] of match.paramNames.entries()) {
          const value = exec[idx + 1];
          if (typeof value === "string")
            try {
              params[name] = decodeURIComponent(value);
            } catch {
              return {
                status: 400,
                body: { error: `invalid path parameter encoding: ${name}` },
              };
            }
        }
      let status = 200;
      let payload = void 0;
      const res = {
        status(code) {
          status = code;
          return res;
        },
        json(bodyValue) {
          payload = bodyValue;
        },
      };
      try {
        await match.handler(
          {
            params,
            query,
            body,
            signal,
          },
          res,
        );
      } catch (err) {
        return {
          status: 500,
          body: { error: String(err) },
        };
      }
      return {
        status,
        body: payload,
      };
    },
  };
}
//#endregion
export {
  resolveRequestedBrowserProfile as a,
  normalizeBrowserRequestPath as i,
  isBrowserHostLocalRoute as n,
  isPersistentBrowserProfileMutation as r,
  createBrowserRouteDispatcher as t,
};
