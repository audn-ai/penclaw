import { n as resolveFallbackXaiAuth } from "../../tool-auth-shared-B64Ekm8c.js";
import "../../provider-web-search-Bpbir19i.js";
import { m as readProviderEnvValue } from "../../web-search-provider-common-B8EoIruV.js";
//#region extensions/xai/provider-discovery.ts
const PROVIDER_ID = "xai";
function resolveXaiSyntheticAuth(config) {
  const apiKey = resolveFallbackXaiAuth(config)?.apiKey || readProviderEnvValue(["XAI_API_KEY"]);
  return apiKey
    ? {
        apiKey,
        source: "xAI plugin config",
        mode: "api-key",
      }
    : void 0;
}
const xaiProviderDiscovery = {
  id: PROVIDER_ID,
  label: "xAI",
  docsPath: "/providers/xai",
  auth: [],
  resolveSyntheticAuth: ({ config }) => resolveXaiSyntheticAuth(config),
};
//#endregion
export { xaiProviderDiscovery as default };
