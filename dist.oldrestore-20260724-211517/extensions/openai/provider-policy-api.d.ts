import { Tt as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-DPCR66aO.js";
import {
  o as ProviderNormalizeModelCatalogIdContext,
  r as ProviderModelRouteResolution,
  s as ProviderResolveModelRoutesContext,
} from "../../provider-model-types-BoDUnm4e.js";
import { td as ProviderThinkingProfile } from "../../types-Ga3mNO_F.js";
import { f as ModelProviderConfig } from "../../types.models-BqJSiNyu.js";
//#region extensions/openai/provider-policy-api.d.ts
/** Canonical logical id for OpenAI catalog projection. */
declare function normalizeModelCatalogId(
  params: ProviderNormalizeModelCatalogIdContext,
): string | null;
/** Resolves every physical row for one logical OpenAI model in provider order. */
declare function resolveModelRoutes(
  context: ProviderResolveModelRoutesContext,
): ProviderModelRouteResolution;
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(
  params: ProviderDefaultThinkingPolicyContext,
): ProviderThinkingProfile | null;
//#endregion
export { normalizeConfig, normalizeModelCatalogId, resolveModelRoutes, resolveThinkingProfile };
