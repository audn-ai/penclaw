import "./text-chunking-Dr19ggf-.js";
import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
import "./channel-outbound-DlkFd7rO.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import "./channel-status-B8fwcUOI.js";
import "./channel-actions-C9vNf9jw.js";
import "./channel-inbound-vhkYEe2n.js";
import "./channel-feedback-lNNgzRXo.js";
import "./channel-pairing-1V8FM4wM.js";
import "./webhook-request-guards-B3epkORT.js";
import "./webhook-ingress-BloIhSnv.js";
import "./webhook-targets-CccfOaSB.js";
import "./config-api-D6mpGVOW.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } =
  createPluginRuntimeStore({
    pluginId: "googlechat",
    errorMessage: "Google Chat runtime not initialized",
  });
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
