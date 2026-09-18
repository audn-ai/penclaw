import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
const THINKING_LEVELS_HELP = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "adaptive",
  "max",
  "ultra",
].join("|");
const BASE_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high"];
const THINKING_LEVEL_RANKS = {
  off: 0,
  minimal: 10,
  low: 20,
  medium: 30,
  high: 40,
  adaptive: 30,
  xhigh: 60,
  max: 70,
  ultra: 80,
};
/** Normalizes user-provided thinking level strings to the canonical enum. */
function normalizeThinkLevel(raw) {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) return;
  const collapsed = key.replace(/[\s_-]+/g, "");
  if (collapsed === "adaptive" || collapsed === "auto") return "adaptive";
  if (collapsed === "max") return "max";
  if (collapsed === "ultra") return "ultra";
  if (collapsed === "xhigh" || collapsed === "extrahigh") return "xhigh";
  if (["off"].includes(key)) return "off";
  if (["on", "enable", "enabled"].includes(key)) return "low";
  if (["min", "minimal"].includes(key)) return "minimal";
  if (["low", "thinkhard", "think-hard", "think_hard"].includes(key)) return "low";
  if (["mid", "med", "medium", "thinkharder", "think-harder", "harder"].includes(key))
    return "medium";
  if (["high", "ultrathink", "think-hard", "thinkhardest", "highest"].includes(key)) return "high";
  if (["think"].includes(key)) return "minimal";
}
/** Returns true for command values that clear an inherited session override. */
function isSessionDefaultDirectiveValue(raw) {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) return false;
  return ["default", "inherit", "inherited", "clear", "reset", "unpin"].includes(key);
}
/** Chooses the default thinking level for one provider/model catalog entry. */
function resolveThinkingDefaultForModel(params) {
  if (
    params.catalog?.find((entry) => entry.provider === params.provider && entry.id === params.model)
      ?.reasoning
  )
    return "low";
  return "off";
}
function normalizeOnOffFullLevel(raw) {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) return;
  if (["off", "false", "no", "0"].includes(key)) return "off";
  if (["full", "all", "everything"].includes(key)) return "full";
  if (["on", "minimal", "true", "yes", "1"].includes(key)) return "on";
}
/** Normalizes /verbose values. */
function normalizeVerboseLevel(raw) {
  return normalizeOnOffFullLevel(raw);
}
/** Normalizes /trace values. */
function normalizeTraceLevel(raw) {
  const key = normalizeOptionalLowercaseString(raw);
  if (!key) return;
  if (["off", "false", "no", "0"].includes(key)) return "off";
  if (["on", "true", "yes", "1"].includes(key)) return "on";
  if (["raw", "unfiltered"].includes(key)) return "raw";
}
/** Normalizes response usage display values. */
function normalizeUsageDisplay(raw) {
  if (!raw) return;
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "disable", "disabled"].includes(key)) return "off";
  if (["on", "true", "yes", "1", "enable", "enabled"].includes(key)) return "tokens";
  if (["tokens", "token", "tok", "minimal", "min"].includes(key)) return "tokens";
  if (["full", "session"].includes(key)) return "full";
}
/** Resolves response usage display mode with the persisted default. */
function resolveResponseUsageMode(raw) {
  return normalizeUsageDisplay(raw) ?? "off";
}
function resolveMessagesResponseUsageDefault(configured, channel) {
  if (typeof configured === "string") return configured;
  if (configured && typeof configured === "object")
    return (channel ? configured[channel] : void 0) ?? configured.default;
}
function resolveEffectiveResponseUsage(sessionRaw, configured, channel) {
  const sessionNormalized = normalizeUsageDisplay(sessionRaw);
  if (sessionNormalized !== void 0) return sessionNormalized;
  return resolveResponseUsageMode(resolveMessagesResponseUsageDefault(configured, channel));
}
/** Normalizes elevated execution policy values. */
function normalizeElevatedLevel(raw) {
  if (!raw) return;
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0"].includes(key)) return "off";
  if (["full", "auto", "auto-approve", "autoapprove"].includes(key)) return "full";
  if (["ask", "prompt", "approval", "approve"].includes(key)) return "ask";
  if (["on", "true", "yes", "1"].includes(key)) return "on";
}
/** Normalizes reasoning visibility values. */
function normalizeReasoningLevel(raw) {
  if (!raw) return;
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "hide", "hidden", "disable", "disabled"].includes(key))
    return "off";
  if (["on", "true", "yes", "1", "show", "visible", "enable", "enabled"].includes(key)) return "on";
  if (["stream", "streaming", "draft", "live"].includes(key)) return "stream";
}
//#endregion
export {
  normalizeElevatedLevel as a,
  normalizeTraceLevel as c,
  resolveEffectiveResponseUsage as d,
  resolveResponseUsageMode as f,
  isSessionDefaultDirectiveValue as i,
  normalizeUsageDisplay as l,
  THINKING_LEVELS_HELP as n,
  normalizeReasoningLevel as o,
  resolveThinkingDefaultForModel as p,
  THINKING_LEVEL_RANKS as r,
  normalizeThinkLevel as s,
  BASE_THINKING_LEVELS as t,
  normalizeVerboseLevel as u,
};
