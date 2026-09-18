import {
  n as getChannelPluginCatalogEntry,
  r as listRawChannelPluginCatalogEntries,
} from "./catalog-wn_skeE9.js";
import {
  c as normalizePluginsConfig,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import {
  a as resolveManifestOwnerBasePolicyBlock,
  t as hasExplicitManifestOwnerTrust,
} from "./manifest-owner-policy-Bl1TJHcS.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
//#region src/commands/channel-setup/trusted-catalog.ts
const LOCAL_CHANNEL_PLUGIN_ORIGIN_SET = /* @__PURE__ */ new Set(["workspace", "config", "global"]);
const MAX_TRUSTED_CATALOG_FALLBACKS = 16;
function isLocalChannelPluginOrigin(origin) {
  return origin !== void 0 && LOCAL_CHANNEL_PLUGIN_ORIGIN_SET.has(origin);
}
function resolveEffectiveTrustConfig(cfg, env) {
  return applyPluginAutoEnable({
    config: cfg,
    env: env ?? process.env,
  }).config;
}
function resolveTrustedCatalogExtraPaths(cfg) {
  const extraPaths = normalizePluginsConfig(cfg.plugins).loadPaths;
  return extraPaths.length > 0 ? extraPaths : void 0;
}
function isTrustedLocalChannelCatalogEntry(entry, cfg, env) {
  if (!isLocalChannelPluginOrigin(entry?.origin)) return true;
  if (!entry.pluginId) return false;
  const effectiveConfig = resolveEffectiveTrustConfig(cfg, env);
  const normalizedPlugins = normalizePluginsConfig(effectiveConfig.plugins);
  if (
    resolveManifestOwnerBasePolicyBlock({
      plugin: { id: entry.pluginId },
      normalizedConfig: normalizedPlugins,
    }) !== null
  )
    return false;
  const activationState = resolveEffectivePluginActivationState({
    id: entry.pluginId,
    origin: entry.origin,
    config: normalizedPlugins,
    rootConfig: effectiveConfig,
  });
  return (
    hasExplicitManifestOwnerTrust({
      plugin: { id: entry.pluginId },
      normalizedConfig: normalizedPlugins,
    }) ||
    (entry.origin === "workspace" && activationState.source === "auto")
  );
}
function resolveRejectedCatalogLookup(rejected) {
  const excludePluginRefs = rejected.flatMap((entry) =>
    entry.pluginId?.trim()
      ? [
          {
            pluginId: entry.pluginId.trim(),
            ...(entry.origin ? { origin: entry.origin } : {}),
          },
        ]
      : [],
  );
  const excludeOrigins = rejected.flatMap((entry) =>
    isLocalChannelPluginOrigin(entry.origin) && !entry.pluginId ? [entry.origin] : [],
  );
  const lookup = {};
  if (excludeOrigins.length > 0) lookup.excludeOrigins = excludeOrigins;
  if (excludePluginRefs.length > 0) lookup.excludePluginRefs = excludePluginRefs;
  return lookup;
}
function resolveRejectedCatalogEntryKey(entry) {
  const pluginId = entry.pluginId?.trim();
  if (pluginId) return `plugin:${entry.origin ?? ""}:${pluginId}`;
  return isLocalChannelPluginOrigin(entry.origin) ? `origin:${entry.origin}` : null;
}
function resolveTrustedCatalogEntry(channelId, params, rejected = []) {
  const extraPaths = resolveTrustedCatalogExtraPaths(params.cfg);
  const rejectedEntries = [...rejected];
  const seenRejectedKeys = new Set(
    rejectedEntries.flatMap((entry) => {
      const key = resolveRejectedCatalogEntryKey(entry);
      return key ? [key] : [];
    }),
  );
  for (let attempts = 0; attempts <= MAX_TRUSTED_CATALOG_FALLBACKS; attempts += 1) {
    const candidate = getChannelPluginCatalogEntry(channelId, {
      workspaceDir: params.workspaceDir,
      env: params.env,
      ...(extraPaths ? { extraPaths } : {}),
      ...resolveRejectedCatalogLookup(rejectedEntries),
    });
    if (!candidate) return;
    if (isTrustedLocalChannelCatalogEntry(candidate, params.cfg, params.env)) return candidate;
    const rejectedKey = resolveRejectedCatalogEntryKey(candidate);
    if (rejectedKey && seenRejectedKeys.has(rejectedKey)) return;
    if (rejectedKey) seenRejectedKeys.add(rejectedKey);
    rejectedEntries.push(candidate);
  }
}
/** Resolve a catalog entry, falling back to non-workspace metadata when workspace entry is untrusted. */
function getTrustedChannelPluginCatalogEntry(channelId, params) {
  return resolveTrustedCatalogEntry(channelId, params);
}
function listChannelPluginCatalogEntriesWithTrustedFallback(params, onMissingFallback) {
  const extraPaths = resolveTrustedCatalogExtraPaths(params.cfg);
  return listRawChannelPluginCatalogEntries({
    workspaceDir: params.workspaceDir,
    env: params.env,
    ...(extraPaths ? { extraPaths } : {}),
  }).flatMap((entry) => {
    if (isTrustedLocalChannelCatalogEntry(entry, params.cfg, params.env)) return [entry];
    const fallback = resolveTrustedCatalogEntry(entry.id, params, [entry]);
    return fallback ? [fallback] : onMissingFallback(entry);
  });
}
/** List trusted catalog entries, dropping untrusted workspace-only shadows. */
function listTrustedChannelPluginCatalogEntries(params) {
  return listChannelPluginCatalogEntriesWithTrustedFallback(params, () => []);
}
/** List setup discovery entries, preserving untrusted workspace-only entries for install prompts. */
function listSetupDiscoveryChannelPluginCatalogEntries(params) {
  return listChannelPluginCatalogEntriesWithTrustedFallback(params, (entry) => [entry]);
}
//#endregion
export {
  listSetupDiscoveryChannelPluginCatalogEntries as n,
  listTrustedChannelPluginCatalogEntries as r,
  getTrustedChannelPluginCatalogEntry as t,
};
