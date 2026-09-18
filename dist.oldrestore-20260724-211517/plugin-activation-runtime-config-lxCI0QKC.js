import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
import "./utils-DtcDeqWS.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/gateway/plugin-activation-runtime-config.ts
function hasOwnValue(record, key) {
  return Object.hasOwn(record, key);
}
function mergeChannelActivationSections(params) {
  const activationChannels = params.activationConfig.channels;
  if (!isRecord(activationChannels)) return params.runtimeConfig;
  const runtimeChannels = isRecord(params.runtimeConfig.channels)
    ? params.runtimeConfig.channels
    : {};
  let nextChannels;
  for (const [channelId, activationChannel] of Object.entries(activationChannels)) {
    if (!isRecord(activationChannel) || !hasOwnValue(activationChannel, "enabled")) continue;
    const runtimeChannel = runtimeChannels[channelId];
    const runtimeChannelRecord = isRecord(runtimeChannel) ? runtimeChannel : {};
    nextChannels ??= { ...runtimeChannels };
    nextChannels[channelId] = {
      ...runtimeChannelRecord,
      enabled: activationChannel.enabled,
    };
  }
  if (nextChannels === void 0) return params.runtimeConfig;
  return {
    ...params.runtimeConfig,
    channels: nextChannels,
  };
}
function mergePluginActivationSections(params) {
  const activationPlugins = params.activationConfig.plugins;
  if (!isRecord(activationPlugins)) return params.runtimeConfig;
  const runtimePlugins = isRecord(params.runtimeConfig.plugins) ? params.runtimeConfig.plugins : {};
  let nextPlugins;
  if (Array.isArray(activationPlugins.allow))
    nextPlugins = {
      ...runtimePlugins,
      allow: [...activationPlugins.allow],
    };
  const activationEntries = activationPlugins.entries;
  if (isRecord(activationEntries)) {
    const runtimeEntries = isRecord(runtimePlugins.entries) ? runtimePlugins.entries : {};
    let nextEntries;
    for (const [pluginId, activationEntry] of Object.entries(activationEntries)) {
      if (!isRecord(activationEntry) || !hasOwnValue(activationEntry, "enabled")) continue;
      const runtimeEntry = runtimeEntries[pluginId];
      const runtimeEntryRecord = isRecord(runtimeEntry) ? runtimeEntry : {};
      nextEntries ??= { ...runtimeEntries };
      nextEntries[pluginId] = {
        ...runtimeEntryRecord,
        enabled: activationEntry.enabled,
      };
    }
    if (nextEntries !== void 0)
      nextPlugins = {
        ...runtimePlugins,
        ...nextPlugins,
        entries: nextEntries,
      };
  }
  if (nextPlugins === void 0) return params.runtimeConfig;
  return {
    ...params.runtimeConfig,
    plugins: nextPlugins,
  };
}
/** Merges plugin/channel activation enablement into the runtime config shape. */
function mergeActivationSectionsIntoRuntimeConfig(params) {
  return mergePluginActivationSections({
    ...params,
    runtimeConfig: mergeChannelActivationSections(params),
  });
}
function resolveGatewayStartupPluginActivationConfig(params) {
  return mergeActivationSectionsIntoRuntimeConfig({
    runtimeConfig: params.runtimeConfig,
    activationConfig: applyPluginAutoEnable({
      config: params.activationSourceConfig,
      env: params.env,
      ...(params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}),
      discovery: params.discovery,
    }).config,
  });
}
/** Re-derives source-owned plugin activation and carries it into one reload candidate. */
function resolveGatewayReloadPluginActivationCandidate(params) {
  const activationConfig = applyPluginAutoEnable({
    config: params.sourceConfig,
    env: params.env,
    ...(params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}),
    discovery: params.discovery,
  }).config;
  return {
    runtimeConfig: mergeActivationSectionsIntoRuntimeConfig({
      runtimeConfig: params.runtimeConfig,
      activationConfig,
    }),
    compareConfig: activationConfig,
  };
}
//#endregion
export {
  resolveGatewayReloadPluginActivationCandidate as n,
  resolveGatewayStartupPluginActivationConfig as r,
  mergeActivationSectionsIntoRuntimeConfig as t,
};
