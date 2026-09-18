import { n as parseBooleanValue } from "./boolean-CrriykWV.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { i as isProviderAuthProfileConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./secret-input-D1aG0n6v.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
import "./model-definitions-BoOPeWPv.js";
//#region extensions/xai/realtime-voice-config.ts
const XAI_REALTIME_DEFAULT_MODEL = "grok-voice-latest";
const XAI_REALTIME_CONNECT_TIMEOUT_MS = 1e4;
const XAI_REALTIME_WS_MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
const XAI_REALTIME_MAX_RECONNECT_ATTEMPTS = 5;
const XAI_REALTIME_BASE_RECONNECT_DELAY_MS = 1e3;
const XAI_REALTIME_MAX_PENDING_TOOL_RESULTS = 128;
const XAI_REALTIME_MAX_PENDING_USER_MESSAGES = 128;
const XAI_REALTIME_DEFAULT_VAD_THRESHOLD = 0.85;
const XAI_REALTIME_DEFAULT_PREFIX_PADDING_MS = 333;
const XAI_REALTIME_DEFAULT_SILENCE_DURATION_MS = 500;
const XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL = "grok-transcribe";
const XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX =
  "Conversation already has an active response in progress:";
const XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR =
  "Cancellation failed: no active response found";
const XAI_REALTIME_VOICES = ["eve", "ara", "rex", "sal", "leo"];
function readRecord(value) {
  return value && typeof value === "object" ? value : void 0;
}
function readNestedXaiConfig(rawConfig) {
  const raw = readRecord(rawConfig);
  return readRecord(readRecord(raw?.providers)?.xai ?? raw?.xai ?? raw) ?? {};
}
function normalizeXaiRealtimeBaseUrl(value) {
  return normalizeOptionalString(value ?? process.env.XAI_BASE_URL) ?? "https://api.x.ai/v1";
}
function normalizeXaiRealtimeVoice(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  const lower = normalized.toLowerCase();
  return XAI_REALTIME_VOICES.includes(lower) ? lower : normalized;
}
function asXaiVadThreshold(value) {
  const number = asFiniteNumber(value);
  return number !== void 0 && number >= 0.1 && number <= 0.9 ? number : void 0;
}
function asXaiDurationMs(value) {
  const number = asFiniteNumber(value);
  return number !== void 0 && Number.isSafeInteger(number) && number >= 0 && number <= 1e4
    ? number
    : void 0;
}
function asXaiReasoningEffort(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  if (normalized === "high" || normalized === "none") return normalized;
  throw new Error('xAI realtime voice reasoningEffort must be "high" or "none"');
}
function normalizeXaiRealtimeProviderConfig(config) {
  const raw = readNestedXaiConfig(config);
  return {
    apiKey: normalizeResolvedSecretInputString({
      value: raw.apiKey,
      path: "plugins.entries.voice-call.config.realtime.providers.xai.apiKey",
    }),
    baseUrl: normalizeOptionalString(raw.baseUrl),
    model: normalizeOptionalString(raw.model),
    voice: normalizeXaiRealtimeVoice(raw.speakerVoice ?? raw.voice),
    vadThreshold: asXaiVadThreshold(raw.vadThreshold),
    silenceDurationMs: asXaiDurationMs(raw.silenceDurationMs),
    prefixPaddingMs: asXaiDurationMs(raw.prefixPaddingMs),
    interruptResponseOnInputAudio: parseBooleanValue(raw.interruptResponseOnInputAudio),
    reasoningEffort: asXaiReasoningEffort(raw.reasoningEffort),
    sessionResumption: parseBooleanValue(raw.sessionResumption),
  };
}
function readXaiRealtimeErrorDetail(error) {
  if (typeof error === "string" && error) return error;
  const record = readRecord(error);
  return (
    normalizeOptionalString(record?.message) ??
    normalizeOptionalString(record?.code) ??
    "xAI realtime voice error"
  );
}
function toXaiRealtimeWsUrl(baseUrl, model, conversationId) {
  const url = new URL(normalizeXaiRealtimeBaseUrl(baseUrl));
  url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/realtime`;
  url.searchParams.set("model", model);
  if (conversationId) url.searchParams.set("conversation_id", conversationId);
  return url.toString();
}
async function resolveXaiRealtimeApiKey(configApiKey, cfg) {
  const direct =
    normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
  if (direct) return direct;
  const oauthKey = normalizeOptionalString(
    (
      await resolveApiKeyForProvider({
        provider: "xai",
        cfg,
      })
    )?.apiKey,
  );
  if (oauthKey) return oauthKey;
  throw new Error(
    "xAI credentials missing for realtime voice. Sign in with `openclaw onboard --auth-choice xai-oauth`, run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.",
  );
}
function hasXaiRealtimeApiKeyInput(configApiKey, cfg) {
  if (normalizeOptionalString(configApiKey) || normalizeOptionalString(process.env.XAI_API_KEY))
    return true;
  return isProviderAuthProfileConfigured({
    provider: "xai",
    cfg,
  });
}
//#endregion
export {
  readXaiRealtimeErrorDetail as _,
  XAI_REALTIME_DEFAULT_PREFIX_PADDING_MS as a,
  XAI_REALTIME_INPUT_TRANSCRIPTION_MODEL as c,
  XAI_REALTIME_MAX_RECONNECT_ATTEMPTS as d,
  XAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR as f,
  normalizeXaiRealtimeProviderConfig as g,
  normalizeXaiRealtimeBaseUrl as h,
  XAI_REALTIME_DEFAULT_MODEL as i,
  XAI_REALTIME_MAX_PENDING_TOOL_RESULTS as l,
  hasXaiRealtimeApiKeyInput as m,
  XAI_REALTIME_BASE_RECONNECT_DELAY_MS as n,
  XAI_REALTIME_DEFAULT_SILENCE_DURATION_MS as o,
  XAI_REALTIME_WS_MAX_PAYLOAD_BYTES as p,
  XAI_REALTIME_CONNECT_TIMEOUT_MS as r,
  XAI_REALTIME_DEFAULT_VAD_THRESHOLD as s,
  XAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX as t,
  XAI_REALTIME_MAX_PENDING_USER_MESSAGES as u,
  resolveXaiRealtimeApiKey as v,
  toXaiRealtimeWsUrl as y,
};
