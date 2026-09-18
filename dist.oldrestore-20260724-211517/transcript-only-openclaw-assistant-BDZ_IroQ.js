//#region src/shared/transcript-only-openclaw-assistant.ts
const OPENCLAW_TRANSCRIPT_ARTIFACT_API = "openclaw-transcript";
const OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER = "openclaw";
const OPENCLAW_DELIVERY_MIRROR_MODEL = "delivery-mirror";
const TRANSCRIPT_ONLY_OPENCLAW_ASSISTANT_MODELS = /* @__PURE__ */ new Set([
  OPENCLAW_DELIVERY_MIRROR_MODEL,
  "gateway-injected",
]);
function isTranscriptOnlyOpenClawAssistantModel(provider, model) {
  return (
    provider === "openclaw" &&
    typeof model === "string" &&
    TRANSCRIPT_ONLY_OPENCLAW_ASSISTANT_MODELS.has(model)
  );
}
function isTranscriptOnlyOpenClawAssistantMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return false;
  const entry = message;
  return (
    entry.role === "assistant" &&
    isTranscriptOnlyOpenClawAssistantModel(entry.provider, entry.model)
  );
}
function isOpenClawMessageToolMirrorAssistantMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return false;
  const entry = message;
  return entry.role === "assistant" && entry.openclawMessageToolMirror !== void 0;
}
function isOpenClawInternalSourceReplyMirrorAssistantMessage(message) {
  if (!isOpenClawMessageToolMirrorAssistantMessage(message)) return false;
  const marker = message.openclawMessageToolMirror;
  return (
    Boolean(marker) &&
    typeof marker === "object" &&
    !Array.isArray(marker) &&
    marker.sourceReplySink === "internal-ui"
  );
}
function isOpenClawDeliveryMirrorAssistantMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) return false;
  const entry = message;
  return (
    entry.role === "assistant" && entry.provider === "openclaw" && entry.model === "delivery-mirror"
  );
}
//#endregion
export {
  isOpenClawInternalSourceReplyMirrorAssistantMessage as a,
  isTranscriptOnlyOpenClawAssistantModel as c,
  isOpenClawDeliveryMirrorAssistantMessage as i,
  OPENCLAW_TRANSCRIPT_ARTIFACT_API as n,
  isOpenClawMessageToolMirrorAssistantMessage as o,
  OPENCLAW_TRANSCRIPT_ARTIFACT_PROVIDER as r,
  isTranscriptOnlyOpenClawAssistantMessage as s,
  OPENCLAW_DELIVERY_MIRROR_MODEL as t,
};
