import { r as withActivatedPluginIds } from "./activation-context-BIXFhH9U.js";
import { t as resolveManifestActivationPlan } from "./activation-planner-CPU1RoZb.js";
import { u as resolveEffectivePluginActivationState } from "./config-state-C1Qyxaws.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DMpABeI4.js";
import {
  L as isDefaultAgentRuntimeId,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import {
  f as loadPluginRegistrySnapshot,
  r as normalizePluginsConfigWithRegistry,
} from "./plugin-registry-BckMdz4f.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import {
  f as resolveOwningPluginIdsForProviderRef,
  n as resolveBundledProviderCompatPluginIds,
  t as resolveActivatableProviderOwnerPluginIds,
} from "./providers-D0H29WPB.js";
//#region src/agents/harness/runtime-plugin.ts
function dedupePluginIds(values) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const value of values) {
    const pluginId = value.trim();
    if (!pluginId || seen.has(pluginId)) continue;
    seen.add(pluginId);
    result.push(pluginId);
  }
  return result;
}
function restrictiveAllowlistOmitsPlugin(config, pluginId) {
  const allow = config?.plugins?.allow ?? [];
  return allow.length > 0 && !allow.includes(pluginId);
}
function resolveSelectedMemoryPluginIds(params) {
  const registry = loadPluginRegistrySnapshot({
    config: params.config,
    workspaceDir: params.workspaceDir,
  });
  const plugins = normalizePluginsConfigWithRegistry(params.config?.plugins, registry);
  const memorySlot = plugins.slots.memory;
  if (
    typeof memorySlot !== "string" ||
    memorySlot.trim().length === 0 ||
    restrictiveAllowlistOmitsPlugin(params.config, memorySlot)
  )
    return [];
  const plugin = registry.plugins.find((entry) => entry.pluginId === memorySlot);
  if (!plugin?.startup.memory) return [];
  return resolveEffectivePluginActivationState({
    id: plugin.pluginId,
    origin: plugin.origin,
    config: plugins,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
  }).activated
    ? [plugin.pluginId]
    : [];
}
/** Resolve manifest owners required by one selected non-core harness runtime. */
function resolveAgentHarnessOwnerPluginIds(params) {
  const harnessPluginIds = resolveManifestActivationPlan({
    trigger: {
      kind: "agentHarness",
      runtime: params.runtime,
    },
    config: params.config,
    workspaceDir: params.workspaceDir,
    requireExplicitManifestOwnerTrust: true,
  }).entries.map((entry) => entry.pluginId);
  if (harnessPluginIds.length === 0) return [];
  if (params.runtime !== "codex") return harnessPluginIds;
  if (!harnessPluginIds.includes("codex")) return harnessPluginIds;
  if (restrictiveAllowlistOmitsPlugin(params.config, "codex")) return harnessPluginIds;
  const providerOwnerPluginIds = dedupePluginIds(
    resolveOwningPluginIdsForProviderRef({
      provider: params.provider,
      config: params.config,
      workspaceDir: params.workspaceDir,
    }) ?? [],
  );
  if (providerOwnerPluginIds.length === 0) return harnessPluginIds;
  const safeProviderOwnerPluginIds = dedupePluginIds([
    ...resolveBundledProviderCompatPluginIds({
      config: params.config,
      workspaceDir: params.workspaceDir,
      onlyPluginIds: providerOwnerPluginIds,
    }),
    ...resolveActivatableProviderOwnerPluginIds({
      pluginIds: providerOwnerPluginIds,
      config: params.config,
      workspaceDir: params.workspaceDir,
    }),
  ]);
  return dedupePluginIds([
    "codex",
    ...harnessPluginIds,
    ...providerOwnerPluginIds.filter(
      (pluginId) => pluginId !== "codex" && safeProviderOwnerPluginIds.includes(pluginId),
    ),
  ]);
}
function withRuntimePluginIdsAllowed(params) {
  if (params.pluginIds.length === 0) return params.config;
  if (restrictiveAllowlistOmitsPlugin(params.config, params.requiredPluginId)) return params.config;
  const allow = dedupePluginIds([...(params.config?.plugins?.allow ?? []), ...params.pluginIds]);
  return {
    ...params.config,
    plugins: {
      ...params.config?.plugins,
      allow,
    },
  };
}
/** Ensures the plugin that owns the selected harness runtime is loaded before harness selection. */
async function ensureSelectedAgentHarnessPlugin(params) {
  const pinnedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
  const runtimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
  const policy = resolveAgentHarnessPolicy({
    provider: params.provider,
    modelId: params.modelId,
    config: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    requestTransportOverrides: params.requestTransportOverrides,
  });
  const requestedRuntime = pinnedHarnessId ?? runtimeOverride;
  const runtime =
    requestedRuntime && !isDefaultAgentRuntimeId(requestedRuntime)
      ? requestedRuntime
      : policy.runtime;
  if (
    isDefaultAgentRuntimeId(runtime) ||
    runtime === "openclaw" ||
    isCliRuntimeAliasForProvider({
      runtime,
      provider: params.provider,
      cfg: params.config,
    })
  )
    return;
  const { ensurePluginRegistryLoaded } = await import("./runtime-registry-loader-CACAaShx.js");
  const pluginIds = resolveAgentHarnessOwnerPluginIds({
    runtime,
    provider: params.provider,
    config: params.config,
    workspaceDir: params.workspaceDir,
  });
  if (pluginIds.length === 0) return;
  const memoryPluginIds = resolveSelectedMemoryPluginIds({
    config: params.config,
    workspaceDir: params.workspaceDir,
  });
  const scopedPluginIds = dedupePluginIds([...pluginIds, ...memoryPluginIds]);
  const configWithAllowedRuntimePlugins = withRuntimePluginIdsAllowed({
    config: params.config,
    requiredPluginId: runtime,
    pluginIds: scopedPluginIds,
  });
  const activatedConfig =
    withActivatedPluginIds({
      config: configWithAllowedRuntimePlugins,
      pluginIds: scopedPluginIds,
    }) ?? configWithAllowedRuntimePlugins;
  ensurePluginRegistryLoaded({
    scope: "all",
    ...(activatedConfig
      ? {
          config: activatedConfig,
          activationSourceConfig: activatedConfig,
        }
      : {}),
    workspaceDir: params.workspaceDir,
    onlyPluginIds: scopedPluginIds,
  });
}
//#endregion
export { resolveAgentHarnessOwnerPluginIds as n, ensureSelectedAgentHarnessPlugin as t };
