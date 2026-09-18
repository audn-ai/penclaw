import {
  n as normalizeAccountId,
  r as normalizeOptionalAccountId,
  t as DEFAULT_ACCOUNT_ID,
} from "./account-id-C7N4Rwku.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-DgErwy8P.js";
import { n as resolveDefaultTelegramAccountId } from "./account-selection-BgoQbn1V.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-DVV0zYUk.js";
import { a as tryReadSecretFileSync } from "./secret-file-C3z_7aGt.js";
import "./number-runtime-B-n-wjMn.js";
import "./account-core-BFxQ_g3t.js";
import "./channel-core-Z_rV5hXh.js";
import "./provider-auth-mypr64nh.js";
import "./routing-CwvmVRHd.js";
import "./secret-input-D1aG0n6v.js";
import {
  _ as resolveSecretInputString,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region extensions/telegram/src/token.ts
function resolveTelegramBotUserIdFromToken(token) {
  const rawBotId = token?.trim().split(":", 1)[0];
  if (!rawBotId || !/^\d+$/.test(rawBotId)) return;
  return parseStrictPositiveInteger(rawBotId);
}
function resolveEnvSecretRefValue(params) {
  const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
  if (providerConfig) {
    if (providerConfig.source !== "env")
      throw new Error(
        `Secret provider "${params.provider}" has source "${providerConfig.source}" but ref requests "env".`,
      );
    if (providerConfig.allowlist && !providerConfig.allowlist.includes(params.id))
      throw new Error(
        `Environment variable "${params.id}" is not allowlisted in secrets.providers.${params.provider}.allowlist.`,
      );
  } else if (
    params.provider !== resolveDefaultSecretProviderAlias({ secrets: params.cfg?.secrets }, "env")
  )
    throw new Error(
      `Secret provider "${params.provider}" is not configured (ref: env:${params.provider}:${params.id}).`,
    );
  return normalizeSecretInputString((params.env ?? process.env)[params.id]);
}
function resolveRuntimeTokenValue(params) {
  const resolved = resolveSecretInputString({
    value: params.value,
    path: params.path,
    defaults: params.cfg?.secrets?.defaults,
    mode: "inspect",
  });
  if (resolved.status === "available")
    return {
      status: "available",
      value: resolved.value,
    };
  if (resolved.status === "missing") return { status: "missing" };
  if (resolved.ref.source === "env") {
    const envValue = resolveEnvSecretRefValue({
      cfg: params.cfg,
      provider: resolved.ref.provider,
      id: resolved.ref.id,
    });
    if (envValue)
      return {
        status: "available",
        value: envValue,
      };
    return { status: "configured_unavailable" };
  }
  resolveSecretInputString({
    value: params.value,
    path: params.path,
    defaults: params.cfg?.secrets?.defaults,
    mode: "strict",
  });
  return { status: "configured_unavailable" };
}
function resolveTelegramToken(cfg, opts = {}) {
  const accountId =
    normalizeOptionalAccountId(opts.accountId) ??
    (cfg ? resolveDefaultTelegramAccountId(cfg) : "default");
  const telegramCfg = cfg?.channels?.telegram;
  const resolveAccountCfg = (id) => {
    const accounts = telegramCfg?.accounts;
    return Array.isArray(accounts)
      ? void 0
      : resolveNormalizedAccountEntry(accounts, id, normalizeAccountId);
  };
  const accountCfg = resolveAccountCfg(accountId !== "default" ? accountId : DEFAULT_ACCOUNT_ID);
  if (accountId !== "default" && !accountCfg) {
    const accounts = telegramCfg?.accounts;
    if (
      Boolean(accounts) &&
      typeof accounts === "object" &&
      !Array.isArray(accounts) &&
      Object.keys(accounts).length > 0
    ) {
      opts.logMissingFile?.(
        `channels.telegram.accounts: unknown accountId "${accountId}" — not found in config, refusing channel-level fallback`,
      );
      return {
        token: "",
        source: "none",
      };
    }
  }
  const accountTokenFile = accountCfg?.tokenFile?.trim();
  if (accountTokenFile) {
    const token = tryReadSecretFileSync(
      accountTokenFile,
      `channels.telegram.accounts.${accountId}.tokenFile`,
      { rejectSymlink: true },
    );
    if (token)
      return {
        token,
        source: "tokenFile",
      };
    opts.logMissingFile?.(
      `channels.telegram.accounts.${accountId}.tokenFile not found or unreadable: ${accountTokenFile}`,
    );
    return {
      token: "",
      source: "none",
    };
  }
  const accountToken = resolveRuntimeTokenValue({
    cfg,
    value: accountCfg?.botToken,
    path: `channels.telegram.accounts.${accountId}.botToken`,
  });
  if (accountToken.status === "available")
    return {
      token: accountToken.value,
      source: "config",
    };
  if (accountToken.status === "configured_unavailable")
    return {
      token: "",
      source: "none",
    };
  const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
  const tokenFile = telegramCfg?.tokenFile?.trim();
  if (tokenFile) {
    const token = tryReadSecretFileSync(tokenFile, "channels.telegram.tokenFile", {
      rejectSymlink: true,
    });
    if (token)
      return {
        token,
        source: "tokenFile",
      };
    opts.logMissingFile?.(`channels.telegram.tokenFile not found or unreadable: ${tokenFile}`);
    return {
      token: "",
      source: "none",
    };
  }
  const configToken = resolveRuntimeTokenValue({
    cfg,
    value: telegramCfg?.botToken,
    path: "channels.telegram.botToken",
  });
  if (configToken.status === "available")
    return {
      token: configToken.value,
      source: "config",
    };
  if (configToken.status === "configured_unavailable")
    return {
      token: "",
      source: "none",
    };
  const envToken = allowEnv ? (opts.envToken ?? process.env.TELEGRAM_BOT_TOKEN)?.trim() : "";
  if (envToken)
    return {
      token: envToken,
      source: "env",
    };
  return {
    token: "",
    source: "none",
  };
}
//#endregion
export { resolveTelegramToken as n, resolveTelegramBotUserIdFromToken as t };
