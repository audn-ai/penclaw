import {
  i as getRuntimeConfigSnapshot,
  s as getRuntimeConfigSourceSnapshot,
} from "./runtime-snapshot-BbbqRiDR.js";
//#region src/plugins/activation-source-config.ts
/** Resolves the source config snapshot used for plugin activation policy decisions. */
/** Resolves the source config used for plugin activation policy decisions. */
function resolvePluginActivationSourceConfig(params) {
  if (params.activationSourceConfig !== void 0) return params.activationSourceConfig;
  const sourceSnapshot = getRuntimeConfigSourceSnapshot();
  if (sourceSnapshot && params.config === getRuntimeConfigSnapshot()) return sourceSnapshot;
  return params.config ?? {};
}
//#endregion
export { resolvePluginActivationSourceConfig as t };
