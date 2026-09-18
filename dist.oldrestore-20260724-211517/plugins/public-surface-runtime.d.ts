//#region src/plugins/public-surface-runtime.d.ts
declare const PUBLIC_SURFACE_SOURCE_EXTENSIONS: readonly [
  ".ts",
  ".mts",
  ".js",
  ".mjs",
  ".cts",
  ".cjs",
];
/** Normalizes a bundled public artifact subpath and rejects traversal/absolute paths. */
declare function normalizeBundledPluginArtifactSubpath(artifactBasename: string): string;
/** Resolves a source-tree public surface artifact path for bundled plugin development. */
declare function resolveBundledPluginSourcePublicSurfacePath(params: {
  sourceRoot: string;
  dirName: string;
  artifactBasename: string;
}): string | null;
/** Resolves a public surface artifact within one installed plugin root. */
declare function resolvePluginRootPublicSurfacePath(params: {
  pluginRoot: string;
  artifactBasename: string;
}): string | null;
/** Resolves a bundled plugin public surface artifact across source, dist, and package layouts. */
declare function resolveBundledPluginPublicSurfacePath(params: {
  rootDir: string;
  dirName: string;
  artifactBasename: string;
  env?: NodeJS.ProcessEnv;
  bundledPluginsDir?: string;
  bundledPluginsDirMode?: "explicit" | "auto";
}): string | null;
//#endregion
export {
  PUBLIC_SURFACE_SOURCE_EXTENSIONS,
  normalizeBundledPluginArtifactSubpath,
  resolveBundledPluginPublicSurfacePath,
  resolveBundledPluginSourcePublicSurfacePath,
  resolvePluginRootPublicSurfacePath,
};
