import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { d as toImageDataUrl } from "./image-generation-RauRpKhi.js";
import { A as resolvePositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import { t as OPENROUTER_BASE_URL } from "./provider-catalog-Dv1kASR6.js";
import "./media-runtime-BhmZORKM.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { r as assertOkOrThrowHttpError } from "./provider-http-errors-DLMRBkZU.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./provider-http-BDIltggC.js";
import {
  c as postJsonRequest,
  h as resolveProviderOperationTimeoutMs,
  n as createProviderOperationDeadline,
  p as resolveProviderHttpRequestConfig,
} from "./shared-CfGzzOqJ.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/openrouter/music-generation-provider.ts
const DEFAULT_OPENROUTER_MUSIC_MODEL = "google/lyria-3-pro-preview";
const OPENROUTER_CLIP_MUSIC_MODEL = "google/lyria-3-clip-preview";
const DEFAULT_TIMEOUT_MS = 18e4;
const MB = 1024 * 1024;
const OPENROUTER_SSE_ENVELOPE_OVERHEAD_BYTES = 64 * 1024;
const OPENROUTER_MUSIC_MODELS = [DEFAULT_OPENROUTER_MUSIC_MODEL, OPENROUTER_CLIP_MUSIC_MODEL];
function resolveOpenRouterMusicModel(model) {
  return normalizeOptionalString(model) ?? DEFAULT_OPENROUTER_MUSIC_MODEL;
}
function outputFormatToMimeType(format) {
  return format === "mp3" ? "audio/mpeg" : "audio/wav";
}
function imageToContentPart(image) {
  const url =
    normalizeOptionalString(image.url) ??
    (image.buffer
      ? toImageDataUrl({
          ...image,
          buffer: image.buffer,
          defaultMimeType: "image/png",
        })
      : void 0);
  if (!url) throw new Error("OpenRouter music generation reference image is missing data.");
  return {
    type: "image_url",
    image_url: { url },
  };
}
function buildOpenRouterMusicPrompt(req) {
  const parts = [req.prompt.trim()];
  const lyrics = normalizeOptionalString(req.lyrics);
  if (req.instrumental === true)
    parts.push("Instrumental only. No vocals, no sung lyrics, no spoken word.");
  if (lyrics) parts.push(`Lyrics:\n${lyrics}`);
  if (typeof req.durationSeconds === "number")
    parts.push(`Target duration: about ${Math.round(req.durationSeconds)} seconds.`);
  return parts.join("\n\n");
}
function buildOpenRouterMessageContent(req) {
  const prompt = buildOpenRouterMusicPrompt(req);
  const images = req.inputImages ?? [];
  if (images.length === 0) return prompt;
  return [
    {
      type: "text",
      text: prompt,
    },
    ...images.map((image) => imageToContentPart(image)),
  ];
}
function readDeltaAudio(part) {
  if (!isRecord(part)) return;
  const choices = part.choices;
  if (!Array.isArray(choices)) return;
  const first = choices[0];
  if (!isRecord(first)) return;
  const delta = first.delta;
  if (!isRecord(delta)) return;
  const audio = delta.audio;
  if (!isRecord(audio)) return;
  return {
    data: normalizeOptionalString(audio.data),
    transcript: typeof audio.transcript === "string" ? audio.transcript : void 0,
  };
}
function resolveGeneratedMusicMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * MB);
  return maxBytesForKind("audio");
}
function resolveOpenRouterSseEventMaxBytes(maxBytes) {
  return Math.ceil(maxBytes / 3) * 4 + maxBytes + OPENROUTER_SSE_ENVELOPE_OVERHEAD_BYTES;
}
function createOpenRouterMusicTooLargeError(kind, maxBytes) {
  return /* @__PURE__ */ new Error(
    `OpenRouter music generation ${kind} exceeded ${maxBytes} bytes`,
  );
}
function appendDecodedOpenRouterMusicAudio(result, base64) {
  if (!base64) return;
  if (Buffer.byteLength(base64, "base64") > result.maxBytes - result.audioBytes)
    throw createOpenRouterMusicTooLargeError("audio", result.maxBytes);
  const buffer = Buffer.from(base64, "base64");
  const nextBytes = result.audioBytes + buffer.byteLength;
  if (nextBytes > result.maxBytes)
    throw createOpenRouterMusicTooLargeError("audio", result.maxBytes);
  result.audioBytes = nextBytes;
  result.audioBuffers.push(buffer);
}
function appendOpenRouterMusicAudio(result, data) {
  const combined = result.audioBase64Remainder + data;
  const completeLength = combined.length - (combined.length % 4);
  result.audioBase64Remainder = combined.slice(completeLength);
  appendDecodedOpenRouterMusicAudio(result, combined.slice(0, completeLength));
}
function flushOpenRouterMusicAudio(result) {
  appendDecodedOpenRouterMusicAudio(result, result.audioBase64Remainder);
  result.audioBase64Remainder = "";
}
function appendOpenRouterMusicTranscript(result, transcript) {
  const nextBytes = result.transcriptBytes + Buffer.byteLength(transcript, "utf8");
  if (nextBytes > result.maxBytes)
    throw createOpenRouterMusicTooLargeError("transcript", result.maxBytes);
  result.transcriptBytes = nextBytes;
  result.transcriptChunks.push(transcript);
}
function readOpenRouterStreamError(part) {
  if (!isRecord(part) || !isRecord(part.error)) return;
  return normalizeOptionalString(part.error.message) ?? "unknown provider stream error";
}
function processOpenRouterSseLine(line, result) {
  if (!line.startsWith("data:")) return false;
  const data = line.slice(5).trim();
  if (!data) return false;
  if (data === "[DONE]") return true;
  const payload = JSON.parse(data);
  const streamError = readOpenRouterStreamError(payload);
  if (streamError) throw new Error(`OpenRouter music generation failed: ${streamError}`);
  const audio = readDeltaAudio(payload);
  if (audio?.data) appendOpenRouterMusicAudio(result, audio.data);
  if (audio?.transcript) appendOpenRouterMusicTranscript(result, audio.transcript);
  return false;
}
function resolveOpenRouterStreamRemainingMs(deadline) {
  return resolveProviderOperationTimeoutMs({
    deadline,
    defaultTimeoutMs: deadline.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  });
}
async function readOpenRouterStreamChunk(reader, deadline) {
  const timeoutMs = resolveOpenRouterStreamRemainingMs(deadline);
  let timeoutId;
  try {
    return await Promise.race([
      reader.read(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            /* @__PURE__ */ new Error(`${deadline.label} timed out after ${deadline.timeoutMs}ms`),
          );
        }, timeoutMs);
      }),
    ]);
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
async function readOpenRouterAudioStream(response, deadline, maxBytes) {
  if (!response.body) throw new Error("OpenRouter music generation response missing stream body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const result = {
    audioBuffers: [],
    audioBytes: 0,
    audioBase64Remainder: "",
    transcriptChunks: [],
    transcriptBytes: 0,
    maxBytes,
  };
  const maxEventBytes = resolveOpenRouterSseEventMaxBytes(maxBytes);
  let buffer = "";
  let pendingBytes = 0;
  let doneSeen = false;
  try {
    for (;;) {
      const { value, done } = await readOpenRouterStreamChunk(reader, deadline);
      if (done) break;
      for (const byte of value) {
        pendingBytes = byte === 10 ? 0 : pendingBytes + 1;
        if (pendingBytes > maxEventBytes)
          throw new Error(
            `OpenRouter music generation SSE event exceeded ${maxEventBytes} bytes for a ${maxBytes}-byte media limit`,
          );
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/u);
      buffer = lines.pop() ?? "";
      for (const line of lines)
        if (processOpenRouterSseLine(line.trim(), result)) {
          flushOpenRouterMusicAudio(result);
          await reader.cancel();
          return {
            audioBuffer: Buffer.concat(result.audioBuffers, result.audioBytes),
            transcript: result.transcriptChunks.join(""),
          };
        }
    }
    resolveOpenRouterStreamRemainingMs(deadline);
    buffer += decoder.decode();
    pendingBytes = Buffer.byteLength(buffer, "utf8");
    if (pendingBytes > maxEventBytes)
      throw new Error(
        `OpenRouter music generation SSE event exceeded ${maxEventBytes} bytes for a ${maxBytes}-byte media limit`,
      );
    if (buffer.trim()) {
      for (const line of buffer.split(/\r?\n/u))
        if (processOpenRouterSseLine(line.trim(), result)) doneSeen = true;
    }
    if (!doneSeen) throw new Error("OpenRouter music generation stream ended before completion");
    flushOpenRouterMusicAudio(result);
    return {
      audioBuffer: Buffer.concat(result.audioBuffers, result.audioBytes),
      transcript: result.transcriptChunks.join(""),
    };
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    try {
      reader.releaseLock();
    } catch {}
  }
}
function buildOpenRouterMusicGenerationProvider() {
  return {
    id: "openrouter",
    label: "OpenRouter",
    defaultModel: DEFAULT_OPENROUTER_MUSIC_MODEL,
    models: [...OPENROUTER_MUSIC_MODELS],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "openrouter",
        agentDir,
      }),
    capabilities: {
      generate: {
        maxTracks: 1,
        maxDurationSeconds: 180,
        supportsLyrics: true,
        supportsInstrumental: true,
        supportsDuration: true,
        supportsFormat: true,
        supportedFormats: ["mp3", "wav"],
      },
      edit: {
        enabled: true,
        maxTracks: 1,
        maxInputImages: 1,
        maxDurationSeconds: 180,
        supportsLyrics: true,
        supportsInstrumental: true,
        supportsDuration: true,
        supportsFormat: true,
        supportedFormats: ["mp3", "wav"],
      },
    },
    async generateMusic(req) {
      if ((req.inputImages?.length ?? 0) > 1)
        throw new Error("OpenRouter music generation supports at most one reference image.");
      const auth = await resolveApiKeyForProvider({
        provider: "openrouter",
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) throw new Error("OpenRouter API key missing");
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: req.cfg?.models?.providers?.openrouter?.baseUrl,
          defaultBaseUrl: OPENROUTER_BASE_URL,
          allowPrivateNetwork: false,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://openclaw.ai",
            "X-OpenRouter-Title": "OpenClaw",
          },
          provider: "openrouter",
          capability: "audio",
          transport: "http",
        });
      const model = resolveOpenRouterMusicModel(req.model);
      const format = req.format ?? "wav";
      const streamDeadline = createProviderOperationDeadline({
        timeoutMs: resolvePositiveTimerTimeoutMs(req.timeoutMs, DEFAULT_TIMEOUT_MS),
        label: "OpenRouter music generation",
      });
      const timeoutMs = resolveOpenRouterStreamRemainingMs(streamDeadline);
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}/chat/completions`,
        headers,
        body: {
          model,
          messages: [
            {
              role: "user",
              content: buildOpenRouterMessageContent(req),
            },
          ],
          modalities: ["text", "audio"],
          audio: { format },
          stream: true,
        },
        timeoutMs,
        fetchFn: fetch,
        allowPrivateNetwork,
        dispatcherPolicy,
      });
      try {
        await assertOkOrThrowHttpError(response, "OpenRouter music generation failed");
        const streamResult = await readOpenRouterAudioStream(
          response,
          streamDeadline,
          resolveGeneratedMusicMaxBytes(req),
        );
        if (streamResult.audioBuffer.byteLength === 0)
          throw new Error("OpenRouter music generation response missing audio data");
        return {
          tracks: [
            {
              buffer: streamResult.audioBuffer,
              mimeType: outputFormatToMimeType(format),
              fileName: `track-1.${format}`,
            },
          ],
          model,
          ...(streamResult.transcript ? { lyrics: [streamResult.transcript] } : {}),
          metadata: {
            inputImageCount: req.inputImages?.length ?? 0,
            instrumental: req.instrumental === true,
            requestedFormat: format,
          },
        };
      } finally {
        await release();
      }
    },
  };
}
//#endregion
export { buildOpenRouterMusicGenerationProvider as t };
