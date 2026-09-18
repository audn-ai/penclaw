import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-Ca6zEZc0.js";
import { l as getModelsCommandSecretTargetIds } from "./command-secret-targets-Dm7sNhry.js";
import "./config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  s as getRuntimeConfigSourceSnapshot,
  x as setRuntimeConfigSnapshot,
} from "./runtime-snapshot-BbbqRiDR.js";
//#region src/commands/models/load-config.ts
/** Config loader for model commands with command-scoped secret resolution. */
/** Loads config, resolves model command secrets, and preserves the source snapshot. */
async function loadModelsConfigWithSource(params) {
  const runtimeConfig = getRuntimeConfig();
  const sourceConfig = getRuntimeConfigSourceSnapshot() ?? runtimeConfig;
  const { resolvedConfig, diagnostics } = await resolveCommandConfigWithSecrets({
    config: runtimeConfig,
    commandName: params.commandName,
    targetIds: getModelsCommandSecretTargetIds(),
    runtime: params.runtime,
  });
  setRuntimeConfigSnapshot(resolvedConfig, sourceConfig);
  return {
    sourceConfig,
    resolvedConfig,
    diagnostics,
  };
}
/** Loads the resolved model command config when callers do not need source metadata. */
async function loadModelsConfig(params) {
  return (await loadModelsConfigWithSource(params)).resolvedConfig;
}
//#endregion
export { loadModelsConfigWithSource as n, loadModelsConfig as t };
