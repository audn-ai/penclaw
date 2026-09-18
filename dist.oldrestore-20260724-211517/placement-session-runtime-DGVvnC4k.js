import {
  I as OPENCLAW_AGENT_RUNTIME_ID,
  L as isDefaultAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import { n as resolveSessionModelRef } from "./session-model-ref-1c6_XVhy.js";
import { n as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-DgCFENjt.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-D675lyzz.js";
//#region src/gateway/worker-environments/placement-session-runtime.ts
function resolveWorkerPlacementSessionRuntime(params) {
  const persistedRuntime = resolvePersistedSessionRuntimeId(params.entry);
  if (persistedRuntime && !isDefaultAgentRuntimeId(persistedRuntime)) return persistedRuntime;
  const selectedModel = resolveSessionModelRef(params.cfg, params.entry, params.agentId);
  return resolveEffectiveAgentRuntime({
    cfg: params.cfg,
    provider: selectedModel.provider,
    modelId: selectedModel.model,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
}
function isWorkerPlacementSessionRuntimeSupported(runtime) {
  return runtime === OPENCLAW_AGENT_RUNTIME_ID;
}
//#endregion
export { resolveWorkerPlacementSessionRuntime as n, isWorkerPlacementSessionRuntimeSupported as t };
