import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { r as extensionForMime } from "./mime-BSEMEb3s.js";
import { t as executeProviderOperationWithRetry } from "./operation-retry-Hj3NkVFd.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import { r as assertOkOrThrowHttpError } from "./provider-http-errors-DLMRBkZU.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DpW-uV6A.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./response-limit-runtime-B_DBKaLw.js";
import {
  c as postJsonRequest,
  h as resolveProviderOperationTimeoutMs,
  n as createProviderOperationDeadline,
  o as fetchWithTimeoutGuarded,
  p as resolveProviderHttpRequestConfig,
} from "./shared-CfGzzOqJ.js";
import "./media-mime-B8w43n5Y.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./provider-http-BDIltggC.js";
//#region extensions/minimax/music-generation-provider.ts
const DEFAULT_MINIMAX_MUSIC_BASE_URL = "https://api.minimax.io";
const DEFAULT_MINIMAX_MUSIC_MODEL = "music-2.6";
const DEFAULT_TIMEOUT_MS = 12e4;
const DEFAULT_OPERATION_TIMEOUT_MS = 3e5;
const DEFAULT_GENERATED_MUSIC_MAX_BYTES = 16 * 1024 * 1024;
const STREAM_ENVELOPE_MAX_BYTES_MULTIPLIER = 5;
const STREAM_ENVELOPE_OVERHEAD_BYTES = 64 * 1024;
function resolveMinimaxMusicBaseUrl(cfg, providerId) {
  const direct = normalizeOptionalString(cfg?.models?.providers?.[providerId]?.baseUrl);
  if (!direct) return DEFAULT_MINIMAX_MUSIC_BASE_URL;
  try {
    return new URL(direct).origin;
  } catch {
    return DEFAULT_MINIMAX_MUSIC_BASE_URL;
  }
}
function assertMinimaxBaseResp(baseResp, context) {
  if (!baseResp || typeof baseResp.status_code !== "number" || baseResp.status_code === 0) return;
  throw new Error(
    `${context} (${baseResp.status_code}): ${baseResp.status_msg ?? "unknown error"}`,
  );
}
function resolveMinimaxGuardedRequestOptions(policy) {
  if (!policy.allowPrivateNetwork && !policy.dispatcherPolicy) return;
  return {
    ...(policy.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {}),
    ...(policy.dispatcherPolicy ? { dispatcherPolicy: policy.dispatcherPolicy } : {}),
  };
}
function decodePossibleBinaryWithLimit(data, maxBytes) {
  const trimmed = data.trim();
  if (/^[0-9a-f]+$/iu.test(trimmed) && trimmed.length % 2 === 0) {
    if (trimmed.length / 2 > maxBytes) throw createGeneratedMusicTooLargeError(maxBytes);
    return Buffer.from(trimmed, "hex");
  }
  if (Buffer.byteLength(trimmed, "base64") > maxBytes)
    throw createGeneratedMusicTooLargeError(maxBytes);
  return Buffer.from(trimmed, "base64");
}
function decodePossibleText(data) {
  const trimmed = data.trim();
  if (!trimmed) return "";
  if (/^[0-9a-f]+$/iu.test(trimmed) && trimmed.length % 2 === 0)
    return Buffer.from(trimmed, "hex").toString("utf8").trim();
  return trimmed;
}
function isLikelyRemoteUrl(value) {
  const trimmed = normalizeOptionalString(value);
  return Boolean(trimmed && /^https?:\/\//iu.test(trimmed));
}
function resolveGeneratedMusicMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * 1024 * 1024);
  return DEFAULT_GENERATED_MUSIC_MAX_BYTES;
}
async function downloadTrackFromUrl(params) {
  const result = await executeProviderOperationWithRetry({
    provider: "minimax",
    stage: "download",
    operation: async () => {
      const guardedResult = await fetchWithTimeoutGuarded(
        params.url,
        { method: "GET" },
        params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        params.fetchFn,
        resolveMinimaxGuardedRequestOptions(params.policy),
      );
      try {
        await assertOkOrThrowHttpError(
          guardedResult.response,
          "MiniMax generated music download failed",
        );
      } catch (error) {
        await guardedResult.release();
        throw error;
      }
      return guardedResult;
    },
  });
  try {
    const mimeType =
      normalizeOptionalString(result.response.headers.get("content-type")) ?? "audio/mpeg";
    const ext = extensionForMime(mimeType)?.replace(/^\./u, "") || "mp3";
    return {
      buffer: await readResponseWithLimit(result.response, params.maxBytes, {
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`MiniMax generated music download exceeds ${maxBytes} bytes`),
      }),
      mimeType,
      fileName: `track-1.${ext}`,
    };
  } finally {
    await result.release();
  }
}
function createMinimaxMusicTimeoutError(deadline) {
  const timeoutLabel =
    typeof deadline.timeoutMs === "number" ? ` after ${deadline.timeoutMs}ms` : "";
  return /* @__PURE__ */ new Error(`${deadline.label} timed out${timeoutLabel}`);
}
function resolveBodyReadTimeoutMs(deadline) {
  return resolveProviderOperationTimeoutMs({
    deadline,
    defaultTimeoutMs: deadline.timeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS,
  });
}
function createGeneratedMusicTooLargeError(maxBytes) {
  return /* @__PURE__ */ new Error(`MiniMax generated music download exceeds ${maxBytes} bytes`);
}
function resolveStreamEnvelopeMaxBytes(maxBytes) {
  return Math.max(
    STREAM_ENVELOPE_OVERHEAD_BYTES,
    maxBytes * STREAM_ENVELOPE_MAX_BYTES_MULTIPLIER + STREAM_ENVELOPE_OVERHEAD_BYTES,
  );
}
async function readResponseBufferWithDeadline(response, deadline, maxBytes) {
  const body = response.body;
  if (!body) return Buffer.alloc(0);
  const reader = body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      let timeoutId;
      try {
        const timeoutMs = resolveBodyReadTimeoutMs(deadline);
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(createMinimaxMusicTimeoutError(deadline)), timeoutMs);
        });
        const result = await Promise.race([reader.read(), timeoutPromise]);
        if (result.done) break;
        if (!result.value || result.value.length === 0) continue;
        const nextTotalBytes = totalBytes + result.value.byteLength;
        if (nextTotalBytes > maxBytes) {
          const error = createGeneratedMusicTooLargeError(maxBytes);
          try {
            await reader.cancel(error);
          } catch {}
          throw error;
        }
        chunks.push(result.value);
        totalBytes = nextTotalBytes;
      } catch (error) {
        try {
          await reader.cancel(error);
        } catch {}
        throw error;
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }
  } finally {
    reader.releaseLock();
  }
  const buffer = Buffer.allocUnsafe(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}
