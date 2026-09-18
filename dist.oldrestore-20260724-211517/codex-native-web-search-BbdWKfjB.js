import {
  n as hasAvailableCodexAuth,
  r as isCodexNativeSearchEligibleModel,
} from "./codex-native-web-search-core-DGXC1P49.js";
import "./model-selection-DOlkTrQa.js";
import { n as resolveCodexNativeWebSearchConfig } from "./codex-native-web-search.shared-D7KzlpGf.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
//#region src/agents/codex-native-web-search.ts
/** True when Codex native web search should appear relevant for an agent. */
function isCodexNativeWebSearchRelevant(params) {
  if (resolveCodexNativeWebSearchConfig(params.config).enabled) return true;
  if (hasAvailableCodexAuth(params)) return true;
  const defaultModel = resolveDefaultModelForAgent({
    cfg: params.config,
    agentId: params.agentId,
  });
  const configuredProvider = params.config.models?.providers?.[defaultModel.provider];
  const configuredModelApi = configuredProvider?.models?.find(
    (candidate) => candidate.id === defaultModel.model,
  )?.api;
  return isCodexNativeSearchEligibleModel({
    modelProvider: defaultModel.provider,
    modelApi: configuredModelApi ?? configuredProvider?.api,
  });
}
//#endregion
export { isCodexNativeWebSearchRelevant as t };
