import { createJiti } from "jiti";
import { r as AnyAgentTool$1 } from "./common-CuQ9SS3Z.js";
import { n as ChannelOutboundAdapter } from "./outbound.types-Bu7WWq9f.js";
import {
  C as OpenClawPluginApi$1,
  O as OpenClawPluginCommandDefinition$1,
  it as PluginCommandContext$1,
} from "./types-Ga3mNO_F.js";
import { n as ChannelConfigSchema } from "./types.config-D1pSqbn8.js";
import { U as ChannelLegacyStateMigrationPlan } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";

//#region src/plugins/plugin-module-loader-cache.d.ts
type PluginModuleLoaderFactory = typeof createJiti;
//#endregion
//#region src/plugin-sdk/channel-entry-contract.types.d.ts
/** Legacy session helpers used while bundled channels migrate old session key formats. */
type BundledChannelLegacySessionSurface = {
  isLegacyGroupSessionKey?: (key: string) => boolean;
  canonicalizeLegacySessionKey?: (params: {
    key: string;
    agentId: string;
  }) => string | null | undefined;
};
/** Detects channel-owned state migrations needed before a bundled channel starts. */
type BundledChannelLegacyStateMigrationDetector = (params: {
  cfg: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  stateDir: string;
  oauthDir: string;
}) =>
  | ChannelLegacyStateMigrationPlan[]
  | Promise<ChannelLegacyStateMigrationPlan[] | null | undefined>
  | null
  | undefined;
/** Test hook for swapping the source-module loader used by bundled entry imports. */
type BundledEntryModuleLoadOptions = {
  createLoaderForTest?: PluginModuleLoaderFactory;
};
//#endregion
//#region src/plugin-sdk/channel-entry-contract.d.ts
type AnyAgentTool = AnyAgentTool$1;
type OpenClawPluginApi = OpenClawPluginApi$1;
type OpenClawPluginCommandDefinition = OpenClawPluginCommandDefinition$1;
type PluginCommandContext = PluginCommandContext$1;
type BundledChannelRuntime = unknown;
type ChannelEntryConfigSchema<TPlugin> =
  TPlugin extends ChannelPlugin<unknown>
    ? NonNullable<TPlugin["configSchema"]>
    : ChannelConfigSchema;
type BundledEntryModuleRef = {
  specifier: string;
  exportName?: string;
};
type DefineBundledChannelEntryOptions<TPlugin = ChannelPlugin> = {
  id: string;
  name: string;
  description: string;
  importMetaUrl: string;
  plugin: BundledEntryModuleRef;
  outbound?: BundledEntryModuleRef;
  secrets?: BundledEntryModuleRef;
  configSchema?: ChannelEntryConfigSchema<TPlugin> | (() => ChannelEntryConfigSchema<TPlugin>);
  runtime?: BundledEntryModuleRef;
  accountInspect?: BundledEntryModuleRef;
  features?: BundledChannelEntryFeatures;
  registerCliMetadata?: (api: OpenClawPluginApi) => void;
  registerFull?: (api: OpenClawPluginApi) => void;
};
type DefineBundledChannelSetupEntryOptions = {
  importMetaUrl: string;
  plugin: BundledEntryModuleRef;
  secrets?: BundledEntryModuleRef;
  runtime?: BundledEntryModuleRef;
  legacyStateMigrations?: BundledEntryModuleRef;
  legacySessionSurface?: BundledEntryModuleRef;
  registerSetupRuntime?: (api: OpenClawPluginApi) => void;
  features?: BundledChannelSetupEntryFeatures;
};
/** Feature flags exposed by bundled setup entries for optional migration/session surfaces. */
type BundledChannelSetupEntryFeatures = {
  legacyStateMigrations?: boolean;
  legacySessionSurfaces?: boolean;
};
/** Feature flags exposed by full bundled channel entries. */
type BundledChannelEntryFeatures = {
  accountInspect?: boolean;
};
/** Runtime contract returned by a bundled channel's main entrypoint definition. */
type BundledChannelEntryContract<TPlugin = ChannelPlugin> = {
  kind: "bundled-channel-entry";
  id: string;
  name: string;
  description: string;
  configSchema: ChannelEntryConfigSchema<TPlugin>;
  features?: BundledChannelEntryFeatures;
  register: (api: OpenClawPluginApi) => void;
  loadChannelPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
  loadChannelOutbound?: (
    options?: BundledEntryModuleLoadOptions,
  ) => ChannelOutboundAdapter | undefined;
  loadChannelSecrets?: (
    options?: BundledEntryModuleLoadOptions,
  ) => ChannelPlugin["secrets"] | undefined;
  loadChannelAccountInspector?: (
    options?: BundledEntryModuleLoadOptions,
  ) => NonNullable<ChannelPlugin["config"]["inspectAccount"]>;
  setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
};
/** Runtime contract returned by a bundled channel's setup-only entrypoint definition. */
type BundledChannelSetupEntryContract<TPlugin = ChannelPlugin> = {
  kind: "bundled-channel-setup-entry";
  loadSetupPlugin: (options?: BundledEntryModuleLoadOptions) => TPlugin;
  loadSetupSecrets?: (
    options?: BundledEntryModuleLoadOptions,
  ) => ChannelPlugin["secrets"] | undefined;
  loadLegacyStateMigrationDetector?: (
    options?: BundledEntryModuleLoadOptions,
  ) => BundledChannelLegacyStateMigrationDetector;
  loadLegacySessionSurface?: (
    options?: BundledEntryModuleLoadOptions,
  ) => BundledChannelLegacySessionSurface;
  setChannelRuntime?: (runtime: BundledChannelRuntime) => void;
  registerSetupRuntime?: (api: OpenClawPluginApi) => void;
  features?: BundledChannelSetupEntryFeatures;
};
/** Loads one export from a bundled channel sidecar module through the guarded entry boundary. */
declare function loadBundledEntryExportSync<T>(
  importMetaUrl: string,
  reference: BundledEntryModuleRef,
  options?: BundledEntryModuleLoadOptions,
): T;
/** Defines the full bundled channel entry contract used by core plugin registration. */
declare function defineBundledChannelEntry<TPlugin = ChannelPlugin>({
  id,
  name,
  description,
  importMetaUrl,
  plugin,
  outbound,
  secrets,
  configSchema,
  runtime,
  accountInspect,
  features,
  registerCliMetadata,
  registerFull,
}: DefineBundledChannelEntryOptions<TPlugin>): BundledChannelEntryContract<TPlugin>;
/** Defines the setup-only bundled channel entry contract for onboarding and migration surfaces. */
declare function defineBundledChannelSetupEntry<TPlugin = ChannelPlugin>({
  importMetaUrl,
  plugin,
  secrets,
  runtime,
  legacyStateMigrations,
  legacySessionSurface,
  registerSetupRuntime,
  features,
}: DefineBundledChannelSetupEntryOptions): BundledChannelSetupEntryContract<TPlugin>;
//#endregion
export {
  BundledChannelSetupEntryFeatures as a,
  PluginCommandContext as c,
  loadBundledEntryExportSync as d,
  BundledChannelLegacySessionSurface as f,
  BundledChannelSetupEntryContract as i,
  defineBundledChannelEntry as l,
  BundledEntryModuleLoadOptions as m,
  BundledChannelEntryContract as n,
  OpenClawPluginApi as o,
  BundledChannelLegacyStateMigrationDetector as p,
  BundledChannelEntryFeatures as r,
  OpenClawPluginCommandDefinition as s,
  AnyAgentTool as t,
  defineBundledChannelSetupEntry as u,
};
