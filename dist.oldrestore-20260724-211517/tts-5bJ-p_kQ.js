import WebSocket$1 from "ws";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { t as XAI_BASE_URL } from "./model-definitions-BoOPeWPv.js";
import {
  i as assertOkOrThrowProviderError,
  m as readProviderJsonResponse,
  n as asObject,
} from "./provider-http-errors-DLMRBkZU.js";
import { c as postJsonRequest } from "./shared-CfGzzOqJ.js";
import "./response-limit-runtime-B_DBKaLw.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-http-BDIltggC.js";
import "./speech-CYe6S4Fp.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
import "./api-CUUZZEIO.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as xaiUserAgentHeaderFor } from "./xai-user-agent-CGKMBFuk.js";
//#region extensions/xai/tts.ts
const DEFAULT_TTS_MAX_BYTES = 16 * 1024 * 1024;
const XAI_TTS_VOICE_LIST_TIMEOUT_MS = 3e4;
const XAI_TTS_VOICE_LIST_MAX_BYTES = 1024 * 1024;
const XAI_TTS_STREAM_TEXT_DELTA_MAX_CHARS = 15e3;
const XAI_TTS_FALLBACK_VOICES = ["ara", "eve", "leo", "rex", "sal"];
function normalizeXaiTtsBaseUrl(baseUrl) {
  const trimmed = baseUrl?.trim();
  if (!trimmed) return XAI_BASE_URL;
  return trimmed.replace(/\/+$/, "");
}
function isValidXaiTtsVoice(voice) {
  return normalizeOptionalString(voice) !== void 0;
}
async function listXaiTtsVoices(params) {
  const baseUrl = normalizeXaiTtsBaseUrl(params.baseUrl);
  const { response, release } = await fetchWithSsrFGuard({
    url: `${baseUrl}/tts/voices`,
    init: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        ...xaiUserAgentHeaderFor(baseUrl),
      },
    },
    timeoutMs: XAI_TTS_VOICE_LIST_TIMEOUT_MS,
    policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
    auditContext: "xai tts voices",
  });
  try {
    await assertOkOrThrowProviderError(response, "xAI TTS voices API error");
    const voices = asObject(
      await readProviderJsonResponse(response, "xAI TTS voices", {
        maxBytes: XAI_TTS_VOICE_LIST_MAX_BYTES,
      }),
    )?.voices;
    if (!Array.isArray(voices)) throw new Error("xAI TTS voices: malformed JSON response");
    return voices.flatMap((value) => {
      const voice = asObject(value);
      const id = normalizeOptionalString(voice?.voice_id);
      if (!id) return [];
      return [
        {
          id,
          name: normalizeOptionalString(voice?.name),
          locale: normalizeOptionalString(voice?.language),
          gender: normalizeOptionalString(voice?.gender),
        },
      ];
    });
  } finally {
    await release();
  }
}
function normalizeXaiLanguageCode(value) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return;
  const normalized = trimmed.toLowerCase();
  if (normalized === "auto" || /^[a-z]{2,3}(?:-[a-z]{2,4})?$/.test(normalized)) return normalized;
  throw new Error(
    `xAI language must be "auto" or a BCP-47 tag (e.g. "en", "pt-br", "zh-cn"); got: ${normalized}`,
  );
}
const XAI_NATIVE_TTS_STREAM_HOST = "api.x.ai";
function toXaiTtsWsUrl(params) {
  assertXaiNativeTtsStreamEndpoint(params.baseUrl);
  const url = new URL(normalizeXaiTtsBaseUrl(params.baseUrl));
  url.protocol = "wss:";
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/tts`;
  url.searchParams.set("language", params.language);
  url.searchParams.set("voice", params.voiceId);
  url.searchParams.set("codec", params.responseFormat);
  if (params.speed != null) url.searchParams.set("speed", String(params.speed));
  return url.toString();
}
function readXaiTtsStreamErrorMessage(event) {
  return normalizeOptionalString(event.message) ?? "xAI TTS stream error";
}
function parseXaiTtsStreamBaseUrl(baseUrl) {
  try {
    return new URL(normalizeXaiTtsBaseUrl(baseUrl));
  } catch {
    throw new Error(`Invalid xAI TTS stream baseUrl: ${baseUrl}`);
  }
}
function assertXaiNativeTtsStreamEndpoint(baseUrl) {
  const url = parseXaiTtsStreamBaseUrl(baseUrl);
  if (url.protocol !== "https:")
    throw new Error(
      `xAI streaming TTS only supports HTTPS for the native ${XAI_NATIVE_TTS_STREAM_HOST} endpoint; got protocol "${url.protocol}"`,
    );
  const hostname = url.hostname.toLowerCase();
  if (hostname !== XAI_NATIVE_TTS_STREAM_HOST)
    throw new Error(
      `xAI streaming TTS only supports the native ${XAI_NATIVE_TTS_STREAM_HOST} endpoint; got host "${hostname}"`,
    );
  const pathname = url.pathname.replace(/\/+$/, "");
  if (url.username || url.password || url.port || pathname !== "/v1" || url.search || url.hash)
    throw new Error(`xAI streaming TTS requires the canonical ${XAI_BASE_URL} base URL`);
}
function decodeWebSocketTextMessage(data) {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  throw new Error("xAI TTS stream received unsupported WebSocket message payload");
}
async function xaiTTSStream(params) {
  const {
    text,
    apiKey,
    baseUrl,
    voiceId,
    language: rawLanguage,
    speed,
    responseFormat = "mp3",
    timeoutMs,
    maxBytes = DEFAULT_TTS_MAX_BYTES,
  } = params;
  const language = normalizeXaiLanguageCode(rawLanguage) ?? "en";
  if (!isValidXaiTtsVoice(voiceId)) throw new Error(`Invalid voice: ${voiceId}`);
  assertXaiNativeTtsStreamEndpoint(baseUrl);
  const wsUrl = toXaiTtsWsUrl({
    baseUrl,
    voiceId,
    language,
    responseFormat,
    speed,
  });
  const maxPayload = Math.ceil(maxBytes / 3) * 4 + 1024;
  return await new Promise((resolve, reject) => {
    let connectSettled = false;
    let released = false;
    let synthesisTimer;
    let connectTimer;
    let ws;
    let errorStream;
    let closeStream;
    let streamClosed = false;
    const clearTimers = () => {
      if (connectTimer) {
        clearTimeout(connectTimer);
        connectTimer = void 0;
      }
      if (synthesisTimer) {
        clearTimeout(synthesisTimer);
        synthesisTimer = void 0;
      }
    };
    const release = async () => {
      if (released) return;
      released = true;
      clearTimers();
      closeStream?.();
      const socket = ws;
      ws = void 0;
      if (!socket) return;
      if (socket.readyState === WebSocket$1.OPEN || socket.readyState === WebSocket$1.CONNECTING)
        socket.close();
      else if (socket.readyState !== WebSocket$1.CLOSED) socket.terminate();
    };
    const failConnect = (error) => {
      if (connectSettled) return;
      connectSettled = true;
      clearTimers();
      release();
      reject(error);
    };
    const failStream = (error) => {
      if (released || streamClosed) return;
      clearTimers();
      errorStream?.(error);
      release();
    };
    const refreshSynthesisTimer = () => {
      if (synthesisTimer) clearTimeout(synthesisTimer);
      synthesisTimer = setTimeout(() => {
        failStream(/* @__PURE__ */ new Error("xAI TTS stream synthesis timeout"));
      }, timeoutMs);
    };
    try {
      ws = new WebSocket$1(wsUrl, {
        maxPayload,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...xaiUserAgentHeaderFor(baseUrl),
        },
      });
    } catch (error) {
      failConnect(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    connectTimer = setTimeout(() => {
      failConnect(/* @__PURE__ */ new Error("xAI TTS stream connection timeout"));
    }, timeoutMs);
    ws.once("unexpected-response", (_request, response) => {
      failConnect(
        /* @__PURE__ */ new Error(
          `xAI TTS stream connection failed (${response.statusCode ?? "unknown"}): ${response.statusMessage ?? "upgrade rejected"}`,
        ),
      );
    });
    ws.once("error", (error) => {
      const normalized = error instanceof Error ? error : new Error(String(error));
      if (connectSettled) {
        failStream(normalized);
        return;
      }
      failConnect(normalized);
    });
    ws.once("close", () => {
      if (connectSettled) return;
      failConnect(/* @__PURE__ */ new Error("xAI TTS stream connection closed before open"));
    });
    ws.once("open", () => {
      if (connectSettled) return;
      connectSettled = true;
      clearTimers();
      refreshSynthesisTimer();
      let totalBytes = 0;
      let enqueue;
      const wiredStream = new ReadableStream({
        start(streamController) {
          enqueue = (chunk) => {
            if (streamClosed) return;
            streamController.enqueue(chunk);
          };
          closeStream = () => {
            if (streamClosed) return;
            streamClosed = true;
            streamController.close();
          };
          errorStream = (error) => {
            if (streamClosed) return;
            streamClosed = true;
            streamController.error(error);
          };
        },
        cancel() {
          streamClosed = true;
          release();
        },
      });
      const handleServerEvent = (event) => {
        switch (event.type) {
          case "audio.delta": {
            const encoded = normalizeOptionalString(event.delta);
            if (!encoded) return;
            const chunk = Buffer.from(encoded, "base64");
            totalBytes += chunk.length;
            if (totalBytes > maxBytes) {
              errorStream?.(
                /* @__PURE__ */ new Error(`xAI TTS audio stream exceeds ${maxBytes} bytes`),
              );
              release();
              return;
            }
            enqueue?.(new Uint8Array(chunk));
            refreshSynthesisTimer();
            return;
          }
          case "audio.done":
            clearTimers();
            closeStream?.();
            release();
            return;
          case "error":
            failStream(new Error(readXaiTtsStreamErrorMessage(event)));
          default:
        }
      };
      ws?.on("message", (data) => {
        if (streamClosed || released) return;
        try {
          const payload = decodeWebSocketTextMessage(data);
          handleServerEvent(JSON.parse(payload));
        } catch (error) {
          failStream(error instanceof Error ? error : new Error(String(error)));
        }
      });
      ws?.on("close", () => {
        if (streamClosed || released) return;
        failStream(/* @__PURE__ */ new Error("xAI TTS stream closed before audio.done"));
      });
      try {
        for (let offset = 0; offset < text.length;) {
          let end = Math.min(offset + XAI_TTS_STREAM_TEXT_DELTA_MAX_CHARS, text.length);
          if (
            end < text.length &&
            text.charCodeAt(end - 1) >= 55296 &&
            text.charCodeAt(end - 1) <= 56319 &&
            text.charCodeAt(end) >= 56320 &&
            text.charCodeAt(end) <= 57343
          )
            end -= 1;
          ws?.send(
            JSON.stringify({
              type: "text.delta",
              delta: text.slice(offset, end),
            }),
          );
          offset = end;
        }
        ws?.send(JSON.stringify({ type: "text.done" }));
      } catch (error) {
        failStream(error instanceof Error ? error : new Error(String(error)));
      }
      resolve({
        audioStream: wiredStream,
        release,
      });
    });
  });
}
async function xaiTTS(params) {
  const {
    text,
    apiKey,
    baseUrl,
    voiceId,
    language: rawLanguage,
    speed,
    responseFormat = "mp3",
    timeoutMs,
    maxBytes = DEFAULT_TTS_MAX_BYTES,
  } = params;
  const language = normalizeXaiLanguageCode(rawLanguage) ?? "en";
  if (!isValidXaiTtsVoice(voiceId)) throw new Error(`Invalid voice: ${voiceId}`);
  const ttsBaseUrl = normalizeXaiTtsBaseUrl(baseUrl);
  const { response, release } = await postJsonRequest({
    url: `${ttsBaseUrl}/tts`,
    headers: new Headers({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...xaiUserAgentHeaderFor(ttsBaseUrl),
    }),
    body: {
      text,
      voice_id: voiceId,
      language,
      output_format: { codec: responseFormat },
      ...(speed != null && { speed }),
    },
    timeoutMs,
    fetchFn: fetch,
    auditContext: "xai tts",
  });
  try {
    await assertOkOrThrowProviderError(response, "xAI TTS API error");
    return await readResponseWithLimit(response, maxBytes, {
      onOverflow: ({ maxBytes: maxBytesLocal }) =>
        /* @__PURE__ */ new Error(`xAI TTS audio response exceeds ${maxBytesLocal} bytes`),
    });
  } finally {
    await release();
  }
}
//#endregion
export {
  listXaiTtsVoices as a,
  toXaiTtsWsUrl as c,
  isValidXaiTtsVoice as i,
  xaiTTS as l,
  assertXaiNativeTtsStreamEndpoint as n,
  normalizeXaiLanguageCode as o,
  decodeWebSocketTextMessage as r,
  normalizeXaiTtsBaseUrl as s,
  XAI_TTS_FALLBACK_VOICES as t,
  xaiTTSStream as u,
};
