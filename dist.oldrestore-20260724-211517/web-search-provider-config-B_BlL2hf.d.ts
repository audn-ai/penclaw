import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/tools/web-search-provider-config.d.ts
/** Reads the legacy top-level web search credential value. */
declare function getTopLevelCredentialValue(searchConfig?: Record<string, unknown>): unknown;
/** Writes the legacy top-level web search credential value. */
declare function setTopLevelCredentialValue(
  searchConfigTarget: Record<string, unknown>,
  value: unknown,
): void;
/** Reads a provider-scoped credential value from a web search config object. */
declare function getScopedCredentialValue(
  searchConfig: Record<string, unknown> | undefined,
  key: string,
): unknown;
/** Writes a provider-scoped credential value, creating the scoped object when needed. */
declare function setScopedCredentialValue(
  searchConfigTarget: Record<string, unknown>,
  key: string,
  value: unknown,
): void;
/** Merges plugin web-search config into a provider-scoped legacy-compatible shape. */
declare function mergeScopedSearchConfig(
  searchConfig: Record<string, unknown> | undefined,
  key: string,
  pluginConfig: Record<string, unknown> | undefined,
  options?: {
    mirrorApiKeyToTopLevel?: boolean;
  },
): Record<string, unknown> | undefined;
/** Resolves plugin-owned web-search config for a provider plugin id. */
declare function resolveProviderWebSearchPluginConfig(
  config: OpenClawConfig | undefined,
  pluginId: string,
): Record<string, unknown> | undefined;
/** Writes a single plugin-owned web-search config value and enables the plugin entry if needed. */
declare function setProviderWebSearchPluginConfigValue(
  configTarget: OpenClawConfig,
  pluginId: string,
  key: string,
  value: unknown,
): void;
//#endregion
export {
  setProviderWebSearchPluginConfigValue as a,
  resolveProviderWebSearchPluginConfig as i,
  getTopLevelCredentialValue as n,
  setScopedCredentialValue as o,
  mergeScopedSearchConfig as r,
  setTopLevelCredentialValue as s,
  getScopedCredentialValue as t,
};
