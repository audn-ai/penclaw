import {
  a as listExplicitConfiguredChannelIdsForConfig,
  o as resolveConfiguredChannelPluginIds,
} from "./channel-presence-policy-5sGDOKpp.js";
import {
  n as listExplicitlyDisabledChannelIdsForConfig,
  r as listPotentialConfiguredChannelIds,
} from "./config-presence-dDm96tuW.js";
import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { c as loadGatewayStartupPluginPlan } from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Bl1TJHcS.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
import { n as defaultSlotIdForKey } from "./slots-kpL659LX.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./channel-plugin-ids-B1yGqL5H.js";
//#region src/plugins/effective-plugin-ids.ts
/** Resolves effective plugin ids from config, installed records, and activation metadata. */
function collectConfiguredChannelIds(config, activationSourceConfig, env) {
  const disabled = /* @__PURE__ */ new Set([
    ...listExplicitlyDisabledChannelIdsForConfig(config),
    ...listExplicitlyDisabledChannelIdsForConfig(activationSourceConfig),
  ]);
  return [
    .../* @__PURE__ */ new Set([
      ...listPotentialConfiguredChannelIds(config, env, { includePersistedAuthState: false }),
      ...listExplicitConfiguredChannelIdsForConfig(activationSourceConfig),
    ]),
  ]
    .map((channelId) => normalizeOptionalLowercaseString(channelId))
    .filter((channelId) => {
      if (!channelId) return false;
      return !disabled.has(channelId);
    })
    .toSorted((left, right) => left.localeCompare(right));
}
function collectBundledChannelOwnerPluginIds(params) {
  const plugins = normalizePluginsConfig(params.config.plugins);
  const channelIds = new Set(
    params.channelIds
      .map((channelId) => normalizeOptionalLowercaseString(channelId))
      .filter((channelId) => Boolean(channelId)),
  );
  if (channelIds.size === 0) return [];
  const env = params.bundledPluginsDir
    ? {
        ...params.env,
        OPENCLAW_BUNDLED_PLUGINS_DIR: params.bundledPluginsDir,
        ...(params.env.VITEST || process.env.VITEST
          ? { OPENCLAW_TEST_TRUST_BUNDLED_PLUGINS_DIR: "1" }
          : {}),
      }
    : params.env;
  const snapshot = loadManifestMetadataSnapshot({
    config: params.config,
    env,
    workspaceDir: params.workspaceDir,
  });
  const pluginIds = /* @__PURE__ */ new Set();
  for (const plugin of snapshot.plugins) {
    if (plugin.origin !== "bundled") continue;
    if (
      plugin.channels.some((channelId) =>
        channelIds.has(normalizeOptionalLowercaseString(channelId) ?? ""),
      )
    ) {
      const pluginId = normalizeOptionalLowercaseString(plugin.id);
      if (
        pluginId &&
        passesManifestOwnerBasePolicy({
          plugin: { id: pluginId },
          normalizedConfig: plugins,
          allowRestrictiveAllowlistBypass: true,
        })
      )
        pluginIds.add(pluginId);
    }
  }
  return sortUniqueStrings(pluginIds);
}
function collectExplicitEffectivePluginIds(config) {
  const plugins = normalizePluginsConfig(config.plugins);
  if (!plugins.enabled) return [];
  const ids = new Set(plugins.allow);
  for (const [pluginId, entry] of Object.entries(plugins.entries))
    if (entry?.enabled === true && (plugins.allow.length === 0 || plugins.allow.includes(pluginId)))
      ids.add(pluginId);
  for (const pluginId of plugins.deny) ids.delete(pluginId);
  for (const [pluginId, entry] of Object.entries(plugins.entries))
    if (entry?.enabled === false) ids.delete(pluginId);
  return sortUniqueStrings(ids);
}
function collectSelectedContextEnginePluginIds(config) {
  const plugins = normalizePluginsConfig(config.plugins);
  if (!plugins.enabled) return [];
  const pluginId = plugins.slots.contextEngine;
  if (!pluginId || pluginId === defaultSlotIdForKey("contextEngine")) return [];
  if (plugins.deny.includes(pluginId)) return [];
  if (plugins.entries[pluginId]?.enabled === false) return [];
  return [pluginId];
}
/** Lists plugin ids that are effectively enabled for a config/discovery context. */
function resolveEffectivePluginIds(params) {
  const effectiveConfig = applyPluginAutoEnable({
    config: params.config,
    env: params.env,
  }).config;
  const ids = new Set(collectExplicitEffectivePluginIds(effectiveConfig));
  for (const pluginId of collectSelectedContextEnginePluginIds(effectiveConfig)) ids.add(pluginId);
  const configuredChannelIds = collectConfiguredChannelIds(
    effectiveConfig,
    params.config,
    params.env,
  );
  for (const pluginId of resolveConfiguredChannelPluginIds({
    config: effectiveConfig,
    activationSourceConfig: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  }))
    ids.add(pluginId);
  for (const pluginId of collectBundledChannelOwnerPluginIds({
    config: effectiveConfig,
    channelIds: configuredChannelIds,
    env: params.env,
    workspaceDir: params.workspaceDir,
    ...(params.bundledPluginsDir ? { bundledPluginsDir: params.bundledPluginsDir } : {}),
  }))
    ids.add(pluginId);
  for (const pluginId of loadGatewayStartupPluginPlan({
    config: effectiveConfig,
    activationSourceConfig: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  }).pluginIds)
    ids.add(pluginId);
  return sortUniqueStrings(ids);
}
//#endregion
export { resolveEffectivePluginIds as t };
