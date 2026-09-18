import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-CYlCpWlu.js";
import { i as resolveGoogleThinkingProfile } from "./provider-policy-7Kv8Y-Tx.js";
import { s as createGoogleThinkingStreamWrapper } from "./provider-stream-shared-CMy-5I0G.js";
import "./thinking-api-BWA2Qah2.js";
import { r as buildProviderToolCompatFamilyHooks } from "./provider-tools-CLA-JkCS.js";
//#region extensions/google/provider-hooks.ts
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
  ...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
  ...buildProviderToolCompatFamilyHooks("gemini"),
  resolveThinkingProfile: (context) => resolveGoogleThinkingProfile(context),
  wrapStreamFn: createGoogleThinkingStreamWrapper,
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS as t };
