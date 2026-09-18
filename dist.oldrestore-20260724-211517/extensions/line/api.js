import { n as lineChannelPluginCommon, t as linePlugin } from "../../channel-B13esVBd.js";
import { n as lineSetupAdapter, t as lineSetupWizard } from "../../setup-surface-C1EZ2f5r.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
  id: "line",
  ...lineChannelPluginCommon,
  setupWizard: lineSetupWizard,
  setup: lineSetupAdapter,
};
//#endregion
export { linePlugin, lineSetupPlugin };
