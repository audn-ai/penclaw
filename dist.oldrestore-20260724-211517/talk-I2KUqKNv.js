import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString, i as normalizeFastMode } from "./string-coerce-DW4mBlAt.js";
import "./utils-DtcDeqWS.js";
import { s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
import "./thinking-CVcRbjTC.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/config/talk.ts
function normalizeTalkSecretInput(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : void 0;
  }
  return coerceSecretRef(value) ?? void 0;
}
function normalizeSilenceTimeoutMs(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return;
  return value;
}
function normalizeVadThreshold(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) return;
  return value;
}
function normalizePositiveInteger(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return;
  return value;
}
function normalizeNonNegativeInteger(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return;
  return value;
}
function buildLegacyTalkProviderCompat(value) {
  const provider = {};
  for (const key of ["voiceId", "voiceAliases", "modelId", "outputFormat"])
    if (value[key] !== void 0) provider[key] = value[key];
  const apiKey = normalizeTalkSecretInput(value.apiKey);
  if (apiKey !== void 0) provider.apiKey = apiKey;
  return Object.keys(provider).length > 0 ? provider : void 0;
}
function normalizeTalkProviderConfig(value) {
  if (!isRecord(value)) return;
  const provider = {};
  for (const [key, raw] of Object.entries(value)) {
    if (raw === void 0) continue;
    if (key === "apiKey") {
      const normalized = normalizeTalkSecretInput(raw);
      if (normalized !== void 0) provider.apiKey = normalized;
      continue;
    }
    provider[key] = raw;
  }
  return Object.keys(provider).length > 0 ? provider : void 0;
}
function normalizeTalkProviders(value) {
  if (!isRecord(value)) return;
  const providers = {};
  for (const [rawProviderId, providerConfig] of Object.entries(value)) {
    const providerId = normalizeOptionalString(rawProviderId);
    if (!providerId) continue;
    const normalizedProvider = normalizeTalkProviderConfig(providerConfig);
    if (!normalizedProvider) continue;
    providers[providerId] = {
      ...providers[providerId],
      ...normalizedProvider,
    };
  }
  return Object.keys(providers).length > 0 ? providers : void 0;
}
function normalizeTalkRealtimeConfig(value) {
  if (!isRecord(value)) return;
  const source = value;
  const normalized = {};
  const provider = normalizeOptionalString(source.provider);
  if (provider) normalized.provider = provider;
  const providers = normalizeTalkProviders(source.providers);
  if (providers) normalized.providers = providers;
  const model = normalizeOptionalString(source.model);
  if (model) normalized.model = model;
  const voice = normalizeOptionalString(source.voice);
  const speakerVoice = normalizeOptionalString(source.speakerVoice) ?? voice;
  const speakerVoiceId = normalizeOptionalString(source.speakerVoiceId);
  if (speakerVoice) normalized.speakerVoice = speakerVoice;
  if (speakerVoiceId) normalized.speakerVoiceId = speakerVoiceId;
  if (voice) normalized.voice = voice;
  const instructions = normalizeOptionalString(source.instructions);
  if (instructions) normalized.instructions = instructions;
  if (source.mode === "realtime" || source.mode === "stt-tts" || source.mode === "transcription")
    normalized.mode = source.mode;
  if (
    source.transport === "webrtc" ||
    source.transport === "provider-websocket" ||
    source.transport === "gateway-relay" ||
    source.transport === "managed-room"
  )
    normalized.transport = source.transport;
  const vadThreshold = normalizeVadThreshold(source.vadThreshold);
  if (vadThreshold !== void 0) normalized.vadThreshold = vadThreshold;
  const silenceDurationMs = normalizePositiveInteger(source.silenceDurationMs);
  if (silenceDurationMs !== void 0) normalized.silenceDurationMs = silenceDurationMs;
  const prefixPaddingMs = normalizeNonNegativeInteger(source.prefixPaddingMs);
  if (prefixPaddingMs !== void 0) normalized.prefixPaddingMs = prefixPaddingMs;
  const reasoningEffort = normalizeOptionalString(source.reasoningEffort);
  if (reasoningEffort) normalized.reasoningEffort = reasoningEffort;
  if (
    source.brain === "agent-consult" ||
    source.brain === "direct-tools" ||
    source.brain === "none"
  )
    normalized.brain = source.brain;
  if (
    source.consultRouting === "provider-direct" ||
    source.consultRouting === "force-agent-consult"
  )
    normalized.consultRouting = source.consultRouting;
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function activeProviderFromTalk(talk) {
  const provider = normalizeOptionalString(talk.provider);
  const providers = talk.providers;
  if (provider) {
    if (providers && !Object.hasOwn(providers, provider)) return;
    return provider;
  }
  const providerIds = providers ? Object.keys(providers) : [];
  return providerIds.length === 1 ? providerIds[0] : void 0;
}
/**
 * Normalize persisted Talk config into the canonical provider/providers shape.
 * Legacy flat provider fields are ignored here so core config stays provider-agnostic.
 */
function normalizeTalkSection(value) {
  if (!isRecord(value)) return;
  const source = value;
  const normalized = {};
  const speechLocale = normalizeOptionalString(source.speechLocale);
  if (speechLocale) normalized.speechLocale = speechLocale;
  if (typeof source.interruptOnSpeech === "boolean")
    normalized.interruptOnSpeech = source.interruptOnSpeech;
  const consultThinkingLevel = normalizeThinkLevel(
    normalizeOptionalString(source.consultThinkingLevel),
  );
  if (consultThinkingLevel) normalized.consultThinkingLevel = consultThinkingLevel;
  const rawConsultFastMode = source.consultFastMode;
  const consultFastMode =
    typeof rawConsultFastMode === "boolean" || typeof rawConsultFastMode === "string"
      ? normalizeFastMode(rawConsultFastMode)
      : void 0;
  if (typeof consultFastMode === "boolean") normalized.consultFastMode = consultFastMode;
  const silenceTimeoutMs = normalizeSilenceTimeoutMs(source.silenceTimeoutMs);
  if (silenceTimeoutMs !== void 0) normalized.silenceTimeoutMs = silenceTimeoutMs;
  const providers = normalizeTalkProviders(source.providers);
  const realtime = normalizeTalkRealtimeConfig(source.realtime);
  const provider = normalizeOptionalString(source.provider);
  if (providers) normalized.providers = providers;
  if (realtime) normalized.realtime = realtime;
  if (provider) normalized.provider = provider;
  return Object.keys(normalized).length > 0 ? normalized : void 0;
}
/** Return a config copy with `talk` normalized when a valid Talk section is present. */
function normalizeTalkConfig(config) {
  if (!config.talk) return config;
  const normalizedTalk = normalizeTalkSection(config.talk);
  if (!normalizedTalk) return config;
  return {
    ...config,
    talk: normalizedTalk,
  };
}
/**
 * Resolve the single active Talk speech provider and its provider-owned config.
 * Ambiguous multi-provider config stays unresolved until `talk.provider` names one.
 */
function resolveActiveTalkProviderConfig(talk) {
  const normalizedTalk = normalizeTalkSection(talk);
  if (!normalizedTalk) return;
  const provider = activeProviderFromTalk(normalizedTalk);
  if (!provider) return;
  return {
    provider,
    config: normalizedTalk.providers?.[provider] ?? {},
  };
}
/**
 * Build the gateway `talk.config` payload from persisted config.
 * The response includes canonical provider data plus the resolved provider when selection is unambiguous.
 */
function buildTalkConfigResponse(value) {
  if (!isRecord(value)) return;
  const normalized = normalizeTalkSection(value);
  const legacyCompat = buildLegacyTalkProviderCompat(value);
  if (!normalized && !legacyCompat) return;
  const payload = {};
  if (typeof normalized?.interruptOnSpeech === "boolean")
    payload.interruptOnSpeech = normalized.interruptOnSpeech;
  if (typeof normalized?.silenceTimeoutMs === "number")
    payload.silenceTimeoutMs = normalized.silenceTimeoutMs;
  if (typeof normalized?.consultThinkingLevel === "string")
    payload.consultThinkingLevel = normalized.consultThinkingLevel;
  if (typeof normalized?.consultFastMode === "boolean")
    payload.consultFastMode = normalized.consultFastMode;
  if (typeof normalized?.speechLocale === "string") payload.speechLocale = normalized.speechLocale;
  if (normalized?.providers && Object.keys(normalized.providers).length > 0)
    payload.providers = normalized.providers;
  if (normalized?.realtime && Object.keys(normalized.realtime).length > 0)
    payload.realtime = normalized.realtime;
  const resolved =
    resolveActiveTalkProviderConfig(normalized) ??
    (legacyCompat
      ? {
          provider: "elevenlabs",
          config: legacyCompat,
        }
      : void 0);
  const activeProvider = resolved?.provider;
  if (activeProvider) payload.provider = activeProvider;
  if (resolved) payload.resolved = resolved;
  return Object.keys(payload).length > 0 ? payload : void 0;
}
//#endregion
export {
  resolveActiveTalkProviderConfig as i,
  normalizeTalkConfig as n,
  normalizeTalkSection as r,
  buildTalkConfigResponse as t,
};
