import fs from "node:fs";
import { createRequire } from "node:module";
import "./boundary-file-read-CBe_wA_B.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import {
  n as getCachedPluginModuleLoader,
  t as createPluginModuleLoaderCache,
} from "./plugin-module-loader-cache-CDpLvLFE.js";
import {
  a as resolvePluginRootPublicSurfacePath,
  r as resolveBundledPluginPublicSurfacePath,
} from "./public-surface-runtime-CdELeJNX.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import {
  a as resolveLoaderPackageRoot,
  s as resolvePluginLoaderTryNative,
} from "./sdk-alias-huj8Ygt2.js";
//#region src/plugins/public-surface-loader.ts
const OPENCLAW_PACKAGE_ROOT =
  resolveLoaderPackageRoot({
    modulePath: fileURLToPath(import.meta.url),
    moduleUrl: import.meta.url,
  }) ?? fileURLToPath(new URL("../..", import.meta.url));
const publicSurfaceModuleCache = /* @__PURE__ */ new Map();
const sourceArtifactRequire = createRequire(import.meta.url);
const publicSurfaceLocationCache = /* @__PURE__ */ new Map();
const moduleLoaders = createPluginModuleLoaderCache();
function isSourceArtifactPath(modulePath) {
  switch (path.extname(modulePath).toLowerCase()) {
    case ".ts":
    case ".tsx":
    case ".mts":
    case ".cts":
    case ".mtsx":
    case ".ctsx":
      return true;
    default:
      return false;
  }
}
function canUseSourceArtifactRequire(params) {
  return (
    !params.tryNative &&
    isSourceArtifactPath(params.modulePath) &&
    typeof sourceArtifactRequire.extensions?.[".ts"] === "function"
  );
}
function createResolutionKey(params) {
  const bundledPluginsDir = resolveBundledPluginsDir();
  return `${params.dirName}::${params.artifactBasename}::${bundledPluginsDir ? path.resolve(bundledPluginsDir) : "<default>"}`;
}
function resolvePublicSurfaceLocationUncached(params) {
  const bundledPluginsDir = resolveBundledPluginsDir();
  const modulePath = resolveBundledPluginPublicSurfacePath({
    rootDir: OPENCLAW_PACKAGE_ROOT,
    ...(bundledPluginsDir
      ? {
          bundledPluginsDir,
          bundledPluginsDirMode: "explicit",
        }
      : {}),
    dirName: params.dirName,
    artifactBasename: params.artifactBasename,
  });
  if (!modulePath) return null;
  return {
    modulePath,
    boundaryRoot:
      bundledPluginsDir && modulePath.startsWith(path.resolve(bundledPluginsDir) + path.sep)
        ? path.resolve(bundledPluginsDir)
        : OPENCLAW_PACKAGE_ROOT,
  };
}
function resolvePublicSurfaceLocation(params) {
  const key = createResolutionKey(params);
  const cached = publicSurfaceLocationCache.get(key);
  if (cached) return cached;
  const resolved = resolvePublicSurfaceLocationUncached(params);
  if (resolved) publicSurfaceLocationCache.set(key, resolved);
  return resolved;
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
function loadPublicSurfaceModule(modulePath) {
  if (
    canUseSourceArtifactRequire({
      modulePath,
      tryNative: resolvePluginLoaderTryNative(modulePath, { preferBuiltDist: true }),
    })
  )
    return sourceArtifactRequire(modulePath);
  return getModuleLoader(modulePath)(modulePath);
}
function loadValidatedPublicSurfaceModule(params) {
  const cached = publicSurfaceModuleCache.get(params.modulePath);
  if (cached) return cached;
  const opened = openRootFileSync({
    absolutePath: params.modulePath,
    rootPath: params.boundaryRoot,
    boundaryLabel: params.boundaryLabel,
    rejectHardlinks: false,
  });
  if (!opened.ok) throw new Error(`Unable to open ${params.surfaceLabel}`, { cause: opened.error });
  const validatedPath = opened.path;
  const validatedStat = opened.stat;
  fs.closeSync(opened.fd);
  if (!sameFileIdentity(validatedStat, fs.statSync(validatedPath)))
    throw new Error(`${params.surfaceLabel} changed after validation`);
  const sentinel = {};
  publicSurfaceModuleCache.set(params.modulePath, sentinel);
  publicSurfaceModuleCache.set(validatedPath, sentinel);
  try {
    const loaded = loadPublicSurfaceModule(validatedPath);
    Object.assign(sentinel, loaded);
    return sentinel;
  } catch (error) {
    publicSurfaceModuleCache.delete(params.modulePath);
    publicSurfaceModuleCache.delete(validatedPath);
    throw error;
  }
}
function loadBundledPluginPublicArtifactModuleSync(params) {
  const location = resolvePublicSurfaceLocation(params);
  if (!location)
    throw new Error(
      `Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`,
    );
  return loadValidatedPublicSurfaceModule({
    modulePath: location.modulePath,
    boundaryRoot: location.boundaryRoot,
    boundaryLabel:
      location.boundaryRoot === OPENCLAW_PACKAGE_ROOT ? "OpenClaw package root" : "plugin root",
    surfaceLabel: `bundled plugin public surface ${params.dirName}/${params.artifactBasename}`,
  });
}
function loadPluginPublicArtifactModuleSync(params) {
  const modulePath = resolvePluginRootPublicSurfacePath(params);
  if (!modulePath)
    throw new Error(
      `Unable to resolve plugin public surface ${params.pluginRoot}/${params.artifactBasename}`,
    );
  return loadValidatedPublicSurfaceModule({
    modulePath,
    boundaryRoot: path.resolve(params.pluginRoot),
    boundaryLabel: "plugin root",
    surfaceLabel: `plugin public surface ${params.artifactBasename}`,
  });
}
/** Loads the first resolvable bundled public artifact from an ordered candidate list. */
function loadBundledPluginPublicArtifactModuleFromCandidatesSync(params) {
  for (const artifactBasename of params.artifactCandidates)
    try {
      return loadBundledPluginPublicArtifactModuleSync({
        dirName: params.dirName,
        artifactBasename,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith("Unable to resolve bundled plugin public surface ")
      )
        continue;
      throw error;
    }
  return null;
}
//#endregion
export {
  loadBundledPluginPublicArtifactModuleSync as n,
  loadPluginPublicArtifactModuleSync as r,
  loadBundledPluginPublicArtifactModuleFromCandidatesSync as t,
};
