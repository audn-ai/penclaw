import {
  _ as ImageGenerationSourceImage,
  l as ImageGenerationProvider,
  m as ImageGenerationRequest,
  t as GeneratedImageAsset,
  u as ImageGenerationProviderCapabilities,
} from "./types-CVRxRIni.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/image-generation/openai-compatible-image-provider.d.ts
type ModelProviderConfig = NonNullable<NonNullable<OpenClawConfig["models"]>["providers"]>[string];
/** OpenAI-compatible image endpoint mode. */
type OpenAiCompatibleImageRequestMode = "generate" | "edit";
type OpenAiCompatibleImageProviderRequestParams = {
  req: ImageGenerationRequest;
  inputImages: ImageGenerationSourceImage[];
  model: string;
  count: number;
  mode: OpenAiCompatibleImageRequestMode;
};
type OpenAiCompatibleImageProviderRequestBody =
  | {
      kind: "json";
      body: Record<string, unknown>;
    }
  | {
      kind: "multipart";
      form: FormData;
    };
type OpenAiCompatibleImageProviderOptions = {
  id: string;
  label: string;
  defaultModel: string;
  models: readonly string[];
  capabilities: ImageGenerationProviderCapabilities;
  defaultBaseUrl: string;
  providerConfigKey?: string;
  normalizeModel?: (model: string | undefined, fallback: string) => string;
  resolveBaseUrl?: (params: {
    req: ImageGenerationRequest;
    providerConfig?: ModelProviderConfig;
    defaultBaseUrl: string;
  }) => string;
  resolveAllowPrivateNetwork?: (params: {
    baseUrl: string;
    req: ImageGenerationRequest;
    providerConfig?: ModelProviderConfig;
  }) => boolean | undefined;
  useConfiguredRequest?: boolean;
  defaultTimeoutMs?: number;
  resolveCount?: (params: {
    req: ImageGenerationRequest;
    mode: OpenAiCompatibleImageRequestMode;
  }) => number;
  buildGenerateRequest: (
    params: OpenAiCompatibleImageProviderRequestParams & {
      mode: "generate";
    },
  ) => OpenAiCompatibleImageProviderRequestBody;
  buildEditRequest: (
    params: OpenAiCompatibleImageProviderRequestParams & {
      mode: "edit";
    },
  ) => OpenAiCompatibleImageProviderRequestBody;
  response?: {
    defaultMimeType?: string;
    fileNamePrefix?: string;
    sniffMimeType?: boolean;
  };
  missingApiKeyError?: string;
  tooManyInputImagesError?: string;
  missingInputImageError?: string;
  emptyResponseError?: string;
  failureLabels?: {
    generate?: string;
    edit?: string;
  };
};
/** Creates an image-generation provider backed by OpenAI-style image endpoints. */
declare function createOpenAiCompatibleImageGenerationProvider(
  options: OpenAiCompatibleImageProviderOptions,
): ImageGenerationProvider;
//#endregion
//#region src/image-generation/image-assets.d.ts
/** Result of conservative image MIME sniffing for provider responses. */
type ImageMimeTypeDetection = {
  mimeType: string;
  extension: string;
};
type OpenAiCompatibleImageResponseEntry = {
  b64_json?: unknown;
  mime_type?: unknown;
  revised_prompt?: unknown;
};
type OpenAiCompatibleImageResponsePayload = {
  data?: unknown;
};
declare function resolveInlineImageJsonResponseMaxBytes(
  maxImages: number,
  maxImageBytes: number,
): number;
/** Maps an image MIME type to a stable filename extension. */
declare function imageFileExtensionForMimeType(
  mimeType: string | undefined,
  fallback?: string,
): string;
declare function sniffImageMimeType(
  buffer: Buffer,
  fallbackMimeType?: string,
): ImageMimeTypeDetection;
declare function toImageDataUrl(params: {
  buffer: Buffer;
  mimeType?: string;
  defaultMimeType?: string;
}): string;
declare function parseImageDataUrl(dataUrl: string):
  | {
      mimeType: string;
      base64: string;
    }
  | undefined;
declare function generatedImageAssetFromBase64(params: {
  base64: string | undefined;
  index: number;
  mimeType?: string;
  revisedPrompt?: string;
  defaultMimeType?: string;
  fileNamePrefix?: string;
  sniffMimeType?: boolean;
}): GeneratedImageAsset | undefined;
declare function generatedImageAssetFromDataUrl(params: {
  dataUrl: string;
  index: number;
  fileNamePrefix?: string;
}): GeneratedImageAsset | undefined;
declare function generatedImageAssetFromOpenAiCompatibleEntry(
  entry: OpenAiCompatibleImageResponseEntry,
  index: number,
  options?: {
    defaultMimeType?: string;
    fileNamePrefix?: string;
    sniffMimeType?: boolean;
  },
): GeneratedImageAsset | undefined;
declare function parseOpenAiCompatibleImageResponse(
  payload: unknown,
  options?: {
    defaultMimeType?: string;
    fileNamePrefix?: string;
    malformedResponseError?: string;
    sniffMimeType?: boolean;
  },
): GeneratedImageAsset[];
declare function imageSourceUploadFileName(params: {
  image: ImageGenerationSourceImage;
  index: number;
  defaultMimeType?: string;
  fileNamePrefix?: string;
}): string;
//#endregion
export {
  OpenAiCompatibleImageRequestMode as _,
  generatedImageAssetFromDataUrl as a,
  imageSourceUploadFileName as c,
  resolveInlineImageJsonResponseMaxBytes as d,
  sniffImageMimeType as f,
  OpenAiCompatibleImageProviderRequestParams as g,
  OpenAiCompatibleImageProviderRequestBody as h,
  generatedImageAssetFromBase64 as i,
  parseImageDataUrl as l,
  OpenAiCompatibleImageProviderOptions as m,
  OpenAiCompatibleImageResponseEntry as n,
  generatedImageAssetFromOpenAiCompatibleEntry as o,
  toImageDataUrl as p,
  OpenAiCompatibleImageResponsePayload as r,
  imageFileExtensionForMimeType as s,
  ImageMimeTypeDetection as t,
  parseOpenAiCompatibleImageResponse as u,
  createOpenAiCompatibleImageGenerationProvider as v,
};
