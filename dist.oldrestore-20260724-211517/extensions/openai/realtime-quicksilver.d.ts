//#region extensions/openai/realtime-quicksilver.d.ts
declare const OPENAI_GPT_LIVE_BRIDGE_UNSUPPORTED_MESSAGE =
  "GPT-Live models are not supported on the realtime WebSocket bridge: OpenAI requires WebRTC for quicksilver sessions. Set a gpt-realtime model for this transport.";
declare const OPENAI_GPT_LIVE_BROWSER_SESSION_UNSUPPORTED_MESSAGE =
  "GPT-Live models are not supported for Talk browser sessions yet: quicksilver sessions delegate through conversation.handoff events that the Talk client does not implement. Set a gpt-realtime model until GPT-Live support lands.";
declare function isOpenAIGptLiveModel(model: string | undefined): boolean;
//#endregion
export {
  OPENAI_GPT_LIVE_BRIDGE_UNSUPPORTED_MESSAGE,
  OPENAI_GPT_LIVE_BROWSER_SESSION_UNSUPPORTED_MESSAGE,
  isOpenAIGptLiveModel,
};
