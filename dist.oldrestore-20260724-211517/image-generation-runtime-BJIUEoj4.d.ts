import { n as getProviderEnvVars } from "./provider-env-vars-D_E_Txif.js";
import {
  n as listImageGenerationProviders,
  t as getImageGenerationProvider,
} from "./provider-registry-a-qKdGEd.js";
import { t as SubsystemLogger } from "./subsystem-BvPn7HK_.js";
import { l as ImageGenerationProvider } from "./types-CVRxRIni.js";
import { bu as GenerateImageParams, xu as GenerateImageRuntimeResult } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/image-generation/runtime.d.ts
declare const log: SubsystemLogger;
/** Dependency seam used by image-generation runtime tests and plugin host callers. */
type ImageGenerationRuntimeDeps = {
  getProvider?: typeof getImageGenerationProvider;
  listProviders?: typeof listImageGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "warn">;
};
/** Lists image-generation providers visible for the current config. */
declare function listRuntimeImageGenerationProviders(
  params?: {
    config?: OpenClawConfig;
  },
  deps?: ImageGenerationRuntimeDeps,
): ImageGenerationProvider[];
declare function generateImage(
  params: GenerateImageParams,
  deps?: ImageGenerationRuntimeDeps,
): Promise<GenerateImageRuntimeResult>;
//#endregion
export { listRuntimeImageGenerationProviders as n, generateImage as t };
