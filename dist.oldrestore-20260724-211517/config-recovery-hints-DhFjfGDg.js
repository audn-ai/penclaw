import { t as formatCliCommand } from "./command-format-H_Arqann.js";
//#region src/cli/config-recovery-hints.ts
/** Hint shown when doctor can migrate or repair an invalid config file. */
function formatInvalidConfigRecoveryHint() {
  return [
    `Run "${formatCliCommand("openclaw doctor --fix")}" to repair, then retry.`,
    "If startup is still blocked, inspect the adjacent .bak backup before restoring it manually.",
  ].join("\n");
}
/** Hint shown when a plugin package is missing its compiled runtime output. */
function formatPluginPackagingRuntimeOutputRecoveryHint() {
  return [
    "This is a plugin packaging issue, not a local config problem.",
    "Update or reinstall the plugin after the publisher ships compiled JavaScript, or disable/uninstall the plugin until then.",
  ].join("\n");
}
//#endregion
export {
  formatPluginPackagingRuntimeOutputRecoveryHint as n,
  formatInvalidConfigRecoveryHint as t,
};
