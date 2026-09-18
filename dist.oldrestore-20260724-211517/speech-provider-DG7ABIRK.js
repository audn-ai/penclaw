import { p as isVoiceMessageCompatibleAudio } from "./media-runtime-BhmZORKM.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import {
  a as resolveOpenAIProviderConfigRecord,
  o as trimToUndefined,
} from "./realtime-provider-shared-D_z6PPoJ.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as parseSpeechDirectiveNumberOverride } from "./speech-core-CWj6o89Y.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./secret-input-D1aG0n6v.js";
import {
  a as isValidOpenAIVoice,
  i as isValidOpenAIModel,
  n as OPENAI_TTS_MODELS,
  o as normalizeOpenAITtsBaseUrl,
  r as OPENAI_TTS_VOICES,
  s as openaiTTS,
  t as DEFAULT_OPENAI_BASE_URL,
} from "./tts-DuV8LGrt.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
//#region extensions/openai/speech-provider.ts
const OPENAI_SPEECH_RESPONSE_FORMATS = ["mp3", "opus", "wav"];
const DEFAULT_GENERATED_AUDIO_MAX_BYTES = 16 * 1024 * 1024;
function normalizeOpenAISpeechResponseFormat(value) {
  const next = normalizeOptionalLowercaseString(value);
  if (!next) return;
  if (OPENAI_SPEECH_RESPONSE_FORMATS.includes(next)) return next;
  throw new Error(`Invalid OpenAI speech responseFormat: ${next}`);
}
function isGroqSpeechBaseUrl(baseUrl) {
  try {
    const hostname = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname);
    return hostname === "groq.com" || hostname.endsWith(".groq.com");
  } catch {
    return false;
  }
}
function resolveSpeechResponseFormat(baseUrl, target, configuredFormat) {
  if (configuredFormat) return configuredFormat;
  if (isGroqSpeechBaseUrl(baseUrl)) return "wav";
  return target === "voice-note" ? "opus" : "mp3";
}
function responseFormatToFileExtension(format) {
  switch (format) {
    case "opus":
      return ".opus";
    case "wav":
      return ".wav";
    default:
      return ".mp3";
  }
}
function readExtraBody(value) {
  const body = asOptionalRecord(value);
  if (!body || Object.keys(body).length === 0) return;
  return body;
}
function normalizeOpenAISpeechSpeed(value, baseUrl) {
  const speed = asFiniteNumber(value);
  if (speed === void 0) return;
  if (baseUrl !== void 0 && normalizeOpenAITtsBaseUrl(baseUrl) !== "https://api.openai.com/v1")
    return speed;
  return speed >= 0.25 && speed <= 4 ? speed : void 0;
}
function normalizeOpenAIProviderConfig(rawConfig) {
  const raw = resolveOpenAIProviderConfigRecord(rawConfig);
  const extraBody = readExtraBody(raw?.extraBody) ?? readExtraBody(raw?.extra_body);
  const baseUrl = normalizeOpenAITtsBaseUrl(
    trimToUndefined(raw?.baseUrl) ??
      trimToUndefined(process.env.OPENAI_TTS_BASE_URL) ??
      "https://api.openai.com/v1",
  );
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw?.apiKey,
      path: "messages.tts.providers.openai.apiKey",
    }),
    baseUrl,
    model: trimToUndefined(raw?.model) ?? "gpt-4o-mini-tts",
    voice: trimToUndefined(raw?.voice) ?? "coral",
    speed: normalizeOpenAISpeechSpeed(raw?.speed, baseUrl),
    instructions: trimToUndefined(raw?.instructions),
    responseFormat: normalizeOpenAISpeechResponseFormat(raw?.responseFormat),
    extraBody,
  };
}
function readOpenAIProviderConfig(config) {
  const normalized = normalizeOpenAIProviderConfig({});
  return {
    apiKey: trimToUndefined(config.apiKey) ?? normalized.apiKey,
    baseUrl: trimToUndefined(config.baseUrl) ?? normalized.baseUrl,
    model: trimToUndefined(config.model) ?? normalized.model,
    voice: trimToUndefined(config.voice) ?? normalized.voice,
    speed:
      normalizeOpenAISpeechSpeed(
        config.speed,
        trimToUndefined(config.baseUrl) ?? normalized.baseUrl,
      ) ?? normalized.speed,
    instructions: trimToUndefined(config.instructions) ?? normalized.instructions,
    responseFormat:
      normalizeOpenAISpeechResponseFormat(config.responseFormat) ?? normalized.responseFormat,
    extraBody: readExtraBody(config.extraBody) ?? readExtraBody(config.extra_body),
  };
}
function readOpenAIOverrides(overrides, baseUrl) {
  if (!overrides) return {};
  return {
    model: trimToUndefined(overrides.model),
    voice: trimToUndefined(overrides.voice),
    speed: normalizeOpenAISpeechSpeed(overrides.speed, baseUrl),
  };
}
function resolveGeneratedAudioMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * 1024 * 1024);
  return DEFAULT_GENERATED_AUDIO_MAX_BYTES;
}
function renderOpenAITtsPersonaInstructions(req) {
  const prompt = req.prompt;
  if (!prompt) return;
  const lines = [
    req.label ? `Persona: ${req.label}` : void 0,
    prompt.profile ? `Profile: ${prompt.profile}` : void 0,
    prompt.scene ? `Scene: ${prompt.scene}` : void 0,
    prompt.style ? `Style: ${prompt.style}` : void 0,
    prompt.accent ? `Accent: ${prompt.accent}` : void 0,
    prompt.pacing ? `Pacing: ${prompt.pacing}` : void 0,
    prompt.sampleContext ? `Sample context: ${prompt.sampleContext}` : void 0,
    ...(prompt.constraints ?? []).map((constraint) => `Constraint: ${constraint}`),
  ]
    .map((line) => trimToUndefined(line))
    .filter((line) => Boolean(line));
  return lines.length > 0 ? lines.join("\n") : void 0;
}
function isCustomOpenAITtsBaseUrl(baseUrl) {
  if (baseUrl !== void 0) return normalizeOpenAITtsBaseUrl(baseUrl) !== DEFAULT_OPENAI_BASE_URL;
  return normalizeOpenAITtsBaseUrl(process.env.OPENAI_TTS_BASE_URL) !== DEFAULT_OPENAI_BASE_URL;
}
function parseDirectiveToken(ctx) {
  const baseUrl = trimToUndefined(asOptionalRecord(ctx.providerConfig)?.baseUrl);
  switch (ctx.key) {
    case "voice":
    case "openai_voice":
    case "openaivoice":
      if (!ctx.policy.allowVoice) return { handled: true };
      if (!isValidOpenAIVoice(ctx.value, baseUrl))
        return {
          handled: true,
          warnings: [`invalid OpenAI voice "${ctx.value}"`],
        };
      return {
        handled: true,
        overrides: { voice: ctx.value },
      };
    case "model":
    case "openai_model":
    case "openaimodel":
      if (!ctx.policy.allowModelId) return { handled: true };
      if (!isValidOpenAIModel(ctx.value, baseUrl)) return { handled: false };
      return {
        handled: true,
        overrides: { model: ctx.value },
      };
    case "speed":
    case "openai_speed":
    case "openaispeed": {
      const customBaseUrl = isCustomOpenAITtsBaseUrl(baseUrl);
      return parseSpeechDirectiveNumberOverride({
        ctx,
        overrideKey: "speed",
        range: customBaseUrl
          ? {}
          : {
              min: 0.25,
              max: 4,
            },
        warning: (value) =>
          customBaseUrl
            ? `invalid OpenAI-compatible speed "${value}"`
            : `invalid OpenAI speed "${value}" (0.25-4.0)`,
      });
    }
    default:
      return { handled: false };
  }
}
function buildOpenAISpeechProvider() {
  return {
    id: "openai",
    label: "OpenAI",
    autoSelectOrder: 10,
    defaultModel: OPENAI_TTS_MODELS[0],
    models: OPENAI_TTS_MODELS,
    voices: OPENAI_TTS_VOICES,
    resolveConfig: ({ rawConfig }) => normalizeOpenAIProviderConfig(rawConfig),
    parseDirectiveToken,
    resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
      const base = normalizeOpenAIProviderConfig(baseTtsConfig);
      const responseFormat = normalizeOpenAISpeechResponseFormat(talkProviderConfig.responseFormat);
      const baseUrl = trimToUndefined(talkProviderConfig.baseUrl) ?? base.baseUrl;
      const speed = normalizeOpenAISpeechSpeed(talkProviderConfig.speed, baseUrl);
      return {
        ...base,
        ...(talkProviderConfig.apiKey === void 0
          ? {}
          : {
              apiKey: normalizeResolvedSecretInputString({
                value: talkProviderConfig.apiKey,
                path: "talk.providers.openai.apiKey",
              }),
            }),
        ...(trimToUndefined(talkProviderConfig.baseUrl) == null ? {} : { baseUrl }),
        ...(trimToUndefined(talkProviderConfig.modelId) == null
          ? {}
          : { model: trimToUndefined(talkProviderConfig.modelId) }),
        ...(trimToUndefined(talkProviderConfig.voiceId) == null
          ? {}
          : { voice: trimToUndefined(talkProviderConfig.voiceId) }),
        ...(speed == null ? {} : { speed }),
        ...(trimToUndefined(talkProviderConfig.instructions) == null
          ? {}
          : { instructions: trimToUndefined(talkProviderConfig.instructions) }),
        ...(responseFormat == null ? {} : { responseFormat }),
      };
    },
    resolveTalkOverrides: ({ params }) => ({
      ...(trimToUndefined(params.voiceId) == null
        ? {}
        : { voice: trimToUndefined(params.voiceId) }),
      ...(trimToUndefined(params.modelId) == null
        ? {}
        : { model: trimToUndefined(params.modelId) }),
      ...(asFiniteNumber(params.speed) == null ? {} : { speed: asFiniteNumber(params.speed) }),
    }),
    listVoices: async () =>
      OPENAI_TTS_VOICES.map((voice) => ({
        id: voice,
        name: voice,
      })),
    isConfigured: ({ providerConfig }) =>
      Boolean(readOpenAIProviderConfig(providerConfig).apiKey || process.env.OPENAI_API_KEY),
    prepareSynthesis: (ctx) => {
      if (readOpenAIProviderConfig(ctx.providerConfig).instructions) return;
      const instructions = renderOpenAITtsPersonaInstructions({
        label: ctx.persona?.label ?? ctx.persona?.id,
        prompt: ctx.persona?.prompt,
      });
      return instructions ? { providerConfig: { instructions } } : void 0;
    },
    synthesize: async (req) => {
      const config = readOpenAIProviderConfig(req.providerConfig);
      const overrides = readOpenAIOverrides(req.providerOverrides, config.baseUrl);
      const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OpenAI API key missing");
      const responseFormat = resolveSpeechResponseFormat(
        config.baseUrl,
        req.target,
        config.responseFormat,
      );
      const audioBuffer = await openaiTTS({
        text: req.text,
        apiKey,
        baseUrl: config.baseUrl,
        model: overrides.model ?? config.model,
        voice: overrides.voice ?? config.voice,
        speed: overrides.speed ?? config.speed,
        instructions: config.instructions,
        responseFormat,
        extraBody: config.extraBody,
        timeoutMs: req.timeoutMs,
        maxBytes: resolveGeneratedAudioMaxBytes(req),
      });
      const fileExtension = responseFormatToFileExtension(responseFormat);
      return {
        audioBuffer,
        outputFormat: responseFormat,
        fileExtension,
        voiceCompatible:
          req.target === "voice-note" &&
          isVoiceMessageCompatibleAudio({ fileName: `speech${fileExtension}` }),
      };
    },
    synthesizeTelephony: async (req) => {
      const config = readOpenAIProviderConfig(req.providerConfig);
      const overrides = readOpenAIOverrides(req.providerOverrides, config.baseUrl);
      const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error("OpenAI API key missing");
      const outputFormat = "pcm";
      return {
        audioBuffer: await openaiTTS({
          text: req.text,
          apiKey,
          baseUrl: config.baseUrl,
          model: overrides.model ?? config.model,
          voice: overrides.voice ?? config.voice,
          speed: overrides.speed ?? config.speed,
          instructions: config.instructions,
          responseFormat: outputFormat,
          extraBody: config.extraBody,
          timeoutMs: req.timeoutMs,
          maxBytes: resolveGeneratedAudioMaxBytes(req),
        }),
        outputFormat,
        sampleRate: 24e3,
      };
    },
  };
}
//#endregion
export { buildOpenAISpeechProvider as t };
