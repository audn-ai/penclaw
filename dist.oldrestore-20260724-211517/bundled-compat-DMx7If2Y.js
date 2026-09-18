import { o as normalizePluginId } from "./config-state-C1Qyxaws.js";
import { a as hasExplicitPluginConfig } from "./manifest-registry-CXy9BBfE.js";
//#region src/plugins/bundled-compat.ts
/** Returns config with selected bundled plugins explicitly enabled when compat rules require it. */
function withBundledPluginEnablementCompat(params) {
  const existingEntries = params.config?.plugins?.entries ?? {};
  const forcePluginsEnabled = params.config?.plugins?.enabled === false;
  const allow = params.config?.plugins?.allow;
  const bypassAllowlist = params.config?.plugins?.bundledDiscovery === "compat";
  const allowSet =
    !bypassAllowlist && Array.isArray(allow) && allow.length > 0
      ? new Set(allow.map((pluginId) => normalizePluginId(pluginId)).filter(Boolean))
      : void 0;
  let hasEligiblePlugin = false;
  let changed = false;
  const nextEntries = { ...existingEntries };
  const nextAllow = bypassAllowlist && Array.isArray(allow) ? new Set(allow) : void 0;
  for (const pluginId of params.pluginIds) {
    if (allowSet && !allowSet.has(pluginId)) continue;
    hasEligiblePlugin = true;
    const beforeAllowSize = nextAllow?.size;
    nextAllow?.add(pluginId);
    if (nextAllow && nextAllow.size !== beforeAllowSize) changed = true;
    if (existingEntries[pluginId] !== void 0) continue;
    nextEntries[pluginId] = { enabled: true };
    changed = true;
  }
  if (!changed) {
    if (!forcePluginsEnabled || !hasEligiblePlugin) return params.config;
  }
  return {
    ...params.config,
    plugins: {
      ...params.config?.plugins,
      ...(forcePluginsEnabled ? { enabled: true } : {}),
      ...(nextAllow ? { allow: [...nextAllow] } : {}),
      entries: {
        ...existingEntries,
        ...nextEntries,
      },
    },
  };
}
/** Enables bundled plugins in Vitest when tests did not provide explicit plugin config. */
function withBundledPluginVitestCompat(params) {
  const env = params.env ?? process.env;
  if (
    !Boolean(env.VITEST) ||
    hasExplicitPluginConfig(params.config?.plugins) ||
    params.pluginIds.length === 0
  )
    return params.config;
  const entries = Object.fromEntries(
    params.pluginIds.map((pluginId) => [pluginId, { enabled: true }]),
  );
  return {
    ...params.config,
    plugins: {
      ...params.config?.plugins,
      enabled: true,
      allow: [...params.pluginIds],
      entries: {
        ...entries,
        ...params.config?.plugins?.entries,
      },
      slots: {
        ...params.config?.plugins?.slots,
        memory: "none",
      },
    },
  };
}
//#endregion
export { withBundledPluginVitestCompat as n, withBundledPluginEnablementCompat as t };
