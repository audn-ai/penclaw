import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/meta/onboard.d.ts
/** Default Meta model reference used after onboarding. */
declare const META_DEFAULT_MODEL_REF = "meta/muse-spark-1.1";
/** Applies Meta provider/catalog config and default model aliases. */
declare function applyMetaConfig(cfg: OpenClawConfig): OpenClawConfig;
//#endregion
export { applyMetaConfig as n, META_DEFAULT_MODEL_REF as t };
