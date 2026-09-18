import {
  i as describeImagesWithModelPayloadTransform,
  n as describeImageWithModelPayloadTransform,
} from "./image-runtime-Bf0M579x.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./media-understanding-CJqVtMxb.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/opencode/media-understanding-provider.ts
function stripOpencodeDisabledResponsesReasoningPayload(payload) {
  if (!isRecord(payload)) return;
  const reasoning = payload.reasoning;
  if (reasoning === "none") {
    delete payload.reasoning;
    return;
  }
  if (!isRecord(reasoning) || reasoning.effort !== "none") return;
  delete payload.reasoning;
}
const stripDisabledResponsesReasoning = (payload) => {
  stripOpencodeDisabledResponsesReasoningPayload(payload);
};
const opencodeMediaUnderstandingProvider = {
  id: "opencode",
  capabilities: ["image"],
  defaultModels: { image: "gpt-5-nano" },
  describeImage: (request) =>
    describeImageWithModelPayloadTransform(request, stripDisabledResponsesReasoning),
  describeImages: (request) =>
    describeImagesWithModelPayloadTransform(request, stripDisabledResponsesReasoning),
};
//#endregion
export {
  stripOpencodeDisabledResponsesReasoningPayload as n,
  opencodeMediaUnderstandingProvider as t,
};
