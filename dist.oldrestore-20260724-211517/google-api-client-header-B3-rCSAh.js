import { c as resolveProviderRequestHeaders } from "./provider-request-config-DpW-uV6A.js";
import "./provider-http-BDIltggC.js";
import "./google-api-base-url-B0vh8Owj.js";
import "./provider-policy-7Kv8Y-Tx.js";
//#region extensions/google/google-api-client-header.ts
function resolveGoogleApiClientHeaders(params) {
  return (
    resolveProviderRequestHeaders({
      provider: "google",
      api: params?.api ?? "google-generative-ai",
      baseUrl: params?.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta",
      capability: params?.capability ?? "other",
      transport: params?.transport ?? "http",
    }) ?? {}
  );
}
//#endregion
export { resolveGoogleApiClientHeaders as t };
