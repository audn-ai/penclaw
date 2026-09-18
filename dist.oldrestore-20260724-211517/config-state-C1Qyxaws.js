import {
  a as createEffectiveEnableStateResolver,
  c as resolvePluginActivationDecisionShared,
  i as normalizePluginsConfigWithResolver,
  l as toPluginActivationState,
  o as createPluginEnableStateResolver,
  r as isBundledChannelEnabledByChannelConfig$1,
  s as resolveMemorySlotDecisionShared,
  t as hasExplicitPluginConfig$1,
} from "./config-normalization-shared-DXCRDrH7.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as defaultSlotIdForKey } from "./slots-kpL659LX.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/config-state.ts
/** Normalizes plugin config and resolves effective enablement, slots, and activation sources. */
const BUILT_IN_PLUGIN_ALIAS_FALLBACKS = [
  ["google-gemini-cli", "google"],
  ["minimax-portal", "minimax"],
  ["minimax-portal-auth", "minimax"],
];
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = new Map([
  ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS,
  ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS.map(([, pluginId]) => [pluginId, pluginId]),
]);
function getBundledPluginAliasLookup() {
  const lookup = /* @__PURE__ */ new Map();
  for (const [alias, pluginId] of BUILT_IN_PLUGIN_ALIAS_FALLBACKS) lookup.set(alias, pluginId);
  return lookup;
}
function normalizePluginIdWithLookup(id, getAliasLookup) {
  const normalized = normalizeOptionalLowercaseString(normalizeOptionalString(id) ?? "") ?? "";
  const builtInAlias = BUILT_IN_PLUGIN_ALIAS_LOOKUP.get(normalized);
  if (builtInAlias) return builtInAlias;
  return getAliasLookup().get(normalized) ?? normalized;
}
function createScopedPluginIdNormalizer() {
  let lookup;
  return (id) =>
    normalizePluginIdWithLookup(id, () => {
      lookup ??= getBundledPluginAliasLookup();
      return lookup;
    });
}
/** Normalizes user/config plugin ids into the canonical lowercase key form. */
function normalizePluginId(id) {
  return normalizePluginIdWithLookup(id, getBundledPluginAliasLookup);
}
const normalizePluginsConfig = (config) => {
  return normalizePluginsConfigWithResolver(config, createScopedPluginIdNormalizer());
};
/** Canonicalizes one plugin entry and its policy-list ids before a targeted mutation. */
function normalizePluginTargetConfig(config, pluginId) {
  const normalizedId = normalizePluginId(pluginId);
  const normalized = normalizePluginsConfig(config.plugins);
  const rawEntries = config.plugins?.entries ?? {};
  const hasTargetEntry = Object.keys(rawEntries).some(
    (entryId) => normalizePluginId(entryId) === normalizedId,
  );
  const entries = Object.fromEntries(
    Object.entries(rawEntries).filter(([entryId]) => normalizePluginId(entryId) !== normalizedId),
  );
  if (hasTargetEntry) {
    const { config: pluginConfig, ...entry } = normalized.entries[normalizedId] ?? {};
    entries[normalizedId] = {
      ...entry,
      ...(isRecord(pluginConfig) ? { config: pluginConfig } : {}),
    };
  }
  return {
    ...config,
    plugins: {
      ...config.plugins,
      ...(Array.isArray(config.plugins?.allow) ? { allow: normalized.allow } : {}),
      ...(Array.isArray(config.plugins?.deny) ? { deny: normalized.deny } : {}),
      entries,
    },
  };
}
function createPluginActivationSource(params) {
  return {
    plugins: params.plugins ?? normalizePluginsConfig(params.config?.plugins),
    rootConfig: params.config,
  };
}
const hasExplicitMemorySlot = (plugins) =>
  Boolean(plugins?.slots && Object.hasOwn(plugins.slots, "memory"));
const hasExplicitMemoryEntry = (plugins) =>
  Boolean(plugins?.entries && Object.hasOwn(plugins.entries, defaultSlotIdForKey("memory")));
const hasExplicitPluginConfig = (plugins) => hasExplicitPluginConfig$1(plugins);
function applyTestPluginDefaults(cfg, env = process.env) {
  if (!env.VITEST) return cfg;
  const plugins = cfg.plugins;
  if (hasExplicitPluginConfig(plugins)) {
    if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) return cfg;
    return {
      ...cfg,
      plugins: {
        ...plugins,
        slots: {
          ...plugins?.slots,
          memory: "none",
        },
      },
    };
  }
  return {
    ...cfg,
    plugins: {
      ...plugins,
      enabled: false,
      slots: {
        ...plugins?.slots,
        memory: "none",
      },
    },
  };
}
function isTestDefaultMemorySlotDisabled(cfg, env = process.env) {
  if (!env.VITEST) return false;
  const plugins = cfg.plugins;
  if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) return false;
  return true;
}
function resolvePluginActivationState(params) {
  return toPluginActivationState(
    resolvePluginActivationDecisionShared({
      ...params,
      activationSource:
        params.activationSource ??
        createPluginActivationSource({
          config: params.rootConfig,
          plugins: params.config,
        }),
      allowBundledChannelExplicitBypassesAllowlist: true,
      isBundledChannelEnabledByChannelConfig,
    }),
  );
}
const resolveEnableState = createPluginEnableStateResolver(resolvePluginActivationState);
const isBundledChannelEnabledByChannelConfig = isBundledChannelEnabledByChannelConfig$1;
const resolveEffectiveEnableState = createEffectiveEnableStateResolver(
  resolveEffectivePluginActivationState,
);
function resolveEffectivePluginActivationState(params) {
  return resolvePluginActivationState(params);
}
function resolveMemorySlotDecision(params) {
  return resolveMemorySlotDecisionShared(params);
}
//#endregion
export {
  isTestDefaultMemorySlotDisabled as a,
  normalizePluginsConfig as c,
  resolveEnableState as d,
  resolveMemorySlotDecision as f,
  isBundledChannelEnabledByChannelConfig as i,
  resolveEffectiveEnableState as l,
  createPluginActivationSource as n,
  normalizePluginId as o,
  resolvePluginActivationState as p,
  hasExplicitPluginConfig as r,
  normalizePluginTargetConfig as s,
  applyTestPluginDefaults as t,
  resolveEffectivePluginActivationState as u,
};
