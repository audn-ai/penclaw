import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import {
  m as readProviderJsonResponse,
  r as assertOkOrThrowHttpError,
} from "./provider-http-errors-DLMRBkZU.js";
import {
  c as postJsonRequest,
  h as resolveProviderOperationTimeoutMs,
  n as createProviderOperationDeadline,
  r as createProviderOperationTimeoutResolver,
} from "./shared-CfGzzOqJ.js";
import "./provider-http-BDIltggC.js";
import {
  d as resolveVydraRequestContext,
  f as resolveVydraResponseJobId,
  i as DEFAULT_VYDRA_VIDEO_MODEL,
  l as resolveCompletedVydraPayload,
  o as downloadVydraAsset,
  p as resolveVydraResponseStatus,
  s as extractVydraResultUrls,
  u as resolveVydraGeneratedMediaMaxBytes,
} from "./shared-CWLz3o_d.js";
//#region extensions/vydra/video-generation-provider.ts
const VYDRA_KLING_MODEL = "kling";
const DEFAULT_VYDRA_VIDEO_TIMEOUT_MS = 12e4;
function resolveVydraVideoRequestBody(req) {
  const model = req.model?.trim() || "veo3";
  if (model === VYDRA_KLING_MODEL) {
    const imageUrl = req.inputImages?.[0]?.url?.trim();
    if (!imageUrl) throw new Error("Vydra kling currently requires a remote image URL reference.");
    return {
      model,
      body: {
        prompt: req.prompt,
        image_url: imageUrl,
        video_url: imageUrl,
      },
    };
  }
  if ((req.inputImages?.length ?? 0) > 0)
    throw new Error(
      `Vydra ${model} does not support image reference inputs in the bundled plugin.`,
    );
  return {
    model,
    body: { prompt: req.prompt },
  };
}
function buildVydraVideoGenerationProvider() {
  return {
    id: "vydra",
    label: "Vydra",
    defaultModel: DEFAULT_VYDRA_VIDEO_MODEL,
    models: [DEFAULT_VYDRA_VIDEO_MODEL, VYDRA_KLING_MODEL],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "vydra",
        agentDir,
      }),
    capabilities: {
      generate: { maxVideos: 1 },
      imageToVideo: {
        enabled: true,
        maxVideos: 1,
        maxInputImages: 1,
      },
      videoToVideo: { enabled: false },
    },
    async generateVideo(req) {
      if ((req.inputVideos?.length ?? 0) > 0)
        throw new Error("Vydra video generation does not support video reference inputs.");
      const { fetchFn, baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        await resolveVydraRequestContext({
          cfg: req.cfg,
          agentDir: req.agentDir,
          authStore: req.authStore,
          capability: "video",
        });
      const deadline = createProviderOperationDeadline({
        timeoutMs: req.timeoutMs ?? DEFAULT_VYDRA_VIDEO_TIMEOUT_MS,
        label: "Vydra video generation",
      });
      const { model, body } = resolveVydraVideoRequestBody(req);
      const { response, release } = await postJsonRequest({
        url: `${baseUrl}/models/${model}`,
        headers,
        body,
        timeoutMs: resolveProviderOperationTimeoutMs({
          deadline,
          defaultTimeoutMs: DEFAULT_VYDRA_VIDEO_TIMEOUT_MS,
        }),
        fetchFn,
        allowPrivateNetwork,
        dispatcherPolicy,
      });
      try {
        await assertOkOrThrowHttpError(response, "Vydra video generation failed");
        const submitted = await readProviderJsonResponse(response, "Vydra video generation");
        const completedPayload = await resolveCompletedVydraPayload({
          submitted,
          baseUrl,
          headers,
          deadline,
          fetchFn,
          kind: "video",
          missingJobIdMessage: "Vydra video generation response missing job id",
        });
        const videoUrl = extractVydraResultUrls(completedPayload, "video")[0];
        if (!videoUrl) throw new Error("Vydra video generation completed without a video URL");
        const video = await downloadVydraAsset({
          url: videoUrl,
          kind: "video",
          timeoutMs: createProviderOperationTimeoutResolver({
            deadline,
            defaultTimeoutMs: DEFAULT_VYDRA_VIDEO_TIMEOUT_MS,
          }),
          fetchFn,
          maxBytes: resolveVydraGeneratedMediaMaxBytes({
            cfg: req.cfg,
            kind: "video",
          }),
        });
        return {
          videos: [
            {
              buffer: video.buffer,
              mimeType: video.mimeType,
              fileName: video.fileName,
            },
          ],
          model,
          metadata: {
            jobId:
              resolveVydraResponseJobId(completedPayload) ?? resolveVydraResponseJobId(submitted),
            videoUrl,
            status: resolveVydraResponseStatus(completedPayload) ?? "completed",
          },
        };
      } finally {
        await release();
      }
    },
  };
}
//#endregion
export { buildVydraVideoGenerationProvider as t };
