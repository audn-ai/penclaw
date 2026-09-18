import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { t as PluginLruCache } from "./plugin-cache-primitives-BaxqicKH.js";
import {
  i as listWorkspacePackageExportAliasEntries,
  n as buildPluginLoaderJitiOptions,
  o as resolvePluginLoaderModuleConfig,
  r as createPluginLoaderModuleCacheKey,
  t as buildPluginLoaderAliasMap,
} from "./sdk-alias-huj8Ygt2.js";
//#region src/shared/import-specifier.ts
/**
 * On Windows, Node's ESM loader requires absolute paths to be expressed as
 * file:// URLs. Raw drive-letter paths like C:\... are parsed as URL schemes.
 */
function toSafeImportPath(specifier) {
  if (process.platform !== "win32") return specifier;
  if (specifier.startsWith("file://")) return specifier;
  if (path.win32.isAbsolute(specifier)) return pathToFileURL(specifier, { windows: true }).href;
  return specifier;
}
//#endregion
//#region src/plugins/native-module-require.ts
const nodeRequire = createRequire(import.meta.url);
const moduleWithResolver$1 = Module;
/** True for file extensions Node can load through the native JS module loader. */
function isJavaScriptModulePath(modulePath) {
  return [".js", ".mjs", ".cjs"].includes(path.extname(modulePath).toLowerCase());
}
function isMissingTargetModuleError(error, modulePath) {
  if (error.code !== "MODULE_NOT_FOUND" || typeof error.message !== "string") return false;
  const firstLine = error.message.split("\n", 1)[0] ?? "";
  return firstLine.includes(`'${modulePath}'`) || firstLine.includes(`"${modulePath}"`);
}
function isSourceTransformFallbackError(error, modulePath) {
  if (!error || typeof error !== "object") return false;
  const candidate = error;
  const code = candidate.code;
  return (
    code === "ERR_REQUIRE_ESM" ||
    code === "ERR_REQUIRE_ASYNC_MODULE" ||
    isMissingTargetModuleError(candidate, modulePath)
  );
}
/** Attempts native require before falling back to source transform paths. */
function tryNativeRequireJavaScriptModule(modulePath, options = {}) {
  if (process.platform === "win32" && options.allowWindows !== true) return { ok: false };
  if (!isJavaScriptModulePath(modulePath)) return { ok: false };
  try {
    return {
      ok: true,
      moduleExport: requireWithOptionalAliases(modulePath, options.aliasMap),
    };
  } catch (error) {
    const code = error && typeof error === "object" ? error.code : void 0;
    if (
      isSourceTransformFallbackError(error, modulePath) ||
      options.fallbackOnNativeError ||
      (options.fallbackOnMissingDependency === true &&
        (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND"))
    )
      return { ok: false };
    throw error;
  }
}
/** Clears a native-loaded module and dependency subtree under the plugin dependency root. */
function clearNativeRequireJavaScriptModuleCache(modulePath, options = {}) {
  if (!isJavaScriptModulePath(modulePath)) return;
  try {
    const resolved = nodeRequire.resolve(modulePath);
    clearRequireCacheSubtree(
      resolved,
      resolveRequireCachePath(options.dependencyRoot ?? path.dirname(resolved)),
      /* @__PURE__ */ new Set(),
    );
  } catch {}
}
function resolveRequireCachePath(targetPath) {
  try {
    return fs.realpathSync.native(targetPath);
  } catch {
    return path.resolve(targetPath);
  }
}
function clearRequireCacheSubtree(resolvedPath, dependencyRoot, seen) {
  if (seen.has(resolvedPath)) return;
  seen.add(resolvedPath);
  const cached = nodeRequire.cache[resolvedPath];
  if (cached) {
    for (const child of cached.children)
      if (isPathInsideOrSame(dependencyRoot, child.id))
        clearRequireCacheSubtree(child.id, dependencyRoot, seen);
  }
  delete nodeRequire.cache[resolvedPath];
}
function isPathInsideOrSame(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
function requireWithOptionalAliases(modulePath, aliasMap) {
  return withNativeRequireAliases(aliasMap, () => nodeRequire(modulePath));
}
/** Runs a native require block with temporary CJS/ESM alias hooks and restores both afterward. */
function withNativeRequireAliases(aliasMap, run) {
  if (!aliasMap || Object.keys(aliasMap).length === 0 || !moduleWithResolver$1["_resolveFilename"])
    return run();
  const originalResolveFilename = moduleWithResolver$1["_resolveFilename"];
  const esmHooks = moduleWithResolver$1.registerHooks?.({
    resolve(specifier, context, nextResolve) {
      const aliasTarget = aliasMap[specifier];
      if (aliasTarget)
        return {
          shortCircuit: true,
          url: pathToFileURL(aliasTarget).href,
        };
      return nextResolve(specifier, context);
    },
  });
  moduleWithResolver$1["_resolveFilename"] = (request, parent, isMain, options) => {
    const aliasTarget = aliasMap[request];
    if (aliasTarget) return aliasTarget;
    return originalResolveFilename(request, parent, isMain, options);
  };
  try {
    return run();
  } finally {
    moduleWithResolver$1["_resolveFilename"] = originalResolveFilename;
    esmHooks?.deregister();
  }
}
//#endregion
//#region src/plugins/plugin-sdk-native-resolver.ts
/** Installs native Node resolution aliases so plugins can import the OpenClaw SDK in dev and tests. */
const moduleWithResolver = Module;
const nodeResolveFilenameProperty = "_resolveFilename";
const PLUGIN_SDK_PACKAGE_PREFIXES = ["openclaw/plugin-sdk", "@openclaw/plugin-sdk"];
const INTERNAL_CORE_PACKAGE_ALIASES = [
  {
    packageName: "@openclaw/markdown-core",
    packageDir: "markdown-core",
    subpaths: [
      ["", "index.ts"],
      ["code-spans", "code-spans.ts"],
      ["fences", "fences.ts"],
      ["frontmatter", "frontmatter.ts"],
      ["ir", "ir.ts"],
      ["render", "render.ts"],
      ["render-aware-chunking", "render-aware-chunking.ts"],
      ["tables", "tables.ts"],
      ["types", "types.ts"],
    ],
  },
  {
    packageName: "@openclaw/ai",
    packageDir: "ai",
    subpaths: [
      ["", "index.ts"],
      ["providers", "providers.ts"],
      ["diagnostics", path.join("utils", "diagnostics.ts")],
      ["event-stream", path.join("utils", "event-stream.ts")],
      ["types", "types.ts"],
      ["validation", "validation.ts"],
      ["internal/anthropic", path.join("internal", "anthropic.ts")],
      ["internal/openai", path.join("internal", "openai.ts")],
      ["internal/retry-after", path.join("internal", "retry-after.ts")],
      ["internal/runtime", path.join("internal", "runtime.ts")],
      ["internal/shared", path.join("internal", "shared.ts")],
    ],
  },
  {
    packageName: "@openclaw/media-core",
    packageDir: "media-core",
    subpaths: [
      ["", "index.ts"],
      ["base64", "base64.ts"],
      ["constants", "constants.ts"],
      ["content-length", "content-length.ts"],
      ["file-name", "file-name.ts"],
      ["inbound-path-policy", "inbound-path-policy.ts"],
      ["inline-image-data-url", "inline-image-data-url.ts"],
      ["media-source-url", "media-source-url.ts"],
      ["mime", "mime.ts"],
      ["read-byte-stream-with-limit", "read-byte-stream-with-limit.ts"],
    ],
  },
  {
    packageName: "@openclaw/llm-core",
    packageDir: "llm-core",
    subpaths: [
      ["", "index.ts"],
      ["diagnostics", path.join("utils", "diagnostics.ts")],
      ["event-stream", path.join("utils", "event-stream.ts")],
      ["types", "types.ts"],
      ["validation", "validation.ts"],
    ],
  },
];
const pluginSdkNativeAliases = /* @__PURE__ */ new Map();
let installed = false;
let previousResolveFilename;
function resolveLoaderModulePath(options) {
  return options.modulePath ?? fileURLToPath(options.moduleUrl ?? import.meta.url);
}
function isPluginSdkAliasSpecifier(specifier) {
  return PLUGIN_SDK_PACKAGE_PREFIXES.some(
    (prefix) => specifier === prefix || specifier.startsWith(`${prefix}/`),
  );
}
function isNativeLoadableSdkTarget(targetPath) {
  switch (path.extname(targetPath)) {
    case ".cjs":
    case ".js":
    case ".mjs":
      return true;
    default:
      return false;
  }
}
function normalizePathForBoundary(candidate) {
  try {
    return fs.realpathSync(candidate);
  } catch {
    return path.resolve(candidate);
  }
}
function findNearestPackageRoot(modulePath) {
  let cursor = path.dirname(path.resolve(modulePath));
  for (let i = 0; i < 12; i += 1) {
    if (fs.existsSync(path.join(cursor, "package.json"))) return cursor;
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return path.dirname(path.resolve(modulePath));
}
function findBundledPluginRoot(modulePath) {
  const resolvedModulePath = normalizePathForBoundary(modulePath);
  const packageRoot = normalizePathForBoundary(resolveLoaderPackageRootFromModulePath(modulePath));
  for (const relativeRoot of ["extensions", "dist/extensions", "dist-runtime/extensions"]) {
    const bundledRoot = path.join(packageRoot, relativeRoot);
    const relative = path.relative(bundledRoot, resolvedModulePath);
    if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) continue;
    const [pluginId] = relative.split(path.sep);
    if (pluginId) return path.join(bundledRoot, pluginId);
  }
}
function resolveLoaderPackageRootFromModulePath(modulePath) {
  let cursor = path.dirname(path.resolve(modulePath));
  for (let i = 0; i < 12; i += 1) {
    const packageJsonPath = path.join(cursor, "package.json");
    if (fs.existsSync(packageJsonPath))
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        if (
          packageJson.name === "openclaw" ||
          (typeof packageJson.bin === "object" &&
            packageJson.bin !== null &&
            typeof packageJson.bin.openclaw === "string")
        )
          return cursor;
      } catch {}
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return findNearestPackageRoot(modulePath);
}
function resolveAllowedParentRoot(modulePath) {
  return findBundledPluginRoot(modulePath) ?? findNearestPackageRoot(modulePath);
}
function resolveAllowedParentRoots(options) {
  const roots = /* @__PURE__ */ new Set();
  if (options.pluginModulePath)
    roots.add(normalizePathForBoundary(resolveAllowedParentRoot(options.pluginModulePath)));
  for (const root of options.allowedParentRoots ?? []) roots.add(normalizePathForBoundary(root));
  return [...roots];
}
function isWithinRoot(candidate, root) {
  const relative = path.relative(root, normalizePathForBoundary(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
function resolveAliasTargetForParent(request, parent) {
  return resolveAliasTargetForParentPath(request, parent?.filename);
}
function resolveAliasTargetForParentUrl(request, parentUrl) {
  if (!parentUrl?.startsWith("file:")) return;
  try {
    return resolveAliasTargetForParentPath(request, fileURLToPath(parentUrl));
  } catch {
    return;
  }
}
function resolveAliasTargetForParentPath(request, parentFilename) {
  const entries = pluginSdkNativeAliases.get(request);
  if (!entries || !parentFilename) return;
  return entries.find((entry) => isWithinRoot(parentFilename, entry.parentRoot))?.target;
}
function listPluginSdkNativeAliases(options) {
  const modulePath = options.pluginModulePath ?? resolveLoaderModulePath(options);
  return Object.entries(
    buildPluginLoaderAliasMap(
      modulePath,
      options.argv1 ?? process.argv[1],
      options.moduleUrl,
      "dist",
      options.devSourceRoot,
    ),
  )
    .filter(([specifier]) => isPluginSdkAliasSpecifier(specifier))
    .filter(([, target]) => isNativeLoadableSdkTarget(target))
    .flatMap(([specifier, target]) => {
      if (specifier.endsWith(".js")) return [[specifier, target]];
      return [
        [specifier, target],
        [`${specifier}.js`, target],
      ];
    });
}
function listInternalCorePackageNativeAliases(options) {
  const packageRoot = resolveLoaderPackageRootFromModulePath(resolveLoaderModulePath(options));
  const parentRoots = ["src", "scripts", "packages", "test"]
    .map((segment) => path.join(packageRoot, segment))
    .filter((candidate) => fs.existsSync(candidate))
    .map(normalizePathForBoundary);
  if (parentRoots.length === 0) return [];
  const aliases = [];
  const internalCorePackageAliases = [
    ...INTERNAL_CORE_PACKAGE_ALIASES,
    ...["normalization-core", "acp-core"].map((packageDir) => ({
      packageName: `@openclaw/${packageDir}`,
      packageDir,
      subpaths: listWorkspacePackageExportAliasEntries({
        packageRoot,
        packageName: `@openclaw/${packageDir}`,
        packageDir,
      }).map((entry) => [entry.subpath, entry.srcFile]),
    })),
  ];
  for (const entry of internalCorePackageAliases)
    for (const [subpath, srcFile] of entry.subpaths) {
      const request = subpath ? `${entry.packageName}/${subpath}` : entry.packageName;
      const target = path.join(packageRoot, "packages", entry.packageDir, "src", srcFile);
      if (fs.existsSync(target))
        aliases.push({
          request,
          target,
          parentRoots,
        });
    }
  return aliases;
}
function installResolver() {
  if (installed || !moduleWithResolver[nodeResolveFilenameProperty]) return;
  previousResolveFilename = moduleWithResolver[nodeResolveFilenameProperty];
  moduleWithResolver[nodeResolveFilenameProperty] = (request, parent, isMain, options) => {
    const aliasTarget = resolveAliasTargetForParent(request, parent);
    if (aliasTarget) return aliasTarget;
    return previousResolveFilename?.(request, parent, isMain, options) ?? request;
  };
  moduleWithResolver.registerHooks?.({
    resolve(specifier, context, nextResolve) {
      const aliasTarget = resolveAliasTargetForParentUrl(specifier, context.parentURL);
      if (aliasTarget)
        return {
          shortCircuit: true,
          url: pathToFileURL(aliasTarget).href,
        };
      return nextResolve(specifier, context);
    },
  });
  installed = true;
}
function registerNativeAlias(params) {
  const entries = pluginSdkNativeAliases.get(params.request) ?? [];
  for (const parentRoot of params.parentRoots) {
    const existingIndex = entries.findIndex((entry) => entry.parentRoot === parentRoot);
    if (existingIndex !== -1) {
      entries[existingIndex] = {
        parentRoot,
        target: params.target,
      };
      continue;
    }
    entries.push({
      parentRoot,
      target: params.target,
    });
  }
  if (entries.length > 0) pluginSdkNativeAliases.set(params.request, entries);
}
function clearNativeAliasesForParentRoots(parentRoots) {
  if (parentRoots.length === 0) return;
  const parentRootSet = new Set(parentRoots);
  for (const [request, entries] of pluginSdkNativeAliases) {
    const nextEntries = entries.filter((entry) => !parentRootSet.has(entry.parentRoot));
    if (nextEntries.length === 0) pluginSdkNativeAliases.delete(request);
    else pluginSdkNativeAliases.set(request, nextEntries);
  }
}
function installOpenClawPluginSdkNativeResolver(options = {}) {
  const parentRoots = resolveAllowedParentRoots(options);
  clearNativeAliasesForParentRoots(parentRoots);
  for (const [specifier, target] of listPluginSdkNativeAliases(options))
    registerNativeAlias({
      request: specifier,
      target,
      parentRoots,
    });
  for (const alias of listInternalCorePackageNativeAliases(options)) registerNativeAlias(alias);
  installResolver();
  return [...pluginSdkNativeAliases.keys()].toSorted();
}
function installOpenClawInternalCorePackageNativeResolver(options = {}) {
  for (const alias of listInternalCorePackageNativeAliases(options)) registerNativeAlias(alias);
  installResolver();
  return [...pluginSdkNativeAliases.keys()].toSorted();
}
//#endregion
//#region src/plugins/plugin-module-loader-cache.ts
/** Caches plugin module loaders and native-load stats for runtime/source module imports. */
const DEFAULT_PLUGIN_MODULE_LOADER_CACHE_ENTRIES = 128;
const MAX_TRACKED_SOURCE_TRANSFORM_TARGETS = 24;
const requireForJiti = createRequire(import.meta.url);
let createJitiLoaderFactory;
const pluginModuleLoaderStats = {
  calls: 0,
  nativeHits: 0,
  nativeMisses: 0,
  sourceTransformForced: 0,
  sourceTransformFallbacks: 0,
  sourceTransformTargets: /* @__PURE__ */ new Map(),
};
function recordSourceTransformTarget(target) {
  const current = pluginModuleLoaderStats.sourceTransformTargets.get(target) ?? 0;
  pluginModuleLoaderStats.sourceTransformTargets.set(target, current + 1);
  if (pluginModuleLoaderStats.sourceTransformTargets.size <= MAX_TRACKED_SOURCE_TRANSFORM_TARGETS)
    return;
  let leastUsedTarget;
  let leastUsedCount = Number.POSITIVE_INFINITY;
  for (const [candidate, count] of pluginModuleLoaderStats.sourceTransformTargets)
    if (count < leastUsedCount) {
      leastUsedTarget = candidate;
      leastUsedCount = count;
    }
  if (leastUsedTarget) pluginModuleLoaderStats.sourceTransformTargets.delete(leastUsedTarget);
}
/** Returns process-local plugin module loader stats for diagnostics and tests. */
function getPluginModuleLoaderStats() {
  return {
    calls: pluginModuleLoaderStats.calls,
    nativeHits: pluginModuleLoaderStats.nativeHits,
    nativeMisses: pluginModuleLoaderStats.nativeMisses,
    sourceTransformForced: pluginModuleLoaderStats.sourceTransformForced,
    sourceTransformFallbacks: pluginModuleLoaderStats.sourceTransformFallbacks,
    topSourceTransformTargets: [...pluginModuleLoaderStats.sourceTransformTargets]
      .toSorted((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 8)
      .map(([target, count]) => ({
        target,
        count,
      })),
  };
}
function loadCreateJitiLoaderFactory() {
  if (createJitiLoaderFactory) return createJitiLoaderFactory;
  const loaded = requireForJiti("jiti");
  if (typeof loaded.createJiti !== "function")
    throw new Error("jiti module did not export createJiti");
  createJitiLoaderFactory = loaded.createJiti;
  return createJitiLoaderFactory;
}
function createPluginModuleLoaderCache(maxEntries = DEFAULT_PLUGIN_MODULE_LOADER_CACHE_ENTRIES) {
  return new PluginLruCache(maxEntries);
}
function toSourceTransformImportPath(specifier) {
  if (process.platform === "win32" && path.isAbsolute(specifier))
    return pathToFileURL(specifier).href;
  return toSafeImportPath(specifier);
}
function resolveDefaultPluginModuleLoaderConfig(params) {
  return resolvePluginLoaderModuleConfig({
    modulePath: params.modulePath,
    argv1: params.argvEntry ?? process.argv[1],
    moduleUrl: params.importerUrl,
    devSourceRoot: params.devSourceRoot,
    ...(params.preferBuiltDist ? { preferBuiltDist: true } : {}),
    ...(params.pluginSdkResolution ? { pluginSdkResolution: params.pluginSdkResolution } : {}),
  });
}
function resolvePluginModuleLoaderCacheEntry(params) {
  const loaderFilename = toSafeImportPath(params.loaderFilename ?? params.modulePath);
  const hasAliasOverride = Boolean(params.aliasMap);
  const hasTryNativeOverride = typeof params.tryNative === "boolean";
  const defaultConfig =
    hasAliasOverride || hasTryNativeOverride
      ? resolveDefaultPluginModuleLoaderConfig(params)
      : null;
  const canReuseDefaultCacheKey =
    defaultConfig !== null &&
    (!hasAliasOverride || params.aliasMap === defaultConfig.aliasMap) &&
    (!hasTryNativeOverride || params.tryNative === defaultConfig.tryNative);
  const resolved = defaultConfig
    ? {
        tryNative: params.tryNative ?? defaultConfig.tryNative,
        aliasMap: params.aliasMap ?? defaultConfig.aliasMap,
        cacheKey: canReuseDefaultCacheKey ? defaultConfig.cacheKey : void 0,
      }
    : resolveDefaultPluginModuleLoaderConfig(params);
  const { tryNative, aliasMap } = resolved;
  const moduleConfigCacheKey =
    resolved.cacheKey ??
    createPluginLoaderModuleCacheKey({
      tryNative,
      aliasMap,
    });
  const transformOpenClawDependencies = params.transformOpenClawDependencies ?? tryNative;
  const cacheKey = `${moduleConfigCacheKey}\0transform-openclaw=${transformOpenClawDependencies ? "1" : "0"}`;
  return {
    loaderFilename,
    aliasMap,
    tryNative,
    transformOpenClawDependencies,
    cacheKey,
    scopedCacheKey: `${loaderFilename}::${params.sharedCacheScopeKey ?? (params.cacheScopeKey ? `${params.cacheScopeKey}::${cacheKey}` : cacheKey)}`,
  };
}
function createLazySourceTransformLoader(params) {
  let loadWithSourceTransform;
  return () => {
    if (loadWithSourceTransform) return loadWithSourceTransform;
    const jitiOptions = buildPluginLoaderJitiOptions(params.aliasMap, {
      modulePath: params.loaderFilename,
    });
    const jitiLoader = (params.createLoader ?? loadCreateJitiLoaderFactory())(
      params.loaderFilename,
      {
        ...jitiOptions,
        nativeModules: params.transformOpenClawDependencies
          ? jitiOptions.nativeModules.filter((moduleName) => moduleName !== "openclaw")
          : jitiOptions.nativeModules,
        tryNative: false,
      },
    );
    loadWithSourceTransform = (target) => jitiLoader(toSourceTransformImportPath(target));
    return loadWithSourceTransform;
  };
}
function createPluginModuleLoader(params) {
  const getLoadWithSourceTransform = createLazySourceTransformLoader({ ...params });
  const loadedTargetExports = /* @__PURE__ */ new Map();
  const loadCachedTarget = (target, load) => {
    if (loadedTargetExports.has(target)) return loadedTargetExports.get(target);
    const loaded = load();
    loadedTargetExports.set(target, loaded);
    return loaded;
  };
  if (!params.tryNative)
    return (target) =>
      loadCachedTarget(target, () => {
        pluginModuleLoaderStats.calls += 1;
        pluginModuleLoaderStats.sourceTransformForced += 1;
        recordSourceTransformTarget(target);
        return getLoadWithSourceTransform()(target);
      });
  return (target) =>
    loadCachedTarget(target, () => {
      pluginModuleLoaderStats.calls += 1;
      const native = tryNativeRequireJavaScriptModule(target, {
        allowWindows: true,
        aliasMap: params.aliasMap,
        fallbackOnMissingDependency: true,
        fallbackOnNativeError: true,
      });
      if (native.ok) {
        pluginModuleLoaderStats.nativeHits += 1;
        return native.moduleExport;
      }
      pluginModuleLoaderStats.nativeMisses += 1;
      pluginModuleLoaderStats.sourceTransformFallbacks += 1;
      recordSourceTransformTarget(target);
      return getLoadWithSourceTransform()(target);
    });
}
function getCachedPluginModuleLoader(params) {
  installOpenClawInternalCorePackageNativeResolver({ moduleUrl: params.importerUrl });
  const cacheEntry = resolvePluginModuleLoaderCacheEntry(params);
  const cached = params.cache.get(cacheEntry.scopedCacheKey);
  if (cached) return cached;
  const loader = createPluginModuleLoader({
    loaderFilename: cacheEntry.loaderFilename,
    aliasMap: cacheEntry.aliasMap,
    tryNative: cacheEntry.tryNative,
    transformOpenClawDependencies: cacheEntry.transformOpenClawDependencies,
    ...(params.createLoader ? { createLoader: params.createLoader } : {}),
  });
  params.cache.set(cacheEntry.scopedCacheKey, loader);
  return loader;
}
function getCachedPluginSourceModuleLoader(params) {
  return getCachedPluginModuleLoader({
    ...params,
    tryNative: false,
  });
}
//#endregion
export {
  installOpenClawInternalCorePackageNativeResolver as a,
  isJavaScriptModulePath as c,
  getPluginModuleLoaderStats as i,
  tryNativeRequireJavaScriptModule as l,
  getCachedPluginModuleLoader as n,
  installOpenClawPluginSdkNativeResolver as o,
  getCachedPluginSourceModuleLoader as r,
  clearNativeRequireJavaScriptModuleCache as s,
  createPluginModuleLoaderCache as t,
  toSafeImportPath as u,
};
