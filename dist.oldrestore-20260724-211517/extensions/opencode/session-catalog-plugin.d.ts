import {
  C as OpenClawPluginNodeInvokePolicy,
  g as OpenClawPluginApi,
  x as OpenClawPluginNodeHostCommand,
} from "../../plugin-entry-DPCR66aO.js";
import {
  c as OPENCODE_TERMINAL_RESUME_COMMAND,
  i as OPENCODE_SESSIONS_LIST_COMMAND,
  s as OPENCODE_SESSION_READ_COMMAND,
} from "../../session-catalog-shared-DRKwthdl.js";

//#region extensions/opencode/session-catalog-plugin.d.ts
declare function isOpenCodeSessionCatalogEnabled(pluginConfig: unknown): boolean;
declare function createOpenCodeSessionNodeHostCommands(): OpenClawPluginNodeHostCommand[];
declare function createOpenCodeSessionNodeInvokePolicies(): OpenClawPluginNodeInvokePolicy[];
declare function registerOpenCodeSessionCatalog(api: OpenClawPluginApi): void;
//#endregion
export {
  OPENCODE_SESSIONS_LIST_COMMAND,
  OPENCODE_SESSION_READ_COMMAND,
  OPENCODE_TERMINAL_RESUME_COMMAND,
  createOpenCodeSessionNodeHostCommands,
  createOpenCodeSessionNodeInvokePolicies,
  isOpenCodeSessionCatalogEnabled,
  registerOpenCodeSessionCatalog,
};
