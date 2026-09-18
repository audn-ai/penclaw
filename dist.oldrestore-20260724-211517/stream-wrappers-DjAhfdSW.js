import {
  F as resolveAnthropicPayloadPolicy,
  N as applyAnthropicPayloadPolicyToParams,
  k as streamWithPayloadPatch,
  n as composeProviderStreamWrappers,
  r as createAnthropicThinkingPrefillPayloadWrapper,
} from "./provider-stream-shared-CMy-5I0G.js";
import {
  a as resolveClaudeFable5ModelIdentity,
  l as resolveClaudeSonnet5ModelIdentity,
} from "./src-Dcc_hMY6.js";
import { i as streamSimple } from "./stream-DzNMuPw6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  i as normalizeFastMode,
  p as readStringValue,
} from "./string-coerce-DW4mBlAt.js";
import "./llm-CMBgEkcN.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-model-shared-CYlCpWlu.js";
//#region extensions/anthropic/stream-wrappers.ts
const log = createSubsystemLogger("anthropic-stream");
const ANTHROPIC_CONTEXT_1M_BETA_LEGACY = "context-1m-2025-08-07";
const ANTHROPIC_GA_1M_MODEL_PREFIXES = [
  "claude-opus-4-8",
  "claude-opus-4.8",
  "claude-opus-4-6",
  "claude-opus-4.6",
  "claude-opus-4-7",
  "claude-opus-4.7",
  "claude-sonnet-4-6",
  "claude-sonnet-4.6",
];
const OPENCLAW_DEFAULT_ANTHROPIC_BETAS = [
  "fine-grained-tool-streaming-2025-05-14",
  "interleaved-thinking-2025-05-14",
];
const OPENCLAW_OAUTH_ANTHROPIC_BETAS = [
  "claude-code-20250219",
  "oauth-2025-04-20",
  ...OPENCLAW_DEFAULT_ANTHROPIC_BETAS,
];
function isAnthropic1MModel(modelId) {
  if (
    resolveClaudeFable5ModelIdentity({ id: modelId }) !== void 0 ||
    resolveClaudeSonnet5ModelIdentity({ id: modelId }) !== void 0
  )
    return true;
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return ANTHROPIC_GA_1M_MODEL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
function parseHeaderList(value) {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
function mergeAnthropicBetaHeader(headers, betas) {
  const merged = { ...headers };
  const existingKey = Object.keys(merged).find(
    (key) => normalizeLowercaseStringOrEmpty(key) === "anthropic-beta",
  );
  const existing = existingKey ? parseHeaderList(merged[existingKey]) : [];
  const values = Array.from(/* @__PURE__ */ new Set([...existing, ...betas]));
  const key = existingKey ?? "anthropic-beta";
  merged[key] = values.join(",");
  return merged;
}
function isAnthropicOAuthApiKey(apiKey) {
  return typeof apiKey === "string" && apiKey.includes("sk-ant-oat");
}
function resolveAnthropicFastServiceTier(enabled) {
  return enabled ? "auto" : "standard_only";
}
function normalizeAnthropicServiceTier(value) {
  if (typeof value !== "string") return;
  const normalized = normalizeLowercaseStringOrEmpty(value);
  if (normalized === "auto" || normalized === "standard_only") return normalized;
}
function hasConfiguredAnthropicBeta(extraParams) {
  const configured = extraParams?.anthropicBeta;
  if (typeof configured === "string") return configured.trim().length > 0;
  if (!Array.isArray(configured)) return false;
  return configured.some((beta) => typeof beta === "string" && beta.trim().length > 0);
}
/** Resolve configured Anthropic beta headers from extra model params. */
function resolveAnthropicBetas(extraParams, _modelId) {
  const betas = /* @__PURE__ */ new Set();
  const configured = extraParams?.anthropicBeta;
  if (typeof configured === "string" && configured.trim())
    for (const beta of parseHeaderList(configured)) betas.add(beta);
  else if (Array.isArray(configured)) {
    for (const beta of configured)
      if (typeof beta === "string" && beta.trim())
        for (const betaValue of parseHeaderList(beta)) betas.add(betaValue);
  }
  betas.delete(ANTHROPIC_CONTEXT_1M_BETA_LEGACY);
  return betas.size > 0 ? [...betas] : void 0;
}
/** Wrap a stream function to merge OpenClaw and configured Anthropic beta headers. */
function createAnthropicBetaHeadersWrapper(baseStreamFn, betas) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const isOauth = isAnthropicOAuthApiKey(options?.apiKey);
    const effectiveBetas = betas.filter((beta) => beta !== ANTHROPIC_CONTEXT_1M_BETA_LEGACY);
    const allBetas = [
      .../* @__PURE__ */ new Set([
        ...(isOauth ? OPENCLAW_OAUTH_ANTHROPIC_BETAS : OPENCLAW_DEFAULT_ANTHROPIC_BETAS),
        ...effectiveBetas,
      ]),
    ];
    return underlying(model, context, {
      ...options,
      headers: mergeAnthropicBetaHeader(options?.headers, allBetas),
    });
  };
}
/** Wrap a stream function with the Anthropic fast-mode service tier. */
function createAnthropicFastModeWrapper(baseStreamFn, enabled) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    const resolved = typeof enabled === "function" ? enabled() : enabled;
    if (resolved === void 0) return underlying(model, context, options);
    return createAnthropicServiceTierWrapper(underlying, resolveAnthropicFastServiceTier(resolved))(
      model,
      context,
      options,
    );
  };
}
/** Wrap a stream function with an explicit Anthropic service tier when allowed. */
function createAnthropicServiceTierWrapper(baseStreamFn, serviceTier) {
  const underlying = baseStreamFn ?? streamSimple;
  return (model, context, options) => {
    if (
      isAnthropicOAuthApiKey(options?.apiKey) ||
      resolveClaudeSonnet5ModelIdentity(model) !== void 0
    )
      return underlying(model, context, options);
    const payloadPolicy = resolveAnthropicPayloadPolicy({
      provider: readStringValue(model.provider),
      api: readStringValue(model.api),
      baseUrl: readStringValue(model.baseUrl),
      serviceTier,
    });
    if (!payloadPolicy.allowsServiceTier) return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, (payloadObj) =>
      applyAnthropicPayloadPolicyToParams(payloadObj, payloadPolicy, /* @__PURE__ */ new Set()),
    );
  };
}
/** Wrap a stream function to strip trailing assistant prefill before thinking requests. */
function createAnthropicThinkingPrefillWrapper(baseStreamFn) {
  return createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, (stripped) => {
    log.warn(
      `removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because Anthropic extended thinking requires conversations to end with a user turn`,
    );
  });
}
/** Resolve Anthropic fast-mode setting from model extra params. */
function resolveAnthropicFastMode(extraParams) {
  const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
  const fastMode = typeof raw === "function" ? normalizeFastMode(raw()) : normalizeFastMode(raw);
  return fastMode === "auto" ? void 0 : fastMode;
}
/** Resolve Anthropic service tier from model extra params. */
function resolveAnthropicServiceTier(extraParams) {
  const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
  const normalized = normalizeAnthropicServiceTier(raw);
  if (raw !== void 0 && normalized === void 0) {
    const rawSummary = typeof raw === "string" ? raw : typeof raw;
    log.warn(`ignoring invalid Anthropic service tier param: ${rawSummary}`);
  }
  return normalized;
}
/** Compose all Anthropic stream wrappers for one provider/model context. */
function wrapAnthropicProviderStream(ctx) {
  const anthropicBetas = resolveAnthropicBetas(ctx.extraParams, ctx.modelId);
  const needsAnthropicBetaWrapper =
    anthropicBetas !== void 0 ||
    hasConfiguredAnthropicBeta(ctx.extraParams) ||
    (ctx.extraParams?.context1m === true && isAnthropic1MModel(ctx.modelId));
  const serviceTier = resolveAnthropicServiceTier(ctx.extraParams);
  const hasFastModeParam =
    ctx.extraParams !== void 0 &&
    (Object.hasOwn(ctx.extraParams, "fastMode") || Object.hasOwn(ctx.extraParams, "fast_mode"));
  return composeProviderStreamWrappers(
    ctx.streamFn,
    needsAnthropicBetaWrapper
      ? (streamFn) => createAnthropicBetaHeadersWrapper(streamFn, anthropicBetas ?? [])
      : void 0,
    serviceTier ? (streamFn) => createAnthropicServiceTierWrapper(streamFn, serviceTier) : void 0,
    hasFastModeParam
      ? (streamFn) =>
          createAnthropicFastModeWrapper(streamFn, () => resolveAnthropicFastMode(ctx.extraParams))
      : void 0,
    (streamFn) => createAnthropicThinkingPrefillWrapper(streamFn),
  );
}
/** Test-only hooks for Anthropic stream wrapper behavior. */
const testing = { log };
//#endregion
export {
  resolveAnthropicBetas as a,
  testing as c,
  createAnthropicThinkingPrefillWrapper as i,
  wrapAnthropicProviderStream as l,
  createAnthropicFastModeWrapper as n,
  resolveAnthropicFastMode as o,
  createAnthropicServiceTierWrapper as r,
  resolveAnthropicServiceTier as s,
  createAnthropicBetaHeadersWrapper as t,
};
