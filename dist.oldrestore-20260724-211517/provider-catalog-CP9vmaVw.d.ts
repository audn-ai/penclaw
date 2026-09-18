import { m as ModelProviderDeclarationConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/xiaomi/provider-catalog.d.ts
declare const XIAOMI_PROVIDER_ID = "xiaomi";
declare const XIAOMI_TOKEN_PLAN_PROVIDER_ID = "xiaomi-token-plan";
declare const XIAOMI_DEFAULT_MODEL_ID = "mimo-v2-flash";
declare const XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID = "mimo-v2.5-pro";
declare const XIAOMI_TOKEN_PLAN_BASE_URLS: {
  readonly ams: "https://token-plan-ams.xiaomimimo.com/v1";
  readonly cn: "https://token-plan-cn.xiaomimimo.com/v1";
  readonly sgp: "https://token-plan-sgp.xiaomimimo.com/v1";
};
type XiaomiTokenPlanRegion = keyof typeof XIAOMI_TOKEN_PLAN_BASE_URLS;
declare function buildXiaomiProvider(): ModelProviderDeclarationConfig;
declare function buildXiaomiTokenPlanProvider(): ModelProviderDeclarationConfig;
declare function resolveXiaomiTokenPlanBaseUrl(region: XiaomiTokenPlanRegion): string;
//#endregion
export {
  XiaomiTokenPlanRegion as a,
  resolveXiaomiTokenPlanBaseUrl as c,
  XIAOMI_TOKEN_PLAN_PROVIDER_ID as i,
  XIAOMI_PROVIDER_ID as n,
  buildXiaomiProvider as o,
  XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID as r,
  buildXiaomiTokenPlanProvider as s,
  XIAOMI_DEFAULT_MODEL_ID as t,
};
