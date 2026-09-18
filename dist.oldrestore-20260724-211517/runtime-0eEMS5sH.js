import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as describeFailoverError, s as isFailoverError } from "./failover-error-CYvhrluQ.js";
import { a as resolveAgentModelTimeoutMsValue } from "./model-input-B7OGjVYg.js";
import "./provider-env-vars-BZiQzob_.js";
import {
  n as listImageGenerationProviders,
  r as parseImageGenerationModelRef,
  t as getImageGenerationProvider,
} from "./provider-registry-De0ZcoY9.js";
import {
  c as resolveClosestResolution,
  d as resolveMediaProviderRequestTimeoutMs,
  f as throwCapabilityGenerationFailure,
  l as resolveClosestSize,
  n as buildNoCapabilityModelConfiguredMessage,
  o as resolveCapabilityModelCandidates,
  p as hasMediaNormalizationEntry,
  s as resolveClosestAspectRatio,
  t as buildMediaGenerationNormalizationMetadata,
} from "./runtime-shared-BteOJ5rc.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/image-generation/capabilities.ts
function resolveImageGenerationMaxInputImages(params) {
  const model = params.model?.trim();
  let prefixLimit;
  let prefixLength = -1;
  if (model) {
    for (const [prefix, limit] of Object.entries(
      params.provider.capabilities.edit.maxInputImagesByModelPrefix ?? {},
    ))
      if (prefix.length > prefixLength && model.startsWith(prefix)) {
        prefixLimit = limit;
        prefixLength = prefix.length;
      }
  }
  return (
    (model ? params.provider.capabilities.edit.maxInputImagesByModel?.[model] : void 0) ??
    prefixLimit ??
    params.provider.capabilities.edit.maxInputImages
  );
}
//#endregion
//#region src/image-generation/normalization.ts
/** Normalizes image generation request overrides against provider/model capabilities. */
function finalizeImageNormalization(normalization) {
  return hasMediaNormalizationEntry(normalization.size) ||
    hasMediaNormalizationEntry(normalization.aspectRatio) ||
    hasMediaNormalizationEntry(normalization.resolution)
    ? normalization
    : void 0;
}
/** Returns supported image overrides plus ignored/normalized override metadata for replies. */
function resolveImageGenerationOverrides(params) {
  const modeCaps =
    (params.inputImages?.length ?? 0) > 0
      ? params.provider.capabilities.edit
      : params.provider.capabilities.generate;
  const geometry = params.provider.capabilities.geometry;
  const modelGeometry = {
    sizes: params.model
      ? (geometry?.sizesByModel?.[params.model] ?? geometry?.sizes)
      : geometry?.sizes,
    aspectRatios: params.model
      ? (geometry?.aspectRatiosByModel?.[params.model] ?? geometry?.aspectRatios)
      : geometry?.aspectRatios,
    resolutions: params.model
      ? (geometry?.resolutionsByModel?.[params.model] ?? geometry?.resolutions)
      : geometry?.resolutions,
  };
  const ignoredOverrides = [];
  const normalization = {};
  let size = params.size;
  let aspectRatio = params.aspectRatio;
  let resolution = params.resolution;
  let quality = params.quality;
  let outputFormat = params.outputFormat;
  let background = params.background;
  if (size && (modelGeometry.sizes?.length ?? 0) > 0 && modeCaps.supportsSize) {
    const normalizedSize = resolveClosestSize({
      requestedSize: size,
      supportedSizes: modelGeometry.sizes,
    });
    if (normalizedSize && normalizedSize !== size)
      normalization.size = {
        requested: size,
        applied: normalizedSize,
      };
    size = normalizedSize;
  }
  if (!modeCaps.supportsSize && size) {
    let translated = false;
    if (modeCaps.supportsAspectRatio) {
      const normalizedAspectRatio = resolveClosestAspectRatio({
        requestedAspectRatio: aspectRatio,
        requestedSize: size,
        supportedAspectRatios: modelGeometry.aspectRatios,
      });
      if (normalizedAspectRatio) {
        aspectRatio = normalizedAspectRatio;
        normalization.aspectRatio = {
          applied: normalizedAspectRatio,
          derivedFrom: "size",
        };
        translated = true;
      }
    }
    if (!translated)
      ignoredOverrides.push({
        key: "size",
        value: size,
      });
    size = void 0;
  }
  if (
    aspectRatio &&
    (modelGeometry.aspectRatios?.length ?? 0) > 0 &&
    modeCaps.supportsAspectRatio
  ) {
    const normalizedAspectRatio = resolveClosestAspectRatio({
      requestedAspectRatio: aspectRatio,
      requestedSize: size,
      supportedAspectRatios: modelGeometry.aspectRatios,
    });
    if (normalizedAspectRatio && normalizedAspectRatio !== aspectRatio)
      normalization.aspectRatio = {
        requested: aspectRatio,
        applied: normalizedAspectRatio,
      };
    aspectRatio = normalizedAspectRatio;
  } else if (!modeCaps.supportsAspectRatio && aspectRatio) {
    const derivedSize =
      modeCaps.supportsSize && !size
        ? resolveClosestSize({
            requestedSize: params.size,
            requestedAspectRatio: aspectRatio,
            supportedSizes: modelGeometry.sizes,
          })
        : void 0;
    let translated = false;
    if (derivedSize) {
      size = derivedSize;
      normalization.size = {
        applied: derivedSize,
        derivedFrom: "aspectRatio",
      };
      translated = true;
    }
    if (!translated)
      ignoredOverrides.push({
        key: "aspectRatio",
        value: aspectRatio,
      });
    aspectRatio = void 0;
  }
  if (resolution && (modelGeometry.resolutions?.length ?? 0) > 0 && modeCaps.supportsResolution) {
    const normalizedResolution = resolveClosestResolution({
      requestedResolution: resolution,
      supportedResolutions: modelGeometry.resolutions,
    });
    if (normalizedResolution && normalizedResolution !== resolution)
      normalization.resolution = {
        requested: resolution,
        applied: normalizedResolution,
      };
    resolution = normalizedResolution;
  } else if (!modeCaps.supportsResolution && resolution) {
    ignoredOverrides.push({
      key: "resolution",
      value: resolution,
    });
    resolution = void 0;
  }
  if (size && !modeCaps.supportsSize) {
    ignoredOverrides.push({
      key: "size",
      value: size,
    });
    size = void 0;
  }
  if (aspectRatio && !modeCaps.supportsAspectRatio) {
    ignoredOverrides.push({
      key: "aspectRatio",
      value: aspectRatio,
    });
    aspectRatio = void 0;
  }
  if (resolution && !modeCaps.supportsResolution) {
    ignoredOverrides.push({
      key: "resolution",
      value: resolution,
    });
    resolution = void 0;
  }
  const supportedQualities = params.provider.capabilities.output?.qualities;
  if (quality && !(supportedQualities ?? []).includes(quality)) {
    ignoredOverrides.push({
      key: "quality",
      value: quality,
    });
    quality = void 0;
  }
  const supportedFormats = params.provider.capabilities.output?.formats;
  if (outputFormat && !(supportedFormats ?? []).includes(outputFormat)) {
    ignoredOverrides.push({
      key: "outputFormat",
      value: outputFormat,
    });
    outputFormat = void 0;
  }
  const supportedBackgrounds = params.provider.capabilities.output?.backgrounds;
  if (background && !(supportedBackgrounds ?? []).includes(background)) {
    ignoredOverrides.push({
      key: "background",
      value: background,
    });
    background = void 0;
  }
  if (
    !normalization.aspectRatio &&
    aspectRatio &&
    ((!params.aspectRatio && params.size) || params.aspectRatio !== aspectRatio)
  )
    normalization.aspectRatio = {
      applied: aspectRatio,
      ...(params.aspectRatio ? { requested: params.aspectRatio } : {}),
      ...(!params.aspectRatio && params.size ? { derivedFrom: "size" } : {}),
    };
  if (!normalization.size && size && params.size && params.size !== size)
    normalization.size = {
      requested: params.size,
      applied: size,
    };
  if (!normalization.aspectRatio && !params.aspectRatio && params.size && aspectRatio)
    normalization.aspectRatio = {
      applied: aspectRatio,
      derivedFrom: "size",
    };
  if (
    !normalization.resolution &&
    resolution &&
    params.resolution &&
    params.resolution !== resolution
  )
    normalization.resolution = {
      requested: params.resolution,
      applied: resolution,
    };
  return {
    size,
    aspectRatio,
    resolution,
    quality,
    outputFormat,
    background,
    ignoredOverrides,
    normalization: finalizeImageNormalization(normalization),
  };
}
//#endregion
//#region src/image-generation/runtime.ts
/** Runtime entrypoint for image generation with provider fallback and override normalization. */
const log = createSubsystemLogger("image-generation");
function buildNoImageGenerationModelConfiguredMessage(cfg, deps) {
  return buildNoCapabilityModelConfiguredMessage({
    capabilityLabel: "image-generation",
    modelConfigKey: "imageGenerationModel",
    providers: (deps.listProviders ?? listImageGenerationProviders)(cfg),
    getProviderEnvVars: deps.getProviderEnvVars,
  });
}
/** Lists image-generation providers visible for the current config. */
function listRuntimeImageGenerationProviders(params, deps = {}) {
  return (deps.listProviders ?? listImageGenerationProviders)(params?.config);
}
async function generateImage(params, deps = {}) {
  const getProvider = deps.getProvider ?? getImageGenerationProvider;
  const listProviders = deps.listProviders ?? listImageGenerationProviders;
  const logger = deps.log ?? log;
  const requestedTimeoutMs =
    params.timeoutMs ??
    resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.imageGenerationModel);
  const candidates = resolveCapabilityModelCandidates({
    cfg: params.cfg,
    modelConfig: params.cfg.agents?.defaults?.imageGenerationModel,
    modelOverride: params.modelOverride,
    parseModelRef: parseImageGenerationModelRef,
    agentDir: params.agentDir,
    listProviders,
    autoProviderFallback: params.autoProviderFallback,
  });
  if (candidates.length === 0)
    throw new Error(buildNoImageGenerationModelConfiguredMessage(params.cfg, deps));
  const attempts = [];
  let lastError;
  for (const candidate of candidates) {
    const provider = getProvider(candidate.provider, params.cfg);
    if (!provider) {
      const error = `No image-generation provider registered for ${candidate.provider}`;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error,
      });
      lastError = new Error(error);
      logger.warn(
        `image-generation candidate failed: ${candidate.provider}/${candidate.model}: ${error}`,
      );
      continue;
    }
    const inputImageCount = params.inputImages?.length ?? 0;
    const maxInputImages = resolveImageGenerationMaxInputImages({
      provider,
      model: candidate.model,
    });
    if (maxInputImages !== void 0 && inputImageCount > maxInputImages) {
      const error = `${candidate.provider}/${candidate.model} supports at most ${maxInputImages} reference image${maxInputImages === 1 ? "" : "s"}, ${inputImageCount} requested`;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error,
      });
      lastError = new Error(error);
      logger.warn(`image-generation candidate skipped: ${error}`);
      continue;
    }
    try {
      const timeoutMs = resolveMediaProviderRequestTimeoutMs({
        timeoutMs: requestedTimeoutMs,
        providerDefaultTimeoutMs: provider.defaultTimeoutMs,
      });
      const modelResolutions =
        provider.capabilities.geometry?.resolutionsByModel?.[candidate.model];
      const inferredResolution =
        (params.inputImages?.length ? provider.capabilities.edit : provider.capabilities.generate)
          .supportsResolution === false || modelResolutions?.length === 0
          ? void 0
          : params.inferredResolution;
      const sanitized = resolveImageGenerationOverrides({
        provider,
        model: candidate.model,
        size: params.size,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution ?? inferredResolution,
        quality: params.quality,
        outputFormat: params.outputFormat,
        background: params.background,
        inputImages: params.inputImages,
      });
      const result = await provider.generateImage({
        provider: candidate.provider,
        model: candidate.model,
        prompt: params.prompt,
        cfg: params.cfg,
        agentDir: params.agentDir,
        authStore: params.authStore,
        count: params.count,
        size: sanitized.size,
        aspectRatio: sanitized.aspectRatio,
        resolution: sanitized.resolution,
        quality: sanitized.quality,
        outputFormat: sanitized.outputFormat,
        background: sanitized.background,
        inputImages: params.inputImages,
        ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
        providerOptions: params.providerOptions,
        ssrfPolicy: params.ssrfPolicy,
      });
      if (!Array.isArray(result.images) || result.images.length === 0)
        throw new Error("Image generation provider returned no images.");
      return {
        images: result.images,
        provider: candidate.provider,
        model: result.model ?? candidate.model,
        attempts,
        ...(sanitized.resolution ? { appliedResolution: sanitized.resolution } : {}),
        normalization: sanitized.normalization,
        metadata: {
          ...result.metadata,
          ...buildMediaGenerationNormalizationMetadata({
            normalization: sanitized.normalization,
            requestedSizeForDerivedAspectRatio: params.size,
          }),
        },
        ignoredOverrides: sanitized.ignoredOverrides,
      };
    } catch (err) {
      lastError = err;
      const described = isFailoverError(err) ? describeFailoverError(err) : void 0;
      attempts.push({
        provider: candidate.provider,
        model: candidate.model,
        error: described?.message ?? formatErrorMessage(err),
        reason: described?.reason,
        status: described?.status,
        code: described?.code,
      });
      logger.warn(
        `image-generation candidate failed: ${candidate.provider}/${candidate.model}: ${described?.message ?? formatErrorMessage(err)}`,
      );
    }
  }
  return throwCapabilityGenerationFailure({
    capabilityLabel: "image generation",
    attempts,
    lastError,
  });
}
//#endregion
export {
  listRuntimeImageGenerationProviders as n,
  resolveImageGenerationMaxInputImages as r,
  generateImage as t,
};
