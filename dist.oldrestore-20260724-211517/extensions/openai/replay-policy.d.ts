import {
  Ht as ProviderReplayPolicy,
  Ut as ProviderReplayPolicyContext,
} from "../../plugin-entry-DPCR66aO.js";

//#region extensions/openai/replay-policy.d.ts
/**
 * Returns the provider-owned replay policy for OpenAI-family transports.
 */
declare function buildOpenAIReplayPolicy(ctx: ProviderReplayPolicyContext): ProviderReplayPolicy;
//#endregion
export { buildOpenAIReplayPolicy };
