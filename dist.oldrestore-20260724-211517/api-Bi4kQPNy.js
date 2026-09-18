import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./models-BABzHN6w.js";
import "./provider-catalog-DXl-K4n8.js";
//#region extensions/volcengine/api.ts
const VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS = [
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "minContains",
  "maxContains",
];
function mergeUnsupportedToolSchemaKeywords(existing) {
  return uniqueStrings([...(existing ?? []), ...VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS]);
}
function resolveVolcengineToolSchemaCompatPatch(compat) {
  return {
    unsupportedToolSchemaKeywords: mergeUnsupportedToolSchemaKeywords(
      compat?.unsupportedToolSchemaKeywords,
    ),
  };
}
function applyVolcengineToolSchemaCompat(model) {
  const unsupportedToolSchemaKeywords = mergeUnsupportedToolSchemaKeywords(
    model.compat?.unsupportedToolSchemaKeywords,
  );
  if (
    model.compat?.unsupportedToolSchemaKeywords?.length === unsupportedToolSchemaKeywords.length &&
    unsupportedToolSchemaKeywords.every(
      (keyword, index) => model.compat?.unsupportedToolSchemaKeywords?.[index] === keyword,
    )
  )
    return model;
  return {
    ...model,
    compat: {
      ...model.compat,
      unsupportedToolSchemaKeywords,
    },
  };
}
//#endregion
export {
  applyVolcengineToolSchemaCompat as n,
  resolveVolcengineToolSchemaCompatPatch as r,
  VOLCENGINE_UNSUPPORTED_TOOL_SCHEMA_KEYWORDS as t,
};
