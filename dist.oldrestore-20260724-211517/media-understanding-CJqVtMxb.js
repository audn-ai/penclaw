import { t as OPENAI_AUDIO_TRANSCRIPTIONS_API } from "./openai-audio-api-BEkNYRPi.js";
import "./image-runtime-Bf0M579x.js";
import {
  p as readProviderJsonObjectResponse,
  r as assertOkOrThrowHttpError,
} from "./provider-http-errors-DLMRBkZU.js";
import {
  d as requireTranscriptionText,
  p as resolveProviderHttpRequestConfig,
  t as buildAudioTranscriptionFormData,
  u as postTranscriptionRequest,
} from "./shared-CfGzzOqJ.js";
//#region packages/media-understanding-common/src/openai-compatible-video.ts
/** Trim optional strings, falling back when empty. */
function resolveMediaUnderstandingString(value, fallback) {
  return value?.trim() || fallback;
}
/** Coerce text from OpenAI-compatible content or reasoning fields. */
function coerceOpenAiCompatibleVideoText(payload) {
  const message = payload.choices?.[0]?.message;
  if (!message) return null;
  if (typeof message.content === "string" && message.content.trim()) return message.content.trim();
  if (Array.isArray(message.content)) {
    const text = message.content
      .map((part) => part.text?.trim() ?? "")
      .filter(Boolean)
      .join("\n");
    if (text) return text;
  }
  if (typeof message.reasoning_content === "string" && message.reasoning_content.trim())
    return message.reasoning_content.trim();
  return null;
}
/** Build an OpenAI-compatible request body with an inline data URL video. */
function buildOpenAiCompatibleVideoRequestBody(params) {
  return {
    model: params.model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: params.prompt,
          },
          {
            type: "video_url",
            video_url: { url: `data:${params.mime};base64,${params.buffer.toString("base64")}` },
          },
        ],
      },
    ],
  };
}
//#endregion
//#region src/media-understanding/openai-compatible-audio.ts
function resolveModel(model, fallback) {
  return model?.trim() || fallback;
}
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
async function transcribeOpenAiCompatibleAudio(params) {
  const fetchFn = params.fetchFn ?? fetch;
  const apiKey = params.auth?.kind === "api-key" ? params.auth.apiKey : params.apiKey;
  const defaultHeaders =
    params.auth?.kind === "none" || !apiKey ? void 0 : { authorization: `Bearer ${apiKey}` };
  const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
    resolveProviderHttpRequestConfig({
      baseUrl: params.baseUrl,
      defaultBaseUrl: params.defaultBaseUrl,
      headers: params.headers,
      request: params.request,
      defaultHeaders,
      provider: params.provider,
      api: OPENAI_AUDIO_TRANSCRIPTIONS_API,
      capability: "audio",
      transport: "media-understanding",
    });
  const url = `${baseUrl}/audio/transcriptions`;
  const model = resolveModel(params.model, params.defaultModel);
  const { response: res, release } = await postTranscriptionRequest({
    url,
    headers,
    body: buildAudioTranscriptionFormData({
      buffer: params.buffer,
      fileName: params.fileName,
      mime: params.mime,
      fields: {
        model,
        language: params.language,
        prompt: params.prompt,
      },
    }),
    timeoutMs: params.timeoutMs,
    fetchFn,
    pinDns: false,
    allowPrivateNetwork,
    dispatcherPolicy,
  });
  try {
    await assertOkOrThrowHttpError(res, "Audio transcription failed");
    const payload = await readProviderJsonObjectResponse(res, "Audio transcription failed");
    return {
      text: requireTranscriptionText(
        typeof payload.text === "string" ? payload.text : void 0,
        "Audio transcription response missing text",
      ),
      model,
    };
  } finally {
    await release();
  }
}
//#endregion
export {
  resolveMediaUnderstandingString as i,
  buildOpenAiCompatibleVideoRequestBody as n,
  coerceOpenAiCompatibleVideoText as r,
  transcribeOpenAiCompatibleAudio as t,
};
