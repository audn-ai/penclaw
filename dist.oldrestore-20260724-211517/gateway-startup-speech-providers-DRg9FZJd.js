import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as mergeDeep } from "./deep-merge-DH7N3urv.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/tts/tts-auto-mode.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
const TTS_AUTO_MODES = /* @__PURE__ */ new Set(["off", "always", "inbound", "tagged"]);
/** Normalize an unknown value into a supported TTS auto mode. */
function normalizeTtsAutoMode(value) {
  if (typeof value !== "string") return;
  const normalized = normalizeOptionalLowercaseString(value);
  if (TTS_AUTO_MODES.has(normalized)) return normalized;
}
//#endregion
//#region src/tts/tts-config.ts
function resolveAgentTtsOverride(cfg, agentId) {
  if (!agentId || !Array.isArray(cfg.agents?.list)) return;
  const normalized = normalizeAgentId(agentId);
  return cfg.agents.list.find((entry) => normalizeAgentId(entry.id) === normalized)?.tts;
}
function resolveTtsConfigContext(contextOrAgentId) {
  return typeof contextOrAgentId === "string"
    ? { agentId: contextOrAgentId }
    : (contextOrAgentId ?? {});
}
function resolveRecordEntry(entries, id, normalize) {
  const normalizedId = normalizeOptionalString(id);
  if (!entries || !normalizedId) return;
  if (Object.hasOwn(entries, normalizedId)) return entries[normalizedId];
  const normalized = normalize(normalizedId);
  const key = Object.keys(entries).find((candidate) => normalize(candidate) === normalized);
  return key ? entries[key] : void 0;
}
function asTtsConfig(value) {
  return isRecord(value) ? value : void 0;
}
function asObjectRecord(value) {
  return isRecord(value) ? value : void 0;
}
function resolveChannelConfig(cfg, channelId) {
  if (!isRecord(cfg.channels)) return;
  const normalizedChannelId = normalizeOptionalString(channelId);
  if (!normalizedChannelId) return;
  return asObjectRecord(
    resolveRecordEntry(cfg.channels, normalizedChannelId, normalizeLowercaseStringOrEmpty),
  );
}
function resolveChannelTtsOverride(cfg, context) {
  return asTtsConfig(resolveChannelConfig(cfg, context.channelId)?.tts);
}
function resolveAccountTtsOverride(cfg, context) {
  const channelConfig = resolveChannelConfig(cfg, context.channelId);
  return asTtsConfig(
    asObjectRecord(
      resolveRecordEntry(
        isRecord(channelConfig?.accounts) ? channelConfig.accounts : void 0,
        context.accountId,
        normalizeAccountId,
      ),
    )?.tts,
  );
}
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
function resolveEffectiveTtsConfig(cfg, contextOrAgentId) {
  const context = resolveTtsConfigContext(contextOrAgentId);
  const base = cfg.messages?.tts ?? {};
  const agentOverride = resolveAgentTtsOverride(cfg, context.agentId);
  const channelOverride = resolveChannelTtsOverride(cfg, context);
  const accountOverride = resolveAccountTtsOverride(cfg, context);
  let merged = base;
  for (const override of [agentOverride, channelOverride, accountOverride])
    merged = mergeDeep(merged, override ?? {});
  return merged;
}
/** Resolve the configured TTS mode, defaulting to final-answer synthesis. */
function resolveConfiguredTtsMode(cfg, contextOrAgentId) {
  return resolveEffectiveTtsConfig(cfg, contextOrAgentId).mode ?? "final";
}
function resolveTtsPrefsPathValue(prefsPath) {
  if (prefsPath?.trim()) return resolveUserPath(prefsPath.trim());
  const envPath = process.env.OPENCLAW_TTS_PREFS?.trim();
  if (envPath) return resolveUserPath(envPath);
  return path.join(resolveConfigDir(process.env), "settings", "tts.json");
}
function readTtsPrefsAutoMode(prefsPath) {
  try {
    if (!existsSync(prefsPath)) return;
    const prefs = JSON.parse(readFileSync(prefsPath, "utf8"));
    const auto = normalizeTtsAutoMode(prefs.tts?.auto);
    if (auto) return auto;
    if (typeof prefs.tts?.enabled === "boolean") return prefs.tts.enabled ? "always" : "off";
  } catch {
    return;
  }
}
/** Return whether this payload should attempt TTS based on session, prefs, and config. */
function shouldAttemptTtsPayload(params) {
  const sessionAuto = normalizeTtsAutoMode(params.ttsAuto);
  if (sessionAuto) return sessionAuto !== "off";
  const raw = resolveEffectiveTtsConfig(params.cfg, params);
  const prefsAuto = readTtsPrefsAutoMode(resolveTtsPrefsPathValue(raw?.prefsPath));
  if (prefsAuto) return prefsAuto !== "off";
  const configuredAuto = normalizeTtsAutoMode(raw?.auto);
  if (configuredAuto) return configuredAuto !== "off";
  return raw?.enabled === true;
}
/** Return whether TTS directive markup should be stripped from user-visible text. */
function shouldCleanTtsDirectiveText(params) {
  if (!shouldAttemptTtsPayload(params)) return false;
  return resolveEffectiveTtsConfig(params.cfg, params).modelOverrides?.enabled !== false;
}
//#endregion
//#region src/plugins/gateway-startup-speech-providers.ts
const TTS_PROVIDER_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
  "auto",
  "enabled",
  "maxTextLength",
  "mode",
  "modelOverrides",
  "persona",
  "personas",
  "prefsPath",
  "provider",
  "providers",
  "summaryModel",
  "timeoutMs",
]);
/** Treats missing activation as enabled while honoring explicit false values. */
function isConfigActivationValueEnabled(value) {
  if (value === false) return false;
  if (isRecord(value) && value.enabled === false) return false;
  return true;
}
/** Normalizes configured TTS provider ids for startup plugin selection. */
function normalizeConfiguredSpeechProviderIdForStartup(value) {
  if (typeof value !== "string") return;
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) return;
  return normalized === "edge" ? "microsoft" : normalized;
}
/** Resolves provider activation from both canonical providers maps and legacy root keys. */
function resolveProviderConfigActivation(ttsConfig, providerId) {
  let fromProviders;
  if (isRecord(ttsConfig.providers)) {
    for (const [key, providerConfig] of Object.entries(ttsConfig.providers))
      if (normalizeConfiguredSpeechProviderIdForStartup(key) === providerId)
        fromProviders = isConfigActivationValueEnabled(providerConfig);
  }
  if (fromProviders !== void 0) return fromProviders;
  for (const [key, providerConfig] of Object.entries(ttsConfig)) {
    if (TTS_PROVIDER_CONFIG_RESERVED_KEYS.has(key) || !isRecord(providerConfig)) continue;
    if (normalizeConfiguredSpeechProviderIdForStartup(key) === providerId)
      return isConfigActivationValueEnabled(providerConfig);
  }
}
function addProviderIfEnabled(target, ttsConfig, providerId) {
  const normalized = normalizeConfiguredSpeechProviderIdForStartup(providerId);
  if (!normalized) return;
  if (resolveProviderConfigActivation(ttsConfig, normalized) !== false) target.add(normalized);
}
function findActivePersona(ttsConfig) {
  const personaId = normalizeOptionalLowercaseString(
    typeof ttsConfig.persona === "string" ? ttsConfig.persona : void 0,
  );
  if (!personaId || !isRecord(ttsConfig.personas)) return;
  for (const [id, persona] of Object.entries(ttsConfig.personas))
    if (normalizeOptionalLowercaseString(id) === personaId && isRecord(persona)) return persona;
}
function addActivePersonaProvider(target, ttsConfig) {
  const persona = findActivePersona(ttsConfig);
  if (!persona) return;
  const provider = normalizeConfiguredSpeechProviderIdForStartup(persona.provider);
  if (!provider) return;
  const rootActivation = resolveProviderConfigActivation(ttsConfig, provider);
  if ((resolveProviderConfigActivation(persona, provider) ?? rootActivation) !== false)
    target.add(provider);
}
function addConfiguredTtsProviderIds(target, value) {
  if (!isRecord(value)) return;
  addProviderIfEnabled(target, value, value.provider);
  addActivePersonaProvider(target, value);
  if (isRecord(value.providers)) {
    for (const [providerId, providerConfig] of Object.entries(value.providers))
      if (isConfigActivationValueEnabled(providerConfig))
        addProviderIfEnabled(target, value, providerId);
  }
  for (const [key, providerConfig] of Object.entries(value)) {
    if (TTS_PROVIDER_CONFIG_RESERVED_KEYS.has(key) || !isRecord(providerConfig)) continue;
    if (isConfigActivationValueEnabled(providerConfig)) addProviderIfEnabled(target, value, key);
  }
}
/** Collects TTS provider ids referenced by root, agent, channel, account, and plugin config. */
function collectConfiguredSpeechProviderIds(config) {
  const configured = /* @__PURE__ */ new Set();
  addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config));
  const agents = config.agents;
  if (isRecord(agents) && Array.isArray(agents.list)) {
    for (const agent of agents.list)
      if (isRecord(agent))
        if (typeof agent.id === "string")
          addConfiguredTtsProviderIds(
            configured,
            resolveEffectiveTtsConfig(config, { agentId: agent.id }),
          );
        else addConfiguredTtsProviderIds(configured, agent.tts);
  }
  const channels = config.channels;
  if (isRecord(channels))
    for (const [channelId, channelConfig] of Object.entries(channels)) {
      if (!isRecord(channelConfig)) continue;
      addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, { channelId }));
      if (isRecord(channelConfig.voice))
        addConfiguredTtsProviderIds(configured, channelConfig.voice.tts);
      if (isRecord(channelConfig.accounts))
        for (const [accountId, accountConfig] of Object.entries(channelConfig.accounts)) {
          if (!isRecord(accountConfig)) continue;
          addConfiguredTtsProviderIds(
            configured,
            resolveEffectiveTtsConfig(config, {
              channelId,
              accountId,
            }),
          );
          if (isRecord(accountConfig.voice))
            addConfiguredTtsProviderIds(configured, accountConfig.voice.tts);
        }
    }
  const pluginEntries = config.plugins?.entries;
  if (isRecord(pluginEntries)) {
    for (const entry of Object.values(pluginEntries))
      if (isRecord(entry) && isRecord(entry.config))
        addConfiguredTtsProviderIds(configured, entry.config.tts);
  }
  return configured;
}
//#endregion
export {
  shouldAttemptTtsPayload as a,
  normalizeTtsAutoMode as c,
  resolveEffectiveTtsConfig as i,
  normalizeConfiguredSpeechProviderIdForStartup as n,
  shouldCleanTtsDirectiveText as o,
  resolveConfiguredTtsMode as r,
  TTS_AUTO_MODES as s,
  collectConfiguredSpeechProviderIds as t,
};
