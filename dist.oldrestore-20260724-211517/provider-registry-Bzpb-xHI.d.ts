import { Yn as VideoGenerationProviderPlugin } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/video-generation/provider-registry.d.ts
declare function listVideoGenerationProviders(
  cfg?: OpenClawConfig,
): VideoGenerationProviderPlugin[];
declare function getVideoGenerationProvider(
  providerId: string | undefined,
  cfg?: OpenClawConfig,
): VideoGenerationProviderPlugin | undefined;
//#endregion
export { listVideoGenerationProviders as n, getVideoGenerationProvider as t };
