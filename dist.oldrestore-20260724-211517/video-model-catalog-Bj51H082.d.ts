import { p as UnifiedModelCatalogEntry } from "./manifest-registry-CHEq75Tu.js";
import { un as UnifiedModelCatalogProviderContext } from "./plugin-entry-DPCR66aO.js";
import {
  c as VideoGenerationProviderCapabilities,
  o as VideoGenerationModelCapabilitiesContext,
} from "./video-generation-CbPqXC2P.js";

//#region extensions/openrouter/video-model-catalog.d.ts
type OpenRouterVideoModelCatalogCapabilities = VideoGenerationProviderCapabilities & {
  allowedPassthroughParameters?: readonly string[];
  canonicalSlug?: string;
  created?: number;
  description?: string;
  pricingSkus?: Readonly<Record<string, string>>;
};
declare function listOpenRouterVideoModelCatalog(
  ctx: UnifiedModelCatalogProviderContext,
): Promise<Array<UnifiedModelCatalogEntry<OpenRouterVideoModelCatalogCapabilities>> | null>;
declare function resolveOpenRouterVideoModelCapabilities(
  ctx: VideoGenerationModelCapabilitiesContext,
): Promise<VideoGenerationProviderCapabilities | undefined>;
//#endregion
export { resolveOpenRouterVideoModelCapabilities as n, listOpenRouterVideoModelCatalog as t };
