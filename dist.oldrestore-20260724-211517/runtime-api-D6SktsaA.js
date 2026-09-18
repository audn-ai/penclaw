import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
import "./channel-outbound-DlkFd7rO.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./channel-inbound-vhkYEe2n.js";
import "./channel-pairing-1V8FM4wM.js";
//#region extensions/nextcloud-talk/src/runtime.ts
const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } =
  createPluginRuntimeStore({
    pluginId: "nextcloud-talk",
    errorMessage: "Nextcloud Talk runtime not initialized",
  });
//#endregion
export { setNextcloudTalkRuntime as n, getNextcloudTalkRuntime as t };
