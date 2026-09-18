import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  n as resolveBundledPluginsDir,
  t as areBundledPluginsDisabled,
} from "./bundled-dir-CehpKn-r.js";
import {
  i as loadFacadeModuleAtLocationSync$1,
  r as loadBundledPluginPublicSurfaceModuleSync$1,
} from "./facade-loader-KNgtRNDP.js";
import {
  n as resolveBundledFacadeModuleLocation,
  t as createFacadeResolutionKey$1,
} from "./facade-resolution-shared-DyJAlyER.js";
import { r as getCachedPluginSourceModuleLoader } from "./plugin-module-loader-cache-CDpLvLFE.js";
import { a as resolveLoaderPackageRoot } from "./sdk-alias-huj8Ygt2.js";
//#region src/plugin-sdk/facade-runtime.ts
/** Create a lazy value/function proxy for one property of a facade module. */
function createLazyFacadeValue(loadFacadeModule, key) {
  return (...args) => {
    const value = loadFacadeModule()[key];
    if (typeof value !== "function") return value;
    return value(...args);
  };
}
const OPENCLAW_PACKAGE_ROOT =
  resolveLoaderPackageRoot({
    modulePath: fileURLToPath(import.meta.url),
    moduleUrl: import.meta.url,
  }) ?? fileURLToPath(new URL("../..", import.meta.url));
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const OPENCLAW_SOURCE_EXTENSIONS_ROOT = path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions");
function createFacadeResolutionKey(params) {
  const bundledPluginsDir = resolveBundledPluginsDir(params.env ?? process.env);
  return createFacadeResolutionKey$1({
    ...params,
    bundledPluginsDir,
    ...(params.env ? { env: params.env } : {}),
  });
}
function resolveRegistryPluginModuleLocation(params) {
  return loadFacadeActivationCheckRuntime().resolveRegistryPluginModuleLocation({
    ...params,
    resolutionKey: createFacadeResolutionKey(params),
  });
}
function resolveFacadeModuleLocationUncached(params) {
  const env = params.env ?? process.env;
  if (!areBundledPluginsDisabled(env)) {
    const bundledPluginsDir = resolveBundledPluginsDir(env);
    const bundledLocation = resolveBundledFacadeModuleLocation({
      ...params,
      currentModulePath: CURRENT_MODULE_PATH,
      packageRoot: OPENCLAW_PACKAGE_ROOT,
      bundledPluginsDir,
    });
    if (bundledLocation) return bundledLocation;
  }
  return resolveRegistryPluginModuleLocation(params);
}
function resolveFacadeModuleLocation(params) {
  return resolveFacadeModuleLocationUncached(params);
}
const nodeRequire = createRequire(import.meta.url);
const FACADE_ACTIVATION_CHECK_RUNTIME_CANDIDATES = [
  "./facade-activation-check.runtime.js",
  "./facade-activation-check.runtime.ts",
];
let facadeActivationCheckRuntimeModule;
const facadeActivationCheckRuntimeLoaders = /* @__PURE__ */ new Map();
function getFacadeActivationCheckRuntimeSourceLoader(modulePath) {
  return getCachedPluginSourceModuleLoader({
    cache: facadeActivationCheckRuntimeLoaders,
    modulePath,
    importerUrl: import.meta.url,
    loaderFilename: import.meta.url,
    aliasMap: {},
  });
}
function loadFacadeActivationCheckRuntimeFromCandidates(loadCandidate) {
  for (const candidate of FACADE_ACTIVATION_CHECK_RUNTIME_CANDIDATES)
    try {
      return loadCandidate(candidate);
    } catch {}
}
function loadFacadeActivationCheckRuntime() {
  if (facadeActivationCheckRuntimeModule) return facadeActivationCheckRuntimeModule;
  facadeActivationCheckRuntimeModule = loadFacadeActivationCheckRuntimeFromCandidates((candidate) =>
    nodeRequire(candidate),
  );
  if (facadeActivationCheckRuntimeModule) return facadeActivationCheckRuntimeModule;
  facadeActivationCheckRuntimeModule = loadFacadeActivationCheckRuntimeFromCandidates((candidate) =>
    getFacadeActivationCheckRuntimeSourceLoader(candidate)(candidate),
  );
  if (facadeActivationCheckRuntimeModule) return facadeActivationCheckRuntimeModule;
  throw new Error("Unable to load facade activation check runtime");
}
async function loadFacadeActivationCheckRuntimeAsync() {
  facadeActivationCheckRuntimeModule ??= await import("./facade-activation-check.runtime.js");
  return facadeActivationCheckRuntimeModule;
}
function loadFacadeModuleAtLocationSync(params) {
  return loadFacadeModuleAtLocationSync$1(params);
}
function buildFacadeActivationCheckParams(params, location = resolveFacadeModuleLocation(params)) {
  return {
    ...params,
    location,
    sourceExtensionsRoot: OPENCLAW_SOURCE_EXTENSIONS_ROOT,
    resolutionKey: createFacadeResolutionKey(params),
  };
}
/** Load a bundled or registry-backed plugin public surface, tracking activation ownership. */
function loadBundledPluginPublicSurfaceModuleSync(params) {
  const location = resolveFacadeModuleLocation(params);
  const trackedPluginId = () =>
    loadFacadeActivationCheckRuntime().resolveTrackedFacadePluginId(
      buildFacadeActivationCheckParams(params, location),
    );
  if (!location)
    return loadBundledPluginPublicSurfaceModuleSync$1({
      ...params,
      trackedPluginId,
    });
  return loadFacadeModuleAtLocationSync({
    location,
    trackedPluginId,
    runtimeDeps: {
      pluginId: params.dirName,
      ...(params.env ? { env: params.env } : {}),
    },
  });
}
/** Check whether an activated bundled plugin public surface may be loaded. */
function canLoadActivatedBundledPluginPublicSurface(params) {
  return loadFacadeActivationCheckRuntime().resolveBundledPluginPublicSurfaceAccess(
    buildFacadeActivationCheckParams(params),
  ).allowed;
}
/** Load an activated plugin public surface or throw when activation policy blocks access. */
function loadActivatedBundledPluginPublicSurfaceModuleSync(params) {
  loadFacadeActivationCheckRuntime().resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(
    buildFacadeActivationCheckParams(params),
  );
  return loadBundledPluginPublicSurfaceModuleSync(params);
}
/** Load an activated plugin public surface, returning null when activation policy blocks access. */
function tryLoadActivatedBundledPluginPublicSurfaceModuleSync(params) {
  if (
    !loadFacadeActivationCheckRuntime().resolveBundledPluginPublicSurfaceAccess(
      buildFacadeActivationCheckParams(params),
    ).allowed
  )
    return null;
  return loadBundledPluginPublicSurfaceModuleSync(params);
}
/** Async variant of tryLoadActivatedBundledPluginPublicSurfaceModuleSync for async call sites. */
async function tryLoadActivatedBundledPluginPublicSurfaceModule(params) {
  if (
    !(await loadFacadeActivationCheckRuntimeAsync()).resolveBundledPluginPublicSurfaceAccess(
      buildFacadeActivationCheckParams(params),
    ).allowed
  )
    return null;
  return loadBundledPluginPublicSurfaceModuleSync(params);
}
//#endregion
export {
  tryLoadActivatedBundledPluginPublicSurfaceModule as a,
  loadBundledPluginPublicSurfaceModuleSync as i,
  createLazyFacadeValue as n,
  tryLoadActivatedBundledPluginPublicSurfaceModuleSync as o,
  loadActivatedBundledPluginPublicSurfaceModuleSync as r,
  canLoadActivatedBundledPluginPublicSurface as t,
};
