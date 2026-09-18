import { n as asNullableRecord } from "../../record-coerce-DHZ4bFlT.js";
import { s as normalizeOptionalLowercaseString } from "../../string-coerce-DW4mBlAt.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
//#region extensions/google-meet/src/config-compat.ts
function hasOwn(record, key) {
  return Object.hasOwn(record, key);
}
function hasLegacyGoogleRealtimeProvider(value) {
  const realtime = asNullableRecord(value);
  if (!realtime || normalizeOptionalLowercaseString(realtime.provider) !== "google") return false;
  return !hasOwn(realtime, "voiceProvider") || !hasOwn(realtime, "transcriptionProvider");
}
const legacyConfigRules = [
  {
    path: ["plugins", "entries", "google-meet", "config", "realtime"],
    message:
      'plugins.entries.google-meet.config.realtime.provider="google" is legacy for Gemini Live bidi mode; use realtime.voiceProvider="google" and realtime.transcriptionProvider="openai". Run "openclaw doctor --fix".',
    match: hasLegacyGoogleRealtimeProvider,
  },
];
function migrateGoogleMeetLegacyRealtimeProvider(config) {
  const rawRealtime = asNullableRecord(
    asNullableRecord(asNullableRecord(config.plugins?.entries?.["google-meet"])?.config)?.realtime,
  );
  if (!rawRealtime || !hasLegacyGoogleRealtimeProvider(rawRealtime)) return null;
  const nextConfig = structuredClone(config);
  const nextPlugins = asNullableRecord(nextConfig.plugins) ?? {};
  nextConfig.plugins = nextPlugins;
  const nextEntries = asNullableRecord(nextPlugins.entries) ?? {};
  nextPlugins.entries = nextEntries;
  const nextEntry = asNullableRecord(nextEntries["google-meet"]) ?? {};
  nextEntries["google-meet"] = nextEntry;
  const nextPluginConfig = asNullableRecord(nextEntry.config) ?? {};
  nextEntry.config = nextPluginConfig;
  const nextRealtime = asNullableRecord(nextPluginConfig.realtime) ?? {};
  nextPluginConfig.realtime = nextRealtime;
  nextRealtime.provider = "openai";
  if (!hasOwn(nextRealtime, "transcriptionProvider")) nextRealtime.transcriptionProvider = "openai";
  if (!hasOwn(nextRealtime, "voiceProvider")) nextRealtime.voiceProvider = "google";
  return {
    config: nextConfig,
    changes: [
      'Moved Google Meet legacy realtime.provider="google" intent to realtime.voiceProvider="google" and realtime.transcriptionProvider="openai".',
    ],
  };
}
function normalizeCompatibilityConfig({ cfg }) {
  return (
    migrateGoogleMeetLegacyRealtimeProvider(cfg) ?? {
      config: cfg,
      changes: [],
    }
  );
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
