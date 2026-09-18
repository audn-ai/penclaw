import {
  n as canonicalizePathForSecurity,
  r as canonicalizePathVariant,
  t as PROTECTED_PLUGIN_ROUTE_PREFIXES,
} from "./security-path-DS4MTvOw.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
  const collapsed = normalizeLowercaseStringOrEmpty(prefix).replace(/\/{2,}/g, "/");
  if (collapsed.length <= 1) return collapsed || "/";
  return collapsed.replace(/\/+$/, "");
}
/** Matches a normalized path against an exact protected prefix boundary. */
function prefixMatchPath(pathname, prefix) {
  return (
    pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`)
  );
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES =
  PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
  if (
    context.candidates.some((candidate) =>
      NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) =>
        prefixMatchPath(candidate, prefix),
      ),
    )
  )
    return true;
  if (context.decodePassLimitReached) return true;
  if (!context.malformedEncoding) return false;
  return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) =>
    prefixMatchPath(context.rawNormalizedPath, prefix),
  );
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
  const canonical = canonicalizePathForSecurity(pathname);
  return {
    pathname,
    canonicalPath: canonical.canonicalPath,
    candidates: canonical.candidates,
    malformedEncoding: canonical.malformedEncoding,
    decodePassLimitReached: canonical.decodePassLimitReached,
    rawNormalizedPath: canonical.rawNormalizedPath,
  };
}
//#endregion
//#region src/gateway/server/plugins-http/route-match.ts
/** Returns true when a registered route matches any canonical request candidate. */
function doesPluginRouteMatchPath(route, context) {
  const routeCanonicalPath = canonicalizePathVariant(route.path);
  if (route.match === "prefix")
    return context.candidates.some((candidate) => prefixMatchPath(candidate, routeCanonicalPath));
  return context.candidates.some((candidate) => candidate === routeCanonicalPath);
}
/** Finds matching plugin routes with exact matches ordered before prefix matches. */
function findMatchingPluginHttpRoutes(registry, context) {
  const routes = registry.httpRoutes ?? [];
  if (routes.length === 0) return [];
  const exactMatches = [];
  const prefixMatches = [];
  for (const route of routes) {
    if (!doesPluginRouteMatchPath(route, context)) continue;
    if (route.match === "prefix") prefixMatches.push(route);
    else exactMatches.push(route);
  }
  exactMatches.sort((a, b) => b.path.length - a.path.length);
  prefixMatches.sort((a, b) => b.path.length - a.path.length);
  return [...exactMatches, ...prefixMatches];
}
/** Returns the first registered plugin HTTP route for a raw request path. */
function findRegisteredPluginHttpRoute(registry, pathname) {
  return findMatchingPluginHttpRoutes(registry, resolvePluginRoutePathContext(pathname))[0];
}
/** Convenience predicate for checking whether a raw path is a plugin HTTP route. */
function isRegisteredPluginHttpRoutePath(registry, pathname) {
  return findRegisteredPluginHttpRoute(registry, pathname) !== void 0;
}
//#endregion
export {
  resolvePluginRoutePathContext as a,
  isProtectedPluginRoutePathFromContext as i,
  findRegisteredPluginHttpRoute as n,
  isRegisteredPluginHttpRoutePath as r,
  findMatchingPluginHttpRoutes as t,
};
