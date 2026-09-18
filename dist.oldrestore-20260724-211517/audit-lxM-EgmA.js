import { t as inspectDiscordAccount } from "./account-inspect-BcQfhg2x.js";
import {
  n as collectDiscordAuditChannelIdsForAccount,
  t as auditDiscordChannelPermissionsWithFetcher,
} from "./audit-core-yppuxs_r.js";
import "./send-BrvWC0qr.js";
import { O as fetchChannelPermissionsDiscord } from "./send.shared-Ciix19qx.js";
//#region extensions/discord/src/audit.ts
function collectDiscordAuditChannelIds(params) {
  return collectDiscordAuditChannelIdsForAccount(
    inspectDiscordAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }).config,
  );
}
async function auditDiscordChannelPermissions(params) {
  return await auditDiscordChannelPermissionsWithFetcher({
    ...params,
    fetchChannelPermissions: fetchChannelPermissionsDiscord,
  });
}
//#endregion
export { collectDiscordAuditChannelIds as n, auditDiscordChannelPermissions as t };
