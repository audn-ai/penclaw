import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.js";
//#region src/plugin-sdk/boolean-param.ts
/** Read loose boolean params from tool input that may arrive as booleans or "true"/"false" strings. */
function readBooleanParam(params, key) {
  return parseBoolean(params[key]);
}
//#endregion
export { readBooleanParam as t };
