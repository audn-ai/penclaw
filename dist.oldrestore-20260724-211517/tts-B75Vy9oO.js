import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./speech-core-CWj6o89Y.js";
import "./response-limit-runtime-B_DBKaLw.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
//#region extensions/azure-speech/tts.ts
/**
 * Azure Speech REST helpers. They normalize endpoints, build SSML, list voices,
 * and synthesize speech with response-size and SSRF guards.
 */
/** Default Azure Speech neural voice. */
const DEFAULT_AZURE_SPEECH_VOICE = "en-US-JennyNeural";
/** Default Azure Speech language. */
const DEFAULT_AZURE_SPEECH_LANG = "en-US";
/** Default full-audio output format. */
const DEFAULT_AZURE_SPEECH_AUDIO_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
/** Default voice-note output format. */
const DEFAULT_AZURE_SPEECH_VOICE_NOTE_FORMAT = "ogg-24khz-16bit-mono-opus";
/** Default telephony output format. */
const DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT = "raw-8khz-8bit-mono-mulaw";
const DEFAULT_AZURE_SPEECH_MAX_BYTES = 16 * 1024 * 1024;
const DEFAULT_AZURE_SPEECH_VOICE_LIST_TIMEOUT_MS = 3e4;
/** Resolve and normalize the Azure Speech base URL from endpoint or region. */
function normalizeAzureSpeechBaseUrl(params) {
  const configured =
    normalizeOptionalString(params.baseUrl) ?? normalizeOptionalString(params.endpoint);
  if (configured) return configured.replace(/\/+$/, "").replace(/\/cognitiveservices\/v1$/i, "");
  const region = normalizeOptionalString(params.region);
  return region ? `https://${region}.tts.speech.microsoft.com` : void 0;
}
function azureSpeechUrl(params) {
  const baseUrl = normalizeAzureSpeechBaseUrl(params);
  if (!baseUrl) throw new Error("Azure Speech region or endpoint missing");
  return `${baseUrl}${params.path}`;
}
function escapeXmlText(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeXmlAttr(value) {
  return escapeXmlText(value).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
/** Build escaped SSML for one Azure Speech synthesis request. */
function buildAzureSpeechSsml(params) {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${escapeXmlAttr(normalizeOptionalString(params.lang) ?? "en-US")}"><voice name="${escapeXmlAttr(params.voice)}">${escapeXmlText(params.text)}</voice></speak>`;
}
/** Infer the generated audio file extension from Azure output format. */
function inferAzureSpeechFileExtension(outputFormat) {
  const normalized = outputFormat.toLowerCase();
  if (normalized.includes("mp3")) return ".mp3";
  if (normalized.startsWith("ogg-")) return ".ogg";
  if (normalized.startsWith("webm-")) return ".webm";
  if (normalized.startsWith("riff-")) return ".wav";
  if (normalized.startsWith("raw-")) return ".pcm";
  if (normalized.startsWith("amr-")) return ".amr";
  return ".audio";
}
/** Return whether an Azure output format is voice-note compatible. */
function isAzureSpeechVoiceCompatible(outputFormat) {
  const normalized = outputFormat.toLowerCase();
  return normalized.startsWith("ogg-") && normalized.includes("opus");
}
function formatVoiceDescription(entry) {
  const parts = [
    ...(entry.VoiceTag?.TailoredScenarios ?? []),
    ...(entry.VoiceTag?.VoicePersonalities ?? []),
  ].filter((value) => normalizeOptionalString(value) !== void 0);
  return parts.length > 0 ? parts.join(", ") : void 0;
}
function isDeprecatedVoice(entry) {
  if (entry.IsDeprecated === true) return true;
  if (typeof entry.IsDeprecated === "string" && entry.IsDeprecated.toLowerCase() === "true")
    return true;
  const status = normalizeOptionalString(entry.Status)?.toLowerCase();
  return status === "deprecated" || status === "retired" || status === "disabled";
}
/** List non-deprecated voices from the Azure Speech voices API. */
async function listAzureSpeechVoices(params) {
  const url = azureSpeechUrl({
    ...params,
    path: "/cognitiveservices/voices/list",
  });
  const { response, release } = await fetchWithSsrFGuard({
    url,
    init: {
      method: "GET",
      headers: { "Ocp-Apim-Subscription-Key": params.apiKey },
    },
    timeoutMs: params.timeoutMs ?? DEFAULT_AZURE_SPEECH_VOICE_LIST_TIMEOUT_MS,
    policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(url),
    auditContext: "azure-speech.voices",
  });
  try {
    await assertOkOrThrowProviderError(response, "Azure Speech voices API error");
    const voices = await readProviderJsonResponse(response, "azure-speech.voices");
    return Array.isArray(voices)
      ? voices
          .filter((voice) => !isDeprecatedVoice(voice))
          .map((voice) => ({
            id: normalizeOptionalString(voice.ShortName) ?? "",
            name:
              normalizeOptionalString(voice.DisplayName) ??
              normalizeOptionalString(voice.LocalName),
            description: formatVoiceDescription(voice),
            locale: normalizeOptionalString(voice.Locale),
            gender: normalizeOptionalString(voice.Gender),
            personalities: voice.VoiceTag?.VoicePersonalities?.filter(
              (value) => normalizeOptionalString(value) !== void 0,
            ),
          }))
          .filter((voice) => voice.id.length > 0)
      : [];
  } finally {
    await release();
  }
}
/** Synthesize text to audio bytes using Azure Speech TTS. */
async function azureSpeechTTS(params) {
  const voice = normalizeOptionalString(params.voice) ?? "en-US-JennyNeural";
  const outputFormat =
    normalizeOptionalString(params.outputFormat) ?? "audio-24khz-48kbitrate-mono-mp3";
  const url = azureSpeechUrl({
    ...params,
    path: "/cognitiveservices/v1",
  });
  const { response, release } = await fetchWithSsrFGuard({
    url,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/ssml+xml",
        "Ocp-Apim-Subscription-Key": params.apiKey,
        "X-Microsoft-OutputFormat": outputFormat,
        "User-Agent": "OpenClaw",
      },
      body: buildAzureSpeechSsml({
        text: params.text,
        voice,
        lang: params.lang,
      }),
    },
    timeoutMs: params.timeoutMs,
    policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(url),
    auditContext: "azure-speech.tts",
  });
  try {
    await assertOkOrThrowProviderError(response, "Azure Speech TTS API error");
    return await readResponseWithLimit(
      response,
      params.maxBytes ?? DEFAULT_AZURE_SPEECH_MAX_BYTES,
      {
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`Azure Speech TTS audio response exceeds ${maxBytes} bytes`),
      },
    );
  } finally {
    await release();
  }
}
//#endregion
export {
  DEFAULT_AZURE_SPEECH_VOICE_NOTE_FORMAT as a,
  inferAzureSpeechFileExtension as c,
  normalizeAzureSpeechBaseUrl as d,
  DEFAULT_AZURE_SPEECH_VOICE as i,
  isAzureSpeechVoiceCompatible as l,
  DEFAULT_AZURE_SPEECH_LANG as n,
  azureSpeechTTS as o,
  DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT as r,
  buildAzureSpeechSsml as s,
  DEFAULT_AZURE_SPEECH_AUDIO_FORMAT as t,
  listAzureSpeechVoices as u,
};
