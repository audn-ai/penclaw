import { h as resolveProviderHttpRequestConfig } from "../../provider-http-CA2-2Xn-.js";
import { _ as ProviderRequestCapability } from "../../provider-request-config-CKlP6x21.js";
import { s as AuthProfileStore } from "../../types-Dzb4Vh4b.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/fal/http-config.d.ts
type FalAuthenticatedRequest = {
  cfg?: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
};
declare function resolveFalHttpRequestConfig(params: {
  req: FalAuthenticatedRequest;
  baseUrl?: string;
  capability: ProviderRequestCapability;
}): Promise<ReturnType<typeof resolveProviderHttpRequestConfig>>;
//#endregion
export { resolveFalHttpRequestConfig };
