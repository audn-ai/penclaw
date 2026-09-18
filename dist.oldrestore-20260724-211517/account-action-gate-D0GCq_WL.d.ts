//#region src/channels/plugins/account-action-gate.d.ts
/**
 * Resolves whether an account-scoped action is enabled.
 */
type ActionGate<T extends Record<string, boolean | undefined>> = (
  key: keyof T,
  defaultValue?: boolean,
) => boolean;
/**
 * Creates an action gate where account-specific flags override channel-level defaults.
 */
declare function createAccountActionGate<T extends Record<string, boolean | undefined>>(params: {
  baseActions?: T;
  accountActions?: T;
}): ActionGate<T>;
//#endregion
export { createAccountActionGate as t };
