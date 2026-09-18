import { n as resolveBundledPluginCompatibleLoadValues } from "./activation-context-BIXFhH9U.js";
import {
  c as normalizePluginsConfig,
  n as createPluginActivationSource,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import { s as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { a as loadManifestContractSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
//#region src/plugins/bundled-manifest-contract-plugins.ts
/** Lists bundled plugin ids with a non-empty contract contribution in a manifest snapshot. */
function listBundledManifestContractPluginIds(params) {
  const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
  return params.plugins
    .filter(
      (plugin) =>
        plugin.origin === "bundled" &&
        (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) &&
        (plugin.contracts?.[params.contract]?.length ?? 0) > 0,
    )
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
}
/** Applies config activation and compatibility rules before returning bundled contract owners. */
function resolveEnabledBundledManifestContractPlugins(params) {
  if (params.config?.plugins?.enabled === false) return [];
  let manifestRecords;
  const loadManifestRecords = (config) => {
    manifestRecords ??= loadManifestContractSnapshot({
      config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }).plugins;
    return manifestRecords;
  };
  const activation = resolveBundledPluginCompatibleLoadValues({
    rawConfig: params.config,
    env: params.env,
    workspaceDir: params.workspaceDir,
    onlyPluginIds: params.onlyPluginIds,
    applyAutoEnable: true,
    compatMode: params.compatMode,
    resolveCompatPluginIds: (compatParams) =>
      listBundledManifestContractPluginIds({
        plugins: loadManifestRecords(compatParams.config),
        contract: params.contract,
        onlyPluginIds: compatParams.onlyPluginIds,
      }),
  });
  const normalizedPlugins = normalizePluginsConfig(activation.config?.plugins);
  const activationSource = createPluginActivationSource({
    config: activation.activationSourceConfig,
  });
  const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
  return loadManifestRecords(activation.config).filter((plugin) => {
    if (
      plugin.origin !== "bundled" ||
      (onlyPluginIdSet && !onlyPluginIdSet.has(plugin.id)) ||
      (plugin.contracts?.[params.contract]?.length ?? 0) === 0
    )
      return false;
    return resolveEffectivePluginActivationState({
      id: plugin.id,
      origin: plugin.origin,
      config: normalizedPlugins,
      rootConfig: activation.config,
      enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
      activationSource,
    }).enabled;
  });
}
//#endregion
export { resolveEnabledBundledManifestContractPlugins as t };
