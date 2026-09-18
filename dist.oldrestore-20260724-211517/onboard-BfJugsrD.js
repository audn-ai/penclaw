import {
  o as buildSelectableNvidiaProvider,
  t as NVIDIA_DEFAULT_MODEL_ID,
} from "./provider-catalog-iyUb_LuV.js";
import { f as createDefaultModelsPresetAppliers } from "./provider-onboard-CvQgbxgZ.js";
//#region extensions/nvidia/onboard.ts
const NVIDIA_DEFAULT_MODEL_REF = NVIDIA_DEFAULT_MODEL_ID;
const nvidiaPresetAppliers = createDefaultModelsPresetAppliers({
  primaryModelRef: NVIDIA_DEFAULT_MODEL_REF,
  resolveParams: (_cfg) => {
    const defaultProvider = buildSelectableNvidiaProvider();
    return {
      providerId: "nvidia",
      api: defaultProvider.api ?? "openai-completions",
      baseUrl: defaultProvider.baseUrl,
      defaultModels: defaultProvider.models ?? [],
      defaultModelId: NVIDIA_DEFAULT_MODEL_ID,
      aliases: [
        {
          modelRef: NVIDIA_DEFAULT_MODEL_REF,
          alias: "NVIDIA",
        },
      ],
    };
  },
});
function applyNvidiaProviderConfig(cfg) {
  return nvidiaPresetAppliers.applyProviderConfig(cfg);
}
function applyNvidiaConfig(cfg) {
  return nvidiaPresetAppliers.applyConfig(cfg);
}
//#endregion
export { applyNvidiaConfig as n, applyNvidiaProviderConfig as r, NVIDIA_DEFAULT_MODEL_REF as t };
