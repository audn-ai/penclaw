import { en as ProviderThinkingProfile } from "../../plugin-entry-DPCR66aO.js";

//#region extensions/openrouter/thinking-policy.d.ts
declare function supportsOpenRouterXHighThinking(modelId: string): boolean;
declare function resolveOpenRouterThinkingProfile(
  modelId: string,
): ProviderThinkingProfile | undefined;
//#endregion
export { resolveOpenRouterThinkingProfile, supportsOpenRouterXHighThinking };
