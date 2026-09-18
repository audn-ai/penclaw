import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { a as modelSupportsVision, n as loadModelCatalog } from "./model-catalog-DxYvPELu.js";
import { C as findModelInCatalog } from "./model-selection-shared-BliwFXJy.js";
import "./agent-runtime-BiQiwmwD.js";
//#region extensions/telegram/src/sticker-vision.runtime.ts
async function resolveStickerVisionSupportRuntime(params) {
  const catalog = await loadModelCatalog({ config: params.cfg });
  const defaultModel = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
  if (!entry) return false;
  return modelSupportsVision(entry);
}
//#endregion
export { resolveStickerVisionSupportRuntime };
