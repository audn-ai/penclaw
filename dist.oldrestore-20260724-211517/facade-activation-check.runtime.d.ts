import {
  n as normalizePluginsConfig,
  t as createPluginActivationSource,
} from "./config-state-B2OzQJTq.js";
import { t as PluginManifestRecord } from "./manifest-registry-CHEq75Tu.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/facade-activation-check.runtime.d.ts
/** Minimal manifest shape needed to decide whether a bundled facade may load. */
type FacadePluginManifestLike = Pick<
  PluginManifestRecord,
  "id" | "origin" | "enabledByDefault" | "enabledByDefaultOnPlatforms" | "rootDir" | "channels"
>;
type FacadeModuleLocation = {
  modulePath: string;
  boundaryRoot: string;
};
/** Resolves the concrete plugin module location recorded in the manifest registry. */
declare function resolveRegistryPluginModuleLocation(params: {
  dirName: string;
  artifactBasename: string;
  resolutionKey: string;
  env?: NodeJS.ProcessEnv;
}): FacadeModuleLocation | null;
/** Resolves the stable plugin id used for telemetry and error reporting. */
declare function resolveTrackedFacadePluginId(params: {
  dirName: string;
  artifactBasename: string;
  location: FacadeModuleLocation | null;
  sourceExtensionsRoot: string;
  resolutionKey: string;
  env?: NodeJS.ProcessEnv;
}): string;
/** Evaluates whether a bundled plugin's api/runtime-api facade is currently enabled. */
declare function resolveBundledPluginPublicSurfaceAccess(params: {
  dirName: string;
  artifactBasename: string;
  location: FacadeModuleLocation | null;
  sourceExtensionsRoot: string;
  resolutionKey: string;
  env?: NodeJS.ProcessEnv;
}): {
  allowed: boolean;
  pluginId?: string;
  reason?: string;
};
/** Applies normalized config and default enablement rules to one bundled manifest. */
declare function evaluateBundledPluginPublicSurfaceAccess(params: {
  params: {
    dirName: string;
    artifactBasename: string;
  };
  manifestRecord: FacadePluginManifestLike;
  config: OpenClawConfig;
  normalizedPluginsConfig: ReturnType<typeof normalizePluginsConfig>;
  activationSource: ReturnType<typeof createPluginActivationSource>;
  autoEnabledReasons: Record<string, string[]>;
}): {
  allowed: boolean;
  pluginId?: string;
  reason?: string;
};
/** Throws the public error used when a disabled bundled plugin facade is imported. */
declare function throwForBundledPluginPublicSurfaceAccess(params: {
  access: {
    allowed: boolean;
    pluginId?: string;
    reason?: string;
  };
  request: {
    dirName: string;
    artifactBasename: string;
  };
}): never;
/** Resolves bundled facade access and throws unless the facade is allowed to load. */
declare function resolveActivatedBundledPluginPublicSurfaceAccessOrThrow(params: {
  dirName: string;
  artifactBasename: string;
  location: FacadeModuleLocation | null;
  sourceExtensionsRoot: string;
  resolutionKey: string;
  env?: NodeJS.ProcessEnv;
}): {
  allowed: boolean;
  pluginId?: string;
  reason?: string;
};
//#endregion
export {
  FacadePluginManifestLike,
  evaluateBundledPluginPublicSurfaceAccess,
  resolveActivatedBundledPluginPublicSurfaceAccessOrThrow,
  resolveBundledPluginPublicSurfaceAccess,
  resolveRegistryPluginModuleLocation,
  resolveTrackedFacadePluginId,
  throwForBundledPluginPublicSurfaceAccess,
};
