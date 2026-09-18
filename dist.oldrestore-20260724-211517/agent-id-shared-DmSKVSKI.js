import "./agent-scope-y9xQv_q1.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-CIJf1lT0.js";
//#region src/gateway/server-methods/agent-id-shared.ts
/**
 * Shared agent-id resolver for request handlers that accept optional agent ids.
 */
function resolveAgentIdOrRespondError(params) {
  const knownAgents = listAgentIds(params.cfg);
  const requestedAgentId = params.normalize(params.rawAgentId) ?? "";
  const agentId = requestedAgentId || resolveDefaultAgentId(params.cfg);
  if (requestedAgentId && !knownAgents.includes(agentId)) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`),
    );
    return null;
  }
  return {
    cfg: params.cfg,
    agentId,
  };
}
//#endregion
export { resolveAgentIdOrRespondError as t };
