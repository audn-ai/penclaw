import {
  n as resolveProviderPluginChoice$1,
  r as runProviderModelSelectedHook$1,
} from "./provider-wizard-DNghM98m.js";
import { n as resolvePluginProviders$1 } from "./providers.runtime-Cmp9Ggnk.js";
import { r as resolvePluginSetupProvider$1 } from "./setup-registry-B--wI5Zy.js";
//#region src/plugins/provider-auth-choice.runtime.ts
/** Runtime wrapper for provider plugin wizard choice resolution. */
function resolveProviderPluginChoice(...args) {
  return resolveProviderPluginChoice$1(...args);
}
/** Runtime wrapper for provider model-selected hook dispatch. */
function runProviderModelSelectedHook(...args) {
  return runProviderModelSelectedHook$1(...args);
}
/** Runtime wrapper for registered model provider discovery. */
function resolvePluginProviders(...args) {
  return resolvePluginProviders$1(...args);
}
/** Runtime wrapper for plugin setup-provider discovery. */
function resolvePluginSetupProvider(...args) {
  return resolvePluginSetupProvider$1(...args);
}
//#endregion
export {
  runProviderModelSelectedHook as i,
  resolvePluginSetupProvider as n,
  resolveProviderPluginChoice as r,
  resolvePluginProviders as t,
};
