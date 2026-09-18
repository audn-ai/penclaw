import { a as XiaomiTokenPlanRegion } from "./provider-catalog-CP9vmaVw.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region extensions/xiaomi/onboard.d.ts
declare const XIAOMI_DEFAULT_MODEL_REF = "xiaomi/mimo-v2-flash";
declare const XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF = "xiaomi-token-plan/mimo-v2.5-pro";
declare function applyXiaomiProviderConfig(cfg: OpenClawConfig): OpenClawConfig;
declare function applyXiaomiConfig(cfg: OpenClawConfig): OpenClawConfig;
declare function applyXiaomiTokenPlanProviderConfig(
  cfg: OpenClawConfig,
  region: XiaomiTokenPlanRegion,
): OpenClawConfig;
declare function applyXiaomiTokenPlanConfig(
  cfg: OpenClawConfig,
  region: XiaomiTokenPlanRegion,
): OpenClawConfig;
//#endregion
export {
  applyXiaomiTokenPlanConfig as a,
  applyXiaomiProviderConfig as i,
  XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_REF as n,
  applyXiaomiTokenPlanProviderConfig as o,
  applyXiaomiConfig as r,
  XIAOMI_DEFAULT_MODEL_REF as t,
};
