import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import {
  n as loadBundledPluginPublicArtifactModuleSync,
  r as loadPluginPublicArtifactModuleSync,
} from "./public-surface-loader-X-jDa4d1.js";
//#region src/plugins/provider-policy-surface.ts
const PROVIDER_POLICY_ARTIFACT_CANDIDATES = ["provider-policy-api.js"];
const providerPolicySurfaceByPluginId = /* @__PURE__ */ new Map();
function hasProviderPolicyHook(mod) {
  return (
    typeof mod.normalizeConfig === "function" ||
    typeof mod.applyConfigDefaults === "function" ||
    typeof mod.resolveConfigApiKey === "function" ||
    typeof mod.resolveThinkingProfile === "function" ||
    typeof mod.resolveModelRoutes === "function" ||
    typeof mod.normalizeModelCatalogId === "function"
  );
}
function resolveCachedProviderPolicySurface(params) {
  const cached = providerPolicySurfaceByPluginId.get(params.cacheKey);
  if (cached !== void 0) return cached;
  for (const artifactBasename of PROVIDER_POLICY_ARTIFACT_CANDIDATES)
    try {
      const mod = params.loadModule(artifactBasename);
      if (hasProviderPolicyHook(mod)) {
        providerPolicySurfaceByPluginId.set(params.cacheKey, mod);
        return mod;
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith(params.missingSurfacePrefix)) continue;
      throw error;
    }
  providerPolicySurfaceByPluginId.set(params.cacheKey, null);
  return null;
}
/** Loads policy hooks directly by canonical bundled plugin id. */
function resolveDirectBundledProviderPolicySurface(pluginId) {
  return resolveCachedProviderPolicySurface({
    cacheKey: `${resolveBundledPluginsDir() ?? ""}\0${pluginId}`,
    loadModule: (artifactBasename) =>
      loadBundledPluginPublicArtifactModuleSync({
        dirName: pluginId,
        artifactBasename,
      }),
    missingSurfacePrefix: "Unable to resolve bundled plugin public surface ",
  });
}
/** Loads policy hooks from a host-verified official external plugin install. */
function resolveTrustedExternalProviderPolicySurface(params) {
  if (params.trustedOfficialInstall !== true) return null;
  return resolveCachedProviderPolicySurface({
    cacheKey: `${params.pluginRoot}\0${params.pluginId}`,
    loadModule: (artifactBasename) =>
      loadPluginPublicArtifactModuleSync({
        pluginRoot: params.pluginRoot,
        artifactBasename,
      }),
    missingSurfacePrefix: "Unable to resolve plugin public surface ",
  });
}
//#endregion
export {
  resolveTrustedExternalProviderPolicySurface as n,
  resolveDirectBundledProviderPolicySurface as t,
};
