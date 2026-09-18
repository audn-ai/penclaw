import { t as isXaiToolEnabled } from "./tool-auth-shared-B64Ekm8c.js";
//#region extensions/xai/src/code-execution-config.ts
function readCodeExecutionConfigRecord(config) {
  return config && typeof config === "object" ? config : void 0;
}
function readPluginCodeExecutionConfig(cfg) {
  if (!cfg || typeof cfg !== "object") return;
  const entries = cfg.plugins;
  const pluginEntries = entries && typeof entries === "object" ? entries.entries : void 0;
  if (!pluginEntries) return;
  const xaiEntry = pluginEntries.xai;
  if (!xaiEntry || typeof xaiEntry !== "object") return;
  const config = xaiEntry.config;
  if (!config || typeof config !== "object") return;
  const codeExecution = config.codeExecution;
  if (!codeExecution || typeof codeExecution !== "object") return;
  return codeExecution;
}
function resolveCodeExecutionEnabled(params) {
  return isXaiToolEnabled({
    enabled: readCodeExecutionConfigRecord(params.config)?.enabled,
    runtimeConfig: params.runtimeConfig,
    sourceConfig: params.sourceConfig,
    auth: params.auth,
  });
}
//#endregion
export {
  readPluginCodeExecutionConfig as n,
  resolveCodeExecutionEnabled as r,
  readCodeExecutionConfigRecord as t,
};
