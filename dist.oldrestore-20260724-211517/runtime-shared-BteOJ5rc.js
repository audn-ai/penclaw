import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as describeFailoverError, s as isFailoverError } from "./failover-error-CYvhrluQ.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import {
  i as resolveAgentModelPrimaryValue,
  r as resolveAgentModelFallbackValues,
} from "./model-input-B7OGjVYg.js";
import { f as clampTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import "./auth-profiles-CX7JDmZ9.js";
import { t as getProviderEnvVars } from "./provider-env-vars-BZiQzob_.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region packages/media-generation-core/src/capability-model-ref.ts
function normalizeProviderForMatch(value, normalizeProviderId) {
  const normalized = normalizeOptionalString(value);
  return normalized && normalizeProviderId ? normalizeProviderId(normalized) : normalized;
}
/** Finds a provider by id or alias using the caller's provider-id normalization rules. */
function findCapabilityProviderById(params) {
  const selectedProvider = normalizeProviderForMatch(params.providerId, params.normalizeProviderId);
  if (!selectedProvider) return;
  return params.providers.find((provider) => {
    return (
      normalizeProviderForMatch(provider.id, params.normalizeProviderId) === selectedProvider ||
      (provider.aliases ?? []).some(
        (alias) =>
          normalizeProviderForMatch(alias, params.normalizeProviderId) === selectedProvider,
      )
    );
  });
}
/** Resolves a bare model name to the provider that advertises it for this capability. */
function resolveCapabilityProviderModelOnlyRef(params) {
  const model = normalizeOptionalString(params.raw);
  if (!model) return null;
  const provider = params.providers.find((candidate) => {
    return [candidate.defaultModel, ...(candidate.models ?? [])].some(
      (entry) => normalizeOptionalString(entry) === model,
    );
  });
  return provider
    ? {
        provider: provider.id,
        model,
      }
    : null;
}
/** Resolves provider/model refs first, then falls back to model-only catalog matching. */
function resolveCapabilityModelRefForProviders(params) {
  const raw = normalizeOptionalString(params.raw);
  if (!raw) return null;
  const parsed = params.parseModelRef(raw);
  if (
    parsed &&
    findCapabilityProviderById({
      providers: params.providers,
      providerId: parsed.provider,
      normalizeProviderId: params.normalizeProviderId,
    })
  )
    return parsed;
  return (
    resolveCapabilityProviderModelOnlyRef({
      providers: params.providers,
      raw,
    }) ?? parsed
  );
}
//#endregion
//#region packages/media-generation-core/src/normalization.ts
/** True when a normalization entry contains any user-visible normalization metadata. */
function hasMediaNormalizationEntry(entry) {
  return Boolean(
    entry &&
    (entry.requested !== void 0 ||
      entry.applied !== void 0 ||
      entry.derivedFrom !== void 0 ||
      (entry.supportedValues?.length ?? 0) > 0),
  );
}
//#endregion
//#region src/media-generation/runtime-shared.ts
/** Records one provider/model failure in the common fallback-attempt shape. */
function recordCapabilityCandidateFailure(params) {
  const described = isFailoverError(params.error) ? describeFailoverError(params.error) : void 0;
  params.attempts.push({
    provider: params.provider,
    model: params.model,
    error: described?.message ?? formatErrorMessage(params.error),
    reason: described?.reason,
    status: described?.status,
    code: described?.code,
  });
}
const IMAGE_RESOLUTION_ORDER = ["1K", "2K", "4K"];
function resolveMediaProviderDefaultTimeoutMs(timeoutMs) {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0
    ? clampTimerTimeoutMs(timeoutMs)
    : void 0;
}
/** Resolves a request timeout, preferring per-request over provider defaults. */
function resolveMediaProviderRequestTimeoutMs(params) {
  return (
    resolveMediaProviderDefaultTimeoutMs(params.timeoutMs) ??
    resolveMediaProviderDefaultTimeoutMs(params.providerDefaultTimeoutMs)
  );
}
function resolveCurrentDefaultProviderId(cfg) {
  const trimmed = normalizeOptionalString(
    resolveAgentModelPrimaryValue(cfg?.agents?.defaults?.model),
  );
  if (!trimmed) return DEFAULT_PROVIDER;
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return DEFAULT_PROVIDER;
  return normalizeOptionalString(trimmed.slice(0, slash)) || "openai";
}
function isCapabilityProviderConfigured(params) {
  if (params.provider.isConfigured)
    return params.provider.isConfigured({
      cfg: params.cfg,
      agentDir: params.agentDir,
    });
  if (resolveEnvApiKey(params.provider.id)?.apiKey) return true;
  const agentDir = normalizeOptionalString(params.agentDir);
  if (!agentDir) return false;
  return (
    listProfilesForProvider(
      ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false }),
      params.provider.id,
    ).length > 0
  );
}
function resolveAutoCapabilityFallbackRefs(params) {
  const providerDefaults = /* @__PURE__ */ new Map();
  for (const provider of params.listProviders(params.cfg)) {
    const providerId = normalizeOptionalString(provider.id);
    const modelId = normalizeOptionalString(provider.defaultModel);
    if (
      !providerId ||
      !modelId ||
      providerDefaults.has(providerId) ||
      !isCapabilityProviderConfigured({
        provider,
        cfg: params.cfg,
        agentDir: params.agentDir,
      })
    )
      continue;
    const aliases = (provider.aliases ?? []).flatMap((alias) => {
      const normalized = normalizeOptionalString(alias);
      return normalized ? [normalized] : [];
    });
    providerDefaults.set(providerId, {
      ref: `${providerId}/${modelId}`,
      aliases,
    });
  }
  const defaultProvider = resolveCurrentDefaultProviderId(params.cfg);
  const providerIds = [...providerDefaults.keys()].toSorted();
  const matchesDefaultProvider = (providerId) => {
    const entry = providerDefaults.get(providerId);
    return providerId === defaultProvider || (entry?.aliases ?? []).includes(defaultProvider);
  };
  return [
    ...providerIds.filter(matchesDefaultProvider),
    ...providerIds.filter((providerId) => !matchesDefaultProvider(providerId)),
  ].flatMap((providerId) => {
    const entry = providerDefaults.get(providerId);
    return entry ? [entry.ref] : [];
  });
}
/** Builds ordered provider/model candidates for one media capability request. */
function resolveCapabilityModelCandidates(params) {
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  let providers;
  const getProviders = () => {
    providers ??= params.listProviders?.(params.cfg) ?? [];
    return providers;
  };
  const resolveCandidate = (raw, options) => {
    const trimmed = normalizeOptionalString(raw);
    if (!trimmed) return null;
    if (!options.useProviderMetadata) return params.parseModelRef(raw);
    return resolveCapabilityModelRefForProviders({
      raw: trimmed,
      providers: getProviders(),
      parseModelRef: params.parseModelRef,
    });
  };
  const add = (raw, options) => {
    const candidate = resolveCandidate(raw, options);
    if (!candidate) return;
    const key = `${candidate.provider}/${candidate.model}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push(candidate);
  };
  const override = (() => {
    return resolveCandidate(params.modelOverride, { useProviderMetadata: true });
  })();
  if (override) return [override];
  const autoProviderFallbackEnabled =
    params.autoProviderFallback ??
    params.cfg.agents?.defaults?.mediaGenerationAutoProviderFallback !== false;
  add(params.modelOverride, { useProviderMetadata: true });
  add(resolveAgentModelPrimaryValue(params.modelConfig), {
    useProviderMetadata: autoProviderFallbackEnabled,
  });
  for (const fallback of resolveAgentModelFallbackValues(params.modelConfig))
    add(fallback, { useProviderMetadata: autoProviderFallbackEnabled });
  if (autoProviderFallbackEnabled && params.listProviders)
    for (const candidate of resolveAutoCapabilityFallbackRefs({
      cfg: params.cfg,
      agentDir: params.agentDir,
      listProviders: () => getProviders(),
    }))
      add(candidate, { useProviderMetadata: false });
  return candidates;
}
function normalizeSupportedValues(values) {
  return (values ?? []).flatMap((entry) => {
    return normalizeOptionalString(entry) ? [entry] : [];
  });
}
function compareScores(next, best) {
  if (!best) return true;
  if (next.primary !== best.primary) return next.primary < best.primary;
  if (next.secondary !== best.secondary) return next.secondary < best.secondary;
  return next.tertiary.localeCompare(best.tertiary) < 0;
}
function parsePositiveDimensionPair(raw, pattern) {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) return null;
  const match = pattern.exec(trimmed);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  return {
    width,
    height,
  };
}
function parseAspectRatioValue(raw) {
  const pair = parsePositiveDimensionPair(raw, /^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/);
  if (!pair) return null;
  return {
    width: pair.width,
    height: pair.height,
    value: pair.width / pair.height,
  };
}
function parseSizeValue(raw) {
  const pair = parsePositiveDimensionPair(raw, /^(\d+)\s*x\s*(\d+)$/i);
  if (!pair) return null;
  if (!Number.isSafeInteger(pair.width) || !Number.isSafeInteger(pair.height)) return null;
  return {
    width: pair.width,
    height: pair.height,
    aspectRatio: pair.width / pair.height,
    area: pair.width * pair.height,
  };
}
function greatestCommonDivisor(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left || 1;
}
/** Derives a reduced aspect ratio string from a WIDTHxHEIGHT size. */
function deriveAspectRatioFromSize(size) {
  const parsed = parseSizeValue(size);
  if (!parsed) return;
  const divisor = greatestCommonDivisor(parsed.width, parsed.height);
  return `${parsed.width / divisor}:${parsed.height / divisor}`;
}
/** Chooses the closest supported aspect ratio for a request. */
function resolveClosestAspectRatio(params) {
  const supported = normalizeSupportedValues(params.supportedAspectRatios);
  if (supported.length === 0)
    return params.requestedAspectRatio ?? deriveAspectRatioFromSize(params.requestedSize);
  if (params.requestedAspectRatio && supported.includes(params.requestedAspectRatio))
    return params.requestedAspectRatio;
  const requested =
    parseAspectRatioValue(params.requestedAspectRatio) ??
    parseAspectRatioValue(deriveAspectRatioFromSize(params.requestedSize));
  if (!requested) return;
  let bestValue;
  let bestScore = null;
  for (const candidate of supported) {
    const parsed = parseAspectRatioValue(candidate);
    if (!parsed) continue;
    const score = {
      primary: Math.abs(Math.log(parsed.value / requested.value)),
      secondary: Math.abs(parsed.width * requested.height - requested.width * parsed.height),
      tertiary: candidate,
    };
    if (compareScores(score, bestScore)) {
      bestValue = candidate;
      bestScore = score;
    }
  }
  return bestValue;
}
/** Chooses the closest supported size by aspect ratio and area. */
function resolveClosestSize(params) {
  const supported = normalizeSupportedValues(params.supportedSizes);
  if (supported.length === 0) return params.requestedSize;
  if (params.requestedSize && supported.includes(params.requestedSize)) return params.requestedSize;
  const requested = parseSizeValue(params.requestedSize);
  const requestedAspectRatio = parseAspectRatioValue(params.requestedAspectRatio);
  if (!requested && !requestedAspectRatio) return;
  let bestValue;
  let bestScore = null;
  for (const candidate of supported) {
    const parsed = parseSizeValue(candidate);
    if (!parsed) continue;
    const score = {
      primary: Math.abs(
        Math.log(parsed.aspectRatio / (requested?.aspectRatio ?? requestedAspectRatio.value)),
      ),
      secondary: requested ? Math.abs(Math.log(parsed.area / requested.area)) : parsed.area,
      tertiary: candidate,
    };
    if (compareScores(score, bestScore)) {
      bestValue = candidate;
      bestScore = score;
    }
  }
  return bestValue;
}
/** Chooses the closest supported resolution by numeric rank or custom order. */
function resolveClosestResolution(params) {
  const supported = normalizeSupportedValues(params.supportedResolutions);
  if (supported.length === 0) return params.requestedResolution;
  if (params.requestedResolution && supported.includes(params.requestedResolution))
    return params.requestedResolution;
  const requestedNumeric = parseResolutionRank(params.requestedResolution);
  if (requestedNumeric) {
    let bestValue;
    let bestScore = null;
    for (const candidate of supported) {
      const candidateNumeric = parseResolutionRank(candidate);
      if (!candidateNumeric || candidateNumeric.unit !== requestedNumeric.unit) continue;
      const score = {
        primary: Math.abs(candidateNumeric.value - requestedNumeric.value),
        secondary: candidateNumeric.value < requestedNumeric.value ? 1 : 0,
        tertiary: candidate,
      };
      if (compareScores(score, bestScore)) {
        bestValue = candidate;
        bestScore = score;
      }
    }
    if (bestValue) return bestValue;
  }
  const order = params.order ?? IMAGE_RESOLUTION_ORDER;
  const requestedIndex = params.requestedResolution
    ? order.indexOf(params.requestedResolution)
    : -1;
  if (requestedIndex < 0) return;
  let bestValue;
  let bestScore = null;
  for (const candidate of supported) {
    const candidateIndex = order.indexOf(candidate);
    if (candidateIndex < 0) continue;
    const score = {
      primary: Math.abs(candidateIndex - requestedIndex),
      secondary: candidateIndex,
      tertiary: candidate,
    };
    if (compareScores(score, bestScore)) {
      bestValue = candidate;
      bestScore = score;
    }
  }
  return bestValue;
}
function parseResolutionRank(resolution) {
  const match = resolution?.trim().match(/^(\d+(?:\.\d+)?)([kp])$/iu);
  if (!match) return;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return;
  const unit = match[2]?.toUpperCase() === "K" ? "K" : "P";
  return {
    value: unit === "K" ? value * 1e3 : value,
    unit,
  };
}
/** Rounds duration and clamps it to a provider maximum when supplied. */
function normalizeDurationToClosestMax(durationSeconds, maxDurationSeconds) {
  if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds)) return;
  const rounded = Math.max(1, Math.round(durationSeconds));
  if (
    typeof maxDurationSeconds !== "number" ||
    !Number.isFinite(maxDurationSeconds) ||
    maxDurationSeconds <= 0
  )
    return rounded;
  return Math.min(rounded, Math.max(1, Math.round(maxDurationSeconds)));
}
/** Builds user-visible metadata describing provider normalization decisions. */
function buildMediaGenerationNormalizationMetadata(params) {
  const metadata = {};
  const { normalization } = params;
  if (normalization?.size?.requested !== void 0 && normalization.size.applied !== void 0) {
    metadata.requestedSize = normalization.size.requested;
    metadata.normalizedSize = normalization.size.applied;
  }
  if (normalization?.aspectRatio?.applied !== void 0) {
    if (normalization.aspectRatio.requested !== void 0)
      metadata.requestedAspectRatio = normalization.aspectRatio.requested;
    metadata.normalizedAspectRatio = normalization.aspectRatio.applied;
    if (
      normalization.aspectRatio.derivedFrom === "size" &&
      params.requestedSizeForDerivedAspectRatio
    ) {
      metadata.requestedSize = params.requestedSizeForDerivedAspectRatio;
      metadata.aspectRatioDerivedFromSize = deriveAspectRatioFromSize(
        params.requestedSizeForDerivedAspectRatio,
      );
    }
  }
  if (
    normalization?.resolution?.requested !== void 0 &&
    normalization.resolution.applied !== void 0
  ) {
    metadata.requestedResolution = normalization.resolution.requested;
    metadata.normalizedResolution = normalization.resolution.applied;
  }
  if (
    normalization?.durationSeconds?.requested !== void 0 &&
    normalization.durationSeconds.applied !== void 0
  ) {
    metadata.requestedDurationSeconds = normalization.durationSeconds.requested;
    metadata.normalizedDurationSeconds = normalization.durationSeconds.applied;
    if (
      params.includeSupportedDurationSeconds &&
      normalization.durationSeconds.supportedValues?.length
    )
      metadata.supportedDurationSeconds = normalization.durationSeconds.supportedValues;
  }
  return metadata;
}
/** Throws a summarized error after all provider/model candidates fail. */
function throwCapabilityGenerationFailure(params) {
  if (params.attempts.length <= 1 && params.lastError)
    throw toErrorObject(params.lastError, "Non-Error thrown");
  const summary = formatCapabilityFailureAttempts(params.attempts);
  throw new Error(
    `All ${params.capabilityLabel} models failed (${params.attempts.length}): ${summary}`,
    { cause: params.lastError instanceof Error ? params.lastError : void 0 },
  );
}
function formatCapabilityFailureAttempts(attempts) {
  if (attempts.length === 0) return "unknown";
  const abortedAttempts = attempts.filter(isAbortLikeFallbackAttempt);
  if (abortedAttempts.length === 0) return attempts.map(formatCapabilityFailureAttempt).join(" | ");
  if (abortedAttempts.length === attempts.length)
    return `${abortedAttempts.length} fallback(s) aborted after the request was cancelled or timed out: ${abortedAttempts.map(formatCapabilityAttemptRef).join(", ")}`;
  return [
    attempts
      .filter((attempt) => !isAbortLikeFallbackAttempt(attempt))
      .map(formatCapabilityFailureAttempt)
      .join(" | "),
    `${abortedAttempts.length} fallback(s) aborted after the request was cancelled or timed out: ${abortedAttempts.map(formatCapabilityAttemptRef).join(", ")}`,
  ].join(" | ");
}
function formatCapabilityFailureAttempt(attempt) {
  return `${formatCapabilityAttemptRef(attempt)}: ${attempt.error}`;
}
function formatCapabilityAttemptRef(attempt) {
  return `${attempt.provider}/${attempt.model}`;
}
function isAbortLikeFallbackAttempt(attempt) {
  const message = attempt.error.trim().toLowerCase();
  return (
    message === "this operation was aborted" ||
    message === "operation was aborted" ||
    message.includes("operation was aborted") ||
    message.includes("request was aborted")
  );
}
/** Formats setup guidance when no model is configured for a media capability. */
function buildNoCapabilityModelConfiguredMessage(params) {
  const getProviderEnvVars$1 = params.getProviderEnvVars ?? getProviderEnvVars;
  const sampleModel = params.providers.find(
    (provider) =>
      normalizeOptionalString(provider.id) && normalizeOptionalString(provider.defaultModel),
  );
  const sampleRef = sampleModel
    ? `${sampleModel.id}/${sampleModel.defaultModel}`
    : (params.fallbackSampleRef ?? "<provider>/<model>");
  const authHints = params.providers
    .flatMap((provider) => {
      const envVars = getProviderEnvVars$1(provider.id);
      if (envVars.length === 0) return [];
      return [`${provider.id}: ${envVars.join(" / ")}`];
    })
    .slice(0, 3);
  return [
    `No ${params.capabilityLabel} model configured. Set agents.defaults.${params.modelConfigKey}.primary to a provider/model like "${sampleRef}".`,
    authHints.length > 0
      ? `If you want a specific provider, also configure that provider's auth/API key first (${authHints.join("; ")}).`
      : "If you want a specific provider, also configure that provider's auth/API key first.",
  ].join(" ");
}
//#endregion
export {
  recordCapabilityCandidateFailure as a,
  resolveClosestResolution as c,
  resolveMediaProviderRequestTimeoutMs as d,
  throwCapabilityGenerationFailure as f,
  resolveCapabilityModelRefForProviders as h,
  normalizeDurationToClosestMax as i,
  resolveClosestSize as l,
  findCapabilityProviderById as m,
  buildNoCapabilityModelConfiguredMessage as n,
  resolveCapabilityModelCandidates as o,
  hasMediaNormalizationEntry as p,
  deriveAspectRatioFromSize as r,
  resolveClosestAspectRatio as s,
  buildMediaGenerationNormalizationMetadata as t,
  resolveMediaProviderDefaultTimeoutMs as u,
};
