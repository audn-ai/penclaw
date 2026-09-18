//#region src/plugins/sdk-alias.d.ts
type PluginSdkResolutionPreference = "auto" | "dist" | "src";
type LoaderModuleResolveParams = {
  modulePath?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
  devSourceRoot?: string | null;
  pluginSdkResolution?: PluginSdkResolutionPreference;
};
type PluginRuntimeModuleResolution = {
  modulePath?: string;
  packageRoot: string | null;
  candidates: string[];
  resolvedPath: string | null;
  error?: string;
};
type WorkspacePackageAliasEntry = {
  packageName: string;
  packageDir: string;
  subpath: string;
  srcFile: string;
  distFile: string;
};
declare function resolveLoaderPackageRoot(
  params: LoaderModuleResolveParams & {
    modulePath: string;
  },
): string | null;
declare function listWorkspacePackageExportAliasEntries(params: {
  packageRoot: string;
  packageName: string;
  packageDir: string;
}): WorkspacePackageAliasEntry[];
declare function buildPluginLoaderAliasMap(
  modulePath: string,
  argv1?: string | undefined,
  moduleUrl?: string,
  pluginSdkResolution?: PluginSdkResolutionPreference,
  devSourceRoot?: string | null,
): Record<string, string>;
declare function resolvePluginRuntimeModulePathWithDiagnostics(
  params?: LoaderModuleResolveParams,
): PluginRuntimeModuleResolution;
declare function buildPluginLoaderJitiOptions(
  aliasMap: Record<string, string>,
  params?: LoaderModuleResolveParams,
): {
  alias?: Record<string, string> | undefined;
  interopDefault: boolean;
  fsCache: string | false;
  tryNative: boolean;
  nativeModules: string[];
  extensions: string[];
};
declare function shouldPreferNativeModuleLoad(modulePath: string): boolean;
declare function resolvePluginLoaderTryNative(
  modulePath: string,
  options?: {
    preferBuiltDist?: boolean;
  },
): boolean;
declare function createPluginLoaderModuleCacheKey(params: {
  tryNative: boolean;
  aliasMap: Record<string, string>;
}): string;
declare function resolvePluginLoaderModuleConfig(params: {
  modulePath: string;
  argv1?: string;
  moduleUrl: string;
  devSourceRoot?: string | null;
  preferBuiltDist?: boolean;
  pluginSdkResolution?: PluginSdkResolutionPreference;
}): {
  tryNative: boolean;
  aliasMap: Record<string, string>;
  cacheKey: string;
};
//#endregion
export {
  createPluginLoaderModuleCacheKey as a,
  resolvePluginLoaderModuleConfig as c,
  shouldPreferNativeModuleLoad as d,
  buildPluginLoaderJitiOptions as i,
  resolvePluginLoaderTryNative as l,
  PluginSdkResolutionPreference as n,
  listWorkspacePackageExportAliasEntries as o,
  buildPluginLoaderAliasMap as r,
  resolveLoaderPackageRoot as s,
  PluginRuntimeModuleResolution as t,
  resolvePluginRuntimeModulePathWithDiagnostics as u,
};
