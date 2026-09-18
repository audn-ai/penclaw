import fs from "node:fs";
import "./boundary-file-read-CBe_wA_B.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import { n as resolveBundledFacadeModuleLocation } from "./facade-resolution-shared-DyJAlyER.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-BNUEpDI2.js";
import { n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-CDpLvLFE.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import { a as resolveLoaderPackageRoot } from "./sdk-alias-huj8Ygt2.js";
//#region src/plugin-sdk/facade-loader.ts
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const moduleLoaders = /* @__PURE__ */ new Map();
const loadedFacadeModules = /* @__PURE__ */ new Map();
const loadedFacadePluginIds = /* @__PURE__ */ new Set();
let cachedOpenClawPackageRoot;
function getOpenClawPackageRoot() {
  if (cachedOpenClawPackageRoot) return cachedOpenClawPackageRoot;
  cachedOpenClawPackageRoot =
    resolveLoaderPackageRoot({
      modulePath: fileURLToPath(import.meta.url),
      moduleUrl: import.meta.url,
    }) ?? fileURLToPath(new URL("../..", import.meta.url));
  return cachedOpenClawPackageRoot;
}
function resolveFacadeModuleLocation(params) {
  const bundledPluginsDir = resolveBundledPluginsDir(params.env ?? process.env);
  return resolveBundledFacadeModuleLocation({
    ...params,
    currentModulePath: CURRENT_MODULE_PATH,
    packageRoot: getOpenClawPackageRoot(),
    bundledPluginsDir,
  });
}
function getModuleLoader(modulePath) {
  return getCachedPluginModuleLoader({
    cache: moduleLoaders,
    modulePath,
    importerUrl: import.meta.url,
    preferBuiltDist: true,
    loaderFilename: import.meta.url,
  });
}
function createLazyFacadeValueLoader(load) {
  let loaded = false;
  let value;
  return () => {
    if (!loaded) {
      value = load();
      loaded = true;
    }
    return value;
  };
}
function createLazyFacadeProxyValue(params) {
  const resolve = createLazyFacadeValueLoader(params.load);
  return new Proxy(params.target, {
    defineProperty(_target, property, descriptor) {
      return Reflect.defineProperty(resolve(), property, descriptor);
    },
    deleteProperty(_target, property) {
      return Reflect.deleteProperty(resolve(), property);
    },
    get(_target, property, receiver) {
      return Reflect.get(resolve(), property, receiver);
    },
    getOwnPropertyDescriptor(_target, property) {
      return Reflect.getOwnPropertyDescriptor(resolve(), property);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(resolve());
    },
    has(_target, property) {
      return Reflect.has(resolve(), property);
    },
    isExtensible() {
      return Reflect.isExtensible(resolve());
    },
    ownKeys() {
      return Reflect.ownKeys(resolve());
    },
    preventExtensions() {
      return Reflect.preventExtensions(resolve());
    },
    set(_target, property, value, receiver) {
      return Reflect.set(resolve(), property, value, receiver);
    },
    setPrototypeOf(_target, prototype) {
      return Reflect.setPrototypeOf(resolve(), prototype);
    },
  });
}
/** Create an object proxy that loads the underlying facade only on first property access. */
function createLazyFacadeObjectValue(load) {
  return createLazyFacadeProxyValue({
    load,
    target: {},
  });
}
function isPathAtOrInside(target, root) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + path.sep);
}
function resolveFacadeBoundaryOpenParams(boundaryRoot) {
  if (isPathAtOrInside(boundaryRoot, getOpenClawPackageRoot()))
    return {
      boundaryLabel: "OpenClaw package root",
      rejectHardlinks: false,
    };
  const bundledDir = resolveBundledPluginsDir();
  if (bundledDir && isPathAtOrInside(boundaryRoot, bundledDir))
    return {
      boundaryLabel: "bundled plugin directory",
      rejectHardlinks: false,
    };
  return {
    boundaryLabel: "plugin root",
    rejectHardlinks: shouldRejectHardlinkedPluginFiles({
      origin: "global",
      rootDir: boundaryRoot,
    }),
  };
}
/** Load and cache a facade module after verifying it is inside its declared boundary root. */
function loadFacadeModuleAtLocationSync(params) {
  const location = params.location;
  const cached = loadedFacadeModules.get(location.modulePath);
  if (cached) return cached;
  const opened = openRootFileSync({
    absolutePath: location.modulePath,
    rootPath: location.boundaryRoot,
    ...resolveFacadeBoundaryOpenParams(location.boundaryRoot),
  });
  if (!opened.ok)
    throw new Error(`Unable to open bundled plugin public surface ${location.modulePath}`, {
      cause: opened.error,
    });
  fs.closeSync(opened.fd);
  const sentinel = {};
  loadedFacadeModules.set(location.modulePath, sentinel);
  let loaded;
  try {
    loaded =
      params.loadModule?.(location.modulePath) ??
      getModuleLoader(location.modulePath)(location.modulePath);
    Object.assign(sentinel, loaded);
    loadedFacadePluginIds.add(
      typeof params.trackedPluginId === "function"
        ? params.trackedPluginId()
        : params.trackedPluginId,
    );
  } catch (err) {
    loadedFacadeModules.delete(location.modulePath);
    throw err;
  }
  return sentinel;
}
/** Resolve and synchronously load a bundled plugin public surface by plugin dir and artifact name. */
function loadBundledPluginPublicSurfaceModuleSync(params) {
  const location = resolveFacadeModuleLocation(params);
  if (!location)
    throw new Error(
      `Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`,
    );
  return loadFacadeModuleAtLocationSync({
    location,
    trackedPluginId: params.trackedPluginId ?? params.dirName,
  });
}
/** List plugin ids whose public facades have been loaded in this process. */
function listImportedBundledPluginFacadeIds() {
  return [...loadedFacadePluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export {
  loadFacadeModuleAtLocationSync as i,
  listImportedBundledPluginFacadeIds as n,
  loadBundledPluginPublicSurfaceModuleSync as r,
  createLazyFacadeObjectValue as t,
};
