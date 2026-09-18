import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { l as resolveRuntimePluginRegistry } from "./loader-3uGIvPnj.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
import {
  c as getActivePluginRegistry,
  n as getActivePluginChannelRegistry,
  r as getActivePluginChannelRegistryVersion,
  u as getActivePluginRegistryVersion,
} from "./runtime-CcYnX0B4.js";
import { y as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-BbbqRiDR.js";
//#region src/infra/outbound/channel-bootstrap.runtime.ts
const MAX_BOOTSTRAP_CONFIG_GENERATIONS = 64;
let bootstrapRegistryGeneration;
const bootstrapAttemptedChannelsByConfig = /* @__PURE__ */ new Map();
function resolveBootstrapRegistryGeneration() {
  return `${getActivePluginChannelRegistryVersion()}:${getActivePluginRegistryVersion()}`;
}
function resolveBootstrapAttemptedChannels(cfg) {
  const registryGeneration = resolveBootstrapRegistryGeneration();
  if (registryGeneration !== bootstrapRegistryGeneration) {
    bootstrapRegistryGeneration = registryGeneration;
    bootstrapAttemptedChannelsByConfig.clear();
  }
  const configKey = resolveRuntimeConfigCacheKey(cfg);
  const existing = bootstrapAttemptedChannelsByConfig.get(configKey);
  if (existing) {
    bootstrapAttemptedChannelsByConfig.delete(configKey);
    bootstrapAttemptedChannelsByConfig.set(configKey, existing);
    return existing;
  }
  if (bootstrapAttemptedChannelsByConfig.size >= MAX_BOOTSTRAP_CONFIG_GENERATIONS) {
    const oldestConfigKey = bootstrapAttemptedChannelsByConfig.keys().next().value;
    if (oldestConfigKey !== void 0) bootstrapAttemptedChannelsByConfig.delete(oldestConfigKey);
  }
  const attemptedChannels = /* @__PURE__ */ new Set();
  bootstrapAttemptedChannelsByConfig.set(configKey, attemptedChannels);
  return attemptedChannels;
}
/** Clears the per-generation channel bootstrap retry guard for isolated tests. */
function resetOutboundChannelBootstrapStateForTests() {
  bootstrapRegistryGeneration = void 0;
  bootstrapAttemptedChannelsByConfig.clear();
}
function channelEntryCanSend(entry) {
  return Boolean(entry?.plugin?.outbound?.sendText ?? entry?.plugin?.message?.send?.text);
}
function findChannelEntry(registry, channel) {
  return registry?.channels?.find((entry) => entry?.plugin?.id === channel);
}
function canResolveSendCapableChannel(channel) {
  const activeChannelRegistry = getActivePluginChannelRegistry();
  if (channelEntryCanSend(findChannelEntry(activeChannelRegistry, channel))) return true;
  const activeRegistry = getActivePluginRegistry();
  if (activeRegistry && activeRegistry !== activeChannelRegistry)
    return channelEntryCanSend(findChannelEntry(activeRegistry, channel));
  return false;
}
/** Loads runtime plugins on demand when a selected outbound channel has only a setup shell. */
function bootstrapOutboundChannelPlugin(params) {
  const cfg = params.cfg;
  if (!cfg) return;
  if (canResolveSendCapableChannel(params.channel)) return;
  const attemptedChannels = resolveBootstrapAttemptedChannels(cfg);
  if (attemptedChannels.has(params.channel)) return;
  attemptedChannels.add(params.channel);
  const autoEnabled = applyPluginAutoEnable({ config: cfg });
  const defaultAgentId = resolveDefaultAgentId(autoEnabled.config);
  const workspaceDir = resolveAgentWorkspaceDir(autoEnabled.config, defaultAgentId);
  try {
    resolveRuntimePluginRegistry({
      config: autoEnabled.config,
      activationSourceConfig: cfg,
      autoEnabledReasons: autoEnabled.autoEnabledReasons,
      workspaceDir,
      runtimeOptions: { allowGatewaySubagentBinding: true },
    });
  } catch {}
  bootstrapRegistryGeneration = resolveBootstrapRegistryGeneration();
  if (!canResolveSendCapableChannel(params.channel))
    resolveBootstrapAttemptedChannels(cfg).add(params.channel);
}
//#endregion
export { resetOutboundChannelBootstrapStateForTests as n, bootstrapOutboundChannelPlugin as t };
