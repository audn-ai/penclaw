import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import {
  i as asOptionalRecord,
  o as isRecord,
  s as readStringField,
} from "../../record-coerce-DHZ4bFlT.js";
//#region extensions/voice-call/src/config-migration.ts
const asObject = asOptionalRecord;
const getString = readStringField;
/** Read finite numeric config values. */
function getNumber(obj, key) {
  const value = obj?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Merge legacy provider-specific values into the canonical providers map. */
function mergeProviderConfig(providersValue, providerId, compatValues) {
  if (Object.keys(compatValues).length === 0) return asObject(providersValue);
  const providers = asObject(providersValue) ?? {};
  const existing = asObject(providers[providerId]) ?? {};
  return {
    ...providers,
    [providerId]: {
      ...existing,
      ...compatValues,
    },
  };
}
/** Migrate legacy voice-call config input to the current canonical shape. */
function migrateVoiceCallLegacyConfigInput(params) {
  const raw = asObject(params.value) ?? {};
  const realtime = asObject(raw.realtime);
  const realtimeAgentContext = asObject(realtime?.agentContext);
  const twilio = asObject(raw.twilio);
  const streaming = asObject(raw.streaming);
  const configPathPrefix = params.configPathPrefix ?? "plugins.entries.voice-call.config";
  const legacyStreamingOpenAICompat = {};
  const streamingOpenAIApiKey = getString(streaming, "openaiApiKey");
  if (streamingOpenAIApiKey) legacyStreamingOpenAICompat.apiKey = streamingOpenAIApiKey;
  const streamingSttModel = getString(streaming, "sttModel");
  if (streamingSttModel) legacyStreamingOpenAICompat.model = streamingSttModel;
  const streamingSilenceDurationMs = getNumber(streaming, "silenceDurationMs");
  if (streamingSilenceDurationMs !== void 0)
    legacyStreamingOpenAICompat.silenceDurationMs = streamingSilenceDurationMs;
  const streamingVadThreshold = getNumber(streaming, "vadThreshold");
  if (streamingVadThreshold !== void 0)
    legacyStreamingOpenAICompat.vadThreshold = streamingVadThreshold;
  const streamingProvider = getString(streaming, "provider");
  const legacyStreamingProvider = getString(streaming, "sttProvider");
  const normalizedStreaming = streaming
    ? {
        ...streaming,
        provider: streamingProvider ?? legacyStreamingProvider,
        providers: mergeProviderConfig(streaming.providers, "openai", legacyStreamingOpenAICompat),
      }
    : void 0;
  if (normalizedStreaming) {
    delete normalizedStreaming.sttProvider;
    delete normalizedStreaming.openaiApiKey;
    delete normalizedStreaming.sttModel;
    delete normalizedStreaming.silenceDurationMs;
    delete normalizedStreaming.vadThreshold;
  }
  const normalizedTwilio = twilio ? { ...twilio } : void 0;
  if (normalizedTwilio) delete normalizedTwilio.from;
  const normalizedRealtimeAgentContext = realtimeAgentContext
    ? { ...realtimeAgentContext }
    : void 0;
  if (normalizedRealtimeAgentContext) delete normalizedRealtimeAgentContext.includeSystemPrompt;
  const normalizedRealtime = realtime
    ? {
        ...realtime,
        agentContext: normalizedRealtimeAgentContext ?? realtime.agentContext,
      }
    : void 0;
  const config = {
    ...raw,
    provider: raw.provider === "log" ? "mock" : raw.provider,
    fromNumber: raw.fromNumber ?? (typeof twilio?.from === "string" ? twilio.from : void 0),
    twilio: normalizedTwilio,
    streaming: normalizedStreaming,
    realtime: normalizedRealtime,
  };
  const changes = [];
  if (raw.provider === "log") changes.push(`Moved ${configPathPrefix}.provider "log" → "mock".`);
  if (typeof twilio?.from === "string" && typeof raw.fromNumber !== "string")
    changes.push(`Moved ${configPathPrefix}.twilio.from → ${configPathPrefix}.fromNumber.`);
  if (typeof streaming?.sttProvider === "string")
    changes.push(
      `Moved ${configPathPrefix}.streaming.sttProvider → ${configPathPrefix}.streaming.provider.`,
    );
  if (typeof streaming?.openaiApiKey === "string")
    changes.push(
      `Moved ${configPathPrefix}.streaming.openaiApiKey → ${configPathPrefix}.streaming.providers.openai.apiKey.`,
    );
  if (typeof streaming?.sttModel === "string")
    changes.push(
      `Moved ${configPathPrefix}.streaming.sttModel → ${configPathPrefix}.streaming.providers.openai.model.`,
    );
  if (getNumber(streaming, "silenceDurationMs") !== void 0)
    changes.push(
      `Moved ${configPathPrefix}.streaming.silenceDurationMs → ${configPathPrefix}.streaming.providers.openai.silenceDurationMs.`,
    );
  else if (typeof streaming?.silenceDurationMs === "number")
    changes.push(`Removed invalid ${configPathPrefix}.streaming.silenceDurationMs.`);
  if (getNumber(streaming, "vadThreshold") !== void 0)
    changes.push(
      `Moved ${configPathPrefix}.streaming.vadThreshold → ${configPathPrefix}.streaming.providers.openai.vadThreshold.`,
    );
  else if (typeof streaming?.vadThreshold === "number")
    changes.push(`Removed invalid ${configPathPrefix}.streaming.vadThreshold.`);
  if (realtimeAgentContext && Object.hasOwn(realtimeAgentContext, "includeSystemPrompt"))
    changes.push(`Removed ${configPathPrefix}.realtime.agentContext.includeSystemPrompt.`);
  return {
    config,
    changes,
  };
}
//#endregion
//#region extensions/voice-call/setup-api.ts
/** Migrate voice-call plugin config inside the full OpenClaw config object. */
function migrateVoiceCallPluginConfig(config) {
  const rawVoiceCallConfig = config.plugins?.entries?.["voice-call"]?.config;
  if (!isRecord(rawVoiceCallConfig)) return null;
  const migration = migrateVoiceCallLegacyConfigInput({
    value: rawVoiceCallConfig,
    configPathPrefix: "plugins.entries.voice-call.config",
  });
  if (migration.changes.length === 0) return null;
  const plugins = structuredClone(config.plugins ?? {});
  const entries = { ...plugins.entries };
  entries["voice-call"] = {
    ...(isRecord(entries["voice-call"]) ? entries["voice-call"] : {}),
    config: migration.config,
  };
  plugins.entries = entries;
  return {
    config: {
      ...config,
      plugins,
    },
    changes: migration.changes,
  };
}
/** Setup plugin entry that registers voice-call config migrations. */
var setup_api_default = definePluginEntry({
  id: "voice-call",
  name: "Voice Call Setup",
  description: "Lightweight Voice Call setup hooks",
  register(api) {
    api.registerConfigMigration((config) => migrateVoiceCallPluginConfig(config));
  },
});
//#endregion
export { setup_api_default as default };
