import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import "./provider-http-BDIltggC.js";
//#region extensions/feishu/src/json-response.ts
/** Feishu control-plane JSON responses are tiny; 16 MiB leaves ample headroom. */
const FEISHU_JSON_MAX_BYTES = 16 * 1024 * 1024;
async function readFeishuJsonResponse(response, label = "feishu.api") {
  return readProviderJsonResponse(response, label, { maxBytes: FEISHU_JSON_MAX_BYTES });
}
//#endregion
export { readFeishuJsonResponse as t };
