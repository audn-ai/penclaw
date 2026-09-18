//#region extensions/openai/realtime-quicksilver.ts
const OPENAI_GPT_LIVE_MODEL_PREFIX = "gpt-live";
const OPENAI_GPT_LIVE_BRIDGE_UNSUPPORTED_MESSAGE =
  "GPT-Live models are not supported on the realtime WebSocket bridge: OpenAI requires WebRTC for quicksilver sessions. Set a gpt-realtime model for this transport.";
const OPENAI_GPT_LIVE_BROWSER_SESSION_UNSUPPORTED_MESSAGE =
  "GPT-Live models are not supported for Talk browser sessions yet: quicksilver sessions delegate through conversation.handoff events that the Talk client does not implement. Set a gpt-realtime model until GPT-Live support lands.";
function isOpenAIGptLiveModel(model) {
  if (!model) return false;
  const normalized = model.trim().toLowerCase();
  return (
    normalized === OPENAI_GPT_LIVE_MODEL_PREFIX ||
    normalized.startsWith(`${OPENAI_GPT_LIVE_MODEL_PREFIX}-`)
  );
}
//#endregion
export {
  OPENAI_GPT_LIVE_BROWSER_SESSION_UNSUPPORTED_MESSAGE as n,
  isOpenAIGptLiveModel as r,
  OPENAI_GPT_LIVE_BRIDGE_UNSUPPORTED_MESSAGE as t,
};
