import chalk from "chalk";
import {
  c as resolveDefaultAgentId,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import "./agent-scope-y9xQv_q1.js";
import { t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current-DHvJV_fL.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { s as formatFastModeValue } from "./fast-mode-BhVbWk_p.js";
import { t as resolveFastModeState } from "./fast-mode-C6dQXWoG.js";
import "./logging-C8NGWOYr.js";
import { a as getResolvedLoggerSettings } from "./logger-BUux_Jpv.js";
import { i as modelKey, r as legacyModelKey } from "./model-selection-normalize-BoKGJiBx.js";
import {
  r as buildConfiguredModelCatalog,
  v as resolveConfiguredModelRef,
} from "./model-selection-shared-BliwFXJy.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-C_eCEq4B.js";
import { s as normalizeSortedUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/gateway/server-startup-log.ts
/** Emit startup summary lines after Gateway bind and plugin loading complete. */
async function logGatewayStartup(params) {
  const { provider: agentProvider, model: agentModel } = resolveConfiguredModelRef({
    cfg: params.cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const modelRef = `${agentProvider}/${agentModel}`;
  const modelDetails = formatAgentModelStartupDetails({
    cfg: params.cfg,
    provider: agentProvider,
    model: agentModel,
  });
  params.log.info(`agent model: ${modelRef} (${modelDetails})`, {
    consoleMessage: `agent model: ${chalk.whiteBright(modelRef)} (${modelDetails})`,
  });
  const startupDurationMs =
    typeof params.startupStartedAt === "number" ? Date.now() - params.startupStartedAt : null;
  const startupDurationLabel =
    startupDurationMs == null ? null : `${(startupDurationMs / 1e3).toFixed(1)}s`;
  params.log.info(
    `http server listening (${formatReadyDetails(params.loadedPluginIds, startupDurationLabel)})`,
  );
  params.log.info(`log file: ${getResolvedLoggerSettings().file}`);
  if (params.isNixMode) params.log.info("gateway: running in Nix mode (config managed externally)");
  for (const warning of await collectConfiguredChannelStartupWarnings({
    cfg: params.cfg,
    activationSourceConfig: params.activationSourceConfig,
  }))
    params.log.warn(warning);
  const enabledDangerousFlags =
    collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(params.cfg) ??
    (await import("./dangerous-config-flags-BP-d_N7U.js")).collectEnabledInsecureOrDangerousFlags(
      params.cfg,
    );
  if (enabledDangerousFlags.length > 0) {
    const warning = `security warning: dangerous config flags enabled: ${enabledDangerousFlags.join(", ")}. Run \`openclaw security audit\`.`;
    params.log.warn(warning);
  }
}
/** Normalize model thinking values that are useful in the compact startup log. */
function normalizeStartupThinkLevel(value) {
  return value === "off" ||
    value === "minimal" ||
    value === "low" ||
    value === "medium" ||
    value === "high" ||
    value === "xhigh" ||
    value === "adaptive" ||
    value === "max" ||
    value === "ultra"
    ? value
    : void 0;
}
/** Resolve explicit thinking overrides from agent defaults and per-model config. */
function resolveExplicitStartupThinking(params) {
  const models = params.cfg.agents?.defaults?.models;
  const canonicalKey = modelKey(params.provider, params.model);
  const legacyKey = legacyModelKey(params.provider, params.model);
  return (
    normalizeStartupThinkLevel(params.defaultAgentThinking) ??
    normalizeStartupThinkLevel(models?.[canonicalKey]?.params?.thinking) ??
    normalizeStartupThinkLevel(legacyKey ? models?.[legacyKey]?.params?.thinking : void 0) ??
    normalizeStartupThinkLevel(params.cfg.agents?.defaults?.thinkingDefault)
  );
}
/** True when a configured catalog entry disables reasoning for the startup model. */
function isConfiguredReasoningDisabled(params) {
  return params.catalog.some(
    (entry) =>
      entry.provider === params.provider && entry.id === params.model && entry.reasoning === false,
  );
}
/** Format model thinking and fast-mode details for the Gateway startup banner. */
function formatAgentModelStartupDetails(params) {
  const defaultAgentId = resolveDefaultAgentId(params.cfg);
  const defaultAgentConfig = resolveAgentConfig(params.cfg, defaultAgentId);
  let thinking = resolveExplicitStartupThinking({
    cfg: params.cfg,
    provider: params.provider,
    model: params.model,
    defaultAgentThinking: defaultAgentConfig?.thinkingDefault,
  });
  if (thinking === void 0) {
    const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
    if (
      isConfiguredReasoningDisabled({
        catalog: configuredCatalog,
        provider: params.provider,
        model: params.model,
      })
    )
      thinking = "off";
    else {
      const resolvedThinking = resolveThinkingDefault({
        cfg: params.cfg,
        provider: params.provider,
        model: params.model,
        catalog: configuredCatalog,
      });
      thinking = resolvedThinking === "off" ? "medium" : resolvedThinking;
    }
  }
  const fast = resolveFastModeState({
    cfg: params.cfg,
    provider: params.provider,
    model: params.model,
    agentId: defaultAgentId,
  });
  return `thinking=${thinking}, fast=${formatFastModeValue(fast.mode)}`;
}
async function collectConfiguredChannelStartupWarnings(params) {
  const [blockerModule, presencePolicyModule, pluginRegistryModule] = await Promise.all([
    import("./channel-plugin-blockers-CAcz0cNV.js"),
    import("./channel-presence-policy-DevdjOez.js"),
    import("./plugin-registry-Auj_NA8-.js"),
  ]);
  const manifestRegistry = pluginRegistryModule.loadPluginManifestRegistryForPluginRegistry({
    config: params.cfg,
    env: process.env,
    includeDisabled: true,
  });
  const hits = blockerModule.scanConfiguredChannelPluginBlockers(
    params.cfg,
    process.env,
    params.activationSourceConfig,
    { manifestRecords: manifestRegistry.plugins },
  );
  const blockerWarnings = blockerModule
    .collectConfiguredChannelPluginBlockerWarnings(hits)
    .map((warning) => `configured channel warning: ${warning.replace(/^[-]\s*/u, "")}`);
  const missingOwnerWarnings = presencePolicyModule
    .resolveConfiguredChannelPresencePolicy({
      config: params.cfg,
      activationSourceConfig: params.activationSourceConfig,
      includePersistedAuthState: false,
      manifestRecords: manifestRegistry.plugins,
    })
    .filter((entry) => !entry.effective && entry.blockedReasons.includes("no-channel-owner"))
    .map(formatConfiguredChannelMissingOwnerStartupWarning);
  return [...blockerWarnings, ...missingOwnerWarnings];
}
function formatConfiguredChannelMissingOwnerStartupWarning(entry) {
  return `configured channel warning: channels.${sanitizeForLog(entry.channelId)} is configured but no channel plugin is installed or loadable (${normalizeSortedUniqueStringEntries(entry.blockedReasons).join(", ")}). Run \`openclaw doctor --fix\` or install the channel plugin before relying on this channel.`;
}
/** Format plugin count/list and optional startup duration for the ready log line. */
function formatReadyDetails(loadedPluginIds, startupDurationLabel) {
  const pluginIds = normalizeSortedUniqueStringEntries(loadedPluginIds);
  const pluginSummary =
    pluginIds.length === 0
      ? "0 plugins"
      : `${pluginIds.length} ${pluginIds.length === 1 ? "plugin" : "plugins"}: ${pluginIds.join(", ")}`;
  if (!startupDurationLabel) return pluginSummary;
  return pluginIds.length === 0
    ? `${pluginSummary}, ${startupDurationLabel}`
    : `${pluginSummary}; ${startupDurationLabel}`;
}
//#endregion
export { logGatewayStartup };
