import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import {
  a as mergeDiscordAccountConfig,
  l as resolveDiscordAccountConfig,
  o as resolveDefaultDiscordAccountId,
} from "./accounts-BNPpAWWI.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./secret-input-D1aG0n6v.js";
import {
  c as hasConfiguredSecretInput,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region extensions/discord/src/account-token-inspect.ts
function inspectDiscordConfiguredToken(value) {
  const normalized = normalizeSecretInputString(value);
  if (normalized)
    return {
      token: normalized.replace(/^Bot\s+/i, ""),
      tokenSource: "config",
      tokenStatus: "available",
    };
  if (hasConfiguredSecretInput(value))
    return {
      token: "",
      tokenSource: "config",
      tokenStatus: "configured_unavailable",
    };
  return null;
}
//#endregion
//#region extensions/discord/src/account-inspect.ts
function inspectDiscordAccount(params) {
  const accountId = normalizeAccountId(
    params.accountId ?? resolveDefaultDiscordAccountId(params.cfg),
  );
  const merged = mergeDiscordAccountConfig(params.cfg, accountId);
  const enabled = params.cfg.channels?.discord?.enabled !== false && merged.enabled !== false;
  const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
  const hasAccountToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "token"));
  const accountToken = inspectDiscordConfiguredToken(accountConfig?.token);
  if (accountToken)
    return {
      accountId,
      enabled,
      name: normalizeOptionalString(merged.name),
      token: accountToken.token,
      tokenSource: accountToken.tokenSource,
      tokenStatus: accountToken.tokenStatus,
      configured: true,
      config: merged,
    };
  if (hasAccountToken)
    return {
      accountId,
      enabled,
      name: normalizeOptionalString(merged.name),
      token: "",
      tokenSource: "none",
      tokenStatus: "missing",
      configured: false,
      config: merged,
    };
  const channelToken = inspectDiscordConfiguredToken(params.cfg.channels?.discord?.token);
  if (channelToken)
    return {
      accountId,
      enabled,
      name: normalizeOptionalString(merged.name),
      token: channelToken.token,
      tokenSource: channelToken.tokenSource,
      tokenStatus: channelToken.tokenStatus,
      configured: true,
      config: merged,
    };
  const envToken =
    accountId === "default"
      ? normalizeSecretInputString(params.envToken ?? process.env.DISCORD_BOT_TOKEN)
      : void 0;
  if (envToken)
    return {
      accountId,
      enabled,
      name: normalizeOptionalString(merged.name),
      token: envToken.replace(/^Bot\s+/i, ""),
      tokenSource: "env",
      tokenStatus: "available",
      configured: true,
      config: merged,
    };
  return {
    accountId,
    enabled,
    name: normalizeOptionalString(merged.name),
    token: "",
    tokenSource: "none",
    tokenStatus: "missing",
    configured: false,
    config: merged,
  };
}
//#endregion
export { inspectDiscordConfiguredToken as n, inspectDiscordAccount as t };
