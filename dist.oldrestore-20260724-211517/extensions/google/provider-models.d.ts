import { qt as ProviderResolveDynamicModelContext } from "../../plugin-entry-DPCR66aO.js";
import { nd as ProviderRuntimeModel } from "../../types-Ga3mNO_F.js";

//#region extensions/google/provider-models.d.ts
declare function resolveGoogleGeminiForwardCompatModel(params: {
  providerId: string;
  templateProviderId?: string;
  ctx: ProviderResolveDynamicModelContext;
}): ProviderRuntimeModel | undefined;
declare function isModernGoogleModel(modelId: string): boolean;
//#endregion
export { isModernGoogleModel, resolveGoogleGeminiForwardCompatModel };
