import { r as logConfigUpdated } from "./logging-C64BTYfR.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { d as updateConfig, t as applyDefaultModelPrimaryUpdate } from "./shared-DFGOIlxJ.js";
//#region src/commands/models/set-image.ts
/** Command for setting the default image model. */
/** Sets agents.defaults.imageModel.primary after resolving aliases/catalog provider aliases. */
async function modelsSetImageCommand(modelRaw, runtime) {
  const updated = await updateConfig((cfg) => {
    return applyDefaultModelPrimaryUpdate({
      cfg,
      modelRaw,
      field: "imageModel",
    });
  });
  logConfigUpdated(runtime);
  runtime.log(
    `Image model: ${resolveAgentModelPrimaryValue(updated.agents?.defaults?.imageModel) ?? modelRaw}`,
  );
}
//#endregion
export { modelsSetImageCommand };
