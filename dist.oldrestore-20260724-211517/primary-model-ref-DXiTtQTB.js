import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import "./defaults-CdX9UGcX.js";
import { c as parseModelRef } from "./model-selection-normalize-BoKGJiBx.js";
//#region src/commands/doctor/shared/primary-model-ref.ts
function resolveDoctorPrimaryModelRef(cfg, agentModel) {
  return (
    parseModelRef(
      resolveAgentModelPrimaryValue(agentModel) ??
        resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) ??
        "gpt-5.6-sol",
      "openai",
      { allowPluginNormalization: false },
    ) ?? {
      provider: "openai",
      model: "gpt-5.6-sol",
    }
  );
}
//#endregion
export { resolveDoctorPrimaryModelRef as t };
