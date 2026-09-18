import {
  r as resolveEffectiveBlockStreamingConfig,
  t as clampPositiveInteger,
} from "./block-streaming-CEgNaeTJ.js";
//#region src/auto-reply/reply/acp-stream-settings.ts
const DEFAULT_ACP_STREAM_COALESCE_IDLE_MS = 350;
const DEFAULT_ACP_STREAM_MAX_CHUNK_CHARS = 1800;
const DEFAULT_ACP_REPEAT_SUPPRESSION = true;
const DEFAULT_ACP_DELIVERY_MODE = "final_only";
const DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR = "paragraph";
const DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR_LIVE = "space";
const DEFAULT_ACP_MAX_OUTPUT_CHARS = 24e3;
const DEFAULT_ACP_MAX_SESSION_UPDATE_CHARS = 320;
const ACP_TAG_VISIBILITY_DEFAULTS = {
  agent_message_chunk: true,
  tool_call: false,
  tool_call_update: false,
  usage_update: false,
  available_commands_update: false,
  current_mode_update: false,
  config_option_update: false,
  session_info_update: false,
  plan: false,
  agent_thought_chunk: false,
};
function isAcpSessionUpdateTag(tag) {
  return Object.hasOwn(ACP_TAG_VISIBILITY_DEFAULTS, tag);
}
function clampBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function resolveAcpDeliveryMode(value) {
  if (value === "live" || value === "final_only") return value;
  return DEFAULT_ACP_DELIVERY_MODE;
}
function resolveAcpHiddenBoundarySeparator(value, fallback) {
  if (value === "none" || value === "space" || value === "newline" || value === "paragraph")
    return value;
  return fallback;
}
function resolveAcpStreamCoalesceIdleMs(cfg) {
  return clampPositiveInteger(
    cfg.acp?.stream?.coalesceIdleMs,
    DEFAULT_ACP_STREAM_COALESCE_IDLE_MS,
    {
      min: 0,
      max: 5e3,
    },
  );
}
function resolveAcpStreamMaxChunkChars(cfg) {
  return clampPositiveInteger(cfg.acp?.stream?.maxChunkChars, DEFAULT_ACP_STREAM_MAX_CHUNK_CHARS, {
    min: 50,
    max: 4e3,
  });
}
/** Resolves ACP projection settings with bounded defaults. */
function resolveAcpProjectionSettings(cfg) {
  const stream = cfg.acp?.stream;
  const deliveryMode = resolveAcpDeliveryMode(stream?.deliveryMode);
  const hiddenBoundaryFallback =
    deliveryMode === "live"
      ? DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR_LIVE
      : DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR;
  return {
    deliveryMode,
    hiddenBoundarySeparator: resolveAcpHiddenBoundarySeparator(
      stream?.hiddenBoundarySeparator,
      hiddenBoundaryFallback,
    ),
    repeatSuppression: clampBoolean(stream?.repeatSuppression, DEFAULT_ACP_REPEAT_SUPPRESSION),
    maxOutputChars: clampPositiveInteger(stream?.maxOutputChars, DEFAULT_ACP_MAX_OUTPUT_CHARS, {
      min: 1,
      max: 5e5,
    }),
    maxSessionUpdateChars: clampPositiveInteger(
      stream?.maxSessionUpdateChars,
      DEFAULT_ACP_MAX_SESSION_UPDATE_CHARS,
      {
        min: 64,
        max: 8e3,
      },
    ),
    tagVisibility: stream?.tagVisibility ?? {},
  };
}
/** Resolves ACP streaming chunk/coalescing settings. */
function resolveAcpStreamingConfig(params) {
  const resolved = resolveEffectiveBlockStreamingConfig({
    cfg: params.cfg,
    provider: params.provider,
    accountId: params.accountId,
    maxChunkChars: resolveAcpStreamMaxChunkChars(params.cfg),
    coalesceIdleMs: resolveAcpStreamCoalesceIdleMs(params.cfg),
  });
  if (params.deliveryMode === "live")
    return {
      chunking: {
        ...resolved.chunking,
        minChars: 1,
      },
      coalescing: {
        ...resolved.coalescing,
        minChars: 1,
        joiner: "",
      },
    };
  return resolved;
}
function isAcpTagVisible(settings, tag) {
  if (!tag) return true;
  if (!isAcpSessionUpdateTag(tag)) return true;
  const override = settings.tagVisibility[tag];
  if (typeof override === "boolean") return override;
  const defaultVisibility = ACP_TAG_VISIBILITY_DEFAULTS[tag];
  if (defaultVisibility === void 0) throw new Error(`Missing ACP visibility default for ${tag}`);
  return defaultVisibility;
}
//#endregion
export { resolveAcpProjectionSettings as n, resolveAcpStreamingConfig as r, isAcpTagVisible as t };
