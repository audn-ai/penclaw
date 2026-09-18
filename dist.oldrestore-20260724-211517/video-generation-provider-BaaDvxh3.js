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
import {
  c as postJsonRequest,
  g as waitProviderOperationPollInterval,
  h as resolveProviderOperationTimeoutMs,
  n as createProviderOperationDeadline,
  o as fetchWithTimeoutGuarded,
  p as resolveProviderHttpRequestConfig,
  r as createProviderOperationTimeoutResolver,
} from "./shared-CfGzzOqJ.js";
import "./provider-http-BDIltggC.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/minimax/video-generation-provider.ts
const DEFAULT_MINIMAX_VIDEO_BASE_URL = "https://api.minimax.io";
const DEFAULT_MINIMAX_VIDEO_MODEL = "MiniMax-Hailuo-2.3";
const DEFAULT_TIMEOUT_MS = 12e4;
const DEFAULT_OPERATION_TIMEOUT_MS = 12e5;
const POLL_INTERVAL_MS = 1e4;
const MAX_POLL_ATTEMPTS = 120;
const DEFAULT_GENERATED_VIDEO_MAX_BYTES = 16 * 1024 * 1024;
const MINIMAX_MODEL_ALLOWED_DURATIONS = {
  "MiniMax-Hailuo-2.3": [6, 10],
  "MiniMax-Hailuo-02": [6, 10],
};
const MINIMAX_MODEL_ALLOWED_RESOLUTIONS = {
  "MiniMax-Hailuo-2.3": ["768P", "1080P"],
  "MiniMax-Hailuo-2.3-Fast": ["768P", "1080P"],
  "MiniMax-Hailuo-02": ["768P", "1080P"],
};
const MINIMAX_RESOLUTION_ORDER = ["480P", "720P", "768P", "1080P"];
function resolveMinimaxVideoBaseUrl(cfg, providerId) {
  const direct = normalizeOptionalString(cfg?.models?.providers?.[providerId]?.baseUrl);
  if (!direct) return DEFAULT_MINIMAX_VIDEO_BASE_URL;
  try {
    return new URL(direct).origin;
  } catch {
    return DEFAULT_MINIMAX_VIDEO_BASE_URL;
  }
}
function resolveGeneratedVideoMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * 1024 * 1024);
  return DEFAULT_GENERATED_VIDEO_MAX_BYTES;
}
function assertMinimaxBaseResp(baseResp, context) {
  if (!baseResp || typeof baseResp.status_code !== "number" || baseResp.status_code === 0) return;
  throw new Error(
    `${context} (${baseResp.status_code}): ${baseResp.status_msg ?? "unknown error"}`,
  );
}
function resolveMinimaxRequestTimeoutMs(timeoutMs) {
  const resolved = typeof timeoutMs === "function" ? timeoutMs() : timeoutMs;
  return typeof resolved === "number" && Number.isFinite(resolved) && resolved > 0
    ? resolved
    : void 0;
}
function resolveMinimaxGuardedRequestOptions(policy) {
  if (!policy.allowPrivateNetwork && !policy.dispatcherPolicy) return;
  return {
    ...(policy.allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {}),
    ...(policy.dispatcherPolicy ? { dispatcherPolicy: policy.dispatcherPolicy } : {}),
  };
}
async function fetchMinimaxResponse(params) {
  return await executeProviderOperationWithRetry({
    provider: "minimax",
    stage: params.stage,
    retry: params.retry,
    operation: async () => {
      const result = await fetchWithTimeoutGuarded(
        params.url,
        params.init ?? {},
        resolveMinimaxRequestTimeoutMs(params.timeoutMs),
        params.fetchFn,
        resolveMinimaxGuardedRequestOptions(params.policy),
      );
      try {
        await assertOkOrThrowHttpError(result.response, params.requestFailedMessage);
      } catch (error) {
        await result.release();
        throw error;
      }
      return result;
    },
  });
}
function resolveFirstFrameImage(req) {
  const input = req.inputImages?.[0];
  if (!input) return;
  const inputUrl = normalizeOptionalString(input.url);
  if (inputUrl) return inputUrl;
  if (!input.buffer) throw new Error("MiniMax image-to-video input is missing image data.");
  return toImageDataUrl({
    ...input,
    buffer: input.buffer,
    defaultMimeType: "image/png",
  });
}
function resolveDurationSeconds(params) {
  if (typeof params.durationSeconds !== "number" || !Number.isFinite(params.durationSeconds))
    return;
  const rounded = Math.max(1, Math.round(params.durationSeconds));
  const allowed = MINIMAX_MODEL_ALLOWED_DURATIONS[params.model];
  if (!allowed || allowed.length === 0) return rounded;
  return allowed.reduce((best, current) =>
    Math.abs(current - rounded) < Math.abs(best - rounded) ? current : best,
  );
}
function resolveResolution(params) {
  const requested = normalizeOptionalString(params.resolution)?.toUpperCase();
  if (!requested) return;
  const allowed = MINIMAX_MODEL_ALLOWED_RESOLUTIONS[params.model];
  if (!allowed || allowed.length === 0 || allowed.includes(requested)) return requested;
  const requestedIndex = MINIMAX_RESOLUTION_ORDER.indexOf(requested);
  if (requestedIndex < 0) return;
  return allowed.reduce((best, current) => {
    const currentIndex = MINIMAX_RESOLUTION_ORDER.indexOf(current);
    const bestIndex = MINIMAX_RESOLUTION_ORDER.indexOf(best);
    if (currentIndex < 0) return best;
    if (bestIndex < 0) return current;
    return Math.abs(currentIndex - requestedIndex) < Math.abs(bestIndex - requestedIndex)
      ? current
      : best;
  });
}
async function pollMinimaxVideo(params) {
  const deadline = createProviderOperationDeadline({
    timeoutMs: params.timeoutMs,
    label: `MiniMax video generation task ${params.taskId}`,
  });
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const url = new URL(`${params.baseUrl}/v1/query/video_generation`);
    url.searchParams.set("task_id", params.taskId);
    const { response, release } = await fetchMinimaxResponse({
      stage: "poll",
      url: url.toString(),
      init: {
        method: "GET",
        headers: params.headers,
      },
      timeoutMs: createProviderOperationTimeoutResolver({
        deadline,
        defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
      }),
      fetchFn: params.fetchFn,
      requestFailedMessage: "MiniMax video status request failed",
      policy: params.policy,
    });
    let payload;
    try {
      payload = await readProviderJsonResponse(response, "MiniMax video generation failed");
    } finally {
      await release();
    }
    assertMinimaxBaseResp(payload.base_resp, "MiniMax video generation failed");
    switch (normalizeOptionalString(payload.status)) {
      case "Success":
        return payload;
      case "Fail":
        throw new Error(
          normalizeOptionalString(payload.base_resp?.status_msg) ||
            "MiniMax video generation failed",
        );
      default:
        await waitProviderOperationPollInterval({
          deadline,
          pollIntervalMs: POLL_INTERVAL_MS,
        });
        break;
    }
  }
  throw new Error(`MiniMax video generation task ${params.taskId} did not finish in time`);
}
async function downloadVideoFromUrl(params) {
  const { response, release } = await fetchMinimaxResponse({
    stage: "download",
    url: params.url,
    init: { method: "GET" },
    timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    requestFailedMessage: "MiniMax generated video download failed",
    policy: params.policy,
  });
  try {
    const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
    return {
      buffer: await readResponseWithLimit(response, params.maxBytes, {
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`MiniMax generated video download exceeds ${maxBytes} bytes`),
      }),
      mimeType,
      fileName: `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
    };
  } finally {
    await release();
  }
}
async function downloadVideoFromFileId(params) {
  const url = new URL(`${params.baseUrl}/v1/files/retrieve`);
  url.searchParams.set("file_id", params.fileId);
  const { response: metadataResponse, release: releaseMetadata } = await fetchMinimaxResponse({
    stage: "download",
    url: url.toString(),
    init: {
      method: "GET",
      headers: params.headers,
    },
    timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    requestFailedMessage: "MiniMax generated video metadata request failed",
    policy: params.policy,
  });
  let metadata;
  try {
    metadata = await readProviderJsonResponse(metadataResponse, "MiniMax generated video metadata");
  } finally {
    await releaseMetadata();
  }
  assertMinimaxBaseResp(metadata.base_resp, "MiniMax generated video metadata request failed");
  const downloadUrl = normalizeOptionalString(metadata.file?.download_url);
  if (!downloadUrl) throw new Error("MiniMax generated video metadata missing download_url");
  const { response, release } = await fetchMinimaxResponse({
    stage: "download",
    url: downloadUrl,
    init: { method: "GET" },
    timeoutMs: params.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    fetchFn: params.fetchFn,
    requestFailedMessage: "MiniMax generated video download failed",
    policy: params.policy,
  });
  try {
    const mimeType = normalizeOptionalString(response.headers.get("content-type")) ?? "video/mp4";
    return {
      buffer: await readResponseWithLimit(response, params.maxBytes, {
        onOverflow: ({ maxBytes }) =>
          /* @__PURE__ */ new Error(`MiniMax generated video download exceeds ${maxBytes} bytes`),
      }),
      mimeType,
      fileName:
        normalizeOptionalString(metadata.file?.filename) ||
        `video-1.${extensionForMime(mimeType)?.slice(1) ?? "mp4"}`,
    };
  } finally {
    await release();
  }
}
function buildMinimaxVideoProvider(providerId) {
  return {
    id: providerId,
    label: "MiniMax",
    defaultModel: DEFAULT_MINIMAX_VIDEO_MODEL,
    models: [
      DEFAULT_MINIMAX_VIDEO_MODEL,
      "MiniMax-Hailuo-2.3-Fast",
      "MiniMax-Hailuo-02",
      "I2V-01-Director",
      "I2V-01-live",
      "I2V-01",
    ],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: providerId,
        agentDir,
      }),
    capabilities: {
      generate: {
        maxVideos: 1,
        maxDurationSeconds: 10,
        supportedDurationSecondsByModel: MINIMAX_MODEL_ALLOWED_DURATIONS,
        resolutions: ["768P", "1080P"],
        supportsResolution: true,
        supportsWatermark: false,
      },
      imageToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputImages: 1,
        maxDurationSeconds: 10,
        supportedDurationSecondsByModel: MINIMAX_MODEL_ALLOWED_DURATIONS,
        resolutions: ["768P", "1080P"],
        supportsResolution: true,
        supportsWatermark: false,
      },
      videoToVideo: { enabled: false },
    },
    async generateVideo(req) {
      if ((req.inputVideos?.length ?? 0) > 0)
        throw new Error("MiniMax video generation does not support video reference inputs.");
      const auth = await resolveApiKeyForProvider({
        provider: providerId,
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) throw new Error("MiniMax API key missing");
      const fetchFn = fetch;
      const deadline = createProviderOperationDeadline({
        timeoutMs: req.timeoutMs ?? DEFAULT_OPERATION_TIMEOUT_MS,
        label: "MiniMax video generation",
      });
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveMinimaxVideoBaseUrl(req.cfg, providerId),
          defaultBaseUrl: DEFAULT_MINIMAX_VIDEO_BASE_URL,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
          },
          provider: providerId,
          capability: "video",
          transport: "http",
          request: sanitizeConfiguredModelProviderRequest(
            req.cfg.models?.providers?.[providerId]?.request,
          ),
        });
      const requestPolicy = {
        allowPrivateNetwork,
        dispatcherPolicy,
      };
      const model = normalizeOptionalString(req.model) ?? DEFAULT_MINIMAX_VIDEO_MODEL;
      const body = {
        model,
        prompt: req.prompt,
      };
      const firstFrameImage = resolveFirstFrameImage(req);
      if (firstFrameImage) body.first_frame_image = firstFrameImage;
      const resolution = resolveResolution({
        model,
        resolution: req.resolution,
      });
      if (resolution) body.resolution = resolution;
      const durationSeconds = resolveDurationSeconds({
        model,
        durationSeconds: req.durationSeconds,
      });
      if (typeof durationSeconds === "number") body.duration = durationSeconds;
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}/v1/video_generation`,
        headers,
        body,
        timeoutMs: resolveProviderOperationTimeoutMs({
          deadline,
          defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
        }),
        fetchFn,
        allowPrivateNetwork,
        dispatcherPolicy,
      });
      try {
        await assertOkOrThrowHttpError(response, "MiniMax video generation failed");
        const submitted = await readProviderJsonResponse(
          response,
          "MiniMax video generation failed",
        );
        assertMinimaxBaseResp(submitted.base_resp, "MiniMax video generation failed");
        const taskId = normalizeOptionalString(submitted.task_id);
        if (!taskId) throw new Error("MiniMax video generation response missing task_id");
        const completed = await pollMinimaxVideo({
          taskId,
          headers,
          timeoutMs: resolveProviderOperationTimeoutMs({
            deadline,
            defaultTimeoutMs: DEFAULT_OPERATION_TIMEOUT_MS,
          }),
          baseUrl,
          fetchFn,
          policy: requestPolicy,
        });
        const videoUrl = normalizeOptionalString(completed.video_url);
        const fileId = normalizeOptionalString(completed.file_id);
        return {
          videos: [
            videoUrl
              ? await downloadVideoFromUrl({
                  url: videoUrl,
                  timeoutMs: createProviderOperationTimeoutResolver({
                    deadline,
                    defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
                  }),
                  fetchFn,
                  maxBytes: resolveGeneratedVideoMaxBytes(req),
                  policy: requestPolicy,
                })
              : fileId
                ? await downloadVideoFromFileId({
                    fileId,
                    headers,
                    timeoutMs: createProviderOperationTimeoutResolver({
                      deadline,
                      defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
                    }),
                    baseUrl,
                    fetchFn,
                    maxBytes: resolveGeneratedVideoMaxBytes(req),
                    policy: requestPolicy,
                  })
                : (() => {
                    throw new Error(
                      "MiniMax video generation completed without a video URL or file_id",
                    );
                  })(),
          ],
          model,
          metadata: {
            taskId,
            status: completed.status,
            fileId,
            videoUrl,
          },
        };
      } finally {
        await release();
      }
    },
  };
}
function buildMinimaxVideoGenerationProvider() {
  return buildMinimaxVideoProvider("minimax");
}
function buildMinimaxPortalVideoGenerationProvider() {
  return buildMinimaxVideoProvider("minimax-portal");
}
//#endregion
export { buildMinimaxVideoGenerationProvider as n, buildMinimaxPortalVideoGenerationProvider as t };
