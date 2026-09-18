import "./utils-DtcDeqWS.js";
import "./fetch-timeout-CAJNUHY1.js";
import "./with-timeout-BseNE9qY.js";
//#region src/plugin-sdk/text-utility-runtime.ts
/** Escapes text for safe insertion into HTML text and quoted attribute values. */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
//#endregion
export { escapeHtml as t };
