//#region extensions/xai/model-compat.d.ts
declare const XAI_TOOL_SCHEMA_PROFILE = "xai";
declare const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
declare function applyXaiModelCompat<
  T extends {
    compat?: unknown;
  },
>(model: T): T;
//#endregion
export {
  XAI_TOOL_SCHEMA_PROFILE as n,
  applyXaiModelCompat as r,
  HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING as t,
};
