import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.js";
//#region src/gateway/conversation-read-origin.ts
/**
 * Resolves one RPC's requested operator origin. Connection metadata is not an
 * authority signal, and a server-attested agent runtime always stays delegated.
 */
function resolveGatewayConversationReadOrigin(params) {
  if (params.client?.internal?.agentRuntimeIdentity) return "delegated";
  return normalizeConversationReadInvocationOrigin(params.requestedOrigin);
}
//#endregion
export { resolveGatewayConversationReadOrigin as t };
