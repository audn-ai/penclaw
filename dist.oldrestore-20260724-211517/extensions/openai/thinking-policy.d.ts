import {
  Tt as ProviderDefaultThinkingPolicyContext,
  en as ProviderThinkingProfile,
} from "../../plugin-entry-DPCR66aO.js";

//#region extensions/openai/thinking-policy.d.ts
type OpenAIThinkingCompat = ProviderDefaultThinkingPolicyContext["compat"];
declare function resolveOpenAICodexThinkingProfile(
  modelId: string,
  agentRuntime?: string | null,
  compat?: OpenAIThinkingCompat,
): ProviderThinkingProfile;
declare function resolveUnifiedOpenAIThinkingProfile(
  modelId: string,
  agentRuntime?: string | null,
  compat?: OpenAIThinkingCompat,
): ProviderThinkingProfile;
//#endregion
export { resolveOpenAICodexThinkingProfile, resolveUnifiedOpenAIThinkingProfile };
