import { Tt as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-DPCR66aO.js";
import { td as ProviderThinkingProfile } from "../../types-Ga3mNO_F.js";
import { f as ModelProviderConfig } from "../../types.models-BqJSiNyu.js";
//#region extensions/google/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(
  context: ProviderDefaultThinkingPolicyContext,
): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeConfig, resolveThinkingProfile };
