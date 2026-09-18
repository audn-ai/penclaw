import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
//#region extensions/imessage/src/runtime.ts
const {
  getRuntime: getIMessageRuntime,
  setRuntime: setIMessageRuntime,
  tryGetRuntime: getOptionalIMessageRuntime,
} = createPluginRuntimeStore({
  pluginId: "imessage",
  errorMessage: "iMessage runtime not initialized",
});
//#endregion
export { getOptionalIMessageRuntime as n, setIMessageRuntime as r, getIMessageRuntime as t };
