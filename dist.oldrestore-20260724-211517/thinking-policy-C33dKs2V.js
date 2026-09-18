import { u as normalizeProviderId } from "./provider-model-shared-CYlCpWlu.js";
//#region extensions/vllm/thinking-policy.ts
const VLLM_BINARY_THINKING_PROFILE = {
  levels: [
    { id: "off" },
    {
      id: "low",
      label: "on",
    },
  ],
  defaultLevel: "off",
};
function normalizeVllmQwenThinkingFormat(value) {
  if (typeof value !== "string") return;
  const normalized = value.trim().toLowerCase().replace(/_/g, "-");
  if (
    normalized === "chat-template" ||
    normalized === "chat-template-kwargs" ||
    normalized === "chat-template-kwarg" ||
    normalized === "chat-template-arguments" ||
    normalized === "qwen-chat-template"
  )
    return "chat-template";
  if (
    normalized === "top-level" ||
    normalized === "enable-thinking" ||
    normalized === "request-body" ||
    normalized === "qwen"
  )
    return "top-level";
}
function resolveVllmQwenThinkingFormatFromCompat(compat) {
  return normalizeVllmQwenThinkingFormat(compat?.thinkingFormat);
}
function isVllmNemotronThinkingModel(modelId) {
  return /\bnemotron-3(?:[-_](?:nano|super|ultra))?\b/i.test(modelId);
}
function resolveThinkingProfile(ctx) {
  if (normalizeProviderId(ctx.provider) !== "vllm") return null;
  if (ctx.reasoning === false) return null;
  if (
    resolveVllmQwenThinkingFormatFromCompat(ctx.compat) ||
    (ctx.reasoning === true && isVllmNemotronThinkingModel(ctx.modelId))
  )
    return VLLM_BINARY_THINKING_PROFILE;
  return null;
}
//#endregion
export { resolveVllmQwenThinkingFormatFromCompat as n, resolveThinkingProfile as t };
