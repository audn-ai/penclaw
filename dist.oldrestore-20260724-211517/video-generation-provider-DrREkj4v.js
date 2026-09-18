import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { d as toImageDataUrl } from "./image-generation-RauRpKhi.js";
import { r as extensionForMime } from "./mime-BSEMEb3s.js";
import { t as executeProviderOperationWithRetry } from "./operation-retry-Hj3NkVFd.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import {
  m as readProviderJsonResponse,
  r as assertOkOrThrowHttpError,
} from "./provider-http-errors-DLMRBkZU.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./response-limit-runtime-B_DBKaLw.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DpW-uV6A.js";
import "./media-mime-B8w43n5Y.js";
import { r as resolveConfiguredOpenAIBaseUrl } from "./shared-7Ty07K1G.js";
import "./provider-http-BDIltggC.js";
import {
  c as postJsonRequest,
  h as resolveProviderOperationTimeoutMs,
  i as fetchProviderDownloadResponse,
  l as postMultipartRequest,
  n as createProviderOperationDeadline,
  o as fetchWithTimeoutGuarded,
  p as resolveProviderHttpRequestConfig,
  r as createProviderOperationTimeoutResolver,
  s as pollProviderOperationJson,
} from "./shared-CfGzzOqJ.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/openai/video-generation-provider.ts
const DEFAULT_OPENAI_VIDEO_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_VIDEO_MODEL = "sora-2";
const DEFAULT_TIMEOUT_MS = 12e4;
const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 120;
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
const OPENAI_VIDEO_SECONDS = [4, 8, 12];
const OPENAI_VIDEO_SIZES = ["720x1280", "1280x720", "1024x1792", "1792x1024"];
function toBlobBytes(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
function resolveDurationSeconds(durationSeconds) {
  if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
  const rounded = Math.max(OPENAI_VIDEO_SECONDS[0], Math.round(durationSeconds));
  const nearest = OPENAI_VIDEO_SECONDS.reduce((best, current) =>
    Math.abs(current - rounded) < Math.abs(best - rounded) ? current : best,
  );
  return String(nearest);
}
function resolveGeneratedVideoMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * 1024 * 1024);
  return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
}
function resolveSize(params) {
  const explicitSize = normalizeOptionalString(params.size);
  if (explicitSize && OPENAI_VIDEO_SIZES.includes(explicitSize)) return explicitSize;
  switch (normalizeOptionalString(params.aspectRatio)) {
    case "9:16":
      return "720x1280";
    case "16:9":
      return "1280x720";
    case "4:7":
      return "1024x1792";
    case "7:4":
      return "1792x1024";
    default:
      break;
  }
  if (params.resolution === "1080P") return "1792x1024";
}
function resolveReferenceAsset(req) {
  const allAssets = [...(req.inputImages ?? []), ...(req.inputVideos ?? [])];
  if (allAssets.length === 0) return null;
  if (allAssets.length > 1)
    throw new Error("OpenAI video generation supports at most one reference image or video.");
  const [asset] = allAssets;
  if (!asset?.buffer)
    throw new Error(
      "OpenAI video generation currently requires local image/video uploads for reference assets.",
    );
  const kind = (req.inputVideos?.length ?? 0) > 0 ? "video" : "image";
  const mimeType =
    normalizeOptionalString(asset.mimeType) || (kind === "video" ? "video/mp4" : "image/png");
  const extension =
    extensionForMime(mimeType)?.slice(1) ?? (mimeType.startsWith("video/") ? "mp4" : "png");
  const fileName =
    normalizeOptionalString(asset.fileName) ||
    `${kind === "video" ? "reference-video" : "reference-image"}.${extension}`;
  return {
    kind,
    file: new File([toBlobBytes(asset.buffer)], fileName, { type: mimeType }),
    buffer: asset.buffer,
    mimeType,
  };
}
async function pollOpenAIVideo(params) {
  const deadline = createProviderOperationDeadline({
    timeoutMs: params.timeoutMs,
    label: `OpenAI video generation task ${params.videoId}`,
  });
  return await pollProviderOperationJson({
    url: `${params.baseUrl}/videos/${params.videoId}`,
    headers: params.headers,
    deadline,
    defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    maxAttempts: MAX_POLL_ATTEMPTS,
    pollIntervalMs: POLL_INTERVAL_MS,
    requestFailedMessage: "OpenAI video status request failed",
    timeoutMessage: `OpenAI video generation task ${params.videoId} did not finish in time`,
    allowPrivateNetwork: params.allowPrivateNetwork,
    dispatcherPolicy: params.dispatcherPolicy,
    auditContext: "openai-video-status",
    isComplete: (payload) => payload.status === "completed",
    getFailureMessage: (payload) =>
      payload.status === "failed"
        ? normalizeOptionalString(payload.error?.message) || "OpenAI video generation failed"
        : void 0,
  });
}
function resolveOpenAIVideoDownloadTimeoutMs(timeoutMs) {
  const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
  return typeof resolved === "number" && Number.isFinite(resolved) && resolved > 0
    ? resolved
    : DEFAULT_TIMEOUT_MS;
}
async function fetchOpenAIVideoDownload(params) {
  if (!params.allowPrivateNetwork && !params.dispatcherPolicy)
    return {
      response: await fetchProviderDownloadResponse({
        url: params.url,
        init: params.init,
        timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        fetchFn: params.fetchFn,
        provider: "openai",
        requestFailedMessage: "OpenAI video download failed",
      }),
      release: async () => {},
    };
  return await executeProviderOperationWithRetry({
    provider: "openai",
    stage: "download",
    operation: async () => {
      const result = await fetchWithTimeoutGuarded(
        params.url,
        params.init,
        resolveOpenAIVideoDownloadTimeoutMs(params.timeoutMs),
        params.fetchFn,
        {
          ...(params.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {}),
          ...(params.dispatcherPolicy ? { dispatcherPolicy: params.dispatcherPolicy } : {}),
          auditContext: "openai-video-download",
        },
      );
      try {
        await assertOkOrThrowHttpError(result.response, "OpenAI video download failed");
        return result;
      } catch (error) {
        await result.release();
        throw error;
      }
    },
  });
}
async function downloadOpenAIVideo(params) {
  const url = new URL(`${params.baseUrl}/videos/${params.videoId}/content`);
  url.searchParams.set("variant", "video");
  const { response, release } = await fetchOpenAIVideoDownload({
    url: url.toString(),
    init: {
      method: "GET",
      headers: new Headers({
        ...Object.fromEntries(params.headers.entries()),
        Accept: "application/binary",
      }),
    },
    timeoutMs: params.timeoutMs,
    fetchFn: params.fetchFn,
    allowPrivateNetwork: params.allowPrivateNetwork,
    dispatcherPolicy: params.dispatcherPolicy,
  });
  try {
    const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
    return {
      buffer: await readResponseWithLimit(response, params.maxBytes, {
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`OpenAI generated video download exceeds ${maxBytes} bytes`),
      }),
      mimeType,
      fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
    };
  } finally {
    await release();
  }
}
function buildOpenAIVideoGenerationProvider() {
  return {
    id: "openai",
    label: "OpenAI",
    defaultModel: DEFAULT_OPENAI_VIDEO_MODEL,
    models: [DEFAULT_OPENAI_VIDEO_MODEL, "sora-2-pro"],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "openai",
        agentDir,
        profileTypes: ["api_key"],
      }),
    capabilities: {
      generate: {
        maxVideos: 1,
        maxDurationSeconds: 12,
        supportedDurationSeconds: OPENAI_VIDEO_SECONDS,
        supportsSize: true,
        sizes: OPENAI_VIDEO_SIZES,
      },
      imageToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputImages: 1,
        maxDurationSeconds: 12,
        supportedDurationSeconds: OPENAI_VIDEO_SECONDS,
        supportsSize: true,
        sizes: OPENAI_VIDEO_SIZES,
      },
      videoToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputVideos: 1,
      },
    },
    async generateVideo(req) {
      const auth = await resolveApiKeyForProvider({
        provider: "openai",
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
        modelApi: "openai-responses",
      });
      if (!auth.apiKey || (auth.mode !== void 0 && auth.mode !== "api-key"))
        throw new Error("OpenAI API key missing");
      const fetchFn = fetch;
      const deadline = createProviderOperationDeadline({
        timeoutMs: req.timeoutMs,
        label: "OpenAI video generation",
      });
      const providerConfig = req.cfg.models?.providers?.openai;
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveConfiguredOpenAIBaseUrl(req.cfg),
          defaultBaseUrl: DEFAULT_OPENAI_VIDEO_BASE_URL,
          request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
          defaultHeaders: { Authorization: `Bearer ${auth.apiKey}` },
          provider: "openai",
          capability: "video",
          transport: "http",
        });
      const model = normalizeOptionalString(req.model) ?? DEFAULT_OPENAI_VIDEO_MODEL;
      const seconds = resolveDurationSeconds(req.durationSeconds);
      const size = resolveSize({
        size: req.size,
        aspectRatio: req.aspectRatio,
        resolution: req.resolution,
      });
      const referenceAsset = resolveReferenceAsset(req);
      const { response, release } = referenceAsset
        ? referenceAsset.kind === "image"
          ? await (() => {
              const jsonHeaders = new Headers(headers);
              jsonHeaders.set("Content-Type", "application/json");
              return postJsonRequest({
                url: `${baseUrl}/videos`,
                headers: jsonHeaders,
                body: {
                  prompt: req.prompt,
                  model,
                  ...(seconds ? { seconds } : {}),
                  ...(size ? { size } : {}),
                  input_reference: { image_url: toImageDataUrl(referenceAsset) },
                },
                timeoutMs: resolveProviderOperationTimeoutMs({
                  deadline,
                  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
                }),
                fetchFn,
                allowPrivateNetwork,
                dispatcherPolicy,
              });
            })()
          : await (() => {
              const form = new FormData();
              form.set("prompt", req.prompt);
              form.set("model", model);
              form.set("video", referenceAsset.file);
              const multipartHeaders = new Headers(headers);
              multipartHeaders.delete("Content-Type");
              return postMultipartRequest({
                url: `${baseUrl}/videos/edits`,
                headers: multipartHeaders,
                body: form,
                timeoutMs: resolveProviderOperationTimeoutMs({
                  deadline,
                  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
                }),
                fetchFn,
                allowPrivateNetwork,
                dispatcherPolicy,
              });
            })()
        : await (() => {
            const jsonHeaders = new Headers(headers);
            jsonHeaders.set("Content-Type", "application/json");
            return postJsonRequest({
              url: `${baseUrl}/videos`,
              headers: jsonHeaders,
              body: {
                prompt: req.prompt,
                model,
                ...(seconds ? { seconds } : {}),
                ...(size ? { size } : {}),
              },
              timeoutMs: resolveProviderOperationTimeoutMs({
                deadline,
                defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
              }),
              fetchFn,
              allowPrivateNetwork,
              dispatcherPolicy,
            });
          })();
      try {
        await assertOkOrThrowHttpError(response, "OpenAI video generation failed");
        const submitted = await readProviderJsonResponse(
          response,
          "OpenAI video generation failed",
        );
        const videoId = normalizeOptionalString(submitted.id);
        if (!videoId) throw new Error("OpenAI video generation response missing video id");
        const completed = await pollOpenAIVideo({
          videoId,
          headers,
          timeoutMs: resolveProviderOperationTimeoutMs({
            deadline,
            defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
          }),
          baseUrl,
          fetchFn,
          allowPrivateNetwork,
          dispatcherPolicy,
        });
        return {
          videos: [
            await downloadOpenAIVideo({
              videoId,
              headers,
              timeoutMs: createProviderOperationTimeoutResolver({
                deadline,
                defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
              }),
              baseUrl,
              fetchFn,
              allowPrivateNetwork,
              dispatcherPolicy,
              maxBytes: resolveGeneratedVideoMaxBytes(req),
            }),
          ],
          model: completed.model ?? submitted.model ?? model,
          metadata: {
            videoId,
            status: completed.status,
            seconds: completed.seconds ?? submitted.seconds,
            size: completed.size ?? submitted.size,
          },
        };
      } finally {
        await release();
      }
    },
  };
}
//#endregion
export { buildOpenAIVideoGenerationProvider as t };
