import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
//#region extensions/msteams/src/runtime.ts
const {
  setRuntime: setMSTeamsRuntime,
  getRuntime: getMSTeamsRuntime,
  tryGetRuntime: getOptionalMSTeamsRuntime,
} = createPluginRuntimeStore({
  pluginId: "msteams",
  errorMessage: "MSTeams runtime not initialized",
});
//#endregion
export { getOptionalMSTeamsRuntime as n, setMSTeamsRuntime as r, getMSTeamsRuntime as t };
