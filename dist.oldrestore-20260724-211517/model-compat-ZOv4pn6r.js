import { t as applyModelCompatPatch } from "./provider-model-compat-oht7fX8H.js";
import "./provider-model-shared-CYlCpWlu.js";
//#region extensions/xai/model-compat.ts
const XAI_TOOL_SCHEMA_PROFILE = "xai";
const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
const XAI_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set(["minContains", "maxContains"]);
function resolveXaiModelCompatPatch() {
  return {
    toolSchemaProfile: "xai",
    unsupportedToolSchemaKeywords: Array.from(XAI_UNSUPPORTED_SCHEMA_KEYWORDS),
    nativeWebSearchTool: true,
    toolCallArgumentsEncoding: HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING,
  };
}
function applyXaiModelCompat(model) {
  return applyModelCompatPatch(model, resolveXaiModelCompatPatch());
}
//#endregion
export {
  XAI_TOOL_SCHEMA_PROFILE as n,
  applyXaiModelCompat as r,
  HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING as t,
};
