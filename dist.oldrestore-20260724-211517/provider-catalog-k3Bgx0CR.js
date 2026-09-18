import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/xiaomi/openclaw.plugin.json
var modelCatalog = {
  providers: {
    xiaomi: {
      baseUrl: "https://api.xiaomimimo.com/v1",
      api: "openai-completions",
      models: [
        {
          id: "mimo-v2-flash",
          name: "Xiaomi MiMo V2 Flash",
          input: ["text"],
          contextWindow: 262144,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "mimo-v2-pro",
          name: "Xiaomi MiMo V2 Pro",
          input: ["text"],
          reasoning: true,
          contextWindow: 1048576,
          maxTokens: 32e3,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "mimo-v2-omni",
          name: "Xiaomi MiMo V2 Omni",
          input: ["text", "image"],
          reasoning: true,
          contextWindow: 262144,
          maxTokens: 32e3,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      ],
    },
    "xiaomi-token-plan": {
      baseUrl: "https://token-plan-sgp.xiaomimimo.com/v1",
      api: "openai-completions",
      models: [
        {
          id: "mimo-v2.5-pro",
          name: "Xiaomi MiMo V2.5 Pro",
          input: ["text"],
          reasoning: true,
          contextWindow: 1048576,
          maxTokens: 131072,
          cost: {
            input: 1,
            output: 3,
            cacheRead: 0.2,
            cacheWrite: 0,
            tieredPricing: [
              {
                input: 1,
                output: 3,
                cacheRead: 0.2,
                cacheWrite: 0,
                range: [0, 256e3],
              },
              {
                input: 1,
                output: 3,
                cacheRead: 0.4,
                cacheWrite: 0,
                range: [256e3],
              },
            ],
          },
        },
        {
          id: "mimo-v2.5",
          name: "Xiaomi MiMo V2.5",
          input: ["text", "image"],
          reasoning: true,
          contextWindow: 1048576,
          maxTokens: 131072,
          cost: {
            input: 0.4,
            output: 2,
            cacheRead: 0.08,
            cacheWrite: 0,
            tieredPricing: [
              {
                input: 0.4,
                output: 2,
                cacheRead: 0.08,
                cacheWrite: 0,
                range: [0, 256e3],
              },
              {
                input: 0.4,
                output: 2,
                cacheRead: 0.16,
                cacheWrite: 0,
                range: [256e3],
              },
            ],
          },
        },
      ],
    },
  },
  discovery: {
    xiaomi: "static",
    "xiaomi-token-plan": "runtime",
  },
};
//#endregion
//#region extensions/xiaomi/provider-catalog.ts
const XIAOMI_PROVIDER_ID = "xiaomi";
const XIAOMI_TOKEN_PLAN_PROVIDER_ID = "xiaomi-token-plan";
const XIAOMI_DEFAULT_MODEL_ID = "mimo-v2-flash";
const XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID = "mimo-v2.5-pro";
const XIAOMI_TOKEN_PLAN_BASE_URLS = {
  ams: "https://token-plan-ams.xiaomimimo.com/v1",
  cn: "https://token-plan-cn.xiaomimimo.com/v1",
  sgp: "https://token-plan-sgp.xiaomimimo.com/v1",
};
function buildXiaomiProvider() {
  return buildManifestModelProviderConfig({
    providerId: XIAOMI_PROVIDER_ID,
    catalog: modelCatalog.providers.xiaomi,
  });
}
function buildXiaomiTokenPlanProvider() {
  return buildManifestModelProviderConfig({
    providerId: XIAOMI_TOKEN_PLAN_PROVIDER_ID,
    catalog: modelCatalog.providers[XIAOMI_TOKEN_PLAN_PROVIDER_ID],
  });
}
function resolveXiaomiTokenPlanBaseUrl(region) {
  return XIAOMI_TOKEN_PLAN_BASE_URLS[region];
}
//#endregion
export {
  buildXiaomiProvider as a,
  XIAOMI_TOKEN_PLAN_PROVIDER_ID as i,
  XIAOMI_PROVIDER_ID as n,
  buildXiaomiTokenPlanProvider as o,
  XIAOMI_TOKEN_PLAN_DEFAULT_MODEL_ID as r,
  resolveXiaomiTokenPlanBaseUrl as s,
  XIAOMI_DEFAULT_MODEL_ID as t,
};
