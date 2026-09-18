//#region extensions/openai/model-route-contract.d.ts
declare const OPENAI_CHAT_LATEST_MODEL_ID = "chat-latest";
declare const OPENAI_GPT_56_MODEL_ID = "gpt-5.6";
declare const OPENAI_GPT_56_SOL_MODEL_ID = "gpt-5.6-sol";
declare const OPENAI_GPT_56_TERRA_MODEL_ID = "gpt-5.6-terra";
declare const OPENAI_GPT_56_LUNA_MODEL_ID = "gpt-5.6-luna";
declare const OPENAI_GPT_55_MODEL_ID = "gpt-5.5";
declare const OPENAI_GPT_55_PRO_MODEL_ID = "gpt-5.5-pro";
declare const OPENAI_GPT_54_MODEL_ID = "gpt-5.4";
declare const OPENAI_GPT_54_LEGACY_MODEL_ID = "gpt-5.4-codex";
declare const OPENAI_GPT_54_PRO_MODEL_ID = "gpt-5.4-pro";
declare const OPENAI_GPT_54_MINI_MODEL_ID = "gpt-5.4-mini";
declare const OPENAI_GPT_54_NANO_MODEL_ID = "gpt-5.4-nano";
declare const OPENAI_GPT_53_CODEX_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
declare const OPENAI_GPT_56_VARIANT_MODEL_IDS: readonly [
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
];
/** Models with known first-party Platform and ChatGPT transports. */
declare const OPENAI_DUAL_ROUTE_MODEL_IDS: readonly [
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
  "gpt-5.5",
  "gpt-5.5-pro",
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.4-mini",
];
/** Direct aliases excluded from the ChatGPT catalog. */
declare const OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS: readonly ["chat-latest", "gpt-5.6"];
declare const OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS: readonly ["gpt-5.3-codex-spark"];
/** Modern model refs recognized by the unified OpenAI provider surface. */
declare const OPENAI_PROVIDER_MODERN_MODEL_IDS: readonly [
  "chat-latest",
  "gpt-5.6",
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
  "gpt-5.5",
  "gpt-5.5-pro",
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.4-mini",
  "gpt-5.4-nano",
  "gpt-5.3-codex-spark",
];
declare const OPENAI_CHATGPT_MODERN_MODEL_IDS: readonly [
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
  "gpt-5.5",
  "gpt-5.5-pro",
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.4-mini",
  "gpt-5.3-codex-spark",
];
declare function normalizeOpenAIModelRouteId(value: string | undefined): string;
declare function isOpenAIDualRouteModelId(value: string | undefined): boolean;
declare function isOpenAIPlatformOnlyRouteModelId(value: string | undefined): boolean;
declare function isOpenAISubscriptionOnlyRouteModelId(value: string | undefined): boolean;
//#endregion
export {
  OPENAI_CHATGPT_MODERN_MODEL_IDS,
  OPENAI_CHAT_LATEST_MODEL_ID,
  OPENAI_DUAL_ROUTE_MODEL_IDS,
  OPENAI_GPT_53_CODEX_SPARK_MODEL_ID,
  OPENAI_GPT_54_LEGACY_MODEL_ID,
  OPENAI_GPT_54_MINI_MODEL_ID,
  OPENAI_GPT_54_MODEL_ID,
  OPENAI_GPT_54_NANO_MODEL_ID,
  OPENAI_GPT_54_PRO_MODEL_ID,
  OPENAI_GPT_55_MODEL_ID,
  OPENAI_GPT_55_PRO_MODEL_ID,
  OPENAI_GPT_56_LUNA_MODEL_ID,
  OPENAI_GPT_56_MODEL_ID,
  OPENAI_GPT_56_SOL_MODEL_ID,
  OPENAI_GPT_56_TERRA_MODEL_ID,
  OPENAI_GPT_56_VARIANT_MODEL_IDS,
  OPENAI_PLATFORM_ONLY_ROUTE_MODEL_IDS,
  OPENAI_PROVIDER_MODERN_MODEL_IDS,
  OPENAI_SUBSCRIPTION_ONLY_ROUTE_MODEL_IDS,
  isOpenAIDualRouteModelId,
  isOpenAIPlatformOnlyRouteModelId,
  isOpenAISubscriptionOnlyRouteModelId,
  normalizeOpenAIModelRouteId,
};
