import { n as getProviderEnvVars } from "./provider-env-vars-D_E_Txif.js";
import {
  n as listVideoGenerationProviders,
  t as getVideoGenerationProvider,
} from "./provider-registry-Bzpb-xHI.js";
import { t as SubsystemLogger } from "./subsystem-BvPn7HK_.js";
import { c as VideoGenerationProvider } from "./types-fuRzS_f5.js";
import { vu as GenerateVideoParams, yu as GenerateVideoRuntimeResult } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/video-generation/runtime.d.ts
declare const log: SubsystemLogger;
type VideoGenerationRuntimeDeps = {
  getProvider?: typeof getVideoGenerationProvider;
  listProviders?: typeof listVideoGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "debug" | "warn">;
};
declare function listRuntimeVideoGenerationProviders(
  params?: {
    config?: OpenClawConfig;
  },
  deps?: VideoGenerationRuntimeDeps,
): VideoGenerationProvider[];
declare function generateVideo(
  params: GenerateVideoParams,
  deps?: VideoGenerationRuntimeDeps,
): Promise<GenerateVideoRuntimeResult>;
//#endregion
export { listRuntimeVideoGenerationProviders as n, generateVideo as t };
