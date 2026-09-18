import { o as modelSelectionShouldEnsureCodexPlugin } from "./openai-routing-Cu28Ynzk.js";
import { t as createRuntimePluginModelSelectionHelpers } from "./runtime-plugin-install-CWfopkaS.js";
//#region src/commands/codex-runtime-plugin-install.ts
const CODEX_RUNTIME_PLUGIN_ID = "codex";
const CODEX_RUNTIME_PLUGIN_LABEL = "Codex";
const CODEX_RUNTIME_PLUGIN_DESCRIPTOR = {
  pluginId: CODEX_RUNTIME_PLUGIN_ID,
  label: CODEX_RUNTIME_PLUGIN_LABEL,
  npmSpec: "@openclaw/codex",
  warningLabel: CODEX_RUNTIME_PLUGIN_LABEL,
};
const codexRuntimePluginInstall = createRuntimePluginModelSelectionHelpers({
  descriptor: CODEX_RUNTIME_PLUGIN_DESCRIPTOR,
  shouldEnsure: ({ cfg, model, agentId }) =>
    modelSelectionShouldEnsureCodexPlugin({
      config: cfg,
      model,
      agentId,
    }),
});
const codexSupervisionPluginInstall = createRuntimePluginModelSelectionHelpers({
  descriptor: CODEX_RUNTIME_PLUGIN_DESCRIPTOR,
  shouldEnsure: () => true,
});
const ensureCodexRuntimePluginForModelSelection = codexRuntimePluginInstall.ensure;
const repairCodexRuntimePluginInstallForModelSelection = codexRuntimePluginInstall.repair;
codexSupervisionPluginInstall.ensure;
//#endregion
export {
  ensureCodexRuntimePluginForModelSelection as n,
  repairCodexRuntimePluginInstallForModelSelection as r,
  CODEX_RUNTIME_PLUGIN_ID as t,
};
