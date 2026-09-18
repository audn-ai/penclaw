import { u as resolvePluginNodeCapabilityTtlMs } from "./plugin-node-capability-BAHU33fB.js";
import { t as findMatchingPluginHttpRoutes } from "./route-match-CjzRe5Nj.js";
//#region src/gateway/server/plugins-http/route-capability.ts
function hasNodeCapabilityRoute(route) {
  return Boolean(route.nodeCapability?.surface?.trim());
}
function resolvePluginNodeCapabilityRouteSurface(route) {
  const surface = route.nodeCapability.surface.trim();
  const owner = route.pluginId?.trim() || route.source?.trim();
  return {
    ...route.nodeCapability,
    surface,
    ...(owner ? { scopeKey: `${owner}:${surface}` } : {}),
  };
}
/** Lists all node-capability routes matching the already canonicalized path context. */
function findMatchingPluginNodeCapabilityRoutes(registry, context) {
  return findMatchingPluginHttpRoutes(registry, context)
    .filter(hasNodeCapabilityRoute)
    .map((route) =>
      Object.assign({}, route, { nodeCapability: resolvePluginNodeCapabilityRouteSurface(route) }),
    );
}
/** Returns the highest-priority node-capability route for a plugin HTTP path. */
function findMatchingPluginNodeCapabilityRoute(registry, context) {
  return findMatchingPluginNodeCapabilityRoutes(registry, context)[0];
}
/** Lists unique node-capability surfaces, preferring the shortest TTL per surface. */
function listPluginNodeCapabilities(registry) {
  const surfaces = /* @__PURE__ */ new Map();
  for (const route of registry.httpRoutes ?? []) {
    const surface = route.nodeCapability?.surface?.trim();
    if (surface) {
      const next = resolvePluginNodeCapabilityRouteSurface(route);
      const existing = surfaces.get(surface);
      if (!existing || resolveTtlMs(next) < resolveTtlMs(existing)) surfaces.set(surface, next);
    }
  }
  return [...surfaces.values()].toSorted((a, b) => a.surface.localeCompare(b.surface));
}
function resolveTtlMs(surface) {
  return resolvePluginNodeCapabilityTtlMs(surface);
}
//#endregion
export { listPluginNodeCapabilities as n, findMatchingPluginNodeCapabilityRoute as t };
