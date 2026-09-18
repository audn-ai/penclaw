import {
  Jt as ProviderResolveTransportTurnStateContext,
  Xt as ProviderResolveWebSocketSessionPolicyContext,
  an as ProviderWebSocketSessionPolicy,
  nn as ProviderTransportTurnState,
} from "../../plugin-entry-DPCR66aO.js";

//#region extensions/openai/transport-policy.d.ts
declare function resolveOpenAITransportTurnState(
  ctx: ProviderResolveTransportTurnStateContext,
): ProviderTransportTurnState | undefined;
declare function resolveOpenAIWebSocketSessionPolicy(
  ctx: ProviderResolveWebSocketSessionPolicyContext,
): ProviderWebSocketSessionPolicy | undefined;
//#endregion
export { resolveOpenAITransportTurnState, resolveOpenAIWebSocketSessionPolicy };
