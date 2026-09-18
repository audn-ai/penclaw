import "./agent-scope-y9xQv_q1.js";
import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
//#region src/agents/tool-loop-detection-config.ts
/** Resolves effective tool loop-detection config by overlaying agent settings on globals. */
function resolveToolLoopDetectionConfig(params) {
  const global = params.cfg?.tools?.loopDetection;
  const agent =
    params.agentId && params.cfg
      ? resolveAgentConfig(params.cfg, params.agentId)?.tools?.loopDetection
      : void 0;
  if (!agent) return global;
  if (!global) return agent;
  return {
    ...global,
    ...agent,
    detectors: {
      ...global.detectors,
      ...agent.detectors,
    },
    postCompactionGuard: {
      ...global.postCompactionGuard,
      ...agent.postCompactionGuard,
    },
  };
}
//#endregion
export { resolveToolLoopDetectionConfig as t };
