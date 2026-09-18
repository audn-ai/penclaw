import { g as readResponseTextLimited } from "./provider-http-errors-DLMRBkZU.js";
import "./provider-http-BDIltggC.js";
//#region extensions/google-meet/src/google-api-errors.ts
const REAUTH_HINT = "Re-run `openclaw googlemeet auth login` and store the refreshed oauth block.";
const GOOGLE_API_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
function scopeText(scopes) {
  return scopes.map((scope) => `\`${scope}\``).join(", ");
}
async function readGoogleApiErrorDetail(response) {
  return await readResponseTextLimited(response, GOOGLE_API_ERROR_BODY_LIMIT_BYTES);
}
async function googleApiError(params) {
  const detail = await readGoogleApiErrorDetail(params.response);
  const scopeHint =
    params.scopes && params.scopes.length > 0
      ? ` Required OAuth scope: ${scopeText(params.scopes)}. ${REAUTH_HINT}`
      : "";
  return /* @__PURE__ */ new Error(
    `${params.prefix} failed (${params.response.status}): ${detail}${scopeHint}`,
  );
}
//#endregion
export { readGoogleApiErrorDetail as n, googleApiError as t };
