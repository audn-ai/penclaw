import { t as mergeTelegramAccountConfig } from "./account-config-D_q_Am0A.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import "./account-core-BFxQ_g3t.js";
import { r as resolveDefaultTelegramAccountSelection } from "./account-selection-BgoQbn1V.js";
import { m as mapAllowFromEntries } from "./channel-config-helpers-BFvX3ldW.js";
import { i as createResolvedDirectoryEntriesLister } from "./directory-config-helpers-6PdjajJm.js";
//#region extensions/telegram/src/directory-config.ts
function resolveTelegramDirectoryAccount(cfg, accountId) {
  return {
    config: mergeTelegramAccountConfig(
      cfg,
      accountId?.trim()
        ? normalizeAccountId(accountId)
        : resolveDefaultTelegramAccountSelection(cfg).accountId,
    ),
  };
}
const listTelegramDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
  kind: "user",
  resolveAccount: (cfg, accountId) => resolveTelegramDirectoryAccount(cfg, accountId),
  resolveSources: (account) => [
    mapAllowFromEntries(account.config.allowFrom),
    Object.keys(account.config.dms ?? {}),
  ],
  normalizeId: (entry) => {
    const trimmed = entry.replace(/^(telegram|tg):/i, "").trim();
    if (!trimmed) return null;
    if (/^-?\d+$/.test(trimmed)) return trimmed;
    return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  },
});
const listTelegramDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
  kind: "group",
  resolveAccount: (cfg, accountId) => resolveTelegramDirectoryAccount(cfg, accountId),
  resolveSources: (account) => [Object.keys(account.config.groups ?? {})],
  normalizeId: (entry) => entry.trim() || null,
});
//#endregion
export { listTelegramDirectoryPeersFromConfig as n, listTelegramDirectoryGroupsFromConfig as t };
