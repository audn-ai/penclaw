import { l as PluginManifestSecretProviderIntegration } from "../manifest-registry-CHEq75Tu.js";
import {
  l as ManualExecSecretProviderConfig,
  u as PluginIntegrationSecretProviderConfig,
} from "../types.secrets-C15Z_eLX.js";

//#region src/secrets/provider-integrations.d.ts
/** Secret provider preset exposed by an active trusted plugin integration. */
type SecretProviderIntegrationPreset = {
  id: string;
  pluginId: string;
  providerAlias: string;
  displayName: string;
  description?: string;
  providerConfig: PluginIntegrationSecretProviderConfig;
};
/** Result of materializing a plugin integration into a manual exec provider config. */
type SecretProviderIntegrationResolution =
  | {
      ok: true;
      providerConfig: ManualExecSecretProviderConfig;
    }
  | {
      ok: false;
      reason: string;
    };
//#endregion
export type {
  PluginIntegrationSecretProviderConfig,
  PluginManifestSecretProviderIntegration,
  SecretProviderIntegrationPreset,
  SecretProviderIntegrationResolution,
};
