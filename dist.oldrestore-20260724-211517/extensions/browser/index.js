import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import {
  i as registerBrowserPlugin,
  n as browserPluginReload,
  r as browserSecurityAuditCollectors,
  t as browserPluginNodeHostCommands,
} from "../../plugin-registration-BdR02g9X.js";
//#region extensions/browser/index.ts
/**
 * Browser plugin entry. It wires the browser tool, gateway request handler,
 * node-host command, services, reload policy, and security audit collectors.
 */
/** Main Browser plugin entry for runtime registration. */
var browser_default = definePluginEntry({
  id: "browser",
  name: "Browser",
  description: "Default browser tool plugin",
  reload: browserPluginReload,
  nodeHostCommands: browserPluginNodeHostCommands,
  securityAuditCollectors: [...browserSecurityAuditCollectors],
  register: registerBrowserPlugin,
});
//#endregion
export { browser_default as default };
