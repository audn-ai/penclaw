import { m as ModelProviderDeclarationConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/nvidia/provider-catalog.d.ts
declare const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
declare const NVIDIA_FEATURED_MODELS_URL =
  "https://assets.ngc.nvidia.com/products/api-catalog/featured-models.json";
declare function buildNvidiaProvider(): ModelProviderDeclarationConfig;
declare function buildSelectableNvidiaProvider(): ModelProviderDeclarationConfig;
declare function buildLiveNvidiaProvider(): Promise<ModelProviderDeclarationConfig>;
declare function buildSelectableLiveNvidiaProvider(): Promise<ModelProviderDeclarationConfig>;
declare function clearNvidiaFeaturedModelCacheForTests(): void;
//#endregion
export {
  buildSelectableLiveNvidiaProvider as a,
  buildNvidiaProvider as i,
  NVIDIA_FEATURED_MODELS_URL as n,
  buildSelectableNvidiaProvider as o,
  buildLiveNvidiaProvider as r,
  clearNvidiaFeaturedModelCacheForTests as s,
  NVIDIA_DEFAULT_MODEL_ID as t,
};
