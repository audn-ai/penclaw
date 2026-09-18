import { ht as ProviderAuthMethod } from "../../plugin-entry-DPCR66aO.js";
import { an as ProviderPlugin } from "../../types-Ga3mNO_F.js";
//#region extensions/openai/openai-chatgpt-provider.d.ts
declare function buildOpenAIChatGPTAuthMethods(): ProviderAuthMethod[];
declare function buildOpenAICodexProviderHooks(): Pick<
  ProviderPlugin,
  | "resolveDynamicModel"
  | "buildAuthDoctorHint"
  | "resolveThinkingProfile"
  | "isModernModelRef"
  | "preferRuntimeResolvedModel"
  | "normalizeResolvedModel"
  | "normalizeTransport"
  | "resolveUsageAuth"
  | "fetchUsageSnapshot"
  | "refreshOAuth"
  | "augmentModelCatalog"
  | "resolveReasoningOutputMode"
>;
//#endregion
export { buildOpenAIChatGPTAuthMethods, buildOpenAICodexProviderHooks };
