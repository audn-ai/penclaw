import { t as asBoolean } from "./boolean-CrriykWV.js";
import { r as resolveElevenLabsApiKeyWithProfileFallback } from "./config-compat-Bx_PEn_N.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  _ as parseStrictFiniteNumber,
  s as asFiniteNumber,
  v as parseStrictInteger,
} from "./number-coercion-CJQ8TR--.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
  n as asObject,
} from "./provider-http-errors-DLMRBkZU.js";
import {
  n as isValidElevenLabsVoiceId,
  r as normalizeElevenLabsBaseUrl,
} from "./shared-B7utk7gS.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./secret-input-D1aG0n6v.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
import "./speech-CYe6S4Fp.js";
import { n as elevenLabsTTSStream, t as elevenLabsTTS } from "./tts-CquFh1G4.js";
import {
  i as requireInRange,
  n as normalizeLanguageCode,
  r as normalizeSeed,
  t as normalizeApplyTextNormalization,
} from "./tts-provider-helpers-TtT1sPkM.js";
import "./config-api-qT7ZzS1J.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
//#region extensions/elevenlabs/speech-provider.ts
const DEFAULT_ELEVENLABS_VOICE_ID = "pMsXgVXv3BLzUgSXRplE";
const DEFAULT_ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const DEFAULT_ELEVENLABS_VOICE_SETTINGS = {
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0,
  useSpeakerBoost: true,
  speed: 1,
};
const ELEVENLABS_TTS_MODELS = [
  "eleven_v3",
  "eleven_multilingual_v2",
  "eleven_flash_v2_5",
  "eleven_flash_v2",
  "eleven_turbo_v2_5",
  "eleven_monolingual_v1",
];
function normalizeElevenLabsTtsModelId(value) {
  switch (value) {
    case "eleven_turbo_v2_5":
      return "eleven_flash_v2_5";
    case "eleven_turbo_v2":
      return "eleven_flash_v2";
    default:
      return value;
  }
}
function parseBooleanValue(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;
}
function parseNumberValue(value) {
  return parseStrictFiniteNumber(value);
}
function normalizeVoiceSetting(value, min, max) {
  const number = asFiniteNumber(value);
  return number !== void 0 && number >= min && number <= max ? number : void 0;
}
function normalizeElevenLabsSeed(value) {
  const seed = asFiniteNumber(value);
  return seed !== void 0 && Number.isSafeInteger(seed) && seed >= 0 && seed <= 4294967295
    ? seed
    : void 0;
}
function normalizeElevenLabsLatencyTier(value) {
  const latencyTier = asFiniteNumber(value);
  return latencyTier !== void 0 &&
    Number.isSafeInteger(latencyTier) &&
    latencyTier >= 0 &&
    latencyTier <= 4
    ? latencyTier
    : void 0;
}
function normalizeVoiceSettings(rawVoiceSettings) {
  return {
    ...(normalizeVoiceSetting(rawVoiceSettings?.stability, 0, 1) == null
      ? {}
      : { stability: normalizeVoiceSetting(rawVoiceSettings?.stability, 0, 1) }),
    ...(normalizeVoiceSetting(rawVoiceSettings?.similarityBoost, 0, 1) == null
      ? {}
      : { similarityBoost: normalizeVoiceSetting(rawVoiceSettings?.similarityBoost, 0, 1) }),
    ...(normalizeVoiceSetting(rawVoiceSettings?.style, 0, 1) == null
      ? {}
      : { style: normalizeVoiceSetting(rawVoiceSettings?.style, 0, 1) }),
    ...(asBoolean(rawVoiceSettings?.useSpeakerBoost) == null
      ? {}
      : { useSpeakerBoost: asBoolean(rawVoiceSettings?.useSpeakerBoost) }),
    ...(normalizeVoiceSetting(rawVoiceSettings?.speed, 0.5, 2) == null
      ? {}
      : { speed: normalizeVoiceSetting(rawVoiceSettings?.speed, 0.5, 2) }),
  };
}
function normalizeElevenLabsProviderConfig(rawConfig) {
  const raw = asObject(asObject(rawConfig.providers)?.elevenlabs) ?? asObject(rawConfig.elevenlabs);
  const rawVoiceSettings = asObject(raw?.voiceSettings);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey,
      path: "messages.tts.providers.elevenlabs.apiKey",
    }),
    baseUrl: normalizeElevenLabsBaseUrl(normalizeOptionalString(raw?.baseUrl)),
    voiceId: normalizeOptionalString(raw?.voiceId) ?? DEFAULT_ELEVENLABS_VOICE_ID,
    modelId:
      normalizeElevenLabsTtsModelId(normalizeOptionalString(raw?.modelId)) ??
      DEFAULT_ELEVENLABS_MODEL_ID,
    seed: normalizeElevenLabsSeed(raw?.seed),
    applyTextNormalization: normalizeOptionalString(raw?.applyTextNormalization),
    languageCode: normalizeOptionalString(raw?.languageCode),
    voiceSettings: {
      ...DEFAULT_ELEVENLABS_VOICE_SETTINGS,
      ...normalizeVoiceSettings(rawVoiceSettings),
    },
  };
}
function readElevenLabsProviderConfig(config) {
  const defaults = normalizeElevenLabsProviderConfig({});
  const voiceSettings = asObject(config.voiceSettings);
  return {
    apiKey: normalizeOptionalString(config.apiKey) ?? defaults.apiKey,
    baseUrl: normalizeElevenLabsBaseUrl(
      normalizeOptionalString(config.baseUrl) ?? defaults.baseUrl,
    ),
    voiceId: normalizeOptionalString(config.voiceId) ?? defaults.voiceId,
    modelId:
      normalizeElevenLabsTtsModelId(normalizeOptionalString(config.modelId)) ?? defaults.modelId,
    seed: normalizeElevenLabsSeed(config.seed) ?? defaults.seed,
    applyTextNormalization:
      normalizeOptionalString(config.applyTextNormalization) ?? defaults.applyTextNormalization,
    languageCode: normalizeOptionalString(config.languageCode) ?? defaults.languageCode,
    voiceSettings: {
      ...defaults.voiceSettings,
      ...normalizeVoiceSettings(voiceSettings),
    },
  };
}
function mergeVoiceSettingsOverride(ctx, next) {
  return {
    ...ctx.currentOverrides,
    voiceSettings: {
      ...asObject(ctx.currentOverrides?.voiceSettings),
      ...next,
    },
  };
}
function resolveVoiceSettingsOverride(base, overrides) {
  const voiceSettings = asObject(overrides);
  return {
    ...base,
    ...normalizeVoiceSettings(voiceSettings),
  };
}
function parseDirectiveToken(ctx) {
  try {
    switch (ctx.key) {
      case "voiceid":
      case "voice_id":
      case "elevenlabs_voice":
      case "elevenlabsvoice":
        if (!ctx.policy.allowVoice) return { handled: true };
        if (!isValidElevenLabsVoiceId(ctx.value))
          return {
            handled: true,
            warnings: [`invalid ElevenLabs voiceId "${ctx.value}"`],
          };
        return {
          handled: true,
          overrides: {
            ...ctx.currentOverrides,
            voiceId: ctx.value,
          },
        };
      case "model":
      case "modelid":
      case "model_id":
      case "elevenlabs_model":
      case "elevenlabsmodel":
        if (!ctx.policy.allowModelId) return { handled: true };
        return {
          handled: true,
          overrides: {
            ...ctx.currentOverrides,
            modelId: normalizeElevenLabsTtsModelId(ctx.value),
          },
        };
      case "stability": {
        if (!ctx.policy.allowVoiceSettings) return { handled: true };
        const value = parseNumberValue(ctx.value);
        if (value == null)
          return {
            handled: true,
            warnings: ["invalid stability value"],
          };
        requireInRange(value, 0, 1, "stability");
        return {
          handled: true,
          overrides: mergeVoiceSettingsOverride(ctx, { stability: value }),
        };
      }
      case "similarity":
      case "similarityboost":
      case "similarity_boost": {
        if (!ctx.policy.allowVoiceSettings) return { handled: true };
        const value = parseNumberValue(ctx.value);
        if (value == null)
          return {
            handled: true,
            warnings: ["invalid similarityBoost value"],
          };
        requireInRange(value, 0, 1, "similarityBoost");
        return {
          handled: true,
          overrides: mergeVoiceSettingsOverride(ctx, { similarityBoost: value }),
        };
      }
      case "style": {
        if (!ctx.policy.allowVoiceSettings) return { handled: true };
        const value = parseNumberValue(ctx.value);
        if (value == null)
          return {
            handled: true,
            warnings: ["invalid style value"],
          };
        requireInRange(value, 0, 1, "style");
        return {
          handled: true,
          overrides: mergeVoiceSettingsOverride(ctx, { style: value }),
        };
      }
      case "speed": {
        if (!ctx.policy.allowVoiceSettings) return { handled: true };
        const value = parseNumberValue(ctx.value);
        if (value == null)
          return {
            handled: true,
            warnings: ["invalid speed value"],
          };
        requireInRange(value, 0.5, 2, "speed");
        return {
          handled: true,
          overrides: mergeVoiceSettingsOverride(ctx, { speed: value }),
        };
      }
      case "speakerboost":
      case "speaker_boost":
      case "usespeakerboost":
      case "use_speaker_boost": {
        if (!ctx.policy.allowVoiceSettings) return { handled: true };
        const value = parseBooleanValue(ctx.value);
        if (value == null)
          return {
            handled: true,
            warnings: ["invalid useSpeakerBoost value"],
          };
        return {
          handled: true,
          overrides: mergeVoiceSettingsOverride(ctx, { useSpeakerBoost: value }),
        };
      }
      case "normalize":
      case "applytextnormalization":
      case "apply_text_normalization":
        if (!ctx.policy.allowNormalization) return { handled: true };
        return {
          handled: true,
          overrides: {
            ...ctx.currentOverrides,
            applyTextNormalization: normalizeApplyTextNormalization(ctx.value),
          },
        };
      case "language":
      case "languagecode":
      case "language_code":
        if (!ctx.policy.allowNormalization) return { handled: true };
        return {
          handled: true,
          overrides: {
            ...ctx.currentOverrides,
            languageCode: normalizeLanguageCode(ctx.value),
          },
        };
      case "seed":
        if (!ctx.policy.allowSeed) return { handled: true };
        return {
          handled: true,
          overrides: {
            ...ctx.currentOverrides,
            seed: normalizeSeed(parseStrictInteger(ctx.value) ?? NaN),
          },
        };
      default:
        return { handled: false };
    }
  } catch (error) {
    return {
      handled: true,
      warnings: [formatErrorMessage(error)],
    };
  }
}
async function listElevenLabsVoices(params) {
  const normalizedBaseUrl = normalizeElevenLabsBaseUrl(params.baseUrl);
  const { response, release } = await fetchWithSsrFGuard({
    url: `${normalizedBaseUrl}/v1/voices`,
    init: { headers: { "xi-api-key": params.apiKey } },
    timeoutMs: params.timeoutMs,
    policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(normalizedBaseUrl),
    auditContext: "elevenlabs.voices",
  });
  try {
    await assertOkOrThrowProviderError(response, "ElevenLabs voices API error");
    const json = await readProviderJsonResponse(response, "elevenlabs.voices");
    return Array.isArray(json.voices)
      ? json.voices
          .map((voice) => ({
            id: voice.voice_id?.trim() ?? "",
            name: normalizeOptionalString(voice.name),
            category: normalizeOptionalString(voice.category),
            description: normalizeOptionalString(voice.description),
          }))
          .filter((voice) => voice.id.length > 0)
      : [];
  } finally {
    await release();
  }
}
function resolveElevenLabsTtsRequest(req, options) {
  const config = readElevenLabsProviderConfig(req.providerConfig);
  const overrides = req.providerOverrides ?? {};
  const apiKey =
    config.apiKey || resolveElevenLabsApiKeyWithProfileFallback() || process.env.XI_API_KEY;
  if (!apiKey) throw new Error("ElevenLabs API key missing");
  return {
    text: req.text,
    apiKey,
    baseUrl: config.baseUrl,
    voiceId: normalizeOptionalString(overrides.voiceId) ?? config.voiceId,
    modelId:
      normalizeElevenLabsTtsModelId(normalizeOptionalString(overrides.modelId)) ?? config.modelId,
    outputFormat: options.outputFormat,
    seed: normalizeElevenLabsSeed(overrides.seed) ?? config.seed,
    applyTextNormalization:
      normalizeOptionalString(overrides.applyTextNormalization) ?? config.applyTextNormalization,
    languageCode: normalizeOptionalString(overrides.languageCode) ?? config.languageCode,
    latencyTier: options.latencyTier,
    voiceSettings: resolveVoiceSettingsOverride(config.voiceSettings, overrides.voiceSettings),
    timeoutMs: req.timeoutMs,
  };
}
function buildElevenLabsSpeechProvider() {
  return {
    id: "elevenlabs",
    label: "ElevenLabs",
    autoSelectOrder: 20,
    defaultModel: DEFAULT_ELEVENLABS_MODEL_ID,
    models: ELEVENLABS_TTS_MODELS,
    resolveConfig: ({ rawConfig }) => normalizeElevenLabsProviderConfig(rawConfig),
    parseDirectiveToken,
    resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
      const base = normalizeElevenLabsProviderConfig(baseTtsConfig);
      const talkVoiceSettings = asObject(talkProviderConfig.voiceSettings);
      const resolvedTalkApiKey =
        talkProviderConfig.apiKey === void 0
          ? (resolveElevenLabsApiKeyWithProfileFallback() ?? void 0)
          : normalizeResolvedSecretInputString({
              value: talkProviderConfig.apiKey,
              path: "talk.providers.elevenlabs.apiKey",
            });
      return {
        ...base,
        ...(resolvedTalkApiKey === void 0 ? {} : { apiKey: resolvedTalkApiKey }),
        ...(normalizeOptionalString(talkProviderConfig.baseUrl) == null
          ? {}
          : {
              baseUrl: normalizeElevenLabsBaseUrl(
                normalizeOptionalString(talkProviderConfig.baseUrl),
              ),
            }),
        ...(normalizeOptionalString(talkProviderConfig.voiceId) == null
          ? {}
          : { voiceId: normalizeOptionalString(talkProviderConfig.voiceId) }),
        ...(normalizeOptionalString(talkProviderConfig.modelId) == null
          ? {}
          : {
              modelId: normalizeElevenLabsTtsModelId(
                normalizeOptionalString(talkProviderConfig.modelId),
              ),
            }),
        ...(normalizeElevenLabsSeed(talkProviderConfig.seed) == null
          ? {}
          : { seed: normalizeElevenLabsSeed(talkProviderConfig.seed) }),
        ...(normalizeOptionalString(talkProviderConfig.applyTextNormalization) == null
          ? {}
          : {
              applyTextNormalization: normalizeApplyTextNormalization(
                normalizeOptionalString(talkProviderConfig.applyTextNormalization),
              ),
            }),
        ...(normalizeOptionalString(talkProviderConfig.languageCode) == null
          ? {}
          : {
              languageCode: normalizeLanguageCode(
                normalizeOptionalString(talkProviderConfig.languageCode),
              ),
            }),
        voiceSettings: {
          ...base.voiceSettings,
          ...normalizeVoiceSettings(talkVoiceSettings),
        },
      };
    },
    resolveTalkOverrides: ({ params }) => {
      const normalize = normalizeOptionalString(params.normalize);
      const language = normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.language));
      const latencyTier = normalizeElevenLabsLatencyTier(params.latencyTier);
      const voiceSettings = {
        ...(normalizeVoiceSetting(params.speed, 0.5, 2) == null
          ? {}
          : { speed: normalizeVoiceSetting(params.speed, 0.5, 2) }),
        ...(normalizeVoiceSetting(params.stability, 0, 1) == null
          ? {}
          : { stability: normalizeVoiceSetting(params.stability, 0, 1) }),
        ...(normalizeVoiceSetting(params.similarity, 0, 1) == null
          ? {}
          : { similarityBoost: normalizeVoiceSetting(params.similarity, 0, 1) }),
        ...(normalizeVoiceSetting(params.style, 0, 1) == null
          ? {}
          : { style: normalizeVoiceSetting(params.style, 0, 1) }),
        ...(asBoolean(params.speakerBoost) == null
          ? {}
          : { useSpeakerBoost: asBoolean(params.speakerBoost) }),
      };
      return {
        ...(normalizeOptionalString(params.voiceId) == null
          ? {}
          : { voiceId: normalizeOptionalString(params.voiceId) }),
        ...(normalizeOptionalString(params.modelId) == null
          ? {}
          : { modelId: normalizeElevenLabsTtsModelId(normalizeOptionalString(params.modelId)) }),
        ...(normalizeOptionalString(params.outputFormat) == null
          ? {}
          : { outputFormat: normalizeOptionalString(params.outputFormat) }),
        ...(normalizeElevenLabsSeed(params.seed) == null
          ? {}
          : { seed: normalizeElevenLabsSeed(params.seed) }),
        ...(normalize == null
          ? {}
          : { applyTextNormalization: normalizeApplyTextNormalization(normalize) }),
        ...(language == null ? {} : { languageCode: normalizeLanguageCode(language) }),
        ...(latencyTier == null ? {} : { latencyTier }),
        ...(Object.keys(voiceSettings).length === 0 ? {} : { voiceSettings }),
      };
    },
    listVoices: async (req) => {
      const config = req.providerConfig ? readElevenLabsProviderConfig(req.providerConfig) : void 0;
      const apiKey =
        req.apiKey ||
        config?.apiKey ||
        resolveElevenLabsApiKeyWithProfileFallback() ||
        process.env.XI_API_KEY;
      if (!apiKey) throw new Error("ElevenLabs API key missing");
      return listElevenLabsVoices({
        apiKey,
        baseUrl: req.baseUrl ?? config?.baseUrl,
        timeoutMs: req.timeoutMs,
      });
    },
    isConfigured: ({ providerConfig }) =>
      Boolean(
        readElevenLabsProviderConfig(providerConfig).apiKey ||
        resolveElevenLabsApiKeyWithProfileFallback() ||
        process.env.XI_API_KEY,
      ),
    synthesize: async (req) => {
      const overrides = req.providerOverrides ?? {};
      const outputFormat =
        normalizeOptionalString(overrides.outputFormat) ??
        (req.target === "voice-note" ? "opus_48000_64" : "mp3_44100_128");
      return {
        audioBuffer: await elevenLabsTTS(
          resolveElevenLabsTtsRequest(req, {
            outputFormat,
            latencyTier: normalizeElevenLabsLatencyTier(overrides.latencyTier),
          }),
        ),
        outputFormat,
        fileExtension: req.target === "voice-note" ? ".opus" : ".mp3",
        voiceCompatible: req.target === "voice-note",
      };
    },
    streamSynthesize: async (req) => {
      const overrides = req.providerOverrides ?? {};
      const outputFormat =
        normalizeOptionalString(overrides.outputFormat) ??
        (req.target === "voice-note" ? "opus_48000_64" : "mp3_44100_128");
      const stream = await elevenLabsTTSStream(
        resolveElevenLabsTtsRequest(req, {
          outputFormat,
          latencyTier: normalizeElevenLabsLatencyTier(overrides.latencyTier),
        }),
      );
      return {
        audioStream: stream.audioStream,
        outputFormat,
        fileExtension: req.target === "voice-note" ? ".opus" : ".mp3",
        voiceCompatible: req.target === "voice-note",
        release: stream.release,
      };
    },
    synthesizeTelephony: async (req) => {
      const outputFormat = "pcm_22050";
      return {
        audioBuffer: await elevenLabsTTS(resolveElevenLabsTtsRequest(req, { outputFormat })),
        outputFormat,
        sampleRate: 22050,
      };
    },
  };
}
//#endregion
export { buildElevenLabsSpeechProvider as t };
