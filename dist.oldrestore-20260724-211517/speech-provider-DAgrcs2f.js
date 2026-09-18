import { c as asFiniteNumberInRange } from "./number-coercion-CJQ8TR--.js";
import { i as isProviderAuthProfileConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./secret-input-D1aG0n6v.js";
import {
  a as listXaiTtsVoices,
  i as isValidXaiTtsVoice,
  l as xaiTTS,
  o as normalizeXaiLanguageCode,
  s as normalizeXaiTtsBaseUrl,
  t as XAI_TTS_FALLBACK_VOICES,
  u as xaiTTSStream,
} from "./tts-5bJ-p_kQ.js";
import "./speech-CYe6S4Fp.js";
import "./model-definitions-BoOPeWPv.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
//#region extensions/xai/speech-provider.ts
const XAI_SPEECH_RESPONSE_FORMATS = ["mp3", "wav", "pcm", "mulaw", "alaw"];
const DEFAULT_GENERATED_AUDIO_MAX_BYTES = 16 * 1024 * 1024;
function normalizeXaiSpeechSpeed(value) {
  return asFiniteNumberInRange(value, {
    min: 0.7,
    max: 1.5,
  });
}
function normalizeXaiSpeechResponseFormat(value) {
  const next = normalizeLowercaseStringOrEmpty(value);
  if (!next) return;
  if (XAI_SPEECH_RESPONSE_FORMATS.some((format) => format === next)) return next;
  throw new Error(`Invalid xAI speech responseFormat: ${next}`);
}
function resolveSpeechResponseFormat(target, configuredFormat) {
  if (target === "voice-note") return "mp3";
  return configuredFormat ?? "mp3";
}
function responseFormatToFileExtension(format) {
  switch (format) {
    case "wav":
      return ".wav";
    case "pcm":
      return ".pcm";
    case "mulaw":
      return ".mulaw";
    case "alaw":
      return ".alaw";
    default:
      return ".mp3";
  }
}
function normalizeXaiProviderConfig(rawConfig) {
  const xai = rawConfig?.providers?.xai ?? rawConfig?.xai ?? rawConfig;
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: xai?.apiKey,
      path: "messages.tts.providers.xai.apiKey",
    }),
    baseUrl: normalizeXaiTtsBaseUrl(
      normalizeOptionalString(xai?.baseUrl) ??
        normalizeOptionalString(process.env.XAI_BASE_URL) ??
        "https://api.x.ai/v1",
    ),
    voiceId: normalizeOptionalString(xai?.voiceId ?? xai?.voice) ?? "eve",
    language: normalizeXaiLanguageCode(normalizeOptionalString(xai?.language ?? xai?.languageCode)),
    speed: normalizeXaiSpeechSpeed(xai?.speed),
    responseFormat: normalizeXaiSpeechResponseFormat(xai?.responseFormat),
  };
}
function readXaiProviderConfig(config) {
  const normalized = normalizeXaiProviderConfig({});
  return {
    apiKey: normalizeOptionalString(config.apiKey) ?? normalized.apiKey,
    baseUrl: normalizeOptionalString(config.baseUrl) ?? normalized.baseUrl,
    voiceId: normalizeOptionalString(config.voiceId ?? config.voice) ?? normalized.voiceId,
    language:
      normalizeXaiLanguageCode(normalizeOptionalString(config.language ?? config.languageCode)) ??
      normalized.language,
    speed: normalizeXaiSpeechSpeed(config.speed) ?? normalized.speed,
    responseFormat:
      normalizeXaiSpeechResponseFormat(config.responseFormat) ?? normalized.responseFormat,
  };
}
function readXaiOverrides(overrides) {
  if (!overrides) return {};
  return {
    voiceId: normalizeOptionalString(overrides.voiceId ?? overrides.voice),
    language: normalizeXaiLanguageCode(normalizeOptionalString(overrides.language)),
    speed: normalizeXaiSpeechSpeed(overrides.speed),
  };
}
function resolveGeneratedAudioMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * 1024 * 1024);
  return DEFAULT_GENERATED_AUDIO_MAX_BYTES;
}
function parseDirectiveToken(ctx) {
  switch (ctx.key) {
    case "voice":
    case "voice_id":
    case "voiceid":
    case "xai_voice":
    case "xaivoice":
      if (!ctx.policy.allowVoice) return { handled: true };
      if (!isValidXaiTtsVoice(ctx.value))
        return {
          handled: true,
          warnings: [`invalid xAI voice "${ctx.value}"`],
        };
      return {
        handled: true,
        overrides: { voiceId: ctx.value },
      };
    default:
      return { handled: false };
  }
}
function buildXaiSpeechProvider() {
  return {
    id: "xai",
    label: "xAI",
    autoSelectOrder: 25,
    models: [],
    voices: XAI_TTS_FALLBACK_VOICES,
    resolveConfig: ({ rawConfig }) => normalizeXaiProviderConfig(rawConfig),
    parseDirectiveToken,
    resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
      const base = normalizeXaiProviderConfig(baseTtsConfig);
      const responseFormat = normalizeXaiSpeechResponseFormat(talkProviderConfig.responseFormat);
      return {
        ...base,
        ...(talkProviderConfig.apiKey === void 0
          ? {}
          : {
              apiKey: normalizeResolvedSecretInputString({
                value: talkProviderConfig.apiKey,
                path: "talk.providers.xai.apiKey",
              }),
            }),
        ...(normalizeOptionalString(talkProviderConfig.baseUrl) == null
          ? {}
          : {
              baseUrl: normalizeXaiTtsBaseUrl(normalizeOptionalString(talkProviderConfig.baseUrl)),
            }),
        ...(normalizeOptionalString(talkProviderConfig.voiceId) == null
          ? {}
          : { voiceId: normalizeOptionalString(talkProviderConfig.voiceId) }),
        ...(normalizeXaiLanguageCode(
          normalizeOptionalString(talkProviderConfig.language ?? talkProviderConfig.languageCode),
        ) == null
          ? {}
          : {
              language: normalizeXaiLanguageCode(
                normalizeOptionalString(
                  talkProviderConfig.language ?? talkProviderConfig.languageCode,
                ),
              ),
            }),
        ...(normalizeXaiSpeechSpeed(talkProviderConfig.speed) == null
          ? {}
          : { speed: normalizeXaiSpeechSpeed(talkProviderConfig.speed) }),
        ...(responseFormat == null ? {} : { responseFormat }),
      };
    },
    resolveTalkOverrides: ({ params }) => ({
      ...(normalizeOptionalString(params.voiceId ?? params.voice) == null
        ? {}
        : { voiceId: normalizeOptionalString(params.voiceId ?? params.voice) }),
      ...(normalizeXaiLanguageCode(
        normalizeOptionalString(params.language ?? params.languageCode),
      ) == null
        ? {}
        : {
            language: normalizeXaiLanguageCode(
              normalizeOptionalString(params.language ?? params.languageCode),
            ),
          }),
      ...(normalizeXaiSpeechSpeed(params.speed) == null
        ? {}
        : { speed: normalizeXaiSpeechSpeed(params.speed) }),
    }),
    listVoices: async (req) => {
      const config = readXaiProviderConfig(req.providerConfig ?? {});
      const apiKey = await resolveOptionalXaiAudioApiKey(
        normalizeOptionalString(req.apiKey) ?? config.apiKey,
        req.cfg,
      );
      if (!apiKey)
        return XAI_TTS_FALLBACK_VOICES.map((voice) => ({
          id: voice,
          name: voice,
        }));
      return await listXaiTtsVoices({
        apiKey,
        baseUrl: normalizeXaiTtsBaseUrl(normalizeOptionalString(req.baseUrl) ?? config.baseUrl),
      });
    },
    isConfigured: ({ providerConfig, cfg }) =>
      Boolean(readXaiProviderConfig(providerConfig).apiKey || process.env.XAI_API_KEY) ||
      isProviderAuthProfileConfigured({
        provider: "xai",
        cfg,
      }),
    synthesize: async (req) => {
      const config = readXaiProviderConfig(req.providerConfig);
      const overrides = readXaiOverrides(req.providerOverrides);
      const apiKey = await resolveXaiAudioApiKey(config.apiKey, req.cfg);
      const responseFormat = resolveSpeechResponseFormat(req.target, config.responseFormat);
      return {
        audioBuffer: await xaiTTS({
          text: req.text,
          apiKey,
          baseUrl: config.baseUrl,
          voiceId: overrides.voiceId ?? config.voiceId,
          language: overrides.language ?? config.language,
          speed: overrides.speed ?? config.speed,
          responseFormat,
          timeoutMs: req.timeoutMs,
          maxBytes: resolveGeneratedAudioMaxBytes(req),
        }),
        outputFormat: responseFormat,
        fileExtension: responseFormatToFileExtension(responseFormat),
        voiceCompatible: false,
      };
    },
    streamSynthesize: async (req) => {
      const config = readXaiProviderConfig(req.providerConfig);
      const overrides = readXaiOverrides(req.providerOverrides);
      const responseFormat = resolveSpeechResponseFormat(req.target, config.responseFormat);
      const apiKey = await resolveXaiAudioApiKey(config.apiKey, req.cfg);
      const stream = await xaiTTSStream({
        text: req.text,
        apiKey,
        baseUrl: config.baseUrl,
        voiceId: overrides.voiceId ?? config.voiceId,
        language: overrides.language ?? config.language,
        speed: overrides.speed ?? config.speed,
        responseFormat,
        timeoutMs: req.timeoutMs,
        maxBytes: resolveGeneratedAudioMaxBytes(req),
      });
      return {
        audioStream: stream.audioStream,
        outputFormat: responseFormat,
        fileExtension: responseFormatToFileExtension(responseFormat),
        voiceCompatible: false,
        release: stream.release,
      };
    },
    synthesizeTelephony: async (req) => {
      const config = readXaiProviderConfig(req.providerConfig);
      const overrides = readXaiOverrides(req.providerOverrides);
      const apiKey = await resolveXaiAudioApiKey(config.apiKey, req.cfg);
      const outputFormat = "pcm";
      return {
        audioBuffer: await xaiTTS({
          text: req.text,
          apiKey,
          baseUrl: config.baseUrl,
          voiceId: overrides.voiceId ?? config.voiceId,
          language: overrides.language ?? config.language,
          speed: overrides.speed ?? config.speed,
          responseFormat: outputFormat,
          timeoutMs: req.timeoutMs,
          maxBytes: resolveGeneratedAudioMaxBytes(req),
        }),
        outputFormat,
        sampleRate: 24e3,
      };
    },
  };
}
async function resolveOptionalXaiAudioApiKey(configApiKey, cfg) {
  const direct =
    normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
  if (direct) return direct;
  if (!cfg) return;
  return normalizeOptionalString(
    (
      await resolveApiKeyForProvider({
        provider: "xai",
        cfg,
      })
    )?.apiKey,
  );
}
async function resolveXaiAudioApiKey(configApiKey, cfg) {
  const apiKey = await resolveOptionalXaiAudioApiKey(configApiKey, cfg);
  if (apiKey) return apiKey;
  throw new Error(
    "xAI credentials missing for TTS. Sign in with `openclaw onboard --auth-choice xai-oauth`, or run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.",
  );
}
//#endregion
export { buildXaiSpeechProvider as t };
