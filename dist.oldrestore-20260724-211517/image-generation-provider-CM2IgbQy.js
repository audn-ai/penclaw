import { r as MAX_IMAGE_BYTES } from "./constants-Mf57IYS0.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import {
  c as parseOpenAiCompatibleImageResponse,
  l as resolveInlineImageJsonResponseMaxBytes,
  o as imageSourceUploadFileName,
} from "./image-generation-RauRpKhi.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import "./media-runtime-BhmZORKM.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  m as readProviderJsonResponse,
  r as assertOkOrThrowHttpError,
} from "./provider-http-errors-DLMRBkZU.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DpW-uV6A.js";
import { t as prepareFoundryRuntimeAuth } from "./runtime-TmEUEiOf.js";
import "./provider-http-BDIltggC.js";
import {
  c as postJsonRequest,
  h as resolveProviderOperationTimeoutMs,
  l as postMultipartRequest,
  n as createProviderOperationDeadline,
  p as resolveProviderHttpRequestConfig,
} from "./shared-CfGzzOqJ.js";
import {
  _ as isFoundryProviderApi,
  f as extractFoundryEndpoint,
  g as isFoundryMaiImageModel,
  o as PROVIDER_ID,
  r as DEFAULT_API,
} from "./shared-Cky42rCK.js";
import "./shared-runtime-COG8Dv3f.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region extensions/microsoft-foundry/image-generation-provider.ts
const DEFAULT_TIMEOUT_MS = 6e5;
const DEFAULT_IMAGE_SIZE = {
  width: 1024,
  height: 1024,
};
const MAI_MIN_IMAGE_SIDE_PX = 768;
const MAI_MAX_IMAGE_PIXELS = 1048576;
const MAI_IMAGE_BASE_PATH = "/mai/v1";
const MAI_IMAGE_MAX_RESULTS = 1;
const MAI_IMAGE_OUTPUT_MIME = "image/png";
const MB = 1024 * 1024;
const MAI_IMAGE_UPLOAD_MIME_TYPES = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
]);
function readProviderConfig(req) {
  return req.cfg.models?.providers?.[PROVIDER_ID];
}
function resolveConfiguredModelName(providerConfig, model) {
  const configuredName = providerConfig?.models.find((candidate) => candidate.id === model)?.name;
  const hasDistinctModelMetadata =
    normalizeOptionalLowercaseString(configuredName) !== normalizeOptionalLowercaseString(model);
  return configuredName
    ? {
        modelName: configuredName,
        hasMetadata: hasDistinctModelMetadata,
      }
    : {
        modelName: model,
        hasMetadata: false,
      };
}
function ensureMaiImageModel(providerConfig, model) {
  const resolved = resolveConfiguredModelName(providerConfig, model);
  const normalizedModel = normalizeOptionalLowercaseString(model);
  if (
    !isFoundryMaiImageModel(resolved.modelName) &&
    (resolved.hasMetadata ||
      (normalizedModel?.startsWith("mai-") && !normalizedModel.startsWith("mai-image-")))
  )
    throw new Error(
      `Microsoft Foundry image generation supports MAI image deployments only, got "${resolved.modelName}".`,
    );
  return resolved;
}
function isMaiImageEditModel(modelName) {
  const normalized = normalizeOptionalLowercaseString(modelName);
  return normalized === "mai-image-2.5" || normalized === "mai-image-2.5-flash";
}
function resolveMaiImageSize(size) {
  if (!size) return DEFAULT_IMAGE_SIZE;
  const match = size.match(/^(\d{1,5})x(\d{1,5})$/u);
  if (!match)
    throw new Error(`Microsoft Foundry MAI image size must use WIDTHxHEIGHT, got "${size}".`);
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < MAI_MIN_IMAGE_SIDE_PX ||
    height < MAI_MIN_IMAGE_SIDE_PX ||
    width * height > MAI_MAX_IMAGE_PIXELS
  )
    throw new Error(
      `Microsoft Foundry MAI image size must be at least 768x768 and at most 1,048,576 total pixels, got "${size}".`,
    );
  return {
    width,
    height,
  };
}
function resolveGeneratedImageMaxBytes(req) {
  const configured = req.cfg.agents?.defaults?.mediaMaxMb;
  if (typeof configured === "number" && Number.isFinite(configured) && configured > 0)
    return Math.floor(configured * MB);
  return MAX_IMAGE_BYTES;
}
function assertSingleImageCount(count) {
  if (count === void 0 || count === 1) return;
  throw new Error("Microsoft Foundry MAI image models return one image per request.");
}
function resolveConfiguredEndpoint(params) {
  const endpoint =
    extractFoundryEndpoint(params.preparedBaseUrl) ??
    extractFoundryEndpoint(params.providerConfig?.baseUrl) ??
    extractFoundryEndpoint(process.env.AZURE_OPENAI_ENDPOINT);
  if (!endpoint) throw new Error("Microsoft Foundry endpoint missing for MAI image generation.");
  return endpoint;
}
function buildMaiImageUrl(baseUrl, mode) {
  return `${baseUrl.replace(/\/+$/u, "")}/images/${mode}`;
}
function buildRuntimeModel(params) {
  const api = isFoundryProviderApi(params.providerConfig?.api)
    ? params.providerConfig.api
    : DEFAULT_API;
  return {
    id: params.model,
    name: params.modelName,
    api,
    provider: PROVIDER_ID,
    baseUrl: params.providerConfig?.baseUrl ?? "",
    reasoning: false,
    input: ["text"],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow: 32e3,
    maxTokens: 0,
  };
}
async function resolveMaiImageAuth(params) {
  const auth = await resolveApiKeyForProvider({
    provider: PROVIDER_ID,
    cfg: params.req.cfg,
    agentDir: params.req.agentDir,
    store: params.req.authStore,
  });
  if (!auth.apiKey) throw new Error("Microsoft Foundry API key missing");
  if (auth.apiKey !== "__entra_id_dynamic__") return { headers: { "api-key": auth.apiKey } };
  const prepared = await prepareFoundryRuntimeAuth({
    config: params.req.cfg,
    agentDir: params.req.agentDir,
    env: process.env,
    provider: PROVIDER_ID,
    modelId: params.model,
    model: buildRuntimeModel({
      providerConfig: params.providerConfig,
      model: params.model,
      modelName: params.modelName,
    }),
    apiKey: auth.apiKey,
    authMode: auth.mode,
    ...(auth.profileId ? { profileId: auth.profileId } : {}),
  });
  if (!prepared?.apiKey)
    throw new Error("Microsoft Foundry Entra ID token missing after runtime auth refresh.");
  return {
    headers: { Authorization: `Bearer ${prepared.apiKey}` },
    ...(prepared.baseUrl ? { baseUrl: prepared.baseUrl } : {}),
  };
}
function buildEditFormData(params) {
  const mimeType = normalizeOptionalLowercaseString(params.image.mimeType) ?? MAI_IMAGE_OUTPUT_MIME;
  if (!MAI_IMAGE_UPLOAD_MIME_TYPES.has(mimeType))
    throw new Error("Microsoft Foundry MAI image edits require a PNG or JPEG input image.");
  const form = new FormData();
  form.set("model", params.model);
  form.set("prompt", params.req.prompt);
  form.set(
    "image",
    new Blob([new Uint8Array(params.image.buffer)], {
      type: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
    }),
    imageSourceUploadFileName({
      image: params.image,
      index: 0,
      fileNamePrefix: "microsoft-foundry-input",
    }),
  );
  return form;
}
function parseMaiImageResponse(payload, label) {
  const images = parseOpenAiCompatibleImageResponse(payload, {
    defaultMimeType: MAI_IMAGE_OUTPUT_MIME,
    fileNamePrefix: "microsoft-foundry-image",
    malformedResponseError: `${label} response malformed`,
    sniffMimeType: true,
  });
  if (images.length === 0) throw new Error(`${label} response missing image data`);
  return images;
}
function buildMicrosoftFoundryImageGenerationProvider() {
  return {
    id: PROVIDER_ID,
    label: "Microsoft Foundry",
    defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
    models: [],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: PROVIDER_ID,
        agentDir,
      }),
    capabilities: {
      generate: {
        maxCount: MAI_IMAGE_MAX_RESULTS,
        supportsSize: true,
      },
      edit: {
        enabled: true,
        maxCount: MAI_IMAGE_MAX_RESULTS,
        maxInputImages: 1,
        supportsSize: false,
      },
      output: { formats: ["png"] },
    },
    async generateImage(req) {
      const providerConfig = readProviderConfig(req);
      const model = normalizeOptionalString(req.model);
      if (!model)
        throw new Error("Microsoft Foundry MAI image generation requires a deployment name.");
      const { modelName, hasMetadata } = ensureMaiImageModel(providerConfig, model);
      const inputImages = req.inputImages ?? [];
      const mode = inputImages.length > 0 ? "edits" : "generations";
      assertSingleImageCount(req.count);
      if (inputImages.length > 1)
        throw new Error("Microsoft Foundry MAI image edits support one input image.");
      if (
        mode === "edits" &&
        (hasMetadata || isFoundryMaiImageModel(model)) &&
        !isMaiImageEditModel(modelName)
      )
        throw new Error(`${modelName} does not support Microsoft Foundry MAI image edits.`);
      if (mode === "edits" && !hasMetadata && !isFoundryMaiImageModel(model))
        throw new Error(
          "Microsoft Foundry MAI image edits require MAI-Image-2.5 model metadata for custom deployment names.",
        );
      const auth = await resolveMaiImageAuth({
        req,
        providerConfig,
        model,
        modelName,
      });
      const resolvedBaseUrl = `${resolveConfiguredEndpoint({
        providerConfig,
        preparedBaseUrl: auth.baseUrl,
      })}${MAI_IMAGE_BASE_PATH}`;
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolvedBaseUrl,
          defaultBaseUrl: resolvedBaseUrl,
          allowPrivateNetwork: false,
          defaultHeaders: auth.headers,
          request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
          provider: PROVIDER_ID,
          capability: "image",
          transport: "http",
        });
      const label =
        mode === "edits"
          ? "Microsoft Foundry MAI image edit"
          : "Microsoft Foundry MAI image generation";
      const timeoutMs = resolveProviderOperationTimeoutMs({
        deadline: createProviderOperationDeadline({
          timeoutMs: req.timeoutMs,
          label,
        }),
        defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
      });
      const { response, release } = await (mode === "edits"
        ? postMultipartRequest({
            url: buildMaiImageUrl(baseUrl, mode),
            headers: (() => {
              const multipartHeaders = new Headers(headers);
              multipartHeaders.delete("Content-Type");
              return multipartHeaders;
            })(),
            body: buildEditFormData({
              req,
              image: expectDefined(inputImages[0], "Microsoft Foundry edit source image"),
              model,
            }),
            timeoutMs,
            fetchFn: fetch,
            allowPrivateNetwork,
            ssrfPolicy: req.ssrfPolicy,
            dispatcherPolicy,
          })
        : postJsonRequest({
            url: buildMaiImageUrl(baseUrl, mode),
            headers: (() => {
              const jsonHeaders = new Headers(headers);
              jsonHeaders.set("Content-Type", "application/json");
              return jsonHeaders;
            })(),
            body: {
              model,
              prompt: req.prompt,
              ...resolveMaiImageSize(req.size),
            },
            timeoutMs,
            fetchFn: fetch,
            allowPrivateNetwork,
            ssrfPolicy: req.ssrfPolicy,
            dispatcherPolicy,
          }));
      try {
        await assertOkOrThrowHttpError(response, `${label} failed`);
        return {
          images: parseMaiImageResponse(
            await readProviderJsonResponse(response, "microsoft-foundry.image-generation", {
              maxBytes: resolveInlineImageJsonResponseMaxBytes(
                MAI_IMAGE_MAX_RESULTS,
                resolveGeneratedImageMaxBytes(req),
              ),
            }),
            label,
          ),
          model,
        };
      } finally {
        await release();
      }
    },
  };
}
//#endregion
export { buildMicrosoftFoundryImageGenerationProvider as t };
