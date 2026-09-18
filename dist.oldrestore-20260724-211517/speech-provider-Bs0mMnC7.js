import { c as asFiniteNumberInRange } from "./number-coercion-CJQ8TR--.js";
import { n as asObject } from "./provider-http-errors-DLMRBkZU.js";
import { t as parseSpeechDirectiveNumberOverride } from "./speech-core-CWj6o89Y.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as volcengineTTS } from "./tts-BQ8xfQqh.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./secret-input-D1aG0n6v.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
//#region extensions/volcengine/speech-provider.ts
const DEFAULT_VOICE = "en_female_anna_mars_bigtts";
const DEFAULT_CLUSTER = "volcano_tts";
const DEFAULT_RESOURCE_ID = "seed-tts-1.0";
const DEFAULT_APP_KEY = "aGjiRDfUWi";
const VOLCENGINE_VOICES = [
  "en_female_anna_mars_bigtts",
  "en_male_adam_mars_bigtts",
  "en_female_sarah_mars_bigtts",
  "en_male_smith_mars_bigtts",
  "zh_female_cancan_mars_bigtts",
  "zh_female_qingxinnvsheng_mars_bigtts",
  "zh_female_linjia_mars_bigtts",
  "zh_male_wennuanahu_moon_bigtts",
  "zh_male_shaonianzixin_moon_bigtts",
  "zh_female_shuangkuaisisi_moon_bigtts",
];
function normalizeSpeedRatio(value) {
  return asFiniteNumberInRange(value, {
    min: 0.2,
    max: 3,
  });
}
function normalizeVolcengineProviderConfig(rawConfig) {
  const raw = asObject(asObject(rawConfig.providers)?.volcengine) ?? asObject(rawConfig.volcengine);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey,
      path: "messages.tts.providers.volcengine.apiKey",
    }),
    appId: normalizeOptionalString(raw?.appId),
    token: normalizeResolvedSecretInputString({
      value: raw?.token,
      path: "messages.tts.providers.volcengine.token",
    }),
    voice:
      normalizeOptionalString(raw?.voice) ??
      normalizeOptionalString(process.env.VOLCENGINE_TTS_VOICE) ??
      DEFAULT_VOICE,
    cluster:
      normalizeOptionalString(raw?.cluster) ??
      normalizeOptionalString(process.env.VOLCENGINE_TTS_CLUSTER) ??
      DEFAULT_CLUSTER,
    resourceId:
      normalizeOptionalString(raw?.resourceId) ??
      normalizeOptionalString(process.env.VOLCENGINE_TTS_RESOURCE_ID) ??
      DEFAULT_RESOURCE_ID,
    appKey:
      normalizeOptionalString(raw?.appKey) ??
      normalizeOptionalString(process.env.VOLCENGINE_TTS_APP_KEY) ??
      DEFAULT_APP_KEY,
    baseUrl:
      normalizeOptionalString(raw?.baseUrl) ??
      normalizeOptionalString(process.env.VOLCENGINE_TTS_BASE_URL),
    speedRatio: normalizeSpeedRatio(raw?.speedRatio),
    emotion: normalizeOptionalString(raw?.emotion),
  };
}
function resolveSeedSpeechApiKey(configApiKey) {
  return (
    configApiKey ??
    normalizeOptionalString(process.env.VOLCENGINE_TTS_API_KEY) ??
    normalizeOptionalString(process.env.BYTEPLUS_SEED_SPEECH_API_KEY)
  );
}
function readProviderConfig(config) {
  const normalized = normalizeVolcengineProviderConfig({});
  return {
    apiKey:
      normalizeResolvedSecretInputString({
        value: config.apiKey,
        path: "messages.tts.providers.volcengine.apiKey",
      }) ?? normalized.apiKey,
    appId: normalizeOptionalString(config.appId) ?? normalized.appId,
    token: normalizeOptionalString(config.token) ?? normalized.token,
    voice: normalizeOptionalString(config.voice) ?? normalized.voice,
    cluster: normalizeOptionalString(config.cluster) ?? normalized.cluster,
    resourceId: normalizeOptionalString(config.resourceId) ?? normalized.resourceId,
    appKey: normalizeOptionalString(config.appKey) ?? normalized.appKey,
    baseUrl: normalizeOptionalString(config.baseUrl) ?? normalized.baseUrl,
    speedRatio: normalizeSpeedRatio(config.speedRatio) ?? normalized.speedRatio,
    emotion: normalizeOptionalString(config.emotion) ?? normalized.emotion,
  };
}
function readVolcengineOverrides(overrides) {
  if (!overrides) return {};
  return {
    voice: normalizeOptionalString(overrides.voice),
    speedRatio: normalizeSpeedRatio(overrides.speedRatio),
    emotion: normalizeOptionalString(overrides.emotion),
  };
}
function parseDirectiveToken(ctx) {
  switch (ctx.key) {
    case "voice":
    case "volcengine_voice":
    case "volcenginevoice":
      if (!ctx.policy.allowVoice) return { handled: true };
      return {
        handled: true,
        overrides: {
          ...ctx.currentOverrides,
          voice: ctx.value,
        },
      };
    case "speed":
    case "speedratio":
    case "speed_ratio":
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "speedRatio",
        range: {
          min: 0.2,
          max: 3,
        },
        warning: (value) => `invalid Volcengine speedRatio "${value}"`,
        mergeCurrentOverrides: true,
      });
    case "emotion":
      if (!ctx.policy.allowVoiceSettings) return { handled: true };
      return {
        handled: true,
        overrides: {
          ...ctx.currentOverrides,
          emotion: ctx.value,
        },
      };
    default:
      return { handled: false };
  }
}
function buildVolcengineSpeechProvider() {
  return {
    id: "volcengine",
    label: "Volcengine",
    autoSelectOrder: 90,
    aliases: ["bytedance", "doubao"],
    voices: VOLCENGINE_VOICES,
    resolveConfig: ({ rawConfig }) => normalizeVolcengineProviderConfig(rawConfig),
    parseDirectiveToken,
    listVoices: async () =>
      VOLCENGINE_VOICES.map((v) => ({
        id: v,
        name: v.replace(/^(?:en|zh)_(female|male)_/, "").replace(/_.*$/, ""),
        locale: v.startsWith("en_") ? "en-US" : "zh-CN",
        gender: v.includes("_female_") ? "female" : "male",
      })),
    isConfigured: ({ providerConfig }) => {
      const cfg = readProviderConfig(providerConfig);
      return Boolean(
        resolveSeedSpeechApiKey(cfg.apiKey) ||
        ((cfg.appId || process.env.VOLCENGINE_TTS_APPID) &&
          (cfg.token || process.env.VOLCENGINE_TTS_TOKEN)),
      );
    },
    synthesize: async (req) => {
      const cfg = readProviderConfig(req.providerConfig);
      const overrides = readVolcengineOverrides(req.providerOverrides);
      const apiKey = resolveSeedSpeechApiKey(cfg.apiKey);
      const appId = cfg.appId || process.env.VOLCENGINE_TTS_APPID;
      const token = cfg.token || process.env.VOLCENGINE_TTS_TOKEN;
      if (!apiKey && (!appId || !token))
        throw new Error(
          "Volcengine TTS credentials missing. Set VOLCENGINE_TTS_API_KEY, BYTEPLUS_SEED_SPEECH_API_KEY, or legacy VOLCENGINE_TTS_APPID and VOLCENGINE_TTS_TOKEN.",
        );
      const isVoiceNote = req.target === "voice-note";
      const encoding = isVoiceNote ? "ogg_opus" : "mp3";
      return {
        audioBuffer: await volcengineTTS({
          text: req.text,
          apiKey,
          appId,
          token,
          voice: overrides.voice ?? cfg.voice,
          cluster: cfg.cluster,
          resourceId: cfg.resourceId,
          appKey: cfg.appKey,
          baseUrl: cfg.baseUrl,
          speedRatio: overrides.speedRatio ?? cfg.speedRatio,
          emotion: overrides.emotion ?? cfg.emotion,
          encoding,
          timeoutMs: req.timeoutMs,
        }),
        outputFormat: encoding === "ogg_opus" ? "opus" : "mp3",
        fileExtension: encoding === "ogg_opus" ? ".opus" : ".mp3",
        voiceCompatible: isVoiceNote,
      };
    },
  };
}
//#endregion
export { buildVolcengineSpeechProvider as t };
