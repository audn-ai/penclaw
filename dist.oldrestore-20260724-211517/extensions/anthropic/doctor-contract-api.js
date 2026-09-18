//#region extensions/anthropic/doctor-contract-api.ts
/** Anthropic currently has no legacy config migrations. */
const legacyConfigRules = [];
/** Session-route ownership metadata for Anthropic API and Claude CLI sessions. */
const sessionRouteStateOwners = [
  {
    id: "anthropic",
    label: "Anthropic",
    providerIds: ["anthropic", "claude-cli"],
    runtimeIds: ["claude-cli"],
    cliSessionKeys: ["claude-cli"],
    authProfilePrefixes: ["anthropic:", "claude-cli:"],
  },
];
//#endregion
export { legacyConfigRules, sessionRouteStateOwners };
