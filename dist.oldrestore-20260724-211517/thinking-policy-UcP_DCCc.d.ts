import {
  Tt as ProviderDefaultThinkingPolicyContext,
  en as ProviderThinkingProfile,
} from "./plugin-entry-DPCR66aO.js";

//#region extensions/vllm/thinking-policy.d.ts
type VllmQwenThinkingFormat = "chat-template" | "top-level";
declare function resolveVllmQwenThinkingFormatFromCompat(
  compat?: ProviderDefaultThinkingPolicyContext["compat"],
): VllmQwenThinkingFormat | undefined;
declare function resolveThinkingProfile(
  ctx: ProviderDefaultThinkingPolicyContext,
): ProviderThinkingProfile | null;
//#endregion
export {
  resolveThinkingProfile as n,
  resolveVllmQwenThinkingFormatFromCompat as r,
  VllmQwenThinkingFormat as t,
};
