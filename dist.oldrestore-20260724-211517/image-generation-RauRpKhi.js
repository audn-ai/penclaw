import { t as canonicalizeBase64 } from "./base64-hBzWwdnH.js";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-RHpfttuD.js";
import { r as MAX_IMAGE_BYTES } from "./constants-Mf57IYS0.js";
import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import {
  m as readProviderJsonResponse,
  r as assertOkOrThrowHttpError,
} from "./provider-http-errors-DLMRBkZU.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DpW-uV6A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  c as postJsonRequest,
  h as resolveProviderOperationTimeoutMs,
  l as postMultipartRequest,
  n as createProviderOperationDeadline,
  p as resolveProviderHttpRequestConfig,
} from "./shared-CfGzzOqJ.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./provider-http-BDIltggC.js";
//#region src/image-generation/image-assets.ts
/** Converts image provider base64/data-url payloads into generated or source image assets. */
const DEFAULT_IMAGE_MIME_TYPE = "image/png";
const DEFAULT_IMAGE_FILE_PREFIX = "image";
const INLINE_IMAGE_JSON_RESPONSE_ENVELOPE_BYTES = 1024 * 1024;
function resolveInlineImageJsonResponseMaxBytes(maxImages, maxImageBytes) {
  const imageCount = Number.isFinite(maxImages) ? Math.max(1, Math.trunc(maxImages)) : 1;
  return (
    Math.ceil(
      ((Number.isFinite(maxImageBytes) && maxImageBytes > 0
        ? Math.max(1, Math.trunc(maxImageBytes))
        : MAX_IMAGE_BYTES) *
        imageCount *
        4) /
        3,
    ) + INLINE_IMAGE_JSON_RESPONSE_ENVELOPE_BYTES
  );
}
function throwMalformedImageResponse(message) {
  if (message) throw new Error(message);
}
/** Maps an image MIME type to a stable filename extension. */
function imageFileExtensionForMimeType(mimeType, fallback = "png") {
  const normalized = normalizeOptionalLowercaseString(mimeType)?.split(";")[0]?.trim();
  if (!normalized) return fallback;
  if (normalized.includes("jpeg") || normalized.includes("jpg")) return "jpg";
  if (normalized.includes("svg")) return "svg";
  const slashIndex = normalized.indexOf("/");
  return slashIndex >= 0 ? normalized.slice(slashIndex + 1) || fallback : fallback;
}
function sniffImageMimeType(buffer, fallbackMimeType = DEFAULT_IMAGE_MIME_TYPE) {
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    return {
      mimeType: "image/jpeg",
      extension: "jpg",
    };
  if (
    buffer.length >= 8 &&
    buffer[0] === 137 &&
    buffer[1] === 80 &&
    buffer[2] === 78 &&
    buffer[3] === 71
  )
    return {
      mimeType: "image/png",
      extension: "png",
    };
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  )
    return {
      mimeType: "image/webp",
      extension: "webp",
    };
  return {
    mimeType: fallbackMimeType,
    extension: imageFileExtensionForMimeType(fallbackMimeType),
  };
}
function toImageDataUrl(params) {
  return `data:${normalizeOptionalString(params.mimeType) ?? normalizeOptionalString(params.defaultMimeType) ?? DEFAULT_IMAGE_MIME_TYPE};base64,${params.buffer.toString("base64")}`;
}
function parseImageDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:(image\/[^;,]+)(?:;[^,]*)?;base64,(.+)$/is);
  if (!match) return;
  const mimeType = normalizeOptionalString(match[1]);
  const base64 = normalizeOptionalString(match[2]);
  if (!mimeType || !base64) return;
  const canonicalBase64 = canonicalizeBase64(base64);
  if (!canonicalBase64) return;
  return {
    mimeType,
    base64: canonicalBase64,
  };
}
function generatedImageAssetFromBase64(params) {
  const base64 = normalizeOptionalString(params.base64);
  const canonicalBase64 = base64 ? canonicalizeBase64(base64) : void 0;
  if (!canonicalBase64) return;
  const buffer = Buffer.from(canonicalBase64, "base64");
  const explicitMimeType = normalizeOptionalString(params.mimeType);
  const defaultMimeType =
    normalizeOptionalString(params.defaultMimeType) ?? DEFAULT_IMAGE_MIME_TYPE;
  const detected =
    params.sniffMimeType && !explicitMimeType
      ? sniffImageMimeType(buffer, defaultMimeType)
      : void 0;
  const mimeType = explicitMimeType ?? detected?.mimeType ?? defaultMimeType;
  const image = {
    buffer,
    mimeType,
    fileName: `${normalizeOptionalString(params.fileNamePrefix) ?? DEFAULT_IMAGE_FILE_PREFIX}-${params.index + 1}.${detected?.extension ?? imageFileExtensionForMimeType(mimeType)}`,
  };
  const revisedPrompt = normalizeOptionalString(params.revisedPrompt);
  if (revisedPrompt) image.revisedPrompt = revisedPrompt;
  return image;
}
function generatedImageAssetFromDataUrl(params) {
  const parsed = parseImageDataUrl(params.dataUrl);
  if (!parsed) return;
  return generatedImageAssetFromBase64({
    base64: parsed.base64,
    index: params.index,
    mimeType: parsed.mimeType,
    fileNamePrefix: params.fileNamePrefix,
  });
}
function generatedImageAssetFromOpenAiCompatibleEntry(entry, index, options = {}) {
  return generatedImageAssetFromBase64({
    base64: normalizeOptionalString(entry.b64_json),
    index,
    mimeType: normalizeOptionalString(entry.mime_type),
    revisedPrompt: normalizeOptionalString(entry.revised_prompt),
    defaultMimeType: options.defaultMimeType,
    fileNamePrefix: options.fileNamePrefix,
    sniffMimeType: options.sniffMimeType,
  });
}
function parseOpenAiCompatibleImageResponse(payload, options = {}) {
  if (!isRecord(payload)) {
    throwMalformedImageResponse(options.malformedResponseError);
    return [];
  }
  const data = payload.data;
  if (data === void 0 || data === null) return [];
  if (!Array.isArray(data)) {
    throwMalformedImageResponse(options.malformedResponseError);
    return [];
  }
  const images = [];
  for (const [index, entry] of data.entries()) {
    if (!isRecord(entry)) {
      throwMalformedImageResponse(options.malformedResponseError);
      continue;
    }
    const image = generatedImageAssetFromOpenAiCompatibleEntry(entry, index, options);
    if (!image) {
      throwMalformedImageResponse(options.malformedResponseError);
      continue;
    }
    images.push(image);
  }
  return images;
}
function imageSourceUploadFileName(params) {
  const fileName = normalizeOptionalString(params.image.fileName);
  if (fileName) return fileName;
  const mimeType =
    normalizeOptionalString(params.image.mimeType) ??
    normalizeOptionalString(params.defaultMimeType) ??
    DEFAULT_IMAGE_MIME_TYPE;
  return `${normalizeOptionalString(params.fileNamePrefix) ?? DEFAULT_IMAGE_FILE_PREFIX}-${params.index + 1}.${imageFileExtensionForMimeType(mimeType)}`;
}
//#endregion
//#region src/image-generation/openai-compatible-image-provider.ts
function readProviderConfig(cfg, providerConfigKey) {
  return cfg?.models?.providers?.[providerConfigKey];
}
function resolveDefaultModel(model, fallback) {
  return normalizeOptionalString(model) ?? fallback;
}
function trimTrailingSlash(value) {
  return value.replace(/\/+$/u, "");
}
function appendImagesPath(baseUrl, mode) {
  return `${trimTrailingSlash(baseUrl)}/images/${mode === "edit" ? "edits" : "generations"}`;
}
function resolveRequestTimeoutMs(params) {
  if (params.options.defaultTimeoutMs === void 0) return params.req.timeoutMs;
  const label =
    params.mode === "edit"
      ? (params.options.failureLabels?.edit ?? `${params.options.label} image edit`)
      : (params.options.failureLabels?.generate ?? `${params.options.label} image generation`);
  return resolveProviderOperationTimeoutMs({
    deadline: createProviderOperationDeadline({
      timeoutMs: params.req.timeoutMs,
      label,
    }),
    defaultTimeoutMs: params.options.defaultTimeoutMs,
  });
}
function resolveResponseMaxImages(params) {
  return params.mode === "edit"
    ? (params.options.capabilities.edit.maxCount ?? params.count)
    : (params.options.capabilities.generate.maxCount ?? params.count);
}
/** Creates an image-generation provider backed by OpenAI-style image endpoints. */
function createOpenAiCompatibleImageGenerationProvider(options) {
  const providerConfigKey = options.providerConfigKey ?? options.id;
  const normalizeModel = options.normalizeModel ?? resolveDefaultModel;
  const resolveCount =
    options.resolveCount ??
    (({ req }) => {
      return req.count ?? 1;
    });
  return {
    id: options.id,
    label: options.label,
    defaultModel: options.defaultModel,
    ...(options.defaultTimeoutMs !== void 0 ? { defaultTimeoutMs: options.defaultTimeoutMs } : {}),
    models: [...options.models],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: options.id,
        agentDir,
      }),
    capabilities: options.capabilities,
    async generateImage(req) {
      const inputImages = req.inputImages ?? [];
      const mode = inputImages.length > 0 ? "edit" : "generate";
      const maxInputImages = options.capabilities.edit.maxInputImages;
      if (mode === "edit" && !options.capabilities.edit.enabled)
        throw new Error(`${options.label} image editing is not supported.`);
      if (mode === "edit" && maxInputImages !== void 0 && inputImages.length > maxInputImages)
        throw new Error(
          options.tooManyInputImagesError ??
            `${options.label} image editing supports up to ${maxInputImages} reference image${maxInputImages === 1 ? "" : "s"}.`,
        );
      if (mode === "edit" && inputImages.length === 0)
        throw new Error(
          options.missingInputImageError ?? `${options.label} image edit missing reference image.`,
        );
      const auth = await resolveApiKeyForProvider({
        provider: options.id,
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey)
        throw new Error(options.missingApiKeyError ?? `${options.label} API key missing`);
      const providerConfig = readProviderConfig(req.cfg, providerConfigKey);
      const resolvedBaseUrl =
        options.resolveBaseUrl?.({
          req,
          providerConfig,
          defaultBaseUrl: options.defaultBaseUrl,
        }) ??
        normalizeOptionalString(providerConfig?.baseUrl) ??
        options.defaultBaseUrl;
      const allowPrivateNetwork = options.resolveAllowPrivateNetwork?.({
        baseUrl: resolvedBaseUrl,
        req,
        providerConfig,
      });
      const {
        baseUrl,
        allowPrivateNetwork: resolvedAllowPrivateNetwork,
        headers,
        dispatcherPolicy,
      } = resolveProviderHttpRequestConfig({
        baseUrl: resolvedBaseUrl,
        defaultBaseUrl: options.defaultBaseUrl,
        allowPrivateNetwork,
        request: options.useConfiguredRequest
          ? sanitizeConfiguredModelProviderRequest(providerConfig?.request)
          : void 0,
        defaultHeaders: { Authorization: `Bearer ${auth.apiKey}` },
        provider: options.id,
        capability: "image",
        transport: "http",
      });
      const model = normalizeModel(req.model, options.defaultModel);
      const count = resolveCount({
        req,
        mode,
      });
      const requestParams = {
        req,
        inputImages,
        model,
        count,
        mode,
      };
      const requestBody =
        mode === "edit"
          ? options.buildEditRequest({
              ...requestParams,
              mode,
            })
          : options.buildGenerateRequest({
              ...requestParams,
              mode,
            });
      const timeoutMs = resolveRequestTimeoutMs({
        options,
        req,
        mode,
      });
      const { response, release } = await (requestBody.kind === "multipart"
        ? postMultipartRequest({
            url: appendImagesPath(baseUrl, mode),
            headers: (() => {
              const multipartHeaders = new Headers(headers);
              multipartHeaders.delete("Content-Type");
              return multipartHeaders;
            })(),
            body: requestBody.form,
            timeoutMs,
            fetchFn: fetch,
            allowPrivateNetwork: resolvedAllowPrivateNetwork,
            ssrfPolicy: req.ssrfPolicy,
            dispatcherPolicy,
          })
        : postJsonRequest({
            url: appendImagesPath(baseUrl, mode),
            headers: (() => {
              const jsonHeaders = new Headers(headers);
              jsonHeaders.set("Content-Type", "application/json");
              return jsonHeaders;
            })(),
            body: requestBody.body,
            timeoutMs,
            fetchFn: fetch,
            allowPrivateNetwork: resolvedAllowPrivateNetwork,
            ssrfPolicy: req.ssrfPolicy,
            dispatcherPolicy,
          }));
      try {
        await assertOkOrThrowHttpError(
          response,
          mode === "edit"
            ? (options.failureLabels?.edit ?? `${options.label} image edit failed`)
            : (options.failureLabels?.generate ?? `${options.label} image generation failed`),
        );
        const images = parseOpenAiCompatibleImageResponse(
          await readProviderJsonResponse(response, `${options.id}.image-generation`, {
            maxBytes: resolveInlineImageJsonResponseMaxBytes(
              resolveResponseMaxImages({
                count,
                mode,
                options,
              }),
              resolveGeneratedMediaMaxBytes(req.cfg, "image"),
            ),
          }),
          {
            ...options.response,
            malformedResponseError:
              mode === "edit"
                ? `${options.label} image edit response malformed`
                : `${options.label} image generation response malformed`,
          },
        );
        if (images.length === 0)
          throw new Error(
            options.emptyResponseError ??
              (mode === "edit"
                ? `${options.label} image edit response missing image data`
                : `${options.label} image generation response missing image data`),
          );
        return {
          images,
          model,
        };
      } finally {
        await release();
      }
    },
  };
}
//#endregion
export {
  imageFileExtensionForMimeType as a,
  parseOpenAiCompatibleImageResponse as c,
  toImageDataUrl as d,
  generatedImageAssetFromOpenAiCompatibleEntry as i,
  resolveInlineImageJsonResponseMaxBytes as l,
  generatedImageAssetFromBase64 as n,
  imageSourceUploadFileName as o,
  generatedImageAssetFromDataUrl as r,
  parseImageDataUrl as s,
  createOpenAiCompatibleImageGenerationProvider as t,
  sniffImageMimeType as u,
};
