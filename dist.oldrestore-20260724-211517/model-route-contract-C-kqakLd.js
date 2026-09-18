//#region extensions/openai/model-route-contract.ts
const OPENAI_CHAT_LATEST_MODEL_ID = "chat-latest";
const OPENAI_GPT_56_MODEL_ID = "gpt-5.6";
const OPENAI_GPT_56_SOL_MODEL_ID = "gpt-5.6-sol";
const OPENAI_GPT_56_TERRA_MODEL_ID = "gpt-5.6-terra";
const OPENAI_GPT_56_LUNA_MODEL_ID = "gpt-5.6-luna";
const OPENAI_GPT_55_MODEL_ID = "gpt-5.5";
const OPENAI_GPT_55_PRO_MODEL_ID = "gpt-5.5-pro";
const OPENAI_GPT_54_MODEL_ID = "gpt-5.4";
const OPENAI_GPT_54_LEGACY_MODEL_ID = "gpt-5.4-codex";
const OPENAI_GPT_54_PRO_MODEL_ID = "gpt-5.4-pro";
const OPENAI_GPT_54_MINI_MODEL_ID = "gpt-5.4-mini";
const OPENAI_GPT_54_NANO_MODEL_ID = "gpt-5.4-nano";
const OPENAI_GPT_53_CODEX_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
const OPENAI_GPT_56_VARIANT_MODEL_IDS = [
  OPENAI_GPT_56_SOL_MODEL_ID,
  OPENAI_GPT_56_TERRA_MODEL_ID,
  OPENAI_GPT_56_LUNA_MODEL_ID,
];
/** Models with known first-party Platform and ChatGPT transports. */
const OPENAI_DUAL_ROUTE_MODEL_IDS = [
  ...OPENAI_GPT_56_VARIANT_MODEL_IDS,
  OPENAI_GPT_55_MODEL_ID,
  OPENAI_GPT_55_PRO_MODEL_ID,
  OPENAI_GPT_54_MODEL_ID,
  OPENAI_GPT_54_PRO_MODEL_ID,
  OPENAI_GPT_54_MINI_MODEL_ID,
];
/** Direct aliases excluded from the ChatGPT catalog. */
const OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS = [OPENAI_CHAT_LATEST_MODEL_ID, OPENAI_GPT_56_MODEL_ID];
const OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS = [OPENAI_GPT_53_CODEX_SPARK_MODEL_ID];
/** Modern model refs recognized by the unified OpenAI provider surface. */
const OPENAI_PROVIDER_MODERN_MODEL_IDS = [
  ...OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS,
  ...OPENAI_DUAL_ROUTE_MODEL_IDS,
  OPENAI_GPT_54_NANO_MODEL_ID,
  ...OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS,
];
const OPENAI_CHATGPT_MODERN_MODEL_IDS = [
  ...OPENAI_DUAL_ROUTE_MODEL_IDS,
  ...OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS,
];
const openAIDualRouteModelIds = new Set(OPENAI_DUAL_ROUTE_MODEL_IDS);
const openAIPlatformOnlyRouteModelIds = new Set(OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS);
const openAISubscriptionOnlyRouteModelIds = new Set(OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS);
function normalizeOpenAIModelRouteId(value) {
  const modelId = value?.trim() ?? "";
  const normalized = modelId.toLowerCase();
  return normalized === "gpt-5.4-codex" || normalized === `openai/gpt-5.4-codex`
    ? OPENAI_GPT_54_MODEL_ID
    : modelId;
}
function normalizeOpenAIRouteMembershipId(value) {
  return normalizeOpenAIModelRouteId(value).toLowerCase();
}
function isOpenAIDualRouteModelId(value) {
  return openAIDualRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
function isOpenAIPlatformOnlyRouteModelId(value) {
  return openAIPlatformOnlyRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
function isOpenAISubscriptionOnlyRouteModelId(value) {
  return openAISubscriptionOnlyRouteModelIds.has(normalizeOpenAIRouteMembershipId(value));
}
//#endregion
export {
  normalizeOpenAIModelRouteId as C,
  isOpenAISubscriptionOnlyRouteModelId as S,
  OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS as _,
  OPENAI_GPT_54_LEGACY_MODEL_ID as a,
  isOpenAIDualRouteModelId as b,
  OPENAI_GPT_54_NANO_MODEL_ID as c,
  OPENAI_GPT_55_PRO_MODEL_ID as d,
  OPENAI_GPT_56_LUNA_MODEL_ID as f,
  OPENAI_GPT_56_VARIANT_MODEL_IDS as g,
  OPENAI_GPT_56_TERRA_MODEL_ID as h,
  OPENAI_GPT_53_CODEX_SPARK_MODEL_ID as i,
  OPENAI_GPT_54_PRO_MODEL_ID as l,
  OPENAI_GPT_56_SOL_MODEL_ID as m,
  OPENAI_CHAT_LATEST_MODEL_ID as n,
  OPENAI_GPT_54_MINI_MODEL_ID as o,
  OPENAI_GPT_56_MODEL_ID as p,
  OPENAI_DUAL_ROUTE_MODEL_IDS as r,
  OPENAI_GPT_54_MODEL_ID as s,
  OPENAI_CHATGPT_MODERN_MODEL_IDS as t,
  OPENAI_GPT_55_MODEL_ID as u,
  OPENAI_PROVIDER_MODERN_MODEL_IDS as v,
  isOpenAIPlatformOnlyRouteModelId as x,
  OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS as y,
};
