import {
  _ as ProviderRequestCapability,
  x as ProviderRequestTransport,
} from "../../provider-request-config-CKlP6x21.js";
//#region extensions/google/google-api-client-header.d.ts
declare function resolveGoogleApiClientHeaders(params?: {
  api?: string;
  baseUrl?: string;
  capability?: ProviderRequestCapability;
  transport?: ProviderRequestTransport;
}): Record<string, string>;
//#endregion
export { resolveGoogleApiClientHeaders };
