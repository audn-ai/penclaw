import { b as transcodeAudioBufferToOpus } from "./media-services-Czws84B5.js";
import { c as asFiniteNumberInRange } from "./number-coercion-CJQ8TR--.js";
import {
  c as resolveProviderAuthProfileApiKey,
  i as isProviderAuthProfileConfigured,
} from "./provider-auth-mypr64nh.js";
import { n as asObject } from "./provider-http-errors-DLMRBkZU.js";
import { t as parseSpeechDirectiveNumberOverride } from "./speech-core-CWj6o89Y.js";
import "./media-runtime-BhmZORKM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as normalizeMinimaxTtsBaseUrl,
  i as minimaxTTS,
  n as MINIMAX_TTS_MODELS,
  r as MINIMAX_TTS_VOICES,
} from "./tts-BqfvtnqO.js";
import "./secret-input-D1aG0n6v.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
//#region extensions/minimax/speech-provider.ts
const MINIMAX_PORTAL_PROVIDER_ID = "minimax-portal";
const MINIMAX_TOKEN_PLAN_ENV_VARS = [
  "MINIMAX_OAUTH_TOKEN",
  "MINIMAX_CODE_PLAN_KEY",
  "MINIMAX_CODING_API_KEY",
];
function resolveConfiguredPortalTtsBaseUrl(cfg) {
  const portalBaseUrl = normalizeOptionalString(
    asObject(asObject(asObject(cfg?.models)?.providers)?.[MINIMAX_PORTAL_PROVIDER_ID])?.baseUrl,
  );
  return portalBaseUrl ? normalizeMinimaxTtsBaseUrl(portalBaseUrl) : void 0;
}
function resolveMinimaxTokenPlanEnvKey() {
  for (const envVar of MINIMAX_TOKEN_PLAN_ENV_VARS) {
    const value = normalizeOptionalString(process.env[envVar]);
    if (value) return value;
  }
}
async function resolveMinimaxPortalProfileToken(cfg) {
  return await resolveProviderAuthProfileApiKey({
    cfg,
    provider: MINIMAX_PORTAL_PROVIDER_ID,
  });
}
async function resolveMinimaxTtsApiKey(params) {
  return (
    params.configApiKey ??
    (await resolveMinimaxPortalProfileToken(params.cfg)) ??
    resolveMinimaxTokenPlanEnvKey() ??
    normalizeOptionalString(process.env.MINIMAX_API_KEY)
  );
}
function normalizeMinimaxProviderConfig(rawConfig, cfg) {
  const raw = asObject(asObject(rawConfig.providers)?.minimax) ?? asObject(rawConfig.minimax);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey,
      path: "messages.tts.providers.minimax.apiKey",
    }),
    baseUrl: normalizeMinimaxTtsBaseUrl(
      normalizeOptionalString(raw?.baseUrl) ??
        normalizeOptionalString(process.env.MINIMAX_API_HOST) ??
        resolveConfiguredPortalTtsBaseUrl(cfg) ??
        "https://api.minimax.io",
    ),
    model:
      normalizeOptionalString(raw?.model) ??
      normalizeOptionalString(process.env.MINIMAX_TTS_MODEL) ??
      "speech-2.8-hd",
    voiceId:
      normalizeOptionalString(raw?.voiceId) ??
      normalizeOptionalString(process.env.MINIMAX_TTS_VOICE_ID) ??
      "English_expressive_narrator",
    speed: normalizeMinimaxSpeed(raw?.speed),
    vol: normalizeMinimaxVolume(raw?.vol),
    pitch: normalizeMinimaxPitch(raw?.pitch),
  };
}
function normalizeMinimaxSpeed(value) {
  return asFiniteNumberInRange(value, {
    min: 0.5,
    max: 2,
  });
}
function normalizeMinimaxVolume(value) {
  return asFiniteNumberInRange(value, {
    min: 0,
    max: 10,
    minExclusive: true,
  });
}
function normalizeMinimaxPitch(value) {
  const pitch = asFiniteNumberInRange(value, {
    min: -12,
    max: 12,
  });
  return pitch !== void 0 ? Math.trunc(pitch) : void 0;
}
function readMinimaxProviderConfig(config, cfg) {
  const normalized = normalizeMinimaxProviderConfig({}, cfg);
  return {
    apiKey: normalizeOptionalString(config.apiKey) ?? normalized.apiKey,
    baseUrl: normalizeMinimaxTtsBaseUrl(
      normalizeOptionalString(config.baseUrl) ?? normalized.baseUrl,
    ),
    model: normalizeOptionalString(config.model) ?? normalized.model,
    voiceId: normalizeOptionalString(config.voiceId) ?? normalized.voiceId,
    speed: normalizeMinimaxSpeed(config.speed) ?? normalized.speed,
    vol: normalizeMinimaxVolume(config.vol) ?? normalized.vol,
    pitch: normalizeMinimaxPitch(config.pitch) ?? normalized.pitch,
  };
}
function readMinimaxOverrides(overrides) {
  if (!overrides) return {};
  return {
    model: normalizeOptionalString(overrides.model),
    voiceId: normalizeOptionalString(overrides.voiceId),
    speed: normalizeMinimaxSpeed(overrides.speed),
    vol: normalizeMinimaxVolume(overrides.vol),
    pitch: normalizeMinimaxPitch(overrides.pitch),
  };
}
function parseDirectiveToken(ctx) {
  switch (ctx.key) {
    case "voice":
    case "voiceid":
    case "voice_id":
    case "minimax_voice":
    case "minimaxvoice":
      if (!ctx.policy.allowVoice) return { handled: true };
      return {
        handled: true,
        overrides: { voiceId: ctx.value },
      };
    case "model":
    case "minimax_model":
    case "minimaxmodel":
      if (!ctx.policy.allowModelId) return { handled: true };
      return {
        handled: true,
        overrides: { model: ctx.value },
      };
    case "speed":
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "speed",
        range: {
          min: 0.5,
          max: 2,
        },
        warning: (value) => `invalid MiniMax speed "${value}" (0.5-2.0)`,
      });
    case "vol":
    case "volume":
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "vol",
        range: {
          min: 0,
          minExclusive: true,
          max: 10,
        },
        warning: (value) =>
          `invalid MiniMax volume "${value}" (must be greater than 0 and at most 10)`,
      });
    case "pitch":
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "pitch",
        range: {
          min: -12,
          max: 12,
        },
        warning: (value) => `invalid MiniMax pitch "${value}" (-12 to 12)`,
      });
    default:
      return { handled: false };
  }
}
function buildMinimaxSpeechProvider() {
  return {
    id: "minimax",
    label: "MiniMax",
    autoSelectOrder: 40,
    defaultModel: MINIMAX_TTS_MODELS[0],
    models: MINIMAX_TTS_MODELS,
    voices: MINIMAX_TTS_VOICES,
    resolveConfig: ({ rawConfig, cfg }) => normalizeMinimaxProviderConfig(rawConfig, cfg),
    parseDirectiveToken,
    resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
      return {
        ...normalizeMinimaxProviderConfig(baseTtsConfig),
        ...(talkProviderConfig.apiKey === void 0
          ? {}
          : {
              apiKey: normalizeResolvedSecretInputString({
                value: talkProviderConfig.apiKey,
                path: "talk.providers.minimax.apiKey",
              }),
            }),
        ...(normalizeOptionalString(talkProviderConfig.baseUrl) == null
          ? {}
          : {
              baseUrl: normalizeMinimaxTtsBaseUrl(
                normalizeOptionalString(talkProviderConfig.baseUrl),
              ),
            }),
        ...(normalizeOptionalString(talkProviderConfig.modelId) == null
          ? {}
          : { model: normalizeOptionalString(talkProviderConfig.modelId) }),
        ...(normalizeOptionalString(talkProviderConfig.voiceId) == null
          ? {}
          : { voiceId: normalizeOptionalString(talkProviderConfig.voiceId) }),
        ...(normalizeMinimaxSpeed(talkProviderConfig.speed) == null
          ? {}
          : { speed: normalizeMinimaxSpeed(talkProviderConfig.speed) }),
        ...(normalizeMinimaxVolume(talkProviderConfig.vol) == null
          ? {}
          : { vol: normalizeMinimaxVolume(talkProviderConfig.vol) }),
        ...(normalizeMinimaxPitch(talkProviderConfig.pitch) == null
          ? {}
          : { pitch: normalizeMinimaxPitch(talkProviderConfig.pitch) }),
      };
    },
    resolveTalkOverrides: ({ params }) => ({
      ...(normalizeOptionalString(params.voiceId) == null
        ? {}
        : { voiceId: normalizeOptionalString(params.voiceId) }),
      ...(normalizeOptionalString(params.modelId) == null
        ? {}
        : { model: normalizeOptionalString(params.modelId) }),
      ...(normalizeMinimaxSpeed(params.speed) == null
        ? {}
        : { speed: normalizeMinimaxSpeed(params.speed) }),
      ...(normalizeMinimaxVolume(params.vol) == null
        ? {}
        : { vol: normalizeMinimaxVolume(params.vol) }),
      ...(normalizeMinimaxPitch(params.pitch) == null
        ? {}
        : { pitch: normalizeMinimaxPitch(params.pitch) }),
    }),
    listVoices: async () =>
      MINIMAX_TTS_VOICES.map((voice) => ({
        id: voice,
        name: voice,
      })),
    isConfigured: ({ cfg, providerConfig }) =>
      Boolean(
        readMinimaxProviderConfig(providerConfig, cfg).apiKey ||
        isProviderAuthProfileConfigured({
          cfg,
          provider: MINIMAX_PORTAL_PROVIDER_ID,
        }) ||
        resolveMinimaxTokenPlanEnvKey() ||
        process.env.MINIMAX_API_KEY,
      ),
    synthesize: async (req) => {
      const config = readMinimaxProviderConfig(req.providerConfig, req.cfg);
      const overrides = readMinimaxOverrides(req.providerOverrides);
      const apiKey = await resolveMinimaxTtsApiKey({
        cfg: req.cfg,
        configApiKey: config.apiKey,
      });
      if (!apiKey) throw new Error("MiniMax TTS auth missing");
      const audioBuffer = await minimaxTTS({
        text: req.text,
        apiKey,
        baseUrl: config.baseUrl,
        model: overrides.model ?? config.model,
        voiceId: overrides.voiceId ?? config.voiceId,
        speed: overrides.speed ?? config.speed,
        vol: overrides.vol ?? config.vol,
        pitch: overrides.pitch ?? config.pitch,
        timeoutMs: req.timeoutMs,
      });
      if (req.target === "voice-note")
        return {
          audioBuffer: await transcodeAudioBufferToOpus({
            audioBuffer,
            inputExtension: "mp3",
            tempPrefix: "tts-minimax-",
            timeoutMs: req.timeoutMs,
          }),
          outputFormat: "opus",
          fileExtension: ".opus",
          voiceCompatible: true,
        };
      return {
        audioBuffer,
        outputFormat: "mp3",
        fileExtension: ".mp3",
        voiceCompatible: false,
      };
    },
  };
}
//#endregion
export { buildMinimaxSpeechProvider as t };
