import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/plugins/config-helpers.d.ts
/**
 * Updates an account enabled flag in a channel config section.
 */
declare function setAccountEnabledInConfigSection(params: {
  cfg: OpenClawConfig;
  sectionKey: string;
  accountId: string;
  enabled: boolean;
  allowTopLevel?: boolean;
}): OpenClawConfig;
/**
 * Deletes one account from a channel config section, pruning empty channel/accounts objects.
 */
declare function deleteAccountFromConfigSection(params: {
  cfg: OpenClawConfig;
  sectionKey: string;
  accountId: string;
  clearBaseFields?: string[];
}): OpenClawConfig;
/**
 * Clears selected fields from one account entry and reports whether configured data was removed.
 */
declare function clearAccountEntryFields<TAccountEntry extends object>(params: {
  accounts?: Record<string, TAccountEntry>;
  accountId: string;
  fields: string[];
  isValueSet?: (value: unknown) => boolean;
  markClearedOnFieldPresence?: boolean;
}): {
  nextAccounts?: Record<string, TAccountEntry>;
  changed: boolean;
  cleared: boolean;
};
//#endregion
export {
  deleteAccountFromConfigSection as n,
  setAccountEnabledInConfigSection as r,
  clearAccountEntryFields as t,
};
