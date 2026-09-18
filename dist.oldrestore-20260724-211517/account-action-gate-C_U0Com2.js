//#region src/channels/plugins/account-action-gate.ts
/**
 * Creates an action gate where account-specific flags override channel-level defaults.
 */
function createAccountActionGate(params) {
  return (key, defaultValue = true) => {
    const accountValue = params.accountActions?.[key];
    if (accountValue !== void 0) return accountValue;
    const baseValue = params.baseActions?.[key];
    if (baseValue !== void 0) return baseValue;
    return defaultValue;
  };
}
//#endregion
export { createAccountActionGate as t };
