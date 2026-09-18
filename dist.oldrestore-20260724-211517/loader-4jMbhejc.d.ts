import {
  i as PluginDiscoveryResult,
  n as PluginManifestRegistry,
} from "./manifest-registry-CHEq75Tu.js";
import { n as PluginRegistry, r as PluginRegistryParams } from "./registry-types-zrUDhE8t.js";
import { n as PluginSdkResolutionPreference } from "./sdk-alias-CQ2oE3sj.js";
import { n as GatewayRequestHandler } from "./types-Dz3ohwUV.js";
import { Si as PluginLogger, sr as CreatePluginRuntimeOptions } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig, m as PluginInstallRecord } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugins/loader.d.ts
type PluginLoadOptions = {
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  autoEnabledReasons?: Readonly<Record<string, string[]>>;
  workspaceDir?: string;
  installRecords?: Record<string, PluginInstallRecord>;
  env?: NodeJS.ProcessEnv;
  resolveRawConfigEnvVars?: boolean;
  logger?: PluginLogger;
  coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
  coreGatewayMethodNames?: readonly string[];
  hostServices?: PluginRegistryParams["hostServices"];
  runtimeOptions?: CreatePluginRuntimeOptions;
  startupTrace?: {
    detail: (name: string, metrics: ReadonlyArray<readonly [string, number | string]>) => void;
  };
  pluginSdkResolution?: PluginSdkResolutionPreference;
  cache?: boolean;
  mode?: "full" | "validate";
  onlyPluginIds?: string[];
  includeSetupOnlyChannelPlugins?: boolean;
  forceSetupOnlyChannelPlugins?: boolean;
  requireSetupEntryForSetupOnlyChannelPlugins?: boolean;
  /**
   * Prefer `setupEntry` for configured channel plugins that explicitly opt in
   * via package metadata because their setup entry covers the pre-listen startup surface.
   */
  preferSetupRuntimeForChannelPlugins?: boolean;
  /**
   * Load channel runtime entries even when setup entries are available. Plugin CLI
   * registration needs the runtime entry because setup entries only own setup state.
   */
  forceFullRuntimeForChannelPlugins?: boolean;
  /**
   * For hot startup paths, prefer bundled plugin JS artifacts over source TS
   * entrypoints when both are present in a source checkout.
   */
  preferBuiltPluginArtifacts?: boolean;
  toolDiscovery?: boolean;
  activate?: boolean;
  loadModules?: boolean;
  throwOnLoadError?: boolean;
  manifestRegistry?: PluginManifestRegistry;
  discovery?: PluginDiscoveryResult;
};
declare function clearActivatedPluginRuntimeState(): void;
declare function clearPluginRegistryLoadCache(): void;
declare function resolveRuntimePluginRegistry(
  options?: PluginLoadOptions,
): PluginRegistry | undefined;
declare function getRuntimePluginRegistryForLoadOptions(
  options?: PluginLoadOptions,
): PluginRegistry | undefined;
declare function resolvePluginRegistryLoadCacheKey(options?: PluginLoadOptions): string;
declare function isPluginRegistryLoadInFlight(options?: PluginLoadOptions): boolean;
declare function resolveCompatibleRuntimePluginRegistry(
  options?: PluginLoadOptions,
): PluginRegistry | undefined;
declare function loadOpenClawPlugins(options?: PluginLoadOptions): PluginRegistry;
declare function loadOpenClawPluginCliRegistry(
  options?: PluginLoadOptions,
): Promise<PluginRegistry>;
//#endregion
export {
  isPluginRegistryLoadInFlight as a,
  resolveCompatibleRuntimePluginRegistry as c,
  getRuntimePluginRegistryForLoadOptions as i,
  resolvePluginRegistryLoadCacheKey as l,
  clearActivatedPluginRuntimeState as n,
  loadOpenClawPluginCliRegistry as o,
  clearPluginRegistryLoadCache as r,
  loadOpenClawPlugins as s,
  PluginLoadOptions as t,
  resolveRuntimePluginRegistry as u,
};
