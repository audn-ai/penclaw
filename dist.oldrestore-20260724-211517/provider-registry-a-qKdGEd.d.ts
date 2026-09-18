import { a as ImageGenerationProviderPlugin } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/image-generation/provider-registry.d.ts
/** Lists canonical image-generation providers visible for config. */
declare function listImageGenerationProviders(
  cfg?: OpenClawConfig,
): ImageGenerationProviderPlugin[];
/** Resolves an image-generation provider by canonical id or alias. */
declare function getImageGenerationProvider(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): ImageGenerationProviderPlugin | undefined;
//#endregion
export { listImageGenerationProviders as n, getImageGenerationProvider as t };
