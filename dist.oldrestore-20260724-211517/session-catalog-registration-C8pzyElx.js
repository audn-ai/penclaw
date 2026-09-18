import { a as registerClaudeSessionCatalog } from "./session-catalog-DNUTK8j6.js";
import { t as createClaudeSessionNodeHostCommands } from "./session-catalog-node-commands-CLficL3t.js";
//#region extensions/anthropic/session-catalog-registration.ts
function isClaudeSessionCatalogEnabled(pluginConfig) {
  if (!pluginConfig || typeof pluginConfig !== "object") return true;
  const sessionCatalog = pluginConfig.sessionCatalog;
  return !(
    sessionCatalog &&
    typeof sessionCatalog === "object" &&
    sessionCatalog.enabled === false
  );
}
function registerClaudeSessionDiscovery(api) {
  if (!isClaudeSessionCatalogEnabled(api.pluginConfig)) return;
  registerClaudeSessionCatalog(api);
  for (const command of createClaudeSessionNodeHostCommands()) api.registerNodeHostCommand(command);
}
//#endregion
export { registerClaudeSessionDiscovery as t };
