import { t as NormalizedPluginsConfig$1 } from "./config-normalization-shared-C04q_bX_.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugins/config-activation-shared.d.ts
type PluginActivationSource = "disabled" | "explicit" | "auto" | "default";
type PluginActivationConfigLike = {
  enabled: boolean;
  allow: readonly string[];
  deny: readonly string[];
  slots: {
    memory?: string | null;
    contextEngine?: string | null;
  };
  entries: Record<
    string,
    | {
        enabled?: boolean;
      }
    | undefined
  >;
};
type PluginActivationConfigSourceLike<TRootConfig> = {
  plugins: PluginActivationConfigLike;
  rootConfig?: TRootConfig;
};
//#endregion
//#region src/plugins/config-state.d.ts
type PluginActivationConfigSource = {
  plugins: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
} & PluginActivationConfigSourceLike<OpenClawConfig>;
type NormalizedPluginsConfig = NormalizedPluginsConfig$1;
declare const normalizePluginsConfig: (
  config?: OpenClawConfig["plugins"],
) => NormalizedPluginsConfig;
declare function createPluginActivationSource(params: {
  config?: OpenClawConfig;
  plugins?: NormalizedPluginsConfig;
}): PluginActivationConfigSource;
type EffectiveActivationParams = {
  id: string;
  origin: PluginOrigin;
  config: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
  enabledByDefault?: boolean;
  activationSource?: PluginActivationConfigSource;
};
declare const resolveEffectiveEnableState: (params: EffectiveActivationParams) => {
  enabled: boolean;
  reason?: string;
};
//#endregion
export {
  PluginActivationSource as i,
  normalizePluginsConfig as n,
  resolveEffectiveEnableState as r,
  createPluginActivationSource as t,
};