async function readStreamingTrack(response, deadline, maxBytes) {
  const contentType = normalizeOptionalString(response.headers.get("content-type")) ?? "";
  if (contentType.toLowerCase().startsWith("audio/")) {
    const ext = extensionForMime(contentType)?.replace(/^\./u, "") || "mp3";
    return {
      buffer: await readResponseBufferWithDeadline(response, deadline, maxBytes),
      mimeType: contentType,
      fileName: `track-1.${ext}`,
    };
  }
  const chunks = [];
  let decodedBytes = 0;
  const text = new TextDecoder().decode(
    await readResponseBufferWithDeadline(
      response,
      deadline,
      resolveStreamEnvelopeMaxBytes(maxBytes),
    ),
  );
  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line.startsWith("data:")) continue;
    const json = line.slice(5).trim();
    if (!json || json === "[DONE]") continue;
    const frame = JSON.parse(json);
    assertMinimaxBaseResp(frame.base_resp, "MiniMax music generation failed");
    const audio = normalizeOptionalString(frame.data?.audio);
    if (audio) {
      if (String(frame.data?.status ?? "") === "2" && chunks.length > 0) continue;
      const chunk = decodePossibleBinaryWithLimit(audio, maxBytes - decodedBytes);
      const nextDecodedBytes = decodedBytes + chunk.byteLength;
      if (nextDecodedBytes > maxBytes) throw createGeneratedMusicTooLargeError(maxBytes);
      chunks.push(chunk);
      decodedBytes = nextDecodedBytes;
    }
  }
  const buffer = Buffer.concat(chunks);
  if (buffer.byteLength === 0)
    throw new Error("MiniMax music generation response missing audio output");
  return {
    buffer,
    mimeType: "audio/mpeg",
    fileName: "track-1.mp3",
  };
}
function resolveMinimaxMusicModel(model) {
  const trimmed = normalizeOptionalString(model);
  if (!trimmed) return DEFAULT_MINIMAX_MUSIC_MODEL;
  return trimmed;
}
function buildMinimaxMusicProvider(providerId) {
  return {
    id: providerId,
    label: "MiniMax",
    defaultModel: DEFAULT_MINIMAX_MUSIC_MODEL,
    models: [DEFAULT_MINIMAX_MUSIC_MODEL, "music-2.6-free", "music-cover", "music-cover-free"],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: providerId,
        agentDir,
      }),
    capabilities: {
      generate: {
        maxTracks: 1,
        supportsLyrics: true,
        supportsInstrumental: true,
        supportsFormat: true,
        supportedFormats: ["mp3"],
      },
      edit: { enabled: false },
    },
    async generateMusic(req) {
      if ((req.inputImages?.length ?? 0) > 0)
        throw new Error("MiniMax music generation does not support image reference inputs.");
      if (req.instrumental === true && normalizeOptionalString(req.lyrics))
        throw new Error("MiniMax music generation cannot use lyrics when instrumental=true.");
      if (req.format && req.format !== "mp3")
        throw new Error("MiniMax music generation currently supports mp3 output only.");
      const auth = await resolveApiKeyForProvider({
        provider: providerId,
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) throw new Error("MiniMax API key missing");
      const fetchFn = fetch;
      const operationTimeoutMs = req.timeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS;
      const deadline = createProviderOperationDeadline({
        timeoutMs: operationTimeoutMs,
        label: "MiniMax music generation",
      });
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveMinimaxMusicBaseUrl(req.cfg, providerId),
          defaultBaseUrl: DEFAULT_MINIMAX_MUSIC_BASE_URL,
          defaultHeaders: { Authorization: `Bearer ${auth.apiKey}` },
          provider: providerId,
          capability: "audio",
          transport: "http",
          request: sanitizeConfiguredModelProviderRequest(
            req.cfg.models?.providers?.[providerId]?.request,
          ),
        });
      const requestPolicy = {
        allowPrivateNetwork,
        dispatcherPolicy,
      };
      const jsonHeaders = new Headers(headers);
      jsonHeaders.set("Content-Type", "application/json");
      const model = resolveMinimaxMusicModel(req.model);
      const requestedLyrics = normalizeOptionalString(req.lyrics);
      const body = {
        model,
        prompt: req.prompt.trim(),
        ...(req.instrumental === true ? { is_instrumental: true } : {}),
        ...(requestedLyrics
          ? { lyrics: requestedLyrics }
          : req.instrumental === true
            ? {}
            : { lyrics_optimizer: true }),
        stream: true,
        output_format: "hex",
        audio_setting: {
          sample_rate: 44100,
          bitrate: 256e3,
          format: "mp3",
        },
      };
      const { response: res, release } = await postJsonRequest({
        url: `${baseUrl}/v1/music_generation`,
        headers: jsonHeaders,
        body,
        timeoutMs: resolveProviderOperationTimeoutMs({
          deadline,
          defaultTimeoutMs: operationTimeoutMs,
        }),
        fetchFn,
        pinDns: false,
        allowPrivateNetwork,
        dispatcherPolicy,
      });
      try {
        await assertOkOrThrowHttpError(res, "MiniMax music generation failed");
        const lowerContentType = (
          normalizeOptionalString(res.headers.get("content-type")) ?? ""
        ).toLowerCase();
        const maxGeneratedMusicBytes = resolveGeneratedMusicMaxBytes(req);
        const payload =
          lowerContentType.includes("text/event-stream") || lowerContentType.startsWith("audio/")
            ? null
            : JSON.parse(
                new TextDecoder().decode(
                  await readResponseBufferWithDeadline(
                    res.clone(),
                    deadline,
                    resolveStreamEnvelopeMaxBytes(maxGeneratedMusicBytes),
                  ),
                ),
              );
        if (payload) assertMinimaxBaseResp(payload.base_resp, "MiniMax music generation failed");
        const audioCandidate =
          normalizeOptionalString(payload?.audio) ?? normalizeOptionalString(payload?.data?.audio);
        const audioUrl =
          normalizeOptionalString(payload?.audio_url) ||
          normalizeOptionalString(payload?.data?.audio_url) ||
          (isLikelyRemoteUrl(audioCandidate) ? audioCandidate : void 0);
        const inlineAudio = isLikelyRemoteUrl(audioCandidate) ? void 0 : audioCandidate;
        const responseLyrics = decodePossibleText(payload?.lyrics ?? payload?.data?.lyrics ?? "");
        const track = audioUrl
          ? await downloadTrackFromUrl({
              url: audioUrl,
              timeoutMs: resolveProviderOperationTimeoutMs({
                deadline,
                defaultTimeoutMs: req.timeoutMs ?? DEFAULT_TIMEOUT_MS,
              }),
              fetchFn,
              maxBytes: resolveGeneratedMusicMaxBytes(req),
              policy: requestPolicy,
            })
          : inlineAudio
            ? (() => {
                return {
                  buffer: decodePossibleBinaryWithLimit(inlineAudio, maxGeneratedMusicBytes),
                  mimeType: "audio/mpeg",
                  fileName: "track-1.mp3",
                };
              })()
            : await readStreamingTrack(res, deadline, maxGeneratedMusicBytes);
        if (!track) throw new Error("MiniMax music generation response missing audio output");
        return {
          tracks: [track],
          ...(responseLyrics ? { lyrics: [responseLyrics] } : {}),
          model,
          metadata: {
            ...(normalizeOptionalString(payload?.task_id)
              ? { taskId: normalizeOptionalString(payload?.task_id) }
              : {}),
            ...(audioUrl ? { audioUrl } : {}),
            instrumental: req.instrumental === true,
            ...(requestedLyrics ? { requestedLyrics: true } : {}),
          },
        };
      } finally {
        await release();
      }
    },
  };
}
function buildMinimaxMusicGenerationProvider() {
  return buildMinimaxMusicProvider("minimax");
}
function buildMinimaxPortalMusicGenerationProvider() {
  return buildMinimaxMusicProvider("minimax-portal");
}
//#endregion
export { buildMinimaxPortalMusicGenerationProvider as n, buildMinimaxMusicGenerationProvider as t };
