import "./utils-DtcDeqWS.js";
import "./types.secrets-BV0ywRAy.js";
import "./setup-helpers-Dl0hnWtQ.js";
import "./detect-binary-BkSLZSbH.js";
import "./setup-wizard-helpers-Kz9xlQ7e.js";
import "./setup-wizard-proxy-DIVPLm_0.js";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
  if (params.resolved.length === 0 && params.unresolved.length === 0) return;
  return [
    params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0,
    params.unresolved.length > 0
      ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}`
      : void 0,
  ]
    .filter(Boolean)
    .join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
