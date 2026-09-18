import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-CKdZrymL.js";
import {
  F as AUTO_AGENT_RUNTIME_ID,
  l as resolveOpenAIImplicitAgentRuntime,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
//#region src/agents/harness/policy.ts
/** Resolves model/provider/runtime config into the canonical harness runtime id. */
function resolveAgentHarnessPolicy(params) {
  const configured = resolveModelRuntimePolicy({
    config: params.config,
    provider: params.provider,
    modelId: params.modelId,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  const configuredRuntime = normalizeOptionalAgentRuntimeId(configured.policy?.id);
  const runtime =
    configuredRuntime && configuredRuntime !== "default"
      ? configuredRuntime
      : AUTO_AGENT_RUNTIME_ID;
  const runtimeSource = runtime === "auto" ? "implicit" : (configured.source ?? "implicit");
  if (runtime !== "auto")
    return {
      runtime,
      runtimeSource,
    };
  const openAIImplicitRuntime = resolveOpenAIImplicitAgentRuntime({
    provider: params.provider,
    modelId: params.modelId,
    api: params.modelApi,
    baseUrl: params.modelBaseUrl,
    config: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    env: params.env,
    requestTransportOverrides: params.requestTransportOverrides,
  });
  if (openAIImplicitRuntime)
    return {
      runtime: openAIImplicitRuntime,
      runtimeSource,
    };
  return {
    runtime,
    runtimeSource,
  };
}
//#endregion
export { resolveAgentHarnessPolicy as t };
