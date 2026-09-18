import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { i as buildModelAliasIndex } from "./model-selection-shared-BliwFXJy.js";
import "./model-selection-DOlkTrQa.js";
//#region src/auto-reply/reply/directive-handling.defaults.ts
/** Resolve default provider/model plus alias index for directive parsing. */
function resolveDefaultModel(params) {
  const mainModel = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
    allowPluginNormalization: false,
  });
  const defaultProvider = mainModel.provider;
  return {
    defaultProvider,
    defaultModel: mainModel.model,
    aliasIndex: buildModelAliasIndex({
      cfg: params.cfg,
      defaultProvider,
      allowPluginNormalization: false,
    }),
  };
}
//#endregion
export { resolveDefaultModel as t };
