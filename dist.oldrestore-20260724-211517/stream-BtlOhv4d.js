import { r as isOpencodeGoKimiNoReasoningModelId } from "./provider-catalog-BeaYXsg4.js";
import {
  i as createDeepSeekV4OpenAICompatibleThinkingWrapper,
  k as streamWithPayloadPatch,
} from "./provider-stream-shared-CMy-5I0G.js";
import { t as stripOpencodeGoKimiReasoningPayload } from "./reasoning-sanitizer-BA49xp2a.js";
import {
  n as OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT,
  r as createOpencodeGoStalledStreamWrapper,
  t as OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT,
} from "./stream-termination-DGRMjQLV.js";
//#region extensions/opencode-go/stream.ts
function isOpencodeGoDeepSeekV4ModelId(modelId) {
  return modelId === "deepseek-v4-flash" || modelId === "deepseek-v4-pro";
}
function createOpencodeGoDeepSeekV4Wrapper(baseStreamFn, thinkingLevel) {
  return createDeepSeekV4OpenAICompatibleThinkingWrapper({
    baseStreamFn,
    thinkingLevel,
    shouldPatchModel: (model) =>
      model.provider === "opencode-go" && isOpencodeGoDeepSeekV4ModelId(model.id),
  });
}
function stripReasoningParams(payloadObj) {
  stripOpencodeGoKimiReasoningPayload(payloadObj);
}
function createOpencodeGoKimiNoReasoningWrapper(baseStreamFn) {
  if (!baseStreamFn) return;
  const underlying = baseStreamFn;
  return (model, context, options) => {
    if (model.provider !== "opencode-go" || !isOpencodeGoKimiNoReasoningModelId(model.id))
      return underlying(model, context, options);
    return streamWithPayloadPatch(underlying, model, context, options, stripReasoningParams);
  };
}
function createOpencodeGoWrapper(baseStreamFn, thinkingLevel) {
  if (!baseStreamFn) return;
  const kimiWrapped = createOpencodeGoKimiNoReasoningWrapper(baseStreamFn) ?? baseStreamFn;
  return createOpencodeGoStalledStreamWrapper(
    createOpencodeGoDeepSeekV4Wrapper(kimiWrapped, thinkingLevel) ?? kimiWrapped,
    {
      provider: "opencode-go",
      idleTimeoutMs: OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT,
      firstEventTimeoutMs: OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT,
    },
  );
}
//#endregion
export { createOpencodeGoWrapper as t };
